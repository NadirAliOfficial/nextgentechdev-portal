(function(){
  "use strict";
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true || navigator.webdriver === true) return;

  const safeStorage = (store, key, fallback) => {
    try {
      let value = store.getItem(key);
      if (!value) {
        value = fallback();
        store.setItem(key, value);
      }
      return value;
    } catch (_) {
      return fallback();
    }
  };
  const makeId = prefix => prefix + "_" + (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const visitorId = safeStorage(localStorage, "ng_analytics_vid", () => makeId("v"));
  const sessionId = safeStorage(sessionStorage, "ng_analytics_sid", () => makeId("s"));

  const params = new URLSearchParams(location.search);
  const referrerHost = (() => {
    try { return document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ""; }
    catch (_) { return ""; }
  })();

  function classifySource() {
    const utm = (params.get("utm_source") || "").trim().toLowerCase();
    const medium = (params.get("utm_medium") || "").trim().toLowerCase();
    if (utm) return { source: utm.slice(0,80), medium: (medium || "campaign").slice(0,80) };
    if (!referrerHost) return { source: "direct", medium: "direct" };
    if (referrerHost === location.hostname.toLowerCase()) return { source: "internal", medium: "internal" };
    const search = ["google.","bing.","duckduckgo.","search.yahoo.","baidu.","yandex."];
    if (search.some(x => referrerHost.includes(x))) return { source: referrerHost, medium: "organic" };
    const social = ["linkedin.","facebook.","instagram.","reddit.","youtube.","tiktok.","x.com","twitter.","t.co","telegram.","whatsapp."];
    if (social.some(x => referrerHost.includes(x))) return { source: referrerHost, medium: "social" };
    return { source: referrerHost, medium: "referral" };
  }
  const sourceInfo = (() => {
    const current = classifySource();
    try {
      const saved = sessionStorage.getItem("ng_analytics_source");
      if (saved) return JSON.parse(saved);
      sessionStorage.setItem("ng_analytics_source", JSON.stringify(current));
    } catch (_) {}
    return current;
  })();

  function cleanTarget(href) {
    if (!href) return "";
    try {
      const u = new URL(href, location.origin);
      if (u.origin !== location.origin) return u.pathname || "";
      const service = u.searchParams.get("service");
      return (u.pathname || "/") + (service ? "?service=" + encodeURIComponent(service.slice(0,100)) : "");
    } catch (_) { return ""; }
  }

  function send(event, extra) {
    const payload = {
      visitor_id: visitorId,
      session_id: sessionId,
      event,
      path: location.pathname || "/",
      target: extra && extra.target ? String(extra.target).slice(0,220) : "",
      referrer_host: referrerHost,
      source: sourceInfo.source,
      medium: sourceInfo.medium,
      campaign: (params.get("utm_campaign") || "").slice(0,120),
      timezone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (_) { return ""; } })(),
      language: (navigator.language || "").slice(0,40)
    };
    fetch("/api/analytics/track", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: "same-origin"
    }).catch(() => {});
  }

  window.ngTrack = send;

  function onReady() {
    send("page_view");
    document.addEventListener("click", function(e){
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const target = cleanTarget(href);
      const text = (a.textContent || "").trim().toLowerCase();
      if (href.includes("#contact") || text.includes("request a quote") || text.includes("discuss your project") || text.includes("start a project")) {
        send("quote_click", {target});
      } else if (a.closest(".sf-service-card") || a.closest(".sf-category-card")) {
        send("service_click", {target});
      }
    }, {passive:true});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady, {once:true});
  else onReady();
})();