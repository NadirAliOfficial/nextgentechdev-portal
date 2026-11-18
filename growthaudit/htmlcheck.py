"""Parse and score visible HTML signals. No claims about search rankings."""
from dataclasses import dataclass,asdict
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit
import json
import re


@dataclass(frozen=True)
class Finding:
    id:str
    category:str
    severity:str
    title:str
    evidence:str
    recommendation:str
    points:int
    passed:bool
    def to_dict(self):return asdict(self)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_title=False
        self.title_text=[]
        self.lang=""
        self.headings={"h1":[],"h2":[]}
        self._heading=None
        self.links=[]
        self.canonicals=[]
        self.meta={}
        self.images=[]
        self.forms=0
        self.inputs=[]
        self.buttons=0
        self.anchors=[]
        self._anchor_index=None
        self.jsonlds=[]
        self._jsonld=False
        self._script=""
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=="html":self.lang=a.get("lang","").strip()
        if tag=="title":self.in_title=True
        if tag in ("h1","h2"):self._heading=tag;self.headings[tag].append("")
        if tag=="meta":
            key=(a.get("name") or a.get("property") or "").lower()
            if key:self.meta[key]=a.get("content","")
        if tag=="link" and "canonical" in (a.get("rel") or "").lower().split():
            self.canonicals.append(a.get("href",""))
        if tag=="a":
            self.links.append(a.get("href",""))
            self.anchors.append({"href":a.get("href",""),"text":""})
            self._anchor_index=len(self.anchors)-1
        if tag=="img":self.images.append({"alt":a.get("alt"),"src":a.get("src","")})
        if tag=="form":self.forms+=1
        if tag in ("input","textarea","select"):self.inputs.append(a)
        if tag=="button":self.buttons+=1
        if tag=="script" and a.get("type","").lower()=="application/ld+json":
            self._jsonld=True;self._script=""
    def handle_endtag(self,tag):
        if tag=="title":self.in_title=False
        if tag=="a":self._anchor_index=None
        if tag==self._heading:self._heading=None
        if tag=="script" and self._jsonld:
            self.jsonlds.append(self._script);self._script="";self._jsonld=False
    def handle_data(self,data):
        if self.in_title:self.title_text.append(data)
        if self._heading and self.headings[self._heading]:
            self.headings[self._heading][-1]+=data
        if self._jsonld:self._script+=data
        if self._anchor_index is not None:
            self.anchors[self._anchor_index]["text"]+=data[:160]


