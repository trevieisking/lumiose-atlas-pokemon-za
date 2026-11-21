/* HOME species catalogue, offline filter and MANUAL HOME-registration tracker.
 * No Nintendo login, Supabase calls, background requests or game-file writes.
 * Separate storage key is essential: app.js serialises only existing 5 progress
 * categories and could discard an unknown HOME category on another page.
 */
(() => {
  "use strict";
  const data=window.ATLAS_HOME_SOURCE;
  const rows=Array.from(document.querySelectorAll("[data-home-card]"));
  const ticks=Array.from(document.querySelectorAll("[data-home-register]"));
  const buttons=Array.from(document.querySelectorAll("[data-home-filter]"));
  const search=document.getElementById("homeSpeciesSearch");
  const statusChoice=document.getElementById("homeSpeciesStatus");
  const visible=document.getElementById("homeSpeciesVisible");
  const empty=document.getElementById("homeSpeciesEmpty");
  const count=document.getElementById("homeRegistryCount");
  const lumioseCount=document.getElementById("homeLumioseCount");
  const hyperCount=document.getElementById("homeHyperspaceCount");
  const fill=document.getElementById("homeRegistryFill");
  const bar=document.querySelector(".home-registration-bar");
  const notice=document.getElementById("homeSaveStatus");
  if(!data||data.records?.length!==364||rows.length!==364||ticks.length!==364||
     !search||!statusChoice||!visible||!count||!lumioseCount||!hyperCount||!fill||!bar||!notice)return;
  const validIds=new Set(data.records.map(r=>String(r.number)));
  if(validIds.size!==364||ticks.some(t=>!validIds.has(t.dataset.homeRegister)))return;
  const STORE_KEY="lumiose-atlas-gh-pages-home-register-v1";
  let active="All";
  function readRecord(){
    try{
      const raw=window.localStorage.getItem(STORE_KEY);
      const record=raw===null?{}:JSON.parse(raw);
      if(!record||typeof record!=="object"||Array.isArray(record))return null;
      return record;
    }catch(_){return null;}
  }
  function saveSingle(id,checked){
    if(!validIds.has(id))return false;
    const previous=readRecord();
    if(previous===null)return false; // Never overwrite existing corrupted state.
    try{
      const next={...previous,[id]:checked};
      window.localStorage.setItem(STORE_KEY,JSON.stringify(next));
      return true;
    }catch(_){return false;}
  }
  function presentRow(input){
    input.closest(".home-species-card")?.classList.toggle("is-registered",input.checked);
  }
  function tally(){
    let done=0,lumiose=0,hyperspace=0;
    for(const input of ticks){
      if(!input.checked)continue;
      done++;
      if(input.closest(".home-species-card")?.dataset.homeGroup==="Lumiose")lumiose++;
      else hyperspace++;
    }
    count.textContent=done+" of 364";
    lumioseCount.textContent=lumiose+"/232";
    hyperCount.textContent=hyperspace+"/132";
    fill.style.width=(done/364*100).toFixed(1)+"%";
    bar.setAttribute("aria-valuenow",String(done));
  }
  function reportSave(ok,justSaved=false){
    notice.className=ok?(justSaved?"saved":""):"error";
    notice.textContent=ok
      ? justSaved
        ? "✓ Your manual HOME-registration mark was saved on this device."
        : "Manual checkmarks are stored only in this browser, separately from your walkthrough and item progress. They do not connect to Nintendo HOME."
      : "⚠ The saved HOME checklist could not be read or written. Existing data was not overwritten; changes made here may be temporary.";
  }
  function draw(){
    const saved=readRecord();
    if(saved===null){reportSave(false);return;}
    for(const input of ticks){
      input.checked=!!saved[input.dataset.homeRegister];
      presentRow(input);
    }
    tally();
    reportSave(true);
  }
  function updateFilter(){
    const query=search.value.trim().toLocaleLowerCase();
    const choice=statusChoice.value;
    let shown=0;
    for(const card of rows){
      const key=card.querySelector?.("[data-home-register]");
      const isMarked=!!key?.checked;
      const allowed=active==="All"||card.dataset.homeGroup===active;
      const match=allowed&&(!query||card.dataset.homeSearch.includes(query))&&
        (choice==="all"||(choice==="registered"&&isMarked)||(choice==="missing"&&!isMarked));
      card.hidden=!match;
      if(match)shown++;
    }
    for(const b of buttons)b.setAttribute("aria-pressed",String(b.dataset.homeFilter===active));
    visible.textContent="Showing "+shown+" of 364 Pokémon";
    if(empty)empty.hidden=shown!==0;
  }
  search.addEventListener("input",updateFilter);
  statusChoice.addEventListener("change",updateFilter);
  for(const b of buttons)b.addEventListener("click",()=>{active=b.dataset.homeFilter;updateFilter();});
  for(const input of ticks)input.addEventListener("change",()=>{
    const ok=saveSingle(input.dataset.homeRegister,input.checked);
    if(ok){draw();reportSave(true,true);}
    else{presentRow(input);tally();reportSave(false);}
    updateFilter();
  });
  // A failed remote source never hides the species identity or checkmark.
  for(const img of document.querySelectorAll(".home-species-portrait img")){
    img.addEventListener("error",()=>{
      img.hidden=true;
      const fallback=img.parentElement?.querySelector(".home-portrait-fallback");
      if(fallback)fallback.hidden=false;
    });
  }
  draw();updateFilter();
  window.addEventListener?.("storage",event=>{
    if(event.key===STORE_KEY||event.key===null){draw();updateFilter();}
  });
  window.addEventListener?.("pageshow",()=>{draw();updateFilter();});
  window.addEventListener?.("focus",()=>{draw();updateFilter();});
})();