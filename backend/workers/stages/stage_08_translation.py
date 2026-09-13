import os
import gc
import torch
from workers.celery_app import celery_app
from transformers import AutoModelForSeq2SeqLM, AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from repositories.document_repo import DocumentRepository
from database.mongo import get_db
import asyncio

LANGUAGE_MAP = {
    "asm_Beng": "Assamese", "ben_Beng": "Bengali", "brx_Deva": "Bodo", "doi_Deva": "Dogri", 
    "gom_Deva": "Konkani", "guj_Gujr": "Gujarati", "hin_Deva": "Hindi", "kan_Knda": "Kannada", 
    "kas_Arab": "Kashmiri", "kas_Deva": "Kashmiri", "mai_Deva": "Maithili", "mal_Mlym": "Malayalam", 
    "mni_Beng": "Manipuri", "mni_Mtei": "Manipuri", "mar_Deva": "Marathi", "npi_Deva": "Nepali", 
    "ory_Orya": "Odia", "pan_Guru": "Punjabi", "san_Deva": "Sanskrit", "sat_Olck": "Santali", 
    "snd_Arab": "Sindhi", "snd_Deva": "Sindhi", "tam_Taml": "Tamil", "tel_Telu": "Telugu", 
    "urd_Arab": "Urdu", "eng_Latn": "English"
}

def run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None
    if loop and loop.is_running():
        return asyncio.ensure_future(coro)
    return asyncio.run(coro)

def chunk_text(text: str, max_chars: int = 500) -> list[str]:
    if not text:
        return []
    lines = text.split('\n')
    chunks = []
    current_chunk = ""
    for line in lines:
        if len(current_chunk) + len(line) > max_chars:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = line + "\n"
        else:
            current_chunk += line + "\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

@celery_app.task(bind=True, name="stages.translation")
def run_translation(self, doc_id: str, target_lang: str, source_lang: str = "eng_Latn"):
    print(f"[Translation] Starting translation for document {doc_id} from {source_lang} to {target_lang} using Sarvam...")
    
    doc = run_async(DocumentRepository.get_document(doc_id))
    if not doc:
        print(f"[Translation] Document {doc_id} not found.")
        return
        
    db_language_name = doc.get("language")
    
    # If the document was processed before the language-saving fix, fallback to detecting it dynamically
    if not db_language_name:
        detailed_summary = doc.get("detailed_summary", "")
        if detailed_summary:
            try:
                import langdetect
                label = langdetect.detect(detailed_summary[:1000])
                LANGUAGE_NAMES = {
                    "as": "Assamese", "bn": "Bengali", "brx": "Bodo", "doi": "Dogri",
                    "gu": "Gujarati", "hi": "Hindi", "kn": "Kannada", "ks": "Kashmiri",
                    "kok": "Konkani", "mai": "Maithili", "ml": "Malayalam", "mni": "Manipuri",
                    "mr": "Marathi", "ne": "Nepali", "or": "Odia", "pa": "Punjabi",
                    "sa": "Sanskrit", "sat": "Santali", "sd": "Sindhi", "ta": "Tamil",
                    "te": "Telugu", "ur": "Urdu", "en": "English"
                }
                db_language_name = LANGUAGE_NAMES.get(label)
            except:
                pass
                
    if db_language_name:
        for code, name in LANGUAGE_MAP.items():
            if name == db_language_name:
                source_lang = code
                break
        
    device = "cuda" if torch.cuda.is_available() else "cpu"
    tokenizer = None
    model = None
    model_dir_name = ""
    
    try:
        model_dir_name = "sarvam-translate"
        weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", model_dir_name))
        print(f"[Translation] Loading {model_dir_name} on {device.upper()} (4-bit NF4)...")
            
        tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True)
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        model = AutoModelForCausalLM.from_pretrained(
            weights_path, local_files_only=True, quantization_config=bnb_config, device_map="auto"
        )
        
        target_lang_str = LANGUAGE_MAP.get(target_lang, target_lang)
        
        def _single_translate(text_to_translate, target_language_name):
            messages = [
                {"role": "system", "content": f"Translate the text below to {target_language_name}."},
                {"role": "user", "content": text_to_translate}
            ]
            formatted_text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
            inputs = tokenizer([formatted_text], return_tensors="pt").to(model.device)
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
            
        def translate(text):
            if not text: return ""
            
            # Check if it's an Indic-to-Indic translation requiring English pivot
            if source_lang != "eng_Latn" and target_lang != "eng_Latn":
                # Pivot 1: Indic -> English
                english_text = _single_translate(text, "English")
                # Pivot 2: English -> Indic
                return _single_translate(english_text, target_lang_str)
            else:
                # Direct translation: English -> Indic OR Indic -> English
                return _single_translate(text, target_lang_str)

        t_headline = translate(doc.get("headline", ""))
        t_detailed = translate(doc.get("detailed_summary", ""))
        t_bullet = translate(doc.get("bullet_summary", ""))
        t_chrono = translate(doc.get("chronological_events", ""))
        
        # Translate Keywords
        keywords = doc.get("keywords") or doc.get("intelligence", {}).get("keywords") or []
        t_keywords = []
        if keywords:
            kw_str = ", ".join(keywords)
            t_kw_str = translate(kw_str)
            if t_kw_str:
                t_keywords = [k.strip() for k in t_kw_str.split(",")]
        
        translations = doc.get("translations", {})
        translations[target_lang] = {
            "headline": t_headline,
            "detailed_summary": t_detailed,
            "bullet_summary": t_bullet,
            "chronological_events": t_chrono,
            "keywords": t_keywords
        }
        run_async(DocumentRepository.update_document_translation(doc_id, target_lang, translations[target_lang]))
        
        async def mark_job_completed():
            db = get_db()
            await db.jobs.update_one({"document_id": doc_id, "type": "TRANSLATION", "target_lang": target_lang}, {"$set": {"status": "COMPLETED"}})
        run_async(mark_job_completed())
        print(f"[Translation] Successfully completed translation for {doc_id}.")
        
    except Exception as e:
        import traceback
        print(f"[Translation] Error during translation: {e}")
        print(traceback.format_exc())
        async def mark_job_failed():
            db = get_db()
            await db.jobs.update_one({"document_id": doc_id, "type": "TRANSLATION", "target_lang": target_lang}, {"$set": {"status": "FAILED"}})
        run_async(mark_job_failed())
    finally:
        if model is not None:
            del model
        if tokenizer is not None:
            del tokenizer
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print(f"[Translation] Unloaded {model_dir_name} from RAM successfully.")

