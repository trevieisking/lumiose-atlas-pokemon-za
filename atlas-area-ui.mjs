/* Shared area controls. This module reads local evidence and never reads or
 * writes player storage. Optional failures leave each original map operational. */
import {buildAreaModel,selectAreaResults,normaliseAreaSelection,readAreaSelection,areaSelectionUrl,areaLink,speciesKey,safeAreaSourceHref,ENCOUNTER_CLASSES} from './atlas-area-model.mjs';

let loading;
export function loadAreaModel(){
  if(!loading)loading=Promise.all([
    fetch('atlas-explorer-data.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Area directory unavailable');return r.json();}),
    import('./wild-zone-fieldbook.mjs'),
    fetch('atlas-area-evidence.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null)
  ]).then(([atlas,{wildZoneRecords},evidence])=>{
    const model=buildAreaModel({atlas,rosters:wildZoneRecords,evidence});
    if(model.areas.length!==68)throw Error('Original area directory is incomplete');return model;
  }).catch(error=>{loading=null;throw error;});
  return loading;
}

const make=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=String(text);return e;};
const labels={recorded:'Fieldbook roster · class unresolved',ordinary:'Ordinary encounter',fixed_alpha:'Fixed Alpha',rotating_alpha:'Rotating Alpha candidate',gift:'Gift',trade:'Trade',scripted_boss:'Scripted boss',mission:'Mission encounter',unclassified_lead:'Unclassified research lead'};
const evidenceLabels={baseline_preserved:'Original fieldbook',source_corroborated:'Written-source cross-check',owner_survey_correlated:'Owner survey matched',verified:'Verified encounter',disputed:'Disputed',source_lead:'Research lead'};
const localPhoto=value=>typeof value==='string'&&/^assets\/atlas\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp)$/.test(value)&&!value.split('/').includes('..');
function link(href,label){const a=make('a','',label);a.href=href;if(href.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}return a;}
function polygonPath(geometry){const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;return polygons.flatMap(p=>p.map(r=>'M'+r.map(x=>x.join(',')).join('L')+'Z')).join(' ');}
function inRing(point,ring){let yes=false;for(let i=0,j=ring.length-2;i<ring.length-1;j=i++)if((ring[i][1]>point[1])!==(ring[j][1]>point[1])&&point[0]<(ring[j][0]-ring[i][0])*(point[1]-ring[i][1])/(ring[j][1]-ring[i][1])+ring[i][0])yes=!yes;return yes;}
function containsPoint(geometry,point){const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;return polygons.some(rings=>inRing(point,rings[0])&&!rings.slice(1).some(r=>inRing(point,r)));}

/** Optional overlayHost shares the original image's full square native extent.
 * eventHost may be its pointer-capture viewport (Explorer); static maps can use
 * overlayHost itself. No guessed polygon is ever rendered or hit-tested. */
