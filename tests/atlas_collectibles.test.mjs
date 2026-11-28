import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {
  COLLECTIBLE_MAP, buildCollectibleCatalog, evaluateCollectiblePlacement,
  buildCollectibleIndex, overlappingPoints, readCollected, collectibleLabel, createCollectibleMatcher
} from '../atlas-collectibles.mjs';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const context = { window: {} };
vm.runInNewContext(read('items-data.js'), context);
const original = JSON.parse(JSON.stringify(context.window.ATLAS_ITEM_EVIDENCE));
const production = JSON.parse(read('atlas-collectibles-data.json'));
const catalog = buildCollectibleCatalog(original);
const item = catalog.find(record => record.id === 'item:1-3');
const screw = catalog.find(record => record.id === 'screw:1');
const clone = value => JSON.parse(JSON.stringify(value));
function freezeTree(value) {
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) freezeTree(nested);
    Object.freeze(value);
  }
  return value;
}

// Synthetic proof is created only inside this test file. It is never imported by
// production and does not certify any game's real location, route or floor.
function placement(record, overrides = {}) {
  return {
    id: record.id, originalId: record.originalId, kind: record.kind,
    physicalId: 'test-' + record.id, pickupType: 'fixed',
    coordinateSpace: COLLECTIBLE_MAP.coordinateSpace,
    mapSha256: COLLECTIBLE_MAP.sha256, xy: [960, 960],
    scene: 'ground', floor: 'Synthetic ground floor',
    directions: ['Follow the synthetic test-only route.'],
    unlock: 'No prerequisite in this synthetic fixture.',
    sources: [{ reference: 'docs/qa/synthetic-test-evidence.json', observedOn: '2026-11-26', evidence: 'Isolated automated test fixture; no real gameplay claim.' }],
    photos: [], verification: { identity: true, position: true, scene: true, floor: true, route: true, source: true },
    ...overrides
  };
}
const register = placements => ({ schemaVersion: 1, map: { ...COLLECTIBLE_MAP }, placements });

test('catalog preserves all original identities, classes, clues and real checklist anchors without mutation', () => {
  const source = freezeTree(clone(original)), before = JSON.stringify(source);
  const records = buildCollectibleCatalog(source), html = read('items.html');
  assert.equal(records.length, 364);
  assert.equal(new Set(records.map(record => record.id)).size, 364);
  assert.equal(records.filter(record => record.kind === 'item').length, 264);
  assert.equal(records.filter(record => record.kind === 'screw').length, 100);
  assert.deepEqual(records.filter(record => record.kind === 'item').map(record => record.originalId), original.zones.flatMap(zone => zone.items.map(item => item.id)));
  assert.deepEqual(records.filter(record => record.kind === 'screw').map(record => record.originalId), original.screws.map(screw => String(screw.number)));
  assert.equal(records.filter(record => record.sourceKind === 'reward').length, 10);
  assert.equal(records.filter(record => record.sourceKind === 'hidden_outcome').length, 56);
  for (const record of records) {
    assert.ok(Object.isFrozen(record));
    assert.equal(typeof record.originalId, 'string');
    assert.equal(typeof record.number, 'string');
    assert.ok(!Object.hasOwn(record, 'xy'));
    assert.ok(html.includes('id="' + record.link.split('#')[1] + '"'), record.link);
  }
  assert.equal(records.find(record => record.id === 'item:1-0').number, '01-01');
  assert.equal(records.find(record => record.id === 'screw:1').link, 'items.html#item-screw-1');
  assert.equal(JSON.stringify(source), before);
  assert.ok(Object.isFrozen(records));
  assert.throws(() => { records[0].originalId = 'different'; }, TypeError);
});

test('catalog fails closed on duplicate, missing, malformed or cross-zone identities', () => {
  for (const change of [
    data => { data.zones.pop(); },
    data => { data.zones[0].items[1].id = data.zones[0].items[0].id; },
    data => { data.zones[0].items[0].id = '2-0'; },
    data => { data.zones[0].items[0].id = '__proto__'; },
    data => { data.zones[0].items[0].kind = 'transient'; },
    data => { data.screws[1].number = 1; },
    data => { data.screws[0].number = '1'; },
    data => { data.screws[0].number = 101; }
  ]) {
    const source = clone(original); change(source);
    assert.deepEqual(buildCollectibleCatalog(source), []);
  }
  for (const value of [null, undefined, [], {}, 364]) assert.deepEqual(buildCollectibleCatalog(value), []);
});

