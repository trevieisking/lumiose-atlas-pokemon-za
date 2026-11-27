import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=f=>readFileSync(new URL("../"+f,import.meta.url),"utf8");
const html=read("legendaries.html"),css=read("legendaries.css"),script=read("legendaries.js"),dataJs=read("legendaries-data.js");
const source=read("src/sections/legends.html"),template=read("src/template.html"),mainJs=read("app.js");
const context={window:{}};runInNewContext(dataJs,context);
const db=JSON.parse(JSON.stringify(context.window.ATLAS_LEGENDARY_SOURCE));
assert.equal(db.records.length,25);
assert.deepEqual(db.counts,{"Base story":3,"Gift mission":2,"Mega Dimension":13,"Special Scan":7});
assert.equal(db.provenance.recordCount,25);
assert.match(db.provenance.stepDerivation,/editorial decomposition/);

const decode=s=>String(s).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&apos;/g,"'").replace(/&nbsp;/g," ");
const originalCards=[...source.matchAll(/<article class="legend-card">([\s\S]*?)<\/article>/g)].map(m=>m[1]);
assert.equal(originalCards.length,25,"Saved main-page source must contain all 25 cards");
const expectedPage=[1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,9,9,9];
const ids=new Set(),names=new Set();
for(let i=0;i<25;i++){
  const s=originalCards[i],r=db.records[i];
  const old={
    name:decode(s.match(/<h3>([^<]+)<\/h3>/)?.[1]||""),
    category:decode(s.match(/<span class="kicker">([^<]+)<\/span>/)?.[1]||""),
    key:decode(s.match(/data-legend-check="([^"]+)"/)?.[1]||""),
    nationalNumber:Number(s.match(/NATIONAL #(\d+)/)?.[1]),
    image:s.match(/<img[^>]+src="([^"]+)"/)?.[1],
    place:decode(s.match(/<div class="legend-place">([^<]+)<\/div>/)?.[1]||"").replace(/^⌖\s*/,""),
    description:decode(s.match(/<div class="legend-place">[^<]*<\/div><p>([\s\S]*?)<\/p>/)?.[1]||""),
    tip:decode(s.match(/<div class="legend-tip">([\s\S]*?)<\/div>/)?.[1]||"")
  };
  for(const key of Object.keys(old)){
    assert.equal(r[key],old[key],"Changed original source "+r.name+"."+key);
  }
  assert.equal(r.originalPdfPage,expectedPage[i],"Incorrect original PDF page "+r.name);
  assert.ok(r.steps.length>=3,"Source action checklist missing for "+r.name);
  assert.ok(r.links.length>=1,"No internal follow-up link "+r.name);
  assert.ok(existsSync(new URL("../"+r.image,import.meta.url)),"Missing source art "+r.image);
  assert.equal(r.key,r.name);
  assert.equal(r.id,r.name.toLowerCase());
  assert.ok(!ids.has(r.id)&&!names.has(r.name));
  ids.add(r.id);names.add(r.name);
  assert.ok(html.includes('id="legend-'+r.id+'"'),"Missing source card anchor "+r.id);
  assert.ok(html.includes('data-atlas-legend="'+r.name+'"'),"Lost shared checkmark ID "+r.name);
  assert.ok(html.includes('src="'+r.image+'"'),"Lost original Pokémon artwork "+r.name);
  assert.ok(html.includes('Original PDF' )||html.includes('original PDF'));
  assert.ok(html.includes("printed page "+r.originalPdfPage+" of 10"));
  for(const [linkText,target] of r.links){
    assert.ok(target.startsWith("#")||target.startsWith("index.html#")||target.includes(".html"));
    const path=target.split("#")[0];
    if(path)assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Broken route link "+target);
  }
}
assert.deepEqual(db.records.slice(0,5).map(r=>r.name),["Xerneas","Yveltal","Zygarde","Diancie","Mewtwo"]);
assert.deepEqual(db.records.slice(-7).map(r=>r.name),["Latias","Latios","Cobalion","Terrakion","Virizion","Keldeo","Meloetta"]);
// AT-280: preserve PDF-faithful Lv. 85 text while documenting the Level 200 boss.
const zeraora=db.records.find(r=>r.id==="zeraora");
assert.equal(zeraora.tip,"Level 85 · Dodge the sweeping Electroweb patterns.");
assert.equal(zeraora.encounterLevels.rogueMegaBoss,200);
assert.equal(zeraora.encounterLevels.postBattleCatch,85);
assert.equal(zeraora.encounterLevels.sources.length,2);
const zeraoraCard=html.split('id="legend-zeraora"')[1]?.split("</article>")[0]||"";
assert.match(zeraoraCard,/Rogue Mega Zeraora is Lv\. 200 during the battle/);
assert.match(zeraoraCard,/Zeraora you catch afterward is Lv\. 85/);
assert.match(zeraoraCard,/rogue mega boss level 200 catch zeraora level 85/);
assert.equal((html.match(/data-legend-card(?:\s|>)/g)||[]).length,25);
assert.equal((html.match(/data-atlas-legend="/g)||[]).length,25);
assert.equal((html.match(/class="legend-artwork"/g)||[]).length,25);
assert.equal((html.match(/<details class="legend-steps">/g)||[]).length,25);
assert.equal((html.match(/class="legend-source-page"/g)||[]).length,25);
assert.equal((html.match(/data-legend-filter="/g)||[]).length,5);
assert.ok(!html.includes('data-legend-check="'),"Don't create a competing selector on this page");
assert.match(html,/not a fixed species or city location/);
assert.match(html,/original Workspace (?:site|website) or other devices/i);
assert.match(html,/Mystery Gift/);
assert.match(html,/original PDF/i);
assert.match(html,/Special Scans are not fixed pins/);
assert.match(html,/Back to walkthrough/);
assert.match(css,/@media\(max-width:590px\)/);
assert.match(css,/@media\(max-width:850px\)/);
assert.match(css,/min-height:44px/);
assert.doesNotMatch(html+css+script+dataJs,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(script+dataJs,/\bfetch\s*\(|sessionStorage|XMLHttpRequest|localStorage\.clear|localStorage\.removeItem/);
assert.match(mainJs,/const KEY = 'lumiose-atlas-reconstruction-v1'/);
assert.match(mainJs,/legendCheck:'data-legend-check'/);
assert.match(script,/const PROGRESS_KEY="lumiose-atlas-reconstruction-v1"/);
assert.match(script,/\.\.\.saved,legendCheck:\{\.\.\.\(saved\.legendCheck\|\|\{\}\)/);

const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const originalNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&originalNav);
assert.equal(nav.replace(' aria-current="page"',"").trim(),originalNav.trim(),"Shared 25-link guide menu differs");
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.ok(nav.includes('href="index.html#legends" aria-current="page"'));
for(const file of ["atlas-logo.png","favicon.png","legendaries.js","legendaries.css","legendaries-data.js","recovered-articles.js","recovered-articles.css","feedback.html","items.html","maps.html","type-chart.html","journey.html","boss-guide.html","shops.html"])assert.ok(existsSync(new URL("../"+file,import.meta.url)),"Referenced file unavailable "+file);

// Browserless DOM model: test both filters and durable shared checkoffs while
// proving that walkthrough, side-quest, item and future record fields survive.
function node(dataset={}){
 const cls=new Set();
 return {dataset,value:"",checked:false,hidden:false,events:{},textContent:"",className:"",attrs:{},style:{},
  addEventListener(name,handler){this.events[name]=handler;},
  setAttribute(name,value){this.attrs[name]=value;},
  classList:{toggle(name,value){if(value)cls.add(name);else cls.delete(name)},contains(name){return cls.has(name)}},
  closest(){return this.card||null;}};
}
function harness(initial,blocked=false){
 let raw=initial===null?null:typeof initial==="string"?initial:JSON.stringify(initial),writes=0;
 const storage={
  getItem(key){assert.equal(key,"lumiose-atlas-reconstruction-v1");if(blocked)throw Error("blocked");return raw;},
  setItem(key,value){assert.equal(key,"lumiose-atlas-reconstruction-v1");if(blocked)throw Error("blocked");writes++;raw=value;}
 };
 const cards=db.records.map(r=>node({category:r.category,routeSearch:
 [r.name,r.category,r.place,r.description,r.tip,...r.steps].join(" ").toLocaleLowerCase()}));
 const toggles=db.records.map((r,i)=>{
  const toggle=node({atlasLegend:r.key});toggle.card=cards[i];return toggle;
 });
 const filters=["All","Base story","Gift mission","Mega Dimension","Special Scan"].map(group=>node({legendFilter:group}));
 const ids={legendRouteSearch:node(),legendVisibleCount:node(),legendNoResults:node(),legendObtainedCount:node(),legendObtainedFill:node(),
  legendSaveStatus:node(),legendStoryCount:node(),legendGiftCount:node(),legendDlcCount:node(),legendScanCount:node()};
 const progress=node(),listeners={};
 const document={
  querySelectorAll(selector){return ({
   "[data-legend-card]":cards,"[data-atlas-legend]":toggles,"[data-legend-filter]":filters
  })[selector]||[];},
  getElementById:id=>ids[id]||null,
  querySelector:selector=>selector===".legend-progress-meter"?progress:null
 };
 const window={ATLAS_LEGENDARY_SOURCE:context.window.ATLAS_LEGENDARY_SOURCE,localStorage:storage,
  addEventListener(name,listener){listeners[name]=listener}};
 runInNewContext(script,{document,window});
 return {cards,toggles,filters,ids,progress,listeners,raw:()=>raw,writeCount:()=>writes,replaceRaw:s=>{raw=s}};
}
const preexisting={
 check:{"40":true},sideCheck:{"33":true},legendCheck:{Xerneas:true,Latias:true},
 pickup:{"1-0":true},screw:{"8":true},futureField:{theme:"green",important:[3,7]}
};
const h=harness(preexisting);
assert.equal(h.writeCount(),0,"Page open cannot overwrite existing progress");
assert.equal(h.ids.legendObtainedCount.textContent,"2 of 25 obtained");
assert.equal(h.progress.attrs["aria-valuenow"],"2");
assert.equal(h.ids.legendObtainedFill.style.width,"8.0%");
assert.equal(h.ids.legendStoryCount.textContent,"1/3");
assert.equal(h.ids.legendGiftCount.textContent,"0/2");
assert.equal(h.ids.legendDlcCount.textContent,"0/13");
assert.equal(h.ids.legendScanCount.textContent,"1/7");
assert.equal(h.toggles[0].checked,true);
assert.equal(h.cards[0].classList.contains("is-obtained"),true);
assert.equal(h.ids.legendVisibleCount.textContent,"Showing 25 of 25 encounters");
h.filters[1].events.click();
assert.equal(h.ids.legendVisibleCount.textContent,"Showing 3 of 25 encounters");
h.filters[2].events.click();
assert.equal(h.ids.legendVisibleCount.textContent,"Showing 2 of 25 encounters");
h.filters[3].events.click();
assert.equal(h.ids.legendVisibleCount.textContent,"Showing 13 of 25 encounters");
h.filters[4].events.click();
assert.equal(h.ids.legendVisibleCount.textContent,"Showing 7 of 25 encounters");
h.filters[0].events.click();
h.ids.legendRouteSearch.value="genesect";h.ids.legendRouteSearch.events.input();
assert.equal(h.ids.legendVisibleCount.textContent,"Showing 1 of 25 encounters");
h.ids.legendRouteSearch.value="not-a-real-pokemon";h.ids.legendRouteSearch.events.input();
assert.equal(h.ids.legendNoResults.hidden,false);
h.ids.legendRouteSearch.value="";h.ids.legendRouteSearch.events.input();

const yveltal=h.toggles.find(x=>x.dataset.atlasLegend==="Yveltal");
yveltal.checked=true;yveltal.events.change();
let stored=JSON.parse(h.raw());
assert.equal(stored.legendCheck.Yveltal,true);
assert.equal(stored.legendCheck.Xerneas,true);
assert.equal(stored.legendCheck.Latias,true);
for(const k of ["check","sideCheck","pickup","screw","futureField"])assert.deepEqual(stored[k],preexisting[k],"Changed protected progress "+k);
assert.equal(h.ids.legendObtainedCount.textContent,"3 of 25 obtained");
assert.match(h.ids.legendSaveStatus.textContent,/Saved on this device/);
const xerneas=h.toggles[0];xerneas.checked=false;xerneas.events.change();
stored=JSON.parse(h.raw());
assert.equal(stored.legendCheck.Xerneas,false);
assert.equal(h.cards[0].classList.contains("is-obtained"),false);
assert.equal(h.ids.legendObtainedCount.textContent,"2 of 25 obtained");

const outside=JSON.parse(h.raw());outside.legendCheck.Magearna=true;h.replaceRaw(JSON.stringify(outside));
h.listeners.storage({key:"lumiose-atlas-reconstruction-v1"});
assert.equal(h.toggles.find(x=>x.dataset.atlasLegend==="Magearna").checked,true);
assert.equal(h.ids.legendObtainedCount.textContent,"3 of 25 obtained");
const later=JSON.parse(h.raw());later.legendCheck.Latias=false;h.replaceRaw(JSON.stringify(later));
h.listeners.pageshow();
assert.equal(h.toggles.find(x=>x.dataset.atlasLegend==="Latias").checked,false);

const unreadable=harness("{invalid existing JSON");
assert.match(unreadable.ids.legendSaveStatus.textContent,/could not be read or saved/i);
unreadable.toggles[0].checked=true;unreadable.toggles[0].events.change();
assert.equal(unreadable.writeCount(),0,"Malformed record must never be reset");
assert.equal(unreadable.raw(),"{invalid existing JSON");
const denied=harness(preexisting,true);
assert.match(denied.ids.legendSaveStatus.textContent,/could not be read or saved/i);
denied.toggles[1].checked=true;denied.toggles[1].events.change();
assert.equal(denied.writeCount(),0);
console.log("PASS: 25 PDF-faithful illustrated routes, source levels/locations/notes, route links, shared progress, 4 search filters and storage recovery.");

// AT-346: the Mega Stone battle unlocks both species but is not a catch.
for(const name of ["Latias","Latios"]){
 const start=html.indexOf('id="legend-'+name.toLowerCase()+'"');
 assert.ok(start>0);
 const card=html.slice(start,html.indexOf("</article>",start));
 assert.match(card,/Side Mission 189, Siblings of the Sky, before spending points/);
 assert.match(card,/cannot catch either Pokémon in that fight/);
 assert.match(card,/Side Mission 188 unlocks Special Scanning/);
 assert.match(card,/25,000 Hyperspace research points/);
 assert.match(card,/href="side-missions.html#quest-189"/);
 assert.match(card,/href="side-missions.html#quest-188"/);
 assert.match(card,/not a guarantee for a particular species/);
 assert.ok(card.includes('data-atlas-legend="'+name+'"'));
}
