import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {wildZoneRecords} from '../wild-zone-fieldbook.mjs';
import {buildAreaModel,isRecordedHabitat,selectAreaResults,readAreaSelection,speciesKey} from '../atlas-area-model.mjs';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const json=path=>JSON.parse(read(path));
const evidence=json('atlas-area-evidence.json');
const reviewed=json('docs/qa/at339-encounters/atlas-area-evidence.json');
const amendmentPath='docs/qa/encounter-review-2026-11-26/amendments.json';
const amendments=json(amendmentPath);
const wz09=json('docs/qa/encounter-review-2026-11-26/wz09-meowstic-followup.json');
const originalReviewed=json(amendments.original_packet);
const sectorReview=json('docs/qa/sector-reconciliation-2026-11-26/reconciliation.json');
const sectorContinuation=json('docs/qa/sector-continuation-2026-11-26/reconciliation.json');
const sectorCrossrefs=json('docs/qa/sector-wild-zone-crossrefs-2026-11-26/amendments.json');
const amendmentCheckpoint=structuredClone(reviewed.areas);
for(const patch of amendments.patches){
  const target=amendmentCheckpoint.find(row=>row.area_id===patch.area_id);
  if(patch.operation==='patch')Object.assign(target.encounters.find(row=>row.id===patch.encounter_id),structuredClone(patch.set));
  else target.encounters.push(structuredClone(patch.row));
}
const observations=json('docs/qa/at339-encounters/owner-survey-observations.json').observations;
const model=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,evidence});
const extra=model.encounters.filter(row=>row.id.startsWith('g3-evidence-')||row.id.startsWith('g3-sector-20261126-'));
const area=id=>model.areas.find(row=>row.id===id);
const preserved=row=>row.evidenceStatus==='baseline_preserved'||row.originalEvidenceStatus==='baseline_preserved';
const hash=(algorithm,bytes)=>crypto.createHash(algorithm).update(bytes).digest('hex');
const sorted=values=>[...values].sort();
const expectedIds=[
  ...Object.entries({vert:9,bleu:10,magenta:9,rouge:8,jaune:12}).flatMap(([district,count])=>
    Array.from({length:count},(_,index)=>district+'-sector-'+(index+1))),
  ...Array.from({length:20},(_,index)=>'wz-'+String(index+1).padStart(2,'0'))
];

