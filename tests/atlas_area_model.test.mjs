import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {wildZoneRecords} from '../wild-zone-fieldbook.mjs';
import {AREA_MAP,buildAreaModel,evaluateAreaGeometry,selectAreaResults,readAreaSelection,areaSelectionUrl,areaLink,speciesKey,safeAreaSourceHref} from '../atlas-area-model.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const atlas=JSON.parse(read('atlas-explorer-data.json'));
const production=JSON.parse(read('atlas-area-evidence.json'));
const clone=x=>JSON.parse(JSON.stringify(x));
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const baseline=()=>({schemaVersion:1,map:{...AREA_MAP},areas:[],geometries:[]});
// Baseline classification fixtures remain independent of later additive source
// claims. Production evidence is validated separately below.
const model=buildAreaModel({atlas,rosters:wildZoneRecords,evidence:baseline()});
const square=(x=900,y=900,size=100)=>[[x,y],[x+size,y],[x+size,y+size],[x,y+size],[x,y]];
function approved(areaId='wz-01'){
  return {area_id:areaId,kind:areaId.startsWith('wz-')?'zone':'sector',status:'approved',coordinateSpace:AREA_MAP.coordinateSpace,mapSha256:AREA_MAP.sha256,
    geometry:{type:'Polygon',coordinates:[square()]},sources:[{path:AREA_MAP.path,sha256:AREA_MAP.sha256,claim:'Synthetic test fixture only; no gameplay claim.'}],
    registration:{method:'Synthetic native test fixture',control_count:4,holdout_count:2,max_error_px:0,uncertainty_px:1,threshold_px:2},
    review:{boundary:true,registration:true,independent:true,occlusion:true},notes:[]};
}
const area=id=>model.areas.find(a=>a.id===id);
function evidenceRow(overrides={}){return {id:'test-corroborated-pidgey',species:'Pidgey',encounter_class:'ordinary',form:null,condition:{time:'Day',weather:null,floor:null,unlock:null,notes:['Synthetic source condition.']},evidence_status:'source_corroborated',sources:[{url:'https://www.serebii.net/legendsz-a/wildzones.shtml',claim:'Synthetic test source claim.'}],notes:[],...overrides};}
const build=evidence=>buildAreaModel({atlas,rosters:wildZoneRecords,evidence});

test('shared model preserves 68 original areas, every original centre and all distinct encounter rows',()=>{
  const input=freeze({atlas:clone(atlas),rosters:clone(wildZoneRecords),evidence:baseline()}),before=JSON.stringify(input);
  const m=buildAreaModel(input);
  assert.equal(m.areas.length,68);assert.equal(new Set(m.areas.map(a=>a.id)).size,68);
  assert.deepEqual(m.areas.map(a=>a.id),[...atlas.sectors,...atlas.zones].map(a=>a.id));
  for(const original of atlas.zones)assert.deepEqual(m.areas.find(a=>a.id===original.id).xy,original.xy);
  assert.ok(m.areas.filter(a=>a.kind==='sector').every(a=>a.xy===null));
  assert.equal(m.encounters.length,272);assert.equal(new Set(m.encounters.map(e=>e.id)).size,272);
  assert.equal(m.encounters.filter(e=>e.encounterClass==='recorded').length,152);
  assert.equal(m.encounters.filter(e=>e.encounterClass==='ordinary').length,15);
  assert.ok(m.encounters.filter(e=>e.encounterClass==='ordinary').every(e=>e.areaId==='wz-20'));
  assert.equal(m.encounters.filter(e=>e.encounterClass==='fixed_alpha').length,38);
  assert.equal(m.encounters.filter(e=>e.encounterClass==='rotating_alpha').length,67);
  const duplicateForms=m.encounters.filter(e=>e.areaId==='wz-17'&&e.encounterClass==='fixed_alpha'&&e.species==='Pyroar');
  assert.equal(duplicateForms.length,2);assert.notEqual(duplicateForms[0].id,duplicateForms[1].id);assert.ok(duplicateForms.every(e=>e.form===null));
  assert.equal(m.species.length,171);assert.deepEqual(m.issues,[]);assert.equal(JSON.stringify(input),before);
  assert.ok(Object.isFrozen(m.areas[0]));assert.throws(()=>{m.areas[0].id='changed';},TypeError);
});