test('production register has zero approved pins and matches the unchanged original map bytes', () => {
  assert.equal(production.schemaVersion, 1);
  assert.deepEqual(production.map, COLLECTIBLE_MAP);
  assert.deepEqual(production.placements, []);
  const map = fs.readFileSync(new URL('../' + COLLECTIBLE_MAP.path, import.meta.url));
  assert.equal(crypto.createHash('sha256').update(map).digest('hex'), COLLECTIBLE_MAP.sha256);
  const index = buildCollectibleIndex(catalog, production);
  assert.equal(index.length, 364);
  assert.equal(index.filter(record => record.eligible).length, 0);
  assert.ok(index.every(record => record.xy === null && record.floor === null && record.scene === null));
  assert.ok(index.every(record => Array.isArray(record.photos) && Array.isArray(record.sources) && Array.isArray(record.directions)));
});

test('a complete synthetic fixed placement passes without mutating evidence or trusting source pins', () => {
  const proof = freezeTree(placement(item)), before = JSON.stringify(proof);
  const result = evaluateCollectiblePlacement(item, proof, register([proof]));
  assert.equal(result.eligible, true);
  assert.equal(result.reason, 'verified_fixed_pickup');
  assert.deepEqual(result.xy, [960, 960]);
  assert.ok(Object.isFrozen(result.xy));
  assert.notEqual(result.xy, proof.xy);
  assert.ok(Object.isFrozen(result.sources[0]));
  assert.equal(JSON.stringify(proof), before);
  assert.equal(evaluateCollectiblePlacement(screw, placement(screw)).eligible, true);
});

test('placement cannot override reward/random/transient classes or original identity', () => {
  for (const sourceKind of ['reward', 'hidden_outcome', 'transient', 'dynamic', 'unknown', 'screw_clue']) {
    const record = { ...item, sourceKind };
    assert.equal(evaluateCollectiblePlacement(record, placement(record)).eligible, false, sourceKind);
  }
  for (const changes of [
    { id: 'item:1-4' }, { originalId: '01-04' }, { originalId: 3 }, { kind: 'screw' },
    { pickupType: 'reward' }, { pickupType: 'random' }, { transient: true }, { temporary: true },
    { physicalId: '' }, { physicalId: '../ambiguous' }
  ]) assert.equal(evaluateCollectiblePlacement(item, placement(item, changes)).eligible, false, JSON.stringify(changes));
  const excluded = catalog.filter(record => ['reward', 'hidden_outcome'].includes(record.sourceKind));
  assert.equal(excluded.length, 66);
  assert.equal(buildCollectibleIndex(excluded, register(excluded.map(record => placement(record)))).filter(record => record.eligible).length, 0);
});

test('placement rejects missing verification, source-space coordinates, bad native XY and wrong basemaps', () => {
  for (const key of ['identity', 'position', 'scene', 'floor', 'route', 'source']) {
    const proof = placement(item); proof.verification[key] = false;
    assert.equal(evaluateCollectiblePlacement(item, proof).eligible, false, key);
  }
  for (const xy of [[NaN, 1], [1, Infinity], ['960', 960], [-1, 1], [1921, 1], [1, 1921], [1], [1, 2, 3], null, { x: 1, y: 2 }]) {
    assert.equal(evaluateCollectiblePlacement(item, placement(item, { xy })).eligible, false, String(xy));
  }
  for (const changes of [{ coordinateSpace: 'game-xyz' }, { coordinateSpace: 'source-map-pixels' }, { mapSha256: '0'.repeat(64) }]) {
    assert.equal(evaluateCollectiblePlacement(item, placement(item, changes)).eligible, false);
  }
  for (const changes of [{ width: 2048 }, { height: 1080 }, { path: 'different.jpg' }, { sha256: '0'.repeat(64) }]) {
    assert.equal(evaluateCollectiblePlacement(item, placement(item), { map: { ...COLLECTIBLE_MAP, ...changes } }).eligible, false);
  }
  assert.equal(evaluateCollectiblePlacement(item, placement(item), { ...register([]), schemaVersion: 99 }).eligible, false);
  assert.equal(evaluateCollectiblePlacement(item, placement(item), { ...register([]), placements: {} }).eligible, false);
  assert.equal(evaluateCollectiblePlacement(item, placement(item, { xy: [0, 1920] })).eligible, true);
});

