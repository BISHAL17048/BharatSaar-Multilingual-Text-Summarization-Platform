from database.mongo import get_db
from models.document import DocumentModel
from bson import ObjectId

class DocumentRepository:
    
    @staticmethod
    async def create_document(doc: DocumentModel) -> str:
        db = get_db()
        doc_dict = doc.model_dump(by_alias=True, exclude={"id"})
        result = await db.documents.insert_one(doc_dict)
        return str(result.inserted_id)
        
    @staticmethod
    async def get_document(doc_id: str) -> dict:
        db = get_db()
        doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc

    @staticmethod
    async def get_user_documents(user_id: str) -> list:
        db = get_db()
        cursor = db.documents.find({"user_id": user_id}).sort("created_at", -1).limit(50)
        docs = await cursor.to_list(length=50)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc:
                doc["created_at"] = doc["created_at"].isoformat() if hasattr(doc["created_at"], 'isoformat') else str(doc["created_at"])
        return docs

    @staticmethod
    async def update_document_intelligence(doc_id: str, detailed_summary: str, bullet_summary: str, chronological_events: str, headline: str, entities: list, topics: list, keywords: list, language: str = None):
        db = get_db()
        update_fields = {
            "detailed_summary": detailed_summary,
            "bullet_summary": bullet_summary,
            "chronological_events": chronological_events,
            "headline": headline,
            "intelligence": {
                "entities": entities,
                "topics": topics,
                "keywords": keywords
            }
        }
        if language is not None:
            update_fields["language"] = language

        await db.documents.update_one(
            {"_id": ObjectId(doc_id)},
            {"$set": update_fields}
        )

    @staticmethod
    async def update_document_translation(doc_id: str, target_lang: str, translation_data: dict):
        db = get_db()
        await db.documents.update_one(
            {"_id": ObjectId(doc_id)},
            {"$set": {
                f"translations.{target_lang}": translation_data
            }}
        )

    @staticmethod
    async def delete_document(doc_id: str) -> bool:
        db = get_db()
        result = await db.documents.delete_one({"_id": ObjectId(doc_id)})
        return result.deleted_count > 0

    @staticmethod
    async def rename_document(doc_id: str, new_name: str) -> bool:
        db = get_db()
        result = await db.documents.update_one(
            {"_id": ObjectId(doc_id)},
            {"$set": {"display_name": new_name}}  # separate from AI-generated headline
        )
        return result.modified_count > 0
