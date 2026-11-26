/* Shared read-only area, encounter and native-boundary model.
 * Existing centres are orientation records, never inferred boundary geometry.
 * Evidence flags describe a reviewed receipt; they do not independently verify it.
 */
export const AREA_MAP = Object.freeze({path:"maps/lumiose-game-map.jpg",sha256:"4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade",width:1920,height:1920,coordinateSpace:"atlas-native-pixels"});
export const ENCOUNTER_CLASSES = Object.freeze(["recorded","ordinary","fixed_alpha","rotating_alpha","gift","trade","scripted_boss","mission","unclassified_lead"]);
const WILD = new Set(["recorded","ordinary","fixed_alpha","rotating_alpha"]);
const STATUSES = new Set(["baseline_preserved","source_corroborated","owner_survey_correlated","verified","disputed","source_lead"]);
const DISTRICTS = new Set(["All","Vert","Bleu","Magenta","Rouge","Jaune","Centrico"]);
const object = x => x !== null && typeof x === "object" && !Array.isArray(x);
const string = (x,max=3000) => typeof x === "string" && x.trim().length > 0 && x.length <= max;
const own = (x,k) => Object.prototype.hasOwnProperty.call(x,k);
const freeze = value => {if(value&&typeof value==="object"&&!Object.isFrozen(value)){for(const x of Object.values(value))freeze(x);Object.freeze(value);}return value;};
const copy = value => JSON.parse(JSON.stringify(value));
const noteList = value => Array.isArray(value) ? value.filter(x=>string(x)).map(x=>x.trim()) : [];
const fold = value => typeof value === "string" ? value.normalize("NFD").replace(/\p{M}/gu,"").toLowerCase().replace(/\s+/g," ").trim() : "";
const areaIdValid = value => {
  if(typeof value!=="string")return false;
  if(/^wz-(?:0[1-9]|1[0-9]|20)$/.test(value))return true;
  const match=/^(vert|bleu|magenta|rouge|jaune)-sector-([1-9]|1[0-2])$/.exec(value);
  return Boolean(match&&Number(match[2])<=({vert:9,bleu:10,magenta:9,rouge:8,jaune:12})[match[1]]);
};
const point = value => Array.isArray(value)&&value.length===2&&value.every(n=>typeof n==="number"&&Number.isFinite(n)&&n>=0&&n<=1920);
const samePoint = (a,b) => a[0]===b[0]&&a[1]===b[1];
const fail = reason => freeze({eligible:false,reason,geometry:null});

export function speciesKey(name){return fold(name).replace(/♀/g," female ").replace(/♂/g," male ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");}
export function safeAreaSourceHref(value){
  if(!string(value,2000))return null;
  if(/^(?:docs\/|assets\/atlas\/|MAPS_|[a-z][a-z0-9-]*\.(?:html|mjs))/.test(value)&&!value.includes("..")&&!/[\\<>\s]/.test(value)&&!value.includes(":"))return value;
  try{const u=new URL(value);const allowed=new Set(["www.serebii.net","serebii.net","bulbapedia.bulbagarden.net","archives.bulbagarden.net","www.bisafans.de","bisafans.de","game8.co","game8.jp","gamewith.jp","wiki.52poke.com","altissimo1.github.io","pente.koro-pokemon.com","www.gamerguides.com","gamerguides.com","pokemaps.net","rotomlabs.net","www.powerpyx.com","www.thonky.com"]);return u.protocol==="https:"&&!u.username&&!u.password&&allowed.has(u.hostname)?u.href:null;}catch{return null;}
}

