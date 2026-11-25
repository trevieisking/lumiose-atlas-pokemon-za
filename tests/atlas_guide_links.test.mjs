import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {zoneLinks,zoneVideos,sectorLinks,screwVideo,sideVideo,locationLinks,VIDEO_SOURCES} from "../atlas-guide-links.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=JSON.parse(read("atlas-explorer-data.json"));
const checkLink=l=>{
  const [path,fragment]=l.href.split("#");
  if(l.external){const u=new URL(l.href);assert.equal(u.origin,"https://www.youtube.com");assert.equal(u.pathname,"/watch");assert.match(u.searchParams.get("v"),/^[\w-]{11}$/);assert.ok(Object.values(VIDEO_SOURCES).some(s=>s.id===u.searchParams.get("v")));return;}
  const [file,query]=path.split("?");
  const html=read(file);
  if(fragment)assert.ok(html.includes('id="'+fragment+'"'),l.href);
  if(query){const q=new URLSearchParams(query);assert.ok([...data.zones,...data.sectors,...data.holovators].some(r=>r.id===(q.get("place")||q.get("sector"))),l.href);}
};
test("AT-311 all 20 real zone cards, links and two ordered chapter series",()=>{
  let prev=[-1,-1];
  for(let n=1;n<=20;n++){
    const links=zoneLinks(n),clips=zoneVideos(n);
    assert.equal(links.length,5);assert.equal(clips.length,2);
    [...links,...clips].forEach(checkLink);
    clips.forEach((x,i)=>{assert.ok(x.seconds>prev[i]);prev[i]=x.seconds;});
  }
  assert.equal(zoneVideos(3)[0].seconds,202);
  assert.equal(zoneVideos(20)[0].seconds,2376);
  assert.deepEqual(zoneLinks(21),[]);assert.deepEqual(zoneVideos(0),[]);
});
test("AT-311 all 48 registered sector crosslinks, no inferred points",()=>{
  assert.equal(data.sectors.length,48);
  for(const sector of data.sectors){
    const m=sector.id.match(/^(\w+)-sector-(\d+)$/);
    const links=sectorLinks(m[1],Number(m[2]));
    assert.equal(links.length,3);links.forEach(checkLink);
    checkLink(screwVideo(m[1]));assert.equal(sector.xy,null);
  }
  assert.deepEqual(sectorLinks("vert",10),[]);
  assert.equal(screwVideo("unknown"),null);
});
test("AT-311 only published side chapters and mission #61 are offered; dynamic areas remain general",()=>{
  for(let n=1;n<=33;n++)checkLink(sideVideo(n));
  assert.equal(sideVideo(34),null);checkLink(sideVideo(57));assert.equal(sideVideo(57).href,"https://www.youtube.com/watch?v=DYB6AtF6dpo");assert.equal(sideVideo(60),null);checkLink(sideVideo(61));assert.equal(sideVideo(62),null);
  assert.equal(locationLinks("New Wild Zones 2–6").length,5);
  assert.deepEqual(locationLinks("Nightly battle zone · location changes"),[]);
  assert.deepEqual(locationLinks("Vert Sector 10; Wild Zone 21"),[]);
  assert.deepEqual(locationLinks("Rouge Sector 1 roof, Hyperspace portal").map(x=>x.href),["sector-maps.html#sector-rouge-sector-1","hyperspace-maps.html#portal-types"]);
  checkLink({href:"side-missions.html#quest-61"});
  for(const page of ["maps.html","sector-maps.html","alphas.html","items.html","walkthrough.html","side-missions.html","shiny-hunting.html","hyperspace-maps.html","mega-dimension.html"])assert.ok(read(page).includes("recovered-articles.js"),page);
});
