import os
import fasttext
from workers.celery_app import celery_app

@celery_app.task(name="test_fasttext_bodo")
def test_bodo_detection():
    try:
        text = "क'क्राझारआव 20थि ब'ड'लेन्ड मुंख्लंफोरनि सनानि काप जोलुर बादायलायनाय जागायजेनो।"
        model_path = os.path.abspath(os.path.join(
            os.path.dirname(__file__), "..", "..", "..", 
            "model_server", "weights", "indiclid", "indiclid-ftn.bin"
        ))
        
        model = fasttext.load_model(model_path)
        res = model.predict(text.replace("\n", " "), k=1)
        raw_label = res[0][0].replace("__label__", "")
        confidence = float(res[1][0])
        
        with open("backend/scratch/bodo_test_result.txt", "w", encoding="utf-8") as f:
            f.write(f"Label: {raw_label}, Confidence: {confidence}\n")
    except Exception as e:
        with open("backend/scratch/bodo_test_result.txt", "w", encoding="utf-8") as f:
            f.write(f"Error: {e}\n")
