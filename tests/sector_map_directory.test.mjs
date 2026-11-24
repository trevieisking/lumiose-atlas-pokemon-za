import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const page=read("sector-maps.html"),css=read("sector-maps.css"),script=read("sector-maps.js");
const city=read("maps.html"),template=read("src/template.html");
const evidence=JSON.parse(read("items-data.js").split("window.ATLAS_ITEM_EVIDENCE = ")[1].trim().replace(/;\s*$/,""));
const clean=s=>String(s).replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const items=evidence.zones.flatMap(z=>z.items);
assert.deepEqual(
 [evidence.sectors.length,evidence.zones.length,items.length,evidence.screws.length,evidence.metrics.confirmedItemPins,evidence.metrics.confirmedScrewPins],
 [48,20,264,100,0,0],"Recovery ledger metrics changed; check the source before reworking map references"
);
const positions=[...city.matchAll(/data-map-pin="(\d+)" data-pin-x="([\d.]+)" data-pin-y="([\d.]+)"/g)];
assert.equal(positions.length,20,"Existing city map pin count must be 20");
const byId=new Map(positions.map(m=>[Number(m[1]),[Number(m[2]),Number(m[3])]]));
for(const z of evidence.zones) {
 const pos=byId.get(z.number);
 assert.ok(pos, "Missing source city centre for Wild Zone "+z.number);
 assert.ok(page.includes('id="wildzone-'+z.number+'" data-zone-card'),"Missing Wild Zone card "+z.number);
 assert.ok(page.includes('href="#wildzone-'+z.number+'" data-zone-marker="'+z.number+'" style="left:'+pos[0]+'%;top:'+pos[1]+'%"'),"Wrong or invented centre coordinate "+z.number);
 const center=point=>(Math.max(0,Math.min(100,(point*2.5-50)/1.5))).toFixed(2)+"%";
 assert.ok(page.includes('aria-label="Magnified crop of saved Lumiose city overview near Wild Zone '+z.number+'; individual item coordinates are not verified" style="background-position:'+center(pos[0])+' '+center(pos[1])+'"'),"Zoom crop was not grounded in saved city centre "+z.number);
 assert.ok(page.includes('href="items.html#items-zone-'+z.number+'"'),"Missing matching Item Atlas zone link "+z.number);
 for(const item of z.items) {
  assert.ok(page.includes('href="items.html#item-'+clean(item.id)+'"'),"Unlinked original item ID "+item.id);
  assert.ok(page.includes(">"+clean(item.number)+"</a>"),"Lost numbered item source reference "+item.number);
  assert.ok(page.includes("<strong>"+clean(item.name)+"</strong>"),"Item name changed "+item.id);
  assert.ok(page.includes("<span>"+clean(item.hint)+"</span>"),"Item hint changed "+item.id);
 }
}
assert.equal((page.match(/class="city-zone-marker"/g)||[]).length,20);
assert.equal((page.match(/class="wildzone-card"/g)||[]).length,20);
assert.equal((page.match(/class="zone-item-lead"/g)||[]).length,264,"Preserve the 264 unique source item records");
const sectorItems=items.filter(item=>item.sector!==null);
assert.equal(sectorItems.length,23,"23 known-sector item clues, not 23 exact points");
assert.equal((page.match(/class="sector-item-lead"/g)||[]).length,23);
for(const s of evidence.sectors) {
 assert.ok(page.includes('id="sector-'+slug(s.id)+'" data-sector-card data-district="'+s.district+'"'),"Missing exact named sector "+s.id);
 assert.ok(page.includes("<h3>"+clean(s.id)+"</h3>"),"Wrong sector name "+s.id);
 assert.equal(s.mapAsset,null,"Original sector maps cannot be invented");
 assert.deepEqual(s.confirmedPins,[],"Original sector map pin evidence still missing");
}
assert.equal((page.match(/class="sector-card"/g)||[]).length,48);
const namedScrews=evidence.screws.filter(s=>s.sector!==null);
const unassigned=evidence.screws.filter(s=>s.sector===null);
assert.equal(namedScrews.length,51);
assert.equal(unassigned.length,49);
assert.equal((page.match(/class="sector-screw-lead"/g)||[]).length,51);
assert.equal((page.match(/class="unassigned-screw-lead"/g)||[]).length,49);
for(const screw of evidence.screws) {
 assert.ok(page.includes('href="items.html#item-screw-'+screw.number+'"'),"Missing exact source screw "+screw.number);
 assert.ok(page.includes('<strong>'+clean(screw.hint)+'</strong>'),"Screw clue changed "+screw.number);
 const number="✣ "+String(screw.number).padStart(3,"0");
 assert.ok(page.includes(">"+number+"</a>"),"Screw source number missing "+screw.number);
 assert.equal(screw.pin,null,"No exact screw pin can be claimed");
}
for(const d of ["Vert","Bleu","Magenta","Rouge","Jaune"])
 assert.ok(page.includes('id="district-'+slug(d)+'"'));
