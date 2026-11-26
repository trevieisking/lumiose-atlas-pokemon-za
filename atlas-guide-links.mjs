/* Shared local guide references. Written routes and photographs only.
   No coordinates, tracking, storage, external player or progress writes. */
const LIMITS=Object.freeze({vert:9,bleu:10,magenta:9,rouge:8,jaune:12});
const cap=s=>s[0].toUpperCase()+s.slice(1);
const zoneOK=n=>Number.isInteger(n)&&n>=1&&n<=20;
const sectorOK=(d,n)=>Object.hasOwn(LIMITS,d)&&Number.isInteger(n)&&n>=1&&n<=LIMITS[d];
const internal=(href,label)=>({href,label});

const dedupe=links=>[...new Map(links.map(l=>[l.href,l])).values()];
export function zoneLinks(n,current=""){
  if(!zoneOK(n))return [];
  const links=[
    internal("atlas-explorer.html?place=wz-"+String(n).padStart(2,"0"),"Interactive map · Zone "+n),
    internal("maps.html#wild-zone-"+n,"City map and Wild Zone "+n+" notes"),
    internal("sector-maps.html#wildzone-"+n,"Zone "+n+" close-up and source clues"),
    internal("alphas.html#zone-"+n,"Zone "+n+" Alpha Pokémon"),
    internal("items.html#items-zone-"+n,"Zone "+n+" item checklist")
  ].filter(l=>!current||l.href.split(/[?#]/)[0]!==current);
  return links;
}

export function sectorLinks(d,n,current=""){
  if(!sectorOK(d,n))return [];
  const id=d+"-sector-"+n, title=cap(d)+" Sector "+n;
  return [
    internal("atlas-explorer.html?sector="+id,"District map · "+title),
    internal("sector-maps.html#sector-"+id,title+" photos and written clues"),
    internal("items.html#sector-"+d+"-"+n,title+" item/Screw clues")
  ].filter(l=>!current||l.href.split(/[?#]/)[0]!==current);
}

export function locationLinks(text){
  const links=[];
  if(typeof text!=="string")return links;
  for(const m of text.matchAll(/\b(Vert|Bleu|Magenta|Rouge|Jaune) Sector (\d{1,2})\b/gi)){
    const d=m[1].toLowerCase(),n=Number(m[2]);
    if(sectorOK(d,n))links.push(internal("sector-maps.html#sector-"+d+"-sector-"+n,"Area reference · "+cap(d)+" Sector "+n));
  }
  for(const m of text.matchAll(/\bWild Zones? (\d{1,2})(?:\s*[-–—]\s*(\d{1,2}))?\b/gi)){
    const a=Number(m[1]),b=m[2]?Number(m[2]):a;
    if(zoneOK(a)&&zoneOK(b)&&b>=a)for(let n=a;n<=b;n++)links.push(internal("sector-maps.html#wildzone-"+n,"Area reference · Wild Zone "+n));
  }
  if(/hyperspace|distortion|portal/i.test(text))links.push(internal("hyperspace-maps.html#portal-types","Hyperspace portal guide (live in-game location)"));
  return dedupe(links);
}

const SECTOR_NOTE="Original sector photographs and reviewed named-sector footprints identify map areas. They do not establish exact pickup, roof or floor coordinates, or verify walking routes.";
export function appendGuidePanel(host,title,links,note=""){
  const local=dedupe(links.filter(item=>item&&typeof item.href==="string"&&!item.external&&/^[a-z0-9-]+\.html(?:[?#][a-zA-Z0-9_=&%.-]+)?$/.test(item.href)));
  if(!host||!local.length||host.querySelector(":scope > .atlas-guide-links"))return null;
  const doc=host.ownerDocument,panel=doc.createElement("aside");
  panel.className="atlas-guide-links";panel.setAttribute("aria-label",title);
  const heading=doc.createElement("strong");heading.textContent=title;panel.append(heading);
  const row=doc.createElement("div");row.className="atlas-guide-link-row";
  for(const item of local){
    const a=doc.createElement("a");a.href=item.href;a.textContent=item.label;row.append(a);
  }
  panel.append(row);
  if(note){const p=doc.createElement("p");p.textContent=note;panel.append(p);}
  host.append(panel);return panel;
}
export function installArticleLinks(doc,page){
  const by=id=>doc.getElementById(id);
  const zonePages={"maps.html":"wild-zone-","sector-maps.html":"wildzone-","alphas.html":"zone-","items.html":"items-zone-"};
  if(Object.hasOwn(zonePages,page)){
    for(let n=1;n<=20;n++){
      appendGuidePanel(by(zonePages[page]+n),"Maps and field notes",zoneLinks(n,page),
        "Use the photographs, written clues and existing checklist; the zone overview is not an exact pickup point.");
    }
  }
  if(page==="sector-maps.html"||page==="items.html"){
    for(const [d,total] of Object.entries(LIMITS))for(let n=1;n<=total;n++){
      const card=by(page==="sector-maps.html"?"sector-"+d+"-sector-"+n:"sector-"+d+"-"+n);
      if(!card)continue;
      appendGuidePanel(card.querySelector(".sector-card-body")||card.querySelector("details")||card,
        "Related sector guides",sectorLinks(d,n,page),SECTOR_NOTE);
    }
  }
  if(page==="items.html")appendGuidePanel(by("screw-fieldbook"),"Colorful Screw location guides",
    [internal("sector-maps.html#sector-directory","Sector photographs and access clues"),internal("atlas-explorer.html","Interactive city map")],
    "Keep the original Screw checklist; an area clue is not a confirmed pickup coordinate.");
  if(page==="walkthrough.html"){
    for(const card of doc.querySelectorAll(".route-index-card[data-mission]")){
      const location=card.querySelector(".route-index-map")?.textContent||"";
      const links=locationLinks(location);
      const refs=links.length?links:[internal("maps.html","Open Lumiose city map"),internal("sector-maps.html#sector-directory","Browse all sector maps")];
      appendGuidePanel(card.querySelector(".route-index-body"),"Route map references",refs,
        "Use the named area for orientation, then follow the mission's in-game marker. A changing battle zone or unmeasured location is not a fixed pin.");
    }
  }
  if(page==="side-missions.html"){
    for(const card of doc.querySelectorAll(".restored-side-quest[data-quest-key]")){
      const body=card.querySelector("details.side-route > div");if(!body)continue;
      const start=[...body.querySelectorAll("p")].find(p=>p.querySelector("b")?.textContent.trim()==="Start:");
      const links=locationLinks(start?.textContent||"");
      const n=Number(card.dataset.questKey);
      if(n===57)links.push(internal("atlas-explorer.html?sector=bleu-sector-1","Step-by-step sewer entrance routes · district reference"));
      if(n===61)links.push(internal("atlas-explorer.html?place=bleu3-fav","Owner-photo Holovator approach · approximate map area"));
      if(links.length)appendGuidePanel(body,"Map references",links,
        "Map links show the named area, not a precise quest marker. Follow the active marker for changing or DLC portal locations.");
    }
  }
  if(page==="shiny-hunting.html"){
    appendGuidePanel(by("hunt-methods"),"Wild Zone hunting locations",
      [internal("maps.html#zone-directory","All 20 Wild Zone maps")],
      "Check the current game version before following spawn-overload methods.");
    appendGuidePanel(by("mega-dimension"),"Mega Dimension hunting",
      [internal("hyperspace-maps.html","Hyperspace layouts and written directions")]);
  }
  if(page==="hyperspace-maps.html")appendGuidePanel(by("expedition-plan"),"Expedition guide",
    [internal("mega-dimension.html","Mega Dimension walkthrough")],
    "Random distortions move; follow the portal shown in your current game, never a permanent city pin.");
  if(page==="mega-dimension.html")appendGuidePanel(by("main"),"Hyperspace maps and written guidance",
    [internal("hyperspace-maps.html","Hyperspace maps and expedition directions")],
    "Random distortions change; no permanent map pin is implied.");
}
