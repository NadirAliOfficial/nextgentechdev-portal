/* SpecPilot Pro one-time, explicit quote handoff. Never automatically submits the form. */
(function () {
  "use strict";
  const KEY="nextgen_specpilot_handoff";
  function inject(){
    let raw;
    try {
      raw=sessionStorage.getItem(KEY);
      if(!raw)return;
      sessionStorage.removeItem(KEY);
    } catch (_) {return;}
    let data;
    try {data=JSON.parse(raw);}catch(_){return;}
    if(!data||data.version!==1||typeof data.summary!=="string"||
       typeof data.time!=="number"||Date.now()-data.time>15*60*1000||
       data.time>Date.now()+60*1000) return;
    const textarea=document.getElementById("project-summary");
    const form=document.getElementById("client-inquiry-form");
    if(!textarea||!form)return;
    // Never overwrite requirements that the visitor already entered.
    if(textarea.value.trim())return;
    const summary=data.summary.slice(0,7800);
    if(summary.trim().length<20)return;
    textarea.value=summary;
    textarea.dispatchEvent(new Event("input",{bubbles:true}));
    const categories={
      ai:"ai_agentic_systems",mt5:"quantitative_finance",
      web:"web_mobile_dev",api:"cloud_microservices",
      commerce:"web_mobile_dev",workflow:"ai_agentic_systems",
      voice:"ai_agentic_systems",mobile:"web_mobile_dev"
    };
    const select=document.getElementById("project-category");
    const target=categories[data.category];
    if(select&&target&&Array.from(select.options).some(o=>o.value===target)){
      select.value=target;
      select.dispatchEvent(new Event("change",{bubbles:true}));
    }
    const notice=document.createElement("p");
    notice.setAttribute("role","status");
    notice.style.cssText="color:#22644b;font-size:13px;margin:9px 0 13px";
    notice.textContent="Your SpecPilot project summary is ready below. Review and edit it, add your contact information, then submit only if you want our engineering team to respond.";
    textarea.insertAdjacentElement("beforebegin",notice);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",inject,{once:true});
  else inject();
})();
