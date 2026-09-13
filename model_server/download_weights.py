import os
import requests
from huggingface_hub import snapshot_download, login

# Hugging Face token (optional, read from environment variable)
HF_TOKEN = os.getenv("HF_TOKEN", "")
if HF_TOKEN:
    login(token=HF_TOKEN)

# Download everything into a dedicated 'weights' folder inside model_server
WEIGHTS_DIR = os.path.join(os.path.dirname(__file__), "weights")
os.makedirs(WEIGHTS_DIR, exist_ok=True)

models = [
    "PaddlePaddle/PaddleOCR-VL-1.6",
    "segment-any-text/sat-3l-sm",
    "Qwen/Qwen3-1.7B",
    "Qwen/Qwen3-4B",
    "BAAI/bge-m3",
    "ai4bharat/IndicBERT-v3-270M",
    "urchade/gliner_multi-v2.1",
    "BAAI/bge-reranker-v2-m3",
    "ai4bharat/indictrans2-indic-indic-dist-320M",
    "ai4bharat/indictrans2-en-indic-dist-200M",
    "ai4bharat/indictrans2-indic-en-dist-200M"
]

print(f"Target directory for weights: {WEIGHTS_DIR}")
print("Starting download of HuggingFace models. This may take a while depending on bandwidth...")

for repo_id in models:
    print(f"\n--- Downloading {repo_id} ---")
    try:
        # We download directly to the weights folder, avoiding symlinks for easier docker mounting later
        snapshot_download(
            repo_id=repo_id, 
            local_dir=os.path.join(WEIGHTS_DIR, repo_id.split('/')[-1]),
            local_dir_use_symlinks=False
        )
        print(f"Successfully downloaded {repo_id}")
    except Exception as e:
        print(f"Failed to download {repo_id}: {e}")

print("\n--- Downloading FastText Language ID model ---")
fasttext_url = "https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.bin"
fasttext_path = os.path.join(WEIGHTS_DIR, "lid.176.bin")
if not os.path.exists(fasttext_path):
    try:
        response = requests.get(fasttext_url, stream=True)
        response.raise_for_status()
        with open(fasttext_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("FastText model downloaded successfully.")
    except Exception as e:
        print(f"Failed to download FastText model: {e}")
else:
    print("FastText model already exists.")

print("\nAll downloads complete!")
