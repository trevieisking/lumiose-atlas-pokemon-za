import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {SOURCE_IMAGES,SECTOR_CONTEXT_VIEWS,sectorContextFor,sectorContextImageStyle} from '../atlas-sector-context.mjs';

const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url));
const atlas=JSON.parse(read('atlas-explorer-data.json').toString('utf8'));
const archive=JSON.parse(read('docs/qa/at344-sector-source-recovery-2026-11-26/source-recovery.json').toString('utf8'));
const oldLibrary=JSON.parse(read('MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json').toString('utf8'));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');

test('every original named sector gets exactly one source-registered wider context, with current crop fallback',()=>{
  const ids=atlas.sectors.map(a=>a.id);
  assert.equal(ids.length,48);
  assert.deepEqual(Object.keys(SECTOR_CONTEXT_VIEWS).sort(),ids.slice().sort());
  assert.equal(Object.keys(SOURCE_IMAGES).length,10);
  const candidates=JSON.parse(read('docs/qa/at344-sector-source-survey/sector-coverage.json').toString('utf8'));
  assert.equal(candidates.sectors.length,48);
  for(const row of candidates.sectors){
    const c=sectorContextFor(row.sector_id);
    assert.ok(c,'Missing context for '+row.sector_id);
    assert.equal(c.source_precision,'source_image_orientation_only');
    assert.ok(row.current_original_candidates.some(candidate=>candidate.original_filename===c.file));
    assert.equal(c.fallback,row.existing_runtime_source.image_path);
    assert.ok(c.path.startsWith('assets/atlas/sector-context/'));
    assert.equal(c.x>0&&c.x<1,true);
    assert.equal(c.y>0&&c.y<1,true);
    assert.ok(c.zoom>=1.8&&c.zoom<=2.5);
    assert.equal(c.width>2500,true);
    const style=sectorContextImageStyle(c);
    assert.match(style,/^width:\d+\.\d{2}%;left:-?\d+\.\d{2}%;top:-?\d+\.\d{2}%$/);
    assert.ok(read(c.fallback).length>0);
  }
  assert.equal(sectorContextFor('wz-01'),null);
  assert.equal(sectorContextFor('not-a-sector'),null);
  assert.equal(sectorContextImageStyle(null),'');
  assert.equal(oldLibrary.counts.image_crops,42);
  assert.equal(oldLibrary.counts.sectors_with_photographic_references,48);
});

test('the ten sector context assets reuse exact immutable 26-source archive JPEG bytes',()=>{
  assert.equal(archive.entries.length,26);
  for(const [filename,row] of Object.entries(SOURCE_IMAGES)){
    const recorded=archive.entries.find(a=>a.original_filename===filename);
    assert.ok(recorded,'Original missing '+filename);
    assert.equal(row.original_path,recorded.repository_path);
    assert.deepEqual([row.width,row.height],recorded.dimensions);
    assert.equal(row.sha256,recorded.sha256);
    const original=read(row.original_path),served=read(row.path);
    assert.equal(sha(original),recorded.sha256);
    assert.equal(sha(served),recorded.sha256);
    assert.equal(Buffer.compare(original,served),0,'The public asset must be byte-identical, not re-encoded');
    assert.equal(original[0],255);assert.equal(original[1],216);
  }
});

test('no new coordinates, progress persistence or map geometry; Wild Zone photo pairs remain complete',()=>{
  const ui=read('atlas-area-ui.mjs').toString('utf8');
  const css=read('atlas-area.css').toString('utf8');
  assert.match(ui,/sectorContextFor\(area\.id\)/);
  assert.match(ui,/image\.addEventListener\('error',\(\)=>source\.remove\(\)/);
  assert.match(ui,/Show preserved close-up photograph/);
  assert.match(css,/\.aa-context-window\{/);
  assert.doesNotMatch(read('atlas-sector-context.mjs').toString('utf8'),/localStorage|sessionStorage|setItem|fetch\(|geometry\.coordinates|map_xy/i);
  for(let n=1;n<=20;n++){
    const num=String(n).padStart(2,'0');
    for(const type of ['overview','closeup'])
      assert.ok(read('assets/atlas/wild-zones/wild-zone-'+num+'-'+type+'.png').length>0);
  }
  assert.equal(atlas.zones.length,20);
});
