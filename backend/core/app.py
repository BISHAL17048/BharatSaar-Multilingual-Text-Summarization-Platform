from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from contextlib import asynccontextmanager
from database.mongo import MongoDB
from database.chroma import init_chroma

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to databases on startup
    await MongoDB.connect()
    init_chroma()
    yield
    # Disconnect on shutdown
    await MongoDB.disconnect()

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # In production, restrict this to frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    from routers.documents_router import router as docs_router
    from routers.auth_router import router as auth_router
    from routers.pipeline_router import router as pipeline_router
    from routers.intelligence_router import router as intelligence_router
    from routers.search_router import router as search_router
    from routers.system_router import router as system_router
    from routers.translation_router import router as translation_router
    
    app.include_router(docs_router, prefix=settings.API_V1_STR)
    app.include_router(auth_router, prefix=settings.API_V1_STR)
    app.include_router(pipeline_router, prefix=settings.API_V1_STR)
    app.include_router(intelligence_router, prefix=settings.API_V1_STR)
    app.include_router(search_router, prefix=settings.API_V1_STR)
    app.include_router(system_router, prefix=settings.API_V1_STR)
    app.include_router(translation_router, prefix=settings.API_V1_STR)

    @app.get("/health", tags=["system"])
    async def health_check():
        return {"status": "ok", "db": "pending", "queue": "pending"}

    return app

app = create_app()
