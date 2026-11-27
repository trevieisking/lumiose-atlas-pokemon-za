/**
 * Lumiose Atlas reconstruction controller — stage 1.
 * Reimplements client-side interactions missing from the saved MHTML snapshot.
 * It does not contain a Supabase client, make network requests, or modify the live site.
 */
(() => {
  'use strict';
  const VIEWS = new Set(['home','walkthrough','sidequests','dimension','bosses','alphas','maps','items','legends','berries','starters','pokedex','essentials','secrets','rewards','battles','sources']);
  const KEY = 'lumiose-atlas-reconstruction-v1';
  let areaUI=null,syncingArea=false,earlyAreaSelection=null;
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
        const wasHidden=Boolean(hiddenCard?.hidden);
        if(wasHidden){
          const search=$(currentView==='walkthrough'?'#missionSearch':'#sideSearch');
          if(search)search.value='';
          $$('#'+currentView+' .toolbar .tabs [data-filter]').forEach(tab=>{
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
        requestAnimationFrame(()=>{
          if(wasHidden){
            // Avoid inherited smooth scrolling on this newly revealed card.
            // Align beneath the existing sticky header without modifying CSS.
            const top=target.getBoundingClientRect().top+window.scrollY-96;
            window.scrollTo({top:Math.max(0,top),behavior:'instant'});
          }else target.scrollIntoView({behavior:'auto',block:'start'});
        });
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
  function installHyperspaceRoster() {
    const grid=$('#dexGrid');
    if(!grid||grid.querySelector('[data-dex-region="Hyperspace"]'))return false;
    const roster=window.ATLAS_HOME_SOURCE?.records?.filter(r=>r.group==='Hyperspace');
    if(roster?.length!==132)return false;
    // AT-346: link existing Fieldbook routes and authored evolution notes by stable National ID.
    // A link is not an exhaustive capture audit or a location pin.
    const fieldbookRoutes={"380":"latias","381":"latios","382":"kyogre","383":"groudon","384":"rayquaza","485":"heatran","491":"darkrai","638":"cobalion","639":"terrakion","640":"virizion","647":"keldeo","648":"meloetta","649":"genesect","720":"hoopa","721":"volcanion","801":"magearna","802":"marshadow","807":"zeraora","808":"meltan","809":"melmetal"};
    const verifiedCatchRoutes=new Set([720,721,807]);
    const evolutionRoutes={"350":{"note":"Trade evolution: Trade Feebas while it holds a Prism Scale. Side Mission 160 awards a scale for handing over a Feebas; keep a separate Feebas to evolve.","quest":160},"865":{"note":"Evolution: Land at least three critical hits with Galarian Farfetch’d in the same battle; evolve after the battle. The Leek from Side Mission 133 can help.","quest":133},"867":{"note":"Evolution: Keep Galarian Yamask conscious with at least 49 HP missing (aim for 50 or more), then go beneath the Coulant Waterway bridge between Wild Zones 11 and 17 and choose Evolve."},"936":{"note":"Item evolution: Use Auspicious Armor on Charcadet. Side Mission 132 gives you one choice of armor. Additional armor can appear in 5★ Hyperspace floating-item loot with Item Power: Special.","quest":132},"937":{"note":"Item evolution: Use Malicious Armor on Charcadet. Side Mission 132 gives you one choice of armor. Additional armor can appear in 5★ Hyperspace floating-item loot with Item Power: Special.","quest":132},"979":{"note":"Evolution: Have Primeape use Rage Fist at least 20 times, then choose Evolve. Rosebud in Side Mission 180 belongs to its trainer and cannot be caught.","quest":180},"1000":{"note":"Evolution: Collect 999 Gimmighoul Coins and use them to evolve Gimmighoul. Side Mission 122 provides a Gimmighoul and 413 starter coins; gather the rest in Hyperspace.","quest":122}};
    // Reviewed generated-pool route bands. The pinned source register remains in QA for replay and provenance.
    const reviewedPortalRoutes={"39":[{"form":0,"type":"Fairy","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":0,"type":"Fairy","rank":4,"catch":[37,39],"alpha":[46,48]}],"40":[{"form":0,"type":"Fairy","rank":4,"catch":[39,41],"alpha":[48,50]}],"41":[{"form":0,"type":"Poison","rank":1,"catch":[15,17],"alpha":[24,26]},{"form":0,"type":"Flying","rank":3,"catch":[21,23],"alpha":[30,32]}],"42":[{"form":0,"type":"Flying","rank":3,"catch":[25,27],"alpha":[34,36]},{"form":0,"type":"Poison","rank":4,"catch":[37,39],"alpha":[46,48]}],"52":[{"form":1,"type":"Dark","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Normal","rank":1,"catch":[16,18],"alpha":[25,27]},{"form":2,"type":"Steel","rank":2,"catch":[19,21],"alpha":[28,30]},{"form":0,"type":"Normal","rank":3,"catch":[22,24],"alpha":[31,33]},{"form":1,"type":"Dark","rank":4,"catch":[36,38],"alpha":[45,47]},{"form":2,"type":"Steel","rank":4,"catch":[36,38],"alpha":[45,47]}],"53":[{"form":0,"type":"Normal","rank":3,"catch":[28,30],"alpha":[37,39]},{"form":1,"type":"Dark","rank":4,"catch":[39,41],"alpha":[48,50]}],"56":[{"form":0,"type":"Fighting","rank":1,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Fighting","rank":3,"catch":[22,24],"alpha":[31,33]}],"57":[{"form":0,"type":"Fighting","rank":3,"catch":[28,30],"alpha":[37,39]}],"83":[{"form":0,"type":"Normal","rank":2,"catch":[18,20],"alpha":[27,29]},{"form":1,"type":"Fighting","rank":3,"catch":[22,24],"alpha":[31,33]}],"104":[{"form":0,"type":"Ground","rank":1,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Fire","rank":4,"catch":[36,38],"alpha":[45,47]},{"form":0,"type":"Ground","rank":4,"catch":[36,38],"alpha":[45,47]}],"105":[{"form":1,"type":"Fire","rank":4,"catch":[39,41],"alpha":[48,50]},{"form":0,"type":"Ground","rank":4,"catch":[39,41],"alpha":[48,50]}],"122":[{"form":1,"type":"Ice","rank":3,"catch":[33,35],"alpha":[42,44]},{"form":0,"type":"Psychic","rank":3,"catch":[33,35],"alpha":[42,44]},{"form":1,"type":"Ice","rank":4,"catch":[40,42],"alpha":[49,51]}],"137":[{"form":0,"type":"Normal","rank":3,"catch":[21,23],"alpha":[30,32]},{"form":0,"type":"Normal","rank":5,"catch":[50,52],"alpha":[59,61]}],"169":[{"form":0,"type":"Poison","rank":4,"catch":[39,41],"alpha":[48,50]}],"174":[{"form":0,"type":"Fairy","rank":2,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Fairy","rank":3,"catch":[21,23],"alpha":[30,32]}],"211":[{"form":0,"type":"Water","rank":2,"catch":[19,21],"alpha":[28,30]},{"form":1,"type":"Poison","rank":3,"catch":[23,25],"alpha":[32,34]},{"form":1,"type":"Poison","rank":5,"catch":[51,53],"alpha":[60,62]}],"233":[{"form":0,"type":"Normal","rank":5,"catch":[52,54],"alpha":[61,63]}],"252":[{"form":0,"type":"Grass","rank":2,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Grass","rank":3,"catch":[20,22],"alpha":[29,31]},{"form":0,"type":"Grass","rank":5,"catch":[50,52],"alpha":[59,61]}],"253":[{"form":0,"type":"Grass","rank":3,"catch":[23,25],"alpha":[32,34]},{"form":0,"type":"Grass","rank":4,"catch":[36,38],"alpha":[45,47]}],"254":[{"form":0,"type":"Grass","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Grass","rank":5,"catch":[54,56],"alpha":[63,65]}],"255":[{"form":0,"type":"Fire","rank":2,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Fire","rank":3,"catch":[20,22],"alpha":[29,31]},{"form":0,"type":"Fire","rank":5,"catch":[50,52],"alpha":[59,61]}],"256":[{"form":0,"type":"Fire","rank":3,"catch":[23,25],"alpha":[32,34]},{"form":0,"type":"Fighting","rank":4,"catch":[36,38],"alpha":[45,47]},{"form":0,"type":"Fire","rank":4,"catch":[36,38],"alpha":[45,47]}],"257":[{"form":0,"type":"Fighting","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Fire","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Fire","rank":5,"catch":[54,56],"alpha":[63,65]}],"258":[{"form":0,"type":"Water","rank":2,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Water","rank":3,"catch":[20,22],"alpha":[29,31]},{"form":0,"type":"Water","rank":5,"catch":[50,52],"alpha":[59,61]}],"259":[{"form":0,"type":"Water","rank":3,"catch":[23,25],"alpha":[32,34]},{"form":0,"type":"Ground","rank":4,"catch":[36,38],"alpha":[45,47]},{"form":0,"type":"Water","rank":4,"catch":[36,38],"alpha":[45,47]}],"260":[{"form":0,"type":"Ground","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Water","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Water","rank":5,"catch":[54,56],"alpha":[63,65]}],"316":[{"form":0,"type":"Poison","rank":1,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Poison","rank":4,"catch":[35,37],"alpha":[44,46]}],"317":[{"form":0,"type":"Poison","rank":4,"catch":[38,40],"alpha":[47,49]}],"325":[{"form":0,"type":"Psychic","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Psychic","rank":4,"catch":[36,38],"alpha":[45,47]}],"326":[{"form":0,"type":"Psychic","rank":4,"catch":[40,42],"alpha":[49,51]}],"335":[{"form":0,"type":"Normal","rank":2,"catch":[23,25],"alpha":[32,34]}],"336":[{"form":0,"type":"Poison","rank":3,"catch":[26,28],"alpha":[35,37]}],"349":[{"form":0,"type":"Water","rank":2,"catch":[20,22],"alpha":[29,31]}],"352":[{"form":0,"type":"Normal","rank":4,"catch":[38,40],"alpha":[47,49]}],"358":[{"form":0,"type":"Psychic","rank":3,"catch":[24,26],"alpha":[33,35]}],"396":[{"form":0,"type":"Flying","rank":1,"catch":[13,15],"alpha":[22,24]},{"form":0,"type":"Normal","rank":1,"catch":[13,15],"alpha":[22,24]},{"form":0,"type":"Normal","rank":2,"catch":[15,17],"alpha":[24,26]},{"form":0,"type":"Flying","rank":3,"catch":[20,22],"alpha":[29,31]}],"397":[{"form":0,"type":"Normal","rank":2,"catch":[18,20],"alpha":[27,29]},{"form":0,"type":"Flying","rank":3,"catch":[22,24],"alpha":[31,33]},{"form":0,"type":"Normal","rank":4,"catch":[35,37],"alpha":[44,46]}],"398":[{"form":0,"type":"Normal","rank":4,"catch":[40,42],"alpha":[49,51]}],"433":[{"form":0,"type":"Psychic","rank":1,"catch":[14,16],"alpha":[23,25]},{"form":0,"type":"Psychic","rank":3,"catch":[21,23],"alpha":[30,32]}],"439":[{"form":0,"type":"Psychic","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Fairy","rank":2,"catch":[20,22],"alpha":[29,31]},{"form":0,"type":"Psychic","rank":3,"catch":[23,25],"alpha":[32,34]}],"474":[{"form":0,"type":"Normal","rank":5,"catch":[54,56],"alpha":[63,65]}],"479":[{"form":0,"type":"Electric","rank":5,"catch":[52,54],"alpha":[61,63]},{"form":1,"type":"Electric","rank":5,"catch":[54,56],"alpha":[63,65]},{"form":2,"type":"Electric","rank":5,"catch":[54,56],"alpha":[63,65]},{"form":3,"type":"Electric","rank":5,"catch":[54,56],"alpha":[63,65]},{"form":4,"type":"Electric","rank":5,"catch":[54,56],"alpha":[63,65]},{"form":5,"type":"Electric","rank":5,"catch":[54,56],"alpha":[63,65]}],"509":[{"form":0,"type":"Dark","rank":1,"catch":[14,16],"alpha":[23,25]},{"form":0,"type":"Dark","rank":3,"catch":[21,23],"alpha":[30,32]}],"510":[{"form":0,"type":"Dark","rank":3,"catch":[24,26],"alpha":[33,35]}],"517":[{"form":0,"type":"Psychic","rank":1,"catch":[15,17],"alpha":[24,26]},{"form":0,"type":"Psychic","rank":4,"catch":[35,37],"alpha":[44,46]}],"518":[{"form":0,"type":"Psychic","rank":4,"catch":[38,40],"alpha":[47,49]}],"538":[{"form":0,"type":"Fighting","rank":3,"catch":[26,28],"alpha":[35,37]}],"539":[{"form":0,"type":"Fighting","rank":3,"catch":[26,28],"alpha":[35,37]}],"562":[{"form":0,"type":"Ghost","rank":1,"catch":[18,20],"alpha":[27,29]},{"form":1,"type":"Ghost","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":1,"type":"Ground","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":0,"type":"Ghost","rank":4,"catch":[36,38],"alpha":[45,47]}],"563":[{"form":0,"type":"Ghost","rank":4,"catch":[40,42],"alpha":[49,51]}],"590":[{"form":0,"type":"Grass","rank":2,"catch":[21,23],"alpha":[30,32]},{"form":0,"type":"Grass","rank":4,"catch":[37,39],"alpha":[46,48]}],"591":[{"form":0,"type":"Grass","rank":4,"catch":[42,44],"alpha":[51,53]}],"615":[{"form":0,"type":"Ice","rank":3,"catch":[26,28],"alpha":[35,37]}],"622":[{"form":0,"type":"Ground","rank":3,"catch":[25,27],"alpha":[34,36]},{"form":0,"type":"Ground","rank":4,"catch":[37,39],"alpha":[46,48]}],"623":[{"form":0,"type":"Ground","rank":4,"catch":[43,45],"alpha":[52,54]}],"739":[{"form":0,"type":"Fighting","rank":1,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Fighting","rank":4,"catch":[35,37],"alpha":[44,46]},{"form":0,"type":"Ice","rank":4,"catch":[35,37],"alpha":[44,46]}],"740":[{"form":0,"type":"Fighting","rank":4,"catch":[38,40],"alpha":[47,49]},{"form":0,"type":"Ice","rank":4,"catch":[38,40],"alpha":[47,49]}],"767":[{"form":0,"type":"Bug","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Water","rank":3,"catch":[23,25],"alpha":[32,34]}],"768":[{"form":0,"type":"Water","rank":3,"catch":[30,32],"alpha":[39,41]}],"769":[{"form":0,"type":"Ground","rank":1,"catch":[22,24],"alpha":[31,33]},{"form":0,"type":"Ground","rank":4,"catch":[37,39],"alpha":[46,48]}],"770":[{"form":0,"type":"Ground","rank":4,"catch":[42,44],"alpha":[51,53]}],"778":[{"form":0,"type":"Ghost","rank":3,"catch":[24,26],"alpha":[33,35]}],"821":[{"form":0,"type":"Flying","rank":1,"catch":[14,16],"alpha":[23,25]},{"form":0,"type":"Flying","rank":3,"catch":[20,22],"alpha":[29,31]}],"822":[{"form":0,"type":"Flying","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":0,"type":"Flying","rank":4,"catch":[36,38],"alpha":[45,47]}],"823":[{"form":0,"type":"Flying","rank":4,"catch":[41,43],"alpha":[50,52]}],"827":[{"form":0,"type":"Dark","rank":1,"catch":[14,16],"alpha":[23,25]},{"form":0,"type":"Dark","rank":3,"catch":[20,22],"alpha":[29,31]}],"828":[{"form":0,"type":"Dark","rank":3,"catch":[24,26],"alpha":[33,35]}],"848":[{"form":0,"type":"Electric","rank":2,"catch":[19,21],"alpha":[28,30]},{"form":0,"type":"Electric","rank":4,"catch":[36,38],"alpha":[45,47]}],"849":[{"form":0,"type":"Electric","rank":4,"catch":[39,41],"alpha":[48,50]},{"form":1,"type":"Electric","rank":4,"catch":[39,41],"alpha":[48,50]}],"852":[{"form":0,"type":"Fighting","rank":1,"catch":[21,23],"alpha":[30,32]},{"form":0,"type":"Fighting","rank":4,"catch":[37,39],"alpha":[46,48]}],"853":[{"form":0,"type":"Fighting","rank":4,"catch":[41,43],"alpha":[50,52]}],"863":[{"form":0,"type":"Steel","rank":4,"catch":[39,41],"alpha":[48,50]}],"866":[{"form":0,"type":"Ice","rank":4,"catch":[42,44],"alpha":[51,53]}],"876":[{"form":0,"type":"Normal","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":1,"type":"Normal","rank":3,"catch":[24,26],"alpha":[33,35]}],"877":[{"form":0,"type":"Electric","rank":3,"catch":[24,26],"alpha":[33,35]}],"900":[{"form":0,"type":"Bug","rank":4,"catch":[40,42],"alpha":[49,51]}],"904":[{"form":0,"type":"Poison","rank":5,"catch":[53,55],"alpha":[62,64]}],"926":[{"form":0,"type":"Fairy","rank":2,"catch":[18,20],"alpha":[27,29]},{"form":0,"type":"Fairy","rank":3,"catch":[22,24],"alpha":[31,33]}],"927":[{"form":0,"type":"Fairy","rank":3,"catch":[27,29],"alpha":[36,38]}],"931":[{"form":0,"type":"Normal","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":1,"type":"Normal","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":2,"type":"Normal","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":3,"type":"Normal","rank":1,"catch":[17,19],"alpha":[26,28]}],"932":[{"form":0,"type":"Rock","rank":3,"catch":[22,24],"alpha":[31,33]}],"933":[{"form":0,"type":"Rock","rank":3,"catch":[26,28],"alpha":[35,37]},{"form":0,"type":"Rock","rank":4,"catch":[38,40],"alpha":[47,49]}],"934":[{"form":0,"type":"Rock","rank":4,"catch":[41,43],"alpha":[50,52]}],"935":[{"form":0,"type":"Fire","rank":2,"catch":[19,21],"alpha":[28,30]}],"942":[{"form":0,"type":"Dark","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Dark","rank":4,"catch":[36,38],"alpha":[45,47]}],"943":[{"form":0,"type":"Dark","rank":4,"catch":[39,41],"alpha":[48,50]}],"944":[{"form":0,"type":"Poison","rank":1,"catch":[16,18],"alpha":[25,27]},{"form":0,"type":"Normal","rank":3,"catch":[22,24],"alpha":[31,33]},{"form":0,"type":"Poison","rank":4,"catch":[36,38],"alpha":[45,47]}],"945":[{"form":0,"type":"Normal","rank":3,"catch":[28,30],"alpha":[37,39]},{"form":0,"type":"Poison","rank":4,"catch":[39,41],"alpha":[48,50]}],"951":[{"form":0,"type":"Grass","rank":2,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Fire","rank":3,"catch":[21,23],"alpha":[30,32]},{"form":0,"type":"Grass","rank":3,"catch":[21,23],"alpha":[30,32]}],"952":[{"form":0,"type":"Fire","rank":3,"catch":[26,28],"alpha":[35,37]},{"form":0,"type":"Grass","rank":3,"catch":[26,28],"alpha":[35,37]}],"957":[{"form":0,"type":"Steel","rank":2,"catch":[18,20],"alpha":[27,29]},{"form":0,"type":"Steel","rank":3,"catch":[22,24],"alpha":[31,33]}],"958":[{"form":0,"type":"Steel","rank":3,"catch":[26,28],"alpha":[35,37]},{"form":0,"type":"Fairy","rank":4,"catch":[38,40],"alpha":[47,49]},{"form":0,"type":"Steel","rank":4,"catch":[38,40],"alpha":[47,49]}],"959":[{"form":0,"type":"Fairy","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Steel","rank":4,"catch":[41,43],"alpha":[50,52]}],"967":[{"form":0,"type":"Dragon","rank":4,"catch":[38,40],"alpha":[47,49]},{"form":0,"type":"Normal","rank":4,"catch":[38,40],"alpha":[47,49]}],"969":[{"form":0,"type":"Poison","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":0,"type":"Rock","rank":3,"catch":[24,26],"alpha":[33,35]},{"form":0,"type":"Poison","rank":4,"catch":[36,38],"alpha":[45,47]},{"form":0,"type":"Rock","rank":4,"catch":[36,38],"alpha":[45,47]}],"970":[{"form":0,"type":"Poison","rank":4,"catch":[41,43],"alpha":[50,52]},{"form":0,"type":"Rock","rank":4,"catch":[41,43],"alpha":[50,52]}],"971":[{"form":0,"type":"Ghost","rank":1,"catch":[17,19],"alpha":[26,28]},{"form":0,"type":"Ghost","rank":4,"catch":[36,38],"alpha":[45,47]}],"972":[{"form":0,"type":"Ghost","rank":4,"catch":[39,41],"alpha":[48,50]}],"973":[{"form":0,"type":"Flying","rank":4,"catch":[37,39],"alpha":[46,48]}],"977":[{"form":0,"type":"Water","rank":4,"catch":[38,40],"alpha":[47,49]}],"978":[{"form":0,"type":"Water","rank":4,"catch":[38,40],"alpha":[47,49]},{"form":1,"type":"Water","rank":4,"catch":[38,40],"alpha":[47,49]},{"form":2,"type":"Water","rank":4,"catch":[38,40],"alpha":[47,49]}],"996":[{"form":0,"type":"Dragon","rank":5,"catch":[52,54],"alpha":[61,63]},{"form":0,"type":"Ice","rank":5,"catch":[52,54],"alpha":[61,63]}],"997":[{"form":0,"type":"Dragon","rank":5,"catch":[54,56],"alpha":[63,65]},{"form":0,"type":"Ice","rank":5,"catch":[54,56],"alpha":[63,65]}],"998":[{"form":0,"type":"Dragon","rank":5,"catch":[57,59],"alpha":[66,68]},{"form":0,"type":"Ice","rank":5,"catch":[57,59],"alpha":[66,68]}],"999":[{"form":0,"type":"Ghost","rank":5,"catch":[62,64],"alpha":[71,73]}]};
    // Localized names for the source form indices; never infer a permanent map point from these routes.
    const portalFormLabels={"52":["Kantonian Meowth","Alolan Meowth","Galarian Meowth"],"53":["Kantonian Persian","Alolan Persian"],"83":["Kantonian Farfetch’d","Galarian Farfetch’d"],"105":["Kantonian Marowak","Alolan Marowak"],"122":["Kantonian Mr. Mime","Galarian Mr. Mime"],"211":["Johtonian Qwilfish","Hisuian Qwilfish"],"479":["Rotom (ordinary form)","Heat Rotom","Wash Rotom","Frost Rotom","Fan Rotom","Mow Rotom"],"562":["Unovan Yamask","Galarian Yamask"],"849":["Amped Form","Low Key Form"],"876":["Male Indeedee","Female Indeedee"],"931":["Green Plumage","Blue Plumage","Yellow Plumage","White Plumage"],"978":["Curly Form","Droopy Form","Stretchy Form"]};
    // AT-346: factual six-stat arrays from a pinned Z-A-specific source.
    // Default non-Mega form only; source-based, not a complete form audit.
    const hyperspaceBaseStats={"39":[115,45,20,45,25,20],"40":[140,70,45,85,50,45],"41":[40,45,35,30,40,55],"42":[75,80,70,65,75,90],"52":[40,45,35,40,40,90],"53":[65,70,60,65,65,115],"56":[40,80,35,35,45,70],"57":[65,105,60,60,70,95],"83":[52,90,55,58,62,60],"104":[50,50,95,40,50,35],"105":[60,80,110,50,80,45],"122":[40,45,65,100,120,90],"137":[65,60,70,85,75,40],"169":[85,90,80,70,80,130],"174":[90,30,15,40,20,15],"211":[65,95,85,55,55,85],"233":[85,80,90,105,95,60],"252":[40,45,35,65,55,70],"253":[50,65,45,85,65,95],"254":[70,85,65,105,85,120],"255":[45,60,40,70,50,45],"256":[60,85,60,85,60,55],"257":[80,120,70,110,70,80],"258":[50,70,50,50,50,40],"259":[70,85,70,60,70,50],"260":[100,110,90,85,90,60],"316":[70,43,53,43,53,40],"317":[100,73,83,73,83,55],"325":[60,25,35,70,80,60],"326":[80,45,65,90,110,80],"335":[73,115,60,60,60,90],"336":[73,100,60,100,60,65],"349":[20,15,20,10,55,80],"350":[95,60,79,100,125,81],"352":[60,90,70,60,120,40],"358":[75,50,80,95,90,65],"380":[80,80,90,110,130,110],"381":[80,90,80,130,110,110],"382":[100,100,90,150,140,90],"383":[100,150,140,100,90,90],"384":[105,150,90,150,90,95],"396":[40,55,30,30,30,60],"397":[55,75,50,40,40,80],"398":[85,120,70,50,60,100],"433":[45,30,50,65,50,45],"439":[20,25,45,70,90,60],"474":[85,80,70,135,75,90],"479":[50,50,77,95,77,91],"485":[91,90,106,130,106,77],"491":[70,90,90,135,90,125],"509":[41,50,37,50,37,66],"510":[64,88,50,88,50,106],"517":[76,25,45,67,55,24],"518":[116,55,85,107,95,29],"538":[120,100,85,30,85,45],"539":[75,125,75,30,75,85],"562":[38,30,85,55,65,30],"563":[58,50,145,95,105,30],"590":[69,55,45,55,55,15],"591":[114,85,70,85,80,30],"615":[80,50,50,95,135,105],"622":[59,74,50,35,50,35],"623":[89,124,80,55,80,55],"638":[91,90,129,90,72,108],"639":[91,129,90,72,90,108],"640":[91,90,72,90,129,108],"647":[91,72,90,129,90,108],"648":[100,77,77,128,128,90],"649":[71,120,95,120,95,99],"720":[80,110,60,150,130,70],"721":[80,110,120,130,90,70],"739":[47,82,57,42,47,63],"740":[97,132,77,62,67,43],"767":[25,35,40,20,30,80],"768":[75,125,140,60,90,40],"769":[55,55,80,70,45,15],"770":[85,75,110,100,75,35],"778":[55,90,80,50,105,96],"801":[80,95,115,130,115,65],"802":[90,125,80,90,90,125],"807":[88,112,75,102,80,143],"808":[46,65,65,55,35,34],"809":[135,143,143,80,65,34],"821":[38,47,35,33,35,57],"822":[68,67,55,43,55,77],"823":[98,87,105,53,85,67],"827":[40,28,28,47,52,50],"828":[70,58,58,87,92,90],"848":[40,38,35,54,35,40],"849":[75,98,70,114,70,75],"852":[50,68,60,50,50,32],"853":[80,118,90,70,80,42],"863":[70,110,100,50,60,50],"865":[62,135,95,68,82,65],"866":[80,85,75,110,100,70],"867":[58,95,145,50,105,30],"876":[60,65,55,105,95,95],"877":[58,95,58,70,58,97],"900":[70,135,95,45,70,85],"904":[85,115,95,65,65,85],"926":[37,55,70,30,55,65],"927":[57,80,115,50,80,95],"931":[82,96,51,45,51,92],"932":[55,55,75,35,35,25],"933":[60,60,100,35,65,35],"934":[100,100,130,45,90,35],"935":[40,50,40,50,40,35],"936":[85,60,100,125,80,75],"937":[75,125,80,60,100,85],"942":[60,78,60,40,51,51],"943":[80,120,90,60,70,85],"944":[40,65,35,40,35,75],"945":[63,95,65,80,72,110],"951":[50,62,40,62,40,50],"952":[65,108,65,108,65,75],"957":[50,45,45,35,64,58],"958":[65,55,55,45,82,78],"959":[85,75,77,70,105,94],"967":[70,95,65,85,65,121],"969":[48,35,42,105,60,60],"970":[83,55,90,130,81,86],"971":[50,61,60,30,55,34],"972":[72,101,100,50,97,68],"973":[82,115,74,75,64,90],"977":[150,100,115,65,65,35],"978":[68,50,60,120,95,82],"979":[110,115,80,50,90,90],"996":[65,75,45,35,45,55],"997":[90,95,66,45,65,62],"998":[115,145,92,75,86,87],"999":[45,30,70,75,70,10],"1000":[87,60,95,133,91,84]};
    const hyperspaceStatForms={"52":"Kantonian Meowth","53":"Kantonian Persian","83":"Kantonian Farfetch’d","105":"Kantonian Marowak","122":"Kantonian Mr. Mime","211":"Johtonian Qwilfish","479":"Rotom (ordinary form)","562":"Unovan Yamask","648":"Aria Forme","720":"Confined","778":"Disguised Form","801":"Ordinary Magearna","849":"Amped Form","876":"Male Indeedee","877":"Full Belly Mode","931":"Green Plumage","978":"Curly Form","999":"Chest Form"};
    const fragment=document.createDocumentFragment();
    for(const r of roster){
      const card=document.createElement('article');
      card.className='dex-card';
      card.id='dex-hyperspace-'+r.dexIndex;
      card.dataset.dexRegion='Hyperspace';
      card.hidden=true;
      const button=document.createElement('button');
      button.type='button';button.className='dex-toggle';
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label',r.name+', show catalogue links');
      const head=document.createElement('div');head.className='dex-head';
      const image=document.createElement('img');image.alt='';image.loading='lazy';image.decoding='async';
      // Reuse exactly the known artwork sources from the existing HOME roster.
      const external='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/'+r.number+'.png';
      if(r.image===external||r.image==='art/'+r.number+'.webp'||r.image==='dex-art/'+r.number+'.webp')image.src=r.image;
      image.addEventListener('error',()=>{image.hidden=true;},{once:true});
      const meta=document.createElement('div');
      const number=document.createElement('span');number.className='dex-number';
      number.textContent='#'+String(r.dexIndex).padStart(3,'0')+' · NATIONAL #'+r.number;
      const name=document.createElement('strong');name.textContent=r.name;
      const types=document.createElement('span');types.className='dex-types';types.textContent=r.types;
      meta.append(number,name,types);head.append(image,meta);
      const hint=document.createElement('span');hint.className='dex-hint';hint.textContent='Catalogue links ↓';
      const values=hyperspaceBaseStats[r.number];
      const hasStats=Array.isArray(values)&&values.length===6&&values.every(v=>Number.isInteger(v)&&v>0&&v<=255);
      button.append(head);
      if(hasStats){
        const total=document.createElement('div');total.className='dex-total';
        const label=document.createElement('span');label.textContent='BASE STAT TOTAL';
        const value=document.createElement('b');value.textContent=String(values.reduce((n,v)=>n+v,0));
        total.append(label,value);button.append(total);
      }
      hint.textContent='Stats and catalogue links ↓';button.append(hint);
      const details=document.createElement('div');details.className='dex-stats';
      if(hasStats){
        const formNote=document.createElement('p');formNote.className='dex-stat-source';
        formNote.textContent='Base stats: '+(hyperspaceStatForms[r.number]||'default non-Mega form')+'. Z-A-specific source values; other forms may differ.';
        details.append(formNote);
        ['HP','Atk','Def','SpA','SpD','Spe'].forEach((name,i)=>{
          const stat=document.createElement('div');stat.className='stat-row';stat.dataset.dexStat=String(i);
          const nameEl=document.createElement('span');nameEl.textContent=name;
          const bar=document.createElement('span');bar.className='stat-bar';
          const fill=document.createElement('i');fill.style.width=Math.min(100,values[i]/2)+'%';bar.append(fill);
          const number=document.createElement('span');number.textContent=String(values[i]);stat.append(nameEl,bar,number);details.append(stat);
        });
      }
      const links=document.createElement('div');links.className='dex-location';
      const home=document.createElement('a');home.href='home-connection.html#home-species-'+r.number;
      home.textContent='Open HOME checklist entry';
      const route=fieldbookRoutes[r.number];
      const evolution=evolutionRoutes[r.number];
      if(route){
        const a=document.createElement('a');a.href='legendaries.html#legend-'+route;
        a.textContent=verifiedCatchRoutes.has(r.number)?'Open verified catch guide':'Open Legendary Fieldbook guide';
        links.append(a,document.createElement('br'));
      }else if(evolution){
        const note=document.createElement('p');note.textContent=evolution.note;links.append(note);
        if(evolution.quest){
          const a=document.createElement('a');a.href='side-missions.html#quest-'+evolution.quest;
          a.textContent='Related Side Mission '+evolution.quest;links.append(a,document.createElement('br'));
        }
      }else if(reviewedPortalRoutes[r.number]){
        const portalNote=document.createElement('p');
        portalNote.textContent=r.number===999?'Chest Form — 5★ Ghost Special Scan candidate.':'Reviewed Hyperspace Wild Zone routes:';
        links.append(portalNote);
        const list=document.createElement('ul');
        for(const encounter of reviewedPortalRoutes[r.number]){
          const row=document.createElement('li');
          row.dataset.atlasPortalRoute=String(encounter.rank)+'-'+encounter.type;
          row.dataset.atlasPortalForm=String(encounter.form);
          const formLabel=portalFormLabels[r.number]?.[encounter.form];
          row.textContent=(formLabel?formLabel+' — ':'')+encounter.rank+'★ '+encounter.type+' — catch Lv. '+encounter.catch.join('–')+'; Alpha Lv. '+encounter.alpha.join('–');
          list.append(row);
        }
        links.append(list);
        const limits=document.createElement('p');
        limits.textContent='Look for the matching portal and preview Pokémon. These are possible generated encounters, not guaranteed spawns. Capture levels are shown, not boosted battle levels. Other routes and stats remain under review.';
        links.append(limits);
        if(reviewedPortalRoutes[r.number].some(encounter=>encounter.rank===5)){
          const scanNote=document.createElement('p');
          scanNote.textContent='For 5★ generated portals, unlock Special Scans after the Rayquaza story. Each scan costs 25,000 Hyperspace Survey Points and its result is random.';
          links.append(scanNote);
          const scans=document.createElement('a');scans.href='side-missions.html#quest-188';scans.textContent='Unlock Special Scans';
          links.append(scans,document.createElement('br'));
        }
        if(r.number===999){
          const mission=document.createElement('a');mission.href='side-missions.html#quest-122';mission.textContent='Separate Gimmighoul mission route';
          links.append(mission,document.createElement('br'));
        }
        const prep=document.createElement('a');prep.href='mega-dimension.html#portal-prep';prep.textContent='Portal ranks and donut preparation';
        links.append(prep,document.createElement('br'));
      }else{
        const note=document.createElement('p');note.textContent='Capture routes and stats for this entry are still being checked.';
        links.append(note);
      }
      links.append(home);details.append(links);card.append(button,details);
      origDexOrder.set(card,r.dexIndex);
      fragment.append(card);
    }
    grid.append(fragment);
    return true;
  }
  function updateDexFilter() {
    const source=$('[data-dex-source].active')?.dataset.dexSource || 'Lumiose';
    const filter=activeFilter('pokedex'),query=searchVal('dexSearch');
    const hyperspace=source==='Hyperspace';
    const installed=hyperspace&&installHyperspaceRoster();
    const cards=$$('#dexGrid > .dex-card');let visible=0,total=0;
    $$('[data-dex-source]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.dexSource===source)));
    const regionCards=cards.filter(node=>(node.dataset.dexRegion||'Lumiose')===source);
    const statsReady=!hyperspace||(regionCards.length===132&&regionCards.every(node=>$('.dex-total b',node)&&$$('.stat-row',node).length===6));
    for(const option of $$('#dexSort option'))option.disabled=!statsReady&&['total','speed'].includes(option.value);
    const sort=$('#dexSort');const resetSort=sort?.selectedOptions[0]?.disabled;
    if(resetSort)sort.value='number';
    cards.forEach(node=>{
      const type=$('.dex-types',node)?.textContent||'';
      const known=['Grass','Fire','Water','Electric','Psychic','Dragon','Fairy'];
      const typeMatch=filter==='All'||(filter==='Other'?!known.some(t=>type.includes(t)):type.includes(filter));
      const metadata=[ $('.dex-head strong',node)?.textContent||'', $('.dex-number',node)?.textContent||'', type ].join(' ').toLocaleLowerCase();
      const sameRegion=(node.dataset.dexRegion||'Lumiose')===source;
      if(sameRegion)total++;
      const yes=sameRegion && typeMatch && (!query || metadata.includes(query));
      show(node,yes);if(yes)visible++;
    });
    text('#dexCount',`${visible} of ${total} ${source} entries`);
    const notice=$('#dexUnrecovered');
    if(notice){
      notice.hidden=!hyperspace;
      notice.textContent=total?'All 132 numbered entries are listed, including 20 Legendary Fieldbook links, seven evolution notes and 105 generated-portal cards with form-specific capture bands. All entries have an acquisition note or guide link and default-form base stats from a Z-A-specific source. Alternate forms, learnsets, further encounters and Alpha availability remain under review.':'The Hyperspace roster could not load. Use the Pokémon HOME checklist link below.';
    }
    if(installed||resetSort)sortDex();
  }
  function sortDex() {
    const grid=$('#dexGrid');if(!grid)return;
    const mode=$('#dexSort')?.value||'number';
    const val=(node)=>{
      if(mode==='name')return $('.dex-head strong',node)?.textContent||'';
      if(mode==='total')return Number($('.dex-total b',node)?.textContent)||0;
      if(mode==='speed')return Number($$('.stat-row',node).at(-1)?.lastElementChild?.textContent)||0;
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
    if(areaUI&&!syncingArea)areaUI.selectArea('wz-'+String(zone).padStart(2,'0'),{history:navigate?'replace':false,focus:false});
    else if(!areaUI&&navigate){
      // The optional evidence may still be loading. Commit an explicit original
      // control choice now so initialization reads this URL, not an older area.
      const url=new URL(location.href);
      url.searchParams.set('area','wz-'+String(zone).padStart(2,'0'));
      url.searchParams.delete('species');
      const target=url.pathname+url.search+url.hash;
      if(target!==location.pathname+location.search+location.hash)history.replaceState(history.state,'',target);
      earlyAreaSelection={areaId:url.searchParams.get('area'),href:location.href};
    }
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
    const intro=document.createElement('p');intro.textContent='Recovered zone overview. Zone markers provide orientation; item clues do not certify exact pickup coordinates.';wrap.appendChild(intro);
    const h=document.createElement('h4');h.textContent='Pokémon field notes';wrap.appendChild(h);
    const ul=document.createElement('ul');names.forEach(name=>{const li=document.createElement('li');li.textContent=name;ul.appendChild(li);});wrap.appendChild(ul);
    const pick=document.createElement('h4');pick.textContent='Item checklist preview';wrap.appendChild(pick);
    const list=document.createElement('ul');sample.forEach(name=>{const li=document.createElement('li');li.textContent=name;list.appendChild(li);});wrap.appendChild(list);
    const button=document.createElement('button');button.type='button';button.className='button light';button.textContent=`Open all zone ${zone} pickups ↗`;
    button.addEventListener('click',()=>{setItemZone(String(zone));route('items');});wrap.appendChild(button);
    detail.appendChild(wrap);
    // Reuse the same local photo/encounter record as the standalone maps.
    // Keep the original Alpha/item panel available if the optional module fails.
    const photoLink=document.createElement('a');
    photoLink.href='maps.html#wild-zone-'+zone;
    photoLink.textContent='Open this Wild Zone’s original photos and Pokémon roster ↗';
    wrap.appendChild(photoLink);
    import('./wild-zone-fieldbook.mjs').then(({wildZoneFieldbookMarkup})=>{
      if(wrap.isConnected && currentZone===zone)intro.insertAdjacentHTML('afterend',wildZoneFieldbookMarkup(zone));
    }).catch(()=>{/* The explicit standalone link remains available. */});
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
    const found=$$('#dexGrid > .dex-card').find(node=>!node.dataset.dexRegion&&$('.dex-head strong',node)?.textContent.trim().toLowerCase()===name.toLowerCase());
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
  import('./atlas-area-surfaces.mjs').then(async({installAreaSurface,installDexHabitatLinks})=>{
    areaUI=await installAreaSurface({surface:'main',onSelection:({selection})=>{
      const zone=/^wz-(\d{2})$/.exec(selection.areaId||'');
      if(!zone){
        if(currentZone!==null){
          currentZone=null;
          $$('[data-select-zone]').forEach(button=>button.classList.remove('active'));
          const detail=$('#mapZoneDetail');
          if(detail){const message=document.createElement('p');message.textContent='Choose a Wild Zone on the original map or in the area directory to open its photographs and field notes.';detail.replaceChildren(message);}
        }
        return;
      }
      if(currentZone===Number(zone[1]))return;
      syncingArea=true;
      try{selectZone(Number(zone[1]),false);}finally{syncingArea=false;}
    }});
    // Reuse the loaded model's conditional filter reconciliation only while this
    // remains the same early choice. A newer navigation owns a different URL.
    const early=earlyAreaSelection;earlyAreaSelection=null;
    if(early&&location.href===early.href)areaUI?.selectArea(early.areaId,{history:'replace',focus:false});
    await installDexHabitatLinks(document);
  }).catch(()=>{/* The original map and Pokédex controls remain available. */});
})();
