import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("sector-maps.html"),css=read("sector-maps.css"),js=read("sector-maps.js");
const source=read("src/sections/walkthrough.html"),map=read("maps.html");
const esc=x=>String(x).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const raw=[...source.matchAll(/<button[^>]*class="item-map-pin"[^>]*>/g)].map(m=>m[0]);
assert.equal(raw.length,155,"Source primary marker count changed");
const unique=new Map();
let duplicated=0;
for(const tag of raw){
 const id=tag.match(/data-map-item="(\d+)"/)?.[1];
 const title=tag.match(/title="([^"]+)"/)?.[1];
 const xy=tag.match(/style="left:([\d.]+)%;top:([\d.]+)%"/);
 const z=title?.match(/near Wild Zone (\d+)/)?.[1];
 assert.ok(id&&title&&xy&&z,"Each source map marker needs ID, title, position and zone");
 const entry={id,title,zone:Number(z),x:Number(xy[1]),y:Number(xy[2])};
 if(unique.has(id)){
  duplicated++;
  assert.deepEqual(entry,unique.get(id),"Duplicate owner source marker must match on zone, title and original coordinates");
 }else unique.set(id,entry);
}
assert.equal(unique.size,146);
assert.equal(duplicated,9);
const city=[...map.matchAll(/data-map-pin="(\d+)" data-pin-x="([\d.]+)" data-pin-y="([\d.]+)"/g)].map(m=>[Number(m[1]),Number(m[2]),Number(m[3])]);
assert.equal(city.length,20);
const byZone=new Map(Array.from({length:20},(_,i)=>[i+1,[...unique.values()].filter(x=>x.zone===i+1)]));
const cityByZone=new Map(city.map(([n,x,y])=>[n,{x,y}]));
const pos=v=>Math.max(0,Math.min(100,(2.5*v-50)/1.5));
const local=(v,cent)=>Math.max(0,Math.min(100,(2.5*v-1.5*Number(pos(cent).toFixed(2))))).toFixed(2);
let total=0;
for(const [n,arr] of byZone){
 assert.ok(arr.length>0,"Every Wild Zone in preserved source has approximate markers");
 assert.ok(html.includes('data-approx-zone="'+n+'"'),"Missing zone-specific saved map marker detail "+n);
 assert.ok(html.includes("Show "+arr.length+" numbered approximate item markers saved for this zone"));
 for(let i=0;i<arr.length;i++){
  total++;
  const p=arr[i],num=String(i+1).padStart(2,"0");
  const x=local(p.x,cityByZone.get(n).x),y=local(p.y,cityByZone.get(n).y);
  const id="map-lead-z"+n+"-"+num;
  assert.ok(html.includes('id="'+id+'" class="approx-map-record"'),"Missing numbered written clue "+id);
  assert.ok(html.includes('href="#'+id+'" data-approx-pin="'+p.id+'" data-city-x="'+p.x+'" data-city-y="'+p.y+'" style="left:'+x+'%;top:'+y+'%"'),"Incorrect original coordinate/projection for "+id);
  assert.ok(html.includes("<strong>"+esc(p.title)+"</strong>"),"Original owner marker title changed "+id);
  assert.ok(html.includes("Saved map marker "+p.id+" · city overview approximately "+p.x+"% across, "+p.y+"% down"),"No source-ID and provenance text "+id);
 }
}
assert.equal(total,146);
assert.equal((html.match(/class="approx-item-dot"/g)||[]).length,146);
assert.equal((html.match(/class="approx-map-record"/g)||[]).length,146);
assert.equal((html.match(/class="approx-clue-panel"/g)||[]).length,20);
assert.match(html,/146 approximate city-map leads preserved in the original walkthrough/);
assert.match(html,/not<\/strong> verify the exact pickup, height or item-ledger match/);
assert.match(html,/separate from Item Atlas ID numbers/);
assert.doesNotMatch(html,/data-confirmed-pin|data-exact-item-pin|type="checkbox"|service_role_key|github_pat_|sk-proj-/);
assert.match(css, /\.approx-item-dot/);
assert.match(css, /\.approx-map-record:target/);
assert.match(css, /@media\(max-width:700px\)/);
assert.doesNotMatch(js,/localStorage\.(setItem|removeItem|clear)|XMLHttpRequest|\bfetch\s*\(/);
assert.match(js,/^\s*const lead=hash\.match\(\/\^map-lead-z/m);

// Deep-link opening should reveal the correct zone, its approximate panel and written clue.
const events={},named={};const mk=dataset=>{
 const listeners={},classes=new Set(),children={};
 return {dataset,hidden:false,value:"",textContent:"",children,listeners,
 setAttribute(name,val){this[name]=val},addEventListener(name,cb){listeners[name]=cb},
 querySelector(sel){return children[sel]||null},querySelectorAll(sel){return children[sel]||[]},
 scrollIntoView(){this.scrolled=true},
 classList:{toggle(name,yes){if(yes)classes.add(name);else classes.delete(name)},contains(name){return classes.has(name)}}
 };
};
const sectors=Array.from({length:48},(_,i)=>mk({district:"Vert",search:"sector "+i}));
const zones=city.map(([n])=>mk({district:n===20?"Centrico":"Vert",zone:String(n),search:"wild zone "+n}));
const groups=[mk({districtGroup:"Vert"})];groups[0].children["[data-sector-card]"]=sectors;
const loose=[mk({looseGroup:"Vert"})];loose[0].children[".unassigned-screw-lead"]=[];
const markers=city.map(([n])=>mk({zoneMarker:String(n)}));
const buttons=["All","Vert","Bleu","Magenta","Rouge","Jaune"].map(d=>mk({atlasDistrict:d}));
const search=mk({}),status=mk({}),empty=mk({});
named.mapAtlasSearch=search;named.mapAtlasCount=status;named.mapAtlasEmpty=empty;
zones.forEach((z,i)=>{named["wildzone-"+(i+1)]=z;z.children.details=mk({});z.children[".approx-clue-panel"]=mk({});});
const clue=mk({});named["map-lead-z9-20"]=clue;
const window={addEventListener(name,cb){events[name]=cb}};
let hash="#map-lead-z9-20",storageReads=0,writes=0;
const localStorage={getItem(){storageReads++;return JSON.stringify({pickup:{},screw:{},sideCheck:{}})},setItem(){writes++;throw Error("Should be read-only")}};
const document={
 querySelectorAll(q){return ({
 "[data-sector-card]":sectors,"[data-zone-card]":zones,"[data-district-group]":groups,
 "[data-loose-group]":loose,"[data-zone-marker]":markers,"[data-atlas-district]":buttons,
 "[data-progress-item],[data-progress-screw]":[]})[q]||[]},
 getElementById(id){return named[id]||null}
};
runInNewContext(js,{window,document,location:{get hash(){return hash}},localStorage,requestAnimationFrame:fn=>fn()});
assert.equal(zones[8].children[".approx-clue-panel"].open,true);
assert.equal(clue.scrolled,true);
assert.equal(writes,0);
assert.equal(storageReads,1);
console.log("PASS: 146 deduplicated original approximate city map points + 20 fully numbered overlays, exact owner source IDs/titles/coordinates, no invented confirmed dots, read-only deep links.");
