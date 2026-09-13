import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import fasttext

app = FastAPI(title="Indic NLP Service")

# Dynamically resolve weights path for local and container environments
possible_paths = [
    os.getenv("FASTTEXT_MODEL_PATH", ""),
    "/app/model_server/weights/lid.176.bin",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "weights", "lid.176.bin")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "weights", "lid.176.bin"))
]

WEIGHTS_PATH = next((p for p in possible_paths if p and os.path.exists(p)), possible_paths[2])

print(f"Loading FastText model from {WEIGHTS_PATH}...")
try:
    fasttext_model = fasttext.load_model(WEIGHTS_PATH)
    print("FastText loaded successfully!")
except Exception as e:
    print(f"Failed to load FastText: {e}")
    fasttext_model = None

LANGUAGE_NAMES = {
    "as": "Assamese", "bn": "Bengali", "brx": "Bodo", "doi": "Dogri",
    "gu": "Gujarati", "hi": "Hindi", "kn": "Kannada", "ks": "Kashmiri",
    "kok": "Konkani", "mai": "Maithili", "ml": "Malayalam", "mni": "Manipuri",
    "mr": "Marathi", "ne": "Nepali", "or": "Odia", "pa": "Punjabi",
    "sa": "Sanskrit", "sat": "Santali", "sd": "Sindhi", "ta": "Tamil",
    "te": "Telugu", "ur": "Urdu", "en": "English", "fr": "French",
    "de": "German", "es": "Spanish", "zh": "Chinese", "ar": "Arabic"
}

class DetectRequest(BaseModel):
    text: str

@app.post("/language/detect")
async def detect_language(request: DetectRequest):
    if not fasttext_model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Fasttext prediction
    text = request.text.replace("\n", " ").strip()
    predictions = fasttext_model.predict(text, k=1)
    
    label = predictions[0][0].replace("__label__", "")
    confidence = predictions[1][0]
    
    full_name = LANGUAGE_NAMES.get(label, label.upper())
    
    return {
        "language_code": label,
        "language_name": full_name,
        "confidence": float(confidence)
    }

class TranslationRequest(BaseModel):
    text: str
    source_lang: str # e.g., 'eng_Latn', 'hin_Deva'
    target_lang: str # e.g., 'hin_Deva', 'eng_Latn'

# Lazy load translation models to save VRAM
translation_models = {}

def get_translation_pipeline(src: str, tgt: str):
    from transformers import pipeline
    
    # Smart Routing Logic
    if src.startswith("eng") and not tgt.startswith("eng"):
        model_name = "indictrans2-en-indic-dist-200M"
    elif not src.startswith("eng") and tgt.startswith("eng"):
        model_name = "indictrans2-indic-en-dist-200M"
    else:
        model_name = "indictrans2-indic-indic-dist-320M"
        
    if model_name not in translation_models:
        model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "weights", model_name))
        print(f"Lazy loading Translation Model: {model_name}...")
        translation_models[model_name] = pipeline(
            "translation",
            model=model_path,
            tokenizer=model_path,
            device="cuda" if torch.cuda.is_available() else "cpu",
            src_lang=src,
            tgt_lang=tgt
        )
    return translation_models[model_name]

@app.post("/translate")
async def translate_text(request: TranslationRequest):
    try:
        translator = get_translation_pipeline(request.source_lang, request.target_lang)
        result = translator(request.text, max_length=1024)
        return {"translated_text": result[0]['translation_text']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
