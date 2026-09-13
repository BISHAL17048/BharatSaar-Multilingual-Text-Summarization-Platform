from database.mongo import get_db
from models.job import JobModel, JobStatus
from bson import ObjectId
from datetime import datetime
from typing import Optional

class JobRepository:
    
    @staticmethod
    async def create_job(job: JobModel) -> str:
        db = get_db()
        job_dict = job.model_dump(by_alias=True, exclude={"id"})
        result = await db.jobs.insert_one(job_dict)
        return str(result.inserted_id)

    @staticmethod
    async def update_job_status(job_id: str, status: JobStatus, stage: str, progress: int, error: Optional[str] = None):
        db = get_db()
        update_data = {
            "status": status,
            "current_stage": stage,
            "progress_percentage": progress,
            "updated_at": datetime.utcnow()
        }
        if error:
            update_data["error_message"] = error
            
        await db.jobs.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": update_data}
        )

    @staticmethod
    async def link_document(job_id: str, document_id: str):
        db = get_db()
        await db.jobs.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"document_id": document_id}}
        )
