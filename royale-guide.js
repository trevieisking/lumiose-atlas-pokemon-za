/* Offline Royale team filter. Keeps existing mission progress and report services untouched. */
(() => {
  "use strict";
  const cards=Array.from(document.querySelectorAll("article[data-royale-card]"));
  const search=document.getElementById("royaleSearch");
  const tabs=Array.from(document.querySelectorAll("button[data-royale-filter]"));
  const status=document.getElementById("royaleStatus");
  const empty=document.getElementById("royaleNoResults");
  const reset=document.getElementById("royaleReset");
  if(cards.length!==10||!search)return;
  let active="all";
  function render(){
    const query=search.value.trim().toLocaleLowerCase();
    let visible=0;
    for(const card of cards){
      card.hidden=(active!=="all"&&card.dataset.royaleGroup!==active) ||
        (!!query&&!card.textContent.toLocaleLowerCase().includes(query));
      if(!card.hidden)visible++;
    }
    for(const tab of tabs)tab.setAttribute("aria-pressed",String(tab.dataset.royaleFilter===active));
    status.textContent=visible+" of 10 promotion matches shown";
    empty.hidden=visible>0;
  }
  tabs.forEach(tab=>tab.addEventListener("click",()=>{active=tab.dataset.royaleFilter;render()}));
  search.addEventListener("input",render);
  reset?.addEventListener("click",()=>{search.value="";active="all";render();search.focus()});
  const deep=()=>{
    const id=location.hash.slice(1),target=document.getElementById(id);
    if(!/^royale-match-(?:[1-9]|10)$/.test(id)||!target?.hidden)return;
    active="all";search.value="";render();target.scrollIntoView({block:"start",behavior:"auto"});
  };
  window.addEventListener("hashchange",deep);
  render();deep();
})();