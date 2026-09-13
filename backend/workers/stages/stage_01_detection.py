from workers.celery_app import celery_app
from repositories.job_repo import JobRepository
from models.job import JobStatus
from services.detection_engine import InputDetectionEngine
import asyncio

def run_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor() as pool:
            return pool.submit(lambda: asyncio.run(coro)).result()
    else:
        return asyncio.run(coro)

def sync_update_job(job_id, status, stage, progress):
    run_async(JobRepository.update_job_status(job_id, status, stage, progress))

@celery_app.task(bind=True, name="stages.detection")
def run_detection(self, job_id: str, document_id: str, url: str = None, file_path: str = None):
    sync_update_job(job_id, JobStatus.PROCESSING, "Detection", 10)
    print(f"[{job_id}] Running Intelligent Detection Engine...")
    
    # 1. Run detection heuristic engine
    try:
        detection_result = InputDetectionEngine.analyze_input(file_path=file_path, url=url)
        print(f"[{job_id}] Detected: {detection_result.document_type} | OCR: {detection_result.ocr_required}")
    except Exception as e:
        sync_update_job(job_id, JobStatus.FAILED, "Detection Failed", 10)
        raise e
    
    # 2. Pass intelligence forward to the next parsing stage
    return {
        "job_id": job_id, 
        "document_id": document_id, 
        "url": url,
        "file_path": file_path,
        "detection_meta": detection_result.model_dump()
    }
