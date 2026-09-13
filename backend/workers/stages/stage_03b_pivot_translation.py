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

    print(f"[{job_id}] ⚡ Pivot Translation: {original_language_name} → English using Sarvam (Isolated)...")

    try:
        from workers.stages.run_sarvam_isolated import load_and_run_sarvam_isolated

        chunks = _chunk_text(text, max_chars=500)
        tasks = [
            {"id": f"chunk_{i}", "text": chunk, "target_language": "English"}
            for i, chunk in enumerate(chunks)
        ]

        print(f"[{job_id}] Translating {len(chunks)} chunks via isolated Sarvam...")
        results = load_and_run_sarvam_isolated(tasks)

        if not results:
            raise RuntimeError("Isolated Sarvam process returned empty results")

        translated_chunks = [results.get(f"chunk_{i}", "") for i in range(len(chunks))]
        english_text = "\n".join(translated_chunks).strip()

        if not english_text:
            raise RuntimeError("Translated English text is empty")

        # Replace raw_text with English so all downstream stages work in English
        previous_result["raw_text"] = english_text
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

    return previous_result
