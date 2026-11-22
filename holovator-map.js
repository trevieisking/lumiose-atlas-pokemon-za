/* Lumiose Atlas — photographed fixed Holovators; read-only viewer, no persistence or backend operations. */
(() => {
"use strict";
const SOURCE="MAPS_OWNER_HOLOVATOR_21_SURVEY_CATALOG_2026-11-22.json";
const scroll=document.getElementById("holMapScroll"),stage=document.getElementById("holMapStage");
const layer=document.getElementById("holPinLayer"),list=document.getElementById("holList");
const details=document.getElementById("holDetails"),search=document.getElementById("holSearch");
const filters=Array.from(document.querySelectorAll("[data-filter]"));
const count=document.getElementById("holCount"),stats=document.getElementById("holStats");
const zoomLabel=document.getElementById("holZoomLabel"),noResults=document.getElementById("holNoResults");
if(!scroll||!stage||!layer||!list||!details||!search||!count||!zoomLabel)return;
let data=[],selected=null,district="All",scale=1;
const pinMap=new Map(),itemMap=new Map();
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=String(text);return node;};
const safe=(v)=>typeof v==="string"?v:"";
function updateZoom(centerSelected=false){
  const base=Math.max(620,Math.min(880,scroll.clientWidth-4));
  const width=Math.round(base*scale);
  stage.style.width=width+"px";
  stage.style.height=width+"px";
  zoomLabel.textContent=scale.toFixed(1)+"×";
  if(centerSelected&&selected){
    const found=data.find(x=>x.id===selected),xy=found?.map?.native_xy_approx;
    if(Array.isArray(xy)){
      scroll.scrollLeft=Math.max(0,Math.round(xy[0]/1920*width-scroll.clientWidth/2));
      scroll.scrollTop=Math.max(0,Math.round(xy[1]/1920*width-scroll.clientHeight/2));
    }
  }
}
function resetView(){scale=1;updateZoom(false);scroll.scrollLeft=0;scroll.scrollTop=0;}
function imageCard(photo,title){
  const fig=el("figure");
  const link=el("a");link.href=photo.path;link.target="_blank";link.rel="noopener noreferrer";
  link.setAttribute("aria-label","Open original "+title+" photograph: "+photo.role.replace(/[-_]/g," "));
  const image=el("img");image.src=photo.path;image.alt="Original player photo: "+title+" — "+photo.role.replace(/[-_]/g," ");
  image.loading="lazy";image.decoding="async";link.appendChild(image);
  const caption=el("figcaption","",photo.role.replace(/[-_]/g," "));
  fig.append(link,caption);
  return fig;
}
function showDetails(row){
  details.replaceChildren();
  const tag=el("span","hol-tag",row.district+" district");
  const status=el("span","hol-tag","Owner photographed");
  const accuracy=el("span","hol-tag","Approximate map position");
  details.append(tag,status,accuracy,el("h3","",row.title));
  const sector=el("p");sector.append(el("strong","","Area: "),document.createTextNode(safe(row.area)));details.appendChild(sector);
  const route=el("p");route.append(el("strong","","How to reach it: "),document.createTextNode(safe(row.directions)));details.appendChild(route);
  if(row.id==="jaune12-wz6")details.appendChild(el("p","hol-not-ready","⚠ Wild Zone 6 contains aggressive wild Pokémon. Use the marked location as an approach guide, not a promise of safe passage."));
  details.appendChild(el("p","hol-not-ready","Map accuracy: researched neighbourhood placement only. Consult the supplied in-game map and actual lift facade before entering a building. Rooftop coordinates are not pinned."));
  if(Array.isArray(row.photos)&&row.photos.length){
    details.appendChild(el("h3","","Original gameplay photographs"));
    const gallery=el("div","hol-photo-grid");row.photos.forEach(p=>gallery.appendChild(imageCard(p,row.title)));details.appendChild(gallery);
    if(row.id==="rouge5-looker")details.appendChild(el("p","","Later return-visit photographs are alternates of the same device, not a second lift."));
  }else{
    const label=row.photo_status==="final_11_in_zip_not_yet_uploaded"?
      "This entrance and roof were photographed in the final owner survey. Its JPGs have been prepared and quality-checked, but are not yet hosted in GitHub. Photos are available in the final 11-image ZIP archive.":
      "Original fieldwork photographs are recorded in the owner survey document but their image binaries are not yet hosted in GitHub.";
    details.appendChild(el("p","hol-not-ready",label));
  }
  if(row.source_record){
    const p=el("p");const a=el("a","","Review source evidence record");a.href=row.source_record;a.style.color="#58358a";p.appendChild(a);details.appendChild(p);
  }
}
function select(id,focusMap=false){
  const row=data.find(r=>r.id===id);if(!row)return;
  selected=id;
  for(const [key,button] of pinMap)button.setAttribute("aria-pressed",String(key===id));
  for(const [key,button] of itemMap)button.setAttribute("aria-pressed",String(key===id));
  showDetails(row);
  if(focusMap)updateZoom(true);
  const pick=itemMap.get(id);
  if(!focusMap&&pick&&typeof pick.scrollIntoView==="function")pick.scrollIntoView({block:"nearest"});
}
function matches(row){
  const q=search.value.trim().toLocaleLowerCase();
  return (district==="All"||row.district===district)&&(!q||
    [row.title,row.area,row.district,row.directions].some(x=>safe(x).toLocaleLowerCase().includes(q)));
}
function renderFilters(){
  let n=0;
  for(const row of data){
    const show=matches(row);
    const pin=pinMap.get(row.id),item=itemMap.get(row.id);
    if(pin)pin.hidden=!show;
    if(item)item.hidden=!show;
    if(show)n++;
  }
  for(const f of filters)f.setAttribute("aria-pressed",String(f.dataset.filter===district));
  count.textContent=n+" of "+data.length+" photographed survey entries shown";
  noResults.hidden=n!==0;
}
function render(){
  list.replaceChildren();layer.replaceChildren();
  pinMap.clear();itemMap.clear();
  for(const row of data){
    const item=el("button","hol-list-item");item.type="button";item.setAttribute("aria-pressed","false");
    item.append(el("strong","",row.title),el("small","",row.area+" · "+row.district));
    item.addEventListener("click",()=>select(row.id,true));list.appendChild(item);itemMap.set(row.id,item);
    const xy=row?.map?.native_xy_approx;
    if(!Array.isArray(xy)||xy.length!==2||!xy.every(v=>typeof v==="number"&&v>=0&&v<=1920))continue;
    const pin=el("button","hol-pin","⤊");
    pin.type="button";pin.style.left=(xy[0]/19.2).toFixed(4)+"%";pin.style.top=(xy[1]/19.2).toFixed(4)+"%";
    pin.title=row.title+" — map location approximate";
    pin.setAttribute("aria-label","Show "+row.title+" — approximate map position");
    pin.setAttribute("aria-pressed","false");
    pin.addEventListener("click",()=>select(row.id,false));layer.appendChild(pin);pinMap.set(row.id,pin);
  }
  stats.textContent=data.length+" owner survey entries · "+data.filter(r=>r.photo_status==="committed_main").length+" with original JPG galleries · all map dots approximate";
  updateZoom(false);renderFilters();
}
document.getElementById("holZoomIn")?.addEventListener("click",()=>{scale=Math.min(3.5,Math.round((scale+.25)*100)/100);updateZoom(true)});
document.getElementById("holZoomOut")?.addEventListener("click",()=>{scale=Math.max(1,Math.round((scale-.25)*100)/100);updateZoom(true)});
document.getElementById("holReset")?.addEventListener("click",resetView);
filters.forEach(f=>f.addEventListener("click",()=>{district=f.dataset.filter||"All";renderFilters()}));
search.addEventListener("input",renderFilters);
window.addEventListener("resize",()=>updateZoom(true));
fetch(SOURCE,{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(doc=>{
  if(!Array.isArray(doc.locations)||doc.locations.length<1)throw Error("Survey catalog contains no records");
  data=doc.locations.filter(r=>r&&typeof r.id==="string"&&typeof r.title==="string");
  if(new Set(data.map(x=>x.id)).size!==data.length)throw Error("Duplicate survey IDs");
  render();
}).catch(error=>{
  stats.textContent="The photograph map catalog could not be loaded.";
  const p=el("p","hol-not-ready","Unable to load the map data ("+String(error.message||error)+"). The existing Wild Zone and sector maps are not affected.");
  details.replaceChildren(p);
});
})();