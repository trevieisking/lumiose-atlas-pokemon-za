/* Shared area panels for the existing maps and Pokédex. Read-only; the original
 * page owns its markers, navigation and player progress. */
import {loadAreaModel,installAreaInteractions} from "./atlas-area-ui.mjs";
import {areaLink,speciesKey,isRecordedHabitat,selectAreaResults} from "./atlas-area-model.mjs";

const surfaces={
  standalone:{scope:"#city-map",before:".map-workspace",map:"#mapCity"},
  sectors:{scope:"#city-overview",before:".sector-city-map",map:".sector-city-map"},
  main:{scope:"#maps",before:".atlas-layout",map:"#atlasMap"}
};

function stylesheet(doc){
  if(doc.querySelector('link[data-atlas-area-style]'))return;
  const link=doc.createElement("link");
  link.rel="stylesheet";link.href="atlas-area.css";link.dataset.atlasAreaStyle="";
  doc.head.append(link);
}

export async function installAreaSurface({surface,onSelection,onAreaFocus,areaFocusLabel,document:doc=globalThis.document}){
  const config=surfaces[surface];if(!config||!doc)return null;
  const scope=doc.querySelector(config.scope),map=scope?.querySelector(config.map);
  const before=scope?.querySelector(config.before);
  if(!scope||!map||!before||scope.querySelector('[data-atlas-area-surface]'))return null;
  const model=await loadAreaModel();
  stylesheet(doc);
  const host=doc.createElement("section");
  host.dataset.atlasAreaSurface=surface;host.className="atlas-area-surface";
  host.setAttribute("aria-label","Shared area and Pokémon habitat search");
  before.before(host);
  try{
    return await installAreaInteractions({host,model,overlayHost:map,onSelection,onAreaFocus,areaFocusLabel});
  }catch(error){host.remove();throw error;}
}

