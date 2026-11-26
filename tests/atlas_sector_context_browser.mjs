/* AT-345 actual Chromium phone/desktop proof. Public sector images are owner-supplied originals. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
import {chromium} from 'playwright';
import {sectorContextFor} from '../atlas-sector-context.mjs';

const port=18778,base='http://127.0.0.1:'+port,output='test-artifacts/atlas-sector-context';
const sample=['jaune-sector-2','vert-sector-4','bleu-sector-5','magenta-sector-8','rouge-sector-6'];
fs.mkdirSync(output,{recursive:true});
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
try{
  let ready=false;
  for(let attempt=0;attempt<40;attempt++){try{if((await fetch(base+'/atlas-explorer.html')).ok){ready=true;break;}}catch{}await pause(150);}
  assert.ok(ready,'Atlas static HTTP server did not start');
  browser=await chromium.launch({...(process.env.ATLAS_CHROME_EXECUTABLE?{executablePath:process.env.ATLAS_CHROME_EXECUTABLE}:{channel:'chrome'}),headless:true,args:['--no-sandbox']});
  for(const [device,width,height] of [['phone',393,852],['desktop',1440,900]]){
    const context=await browser.newContext({viewport:{width,height},isMobile:device==='phone',hasTouch:device==='phone',deviceScaleFactor:1});
    await context.addInitScript(()=>{
      const key='lumiose-atlas-reconstruction-v1';
      if(localStorage.getItem(key)===null)localStorage.setItem(key,JSON.stringify({pickup:{'2-5':true},screw:{'29':true},preservedFutureField:{original:'AT345 no progress writes'}}));
    });
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    const saved=JSON.stringify({pickup:{'2-5':true},screw:{'29':true},preservedFutureField:{original:'AT345 no progress writes'}});
    for(const id of sample){
      await page.goto(base+'/atlas-explorer.html?area='+encodeURIComponent(id),{waitUntil:'domcontentloaded'});
      const image=page.locator('.aa-context-image');
      await image.waitFor({state:'attached',timeout:15000});
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(async img=>{if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true});});});
      const record=sectorContextFor(id);
      assert.equal(await image.getAttribute('src'),record.path,id+' must load selected owner original');
      const size=await image.evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight}));
      assert.equal(size.width,record.width);assert.equal(size.height,record.height);
      const link=page.locator('.aa-context-link');
      assert.equal(await link.getAttribute('href'),record.path);
      assert.match(await link.getAttribute('aria-label'),/Open full original game-map photograph/);
      assert.ok(await page.locator('.aa-secondary-photos').count(),'Original small crop retained for '+id);
      const fallback=page.locator('.aa-secondary-photos .aa-photo');
      assert.equal(await fallback.getAttribute('src'),record.fallback);
      const photo=await page.request.get(base+'/'+record.path);
      assert.equal(photo.status(),200);
      assert.match(photo.headers()['content-type']||'',/image\/jpeg/);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,'No horizontal overflow '+id+' / '+device);
      assert.equal(await page.evaluate(()=>localStorage.getItem('lumiose-atlas-reconstruction-v1')),saved,'Original saved state unchanged');
      await link.screenshot({path:output+'/'+device+'-'+id+'.png'});
    }
    // Original 48-sector clue directory: the owner's reported tiny-map location.
    await page.goto(base+'/sector-maps.html#sector-jaune-sector-2',{waitUntil:'domcontentloaded'});
    const card=page.locator('#sector-jaune-sector-2');
    const cardDetails=card.locator('details.sector-clues');
    if(!await cardDetails.evaluate(el=>el.open))await cardDetails.locator(':scope > summary').click();
    const directoryImage=card.locator('.sector-context-image');
    await directoryImage.waitFor({state:'attached',timeout:15000});
    await directoryImage.scrollIntoViewIfNeeded();
    await directoryImage.evaluate(async img=>{if(!img.complete)await new Promise((resolve,reject)=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true});});});
    assert.equal(await directoryImage.getAttribute('src'),sectorContextFor('jaune-sector-2').path);
    assert.equal(await page.locator('[data-sector-card] .sector-context-photo').count(),48);
    assert.ok(await card.locator('.sector-context-detail .sector-source-map').count(),'The pre-existing 310px Jaune 2 crop is preserved');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1);
    await card.locator('.sector-context-photo').screenshot({path:output+'/'+device+'-jaune-sector-2-directory.png'});
    await page.goto(base+'/atlas-explorer.html?area=wz-01',{waitUntil:'domcontentloaded'});
    await page.locator('[data-area-detail] .aa-photo-links .aa-photo').first().waitFor({state:'attached'});
    assert.equal(await page.locator('.aa-context-image').count(),0,'Wild Zone galleries are not replaced by sector context');
    assert.ok(await page.locator('[data-area-detail] .aa-photo-links .aa-photo').count()>=2,'Wild Zone original photo pair preserved');
    assert.deepEqual(errors,[],'No runtime JS errors on '+device);
    await context.close();
  }
  console.log('PASS AT-345: original source photograph framing, old crop fallback, Wild Zones, progress and phone/desktop layout.');
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
