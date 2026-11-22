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


## Coordinate validation loop — mission-source batch 01 (21 November 2026)

**Evidence file:** [`MAPS_HOLOVATOR_COORDINATE_VALIDATION.json`](MAPS_HOLOVATOR_COORDINATE_VALIDATION.json) with **nine individually checked side-mission map references**. **These are raw Gamer Guides mission-map X/Y values in the site's own coordinate system, *not exact Holovator entrances* or coordinates on `maps/lumiose-game-map.jpg`.** The external labels/mission triggers were cross-referenced with [GameWith's Holovator guide](https://gamewith.jp/pokemon-za/524373), [Serebii mission guide](https://www.serebii.net/legendsz-a/sidemissions.shtml) and specialist mission entries. No coordinate-space transform is established; no new verified Atlas pins have been published.

| Loop | Mission | Area independently established | Source **mission** map X,Y | Sector & next precise gate |
| --- | --- | --- | --- | --- |
| 01 | #4 A Break Time Battle | West of WZ3, Rouge Plaza | **9143, 6904** | **Rouge 1** corroborated; inspect corresponding Holovator glyph/building face |
| 02 | #23 Underneath the Holovator | Vernal Avenue, NW of WZ1 | **10111, 16090** | Vert 9 *reported*, confirm boundary; identify lift entrance |
| 03 | #40 A Holovator Without Power | South Boulevard / NE of Vert Pokémon Center | **14670, 14907** | **Vert Sector 7 (quest location; Bulbapedia)**, exact device position pending |
| 04 | #45 On Maintenance Duty | S Boulevard, south of WZ12 | **7987, 16433** | Bleu 7 *reported*, verify street/sector boundary |
| 05 | #56 We'll Just Muscle Our Way Through! | Jaune Sector 6, south of WZ8 | **13808, 10090** | **Jaune 6** corroborated; distinguish quest approach from device |
| 06 | #61 My Favorite Holovator | Bleu Sector 3 / Bleu Plaza, north of WZ12 | **8603, 13820** | **Bleu 3** corroborated by Serebii; verify map alignment |
| 07 | #71 The Burning Gaze of Watchog | Autumnal Avenue, NE of WZ7 | **8429, 8099** | **Magenta Sector 2 (quest location; Bulbapedia)**, device point pending |
| 08 | #80 A Shocking Territorial Dispute | Hibernal Avenue, west/SW of WZ15 | **13520, 5172** | numbered sector unknown; inspect device category marker |
| 09 | #92 The Beldum Blockade | South Boulevard, SE of WZ10 and Café Soleil | **5123, 14626** | **Bleu 8 reported by GameWith**; verify sector/street boundary before plotting |

**What has been validated:** nine source-published **mission-location coordinates**, nine relevant mission/area descriptions and unlock routes. **What has not:** placement of any of the 23 individual **Holovator-category** marker coordinates on our Atlas image, device-level GPS (the game map has no GPS), any rooftop entry/exit height or a verified entire-city scaffold inventory. The 23 Holovators is the **Gamer Guides category count**, and a nine-mission shortlist cannot be naively deducted from it without verifying one-to-one correspondence.

**The strict one-by-one continuation loop**:

1. Read the next row from `MAPS_HOLOVATOR_COORDINATE_VALIDATION.json`; check the original source URLs, not the report's conclusions alone.
2. Compare the quest marker to the **specific Holovator-category marker**, confirm both refer to the *same physical device*, and record any mission-to-device spatial offset.
3. Register source map XY and scale/origin. Calibrate with at least three correctly identified building/landmark control points against the preserved city image and owner screenshots, quantify registration error. **Mission XY must never be silently treated as the Holovator XY**.
4. Confirm ground entrance / building face and arrival level using an in-game screenshot or independent clear gameplay evidence; cross-reference sector border and at least one other guide.
5. Only after those gates: record exact `atlas_x`, `atlas_y`, coordinate transform, evidence URLs, source date, floors and human-readable directions. If any critical datum is missing, retain **not verified / no confirmed map dot**, log the missing evidence and proceed to the next candidate.
6. Repeat remaining Holovator-category points; **then** apply the same proof standard to scaffold/ladder access networks; **then** fixed items/Screws. Every completed small batch updates this master plan, structured manifest, cross-site ledger and issue #28 with source references and reviewed commit SHA.

**Safest next source check:** DR-H-01's **Holovator-category marker** (not its mission marker) next to the building west of Wild Zone 3. Exact entrance/floor and pixel alignment require independent verification; the original live site and Edition B maps remain unchanged by this documentation batch.

## Coordinate validation loop — mission marker links and quest-ground approach batch 02 (21 November 2026)

**Status:** source-grounded **mission-marker navigation and Holovator unlock-route research only**. This is the next one-by-one loop after the nine mission coordinate checks. All nine mission "View on map" links have been followed to individual Gamer Guides **Side Missions layer 343** marker IDs. **They are not Holovator-category marker IDs.** No source-to-Atlas transform, precise building facade, device marker XY or rooftop height is claimed. Structured results are in [the Holovator coordinate register](MAPS_HOLOVATOR_COORDINATE_VALIDATION.json). The original owner screenshots have not been calibrated against the preserved city image.

| ID | Mission marker link (source layer 343) | Refined quest locality | Ground-level approach / objective, from guides | Still needed for an Atlas **device** dot |
| --- | --- | --- | --- | --- |
| DR-H-01 | [234541](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=234541) | Rouge Sector 1, by Rouge Plaza, west of WZ3 | Find **Sommi** at the broken Holovator beside a building; win his battle and use the repaired lift to reach the roof | Distinct Holovator-category glyph; facade alignment, source-to-Atlas XY and pictured roof exit |
| DR-H-02 | [238914](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=238914) | Vernal Avenue, NW of WZ1; **Vert 9 is only source-reported** | Speak with Terra; inspect soil directly in front of the lift and drive off the Lv.28 Diggersby | Numbered-sector border, device glyph, entrance and floor |
| DR-H-03 | [238212](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=238212) | **Vert Sector 7 is the quest location** (Bulbapedia); South Boulevard (Serebii) | From Vert Pokémon Center go NE to Élec; activate the lift with an Electric-type attack | Distinct Holovator point, Vert 7 boundary, facade and roof |
| DR-H-04 | [237861](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=237861) | South Boulevard, south of WZ12; **Bleu 7 source-reported** | Find Durstin and give him a drink so maintenance can restore access | Confirm building/block and sector boundary |
| DR-H-05 | [237633](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=237633) | Jaune Sector 6, south of WZ8 | Activate disabled lift with a **physical Fighting-type move** | Source device point and roof elevation; main-19/20 progression boundary |
| DR-H-06 | [235024](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=235024) | Bleu Sector 3, around Bleu Plaza / north of WZ12 | Defeat the Rust Syndicate grunt blocking the unit | Device entrance, street-side map alignment and roof exit |
| DR-H-07 | [237731](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=237731) | **Magenta Sector 2 is the quest location** (Bulbapedia); Autumnal Avenue, NE of WZ7 | Clear the Alpha Watchog obstructing the unit | Actual device point and mapped sector boundary |
| DR-H-08 | [238913](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=238913) | Hibernal Avenue, west of WZ15; numbered sector unknown | Clear the Manectric/Ampharos dispute in front of the lift | Sector number, device point, street face and roof |
| DR-H-09 | [238206](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=343&markerId=238206) | **South Boulevard** (Bulbapedia); Bleu Sector 8 reported by GameWith, SE of WZ10/Café Soleil | Clear four Beldum surrounding the unit | Resolve street vs numbered-sector geometry; source device glyph and floor |

**Primary independent source triangulation:** [Bulbapedia Legends: Z-A side-mission table](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)) for quest location and timing; [Serebii's mission index](https://www.serebii.net/legendsz-a/sidemissions.shtml) for mission steps; [Thonky #004](https://www.thonky.com/pokemon-legends-z-a/side-mission-004-a-break-time-battle), [#023](https://www.thonky.com/pokemon-legends-z-a/side-mission-023-underneath-the-holovator), [#040](https://www.thonky.com/pokemon-legends-z-a/side-mission-040-a-holovator-without-power) for approachable player directions. Gamer Guides mission pages supply the **mission** XY and clickable marker IDs. A commentator's or video's alternative spelling "Summi" is not used: the quest records identify worker **Sommi**.

**Verified in this batch:** nine direct, individually identifiable **mission** marker deep links; two newly evidenced named **quest sectors** for previously unnumbered records (Vert 7 for #040, Magenta 2 for #071); source-linked ground-level objective/direction text for all nine. Source descriptions also distinguish streets from sector IDs for #023, #045, #080 and #092. An approximate mission-to-device relationship is described by the narratives, **not** measured as map XY or proven identical to an individual Holovator-category glyph.

**Unchanged thresholds:** **0 exact Atlas Holovator pins**; **0 independently extracted Holovator-category marker positions** out of the reported 23; **0 measured entry/roof exit coordinate pairs**; **0 validated source-to-Atlas transform**, no copyrighted third-party maps copied, no site/JS/CSS/Supabase/checklist edits. Do **not** place these Side Mission marker points on the confirmed Holovator layer.

**Next safe device mapping task:** take DR-H-01's clickable mission marker `234541`, inspect the **separate Holovator category** beside the same building west of WZ3, record the actual glyph's identity and X/Y; then align **three or more** independent control points from source map to `maps/lumiose-game-map.jpg`, quantify pixel registration error and verify facade / rooftop arrival in clear gameplay. If insufficient image evidence, mark DR-H-01 **awaiting device evidence** and repeat this exact gate on DR-H-02, continuing across all nine and then the remaining category markers without inventing pins. Only after confirmed Holovators start the scaffold/ladder networks and numbered pickups.

## Original photo pixel mapping batch 03 — owner in-game city images (21 November 2026)

The owner correctly noted that the **ten original TV-map photographs** already show potential access positions. All ten original `1152x1536` photos were recovered from the user's earlier uploaded-file library and **visually inspected** during the mapping continuation. The previous assumption that the original photographs were unavailable for review is no longer correct. The images remain **private source evidence; none have been uploaded or copied into this public repository**.

**Authoritative source-only candidate register:** [`MAPS_OWNER_PHOTO_ACCESS_LEADS_2026-11-21.json`](MAPS_OWNER_PHOTO_ACCESS_LEADS_2026-11-21.json). It records 10 source photo identities and landmark inventories, plus **12 candidate yellow double-chevron icon groups observed 15 times** (some seen in two overlapping photos). Approximate pixel centres are referenced to the **entire camera JPG** including dark TV surround (origin upper-left, x right, y down, manually placed ±20 px), *not* to `maps/lumiose-game-map.jpg` or the game coordinate frame. No rectification transform, roof floor or exact Holovator category classification is yet established.

| Mapping lead | Original owner-photo pixel point(s), approximate | Grounding against mission/source references | Verification status |
| --- | --- | --- | --- |
| **PHOTO-C01 → DR-H-01?** | **P08 (480, 1055)**, **P09 (498, 500)** | Two potential symbols W/SW of WZ3 near Rouge Sector 1/Autumnal Avenue | **Do not deduplicate:** provisional Atlas projections are ~73 native pixels apart; neither identified as mission #4 device |
| **PHOTO-C02 → DR-H-02?** | **P04 (132, 984)** | W/NW of WZ1 near Vernal Avenue / Vert Sector 9; candidate mission #23 Diggersby-blocked unit | Needs icon identity, perspective transform and same-building check |
| **PHOTO-C03 → DR-H-03?** | **P04 (783, 779)** | By Vert Sector 7, NE of Vert Pokémon Center / SW of Racine Construction, strongly fits mission #40 neighbourhood | **Strong relative-position lead**, not confirmed Holovator entrance |
| **PHOTO-C04 → DR-H-04?** | **P05 (638, 977)** | South Boulevard, immediately south of WZ12 / Aymis Park, in Bleu Sector 7 area; strongly fits mission #45 neighbourhood | **Strong relative-position lead**, not confirmed Holovator entrance |
| **PHOTO-C05 → DR-H-07?** | **P09 (377, 735)** | NE of WZ7 at Magenta Sector 2 / Autumnal Avenue approach, aligns with mission #71 region | Plausible, no device identity verified |
| **PHOTO-C06 → DR-H-08?** | **P01 (376, 532)**, **P08 (955, 797)** | W/SW of WZ15 near Rouge Sector 6 / Hibernal Avenue, candidate mission #80 area | Approximate source-map projections fall ~17 native px apart, consistent with same icon; **device identity unresolved** |
| **PHOTO-C08 (unassigned)** | **P03 (523, 848)**, **P04 (563, 480)** | Café Cyclone / Coulant Waterway, Vert Sectors 3/5 | Potential repeat view to align, no mission assigned |

Five further unassigned yellow-chevron location groups (PHOTO-C07/C09/C10/C11/C12) are retained in the JSON with local street/sector bearings and photo pixel centres. **A yellow circular double-chevron alone does not prove that the marker is a Holovator**, and overlap across two photos is not yet a measured homography/transform. The candidate list is a *sample* of visually identifiable symbols, **not a complete count** of all city Holovators or all visible chevrons.

**Next safe action is now better constrained:** inspect **PHOTO-C03** (Vert 7 / Racine) and **PHOTO-C04** (South Boulevard / WZ12), matching each visible map icon against its mission's **individual source Holovator category marker** and in-game facade/roof evidence. Then do photo perspective rectification and align at least 3 architectural controls per photo against the existing source image with a measured error budget. Only when all mandatory gates hold set `atlas_x`/`atlas_y`; until then **all 12 leads stay provisional**, and no new public map dot is created.

**Preservation checkpoint:** 48 named sectors, 20 Wild Zones, 264 source item records, 100 Screw clues, 146 A-leads, old 30 landmark associations and all saved progress IDs stay intact; source-photo files and original Site A untouched; no JS/HTML/CSS, Supabase, live site or image asset mutation. Issue #28 remains OPEN. This batch is evidence consolidation in PR #58, **not** a new functioning map-layer release.

## Owner-photo to original Atlas JPG — exploratory affine registration batch 04 (21 November 2026)

**Now using the actual source-map asset, not just a guide's external XY:** Retrieved `maps/lumiose-game-map.jpg` directly from GitHub (`b951a877aea400564b1c4c6495b0cd41247bd8ca`), confirming its native dimensions **1920×1920 pixels**. Approximate correspondence between named Wild Zone centres/landmarks in that file and the player's original photos supports an initial **photo-pixel → Atlas-JPG-pixel** affine estimate for **six of the ten** photos. [Reproducible anchor/control register and projected coordinates](MAPS_PHOTO_ATLAS_APPROX_REGISTRATION_2026-11-21.json).

**Measurement method and important limits:** Four or five manually identified matching control points per registered photo (Wild Zone centre, known Pokémon Center, café, or Prism Tower). Source-map controls were selected using a visually displayed 1280×1280 preview and multiplied by **1.5** to convert to native JPG coordinates. Fitted 2×3 least-squares affine matrices and control-fit residuals are stored in JSON. **A low residual is not a proof of true positional accuracy:** controls are hand-picked and rounded, the player images are camera photos of a tilted TV, and perspective/wall or UI distortion was not fully modelled. This is usable for **approximate research bearings**, not finished, confirmed pins.

| Possible device / lead | Approximate **native Atlas JPG pixel** estimate (1920×1920), not a confirmed pin | Source-photo evidence and caution |
| --- | --- | --- |
| DR-H-03? Vert 7 / Racine | **PHOTO-C03 ≈ (1475, 1540)** | P04 icon (783,779), 4 control points / 1.2 px native fit residual; unit still not individually identified |
| DR-H-04? South Boulevard south WZ12 | **PHOTO-C04 ≈ (698, 1729)** | P05 icon (638,977), 4 controls / 15.1 px native residual; source image and photo-perspective uncertainty remain |
| DR-H-02? Vernal Avenue | **PHOTO-C02 ≈ (949, 1666)** | P04 west/NW of WZ1, possible but device unproven |
| DR-H-07? Magenta 2 / Autumnal | **PHOTO-C05 ≈ (739, 740)** | P09 NW/NE-area marker vs WZ7; icon classification not established |
| DR-H-08? W/SW of WZ15 | **PHOTO-C06 ≈ (1197, 393) from P01**, **(1183, 402) from P08** | *Independent photo projections* differ by ~17 native px, consistent with same map icon; mission #80 physical unit still unverified |
| Café Cyclone / Coulant Waterway (unassigned) | **PHOTO-C08 ≈ (1308, 1331) from P03**, **(1304, 1339) from P04** | Two photo projections differ ~9 native px, supporting a common visible icon location but not its type |
| DR-H-01? west of WZ3 | **P08 ≈ (831, 633)** vs **P09 ≈ (830, 560)** | **73 native px difference**; do not assume these are the same icon or choose one as Sommi's unit without direct gameplay/marker verification |

This is a meaningful improvement over the prior unaligned mission XY: **some owner photo icon locations are now registered approximately into the existing Atlas JPG frame** and two overlapping pairs are spatially corroborated. Nevertheless the **confirmed Holovator counter stays 0** because **(a)** yellow-chevron semantics are not definitively checked as Holovator, **(b)** mission-specific physical unit match is missing, **(c)** entrance building face and roof are not demonstrated and **(d)** manual affine registration still needs independent geometric/perspective validation.

**Safe next order:** match DR-H-03's actual mission #40 unit to PHOTO-C03 and DR-H-04's #45 unit to PHOTO-C04 via in-game screenshot/category marker → validate physical entrance and rooftop arrival → improve perspective registration and independent residuals → then add a **confirmed** pin in a bounded, tested map-code PR. The approximate coordinates above are never sourced by the public confirmed map layer. Protect original ChatGPT Site A, Supabase, user photos, existing 48 sector/20 Wild Zone navigation and progress.

## Release boundaries and where to resume

- **Edition A:** Original ChatGPT Workspace Site `lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site` remains unchanged. No original source export, redeploy, DNS change, Supabase change, ratings/feedback/report deletion or player progress reset.
- **Edition B:** Improve the independent GitHub Pages edition, preserving current routes and progress. Existing feedback relay must remain untouched.
- **Source distinction:** Owner photos and user-supplied PDFs are evidence, **not automatically verified complete map data**. Do not modify archived PDFs or the immutable original source-asset hash manifest to disguise missing map resources.
- **Next code work after this docs-only plan:** Begin at **SM-01** by auditing all ten photo views against `maps/lumiose-game-map.jpg` and capturing the first bounded, correctly evidenced sector overlay. Then SM-02 zoom controls; only then the structural layers and access positions. Record results as a new ledger entry and update `MAPS_UPGRADE_MANIFEST.json` phase/sector statuses.


## Owner wide-HEIC photo triangulation batch 05 — Holovator icon identity and repeat views (21 November 2026)

**New evidence (not a replacement for older photos):** the owner supplied **ten additional original 1536×865 landscape HEIC game-map screenshots**, separate from the earlier ten 1152×1536 photos used in batches 03–04. They show panned, overlapping portions of the actual in-game map, including map chevrons and street labels. The original files remain private in the conversation; **none of the images were uploaded to public GitHub**. Their exact uploaded basenames, SHA-256 hashes, approximate image pixel centres, the landmark controls, camera-to-source affine fits and projection caveats are recorded in [the new wide-photo evidence register](MAPS_OWNER_WIDE_PHOTO_ALIGNMENT_2026-11-21.json). **Five of ten** new photos had three or more matching map controls adequate for exploratory alignment; five remain visually reviewed but not projected.

**Missing icon-type evidence improved:** [Pokémon Mythology's in-game walkthrough](https://www.pokemythology.net/detonados/detonado-legends-z-a/) explicitly describes an *already used Holovator* appearing on the game map as a **yellow icon with two upward-pointing arrows**. That corresponds to the visible double-up-chevron symbols in the owner's photos. This is independent **symbol-class corroboration** (Holovator, rather than arbitrary ladder/scaffold marker), **not** a physical mission-specific device ID, proof of current activation in every save, or the source site's separately identifiable Holovator-category marker ID.

**Repeat-photo candidate locations** (all XY below are **approximate 1920×1920 original Atlas JPG pixels**, *not verified game/world XY or production device pin coordinates*; each observation originally measured on its 1536×865 HEIC before fitting):

| Candidate | Landscape owner photo observations → exploratory Atlas XY | Cross-photo match | Mission/location interpretation |
| --- | --- | --- | --- |
| **WIDE-H03 / PHOTO-C03** | W04 (1344,457) → **(1486,1532)**; W05 (665,729) → **(1486,1515)** | ~**17 px** apart | Yellow Holovator symbol southeast of WZ17, SW of Racine Construction; **strong candidate for #40 / Élec in Vert Sector 7**, not yet direct entrance match |
| **WIDE-H04 / PHOTO-C04** | W04 (379,673) → **(706,1705)**; W10 (509,712) → **(710,1706)** | ~**4 px** apart | South Boulevard just south of Aymis Park/WZ12; **strong #45 / Durstin vicinity**, device/facade still unproved |
| **WIDE-H02 / PHOTO-C02** | W04 (692,620) → **(959,1663)**; W10 (831,658) → **(968,1668)** | ~**10 px** apart | Vernal Avenue, NW of WZ1; **#23 / Terra neighbourhood**, entrance not yet identified |
| **WIDE-H08 / PHOTO-C06** | W06 (489,192) → **(1189,392)** | Single wide frame; close to earlier ~1197,393 / 1183,402 | Hibernal Avenue / west WZ15; possible **#80**. W06 uses **three controls only** so training-fit RMS zero is not meaningful validation |
| **WIDE-C08 / PHOTO-C08** | W05 (426,494) → **(1303,1335)** | Earlier ~1308,1331 and 1304,1339 | Additional Holovator near **Café Cyclone / Coulant Waterway**, no mission assigned |
| **WIDE-C13 (new)** | W04 (674,376) → **(943,1467)**; W10 (811,412) → **(952,1473)** | ~**11 px** apart | **Separate yellow symbol by Café Classe / Vernal Avenue**, east of Aymis Park; **do not confuse with Café Cyclone/C08** |
| **WIDE-C12 / PHOTO-C12** | W07 (763,280) → **(920,400)** | Earlier ~914,410 | Looker Bureau / Sushi High Roller, independent of #80 claim |
| **WIDE-H01 / PHOTO-C01** | W07 (656,503) → **(836,589)** | Older alternatives (831,633) and (830,560) disagree | **Rouge Plaza/WZ3 west-side #4 remains ambiguous**; neither old icon has been uniquely matched |

**Geometry validity:** manual 1280-preview building/zone control estimates from batch 04 were re-used and scaled to 1920 native pixels. The new wide frames W04/W05/W10 have 6/4/5 controls with internal RMS about **5.8 / 0.6 / 4.2 px** respectively. These residuals are *fit statistics, not absolute map accuracy*. W06/W07 have only three controls, giving exactly zero affine training residual by construction; no independent hold-out is available. Camera tilt, manual point picks and any incorrect earlier landmark centre remain unresolved. Several pairs agree at ~4–17 native pixels **within this approximate register**, but this cannot be promoted to exact rooftop-entry placement.

**Sequential next gate:** start with **WIDE-H03 (#40 Vert 7)**. Match the photographed yellow icon to Élec's *specific* mission lift using its front-facing street position and actual usable rooftop exit, then independently confirm device/category source marker and refine perspective registration. Repeat for **WIDE-H04 (#45 South Boulevard)**, **WIDE-H02 (#23 Vernal Avenue)**, **WIDE-H08 (#80 Hibernal Avenue)**, and remaining icons, using a stable numbered ID for each physical unit. Keep unknowns in research leads, never in the confirmed Holovator layer.

**Safety and completion status:** **0 mission-to-specific-device matches fully proven, 0 exact Atlas Holovator entrance XY, 0 confirmed entrance/rooftop-floor pairs**. This change is **research documentation only** on [PR #58](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/58); issue [#28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) stays **open**. No original ChatGPT Site, Edition B HTML/JS/CSS, public images, GitHub main, Supabase, player progress, feedback, 48 sector names, 20 zones, 264 items, 100 Screws or 146 approximate leads were changed.


## Independent lift facade and roof-access sources batch 06 — missions #40 then #45 (22 November 2026)

**Aim:** follow the owner's strict one-at-a-time location validation loop using the [new wide-owner-photo map register](MAPS_OWNER_WIDE_PHOTO_ALIGNMENT_2026-11-21.json), **independent in-game mission map screenshots**, street-level NPC/lift photographs and written roof-access evidence. This improves *quest-to-lift physical identification* beyond pure neighbourhood clues, without inventing exact coordinate maps. The full source and route fields are in [the coordinate validation register](MAPS_HOLOVATOR_COORDINATE_VALIDATION.json), `evidence_batch_4`.

### 1. DR-H-03 — #040 A Holovator Without Power — Vert Sector 7 / South Boulevard

- **Owner photos:** W04 yellow chevron at approximate original camera `(1344,457)`, projected to **(1486,1532)** native Atlas JPG; W05 `(665,729)` projected to **(1486,1515)**. Two independent approximate photo projections lie about **17 native pixels** apart. The chevron is south/southeast of the grass now associated with WZ17, SW of Racine Construction.
- **Independent map comparison:** [Game8 mission #040 original *in-game* wide map screenshot](https://img.game8.jp/11862087/e17a1808f2b54eba57ff7c6572722894.webp/show) and [close-up mission star screenshot](https://img.game8.jp/11862088/2dbcd0a1bf80e03a0e0a074b90a8d55e.webp/show) position Élec's quest **star** at the South Boulevard/Station Front corner of the Vert Sector 7 building group. This agrees at **street-block/neighbourhood level** with the owner's chevron. **A pink star is a quest marker, not the Holovator-class marker; do not treat their centres as identical.**
- **Physical device/facade image:** [Game8's repaired-lift photo](https://img.game8.jp/11862121/1c2167921bd1290b64aeeafc6aa30142.webp/original) shows **Élec** standing beside a yellow active Holovator against a **light-coloured masonry wall with blue-shuttered windows**. [GameWith's pre-repair view](https://gamewith.jp/pokemon-za/524525) shows Élec and a red disabled floor pad at the same quest. These establish the *quest's physical street lift* appearance but the exact pictured building face has not yet been geometrically tied to the owner's chevron.
- **Player route and gating:** [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-040-a-holovator-without-power) says start from **Vert Pokémon Center**, travel **northeast**, speak with Élec, then attack the broken unit with an **Electric-type move**. It appears after the Canari Quiz Whiz in Main Mission 14. [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Mission_%28Legends%3A_Z-A%29) calls the mission locality **Vert Sector 7**; [Serebii](https://www.serebii.net/legendsz-a/sidemissions/aholovatorwithoutpower.shtml) calls the adjoining road **South Boulevard**. **Do not require players to identify WZ17 at this early stage:** [Vert Sector 7 location notes](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/vert-sector-7.html) say WZ17 only appears after Main Mission 24.
- **Roof landing and recoverables:** [Game8](https://game8.jp/pokemon-legends-z-a/730135) shows the powered lift reaches the rooftop, with **one Colorful Screw**, then a route toward the **TM Iron Defense** on/near the Racine Construction roof. [StrategyWiki's screw route](https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/Exploring_Lumiose_City) says travel west on South Boulevard, ride the lift, cross a leaf bridge, and turn right to the end of the roof; [sector-item notes](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/vert-sector-7.html) provide additional roof-item leads. These are *unplotted research leads*, **not a confirmed individual Screw or TM pixel point**.
- **Result:** street-block match **strong**; mission action/facade/rooftop use **independently documented**; owner chevron = *this exact photographed entrance*, rooftop **arrival pixel/floor**, and exact image-map XY **NOT yet fully established**. **No exact site pin promoted.**

### 2. DR-H-04 — #045 On Maintenance Duty — South Boulevard below Aymis Park / Wild Zone 12

- **Owner photos:** W04 yellow chevron `(379,673)` → approx **(706,1705)** Atlas native pixels; W10 `(509,712)` → approx **(710,1706)**. These two independent approximate projections are **~4 native pixels** apart. The photographed lift icon is on South Boulevard, southwest of Aymis Park / WZ12, in the Bleu Sector 7 area.
- **Independent map comparison:** [Game8 city map with mission #045 star](https://img.game8.jp/11864561/a201014a678aed88a8e618f8839b1515.webp/show) and [its mission block close-up](https://img.game8.jp/11864559/0ffa6fee8b487e8768758ede97139f66.webp/show) show the objective **on South Boulevard immediately south/southwest of WZ12**, adjoining the Bleu Sector 7 building group. The owner-game chevron and the map star align qualitatively by **road/building-block context**, not by a calibrated source-image pixel transform.
- **Physical device/facade image:** [Game8's post-repair lift photo](https://img.game8.jp/11864651/3c355074ca1835f2eff65e53b90b08b8.webp/original) shows **Durstin** beside a yellow active Holovator in front of a **dark storefront-like building facade with tall framed windows**. [Thonky's scene](https://www.thonky.com/pokemon-legends-z-a/side-mission-045-on-maintenance-duty) likewise identifies Durstin as the side-mission NPC. Physical lift and quest known, but exact photo-to-Atlas building facade not yet overlaid.
- **Player route and gating:** [Serebii](https://www.serebii.net/legendsz-a/sidemissions/onmaintenanceduty.shtml) sets unlock at **Main Mission 19**, near the South Boulevard Holovator. Speak with Durstin and give **Fresh Water, Soda Pop, Lemonade or Moomoo Milk**; [Game8](https://game8.jp/pokemon-legends-z-a/730277) notes a drink seller **just north** of the mission. [GameWith](https://gamewith.jp/pokemon-za/511130) explicitly positions mission #045 **south of WZ12**.
- **Roof landing and recoverables:** [Game8](https://game8.jp/pokemon-legends-z-a/730277) says the repaired unit accesses the **TM Iron Head** rooftop route, and a **Larvitar** may be found before the TM. [GameWith](https://gamewith.jp/pokemon-za/524377) gives the roof approach **southeast of Bleu Pokémon Center**. Treat both as **route/encounter leads, not exact item/Pokémon pins**.
- **Result:** strong photograph-to-mission **street-block match**, direct independently documented mission-side physical Holovator and rooftop rewards; **specific owner-chevron-to-entrance identity**, image-pixel XY at actual ground facade, exit elevation and roof arrival point **not fully source-matched**. **No exact site pin promoted.**

### Strict promotion gate after batch 06

1. **Do not confuse** the side-mission star on Game8's map with the game's yellow Holovator chevron. Both map symbols are independently visual, but they have not been co-registered at sub-building precision.
2. Obtain either (a) the original owner's own **street-facing photograph of the post-repair lift**, showing its adjacent building/road and a **rooftop exit capture**; or (b) clear independently verifiable footage in which the lift's on-map yellow chevron, actual facade and rooftop exit are linked in one sequence.
3. Align *that specific* physical lift to `maps/lumiose-game-map.jpg` using **three or more independent architectural points plus a holdout/error estimate**, distinguishing a quest marker from the device's entry and exit.
4. Only then write `atlas_x/atlas_y` under the **confirmed** pin schema, with a stable physical-device ID and floor/route description; leave item/screw exact dots `null` until their own separate coordinate evidence.
5. Continue one by one with DR-H-02 (#023 Vernal Avenue), then DR-H-08 (#080 Hibernal Avenue); keep separate Café Classe and Café Cyclone chevrons as their own unsourced lift candidates.

**Document-only preservation:** [PR #58](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/58) holds the changes; no map/site asset code, source photos, original Workspace Site, Supabase, ratings, feedback, player progress, 48 sectors, 20 zones, 264 archival items, 100 Screw clue IDs or 146 approximate leads were changed. [Issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) stays open. **Exact verified Holovator entrance pixel pins = 0**; although real physical lifts are shown in external imagery, **validated owner photo → specific entrance → roof-exit image-pixel pairs = 0**.


## Owner Holovator mission #023 and #080 visual field cross-check batch 07 (22 November 2026)

**Order and scope:** Continue the one-by-one device-access mapping validation after missions #040 and #045. These are direct researched comparisons of **independently captured in-game quest map screenshots, pre-/post-repair physical Holovator photographs and rooftop guide routes**, against the owner's *already saved* yellow-up-arrow screenshot candidates. The photo registration frames and estimates are in [the owner landscape photo register](MAPS_OWNER_WIDE_PHOTO_ALIGNMENT_2026-11-21.json); each mission's structured field evidence is in [the Holovator coordinate register](MAPS_HOLOVATOR_COORDINATE_VALIDATION.json) under `mission_lift_field_evidence_2026_11_22` and `evidence_batch_5`.

### 1 — DR-H-02, mission #023: Underneath the Holovator (Vernal Avenue / Vert Sector 9)

**Owner camera-map evidence:** Previously recorded yellow Holovator icons from new landscape photos W04 at owner-photo `(692,620)` → **(959,1663)** and W10 at `(831,658)` → **(968,1668)** approximate **native 1920×1920 Atlas JPG research XY**. The two estimates differ by approximately **10 native pixels**. They are *not exact game-world positions*; no pixel-accurate street-facade projection has been proved.

**Independent in-game map:** [Game8 city overview for #023](https://img.game8.jp/11858709/7a3fb31a5197418a3880201f775fd7b6.webp/show) and its [close-up around Wild Zone 1](https://img.game8.jp/11858711/03e4d7aae71d402a8d6ef5ac044c3d4f.webp/show) show the **pink mission objective star northwest of Wild Zone 1** by Vernal Avenue, matching the **neighbourhood** of the owner chevron. These are images of *quest state*, **not an individually selected Holovator-category marker**. [Vernal Avenue location index](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/vernal-avenue.html) places Terra's quest near the Holovator in **Vert Sector 9** (reported mission-locality sector, NOT a traced device boundary).

**Physical ground entry:** [Game8's pre-repair grassy courtyard dirt mound and red lift barrier](https://img.game8.jp/11858766/daf62b37934bcaf747910af6697c2d29.webp/original) and [its yellow repaired-lift image with Terra](https://img.game8.jp/11858773/bb63356ab102a7ab0f3cf8cc6af6e625.webp/original) show the quest's actual lift in a **small grassy building-side courtyard against a pale stone facade**, with a nearby blue-framed door/window. These images establish the physical *quest lift design and courtyard scene*, but are not calibrated to the exact owner's map icon/boundary.

**Safe player directions / quest gate:** [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-023-underneath-the-holovator) and [Serebii](https://www.serebii.net/legendsz-a/sidemissions/underneaththeholovator.shtml) agree: during Main Mission 10, **after battling Taunie/Urbain**, go to the **northwest of Wild Zone 1** along Vernal Avenue, talk to **Terra**, inspect the **soil mound blocking the red Holovator** and choose to drive out the Pokémon; fight **Lv.28 Diggersby**, defeating or catching it. The lift becomes usable. Completion rewards **₽1,500, Soft Sand ×1, Revive ×1**. [Game8 mission guide](https://game8.jp/pokemon-legends-z-a/729708) independently shows the mission map, the mound and the restored Holovator.

**Roof-access gate:** [Dexerto guide](https://www.dexerto.com/wikis/pokemon-legends-z-a/underneath-the-holovator-pokemon-legends-z-a/) confirms the repaired lift reaches a neighbouring rooftop, but **no individually identified collectible pickup, roof landing floor or exit pixel** is validated for this lift. Independent [Vernal Avenue street inventory](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/vernal-avenue.html) lists a screw and items on southwest scaffolding. **Do not claim the mission lift is the required access to those scaffolds or deduplicate its screw with the owner's 100 records until demonstrated.**

**Result #023:** quest locality, physical red-to-yellow lift, objective and rooftop utility **independently supported**; approximate owner yellow icon candidate **strong by block**, but **exact owner icon → facade → roof exit match pending**. The owner JPEG-image projected coordinates `959–968,1663–1668` remain only in the research fields. `atlas_x` and `atlas_y` of a verified lift pin remain **null**.

### 2 — DR-H-08, mission #080: A Shocking Territorial Dispute (Hibernal Avenue / west of Wild Zone 15)

**Owner camera-map evidence:** New landscape screenshot W06 at owner-photo `(489,192)` gives tentative source city-JPG projection **(1189,392)**; two independent earlier portrait photo projections gave **(1197,393)** and **(1183,402)**. All three are **approximately consistent** within a small neighbourhood but not certified exact. The W06 photo used only **three hand-selected affine controls**, so a zero training residual is *automatic* and **must not be described as measured map accuracy**.

**Independent in-game map:** [Game8 city-map overview for mission #080](https://img.game8.jp/11874194/dd616459cb4eb3db6451fea364f89ddd.webp/show) and [close-up](https://img.game8.jp/11874195/a82ea376feeb45815066a417e6789c4c.webp/show) show the **pink objective star** on **Hibernal Avenue southwest/west of Wild Zone 15**, consistent with the player's yellow-chevron research region. The reference map is not aligned at the **actual lift entrance** pixel. [Gamer Guides side mission #080](https://www.gamerguides.com/pokemon-legends-z-a/database/missions/side-missions/a-shocking-territorial-dispute) lists `X:13520,Y:5172` in its **own mission marker XY system**; those numbers cannot be copied to the Atlas image nor used as exact device points.

**Ground lift/battle evidence:** [Game8's street scene](https://img.game8.jp/11874197/77858b5162400cb8a6baccae9349415d.webp/show) shows the two Electric-type Pokémon in front of the **red disabled Holovator** along a broad Hibernal road with planters and stone buildings; [GameWith's mission guide](https://gamewith.jp/pokemon-za/524974) supplies another street view. [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-080-a-shocking-territorial-dispute), [Serebii](https://www.serebii.net/legendsz-a/sidemissions/ashockingterritorialdispute.shtml) and [Hibernal Avenue street index](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/hibernal-avenue.html) identify requester **Amordél** and the pair as **Lv.52 Manectric and Lv.52 Ampharos**, both **uncatchable**. **Ground-type moves** are useful; some guides say simultaneous combat. Completion restores the Holovator and grants **₽3,500, Quick Ball ×4, Lumiose Galette ×1**.

**Story timing:** Main Mission 26, *An Invitation from the SBC*, after the relevant Boutique Couture outfit/Asami/Lebanne progress. Guides phrase the precise intermediate battle differently; preserve the **Main Mission 26 gate** rather than claim one universally identical transition tick.

**Rooftop access / collectibles:** [Game8](https://game8.jp/pokemon-legends-z-a/731365) says the restored lift makes the **Wild Zone 15 rooftop region accessible**, with a **Larvitar** habitat there; it also notes **TM Earth Power inside Wild Zone 15**, which **must not be mislabelled as a Holovator rooftop pickup**. [StrategyWiki screw route](https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/Exploring_Lumiose_City) independently describes **its own checklist Screw #84**, located **Jaune Sector 7**: from **Café Kizuna**, go left along **Hibernal Avenue**, ride the **post-#080 Holovator on the right**; on the roof go right, descend the stairs at the far end of a red roof, go behind a door, run/roll onto the next scaffold and then across another scaffold gap to reach the screw. **This is a documented route lead**, not an Atlas-proven exact pickup, and **StrategyWiki #84 is not necessarily the owner's canonical Screw ID #84**. Whether both described roof regions form one uninterrupted traversal route has not been demonstrated; preserve them separately.

**Sector boundary caution:** Hibernal Avenue borders **Rouge** on one side and **Jaune** on the other. Jaune Sector 7 is connected to the #080 lift's roof/scaffold route, but that does **not** prove the mission's street-level Holovator lies inside **Jaune-07** or **Rouge-06** polygons. Keep numbered device sector **unknown** pending original sector-border geometry.

**Result #080:** in-game mission star, battle at a disabled red lift, unlock mechanism and multiple rooftop routes **independently documented**; matching the owner's yellow symbol to this exact physical facade and measuring entry/roof exit geometry is still an unfulfilled gate. Keep all observed `(1183–1197,392–402)` camera-photo projections as **unverified research coordinates only**.

### Batch 07 sign-off / safe next loop

- **Two mission location/roof access knowledge records strengthened** (missions #023 and #080); mission-star source images are independently accessible and exact referenced URLs preserved. Both existing quest record identities and their Gamer Guides source-layer `343` coordinates preserved with unchanged semantics.
- **No confirmed production Holovator exact native-image pixel** was asserted; **0 verified owner-map lift entrance → roof exit pairs** and **0 item/Screw fixed map dots** added. Source-specific image links are recorded, not copied. Five earlier source-aligned HEIC-named/JPEG-encoded frames and all ten owner's photo evidence files remain private.
- The active map task still needs exact geometric facade-to-owner chevron matching and an actual destination rooftop capture with at least one independent holdout/control error. Every distinct candidate keeps its own ID and confidence flag. This is **not** a release of 48 real sector close-ups.
- **Next one-by-one check:** DR-H-01 **mission #004 Rouge Sector 1** currently has *two conflicting owner-photo chevron candidates* and cannot be deduplicated; independently inspect Sommi's exact doorway and route. Then DR-H-07 **mission #071 Magenta Sector 2** with an owner-photo lead. Do not replace source-only evidence with guessed positions.
- **Protection:** record in existing [PR #58](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/58), keep [map completeness issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) **open**, leave GitHub `main`, original ChatGPT Site A, edition B live runtime, Supabase, feedback, ratings, saved progress, 48 sectors / 20 zones / 264 source item records / 100 Screw clues / 146 approximate locations unchanged.


## Holovator mission nine-of-nine source research and 23-marker reconciliation batch 08 (22 November 2026)

**Owner instruction for phase gate:** First research and log **all** Holovators; **only once the physical devices are independently reconciled and located** publish the yellow Holovator pins to the Atlas. **Scaffolds/ladders come afterward**, followed by items/Screws. Neither the original live ChatGPT Site nor Edition B runtime is to be changed during the research loop. New [23-marker inventory staging JSON](MAPS_HOLOVATOR_23_DEVICE_INVENTORY_STAGING_2026-11-22.json) enforces the distinction between a **reported external category count of 23**, **nine source-backed Holovator-opening side missions** and **seven additional unassigned owner-photo icon leads**. **These are separate overlapping evidence sets, not 9 + 7 = 16 uniquely confirmed physical devices.** There is **no proved mission-marker → source Holovator-category marker ID** so far, and **0 exact Atlas ground-entry/roof-exit pairs.**

### Sequential mission #004 — A Break Time Battle (Sommi; Rouge Sector 1)

- **Quest map and facade:** [Game8 full in-game map](https://img.game8.jp/11856350/9688948097bccccedf02f8cbcd859eae.webp/show) and [zoomed Rouge Plaza view](https://img.game8.jp/11856349/510834edbe85770fa37ff35f578d9772.webp/show) place the **pink mission star west/southwest of the Wild Zone 3/Rouge Plaza circle**. The [street-level broken red lift image](https://img.game8.jp/11856351/b22976ba3cca13bce71058038f2403c2.webp/show) shows **worker Sommi**, a pale sandstone building wall and blue decorative windows/shutters. [Gameroni's in-game exchange](https://www.gameroni.com/guides/76/pokemon-legends-z-a.html) shows the same disabled-to-active Holovator sequence.
- **Photo ambiguity NOT closed:** old owner P08 chevron ≈**(831,633)** native Atlas JPG, P09 ≈**(830,560)**, and a wide W07 observation ≈**(836,589)**. The first is **more plausibly southwest** of the original WZ3 mapped centre than the second, but orientation without an independently registered facade/physical marker cannot select the actual quest unit. Older alternatives separated ~73 native map pixels **must not be deduplicated**; no exact marker published.
- **Activation and player route:** [Serebii](https://www.serebii.net/legendsz-a/sidemissions/abreaktimebattle.shtml) and [StrategyWiki](https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/A_Break_Time_Battle) say begin Main Mission 6 (following Mission 5), go **west of WZ3** and battle **Sommi**. His Pidgey **Lv8**, Budew **Lv8**, Emolga **Lv10**; win **₽1,200 + Exp. Candy S ×3 + Fresh Water ×1** and the Holovator works.
- **Roof lead after the lift:** [Gamer Guides' Screw checklist](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations) specifies a **north-side roof ladder and bridge** to an upper screw west of WZ3; [Gamepedia's independent screw list](https://gamepedia.jp/pokemon-legends-z-a/archives/16379) describes two screw routes after restoring this same lift. Treat these as **route research only**, not exact source-owner numbered Screws.

### Sequential mission #071 — The Burning Gaze of Watchog (Chuckie; Magenta Sector 2)

- **Quest map and facade:** [Game8 in-game city overview](https://img.game8.jp/11871804/90f87c991a7ab4528a3585486a2e4a53.webp/show) and [Magenta close-up](https://img.game8.jp/11871803/7fa0b4743adfec055fcd2091f06773c5.webp/show) place the **pink objective star on Autumnal Avenue northeast of WZ7**, matching the original owner P09 PHOTO-C05 yellow icon vicinity **(739,740)** approximate Atlas JPG pixels. The [street interaction in GameWith](https://img.gamewith.jp/img/6df58446f4067d49e61c51946ee6b6ec.png) shows **Chuckie beside a blue taxi**, with a **red disabled Holovator** against a light building with arched blue-framed windows. [Game8's repaired yellow lift screenshot](https://img.game8.jp/11872311/bd52725410fc2780f2e5de03e46808f4.webp/show) further establishes the quest device appearance, not an exact owner photo-to-facade match.
- **Unlock disagreement:** [GameWith](https://gamewith.jp/pokemon-za/524953), [Game8](https://game8.jp/pokemon-legends-z-a/731300), [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Mission_%28Legends%3A_Z-A%29) place the mission within **Main Mission 24 after the Rust Syndicate Office visit**; [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-071-the-burning-gaze-of-watchog) says **after starting Main Mission 25**. Store both claims, prefer the **story-event trigger** to a misleading universal precise stage.
- **Action/rewards:** talk to **Chuckie** and **catch or defeat the Lv50 Alpha Watchog** blocking the Holovator; unlike mission #080's two electric Pokémon, **this alpha can be captured**. Reward **₽1,200, Assault Vest ×1, Full Heal ×3** and lift access. [Magenta Sector 2 item ledger](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-2.html) lists additional region rooftop/scaffold collectibles; **do not claim those are reached by this exact Holovator until a traversed route is sourced**.
- **Status:** sector/block location and quest lift source images verified; **PHOTO-C05 actual device entrance/roof level and unique Holovator-category marker unresolved**; no exact pin.

### Sequential mission #056 — We'll Just Muscle Our Way Through! (Jaune Sector 6)

- **In-game city source:** [Game8 overview](https://img.game8.jp/11867045/3be8e5ea6c14588f9c75abe1de5fbd14.webp/show) and [Jaune Sector 6 close-up](https://img.game8.jp/11867043/3806f1c865741f21d8f8691e9edf0072.webp/show) locate the quest **south of WZ8**, in **Jaune Sector 6**, not a proved actual Holovator glyph coordinate.
- **Unlock:** [Game8](https://game8.jp/pokemon-legends-z-a/730741) and [GameWith](https://gamewith.jp/pokemon-za/524901) specify **Main Mission 19 after defeating Muku**; a side-mission map index groups it under **Main Mission 20**. Treat this as an event-linked gate where references disagree. The English requester is **Médierà** ([Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-056-well-just-muscle-our-way-through)).
- **Correct action:** use a **Fighting-type *physical* move**, such as **Rock Smash**, to strike the malfunctioning unit; a Fighting-type Pokémon is **not** essential if its move meets the type/category check. Reward **₽900 + Muscle Band ×1**. [Game8's rooftop guide](https://game8.jp/pokemon-legends-z-a/730741) reports a **TM Wild Charge** and wild **Larvitar** on the newly accessible roof, both still unplotted.
- **Status:** owner source photo has **no uniquely linked chevron** for this lift. Category marker ID, exact entry/floor/roof coordinates remain missing.

### Sequential mission #061 — My Favorite Holovator (Bleu Plaza / north of WZ12)

- **In-game map:** [Game8 city map](https://img.game8.jp/11868175/b298b446ebca30fb1d9f4f0cb9d96ae0.webp/show) and [Bleu Sector 3 zoom](https://img.game8.jp/11868174/3d3d5dfaba7238fb7ad658306eb76ec5.webp/show) place the quest north/northwest of WZ12 by **Bleu Plaza**, with a blocked Holovator at the Bleu Sector 3 building edge.
- **Unlock/combat:** after returning to Hotel Z during **Main Mission 20**, beat a Rust Syndicate grunt with **Trubbish Lv45, Roselia Lv45, Mawile Lv46**. [Serebii](https://www.serebii.net/legendsz-a/sidemissions/myfavoriteholovator.shtml), [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-061-my-favorite-holovator) and [Game8](https://game8.jp/pokemon-legends-z-a/731011) support **₽2,000 + Poison Barb ×1 + Mega Shards ×20** and restored lift.
- **Roof route:** [Game8](https://game8.jp/pokemon-legends-z-a/731011) documents crossing roofs, **breaking an icy obstruction to make a bridge**, then finding **TM Energy Ball**. [Thonky's Pokémon location index](https://www.thonky.com/pokemon-legends-z-a/list-of-pokemon-locations) separately reports a **white Flabébé on Stone Emporium roof** after mission #061; this is a *related access/encounter lead*, not a georeferenced fixed pickup.
- **Status:** owner screenshot icon matching and exit geometry still absent; no exact pin.

### Sequential mission #092 — The Beldum Blockade (South Boulevard / Bleu Sector 8)

- **In-game map:** [Game8 city overview](https://img.game8.jp/11878063/16c03a0b14be8c710fb014a48529aa75.webp/show) and [close-up](https://img.game8.jp/11878062/83e645cf4a55304c66a4a339b3490564.webp/show) show the objective on **South Boulevard near Café Soleil**, alongside the **Bleu Sector 8** building block, southeast/south of WZ10. The pink quest star is not an independently extracted device marker.
- **Unlock and action:** available with **Main Mission 31: A Summons from Vinnie**; speak with **Aimant**, chase away **four Beldum simultaneously** blocking the lift. They **cannot be caught during this mission**. Reward **₽3,000 + Rocky Helmet ×1 + Full Restore ×1** ([Serebii](https://www.serebii.net/legendsz-a/sidemissions/thebeldumblockade.shtml), [Game8](https://game8.jp/pokemon-legends-z-a/731477)).
- **Level discrepancy not resolved:** [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-092-the-beldum-blockade) and [GameTrek](https://gmtreks.com/pokemon-z-a/side-missions/92) report **four Lv49 Beldum**, while **Game8 lists Lv36**. Save both with source attribution and **do not publish a firm Pokémon level** until checked against an unambiguous in-game combat image.
- **Rooftop access:** [Game8](https://game8.jp/pokemon-legends-z-a/731477) says repaired lift reaches **Bleu Sector 8**, and may shorten travel towards **Dratini habitat on Bleu Sector 9 rooftop**; an ascent from Bleu Sector 6 can already reach some roofs. Do not imply exclusive access, exact collectible dots or a confirmed roof landing.
- **Status:** mission/locality documented, owner map-source device icon and exact entrance not uniquely linked.

### Source categories, completion gate and route-pinning order

An independently crawled [Shackmaps city category index](https://www.shackmaps.com/pokemon-legends-z-a/map) reports **23 Holovator-category markers**. [GameWith](https://gamewith.jp/pokemon-za/524373) separately lists **nine Holovator-opening side missions** (4, 23, 40, 45, 56, 61, 71, 80, 92). **As of this batch all nine mission records have location/unlock/action source checks** and in-game quest-map references, but **zero source Holovator-category marker IDs are individually extracted, matched and tied to a precise owner native JPG entrance**. The exact device inventory is **NOT 23/23 complete**; 23 is a **source-reported count**, not 23 project-verified pins.

The new [staging inventory](MAPS_HOLOVATOR_23_DEVICE_INVENTORY_STAGING_2026-11-22.json) keeps **seven additional owner-photo Holovator-class symbol groups** as **unmatched leads**, including Jaune Street, Café Cyclone, Bleu Sector 4 near Estival Avenue (two observed groups), Magenta Street, Looker Bureau/Sushi High Roller and Café Classe/Vernal Avenue. **Do not blindly add seven to nine as distinct lifts**: some can coincide with quest devices, camera overlaps or source marker misclassification.

**Strict next owner-authorised sequence:** individually match all **23 external category device IDs/positions** and distinguish entrance vs roof landing, using owner photo architecture and a measured source-to-image alignment; mark unknown fields null. After **23/23 physical-device mappings** are validated and deduplicated, open a separate bounded *Holovator-only pin layer implementation* PR with automated/map geometry checks and Android + desktop visible QA. Preserve old item/Screw progress IDs and avoid overwriting existing markers. **No website update before full Holovator inventory. Scaffolds/ladders are a later phase**, then numbered collectibles. This batch **only updates research documentation** on [PR #58](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/58); [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) stays open, original Workspace Site and Supabase untouched.


## Non-mission Holovator source/owner overlap triangulation batch 09 (22 November 2026)

**Purpose:** continue after the **9/9 mission-unlock research**, toward individual verification of the externally reported **23 Holovator-category markers**, *without placing any public pins*. The new private owner photographs were independently re-opened at full original **1536×865** pixel resolution. This follow-up resolves a specific region previously grouped imprecisely as “Bleu Sector 4/Estival Avenue.” [Full evidence and source links](MAPS_HOLOVATOR_NONMISSION_CROSSCHECKS_2026-11-22.json), including original exact screenshot filenames, picked photo centres, guide-only leads and uncertainty. Source images stay **private, not copied to GitHub**.

### Five unmistakable yellow double-up-arrow map glyphs in one owner view (W08, `1000027204.heic`)

| Owner in-game photograph symbol (photo pixels, NOT Atlas JPG/native pixels) | Street-side landmark | Source reconciliation |
| --- | --- | --- |
| **W08-U01 ≈(405,210)** | Magenta Sector 7 / Pokémon Center near Lumiose Sewers and north of Saison Canal | Owner photo **only**, no independent physical-Holovator-category source-marker ID |
| **W08-U02 ≈(689,280)** | Magenta Street north/northwest of Magenta Plaza | Could relate to PHOTO-C11; [Magenta Street index](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-street.html) supports the street geography **but not this device identity** |
| **W08-U03 ≈(994,264)** | Autumnal Avenue northeast of Magenta Plaza, near Magenta Sector 2 | Possible additional photo observation for **mission #071 Chuckie/Watchog**, **not a newly counted lift**; [sector-specific source](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-2.html) places a mission-blocked Holovator in this sector |
| **W08-U04 ≈(787,655)** | **Estival Avenue immediately beside Café Gallant, southern Magenta Sector 3 edge** | [Raider King's Magenta Sector 3 route](https://raiderking.com/pokemon-legends-z-a-all-colorful-screws-locations/) expressly starts from a Holovator **on Estival Avenue next to Café Gallant**, crosses a bridge onto the building and drops into a roof courtyard for a Screw |
| **W08-U05 ≈(663,776)** | **Estival Avenue / Espace Vide, northern western Bleu Sector 4 complex** | [Bleu Sector 4 location index](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/bleu-sector-4.html) explicitly lists a Potion near a **Holovator north of the western building complex**; nearby roof pickups are research leads |

### Independent same-two-symbol observation (W09, `1000027205.heic`)

W09 also clearly photographs the **two separate yellow discs**: the **Café Gallant/Estival symbol** ≈**(558,294)** and the **Bleu Sector 4/Espace Vide symbol** ≈**(431,412)**. Original W08–W09 photo-pixel differences are respectively **(+229,+361)** and **(+232,+364)**, agreeing within a difference-vector norm **~4.24 source-photo pixels**. This is **valuable cross-photo agreement** for the identity and separateness of these *two different in-game map icons* within the same road area. It is **not** the original 1920px Atlas coordinate transform, is not verified ground facade position and does not supply roof destination or external Holovator-category marker ID. Old owner PHOTO-C09/C10 associations may overlap either one; **do not merge/deduplicate their old photo symbol IDs blindly**.

### Additional user-photo symbols reconciled to independently written Holovator routes

- **PHOTO-C08/WIDE-C08, Café Cyclone / Vert Sector 3:** [sector source](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/vert-sector-3.html) describes a **Holovator in the southern building complex's courtyard** that reaches a roof **Colorful Screw**, Hyper Potion, and other items via roof crossings. Previous native 1920 city-JPG exploratory estimates are ≈(1308,1331) / (1304,1339) / (1303,1335); **not a precise entrance**.
- **PHOTO-C07, Jaune Street near Jaune Sector 11:** [Raider King](https://raiderking.com/pokemon-legends-z-a-all-colorful-screws-locations/) describes taking the **Jaune Street Holovator south** across roof for sector 11 Screw; another passage describes a **Holovator in Sector 11 by Pokémon Center** and gliding over Jaune Street to sector 5. Whether this is one lift or two is still unknown; keep original photo icon distinct from externally described units until exact marker comparison.
- **PHOTO-C12/WIDE-C12, Looker Bureau / Sushi High Roller near Rouge Sector 5:** [Raider King's two rooftop routes](https://raiderking.com/pokemon-legends-z-a-all-colorful-screws-locations/) explicitly start at the **Holovator across the street from Sushi High Roller**, travel north, then roll/glide to the **Looker Bureau rooftop**. [Rouge Sector 5 index](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/rouge-sector-5.html) also notes a Side Mission #048 requester near a Holovator. Older manually registered owner icon research points ≈(914,410)/(920,400) native Atlas JPG pixels; exact street entrance remains missing.
- **WIDE-C13, Café Classe / Vernal Avenue at Vert Sector 4:** [Vert Sector 4 index](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/vert-sector-4.html) mentions rooftop items reachable from a Holovator and **an eastern courtyard Holovator**, including a Colorful Screw and TM Body Slam roof/scaffold course. This independently verifies the **district's Holovator roof access**, **not** that either lift is the owner's specific WIDE-C13 chevron ≈(943,1467)/(952,1473); keep exact match pending.

**Other source-only lifts to investigate** (each might overlap mission-linked or owner-photo entries): a **North Boulevard** Holovator reaching Rouge Sector 3 roofs; a **Vert Sector 8 courtyard** Holovator near Hotel Z; a **Hibernal Avenue Holovator north of Café Kizuna**, potentially **the same physical unit as #080**; and a **Jaune Sector 11 Pokémon Center** Holovator, potentially same as PHOTO-C07. These are links and directions in the structured research file, **not independently added physical-device counts**. Magenta Street W08-U02 and Magenta Sector 7 W08-U01 remain screenshot-only until independently matched.

**Important false-positive control:** a publicly circulating “23 fast travel locations” map is a **different category** and must **not** become a 23-Holovator location set just because the totals match. The [Shackmaps Holovator (23)](https://www.shackmaps.com/pokemon-legends-z-a/map) and [Gamer Guides Navigation → Holovator (23)](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city) counts are separately documented; [Serebii](https://www.serebii.net/pokearth/lumiosecity/) has a Holovator toggle but no per-device IDs recovered in this research. Dynamic interactive views exposed **category totals** but did **not** expose the **23 individual category marker IDs/coordinates** in accessible public text, and the map-based website may have marker/premium limits. **Do not fabricate the missing 23 IDs or an exact owner-photo→Atlas JPG transform.**

**Completion gate unchanged:** external category IDs individually extracted **0/23**; verified exact source Atlas entrance XY **0**, independently checked roof landings **0**, published exact Holovator map dots **0**. Camera-photo symbol pairs, names and route descriptions have advanced materially. The user-approved sequence remains **research all 23 → deduplicate and validate exact entries/exits → one bounded, tested Holovator-only pin release → scaffolds/ladders later → collectible locations after that**. Source-photo files remain private; original ChatGPT Site A, Edition B runtime, GitHub main, Supabase, feedback/ratings/progress and sector/zone/item inventories untouched. Keep [PR #58](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/58) unmerged and [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) open.


## First visual Holovator research preview and Estival two-photo alignment batch 10 (22 November 2026)

**User direction:** Holovator markers should become **visually visible on our game map**, rather than remaining only JSON. The earlier owner gate still applies: **do not update the existing live map until the full Holovator inventory is verified**, and do scaffolds/ladders later. To satisfy both requirements safely, an **isolated, unlinked read-only visual preview** has been prepared in a separate [draft PR #59](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/59), targeting the existing **Edition B** repository. This draft adds `holovator-research-preview.html` only. It reuses the **unchanged existing** `maps/lumiose-game-map.jpg` (1920×1920), does not replace `maps.html`, `sector-maps.html`, `maps.js`, `maps.css`, and has **no Supabase, progress-state or network APIs**.

**What the visual prototype includes:** ten **approximate photo-derived yellow two-up-chevron symbol estimates** shown as *dashed amber research rings* on the existing city image. Each marker is a button with approximate native image-pixel position; selecting it shows landmark, mission if applicable, access notes, evidence quality and still-missing entrance/roof validation. Includes accessible searchable list, filter for mission-associated/other clues, and natural phone scrolling. **Unresolved mission #004 photo alternatives are not plotted**, nor are #056, #061 or #092 as they lack uniquely matched user-photo map symbols. **The ten shown markers are NOT ten verified entrances and do not advance the 0/23 individually matched physical-source category count.**

**New first independent two-photo calibration for the distinct Estival Avenue symbols:** [full W08/W09 four-Wild-Zone-anchor matrices, fit RMS and manual control points](MAPS_ESTIVAL_TWO_PHOTO_APPROX_CALIBRATION_2026-11-22.json). These values are **estimates of original *yellow game-map symbol centres*** on the same preserved 1920px city JPG, **not ground-floor device entrance pixels**:

| Candidate | W08 native Atlas estimate | W09 native Atlas estimate | Research consensus image XY |
| --- | --- | --- | --- |
| Café Gallant / Estival Avenue, Magenta Sector 3 | (579.4,1032.9) | (576.9,1017.7) | **≈(578,1025)** |
| Espace Vide / north Bleu Sector 4 western complex | (476.1,1128.8) | (476.9,1130.9) | **≈(477,1130)** |

W08 4-control fit RMS ≈**12.86 native pixels**; W09 ≈**4.02 pixels**; the former includes a **partially clipped Zone 5** control. Two-frame discrepancies are approximately 15.5 and 2.2 native pixels respectively. These numbers represent only manual point-fit consistency; source JPG Zone markers are approximate, original camera perspective unrectified, and a yellow map icon may be offset from the actual entrance. **Neither position qualifies as an exact verified pin**, even if the visual placement seems convincing.

**Owner-private photo visual QA:** an additional **standalone local interactive HTML** was generated from original W08/W09 uploaded images, with **two tabs, real photo-pixel yellow-symbol overlays and selectable details**, as well as an annotated image preview. Those private screenshots **are not** included in either public GitHub PR. Offline HTML has been statically syntax-checked with Node; headless Chromium access to the local file/localhost was denied by the environment, so **do not claim successful browser-rendered desktop/Android QA**. The generated annotated PNG was manually visually inspected in the current environment; the image is a private illustrative snapshot, not release-ready site evidence.

**Safe validation next:** source *23 individual device-category marker identities* are still missing; continue exact facade/roof matching and deduplication before any real guide map code is modified. Finish research and all 23 physical devices first, then test a **Holovator-only production map layer** with correct original 25-link guide navigation, visible mobile controls and green CI/Pages deployment. Keep **scaffolds, ladders and numbered item/Screw dots out of this preview** and out of the production release until their separate phases.

**Preservation:** documentation PR #58 remains unmerged; visual prototype PR #59 remains **draft and unmerged**; no changes to GitHub `main`, original ChatGPT Site A or live Edition B map entry points, old 20 Wild Zone markers, Supabase, feedback, ratings, original saved progress, 48 sector IDs, 264 source-item IDs, 100 Screw clue IDs, 146 approximate item leads or user photo originals.


## Owner W06/W07 lift cross-photo mapping batch 11 (22 November 2026)

**Goal:** convert the verified Holovator research into visible, inspectable location information while preserving the owner-approved release gate: **no live pins until all physical Holovators have been logged**. Exact photographed icon evidence is recorded in [the W06/W07 research register](MAPS_W06_W07_HOLOVATOR_MATCHES_2026-11-22.json).

### Paired yellow game-map symbols: original 1536×865 owner photographs

| Candidate map icon | W06 photo XY | W07 photo XY | W07 minus W06 |
| --- | --- | --- | --- |
| West of Rouge Plaza / WZ3, candidate for **mission #004 Sommi** | (39,399) | (656,502) | (+617,+103) |
| Hibernal Avenue / west WZ15, candidate for **mission #080** | (491,195) | (1108,301) | (+617,+106) |
| Separate Jaune Sector 4 icon, east of Académie Étoile | (544,418) | (1157,524) | (+613,+106) |
| **Independent control:** WZ3 crest | (175,359) | (791,463) | (+616,+104) |

Four independent camera-photo controls agree on pan **(+615.75,+104.75)** with **2.09-pixel RMS** after simple translation. This proves robust repeat visibility of three distinct yellow map symbols in overlapping game-photo captures, **NOT actual street entrances**. Earlier three-control photo→1920 city-JPG models still disagree on the Jaune-04 symbol by about **50 pixels**. Do not treat approximate image-map positions as verified device entrances or deduplicate the conflicting old #004 estimates.

### New #092 owner photo lead

In W10, a yellow lift icon at approximately **(63,453)** full camera-photo pixels, near **Café Soleil / Bleu Sector 8**, projects with the older manually estimated transform to city-JPG **(352,1496)**. The [Game8 mission #092 map](https://game8.jp/pokemon-legends-z-a/731477) places the Beldum Blockade objective in this street neighbourhood. This is a **single-photo location lead only**, not a proved match to Aimant's physical lift or rooftop exit.

### Independent world-map and gameplay mechanic corroboration

A [Chinese-language player field map, edited 2 November 2025](https://forum.gamer.com.tw/C.php?bsn=1647&snA=127600) describes all Lumiose ladders and holographic elevators and says **nine** lifts start broken, repaired via side missions. The player reports that lifts appear on the in-game map only after approaching and interacting, and investigated broken lifts can appear in **gray**; ordinary ladders do **not** get recorded to the in-game map. This helps explain why a player's screenshot may not display every lift. Do not reproduce the author's map artwork. Its low-resolution reference thumbnail is not grounds for claiming exact source marker coordinates.

### Visual implementation and tests

- Separate, unmerged [draft preview PR #59](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/59) now displays **13** dashed, labelled **approximate symbol** pins on the existing original 1920px map JPG: newly added Rouge Plaza #004 candidate (832,580), Jaune Sector 4 candidate (1225,550; high uncertainty), and Café Soleil / #092 candidate (352,1496; single screenshot). Exact ground entrances and roof arrival coordinates remain unverified; #056 and #061 are still not separately photo-matched.
- The **private offline five-photo visual comparison** embeds only the user's own originals W06/W07/W08/W09/W10, not in GitHub. It supports tapping source-photo symbols, five photo tabs, search, repeated/single-photo filters, and clear caveats. Fourteen named photo candidate groups appear across the five captures, **NOT 14 independently verified physical devices**.
- **Actual Chromium Playwright DOM tests** at **1365×905** desktop and **390×844** mobile succeeded for the private photo comparison: original image loaded, tab symbol counts W06=4 / W07=6 / W08=5 / W09=2 / W10=4, selecting #092 displayed evidence and the repeated filter worked. JavaScript page errors = **zero**. GitHub draft page itself passed V8 syntax and static in-bounds/no-network checks; CI and direct production browser QA are **not claimed**.
- Current validation gates remain **0 individual matched external Holovator category IDs of the reported 23**, **0 exact entrance/roof pairs**, **0 production pins published**.

**Never confuse** external quest-objective pink stars with yellow in-game Holovator category symbols; neither equals a confirmed door or roof exit without further evidence. Research PR #58 stays unmerged and issue #28 open. No updates to Site A, live Edition B pages, original map artwork, main, Supabase, saved progress, ratings, 48 sectors, 20 Wild Zones, 264 original items, 100 Screw clues or 146 approximate leads. **Scaffolds/ladders remain a later phase.**


## All-ten-photo visual Holovator reconciliation batch 12 — 22 November 2026

**User priority:** finish researching and showing Holovator locations visually, then publish **one tested Holovator-only layer after all physical units are verified**, and only then start scaffolds/ladders. This batch upgrades the **private interactive photo viewer to all ten original owner images** and strengthens the evidence register; it does not alter the live Atlas, the existing site map or the main branch.

### Actual image/photo evidence

The full [owner ten-photo visual audit JSON](MAPS_ALL_TEN_OWNER_HOLOVATOR_VISUAL_AUDIT_2026-11-22.json) records **16 named research groups** and **28 original game-map yellow-chevron observations**; **12 groups reappear in two independent owner photographs** and **four are single-view leads**. Every point is an **original 1536×865 photo pixel**, optionally supplemented by a highly approximate 1920×1920 city JPG projection. **No groups have an independently matched external physical-device category ID, verified street entrance or roof landing**; avoid interpreting 16 as “16/23 completed”.

**Three overview frames W01–W03** are kept as whole-city spatial reference photographs. No small Holovator glyph is confidently resolved in those zoomed-out screenshots, so **do not read icon absence as evidence that there is no lift**.

**Five strongest new consolidated repeated photo pairs:**
- **W04↔W05:** **Vert Sector 7 / Élec #040 area** W04 (1344,457) ↔ W05 (665,729); **Café Cyclone / Coulant Waterway** W04 (1108,216) ↔ W05 (426,494). Different named street landmarks and **two distinct symbols**.
- **W04↔W10:** **Vernal Avenue / Terra #023 area** (694,619) ↔ (831,656); **South Boulevard below Aymis Park / Durstin #045 area** (379,675) ↔ (509,714); **Café Classe / Vert Sector 4** (674,376) ↔ (810,408). These share very similar screenshot pan offsets but are distinct symbols.
- **Prior W06↔W07** Rouge Plaza, northern Académie/Sushi and Jaune Sector 4 icons, and **W08↔W09** Café Gallant vs Espace Vide icons, remain in their earlier registers.

**Northern lift ambiguity correction:** in W07 **two separate yellow chevrons** can be seen: (763,280) near **Looker Bureau**, and (1108,301) to the **east of Sushi High Roller / north of Académie Étoile**; the latter matches W06 (491,195). Earlier loose **“mission #080”** attribution to W06/W07 (491,195)/(1108,301) is **NOT proven** by actual mission street doorway or roof arrival. The separate W06/W07 (544,418)/(1157,524) Jaune Sector 4 marker adds another potential physical unit. Keep the mission 80 visual assignment **open** until the nearby lifts are properly disambiguated; preserve the old approximate coordinates for audit but avoid confirmed map labels.

### New external crosschecks and useful roof connection

- [Pokéos map](https://www.pokeos.com/plza/map) and [Serebii Lumiose Pokéarth](https://www.serebii.net/pokearth/lumiosecity/) **independently display Holovator map filters**. Their public index text did not expose **23 individually addressable category marker IDs or source-native city JPG coordinates**. [Shackmaps](https://www.shackmaps.com/pokemon-legends-z-a/map) still reports **Holovator (23)** as an external category count. **Do not substitute a fast-travel 23-point map** for this category.
- A new *route dependency* is backed by [RPG Site's mission overview](https://www.rpgsite.net/guide/18713-pokemon-legends-z-a-side-mission-list-rewards), [GameTrek #89](https://gmtreks.com/pokemon-z-a/side-missions/89), [Thonky #89](https://www.thonky.com/pokemon-legends-z-a/side-mission-089-up-up-and-away-after-emolga), and [Serebii #89](https://www.serebii.net/legendsz-a/sidemissions/up%2Cup%2Candawayafteremolga.shtml): **restoring the Mission #080 Holovator by Café Kizuna gives rooftop access later used for Side Mission #089, Up, Up, and Away After Emolga!** (Jaune Sector 7, unlocked with Main Mission 30; Emolga chase involves Roto-Glide). This is a **mission-dependent rooftop route**, not a georeferenced owner photo symbol or a fixed collectible dot.
- [Raider King's TM route](https://raiderking.com/pokemon-legends-z-a-all-tms-locations/) independently describes **a Holovator north of Académie Étoile** used for TM Toxic Spikes. It might relate to one northern owner yellow symbol, but **no same physical device identity is proven** between that route and #080. Do not silently merge.

### Visual artifact and actual QA

- A private **Version 3 ten-photo HTML viewer** (distributed only as a conversation artifact, **not** committed to public GitHub with embedded user photos) provides **10 photo tabs**, **16 separately inspectable symbol candidate groups**, map-photo coordinates, named localities, repeated-vs-single observation filtering, search and clearly provisional notes.
- Browser-tested with Chromium Playwright at **1365×905 desktop** and **390×844 phone-size**. All ten original photo images loaded. Original yellow-symbol candidate counts by screenshot: **W01=0, W02=0, W03=0, W04=5, W05=2, W06=4, W07=6, W08=5, W09=2, W10=4**. Tapping a W04 lift displayed its evidence; repeat filter returned 5 in W04 and 3 in W10; single filter returned 1 in W10; **zero page JavaScript errors**. These are private offline browser tests, **not** deployed site QA.
- Separate [draft PR #59](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/59) remains a **13-provisional-icon, unlinked, read-only city-map preview** without user image binaries, rather than a completed production map. It has not been merged, deployed or validated on actual user smartphone hardware.

**Release gate:** **0 of 23** individual external Holovator-category device IDs reconciled to the owner's map; **0** exact ground entrances and rooftop exit image-pixel pairs; **0** publicly released Holovator map pins. The apparent location research advanced, not the physical inventory completion counter. Continue source device/door and roof matching one at a time, especially northern Sushi/Café Kizuna/Akadémie cluster and mission #056/#061 unlabeled map symbols. Leave [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) open and PR #58 documentation-only and unmerged. Original ChatGPT Site A, live Edition B HTML/JS/CSS and city art, main, Supabase, user feedback/ratings/progress and legacy 48-sector/20-Wild-Zone/264-item/100-Screw/146-lead baselines preserved. **Scaffolds and ladders remain deferred.**
