import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  MAP_SIZE, stageBase, startView, project, unproject, constrain,
  panBy, changeAround, centreOn, wrapRotation, normaliseRoute
} from "../atlas-explorer-geometry.mjs";
const root=path.resolve(import.meta.dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const data=JSON.parse(read("atlas-explorer-data.json"));
const near=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,String(a)+" != "+String(b));
test("authentic source map remains the shared 1920px geometry",()=>{
  assert.deepEqual(data.map.native_size,[1920,1920]);
  assert.equal(data.map.path,"maps/lumiose-game-map.jpg");
  const jpg=fs.readFileSync(path.join(root,data.map.path));
  assert.equal(jpg[0],0xff);assert.equal(jpg[1],0xd8);assert.ok(jpg.byteLength>100_000);
  assert.equal(data.map.original_asset_preserved,true);
});
test("the 20 source Wild Zones and 48 sectors retain identity and deep links",()=>{
  assert.equal(data.zones.length,20);
  assert.equal(data.sectors.length,48);
  assert.deepEqual([...data.zones.map(x=>x.number)].sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i+1));
  assert.equal(new Set(data.sectors.map(x=>x.id)).size,48);
  assert.equal(new Set(data.zones.map(x=>x.id)).size,20);
  for(const z of data.zones){
    assert.match(z.link,/^sector-maps\.html#wildzone-\d+$/);
    assert.equal(z.precision,"approx_saved_zone_centre");
    assert.ok(z.xy.every(v=>v>=0&&v<=1920));
  }
  for(const s of data.sectors){
    assert.equal(s.xy,null,"do not fabricate a sector centroid");
    assert.match(s.link,/^sector-maps\.html#sector-[a-z]+-sector-\d+$/);
  }
});
test("all 21 unique owner-survey entries, 90 genuine hosted images, missing assets never linked",()=>{
  assert.equal(data.holovators.length,21);
  assert.equal(new Set(data.holovators.map(x=>x.id)).size,21);
  const pics=data.holovators.flatMap(x=>x.photos);
  assert.equal(pics.length,90);
  assert.equal(new Set(pics.map(x=>x.path)).size,90);
  for(const p of pics){
    assert.match(p.path,/^assets\/atlas\/holovators\/(?:[a-z0-9-]+\/)+[a-z0-9-]+\.jpg$/);
    const file=fs.readFileSync(path.join(root,p.path));
    assert.equal(file[0],0xff);assert.equal(file[1],0xd8);
  }
  const missing=data.holovators.filter(h=>h.photo_status==="not_hosted");
  assert.equal(missing.length,4);
  for(const h of missing)assert.equal(h.photos.length,0);
  for(const h of data.holovators){
    assert.deepEqual(h.xy.length,2);
    assert.equal(h.precision,"approx_owner_map_research");
    assert.equal(h.entrance_exact,false);
    assert.equal(h.roof_exact,false);
    assert.equal(h.device_category_id,null);
  }
  assert.equal(data.counts.confirmed_exact_holovator_device_pins,0);
});
test("first directly photographed Hotel Z ladder is not promoted as exact roof XY",()=>{
  assert.equal(data.ladders.length,1);
  const l=data.ladders[0];
  assert.equal(l.id,"hotel-z-ladder");
  assert.equal(l.ground_object_verified,true);
  assert.equal(l.roof_exact,false);
  assert.match(l.directions,/RIGHT side|right side/);
});
test("maze routes have known progression and evidence grade; no invented floor layouts",()=>{
  const ids=new Set([...data.holovators,...data.ladders].map(x=>x.id));
  assert.equal(data.routes.length,6);
  assert.equal(new Set(data.routes.map(x=>x.id)).size,6);
  for(const r of data.routes){
    assert.ok(normaliseRoute(r,ids),r.id);
    assert.equal(r.known_floor_plan,false);
    assert.equal(r.roof_exit_xy,null);
    assert.equal(r.steps.some(s=>s.evidence==="owner_survey"||s.evidence==="owner_photographed"),true);
    assert.ok(r.steps.every(s=>!/<[^>]+>/.test(s.instruction)),"source text only");
  }
  const cyclone=data.routes.find(x=>x.id==="cafe-cyclone");
  assert.deepEqual(cyclone.steps.map(x=>x.space),["street","passage","courtyard","ground","roof"]);
  assert.match(cyclone.steps[1].instruction,/archway/);
  const hotel=data.routes.find(x=>x.id==="hotel-z-ladder");
  assert.ok(hotel.steps.some(x=>x.space==="ladder"&&x.evidence==="owner_photographed"));
  assert.equal(hotel.steps.at(-1).evidence,"unverified");
  assert.equal(data.routes.find(x=>x.id==="jaune12-wz6").risk,"hostile_wild_pokemon");
});
test("map algebra recovers actual image pixels after rotation, zoom and pan",()=>{
  const vp={width:970,height:635};
  near(stageBase(vp),635*.94);
  for(const angle of [0,23,90,180,273,359]){
    const v={zoom:3.25,rotation:angle,panX:27,panY:-19};
    for(const point of [[0,0],[1920,1920],[960,960],[1202,1556],[477,1130],[1400,370]]){
      const output=unproject(project(point,v,vp),v,vp);
      near(point[0],output[0],.00001);near(point[1],output[1],.00001);
    }
  }
});
test("rotation is clockwise in screen space, and north reset retains compass meaning",()=>{
  const vp={width:700,height:700};
  const centre=startView();
  const original=project([1200,960],centre,vp);
  const rotated=project([1200,960],{...centre,rotation:90},vp);
  near(original.y,vp.height/2);near(rotated.x,vp.width/2);
  assert.ok(rotated.y>vp.height/2);
  assert.equal(wrapRotation(-45),315);assert.equal(wrapRotation(405),45);
});
test("pinch/zoom/rotation keeps touch midpoint anchored when within permitted pan bounds",()=>{
  const vp={width:700,height:700};
  let v={zoom:2.8,rotation:20,panX:25,panY:35};
  const anchor={x:460,y:380};
  const pos=unproject(anchor,v,vp);
  v=changeAround(v,anchor,vp,1.1,19);
  const pos2=unproject(anchor,v,vp);
  near(pos[0],pos2[0],.001);near(pos[1],pos2[1],.001);
  assert.equal(Number.isFinite(v.panX)&&Number.isFinite(v.panY),true);
});
test("zoom and pan bounds guard against a lost city map",()=>{
  const vp={width:390,height:600};
  const v=constrain({zoom:999,rotation:-45,panX:1e8,panY:-1e8},vp);
  assert.equal(v.zoom,6);assert.equal(v.rotation,315);
  assert.ok(Math.abs(v.panX)<5000);assert.ok(Math.abs(v.panY)<5000);
  const centred=centreOn([960,960],{zoom:2,rotation:66,panX:100,panY:100},vp);
  near(centred.panX,0);near(centred.panY,0);
  assert.ok(panBy(startView(),30,-20,vp).zoom>0);
});
test("route reject unknown teleport transitions and fake spaces",()=>{
  const ids=new Set(["lift"]);
  assert.equal(normaliseRoute({id:"x",point_id:"lift",steps:[{space:"teleport",title:"X",instruction:"Nowhere",evidence:"unverified"}]},ids),false);
  assert.equal(normaliseRoute({id:"x",point_id:"absent",steps:[{space:"street",title:"X",instruction:"A",evidence:"owner_survey"}]},ids),false);
});
test("new explorer is isolated and links to preserved map and photo pages",()=>{
  const html=read("atlas-explorer.html");
  const js=read("atlas-explorer.js");
  const css=read("atlas-explorer.css");
  assert.match(html,/maps\/lumiose-game-map\.jpg/);
  assert.match(html,/atlas-explorer-geometry\.mjs|atlas-explorer\.js/);
  assert.match(html,/index\.html#walkthrough/);
  assert.match(html,/sector-maps\.html/);
  assert.match(html,/atlas-explorer-data\.json/);
  assert.match(html,/aeTurnLeft/);assert.match(html,/aeTurnRight/);
  assert.match(js,/pointermove/);assert.match(js,/changeAround/);
  assert.match(js,/evidenceText/);
  assert.match(css,/touch-action:none/);
  assert.doesNotMatch(js,/localStorage\s*\.|sessionStorage\s*\.|supabase\.|fetch\s*\(\s*["']https?:/i);
});

