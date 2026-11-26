import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {wildZoneRecords} from '../wild-zone-fieldbook.mjs';
import {buildAreaModel,isRecordedHabitat,selectAreaResults} from '../atlas-area-model.mjs';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url));
const json=path=>JSON.parse(read(path));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const packetPath='docs/qa/sector-continuation-2026-11-26/';
const observations=json(packetPath+'observations.json');
const packet=json(packetPath+'reconciliation.json');
const first=json('docs/qa/sector-reconciliation-2026-11-26/reconciliation.json');
const before=json('docs/qa/at339-encounters/atlas-area-evidence.json');
for(const update of first.updates){
  const area=before.areas.find(row=>row.area_id===update.area_id);
  area.encounters[area.encounters.findIndex(row=>row.id===update.id)]=update.after;
}
for(const addition of first.additions)before.areas.find(row=>row.area_id===addition.area_id).encounters.push(addition.row);
const liveEvidence=json('atlas-area-evidence.json');
const evidence=structuredClone(before);
evidence.geometries=[];
for(const update of packet.updates){
  const area=evidence.areas.find(row=>row.area_id===update.area_id);
  area.encounters[area.encounters.findIndex(row=>row.id===update.id)]=structuredClone(update.after);
}
for(const addition of packet.additions)evidence.areas.find(row=>row.area_id===addition.area_id).encounters.push(structuredClone(addition.row));
const model=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,evidence});
const rows=(area,species)=>model.encounters.filter(row=>row.areaId===area&&row.species===species);
const ordinary=(area,species)=>rows(area,species).find(row=>row.encounterClass==='ordinary');

test('the continuation checks every remaining numbered source section and preserves the first checkpoint',()=>{
  for(const file of json(packetPath+'ARTIFACT_SHA256.json').files){
    const bytes=read(file.path);
    assert.equal(bytes.length,file.bytes,file.path);assert.equal(sha(bytes),file.sha256,file.path);
  }
  assert.equal(sha(read(packetPath+'observations.json')),packet.observations_sha256);
  assert.equal(sha(read('docs/qa/sector-reconciliation-2026-11-26/observations.json')),'ae7915ded7699ef0f90fe41a0a1856d38a10cab2899a3f93cd7b7238c7f2505f');
  assert.equal(sha(read('docs/qa/sector-reconciliation-2026-11-26/reconciliation.json')),'c839377498831ae96c7ba3230d3379eda17e0a90712416dd62ea1afa00b7f7b9');
  assert.equal(first.summary.source_rows_after,446);
  assert.deepEqual(observations.tables.filter(t=>t.area_id.startsWith('vert-')).map(t=>t.rows.length),[11,6,10,12,12,13,7,23,20]);
  assert.deepEqual(observations.tables.filter(t=>t.area_id.startsWith('rouge-')).map(t=>t.rows.length),[12,8,15,5,8,14,7,21]);
  assert.deepEqual(observations.tables.filter(t=>t.area_id.startsWith('jaune-')).map(t=>t.rows.length),[2,17,7,10,14,8,10,6,13,3,12,6]);
  assert.equal(observations.tables.length,29);
  assert.equal(packet.summary.walking_rows_reviewed,312);
  assert.equal(packet.updates.length,24);assert.equal(packet.additions.length,301);
  assert.equal(packet.summary.new_supported_ordinary_memberships,22);
  const index=observations.combined_numbered_sector_source_index;
  assert.equal(index.length,48);assert.equal(new Set(index.map(r=>r.area_id)).size,48);
  assert.equal(index.reduce((n,r)=>n+(r.walking_rows||0),0),484);
  assert.deepEqual(index.filter(r=>!r.numbered_walking_table_present).map(r=>r.area_id),['bleu-sector-2','bleu-sector-10','magenta-sector-5']);
  assert.ok(packet.coverage.every(row=>row.roster_complete===false));
  assert.deepEqual(model.issues,[]);
});