export async function installAreaInteractions({host,model,onSelection=()=>{},onAreaFocus,areaFocusLabel,overlayHost,eventHost=overlayHost,canSelectBoundary=()=>true}={}){
  if(!host)throw Error('Missing area panel host');
  model=model||await loadAreaModel();if(model.areas.length!==68)throw Error('Incomplete area model');
  const byId=new Map(model.areas.map(a=>[a.id,a])),speciesById=new Map(model.species.map(s=>[s.id,s]));
  let selection=readAreaSelection(location.href),disposed=false;
  if(selection.areaId&&!byId.has(selection.areaId))selection.areaId=null;
  if(selection.speciesId&&!speciesById.has(selection.speciesId))selection.speciesId=null;
  const cleanup=[];
  const listen=(node,type,fn,options)=>{node.addEventListener(type,fn,options);cleanup.push(()=>node.removeEventListener(type,fn,options));};
  host.classList.add('atlas-area-ui');host.dataset.areaPanel='';
  const heading=make('h3','aa-title','Areas and Pokémon habitats');
  const intro=make('p','aa-intro','Search area guides and Pokémon encounter records. Reviewed outlines show named sectors and green Wild Zones; some areas overlap.');
  const drawer=make('details','aa-drawer');drawer.dataset.areaDrawer='';drawer.open=typeof matchMedia==='function'&&matchMedia('(min-width: 900px)').matches;
  drawer.append(make('summary','','Search all 68 areas and Pokémon'));
  const controls=make('div','aa-controls');
  const searchLabel=make('label','','Area or Pokémon');
  const search=make('input');search.type='search';search.placeholder='Try Eevee, Wild Zone 2 or Vert Sector 1';search.autocomplete='off';search.dataset.areaSearch='';searchLabel.append(search);
  const districtLabel=make('label','','District'),district=make('select');district.dataset.areaDistrict='';
  for(const value of ['All','Vert','Bleu','Magenta','Rouge','Jaune','Centrico']){const option=make('option','',value==='All'?'All districts':value);option.value=value;district.append(option);}districtLabel.append(district);
  const classLabel=make('label','','Encounter class'),encounterClass=make('select');encounterClass.dataset.areaClass='';
  for(const value of ['all',...ENCOUNTER_CLASSES]){const option=make('option','',value==='all'?'All encounter records':labels[value]);option.value=value;encounterClass.append(option);}classLabel.append(encounterClass);
  controls.append(searchLabel,districtLabel,classLabel);
  const status=make('p','aa-status');status.dataset.areaStatus='';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const toolbar=make('div','aa-toolbar'),clear=make('button','','Clear area and habitat selection');clear.type='button';clear.dataset.areaClear='';
  const direct=link('atlas-explorer.html','Link to this area or habitat selection');direct.dataset.areaLink='';toolbar.append(clear,direct);
  const boundaryLabel=make('label','aa-boundary-toggle','Reviewed map outlines'),boundaryToggle=make('input');boundaryToggle.type='checkbox';boundaryToggle.checked=true;boundaryToggle.dataset.areaBoundaries='';boundaryLabel.prepend(boundaryToggle);
  const legend=make('p','aa-legend','Purple outline: named sector · Blue outline: Wild Zone · Shaded area: current selection. Areas can overlap at different heights. These outlines do not show walking routes or exact Pokémon spawn locations. Areas awaiting verification remain in the directory.');legend.dataset.areaLegend='';
  const grids=make('div','aa-result-grid');
  const areaColumn=make('section'),speciesColumn=make('section');areaColumn.append(make('h4','','Matching areas'));speciesColumn.append(make('h4','','Pokémon'));
  const areaResults=make('div','aa-results'),speciesResults=make('div','aa-results');areaResults.dataset.areaResults='';speciesResults.dataset.speciesResults='';
  areaColumn.append(areaResults);speciesColumn.append(speciesResults);grids.append(areaColumn,speciesColumn);
  const detail=make('section','aa-detail');detail.tabIndex=-1;detail.dataset.areaDetail='';detail.setAttribute('aria-label','Area and encounter details');
  const closeDrawer=make('button','aa-close','Close area panel');closeDrawer.type='button';closeDrawer.dataset.areaClose='';
  drawer.append(controls,status,toolbar,boundaryLabel,legend,grids,detail,closeDrawer);host.replaceChildren(heading,intro,drawer);
  let svg=null;
  const paths=new Map(),approved=model.areas.filter(a=>a.geometry.eligible);let visibleBoundaryIds=new Set();
  boundaryToggle.disabled=approved.length===0;
  if(overlayHost){
    if(getComputedStyle(overlayHost).position==='static')overlayHost.classList.add('aa-overlay-host');
    svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 1920 1920');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('aa-geometry-overlay');svg.dataset.areaOverlay='';
    for(const area of approved){const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',polygonPath(area.geometry.geometry));p.setAttribute('fill-rule','evenodd');p.setAttribute('vector-effect','non-scaling-stroke');p.dataset.areaBoundary=area.id;p.dataset.areaKind=area.kind;svg.append(p);paths.set(area.id,p);}overlayHost.append(svg);
  }
  function showSources(row,parent){
    if(!row.sources.length)return;const details=make('details','aa-source-notes');details.append(make('summary','','Evidence and conditions'));
    for(const source of row.sources){
      const p=make('p','',source.claim);
      if(source.href){
        // Player navigation stays inside Atlas. Full external references remain
        // in the evidence register; Markdown source records are not guide pages.
        if(source.href.startsWith('https://'))p.append(document.createTextNode(' Reference: '+new URL(source.href).hostname.replace(/^www\./,'')));
        else if(/\.md(?:[?#]|$)/i.test(source.href))p.append(document.createTextNode(' Atlas evidence: '+source.href.split('/').at(-1)));
        else p.append(document.createTextNode(' '),link(source.href,'Source'));
      }
      details.append(p);
    }parent.append(details);
  }
  function renderEncounter(row){
    const item=make('li','aa-encounter');item.dataset.areaEncounterId=row.id;item.dataset.encounterClass=row.encounterClass;item.dataset.encounterEvidence=row.evidenceStatus;
    const species=make('button','aa-species-link',row.species+(row.form?' · '+row.form:''));species.type='button';species.dataset.speciesId=row.speciesId;species.setAttribute('aria-label','Show recorded habitats for '+row.species);species.addEventListener('click',()=>selectSpecies(row.speciesId,{focus:true}));
    item.append(species,make('span','aa-record-type',labels[row.encounterClass]+' · '+(evidenceLabels[row.evidenceStatus]||row.evidenceStatus)));
    const location=make('p','aa-encounter-location','Area: '+(byId.get(row.areaId)?.name||row.areaId));location.dataset.encounterArea=row.areaId;item.append(location);
    const condition=[...Object.entries(row.condition).filter(([k,v])=>k!=='notes'&&v).map(([k,v])=>k[0].toUpperCase()+k.slice(1)+': '+v),...row.condition.notes];
    item.append(make('p','',condition.length?condition.join(' · '):'Time, weather, floor and unlock conditions are not fully recorded.'));
    for(const note of row.notes)item.append(make('p','aa-evidence-note',note));showSources(row,item);return item;
  }
  function renderDetail(result){
    detail.replaceChildren();
    if(selection.speciesId){
      const species=speciesById.get(selection.speciesId),sourceOnly=!['all','recorded','ordinary','fixed_alpha','rotating_alpha'].includes(selection.encounterClass);detail.append(make('h4','',species.name+(sourceOnly?' · source claims':' · recorded wild habitats')),make('p','',result.areas.length+' matching area records. '+(sourceOnly?'These source claims do not establish a repeatable wild habitat.':'A recorded habitat is not proof of a permanent spawn or of a measured boundary.')));
      if(!result.areas.length)detail.append(make('p','','No supported wild habitat matches these filters. Disputed, gift, trade, mission and boss claims do not establish a repeatable wild habitat.'));
    }else if(selection.areaId){
      const area=byId.get(selection.areaId);
      const outlineText=!area.geometry.eligible?'This area’s outline is awaiting verification. Use its saved map centre and original photographs for orientation.':area.geometry.representation==='source_area_footprint'?'This outline projects the game’s named sector area onto the map. Sectors can overlap at different heights, which can affect the in-game area name. It does not mark walls, walking routes or exact Pokémon spawn locations.':'This outline follows the green zone shown on the original game map. It does not show a walking route or the exact places where Pokémon appear.';
      detail.append(make('h4','',area.name),make('p','',outlineText));
      detail.append(make('p','','The encounter roster is '+(area.rosterStatus==='unresolved'?'unresolved':'not comprehensive')+'. Missing conditions do not mean an encounter is available at all times.'));
      for(const note of area.notes)detail.append(make('p','aa-evidence-note',note));
      if(area.relatedAreas.length){
        const related=make('section','aa-related-areas');related.dataset.relatedAreas='';
        related.append(make('h4','','Overlapping Wild Zone records'));
        for(const record of area.relatedAreas){
          const target=byId.get(record.areaId);if(!target)continue;
          related.append(make('p','',record.note));
          const jump=make('button','','Open '+target.name+' encounters and photographs');jump.type='button';jump.dataset.relatedArea=target.id;
          jump.addEventListener('click',()=>selectArea(target.id,{focus:true}));related.append(jump);
        }
        detail.append(related);
      }
      const original=safeAreaSourceHref(area.link);if(original)detail.append(link(original,'Open original area guide and photographs'));
      if(area.photos.length){
        const photos=make('div','aa-photo-links');
        for(const [i,p] of area.photos.entries())if(localPhoto(p.path)){
          const title=p.kind==='overview'?'Area overview and encounter card':p.kind==='closeup'?'Detailed area close-up':p.kind==='orientation'?'Original map reference':'Original area photograph '+(i+1);
          const photoLink=link(p.path);photoLink.className='aa-photo-link';photoLink.setAttribute('aria-label','Open '+area.name+' — '+title+' at full resolution');
          const photo=make('img','aa-photo');photo.src=p.path;photo.alt=area.name+' — '+title;photo.loading='lazy';photo.decoding='async';
          if(Number.isFinite(p.width)&&p.width>0)photo.width=p.width;
          if(Number.isFinite(p.height)&&p.height>0)photo.height=p.height;
          photoLink.append(photo,make('span','aa-photo-caption',title+' · Open full size'));
          photos.append(photoLink);
        }
        detail.append(photos);
      }
      if(onAreaFocus){const focus=make('button','',typeof areaFocusLabel==='string'?areaFocusLabel:area.kind==='sector'&&!area.geometry.eligible?'Show district starting view':area.geometry.eligible?'Show this area on the map':'Show saved zone centre');focus.type='button';focus.dataset.areaFocus=area.id;focus.addEventListener('click',()=>onAreaFocus(area));detail.append(focus);}
    }else{detail.append(make('h4','','Choose an area or Pokémon'),make('p','','Area records retain original photographs and written approaches. Choose a Pokémon to find its recorded wild habitats across all areas.'));return;}
    const rows=make('ul','aa-encounter-list');for(const row of result.encounters)rows.append(renderEncounter(row));
    if(!result.encounters.length)detail.append(make('p','','No encounter records match the current selection. Original clues remain available in the area guide.'));else detail.append(rows);
    const shown=new Set(result.encounters.map(e=>e.id)),claims=result.relatedClaims.filter(e=>!shown.has(e.id));
    if(claims.length){detail.append(make('h4','','Additional source claims · not confirmed wild habitats'));const list=make('ul','aa-encounter-list');for(const row of claims)list.append(renderEncounter(row));detail.append(list);}
  }
  function render(){
    if(disposed)return;
    search.value=selection.query;district.value=selection.district;encounterClass.value=selection.encounterClass;
    const result=selectAreaResults(model,selection),selected=Boolean(selection.areaId||selection.speciesId);
    areaResults.replaceChildren();speciesResults.replaceChildren();
    for(const area of result.areas){const button=make('button');button.type='button';button.dataset.areaId=area.id;button.setAttribute('aria-pressed',String(selection.areaId===area.id));button.append(make('strong','',area.name),make('small','',area.district+' · '+(area.geometry.eligible?'Reviewed map outline':'Outline awaiting verification')));button.addEventListener('click',()=>selectArea(area.id,{focus:true}));areaResults.append(button);}
    const shownSpecies=selection.speciesId?[speciesById.get(selection.speciesId)]:result.species;
    for(const species of shownSpecies){const button=make('button');button.type='button';button.dataset.speciesId=species.id;button.setAttribute('aria-pressed',String(selection.speciesId===species.id));button.append(make('strong','',species.name),make('small','',species.areaIds.length+' recorded area'+(species.areaIds.length===1?'':'s')+' total'));button.addEventListener('click',()=>selectSpecies(species.id,{focus:true}));speciesResults.append(button);}
    if(!result.areas.length)areaResults.append(make('p','','No matching area records.'));
    if(!shownSpecies.length)speciesResults.append(make('p','','No recorded species match.'));
    status.textContent=result.areas.length+' of 68 areas · '+result.encounters.length+' encounter records · '+approved.length+' reviewed map outlines.';
    if(!approved.length)status.textContent+=' No verified boundary is drawn yet.';
    clear.disabled=!selected&&!selection.query&&selection.district==='All'&&selection.encounterClass==='all';
    direct.href=areaSelectionUrl(location.href,selection);
    visibleBoundaryIds=new Set(boundaryToggle.checked?result.geometries.map(g=>g.areaId):[]);
    for(const [id,path] of paths){path.style.display=visibleBoundaryIds.has(id)?'':'none';path.classList.toggle('is-active',selected&&visibleBoundaryIds.has(id));}
    renderDetail(result);onSelection({...result,geometries:boundaryToggle.checked?result.geometries:[]});
  }
  function apply(next,{history=true,focus=false}={}){
    selection=normaliseAreaSelection(next);if(history){const target=areaSelectionUrl(location.href,selection);if(target!==location.pathname+location.search+location.hash)window.history[history==='replace'?'replaceState':'pushState'](window.history.state,'',target);}
    render();if(focus){drawer.open=true;detail.focus({preventScroll:true});detail.scrollIntoView({block:'nearest',behavior:'smooth'});}
  }
  function selectArea(id,{history=true,focus=false}={}){
    const area=byId.get(id);if(!area)return false;
    const next={...selection,areaId:id,speciesId:null};
    if(next.district!=='All'&&next.district!==area.district)next.district='All';
    if(next.encounterClass!=='all'&&!area.encounters.some(e=>e.encounterClass===next.encounterClass))next.encounterClass='all';
    if(!selectAreaResults(model,next).areas.length)next.query='';
    drawer.open=true;apply(next,{history,focus});return true;
  }
  function selectSpecies(value,{history=true,focus=false}={}){
    const id=speciesById.has(value)?value:speciesKey(value);if(!speciesById.has(id))return false;
    drawer.open=true;apply({...selection,areaId:null,speciesId:id,query:''},{history,focus});return true;
  }
  function clearSelection({history=true}={}){apply(normaliseAreaSelection(),{history});}
  listen(search,'input',()=>apply({...selection,query:search.value,areaId:null,speciesId:null},{history:'replace'}));
  listen(district,'change',()=>apply({...selection,district:district.value,areaId:null}));
  listen(encounterClass,'change',()=>apply({...selection,encounterClass:encounterClass.value,areaId:null}));
  listen(boundaryToggle,'change',render);
  listen(clear,'click',()=>{clearSelection();search.focus({preventScroll:true});});
  listen(closeDrawer,'click',()=>{drawer.open=false;drawer.querySelector('summary').focus({preventScroll:true});});
  listen(drawer,'keydown',event=>{if(event.key==='Escape'){drawer.open=false;drawer.querySelector('summary').focus({preventScroll:true});}});
  const restore=()=>{const next=readAreaSelection(location.href);if(next.areaId&&!byId.has(next.areaId))next.areaId=null;if(next.speciesId&&!speciesById.has(next.speciesId))next.speciesId=null;selection=next;if(next.areaId||next.speciesId)drawer.open=true;render();};
  listen(window,'popstate',restore);listen(window,'hashchange',restore);
  if(eventHost&&svg&&approved.length){
    const pointers=new Map();let moved=false,tap=false;
    listen(eventHost,'pointerdown',e=>{if(!pointers.size){moved=false;tap=false;}pointers.set(e.pointerId,[e.clientX,e.clientY]);if(pointers.size>1)moved=true;},{capture:true});
    listen(eventHost,'pointermove',e=>{const p=pointers.get(e.pointerId);if(p&&Math.hypot(e.clientX-p[0],e.clientY-p[1])>6)moved=true;},{capture:true});
    listen(eventHost,'pointerup',e=>{pointers.delete(e.pointerId);if(!pointers.size)tap=!moved;},{capture:true});
    listen(eventHost,'pointercancel',e=>{pointers.delete(e.pointerId);moved=true;tap=false;},{capture:true});
    listen(eventHost,'click',e=>{
      if(!tap||!boundaryToggle.checked||e.target.closest('button,a,input,select,textarea')||!canSelectBoundary(e))return;tap=false;
      const matrix=svg.getScreenCTM();if(!matrix)return;const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const native=p.matrixTransform(matrix.inverse());
      const hits=approved.filter(a=>visibleBoundaryIds.has(a.id)&&containsPoint(a.geometry.geometry,[native.x,native.y]));
      if(hits.length===1)selectArea(hits[0].id,{focus:true});
      else if(hits.length>1){drawer.open=true;detail.replaceChildren(make('h4','','Overlapping recorded areas'),make('p','','Choose the area to explore. Sector heights and Wild Zone layers can overlap on this map.'));for(const area of hits){const button=make('button','',area.name);button.type='button';button.dataset.areaOverlapId=area.id;button.addEventListener('click',()=>selectArea(area.id,{focus:true}));detail.append(button);}detail.focus({preventScroll:true});detail.scrollIntoView({block:'nearest',behavior:'smooth'});}
    });
  }
  if(selection.areaId||selection.speciesId)drawer.open=true;render();
  return {selectArea,selectSpecies,clear:clearSelection,getSelection:()=>({...selection}),destroy(){disposed=true;for(const fn of cleanup)fn();svg?.remove();host.replaceChildren();}};
}
