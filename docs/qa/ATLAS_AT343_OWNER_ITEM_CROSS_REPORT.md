# AT-343 — map-cross correction and local alignment pilot

## Later measurement-video follow-up — 26 November 2026

The subsequent owner-supplied `1000028756.mp4` is recorded in the [AT-343 video/grid follow-up](ATLAS_AT343_VIDEO_GRID_FOLLOWUP_2026-11-26.md) and [structured evidence](ATLAS_AT343_VIDEO_GRID_FOLLOWUP_2026-11-26.json), at planning Manifest 95 / Ledger 103. It adds local Wild Zone 20 grid observations and a waypoint reading of 60 around 20.9–21.0 seconds; it does not establish counted steps, confirmed metres per cell, exact unobscured interval endpoints, citywide calibration or the developer's purpose. That separate report is the authority for the new measurements and limits. The new tracker receipt verifies a guarded 94-to-95 metadata update at 17:02:31.10883 UTC and independent readback at 17:02:56.25398 UTC on 26 November 2026: all 48 existing rows remain, with unchanged 17 verified / 15 in progress / 16 open status totals and all earlier notes, GitHub proofs, Workspace and business fields preserved. The separate inherited AT344 private checkpoint94/102 and its existing source-collection note/work are preserved; this follow-up does not certify that archive or claim it is in main. The original92/100 receipt remains a historical record.

The findings and capture-status fields below preserve the earlier Vert/photo intake. Its experiment, original source inventory and tracker receipt remain unchanged; the new clip is map-measurement evidence, not a verified individual pickup capture. The current follow-up supersedes any earlier statement that no further map-measurement video had been supplied.

## Current finding

**A faint cross does not reliably identify a currently present item ball.** After reporting repeated matches, Trev reported many crosses without balls and withdrew the general rule. This correction controls the earlier hypothesis. No item pins or native pickup coordinates were created from it.

Trev then suggested using the regular marks to align the photographed maps or measure relative spacing. **A strict, independently replayed comparison of the two Vert photographs supports using the pattern as a secondary local alignment reference.** Shared architecture established correspondence before the crosses were checked. The marks align with the mapped features in this overlap; a separate HUD comparison also supports map-relative anchoring locally. No physical or in-game distance unit, unique grid origin, citywide calibration or transform into the native Atlas map has been established.

**Source orientation clarified by Trev:** the in-game map stays fixed north-up and has no rotation control. This owner-reported constraint gives the source views a common north-up orientation. Any correction for camera tilt or perspective concerns the photographed image, not a turn of the in-game map. The earlier wording about “rotation” referred to photograph alignment and should have stated that distinction explicitly. This clarification concerns the source game; the separate Atlas Explorer controls are unchanged.

## Observation history

1. Trev initially reported five positive item/cross matches.
2. Trev increased his cumulative count to eight, including those five. He described finding an item first and checking its map position for an X, with no failures reported at that point.
3. Two further matches were reported in Trev's message. The phrase “kay just varified 2 more” does not unambiguously identify a second person; separate reporter identity and overlap with the earlier locations are unknown. This totals ten reported positive observations, without establishing ten uniquely identified or independently documented pickup coordinates. Earlier tracker wording attributing the two to a named second person is explicitly clarified in the append-only record.
4. Trev then reported many crosses with no ball present. The negative count and individual locations were not specified; a success rate cannot be calculated.
5. Trev accepted that crosses occur with and without items and proposed using their regular spacing as an alignment reference.
6. Trev clarified that the source game's map remains north-up and cannot rotate. Retain that common orientation when comparing map content; distinguish it from the camera angle of a screen photograph.

The grid interpretation is supported locally by the replay below, while the symbol's official purpose remains unknown. The earlier item finds remain reported observations. The later counterexamples rule out using a cross alone as automatic evidence of a present pickup.

Trev's earlier plan to capture exact photographs/video before collection is retained as a plan, not received evidence. No additional circle, photograph, video or repeat survey is required to record this correction. General YouTube/video feature work remains paused.

## Preserved sources

Eight original overview photographs are copied byte-for-byte under [the source folder](at343-owner-item-crosses/sources/), with exact hashes, dimensions, attachment correspondence and coverage in [the source inventory](at343-owner-item-crosses/source-inventory.json). They are eight map views, not eight documented item finds. They show substantial Vert, Rouge, Jaune and Magenta coverage and only a partial Wild Zone 5/Bleu edge.

