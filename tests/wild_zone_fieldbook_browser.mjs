/* AT-321: isolated phone/desktop proof for the four Wild Zone surfaces. */
import assert from "node:assert/strict";
import fs from "node:fs";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
import {wildZoneRecords} from "../wild-zone-fieldbook.mjs";
const base="http://127.0.0.1:18766",output="test-artifacts/atlas-explorer";
fs.mkdirSync(output,{recursive:true});
const server=spawn("python3",["-m","http.server","18766","--bind","127.0.0.1"],{stdio:"ignore"});
let browser;
try{
 let available=false;for(let i=0;i<40;i++){try{if((await fetch(base+"/maps.html")).ok){available=true;break;}}catch{}await pause(150);}
 assert.ok(available);browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
 for(const [kind,width,height] of [["phone",393,852],["desktop",1440,900]]){
   const page=await browser.newPage({viewport:{width,height},isMobile:kind==="phone",hasTouch:kind==="phone",deviceScaleFactor:1});
   const errors=[];page.on("pageerror",err=>errors.push(String(err)));
   async function check(n,screen,shot=false){
     const z=wildZoneRecords[n-1];const panel=page.locator('[data-wz-fieldbook="'+n+'"]:visible');
     await panel.waitFor();assert.equal(await panel.count(),1);
     assert.match(await panel.textContent(),new RegExp(z.area.replace(/[.*+?^$\x7b\x7d()|[\]\\]/g,"\\$&")));
     const imgs=panel.locator(".wz-photo-pair img");assert.equal(await imgs.count(),2);
     for(let i=0;i<2;i++){
       const img=imgs.nth(i);assert.equal(await img.getAttribute("src"),z.photos[i].path);
       assert.equal(await img.locator("..").getAttribute("href"),z.photos[i].path);
       await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
       assert.equal(await img.evaluate(el=>el.naturalWidth),1536);
     }
     assert.equal(await panel.locator('ul[aria-label="Catchable Pokémon"] li').count(),z.species.length);
     if(n===20){await panel.locator("summary").click();assert.equal(await panel.locator(".wz-alpha-pool li").count(),67);}
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
     assert.ok(overflow<=1,screen+" "+kind+" overflow "+overflow);
     if(shot){await panel.scrollIntoViewIfNeeded();await page.screenshot({path:output+"/at321-"+screen+"-wz"+n+"-"+kind+".png"});}
   }
   await page.goto(base+"/index.html#maps",{waitUntil:"load"});
   for(const n of [1,6,20]){await page.locator('#mapZones [data-select-zone="'+n+'"]').click();await check(n,"main",n!==6);}
   await page.goto(base+"/maps.html#wild-zone-1",{waitUntil:"load"});await check(1,"map",true);
   await page.locator('#zone-directory [data-map-zone-button="20"]').click();await check(20,"map",true);
   await page.locator("#mapSearch").fill("Eevee");assert.equal(await page.locator('[data-map-zone-button="19"]').isVisible(),true);
   await page.goto(base+"/sector-maps.html#wildzone-12",{waitUntil:"load"});await check(12,"sector",true);
   await page.goto(base+"/atlas-explorer.html?place=wz-1",{waitUntil:"networkidle"});await check(1,"explorer",true);
   await page.locator('#aeFilters button[data-kind="zone"]').click();
   for(let n=2;n<=20;n++){await page.locator('#aeResults [data-record-id="wz-'+n+'"]').click();await check(n,"explorer",n===20);}
   assert.deepEqual(errors,[]);await page.close();
 }
 console.log("PASS AT-321: 20 Explorer selections, original PNG pairs, full-size links, 15/67 Zone 20 lists, standalone/map directory/main views on desktop and phone.");
}finally{if(browser)await browser.close();server.kill("SIGTERM");}
