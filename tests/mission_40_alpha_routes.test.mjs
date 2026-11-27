import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = file => readFileSync(new URL("../" + file, import.meta.url), "utf8");
function card(file, id) {
  const html = read(file);
  const loc = html.indexOf('id="' + id + '"');
  assert.ok(loc >= 0, file + " misses " + id);
  return html.slice(loc, html.indexOf("</article>", loc));
}
test("Main Mission 40 catch warning is visible in every route before the encounter instructions", () => {
  for (const [file, id] of [
    ["index.html", "mission-40"],
    ["journey.html", "journey-mission-40"],
    ["walkthrough.html", "mission-40"],
    ["legendaries.html", "legend-xerneas"]
  ]) {
    const html = card(file, id);
    const warning = html.indexOf("Catch them if you want to keep them.");
    assert.ok(warning >= 0 && warning < html.indexOf("where Venipede normally gather"), file);
    assert.match(html, /Lv\. 70 Alphas counts for Mable/);
    assert.match(html, /do not return once defeated/);
    assert.match(html, /<strong>Steelix<\/strong> in the centre of Wild Zone 3/);
    assert.match(html, /<strong>Pangoro<\/strong> on the high rooftop where Mawile normally appears in Wild Zone 9/);
    assert.match(html, /href="alphas\.html#alpha-mission-40"/);
  }
});
test("Mission 40 Fieldbook distinguishes the missable encounters from repeatable Alpha species", () => {
  const html = card("alphas.html", "alpha-mission-40");
  assert.match(html, /Gallade and Pangoro can reappear as <a href="#zone-20">/);
  assert.match(html, /trade an Alpha Onix holding a Metal Coat/);
  assert.match(html, /4★ Steel Hyperspace Wild Zones/);
});
