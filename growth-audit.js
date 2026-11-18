/* GrowthAudit Pro — evidence-based scan UI, no fabricated performance metrics. */
(function(){
"use strict";
const $=(id)=>document.getElementById(id);
const state={report:null,filter:"review",busy:false};
const API="/growth-audit-api";
function track(event){
  if(typeof window.ngTrack==="function")window.ngTrack(event,{target:"/growth-audit"});
}
function make(tag,className,text){
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(text!==undefined)el.textContent=String(text);
  return el;
}
function clear(node){while(node.firstChild)node.firstChild.remove();}
function normalizedInput(raw){
  const val=String(raw||"").trim();
  if(!val)throw new Error("Enter a public website URL to audit.");
  if(val.length>2048)throw new Error("URL is too long.");
  const url=/^https?:\/\//i.test(val)?val:"https://"+val;
  let parsed;
  try{parsed=new URL(url);}catch(_){throw new Error("Enter a valid website address, e.g. https://www.example.com");}
  if(!["http:","https:"].includes(parsed.protocol) || parsed.username || parsed.password)
    throw new Error("Only public HTTP(S) websites without passwords are supported.");
  if(!parsed.hostname || !parsed.hostname.includes("."))
    throw new Error("Enter a public domain name.");
  return parsed.href;
}
function showError(message){$("scan-error").textContent=message;$("scan-error").hidden=false;}
function setBusy(yes){
  state.busy=yes;$("start-scan").disabled=yes;
  $("start-scan").textContent=yes?"Analyzing…":"Run free audit →";
  $("scan-state").hidden=!yes;
  $("scan-state-text").textContent="Fetching public page, robots instructions, and sitemap…";
}
function showReport(report){
  state.report=report;state.filter="review";
  $("report").hidden=false;$("result-empty").hidden=true;
  $("site-name").textContent=new URL(report.url).hostname;
  const time=new Date(report.audited_at);
  $("audit-meta").textContent=(time.toString()==="Invalid Date"?"Audit complete":time.toLocaleString())+" · "+report.network.http_status+" HTTP · "+report.network.bytes_downloaded.toLocaleString()+" bytes analyzed";
  $("score-value").textContent=report.score+"%";
  $("score-ring").style.setProperty("--angle",Math.max(0,Math.min(100,report.score))+"%");
  $("checks-passed").textContent=report.summary.passed;
  $("checks-review").textContent=report.summary.failed;
  $("checks-high").textContent=report.summary.high_priority;
  $("report-notice").textContent=report.score_explanation+" "+report.measurements.notes;
  document.querySelectorAll(".filter").forEach(el=>el.classList.toggle("active",el.dataset.filter==="review"));
  renderFindings();track("growthaudit_scan_completed");
}
function renderFindings(){
  const list=$("findings");clear(list);if(!state.report)return;
  let filtered=state.report.findings;
  if(state.filter==="review")filtered=filtered.filter(f=>!f.passed);
  if(state.filter==="pass")filtered=filtered.filter(f=>f.passed);
  filtered=[...filtered].sort((a,b)=>{
    const rank={high:0,medium:1,low:2,info:3};
    return (rank[a.severity]??4)-(rank[b.severity]??4);
  });
  $("visible-count").textContent=filtered.length+" visible";
  if(!filtered.length){
    list.append(make("div","finding-empty",state.filter==="review"?
      "No failed checks in this limited technical audit. This does NOT certify high rankings, fast loading, accessibility or conversion success.":
      "No matching checks in this view."));
    return;
  }
  for(const f of filtered){
    const card=make("article","finding "+(f.passed?"pass":"fail "+f.severity));
    const row=make("div","row");
    row.append(make("b","",f.title),make("span","rule",(f.passed?"PASS":"REVIEW")+" · "+f.id));
    card.append(row);
    card.append(make("p","evidence","Evidence: "+f.evidence));
    card.append(make("p","action",f.passed?"What passed: "+f.recommendation:"Next step: "+f.recommendation));
    list.append(card);
  }
}
function exportReport(name,body,mime){
  const blob=new Blob([body],{type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=name;
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function makeMarkdown(r){
  const safe=(x)=>String(x??"").replace(/[\r\n]+/g," ").replace(/[#*]/g,"").replaceAll(String.fromCharCode(96),"");
  const lines=[
    "# GrowthAudit Pro — Website Technical Audit","",
    "Website: "+safe(r.url),"Audited: "+safe(r.audited_at),
    "Checklist score: "+r.score+"/100",
    "**Not a Google ranking, speed, Core Web Vitals, or AI visibility score.**","",
    "## Summary","- Passed checks: "+r.summary.passed,
    "- Checks requiring review: "+r.summary.failed,
    "- High-priority issues: "+r.summary.high_priority,""
  ];
  for(const f of r.findings){
    lines.push("## "+(f.passed?"PASS":"REVIEW")+" "+safe(f.id)+" — "+safe(f.title));
    lines.push("Evidence: "+safe(f.evidence));
    lines.push("Next step: "+safe(f.recommendation));lines.push("");
  }
  lines.push("## Limitations",...r.limits.map(x=>"- "+safe(x)));
  lines.push("","Generated at https://www.nextgentechdev.com/growth-audit");
  return lines.join("\n");
}
function safeSummary(r){
  const fails=r.findings.filter(f=>!f.passed).slice(0,12);
  return [
    "GrowthAudit Pro website audit inquiry",
    "Website: "+r.url,
    "Technical checklist: "+r.score+"/100 (not a Google ranking or speed score)",
    "Review items: "+r.summary.failed+", including high-priority: "+r.summary.high_priority,
    "Priority findings:",
    ...fails.map(f=>"- "+f.id+" ["+f.severity+"]: "+f.title+" — "+f.recommendation),
    "Request: Please review these public technical observations and propose a suitable scope, verification plan, and quote. No automatic fixes have been made."
  ].join("\n").slice(0,6500);
}
$("audit-form").addEventListener("submit",async function(event){
  event.preventDefault();
  if(state.busy)return;
  $("scan-error").hidden=true;
  let url;
  try{url=normalizedInput($("website-url").value);}
  catch(err){showError(err.message);return;}
  setBusy(true);const controller=new AbortController();
  const abortId=setTimeout(()=>controller.abort(),29000);
  track("growthaudit_scan_started");
  try{
    const response=await fetch(API,{
      method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},
      credentials:"same-origin",redirect:"error",cache:"no-store",
      body:JSON.stringify({url}),signal:controller.signal
    });
    let output;
    try{output=await response.json();}
    catch(_){throw new Error("The live audit service returned an invalid response. Try again later.");}
    if(!response.ok)throw new Error(output.message||"The website could not be safely scanned.");
    if(!output.findings||!Array.isArray(output.findings)||!output.summary)
      throw new Error("The audit did not return valid findings.");
    showReport(output);
    $("report").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(err){
    if(err.name==="AbortError")showError("The scan took too long. Try a faster public page or try again later.");
    else showError(err.message||"Scan unavailable. Please try again.");
  }finally{clearTimeout(abortId);setBusy(false);}
});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  state.filter=btn.dataset.filter;
  document.querySelectorAll(".filter").forEach(el=>el.classList.toggle("active",el===btn));
  renderFindings();
}));
$("save-json").addEventListener("click",()=>{
  if(!state.report)return;
  exportReport("growth-audit-report.json",JSON.stringify(state.report,null,2),"application/json;charset=utf-8");
  track("growthaudit_report_download");
});
$("save-md").addEventListener("click",()=>{
  if(!state.report)return;
  exportReport("growth-audit-report.md",makeMarkdown(state.report),"text/markdown;charset=utf-8");
  track("growthaudit_report_download");
});
$("print-report").addEventListener("click",()=>{if(state.report)window.print();});
$("copy-summary").addEventListener("click",async function(){
  if(!state.report)return;const summary=safeSummary(state.report);
  try{await navigator.clipboard.writeText(summary);this.textContent="✓ Safe summary copied";}
  catch(_){
    const area=document.createElement("textarea");area.value=summary;
    document.body.append(area);area.select();document.execCommand("copy");area.remove();
    this.textContent="✓ Summary copied";
  }
  setTimeout(()=>{this.textContent="Copy safe summary";},2300);
});
$("request-fixes").addEventListener("click",()=>{
  if(!state.report)return;
  const data={version:1,time:Date.now(),summary:safeSummary(state.report)};
  try{sessionStorage.setItem("nextgen_growthaudit_handoff",JSON.stringify(data));}
  catch(_){showError("Your browser blocked the one-time handoff. Copy your summary instead and paste it into the contact form.");return;}
  track("growthaudit_proposal_handoff");
  window.location.assign("https://www.nextgentechdev.com/#contact");
});
window.GrowthAuditTest={normalizedInput,makeMarkdown,safeSummary};
})();