test('floor, scene, route, unlock and non-video provenance are required independently', () => {
  const cases = [
    { scene: 'unknown' }, { scene: 'game-height-76.5' }, { floor: null }, { floor: 76.5 }, { floor: '76.5' }, { floor: 'Unverified roof' },
    { directions: [] }, { directions: [''] }, { directions: ['Route pending'] }, { unlock: '' }, { unlock: 'unknown' },
    { sources: [] }, { sources: [{ reference: 'javascript:alert(1)', observedOn: '2026-11-26', evidence: 'Source' }] },
    { sources: [{ reference: '../secret.md', observedOn: '2026-11-26', evidence: 'Source' }] },
    { sources: [{ reference: 'docs/qa/proof.json', observedOn: '2026-02-31', evidence: 'Source' }] },
    { sources: [{ reference: 'https://user:secret@example.test/path', observedOn: '2026-11-26', evidence: 'Source' }] },
    { sources: [{ reference: 'https://www.youtube.com/watch?v=fixture', observedOn: '2026-11-26', evidence: 'Source' }] },
    { photos: ['assets/atlas/../../secret.png'] }, { photos: ['https://example.test/image.jpg'] },
    { directions: ['Watch https://youtu.be/fixture'] }, { video_refs: [] }
  ];
  for (const changes of cases) assert.equal(evaluateCollectiblePlacement(item, placement(item, changes)).eligible, false, JSON.stringify(changes));
});

test('strict source and placement schemas accept audited records and reject arbitrary compatibility fields', () => {
  for (const field of ['unexpected', 'video_refs', 'videos', 'external_player', 'legacy_pin', 'coordinate_override']) {
    assert.equal(evaluateCollectiblePlacement(item, placement(item, { [field]: true })).reason, 'invalid_placement_schema');
  }
  const extraSource = placement(item);
  extraSource.sources[0].unexpected = 'must not be accepted';
  assert.equal(evaluateCollectiblePlacement(item, extraSource).reason, 'source_provenance_missing');
  const extraProof = placement(item);
  extraProof.verification.compatibility = true;
  assert.equal(evaluateCollectiblePlacement(item, extraProof).reason, 'verification_incomplete');
  const arbitrary = placement(item);
  arbitrary.sources[0].reference = 'https://example.test/research';
  assert.equal(evaluateCollectiblePlacement(item, arbitrary).reason, 'source_provenance_missing');
  const immutable = placement(item);
  immutable.sources[0].reference = 'https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/71cde4ff5990e6ad05299bee7494963364e70354/docs/qa/example-evidence.json';
  assert.equal(evaluateCollectiblePlacement(item, immutable).eligible, true);
  immutable.sources[0].reference = 'https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/main/docs/qa/example-evidence.json';
  assert.equal(evaluateCollectiblePlacement(item, immutable).eligible, false);
  assert.equal(evaluateCollectiblePlacement(item, placement(item, { directions: ['<a href="https://example.test">External content</a>'] })).eligible, false);
});

test('missing or malformed register preserves the complete read-only directory with no map eligibility', () => {
  for (const input of [null, undefined, [], {}, { schemaVersion: 99 }, { ...production, placements: {} }, { ...production, map: null }]) {
    const records = buildCollectibleIndex(catalog, input);
    assert.equal(records.length, 364);
    assert.deepEqual(records.map(record => record.id), catalog.map(record => record.id));
    assert.ok(records.every(record => !record.eligible && record.reason === 'map_evidence_unavailable'));
    assert.ok(records.every(record => record.xy === null && record.scene === null && record.floor === null && record.unlock === null));
    assert.ok(records.every(record => !record.directions.length && !record.sources.length && !record.photos.length));
  }
});

