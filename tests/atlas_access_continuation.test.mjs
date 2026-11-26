import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {normaliseRoute, eligibleMapPin} from '../atlas-explorer-geometry.mjs';

const root=path.resolve(import.meta.dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p));
const json=p=>JSON.parse(read(p));
const sha=value=>createHash('sha256').update(value).digest('hex');
const canonical=value=>Array.isArray(value)?value.map(canonical):
 value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
const digest=value=>sha(JSON.stringify(canonical(value)));
const packet='docs/qa/access-continuation-2026-11-26/';
const evidence=json(packet+'observations.json');
const data=json('atlas-explorer-data.json');
const survey=json('MAPS_ACCESS_ROUTE_SURVEY.json');
const targetIds=[...Array.from({length:7},(_,i)=>'rouge-sector-'+(i+2)),...Array.from({length:12},(_,i)=>'jaune-sector-'+(i+1))];

test('access continuation preserves every original route, lead and unaffected source field',()=>{
 assert.equal(evidence.baseline_head,'a459fdb0b5cf78008ec15ab7d7f87c779fd9400c');
 const originalRoutes=data.routes.slice(0,26);
 assert.deepEqual(originalRoutes.map(r=>r.id),evidence.baseline.route_ids);
 assert.equal(digest(originalRoutes),evidence.baseline.routes_canonical_sha256);
 assert.equal(digest(Object.fromEntries(Object.entries(data).filter(([k])=>k!=='routes'))),evidence.baseline.non_route_explorer_canonical_sha256);
 const originalLeads=survey.leads.slice(0,78);
 assert.deepEqual(originalLeads.map(r=>r.id),evidence.baseline.lead_ids);
 assert.equal(digest(originalLeads),evidence.baseline.leads_canonical_sha256);
 assert.equal(digest(survey.coverage.filter(r=>!targetIds.includes(r.id))),evidence.baseline.untouched_coverage_canonical_sha256);
 const retainedMetadata=survey.historical_current_completion_checkpoint_89_97;
 assert.equal(retainedMetadata.captured_from_release_sha,'223762bd1a21c2e72c592e975499d13c4195ae07');
 assert.deepEqual(Object.keys(retainedMetadata.fields).sort(),['current_completion_checkpoint','next']);
 const historical=Object.fromEntries(evidence.baseline.historical_survey_keys.map(k=>[
  k,Object.hasOwn(retainedMetadata.fields,k)?retainedMetadata.fields[k]:survey[k]
 ]));
 assert.equal(digest(historical),evidence.baseline.historical_survey_sections_canonical_sha256);
});

test('all nineteen formerly unstarted access areas have useful evidence without an inventory or geometry signoff',()=>{
 assert.deepEqual(evidence.area_reviews.map(r=>r.area_id),targetIds);
 assert.equal(evidence.summary.areas_reviewed,19);
 assert.deepEqual(evidence.summary,{
  areas_reviewed:19,new_routes:16,new_steps:66,existing_routes_preserved:26,routes_total:42,
  new_leads:19,existing_leads_preserved:78,leads_total:97,sector_rows_with_written_review:48,
  wild_zone_rows_with_written_review:20,fully_completed_area_inventories:0,new_exact_pins:0,new_collectible_ids:0
 });
 assert.equal(data.routes.length,42);
 assert.equal(data.routes.reduce((n,r)=>n+r.steps.length,0),217);
 assert.equal(survey.leads.length,97);
 assert.equal(new Set(survey.leads.map(r=>r.id)).size,97);
 assert.equal(survey.summary.sector_text_research_started,48);
 assert.equal(survey.summary.wild_zone_text_research_started,20);
 assert.equal(survey.summary.route_course_leads,97);
 assert.equal(survey.summary.fully_completed_areas,0);
 assert.equal(survey.coverage.length,68);
 assert.ok(survey.coverage.every(r=>r.status!=='not_started'&&r.geometry_complete===false&&r.inventory_complete===false));
 const register=new Map(evidence.source_registry.map(s=>[s.id,s]));
 assert.equal(register.size,evidence.source_registry.length);
 for(const review of evidence.area_reviews){
  const row=survey.coverage.find(r=>r.id===review.area_id);
  assert.ok(['partial_text_research','partial_text_and_owner_photo_research'].includes(row.status));
  assert.equal(review.review_status,'written_sources_and_original_images_reviewed');
  assert.equal(review.source_map_precision,'orientation_only');
  assert.equal(review.physical_traversal_verified,false);
  assert.equal(review.geometry_complete,false);assert.equal(review.inventory_complete,false);
  assert.ok(review.unresolved.length>30);
  assert.ok(review.source_keys.length>=2,review.area_id+' needs destination/approach evidence');
  assert.ok(review.source_keys.every(id=>register.has(id)));
  assert.deepEqual(row.lead_ids,review.lead_ids);
  assert.deepEqual(row.written_guidance_review.route_ids,[...review.new_route_ids,...review.retained_route_ids]);
  assert.deepEqual(row.written_guidance_review.published_guide_refs,review.retained_guide_refs);
  assert.ok(review.new_route_ids.length||review.retained_route_ids.length||review.retained_guide_refs.length);
  assert.equal(row.written_guidance_review.source_record,packet+'observations.json');
  for(const ref of review.retained_guide_refs){
   const [file,anchor]=ref.split('#');
   assert.ok(read(file).toString().includes('id="'+anchor+'"'),ref);
  }
 }
});

