from fastapi import FastAPI, HTTPException
import httpx
import asyncio
import logging

app = FastAPI(title="GPU VRAM Manager & Model Proxy")
logger = logging.getLogger("VRAM_Manager")

# Mock configuration mapping models to their dedicated service ports
MODEL_SERVICES = {
    "paddleocr": "http://paddleocr_service:8001",
    "qwen_vllm": "http://qwen_vllm_service:8002",
    "indic_nlp": "http://indic_nlp_service:8003",
    "embeddings": "http://embedding_service:8004",
}

# Simple lock to prevent OOM - in a real scenario, this tracks actual GPU memory via NVML
active_model = None
lock = asyncio.Lock()

async def ensure_model_loaded(model_name: str):
    """
    Simulates spinning up a model container and shutting down others to free VRAM.
    """
    global active_model
    async with lock:
        if active_model != model_name:
            if active_model:
                logger.info(f"Unloading {active_model} from GPU to free VRAM...")
                # In production: Use docker SDK to stop container or send unload API call
                await asyncio.sleep(1) 
            
            logger.info(f"Loading {model_name} into GPU...")
            # In production: Use docker SDK to start container or send load API call
            await asyncio.sleep(2)
            active_model = model_name
            logger.info(f"{model_name} is now active.")

@app.post("/proxy/{model_name}/{path:path}")
async def proxy_request(model_name: str, path: str, request_data: dict):
    """
    Celery workers call this proxy endpoint.
    It ensures the model is loaded in VRAM before forwarding the request.
    """
    if model_name not in MODEL_SERVICES:
        raise HTTPException(status_code=404, detail="Model service not found")

    await ensure_model_loaded(model_name)
    
    target_url = f"{MODEL_SERVICES[model_name]}/{path}"
    
    # Forward the request to the isolated model container
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(target_url, json=request_data, timeout=120.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=str(e))
