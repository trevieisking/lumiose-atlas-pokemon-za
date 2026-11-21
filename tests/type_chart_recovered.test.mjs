import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("type-chart.html"),rulesCode=read("type-chart-data.js"),js=read("type-chart.js");
const css=read("type-chart.css"),template=read("src/template.html");
const dataContext={window:{}};runInNewContext(rulesCode,dataContext);
const rules=dataContext.window.ATLAS_TYPE_RULES;
const types=rules.map(x=>x.type);
const effectiveness=(a,d)=>{
 const row=rules.find(x=>x.type===a);
 assert.ok(row&&types.includes(d),"Types must exist: "+a+" → "+d);
 return row.zero.includes(d)?0:row.super.includes(d)?2:row.half.includes(d)?0.5:1;
};
assert.equal(rules.length,18);
assert.equal(new Set(types).size,18);
assert.equal(types.join(","),"Normal,Fire,Water,Electric,Grass,Ice,Fighting,Poison,Ground,Flying,Psychic,Bug,Rock,Ghost,Dragon,Dark,Steel,Fairy");
for(const row of rules){
 assert.equal(new Set([...row.super,...row.half,...row.zero]).size,row.super.length+row.half.length+row.zero.length,"No conflicting effectiveness for "+row.type);
 for(const defender of [...row.super,...row.half,...row.zero])assert.ok(types.includes(defender));
}
const pdfWeak={
Normal:"Fighting", Fire:"Water,Ground,Rock", Water:"Electric,Grass", Electric:"Ground",
Grass:"Fire,Ice,Poison,Flying,Bug", Ice:"Fire,Fighting,Rock,Steel", Fighting:"Flying,Psychic,Fairy",
Poison:"Ground,Psychic", Ground:"Water,Grass,Ice", Flying:"Electric,Ice,Rock", Psychic:"Bug,Ghost,Dark",
Bug:"Fire,Flying,Rock", Rock:"Water,Grass,Fighting,Ground,Steel", Ghost:"Ghost,Dark",
Dragon:"Ice,Dragon,Fairy", Dark:"Fighting,Bug,Fairy", Steel:"Fire,Fighting,Ground", Fairy:"Poison,Steel"};
for(const [defense,expected] of Object.entries(pdfWeak)){
 const incoming=types.filter(a=>effectiveness(a,defense)===2).sort().join(",");
 assert.equal(incoming,expected.split(",").sort().join(","),"Incorrect PDF weakness card "+defense);
}
const immunities={
Normal:"Ghost",Fire:"",Water:"",Electric:"",Grass:"",Ice:"",Fighting:"",Poison:"",Ground:"Electric",Flying:"Ground",
Psychic:"",Bug:"",Rock:"",Ghost:"Normal,Fighting",Dragon:"",Dark:"Psychic",Steel:"Poison",Fairy:"Dragon"};
for(const [defense,expected] of Object.entries(immunities)){
 assert.equal(types.filter(a=>effectiveness(a,defense)===0).sort().join(","),expected.split(",").filter(Boolean).sort().join(","),"Incorrect PDF immunity "+defense);
}
const sample=[
["Water","Fire","Ground",4],["Electric","Water","Ground",0],["Rock","Fire","Flying",4],
["Fighting","Normal","Ghost",0],["Ice","Dragon","Flying",4],["Fairy","Dragon","Dark",4],
["Fire","Fire","Water",0.25],["Normal","Normal","",1]
];
for(const [a,d1,d2,result] of sample){
 const got=effectiveness(a,d1)*(d2?effectiveness(a,d2):1);
 assert.equal(got,result,"Dual-type matchup "+a+" versus "+d1+"/"+d2);
}
const matrixCells=[...html.matchAll(/<td data-attack="([^"]+)" data-defender="([^"]+)" data-effect="([^"]+)"/g)];
assert.equal(matrixCells.length,18*18,"All 324 cells visible without JavaScript");
for(const cell of matrixCells)assert.equal(Number(cell[3]),effectiveness(cell[1],cell[2]),"PDF chart mismatch "+cell[1]+" versus "+cell[2]);
assert.equal(new Set(matrixCells.map(x=>x[1]+"|"+x[2])).size,324);
assert.equal((html.match(/data-type-card="/g)||[]).length,18,"All 18 reference cards required");
for(const t of types)assert.ok(html.includes('id="type-'+t.toLowerCase()+'"'),"Missing type quick reference "+t);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const standard=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav && standard);
assert.equal(nav.replace(' aria-current="page"',"").trim(),standard.trim(),"Article must match all menu routes");
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.ok(nav.includes('href="type-chart.html" aria-current="page"'));
for(const path of ["index.html","journey.html","boss-guide.html","royale-guide.html","recovered-articles.js","recovered-articles.css","type-chart.js","type-chart-data.js","type-chart.css","favicon.png","atlas-logo.png","feedback.html"])
  assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing local dependency "+path);
for(const id of ["typeAttack","typePrimary","typeSecondary","typeMatchupResult","typeMatchupFormula","typeBestAttacks","typeMatrix","typeMatrixScroll","atlasArticleFeedback"])assert.ok(html.includes('id="'+id+'"'),"Missing markup "+id);
assert.match(html,/<select id="typeAttack">[\s\S]*?<option value="Water" selected>/);
assert.match(html,/<select id="typePrimary">[\s\S]*?<option value="Fire" selected>/);
assert.match(html,/<select id="typeSecondary">[\s\S]*?<option value="Ground" selected>/);
assert.match(css,/@media\(max-width:620px\)/);
assert.match(css,/overflow-x:auto/);
assert.match(css,/position:sticky/);
assert.doesNotMatch(html+js+css+rulesCode,/sb_secret_|service_role_key|sk-proj-|github_pat_|SUPABASE_SERVICE_ROLE_KEY/i);
assert.doesNotMatch(js+rulesCode,/\bfetch\s*\(|localStorage|sessionStorage|XMLHttpRequest/);
function node(value="",dataset={}){
 return {value,dataset,textContent:"",events:{},active:{},classList:{toggle(key,enabled){this.active[key]=enabled}},addEventListener(e,cb){this.events[e]=cb}};
}
const elements={
typeAttack:node("Water"),typePrimary:node("Fire"),typeSecondary:node("Ground"),
typeMatchupResult:node(),typeMatchupFormula:node(),typeBestAttacks:node()
};
const tableRows=types.map(x=>node("",{attackRow:x}));
const tableHeads=types.map(x=>node("",{defenseHeading:x}));
const tableCells=matrixCells.map(x=>node("",{attack:x[1],defender:x[2]}));
const document={
getElementById:id=>elements[id]??null,
querySelectorAll:selector=>selector==="[data-attack-row]"?tableRows:selector==="[data-attack][data-defender]"?tableCells:selector==="[data-defense-heading]"?tableHeads:[]
};
runInNewContext(js,{document,window:dataContext.window,Math,Map});
assert.match(elements.typeMatchupResult.textContent,/^4×/);
assert.match(elements.typeMatchupFormula.textContent,/Water attacking Fire \(2×\) × Ground \(2×\) = 4×/);
assert.equal(tableRows.filter(x=>x.active["active-type-row"]).length,1);
assert.equal(tableHeads.filter(x=>x.active["active-type-column"]).length,2);
elements.typeAttack.value="Electric";elements.typeAttack.events.change();
elements.typePrimary.value="Water";elements.typePrimary.events.change();
assert.match(elements.typeMatchupResult.textContent,/^0×/,"Electric into Water/Ground immunity");
elements.typeAttack.value="Fire";elements.typePrimary.value="Fire";elements.typeSecondary.value="Water";
elements.typeSecondary.events.change();
assert.match(elements.typeMatchupResult.textContent,/^¼×/,"Double resistance");
elements.typeAttack.value="Ground";elements.typePrimary.value="Electric";elements.typeSecondary.value="Electric";
elements.typePrimary.events.change();
assert.match(elements.typeMatchupResult.textContent,/^2×/,"Same defender type cannot be counted twice");
assert.match(elements.typeMatchupFormula.textContent,/same type counts only once/);
assert.match(html,/Rogue Mega encounters may override ordinary immunities/);
assert.match(html,/printed matrix \(page 2\)/);
console.log("PASS: owner PDF quick-reference parity, 18×18 matrix, dual type calculator, exact shared menu, mobile accessibility and no network.");