test('all original identities and conditions survive and unrelated district and Wild Zone rows are exact',()=>{
  const targeted=new Set(packet.coverage.map(row=>row.area_id));
  for(const area of evidence.areas.filter(row=>targeted.has(row.area_id))){
    assert.deepEqual(liveEvidence.areas.find(row=>row.area_id===area.area_id),area,'All continuation rows survive in the combined runtime');
  }
  for(const area of before.areas){
    const now=evidence.areas.find(row=>row.area_id===area.area_id);
    assert.equal(now.roster_status,'not_comprehensive');assert.deepEqual(now.notes,area.notes);
    if(!targeted.has(area.area_id))assert.deepEqual(now,area,area.area_id);
    for(const old of area.encounters){
      const current=now.encounters.find(row=>row.id===old.id);assert.ok(current,old.id);
      for(const field of ['species','encounter_class','form'])assert.equal(current[field],old[field],old.id+' '+field);
      for(const field of ['time','weather','floor','unlock'])if(old.condition[field]!==null)assert.equal(current.condition[field],old.condition[field],old.id+' '+field);
      assert.ok(old.sources.every(source=>current.sources.some(candidate=>JSON.stringify(candidate)===JSON.stringify(source))),old.id+' sources');
      assert.ok(old.notes.every(note=>current.notes.includes(note)),old.id+' notes');
      assert.ok(old.condition.notes.every(note=>current.condition.notes.includes(note)),old.id+' condition notes');
    }
  }
  assert.equal(evidence.areas.flatMap(a=>a.encounters).length-before.areas.flatMap(a=>a.encounters).length,301);
  assert.equal(model.encounters.length,1019);
  assert.ok(model.areas.every(area=>area.rosterStatus==='not_comprehensive'));
  assert.ok(model.areas.filter(area=>area.kind==='sector').every(area=>!area.geometry.eligible));
});

test('corroborated memberships become usable while source conditions and conflicting levels stay qualified',()=>{
  for(const [area,species] of [['vert-sector-2','Larvitar'],['vert-sector-4','Ralts'],['rouge-sector-2','Ralts'],['rouge-sector-3','Scraggy'],['jaune-sector-6','Larvitar']]){
    const row=ordinary(area,species);assert.equal(row.evidenceStatus,'source_corroborated');
    assert.ok(isRecordedHabitat(row));
    assert.ok(selectAreaResults(model,{speciesId:row.speciesId,encounterClass:'ordinary'}).areas.some(a=>a.id===area));
  }
  assert.equal(ordinary('rouge-sector-3','Scraggy').condition.time,'night (source-reported)');
  assert.equal(ordinary('vert-sector-4','Goomy').condition.weather,'rain (source-reported)');
  const dratini=ordinary('jaune-sector-5','Dratini');
  assert.equal(dratini.id,'g3-evidence-jaune-sector-5-dratini-targeted-sector-membership');
  assert.equal(dratini.condition.weather,'sunny (source-reported)');
  assert.equal(dratini.condition.floor,'roof (source-corroborated)');
  const fletchling=ordinary('vert-sector-6','Fletchling');
  assert.equal(fletchling.evidenceStatus,'source_corroborated');
  assert.match(fletchling.condition.notes.join(' '),/5–8/);
  assert.match(fletchling.condition.notes.join(' '),/reports 28/);
  assert.match(fletchling.condition.notes.join(' '),/no exact level is certified/);
});

