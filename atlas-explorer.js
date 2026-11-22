/* Lumiose Atlas Explorer — one read-only, source-aligned 2D city-map viewport.
   No user tracking, database, localStorage, external SDK, or game-state write. */
import {
  MAP_SIZE, MIN_ZOOM, MAX_ZOOM, stageBase, startView, project,
  constrain, panBy, changeAround, centreOn, normaliseRoute, eligibleMapPin
} from "./atlas-explorer-geometry.mjs";
const by = id => document.getElementById(id);
const viewport=by("aeViewport"),stage=by("aeStage"),layer=by("aeMapPins");
const resultList=by("aeResults"),selectedPanel=by("aeSelected"),search=by("aeSearch");
const routePicker=by("aeRouteSelect"),routeDetail=by("aeRouteDetail");
const routeProgress=by("aeRouteProgress"),currentStep=by("aeCurrentStep");
const prevStep=by("aePrevStep"),nextStep=by("aeNextStep"),showRouteMap=by("aeShowRouteMap");
const filters=Array.from(document.querySelectorAll("[data-kind]"));
const layerToggles=Array.from(document.querySelectorAll("#aeLayers [data-layer]"));
const layerToggleByKind=new Map(layerToggles.map(input=>[input.dataset.layer,input]));
const layerVisible=kind=>layerToggleByKind.get(kind)?.checked!==false;
const needle=by("aeNeedle"),zoomLabel=by("aeZoomLabel"),readout=by("aePositionReadout");
const count=by("aeCount"),stats=by("aeStats"),noResults=by("aeNoResults");
if(!viewport||!stage||!layer||!resultList||!selectedPanel||!routePicker)throw Error("Atlas Explorer page markup missing");
const element=(tag,cls,value)=>{
  const out=document.createElement(tag);
  if(cls)out.className=cls;
  if(value!==undefined)out.textContent=String(value);
  return out;
};
const plain=value=>typeof value==="string"?value:"";
const isPoint=xy=>Array.isArray(xy)&&xy.length===2&&xy.every(n=>Number.isFinite(n)&&n>=0&&n<=MAP_SIZE);
const labels={zone:"Wild Zone",holovator:"Owner Holovator",ladder:"Ladder",scaffold:"Scaffold access",landmark:"Landmark",sector:"Named sector"};
const icons={zone:"W",holovator:"⤊",ladder:"≡",scaffold:"▤",landmark:"◆",sector:"48"};
const evidenceText={owner_survey:"Owner-recorded approach",owner_photographed:"Physically photographed",
  owner_reported:"Owner reported; destination map position unknown",
  guide_crosscheck:"Independent quest-guide cross-check",
  unverified:"Further survey needed — do not assume connected access"};