function orientation(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);}
function onSegment(a,b,p){return Math.abs(orientation(a,b,p))<1e-8&&p[0]>=Math.min(a[0],b[0])-1e-8&&p[0]<=Math.max(a[0],b[0])+1e-8&&p[1]>=Math.min(a[1],b[1])-1e-8&&p[1]<=Math.max(a[1],b[1])+1e-8;}
function intersects(a,b,c,d){const x=orientation(a,b,c),y=orientation(a,b,d),z=orientation(c,d,a),w=orientation(c,d,b);return x*y<0&&z*w<0||onSegment(a,b,c)||onSegment(a,b,d)||onSegment(c,d,a)||onSegment(c,d,b);}
function validRing(ring){
  if(!Array.isArray(ring)||ring.length<4||ring.length>2049||!ring.every(point)||!samePoint(ring[0],ring.at(-1)))return false;
  const keys=ring.slice(0,-1).map(p=>p.join(","));if(new Set(keys).size!==keys.length)return false;
  let area=0;for(let i=0;i<ring.length-1;i++)area+=ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];if(Math.abs(area)<1e-6)return false;
  for(let i=0;i<ring.length-1;i++)for(let j=i+1;j<ring.length-1;j++){if(j===i+1||i===0&&j===ring.length-2)continue;if(intersects(ring[i],ring[i+1],ring[j],ring[j+1]))return false;}
  return true;
}
function inside(p,ring){let yes=false;for(let i=0,j=ring.length-2;i<ring.length-1;j=i++){if(onSegment(ring[j],ring[i],p))return false;if((ring[i][1]>p[1])!==(ring[j][1]>p[1])&&p[0]<(ring[j][0]-ring[i][0])*(p[1]-ring[i][1])/(ring[j][1]-ring[i][1])+ring[i][0])yes=!yes;}return yes;}
function ringsTouch(a,b){for(let i=0;i<a.length-1;i++)for(let j=0;j<b.length-1;j++)if(intersects(a[i],a[i+1],b[j],b[j+1]))return true;return false;}
function validPolygon(rings){
  if(!Array.isArray(rings)||!rings.length||rings.length>32||!rings.every(validRing))return false;
  for(let i=1;i<rings.length;i++){
    if(!inside(rings[i][0],rings[0])||ringsTouch(rings[0],rings[i]))return false;
    for(let j=1;j<i;j++)if(ringsTouch(rings[i],rings[j])||inside(rings[i][0],rings[j])||inside(rings[j][0],rings[i]))return false;
  }return true;
}
function validGeometry(geometry){
  if(!object(geometry)||Object.keys(geometry).some(k=>!['type','coordinates'].includes(k)))return false;
  const pieces=geometry.type==='Polygon'?[geometry.coordinates]:geometry.type==='MultiPolygon'?geometry.coordinates:null;
  if(!Array.isArray(pieces))return false;let vertices=0;
  for(const polygon of pieces){if(!Array.isArray(polygon))return false;for(const ring of polygon){if(!Array.isArray(ring))return false;vertices+=ring.length;if(vertices>4096)return false;}}
  if(geometry.type==="Polygon")return validPolygon(geometry.coordinates);
  if(geometry.type!=="MultiPolygon"||!Array.isArray(geometry.coordinates)||!geometry.coordinates.length||geometry.coordinates.length>32||!geometry.coordinates.every(validPolygon))return false;
  // Separate pieces may not intersect or contain each other. Different area
  // records may overlap: sector and Wild Zone boundaries are separate layers.
  for(let i=0;i<geometry.coordinates.length;i++)for(let j=0;j<i;j++){
    const a=geometry.coordinates[i][0],b=geometry.coordinates[j][0];if(ringsTouch(a,b)||inside(a[0],b)||inside(b[0],a))return false;
  }return true;
}
/** uncertainty_px is declared raster/digitization uncertainty, not a world
 * confidence interval inferred from registration residuals. */
