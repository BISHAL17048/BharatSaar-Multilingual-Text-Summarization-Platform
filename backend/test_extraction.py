import asyncio
from services.extractors.web_extractor import WebExtractor
import json

async def main():
    url = "https://assam.nenow.in/vedanta-donates-%e2%82%b97-crore-for-assam-flood-relief-chief-minister-thanks-anil-agarwal/"
    extractor = WebExtractor("ARTICLE")
    print(f"Starting extraction for {url}")
    result = await extractor.extract(url)
    
    print("\n--- EXTRACTION RESULT ---")
    print(f"Title: {result.get('metadata', {}).get('title')}")
    print(f"Raw Text Length: {len(result.get('raw_text', ''))}")
    print(f"Preview (first 500 chars):\n{result.get('raw_text', '')[:500]}")
    
if __name__ == "__main__":
    asyncio.run(main())
