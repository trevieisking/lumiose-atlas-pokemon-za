/* AT-321: isolated phone/desktop proof for the four Wild Zone surfaces. */
import assert from "node:assert/strict";
import fs from "node:fs";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
import {wildZoneRecords} from "../wild-zone-fieldbook.mjs";
const base="http://127.0.0.1:18766",output="test-artifacts/atlas-explorer";
// Explorer stores zero-padded IDs; the other map surfaces use numeric fragments.
const explorerZoneId=n=>"wz-"+String(n).padStart(2,"0");
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
     assert.ok((await panel.textContent()).includes(z.area),"Named area missing: "+z.area);
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
     if(shot){await panel.locator(".wz-photo-pair").screenshot({path:output+"/at321-"+screen+"-wz"+n+"-"+kind+"-photos.png"});await panel.screenshot({path:output+"/at321-"+screen+"-wz"+n+"-"+kind+"-roster.png"});}
   }
   await page.goto(base+"/index.html#maps",{waitUntil:"load"});
   for(const n of [1,6,20]){await page.locator('#mapZones [data-select-zone="'+n+'"]').click();await check(n,"main",n!==6);}
   // AT-326: share links track the selection without resetting filters on a click.
   await page.goto(base+"/maps.html?source=atlas#wild-zone-1",{waitUntil:"load"});await check(1,"map",true);
   await page.locator('#zone-directory [data-map-zone-button="20"]').click();await check(20,"map",true);
   assert.equal(new URL(page.url()).hash,"#wild-zone-20");assert.equal(new URL(page.url()).search,"?source=atlas");
   await page.evaluate(()=>history.back());await page.waitForURL("**/maps.html?source=atlas#wild-zone-1");
   await page.locator('[data-wz-fieldbook="1"]:visible').waitFor();
   await page.evaluate(()=>history.forward());await page.waitForURL("**/maps.html?source=atlas#wild-zone-20");
   await page.locator('[data-wz-fieldbook="20"]:visible').waitFor();
   await page.reload({waitUntil:"load"});await page.locator('[data-wz-fieldbook="20"]:visible').waitFor();
   await page.locator("#mapSearch").fill("not-a-real-at326-species");
   assert.equal(new URL(page.url()).hash,"");assert.equal(new URL(page.url()).search,"?source=atlas");
   assert.equal(await page.locator("[data-wz-fieldbook]:visible").count(),0);
   await page.locator("#mapSearch").fill("Eevee");assert.equal(await page.locator('[data-map-zone-button="19"]').isVisible(),true);
   await page.locator('[data-map-zone-button="19"]').click();
   assert.equal(await page.locator("#mapSearch").inputValue(),"Eevee");
   assert.equal(new URL(page.url()).hash,"#wild-zone-19");
   await page.evaluate(()=>{Object.defineProperty(navigator,"share",{configurable:true,value:async data=>{window.__at326SharedUrl=data.url;}});document.getElementById("atlasArticleShare").click();});
   await page.waitForFunction(()=>window.__at326SharedUrl===location.href);
   await page.locator('[data-map-pin="19"]').click();
   assert.equal(await page.locator("#mapSearch").inputValue(),"Eevee");
   await page.goto(base+"/maps.html?source=atlas#map-key",{waitUntil:"load"});
   await page.locator("#mapSearch").fill("not-a-real-at326-species");assert.equal(new URL(page.url()).hash,"#map-key");
   // The new rotating-Alpha disclosure must not steal the old item-record anchor.
   await page.goto(base+"/sector-maps.html#wildzone-20",{waitUntil:"load"});
   await page.locator("#wildzone-20 details.zone-records[open]").waitFor();
   assert.equal(await page.locator("#wildzone-20 details.wz-alpha-pool[open]").count(),0);
   await page.locator("#wildzone-20 details.zone-records > summary").screenshot({path:output+"/at326-zone20-records-"+kind+".png"});
   await page.goto(base+"/sector-maps.html#map-lead-z20-01");
   await page.locator("#wildzone-20 details.approx-clue-panel[open]").waitFor();
   assert.equal(await page.locator("#map-lead-z20-01").isVisible(),true);
   await page.goto(base+"/sector-maps.html#sector-vert-sector-1");
   await page.locator("#sector-vert-sector-1 details.sector-clues[open]").waitFor();
   await page.goto(base+"/sector-maps.html#wildzone-12",{waitUntil:"load"});await check(12,"sector",true);
   await page.goto(base+"/atlas-explorer.html?place="+explorerZoneId(1),{waitUntil:"networkidle"});await check(1,"explorer",true);
   await page.locator('#aeFilters button[data-kind="zone"]').click();
   for(let n=2;n<=20;n++){await page.locator('#aeResults [data-record-id="'+explorerZoneId(n)+'"]').click();await check(n,"explorer",n===20);}
   assert.deepEqual(errors,[]);await page.close();
 }
 console.log("PASS AT-321: 20 Explorer selections, original PNG pairs, full-size links, 15/67 Zone 20 lists, standalone/map directory/main views on desktop and phone.");
}finally{if(browser)await browser.close();server.kill("SIGTERM");}
