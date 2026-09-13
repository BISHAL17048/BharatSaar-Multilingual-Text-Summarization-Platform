import os
import gc
import torch
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job
from models.job import JobStatus

# Languages that need English pivot for reliable summarization by Qwen3-4B
LOW_RESOURCE_LANGUAGES = {
    "Bodo":      "brx_Deva",
    "Dogri":     "doi_Deva",
    "Kashmiri":  "kas_Arab",
    "Konkani":   "gom_Deva",
    "Manipuri":  "mni_Beng",
    "Sanskrit":  "san_Deva",
    "Santali":   "sat_Olck",
}

def _chunk_text(text: str, max_chars: int = 500) -> list:
    """Split long text into chunks for translation."""
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
    return chunks or [text]

@celery_app.task(bind=True, name="stages.pivot_translation")
def run_pivot_translation(self, previous_result: dict):
    """
    Stage 3b — English Pivot Translation.
    
    For low-resource Indic languages (Bodo, Dogri, Kashmiri, Konkani,
    Manipuri, Sanskrit, Santali), this stage translates the raw_text to
    English so that the downstream stages (refinement, embedding, intelligence,
    summarization) operate on English text.
    
    For all other languages this task is a no-op passthrough.
    """
    job_id = previous_result["job_id"]

    if not previous_result.get("needs_english_pivot", False):
        # Mainstream Indic language — pass through unchanged
        return previous_result

    original_language_name = previous_result.get("original_language_name", "Unknown")
    sync_update_job(job_id, JobStatus.PROCESSING,
                    f"Translating {original_language_name} → English (Pivot)", 62)

    text = previous_result.get("raw_text", "")
    if not text.strip():
        return previous_result

    print(f"[{job_id}] ⚡ Pivot Translation: {original_language_name} → English using Sarvam...")

    weights_path = os.path.abspath(os.path.join(
        os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "sarvam-translate"
    ))

    tokenizer = None
    model = None

    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[{job_id}] Loading sarvam-translate on {device.upper()} (4-bit NF4)...")

        tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True)
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        model = AutoModelForCausalLM.from_pretrained(
            weights_path, local_files_only=True,
            quantization_config=bnb_config, device_map="auto"
        )

        def _translate_chunk(chunk):
            messages = [
                {"role": "system", "content": "Translate the text below to English."},
                {"role": "user",   "content": chunk}
            ]
            formatted = tokenizer.apply_chat_template(
                messages, tokenize=False, add_generation_prompt=True
            )
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

        chunks = _chunk_text(text, max_chars=500)
        translated_chunks = []
        for i, chunk in enumerate(chunks):
            print(f"[{job_id}] Translating chunk {i + 1}/{len(chunks)}...")
            translated_chunks.append(_translate_chunk(chunk))

        english_text = "\n".join(translated_chunks)

        # Replace raw_text with English so all downstream stages work in English
        previous_result["raw_text"]    = english_text
        previous_result["refined_text"] = ""   # Clear so Stage 4 re-refines in English

        # Tell downstream stages to generate the summary in English
        previous_result["language_meta"]["language_name"] = "English"
        previous_result["language_meta"]["language_code"] = "en"

        print(f"[{job_id}] ✅ Pivot Translation complete. "
              f"{len(text)} chars ({original_language_name}) → {len(english_text)} chars (English)")

    except Exception as e:
        print(f"[{job_id}] ❌ Pivot Translation failed: {e}. Proceeding with original language text.")
        # Disable back-translation too so we don't attempt it with garbled English
        previous_result["needs_english_pivot"] = False

    finally:
        if model is not None:
            del model
        if tokenizer is not None:
            del tokenizer
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print(f"[{job_id}] Unloaded sarvam-translate (pivot) from RAM.")

    return previous_result
