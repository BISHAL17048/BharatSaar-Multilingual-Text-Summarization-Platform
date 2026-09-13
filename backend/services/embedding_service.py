import os
import json
import torch
from sentence_transformers import SentenceTransformer

# Lazy loaded singleton
_bge_model = None

# In-memory simple cache to replace Redis
_embedding_cache = {}

def get_bge_model():
    global _bge_model
    if _bge_model is None:
        weights_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "model_server", "weights", "bge-m3"))
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Lazy loading BGE-M3 from {weights_path} on {device}...")
        _bge_model = SentenceTransformer(weights_path, device=device)
    return _bge_model

def unload_bge_model():
    global _bge_model
    if _bge_model is not None:
        del _bge_model
        _bge_model = None
        import gc
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        print("Unloaded BGE-M3 from VRAM.")

class EmbeddingService:
    """
    On-Demand Embedding logic with In-Memory caching.
    """
    def __init__(self):
        pass

    async def get_embedding(self, text: str) -> dict:
        import hashlib
        cache_key = f"embed:{hashlib.md5(text.encode()).hexdigest()}"
        
        if cache_key in _embedding_cache:
            return _embedding_cache[cache_key]
            
        try:
            model = get_bge_model()
            # BGE-M3 via SentenceTransformer directly returns dense vector
            dense_vec = model.encode(text, normalize_embeddings=True)
            
            data = {
                "dense": dense_vec.tolist(),
                "sparse": {}  # We no longer need sparse since Chroma doesn't support it
            }
            
            # Keep cache size manageable
            if len(_embedding_cache) > 1000:
                _embedding_cache.clear()
                
            _embedding_cache[cache_key] = data
            return data
            
        except Exception as e:
            raise Exception(f"Embedding failed: {str(e)}")
