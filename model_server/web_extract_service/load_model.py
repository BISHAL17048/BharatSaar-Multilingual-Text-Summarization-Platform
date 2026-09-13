import trafilatura
from youtube_transcript_api import YouTubeTranscriptApi
import feedparser
# from crawl4ai import WebCrawler

def init_models():
    print("Loading tools for Web/URL Parsing...")
    print("- crawl4AI & trafilatura (Website / News Extraction)")
    print("- youtube-transcript-api (YouTube Transcripts)")
    print("- feedparser (RSS Feeds)")
    print("Web extraction tools successfully configured.")

if __name__ == "__main__":
    init_models()
