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
