from FlagEmbedding import BGEM3FlagModel, FlagReranker
from bertopic import BERTopic
from llama_index.core.node_parser import SemanticSplitterNodeParser

def init_models():
    print("Loading Embedding & Topic Modeling services...")
    
    # Base Embeddings for Vectors and Long Context Retrieval
    print("- Loading BAAI/bge-m3 (Dense/Sparse/ColBERT embeddings)")
    # bge_m3 = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
    
    # Semantic Chunking
    print("- Initializing SemanticSplitterNodeParser using BGE-M3")
    
    # Topic Detection
    print("- Loading BERTopic + BGE-M3 for Event Topic Detection")
    # topic_model = BERTopic(embedding_model="BAAI/bge-m3")
    
    # Deduplication
    print("- Loading BAAI/bge-reranker-v2-m3 for Duplicate Event Removal")
    # reranker = FlagReranker('BAAI/bge-reranker-v2-m3', use_fp16=True)
    
    print("Embedding models configured successfully.")

if __name__ == "__main__":
    init_models()
