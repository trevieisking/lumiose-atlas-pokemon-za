import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("items.html"),js=read("items.js"),css=read("items.css"),mainJs=read("app.js"),source=read("src/sections/items.html");
const sourceData={window:{}};
runInNewContext(read("items-data.js"),sourceData);
const data=sourceData.window.ATLAS_ITEM_EVIDENCE;

const mainItemIds=[...source.matchAll(/data-pickup="([^"]+)"/g)].map(x=>x[1]);
const atlasItemIds=[...html.matchAll(/data-atlas-pickup="([^"]+)"/g)].map(x=>x[1]);
const mainScrewIds=[...source.matchAll(/data-screw="([^"]+)"/g)].map(x=>x[1]);
const atlasScrewIds=[...html.matchAll(/data-atlas-screw="([^"]+)"/g)].map(x=>x[1]);
assert.equal(mainItemIds.length,264);
assert.equal(mainScrewIds.length,100);
assert.deepEqual(atlasItemIds,mainItemIds,"Each tick must use its exact original item ID in source order");
assert.deepEqual(atlasScrewIds,mainScrewIds,"Each tick must use its exact original Screw ID in source order");
assert.match(mainJs,/const KEY = 'lumiose-atlas-reconstruction-v1'/);
assert.match(mainJs,/state\[kind\]\[val\]=target.checked/);
assert.match(js,/const PROGRESS_KEY="lumiose-atlas-reconstruction-v1"/);
assert.doesNotMatch(js,/localStorage\.clear|localStorage\.removeItem|\bfetch\s*\(|XMLHttpRequest|sessionStorage/);
assert.equal((html.match(/class="atlas-collect-toggle"/g)||[]).length,364);
assert.equal((html.match(/id="atlasItemChecked"/g)||[]).length,1);
assert.equal((html.match(/id="atlasScrewChecked"/g)||[]).length,1);
assert.equal((html.match(/id="atlasCollectSaveStatus"/g)||[]).length,1);
assert.match(html,/hidden-item outcomes, tick only when you have obtained that result/i);
assert.match(html,/not across devices/i);
assert.match(css,/min-height:44px/);
assert.match(css,/@media\(max-width:680px\)/);
assert.match(css,/@media\(max-width:420px\)/);
assert.match(css, /item-ledger-row\.is-collected/);

function basic(dataset={}){
 return {dataset,hidden:false,value:"",checked:false,textContent:"",style:{},events:{},attrs:{},
  addEventListener(name,fn){this.events[name]=fn},
  setAttribute(name,value){this.attrs[name]=value}};
}
function makeCheckbox(kind,id){
 const classNames=new Set();
 const row={classList:{toggle(name,enabled){if(enabled)classNames.add(name);else classNames.delete(name)},contains(name){return classNames.has(name)}}};
 return {...basic({[kind==="pickup"?"atlasPickup":"atlasScrew"]:id}),row,closest:()=>row};
}
function createHarness(initial,denyStorage=false){
 let raw=initial===null?null:typeof initial==="string"?initial:JSON.stringify(initial);
 let writes=0;
 const listeners={};
 const storage={
  getItem(key){assert.equal(key,"lumiose-atlas-reconstruction-v1");if(denyStorage)throw Error("blocked");return raw;},
  setItem(key,value){assert.equal(key,"lumiose-atlas-reconstruction-v1");if(denyStorage)throw Error("blocked");writes++;raw=value;}
 };
 const zoneCards=data.zones.map(z=>{
  const card=basic({itemZoneCard:String(z.number)});
  card.children=z.items.map(r=>basic({kind:r.kind,recordSearch:(r.name+" "+r.hint+" "+(r.sector||"")).toLowerCase()}));
  card.querySelectorAll=selector=>selector==="[data-item-record]"?card.children:[];
  return card;
 });
 const itemRows=zoneCards.flatMap(c=>c.children);
 const screws=data.screws.map(r=>basic({district:r.district,screwSearch:(r.district+" "+r.hint+" "+(r.sector||"")).toLowerCase()}));
 const filterBtns=["All","Vert","Bleu","Magenta","Rouge","Jaune"].map(s=>basic({screwDistrict:s}));
 const itemChecks=atlasItemIds.map(id=>makeCheckbox("pickup",id));
 const screwChecks=atlasScrewIds.map(id=>makeCheckbox("screw",id));
 const ids={itemLedgerSearch:basic(),itemLedgerZone:basic(),itemLedgerKind:basic(),itemLedgerStatus:basic(),itemLedgerEmpty:basic(),screwSearch:basic(),
  screwStatus:basic(),screwEmpty:basic(),atlasItemChecked:basic(),atlasScrewChecked:basic(),atlasItemProgressFill:basic(),atlasScrewProgressFill:basic(),atlasCollectSaveStatus:basic()};
 ids.itemLedgerZone.value="all";ids.itemLedgerKind.value="all";
 const document={
  querySelectorAll(selector){return ({
   "[data-item-record]":itemRows,"[data-item-zone-card]":zoneCards,
   "[data-screw-record]":screws,"[data-screw-district]":filterBtns,
   "[data-atlas-pickup]":itemChecks,"[data-atlas-screw]":screwChecks
  })[selector]||[];},
  getElementById(id){return ids[id]||null;}
 };
 const win={ATLAS_ITEM_EVIDENCE:data,localStorage:storage,addEventListener(name,fn){listeners[name]=fn;}};
 runInNewContext(js,{window:win,document});
 return {ids,itemChecks,screwChecks,filterBtns,zoneCards,listeners,stored:()=>raw,writes:()=>writes,replaceRaw:value=>{raw=value}};
}

const saved={
 check:{"mission-12":true},
 sideCheck:{"quest-23":true},
 legendCheck:{"legend-1":true},
 pickup:{"1-0":true,"5-2":true},
 screw:{"2":true},
 futureOwnerSetting:{appearance:"custom",unknownStuff:[1,2,3]}
};
const h=createHarness(saved);
assert.equal(h.writes(),0,"Loading the Atlas must not overwrite saved progress");
assert.equal(h.itemChecks[0].checked,true);
assert.equal(h.itemChecks.find(c=>c.dataset.atlasPickup==="5-2").checked,true);
assert.equal(h.screwChecks[1].checked,true);
assert.equal(h.itemChecks[0].row.classList.contains("is-collected"),true);
assert.equal(h.ids.atlasItemChecked.textContent,"2 of 264");
assert.equal(h.ids.atlasScrewChecked.textContent,"1 of 100");
assert.equal(h.ids.atlasItemProgressFill.style.width,"0.8%");
assert.equal(h.ids.atlasScrewProgressFill.style.width,"1.0%");
const second=h.itemChecks.find(c=>c.dataset.atlasPickup==="2-0");
second.checked=true;second.events.change();
let updated=JSON.parse(h.stored());
assert.equal(updated.pickup["2-0"],true);
assert.equal(updated.pickup["1-0"],true);
assert.equal(updated.pickup["5-2"],true);
assert.deepEqual(updated.check,saved.check,"Walkthrough progress must not change");
assert.deepEqual(updated.sideCheck,saved.sideCheck,"Side quest progress must not change");
assert.deepEqual(updated.legendCheck,saved.legendCheck,"Legend progress must not change");
assert.deepEqual(updated.futureOwnerSetting,saved.futureOwnerSetting,"Unknown future settings must not change");
assert.equal(h.ids.atlasItemChecked.textContent,"3 of 264");
assert.match(h.ids.atlasCollectSaveStatus.textContent,/saved on this device/i);
h.itemChecks[0].checked=false;h.itemChecks[0].events.change();
updated=JSON.parse(h.stored());
assert.equal(updated.pickup["1-0"],false,"Uncheck stores the same false boolean as app.js");
assert.equal(h.itemChecks[0].row.classList.contains("is-collected"),false);
const screwOne=h.screwChecks[0];screwOne.checked=true;screwOne.events.change();
updated=JSON.parse(h.stored());
assert.equal(updated.screw["1"],true);
assert.equal(updated.screw["2"],true);
assert.equal(h.ids.atlasScrewChecked.textContent,"2 of 100");
// A random hidden outcome can be marked obtained without inventing a fixed pin.
const outcome=h.itemChecks.find(c=>c.dataset.atlasPickup==="20-1");
outcome.checked=true;outcome.events.change();
assert.equal(JSON.parse(h.stored()).pickup["20-1"],true);
// Navigate to a different page and back, or change a tick from another open tab.
const external=JSON.parse(h.stored());
external.pickup["4-2"]=true;external.screw["50"]=true;
h.replaceRaw(JSON.stringify(external));
h.listeners.storage({key:"lumiose-atlas-reconstruction-v1"});
assert.equal(h.itemChecks.find(c=>c.dataset.atlasPickup==="4-2").checked,true,"External item changes should appear");
assert.equal(h.screwChecks.find(c=>c.dataset.atlasScrew==="50").checked,true,"External Screw changes should appear");
assert.equal(h.ids.atlasItemChecked.textContent,"4 of 264");
assert.equal(h.ids.atlasScrewChecked.textContent,"3 of 100");
const afterCross=JSON.parse(h.stored());
afterCross.pickup["2-0"]=false;
h.replaceRaw(JSON.stringify(afterCross));
h.listeners.pageshow();
assert.equal(second.checked,false,"Returning to the page must reflect current shared progress");
// Filters still work with collected states.
h.ids.itemLedgerZone.value="20";h.ids.itemLedgerZone.events.change();
h.ids.itemLedgerKind.value="hidden_outcome";h.ids.itemLedgerKind.events.change();
assert.match(h.ids.itemLedgerStatus.textContent,/Showing 56 of 264/);
h.filterBtns[1].events.click();assert.match(h.ids.screwStatus.textContent,/Showing 22 of 100/);
// Broken private storage must not get overwritten or falsely reported as saved.
const damaged=createHarness("{this is not json");
assert.match(damaged.ids.atlasCollectSaveStatus.textContent,/could not be read or saved/i);
damaged.itemChecks[0].checked=true;damaged.itemChecks[0].events.change();
assert.equal(damaged.writes(),0,"Malformed original storage must remain untouched");
assert.equal(damaged.stored(),"{this is not json");
assert.equal(damaged.ids.atlasItemChecked.textContent,"1 of 264","User can still tick temporarily");
const blocked=createHarness(saved,true);
assert.match(blocked.ids.atlasCollectSaveStatus.textContent,/could not be read or saved/i);
blocked.screwChecks[0].checked=true;blocked.screwChecks[0].events.change();
assert.equal(blocked.writes(),0);
console.log("PASS: 364 exact shared checkboxes, retained walkthrough/sidequest data, live counts, device reload/cross-tab and storage-failure protection.");
