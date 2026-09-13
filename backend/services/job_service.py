from repositories.job_repo import JobRepository
from repositories.document_repo import DocumentRepository
from models.job import JobModel, JobStatus
from models.document import DocumentModel, SourceType
from pipelines.dispatcher import PipelineDispatcher

class JobService:
    @staticmethod
    async def process_url(url: str, user_id: str) -> str:
        job = JobModel(user_id=user_id, status=JobStatus.PENDING)
        job_id = await JobRepository.create_job(job)
        
        doc = DocumentModel(
            job_id=job_id,
            user_id=user_id,
            source_type=SourceType.WEBSITE,
            original_name=url,
            url=url
        )
        doc_id = await DocumentRepository.create_document(doc)
        await JobRepository.link_document(job_id, doc_id)
        
        PipelineDispatcher.trigger_full_pipeline(job_id, doc_id, url=url)
        return job_id

    @staticmethod
    async def process_file(file_path: str, user_id: str, original_name: str = None) -> str:
        job = JobModel(user_id=user_id, status=JobStatus.PENDING)
        job_id = await JobRepository.create_job(job)
        
        doc = DocumentModel(
            job_id=job_id,
            user_id=user_id,
            source_type=SourceType.TXT,
            original_name=original_name or file_path,
            url=None
        )
        doc_id = await DocumentRepository.create_document(doc)
        await JobRepository.link_document(job_id, doc_id)
        
        PipelineDispatcher.trigger_full_pipeline(job_id, doc_id, file_path=file_path)
        return job_id