test('the integrated register retains every reviewed area and additive claim without claiming completion',()=>{
  assert.equal(hash('sha256',Buffer.from(read('docs/qa/at339-encounters/atlas-area-evidence.json'))),
    'aa80ebb05cdee248f58086245c45c58b77b5f9ad54e1b40665798ebfd655a8ed',
    'The current reviewed packet, including concurrent Helioptile guidance, must remain intact');
  assert.equal(hash('sha256',Buffer.from(read(amendments.original_packet))),
    '39524a69d40a15d503d816927155dc147c69b8baf60d71a99413eb69f77fd60f',
    'The original e003 packet is archived byte-for-byte rather than replacing the current packet');
  assert.equal(hash('sha256',Buffer.from(read(amendmentPath))),
    'd353470f891507099acd84f9fcf78d57aafacfcc1b84d536186902f2f5263f49',
    'Runtime amendments must match the separately reviewed source receipt');
  for(const packet of [reviewed,originalReviewed]){
    const expected=structuredClone(packet.areas),patchedIds=new Set();
    for(const patch of amendments.patches){
      assert.ok(!patchedIds.has(patch.encounter_id));patchedIds.add(patch.encounter_id);
      const target=expected.find(row=>row.area_id===patch.area_id);assert.ok(target);
      const existing=target.encounters.find(row=>row.id===patch.encounter_id);
      if(patch.operation==='patch'){
        assert.ok(existing,'An amendment cannot silently create a new identity');
        assert.ok(Object.keys(patch.set).every(key=>['condition','sources','notes','evidence_status'].includes(key)),
          'Existing species, forms, classes and IDs remain immutable');
        Object.assign(existing,structuredClone(patch.set));
      }else{
        assert.equal(patch.operation,'add');assert.equal(existing,undefined);
        assert.equal(patch.area_id,'wz-16');
        assert.equal(patch.encounter_id,'g3-evidence-wz-16-ampharos-ordinary-disputed');
        assert.equal(patch.row.id,patch.encounter_id);
        target.encounters.push(structuredClone(patch.row));
      }
    }
    assert.deepEqual(expected,amendmentCheckpoint,'Both historical and current baselines reconstruct the immutable concurrent amendment checkpoint');
    for(const review of [sectorReview,sectorContinuation]){
      for(const update of review.updates){
        const rows=expected.find(area=>area.area_id===update.area_id).encounters;
        const index=rows.findIndex(row=>row.id===update.id);
        assert.notEqual(index,-1,'A reconciliation must retain the original stable ID');
        assert.equal(hash('sha256',Buffer.from(JSON.stringify(rows[index],null,2)+'\n')),update.before_sha256);
        rows[index]=structuredClone(update.after);
      }
      for(const addition of review.additions){
        expected.find(area=>area.area_id===addition.area_id).encounters.push(structuredClone(addition.row));
      }
    }
    for(const patch of sectorCrossrefs.patches){
      const index=expected.findIndex(row=>row.area_id===patch.area_id);
      assert.deepEqual(expected[index],patch.before,'The scoped cross-reference applies only to its reviewed area metadata');
      assert.deepEqual(patch.after.encounters,patch.before.encounters,'Cross-reference metadata cannot change encounter membership');
      expected[index]=structuredClone(patch.after);
    }
    for(const patch of wz09.patches){
      const row=expected.find(area=>area.area_id===wz09.area_id).encounters.find(row=>row.id===patch.id);
      assert.equal(row.evidence_status,'source_lead');
      assert.deepEqual(Object.keys(patch.set).sort(),['condition','evidence_status','notes','sources']);
      Object.assign(row,structuredClone(patch.set));
    }
    assert.deepEqual(evidence.areas,expected,'All independently reviewed encounter and metadata packets reconstruct the merged runtime');
  }
  assert.equal(amendments.patches.filter(row=>row.operation==='patch').length,49);
  assert.equal(amendments.patches.filter(row=>row.operation==='add').length,1);
  assert.deepEqual(sorted(evidence.areas.map(row=>row.area_id)),sorted(expectedIds));
  assert.equal(new Set(evidence.areas.map(row=>row.area_id)).size,68);
  const sourceRows=evidence.areas.flatMap(row=>row.encounters);
  assert.equal(sourceRows.length,748);
  assert.equal(new Set(sourceRows.map(row=>row.id)).size,748);
  assert.ok(reviewed.areas.flatMap(row=>row.encounters).every(old=>sourceRows.some(row=>row.id===old.id)),
    'All 283 original claims survive the bounded review');
  assert.deepEqual(sorted(extra.map(row=>row.id)),sorted(sourceRows.map(row=>row.id)));
  assert.equal(model.encounters.length,1020);
  assert.equal(model.encounters.filter(preserved).length,272);
  assert.deepEqual(model.issues,[]);
  assert.ok(extra.every(row=>row.sources.length&&row.sources.every(source=>source.href)));
  assert.ok(model.areas.every(row=>row.rosterStatus==='not_comprehensive'));
  const sectors=model.areas.filter(row=>row.kind==='sector');
  assert.equal(sectors.length,48);
  assert.ok(sectors.every(row=>row.geometry.eligible&&row.geometry.representation==='source_area_footprint'));
  const encountersOnly=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,
    evidence:{...evidence,geometries:[]}});
  assert.equal(encountersOnly.encounters.length,1020);
  assert.ok(encountersOnly.areas.every(row=>!row.geometry.eligible&&row.geometry.geometry===null),
    'An encounter claim or owner survey icon cannot supply missing boundary evidence');
});

