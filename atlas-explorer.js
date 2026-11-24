/* Lumiose Atlas Explorer — one read-only, source-aligned 2D city-map viewport.
   No user tracking, database, external SDK, or game-state write. Only an explicit video click saves a private navigation bookmark. */
import {
  MAP_SIZE, MIN_ZOOM, MAX_ZOOM, stageBase, startView, project,
  constrain, panBy, changeAround, centreOn, normaliseRoute, eligibleMapPin,
  coverageCellCentre, districtStart, routeVideoUrl
} from "./atlas-explorer-geometry.mjs";
import {saveVideoBookmark,readVideoBookmark,forgetVideoBookmark} from "./atlas-video-bookmark.mjs";
import {appendGuidePanel,zoneLinks,zoneVideos,sectorLinks,screwVideo,sideVideo} from "./atlas-guide-links.mjs";
const by = id => document.getElementById(id);
const viewport=by("aeViewport"),stage=by("aeStage"),layer=by("aeMapPins");
const resultList=by("aeResults"),selectedPanel=by("aeSelected"),search=by("aeSearch");
const routePicker=by("aeRouteSelect"),routeDetail=by("aeRouteDetail");
const routeProgress=by("aeRouteProgress"),currentStep=by("aeCurrentStep");
const prevStep=by("aePrevStep"),nextStep=by("aeNextStep"),showRouteMap=by("aeShowRouteMap");
const bookmarkNotice=by("aeVideoBookmarkNotice"),forgetBookmark=by("aeForgetVideoBookmark");
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
let records=[],routes=[],recordMap=new Map(),pinMap=new Map(),zoneRows=[];
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

/* Whole city area navigation: source-image coverage, not invented item or sector pins. */
const coverageGrid=by("aeCoverageGrid"),coverageStatus=by("aeCoverageStatus");
const coverageSector=by("aeCoverageSector"),coverageDistricts=by("aeCoverageDistricts");
const sectorContext=by("aeSectorContext"),sectorContextName=by("aeSectorContextName");
const sectorContextBearing=by("aeSectorContextBearing");
/* Selected names and street bearings are screen-space orientation aids, NOT map coordinates.
   Never promote a screenshot label or text observation to an XY, polygon or exact pin. */
function syncSectorContext(){
  const item=recordMap.get(coverageSector.value);
  const visible=layerVisible("sector-label")&&item?.kind==="sector"&&item.id===selectedId;
  sectorContext.hidden=!visible;
  sectorContextName.textContent=visible?item.name:"";
  const sourceNames=item?.source_map_reference?.visible_labels?.filter(name=>!/(?:Vert|Bleu|Magenta|Rouge|Jaune) Sector [0-9]+/.test(name))||[];
  sectorContextBearing.textContent=!visible?"":item.street_bearing?.confidence==="source_image_orientation_only"
    ? "Source-map street bearing (orientation only): "+item.street_bearing.text
    : item.source_map_reference
      ? (sourceNames.length?"Original source-map labels: "+sourceNames.join(", "):"Original-game sector photo available")+" · geographic anchor unverified"
      : "Street-level map position not yet source-verified";
}
function coverageMessage(message,activeArea="") {
  coverageStatus.textContent=message;
  for(const cell of coverageGrid.querySelectorAll("button"))
    cell.setAttribute("aria-pressed",String(cell.dataset.area===activeArea));
  syncSectorContext();
}
function focusDistrict(district,sectorId="",sectorName="") {
  const sourceCentre=districtStart(zoneRows,district);
  if(!sourceCentre) {
    coverageMessage("No preserved Wild Zone centre is available for "+district+". Use the full city map instead.");
    return;
  }
  applyView(centreOn(sourceCentre,{...view,zoom:2.4,rotation:0},dimensions()));
  coverageSector.value=sectorId;
  coverageMessage(sectorName
    ? sectorName+": showing a "+district+" district starting view, NOT a verified sector centre. Drag the map to find individual buildings."
    : district+" district: source-based approximate starting area. Drag and zoom to explore; sector borders are not pinned.");
}
function setupCoverage(sectors) {
  if(!coverageGrid||!coverageStatus||!coverageSector||!coverageDistricts)
    throw Error("Missing whole-city map coverage controls");
  coverageGrid.replaceChildren();
  for(let row=0;row<5;row++)for(let col=0;col<5;col++) {
    const area=String(row+1)+"-"+String(col+1);
    const cell=element("button","ae-coverage-cell");
    cell.type="button";cell.dataset.area=area;
    cell.setAttribute("aria-label","Open original city image area, row "+(row+1)+" of 5 north to south, column "+(col+1)+" of 5 west to east");
    cell.setAttribute("aria-pressed","false");
    cell.title="Zoom to city map area "+area;
    cell.addEventListener("click",()=>{
      const point=coverageCellCentre(row,col);
      applyView(centreOn(point,{...view,zoom:3.5,rotation:0},dimensions()));
      coverageSector.value="";
      coverageMessage("Opened city map area row "+(row+1)+", column "+(col+1)+" of 5. Drag, pinch or zoom to inspect its streets.",area);
      viewport.scrollIntoView({behavior:"smooth",block:"center"});
    });
    coverageGrid.append(cell);
  }
  coverageDistricts.replaceChildren();
  for(const district of ["Vert","Bleu","Magenta","Rouge","Jaune"]) {
    const button=element("button","",district);
    button.type="button";button.dataset.district=district;
    button.setAttribute("aria-label","Open "+district+" district map starting view");
    button.addEventListener("click",()=>{
      focusDistrict(district);
      viewport.scrollIntoView({behavior:"smooth",block:"center"});
    });
    coverageDistricts.append(button);
  }
  for(const sector of sectors) {
    const option=element("option","",sector.name);
    option.value=sector.id;
    coverageSector.append(option);
  }
  coverageSector.addEventListener("change",()=>{
    const item=recordMap.get(coverageSector.value);
    if(item?.kind!=="sector"){syncSectorContext();return;}
    activeKind="sector";drawList();selectRecord(item,true);
    viewport.scrollIntoView({behavior:"smooth",block:"center"});
  });
  by("aeCoverageFullCity").addEventListener("click",()=>{
    applyView(startView());
    coverageSector.value="";
    coverageMessage("Showing the complete Lumiose City map. All 25 area squares cover the entire image.");
    viewport.scrollIntoView({behavior:"smooth",block:"center"});
  });
}