assert.match(page,/23 item listings and 51 Screw clues identify a particular sector/);
assert.match(page,/The remaining 49 Screw clues name only a district or landmark/);
assert.match(page,/48 sector names/);
assert.match(page,/not<\/strong> a physical numbered map marker/);
assert.match(page,/they are not numbered dots on this map/i);
const nav=page.match(/<nav class="atlas-article-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
const originalNav=template.match(/<nav id="sideNav">([\s\S]*?)<\/nav>/)?.[1];
assert.ok(nav&&originalNav);
assert.equal((nav.match(/<a /g)||[]).length,25,"All main menu links must remain available");
assert.equal(nav.replace(' aria-current="page"',"").trim(),originalNav.trim(),"Navigation must match overview exactly");
assert.match(nav,/href="index\.html#maps" aria-current="page"/);
assert.match(page,/← Back to walkthrough/);
assert.match(page,/id="atlasArticleFeedback"/);
assert.match(page,/Provenance: existing/);
assert.doesNotMatch(page,/\bdata-map-item\b|\bdata-confirmed-pin\b|type="checkbox"|service_role_key|sk-proj-|github_pat_/);
assert.doesNotMatch(script,/localStorage\.(setItem|removeItem|clear)|indexedDB|XMLHttpRequest|\bfetch\s*\(/);
assert.match(script,/localStorage\.getItem\(KEY\)/);
assert.match(css,/@media\(max-width:450px\)/);
assert.match(css,/min-height:44px/);
for(const m of page.matchAll(/href="([^"]+)"/g)) {
 const url=m[1];if(url.startsWith("#")||url.startsWith("http"))continue;
 const path=url.split("#")[0].split("?")[0];
 if(path)assert.ok(existsSync(new URL("../"+path,import.meta.url)),"Missing local destination "+url);
}
for(const m of page.matchAll(/<img[^>]*src="([^"]+)"/g))
 assert.ok(existsSync(new URL("../"+m[1],import.meta.url)),"Missing local image "+m[1]);

// Exercise search, district filtering, read-only existing checkmarks and deep-link reveal.
const events={};let readCount=0,writeCount=0;
const mk=(dataset={},textContent="")=>{
 const styles=new Set(),listeners={},children={};
 return {dataset,textContent,hidden:false,open:false,value:"",listeners,children,
  setAttribute(name,value){this[name]=value},
  addEventListener(name,cb){listeners[name]=cb},
  querySelector(selector){return children[selector]||null},
  querySelectorAll(selector){return children[selector]||[]},
  scrollIntoView(){this.scrolled=true},
  classList:{toggle(name,show){if(show)styles.add(name);else styles.delete(name)},contains(name){return styles.has(name)}}
 };
};
const sectors=evidence.sectors.map(s=>mk({district:s.district,search:s.id.toLowerCase()},s.id));
const zones=evidence.zones.map(z=>mk({district:z.district,zone:String(z.number),search:("wild zone "+z.number+" "+z.district).toLowerCase()},"Wild Zone "+z.number));
const districtOrder=["Vert","Bleu","Magenta","Rouge","Jaune"];
const groups=districtOrder.map(d=>{
 const el=mk({districtGroup:d});el.children["[data-sector-card]"]=sectors.filter(s=>s.dataset.district===d);return el;
});
const loose=districtOrder.map(d=>{
 const el=mk({looseGroup:d});el.children[".unassigned-screw-lead"]=unassigned.filter(s=>s.district===d).map(s=>mk({},'✣ '+String(s.number).padStart(3,"0")+" "+s.hint));
 return el;
});
const markers=evidence.zones.map(z=>mk({zoneMarker:String(z.number)}));
const buttons=["All",...districtOrder].map(d=>mk({atlasDistrict:d}));
const search=mk(),status=mk(),empty=mk();
const itemRow=mk({progressItem:"1-3"}),screwRow=mk({progressScrew:"7"});
itemRow.children["[data-read-state]"]=mk();screwRow.children["[data-read-state]"]=mk();
let activeHash="";
const lookup=new Map();
sectors.forEach((el,i)=>lookup.set("sector-"+slug(evidence.sectors[i].id),el));
zones.forEach((el,i)=>lookup.set("wildzone-"+evidence.zones[i].number,el));
for(const el of [...sectors,...zones])el.children["details"]=mk();
const named={mapAtlasSearch:search,mapAtlasCount:status,mapAtlasEmpty:empty};
const document={
 querySelectorAll(sel){return ({
 "[data-sector-card]":sectors,"[data-zone-card]":zones,"[data-district-group]":groups,
 "[data-loose-group]":loose,"[data-zone-marker]":markers,"[data-atlas-district]":buttons,
 "[data-progress-item],[data-progress-screw]":[itemRow,screwRow]})[sel]||[];},
 getElementById(id){return named[id]||lookup.get(id)||null}
};
const window={addEventListener(name,cb){events[name]=cb}};
const localStorage={getItem(key){assert.equal(key,"lumiose-atlas-reconstruction-v1");readCount++;return JSON.stringify({pickup:{"1-3":true},screw:{"7":true},check:{"1":true}});},setItem(){writeCount++;throw Error("read-only")} };
runInNewContext(script,{document,window,localStorage,location:{get hash(){return activeHash}},requestAnimationFrame(fn){fn()},JSON,Number,String,Array});
assert.equal(status.textContent,"48 of 48 sectors · 20 of 20 Wild Zones · 49 of 49 district-only Screw leads");
assert.equal(itemRow.classList.contains("is-collected"),true);
assert.equal(screwRow.classList.contains("is-collected"),true);
assert.equal(writeCount,0);
buttons[2].listeners.click(); // Bleu
assert.equal(status.textContent,"10 of 48 sectors · 4 of 20 Wild Zones · 7 of 49 district-only Screw leads");
buttons[0].listeners.click();
search.value="wild zone 1";search.listeners.input();
assert.equal(zones[0].hidden,false);
assert.equal(zones[1].hidden,true);
activeHash="#wildzone-20";events.hashchange();
assert.equal(zones[19].children.details.open,true);
assert.equal(zones[19].scrolled,true);
assert.equal(search.value,"");
assert.equal(readCount,1,"Filtering and navigation must not need repeated storage access");
assert.equal(writeCount,0);
console.log("PASS: 48 sector names, 20 original map centres and previews, 264 numbered item records, 100 exact Screw clues, zero invented item pins, 25-link menu and read-only mobile controls.");

// AT-302: source-image orientation only; nothing becomes a point or sector polygon.
const at302Source=JSON.parse(read("MAPS_BORDERLESS_SOURCE_REGISTER_2026-11-24.json"));
assert.equal(at302Source.sector_orientation.length,12);
assert.equal((page.match(/class="sector-orientation-note"/g)||[]).length,12);
for(const source of at302Source.sector_orientation){
 assert.equal(source.native_label_xy,null);
 assert.ok(at302Source.crop_records.some(c=>c.id===source.crop_id));
 const name="sector-"+source.sector_id;
 const start=page.indexOf('<article class="sector-card" id="'+name+'"');
 assert.ok(start>=0,"No card "+name);
 const end=page.indexOf("</article>",start);
 assert.ok(end>start);
 const card=page.slice(start,end);
 assert.ok(card.includes('class="sector-orientation-note" data-at302-crop="'+source.crop_id+'"'));
 assert.ok(card.includes(clean(source.orientation)),"Changed source wording for "+name);
 assert.match(card,/exact sector boundaries, lift entrances, roof exits and pickup coordinates remain unverified/);
}
assert.ok(!page.includes('src="assets/atlas/at301/'),"Do not link unhosted PNGs");


// AT-304: 42 real PNGs and 48 source cards.
const at304=JSON.parse(read("MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json"));
assert.equal(at304.images.length,42);
assert.equal(at304.sector_coverage.length,48);
assert.equal((page.match(/class="sector-source-map"/g)||[]).length,48);
assert.equal((page.match(/class="sector-source-pending"/g)||[]).length,0);
assert.equal((page.match(/class="street-source-row"/g)||[]).length,8);
assert.ok(page.includes('id="street-photo-index"'));
for(const entry of at304.sector_coverage){
  const start=page.indexOf('<article class="sector-card" id="sector-'+entry.sector_id+'"');
  assert.ok(start>=0,"Missing old source card "+entry.sector_id);
  const end=page.indexOf("</article>",start);
  assert.ok(end>start);
  const card=page.slice(start,end);
  if(entry.source_crop_id){
    const image=at304.images.find(x=>x.id===entry.source_crop_id);
    assert.ok(image,"Missing source file metadata");
    assert.ok(existsSync(new URL("../"+image.path,import.meta.url)),"PNG not physically hosted "+image.path);
    assert.ok(card.includes('class="sector-source-map" data-at304-crop="'+image.id+'"'));
    assert.ok(card.includes('src="'+image.path+'"'),"Broken sector crop "+entry.sector_id);
    assert.ok(card.includes("Orientation reference only; not a measured sector boundary"));
  }else{
    assert.ok(card.includes('data-at304-source-status="needs_source_image"'),"Missing source TODO "+entry.sector_id);
    assert.ok(!card.includes('class="sector-source-map"'),"Invented source photo on "+entry.sector_id);
  }
}


// AT-305: published photo library release evidence stays synchronized without changing map geometry.
const atlasPublished=JSON.parse(read("MAPS_UPGRADE_MANIFEST.json"));
const atlasPhotoLibrary=JSON.parse(read("MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json"));
assert.ok(atlasPublished.revision>=52);
assert.equal(atlasPublished.id,"ATLAS-MAPS-2026-11-21-V1");
assert.equal(atlasPublished.at_304_original_sector_street_image_library.status,"github_deployed_original_png_references_workspace_open");
assert.equal(atlasPhotoLibrary.status,"at310_branch_complete_pending_release");
assert.equal(atlasPhotoLibrary.release.reviewed_head,"d16bb3c62bb7e9090f49874f28914268cb907e11");
assert.equal(atlasPhotoLibrary.release.reviewed_tree,atlasPhotoLibrary.release.merged_tree);
assert.equal(atlasPhotoLibrary.release.merged_main,"50643822a6a6f47f3eb643f2595cb9a28c5f5a11");
assert.equal(atlasPhotoLibrary.release.pages_run,45466461743);
assert.equal(atlasPhotoLibrary.release.pages_conclusion,"success");
assert.equal(atlasPhotoLibrary.counts.image_crops,42);
assert.equal(atlasPhotoLibrary.counts.sectors_with_photographic_references,48);
assert.equal(atlasPhotoLibrary.missing_sector_ids.length,0);
assert.equal(atlasPhotoLibrary.counts.geographically_registered_tiles,0);
assert.equal(atlasPhotoLibrary.counts.geographic_sector_label_anchors,0);
assert.equal(atlasPhotoLibrary.release.original_workspace,"not_changed");


// AT-310: preserve both intake batches and link their actual image files.
const at306=JSON.parse(read("MAPS_AT306_SOURCE_RECOVERY_2026-11-24.json"));
assert.equal(at306.accepted.length,11);
assert.equal((page.match(/class="sector-at306-orientation"/g)||[]).length,19,"Eleven AT-306 + eight AT-309 source notes use the same existing orientation style");
for(const row of at306.accepted){
 const id="sector-"+row.sector_id;
 const start=page.indexOf('<article class="sector-card" id="'+id+'"');
 assert.ok(start>=0,"AT-306 missing old sector "+id);
 const end=page.indexOf("</article>",start);
 assert.ok(end>start);
 const card=page.slice(start,end);
 assert.ok(card.includes('class="sector-at306-orientation" data-at306-source="'+row.sector_id+'"'));
 assert.ok(card.includes(clean(row.orientation_text)));
 assert.ok(card.includes('<img src="'+row.expected_future_asset_path+'"'),"Missing verified asset link "+id);
}
for(const row of at306.excluded){
 const start=page.indexOf('id="sector-'+row.sector_id+'"');
 const end=page.indexOf("</article>",start);
 assert.ok(start>=0&&end>start);
 assert.ok(!page.slice(start,end).includes('data-at306-candidate='),"Rejected crop must not be promoted");
}


// AT-310: the last eight original source crops are also linked.
const at309=JSON.parse(read("MAPS_AT309_OWNER_SOURCE_48_SECTORS_2026-11-24.json"));
assert.equal(at309.accepted.length,8);
assert.equal(at309.counts.published_sector_photo_coverage,29);
assert.equal(at309.counts.total_source_sector_coverage_after_previous_unhosted_and_current,48);
assert.equal((page.match(/data-at309-source="/g)||[]).length,8);
for(const row of at309.accepted){
 const start=page.indexOf('id="sector-'+row.sector_id+'"');
 const end=page.indexOf("</article>",start);assert.ok(start>=0&&end>start);
 const section=page.slice(start,end);
 assert.ok(section.includes('data-at309-source="'+row.sector_id+'"'));
 assert.ok(section.includes(row.orientation_text));
 assert.ok(section.includes('<img src="'+row.expected_future_asset_path+'"'));
}
