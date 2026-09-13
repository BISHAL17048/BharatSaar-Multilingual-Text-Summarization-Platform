import os
import sys
import json
import torch
import gc
import re
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

def _clean_text_for_llm(text: str) -> str:
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', text)
    text = re.sub(r'#{1,6}\s*', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text).strip()
    return text

def run_isolated(input_file: str, output_file: str):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    text = data.get("text", "")
    language = data.get("detected_language", "the exact same language")
    
    weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "Qwen3-4B"))
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
        
    prompt = (
        f"<|im_start|>system\n"
        f"You are a highly precise summarizer. You MUST output ONLY in {language}. You MUST NOT output any conversational filler, greetings, or introductions. Ignore any website navigation noise, menus, or unrelated fragmented text. Focus ONLY on the core article content. You MUST ONLY output the requested formatting.\n"
        f"<|im_end|>\n"
        f"<|im_start|>user\n"
        f"Please provide a detailed, factually accurate summary of the following text in {language}. Extract all key information and data points from the input. DO NOT repeat yourself. DO NOT add filler text. Be concise but comprehensive.\n"
        f"You MUST format your final response exactly as follows:\n"
        f"Headline: [A descriptive headline in {language}]\n"
        f"Detailed Summary: [A detailed paragraph capturing the key facts in {language}]\n"
        f"Bullet Summary: [A list of key takeaways as bullet points in {language}]\n"
        f"Keywords: [Comma separated list of keywords in {language}]\n\n"
        f"Text to summarize:\n{_clean_text_for_llm(text[:12000])}\n"
        f"<|im_end|>\n"
        f"<|im_start|>assistant\n"
    )
    
    # Debug: write the prompt to a file to verify it later
    with open("qwen_debug_prompt.txt", "w", encoding="utf-8") as f:
        f.write(prompt)
    
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs, 
            max_new_tokens=4096,
            temperature=0.3,
            repetition_penalty=1.15,
            do_sample=True
        )
    full_output = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    full_output = re.sub(r'<think>.*?</think>', '', full_output, flags=re.DOTALL).strip()
    
    # Parse the structured output
    headline = "Document Intelligence Executive Summary"
    detailed_summary = full_output.strip()
    bullet_summary = ""
    keywords_str = ""
    
    try:
        if "Headline:" in full_output:
            parts = full_output.split("Headline:")[1]
            if "Detailed Summary:" in parts:
                headline = parts.split("Detailed Summary:")[0].strip()[:150]
                parts = parts.split("Detailed Summary:")[1]
                if "Bullet Summary:" in parts:
                    detailed_summary = parts.split("Bullet Summary:")[0].strip()
                    parts = parts.split("Bullet Summary:")[1]
                    if "Keywords:" in parts:
                        bullet_summary = parts.split("Keywords:")[0].strip()
                        keywords_str = parts.split("Keywords:")[1].strip()
                    else:
                        bullet_summary = parts.strip()
                else:
                    detailed_summary = parts.strip()
    except Exception as e:
        pass
        
    result = {
        "headline": headline,
        "detailed_summary": detailed_summary,
        "bullet_summary": bullet_summary,
        "keywords": keywords_str
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