export function evaluateAreaGeometry(area,record,mapContext=AREA_MAP){
  try{
    if(!areaIdValid(area?.id)||!['zone','sector'].includes(area.kind))return fail("unknown_area");
    if(!record)return fail("boundary_not_verified");
    if(!object(mapContext)||Object.keys(AREA_MAP).some(k=>mapContext[k]!==AREA_MAP[k]))return fail("map_mismatch");
    if(record.area_id!==area.id||record.kind!==area.kind)return fail("identity_mismatch");
    if(record.status!=="approved")return fail("boundary_not_approved");
    if(record.coordinateSpace!==AREA_MAP.coordinateSpace||record.mapSha256!==AREA_MAP.sha256)return fail("coordinate_space_mismatch");
    if(!object(record.review)||!['boundary','registration','independent','occlusion'].every(k=>record.review[k]===true))return fail("review_incomplete");
    const r=record.registration;
    if(!object(r)||!string(r.method,240)||!Number.isInteger(r.control_count)||r.control_count<4||!Number.isInteger(r.holdout_count)||r.holdout_count<2||
      !['max_error_px','uncertainty_px','threshold_px'].every(k=>Number.isFinite(r[k])&&r[k]>=0)||r.threshold_px<=0||r.max_error_px>r.threshold_px||r.uncertainty_px>r.threshold_px)return fail("registration_incomplete");
    if(!Array.isArray(record.sources)||!record.sources.length||record.sources.length>32||!record.sources.every(s=>object(s)&&typeof s.path==="string"&&/^(?:assets\/atlas\/|maps\/)[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp)$/.test(s.path)&&!s.path.split('/').includes('..')&&/^[a-f0-9]{64}$/.test(s.sha256)&&string(s.claim)))return fail("source_evidence_incomplete");
    if(!validGeometry(record.geometry))return fail("invalid_polygon");
    return freeze({eligible:true,reason:"approved_native_boundary",geometry:copy(record.geometry),uncertaintyPx:r.uncertainty_px,
      representation:record.representation==='source_area_footprint'?'source_area_footprint':'map_selection_outline'});
  }catch{return fail("malformed_geometry");}
}

function encounter(area,species,index,kind,conditionNotes=[]){return {id:area.id+":"+kind+":"+index,areaId:area.id,species,speciesId:speciesKey(species),encounterClass:kind,form:null,condition:{time:null,weather:null,floor:null,unlock:null,notes:conditionNotes},evidenceStatus:"baseline_preserved",sources:[{href:"alphas.html#zone-"+area.number,claim:"Preserved location fieldbook; encounter conditions still require area review."}],notes:[]};}
function evidenceEncounter(row,area){
  if(!object(row)||!string(row.id,200)||!string(row.species,120)||!speciesKey(row.species)||!ENCOUNTER_CLASSES.includes(row.encounter_class)||!STATUSES.has(row.evidence_status))return null;
  const c=object(row.condition)?row.condition:{};
  const sources=Array.isArray(row.sources)?row.sources.filter(s=>object(s)&&string(s.claim)).map(s=>({href:safeAreaSourceHref(s.url||s.path),claim:s.claim})):[];
  const usable=sources.some(s=>s.href),notes=noteList(row.notes);
  if(!usable)notes.push('This additional claim has no usable source citation and remains a research lead.');
  return {id:row.id,areaId:area.id,species:row.species,speciesId:speciesKey(row.species),encounterClass:row.encounter_class,form:string(row.form,120)?row.form:null,
    condition:{...Object.fromEntries(['time','weather','floor','unlock'].map(k=>[k,string(c[k],500)?c[k]:null])),notes:noteList(c.notes)},evidenceStatus:row.evidence_status,
    sources,notes,...(!usable&&row.evidence_status!=='disputed'?{evidenceStatus:'source_lead'}:{})};
}
export function isRecordedHabitat(row){return WILD.has(row?.encounterClass)&&row.evidenceStatus!=="disputed"&&row.evidenceStatus!=="source_lead";}

/** Build a fresh immutable model. Baseline rosters and source objects are never
 * edited; additional claims retain their class and evidence status. */
