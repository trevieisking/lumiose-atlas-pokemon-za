import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("alphas.html"),source=read("src/sections/alphas.html"),menuTemplate=read("src/template.html"),js=read("alphas.js"),css=read("alphas.css");
const legacy=[...source.matchAll(/<article class="alpha-card">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
const restored=[...html.matchAll(/<article class="alpha-zone-card"([\s\S]*?)<\/article>/g)].map(x=>x[0]);
assert.equal(legacy.length,20,"Original source must contain all 20 zones");
assert.equal(restored.length,20,"Standalone fieldbook must retain 20 zone cards");
const originalTargets=x=>[...x.matchAll(/data-dex-name="([^"]+)"[^>]*>([^<]+)<\/button><small>([^<]+)<\/small>/g)].map(y=>({name:["Vivillon (Meadow Pattern)","Florges (Red Flower)"].includes(y[2])?y[2]:y[1],level:y[3]}));
const revisedTargets=x=>[...x.matchAll(/<span class="alpha-target-name">([^<]+)<\/span><span class="alpha-level">([^<]+)<\/span>/g)].map(y=>({name:y[1],level:y[2]}));
let fixedCount=0;
for(let i=0;i<20;i++){
  const n=i+1;
  const existing=originalTargets(legacy[i]);
  const captured=revisedTargets(restored[i]);
  assert.ok(restored[i].includes('id="zone-'+n+'"'),"Missing Wild Zone "+n);
  assert.deepEqual(captured,existing,"Species, level or time condition changed for Zone "+n);
  if(n!==20)fixedCount+=captured.length;
}
assert.equal(fixedCount,38);
const centralPool = revisedTargets(restored[19]);
assert.equal(centralPool.length,67);
const higher = "Alakazam Machamp Kangaskhan Gyarados Dragonite Tyranitar Gardevoir Aggron Altaria Absol Garchomp Lucario Gallade Garbodor Eelektross Chandelure Florges Pangoro Aegislash Malamar Barbaracle Dragalge Heliolisk Goodra Drampa Falinks".split(" ");
assert.deepEqual(centralPool.filter(r=>r.level==="Lv. 64–65").map(r=>r.name.replace(/ \(.*\)$/, "")).sort(), higher.sort());
assert.equal(centralPool.filter(r=>r.level==="Lv. 63–64").length,41);
assert.ok(centralPool.some(r=>r.name==="Vivillon (Meadow Pattern)" && r.level==="Lv. 63–64"));
assert.ok(centralPool.some(r=>r.name==="Florges (Red Flower)" && r.level==="Lv. 64–65"));
assert.match(legacy[19],/data-dex-name="Vivillon" type="button">Vivillon \(Meadow Pattern\)/);
assert.match(legacy[19],/data-dex-name="Florges" type="button">Florges \(Red Flower\)/);
assert.match(restored[19],/Show all 67 possible Zone 20 Alpha Pokémon/);
assert.match(restored[19],/This complete list was present in the saved main guide, but was collapsed/);
const pageMenu=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const masterMenu=menuTemplate.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(pageMenu&&masterMenu);
assert.equal(pageMenu.trim(),masterMenu.trim(),"25 link navigation must be identical on the Alpha page");
assert.equal((pageMenu.match(/<a /g)||[]).length,25);
for(const text of ["A Big Ol’ Bunnelby","Wild Zone 3","Wild Zone 5","Wild Zone 9","Steelix","Gallade","Pangoro","Chikorita","Tepig","Totodile","Old Amber","Jaw Fossil","Sail Fossil","1%","11%","21%","51%","not visible in the printed PDF","Back to walkthrough"])assert.ok(html.includes(text),"Missing PDF recovery content: "+text);
for(const path of ["atlas-logo.png","favicon.png","index.html","journey.html","home-connection.html","recovered-articles.css","recovered-articles.js","alphas.css","alphas.js"])assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing local guide resource: "+path);
for(const x of restored){
  const sourcePath=x.match(/<img src="(dex-art\/[^"]+)"/)?.[1];
  assert.ok(sourcePath&&existsSync(new URL("../"+sourcePath,import.meta.url)),"Missing source illustration "+sourcePath);
}
// AT-283: independently verified catchable mission Alpha; preserve all 20 original zone cards.
assert.ok(html.includes('id="alpha-watchog-mission-71"'));
assert.ok(html.includes("Catching this red-eyed level 50 Watchog also completes the mission"));
assert.ok(html.includes('href="side-missions.html#quest-71"'));
assert.equal((html.match(/id="alpha-watchog-mission-71"/g)||[]).length,1);
assert.match(css,/@media\(max-width:480px\)/);
assert.match(css, /grid-template-columns:1fr/);
assert.doesNotMatch(html+css+js,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(js,/\bfetch\s*\(|localStorage|sessionStorage|XMLHttpRequest/);
const element=props=>({
  ...props,hidden:false,textContent:"",events:{},attrs:{},
  addEventListener(event,fn){this.events[event]=fn},
  setAttribute(key,value){this.attrs[key]=value}
});
const zones=restored.map((str,i)=>{
  const keywords=str.match(/data-alpha-keywords="([^"]*)"/)?.[1];
  assert.ok(keywords);
  return element({dataset:{alphaZone:String(i+1),alphaKeywords:keywords}});
});
const controls={
  alphaZoneSearch:element({value:""}),
  alphaZoneStatus:element({}),
  alphaZoneNoResults:element({}),
  alphaZone20Pool:element({open:false})
};
const tabs=["all","1-6","7-13","14-20"].map(k=>element({dataset:{alphaFilter:k}}));
runInNewContext(js,{document:{querySelectorAll(q){return q==="[data-alpha-zone]"?zones:q==="[data-alpha-filter]"?tabs:[]},getElementById(id){return controls[id]||null}}});
assert.equal(controls.alphaZoneStatus.textContent,"Showing 20 of 20 Wild Zones");
tabs[1].events.click();
assert.equal(controls.alphaZoneStatus.textContent,"Showing 6 of 20 Wild Zones");
tabs[2].events.click();
assert.equal(controls.alphaZoneStatus.textContent,"Showing 7 of 20 Wild Zones");
tabs[0].events.click();
controls.alphaZoneSearch.value="Raichu";
controls.alphaZoneSearch.events.input();
assert.equal(controls.alphaZoneStatus.textContent,"Showing 1 of 20 Wild Zones","Zone 20 hidden-list Pokémon should be searchable");
assert.equal(zones[19].hidden,false);
assert.equal(controls.alphaZone20Pool.open,true,"Hidden pool automatically expands when its species is searched");
controls.alphaZoneSearch.value="UnknownAlpha999";
controls.alphaZoneSearch.events.input();
assert.equal(controls.alphaZoneStatus.textContent,"Showing 0 of 20 Wild Zones");
assert.equal(controls.alphaZoneNoResults.hidden,false);
controls.alphaZoneSearch.value="";
controls.alphaZoneSearch.events.input();
assert.equal(controls.alphaZoneStatus.textContent,"Showing 20 of 20 Wild Zones");
console.log("PASS: 20 source zone cards and 38 fixed targets, complete 67-entry saved pool, filters/search, 25 link menu and no network writes.");

const cityRecord=JSON.parse(read('docs/qa/ATLAS_AT342_CITY_ALPHA_DRATINI_FOLLOWUP.json'));
const dratiniCard=html.match(/<article class="step-card" id="alpha-dratini-rooftops">([\s\S]*?)<\/article>/)?.[1];
assert.ok(dratiniCard);
for(const term of ["Lv. 38–39","Lv. 28–29","not guaranteed","Restaurant Le Nah","Café Kizuna","Hibernal Pokémon Center","Roto-Glide","Bleu 9, Jaune 3, Magenta 8 and Rouge 8","not exact pins"]){
  assert.ok(dratiniCard.includes(term),term);
}
assert.match(source,/href="alphas.html#alpha-dratini-rooftops"/);
assert.deepEqual(Object.fromEntries(cityRecord.locations.map(row=>[row.area_id,row.location_key])),{
  "bleu-sector-9":47,"jaune-sector-3":86,"jaune-sector-5":88,"magenta-sector-8":63,"rouge-sector-8":79,"vert-sector-6":24
});
assert.ok(cityRecord.locations.every(row=>row.ordinary.join()=== "28,29" && row.alpha.join()==="38,39"));

/* 2026-11-26: scoped Alpha fieldbook fact-check; no mutation of fixed zone or map data. */
const cityAlphaCard=id=>{const start=html.indexOf('<article class="step-card" id="'+id+'">');return start<0?null:html.slice(start,html.indexOf("</article>",start)+10)};
const riolu=cityAlphaCard("alpha-riolu-rooftops");
const otherCity=cityAlphaCard("alpha-more-city-chances");
assert.ok(riolu && otherCity, "Chance Alpha guides must be present");
for (const text of ["Rouge Sector 4","Bleu Sector 5","Vert Sector 8","Magenta Sector 9","not guaranteed","not exact verified map coordinates"])
  assert.ok(riolu.includes(text), "Missing qualified Riolu claim: " + text);
for (const text of ["Ralts","Larvitar","Dedenne","Vert Sector 4","Bleu Sector 7","Magenta Sector 7","Rouge Sector 7","Jaune Sector 6","Jaune Sector 11","after that zone’s Pokédex survey is complete"])
  assert.ok(otherCity.includes(text), "Missing qualified city chance Alpha: " + text);
assert.equal((html.match(/class="alpha-zone-card"/g)||[]).length,20);
assert.ok(html.includes('id="alpha-dratini-rooftops"'), "Existing Dratini retained");
assert.ok(html.includes("No new Alpha pins, estimated coordinates or invented access points"));


/* Follow-on international source review: one page, one new explanatory section. */
const alphaBenefits=html.match(/<section class="panel" id="alpha-benefits">([\s\S]*?)<\/section>/)?.[1];
assert.ok(alphaBenefits,"Verified Alpha trait guide must exist");
for(const phrase of ["three perfect IVs","Individual Values (IVs) at 31","252 HP EVs","mastered as a Plus Move","Exp. Candy","Seeds of Mastery","not","random city Alpha"])
  assert.ok(alphaBenefits.includes(phrase),"Alpha trait source qualification absent: "+phrase);
assert.ok(html.includes('href="#alpha-benefits"'),"Alpha traits should be discoverable from hero");
assert.equal((html.match(/id="alpha-benefits"/g)||[]).length,1);

const cityData=JSON.parse(read('atlas-area-evidence.json'));
const speciesRows=cityData.areas.flatMap(a=>a.encounters.filter(r=>r.species==='Dratini').map(r=>({...r,area:a.area_id})));
assert.equal(speciesRows.length,6);
for(const row of speciesRows)assert.equal(row.encounter_class,'ordinary');
assert.equal(cityRecord.limits.new_pins,0);
assert.equal(cityRecord.limits.complete_city_alpha_audit,false);

const leNah = html.match(/<p id="alpha-dragonair-rooftop">([^\n]+)<\/p>/)?.[1];
assert.ok(leNah);
assert.match(leNah,/Restaurant Le Nah/);
assert.match(leNah,/Lv\. 30–32 normally/);
assert.match(leNah,/Lv\. 40–42 if Alpha/);
assert.doesNotMatch(leNah,/clear daylight/);
assert.match(dratiniCard,/Café Kizuna roof, Jaune Sector 5:[^\n]+Try this roof during clear daylight\./);
const canal = cityAlphaCard("alpha-goomy-sliggoo-canal");
assert.ok(canal);
for (const text of ["While it’s raining","Saison Canal","seen here in rainy weather at night","Goomy at Lv. 49","Sliggoo at Lv. 53","fast-travel back to Justice Dojo","quest-4","#zone-20"]) {
  assert.ok(canal.includes(text),text);
}
assert.doesNotMatch(canal,/only at night|must be night/i);

const wz15 = restored[14];
assert.match(wz15,/Gourgeist<\/span><span class="alpha-level">Lv\. 52–53 · After survey/);
assert.match(wz15,/Register Beedrill, Haunter, Larvitar, Shuppet, Whirlipede, Scolipede and Pumpkaboo/);
assert.match(wz15,/central grass by day or night/);
assert.match(wz15,/Gourgeist itself is not a survey target/);
const pyroar = revisedTargets(restored[16]).filter(x=>x.name==="Pyroar");
assert.deepEqual(pyroar.map(x=>x.level),["Lv. 56–57 · Male · Day","Lv. 56–57 · Male · Night"]);
