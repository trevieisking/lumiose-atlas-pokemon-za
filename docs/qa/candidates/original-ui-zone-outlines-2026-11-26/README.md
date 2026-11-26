# Eleven remaining original UI selection outlines

## Evidence decision and runtime gate

This packet supplies the eleven remaining Wild Zone **rendered map selection outlines** for additive integration. Independent source identity, placement, geometry, visible native-map checks and source gate-interval review passed for the exact frozen candidates. `validation/independent-ui-contour-review.json` records the bounded evidence decision `APPROVE_SCOPED_ORIGINAL_UI_OUTLINES_11` and its exact supporting hashes.

`native-ui-outline-candidates.json` deliberately keeps every record at `candidate_pending_root_review`. The current `evaluateAreaGeometry` rejects this status as `boundary_not_approved`. Evidence approval here is not runtime approval or live promotion: root must review the exact packaged records, preserve the nine existing outlines, make a separate explicit integration decision and pass the final committed runtime and CI checks.

The first-contour file, first checks, discrepancy diagnostics, attempt history and all 33 copied source-packet files are unchanged. Their earlier pending-review labels are historical output. This final review and the linked interval supplement resolve the eleven proposed records without rewriting those original outputs. `PACKAGING_INPUT_SNAPSHOT.json` binds the copied inputs to integration base `a19f1f2fc0535511dac4349573d2442dad40570e`.

## Exactly eleven additions

| Area | Original zone ID | Ordinary / glow texture | Closed-ring vertices | Native visible checks | Source gate intervals |
|---|---|---|---:|---:|---:|
| wz-01 | `a0102_w01` | `map_zone_02^t` / `map_zone_glow_02^s` | 149 | 4 | 4 |
| wz-06 | `a0502_w01` | `map_zone_17^t` / `map_zone_glow_17^s` | 125 | 4 | 4 |
| wz-07 | `a0303_w01` | `map_zone_11^t` / `map_zone_glow_11^s` | 68 | 4 | 5 |
| wz-08 | `a0503_w01` | `map_zone_19^t` / `map_zone_glow_19^s` | 62 | 3 | 2 |
| wz-09 | `a0301_w02` | `map_zone_09^t` / `map_zone_glow_09^s` | 81 | 4 | 4 |
| wz-10 | `a0202_w01` | `map_zone_05^t` / `map_zone_glow_05^s` | 97 | 4 | 2 |
| wz-12 | `a0201_w01` | `map_zone_04^t` / `map_zone_glow_04^s` | 34 | 4 | 6 |
| wz-15 | `a0501_w01` | `map_zone_15^t` / `map_zone_glow_15^s` | 34 | 4 | 4 |
| wz-17 | `a0101_w01` | `map_zone_01^t` / `map_zone_glow_01^s` | 59 | 4 | 4 |
| wz-18 | `a0302_w01` | `map_zone_10^t` / `map_zone_glow_10^s` | 31 | 4 | 6 |
| wz-19 | `a0501_w02` | `map_zone_16^t` / `map_zone_glow_16^s` | 92 | 4 | 2 |

The candidates contain **832 closed-ring vertices**, eleven valid single polygons and no holes. Coordinates are finite native pixels inside the unchanged 1920 × 1920 `maps/lumiose-game-map.jpg`, SHA-256 `4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade`. The wrapper reproduces the frozen `native_geometry` values exactly; no re-fitting, re-thinning, threshold change or simplification change occurs during packaging.

The existing WZ02, WZ03, WZ04, WZ05, WZ11, WZ13, WZ14, WZ16 and WZ20 records must remain identical in every field. `preserve-existing-nine.json` stores their full-record hashes; all nine match the isolated integration baseline. Their source diagnostic alternatives are retained for comparison and are not replacement candidates. The 48 source-area sector footprints are also outside this additive UI-outline change.

## Original source identity and coordinate chain

