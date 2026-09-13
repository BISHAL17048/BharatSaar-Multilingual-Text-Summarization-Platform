# Model Weights

Model weights and checkpoints are excluded from this repository due to their size (>30GB total).

To download all required model weights locally:

```bash
python model_server/download_weights.py
```

Optional: If needed, set your `HF_TOKEN` environment variable before running:
```bash
# PowerShell
$env:HF_TOKEN="your_huggingface_token"

# Bash
export HF_TOKEN="your_huggingface_token"
```

### Models Downloaded:
- `PaddlePaddle/PaddleOCR-VL-1.6`
- `segment-any-text/sat-3l-sm`
- `Qwen/Qwen3-1.7B`
- `Qwen/Qwen3-4B`
- `BAAI/bge-m3`
- `ai4bharat/IndicBERT-v3-270M`
- `urchade/gliner_multi-v2.1`
- `BAAI/bge-reranker-v2-m3`
- `ai4bharat/indictrans2-indic-indic-dist-320M`
- `ai4bharat/indictrans2-en-indic-dist-200M`
- `ai4bharat/indictrans2-indic-en-dist-200M`
- FastText Language ID (`lid.176.bin`)
