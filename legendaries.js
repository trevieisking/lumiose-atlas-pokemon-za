/* Legendary Fieldbook: offline route filter and the SAME device-local progress
 * owner as app.js (legendCheck), with no Supabase calls or unrelated state writes. */
(() => {
  "use strict";
  const data = window.ATLAS_LEGENDARY_SOURCE;
  const cards = Array.from(document.querySelectorAll("[data-legend-card]"));
  const toggles = Array.from(document.querySelectorAll("[data-atlas-legend]"));
  const filters = Array.from(document.querySelectorAll("[data-legend-filter]"));
  const search = document.getElementById("legendRouteSearch");
  const visibleCount = document.getElementById("legendVisibleCount");
  const noResults = document.getElementById("legendNoResults");
  const obtained = document.getElementById("legendObtainedCount");
  const filled = document.getElementById("legendObtainedFill");
  const progressbar = document.querySelector(".legend-progress-meter");
  const note = document.getElementById("legendSaveStatus");
  const groupCounts = {
    "Base story": document.getElementById("legendStoryCount"),
    "Gift mission": document.getElementById("legendGiftCount"),
    "Mega Dimension": document.getElementById("legendDlcCount"),
    "Special Scan": document.getElementById("legendScanCount")
  };
  if(!data||data.records?.length!==25||cards.length!==25||toggles.length!==25||
     !search||!visibleCount||!obtained||!filled||!progressbar||!note)return;
  const keys = new Set(data.records.map(r=>r.key));
  if(keys.size!==25||toggles.some(t=>!keys.has(t.dataset.atlasLegend)))return;
  let active = "All";
  function updateFilter(){
    const query=search.value.trim().toLocaleLowerCase();
    let count=0;
    for(const card of cards){
      const match=(active==="All"||card.dataset.category===active)&&
        (!query||card.dataset.routeSearch.includes(query));
      card.hidden=!match;
      if(match)count++;
    }
    for(const b of filters)b.setAttribute("aria-pressed",String(b.dataset.legendFilter===active));
    visibleCount.textContent="Showing "+count+" of 25 encounters";
    if(noResults)noResults.hidden=count!==0;
  }
  search.addEventListener("input",updateFilter);
  for(const b of filters)b.addEventListener("click",()=>{
    active=b.dataset.legendFilter;
    updateFilter();
  });
  updateFilter();

  // Same key and exact Pokémon names as the main reconstructed guide, but
  // original Workspace site is a DIFFERENT origin with independent storage.
  const PROGRESS_KEY="lumiose-atlas-reconstruction-v1";
  function readSaved(){
    try {
      const raw=window.localStorage.getItem(PROGRESS_KEY);
      const record=raw===null?{}:JSON.parse(raw);
      if(!record||typeof record!=="object"||Array.isArray(record))return null;
      const old=record.legendCheck;
      if(old!==undefined&&(!old||typeof old!=="object"||Array.isArray(old)))return null;
      return record;
    }catch(_){return null;}
  }
  function persist(name,checked){
    if(!keys.has(name))return false;
    const saved=readSaved();
    if(saved===null)return false; // Corrupt or blocked storage: never overwrite.
    const next={...saved,legendCheck:{...(saved.legendCheck||{}),[name]:checked}};
    try {
      window.localStorage.setItem(PROGRESS_KEY,JSON.stringify(next));
      return true;
    }catch(_){return false;}
  }
  function setNote(ok,savedNow=false){
    note.className="legend-saved-note"+(ok?(savedNow?" saved":""):" error");
    note.textContent=ok
      ? savedNow
        ? "✓ Saved on this device. The main guide now uses this same obtained checkmark."
        : "Collection progress is shared with the main GitHub guide in this browser/device, not across devices or with the original Workspace site."
      : "⚠ Existing collection progress could not be read or saved. Your original record was NOT overwritten; these changes may only be temporary.";
  }
  function drawProgress(){
    const total=toggles.filter(t=>t.checked).length;
    obtained.textContent=total+" of 25 obtained";
    filled.style.width=(total/25*100).toFixed(1)+"%";
    progressbar.setAttribute("aria-valuenow",String(total));
    for(const [category,target] of Object.entries(groupCounts)){
      if(!target)continue;
      const group=data.records.filter(r=>r.category===category);
      const gained=group.filter(r=>toggles.some(t=>t.dataset.atlasLegend===r.key&&t.checked)).length;
      target.textContent=gained+"/"+group.length;
    }
  }
  function styleToggle(toggle){
    toggle.closest(".legend-route-card")?.classList.toggle("is-obtained",toggle.checked);
  }
  function hydrate(){
    const saved=readSaved();
    if(saved===null){setNote(false);return;}
    for(const toggle of toggles){
      toggle.checked=!!saved.legendCheck?.[toggle.dataset.atlasLegend];
      styleToggle(toggle);
    }
    drawProgress();
    setNote(true);
  }
  for(const toggle of toggles){
    toggle.addEventListener("change",()=>{
      const ok=persist(toggle.dataset.atlasLegend,toggle.checked);
      if(ok){hydrate();setNote(true,true);}
      else{styleToggle(toggle);drawProgress();setNote(false);}
    });
  }
  hydrate();
  window.addEventListener?.("storage",event=>{
    if(event.key===PROGRESS_KEY||event.key===null)hydrate();
  });
  window.addEventListener?.("pageshow",hydrate);
  window.addEventListener?.("focus",hydrate);
})();