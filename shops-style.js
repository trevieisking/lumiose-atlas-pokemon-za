/* Lightweight offline style-directory search. Does not modify item shops, maps or progress. */
(() => {
  "use strict";
  const section = document.getElementById("fashion-subguides");
  if (!section) return;
  const search = section.querySelector("#styleSearch");
  const cards = Array.from(section.querySelectorAll("[data-style-card]"));
  const status = section.querySelector("#styleResultStatus");
  const empty = section.querySelector("#styleNoResults");
  if (!search || cards.length !== 10 || !status || !empty) return;
  const normalize = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  const indexed = cards.map(card => ({card, text: normalize(card.textContent)}));
  function update() {
    const query = normalize(search.value.trim());
    let arcades = 0, salons = 0;
    for (const {card, text} of indexed) {
      const match = !query || text.includes(query);
      card.hidden = !match;
      if (match && card.dataset.styleKind === "arcade") arcades++;
      if (match && card.dataset.styleKind === "salon") salons++;
      if (query && match && card.dataset.styleKind === "arcade") {
        const detail = card.querySelector("details");
        if (detail) detail.open = true;
      }
    }
    status.textContent = "Showing " + arcades + " shopping arcade" + (arcades === 1 ? "" : "s") +
      " and " + salons + " salon" + (salons === 1 ? "" : "s");
    empty.hidden = arcades + salons > 0;
  }
  search.addEventListener("input", update);
  update();
})();