export function buildAreaModel({atlas,rosters,evidence}={}){
  try{
    if(!Array.isArray(atlas?.sectors)||atlas.sectors.length!==48||!Array.isArray(atlas.zones)||atlas.zones.length!==20||!Array.isArray(rosters)||rosters.length!==20)throw Error("incomplete_area_catalog");
    const ids=new Set(),issues=[],areas=[];
    const evidenceAvailable=object(evidence)&&evidence.schemaVersion===1;
    const extraAreas=evidenceAvailable&&Array.isArray(evidence.areas)?evidence.areas:[];
    const geometryRows=evidenceAvailable&&Array.isArray(evidence.geometries)?evidence.geometries:[];
    const mapContext=evidence?.map;
    const encounterIds=new Set();
    for(const [kind,rows] of [['sector',atlas.sectors],['zone',atlas.zones]])for(const source of rows){
      if(!areaIdValid(source?.id)||ids.has(source.id)||!string(source.name,120)||!DISTRICTS.has(source.district)||kind==='zone'&&source.id!=="wz-"+String(source.number).padStart(2,"0"))throw Error("invalid_area_identity");
      ids.add(source.id);
      const z=kind==='zone'?rosters.find(r=>r?.number===source.number):null;
      if(kind==='zone'&&(!z||!Array.isArray(z.species)||!Array.isArray(z.fixedAlphas)||!Array.isArray(z.rotatingAlphas)))throw Error("incomplete_roster");
      const area={id:source.id,kind,number:kind==='zone'?source.number:null,name:source.name,district:source.district,xy:kind==='zone'&&point(source.xy)?[...source.xy]:null,precision:source.precision||"orientation_only",link:source.link,
        photos:z?copy(z.photos||[]):source.source_map_reference?[{kind:'orientation',path:source.source_map_reference.image_path,width:source.source_map_reference.width,height:source.source_map_reference.height}]:[],
        encounters:[],geometry:fail("boundary_not_verified"),notes:[],relatedAreas:[],rosterStatus:kind==='zone'?"not_comprehensive":"unresolved"};
      if(z){
        z.species.forEach((name,i)=>{if(!string(name,120))throw Error("invalid_species");area.encounters.push(encounter(area,name,i,z.number===20?'ordinary':'recorded'));});
        z.fixedAlphas.forEach((row,i)=>{if(!string(row?.name,120)||!string(row.condition))throw Error("invalid_fixed_alpha");area.encounters.push(encounter(area,row.name,i,'fixed_alpha',[row.condition]));});
        z.rotatingAlphas.forEach((name,i)=>{if(!string(name,120))throw Error("invalid_rotating_alpha");area.encounters.push(encounter(area,name,i,'rotating_alpha',["Two rotating encounters from the saved 67-species pool; each species is not guaranteed on a visit."]));});
      }
      for(const row of area.encounters)encounterIds.add(row.id);
      const extras=extraAreas.filter(row=>row?.area_id===area.id);
      if(extras.length>1)issues.push("Duplicate encounter evidence for "+area.id);
      if(extras.length===1){
        const extra=extras[0];area.notes=noteList(extra.notes);area.rosterStatus=string(extra.roster_status,120)?extra.roster_status:area.rosterStatus;
        if(Array.isArray(extra.related_areas)){
          const relatedIds=new Set();
          for(const related of extra.related_areas){
            if(!object(related)||!areaIdValid(related.area_id)||related.area_id===area.id||related.relationship!=='overlapping_wild_zone'||!related.area_id.startsWith('wz-')||!string(related.note,1000)||relatedIds.has(related.area_id))continue;
            relatedIds.add(related.area_id);
            area.relatedAreas.push({areaId:related.area_id,relationship:related.relationship,note:related.note.trim()});
          }
        }
        if(Array.isArray(extra.encounters))for(const sourceRow of extra.encounters){
          const row=evidenceEncounter(sourceRow,area);
          if(!row||encounterIds.has(row.id)){issues.push("Rejected duplicate or malformed encounter for "+area.id);continue;}
          encounterIds.add(row.id);area.encounters.push(row);
        }
        const disputes=area.encounters.filter(row=>row.evidenceStatus==='disputed');
        // The legacy union has no encounter class. It cannot independently
        // rescue an ordinary membership claim that the current evidence disputes.
        // Separate fixed/rotating Alpha rows retain their own class evidence.
        for(const row of area.encounters)if(row.evidenceStatus==='baseline_preserved'&&disputes.some(d=>d.speciesId===row.speciesId&&(d.encounterClass===row.encounterClass||d.encounterClass==='unclassified_lead'||row.encounterClass==='recorded'&&d.encounterClass==='ordinary'))){row.originalEvidenceStatus=row.evidenceStatus;row.evidenceStatus='disputed';row.notes.push('A current source claim disputes this preserved fieldbook entry.');}
      }
      const geometries=geometryRows.filter(row=>row?.area_id===area.id);
      area.geometry=geometries.length>1?fail("duplicate_boundary_evidence"):evaluateAreaGeometry(area,geometries[0],mapContext||null);
      areas.push(area);
    }
    const encounters=areas.flatMap(a=>a.encounters),bySpecies=new Map();
    for(const row of encounters){if(!bySpecies.has(row.speciesId))bySpecies.set(row.speciesId,{id:row.speciesId,name:row.species,areaIds:[]});const species=bySpecies.get(row.speciesId);if(isRecordedHabitat(row)&&!species.areaIds.includes(row.areaId))species.areaIds.push(row.areaId);}
    for(const row of extraAreas)if(!ids.has(row?.area_id))issues.push("Unknown encounter area rejected");
    for(const row of geometryRows)if(!ids.has(row?.area_id))issues.push("Unknown boundary area rejected");
    return freeze({areas,encounters,species:[...bySpecies.values()].sort((a,b)=>a.name.localeCompare(b.name)),issues});
  }catch(error){return freeze({areas:[],encounters:[],species:[],issues:[String(error?.message||"Area records unavailable")]});}
}

