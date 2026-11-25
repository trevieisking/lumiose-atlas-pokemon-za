# Atlas source sector & street photographs

**Canonical register:** [MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json](../../../MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json) · Plan: `ATLAS-MAPS-2026-11-21-V1` · Batches: `AT-304` and `AT-310`.

This folder contains **42 authentic, original-game, native-pixel PNG screenshot crops** grouped by district: `vert/`, `bleu/`, `magenta/`, `rouge/`, `jaune/`. Exactly **48/48** named sector records can be linked to these photographic references in the AT-310 draft; the previous verified public baseline was 29/48. One image may legitimately show several neighbouring sectors. Every PNG is preserved byte-for-byte from the prepared crop, with SHA-256, dimensions, original screenshot filename and SHA-256, crop rectangle, and Git blob SHA in the register.

## Image confidence

- All images are **source screenshot excerpts for orientation**. A label visibly printed on a photograph is **not** a verified native coordinate in `maps/lumiose-game-map.jpg`.
- Do **not** use a screenshot crop rectangle as a map-to-map coordinate transform. Native sector label `xy`, sector polygons, Holovator doors, roof exits and collectible pins remain unverified unless independently measured and documented.
- Preserve the unchanged 1920×1920 city basemap, all 48 sector and 20 Wild Zone records, 25 selectable browsing cells, 21 owner-surveyed Holovators, 111 existing Holovator JPEGs, 15 existing routes, progress and data.
- Do not permanently plot moving DLC Hyperspace distortions. Do not remove temporary icons by inventing scenery or use AI upscaling/redrawing as geographical evidence.
- A missing sector source gets an explicit **needs_original_screenshot** status and **no** fake photo reference.

## Repeatable ingestion procedure for each new named sector or street

1. Obtain an original owner-approved in-game screenshot showing the exact name and stable physical landmarks. Keep the full raw screenshot private/unmodified and record its original filename and SHA-256.
2. Crop only actual map pixels at their **native resolution**, no borders, TV/device UI or temporary Hyperspace symbols. Reject unsuitable or obstructed examples instead of synthesizing what's hidden.
3. Record the original dimensions, pixel crop `[left,top,right,bottom]`, source SHA-256, displayed sector/street names, crop dimensions, crop SHA-256 and Git blob SHA. Confirm the crop can be reproduced bit-for-bit.
4. Add the PNG to the corresponding district subfolder. Map it to an **existing** stable `sector_id`; do not mint duplicate sector or item IDs. Update the canonical register and the same sector's guide/Explorer photo reference; keep any source street-name text faithful.
5. Until map registration passes **at least three common landmarks and an independent held-out residual check**, set `registration:not_georeferenced`, `precision:source_image_orientation_only` and `native_label_xy:null`.
6. Test the SHA-256/Git blob hash of every PNG, path existence, all 48 sector card statuses, all 20 Wild Zones, 21 owner-surveyed Holovators, 111 original galleries, saved-progress compatibility, image decoding and phone/desktop layout.
7. Deliver only in a separate bounded PR with exact-head green CI, reviewed phone/desktop screenshots, safe expected-SHA merge and confirmed independent GitHub Pages deployment. Original ChatGPT Workspace Site and Supabase remain separate under AT-297.

## Source gaps

No sector is missing an orientation image in the AT-310 draft. Exact geographic registration remains separate.

Observed named road labels are **not** an exhaustive street inventory: `Bleu Street`, `Estival Avenue`, `Hibernal Avenue`, `Jaune Street`, `North Boulevard`, `South Boulevard`, `Vernal Avenue`, `Vert Street`. Each source linkage is in the JSON register.