function focusRecord(item){
  if(item?.kind==="sector"){
    focusDistrict(item.district,item.id,item.name);
    return;
  }
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
    appendGuidePanel(selectedPanel,"Wild Zone field guides",[...zoneLinks(item.number,"atlas-explorer.html").filter(x=>x.href!==item.link),...zoneVideos(item.number)],"Video links cover encounters and hunting; not measured pickup or entrance coordinates.");
  }else if(item.kind==="sector"){
    selectedPanel.append(paragraph("This sector name is verified in the directory. Its exact map boundary is not independently traced, so no arbitrary pin is drawn."));
    if(item.street_bearing?.confidence==="source_image_orientation_only"){
      selectedPanel.append(paragraph("Source-labelled street bearings (orientation only): "+item.street_bearing.text));
      selectedPanel.append(link("MAPS_BORDERLESS_SOURCE_REGISTER_2026-11-24.json","Read written street-bearing evidence"));
    }
    const photo=item.source_map_reference;
    if(photo?.precision==="source_image_orientation_only"&&photo?.geographically_registered===false){
      const figure=element("figure","ae-source-map-reference");
      const a=element("a");a.href=photo.image_path;a.target="_blank";a.rel="noopener noreferrer";
      a.setAttribute("aria-label","Open genuine original game-map crop for "+item.name);
      const img=element("img");img.src=photo.image_path;img.loading="lazy";img.decoding="async";
      img.width=photo.width;img.height=photo.height;
      img.alt="Original in-game map screenshot crop for "+item.name+": "+photo.visible_labels.join(", ")+". Reference only, not a registered map tile.";
      a.append(img);
      figure.append(a,element("figcaption","",photo.visible_labels.join(" · ")+" · original screenshot crop for orientation only. No registered map XY, sector border or exact lift/pickup pin."));
      selectedPanel.append(figure);
      selectedPanel.append(link("MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json","Review source image provenance"));
    }else if(item.pending_source_photo_evidence?.status==="verified_local_png_pending_binary_transfer"){
      selectedPanel.append(paragraph("A clean original game-map screenshot crop was verified from the owner source, but its PNG has not yet been uploaded to GitHub. No image is linked until its exact file hashes are checked."));
      selectedPanel.append(link(item.pending_source_photo_evidence?.source_name?.startsWith("10000283")?"MAPS_AT309_OWNER_SOURCE_48_SECTORS_2026-11-24.json":"MAPS_AT306_SOURCE_RECOVERY_2026-11-24.json","Inspect prepared source-crop provenance"));
    }else{
      selectedPanel.append(paragraph("Original in-game screenshot for this numbered sector still needs verification. No precise street position is asserted."));
    }
    selectedPanel.append(link(item.link,"Open this sector's original clues"));
    const sectorMatch=item.id.match(/^(vert|bleu|magenta|rouge|jaune)-sector-(\d+)$/);
    if(sectorMatch)appendGuidePanel(selectedPanel,"Sector field guides",[...sectorLinks(sectorMatch[1],Number(sectorMatch[2]),"atlas-explorer.html").filter(x=>x.href!==item.link),screwVideo(sectorMatch[1])],"Creator colour chapter only; Atlas Screw numbering and exact map geometry are not verified by this video.");
  }else if(item.kind==="holovator"){
    selectedPanel.append(paragraph("The physical lift is in the owner's field survey. The symbol on this 1920px overview is an approximate approach lead, not a measured door or roof landing."));
    if(item.photos?.length){
      if(item.photo_story)selectedPanel.append(paragraph(item.photo_story));
      selectedPanel.append(element("h4","",item.photos.length+" genuine owner photographs on GitHub"));
      const gallery=element("div","ae-photo-grid");
      for(const photo of item.photos.slice(0,8)){
        if(typeof photo.path!=="string"||!photo.path.startsWith("assets/atlas/holovators/")||!photo.path.endsWith(".jpg"))continue;
        const fig=element("figure"),a=link(photo.path,"",true);
        const label=plain(photo.caption)||plain(photo.role).replace(/[-_]/g," ");
        a.setAttribute("aria-label","Open original "+item.name+" photograph: "+label);
        const img=element("img");
        img.src=photo.path;img.alt="Original game photograph of "+item.name+": "+label;
        img.loading="lazy";img.decoding="async";
        a.append(img);
        fig.append(a,element("figcaption","",label));
        gallery.append(fig);
      }
      selectedPanel.append(gallery);
      if(item.photos.length>8)selectedPanel.append(paragraph("Additional original photographs are indexed in the Holovator fieldbook."));
    }else{
      selectedPanel.append(paragraph("Original survey images for this location are not yet hosted in GitHub. No broken or replacement artwork is shown."));
    }
    selectedPanel.append(link("maps.html","Open the original Wild Zone city map"));
    if(item.id==="bleu3-fav")appendGuidePanel(selectedPanel,"My Favorite Holovator · Side Mission 61",[ {href:"side-missions.html#quest-61",label:"Written mission solution"},sideVideo(61)],"The original owner photographs and approximate approach map remain the location evidence.");
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
  const related=routes.find(r=>r.point_id===item.id)||routes.find(r=>r.related_photo_ids?.includes(item.id));
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
  // Stable, shareable URL for this *existing* evidence-labelled record; no new map point.
  selectedPanel.append(link("atlas-explorer.html?place="+encodeURIComponent(item.id),
    "Direct link to this location"));
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
  syncSectorContext();
  const route=routes.find(r=>r.point_id===item.id);
  if(route)chooseRoute(route.id);
}
function match(item){
  const query=search.value.trim().toLocaleLowerCase();
  if(activeKind!=="all"&&item.kind!==activeKind)return false;
  if(!query)return true;
  return [item.name,item.area,item.district,item.description,item.directions,item.street_bearing?.text,...(item.source_map_reference?.visible_labels||[]),labels[item.kind]]
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
    const placement=item.kind==="sector"
      ? item.source_map_reference?" · original game-map photo · no exact pin":item.pending_source_photo_evidence?" · clean source crop pending GitHub upload · no exact pin":" · original photo pending · no exact pin"
      : pinMap.has(item.id)
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
  syncSectorContext();
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
/* Save only on intentional video activation. Native links still open if storage is unavailable. */
function rememberVideo(video,anchor,route,step){
  const bookmark={version:1,routeId:route.id,stepIndex,stepTitle:step.title,videoId:video.video_id,
    selectedId,filter:activeKind,search:search.value.slice(0,200),
    hiddenLayers:layerToggles.filter(input=>!input.checked).map(input=>input.dataset.layer),
    sector:coverageSector.value,coverageArea:coverageGrid.querySelector('[aria-pressed="true"]')?.dataset.area||"",
    coverageText:coverageStatus.textContent,tint,view:{...view},stageSize:stageBase(dimensions()),
    anchorTop:anchor.getBoundingClientRect().top};
  if(saveVideoBookmark(window,bookmark)){
    bookmarkNotice.textContent="Video place saved on this device. Return to this guide to continue.";
    forgetBookmark.hidden=false;
  }else{
    bookmarkNotice.textContent="The guide stays open in this tab; browser storage is unavailable.";
  }
}
function restoreVideoBookmark(bookmark){
  if(!bookmark)return false;
  const route=routes.find(r=>r.id===bookmark.routeId);
  const step=route?.steps[bookmark.stepIndex];
  if(!step||step.title!==bookmark.stepTitle||
     !step.video_refs?.some(v=>v.video_id===bookmark.videoId&&routeVideoUrl(v)))return false;
  const selected=recordMap.get(bookmark.selectedId);
  if(selected)selectRecord(selected,false);
  activeKind=filters.some(b=>b.dataset.kind===bookmark.filter)?bookmark.filter:"all";
  search.value=bookmark.search;
  for(const input of layerToggles)if(!input.disabled)input.checked=!bookmark.hiddenLayers.includes(input.dataset.layer);
  drawList();
  coverageSector.value=[...coverageSector.options].some(o=>o.value===bookmark.sector)?bookmark.sector:"";
  coverageMessage(bookmark.coverageText,bookmark.coverageArea);
  setStyle(bookmark.tint);
  const ratio=stageBase(dimensions())/bookmark.stageSize;
  applyView({...bookmark.view,panX:bookmark.view.panX*ratio,panY:bookmark.view.panY*ratio});
  routeId=route.id;stepIndex=bookmark.stepIndex;routePicker.value=routeId;renderRoute();
  bookmarkNotice.textContent="Resumed your saved video step. Your game progress is unchanged.";
  forgetBookmark.hidden=false;
  // Anchor-relative scrolling survives lazy images and different screen heights better than a raw page Y.
  const anchor=[...currentStep.querySelectorAll("[data-video-id]")].find(a=>a.dataset.videoId===bookmark.videoId);
  if(anchor){
    try{history.scrollRestoration="manual";}catch(_){}
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      const targetTop=Math.max(0,Math.min(window.innerHeight-60,bookmark.anchorTop));
      window.scrollTo({left:0,top:window.scrollY+anchor.getBoundingClientRect().top-targetTop,behavior:"instant"});
    }));
  }
  return true;
}
function renderRoute(){
  const route=routes.find(x=>x.id===routeId);
  if(!route)return;
  const item=recordMap.get(route.point_id);
  routeDetail.replaceChildren();
  routeDetail.append(element("strong","",route.title),paragraph(route.description));
  const districtOnly=route.anchor_precision==="district_only"&&item?.kind==="sector";
  if(districtOnly){
    routeDetail.append(paragraph("Evidence: independent guide cross-check. District starting view only; no exact lift pin or owner-photographed device match is claimed."));
    if(Number.isInteger(route.side_mission)&&route.side_mission>=1&&route.side_mission<=203)
      routeDetail.append(link("side-missions.html#quest-"+route.side_mission,"Open Side Mission "+route.side_mission+" in our guide"));
    if(route.source_record==="MAPS_HOLOVATOR_COORDINATE_VALIDATION.json")
      routeDetail.append(paragraph("Research provenance:"),
        link(route.source_record,"Read the Holovator evidence register"));
    if(route.source_record==="MAPS_ACCESS_ROUTE_SURVEY.json")
      routeDetail.append(paragraph("Research provenance:"),link(route.source_record,"Read the access survey register"));
    if(route.related_photo_ids?.length){
      routeDetail.append(paragraph("Existing owner photo references (orientation only, not certified roof connections):"));
      for(const id of route.related_photo_ids){
        const photoRecord=recordMap.get(id);
        const row=paragraph("");
        row.append(link("atlas-explorer.html?place="+encodeURIComponent(id),photoRecord.name+" — original photographs"));
        routeDetail.append(row);
      }
    }
  }else{
    routeDetail.append(paragraph("Evidence: recorded player approach. No complete interior floorplan, live GPS or automatic between-building walking route exists yet."));
  }
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
  const videoRefs=Array.isArray(step.video_refs)?step.video_refs: [];
  for(const video of videoRefs){
    const url=routeVideoUrl(video);
    if(!url)continue;
    const card=element("div","ae-route-video");
    const time=Math.floor(video.start_seconds/60)+":"+String(video.start_seconds%60).padStart(2,"0");
    const status=video.verification==="numbering_candidate"?"Candidate video match":"Publisher-listed video chapter";
    const anchor=link(url,"Watch "+video.title+" ("+time+") on YouTube",true);
    anchor.dataset.videoId=video.video_id;
    anchor.addEventListener("click",()=>rememberVideo(video,anchor,route,step));
    anchor.addEventListener("auxclick",event=>{if(event.button===1)rememberVideo(video,anchor,route,step);});
    card.append(element("strong","",status),paragraph("Creator: "+video.creator+" · Footage not frame-verified"),anchor,paragraph(video.note));
    currentStep.append(card);
  }
  prevStep.disabled=stepIndex===0;
  nextStep.disabled=stepIndex===route.steps.length-1;
  showRouteMap.disabled=!isPoint(item?.xy)&&!districtOnly;
  showRouteMap.textContent=districtOnly?"Show district starting map":"Show area on map";
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
  by("aeReset").addEventListener("click",()=>{
    applyView(startView());
    coverageSector.value="";
    coverageMessage("Full city map reset. Choose any area square, district or named sector.");
  });
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
  zoneRows=data.zones.map(x=>({...x,kind:"zone"}));
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
  // A written route may start from an existing named sector with no coordinates.
  // Never convert a sector, quest star or route step into a marker.
  for(const route of routes){
    const anchor=recordMap.get(route.point_id);
    if(route.anchor_precision==="district_only"){
      if(anchor?.kind!=="sector"||anchor.xy!==null||route.district!==anchor.district||
         route.roof_exit_xy!==null||route.known_floor_plan!==false||
         !route.steps.every(step=>step.evidence==="guide_crosscheck"||step.evidence==="unverified"))
        throw Error("Invalid district-only guide route");
    }else if(anchor?.kind==="sector")throw Error("A sector route must declare district-only precision");
    if(route.related_photo_ids!==undefined){
      if(route.anchor_precision!=="district_only"||!Array.isArray(route.related_photo_ids)||
         new Set(route.related_photo_ids).size!==route.related_photo_ids.length||
         !route.related_photo_ids.every(id=>{
           const ref=recordMap.get(id);
           return ref?.kind==="holovator"&&ref.district===route.district&&ref.photos?.length>0;
         }))throw Error("Invalid existing photo references on written route");
    }
  }
  for(const route of routes)routePicker.append(element("option","",route.title));
  const options=[...routePicker.options];
  routes.forEach((route,i)=>{options[i+1].value=route.id;});
  createPins();
  setupCoverage(sectors);
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
  const requested=new URLSearchParams(window.location.search);
  const requestedPlace=recordMap.get(requested.get("place"));
  const requestedSector=recordMap.get(requested.get("sector"));
  // Existing ?sector= links keep working; only registered place IDs can select records.
  const deepLinked=requestedPlace||(requestedSector?.kind==="sector"?requestedSector:null);
  const explicitDestination=requested.has("place")||requested.has("sector")||!!window.location.hash;
  const resumed=restoreVideoBookmark(readVideoBookmark(window,!explicitDestination));
  if(!resumed&&deepLinked){
    activeKind=deepLinked.kind;drawList();selectRecord(deepLinked,true);
  }
  if(!resumed&&readVideoBookmark(window,true)){forgetBookmark.hidden=false;}
  stats.textContent="20 Wild Zones · 48 named sectors · 21 owner-surveyed Holovator leads · "+data.ladders.length+" photographed ladder · "+scaffoldPins+" verified scaffold pins · "+routes.length+" documented approaches · "+data.counts.confirmed_exact_holovator_device_pins+" precise lift pins claimed";
  ready=true;draw();
}
setupNavigation();
forgetBookmark.addEventListener("click",()=>{
  forgetVideoBookmark(window);
  forgetBookmark.hidden=true;
  bookmarkNotice.textContent="Saved video place cleared. Your current route and game progress have not changed.";
});
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
    showRouteMap.textContent="Show area on map";
  }
});
prevStep.addEventListener("click",()=>{const route=routes.find(x=>x.id===routeId);if(route){stepIndex=Math.max(0,stepIndex-1);renderRoute();}});
nextStep.addEventListener("click",()=>{const route=routes.find(x=>x.id===routeId);if(route){stepIndex=Math.min(route.steps.length-1,stepIndex+1);renderRoute();}});
showRouteMap.addEventListener("click",()=>{
  const route=routes.find(x=>x.id===routeId);
  const item=recordMap.get(route?.point_id);
  if(item){
    const retainedStep=stepIndex;
    selectRecord(item,true);
    if(route.anchor_precision==="district_only"&&routeId===route.id){
      stepIndex=retainedStep;renderRoute();
    }
    viewport.scrollIntoView({behavior:"smooth",block:"center"});
  }
});
load().catch(error=>{
  stats.textContent="The independent Atlas records could not load.";
  selectedPanel.replaceChildren(element("h3","","Map data unavailable"),
    paragraph("The original sector and Wild Zone guide remains intact. "+String(error.message||error)));
});

