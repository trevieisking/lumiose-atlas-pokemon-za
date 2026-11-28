/* AT-338 / AT-333: isolated browser proof. Synthetic coordinates exist only in
 * intercepted test responses; production has no fixture query or debug hook. */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:18767";
const output = "test-artifacts/atlas-collectibles";
const progressKey = "lumiose-atlas-reconstruction-v1";
const evidenceSource = fs.readFileSync("items-data.js", "utf8");
const evidenceSandbox = { window: {} };
vm.runInNewContext(evidenceSource, evidenceSandbox);
const realEvidence = JSON.parse(JSON.stringify(evidenceSandbox.window.ATLAS_ITEM_EVIDENCE));
const realRegister = JSON.parse(fs.readFileSync("atlas-collectibles-data.json", "utf8"));
assert.deepEqual(realRegister.placements, [], "No synthetic or unverified placements may ship in production");

// Counterfactual fixed pickups are deliberately restricted to these intercepted
// responses. Original IDs remain intact, but reward/random source kinds cannot
// qualify unless replaced within the isolated synthetic evidence response.
const syntheticEvidence = structuredClone(realEvidence);
const records = [];
for (const zone of syntheticEvidence.zones) {
  for (const item of zone.items) {
    item.name = "Synthetic item " + item.id + " × 3";
    item.hint = "Synthetic test route for " + item.id;
    item.kind = "landmark";
    records.push({ id: "item:" + item.id, originalId: item.id, kind: "item" });
  }
}
for (const screw of syntheticEvidence.screws) {
  screw.hint = "Synthetic Screw test route " + screw.number;
  records.push({ id: "screw:" + screw.number, originalId: String(screw.number), kind: "screw" });
}
assert.equal(records.length, 364);
assert.equal(new Set(records.map(record => record.id)).size, 364);
const clusterIds = [records[0].id, records[1].id, records[264].id];
const nearbyId = records[2].id;
// This area avoids the original Prism Tower and Wild Zone buttons. Their click
// priority must remain intact while the synthetic points exercise proximity taps.
const clusterXY = [1200, 960];
const fixturePhoto = "assets/atlas/wild-zones/wild-zone-01-closeup.png";
assert.ok(fs.existsSync(fixturePhoto));
const grid = [];
for (let row = 0; row < 24; row++) {
  for (let column = 0; column < 24; column++) {
    const xy = [120 + column * 72, 120 + row * 72];
    if (Math.hypot(xy[0] - clusterXY[0], xy[1] - clusterXY[1]) > 300) grid.push(xy);
  }
}
let gridIndex = 0;
const fixtureRegister = {
  ...structuredClone(realRegister),
  placements: records.map(record => ({
    ...record,
    physicalId: "synthetic-only-" + record.id,
    pickupType: "fixed",
    coordinateSpace: "atlas-native-pixels",
    mapSha256: realRegister.map.sha256,
    xy: clusterIds.includes(record.id) ? [...clusterXY]
      : record.id === nearbyId ? [clusterXY[0] + 48, clusterXY[1]]
        : grid[Math.floor(gridIndex++ * grid.length / 360)],
    scene: record.id === clusterIds[1] ? "roof" : "ground",
    floor: record.id === clusterIds[1] ? "Upper roof" : "Ground level",
    directions: ["Synthetic route: use the labelled test entrance."],
    unlock: "None required in this synthetic test.",
    sources: [{
      reference: "docs/qa/synthetic-test-evidence.json",
      observedOn: "2026-11-26",
      evidence: "Synthetic test only; not a real map placement."
    }],
    photos: record.id === records[0].id ? [fixturePhoto] : [],
    verification: { identity: true, position: true, scene: true, floor: true, route: true, source: true }
  }))
};
assert.equal(gridIndex, 360);
const seedObject = {
  pickup: { [records[0].originalId]: true, [records[1].originalId]: false, "future-pickup": { preserved: true } },
  screw: { "1": true, "future-screw": "keep" },
  check: { "37": true }, sideCheck: { "61": true }, legendCheck: { zygarde: true },
  futureEngine: { revision: 9, nested: ["preserve", { exact: true }] }
};
const initialRaw = " \n" + JSON.stringify(seedObject, null, 2) + "\n ";
const results = { productionPins: 0, fixtureRecords: 364, fixturesTestOnly: true, devices: {}, storage: [] };
fs.mkdirSync(output, { recursive: true });

const server = spawn("python3", ["-m", "http.server", "18767", "--bind", "127.0.0.1"], { stdio: "ignore" });
let browser;

async function installProgressProbe(context, raw = initialRaw, unavailable = false) {
  await context.addInitScript(({ key, raw, unavailable }) => {
    const storage = window.localStorage;
    const get = Storage.prototype.getItem;
    const set = Storage.prototype.setItem;
    const remove = Storage.prototype.removeItem;
    const clear = Storage.prototype.clear;
    set.call(storage, key, raw);
    set.call(storage, "atlas-test-unrelated", "preserve this other storage key");
    const mutations = [];
    Object.defineProperty(window, "__atlasReadOnlyTest", { value: {
      mutations,
      read: () => get.call(storage, key),
      unrelated: () => get.call(storage, "atlas-test-unrelated"),
      replaceFromOtherTab: value => set.call(storage, key, value)
    } });
    Storage.prototype.setItem = function (name, value) {
      mutations.push({ operation: "setItem", key: name });
      return set.call(this, name, value);
    };
    Storage.prototype.removeItem = function (name) {
      mutations.push({ operation: "removeItem", key: name });
      return remove.call(this, name);
    };
    Storage.prototype.clear = function () {
      mutations.push({ operation: "clear" });
      return clear.call(this);
    };
    if (unavailable) Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() { throw new DOMException("Storage blocked for isolated browser test", "SecurityError"); }
    });
  }, { key: progressKey, raw, unavailable });
}

