import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateCrossGrid,latticePoint,parseCell,nativeReference,referencePoint,
  cellPolygon,cellCentre,referenceText,referenceFromSearch,referenceURL} from '../atlas-cross-grid.mjs';
import {COLLECTIBLE_MAP} from '../atlas-collectibles.mjs';

const root=path.resolve(import.meta.dirname,'..');
const shipped=JSON.parse(fs.readFileSync(path.join(root,'atlas-cross-grid.json'),'utf8'));
const grid=validateCrossGrid(shipped);
const near=(a,b,tolerance=1e-7)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const nearPoint=(a,b,tolerance)=>{assert.ok(a&&b);near(a[0],b[0],tolerance);near(a[1],b[1],tolerance);};
const fixture={...grid,origin_native_xy:[20,30],column_vector_native_xy:[100,2],row_vector_native_xy:[1,100]};

test('the shipped cross grid names and hashes the original native map',()=>{
  assert.equal(grid.id,'atlas-native-cross-grid-v1');
  assert.equal(grid.alignment_verified,true);
  assert.equal(grid.map_path,COLLECTIBLE_MAP.path);
  assert.deepEqual(grid.native_size,[1920,1920]);
  const hash=createHash('sha256').update(fs.readFileSync(path.join(root,grid.map_path))).digest('hex');
  assert.equal(grid.native_sha256,hash);
  assert.equal(grid.native_sha256,COLLECTIBLE_MAP.sha256);
  assert.equal(grid.columns,18);assert.equal(grid.rows,18);
});

test('runtime lattice coefficients match the independently reviewed native calibration',()=>{
  const review=JSON.parse(fs.readFileSync(path.join(root,grid.independent_review),'utf8'));
  assert.equal(review.decision,'PASS_FOR_OPTIONAL_ATLAS_REFERENCE_GRID_WITH_RECORDED_LIMITS');
  assert.equal(review.source_integrity_pass,true);
  assert.equal(review.native_affine.fit_holdout_sets_disjoint,true);
  const matrix=review.native_affine.independently_computed_grid_to_native;
  nearPoint(grid.origin_native_xy,[matrix[0][2],matrix[1][2]],1e-9);
  nearPoint(grid.column_vector_native_xy,[matrix[0][0],matrix[1][0]],1e-9);
  nearPoint(grid.row_vector_native_xy,[matrix[0][1],matrix[1][1]],1e-9);
  assert.ok(review.source_integrity.some(source=>source.path===grid.map_path&&source.sha256===grid.native_sha256&&source.matches_recorded===true));
});

test('invalid calibration identity, image hash and degenerate axes fail closed',()=>{
  const mutations=[
    {schema_version:2},{id:'unreviewed-grid'},{alignment_verified:false},
    {map_path:'maps/another-map.jpg'},{native_size:[4096,4096]},
    {native_sha256:'0'.repeat(64)},{native_sha256:'not-a-hash'},
    {origin_native_xy:[NaN,20]},{column_vector_native_xy:[0,0]},
    {row_vector_native_xy:[100,0]},{column_vector_native_xy:[100,100]},
    {columns:0},{columns:27},{rows:0},{rows:100},
    {observed_max_column_node:null},{observed_max_column_node:19},
    {observed_max_row_node:0},{observed_max_row_node:19}
  ];
  for(const change of mutations)assert.throws(()=>validateCrossGrid({...grid,...change}),JSON.stringify(change));
  assert.throws(()=>validateCrossGrid(null));
});

test('a known skewed lattice resolves independent cell and offset observations',()=>{
  // 853.75,921.5 is independently constructed as origin + 8.25 east steps
  // and 8.75 south steps on this small synthetic survey, not real map evidence.
  const ref=nativeReference([853.75,921.5],fixture);
  assert.equal(ref.label,'I9');assert.equal(ref.column,8);assert.equal(ref.row,8);
  near(ref.east,.25);near(ref.south,.75);
  nearPoint(referencePoint(parseCell('I9',fixture),.25,.75,fixture),[853.75,921.5]);
  nearPoint(latticePoint(8.25,8.75,fixture),[853.75,921.5]);
  assert.match(referenceText(ref),/I9.*25% east.*75% south/);
});

test('boundary ownership is east and south, while invalid map positions have no reference',()=>{
  const cross=latticePoint(8,8,fixture),at=nativeReference(cross,fixture);
  assert.equal(at.label,'I9');assert.equal(at.east,0);assert.equal(at.south,0);
  const before=nativeReference(latticePoint(8-1e-6,8-1e-6,fixture),fixture);
  assert.equal(before.label,'H8');assert.ok(before.east>.999);assert.ok(before.south>.999);
  for(const point of [[-1,100],[100,-1],[1921,100],[100,1921],[NaN,100],[100,Infinity],null,[1],[0,0]])
    assert.equal(nativeReference(point,fixture),null,JSON.stringify(point));
  const adjacent=referencePoint(parseCell('H8',fixture),1,1,fixture);
  nearPoint(adjacent,cross);
  assert.equal(nativeReference(adjacent,fixture).label,'I9');
});

