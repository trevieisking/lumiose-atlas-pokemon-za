# Lumiose Atlas — Sector & Wild Zone Mapping Upgrade Master Plan

**Plan ID:** `ATLAS-MAPS-2026-11-21-V1`  
**Status:** Accepted by owner; **planning/documentation only in this PR**. Subsequent map code and asset changes require bounded, separately tested PRs.  
**Repository:** `trevieisking/lumiose-atlas-pokemon-za` (Edition B, independent reconstruction)  
**Primary tracker:** [GitHub issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28)  
**Structured manifest:** [`MAPS_UPGRADE_MANIFEST.json`](MAPS_UPGRADE_MANIFEST.json)  
**Cross-site ledger:** [`ATLAS_DUAL_SITE_FIX_LEDGER.md`](ATLAS_DUAL_SITE_FIX_LEDGER.md) (AT-238)

## What the owner has asked for

Upgrade the **existing** Maps / Sector & Wild Zone guide, not a wholesale redesign or an invented page recovery. Use the **ten owner-supplied 21 November 2026 photographs of the in-game Lumiose map** and the existing game-map asset to map **every named city sector**, not just the numbered Wild Zones. Players must be able to zoom in/out and inspect visible building footprints, alleys/gaps, streets and landmarks. Then use that geography as bearings: **Holovators first, scaffolds/ladders/rooftop approaches second, numbered item and Colorful Screw positions last**. Supply concise walking/rooftop directions and source/verification status for each point. Keep city-sector and Wild Zone mapping as separate selectable views on one consistent Lumiose base geography.

The photographs are **ten overlapping views of ONE in-game city map**, not ten different city maps and not automatically one image per sector. A **sector-specific, readable zoom/crop of the aligned city source** can fulfil the navigation requirement; do **not** fabricate “48 original screenshots” or require 48 distinct file assets where the geography can be represented faithfully using the same city image. The original screenshots remain **conversation attachments**; they are documented evidence, **not committed image assets** in this repository. Any future image import must have provenance and an approved, tested asset path.

## Verified repository baseline — do not overwrite or double-count

| Existing data / feature | 21 Nov 2026 baseline | Important qualification |
| --- | --- | --- |
| Independent guide routes | 19/19 functional | 14 owner-PDF-backed routes and five source-derived functional replacements; **not** 19 recovered original source pages |
| Named city sectors | **48**: Vert 1–9, Bleu 1–10, Magenta 1–9, Rouge 1–8, Jaune 1–12 | Validated names; **not** 48 individually verified sector boundary polygons |
| Wild Zones | **20** | Existing city overview already displays 20 numbered Wild Zone positions and zone previews |
| Archived item records | **264** | Includes generic, random/conditional and reward records; these are **not 264 fixed pickups** |
| Colorful Screw clues | **100** | 51 name a sector; others lack a numbered-sector assignment, and none become exact dots merely from text |
| Approximate map leads | **146** | Original approximate A-number markers preserved in a separate namespace from 264 item IDs |
| Photo-derived orientation panel | **30 approximate landmark links** across five district cards | Released in PR #54; names/neighbourhood clues, **not** exact access pins |
| Confirmed exact item XY/floor pins | **0** within the current evidence ledger | Never present a guess as verified |
| Original enlarged Hyperspace layout images | **0 of 9** | Tracked separately; the source guide's nine-layout claim is not an independently proven geometry count |

**Authoritative existing assets/pages:** `maps/lumiose-game-map.jpg`; `src/sections/maps.html`; `maps.html` + `maps.js` + `maps.css`; `sector-maps.html` + `sector-maps.js` + `sector-maps.css`; `src/sections/items.html`; `items.html`; `items-data.js`; `src/sections/dimension.html`; and existing map, item and progress regression tests. `source-assets-manifest.json` is the **immutable provenance/checksum inventory of the original saved assets**, not the change-tracking manifest for this project. Do not silently edit its original checksums.