test('production renders only the independently reviewed boundary subset on the unchanged native map',()=>{
  const expected=['wz-02','wz-03','wz-05','wz-11','wz-16'];
  assert.deepEqual(production.geometries.map(row=>row.area_id).sort(),expected);assert.deepEqual(production.map,AREA_MAP);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+AREA_MAP.path,import.meta.url))).digest('hex'),AREA_MAP.sha256);
  const current=buildAreaModel({atlas,rosters:wildZoneRecords,evidence:production});
  const receipt=JSON.parse(read('docs/qa/ATLAS_AT339_GEOMETRY_EVIDENCE.json'));
  assert.equal(current.areas.length,68);assert.deepEqual(current.areas.filter(a=>a.geometry.eligible).map(a=>a.id).sort(),expected);
  assert.deepEqual(receipt.approved.map(row=>row.area_id).sort(),expected);
  assert.ok(current.areas.filter(a=>!expected.includes(a.id)).every(a=>!a.geometry.eligible&&a.geometry.geometry===null));
  for(const geometry of production.geometries){
    const review=receipt.approved.find(row=>row.area_id===geometry.area_id);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(geometry.geometry)).digest('hex'),review.production_geometry_sha256);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+review.review.review_panel_path,import.meta.url))).digest('hex'),review.review.review_panel_sha256);
    for(const source of geometry.sources)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+source.path,import.meta.url))).digest('hex'),source.sha256);
  }
});

test('malformed, duplicate and out-of-range original area identities fail closed',()=>{
  for(const change of [a=>a.sectors.pop(),a=>{a.zones[1].id=a.zones[0].id;},a=>{a.sectors[0].id='rouge-sector-9';},a=>{a.sectors[0].id='vert-sector-10';},a=>{a.zones[0].number=21;}]){
    const altered=clone(atlas);change(altered);assert.equal(buildAreaModel({atlas:altered,rosters:wildZoneRecords,evidence:baseline()}).areas.length,0);
  }
  assert.equal(buildAreaModel({atlas,rosters:wildZoneRecords.slice(1)}).areas.length,0);
  assert.equal(readAreaSelection('atlas-explorer.html?area=rouge-sector-9').areaId,null);
  assert.equal(readAreaSelection('atlas-explorer.html?area=jaune-sector-12').areaId,'jaune-sector-12');
});

test('species selection finds every recorded habitat while preserving encounter classes and exact zone search',()=>{
  assert.deepEqual(selectAreaResults(model,{speciesId:'pidgey'}).areas.map(a=>a.id),['wz-01','wz-05']);
  assert.deepEqual(selectAreaResults(model,{speciesId:'pidgey',encounterClass:'fixed_alpha'}).areas.map(a=>a.id),['wz-01']);
  assert.deepEqual(selectAreaResults(model,{speciesId:'pidgey',district:'Bleu'}).areas.map(a=>a.id),['wz-05']);
  assert.deepEqual(selectAreaResults(model,{query:'Wild Zone 2'}).areas.map(a=>a.id),['wz-02']);
  assert.deepEqual(selectAreaResults(model,{query:'Wild Zone 02'}).areas.map(a=>a.id),['wz-02']);
  assert.equal(selectAreaResults(model,{query:'Wild Zone 21'}).areas.length,0);
  assert.equal(selectAreaResults(model,{speciesId:'talonflame',encounterClass:'rotating_alpha'}).areas[0].id,'wz-20');
  assert.equal(selectAreaResults(model,{speciesId:'chikorita',encounterClass:'ordinary'}).areas[0].id,'wz-20');
  assert.equal(selectAreaResults(model,{speciesId:'pidgey',encounterClass:'ordinary'}).areas.length,0,'A mixed old roster is not silently an ordinary roster');
  assert.equal(speciesKey('Flabébé'),'flabebe');assert.equal(speciesKey('Nidoran♀'),'nidoran-female');
});

test('additive source rows keep conditions and sources; unsupported and non-wild classes never create habitat claims',()=>{
  const evidence=baseline();evidence.areas=[{area_id:'vert-sector-1',roster_status:'not_comprehensive',notes:['Source conditions remain partial.'],encounters:[
    evidenceRow(),evidenceRow({id:'test-boss',species:'Zygarde',encounter_class:'scripted_boss'}),
    evidenceRow({id:'test-uncited',species:'Mew',evidence_status:'verified',sources:[]}),
    evidenceRow({id:'test-lead',species:'Hawlucha',encounter_class:'unclassified_lead',evidence_status:'source_lead'}),
    evidenceRow({id:'test-dispute',species:'Talonflame',encounter_class:'ordinary',evidence_status:'disputed'})
  ]}];
  const m=build(freeze(evidence));assert.equal(m.areas.length,68);assert.equal(m.encounters.length,277);
  const row=m.encounters.find(e=>e.id==='test-corroborated-pidgey');assert.equal(row.condition.time,'Day');assert.equal(row.condition.weather,null);assert.equal(row.sources.length,1);
  assert.ok(selectAreaResults(m,{speciesId:'pidgey'}).areas.some(a=>a.id==='vert-sector-1'));
  for(const id of ['zygarde','mew'])assert.equal(selectAreaResults(m,{speciesId:id}).areas.length,0);
  assert.deepEqual(selectAreaResults(m,{speciesId:'hawlucha'}).areas.map(a=>a.id),['wz-20'],'An added sector lead does not replace the original rotating candidate');
  assert.equal(selectAreaResults(m,{speciesId:'mew'}).relatedClaims[0].evidenceStatus,'source_lead');
  assert.equal(selectAreaResults(m,{speciesId:'hawlucha',encounterClass:'unclassified_lead'}).areas[0].id,'vert-sector-1');
  assert.equal(selectAreaResults(m,{speciesId:'hawlucha',encounterClass:'unclassified_lead'}).geometries.length,0);
  assert.equal(selectAreaResults(m,{speciesId:'talonflame',encounterClass:'ordinary'}).areas.length,0);
});

