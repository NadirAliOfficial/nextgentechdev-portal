import { TEMPLATES, CATEGORIES } from "./specpilot-data.js";
import { blueprint, toMarkdown, validateForm, readiness, complexity, safeProposalSummary } from "./specpilot-core.js";

const $=(s)=>document.getElementById(s);
const state={
  category:"ai",title:"",goal:"",users:"",features:[],integrations:[],
  customFeatures:"",success:"",platform:"",timeline:"",budget:"",
  migration:"unknown",constraints:"",owner:"",answers:[]
};
let step=1,generated=null,markdown="";
/* Funnel events contain only event names and a public route, never the brief. */
const tracked=new Set();
function trackOnce(event){
  if(tracked.has(event))return;
  tracked.add(event);
  if(typeof window.ngTrack==="function")window.ngTrack(event,{target:"/specpilot"});
}
function track(event){
  if(typeof window.ngTrack==="function")window.ngTrack(event,{target:"/specpilot"});
}
const panels=[...document.querySelectorAll(".step-panel")];
function clear(node){while(node.firstChild)node.firstChild.remove();}
function el(tag,className,text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text!==undefined)node.textContent=String(text);
  return node;
}
function formValue(id){return $(id)?.value??"";}
function sync(){
  state.title=formValue("project-title");state.goal=formValue("project-goal");
  state.users=formValue("project-users");state.customFeatures=formValue("custom-features");
  state.success=formValue("project-success");state.platform=formValue("project-platform");
  state.timeline=formValue("project-timeline");state.budget=formValue("project-budget");
  state.migration=formValue("project-migration");state.constraints=formValue("project-constraints");
  state.owner=formValue("project-owner");
  state.features=[...document.querySelectorAll('#feature-grid input:checked')].map(n=>n.value);
  state.integrations=[...document.querySelectorAll('#integration-grid input:checked')].map(n=>n.value);
  state.answers=[...document.querySelectorAll('#question-grid textarea')].map(n=>n.value);
  const rd=readiness(state),cp=complexity(state);
  $("readiness-value").textContent=rd.score+"%";
  $("readiness-label").textContent=rd.score>=80?"Strong initial brief":rd.score>=50?"Getting clearer":"Needs discovery";
  $("progress-fill").style.width=rd.score+"%";
  $("count-features").textContent=String(state.features.length);
  $("count-integrations").textContent=String(state.integrations.length);
  $("complexity-value").textContent=cp.label;
  clear($("missing-list"));
  for(const entry of rd.missing.slice(0,6)) $("missing-list").append(el("li","",entry));
  if(!rd.missing.length)$("missing-list").append(el("li","","Ready for a technical discovery call"));
}
function buildCategoryGrid(){
  const target=$("category-grid");clear(target);
  for(const c of CATEGORIES){
    const btn=el("button","category","");
    btn.type="button";btn.dataset.category=c.id;
    btn.classList.toggle("selected",c.id===state.category);
    btn.append(el("span","category-symbol",c.icon),el("span","category-name",c.name));
    btn.addEventListener("click",()=>{
      if(state.category!==c.id){
        sync();state.category=c.id;state.features=[];state.integrations=[];state.answers=[];
        buildCategoryGrid();buildFeatures();buildQuestions();sync();
      }
    });
    target.append(btn);
  }
}
function makeCheckbox(value,type,selected){
  const label=el("label","option");
  const inp=el("input");inp.type="checkbox";inp.value=value;inp.name=type;
  inp.checked=selected.includes(value);
  inp.addEventListener("change",sync);
  label.append(inp,el("span","",value));
  return label;
}
function buildFeatures(){
  const t=TEMPLATES[state.category];
  const f=$("feature-grid"),g=$("integration-grid");clear(f);clear(g);
  for(const item of t.features)f.append(makeCheckbox(item,"feature",state.features));
  for(const item of t.integrations)g.append(makeCheckbox(item,"integration",state.integrations));
}
function buildQuestions(){
  const g=$("question-grid");clear(g);
  for(const [i,q] of TEMPLATES[state.category].questions.entries()){
    const l=el("label","field full");
    l.append(el("span","",q));
    const area=el("textarea");area.rows=2;area.maxLength=700;
    area.placeholder="Optional — if unknown, leave blank";
    area.value=state.answers[i]||"";
    area.addEventListener("input",sync);
    l.append(area);g.append(l);
  }
}
function setStep(n){
  step=Math.max(1,Math.min(4,n));
  panels.forEach(p=>{p.hidden=Number(p.dataset.step)!==step;});
  document.querySelectorAll("[data-step-chip]").forEach(e=>{
    const idx=Number(e.dataset.stepChip);
    e.classList.toggle("active",idx===step);e.classList.toggle("complete",idx<step);
  });
  $("step-label").textContent="Step "+step+" of 4";
  $("back-step").hidden=step===1;
  $("next-step").hidden=step===4;
  $("form-error").hidden=true;
  if(step===4)renderBlueprint();
  sync();
}
function errorMessage(message){
  $("form-error").textContent=message;$("form-error").hidden=false;
}
function renderBlueprint(){
  sync();
  try{
    generated=blueprint(state);
    markdown=toMarkdown(generated);
    trackOnce("specpilot_blueprint_completed");
    $("blueprint-output").textContent=markdown;
    const stats=$("blueprint-stats");clear(stats);
    for(const [label,value] of [
      ["Readiness",generated.readiness.score+"/100"],
      ["Complexity",generated.complexity.label],
      ["Acceptance checks",generated.recommendedTests.length]
    ]){
      const card=el("div","b-stat");card.append(el("strong","",value),el("span","",label));stats.append(card);
    }
  }catch(err){
    generated=null;errorMessage(err.message);
  }
}
function download(name,body,type){
  const data=new Blob([body],{type});
  const url=URL.createObjectURL(data);const a=document.createElement("a");
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function labelAction(button,title){button.textContent=title;setTimeout(()=>{button.textContent="Copy brief";},2000);}
$("next-step").addEventListener("click",()=>{
  sync();
  if(step===1){
    const problems=validateForm(state);
    if(problems.length){errorMessage(problems.join(" "));return;}
    trackOnce("specpilot_started");
  }
  setStep(step+1);
  $("studio").scrollIntoView({behavior:"smooth",block:"start"});
});
$("back-step").addEventListener("click",()=>{setStep(step-1);$("studio").scrollIntoView({behavior:"smooth",block:"start"});});
$("download-md").addEventListener("click",()=>{if(generated)download("specpilot-"+state.category+"-blueprint.md",markdown,"text/markdown;charset=utf-8");});
$("download-json").addEventListener("click",()=>{if(generated)download("specpilot-"+state.category+"-blueprint.json",JSON.stringify(generated,null,2),"application/json;charset=utf-8");});
$("print-report").addEventListener("click",()=>{if(generated)window.print();});
$("copy-report").addEventListener("click",async(e)=>{
  if(!generated)return;
  try{await navigator.clipboard.writeText(markdown);labelAction(e.currentTarget,"✓ Copied");}
  catch(_){const t=document.createElement("textarea");t.value=markdown;document.body.append(t);t.select();document.execCommand("copy");t.remove();labelAction(e.currentTarget,"✓ Copied");}
});
$("request-proposal").addEventListener("click",()=>{
  if(!generated)return;
  const payload={version:1,time:Date.now(),category:generated.category,summary:safeProposalSummary(generated)};
  // Explicit one-time handoff; no URL containing confidential details and no automatic submission.
  sessionStorage.setItem("nextgen_specpilot_handoff",JSON.stringify(payload));
  track("specpilot_handoff_clicked");
  window.location.assign("https://www.nextgentechdev.com/#contact");
});
$("load-example").addEventListener("click",()=>{
  state.category="workflow";
  state.features=[TEMPLATES.workflow.features[0],TEMPLATES.workflow.features[2],TEMPLATES.workflow.features[4],TEMPLATES.workflow.features[6]];
  state.integrations=["HubSpot","Internal APIs"];
  state.answers=[
    "A new lead arrives through an approved form webhook.",
    "Notify the operator and queue approval when a lead requests enterprise pricing.",
    "The CRM administrator owns credentials and can revoke them."
  ];
  buildCategoryGrid();buildFeatures();buildQuestions();
  const sample={
    "project-title":"Customer lead triage and CRM routing",
    "project-goal":"Reduce manual lead intake by validating new inquiry events, routing qualified leads to HubSpot and requiring approval for sensitive actions.",
    "project-users":"Five sales staff and the customer success manager",
    "custom-features":"No duplicate contacts from webhook retries",
    "project-success":"At least 95% of synthetic lead examples route to the expected queue and duplicate events never produce duplicate CRM records.",
    "project-platform":"Web service with secure CRM API integration",
    "project-timeline":"1–2 months",
    "project-budget":"Open to discussion",
    "project-migration":"no",
    "project-constraints":"Customer names, emails and phone numbers require strict role-based access and retention limits.",
    "project-owner":"Company owns HubSpot workspace and receives all source code."
  };
  for(const [id,value] of Object.entries(sample))$(id).value=value;
  setStep(1);sync();
  $("studio").scrollIntoView({behavior:"smooth",block:"start"});
});
for(const id of ["project-title","project-goal","project-users","custom-features","project-success","project-platform","project-timeline","project-budget","project-migration","project-constraints","project-owner"]){
  $(id).addEventListener("input",sync);$(id).addEventListener("change",sync);
}
buildCategoryGrid();buildFeatures();buildQuestions();setStep(1);
// Basic test entrypoint, pure core remains tested separately.
window.SpecPilotTest={getState:()=>({...state}),setStep};