test('duplicate identity or physical proof fails closed; unknown placement IDs cannot create a record', () => {
  const proof = placement(item), another = placement(screw);
  let indexed = buildCollectibleIndex(catalog, register([proof, clone(proof), another]));
  assert.equal(indexed.find(record => record.id === item.id).reason, 'duplicate_identity');
  assert.equal(indexed.find(record => record.id === screw.id).eligible, true);
  indexed = buildCollectibleIndex(catalog, register([proof, { ...another, physicalId: proof.physicalId }]));
  assert.equal(indexed.filter(record => record.eligible).length, 0);
  assert.equal(indexed.find(record => record.id === item.id).reason, 'duplicate_physical_identity');
  indexed = buildCollectibleIndex(catalog, register([proof, { ...another, id: 'screw:101', originalId: '101' }, null, 1]));
  assert.equal(indexed.length, 364);
  assert.equal(indexed.filter(record => record.eligible).length, 1);
  assert.ok(!indexed.some(record => record.id === 'screw:101'));
  indexed = buildCollectibleIndex([item, item, screw], register([proof, another]));
  assert.equal(indexed.length, 2);
  assert.equal(indexed.find(record => record.id === item.id).eligible, false);
  assert.equal(evaluateCollectiblePlacement(item, proof, register([proof, clone(proof)])).reason, 'duplicate_identity');
});

test('coincident different pickups remain separate; overlap hit testing projects pixels without displacing native coordinates', () => {
  const indexed = buildCollectibleIndex([item, screw], register([placement(item), placement(screw)]));
  const before = JSON.stringify(indexed);
  const hits = overlappingPoints(indexed, { x: 202, y: 301 }, xy => ({ x: xy[0] / 4 - 40, y: xy[1] / 4 + 60 }), 24);
  assert.deepEqual(hits.map(record => record.id), [item.id, screw.id]);
  assert.equal(hits[0], indexed[0]);
  assert.equal(JSON.stringify(indexed), before);
  assert.deepEqual(overlappingPoints(indexed, [200, 300], () => { throw Error('bad projection'); }), []);
  assert.deepEqual(overlappingPoints(indexed, [NaN, 0], xy => xy), []);
  assert.deepEqual(overlappingPoints(indexed, [200, 300], xy => xy, -1), []);
  const raw = { ...indexed[0], xy: [960, 960] };
  overlappingPoints([raw, raw], [1, 2], xy => { xy[0] = 1; xy[1] = 2; return xy; });
  assert.deepEqual(raw.xy, [960, 960]);
  assert.equal(overlappingPoints([indexed[0], indexed[0]], [960, 960], xy => xy).length, 1);
});

test('all 364 dense synthetic points remain selectable at multiple scales; fixtures cannot enter production', () => {
  const fixture = clone(original);
  // Test-only eligibility override: original IDs retained, while real reward and
  // random-outcome rows remain excluded by the separate production-class tests.
  for (const zone of fixture.zones) for (const row of zone.items) {
    row.kind = 'landmark'; row.name = 'SYNTHETIC TEST ' + row.name;
  }
  const records = buildCollectibleCatalog(fixture);
  const placements = records.map((record, i) => placement(record, { xy: [960 + i % 14 / 100, 960 + Math.floor(i / 14) / 100] }));
  const indexed = buildCollectibleIndex(records, register(placements));
  assert.equal(indexed.length, 364);
  assert.equal(indexed.filter(record => record.eligible).length, 364);
  const before = JSON.stringify(indexed);
  for (const scale of [0.25, 1, 4, 16]) {
    const hits = overlappingPoints(indexed, { x: 960 * scale, y: 960 * scale }, xy => ({ x: xy[0] * scale, y: xy[1] * scale }));
    assert.equal(hits.length, 364);
    assert.equal(new Set(hits.map(record => record.id)).size, 364);
  }
  assert.equal(JSON.stringify(indexed), before);
  assert.deepEqual(JSON.parse(read('atlas-collectibles-data.json')).placements, []);
  assert.equal(original.zones.flatMap(zone => zone.items).filter(row => row.kind === 'reward').length, 10);
});

