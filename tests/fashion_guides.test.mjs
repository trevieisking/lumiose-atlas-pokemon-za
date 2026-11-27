import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {test} from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const clothes=read("clothing-guide.html"), hair=read("hair-beauty-guide.html"), shops=read("shops.html"), css=read("fashion-guide.css");
const menu=read("src/template.html").match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)[1];
test("41 distinct boutiques and all five salons",()=>{
 const matches=[...clothes.matchAll(/data-fashion-boutique><dt>([^<]+)<\/dt>/g)].map(x=>x[1]);
 assert.equal(matches.length,41); assert.equal(new Set(matches).size,41);
 assert.equal((hair.match(/data-fashion-salon>/g)||[]).length,5);
 for(const text of ["Mission 012","Mission 051","Mission 030","Mission 031","Mission 032","181","182","183","184","185","₽3,000","₽500"])assert.ok(hair.includes(text),text);
 assert.match(clothes,/₽50,000/);assert.match(clothes,/₽16,000/);
});
test("Both pages preserve the complete 25-link menu and link to each other, shops and walkthrough",()=>{
 for(const doc of [clothes,hair]){
  const nav=doc.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.equal(nav.trim(),menu.trim());assert.equal((nav.match(/<a /g)||[]).length,25);
  for(const href of ["clothing-guide.html","hair-beauty-guide.html","shops.html","index.html#walkthrough"])assert.ok(doc.includes('href="'+href+'"'));
  for(const [,link] of doc.matchAll(/\bhref="([^"]+)"/g)){if(link.startsWith("#"))continue;assert.ok(existsSync(new URL("../"+link.split(/[?#]/)[0],import.meta.url)),link);}
  assert.doesNotMatch(doc,/localStorage|sessionStorage|\bfetch\s*\(|https?:\/\//);
 }
 for(const p of ["clothing-guide.html","hair-beauty-guide.html"])assert.ok(shops.includes('href="'+p+'"'));
 assert.match(css,/@media\(max-width:680px\)/);
});

test("Verified fashion follow-up: exact clothing examples, five flower locations and all ten Furfrou forms",()=>{
 const side=read("side-missions.html");
 for(const id of ["accessory-prices","character-outfits"])assert.ok(clothes.includes('id="'+id+'"'));
 for(const id of ["flabebe-route","furfrou"])assert.ok(hair.includes('id="'+id+'"'));
 for(const name of ["Wooloo Knit Beret","Budew Knit Gloves","Colorful Tights","Mid-Top Sneakers","Simple Studs","Two-Tone Round Satchel","Rectangle Glasses","Short Shorts Set","Flower Earrings"])assert.ok(clothes.includes(name));
 assert.match(clothes,/₽8,900/); assert.equal(2500+1900+1800+2000+700,8900);
 assert.match(clothes,/Main Mission 26/);
 const flower=hair.split('id="flabebe-route"')[1].split("</section>")[0];
 for(const colour of ["Red","Yellow","White","Orange","Blue"])assert.ok(flower.includes("<dt>"+colour+"</dt>"));
 const trim=hair.split('id="furfrou"')[1].split("</section>")[0];
 for(const name of ["Natural Form","Heart","Star","Diamond","Debutante","Matron","Dandy","La Reine","Kabuki","Pharaoh","Psycho Cut","Main Mission 19","Gold Bottle Cap"])assert.ok(trim.includes(name),name);
 for(const n of [12,30,31,32,47,51,62,87,103,181,182,183,184,185]){
  assert.ok((clothes+hair).includes('href="side-missions.html#quest-'+n+'"'));
  assert.ok(side.includes('id="quest-'+n+'"'));
 }
});

test("Fashion feedback preserves the originating guide and existing route format",()=>{
 for(const doc of [clothes,hair]){
  assert.equal((doc.match(/id="atlasArticleFeedback"/g)||[]).length,1);
  assert.match(doc,/<a class="action feedback" id="atlasArticleFeedback" href="feedback\.html">/);
 }
 const shared=read("recovered-articles.js");
 assert.match(shared,/getElementById\("atlasArticleFeedback"\)/);
 assert.match(shared,/url\.searchParams\.set\("page", location\.pathname \+ location\.hash\)/);
 const feedback=read("feedback.js");
 const pagePattern=/^\/(?:[a-z0-9-]+(?:\.html)?(?:\/[a-z0-9-]+(?:\.html)?)*)?(?:#[a-z0-9-]+)?$/i;
 for(const p of ["clothing-guide.html#accessory-prices","hair-beauty-guide.html#furfrou"]){
  assert.ok(pagePattern.test("/lumiose-atlas-pokemon-za/"+p));
 }
 assert.ok(feedback.includes("candidate.startsWith(PREFIX)"));
});

test("Treasure advice uses published prices and distinguishes resources",()=>{
 const treasure=shops.split('id="treasure-pocket"')[1].split("</section>")[0];
 for(const [name,price] of [["Big Nugget","20,000"],["Pearl String","10,000"],["Nugget","5,000"],["Big Pearl","4,000"],["Pearl","1,000"]]){
  assert.ok(treasure.includes("<strong>"+name+"</strong></dt><dd>₽"+price+" each</dd>"));
 }
 for(const term of ["Big Haul Power","Item Power","Bonus Ball","Old Amber","Colorful Screws","Mega Shards"])assert.ok(treasure.includes(term));
 assert.ok(clothes.includes('href="shops.html#treasure-pocket"'));
 assert.equal(20000*2+10000,50000);
});
test("Only fashion pages attach the in-page feedback context listener",()=>{
 const js=read("fashion-guide.js");
 for(const doc of [clothes,hair])assert.match(doc,/<script src="fashion-guide\.js" defer><\/script>/);
 assert.match(js,/addEventListener\("hashchange", syncFeedback\)/);
 assert.match(js,/addEventListener\("click", syncFeedback\)/);
 assert.match(js,/url\.searchParams\.set\("page", location\.pathname \+ location\.hash\)/);
 assert.doesNotMatch(js,/fetch\s*\(|localStorage|sessionStorage/);
});

test("Mission 087 gives the conservative salon revisit checkpoint and keeps the quest link",()=>{
 const mission=hair.match(/<dt><a href="side-missions\.html#quest-87">[\s\S]*?<\/dd>/)?.[0]??"";
 assert.match(mission,/Side Mission 062/);
 assert.match(mission,/once Main Mission 30 begins/);
 assert.doesNotMatch(mission,/Main Mission 26/);
 assert.match(mission,/Psycho Cut to unlock La Reine, Kabuki and Pharaoh/);
});

test("Shops style hub includes every existing boutique and salon without changing item sellers",()=>{
 const originalBoutiques=[...clothes.matchAll(/data-fashion-boutique><dt>([^<]+)<\/dt>/g)].map(x=>x[1]);
 const hubBoutiques=[...shops.matchAll(/<li data-style-boutique><strong>([^<]+)<\/strong>/g)].map(x=>x[1]);
 assert.deepEqual(hubBoutiques,originalBoutiques,"Shops directory and clothing fieldbook must have identical 41 store names in arcade order");
 assert.equal(hubBoutiques.length,41);
 const originalSalons=[...hair.matchAll(/<article class="fashion-card" data-fashion-salon>[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(x=>x[1]);
 const hubSalons=[...shops.matchAll(/<article class="shop-style-card" data-style-card data-style-kind="salon" data-style-salon>[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(x=>x[1]);
 assert.deepEqual(hubSalons,originalSalons,"Shops directory must reproduce the five existing salon names");
 assert.equal(hubSalons.length,5);
 assert.equal((shops.match(/data-style-kind="arcade"/g)||[]).length,5);
 for(const name of ["Galerie de la Lune","Passage du Palais","Passage Ombragé","Passage de la Félicité","Promenade du Vent"])assert.ok(shops.includes(name),name);
 for(const anchor of ["fashion-subguides","fashion-arcades","fashion-salons"])assert.ok(shops.includes('id="'+anchor+'"'));
 for(const href of ["clothing-guide.html","hair-beauty-guide.html","hair-beauty-guide.html#furfrou"])assert.ok(shops.includes('href="'+href+'"'));
 assert.match(shops,/<script src="shops-style\.js" defer><\/script>/);
 const styleJs=read("shops-style.js"),styleCss=read("shops.css");
 assert.doesNotThrow(()=>new Function(styleJs));
 assert.doesNotMatch(styleJs,/localStorage|sessionStorage|fetch\s*\(|XMLHttpRequest/);
 assert.match(styleCss,/shop-style-grid/);
 assert.equal((shops.match(/data-shop-card(?:\s|>)/g)||[]).length,18);
 assert.equal((shops.match(/data-shop-item(?:\s|>)/g)||[]).length,200);
});

test('AT-347: first Scuffles unlock hair; Slugfests award alternate colours',()=>{
 const dlc=hair.match(/id="dlc-hair">([\s\S]*?)<\/section>/)[1];
 const outfits=clothes.match(/id="character-outfits">([\s\S]*?)<\/section>/)[1];
 const missions=[read('side-missions.html'),read('src/sections/sidequests.html')];
 assert.match(dlc,/Hyperspace Mission 8/);
 assert.match(outfits,/Canari look for ₽7,000/);
 assert.match(outfits,/White alone costs ₽100,000/);
 for(let n=151;n<=155;n++) {
  assert.match(dlc,new RegExp('quest-'+n+'">Mission '+n+'</a> · '));
  for(const doc of missions) {
   const first=doc.split('id="quest-'+n+'"')[1].split('</article>')[0];
   const rematch=doc.split('id="quest-'+(n+30)+'"')[1].split('</article>')[0];
   assert.match(first,/₽10,000, Mega Shard ×100.*?hair-beauty-guide\.html#dlc-hair/);
   assert.match(rematch,/₽20,000, Mega Shard ×200.*?alternate .*?outfit colours/);
   assert.doesNotMatch(rematch,/hairstyle|at salons/);
  }
 }
});

test('AT-346/347: Floette collection routes are separate from the pastel dye battle',()=>{
 const routes=hair.split('id="floette-colours"')[1].split('</section>')[0];
 assert.match(routes,/Blue Floette.*?#flabebe-route.*?south side.*?Lv\. 19/);
 assert.match(routes,/Orange Floette.*?Main Mission 10.*?Lv\. 20–22.*?maps\.html#wild-zone-7/);
 assert.match(routes,/Side Mission 012 asks to see Flabébé, not Floette/);
 for(const path of ['side-missions.html','src/sections/sidequests.html','index.html']){
  const card=read(path).split('id="quest-51"')[1].split('</article>')[0];
  assert.match(card,/Vivace brings all five opposing Floette\. You do not need to catch or evolve your own/);
  assert.match(card,/type-chart\.html#type-fairy/);
  assert.match(card,/Alpha Houndoom.*?wild-zone-6.*?Sludge Bomb/);
  assert.match(card,/hair-beauty-guide\.html#floette-colours/);
 }
});
