import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("battles.html");
const css=read("battles-guide.css");
const source=read("src/sections/battles.html");
const tpl=read("src/template.html");
const shared=read("recovered-articles.js");
const expected=source
  .replace('class="view" id="battles"','class="battles-page" id="battles"')
  .replace('<button class="button primary" data-go="rewards">Mystery Gifts and hidden rewards ↗</button>','<a class="button primary" href="rewards.html">Mystery Gifts and hidden rewards ↗</a>');
assert.ok(html.includes(expected),"All text, rows, step cards and tips from the owner's 3-page PDF-matched source must survive");
assert.equal((source.match(/<article class="rank-stone">/g)||[]).length,7);
assert.equal((html.match(/<article class="rank-stone">/g)||[]).length,7);
const rankStones=[
 ["Y","Greninjite","658"],["X","Delphoxite","655"],["W","Chesnaughtite","652"],
 ["V","Baxcalibrite","998"],["U","Sceptilite","254"],["T","Swampertite","260"],["S","Blazikenite","257"]
];
for(const [rank,stone,num] of rankStones){
 const originalSrc='src="dex-art/'+num+'.webp"';
 assert.match(html,new RegExp('<span class="rank-letter">'+rank+'</span><img'));
 assert.ok(html.includes("<b>"+stone+"</b>"),"Missing rank reward: "+stone);
 assert.ok(html.includes(originalSrc),"Wrong source species image for "+stone);
 assert.ok(existsSync(new URL("../dex-art/"+num+".webp",import.meta.url)),"Missing illustration for "+stone);
}
for(const point of ["Build a Battle Team","Enter the club","Climb from Z to A","Match, promotion, season.","Score beyond knockouts","Use the arena","Plan for three minutes"]){
 assert.ok(html.includes(point),"Missing source Battle Club content: "+point);
}
for(const cell of ["<td>A</td><td>300</td>","<td>B–E</td><td>200</td>","<td>F–R</td><td>100</td>","<td>S or below</td><td>50</td>"]){
 assert.ok(html.includes(cell),"Missing exact source finishing reward: "+cell);
}
for(const phrase of [
 "13 November 2026 at 06:00 UTC","11 December 2026 at 01:59 UTC",
 "paid Nintendo Switch Online membership","Sport, Safari, Dream and Beast Balls",
 "Fast, Friend, Level, Heavy, Love, Moon and Lure Balls",
 "play at least one match","A Pokémon using one is not required to finish the Mega Evolution Pokédex"
]){
 assert.ok(html.includes(phrase),"Missing source detail: "+phrase);
}
assert.ok(html.includes('id="season-rule-summary"'),"Separately verified special-season rules missing");
for(const text of ["001–228, 231 and 232","001–127, 131 and 132","Level 50",
 "Raichunite X, Charizardite X and Mewtwonite X","not text taken from the owner’s PDF"]){
 assert.ok(html.includes(text),"Independently checked rule note missing "+text);
}
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const mainNav=tpl.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&mainNav,"Shared navigation is missing");
assert.equal((nav.match(/<a /g)||[]).length,25,"The guide's 25-link menu must be preserved");
assert.equal(nav.replace(' aria-current="page"',"").trim(),mainNav.trim(),"Menu must match overview exactly");
assert.match(nav,/href="index\.html#battles" aria-current="page"/);
assert.match(html,/href="index\.html#walkthrough"/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/href="rewards\.html"/);
assert.match(css,/@media\(max-width:590px\)/);
assert.match(css,/\.rank-stone-grid/);
assert.match(css,/min-height:44px/);
assert.match(html,/name="robots" content="noindex,nofollow"/);
assert.doesNotMatch(html,/unrecovered-route|REBUILD STATUS|data-go=|localStorage|sessionStorage|fetch\(/);
assert.doesNotMatch(html+css,/sb_secret_|service_role_key|github_pat_|sk-proj-/i);
assert.doesNotMatch(shared,/\bfetch\s*\(/);
for(const img of html.matchAll(/<img[^>]*\bsrc="([^"]+)"/g)){
 assert.ok(existsSync(new URL("../"+img[1],import.meta.url)),"Missing image file: "+img[1]);
}
for(const link of html.matchAll(/href="([^"]+)"/g)){
 const url=link[1];if(url.startsWith("#")||url.startsWith("http"))continue;
 const path=url.split("#")[0].split("?")[0];if(!path)continue;
 assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Broken local link: "+url);
}
console.log("PASS: three-page PDF source parity, seven ranks, four season tiers, 25-link menu, 8 images, 44px mobile targets, no progress changes.");
