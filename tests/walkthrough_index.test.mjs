import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("walkthrough.html"),script=read("walkthrough-index.js"),css=read("walkthrough-index.css");
const original=read("src/sections/walkthrough.html"),template=read("src/template.html");
const starts=[...original.matchAll(/<article class="mission" id="mission-(\d+)"/g)];
assert.equal(starts.length,42,"The original source must still contain all 42 missions");
const titlePairs=[],originalPortraits=[];
for(let i=0;i<42;i++){
 const m=starts[i],n=Number(m[1]);
 assert.equal(n,i+1,"Preserved original mission IDs must remain in order");
 const src=original.slice(m.index,i+1<42?starts[i+1].index:original.length);
 const title=src.match(/<div class="mission-title"><strong>([\s\S]*?)<\/strong><span>([\s\S]*?)<\/span><\/div>/);
 const steps=src.match(/<ol class="mission-steps">([\s\S]*?)<\/ol>/);
 const checks=src.match(/<div class="mission-practical"><b>PRACTICAL CHECKS<\/b><ul>([\s\S]*?)<\/ul><\/div>/);
 const tip=src.match(/<div class="field-tip"><b>FIELD TIP<\/b><span>([\s\S]*?)<\/span><\/div>/);
 const map=src.match(/<div class="mission-map-caption"><b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span><\/div>/);
 assert.ok(title&&steps&&checks&&tip&&map,"Missing original mission content #"+n);
 assert.ok(html.includes('id="mission-'+n+'" data-mission="'+n+'"'),"Missing standalone index card "+n);
 assert.ok(html.includes("<h3>"+title[1]+"</h3>"),"Wrong mission title #"+n);
 assert.ok(html.includes('<ol class="route-index-steps">'+steps[1]+"</ol>"),"Original mission steps changed #"+n);
 assert.ok(html.includes("<ul>"+checks[1]+"</ul>"),"Original mission checks changed #"+n);
 assert.ok(html.includes("<p>"+tip[1]+"</p>"),"Original field tip changed #"+n);
 assert.ok(html.includes("<span aria-hidden=\"true\">⌖</span> "+map[1]),"Original map cue changed #"+n);
 assert.ok(html.includes('href="index.html#walkthrough:mission-'+n+'"'),"Full canonical source mission link missing "+n);
 assert.ok(html.includes('href="journey.html#journey-mission-'+n+'"'),"PDF journey link missing "+n);
 const portrait=src.match(/<img[^>]*class="mission-portrait"[^>]*src="([^"]+)"/)?.[1];
 if(portrait)originalPortraits.push(portrait);
 titlePairs.push([n,title[1]]);
}
assert.equal((html.match(/class="route-index-card"/g)||[]).length,42);
assert.equal((html.match(/class="route-index-details"/g)||[]).length,42);
assert.equal((html.match(/class="route-index-steps"/g)||[]).length,42);
assert.equal((html.match(/data-mission-state/g)||[]).length,42);
assert.equal((html.match(/href="index.html#walkthrough:mission-\d+"/g)||[]).length,42);
assert.equal((html.match(/href="journey.html#journey-mission-\d+"/g)||[]).length,42);
assert.equal((html.match(/class="route-index-portrait"/g)||[]).length,originalPortraits.length,"Original source artwork counts differ");
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const mainNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&mainNav);
assert.equal((nav.match(/<a /g)||[]).length,25,"Preserve complete main-guide navigation");
assert.equal(nav.replace(' aria-current="page"',"").trim(),mainNav.trim(),"Menu must exactly match overview");
assert.match(nav,/href="index\.html#walkthrough" aria-current="page"/);
assert.match(html,/← Back to walkthrough/);
assert.match(html,/id="atlasArticleFeedback"/);
assert.match(html,/The original separate Walkthrough article was/);
assert.match(html,/not.*a claim that the inaccessible original standalone source was recovered/);
assert.match(html,/This separate index never resets or changes your saved completion state/);
assert.match(html,/read-only/i);
assert.match(css,/@media\(max-width:520px\)/);
assert.match(css,/min-height:44px/);
assert.doesNotMatch(script,/\bfetch\s*\(|XMLHttpRequest|localStorage\.setItem|localStorage\.removeItem|localStorage\.clear|indexedDB/);
assert.match(script,/localStorage\.getItem\(KEY\)/);
assert.match(script,/lumiose-atlas-reconstruction-v1/);
assert.doesNotMatch(html+css+script,/sb_secret_|service_role_key|github_pat_|sk-proj-|eyJhbGciOi/i);
for(const img of html.matchAll(/<img[^>]*src="([^"]+)"/g)){
 assert.ok(existsSync(new URL("../"+img[1],import.meta.url)),"Missing source image "+img[1]);
}
for(const link of html.matchAll(/href="([^"]+)"/g)){
 const url=link[1];
 if(url.startsWith("#")||url.startsWith("http"))continue;
 const path=url.split("#")[0].split("?")[0];if(!path)continue;
 assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing internal route "+url);
}
function makeNode(extra={}){
 const events={};const attrs={};const classes=new Set();
 return {dataset:{},value:"",hidden:false,textContent:"",open:false,events,attrs,
 ...extra,
 addEventListener(name,cb){events[name]=cb;},
 setAttribute(name,value){attrs[name]=value;},
 classList:{toggle(name,yes){if(yes)classes.add(name);else classes.delete(name)},remove(name){classes.delete(name)},contains(name){return classes.has(name)}},
 querySelector(selector){return this.nodes?.[selector]||null;},
 scrollIntoView(){this.scrolled=true;}
 };
}
const elements={missionIndexSearch:makeNode(),missionIndexVisible:makeNode(),missionIndexEmpty:makeNode(),missionIndexProgress:makeNode()};
const cards=titlePairs.map(([n,title])=>makeNode({
 dataset:{mission:String(n),chapter:n<=4?"arrival":n>=38?"postgame":"the-royale"},
 textContent:title+" MISSION "+n,
 nodes:{"[data-mission-state]":makeNode(),details:makeNode()}
}));
const filters=["all","arrival","the-royale","mega-mysteries","syndicate","final-climb","finale","postgame"].map(x=>makeNode({dataset:{missionChapter:x}}));
const listeners={};let reads=0,writes=0;
let stored=JSON.stringify({check:{"1":true,"42":true},sideCheck:{"15":true},pickup:{"1-0":true},futureField:{a:1}});
const localStorage={getItem(key){assert.equal(key,"lumiose-atlas-reconstruction-v1");reads++;return stored;},setItem(){writes++;throw Error("This is read-only");}};
let hash="";
const document={
 querySelectorAll(selector){if(selector===".route-index-card[data-mission]")return cards;if(selector==="[data-mission-chapter]")return filters;return [];},
 getElementById(id){return id.startsWith("mission-")?cards[Number(id.slice(8))-1]:elements[id]||null;}
};
const window={addEventListener(name,fn){listeners[name]=fn;}};
runInNewContext(script,{document,window,localStorage,location:{get hash(){return hash}},requestAnimationFrame:(fn)=>fn(),Array,Number,JSON,String});
assert.equal(elements.missionIndexProgress.textContent,"2 of 42 marked complete in this browser's main guide. Read-only here.");
assert.equal(cards[0].classList.contains("is-complete"),true);
assert.equal(cards[41].classList.contains("is-complete"),true);
assert.equal(cards[1].classList.contains("is-complete"),false);
assert.equal(elements.missionIndexVisible.textContent,"Showing 42 of 42 missions");
filters[1].events.click();
assert.equal(elements.missionIndexVisible.textContent,"Showing 4 of 42 missions");
filters[0].events.click();
elements.missionIndexSearch.value="Get Your Travel Bag Back";
elements.missionIndexSearch.events.input();
assert.equal(elements.missionIndexVisible.textContent,"Showing 1 of 42 missions");
elements.missionIndexSearch.value="";
elements.missionIndexSearch.events.input();
hash="#mission-42";listeners.hashchange();
assert.equal(cards[41].nodes.details.open,true);
assert.equal(cards[41].scrolled,true);
stored="{not-json";listeners.focus();
assert.match(elements.missionIndexProgress.textContent,/could not be read/);
assert.equal(writes,0,"Never overwrite a saved mission, report or future progress field");
assert.equal(reads,2,"The index only reads on initial load and focus; filtering and deep links never need extra storage access");
console.log("PASS: 42 source-exact mission steps/tips/maps, 25-link menu, working links/images, read-only shared progress, search/filter/hash and mobile UI.");

