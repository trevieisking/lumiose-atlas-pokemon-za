import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import {
  MAP_SIZE, stageBase, startView, project, unproject, constrain,
  panBy, changeAround, centreOn, wrapRotation, normaliseRoute, eligibleMapPin,
  coverageCellCentre, districtStart, frameBoundary
} from "../atlas-explorer-geometry.mjs";
const root=path.resolve(import.meta.dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const data=JSON.parse(read("atlas-explorer-data.json"));
const near=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,String(a)+" != "+String(b));
test('reviewed area focus frames every actual sector outline without changing geometry or rotation',()=>{
  const rows=JSON.parse(read('atlas-area-evidence.json')).geometries.filter(row=>row.kind==='sector');
  assert.equal(rows.length,48);
  const before=JSON.stringify(rows);
  for(const viewport of [{width:360,height:430},{width:1100,height:650}])for(const rotation of [0,45,120])for(const row of rows){
    const next=frameBoundary(row.geometry,{zoom:1,rotation,panX:0,panY:0},viewport);
    assert.equal(next.rotation,rotation);assert.ok(next.zoom>=.75&&next.zoom<=6);
    const points=row.geometry.coordinates.flat(row.geometry.type==='Polygon'?1:2).map(p=>project(p,next,viewport));
    assert.ok(points.every(p=>p.x>=0&&p.x<=viewport.width&&p.y>=0&&p.y<=viewport.height),row.area_id+' stays in the viewport at '+rotation+' degrees');
  }
  assert.equal(JSON.stringify(rows),before);
  assert.deepEqual(frameBoundary({type:'Polygon',coordinates:[[[NaN,0]]]},startView(),{width:360,height:430}),startView());
});
test("AT-280 source-verified mission approach text never upgrades Holovator coordinates",()=>{
  const sommi=data.holovators.find(x=>x.id==="rouge-plaza-west");
  const terra=data.holovators.find(x=>x.id==="vernal-wz1");
  for(const h of [sommi,terra]){
    assert.ok(h,"Source-surveyed Holovator must still exist");
    assert.equal(h.precision,"approx_owner_map_research");
    assert.equal(h.entrance_exact,false);
    assert.equal(h.roof_exact,false);
    assert.equal(h.device_category_id,null);
    assert.equal(h.photos.length,5,"No owner picture may be removed");
    assert.match(h.directions,/approximate surveyed approach, not an exact doorway pixel/);
  }
  assert.match(sommi.directions,/Main Mission 6/);
  assert.match(sommi.directions,/Sommi/);
  assert.match(sommi.directions,/Side Mission 004: A Break Time Battle/);
  assert.match(terra.directions,/Main Mission 10/);
  assert.match(terra.directions,/Terra/);
  assert.match(terra.directions,/Side Mission 023: Underneath the Holovator/);
  assert.ok(terra.directions.includes("Lv. 28 Diggersby"));
});
test("AT-281: owner-photo-backed Bleu 7 quest remains approximate, no invented Vert 7 pin",()=>{
  const bleu7=data.holovators.find(h=>h.id==="bleu7-south");
  assert.ok(bleu7);
  assert.deepEqual(bleu7.xy,[708,1706],"Original owner survey coordinate cannot move");
  assert.equal(bleu7.photos.length,5,"Original owner gallery cannot be replaced");
  assert.equal(bleu7.precision,"approx_owner_map_research");
  assert.equal(bleu7.entrance_exact,false);
  assert.equal(bleu7.roof_exact,false);
  assert.equal(bleu7.device_category_id,null);
  assert.match(bleu7.directions,/Side Mission 045: On Maintenance Duty/);
  assert.match(bleu7.directions,/Durstin/);
  assert.match(bleu7.directions,/not a certified door or roof coordinate/);
  assert.ok(!data.holovators.some(h=>h.id==="mission-040"||h.id==="h03-vert7"),
    "Unidentified Side Mission 040 cannot receive a guessed new map pin");
  assert.equal(data.counts.confirmed_exact_holovator_device_pins,0);
});
test("AT-282: My Favorite Holovator preserves five original user photographs and unverified roof XY",()=>{
  const h=data.holovators.find(x=>x.id==="bleu3-fav");
  assert.ok(h);
  assert.deepEqual(h.xy,[765,1396]);
  assert.equal(h.photos.length,5);
  assert.deepEqual(h.photos.map(x=>x.role),
    ["wide-city-map","neighbourhood-map","close-map","ground-lift","rooftop-arrival"]);
  assert.equal(h.precision,"approx_owner_map_research");
  assert.equal(h.entrance_exact,false);
  assert.equal(h.roof_exact,false);
  assert.equal(h.device_category_id,null);
  assert.ok(!data.holovators.some(x=>x.id==="mission-056"),
    "Jaune Sector 6 physical mission device not yet uniquely photographed or aligned");
  assert.equal(data.holovators.length,21);
  assert.equal(data.holovators.reduce((a,x)=>a+x.photos.length,0),111);
});
test("AT-283: Watchog neighbourhood has photos but no falsely confirmed mission Holovator pin",()=>{
  const h=data.holovators.find(r=>r.id==="lysandre-autumnal");
  assert.ok(h);
  assert.equal(h.photos.length,5);
  assert.deepEqual(h.xy,[739,740],"Keep legacy owner-surveyed approximate map position");
  assert.equal(h.precision,"approx_owner_map_research");
  assert.equal(h.entrance_exact,false);
  assert.equal(h.roof_exact,false);
  assert.equal(h.device_category_id,null);
  assert.match(h.directions,/Chuckie's Side Mission 071/);
  assert.ok(h.directions.includes("Lv. 50 Alpha Watchog"));
  assert.match(h.directions,/NOT been independently proven to be the exact quest device/);
  assert.ok(!data.holovators.some(r=>r.id==="mission-071"||r.id==="mission-080"));
  assert.equal(data.counts.confirmed_exact_holovator_device_pins,0);
});
test("AT-284: Café Soleil Beldum neighbourhood retains five owner photos and no exact pin",()=>{
  const h=data.holovators.find(x=>x.id==="bleu8-soleil");
  assert.ok(h);
  assert.deepEqual(h.xy,[352,1496],"Do not move approximate owner-surveyed Café Soleil point");
  assert.equal(h.photos.length,5);
  assert.equal(h.precision,"approx_owner_map_research");
  assert.equal(h.entrance_exact,false);
  assert.equal(h.roof_exact,false);
  assert.equal(h.device_category_id,null);
  assert.match(h.directions,/Side Mission 092 The Beldum Blockade/);
  assert.match(h.directions,/NOT been individually verified as the exact mission device/);
  assert.ok(!data.holovators.some(x=>x.id==="mission-092"),"No guessed H-09 pin");
  assert.equal(data.holovators.length,21);
  assert.equal(data.holovators.reduce((n,x)=>n+x.photos.length,0),111);
  assert.equal(data.counts.confirmed_exact_holovator_device_pins,0);
});
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
  assert.equal(new Set(pics.map(x=>x.path)).size,111);
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
  const rows=provenance.split("\n")
    .filter(line=>line.startsWith("| `assets/atlas/holovators/mission-061/")||
      line.startsWith("| `assets/atlas/holovators/vert4-south/"))
    .map(line=>{
      const cells=line.split("|").map(cell=>cell.trim().replaceAll("`",""));
      return {path:cells[1],sha256:cells[2],blob:cells[3]};
    });
  assert.equal(rows.length,10,"All ten new images need recorded SHA-256 and exact Git blob fingerprints");
  const source=new Map(rows.map(row=>[row.path,{sha256:row.sha256,blob:row.blob}]));
  assert.deepEqual([...source.keys()].sort(),[...bleu.photos,...south.photos].map(p=>p.path).sort());
  for(const photo of [...bleu.photos,...south.photos]){
    const buf=fs.readFileSync(path.join(root,photo.path));
    assert.equal(buf[0],0xff);assert.equal(buf[1],0xd8,"JPEG bytes, not mislabeled HEIC");
    assert.equal(createHash("sha256").update(buf).digest("hex"),source.get(photo.path).sha256,photo.path);
    const expectedGitBlob=createHash("sha1").update(Buffer.from("blob "+buf.length)).update(Buffer.from([0])).update(buf).digest("hex");
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
  const ids=new Set([...data.holovators,...data.ladders,...data.sectors].map(x=>x.id));
  assert.equal(data.routes.length,42);
  assert.equal(new Set(data.routes.map(x=>x.id)).size,42);
  assert.deepEqual(data.routes.filter(r=>r.anchor_precision!=="district_only").map(r=>r.id),
    ["cafe-cyclone","hotel-z-ladder","magenta-plaza-nw","rouge-plaza-west","jaune12-wz6","bleu7-south"],
    "Keep all six existing owner approaches in the same order");
  for(const r of data.routes){
    assert.ok(normaliseRoute(r,ids),r.id);
    assert.equal(r.known_floor_plan,false);
    assert.equal(r.roof_exit_xy,null);
    if(r.anchor_precision==="district_only"){
      const sector=data.sectors.find(x=>x.id===r.point_id);
      assert.ok(sector);
      assert.equal(sector.xy,null);
      assert.equal(sector.district,r.district);
      assert.equal(eligibleMapPin({...sector,kind:"sector"}),false);
      assert.ok(r.steps.every(s=>s.evidence==="guide_crosscheck"||s.evidence==="unverified"));
      assert.equal(r.steps.at(-1).evidence,"unverified");
      assert.ok(["MAPS_HOLOVATOR_COORDINATE_VALIDATION.json","MAPS_ACCESS_ROUTE_SURVEY.json"].includes(r.source_record));
    }else{
      assert.equal(r.steps.some(s=>s.evidence==="owner_survey"||s.evidence==="owner_photographed"),true);
    }
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
test("AT-286 mission 40 and 56 written routes have no fabricated device or item points",()=>{
  const written=data.routes.filter(r=>r.anchor_precision==="district_only"&&r.source_record==="MAPS_HOLOVATOR_COORDINATE_VALIDATION.json");
  assert.deepEqual(written.map(r=>[r.id,r.point_id,r.side_mission]),[
    ["vert7-holovator-power","vert-sector-7",40],
    ["jaune6-holovator-muscle","jaune-sector-6",56]
  ]);
  assert.match(written[0].steps.map(s=>s.instruction).join(" "),/leaf bridge.*Colorful Screw|leaf bridge.*pickup pixel/);
  assert.match(written[1].steps.map(s=>s.instruction).join(" "),/physical Fighting-type move.*Wild Charge TM and wild Larvitar/);
  assert.equal(data.holovators.length,21);
  assert.equal(data.ladders.length,1);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
  assert.equal(data.counts.confirmed_exact_holovator_device_pins,0);
  const evidence=JSON.parse(read("MAPS_HOLOVATOR_COORDINATE_VALIDATION.json")).at_286_district_route_reconciliation;
  assert.ok(evidence,"New written routes must have a dated research register");
  assert.equal(evidence.published_new_exact_pins,0);
  assert.deepEqual(evidence.route_ids,written.map(r=>r.id));
  assert.equal(evidence.ladder_counts_confirmed_equal,false);
});
test("AT-288 courtyard route preserves all three distinct photo galleries and original Screw IDs",()=>{
  const route=data.routes.find(x=>x.id==="vert4-courtyard-screws");
  assert.ok(route);
  assert.equal(route.point_id,"vert-sector-4");
  assert.equal(route.anchor_precision,"district_only");
  assert.equal(route.roof_exit_xy,null);
  assert.equal(route.known_floor_plan,false);
  assert.equal(route.source_record,"MAPS_ACCESS_ROUTE_SURVEY.json");
  assert.deepEqual(route.related_photo_ids,["vert4-south","vert4-central","vert4-east"]);
  assert.match(route.steps.map(x=>x.title).join(" "),/#8.*#6 and #7.*TM033 Body Slam/);
  assert.match(route.steps.map(x=>x.instruction).join(" "),/Ralts.*Bunnelby/);
  assert.match(route.steps.map(x=>x.instruction).join(" "),/Glide is recommended rather than asserted mandatory/);
  for(const [id,xy] of [["vert4-central",[1010,1420]],["vert4-east",[1055,1383]],["vert4-south",[943,1466]]]){
    const h=data.holovators.find(x=>x.id===id);
    assert.deepEqual(h.xy,xy);
    assert.equal(h.photos.length,5);
    assert.equal(h.entrance_exact,false);
    assert.equal(h.roof_exact,false);
  }
  assert.match(data.holovators.find(x=>x.id==="vert4-central").directions,/enclosed grassy.*dark scaffold panels/);
  assert.match(data.holovators.find(x=>x.id==="vert4-east").directions,/enclosed grassy.*blue shutters/);
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  const v4=survey.coverage.find(x=>x.id==="vert-sector-4");
  assert.equal(v4.geometry_complete,false);
  assert.equal(v4.inventory_complete,false);
  assert.equal(v4.lead_ids.length,6);
  assert.equal(survey.at_288.owner_photo_reinspection.count,7);
  assert.equal(survey.at_288.new_exact_pins,0);
  assert.ok(survey.leads.filter(l=>v4.lead_ids.includes(l.id)).every(l=>l.atlas_entrance_xy===null&&l.atlas_exit_xy===null&&!l.publish_new_pin));
  assert.equal(data.holovators.length,21);
  assert.equal(data.ladders.length,1);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
});
test("AT-289 distinguishes two Vert 5 scaffold courses without duplicating Screw IDs or inventing pins",()=>{
  const route=data.routes.find(x=>x.id==="vert5-scaffold-courses");
  assert.ok(route);
  assert.equal(route.point_id,"vert-sector-5");
  assert.equal(route.anchor_precision,"district_only");
  assert.equal(route.roof_exit_xy,null);
  assert.equal(route.known_floor_plan,false);
  assert.equal(route.source_record,"MAPS_ACCESS_ROUTE_SURVEY.json");
  assert.match(route.steps[1].instruction,/northwest of Hotel Z.*#1 is a likely match/);
  assert.match(route.steps[2].instruction,/recessed platform.*#5 is a likely candidate/);
  assert.match(route.steps[3].instruction,/pipe-lined wall.*not a verified connection/);
  assert.match(route.steps[4].instruction,/Rock Smash.*golden TM ball/);
  assert.match(route.steps[5].instruction,/Main Mission 16.*Beedrillite/);
  assert.equal(route.steps.at(-1).evidence,"unverified");
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  const v5=survey.coverage.find(x=>x.id==="vert-sector-5");
  assert.equal(v5.geometry_complete,false);
  assert.equal(v5.inventory_complete,false);
  assert.equal(v5.lead_ids.length,6);
  assert.equal(survey.at_289.distinct_scaffold_pickup_locations_text_corroborated,2);
  assert.deepEqual(survey.at_289.original_clues_preserved.map(x=>x.number),[1,5]);
  assert.equal(survey.at_289.marker_identity_confirmed,false);
  assert.equal(survey.at_289.no_new_screw_ids,true);
  assert.equal(survey.at_289.new_exact_pins,0);
  assert.equal(survey.at_289.visual_evidence.coordinate_alignment_performed,false);
  assert.ok(survey.leads.filter(l=>v5.lead_ids.includes(l.id)).every(l=>l.atlas_entrance_xy===null&&l.atlas_exit_xy===null&&l.canonical_screw_id===null&&!l.publish_new_pin));
  assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
  assert.equal(data.holovators.length,21);
  assert.equal(data.ladders.length,1);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
});
test("AT-290 preserves Racine pickup identities and separates source coordinates from access geometry",()=>{
  const route=data.routes.find(x=>x.id==="vert6-racine-rooftop-courses");
  assert.ok(route);
  assert.equal(route.point_id,"vert-sector-6");
  assert.equal(route.anchor_precision,"district_only");
  assert.equal(route.source_record,"MAPS_ACCESS_ROUTE_SURVEY.json");
  assert.equal(route.roof_exit_xy,null);
  assert.equal(route.known_floor_plan,false);
  assert.match(route.steps[1].instruction,/TM066 Volt Switch.*Main Mission 15.*not a rooftop TM/);
  assert.match(route.steps[2].instruction,/#20–21.*not yet matched/);
  assert.match(route.steps[3].instruction,/#20–21 remains unresolved/);
  assert.match(route.steps[4].instruction,/south of the restaurant.*exact ladder base/);
  assert.equal(route.steps[5].title,"TM080 Iron Defense");
  assert.equal(route.steps[6].title,"TM074 Shadow Ball");
  assert.match(route.steps[6].instruction,/Do not assume.*same physical ladder/);
  assert.match(route.steps[7].instruction,/#16.*not a new pickup/);
  assert.equal(route.steps.at(-1).evidence,"unverified");
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  const v6=survey.coverage.find(x=>x.id==="vert-sector-6");
  assert.equal(v6.geometry_complete,false);
  assert.equal(v6.inventory_complete,false);
  assert.equal(v6.lead_ids.length,7);
  const discovery=survey.at_290.source_coordinate_discovery;
  assert.equal(discovery.link_ids_verified,4);
  assert.equal(discovery.source_to_atlas_transform_calibrated,false);
  assert.deepEqual(discovery.records.map(r=>[r.original_clue,r.marker_id,r.source_xy]),[
    [19,238356,[15101,14156]],[20,235632,[15891,13705]],
    [21,235674,[15040,13434]],[22,235931,[16076,12551]]
  ]);
  for(const p of discovery.records){
    assert.equal(p.link_marker_id_match,true);
    assert.equal(new URL(p.regional_link).searchParams.get("markerId"),String(p.marker_id));
    assert.equal(new URL(p.database_link).searchParams.get("markerId"),String(p.marker_id));
    assert.equal(p.atlas_xy,null);
    assert.equal(p.physical_entrance_xy,null);
    assert.equal(p.physical_exit_xy,null);
    assert.equal(p.publish_new_pin,false);
  }
  assert.ok(survey.leads.filter(l=>v6.lead_ids.includes(l.id)).every(l=>l.atlas_entrance_xy===null&&l.atlas_exit_xy===null&&l.canonical_screw_id===null&&!l.publish_new_pin));
  assert.equal(survey.at_290.no_new_screw_ids,true);
  assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
  assert.equal(data.holovators.length,21);
  assert.equal(data.ladders.length,1);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
});
test("AT-293 preserves the Vernal lift gallery and separates photographed ladder from source pickup",()=>{
  const route=data.routes.find(x=>x.id==="vert9-vernal-rooftop-screw");
  assert.ok(route);
  assert.equal(route.point_id,"vert-sector-9");
  assert.equal(route.anchor_precision,"district_only");
  assert.equal(route.side_mission,23);
  assert.equal(route.source_record,"MAPS_ACCESS_ROUTE_SURVEY.json");
  assert.deepEqual(route.related_photo_ids,["vernal-wz1"]);
  assert.equal(route.roof_exit_xy,null);
  assert.equal(route.known_floor_plan,false);
  assert.match(route.steps[1].instruction,/Main Mission 10.*Terra.*level 28 Diggersby/);
  assert.match(route.steps[2].instruction,/visible ladder.*does not establish a safe crossing/);
  assert.match(route.steps[3].instruction,/Roto-Glide.*Main Mission 16/);
  assert.match(route.steps[4].instruction,/Water-type move.*special Psychic-type move/);
  assert.match(route.steps[5].instruction,/Vert 5\/9 sector label/);
  assert.equal(route.steps.at(-1).evidence,"unverified");
  const lift=data.holovators.find(h=>h.id==="vernal-wz1");
  assert.deepEqual(lift.xy,[964,1666]);
  assert.equal(lift.entrance_exact,false);
  assert.equal(lift.roof_exact,false);
  assert.equal(lift.photos.length,5);
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  const area=survey.coverage.find(x=>x.id==="vert-sector-9");
  assert.equal(area.geometry_complete,false);
  assert.equal(area.inventory_complete,false);
  assert.equal(area.lead_ids.length,5);
  assert.equal(survey.at_293.owner_photo_reinspection.count,3);
  const p=survey.at_293.source_coordinate_discovery.records[0];
  assert.deepEqual([p.original_clue,p.marker_id,p.source_xy],[2,235101,[11039,14738]]);
  assert.equal(new URL(p.regional_link).searchParams.get("markerId"),String(p.marker_id));
  assert.equal(new URL(p.database_link).searchParams.get("markerId"),String(p.marker_id));
  assert.equal(p.atlas_xy,null);
  assert.equal(p.physical_entrance_xy,null);
  assert.equal(p.physical_exit_xy,null);
  assert.equal(p.publish_new_pin,false);
  assert.equal(survey.at_293.source_coordinate_discovery.source_to_atlas_transform_calibrated,false);
  assert.ok(survey.leads.filter(l=>area.lead_ids.includes(l.id)).every(l=>l.atlas_entrance_xy===null&&l.atlas_exit_xy===null&&!l.publish_new_pin));
  assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
  assert.equal(data.holovators.length,21);
  assert.equal(data.ladders.length,1);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
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



test("AT-267 navigates all 25 image regions and 48 sectors without fabricated point geometry",()=>{
  const positions=[];
  for(let row=0;row<5;row++)for(let col=0;col<5;col++){
    const point=coverageCellCentre(row,col);
    assert.ok(point.every(x=>x>0&&x<MAP_SIZE));
    positions.push(point.join(","));
  }
  assert.equal(new Set(positions).size,25);
  assert.deepEqual(coverageCellCentre(0,0),[192,192]);
  assert.deepEqual(coverageCellCentre(4,4),[1728,1728]);
  assert.deepEqual(coverageCellCentre(2,2),[960,960]);
  for(const bad of [[-1,0],[0,5],[2.5,0],[5,0]])
    assert.equal(coverageCellCentre(...bad),null);
  assert.equal(coverageCellCentre(0,0,0),null);
  const districts=["Vert","Bleu","Magenta","Rouge","Jaune"];
  for(const district of districts) {
    const c=districtStart(data.zones,district);
    const matching=data.zones.filter(x=>x.district===district);
    assert.ok(matching.length>0,district+" has source Wild Zone anchors");
    const avg=[0,1].map(axis=>matching.reduce((sum,x)=>sum+x.xy[axis],0)/matching.length);
    assert.deepEqual(c,avg,"Source-derived district orientation only, no invented centre");
    assert.ok(c.every(x=>x>=0&&x<=1920));
  }
  assert.equal(districtStart(data.zones,"Missing"),null);
  assert.equal(districtStart([], "Vert"),null);
  assert.ok(data.sectors.every(s=>s.xy===null),"No sector should receive false point geometry");
  const html=read("atlas-explorer.html"),js=read("atlas-explorer.js"),css=read("atlas-explorer.css");
  assert.match(html,/id="aeCoverageGrid"/);
  assert.match(html,/id="aeCoverageDistricts"/);
  assert.match(html,/id="aeCoverageSector"/);
  assert.match(html,/id="aeCoverageFullCity"/);
  assert.match(js,/coverageCellCentre/);assert.match(js,/districtStart/);
  assert.match(js,/new URLSearchParams\(window.location.search\)/);
  assert.match(css,/\.ae-coverage-grid\{/);
  assert.match(read("maps.html"),/sector-maps\.html#sector-directory/);
  assert.match(read("sector-maps.js"),/atlas-explorer\.html\?sector=/);
  assert.equal(data.holovators.length,21);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
});

test("Written routes remain intact without supplementary media or storage writes",()=>{
  const route=data.routes.find(x=>x.id==="vert9-vernal-rooftop-screw");
  assert.equal(route.roof_exit_xy,null);assert.equal(route.known_floor_plan,false);assert.equal(route.steps.at(-1).evidence,"unverified");
  assert.equal(data.routes.length,42);assert.equal(data.holovators.length,21);assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
  assert.ok(data.routes.every(r=>r.steps.every(s=>!Object.hasOwn(s,"video_refs"))));
  assert.doesNotMatch(read("atlas-explorer.js"),/localStorage|sessionStorage|replaceState/);
  assert.ok(!fs.existsSync(path.join(root,"atlas-video-bookmark.mjs")));
});

test("AT-296 Vert 1 and 2 written approaches retain all prior routes and uncertain pickup identities",()=>{
  const a=data.routes.find(r=>r.id==="vert1-scaffold-courses"),b=data.routes.find(r=>r.id==="vert2-southern-rooftop");
  assert.equal(a.point_id,"vert-sector-1");assert.equal(b.point_id,"vert-sector-2");
  assert.equal(a.steps.length,6);assert.equal(b.steps.length,4);
  for(const r of [a,b]){assert.equal(r.anchor_precision,"district_only");assert.equal(r.roof_exit_xy,null);assert.equal(r.known_floor_plan,false);assert.equal(r.steps.at(-1).evidence,"unverified");}
  assert.match(a.steps[1].instruction,/#10 and #11.*candidates/);assert.match(b.steps[2].instruction,/Roto-Glide.*difficult running-roll/);
  assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
});


test("AT-298 Vert 3 rooftop guidance preserves owner route and uncertain identities",()=>{
  const r=data.routes.find(x=>x.id==="vert3-cyclone-rooftop-courses");
  assert.equal(r.point_id,"vert-sector-3");assert.equal(r.anchor_precision,"district_only");assert.equal(r.steps.length,6);
  assert.deepEqual(r.related_photo_ids,["vert-cyclone"]);assert.equal(r.roof_exit_xy,null);assert.equal(r.known_floor_plan,false);
  assert.match(r.steps[1].instruction,/Do not tick both/);assert.match(r.steps[4].instruction,/#15 separate from the west-rooftops clue #14/);assert.match(r.steps[5].instruction,/#16, not another name for #15/);
  const original=data.routes.find(x=>x.id==="cafe-cyclone");assert.equal(original.steps.length,5);assert.match(original.steps[1].instruction,/archway/);
  assert.equal(data.holovators.find(x=>x.id==="vert-cyclone").photos.length,6);assert.equal(data.holovators.length,21);assert.equal(data.ladders.length,1);assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
});


test("AT-299 selected-sector name is an optional non-geographic viewport context",()=>{
  const html=read("atlas-explorer.html"),js=read("atlas-explorer.js"),css=read("atlas-explorer.css");
  assert.match(html,/data-layer="sector-label" checked/);
  assert.match(html,/id="aeSectorContext" role="status" aria-live="polite" aria-atomic="true" hidden/);
  assert.match(html,/District starting view · exact sector position unverified/);
  assert.match(html,/<\/div>\s*<div class="ae-sector-context"/,"Context is outside the rotating stage");
  assert.match(js,/item=recordMap\.get\(coverageSector\.value\)/);
  assert.match(js,/layerVisible\("sector-label"\).*item\.id===selectedId/);
  assert.match(css,/\.ae-sector-context\{[^}]*pointer-events:none/);
  assert.match(css,/\.ae-sector-context\[hidden\]\{display:none\}/);
  assert.equal(data.sectors.length,48);assert.ok(data.sectors.every(s=>s.xy===null));
  assert.equal(data.routes.length,42);assert.equal(data.holovators.length,21);
});


test("AT-303: all 48 map sectors retain no point geometry; twelve screenshot-verified street bearings have exact source parity",()=>{
  const source=JSON.parse(read("MAPS_BORDERLESS_SOURCE_REGISTER_2026-11-24.json"));
  const matched=data.sectors.filter(s=>s.street_bearing);
  assert.equal(data.sectors.length,48);
  assert.equal(data.zones.length,20);
  assert.equal(data.holovators.length,21);
  assert.equal(matched.length,31);
  assert.equal(source.sector_orientation.length,12);
  assert.ok(data.sectors.every(s=>s.xy===null),"No fictitious sector centroid pin");
  for(const row of source.sector_orientation){
    const record=data.sectors.find(s=>s.id===row.sector_id);
    assert.ok(record,"Source sector missing "+row.sector_id);
    assert.equal(row.native_label_xy,null,"Original labelled source still needs spatial registration");
    assert.deepEqual(record.street_bearing,{text:row.orientation,source_crop_id:row.crop_id,confidence:"source_image_orientation_only",native_label_xy:null});
    assert.ok(source.crop_records.some(c=>c.id===row.crop_id),"Missing provenance record");
  }
  assert.equal(data.sectors.filter(s=>!s.street_bearing).length,17);
  const html=read("atlas-explorer.html"),js=read("atlas-explorer.js"),css=read("atlas-explorer.css");
  assert.match(html,/id="aeSectorContextBearing"/);
  assert.match(html,/id="aeStreetEvidenceSummary"/);
  assert.ok(html.includes("all 48 sector areas</strong>"));
  assert.match(js,/street_bearing\?\.text/);
  assert.match(js,/Street-level map position not yet source-verified/);
  assert.match(js,/Source-labelled street bearings \(orientation only\)/);
  assert.match(css,/\.ae-sector-context #aeSectorContextBearing/);
  assert.equal((js.match(/localStorage\.setItem/g)||[]).length,(read("atlas-explorer.js").match(/localStorage\.setItem/g)||[]).length);
});


test("AT-310: 42 byte-verified original-game PNG crops cover 48 sectors without assigning geography or changing 111 Holovator photos",()=>{
  const library=JSON.parse(read("MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json"));
  assert.equal(library.images.length,42);
  assert.equal(library.sector_coverage.length,48);
  assert.equal(library.counts.sectors_with_photographic_references,48);
  assert.equal(library.missing_sector_ids.length,0);
  assert.equal(library.observed_street_labels.length,8);
  assert.equal(library.counts.geographic_sector_label_anchors,0);
  assert.equal(library.counts.geographically_registered_tiles,0);
  const uniquePaths=new Set(),uniqueImages=new Set(),sectorPaths=new Set();
  for(const image of library.images){
    assert.match(image.path,/^assets\/atlas\/sector-streets\/(vert|bleu|magenta|rouge|jaune)\/[a-z0-9-]+\.png$/);
    assert.ok(!uniquePaths.has(image.path),"Duplicate asset "+image.path);
    uniquePaths.add(image.path);uniqueImages.add(image.id);
    assert.equal(image.registration,"not_georeferenced");
    assert.equal(image.precision,"source_image_orientation_only");
    assert.ok(image.sector_ids.length>=1);
    const buf=fs.readFileSync(path.join(root,image.path));
    assert.deepEqual([...buf.subarray(0,8)],[137,80,78,71,13,10,26,10],"Source must be original PNG");
    assert.equal(buf.length,image.bytes,"Changed source byte count "+image.path);
    assert.equal(createHash("sha256").update(buf).digest("hex"),image.sha256,"Changed original PNG "+image.path);
    assert.equal(createHash("sha1").update(Buffer.from("blob "+buf.length)).update(Buffer.from([0])).update(buf).digest("hex"),image.git_blob_sha,"Blob identity mismatch "+image.path);
    assert.equal(buf.readUInt32BE(16),image.width);
    assert.equal(buf.readUInt32BE(20),image.height);
    for(const s of image.sector_ids)sectorPaths.add(s);
  }
  assert.equal(uniqueImages.size,42);assert.equal(sectorPaths.size,48);
  for(const sector of data.sectors){
    assert.equal(sector.xy,null,"Do not infer native map sector XY");
    const entry=library.sector_coverage.find(s=>s.sector_id===sector.id);
    assert.ok(entry,"Missing sector tracking row");
    assert.equal(entry.native_label_xy,null);
    assert.equal(entry.verified_geographic_polygon,false);
    if(entry.source_crop_id){
      const image=library.images.find(a=>a.id===entry.source_crop_id);
      assert.ok(image?.sector_ids.includes(sector.id));
      assert.deepEqual(sector.source_map_reference,{crop_id:image.id,image_path:image.path,sha256:image.sha256,width:image.width,height:image.height,visible_labels:image.visible_labels,precision:"source_image_orientation_only",geographically_registered:false});
    }else{assert.equal(sector.source_image_status,"needs_original_screenshot");assert.equal(sector.source_map_reference,undefined);}
  }
  assert.equal(data.zones.length,20);assert.equal(data.holovators.length,21);
  assert.equal(data.holovators.reduce((s,h)=>s+h.photos.length,0),111);
  assert.equal(data.routes.length,42);
  const html=read("atlas-explorer.html"),js=read("atlas-explorer.js");
  assert.match(html,/42 clean PNG map crops/);
  assert.match(js,/ae-source-map-reference/);
  assert.match(js,/item\.source_map_reference/);
  assert.match(js,/No registered map XY, sector border or exact lift\/pickup pin/);
});


test("AT-310: all 19 accepted owner crops are registered and linked without mutating source evidence",()=>{
  const at306=JSON.parse(read("MAPS_AT306_SOURCE_RECOVERY_2026-11-24.json"));
  const at309=JSON.parse(read("MAPS_AT309_OWNER_SOURCE_48_SECTORS_2026-11-24.json"));
  const hosted=JSON.parse(read("MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json"));
  assert.equal(at306.accepted.length,11);assert.equal(at309.accepted.length,8);
  assert.equal(at306.excluded.length,2);
  const mapPage=read("sector-maps.html");
  assert.equal(at309.at_310_visual_quality_recrops.length,3);
  for(const row of [...at306.accepted,...at309.accepted]){
    const recrop=at309.at_310_visual_quality_recrops.find(x=>x.sector_id===row.sector_id);
    if(recrop)assert.equal(recrop.supersedes_crop_sha256,row.sha256);
    const display=recrop||row;
    const s=data.sectors.find(x=>x.id===row.sector_id);
    const photo=hosted.images.find(x=>x.id===row.sector_id);
    assert.equal(photo.path,row.expected_future_asset_path);
    assert.equal(photo.git_blob_sha,display.git_blob_sha||display.predicted_git_blob_sha);
    assert.equal(photo.sha256,display.sha256);
    assert.equal(photo.bytes,display.bytes);
    assert.equal(photo.source_sha256,display.source_sha256);
    assert.deepEqual(photo.crop_xyxy,display.crop_xyxy);
    assert.deepEqual(photo.visible_labels,display.visible_labels);
    assert.equal(s.source_map_reference.image_path,photo.path);
    assert.equal(s.xy,null);
    assert.equal(s.pending_source_photo_evidence,undefined);
    assert.deepEqual(s.street_bearing,{text:row.orientation_text,source_crop_id:row.sector_id,confidence:"source_image_orientation_only",native_label_xy:null});
    assert.ok(mapPage.includes('<img src="'+photo.path+'"'));
  }
  for(const row of at306.excluded){
    const replacement=at309.accepted.find(x=>x.sector_id===row.sector_id);
    assert.equal(row.status,"research_only_rejected");
    const reviewed=at309.at_310_visual_quality_recrops.find(x=>x.sector_id===row.sector_id)||replacement;
    assert.equal(hosted.images.find(x=>x.id===row.sector_id).source_name,reviewed.source_name);
  }
  assert.equal(data.sectors.filter(x=>x.source_map_reference).length,48);
  assert.equal(data.sectors.filter(x=>x.street_bearing).length,31);
  assert.equal(data.zones.length,20);
  assert.equal(data.holovators.length,21);
  assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
  assert.equal(data.routes.length,42);
});

test("AT-313: Vert 8 and Bleu 1 routes preserve the owner ladder and never add new coordinates",()=>{
  const v=data.routes.find(x=>x.id==="vert8-hotel-rooftop-courses");
  const b=data.routes.find(x=>x.id==="bleu1-sewer-approaches");
  assert.equal(v.point_id,"vert-sector-8");assert.equal(b.point_id,"bleu-sector-1");
  assert.equal(v.steps.length,7);assert.equal(b.steps.length,7);
  assert.match(v.description,/Two separate/);assert.match(v.steps[3].instruction,/Roto-Glide/);
  assert.match(v.steps.at(-1).instruction,/candidate matches.*#3 and #4/);
  assert.equal(b.side_mission,57);assert.equal(b.risk,"hostile_wild_pokemon");
  assert.match(b.steps[2].instruction,/Alpha Whirlipede/);
  assert.match(b.steps[4].instruction,/4,500 Pokédollars, one Fire Stone and one Charcoal/);
  for(const r of [v,b]){assert.equal(r.anchor_precision,"district_only");assert.equal(r.known_floor_plan,false);assert.equal(r.roof_exit_xy,null);assert.equal(r.steps.at(-1).evidence,"unverified");}
  assert.equal(data.ladders.length,1);assert.equal(data.routes.find(x=>x.id==="hotel-z-ladder").steps.length,5);
  assert.ok(data.sectors.every(x=>x.xy===null));assert.equal(data.holovators.length,21);
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  assert.equal(survey.at_313_vert8_bleu1_route_reconciliation.new_exact_pins,0);
});

test("AT-315: separate Bleu 3 and Bleu 5 written courses, no inferred collectible or device pins",()=>{
  const b3=data.routes.find(x=>x.id==="bleu3-woof-scaffold-courses");
  const b5=data.routes.find(x=>x.id==="bleu5-plaza-scaffold-rooftop");
  assert.equal(b3.point_id,"bleu-sector-3");assert.equal(b5.point_id,"bleu-sector-5");
  assert.equal(b3.steps.length,6);assert.equal(b5.steps.length,7);
  assert.match(b3.steps[1].instruction,/#55 is a likely match/);
  assert.match(b3.steps[2].instruction,/Roto-Glide in Main Mission 16/);
  assert.match(b3.steps[3].instruction,/#56 remains a candidate/);
  assert.match(b5.steps[2].instruction,/#57\/#58 crosswalk|original two IDs/);
  assert.match(b5.steps[4].instruction,/#59 rooftop clue is a candidate only/);
  for(const r of [b3,b5]){
    assert.equal(r.anchor_precision,"district_only");
    assert.equal(r.roof_exit_xy,null);assert.equal(r.known_floor_plan,false);
    assert.deepEqual(r.related_photo_ids,["bleu3-fav"]);
    assert.equal(r.steps.at(-1).evidence,"unverified");
  }
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  const receipt=survey.at_315_bleu3_5_access_routes;
  assert.deepEqual(receipt.original_screw_clues_preserved,[55,56,57,58,59]);
  assert.equal(receipt.new_screw_ids,0);assert.equal(receipt.new_exact_pins,0);
  const leads=survey.leads.filter(x=>/^AR-B(?:03|05)-/.test(x.id));
  assert.equal(leads.length,5);
  assert.ok(leads.every(x=>x.canonical_screw_id===null&&x.atlas_entrance_xy===null&&x.atlas_exit_xy===null&&!x.publish_new_pin));
  const owner=data.holovators.find(x=>x.id==="bleu3-fav");
  assert.equal(owner.photos.length,5);assert.equal(owner.entrance_exact,false);assert.equal(owner.roof_exact,false);
  assert.equal(data.routes.length,42);assert.ok(data.sectors.every(x=>x.xy===null));
});

test("AT-319: written-first Bleu 2, 4 and 6 routes use existing map photos without inventing pins or collection IDs",()=>{
  const b2=data.routes.find(x=>x.id==="bleu2-wildzone5-roof-sweep");
  const b4=data.routes.find(x=>x.id==="bleu4-southern-roof-from-bleu6");
  const b6=data.routes.find(x=>x.id==="bleu6-plaza-scaffold-roofs");
  assert.equal(b2.steps.length,7);assert.equal(b4.steps.length,6);assert.equal(b6.steps.length,6);
  assert.equal(b2.risk,"hostile_wild_pokemon");
  assert.match(b2.steps[2].instruction,/northwest.*Abra.*Leaf Stone/);
  assert.match(b2.steps[4].instruction,/Water-type attack.*Alpha Whirlipede/);
  assert.match(b2.steps[5].instruction,/TM040 Bullet Seed/);
  assert.match(b6.steps[2].instruction,/#62/);assert.match(b6.steps[3].instruction,/#63/);
  assert.match(b4.steps[1].instruction,/Sector 6 route/);
  assert.match(b4.steps[4].instruction,/Sun Stone, Ice Stone and Water Stone/);
  for(const [n,r] of [[2,b2],[4,b4],[6,b6]]){
    assert.equal(r.point_id,"bleu-sector-"+n);
    assert.equal(r.anchor_precision,"district_only");
    assert.equal(r.roof_exit_xy,null);assert.equal(r.known_floor_plan,false);
    assert.equal(r.steps.at(-1).evidence,"unverified");
    assert.ok(r.steps.every(x=>!x.video_refs));
    const sector=data.sectors.find(s=>s.id===r.point_id);
    assert.equal(sector.xy,null);assert.ok(sector.source_map_reference.image_path);
  }
  const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
  const receipt=survey.at_319_bleu2_4_6_written_routes;
  assert.equal(receipt.new_exact_pins,0);assert.equal(receipt.new_screw_ids,0);assert.equal(receipt.new_item_ids,0);
  assert.deepEqual(receipt.unresolved_district_clue_candidates,[60,61]);
  const leads=survey.leads.filter(x=>/^AR-B(?:02|04|06)-/.test(x.id));
  assert.equal(leads.length,7);
  assert.ok(leads.every(x=>!x.publish_new_pin&&x.canonical_screw_id===null&&x.atlas_entrance_xy===null&&x.atlas_exit_xy===null));
  assert.deepEqual(survey.at_319_written_first_policy.held_prs,[153,154]);
  assert.equal(data.routes.length,42);
});

test("AT-320: Bleu 7–10 photo-first written approaches preserve routes and all collection identities",()=>{
 const expected=[["bleu7-aymlis-roof-scaffold-courses",7,7,["bleu7-south"]],["bleu8-soleil-beldum-access",8,5,["bleu8-soleil"]],["bleu9-soleil-scaffold-roof-leads",9,6,["bleu8-soleil"]],["bleu10-estival-boulevard-scaffold",10,5,[]]];
 for(const [id,n,count,photos] of expected){
  const route=data.routes.find(x=>x.id===id);
  assert.equal(route.point_id,"bleu-sector-"+n);
  assert.equal(route.steps.length,count);assert.equal(route.anchor_precision,"district_only");
  assert.deepEqual(route.related_photo_ids||[],photos);assert.equal(route.roof_exit_xy,null);
  assert.equal(route.known_floor_plan,false);assert.equal(route.steps.at(-1).evidence,"unverified");
  assert.ok(route.steps.every(x=>!x.video_refs));
  const sector=data.sectors.find(x=>x.id===route.point_id);
  assert.equal(sector.xy,null);assert.ok(sector.source_map_reference.image_path);
 }
 const b7=data.routes.find(x=>x.id==="bleu7-south");assert.equal(b7.point_id,"bleu7-south");assert.equal(b7.steps.length,4);
 const b8=data.routes.find(x=>x.id==="bleu8-soleil-beldum-access");assert.equal(b8.side_mission,92);
 assert.match(b8.steps[1].instruction,/not proof/);assert.match(b8.steps[2].instruction,/in-game objective marker/);
 assert.match(data.routes.find(x=>x.id==="bleu9-soleil-scaffold-roof-leads").steps[2].instruction,/tutorial behind Hotel Z during the Main Mission 15–16/);
 assert.match(data.routes.find(x=>x.id==="bleu7-aymlis-roof-scaffold-courses").steps[3].instruction,/rooftop tutorial behind Hotel Z/);
 assert.match(b8.steps[2].instruction,/completing Main Mission 30 and beginning Main Mission 31/);
 assert.match(data.routes.find(x=>x.id==="bleu10-estival-boulevard-scaffold").steps[3].instruction,/#65/);
 const s=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));const receipt=s.at_320_bleu7_10_written_routes;
 assert.deepEqual(receipt.existing_numbered_screw_clues,[48,49,50,51,52,53,64,65]);
 assert.equal(receipt.new_screw_ids,0);assert.equal(receipt.new_item_ids,0);assert.equal(receipt.new_exact_pins,0);
 const leads=s.leads.filter(x=>/^AR-B(?:07|08|09|10)-/.test(x.id));
 assert.equal(leads.length,8);assert.ok(leads.every(x=>!x.publish_new_pin&&x.canonical_screw_id===null&&x.atlas_entrance_xy===null&&x.atlas_exit_xy===null));
 assert.equal(s.summary.route_course_leads,97);assert.equal(s.leads.length,97);
 assert.equal(new Set(s.leads.map(x=>x.id)).size,97);
 assert.equal(s.summary.sector_text_research_started,48);assert.equal(s.summary.wild_zone_text_research_started,20);
 assert.equal(s.coverage.length,68);assert.equal(data.routes.length,42);
});

test("AT-331: Wild Zone access review retains source identity and orientation-only photo evidence",()=>{
 const survey=JSON.parse(read("MAPS_ACCESS_ROUTE_SURVEY.json"));
 const source="docs/qa/ATLAS_TM_ACCESS_RESEARCH_2026-11-26.json";
 const tmAccess=JSON.parse(read(source));
 const zones=survey.coverage.filter(x=>x.kind==="wild_zone");
 assert.equal(zones.length,20);assert.equal(survey.summary.wild_zone_text_research_started,zones.length);
 assert.equal(survey.summary.fully_completed_areas,0);
 for(const area of zones){
  const zone=Number(area.id.slice(3));
  const tm=tmAccess.records.find(x=>x.zone===zone);
  const review=area.written_guidance_review;
  assert.ok(tm&&review,"Each researched Wild Zone must identify its retained evidence");
  assert.equal(area.status,zone===9?"partial_international_text_research":"partial_text_research");
  assert.equal(area.geometry_complete,false);assert.equal(area.inventory_complete,false);
  assert.equal(review.scope,"existing_published_tm_note_and_original_photo_references");
  assert.equal(review.source_record,source);assert.equal(review.original_item_id,tm.id);
  assert.equal(tm.original_progress_key,tm.id);assert.equal(tm.verified_native_xy,null);
  assert.equal(tm.verified_access_geometry,false);
  assert.deepEqual(review.published_guide_refs,["items.html#item-"+tm.id,"sector-maps.html#wildzone-"+zone]);
  for(const ref of review.published_guide_refs){
   const [page,anchor]=ref.split("#");assert.ok(read(page).includes('id="'+anchor+'"'));
  }
  const photos=JSON.parse(read(review.original_photo_manifest)).records.filter(x=>x.zone===zone);
  assert.deepEqual(photos.map(x=>x.kind),["overview","closeup"]);
  assert.deepEqual(review.photo_refs,photos.map(x=>x.path));
  assert.equal(review.photo_evidence,"original_map_orientation_only_not_traversal_proof");
  assert.ok(fs.existsSync(path.join(root,review.review_receipt)));
 }
 const wz9=zones.find(x=>x.id==="wz-09");
 assert.deepEqual(wz9.lead_ids,["AR-WZ09-01"]);
 const scaffold=survey.leads.find(x=>x.id===wz9.lead_ids[0]);
 assert.equal(scaffold.area,wz9.id);assert.equal(scaffold.publish_new_pin,false);
 assert.deepEqual(scaffold.candidate_original_screw_ids,[91]);
 assert.equal(scaffold.canonical_screw_id,null);
 assert.equal(survey.leads.length,97);assert.equal(data.routes.length,42);
});
