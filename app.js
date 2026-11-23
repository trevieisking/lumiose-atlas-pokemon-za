/**
 * Lumiose Atlas reconstruction controller — stage 1.
 * Reimplements client-side interactions missing from the saved MHTML snapshot.
 * It does not contain a Supabase client, make network requests, or modify the live site.
 */
(() => {
  'use strict';
  const VIEWS = new Set(['home','walkthrough','sidequests','dimension','bosses','alphas','maps','items','legends','berries','starters','pokedex','essentials','secrets','rewards','battles','sources']);
  const KEY = 'lumiose-atlas-reconstruction-v1';
  const checkedKinds = ['check','sideCheck','legendCheck','pickup','screw'];
  // Open the existing static feedback page; no direct HTML Edge Function link.
  // The page's own script uses the deployed JSON relay with no client secrets.
  const FEEDBACK_PAGE = 'feedback.html';
  function buildAtlasFeedbackUrl(pathname, hash) {
    const sourcePath = String(pathname || '/');
    const canonicalPath = sourcePath !== '/' && sourcePath.endsWith('/')
      ? sourcePath + 'index.html' : sourcePath;
    // Keep the backend-compatible section URL, and carry an exact validated
    // mission/quest anchor separately so reports retain useful location context.
    const originalHash = String(hash || '');
    const sectionHash = originalHash.split(':', 1)[0];
    const page = canonicalPath + sectionHash;
    const validPage = page.length <= 160 &&
      /^\/(?:[a-z0-9-]+(?:\.html)?(?:\/[a-z0-9-]+(?:\.html)?)*)?(?:#[a-z0-9-]+)?$/i.test(page);
    const target = new URL(FEEDBACK_PAGE, document.baseURI);
    target.searchParams.set('page', validPage ? page : '/lumiose-atlas-pokemon-za/index.html#walkthrough');
    const exactAnchor = /^#walkthrough:(mission-(?:[1-9]|[1-3][0-9]|4[0-2]))$/i.exec(originalHash)
      || /^#sidequests:(quest-(?:[1-9]|[1-9][0-9]|1[0-9]{2}|20[0-3]))$/i.exec(originalHash);
    if (validPage && exactAnchor) target.searchParams.set('anchor', exactAnchor[1].toLowerCase());
    return target.toString();
  }

  let state = {check:{},sideCheck:{},legendCheck:{},pickup:{},screw:{}};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    if (saved && typeof saved === 'object') {
      for (const kind of checkedKinds) if (saved[kind] && typeof saved[kind] === 'object') state[kind] = saved[kind];
    }
  } catch (_) { /* Private browsing or blocked storage: controls still work in this tab. */ }
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const write = () => { try {localStorage.setItem(KEY, JSON.stringify(state));} catch (_) {} };
  const getId = (s) => String(s ?? '').trim();
  const show = (element, visible) => { if (element) element.hidden = !visible; };
  const text = (selector, value) => { const el = $(selector); if (el) el.textContent = value; };
  let currentZone = null;
  let currentView = 'home';
  let toastTimer;

  function announce(message) {
    let el = $('#rebuildToast');
    if (!el) {
      el = document.createElement('div'); el.id='rebuildToast';el.className='rebuild-toast';el.setAttribute('role','status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 3800);
  }

  function route(view, anchor) {
    if (!VIEWS.has(view)) view='home';
    const suffix = anchor ? ':' + anchor : '';
    const wanted = `#${view}${suffix}`;
    if (location.hash !== wanted) location.hash=wanted;
    else renderRoute();
  }
  function renderRoute() {
    const raw = decodeURIComponent(location.hash.slice(1));
    if (raw === 'main') {$('#main')?.focus();return;}
    const split=raw.indexOf(':');
    const view=split<0 ? raw : raw.slice(0,split);
    const anchor=split<0 ? null : raw.slice(split+1);
    currentView=VIEWS.has(view) ? view : 'home';
    $$('.view').forEach(el=>el.classList.toggle('active',el.id===currentView));
    $$('[data-view]', $('#sideNav')||document).forEach(el=>{
      const active=el.dataset.view===currentView;
      el.classList.toggle('active',active);
      if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
    });
    if(anchor){
      const target=document.getElementById(anchor);
      if(target){
        // The requested card may be hidden by a search or chapter filter from
        // earlier navigation in this tab. Only clear that section's filter when
        // the specific deep-link target is hidden; otherwise preserve it.
        const hiddenCard=currentView==='walkthrough'
          ? target.closest('#missionsList > .mission')
          : currentView==='sidequests'
            ? target.closest('#sideList > .side-quest') : null;
        if(hiddenCard?.hidden){
          const search=$(currentView==='walkthrough'?'#missionSearch':'#sideSearch');
          if(search)search.value='';
          $('#'+currentView+' .toolbar .tabs [data-filter]').forEach(tab=>{
            const selected=tab.dataset.filter==='All';
            tab.classList.toggle('active',selected);
            tab.setAttribute('aria-pressed',String(selected));
          });
          if(currentView==='walkthrough')updateMissionFilter();
          else updateSideFilter();
        }
        if(target.classList.contains('mission')){
          target.classList.add('open');
          const toggler=$('.mission-toggle',target);
          if(toggler){toggler.setAttribute('aria-expanded','true');toggler.textContent='Close guide ↑';}
        }
        requestAnimationFrame(()=>target.scrollIntoView({behavior:'auto',block:'start'}));
        return;
      }
    }
    window.scrollTo({top:0,behavior:'auto'});
  }

  function restoreProgress() {
    const props={check:'data-check',sideCheck:'data-side-check',legendCheck:'data-legend-check',pickup:'data-pickup',screw:'data-screw'};
    for(const [kind,attr] of Object.entries(props)){
      $$('input[type="checkbox"]['+attr+']').forEach(input=>{
        input.checked=!!state[kind][input.getAttribute(attr)];
        if(kind==='check')input.closest('.mission')?.classList.toggle('done',input.checked);
        if(kind==='sideCheck')input.closest('.side-quest')?.classList.toggle('done',input.checked);
      });
    }
    updateProgress();
  }
  function updateProgress() {
    const count=(selector)=>$$(selector).filter(x=>x.checked).length;
    const story=count('[data-check]');const side=count('[data-side-check]');
    const legends=count('[data-legend-check]');const pickup=count('[data-pickup]');const screw=count('[data-screw]');
    text('#progressText',`${story} of 42 missions complete`);
    const meter=$('#trackerMeter');if(meter)meter.style.width=(story/42*100).toFixed(1)+'%';
    text('#sideQuestProgress',`${side} of 203 side missions complete`);
    const sideMeter=$('#sideQuestMeter');if(sideMeter)sideMeter.style.width=(side/203*100).toFixed(1)+'%';
    text('#legendProgress',`${legends} of 25 obtained`);
    const legendMeter=$('#legendMeter');if(legendMeter)legendMeter.style.width=(legends/25*100).toFixed(1)+'%';
    text('#screwProgress',`${screw} / 100 found`);
    const ip=$('#itemProgress');if(ip)ip.textContent=`${pickup} marked as collected`;
  }

  const filterState = new Map();
  function activeFilter(section) {
    const button = $(`#${section} .toolbar .tabs [data-filter].active`);
    return button?.dataset.filter || 'All';
  }
  function searchVal(id) { return ($('#'+id)?.value || '').trim().toLocaleLowerCase(); }
  function matchesQuery(node,query) {return !query || node.textContent.toLocaleLowerCase().includes(query);}
  function filterGroup(section, selector, searchId, predicate) {
    const filter=activeFilter(section),query=searchVal(searchId);
    const cards=$$(selector);
    let visible=0;
    cards.forEach((node,index)=>{
      const yes=matchesQuery(node,query) && predicate(node,filter,index);
      show(node,yes);if(yes)visible++;
    });
    let status=$(`#${section} .rebuild-filter-status`);
    if(!status){
      status=document.createElement('p');status.className='rebuild-filter-status';status.setAttribute('aria-live','polite');
      const toolbar=$(`#${section} .toolbar`);
      toolbar?.insertAdjacentElement('afterend',status);
    }
    if(status)status.textContent=`Showing ${visible} of ${cards.length} entries`;
  }
  function updateMissionFilter() {
    filterGroup('walkthrough','#missionsList > .mission','missionSearch',(node,filter)=>{
      const group=$('.mission-title span',node)?.textContent.split('·')[0].trim()||'';
      return filter==='All' || group.toLocaleLowerCase()===filter.toLocaleLowerCase();
    });
  }
  function updateSideFilter() {
    filterGroup('sidequests','#sideList > .side-quest','sideSearch',(node,filter,index)=>{
      if(filter==='All')return true;
      if(filter==='Base game')return index<119;
      if(filter==='Mega Dimension')return index>=119;
      if(filter==='EX')return /\bEX\b/i.test(node.querySelector('strong')?.textContent||'');
      return true;
    });
  }
  function updateBossFilter() {
    filterGroup('bosses','#bossGrid > .boss-card','bossSearch',(node,filter,index)=>{
      if(filter==='All')return true;
      const total=$$('#bossGrid > .boss-card').length;
      // Position order is preserved from the source; this is navigation only, not gameplay evidence.
      if(filter==='Opening')return index < Math.ceil(total/3);
      if(filter==='Midgame')return index >= Math.ceil(total/3) && index < Math.ceil(total*2/3);
      if(filter==='Late game')return index >= Math.ceil(total*2/3);
      return true;
    });
  }
  function updateAlphaFilter() {
    filterGroup('alphas','#alphaGrid > .alpha-card','alphaSearch',(node,filter,index)=>{
      const n=index+1;
      return filter==='All' || filter==='Zones 1–6'&&n<=6 || filter==='Zones 7–13'&&n>=7&&n<=13 || filter==='Zones 14–20'&&n>=14;
    });
  }
  function updateLegendFilter() {
    filterGroup('legends','#legendGrid > .legend-card','legendSearch',(node,filter)=>{
      return filter==='All' || $('.kicker',node)?.textContent.trim()===filter;
    });
  }
  function updateItemFilter() {
    const filter=$('#itemZoneTabs .active')?.dataset.itemZone || 'All',query=searchVal('itemSearch');
    const cards=$$('#itemResults > .item-zone');let count=0;
    cards.forEach((node,index)=>{
      const zone=String(index+1);const yes=(filter==='All'||filter===zone)&&matchesQuery(node,query);
      show(node,yes);if(yes)count++;
    });
    let status=$('#items .rebuild-filter-status');
    if(!status){status=document.createElement('p');status.className='rebuild-filter-status';$('#itemZoneTabs')?.insertAdjacentElement('afterend',status);}
    status.textContent=`Showing ${count} Wild Zone item lists`;
  }
  function updateBerryFilter() {
    const filter=activeFilter('berries'),query=searchVal('berrySearch');
    const rows=$$('#berries tbody tr');let visible=0;
    rows.forEach(row=>{
      const category=row.lastElementChild?.textContent?.trim()||'';
      const yes=(filter==='All'||category===filter)&&matchesQuery(row,query);
      show(row,yes);if(yes)visible++;
    });
  }
  const origDexOrder=new Map();
  function updateDexFilter() {
    const source=$('[data-dex-source].active')?.dataset.dexSource || 'Lumiose';
    const filter=activeFilter('pokedex'),query=searchVal('dexSearch');
    const cards=$$('#dexGrid > .dex-card');let visible=0;
    const missing=source==='Hyperspace';
    cards.forEach(node=>{
      const type=$('.dex-types',node)?.textContent||'';
      const known=['Grass','Fire','Water','Electric','Psychic','Dragon','Fairy'];
      const typeMatch=filter==='All'||(filter==='Other'?!known.some(t=>type.includes(t)):type.includes(filter));
      const metadata=[ $('.dex-head strong',node)?.textContent||'', $('.dex-number',node)?.textContent||'', type ].join(' ').toLocaleLowerCase();
      const yes=!missing && typeMatch && (!query || metadata.includes(query));
      show(node,yes);if(yes)visible++;
    });
    text('#dexCount',missing?'Hyperspace entries not included in saved snapshot':`${visible} of ${cards.length} Lumiose entries`);
    let notice=$('#dexUnrecovered');
    if(!notice){notice=document.createElement('p');notice.id='dexUnrecovered';notice.className='rebuild-inline-warning';$('#pokedex .dex-switch')?.insertAdjacentElement('afterend',notice);}
    notice.hidden=!missing;
    notice.textContent='The original guide advertised 132 Hyperspace entries, but their rendered data was not in the saved archive. We will reconstruct this section from verified sources; no invented entries are shown.';
  }
  function sortDex() {
    const grid=$('#dexGrid');if(!grid)return;
    const mode=$('#dexSort')?.value||'number';
    const val=(node)=>{
      if(mode==='name')return $('.dex-head strong',node)?.textContent||'';
      if(mode==='total')return Number($('.dex-total b',node)?.textContent)||0;
      if(mode==='speed')return Number($('.stat-row:last-child span:last-child',node)?.textContent)||0;
      return origDexOrder.get(node)||0;
    };
    const cards=$$('#dexGrid > .dex-card');
    cards.sort((a,b)=>mode==='name'?String(val(a)).localeCompare(val(b)):mode==='number'?val(a)-val(b):val(b)-val(a));
    for(const card of cards)grid.appendChild(card);
  }
  function updateRecipes() {
    const filter=$('[data-recipe-filter].active')?.dataset.recipeFilter||'All';
    $$('.donut-card[data-recipe-stars]').forEach(card=>{
      show(card, filter==='All'||filter==='Special'&&card.dataset.recipeSpecial==='true'||filter.endsWith('★')&&card.dataset.recipeStars===filter.slice(0,-1));
    });
  }
  function updateScrewFilter() {
    const filter=$('#screwTabs .active')?.dataset.filter||'All';
    $$('#screwList .screw-row').forEach(row=>show(row,filter==='All'||row.querySelector('b')?.textContent===filter));
  }

  function selectZone(n, navigate=true) {
    const zone=Number(n);if(!Number.isInteger(zone)||zone<1||zone>20)return;
    currentZone=zone;
    if(navigate && currentView!=='maps')route('maps');
    $$('[data-select-zone]').forEach(button=>button.classList.toggle('active',Number(button.dataset.selectZone)===zone));
    const detail=$('#mapZoneDetail');
    if(!detail)return;
    // Extract exact matching zone information from the saved Alpha and Item sections.
    const alpha=$$('#alphaGrid > .alpha-card')[zone-1];
    const item=$$('#itemResults > .item-zone')[zone-1];
    const names=$$('.alpha-target-list li',alpha||document).map(x=>x.textContent.trim()).slice(0,15);
    const sample=$$('.item-pickup-grid .pickup',item||document).slice(0,12).map(x=>x.textContent.trim().replace(/\s+/g,' '));
    detail.replaceChildren();
    const wrap=document.createElement('div');wrap.className='rebuild-zone-detail';
    const title=document.createElement('h3');title.textContent=`Wild Zone ${String(zone).padStart(2,'0')}`;wrap.appendChild(title);
    const intro=document.createElement('p');intro.textContent='Recovered zone overview. Use the numbered map pin and checklist; pins marked approximate are not exact coordinates.';wrap.appendChild(intro);
    const h=document.createElement('h4');h.textContent='Pokémon field notes';wrap.appendChild(h);
    const ul=document.createElement('ul');names.forEach(name=>{const li=document.createElement('li');li.textContent=name;ul.appendChild(li);});wrap.appendChild(ul);
    const pick=document.createElement('h4');pick.textContent='Item checklist preview';wrap.appendChild(pick);
    const list=document.createElement('ul');sample.forEach(name=>{const li=document.createElement('li');li.textContent=name;list.appendChild(li);});wrap.appendChild(list);
    const button=document.createElement('button');button.type='button';button.className='button light';button.textContent=`Open all zone ${zone} pickups ↗`;
    button.addEventListener('click',()=>{setItemZone(String(zone));route('items');});wrap.appendChild(button);
    detail.appendChild(wrap);
  }
  function setItemZone(value) {
    $$('#itemZoneTabs [data-item-zone]').forEach(x=>x.classList.toggle('active',x.dataset.itemZone===value));
    updateItemFilter();
  }
  function loadRecipe(number) {
    const card=$$('.donut-card[data-recipe-stars]')[Number(number)];if(!card)return;
    const vals=[];
    $$('.donut-ingredients span',card).forEach(x=>{
      const match=x.textContent.trim().match(/(\d+)\s*[×x]\s*(.+?Berry)/i);
      if(match){const amount=Math.min(Number(match[1]),8);for(let i=0;i<amount;i++)vals.push(match[2].trim());}
    });
    const selects=$$('#donutSlots select');selects.forEach((select,index)=>{
      const val=vals[index]||'';
      select.value=Array.from(select.options).some(o=>o.value===val)?val:'';
    });
    updateDonutPreview();
    $('#donutResult')?.scrollIntoView({block:'nearest',behavior:'smooth'});
    announce(`Loaded ${Math.min(vals.length,selects.length)} recipe ingredients into the planner.`);
  }
  function updateDonutPreview() {
    const selected=$$('#donutSlots select').map(el=>el.value).filter(Boolean);
    const result=$('#donutResult');if(!result)return;
    result.replaceChildren();
    if(!selected.length){result.textContent='Choose berries or tap a recipe to preview its ingredient list. Exact game rolls require verified formula data.';return;}
    const p=document.createElement('p');
    p.textContent=`${selected.length} of 8 slots selected: ${selected.join(', ')}.`;
    result.appendChild(p);
    const note=document.createElement('small');note.textContent='This recovered preview tracks the ingredients only. No unverified flavor, timer or energy calculation is presented.';result.appendChild(note);
  }
  function openDex(name) {
    route('pokedex');
    const buttons=$$('[data-dex-source]');buttons.forEach(b=>b.classList.toggle('active',b.dataset.dexSource==='Lumiose'));
    $('#dexSearch').value=name;
    $$('#dexTabs [data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='All'));
    updateDexFilter();
    const found=$$('#dexGrid > .dex-card').find(node=>$('.dex-head strong',node)?.textContent.trim().toLowerCase()===name.toLowerCase());
    if(found){found.classList.add('open');$('.dex-toggle',found)?.setAttribute('aria-expanded','true');requestAnimationFrame(()=>found.scrollIntoView({block:'center'}));}
    else announce(`No saved Lumiose Pokédex entry for ${name}.`);
  }

  document.addEventListener('click',async e=>{
    const a=e.target.closest('a[data-view]');
    if(a){e.preventDefault();route(a.dataset.view);return;}
    const go=e.target.closest('[data-go]');
    if(go){e.preventDefault();
      const mission=go.dataset.mission;route(go.dataset.go,mission?`mission-${mission}`:null);
      if(go.dataset.dexOpen){$$('[data-dex-source]').forEach(x=>x.classList.toggle('active',x.dataset.dexSource===go.dataset.dexOpen));updateDexFilter();}
      return;
    }
    const expand=e.target.closest('[data-expand]');
    if(expand){const card=expand.closest('.mission');const isOpen=card.classList.toggle('open');expand.setAttribute('aria-expanded',String(isOpen));expand.textContent=isOpen?'Close guide ↑':'Open guide ↓';return;}
    const dex=e.target.closest('.dex-toggle');
    if(dex){const open=dex.closest('.dex-card').classList.toggle('open');dex.setAttribute('aria-expanded',String(open));return;}
    const inline=e.target.closest('[data-dex-name]');
    if(inline){openDex(inline.dataset.dexName);return;}
    const filter=e.target.closest('.tabs [data-filter]');
    if(filter){
      const group=filter.closest('.tabs');$$('[data-filter]',group).forEach(b=>{const selected=b===filter;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
      const id=group.id;
      if(id==='missionTabs')updateMissionFilter();if(id==='sideTabs')updateSideFilter();
      if(id==='bossTabs')updateBossFilter();if(id==='alphaTabs')updateAlphaFilter();
      if(id==='legendTabs')updateLegendFilter();if(id==='berryTabs')updateBerryFilter();
      if(id==='dexTabs')updateDexFilter();if(id==='screwTabs')updateScrewFilter();
      return;
    }
    const itemzone=e.target.closest('[data-item-zone]');
    if(itemzone){setItemZone(itemzone.dataset.itemZone);return;}
    const mapzone=e.target.closest('[data-map-zone],[data-open-zone],[data-select-zone],[data-items-zone]');
    if(mapzone){
      const n=mapzone.dataset.mapZone||mapzone.dataset.openZone||mapzone.dataset.selectZone||mapzone.dataset.itemsZone;
      if(mapzone.dataset.itemsZone){setItemZone(n);route('items');}
      else selectZone(n,true);
      return;
    }
    const pin=e.target.closest('[data-map-item],[data-access-zone]');
    if(pin){announce(pin.title||pin.getAttribute('aria-label')||'Map marker');return;}
    const recipe=e.target.closest('[data-recipe-filter]');
    if(recipe){$$('[data-recipe-filter]').forEach(el=>{el.classList.toggle('active',el===recipe);el.setAttribute('aria-pressed',String(el===recipe));});updateRecipes();return;}
    const load=e.target.closest('[data-load-recipe]');
    if(load){loadRecipe(load.dataset.loadRecipe);return;}
    const clear=e.target.closest('#donutClear');if(clear){$$('#donutSlots select').forEach(el=>el.value='');updateDonutPreview();return;}
    const reset=e.target.closest('#clearProgress');
    if(reset){if(confirm('Reset all 42 mission checkboxes in this local reconstruction?')){state.check={};write();restoreProgress();}return;}
    const dexSource=e.target.closest('[data-dex-source]');
    if(dexSource){$$('[data-dex-source]').forEach(el=>el.classList.toggle('active',el===dexSource));updateDexFilter();return;}
    const review=e.target.closest('[data-atlas-review]');
    if(review){
      e.preventDefault();
      window.location.assign(buildAtlasFeedbackUrl(location.pathname, location.hash));
      return;
    }
    if(e.target.closest('[data-atlas-share]')){
      const url=location.href;
      try{if(navigator.share)await navigator.share({title:document.title,url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);announce('Local guide link copied.');}else announce('Copy the address from your browser to share.');}
      catch(_){/* Native share dialog may be cancelled. */}
      return;
    }
  });

  document.addEventListener('change', e=>{
    const target=e.target;
    if(target.matches('input[type="checkbox"]')){
      const attrs={check:'data-check',sideCheck:'data-side-check',legendCheck:'data-legend-check',pickup:'data-pickup',screw:'data-screw'};
      for(const [kind,attr] of Object.entries(attrs))if(target.hasAttribute(attr)){
        const val=getId(target.getAttribute(attr));state[kind][val]=target.checked;write();
        target.closest('.mission')?.classList.toggle('done',target.checked);
        target.closest('.side-quest')?.classList.toggle('done',target.checked);
        updateProgress();break;
      }
    }
    if(target.id==='dexSort')sortDex();
    if(target.closest('#donutSlots'))updateDonutPreview();
  });
  for(const [id,fn] of Object.entries({missionSearch:updateMissionFilter,sideSearch:updateSideFilter,bossSearch:updateBossFilter,alphaSearch:updateAlphaFilter,legendSearch:updateLegendFilter,itemSearch:updateItemFilter,berrySearch:updateBerryFilter,dexSearch:updateDexFilter})){
    $('#'+id)?.addEventListener('input',fn);
  }
  $$('#dexGrid > .dex-card').forEach((node,index)=>origDexOrder.set(node,index));
  const reviewButton=$('[data-atlas-review]');
  if(reviewButton){
    reviewButton.textContent='Send feedback';
    reviewButton.setAttribute('aria-label','Send an issue report about this guide page');
    reviewButton.setAttribute('title','Open the feedback form');
    reviewButton.removeAttribute('aria-expanded');
  }
  restoreProgress();
  updateMissionFilter();updateSideFilter();updateBossFilter();updateAlphaFilter();updateLegendFilter();updateItemFilter();updateBerryFilter();updateDexFilter();updateRecipes();updateScrewFilter();
  window.addEventListener('hashchange',renderRoute);
  renderRoute();
})();
