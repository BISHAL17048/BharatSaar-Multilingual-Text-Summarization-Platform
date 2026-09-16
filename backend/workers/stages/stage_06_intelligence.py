import os
import gc
import torch
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job
from models.job import JobStatus
from gliner import GLiNER
from keybert import KeyBERT
from transformers import AutoModel, AutoTokenizer
from sentence_transformers import models, SentenceTransformer

def load_and_run_gliner(text: str) -> dict:
    weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "gliner_multi-v2.1"))
    print(f"Loading GLiNER from {weights_path}...")
    model = None
    try:
        model = GLiNER.from_pretrained(weights_path, local_files_only=True)
        labels = ["person", "organization", "location", "money", "date", "concept", "event"]
        chunk = text[:1500] 
        entities = model.predict_entities(chunk, labels)
        
        extracted_entities = [{"text": ent["text"], "label": ent["label"]} for ent in entities]
        topics = list(set([ent["text"] for ent in entities if ent["label"] in ["concept", "event"]]))
        
        return {
            "entities": extracted_entities,
            "topics": topics
        }
    finally:
        if model is not None:
            del model
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("Unloaded GLiNER from RAM.")

def load_and_run_keybert(text: str) -> list:
    weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "IndicBERT-v3-270M"))
    print(f"Loading IndicBERT for KeyBERT from {weights_path}...")
    
    kw_model = None
    st_model = None
    try:
        word_embedding_model = models.Transformer(weights_path)
        pooling_model = models.Pooling(word_embedding_model.get_word_embedding_dimension())
        st_model = SentenceTransformer(modules=[word_embedding_model, pooling_model])
        
        kw_model = KeyBERT(model=st_model)
        chunk = text[:1500]
        keywords = kw_model.extract_keywords(chunk, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=5)
        
        return [kw[0] for kw in keywords]
    finally:
        if kw_model is not None:
            del kw_model
        if st_model is not None:
            del st_model
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("Unloaded IndicBERT/KeyBERT from RAM.")

def run_bertopic(text: str) -> list:
    print("Running BERTopic clustering for topic detection...")
    try:
        from bertopic import BERTopic
        from sentence_transformers import SentenceTransformer
        weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "IndicBERT-v3-270M"))
        
        # Simple fallback sentence splitting
        sentences = [s.strip() for s in text.replace("\n", ".").split(".") if len(s.strip()) > 20]
        if len(sentences) < 5:
            return []
            
        embed_model = SentenceTransformer(weights_path)
        topic_model = BERTopic(embedding_model=embed_model, min_topic_size=2)
        topics, _ = topic_model.fit_transform(sentences)
        
        topic_info = topic_model.get_topic_info()
        detected_topics = []
        for i in range(len(topic_info)):
            topic_id = topic_info.iloc[i]['Topic']
            if topic_id == -1: continue # outlier
            words = [w[0] for w in topic_model.get_topic(topic_id)][:2]
            detected_topics.append(" ".join(words))
            
        del embed_model
        del topic_model
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("Unloaded BERTopic/IndicBERT from VRAM.")
        return detected_topics[:5]
    except Exception as e:
        print(f"BERTopic failed: {e}")
        return []

def run_reranker_deduplication(events: list) -> list:
    if not events:
        return []
    weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "bge-reranker-v2-m3"))
    if not os.path.exists(weights_path):
        return events
        
    print(f"Loading bge-reranker-v2-m3 to deduplicate {len(events)} events...")
    model = None
    tokenizer = None
    try:
        from transformers import AutoModelForSequenceClassification, AutoTokenizer
        device = "cuda" if torch.cuda.is_available() else "cpu"
        tokenizer = AutoTokenizer.from_pretrained(weights_path, local_files_only=True)
        model = AutoModelForSequenceClassification.from_pretrained(weights_path, local_files_only=True).to(device)
        model.eval()
        
        unique_events = []
        for event in events:
            event_text = event["text"]
            is_duplicate = False
            for unique in unique_events:
                pairs = [[event_text, unique["text"]]]
                with torch.no_grad():
                    inputs = tokenizer(pairs, padding=True, truncation=True, return_tensors='pt', max_length=512).to(device)
                    scores = model(**inputs, return_dict=True).logits.view(-1, ).float()
                    # A high score > 1.0 indicates high semantic similarity
                    if scores[0] > 1.0:
                        is_duplicate = True
                        break
            if not is_duplicate:
                unique_events.append(event)
                
        return unique_events
    except Exception as e:
        print(f"Reranker failed: {e}")
        return events
    finally:
        if model: del model
        if tokenizer: del tokenizer
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

@celery_app.task(bind=True, name="stages.intelligence")
def run_intelligence(self, previous_result: dict):
    job_id = previous_result["job_id"]
    sync_update_job(job_id, JobStatus.PROCESSING, "Extracting Intelligence (GLiNER + BERTopic + BGE-Reranker)", 85)
    
    text = previous_result.get("refined_text", "")
    if not text.strip():
        previous_result["intelligence"] = {"entities": [], "topics": [], "keywords": []}
        return previous_result
        
    print(f"[{job_id}] Running Advanced Intelligence Extraction Natively...")
    try:
        # Run sequentially to conserve VRAM!
        gliner_data = load_and_run_gliner(text)
        keywords_data = load_and_run_keybert(text)
        
        # Deduplicate Events
        events = [e for e in gliner_data["entities"] if e["label"] == "event"]
        non_events = [e for e in gliner_data["entities"] if e["label"] != "event"]
        unique_events = run_reranker_deduplication(events)
        
        # Combine back
        final_entities = non_events + unique_events
        
        # Generate semantic topics using BERTopic
        bertopic_topics = run_bertopic(text)
        
        previous_result["intelligence"] = {
            "entities": final_entities,
            "topics": bertopic_topics if bertopic_topics else gliner_data["topics"],
            "keywords": keywords_data
        }
    except Exception as e:
        print(f"[{job_id}] Intelligence extraction fallback engaged ({e})")
        words = [w.strip() for w in text.split() if len(w) > 4][:10]
        previous_result["intelligence"] = {
            "entities": [{"text": w, "label": "keyword"} for w in words[:5]],
            "topics": words[:3],
            "keywords": words[:5]
        }

    return previous_result