/* Capture-first Pokédex: expose the shared evidence without promoting leads. */
const encounterLabels={recorded:"Preserved roster (encounter class unresolved)",ordinary:"Ordinary encounter",fixed_alpha:"Fixed Alpha",random_alpha:"Chance Alpha (not guaranteed)",rotating_alpha:"Rotating Alpha candidate (not guaranteed)",gift:"Gift",trade:"Trade",scripted_boss:"Scripted boss (not a wild catch)",mission:"Mission encounter",unclassified_lead:"Unclassified research lead"};
const evidenceLabels={baseline_preserved:"Original roster; conditions incomplete",source_corroborated:"Written-source cross-check",owner_survey_correlated:"Owner survey matched",verified:"Verified encounter",disputed:"Disputed — do not rely on this as a catch location",source_lead:"Unconfirmed research lead"};
const weatherGuide="https://www.serebii.net/legendsz-a/weather.shtml";
const catchTips={
  goomy:[
    ["Outdoor encounters require rain near water. A roof opposite Stone Emporium in Vert Sector 9 and the sheltered hill between Jaune Sectors 10 and 12 are reported additional search locations. Time and precise native map points remain unverified.","https://www.powerpyx.com/pokemon-legends-z-a-goomy-location/"],
    ["Alternative: southern Lumiose Sewers; reported weather-independent indoor encounter after sewer access. A reported route uses a Fire-type move to clear an ice obstacle, forming a bridge. Exact room, unlock and time need independent verification.","https://allthings.how/find-goomy-in-pokemon-legends-z-a-sewer-route-and-rainy-spawn/"],
    ["Southern sewer and outdoor rain locations are independently listed.","https://www.nintendolife.com/guides/pokemon-legends-z-a-pokedex-all-lumiose-pokemon-locations-and-evolutions"]],
  sliggoo:[["Rare outdoor encounter near water in rain; alternative: evolve Goomy at level 40. Individual locations and time still need verification.","https://www.powerpyx.com/pokemon-legends-z-a-sliggoo-location/"]],
  goodra:[["Alternative to the rotating Alpha pool: evolve Sliggoo at level 50 or higher while it is raining. Rain is an evolution requirement, not a claim about Wild Zone 20 spawn weather.","https://www.powerpyx.com/pokemon-legends-z-a-sliggoo-location/"]],
  riolu:[["The weather guide lists Intense Sun as enabling Riolu spawns. Check the individual location's time and weather restrictions; not every Riolu encounter is established to require Intense Sun.",weatherGuide]],
  helioptile:[["The weather guide lists Intense Sun as enabling Helioptile spawns; do not assume the same condition for every Wild Zone or other route.",weatherGuide]],
  skarmory:[["The weather guide reports Skarmory does not spawn during rain. Route-specific applicability remains under review.",weatherGuide]]
};
function node(doc,tag,text){const el=doc.createElement(tag);if(text!==undefined)el.textContent=text;return el;}
function renderCaptureRow(doc,row,areas){
  const item=node(doc,"li");item.dataset.dexEncounterId=row.id;item.dataset.dexEncounterClass=row.encounterClass;item.dataset.dexEncounterEvidence=row.evidenceStatus;
  const area=areas.get(row.areaId),supported=isRecordedHabitat(row);
  const link=node(doc,"a",area?.name||row.areaId);link.href=areaLink(supported?{areaId:row.areaId,speciesId:row.speciesId,encounterClass:row.encounterClass}:{areaId:row.areaId});
  item.append(link,node(doc,"p",(encounterLabels[row.encounterClass]||row.encounterClass)+(row.form?" · "+row.form:"")+" · "+(evidenceLabels[row.evidenceStatus]||row.evidenceStatus)));
  const conditions=node(doc,"p");conditions.dataset.dexConditions="";
  conditions.textContent=[["Time","time"],["Weather","weather"],["Elevation","floor"],["Unlock","unlock"]].map(([label,key])=>label+": "+(row.condition[key]||"Not verified")).join(" · ");
  item.append(conditions);
  for(const [label,key] of [["Level","level"],["Directions","directions"],["Refresh encounters","respawn"]]){
    if(row.condition[key])item.append(node(doc,"p",label+": "+row.condition[key]));
  }
  for(const note of [...row.condition.notes,...row.notes])item.append(node(doc,"p",note));
  const usable=row.sources.filter(source=>source.href);
  if(usable.length){
    const details=node(doc,"details");details.append(node(doc,"summary","Sources and evidence"));
    for(const source of usable){const a=node(doc,"a",source.claim);a.href=source.href;const p=node(doc,"p");p.append(a);details.append(p);}
    item.append(details);
  }
  return item;
}
function installCaptureDetails(doc,location,name,model,areas){
  const id=speciesKey(name),result=selectAreaResults(model,{speciesId:id});
  const section=node(doc,"section");section.dataset.dexCaptureGuide=id;
  section.append(node(doc,"h4","Capture locations and conditions"));
  section.append(node(doc,"p","Current recorded areas: "+result.areas.length+". This is not yet an exhaustive encounter survey. Unknown conditions are not unrestricted conditions."));
  for(const [tip,href] of catchTips[id]||[]){const p=node(doc,"p",tip+" ");const a=node(doc,"a","Source");a.href=href;p.append(a);section.append(p);}
  if(result.encounters.length){
    const details=node(doc,"details");details.open=true;details.append(node(doc,"summary","Recorded habitat encounters ("+result.encounters.length+" records, "+result.areas.length+" areas)"));
    const list=node(doc,"ul");for(const row of result.encounters)list.append(renderCaptureRow(doc,row,areas));details.append(list);section.append(details);
  }else section.append(node(doc,"p","No supported repeatable wild habitat is indexed here yet. Use the existing acquisition notes; further research is open."));
  if(result.relatedClaims.length){
    const details=node(doc,"details");details.dataset.dexResearchClaims="";details.append(node(doc,"summary","Other acquisition records and unconfirmed leads ("+result.relatedClaims.length+")"));
    const list=node(doc,"ul");for(const row of result.relatedClaims)list.append(renderCaptureRow(doc,row,areas));details.append(list);section.append(details);
  }
  location.append(section);
}

export async function installDexHabitatLinks(doc=globalThis.document){
  if(!doc?.getElementById("dexGrid"))return;
  const model=await loadAreaModel();
  const known=new Set(model.species.map(species=>species.id));
  const areas=new Map(model.areas.map(area=>[area.id,area]));
  for(const card of doc.querySelectorAll("#dexGrid > .dex-card")){
    const name=card.querySelector(".dex-head strong")?.textContent?.trim();
    const location=card.querySelector(".dex-location");
    if(!name||!location)continue;
    if(!card.dataset.dexRegion&&!location.querySelector("[data-dex-capture-guide]"))installCaptureDetails(doc,location,name,model,areas);
    if(!known.has(speciesKey(name))||location.querySelector("[data-atlas-habitat-link]"))continue;
    const link=doc.createElement("a");
    link.href=areaLink({speciesId:speciesKey(name)});
    link.dataset.atlasHabitatLink=speciesKey(name);
    link.textContent="Explore recorded habitats for "+name;
    const row=doc.createElement("div");row.className="dex-location-links";
    row.append(link);location.append(row);
  }
}
