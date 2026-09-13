from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class JobModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    document_id: Optional[str] = None
    status: JobStatus = JobStatus.PENDING
    current_stage: str = "Initializing"
    progress_percentage: int = 0
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
