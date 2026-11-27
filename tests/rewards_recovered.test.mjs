import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("rewards.html"),css=read("rewards-guide.css"),shared=read("recovered-articles.js");
const pdfMatchedSource=read("src/sections/rewards.html"),template=read("src/template.html");
const expected=pdfMatchedSource.replace('class="view" id="rewards"','class="rewards-page" id="rewards"')
  .replace('<button class="button primary" data-go="items">Open the screw and item checklist</button>','<a class="button primary" href="items.html">Open the screw and item checklist</a>')
  .replace('<button class="button light" data-go="battles">See the ranks and rewards ↗</button>','<a class="button light" href="battles.html">See the ranks and rewards ↗</a>');
assert.ok(html.includes(expected),"Recovered article must retain every text and card element from the owner's PDF-matched original guide section");
assert.equal((html.match(/<article\b[^>]*>/g)||[]).length,6,"All six original gift/event cards must survive");
for(const [label,source] of [
  ["Shiny Xerneas","dex-art/716.webp"],
  ["Poké Ball Pattern Vivillon","dex-art/666.webp"],
  ["Diancite → Diancie","dex-art/719.webp"],
  ["Mewtwonite X and Y → Mewtwo","dex-art/150.webp"],
  ["Mega Garchomp Z","dex-art/445.webp"]]){
  assert.ok(html.includes("<h3>"+label+"</h3>"),"Missing original reward "+label);
  assert.ok(html.includes('src="'+source+'"'),"Wrong original source image "+label);
}
for(const phrase of ["100 Ultra Balls","CELEBRATE30TH","7 JANUARY 2027","26 FEBRUARY 2027, 01:59 UTC","Special distortion detected!","Garchompite Z","Pokémon HOME","Seeds of Mastery","Colorful Screws","Season X"]){
  assert.ok(html.includes(phrase),"Missing original PDF detail: "+phrase);
}
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const mainNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&mainNav,"Full navigation must appear");
assert.equal((nav.match(/<a /g)||[]).length,25,"All 25 guide links must survive");
assert.equal(nav.replace(' aria-current="page"',"").trim(),mainNav.trim(),"Guide menu must match overview");
assert.match(nav,/href="index\.html#rewards" aria-current="page"/);
assert.match(html,/href="index\.html#walkthrough"/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/href="items\.html"/);
assert.match(html,/href="battles\.html"/);
assert.match(html,/href="home-connection\.html"/);
assert.doesNotMatch(html,/data-go=|unrecovered-route|REBUILD STATUS/);
assert.match(css,/@media\(max-width:590px\)/);
assert.match(css,/min-height:44px/);
assert.doesNotMatch(html+css+shared,/sb_secret_|service_role_key|github_pat_|sk-proj-|localStorage\.clear|localStorage\.removeItem/i);
assert.doesNotMatch(html,/fetch\(|localStorage|sessionStorage|supabase\.co/);
for(const img of html.matchAll(/<img[^>]*src="([^"]+)"/g)){
  assert.ok(existsSync(new URL("../"+img[1],import.meta.url)),"Missing reward artwork: "+img[1]);
}
for(const link of html.matchAll(/href="([^"]+)"/g)){
  const url=link[1];if(url.startsWith("#")||url.startsWith("http"))continue;
  const path=url.split("#")[0].split("?")[0];if(!path)continue;
  assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing internal target: "+url);
}
console.log("PASS: Three-page source parity, six rewards, dated distributions, 25-link menu, 44px mobile actions, imagery and independent feedback.");
