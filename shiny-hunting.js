/* Shiny odds explainer: no network or saved game state.
   Formula is 1 - (1 - per-spawn chance)^eligible spawns. */
(() => {
  "use strict";
  const input = document.getElementById("shinySpawnCount");
  const charm = document.getElementById("shinyCharmEnabled");
  const output = document.getElementById("shinyOddsResult");
  const description = document.getElementById("shinyOddsExplanation");
  if (!input || !charm || !output || !description) return;
  function update() {
    const n = Number(input.value);
    if (!Number.isInteger(n) || n < 1 || n > 1000000) {
      output.textContent = "Enter 1–1,000,000 spawns";
      description.textContent = "Count newly generated eligible Pokémon spawns, not bench rests or trips.";
      return;
    }
    const odds = charm.checked ? 1024.38 : 4096;
    const pct = 100 * (1 - Math.pow(1 - 1 / odds, n));
    const display = pct >= 99.95 ? ">99.9%" : pct.toFixed(1) + "%";
    output.textContent = display + " chance of at least one shiny";
    description.textContent = "Across " + n.toLocaleString("en-GB") + " independent eligible spawns at about 1 in " +
      (charm.checked ? "1,024.38" : "4,096") + " each. This is an estimate, never a guaranteed result. It excludes the special Level 3 Sparkling Power forced spawn.";
  }
  input.addEventListener("input", update);
  charm.addEventListener("change", update);
  update();
})();