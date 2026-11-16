/* EA Doctor Pro: 100% local diagnostic engine. Never sends input to a server. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const modes = {
    journal:{ title:"MetaTrader journal diagnostics", ext:".LOG · .TXT", hint:"Paste Experts / Journal output with trade retcodes, or select a UTF-8 log. E.g. retcode=10016, error 130.", placeholder:"Paste your MT5 Experts or Journal log here...", sample:"2026.11.16 12:04:02 Orders: XAUUSD BUY 0.10 failed, retcode=10016 (invalid stops)\n2026.11.16 12:04:03 Orders: XAUUSD BUY request failed retcode=10030\n2026.11.16 12:04:04 Expert: trade error 130\n2026.11.16 12:04:05 Order request error 10019"},
    source:{title:"MQL4 / MQL5 source review",ext:".MQ4 · .MQ5",hint:"Paste editable EA source for read-only heuristic checks. This is not an MQL compiler, interpreter or exploit detector.",placeholder:"Paste your MQL4 / MQL5 Expert Advisor source here...",sample:"// Synthetic EA snippet; not a functioning or profitable strategy\n#include <Trade/Trade.mqh>\nCTrade trade;\ninput double Lots=0.10;\nvoid OnTick(){\n  trade.Buy(Lots,_Symbol);\n  if(false){ Sleep(500); }\n}\n// Real systems need broker retcodes and tested risk controls."},
    trades:{title:"Closed-trade CSV evidence review",ext:".CSV · UTF-8",hint:"Paste a CSV with a profit or pnl column and optional commission / swap / fee columns. Uses closed trades only; HTML backtest files are not supported.",placeholder:"date,profit,commission,swap\n2026-11-01,30,-1,0\n2026-11-02,-40,-1,0",sample:"date,profit,commission,swap\n2026-10-01,70,-2,-1\n2026-10-02,-35,-2,0\n2026-10-03,20,-2,0\n2026-10-04,-65,-2,0\n2026-10-05,55,-2,0\n2026-10-06,-30,-2,0\n2026-10-07,80,-2,-1\n2026-10-08,-20,-2,0\n2026-10-09,40,-2,0\n2026-10-10,-10,-2,0"}
  };
  const tradeCodes = {
    "10004":["Requote","Inspect permitted deviation, tick freshness and broker execution policy.","medium"],
    "10006":["Trade request rejected","Review request parameters and account/symbol trading permissions.","high"],
    "10014":["Invalid trade volume","Read SYMBOL_VOLUME_MIN/MAX/STEP and quantize lots.","high"],
    "10015":["Invalid price","Refresh quotes and align price to tick size and execution mode.","high"],
    "10016":["Invalid stops","Check SL/TP against bid/ask, stops level, freeze level and digits.","high"],
    "10017":["Trading disabled","Check broker account and symbol trade permissions.","high"],
    "10018":["Market closed","Check broker symbol sessions and trading calendar.","medium"],
    "10019":["Not enough money","Review free margin, leverage, open positions and contract size.","high"],
    "10020":["Price changed","Refresh quotes and design bounded retries.","medium"],
    "10021":["No current quotes","Confirm live ticks and symbol availability.","medium"],
    "10024":["Too many trade requests","Use bounded retries, per-symbol cooldown and OnTick throttling.","high"],
    "10026":["Autotrading disabled by server","Contact broker about server-side EA trade permissions.","high"],
    "10027":["Autotrading disabled by terminal","Check Algo Trading toggle and terminal permission settings.","high"],
    "10030":["Unsupported filling mode","Inspect SYMBOL_FILLING_MODE and order fill policy.","high"],
    "10031":["No connection","Check broker server, terminal authorization and VPS connectivity.","high"],
    "10033":["Order limit reached","Compare pending orders with broker limit.","high"],
    "10034":["Volume limit reached","Review symbol volume limit and existing exposure.","high"],
    "10040":["Position limit reached","Inspect server position cap and current positions.","high"],
    "129":["Invalid price (MT4)","Refresh quotes and normalize price to symbol digits.","high"],
    "130":["Invalid stops (MT4)","Check MODE_STOPLEVEL and pending-order distance.","high"],
    "131":["Invalid volume (MT4)","Use MODE_MINLOT/MAXLOT/LOTSTEP and validate requested lots.","high"],
    "132":["Market closed (MT4)","Check trading session hours.","medium"],
    "133":["Trade disabled (MT4)","Check EA, account and symbol permissions.","high"],
    "134":["Not enough money (MT4)","Calculate margin and lower requested exposure.","high"],
    "136":["Off quotes (MT4)","Check live ticks, market watch and connection.","medium"],
    "138":["Requote (MT4)","Review quote refresh and broker price deviation.","medium"],
    "146":["Trade context busy (MT4)","Serialize requests and avoid retry loops.","medium"],
    "148":["Too many orders (MT4)","Inspect open/pending order counts and broker restrictions.","high"]
  };
  const sourceRules = [
    ["EA001","high","Potential hard-coded secret",/(?:api_?key|password|secret|access_?token)\s*=\s*["'][^"'\r\n]{4,}["']/gi,"Remove hard-coded credentials and rotate any disclosed keys."],
    ["EA002","high","Martingale / progressive sizing",/\bmartingale\w*|\b(?:lots?|volume)\s*\*=\s*(?:2(?:\.0)?|[3-9])|MathPow\s*\(\s*2\s*,/gi,"Define bounded exposure, drawdown limits and test tail risk."],
    ["EA003","medium","Sleep inside OnTick handler",/\b(?:void|int)\s+OnTick\s*\([^)]*\)\s*\{[^}]{0,3500}?\bSleep\s*\(/gis,"Avoid blocking tick event processing; use state and timers."],
    ["EA004","high","Unbounded loop pattern",/\bwhile\s*\(\s*(?:true|1)\s*\)/gi,"Use bounded retries and guaranteed exit conditions."],
    ["EA005","medium","Native DLL import",/^\s*#import\s+["'][^\n\r"']+\.dll["']/gim,"Review native dependencies and account for platform compatibility."]
  ];
  let mode="journal";
  let lastReport=null;
  let activeFilename="pasted-input";
  const els={
    input:$("report-input"),file:$("file-select"),title:$("input-heading"),
    hint:$("input-hint"),format:$("mode-format"),status:$("report-status"),
    empty:$("results-empty"),content:$("results-content"),counts:$("result-summary"),
    method:$("report-method"),metrics:$("result-metrics"),findings:$("finding-list")
  };
  function setMode(next){
    mode=next;
    document.querySelectorAll(".mode").forEach(function(btn){
      const yes=btn.dataset.mode===mode;
      btn.classList.toggle("active",yes);btn.setAttribute("aria-selected",String(yes));
    });
    els.input.value="";els.input.placeholder=modes[next].placeholder;
    els.title.textContent=modes[next].title;els.hint.textContent=modes[next].hint;
    els.format.textContent=modes[next].ext;els.file.value="";
    els.file.accept=next==="source"?".mq4,.mq5,text/plain":next==="trades"?".csv,text/csv":".log,.txt,text/plain";
    activeFilename="pasted-input";
    els.empty.hidden=false;els.content.hidden=true;els.status.textContent="READY";lastReport=null;
  }
  const finding = (rule_id,severity,title,remediation,line,confidence) => ({rule_id,severity,title,remediation,line,confidence:confidence||"heuristic"});
  const lineAt = (str,index) => str.slice(0,index).split("\n").length;
  function scanJournal(content){
    const lines=content.split(/\r?\n/).slice(0,15000),f=[],codePattern=/(?:\b(?:retcode|error|err(?:or)?code|code)\s*[:=#-]?\s*|\[|\()(100\d{2}|1(?:29|30|31|32|33|34|36|38|46|48))\b/gi;
    lines.forEach((line,idx)=>{
      if(!/\b(?:trade|order|position|request|retcode|error|failed|rejected|buy|sell)\b/i.test(line))return;
      const seen=new Set();let m;
      codePattern.lastIndex=0;
      while((m=codePattern.exec(line))!==null){
        const code=m[1],item=tradeCodes[code];
        if(!item||seen.has(code))continue;
        seen.add(code);f.push(finding("MT"+code,item[2],item[0],item[1],idx+1,"high"));
      }
    });
    return {findings:f,metrics:null,method:"Documented trade error code matching. The code identifies a symptom; verify the broker and actual request."};
  }
  function removeComments(text){
    return text.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g, function(m){return m.replace(/[^\n]/g," ");});
  }
  function scanSource(input){
    const text=removeComments(input),f=[];
    for(const r of sourceRules){
      let match;let limit=0;r[3].lastIndex=0;
      while((match=r[3].exec(text))!==null&&limit++<25){
        f.push(finding(r[0],r[1],r[2],r[4],lineAt(text,match.index)));
        if(!match[0])r[3].lastIndex++;
      }
    }
    const order=/\bOrderSend\s*\(|\btrade\s*\.\s*(?:Buy|Sell|PositionOpen)\s*\(/i.exec(text);
    if(order){
      const line=lineAt(text,order.index);
      const append=(id,sev,title,fix)=>f.push(finding(id,sev,title,fix,line));
      if(!/\b(?:sl|stop_?loss|setstoploss|stoploss|sl_points|stop_points)\b/i.test(text))
        append("EA010","high","Stop-loss / risk exit not evident","Inspect stop-loss, emergency exits and exposure controls in all included modules.");
      if(!/\b(?:ResultRetcode|retcode|GetLastError|_LastError|last_error)\b/i.test(text))
        append("EA011","medium","Trade result handling not evident","Check trade result and server retcode after every order.");
      if(!/\b(?:SetExpertMagicNumber|magic_?number|magic)\b/i.test(text))
        append("EA012","low","Order ownership marker not evident","Review magic number and position ownership tracking.");
      if(/\bOnTick\s*\(/i.test(text)&&!/\b(?:newbar|lastbar|lasttrade|cooldown|itime|timer|nexttrade|rate_limit)\b/i.test(text))
        append("EA013","medium","Trade-frequency guard not evident","Check repeated tick orders, bounded retries and entry cooldown.");
    }
    f.sort((a,b)=>a.line-b.line||a.rule_id.localeCompare(b.rule_id));
    return {findings:f,metrics:null,method:"Static text heuristics, not MetaEditor compilation, broker execution or proof of absence."};
  }
  function splitCSVLine(line,delim){
    const values=[];let buf="",quote=false;
    for(let i=0;i<line.length;i++){
      const ch=line[i];
      if(ch==='"'){
        if(quote&&line[i+1]==='"'){buf+='"';i++}else quote=!quote;
      }else if(ch===delim&&!quote){values.push(buf);buf=""}else buf+=ch;
    }
    values.push(buf);return values;
  }
  function parseNumber(raw){
    if(raw===null||raw===undefined||String(raw).trim()==="")throw Error("Missing numeric result");
    let s=String(raw).trim().replace(/[£$€\s]/g,"");
    if(s.includes(",")&&!s.includes("."))s=s.replace(",",".");
    else s=s.replace(/,/g,"");
    const n=Number(s);
    if(!Number.isFinite(n))throw Error("Non-finite numeric result");
    return n;
  }
  function analyzeCSV(content){
    const lines=content.replace(/^\uFEFF/,"").split(/\r?\n/).filter(x=>x.trim());
    if(!lines.length)throw Error("CSV must contain a header and at least one trade.");
    const header=lines[0].slice(0,4096);
    const delim=header.includes("\t")?"\t":header.includes(";")?";":",";
    const headers=splitCSVLine(header,delim).map(x=>x.trim().toLowerCase());
    let profit=-1;for(const name of ["profit","pnl","net_profit","p&l"]){if(headers.includes(name)){profit=headers.indexOf(name);break;}}
    if(profit<0)throw Error("CSV needs a profit or pnl header. Use closed-trade data.");
    const costs=["commission","swap","fee","fees"].filter(x=>headers.includes(x)).map(x=>headers.indexOf(x));
    const values=[];let invalid=0;
    if(lines.length>50001)throw Error("Too many trade rows for this browser scanner.");
    for(let i=1;i<lines.length;i++){
      const row=splitCSVLine(lines[i],delim);
      try{let val=parseNumber(row[profit]);costs.forEach(idx=>{if(row[idx]!==undefined&&row[idx].trim())val+=parseNumber(row[idx]);});values.push(val);}
      catch(_){invalid++;}
    }
    if(!values.length)throw Error("No valid closed-trade P&L rows found.");
    const pos=values.reduce((a,v)=>a+(v>0?v:0),0);
    const neg=-values.reduce((a,v)=>a+(v<0?v:0),0);
    const net=values.reduce((a,v)=>a+v,0);
    const abs=values.reduce((a,v)=>a+Math.abs(v),0);
    const largest=values.reduce((max,v)=>Math.max(max,Math.abs(v)),0);
    let equity=0,peak=0,drawdown=0,streak=0,maxStreak=0;
    for(const v of values){equity+=v;peak=Math.max(peak,equity);drawdown=Math.max(drawdown,peak-equity);streak=v<0?streak+1:0;maxStreak=Math.max(maxStreak,streak);}
    const m={
      trades:values.length,invalid_rows:invalid,net_pnl:Math.round(net*100)/100,
      win_rate_pct:Math.round(10000*values.filter(v=>v>0).length/values.length)/100,
      profit_factor:neg>0?Math.round(1000*pos/neg)/1000:null,
      expectancy_per_trade:Math.round(net/values.length*100)/100,
      max_closed_trade_drawdown_currency:Math.round(drawdown*100)/100,
      max_consecutive_losses:maxStreak,
      largest_trade_share_of_absolute_pnl_pct:abs?Math.round(10000*largest/abs)/100:0
    };
    const f=[],add=(id,sev,title,fix)=>f.push(finding(id,sev,title,fix,1,"computed"));
    if(values.length<30)add("TR001","medium","Small trade sample","Collect additional out-of-sample paper/demo trades and avoid extrapolating from a thin sample.");
    if(neg>pos)add("TR002","high","Observed gross losses exceed gains","Inspect costs, execution, position sizing and exit behavior without promising profit.");
    if(abs&&largest/abs>=.45&&values.length>=3)add("TR003","medium","Large-trade outlier dependence","Compare metrics after excluding unusual trades and assess robustness.");
    if(maxStreak>=6)add("TR004","medium","Long observed losing streak","Examine maximum margin/exposure under adverse streaks and daily risk caps.");
    if(invalid)add("TR005","low","Invalid trade rows skipped","Correct the export or missing numeric values and rerun.");
    return {findings:f,metrics:m,method:"Closed-trade P&L only, not broker-verified. No starting balance assumed; drawdown is currency, not equity %."};
  }
  function resultFor(input){
    if(input.length>2_000_000)throw Error("Maximum supported input is 2 MB.");
    if(!input.trim())throw Error("Paste a log, source file or CSV first.");
    if(mode==="journal")return scanJournal(input);
    if(mode==="source")return scanSource(input);
    return analyzeCSV(input);
  }
  function make(tag,className,content){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(content!==undefined)el.textContent=String(content);
    return el;
  }
  function populateMetrics(metrics){
    els.metrics.replaceChildren();
    if(!metrics){els.metrics.hidden=true;return;}
    els.metrics.hidden=false;
    const entries=[
      ["Closed trades",metrics.trades],["Net P&L",metrics.net_pnl],
      ["Win rate",metrics.win_rate_pct+"%"],
      ["Profit factor",metrics.profit_factor===null?"Not defined":metrics.profit_factor],
      ["Avg per trade",metrics.expectancy_per_trade],
      ["Max closed DD",metrics.max_closed_trade_drawdown_currency],
      ["Losing streak",metrics.max_consecutive_losses],
      ["Skipped rows",metrics.invalid_rows]
    ];
    for(const entry of entries){const card=make("div","metric");card.append(make("b","",entry[1]),make("span","",entry[0]));els.metrics.append(card);}
  }
  function render(output){
    const f=output.findings;
    const counts={high:0,medium:0,low:0};
    for(const item of f){const key=item.severity==="critical"?"high":item.severity;counts[key]= (counts[key]||0)+1;}
    els.counts.replaceChildren();
    [["High priority",counts.high],["Review",counts.medium],["Low priority",counts.low]].forEach(entry=>{
      const stat=make("div","stat");stat.append(make("strong","",entry[1]),make("span","",entry[0]));els.counts.append(stat);
    });
    els.method.textContent=output.method;
    populateMetrics(output.metrics);
    els.findings.replaceChildren();
    if(!f.length){
      els.findings.append(make("div","findings-none","No recognized patterns found. This is NOT proof that the EA is error-free, safe or profitable."));
    }else{
      f.forEach(item=>{
        const card=make("article","finding sev-"+item.severity);
        const head=make("div","finding-heading");
        head.append(make("b","",item.rule_id+" · "+item.title),make("span","severity",item.severity));
        card.append(head,make("div","line","Line "+item.line+" · "+item.confidence));
        card.append(make("p","fix",item.remediation));
        els.findings.append(card);
      });
    }
    els.empty.hidden=true;els.content.hidden=false;
    els.status.textContent=f.length?"REPORT READY":"NO MATCHES";
    lastReport={
      tool:"EA Doctor Pro",version:"0.1.0",mode,filename:activeFilename,
      findings:output.findings,metrics:output.metrics,
      counts,method:output.method,
      disclaimer:"Offline heuristics and closed-trade statistics; not compiler validation, trading advice or profitability assurance.",
      data_policy:"Input analyzed inside this browser. No source/log data transmitted to server."
    };
  }
  function download(name,data){
    const blob=new Blob([data],{type:"application/json;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;link.download=name;document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function shortSummary(){
    if(!lastReport)return "";
    let text="EA Doctor Pro diagnostic summary ("+lastReport.mode+")\n";
    text+="Findings: "+lastReport.findings.length+"\n";
    lastReport.findings.slice(0,15).forEach(item=>{text+="- "+item.rule_id+" ["+item.severity+"] "+item.title+" — "+item.remediation+"\n";});
    text+="No source code, original journal text, account details or credentials included.\n";
    text+="Tool: https://www.nextgentechdev.com/ea-doctor";
    return text;
  }
  document.querySelectorAll(".mode").forEach(btn=>btn.addEventListener("click",()=>setMode(btn.dataset.mode)));
  $("load-sample").addEventListener("click",()=>{els.input.value=modes[mode].sample;activeFilename="synthetic-sample";els.input.focus();});
  $("clear-input").addEventListener("click",()=>{els.input.value="";els.file.value="";activeFilename="pasted-input";els.empty.hidden=false;els.content.hidden=true;els.status.textContent="READY";});
  els.file.addEventListener("change",async function(){
    const file=this.files&&this.files[0];if(!file)return;
    if(file.size>2_000_000){alert("Files over 2 MB are not supported.");this.value="";return;}
    try{const content=await file.text();els.input.value=content;activeFilename=file.name;}
    catch(_){alert("Could not read file as text. Export a UTF-8 journal, MQL source or trade CSV.");}
  });
  $("run-scan").addEventListener("click",function(){
    try{const result=resultFor(els.input.value);render(result);if(window.innerWidth<800)els.status.scrollIntoView({behavior:"smooth",block:"center"});}
    catch(err){els.status.textContent="CHECK INPUT";els.empty.hidden=false;els.content.hidden=true;els.empty.querySelector("h3").textContent="Check your input format";els.empty.querySelector("p").textContent=err.message;lastReport=null;}
  });
  $("download-report").addEventListener("click",function(){
    if(!lastReport)return;download("ea-doctor-"+mode+"-report.json",JSON.stringify(lastReport,null,2));
  });
  $("copy-summary").addEventListener("click",async function(){
    if(!lastReport)return;const value=shortSummary();
    try{await navigator.clipboard.writeText(value);this.textContent="✓ Safe summary copied";}
    catch(_){const ta=document.createElement("textarea");ta.value=value;document.body.append(ta);ta.select();document.execCommand("copy");ta.remove();this.textContent="✓ Summary copied";}
    setTimeout(()=>{this.textContent="Copy safe summary";},2500);
  });
  // Expose deterministic, side-effect-free scanners for local test harnesses.
  if(typeof window!=="undefined")window.EADoctor={scanJournal,scanSource,analyzeCSV};
})();
