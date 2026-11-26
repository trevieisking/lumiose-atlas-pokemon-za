/* AT-338: pure, read-only collectible catalog and placement-evidence gate.
 * This module never reads storage, fetches data, creates progress keys or writes
 * the original item ledger. Approved placements belong in the separate register.
 */
export const COLLECTIBLE_MAP = Object.freeze({
  path: "maps/lumiose-game-map.jpg",
  sha256: "4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade",
  width: 1920,
  height: 1920,
  coordinateSpace: "atlas-native-pixels"
});

const EMPTY = Object.freeze([]);
const ITEM_KINDS = new Set(["zone_only", "hidden_outcome", "reward", "sector_area", "landmark"]);
const FIXED_ITEM_KINDS = new Set(["zone_only", "sector_area", "landmark"]);
const SCENES = new Set(["ground", "roof", "indoor", "underground", "scaffold", "bridge"]);
const VERIFICATIONS = ["identity", "position", "scene", "floor", "route", "source"];
const PLACEMENT_FIELDS = ["id", "originalId", "kind", "physicalId", "pickupType", "coordinateSpace", "mapSha256", "xy", "scene", "floor", "directions", "unlock", "sources", "photos", "verification"];
const SOURCE_FIELDS = ["reference", "observedOn", "evidence"];
const UNKNOWN = /\b(?:unknown|unverified|pending|approximate|unsurveyed)\b/i;
const object = value => value !== null && typeof value === "object" && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
const text = (value, max = 2000) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
const prose = (value, max = 2000) => text(value, max) && !/[<>]|\b[a-z][a-z0-9+.-]*:\/\/|\bwww\./i.test(value);
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const point = value => Array.isArray(value) && value.length === 2 && value.every(x => typeof x === "number" && Number.isFinite(x));
const nativePoint = value => point(value) && value[0] >= 0 && value[0] <= COLLECTIBLE_MAP.width && value[1] >= 0 && value[1] <= COLLECTIBLE_MAP.height;
const fail = reason => Object.freeze({ eligible: false, reason });

function exactFields(value, allowed, required = allowed) {
  return object(value) && Reflect.ownKeys(value).every(key => typeof key === "string" && allowed.includes(key)) && required.every(key => own(value, key));
}

function validIdentity(record) {
  if (!object(record) || typeof record.originalId !== "string") return false;
  if (record.kind === "item") return /^(?:[1-9]|1[0-9]|20)-(?:0|[1-9][0-9]*)$/.test(record.originalId) && record.id === "item:" + record.originalId;
  if (record.kind === "screw") return /^(?:[1-9]|[1-9][0-9]|100)$/.test(record.originalId) && record.id === "screw:" + record.originalId;
  return false;
}

function catalogRecord(record) {
  return Object.freeze({
    id: record.id, originalId: record.originalId, kind: record.kind,
    name: record.name, number: record.number, hint: record.hint,
    district: record.district, zone: record.zone, sector: record.sector,
    sourceKind: record.sourceKind, link: record.link
  });
}

/** Return the complete original 264-item/100-Screw catalog, or [] if malformed.
 * Each record is a fresh frozen value; no source pin or inferred geometry enters it.
 */
