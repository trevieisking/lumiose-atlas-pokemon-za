/* Read-only companion to the preserved main walkthrough.
   Never writes progress; canonical checkboxes stay in index.html#walkthrough. */
(() => {
  "use strict";
  const KEY="lumiose-atlas-reconstruction-v1";
  const cards=Array.from(document.querySelectorAll(".route-index-card[data-mission]"));
  const search=document.getElementById("missionIndexSearch");
  const controls=Array.from(document.querySelectorAll("[data-mission-chapter]"));
  const label=document.getElementById("missionIndexVisible");
  const empty=document.getElementById("missionIndexEmpty");
  const progress=document.getElementById("missionIndexProgress");
  let active="all";
  function getCompletion() {
    try {
      const raw=localStorage.getItem(KEY);
      if(raw===null)return {};
      const saved=JSON.parse(raw);
      if(!saved || typeof saved!=="object" || Array.isArray(saved))return null;
      if(saved.check===undefined)return {};
      if(!saved.check || typeof saved.check!=="object" || Array.isArray(saved.check))return null;
      return saved.check;
    } catch (_) { return null; }
  }
  function refreshCompletion() {
    const saved=getCompletion();
    if(saved===null) {
      if(progress)progress.textContent="Saved checkmarks could not be read on this device. No data was changed.";
      for(const card of cards) {
        card.classList.remove("is-complete");
        const state=card.querySelector("[data-mission-state]");
        if(state)state.textContent="Open the full walkthrough to check this mission";
      }
      return;
    }
    let completed=0;
    for(const card of cards) {
      const yes=saved[card.dataset.mission]===true;
      if(yes)completed++;
      card.classList.toggle("is-complete",yes);
      const state=card.querySelector("[data-mission-state]");
      if(state)state.textContent=yes?"✓ Completed in the main walkthrough":"Not yet marked complete";
    }
    if(progress)progress.textContent=completed+" of 42 marked complete in this browser's main guide. Read-only here.";
  }
  function applyFilters() {
    const q=(search?.value||"").trim().toLocaleLowerCase();
    let count=0;
    for(const card of cards) {
      const chapter=active==="all"||card.dataset.chapter===active;
      const match=!q||card.textContent.toLocaleLowerCase().includes(q);
      card.hidden=!(chapter&&match);
      if(!card.hidden)count++;
    }
    if(label)label.textContent="Showing "+count+" of "+cards.length+" missions";
    if(empty)empty.hidden=count!==0;
    for(const button of controls)button.setAttribute("aria-pressed",String(button.dataset.missionChapter===active));
  }
  function revealHash() {
    const match=location.hash.match(/^#mission-(\d{1,2})$/);
    if(!match)return;
    const num=Number(match[1]);
    if(num<1||num>42)return;
    const card=document.getElementById("mission-"+num);
    if(!card)return;
    active="all";
    if(search)search.value="";
    applyFilters();
    const details=card.querySelector("details");
    if(details)details.open=true;
    if(typeof requestAnimationFrame==="function")requestAnimationFrame(()=>card.scrollIntoView({block:"start"}));
  }
  for(const button of controls)button.addEventListener("click",()=>{
    active=button.dataset.missionChapter;
    applyFilters();
  });
  search?.addEventListener("input",applyFilters);
  window.addEventListener("hashchange",revealHash);
  window.addEventListener("pageshow",refreshCompletion);
  window.addEventListener("focus",refreshCompletion);
  window.addEventListener("storage",event=>{if(event.key===KEY)refreshCompletion();});
  refreshCompletion();
  applyFilters();
  revealHash();
})();
