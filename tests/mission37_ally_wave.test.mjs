import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";

const read = path => readFileSync(new URL("../"+path,import.meta.url),"utf8");
const source = read("src/sections/walkthrough.html");
const home = read("index.html");
const standalone = read("walkthrough.html");
const journey = read("journey.html");

function extract(s, start, next) {
  const a=s.indexOf('id="'+start+'"'), b=s.indexOf('id="'+next+'"',a+start.length);
  assert.ok(a>=0 && b>a, "Missing anchored mission pair "+start);
  return s.slice(a,b);
}

test("AT-270: all three guide views contain the same researched Mission 37 ally battle",()=>{
  for(const [name,html,id,next] of [
    ["source",source,"mission-36","mission-38"],
    ["generated-home",home,"mission-36","mission-38"],
    ["standalone",standalone,"mission-36","mission-38"],
    ["journey",journey,"journey-mission-36","journey-mission-38"]
  ]) {
    const pair=extract(html,id,next);
    const pre=pair.slice(0,pair.indexOf('id="'+(name==="journey"?"journey-mission-37":"mission-37")+'"'));
    const wave=pair.slice(pair.indexOf('id="'+(name==="journey"?"journey-mission-37":"mission-37")+'"'));
    assert.match(pre,/Ivor-and-Gwynn ally battle is part of Mission 37/,"Transition absent: "+name);
    assert.doesNotMatch(pre,/Mega Pidgeot|Mega Kangaskhan|Mega Garchomp/,"Do not mislabel Mission 36 wave: "+name);
    for(const fact of ["Ivor and Gwynn","Mega Pidgeot","Mega Kangaskhan","Mega Garchomp","level-62","Ice Beam","Thunderbolt","Brick Break","4×","Canari and Tarragon","Mega Blastoise","Mega Steelix","temporary bridge","canal-side walkway"]) {
      assert.ok(wave.includes(fact),name+" missing verified ally-wave detail: "+fact);
    }
    assert.ok(wave.includes("Follow the allies in sequence through the city"),"Original team sequence lost in "+name);
    assert.ok(wave.includes("Cross the scaffolding and rooftops to reach Zygarde"),"Original climb lost in "+name);
    assert.ok(wave.includes("During Ange, destroy both flowers three times"),"Original finale lost in "+name);
    assert.ok(wave.includes("Follow the final Zygardite prompt"),"Original ending lost in "+name);
    assert.match(wave,/Additional researched route detail:/);
    assert.match(wave,/Counter moves and survival:/);
  }
});

test("AT-270: original 17-section builder reproduces the checked-in homepage byte for byte",()=>{
  let expected=read("src/template.html");
  const slots=[...expected.matchAll(/<!--\s*SECTION:([a-z0-9_-]+)\s*-->/g)];
  assert.equal(slots.length,17);
  for(const match of slots)expected=expected.replace(match[0],read("src/sections/"+match[1]+".html"));
  assert.equal(home,expected,"Generated index must exactly match editable captured sections");
});

test("AT-270: no story identity, map navigation, saved progress or photo loss",()=>{
  assert.equal((source.match(/<article class="mission" id="mission-\d+"/g)||[]).length,42);
  assert.equal((home.match(/class="mission"/g)||[]).length,42);
  assert.equal((home.match(/data-side-check=/g)||[]).length,203);
  assert.equal((home.match(/data-select-zone=/g)||[]).length>=20,true);
  assert.ok(home.includes("lumiose-game-map.jpg"));
  assert.ok(home.includes('data-check="36"')&&home.includes('data-check="37"'));
  assert.ok(standalone.includes('href="index.html#walkthrough:mission-37"'));
  assert.ok(journey.includes('href="index.html#walkthrough:mission-37"'));
  assert.doesNotMatch(read("scripts/build.py"),/localStorage|supabase|fetch\(/i);
  const atlas=read("atlas-explorer.html");
  assert.ok(atlas.includes('id="aeCoverageGrid"'));
  assert.ok(atlas.includes('id="aeCoverageSector"'));
});
