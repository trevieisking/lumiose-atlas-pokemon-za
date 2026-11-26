import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {wildZoneRecords} from '../wild-zone-fieldbook.mjs';
import {buildAreaModel,isRecordedHabitat,selectAreaResults} from '../atlas-area-model.mjs';

const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url));
const json=path=>JSON.parse(read(path));
const packetPath='docs/qa/sector-reconciliation-2026-11-26/';
const observations=json(packetPath+'observations.json');
const packet=json(packetPath+'reconciliation.json');
const liveEvidence=json('atlas-area-evidence.json');
const previous=json('docs/qa/at339-encounters/atlas-area-evidence.json');
// These are the first packet's dated totals, independent of later district work.
const evidence=structuredClone(previous);
// This encounter-only checkpoint cannot create or certify geometry.
evidence.geometries=[];
for(const update of packet.updates){
  const area=evidence.areas.find(row=>row.area_id===update.area_id);
  area.encounters[area.encounters.findIndex(row=>row.id===update.id)]=update.after;
}
for(const addition of packet.additions){
  evidence.areas.find(row=>row.area_id===addition.area_id).encounters.push(addition.row);
}
const model=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,evidence});
const oldModel=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,evidence:previous});
const rows=(area,species)=>model.encounters.filter(row=>row.areaId===area&&row.species===species);
const ordinary=(area,species)=>rows(area,species).find(row=>row.encounterClass==='ordinary');

test('the sector review covers the actual Walking tables without counting Alpha-only rows',()=>{
  for(const file of json(packetPath+'ARTIFACT_SHA256.json').files){
    const bytes=read(file.path);
    assert.equal(bytes.length,file.bytes,file.path);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256,file.path);
  }
  assert.equal(crypto.createHash('sha256').update(read(packetPath+'observations.json')).digest('hex'),packet.observations_sha256);
  assert.equal(observations.tables.length,16);
  assert.deepEqual(observations.tables.filter(t=>t.area_id.startsWith('bleu-')).map(t=>[t.area_id,t.rows.length]),[
    ['bleu-sector-1',1],['bleu-sector-3',11],['bleu-sector-4',14],['bleu-sector-5',14],
    ['bleu-sector-6',7],['bleu-sector-7',20],['bleu-sector-8',10],['bleu-sector-9',6]
  ]);
  assert.deepEqual(observations.tables.filter(t=>t.area_id.startsWith('magenta-')).map(t=>[t.area_id,t.rows.length]),[
    ['magenta-sector-1',12],['magenta-sector-2',6],['magenta-sector-3',8],['magenta-sector-4',11],
    ['magenta-sector-6',20],['magenta-sector-7',14],['magenta-sector-8',10],['magenta-sector-9',8]
  ]);
  assert.equal(packet.updates.length,14);assert.equal(packet.additions.length,163);
  assert.equal(packet.summary.walking_rows_reviewed,172);
  assert.ok(packet.coverage.every(row=>row.roster_complete===false));
  assert.deepEqual(model.issues,[]);
});

test('existing encounter identities, conditions, sources and all other areas are retained',()=>{
  const changedAreas=new Set(packet.coverage.map(row=>row.area_id));
  for(const area of evidence.areas.filter(row=>row.area_id.startsWith('bleu-')||row.area_id.startsWith('magenta-'))){
    const current=structuredClone(area);
    for(const patch of json('docs/qa/encounter-review-2026-11-26/amendments.json').patches.filter(row=>row.area_id===area.area_id)){
      assert.equal(patch.operation,'patch');
      Object.assign(current.encounters.find(row=>row.id===patch.encounter_id),structuredClone(patch.set));
    }
    const related=json('docs/qa/sector-wild-zone-crossrefs-2026-11-26/amendments.json').patches.find(row=>row.area_id===area.area_id);
    if(related){assert.deepEqual(current,related.before);assert.deepEqual(related.after.encounters,related.before.encounters);Object.assign(current,structuredClone(related.after));}
    assert.deepEqual(liveEvidence.areas.find(row=>row.area_id===area.area_id),current,'Later packets must retain the reviewed sector rows and separately recorded amendments in '+area.area_id);
  }
  for(const area of previous.areas){
    const current=evidence.areas.find(row=>row.area_id===area.area_id);
    assert.equal(current.roster_status,'not_comprehensive');
    assert.deepEqual(current.notes,area.notes);
    if(!changedAreas.has(area.area_id))assert.deepEqual(current,area,area.area_id);
    for(const old of area.encounters){
      const now=current.encounters.find(row=>row.id===old.id);
      assert.ok(now,old.id);
      for(const key of ['species','encounter_class','form'])assert.equal(now[key],old[key],old.id+' '+key);
      for(const key of ['time','weather','floor','unlock'])if(old.condition[key]!==null)assert.equal(now.condition[key],old.condition[key]);
      assert.ok(old.sources.every(source=>now.sources.some(candidate=>JSON.stringify(candidate)===JSON.stringify(source))),old.id+' sources');
      assert.ok(old.notes.every(note=>now.notes.includes(note)),old.id+' notes');
      assert.ok(old.condition.notes.every(note=>now.condition.notes.includes(note)),old.id+' condition notes');
    }
  }
  assert.equal(model.encounters.length-oldModel.encounters.length,163);
  assert.ok(model.areas.filter(area=>area.kind==='sector').every(area=>!area.geometry.eligible));
  for(const id of ['bleu-sector-2','bleu-sector-10','magenta-sector-5']){
    assert.deepEqual(evidence.areas.find(a=>a.area_id===id),previous.areas.find(a=>a.area_id===id),id+' remains unknown/partial');
  }
});

