# Start everything script
Write-Host "Starting Multilingual Document Intelligence Platform..." -ForegroundColor Green

# 1. Start FastAPI Backend (Port 8000)
Write-Host "Starting Backend API (8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; uvicorn core.app:app --host 0.0.0.0 --port 8000 --reload`""

# 2. Start Microservices
Write-Host "Starting PaddleOCR Service (8001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd model_server/paddleocr_service; uvicorn main:app --host 0.0.0.0 --port 8001`""

Write-Host "Starting Embedding Service (8002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd model_server/embedding_service; uvicorn main:app --host 0.0.0.0 --port 8002`""

Write-Host "Starting Indic NLP Service (8003)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd model_server/indic_nlp_service; uvicorn main:app --host 0.0.0.0 --port 8003`""

Write-Host "Starting Qwen LLM Service (8004)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd model_server/qwen_vllm_service; uvicorn main:app --host 0.0.0.0 --port 8004`""

# 3. Start Celery Worker
Write-Host "Starting Celery Pipeline Worker..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; celery -A workers.celery_app worker -l INFO -Q cpu_queue,ocr_queue,llm_queue,embedding_queue,control_queue,translation_queue,dlq_queue`""

# 4. Start React Frontend
Write-Host "Starting React Frontend (5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`""

Write-Host "All systems initialized!" -ForegroundColor Green
