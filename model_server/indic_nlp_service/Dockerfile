FROM python:3.11-slim

# Install system build dependencies for C++ compilation (FastText)
RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install fasttext, numpy<2.0.0 (required for fasttext compatibility), and dependencies
RUN pip install --no-cache-dir "numpy<2.0.0" fasttext fastapi uvicorn pydantic langdetect

# Copy service source code
COPY main.py .

EXPOSE 8003

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8003"]