**Screenshot coverage:** Five district families are visible (Jaune, Vert, Bleu, Magenta, Rouge). Photos show source map labels and landmarks including Prism Tower, Hotel Z, Rust Syndicate Office, Académie Étoile, Justice Dojo, Aymis Park, Lumiose Sewers, Jaune/Rouge/Vert/Magenta plazas, canals, cafés, Pokémon Centers and railway/road connections. The TV photos have screen perspective, crops, overlays and UI icons. They help with topology/relative location; **they do not yet prove that any individual yellow icon is a Holovator or that any hidden ladder, scaffold or collectible has a certain map coordinate**.

## Mandatory implementation order and acceptance tests

### SM-01 — Evidence register, city geography and complete sector inventory
- [ ] Index all ten screenshot views by district, visible sector labels, adjacent streets, shared landmarks and crop/occlusion notes; keep the originals unchanged.
- [ ] Reconcile the 48 confirmed sector names and all 20 Wild Zones against the preserved city source and screenshot overlap. Keep **sector IDs** (`Vert-01`, etc.) distinct from **Wild Zone IDs** (`WZ-01` etc.).
- [ ] Capture a structured, evidence-attributed sector record for every sector: name, district, known neighbouring label/road, at least one identifiable landmark where present, and boundary confidence (confirmed, approximate, unknown).
- [ ] Mark photo-only relative placement as **approximate**; where a sector is not visible well enough to outline, leave the boundary unknown and request a better game-map capture rather than drawing one.
- [ ] Preserve the existing 30 screenshot-derived landmark links and do not claim all 48 boundaries are already verified.

**Exit:** 48/48 named sector records linked from five districts, 20 Wild Zones intact, screenshot evidence status per record, no fabricated geometry.

### SM-02 — Accurate, usable sector map zoom and navigation
- [ ] Upgrade the **existing** sector directory/map interface to show each sector on a zoomable/pannable version of the shared city image; the map should reveal building blocks, roads and gaps at useful magnification.
- [ ] Provide desktop zoom +/- and reset; phone pinch/pan or accessible equivalent; keyboard controls, visible map legend, return to city overview, Back to Walkthrough and the existing **25-link navigation menu**.
- [ ] Where photographs can be aligned, register reference landmarks against the original map. Account for TV-screen perspective before deriving coordinates: never copy photographed screen pixels directly as exact in-game XY.
- [ ] Keep Wild Zone selection and its own zoom/details independent but connected through district/nearby links. Avoid external tile dependencies if the existing assets suffice.

**Exit:** 48/48 sector selectors open meaningful aligned city-map views; text stays legible on Android/desktop; existing 20 Wild Zone interactions and local progress still work.

### SM-03 — Building footprints, alleys/gaps, streets and bearing landmarks
- [ ] Overlay clearly visible building footprints, usable lanes/gaps, plazas, canals and roads as **reference geometry** only where supported by the base map or captures.
- [ ] Attach named landmarks and nearby access information to the correct sector without asserting unverified entrances/rooftops.
- [ ] Distinguish visible **map geometry** from an actually **traversable** path: a visible gap or roof edge does not prove walking access.
- [ ] Use district filters / layer switches so maps remain readable; include short user-facing directions from recognisable landmarks.

**Exit:** Players can orient by sector and visible architecture without invented shortcuts or falsely confirmed paths.

### SM-04 — Confirm individual Holovators first
- [ ] Identify each candidate Holovator from direct in-game observation, a clear owner capture or independently checked original evidence. A yellow aerial travel icon alone does **not** establish its type.
- [ ] For confirmed Holovators: record sector, nearest landmark/street, entry position, which level/roof it connects, instructions and evidence date; use a clear numbered symbol and dedicated toggle.
- [ ] Keep unverified access leads in a separate **candidate / approximate** layer, never mixed with confirmed pins.

**Exit:** Every displayed **confirmed** Holovator has auditable access evidence; no assertion that the citywide Holovator inventory is complete without a full sweep.

### SM-05 — Scaffolds, ladders, glide returns and rooftop connectivity
- [ ] Survey confirmed scaffold and ladder start/end points and height transitions **after** the map landmarks/Holovators are anchored.
- [ ] Record which building face and level each route accesses, including mission or time restrictions where supported; link the written step-by-step approach from a stable landmark.
- [ ] Mark uncertain climb/glide routes as unverified. Preserve original S/L/H/G/R map-key semantics where they were approximate leads.

