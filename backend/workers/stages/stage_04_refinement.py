import os
import gc
import re
import torch
import concurrent.futures
import sys
import tempfile
import subprocess
import json
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job
from models.job import JobStatus
from transformers import AutoModelForCausalLM, AutoTokenizer

# Timeout for CPU inference (seconds). Qwen3-1.7B ~90s on fast CPU for 512 tokens
REFINEMENT_TIMEOUT = 180

def load_and_run_qwen_refinement_isolated(text: str) -> str:
    print(f"Delegating Qwen3-1.7B Refinement to isolated subprocess...")
    
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as fin:
        json.dump({"text": text}, fin, ensure_ascii=False)
        input_file = fin.name
        
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json', encoding='utf-8') as fout:
        output_file = fout.name
        
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "run_qwen_refinement_isolated.py"))
    
    try:
        env = os.environ.copy()
        result = subprocess.run([sys.executable, script_path, input_file, output_file], capture_output=True, text=True, env=env)
        
        if result.returncode != 0:
            print(f"Isolated Qwen3-1.7B failed with exit code {result.returncode}")
            print("STDOUT:", result.stdout)
            print("STDERR:", result.stderr)
            return text
            
        with open(output_file, 'r', encoding='utf-8') as f:
            out_data = json.load(f)
            
        return out_data.get("refined_text", text)
        
    except Exception as e:
        print(f"Error calling isolated Qwen3-1.7B: {e}")
        return text
    finally:
        try:
            if os.path.exists(input_file):
                os.remove(input_file)
            if os.path.exists(output_file):
                os.remove(output_file)
        except:
            pass

def load_and_run_indicxlit(text: str, target_lang: str) -> str:
    supported_xlit = ["as", "bn", "gu", "hi", "kn", "ml", "mr", "or", "pa", "sa", "ta", "te", "ur"]
    if target_lang not in supported_xlit:
        return text
        
    weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "IndicXlit"))
    if not os.path.exists(weights_path):
        return text
        
    print(f"Loading IndicXlit (Roman -> {target_lang.upper()}) from {weights_path}...")
    tokenizer = None
    model = None
    try:
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
        # IndicXlit uses specific language codes like hi_IN, as_IN etc.
        tgt_code = f"{target_lang}_IN"
        tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True, use_fast=False)
        device = "cuda" if torch.cuda.is_available() else "cpu"
        model = AutoModelForSeq2SeqLM.from_pretrained(weights_path, local_files_only=True).to(device)
        
        # We only transliterate English alphabetic words to preserve native text
        def transliterate_word(word):
            if re.match(r'^[a-zA-Z]+$', word):
                inputs = tokenizer(word, return_tensors="pt").to(device)
                with torch.no_grad():
                    outputs = model.generate(**inputs, max_length=20, num_beams=4)
                return tokenizer.decode(outputs[0], skip_special_tokens=True)
            return word

        words = text.split()
        transliterated = [transliterate_word(w) for w in words]
        return " ".join(transliterated)
    except Exception as e:
        print(f"IndicXlit transliteration failed: {e}")
        return text
    finally:
        if model is not None:
            del model
        if tokenizer is not None:
            del tokenizer
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

@celery_app.task(bind=True, name="stages.refinement")
def run_refinement(self, previous_result: dict):
    job_id = previous_result["job_id"]
    sync_update_job(job_id, JobStatus.PROCESSING, "LLM Refinement & Transliteration", 60)
    
    text = previous_result.get("raw_text", "")
    if not text:
        text = previous_result.get("text", "")
        
    if not text.strip():
        previous_result["refined_text"] = ""
        return previous_result
        
    language_code = previous_result.get("language_meta", {}).get("language_code", "en")
    
    # 1. Transliteration (Roman -> Native Script)
    try:
        text = load_and_run_indicxlit(text, language_code)
    except Exception as e:
        print(f"Transliteration stage error: {e}")

    # 2. Spelling, Grammar & Punctuation
    try:
        text = load_and_run_qwen_refinement_isolated(text)
    except Exception as e:
        print(f"Refinement stage error: {e}")
        
    previous_result["refined_text"] = text

    return previous_result