// AT-348: source-reviewed mission identity, order and introductory purpose notes.
const expectedTitles=["Get Your Travel Bag Back","Escape from the Battle Zone","A New Life in Lumiose City","Battling in the Z-A Royale","The City in the Shadow of Prism Tower","Reaching Rank X","Reaching Rank W","Reaching Rank V","Chase That Mysterious Pokémon","The Secrets of Mega Evolution","A Rogue Mega Slowbro","A Rogue Mega Camerupt","A Rogue Mega Victreebel","Reaching Rank E","A Job for Team MZ","A Rogue Mega Beedrill","A Rogue Mega Hawlucha","A Rogue Mega Banette","Reaching Rank D","A Request from the Rust Syndicate","A Rogue Mega Mawile","A Rogue Mega Barbaracle","A Rogue Mega Ampharos","Reaching Rank C","A Showdown on the Battle Court","An Invitation from the SBC","A Rogue Mega Froslass","A Rogue Mega Altaria","A Rogue Mega Venusaur","Reaching Rank B","A Summons from Vinnie","A Rogue Mega Dragonite","A Rogue Mega Tyranitar","A Rogue Mega Starmie","Reaching Rank A","Prism Tower's Dark Turn","Operation Protect Lumiose","The Future of Lumiose City","The Infinite Z-A Royale","The One That Gives","The One That Takes","To Keep the World in Balance"];
const normalTitle=s=>s.replace(/[’‘]/g,"'").replace(/[!.]$/,"").trim();
assert.deepEqual(titlePairs.map(([n,title])=>[n,normalTitle(title)]),expectedTitles.map((title,i)=>[i+1,title]));
const journey=read("journey.html");
const jTitles=[...journey.matchAll(/<article[^>]*id="journey-mission-(\d+)"[^>]*>[\s\S]*?<h3>([\s\S]*?)<\/h3>/g)].map(m=>[Number(m[1]),normalTitle(m[2])]);
assert.deepEqual(jTitles,expectedTitles.map((title,i)=>[i+1,title]));
for(let n=1;n<=3;n++){const pattern=new RegExp('<p class="mission-purpose" data-mission-purpose="'+n+'">([^<]+)</p>');const a=original.match(pattern),b=html.match(pattern),c=journey.match(pattern);assert.ok(a&&b&&c);assert.equal(a[1],b[1]);assert.equal(a[1],c[1]);}