let records=[],routes=[],recordMap=new Map(),pinMap=new Map();
let activeKind="all",selectedId=null,routeId=null,stepIndex=0;
let view=startView(),tint=false,ready=false;
let pointers=new Map(),frame=null,paintScheduled=false;
const dimensions=()=>{
  const rect=viewport.getBoundingClientRect();
  return {width:Math.max(1,rect.width),height:Math.max(1,rect.height)};
};
function draw(){
  paintScheduled=false;
  const dim=dimensions(),size=stageBase(dim);
  stage.style.width=size+"px";
  stage.style.height=size+"px";
  stage.style.transform="translate(-50%, -50%) translate("+view.panX+"px, "+view.panY+"px) rotate("+view.rotation+"deg) scale("+view.zoom+")";
  for(const pin of pinMap.values()){
    pin.style.setProperty("--inverse-zoom",String(1/view.zoom));
    pin.style.setProperty("--counter-rotation",(-view.rotation)+"deg");
  }
  needle.style.transform="rotate("+(-view.rotation)+"deg)";
  zoomLabel.textContent=view.zoom.toFixed(2)+"×";
  readout.textContent="Original 2D city geometry · "+Math.round(view.rotation)+"° clockwise";
}
function scheduleDraw(){
  if(paintScheduled)return;
  paintScheduled=true;
  window.requestAnimationFrame(draw);
}
function applyView(next){
  view=constrain(next,dimensions());
  scheduleDraw();
}
const mapCenter=()=>{const d=dimensions();return{x:d.width/2,y:d.height/2};};
function focusRecord(item){
  if(!isPoint(item?.xy))return;
  const d=dimensions();
  applyView(centreOn(item.xy,{...view,zoom:Math.max(1.7,view.zoom)},d));
}
const tag=(text)=>element("span","ae-evidence-tag",text);
const paragraph=(text)=>element("p","",text);
function link(href,label,external=false){
  const a=element("a","",label);
  a.href=href;
  if(external){a.target="_blank";a.rel="noopener noreferrer";}
  return a;
}
function detailsFor(item){
  selectedPanel.replaceChildren();
  selectedPanel.append(tag(labels[item.kind]),tag(item.district||"Lumiose"));
  if(item.kind==="holovator")selectedPanel.append(tag("Approximate map pin · owner survey"));
  if(item.kind==="sector")selectedPanel.append(tag("No precise mapped sector polygon"));
  selectedPanel.append(element("h3","",item.name));
  if(item.area)selectedPanel.append(paragraph("Area: "+item.area));
  if(item.directions)selectedPanel.append(paragraph(item.directions));
  if(item.description)selectedPanel.append(paragraph(item.description));
  if(item.kind==="zone"){
    selectedPanel.append(paragraph("This source-saved Wild Zone centre is for orientation, not an exact item, ladder or interior entrance."));
    selectedPanel.append(link(item.link,"Open Wild Zone "+String(item.number).padStart(2,"0")+" and pickup notes"));
  }else if(item.kind==="sector"){
    selectedPanel.append(paragraph("This sector name is verified in the directory. Its exact map boundary is not independently traced, so no arbitrary pin is drawn."));
    selectedPanel.append(link(item.link,"Open this sector's original clues"));
  }else if(item.kind==="holovator"){
    selectedPanel.append(paragraph("The physical lift is in the owner's field survey. The symbol on this 1920px overview is an approximate approach lead, not a measured door or roof landing."));
    if(item.photos?.length){
      selectedPanel.append(element("h4","",item.photos.length+" genuine owner photographs on GitHub"));
      const gallery=element("div","ae-photo-grid");
      for(const photo of item.photos.slice(0,8)){
        if(typeof photo.path!=="string"||!photo.path.startsWith("assets/atlas/holovators/")||!photo.path.endsWith(".jpg"))continue;
        const fig=element("figure"),a=link(photo.path,"",true);
        a.setAttribute("aria-label","Open original "+item.name+" photo, "+plain(photo.role));
        const img=element("img");
        img.src=photo.path;img.alt="Original game photograph of "+item.name+": "+plain(photo.role).replace(/[-_]/g," ");
        img.loading="lazy";img.decoding="async";
        a.append(img);
        fig.append(a,element("figcaption","",plain(photo.role).replace(/[-_]/g," ")));
        gallery.append(fig);
      }
      selectedPanel.append(gallery);
      if(item.photos.length>8)selectedPanel.append(paragraph("Additional original photographs are indexed in the Holovator fieldbook."));
    }else{
      selectedPanel.append(paragraph("Original survey images for this location are not yet hosted in GitHub. No broken or replacement artwork is shown."));
    }
    selectedPanel.append(link("maps.html","Open the original Wild Zone city map"));
  }else if(item.kind==="ladder"){
    selectedPanel.append(paragraph("The real ladder was photographed at ground level; its exact rooftop landing and onward path remain unverified."));
    if(item.source_record)selectedPanel.append(link(item.source_record,"Read original Hotel Z ladder survey evidence"));
  }else if(item.kind==="scaffold"){
    selectedPanel.append(paragraph(eligibleMapPin(item)
      ? "This scaffold pin is tied to documented ground coordinates. Any rooftop connection still needs its own evidence."
      : "No verified ground map coordinates yet. This location stays in the research directory, not on the permanent map."));
    if(/^MAPS_[A-Z0-9_-]+\.json$/.test(plain(item.source_record)))
      selectedPanel.append(link(item.source_record,"Read scaffold field-survey evidence"));
  }else if(item.kind==="landmark"&&!isPoint(item.xy)){
    selectedPanel.append(paragraph("Landmark is in the source directory but has no independently measured map position."));
  }
  if(item.kind==="holovator"&&item.source_record){
    selectedPanel.append(paragraph("Research provenance:"));
    selectedPanel.append(link(item.source_record,"Open owner field-survey record"));
  }
  const related=routes.find(r=>r.point_id===item.id);
  if(related){
    const b=element("button","ae-route-link","Follow documented approach →");
    b.type="button";b.style.cssText="margin-top:12px;padding:9px 12px;background:#4f337a;color:white;border:none;border-radius:9px";
    b.addEventListener("click",()=>{
      chooseRoute(related.id);
      by("aeRoutesSection").scrollIntoView({behavior:"smooth",block:"start"});
    });
    selectedPanel.append(b);
  }else if(item.kind==="holovator"){
    selectedPanel.append(paragraph("Indoor rooms and rooftop connections for this lift have not been documented step by step."));
  }
}
function selectRecord(item,focus=true){
  if(!item)return;
  // A directory selection should never focus on an invisible map pin.
  const switchFor=layerToggleByKind.get(item.kind);
  if(pinMap.has(item.id)&&switchFor&&!switchFor.checked){
    switchFor.checked=true;
    drawList();
  }
  selectedId=item.id;
  detailsFor(item);
  for(const [id,pin] of pinMap)pin.setAttribute("aria-pressed",String(id===selectedId));
  for(const button of resultList.querySelectorAll("[data-record-id]")){
    button.setAttribute("aria-pressed",String(button.dataset.recordId===selectedId));
  }
  if(focus)focusRecord(item);
  const route=routes.find(r=>r.point_id===item.id);
  if(route)chooseRoute(route.id);
}
function match(item){
  const query=search.value.trim().toLocaleLowerCase();
  if(activeKind!=="all"&&item.kind!==activeKind)return false;
  if(!query)return true;
  return [item.name,item.area,item.district,item.description,item.directions,labels[item.kind]]
    .some(value=>plain(value).toLocaleLowerCase().includes(query));
}
function drawList(){
  resultList.replaceChildren();
  const matches=records.filter(match);
  for(const item of matches){
    const button=element("button");
    button.type="button";button.dataset.recordId=item.id;
    button.setAttribute("aria-pressed",String(selectedId===item.id));
    const badge=element("span","ae-list-symbol",item.kind==="zone"?String(item.number).padStart(2,"0"):icons[item.kind]);
    const text=element("span");
    const placement=pinMap.has(item.id)
      ? (item.kind==="scaffold"?" · verified ground pin":" · approx. map point")
      : " · directory / awaiting precise pin";
    text.append(element("strong","",item.name),element("small","",labels[item.kind]+" · "+(item.district||"city")+placement));
    button.append(badge,text);
    button.addEventListener("click",()=>selectRecord(item,true));
    resultList.append(button);
  }
  const matchedIds=new Set(matches.map(x=>x.id));
  for(const [id,pin] of pinMap)
    pin.hidden=!matchedIds.has(id)||!layerVisible(pin.dataset.kind);
  for(const b of filters)b.setAttribute("aria-pressed",String(b.dataset.kind===activeKind));
  count.textContent=matches.length+" of "+records.length+" documented city entries";
  noResults.hidden=matches.length!==0;
}
function createPins(){
  layer.replaceChildren();pinMap.clear();
  for(const item of records){
    if(!eligibleMapPin(item))continue;
    const pin=element("button","ae-pin");
    pin.type="button";pin.dataset.kind=item.kind;
    pin.style.left=(item.xy[0]/MAP_SIZE*100).toFixed(4)+"%";
    pin.style.top=(item.xy[1]/MAP_SIZE*100).toFixed(4)+"%";
    const symbol=item.kind==="zone"?String(item.number).padStart(2,"0"):icons[item.kind];
    pin.append(element("span","",symbol));
    pin.setAttribute("aria-label",item.name+"; "+(item.kind==="zone"?"saved zone centre":item.kind==="scaffold"?"verified ground position":"approximate research position"));
    pin.setAttribute("aria-pressed","false");
    pin.title=item.name+" · "+(item.kind==="zone"?"original zone centre":item.kind==="scaffold"?"verified ground location":"approximate area");
    pin.addEventListener("click",event=>{event.stopPropagation();selectRecord(item,false);});
    layer.append(pin);pinMap.set(item.id,pin);
  }
}
function routeLabel(step){return step.space.replace(/-/g," ");}
function chooseRoute(id){
  const found=routes.find(x=>x.id===id);
  if(!found)return;
  routeId=id;stepIndex=0;routePicker.value=id;
  renderRoute();
}
function renderRoute(){
  const route=routes.find(x=>x.id===routeId);
  if(!route)return;
  const item=recordMap.get(route.point_id);
  routeDetail.replaceChildren();
  routeDetail.append(element("strong","",route.title),paragraph(route.description));
  routeDetail.append(paragraph("Evidence: recorded player approach. No complete interior floorplan, live GPS or automatic between-building walking route exists yet."));
  if(route.risk==="hostile_wild_pokemon")routeDetail.append(element("p","ae-warning","⚠ Hostile wild Pokémon in this approach."));
  if(!route.known_floor_plan)routeDetail.append(element("p","ae-warning","Room and roof geometry not fully measured. Treat any unrecorded doorway or connection as unknown."));
  routeProgress.textContent="Step "+(stepIndex+1)+" of "+route.steps.length+" · "+(item?.district||"Lumiose");
  const step=route.steps[stepIndex];
  currentStep.replaceChildren(
    element("div","ae-space-label",routeLabel(step)+" level / access"),
    element("h3","",step.title),
    paragraph(step.instruction),
    element("div","ae-evidence-status",evidenceText[step.evidence]||"Needs independent verification")
  );
  prevStep.disabled=stepIndex===0;
  nextStep.disabled=stepIndex===route.steps.length-1;
  showRouteMap.disabled=!isPoint(item?.xy);
}
const pointerView=()=>{
  const rect=viewport.getBoundingClientRect();
  return [...pointers.entries()].sort((a,b)=>a[0]-b[0]).map(([id,p])=>({id,x:p.x-rect.left,y:p.y-rect.top}));
};
const pointFrame=values=>{
  if(!values.length)return null;
  const a=values[0],b=values[1];
  if(!b)return{count:1,x:a.x,y:a.y,angle:0,distance:0};
  return{count:2,x:(a.x+b.x)/2,y:(a.y+b.y)/2,angle:Math.atan2(b.y-a.y,b.x-a.x),distance:Math.hypot(b.x-a.x,b.y-a.y)};
};
function handlePointerMove(e){
  if(!pointers.has(e.pointerId))return;
  const rect=viewport.getBoundingClientRect();
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const now=pointFrame(pointerView());
  if(frame&&now&&frame.count===now.count){
    const dim={width:Math.max(1,rect.width),height:Math.max(1,rect.height)};
    if(now.count===1)applyView(panBy(view,now.x-frame.x,now.y-frame.y,dim));
    else {
      const factor=frame.distance>12?now.distance/frame.distance:1;
      let delta=(now.angle-frame.angle)*180/Math.PI;
      if(delta>180)delta-=360;
      if(delta< -180)delta+=360;
      let v=changeAround(view,{x:frame.x,y:frame.y},dim,factor,delta);
      v=panBy(v,now.x-frame.x,now.y-frame.y,dim);
      applyView(v);
    }
  }
  frame=now;
}
function setupNavigation(){
  by("aeZoomIn").addEventListener("click",()=>applyView(changeAround(view,mapCenter(),dimensions(),1.3)));
  by("aeZoomOut").addEventListener("click",()=>applyView(changeAround(view,mapCenter(),dimensions(),1/1.3)));
  by("aeTurnLeft").addEventListener("click",()=>applyView(changeAround(view,mapCenter(),dimensions(),1,-45)));
  by("aeTurnRight").addEventListener("click",()=>applyView(changeAround(view,mapCenter(),dimensions(),1,45)));
  const northUp=()=>applyView(changeAround(view,mapCenter(),dimensions(),1,-view.rotation));
  by("aeNorth").addEventListener("click",northUp);
  by("aeRose").addEventListener("click",northUp);
  by("aeReset").addEventListener("click",()=>applyView(startView()));
  by("aeOriginal").addEventListener("click",()=>setStyle(false));
  by("aeTint").addEventListener("click",()=>setStyle(true));
  viewport.addEventListener("pointerdown",event=>{
    if(event.target.closest("button, a, input, select")||(event.pointerType==="mouse"&&event.button!==0))return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    frame=pointFrame(pointerView());
    if(viewport.setPointerCapture)viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("ae-dragging");
  });
  viewport.addEventListener("pointermove",handlePointerMove);
  const end=e=>{
    pointers.delete(e.pointerId);
    frame=pointFrame(pointerView());
    if(!pointers.size)viewport.classList.remove("ae-dragging");
  };
  viewport.addEventListener("pointerup",end);
  viewport.addEventListener("pointercancel",end);
  viewport.addEventListener("lostpointercapture",end);
  viewport.addEventListener("wheel",event=>{
    event.preventDefault();
    const rect=viewport.getBoundingClientRect();
    applyView(changeAround(view,{x:event.clientX-rect.left,y:event.clientY-rect.top},dimensions(),Math.exp(-event.deltaY*.0012)));
  },{passive:false});
  viewport.addEventListener("dblclick",event=>{
    if(event.target.closest("button"))return;
    const rect=viewport.getBoundingClientRect();
    applyView(changeAround(view,{x:event.clientX-rect.left,y:event.clientY-rect.top},dimensions(),1.5));
  });
  viewport.addEventListener("keydown",event=>{
    if(event.target!==viewport)return;
    const key=event.key,d=dimensions();
    if(key==="ArrowLeft")applyView(panBy(view,46,0,d));
    else if(key==="ArrowRight")applyView(panBy(view,-46,0,d));
    else if(key==="ArrowUp")applyView(panBy(view,0,46,d));
    else if(key==="ArrowDown")applyView(panBy(view,0,-46,d));
    else if(key==="+"||key==="=")applyView(changeAround(view,mapCenter(),d,1.2));
    else if(key==="-")applyView(changeAround(view,mapCenter(),d,1/1.2));
    else if(key==="[")applyView(changeAround(view,mapCenter(),d,1,-15));
    else if(key==="]")applyView(changeAround(view,mapCenter(),d,1,15));
    else if(key==="Home")applyView(changeAround(view,mapCenter(),d,1,-view.rotation));
    else if(key==="0")applyView(startView());
    else return;
    event.preventDefault();
  });
  window.addEventListener("resize",()=>{view=constrain(view,dimensions());scheduleDraw();});
}
function setStyle(useTint){
  tint=useTint;
  by("aeMapImage").style.filter=tint?"saturate(1.22) contrast(1.06) sepia(.07)":"none";
  by("aeOriginal").setAttribute("aria-pressed",String(!tint));
  by("aeTint").setAttribute("aria-pressed",String(tint));
}
async function load(){
  const response=await fetch("atlas-explorer-data.json",{cache:"no-store"});
  if(!response.ok)throw Error("Atlas data HTTP "+response.status);
  const data=await response.json();
  if(data.map?.native_size?.[0]!==MAP_SIZE || data.map?.native_size?.[1]!==MAP_SIZE ||
     data.zones?.length!==20||data.sectors?.length!==48||data.holovators?.length!==21)throw Error("Source map baseline failed");
  const zoneRows=data.zones.map(x=>({...x,kind:"zone"}));
  const sectors=data.sectors.map(x=>({...x,kind:"sector"}));
  const lifts=data.holovators.map(x=>({...x,kind:"holovator"}));
  if(data.scaffolds!==undefined&&!Array.isArray(data.scaffolds))
    throw Error("Scaffold source register must be an array");
  const scaffolds=(data.scaffolds||[]).map(x=>({...x,kind:"scaffold"}));
  records=[...zoneRows,...lifts,...data.ladders,...scaffolds,...data.landmarks.map(x=>({...x,kind:"landmark"})),...sectors];
  records=records.map(r=>({...r,name:r.name||r.title||"Unnamed location"}));
  recordMap=new Map(records.map(x=>[x.id,x]));
  if(recordMap.size!==records.length)throw Error("Duplicate Atlas record ID");
  const ids=new Set(records.map(x=>x.id));
  routes=data.routes.filter(x=>normaliseRoute(x,ids));
  if(routes.length!==data.routes.length)throw Error("Unverified or unanchored building route in source register");
  for(const route of routes)routePicker.append(element("option","",route.title));
  const options=[...routePicker.options];
  routes.forEach((route,i)=>{options[i+1].value=route.id;});
  createPins();
  const scaffoldPins=[...pinMap.values()].filter(pin=>pin.dataset.kind==="scaffold").length;
  const scaffoldLayer=layerToggleByKind.get("scaffold");
  if(scaffoldLayer){
    scaffoldLayer.disabled=scaffoldPins===0;
    scaffoldLayer.checked=scaffoldPins>0;
  }
  const scaffoldFilter=filters.find(button=>button.dataset.kind==="scaffold");
  if(scaffoldFilter)scaffoldFilter.disabled=scaffolds.length===0;
  by("aeScaffoldNote").textContent=scaffoldPins>0
    ? "("+scaffoldPins+" evidence-verified pins)"
    : "(no verified map pins yet)";
  drawList();
  stats.textContent="20 Wild Zones · 48 named sectors · 21 owner-surveyed Holovator leads · "+data.ladders.length+" photographed ladder · "+scaffoldPins+" verified scaffold pins · 6 documented approaches · "+data.counts.confirmed_exact_holovator_device_pins+" precise lift pins claimed";
  ready=true;draw();
}
setupNavigation();
filters.forEach(b=>b.addEventListener("click",()=>{activeKind=b.dataset.kind||"all";drawList();}));
layerToggles.forEach(input=>input.addEventListener("change",drawList));
search.addEventListener("input",drawList);
routePicker.addEventListener("change",()=>{
  if(routePicker.value)chooseRoute(routePicker.value);
  else{
    routeId=null;routeDetail.replaceChildren(paragraph("Choose a documented access route."));
    routeProgress.textContent="No route selected";
    currentStep.replaceChildren(paragraph("Select a route to inspect street-to-interior and rooftop transitions."));
    prevStep.disabled=true;nextStep.disabled=true;showRouteMap.disabled=true;
  }
});
prevStep.addEventListener("click",()=>{const route=routes.find(x=>x.id===routeId);if(route){stepIndex=Math.max(0,stepIndex-1);renderRoute();}});
nextStep.addEventListener("click",()=>{const route=routes.find(x=>x.id===routeId);if(route){stepIndex=Math.min(route.steps.length-1,stepIndex+1);renderRoute();}});
showRouteMap.addEventListener("click",()=>{
  const route=routes.find(x=>x.id===routeId);
  const item=recordMap.get(route?.point_id);
  if(item){selectRecord(item,true);viewport.scrollIntoView({behavior:"smooth",block:"center"});}
});
load().catch(error=>{
  stats.textContent="The independent Atlas records could not load.";
  selectedPanel.replaceChildren(element("h3","","Map data unavailable"),
    paragraph("The original sector and Wild Zone guide remains intact. "+String(error.message||error)));
});