test('all twenty owner-photo receipts match original bytes and only their 140 observed species claims',()=>{
  assert.equal(observations.length,20);
  assert.deepEqual(sorted(observations.map(row=>row.area_id)),sorted(expectedIds.filter(id=>id.startsWith('wz-'))));
  assert.equal(new Set(observations.map(row=>row.path)).size,20);
  assert.equal(observations.reduce((count,row)=>count+row.visible_species_count,0),140);
  const photoClaims=extra.filter(row=>row.evidenceStatus==='owner_survey_correlated');
  assert.equal(photoClaims.length,140);
  for(const observation of observations){
    const number=observation.area_id.slice(3);
    assert.equal(observation.path,`assets/atlas/wild-zones/wild-zone-${number}-overview.png`);
    const bytes=fs.readFileSync(new URL('../'+observation.path,import.meta.url));
    assert.equal(hash('sha256',bytes),observation.sha256,observation.path);
    assert.equal(hash('sha1',Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])),observation.git_blob_sha1,observation.path);
    assert.equal(observation.visible_species_icons.length,observation.visible_species_count);
    assert.equal(new Set(observation.visible_species_icons).size,observation.visible_species_count);
    const claims=photoClaims.filter(row=>row.areaId===observation.area_id);
    assert.deepEqual(sorted(claims.map(row=>row.species)),sorted(observation.visible_species_icons),observation.area_id);
    for(const row of claims){
      assert.equal(row.encounterClass,'ordinary');
      assert.ok(row.sources.some(source=>source.href===observation.path));
      assert.ok(row.sources.some(source=>source.href.startsWith('https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_')),
        'The photo supplies species identity while a written table supplies the ordinary class');
    }
  }
  assert.ok(observations.find(row=>row.area_id==='wz-11').visible_species_icons.includes('Clauncher'));
  assert.ok(!observations.find(row=>row.area_id==='wz-11').visible_species_icons.includes('Carvanha'));
  assert.equal(observations.find(row=>row.area_id==='wz-18').git_blob_sha1,'b520201cb772c4d716036fb8066f35fd3d82cf5b');
});

test('Wild Zone 14 retains concurrent Helioptile source guidance separately from photo membership and fixed Alpha',()=>{
  const result=selectAreaResults(model,readAreaSelection('atlas-explorer.html?area=wz-14&species=helioptile&encounter=ordinary'));
  const row=result.encounters.find(row=>row.id==='g3-evidence-wz-14-helioptile-ordinary');
  assert.ok(row);assert.equal(row.evidenceStatus,'owner_survey_correlated');
  assert.equal(row.condition.time,'daytime (source-corroborated)');
  assert.equal(row.condition.weather,'clear skies (source-corroborated)');
  assert.equal(row.condition.floor,null);assert.equal(row.condition.unlock,null);
  assert.match(row.condition.notes.join(' '),/37–38.*not verified/);
  assert.match(row.condition.notes.join(' '),/not its spawn schedule/);
  const current=reviewed.areas.find(area=>area.area_id==='wz-14').encounters.find(row=>row.id==='g3-evidence-wz-14-helioptile-ordinary');
  for(const source of current.sources){
    assert.ok(row.sources.some(retained=>retained.href===(source.url||source.path)&&retained.claim===source.claim),
      'Every current source citation and claim survives the reconciliation');
  }
  for(const other of area('wz-14').encounters.filter(row=>['Emolga','Onix'].includes(row.species))){
    assert.equal(other.condition.time,null);assert.equal(other.condition.weather,null);
  }
  assert.ok(area('wz-14').encounters.some(row=>row.species==='Excadrill'&&row.encounterClass==='fixed_alpha'&&preserved(row)));
});

