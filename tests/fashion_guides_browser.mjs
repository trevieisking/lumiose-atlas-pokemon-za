/* Real browser checks for fashion subguides. No network or actual feedback writes. */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawn} from "node:child_process";
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
try {
 let ready=false;
 for(let i=0;i<40;i++){try{if((await fetch(base+"shops.html")).ok){ready=true;break;}}catch{}await pause(150);}
 assert.ok(ready,"Local guide server unavailable");
 browser=await chromium.launch({channel:"chrome",headless:true,args:["--no-sandbox"]});
 for(const [kind,width,height] of [["phone",393,852],["desktop",1440,900]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:kind==="phone",hasTouch:kind==="phone",deviceScaleFactor:1});
  await context.route("**/*",route=>route.request().url().startsWith(host+"/")?route.continue():route.abort());
  const page=await context.newPage();
  const errors=[];page.on("pageerror",error=>errors.push(String(error)));
  for(const [file,anchor,selector,count] of [["clothing-guide.html","accessory-prices","[data-fashion-boutique]",41],["hair-beauty-guide.html","furfrou","[data-fashion-salon]",5]]){
   await page.goto(base+"shops.html",{waitUntil:"load"});
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
   await page.waitForFunction(()=>document.getElementById("atlasArticleFeedback").href.includes("page="));
   const feedbackUrl=new URL(await page.locator("#atlasArticleFeedback").getAttribute("href"));
   assert.equal(feedbackUrl.searchParams.get("page"),prefix+file+"#"+anchor);
   await page.locator("#atlasArticleFeedback").click();
   await page.waitForURL(url=>url.pathname===prefix+"feedback.html");
   assert.equal(await page.locator("#page").inputValue(),prefix+file+"#"+anchor);
   assert.equal(new URL(await page.locator("#returnLink").evaluate(el=>el.href)).pathname,prefix+file);
   assert.equal(new URL(await page.locator("#returnLink").evaluate(el=>el.href)).hash,"#"+anchor);
   await page.locator("#returnLink").click();
   await page.waitForURL(base+file+"#"+anchor);
  }
  assert.deepEqual(errors,[],kind+" browser exceptions");
  await context.close();
 }
 console.log("PASS: clothing and beauty on phone and desktop, 41 boutiques, five salons, navigation and feedback origin round-trips.");
}finally{
 if(browser)await browser.close();
 server.kill();
 fs.rmSync(root,{recursive:true,force:true});
}
