import assert from "node:assert/strict";
import {readFileSync, existsSync} from "node:fs";
import {runInNewContext} from "node:vm";

const html = readFileSync(new URL("../mable-research.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../recovered-articles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../recovered-articles.js", import.meta.url), "utf8");
const mainTemplate = readFileSync(new URL("../src/template.html", import.meta.url), "utf8");
assert.match(html, /Mable’s research/);
assert.match(html, /href="index\.html#walkthrough"/);
assert.match(html, /id="mableRewards"/);
assert.match(html, /name="robots" content="noindex,nofollow"/);
assert.doesNotMatch(html+js, /sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(js, /\bfetch\s*\(/);
assert.match(css, /@media\(max-width:760px\)/);
assert.match(css, /:focus-visible/);

const nav = html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const mainNav = mainTemplate.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav && mainNav, "Both guide menus must exist");
assert.equal(nav.replace(' aria-current="page"', "").trim(), mainNav.trim(), "Restored page must use the same full guide menu");
assert.equal((nav.match(/<a /g)||[]).length, 25);

const rowsHtml = [...html.matchAll(/<tr data-reward-row data-level="(\d+)" data-kind="(tm|supplies|final)"[^>]*>([\s\S]*?)<\/tr>/g)];
assert.equal(rowsHtml.length, 49, "All 49 level 2-50 rewards must be present");
for (let i=0; i<rowsHtml.length; i++) {
  assert.equal(Number(rowsHtml[i][1]),i+2,"Research rewards must remain in level order");
  assert.match(rowsHtml[i][3],new RegExp('data-research-level="'+(i+2)+'"'));
}
const special=Object.fromEntries(rowsHtml.filter(x=>[36,48,49,50].includes(Number(x[1]))).map(x=>[Number(x[1]),x[3]]));
assert.match(special[36],/Bottle Cap ×10/);
assert.match(special[48],/Gold Bottle Cap ×3/);
assert.match(special[49],/Master Ball ×1/);
assert.match(special[50],/Shiny Charm ×1/);
assert.match(html,/TM073/);
assert.match(html,/Surf/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/id="mableReset"/);
const files=["feedback.html","atlas-logo.png","index.html","recovered-articles.js","recovered-articles.css","favicon.png"];
for(const path of files)assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Referenced local file missing: "+path);

const makeNode=(props={})=>({
  ...props,
  value:props.value||"",
  textContent:props.textContent||"",
  dataset:props.dataset||{},
  checked:false,
  hidden:false,
  style:{},
  attrs:{},
  events:{},
  classList:{toggle(){}},
  setAttribute(name,value){this.attrs[name]=value},
  addEventListener(name,fn){this.events[name]=fn}
});
const elements={};
for(const id of ["atlasArticleFeedback","atlasArticleShare","atlasArticleShareStatus","mableRewards","mableProgressLabel","mableProgressMeter","mableProgressFill","mableVisible","mableSearch","mableReset"])elements[id]=makeNode();
const rewardRows=rowsHtml.map(x=>makeNode({dataset:{level:x[1],kind:x[2]},textContent:x[3].replace(/<[^>]*>/g," ")}));
const checkboxes=rowsHtml.map(x=>makeNode({dataset:{researchLevel:x[1]}}));
for(const c of checkboxes)c.matches=(selector)=>selector==="input[data-research-level]";
elements.mableRewards.querySelectorAll=selector=>selector==="tr[data-reward-row]"?rewardRows:selector==="input[data-research-level]"?checkboxes:[];
const filters=["all","tm","supplies","final"].map(kind=>makeNode({dataset:{mableFilter:kind}}));
const stored=new Map();
const context={
  document:{getElementById:id=>elements[id]||null, querySelectorAll:selector=>selector==="[data-mable-filter]"?filters:[]},
  location:{href:"https://test.invalid/lumiose-atlas-pokemon-za/mable-research.html",pathname:"/lumiose-atlas-pokemon-za/mable-research.html",hash:""},
  navigator:{},
  localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,value)},
  confirm:()=>true, URL, JSON, Array, Set, Number, String
};
runInNewContext(js,context);
assert.match(elements.atlasArticleFeedback.href,/feedback\.html\?page=/);
assert.match(elements.atlasArticleFeedback.href,/mable-research\.html/);
assert.equal(elements.mableVisible.textContent,"Showing 49 of 49 rewards");
checkboxes[47].checked=true; // Level 49
elements.mableRewards.events.change({target:checkboxes[47]});
assert.equal(elements.mableProgressLabel.textContent,"1 of 49 rewards marked claimed");
assert.deepEqual(JSON.parse(stored.get("lumiose-atlas-gh-pages-mable-claims-v1")),[49]);
filters[3].events.click();
assert.equal(elements.mableVisible.textContent,"Showing 3 of 49 rewards");
elements.mableSearch.value="Master Ball";
elements.mableSearch.events.input();
assert.equal(elements.mableVisible.textContent,"Showing 1 of 49 rewards");
elements.mableReset.events.click();
assert.equal(elements.mableProgressLabel.textContent,"0 of 49 rewards marked claimed");
assert.deepEqual(JSON.parse(stored.get("lumiose-atlas-gh-pages-mable-claims-v1")),[]);
assert.equal(stored.size,1,"Must never mutate the main guide's progress storage");
console.log("PASS: Mable PDF reward table, 25-link menu parity, searchable filters, isolated progress and feedback return.");
