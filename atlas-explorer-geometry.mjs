/* Pure, deterministic geometry for the native 1920px Lumiose map.
   No DOM, network, cookies, progress keys or external location service. */
export const MAP_SIZE = 1920;
export const MIN_ZOOM = 0.75;
export const MAX_ZOOM = 6;
export const RADIANS = Math.PI / 180;
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const wrapRotation = angle => ((angle % 360) + 360) % 360;
export const stageBase = viewport => Math.min(viewport.width, viewport.height) * 0.94;
export const startView = () => ({ zoom: 1, rotation: 0, panX: 0, panY: 0 });
/* Scaffolding is extensible, but never draw an unverified permanent scaffold pin.
   Existing Wild Zone centres, ladders and Holovator approach leads stay as recorded. */
export function eligibleMapPin(item) {
  const xy = item?.xy;
  if (item?.kind === "sector" || !Array.isArray(xy) || xy.length !== 2 ||
      !xy.every(value => Number.isFinite(value) && value >= 0 && value <= MAP_SIZE)) return false;
  if (item.kind !== "scaffold") return true;
  return item.pin_verified === true &&
    typeof item.source_record === "string" && /^MAPS_[A-Z0-9_-]+\.json$/.test(item.source_record);
}
export function project([x, y], view, viewport) {
  const scale = stageBase(viewport) / MAP_SIZE * view.zoom;
  const dx = (x - MAP_SIZE / 2) * scale;
  const dy = (y - MAP_SIZE / 2) * scale;
  const r = view.rotation * RADIANS;
  return {
    x: viewport.width / 2 + view.panX + dx * Math.cos(r) - dy * Math.sin(r),
    y: viewport.height / 2 + view.panY + dx * Math.sin(r) + dy * Math.cos(r)
  };
}
export function unproject({ x, y }, view, viewport) {
  const scale = stageBase(viewport) / MAP_SIZE * view.zoom;
  const dx = (x - viewport.width / 2 - view.panX) / scale;
  const dy = (y - viewport.height / 2 - view.panY) / scale;
  const r = view.rotation * RADIANS;
  return [
    MAP_SIZE / 2 + dx * Math.cos(r) + dy * Math.sin(r),
    MAP_SIZE / 2 - dx * Math.sin(r) + dy * Math.cos(r)
  ];
}
/* Keep a minimum visible fraction on screen when dragging a scaled, rotated map.
   The extent is conservative for the real square map, with no inferred geometry. */
export function constrain(view, viewport) {
  const zoom = clamp(Number(view.zoom), MIN_ZOOM, MAX_ZOOM);
  const rotation = wrapRotation(Number(view.rotation));
  const r = rotation * RADIANS;
  const half = stageBase(viewport) * zoom / 2 * (Math.abs(Math.cos(r)) + Math.abs(Math.sin(r)));
  const maxX = Math.max(0, half - viewport.width / 2 + 130);
  const maxY = Math.max(0, half - viewport.height / 2 + 130);
  return {
    zoom, rotation,
    panX: clamp(Number(view.panX), -maxX, maxX),
    panY: clamp(Number(view.panY), -maxY, maxY)
  };
}
export function panBy(view, dx, dy, viewport) {
  return constrain({ ...view, panX: view.panX + dx, panY: view.panY + dy }, viewport);
}
/* Scale/rotate about the screen cursor or touch midpoint; the world position
   underneath remains stable before viewport clamping. */
export function changeAround(view, anchor, viewport, zoomFactor = 1, turnDegrees = 0) {
  const world = unproject(anchor, view, viewport);
  const next = {
    ...view,
    zoom: clamp(view.zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM),
    rotation: wrapRotation(view.rotation + turnDegrees)
  };
  const projected = project(world, next, viewport);
  next.panX += anchor.x - projected.x;
  next.panY += anchor.y - projected.y;
  return constrain(next, viewport);
}
export function centreOn([x, y], view, viewport) {
  if (![x, y].every(value => Number.isFinite(value) && value >= 0 && value <= MAP_SIZE)) return constrain(view, viewport);
  const where = project([x, y], { ...view, panX: 0, panY: 0 }, viewport);
  return constrain({ ...view, panX: viewport.width / 2 - where.x, panY: viewport.height / 2 - where.y }, viewport);
}
export function normaliseRoute(route, pointIds) {
  if (!route || typeof route.id !== "string" || !pointIds.has(route.point_id) || !Array.isArray(route.steps) || !route.steps.length) return false;
  const allowed = new Set(["street", "plaza", "ground", "wild-zone", "stairs", "terrace", "passage", "courtyard", "ladder", "scaffold", "roof", "interior"]);
  const statuses = new Set(["owner_survey", "owner_photographed", "owner_reported", "guide_crosscheck", "unverified"]);
  return route.steps.every(step => allowed.has(step.space) && statuses.has(step.evidence) &&
    typeof step.title === "string" && step.title.length > 0 &&
    typeof step.instruction === "string" && step.instruction.length > 0);
}
