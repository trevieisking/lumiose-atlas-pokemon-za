/* PDF boss fieldbook search and chapter filters. No network, storage or player progress writes. */
(() => {
  "use strict";
  const cards=Array.from(document.querySelectorAll("[data-boss-card]"));
  const search=document.getElementById("bossSearch");
  const tabs=Array.from(document.querySelectorAll("[data-boss-filter]"));
  const status=document.getElementById("bossStatus");
  const empty=document.getElementById("bossNoResults");
  if(cards.length!==28||!search||!status)return;
  let group="all";
  function update(){
    const q=search.value.trim().toLocaleLowerCase();
    let visible=0;
    for(const card of cards){
      const matches=(group==="all"||card.dataset.bossGroup===group)&&(!q||card.dataset.search.includes(q));
      card.hidden=!matches;
      if(matches)visible++;
    }
    for(const tab of tabs)tab.setAttribute("aria-pressed",String(tab.dataset.bossFilter===group));
    status.textContent=visible+" of 28 boss cards shown";
    if(empty)empty.hidden=visible>0;
  }
  search.addEventListener("input",update);
  for(const tab of tabs)tab.addEventListener("click",()=>{group=tab.dataset.bossFilter;update()});
  update();
})();
