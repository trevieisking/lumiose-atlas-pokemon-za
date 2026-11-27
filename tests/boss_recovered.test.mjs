import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=name=>readFileSync(new URL("../"+name,import.meta.url),"utf8");
const html=read("boss-guide.html"),js=read("boss-guide.js"),css=read("boss-guide.css"),source=read("src/template.html"),dataJs=read("boss-guide-data.js");
const vm={window:{}};runInNewContext(dataJs,vm);
const cards=vm.window.ATLAS_ROGUE_BOSSES;
assert.equal(cards.length,28);
assert.deepEqual(["story","dlc","finale"].map(group=>cards.filter(c=>c.group===group).length),[16,10,2]);
assert.equal(new Set(cards.map(c=>c.id)).size,28);
assert.equal((html.match(/data-boss-card(?:\s|>)/g)||[]).length,28);
for(const c of cards){
  assert.ok(html.includes('id="'+c.id+'"'),"Missing boss "+c.name);
  for(const field of ["name","counter","move","watch","tactic"]){
    const escaped=c[field].replace(/&/g,"&amp;").replace(/</g,"&lt;");
    assert.ok(html.includes(escaped),"PDF transcription missing "+c.name+" / "+field);
  }
}
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const main=source.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&main);
assert.equal(nav.replace(' aria-current="page"',"").trim(),main.trim());
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.match(html,/href="index.html#walkthrough"/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/id="bossSearch"/);
assert.match(html,/id="bossNoResults"/);
assert.match(css,/@media\(max-width:800px\)/);
assert.doesNotMatch(html+js+dataJs,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(js,/\bfetch\s*\(|localStorage|sessionStorage/);
for(const name of ["index.html","journey.html","royale-guide.html","recovered-articles.css","recovered-articles.js","boss-guide.css","boss-guide.js","favicon.png","atlas-logo.png"])assert.ok(existsSync(new URL("../"+name,import.meta.url)),"Missing asset "+name);
const nodes={};
function node(dataset={}){return {dataset,value:"",hidden:false,textContent:"",attrs:{},events:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,v){this.events[k]=v}}}
const cardsUI=cards.map(c=>node({bossGroup:c.group,search:[c.name,c.where,c.counter,c.move,c.weak].join(" ").toLowerCase()}));
for(const id of ["bossSearch","bossStatus","bossNoResults"])nodes[id]=node();
const filters=["all","story","dlc","finale"].map(k=>node({bossFilter:k}));
runInNewContext(js,{document:{querySelectorAll:q=>q==="[data-boss-card]"?cardsUI:filters,getElementById:id=>nodes[id]}});
assert.equal(nodes.bossStatus.textContent,"28 of 28 boss cards shown");
filters[1].events.click();assert.equal(nodes.bossStatus.textContent,"16 of 28 boss cards shown");
filters[2].events.click();assert.equal(nodes.bossStatus.textContent,"10 of 28 boss cards shown");
nodes.bossSearch.value="darkrai";nodes.bossSearch.events.input();assert.equal(nodes.bossStatus.textContent,"1 of 28 boss cards shown");
nodes.bossSearch.value="not-a-boss";nodes.bossSearch.events.input();assert.equal(nodes.bossNoResults.hidden,false);


const homeHtml=read("home-connection.html");
const homeBossPortraits=[
  ["Mega Staraptor","Staraptor"],
  ["Mega Tatsugiri","Tatsugiri"],
  ["Mega Heatran","Heatran"],
  ["Mega Darkrai","Darkrai"],
  ["Primal Groudon","Groudon"],
  ["Primal Kyogre","Kyogre"],
  ["Mega Rayquaza","Rayquaza"],
  ["Mega Zeraora","Zeraora"]
];
for(const [bossName,species] of homeBossPortraits){
  const homeLine=homeHtml.split("\n").find(line=>line.includes('alt="'+species+' Pokémon portrait"'));
  const bossLine=html.split("\n").find(line=>line.includes("<h3>"+bossName+"</h3>"));
  const homeSrc=homeLine?.match(/src="([^"]+)"/)?.[1];
  const bossSrc=bossLine?.match(/<img src="([^"]+)"/)?.[1];
  assert.ok(homeSrc&&bossSrc,"Missing portrait reference for "+bossName);
  assert.equal(bossSrc,homeSrc,"Boss portrait must match HOME catalogue: "+bossName);
}
const permittedExternalImages=new Set([
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/398.png",
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/978.png"
]);
const allBossImages=[...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map(match=>match[1]);
assert.equal(allBossImages.length,28,"All 28 boss-page images must be checked");
for(const src of allBossImages){
  if(src.startsWith("https://")){
    assert.ok(permittedExternalImages.has(src),"Unexpected external boss image: "+src);
  }else{
    assert.ok(existsSync(new URL("../"+src,import.meta.url)),"Missing local boss image: "+src);
  }
}

console.log("PASS: 28 PDF boss cards, 25-link menu, internal assets, responsive cards, offline filters and unchanged player state.");


/* AT-268: archive parity — every boss portrait must actually exist, or be an
 * already documented external HOME sprite. Do not silently break images again.
 * This check uses only read-only resources and never touches player progress. */
const homeCtx={window:{}};
runInNewContext(read("home-dex-data.js"),homeCtx);
const homeByNumber=new Map(homeCtx.window.ATLAS_HOME_SOURCE.records.map(r=>[r.number,r]));
const portraitSources=[...html.matchAll(/<article class="boss-card"[\s\S]*?<img\s+src="([^"]+)"\s+alt="([^"]+)"[^>]*>/g)]
  .map(m=>({src:m[1],alt:m[2]}));
assert.ok(portraitSources.length>=26,"All pictured boss cards need real source assets");
for(const {src,alt} of portraitSources){
  assert.match(alt,/species portrait/i,"Boss art must retain its form-accuracy disclosure");
  if(src.startsWith("https://")){
    const match=src.match(/^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/master\/sprites\/pokemon\/other\/home\/(\d+)\.png$/);
    assert.ok(match,"No unreviewed external boss-image host");
    const ref=homeByNumber.get(Number(match[1]));
    assert.ok(ref&&ref.image===src&&ref.imageSource==="external-sprite-fallback",
      "External boss art must match the already-working HOME guide's disclosed source");
  }else{
    assert.ok(existsSync(new URL("../"+src,import.meta.url)),"Broken local Rogue Mega Boss image: "+src);
  }
}
for(const n of [398,978,485,491,383,382,384,807]){
  const ref=homeByNumber.get(n);
  assert.ok(ref,"Missing species in trusted HOME source: "+n);
  assert.ok(html.includes('src="'+ref.image+'"'),"Broken boss gallery fallback for "+ref.name);
  assert.ok(!html.includes('src="dex-art/'+n+'.webp"'),"Missing image path has regressed for "+ref.name);
}
