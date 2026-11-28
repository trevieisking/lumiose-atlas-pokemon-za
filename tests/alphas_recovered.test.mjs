import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("alphas.html"),source=read("src/sections/alphas.html"),menuTemplate=read("src/template.html"),js=read("alphas.js"),css=read("alphas.css");
const legacy=[...source.matchAll(/<article class="alpha-card">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
const restored=[...html.matchAll(/<article class="alpha-zone-card"([\s\S]*?)<\/article>/g)].map(x=>x[0]);
assert.equal(legacy.length,20,"Original source must contain all 20 zones");
assert.equal(restored.length,20,"Standalone fieldbook must retain 20 zone cards");
const originalTargets=x=>[...x.matchAll(/data-dex-name="([^"]+)"[^>]*>([^<]+)<\/button><small>([^<]+)<\/small>/g)].map(y=>({name:["Vivillon (Meadow Pattern)","Florges (Red Flower)","Gourgeist (Medium Variety)"].includes(y[2])?y[2]:y[1],level:y[3]}));
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
assert.ok(centralPool.some(r=>r.name==="Gourgeist (Medium Variety)" && r.level==="Lv. 63–64"));
assert.match(legacy[19],/data-dex-name="Gourgeist" type="button">Gourgeist \(Medium Variety\)/);
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
assert.match(wz15,/fixed Medium Variety Alpha Gourgeist/);
assert.match(wz15,/Lv\. 52–53 Alpha Pumpkaboo/);
assert.match(wz15,/Medium or Small Variety by day/);
assert.match(wz15,/Large or Jumbo Variety by night/);
assert.match(wz15,/Alpha Gourgeist of the same variety/);
assert.match(wz15,/separate non-Alpha Jumbo/);
assert.match(wz15,/id="alpha-pumpkaboo-varieties"/);

const regional = html.match(/<section id="alpha-regional-forms"[^>]*>([\s\S]*?)<\/section>/)?.[1];
assert.ok(regional);
const direct = [...regional.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>(\d)★ ([^<]+)<\/td><td>(\d+)–(\d+)<\/td><td>(\d+)–(\d+)<\/td><\/tr>/g)];
assert.equal(direct.length,25);
assert.equal(new Set(direct.map(r=>r[1])).size,19);
assert.ok(direct.every(r=>+r[4]+9===+r[6] && +r[5]+9===+r[7]));
assert.ok(direct.some(r=>r[1]==="Galarian Mr. Mime"&&r[2]==="3"&&r[3]==="Ice"&&r[6]==="42"&&r[7]==="44"));
for(const name of ["Galarian Slowbro","Galarian Slowking"]) {
  assert.ok(direct.some(r=>r[1]===name&&r[2]==="5"&&r[3]==="Poison"&&r[6]==="64"&&r[7]==="66"));
}
for(const quest of [39,72,75,108])assert.ok(regional.includes(`side-missions.html#quest-${quest}`));
assert.match(regional,/No direct catch was found in these generated pools/);

const fossil = cityAlphaCard("alpha-fossils");
assert.ok(fossil);
for (const text of ["₽20,000","₽30,000","second floor","1% Alpha chance","Lv. 20","Lv. 35","3★ Rock","Lv. 33–35 Alpha","4★ Ice","Lv. 46–48 Alpha","5★ Rock","Lv. 62–64 Alpha","Lv. 64–66 Alpha","25,000 Hyperspace Survey Points","quest-27","quest-188","shop-stones"]) {
  assert.ok(fossil.includes(text) && source.includes(text),text);
}
for (const page of ["shops.html","side-missions.html"]) assert.ok(read(page).includes('href="alphas.html#alpha-fossils"'));

const weedleMission = cityAlphaCard("alpha-weedle-mission-43");
assert.ok(weedleMission);
assert.match(weedleMission,/Decline Grandt’s handover request to keep it/);
assert.match(weedleMission,/side-missions\.html#quest-43/);
assert.match(weedleMission,/Wild Zone 1 after completing its survey/);
assert.match(source,/Decline Grandt’s request if you want to keep it/);
assert.match(source,/alphas\.html#alpha-weedle-mission-43/);

// AT-346: mission catch and owned NPC Pokémon are not interchangeable.
assert.equal((html.match(/id="alpha-bunnelby-mission-1"/g)||[]).length,1);
const bunnelby=html.match(/<article class="step-card" id="alpha-bunnelby-mission-1">([\s\S]*?)<\/article>/)?.[1];
assert.ok(bunnelby);
assert.match(bunnelby,/alley east of Wild Zone 4 in Rouge Sector 8/);
assert.match(bunnelby,/defeating it also completes the mission/);
assert.match(bunnelby,/Lv\. 23–25 Alpha Bunnelby/);
assert.match(source,/alphas\.html#alpha-bunnelby-mission-1/);
const rosebud=cityAlphaCard("alpha-rosebud-mission-180");
assert.ok(rosebud);
for(const text of ["Rosebud cannot be caught","3★ Fighting portal","Lv. 37–39","Lv. 31–33","Rage Fist (learned at Lv. 35)","use it 20 times","keeps its Alpha status","side-missions.html#quest-180"])assert.ok(rosebud.includes(text),text);
assert.match(source,/Rosebud is a Lv\. 99 Alpha Annihilape in Wild Zone 6, but cannot be caught/);
assert.match(source,/alphas\.html#alpha-rosebud-mission-180/);

const flower = cityAlphaCard("alpha-flabebe-colours");
assert.ok(flower);
for(const cue of ["Red or white, Jaune Sector 2","alley behind Justice Dojo","climb the ladder","Yellow, orange or blue, Jaune Sector 3","rooftop obstacle course","not a proven requirement","Lv. 20–23","Lv. 21–23","Shiny Stone","Lv. 25–27","Lv. 48–50","hair-beauty-guide.html#flabebe-route"]) {
  assert.ok(flower.includes(cue) && source.includes(cue),cue);
}
const beautyFlowers = read("hair-beauty-guide.html").match(/<section id="flabebe-route">([\s\S]*?)<\/section>/)?.[1];
assert.ok(beautyFlowers.includes('href="alphas.html#alpha-flabebe-colours"'));
assert.ok(beautyFlowers.includes('href="side-missions.html#quest-12"'));

const vivillon = cityAlphaCard("alpha-vivillon-patterns");
assert.ok(vivillon);
for (const cue of ["Lv. 46–47","by day in Wild Zone 13","1★ Flying","1★ Bug","Lv. 24–26","Lv. 22–24","quest-21","gift-poke-ball-vivillon","home-species-666","distribution has ended"]) {
  assert.ok(vivillon.includes(cue) && source.includes(cue),cue);
}
assert.match(read("src/sections/pokedex.html"),/href="alphas\.html#alpha-vivillon-patterns"/);
assert.match(read("rewards.html"),/id="gift-poke-ball-vivillon"/);

// AT-348 A2-15: source-backed interior route buttons on existing base-dex cards.
const interiorDex=read("src/sections/pokedex.html");
for(const [name,anchors] of Object.entries({"Scraggy":["alpha-interior-main-sewers"],"Litwick":["alpha-interior-main-sewers"],"Klefki":["alpha-interior-main-sewers","alpha-interior-canal"],"Noibat":["alpha-interior-main-sewers","alpha-interior-canal","alpha-lysandre-labs"],"Patrat":["alpha-interior-main-sewers"],"Inkay":["alpha-interior-main-sewers","alpha-interior-canal"],"Goomy":["alpha-interior-main-sewers"],"Gastly":["alpha-interior-main-sewers","alpha-interior-old-building"],"Haunter":["alpha-interior-main-sewers"],"Skrelp":["alpha-interior-main-sewers","alpha-interior-canal"],"Dragalge":["alpha-interior-main-sewers"],"Ariados":["alpha-interior-canal"],"Gengar":["alpha-interior-old-building"],"Ekans":["alpha-lysandre-labs"],"Houndour":["alpha-lysandre-labs"],"Electrike":["alpha-lysandre-labs"],"Honedge":["alpha-lysandre-labs"],"Arbok":["alpha-lysandre-labs"],"Houndoom":["alpha-lysandre-labs"],"Manectric":["alpha-lysandre-labs"],"Beldum":["alpha-lysandre-labs"],"Metang":["alpha-lysandre-labs"],"Doublade":["alpha-lysandre-labs"],"Noivern":["alpha-lysandre-labs"]})){
  const marker='<b>Where to get '+name+'</b>',start=interiorDex.indexOf(marker);
  assert.ok(start>=0,name);
  const card=interiorDex.slice(start,interiorDex.indexOf('</article>',start));
  for(const anchor of anchors){assert.ok(card.includes('href="alphas.html#'+anchor+'"'),name+' '+anchor);assert.equal((html.match(new RegExp('id="'+anchor+'"','g'))||[]).length,1);}
}
assert.equal((interiorDex.match(/class="dex-card"/g)||[]).length,232);
assert.match(cityAlphaCard("alpha-interior-main-sewers"),/Bleu Sector 7.*Ice Beam.*Bleu Sector 1/);
assert.match(cityAlphaCard("alpha-interior-canal"),/unresolved repeatable-spawn claim/);
assert.match(cityAlphaCard("alpha-interior-old-building"),/one Lv\. 40 Gastly and two Lv\. 42 Gengar/);
assert.match(cityAlphaCard("alpha-lysandre-labs"),/Mission 35.*Reaching Rank A/);
const essentials=read("src/sections/essentials.html");assert.match(essentials,/2\.0\.2.*19 March 2026/);assert.match(essentials,/9,999/);
for(const page of ["src/sections/sidequests.html","side-missions.html"])assert.match(read(page),/25,000 points each\.<\/li><li>If Special Scanning is stuck/);
for(const page of ["src/sections/walkthrough.html","walkthrough.html","journey.html"])assert.match(read(page),/Lv\. 40 Gastly and two Lv\. 42 Gengar/);
assert.match(read("home-connection.html"),/without purchasing Mega Dimension.*communication features/);

// AT-348 A2-16: actual base-dex acquisition instructions and navigation.
const acquisitionDex=read("src/sections/pokedex.html");
const acquisitionRows=[{"id":31,"name":"Roserade","kinds":["stone"],"pre":"Roselia","links":["index.html#essentials","shops.html#shop-stones"]},{"id":37,"name":"Starmie","kinds":["stone"],"pre":"Staryu","links":["index.html#essentials","shops.html#shop-stones"]},{"id":40,"name":"Florges","kinds":["stone"],"pre":"Floette","links":["index.html#essentials","shops.html#shop-stones"]},{"id":54,"name":"Raichu","kinds":["stone","regional"],"pre":"Pikachu","links":["index.html#essentials","shops.html#shop-stones","side-missions.html#quest-108"]},{"id":57,"name":"Clefable","kinds":["stone"],"pre":"Clefairy","links":["index.html#essentials","shops.html#shop-stones"]},{"id":73,"name":"Aegislash","kinds":["stone"],"pre":"Doublade","links":["index.html#essentials","shops.html#shop-stones"]},{"id":76,"name":"Victreebel","kinds":["stone"],"pre":"Weepinbell","links":["index.html#essentials","shops.html#shop-stones"]},{"id":78,"name":"Simisage","kinds":["stone"],"pre":"Pansage","links":["index.html#essentials","shops.html#shop-stones"]},{"id":80,"name":"Simisear","kinds":["stone"],"pre":"Pansear","links":["index.html#essentials","shops.html#shop-stones"]},{"id":82,"name":"Simipour","kinds":["stone"],"pre":"Panpour","links":["index.html#essentials","shops.html#shop-stones"]},{"id":90,"name":"Gallade","kinds":["stone"],"pre":"Kirlia","links":["index.html#essentials","shops.html#shop-stones"]},{"id":101,"name":"Vaporeon","kinds":["stone"],"pre":"Eevee","links":["index.html#essentials","shops.html#shop-stones"]},{"id":102,"name":"Jolteon","kinds":["stone"],"pre":"Eevee","links":["index.html#essentials","shops.html#shop-stones"]},{"id":103,"name":"Flareon","kinds":["stone"],"pre":"Eevee","links":["index.html#essentials","shops.html#shop-stones"]},{"id":106,"name":"Leafeon","kinds":["stone"],"pre":"Eevee","links":["index.html#essentials","shops.html#shop-stones"]},{"id":107,"name":"Glaceon","kinds":["stone"],"pre":"Eevee","links":["index.html#essentials","shops.html#shop-stones"]},{"id":144,"name":"Eelektross","kinds":["stone"],"pre":"Eelektrik","links":["index.html#essentials","shops.html#shop-stones"]},{"id":171,"name":"Froslass","kinds":["stone"],"pre":"Snorunt","links":["index.html#essentials","shops.html#shop-stones"]},{"id":191,"name":"Chandelure","kinds":["stone"],"pre":"Lampent","links":["index.html#essentials","shops.html#shop-stones"]},{"id":203,"name":"Heliolisk","kinds":["stone"],"pre":"Helioptile","links":["index.html#essentials","shops.html#shop-stones"]},{"id":64,"name":"Alakazam","kinds":["trade"],"pre":"Kadabra","links":["index.html#essentials"]},{"id":67,"name":"Gengar","kinds":["trade"],"pre":"Haunter","links":["index.html#essentials"]},{"id":127,"name":"Machamp","kinds":["trade"],"pre":"Machoke","links":["index.html#essentials"]},{"id":183,"name":"Trevenant","kinds":["trade"],"pre":"Phantump","links":["index.html#essentials"]},{"id":205,"name":"Gourgeist","kinds":["trade"],"pre":"Pumpkaboo","links":["index.html#essentials"]},{"id":139,"name":"Slowking","kinds":["trade","regional"],"pre":"Slowpoke","links":["index.html#essentials","side-missions.html#quest-84","side-missions.html#quest-39","side-missions.html#quest-75"]},{"id":198,"name":"Steelix","kinds":["trade"],"pre":"Onix","links":["index.html#essentials","side-missions.html#quest-101"]},{"id":177,"name":"Scizor","kinds":["trade"],"pre":"Scyther","links":["index.html#essentials","side-missions.html#quest-101"]},{"id":97,"name":"Aromatisse","kinds":["trade"],"pre":"Spritzee","links":["index.html#essentials","side-missions.html#quest-10"]},{"id":99,"name":"Slurpuff","kinds":["trade"],"pre":"Swirlix","links":["index.html#essentials","side-missions.html#quest-14"]},{"id":30,"name":"Roselia","kinds":["friendship"],"pre":"Budew","links":["index.html#essentials"]},{"id":53,"name":"Pikachu","kinds":["friendship"],"pre":"Pichu","links":["index.html#essentials"]},{"id":56,"name":"Clefairy","kinds":["friendship"],"pre":"Cleffa","links":["index.html#essentials"]},{"id":110,"name":"Lopunny","kinds":["friendship"],"pre":"Buneary","links":["index.html#essentials"]},{"id":136,"name":"Lucario","kinds":["friendship","gift"],"pre":"Riolu","links":["index.html#essentials","walkthrough.html#mission-38"]},{"id":104,"name":"Espeon","kinds":["friendship"],"pre":"Eevee","links":["index.html#essentials"]},{"id":105,"name":"Umbreon","kinds":["friendship"],"pre":"Eevee","links":["index.html#essentials"]},{"id":108,"name":"Sylveon","kinds":["friendship"],"pre":"Eevee","links":["index.html#essentials"]},{"id":48,"name":"Pangoro","kinds":["special"],"pre":"Pancham","links":["index.html#essentials"]},{"id":160,"name":"Malamar","kinds":["special"],"pre":"Inkay","links":["index.html#essentials"]},{"id":167,"name":"Goodra","kinds":["special"],"pre":"Sliggoo","links":["index.html#essentials"]},{"id":194,"name":"Tyrantrum","kinds":["special"],"pre":"Tyrunt","links":["index.html#essentials"]},{"id":196,"name":"Aurorus","kinds":["special"],"pre":"Amaura","links":["index.html#essentials"]},{"id":1,"name":"Chikorita","kinds":["gift"],"pre":null,"links":["walkthrough.html#mission-1","home-connection.html#alpha-starters"]},{"id":4,"name":"Tepig","kinds":["gift"],"pre":null,"links":["walkthrough.html#mission-1","home-connection.html#alpha-starters"]},{"id":7,"name":"Totodile","kinds":["gift"],"pre":null,"links":["walkthrough.html#mission-1","home-connection.html#alpha-starters"]},{"id":148,"name":"Bulbasaur","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-22"]},{"id":151,"name":"Charmander","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-22"]},{"id":154,"name":"Squirtle","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-22"]},{"id":134,"name":"Absol","kinds":["gift"],"pre":null,"links":["walkthrough.html#mission-9"]},{"id":213,"name":"Chespin","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-7"]},{"id":217,"name":"Fennekin","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-8"]},{"id":209,"name":"Froakie","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-9"]},{"id":16,"name":"Spewpa","kinds":["gift"],"pre":null,"links":["side-missions.html#quest-21"]},{"id":17,"name":"Vivillon","kinds":["form"],"pre":null,"links":["side-missions.html#quest-21","alphas.html#alpha-vivillon-patterns"]},{"id":39,"name":"Floette","kinds":["form"],"pre":null,"links":["walkthrough.html#mission-39","alphas.html#alpha-flabebe-colours"]},{"id":179,"name":"Heracross","kinds":["npc-trade"],"pre":null,"links":["side-missions.html#quest-2"]},{"id":135,"name":"Riolu","kinds":["npc-trade"],"pre":null,"links":["side-missions.html#quest-24"]},{"id":137,"name":"Slowpoke","kinds":["regional"],"pre":null,"links":["side-missions.html#quest-39"]},{"id":138,"name":"Slowbro","kinds":["regional"],"pre":null,"links":["side-missions.html#quest-39","side-missions.html#quest-75"]},{"id":157,"name":"Stunfisk","kinds":["regional"],"pre":null,"links":["side-missions.html#quest-72"]},{"id":192,"name":"Aerodactyl","kinds":["fossil"],"pre":null,"links":["side-missions.html#quest-27","shops.html#shop-stones","alphas.html#alpha-fossils"]},{"id":193,"name":"Tyrunt","kinds":["fossil"],"pre":null,"links":["side-missions.html#quest-27","shops.html#shop-stones","alphas.html#alpha-fossils"]},{"id":195,"name":"Amaura","kinds":["fossil"],"pre":null,"links":["side-missions.html#quest-27","shops.html#shop-stones","alphas.html#alpha-fossils"]}];
assert.equal(acquisitionRows.length,64);
assert.equal((acquisitionDex.match(/data-acquisition-kind=/g)||[]).length,67);
for(const row of acquisitionRows){const start=acquisitionDex.indexOf('id="dex-base-'+row.id+'"');assert.ok(start>=0,row.name);const card=acquisitionDex.slice(start,acquisitionDex.indexOf('</article>',start));assert.ok(card.includes('<strong>'+row.name+'</strong>'));for(const kind of row.kinds)assert.ok(card.includes('data-acquisition-kind="'+kind+'"'),row.name+' '+kind);if(row.pre)assert.ok(card.includes('data-dex-name="'+row.pre+'"'),row.name+' prerequisite');for(const href of row.links)assert.ok(card.includes('href="'+href+'"'),row.name+' '+href);}
for(const [name,cue] of [["Malamar","upside down"],["Pangoro","Dark-type"],["Goodra","actual rain"],["Gallade","male Kirlia"],["Froslass","female Snorunt"],["Espeon","remove Fairy-type moves"],["Umbreon","remove Fairy-type moves"],["Sylveon","Fairy-type move"],["Floette","15th reward match"],["Slowking","Galarica Wreath"],["Raichu","Lv. 64 Alolan Raichu"]]){const start=acquisitionDex.indexOf('<b>Where to get '+name+'</b>');assert.ok(acquisitionDex.slice(start,acquisitionDex.indexOf('</article>',start)).includes(cue),name);}
assert.match(essentials,/same eight-digit code/);assert.match(essentials,/evolution threshold is 160/);assert.match(essentials,/id="evolution-guide"/);
assert.equal((acquisitionDex.match(/class="dex-card"/g)||[]).length,232);
