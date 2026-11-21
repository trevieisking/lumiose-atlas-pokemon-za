import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("hyperspace-maps.html"),css=read("hyperspace-maps-guide.css");
const source=read("src/sections/dimension.html"),archive=read("src/sections/maps.html");
const target=read("mega-dimension.html"),template=read("src/template.html");
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

assert.match(archive,/nine recurring Mega Dimension map layouts/,"Saved Maps page must be the source of the nine-map reference");
assert.match(html,/nine enlarged map layouts/);
assert.match(html,/not<\/strong> captured in the four-page saved Maps PDF/);
assert.match(html,/0 of 9/);
assert.match(html,/nine layouts is a claim made by the saved guide, not independent proof/);
assert.match(html,/not<\/strong> nine newly drawn maps/);
assert.match(html,/0 \/ 9/);
const slots=[...html.matchAll(/<article class="hyp-map-capture" id="hyperspace-layout-(\d{2})" data-map-capture="(\d{2})" data-source-state="unavailable">/g)];
assert.equal(slots.length,9,"All nine labelled image positions should be present");
for(let i=0;i<9;i++){
 const n=String(i+1).padStart(2,"0");
 assert.equal(slots[i][1],n);
 assert.equal(slots[i][2],n);
 assert.ok(html.includes('aria-label="Original Hyperspace map layout image '+n+' not in saved PDF"'));
 assert.ok(html.includes("Layout capture "+n));
}
assert.equal((html.match(/class="hyp-capture-art"/g)||[]).length,9);
assert.equal((html.match(/class="hyp-capture-copy"/g)||[]).length,9);
assert.equal((html.match(/Original map image<br>not captured/g)||[]).length,9);
assert.equal((html.match(/data-source-state="unavailable"/g)||[]).length,9);
assert.ok(!/<img[^>]*src="(?:maps\/hyperspace|hyperspace\/|maps\/lumiose-game-map)/i.test(html),"No unrelated city map may be presented as a Hyperspace layout");
const preserved=[...source.matchAll(/<article class="hyper-card"><div class="hyper-top"><span class="hyper-number">([^<]+)<\/span><h3>([^<]+)<\/h3>/g)];
assert.equal(preserved.length,14,"14 actual saved DLC missions must remain intact");
for(let i=0;i<14;i++){
 const m=preserved[i],num=i+1;
 assert.equal(Number(m[1]),num,"Mission order changed");
 assert.ok(html.includes('href="mega-dimension.html#hyper-'+num+'">'+esc(m[2])+'</a>'),"Original DLC mission title or link changed "+num);
 assert.ok(target.includes('id="hyper-'+num+'"'),"Main source-derived Mega Dimension destination absent "+num);
}
assert.equal((html.match(/class="hyp-mission-link"/g)||[]).length,14);
assert.ok(html.includes('href="side-missions.html#quest-120"'));
assert.ok(read("side-missions.html").includes('id="quest-120"'));
assert.ok(html.includes('href="journey.html#dlc-start"'));
assert.ok(read("journey.html").includes('id="dlc-start"'));
for(const a of ["index.html#berries","index.html#walkthrough","index.html#dimension","mega-dimension.html","maps.html","sector-maps.html"]) {
 // Only check links that were authored as internal hyperlinks in this fieldbook.
 if(html.includes('href="'+a+'"')) assert.ok(existsSync(new URL("../"+a.split("#")[0],import.meta.url)));
}
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const overviewNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&overviewNav,"All-guide menu must be available");
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.equal(nav.replace(' aria-current="page"',"").trim(),overviewNav.trim(),"The menu must exactly match the original overview");
assert.match(nav,/href="index\.html#dimension" aria-current="page"/);
assert.match(html,/← Back to walkthrough/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/id="atlasArticleShare"/);
assert.equal((html.match(/<main /g)||[]).length,1);
assert.equal((html.match(/<\/main>/g)||[]).length,1);
assert.doesNotMatch(html,/localStorage\.|type="checkbox"|data-verified-pin|data-confirmed-pin|service_role_key|github_pat_|sk-proj-|sb_secret_/);
assert.doesNotMatch(html,/<iframe|<form|<canvas|<script[^>]*>[^<]+<\/script>/i);
assert.match(css,/min-height:44px/);
assert.match(css,/@media\(max-width:540px\)/);
assert.match(css,/\.hyp-capture-grid/);
assert.match(css,/\.hyp-type-grid/);
for(const match of html.matchAll(/href="([^"]+)"/g)) {
 const link=match[1];if(link.startsWith("#")||link.startsWith("http"))continue;
 const path=link.split("#")[0].split("?")[0];
 if(path)assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Broken local fieldbook link "+link);
}
for(const match of html.matchAll(/<img[^>]+src="([^"]+)"/g)){
 const img=match[1];assert.ok(existsSync(new URL("../"+img,import.meta.url)),"Missing local asset "+img);
}
console.log("PASS: final Hyperspace Maps placeholder replaced with 14 exact saved DLC mission links, 9 explicitly unavailable original images, 25-link menu, complete local links and no state or feedback changes.");