**Exit:** Each verified ascent/return route has a building/sector association, source observation and walkable written directions.

### SM-06 — Numbered item, Screw and pickup layers **last**
- [ ] Join the original 264 item **records**, 100 Screw **clues** and 146 approximate map **leads** without collapsing them into the same identity or assuming each is a fixed pickup.
- [ ] Place **exact item pins only** when identity, sector, XY on aligned map, elevation/floor, pickup type and access route are supported by an owner screenshot or independently checked evidence.
- [ ] Assign stable **guide-facing per-sector numbers** (e.g. `V05-I01`, `V05-S01`) and link to the original source record / Screw ID / A-lead as appropriate; never overwrite existing checklist keys or duplicate progress.
- [ ] Categorise conditional loot, NPC rewards, Zone 20 random outcomes and mission rewards separately; no stationary map dot for a nonfixed reward.
- [ ] Show **Confirmed / Approximate lead / Needs verification** in layer legend and each written record; never claim GPS coordinates, exact floor or 100% completion without evidence.

**Exit:** Map dot count equals **verified fixed pickups only**, with a matching source-backed direction and stable original ID link. Unverified records remain searchable text, not false precise pins.

### SM-07 — Per-sector coverage, testing, review and safe promotion
- [ ] Record coverage per sector (name, image alignment, landmarks, Holovators, scaffolds, items, evidence levels), including honest open gaps; also retain 20/20 Wild Zone and nine-layout DLC evidence status separately.
- [ ] Automated checks: 48/48 selectors, district grouping, unique map pin IDs, valid image references, no false confirmed pins, photo provenance, zoom controls, mobile responsiveness, preserved 264/100/146 source counts, main-app and feedback regressions.
- [ ] Manually validate representative sector views/zoom on Android and desktop; check that photo overlays do not falsely imply guaranteed rooftop access. No source code changes before the specific subproblem and evidence are clear.
- [ ] Use small, bounded GitHub branch/PRs with exact reviewed SHA, passing CI, approved merge and Pages deployment; log each factual/visual change in the cross-site ledger. Never touch Repo Desk, CG Repair Lab, Code God or protected Writer for this task.

**Completion gate:** All **48 sector-specific usable views** and **20 Wild Zones** navigate correctly; each confirmed Holovator/scaffold/pickup is backed by coordinate, floor/route and source evidence; outstanding unknowns remain visibly labelled. Do not close [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) until its stricter item and Screw completeness acceptance conditions are actually demonstrated.

## Per-sector record contract (planned schema, not implemented runtime data)

```json
{
  "sector_id": "Vert-05",
  "district": "Vert",
  "sector_number": 5,
  "source_map": "maps/lumiose-game-map.jpg",
  "boundary": {"status": "unknown", "polygon": null},
  "landmarks": [],
  "neighbor_sector_ids": [],
  "access_points": [],
  "item_pins": [],
  "screw_pins": [],
  "unverified_leads": [],
  "owner_capture_refs": [],
  "reviewed_gameplay_evidence": [],
  "verification_status": "needs_verification"
}
```

The example is a schema illustration, **not actual verified Vert Sector 5 geometry**. Every future coordinate must carry its provenance and the coordinate space/transform used. All overlay/source additions must preserve existing IDs and navigation.

## Release boundaries and where to resume

- **Edition A:** Original ChatGPT Workspace Site `lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site` remains unchanged. No original source export, redeploy, DNS change, Supabase change, ratings/feedback/report deletion or player progress reset.
- **Edition B:** Improve the independent GitHub Pages edition, preserving current routes and progress. Existing feedback relay must remain untouched.
- **Source distinction:** Owner photos and user-supplied PDFs are evidence, **not automatically verified complete map data**. Do not modify archived PDFs or the immutable original source-asset hash manifest to disguise missing map resources.
- **Next code work after this docs-only plan:** Begin at **SM-01** by auditing all ten photo views against `maps/lumiose-game-map.jpg` and capturing the first bounded, correctly evidenced sector overlay. Then SM-02 zoom controls; only then the structural layers and access positions. Record results as a new ledger entry and update `MAPS_UPGRADE_MANIFEST.json` phase/sector statuses.
