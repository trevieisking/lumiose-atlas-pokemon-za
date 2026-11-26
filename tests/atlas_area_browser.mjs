/* Real browser proof for shared areas. Synthetic boundary fixtures are confined
 * to request interception in an isolated browser context, never production. */
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import {spawn} from "node:child_process";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
import {AREA_MAP} from "../atlas-area-model.mjs";

const base="http://127.0.0.1:18769",output="test-artifacts/atlas-areas";
const key="lumiose-atlas-reconstruction-v1";
const saved=JSON.stringify({check:{"1":true},sideCheck:{"61":true},legendCheck:{},pickup:{"2-5":true},screw:{"29":true},preservedFutureField:{untouched:"AT339 synthetic browser state"}});
const register=JSON.parse(fs.readFileSync("atlas-area-evidence.json","utf8"));
const productionIds=(register.geometries||[]).filter(row=>row.status==="approved").map(row=>row.area_id);
const proof={scope:"AT-339 shared areas and habitats",productionBoundaryIds:productionIds,devices:[],syntheticFixtureOnly:true};
const fixture={schemaVersion:1,map:AREA_MAP,areas:[],geometries:[{
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
    const page=await context.newPage(),errors=[];
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
        for(let x=750;x<=1150;x+=50)for(let y=750;y<=1150;y+=50){
          const p=svg.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(svg.getScreenCTM());
          // Mobile Chromium may retarget a touch to a nearby button even when
          // the exact centre hit is clear. Use a full touch-sized patch.
          const clear=[-18,0,18].every(dx=>[-18,0,18].every(dy=>{
            const target=document.elementFromPoint(q.x+dx,q.y+dy);
            return target&&viewport.contains(target)&&!target.closest("button,a,input,select,textarea");
          }));
          if(q.x>rect.left+20&&q.x<rect.right-70&&q.y>rect.top+20&&q.y<rect.bottom-45&&clear)return{x:q.x,y:q.y};
        }
        throw Error("No visible unobstructed point inside the synthetic boundary");
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
      assert.match(await host.locator("[data-area-detail]").textContent(),/not independently verified|awaiting verification/i);
      assert.equal(await page.locator('[data-area-boundary="vert-sector-1"]').count(),0,"A sector label never becomes a polygon");
      assert.ok(await host.locator('[data-area-detail] a[href="assets/atlas/sector-streets/vert/vert-1-saison-canal.png"]').count()>0,"Original photograph retained");
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
        assert.equal(await page.locator("[data-area-detail] > h4").textContent(),"Wild Zone 02","Original marker selection must survive reload with its preserved source name");
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
        await page.waitForFunction(()=>document.querySelector("#mapZoneDetail .rebuild-zone-detail > h3")?.textContent==="Wild Zone 03");
        assert.equal(new URL(page.url()).searchParams.get("area"),"wz-03","Original main-map choice updates its shared URL before evidence arrives");
        assert.equal(new URL(page.url()).hash,"#maps");
        assert.equal(await page.locator('[data-area-panel]').count(),0);
        if(action==="back"){
          await page.goBack();await page.waitForURL(empty);
        }
        release();const host=await panel();
        if(action==="back"){
          assert.equal(page.url(),empty,"Late initialization must not replay a choice superseded by Back");
          assert.equal(await page.locator("#mapZoneDetail .rebuild-zone-detail > h3").count(),0);
          assert.equal(await host.locator('[data-area-results] [aria-pressed="true"]').count(),0);
          await page.goForward();await page.waitForURL(url=>url.searchParams.get("area")==="wz-03");
        }
        assert.equal(await page.locator("#mapZoneDetail .rebuild-zone-detail > h3").textContent(),"Wild Zone 03");
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

    await page.goto(base+"/atlas-explorer.html?area=wz-11",{waitUntil:"load"});
    const measuredPanel=await panel();
    await measuredPanel.locator('[data-area-focus="wz-11"]').click();
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();
    assert.equal(await page.locator('[data-area-boundary="wz-11"].is-active').count(),1);
    await page.locator("#aeViewport").screenshot({path:output+"/at339-measured-selected-wz11-"+device+".png"});
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

    async function hideUnrelatedFixturePins(){
      for(const layer of ["zone","holovator","ladder","landmark","sector-label"]){
        const toggle=page.locator('#aeLayers [data-layer="'+layer+'"]');
        await toggle.uncheck();
      }
    }
    // Verify the actual overlay and tap/pan behaviour with an explicitly synthetic polygon.
    await page.route("**/atlas-area-evidence.json",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(fixture)}));
    await page.goto(base+"/atlas-explorer.html?source=fixture",{waitUntil:"load"});await panel();await hideUnrelatedFixturePins();
    await page.locator('[data-area-boundary="wz-01"]').waitFor({state:"attached"});
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();
    const point=await unobstructedFixturePoint();
    await tap(point);
    await page.waitForFunction(()=>new URL(location.href).searchParams.get("area")==="wz-01");
    const syntheticPanel=await panel();
    await syntheticPanel.screenshot({path:output+"/at339-synthetic-boundary-"+device+".png"});
    await syntheticPanel.locator("[data-area-clear]").click();
    await page.locator("#aeViewport").scrollIntoViewIfNeeded();
    const dragStart=await unobstructedFixturePoint();
    await drag(dragStart);
    assert.equal(new URL(page.url()).searchParams.get("area"),null,"Dragging an overlay must not select a boundary");
    if(device==="phone"){
      await page.locator("#aeViewport").scrollIntoViewIfNeeded();
      const touch=await page.locator("#aeViewport").evaluate(node=>{
        const r=node.getBoundingClientRect();
        const left=Math.max(0,r.left)+34,right=Math.min(innerWidth,r.right)-38;
        const top=Math.max(0,r.top)+46,bottom=Math.min(innerHeight,r.bottom)-48;
        for(let y=top;y<=bottom;y+=12){
          const free=[];
          for(let x=left;x<=right;x+=12){
            const hit=document.elementFromPoint(x,y);
            if(hit&&node.contains(hit)&&!hit.closest("button,a,input,select,textarea"))free.push(x);
          }
          if(free.length>1&&free.at(-1)-free[0]>=150)return{x1:free[0],x2:free.at(-1),y};
        }
        throw Error("No separated unobstructed and visible touch gesture starts");
      });
      const beforeZoom=await page.locator("#aeZoomLabel").textContent();
      const session=await context.newCDPSession(page),p=(x,y,id)=>({x:Math.round(x),y:Math.round(y),id});
      try{
        await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[p(touch.x1,touch.y,1),p(touch.x2,touch.y,2)]});
        await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[p(touch.x1-22,touch.y-30,1),p(touch.x2+28,touch.y+40,2)]});
        await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
      }finally{await session.detach();}
      await page.waitForFunction(before=>document.getElementById("aeZoomLabel").textContent!==before,beforeZoom);
      assert.equal(new URL(page.url()).searchParams.get("area"),null,"A two-finger pinch/rotation must not select a boundary");
    }
    // Both paint and hit testing must respect the visible layer and filters.
    await page.goto(base+"/atlas-explorer.html?source=fixture",{waitUntil:"load"});const fixturePanel=await panel();await hideUnrelatedFixturePins();
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
    proof.devices.push({device,width,height,surfaces:4,historyAndReload:true,legacyMarkerReload:true,legacyFilterReveal:true,explorerSelectionHistoryParity:true,pendingLegacyIntentPreserved:true,pendingHistorySupersedesIntent:true,pendingExplorerRecordPreserved:true,pendingMainChoiceAndFiltersPreserved:true,pendingSectorAnchorsPreserved:true,routeAndCollectibleStatePreserved:true,sourcePhotoDomPreserved:true,originalProgressBytesPreserved:true,storageWrites:0,sourceFailureFallback:true,syntheticTapAndDrag:true,touchPinchAndRotation:device==="phone",boundaryLayerAndFilterHitGate:true,collectibleClickPriority:true,pageErrors:errors});
    await context.close();
  }
  fs.writeFileSync(output+"/at339-browser-proof.json",JSON.stringify(proof,null,2)+"\n");
  console.log("PASS AT-339: shared habitats on four maps, legacy marker/history/reload, original photos, Pokédex links, evidence fallback, isolated touch/mouse boundary gestures, visible-layer hit gates, collectible priority and unchanged progress on phone/desktop.");
}finally{if(browser)await browser.close();server.kill("SIGTERM");}
