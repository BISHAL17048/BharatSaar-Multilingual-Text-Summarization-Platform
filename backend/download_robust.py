import os
import requests
from tqdm import tqdm
import time

urls = [
    "https://huggingface.co/sarvamai/sarvam-translate/resolve/main/model-00001-of-00002.safetensors",
    "https://huggingface.co/sarvamai/sarvam-translate/resolve/main/model-00002-of-00002.safetensors"
]
local_dir = r"..\model_server\weights\sarvam-translate"
os.makedirs(local_dir, exist_ok=True)

for url in urls:
    filename = url.split("/")[-1]
    local_path = os.path.join(local_dir, filename)
    
    headers = {}
    if os.path.exists(local_path):
        headers["Range"] = f"bytes={os.path.getsize(local_path)}-"
        
    print(f"Downloading {filename}...")
    response = requests.get(url, headers=headers, stream=True, allow_redirects=True, timeout=30)
    
    if response.status_code in [200, 206]:
        total_size = int(response.headers.get("content-length", 0))
        mode = "ab" if response.status_code == 206 else "wb"
        
        with open(local_path, mode) as f, tqdm(
            desc=filename,
            total=total_size,
            unit="iB",
            unit_scale=True,
            unit_divisor=1024,
        ) as bar:
            for data in response.iter_content(chunk_size=1024*1024):
                if data:
                    size = f.write(data)
                    bar.update(size)
    else:
        print(f"Failed or already fully downloaded: {response.status_code}")

