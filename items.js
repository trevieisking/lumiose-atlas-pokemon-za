/* Item Atlas source index and shared original local progress. No network or Supabase calls. */
(() => {
  "use strict";
  const records=Array.from(document.querySelectorAll("[data-item-record]"));
  const zones=Array.from(document.querySelectorAll("[data-item-zone-card]"));
  const query=document.getElementById("itemLedgerSearch");
  const zoneChoice=document.getElementById("itemLedgerZone");
  const kindChoice=document.getElementById("itemLedgerKind");
  const itemStatus=document.getElementById("itemLedgerStatus");
  const itemEmpty=document.getElementById("itemLedgerEmpty");
  const screwRows=Array.from(document.querySelectorAll("[data-screw-record]"));
  const screwSearch=document.getElementById("screwSearch");
  const districtButtons=Array.from(document.querySelectorAll("[data-screw-district]"));
  const screwStatus=document.getElementById("screwStatus");
  const screwEmpty=document.getElementById("screwEmpty");
  const data=window.ATLAS_ITEM_EVIDENCE;
  if(!data||data.metrics.zoneItemRecords!==264||records.length!==264||zones.length!==20||screwRows.length!==100||
    !query||!zoneChoice||!kindChoice||!itemStatus||!screwSearch||!screwStatus)return;
  function updateItems(){
    const q=query.value.trim().toLocaleLowerCase();
    const zone=zoneChoice.value,kind=kindChoice.value;
    let shown=0,visibleZones=0;
    for(const card of zones){
      const requested=zone==="all"||zone===card.dataset.itemZoneCard;
      let within=0;
      for(const row of card.querySelectorAll("[data-item-record]")){
        const ok=requested&&(kind==="all"||row.dataset.kind===kind)&&(!q||row.dataset.recordSearch.includes(q));
        row.hidden=!ok;
        if(ok){shown++;within++;}
      }
      card.hidden=within===0;
      if(within)visibleZones++;
    }
    itemStatus.textContent="Showing "+shown+" of "+data.metrics.zoneItemRecords+" original records in "+visibleZones+" Wild Zone"+(visibleZones===1?"":"s");
    if(itemEmpty)itemEmpty.hidden=shown!==0;
  }
  function updateScrews(){
    const q=screwSearch.value.trim().toLocaleLowerCase();
    let shown=0;
    for(const row of screwRows){
      const ok=(chosenDistrict==="All"||row.dataset.district===chosenDistrict)&&(!q||row.dataset.screwSearch.includes(q));
      row.hidden=!ok;
      if(ok)shown++;
    }
    for(const b of districtButtons)b.setAttribute("aria-pressed",String(b.dataset.screwDistrict===chosenDistrict));
    screwStatus.textContent="Showing "+shown+" of "+data.metrics.screws+" screws";
    if(screwEmpty)screwEmpty.hidden=shown!==0;
  }
  let chosenDistrict="All";
  query.addEventListener("input",updateItems);
  zoneChoice.addEventListener("change",updateItems);
  kindChoice.addEventListener("change",updateItems);
  screwSearch.addEventListener("input",updateScrews);
  for(const b of districtButtons)b.addEventListener("click",()=>{chosenDistrict=b.dataset.screwDistrict;updateScrews()});
  // Reuse the ORIGINAL GitHub edition progress record. Do not create a second
  // namespace or write over check/sideCheck/legendCheck/unknown future fields.
  // This is per-browser storage; the original Workspace site is a different origin.
  const PROGRESS_KEY="lumiose-atlas-reconstruction-v1";
  const itemTicks=Array.from(document.querySelectorAll("[data-atlas-pickup]"));
  const screwTicks=Array.from(document.querySelectorAll("[data-atlas-screw]"));
  const itemCount=document.getElementById("atlasItemChecked");
  const screwCount=document.getElementById("atlasScrewChecked");
  const itemFill=document.getElementById("atlasItemProgressFill");
  const screwFill=document.getElementById("atlasScrewProgressFill");
  const saveNotice=document.getElementById("atlasCollectSaveStatus");

  function savedRecord(){
    try{
      const raw=window.localStorage.getItem(PROGRESS_KEY);
      const saved=raw===null?{}:JSON.parse(raw);
      if(!saved||typeof saved!=="object"||Array.isArray(saved))return null;
      for(const key of ["pickup","screw"]){
        const value=saved[key];
        if(value!==undefined&&(!value||typeof value!=="object"||Array.isArray(value)))return null;
      }
      return saved;
    }catch(_){return null;}
  }
  function saveTick(kind,id,isChecked){
    const previous=savedRecord();
    if(previous===null)return false; // Never overwrite a corrupt/unreadable prior record.
    const next={...previous,[kind]:{...(previous[kind]||{}),[id]:isChecked}};
    try{
      window.localStorage.setItem(PROGRESS_KEY,JSON.stringify(next));
      return true;
    }catch(_){return false;}
  }
  function decorateTick(input){
    input.closest(".item-ledger-row, .item-screw-row")?.classList.toggle("is-collected",input.checked);
  }
  function refreshTotals(){
    const items=itemTicks.filter(input=>input.checked).length;
    const screws=screwTicks.filter(input=>input.checked).length;
    if(itemCount)itemCount.textContent=items+" of "+itemTicks.length;
    if(screwCount)screwCount.textContent=screws+" of "+screwTicks.length;
    if(itemFill)itemFill.style.width=(items/itemTicks.length*100).toFixed(1)+"%";
    if(screwFill)screwFill.style.width=(screws/screwTicks.length*100).toFixed(1)+"%";
  }
  function setStorageNotice(ok,action){
    if(!saveNotice)return;
    saveNotice.textContent=ok
      ? action==="saved"
        ? "✓ Collected progress saved on this device and shared with the main guide."
        : "Progress is saved in this browser and shared with the main item and Screw checklists (not across devices)."
      : "⚠ Existing progress could not be read or saved. Your original record was not overwritten; changes made here may be temporary.";
  }
  function refreshFromSharedProgress(){
    const saved=savedRecord();
    if(saved===null){setStorageNotice(false);return;}
    for(const input of itemTicks){
      input.checked=!!saved.pickup?.[input.dataset.atlasPickup];
      decorateTick(input);
    }
    for(const input of screwTicks){
      input.checked=!!saved.screw?.[input.dataset.atlasScrew];
      decorateTick(input);
    }
    refreshTotals();
    setStorageNotice(true);
  }
  // The source ID on each checkbox matches the saved main-page data-pickup
  // or data-screw ID exactly. All 364 must exist before progress can be wired.
  if(itemTicks.length===data.metrics.zoneItemRecords&&screwTicks.length===data.metrics.screws){
    for(const input of itemTicks)input.addEventListener("change",()=>{
      const ok=saveTick("pickup",input.dataset.atlasPickup,input.checked);
      if(ok){refreshFromSharedProgress();setStorageNotice(true,"saved");}
      else{decorateTick(input);refreshTotals();setStorageNotice(false);}
    });
    for(const input of screwTicks)input.addEventListener("change",()=>{
      const ok=saveTick("screw",input.dataset.atlasScrew,input.checked);
      if(ok){refreshFromSharedProgress();setStorageNotice(true,"saved");}
      else{decorateTick(input);refreshTotals();setStorageNotice(false);}
    });
    refreshFromSharedProgress();
    // Progress changed in an *other* tab? Refresh this page's checkmarks.
    // The existing main page reads the same record when navigated/reloaded.
    window.addEventListener?.("storage",event=>{
      if(event.key===PROGRESS_KEY||event.key===null)refreshFromSharedProgress();
    });
    window.addEventListener?.("pageshow",refreshFromSharedProgress);
    window.addEventListener?.("focus",refreshFromSharedProgress);
  }else if(saveNotice){
    saveNotice.textContent="Collection checkboxes unavailable: a source item or Screw is missing. Existing saved data was not changed.";
  }
  updateItems();updateScrews();
})();