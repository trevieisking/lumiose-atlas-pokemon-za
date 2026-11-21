/* Interactive Lumiose City map. Source markers are the saved main-page map positions.
   This page never fetches, writes game state, or alters the original Site or Supabase. */
(() => {
  "use strict";
  const pins=Array.from(document.querySelectorAll("[data-map-pin]"));
  const directory=Array.from(document.querySelectorAll("[data-map-zone-button]"));
  const detail=Array.from(document.querySelectorAll("[data-map-zone-detail]"));
  const filters=Array.from(document.querySelectorAll("[data-district-filter]"));
  const search=document.getElementById("mapSearch");
  const count=document.getElementById("mapCount");
  const empty=document.getElementById("mapNoResults");
  const message=document.getElementById("mapStartMessage");
  const allButton=document.getElementById("mapShowAll");
  const zoom=document.getElementById("mapZoomImage");
  const zoomTitle=document.getElementById("mapZoomTitle");
  const zoomSlider=document.getElementById("mapZoomLevel");
  const zoomValue=document.getElementById("mapZoomValue");
  const focus=document.getElementById("zone-focus");
  if(pins.length!==20||directory.length!==20||detail.length!==20||
     !search||!count||!zoom||!zoomSlider||!zoomTitle||!zoomValue||!focus)return;
  const pinById=new Map(pins.map(p=>[p.dataset.mapPin,p]));
  const detailById=new Map(detail.map(d=>[d.dataset.mapZoneDetail,d]));
  let district="All";
  let selected=null;
  const closeTo=number=>Math.max(0,Math.min(100,number));
  function zoomOnZone(){
    if(!selected)return;
    const pin=pinById.get(selected);
    if(!pin)return;
    const scale=Number(zoomSlider.value);
    if(!Number.isFinite(scale)||scale<=1||scale>3.5)return;
    const x=Number(pin.dataset.pinX),y=Number(pin.dataset.pinY);
    if(!Number.isFinite(x)||!Number.isFinite(y))return;
    // For a square crop, align this map point near the zoom crop's centre.
    const position=point=>closeTo((point*scale-50)/(scale-1));
    zoom.style.backgroundSize=(scale*100)+"% "+(scale*100)+"%";
    zoom.style.backgroundPosition=position(x)+"% "+position(y)+"%";
    zoomValue.textContent=scale.toFixed(1)+"×";
    zoom.dataset.selectedZone=selected;
    zoom.setAttribute("aria-label","Magnified original city overview near Wild Zone "+selected+
      ". The view does not contain verified individual item or ladder coordinates.");
  }
  function clearSelection(){
    selected=null;
    for(const button of pins)button.setAttribute("aria-pressed","false");
    for(const button of directory)button.setAttribute("aria-pressed","false");
    for(const card of detail)card.hidden=true;
    if(message)message.hidden=false;
    zoomTitle.textContent="Choose a Wild Zone to zoom";
    zoomSlider.disabled=true;
    zoom.dataset.selectedZone="";
    zoom.style.backgroundPosition="center";
  }
  function selectZone(value,scroll=true){
    const id=String(value);
    if(!pinById.has(id)||!detailById.has(id))return;
    selected=id;
    for(const button of pins)button.setAttribute("aria-pressed",String(button.dataset.mapPin===id));
    for(const button of directory)button.setAttribute("aria-pressed",String(button.dataset.mapZoneButton===id));
    for(const card of detail)card.hidden=card.dataset.mapZoneDetail!==id;
    if(message)message.hidden=true;
    zoomTitle.textContent="Wild Zone "+id+" · magnified city overview";
    zoomSlider.disabled=false;
    zoomOnZone();
    if(scroll&&typeof focus.scrollIntoView==="function")focus.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function updateList(){
    const q=search.value.trim().toLocaleLowerCase();
    let visible=0;
    const choices=new Set();
    for(const button of directory){
      const matchesDistrict=district==="All"||button.dataset.district===district;
      const matchesText=!q||button.dataset.zoneSearch.includes(q);
      const visibleRow=matchesDistrict&&matchesText;
      button.hidden=!visibleRow;
      if(visibleRow){visible++;choices.add(button.dataset.mapZoneButton);}
    }
    for(const pin of pins)pin.hidden=!choices.has(pin.dataset.mapPin);
    for(const button of filters)button.setAttribute("aria-pressed",String(button.dataset.districtFilter===district));
    count.textContent=visible+" of 20 Wild Zones listed";
    if(empty)empty.hidden=visible!==0;
    if(selected&&!choices.has(selected))clearSelection();
  }
  for(const button of pins)button.addEventListener("click",()=>selectZone(button.dataset.mapPin));
  for(const button of directory)button.addEventListener("click",()=>selectZone(button.dataset.mapZoneButton));
  for(const button of filters)button.addEventListener("click",()=>{district=button.dataset.districtFilter;updateList()});
  search.addEventListener("input",updateList);
  allButton?.addEventListener("click",()=>{district="All";search.value="";updateList()});
  zoomSlider.addEventListener("input",zoomOnZone);
  // Script runs deferred: keep all source notes readable if JavaScript is disabled.
  clearSelection();
  updateList();
})();