test('a targeted dispute retains its original row but excludes that class from habitat results',()=>{
  const evidence=baseline();evidence.areas=[{area_id:'wz-01',encounters:[evidenceRow({id:'test-disputed-fixed',encounter_class:'fixed_alpha',evidence_status:'disputed'})]}];
  const m=build(evidence),preserved=m.encounters.find(e=>e.id==='wz-01:fixed_alpha:0');
  assert.equal(preserved.species,'Pidgey');assert.equal(preserved.evidenceStatus,'disputed');assert.equal(preserved.originalEvidenceStatus,'baseline_preserved');
  assert.equal(selectAreaResults(m,{speciesId:'pidgey',encounterClass:'fixed_alpha'}).areas.length,0);
  assert.equal(m.encounters.filter(e=>e.encounterClass==='fixed_alpha'&&e.originalEvidenceStatus!=='new').length,39);
  assert.ok(selectAreaResults(m,{speciesId:'pidgey'}).relatedClaims.some(e=>e.id===preserved.id));
});

test('an ordinary dispute qualifies the old unclassified union without erasing an independent Alpha',()=>{
  const evidence=baseline();evidence.areas=[{area_id:'wz-01',encounters:[evidenceRow({id:'test-disputed-ordinary',evidence_status:'disputed'})]}];
  const m=build(evidence),rows=m.encounters.filter(e=>e.areaId==='wz-01'&&e.speciesId==='pidgey');
  const original=rows.find(e=>e.encounterClass==='recorded'),alpha=rows.find(e=>e.encounterClass==='fixed_alpha');
  assert.equal(original.evidenceStatus,'disputed');assert.equal(original.originalEvidenceStatus,'baseline_preserved');
  assert.equal(alpha.evidenceStatus,'baseline_preserved');
  const all=selectAreaResults(m,{speciesId:'pidgey'});
  assert.ok(all.areas.some(a=>a.id==='wz-01'));assert.ok(all.encounters.some(e=>e.id===alpha.id));
  assert.ok(!all.encounters.some(e=>e.id===original.id));assert.ok(all.relatedClaims.some(e=>e.id===original.id));
  assert.ok(!selectAreaResults(m,{speciesId:'pidgey',encounterClass:'recorded'}).areas.some(a=>a.id==='wz-01'));
});

test('approved polygons, holes and separate pieces retain exact native coordinates without deriving centres',()=>{
  const value=approved();value.geometry.coordinates.push(square(920,920,20));
  const before=JSON.stringify(value),result=evaluateAreaGeometry(area('wz-01'),freeze(value),AREA_MAP);
  assert.equal(result.eligible,true);assert.deepEqual(result.geometry,value.geometry);assert.equal(JSON.stringify(value),before);assert.ok(Object.isFrozen(result.geometry.coordinates[0]));
  const multi=approved();multi.geometry={type:'MultiPolygon',coordinates:[[square(100,100)],[square(400,400)]]};
  assert.equal(evaluateAreaGeometry(area('wz-01'),multi,AREA_MAP).eligible,true);
  const e=baseline();e.geometries=[multi,approved('vert-sector-1')];const m=build(e);
  assert.equal(m.areas.filter(a=>a.geometry.eligible).length,2);assert.equal(m.areas.find(a=>a.id==='vert-sector-1').xy,null);
  assert.deepEqual(m.areas.find(a=>a.id==='wz-01').xy,atlas.zones[0].xy);
});

