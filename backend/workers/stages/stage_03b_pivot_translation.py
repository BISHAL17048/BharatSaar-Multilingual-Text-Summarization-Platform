import os
import sys
import json
import subprocess
import tempfile
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job
from models.job import JobStatus

LOW_RESOURCE_LANGUAGES = {
    "Bodo": "brx_Deva", "Dogri": "doi_Deva", "Kashmiri": "kas_Arab",
    "Konkani": "gom_Deva", "Manipuri": "mni_Beng",
    "Sanskrit": "san_Deva", "Santali": "sat_Olck",
}

_SARVAM_SCRIPT = os.path.abspath(os.path.join(os.path.dirname(__file__), "run_sarvam_isolated.py"))


def _chunk_text(text, max_chars=500):
    if not text:
        return []
    lines = text.split("\n")
    chunks, cur = [], ""
    for line in lines:
        if len(cur) + len(line) > max_chars:
            if cur:
                chunks.append(cur.strip())
            cur = line + "\n"
        else:
            cur += line + "\n"
    if cur:
        chunks.append(cur.strip())
    return chunks or [text]


def _run_sarvam_subprocess(texts, target_language, source_lang="eng_Latn"):
    """
    Delegates all Sarvam translation to an isolated subprocess.
    Subprocess exits after finishing -> OS guarantees 100%% VRAM release.
    """
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json", encoding="utf-8") as fin:
        json.dump({"texts": texts, "target_language": target_language, "source_lang": source_lang}, fin, ensure_ascii=False)
        input_file = fin.name
    with tempfile.NamedTemporaryFile(mode="w", delete=False, suffix=".json", encoding="utf-8") as fout:
        output_file = fout.name
    try:
        res = subprocess.run(
            [sys.executable, _SARVAM_SCRIPT, input_file, output_file],
            capture_output=True, text=True, env=os.environ.copy()
        )
        if res.stdout:
            print(res.stdout)
        if res.returncode != 0:
            print("[Sarvam Subprocess] FAILED exit=" + str(res.returncode))
            print("STDERR:", res.stderr)
            return texts
        with open(output_file, "r", encoding="utf-8") as f:
            return json.load(f).get("translations", texts)
    except Exception as exc:
        print("[Sarvam Subprocess] Exception:", exc)
        return texts
    finally:
        for p in (input_file, output_file):
            try:
                os.remove(p)
            except Exception:
                pass


@celery_app.task(bind=True, name="stages.pivot_translation")
def run_pivot_translation(self, previous_result: dict):
    """
    Stage 3b - English Pivot Translation.
    Translates low-resource Indic language text to English via isolated Sarvam subprocess.
    For mainstream languages this is a no-op passthrough.
    VRAM is guaranteed to be freed when the subprocess exits.
    """
    job_id = previous_result["job_id"]
    if not previous_result.get("needs_english_pivot", False):
        return previous_result

    lang_name = previous_result.get("original_language_name", "Unknown")
    sync_update_job(job_id, JobStatus.PROCESSING, "Pivot Translation: " + lang_name + " to English", 62)

    text = previous_result.get("raw_text", "")
    if not text.strip():
        return previous_result

    print("[" + job_id + "] Pivot Translation: " + lang_name + " -> English (Sarvam isolated subprocess)")
    try:
        chunks = _chunk_text(text, max_chars=500)
        print("[" + job_id + "] Sending " + str(len(chunks)) + " chunks to Sarvam subprocess...")
        translated = _run_sarvam_subprocess(chunks, target_language="English")
        english_text = "\n".join(translated)

        previous_result["raw_text"]    = english_text
        previous_result["refined_text"] = ""
        previous_result["language_meta"]["language_name"] = "English"
        previous_result["language_meta"]["language_code"] = "en"

        print("[" + job_id + "] Pivot Translation complete. "
              + str(len(text)) + " chars (" + lang_name + ") -> "
              + str(len(english_text)) + " chars (English)")
    except Exception as exc:
        print("[" + job_id + "] Pivot Translation failed:", exc)
        previous_result["needs_english_pivot"] = False

    return previous_result
