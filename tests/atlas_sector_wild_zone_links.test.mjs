import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {wildZoneRecords} from '../wild-zone-fieldbook.mjs';
import {buildAreaModel,selectAreaResults} from '../atlas-area-model.mjs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const json=p=>JSON.parse(read(p));
const folder='docs/qa/sector-wild-zone-crossrefs-2026-11-26/';
const packet=json(folder+'amendments.json');
const observations=json(folder+'source-observations.json');
const evidence=json('atlas-area-evidence.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const canonical=v=>JSON.stringify(Array.isArray(v)?v.map(x=>JSON.parse(canonical(x))):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(canonical(v[k]))])):v);
const targets=[['bleu-sector-2','wz-05'],['bleu-sector-10','wz-10'],['magenta-sector-5','wz-09']];

test('three sector cross-references preserve every existing encounter and the exact before/after metadata receipt',()=>{
  assert.deepEqual(packet.patches.map(p=>[p.area_id,p.after.related_areas[0].area_id]),targets);
  assert.equal(hash(read(folder+'source-observations.json')),packet.source_observations_sha256);
  for(const patch of packet.patches){
    const current=evidence.areas.find(a=>a.area_id===patch.area_id);
    assert.deepEqual(current,patch.after);
    assert.deepEqual(patch.after.encounters,patch.before.encounters);
    assert.equal(patch.after.roster_status,patch.before.roster_status);
    assert.deepEqual(patch.after.notes.slice(0,-1),patch.before.notes);
    const {notes:oldNotes,...oldRest}=patch.before;
    const {notes:newNotes,related_areas,...newRest}=patch.after;
    assert.deepEqual(newRest,oldRest);
    assert.equal(related_areas.length,1);
    assert.equal(related_areas[0].relationship,'overlapping_wild_zone');
    assert.deepEqual(Object.keys(related_areas[0]).sort(),['area_id','note','relationship']);
    assert.ok(evidence.areas.some(a=>a.area_id===related_areas[0].area_id));
  }
  assert.equal(packet.encounter_count_before,748);
  assert.equal(packet.encounter_count_after,748);
  assert.equal(hash(canonical(evidence.areas.map(a=>({area_id:a.area_id,encounters:a.encounters})))),packet.original_encounters_canonical_sha256);
});

test('original sector guide cards retain exact Wild Zone links and reviewed outline summary amendments',()=>{
  const html=read('sector-maps.html');
  // Later verified outlines amend only these summaries; preserve the frozen link-only receipt.
  const summaryAmendments={
    'bleu-sector-10':{
      before:'<summary>Sector map and item pins awaiting evidence</summary>',
      after:'<summary>Sector map available; item pins awaiting evidence</summary>',
      card_sha256:'3ca7165f48aa8f7d6d206e7c1a6e3373ab257b461ba3c2bb34a6b29dad5900eb'
    },
    'magenta-sector-5':{
      before:'<summary>Sector map and item pins awaiting evidence</summary>',
      after:'<summary>Sector map available; item pins awaiting evidence</summary>',
      card_sha256:'96888cc8411e796ec5d9e9f8fc175446795aba6a80fe093f2c698bbe1ee76550'
    }
  };
  assert.equal(packet.guide_cards.length,3);
  for(const card of packet.guide_cards){
    const match=html.match(new RegExp('<article\\b[^>]*\\bid="sector-'+card.area_id+'"[^>]*>.*?<\\/article>','s'));
    assert.ok(match,card.area_id);
    assert.equal(match[0].split(card.insertion).length,2);
    let preservedCard=match[0];
    const amendment=summaryAmendments[card.area_id];
    if(amendment){
      assert.equal(hash(preservedCard),amendment.card_sha256,card.area_id+' exact amended card');
      assert.equal(preservedCard.split(amendment.after).length,2,card.area_id+' exactly one amended summary');
      assert.equal(preservedCard.includes(amendment.before),false,card.area_id+' old summary is replaced');
      preservedCard=preservedCard.replace(amendment.after,amendment.before);
      assert.equal(preservedCard.split(amendment.before).length,2,card.area_id+' exactly one restored summary');
    }
    assert.equal(hash(preservedCard),card.candidate_card_sha256);
    assert.equal(hash(preservedCard.replace(card.insertion,'')),card.original_card_sha256);
    const url=new URL(card.href,'https://atlas.invalid/');
    assert.equal(url.pathname,'/sector-maps.html');
    assert.equal(url.searchParams.get('area'),card.target_area_id);
    assert.ok(html.includes('id="'+url.hash.slice(1)+'"'),'existing Wild Zone anchor');
    assert.ok(card.insertion.includes('href="'+card.href+'"'));
  }
});

test('cross-references do not invent sector habitats, copy zone rosters, or alter the fixed and rotating Alpha baseline',()=>{
  const model=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,evidence});
  assert.deepEqual(model.issues,[]);
  assert.equal(model.areas.length,68);
  assert.equal(model.encounters.length,1020);
  assert.equal(model.encounters.filter(e=>e.id.includes(':')&&e.encounterClass==='fixed_alpha').length,38);
  assert.equal(model.encounters.filter(e=>e.id.includes(':')&&e.encounterClass==='rotating_alpha').length,67);
  for(const [sector,zone] of targets){
    assert.equal(model.areas.find(a=>a.id===sector).encounters.length,sector==='bleu-sector-2'?1:0);
    assert.ok(model.areas.find(a=>a.id===zone).encounters.length>0);
  }
  const bellsprout=selectAreaResults(model,{areaId:'bleu-sector-2',speciesId:'bellsprout'});
  assert.equal(bellsprout.areas.length,0);
  assert.equal(bellsprout.relatedClaims.length,1);
  assert.equal(bellsprout.relatedClaims[0].evidenceStatus,'source_lead');
});

test('positive source joins remain bounded to the independently checked binary fields',()=>{
  const comparison=observations.independent_comparison;
  assert.equal(comparison.target_scene_objects,82);
  assert.equal(comparison.joined_spawner_rows,82);
  assert.equal(comparison.joined_encounter_rows,39);
  assert.deepEqual(comparison.spawner_projection_mismatches,[]);
  assert.deepEqual(comparison.encounter_projection_mismatches,[]);
  assert.deepEqual(observations.relationships.map(r=>[r.area_id,r.related_area_id]),targets);
  assert.deepEqual(observations.relationships.map(r=>r.zone_scene_origins_within_sector_xz),[9,23,23]);
  for(const pin of observations.original_binary_tables){
    assert.match(pin.git_blob_sha,/^[a-f0-9]{40}$/);
    assert.match(pin.sha256,/^[a-f0-9]{64}$/);
  }
  const example=observations.positive_alpha_class_example;
  assert.equal(example.encounter.OyabunProbability,100);
  assert.equal(example.encounter.MinLevel+example.encounter.OyabunAdditionalLevel,52);
  assert.equal(example.encounter.MaxLevel+example.encounter.OyabunAdditionalLevel,53);
  const disputed=evidence.areas.find(a=>a.area_id==='wz-16').encounters.filter(e=>e.species==='Ampharos'&&e.encounter_class==='ordinary');
  assert.equal(disputed.length,1);
  assert.equal(disputed[0].evidence_status,'disputed');
});
