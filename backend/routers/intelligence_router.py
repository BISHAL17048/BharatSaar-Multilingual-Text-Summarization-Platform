from fastapi import APIRouter
from schemas.common import BaseResponse
from pydantic import BaseModel

router = APIRouter(prefix="/intelligence", tags=["intelligence"])

class TranslationRequest(BaseModel):
    target_lang: str
    text_type: str = "summary" # or "raw"

@router.get("/{doc_id}/summary", response_model=BaseResponse, summary="Get Document Summary")
async def get_summary(doc_id: str):
    return BaseResponse(data={"headline": "Mock Headline", "summary": "Mock abstractive summary."})

@router.get("/{doc_id}/ner", response_model=BaseResponse, summary="Get Named Entities")
async def get_ner(doc_id: str):
    return BaseResponse(data={"entities": [{"text": "Google", "label": "ORG"}]})

@router.get("/{doc_id}/topics", response_model=BaseResponse, summary="Get Topics & Keywords")
async def get_topics(doc_id: str):
    return BaseResponse(data={"topics": ["AI", "Tech"], "keywords": ["neural networks"]})

@router.post("/{doc_id}/translate", response_model=BaseResponse, summary="Translate Document")
async def translate_doc(doc_id: str, request: TranslationRequest):
    return BaseResponse(data={"translated_text": f"Mock translation to {request.target_lang}"})
