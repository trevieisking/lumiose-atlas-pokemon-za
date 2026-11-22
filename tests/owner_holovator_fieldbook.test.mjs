import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const catalog=JSON.parse(read("MAPS_OWNER_HOLOVATOR_21_SURVEY_CATALOG_2026-11-22.json"));
const page=read("holovator-map.html"),js=read("holovator-map.js"),css=read("holovator-map.css");
const oldCity=read("maps.html"),oldSectors=read("sector-maps.html");
assert.equal(catalog.plan_id,"ATLAS-MAPS-2026-11-21-V1");
assert.equal(catalog.locations.length,21,"All owner-surveyed lift entries, not a purported 23 category devices");
assert.equal(new Set(catalog.locations.map(r=>r.id)).size,21,"Unique survey IDs only");
assert.equal(catalog.counts.physically_distinct_23_category_ids_reconciled,0,"Don't claim external device-category mapping");
const counts={};let published=0,pending=0,photoCount=0;const allImagePaths=new Set();
for(const r of catalog.locations){
 assert.ok(["Vert","Bleu","Magenta","Rouge","Jaune"].includes(r.district),r.id+" district");
 assert.ok(typeof r.title==="string"&&r.title.length>4,r.id+" title");
 assert.ok(typeof r.directions==="string"&&r.directions.length>35,r.id+" practical directions");
 assert.equal(r.map.source_image,"maps/lumiose-game-map.jpg",r.id+" base asset");
 assert.equal(r.map.research_only,true,r.id+" exact coordinate must not be claimed");
 assert.match(r.map.precision,/APPROXIMATE/,r.id+" accuracy label");
 const xy=r.map.native_xy_approx;
 assert.ok(Array.isArray(xy)&&xy.length===2&&xy.every(x=>Number.isFinite(x)&&x>=0&&x<=1920),r.id+" bounded 1920px alignment");
 if(r.photo_status==="committed_main"){
   published++;
   assert.equal(r.photos.length,5,r.id+" grounded standard image set");
   for(const p of r.photos){
     assert.ok(p.path.startsWith("assets/atlas/holovators/")&&p.path.endsWith(".jpg"),p.path);
     assert.ok(!allImagePaths.has(p.path),"No double-counted photograph "+p.path);
     allImagePaths.add(p.path);
     const f=new URL("../"+p.path,import.meta.url);
     assert.ok(existsSync(f),"No missing or broken image "+p.path);
     assert.ok(statSync(f).size>10000,"Reject empty placeholder "+p.path);
     const sig=readFileSync(f).subarray(0,3);
     assert.deepEqual([...sig],[0xff,0xd8,0xff],"Actual JPEG bytes required "+p.path);
     assert.match(p.sha256,/^[a-f0-9]{64}$/,p.path+" hash");
     photoCount++;
   }
 }else{
   pending++;
   assert.equal(r.photos.length,0,"Never insert broken image references for pending photos");
 }
 counts[r.district]=(counts[r.district]||0)+1;
}
assert.deepEqual([published,pending,photoCount],[17,4,85],"17 catalogued galleries = 85 photographs; Jaune 11 already main makes 90");
assert.equal(catalog.counts.photo_assets_committed_main,90);
assert.equal(catalog.counts.final_11_jpgs_in_local_zip_only,11);
assert.equal(catalog.counts.source_photographs_for_two_older_surveys_not_in_repo,10);
for(const landmark of ["Café Cyclone","Wild Zone 6","My Favorite Holovator","Jaune Sector 11","Sommi","Académie Étoile"]){
 assert.ok(catalog.locations.some(r=>r.title.includes(landmark)||r.directions.includes(landmark)),landmark+" missing from fieldbook");
}
for(const id of ["holMapStage","holMapScroll","holList","holDetails","holSearch","holPinLayer","holZoomIn","holZoomOut","holReset"]){
 assert.ok(page.includes('id="'+id+'"'),"Required fieldbook control "+id);
}
assert.match(page,/href="index.html#walkthrough"/);
assert.match(page,/Complete guide menu/);
assert.match(page,/maps\/lumiose-game-map.jpg/);
assert.match(page,/Holovators/i);
assert.match(page,/Hyperspace event icons/i);
assert.match(js,/fetch\(SOURCE/);
assert.match(js,/image\.loading="lazy"/);
assert.match(js,/addEventListener\("click"/);
assert.doesNotMatch(js,/localStorage|supabase|setItem\(|postMessage\(/i);
assert.match(css,/\@media\(max-width:550px\)/);
for(const html of [oldCity,oldSectors]){
 assert.ok(html.includes('href="holovator-map.html"'),"Old map must link to dedicated fieldbook");
 assert.equal(html.split('href="holovator-map.html"').length-1,1,"Only one additive link per existing map");
}
assert.equal((oldCity.match(/data-map-pin="\d+"/g)||[]).length,20,"Original twenty Wild Zone pins preserved");
assert.equal((oldSectors.match(/class="sector-card"/g)||[]).length,48,"Original 48 city sectors preserved");
assert.equal((oldSectors.match(/class="wildzone-card"/g)||[]).length,20,"Original 20 sector-directory Wild Zones preserved");
assert.equal((oldSectors.match(/class="zone-item-lead"/g)||[]).length,264,"Original item entries preserved");
assert.match(page,/Ladders, scaffolding and roof routes/,"Ladder/scaffold policy must be visible without speculative pins");\nassert.match(page,/does <strong>not<\\/strong> invent precise pins/,"No invented ladder dots");\nconsole.log("PASS: 21 owner-survey locations, 85 referenced genuine JPGs, 90 hosted total, 11 ZIP-only, 10 older pending, original 20/48/264 assets preserved.");