test('ordinary forms and unresolved Alpha forms do not certify one another',()=>{
  const flabebe=rows('jaune-sector-2','Flabébé');
  assert.deepEqual(flabebe.filter(r=>r.encounterClass==='ordinary').map(r=>r.form).sort(),['Blue Flower','Orange Flower','White Flower']);
  const alpha=flabebe.filter(r=>r.encounterClass==='unclassified_lead');
  assert.deepEqual(alpha.map(r=>r.form).sort(),['Red Flower','White Flower']);
  assert.ok(alpha.every(r=>r.evidenceStatus==='source_corroborated'&&!isRecordedHabitat(r)));
  assert.ok(flabebe.filter(r=>r.encounterClass==='ordinary').every(r=>r.evidenceStatus==='source_lead'));
  const otherFlowers=rows('jaune-sector-3','Flabébé');
  assert.deepEqual(otherFlowers.map(r=>r.form).sort(),['Blue Flower','Orange Flower','Yellow Flower']);
  assert.ok(otherFlowers.every(r=>r.encounterClass==='unclassified_lead'&&!isRecordedHabitat(r)));
  assert.equal(ordinary('jaune-sector-4','Pidgeot'),undefined,'The source has only a separate Alpha Pidgeot row here');
  const garbodor=rows('jaune-sector-5','Garbodor')[0];
  assert.equal(garbodor.id,'g3-evidence-jaune-sector-5-garbodor-alpha-class-unresolved');
  assert.equal(garbodor.evidenceStatus,'source_corroborated');
  assert.equal(garbodor.encounterClass,'unclassified_lead');assert.equal(isRecordedHabitat(garbodor),false);
  assert.equal(ordinary('jaune-sector-12','Vivillon').form,'Meadow Pattern');
  assert.equal(ordinary('vert-sector-9','Spewpa').form,null);
});

test('single-source and mismatched species reports remain visible research without habitat promotion',()=>{
  const pidgey=ordinary('jaune-sector-1','Pidgey');
  assert.equal(pidgey.evidenceStatus,'source_lead');assert.equal(isRecordedHabitat(pidgey),false);
  const restricted=ordinary('vert-sector-4','Pidgey');
  assert.match(restricted.notes.join(' '),/shiny-locked/);
  assert.equal(isRecordedHabitat(restricted),false);
  const discrepancy=rows('rouge-sector-4','Pidgey')[0];
  assert.equal(discrepancy.encounterClass,'unclassified_lead');assert.equal(discrepancy.evidenceStatus,'source_lead');
  assert.match(discrepancy.notes.join(' '),/Pidgeot/);assert.equal(isRecordedHabitat(discrepancy),false);
  const results=selectAreaResults(model,{speciesId:'pidgey',areaId:'rouge-sector-4'});
  assert.ok(results.relatedClaims.some(row=>row.id===discrepancy.id));
  assert.ok(!results.encounters.some(row=>row.id===discrepancy.id));
  assert.equal(ordinary('rouge-sector-4','Pidgeot').evidenceStatus,'source_lead');
});

test('static and generic lists are not converted to ordinary sector encounters or complete coverage',()=>{
  for(const [area,species] of [['rouge-sector-2','Yveltal'],['rouge-sector-8','Bunnelby'],['vert-sector-8','Garbodor'],['jaune-sector-7','Emolga']]){
    const raw=observations.source_special_heading_inventory.find(r=>r.area_id===area&&r.species===species&&r.heading==='Static Encounter');
    assert.ok(raw,area+' '+species);
    // Rouge 8 also has a separate genuine Walking Bunnelby row. Its special row
    // must not supply shiny-lock, sex, nature or level 10 to that ordinary claim.
    if(species==='Bunnelby'){
      const row=ordinary(area,species);assert.equal(row.evidenceStatus,'source_lead');
      assert.match(row.condition.notes.join(' '),/12–14/);assert.doesNotMatch(row.notes.join(' '),/shiny.lock|mild|Male only/);
    }else assert.equal(ordinary(area,species),undefined);
  }
  assert.equal(observations.source_special_heading_inventory.filter(r=>r.heading==='Alpha').length,58);
  assert.equal(observations.source_special_heading_inventory.filter(r=>r.heading==='Static Encounter').length,4);
  assert.ok(observations.ordinary_crosschecks.every(row=>!row.claim.includes('generic random-spawn')));
  assert.equal(packet.summary.comprehensive_rosters_added,0);assert.equal(packet.summary.geometry_records_changed,0);
  for(const id of ['bleu-sector-2','bleu-sector-10','magenta-sector-5']){
    assert.deepEqual(evidence.areas.find(a=>a.area_id===id),before.areas.find(a=>a.area_id===id));
  }
});
