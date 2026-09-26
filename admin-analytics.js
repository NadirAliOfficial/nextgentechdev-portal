(function(){
  "use strict";
  const $ = s => document.querySelector(s);
  function fmt(n){ return Number(n || 0).toLocaleString(); }
  function esc(v){ const d=document.createElement("div"); d.textContent=String(v ?? ""); return d.innerHTML; }
  function renderList(root, rows, key, valueKey){
    if(!root) return;
    if(!rows || !rows.length){ root.innerHTML='<div class="analytics-empty">No traffic recorded yet.</div>'; return; }
    root.innerHTML=rows.map(r=>'<div class="analytics-row"><span>'+esc(r[key] || "Unknown")+'</span><b>'+fmt(r[valueKey])+'</b></div>').join("");
  }
  async function refresh(){
    const token=sessionStorage.getItem("admin_token");
    if(!token) return;
    try{
      const resp=await fetch("/api/admin/analytics?days=30",{headers:{Authorization:"Bearer "+token}});
      if(!resp.ok) return;
      const d=await resp.json();
      const map={
        "#analytics-visitors":d.visitors,
        "#analytics-pageviews":d.page_views,
        "#analytics-sessions":d.sessions,
        "#analytics-conversions":d.conversions,
        "#analytics-online":d.online_30m
      };
      Object.entries(map).forEach(([sel,val])=>{const el=$(sel); if(el) el.textContent=fmt(val);});
      const cr=$("#analytics-conversion-rate"); if(cr) cr.textContent=Number(d.conversion_rate||0).toFixed(2)+"%";
      renderList($("#analytics-top-pages"),d.top_pages,"path","views");
      renderList($("#analytics-sources"),d.sources,"source","visitors");
      renderList($("#analytics-timezones"),d.timezones,"timezone","visitors");
      const stamp=$("#analytics-updated"); if(stamp) stamp.textContent="Last updated "+new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
    }catch(_){}
  }
  document.addEventListener("DOMContentLoaded",()=>{setTimeout(refresh,800); setInterval(refresh,60000);});
  window.refreshTrafficAnalytics=refresh;
})();