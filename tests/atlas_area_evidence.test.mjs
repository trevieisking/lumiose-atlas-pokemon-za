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
const observations=json('docs/qa/at339-encounters/owner-survey-observations.json').observations;
const model=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,evidence});
const extra=model.encounters.filter(row=>row.id.startsWith('g3-evidence-'));
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
    '39524a69d40a15d503d816927155dc147c69b8baf60d71a99413eb69f77fd60f',
    'The independently reviewed source packet must not silently change with runtime data');
  assert.deepEqual(evidence.areas,reviewed.areas);
  assert.deepEqual(sorted(evidence.areas.map(row=>row.area_id)),sorted(expectedIds));
  assert.equal(new Set(evidence.areas.map(row=>row.area_id)).size,68);
  const sourceRows=evidence.areas.flatMap(row=>row.encounters);
  assert.equal(sourceRows.length,283);
  assert.equal(new Set(sourceRows.map(row=>row.id)).size,283);
  assert.deepEqual(sorted(extra.map(row=>row.id)),sorted(sourceRows.map(row=>row.id)));
  assert.equal(model.encounters.length,555);
  assert.equal(model.encounters.filter(preserved).length,272);
  assert.deepEqual(model.issues,[]);
  assert.ok(extra.every(row=>row.sources.length&&row.sources.every(source=>source.href)));
  assert.ok(model.areas.every(row=>row.rosterStatus==='not_comprehensive'));
  const sectors=model.areas.filter(row=>row.kind==='sector');
  assert.equal(sectors.length,48);
  assert.ok(sectors.every(row=>!row.geometry.eligible&&row.geometry.geometry===null));
  const encountersOnly=buildAreaModel({atlas:json('atlas-explorer-data.json'),rosters:wildZoneRecords,
    evidence:{...evidence,geometries:[]}});
  assert.equal(encountersOnly.encounters.length,555);
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

test('the seven actual disputes cannot become supported encounters through a legacy union',()=>{
  const expected=[
    ['wz-07','Gastly','ordinary'],
    ['wz-15','Banette','ordinary'],
    ['wz-15','Noibat','ordinary'],
    ['wz-15','Trevenant','ordinary'],
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
  for(const [speciesId,areaId] of [['mawile','wz-17'],['banette','wz-15']]){
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
  assert.equal(special.filter(row=>row.encounterClass==='unclassified_lead').length,66);
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
  const leads=extra.filter(row=>row.evidenceStatus==='source_lead');assert.equal(leads.length,118);
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
    assert.equal(row.geometry.eligible,false);
    const result=selectAreaResults(model,{areaId:row.id});
    assert.equal(result.areas.length,1);assert.equal(result.areas[0].id,row.id);
    assert.deepEqual(result.encounters,[]);
  }
  assert.ok(area('wz-09').encounters.length>0&&area('wz-10').encounters.length>0,
    'Nearby zone records remain separate instead of being cloned into the empty sectors');
});