export function buildCollectibleCatalog(evidence) {
  try {
    if (!object(evidence) || !Array.isArray(evidence.zones) || evidence.zones.length !== 20 ||
        !Array.isArray(evidence.screws) || evidence.screws.length !== 100) return EMPTY;
    const records = [], ids = new Set(), zones = new Set();
    for (const zone of evidence.zones) {
      if (!object(zone) || !Number.isInteger(zone.number) || zone.number < 1 || zone.number > 20 ||
          zones.has(zone.number) || !text(zone.district, 80) || !Array.isArray(zone.items)) return EMPTY;
      zones.add(zone.number);
      for (const item of zone.items) {
        if (!object(item) || !text(item.name, 240) || !text(item.number, 40) || !text(item.hint) ||
            !ITEM_KINDS.has(item.kind) || !(item.sector === null || text(item.sector, 120))) return EMPTY;
        const record = {
          id: "item:" + item.id, originalId: item.id, kind: "item",
          name: item.name, number: item.number, hint: item.hint,
          district: zone.district, zone: zone.number, sector: item.sector,
          sourceKind: item.kind, link: "items.html#item-" + item.id
        };
        if (!validIdentity(record) || Number(item.id.split("-")[0]) !== zone.number || ids.has(record.id)) return EMPTY;
        ids.add(record.id); records.push(catalogRecord(record));
      }
    }
    if (records.length !== 264) return EMPTY;
    for (const screw of evidence.screws) {
      if (!object(screw) || !Number.isInteger(screw.number) || !text(screw.district, 80) || !text(screw.hint) ||
          !(screw.sector === null || text(screw.sector, 120))) return EMPTY;
      const originalId = String(screw.number);
      const record = {
        id: "screw:" + originalId, originalId, kind: "screw", name: "Colorful Screw",
        number: originalId, hint: screw.hint, district: screw.district,
        zone: null, sector: screw.sector, sourceKind: "screw_clue",
        link: "items.html#item-screw-" + originalId
      };
      if (!validIdentity(record) || ids.has(record.id)) return EMPTY;
      ids.add(record.id); records.push(catalogRecord(record));
    }
    return Object.freeze(records);
  } catch (_) { return EMPTY; }
}