export function normaliseAreaSelection(input={}){return {areaId:areaIdValid(input.areaId)?input.areaId:null,speciesId:typeof input.speciesId==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.speciesId)?input.speciesId:null,query:typeof input.query==='string'?input.query.slice(0,200):"",district:DISTRICTS.has(input.district)?input.district:"All",encounterClass:ENCOUNTER_CLASSES.includes(input.encounterClass)?input.encounterClass:"all"};}
export function selectAreaResults(model,input={}){
  const s=normaliseAreaSelection(input),q=fold(s.query),zoneMatches=[...q.matchAll(/\bwild zone\s+0*(\d+)\b/g)].map(m=>Number(m[1]));
  const terms=q.replace(/\bwild zone\s+0*\d+\b/g,' ').trim().split(/\s+/).filter(Boolean);
  const habitatOnly=Boolean(s.speciesId)&&(s.encounterClass==='all'||WILD.has(s.encounterClass));
  const rowMatches=e=>(s.encounterClass==='all'||e.encounterClass===s.encounterClass)&&(!s.speciesId||e.speciesId===s.speciesId&&(!habitatOnly||isRecordedHabitat(e)));
  const areas=(model?.areas||[]).filter(area=>{
    if(s.areaId&&area.id!==s.areaId||s.district!=='All'&&area.district!==s.district||zoneMatches.length&&!zoneMatches.every(n=>area.kind==='zone'&&area.number===n))return false;
    const encounters=area.encounters.filter(rowMatches);
    if((s.speciesId||s.encounterClass!=='all')&&!encounters.length)return false;
    const text=fold([area.name,area.district,...area.notes,...encounters.map(e=>e.species)].join(' '));return terms.every(term=>text.includes(term));
  });
  const areaIds=new Set(areas.map(a=>a.id));
  const encounters=(model?.encounters||[]).filter(e=>areaIds.has(e.areaId)&&rowMatches(e));
  const relatedClaims=s.speciesId?(model?.encounters||[]).filter(e=>e.speciesId===s.speciesId&&(!s.areaId||e.areaId===s.areaId)&&!isRecordedHabitat(e)&&(s.encounterClass==='all'||e.encounterClass===s.encounterClass)&&(s.district==='All'||model.areas.find(a=>a.id===e.areaId)?.district===s.district)):[];
  const speciesIds=new Set(encounters.map(e=>e.speciesId));
  const species=(model?.species||[]).filter(p=>(!q||fold(p.name).includes(q))&&speciesIds.has(p.id));
  // Research/mission/boss filters may reveal source records, but they never
  // authorize a species habitat highlight.
  const geometryAreas=s.speciesId&&!habitatOnly?[]:areas;
  return freeze({selection:s,areas,encounters,relatedClaims,species,geometries:geometryAreas.filter(a=>a.geometry.eligible).map(a=>({areaId:a.id,geometry:a.geometry.geometry}))});
}

