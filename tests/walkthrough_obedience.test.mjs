import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const milestones=JSON.parse(read('docs/qa/ATLAS_STORY_OBEDIENCE.json')).milestones;
test('all 42 mission cards give the same after-stage rank and correctly labelled obedience cap',()=>{
 const expected=[[0,'Z',20],[4,'Y',25],[6,'X',30],[7,'W',35],[8,'V',40],
  [10,'F',60],[14,'E',65],[19,'D',70],[24,'C',75],[30,'B',80],[35,'A',null]];
 assert.deepEqual(milestones.map(({mission,rank,cap})=>[mission,rank,cap]),expected);
 for(const file of ['src/sections/walkthrough.html','index.html','walkthrough.html','journey.html']){
  const doc=read(file);
  const labels=[...doc.matchAll(/data-obedience-mission="(\d+)"><strong>(.*?)<\/strong> Rank ([A-Z]) · caught Pokémon obey (through Lv\. \d+|all levels)([^<]*)/g)];
  assert.deepEqual(labels.map(r=>Number(r[1])),Array.from({length:42},(_,i)=>i+1),file);
  for(const [,number,when,rank,cap,rest] of labels){
   const [,expectedRank,expectedCap]=expected.findLast(([m])=>m<=Number(number));
   assert.equal(rank,expectedRank,file+' '+number);
   assert.equal(cap,expectedCap===null?'all levels':'through Lv. '+expectedCap);
   const milestone=milestones.find(m=>m.mission===Number(number));
   assert.equal(when,milestone?'After beating '+milestone.battle+':':'After this mission:');
   assert.equal(rest.includes('was Rank'),Boolean(milestone));
  }
 }
 const table=read('walkthrough.html').match(/id="rank-obedience"[\s\S]*?<\/table>/)?.[0]??'';
 assert.match(table,/level when caught/);
 assert.match(table,/in-game Save screen/);
 assert.match(table,/Mission 09 leaves you at Rank V/);
 assert.equal([...table.matchAll(/<th scope="row">/g)].length,11);
 assert.deepEqual([...read('src/sections/walkthrough.html').matchAll(/data-check="(\d+)"/g)].map(m=>+m[1]),Array.from({length:42},(_,i)=>i+1));
});
