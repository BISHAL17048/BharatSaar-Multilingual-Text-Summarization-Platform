from database.chroma import get_chroma_client, COLLECTION_NAME
import uuid

class VectorRepository:
    
    @staticmethod
    def store_chunk(user_id: str, doc_id: str, chunk_index: int, text: str, dense_vector: list, sparse_vector: dict, metadata: dict):
        client = get_chroma_client()
        collection = client.get_collection(COLLECTION_NAME)
        
        payload = {
            "user_id": user_id,
            "doc_id": doc_id,
            "chunk_index": chunk_index,
            "raw_text": text,
            **metadata
        }
        
        point_id = str(uuid.uuid4())
        
        collection.add(
            ids=[point_id],
            embeddings=[dense_vector],
            metadatas=[payload]
        )
        return point_id

    @staticmethod
    def hybrid_search(user_id: str, dense_query: list, sparse_query: dict, limit: int = 5, doc_id: str = None):
        # Fallback to pure dense search since Chroma doesn't natively support sparse BM25
        client = get_chroma_client()
        collection = client.get_collection(COLLECTION_NAME)

        # Always filter by doc_id when provided — prevents cross-document contamination
        if doc_id:
            where_filter = {"$and": [{"user_id": user_id}, {"doc_id": doc_id}]}
        else:
            where_filter = {"user_id": user_id}
        
        results = collection.query(
            query_embeddings=[dense_query],
            n_results=limit,
            where=where_filter,
            include=["metadatas", "distances"]
        )
        
        formatted_results = []
        if results['ids'] and len(results['ids'][0]) > 0:
            for i in range(len(results['ids'][0])):
                formatted_results.append({
                    "id": results['ids'][0][i],
                    "score": 1.0 - results['distances'][0][i], # Convert distance to similarity
                    "text": results['metadatas'][0][i]["raw_text"],
                    "doc_id": results['metadatas'][0][i]["doc_id"]
                })
                
        return formatted_results
