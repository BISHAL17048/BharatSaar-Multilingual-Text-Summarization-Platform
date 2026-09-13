import mimetypes
import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from schemas.detection import DetectionResult

try:
    import fitz # PyMuPDF
except ImportError:
    fitz = None

try:
    from langdetect import detect
except ImportError:
    def detect(text): return "unknown"

class InputDetectionEngine:
    @staticmethod
    def analyze_input(file_path: str = None, url: str = None) -> DetectionResult:
        if file_path and url:
            # Technically Multi-document or mixed, but let's handle strictly based on inputs passed
            pass
            
        if url and not file_path:
            return InputDetectionEngine._analyze_url(url)
            
        if file_path and not url:
            if isinstance(file_path, list) or "," in file_path:
                return InputDetectionEngine._generate_multi_document_result(len(file_path))
            return InputDetectionEngine._analyze_file(file_path)
            
        raise ValueError("Must provide either a file_path or a url")

    @staticmethod
    def _analyze_url(url: str) -> DetectionResult:
        parsed_url = urlparse(url)
        
        # 1. YouTube Detection
        if "youtube.com/watch" in url or "youtu.be" in url:
            return DetectionResult(
                document_type="YOUTUBE_TRANSCRIPT",
                processing_strategy="YOUTUBE_API -> REFINEMENT",
                ocr_required=False,
                language="unknown", # Cannot reliably detect without fetching transcript
                estimated_pages=5, # Abstract representation of length
                estimated_processing_time="10 seconds",
                confidence_score=0.99
            )

        # 2. RSS Feed Detection
        if url.endswith(".rss") or url.endswith(".xml"):
            return DetectionResult(
                document_type="RSS_FEED",
                processing_strategy="FEEDPARSER -> MULTI_DOCUMENT_ROUTER",
                ocr_required=False,
                estimated_pages=10,
                estimated_processing_time="15 seconds",
                confidence_score=0.95
            )

        # 3. Fetch web page snippet to determine News vs Website and Language
        try:
            response = requests.get(url, timeout=5)
            content_type = response.headers.get("Content-Type", "")
            
            if "rss" in content_type or "xml" in content_type:
                return DetectionResult(
                    document_type="RSS_FEED",
                    processing_strategy="FEEDPARSER -> MULTI_DOCUMENT_ROUTER",
                    ocr_required=False,
                    estimated_pages=10,
                    estimated_processing_time="15 seconds",
                    confidence_score=0.95
                )

            soup = BeautifulSoup(response.text, 'html.parser')
            text_snippet = soup.get_text()[:1000]
            
            try:
                lang = detect(text_snippet) if text_snippet.strip() else "unknown"
            except:
                lang = "unknown"

            # Check for News Article meta tags
            og_type = soup.find("meta", property="og:type")
            is_news = og_type and og_type.get("content") == "article"

            return DetectionResult(
                document_type="NEWS_URL" if is_news else "WEBSITE",
                processing_strategy="CRAWL4AI / TRAFILATURA -> REFINEMENT",
                ocr_required=False,
                language=lang,
                estimated_pages=3, # Web pages usually equal 2-3 standard PDF pages of text
                estimated_processing_time="8 seconds",
                confidence_score=0.88 if is_news else 0.90
            )

        except Exception as e:
            # Fallback if request fails
            return DetectionResult(
                document_type="WEBSITE",
                processing_strategy="CRAWL4AI",
                ocr_required=False,
                estimated_pages=3,
                estimated_processing_time="10 seconds",
                confidence_score=0.60
            )

    @staticmethod
    def _analyze_file(file_path: str) -> DetectionResult:
        mime_type, _ = mimetypes.guess_type(file_path)
        ext = os.path.splitext(file_path)[1].lower()
        
        document_type = "UNKNOWN"
        strategy = "UNKNOWN"
        ocr = False
        lang = "unknown"
        est_pages = 1
        est_time = 0
        conf = 0.99

        if ext == '.pdf' or mime_type == 'application/pdf':
            document_type = "PDF"
            if fitz:
                try:
                    doc = fitz.open(file_path)
                    est_pages = doc.page_count
                    # Check first page for text to deduce if it's scanned
                    if est_pages > 0:
                        first_page_text = doc[0].get_text()
                        if len(first_page_text.strip()) < 50:
                            ocr = True
                            document_type = "SCANNED_PDF"
                            strategy = "PADDLEOCR -> LAYOUT_ANALYSIS"
                            est_time = est_pages * 5 # 5s per page for OCR
                        else:
                            ocr = False
                            document_type = "DIGITAL_PDF"
                            strategy = "PYMUPDF -> PADDLEOCR_FOR_TABLES"
                            est_time = est_pages * 0.5
                            try:
                                lang = detect(first_page_text[:1000])
                            except:
                                pass
                    doc.close()
                except Exception:
                    # PDF read failed, fallback to OCR
                    ocr = True
                    strategy = "PADDLEOCR -> LAYOUT_ANALYSIS"
                    est_time = 30
            else:
                strategy = "PDF_ROUTER"

        elif ext == '.txt' or mime_type == 'text/plain':
            document_type = "TXT"
            strategy = "DIRECT_TEXT_READ"
            est_time = 1
            ocr = False

        elif ext in ['.md', '.markdown'] or mime_type == 'text/markdown':
            document_type = "MARKDOWN"
            strategy = "MARKDOWN_PARSER"
            est_time = 2
            ocr = False
            
        elif ext == '.docx':
            document_type = "DOCX"
            strategy = "PYTHON_DOCX"
            est_time = 5
            ocr = False
            
        elif ext == '.pptx':
            document_type = "PPTX"
            strategy = "PYTHON_PPTX"
            est_time = 8
            ocr = False
            
        else:
            document_type = "UNSUPPORTED"
            strategy = "FAIL"
            conf = 0.0

        time_str = f"{int(est_time)} seconds" if est_time < 60 else f"{round(est_time/60, 1)} minutes"

        return DetectionResult(
            document_type=document_type,
            processing_strategy=strategy,
            ocr_required=ocr,
            language=lang,
            estimated_pages=est_pages,
            estimated_processing_time=time_str,
            confidence_score=conf
        )

    @staticmethod
    def _generate_multi_document_result(count: int) -> DetectionResult:
        return DetectionResult(
            document_type="MULTI_DOCUMENT",
            processing_strategy="BATCH_ROUTER",
            ocr_required=False,
            language="mixed",
            estimated_pages=count * 5,
            estimated_processing_time=f"{count * 10} seconds",
            confidence_score=0.99
        )