test('corroborated encounters become usable habitats with material conditions still qualified',()=>{
  const scraggy=ordinary('bleu-sector-8','Scraggy');
  assert.equal(scraggy.evidenceStatus,'source_corroborated');
  assert.equal(scraggy.condition.time,'night (source-reported)');
  assert.equal(scraggy.condition.floor,'roof (source-reported)');
  assert.match(scraggy.condition.notes.join(' '),/21–24/);
  assert.match(scraggy.condition.notes.join(' '),/20–23/);
  assert.match(scraggy.condition.notes.join(' '),/no exact level is certified/);
  assert.ok(selectAreaResults(model,{speciesId:'scraggy',encounterClass:'ordinary'}).areas.some(a=>a.id==='bleu-sector-8'));
  assert.equal(ordinary('bleu-sector-9','Goomy').condition.weather,'rain (source-reported)');
  assert.equal(ordinary('magenta-sector-1','Cleffa').condition.floor,'roof (source-reported)');
  assert.ok(selectAreaResults(model,{speciesId:'cleffa',encounterClass:'ordinary'}).areas.some(a=>a.id==='magenta-sector-1'));
  assert.equal(ordinary('magenta-sector-8','Dratini').evidenceStatus,'source_corroborated');
  for(const [aid,species] of [['bleu-sector-4','Absol'],['bleu-sector-7','Ralts'],['magenta-sector-7','Absol']]){
    assert.ok(rows(aid,species).some(row=>row.encounterClass==='unclassified_lead'),'Preserve the old source-specific unresolved claim');
    assert.ok(isRecordedHabitat(ordinary(aid,species)),'Add separately supported ordinary membership');
  }
});

test('single-source reports and unresolved Alpha classes remain discoverable without habitat promotion',()=>{
  const talonflame=ordinary('magenta-sector-1','Talonflame');
  assert.equal(talonflame.evidenceStatus,'source_lead');
  assert.equal(isRecordedHabitat(talonflame),false);
  const results=selectAreaResults(model,{speciesId:'talonflame'});
  assert.ok(results.relatedClaims.some(row=>row.id===talonflame.id));
  assert.ok(!results.areas.some(area=>area.id==='magenta-sector-1'||area.id==='wz-17'));
  for(const [aid,species] of [['bleu-sector-6','Pansage'],['bleu-sector-6','Pansear'],['bleu-sector-6','Panpour'],['magenta-sector-9','Kakuna']]){
    assert.equal(ordinary(aid,species),undefined,'An Alpha subheading is not an ordinary Walking record');
    const alpha=rows(aid,species).find(row=>row.id.startsWith('g3-sector-20261126-'));
    assert.equal(alpha.encounterClass,'unclassified_lead');
    assert.equal(alpha.evidenceStatus,'source_corroborated');
    assert.equal(isRecordedHabitat(alpha),false);
    assert.match(alpha.notes.join(' '),/Fixed versus random/);
  }
  const riolu=rows('magenta-sector-4','Riolu')[0];
  assert.equal(riolu.evidenceStatus,'source_lead');assert.equal(riolu.encounterClass,'unclassified_lead');
  assert.equal(isRecordedHabitat(riolu),false);
});

test('form claims stay distinct and special-acquisition headings cannot become ordinary encounters',()=>{
  const flowers=rows('magenta-sector-1','Flabébé');
  assert.deepEqual(flowers.map(r=>r.form).sort(),['Red Flower','Yellow Flower']);
  assert.equal(new Set(flowers.map(r=>r.id)).size,2);
  assert.ok(flowers.every(row=>row.evidenceStatus==='source_lead'));
  for(const species of ['Scatterbug','Spewpa']){
    const row=ordinary('bleu-sector-7',species);assert.equal(row.form,null);
    assert.match(row.notes.join(' '),/no distinct visible species form/);
  }
  assert.equal(ordinary('magenta-sector-6','Vivillon').form,'Meadow Pattern');
  assert.equal(ordinary('magenta-sector-2','Fennekin'),undefined);
  assert.equal(ordinary('magenta-sector-6','Mawile'),undefined);
  assert.equal(ordinary('magenta-sector-8','Diancie'),undefined);
  assert.equal(ordinary('magenta-sector-8','Carbink'),undefined);
  assert.equal(rows('magenta-sector-2','Fennekin')[0].encounterClass,'gift');
  assert.equal(rows('magenta-sector-6','Mawile')[0].encounterClass,'scripted_boss');
});
