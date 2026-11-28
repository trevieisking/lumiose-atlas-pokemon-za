/* AT-321: isolated phone/desktop proof for the four Wild Zone surfaces. */
import assert from "node:assert/strict";
import fs from "node:fs";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
import {wildZoneRecords,wildZoneFullPhotoPath} from "../wild-zone-fieldbook.mjs";
const base="http://127.0.0.1:18766",output="test-artifacts/atlas-explorer";
// Explorer stores zero-padded IDs; the other map surfaces use numeric fragments.
const explorerZoneId=n=>"wz-"+String(n).padStart(2,"0");
fs.mkdirSync(output,{recursive:true});
const server=spawn("python3",["-m","http.server","18766","--bind","127.0.0.1"],{stdio:"ignore"});
let browser;
try{
 let available=false;for(let i=0;i<40;i++){try{if((await fetch(base+"/maps.html")).ok){available=true;break;}}catch{}await pause(150);}
 assert.ok(available);browser=await chromium.launch({...(process.env.ATLAS_CHROME_EXECUTABLE?{executablePath:process.env.ATLAS_CHROME_EXECUTABLE}:{channel:"chrome"}),headless:true,args:["--no-sandbox"]});
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
       const full=wildZoneFullPhotoPath(z.photos[i].path);
       assert.equal(await img.locator("..").getAttribute("href"),full);
       if(full!==z.photos[i].path){const dimensions=await page.evaluate(async url=>{const original=new Image();original.src=url;await original.decode();return [original.naturalWidth,original.naturalHeight];},full);assert.deepEqual(dimensions,[4000,2252],"Exact full-resolution owner original decodes "+full);}
       await img.scrollIntoViewIfNeeded();await img.evaluate(el=>el.decode());
       assert.equal(await img.evaluate(el=>el.naturalWidth),1536);
     }
     assert.equal(await panel.locator('ul[aria-label="Preserved species records"] li').count(),z.species.length);
     assert.equal(await panel.locator('[data-wz-current-evidence="'+n+'"]').getAttribute('href'),'atlas-explorer.html?area='+explorerZoneId(n));
     assert.match(await panel.locator('.wz-roster-status').textContent(),n===20?/not comprehensive/:/incomplete, and some entries are disputed/);
     if(n===20){await panel.locator("summary").click();assert.equal(await panel.locator(".wz-alpha-pool li").count(),67);}
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
     assert.ok(overflow<=1,screen+" "+kind+" overflow "+overflow);
     if(shot){await panel.locator(".wz-photo-pair").screenshot({path:output+"/at321-"+screen+"-wz"+n+"-"+kind+"-photos.png"});await panel.screenshot({path:output+"/at321-"+screen+"-wz"+n+"-"+kind+"-roster.png"});}
   }
   await page.goto(base+"/index.html#maps",{waitUntil:"load"});
   // A1-03: exercise every zone on the original home map, not just five samples.
   for(const {number:n} of wildZoneRecords){await page.locator('#mapZones [data-select-zone="'+n+'"]').click();await check(n,"main",[1,15,17,20].includes(n));}
   // The saved WZ17 screenshot previously intersected the sticky header. Prove
   // that normal centered scrolling exposes the actual images and their links.
   await page.locator('#mapZones [data-select-zone="17"]').click();
   await check(17,"main");
   for(const [index,img] of (await page.locator('[data-wz-fieldbook="17"]:visible .wz-photo-pair img').all()).entries()){
     await img.evaluate(async el=>{el.scrollIntoView({block:"center",inline:"nearest",behavior:"instant"});await el.decode();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
     const visibility=await img.evaluate(el=>{const r=el.getBoundingClientRect();const points=[[r.left+r.width/2,r.top+Math.min(8,r.height/4)],[r.left+r.width/2,r.top+r.height/2],[r.left+r.width/2,r.bottom-Math.min(8,r.height/4)]];return {top:r.top,bottom:r.bottom,viewport:innerHeight,uncovered:points.every(([x,y])=>{const hit=document.elementFromPoint(x,y);return hit===el||el.contains(hit);})};});
     assert.ok(visibility.top>=0&&visibility.bottom<=visibility.viewport+1&&visibility.uncovered,"Centered WZ17 image must be fully reachable, not hidden by sticky navigation: "+kind+" "+JSON.stringify(visibility));
     await img.screenshot({path:output+"/at348-wz17-main-unobscured-"+kind+"-"+index+".png"});
   }
   // AT-326: share links track the selection without resetting filters on a click.
   await page.goto(base+"/maps.html?source=atlas#wild-zone-1",{waitUntil:"load"});await check(1,"map",true);
   await page.locator('[data-area-panel]').waitFor({state:"attached"});
   assert.equal(new URL(page.url()).search,"?source=atlas","Opening the original fragment does not rewrite its query");
   const historyBeforeZoneChange=await page.evaluate(()=>history.length);
   await page.locator('#zone-directory [data-map-zone-button="20"]').click();await check(20,"map",true);
   // The legacy fragment and shared area identify the same selection. Shared
   // synchronization replaces the fragment entry rather than pushing another.
   assert.equal(new URL(page.url()).hash,"#wild-zone-20");assert.equal(new URL(page.url()).search,"?source=atlas&area=wz-20");
   assert.equal(await page.evaluate(()=>history.length),historyBeforeZoneChange+1,"One zone change creates one history entry");
   await page.evaluate(()=>history.back());await page.waitForURL("**/maps.html?source=atlas#wild-zone-1");
   await page.locator('[data-wz-fieldbook="1"]:visible').waitFor();
   assert.equal(new URL(page.url()).searchParams.has("area"),false,"Back restores the original legacy URL in one step");
   await page.evaluate(()=>history.forward());await page.waitForURL("**/maps.html?source=atlas&area=wz-20#wild-zone-20");
   await page.locator('[data-wz-fieldbook="20"]:visible').waitFor();
   await page.reload({waitUntil:"load"});await page.locator('[data-wz-fieldbook="20"]:visible').waitFor();
   assert.equal(new URL(page.url()).search,"?source=atlas&area=wz-20");
   assert.equal(new URL(page.url()).hash,"#wild-zone-20");
   await page.locator("#mapSearch").fill("not-a-real-at326-species");
   // Same-document navigation notifications can reach the Playwright client
   // after the input action completes. Verify the actual browser state and
   // then wait for the client's URL notification; do not relax either assertion.
   await page.waitForFunction(()=>location.hash===""&&location.search==="?source=atlas"&&
     document.getElementById("mapZoomImage").dataset.selectedZone===""&&
     [...document.querySelectorAll("[data-map-zone-detail]")].every(card=>card.hidden));
   await page.waitForURL(url=>url.hash===""&&url.search==="?source=atlas");
   assert.equal(new URL(page.url()).searchParams.has("area"),false,"Clearing a filtered selection removes the shared area parameter");
   assert.equal(await page.locator("[data-wz-fieldbook]:visible").count(),0);
   await page.locator("#mapSearch").fill("Eevee");assert.equal(await page.locator('[data-map-zone-button="19"]').isVisible(),true);
   await page.locator('[data-map-zone-button="19"]').click();
   assert.equal(await page.locator("#mapSearch").inputValue(),"Eevee");
   await page.waitForURL(url=>url.hash==="#wild-zone-19"&&url.search==="?source=atlas&area=wz-19");
   await page.evaluate(()=>{Object.defineProperty(navigator,"share",{configurable:true,value:async data=>{window.__at326SharedUrl=data.url;}});document.getElementById("atlasArticleShare").click();});
   await page.waitForFunction(()=>window.__at326SharedUrl===location.href);
   assert.equal(await page.evaluate(()=>window.__at326SharedUrl),base+"/maps.html?source=atlas&area=wz-19#wild-zone-19","Share keeps the unrelated query, shared area and original fragment together");
   const historyAtZone19=await page.evaluate(()=>history.length);
   await page.locator('[data-map-pin="19"]').click();
   assert.equal(await page.locator("#mapSearch").inputValue(),"Eevee");
   assert.equal(await page.evaluate(()=>history.length),historyAtZone19,"Reselecting the same zone does not add a duplicate history entry");
   assert.equal(new URL(page.url()).search,"?source=atlas&area=wz-19");
   await page.goto(base+"/maps.html?source=atlas#map-key",{waitUntil:"load"});
   await page.locator("#mapSearch").fill("not-a-real-at326-species");
   assert.equal(await page.evaluate(()=>location.hash),"#map-key");
   assert.equal(new URL(page.url()).search,"?source=atlas","Unrelated anchors do not create a shared area selection");
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
   for(let n=2;n<=20;n++){await page.locator('#aeResults [data-record-id="'+explorerZoneId(n)+'"]').click();await check(n,"explorer",[15,17,20].includes(n));}
   // A1-03: the two static mirrors must also render/decode all 20 photo pairs.
   await page.goto(base+"/maps.html#wild-zone-1",{waitUntil:"load"});
   await check(1,"map");
   for(const {number:n} of wildZoneRecords.slice(1)){
     await page.locator('#zone-directory [data-map-zone-button="'+n+'"]').click();
     await check(n,"map",[15,17].includes(n));
   }
   for(const {number:n} of wildZoneRecords){
     await page.goto(base+"/sector-maps.html#wildzone-"+n,{waitUntil:"load"});
     await check(n,"sector",[15,17].includes(n));
   }
   assert.deepEqual(errors,[]);await page.close();
 }
 console.log("PASS AT-348 A1-03: all 20 Wild Zone pairs on each of four map surfaces at phone and desktop widths; exact preview/full-size destinations and decoded originals, centered WZ17 image reachability, original encounter lists and history.");
}finally{if(browser)await browser.close();server.kill("SIGTERM");}
