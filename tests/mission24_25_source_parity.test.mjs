import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {test} from "node:test";

const read = path => readFileSync(new URL("../"+path, import.meta.url),"utf8");
const versions = [
 ["editable source", read("src/sections/walkthrough.html"), "mission-"],
 ["generated guide", read("index.html"), "mission-"],
 ["standalone walkthrough", read("walkthrough.html"), "mission-"],
 ["complete journey", read("journey.html"), "journey-mission-"]
];
const royale=read("royale-guide.html");
function mission(html, prefix, number) {
 const start=html.indexOf('id="'+prefix+number+'"');
 const end=html.indexOf('id="'+prefix+(number+1)+'"',start);
 assert.ok(start>=0&&end>start,"Missing mission "+number+" or next card");
 return html.slice(start,end);
}

test("AT-271: Rank C typing, award and Hotel Z debt scene preserved across all four views",()=>{
 for(const [view,html,prefix] of versions) {
   const m24=mission(html,prefix,24);
   for(const needle of [
     "Arbok (Lv. 50)", "Gyarados (Lv. 51)", "Roserade (Lv. 51)",
     "Mega Scolipede (Lv. 52)", "Philippe", "TM100 Gunk Shot",
     "Lida, Naveen and Taunie/Urbain", "Corbeau arrives and checks in",
     "Ground deals neutral damage to Mega Scolipede", "Fire, Flying, Psychic or Rock"
   ]) assert.ok(m24.includes(needle),view+" missing Mission 24 correction: "+needle);
   for(const original of [
     "Enter the active night battle zone",
     "Heal your whole party and follow the promotion marker",
     "Win the Rank C match; open the opponent card"
   ]) assert.ok(m24.includes(original),view+" lost the original M24 guide: "+original);
   assert.ok(!m24.includes("Ground helps against Arbok and Scolipede"),
     view+" still misstates Mega Scolipede type effectiveness");
 }
 const card=royale.slice(royale.indexOf('MAIN MISSION 24'),royale.indexOf('MAIN MISSION 30'));
 assert.ok(card.includes("Ground is neutral against Bug/Poison Mega Scolipede"));
 assert.ok(card.includes("Fire, Flying, Psychic or Rock against Mega Scolipede"));
 assert.ok(!card.includes("Ground beats Arbok and Mega Scolipede"));
});

test("AT-271: all opponent names, levels and important immunities survive on every guide",()=>{
 for(const [view,html,prefix] of versions) {
   const m25=mission(html,prefix,25);
   for(const needle of [
     "Hotel Z", "AZ then gives Lida and Naveen Mega Rings",
     "Vernal Pokémon Center", "Vert Sector 4",
     "Clawitzer (Lv. 46", "Vanillish (Lv. 46", "Emolga (Lv. 47",
     "Staryu (Lv. 48", "Ariados (Lv. 48", "Sableye (Lv. 48",
     "Krookodile (Lv. 49", "Mega Scrafty (Lv. 50",
     "immune to Ground", "immune to Psychic", "immune to Electric",
     "Fairy 4×", "Fighting/Flying 2×", "Wild Zones 16 and 17",
     "Ampharos (Electric)", "Florges (Fairy)",
     "Mission 26"
   ]) assert.ok(m25.includes(needle),view+" missing Mission 25 tactic: "+needle);
   assert.ok(m25.includes("Meet Team MZ at the battle court"));
   assert.ok(m25.includes("Prepare for consecutive battles with Lida and Naveen"));
   assert.ok(!m25.includes("first-ever battle against Lida"),
    "Do not invent new battle unlock conditions");
 }
});

test("AT-271: the existing map and player identifiers survive without destructive rewrites",()=>{
 const html=read("index.html"),original=read("src/sections/walkthrough.html");
 assert.equal((original.match(/<article class="mission" id="mission-\d+"/g)||[]).length,42);
 assert.equal((html.match(/class="mission"/g)||[]).length,42);
 assert.equal((html.match(/data-side-check=/g)||[]).length,203);
 assert.ok(html.includes('data-check="24"')&&html.includes('data-check="25"'));
 assert.ok(html.includes("maps/lumiose-game-map.jpg"));
 assert.ok(html.includes("data-select-zone="));
 assert.ok(read("atlas-explorer.html").includes('id="aeCoverageGrid"'));
 assert.ok(read("atlas-explorer.html").includes('id="aeCoverageSector"'));
 const app=read("app.js");
 assert.match(app,/lumiose-atlas-reconstruction-v1/);
 assert.ok(read("walkthrough.html").includes('href="index.html#walkthrough:mission-24"'));
 assert.ok(read("journey.html").includes('href="index.html#walkthrough:mission-25"'));
});
