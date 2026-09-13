import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from FlagEmbedding import BGEM3FlagModel

app = FastAPI(title="Embedding Service (BGE-M3)")

# Path to the locally downloaded weights
WEIGHTS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "weights", "bge-m3"))

print(f"Loading BGE-M3 from {WEIGHTS_PATH}...")
try:
    model = BGEM3FlagModel(WEIGHTS_PATH, use_fp16=True)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Failed to load model: {e}")
    model = None

class EmbedRequest(BaseModel):
    text: str

@app.post("/embed")
async def embed_text(request: EmbedRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # BGE-M3 returns dense, sparse, and colbert
    output = model.encode(request.text, return_dense=True, return_sparse=True)
    
    return {
        "dense": output['dense_vecs'].tolist(),
        "sparse": output['lexical_weights']
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
