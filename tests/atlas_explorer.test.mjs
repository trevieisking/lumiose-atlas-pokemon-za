import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createHash} from "node:crypto";
import {
  MAP_SIZE, stageBase, startView, project, unproject, constrain,
  panBy, changeAround, centreOn, wrapRotation, normaliseRoute, eligibleMapPin,
  coverageCellCentre, districtStart, routeVideoUrl
} from "../atlas-explorer-geometry.mjs";
import {VIDEO_BOOKMARK_KEY,validVideoBookmark,saveVideoBookmark,readVideoBookmark,forgetVideoBookmark} from "../atlas-video-bookmark.mjs";
const root=path.resolve(import.meta.dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const data=JSON.parse(read("atlas-explorer-data.json"));
const near=(a,b,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,String(a)+" != "+String(b));
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
  assert.equal(data.routes.length,15);
  assert.equal(new Set(data.routes.map(x=>x.id)).size,15);
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

test("AT-295 optional video references are timestamped, labelled, safe and do not establish map geometry",()=>{
  const route=data.routes.find(x=>x.id==="vert9-vernal-rooftop-screw");
  const refs=route.steps.flatMap((s,i)=>(s.video_refs||[]).map(v=>[i,v]));
  assert.deepEqual(refs.map(([i,v])=>[i,v.video_id,v.start_seconds,v.verification]),[[1,"IuvITD247zU",59,"publisher_chapter"],[3,"5-dLjd4o8Rc",694,"numbering_candidate"],[5,"PKw9fyChBVg",377,"publisher_chapter"]]);
  for(const [i,v] of refs){const url=new URL(routeVideoUrl(v));assert.equal(url.origin,"https://www.youtube.com");assert.equal(url.pathname,"/watch");assert.equal(url.searchParams.get("v"),v.video_id);assert.equal(url.searchParams.get("t"),v.start_seconds+"s");assert.equal(route.steps[i].evidence,"guide_crosscheck");}
  const v=refs[0][1];
  for(const invalid of [null,{...v,video_id:"javascript:alert(1)"},{...v,video_id:"abc&evil.com"},{...v,start_seconds:-1},{...v,start_seconds:1.5},{...v,verification:"frame_verified"},{...v,creator:""}])assert.equal(routeVideoUrl(invalid),null);
  assert.match(refs[1][1].note,/regional clue is #2.*unconfirmed/);
  assert.equal(route.roof_exit_xy,null);assert.equal(route.known_floor_plan,false);assert.equal(route.steps.at(-1).evidence,"unverified");
  assert.equal(data.routes.length,15);assert.equal(data.holovators.length,21);assert.equal(data.holovators.reduce((n,h)=>n+h.photos.length,0),111);
});

test("AT-295 video return uses one private key, preserves unrelated state and tolerates blocked storage",()=>{
  const b={version:1,routeId:"vert9-vernal-rooftop-screw",stepIndex:3,stepTitle:"Rooftop Screw #2 — Holovator approach",videoId:"5-dLjd4o8Rc",selectedId:"vert-sector-9",filter:"sector",search:"",hiddenLayers:["ladder"],sector:"vert-sector-9",coverageArea:"",coverageText:"District starting view",tint:false,view:{zoom:2.4,rotation:45,panX:12,panY:-24},stageSize:400,anchorTop:350};
  assert.ok(validVideoBookmark(b));
  for(const invalid of [null,{...b,version:2},{...b,stepIndex:-1},{...b,videoId:"javascript:alert(1)"},{...b,view:{...b.view,panX:Infinity}},{...b,stageSize:0}])assert.equal(validVideoBookmark(invalid),false);
  const values=new Map([["existing-progress","unchanged"]]);
  const host={history:{state:{other:"preserved"},replaceState(value){this.state=value;}},localStorage:{setItem(k,v){values.set(k,v);},getItem(k){return values.get(k)||null;},removeItem(k){values.delete(k);}}};
  assert.equal(saveVideoBookmark(host,b),true);assert.deepEqual(readVideoBookmark(host,false),b);assert.equal(host.history.state.other,"preserved");
  host.history.state=null;assert.equal(readVideoBookmark(host,false),null);assert.deepEqual(readVideoBookmark(host,true),b);
  forgetVideoBookmark(host);assert.equal(readVideoBookmark(host,true),null);assert.equal(values.get("existing-progress"),"unchanged");assert.equal(values.has(VIDEO_BOOKMARK_KEY),false);
  const denied={history:{state:null,replaceState(){throw Error("blocked");}},get localStorage(){throw Error("blocked");}};
  assert.equal(saveVideoBookmark(denied,b),false);assert.equal(readVideoBookmark(denied,true),null);assert.doesNotThrow(()=>forgetVideoBookmark(denied));
  const module=read("atlas-video-bookmark.mjs");assert.doesNotMatch(module,/fetch\s*\(|supabase\.|sessionStorage\s*\./i);
});

test("AT-296 Vert 1 and 2 written approaches retain all prior routes and use candidate chapter metadata",()=>{
  const a=data.routes.find(r=>r.id==="vert1-scaffold-courses"),b=data.routes.find(r=>r.id==="vert2-southern-rooftop");
  assert.equal(a.point_id,"vert-sector-1");assert.equal(b.point_id,"vert-sector-2");
  assert.equal(a.steps.length,6);assert.equal(b.steps.length,4);
  for(const r of [a,b]){assert.equal(r.anchor_precision,"district_only");assert.equal(r.roof_exit_xy,null);assert.equal(r.known_floor_plan,false);assert.equal(r.steps.at(-1).evidence,"unverified");}
  assert.deepEqual(a.steps.flatMap(s=>(s.video_refs||[]).map(v=>routeVideoUrl(v))),["https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=30s","https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=46s","https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=82s"]);
  assert.equal(routeVideoUrl(b.steps[2].video_refs[0]),"https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=82s");
  assert.match(a.steps[1].instruction,/#10 and #11.*candidates/);assert.match(b.steps[2].instruction,/Roto-Glide.*difficult running-roll/);
  assert.ok([a,b].flatMap(r=>r.steps.flatMap(s=>s.video_refs||[])).every(v=>v.verification==="numbering_candidate"));
  assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
});


test("AT-298 Vert 3 rooftop guidance preserves owner route and uncertain identities",()=>{
  const r=data.routes.find(x=>x.id==="vert3-cyclone-rooftop-courses");
  assert.equal(r.point_id,"vert-sector-3");assert.equal(r.anchor_precision,"district_only");assert.equal(r.steps.length,6);
  assert.deepEqual(r.related_photo_ids,["vert-cyclone"]);assert.equal(r.roof_exit_xy,null);assert.equal(r.known_floor_plan,false);
  assert.deepEqual(r.steps.flatMap(s=>(s.video_refs||[]).map(v=>routeVideoUrl(v))),["https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=138s","https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=181s","https://www.youtube.com/watch?v=5-dLjd4o8Rc&t=238s"]);
  assert.ok(r.steps.flatMap(s=>s.video_refs||[]).every(v=>v.verification==="numbering_candidate"));
  assert.match(r.steps[1].instruction,/Do not tick both/);assert.match(r.steps[4].instruction,/#15 separate from the west-rooftops clue #14/);assert.match(r.steps[5].instruction,/#16, not another name for #15/);
  const original=data.routes.find(x=>x.id==="cafe-cyclone");assert.equal(original.steps.length,5);assert.match(original.steps[1].instruction,/archway/);
  assert.equal(data.holovators.find(x=>x.id==="vert-cyclone").photos.length,6);assert.equal(data.holovators.length,21);assert.equal(data.ladders.length,1);assert.equal(data.counts.colorful_screws_preserved_in_existing_pages,100);
});
