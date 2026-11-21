import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("alphas.html"),source=read("src/sections/alphas.html"),menuTemplate=read("src/template.html"),js=read("alphas.js"),css=read("alphas.css");
const legacy=[...source.matchAll(/<article class="alpha-card">([\s\S]*?)<\/article>/g)].map(x=>x[1]);
const restored=[...html.matchAll(/<article class="alpha-zone-card"([\s\S]*?)<\/article>/g)].map(x=>x[0]);
assert.equal(legacy.length,20,"Original source must contain all 20 zones");
assert.equal(restored.length,20,"Standalone fieldbook must retain 20 zone cards");
const originalTargets=x=>[...x.matchAll(/data-dex-name="([^"]+)"[^>]*>[^<]+<\/button><small>([^<]+)<\/small>/g)].map(y=>({name:y[1],level:y[2]}));
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
assert.equal(revisedTargets(restored[19]).length,67);
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
