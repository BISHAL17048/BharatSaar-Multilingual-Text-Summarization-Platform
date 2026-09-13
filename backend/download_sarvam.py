from huggingface_hub import snapshot_download
import os

model_id = "sarvamai/sarvam-translate"
local_dir = r"..\model_server\weights\sarvam-translate"

print(f"Downloading {model_id} to {local_dir}...")
snapshot_download(repo_id=model_id, local_dir=local_dir)
print("Download complete.")

