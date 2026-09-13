import os
import sys
import json
import torch
import gc
import tempfile
import subprocess
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

def run_sarvam_isolated(input_file: str, output_file: str):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    tasks = data.get("tasks", [])
    if not tasks:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({"results": {}}, f, ensure_ascii=False)
        return

    weights_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "sarvam-translate"
    ))
    
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    print(f"[Sarvam-Isolated] Loading model from {weights_path} on {device}...")
    
    tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True)

    if torch.cuda.is_available():
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )
        model = AutoModelForCausalLM.from_pretrained(
            weights_path,
            local_files_only=True,
            quantization_config=bnb_config,
            device_map="cuda:0",
            low_cpu_mem_usage=True
        )
    else:
        model = AutoModelForCausalLM.from_pretrained(
            weights_path,
            local_files_only=True,
            torch_dtype=torch.float32,
            low_cpu_mem_usage=True
        )
        
    print("[Sarvam-Isolated] Model loaded successfully. Processing tasks...")

    def _single_translate(text_str: str, target_lang: str) -> str:
        if not text_str.strip():
            return ""
        messages = [
            {"role": "system", "content": f"Translate the text below to {target_lang}."},
            {"role": "user", "content": text_str}
        ]
        formatted = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = tokenizer([formatted], return_tensors="pt").to(model.device)
        with torch.no_grad():
            generated_ids = model.generate(
                **inputs,
                max_new_tokens=1024,
                do_sample=True,
                temperature=0.01,
                num_return_sequences=1
            )
        output_ids = generated_ids[0][len(inputs.input_ids[0]):].tolist()
        return tokenizer.decode(output_ids, skip_special_tokens=True)

    results = {}
    for task in tasks:
        task_id = task.get("id")
        text = task.get("text", "")
        target_lang = task.get("target_language", "English")
        source_lang = task.get("source_language")

        if not text.strip():
            results[task_id] = ""
            continue

        # Check if Indic-to-Indic requires an English pivot
        english_names = ("English", "eng_Latn", "en")
        if source_lang and source_lang not in english_names and target_lang not in english_names:
            eng_intermediate = _single_translate(text, "English")
            final_translation = _single_translate(eng_intermediate, target_lang)
            results[task_id] = final_translation
        else:
            results[task_id] = _single_translate(text, target_lang)

    print(f"[Sarvam-Isolated] Completed {len(results)} tasks successfully.")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({"results": results}, f, ensure_ascii=False)


def load_and_run_sarvam_isolated(tasks: list) -> dict:
    """Helper invoked by Celery workers to run Sarvam in a detached subprocess."""
    if not tasks:
        return {}

    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as fin:
        json.dump({"tasks": tasks}, fin, ensure_ascii=False)
        input_file = fin.name

    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as fout:
        output_file = fout.name

    script_path = os.path.abspath(__file__)

    try:
        env = os.environ.copy()
        result = subprocess.run(
            [sys.executable, script_path, input_file, output_file],
            capture_output=True,
            text=True,
            env=env,
            timeout=600
        )
        if result.returncode != 0:
            print(f"[Sarvam-Isolated] Process failed with exit code {result.returncode}")
            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            return {}

        with open(output_file, 'r', encoding='utf-8') as f:
            out_data = json.load(f)
        return out_data.get("results", {})

    except Exception as e:
        print(f"[Sarvam-Isolated] Error running subprocess: {e}")
        return {}
    finally:
        for p in (input_file, output_file):
            try:
                if os.path.exists(p):
                    os.remove(p)
            except Exception:
                pass


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python run_sarvam_isolated.py <input_json> <output_json>")
        sys.exit(1)
    run_sarvam_isolated(sys.argv[1], sys.argv[2])
