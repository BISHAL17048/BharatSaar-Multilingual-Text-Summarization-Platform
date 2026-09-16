import os
import sys
import json
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

WEIGHTS_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..', '..', '..', 'model_server', 'weights', 'sarvam-translate')
)

def _translate_once(model, tokenizer, text: str, target_language: str) -> str:
    if not text or not text.strip():
        return ''
    messages = [
        {'role': 'system', 'content': f'Translate the text below to {target_language}.'},
        {'role': 'user',   'content': text}
    ]
    formatted = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer([formatted], return_tensors='pt').to(model.device)
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

def run_isolated(input_file: str, output_file: str):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    texts           = data.get('texts', [])
    target_language = data.get('target_language', 'English')
    source_lang     = data.get('source_lang', 'eng_Latn')

    is_indic_to_indic = (
        source_lang != 'eng_Latn' and
        target_language.lower() not in ('english',)
    )

    print(f'[Sarvam] Loading sarvam-translate on cuda:0 (4-bit NF4)...')
    tokenizer = AutoTokenizer.from_pretrained(WEIGHTS_PATH, local_files_only=True)
    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type='nf4',
        bnb_4bit_compute_dtype=torch.bfloat16
    )
    model = AutoModelForCausalLM.from_pretrained(
        WEIGHTS_PATH,
        local_files_only=True,
        quantization_config=bnb_config,
        device_map='cuda:0',
        low_cpu_mem_usage=True
    )
    model.eval()
    print(f'[Sarvam] Model on {model.device}. VRAM: {torch.cuda.memory_allocated()/1e9:.2f} GB')

    translations = []
    for i, text in enumerate(texts):
        print(f'[Sarvam] Translating {i+1}/{len(texts)}...')
        if is_indic_to_indic:
            english = _translate_once(model, tokenizer, text, 'English')
            result  = _translate_once(model, tokenizer, english, target_language)
        else:
            result = _translate_once(model, tokenizer, text, target_language)
        translations.append(result)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({'translations': translations}, f, ensure_ascii=False)

    print(f'[Sarvam] Done. {len(translations)} translations written.')

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: run_sarvam_isolated.py <input_json> <output_json>', file=sys.stderr)
        sys.exit(1)
    run_isolated(sys.argv[1], sys.argv[2])
