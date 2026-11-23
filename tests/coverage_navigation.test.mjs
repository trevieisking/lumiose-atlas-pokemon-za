import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {test} from "node:test";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const source=read("src/template.html"),home=read("index.html");
const page=read("coverage.html"),css=read("coverage.css"),archive=read("RECOVERY_STATUS.md");
const label="Coverage and known gaps";

test("AT-274: exact banner destination is native HTML, not raw Markdown",()=>{
  for(const [name,doc] of [["template",source],["compiled home",home]]) {
    assert.equal((doc.match(/href="coverage\.html">Coverage and known gaps<\/a>/g)||[]).length,1,
      name+" must expose the working player-facing destination exactly once");
    assert.doesNotMatch(doc,/href="RECOVERY_STATUS\.md"/,
      "Do not send the player directly to raw Markdown from "+name);
  }
  assert.match(page,/<title>Coverage &amp; Known Gaps — Lumiose Atlas<\/title>/);
  assert.match(page,/<h1>Coverage <em>&amp; known gaps<\/em><\/h1>/);
  assert.match(page,/href="index\.html#walkthrough">← Back to walkthrough<\/a>/);
  assert.ok(archive.startsWith("# Recovery status — 21 November 2026"),
    "Original technical archive must be retained as the untouched source record");
});

test("AT-274: original 17-section generated guide remains byte-exact",()=>{
  let generated=source;
  const slots=[...source.matchAll(/<!--\s*SECTION:([a-z0-9_-]+)\s*-->/g)];
  assert.equal(slots.length,17);
  for(const slot of slots)generated=generated.replace(slot[0],read("src/sections/"+slot[1]+".html"));
  assert.equal(home,generated,"No mission, item, checklist or source data may be lost in a rebuild");
  assert.equal((home.match(/class="mission"/g)||[]).length,42);
  assert.equal((home.match(/data-side-check=/g)||[]).length,203);
  assert.ok((home.match(/data-select-zone=/g)||[]).length>=20);
});

test("AT-274: preserve original 25-link site menu, responsive design and real coverage statements",()=>{
  const menu=source.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
  const articleMenu=page.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(menu && articleMenu);
  assert.equal((articleMenu.match(/<a /g)||[]).length,25);
  assert.equal(articleMenu.trim(),menu.trim(),"Never substitute an incomplete sub-menu");
  for(const id of ["available","needs-verification","source-status","continue-playing"])
    assert.ok(page.includes('id="'+id+'"'),"Missing in-page section "+id);
  for(const text of ["19 / 19","14</b>","5</b>","25 selectable zoom areas","48 searchable sector names",
    "20 Wild Zones","21 Holovator","111 owner-supplied photographs","42 main and postgame",
    "203 side missions","14 Mega Dimension","264 archived item records","100 Colorful Screw",
    "146 numbered","nine detailed Hyperspace layouts","not permanent map pins",
    "17 recovered main-guide sections","578 fingerprinted saved resources"]) {
    assert.ok(page.includes(text),"Coverage provenance or caveat missing: "+text);
  }
  assert.match(css,/@media\(max-width:680px\)/);
  assert.match(css,/min-height:44px/);
  assert.doesNotMatch(page,/href="[^"]*\.md(?:[?#][^"]*)?"/,"No player link to raw Markdown");
  assert.doesNotMatch(page,/localStorage|sessionStorage|fetch\s*\(|supabase|service_role_key|sk-proj-|github_pat_/i);
});

test("AT-274: article anchors, links, styles, scripts and photos are resolvable",()=>{
  const ids=new Set([...page.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
  for(const link of page.matchAll(/\bhref="([^"]+)"/g)) {
    const target=link[1];
    if(target.startsWith("#")){assert.ok(ids.has(target.slice(1)),"Broken in-page link "+target);continue}
    if(/^(https?:|mailto:|tel:|data:)/.test(target))continue;
    const pathname=target.split("#")[0].split("?")[0];
    assert.ok(existsSync(new URL("../"+pathname,import.meta.url)),"Missing local page/style/link "+target);
  }
  for(const m of page.matchAll(/\b(?:src)="([^"]+)"/g))
    assert.ok(existsSync(new URL("../"+m[1],import.meta.url)),"Missing article image/script "+m[1]);
  assert.match(page,/href="atlas-explorer\.html"/);
  assert.match(page,/href="sector-maps\.html#sector-directory"/);
  assert.match(page,/href="feedback\.html"/);
});
