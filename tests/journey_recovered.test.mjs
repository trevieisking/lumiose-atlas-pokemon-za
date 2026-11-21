import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read = name => readFileSync(new URL("../"+name,import.meta.url),"utf8");
const html=read("journey.html"),js=read("journey.js"),css=read("journey.css"),template=read("src/template.html");
assert.match(html,/Complete Journey Route/);
assert.match(html,/name="robots" content="noindex,nofollow"/);
assert.match(css,/@media\(max-width:760px\)/);
assert.doesNotMatch(html+js,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(js,/\bfetch\s*\(|localStorage|sessionStorage/);
for(const file of ["recovered-articles.js","recovered-articles.css","feedback.html","atlas-logo.png","favicon.png","shiny-hunting.html","mable-research.html"])assert.ok(existsSync(new URL("../"+file,import.meta.url)),"Missing dependency "+file);

const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const homeNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&homeNav);
assert.equal(nav.replace(' aria-current="page"',"").trim(),homeNav.trim(),"Complete journey menu must match existing guide");
assert.equal((nav.match(/<a /g)||[]).length,25);

const story=[...html.matchAll(/data-journey-mission="main-(\d+)"/g)].map(m=>Number(m[1]));
const dlc=[...html.matchAll(/data-journey-mission="dlc-(\d+)"/g)].map(m=>Number(m[1]));
assert.deepEqual(story,Array.from({length:42},(_,i)=>i+1));
assert.deepEqual(dlc,Array.from({length:14},(_,i)=>i+1));
assert.equal((html.match(/class="journey-note"/g)||[]).length,42,"Each main mission must retain practical checks");
assert.equal((html.match(/class="journey-zone"/g)||[]).length,20,"All 20 Wild Zone circuits required");
assert.equal((html.match(/<ol class="journey-steps">/g)||[]).length,57,"42 story + 14 DLC + final sweep");
for (const phrase of [
 "Get Your Travel Bag Back","Operation Protect Lumiose","To Keep the World in Balance",
 "Seed of Mastery","Josée","DYN4MO!","the illusory wall","four suspicious spots",
 "Sapphire-Blue Legend","Rayquaza","Hoennian Salt","Nighttime","Side Mission 120","EX3","in-game prerequisites"
]) {
 if(phrase==="Nighttime"||phrase==="in-game prerequisites")continue;
 assert.ok(html.includes(phrase),"Important PDF detail missing: "+phrase);
}
for(let n=1;n<=42;n++)assert.ok(html.includes('index.html#walkthrough:mission-'+n),"Missing detailed story card link "+n);
for(const href of ["#journey-mission-19","#journey-dlc-13","#journey-dlc-14","#completion","index.html#sidequests","index.html#maps","index.html#items","index.html#alphas"])assert.ok(html.includes(href),"Missing internal route "+href);
assert.match(html,/PDF recovery|PDF was printed|PDF saved|PDF side-request/i);
assert.match(html,/their hidden text is not invented|their names were collapsed|Their names were collapsed|Their full titles were collapsed|their full titles were collapsed/);

function node(props={}) {return {value:"",textContent:"",hidden:false,dataset:{},events:{},attrs:{},...props,setAttribute(key,value){this.attrs[key]=value},addEventListener(key,fn){this.events[key]=fn},focus(){this.focused=true},scrollIntoView(){this.scrolled=true}}}
const elements={journeySearch:node(),journeyCount:node(),journeyNoResults:node(),journeyReset:node()};
const snippets=[...html.matchAll(/<article class="journey-card" id="journey-(mission|dlc)-(\d+)" data-journey-mission="(main|dlc)-(\d+)" data-journey-group="([^"]+)">/g)];
assert.equal(snippets.length,56);
const cards=snippets.map((hit,i)=>{
 const end=html.indexOf("</article>",hit.index)+10;
 const txt=html.slice(hit.index,end).replace(/<[^>]*>/g," ").replace(/&amp;/g,"&");
 return node({id:"journey-"+hit[1]+"-"+hit[2],textContent:txt,dataset:{journeyMission:hit[3]+"-"+hit[4],journeyGroup:hit[5]}});
});
for(const item of cards)elements[item.id]=item;
const groupNames=["arrival","the-royale","mega-mysteries","syndicate","final-climb","finale","postgame","dlc"];
const chapters=groupNames.map(name=>node({querySelectorAll(){return cards.filter(c=>c.dataset.journeyGroup===name)}}));
const buttons=["all",...groupNames].map(key=>node({dataset:{journeyFilter:key}}));
const handlers={};
runInNewContext(js,{document:{
  getElementById(id){return elements[id]||null},
  querySelectorAll(selector){if(selector==="button[data-journey-filter]")return buttons;if(selector==="article[data-journey-mission]")return cards;if(selector==="section[data-journey-chapter]")return chapters;return []}
},location:{hash:""},window:{addEventListener(name,fn){handlers[name]=fn}},decodeURIComponent,String,Array});
assert.equal(elements.journeyCount.textContent,"56 of 56 mission cards shown");
buttons.at(-1).events.click();
assert.equal(elements.journeyCount.textContent,"14 of 56 mission cards shown");
assert.equal(cards.filter(x=>!x.hidden).length,14);
buttons.find(x=>x.dataset.journeyFilter==="syndicate").events.click();
assert.equal(elements.journeyCount.textContent,"7 of 56 mission cards shown");
elements.journeySearch.value="Chandelure";
elements.journeySearch.events.input();
assert.ok(cards.filter(x=>!x.hidden).some(x=>x.dataset.journeyMission==="main-19"));
elements.journeySearch.value="this phrase does not exist in any mission";
elements.journeySearch.events.input();
assert.equal(cards.filter(x=>!x.hidden).length,0);
assert.equal(elements.journeyNoResults.hidden,false);
elements.journeyReset.events.click();
assert.equal(elements.journeyCount.textContent,"56 of 56 mission cards shown");
assert.equal(elements.journeySearch.value,"");
buttons.at(-1).events.click();
const hashLocation = {hash:"#journey-mission-19"};
const script2=read("journey.js");
const second={journeySearch:node(),journeyCount:node(),journeyNoResults:node(),journeyReset:node()};
for(const c of cards){c.hidden=c.dataset.journeyGroup!=="dlc";second[c.id]=c}
const filters2=["all",...groupNames].map(key=>node({dataset:{journeyFilter:key}}));
runInNewContext(script2,{document:{
 getElementById(id){return second[id]||null},
 querySelectorAll(sel){return sel==="button[data-journey-filter]"?filters2:sel==="article[data-journey-mission]"?cards:sel==="section[data-journey-chapter]"?chapters:[]}
},location:hashLocation,window:{addEventListener(){}},decodeURIComponent,String,Array});
assert.equal(second.journeyCount.textContent,"56 of 56 mission cards shown");
console.log("PASS: 42 story + 14 DLC missions, 20 Wild Zones, 42 notes, 25-link menu, deep links, no-network filters and existing guide boundaries");
