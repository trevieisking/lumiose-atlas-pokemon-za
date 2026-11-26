/* Real browser proof for shared areas. Synthetic boundary fixtures are confined
 * to request interception in an isolated browser context, never production. */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
import {AREA_MAP} from "../atlas-area-model.mjs";
import {wildZoneRecord} from "../wild-zone-fieldbook.mjs";

const base="http://127.0.0.1:18769",output="test-artifacts/atlas-areas";
const key="lumiose-atlas-reconstruction-v1";
const saved=JSON.stringify({check:{"1":true},sideCheck:{"61":true},legendCheck:{},pickup:{"2-5":true},screw:{"29":true},preservedFutureField:{untouched:"AT339 synthetic browser state"}});
const register=JSON.parse(fs.readFileSync("atlas-area-evidence.json","utf8"));
const productionIds=(register.geometries||[]).filter(row=>row.status==="approved").map(row=>row.area_id);
const proof={scope:"AT-339 shared areas and habitats",productionBoundaryIds:productionIds,devices:[],syntheticFixtureOnly:true};
const fixture={schemaVersion:1,map:AREA_MAP,areas:[{area_id:"wz-01",encounters:[{
  id:"fixture-source-navigation",species:"Pidgey",encounter_class:"ordinary",evidence_status:"source_corroborated",
  sources:[
    {url:"https://www.serebii.net/legendsz-a/wildzones.shtml",claim:"Synthetic written citation display check."},
    {path:"docs/qa/fixture-only-written-record.md",claim:"Synthetic local Markdown citation display check."}
  ]
}]}],geometries:[{
  area_id:"wz-01",kind:"zone",status:"approved",coordinateSpace:"atlas-native-pixels",mapSha256:AREA_MAP.sha256,
  geometry:{type:"Polygon",coordinates:[[[700,700],[1220,700],[1220,1220],[700,1220],[700,700]]]},
  sources:[{path:AREA_MAP.path,sha256:AREA_MAP.sha256,claim:"Synthetic browser fixture only; not geographic evidence"}],
  registration:{method:"Synthetic browser test",control_count:4,holdout_count:2,max_error_px:0,uncertainty_px:1,threshold_px:2},
  review:{boundary:true,registration:true,independent:true,occlusion:true}
}]};
const itemSandbox={window:{}};
vm.runInNewContext(fs.readFileSync("items-data.js","utf8"),itemSandbox);
const itemEvidence=JSON.parse(JSON.stringify(itemSandbox.window.ATLAS_ITEM_EVIDENCE));
const fixtureItem=itemEvidence.zones[0].items[0];
fixtureItem.kind="landmark";
const collectibleId="item:"+fixtureItem.id;
const collectibleRegister={...JSON.parse(fs.readFileSync("atlas-collectibles-data.json","utf8")),placements:[{
  id:collectibleId,originalId:fixtureItem.id,kind:"item",physicalId:"synthetic-area-overlap-only",
  pickupType:"fixed",coordinateSpace:"atlas-native-pixels",mapSha256:AREA_MAP.sha256,xy:[1200,960],
  scene:"ground",floor:"Ground level",directions:["Synthetic coexistence test only."],unlock:"Synthetic test only.",
  sources:[{reference:"docs/qa/synthetic-test-evidence.json",observedOn:"2026-11-26",evidence:"Synthetic boundary/collectible overlap fixture only."}],
  photos:[],verification:{identity:true,position:true,scene:true,floor:true,route:true,source:true}
}]};
fs.mkdirSync(output,{recursive:true});
const server=spawn("python3",["-m","http.server","18769","--bind","127.0.0.1"],{stdio:"ignore"});
let browser;
try{
  let ready=false;for(let i=0;i<40;i++){try{if((await fetch(base+"/atlas-explorer.html")).ok){ready=true;break;}}catch{}await pause(150);}
  assert.ok(ready,"Local fixture server must be ready");
  browser=await chromium.launch({...(process.env.ATLAS_CHROME_EXECUTABLE?{executablePath:process.env.ATLAS_CHROME_EXECUTABLE}:{channel:"chrome"}),headless:true,args:["--no-sandbox"]});
  for(const [device,width,height] of [["phone",393,852],["desktop",1440,900]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:device==="phone",hasTouch:device==="phone",deviceScaleFactor:1});
    await context.addInitScript(({key,saved})=>{
      if(localStorage.getItem(key)===null)localStorage.setItem(key,saved);
      window.__areaStorageWrites=[];
      for(const method of ["setItem","removeItem","clear"]){const original=Storage.prototype[method];Storage.prototype[method]=function(...args){window.__areaStorageWrites.push([method,...args]);return original.apply(this,args);};}
    },{key,saved});
    const page=await context.newPage(),errors=[],approvedZoneRenders=[];
    page.on("pageerror",error=>errors.push(String(error)));
    async function panel(){
      const host=page.locator("[data-area-panel]");await host.waitFor({state:"attached"});
      const drawer=host.locator("details[data-area-drawer]");
      if(!await drawer.evaluate(el=>el.open))await drawer.locator(":scope > summary").click();
      return host;
    }
    async function areaIds(){return page.locator("[data-area-results] button[data-area-id]").evaluateAll(nodes=>nodes.map(node=>node.dataset.areaId));}
    async function unchanged(){
      assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),saved,"Exact original progress bytes must survive");
      assert.deepEqual(await page.evaluate(()=>window.__areaStorageWrites),[],"Habitat controls must never write player progress");
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,"No page-width overflow");
    }
    async function explorerSelection(id){
      const title=id?"Wild Zone "+id.slice(3):"Select a map pin or place";
      await page.waitForFunction(title=>document.querySelector("#aeSelected > h3")?.textContent===title,title);
      const pins=page.locator('#aeMapPins .ae-pin[aria-pressed="true"]');
      assert.equal(await pins.count(),id?1:0,"Legacy pin selection follows the shared area and history");
      const rows=page.locator('#aeResults [data-record-id][aria-pressed="true"]');
      assert.equal(await rows.count(),id?1:0,"Legacy directory selection follows the shared area and history");
      if(id){
        assert.equal(await rows.getAttribute("data-record-id"),id);
        assert.ok(await pins.isVisible(),"A selected legacy zone pin must be visible");
        assert.match(await pins.getAttribute("aria-label"),new RegExp(title));
      }
    }
    async function unobstructedFixturePoint(){
      return page.locator("[data-area-overlay]").evaluate(svg=>{
        const viewport=document.getElementById("aeViewport"),rect=viewport.getBoundingClientRect();
        const matrix=svg.getScreenCTM();if(!matrix)throw Error("Synthetic boundary has no screen transform");
        const inverse=matrix.inverse(),margin=12;
        const controls=[...viewport.querySelectorAll("button,a,input,select,textarea")].map(node=>({node,box:node.getBoundingClientRect()}))
          .filter(({node,box})=>box.width&&box.height&&getComputedStyle(node).visibility!=="hidden"&&box.right>Math.max(rect.left,0)&&box.left<Math.min(rect.right,innerWidth)&&box.bottom>Math.max(rect.top,0)&&box.top<Math.min(rect.bottom,innerHeight));
        let best=null;
        // A point just outside a round pin can be rounded/adjusted onto that pin
        // by real touch input. Keep a CSS-pixel gap from every visible control.
        for(let x=750;x<=1150;x+=50)for(let y=750;y<=1150;y+=50){
          const p=svg.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(matrix);
          q.x=Math.round(q.x);q.y=Math.round(q.y);const native=q.matrixTransform(inverse);
          const target=document.elementFromPoint(q.x,q.y);
          if(q.x<=Math.max(rect.left+15,margin)||q.x>=Math.min(rect.right-70,innerWidth-margin)||q.y<=Math.max(rect.top+15,margin)||q.y>=Math.min(rect.bottom-45,innerHeight-margin)||native.x<=700||native.x>=1220||native.y<=700||native.y>=1220||!target||!viewport.contains(target)||target.closest("button,a,input,select,textarea"))continue;
          const clearance=Math.min(...controls.map(({box})=>Math.hypot(Math.max(box.left-q.x,0,q.x-box.right),Math.max(box.top-q.y,0,q.y-box.bottom))));
          if(clearance>=margin&&(!best||clearance>best.clearance))best={x:q.x,y:q.y,native:[native.x,native.y],clearance};
        }
        if(best)return best;
        throw Error("No visible point inside the synthetic boundary has 12px clearance from map controls");
      });
    }
    async function tap(point){
      if(device==="phone")await page.touchscreen.tap(point.x,point.y);
      else await page.mouse.click(point.x,point.y);
    }
    async function drag(point){
      if(device!=="phone"){
        await page.mouse.move(point.x,point.y);await page.mouse.down();
        await page.mouse.move(point.x+55,point.y+30,{steps:8});await page.mouse.up();return;
      }
      const session=await context.newCDPSession(page),p=(x,y)=>({x:Math.round(x),y:Math.round(y),id:1});
      try{
        await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[p(point.x,point.y)]});
        for(let i=1;i<=8;i++)await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[p(point.x+55*i/8,point.y+30*i/8)]});
        await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }finally{await session.detach();}
    }

    for(const [surface,url] of [["explorer","atlas-explorer.html?source=at339"],["standalone","maps.html?source=at339#wild-zone-2"],["sectors","sector-maps.html?source=at339#wildzone-2"],["main","index.html?source=at339#maps"]]){
      await page.goto(base+"/"+url,{waitUntil:"load"});
      const host=await panel();
      assert.equal(await page.locator("[data-area-overlay]").count(),1,"One shared overlay per existing map");
      assert.deepEqual((await page.locator("[data-area-boundary]").evaluateAll(nodes=>nodes.map(n=>n.dataset.areaBoundary))).sort(),[...productionIds].sort());
      if(surface==="standalone")assert.equal(await page.locator("#mapZoomImage").getAttribute("data-selected-zone"),"2","Legacy zone fragment preserved");
      await host.locator("[data-area-search]").fill("Pidgey");
      if(device==="phone"){
        // Capture the actual mobile controls before a result selection scrolls
        // into its detail, independently of the habitat/result evidence below.
        const controls=host.locator(".aa-controls");
        await controls.scrollIntoViewIfNeeded();
        await controls.screenshot({path:output+"/at339-"+surface+"-controls-phone.png"});
      }
      await host.locator('[data-species-results] button[data-species-id="pidgey"]').click();
      const pidgey=await areaIds();assert.ok(pidgey.includes("wz-01")&&pidgey.includes("wz-05"),"All preserved Pidgey habitats are reachable");
      await host.locator("[data-area-class]").selectOption("fixed_alpha");
      assert.deepEqual(await areaIds(),["wz-01"],"Fixed Alpha Pidgey must not borrow another zone's ordinary roster");
      const locations=await host.locator('[data-area-detail] [data-encounter-area]').evaluateAll(nodes=>nodes.map(node=>({id:node.dataset.encounterArea,text:node.textContent})));
      assert.ok(locations.length>0,"Fixed Alpha Pidgey exposes its encounter-area attribution");
      for(const row of locations)assert.deepEqual(row,{id:"wz-01",text:"Area: Wild Zone 01"},"Every displayed condition identifies its own encounter area by its preserved source name");
      assert.equal(new URL(page.url()).searchParams.get("source"),"at339","Unrelated query preserved");
      await host.screenshot({path:output+"/at339-"+surface+"-habitats-"+device+".png"});
      await host.locator("[data-area-clear]").click();
      assert.equal((await areaIds()).length,68,"Clear restores all original area identities");
      const mapSelector={explorer:"#aeViewport",standalone:"#mapCity",sectors:".sector-city-map",main:"#atlasMap"}[surface];
      await page.locator(mapSelector).scrollIntoViewIfNeeded();
      await page.locator(mapSelector).screenshot({path:output+"/at339-measured-"+surface+"-"+device+".png"});
      await host.locator('[data-area-results] button[data-area-id="vert-sector-1"]').click();
      assert.match(await host.locator("[data-area-detail]").textContent(),/named sector area|overlap at different heights/i);
      assert.equal(await page.locator('[data-area-boundary="vert-sector-1"].is-active').count(),1,"Only the separately reviewed source footprint supplies a sector outline");
      assert.ok(await host.locator('[data-area-detail] a[href="assets/atlas/sector-streets/vert/vert-1-saison-canal.png"]').count()>0,"Original photograph retained");
      assert.ok((await host.locator('.aa-source-notes').allTextContents()).join(' ').includes('pokemaps.net'),"Written reference attribution stays visible");
      assert.deepEqual(await host.locator('.aa-source-notes a').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')).filter(href=>/^https?:|^\/\/|\.md(?:[?#]|$)/i.test(href))),[],"Evidence links keep player navigation inside Atlas guide/assets rather than external sites or raw Markdown");
      await host.locator("[data-area-clear]").click();
      await host.locator('[data-area-results] button[data-area-id="wz-01"]').click();
      await host.locator("[data-area-clear]").click();
      await host.locator('[data-area-results] button[data-area-id="wz-20"]').click();
      assert.ok((await host.locator("[data-area-detail]").textContent()).includes("Wild Zone 20"));
      await page.goBack();await page.waitForFunction(()=>!new URL(location.href).searchParams.has("area"));
      await page.goForward();await page.waitForFunction(()=>new URL(location.href).searchParams.get("area")==="wz-20");
      await page.reload({waitUntil:"load"});await panel();
      assert.match(await page.locator("[data-area-detail]").textContent(),/Wild Zone 20/);
      if(surface!=="explorer"){
        const selector=surface==="standalone"?'[data-map-pin="2"]':surface==="sectors"?'[data-zone-marker="2"]':'#atlasMap button[data-select-zone="2"]';
        await page.locator(selector).click();
        await page.waitForFunction(()=>new URL(location.href).searchParams.get("area")==="wz-02");
        await page.reload({waitUntil:"load"});await panel();
        assert.equal(await page.locator("[data-area-detail] > h4").first().textContent(),"Wild Zone 02","Original marker selection must survive reload");
        assert.equal(await page.locator('[data-area-results] [data-area-id="wz-02"]').getAttribute('aria-pressed'),'true');
        if(surface==="standalone"){
          await page.locator("#mapSearch").fill("Wild Zone 20");
          await page.waitForFunction(()=>!new URL(location.href).searchParams.has("area"));
          await page.reload({waitUntil:"load"});await panel();
          assert.match(await page.locator("[data-area-detail]").textContent(),/Choose an area or Pok/);
        }
      }
      await unchanged();
    }

    // Shared selections must reveal an area hidden by the legacy directory,
    // without clearing a legacy filter that already includes the selected area.
    await page.goto(base+"/maps.html?source=filter-sync#wild-zone-5",{waitUntil:"load"});
    const standaloneSync=await panel();
    await page.locator('[data-district-filter="Bleu"]').click();
    assert.equal(await page.locator('[data-map-pin="2"]').isVisible(),false);
    await standaloneSync.locator('[data-area-clear]').click();
    await standaloneSync.locator('[data-area-results] [data-area-id="wz-02"]').click();
    assert.ok(await page.locator('[data-map-pin="2"]').isVisible());
    assert.ok(await page.locator('[data-map-zone-button="2"]').isVisible());
    assert.equal(await page.locator('[data-district-filter="All"]').getAttribute("aria-pressed"),"true");
    assert.equal(await page.locator("#mapZoomImage").getAttribute("data-selected-zone"),"2");
    await page.locator('[data-district-filter="Vert"]').click();
    await standaloneSync.locator('[data-area-clear]').click();
    await standaloneSync.locator('[data-area-results] [data-area-id="wz-02"]').click();
    assert.equal(await page.locator('[data-district-filter="Vert"]').getAttribute("aria-pressed"),"true","Compatible original filters remain selected");
    await page.locator("#mapSearch").fill("Wild Zone 20");
    await standaloneSync.locator('[data-area-results] [data-area-id="wz-03"]').click();
    assert.equal(await page.locator("#mapSearch").inputValue(),"","An incompatible original search is cleared when the shared directory selects an area");
    assert.ok(await page.locator('[data-map-pin="3"]').isVisible());
    assert.equal(new URL(page.url()).searchParams.get("source"),"filter-sync");
    await unchanged();

    // The Explorer's original details, selected pin and directory must follow
    // shared clear/selection/history while routes and collectibles retain state.
    await page.goto(base+"/atlas-explorer.html?place=wz-02&collectible=screw%3A29&source=selection-sync",{waitUntil:"load"});
    const explorerSync=await panel();
    await explorerSelection("wz-02");
    await page.locator('#aeCollectibleDetail [data-collectible-progress]').waitFor({state:"attached"});
    const collectibleTitle=await page.locator("#aeCollectibleDetail > h3").textContent();
    await page.locator("#aeRouteSelect").selectOption("cafe-cyclone");
    await page.locator("#aeNextStep").click();
    const routeProgress=await page.locator("#aeRouteProgress").textContent();
    await page.locator('.ae-filters [data-kind="holovator"]').click();
    await page.locator("#aeSearch").fill("Café Cyclone");
    await explorerSync.locator('[data-area-clear]').click();
    await explorerSelection(null);
    await explorerSync.locator('[data-area-results] [data-area-id="wz-03"]').click();
    await explorerSelection("wz-03");
    assert.equal(await page.locator("#aeSearch").inputValue(),"","Shared Explorer selection reveals a formerly filtered area");
    await page.locator("#aeSearch").fill("Wild Zone");
    await page.goBack();await explorerSelection(null);
    await page.goBack();await explorerSelection("wz-02");
    await page.goForward();await explorerSelection(null);
    await page.goForward();await explorerSelection("wz-03");
    assert.equal(await page.locator("#aeSearch").inputValue(),"Wild Zone","Compatible Explorer filters survive history restoration");
    assert.equal(await page.locator("#aeRouteSelect").inputValue(),"cafe-cyclone");
    assert.equal(await page.locator("#aeRouteProgress").textContent(),routeProgress,"Area restoration does not reset the independent route cursor");
    assert.equal(await page.locator("#aeCollectibleDetail > h3").textContent(),collectibleTitle);
    assert.equal(new URL(page.url()).searchParams.get("collectible"),"screw:29");
    assert.equal(new URL(page.url()).searchParams.get("source"),"selection-sync");
    await unchanged();

    // Once loaded, an explicit Holovator choice must supersede the old area
    // exactly as it does during delayed startup. A later shared render cannot
    // restore the old zone or replace the chosen photograph/route cursor.
    await page.goto(base+"/atlas-explorer.html?area=wz-02&collectible=screw%3A29&source=access-selection",{waitUntil:"load"});
    const accessPanel=await panel();await explorerSelection("wz-02");
    await page.locator('#aeFilters [data-kind="holovator"]').click();
    await page.locator('#aeResults [data-record-id="vert-cyclone"]').click();
    const accessTitle=await page.locator('#aeSelected > h3').textContent();
    const accessPhoto=await page.locator('#aeSelected img').first().elementHandle();
    assert.ok(accessPhoto,"The selected access record retains its original photograph");
    await page.locator('#aeNextStep').click();
    const accessProgress=await page.locator('#aeRouteProgress').textContent();
    assert.equal(new URL(page.url()).searchParams.get('area'),null,"Explicit non-area selection clears the superseded area query");
    await accessPanel.locator('[data-area-boundaries]').uncheck();
    await accessPanel.locator('[data-area-boundaries]').check();
    await accessPanel.locator('[data-area-search]').fill('Pidgey');
    assert.equal(await page.locator('#aeSelected > h3').textContent(),accessTitle);
    assert.equal(await page.locator('#aeResults [data-record-id="vert-cyclone"]').getAttribute('aria-pressed'),'true');
    assert.equal(await accessPhoto.evaluate(node=>node.isConnected&&node===document.querySelector('#aeSelected img')),true);
    assert.equal(await page.locator('#aeRouteProgress').textContent(),accessProgress);
    assert.equal(new URL(page.url()).searchParams.get('collectible'),'screw:29');
    await accessPhoto.dispose();await unchanged();

    // Original map controls remain authoritative while optional evidence is
    // pending. The latest history entry must also supersede any queued click.
    for(const action of ["clear","switch","clear-back"]){
      let release;
      const evidenceReady=new Promise(resolve=>{release=resolve;});
      const holdEvidence=async route=>{await evidenceReady;await route.continue();};
      await page.route("**/atlas-area-evidence.json",holdEvidence);
      const source="at339-pending-"+action,initial=base+"/maps.html?source="+source+"&keep=original&area=wz-20#wild-zone-20";
      const cleared=base+"/maps.html?source="+source+"&keep=original";
      const switched=base+"/maps.html?source="+source+"&keep=original&area=wz-01#wild-zone-1";
      const changed=action==="switch"?switched:cleared;
      try{
        await page.goto(initial,{waitUntil:"load"});
        await page.waitForFunction(()=>document.getElementById("mapZoomImage")?.dataset.selectedZone==="20");
        assert.equal(await page.locator('[data-area-panel]').count(),0,"The optional area module is still loading");
        if(action==="switch")await page.locator('[data-map-zone-button="1"]').click();
        else await page.locator("#mapSearch").fill("not-a-real-pending-species");
        await page.waitForURL(changed);
        if(action==="clear-back"){
          await page.goBack();await page.waitForURL(initial);
          await page.waitForFunction(()=>document.getElementById("mapZoomImage")?.dataset.selectedZone==="20");
        }
        release();const host=await panel();
        const selected=action==="clear-back"?"20":action==="switch"?"1":"";
        await page.waitForFunction(selected=>document.getElementById("mapZoomImage")?.dataset.selectedZone===selected,selected);
        assert.equal(page.url(),action==="clear-back"?initial:changed,"Shared initialization must preserve the latest original-control or history intent");
        assert.equal(await page.locator('[data-map-zone-detail]:visible').count(),selected?1:0);
        if(selected)assert.equal(await host.locator('[data-area-id="wz-'+selected.padStart(2,"0")+'"]').getAttribute("aria-pressed"),"true");
        else assert.equal(await host.locator('[data-area-results] [aria-pressed="true"]').count(),0);
        // Exact one-step traversal catches duplicate entries without depending
        // on the browser's finite retained-history length in this long suite.
        if(action!=="clear-back"){
          await page.goBack();await page.waitForURL(initial);
          await page.waitForFunction(()=>document.getElementById("mapZoomImage")?.dataset.selectedZone==="20");
        }
        await page.goForward();await page.waitForURL(changed);
        await page.waitForFunction(selected=>document.getElementById("mapZoomImage")?.dataset.selectedZone===selected,action==="switch"?"1":"");
        assert.equal(new URL(page.url()).searchParams.get("keep"),"original");
        await unchanged();
      }finally{release();await page.unroute("**/atlas-area-evidence.json",holdEvidence);}
    }

    // Main-map choices replace the current URL immediately. On late startup,
    // retain a newer original choice, reconcile only incompatible shared filters,
    // and let a subsequent Back to an empty selection take precedence.
    for(const action of ["empty","filtered","back"]){
      let release;
      const evidenceReady=new Promise(resolve=>{release=resolve;});
      const holdEvidence=async route=>{await evidenceReady;await route.continue();};
      await page.route("**/atlas-area-evidence.json",holdEvidence);
      const source="pending-main-"+action;
      const empty=base+"/index.html?source="+source+"&keep=1#maps";
      const initial=action==="empty"?empty:base+"/index.html?source="+source+"&keep=1&area=wz-02"+(action==="filtered"?"&habitat_q=Wild%20Zone%202&habitat_district=Centrico&encounter=trade":"")+"#maps";
      try{
        await page.goto(initial,{waitUntil:"load"});
        assert.equal(await page.locator('[data-area-panel]').count(),0);
        if(action==="back")await page.evaluate(({empty,initial})=>{
          history.replaceState(history.state,"",empty);
          history.pushState(history.state,"",initial);
        },{empty,initial});
        await page.locator('#mapZones [data-select-zone="3"]').click();
        await page.waitForFunction(()=>document.querySelector("#mapZoneDetail > .rebuild-zone-detail > h3")?.textContent==="Wild Zone 03");
        assert.equal(new URL(page.url()).searchParams.get("area"),"wz-03","Original main-map choice updates its shared URL before evidence arrives");
        assert.equal(new URL(page.url()).hash,"#maps");
        assert.equal(await page.locator('[data-area-panel]').count(),0);
        if(action==="back"){
          await page.goBack();await page.waitForURL(empty);
        }
        release();const host=await panel();
        if(action==="back"){
          assert.equal(page.url(),empty,"Late initialization must not replay a choice superseded by Back");
          assert.equal(await page.locator("#mapZoneDetail > .rebuild-zone-detail > h3").count(),0);
          assert.equal(await host.locator('[data-area-results] [aria-pressed="true"]').count(),0);
          await page.goForward();await page.waitForURL(url=>url.searchParams.get("area")==="wz-03");
        }
        assert.equal(await page.locator("#mapZoneDetail > .rebuild-zone-detail > h3").textContent(),"Wild Zone 03");
        assert.equal(await host.locator('[data-area-results] [data-area-id="wz-03"]').getAttribute("aria-pressed"),"true");
        assert.deepEqual(await areaIds(),["wz-03"]);
        const final=new URL(page.url());
        assert.equal(final.searchParams.get("area"),"wz-03");
        assert.equal(final.searchParams.get("source"),source);assert.equal(final.searchParams.get("keep"),"1");
        assert.equal(final.hash,"#maps");
        for(const key of ["habitat_q","habitat_district","encounter"])assert.equal(final.searchParams.has(key),false,"Late reconciliation removes the incompatible "+key+" filter");
        await unchanged();
      }finally{release();await page.unroute("**/atlas-area-evidence.json",holdEvidence);}
    }

    // Genuine sector-directory anchors keep a matching shared query and their
    // original fragment in one history entry, even before the optional model.
    for(const action of ["zone","zone-back","sector"]){
      let release;
      const evidenceReady=new Promise(resolve=>{release=resolve;});
      const holdEvidence=async route=>{await evidenceReady;await route.continue();};
      await page.route("**/atlas-area-evidence.json",holdEvidence);
      const source="pending-sectors-"+action,area=action==="sector"?"vert-sector-8":"wz-03";
      const fragment=action==="sector"?"#sector-vert-sector-8":"#wildzone-3";
      const initial=base+"/sector-maps.html?source="+source+"&keep=1&area=wz-02#wildzone-2";
      const changed=base+"/sector-maps.html?source="+source+"&keep=1&area="+area+fragment;
      try{
        await page.goto(initial,{waitUntil:"load"});
        assert.equal(await page.locator('[data-area-panel]').count(),0);
        await page.locator('a[href="'+fragment+'"]').first().click();
        await page.waitForURL(changed);
        assert.equal(await page.locator(fragment+(action==="sector"?" details":" details.zone-records")).first().evaluate(node=>node.open),true,"The original target disclosure opens before evidence arrives");
        if(action==="zone-back"){
          await page.goBack();await page.waitForURL(initial);
          await page.waitForFunction(()=>document.querySelector("#wildzone-2 details.zone-records")?.open);
        }
        release();const host=await panel();
        const selected=action==="zone-back"?"wz-02":area;
        assert.equal(page.url(),action==="zone-back"?initial:changed);
        assert.equal(await host.locator('[data-area-results] [data-area-id="'+selected+'"]').getAttribute("aria-pressed"),"true");
        assert.deepEqual(await areaIds(),[selected]);
        if(action!=="zone-back"){
          await page.goBack();await page.waitForURL(initial);
          await page.waitForFunction(()=>document.querySelector("#wildzone-2 details.zone-records")?.open);
          assert.equal(await host.locator('[data-area-results] [data-area-id="wz-02"]').getAttribute("aria-pressed"),"true");
        }
        await page.goForward();await page.waitForURL(changed);
        assert.equal(await host.locator('[data-area-results] [data-area-id="'+area+'"]').getAttribute("aria-pressed"),"true");
        assert.equal(await page.locator(fragment+(action==="sector"?" details":" details.zone-records")).first().evaluate(node=>node.open),true);
        assert.equal(new URL(page.url()).searchParams.get("source"),source);assert.equal(new URL(page.url()).searchParams.get("keep"),"1");
        await unchanged();
      }finally{release();await page.unroute("**/atlas-area-evidence.json",holdEvidence);}
    }

    // A newer original Explorer selection must win over the initial URL when
    // evidence arrives, including a non-area photo/route selection.
    for(const target of ["wz-03","vert-cyclone","history-empty"]){
      let release;
      const evidenceReady=new Promise(resolve=>{release=resolve;});
      const holdEvidence=async route=>{await evidenceReady;await route.continue();};
      await page.route("**/atlas-area-evidence.json",holdEvidence);
      try{
        await page.goto(base+"/atlas-explorer.html?area=wz-02&source=pending-explorer&collectible=screw%3A29",{waitUntil:"load"});
        await page.waitForFunction(()=>document.querySelector("#aeSelected > h3")?.textContent==="Wild Zone 02");
        assert.equal(await page.locator('[data-area-panel]').count(),0);
        if(target==="history-empty"){
          // Establish empty and selected entries in the actual browser history
          // while the optional module is held; no application state is mocked.
          await page.evaluate(()=>{
            const url=new URL(location.href);url.searchParams.delete("area");
            history.replaceState(history.state,"",url.pathname+url.search+url.hash);
            url.searchParams.set("area","wz-02");
            history.pushState(history.state,"",url.pathname+url.search+url.hash);
          });
        }
        if(target==="vert-cyclone")await page.locator('#aeFilters [data-kind="holovator"]').click();
        await page.locator('#aeResults [data-record-id="'+(target==="history-empty"?"wz-03":target)+'"]').click();
        const title=await page.locator("#aeSelected > h3").textContent();
        const photo=await page.locator("#aeSelected img").first().elementHandle();
        assert.ok(photo,"The explicit selection exposes its original photograph before evidence finishes");
        if(target==="vert-cyclone")await page.locator("#aeNextStep").click();
        const routeProgress=await page.locator("#aeRouteProgress").textContent();
        if(target==="history-empty"){
          await page.goBack();await page.waitForURL(url=>!url.searchParams.has("area"));
          assert.equal(await page.locator('[data-area-panel]').count(),0);
        }
        release();await panel();
        if(target==="history-empty")await explorerSelection(null);
        else{
          assert.equal(await page.locator("#aeSelected > h3").textContent(),title,"Late initialization must not restore the stale URL area");
          assert.equal(await photo.evaluate(node=>node.isConnected&&node===document.querySelector("#aeSelected img")),true);
          assert.equal(await page.locator('#aeResults [data-record-id="'+target+'"]').getAttribute("aria-pressed"),"true");
        }
        assert.equal(new URL(page.url()).searchParams.get("area"),target==="wz-03"?target:null);
        assert.equal(new URL(page.url()).searchParams.get("source"),"pending-explorer");
        assert.equal(new URL(page.url()).searchParams.get("collectible"),"screw:29");
        assert.equal(await page.locator("#aeRouteProgress").textContent(),routeProgress,"Late initialization retains the independent route step");
        if(target==="history-empty"){
          await page.goForward();await page.waitForURL(url=>url.searchParams.get("area")==="wz-02");
          await explorerSelection("wz-02");
        }
        await photo.dispose();await unchanged();
      }finally{release();await page.unroute("**/atlas-area-evidence.json",holdEvidence);}
    }

    // Hold the optional evidence fetch until the original deep-linked photo is
    // loaded. Shared initialization must retain that exact DOM node, rather
    // than replace it while a reader is viewing or opening the source image.
    let releaseEvidence;
    const evidenceReady=new Promise(resolve=>{releaseEvidence=resolve;});
    const delayedEvidence=async route=>{await evidenceReady;await route.continue();};
    await page.route("**/atlas-area-evidence.json",delayedEvidence);
    await page.goto(base+"/atlas-explorer.html?sector=jaune-sector-5&source=photo-stability",{waitUntil:"load"});
    const originalPhoto=page.locator("#aeSelected .ae-source-map-reference img");
    await originalPhoto.waitFor({state:"attached"});
    const originalPhotoNode=await originalPhoto.elementHandle();
    assert.ok(originalPhotoNode,"The original sector photo renders before the optional shared evidence finishes");
    await originalPhoto.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector("#aeSelected .ae-source-map-reference img")?.naturalWidth>0);
    releaseEvidence();
    const stablePhotoPanel=await panel();
    await stablePhotoPanel.locator('[data-area-results] [data-area-id="jaune-sector-5"][aria-pressed="true"]').waitFor({state:"attached"});
    const unchangedPhoto=async()=>{
      assert.equal(await originalPhotoNode.evaluate(node=>node.isConnected&&node===document.querySelector("#aeSelected .ae-source-map-reference img")),true,
        "An unchanged area must preserve the original loaded source-image DOM node");
      assert.equal(await page.locator('#aeResults [data-record-id="jaune-sector-5"]').getAttribute("aria-pressed"),"true");
      assert.equal(await page.locator('#aeResults [data-record-id="jaune-sector-5"]').isVisible(),true);
    };
    await unchangedPhoto();
    // Compatible text stays intact, while a deliberately incompatible legacy
    // category is revealed again without replacing the selected photograph.
    await page.locator("#aeSearch").fill("Jaune");
    await page.locator('#aeFilters [data-kind="holovator"]').click();
    await stablePhotoPanel.locator('[data-area-boundaries]').uncheck();
    await unchangedPhoto();
    assert.equal(await page.locator("#aeSearch").inputValue(),"Jaune");
    await stablePhotoPanel.locator('[data-area-boundaries]').check();
    await unchangedPhoto();
    await page.unroute("**/atlas-area-evidence.json",delayedEvidence);
    await originalPhotoNode.dispose();
    await unchanged();

    // Capture the reviewed production outlines before synthetic evidence interception.
    for(const areaId of register.geometries.filter(row=>row.kind==='zone'&&row.status==='approved').map(row=>row.area_id).sort()){
      await page.goto(base+"/atlas-explorer.html?area="+areaId,{waitUntil:"load"});
      const measuredPanel=await panel();
      await measuredPanel.locator('[data-area-focus="'+areaId+'"]').click();
      await page.locator("#aeViewport").scrollIntoViewIfNeeded();
      assert.equal(await page.locator('[data-area-boundary="'+areaId+'"].is-active').count(),1);
      await page.locator("#aeViewport").screenshot({path:output+"/at339-measured-selected-"+areaId.replace("-","")+"-"+device+".png"});
      await unchanged();
      const row=register.geometries.find(row=>row.area_id===areaId&&row.status==="approved");
      assert.ok(row,"Rendered new outline must have approved production evidence");
      const points=row.geometry.coordinates.flat(row.geometry.type==="Polygon"?1:2);
      const xs=points.map(point=>point[0]),ys=points.map(point=>point[1]);
      const expectedBounds={x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
      await explorerSelection(areaId);
      const boundary=page.locator('[data-area-boundary="'+areaId+'"].is-active');
      assert.equal(await page.locator('[data-area-boundary].is-active').count(),1,"Only the selected production area is active");
      assert.ok(await boundary.isVisible(),"Selected production outline is visible");
      const renderedBounds=await boundary.evaluate(node=>{const b=node.getBBox();return{x:b.x,y:b.y,width:b.width,height:b.height};});
      for(const key of Object.keys(expectedBounds))assert.ok(Math.abs(renderedBounds[key]-expectedBounds[key])<0.01,"Rendered "+areaId+" "+key+" matches the approved native geometry");
      assert.equal(await measuredPanel.locator('[data-area-results] [data-area-id="'+areaId+'"]').getAttribute("aria-pressed"),"true");
      assert.equal(new URL(page.url()).searchParams.get("area"),areaId);
      for(const control of ["aeZoomIn","aeZoomOut","aeTurnLeft","aeTurnRight","aeNorth","aeReset","aeRose"]){
        assert.ok(await page.locator("#"+control).isVisible(),control+" remains visible with "+areaId);
        assert.ok(await page.locator("#"+control).isEnabled(),control+" remains enabled with "+areaId);
      }
      assert.equal(await page.locator("#aeMapImage").getAttribute("src"),AREA_MAP.path,"The original map stays behind the approved outline");
      const zone=wildZoneRecord(Number(areaId.slice(3)));
      const photos=page.locator('#aeSelected [data-wz-fieldbook="'+zone.number+'"] .wz-photo-pair');
      assert.equal(await photos.locator("img").count(),zone.photos.length,"Original photograph pair is retained");
      for(const [index,photo] of zone.photos.entries()){
        const img=photos.locator("img").nth(index);
        assert.equal(await img.getAttribute("src"),photo.path);
        assert.equal(await img.locator("..").getAttribute("href"),photo.path,"Full-size original photograph remains accessible");
        await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode());
        assert.equal(await img.evaluate(node=>node.naturalWidth),photo.width,"Original photograph decodes at its recorded width");
      }
      const mapScreenshot="at339-measured-selected-"+areaId.replace("-","")+"-"+device+".png";
      const photoScreenshot="at339-approved-"+areaId.replace("-","")+"-photos-"+device+".png";
      await photos.screenshot({path:output+"/"+photoScreenshot});
      await unchanged();
      approvedZoneRenders.push({areaId,synthetic:false,selectedOriginalRecord:true,activeBoundary:true,renderedBounds,originalControls:true,originalPhotos:zone.photos.map(photo=>photo.path),mapScreenshot,photoScreenshot});
    }

    // Real sector footprints retain their semantic limits and original photographs.
    // Cover each district, an uneven-height mesh and overlap with a Wild Zone.
    for(const areaId of ['vert-sector-1','bleu-sector-2','magenta-sector-5','rouge-sector-4','jaune-sector-6']){
      await page.goto(base+'/atlas-explorer.html?area='+areaId,{waitUntil:'load'});
      const host=await panel(),row=register.geometries.find(row=>row.area_id===areaId);
      assert.equal(row.representation,'source_area_footprint');
      assert.match(await host.locator('[data-area-detail]').textContent(),/named sector area.*overlap at different heights/s);
      assert.doesNotMatch(await host.locator('[data-area-detail]').textContent(),/This outline follows the green zone/);
      await host.locator('[data-area-focus="'+areaId+'"]').click();
      await page.waitForFunction(()=>{const r=document.getElementById('aeViewport').getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1;});
      await page.locator('#aeViewport').scrollIntoViewIfNeeded();
      const boundary=page.locator('[data-area-boundary="'+areaId+'"].is-active');
      assert.equal(await boundary.count(),1);
      const points=row.geometry.coordinates.flat(row.geometry.type==='Polygon'?1:2);
      const expected={x:Math.min(...points.map(p=>p[0])),y:Math.min(...points.map(p=>p[1])),width:Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])),height:Math.max(...points.map(p=>p[1]))-Math.min(...points.map(p=>p[1]))};
      const actual=await boundary.evaluate(path=>{const b=path.getBBox();return{x:b.x,y:b.y,width:b.width,height:b.height};});
      for(const name of Object.keys(expected))assert.ok(Math.abs(expected[name]-actual[name])<.01,areaId+' renders exact '+name);
      assert.equal(await boundary.evaluate(path=>{const b=path.getBoundingClientRect(),v=document.getElementById('aeViewport').getBoundingClientRect();return b.left>=v.left-1&&b.right<=v.right+1&&b.top>=v.top-1&&b.bottom<=v.bottom+1;}),true,'Reviewed area focus frames the actual footprint');
      const visibleFit=await boundary.evaluate(path=>{
        const bounds=path.getBoundingClientRect(),viewport=document.getElementById('aeViewport');
        const v=viewport.getBoundingClientRect(),context=document.getElementById('aeSectorContext'),card=context.getBoundingClientRect();
        const guidance=viewport.querySelector('.ae-map-guidance'),guide=guidance.getBoundingClientRect();
        const transform=new DOMMatrix(getComputedStyle(document.getElementById('aeStage')).transform);
        const strokeMargin=Number.parseFloat(getComputedStyle(path).strokeWidth)/2*Math.max(1,Math.hypot(transform.a,transform.b));
        return {strokeMargin,contextVisible:!context.hidden&&card.width>0&&card.height>0&&getComputedStyle(context).visibility==='visible',
          left:bounds.left-strokeMargin-v.left,right:v.right-bounds.right-strokeMargin,
          belowContext:bounds.top-strokeMargin-card.bottom,aboveGuidance:guide.top-bounds.bottom-strokeMargin};
      });
      assert.equal(visibleFit.contextVisible,true,'The selected sector context remains visible');
      assert.ok(visibleFit.left>=0&&visibleFit.right>=0&&visibleFit.belowContext>=0&&visibleFit.aboveGuidance>=0,
        areaId+' entire outline and stroke clear the context card, map edges and guidance: '+JSON.stringify(visibleFit));
      assert.equal(await page.locator('.ae-pin[data-kind="sector"]').count(),0,'A footprint never becomes a guessed sector point pin');
      await page.locator('#aeViewport').screenshot({path:output+'/at341-sector-'+areaId+'-'+device+'.png'});
      const photo=page.locator('#aeSelected .ae-source-map-reference img');
      await photo.scrollIntoViewIfNeeded();await photo.evaluate(img=>img.decode());
      assert.ok(await photo.evaluate(img=>img.naturalWidth>0));
      await host.locator('[data-area-detail]').screenshot({path:output+'/at341-sector-detail-'+areaId+'-'+device+'.png'});
      await unchanged();
    }

    // Related area navigation is shared by all maps without copying a zone's
    // roster into the sector or losing the original source-photo guide link.
    for(const [surface,url,sector,zone] of [
      ['explorer','atlas-explorer.html','bleu-sector-2','wz-05'],
      ['explorer','atlas-explorer.html','bleu-sector-10','wz-10'],
      ['explorer','atlas-explorer.html','magenta-sector-5','wz-09'],
      ['standalone','maps.html','bleu-sector-10','wz-10'],
      ['sectors','sector-maps.html','magenta-sector-5','wz-09'],
      ['main','index.html','bleu-sector-2','wz-05']
    ]){
      const relatedUrl=new URL(url,base+'/');
      relatedUrl.searchParams.set('source','at341-crossref');
      relatedUrl.searchParams.set('area',sector);
      if(surface==='main')relatedUrl.hash='maps';
      await page.goto(relatedUrl.href,{waitUntil:'load'});
      const host=await panel();
      const original=host.locator('[data-area-detail] > a').filter({hasText:'Open original area guide and photographs'});
      assert.equal(await original.count(),1);
      assert.equal(await host.locator('[data-area-detail] .aa-encounter').count(),sector==='bleu-sector-2'?1:0,'The sector keeps its own direct encounter count');
      const related=host.locator('[data-related-areas]');
      assert.match(await related.textContent(),/Wild Zone/);
      if(surface==='explorer')await related.screenshot({path:output+'/at341-related-'+sector+'-'+device+'.png'});
      const relatedControl=related.locator('[data-related-area="'+zone+'"]');
      assert.ok(await relatedControl.isVisible(),surface+' related-area control is visible before navigation');
      await relatedControl.click();
      assert.equal(new URL(page.url()).searchParams.get('area'),zone);
      assert.equal(new URL(page.url()).searchParams.get('source'),'at341-crossref');
      assert.ok(await host.locator('[data-area-detail] .aa-encounter').count()>0);
      const images=host.locator('[data-area-detail] img.aa-photo');assert.equal(await images.count(),2);
      for(const img of await images.all()){await img.scrollIntoViewIfNeeded();await img.evaluate(node=>node.decode());}
      await page.goBack();await page.waitForFunction(id=>new URL(location.href).searchParams.get('area')===id,sector);
      await page.reload({waitUntil:'load'});await panel();
      assert.equal(await page.locator('[data-related-area="'+zone+'"]').count(),1,'Related navigation survives history and reload');
      await unchanged();
    }

    // Use the actual overlapping Bleu6/Bleu8 source footprints, not a fabricated
    // boundary. Rounded touch coordinates must remain inside both visible paths.
    await page.goto(base+'/atlas-explorer.html?area=bleu-sector-6',{waitUntil:'load'});
    const overlapPanel=await panel();
    await overlapPanel.locator('[data-area-focus="bleu-sector-6"]').click();
    await overlapPanel.locator('[data-area-clear]').click();
    await page.locator('#aeViewport').scrollIntoViewIfNeeded();
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const overlapPoint=await page.locator('[data-area-overlay]').evaluate(svg=>{
      const a=svg.querySelector('[data-area-boundary="bleu-sector-6"]'),b=svg.querySelector('[data-area-boundary="bleu-sector-8"]');
      const av=a.getBBox(),bv=b.getBBox(),matrix=svg.getScreenCTM(),inverse=matrix.inverse();
      const viewport=document.getElementById('aeViewport'),rect=viewport.getBoundingClientRect();
      const controls=[...viewport.querySelectorAll('button,a,input,select,textarea')].map(node=>node.getBoundingClientRect()).filter(r=>r.width&&r.height);
      let best=null;
      for(let x=Math.max(av.x,bv.x)+2;x<Math.min(av.x+av.width,bv.x+bv.width);x+=4)for(let y=Math.max(av.y,bv.y)+2;y<Math.min(av.y+av.height,bv.y+bv.height);y+=4){
        const p=svg.createSVGPoint();p.x=x;p.y=y;if(!a.isPointInFill(p)||!b.isPointInFill(p))continue;
        const screen=p.matrixTransform(matrix);screen.x=Math.round(screen.x);screen.y=Math.round(screen.y);
        const native=screen.matrixTransform(inverse);if(!a.isPointInFill(native)||!b.isPointInFill(native))continue;
        if(screen.x<Math.max(rect.left+15,15)||screen.x>Math.min(rect.right-15,innerWidth-15)||screen.y<Math.max(rect.top+15,15)||screen.y>Math.min(rect.bottom-15,innerHeight-15))continue;
        const target=document.elementFromPoint(screen.x,screen.y);if(!target||!viewport.contains(target)||target.closest('button,a,input,select,textarea'))continue;
        const clearance=Math.min(...controls.map(r=>Math.hypot(Math.max(r.left-screen.x,0,screen.x-r.right),Math.max(r.top-screen.y,0,screen.y-r.bottom))));
        if(clearance>=12&&(!best||clearance>best.clearance))best={x:screen.x,y:screen.y,clearance};
      }
      return best;
    });
    assert.ok(overlapPoint,'A real overlap has an unobstructed touch target');
    await tap(overlapPoint);
    await page.locator('[data-area-overlap-id="bleu-sector-6"]').waitFor({state:'visible'});
    assert.equal(await page.locator('[data-area-overlap-id="bleu-sector-8"]').count(),1);
    assert.equal(new URL(page.url()).searchParams.get('area'),null,'Overlapping footprints do not choose the first or nearest sector automatically');
    await page.waitForFunction(()=>{const r=document.querySelector('[data-area-overlap-id="bleu-sector-6"]')?.getBoundingClientRect();return r&&r.top>=0&&r.bottom<=innerHeight;});
    await page.locator('[data-area-detail]').screenshot({path:output+'/at341-real-sector-overlap-'+device+'.png'});
    await page.locator('[data-area-overlap-id="bleu-sector-8"]').click();
    assert.equal(new URL(page.url()).searchParams.get('area'),'bleu-sector-8');
    assert.equal(await page.locator('[data-area-boundary="bleu-sector-8"].is-active').count(),1);
    await unchanged();

    await page.goto(base+"/maps.html#wild-zone-1",{waitUntil:"load"});await panel();
    const habitatLink=page.locator('[data-wz-fieldbook="1"] [data-atlas-species="pidgey"]').first();
    assert.equal(await habitatLink.getAttribute("href"),"atlas-explorer.html?species=pidgey");
    await habitatLink.click();await panel();assert.equal(new URL(page.url()).searchParams.get("species"),"pidgey");
    assert.ok((await areaIds()).includes("wz-05"));
    await page.goto(base+"/index.html#pokedex",{waitUntil:"load"});
    await page.locator('[data-atlas-habitat-link="pidgey"]').waitFor({state:"attached"});
    assert.equal(await page.locator('[data-atlas-habitat-link="pidgey"]').getAttribute("href"),"atlas-explorer.html?species=pidgey");
    assert.ok(await page.locator("#dexGrid .dex-card").count()>=232,"Existing Pokédex entries preserved");
    await unchanged();

    // An unavailable additive register must retain original areas and rosters.
    await page.route("**/atlas-area-evidence.json",route=>route.fulfill({status:503,contentType:"application/json",body:'{"error":"test-only unavailable register"}'}));
    await page.goto(base+"/atlas-explorer.html?species=pidgey",{waitUntil:"load"});await panel();
    assert.ok((await areaIds()).includes("wz-01"));assert.equal(await page.locator("[data-area-boundary]").count(),0);
    assert.match(await page.locator("[data-area-status]").textContent(),/No verified boundary/i);
    await unchanged();await page.unroute("**/atlas-area-evidence.json");

    // Verify the actual overlay and tap/pan behaviour with an explicitly synthetic polygon.
    await page.route("**/atlas-area-evidence.json",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(fixture)}));
    await page.goto(base+"/atlas-explorer.html?source=fixture",{waitUntil:"load"});await panel();
    await page.locator('[data-area-boundary="wz-01"]').waitFor({state:"attached"});
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();
    const point=await unobstructedFixturePoint();
    const tapDiagnostic=phase=>page.evaluate(({point,phase})=>{
      const describe=node=>node?{tag:node.tagName,id:node.id||null,label:node.closest?.("button,a,input,select,textarea")?.getAttribute("aria-label")||null}:null;
      const types=["pointerdown","pointerup","pointercancel","click"];
      if(phase==="before"){
        const audit={events:[]};
        audit.record=event=>audit.events.push({type:event.type,x:event.clientX,y:event.clientY,pointerType:event.pointerType||null,target:describe(event.target)});
        window.__atlasAreaTapAudit=audit;for(const type of types)document.addEventListener(type,audit.record,true);
      }
      const viewport=document.getElementById("aeViewport"),svg=document.querySelector("[data-area-overlay]"),box=viewport.getBoundingClientRect();
      const p=svg.createSVGPoint();p.x=point.x;p.y=point.y;const native=p.matrixTransform(svg.getScreenCTM().inverse());
      const result={phase,point,url:location.href,target:describe(document.elementFromPoint(point.x,point.y)),native:[native.x,native.y],viewport:{x:box.x,y:box.y,width:box.width,height:box.height},window:{width:innerWidth,height:innerHeight},selectedTitle:document.querySelector("#aeSelected > h3")?.textContent,events:window.__atlasAreaTapAudit?.events||[]};
      if(phase==="after"){
        for(const type of types)document.removeEventListener(type,window.__atlasAreaTapAudit.record,true);
        delete window.__atlasAreaTapAudit;
      }
      return result;
    },{point,phase});
    console.log("AT339 synthetic tap",device,JSON.stringify(await tapDiagnostic("before")));
    try{
      await tap(point);
      await page.waitForFunction(()=>new URL(location.href).searchParams.get("area")==="wz-01");
    }catch(error){
      await page.screenshot({path:output+"/at339-synthetic-boundary-tap-failure-"+device+".png"}).catch(screenshotError=>console.error("Synthetic tap failure screenshot:",String(screenshotError)));
      throw error;
    }finally{
      const diagnostic=await tapDiagnostic("after").catch(error=>({phase:"after",url:page.url(),diagnosticError:String(error)}));
      console.log("AT339 synthetic tap",device,JSON.stringify(diagnostic));
    }
    const syntheticPanel=await panel();
    const sourceFixture=syntheticPanel.locator('[data-area-encounter-id="fixture-source-navigation"]');
    assert.equal(await sourceFixture.count(),1,"Synthetic citation record is actually displayed");
    assert.match(await sourceFixture.textContent(),/Reference: serebii\.net/);
    assert.match(await sourceFixture.textContent(),/Atlas evidence: fixture-only-written-record\.md/);
    assert.equal(await sourceFixture.locator('.aa-source-notes a').count(),0,"External and raw Markdown sources remain attribution, not navigation");
    await syntheticPanel.screenshot({path:output+"/at339-synthetic-boundary-"+device+".png"});
    await syntheticPanel.locator("[data-area-clear]").click();
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();
    const dragStart=await unobstructedFixturePoint();
    await drag(dragStart);
    assert.equal(new URL(page.url()).searchParams.get("area"),null,"Dragging an overlay must not select a boundary");
    if(device==="phone"){
      await page.locator("#aeViewport").scrollIntoViewIfNeeded();
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const touch=await page.locator("#aeViewport").evaluate(node=>{
        const r=node.getBoundingClientRect();
        const visible={left:Math.max(0,r.left),right:Math.min(innerWidth,r.right),top:Math.max(0,r.top),bottom:Math.min(innerHeight,r.bottom)};
        // Reuse the collectible suite's adaptive visible-window scan. Reserve
        // room for both real diagonal moves and preserve major-pin priority.
        const bounds={left:Math.ceil(visible.left+30),right:Math.floor(visible.right-34),top:Math.ceil(visible.top+44),bottom:Math.floor(visible.bottom-46)};
        const separation=Math.min(180,(visible.right-visible.left)*.45),margin=12;
        const controls=[...node.querySelectorAll("button,a,input,select,textarea,[role='button']")].map(control=>({control,box:control.getBoundingClientRect()}))
          .filter(({control,box})=>box.width&&box.height&&getComputedStyle(control).visibility!=="hidden"&&box.right>visible.left&&box.left<visible.right&&box.bottom>visible.top&&box.top<visible.bottom);
        const blocked=new Map();let tested=0,free=0;
        const diagnostics=()=>({viewport:{x:r.x,y:r.y,width:r.width,height:r.height},window:{width:innerWidth,height:innerHeight},visible,bounds,minimumSeparation:separation,minimumControlClearance:margin,testedPoints:tested,unobstructedPoints:free,obstructingHits:[...blocked].sort((a,b)=>b[1]-a[1]).slice(0,6)});
        for(let y=bounds.top;y<=bounds.bottom;y+=12){
          const row=[];
          for(let x=bounds.left;x<=bounds.right;x+=12){
            tested++;const hit=document.elementFromPoint(x,y),control=hit?.closest("button,a,input,select,textarea,[role='button']");
            const clearance=Math.min(...controls.map(({box})=>Math.hypot(Math.max(box.left-x,0,x-box.right),Math.max(box.top-y,0,y-box.bottom))));
            if(hit&&node.contains(hit)&&!control&&clearance>=margin){row.push({x,clearance,target:hit.id||hit.tagName});free++;}
            else{
              const target=control||hit;
              const reason=!target?"outside document":!node.contains(hit)?"outside map: "+target.tagName:control?(control.id||control.getAttribute("aria-label")||control.tagName):"within 12px of map control";
              blocked.set(reason,(blocked.get(reason)||0)+1);
            }
          }
          if(row.length>1&&row.at(-1).x-row[0].x>=separation)return{x1:row[0].x,x2:row.at(-1).x,y,starts:[row[0],row.at(-1)],diagnostics:diagnostics()};
        }
        return{diagnostics:diagnostics()};
      });
      console.log("AT339 touch pair",device,JSON.stringify(touch));
      if(!Number.isFinite(touch.x1)||!Number.isFinite(touch.x2)){
        await page.screenshot({path:output+"/at339-touch-pair-failure-"+device+".png"}).catch(error=>console.error("Touch pair failure screenshot:",String(error)));
        assert.fail("No separated unobstructed real touch gesture starts: "+JSON.stringify(touch.diagnostics));
      }
      const beforeZoom=await page.locator("#aeZoomLabel").textContent();
      const beforeRotation=await page.locator("#aePositionReadout").textContent();
      const session=await context.newCDPSession(page),p=(x,y,id)=>({x:Math.round(x),y:Math.round(y),id});
      try{
        await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[p(touch.x1,touch.y,1),p(touch.x2,touch.y,2)]});
        await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[p(touch.x1-22,touch.y-30,1),p(touch.x2+28,touch.y+40,2)]});
        await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }finally{await session.detach();}
      await page.waitForFunction(before=>document.getElementById("aeZoomLabel").textContent!==before,beforeZoom);
      await page.waitForFunction(before=>document.getElementById("aePositionReadout").textContent!==before,beforeRotation);
      assert.equal(new URL(page.url()).searchParams.get("area"),null,"A two-finger pinch/rotation must not select a boundary");
    }
    // Both paint and hit testing must respect the visible layer and filters.
    await page.goto(base+"/atlas-explorer.html?source=fixture",{waitUntil:"load"});const fixturePanel=await panel();
    await fixturePanel.locator("[data-area-boundaries]").uncheck();
    assert.equal(await page.locator('[data-area-boundary="wz-01"]').isVisible(),false);
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();await tap(await unobstructedFixturePoint());
    assert.equal(new URL(page.url()).searchParams.get("area"),null,"A hidden boundary cannot select an area");
    await fixturePanel.locator("[data-area-boundaries]").check();
    await fixturePanel.locator("[data-area-district]").selectOption("Bleu");
    assert.equal(await page.locator('[data-area-boundary="wz-01"]').isVisible(),false);
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();await tap(await unobstructedFixturePoint());
    assert.equal(new URL(page.url()).searchParams.get("area"),null,"A filtered boundary cannot select an area");

    // A real collectible hit retains priority even inside an approved boundary.
    await page.route("**/items-data.js",route=>route.fulfill({status:200,contentType:"text/javascript",body:"window.ATLAS_ITEM_EVIDENCE = "+JSON.stringify(itemEvidence)+";"}));
    await page.route("**/atlas-collectibles-data.json",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(collectibleRegister)}));
    await page.goto(base+"/atlas-explorer.html?source=overlap-fixture",{waitUntil:"load"});await panel();
    await page.locator('#aeLayers [data-layer="item"]').check();
    const collectible=page.locator('#aeCollectiblePins [data-collectible-id="'+collectibleId+'"]');
    await collectible.waitFor({state:"visible"});await page.locator("#aeViewport").scrollIntoViewIfNeeded();
    const itemPoint=await collectible.evaluate(node=>{const r=node.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};});
    await tap(itemPoint);
    await page.locator('#aeCollectibleDetail [data-collectible-progress]').waitFor({state:"visible"});
    assert.equal(new URL(page.url()).searchParams.get("area"),null,"A collectible hit must not also select its enclosing boundary");
    await page.locator("#aeCollectibleDetail").screenshot({path:output+"/at339-boundary-item-priority-"+device+".png"});
    await page.unroute("**/items-data.js");await page.unroute("**/atlas-collectibles-data.json");
    await unchanged();await page.unroute("**/atlas-area-evidence.json");
    assert.deepEqual(errors,[],"No uncaught runtime errors on "+device);
    proof.devices.push({device,width,height,surfaces:4,historyAndReload:true,legacyMarkerReload:true,legacyFilterReveal:true,explorerSelectionHistoryParity:true,pendingLegacyIntentPreserved:true,pendingHistorySupersedesIntent:true,pendingExplorerRecordPreserved:true,pendingMainChoiceAndFiltersPreserved:true,pendingSectorAnchorsPreserved:true,routeAndCollectibleStatePreserved:true,sourcePhotoDomPreserved:true,originalProgressBytesPreserved:true,storageWrites:0,sourceFailureFallback:true,approvedZoneRenders,syntheticTapAndDrag:true,touchPinchAndRotation:device==="phone",boundaryLayerAndFilterHitGate:true,collectibleClickPriority:true,pageErrors:errors});
    await context.close();
  }
  fs.writeFileSync(output+"/at339-browser-proof.json",JSON.stringify(proof,null,2)+"\n");
  console.log("PASS AT-339: shared habitats on four maps, legacy marker/history/reload, original photos, Pokédex links, evidence fallback, isolated touch/mouse boundary gestures, visible-layer hit gates, collectible priority and unchanged progress on phone/desktop.");
}finally{if(browser)await browser.close();server.kill("SIGTERM");}
