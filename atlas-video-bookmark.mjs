/* AT-295 smart video return: one private navigation bookmark, never game progress.
   Storage failures are nonfatal; no analytics, network access or playback tracking. */
export const VIDEO_BOOKMARK_KEY = "lumiose-atlas:video-return:v1";
const STATE_KEY = "atlasVideoReturnV1";
const boundedText = (value,max) => typeof value === "string" && value.length <= max;
const number = (value,min,max) => typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
export function validVideoBookmark(value) {
  return !!value && value.version === 1 &&
    boundedText(value.routeId,100) && value.routeId.length > 0 &&
    Number.isInteger(value.stepIndex) && number(value.stepIndex,0,1000) &&
    typeof value.videoId === "string" && /^[A-Za-z0-9_-]{11}$/.test(value.videoId) &&
    boundedText(value.stepTitle,200) &&
    (value.selectedId === null || boundedText(value.selectedId,100)) &&
    boundedText(value.filter,30) && boundedText(value.search,200) &&
    Array.isArray(value.hiddenLayers) && value.hiddenLayers.length <= 10 && value.hiddenLayers.every(x=>boundedText(x,30)) &&
    boundedText(value.sector,100) && boundedText(value.coverageArea,10) && boundedText(value.coverageText,500) &&
    typeof value.tint === "boolean" &&
    number(value.view?.zoom,.75,6) && number(value.view?.rotation,0,360) &&
    number(value.view?.panX,-100000,100000) && number(value.view?.panY,-100000,100000) &&
    number(value.stageSize,1,100000) && number(value.anchorTop,-10000,10000);
}
function historyState(host) {
  const state=host.history.state;
  return state && typeof state === "object" && !Array.isArray(state) ? {...state} : {};
}
export function saveVideoBookmark(host,bookmark) {
  if(!validVideoBookmark(bookmark))return false;
  let saved=false;
  try{host.history.replaceState({...historyState(host),[STATE_KEY]:bookmark},"");saved=true;}catch(_){}
  try{host.localStorage.setItem(VIDEO_BOOKMARK_KEY,JSON.stringify(bookmark));saved=true;}catch(_){}
  return saved;
}
export function readVideoBookmark(host,allowDeviceBookmark) {
  try{const state=historyState(host)[STATE_KEY];if(validVideoBookmark(state))return state;}catch(_){}
  if(allowDeviceBookmark){
    try{const saved=JSON.parse(host.localStorage.getItem(VIDEO_BOOKMARK_KEY)||"null");if(validVideoBookmark(saved))return saved;}catch(_){}
  }
  return null;
}
export function forgetVideoBookmark(host) {
  try{const state=historyState(host);delete state[STATE_KEY];host.history.replaceState(state,"");}catch(_){}
  try{host.localStorage.removeItem(VIDEO_BOOKMARK_KEY);}catch(_){}
}
