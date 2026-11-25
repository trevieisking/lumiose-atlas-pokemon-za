/* AT-311: shared map/video guide references. No coordinate, storage, API,
   progress, tracking, iframe, or original map changes. Only explicit links.
   Video chapters are creator-published metadata, not frame-verified surveys. */
const LIMITS=Object.freeze({vert:9,bleu:10,magenta:9,rouge:8,jaune:12});
const ENCOUNTER=Object.freeze([41,127,202,323,385,527,686,774,867,1040,1182,1305,1433,1541,1657,1815,1943,2107,2303,2376]);
const HUNT=Object.freeze([371,629,928,1119,1313,1606,1847,2025,2625,2911,3219,3402,3597,3790,4350,4709,4834,5365,5642,5927]);
const SIDE=Object.freeze([1,155,272,459,609,687,851,1025,1264,1611,1691,1828,2006,2235,2375,2497,2693,2790,3001,3197,3317,3699,3852,3973,4068,4226,4434,4590,4728,4924,5194,5587,5719]);
const SCREW=Object.freeze({rouge:[124,"red"],jaune:[930,"yellow"],vert:[1549,"green"],bleu:[2296,"blue"],magenta:[2894,"pink"]});
export const VIDEO_SOURCES=Object.freeze({
  encounters:{id:"iQeOi4sjLB4",creator:"AnwJoeGames",title:"Every Wild Zone Pokémon",date:"2025-10-25"},
  hunting:{id:"X54oNz8lhJ4",creator:"Hylianstagram",title:"Complete shiny and shalpha hunting guide",date:"2025-12-30"},
  screws:{id:"BYfSBf-a4g0",creator:"Khrey",title:"All 100 Colorful Screws",date:"2025-10-22"},
  sides:{id:"zh74vxGo56o",creator:"Crystal Longplays",title:"All Side Mission Guide/Walkthrough",date:"2025-11-05"},
  holovator61:{id:"oNzm9uQOCcs",creator:"Andruidus",title:"Side Mission #061: My Favorite Holovator",date:"2025-10-22"}
});
const cap=s=>s[0].toUpperCase()+s.slice(1);
const zoneOK=n=>Number.isInteger(n)&&n>=1&&n<=20;
const sectorOK=(d,n)=>Object.hasOwn(LIMITS,d)&&Number.isInteger(n)&&n>=1&&n<=LIMITS[d];
const internal=(href,label)=>({href,label});
const stamp=n=>Math.floor(n/60)+":"+String(n%60).padStart(2,"0");
function video(source,seconds,label){
  const info=VIDEO_SOURCES[source];
  return {href:"https://www.youtube.com/watch?v="+info.id+(seconds>0?"&t="+seconds+"s":""),label:label+" · "+info.creator+(seconds>0?" ("+stamp(seconds)+")":""),external:true,source,seconds};
}
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
export function zoneVideos(n){
  return zoneOK(n)?[video("encounters",ENCOUNTER[n-1],"Zone "+n+" encounters"),video("hunting",HUNT[n-1],"Zone "+n+" shiny/Alpha hunting")]:[];
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
export function screwVideo(d){
  return Object.hasOwn(SCREW,d)?video("screws",SCREW[d][0],"Colorful Screws · creator's "+SCREW[d][1]+" chapter"):null;
}
export function sideVideo(n){
  if(n===61)return video("holovator61",0,"My Favorite Holovator · mission video");
  return Number.isInteger(n)&&n>=1&&n<=SIDE.length?video("sides",SIDE[n-1],"Side Mission "+n+" · walkthrough chapter"):null;
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
const VIDEO_NOTE="External video: creator's title/chapter checked; footage not frame-verified. Opens a new tab. Older footage may show patched methods.";
const SECTOR_NOTE="Sector map and photos are orientation references, not measured boundaries or exact pickup/roof coordinates. Video chapter numbers do not establish Atlas Screw IDs.";
export function appendGuidePanel(host,title,links,note=""){
  if(!host||!links.length||host.querySelector(":scope > .atlas-guide-links"))return null;
  const doc=host.ownerDocument, panel=doc.createElement("aside");
  panel.className="atlas-guide-links";panel.setAttribute("aria-label",title);
  const heading=doc.createElement("strong");heading.textContent=title;panel.append(heading);
  const row=doc.createElement("div");row.className="atlas-guide-link-row";
  for(const item of dedupe(links)){
    const a=doc.createElement("a");a.href=item.href;a.textContent=item.label;
    if(item.external){a.target="_blank";a.rel="noopener noreferrer";a.className="atlas-guide-video";}
    row.append(a);
  }
  panel.append(row);
  const notes=[note,links.some(x=>x.external)?VIDEO_NOTE:""].filter(Boolean);
  if(notes.length){const p=doc.createElement("p");p.textContent=notes.join(" ");panel.append(p);}
  host.append(panel);return panel;
}
export function installArticleLinks(doc,page){
  const by=id=>doc.getElementById(id);
  const zonePages={"maps.html":"wild-zone-","sector-maps.html":"wildzone-","alphas.html":"zone-","items.html":"items-zone-"};
  if(Object.hasOwn(zonePages,page)){
    for(let n=1;n<=20;n++){
      const card=by(zonePages[page]+n);
      const videos=page==="items.html"?[]:zoneVideos(n);
      appendGuidePanel(card,"Maps, field notes and videos",[...zoneLinks(n,page),...videos],
        page==="items.html"?"Use the existing pickup checklist; a zone overview does not establish an exact pickup point.":"Videos cover encounters and hunting, not verified pickup or entrance coordinates.");
    }
  }
  if(page==="sector-maps.html"||page==="items.html"){
    for(const [d,total] of Object.entries(LIMITS))for(let n=1;n<=total;n++){
      const card=by(page==="sector-maps.html"?"sector-"+d+"-sector-"+n:"sector-"+d+"-"+n);
      if(!card)continue;
      const body=card.querySelector(".sector-card-body")||card.querySelector("details")||card;
      appendGuidePanel(body,"Related sector guides",[...sectorLinks(d,n,page),screwVideo(d)],SECTOR_NOTE);
    }
  }
  if(page==="items.html")appendGuidePanel(by("screw-fieldbook"),"Colorful Screw video fieldbook",
    [video("screws",0,"All 100 Colorful Screws"),...Object.keys(SCREW).map(screwVideo)],
    "Use the creator's colour chapters as a visual supplement. Their numbering is not an Atlas item-ID crosswalk.");
  if(page==="walkthrough.html"){
    for(const card of doc.querySelectorAll(".route-index-card[data-mission]")){
      const location=card.querySelector(".route-index-map")?.textContent||"";
      const links=locationLinks(location);
      appendGuidePanel(card.querySelector(".route-index-body"),"Route map references",
        links.length?links:[internal("maps.html","Open Lumiose city map"),internal("sector-maps.html#sector-directory","Browse all sector maps")],
        "Use the named area for orientation, then follow the mission's in-game marker. A changing battle zone or unmeasured location is not a fixed pin.");
    }
  }
  if(page==="side-missions.html"){
    for(const card of doc.querySelectorAll(".restored-side-quest[data-quest-key]")){
      const body=card.querySelector("details.side-route > div");
      if(!body)continue;
      const start=[...body.querySelectorAll("p")].find(p=>p.querySelector("b")?.textContent.trim()==="Start:");
      const links=locationLinks(start?.textContent||"");
      const n=Number(card.dataset.questKey),clip=sideVideo(n);
      if(n===61)links.push(internal("atlas-explorer.html?place=bleu3-fav","Owner-photo Holovator approach · approximate map area"));
      if(clip)links.push(clip);
      if(links.length)appendGuidePanel(body,"Map and video references",links,
        "Map links show the named area, not a precise quest marker. Follow the active marker for changing or DLC portal locations.");
    }
  }
  if(page==="shiny-hunting.html"){
    appendGuidePanel(by("hunt-methods"),"Zone-by-zone hunting videos",
      [internal("maps.html#zone-directory","All 20 Wild Zone maps and video chapters"),video("hunting",0,"Full shiny and shalpha guide")],
      "Check the current game version before following spawn-overload methods.");
    appendGuidePanel(by("mega-dimension"),"Mega Dimension hunting",
      [internal("hyperspace-maps.html","Hyperspace layouts and written directions"),video("hunting",9620,"Donut preparation"),video("hunting",10290,"Hyperspace shiny hunting")]);
  }
  if(page==="hyperspace-maps.html")appendGuidePanel(by("expedition-plan"),"Video field guidance",
    [video("hunting",9524,"Mega Dimension overview"),video("hunting",9620,"Donut preparation"),video("hunting",10290,"Hyperspace shiny hunting")],
    "These are general DLC methods. Random distortions move; follow the portal shown in your current game, never a permanent city pin.");
  if(page==="mega-dimension.html")appendGuidePanel(by("main"),"Hyperspace maps and video field guidance",
    [internal("hyperspace-maps.html","Hyperspace maps and expedition directions"),video("hunting",9524,"Mega Dimension overview"),video("hunting",9620,"Donut preparation")],
    "Random distortions change. Video methods do not establish permanent map pins.");
}
