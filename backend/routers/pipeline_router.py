from fastapi import APIRouter
from schemas.common import BaseResponse
from database.mongo import get_db
from bson import ObjectId

router = APIRouter(prefix="/jobs", tags=["pipeline"])

@router.get("/{job_id}", response_model=BaseResponse, summary="Get Pipeline Job Status")
async def get_job_status(job_id: str):
    db = get_db()
    
    try:
        job_id_query = ObjectId(job_id) if len(job_id) == 24 else job_id
    except Exception:
        job_id_query = job_id
        
    job = await db.jobs.find_one({"_id": job_id_query})
    if not job:
        return BaseResponse(success=False, message="Job not found")
    job["_id"] = str(job["_id"])
    return BaseResponse(data=job)

@router.get("/{job_id}/logs", response_model=BaseResponse, summary="Get Pipeline Logs")
async def get_job_logs(job_id: str):
    # Retrieve logs (usually streamed from Redis/Mongo or a log file)
    return BaseResponse(data={"logs": ["[INFO] Starting job...", "[INFO] Detection complete."]})

@router.post("/{job_id}/cancel", response_model=BaseResponse, summary="Cancel Pipeline Job")
async def cancel_job(job_id: str):
    # Celery task revocation logic goes here
    return BaseResponse(message="Job cancellation requested.")
