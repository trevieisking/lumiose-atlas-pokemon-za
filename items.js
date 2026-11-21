/* PDF-recovered source index. No browser storage, Supabase, network calls or progress changes. */
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
  updateItems();updateScrews();
})();