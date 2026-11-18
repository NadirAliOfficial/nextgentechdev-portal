"""Vercel-compatible Python HTTP handler (no third-party Python packages).

The /api/growth-audit route must be explicitly excluded from a parent site's
generic reverse proxy rewrite. /api/* continues to serve the original backend.
"""
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlsplit
from threading import Lock
from collections import deque
import json
import os
import time

from .engine import run_audit
from .security import UnsafeTarget
from .fetch import FetchError

# Best-effort per-process abuse controls; distributed production limits
# require platform WAF or external quota storage, documented in README.
_RATE_LOCK=Lock()
_RECENT=deque()
_RATE_MAX=20
_WINDOW=60


def allow_scan(now:float|None=None)->bool:
    t=now if now is not None else time.monotonic()
    with _RATE_LOCK:
        while _RECENT and _RECENT[0]<=t-_WINDOW:_RECENT.popleft()
        if len(_RECENT)>=_RATE_MAX:return False
        _RECENT.append(t)
        return True


def respond(payload:dict,status:int=200)->tuple[int,bytes]:
    return status,json.dumps(payload,ensure_ascii=False,allow_nan=False,separators=(",",":")).encode("utf-8")


def handle_request(method:str,path:str,body:bytes=b"",*,now:float|None=None,engine=run_audit):
    if method=="GET":
        if urlsplit(path).path.endswith("/health"):
            return respond({"ok":True,"service":"GrowthAudit Pro","version":"0.1.0","scan_enabled":True})
        return respond({"service":"GrowthAudit Pro","status":"ready","usage":"POST {url: public website}"})
    if method!="POST":
        return respond({"error":"method_not_allowed"},405)
    if len(body)>4096:
        return respond({"error":"request_too_large","message":"The request exceeds the safe payload limit."},413)
    try:input=json.loads(body or b"{}")
    except (ValueError,UnicodeError):
        return respond({"error":"invalid_json","message":"Enter a valid JSON request."},400)
    if not isinstance(input,dict) or not isinstance(input.get("url"),str):
        return respond({"error":"invalid_input","message":"A public website URL is required."},400)
    if not allow_scan(now):
        return respond({"error":"rate_limited","message":"Scan capacity is temporarily busy. Try again later."},429)
    try:
        report=engine(input["url"])
    except (UnsafeTarget,PermissionError) as exc:
        return respond({"error":"unsafe_or_restricted","message":str(exc)},400)
    except FetchError as exc:
        return respond({"error":"fetch_failed","message":str(exc)},422)
    except Exception:
        # Never leak network internals or stack traces to public users.
        return respond({"error":"scan_failed","message":"The audit could not complete. Try another public website."},502)
    return respond(report,200)


class handler(BaseHTTPRequestHandler):
    def _headers(self,status:int,length:int):
        self.send_response(status)
        self.send_header("Content-Type","application/json; charset=utf-8")
        self.send_header("Cache-Control","no-store")
        self.send_header("X-Content-Type-Options","nosniff")
        self.send_header("Content-Length",str(length))
        self.end_headers()
    def do_GET(self):
        status,body=handle_request("GET",self.path)
        self._headers(status,len(body));self.wfile.write(body)
    def do_POST(self):
        try:size=int(self.headers.get("content-length","0"))
        except ValueError:size=99999
        if size<0 or size>4096:
            status,data=respond({"error":"request_too_large"},413)
        else:
            payload=self.rfile.read(size)
            status,data=handle_request("POST",self.path,payload)
        self._headers(status,len(data));self.wfile.write(data)
    def do_OPTIONS(self):
        # Same-origin only. CORS intentionally disabled.
        self._headers(405,0)
    def log_message(self,*args):
        # Avoid logging target URLs and query strings containing business details.
        pass
