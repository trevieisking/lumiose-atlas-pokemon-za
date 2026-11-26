/* Read-only collectible layers. Original checklists remain the sole write path. */
import "./items-data.js";
import {buildCollectibleCatalog,buildCollectibleIndex,overlappingPoints,readCollected,collectibleLabel,createCollectibleMatcher} from "./atlas-collectibles.mjs";

const PROGRESS_KEY="lumiose-atlas-reconstruction-v1";
const make=(tag,cls,text)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(text!==undefined)el.textContent=String(text);
  return el;
};
function sourceLink(href,label){
  const a=make("a","",label);a.href=href;
  if(href.startsWith("https://")){a.target="_blank";a.rel="noopener noreferrer";}
  return a;
}

export async function installCollectibles({projectPoint,currentView,focusPoint}){
  const by=id=>document.getElementById(id);
  const viewport=by("aeViewport"),pins=by("aeCollectiblePins"),directory=by("aeCollectibleDirectory");
  const search=by("aeCollectibleSearch"),kind=by("aeCollectibleKind"),results=by("aeCollectibleResults");
  const detail=by("aeCollectibleDetail"),status=by("aeCollectibleStatus"),count=by("aeCollectibleCount");
  const chooser=by("aeCollectibleChooser"),choices=by("aeCollectibleChooserOptions"),close=by("aeCollectibleClose");
  const clear=by("aeCollectibleClear"),empty=by("aeCollectibleEmpty");
  const toggles=new Map(["item","screw"].map(k=>[k,document.querySelector('[data-layer="'+k+'"]')]));
  if([viewport,pins,directory,search,kind,results,detail,status,count,chooser,choices,close,clear,empty,...toggles.values()].some(x=>!x))
    throw Error("Missing collection controls");
  const catalog=buildCollectibleCatalog(window.ATLAS_ITEM_EVIDENCE);
  if(catalog.length!==364)throw Error("Original collection directory is incomplete");
  let register=null,loadFailed=false;
  try{
    const response=await fetch("atlas-collectibles-data.json",{cache:"no-store"});
    if(!response.ok)throw Error("Collection evidence unavailable");
    register=await response.json();
  }catch(_){loadFailed=true;}
  const records=buildCollectibleIndex(catalog,register),byId=new Map(records.map(r=>[r.id,r]));
  const pinById=new Map(),resultById=new Map();
  let selected=null,saved=null,matches=records;

  function readProgress(){
    try{const raw=window.localStorage.getItem(PROGRESS_KEY);return raw===null?{}:JSON.parse(raw);}
    catch(_){return null;}
  }
  const progressText=r=>{
    const value=readCollected(r,saved);
    return value===null?"Progress unavailable":value?"Collected":"Not collected";
  };
  const visibleRecords=()=>matches.filter(r=>r.eligible&&toggles.get(r.kind).checked);
  function closeChooser(returnFocus=false){
    chooser.hidden=true;choices.replaceChildren();
    if(returnFocus)viewport.focus({preventScroll:true});
  }
  function renderDetail(){
    detail.replaceChildren();
    clear.hidden=selected===null;
    if(!selected){detail.append(make("h3","","Select an item or Screw"),make("p","","Open its original clue and checklist without changing saved progress."));return;}
    const r=selected;
    detail.append(make("h3","",collectibleLabel(r)),make("p","ae-collectible-identity","Original checklist ID: "+r.originalId));
    const collected=make("p","ae-collectible-progress",progressText(r));collected.dataset.collectibleProgress="";detail.append(collected);
    const area=[r.district,r.sector,r.zone?"Wild Zone "+r.zone:null].filter(Boolean).join(" · ");
    if(area)detail.append(make("p","",area));
    detail.append(make("p","","Original location clue: "+(r.hint||"See the original checklist.")));
    if(r.eligible){
      detail.append(make("p","ae-collectible-evidence","Verified fixed location · "+r.scene+" · "+r.floor));
      detail.append(make("p","","Access: "+r.unlock));
      const steps=make("ol");for(const step of r.directions)steps.append(make("li","",step));detail.append(steps);
      const evidence=make("ul","ae-collectible-evidence-links");
      for(const source of r.sources){
        const li=make("li","",source.evidence+" ("+source.observedOn+") ");
        // The eligibility engine validates these links and excludes active media.
        li.append(sourceLink(source.reference,"Location evidence"));
        evidence.append(li);
      }
      detail.append(evidence);
      for(const [index,photo] of (r.photos||[]).entries()){
        // Only registered hosted still images; no remote embeds or media players.
        if(typeof photo!=="string"||!/^assets\/atlas\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp)$/.test(photo)||photo.split("/").includes(".."))continue;
        detail.append(sourceLink(photo,"Open location photograph "+(index+1)));
      }
      const show=make("button","","Show on map");show.id="aeCollectibleShowMap";show.type="button";
      show.addEventListener("click",()=>{
        // An explicit map action must not centre a point hidden by older filters.
        if(kind.value!=="all"&&kind.value!==r.kind)kind.value="all";
        if(!createCollectibleMatcher(search.value,kind.value)(r))search.value="";
        toggles.get(r.kind).checked=true;filterDirectory();focusPoint(r.xy);
        viewport.scrollIntoView({behavior:"smooth",block:"center"});
      });detail.append(show);
    }else{
      const reason=r.sourceKind==="reward"?"This is a reward record, not a fixed pickup map location."
        :r.sourceKind==="hidden_outcome"?"This is a possible hidden-item outcome, not a fixed pickup map location."
        :"No verified map point yet. This original clue remains available in the checklist.";
      detail.append(make("p","ae-collectible-evidence",reason));
    }
    detail.append(sourceLink(r.link,"Open original checklist"));
    const url=new URL(window.location.href);url.searchParams.set("collectible",r.id);
    // Other existing place/sector parameters remain on the same page link.
    const direct=make("a","","Direct link to this record");direct.href=url.pathname+url.search+url.hash;detail.append(direct);
  }
  function refreshProgress(){
    saved=readProgress();
    for(const r of records){const text=resultById.get(r.id)?.querySelector("[data-collectible-progress]");if(text)text.textContent=progressText(r);}
    renderDetail();
  }
  function selectRecord(r,{reveal=true,focusDetail=false}={}){
    if(!r)return;
    selected=r;directory.open=true;closeChooser();renderDetail();
    for(const [id,button] of pinById)button.setAttribute("aria-pressed",String(id===r.id));
    for(const [id,button] of resultById)button.setAttribute("aria-pressed",String(id===r.id));
    if(reveal)detail.scrollIntoView({behavior:"smooth",block:"nearest"});
    if(focusDetail)detail.focus({preventScroll:true});
  }
  function chooseNearby(candidates){
    if(!candidates.length)return;
    if(candidates.length===1){selectRecord(candidates[0],{focusDetail:true});return;}
    choices.replaceChildren();by("aeCollectibleChooserTitle").textContent=candidates.length+" nearby items and Screws";
    for(const r of candidates){
      const button=make("button","",collectibleLabel(r)+" · "+r.scene+" · "+r.floor);button.type="button";button.dataset.collectibleId=r.id;
      button.addEventListener("click",()=>selectRecord(r,{focusDetail:true}));choices.append(button);
    }
    chooser.hidden=false;choices.querySelector("button")?.focus();
  }
  function updateVisibility(){
    const visible=new Set(visibleRecords().map(r=>r.id));
    for(const [id,pin] of pinById){pin.hidden=!visible.has(id);pin.tabIndex=pin.hidden?-1:0;}
    closeChooser();
    const verified=records.filter(r=>r.eligible).length;
    if(loadFailed)status.textContent="Mapped locations could not load. The 264 item records and 100 Screw clues are still available below.";
    else if(!verified)status.textContent="No verified map points yet. Browse 264 item records and 100 Screw clues below.";
    else status.textContent=visible.size+" of "+verified+" verified map points shown. The original item and Screw directory stays available.";
  }
  function filterDirectory(){
    matches=records.filter(createCollectibleMatcher(search.value,kind.value));const ids=new Set(matches.map(r=>r.id));
    for(const [id,button] of resultById)button.hidden=!ids.has(id);
    count.textContent=matches.length+" of "+records.length+" original item records and Screw clues";
    empty.hidden=matches.length!==0;updateVisibility();
  }
  saved=readProgress();
  for(const r of records){
    const button=make("button");button.type="button";button.dataset.collectibleId=r.id;button.setAttribute("aria-pressed","false");
    button.append(make("strong","",collectibleLabel(r)),make("span","",[r.sector,r.zone?"Wild Zone "+r.zone:r.district].filter(Boolean).join(" · ")));
    const progress=make("small","",progressText(r));progress.dataset.collectibleProgress="";button.append(progress);
    button.addEventListener("click",()=>selectRecord(r));results.append(button);resultById.set(r.id,button);
    if(!r.eligible)continue;
    const pin=make("button","ae-collectible-pin");pin.type="button";pin.dataset.collectibleId=r.id;pin.dataset.collectibleKind=r.kind;
    pin.style.left=(r.xy[0]/1920*100)+"%";pin.style.top=(r.xy[1]/1920*100)+"%";
    pin.setAttribute("aria-label",collectibleLabel(r)+"; "+r.scene+"; "+r.floor);pin.setAttribute("aria-pressed","false");
    const dot=make("span","ae-collectible-dot");dot.dataset.collectibleKind=r.kind;dot.setAttribute("aria-hidden","true");pin.append(dot);
    // Pointer hit testing belongs to the viewport, so dense targets never block pan/pinch.
    // Keyboard activation still reaches this real button and the complete overlap chooser.
    pin.addEventListener("click",event=>{event.stopPropagation();chooseNearby(overlappingPoints(visibleRecords(),projectPoint(r.xy),projectPoint,24));});
    pins.append(pin);pinById.set(r.id,pin);
  }
  const activePointers=new Map();let moved=false,lastTap=false;
  viewport.addEventListener("pointerdown",event=>{
    if(activePointers.size===0){moved=false;lastTap=false;}
    activePointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(activePointers.size>1)moved=true;
  },{capture:true});
  viewport.addEventListener("pointermove",event=>{
    const start=activePointers.get(event.pointerId);
    if(start&&Math.hypot(start.x-event.clientX,start.y-event.clientY)>6)moved=true;
  },{capture:true});
  viewport.addEventListener("pointerup",event=>{
    activePointers.delete(event.pointerId);if(!activePointers.size)lastTap=!moved;
  },{capture:true});
  viewport.addEventListener("pointercancel",event=>{activePointers.delete(event.pointerId);moved=true;lastTap=false;},{capture:true});
  viewport.addEventListener("lostpointercapture",event=>{activePointers.delete(event.pointerId);},{capture:true});
  viewport.addEventListener("click",event=>{
    if(!lastTap||event.target.closest("button,a,input,select"))return;
    lastTap=false;
    const box=viewport.getBoundingClientRect(),point={x:event.clientX-box.left,y:event.clientY-box.top};
    chooseNearby(overlappingPoints(visibleRecords(),point,projectPoint,24));
  });
  for(const toggle of toggles.values())toggle.addEventListener("change",updateVisibility);
  search.addEventListener("input",filterDirectory);kind.addEventListener("change",filterDirectory);
  close.addEventListener("click",()=>closeChooser(true));
  chooser.addEventListener("keydown",event=>{if(event.key==="Escape"){event.preventDefault();closeChooser(true);}});
  clear.addEventListener("click",()=>{
    selected=null;renderDetail();closeChooser();
    for(const button of [...pinById.values(),...resultById.values()])button.setAttribute("aria-pressed","false");
    search.focus({preventScroll:true});
  });
  window.addEventListener("storage",event=>{if(event.key===PROGRESS_KEY||event.key===null)refreshProgress();});
  window.addEventListener("focus",refreshProgress);window.addEventListener("pageshow",refreshProgress);
  filterDirectory();
  const requested=byId.get(new URLSearchParams(window.location.search).get("collectible"));
  if(requested)selectRecord(requested,{reveal:false});
  const draw=()=>{
    const v=currentView();pins.style.setProperty("--inverse-zoom",String(1/v.zoom));pins.style.setProperty("--counter-rotation",(-v.rotation)+"deg");
  };
  draw();return {draw};
}
