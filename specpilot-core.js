import { TEMPLATES } from "./specpilot-data.js";

const trim=(value,max=2000)=>String(value??"").replace(/\r/g,"").trim().slice(0,max);
const distinct=(a)=>[...new Set(Array.isArray(a)?a.map(x=>String(x)):[])];
export function getTemplate(id){return TEMPLATES[id]||null;}
export function validateForm(form){
  const errors=[];
  if(!getTemplate(form.category)) errors.push("Select the type of project.");
  if(trim(form.title,120).length<3) errors.push("Enter a project name (at least 3 characters).");
  if(trim(form.goal,2400).length<18) errors.push("Describe the actual business problem in at least 18 characters.");
  return errors;
}
export function readiness(form){
  const conditions=[
    Boolean(getTemplate(form.category)),
    trim(form.title).length>=3,
    trim(form.goal).length>=18,
    trim(form.users).length>=4,
    (form.features||[]).length>=1,
    trim(form.success).length>=12,
    Boolean(trim(form.timeline)),
    Boolean(trim(form.platform)),
    trim(form.constraints).length>=6,
    trim(form.owner).length>=4
  ];
  const labels=["project type","project name","business problem","intended users","required features","definition of success","target timing","platform / deployment","security / privacy needs","ownership and access"];
  return {score:conditions.filter(Boolean).length*10,missing:labels.filter((label,i)=>!conditions[i])};
}
export function complexity(form){
  const n=distinct(form.features).length,m=distinct(form.integrations).length;
  const factors=[
    ["Selected features",Math.min(24,Math.max(0,n-2)*4)],
    ["External integrations",Math.min(32,m*8)],
    ["Data migration",form.migration==="yes"?12:0],
    ["Potentially regulated data",/(sensitive|patient|health|financial|payment|personal|gdpr|hipaa)/i.test(form.constraints||"")?16:0],
    ["Multiple platforms",/(both|ios.*android|mobile.*web|multi.?tenant)/i.test(form.platform||"")?12:0],
  ].filter(x=>x[1]>0);
  const points=Math.min(100,12+factors.reduce((sum,x)=>sum+x[1],0));
  return {points,label:points<30?"Focused":points<60?"Moderate":"Complex",factors,note:"Internal scoping signal only, not a price quote, engineering time estimate, or verified complexity assessment."};
}
export function blueprint(form){
  const errors=validateForm(form);
  if(errors.length)throw new Error(errors.join(" "));
  const tpl=TEMPLATES[form.category];
  const features=distinct(form.features).filter(f=>tpl.features.includes(f));
  const integrations=distinct(form.integrations).filter(f=>tpl.integrations.includes(f));
  const answers=Array.isArray(form.answers)?form.answers:[];
  const has=(value)=>trim(value).length>0;
  const issues=[...tpl.questions];
  if(!has(form.users))issues.push("Who will use the system, and what user roles are needed?");
  if(!has(form.platform))issues.push("Where should it run, and who owns the target environment?");
  if(!has(form.success))issues.push("How will success and acceptance be measured?");
  if(!has(form.constraints))issues.push("Which privacy, data handling, and compliance rules apply?");
  if(!has(form.timeline))issues.push("Is there a launch deadline and why?");
  if(!integrations.length)issues.push("Does this project require any third-party APIs or accounts?");
  const stages=[
    ["Discovery and scope","Approved requirements, explicit assumptions, access plan and acceptance cases"],
    ["Core implementation","Reviewable functional workflows, access rules, and automated unit checks"],
    ["Integration and quality","Provider sandbox checks, exception cases, and a test evidence summary"],
    ["Release and handover","Deployment, documentation, ownership and post-launch verification"]
  ];
  return {
    tool:"SpecPilot Pro",version:"0.1.0",category:form.category,service:tpl.name,
    title:trim(form.title,120),goal:trim(form.goal,2400),
    users:trim(form.users,600)||"To be clarified",
    platform:trim(form.platform,450)||"To be determined",
    features,customFeatures:trim(form.customFeatures,700).split("\n").map(s=>s.trim()).filter(Boolean).slice(0,12),
    integrations,success:trim(form.success,1100)||"Define measurable acceptance tests before agreeing delivery",
    timeline:trim(form.timeline,120)||"Not specified",
    budget:trim(form.budget,120)||"Open to proposals",
    constraints:trim(form.constraints,900)||"To be confirmed",
    owner:trim(form.owner,350)||"To be confirmed",
    migration:form.migration==="yes"?"Required":form.migration==="no"?"Not required":"Unconfirmed",
    discoveryQuestions:tpl.questions.map((question,i)=>({question,answer:trim(answers[i],700)||"Unanswered"})),
    recommendedTests:tpl.acceptance.map((test,i)=>({id:"AT-"+String(i+1).padStart(2,"0"),test,status:"Suggested — verify during discovery"})),
    risks:tpl.risks.map(risk=>({risk,mitigation:"Define an explicit safeguard and acceptance test before release"})),
    milestones:stages.map(([name,deliverable],i)=>({phase:i+1,name,deliverable})),
    missingDecisions:[...new Set(issues)],readiness:readiness(form),complexity:complexity(form),
    disclaimers:[
      "Generated deterministically from editable templates; no AI model or external API is used.",
      "Suggested requirements, tests and phases are an initial discussion aid, not a binding specification, contract or quotation.",
      "No third-party integrations, live systems or business outcomes were validated."
    ]
  };
}
function mdSafe(s){return String(s??"").replace(/(^|\n)\s*#{1,6}\s/g,"$1");}
export function toMarkdown(b){
  const lines=[
    "# "+mdSafe(b.title),"","SpecPilot Pro · Project blueprint · v"+b.version,"",
    "## Business need",mdSafe(b.goal),"",
    "## Audience and environment","- Users: "+mdSafe(b.users),"- Platform: "+mdSafe(b.platform),
    "- Timeline: "+mdSafe(b.timeline),"- Budget: "+mdSafe(b.budget),"- Ownership: "+mdSafe(b.owner),"",
    "## MVP features",...([...b.features,...b.customFeatures].length?[...b.features,...b.customFeatures].map(x=>"- "+mdSafe(x)):["- Features to be confirmed"]),"",
    "## Integrations",...(b.integrations.length?b.integrations.map(x=>"- "+mdSafe(x)):["- None specified; confirm during scoping"]),"",
    "## Success definition",mdSafe(b.success),"",
    "## Suggested acceptance tests",...b.recommendedTests.map(x=>"- [ ] "+x.id+" — "+mdSafe(x.test)),"",
    "## Delivery phases",...b.milestones.map(x=>x.phase+". **"+x.name+"** — "+x.deliverable),"",
    "## Risks to address",...b.risks.map(x=>"- "+x.risk+" — "+x.mitigation),"",
    "## Constraints",mdSafe(b.constraints),"- Data migration: "+b.migration,"",
    "## Questions still to answer",...b.missingDecisions.map(x=>"- "+x),"",
    "## Scope indicators","- Brief readiness: "+b.readiness.score+"/100",
    "- Rough complexity signal: "+b.complexity.label+" ("+b.complexity.points+"/100)",
    "- "+b.complexity.note,"",
    "## Limitations",...b.disclaimers.map(x=>"- "+x),"",
    "Created at https://www.nextgentechdev.com/specpilot"
  ];
  return lines.join("\n");
}
export function safeProposalSummary(b){
  return [
    "SpecPilot Pro project inquiry",
    "Project: "+b.title,
    "Service: "+b.service,
    "Goal: "+b.goal,
    "Users: "+b.users,
    "Platform: "+b.platform,
    "Must-have: "+[...b.features,...b.customFeatures].join("; "),
    "Integrations: "+(b.integrations.join("; ")||"Not confirmed"),
    "Success criteria: "+b.success,
    "Timing: "+b.timeline,
    "Budget: "+b.budget,
    "Security/data: "+b.constraints,
    "Ownership: "+b.owner,
    "Scope readiness: "+b.readiness.score+"/100",
    "Note: Initial brief, not a fixed quotation."
  ].join("\n").slice(0,7800);
}
