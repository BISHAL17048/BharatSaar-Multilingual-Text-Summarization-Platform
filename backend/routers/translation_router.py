from fastapi import APIRouter, HTTPException
from schemas.common import BaseResponse
from database.mongo import get_db
from bson import ObjectId
from models.job import JobStatus
import uuid
import datetime

router = APIRouter(prefix="/translate", tags=["translation"])

@router.post("", response_model=BaseResponse, summary="Translate Document")
async def translate_document(doc_id: str, target_lang: str):
    db = get_db()
    doc = await db.documents.find_one({"_id": ObjectId(doc_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    job_id = str(uuid.uuid4())
    
    await db.jobs.insert_one({
        "_id": ObjectId(job_id) if len(job_id)==24 else job_id,
        "type": "TRANSLATION",
        "document_id": str(doc["_id"]),
        "status": JobStatus.PENDING,
        "target_lang": target_lang,
        "created_at": datetime.datetime.utcnow()
    })
    
    from workers.stages.stage_08_translation import run_translation
    source_lang = doc.get("language") or "eng_Latn"
    run_translation.delay(doc_id, target_lang, source_lang)
    
    return BaseResponse(
        message="Translation job queued successfully.",
        data={"job_id": job_id, "status": JobStatus.PENDING}
    )
