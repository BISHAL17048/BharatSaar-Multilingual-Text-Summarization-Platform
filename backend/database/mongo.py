from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings
import asyncio

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    async def connect(cls):
        print(f"Connecting to MongoDB at {settings.MONGO_URI}...")
        cls.client = AsyncIOMotorClient(settings.MONGO_URI)
        cls.db = cls.client[settings.MONGO_DB_NAME]
        print("Connected to MongoDB.")

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB.")

# Utility to get DB instance dynamically
def get_db():
    try:
        if MongoDB.client is None or (hasattr(MongoDB.client, 'get_io_loop') and MongoDB.client.get_io_loop().is_closed()):
            MongoDB.client = AsyncIOMotorClient(settings.MONGO_URI)
            MongoDB.db = MongoDB.client[settings.MONGO_DB_NAME]
    except Exception as e:
        MongoDB.client = AsyncIOMotorClient(settings.MONGO_URI)
        MongoDB.db = MongoDB.client[settings.MONGO_DB_NAME]
    return MongoDB.db
