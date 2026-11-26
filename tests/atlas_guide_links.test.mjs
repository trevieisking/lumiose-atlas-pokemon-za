import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync,existsSync} from "node:fs";
import {zoneLinks,sectorLinks,locationLinks,appendGuidePanel} from "../atlas-guide-links.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=JSON.parse(read("atlas-explorer-data.json"));
const checkLink=l=>{
  assert.ok(!l.external);
  const [path,fragment]=l.href.split("#");
  const [file,query]=path.split("?");
  const html=read(file);
  if(fragment)assert.ok(html.includes('id="'+fragment+'"'),l.href);
  if(query){const q=new URLSearchParams(query);assert.ok([...data.zones,...data.sectors,...data.holovators].some(r=>r.id===(q.get("place")||q.get("sector"))),l.href);}
};
test("All 20 original Wild Zones retain the five valid local guide links",()=>{
  for(let n=1;n<=20;n++){const links=zoneLinks(n);assert.equal(links.length,5);links.forEach(checkLink);}
  assert.deepEqual(zoneLinks(21),[]);
});
test("All 48 registered sector crosslinks remain, without inferred points",()=>{
  assert.equal(data.sectors.length,48);
  for(const sector of data.sectors){
    const m=sector.id.match(/^(\w+)-sector-(\d+)$/);
    const links=sectorLinks(m[1],Number(m[2]));
    assert.equal(links.length,3);links.forEach(checkLink);assert.equal(sector.xy,null);
  }
  assert.deepEqual(sectorLinks("vert",10),[]);
});
test("Local mission and Hyperspace links retain precise scope",()=>{
  assert.equal(locationLinks("New Wild Zones 2–6").length,5);
  assert.deepEqual(locationLinks("Nightly battle zone · location changes"),[]);
  assert.deepEqual(locationLinks("Vert Sector 10; Wild Zone 21"),[]);
  assert.deepEqual(locationLinks("Rouge Sector 1 roof, Hyperspace portal").map(x=>x.href),["sector-maps.html#sector-rouge-sector-1","hyperspace-maps.html#portal-types"]);
  for(const href of ["side-missions.html#quest-61","sector-maps.html#sector-directory","maps.html#zone-directory","mega-dimension.html","atlas-explorer.html"])checkLink({href});
  for(const page of ["maps.html","sector-maps.html","alphas.html","items.html","walkthrough.html","side-missions.html","shiny-hunting.html","hyperspace-maps.html","mega-dimension.html"])assert.ok(read(page).includes("recovered-articles.js"),page);
});
test("Shared guide panels accept only local guide destinations",()=>{
  const doc={createElement(tag){return {tag,children:[],setAttribute(){},append(...nodes){this.children.push(...nodes);}}}};
  const host={ownerDocument:doc,children:[],querySelector(){return null},append(node){this.children.push(node)}};
  const external=[{href:"https://www.youtube.com/watch?v=example",label:"External"},{href:"//example.com/x.html",label:"External"},{href:"javascript:alert(1)",label:"Invalid"}];
  assert.equal(appendGuidePanel(host,"Links",external),null);
  const panel=appendGuidePanel(host,"Links",[...external,{href:"maps.html#wild-zone-3",label:"Local map"}]);
  assert.equal(panel.children[1].children.length,1);
  assert.equal(panel.children[1].children[0].href,"maps.html#wild-zone-3");
});
test("Published HTML, source sections, browser modules and active map data have no media providers or player UI",()=>{
  const root=new URL("../",import.meta.url),src=new URL("../src/sections/",import.meta.url);
  const names=[...readdirSync(root).filter(n=>/\.(html|js|mjs|css)$/.test(n)),...readdirSync(src).filter(n=>n.endsWith(".html")).map(n=>"src/sections/"+n),"src/template.html","atlas-explorer-data.json","routes.json"];
  const forbidden=/youtube(?:-nocookie)?\.com|youtu\.be|buddyvidz|maestro\.tv|mux\.com|<\s*(?:video|iframe)\b|atlas-guide-video|ae-route-video|aeVideoBookmark|aeForgetVideoBookmark|video_refs|atlas-video-bookmark/i;
  for(const name of names)assert.doesNotMatch(read(name),forbidden,name);
  assert.ok(!existsSync(new URL("../atlas-video-bookmark.mjs",import.meta.url)));
});