[Source provenance](source-provenance.json) pins the third-party publication of original resources to [969981/ZA_Resources commit e44a63db22a9f295d43c34db3f67695d31ae8e7a](https://github.com/969981/ZA_Resources/tree/e44a63db22a9f295d43c34db3f67695d31ae8e7a), whose path declares version 2.0.2. Exact paths, byte counts, SHA-256 values and Git blob IDs are retained for five original assets: the English name DAT/TBL, `map_field_00.arc`, `map_top_00.arc` and `map_zone_pane.bin`. These content checks do not imply official publisher endorsement.

The raw identity table contains 32 rows. Original numeric zone IDs, pane names, English message keys and labels join for all **20 Wild Zones**; **12 battle-only rows are excluded**. Texture suffixes are not assumed to be visible zone numbers. The source material joins explicitly distinguish the ordinary `P_zone_00` sprite from the `P_zone_04` glow. For all eleven proposed zones, independently checked decoded ordinary-RGBA and glow-alpha dimensions and raw-pixel hashes match the retained original metadata. The English table's 285th key is the trailing `msg_place_name_max` sentinel after 284 text records.

`original-ui-placement-facts.json` retains original pane translation, scale, rotation, UV/material joins and texture placement. All eleven new zones have unit texture scale. The shared base-map/zone ancestor zoom of 0.8125 cancels in original 4096-map pixels. Pixel centres map through `offset + scale × index + (scale − 1) / 2`; no label centre or approximate marker is used as a boundary control.

The continuous original glow band is thresholded at its fixed half-intensity value 128, thinned by two-pass Zhang–Suen and simplified by at most 0.75 source pixels. The derivation reads no native validation points. Original-map pixels then use the unchanged, independently reviewed texture-to-native affine from the [source-area footprint packet](../source-area-footprints-2026-11-26/README.md). Only that packet's architectural **raster registration** is reused; these UI outlines do not use the sector collision meshes or its world-to-texture transform.

## Three separate evidence checks

### 1. Shared architectural raster registration

The inherited affine has **31 accepted architectural controls** and **4 independently reserved architectural holdouts**. Its fit RMS / maximum is **0.72891061904214 / 2.0523614418784817 native px**; its holdout RMS / maximum is **1.561397527990726 / 2.0008624115912745 native px**. The exact matrix and its approval are retained in `../source-area-footprints-2026-11-26/texture-native-registration.json` and `calibration/independent-texture-native-review.json` in that same packet. Original excluded matches and the pre-fit south-holdout correction remain available there.

The wrapper's `control_count: 31` refers to these shared architecture controls. Its `holdout_count` is **4 architecture holdouts plus that zone's 3 or 4 fixed visible-stroke checks**, not 7 or 8 independent architecture controls for each zone. Its `max_error_px` is the maximum of the shared fit maximum, shared architectural holdout maximum and the zone's visible-check maximum. `uncertainty_px: 3` and `threshold_px: 3` retain the established raster/digitization tolerance; neither is a statistical confidence bound or a universal physical-edge guarantee.

### 2. Forty-three frozen native visible-stroke checks

`validation/native-green-checks-fixed.json` fixes **43 visible native green-stroke observations**: four per new zone except WZ08, which has three. Every saved RGB scan sample and its green-eligibility/minimum-red-channel median pick were independently verified against the unchanged native JPEG. These observations were not used to choose the UI source contour, its transform, threshold, thinning or simplification.

Their distances to the fixed candidate perimeter have **RMS 0.9776701444858091 native px** and **maximum 2.09846177492477 native px**. These are sampled visible-stroke checks. They do not prove that every hidden edge or every source-layer difference lies within three native pixels. WZ09 UI09-N4's scan window was recentered on the actual visible stroke before projection; the first pick and correction panel remain retained.

### 3. Forty-three source gate-opening intervals

The other **43** count refers to a different dataset: every retained contiguous derived-ridge interval more than **3 source pixels** from the ordinary dark opaque sprite mask (`R <= 35`, alpha `>= 230`) in the eleven proposed zones. The diagnostic covers 14,089 ridge points, of which 689 are in those flagged intervals. All eleven private ordinary-source panels were visually inspected, with every interval identified by its `WZnn-Snn` ID.

All 43 flagged intervals lie in ordinary-sprite gate openings between gate-end blocks and adjacent arrow ornaments. No flagged interval was found along a displaced continuous ordinary perimeter stroke. The continuous glow closes those interface openings into the selection footprint. The maximum remains **12.083045959472656 source px at WZ10-S01**. It is preserved as measured and is not relabelled as a distance below three pixels.

The [per-interval independent review](../../at341-independent-review-2026-11-26/remaining-ui-source-interval-review.json) contains all classifications, exact panel/source hashes, interval bounds, counts and maxima. The retained diagnostic is a one-way ridge-to-dark-mask check; classifying every flagged interval is not a bidirectional proof about all possible source edges.

## Representation, occlusion and preservation limits

These are digitized UI selection perimeters. They establish no physical collision wall, traversable route, accessible entrance, spawn region or encounter extent. Decorative gate blocks and arrows are not added to the polygon. Native badge-hidden pieces are supported by the original UI layer and are not independently visible in the owner image.

WZ17's narrow connected selection region beneath the native badge is specifically **not proof of a traversable connection or safe path**. Original glow and ordinary source strokes are not universally identical: the existing WZ13 counterexample remains in `attempt-history.json` and `validation/existing-nine-photo-ui-diagnostics.json`. WZ13 is excluded from these eleven additions and its previous approved outline is preserved.

No recovered original artwork, raw game binary, external decoder source or private-source panel is included. Public source references, hashes, derived coordinates, project-owned replay scripts and diagnostics made from the existing owner-native map are retained. Existing maps, photographs, pins, routes, encounters, progress, Supabase connections and master-plan release gates are outside this packaging change.

## Reproduction and validation scope

From this packet directory, run the existing standard-library-only replay:

```sh
python3 -B replay_native_ui_candidates.py
```

The default command writes nothing. It verifies source/check hashes, reproduces all 20 source placements through the unchanged affine, checks the eleven proposed native rings and all 43 point-to-contour distances, and byte-compares the eleven-record wrapper. `--write` regenerates only this documentation candidate file and retains pending status. It never modifies the runtime dataset or approves a boundary.

For a separate full source replay, supply the exact five pinned original assets and the pinned passive buffer reader in scratch, with a new output directory outside Atlas:

```sh
python3 -B replay_source_ui.py \
  --assets /tmp/atlas-ui-source-inputs \
  --formats-helper /tmp/atlas-ui-source-tools/za_formats.py \
  --output /tmp/atlas-ui-source-replay
```

That optional command validates SHA-256, Git blob and byte-count identity, decodes source placement/artwork into scratch, and byte-compares the original contour and interval diagnostic outputs. It requires NumPy, OpenCV, Pillow and Shapely, plus the separately obtained pinned buffer reader described in provenance. No external dependency source or recovered artwork is shipped in this packet. A full archive/texture decode was **not rerun during this independent packaging step**; its availability is a reproducibility path, not an additional claimed test pass.

The final receipt records the actual no-write candidate replay, preservation checks and read-only model evaluation. All eleven pending candidates must continue to fail closed in the model until a separate root decision. In-memory approval can check topology and schema without changing any stored approval. Final runtime equality, all nine preserved record hashes, final CI and release checks remain root's integration responsibility.
