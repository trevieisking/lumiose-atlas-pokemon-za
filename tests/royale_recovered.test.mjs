import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {runInNewContext} from "node:vm";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const html=read("royale-guide.html"),css=read("royale-guide.css"),js=read("royale-guide.js"),template=read("src/template.html");
assert.match(html,/Story Z-A Royale Promotion Matches/);
assert.match(html,/name="robots" content="noindex,nofollow"/);
assert.match(css,/@media\(max-width:740px\)/);
assert.doesNotMatch(html+js,/sb_secret_|service_role_key|sk-proj-|github_pat_/i);
assert.doesNotMatch(js,/\bfetch\s*\(|localStorage|sessionStorage/);

const nav=html.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const baseNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&baseNav);
assert.equal(nav.replace(' aria-current="page"',"").trim(),baseNav.trim());
assert.equal((nav.match(/<a /g)||[]).length,25);

const battleCards=[...html.matchAll(/<article class="royale-card" id="royale-match-(\d+)" data-royale-card="\1" data-royale-group="(early|middle|late)">/g)];
assert.equal(battleCards.length,10);
const missions=[4,6,7,8,10,14,19,24,30,35];
const teamSizes=[3,3,4,3,4,4,4,4,5,6];
const trainerNames=["Driver Zach","Office Worker Yvon","Grade-Schooler Xavi","Waiter Rintaro","Quasartico Inc. Vinnie","DYN4MO Canari","Fist of Justice Ivor","Rust Syndicate Corbeau","SBC Jacinthe","Team Flare Nouveau Grisham"];
for(let i=0;i<10;i++){
 const start=battleCards[i].index,end=html.indexOf("</article>",start);
 const c=html.slice(start,end);
 assert.match(c,new RegExp('MAIN MISSION '+String(missions[i]).padStart(2,"0")));
 assert.ok(c.includes(trainerNames[i]),"Original trainer missing: "+trainerNames[i]);
 assert.equal((c.match(/class="royale-mon"/g)||[]).length,teamSizes[i]);
 assert.ok(c.includes('href="journey.html#journey-mission-'+missions[i]+'"'));
 assert.ok(c.includes('href="index.html#walkthrough:mission-'+missions[i]+'"'));
}
const images=[...html.matchAll(/<img src="(dex-art\/\d+\.webp)" alt="([^"]+)"[^>]*>/g)];
assert.equal(images.length,40,"Expected 40 illustrations matching the PDF's team members");
for(const img of images)assert.ok(existsSync(new URL("../"+img[1],import.meta.url)),"Missing repo art: "+img[1]);
for(const target of ["DYN4MO!","Café Gallant","Her grandpa","Tarragon","Super Lumiose Galette","Racine Construction","Gwynn","Chandelure","Hotel tournament","Rank V to Rank F"])assert.ok(html.includes(target),"Missing original Royale detail: "+target);
assert.ok((html.match(/Mega Evolves/g)||[]).length>=6);

function node(props={}){return {value:"",textContent:"",hidden:false,dataset:{},events:{},attrs:{},...props,setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.events[k]=fn},focus(){this.focused=true},scrollIntoView(){this.scrolled=true}}}
const elems={royaleSearch:node(),royaleStatus:node(),royaleNoResults:node(),royaleReset:node()};
const cards=battleCards.map((m,i)=>{
 const text=html.slice(m.index,html.indexOf("</article>",m.index)).replace(/<[^>]+>/g," ");
 return node({id:"royale-match-"+(i+1),textContent:text,dataset:{royaleCard:String(i+1),royaleGroup:m[2]}});
});
for(const c of cards)elems[c.id]=c;
const tabs=["all","early","middle","late"].map(filter=>node({dataset:{royaleFilter:filter}}));
const events={},location={hash:""};
runInNewContext(js,{document:{getElementById:id=>elems[id]||null,querySelectorAll:s=>s==="article[data-royale-card]"?cards:s==="button[data-royale-filter]"?tabs:[]},window:{addEventListener(k,fn){events[k]=fn}},location,String});
assert.equal(elems.royaleStatus.textContent,"10 of 10 promotion matches shown");
tabs[2].events.click();
assert.equal(elems.royaleStatus.textContent,"3 of 10 promotion matches shown");
elems.royaleSearch.value="Canari";elems.royaleSearch.events.input();
assert.equal(cards.filter(c=>!c.hidden).length,1);
assert.equal(cards.find(c=>!c.hidden).dataset.royaleCard,"6");
elems.royaleSearch.value="not-a-real-trainer-name";elems.royaleSearch.events.input();
assert.equal(elems.royaleNoResults.hidden,false);
elems.royaleReset.events.click();
assert.equal(elems.royaleStatus.textContent,"10 of 10 promotion matches shown");
tabs[1].events.click();location.hash="#royale-match-10";events.hashchange();
assert.equal(elems.royaleStatus.textContent,"10 of 10 promotion matches shown");
assert.equal(cards[9].hidden,false);
console.log("PASS: ten promotion teams, 40 local portraits, shared 25-link menu, Canari sequence and no-network filters");
