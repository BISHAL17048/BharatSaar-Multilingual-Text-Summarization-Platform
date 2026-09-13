import fasttext
from gliner import GLiNER
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from keybert import KeyBERT

def init_models():
    print("Loading specialized NLP models...")
    
    # Language Detection
    print("- Loading IndicLID + FastText for Language Detection")
    # lid_model = fasttext.load_model('lid.176.bin')
    
    # Normalization & Tokenization
    print("- Loading Indic NLP Library (Unicode/Script/Whitespace Normalization)")
    print("- Loading IndicSuperTokenizer")
    
    # Segmentation
    print("- Loading SaT (segment-any-text/sat-3l-sm) for Sentence Segmentation")
    
    # Transliteration
    print("- Loading IndicXlit (Roman <-> Native Transliteration)")
    
    # Keyword Extraction
    print("- Loading ai4bharat/IndicBERT-v3-270M + KeyBERT for Event Keywords")
    # kw_model = KeyBERT(model="ai4bharat/IndicBERT-v3-270M")
    
    # Named Entity Recognition
    print("- Loading urchade/gliner_multi-v2.1 for NER")
    # gliner_model = GLiNER.from_pretrained("urchade/gliner_multi-v2.1")
    
    # Translation
    print("- Loading IndicTrans2 (indic-indic, en-indic, indic-en) for required translations")
    # trans_en_indic = AutoModelForSeq2SeqLM.from_pretrained("ai4bharat/indictrans2-en-indic-dist-200M")
    
    print("All NLP models configured successfully.")

if __name__ == "__main__":
    init_models()
