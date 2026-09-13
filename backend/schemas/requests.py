from pydantic import BaseModel, HttpUrl
from typing import Optional

class URLUploadRequest(BaseModel):
    url: HttpUrl
    user_id: str # For now, passed manually until Auth is fully hooked up
    
class FileUploadRequest(BaseModel):
    # Files are handled via Form Data, but this can hold additional metadata
    user_id: str
