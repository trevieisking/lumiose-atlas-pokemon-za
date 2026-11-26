/* Shared area panels for the existing maps and Pokédex. Read-only; the original
 * page owns its markers, navigation and player progress. */
import {loadAreaModel,installAreaInteractions} from "./atlas-area-ui.mjs";
import {areaLink,speciesKey} from "./atlas-area-model.mjs";

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

export async function installDexHabitatLinks(doc=globalThis.document){
  if(!doc?.getElementById("dexGrid"))return;
  const model=await loadAreaModel();
  const known=new Set(model.species.map(species=>species.id));
  for(const card of doc.querySelectorAll("#dexGrid > .dex-card")){
    const name=card.querySelector(".dex-head strong")?.textContent?.trim();
    const location=card.querySelector(".dex-location");
    if(!name||!location||!known.has(speciesKey(name))||location.querySelector("[data-atlas-habitat-link]"))continue;
    const link=doc.createElement("a");
    link.href=areaLink({speciesId:speciesKey(name)});
    link.dataset.atlasHabitatLink=speciesKey(name);
    link.textContent="Explore recorded habitats for "+name;
    const row=doc.createElement("div");row.className="dex-location-links";
    row.append(link);location.append(row);
  }
}
