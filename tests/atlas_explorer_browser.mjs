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
  // Fail early with actual uncontained element bounds on the sector directory.
  const sectorProbe=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  await sectorProbe.goto(base+"/sector-maps.html",{waitUntil:"load"});
  const sectorBounds=await sectorProbe.evaluate(()=>{
    const width=document.documentElement.clientWidth;
    const over=[...document.querySelectorAll("body *")].filter(el=>{
      const b=el.getBoundingClientRect();
      if(!b.width||!b.height||b.right<=width+1)return false;
      for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
        if(["auto","scroll","hidden","clip"].includes(getComputedStyle(p).overflowX))return false;
      }
      return true;
    }).map(el=>({tag:el.tagName,id:el.id,cls:typeof el.className==="string"?el.className:"",right:Math.round(el.getBoundingClientRect().right),parent:el.parentElement.className,text:el.textContent.slice(0,85)})).sort((a,b)=>b.right-a.right).slice(0,15);
    return {width,body:document.body.scrollWidth,scroll:document.documentElement.scrollWidth,over};
  });
  console.log("SECTOR_PHONE_OVERFLOW "+JSON.stringify(sectorBounds));
  await sectorProbe.close();
  assert.ok(sectorBounds.width===393&&sectorBounds.body<=394&&sectorBounds.scroll<=394,"Sector directory must fit the phone; inspect diagnostics above");
  const desktop=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  const errors=[];
  desktop.on("pageerror",error=>errors.push(String(error)));
  await desktop.goto(base+"/atlas-explorer.html",{waitUntil:"networkidle"});
  await desktop.waitForFunction(()=>document.getElementById("aeStats").textContent.includes("21 owner-surveyed"),{timeout:20000});
  assert.match(await desktop.locator("#aeStats").textContent(),/20 Wild Zones · 48 named sectors · 21/);
  const natural=await desktop.locator("#aeMapImage").evaluate(img=>img.naturalWidth);
  assert.equal(natural,1920,"Real 1920px city map must load");
  assert.equal(await desktop.locator("#aeCoverageGrid button").count(),25,"Every part of original map has a region button");
  assert.equal(await desktop.locator("#aeCoverageDistricts button").count(),5);
  assert.equal(await desktop.locator("#aeCoverageSector option").count(),49,"48 sectors plus placeholder");
  await desktop.locator('#aeCoverageGrid button[data-area="1-1"]').click();
  await desktop.waitForFunction(()=>document.getElementById("aeCoverageStatus").textContent.includes("row 1, column 1")&&Number.parseFloat(document.getElementById("aeZoomLabel").textContent)>=3);
  assert.ok(Number.parseFloat(await desktop.locator("#aeZoomLabel").textContent())>=3,"Area button must zoom to genuine map pixels");
  await desktop.locator("#aeCoverageFullCity").click();
  await desktop.waitForFunction(()=>document.getElementById("aeZoomLabel").textContent.includes("1.00"));
  await desktop.locator('#aeCoverageDistricts button[data-district="Bleu"]').click();
  assert.match(await desktop.locator("#aeCoverageStatus").textContent(),/Bleu district.*starting area/);
  await desktop.locator("#aeCoverageSector").selectOption("bleu-sector-3");
  assert.match(await desktop.locator("#aeSelected").textContent(),/Bleu Sector 3/);
  assert.match(await desktop.locator("#aeCoverageStatus").textContent(),/NOT a verified sector centre/);
  assert.equal(await desktop.locator(".ae-pin[data-kind='zone']").count(),20);
  await desktop.locator("#aeCoverageFullCity").click();
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
  await desktop.locator("#aeRose").click();
  await desktop.waitForFunction(()=>document.getElementById("aePositionReadout").textContent.includes("0°"));
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
  assert.match(await desktop.locator("#aeSelected").textContent(),/six original|six|six|Follow six original/i);
  const cyclonePictures=desktop.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await cyclonePictures.count(),6,"All six original Cyclone photos must render");
  assert.match(await desktop.locator("#aeSelected .ae-photo-grid").textContent(),/Covered stone archway/i);
  assert.match(await desktop.locator("#aeSelected .ae-photo-grid").textContent(),/rooftop arrival/i);
  for(let i=0;i<6;i++)await cyclonePictures.nth(i).scrollIntoViewIfNeeded();
  await desktop.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].length===6 &&
    [...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth>0),{timeout:20000});
  await desktop.screenshot({path:output+"/atlas-cyclone-original-photos-desktop.png",fullPage:true});
  assert.equal(await desktop.locator("#aeRouteSelect").inputValue(),"cafe-cyclone");
  await desktop.locator("#aeNextStep").click();
  assert.match(await desktop.locator("#aeCurrentStep").textContent(),/archway/i);
  await desktop.locator("#aeNextStep").click();
  assert.match(await desktop.locator("#aeCurrentStep").textContent(),/grassy courtyard/i);
  await desktop.screenshot({path:output+"/atlas-desktop.png",fullPage:true});
  // AT-265: the owner's preferred game-only Mission #61 photographs, not TV-framed captures.
  await desktop.locator("#aeSearch").fill("My Favorite Holovator");
  await desktop.locator("#aeResults button[data-record-id='bleu3-fav']").click();
  assert.match(await desktop.locator("#aeSelected").textContent(),/Bleu Plaza/);
  const mission61Pictures=desktop.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await mission61Pictures.count(),5);
  for(let i=0;i<5;i++)await mission61Pictures.nth(i).scrollIntoViewIfNeeded();
  await desktop.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].length===5 &&
    [...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth===1536),{timeout:20000});
  await desktop.screenshot({path:output+"/atlas-mission061-clean-desktop.png",fullPage:true});
  // AT-278: a location card links back to that exact already-surveyed record.
  const mission61Link=desktop.locator('#aeSelected a[href="atlas-explorer.html?place=bleu3-fav"]');
  assert.equal(await mission61Link.count(),1);
  await mission61Link.click();
  await desktop.waitForURL("**/atlas-explorer.html?place=bleu3-fav");
  await desktop.waitForFunction(()=>document.querySelector("#aeSelected h3")?.textContent?.startsWith("My Favorite Holovator"));
  assert.equal(await desktop.locator('#aeResults button[data-record-id="bleu3-fav"]').getAttribute("aria-pressed"),"true");
  const reloaded61Pictures=desktop.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await reloaded61Pictures.count(),5,
    "Deep link must retain all five original mission 61 photographs");
  for(let i=0;i<5;i++)await reloaded61Pictures.nth(i).scrollIntoViewIfNeeded();
  await desktop.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].length===5 &&
    [...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth===1536),{timeout:20000});
  assert.match(await desktop.locator("#aeSelected").textContent(),/Approximate map pin/);
  await desktop.screenshot({path:output+"/at278-direct-holovator-desktop.png",fullPage:true});
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
  assert.equal(await phone.locator("#aeCoverageGrid button").count(),25);
  await phone.locator('#aeCoverageGrid button[data-area="5-5"]').click();
  await phone.waitForFunction(()=>document.getElementById("aeCoverageStatus").textContent.includes("row 5, column 5"));
  await phone.waitForFunction(()=>Number.parseFloat(document.getElementById("aeZoomLabel").textContent)>=3,
    {timeout:10000});
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,
    "Complete city selector must fit Android viewport");
  await phone.locator("#aeCoverageFullCity").click();
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
  await phone.locator("#aeRose").click();
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
  await phone.locator("#aeFilters button[data-kind='all']").click();
  await phone.locator("#aeSearch").fill("Wild Zone 6");
  await phone.locator("#aeResults button[data-record-id='jaune12-wz6']").click();
  assert.match(await phone.locator("#aeSelected").textContent(),/Houndour and Houndoom/i);
  const jaunePictures=phone.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await jaunePictures.count(),5,"Wild Zone 6 must show five owner images");
  for(let i=0;i<5;i++)await jaunePictures.nth(i).scrollIntoViewIfNeeded();
  await phone.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].length===5 &&
    [...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth>0),{timeout:20000});
  assert.match(await phone.locator("#aeSelected .ae-photo-grid").textContent(),/ground view|ground/i);
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,
    "New owner photo captions must not cause mobile horizontal overflow");
  await phone.screenshot({path:output+"/atlas-wildzone6-original-photos-mobile.png",fullPage:true});
  // AT-265: southern Café Classe lift is separate from the central and east Vert 4 units.
  await phone.locator("#aeSearch").fill("Café Classe south");
  await phone.locator("#aeResults button[data-record-id='vert4-south']").click();
  assert.match(await phone.locator("#aeSelected").textContent(),/east-side street-facing/i);
  const southPictures=phone.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await southPictures.count(),5);
  for(let i=0;i<5;i++)await southPictures.nth(i).scrollIntoViewIfNeeded();
  await phone.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].length===5 &&
    [...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth===1536),{timeout:20000});
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await phone.screenshot({path:output+"/atlas-vert4-south-mobile.png",fullPage:true});
  assert.equal(mobileErrors.length,0,"Mobile JavaScript errors: "+mobileErrors.join(" | "));
  // Every named-sector source card links to a real map; destination is a district view,
  // never a guessed sector pin. Validate this on a phone-sized browser.
  await phone.goto(base+"/sector-maps.html",{waitUntil:"networkidle"});
  await phone.waitForFunction(()=>document.querySelectorAll(".sector-open-city-map").length===48,{timeout:20000});
  assert.equal(await phone.locator(".sector-open-city-map").count(),48);
  await phone.locator("#sector-bleu-sector-3 .sector-open-city-map").click();
  await phone.waitForURL("**/atlas-explorer.html?sector=bleu-sector-3");
  await phone.waitForFunction(()=>document.getElementById("aeCoverageStatus").textContent.includes("Bleu Sector 3"));
  assert.equal(await phone.locator("#aeCoverageSector").inputValue(),"bleu-sector-3");
  assert.equal(await phone.locator(".ae-pin[data-kind='holovator']").count(),21);
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await phone.screenshot({path:output+"/atlas-bleu-sector-deeplink-mobile.png",fullPage:true});
  // AT-278: an existing photographed ladder and Wild Zone are directly shareable on phone.
  await phone.goto(base+"/atlas-explorer.html?place=hotel-z-ladder",{waitUntil:"networkidle"});
  await phone.waitForFunction(()=>document.querySelector("#aeSelected h3")?.textContent?.includes("Hotel Z"));
  assert.equal(await phone.locator("#aeRouteSelect").inputValue(),"hotel-z-ladder");
  assert.equal(await phone.locator('#aeResults button[data-record-id="hotel-z-ladder"]').getAttribute("aria-pressed"),"true");
  await phone.goto(base+"/atlas-explorer.html?place=wz-06",{waitUntil:"networkidle"});
  await phone.waitForFunction(()=>document.querySelector("#aeSelected h3")?.textContent==="Wild Zone 06");
  assert.equal(await phone.locator('#aeFilters button[data-kind="zone"]').getAttribute("aria-pressed"),"true");
  assert.match(await phone.locator("#aeSelected").textContent(),/source-saved Wild Zone centre/);
  await phone.goto(base+"/atlas-explorer.html?place=jaune12-wz6",{waitUntil:"networkidle"});
  await phone.waitForFunction(()=>document.querySelector("#aeSelected h3")?.textContent?.includes("Wild Zone 6"));
  const wz6EntryPictures=phone.locator("#aeSelected .ae-photo-grid img");
  assert.equal(await wz6EntryPictures.count(),5);
  for(let i=0;i<5;i++)await wz6EntryPictures.nth(i).scrollIntoViewIfNeeded();
  await phone.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].length===5 &&
    [...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth===1536),{timeout:20000});
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await phone.screenshot({path:output+"/at278-direct-wildzone6-mobile.png",fullPage:true});
  await phone.goto(base+"/atlas-explorer.html?place=unrecognized-place",{waitUntil:"networkidle"});
  await phone.waitForFunction(()=>document.getElementById("aeStats").textContent.includes("21 owner-surveyed"));
  assert.equal(await phone.locator("#aeSelected h3").textContent(),"Select a map pin or place",
    "Unknown links must not create or pretend to verify a map record");
  assert.equal(await phone.locator(".ae-pin[data-kind='holovator']").count(),21);
  // AT-279: browser-check Zygarde's safe-zone advice on desktop and phone, read-only.
  for(const [page,device] of [[desktop,"desktop"],[phone,"phone"]]){
    await page.goto(base+"/journey.html#journey-mission-42",{waitUntil:"domcontentloaded"});
    const tip=page.locator("#journey-mission-42 p.note");
    assert.equal(await tip.count(),1,"Mission 42 must have exactly one no-hit note");
    assert.match(await tip.textContent(),/two small unlit triangular pockets/);
    await tip.scrollIntoViewIfNeeded();
    assert.equal(await tip.isVisible(),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,
      "Mission 42 note must not cause horizontal overflow on "+device);
    await page.screenshot({path:output+"/at279-zygarde-mission42-"+device+".png",fullPage:false});
  }
  // AT-270: actual browser rendering of the researched finale route, on desktop and phone.
  // This checks content visibility while leaving every checkbox and map state unchanged.
  await desktop.goto(base+"/walkthrough.html#mission-37",{waitUntil:"domcontentloaded"});
  await desktop.waitForFunction(()=>document.querySelector("#mission-37 .route-index-details")?.open===true,{timeout:12000});
  assert.match(await desktop.locator("#mission-37").textContent(),/Mega Pidgeot[\s\S]*Mega Kangaskhan[\s\S]*Mega Garchomp/);
  assert.doesNotMatch(await desktop.locator("#mission-36").textContent(),/Mega Garchomp/);
  await desktop.locator("#mission-37").scrollIntoViewIfNeeded();
  await desktop.screenshot({path:output+"/at270-mission37-ally-battle-desktop.png",fullPage:false});
  await phone.goto(base+"/index.html#walkthrough:mission-37",{waitUntil:"domcontentloaded"});
  await phone.waitForFunction(()=>{
    const mission=document.getElementById("mission-37");
    return mission?.classList.contains("open")&&mission.textContent.includes("Mega Kangaskhan");
  },{timeout:15000});
  assert.match(await phone.locator("#mission-37").textContent(),/Ice Beam[\s\S]*Thunderbolt[\s\S]*Brick Break/);
  assert.equal(await phone.locator('#mission-37 input[data-check="37"]').count(),1,
    "Main story checkbox must still exist without being toggled");
  await phone.locator("#mission-37").scrollIntoViewIfNeeded();
  await phone.screenshot({path:output+"/at270-mission37-main-guide-phone.png",fullPage:false});
  await phone.goto(base+"/journey.html#journey-mission-37",{waitUntil:"domcontentloaded"});
  await phone.waitForFunction(()=>document.getElementById("journey-mission-37")?.textContent.includes("Mega Garchomp"),
    {timeout:15000});
  assert.match(await phone.locator("#journey-mission-37").textContent(),/level-62/);
  await phone.locator("#journey-mission-37").scrollIntoViewIfNeeded();
  await phone.screenshot({path:output+"/at270-mission37-journey-phone.png",fullPage:false});
  assert.equal(mobileErrors.length,0,"Mission 37 phone navigation JavaScript errors: "+mobileErrors.join(" | "));
  // AT-271: regression coverage for genuine player reports #13/#14 and safe Rank C advice.
  // The Atlas full-city tests above still run before these page-only checks.
  await desktop.goto(base+"/royale-guide.html#rank-c",{waitUntil:"domcontentloaded"});
  assert.match(await desktop.locator("#royale-match-8").textContent(),/Ground is neutral against Bug\/Poison Mega Scolipede/);
  await desktop.goto(base+"/walkthrough.html#mission-24",{waitUntil:"domcontentloaded"});
  await desktop.waitForFunction(()=>document.querySelector("#mission-24 .route-index-details")?.open===true,{timeout:12000});
  assert.match(await desktop.locator("#mission-24").textContent(),/TM100 Gunk Shot/);
  assert.match(await desktop.locator("#mission-24").textContent(),/Corbeau arrives and checks in/);
  await desktop.locator("#mission-24").scrollIntoViewIfNeeded();
  await desktop.screenshot({path:output+"/at271-mission24-after-corbeau-desktop.png",fullPage:false});

  await phone.goto(base+"/index.html#walkthrough:mission-25",{waitUntil:"domcontentloaded"});
  await phone.waitForFunction(()=>{
    const mission=document.getElementById("mission-25");
    return mission?.classList.contains("open")&&mission.textContent.includes("Mega Scrafty (Lv. 50");
  },{timeout:15000});
  assert.match(await phone.locator("#mission-25").textContent(),/Clawitzer[\s\S]*Vanillish[\s\S]*Emolga[\s\S]*Staryu/);
  assert.match(await phone.locator("#mission-25").textContent(),/Ariados[\s\S]*Sableye[\s\S]*Krookodile[\s\S]*Mega Scrafty/);
  assert.equal(await phone.locator('#mission-25 input[data-check="25"]').count(),1);
  await phone.locator("#mission-25").scrollIntoViewIfNeeded();
  await phone.screenshot({path:output+"/at271-mission25-main-guide-phone.png",fullPage:false});

  await phone.goto(base+"/journey.html#journey-mission-24",{waitUntil:"domcontentloaded"});
  await phone.waitForFunction(()=>document.getElementById("journey-mission-24")?.textContent.includes("TM100 Gunk Shot"),
    {timeout:12000});
  assert.match(await phone.locator("#journey-mission-24").textContent(),/Ground deals neutral damage to Mega Scolipede/);
  await phone.locator("#journey-mission-24").scrollIntoViewIfNeeded();
  await phone.screenshot({path:output+"/at271-mission24-journey-phone.png",fullPage:false});
  assert.equal(mobileErrors.length,0,"AT-271 phone browser errors: "+mobileErrors.join(" | "));
  // AT-272: click the actual main-guide "Continue the complete route" link on a phone.
  // The destination must be the real journey-mission-N anchor, not the old nonexistent mission-N.
  await phone.goto(base+"/index.html#walkthrough:mission-24",{waitUntil:"domcontentloaded"});
  await phone.waitForFunction(()=>document.getElementById("mission-24")?.classList.contains("open"),{timeout:15000});
  const nextJourney=phone.locator('#mission-24 a[href="journey.html#journey-mission-24"]');
  assert.ok(await nextJourney.count()>=1,"Missing corrected Mission 24 journey link");
  await nextJourney.first().click();
  await phone.waitForURL("**/journey.html#journey-mission-24",{timeout:12000});
  await phone.waitForFunction(()=>{
    const card=document.getElementById("journey-mission-24");
    const box=card?.getBoundingClientRect();
    return box&&box.top>=-20&&box.top<160;
  },{timeout:12000});
  assert.match(await phone.locator("#journey-mission-24").textContent(),/TM100 Gunk Shot/);
  await phone.screenshot({path:output+"/at272-journey-mission24-phone-deeplink.png",fullPage:false});

  // Repeat on desktop for a distant finale anchor; preserves AT-270's ally-battle notes.
  await desktop.goto(base+"/index.html#walkthrough:mission-37",{waitUntil:"domcontentloaded"});
  await desktop.waitForFunction(()=>document.getElementById("mission-37")?.classList.contains("open"),{timeout:12000});
  const finaleLink=desktop.locator('#mission-37 a[href="journey.html#journey-mission-37"]');
  assert.ok(await finaleLink.count()>=1);
  await finaleLink.first().click();
  await desktop.waitForURL("**/journey.html#journey-mission-37",{timeout:12000});
  await desktop.waitForFunction(()=>{
    const box=document.getElementById("journey-mission-37")?.getBoundingClientRect();
    return box&&box.top>=-20&&box.top<160;
  },{timeout:12000});
  assert.match(await desktop.locator("#journey-mission-37").textContent(),/Mega Garchomp/);
  await desktop.screenshot({path:output+"/at272-journey-mission37-desktop-deeplink.png",fullPage:false});
  assert.equal(mobileErrors.length,0,"AT-272 phone navigation errors: "+mobileErrors.join(" | "));
  // AT-273: click real recovered DLC links on desktop and phone, not guessed fragments.
  await desktop.goto(base+"/mega-dimension.html#hyper-1",{waitUntil:"domcontentloaded"});
  const dlcOne=desktop.locator('#hyper-1 a.dlc-index-primary[href="journey.html#journey-dlc-1"]');
  assert.equal(await dlcOne.count(),1,"DLC Mission 1 must have a real Complete Journey link");
  await desktop.locator("#hyper-1 details.dlc-index-detail > summary").click();
  await dlcOne.click();
  await desktop.waitForURL("**/journey.html#journey-dlc-1",{timeout:12000});
  await desktop.waitForFunction(()=>{
    const card=document.getElementById("journey-dlc-1");
    const box=card?.getBoundingClientRect();
    return box && box.top>=-20 && box.top<160;
  },{timeout:12000});
  assert.equal(await desktop.locator("#journey-dlc-1").isVisible(),true);
  await desktop.screenshot({path:output+"/at273-journey-dlc1-desktop.png",fullPage:false});

  await phone.goto(base+"/mega-dimension.html#hyper-14",{waitUntil:"domcontentloaded"});
  const dlcFourteen=phone.locator('#hyper-14 a.dlc-index-primary[href="journey.html#journey-dlc-14"]');
  assert.equal(await dlcFourteen.count(),1,"DLC Mission 14 must have a real Complete Journey link");
  await phone.locator("#hyper-14 details.dlc-index-detail > summary").click();
  await dlcFourteen.click();
  await phone.waitForURL("**/journey.html#journey-dlc-14",{timeout:12000});
  await phone.waitForFunction(()=>{
    const card=document.getElementById("journey-dlc-14");
    const box=card?.getBoundingClientRect();
    return box && box.top>=-20 && box.top<160;
  },{timeout:12000});
  assert.equal(await phone.locator("#journey-dlc-14").isVisible(),true);
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,
    "Completed DLC Journey anchor must remain within phone viewport");
  await phone.screenshot({path:output+"/at273-journey-dlc14-phone.png",fullPage:false});
  assert.equal(errors.length,0,"Desktop DLC link navigation JavaScript errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"Phone DLC link navigation JavaScript errors: "+mobileErrors.join(" | "));
  // AT-274: real desktop/Android-sized click from Coverage and known gaps to
  // the native, readable article. Never open a raw .md source document to players.
  await desktop.goto(base+"/index.html#home",{waitUntil:"domcontentloaded"});
  const coverageDesktop=desktop.locator('.rebuild-notice a[href="coverage.html"]');
  assert.equal(await coverageDesktop.count(),1,"Coverage banner must use HTML destination");
  await coverageDesktop.click();
  await desktop.waitForURL("**/coverage.html",{timeout:12000});
  assert.match(await desktop.locator("h1").textContent(),/Coverage .*known gaps/i);
  assert.equal(await desktop.locator(".coverage-card").count(),4);
  assert.equal(await desktop.locator(".atlas-article-nav a").count(),25);
  assert.match(await desktop.locator("#needs-verification").textContent(),/Hyperspace/i);
  assert.equal(await desktop.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,
    "Coverage desktop layout must fit viewport");
  await desktop.screenshot({path:output+"/at274-coverage-known-gaps-desktop.png",fullPage:false});

  await phone.goto(base+"/index.html#home",{waitUntil:"domcontentloaded"});
  const coveragePhone=phone.locator('.rebuild-notice a[href="coverage.html"]');
  assert.equal(await coveragePhone.count(),1,"Coverage button missing on Android viewport");
  await coveragePhone.click();
  await phone.waitForURL("**/coverage.html",{timeout:12000});
  assert.equal(await phone.locator(".coverage-gap-list li").count(),5);
  assert.equal(await phone.locator(".atlas-article-nav a").count(),25);
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,
    "Coverage page must be readable without horizontal phone scrolling");
  await phone.screenshot({path:output+"/at274-coverage-known-gaps-phone.png",fullPage:false});
  await phone.locator('.return-strip a[href="index.html#walkthrough"]').click();
  await phone.waitForURL("**/index.html#walkthrough",{timeout:12000});
  await phone.waitForFunction(()=>document.getElementById("walkthrough")?.classList.contains("active"),
    {timeout:12000});
  assert.equal(mobileErrors.length,0,"Coverage phone JS errors: "+mobileErrors.join(" | "));
  assert.equal(errors.length,0,"Coverage desktop JS errors: "+errors.join(" | "));
  // AT-276: click a restored Wild Zone link from the real Mission 3 card on Android.
  await phone.goto(base+"/index.html#walkthrough:mission-3",{waitUntil:"domcontentloaded"});
  await phone.waitForFunction(()=>document.getElementById("mission-3")?.classList.contains("open"),
    {timeout:15000});
  const storyZone=phone.locator('#mission-3 a[href="sector-maps.html#wildzone-1"]');
  assert.equal(await storyZone.count(),1,"Missing real Zone 1 directory link from Mission 3");
  await storyZone.click();
  await phone.waitForURL("**/sector-maps.html#wildzone-1",{timeout:12000});
  await phone.waitForLoadState("load");
  await phone.waitForFunction(()=>{
    const card=document.getElementById("wildzone-1");
    const heading=card?.querySelector(".wildzone-card-head h3");
    const rect=heading?.getBoundingClientRect();
    return card&&!card.hidden&&rect&&rect.top>=-30&&rect.top<innerHeight-80;
  },{timeout:12000});
  assert.match(await phone.locator("#wildzone-1").textContent(),/Wild Zone 1/);
  assert.equal(await phone.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  await phone.screenshot({path:output+"/at276-mission3-wildzone1-phone.png",fullPage:false});

  // AT-276: a main-guide DLC chapter must open the exact existing Journey mission.
  await desktop.goto(base+"/index.html#dimension",{waitUntil:"domcontentloaded"});
  const mainDlc=desktop.locator('a[href="journey.html#journey-dlc-14"]').last();
  assert.ok(await mainDlc.count()>=1,"Missing corrected final DLC mission shortcut");
  await mainDlc.click();
  await desktop.waitForURL("**/journey.html#journey-dlc-14",{timeout:12000});
  await desktop.waitForFunction(()=>{
    const rect=document.getElementById("journey-dlc-14")?.getBoundingClientRect();
    return rect&&rect.top>=-30&&rect.top<180;
  },{timeout:12000});
  assert.equal(await desktop.locator("#journey-dlc-14").isVisible(),true);
  await desktop.screenshot({path:output+"/at276-main-guide-dlc14-desktop.png",fullPage:false});
  assert.equal(errors.length,0,"AT-276 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-276 Android JS errors: "+mobileErrors.join(" | "));
  // AT-277: navigating to a real mission must reveal it even when the player's
  // current search has hidden it. No progress state or map behaviour is touched.
  await phone.goto(base+"/index.html#walkthrough",{waitUntil:"load"});
  await phone.locator("#missionSearch").fill("Mega Garchomp");
  assert.equal(await phone.locator("#mission-3").isHidden(),true,
    "Precondition: a story search must hide unrelated Mission 3");
  await phone.evaluate(()=>{location.hash="#walkthrough:mission-3";});
  await phone.waitForFunction(()=>{
    const mission=document.getElementById("mission-3");
    const bounds=mission?.getBoundingClientRect();
    return mission&&!mission.hidden&&mission.classList.contains("open")&&
      document.getElementById("missionSearch").value===""&&
      document.querySelector('#missionTabs [data-filter="All"]')?.classList.contains("active")&&
      bounds&&bounds.top>=70&&bounds.top<180;
  },undefined,{timeout:15000});
  await phone.screenshot({path:output+"/at277-filtered-mission3-phone.png",fullPage:false});
  // A target that is already visible under a specific search must not reset
  // the player's chosen search merely because it was deep-linked.
  await phone.evaluate(()=>{location.hash="#walkthrough";});
  await phone.locator("#missionSearch").fill("A New Life in Lumiose City");
  assert.equal(await phone.locator("#mission-3").isVisible(),true);
  await phone.evaluate(()=>{location.hash="#walkthrough:mission-3";});
  await phone.waitForFunction(()=>
    document.getElementById("mission-3")?.classList.contains("open")&&
    document.getElementById("missionSearch")?.value==="A New Life in Lumiose City",
    undefined,{timeout:12000});


  // The identical defect affects Side Missions when the old DLC-only chapter
  // filter hides a base-game request that was opened by a canonical deep link.
  await desktop.goto(base+"/index.html#sidequests",{waitUntil:"load"});
  await desktop.locator('#sideTabs [data-filter="Mega Dimension"]').click();
  assert.equal(await desktop.locator("#quest-22").isHidden(),true,
    "Precondition: the DLC filter must hide base-game Side Mission 22");
  await desktop.evaluate(()=>{location.hash="#sidequests:quest-22";});
  await desktop.waitForFunction(()=>{
    const quest=document.getElementById("quest-22");
    const bounds=quest?.getBoundingClientRect();
    return quest&&!quest.hidden&&document.getElementById("sideSearch").value===""&&
      document.querySelector('#sideTabs [data-filter="All"]')?.classList.contains("active")&&
      bounds&&bounds.top>=70&&bounds.top<180;
  },undefined,{timeout:15000});
  await desktop.screenshot({path:output+"/at277-filtered-quest22-desktop.png",fullPage:false});
  assert.equal(errors.length,0,"AT-277 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-277 phone JS errors: "+mobileErrors.join(" | "));


  // AT-286: two independently researched written routes use existing district
  // views, not fabricated device, item or spawn pins. Both map and quest
  // navigation remain usable on touch and desktop.
  for(const [page,sector,route,mission,roofText] of [
    [phone,"vert-sector-7","vert7-holovator-power",40,/leaf bridge/i],
    [desktop,"jaune-sector-6","jaune6-holovator-muscle",56,/Wild Charge TM and wild Larvitar/i]
  ]){
    await page.goto(base+"/atlas-explorer.html?sector="+sector,{waitUntil:"load"});
    await page.waitForFunction(id=>document.getElementById("aeRouteSelect")?.value===id,route);
    assert.equal(await page.locator("#aeCoverageSector").inputValue(),sector);
    assert.equal(await page.locator("#aeRouteSelect option").count(),13);
    assert.equal(await page.locator(".ae-pin[data-kind='holovator']").count(),21);
    assert.equal(await page.locator(".ae-pin[data-kind='ladder']").count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='sector']").count(),0);
    assert.match(await page.locator("#aeRouteDetail").textContent(),/District starting view only/);
    assert.equal(await page.locator('#aeRouteDetail a[href="side-missions.html#quest-'+mission+'"]').count(),1);
    assert.equal(await page.locator("#aeShowRouteMap").textContent(),"Show district starting map");
    for(let step=0;step<3;step++)await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),roofText);
    const stepBefore=await page.locator("#aeRouteProgress").textContent();
    await page.locator("#aeShowRouteMap").click();
    assert.equal(await page.locator("#aeRouteProgress").textContent(),stepBefore);
    assert.match(await page.locator("#aeCoverageStatus").textContent(),/NOT a verified sector centre/);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await page.locator("#aeRoutesSection").scrollIntoViewIfNeeded();
    await page.screenshot({path:output+"/at286-mission-"+mission+"-route.png",fullPage:false});
    await page.locator('#aeRouteDetail a[href="side-missions.html#quest-'+mission+'"]').click();
    await page.waitForURL("**/side-missions.html#quest-"+mission);
    assert.equal(await page.locator("#quest-"+mission).isVisible(),true);
  }
  assert.equal(errors.length,0,"AT-286 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-286 phone JS errors: "+mobileErrors.join(" | "));

  // AT-288: district-only courtyard instructions and links to the original
  // three five-photo Holovator galleries. Never convert the course into a pin.
  for(const [page,device] of [[phone,"phone"],[desktop,"desktop"]]){
    await page.goto(base+"/atlas-explorer.html?sector=vert-sector-4",{waitUntil:"load"});
    await page.waitForFunction(()=>document.getElementById("aeRouteSelect")?.value==="vert4-courtyard-screws");
    assert.equal(await page.locator("#aeCoverageSector").inputValue(),"vert-sector-4");
    assert.equal(await page.locator("#aeRouteSelect option").count(),13);
    assert.match(await page.locator("#aeRouteDetail").textContent(),/District starting view only/);
    assert.equal(await page.locator('#aeRouteDetail a[href="MAPS_ACCESS_ROUTE_SURVEY.json"]').count(),1);
    for(const id of ["vert4-south","vert4-central","vert4-east"])
      assert.equal(await page.locator('#aeRouteDetail a[href="atlas-explorer.html?place='+id+'"]').count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='holovator']").count(),21);
    assert.equal(await page.locator(".ae-pin[data-kind='scaffold']").count(),0);
    assert.equal(await page.locator(".ae-pin[data-kind='ladder']").count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='sector']").count(),0);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Ralts and Bunnelby/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/dark scaffold panels.*blue-shuttered/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/original clue #8/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/#6 and #7/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/TM033 Body Slam/);
    const step=await page.locator("#aeRouteProgress").textContent();
    await page.locator("#aeShowRouteMap").click();
    assert.equal(await page.locator("#aeRouteProgress").textContent(),step);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at288-vert4-route-"+device+".png",fullPage:false});
    for(const id of ["vert4-central","vert4-east","vert4-south"]){
      await page.locator('#aeRouteDetail a[href="atlas-explorer.html?place='+id+'"]').click();
      await page.waitForURL("**/atlas-explorer.html?place="+id);
      await page.waitForFunction(()=>document.querySelectorAll("#aeSelected .ae-photo-grid img").length===5);
      const pics=page.locator("#aeSelected .ae-photo-grid img");
      assert.equal(await pics.count(),5);
      for(let i=0;i<5;i++)await pics.nth(i).scrollIntoViewIfNeeded();
      await page.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth===1536));
      assert.match(await page.locator("#aeSelected").textContent(),/Approximate map pin/);
      await page.locator("#aeSelected .ae-route-link").click();
      assert.equal(await page.locator("#aeRouteSelect").inputValue(),"vert4-courtyard-screws");
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
      if(id==="vert4-central")await page.screenshot({path:output+"/at288-vert4-gallery-"+device+".png",fullPage:true});
    }
  }
  assert.equal(errors.length,0,"AT-288 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-288 phone JS errors: "+mobileErrors.join(" | "));

  // AT-289: both distinct Vert 5 scaffold routes, the optional ground TM,
  // and the unresolved cross-sector ladder route. No new pins or save keys.
  for(const [page,device] of [[phone,"phone"],[desktop,"desktop"]]){
    await page.goto(base+"/atlas-explorer.html?sector=vert-sector-5",{waitUntil:"load"});
    await page.waitForFunction(()=>document.getElementById("aeRouteSelect")?.value==="vert5-scaffold-courses");
    assert.equal(await page.locator("#aeCoverageSector").inputValue(),"vert-sector-5");
    assert.equal(await page.locator("#aeRouteSelect option").count(),13);
    assert.match(await page.locator("#aeRouteDetail").textContent(),/District starting view only/);
    assert.equal(await page.locator('#aeRouteDetail a[href="MAPS_ACCESS_ROUTE_SURVEY.json"]').count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='holovator']").count(),21);
    assert.equal(await page.locator(".ae-pin[data-kind='ladder']").count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='scaffold']").count(),0);
    assert.equal(await page.locator(".ae-pin[data-kind='sector']").count(),0);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Grassy plaza scaffold/);
    assert.match(await page.locator("#aeCurrentStep").textContent(),/#1 is a likely match/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Separate enclosed courtyard scaffold/);
    assert.match(await page.locator("#aeCurrentStep").textContent(),/#5 is a likely candidate/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/pipe-lined wall.*not a verified connection/);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at289-vert5-roof-"+device+".png",fullPage:false});
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/TM001 Headbutt.*Rock Smash/);
    const step=await page.locator("#aeRouteProgress").textContent();
    await page.locator("#aeShowRouteMap").click();
    assert.equal(await page.locator("#aeRouteProgress").textContent(),step);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at289-vert5-tm-"+device+".png",fullPage:false});
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Main Mission 16.*Beedrillite/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Remaining alignment checks/);
    assert.ok(await page.locator("#aeNextStep").isDisabled());
    await page.locator("#aePrevStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Main Mission 16/);
  }
  assert.equal(errors.length,0,"AT-289 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-289 phone JS errors: "+mobileErrors.join(" | "));

  // AT-290: Racine lobby, distinct scaffold routes, Le Nah ladder and
  // rooftop TMs. Source coordinates remain provenance, not new map pins.
  for(const [page,device] of [[phone,"phone"],[desktop,"desktop"]]){
    await page.goto(base+"/atlas-explorer.html?sector=vert-sector-6",{waitUntil:"load"});
    await page.waitForFunction(()=>document.getElementById("aeRouteSelect")?.value==="vert6-racine-rooftop-courses");
    assert.equal(await page.locator("#aeCoverageSector").inputValue(),"vert-sector-6");
    assert.equal(await page.locator("#aeRouteSelect option").count(),13);
    assert.match(await page.locator("#aeRouteDetail").textContent(),/District starting view only/);
    assert.equal(await page.locator('#aeRouteDetail a[href="MAPS_ACCESS_ROUTE_SURVEY.json"]').count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='holovator']").count(),21);
    assert.equal(await page.locator(".ae-pin[data-kind='ladder']").count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='scaffold']").count(),0);
    assert.equal(await page.locator(".ae-pin[data-kind='sector']").count(),0);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Screw #19.*TM066 Volt Switch.*Main Mission 15/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Park-side scaffold.*#20–21.*not yet matched/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/South Boulevard scaffold.*#20–21 remains unresolved/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Restaurant Le Nah rooftop Screw #22.*exact ladder base/);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at290-vert6-restaurant-"+device+".png",fullPage:false});
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/TM080 Iron Defense.*Roto-Glide/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/TM074 Shadow Ball.*Coulant Waterway/);
    const step=await page.locator("#aeRouteProgress").textContent();
    await page.locator("#aeShowRouteMap").click();
    assert.equal(await page.locator("#aeRouteProgress").textContent(),step);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at290-vert6-tm-"+device+".png",fullPage:false});
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Coulant Waterway approach.*#16.*not a new pickup/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Remaining map alignment.*No new permanent pin/);
    assert.ok(await page.locator("#aeNextStep").isDisabled());
    await page.locator("#aePrevStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Optional Coulant Waterway approach/);
  }
  assert.equal(errors.length,0,"AT-290 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-290 phone JS errors: "+mobileErrors.join(" | "));

  // AT-293: preserve the original Vernal gallery and distinguish the
  // visible ladder, alternative alley route and separate TM.
  for(const [page,device] of [[phone,"phone"],[desktop,"desktop"]]){
    await page.goto(base+"/atlas-explorer.html?sector=vert-sector-9",{waitUntil:"load"});
    await page.waitForFunction(()=>document.getElementById("aeRouteSelect")?.value==="vert9-vernal-rooftop-screw");
    assert.equal(await page.locator("#aeCoverageSector").inputValue(),"vert-sector-9");
    assert.equal(await page.locator("#aeRouteSelect option").count(),13);
    assert.match(await page.locator("#aeRouteDetail").textContent(),/District starting view only/);
    assert.equal(await page.locator('#aeRouteDetail a[href="MAPS_ACCESS_ROUTE_SURVEY.json"]').count(),1);
    assert.equal(await page.locator('#aeRouteDetail a[href="side-missions.html#quest-23"]').count(),1);
    assert.equal(await page.locator('#aeRouteDetail a[href="atlas-explorer.html?place=vernal-wz1"]').count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='holovator']").count(),21);
    assert.equal(await page.locator(".ae-pin[data-kind='ladder']").count(),1);
    assert.equal(await page.locator(".ae-pin[data-kind='scaffold']").count(),0);
    assert.equal(await page.locator(".ae-pin[data-kind='sector']").count(),0);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Main Mission 10.*Terra.*level 28 Diggersby/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/visible ladder.*does not establish a safe crossing/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Rooftop Screw #2.*Roto-Glide/);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at293-vert9-screw-"+device+".png",fullPage:false});
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/Alternative alley ladder.*purple sludge/);
    await page.locator("#aeNextStep").click();
    assert.match(await page.locator("#aeCurrentStep").textContent(),/TM019 Power Gem.*Vert 5\/9 sector label/);
    const step=await page.locator("#aeRouteProgress").textContent();
    await page.locator("#aeShowRouteMap").click();
    assert.equal(await page.locator("#aeRouteProgress").textContent(),step);
    await page.locator("#aeCurrentStep").scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:output+"/at293-vert9-tm-"+device+".png",fullPage:false});
    await page.locator("#aeNextStep").click();
    assert.ok(await page.locator("#aeNextStep").isDisabled());
    await page.locator('#aeRouteDetail a[href="atlas-explorer.html?place=vernal-wz1"]').click();
    await page.waitForURL("**/atlas-explorer.html?place=vernal-wz1");
    await page.waitForFunction(()=>document.querySelectorAll("#aeSelected .ae-photo-grid img").length===5);
    for(let i=0;i<5;i++)await page.locator("#aeSelected .ae-photo-grid img").nth(i).scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>[...document.querySelectorAll("#aeSelected .ae-photo-grid img")].every(img=>img.complete&&img.naturalWidth===1536));
    await page.locator("#aeSelected .ae-route-link").click();
    assert.equal(await page.locator("#aeRouteSelect").inputValue(),"vert9-vernal-rooftop-screw");
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  assert.equal(errors.length,0,"AT-293 desktop JS errors: "+errors.join(" | "));
  assert.equal(mobileErrors.length,0,"AT-293 phone JS errors: "+mobileErrors.join(" | "));

  // Phone-page overflow regression: test the actual main-guide views, not just
  // the desktop DLC link or the standalone map. Never disable local scrolling.
  const widthProbe = await browser.newPage({viewport:{width:393,height:852},
    deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const widths = [];
  const mainViews = ["home","walkthrough","sidequests","dimension","bosses","alphas",
    "maps","items","legends","berries","starters","pokedex","essentials","secrets","rewards","battles","sources"];
  await widthProbe.goto(base+"/index.html#dimension",{waitUntil:"domcontentloaded"});
  for (const view of mainViews) {
    await widthProbe.evaluate(id=>{location.hash="#"+id;},view);
    await widthProbe.waitForFunction(id=>document.getElementById(id)?.classList.contains("active"),view);
    await pause(350);
    const measurement=await widthProbe.evaluate(()=>{
      window.scrollTo({left:0,top:0,behavior:"instant"});
      const root=document.documentElement, width=root.clientWidth;
      const over=[...document.querySelectorAll("body *")].filter(el=>{
        const b=el.getBoundingClientRect();
        if(!b.width||!b.height||b.right<=width+1)return false;
        for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){
          if(["auto","scroll","hidden","clip"].includes(getComputedStyle(p).overflowX))return false;
        }
        return true;
      }).map(el=>({tag:el.tagName,id:el.id,cls:typeof el.className==="string"?el.className:"",right:Math.round(el.getBoundingClientRect().right)}))
        .sort((a,b)=>b.right-a.right).slice(0,10);
      window.scrollTo({left:100000,top:0,behavior:"instant"});
      const moved=window.scrollX;
      window.scrollTo({left:0,top:0,behavior:"instant"});
      return {width,scrollWidth:root.scrollWidth,bodyWidth:document.body.scrollWidth,moved,over};
    });
    widths.push({view,...measurement});
  }
  console.log("MOBILE_GUIDE_WIDTH_DIAGNOSTICS "+JSON.stringify(widths));
  const failures=widths.filter(x=>x.width!==393||x.scrollWidth>x.width+1||x.bodyWidth>x.width+1||x.moved>1);
  assert.deepEqual(failures,[],"Main guide must never horizontally scroll on a 393px phone");
  // Swiping the 25-link navigation remains intentional; it must not drag the page.
  assert.equal(await widthProbe.locator("#sideNav a").count(),25);
  const navTravel=await widthProbe.locator(".sidebar").evaluate(el=>{
    el.scrollLeft=0;const before=el.scrollLeft;el.scrollLeft=el.scrollWidth;
    return el.scrollLeft-before;
  });
  assert.ok(navTravel>0,"Phone menu must retain horizontal scrolling");
  assert.equal(await widthProbe.evaluate(()=>window.scrollX),0);

  // Confirm the oversized seasonal table still works as a LOCAL scroller
  // and switching back to DLC does not retain the enlarged visual viewport.
  await widthProbe.evaluate(()=>{location.hash="#battles";});
  await widthProbe.waitForFunction(()=>document.getElementById("battles")?.classList.contains("active"));
  const tableTravel=await widthProbe.locator(".battle-season").evaluate(el=>{
    el.scrollLeft=0;const before=el.scrollLeft;el.scrollLeft=el.scrollWidth;
    return el.scrollLeft-before;
  });
  assert.ok(tableTravel>0,"Wide battle table must remain locally scrollable");
  assert.equal(await widthProbe.evaluate(()=>window.scrollX),0);
  await widthProbe.screenshot({path:output+"/phone-ranked-battles-contained.png"});
  for(const width of [320,360,393,430]){
    await widthProbe.setViewportSize({width,height:852});
    for(const view of ["battles","dimension"]){
      await widthProbe.evaluate(id=>{location.hash="#"+id;},view);
      await widthProbe.waitForFunction(id=>document.getElementById(id)?.classList.contains("active"),view);
      await pause(300);
      const bounds=await widthProbe.evaluate(()=>{
        const root=document.documentElement;
        const intro=document.querySelector(".view.active .page-intro");
        return {client:root.clientWidth,scroll:root.scrollWidth,body:document.body.scrollWidth,
          x:window.scrollX,mainRight:document.querySelector("main").getBoundingClientRect().right,
          introRight:intro?.getBoundingClientRect().right||0};
      });
      assert.equal(bounds.client,width,`Wrong layout viewport at ${width}px #${view}`);
      assert.ok(bounds.scroll<=width+1&&bounds.body<=width+1&&bounds.x===0&&bounds.mainRight<=width+1&&bounds.introRight<=width+1,
        `Phone overflow at ${width}px #${view}: ${JSON.stringify(bounds)}`);
      if(width===393&&view==="dimension")await widthProbe.screenshot({path:output+"/phone-dlc-contained.png"});
    }
  }
  // All recovered standalone guide pages share the phone guard. Feedback
  // screens are deliberately excluded because their separate workflow owns them.
  await widthProbe.setViewportSize({width:393,height:852});
  const articlePages=["alphas","atlas-explorer","battles","boss-guide","coverage","home-connection",
    "hyperspace-maps","items","journey","legendaries","mable-research","maps",
    "mega-dimension","rewards","royale-guide","sector-maps","shiny-hunting",
    "shops","side-missions","type-chart","walkthrough"];
  const articleWidths=[];
  for(const slug of articlePages){
    await widthProbe.goto(base+"/"+slug+".html",{waitUntil:"load"});
    const bounds=await widthProbe.evaluate(()=>{
      const root=document.documentElement;
      return {client:root.clientWidth,scroll:root.scrollWidth,body:document.body.scrollWidth,x:window.scrollX};
    });
    articleWidths.push({slug,...bounds});
  }
  console.log("MOBILE_ARTICLE_WIDTH_DIAGNOSTICS "+JSON.stringify(articleWidths));
  assert.deepEqual(articleWidths.filter(x=>x.client!==393||x.scroll>394||x.body>394||x.x!==0),[],
    "Every standalone guide page must fit the phone without disabling local maps or tables");
  await widthProbe.close();

  await phone.close();await desktop.close();
  console.log("ATLAS_BROWSER_SMOKE_OK source map, 20 zones, 48 sectors, 21 lifts, 111 owner JPGs, native desktop/touch gestures, all 21 added images loaded in Cyclone, Wild Zone 6, #61 and Café Classe south galleries, no made-up pins, original routes retained");
}finally{
  if(browser)await browser.close();
  server.kill("SIGTERM");
}

