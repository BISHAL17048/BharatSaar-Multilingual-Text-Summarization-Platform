import os
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI(title="Qwen LLM Service")

# Using Qwen3-1.7B for refinement/summarization as default
WEIGHTS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "weights", "Qwen3-1.7B"))

print(f"Loading Qwen3-1.7B from {WEIGHTS_PATH}...")
try:
    tokenizer = AutoTokenizer.from_pretrained(WEIGHTS_PATH, local_files_only=True)
    # Load on GPU if available, else CPU
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = AutoModelForCausalLM.from_pretrained(
        WEIGHTS_PATH, 
        local_files_only=True,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        device_map="auto"
    )
    print(f"Model loaded successfully on {device}!")
except Exception as e:
    print(f"Failed to load LLM: {e}")
    model = None
    tokenizer = None

class GenerationRequest(BaseModel):
    prompt: str
    max_tokens: int = 2048
    temperature: float = 0.1

@app.post("/generate")
async def generate_text(request: GenerationRequest):
    if not model or not tokenizer:
        raise HTTPException(status_code=500, detail="LLM not loaded")
    
    inputs = tokenizer(request.prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs, 
            max_new_tokens=request.max_tokens,
            temperature=request.temperature,
            do_sample=request.temperature > 0
        )
        
    response_text = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    
    return {"text": response_text.strip()}

@app.post("/summarize")
async def summarize_text(request: GenerationRequest):
    # Specialized summarization wrapper
    return await generate_text(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
