/* Real browser checks for fashion subguides and the corrected Fennekin mission. No network or actual feedback writes. */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawn} from "node:child_process";
import {request} from "node:http";
import {setTimeout as pause} from "node:timers/promises";
import {chromium} from "playwright";
const prefix="/lumiose-atlas-pokemon-za/";
const host="http://127.0.0.1:18767";
const base=host+prefix;
const root=fs.mkdtempSync(path.join(os.tmpdir(),"atlas-fashion-"));
const output="test-artifacts/fashion";
fs.mkdirSync(output,{recursive:true});
fs.symlinkSync(process.cwd(),path.join(root,"lumiose-atlas-pokemon-za"),"dir");
const server=spawn("python3",["-m","http.server","18767","--bind","127.0.0.1","--directory",root],{stdio:"ignore"});
let browser;
// Readiness uses a bodyless, non-pooled HEAD probe instead of an unconsumed
// fetch GET response. Node 22 Undici Parser.finish crashed here repeatedly.
// The subsequent Playwright page loads and assertions are unchanged.
function serverReady(url){
 return new Promise(resolve=>{
  const req=request(url,{method:"HEAD",agent:false},res=>{
   const ok=res.statusCode>=200&&res.statusCode<300;
   res.on("error",()=>resolve(false));res.on("end",()=>resolve(ok));res.resume();
  });
  req.setTimeout(1000,()=>req.destroy());req.on("error",()=>resolve(false));req.end();
 });
}
try {
 let ready=false;
 for(let i=0;i<40;i++){if(await serverReady(base+"shops.html")){ready=true;break;}await pause(150);}
 assert.ok(ready,"Local guide server unavailable");
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
 for(const [kind,width,height] of [["phone",393,852],["desktop",1440,900]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:kind==="phone",hasTouch:kind==="phone",deviceScaleFactor:1});
  await context.route("**/*",route=>route.request().url().startsWith(host+"/")?route.continue():route.abort());
  const page=await context.newPage();
  const errors=[];page.on("pageerror",error=>errors.push(String(error)));

  await page.goto(base+"shops.html",{waitUntil:"load"});
  const styleSection=page.locator("#fashion-subguides");
  assert.ok(await styleSection.isVisible());
  assert.equal(await page.locator("[data-style-kind='arcade']").count(),5);
  assert.equal(await page.locator("[data-style-boutique]").count(),41);
  assert.equal(await page.locator("[data-style-kind='salon']").count(),5);
  assert.ok(await page.locator('a[href="clothing-guide.html"]').count()>0);
  assert.ok(await page.locator('a[href="hair-beauty-guide.html"]').count()>0);
  const styleSearch=page.locator("#styleSearch");
  await styleSearch.fill("Naptime");
  assert.equal(await page.locator("[data-style-card]:visible").count(),1);
  assert.ok(await page.locator('[data-style-kind="arcade"]:visible details').evaluate(el=>el.open),"Matching boutique arcade must open on search");
  assert.match(await page.locator("#styleResultStatus").innerText(),/1 shopping arcade/);
  await styleSearch.fill("Coiffure Clips");
  assert.equal(await page.locator("[data-style-card]:visible").count(),1);
  assert.equal(await page.locator("[data-style-kind='salon']:visible h3").innerText(),"Coiffure Clips");
  await styleSearch.fill("invalid-style-qqqq");
  assert.ok(await page.locator("#styleNoResults").isVisible());
  await styleSearch.fill("");
  assert.equal(await page.locator("[data-style-card]:visible").count(),10);
  assert.ok((await page.locator("#styleResultStatus").innerText()).includes("5 shopping arcades and 5 salons"));
  const styleOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(styleOverflow<=1,kind+" Shops style directory horizontal overflow "+styleOverflow);
  await styleSection.screenshot({path:output+"/shops-style-directory-"+kind+".png"});
  for(const [file,anchor,selector,count] of [["clothing-guide.html","accessory-prices","[data-fashion-boutique]",41],["hair-beauty-guide.html","furfrou","[data-fashion-salon]",5]]){
   await page.goto(base+"shops.html",{waitUntil:"load"});
   const treasure=page.locator("#treasure-pocket details");
   assert.equal(await treasure.count(),1);
   await treasure.locator("summary").click();
   assert.equal(await treasure.getAttribute("open"),"");
   assert.ok(await treasure.getByText("₽20,000 each",{exact:true}).isVisible());
   await treasure.locator("summary").click();
   await page.locator('#fashion-subguides a[href="'+file+'"]').click();
   await page.waitForURL(base+file);
   assert.equal(await page.locator(selector).count(),count);
   assert.equal(await page.locator(".atlas-article-nav a").count(),25);
   assert.ok(await page.locator("h1").isVisible());
   assert.equal(await page.locator('.return-strip a[href="index.html#walkthrough"]').count(),1);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert.ok(overflow<=1,kind+" "+file+" horizontal overflow "+overflow);
   await page.screenshot({path:output+"/"+file.replace(".html","")+"-"+kind+".png"});
   await page.goto(base+file+"#"+anchor,{waitUntil:"load"});
   assert.ok(await page.locator("#"+anchor).isVisible());
   await page.waitForFunction(expected=>new URL(document.getElementById("atlasArticleFeedback").href).searchParams.get("page")===expected,prefix+file+"#"+anchor);
   const feedbackUrl=new URL(await page.locator("#atlasArticleFeedback").getAttribute("href"));
   assert.equal(feedbackUrl.searchParams.get("page"),prefix+file+"#"+anchor);
   await page.locator("#atlasArticleFeedback").click();
   await page.waitForURL(url=>url.pathname===prefix+"feedback.html");
   assert.equal(await page.locator("#page").inputValue(),prefix+file+"#"+anchor);
   assert.equal(new URL(await page.locator("#returnLink").evaluate(el=>el.href)).pathname,prefix+file);
   assert.equal(new URL(await page.locator("#returnLink").evaluate(el=>el.href)).hash,"#"+anchor);
   await page.locator("#returnLink").click();
   await page.waitForURL(base+file+"#"+anchor);
   // Also test a same-document hash change, not only a direct page load.
   await page.evaluate(()=>{location.hash="main";});
   await page.waitForFunction(expected=>new URL(document.getElementById("atlasArticleFeedback").href).searchParams.get("page")===expected,prefix+file+"#main");
  }
  await page.goto(base+"side-missions.html#quest-8",{waitUntil:"load"});
  const fennekin=page.locator('#quest-8');
  await page.waitForFunction(()=>document.querySelector('#quest-8 details.side-route').open);
  const instructions=await fennekin.innerText();
  assert.ok(instructions.includes('Branche')&&!instructions.includes('Jardin'));
  assert.ok(instructions.includes('Water-type attack')&&instructions.includes('ladder at the north end'));
  assert.ok(instructions.includes('₽1,200')&&instructions.includes('Fennekin (Lv. 14)'));
  assert.ok(await fennekin.locator('input[data-side-check="8"]').isDisabled());
  assert.equal(await fennekin.locator('a[href="index.html#sidequests:quest-8"]').count(),1);
  assert.equal(await fennekin.locator('a[href^="http"]').count(),0);
  const missionOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(missionOverflow<=1,kind+' mission 008 horizontal overflow '+missionOverflow);
  await fennekin.screenshot({path:output+'/mission-008-'+kind+'.png'});
  assert.deepEqual(errors,[],kind+" browser exceptions");
  await context.close();
 }
 console.log("PASS: clothing, beauty and corrected mission 008 on phone and desktop, 41 boutiques, five salons, navigation and feedback origin round-trips.");
}finally{
 if(browser)await browser.close();
 server.kill();
 fs.rmSync(root,{recursive:true,force:true});
}
