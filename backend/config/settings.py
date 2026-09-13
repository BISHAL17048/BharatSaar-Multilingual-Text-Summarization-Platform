from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BharatSaar API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB Configuration
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "docintel"
    
    # ChromaDB Configuration
    CHROMA_PERSIST_DIRECTORY: str = "chroma_data"
    
    # Redis / Celery Configuration
    REDIS_URL: str = "sqla+sqlite:///celery_backend.sqlite"
    
    # Model Server URLs
    OCR_SERVER_URL: str = "http://localhost:8001"
    EMBEDDING_SERVER_URL: str = "http://localhost:8002"
    NLP_SERVER_URL: str = "http://localhost:8003"
    LLM_SERVER_URL: str = "http://localhost:8004"
    WEB_SERVER_URL: str = "http://localhost:8005"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"

settings = Settings()