test('the seven retained disputes and newly documented ordinary Ampharos conflict cannot authorize habitats',()=>{
  const expected=[
    ['wz-07','Gastly','ordinary'],
    ['wz-15','Banette','ordinary'],
    ['wz-15','Noibat','ordinary'],
    ['wz-15','Trevenant','ordinary'],
    ['wz-16','Ampharos','ordinary'],
    ['wz-17','Mawile','ordinary'],
    ['wz-17','Talonflame','unclassified_lead'],
    ['wz-18','Gastly','unclassified_lead']
  ];
  const disputed=extra.filter(row=>row.evidenceStatus==='disputed');
  assert.deepEqual(sorted(disputed.map(row=>[row.areaId,row.species,row.encounterClass].join('|'))),
    sorted(expected.map(row=>row.join('|'))));
  for(const row of disputed){
    assert.equal(isRecordedHabitat(row),false,row.id);
    const results=selectAreaResults(model,{speciesId:row.speciesId});
    assert.ok(!results.encounters.some(result=>result.id===row.id),row.id);
    assert.ok(results.relatedClaims.some(result=>result.id===row.id),row.id+' remains available as a source claim');
    if(row.encounterClass==='ordinary'){
      assert.ok(!selectAreaResults(model,{speciesId:row.speciesId,encounterClass:'ordinary'}).areas.some(result=>result.id===row.areaId),row.id);
    }
  }
  assert.ok(selectAreaResults(model,{speciesId:'mawile',encounterClass:'fixed_alpha'}).areas.some(row=>row.id==='wz-17'),
    'An ordinary Mawile dispute must not erase the separate fixed Alpha');
  assert.ok(selectAreaResults(model,{speciesId:'banette',encounterClass:'fixed_alpha'}).areas.some(row=>row.id==='wz-15'));
  assert.ok(selectAreaResults(model,{speciesId:'talonflame',encounterClass:'rotating_alpha'}).areas.some(row=>row.id==='wz-20'));
  for(const [speciesId,areaId] of [['gastly','wz-07'],['noibat','wz-15'],['trevenant','wz-15']]){
    for(const encounterClass of ['all','recorded','ordinary']){
      assert.ok(!selectAreaResults(model,{speciesId,encounterClass}).areas.some(row=>row.id===areaId),
        speciesId+' cannot regain '+areaId+' through the '+encounterClass+' filter');
    }
    assert.ok(selectAreaResults(model,{speciesId}).relatedClaims.some(row=>row.areaId===areaId&&row.encounterClass==='recorded'&&row.originalEvidenceStatus==='baseline_preserved'),
      'The old union row remains visible with its current dispute');
  }
  for(const [speciesId,areaId] of [['mawile','wz-17'],['banette','wz-15'],['ampharos','wz-16']]){
    const results=selectAreaResults(model,{speciesId});
    assert.ok(results.areas.some(row=>row.id===areaId),'Separate supported Alpha membership survives');
    assert.ok(results.encounters.some(row=>row.areaId===areaId&&row.encounterClass==='fixed_alpha'));
    assert.ok(!results.encounters.some(row=>row.areaId===areaId&&row.encounterClass==='recorded'));
  }
});

test('combined area and species links keep research claims within the requested area',()=>{
  const wholeSpecies=selectAreaResults(model,{speciesId:'gastly'});
  assert.ok(wholeSpecies.relatedClaims.some(row=>row.areaId==='wz-07'));
  assert.ok(wholeSpecies.relatedClaims.some(row=>row.areaId==='wz-18'));
  assert.ok(wholeSpecies.relatedClaims.some(row=>row.areaId==='vert-sector-1'));
  for(const areaId of ['wz-07','wz-18']){
    const selection=readAreaSelection('atlas-explorer.html?area='+areaId+'&species=gastly');
    assert.equal(selection.areaId,areaId);assert.equal(selection.speciesId,'gastly');
    const result=selectAreaResults(model,selection);
    assert.equal(result.relatedClaims.length,areaId==='wz-07'?2:1,'Retain the current dispute and any affected original union row');
    assert.ok(result.relatedClaims.every(row=>row.areaId===areaId&&row.evidenceStatus==='disputed'));
    assert.ok(result.encounters.every(row=>row.areaId===areaId));
    assert.ok(result.areas.every(row=>row.id===areaId));
  }
  const ordinary=selectAreaResults(model,readAreaSelection('atlas-explorer.html?area=wz-07&species=gastly&encounter=ordinary'));
  assert.deepEqual(ordinary.areas,[],'The disputed ordinary claim must not become a supported ordinary habitat');
  assert.equal(ordinary.relatedClaims.length,1);
  assert.equal(ordinary.relatedClaims[0].areaId,'wz-07');
  assert.equal(ordinary.relatedClaims[0].encounterClass,'ordinary');
});

