import os
from celery import Celery
from kombu import Queue, Exchange

# Create broker directories for the filesystem transport
broker_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "broker"))
os.makedirs(os.path.join(broker_dir, "out"), exist_ok=True)
os.makedirs(os.path.join(broker_dir, "processed"), exist_ok=True)

BROKER_URL = "filesystem://"
BACKEND_URL = "db+sqlite:///celery_backend.sqlite"

celery_app = Celery(
    "ai_pipeline",
    broker=BROKER_URL,
    backend=BACKEND_URL,
    include=[
        "workers.stages.stage_01_detection",
        "workers.stages.stage_02_parsing",
        "workers.stages.stage_03_linguistics",
        "workers.stages.stage_03b_pivot_translation",
        "workers.stages.stage_04_refinement",
        "workers.stages.stage_05_embedding",
        "workers.stages.stage_06_intelligence",
        "workers.stages.stage_07_summarization",
        "workers.stages.stage_08_translation",
        "workers.dlq_handler"
    ]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True, # Ensure tasks are retried if worker crashes
    worker_prefetch_multiplier=1, # Crucial for heavy tasks to prevent hoarding
    
    # Priority Queue Setup
    task_default_priority=5,
    broker_transport_options={
        'data_folder_in': os.path.join(broker_dir, "out"),
        'data_folder_out': os.path.join(broker_dir, "out"),
        'data_folder_processed': os.path.join(broker_dir, "processed")
    },
    
    # Task Routing
    task_routes={
        'stages.detection': {'queue': 'cpu_queue'},
        'stages.parsing': {'queue': 'ocr_queue'},
        'stages.linguistics': {'queue': 'cpu_queue'},
        'stages.pivot_translation': {'queue': 'translation_queue'},  # Sarvam low-resource pivot
        'stages.refinement': {'queue': 'llm_queue'},
        'stages.embedding': {'queue': 'embedding_queue'},
        'stages.intelligence': {'queue': 'cpu_queue'},
        'stages.summarization': {'queue': 'llm_queue'},
        'stages.translation': {'queue': 'translation_queue'},
        'stages.dlq': {'queue': 'dlq_queue'},
    },
    
    # Define explicitly created queues
    task_queues=(
        Queue('cpu_queue', Exchange('cpu_queue'), routing_key='cpu_queue'),
        Queue('ocr_queue', Exchange('ocr_queue'), routing_key='ocr_queue'),
        Queue('llm_queue', Exchange('llm_queue'), routing_key='llm_queue'),
        Queue('embedding_queue', Exchange('embedding_queue'), routing_key='embedding_queue'),
        Queue('translation_queue', Exchange('translation_queue'), routing_key='translation_queue'),
        Queue('control_queue', Exchange('control_queue'), routing_key='control_queue'),
        Queue('dlq_queue', Exchange('dlq_queue'), routing_key='dlq_queue'),
    )
)

