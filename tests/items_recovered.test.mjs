import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const load=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=load("items.html"),src=load("src/sections/items.html"),dataSrc=load("items-data.js"),css=load("items.css"),js=load("items.js"),template=load("src/template.html");
const ctx={window:{}};
runInNewContext(dataSrc,ctx);
const data=JSON.parse(JSON.stringify(ctx.window.ATLAS_ITEM_EVIDENCE));
assert.equal(data.zones.length,20);
assert.equal(data.screws.length,100);
assert.equal(data.sectors.length,48);
assert.equal(data.metrics.zoneItemRecords,264);
assert.equal(data.metrics.screwsWithSector,51);
assert.equal(data.metrics.confirmedItemPins,0);
assert.equal(data.metrics.confirmedScrewPins,0);
const sourceZones=[...src.matchAll(/<article class="item-zone">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
assert.equal(sourceZones.length,20);
let count=0;
for(let i=0;i<20;i++){
 const originals=[...sourceZones[i].matchAll(/<label class="pickup">([\s\S]*?)<\/label>/g)].map(x=>x[1]);
 const rows=data.zones[i].items;
 assert.equal(rows.length,originals.length,"Zone "+(i+1)+" source count changed");
 for(let j=0;j<rows.length;j++){
  const r=rows[j],t=originals[j],decode=v=>String(v).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&apos;/g,"'");
  const orig={
   id:t.match(/data-pickup="([^"]+)"/)?.[1],
   name:decode(t.match(/<b>([^<]+)<\/b>/)?.[1]||""),
   image:t.match(/<img[^>]+src="([^"]+)"/)?.[1],
   hint:decode(t.match(/<small>([^<]+)<\/small>/)?.[1]||"")
  };
  assert.deepEqual([r.id,r.name,r.image,r.hint],[orig.id,orig.name,orig.image,orig.hint],"Changed the owner's Zone "+(i+1)+" item "+j);
  assert.equal(r.pin,null,"Do not invent exact cartographic coordinates");
  assert.equal(r.number,String(i+1).padStart(2,"0")+"-"+String(j+1).padStart(2,"0"));
  assert.ok(existsSync(new URL("../"+r.image,import.meta.url)),"Source item icon missing: "+r.image);
  assert.ok(html.includes('id="item-'+r.id+'"'),"Missing static item "+r.id);
  count++;
 }
}
assert.equal(count,264);
const kinds=Object.fromEntries(["zone_only","hidden_outcome","reward","sector_area","landmark"].map(k=>[k,data.zones.flatMap(z=>z.items).filter(x=>x.kind===k).length]));
assert.deepEqual(kinds,{zone_only:154,hidden_outcome:56,reward:10,sector_area:23,landmark:21});
assert.equal(data.zones[19].items.filter(x=>x.kind==="hidden_outcome").length,56,"Zone 20 rolls are not fixed locations");
assert.equal((html.match(/data-item-record(?:\s|>)/g)||[]).length,264);
assert.equal((html.match(/data-item-zone-card="/g)||[]).length,20);
assert.equal((html.match(/data-screw-record(?:\s|>)/g)||[]).length,100);
assert.equal((html.match(/data-sector-card="/g)||[]).length,48);
const sourceScrews=[...src.matchAll(/<label class="screw-row">([\s\S]*?)<\/label>/g)].map(x=>x[1]);
assert.equal(sourceScrews.length,100);
for(let i=0;i<100;i++){
 const r=data.screws[i],s=sourceScrews[i];
 assert.equal(r.number,i+1);
 assert.equal(r.district,s.match(/<b>([^<]+)<\/b>/)?.[1]);
 assert.equal(r.hint,s.match(/<small>([^<]*)<\/small>/)?.[1]);
 assert.equal(r.pin,null);
 assert.ok(html.includes('id="item-screw-'+(i+1)+'"'));
}
const totals={Vert:9,Bleu:10,Magenta:9,Rouge:8,Jaune:12};
for(const [district,n] of Object.entries(totals)){
 const sectors=data.sectors.filter(s=>s.district===district);
 assert.equal(sectors.length,n);
 assert.deepEqual(sectors.map(s=>s.number),Array.from({length:n},(_,i)=>i+1));
 assert.ok(sectors.every(s=>s.mapAsset===null&&s.confirmedPins.length===0));
}
assert.equal(data.sectors.length,48);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const old=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&old);
assert.equal(nav.replace(' aria-current="page"',"").trim(),old.trim(),"25 links and order must match saved guide");
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.ok(nav.includes('href="index.html#items" aria-current="page"'));
for(const phrase of ["Confirmed item coordinates in this exported source: 0","not 56 fixed item points","not an inaccurate set of 48 pretend maps","does not create a second progress system","0.", "Back to walkthrough"]){
 assert.ok(html.includes(phrase),"Missing provenance or safe progress notice: "+phrase);
}
assert.ok(!html.includes('data-pickup="'),"A second set of original progress keys must not be created");
for(const f of ["atlas-logo.png","favicon.png","recovered-articles.js","recovered-articles.css","items.js","items.css","items-data.js","maps.html","shops.html","index.html","feedback.html","sector-maps.html"])assert.ok(existsSync(new URL("../"+f,import.meta.url)),"Missing site dependency "+f);
assert.match(css,/@media\(max-width:680px\)/);
assert.match(css,/@media\(max-width:420px\)/);
assert.doesNotMatch(html+js+dataSrc,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(js+dataSrc,/\bfetch\s*\(|sessionStorage|XMLHttpRequest/);
assert.match(js,/lumiose-atlas-reconstruction-v1/,"Use the existing main guide progress key");
assert.match(js,/localStorage\.getItem\(PROGRESS_KEY\)/);
assert.match(js,/localStorage\.setItem\(PROGRESS_KEY/);
assert.ok(!html.includes('data-pickup="'),"Original inputs remain owned by the main guide");
assert.equal((html.match(/data-atlas-pickup="/g)||[]).length,264);
assert.equal((html.match(/data-atlas-screw="/g)||[]).length,100);
// Simulate filtering without a browser or network.
function elem(dataSet={}){
 return {dataset:dataSet,hidden:false,value:"",events:{},textContent:"",attrs:{},
  addEventListener(ev,fn){this.events[ev]=fn},
  setAttribute(key,value){this.attrs[key]=value}};
}
const zones=data.zones.map(z=>{
 const card=elem({itemZoneCard:String(z.number)});
 card.children=z.items.map(r=>elem({kind:r.kind,recordSearch:(r.name+" "+r.hint+" "+(r.sector||"")).toLocaleLowerCase()}));
 card.querySelectorAll=q=>q==="[data-item-record]"?card.children:[];
 return card;
});
const records=zones.flatMap(z=>z.children);
const screwRows=data.screws.map(s=>elem({district:s.district,screwSearch:(s.district+" "+s.hint+" "+(s.sector||"")).toLocaleLowerCase()}));
const districtBtns=["All","Vert","Bleu","Magenta","Rouge","Jaune"].map(x=>elem({screwDistrict:x}));
const ids={itemLedgerSearch:elem(),itemLedgerZone:elem(),itemLedgerKind:elem(),itemLedgerStatus:elem(),itemLedgerEmpty:elem(),
 screwSearch:elem(),screwStatus:elem(),screwEmpty:elem()};
ids.itemLedgerZone.value="all";ids.itemLedgerKind.value="all";
runInNewContext(js,{window:ctx.window,document:{
 querySelectorAll:q=>({
  "[data-item-record]":records,"[data-item-zone-card]":zones,
  "[data-screw-record]":screwRows,"[data-screw-district]":districtBtns
 })[q]||[],
 getElementById:id=>ids[id]||null
}});
assert.match(ids.itemLedgerStatus.textContent,/Showing 264 of 264/);
assert.match(ids.screwStatus.textContent,/Showing 100 of 100/);
ids.itemLedgerZone.value="20";ids.itemLedgerZone.events.change();
ids.itemLedgerKind.value="hidden_outcome";ids.itemLedgerKind.events.change();
assert.match(ids.itemLedgerStatus.textContent,/Showing 56 of 264/);
ids.itemLedgerZone.value="all";ids.itemLedgerKind.value="all";ids.itemLedgerSearch.value="TM027";ids.itemLedgerSearch.events.input();
assert.match(ids.itemLedgerStatus.textContent,/Showing 1 of 264/);
ids.itemLedgerSearch.value="nosuchitem-xyz";ids.itemLedgerSearch.events.input();
assert.match(ids.itemLedgerStatus.textContent,/Showing 0 of 264/);
assert.equal(ids.itemLedgerEmpty.hidden,false);
districtBtns[2].events.click();
assert.match(ids.screwStatus.textContent,/Showing 18 of 100/);
ids.screwSearch.value="not-a-real-scaffold";ids.screwSearch.events.input();
assert.match(ids.screwStatus.textContent,/Showing 0 of 100/);
assert.equal(ids.screwEmpty.hidden,false);
console.log("PASS: 264 PDF items, 56 hidden outcomes not fixed pins, 100 original screws, 48 verified sector names, 25-link menu and read-only filters.");
