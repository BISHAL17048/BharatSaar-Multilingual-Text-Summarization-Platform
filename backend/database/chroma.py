import os
import chromadb
from config.settings import settings
import logging

chroma_client = None
COLLECTION_NAME = "docintel_chunks"

def init_chroma():
    global chroma_client
    try:
        chroma_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", settings.CHROMA_PERSIST_DIRECTORY))
        os.makedirs(chroma_path, exist_ok=True)
        chroma_client = chromadb.PersistentClient(path=chroma_path)
        
        # Ensure collection exists
        chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"} # Use cosine similarity for BGE-M3
        )
            
        logging.info("ChromaDB initialized successfully.")
    except Exception as e:
        logging.error(f"Failed to initialize ChromaDB: {e}")

def get_chroma_client() -> chromadb.PersistentClient:
    global chroma_client
    if chroma_client is None:
        init_chroma()
    return chroma_client