test('progress uses original zero-based item and unpadded Screw keys with strict pure reads', () => {
  const saved = freezeTree({ pickup: { '1-3': true, '1-0': false }, screw: { '1': true }, check: { '7': true }, future: { keep: 'unchanged' } });
  const before = JSON.stringify(saved);
  assert.equal(readCollected(item, saved), true);
  assert.equal(readCollected(screw, saved), true);
  assert.equal(readCollected(catalog.find(record => record.id === 'item:1-0'), saved), false);
  assert.equal(readCollected(catalog.find(record => record.id === 'screw:2'), saved), false);
  assert.equal(readCollected(item, {}), false);
  assert.equal(readCollected(screw, { screw: { '001': true } }), false);
  assert.equal(readCollected(item, { pickup: { '01-04': true } }), false);
  for (const value of [null, undefined, [], 'corrupt', { pickup: [] }, { screw: null }, { pickup: new Date() }]) assert.equal(readCollected(item, value), null);
  for (const value of [1, 'true', null, {}, []]) assert.equal(readCollected(item, { pickup: { '1-3': value } }), null);
  assert.equal(readCollected(item, { pickup: Object.create({ '1-3': true }) }), false);
  let accessed = false;
  const accessor = {}; Object.defineProperty(accessor, 'pickup', { get() { accessed = true; return {}; } });
  assert.equal(readCollected(item, accessor), null);
  assert.equal(accessed, false);
  assert.equal(JSON.stringify(saved), before);
  assert.doesNotMatch(read('atlas-collectibles.mjs'), /\b(?:localStorage|sessionStorage|fetch|XMLHttpRequest)\s*[.(]/);
});

test('real collectibles match displayed labels, accents and a bounded Wild Zone on the same row', () => {
  const ids = (query, kind) => catalog.filter(createCollectibleMatcher(query, kind)).map(({id})=>id);
  const screw29 = catalog.find(r=>r.id==='screw:29');
  const greatBall = catalog.find(r=>r.id==='item:2-5');
  assert.deepEqual(ids(collectibleLabel(screw29), 'screw'), ['screw:29']);
  assert.deepEqual(ids('Colorful Screw #29', 'screw'), ['screw:29']);
  assert.deepEqual(ids('Colorful Screw 2', 'screw'), ['screw:2']);
  assert.deepEqual(ids('Colorful Screw 29', 'item'), []);
  assert.deepEqual(ids(collectibleLabel(greatBall)), ['item:2-5']);
  assert.deepEqual(ids('item 02-06'), ['item:2-5']);
  assert.deepEqual(ids('02-06'), ['item:2-5']);
  assert.deepEqual(ids('Wild Zone 2 Great Ball'), ['item:2-5']);
  assert.deepEqual(ids('Great Ball Wild Zone 02'), ['item:2-5']);
  assert.deepEqual(ids('Wild Zone 2'), [...Array.from({length:6}, (_,i)=>'item:2-'+i), 'screw:15']);
  assert.equal(ids('Wild Zone 20', 'item').length, 66);
  assert.deepEqual(ids('Wild Zone 21'), []);
  assert.equal(ids('Great Ball').length, 13);
  assert.equal(ids('Great B').length, 13);
  assert.equal(ids('Poké Ball').length, 5);
  assert.deepEqual(ids('Poké Ball'), ids('Poke Ball'));
  assert.equal(ids('', 'item').length, 264);
  assert.equal(ids('', 'screw').length, 100);
});

// AT-348 A3-01: immutable field evidence is additive and never owns progress or pins.
test('all 65 field groups and 318 exact original photos are retained without assigning map pins or checklist IDs',()=>{
  const field=JSON.parse(read('docs/field-guides/collectible-photo-register.json'));
  const review=JSON.parse(read('docs/qa/AT348_A3_01_FIELD_EVIDENCE_CROSSWALK.json'));
  const page=read('collectible-fieldbook.html'),guide=read('docs/field-guides/collectible-locations.md');
  assert.deepEqual(field.counts,{tm:22,item:20,screw:22,access:1,collectibleFinds:64,photos:318});
  assert.equal(field.entries.length,65);
  assert.equal(new Set(field.entries.map(e=>e.id)).size,65);
  assert.equal((page.match(/<details class="field-find" id="/g)||[]).length,65);
  assert.equal((page.match(/<img src="assets\/atlas\/(?:collectibles|access)\//g)||[]).length,318);
  const paths=field.entries.flatMap(e=>e.photos.map(p=>p.path));
  assert.equal(new Set(paths).size,318);
  assert.deepEqual(Object.keys(review.photo_git_blobs).sort(),paths.slice().sort());
  for(const e of field.entries){
    assert.equal(e.atlasCoordinate,null);assert.equal(e.canonicalChecklistId,null);
    assert.ok(page.includes('id="'+e.id+'"'),e.id);
    for(const p of e.photos){
      assert.ok(page.includes('src="'+p.path+'"')&&page.includes('href="'+p.path+'"'),p.path);
      assert.ok(guide.includes(p.path),p.path);
      const bytes=fs.readFileSync(new URL('../'+p.path,import.meta.url));
      assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
      const blob=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
      assert.equal(blob,review.photo_git_blobs[p.path],p.path+' exact source Git blob');
    }
  }
  assert.match(page,/No collection progress is changed/);
  assert.doesNotMatch(page,/<input\\b|data-(?:atlas-pickup|atlas-screw|pickup|screw)=/);
  assert.equal(production.placements.length,0);
  for(const file of ['items.html','atlas-explorer.html'])assert.ok(read(file).includes('href="collectible-fieldbook.html"'));
  const written=JSON.parse(read('docs/qa/ATLAS_TM_ACCESS_RESEARCH_2026-11-26.json')).records;
  assert.equal(review.tm_candidates.length,13);assert.equal(review.unmatched_tm.length,4);
  for(const c of review.tm_candidates){
    const row=written.find(x=>x.id===c.original_checklist_candidate);
    assert.equal(row.move,c.name);assert.equal(row.tm,c.tm);assert.equal(row.zone,c.zone);
    assert.equal(c.canonical_assignment,false);
    assert.equal(original.zones.flatMap(z=>z.items).find(x=>x.id===row.id).name,row.tm);
  }
});

// A3-02: guide links expose evidence independently of original checklist state.
test('fieldbook deep links preserve original TM access notes and keep access comparisons non-authoritative',()=>{
 const review=JSON.parse(read('docs/qa/AT348_A3_01_FIELD_EVIDENCE_CROSSWALK.json'));
 const routeReview=JSON.parse(read('docs/qa/AT348_A3_02_ACCESS_ROUTE_COMPARISONS.json'));
 const field=JSON.parse(read('docs/field-guides/collectible-photo-register.json'));
 const access=JSON.parse(read('MAPS_ACCESS_ROUTE_SURVEY.json')).leads;
 const html=read('collectible-fieldbook.html');
 for(const row of field.entries)assert.ok(html.includes('id="'+row.id+'-photos"'),row.id);
 for(const file of ['items.html','sector-maps.html']){
   const source=read(file);let links=0;
   for(const row of review.tm_candidates){
     const notes=[...source.matchAll(new RegExp('<span data-tm-access="'+row.original_checklist_candidate+'">([^]*?)</span>','g'))];
     const expected=file==='sector-maps.html'&&row.original_checklist_candidate==='5-7'?2:1;
     assert.equal(notes.length,expected);
     for(const note of notes){assert.match(note[1],/exact pin unverified/);assert.ok(note[1].includes('href="collectible-fieldbook.html#'+row.field_id+'-photos"'));links++;}
   }
   assert.equal(links,file==='items.html'?13:14);
 }
 assert.equal(routeReview.comparisons.length,6);
 for(const r of routeReview.comparisons){
   assert.ok(field.entries.some(e=>e.id===r.field_id));
   const leads=r.existing_access_leads.map(id=>access.find(a=>a.id===id));assert.ok(leads.every(Boolean));
   assert.ok(r.candidate_original_screw_ids.every(id=>leads.some(a=>a.candidate_original_screw_ids.includes(id))));
   assert.equal(r.canonical_screw_id,null);assert.equal(r.canonical_checklist_id,null);assert.equal(r.native_xy,null);assert.equal(r.route_geometry_approved,false);assert.equal(r.publish_pin,false);
 }
 assert.equal(production.placements.length,0);
});
