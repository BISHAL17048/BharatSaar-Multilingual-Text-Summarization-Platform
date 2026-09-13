from fastapi import APIRouter
from schemas.common import BaseResponse

router = APIRouter(prefix="/system", tags=["system"])

@router.get("/metrics", response_model=BaseResponse, summary="Get System Metrics")
async def get_metrics():
    # Typically would use NVML or psutil here
    return BaseResponse(data={"cpu_usage": 45.2, "gpu_usage": 80.5, "vram_allocated": "12GB"})

@router.get("/settings", response_model=BaseResponse, summary="Get App Settings")
async def get_settings():
    return BaseResponse(data={"theme": "dark", "default_language": "en"})

@router.get("/models", response_model=BaseResponse, summary="Get Model Manager Status")
async def get_models_status():
    return BaseResponse(data={
        "qwen": {"status": "loaded", "device": "cuda:0"},
        "paddleocr": {"status": "loaded", "device": "cuda:1"}
    })
