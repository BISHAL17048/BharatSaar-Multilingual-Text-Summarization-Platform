from workers.celery_app import celery_app
from repositories.job_repo import JobRepository
from models.job import JobStatus
import asyncio

def sync_update_job_error(job_id, error_message):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            raise RuntimeError
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    loop.run_until_complete(
        JobRepository.update_job_status(job_id, JobStatus.FAILED, "Permanent Failure", 0, error=error_message)
    )

@celery_app.task(bind=True, name="stages.dlq")
def process_dead_letter(self, job_id: str, failed_stage: str, error_trace: str):
    """
    Handles tasks that have exhausted all their retries.
    Logs the permanent failure to the database and alerts the user.
    """
    print(f"[DLQ] Job {job_id} permanently failed at {failed_stage}.")
    print(f"[DLQ] Trace: {error_trace}")
    
    sync_update_job_error(job_id, f"Failed at {failed_stage}: {error_trace}")
    
    # Future: Trigger WebSocket/SSE broadcast to notify frontend
    
    return {"status": "DLQ_PROCESSED", "job_id": job_id}
