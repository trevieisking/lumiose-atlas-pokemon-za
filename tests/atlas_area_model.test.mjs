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

test('production renders all 68 independently reviewed selection footprints on the unchanged native map',()=>{
  const expected=[...atlas.sectors.map(row=>row.id),...Array.from({length:20},(_,i)=>'wz-'+String(i+1).padStart(2,'0'))].sort();
  assert.deepEqual(production.geometries.map(row=>row.area_id).sort(),expected);assert.deepEqual(production.map,AREA_MAP);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+AREA_MAP.path,import.meta.url))).digest('hex'),AREA_MAP.sha256);
  const current=buildAreaModel({atlas,rosters:wildZoneRecords,evidence:production});
  const previousReceipt=JSON.parse(read('docs/qa/ATLAS_AT339_GEOMETRY_EVIDENCE.json'));
  const amendmentReceipt=JSON.parse(read('docs/qa/ATLAS_AT341_GEOMETRY_REVIEW.json'));
  assert.equal(crypto.createHash('sha256').update(read('docs/qa/ATLAS_AT339_GEOMETRY_EVIDENCE.json')).digest('hex'),amendmentReceipt.previous_packet_sha256);
  const continuationReceipt=JSON.parse(read('docs/qa/ATLAS_AT341_GEOMETRY_CONTINUATION.json'));
  for(const source of continuationReceipt.previous_packets){
    assert.equal(crypto.createHash('sha256').update(read(source.path)).digest('hex'),source.sha256);
  }
  const sectorReceipt=JSON.parse(read('docs/qa/ATLAS_AT341_SOURCE_AREA_APPROVAL.json'));
  assert.equal(crypto.createHash('sha256').update(read(sectorReceipt.source_candidate)).digest('hex'),sectorReceipt.source_candidate_sha256);
  const sectorCandidates=JSON.parse(read(sectorReceipt.source_candidate)).geometries;
  assert.equal(sectorCandidates.length,48);
  for(const candidate of sectorCandidates){
    assert.equal(candidate.status,'candidate_pending_root_review');
    assert.deepEqual(production.geometries.find(row=>row.area_id===candidate.area_id),{...candidate,status:'approved'},'Reviewed source coordinates and provenance remain exact');
  }
  const uiReceipt=JSON.parse(read('docs/qa/ATLAS_AT341_UI_OUTLINE_APPROVAL.json'));
  assert.equal(crypto.createHash('sha256').update(read(uiReceipt.source_candidate)).digest('hex'),uiReceipt.source_candidate_sha256);
  const uiCandidates=JSON.parse(read(uiReceipt.source_candidate)).geometries;
  assert.equal(uiCandidates.length,11);
  for(const candidate of uiCandidates){
    assert.equal(candidate.status,'candidate_pending_root_review');
    assert.deepEqual(production.geometries.find(row=>row.area_id===candidate.area_id),{...candidate,status:'approved'},'Only approval status changes on the reviewed UI selection candidates');
  }
  assert.equal(uiReceipt.preserved_records.length,57);
  for(const record of uiReceipt.preserved_records){
    const actual=production.geometries.find(row=>row.area_id===record.area_id);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(actual)).digest('hex'),record.record_sha256,'All nine earlier zones and 48 sectors remain exact');
  }
  const receipt={approved:[...previousReceipt.approved,...amendmentReceipt.approved,...continuationReceipt.approved,...sectorReceipt.approved,...uiReceipt.approved]};
  assert.equal(current.areas.length,68);assert.deepEqual(current.areas.filter(a=>a.geometry.eligible).map(a=>a.id).sort(),expected);
  assert.deepEqual(receipt.approved.map(row=>row.area_id).sort(),expected);
  assert.ok(current.areas.filter(a=>!expected.includes(a.id)).every(a=>!a.geometry.eligible&&a.geometry.geometry===null));
  assert.equal(current.areas.filter(a=>a.geometry.representation==='source_area_footprint').length,48);
  for(const geometry of production.geometries){
    const review=receipt.approved.find(row=>row.area_id===geometry.area_id);
    assert.equal(crypto.createHash('sha256').update(JSON.stringify(geometry.geometry)).digest('hex'),review.production_geometry_sha256);
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+review.review.review_panel_path,import.meta.url))).digest('hex'),review.review.review_panel_sha256);
    for(const [pathKey,hashKey] of [['supplementary_review_panel_path','supplementary_review_panel_sha256'],['review_receipt_path','review_receipt_sha256']]){
      if(review.review[pathKey])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+review.review[pathKey],import.meta.url))).digest('hex'),review.review[hashKey]);
    }
    for(const source of geometry.sources)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+source.path,import.meta.url))).digest('hex'),source.sha256);
    for(const artifact of review.artifacts||[])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+artifact.path,import.meta.url))).digest('hex'),artifact.sha256);
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

