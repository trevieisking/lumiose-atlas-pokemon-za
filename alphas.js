/* Offline Alpha Fieldbook search; original progress and feedback service are not modified. */
(() => {
  "use strict";
  const cards=Array.from(document.querySelectorAll("[data-alpha-zone]"));
  const search=document.getElementById("alphaZoneSearch");
  const tabs=Array.from(document.querySelectorAll("[data-alpha-filter]"));
  const status=document.getElementById("alphaZoneStatus");
  const empty=document.getElementById("alphaZoneNoResults");
  const pool=document.getElementById("alphaZone20Pool");
  if(cards.length!==20||!search||!status)return;
  let selected="all";
  function matchRange(n){
    return selected==="all"||
      selected==="1-6"&&n>=1&&n<=6||
      selected==="7-13"&&n>=7&&n<=13||
      selected==="14-20"&&n>=14&&n<=20;
  }
  function update(){
    const query=search.value.trim().toLocaleLowerCase();
    let visible=0;
    for(const card of cards){
      const found=matchRange(Number(card.dataset.alphaZone))&&(!query||card.dataset.alphaKeywords.includes(query));
      card.hidden=!found;
      if(found)visible++;
    }
    for(const button of tabs)button.setAttribute("aria-pressed",String(button.dataset.alphaFilter===selected));
    status.textContent="Showing "+visible+" of 20 Wild Zones";
    if(empty)empty.hidden=visible>0;
    const zone20=cards.find(c=>c.dataset.alphaZone==="20");
    if(pool&&query&&zone20&&!zone20.hidden&&!("wild zone 20".includes(query)))pool.open=true;
  }
  search.addEventListener("input",update);
  for(const button of tabs)button.addEventListener("click",()=>{selected=button.dataset.alphaFilter;update()});
  update();
})();