def analyze_html(page_url:str,body:str,headers:dict,*,robots_status:str="unknown",
                 robots_allowed:bool=True,sitemap_status:str="not checked")->dict:
    parser=PageParser()
    parser.feed(body[:800_000])
    title=" ".join(" ".join(parser.title_text).split())
    desc=parser.meta.get("description","").strip()
    viewport=parser.meta.get("viewport","").lower()
    robots=parser.meta.get("robots","").lower()
    header_robots=headers.get("x-robots-tag","").lower()
    noindex="noindex" in robots or "noindex" in header_robots
    canonical=parser.canonicals[0] if parser.canonicals else ""
    abs_canonical=urljoin(page_url,canonical) if canonical else ""
    canonical_match=not canonical or abs_canonical.rstrip("/")==page_url.rstrip("/")
    imgs_missing=sum(i["alt"] is None for i in parser.images)
    internal=[u for u in parser.links if u and urlsplit(urljoin(page_url,u)).hostname==urlsplit(page_url).hostname and not u.startswith("#")]
    href_cta=any(
        re.search(r"(contact|book|request|quote|consult|hire|call|whatsapp|schedule|pricing|start)",a["text"]+" "+a["href"],re.I)
        for a in parser.anchors
    ) or parser.forms>0
    form_unlabeled=sum(1 for x in parser.inputs if x.get("type","text") not in ("hidden","submit","button","checkbox","radio")
                       and not (x.get("aria-label") or x.get("aria-labelledby") or x.get("id") or x.get("title")))
    jsonld_valid=0;jsonld_invalid=0
    for raw in parser.jsonlds[:15]:
        try:json.loads(raw);jsonld_valid+=1
        except (ValueError,TypeError):jsonld_invalid+=1
    findings=[]
    def test(rule,cat,sev,title,evidence,action,weight,ok):
        findings.append(Finding(rule,cat,sev,title,str(evidence)[:240],action,weight,bool(ok)))
    test("SEO-01","Search foundations","high","Descriptive page title",
        title[:100] or "No <title> tag","Add a unique, descriptive <title> for the page.",10,10<=len(title)<=75)
    test("SEO-02","Search foundations","medium","Meta description",
        (desc[:100]+"…" if len(desc)>100 else desc) or "Missing",
        "Write a concise, accurate description of the page's benefits.",8,60<=len(desc)<=180)
    test("SEO-03","Search foundations","high","Indexability directive",
        (robots or header_robots) or "No explicit noindex directive",
        "Remove unintentional noindex; confirm indexing using Search Console (not from this report).",10,not noindex)
    test("SEO-04","Search foundations","medium","Single useful H1",
        f"{len(parser.headings['h1'])} H1 tags found","Give the page one clear primary heading.",7,len(parser.headings["h1"])==1)
    test("SEO-05","Search foundations","medium","Canonical URL hint",
        canonical or "Missing","Declare a canonical URL that represents the preferred page.",7,bool(canonical) and canonical_match)
    test("SEO-06","Search foundations","low","Internal navigation links",
        f"{len(internal)} same-host links detected","Link to relevant pages using descriptive text and reachable routes.",4,len(internal)>=2)
    test("SEO-07","Search foundations","low","Structured data syntax",
        f"{jsonld_valid} valid, {jsonld_invalid} invalid JSON-LD blocks",
        "Validate structured data syntax and only describe real page content.",4,jsonld_valid>0 and jsonld_invalid==0)
    test("UX-01","Mobile and accessibility","high","Mobile viewport",
        viewport or "Missing","Add <meta name='viewport' content='width=device-width, initial-scale=1'>.",8,"width=device-width" in viewport)
    test("UX-02","Mobile and accessibility","medium","HTML document language",
        parser.lang or "Not declared","Add an accurate lang attribute on <html>.",4,bool(parser.lang))
    test("UX-03","Mobile and accessibility","medium","Image alternative text",
        f"{imgs_missing} image(s) missing alt out of {len(parser.images)}",
        "Give informative images meaningful alt text and decorative images empty alt.",5,imgs_missing==0)
    test("UX-04","Mobile and accessibility","low","Form control labels",
        f"{form_unlabeled} controls missing an accessible identifier",
        "Use explicit <label> elements or aria-label for every form control.",4,form_unlabeled==0)
    test("CRO-01","Conversion signals","medium","Contact or action path",
        "Action link or form found" if href_cta else "No obvious conversion path",
        "Give visitors one clear, relevant contact, booking, or inquiry action.",8,href_cta)
    test("SEC-01","Transport and security","high","Encrypted transport",
        urlsplit(page_url).scheme,"Use valid HTTPS for the canonical website.",7,urlsplit(page_url).scheme=="https")
    test("SEC-02","Transport and security","low","Basic MIME protection",
        headers.get("x-content-type-options","Missing"),
        "Set X-Content-Type-Options: nosniff as a defense in depth.",4,headers.get("x-content-type-options","").lower()=="nosniff")
    test("SEC-03","Transport and security","low","Content Security Policy",
        "Present" if headers.get("content-security-policy") else "Missing",
        "Consider a tested CSP to reduce script injection risk.",4,bool(headers.get("content-security-policy")))
    test("DISC-01","Discovery files","medium","Robots instructions accessible",
        robots_status,"Serve readable robots.txt; this is not proof of search indexing.",5,robots_status=="found" and robots_allowed)
    test("DISC-02","Discovery files","medium","XML sitemap reachable",
        sitemap_status,"Publish an XML sitemap of intended canonical URLs, then submit in Search Console.",5,sitemap_status=="found")
    actual=sum(x.points for x in findings if x.passed)
    total=sum(x.points for x in findings)
    score=round(actual/total*100) if total else None
    return {
        "score":score,"score_label":"Technical checklist only",
        "score_explanation":"A weighted, opinionated single-page checklist. Not a Google score, AI visibility score, SEO ranking prediction or Core Web Vitals measurement.",
        "url":page_url,
        "page":{"title":title,"description":desc,"h1":parser.headings["h1"][:5],"h2_count":len(parser.headings["h2"]),
                "canonical":abs_canonical,"images":len(parser.images),"images_missing_alt":imgs_missing,
                "links_internal":len(internal),"forms":parser.forms,"jsonld_valid":jsonld_valid,"jsonld_invalid":jsonld_invalid},
        "summary":{"checks":len(findings),"passed":sum(x.passed for x in findings),
                   "failed":sum(not x.passed for x in findings),
                   "high_priority":sum(not x.passed and x.severity=="high" for x in findings)},
        "findings":[x.to_dict() for x in findings],
        "measurements":{"mobile_performance":None,"core_web_vitals":None,
                        "notes":"Speed and Core Web Vitals not measured by this HTML fetch. Use Google PageSpeed Insights or verified field data."},
        "limits":["A single HTML document is examined; JavaScript-rendered content may be missing.",
                  "No verified Google indexing, ranking, conversions, or user analytics.",
                  "No actual field performance measurement, accessibility audit, external link crawl, or security certification."]
    }