test('actual mission, gift, boss and unresolved Alpha claims stay separate from repeatable habitats',()=>{
  const special=extra.filter(row=>['mission','gift','scripted_boss','unclassified_lead'].includes(row.encounterClass));
  assert.equal(special.filter(row=>row.encounterClass==='mission').length,12);
  assert.equal(special.filter(row=>row.encounterClass==='gift').length,1);
  assert.equal(special.filter(row=>row.encounterClass==='scripted_boss').length,6);
  assert.equal(special.filter(row=>row.encounterClass==='unclassified_lead').length,83);
  for(const row of special){
    assert.equal(isRecordedHabitat(row),false,row.id);
    const results=selectAreaResults(model,{speciesId:row.speciesId});
    assert.ok(!results.encounters.some(result=>result.id===row.id),row.id);
    assert.ok(results.relatedClaims.some(result=>result.id===row.id),row.id+' stays discoverable');
  }
  const gift=extra.find(row=>row.encounterClass==='gift');
  assert.equal(gift.species,'Fennekin');assert.equal(gift.areaId,'magenta-sector-2');
  assert.ok(!selectAreaResults(model,{speciesId:'fennekin'}).areas.some(row=>row.id==='magenta-sector-2'));
  assert.ok(selectAreaResults(model,{speciesId:'fennekin',encounterClass:'ordinary'}).areas.some(row=>row.id==='wz-18'));
  for(const [zone,name] of [['wz-01','Mareep'],['wz-06','Annihilape']]){
    const mission=extra.find(row=>row.areaId===zone&&row.species===name&&row.encounterClass==='mission');
    assert.ok(mission);assert.equal(mission.form,null,'Shiny and Alpha are encounter variants, not species forms');
  }
  assert.ok(selectAreaResults(model,{speciesId:'mareep',encounterClass:'ordinary'}).areas.some(row=>row.id==='wz-01'));
});

test('every real source lead remains visible as research without silently authorizing a habitat',()=>{
  const leads=extra.filter(row=>row.evidenceStatus==='source_lead');assert.equal(leads.length,516);
  for(const row of leads){
    assert.equal(isRecordedHabitat(row),false,row.id);
    const result=selectAreaResults(model,{speciesId:row.speciesId});
    assert.ok(!result.encounters.some(match=>match.id===row.id),row.id);
    assert.ok(result.relatedClaims.some(match=>match.id===row.id),row.id);
  }
  const alpha=extra.find(row=>row.areaId==='vert-sector-3'&&row.species==='Patrat');
  assert.equal(alpha.evidenceStatus,'source_corroborated');
  assert.equal(alpha.encounterClass,'unclassified_lead');
  assert.equal(isRecordedHabitat(alpha),false,'Corroborating an Alpha without its type does not establish fixed or rotating habitat');
});

test('reviewed conditions retain their source scope and do not upgrade photographs into schedule proof',()=>{
  assert.equal(amendments.new_time_condition_ids.length,30);
  for(const id of amendments.new_time_condition_ids){
    const row=extra.find(row=>row.id===id);assert.ok(row,id);
    assert.equal(row.evidenceStatus,'owner_survey_correlated');
    assert.match(row.condition.time,/^(day|daytime|night) \(source-(reported|corroborated)\)$/);
    assert.match(row.condition.notes.join(' '),/not its spawn schedule/);
  }
  const find=(areaId,species)=>extra.find(row=>row.areaId===areaId&&row.species===species&&row.encounterClass==='ordinary'&&row.form===null);
  assert.equal(find('wz-02','Staryu').condition.time,'night (source-reported)');
  assert.equal(find('wz-13','Scyther').condition.time,'night (source-corroborated)');
  assert.equal(find('wz-14','Helioptile').condition.weather,'clear skies (source-corroborated)');
  assert.match(find('wz-14','Helioptile').condition.notes.join(' '),/full weather-icon rules are not verified/);
  assert.match(find('wz-17','Skarmory').condition.weather,/not rain.*other weather not exhaustively verified/);
  assert.equal(find('wz-19','Drampa').condition.time,'morning (source-corroborated)',
    'A broader day flag must not overwrite the previously established morning restriction');
  assert.match(find('wz-18','Noibat').condition.floor,/rooftop \(source-reported\)/);
  assert.match(find('wz-18','Noibat').condition.unlock,/Rank B/);
  assert.equal(find('wz-01','Pichu').condition.time,null,
    'Unamended conditions stay unknown instead of implying unrestricted availability');
});

