import os
import sys
import json
import subprocess
import tempfile
import asyncio
from workers.celery_app import celery_app
from repositories.document_repo import DocumentRepository
from database.mongo import get_db

LANGUAGE_MAP = {
    "asm_Beng": "Assamese", "ben_Beng": "Bengali", "brx_Deva": "Bodo", "doi_Deva": "Dogri",
    "gom_Deva": "Konkani", "guj_Gujr": "Gujarati", "hin_Deva": "Hindi", "kan_Knda": "Kannada",
    "kas_Arab": "Kashmiri", "kas_Deva": "Kashmiri", "mai_Deva": "Maithili", "mal_Mlym": "Malayalam",
    "mni_Beng": "Manipuri", "mni_Mtei": "Manipuri", "mar_Deva": "Marathi", "npi_Deva": "Nepali",
    "ory_Orya": "Odia", "pan_Guru": "Punjabi", "san_Deva": "Sanskrit", "sat_Olck": "Santali",
    "snd_Arab": "Sindhi", "snd_Deva": "Sindhi", "tam_Taml": "Tamil", "tel_Telu": "Telugu",
    "urd_Arab": "Urdu", "eng_Latn": "English"
}

_SARVAM_SCRIPT = os.path.abspath(os.path.join(os.path.dirname(__file__), "run_sarvam_isolated.py"))


def run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None
    if loop and loop.is_running():
        return asyncio.ensure_future(coro)
    return asyncio.run(coro)


def _run_sarvam_subprocess(texts, target_language, source_lang="eng_Latn"):
    """
    Delegates Sarvam translation to an isolated subprocess.
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


def chunk_text(text, max_chars=500):
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
    return chunks


@celery_app.task(bind=True, name="stages.translation")
def run_translation(self, doc_id: str, target_lang: str, source_lang: str = "eng_Latn"):
    print("[Translation] Starting translation for doc " + doc_id + " to " + target_lang + " via isolated Sarvam subprocess...")

    doc = run_async(DocumentRepository.get_document(doc_id))
    if not doc:
        print("[Translation] Document " + doc_id + " not found.")
        return

    db_language_name = doc.get("language")
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
            except Exception:
                pass

    if db_language_name:
        for code, name in LANGUAGE_MAP.items():
            if name == db_language_name:
                source_lang = code
                break

    target_lang_str = LANGUAGE_MAP.get(target_lang, target_lang)

    # Gather all fields to translate in a single subprocess call
    keywords = doc.get("keywords") or doc.get("intelligence", {}).get("keywords") or []
    kw_str = ", ".join(keywords) if keywords else ""
    texts = [
        doc.get("headline", ""),
        doc.get("detailed_summary", ""),
        doc.get("bullet_summary", ""),
        doc.get("chronological_events", ""),
        kw_str,
    ]

    try:
        print("[Translation] Sending " + str(len(texts)) + " fields to Sarvam subprocess -> " + target_lang_str)
        translations = _run_sarvam_subprocess(texts, target_language=target_lang_str, source_lang=source_lang)

        t_headline  = translations[0] if len(translations) > 0 else texts[0]
        t_detailed  = translations[1] if len(translations) > 1 else texts[1]
        t_bullet    = translations[2] if len(translations) > 2 else texts[2]
        t_chrono    = translations[3] if len(translations) > 3 else texts[3]
        t_kw_str    = translations[4] if len(translations) > 4 else kw_str
        t_keywords  = [k.strip() for k in t_kw_str.split(",")] if t_kw_str else []

        import re
        if t_bullet:
            b_lines = [l.strip() for l in t_bullet.splitlines() if l.strip()]
            if len(b_lines) <= 1 and len(t_bullet) > 100:
                s_lines = [s.strip() for s in re.split(r"(?<=[।\.\?!])\s+", t_bullet) if s.strip()]
                if len(s_lines) > 1:
                    b_lines = s_lines
            formatted_bullets = []
            for bl in b_lines:
                clean = re.sub(r"^[-*•–—]\s*", "", bl)
                clean = re.sub(r"^\d+[\.\)]\s*", "", clean).strip()
                formatted_bullets.append(f"- {clean}")
            t_bullet = "\n".join(formatted_bullets)

        existing_translations = doc.get("translations", {})
        existing_translations[target_lang] = {
            "headline": t_headline,
            "detailed_summary": t_detailed,
            "bullet_summary": t_bullet,
            "chronological_events": t_chrono,
            "keywords": t_keywords
        }
        run_async(DocumentRepository.update_document_translation(doc_id, target_lang, existing_translations[target_lang]))

        async def mark_completed():
            db = get_db()
            await db.jobs.update_one(
                {"document_id": doc_id, "type": "TRANSLATION", "target_lang": target_lang},
                {"$set": {"status": "COMPLETED"}}
            )
        run_async(mark_completed())
        print("[Translation] Successfully completed translation for " + doc_id + ".")

    except Exception as exc:
        import traceback
        print("[Translation] Error:", exc)
        print(traceback.format_exc())

        async def mark_failed():
            db = get_db()
            await db.jobs.update_one(
                {"document_id": doc_id, "type": "TRANSLATION", "target_lang": target_lang},
                {"$set": {"status": "FAILED"}}
            )
        run_async(mark_failed())
