import os
import langdetect
import fasttext
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job
from models.job import JobStatus
from config.settings import settings

LANGUAGE_MAP = {
    "asm_Beng": "Assamese", "ben_Beng": "Bengali", "brx_Deva": "Bodo", "doi_Deva": "Dogri", 
    "gom_Deva": "Konkani", "kok_Deva": "Konkani", "guj_Gujr": "Gujarati", "hin_Deva": "Hindi", "kan_Knda": "Kannada", 
    "kas_Arab": "Kashmiri", "kas_Deva": "Kashmiri", "mai_Deva": "Maithili", "mal_Mlym": "Malayalam", 
    "mni_Beng": "Manipuri", "mni_Mtei": "Manipuri", "mar_Deva": "Marathi", "npi_Deva": "Nepali", "nep_Deva": "Nepali",
    "ory_Orya": "Odia", "ori_Orya": "Odia", "pan_Guru": "Punjabi", "san_Deva": "Sanskrit", "sat_Olck": "Santali", "sat_Olch": "Santali",
    "snd_Arab": "Sindhi", "snd_Deva": "Sindhi", "tam_Taml": "Tamil", "tam_Tamil": "Tamil", "tel_Telu": "Telugu", 
    "urd_Arab": "Urdu", "eng_Latn": "English"
}

fasttext_model = None

def get_fasttext_model():
    global fasttext_model
    if fasttext_model is None:
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "indiclid", "indiclid-ftn.bin"))
        if os.path.exists(model_path):
            fasttext_model = fasttext.load_model(model_path)
    return fasttext_model

@celery_app.task(bind=True, name="stages.linguistics")
def run_linguistics(self, previous_result: dict):
    job_id = previous_result["job_id"]
    sync_update_job(job_id, JobStatus.PROCESSING, "Linguistic Analysis", 40)
    
    # Conserve extraction result
    text = previous_result.get("raw_text", "")
    if not text:
        text = previous_result.get("text", "")
        
    if not text.strip():
        previous_result["language_meta"] = {"language_code": "unknown", "language_name": "Unknown", "confidence": 0.0}
        return previous_result
        
    sample_text = text[:2000].replace("\n", " ").strip()
    label = None
    language_name = None
    confidence = 0.99
    
    # 1. Native FastText / IndicLID detection
    try:
        print(f"[{job_id}] Requesting FastText / IndicLID detection natively...")
        model = get_fasttext_model()
        if model:
            predictions = model.predict(sample_text.replace("\n", " "), k=1)
            raw_label = predictions[0][0].replace("__label__", "")
            confidence = float(predictions[1][0])
            
            # Map full code (e.g. brx_Deva) to short code and name
            language_name = LANGUAGE_MAP.get(raw_label, "Unknown")
            label = raw_label.split('_')[0] if "_" in raw_label else raw_label
            
            print(f"[{job_id}] FastText/IndicLID Detected Language: {language_name} ({label}) with {confidence:.2f} confidence")
        else:
            print(f"[{job_id}] FastText model not found locally.")
    except Exception as err:
        print(f"[{job_id}] Native FastText failed ({err}), falling back to langdetect...")
        
    # 2. Fallback to native langdetect if FastText fails
    if not label:
        try:
            label = langdetect.detect(sample_text)
            try:
                langs = langdetect.detect_langs(sample_text)
                confidence = float(langs[0].prob)
            except:
                confidence = 0.99
            
            lang_mapping = {"hi": "Hindi", "bn": "Bengali", "brx": "Bodo", "ta": "Tamil", "en": "English"}
            language_name = lang_mapping.get(label, label.upper())
            print(f"[{job_id}] LangDetect Fallback Detected Language: {language_name} ({label}) with {confidence:.2f} confidence")
        except Exception as e:
            label = "unknown"
            language_name = "Unknown"
            confidence = 0.0

    if not language_name or language_name == "Unknown":
        lang_mapping = {"hi": "Hindi", "bn": "Bengali", "brx": "Bodo", "ta": "Tamil", "en": "English"}
        language_name = lang_mapping.get(label, label.upper())

    # --- Heuristic Overrides ---
    # Removed: Language detection is handled entirely by IndicLID
    # ---------------------------

    # Indic NLP Normalization
    normalized_text = text
    try:
        from indicnlp.normalize.indic_normalize import IndicNormalizerFactory
        # If it's a supported language code, apply unicode and whitespace normalization
        supported_langs = ["hi", "sa", "mr", "ne", "kok", "as", "bn", "gu", "pa", "or", "ta", "te", "kn", "ml"]
        if label in supported_langs:
            factory = IndicNormalizerFactory()
            normalizer = factory.get_normalizer(label)
            normalized_text = normalizer.normalize(text)
            print(f"[{job_id}] Applied IndicNLP Normalization (Unicode/Whitespace) for {label}")
    except Exception as e:
        print(f"[{job_id}] IndicNLP Normalization failed or unavailable: {e}")

    # Conserve the extracted data for the next step
    previous_result["raw_text"] = normalized_text
    previous_result["language_meta"] = {
        "language_code": label,
        "language_name": language_name,
        "confidence": confidence
    }

    # --- English Pivot Flag for Low-Resource Languages ---
    LOW_RESOURCE_LANGUAGES = {
        "Bodo":      "brx_Deva",
        "Dogri":     "doi_Deva",
        "Kashmiri":  "kas_Arab",
        "Konkani":   "gom_Deva",
        "Manipuri":  "mni_Beng",
        "Sanskrit":  "san_Deva",
        "Santali":   "sat_Olck",
    }
    if language_name in LOW_RESOURCE_LANGUAGES:
        previous_result["needs_english_pivot"]    = True
        previous_result["original_language_name"] = language_name
        previous_result["original_language_code"] = LOW_RESOURCE_LANGUAGES[language_name]
        print(f"[{job_id}] Low-resource language '{language_name}' detected - English pivot will be applied.")
    else:
        previous_result["needs_english_pivot"] = False
    # -----------------------------------------------------

    # Save the detected language code to MongoDB for translation pivoting

    from database.mongo import get_db
    import asyncio
    from bson import ObjectId
    
    async def update_doc_lang():
        db = get_db()
        # Map langdetect "bn" -> our internal standard "ben_Beng"
        # Let's find the correct IndicTrans code from LANGUAGE_NAMES if possible
        # We can just store the full language name (e.g. "Bengali") and let the translation script map it back to the code
        await db.documents.update_one(
            {"_id": ObjectId(previous_result["document_id"])},
            {"$set": {"language": language_name}}
        )
        
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None
    if loop and loop.is_running():
        asyncio.ensure_future(update_doc_lang())
    else:
        asyncio.run(update_doc_lang())

    return previous_result

