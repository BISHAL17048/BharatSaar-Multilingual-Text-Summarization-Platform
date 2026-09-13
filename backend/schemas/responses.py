from pydantic import BaseModel
from typing import List, Optional, Dict
from models.document import SourceType
from models.job import JobStatus

class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    message: str

class EntityResponse(BaseModel):
    text: str
    label: str
    start: int
    end: int

class TopicResponse(BaseModel):
    topic: str
    score: float

class IntelligenceResponse(BaseModel):
    headline: Optional[str]
    detailed_summary: Optional[str]
    bullet_summary: Optional[str]
    entities: List[EntityResponse] = []
    keywords: List[str] = []
    topics: List[TopicResponse] = []
