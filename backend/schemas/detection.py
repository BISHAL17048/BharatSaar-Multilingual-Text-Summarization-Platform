from pydantic import BaseModel
from typing import Optional

class DetectionResult(BaseModel):
    document_type: str
    processing_strategy: str
    ocr_required: bool
    language: Optional[str] = "unknown"
    estimated_pages: int
    estimated_processing_time: str # e.g., "45 seconds", "2 minutes"
    confidence_score: float
