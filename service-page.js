(function(){
"use strict";
document.addEventListener("DOMContentLoaded",()=>{
  const data=window.NEXTGEN_SERVICE_CATALOG;
  if(!data||!Array.isArray(data.services)) return;
  const path=(window.location.pathname.replace(/\.html$/,"").replace(/\/$/,"")||"/");
  const service=data.services.find(item=>item.href===path);
  if(!service) return;
  const category=data.categories.find(item=>item.slug===service.category);
  const main=document.querySelector("main");
  const hero=main&&main.querySelector(".hero");
  if(!main||!hero) return;

  if(!main.querySelector(".svc-breadcrumb")){
    const nav=document.createElement("nav");
    nav.className="svc-breadcrumb";
    nav.setAttribute("aria-label","Breadcrumb");
    nav.innerHTML='<a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span>'+
      (category?'<a href="'+category.url+'">'+category.label+'</a><span>/</span>':'')+
      '<span aria-current="page">'+service.title+'</span>';
    main.insertBefore(nav,hero);
  }

  if(!main.querySelector(".svc-buying-brief")){
    const deliverables=(service.deliverables||[]).map(item=>"<li>"+item+"</li>").join("");
    const example=service.category==="trading"
      ? {href:"/mt5-ea-requirements-generator",label:"View related MT5 tool"}
      : service.category==="ai-automation"
        ? {href:"/ai-automation-roi-calculator",label:"View related AI tool"}
        : {href:"/portfolio",label:"View public work"};
    const section=document.createElement("section");
    section.className="svc-buying-brief";
    section.innerHTML=
      '<div class="svc-brief-item"><span>GOOD FIT FOR</span><p>'+service.audience+'</p></div>'+
      '<div class="svc-brief-item"><span>WHAT YOU RECEIVE</span><ul>'+deliverables+'</ul></div>'+
      '<div class="svc-brief-item"><span>BEFORE WE START</span><p>'+service.requirements+'</p></div>'+
      '<div class="svc-brief-action"><small>Custom scope · Quote after review</small><div><a href="/?service='+encodeURIComponent(service.slug)+'#contact">Request a quote →</a><a class="svc-example-link" href="'+example.href+'">'+example.label+'</a></div></div>';
    hero.insertAdjacentElement("afterend",section);
  }
});
})();