/* AT-346: Read-only Alpha species index. It projects previously reviewed
 * guide evidence, not a complete form or acquisition database. No save writes. */
import {wildZoneRecords} from "./wild-zone-fieldbook.mjs";
import {speciesKey} from "./atlas-area-model.mjs";

// Source: Serebii Unobtainable Alpha Pokémon, checked 2026-11-27.
// https://www.serebii.net/legendsz-a/unobtainablealpha.shtml
export const unavailableAlphaIds=Object.freeze([150,380,381,382,383,384,485,491,638,639,640,647,648,649,716,717,718,719,720,721,801,802,807,808,809]);
// Exact species-ID projection of the reviewed 105 generated Hyperspace cards
// in app.js; regression tests reject drift. Not an assertion about all forms.
export const portalAlphaIds=Object.freeze([39,40,41,42,52,53,56,57,83,104,105,122,137,169,174,211,233,252,253,254,255,256,257,258,259,260,316,317,325,326,335,336,349,352,358,396,397,398,433,439,474,479,509,510,517,518,538,539,562,563,590,591,615,622,623,739,740,767,768,769,770,778,821,822,823,827,828,848,849,852,853,863,866,876,877,900,904,926,927,931,932,933,934,935,942,943,944,945,951,952,957,958,959,967,969,970,971,972,973,977,978,996,997,998,999]);
const namedRoutes=[
  [
    659,
    "mission",
    "Side Mission 1: catch the Lv. 10 Alpha Bunnelby; chance in Wild Zone 1 after survey.",
    "#alpha-bunnelby-mission-1"
  ],
  [
    13,
    "mission",
    "Side Mission 43: catch Alpha Weedle and decline the handover to keep it.",
    "#alpha-weedle-mission-43"
  ],
  [
    505,
    "mission",
    "Side Mission 71: catch the Lv. 50 Alpha Watchog.",
    "#alpha-watchog-mission-71"
  ],
  [
    208,
    "mission",
    "One-time Main Mission 40 Alpha; catch it rather than defeating it.",
    "#alpha-mission-40"
  ],
  [
    475,
    "mission",
    "One-time Main Mission 40 Alpha; catch it rather than defeating it.",
    "#alpha-mission-40"
  ],
  [
    675,
    "mission",
    "One-time Main Mission 40 Alpha; catch it rather than defeating it.",
    "#alpha-mission-40"
  ],
  [
    152,
    "gift",
    "First Z-A transfer to Pokémon HOME: claim the Alpha starter gift in mobile HOME.",
    "home-connection.html"
  ],
  [
    498,
    "gift",
    "First Z-A transfer to Pokémon HOME: claim the Alpha starter gift in mobile HOME.",
    "home-connection.html"
  ],
  [
    158,
    "gift",
    "First Z-A transfer to Pokémon HOME: claim the Alpha starter gift in mobile HOME.",
    "home-connection.html"
  ],
  [
    142,
    "fossil",
    "Repeat fossil revival at the Research Lab after Side Mission 27; Alpha chance.",
    "#alpha-fossils"
  ],
  [
    696,
    "fossil",
    "Repeat fossil revival at the Research Lab after Side Mission 27; Alpha chance.",
    "#alpha-fossils"
  ],
  [
    698,
    "fossil",
    "Repeat fossil revival at the Research Lab after Side Mission 27; Alpha chance.",
    "#alpha-fossils"
  ],
  [
    147,
    "chance",
    "Café Kizuna roof, Jaune Sector 5: daytime, sunny/clear-sunny/rainbow; Alpha Lv. 38–39 if selected.",
    "#alpha-dratini-rooftops"
  ],
  [
    148,
    "chance",
    "Restaurant Le Nah roof, Vert Sector 6: Alpha Lv. 40–42 if selected.",
    "#alpha-dragonair-rooftop"
  ],
  [
    710,
    "chance",
    "Wild Zone 15 after local survey: all four varieties, day/night dependent, Alpha Lv. 52–53 if selected.",
    "atlas-explorer.html?species=pumpkaboo&encounter=random_alpha"
  ],
  [
    447,
    "chance",
    "Reviewed rooftop Riolu routes; chance encounter.",
    "#alpha-riolu-rooftops"
  ],
  [
    280,
    "chance",
    "Reviewed city chance encounter; check the individual route and conditions.",
    "#alpha-more-city-chances"
  ],
  [
    246,
    "chance",
    "Reviewed city chance encounter; check the individual route and conditions.",
    "#alpha-more-city-chances"
  ],
  [
    702,
    "chance",
    "Reviewed city chance encounter; check the individual route and conditions.",
    "#alpha-more-city-chances"
  ],
  [
    704,
    "chance",
    "Rainy rooftop/canal approaches; see the separate location observations.",
    "#alpha-goomy-sliggoo-canal"
  ],
  [
    705,
    "chance",
    "Rainy rooftop/canal approaches; see the separate location observations.",
    "#alpha-goomy-sliggoo-canal"
  ],
  [
    669,
    "chance",
    "Five flower colours have separate chance-Alpha locations.",
    "#alpha-flabebe-colours"
  ],
  [
    666,
    "chance",
    "Meadow and Garden pattern routes are distinguished in the fieldbook; Marine and Poké Ball gifts are separate and not assumed to be Alpha.",
    "#alpha-vivillon-patterns"
  ]
];
const allowedGroup=new Set(["Lumiose","Hyperspace"]);
const statuses={routes:"Route evidence recorded",unavailable:"Listed as Alpha-unobtainable",pending:"Further route indexing needed"};
export function buildAlphaCatalogue(roster,zones=wildZoneRecords){
  if(!Array.isArray(roster)||roster.length!==364||new Set(roster.map(r=>r.number)).size!==364||
     roster.filter(r=>r.group==="Lumiose").length!==232||roster.filter(r=>r.group==="Hyperspace").length!==132||
     !roster.every(r=>Number.isInteger(r.number)&&r.number>0&&typeof r.name==="string"&&allowedGroup.has(r.group)&&Number.isInteger(r.dexIndex)))throw Error("Incomplete species roster");
  const knownIds=new Set(roster.map(r=>r.number));
  if([...unavailableAlphaIds,...portalAlphaIds,...namedRoutes.map(r=>r[0])].some(n=>!knownIds.has(n)))throw Error("Unknown source species");
  const byName=new Map(roster.map(r=>[speciesKey(r.name),r.number])),routes=new Map(roster.map(r=>[r.number,[]]));
  const add=(n,kind,note,href)=>{if(!routes.has(n))throw Error("Unknown Alpha route species");routes.get(n).push({kind,note,href});};
  for(const z of zones){
    for(const a of z.fixedAlphas)add(byName.get(speciesKey(a.name)),"fixed","Wild Zone "+z.number+" · "+a.condition,"#zone-"+z.number);
    for(const name of z.rotatingAlphas)add(byName.get(speciesKey(name)),"rotating","Wild Zone "+z.number+" rotating pool; not guaranteed on a visit.","#zone-"+z.number);
  }
  for(const n of portalAlphaIds)add(n,"hyperspace","Reviewed generated Hyperspace routes with Alpha capture bands; check the Hyperspace Pokédex for the exact form, type and star rank.","index.html#pokedex");
  for(const args of namedRoutes)add(...args);
  return roster.map(r=>{
    const listed=unavailableAlphaIds.includes(r.number),evidence=routes.get(r.number);
    if(listed&&evidence.length)throw Error("Alpha evidence conflict for National #"+r.number);
    return {...r,status:listed?"unavailable":evidence.length?"routes":"pending",routes:evidence};
  });
}
export function filterAlphaCatalogue(records,{query="",status="all",region="all"}={}){
  const q=String(query).normalize("NFD").replace(/\p{M}/gu,"").toLowerCase().trim();
  return records.filter(r=>(status==="all"||r.status===status)&&(region==="all"||r.group===region)&&(!q||
    [r.name,r.types,r.group].some(v=>String(v).normalize("NFD").replace(/\p{M}/gu,"").toLowerCase().includes(q))||
    /^#?\d+$/.test(q)&&(Number(q.replace("#",""))===r.number||Number(q.replace("#",""))===r.dexIndex)));
}
function mount(doc){
  const host=doc.getElementById("alpha-catalogue");if(!host)return;
  const status=host.querySelector("[data-alpha-catalogue-status]"),list=host.querySelector("[data-alpha-catalogue-results]"),search=host.querySelector("[data-alpha-catalogue-search]"),kind=host.querySelector("[data-alpha-catalogue-filter]"),region=host.querySelector("[data-alpha-catalogue-region]"),prev=host.querySelector("[data-alpha-catalogue-prev]"),next=host.querySelector("[data-alpha-catalogue-next]");
  const make=(tag,text)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
  let catalogue;
  try{catalogue=buildAlphaCatalogue(globalThis.ATLAS_HOME_SOURCE?.records);}catch{status.textContent="Species index unavailable. The original Alpha fieldbook below remains usable.";return;}
  const size=24;let page=0;
  const count=k=>catalogue.filter(r=>r.status===k).length;
  host.querySelector("[data-alpha-catalogue-summary]").textContent=catalogue.length+" species indexed · "+count("routes")+" with route evidence here · "+count("unavailable")+" listed unavailable · "+count("pending")+" awaiting further route indexing.";
  function render(){
    const rows=filterAlphaCatalogue(catalogue,{query:search.value,status:kind.value,region:region.value});
    page=Math.min(page,Math.max(0,Math.ceil(rows.length/size)-1));const start=page*size;
    status.textContent=rows.length?"Showing "+(start+1)+"–"+Math.min(start+size,rows.length)+" of "+rows.length+" matching species":"No matching species.";
    list.replaceChildren();
    for(const r of rows.slice(start,start+size)){
      const item=make("li");item.dataset.alphaNational=String(r.number);item.dataset.alphaAvailability=r.status;
      item.append(make("strong",r.name),make("span",r.group+" #"+String(r.dexIndex).padStart(3,"0")+" · National #"+r.number+" · "+r.types),make("b",statuses[r.status]));
      if(r.status==="unavailable")item.append(make("p","Serebii lists this species as unable to be Alpha in Z-A. This is not a missing wild encounter."));
      else if(r.status==="pending")item.append(make("p","No individual route indexed in this catalogue yet. This does not mean the Pokémon is unavailable as an Alpha."));
      else for(const route of r.routes){const p=make("p",route.note+" ");const a=make("a","Open guide");a.href=route.href;p.append(a);item.append(p);}
      list.append(item);
    }
    prev.disabled=page===0;next.disabled=(page+1)*size>=rows.length;
  }
  for(const el of [search,kind,region])el.addEventListener(el===search?"input":"change",()=>{page=0;render();});
  prev.addEventListener("click",()=>{if(page>0){page--;render();}});
  next.addEventListener("click",()=>{page++;render();});
  render();
}
if(typeof document!=="undefined")mount(document);
