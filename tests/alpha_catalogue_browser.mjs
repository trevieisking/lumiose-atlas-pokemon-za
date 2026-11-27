import assert from "node:assert/strict";
import fs from "node:fs";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
const base="http://127.0.0.1:18782/",output="test-artifacts/alpha-catalogue";
fs.mkdirSync(output,{recursive:true});
const server=spawn("python3",["-m","http.server","18782","--bind","127.0.0.1"],{stdio:"ignore"});
let browser;
try{
 let ready=false;for(let i=0;i<40;i++){try{if((await fetch(base+"alphas.html")).ok){ready=true;break;}}catch{}await pause(150);}
 assert.ok(ready);
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
 for(const [device,width,height] of [["phone",393,852],["desktop",1440,900]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:device==="phone",hasTouch:device==="phone"});
  await context.route("**/*",route=>route.request().url().startsWith(base)?route.continue():route.abort());
  await context.addInitScript(()=>{window.__alphaWrites=[];for(const method of ["setItem","removeItem","clear"]){const original=Storage.prototype[method];Storage.prototype[method]=function(...args){window.__alphaWrites.push(method);return original.apply(this,args);};}});
  const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(String(e)));
  await page.goto(base+"alphas.html#alpha-catalogue",{waitUntil:"load"});
  const host=page.locator("#alpha-catalogue"),status=host.locator("[data-alpha-catalogue-status]"),filter=host.locator("[data-alpha-catalogue-filter]"),search=host.locator("[data-alpha-catalogue-search]");
  await host.locator("[data-alpha-national]").first().waitFor();
  assert.match(await status.innerText(),/Showing 1–24 of 364/);
  assert.match(await host.locator("[data-alpha-catalogue-summary]").innerText(),/25 listed unavailable/);
  await filter.selectOption("unavailable");assert.match(await status.innerText(),/of 25 matching species/);
  await host.locator("[data-alpha-catalogue-next]").click();assert.match(await status.innerText(),/Showing 25–25 of 25/);
  await search.fill("Mewtwo");assert.equal(await host.locator("[data-alpha-national]").count(),1);
  assert.equal(await host.locator("[data-alpha-national]").getAttribute("data-alpha-availability"),"unavailable");
  await host.screenshot({path:output+"/unavailable-"+device+".png"});
  await filter.selectOption("all");await search.fill("Dratini");assert.equal(await host.locator("[data-alpha-national]").count(),1);
  assert.match(await host.locator("[data-alpha-national]").innerText(),/Café Kizuna/);
  await host.screenshot({path:output+"/dratini-"+device+".png"});
  assert.equal(await page.locator("[data-alpha-zone]").count(),20);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth<=1));
  assert.deepEqual(await page.evaluate(()=>window.__alphaWrites),[]);
  assert.deepEqual(errors,[]);
  await context.close();
 }
}finally{await browser?.close();server.kill();}
