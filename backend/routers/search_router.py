from fastapi import APIRouter
from schemas.common import BaseResponse
from pydantic import BaseModel

router = APIRouter(prefix="/search", tags=["search"])

class SearchRequest(BaseModel):
    query: str
    limit: int = 5

@router.post("/semantic", response_model=BaseResponse, summary="Semantic Document Search")
async def semantic_search(request: SearchRequest):
    # Query ChromaDB
    return BaseResponse(data={"results": [{"doc_id": "mock1", "snippet": "Mock search match", "score": 0.89}]})
