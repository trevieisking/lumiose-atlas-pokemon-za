/* Lumiose Atlas local-only progress backup and safe merge importer. No network calls. */
(function backupController(bookmarklet) {
  "use strict";
  const FORMAT = "lumiose-atlas-progress", VERSION = 1;
  const CURRENT = "lumiose-atlas-reconstruction-v1";
  const MAP = "lumiose-atlas-mapped-pins-v1";
  const EXTRA = "lumiose-atlas-unmatched-backup-v1";
  const PREVIOUS = "lumiose-atlas-last-pre-import-v1";
  const kinds = ["check", "sideCheck", "legendCheck", "pickup", "screw"];
  const manifest = window.LUMIOSE_PROGRESS_KEYS;
  const mapIndex = window.LUMIOSE_MAP_PINS;
  const $ = selector => document.querySelector(selector);
  const status = $("#backupStatus");
  const summary = $("#currentBackupSummary");
  const preview = $("#importPreview");
  const fileInput = $("#backupInput");
  const confirmButton = $("#confirmBackupImport");
  const lastDownload = $("#downloadPreImport");
  let candidate = null;

  function show(message, error = false) {
    if (!status) return;
    status.textContent = message;
    status.className = error ? "backup-status backup-error" : "backup-status";
    status.setAttribute("role", error ? "alert" : "status");
  }

  if (!manifest || manifest.version !== 1 || !mapIndex || mapIndex.version !== 1 ||
      kinds.some(kind => !Array.isArray(manifest.keys[kind]))) {
    show("Backup format could not be verified. No progress will be read or changed.", true);
    return;
  }

  const allowed = Object.fromEntries(kinds.map(kind => [kind, new Set(manifest.keys[kind])]));
  const indexed = new Map(Object.values(mapIndex.zones).flat().map(pin => [`${pin.zone}-${pin.id}`, pin]));
  const empty = () => Object.fromEntries(kinds.map(kind => [kind, Object.create(null)]));

  function object(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }
  function safeKey(key) {
    return typeof key === "string" && /^[\p{L}\p{N} ._'’\-]{1,120}$/u.test(key) &&
      !["__proto__", "constructor", "prototype"].includes(key);
  }
  function parse(raw, name) {
    if (raw === null) return {};
    try {
      const value = JSON.parse(raw);
      if (!object(value)) throw new Error("not an object");
      return value;
    } catch (_) {
      throw new Error("Existing " + name + " storage is unreadable. No changes made; export or preserve it before continuing.");
    }
  }
  function readAll() {
    const raw = [localStorage.getItem(CURRENT), localStorage.getItem(MAP), localStorage.getItem(EXTRA)];
    return {raw, main:parse(raw[0],"guide progress"), pins:parse(raw[1],"mapped pins"), unmatched:parse(raw[2],"unmatched progress")};
  }
  function snapshot() {
    const records = readAll();
    const progress = empty(), unmatched = empty(), mappedPins = Object.create(null);
    for (const kind of kinds) {
      const current = object(records.main[kind]) ? records.main[kind] : {};
      const extra = object(records.unmatched[kind]) ? records.unmatched[kind] : {};
      for (const [key,value] of Object.entries({...extra,...current})) {
        if (value !== true || !safeKey(key)) continue;
        if (allowed[kind].has(key)) progress[kind][key] = true;
        else unmatched[kind][key] = true;
      }
    }
    const otherPins = object(records.unmatched.mappedPins) ? records.unmatched.mappedPins : {};
    for (const [key,value] of Object.entries({...otherPins,...records.pins})) {
      if (value !== true || !safeKey(key)) continue;
      const pin = indexed.get(key);
      if (!pin) unmatched.mappedPins ||= Object.create(null), unmatched.mappedPins[key] = true;
      else if (pin.pickup) progress.pickup[pin.pickup] = true;
      else mappedPins[key] = true;
    }
    return {progress,mappedPins,unmatched};
  }
  function counts(data) {
    return kinds.map(kind => `${({check:"Story",sideCheck:"Side missions",legendCheck:"Legendaries",pickup:"Items",screw:"Screws"})[kind]}: ${Object.keys(data.progress[kind] || {}).length}`).join(" · ");
  }
  function refresh() {
    try {
      const data = snapshot();
      const unresolved = Object.values(data.unmatched).reduce((total,section)=>total+(object(section)?Object.keys(section).length:0),0);
      if (summary) summary.textContent = counts(data) + ` · Unmatched map pins: ${Object.keys(data.mappedPins).length}` +
        (unresolved ? ` · ${unresolved} unmatched identifiers safely retained` : "");
      const storyCount = Object.keys(data.progress.check).length;
      const sideProgress = $("#sideProgress"), sidePercent = $("#sidePercent"), sideMeter = $("#sideMeter");
      if (sideProgress) sideProgress.textContent = storyCount + " / 42 missions";
      if (sidePercent) sidePercent.textContent = Math.round(storyCount / 42 * 100) + "%";
      if (sideMeter) sideMeter.style.width = (storyCount / 42 * 100).toFixed(1) + "%";
      const previous = localStorage.getItem(PREVIOUS);
      if (lastDownload) lastDownload.disabled = !previous;
    } catch (error) {
      show(error.message, true);
    }
  }
  function download(data, filename) {
    const text = JSON.stringify(data, null, 2);
    const url = URL.createObjectURL(new Blob([text], {type:"application/json"}));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }
  function formatExport(data, source = "reconstructed-guide") {
    return {format:FORMAT,version:VERSION,source,exportedAt:new Date().toISOString(),progress:data.progress,
      mappedPins:data.mappedPins,unmatched:data.unmatched};
  }

  $("#downloadBackup")?.addEventListener("click", () => {
    try {
      download(formatExport(snapshot()), "lumiose-atlas-progress-" + new Date().toISOString().slice(0,10) + ".json");
      show("Backup download requested. Check Downloads and keep the JSON file somewhere safe.");
    } catch (error) { show("Export failed: " + error.message, true); }
  });

  const textArea = $("#legacyBookmarkletCode");
  if (textArea) textArea.value = bookmarklet;
  $("#copyLegacyExporter")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(bookmarklet);
      show("Exporter copied. Edit a browser bookmark's URL and paste this code; run that bookmark only on the ORIGINAL guide.");
    } catch (_) {
      textArea?.focus(); textArea?.select();
      show("Automatic copying is blocked in this browser. Select and copy the code in the box below.");
    }
  });

  function validateFile(data) {
    if (!object(data) || data.format !== FORMAT || data.version !== VERSION || !object(data.progress)) {
      throw new Error("This is not a supported Lumiose Atlas progress backup (version 1). No changes were made.");
    }
    if (data.exportedAt != null && (typeof data.exportedAt !== "string" || data.exportedAt.length > 50)) {
      throw new Error("Invalid backup metadata.");
    }
    const incoming = empty(), unknown = empty(), pins = Object.create(null);
    const importedUnknown = object(data.unmatched) ? data.unmatched : {};
    let flagged = 0;
    for (const kind of kinds) {
      const found = object(data.progress[kind]) ? data.progress[kind] : {};
      const pending = object(importedUnknown[kind]) ? importedUnknown[kind] : {};
      for (const [key,value] of Object.entries({...pending,...found})) {
        if (!safeKey(key) || typeof value !== "boolean") throw new Error("Invalid " + kind + " checkbox record. Nothing was imported.");
        if (!value) continue; // A backup never unchecks a completed item.
        if (allowed[kind].has(key)) incoming[kind][key] = true;
        else unknown[kind][key] = true, flagged++;
      }
    }
    const filePins = object(data.mappedPins) ? data.mappedPins : {};
    const additionalPins = object(importedUnknown.mappedPins) ? importedUnknown.mappedPins : {};
    for (const [key,value] of Object.entries({...additionalPins,...filePins})) {
      if (!safeKey(key) || typeof value !== "boolean") throw new Error("Invalid mapped pin record. Nothing was imported.");
      if (!value) continue;
      const pin = indexed.get(key);
      if (!pin) unknown.mappedPins ||= Object.create(null), unknown.mappedPins[key] = true, flagged++;
      else if (pin.pickup) incoming.pickup[pin.pickup] = true;
      else pins[key] = true;
    }
    return {progress:incoming,mappedPins:pins,unmatched:unknown,unknownCount:flagged};
  }

  fileInput?.addEventListener("change", async () => {
    candidate = null;
    if (confirmButton) confirmButton.disabled = true;
    if (preview) preview.hidden = true;
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json") || file.size > 1_000_000) {
      show("Choose a Lumiose Atlas .json backup smaller than 1 MB. Nothing was imported.",true);
      return;
    }
    try {
      const parsed = validateFile(JSON.parse(await file.text()));
      const now = snapshot();
      const additions = kinds.reduce((n,kind) => n +
        Object.keys(parsed.progress[kind]).filter(key => !now.progress[kind][key]).length,0)
        + Object.keys(parsed.mappedPins).filter(key => !now.mappedPins[key]).length;
      const newUnknown = parsed.unknownCount;
      candidate = {parsed,additions};
      if (preview) {
        preview.hidden = false;
        const details = $("#importPreviewText");
        if (details) details.textContent = `Recognised completed progress: ${counts(parsed)}. ` +
          `${Object.keys(parsed.mappedPins).length} separate map-pin checks. ` +
          `${additions} new completed records can be added to this device. ` +
          (newUnknown ? `${newUnknown} currently unmatched identifiers will be retained in the backup for later reconciliation. ` : "") +
          "Existing completed records remain checked.";
      }
      if (confirmButton) confirmButton.disabled = false;
      show("Backup checked successfully. Preview the counts, then choose Merge progress to import it.");
    } catch (error) {show("Import preview refused: " + error.message,true);}
  });

  confirmButton?.addEventListener("click", () => {
    if (!candidate) return;
    const {parsed,additions} = candidate;
    let current;
    try {
      current = readAll(); // Refuse import if local storage is already malformed.
      const old = {createdAt:new Date().toISOString(),stateRaw:current.raw[0],pinsRaw:current.raw[1],unmatchedRaw:current.raw[2]};
      const combined = {
        main: JSON.parse(JSON.stringify(current.main)),
        pins: JSON.parse(JSON.stringify(current.pins)),
        unmatched: JSON.parse(JSON.stringify(current.unmatched))
      };
      for (const kind of kinds) {
        if (!object(combined.main[kind])) combined.main[kind] = {};
        if (!object(combined.unmatched[kind])) combined.unmatched[kind] = {};
        for (const key of Object.keys(parsed.progress[kind])) combined.main[kind][key] = true;
        for (const key of Object.keys(parsed.unmatched[kind])) combined.unmatched[kind][key] = true;
      }
      for (const key of Object.keys(parsed.mappedPins)) combined.pins[key] = true;
      if (object(parsed.unmatched.mappedPins)) {
        if (!object(combined.unmatched.mappedPins)) combined.unmatched.mappedPins = {};
        for (const key of Object.keys(parsed.unmatched.mappedPins)) combined.unmatched.mappedPins[key] = true;
      }
      // Save an on-device pre-import recovery snapshot before mutating ANY progress keys.
      localStorage.setItem(PREVIOUS, JSON.stringify(old));
      try {
        localStorage.setItem(CURRENT,JSON.stringify(combined.main));
        localStorage.setItem(MAP,JSON.stringify(combined.pins));
        localStorage.setItem(EXTRA,JSON.stringify(combined.unmatched));
      } catch (error) {
        for (const [key,raw] of [[CURRENT,old.stateRaw],[MAP,old.pinsRaw],[EXTRA,old.unmatchedRaw]]) {
          if (raw === null) localStorage.removeItem(key); else localStorage.setItem(key,raw);
        }
        throw error;
      }
      candidate = null;
      if (preview) preview.hidden = true;
      if (confirmButton) confirmButton.disabled = true;
      if (fileInput) fileInput.value = "";
      refresh();
      show(`Import complete: ${additions} newly checked records added. Existing completed progress was preserved. A pre-import recovery copy remains available.`);
    } catch (error) {
      show("No safe import was completed: " + error.message, true);
    }
  });

  lastDownload?.addEventListener("click", () => {
    try {
      const saved = parse(localStorage.getItem(PREVIOUS),"previous import");
      if (!("stateRaw" in saved)) throw new Error("No saved pre-import snapshot found.");
      const data = {format:"lumiose-atlas-pre-import-raw",version:1,createdAt:saved.createdAt,
        raw:{main:saved.stateRaw,pins:saved.pinsRaw,unmatched:saved.unmatchedRaw}};
      download(data, "lumiose-atlas-pre-import-recovery-" + new Date().toISOString().slice(0,10)+".json");
      show("Pre-import recovery snapshot downloaded. Keep this file in case you need a manual rollback.");
    } catch (error) {show(error.message,true);}
  });

  refresh();
})("javascript:(function legacyExporter() {\n  \"use strict\";\n  const home = \"lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site\";\n  if (location.hostname !== home) {\n    alert(\"Open the ORIGINAL Lumiose Atlas website before running this exporter. No data was read.\");\n    return;\n  }\n  const attrs = {\n    check: \"data-check\",\n    sideCheck: \"data-side-check\",\n    legendCheck: \"data-legend-check\",\n    pickup: \"data-pickup\",\n    screw: \"data-screw\"\n  };\n  const progress = {check:{},sideCheck:{},legendCheck:{},pickup:{},screw:{}};\n  const scanned = {};\n  for (const [kind, attr] of Object.entries(attrs)) {\n    const inputs = document.querySelectorAll('input[type=\"checkbox\"][' + attr + ']');\n    scanned[kind] = inputs.length;\n    for (const input of inputs) {\n      const key = input.getAttribute(attr);\n      if (key && input.checked) progress[kind][key] = true;\n    }\n  }\n  if (scanned.check < 42 || scanned.sideCheck < 200 || scanned.legendCheck < 25 ||\n      scanned.pickup < 264 || scanned.screw < 100) {\n    alert(\"Some original guide checklists have not loaded. Open the main #home guide and wait for all its sections, then try again. Nothing was exported or changed.\");\n    return;\n  }\n  const count = Object.values(progress).reduce((total, section) => total + Object.keys(section).length, 0);\n  if (!count && !confirm(\"No completed checkmarks were detected. Export an empty backup anyway?\")) return;\n  const archive = {\n    format: \"lumiose-atlas-progress\",\n    version: 1,\n    source: \"original-site-checkboxes\",\n    exportedAt: new Date().toISOString(),\n    progress,\n    mappedPins: {},\n    scanned\n  };\n  const blob = new Blob([JSON.stringify(archive, null, 2)], {type:\"application/json\"});\n  const url = URL.createObjectURL(blob);\n  const a = document.createElement(\"a\");\n  a.href = url;\n  a.download = \"lumiose-atlas-original-progress-\" + new Date().toISOString().slice(0, 10) + \".json\";\n  document.body.appendChild(a);\n  a.click();\n  a.remove();\n  setTimeout(() => URL.revokeObjectURL(url), 15000);\n  alert(\"Original-site progress exported: \" + count + \" checked records. Check your Downloads folder. Your original guide was not changed.\");\n})();");
