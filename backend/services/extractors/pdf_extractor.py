from services.extractors.base import BaseExtractor
from config.settings import settings
import aiohttp
import fitz

class PDFExtractor(BaseExtractor):
    def __init__(self, ocr_required: bool):
        self.ocr_required = ocr_required

    async def extract(self, file_path: str) -> dict:
        if self.ocr_required:
            return await self._extract_via_ocr(file_path)
        return await self._extract_via_pymupdf(file_path)

    async def _extract_via_pymupdf(self, file_path: str) -> dict:
        doc = fitz.open(file_path)
        text_content = []
        tables_content = []
        
        for page in doc:
            text_content.append(page.get_text())
            # Basic fallback table extraction via PyMuPDF (can be routed to Paddle if complex)
            tabs = page.find_tables()
            for tab in tabs:
                tables_content.append(tab.to_markdown())
                
        metadata = doc.metadata
        doc.close()
        
        # Heuristic check for corrupted text (mojibake)
        full_text = "\n".join(text_content)
        if len(full_text) > 100 and full_text.count("") / len(full_text) > 0.05:
            print("Corrupted digital PDF detected, falling back to OCR...")
            return await self._extract_via_ocr(file_path)
            
        return {
            "raw_text": full_text,
            "tables": tables_content,
            "metadata": metadata
        }

    async def _extract_via_ocr(self, file_path: str) -> dict:
        # Call PaddleOCR microservice
        async with aiohttp.ClientSession() as session:
            try:
                # Mock call to model_server
                # with open(file_path, 'rb') as f:
                #     resp = await session.post(f"{settings.OCR_SERVER_URL}/extract", data={"file": f})
                #     data = await resp.json()
                data = {"text": "Mock OCR extracted text", "tables": ["| Mock | Table |"], "metadata": {}}
                return {
                    "raw_text": data.get("text", ""),
                    "tables": data.get("tables", []),
                    "metadata": data.get("metadata", {})
                }
            except Exception as e:
                raise Exception(f"OCR Service Failed: {str(e)}")
