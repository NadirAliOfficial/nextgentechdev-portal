"""Small, public-website-only HTTP client with DNS-to-socket pinning.

Explicit redirects are revalidated; HTTPS certificate hostname checks stay on.
Never uses environment proxies or arbitrary client headers.
"""
from dataclasses import dataclass
from urllib.parse import urljoin, urlsplit
import http.client
import socket
import ssl
import time
from .security import PublicTarget, normalize_url, public_ips, UnsafeTarget


class FetchError(ValueError):
    pass


class PinnedHTTPSConnection(http.client.HTTPSConnection):
    def __init__(self,target:PublicTarget,ip:str,timeout:float):
        super().__init__(target.host,target.port,timeout=timeout,context=ssl.create_default_context())
        self._target_ip=ip
    def connect(self):
        raw=socket.create_connection((self._target_ip,self.port),self.timeout)
        try:self.sock=self._context.wrap_socket(raw,server_hostname=self.host)
        except Exception:
            raw.close()
            raise


class PinnedHTTPConnection(http.client.HTTPConnection):
    def __init__(self,target:PublicTarget,ip:str,timeout:float):
        super().__init__(target.host,target.port,timeout=timeout)
        self._target_ip=ip
    def connect(self):
        self.sock=socket.create_connection((self._target_ip,self.port),self.timeout)


@dataclass
class FetchResult:
    url:str
    status:int
    content_type:str
    body:bytes
    headers:dict
    elapsed_ms:int
    redirects:int


def fetch_public(raw_url:str,*,max_bytes:int=750_000,timeout:float=6.0,max_redirects:int=3,
                 user_agent:str="GrowthAuditPro/0.1 (+https://www.nextgentechdev.com/growth-audit)",
                 resolver=None)->FetchResult:
    if max_bytes>900_000:raise ValueError("Response body budget too large.")
    current=normalize_url(raw_url)
    start=time.monotonic()
    for redirects in range(max_redirects+1):
        ips=public_ips(current.host,current.port,resolver)
        conn=None
        try:
            klass=PinnedHTTPSConnection if current.scheme=="https" else PinnedHTTPConnection
            conn=klass(current,ips[0],timeout)
            parsed=urlsplit(current.url)
            target=(parsed.path or "/")+("?"+parsed.query if parsed.query else "")
            conn.request("GET",target,headers={
                "Host":current.host,"User-Agent":user_agent,
                "Accept":"text/html,application/xhtml+xml,text/plain,application/xml;q=0.8,*/*;q=0.1",
                "Accept-Encoding":"identity","Connection":"close",
            })
            response=conn.getresponse()
            status=response.status
            headers={k.lower():v[:1000] for k,v in response.getheaders() if isinstance(v,str)}
            location=headers.get("location")
            if status in (301,302,303,307,308) and location:
                if redirects>=max_redirects:raise FetchError("Too many redirects.")
                next_target=normalize_url(urljoin(current.url,location))
                if next_target.host!=current.host:
                    raise FetchError("This site redirects to another hostname. Please scan its final URL directly: "+next_target.host)
                current=next_target
                continue
            cl=headers.get("content-length")
            if cl and cl.isdecimal() and int(cl)>max_bytes:
                raise FetchError("The webpage exceeds the safe scan size.")
            body=response.read(max_bytes+1)
            if len(body)>max_bytes:raise FetchError("The webpage exceeds the safe scan size.")
            elapsed=int((time.monotonic()-start)*1000)
            return FetchResult(current.url,status,headers.get("content-type",""),body,headers,elapsed,redirects)
        except (socket.timeout,TimeoutError,ConnectionError,ssl.SSLError,http.client.HTTPException,OSError) as exc:
            raise FetchError("The site could not be fetched securely or timed out.") from exc
        finally:
            if conn:conn.close()
    raise FetchError("Too many redirects.")