test('five corroborated flower forms and the Fennekin gift retain separate evidence and encounter meaning',()=>{
  assert.equal(amendments.promoted_form_ids.length,5);
  for(const id of amendments.promoted_form_ids){
    const row=extra.find(row=>row.id===id);assert.ok(row);
    assert.equal(row.evidenceStatus,'source_corroborated');assert.equal(row.encounterClass,'ordinary');
    assert.ok(row.form);assert.ok(row.sources.some(source=>source.href.startsWith('https://rotomlabs.net/')));
  }
  for(const form of ['Blue Flower','White Flower']){
    const row=extra.find(row=>row.areaId==='wz-03'&&row.species==='Flabébé'&&row.form===form);
    assert.equal(row.evidenceStatus,'source_lead');assert.equal(isRecordedHabitat(row),false);
    assert.match(row.notes.join(' '),/nearby does not establish inside/);
  }
  const gift=extra.find(row=>row.encounterClass==='gift');
  assert.equal(gift.evidenceStatus,'source_corroborated');
  assert.match(gift.condition.unlock,/Begin Main Mission 6.*Side Mission 008/);
  assert.match(gift.condition.notes.join(' '),/Branche.*level 14/);
  assert.equal(isRecordedHabitat(gift),false);
  assert.equal(extra.filter(row=>row.evidenceStatus==='source_corroborated').length,84);
});

test('all 68 area review receipts distinguish performed source checks from comprehensive signoff',()=>{
  const review=json('docs/qa/encounter-review-2026-11-26/area-review.json');
  const sources=json('docs/qa/encounter-review-2026-11-26/source-review.json');
  assert.equal(review.areas.length,68);assert.equal(sources.records.length,20);
  assert.deepEqual(sorted(review.areas.map(row=>row.area_id)),sorted(expectedIds));
  assert.deepEqual(sorted(sources.records.map(row=>row.area_id)),sorted(expectedIds.filter(id=>id.startsWith('wz-'))));
  const counts=(rows,key)=>rows.reduce((result,row)=>{result[row[key]]=(result[row[key]]||0)+1;return result;},{});
  for(const receipt of review.areas){
    const runtime=amendmentCheckpoint.find(row=>row.area_id===receipt.area_id);
    // The finite-release review is immutable; replay the two later scoped status changes backwards for that receipt.
    const reviewedRows=runtime.encounters.map(row=>wz09.patches.some(patch=>patch.id===row.id)
      ? {...row,evidence_status:'source_lead'} : row);
    assert.equal(receipt.claim_count,runtime.encounters.length);
    assert.deepEqual(receipt.evidence_status_counts,counts(reviewedRows,'evidence_status'));
    assert.deepEqual(receipt.encounter_class_counts,counts(runtime.encounters,'encounter_class'));
    for(const [key,status] of [['unresolved_source_claim_ids','source_lead'],['disputed_claim_ids','disputed']]){
      assert.deepEqual(sorted(receipt[key]),sorted(reviewedRows.filter(row=>row.evidence_status===status).map(row=>row.id)));
    }
    assert.equal(receipt.comprehensive_roster_signoff,false);
    assert.equal(receipt.review.record_coverage_review_performed,true);
    assert.ok(receipt.remaining_scope.length);
    assert.equal(receipt.review.external_source_review,receipt.area_id.startsWith('wz-')
      ?'fresh_Bulbapedia_and_Serebii_standard_tables_compared'
      :'existing_AT339_evidence_retained_not_all_sector_links_reopened_in_this_pass');
  }
  assert.equal(review.comprehensive_roster_signoffs,0);
  assert.equal(review.boundary_or_route_signoff_supplied,false);
});

