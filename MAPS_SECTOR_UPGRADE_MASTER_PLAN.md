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
