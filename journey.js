/* Standalone journey filtering and navigation only. No database or player progress writes. */
(() => {
  "use strict";
  const search = document.getElementById("journeySearch");
  const filters = Array.from(document.querySelectorAll("button[data-journey-filter]"));
  const cards = Array.from(document.querySelectorAll("article[data-journey-mission]"));
  const chapters = Array.from(document.querySelectorAll("section[data-journey-chapter]"));
  const label = document.getElementById("journeyCount");
  const noResults = document.getElementById("journeyNoResults");
  const reset = document.getElementById("journeyReset");
  if (!search || cards.length !== 56) return;
  let active = "all";
  function update() {
    const term = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const card of cards) {
      const matchesCategory = active === "all" || card.dataset.journeyGroup === active;
      const matchesText = !term || card.textContent.toLocaleLowerCase().includes(term) ||
        card.dataset.journeyMission.toLocaleLowerCase().includes(term);
      card.hidden = !(matchesCategory && matchesText);
      if (!card.hidden) count++;
    }
    for (const chapter of chapters)
      chapter.hidden = !Array.from(chapter.querySelectorAll("article[data-journey-mission]")).some(c => !c.hidden);
    for (const button of filters)
      button.setAttribute("aria-pressed", String(button.dataset.journeyFilter === active));
    label.textContent = count + " of 56 mission cards shown";
    noResults.hidden = count !== 0;
  }
  search.addEventListener("input",update);
  filters.forEach(button => button.addEventListener("click", () => {
    active = button.dataset.journeyFilter;
    update();
  }));
  reset?.addEventListener("click",()=>{search.value="";active="all";update();search.focus()});
  function revealHashTarget() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!/^journey-(?:mission|dlc)-(?:[1-9]|[1-3][0-9]|4[0-2])$/.test(id)) return;
    const target = document.getElementById(id);
    if (!target || !target.hidden) return;
    active = "all";search.value="";update();
    target.scrollIntoView({block:"start",behavior:"auto"});
  }
  window.addEventListener("hashchange",revealHashTarget);
  update();
  revealHashTarget();
})();