test('Wild Zone 20 preserves both ordinary and rotating membership for overlapping species',()=>{
  const rows=area('wz-20').encounters;
  const ordinary=rows.filter(row=>row.encounterClass==='ordinary'&&preserved(row));
  const rotating=rows.filter(row=>row.encounterClass==='rotating_alpha'&&preserved(row));
  assert.equal(ordinary.length,15);assert.equal(rotating.length,67);
  assert.equal(new Set(ordinary.map(row=>row.species)).size,15);
  assert.equal(new Set(rotating.map(row=>row.species)).size,67);
  assert.equal(rows.filter(row=>row.encounterClass==='fixed_alpha').length,0);
  assert.deepEqual(ordinary.map(row=>row.species),wildZoneRecords.find(row=>row.number===20).species);
  assert.deepEqual(rotating.map(row=>row.species),wildZoneRecords.find(row=>row.number===20).rotatingAlphas);
  const overlap=ordinary.filter(row=>rotating.some(other=>other.speciesId===row.speciesId)).map(row=>row.species);
  assert.deepEqual(sorted(overlap),['Aggron','Dragalge','Garbodor','Gardevoir','Hippowdon','Lucario','Malamar','Roserade','Scrafty']);
  for(const name of overlap){
    for(const encounterClass of ['ordinary','rotating_alpha']){
      const result=selectAreaResults(model,{speciesId:speciesKey(name),encounterClass});
      assert.ok(result.areas.some(row=>row.id==='wz-20'),name+' '+encounterClass);
      assert.ok(result.encounters.every(row=>row.encounterClass===encounterClass));
    }
  }
});

test('same-name original fixed Alpha rows survive additive form claims without deduplication',()=>{
  assert.equal(model.encounters.filter(row=>row.encounterClass==='fixed_alpha'&&preserved(row)).length,38);
  for(const [zone,name] of [[9,'Meowstic'],[17,'Pyroar']]){
    const areaId='wz-'+String(zone).padStart(2,'0');
    const originals=wildZoneRecords.find(row=>row.number===zone).fixedAlphas
      .map((row,index)=>({...row,index})).filter(row=>row.name===name);
    assert.equal(originals.length,2);
    const rows=area(areaId).encounters.filter(row=>row.encounterClass==='fixed_alpha'&&row.species===name&&preserved(row));
    assert.equal(rows.length,2);assert.equal(new Set(rows.map(row=>row.id)).size,2);
    assert.deepEqual(rows.map(row=>row.id),originals.map(row=>areaId+':fixed_alpha:'+row.index));
    assert.deepEqual(rows.map(row=>row.condition.notes),originals.map(row=>[row.condition]));
    assert.ok(rows.every(row=>row.form===null),'Uncertain forms must not overwrite the original records');
  }
});

test('the two sectors without sourced encounters retain explicit unknown coverage and area identity',()=>{
  const empty=model.areas.filter(row=>row.kind==='sector'&&row.encounters.length===0);
  assert.deepEqual(sorted(empty.map(row=>row.id)),['bleu-sector-10','magenta-sector-5']);
  for(const row of empty){
    assert.equal(row.rosterStatus,'not_comprehensive');
    assert.match(row.notes.join(' '),/empty list means missing evidence, not no Pokémon/);
    assert.equal(row.geometry.eligible,true);
    assert.equal(row.geometry.representation,'source_area_footprint','Separate source geometry does not supply an encounter roster');
    const result=selectAreaResults(model,{areaId:row.id});
    assert.equal(result.areas.length,1);assert.equal(result.areas[0].id,row.id);
    assert.deepEqual(result.encounters,[]);
  }
  assert.ok(area('wz-09').encounters.length>0&&area('wz-10').encounters.length>0,
    'Nearby zone records remain separate instead of being cloned into the empty sectors');
});

test('Wild Zone 9 shows two sourced fixed Alpha Meowstic forms at the same rooftop, without a new pin',()=>{
  const selection=selectAreaResults(model,{areaId:'wz-09',speciesId:'meowstic',encounterClass:'fixed_alpha'});
  for(const [form,time] of [['Female','day'],['Male','night']]){
    const row=selection.encounters.find(row=>row.form===form);
    assert.equal(row?.evidenceStatus,'source_corroborated');
    assert.equal(row.condition.time,time+' (source-corroborated)');
    assert.equal(row.condition.floor,'central rooftop (source-corroborated)');
    assert.equal(row.condition.weather,null);
    assert.match(row.condition.notes.join(' '),/41–42.*ladder/);
    const original=wildZoneRecords.find(zone=>zone.number===9).fixedAlphas.find(row=>row.condition.includes(form));
    assert.equal(original.name,'Meowstic');
    assert.match(original.condition,/Central rooftop/);
  }
  assert.equal(selection.encounters.filter(preserved).length,2);
  assert.equal(area('wz-09').geometry.representation,'map_selection_outline');
});
