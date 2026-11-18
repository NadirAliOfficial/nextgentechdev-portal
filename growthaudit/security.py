"""Strict target policy and pinned DNS for server-side public website fetching.

No user supplied proxy, credentials, private-network routes or non-web ports.
"""
from dataclasses import dataclass
from urllib.parse import urlsplit, urlunsplit
import ipaddress
import re
import socket

MAX_URL_LENGTH=2048
_DISALLOWED_SUFFIXES=(
    ".localhost", ".local", ".internal", ".home.arpa", ".test",
    ".invalid", ".example", ".onion", ".lan", ".corp", ".intranet",
)
_DISALLOWED_HOSTS={"localhost","metadata.google.internal","metadata","host.docker.internal"}


class UnsafeTarget(ValueError):
    pass


@dataclass(frozen=True)
class PublicTarget:
    url:str
    host:str
    port:int
    scheme:str


def normalize_url(raw:str)->PublicTarget:
    if not isinstance(raw,str):raise UnsafeTarget("Enter a website URL.")
    value=raw.strip()
    if len(value)<3 or len(value)>MAX_URL_LENGTH:
        raise UnsafeTarget("Website URL must be between 3 and 2048 characters.")
    if any(ord(ch)<32 or ord(ch)==127 for ch in value):
        raise UnsafeTarget("Control characters in URL are not supported.")
    if not re.match(r"^[a-z][a-z0-9+.-]*://",value,re.I):
        value="https://"+value
    try:
        u=urlsplit(value)
        host=u.hostname
        port=u.port
    except ValueError:
        raise UnsafeTarget("Invalid hostname or port.") from None
    if u.scheme not in {"https","http"} or not host or u.username is not None or u.password is not None:
        raise UnsafeTarget("Only public HTTP(S) websites are supported; credentials are not allowed.")
    if "\\" in u.netloc or "@" in u.netloc or "%" in u.netloc:
        raise UnsafeTarget("Encoded hostnames and user info are not allowed.")
    host=host.lower().rstrip(".")
    if not host or host in _DISALLOWED_HOSTS or host.endswith(_DISALLOWED_SUFFIXES):
        raise UnsafeTarget("Local, internal, and reserved hostnames cannot be scanned.")
    if len(host)>253 or len(host.split("."))<2:
        # IPv6 or IPv4 literals may have a dot-less representation, but are
        # prohibited by policy to avoid metadata/reserved address tricks.
        raise UnsafeTarget("Enter a public domain name (not an IP address).")
    try:
        ipaddress.ip_address(host)
    except ValueError:
        pass
    else:
        raise UnsafeTarget("IP-address URLs are not supported; use a public domain name.")
    try:ascii_host=host.encode("idna").decode("ascii")
    except (UnicodeError,ValueError):
        raise UnsafeTarget("Domain name cannot be resolved safely.") from None
    if not re.fullmatch(r"[a-z0-9.-]+",ascii_host) or ".." in ascii_host:
        raise UnsafeTarget("Invalid domain name.")
    if any(not x or x.startswith("-") or x.endswith("-") or len(x)>63 for x in ascii_host.split(".")):
        raise UnsafeTarget("Invalid domain label.")
    if port is not None and port!=(443 if u.scheme=="https" else 80):
        raise UnsafeTarget("Only standard HTTP(S) ports 80 and 443 are permitted.")
    path=u.path or "/"
    if len(path)>1400 or len(u.query)>500:
        raise UnsafeTarget("Website path/query is too long.")
    if any(c in path for c in "\\\r\n") or any(c in u.query for c in "\r\n\\"):
        raise UnsafeTarget("Invalid URL path.")
    # URL fragments are client-only and not sent in HTTP requests.
    safe=urlunsplit((u.scheme,ascii_host+(":"+str(port) if port else ""),path,u.query,""))
    return PublicTarget(safe,ascii_host,port or (443 if u.scheme=="https" else 80),u.scheme)


def public_ips(host:str,port:int,resolver=None)->list[str]:
    resolver=resolver or socket.getaddrinfo
    try:records=resolver(host,port,type=socket.SOCK_STREAM)
    except OSError:
        raise UnsafeTarget("This domain could not be resolved.") from None
    addresses=[]
    for record in records:
        addr=record[4][0].split("%")[0]
        try:ip=ipaddress.ip_address(addr)
        except ValueError:raise UnsafeTarget("Domain returned an invalid address.") from None
        if not ip.is_global:
            raise UnsafeTarget("This domain resolves to a non-public IP and cannot be scanned.")
        if addr not in addresses:addresses.append(addr)
    if not addresses:raise UnsafeTarget("No public addresses found for the domain.")
    # Prefer IPv4 where available; a platform with IPv6 egress can use IPv6.
    return sorted(addresses,key=lambda s:(":" in s,s))