test('overlapping-area links retain separate rosters and reject invalid or duplicate destinations',()=>{
  const evidence=baseline(),valid={area_id:'wz-10',relationship:'overlapping_wild_zone',note:'The named sector overlaps the zone; the two rosters remain distinct.'};
  evidence.areas=[{area_id:'bleu-sector-10',encounters:[],related_areas:[valid,{...valid},{...valid,area_id:'wz-99'},{...valid,area_id:'javascript:alert(1)'},{...valid,area_id:'bleu-sector-10'},{...valid,relationship:'same_habitat'},{...valid,area_id:'wz-05',note:''}]}];
  const before=JSON.stringify(evidence),m=build(freeze(evidence)),sector=m.areas.find(a=>a.id==='bleu-sector-10');
  assert.deepEqual(sector.relatedAreas,[{areaId:'wz-10',relationship:valid.relationship,note:valid.note}]);
  assert.deepEqual(sector.encounters,[]);assert.equal(m.encounters.length,272);
  for(const species of m.species)assert.ok(!species.areaIds.includes('bleu-sector-10'),'Cross-reference cannot clone a zone habitat');
  assert.equal(JSON.stringify(evidence),before);assert.ok(Object.isFrozen(sector.relatedAreas));
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

test('AT-346 chance Alpha packet preserves six prior rows and adds 65 zone 1–10 rows without altering existing areas or outlines',()=>{
  const alphaEvidence=JSON.parse(read('atlas-area-alpha-evidence.json'));
  const before=build(production);
  const input=freeze({atlas:clone(atlas),rosters:clone(wildZoneRecords),evidence:clone(production),alphaEvidence:clone(alphaEvidence)});
  const snapshot=JSON.stringify(input),after=buildAreaModel(input);
  assert.equal(JSON.stringify(input),snapshot);
  assert.equal(after.areas.length,68);assert.deepEqual(after.issues,[]);
  assert.equal(after.encounters.length,before.encounters.length+71);
  assert.deepEqual(after.encounters.filter(row=>row.encounterClass!=='random_alpha'),before.encounters);
  assert.deepEqual(after.areas.map(({encounters,...rest})=>rest),before.areas.map(({encounters,...rest})=>rest));
  const lookup=speciesId=>selectAreaResults(after,{speciesId,encounterClass:'random_alpha'});
  assert.deepEqual(lookup('dratini').areas.map(a=>a.id),['jaune-sector-5']);
  assert.deepEqual(lookup('dragonair').areas.map(a=>a.id),['vert-sector-6']);
  const pumpkaboo=lookup('pumpkaboo');
  assert.deepEqual(pumpkaboo.areas.map(a=>a.id),['wz-15']);
  assert.deepEqual(pumpkaboo.encounters.map(r=>[r.form,r.condition.time]),[['Medium Variety','Day'],['Small Variety','Day'],['Large Variety','Night'],['Jumbo Variety','Night']]);
  assert.ok(pumpkaboo.encounters.every(r=>r.condition.unlock.includes('Wild Zone 15 survey')&&r.condition.notes.some(n=>n.includes('52–53'))));
  assert.deepEqual(pumpkaboo.geometries.map(g=>g.areaId),['wz-15']);
  assert.deepEqual(selectAreaResults(after,{speciesId:'pumpkaboo',encounterClass:'fixed_alpha'}),selectAreaResults(before,{speciesId:'pumpkaboo',encounterClass:'fixed_alpha'}));
  assert.equal(readAreaSelection(areaLink({speciesId:'pumpkaboo',encounterClass:'random_alpha'})).encounterClass,'random_alpha');
  assert.equal(after.encounters.filter(r=>r.encounterClass==='rotating_alpha').length,67);
  assert.equal(buildAreaModel({atlas,rosters:wildZoneRecords,evidence:production,alphaEvidence:{...alphaEvidence,mapSha256:'wrong'}}).encounters.length,before.encounters.length);
  assert.equal(buildAreaModel({atlas,rosters:wildZoneRecords,evidence:null,alphaEvidence}).encounters.length,272);
  const broken=clone(alphaEvidence);broken.areas[0].encounters[0].sources=[];
  const rejected=buildAreaModel({atlas,rosters:wildZoneRecords,evidence:production,alphaEvidence:broken});
  assert.equal(rejected.encounters.length,before.encounters.length+70);
  assert.equal(selectAreaResults(rejected,{speciesId:'dratini',encounterClass:'random_alpha'}).areas.length,0);
  assert.ok(rejected.issues.some(x=>x.includes('Rejected unsupported chance Alpha')));
});

test('AT-348 early-zone supplements preserve exact IDs, geometry, classes and statuses',()=>{
  const conditionEvidence=JSON.parse(read('atlas-area-condition-evidence.json'));
  const alphaEvidence=JSON.parse(read('atlas-area-alpha-evidence.json'));
  const before=buildAreaModel({atlas,rosters:wildZoneRecords,evidence:production,alphaEvidence});
  const input=freeze({atlas:clone(atlas),rosters:clone(wildZoneRecords),evidence:clone(production),alphaEvidence:clone(alphaEvidence),conditionEvidence:clone(conditionEvidence)});
  const snapshot=JSON.stringify(input),after=buildAreaModel(input);
  assert.equal(JSON.stringify(input),snapshot);assert.deepEqual(after.issues,[]);
  assert.equal(conditionEvidence.records.length,87);
  assert.equal(conditionEvidence.records.filter(r=>r.encounterClass==='ordinary').length,67);
  assert.equal(conditionEvidence.records.filter(r=>r.encounterClass==='fixed_alpha').length,20);
  assert.deepEqual(after.areas.map(({encounters,...rest})=>rest),before.areas.map(({encounters,...rest})=>rest));
  assert.deepEqual(after.encounters.map(({condition,sources,...rest})=>rest),before.encounters.map(({condition,sources,...rest})=>rest));
  const byId=new Map(after.encounters.map(r=>[r.id,r])),old=new Map(before.encounters.map(r=>[r.id,r])),ids=new Set(conditionEvidence.records.map(r=>r.id));
  assert.equal(ids.size,87);
  for(const entry of conditionEvidence.records){const row=byId.get(entry.id);assert.ok(row,entry.id);assert.equal(row.condition.level,entry.condition.level);assert.equal(row.condition.directions,entry.condition.directions);assert.match(row.condition.weather,/No special weather restriction reported/);assert.ok(row.sources.length>old.get(entry.id).sources.length);}
  assert.deepEqual(after.encounters.filter(r=>!ids.has(r.id)),before.encounters.filter(r=>!ids.has(r.id)));
  assert.match(byId.get('g3-evidence-wz-02-staryu-ordinary').condition.time,/night/i);
  assert.equal(byId.get('g3-evidence-wz-02-staryu-ordinary').condition.level,'5–7');
  assert.match(byId.get('wz-02:fixed_alpha:0').condition.time,/Day/);
  assert.match(byId.get('wz-02:fixed_alpha:1').condition.time,/Night/);
  assert.match(byId.get('g3-evidence-wz-03-flabebe-ordinary').condition.time,/reports differ/);
  assert.equal(after.encounters.filter(r=>r.encounterClass==='random_alpha'&&/^wz-0[1-6]$/.test(r.areaId)).length,38);
  const staryu=selectAreaResults(after,{speciesId:'staryu',areaId:'wz-02',encounterClass:'random_alpha'}).encounters;
  assert.equal(staryu.length,1);assert.match(staryu[0].condition.notes.join(' '),/17–19/);assert.match(staryu[0].condition.unlock,/survey/);
  assert.match(byId.get('g3-evidence-wz-08-gible-ordinary').condition.directions,/blue fin/);
  assert.equal(byId.get('g3-evidence-wz-08-gible-ordinary').condition.level,'24–25');
  assert.equal(byId.get('g3-evidence-wz-07-floette-form-red-flower').condition.level,'20–21');
  assert.equal(byId.get('g3-evidence-wz-07-floette-form-orange-flower').condition.level,'20–22');
  assert.match(byId.get('wz-08:fixed_alpha:0').condition.time,/not resolved/);
  assert.equal(byId.get('g3-evidence-wz-07-gastly-ordinary').evidenceStatus,'disputed');
  assert.equal(after.encounters.filter(r=>r.encounterClass==='random_alpha'&&['wz-07','wz-08'].includes(r.areaId)).length,14);
  assert.equal(selectAreaResults(after,{speciesId:'gastly',areaId:'wz-07',encounterClass:'random_alpha'}).encounters.length,0);
  const gible=selectAreaResults(after,{speciesId:'gible',areaId:'wz-08',encounterClass:'random_alpha'}).encounters;
  assert.equal(gible.length,1);assert.match(gible[0].condition.notes.join(' '),/35–36/);
  const wz9=after.encounters.filter(r=>r.areaId==='wz-09');
  assert.equal(wz9.filter(r=>r.encounterClass==='random_alpha').length,6);
  assert.match(byId.get('g3-evidence-wz-09-sableye-ordinary').condition.directions,/street level.*scaffolding/);
  assert.match(byId.get('g3-evidence-wz-09-kadabra-ordinary').condition.directions,/scaffolding.*ladder/);
  assert.match(byId.get('g3-evidence-wz-09-meowstic-form-male').condition.time,/night/i);
  assert.match(byId.get('g3-evidence-wz-09-meowstic-form-female').condition.time,/day/i);
  assert.match(byId.get('wz-09:fixed_alpha:2').condition.floor,/Upper route/);
  assert.ok(wz9.some(r=>r.speciesId==='pangoro'&&r.encounterClass==='mission'));
  assert.equal(selectAreaResults(after,{speciesId:'pangoro',areaId:'wz-09',encounterClass:'ordinary'}).encounters.length,0);
  assert.match(read('maps.html'),/One-time Mission 40 encounter:.*walkthrough.html#mission-40.*will not respawn/);
  const wz10=after.encounters.filter(r=>r.areaId==='wz-10');
  assert.equal(wz10.filter(r=>r.encounterClass==='random_alpha').length,7);
  assert.match(byId.get('g3-evidence-wz-10-tynamo-ordinary').condition.directions,/eastern\/back gate/);
  assert.equal(byId.get('g3-evidence-wz-10-tynamo-ordinary').condition.level,'31–32');
  assert.match(byId.get('g3-evidence-wz-10-arbok-ordinary').condition.floor,/Rooftop/);
  assert.match(byId.get('wz-10:fixed_alpha:2').condition.directions,/ladder beside Espace Vide/);
  assert.equal(byId.get('wz-10:fixed_alpha:2').condition.level,'50–52');
  assert.match(byId.get('wz-10:fixed_alpha:0').condition.notes.join(' '),/ordinary Lv. 30–32.*unresolved/);
  assert.equal(selectAreaResults(after,{speciesId:'sharpedo',areaId:'wz-10',encounterClass:'random_alpha'}).encounters.length,0);
  const tynamo=selectAreaResults(after,{speciesId:'tynamo',areaId:'wz-10',encounterClass:'random_alpha'}).encounters;
  assert.equal(tynamo.length,1);assert.match(tynamo[0].condition.notes.join(' '),/42–43/);
  for(const entry of conditionEvidence.records.filter(r=>/^wz-(?:0[789]|10)$/.test(r.areaId)))assert.match(entry.condition.unlock,/before Vinnie's Rank F promotion/);
  for(const row of alphaEvidence.areas.filter(r=>/^wz-(?:0[789]|10)$/.test(r.area_id)).flatMap(r=>r.encounters))assert.match(row.condition.unlock,/before Vinnie's Rank F promotion/);
  const bad=clone(conditionEvidence);bad.records=[{...bad.records[0],species:'Other species'},{...bad.records[1],condition:{coordinates:[1,2]}}];
  const rejected=buildAreaModel({...input,conditionEvidence:bad});assert.deepEqual(rejected.encounters,before.encounters);assert.equal(rejected.issues.length,2);
  const mismatch=buildAreaModel({...input,conditionEvidence:{...conditionEvidence,mapSha256:'wrong'}});assert.deepEqual(mismatch,before);
});