test('cell labels are bounded and every visible shipped cell has a valid clipped centre',()=>{
  for(const value of ['a1',' A1 ','a-1'])assert.equal(parseCell(value,grid)?.label,'A1');
  for(const value of ['',null,'A0','A01','S1','A19','AA1','I9junk','<I9>','1I'])assert.equal(parseCell(value,grid),null);
  for(let row=0;row<grid.rows;row++)for(let column=0;column<grid.columns;column++){
    const cell={column,row},polygon=cellPolygon(cell,grid),centre=cellCentre(cell,grid);
    assert.ok(polygon.length>=3);assert.ok(centre);
    assert.ok(polygon.every(p=>p.every(v=>Number.isFinite(v)&&v>=0&&v<=1920)));
    const ref=nativeReference(centre,grid);
    assert.equal(ref.column,column);assert.equal(ref.row,row);
    nearPoint(referencePoint(ref,ref.east,ref.south,grid),centre);
  }
  const edge=parseCell('R18',grid),polygon=cellPolygon(edge,grid);
  assert.ok(polygon.some(p=>Math.abs(p[0]-1920)<1e-7));
  assert.ok(polygon.some(p=>Math.abs(p[1]-1920)<1e-7));
  assert.equal(referencePoint(edge,1,1,grid),null,'No source pixel exists beyond the clipped image');
});

test('references round-trip across the native map without mutating calibration or existing records',()=>{
  const snapshot=JSON.stringify(grid);
  const records=JSON.parse(fs.readFileSync(path.join(root,'atlas-explorer-data.json'),'utf8'));
  const before=JSON.stringify(records);
  const points=[...records.zones,...records.holovators,...records.ladders,...records.landmarks]
    .map(p=>p.xy).filter(Array.isArray);
  for(const xy of points){
    const ref=nativeReference(xy,grid);
    if(ref)nearPoint(referencePoint(ref,ref.east,ref.south,grid),xy);
  }
  assert.equal(JSON.stringify(grid),snapshot);
  assert.equal(JSON.stringify(records),before);
  assert.equal(records.zones.length,20);assert.equal(records.sectors.length,48);
  assert.equal(records.holovators.length,21);
});

test('fractional map links keep existing place context and reproduce the requested point',()=>{
  const ref=nativeReference([853.75,921.5],fixture);
  const url=new URL(referenceURL('https://example.test/atlas-explorer.html?place=hotel-z-ladder#main',ref));
  assert.equal(url.searchParams.get('place'),'hotel-z-ladder');assert.equal(url.hash,'#main');
  assert.equal(url.searchParams.get('grid_frame'),grid.id);
  assert.equal(url.searchParams.get('grid'),'I9');
  assert.equal(url.searchParams.get('grid_east'),'25.000');
  assert.equal(url.searchParams.get('grid_south'),'75.000');
  nearPoint(referenceFromSearch(url.search,fixture).point,[853.75,921.5]);
  nearPoint(referenceFromSearch('?grid=I9',fixture).point,[878.5,897]);
  nearPoint(referenceFromSearch('?grid=I9&grid_frame='+fixture.id,fixture).point,[878.5,897]);
});

test('plain links to clipped cells use visible centres and explicit out-of-image offsets reject',()=>{
  const edge=parseCell('R18',grid);
  const linked=referenceFromSearch('?grid=R18',grid);
  assert.ok(linked);assert.equal(linked.cell.label,'R18');
  nearPoint(linked.point,cellCentre(edge,grid));
  assert.equal(referenceFromSearch('?grid=R18&grid_east=100&grid_south=100',grid),null);
});

test('malformed fractional links fail closed instead of inventing a target',()=>{
  for(const search of [
    '?grid=S19','?grid=I9&grid_frame=unknown-grid-v2','?grid=I9&grid_frame=',
    '?grid=I9&grid_east=-1','?grid=I9&grid_south=101',
    '?grid=I9&grid_east=Infinity','?grid=I9&grid_east=1e1',
    '?grid=I9&grid_east=','?grid=I9&grid_south=2.1234'
  ])assert.equal(referenceFromSearch(search,grid),null,search);
  for(const offset of [-1,1.1,NaN,Infinity])assert.equal(referencePoint(parseCell('I9',grid),offset,.5,grid),null);
});
