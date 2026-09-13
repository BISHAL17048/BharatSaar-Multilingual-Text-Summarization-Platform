from abc import ABC, abstractmethod

class BaseExtractor(ABC):
    @abstractmethod
    async def extract(self, source: str) -> dict:
        """
        Extracts content from a source (file_path or url).
        Returns a dictionary containing:
        - raw_text: The complete markdown/text extracted
        - tables: Extracted markdown tables
        - metadata: Dictionary of document metadata
        """
        pass
