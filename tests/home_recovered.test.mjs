import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {existsSync,readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("home-connection.html"),css=read("home-connection.css"),js=read("home-connection.js");
const dataJs=read("home-dex-data.js"),source=read("src/sections/pokedex.html");
const template=read("src/template.html"),app=read("app.js");
const manifest=JSON.parse(read("source-assets-manifest.json"));
const ctx={window:{}};runInNewContext(dataJs,ctx);
const data=JSON.parse(JSON.stringify(ctx.window.ATLAS_HOME_SOURCE));
const records=data.records;
assert.equal(records.length,364);
assert.deepEqual(data.provenance.groups,{Lumiose:232,Hyperspace:132});
assert.deepEqual(data.provenance.imageSources,{"original-captured":236,"external-sprite-fallback":108,"existing-archive":20});
assert.equal(data.provenance.total,364);
assert.equal(data.provenance.pdfCanonicalSha256,"a36169f8a22e9e0d8ec1369f4da29966e5b32b4f3dad5c5396d31b2a319f7cc5");
// A digest computed independently from every printed National number, group,
// name and type in the owner's ORIGINAL 14-page PDF, before any GitHub writes.
const canonical=records.map(r=>String(r.number).padStart(4,"0")+"|"+r.group+"|"+r.name+"|"+r.types+"\n").join("");
assert.equal(createHash("sha256").update(canonical).digest("hex"),
 "a36169f8a22e9e0d8ec1369f4da29966e5b32b4f3dad5c5396d31b2a319f7cc5",
 "Species, printed order, National number, region or type changed from the uploaded PDF");

const originalCards=[...source.matchAll(/<article class="dex-card"[^>]*>([\s\S]*?)<\/article>/g)].map(x=>{
 const s=x[1];
 return {number:Number(s.match(/NATIONAL #(\d+)/)?.[1]),
 name:s.match(/<strong>([^<]+)<\/strong>/)?.[1],
 types:s.match(/<span class="dex-types">([^<]+)<\/span>/)?.[1]};
});
assert.equal(originalCards.length,232);
for(let i=0;i<232;i++)for(const key of ["number","name","types"])
 assert.equal(records[i][key],originalCards[i][key],"Original saved main-game dex changed: "+i+" "+key);

const owned=new Set(manifest.files.map(f=>f.path));
const uniqueNumbers=new Set();
let originalArt=0,archivedArt=0,remoteArt=0;
for(let i=0;i<364;i++){
 const r=records[i],old=uniqueNumbers.size;
 assert.ok(Number.isInteger(r.number)&&r.number>0&&r.number<=1025);
 assert.equal(r.group,i<232?"Lumiose":"Hyperspace","PDF region ordering changed");
 assert.equal(r.dexIndex,i<232?i+1:i-231);
 assert.ok(r.pdfPage>=4&&r.pdfPage<=13);
 assert.ok(!uniqueNumbers.has(r.number),"National Dex duplicate "+r.number);
 uniqueNumbers.add(r.number);assert.equal(uniqueNumbers.size,old+1);
 assert.ok(html.includes('id="home-species-'+r.number+'"'),"Missing HTML card "+r.name);
 assert.ok(html.includes('data-home-register="'+r.number+'"'),"Missing checkmark "+r.name);
 assert.ok(html.includes('src="'+r.image+'"'),"Missing portrait "+r.name);
 if(r.imageSource==="original-captured"){
   originalArt++;assert.equal(r.image,"dex-art/"+r.number+".webp");
   assert.ok(owned.has(r.image),"Missing preserved source asset "+r.image);
 }else if(r.imageSource==="existing-archive"){
   archivedArt++;assert.equal(r.image,"art/"+r.number+".webp");
   assert.ok(owned.has(r.image),"Missing archived source artwork "+r.image);
 }else if(r.imageSource==="external-sprite-fallback"){
   remoteArt++;
   assert.equal(r.image,"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/"+r.number+".png",
    "Third-party artwork must come only from the disclosed public source");
 }else throw Error("Unlabelled artwork origin "+r.name);
}
assert.deepEqual([originalArt,archivedArt,remoteArt],[236,20,108]);
assert.equal((html.match(/data-home-card(?:\s|>)/g)||[]).length,364);
assert.equal((html.match(/data-home-register="/g)||[]).length,364);
assert.equal((html.match(/class="home-species-portrait"/g)||[]).length,364);
assert.equal((html.match(/data-home-external-art="true"/g)||[]).length,108);
assert.equal((html.match(/data-home-filter="/g)||[]).length,3);
assert.ok(html.includes('id="alpha-starters"')&&html.includes('id="volcanion"')&&html.includes('id="rules"')&&html.includes('id="species"'));
assert.ok(html.includes("Shiny Volcanion")&&html.includes("Alpha Chikorita")&&html.includes("Alpha Tepig")&&html.includes("Alpha Totodile"));
assert.match(html,/saved only in this browser/);
assert.match(html,/not a live Pokémon HOME connection/);
assert.match(html,/every form or older-game Pokémon/);
assert.match(html,/236 in the original dex-art archive and 20 in the archived illustration set/);
assert.match(html,/other 108 Hyperspace portraits/);
assert.match(html,/standard Volcanion reference portrait/);
assert.match(html,/one-way rule for older games/i);
assert.match(html,/Back to walkthrough/);
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media\(max-width:740px\)/);
assert.match(css,/@media\(max-width:975px\)/);
assert.match(css,/min-height:44px/);
assert.doesNotMatch(html+css+js+dataJs,/sb_secret_|service_role_key|sk-proj-|github_pat_|SUPABASE_SERVICE_ROLE_KEY/i);
assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|sessionStorage|localStorage\.clear|localStorage\.removeItem/);
assert.match(js,/const STORE_KEY="lumiose-atlas-gh-pages-home-register-v1"/);
assert.doesNotMatch(js,/localStorage\.setItem\(["']lumiose-atlas-reconstruction-v1/);
assert.match(app,/const KEY = 'lumiose-atlas-reconstruction-v1'/);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const originalNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&originalNav);
assert.equal(nav.replace(' aria-current="page"',"").trim(),originalNav.trim());
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.ok(nav.includes('href="home-connection.html" aria-current="page"'));
for(const file of ["home-dex-data.js","home-connection.js","home-connection.css","recovered-articles.css","recovered-articles.js","feedback.html","legendaries.html","index.html","alphas.html","shops.html","atlas-logo.png","favicon.png"])assert.ok(existsSync(new URL("../"+file,import.meta.url)),"Missing local file "+file);

function elem(dataset={}){
 const active=new Set();
 return {dataset,events:{},value:"",checked:false,hidden:false,attrs:{},textContent:"",style:{},parentElement:null,
   addEventListener(name,fn){this.events[name]=fn},
   setAttribute(k,v){this.attrs[k]=v},
   classList:{toggle(k,on){if(on)active.add(k);else active.delete(k)},contains(k){return active.has(k)}},
   closest(){return this.card||null}};
}
function harness(initial,blocked=false){
 let mainRecord=JSON.stringify({check:{m40:true},sideCheck:{q23:true},legendCheck:{Xerneas:true},pickup:{"1-0":true},screw:{"1":true}});
 let stored=initial===null?null:typeof initial==="string"?initial:JSON.stringify(initial);
 let writes=0,mainWrites=0;
 const storage={
  getItem(key){if(key==="lumiose-atlas-reconstruction-v1")return mainRecord;
    assert.equal(key,"lumiose-atlas-gh-pages-home-register-v1");if(blocked)throw Error("Blocked");return stored;},
  setItem(key,v){if(key==="lumiose-atlas-reconstruction-v1"){mainWrites++;mainRecord=v;return;}
    assert.equal(key,"lumiose-atlas-gh-pages-home-register-v1");if(blocked)throw Error("Blocked");writes++;stored=v;}
 };
 const cards=records.map(r=>elem({homeGroup:r.group,homeSearch:[r.name,String(r.number).padStart(4,"0"),r.types,r.group].join(" ").toLowerCase()}));
 const ticks=records.map((r,i)=>{const t=elem({homeRegister:String(r.number)});t.card=cards[i];cards[i].querySelector=key=>key==="[data-home-register]"?t:null;return t;});
 const buttons=["All","Lumiose","Hyperspace"].map(v=>elem({homeFilter:v}));
 const ids={homeSpeciesSearch:elem(),homeSpeciesStatus:elem(),homeSpeciesVisible:elem(),homeSpeciesEmpty:elem(),
 homeRegistryCount:elem(),homeLumioseCount:elem(),homeHyperspaceCount:elem(),homeRegistryFill:elem(),homeSaveStatus:elem()};
 ids.homeSpeciesStatus.value="all";
 const bar=elem(),fallback=elem(),img=elem();
 img.parentElement={querySelector:()=>fallback};
 const listeners={};
 const document={
  querySelectorAll(q){return ({
   "[data-home-card]":cards,"[data-home-register]":ticks,"[data-home-filter]":buttons,
   ".home-species-portrait img":[img]})[q]||[];},
  getElementById(id){return ids[id]||null;},
  querySelector(q){return q===".home-registration-bar"?bar:null;}
 };
 const window={ATLAS_HOME_SOURCE:ctx.window.ATLAS_HOME_SOURCE,localStorage:storage,addEventListener(name,fn){listeners[name]=fn;}};
 runInNewContext(js,{window,document});
 return {cards,ticks,buttons,ids,bar,img,fallback,listeners,writes:()=>writes,mainWrites:()=>mainWrites,
  data:()=>stored,replace:s=>{stored=s},mainData:()=>mainRecord};
}
const h=harness({"152":true,"979":true,futureOwnerField:"kept"});
assert.equal(h.writes(),0,"Loading the guide must never overwrite saved progress");
assert.equal(h.mainWrites(),0);
assert.equal(h.ids.homeRegistryCount.textContent,"2 of 364");
assert.equal(h.ids.homeLumioseCount.textContent,"1/232");
assert.equal(h.ids.homeHyperspaceCount.textContent,"1/132");
assert.equal(h.ids.homeRegistryFill.style.width,"0.5%");
assert.equal(h.bar.attrs["aria-valuenow"],"2");
assert.equal(h.ticks[0].checked,true);
assert.equal(h.cards[0].classList.contains("is-registered"),true);
h.buttons[1].events.click();
assert.equal(h.ids.homeSpeciesVisible.textContent,"Showing 232 of 364 Pokémon");
h.buttons[2].events.click();
assert.equal(h.ids.homeSpeciesVisible.textContent,"Showing 132 of 364 Pokémon");
h.buttons[0].events.click();
h.ids.homeSpeciesSearch.value="Flabébé";h.ids.homeSpeciesSearch.events.input();
assert.equal(h.ids.homeSpeciesVisible.textContent,"Showing 1 of 364 Pokémon");
h.ids.homeSpeciesSearch.value="no-such-pokemon";h.ids.homeSpeciesSearch.events.input();
assert.equal(h.ids.homeSpeciesVisible.textContent,"Showing 0 of 364 Pokémon");
assert.equal(h.ids.homeSpeciesEmpty.hidden,false);
h.ids.homeSpeciesSearch.value="";h.ids.homeSpeciesSearch.events.input();
h.ids.homeSpeciesStatus.value="registered";h.ids.homeSpeciesStatus.events.change();
assert.equal(h.ids.homeSpeciesVisible.textContent,"Showing 2 of 364 Pokémon");
h.ids.homeSpeciesStatus.value="missing";h.ids.homeSpeciesStatus.events.change();
assert.equal(h.ids.homeSpeciesVisible.textContent,"Showing 362 of 364 Pokémon");
h.ids.homeSpeciesStatus.value="all";h.ids.homeSpeciesStatus.events.change();

const next=h.ticks.find(t=>t.dataset.homeRegister==="498");
next.checked=true;next.events.change();
let newSaved=JSON.parse(h.data());
assert.equal(newSaved["498"],true);
assert.equal(newSaved["152"],true);
assert.equal(newSaved["979"],true);
assert.equal(newSaved.futureOwnerField,"kept");
assert.equal(h.ids.homeRegistryCount.textContent,"3 of 364");
assert.match(h.ids.homeSaveStatus.textContent,/was saved on this device/);
assert.equal(h.mainWrites(),0,"A HOME tick cannot write the main walkthrough store");
next.checked=false;next.events.change();
assert.equal(JSON.parse(h.data())["498"],false,"Uncheck must persist as false");
assert.equal(h.ids.homeRegistryCount.textContent,"2 of 364");

const external=JSON.parse(h.data());external["807"]=true;h.replace(JSON.stringify(external));
h.listeners.storage({key:"lumiose-atlas-gh-pages-home-register-v1"});
assert.equal(h.ticks.find(x=>x.dataset.homeRegister==="807").checked,true);
assert.equal(h.ids.homeHyperspaceCount.textContent,"2/132");
const after=JSON.parse(h.data());after["979"]=false;h.replace(JSON.stringify(after));
h.listeners.pageshow();
assert.equal(h.ticks.find(x=>x.dataset.homeRegister==="979").checked,false);
h.img.events.error();assert.equal(h.img.hidden,true);assert.equal(h.fallback.hidden,false);
const wrong=harness("{broken JSON");
assert.match(wrong.ids.homeSaveStatus.textContent,/could not be read or written/i);
wrong.ticks[0].checked=true;wrong.ticks[0].events.change();
assert.equal(wrong.writes(),0);
assert.equal(wrong.data(),"{broken JSON");
const restricted=harness({"152":true},true);
assert.match(restricted.ids.homeSaveStatus.textContent,/could not be read or written/i);
restricted.ticks[1].checked=true;restricted.ticks[1].events.change();
assert.equal(restricted.writes(),0);
assert.equal(restricted.mainWrites(),0);
console.log("PASS: full owner-PDF 364 digest, exact original 232 parity, 256 local/108 disclosed portraits, three safe filters, separate persistent HOME marks and no existing guide changes.");

// AT-346: finite acquisition-route display, not a full encounter audit.
{
 const app=read("app.js");
 const links=JSON.parse(app.match(/const fieldbookRoutes=(\{[^\n]+\});/)?.[1]);
 const evolutions=JSON.parse(app.match(/const evolutionRoutes=(\{[^\n]+\});/)?.[1]);
 const sandbox={window:{}};
 runInNewContext(read("home-dex-data.js"),sandbox);
 const roster=sandbox.window.ATLAS_HOME_SOURCE.records;
 const ids=[...Object.keys(links),...Object.keys(evolutions)];
 assert.equal(Object.keys(links).length,20);
 assert.equal(Object.keys(evolutions).length,7);
 assert.equal(new Set(ids).size,27);
 assert.equal(roster.length,364);
 const legends=read("legendaries.html"),missions=read("side-missions.html");
 for(const n of ids)assert.ok(roster.some(r=>r.number===Number(n)&&r.group==="Hyperspace"),n);
 for(const id of Object.values(links))assert.ok(legends.includes('id="legend-'+id+'"'),id);
 for(const r of Object.values(evolutions)){
  assert.ok(r.note.length>40);
  if(r.quest)assert.ok(missions.includes('id="quest-'+r.quest+'"'),r.quest);
 }
 assert.match(evolutions[979].note,/Rage Fist at least 20 times/);
 assert.match(evolutions[865].note,/three critical hits/);
 assert.match(evolutions[867].note,/49 HP missing/);
 assert.match(evolutions[350].note,/Prism Scale/);
 assert.match(evolutions[936].note,/Auspicious Armor/);
 assert.match(evolutions[937].note,/Malicious Armor/);
 assert.match(evolutions[1000].note,/999 Gimmighoul Coins/);
}

// AT-346: generated-route review register and public pilot are distinct.
{
 const app=read("app.js");
 const pilot=JSON.parse(app.match(/const reviewedPortalRoutes=(\{[^\n]+\});/)?.[1]);
 const research=JSON.parse(read("docs/qa/at346-dex-audit/hyperspace-typed-route-review-v1.json"));
 const original=JSON.parse(read("docs/qa/at346-dex-audit/hyperspace-generated-wild-summary-v1.json"));
 assert.deepEqual(research.fullJoinCounts,original.summary);
 assert.equal(research.hyperspaceSpecies,105);
 assert.equal(research.species.length,105);
 assert.equal(research.uniqueRoutes,202);
 assert.equal(research.species.reduce((n,s)=>n+s.routes.length,0),202);
 assert.equal(new Set(research.species.map(s=>s.national)).size,105);
 const sandbox={window:{}};
 runInNewContext(read("home-dex-data.js"),sandbox);
 const roster=JSON.parse(JSON.stringify(sandbox.window.ATLAS_HOME_SOURCE.records)).filter(r=>r.group==="Hyperspace");
 const missing=new Set(original.notInTypedGeneratedTable.filter(r=>r.group==="Hyperspace").map(r=>r.number));
 assert.equal(missing.size,27);
 assert.deepEqual(research.species.map(s=>s.national),roster.filter(r=>!missing.has(r.number)).map(r=>r.number));
 for(const s of research.species){
  assert.equal(roster.find(r=>r.number===s.national)?.dexIndex,s.dexIndex);
  for(const r of s.routes){
   assert.ok(r.rank>=1&&r.rank<=5&&r.patterns.length>0);
   assert.deepEqual(r.alpha,r.catch.map(n=>n+9));
  }
 }
 assert.equal(Object.keys(pilot).length,105);
 assert.equal(Object.values(pilot).flat().length,202);
 for(const [n,routes] of Object.entries(pilot)){
  const s=research.species.find(s=>s.national===Number(n));
  assert.ok(s);
  assert.deepEqual(routes,s.routes.map(({patterns,...r})=>r));
 }
 assert.deepEqual(pilot[56].map(r=>r.rank),[1,3]);
 assert.deepEqual(pilot[999],[{form:0,type:"Ghost",rank:5,catch:[62,64],alpha:[71,73]}]);
 for(const n of [252,253,254,255,256,257,258,259,260,951,952,590,591,935,349,977,769,770,852,853])assert.ok(pilot[n].length>0&&pilot[n].every(r=>r.form===0),n);
 assert.deepEqual(pilot[252].map(r=>r.rank),[2,3,5]);
 assert.deepEqual(pilot[257].map(r=>[r.rank,r.type]),[[4,"Fighting"],[4,"Fire"],[5,"Fire"]]);
 assert.deepEqual(pilot[260].map(r=>[r.rank,r.type]),[[4,"Ground"],[4,"Water"],[5,"Water"]]);
 assert.deepEqual(pilot[935],[{form:0,type:"Fire",rank:2,catch:[19,21],alpha:[28,30]}]);
 for(const n of [509,510,827,828,942,943,433,358,517,518,325,326,174,39,40,926,927,821,822,823,973])assert.ok(pilot[n].length>0&&pilot[n].every(r=>r.form===0),n);
 assert.deepEqual(pilot[509].map(r=>r.rank),[1,3]);
 assert.deepEqual(pilot[942].map(r=>r.rank),[1,4]);
 assert.deepEqual(pilot[433].map(r=>r.rank),[1,3]);
 assert.deepEqual(pilot[174].map(r=>r.rank),[2,3]);
 assert.deepEqual(pilot[822].map(r=>r.rank),[3,4]);
 for(const n of [396,397,398,335,316,317,41,42,169,336,932,933,934,622,623])assert.ok(pilot[n].length>0&&pilot[n].every(r=>r.form===0),n);
 assert.deepEqual(pilot[396].map(r=>[r.rank,r.type]),[[1,"Flying"],[1,"Normal"],[2,"Normal"],[3,"Flying"]]);
 assert.deepEqual(pilot[42].map(r=>[r.rank,r.type]),[[3,"Flying"],[4,"Poison"]]);
 for(const n of [137,233,474,967,969,970,971,972,352,615,996,997,998,778,563])assert.ok(pilot[n].length>0&&pilot[n].every(r=>r.form===0),n);
 assert.deepEqual(pilot[137].map(r=>r.rank),[3,5]);
 for(const n of [996,997,998])assert.deepEqual(pilot[n].map(r=>[r.rank,r.type]),[[5,"Dragon"],[5,"Ice"]]);
 assert.deepEqual(pilot[969].map(r=>[r.rank,r.type]),[[3,"Poison"],[3,"Rock"],[4,"Poison"],[4,"Rock"]]);
 for(const n of [863,904,767,768,900,877])assert.ok(pilot[n].length>0&&pilot[n].every(r=>r.form===0),n);
 assert.deepEqual(pilot[767].map(r=>[r.rank,r.type]),[[1,"Bug"],[3,"Water"]]);
 assert.deepEqual(pilot[904],[{form:0,type:"Poison",rank:5,catch:[53,55],alpha:[62,64]}]);
 const labels=JSON.parse(app.match(/const portalFormLabels=(\{[^\n]+\});/)?.[1]);
 assert.deepEqual(Object.keys(pilot).map(Number).sort((a,b)=>a-b),research.species.map(s=>s.national).sort((a,b)=>a-b));
 for(const [n,routes] of Object.entries(pilot))if(routes.some(r=>r.form>0)){
  assert.equal(new Set(labels[n]).size,labels[n].length);
  for(const route of routes)assert.ok(labels[n][route.form],`Missing form label ${n}/${route.form}`);
 }
 assert.deepEqual(labels[52],["Kantonian Meowth","Alolan Meowth","Galarian Meowth"]);
 assert.deepEqual(labels[479],["Rotom (ordinary form)","Heat Rotom","Wash Rotom","Frost Rotom","Fan Rotom","Mow Rotom"]);
 assert.deepEqual(labels[931],["Green Plumage","Blue Plumage","Yellow Plumage","White Plumage"]);
 assert.deepEqual(labels[978],["Curly Form","Droopy Form","Stretchy Form"]);
 assert.ok(app.includes("row.dataset.atlasPortalForm=String(encounter.form)"));
 assert.ok(app.includes("reviewedPortalRoutes[r.number].some(encounter=>encounter.rank===5)"));
 assert.ok(read("side-missions.html").includes('id="quest-188"'));
 assert.ok(read("mega-dimension.html").includes('id="portal-prep"'));
}

// AT-346: exact source-derived default-form stats, preserving route arrays and original cards.
{
 const app=read("app.js");
 const reg=JSON.parse(read("docs/qa/at346-dex-audit/hyperspace-base-stats-v1.json"));
 const stats=JSON.parse(app.match(/const hyperspaceBaseStats=(\{[^\n]+\});/)[1]);
 const labels=JSON.parse(app.match(/const hyperspaceStatForms=(\{[^\n]+\});/)[1]);
 const box={window:{}};runInNewContext(read("home-dex-data.js"),box);
 const roster=JSON.parse(JSON.stringify(box.window.ATLAS_HOME_SOURCE.records)).filter(r=>r.group==="Hyperspace");
 assert.equal(reg.rows.length,132);assert.equal(Object.keys(stats).length,132);
 assert.deepEqual(reg.statOrder,["hp","attack","defense","special_attack","special_defense","speed"]);
 assert.deepEqual(reg.rows.map(r=>[r.national,r.dexIndex,r.name]),roster.map(r=>[r.number,r.dexIndex,r.name]));
 for(const row of reg.rows){assert.deepEqual(stats[row.national],row.stats);assert.equal(row.stats.length,6);assert.ok(row.stats.every(n=>Number.isInteger(n)&&n>0&&n<=255));assert.equal(row.form,labels[row.national]||"Default form (non-Mega)");}
 for(const [n,v] of Object.entries(reg.crossCheck.stats))assert.deepEqual(stats[n],v);
 assert.equal(labels[999],"Chest Form");assert.equal(labels[876],"Male Indeedee");assert.equal(labels[720],"Confined");
 assert.equal(reg.lumioseComparison.exactSourceMatches,231);
 assert.equal(Object.values(JSON.parse(app.match(/const reviewedPortalRoutes=(\{[^\n]+\});/)[1])).flat().length,202);
 assert.ok(app.includes("regionCards.length===132&&regionCards.every"));
 assert.ok(app.includes("$$('.stat-row',node).at(-1)?.lastElementChild"));
}

// AT-346 startup regression: collection queries must use the collection selector.
{
 const app=read("app.js");
 assert.ok(app.includes("$$('.stat-row',node).length===6"));
 assert.ok(app.includes("for(const option of $$('#dexSort option'))"));
}
