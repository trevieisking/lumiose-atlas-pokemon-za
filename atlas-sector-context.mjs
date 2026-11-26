/* AT-345 contextual views. Distinct preserved Git blobs are reused at assets/atlas/sector-context.
 * x/y here are fractions of the ORIGINAL PHOTOGRAPH FRAME, not Atlas game-map coordinates.
 * This module does not add pins, boundaries, progress, navigation or network services. */
export const SOURCE_IMAGES = Object.freeze({
  "20261126_141528.jpg": {
    "path": "assets/atlas/sector-context/20261126_141528.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_141528.jpg",
    "sha256": "58c8dacaa2b5915908fb1852ce995836a2ba5df9bb5fff70303d27b585f367e0",
    "width": 4000,
    "height": 2148,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_141757.jpg": {
    "path": "assets/atlas/sector-context/20261126_141757.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_141757.jpg",
    "sha256": "ecf1963705c8efbb90e24a683eb0c686bd2390155a3a56e6a22ba6ba29171c42",
    "width": 4000,
    "height": 2218,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_160550.jpg": {
    "path": "assets/atlas/sector-context/20261126_160550.jpg",
    "original_path": "docs/qa/at344-sector-source-survey/sources/20261126_160550.jpg",
    "sha256": "763d98f78662c42882d0dcddf529d990e845912d41e6d23569e461f23efa8a04",
    "width": 4000,
    "height": 2252,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_160741.jpg": {
    "path": "assets/atlas/sector-context/20261126_160741.jpg",
    "original_path": "docs/qa/at344-sector-source-survey/sources/20261126_160741.jpg",
    "sha256": "ebc757ea71d423d2ac87e4d894dd33b06130b3f05f3a000acd547ab6e4644aba",
    "width": 3500,
    "height": 2252,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_151459.jpg": {
    "path": "assets/atlas/sector-context/20261126_151459.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_151459.jpg",
    "sha256": "7b26a71b87c54585d02d012b79fa284a006d4a1118e06546fa5aa750c47fce21",
    "width": 4000,
    "height": 2252,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_151150.jpg": {
    "path": "assets/atlas/sector-context/20261126_151150.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_151150.jpg",
    "sha256": "ce7498bd27e67321c5871399fa9edc3e9deb95f52d44f1afe4af4daa48d82bbb",
    "width": 2966,
    "height": 2252,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_143129.jpg": {
    "path": "assets/atlas/sector-context/20261126_143129.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_143129.jpg",
    "sha256": "34e51b4271ef0199ceca0d58bca193502cfb39004d8c4ca1fa65cf99b9ea91b8",
    "width": 4000,
    "height": 2252,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_142840.jpg": {
    "path": "assets/atlas/sector-context/20261126_142840.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_142840.jpg",
    "sha256": "76a9f382d2914b51dc261546fb1d24c93c7aa9e245916bf73ad61560afd3e25d",
    "width": 3642,
    "height": 1988,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_144931.jpg": {
    "path": "assets/atlas/sector-context/20261126_144931.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_144931.jpg",
    "sha256": "2300a8085329e70d2bb570f41fce39d8bba5814f11566c132726fba7cfd1addc",
    "width": 3494,
    "height": 2192,
    "source_precision": "source_image_orientation_only"
  },
  "20261126_145412.jpg": {
    "path": "assets/atlas/sector-context/20261126_145412.jpg",
    "original_path": "docs/qa/at343-owner-item-crosses/sources/20261126_145412.jpg",
    "sha256": "94ffa02175f1973da4f9f239b5d6369dc4367d7ca181ec8696bcb75efdbb56ed",
    "width": 3346,
    "height": 2252,
    "source_precision": "source_image_orientation_only"
  }
});
export const SECTOR_CONTEXT_VIEWS = Object.freeze({
  "vert-sector-1": {
    "file": "20261126_141528.jpg",
    "x": 0.28,
    "y": 0.12,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-1-saison-canal.png"
  },
  "vert-sector-2": {
    "file": "20261126_141528.jpg",
    "x": 0.17,
    "y": 0.35,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-2-vernal-avenue.png"
  },
  "vert-sector-3": {
    "file": "20261126_141528.jpg",
    "x": 0.57,
    "y": 0.32,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-sector-3.png"
  },
  "vert-sector-4": {
    "file": "20261126_141757.jpg",
    "x": 0.13,
    "y": 0.1,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-4-5.png"
  },
  "vert-sector-5": {
    "file": "20261126_141757.jpg",
    "x": 0.3,
    "y": 0.17,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-4-5.png"
  },
  "vert-sector-6": {
    "file": "20261126_141528.jpg",
    "x": 0.75,
    "y": 0.53,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-sector-6.png"
  },
  "vert-sector-7": {
    "file": "20261126_141757.jpg",
    "x": 0.66,
    "y": 0.39,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-sector-7.png"
  },
  "vert-sector-8": {
    "file": "20261126_141757.jpg",
    "x": 0.38,
    "y": 0.63,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-sector-8.png"
  },
  "vert-sector-9": {
    "file": "20261126_141757.jpg",
    "x": 0.13,
    "y": 0.51,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/vert/vert-sector-9.png"
  },
  "bleu-sector-1": {
    "file": "20261126_160550.jpg",
    "x": 0.81,
    "y": 0.43,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-1-vernal-avenue.png"
  },
  "bleu-sector-2": {
    "file": "20261126_160550.jpg",
    "x": 0.69,
    "y": 0.17,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-2-estival.png"
  },
  "bleu-sector-3": {
    "file": "20261126_160741.jpg",
    "x": 0.84,
    "y": 0.21,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-3.png"
  },
  "bleu-sector-4": {
    "file": "20261126_160550.jpg",
    "x": 0.47,
    "y": 0.3,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-4-estival.png"
  },
  "bleu-sector-5": {
    "file": "20261126_160741.jpg",
    "x": 0.56,
    "y": 0.53,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-5-7-aymlis-park.png"
  },
  "bleu-sector-6": {
    "file": "20261126_160550.jpg",
    "x": 0.39,
    "y": 0.57,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-6-bleu-plaza.png"
  },
  "bleu-sector-7": {
    "file": "20261126_160741.jpg",
    "x": 0.67,
    "y": 0.83,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-5-7-aymlis-park.png"
  },
  "bleu-sector-8": {
    "file": "20261126_160741.jpg",
    "x": 0.32,
    "y": 0.45,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-8.png"
  },
  "bleu-sector-9": {
    "file": "20261126_160550.jpg",
    "x": 0.21,
    "y": 0.71,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-9.png"
  },
  "bleu-sector-10": {
    "file": "20261126_160550.jpg",
    "x": 0.19,
    "y": 0.41,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/bleu/bleu-sector-10.png"
  },
  "magenta-sector-1": {
    "file": "20261126_151459.jpg",
    "x": 0.75,
    "y": 0.54,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-1-3-estival.png"
  },
  "magenta-sector-2": {
    "file": "20261126_151459.jpg",
    "x": 0.84,
    "y": 0.22,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-2.png"
  },
  "magenta-sector-3": {
    "file": "20261126_151459.jpg",
    "x": 0.57,
    "y": 0.59,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-1-3-estival.png"
  },
  "magenta-sector-4": {
    "file": "20261126_151150.jpg",
    "x": 0.71,
    "y": 0.77,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-4.png"
  },
  "magenta-sector-5": {
    "file": "20261126_151459.jpg",
    "x": 0.22,
    "y": 0.85,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-5.png"
  },
  "magenta-sector-6": {
    "file": "20261126_151459.jpg",
    "x": 0.32,
    "y": 0.48,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-6-south-boulevard.png"
  },
  "magenta-sector-7": {
    "file": "20261126_151150.jpg",
    "x": 0.43,
    "y": 0.7,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-7.png"
  },
  "magenta-sector-8": {
    "file": "20261126_151150.jpg",
    "x": 0.3,
    "y": 0.61,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-8.png"
  },
  "magenta-sector-9": {
    "file": "20261126_151150.jpg",
    "x": 0.45,
    "y": 0.28,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/magenta/magenta-sector-9.png"
  },
  "rouge-sector-1": {
    "file": "20261126_143129.jpg",
    "x": 0.26,
    "y": 0.54,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-1.png"
  },
  "rouge-sector-2": {
    "file": "20261126_143129.jpg",
    "x": 0.52,
    "y": 0.49,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-2.png"
  },
  "rouge-sector-3": {
    "file": "20261126_142840.jpg",
    "x": 0.13,
    "y": 0.57,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-3.png"
  },
  "rouge-sector-4": {
    "file": "20261126_142840.jpg",
    "x": 0.24,
    "y": 0.5,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-4.png"
  },
  "rouge-sector-5": {
    "file": "20261126_142840.jpg",
    "x": 0.4,
    "y": 0.58,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-5.png"
  },
  "rouge-sector-6": {
    "file": "20261126_142840.jpg",
    "x": 0.61,
    "y": 0.68,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-6.png"
  },
  "rouge-sector-7": {
    "file": "20261126_142840.jpg",
    "x": 0.32,
    "y": 0.34,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-7-north-boulevard.png"
  },
  "rouge-sector-8": {
    "file": "20261126_142840.jpg",
    "x": 0.82,
    "y": 0.46,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/rouge/rouge-sector-8-hibernal.png"
  },
  "jaune-sector-1": {
    "file": "20261126_144931.jpg",
    "x": 0.12,
    "y": 0.3,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-1-jaune-street.png"
  },
  "jaune-sector-2": {
    "file": "20261126_144931.jpg",
    "x": 0.21,
    "y": 0.5,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-2.png"
  },
  "jaune-sector-3": {
    "file": "20261126_144931.jpg",
    "x": 0.19,
    "y": 0.13,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-3-plaza.png"
  },
  "jaune-sector-4": {
    "file": "20261126_145412.jpg",
    "x": 0.2,
    "y": 0.64,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-4.png"
  },
  "jaune-sector-5": {
    "file": "20261126_145412.jpg",
    "x": 0.36,
    "y": 0.72,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-5.png"
  },
  "jaune-sector-6": {
    "file": "20261126_144931.jpg",
    "x": 0.44,
    "y": 0.5,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-6.png"
  },
  "jaune-sector-7": {
    "file": "20261126_145412.jpg",
    "x": 0.4,
    "y": 0.3,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-7-hibernal.png"
  },
  "jaune-sector-8": {
    "file": "20261126_145412.jpg",
    "x": 0.53,
    "y": 0.51,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-sector-8.png"
  },
  "jaune-sector-9": {
    "file": "20261126_144931.jpg",
    "x": 0.59,
    "y": 0.42,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png"
  },
  "jaune-sector-10": {
    "file": "20261126_144931.jpg",
    "x": 0.62,
    "y": 0.83,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png"
  },
  "jaune-sector-11": {
    "file": "20261126_144931.jpg",
    "x": 0.8,
    "y": 0.25,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png"
  },
  "jaune-sector-12": {
    "file": "20261126_144931.jpg",
    "x": 0.76,
    "y": 0.79,
    "zoom": 2.15,
    "fallback": "assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png"
  }
});
export function sectorContextFor(id){
  const entry=SECTOR_CONTEXT_VIEWS[id];
  if(!entry)return null;
  const image=SOURCE_IMAGES[entry.file];
  if(!image)return null;
  return {...entry,...image,sectorId:id};
}
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(v,hi));
export function sectorContextImageStyle(entry,frameAspectRatio=16/9){
  if(!entry||![entry.x,entry.y,entry.zoom,entry.width,entry.height,frameAspectRatio].every(n=>Number.isFinite(n)&&n>0))return '';
  if(entry.x>1||entry.y>1||entry.zoom<1||entry.zoom>4)return '';
  const scaledHeight=entry.zoom*(entry.height/entry.width)*frameAspectRatio;
  const left=clamp(50-100*entry.zoom*entry.x,100-100*entry.zoom,0);
  const top=clamp(50-100*scaledHeight*entry.y,100-100*scaledHeight,0);
  return 'width:'+Number(100*entry.zoom).toFixed(2)+'%;left:'+left.toFixed(2)+'%;top:'+top.toFixed(2)+'%';
}
