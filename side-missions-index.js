/* Read-only companion for 203 preserved side missions.
   Canonical checkmarks are written only by existing index.html#sidequests. */
(() => {
  "use strict";
  const KEY="lumiose-atlas-reconstruction-v1";
  const cards=Array.from(document.querySelectorAll(".restored-side-quest[data-quest-key]"));
  const search=document.getElementById("sideMissionSearch");
  const filters=Array.from(document.querySelectorAll("[data-side-filter]"));
  const count=document.getElementById("sideIndexVisible");
  const empty=document.getElementById("sideIndexEmpty");
  const progress=document.getElementById("sideIndexProgress");
  let active="all";
  function readSideChecks() {
    try {
      const raw=localStorage.getItem(KEY);
      if(raw===null)return {};
      const saved=JSON.parse(raw);
      if(!saved || typeof saved!=="object" || Array.isArray(saved))return null;
      if(saved.sideCheck===undefined)return {};
      const side=saved.sideCheck;
      if(!side || typeof side!=="object" || Array.isArray(side))return null;
      return side;
    } catch (_) { return null; }
  }
  function syncProgress() {
    const checks=readSideChecks();
    let finished=0;
    for(const card of cards) {
      const key=card.dataset.questKey;
      const yes=checks!==null && checks[key]===true;
      if(yes)finished++;
      card.classList.toggle("is-complete",yes);
      const checkbox=card.querySelector('input[data-side-check]');
      if(checkbox){checkbox.checked=yes;checkbox.disabled=true;}
      const note=card.querySelector("[data-quest-status]");
      if(note)note.textContent=checks===null
        ? "Open the main guide to check completion"
        : yes?"✓ Marked complete in main guide":"Not yet marked complete";
    }
    if(progress)progress.textContent=checks===null
      ? "Could not read this device's saved side missions. No progress was changed."
      : finished+" of 203 marked complete in the original main guide. Read-only on this page.";
  }
  function applyFilter() {
    const query=(search?.value||"").trim().toLocaleLowerCase();
    let visible=0;
    for(const card of cards) {
      const group=active==="all"||card.dataset.questCategory===active;
      const match=!query || card.textContent.toLocaleLowerCase().includes(query);
      card.hidden=!(group&&match);
      if(!card.hidden)visible++;
    }
    if(count)count.textContent="Showing "+visible+" of "+cards.length+" requests";
    if(empty)empty.hidden=visible!==0;
    for(const button of filters)
      button.setAttribute("aria-pressed",String(button.dataset.sideFilter===active));
  }
  function revealHash() {
    const match=location.hash.match(/^#quest-(\d{1,3}|EX[1-3])$/);
    if(!match)return;
    const id=match[0].slice(1);
    const target=document.getElementById(id);
    const card=target?.closest(".restored-side-quest");
    if(!card)return;
    active="all";
    if(search)search.value="";
    applyFilter();
    const detail=card.querySelector("details.side-route");
    if(detail)detail.open=true;
    if(typeof requestAnimationFrame==="function")
      requestAnimationFrame(()=>card.scrollIntoView({block:"start"}));
  }
  for(const button of filters)
    button.addEventListener("click",()=>{active=button.dataset.sideFilter;applyFilter();});
  search?.addEventListener("input",applyFilter);
  window.addEventListener("hashchange",revealHash);
  window.addEventListener("pageshow",()=>{syncProgress();applyFilter();});
  window.addEventListener("focus",()=>{syncProgress();applyFilter();});
  window.addEventListener("storage",event=>{if(event.key===KEY){syncProgress();applyFilter();}});
  syncProgress();
  applyFilter();
  revealHash();
})();
