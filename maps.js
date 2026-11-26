/* Interactive Lumiose City map. Source markers are the saved main-page map positions.
   The shared area module reads local evidence; original progress remains read-only. */
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
  let areaUI=null,syncingArea=false,pendingLegacySelection=null;
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
  const zoneHash=/^#wild-zone-([1-9]|1[0-9]|20)$/;
  // History API avoids hashchange on internal clicks, preserving active filters
  // and the existing scroll-to-detail behaviour. Share uses location.href.
  function syncZoneHash(id){
    if(typeof window==="undefined"||!window.location||!window.history)return;
    if(!areaUI)pendingLegacySelection={zone:id};
    const {pathname,search,hash}=window.location;
    const query=new URLSearchParams(search);
    // An existing shared selection must follow original controls immediately,
    // even while its optional module is loading or unavailable. A legacy link
    // without shared parameters keeps its original fragment-only form.
    if(id===null){
      for(const key of ["area","species","habitat_q","habitat_district","encounter"])query.delete(key);
    }else if(query.has("area")||query.has("species")){
      query.set("area","wz-"+String(id).padStart(2,"0"));query.delete("species");
    }
    const nextHash=id===null?(zoneHash.test(hash)?"":hash):"#wild-zone-"+id;
    const nextSearch=query.size?"?"+query.toString():"";
    if(nextHash===hash&&nextSearch===search)return;
    window.history.pushState(window.history.state,"",pathname+nextSearch+nextHash);
  }
  function clearSelection(sync=true){
    selected=null;
    for(const button of pins)button.setAttribute("aria-pressed","false");
    for(const button of directory)button.setAttribute("aria-pressed","false");
    for(const card of detail)card.hidden=true;
    if(message)message.hidden=false;
    zoomTitle.textContent="Choose a Wild Zone to zoom";
    zoomSlider.disabled=true;
    zoom.dataset.selectedZone="";
    zoom.style.backgroundPosition="center";
    if(sync)syncZoneHash(null);
    if(areaUI&&!syncingArea)areaUI.clear({history:sync?'replace':false});
  }
  function selectZone(value,scroll=true,sync=true){
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
    if(sync)syncZoneHash(id);
    if(areaUI&&!syncingArea)areaUI.selectArea("wz-"+id.padStart(2,"0"),{history:sync?'replace':false,focus:false});
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
  clearSelection(false);
  updateList();
  // Direct links and browser history may reveal a filtered-out zone. Reset
  // filters only when necessary; never rewrite unrelated page anchors.
  if(typeof window!=="undefined"){
    const openHash=()=>{
      // Traversing history is newer than a click queued while loading.
      if(!areaUI)pendingLegacySelection=null;
      const match=zoneHash.exec(window.location.hash);
      if(!match){if(selected!==null)clearSelection(false);return;}
      const id=match[1];
      if(selected===id)return;
      if(pinById.get(id)?.hidden){
        district="All";search.value="";
        // Clear the old view without changing the incoming history entry.
        clearSelection(false);updateList();
      }
      selectZone(id,true,false);
    };
    window.addEventListener("popstate",openHash);
    window.addEventListener("hashchange",openHash);
    openHash();
  }
  if(typeof document.createElement==="function"){
    import("./atlas-area-surfaces.mjs").then(async({installAreaSurface})=>{
      areaUI=await installAreaSurface({surface:"standalone",onSelection:({selection})=>{
        // A click or clear during loading is newer than the initial shared
        // render. Replay that intent through the shared controller below.
        if(!areaUI&&pendingLegacySelection)return;
        syncingArea=true;
        try{
          const zone=/^wz-(\d{2})$/.exec(selection.areaId||"");
          if(zone){
            const id=String(Number(zone[1]));
            // Shared search can select a zone hidden by the original directory.
            // Reveal it as legacy deep links do; retain compatible filters.
            if(pinById.get(id)?.hidden){district="All";search.value="";updateList();}
            if(selected!==id)selectZone(id,false,false);
          }
          else if(selected!==null)clearSelection(false);
        }finally{syncingArea=false;}
      }});
      if(areaUI&&pendingLegacySelection){
        const {zone}=pendingLegacySelection;pendingLegacySelection=null;
        if(zone===null)areaUI.clear({history:"replace"});
        else areaUI.selectArea("wz-"+String(zone).padStart(2,"0"),{history:"replace",focus:false});
      }
    }).catch(()=>{/* Original map, photos and directory remain available. */});
  }
})();
