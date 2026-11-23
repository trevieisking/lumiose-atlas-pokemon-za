import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const original = read("src/sections/walkthrough.html");
const built = read("index.html");
const journey = read("journey.html");
const anchors=new Set([...journey.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const LINKS=/href="journey\.html#journey-mission-(\d+)"/g;

test("AT-272: 48 original main-guide route links all point to existing 42 mission anchors",()=>{
 const sourceNumbers=[...original.matchAll(LINKS)].map(m=>Number(m[1]));
 const compiledNumbers=[...built.matchAll(LINKS)].map(m=>Number(m[1]));
 assert.equal(sourceNumbers.length,48,"All saved 48 journey links must survive");
 assert.deepEqual(compiledNumbers,sourceNumbers,"Generated homepage must use exactly the same 48 deep links");
 assert.deepEqual([...new Set(sourceNumbers)].sort((a,b)=>a-b),
   Array.from({length:42},(_,i)=>i+1),"One or more of 42 journeys lost");
 assert.ok(sourceNumbers.every(n=>anchors.has("journey-mission-"+n)),"Broken journey target");
 assert.doesNotMatch(original,/href="journey\.html#mission-\d+"/,"Previous broken anchor form remains");
 assert.doesNotMatch(built,/href="journey\.html#mission-\d+"/,"Compiled guide still has broken links");
});

test("AT-272: source-generated homepage remains byte-for-byte reproducible",()=>{
 let expected=read("src/template.html");
 const slots=[...expected.matchAll(/<!--\s*SECTION:([a-z0-9_-]+)\s*-->/g)];
 assert.equal(slots.length,17);
 for(const m of slots)expected=expected.replace(m[0],read("src/sections/"+m[1]+".html"));
 assert.equal(built,expected,"Never silently lose original content during rebuild");
});

test("AT-272: map navigation and mission progress identifiers remain intact",()=>{
 assert.equal((original.match(/<article class="mission" id="mission-\d+"/g)||[]).length,42);
 assert.equal((built.match(/class="mission"/g)||[]).length,42);
 assert.equal((built.match(/data-side-check=/g)||[]).length,203);
 assert.ok(built.includes('data-check="24"')&&built.includes('data-check="25"')&&built.includes('data-check="37"'));
 assert.ok(built.includes("maps/lumiose-game-map.jpg"));
 assert.ok(built.includes("data-select-zone="));
 assert.ok(built.includes("TM100 Gunk Shot"),"AT-271's existing safe repair must stay intact");
 assert.ok(built.includes("Mega Pidgeot"),"AT-270's ally battle must stay intact");
 const atlas=read("atlas-explorer.html");
 assert.ok(atlas.includes('id="aeCoverageGrid"'));
 assert.ok(atlas.includes('id="aeCoverageSector"'));
 assert.ok(read("app.js").includes("lumiose-atlas-reconstruction-v1"));
});
