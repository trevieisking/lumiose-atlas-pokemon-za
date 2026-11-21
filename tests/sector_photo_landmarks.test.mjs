import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("sector-maps.html"),css=read("sector-maps.css");
const match=page.match(/<section class="panel sector-photo-reference" id="photo-landmarks"[^>]*>([\s\S]*?)<\/section>/);
assert.ok(match,"Player-photo landmark panel missing");
const panel=match[1],districts=["Jaune","Vert","Bleu","Magenta","Rouge"];
assert.match(page,/data-photo-batch="owner-map-photographs-2026-11-21"/);
assert.match(panel,/Ten screenshots of the <strong>same in-game Lumiose City map<\/strong>/);
assert.match(panel,/not 48 separate sector maps or verified item pickup dots/);
for(const d of districts)
 assert.ok(panel.includes('<h3>'+d+'</h3>'),"Missing photo-backed district "+d);
assert.equal((panel.match(/class="sector-photo-district"/g)||[]).length,5,"Five districts only");
const lists=[...panel.matchAll(/<ul>([\s\S]*?)<\/ul>/g)];
assert.equal(lists.length,5);
for(const list of lists)
 assert.equal((list[1].match(/<li>/g)||[]).length,6,"Six clear visual references per district");
const links=[...panel.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)];
assert.equal(links.length,32,"30 referenced landmarks + 2 direct directory jumps");
const photoLinks=links.filter(x=>x[1].startsWith("sector-")||x[1].startsWith("wildzone-"));
assert.equal(photoLinks.length,30,"No invented sector maps");
const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
for(const [,href,title]of links){
 assert.ok(ids.has(href),"Unresolved internal photo landmark #"+href+" "+title);
}
for(const needle of ["Hotel Z","Justice Dojo","Rust Syndicate Office","Lumiose Sewers","Dormez Bien Cemetery","Aymis Park","Café Kizuna","Quasartico Inc.","Looker Bureau","Poké Ball Boutique"])
 assert.ok(panel.includes(needle),"Missing legible photographed landmark "+needle);
assert.match(panel,/Yellow arrows<\/b> = access\/travel symbols; precise type unverified/);
assert.match(panel,/Blue exclamations<\/b> = on-screen markers, <em>not confirmed item dots<\/em>/);
assert.match(panel,/scaffold, ladder or Holovator dots after individually checking/);
assert.match(page,/All 48 sectors share the city map; a separate in-game map for every sector/);
assert.match(page,/The ten new city screenshots improve <a href="#photo-landmarks">district navigation<\/a>/);
assert.ok(page.includes('href="#photo-landmarks">Screenshot landmarks</a>'));
assert.equal((page.match(/class="sector-card"/g)||[]).length,48);
assert.equal((page.match(/class="wildzone-card"/g)||[]).length,20);
assert.equal((page.match(/class="zone-item-lead"/g)||[]).length,264);
assert.equal((page.match(/class="sector-screw-lead"/g)||[]).length,51);
assert.equal((page.match(/class="unassigned-screw-lead"/g)||[]).length,49);
assert.match(page,/146<\/strong><span>Archived approximate item search markers/);
assert.doesNotMatch(panel,/data-confirmed-pin|data-map-item|style="left:|localStorage|<img\b/);
assert.match(css,/\.sector-photo-reference/);
assert.match(css,/@media\(max-width:700px\)/);
assert.match(css,/\.sector-photo-district a\{[^}]*min-height:44px/);
console.log("PASS: 10-photo, 5-district landmark guide has 30 grounded navigation links, no exact item claims, preserved 48 sectors, 20 zones, 264 items and 100 Screw references.");
