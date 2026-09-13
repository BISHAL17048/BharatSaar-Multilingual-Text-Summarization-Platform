from fastapi import APIRouter
from schemas.common import BaseResponse
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["authentication"])

class AuthRequest(BaseModel):
    token: str

@router.post("/verify", response_model=BaseResponse, summary="Verify Firebase JWT Token")
async def verify_auth(request: AuthRequest):
    """
    Verifies a Firebase JWT token and initializes the user profile.
    """
    # Mock token verification
    return BaseResponse(
        message="Token verified successfully",
        data={"user_id": "mock_user_123", "email": "test@example.com"}
    )
