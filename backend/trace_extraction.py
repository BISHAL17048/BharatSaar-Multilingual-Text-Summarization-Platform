import asyncio
import trafilatura
import requests
from bs4 import BeautifulSoup

async def main():
    url = "https://assam.nenow.in/vedanta-donates-%e2%82%b97-crore-for-assam-flood-relief-chief-minister-thanks-anil-agarwal/"
    print(f"Starting extraction trace for {url}")
    
    extracted_text = ""
    title = ""

    # Strategy 1: crawl4ai
    print("\n--- Strategy 1: Crawl4AI ---")
    try:
        from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
        async with AsyncWebCrawler() as crawler:
            config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
            result = await crawler.arun(url=url, config=config)
            if result.success:
                print("Crawl4AI successfully fetched the page.")
                raw_html = result.html or ""
                
                print("\n--- Strategy 1b: Trafilatura on Crawl4AI HTML ---")
                traf_text = trafilatura.extract(
                    raw_html,
                    include_comments=False,
                    include_tables=False,
                    include_links=False,
                    favor_precision=True
                ) or ""
                
                md_text = result.markdown or ""
                
                if traf_text and len(traf_text) > 200:
                    print(f"Success! Trafilatura extracted {len(traf_text)} chars from Crawl4AI HTML.")
                    extracted_text = traf_text
                elif len(md_text) > 200:
                    print(f"Trafilatura failed/insufficient. Falling back to Crawl4AI Markdown ({len(md_text)} chars).")
                    import re
                    md_clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', md_text)
                    md_clean = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', md_clean)
                    md_clean = re.sub(r'#+\s*', '', md_clean)
                    lines = [line for line in md_clean.split('\n') if not re.match(r'^(also read|read more|related|click here):?', line, re.IGNORECASE)]
                    md_clean = "\n".join(lines)
                    md_clean = re.sub(r'\n{3,}', '\n\n', md_clean).strip()
                    extracted_text = md_clean
                    print(f"Cleaned Markdown length: {len(extracted_text)}")
                else:
                    print("Both Trafilatura and Crawl4AI Markdown yielded insufficient text.")
                    extracted_text = traf_text or md_text
                
                if result.metadata and result.metadata.get("title"):
                    title = result.metadata["title"]
                    print(f"Found title in metadata: {title}")
            else:
                print("Crawl4AI failed to fetch the page.")
    except Exception as e:
        print(f"crawl4ai extraction failed with error: {e}")

    # Strategy 2: requests + trafilatura
    if not extracted_text or len(extracted_text) < 200:
        print("\n--- Strategy 2: requests + Trafilatura ---")
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
            resp = requests.get(url, headers=headers, timeout=15)
            if resp.status_code == 200:
                print("requests successfully fetched the page.")
                raw_html = resp.text
                traf = trafilatura.extract(
                    raw_html,
                    include_comments=False,
                    include_tables=False,
                    include_links=False,
                    favor_precision=True
                ) or ""
                if len(traf) > len(extracted_text):
                    print(f"Success! Trafilatura extracted {len(traf)} chars.")
                    extracted_text = traf
                if not title:
                    soup = BeautifulSoup(raw_html, 'html.parser')
                    title = soup.title.string.strip() if soup.title and soup.title.string else ""
        except Exception as e:
            print(f"requests+trafilatura failed: {e}")

    # Strategy 3: BeautifulSoup fallback
    if not extracted_text or len(extracted_text) < 200:
        print("\n--- Strategy 3: BeautifulSoup Semantic Fallback ---")
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            resp = requests.get(url, headers=headers, timeout=15)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                for s in soup(["script", "style", "nav", "footer", "header", "aside"]):
                    s.extract()
                article = (soup.find('article') or soup.find('main') or
                           soup.find('div', class_=lambda c: c and any(x in c.lower() for x in ['article', 'content', 'post'])))
                source = article if article else soup
                paragraphs = [p.get_text().strip() for p in source.find_all('p') if len(p.get_text().strip()) > 40]
                if paragraphs and len("\n\n".join(paragraphs)) > len(extracted_text):
                    extracted_text = "\n\n".join(paragraphs)
                    print(f"Success! BeautifulSoup extracted {len(extracted_text)} chars.")
        except Exception as err:
            print(f"BS4 fallback failed: {err}")

    print("\n--- FINAL EXTRACTION RESULT ---")
    print(f"Title: {title}")
    print(f"Raw Text Length: {len(extracted_text)}")
    print(f"Preview (first 200 chars):\n{extracted_text[:200]}")

if __name__ == "__main__":
    asyncio.run(main())
