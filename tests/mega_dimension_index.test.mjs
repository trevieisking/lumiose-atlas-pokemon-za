import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("mega-dimension.html"),css=read("mega-dimension-index.css");
const source=read("src/sections/dimension.html"),template=read("src/template.html");
const starts=[...source.matchAll(/<article class="hyper-card">/g)];
assert.equal(starts.length,14,"Preserved DLC source must have 14 Hyperspace missions");
for(let i=0;i<starts.length;i++){
 const n=i+1,raw=source.slice(starts[i].index,i+1<starts.length?starts[i+1].index:source.indexOf('</div><div class="precision-map">'));
 const title=raw.match(/<h3>([\s\S]*?)<\/h3>/)?.[1];
 const steps=raw.match(/<ol class="hyper-steps">([\s\S]*?)<\/ol>/)?.[1];
 const detour=raw.match(/<details class="journey-detour">([\s\S]*?)<\/details>/)?.[0];
 assert.ok(title&&steps,"Original DLC route incomplete "+n);
 assert.ok(html.includes('id="hyper-'+n+'"'),"Missing standalone route "+n);
 assert.ok(html.includes("<h3>"+title+"</h3>"),"Title not source exact "+n);
 assert.ok(html.includes('<ol class="dlc-index-steps">'+steps+"</ol>"),"Original steps altered "+n);
 if(detour)assert.ok(html.includes(detour),"Original optional side requests altered "+n);
 assert.ok(html.includes('href="journey.html#hyper-'+n+'"'),"Missing journey deep link "+n);
}
assert.equal((html.match(/class="dlc-index-card"/g)||[]).length,14);
assert.equal((html.match(/class="dlc-index-steps"/g)||[]).length,14);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const originalNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&originalNav);
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.equal(nav.replace(' aria-current="page"',"").trim(),originalNav.trim());
assert.match(nav,/href="index\.html#dimension" aria-current="page"/);
assert.match(html,/← Back to walkthrough/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/source-derived standalone index/);
assert.match(html,/original separate standalone Mega Dimension article/);
assert.match(html,/nine detailed Hyperspace map layouts remain uncaptured/);
assert.match(html,/adds no checkboxes and never writes saved data/);
assert.doesNotMatch(html,/<input[^>]*type="checkbox"|localStorage\.setItem|service_role_key|sk-proj-|github_pat_/);
assert.match(css,/@media\(max-width:600px\)/);
assert.match(css,/min-height:44px/);
for(const link of html.matchAll(/href="([^"]+)"/g)){
 const href=link[1];if(href.startsWith("#")||href.startsWith("http"))continue;
 const path=href.split("#")[0].split("?")[0];
 if(path)assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing local route "+href);
}
for(const img of html.matchAll(/<img[^>]*src="([^"]+)"/g)){
 assert.ok(existsSync(new URL("../"+img[1],import.meta.url)),"Missing image "+img[1]);
}
console.log("PASS: 14 original DLC missions with source-exact steps and side request notes, 25-link menu, live local links, read-only page and responsive layout.");
