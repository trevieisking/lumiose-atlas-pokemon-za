import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("side-missions.html"),css=read("side-missions-index.css");
const js=read("side-missions-index.js"),source=read("src/sections/sidequests.html");
const template=read("src/template.html"),mainJS=read("app.js");
const original=[...source.matchAll(/<article class="side-quest" id="quest-(\d+)">([\s\S]*?)<\/article>/g)];
const recovered=[...html.matchAll(/<article class="side-quest restored-side-quest" id="quest-(\d+)" data-quest-key="([^"]+)" data-quest-category="([^"]+)">([\s\S]*?)<\/article>/g)];
assert.equal(original.length,203,"The archived guide must retain 200 numbered and 3 EX requests");
assert.equal(recovered.length,203,"Every original quest must be restored exactly once");
const categoryCounts={base:0,dlc:0,ex:0};
const names=[];
for(let i=0;i<203;i++){
 const n=i+1,raw=original[i][2],restored=recovered[i][4];
 const key=n<=200?String(n):"EX"+(n-200);
 const category=n<=119?"base":n<=200?"dlc":"ex";
 assert.equal(Number(original[i][1]),n,"Original request out of sequence");
 assert.equal(Number(recovered[i][1]),n,"Restored quest ID out of sequence");
 assert.equal(recovered[i][2],key,"Restored persisted completion key mismatch");
 assert.equal(recovered[i][3],category,"Wrong request filter category");
 categoryCounts[category]++;
 const title=raw.match(/<strong>([\s\S]*?)<\/strong><details class="side-route">/)?.[1];
 const number=raw.match(/<span class="side-quest-number">([\s\S]*?)<\/span>/)?.[1];
 assert.ok(title&&number,"Missing request heading "+key);
 assert.ok(restored.includes("<strong>"+title+"</strong>"),"Wrong quest title "+key);
 assert.ok(restored.includes('<span class="side-quest-number">'+number+"</span>"),"Wrong original display number "+key);
 names.push([key,title,raw]);
 const lines=[...raw.matchAll(/<p><b>(Unlock|Start|Reward|Exact solution):<\/b>([\s\S]*?)<\/p>/g)];
 assert.deepEqual(lines.map(x=>x[1]),["Unlock","Start","Reward","Exact solution"],"Original side request fields missing "+key);
 for(const line of lines)assert.ok(restored.includes(line[0]),"Changed original metadata "+key+"/"+line[1]);
 const originalSteps=raw.match(/<ol class="answer-steps">([\s\S]*?)<\/ol>/)?.[1];
 assert.ok(originalSteps,"Source answer notes missing for "+key);
 assert.ok(restored.includes('<ol class="answer-steps">'+originalSteps+"</ol>"),"Original field instructions changed "+key);
 assert.ok(restored.includes('href="index.html#sidequests:quest-'+n+'"'),"Broken original guide deep-link for "+key);
 assert.ok(restored.includes('data-side-check="'+key+'" type="checkbox" disabled'),"Read-only checkbox not enforced "+key);
 assert.ok(restored.includes('data-quest-status'),"Read-only completion text missing "+key);
 assert.ok(html.includes('id="quest-'+n+'"'));
 if(n>200)assert.ok(restored.includes('id="quest-'+key+'"'),"Original EX link target missing "+key);
}
assert.deepEqual(categoryCounts,{base:119,dlc:81,ex:3});
assert.equal((html.match(/class="side-quest restored-side-quest"/g)||[]).length,203);
assert.equal((html.match(/data-quest-status>/g)||[]).length,203);
assert.equal((html.match(/type="checkbox" disabled/g)||[]).length,203);
assert.match(html,/id="sideMissionSearch"/);
assert.match(html,/This working replacement index comes from the preserved/);
assert.match(html,/not<\/em> a recreation of the missing original article layout/);
assert.match(html,/<strong>read-only<\/strong>/);
assert.match(html,/href="index\.html#walkthrough"/);
assert.match(html,/id="atlasArticleFeedback"/);
const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const mainNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&mainNav);
assert.equal((nav.match(/<a /g)||[]).length,25);
assert.equal(nav.replace(' aria-current="page"',"").trim(),mainNav.trim(),"Global overview navigation must remain identical");
assert.match(nav,/href="index\.html#sidequests" aria-current="page"/);
assert.match(css,/@media\(max-width:530px\)/);
assert.match(css,/min-height:44px/);
assert.doesNotMatch(html,/REBUILD STATUS|unrecovered-route|<script[^>]*app\.js|data-go=|src="http/);
assert.doesNotMatch(js,/\bfetch\s*\(|XMLHttpRequest|localStorage\.(?:setItem|removeItem|clear)|sessionStorage|indexedDB/);
assert.match(js,/localStorage\.getItem\(KEY\)/);
assert.match(js,/lumiose-atlas-reconstruction-v1/);
assert.match(mainJS,/sideCheck:\s*'data-side-check'/);
assert.doesNotMatch(html+css+js,/sb_secret_|service_role_key|github_pat_|sk-proj-|eyJhbGciOi/i);
for(const image of html.matchAll(/<img[^>]*src="([^"]+)"/g))
 assert.ok(existsSync(new URL("../"+image[1],import.meta.url)),"Missing image asset "+image[1]);
for(const link of html.matchAll(/href="([^"]+)"/g)){
 const url=link[1];if(url.startsWith("#")||url.startsWith("http"))continue;
 const path=url.split("#")[0].split("?")[0];if(!path)continue;
 assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Broken local page link "+url);
}
// Exercise client behaviour in an offline DOM/localStorage mock; never write player progress.
function node(extra={}){
 const events={},attrs={},classes=new Set();
 const ret={dataset:{},value:"",checked:false,disabled:false,hidden:false,open:false,
  events,attrs,textContent:"",nodes:{},...extra,
  addEventListener(name,cb){events[name]=cb;},
  setAttribute(name,val){attrs[name]=val;},
  classList:{toggle(name,yes){if(yes)classes.add(name);else classes.delete(name)},contains(name){return classes.has(name)}},
  querySelector(q){return this.nodes?.[q]||null;},
  closest(){return this.parentCard||null;},
  scrollIntoView(){this.scrolled=true;}
 };return ret;
}
const items=names.map(([key,title,raw],i)=>{
 const id=i+1;
 const checkbox=node(),state=node(),detail=node();
 return node({dataset:{questKey:key,questCategory:id<=119?"base":id<=200?"dlc":"ex"},
  textContent:title+" "+raw.replace(/<[^>]+>/g," "),nodes:{"input[data-side-check]":checkbox,"[data-quest-status]":state,"details.side-route":detail}
 });
});
const search=node(),count=node(),empty=node(),progress=node();
const buttons=["all","base","dlc","ex"].map(sideFilter=>node({dataset:{sideFilter}}));
const byId={sideMissionSearch:search,sideIndexVisible:count,sideIndexEmpty:empty,sideIndexProgress:progress};
for(let i=0;i<203;i++)byId["quest-"+(i+1)]=Object.assign(node({parentCard:items[i]}),{});
for(let i=1;i<=3;i++)byId["quest-EX"+i]=node({parentCard:items[199+i]});
const document={
 querySelectorAll(q){if(q===".restored-side-quest[data-quest-key]")return items;if(q==="[data-side-filter]")return buttons;return [];},
 getElementById(id){return byId[id]||null;}
};
let stored=JSON.stringify({check:{"1":true},sideCheck:{"1":true,"120":true,"EX3":true},futureFlag:"preserve"});
let reads=0,writes=0,hash="";
const localStorage={getItem(key){assert.equal(key,"lumiose-atlas-reconstruction-v1");reads++;return stored;},setItem(){writes++;throw Error("Read-only violation");}};
const listeners={},window={addEventListener(name,fn){listeners[name]=fn;}};
runInNewContext(js,{document,window,localStorage,location:{get hash(){return hash;}},requestAnimationFrame:fn=>fn(),Array,Number,JSON,String});
assert.equal(progress.textContent,"3 of 203 marked complete in the original main guide. Read-only on this page.");
assert.equal(count.textContent,"Showing 203 of 203 requests");
assert.equal(items[0].nodes["input[data-side-check]"].checked,true);
assert.equal(items[119].nodes["input[data-side-check]"].checked,true);
assert.equal(items[202].nodes["input[data-side-check]"].checked,true);
assert.equal(items[2].nodes["input[data-side-check]"].checked,false);
for(const item of items)assert.equal(item.nodes["input[data-side-check]"].disabled,true);
buttons[1].events.click();assert.equal(count.textContent,"Showing 119 of 203 requests");
buttons[2].events.click();assert.equal(count.textContent,"Showing 81 of 203 requests");
buttons[3].events.click();assert.equal(count.textContent,"Showing 3 of 203 requests");
buttons[0].events.click();
search.value="Gp58JatW";search.events.input();
assert.equal(count.textContent,"Showing 1 of 203 requests");
search.value="";
hash="#quest-EX3";listeners.hashchange();
assert.equal(items[202].nodes["details.side-route"].open,true);
assert.equal(items[202].scrolled,true);
assert.equal(search.value,"");
assert.equal(count.textContent,"Showing 203 of 203 requests");
hash="#quest-201";listeners.hashchange();
assert.equal(items[200].nodes["details.side-route"].open,true);
stored="{bad json";listeners.focus();
assert.match(progress.textContent,/Could not read/);
assert.equal(writes,0,"No original quest progress or unrelated data may be modified");
assert.equal(reads,2,"Only initial and focus read: filters and deep links must not access storage");
console.log("PASS: 203 source-exact quest fields, 119/81/3 filters, EX aliases, 25-link menu, no writes, mobile and old feedback compatibility.");
