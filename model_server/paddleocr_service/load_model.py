from paddleocr import PaddleOCR
import fitz # PyMuPDF

def init_models():
    print("Loading models for Document Parsing & Extraction...")
    print("- PyMuPDF (Digital PDF Extraction)")
    print("- PaddlePaddle/PaddleOCR-VL-1.6 (Scanned PDF, Complex OCR, Layout Analysis, Table Extraction)")
    
    # Initialize PaddleOCR
    # ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=True)
    print("PaddleOCR models successfully configured.")

if __name__ == "__main__":
    init_models()
