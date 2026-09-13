from services.extractors.base import BaseExtractor
import feedparser

class WebExtractor(BaseExtractor):
    def __init__(self, document_type: str):
        self.document_type = document_type

    async def extract(self, url: str) -> dict:
        if self.document_type == "RSS_FEED":
            return await self._extract_rss(url)
        return await self._extract_webpage(url)

    async def _extract_webpage(self, url: str) -> dict:
        import trafilatura
        import requests
        from bs4 import BeautifulSoup

        extracted_text = ""
        title = ""

        # Strategy 1: crawl4ai (Playwright headless browser - handles JS-rendered pages)
        try:
            from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode
            async with AsyncWebCrawler() as crawler:
                config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
                result = await crawler.arun(url=url, config=config)
                if result.success:
                    raw_html = result.html or ""
                    traf_text = trafilatura.extract(
                        raw_html,
                        include_comments=False,
                        include_tables=False,
                        include_links=False,
                        favor_precision=True
                    ) or ""
                    
                    md_text = result.markdown or ""
                    # Trafilatura provides the highest precision for news articles (strips headers/footers).
                    # We fallback to Crawl4AI's raw markdown only if Trafilatura fails.
                    if traf_text and len(traf_text) > 200:
                        extracted_text = traf_text
                    elif len(md_text) > 200:
                        import re
                        md_clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', md_text)
                        md_clean = re.sub(r'!\[[^\]]*\]\([^)]+\)', '', md_clean)
                        md_clean = re.sub(r'#+\s*', '', md_clean)
                        lines = [line for line in md_clean.split('\n') if not re.match(r'^(also read|read more|related|click here):?', line, re.IGNORECASE)]
                        md_clean = "\n".join(lines)
                        md_clean = re.sub(r'\n{3,}', '\n\n', md_clean).strip()
                        extracted_text = md_clean
                    else:
                        extracted_text = traf_text or md_text
                    
                    # Get title from metadata if available
                    if result.metadata and result.metadata.get("title"):
                        title = result.metadata["title"]
        except Exception as e:
            print(f"crawl4ai extraction failed for {url}: {e}")

        # Strategy 2: requests + trafilatura on raw HTML (good for non-JS pages)
        if not extracted_text or len(extracted_text) < 200:
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                }
                resp = requests.get(url, headers=headers, timeout=15)
                if resp.status_code == 200:
                    raw_html = resp.text
                    traf = trafilatura.extract(
                        raw_html,
                        include_comments=False,
                        include_tables=False,
                        include_links=False,
                        favor_precision=True
                    ) or ""
                    if len(traf) > len(extracted_text):
                        extracted_text = traf
                    if not title:
                        try:
                            soup = BeautifulSoup(raw_html, 'html.parser')
                            title = soup.title.string.strip() if soup.title and soup.title.string else ""
                        except Exception:
                            pass
            except Exception as e:
                print(f"requests+trafilatura failed for {url}: {e}")

        # Strategy 3: BeautifulSoup paragraph extraction for JS-rendered content from crawl4ai HTML
        if not extracted_text or len(extracted_text) < 200:
            try:
                headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
                resp = requests.get(url, headers=headers, timeout=15)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, 'html.parser')
                    if not title:
                        title = soup.title.string.strip() if soup.title and soup.title.string else ""
                    for s in soup(["script", "style", "nav", "footer", "header", "aside"]):
                        s.extract()
                    # Try semantic containers first
                    article = (soup.find('article') or soup.find('main') or
                               soup.find('div', class_=lambda c: c and any(x in c.lower() for x in ['article', 'content', 'post', 'story', 'body', 'entry'])))
                    source = article if article else soup
                    paragraphs = [p.get_text().strip() for p in source.find_all('p') if len(p.get_text().strip()) > 40]
                    if paragraphs and len("\n\n".join(paragraphs)) > len(extracted_text):
                        extracted_text = "\n\n".join(paragraphs)
            except Exception as err:
                print(f"BS4 fallback failed for {url}: {err}")

        # Last resort placeholder
        if not extracted_text or len(extracted_text) < 50:
            extracted_text = f"Content from: {url}" + (f" | Title: {title}" if title else "")

        return {
            "raw_text": extracted_text,
            "tables": [],
            "metadata": {"source": url, "title": title}
        }

    async def _extract_rss(self, url: str) -> dict:
        feed = feedparser.parse(url)
        entries = []
        for entry in feed.entries:
            entries.append(f"Title: {entry.title}\nLink: {entry.link}\nSummary: {entry.get('summary', '')}")
            
        return {
            "raw_text": "\n\n".join(entries),
            "tables": [],
            "metadata": {"feed_title": feed.feed.get("title", "Unknown Feed")}
        }