async function installFixture(context, register = fixtureRegister) {
  await context.route("**/items-data.js", route => route.fulfill({
    status: 200, contentType: "text/javascript",
    body: "window.ATLAS_ITEM_EVIDENCE = " + JSON.stringify(syntheticEvidence) + ";"
  }));
  await context.route("**/atlas-collectibles-data.json", route => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify(register)
  }));
}

async function settle(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function ready(page, suffix = "") {
  await page.goto(base + "/atlas-explorer.html" + suffix, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("#aeStats")?.textContent.includes("21 owner-surveyed"));
  await page.waitForFunction(() => document.querySelectorAll("#aeCollectibleResults button[data-collectible-id]").length === 364);
  await page.locator("#aeMapImage").evaluate(async image => { await image.decode(); });
  await settle(page);
}

async function directory(page) {
  const details = page.locator("#aeCollectibleDirectory");
  if (await details.getAttribute("open") === null) await details.locator("summary").click();
}

async function layers(page, item, screw) {
  await page.locator('#aeLayers [data-layer="item"]').setChecked(item);
  await page.locator('#aeLayers [data-layer="screw"]').setChecked(screw);
  await settle(page);
}

async function assertProgressUntouched(page, raw, label) {
  const current = await page.evaluate(() => ({
    raw: window.__atlasReadOnlyTest.read(),
    other: window.__atlasReadOnlyTest.unrelated(),
    mutations: window.__atlasReadOnlyTest.mutations
  }));
  assert.equal(current.raw, raw, label + ": progress bytes, formatting and unknown fields must survive");
  assert.equal(current.other, "preserve this other storage key", label + ": unrelated storage must survive");
  assert.deepEqual(current.mutations, [], label + ": Explorer must never attempt any storage mutation");
}

async function assertLayout(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert.ok(dimensions.document <= dimensions.viewport + 1 && dimensions.body <= dimensions.viewport + 1,
    label + ": horizontal overflow " + JSON.stringify(dimensions));
  assert.equal(await page.locator('video, .ae-route-video, iframe[src*="youtube"], iframe[src*="youtu.be"]').count(), 0,
    label + ": media remains paused");
}

async function visibleIds(page) {
  return page.locator("#aeCollectiblePins .ae-collectible-pin:visible").evaluateAll(nodes => nodes.map(node => node.dataset.collectibleId).sort());
}

async function nativePositions(page) {
  return page.locator("#aeCollectiblePins .ae-collectible-pin").evaluateAll(nodes => Object.fromEntries(
    nodes.map(node => [node.dataset.collectibleId, { left: node.style.left, top: node.style.top }])
  ));
}

async function measurePin(page, id) {
  return page.locator('.ae-collectible-pin[data-collectible-id="' + id + '"]').evaluate(node => {
    const target = node.getBoundingClientRect();
    const dot = node.querySelector(".ae-collectible-dot").getBoundingClientRect();
    return { targetWidth: target.width, targetHeight: target.height, dotWidth: dot.width, dotHeight: dot.height,
      x: target.x + target.width / 2, y: target.y + target.height / 2,
      label: node.getAttribute("aria-label"), colour: getComputedStyle(node.querySelector(".ae-collectible-dot")).backgroundColor };
  });
}

function assertCompactSize(measurement, label) {
  assert.ok(Math.abs(measurement.targetWidth - 44) < .6 && Math.abs(measurement.targetHeight - 44) < .6,
    label + ": selection target must remain 44 CSS pixels " + JSON.stringify(measurement));
  assert.ok(Math.abs(measurement.dotWidth - 7) < .6 && Math.abs(measurement.dotHeight - 7) < .6,
    label + ": visual dot must remain 7 CSS pixels " + JSON.stringify(measurement));
  assert.ok(measurement.label?.trim(), label + ": compact dots need accessible names");
}

async function chooseAtCluster(page, touch) {
  await page.locator("#aeViewport").scrollIntoViewIfNeeded();
  await settle(page);
  const centre = await measurePin(page, clusterIds[0]);
  // This oracle uses rendered screen centres, not the engine's overlap helper.
  const expected = await page.locator("#aeCollectiblePins .ae-collectible-pin:visible").evaluateAll((nodes, point) =>
    nodes.filter(node => {
      const box = node.getBoundingClientRect();
      return Math.hypot(box.x + box.width / 2 - point.x, box.y + box.height / 2 - point.y) <= 24.1;
    }).map(node => node.dataset.collectibleId).sort(), centre);
  assert.ok(expected.length >= 2, "The deliberate coincident fixture must exercise the overlap chooser");
  if (touch) await page.touchscreen.tap(centre.x, centre.y);
  else await page.mouse.click(centre.x, centre.y);
  await page.locator("#aeCollectibleChooser").waitFor({ state: "visible" });
  const choices = page.locator("#aeCollectibleChooserOptions button[data-collectible-id]");
  assert.deepEqual(await choices.evaluateAll(nodes => nodes.map(node => node.dataset.collectibleId).sort()), expected,
    "Chooser must use current screen distance and visible layers only");
  assert.match(await page.locator("#aeCollectibleChooser").textContent(), /Ground level/);
  assert.match(await page.locator("#aeCollectibleChooser").textContent(), /Upper roof/);
  await assertLayout(page, "Overlap chooser");
  return expected;
}

async function verifyProgressRefresh(page) {
  await directory(page);
  await page.locator('#aeCollectibleResults button[data-collectible-id="' + records[0].id + '"]').click();
  const status = page.locator("#aeCollectibleDetail [data-collectible-progress]");
  assert.match(await status.textContent(), /^\s*collected\b/i);
  for (const [event, collected] of [["storage", false], ["focus", true], ["pageshow", false]]) {
    const changed = structuredClone(seedObject);
    changed.pickup[records[0].originalId] = collected;
    const raw = "\n " + JSON.stringify(changed, null, 3) + " \n";
    await page.evaluate(({ raw, event }) => {
      window.__atlasReadOnlyTest.replaceFromOtherTab(raw);
      window.dispatchEvent(event === "storage" ? new StorageEvent("storage", { key: null }) : new Event(event));
    }, { raw, event });
    await page.waitForFunction(wanted => {
      const text = document.querySelector("#aeCollectibleDetail [data-collectible-progress]")?.textContent.trim().toLowerCase();
      return wanted ? text?.startsWith("collected") : text?.startsWith("not collected");
    }, collected);
    await assertProgressUntouched(page, raw, event + " refresh");
  }
}

try {
  let serving = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(base + "/atlas-explorer.html")).ok) { serving = true; break; } } catch (_) {}
    await pause(150);
  }
  assert.ok(serving, "Local static test server must start");
  browser = await chromium.launch({ ...(process.env.ATLAS_CHROME_EXECUTABLE ? { executablePath: process.env.ATLAS_CHROME_EXECUTABLE } : { channel: "chrome" }), headless: true, args: ["--no-sandbox"] });

  for (const device of [
    { name: "desktop", viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false },
    { name: "phone", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
  ]) {
    const { name, ...options } = device;
    const production = await browser.newContext({ ...options, deviceScaleFactor: 1 });
    await installProgressProbe(production);
    const productionPage = await production.newPage();
    const productionErrors = [];
    productionPage.on("pageerror", error => productionErrors.push(String(error)));
    try {
      await ready(productionPage);
      assert.equal(await productionPage.locator('[data-layer="item"]').isChecked(), false);
      assert.equal(await productionPage.locator('[data-layer="screw"]').isChecked(), false);
      assert.match(await productionPage.locator("#aeCollectibleStatus").textContent(), /0 verified|no verified map points/i);
      const originalView = await productionPage.locator("#aeStage").getAttribute("style");
      for (const [items, screws] of [[false, false], [true, false], [false, true], [true, true]]) {
        await layers(productionPage, items, screws);
        assert.deepEqual(await visibleIds(productionPage), []);
        assert.equal(await productionPage.locator("#aeStage").getAttribute("style"), originalView,
          "Empty layer toggles must preserve the original view");
      }
      await productionPage.locator("#aeLayers").evaluate(element => {
        window.scrollBy({ top: element.getBoundingClientRect().top - 80, behavior: "instant" });
      });
      await settle(productionPage);
      await productionPage.screenshot({ path: output + "/at338-production-empty-map-" + name + ".png" });
      await directory(productionPage);
      const matchingRows = async (query, filter = "all") => {
        await productionPage.locator("#aeCollectibleKind").selectOption(filter);
        await productionPage.locator("#aeCollectibleSearch").fill(query);
        return productionPage.locator("#aeCollectibleResults button:not([hidden])")
          .evaluateAll(nodes => nodes.map(node => node.dataset.collectibleId));
      };
      assert.deepEqual(await matchingRows("Colorful Screw 29", "screw"), ["screw:29"]);
      assert.deepEqual(await matchingRows("Colorful Screw #29", "screw"), ["screw:29"]);
      assert.deepEqual(await matchingRows("Wild Zone 2 Great Ball"), ["item:2-5"]);
      assert.deepEqual(await matchingRows("Wild Zone 2"),
        [...Array.from({length:6}, (_,i) => "item:2-" + i), "screw:15"]);
      const accented = await matchingRows("Poké Ball");
      assert.equal(accented.length, 5);
      assert.deepEqual(accented, await matchingRows("Poke Ball"));
      assert.equal((await matchingRows("")).length, 364);
      assert.deepEqual(await visibleIds(productionPage), []);
      await productionPage.locator('#aeCollectibleResults button[data-collectible-id="' + records[0].id + '"]').click();
      assert.match(await productionPage.locator("#aeCollectibleDetail [data-collectible-progress]").textContent(), /^\s*collected\b/i);
      assert.equal(await productionPage.locator("#aeCollectibleShowMap:visible").count(), 0,
        "An unverified original record must not gain a map action");
      assert.equal(await productionPage.locator("#aeStage").getAttribute("style"), originalView);
      await productionPage.locator("#aeCollectibleDetail").scrollIntoViewIfNeeded();
      await assertLayout(productionPage, name + " production empty state");
      await productionPage.screenshot({ path: output + "/at338-production-empty-" + name + ".png" });
      await assertProgressUntouched(productionPage, initialRaw, name + " production");
      assert.deepEqual(productionErrors, []);
    } finally { await production.close(); }

    const context = await browser.newContext({ ...options, deviceScaleFactor: 1 });
    await installProgressProbe(context);
    await installFixture(context);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(String(error)));
    try {
      await ready(page);
      assert.equal(await page.locator('[data-layer="item"]').isChecked(), false);
      assert.equal(await page.locator('[data-layer="screw"]').isChecked(), false);
      assert.deepEqual(await visibleIds(page), []);
      const originalView = await page.locator("#aeStage").getAttribute("style");
      const originalMajorMarkers = await page.locator("#aeMapPins .ae-pin").count();
      const combinations = [];
      for (const [items, screws] of [[false, false], [true, false], [false, true], [true, true]]) {
        await layers(page, items, screws);
        const ids = await visibleIds(page);
        const expected = records.filter(record => record.kind === "item" ? items : screws).map(record => record.id).sort();
        assert.deepEqual(ids, expected, name + ": independent layer combination");
        assert.equal(await page.locator("#aeMapPins .ae-pin").count(), originalMajorMarkers);
        assert.equal(await page.locator("#aeStage").getAttribute("style"), originalView);
        combinations.push({ items, screws, count: ids.length });
      }
      const positions = await nativePositions(page);
      const originalPinNodes = await page.locator("#aeCollectiblePins").evaluateHandle(node => Array.from(node.children));
      await page.locator("#aeViewport").scrollIntoViewIfNeeded();
      const overview = await measurePin(page, clusterIds[0]);
      assertCompactSize(overview, name + " overview");
      const screwMeasure = await measurePin(page, clusterIds[2]);
      assert.notEqual(overview.colour, screwMeasure.colour, "Items and Screws need distinct dot colours");
      await page.screenshot({ path: output + "/at338-dense-overview-" + name + ".png" });
      const overviewChoices = await chooseAtCluster(page, device.hasTouch);
      assert.ok(overviewChoices.includes(nearbyId), "Nearby point belongs in the overview chooser");
      await page.locator("#aeCollectibleChooser").screenshot({ path: output + "/at338-overlap-chooser-" + name + ".png" });
      await page.locator("#aeCollectibleClose").click();
      await layers(page, true, false);
      const itemOnlyChoices = await chooseAtCluster(page, device.hasTouch);
      assert.ok(itemOnlyChoices.every(id => id.startsWith("item:")), "Hidden Screws must never enter the chooser");
      await page.locator("#aeCollectibleClose").press("Escape");
      assert.equal(await page.locator("#aeCollectibleChooser").isVisible(), false);
      assert.equal(await page.evaluate(() => document.activeElement?.id), "aeViewport", "Escape returns keyboard focus to the map");
      await layers(page, true, true);

      // Use the public detail action to centre the isolated test cluster. Then
      // six real zoom-button clicks produce the same 7px dot and 44px
      // target. A nearby native point leaves the chooser as screen distance grows.
      await directory(page);
      await page.locator('#aeCollectibleResults button[data-collectible-id="' + records[0].id + '"]').click();
      await page.locator("#aeCollectibleShowMap").click();
      for (let step = 0; step < 6; step++) await page.locator("#aeZoomIn").click();
      await page.locator("#aeViewport").scrollIntoViewIfNeeded();
      await settle(page);
      const zoomed = await measurePin(page, clusterIds[0]);
      assertCompactSize(zoomed, name + " zoomed");
      await page.screenshot({ path: output + "/at338-dense-zoom-" + name + ".png" });
      const zoomedChoices = await chooseAtCluster(page, device.hasTouch);
      assert.deepEqual(zoomedChoices, [...clusterIds].sort(), "Only truly coincident points remain within the zoomed screen radius");
      const choice = page.locator('#aeCollectibleChooserOptions button[data-collectible-id="' + clusterIds[1] + '"]');
      if (device.hasTouch) await choice.tap();
      else { await choice.focus(); await choice.press("Enter"); }
      assert.match(await page.locator("#aeCollectibleDetail").textContent(), /Upper roof/);
      assert.match(await page.locator("#aeCollectibleDetail").textContent(), /Synthetic route/);
      assert.equal(await page.evaluate(() => document.querySelector("#aeCollectibleDetail").contains(document.activeElement)), true,
        "Choosing a record must move focus into its detail before the chooser button disappears");
      const selectedOutline = await page.locator('.ae-collectible-pin[data-collectible-id="' + clusterIds[1] + '"] .ae-collectible-dot')
        .evaluate(dot => {
          const style = getComputedStyle(dot);
          return dot.getBoundingClientRect().width + 2 * (Number.parseFloat(style.outlineWidth) + Number.parseFloat(style.outlineOffset));
        });
      assert.ok(selectedOutline >= 10 && selectedOutline <= 12, "Selected dot outline must remain compact at 10–12 CSS pixels");
      assert.deepEqual(await nativePositions(page), positions, "Selection must never move or merge native XY");
      await page.locator("#aeCollectibleDetail").scrollIntoViewIfNeeded();
      await page.screenshot({ path: output + "/at338-selected-detail-" + name + ".png" });
      await page.locator("#aeCollectibleClear").focus();
      await page.locator("#aeCollectibleClear").press("Enter");
      assert.equal(await page.evaluate(() => {
        const active = document.activeElement;
        return active?.id === "aeCollectibleSearch" || active?.tagName === "SUMMARY" && active.parentElement?.id === "aeCollectibleDirectory";
      }), true, "Clearing a record must leave focus on an available directory control");

      // The accessible directory is independent of both pin switches and the
      // original place search. Choosing a row alone must not move the map.
      await layers(page, false, false);
      await directory(page);
      for (const [kind, count] of [["item", 264], ["screw", 100], ["all", 364]]) {
        await page.locator("#aeCollectibleKind").selectOption(kind);
        assert.equal(await page.locator("#aeCollectibleResults button[data-collectible-id]:not([hidden])").count(), count);
      }
      await page.locator("#aeCollectibleSearch").fill("Synthetic item " + records[0].originalId + " ×");
      assert.equal(await page.locator("#aeCollectibleResults button[data-collectible-id]:not([hidden])").count(), 1);
      const beforeDirectory = await page.locator("#aeStage").getAttribute("style");
      await page.locator("#aeCollectibleSearch").focus();
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.id), "aeCollectibleKind");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement?.dataset.collectibleId), records[0].id,
        "A matching directory record must be reachable through normal Tab order");
      await page.keyboard.press("Enter");
      assert.equal(await page.locator("#aeStage").getAttribute("style"), beforeDirectory);
      assert.deepEqual(await visibleIds(page), []);
      assert.match(await page.locator("#aeCollectibleDetail").textContent(), new RegExp(records[0].originalId));
      const oldGuide = page.locator('#aeCollectibleDetail a[href="items.html#item-' + records[0].originalId + '"]');
      assert.equal(await oldGuide.count(), 1, "Detail must retain the original guide and progress owner");
      assert.equal(await page.locator('#aeCollectibleDetail a[href="' + fixturePhoto + '"]').count(), 1,
        "A validated local still photograph must remain accessible");
      assert.equal((await page.request.get(base + "/" + fixturePhoto)).ok(), true);
      await page.locator("#aeCollectibleShowMap").click();
      await settle(page);
      assert.equal(await page.locator('[data-layer="item"]').isChecked(), true);
      assert.equal(await page.locator('[data-layer="screw"]').isChecked(), false,
        "Show on map must enable only the selected record's layer");
      const compatibleQuery = "Synthetic item " + records[0].originalId + " ×";
      assert.equal(await page.locator("#aeCollectibleSearch").inputValue(), compatibleQuery,
        "Show on map must preserve a search that already includes the selected record");
      assert.equal(await page.locator("#aeCollectibleKind").inputValue(), "all");
      assert.deepEqual(await visibleIds(page), [records[0].id]);

      // A selected detail can outlive the current directory filter. The explicit
      // map action must reveal that record by clearing only conflicting filters;
      // changing filters alone must neither move the view nor change any layers.
      const otherLayers = () => page.locator('#aeLayers input:not([data-layer="item"])')
        .evaluateAll(nodes => nodes.map(node => [node.dataset.layer, node.checked]));
      for (const scenario of [
        { kind: "screw", query: compatibleQuery, expectedKind: "all", expectedQuery: compatibleQuery, expectedPins: 1 },
        { kind: "item", query: "no-such-synthetic-record", expectedKind: "item", expectedQuery: "", expectedPins: 264 },
        { kind: "screw", query: "Colorful Screw", expectedKind: "all", expectedQuery: "", expectedPins: 264 }
      ]) {
        const viewBeforeFilter = await page.locator("#aeStage").getAttribute("style");
        const preservedLayers = await otherLayers();
        await page.locator("#aeCollectibleKind").selectOption(scenario.kind);
        await page.locator("#aeCollectibleSearch").fill(scenario.query);
        assert.equal(await page.locator("#aeStage").getAttribute("style"), viewBeforeFilter);
        assert.deepEqual(await otherLayers(), preservedLayers);
        assert.equal(await page.locator('.ae-collectible-pin[data-collectible-id="' + records[0].id + '"]').isVisible(), false,
          "The regression must start with the selected point excluded by the active directory filter");
        assert.match(await page.locator("#aeCollectibleDetail").textContent(), /Synthetic item 1-0/,
          "Filtering must retain the selected original record");
        await page.locator("#aeCollectibleShowMap").click();
        await settle(page);
        assert.equal(await page.locator("#aeCollectibleKind").inputValue(), scenario.expectedKind);
        assert.equal(await page.locator("#aeCollectibleSearch").inputValue(), scenario.expectedQuery);
        const shownIds = await visibleIds(page);
        assert.equal(shownIds.length, scenario.expectedPins);
        assert.ok(shownIds.includes(records[0].id), "Show on map must expose the selected point, not only its coordinates");
        assert.deepEqual(await otherLayers(), preservedLayers, "Showing an item must preserve every unrelated layer switch");
        assert.equal(await page.locator('[data-layer="item"]').isChecked(), true);
        const centreOffset = await page.locator('.ae-collectible-pin[data-collectible-id="' + records[0].id + '"]').evaluate(pin => {
          const point = pin.getBoundingClientRect();
          const viewport = document.querySelector("#aeViewport").getBoundingClientRect();
          return Math.hypot(point.x + point.width / 2 - viewport.x - viewport.width / 2,
            point.y + point.height / 2 - viewport.y - viewport.height / 2);
        });
        assert.ok(centreOffset <= 2,
          "The visible selected point must be centred in the map");
        assert.deepEqual(await nativePositions(page), positions);
      }
      // An already enabled other collectible layer is also preserved.
      await layers(page, false, true);
      const screwOnLayers = await otherLayers();
      await page.locator("#aeCollectibleShowMap").click();
      await settle(page);
      assert.deepEqual(await otherLayers(), screwOnLayers);
      assert.equal((await visibleIds(page)).length, 364);
      await assertProgressUntouched(page, initialRaw, name + " filtered Show on map");
      await layers(page, true, false);
      await page.locator("#aeCollectibleSearch").fill("no-such-synthetic-record");
      assert.equal(await page.locator("#aeCollectibleResults button[data-collectible-id]:not([hidden])").count(), 0);
      await page.locator("#aeCollectibleSearch").fill("");
      await page.locator("#aeSearch").fill("Vernal Avenue");
      assert.equal(await page.locator('#aeResults [data-record-id="vert-sector-2"]').count(), 1,
        "Original place and street search must remain independent");
      await page.locator("#aeSearch").fill("");

      // Focus/Enter on the real compact pin remains available although its
      // pointer-transparent target leaves room for dense pan/pinch gestures.
      const keyboardPin = page.locator('.ae-collectible-pin[data-collectible-id="' + records[0].id + '"]');
      await keyboardPin.focus();
      await keyboardPin.press("Enter");
      await page.locator("#aeCollectibleChooser").waitFor({ state: "visible" });
      await page.locator("#aeCollectibleClose").click();

      await page.locator("#aeReset").click();
      await layers(page, true, true);
      await page.locator("#aeViewport").scrollIntoViewIfNeeded();
      await settle(page);
      const gesture = await page.evaluate(deviceName => {
        const viewport = document.querySelector("#aeViewport");
        const box = viewport.getBoundingClientRect();
        const visible = { left: Math.max(0, box.left), right: Math.min(innerWidth, box.right),
          top: Math.max(0, box.top), bottom: Math.min(innerHeight, box.bottom) };
        // Keep both starts and the subsequent real touch moves inside the visible
        // map. Fixed fractions can all land on the original 40px major markers
        // on a phone; those markers must retain their pointer priority.
        const bounds = { left: Math.ceil(visible.left + 30), right: Math.floor(visible.right - 34),
          top: Math.ceil(visible.top + 44), bottom: Math.floor(visible.bottom - 46) };
        const separation = Math.min(180, (visible.right - visible.left) * .45);
        const blocked = new Map();
        let tested = 0, free = 0;
        const diagnostics = () => ({ device: deviceName,
          viewport: { x: box.x, y: box.y, width: box.width, height: box.height },
          window: { width: innerWidth, height: innerHeight }, visible, bounds,
          minimumSeparation: separation, testedPoints: tested, unobstructedPoints: free,
          obstructingHits: [...blocked].sort((a, b) => b[1] - a[1]).slice(0, 12)
        });
        for (let y = bounds.top; y <= bounds.bottom; y += 12) {
          const row = [];
          for (let x = bounds.left; x <= bounds.right; x += 12) {
            tested++;
            const hit = document.elementFromPoint(x, y);
            const control = hit?.closest("button,a,input,select,textarea,[role='button']");
            if (hit && viewport.contains(hit) && !control) { row.push(x); free++; }
            else {
              const node = control || hit;
              const reason = !node ? "outside document" : !viewport.contains(hit) ? "outside map: " + node.tagName
                : node.tagName + " " + (node.id || node.getAttribute("aria-label") || node.className).toString().slice(0, 100);
              blocked.set(reason, (blocked.get(reason) || 0) + 1);
            }
          }
          if (row.length > 1 && row.at(-1) - row[0] >= separation)
            return { x1: row[0], x2: row.at(-1), y, diagnostics: diagnostics() };
        }
        return { diagnostics: diagnostics() };
      }, name);
      console.log("AT338_GESTURE_HIT_TEST " + JSON.stringify(gesture));
      if (!Number.isFinite(gesture.x1) || !Number.isFinite(gesture.x2)) {
        await page.screenshot({ path: output + "/at338-gesture-hit-failure-" + name + ".png" });
        assert.fail(name + ": no separated unobstructed gesture starts: " + JSON.stringify(gesture.diagnostics));
      }
      const beforePan = await page.locator("#aeStage").getAttribute("style");
      if (device.hasTouch) {
        const session = await context.newCDPSession(page);
        const point = (x, y, id) => ({ x: Math.round(x), y: Math.round(y), id });
        const { x1, x2, y } = gesture;
        try {
          await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(x1, y, 1), point(x2, y, 2)] });
          await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point(x1 - 22, y - 30, 1), point(x2 + 28, y + 40, 2)] });
          await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        } finally { await session.detach(); }
        await page.waitForFunction(() => Number.parseFloat(document.querySelector("#aeZoomLabel").textContent) > 1.1);
        assert.doesNotMatch(await page.locator("#aePositionReadout").textContent(), /· 0°/);
      } else {
        const x = gesture.x1, y = gesture.y;
        await page.mouse.move(x, y);
        await page.mouse.down();
        await page.mouse.move(x + 52, y + 34, { steps: 5 });
        await page.mouse.up();
        await page.waitForFunction(before => document.querySelector("#aeStage").getAttribute("style") !== before, beforePan);
        await page.locator("#aeTurnRight").click();
        await page.waitForFunction(() => document.querySelector("#aePositionReadout").textContent.includes("45°"));
      }
      assert.equal(await page.locator("#aeCollectibleChooser").isVisible(), false,
        "Pan or multitouch must never be mistaken for collectible selection");
      const gestureZoom = Number.parseFloat(await page.locator("#aeZoomLabel").textContent());
      await page.locator("#aeRose").click();
      await page.waitForFunction(() => document.querySelector("#aePositionReadout").textContent.includes("0°"));
      assert.equal(Number.parseFloat(await page.locator("#aeZoomLabel").textContent()), gestureZoom,
        "Compass must keep zoom while resetting north");
      assert.deepEqual(await nativePositions(page), positions);

      // Repeated render states must not accumulate DOM nodes or handlers. Record
      // counts provide reproducible performance evidence without time thresholds.
      for (let repetition = 0; repetition < 4; repetition++) {
        await layers(page, false, false);
        await layers(page, true, true);
        assert.equal((await visibleIds(page)).length, 364);
        assert.equal(await page.locator("#aeCollectiblePins .ae-collectible-pin").count(), 364);
        assert.equal(await page.locator("#aeCollectibleResults button[data-collectible-id]").count(), 364);
        assert.equal(await page.locator("#aeMapPins .ae-pin").count(), originalMajorMarkers);
      }
      assert.equal(await page.evaluate(original => {
        const current = document.querySelector("#aeCollectiblePins").children;
        return original.length === current.length && original.every((node, index) => node === current[index]);
      }, originalPinNodes), true, "Gestures, filters and switches must reuse the bounded set of pin nodes");
      await originalPinNodes.dispose();
      await assertLayout(page, name + " dense layout");
      await assertProgressUntouched(page, initialRaw, name + " dense actions");
      await verifyProgressRefresh(page);

      // Shared links use original identity namespaces; legacy place/sector links
      // continue to resolve to their established routes rather than new pins.
      await ready(page, "?collectible=" + encodeURIComponent(records[0].id));
      assert.match(await page.locator("#aeCollectibleDetail").textContent(), /Synthetic item/);
      assert.deepEqual(await visibleIds(page), [], "A shared detail link does not silently turn layers on");
      await ready(page, "?place=hotel-z-ladder");
      assert.equal(await page.locator("#aeRouteSelect").inputValue(), "hotel-z-ladder");
      await ready(page, "?sector=bleu-sector-7");
      assert.equal(await page.locator("#aeCoverageSector").inputValue(), "bleu-sector-7");
      assert.match(await page.locator("#aeCoverageStatus").textContent(), /NOT a verified sector centre/);
      assert.equal(await page.locator(".ae-pin[data-kind='holovator']").count(), 21);
      await assertProgressUntouched(page, initialRaw, name + " deep links");
      assert.deepEqual(errors, [], name + " JavaScript errors");
      results.devices[name] = { combinations, overview, zoomed, selectedOutline, overviewChoices, zoomedChoices, gesture,
        stableOriginalMajorMarkers: originalMajorMarkers, repeatedFullPinCount: 364,
        originalPinNodesRetained: true, noHorizontalOverflow: true };
    } finally { await context.close(); }
  }

  for (const fault of [
    { name: "corrupt-json", raw: '{"pickup":', unavailable: false },
    { name: "invalid-progress-shape", raw: '{"pickup":null,"screw":{},"future":{"preserve":true}}', unavailable: false },
    { name: "storage-unavailable", raw: initialRaw, unavailable: true }
  ]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await installProgressProbe(context, fault.raw, fault.unavailable);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(String(error)));
    try {
      await ready(page);
      await directory(page);
      await page.locator('#aeCollectibleResults button[data-collectible-id="' + records[0].id + '"]').click();
      assert.match(await page.locator("#aeCollectibleDetail [data-collectible-progress]").textContent(), /unavailable/i,
        "Unreadable progress must not be reported as uncollected");
      await layers(page, true, true);
      await page.locator("#aeCollectibleSearch").fill(records[0].originalId);
      await assertProgressUntouched(page, fault.raw, fault.name);
      assert.deepEqual(errors, [], fault.name + " must leave the map usable");
      results.storage.push({ case: fault.name, unavailableLabel: true, writes: 0, bytesPreserved: true });
    } finally { await context.close(); }
  }

  // A bad placement never removes its original directory record or invents a pin.
  const invalidContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const invalidRegister = structuredClone(fixtureRegister);
  invalidRegister.placements[0].xy = [-1, 960];
  await installFixture(invalidContext, invalidRegister);
  await installProgressProbe(invalidContext);
  const invalidPage = await invalidContext.newPage();
  try {
    await ready(invalidPage);
    await layers(invalidPage, true, true);
    assert.equal((await visibleIds(invalidPage)).length, 363);
    assert.equal(await invalidPage.locator('.ae-collectible-pin[data-collectible-id="' + records[0].id + '"]').count(), 0);
    await directory(invalidPage);
    await invalidPage.locator('#aeCollectibleResults button[data-collectible-id="' + records[0].id + '"]').click();
    assert.equal(await invalidPage.locator("#aeCollectibleShowMap:visible").count(), 0);
    await assertProgressUntouched(invalidPage, initialRaw, "Invalid coordinate fallback");
    results.invalidCoordinateRejected = true;
  } finally { await invalidContext.close(); }

  const unavailableContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await installProgressProbe(unavailableContext);
  await unavailableContext.route("**/atlas-collectibles-data.json", route => route.fulfill({
    status: 503, contentType: "application/json", body: "{}"
  }));
  const unavailablePage = await unavailableContext.newPage();
  try {
    await ready(unavailablePage);
    assert.match(await unavailablePage.locator("#aeCollectibleStatus").textContent(), /could not load/i);
    await layers(unavailablePage, true, true);
    assert.deepEqual(await visibleIds(unavailablePage), []);
    await unavailablePage.locator("#aeTurnRight").click();
    await unavailablePage.waitForFunction(() => document.querySelector("#aePositionReadout").textContent.includes("45°"));
    await unavailablePage.locator("#aeNorth").click();
    await unavailablePage.waitForFunction(() => document.querySelector("#aePositionReadout").textContent.includes("0°"));
    await assertProgressUntouched(unavailablePage, initialRaw, "Unavailable placement register");
    results.registerFailurePreservesOriginalMap = true;
  } finally { await unavailableContext.close(); }

  // AT-348 A3-01: open actual field evidence from the map and inspect real photos.
  const photoRegister=JSON.parse(fs.readFileSync("docs/field-guides/collectible-photo-register.json","utf8"));
  for(const [device,width,height] of [["phone",393,852],["desktop",1440,900]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:device==="phone",hasTouch:device==="phone"});
    await installProgressProbe(context);
    await context.route("**/*",route=>route.request().url().startsWith(base+"/")?route.continue():route.abort());
    const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(String(e)));
    try{
      await ready(page);
      await page.locator('a[href="collectible-fieldbook.html"]').click();
      await page.waitForURL(base+"/collectible-fieldbook.html");
      assert.equal(await page.locator("details.field-find").count(),51);
      assert.equal(await page.locator(".field-gallery img").count(),250);
      for(const id of ["wild-zone-3-aerial-ace-rouge-plaza-rooftop","vert-7-dive-ball-rooftop","vert-4-colorful-screw-courtyard-scaffold","bleu-6-western-scaffold","sewers-canal-access-taunt","jaune-5-endure-rooftop-garden"]){
        const row=photoRegister.entries.find(x=>x.id===id),entry=page.locator("#"+id);
        await entry.locator(":scope > summary").click();
        const imgs=entry.locator(".field-gallery img");assert.equal(await imgs.count(),row.photos.length);
        for(const [i,photo] of row.photos.entries()){
          const img=imgs.nth(i);assert.equal(await img.getAttribute("src"),photo.path);
          assert.equal(await img.locator("..").getAttribute("href"),photo.path);
          await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
          assert.ok(await img.evaluate(el=>el.naturalWidth>0&&el.naturalHeight>0),photo.path);
        }
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        await entry.locator(".field-gallery").screenshot({path:output+"/at348-fieldbook-"+device+"-"+id+".png"});
        await entry.locator(":scope > summary").click();
      }
      await assertProgressUntouched(page,initialRaw,"Fieldbook "+device);
      assert.deepEqual(errors,[]);
      await page.locator('a[href="items.html"]').first().click();await page.waitForURL(base+"/items.html");
      assert.equal(await page.locator("[data-atlas-pickup]").count(),264);
      assert.equal(await page.locator("[data-atlas-screw]").count(),100);
      await page.locator('a[href="collectible-fieldbook.html"]').click();await page.waitForURL(base+"/collectible-fieldbook.html");
      assert.equal(await page.locator("details.field-find").count(),51);
      results["fieldbook_"+device]={groups:51,photos:250,representative_galleries_decoded:6,progress_unchanged:true};
    }finally{await context.close();}
  }

  fs.writeFileSync(output + "/at338-browser-proof.json", JSON.stringify(results, null, 2) + "\n");
  console.log("AT-338 compact collectible browser proof passed: production zero pins; 364 test-only points; desktop + phone; read-only progress.");
} finally {
  await browser?.close();
  server.kill();
}
