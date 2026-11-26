import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:18795/";
const server = spawn("python3", ["-m", "http.server", "18795", "--bind", "127.0.0.1", "--directory", "_site"], {stdio:"ignore"});
let browser;
try {
  for (let n = 0; n < 30; n++) {
    try { if ((await fetch(base + "atlas-explorer.html")).ok) break; } catch {}
    await sleep(200);
  }
  assert.ok((await fetch(base + "atlas-explorer.html")).ok);
  assert.equal((await fetch(base + "ATLAS_DUAL_SITE_FIX_LEDGER.html")).status, 404);
  fs.mkdirSync("test-artifacts/pages-archive", {recursive:true});
  browser = await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
  for (const [name, width, height] of [["phone",393,852],["desktop",1440,900]]) {
    const page = await browser.newPage({viewport:{width,height},isMobile:name==="phone",hasTouch:name==="phone"});
    await page.route("**/*", route =>
      route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base + "atlas-explorer.html?collectible=screw%3A1", {waitUntil:"networkidle"});
    await page.locator("#aeCollectibleDirectory").waitFor({state:"visible"});
    const item = page.locator('[data-layer="item"]'), screw = page.locator('[data-layer="screw"]');
    assert.equal(await item.isChecked(),false);
    assert.equal(await screw.isChecked(),false);
    const snap = () => page.evaluate(() => localStorage.getItem("lumiose-atlas-reconstruction-v1"));
    const before = await snap();
    await item.check();
    assert.equal(await screw.isChecked(),false);
    assert.equal(await page.locator("#aeCollectiblePins button").count(),0);
    assert.equal(await snap(),before);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator("#aeViewport").screenshot({path:"test-artifacts/pages-archive/" + name + "-map.png"});
    await page.close();
  }
} finally { await browser?.close();server.kill(); }
