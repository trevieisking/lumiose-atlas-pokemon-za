/* Browser proof for the independent, read-only Atlas: no live-site dependency. */
import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as pause } from "node:timers/promises";
import { chromium } from "playwright";
const base="http://127.0.0.1:18765";
const output="test-artifacts/atlas-explorer";
fs.mkdirSync(output,{recursive:true});
const server=spawn("python3",["-m","http.server","18765","--bind","127.0.0.1"],{stdio:"ignore"});
let browser;
try{
  let available=false;
  for(let n=0;n<40;n++){
    try{const response=await fetch(base+"/atlas-explorer.html");if(response.ok){available=true;break;}}catch(_){}
    await pause(150);
  }
  assert.ok(available,"Static page test server must be reachable");
  browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
  const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[];
  desktop.on("pageerror",error=>errors.push(String(error)));
  await desktop.goto(base+"/atlas-explorer.html",{waitUntil:"networkidle"});
  await desktop.waitForFunction(()=>document.getElementById("aeStats").textContent.includes("21 owner-surveyed"),{timeout:20000});
  assert.match(await desktop.locator("#aeStats").textContent(),/20 Wild Zones · 48 named sectors · 21/);
  const natural=await desktop.locator("#aeMapImage").evaluate(img=>img.naturalWidth);
  assert.equal(natural,1920,"Real 1920px city map must load");
  assert.equal(await desktop.locator(".ae-pin[data-kind='zone']").count(),20);
  assert.equal(await desktop.locator(".ae-pin[data-kind='holovator']").count(),21);
  assert.equal(await desktop.locator(".ae-pin[data-kind='ladder']").count(),1);
  assert.equal(await desktop.locator(".ae-pin[data-kind='scaffold']").count(),0,
    "No scaffold pin without verified ground coordinates");
  assert.equal(await desktop.locator("#aeLayers [data-layer='scaffold']").isDisabled(),true);
  await desktop.locator("#aeZoomIn").click();
  await desktop.waitForFunction(()=>document.getElementById("aeZoomLabel").textContent.includes("1.30"));
  await desktop.locator("#aeTurnRight").click();
  await desktop.waitForFunction(()=>document.getElementById("aePositionReadout").textContent.includes("45°"));
  await desktop.locator("#aeNorth").click();
  await desktop.waitForFunction(()=>document.getElementById("aePositionReadout").textContent.includes("0°"));
  await desktop.locator("#aeTint").click();
  assert.equal(await desktop.locator("#aeTint").getAttribute("aria-pressed"),"true");
  await desktop.locator("#aeFilters button[data-kind='holovator']").click();
  assert.equal(await desktop.locator("#aeResults button").count(),21);
  await desktop.locator("#aeFilters button[data-kind='all']").click();
  // Layer switches hide only the chosen category and do not destroy directory entries.
  await desktop.locator("#aeLayers [data-layer='zone']").uncheck();
  assert.equal(await desktop.locator(".ae-pin[data-kind='zone']:visible").count(),0);
  assert.equal(await desktop.locator(".ae-pin[data-kind='holovator']:visible").count(),21);
  assert.ok(await desktop.locator("#aeResults button").count()>60,
    "Searchable records must remain available when a layer is hidden");
  await desktop.locator("#aeLayers [data-layer='ladder']").uncheck();
  assert.equal(await desktop.locator(".ae-pin[data-kind='ladder']:visible").count(),0);
  await desktop.locator("#aeLayers [data-layer='zone']").check();
  assert.equal(await desktop.locator(".ae-pin[data-kind='zone']:visible").count(),20);
  await desktop.locator("#aeLayers [data-layer='ladder']").check();
  assert.equal(await desktop.locator(".ae-pin[data-kind='ladder']:visible").count(),1);
  // Clicking a search result must re-enable its hidden layer before focusing.
  await desktop.locator("#aeLayers [data-layer='holovator']").uncheck();
  await desktop.locator("#aeSearch").fill("Sommi");
  await desktop.locator("#aeResults button[data-record-id='rouge-plaza-west']").click();
  assert.equal(await desktop.locator("#aeLayers [data-layer='holovator']").isChecked(),true);
  assert.equal(await desktop.locator(".ae-pin[data-record-id='rouge-plaza-west']").count(),0,
    "Marker map uses stable internal ID and must not invent alternate DOM IDs");
  await desktop.locator("#aeSearch").fill("");
  await desktop.locator("#aeViewport").scrollIntoViewIfNeeded();
  const desktopMap=await desktop.locator("#aeViewport").boundingBox();
  assert.ok(desktopMap);
  const startZoom=Number.parseFloat(await desktop.locator("#aeZoomLabel").textContent());
  await desktop.mouse.move(desktopMap.x+desktopMap.width*.25,desktopMap.y+desktopMap.height*.55);
  await desktop.mouse.wheel(0,-200);
  await desktop.waitForFunction(before=>Number.parseFloat(document.getElementById("aeZoomLabel").textContent)>before,startZoom);
  const oldTransform=await desktop.locator("#aeStage").evaluate(el=>el.style.transform);
  await desktop.mouse.down();
  await desktop.mouse.move(desktopMap.x+desktopMap.width*.25+48,desktopMap.y+desktopMap.height*.55+29,{steps:5});
  await desktop.mouse.up();
  await desktop.waitForFunction(old=>document.getElementById("aeStage").style.transform!==old,oldTransform);
  await desktop.locator("#aeSearch").fill("Café Cyclone");
  await desktop.locator("#aeResults button[data-record-id='vert-cyclone']").click();
  assert.match(await desktop.locator("#aeSelected").textContent(),/broad covered stone archway/i);
  assert.equal(await desktop.locator("#aeRouteSelect").inputValue(),"cafe-cyclone");
  await desktop.locator("#aeNextStep").click();
  assert.match(await desktop.locator("#aeCurrentStep").textContent(),/archway/i);
  await desktop.locator("#aeNextStep").click();
  assert.match(await desktop.locator("#aeCurrentStep").textContent(),/grassy courtyard/i);
  await desktop.screenshot({path:output+"/atlas-desktop.png",fullPage:true});
  await desktop.locator("#aeSearch").fill("Sommi");
  await desktop.locator("#aeResults button[data-record-id='rouge-plaza-west']").click();
  const photos=desktop.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await photos.count(),5);
  await photos.first().scrollIntoViewIfNeeded();
  await desktop.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth>0),{timeout:15000});
  await desktop.screenshot({path:output+"/atlas-owner-photos.png",fullPage:true});
  await desktop.locator("#aeSearch").fill("Vert Sector 4");
  await desktop.locator("#aeFilters button[data-kind='sector']").click();
  assert.ok(await desktop.locator("#aeResults button").count()>=1);
  await desktop.locator("#aeResults button").first().click();
  assert.match(await desktop.locator("#aeSelected").textContent(),/no arbitrary pin|no precise mapped sector polygon/i);
  assert.equal(errors.length,0,"Desktop JavaScript errors: "+errors.join(" | "));
  const phone=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const mobileErrors=[];
  phone.on("pageerror",e=>mobileErrors.push(String(e)));
  await phone.goto(base+"/atlas-explorer.html",{waitUntil:"networkidle"});
  await phone.waitForFunction(()=>document.getElementById("aeStats").textContent.includes("21 owner-surveyed"),{timeout:20000});
  assert.equal(await phone.locator("#aeLayers [data-layer='scaffold']").isDisabled(),true);
  await phone.locator("#aeLayers [data-layer='zone']").uncheck();
  assert.equal(await phone.locator(".ae-pin[data-kind='zone']:visible").count(),0);
  assert.equal(await phone.locator(".ae-pin[data-kind='holovator']:visible").count(),21);
  await phone.locator("#aeLayers [data-layer='zone']").check();
  assert.equal(await phone.locator(".ae-pin[data-kind='zone']:visible").count(),20);
  const fitsPhone=await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
  assert.equal(fitsPhone,true,"Layer choices must not cause sideways scrolling on phone");
  await phone.locator("#aeTurnRight").click();
  await phone.waitForFunction(()=>document.getElementById("aePositionReadout").textContent.includes("45°"));
  await phone.locator("#aeNorth").click();
  await phone.waitForFunction(()=>document.getElementById("aePositionReadout").textContent.includes("0°"));

  // Real Chrome two-finger multitouch, not a mocked transform call.
  await phone.locator("#aeViewport").scrollIntoViewIfNeeded();
  const touch=await phone.evaluate(()=>{
    const box=document.getElementById("aeViewport").getBoundingClientRect();
    for(const fraction of [.38,.27,.60,.72,.18]){
      const y=box.top+box.height*fraction;
      const x1=box.left+box.width*.25,x2=box.left+box.width*.75;
      if([x1,x2].every(x=>!document.elementFromPoint(x,y)?.closest("button,a,input,select")))
        return {x1,x2,y};
    }
    throw Error("No unobstructed two-finger gesture start within original map");
  });
  const touchSession=await phone.context().newCDPSession(phone);
  const p=(x,y,id)=>({x:Math.round(x),y:Math.round(y),id});
  try {
    await touchSession.send("Input.dispatchTouchEvent",{
      type:"touchStart",touchPoints:[p(touch.x1,touch.y,1),p(touch.x2,touch.y,2)]
    });
    await touchSession.send("Input.dispatchTouchEvent",{
      type:"touchMove",touchPoints:[p(touch.x1-24,touch.y-30,1),p(touch.x2+35,touch.y+48,2)]
    });
    await touchSession.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
  }finally{await touchSession.detach();}
  await phone.waitForFunction(()=>{
    const zoom=Number.parseFloat(document.getElementById("aeZoomLabel").textContent);
    const text=document.getElementById("aePositionReadout").textContent;
    const angle=Number.parseInt(text.split("· ").at(-1),10);
    return zoom>1.1&&angle>7&&angle<90;
  },{timeout:10000});
  const gestureZoom=Number.parseFloat(await phone.locator("#aeZoomLabel").textContent());
  await phone.locator("#aeNorth").click();
  await phone.waitForFunction(()=>document.getElementById("aePositionReadout").textContent.includes("0°"));
  const northZoom=Number.parseFloat(await phone.locator("#aeZoomLabel").textContent());
  assert.ok(Math.abs(northZoom-gestureZoom)<.01,"Compass north reset must retain pinch zoom");
  await phone.locator("#aeFilters button[data-kind='ladder']").click();
  assert.equal(await phone.locator("#aeResults button").count(),1);
  await phone.locator("#aeResults button[data-record-id='hotel-z-ladder']").click();
  assert.equal(await phone.locator("#aeRouteSelect").inputValue(),"hotel-z-ladder");
  await phone.locator("#aeNextStep").click();
  assert.match(await phone.locator("#aeCurrentStep").textContent(),/Turn right/i);
  await phone.screenshot({path:output+"/atlas-mobile.png",fullPage:true});
  assert.equal(mobileErrors.length,0,"Mobile JavaScript errors: "+mobileErrors.join(" | "));
  await phone.close();await desktop.close();
  console.log("ATLAS_BROWSER_SMOKE_OK original map, 20 zones, 48 sectors, 21 lifts, 1 ladder, layer combinations, no fabricated scaffolds, desktop wheel/drag, true mobile two-finger pinch+rotation, north reset, route steps, photos");
}finally{
  if(browser)await browser.close();
  server.kill("SIGTERM");
}

