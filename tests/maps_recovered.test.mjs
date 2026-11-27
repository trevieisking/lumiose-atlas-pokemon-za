import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("maps.html"),css=read("maps.css"),script=read("maps.js");
const savedMap=read("src/sections/maps.html"),savedItems=read("src/sections/items.html"),savedAlphas=read("src/sections/alphas.html"),template=read("src/template.html");
const mapPins=[...savedMap.matchAll(/<button aria-label="Select Wild Zone (\d+), ([^"]+)" class="atlas-pin" data-select-zone="\d+" style="left:([\d.]+)%;top:([\d.]+)%"/g)];
assert.equal(mapPins.length,20,"Saved map must contain 20 source pins");
const restoredPins=[...html.matchAll(/data-map-pin="(\d+)" data-pin-x="([\d.]+)" data-pin-y="([\d.]+)"/g)];
assert.equal(restoredPins.length,20,"Map must show 20 selectable pins");
for(let i=0;i<20;i++){
 assert.equal(Number(restoredPins[i][1]),Number(mapPins[i][1]),"Zone IDs changed");
 assert.equal(restoredPins[i][2],mapPins[i][3],"Pin X was not copied from saved source");
 assert.equal(restoredPins[i][3],mapPins[i][4],"Pin Y was not copied from saved source");
}
const originalDirectory=[...savedMap.matchAll(/<button class="atlas-zone-row" data-select-zone="(\d+)"[^>]*>[\s\S]*?<b>Wild Zone \d+ · ([^<]+)<\/b><small>Opens at Mission (\d+) · ([^<]+)<\/small>/g)];
assert.equal(originalDirectory.length,20);
const dirButtons=[...html.matchAll(/<button class="map-zone-directory-row" type="button" data-map-zone-button="(\d+)" data-district="([^"]+)" data-zone-search="([^"]+)"/g)];
assert.equal(dirButtons.length,20);
for(let i=0;i<20;i++){
 const original=originalDirectory[i],newButton=dirButtons[i];
 assert.equal(Number(newButton[1]),Number(original[1]));
 assert.equal(newButton[2],original[2]);
 assert.ok(newButton[3].includes("mission "+original[3]));
 assert.ok(html.includes("Opens at Mission "+original[3]+" · "+original[4]),"Original zone intro changed "+original[1]);
}
const sourceItems=[...savedItems.matchAll(/<article class="item-zone">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
const sourceAlpha=[...savedAlphas.matchAll(/<article class="alpha-card">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
assert.equal(sourceItems.length,20);assert.equal(sourceAlpha.length,20);
assert.equal((html.match(/data-map-zone-detail="/g)||[]).length,20);
let itemTotal=0,alphaTotal=0;
const escape=v=>String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const decode=v=>String(v).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#39;/g,"'");
for(let i=0;i<20;i++){
 const zone=i+1;
 const pickups=[...sourceItems[i].matchAll(/<label class="pickup">([\s\S]*?)<\/label>/g)].map(x=>({
  name:decode(x[1].match(/<b>([^<]*)<\/b>/)?.[1]||""),
  clue:decode(x[1].match(/<small>([^<]*)<\/small>/)?.[1]||"")}));
 itemTotal+=pickups.length;
 for(let j=0;j<pickups.length;j++){
  const target='data-map-pickup="'+zone+'-'+j+'"><strong>'+escape(pickups[j].name)+'</strong>';
  assert.ok(html.includes(target),"Missing original pickup "+zone+"-"+j);
  if(!pickups[j].clue.includes("check the exact map pin")){
    assert.ok(html.includes(escape(pickups[j].clue)),"Dropped recorded pickup clue "+zone+"-"+j);
  }
 }
 const a=sourceAlpha[i];
 const first=a.slice(0,a.indexOf('<details class="alpha-pool">')>=0?a.indexOf('<details class="alpha-pool">'):a.length);
 const alphas=[...first.matchAll(/<li><button data-dex-name="([^"]+)"[^>]*>[^<]*<\/button><small>([^<]*)<\/small><\/li>/g)];
 alphaTotal+=alphas.length;
 for(const row of alphas){
  // The linked Alpha guide has verified requirements; the archived map list retains the recorded range.
  const level = zone===15 && row[1]==="Gourgeist" ? row[2].replace(/ · After survey$/, "") :
    zone===17 && row[1]==="Pyroar" ? row[2].replace(/ · Male · (Day|Night)$/, "") : row[2];
  assert.ok(html.includes('<strong>'+escape(decode(row[1]))+'</strong><span>'+escape(decode(level))+'</span>'),"Original Alpha target missing "+row[1]);
 }
 const image=sourceAlpha[i].match(/<img[^>]*src="(dex-art\/[^"]+)"/)?.[1];
 assert.ok(image&&existsSync(new URL("../"+image,import.meta.url)),"Saved Alpha portrait unavailable");
 assert.ok(html.includes('src="'+image+'"'),"Source portrait missing on zone "+zone);
}
assert.equal(itemTotal,264,"Saved source item count changed");
assert.equal((html.match(/data-map-pickup="/g)||[]).length,264);
assert.equal(alphaTotal,38,"Saved Alpha fixed targets changed");
const screwRows=[...savedItems.matchAll(/<label class="screw-row">([\s\S]*?)<\/label>/g)].map(x=>x[1]);
assert.equal(screwRows.length,100);
let screwMentions=0;
for(let n=1;n<=20;n++){
 for(const source of screwRows){
  const hint=source.match(/<small>([^<]*)<\/small>/)?.[1]||"";
  const id=source.match(/data-screw="(\d+)"/)?.[1]||"";
  if(new RegExp("Wild Zone "+n+"(?!\\d)","i").test(hint)){
   screwMentions++;
   assert.ok(html.includes('data-screw-note="'+id+'"'),"Missing nearby source screw "+id);
   assert.ok(html.includes(escape(decode(hint))),"Altered source screw clue "+id);
  }
 }
}
assert.equal(screwMentions,25);
assert.equal((html.match(/data-screw-note="/g)||[]).length,25);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const savedNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&savedNav);
assert.equal(nav.replace(' aria-current="page"',"").trim(),savedNav.trim(),"Menu parity with original 25-link guide");
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.ok(nav.includes('href="index.html#maps" aria-current="page"'));
for(const path of ["maps/lumiose-game-map.jpg","index.html","feedback.html","recovered-articles.css","recovered-articles.js","maps.css","maps.js","alphas.html","journey.html","sector-maps.html","hyperspace-maps.html"])assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing local page or asset "+path);
for(const term of ["48 numbered sector close-ups","nine recurring Mega Dimension map layouts","not contained in this four-page PDF","not a new high-resolution close-up","not precise pickup positioning","Scaffold search area","Holovator lead","Roof target; entrance unverified","Back to walkthrough"])assert.ok(html.includes(term),"Missing clear map/source limitation "+term);
assert.match(css,/min-width:575px/);assert.match(css,/@media\(max-width:560px\)/);
assert.match(css,/overflow:auto/);assert.match(css,/maps\/lumiose-game-map\.jpg/);
assert.doesNotMatch(html+script,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(script,/\bfetch\s*\(|localStorage|sessionStorage|XMLHttpRequest/);
// Mock the read-only click, search and zoom interactions without a browser/network.
function makeNode(dataset={}){
 const node={dataset,value:"",textContent:"",hidden:false,disabled:false,style:{},events:{},attrs:{},scrolled:0,
  addEventListener(k,fn){this.events[k]=fn},
  setAttribute(k,v){this.attrs[k]=v},
  scrollIntoView(){this.scrolled++;}};
 return node;
}
const pins=mapPins.map((p,i)=>makeNode({mapPin:String(i+1),pinX:p[3],pinY:p[4]}));
const buttons=dirButtons.map(p=>makeNode({mapZoneButton:p[1],district:p[2],zoneSearch:p[3]}));
const details=Array.from({length:20},(_,i)=>makeNode({mapZoneDetail:String(i+1)}));
const names=["All","Vert","Bleu","Rouge","Jaune","Magenta","Centrico"];
const filters=names.map(d=>makeNode({districtFilter:d}));
const ids={mapSearch:makeNode(),mapCount:makeNode(),mapNoResults:makeNode(),mapStartMessage:makeNode(),
 mapShowAll:makeNode(),mapZoomImage:makeNode(),mapZoomTitle:makeNode(),
 mapZoomLevel:makeNode(),mapZoomValue:makeNode(),"zone-focus":makeNode()};
ids.mapZoomLevel.value="2.5";
const q={
 "[data-map-pin]":pins,"[data-map-zone-button]":buttons,
 "[data-map-zone-detail]":details,"[data-district-filter]":filters};
const location={pathname:"/maps.html",search:"?source=atlas",hash:""};
const historyEvents={},historyCalls=[];
const window={location,history:{state:{keep:true},pushState(state,_title,url){
 assert.deepEqual(state,{keep:true});historyCalls.push(url);
 const u=new URL(url,"https://atlas.example");location.hash=u.hash;
 assert.equal(u.search,"?source=atlas");
}},addEventListener(name,fn){historyEvents[name]=fn}};
runInNewContext(script,{document:{querySelectorAll:s=>q[s]||[],getElementById:id=>ids[id]||null},window,Number,String,Math,Map,URLSearchParams});
assert.equal(ids.mapCount.textContent,"20 of 20 Wild Zones listed");
assert.ok(details.every(d=>d.hidden),"No initial accidental detail choice");
pins[1].events.click();
assert.equal(details[1].hidden,false,"Pin 2 must open zone details");
assert.equal(details.filter(x=>!x.hidden).length,1);
assert.equal(ids.mapZoomImage.dataset.selectedZone,"2");
assert.equal(location.hash,"#wild-zone-2");
assert.equal(historyCalls.at(-1),"/maps.html?source=atlas#wild-zone-2");
assert.equal(ids.mapZoomImage.style.backgroundSize,"250% 250%");
assert.equal(ids.mapZoomLevel.disabled,false);
assert.equal(ids["zone-focus"].scrolled,1,"Clicking a map marker should reach the selected information");
ids.mapZoomLevel.value="3.5";ids.mapZoomLevel.events.input();
assert.equal(ids.mapZoomImage.style.backgroundSize,"350% 350%");
filters[1].events.click();
assert.equal(ids.mapCount.textContent,"3 of 20 Wild Zones listed","Vert district count must match saved map");
assert.equal(buttons.filter(x=>!x.hidden).length,3);
ids.mapSearch.value="TM027";ids.mapSearch.events.input();
assert.equal(buttons.filter(x=>!x.hidden).length,1,"Item search must find saved Zone 2");
ids.mapSearch.value="not-a-real-item-1234";ids.mapSearch.events.input();
assert.equal(ids.mapCount.textContent,"0 of 20 Wild Zones listed");
assert.equal(ids.mapNoResults.hidden,false);
assert.equal(ids.mapZoomLevel.disabled,true,"Clearing unavailable selection resets map zoom");
assert.equal(location.hash,"");
assert.equal(historyCalls.at(-1),"/maps.html?source=atlas");
ids.mapShowAll.events.click();
assert.equal(ids.mapCount.textContent,"20 of 20 Wild Zones listed");
assert.equal(ids.mapSearch.value,"");
location.hash="#wild-zone-20";historyEvents.hashchange();
assert.equal(details[19].hidden,false);
const calls=historyCalls.length;
location.hash="#wild-zone-2";historyEvents.popstate();
assert.equal(details[1].hidden,false);
historyEvents.hashchange();
assert.equal(historyCalls.length,calls,"History traversal must not create entries");
location.hash="#map-key";historyEvents.hashchange();
assert.equal(location.hash,"#map-key");
assert.ok(details.every(d=>d.hidden));
assert.equal(historyCalls.length,calls);
location.hash="#wild-zone-21";historyEvents.hashchange();
assert.ok(details.every(d=>d.hidden),"Invalid zone hash must not open a record");
// Original controls must reconcile an existing shared query before the optional
// module becomes available (the absent createElement also exercises fallback).
for(const action of ["clear","switch"]){
 const pendingPins=mapPins.map((p,i)=>makeNode({mapPin:String(i+1),pinX:p[3],pinY:p[4]}));
 const pendingButtons=dirButtons.map(p=>makeNode({mapZoneButton:p[1],district:p[2],zoneSearch:p[3]}));
 const pendingDetails=Array.from({length:20},(_,i)=>makeNode({mapZoneDetail:String(i+1)}));
 const pendingIds=Object.fromEntries(Object.keys(ids).map(id=>[id,makeNode()]));pendingIds.mapZoomLevel.value="2.5";
 const pendingQuery={"[data-map-pin]":pendingPins,"[data-map-zone-button]":pendingButtons,
   "[data-map-zone-detail]":pendingDetails,"[data-district-filter]":names.map(d=>makeNode({districtFilter:d}))};
 const pendingLocation={pathname:"/maps.html",search:"?source=atlas&keep=original&area=wz-20",hash:"#wild-zone-20"};
 const pendingHistory=[];
 const pendingWindow={location:pendingLocation,history:{state:{keep:true},pushState(state,_title,url){
   assert.deepEqual(state,{keep:true});pendingHistory.push(url);const parsed=new URL(url,"https://atlas.example");
   Object.assign(pendingLocation,{pathname:parsed.pathname,search:parsed.search,hash:parsed.hash});
 }},addEventListener(){}};
 runInNewContext(script,{document:{querySelectorAll:s=>pendingQuery[s]||[],getElementById:id=>pendingIds[id]||null},window:pendingWindow,Number,String,Math,Map,URLSearchParams});
 assert.equal(pendingIds.mapZoomImage.dataset.selectedZone,"20");
 if(action==="clear"){
   pendingIds.mapSearch.value="not-a-real-item-1234";pendingIds.mapSearch.events.input();
   assert.equal(pendingLocation.search,"?source=atlas&keep=original");assert.equal(pendingLocation.hash,"");
   assert.equal(pendingIds.mapZoomImage.dataset.selectedZone,"");assert.ok(pendingDetails.every(d=>d.hidden));
 }else{
   pendingButtons[0].events.click();
   assert.equal(pendingLocation.search,"?source=atlas&keep=original&area=wz-01");assert.equal(pendingLocation.hash,"#wild-zone-1");
   assert.equal(pendingIds.mapZoomImage.dataset.selectedZone,"1");assert.equal(pendingDetails[0].hidden,false);
 }
 assert.equal(pendingHistory.length,1,"Legacy intent creates one history entry while the optional module is unavailable");
}
console.log("PASS: 20 saved map markers, full source zone details, 264 item entries, 38 Alphas, 25 Screw clues, 25-link menu, offline search and zoom.");