function validMap(context) {
  if (object(context) && own(context, "schemaVersion") && context.schemaVersion !== 1) return false;
  if (object(context) && own(context, "placements") && !Array.isArray(context.placements)) return false;
  const map = context === undefined ? COLLECTIBLE_MAP : object(context) && object(context.map) ? context.map : context;
  return exactFields(map, Object.keys(COLLECTIBLE_MAP)) && Object.keys(COLLECTIBLE_MAP).every(key => map[key] === COLLECTIBLE_MAP[key]);
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function sourceReference(value) {
  if (!text(value, 2000)) return false;
  // A pin cites an auditable evidence record, not an arbitrary external page.
  // External research citations belong inside that checked, versioned record.
  const immutable = /^https:\/\/github\.com\/trevieisking\/lumiose-atlas-pokemon-za\/blob\/[a-f0-9]{40}\/(.+)$/.exec(value);
  const path = immutable ? immutable[1] : value;
  return /^(?:docs\/|MAPS_)[A-Za-z0-9_./-]+\.(?:md|json|csv)(?:#[A-Za-z0-9_-]+)?$/.test(path) &&
    !path.split(/[\/\\]/).includes("..");
}

function validSources(sources) {
  return Array.isArray(sources) && sources.length > 0 && sources.length <= 32 && sources.every(source =>
    exactFields(source, SOURCE_FIELDS) && sourceReference(source.reference) && validDate(source.observedOn) &&
    prose(source.evidence) && !UNKNOWN.test(source.evidence));
}

function validPhotos(photos) {
  return photos === undefined || Array.isArray(photos) && photos.length <= 50 && photos.every(path =>
    typeof path === "string" && /^assets\/atlas\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp)$/.test(path) &&
    !path.split("/").includes(".."));
}

/** Validate a placement against its exact original identity and native map.
 * Verification flags and source receipts are the data curator's approval contract;
 * this gate does not turn an asserted flag into independent gameplay observation.
 */
export function evaluateCollectiblePlacement(record, placement, manifestContext) {
  try {
    if (!validIdentity(record)) return fail("invalid_record");
    if (record.sourceKind === "reward") return fail("reward_record");
    if (record.sourceKind === "hidden_outcome") return fail("random_outcome");
    if (["transient", "dynamic", "random"].includes(record.sourceKind)) return fail("transient_record");
    if (!(record.kind === "item" && FIXED_ITEM_KINDS.has(record.sourceKind) ||
          record.kind === "screw" && record.sourceKind === "screw_clue")) return fail("unverified_source_kind");
    if (placement === null || placement === undefined) return fail("no_verified_placement");
    if (!validMap(manifestContext)) return fail("map_evidence_unavailable");
    if (!exactFields(placement, PLACEMENT_FIELDS, PLACEMENT_FIELDS.filter(key => key !== "photos"))) return fail("invalid_placement_schema");
    if (placement.id !== record.id || placement.originalId !== record.originalId ||
        placement.kind !== record.kind) return fail("identity_mismatch");
    if (placement.pickupType !== "fixed") return fail("not_fixed_pickup");
    if (typeof placement.physicalId !== "string" || !/^[A-Za-z0-9][A-Za-z0-9:._-]{0,119}$/.test(placement.physicalId)) return fail("physical_identity_missing");
    if (!exactFields(placement.verification, VERIFICATIONS) || !VERIFICATIONS.every(key => placement.verification[key] === true)) return fail("verification_incomplete");
    if (placement.coordinateSpace !== COLLECTIBLE_MAP.coordinateSpace || placement.mapSha256 !== COLLECTIBLE_MAP.sha256) return fail("coordinate_space_mismatch");
    if (!nativePoint(placement.xy)) return fail("invalid_native_coordinates");
    if (!SCENES.has(placement.scene)) return fail("scene_unverified");
    if (!prose(placement.floor, 180) || UNKNOWN.test(placement.floor) || /^[-+]?\d+(?:\.\d+)?$/.test(placement.floor.trim())) return fail("floor_unverified");
    if (!Array.isArray(placement.directions) || !placement.directions.length || placement.directions.length > 50 ||
        !placement.directions.every(step => prose(step) && !UNKNOWN.test(step))) return fail("written_route_missing");
    if (!prose(placement.unlock, 500) || UNKNOWN.test(placement.unlock)) return fail("unlock_unverified");
    if (!validSources(placement.sources)) return fail("source_provenance_missing");
    if (!validPhotos(placement.photos)) return fail("invalid_photo_reference");
    if (object(manifestContext) && Array.isArray(manifestContext.placements)) {
      if (manifestContext.placements.filter(p => object(p) && p.id === record.id).length > 1) return fail("duplicate_identity");
      if (manifestContext.placements.filter(p => object(p) && p.physicalId === placement.physicalId).length > 1) return fail("duplicate_physical_identity");
    }
    return Object.freeze({
      eligible: true, reason: "verified_fixed_pickup",
      xy: Object.freeze([...placement.xy]), scene: placement.scene, floor: placement.floor,
      directions: Object.freeze([...placement.directions]), unlock: placement.unlock,
      sources: Object.freeze(placement.sources.map(source => Object.freeze({
        reference: source.reference, observedOn: source.observedOn, evidence: source.evidence
      }))),
      photos: Object.freeze([...(placement.photos || [])])
    });
  } catch (_) { return fail("malformed_evidence"); }
}

function indexedRecord(record, result) {
  return Object.freeze({
    ...catalogRecord(record), eligible: false, reason: "no_verified_placement",
    xy: null, scene: null, floor: null, directions: EMPTY, unlock: null,
    sources: EMPTY, photos: EMPTY, ...result
  });
}

/** Keep the original directory available even when placement data is unavailable.
 * Unknown placement IDs never create records. Duplicate IDs/physical proofs fail
 * closed for every affected known record; coincident distinct pickups remain valid.
 */
export function buildCollectibleIndex(catalog, register) {
  if (!Array.isArray(catalog)) return EMPTY;
  try {
    const catalogCounts = new Map(), identities = new Map(), physical = new Map(), placements = new Map();
    for (const record of catalog) if (validIdentity(record)) catalogCounts.set(record.id, (catalogCounts.get(record.id) || 0) + 1);
    const available = object(register) && register.schemaVersion === 1 && validMap(register) && Array.isArray(register.placements);
    if (available) for (const placement of register.placements) {
      if (!object(placement)) continue;
      if (typeof placement.id === "string") {
        identities.set(placement.id, (identities.get(placement.id) || 0) + 1);
        placements.set(placement.id, placement);
      }
      if (typeof placement.physicalId === "string") physical.set(placement.physicalId, (physical.get(placement.physicalId) || 0) + 1);
    }
    const emitted = new Set(), result = [];
    for (const record of catalog) {
      if (!validIdentity(record) || emitted.has(record.id)) continue;
      emitted.add(record.id);
      let evaluation;
      const placement = placements.get(record.id);
      if (!available) evaluation = fail("map_evidence_unavailable");
      else if (catalogCounts.get(record.id) > 1 || identities.get(record.id) > 1) evaluation = fail("duplicate_identity");
      else if (placement && physical.get(placement.physicalId) > 1) evaluation = fail("duplicate_physical_identity");
      else evaluation = evaluateCollectiblePlacement(record, placement, { map: register.map });
      result.push(indexedRecord(record, evaluation));
    }
    return Object.freeze(result);
  } catch (_) {
    // JSON-shaped input is expected. Even an unexpected getter/proxy cannot
    // propagate a failure into the already-running main map.
    try { return Object.freeze(catalog.filter(validIdentity).map(record => indexedRecord(record, fail("map_evidence_unavailable")))); }
    catch (_) { return EMPTY; }
  }
}

function screenPoint(value) {
  if (point(value)) return value;
  if (object(value) && Number.isFinite(value.x) && Number.isFinite(value.y)) return [value.x, value.y];
  return null;
}

/** Find nearby eligible points in screen space without moving their native XY. */
export function overlappingPoints(records, projectedOrigin, projectFn, radius = 24) {
  try {
    const origin = screenPoint(projectedOrigin);
    if (!Array.isArray(records) || !origin || typeof projectFn !== "function" || !Number.isFinite(radius) || radius < 0) return EMPTY;
    const matches = [], seen = new Set();
    records.forEach((record, order) => {
      try {
        if (!validIdentity(record) || record.eligible !== true || !nativePoint(record.xy) || seen.has(record.id)) return;
        seen.add(record.id);
        const native = [...record.xy];
        const projected = screenPoint(projectFn(native, Object.freeze({ ...record, xy: Object.freeze([...record.xy]) })));
        if (!projected) return;
        const distance = (projected[0] - origin[0]) ** 2 + (projected[1] - origin[1]) ** 2;
        if (distance <= radius ** 2) matches.push({ record, distance, order });
      } catch (_) { /* A bad projection excludes this point, not the main map. */ }
    });
    matches.sort((a, b) => a.distance - b.distance || a.order - b.order);
    return Object.freeze(matches.map(match => match.record));
  } catch (_) { return EMPTY; }
}

function ownData(value, key) {
  if (!own(value, key)) return { present: false };
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  return descriptor && own(descriptor, "value") ? { present: true, value: descriptor.value } : { malformed: true };
}

/** Read only the caller-supplied original progress snapshot.
 * false: a valid snapshot has no completed flag; null: unavailable/corrupt.
 */
export function readCollected(record, savedProgress) {
  try {
    if (!validIdentity(record) || !object(savedProgress)) return null;
    for (const key of ["pickup", "screw"]) {
      const bucket = ownData(savedProgress, key);
      if (bucket.malformed || bucket.present && bucket.value !== undefined && !object(bucket.value)) return null;
    }
    const bucket = ownData(savedProgress, record.kind === "item" ? "pickup" : "screw");
    if (!bucket.present || bucket.value === undefined) return false;
    const value = ownData(bucket.value, record.originalId);
    if (value.malformed) return null;
    if (!value.present) return false;
    return typeof value.value === "boolean" ? value.value : null;
  } catch (_) { return null; }
}
