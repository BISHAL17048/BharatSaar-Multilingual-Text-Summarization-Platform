import os
import sys
import json
import torch
import gc
import re
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

def _clean_text_for_llm(text: str) -> str:
    """Strip markdown syntax and navigation noise before feeding to LLM."""
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', text)
    text = re.sub(r'#{1,6}\s*', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text

def run_isolated(input_file: str, output_file: str):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    text = data.get("text", "")
    
    weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "Qwen3-1.7B"))
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True)
    
    if device == "cuda":
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
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

    clean = _clean_text_for_llm(text[:8000])
    prompt = (
        f"<|im_start|>system\n"
        f"You are a helpful text refinement assistant. Fix spelling and grammar. DO NOT summarize. If the text is in a language you don't understand well, just output the exact original text.\n"
        f"<|im_end|>\n"
        f"<|im_start|>user\n"
        f"Please correct the grammar and punctuation of this text:\n\n{clean}\n"
        f"<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=2048,
            temperature=0.1,
            repetition_penalty=1.1,
            do_sample=False,
        )
        
    refined_text = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True).strip()
    
    # If the model corrupted the text or hallucinated too much, fallback to original
    if len(refined_text) < 100 or '' in refined_text:
        refined_text = clean
    
    result = {
        "refined_text": refined_text
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False)

    del model
    del tokenizer
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(1)
    run_isolated(sys.argv[1], sys.argv[2])
