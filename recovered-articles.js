/* Shared utilities for independent, recovered Atlas article pages.
   No API calls or access to the original site's saved player progress. */
(() => {
  "use strict";
  const reportLink = document.getElementById("atlasArticleFeedback");
  if (reportLink) {
    try {
      const url = new URL("feedback.html", location.href);
      url.searchParams.set("page", location.pathname + location.hash);
      reportLink.href = url.href;
    } catch (_) { reportLink.href = "feedback.html"; }
  }
  const share = document.getElementById("atlasArticleShare");
  const shareStatus = document.getElementById("atlasArticleShareStatus");
  share?.addEventListener("click", async () => {
    try {
      if (navigator.share) {
        await navigator.share({title:document.title, url:location.href});
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(location.href);
        if (shareStatus) shareStatus.textContent = "Page link copied.";
        return;
      }
    } catch (_) { /* Share may be cancelled or clipboard blocked. */ }
    if (shareStatus) shareStatus.textContent = "Copy the URL from your browser to share.";
  });
  const table = document.getElementById("mableRewards");
  if (!table) return;
  const rows = Array.from(table.querySelectorAll("tr[data-reward-row]"));
  const checks = Array.from(table.querySelectorAll('input[data-research-level]'));
  const storeKey = "lumiose-atlas-gh-pages-mable-claims-v1";
  const saved = new Set();
  try {
    const parsed = JSON.parse(localStorage.getItem(storeKey) || "[]");
    if (Array.isArray(parsed)) {
      parsed.forEach(v => {
        const n = Number(v);
        if (Number.isInteger(n) && n >= 2 && n <= 50) saved.add(n);
      });
    }
  } catch (_) { /* Tracker remains usable in this tab when storage is unavailable. */ }
  const progressLabel = document.getElementById("mableProgressLabel");
  const progressMeter = document.getElementById("mableProgressMeter");
  const progressFill = document.getElementById("mableProgressFill");
  const visibleStatus = document.getElementById("mableVisible");
  const search = document.getElementById("mableSearch");
  const filters = Array.from(document.querySelectorAll("[data-mable-filter]"));
  let active = "all";
  function persist() {
    try { localStorage.setItem(storeKey, JSON.stringify([...saved].sort((a,b)=>a-b))); }
    catch (_) { /* No storage changes outside this article's own key. */ }
  }
  function repaint() {
    let visible = 0;
    const query = (search?.value || "").trim().toLowerCase();
    for (const row of rows) {
      const matchText = !query || row.textContent.toLowerCase().includes(query);
      const matchType = active === "all" || row.dataset.kind === active;
      row.hidden = !(matchText && matchType);
      if (!row.hidden) visible++;
      const level = Number(row.dataset.level);
      row.classList.toggle("claimed", saved.has(level));
    }
    for (const checkbox of checks) checkbox.checked = saved.has(Number(checkbox.dataset.researchLevel));
    const count = saved.size;
    if (progressLabel) progressLabel.textContent = count + " of 49 rewards marked claimed";
    if (progressMeter) progressMeter.setAttribute("aria-valuenow", String(count));
    if (progressFill) progressFill.style.width = (count/49*100).toFixed(2) + "%";
    if (visibleStatus) visibleStatus.textContent = "Showing " + visible + " of 49 rewards";
    for (const button of filters) button.setAttribute("aria-pressed", String(button.dataset.mableFilter === active));
  }
  table.addEventListener("change", event => {
    const target = event.target;
    if (!target?.matches?.("input[data-research-level]")) return;
    const level = Number(target.dataset.researchLevel);
    if (!Number.isInteger(level) || level < 2 || level > 50) return;
    if (target.checked) saved.add(level); else saved.delete(level);
    persist();
    repaint();
  });
  search?.addEventListener("input", repaint);
  for (const button of filters) {
    button.addEventListener("click", () => {
      active = button.dataset.mableFilter;
      repaint();
    });
  }
  document.getElementById("mableReset")?.addEventListener("click", () => {
    if (!confirm("Clear only the 49 Mable reward checkmarks stored in this browser?")) return;
    saved.clear();
    persist();
    repaint();
  });
  repaint();
})();

/* AT-311: progressive, same-origin enrichment on the map-related articles only. */
(() => {
  if(typeof window==="undefined"||!document.documentElement||typeof window.location?.pathname!=="string")return;
  const page=window.location.pathname.split("/").pop();
  if(!["maps.html","sector-maps.html","alphas.html","items.html","walkthrough.html","side-missions.html","shiny-hunting.html","hyperspace-maps.html","mega-dimension.html"].includes(page))return;
  import("./atlas-guide-links.mjs").then(({installArticleLinks})=>installArticleLinks(document,page)).catch(error=>console.warn("Optional guide references unavailable",error));
})();
