from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class SourceType(str, Enum):
    TXT = "TXT"
    PDF = "PDF"
    DOCX = "DOCX"
    PPTX = "PPTX"
    HTML = "HTML"
    MARKDOWN = "MARKDOWN"
    NEWS_URL = "NEWS_URL"
    WEBSITE = "WEBSITE"
    RSS_FEED = "RSS_FEED"
    YOUTUBE = "YOUTUBE"

class DocumentModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    job_id: str
    user_id: str
    source_type: SourceType
    original_name: str
    storage_path: Optional[str] = None
    url: Optional[str] = None
    language: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