const urlObject=value=>new URL(value instanceof URL?value.href:String(value),'https://atlas.invalid/');
export function readAreaSelection(value){try{
  const u=urlObject(value);let areaId=u.searchParams.get('area');
  if(!u.searchParams.has('area')&&!u.searchParams.has('species')){
    areaId=[u.searchParams.get('place'),u.searchParams.get('sector')].find(areaIdValid)||null;
    if(!areaId){const zone=/^#(?:wild-zone-|wildzone-)([1-9]|1[0-9]|20)$/.exec(u.hash);const sector=/^#sector-((?:vert|bleu|magenta|rouge|jaune)-sector-\d+)$/.exec(u.hash);areaId=zone?'wz-'+zone[1].padStart(2,'0'):sector?.[1]||null;}
  }
  return normaliseAreaSelection({areaId,speciesId:u.searchParams.get('species'),query:u.searchParams.get('habitat_q'),district:u.searchParams.get('habitat_district'),encounterClass:u.searchParams.get('encounter')});
}catch{return normaliseAreaSelection();}}
export function areaSelectionUrl(value,input={}){
  const u=urlObject(value),s=normaliseAreaSelection(input);
  for(const [key,v] of [['area',s.areaId],['species',s.speciesId],['habitat_q',s.query],['habitat_district',s.district==='All'?null:s.district],['encounter',s.encounterClass==='all'?null:s.encounterClass]]){if(v)u.searchParams.set(key,v);else u.searchParams.delete(key);}
  // Reconcile only old area parameters. A Holovator/route place or collectible
  // parameter remains independent, as do unrelated page anchors and queries.
  for(const key of ['place','sector'])if(areaIdValid(u.searchParams.get(key))){if(s.areaId&&(key==='place'||!s.areaId.startsWith('wz-')))u.searchParams.set(key,s.areaId);else u.searchParams.delete(key);}
  if(/^#wild-zone-(?:[1-9]|1[0-9]|20)$/.test(u.hash))u.hash=s.areaId?.startsWith('wz-')?'wild-zone-'+Number(s.areaId.slice(3)):'';
  else if(/^#(?:wildzone-(?:[1-9]|1[0-9]|20)|sector-(?:vert|bleu|magenta|rouge|jaune)-sector-\d+)$/.test(u.hash))u.hash=s.areaId?(s.areaId.startsWith('wz-')?'wildzone-'+Number(s.areaId.slice(3)):'sector-'+s.areaId):'';
  return u.pathname+u.search+u.hash;
}
export function areaLink(selection,base='atlas-explorer.html'){
  const value={...selection};if(value.speciesId)value.speciesId=speciesKey(value.speciesId);
  const result=areaSelectionUrl(base,value);return /^[a-z][a-z0-9+.-]*:/i.test(base)?new URL(result,base).href:result.replace(/^\//,'');
}
