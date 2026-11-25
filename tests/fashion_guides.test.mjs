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
 for(const name of ["Natural Form","Heart","Star","Diamond","Debutante","Matron","Dandy","La Reine","Kabuki","Pharaoh","Psycho Cut","Main Mission 15","Gold Bottle Cap"])assert.ok(trim.includes(name),name);
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
