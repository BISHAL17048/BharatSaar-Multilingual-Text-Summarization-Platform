from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from schemas.requests import URLUploadRequest
from schemas.responses import JobResponse
from schemas.common import BaseResponse, ErrorResponse
from services.job_service import JobService
from repositories.document_repo import DocumentRepository
from models.job import JobStatus
import os
import uuid

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/file", response_model=BaseResponse[JobResponse], summary="Upload Document File")
async def process_file(user_id: str, file: UploadFile = File(...)):
    try:
        # Save file to a temporary uploads directory
        uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
        os.makedirs(uploads_dir, exist_ok=True)
        
        file_ext = os.path.splitext(file.filename)[1]
        temp_file_path = os.path.join(uploads_dir, f"{uuid.uuid4()}{file_ext}")
        
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())
            
        job_id = await JobService.process_file(temp_file_path, user_id, file.filename)
        return BaseResponse(
            message="Document processing job queued successfully.",
            data=JobResponse(job_id=job_id, status=JobStatus.PENDING, message="Queued")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/url", response_model=BaseResponse[JobResponse], summary="Upload Document via URL")
async def process_url(request: URLUploadRequest):
    try:
        job_id = await JobService.process_url(str(request.url), request.user_id)
        return BaseResponse(
            message="Document processing job queued successfully.",
            data=JobResponse(job_id=job_id, status=JobStatus.PENDING, message="Queued")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=BaseResponse, summary="Get Document History")
async def get_document_history(user_id: str):
    """ Returns a list of processed documents for a user. """
    docs = await DocumentRepository.get_user_documents(user_id)
    return BaseResponse(
        message="History fetched",
        data={"documents": docs}
    )

@router.get("/{doc_id}", response_model=BaseResponse, summary="Get Document Details")
async def get_document(doc_id: str):
    doc = await DocumentRepository.get_document(doc_id)
    if not doc:
        return BaseResponse(success=False, message="Document not found")
    return BaseResponse(data=doc)

class RenameRequest(BaseModel):
    name: str

@router.patch("/{doc_id}/rename", response_model=BaseResponse, summary="Rename Document")
async def rename_document(doc_id: str, body: RenameRequest):
    name = body.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Name cannot be empty")
    success = await DocumentRepository.rename_document(doc_id, name)
    if not success:
        return BaseResponse(success=False, message="Document not found or name unchanged")
    return BaseResponse(message="Document renamed successfully")

@router.delete("/{doc_id}", response_model=BaseResponse, summary="Delete Document")
async def delete_document(doc_id: str):
    success = await DocumentRepository.delete_document(doc_id)
    if not success:
        return BaseResponse(success=False, message="Document not found or could not be deleted")
    return BaseResponse(message="Document deleted successfully")

