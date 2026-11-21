/* Source-backed map directory: 48 sector names, 20 original Wild Zone centres,
   264 numbered owner item records and 100 Screw clues.
   This script NEVER edits progress or assigns unverified item map coordinates. */
(() => {
  "use strict";
  const KEY="lumiose-atlas-reconstruction-v1";
  const sectors=Array.from(document.querySelectorAll("[data-sector-card]"));
  const zones=Array.from(document.querySelectorAll("[data-zone-card]"));
  const groups=Array.from(document.querySelectorAll("[data-district-group]"));
  const loose=Array.from(document.querySelectorAll("[data-loose-group]"));
  const markers=Array.from(document.querySelectorAll("[data-zone-marker]"));
  const buttons=Array.from(document.querySelectorAll("[data-atlas-district]"));
  const search=document.getElementById("mapAtlasSearch");
  const status=document.getElementById("mapAtlasCount");
  const empty=document.getElementById("mapAtlasEmpty");
  const indexedRows=Array.from(document.querySelectorAll("[data-progress-item],[data-progress-screw]"));
  let district="All";

  function repaint() {
    const q=(search?.value||"").trim().toLocaleLowerCase();
    const wanted=node=>district==="All"||node.dataset.district===district;
    const textMatches=node=>!q||(node.dataset.search||node.textContent).toLocaleLowerCase().includes(q);
    let visibleSectors=0,visibleZones=0,visibleLoose=0;
    for(const card of sectors) {
      card.hidden=!(wanted(card)&&textMatches(card));
      if(!card.hidden)visibleSectors++;
    }
    for(const card of zones) {
      card.hidden=!(wanted(card)&&textMatches(card));
      if(!card.hidden)visibleZones++;
    }
    for(const group of groups) {
      group.hidden=!Array.from(group.querySelectorAll("[data-sector-card]")).some(card=>!card.hidden);
    }
    for(const group of loose) {
      const allowed=district==="All"||group.dataset.looseGroup===district;
      let visibleInGroup=0;
      for(const row of group.querySelectorAll(".unassigned-screw-lead")) {
        row.hidden=!allowed||!!q&&!row.textContent.toLocaleLowerCase().includes(q);
        if(!row.hidden){visibleLoose++;visibleInGroup++;}
      }
      group.hidden=visibleInGroup===0;
    }
    for(const dot of markers) {
      const card=document.getElementById("wildzone-"+dot.dataset.zoneMarker);
      dot.hidden=!card||card.hidden;
    }
    for(const b of buttons)b.setAttribute("aria-pressed",String(b.dataset.atlasDistrict===district));
    if(status)status.textContent=visibleSectors+" of 48 sectors · "+visibleZones+" of 20 Wild Zones · "+visibleLoose+" of 49 district-only Screw leads";
    if(empty)empty.hidden=visibleSectors+visibleZones+visibleLoose!==0;
  }

  function getSaved() {
    try{
      const raw=localStorage.getItem(KEY);
      if(raw===null)return {pickup:{},screw:{}};
      const data=JSON.parse(raw);
      if(!data||typeof data!=="object"||Array.isArray(data))return null;
      const valid=value=>value===undefined||(value!==null&&typeof value==="object"&&!Array.isArray(value));
      if(!valid(data.pickup)||!valid(data.screw))return null;
      return {pickup:data.pickup||{},screw:data.screw||{}};
    }catch(_){return null;}
  }
  function refreshChecks(){
    const data=getSaved();
    for(const row of indexedRows){
      const item=row.dataset.progressItem;
      const screw=row.dataset.progressScrew;
      const yes=data!==null&&(item!==undefined?data.pickup[item]===true:data.screw[screw]===true);
      row.classList.toggle("is-collected",yes);
      const label=row.querySelector("[data-read-state]");
      if(label)label.textContent=data===null?"Open Item Atlas to check":yes?"✓ Marked in Item Atlas":"Not yet marked";
    }
  }
  function openDirectHash(){
    const hash=decodeURIComponent(location.hash.slice(1));
    if(!/^(wildzone-\d{1,2}|sector-(vert|bleu|magenta|rouge|jaune)-sector-\d{1,2})$/.test(hash))return;
    const card=document.getElementById(hash);
    if(!card)return;
    district="All";
    if(search)search.value="";
    repaint();
    const details=card.querySelector("details");
    if(details)details.open=true;
    if(typeof requestAnimationFrame==="function")requestAnimationFrame(()=>card.scrollIntoView({block:"start"}));
  }

  for(const button of buttons)button.addEventListener("click",()=>{
    district=button.dataset.atlasDistrict;
    repaint();
  });
  search?.addEventListener("input",repaint);
  window.addEventListener("hashchange",openDirectHash);
  window.addEventListener("focus",refreshChecks);
  window.addEventListener("pageshow",refreshChecks);
  window.addEventListener("storage",event=>{if(event.key===KEY)refreshChecks();});
  repaint();
  refreshChecks();
  openDirectHash();
})();