test('boundary gate rejects candidate status, wrong map, incomplete proof and invalid topology',()=>{
  const changes=[
    r=>{r.status='candidate';},r=>{r.area_id='wz-02';},r=>{r.kind='sector';},r=>{r.mapSha256='0'.repeat(64);},r=>{r.coordinateSpace='source-pixels';},
    r=>{r.review.independent=false;},r=>{r.registration.holdout_count=1;},r=>{r.registration.control_count=3;},r=>{r.registration.max_error_px=3;},r=>{r.registration.uncertainty_px=3;},
    r=>{r.sources=[];},r=>{r.sources[0].sha256='unknown';},r=>{r.sources[0].path='assets/atlas/../other.png';},
    r=>{r.geometry.coordinates[0][0]=[-1,900];},r=>{r.geometry.coordinates[0].pop();},
    r=>{r.geometry.coordinates=[[[0,0],[20,20],[40,40],[0,0]]];},
    r=>{r.geometry.coordinates=[[[100,100],[300,300],[300,100],[100,300],[100,100]]];},
    r=>{r.geometry.coordinates.push(square(100,100,10));},
    r=>{r.geometry.coordinates.push(square(920,920,50),square(930,930,50));},
    r=>{r.geometry={type:'MultiPolygon',coordinates:[[square(100,100)],[square(150,150)]]};}
  ];
  for(const change of changes){const record=approved();change(record);assert.equal(evaluateAreaGeometry(area('wz-01'),record,AREA_MAP).eligible,false,JSON.stringify(record));}
  assert.equal(evaluateAreaGeometry(area('wz-01'),approved(),null).reason,'map_mismatch');
  const noMap=baseline();delete noMap.map;noMap.geometries=[approved()];assert.equal(build(noMap).areas.find(a=>a.id==='wz-01').geometry.eligible,false);
});

test('duplicate boundary records and unknown areas fail closed without losing original directory rows',()=>{
  const evidence=baseline();evidence.geometries=[approved(),approved(),approved('wz-99')];evidence.areas=[{area_id:'rouge-sector-9',encounters:[evidenceRow()]}];
  const m=build(evidence);assert.equal(m.areas.length,68);assert.equal(m.areas.find(a=>a.id==='wz-01').geometry.reason,'duplicate_boundary_evidence');
  assert.ok(m.issues.includes('Unknown boundary area rejected'));assert.ok(m.issues.includes('Unknown encounter area rejected'));
  assert.equal(m.encounters.length,272);
});

test('new and legacy deep links round-trip while preserving unrelated routes, collection keys and anchors',()=>{
  for(const [url,id] of [['atlas-explorer.html?place=wz-01','wz-01'],['atlas-explorer.html?sector=vert-sector-1','vert-sector-1'],['maps.html#wild-zone-2','wz-02'],['sector-maps.html#wildzone-20','wz-20'],['sector-maps.html#sector-jaune-sector-12','jaune-sector-12']])assert.equal(readAreaSelection(url).areaId,id);
  assert.equal(readAreaSelection('atlas-explorer.html?area=wz-02&place=wz-01').areaId,'wz-02');
  assert.equal(readAreaSelection('atlas-explorer.html?species=pidgey&place=wz-01').areaId,null);
  const current='https://example.org/project/atlas-explorer.html?source=atlas&place=hotel-z-ladder&collectible=item%3A1-0#unrelated';
  const url=areaSelectionUrl(current,{areaId:'wz-02'}),parsed=new URL(url,'https://example.org');
  assert.equal(parsed.searchParams.get('source'),'atlas');assert.equal(parsed.searchParams.get('place'),'hotel-z-ladder');assert.equal(parsed.searchParams.get('collectible'),'item:1-0');assert.equal(parsed.hash,'#unrelated');
  assert.equal(readAreaSelection(url).areaId,'wz-02');
  const rewritten=areaSelectionUrl('atlas-explorer.html?place=wz-01&sector=vert-sector-1',{areaId:'wz-02'});
  assert.equal(new URL(rewritten,'https://example.org').searchParams.get('place'),'wz-02');assert.equal(new URL(rewritten,'https://example.org').searchParams.has('sector'),false);
  const cleared=areaSelectionUrl('maps.html?source=atlas&area=wz-02#wild-zone-2',{});assert.equal(cleared,'/maps.html?source=atlas');
  assert.equal(areaLink({speciesId:'Flabébé'}),'atlas-explorer.html?species=flabebe');
  assert.equal(areaLink({areaId:'vert-sector-1'}),'atlas-explorer.html?area=vert-sector-1');
});

test('source links use known written references and the model has no storage or network side effects',()=>{
  for(const url of ['https://www.serebii.net/legendsz-a/wildzones.shtml','https://game8.jp/pokemon-legends-z-a','https://www.thonky.com/pokemon-legends-z-a/','docs/qa/evidence.json','assets/atlas/wild-zones/wild-zone-01-overview.png'])assert.equal(typeof safeAreaSourceHref(url),'string');
  for(const url of ['javascript:alert(1)','data:text/html,x','https://example.org/unreviewed','docs/../secret.json','//example.org/'])assert.equal(safeAreaSourceHref(url),null);
  assert.doesNotMatch(read('atlas-area-model.mjs'),/\b(?:localStorage|sessionStorage|fetch|XMLHttpRequest)\s*[.(]/);
  assert.doesNotMatch(read('atlas-area-ui.mjs'),/\b(?:localStorage|sessionStorage)\s*[.(]/);
});
