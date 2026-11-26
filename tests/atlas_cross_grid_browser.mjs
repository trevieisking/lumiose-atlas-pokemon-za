/* Run in GitHub CI only. Local visual QA uses the managed Sites preview/CUA.
 * All storage sentinels and failure responses are isolated browser fixtures. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {setTimeout as pause} from 'node:timers/promises';
import {chromium} from 'playwright';
import {cellPolygon,parseCell} from '../atlas-cross-grid.mjs';

if(process.env.CI!=='true')throw Error('Run this browser suite in GitHub CI; use the managed Sites preview for local visual QA.');
const base='http://127.0.0.1:18771',output='test-artifacts/atlas-cross-grid';
const key='lumiose-atlas-reconstruction-v1';
const saved=JSON.stringify({check:{'1':true},sideCheck:{'61':true},pickup:{'2-5':true},screw:{'29':true},futureField:{preserve:'cross-grid-test'}});
const grid=JSON.parse(fs.readFileSync('atlas-cross-grid.json','utf8'));
const data=JSON.parse(fs.readFileSync('atlas-explorer-data.json','utf8'));
const expectedIds=[...data.zones,...data.sectors,...data.holovators,...data.ladders,...(data.scaffolds||[]),...data.landmarks].map(p=>p.id).sort();
const proof={scope:'Optional native cross grid and rotated camera regression',devices:[],failureCases:[]};
fs.mkdirSync(output,{recursive:true});
const server=spawn('python3',['-m','http.server','18771','--bind','127.0.0.1'],{stdio:'ignore'});
let browser,activePage;

async function contextFor(spec){
  const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},deviceScaleFactor:1,isMobile:spec.mobile,hasTouch:spec.mobile});
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await context.addInitScript(({key,saved})=>{
    localStorage.setItem(key,saved);localStorage.setItem('atlas-cross-grid-unrelated','preserve');
    window.__gridStorageWrites=[];
    for(const method of ['setItem','removeItem','clear']){
      const original=Storage.prototype[method];
      Storage.prototype[method]=function(...args){window.__gridStorageWrites.push([method,...args]);return original.apply(this,args);};
    }
  },{key,saved});
  return context;
}
async function settle(page){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function pinPositions(page){
  return page.locator('#aeMapPins .ae-pin').evaluateAll(nodes=>nodes.map(node=>({
    kind:node.dataset.kind,left:node.style.left,top:node.style.top,label:node.getAttribute('aria-label')
  })));
}
async function ready(page,suffix=''){
  await page.goto(base+'/atlas-explorer.html'+suffix,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#aeStats')?.textContent.includes('21 owner-surveyed'));
  await page.waitForFunction(()=>document.querySelectorAll('#aeCollectibleResults button[data-collectible-id]').length===364);
  await page.locator('#aeMapImage').evaluate(image=>image.decode());
  await settle(page);
}
async function unchanged(page){
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),saved);
  assert.equal(await page.evaluate(()=>localStorage.getItem('atlas-cross-grid-unrelated')),'preserve');
  assert.deepEqual(await page.evaluate(()=>window.__gridStorageWrites),[],'No grid or map interaction may write player storage');
  assert.equal(await page.locator('#aeMapImage').getAttribute('src'),'maps/lumiose-game-map.jpg');
  assert.equal(await page.locator('.ae-collectible-pin').count(),0,'Reference crosses do not become item pins');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)<=1,'No horizontal page overflow');
}
async function goCell(page,label){
  await page.locator('#aeGridCell').fill(label);
  await page.locator('#aeGridForm button[type="submit"]').click();
  await page.waitForFunction(label=>document.querySelector('#aeGridReference')?.dataset.cell===label,label);
  await settle(page);
}
async function gridAlignment(page,label){
  const points=cellPolygon(parseCell(label,grid),grid);
  const errors=await page.evaluate(points=>{
    const stage=document.querySelector('#aeStage'),viewport=document.querySelector('#aeViewport');
    const svg=document.querySelector('#aeCrossGrid'),selected=svg.querySelector('.ae-grid-selected');
    const values=(selected.getAttribute('d').match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g)||[]).map(Number);
    const css=getComputedStyle(stage),matrix=new DOMMatrixReadOnly(css.transform),bounds=viewport.getBoundingClientRect();
    const width=parseFloat(css.width),height=parseFloat(css.height),[ox,oy]=css.transformOrigin.split(' ').map(parseFloat);
    const left=parseFloat(css.left),top=parseFloat(css.top),svgMatrix=svg.getScreenCTM();
    if(values.length!==points.length*2)return [Infinity];
    return points.map(([nx,ny],i)=>{
      const x=nx/1920*width-ox,y=ny/1920*height-oy;
      const expected={x:bounds.left+left+ox+matrix.a*x+matrix.c*y+matrix.e,y:bounds.top+top+oy+matrix.b*x+matrix.d*y+matrix.f};
      const actual=new DOMPoint(values[i*2],values[i*2+1]).matrixTransform(svgMatrix);
      return Math.hypot(expected.x-actual.x,expected.y-actual.y);
    });
  },points);
  assert.ok(errors.every(error=>error<1),'Grid polygon must follow the actual rendered map, including rotation: '+JSON.stringify(errors));
  return Math.max(...errors);
}
async function mapIntersection(page){
  return page.evaluate(()=>{
    const stage=document.querySelector('#aeStage'),viewport=document.querySelector('#aeViewport');
    const css=getComputedStyle(stage),matrix=new DOMMatrixReadOnly(css.transform);
    const width=parseFloat(css.width),height=parseFloat(css.height);
    const [ox,oy]=css.transformOrigin.split(' ').map(parseFloat);
    const left=parseFloat(css.left),top=parseFloat(css.top);
    let polygon=[[0,0],[width,0],[width,height],[0,height]].map(([x,y])=>({
      x:left+ox+matrix.a*(x-ox)+matrix.c*(y-oy)+matrix.e,
      y:top+oy+matrix.b*(x-ox)+matrix.d*(y-oy)+matrix.f
    }));
    for(const [axis,boundary,minimum] of [['x',0,true],['x',viewport.clientWidth,false],['y',0,true],['y',viewport.clientHeight,false]]){
      const next=[];
      for(let i=0;i<polygon.length;i++){
        const a=polygon[i],b=polygon[(i+1)%polygon.length];
        const ia=minimum?a[axis]>=boundary:a[axis]<=boundary,ib=minimum?b[axis]>=boundary:b[axis]<=boundary;
        if(ia)next.push(a);
        if(ia!==ib){const t=(boundary-a[axis])/(b[axis]-a[axis]);next.push({x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)});}
      }
      polygon=next;
    }
    const area=Math.abs(polygon.reduce((sum,p,i)=>{const q=polygon[(i+1)%polygon.length];return sum+p.x*q.y-q.x*p.y;},0))/2;
    return {area,polygon,transform:css.transform,viewport:[viewport.clientWidth,viewport.clientHeight]};
  });
}
async function gesture(page,spec){
  await page.locator('#aeViewport').scrollIntoViewIfNeeded();
  const before=await page.locator('#aeStage').getAttribute('style');
  const points=await page.evaluate(()=>{
    const b=document.querySelector('#aeViewport').getBoundingClientRect();
    for(const fraction of [.38,.27,.60,.72,.18]){
      const y=b.top+b.height*fraction,x1=b.left+b.width*.3,x2=b.left+b.width*.7;
      if([x1,x2].every(x=>!document.elementFromPoint(x,y)?.closest('button,a,input,select')))return {x1,x2,y};
    }
    throw Error('No unobstructed map gesture start');
  });
  if(spec.mobile){
    const session=await page.context().newCDPSession(page),p=(x,y,id)=>({x:Math.round(x),y:Math.round(y),id});
    try{
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p(points.x1,points.y,1),p(points.x2,points.y,2)]});
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[p(points.x1-12,points.y-25,1),p(points.x2+18,points.y+30,2)]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }finally{await session.detach();}
  }else{
    await page.mouse.move(points.x1,points.y);await page.mouse.down();
    await page.mouse.move(points.x1+35,points.y+25,{steps:5});await page.mouse.up();
    await page.mouse.wheel(0,-150);
  }
  await settle(page);
  assert.notEqual(await page.locator('#aeStage').getAttribute('style'),before,'Grid overlay must permit real map gestures');
  assert.equal(await page.locator('#aeGridToggle').isChecked(),true);
  assert.ok((await mapIntersection(page)).area>1);
}

try{
  let available=false;
  for(let n=0;n<40;n++){try{if((await fetch(base+'/atlas-explorer.html')).ok){available=true;break;}}catch{}await pause(150);}
  assert.ok(available,'CI preview server must be ready');
  browser=await chromium.launch({...(process.env.ATLAS_CHROME_EXECUTABLE?{executablePath:process.env.ATLAS_CHROME_EXECUTABLE}:{channel:'chrome'}),headless:true,args:['--no-sandbox']});
  for(const spec of [{name:'phone',width:393,height:852,mobile:true},{name:'desktop',width:1280,height:900,mobile:false}]){
    const context=await contextFor(spec),page=await context.newPage(),errors=[];activePage=page;
    page.on('pageerror',error=>errors.push(String(error)));
    await ready(page);
    await page.waitForFunction(()=>!document.querySelector('#aeGridToggle').disabled);
    assert.equal(await page.locator('#aeGridToggle').isChecked(),false);
    assert.equal(await page.locator('#aeGridPanel').isVisible(),false);
    assert.deepEqual(await page.locator('#aeResults button').evaluateAll(nodes=>nodes.map(n=>n.dataset.recordId).sort()),expectedIds);
    const originalPins=await pinPositions(page);
    await page.locator('#aeGridToggle').check();await goCell(page,'I9');
    assert.equal(await page.locator('#aeGridReference').getAttribute('data-probe'),'map-centre');
    assert.match(await page.locator('#aeGridReference').textContent(),/I9.*50% east.*50% south/);
    assert.equal(await page.locator('#aeCrossGrid').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
    assert.equal(await page.locator('#aeGridCentre').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
    await gridAlignment(page,'I9');
    await page.locator('#aeViewport').scrollIntoViewIfNeeded();
    await page.screenshot({path:output+'/'+spec.name+'-cross-grid-i9.png',fullPage:false});
    await gesture(page,spec);
    await page.locator('#aeNorth').click();await settle(page);
    assert.match(await page.locator('#aePositionReadout').textContent(),/0° clockwise/);
    await goCell(page,'I9');
    for(let n=0;n<3;n++)await page.locator('#aeZoomIn').click();
    await page.locator('#aeTurnRight').click();await settle(page);
    assert.equal(parseFloat(await page.locator('#aeZoomLabel').textContent()),6);
    assert.match(await page.locator('#aePositionReadout').textContent(),/45° clockwise/);
    await gridAlignment(page,'I9');
    await page.locator('#aeViewport').focus();
    for(let n=0;n<75;n++){await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowUp');}
    await settle(page);
    const intersection=await mapIntersection(page);
    assert.ok(intersection.area>1,'Actual rotated map polygon must remain visible: '+JSON.stringify(intersection));
    await page.locator('#aeViewport').scrollIntoViewIfNeeded();
    await page.screenshot({path:output+'/'+spec.name+'-rotated-extreme-pan.png'});
    await page.locator('#aeNorth').click();await goCell(page,'R18');
    assert.equal(await page.locator('#aeGridReference').getAttribute('data-probe'),'selected-edge-point');
    await gridAlignment(page,'R18');
    assert.match(await page.locator('#aeGridConfidence').textContent(),/Edge extension/);
    assert.ok(await page.locator('#aeCrossGrid .ae-grid-extension').count()>0);
    const crossVisible=await page.evaluate(()=>{
      const cross=document.querySelector('#aeGridCentre').getBoundingClientRect(),vp=document.querySelector('#aeViewport').getBoundingClientRect();
      return cross.left>=vp.left&&cross.right<=vp.right&&cross.top>=vp.top&&cross.bottom<=vp.bottom;
    });
    assert.equal(crossVisible,true,'Clipped edge-cell target must be visible at its actual projected position');
    await page.screenshot({path:output+'/'+spec.name+'-cross-grid-edge.png'});
    await page.locator('#aeViewport').focus();await page.keyboard.press('ArrowLeft');await settle(page);
    assert.equal(await page.locator('#aeGridReference').getAttribute('data-probe'),'map-centre');

    // Existing place filters, source photographs and layer toggles keep working.
    await page.locator('#aeClearPlaceFilters').click();
    await page.locator('#aeSearch').fill('Hotel Z');
    await page.locator('#aeResults button[data-record-id="hotel-z-ladder"]').click();
    assert.equal(await page.locator('#aeSelected [data-ladder-gallery] img').count(),3);
    await page.locator('#aeSelected [data-ladder-gallery] img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
    await page.evaluate(()=>{window.__gridPhotoNodes=[...document.querySelectorAll('#aeSelected img')];});
    await page.locator('#aeGridToggle').uncheck();await page.locator('#aeGridToggle').check();
    assert.equal(await page.evaluate(()=>window.__gridPhotoNodes.every((image,i)=>image===document.querySelectorAll('#aeSelected img')[i])),true);
    await page.locator('#aeShowPlaceDetails').click();
    assert.match(await page.locator('#aeSelected').textContent(),/Hotel Z/);
    await page.locator('#aeClearPlaceFilters').click();
    await page.locator('#aeFilters [data-kind="holovator"]').click();
    assert.equal(await page.locator('#aeResults button').count(),21);
    await page.locator('[data-layer="holovator"]').uncheck();
    assert.equal(await page.locator('.ae-pin[data-kind="holovator"]:visible').count(),0);
    await page.locator('[data-layer="holovator"]').check();
    assert.equal(await page.locator('.ae-pin[data-kind="holovator"]:visible').count(),21);
    await page.locator('#aeFilters [data-kind="zone"]').click();await page.locator('#aeSearch').fill('Wild Zone 2');
    assert.equal(await page.locator('#aeResults button').count(),1);
    assert.equal(await page.locator('#aeResults button').getAttribute('data-record-id'),data.zones.find(z=>z.number===2).id);
    await page.locator('#aeResults button').click();
    assert.equal(await page.locator('#aeGridToggle').isChecked(),true);
    await page.locator('#aeClearPlaceFilters').click();
    assert.deepEqual(await page.locator('#aeResults button').evaluateAll(nodes=>nodes.map(n=>n.dataset.recordId).sort()),expectedIds);
    // Compare immutable pin attributes, excluding camera CSS and selected state.
    assert.deepEqual(await pinPositions(page),originalPins);
    await unchanged(page);

    await ready(page,'?grid=I9&grid_east=25&grid_south=75');
    await page.waitForFunction(()=>document.querySelector('#aeGridReference')?.dataset.cell==='I9');
    assert.equal(await page.locator('#aeGridToggle').isChecked(),true);
    assert.match(await page.locator('#aeGridReference').textContent(),/I9.*25% east.*75% south/);
    const beforeRotation=await page.locator('#aeGridReference').textContent();
    await page.locator('#aeTurnRight').click();await page.locator('#aeRose').click();await settle(page);
    assert.equal(await page.locator('#aeGridReference').textContent(),beforeRotation);
    await page.locator('#aeGridCopy').click();
    await page.waitForFunction(()=>document.querySelector('#aeGridStatus')?.textContent.includes('copied'));
    const copied=await page.evaluate(()=>navigator.clipboard.readText());
    assert.match(copied,/I9.*25% east.*75% south/);
    const shared=new URL(copied.split('\n').at(-1));
    assert.equal(shared.searchParams.get('grid'),'I9');
    assert.equal(shared.searchParams.get('grid_frame'),grid.id);
    assert.equal(shared.searchParams.get('grid_east'),'25.000');assert.equal(shared.searchParams.get('grid_south'),'75.000');
    await unchanged(page);
    assert.deepEqual(errors,[]);
    proof.devices.push({...spec,rotatedExtremeVisibleArea:intersection.area,gridDefaultOff:true,edgeTargetVerified:true,gestureVerified:true,originalIdsPreserved:true,storageWrites:0});
    await context.close();activePage=null;

    for(const failure of ['http-error','invalid-grid']){
      const badContext=await contextFor(spec),badPage=await badContext.newPage();activePage=badPage;
      await badContext.route('**/atlas-cross-grid.json',route=>route.fulfill(failure==='http-error'
        ?{status:503,contentType:'text/plain',body:'Isolated grid availability fixture'}
        :{status:200,contentType:'application/json',body:JSON.stringify({...grid,alignment_verified:false})}));
      await ready(badPage);
      await badPage.waitForFunction(()=>document.querySelector('#aeGridAvailability')?.textContent.includes('unavailable'));
      assert.equal(await badPage.locator('#aeGridToggle').isDisabled(),true);
      assert.equal(await badPage.locator('#aeGridPanel').isVisible(),false);
      assert.equal(await badPage.locator('#aeCrossGrid').count(),0);
      assert.equal(await badPage.locator('.ae-pin[data-kind="zone"]:visible').count(),20);
      await badPage.locator('#aeZoomIn').click();await settle(badPage);
      assert.ok(parseFloat(await badPage.locator('#aeZoomLabel').textContent())>1);
      await badPage.locator('#aeSearch').fill('Hotel Z');
      await badPage.locator('#aeResults button[data-record-id="hotel-z-ladder"]').click();
      assert.equal(await badPage.locator('#aeSelected [data-ladder-gallery] img').count(),3);
      await unchanged(badPage);
      proof.failureCases.push({device:spec.name,failure,originalMapOperational:true,storageWrites:0});
      await badContext.close();activePage=null;
    }
  }
  proof.result='PASS';
  console.log('Cross-grid phone/desktop browser proof passed.');
}catch(error){
  proof.result='FAIL';proof.error=String(error.stack||error);
  if(activePage&&!activePage.isClosed())await activePage.screenshot({path:output+'/failure.png',fullPage:true}).catch(()=>{});
  throw error;
}finally{
  fs.writeFileSync(output+'/proof.json',JSON.stringify(proof,null,2)+'\n');
  if(browser)await browser.close();server.kill();
}
