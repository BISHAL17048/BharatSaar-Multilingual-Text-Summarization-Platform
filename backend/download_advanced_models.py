import os
from huggingface_hub import snapshot_download

def download_models():
    base_dir = os.path.abspath(os.path.join("..", "model_server", "weights"))
    
    # indicxlit
    xlit_dir = os.path.join(base_dir, "IndicXlit")
    print(f"Downloading ai4bharat/IndicXlit to {xlit_dir}...")
    snapshot_download(
        repo_id="ai4bharat/IndicXlit",
        local_dir=xlit_dir,
        local_dir_use_symlinks=False,
        resume_download=True
    )
    print("IndicXlit downloaded successfully.")

if __name__ == '__main__':
    download_models()
