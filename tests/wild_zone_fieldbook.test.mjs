import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {createHash} from "node:crypto";
import {wildZoneRecords,wildZoneRecord,wildZoneFieldbookMarkup,zoneSearchText} from "../wild-zone-fieldbook.mjs";
const read=p=>fs.readFileSync(new URL("../"+p,import.meta.url),"utf8");
const bytes=p=>fs.readFileSync(new URL("../"+p,import.meta.url));
test("AT-321 all 40 original PNGs, complete records and exact two photo panels",()=>{
 const source=[1,2,3,4].flatMap(n=>JSON.parse(read("assets/atlas/wild-zones/batch-0"+n+"-manifest.json")).records);
 assert.equal(wildZoneRecords.length,20);assert.equal(source.length,40);
 const maps=read("maps.html"),sectors=read("sector-maps.html");
 assert.equal((maps.match(/data-wz-fieldbook="/g)||[]).length,20);
 assert.equal((sectors.match(/data-wz-fieldbook="/g)||[]).length,20);
 const photoPaths=new Set();
 for(const z of wildZoneRecords){
   assert.equal(wildZoneRecord(z.number),z);assert.ok(z.area&&z.district);
   assert.ok(z.species.length>=6);assert.equal(new Set(z.species).size,z.species.length);
   assert.equal(z.photos.length,2);assert.deepEqual(z.photos.map(x=>x.kind),["overview","closeup"]);
   const markup=wildZoneFieldbookMarkup(z.number);
   assert.ok(maps.includes(markup),"Standalone markup drift: "+z.number);
   assert.ok(sectors.includes(markup),"Directory markup drift: "+z.number);
   assert.equal((markup.match(/<img /g)||[]).length,2);
   assert.ok(zoneSearchText(z.number).includes(z.species[0]));
   for(const p of z.photos){
     const f=source.find(x=>x.zone===z.number&&x.kind===p.kind);
     assert.equal(p.path,f.path);assert.equal(p.width,f.width);assert.equal(p.height,f.height);
     const b=bytes(p.path);assert.equal(b.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
     assert.equal(b.length,f.bytes);assert.equal(createHash("sha256").update(b).digest("hex"),f.sha256);
     assert.equal(b.readUInt32BE(16),1536);assert.equal(b.readUInt32BE(20),865);
     photoPaths.add(p.path);
   }
   assert.ok(z.fixedAlphas.every(a=>z.species.includes(a.name)));
 }
 assert.equal(photoPaths.size,40);
 assert.equal(wildZoneRecords.flatMap(z=>z.fixedAlphas).length,38);
 assert.equal(wildZoneRecord(20).species.length,15);assert.equal(wildZoneRecord(20).rotatingAlphas.length,67);
 assert.equal(wildZoneRecord(20).fixedAlphas.length,0);
 assert.equal(wildZoneFieldbookMarkup(21),"");assert.equal(wildZoneFieldbookMarkup("<script>"),"");
 assert.match(read("app.js"),/import\('\.\/wild-zone-fieldbook\.mjs'\)/);
 assert.match(read("atlas-explorer.js"),/wildZoneFieldbookMarkup\(item\.number\)/);
});
