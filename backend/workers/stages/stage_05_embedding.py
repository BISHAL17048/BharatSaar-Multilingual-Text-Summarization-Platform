import os
import gc
import torch
from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job, run_async
from models.job import JobStatus
from services.embedding_service import EmbeddingService, get_bge_model, unload_bge_model
from repositories.vector_repo import VectorRepository

# LlamaIndex Imports
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.core.embeddings import BaseEmbedding
from llama_index.core.schema import Document

class LocalBGEM3Embedding(BaseEmbedding):
    """Wrapper to make our local BGE-M3 compatible with LlamaIndex Semantic Splitter"""
    def __init__(self):
        super().__init__()
        
    def _get_query_embedding(self, query: str) -> list[float]:
        model = get_bge_model()
        return model.encode(query, normalize_embeddings=True).tolist()
        
    def _get_text_embedding(self, text: str) -> list[float]:
        model = get_bge_model()
        return model.encode(text, normalize_embeddings=True).tolist()
        
    def _get_text_embeddings(self, texts: list[str]) -> list[list[float]]:
        model = get_bge_model()
        return model.encode(texts, normalize_embeddings=True).tolist()
        
    async def _aget_query_embedding(self, query: str) -> list[float]:
        return self._get_query_embedding(query)
        
    async def _aget_text_embedding(self, text: str) -> list[float]:
        return self._get_text_embedding(text)

def _segment_and_chunk(text: str) -> list[str]:
    """Uses SaT for sentence boundaries, then Semantic Splitter for chunking"""
    from wtpsplit import SaT
    
    # 1. SaT Sentence Segmentation
    sat_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "model_server", "weights", "sat-3l-sm"))
    print(f"Loading SaT from {sat_path}...")
    sat_model = SaT(sat_path)
    # Move SaT to CUDA if available for faster segmentation
    if torch.cuda.is_available():
        sat_model.to("cuda")
    
    # Actually, SemanticSplitterNodeParser expects a whole document string and splits it by sentences internally.
    # To force it to use our SaT sentences, we can define a custom sentence splitter function inside it!
    def custom_sat_splitter(t: str) -> list[str]:
        return sat_model.split(t)
        
    # 2. Semantic Chunking
    embed_model = LocalBGEM3Embedding()
    splitter = SemanticSplitterNodeParser(
        buffer_size=1,
        breakpoint_percentile_threshold=95,
        embed_model=embed_model,
        sentence_splitter=custom_sat_splitter
    )
    
    nodes = splitter.get_nodes_from_documents([Document(text=text)])
    chunks = [node.get_content() for node in nodes]
    
    # Unload SaT from VRAM immediately after segmentation
    del sat_model
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    print("Unloaded SaT from VRAM.")
    
    return chunks

async def process_embeddings(text: str, user_id: str, doc_id: str, metadata: dict):
    # Chunk the text using SaT + Semantic Splitter
    chunks = _segment_and_chunk(text)
    
    embed_service = EmbeddingService()
    
    # Embed and Store
    for i, chunk in enumerate(chunks):
        vectors = await embed_service.get_embedding(chunk)
        VectorRepository.store_chunk(
            user_id=user_id,
            doc_id=doc_id,
            chunk_index=i,
            text=chunk,
            dense_vector=vectors["dense"],
            sparse_vector=vectors["sparse"],
            metadata=metadata
        )
    return len(chunks)

@celery_app.task(bind=True, name="stages.embedding")
def run_embedding(self, previous_result: dict):
    job_id = previous_result["job_id"]
    doc_id = previous_result["document_id"]
    user_id = previous_result.get("user_id", "system")
    
    sync_update_job(job_id, JobStatus.PROCESSING, "Vector Embedding & Semantic Chunking", 70)
    print(f"[{job_id}] Running SaT Segmentation & BGE-M3 Semantic Chunking...")
    
    text = previous_result.get("refined_text", "")
    if not text:
        text = previous_result.get("raw_text", "")
    
    metadata = {
        "language": previous_result.get("language_meta", {}).get("language_code", "unknown"),
        "source_type": previous_result.get("detection_meta", {}).get("document_type", "UNKNOWN")
    }
    
    if not text.strip():
        return previous_result
        
    try:
        total_chunks = run_async(process_embeddings(text, user_id, doc_id, metadata))
        print(f"[{job_id}] Stored {total_chunks} Semantic Chunks in ChromaDB Vector DB.")
        
    except Exception as e:
        sync_update_job(job_id, JobStatus.FAILED, f"Embedding Error (Attempt {self.request.retries + 1}/3)", 70)
        
        if self.request.retries >= 2:
            celery_app.send_task("stages.dlq", args=[job_id, "Embedding Stage", str(e)], queue="dlq_queue")
            raise e
            
        delay = 10 * (3 ** self.request.retries)
        raise self.retry(exc=e, countdown=delay, max_retries=2)
    finally:
        unload_bge_model()
        import gc
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    return previous_result
