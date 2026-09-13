from workers.celery_app import celery_app
from workers.stages.stage_01_detection import sync_update_job, run_async
from models.job import JobStatus
from services.extractors.pdf_extractor import PDFExtractor
from services.extractors.web_extractor import WebExtractor
from services.extractors.office_extractor import OfficeExtractor
import asyncio

@celery_app.task(bind=True, name="stages.parsing")
def run_parsing(self, previous_result: dict):
    job_id = previous_result["job_id"]
    sync_update_job(job_id, JobStatus.PROCESSING, "Parsing & Extraction", 25)
    
    meta = previous_result.get("detection_meta", {})
    doc_type = meta.get("document_type", "UNKNOWN")
    ocr_req = meta.get("ocr_required", False)
    
    file_path = previous_result.get("file_path")
    url = previous_result.get("url")
    
    print(f"[{job_id}] Running Parsing Strategy for {doc_type}...")
    
    try:
        if doc_type in ["PDF", "SCANNED_PDF", "DIGITAL_PDF"]:
            extractor = PDFExtractor(ocr_required=ocr_req)
            result = run_async(extractor.extract(file_path))
        
        elif doc_type in ["WEBSITE", "NEWS_URL", "RSS_FEED"]:
            extractor = WebExtractor(document_type=doc_type)
            result = run_async(extractor.extract(url))
            
        elif doc_type in ["DOCX", "PPTX"]:
            extractor = OfficeExtractor(ext=doc_type)
            result = run_async(extractor.extract(file_path))
            
        elif doc_type in ["TXT", "MARKDOWN"]:
            with open(file_path, 'r', encoding='utf-8') as f:
                result = {"raw_text": f.read(), "tables": [], "metadata": {}}
                
        else:
            raise ValueError(f"Unsupported parsing strategy for {doc_type}")
            
        previous_result["raw_text"] = result.get("raw_text", "")
        previous_result["tables"] = result.get("tables", [])
        previous_result["extracted_metadata"] = result.get("metadata", {})
        
        print(f"[{job_id}] Successfully extracted {len(previous_result['raw_text'])} chars.")
        
    except Exception as e:
        sync_update_job(job_id, JobStatus.FAILED, f"Parsing Error (Attempt {self.request.retries + 1}/3)", 25)
        
        if self.request.retries >= 2: # Max retries exhausted (0, 1, 2 = 3 tries)
            # Route to DLQ
            celery_app.send_task("stages.dlq", args=[job_id, "Parsing Stage", str(e)], queue="dlq_queue")
            raise e
            
        # Exponential backoff: 10s, 30s
        delay = 10 * (3 ** self.request.retries)
        print(f"[{job_id}] Retrying in {delay}s due to: {str(e)}")
        raise self.retry(exc=e, countdown=delay, max_retries=2)

    return previous_result