| Original filename | Visible coverage |
|---|---|
| `20261126_141528.jpg` | Vert sectors 1-6; Vert Plaza / Wild Zone 2; Nouveau Cafe, Cafe Cyclone, Coulant Waterway and South Boulevard. Some peripheral labels and blocks are cropped. |
| `20261126_141757.jpg` | Southern Vert: sectors 4, 5, 7, 8 and 9; Hotel Z, Cafe Introversion, station front and Wild Zone 1. Pokemon Research Lab is partly visible at the lower edge. |
| `20261126_142840.jpg` | Northern Rouge: sectors 3-8; Dormez Bien Cemetery / Wild Zone 4, Looker Bureau, Sushi High Roller and North Boulevard. Rouge Plaza / Wild Zone 3 and Academie Etoile are partly visible below. |
| `20261126_143129.jpg` | Southern Rouge: sectors 1 and 2; Rouge Plaza / Wild Zone 3, Academie Etoile, Restaurant Le Wow and Hibernal Avenue. Peripheral buildings are cropped. |
| `20261126_144931.jpg` | Southern Jaune: sectors 1, 2, 3, 6 and 9-12; Jaune Plaza, Jaune Street, Saison Canal and Wild Zone 6. Vert sectors 1 and 3 are partly visible below. |
| `20261126_145412.jpg` | Northern Jaune: sectors 3, 4, 5, 7 and 8; Cafe Kizuna, Cafe Ultimo and North Boulevard. Jaune Plaza is partly visible below; in-game zone unlock state is not a geographic absence. |
| `20261126_151150.jpg` | Northern Magenta: sectors 4, 7, 8 and 9; Cafe Triste, Magenta Street, Saison Canal, Electrical Substation and Magenta Plaza. Rouge sectors 3 and 4 appear at the upper/right edge; some peripheral labels are cropped. |
| `20261126_151459.jpg` | Southern Magenta: sectors 2, 3, 5 and 6; the sector 1 label is partly obscured by a mission icon. Electrical Substation, Magenta Plaza, Cafe Gallant and Estival Avenue are visible; a partial Wild Zone 5 / Bleu district edge appears at lower right, without complete Bleu coverage. |

## Bounded alignment result

The [strict pilot result](at343-owner-item-crosses/grid-registration-pilot.json) and [portable replay script](at343-owner-item-crosses/grid-registration-pilot.py) use the original 4000-pixel-wide Vert photographs. Cross neighborhoods, the cursor, HUD and mapped labels were excluded from the architecture fit; the entire South Boulevard label strip was discarded. The fit used 197 candidate feature correspondences and 97 inliers at 82 distinct source feature coordinates. These are image features, not 97 independently named landmarks. Its RMS error is 1.732 original-photograph pixels.

The crosses below were checked only after fitting the shared architecture:

| Held-out cross | Inside the actual fitted-feature convex hull? | Projection error in original-photo pixels |
|---|---|---:|
| Vert Sector 5 roof | Yes | 3.565 |
| Canal | Yes | 4.284 |
| Eastern street | No; extrapolation diagnostic | 17.098 |
| South Boulevard edge | No; extrapolation diagnostic | 28.642 |

Only the first two are local holdout evidence. The larger errors outside the fitted area show why this transform cannot be extended across the entire photograph. Photograph perspective, lens/display distortion and limited fit coverage constrain what one transform can establish.

A separate local similarity fit of the unchanged bottom HUD predicts fixed-screen positions about 74 and 77 photo pixels from the observed crosses. This supports map-relative anchoring in the tested overlap, but it is not complete screen calibration. The earlier exploratory fit retained some street-label features and is superseded by this strict result.

The root replay reproduced the strict reviewed result exactly apart from run time and source filename prefixes. To replay with OpenCV and NumPy installed, run from the repository root:

```bash
python3 docs/qa/at343-owner-item-crosses/grid-registration-pilot.py \
  --output /tmp/at343-grid-replay.json
```

The script reads the archived originals and writes only the requested analysis result. No production code imports it. The recorded software versions are OpenCV 5.1.0 and NumPy 2.3.5.

**Practical use:** establish the correct buildings and roads first, retain their common north-up direction, then use nearby cross rows and spacing to check position, relative image scale and spacing. A tilted or angled screen photograph may need correction for camera tilt or perspective; the in-game map itself does not rotate, as Trev clarified. An unnumbered repeating pattern can be shifted by a whole cell and still appear to match, so it cannot identify the correct location on its own. Grid steps can describe relative spacing; metres, game distance, elevations and item locations remain unknown. Other regions and zoom levels were not tested.

## Preservation

The original 1920×1920 Atlas map stays unchanged. This intake supports bounded local feasibility only; production alignment and native coordinate promotion remain unapproved. Any future registration to the Atlas map requires its own building/road controls and independent checks.

The separate [tracker receipt](ATLAS_AT343_TRACKER_RECEIPT.json) records the guarded initial update, item-rule correction, alignment result, attribution clarification and fresh readbacks. All 48 rows remain; current planning is Manifest 92 / Ledger 100. GitHub statuses remain 17 verified / 15 in progress / 16 open, and all prior GitHub release proofs and Workspace fields are preserved. Only common planning revision/time metadata and appended notes in the existing AT332 item-coordinate row change.

The approved [Map2.0 runtime release](ATLAS_AT342_RELEASE_RECEIPT.json) remains merge223762bd1a21c2e72c592e975499d13c4195ae07 at Manifest91/Ledger99. Its receipt, hashed evidence and release-pinned Workspace prompt are unchanged. This source intake adds no gameplay behavior, collectible IDs, item coordinates, progress keys, schema change, Workspace publication or fixed Hyperspace marker.

[Structured report](ATLAS_AT343_OWNER_ITEM_CROSS_REPORT.json)
