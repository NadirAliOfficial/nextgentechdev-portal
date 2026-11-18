"""Single-page public URL audit with robots respect and exact check provenance."""
from datetime import datetime, timezone
from urllib.parse import urljoin,urlsplit
from urllib.robotparser import RobotFileParser
import json
import xml.etree.ElementTree as ET
from .fetch import fetch_public, FetchError
from .security import normalize_url, UnsafeTarget
from .htmlcheck import analyze_html

USER_AGENT="GrowthAuditPro/0.1"
MAX_RESPONSE_BYTES=750_000


def _decode(raw:bytes,content_type:str)->str:
    # Unsupported charsets are treated as UTF-8 replacement rather than
    # attempting arbitrary codecs supplied by a remote website.
    return raw.decode("utf-8-sig","replace")


def run_audit(url:str,*,fetcher=fetch_public)->dict:
    target=normalize_url(url)
    origin=f"{target.scheme}://{target.host}"
    robots_url=origin+"/robots.txt"
    status="unknown";robots=None
    try:
        result=fetcher(robots_url,max_bytes=80_000)
        if result.status in (401,403):
            raise PermissionError("This website restricts automated access in robots.txt.")
        if result.status==200:
            content=_decode(result.body,result.content_type)
            robots=RobotFileParser()
            robots.set_url(robots_url)
            robots.parse(content.splitlines())
            status="found"
        elif result.status in (404,410):
            status="missing"
        elif result.status>=500:
            raise FetchError("Cannot verify robots rules because the origin server returned an error.")
        else:
            status=f"HTTP {result.status}"
    except (UnsafeTarget,FetchError) as exc:
        if isinstance(exc,UnsafeTarget):
            raise
        # If robots availability cannot be determined, do not assume that
        # this third-party site has granted a crawler permission.
        raise FetchError("Could not safely confirm robots.txt: "+str(exc)) from exc
    if robots is not None and not robots.can_fetch(USER_AGENT,target.url):
        raise PermissionError("The target page is disallowed by the website's robots.txt.")
    response=fetcher(target.url,max_bytes=MAX_RESPONSE_BYTES)
    if response.status!=200:
        raise FetchError(f"The target returned HTTP {response.status}; only accessible public pages can be audited.")
    if "html" not in response.content_type.lower():
        raise FetchError("The target did not return an HTML page.")
    # A redirect to another site requires that site's own robots rules:
    # fail closed rather than accidentally bypassing that host's policy.
    final=normalize_url(response.url)
    if final.host!=target.host:
        raise FetchError("Redirect to another domain: audit its final domain directly so robots rules can be checked.")
    if robots is not None and not robots.can_fetch(USER_AGENT,response.url):
        raise PermissionError("Redirect destination is excluded by robots.txt.")
    sitemap_status="not checked"
    sitemap_url=origin+"/sitemap.xml"
    if robots is None or robots.can_fetch(USER_AGENT,sitemap_url):
        try:
            r=fetcher(sitemap_url,max_bytes=125_000)
            if r.status==200:
                parsed=ET.fromstring(r.body)
                sitemap_status="found" if parsed.tag.split("}")[-1] in ("urlset","sitemapindex") else "not XML sitemap"
            else:
                sitemap_status=f"HTTP {r.status}"
        except (FetchError, ET.ParseError, ValueError, OSError, UnsafeTarget):
            sitemap_status="unavailable"
    report=analyze_html(response.url,_decode(response.body,response.content_type),response.headers,
                        robots_status=status,sitemap_status=sitemap_status)
    report.update({
        "tool":"GrowthAudit Pro","version":"0.1.0","audited_at":datetime.now(timezone.utc).isoformat(),
        "scan_scope":"Single publicly accessible HTML page, robots.txt and XML sitemap presence",
        "request":{"entered_url":target.url,"final_url":response.url},
        "network":{"http_status":response.status,"content_type":response.content_type,
                   "bytes_downloaded":len(response.body),"fetch_elapsed_ms":response.elapsed_ms,
                   "redirects":response.redirects},
        "discovery":{"robots":status,"sitemap":sitemap_status},
        "service_disclaimer":"No verified Google rankings, conversions, AI-search visibility, Core Web Vitals or real-user performance measured."
    })
    return report


def report_json(report:dict)->str:
    return json.dumps(report,ensure_ascii=False,indent=2)


def report_markdown(report:dict)->str:
    # All content is plain text and never rendered as live Markdown HTML by the website.
    lines=[
        "# GrowthAudit Pro — Website Technical Review","",
        f"Website: {report['url']}",
        f"Audit time: {report['audited_at']}",
        f"Technical checklist score: {report['score']}/100",
        "**Important:** Not a Google ranking, conversion or Core Web Vitals score.","",
        "## Checks",
    ]
    for f in report["findings"]:
        mark="PASS" if f["passed"] else "REVIEW"
        lines+=["",f"### {mark} · {f['id']} · {f['title']}",
                "Evidence: "+f["evidence"].replace("\n"," "),
                "Next step: "+f["recommendation"]]
    lines+=["","## Limitations",*["- "+s for s in report["limits"]]]
    return "\n".join(lines)