test('sixteen new approaches use the existing route engine and never create map points or collectible IDs',()=>{
 const added=data.routes.slice(26);
 const ids=new Set([...data.holovators,...data.ladders,...data.sectors].map(r=>r.id));
 assert.deepEqual(added.map(r=>r.id),evidence.new_route_ids);
 assert.equal(digest(added),evidence.new_routes_canonical_sha256);
 assert.equal(new Set(data.routes.map(r=>r.id)).size,42);
 for(const route of added){
  const area=data.sectors.find(s=>s.id===route.point_id);
  assert.ok(normaliseRoute(route,ids),route.id);
  assert.ok(targetIds.includes(route.point_id));assert.equal(area.district,route.district);
  assert.equal(route.anchor_precision,'district_only');assert.equal(area.xy,null);
  assert.equal(eligibleMapPin({...area,kind:'sector'}),false);
  assert.equal(route.known_floor_plan,false);assert.equal(route.roof_exit_xy,null);
  assert.equal(route.source_record,'MAPS_ACCESS_ROUTE_SURVEY.json');
  assert.equal(route.steps.at(-1).evidence,'unverified');
  assert.ok(route.steps.every(s=>['guide_crosscheck','unverified'].includes(s.evidence)));
  assert.ok(route.steps.every(s=>!/<[^>]+>/.test(s.instruction)&&!s.video_refs));
  for(const id of route.related_photo_ids||[]){
   const original=data.holovators.find(h=>h.id===id);
   assert.equal(original.district,route.district);assert.ok(original.photos.length);
  }
 }
 assert.deepEqual(survey.leads.slice(78).map(r=>r.id),evidence.new_lead_ids);
 for(const lead of survey.leads.slice(78)){
  assert.equal(lead.publish_new_pin,false);assert.equal(lead.geometry_status,'unregistered');
  assert.deepEqual(lead.candidate_original_screw_ids,[]);
  for(const key of ['canonical_screw_id','source_category_marker_id','source_xy','atlas_entrance_xy','atlas_exit_xy','floor_exact'])assert.equal(lead[key],null,key);
  assert.ok(lead.sources.length>=2);assert.ok(lead.route_ids.every(id=>data.routes.some(r=>r.id===id)));
 }
});

test('the new review references unchanged original crops and observed owner photographs',()=>{
 const uniqueCrops=new Set();const ownerPaths=new Set();
 for(const review of evidence.area_reviews){
  const crop=review.source_map;
  const original=data.sectors.find(s=>s.id===review.area_id).source_map_reference;
  assert.deepEqual(crop,original);
  assert.equal(sha(read(crop.image_path)),crop.sha256,crop.image_path);
  uniqueCrops.add(crop.image_path);
  const permitted=review.related_photo_ids.flatMap(id=>data.holovators.find(h=>h.id===id).photos.map(p=>p.path));
  for(const image of review.reviewed_owner_photo_paths){
   assert.ok(permitted.includes(image),image);
   assert.equal(sha(read(image)),evidence.reviewed_owner_photo_sha256[image],image);
   ownerPaths.add(image);
  }
 }
 assert.equal(uniqueCrops.size,16);assert.equal(ownerPaths.size,14);
 for(const source of evidence.source_registry){
  if(source.path)assert.equal(sha(read(source.path)),source.sha256,source.path);
  else {assert.match(source.url,/^https:\/\//);assert.doesNotMatch(source.url,/youtube|youtu\.be/i);}
 }
 for(const file of json(packet+'ARTIFACT_SHA256.json').files)assert.equal(sha(read(file.path)),file.sha256,file.path);
});

test('source disagreements, mission distinctions and existing approaches remain visible',()=>{
 const text=id=>data.routes.find(r=>r.id===id).steps.map(s=>s.instruction).join(' ');
 assert.match(text('rouge4-passage-ombrage-roof'),/differ on the side/);
 assert.match(text('rouge4-passage-ombrage-roof'),/Sector 7.*southern corner/);
 assert.match(text('rouge8-courtyard-scaffold-approach'),/requiring Roto-Glide/);
 assert.equal(data.routes.find(r=>r.id==='jaune7-kizuna-hyper-beam-approach').side_mission,80);
 assert.match(text('jaune7-kizuna-hyper-beam-approach'),/does not certify that its lift is the mission-80 device/);
 assert.match(text('jaune8-froakie-scaffold-approach'),/final 50-second course.*not wholly inside Jaune Sector 8/);
 assert.match(text('jaune8-froakie-scaffold-approach'),/requires Roto-Glide/);
 const retained=new Map(evidence.area_reviews.map(r=>[r.area_id,r]));
 assert.deepEqual(retained.get('jaune-sector-6').retained_route_ids,['jaune6-holovator-muscle']);
 assert.deepEqual(retained.get('jaune-sector-12').retained_route_ids,['jaune12-wz6']);
 assert.match(retained.get('jaune-sector-10').unresolved,/No repeatable free-roam ladder/);
 assert.equal(data.routes.find(r=>r.id==='jaune12-wz6').risk,'hostile_wild_pokemon');
 assert.equal(data.routes.find(r=>r.id==='jaune1-park-kakuna-approach').side_mission,11);
 assert.match(text('jaune1-park-kakuna-approach'),/request is in Jaune Sector 1/);
});
