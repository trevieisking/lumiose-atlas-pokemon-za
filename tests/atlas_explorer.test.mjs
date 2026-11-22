import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import {
  MAP_SIZE, stageBase, startView, project, unproject, constrain,
  panBy, changeAround, centreOn, wrapRotation, normaliseRoute, eligibleMapPin
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
test("all 21 owner-survey entries, 111 genuine hosted images, no broken galleries",()=>{
  assert.equal(data.holovators.length,21);
  assert.equal(new Set(data.holovators.map(x=>x.id)).size,21);
  const pics=data.holovators.flatMap(x=>x.photos);
  assert.equal(pics.length,111);
  assert.equal(new Set(pics.map(x=>x.path)).size,101);
  for(const p of pics){
    assert.match(p.path,/^assets\/atlas\/holovators\/(?:[a-z0-9-]+\/)+[a-z0-9-]+\.jpg$/);
    const file=fs.readFileSync(path.join(root,p.path));
    assert.equal(file[0],0xff);assert.equal(file[1],0xd8);
  }
  const missing=data.holovators.filter(h=>h.photo_status==="not_hosted");
  assert.equal(missing.length,0);
  assert.deepEqual(missing.map(x=>x.id).sort(),[]);
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
test("both recovered owner photo walk-throughs preserve their original JPEG SHA-256",()=>{
  const jaune=data.holovators.find(x=>x.id==="jaune12-wz6");
  const cyclone=data.holovators.find(x=>x.id==="vert-cyclone");
  assert.equal(jaune.photo_status,"hosted_owner_photos");
  assert.equal(cyclone.photo_status,"hosted_owner_photos");
  assert.equal(jaune.photos.length,5);
  assert.equal(cyclone.photos.length,6);
  assert.equal(jaune.photo_count_referenced,5);
  assert.equal(cyclone.photo_count_referenced,6);
  assert.deepEqual(jaune.photos.map(x=>x.role),
    ["wide-city-map","neighbourhood-map","close-map","ground-lift","rooftop-arrival"]);
  assert.deepEqual(cyclone.photos.map(x=>x.role),
    ["wide-city-map","neighbourhood-map","close-map","courtyard-arch-approach","courtyard-ground-lift","rooftop-arrival"]);
  for(const item of [jaune,cyclone]){
    assert.equal(item.precision,"approx_owner_map_research");
    assert.equal(item.entrance_exact,false);
    assert.equal(item.roof_exact,false);
    assert.equal(item.device_category_id,null);
    assert.ok(item.photos.every(p=>typeof p.caption==="string"&&p.caption.length>20));
    assert.match(item.photo_story,/owner|Owner/);
    assert.equal(item.source_record,"docs/qa/ATLAS_AT264_OWNER_HOLOVATOR_GALLERY_PROVENANCE_2026-11-22.md");
  }
  const provenance=read("docs/qa/ATLAS_AT264_OWNER_HOLOVATOR_GALLERY_PROVENANCE_2026-11-22.md");
  assert.match(provenance,/54,291,692|2c819b0817a941e59019240322574ee2b954b54c4e0b567f531f62c1b663c733/);
  const rows=[...provenance.matchAll(/\| `(assets\/atlas\/holovators\/(?:jaune12-wild-zone-6|vert-cafe-cyclone)\/[a-z0-9-]+\.jpg)` \| `([a-f0-9]{64})` \|/g)];
  assert.equal(rows.length,11,"All eleven recovered image fingerprints must be recorded");
  const expected=new Map(rows.map(m=>[m[1],m[2]]));
  const photos=[...jaune.photos,...cyclone.photos];
  assert.deepEqual([...expected.keys()].sort(),photos.map(x=>x.path).sort(),"No source image omitted or substituted");
  for(const photo of photos){
    const bytes=fs.readFileSync(path.join(root,photo.path));
    assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);
    const digest=createHash("sha256").update(bytes).digest("hex");
    assert.equal(digest,expected.get(photo.path),photo.path+" must match the verified original survey ZIP");
  }
});

test("AT-265 final two owner galleries use independently hash-verified real photos",()=>{
  const bleu=data.holovators.find(h=>h.id==="bleu3-fav");
  const south=data.holovators.find(h=>h.id==="vert4-south");
  assert.deepEqual(bleu.xy,[765,1396],"Keep the established approximate entrance research pixel");
  assert.deepEqual(south.xy,[943,1466],"Keep WIDE-C13 continuity; no new pin");
  assert.equal(bleu.source_record,"MAPS_HOLOVATOR_061_OWNER_ENTRY_SURVEY_2026-11-22.json");
  assert.equal(south.source_record,"MAPS_VERT_CAFE_CLASSE_SOUTH_OWNER_LIFT_SURVEY_2026-11-22.json");
  const expectedRoles=["wide-city-map","neighbourhood-map","close-map","ground-lift","rooftop-arrival"];
  for(const h of [bleu,south]){
    assert.equal(h.photo_status,"hosted_owner_photos");
    assert.equal(h.photo_count_referenced,5);
    assert.deepEqual(h.photos.map(x=>x.role),expectedRoles);
    assert.equal(h.photo_provenance,"docs/qa/ATLAS_AT265_LAST_TWO_OWNER_HOLOVATOR_GALLERIES_2026-11-22.md");
    assert.equal(h.entrance_exact,false);assert.equal(h.roof_exact,false);
    assert.equal(h.device_category_id,null);
    assert.match(h.photo_story,/exact|unverified/i);
    assert.ok(h.photos.every(p=>p.caption?.length>30));
  }
  assert.match(bleu.directions,/Bleu Plaza/);
  assert.match(south.directions,/Pokémon Center/);
  assert.match(south.directions,/NOT the central/i);
  const provenance=read("docs/qa/ATLAS_AT265_LAST_TWO_OWNER_HOLOVATOR_GALLERIES_2026-11-22.md");
  const rows=[...provenance.matchAll(/\\| \`(assets\\/atlas\\/holovators\\/(?:mission-061|vert4-south)\\/[a-z0-9-]+\\.jpg)\` \\| \`([a-f0-9]{64})\` \\| \`([a-f0-9]{40})\` \\|/g)];
  assert.equal(rows.length,10,"All ten new images need recorded SHA-256 and exact Git blob fingerprints");
  const source=new Map(rows.map(m=>[m[1],{sha256:m[2],blob:m[3]}]));
  assert.deepEqual([...source.keys()].sort(),[...bleu.photos,...south.photos].map(p=>p.path).sort());
  for(const photo of [...bleu.photos,...south.photos]){
    const buf=fs.readFileSync(path.join(root,photo.path));
    assert.equal(buf[0],0xff);assert.equal(buf[1],0xd8,"JPEG bytes, not mislabeled HEIC");
    assert.equal(createHash("sha256").update(buf).digest("hex"),source.get(photo.path).sha256,photo.path);
    const expectedGitBlob=createHash("sha1").update(Buffer.concat([Buffer.from("blob "+buf.length+"\\0"),buf])).digest("hex");
    assert.equal(expectedGitBlob,source.get(photo.path).blob,photo.path);
  }
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
test("verified scaffold access is extensible without inventing map pins",()=>{
  assert.equal(data.scaffolds?.length??0,0,"No verified scaffold coordinates may be fabricated");
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[960,960],source_record:"MAPS_FIELD_SURVEY.json"}),false);
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[960,960],pin_verified:true}),false);
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[960,960],pin_verified:true,source_record:"javascript:alert(1)"}),false);
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[960,960],pin_verified:true,source_record:"MAPS_FIELD_SURVEY.json"}),true);
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[960,960],pin_verified:true,source_record:"MAPS_SCAFFOLD_FIELD_SURVEY_2026-11-22.json"}),true,"Dated authentic MAPS evidence filenames must be accepted");
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[960,960],pin_verified:true,source_record:"../MAPS_SCAFFOLD_FIELD_SURVEY.json"}),false);
  assert.equal(eligibleMapPin({kind:"scaffold",xy:[1921,960],pin_verified:true,source_record:"MAPS_FIELD_SURVEY.json"}),false);
  assert.equal(eligibleMapPin({kind:"zone",xy:[960,960]}),true,"Existing Wild Zone pins remain supported");
  assert.equal(eligibleMapPin({kind:"sector",xy:[960,960]}),false,"Sectors still lack evidence-backed pin geometry");
  const ids=new Set(["scaffold-01"]);
  const route={id:"scaffold-access",point_id:"scaffold-01",steps:[
    {space:"street",title:"Street",instruction:"Find entrance",evidence:"owner_survey"},
    {space:"scaffold",title:"Climb",instruction:"Follow recorded scaffold",evidence:"owner_photographed"}]};
  assert.equal(normaliseRoute(route,ids),true,"Verified scaffold routes can be added later without new engine");
  assert.match(data.not_mapped.join(" "),/scaffold/i);
  assert.match(data.not_mapped.join(" "),/Day-changing DLC Hyperspace/i);
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
  assert.match(html,/<button[^>]+id="aeRose"[^>]+aria-label="Reset map to north-up"/);
  assert.match(js,/by\("aeRose"\)\.addEventListener\("click",northUp\)/);
  for(const kind of ["zone","holovator","ladder","landmark","scaffold"])
    assert.match(html,new RegExp('data-layer="'+kind+'"'),"Missing independent "+kind+" layer");
  assert.match(html,/data-layer="scaffold" disabled/);
  assert.match(html,/id="aeLayers"/);
  assert.match(js,/pointermove/);assert.match(js,/changeAround/);
  assert.match(js,/layerToggles\.forEach/);
  assert.match(js,/eligibleMapPin/);
  assert.match(js,/evidenceText/);
  assert.match(css,/touch-action:none/);
  assert.match(css,/\.ae-layers\{/);
  assert.doesNotMatch(js,/localStorage\s*\.|sessionStorage\s*\.|supabase\.|fetch\s*\(\s*["']https?:/i);
});

