"""Read-only production smoke checks. Never submits forms or stores customer data.

Verifies that the live deployment contains the intended high-intent pages
and that homepage/portfolio updates have not silently disappeared.
"""
from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET
import sys
import time

BASE = "https://www.nextgentechdev.com"
PAGES = {
    "/": ("TradeBridge-Pro", "StoreOps-Pro", "Ask a question on WhatsApp"),
    "/portfolio": ("SupportPilot-Pro", "InvoiceFlow-Pro", "AgentWatch-Pro"),
    "/ai-voice-agent-development": ("VoiceDesk-Pro", "Appointment Booking"),
    "/shopify-automation-development": ("StoreOps-Pro", "Inventory"),
}
SITEMAP = BASE + "/sitemap.xml"


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = False
        self.h1 = 0
        self.canonical = []

    def handle_starttag(self, tag, attrs):
        vals = dict(attrs)
        if tag == "title":
            self.title = True
        if tag == "h1":
            self.h1 += 1
        if tag == "link" and vals.get("rel") == "canonical":
            self.canonical.append(vals.get("href", ""))


def get(url):
    error = None
    for attempt in range(2):
        try:
            req = Request(url, headers={"User-Agent": "NextGenTechSolutions-HealthCheck/1.0"})
            with urlopen(req, timeout=18) as response:
                if response.status != 200:
                    raise RuntimeError("Unexpected HTTP status: " + str(response.status))
                return response.read(600000).decode("utf-8")
        except (HTTPError, URLError, TimeoutError, OSError) as exc:
            error = exc
            if attempt == 0:
                time.sleep(2)
    raise RuntimeError(f"{url}: {error}")


def run():
    errors = []
    for path, snippets in PAGES.items():
        url = BASE + path
        try:
            html = get(url)
            meta = Metadata()
            meta.feed(html)
            for snippet in snippets:
                if snippet not in html:
                    errors.append(f"{path}: missing published proof/content: {snippet}")
            if meta.h1 != 1 or not meta.title or meta.canonical != [url]:
                errors.append(
                    f"{path}: invalid title, H1 count {meta.h1}, or canonical {meta.canonical}"
                )
            print("CHECK", url, "OK", len(html), "characters", flush=True)
        except Exception as exc:
            errors.append(str(exc))
    try:
        xml = ET.fromstring(get(SITEMAP))
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        urls = {node.text for node in xml.findall(".//s:loc", ns)}
        for path in PAGES:
            if BASE + path not in urls:
                errors.append("Missing sitemap URL: " + path)
        if len(urls) < 26:
            errors.append(f"Unexpected sitemap shrinkage: {len(urls)} URLs")
        print("CHECK", SITEMAP, len(urls), "URLs", flush=True)
    except Exception as exc:
        errors.append(str(exc))
    if errors:
        for problem in errors:
            print("FAIL", problem, file=sys.stderr)
        return 1
    print("PASS: production HTML, canonical URLs, portfolio links and sitemap.")
    print("Limits: not a search ranking, traffic, real-inquiry or conversion test.")
    return 0


if __name__ == "__main__":
    sys.exit(run())
