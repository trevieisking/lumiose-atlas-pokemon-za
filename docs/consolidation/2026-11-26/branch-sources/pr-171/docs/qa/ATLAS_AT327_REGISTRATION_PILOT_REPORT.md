# AT-327 — Exact owner photo recovery and two Wild Zone registration pilots

Date: 25 November 2026. Research only; G2 preliminary evidence under AT-325. Baseline `8b15a8b7afd8370291f90c846217d0aff2eef601`. No game/runtime change.

## Evidence recovery

Read-only draft PR #168 ran [45693109903](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45693109903), artifact 15059033948. Downloaded and materialized the exact original basemap, 42 sector crops, 40 Wild Zone PNGs and metadata. **All 82 actual PNG byte counts, SHA-256 hashes, Git blob hashes, decoded dimensions and image integrity matched the recorded source manifests.** The base map is unchanged 1920×1920, blob `b951a877aea400564b1c4c6495b0cd41247bd8ca`. Temporary evidence workflow closed unmerged. No private progress or data included. Old W01–W03 still not recovered; use existing available source imagery first.

## Registration method and results

Native-pixel review on original inputs. Source photo grids at original scale and 2× base crop grids were used to manually pick distributed common landmarks. Six non-collinear border/gate controls per photo were fitted with OpenCV 4.13.0 projective homography. Remaining manually picked landmarks held out for residual measurement. Independent overview and close-up fits inspected side by side against original crop and a 50/50 overlay. Full numeric data in [registration register](ATLAS_AT327_REGISTRATION_PILOTS.json). The supplied script reproduces the comparison panels from repo-owned originals; no additional third-party images or AI-generated map pixels. Source photo/projected raster landmarks remain approximate visual picks, not survey-grade measurements.

| Zone | Frame | Fit points | Held-out | Held-out RMS px | Max px |
|---|---|---:|---:|---:|---:|
| 5 | closeup | 6 | 8 | 1.364 | 2.41 |
| 5 | overview | 6 | 9 | 1.401 | 2.24 |
| 11 | closeup | 6 | 8 | 1.517 | 2.37 |
| 11 | overview | 6 | 8 | 1.8 | 2.65 |

All four comparisons visually inspected. The source architecture and visible green outlines match closely, despite different zoom levels, night/day colours, camera angle and fixed-size UI icons. Held-out residual is NOT a confidence bound on true sector or world coordinates: control and check landmarks are manually selected and predominantly on the same rendered perimeter/gates. Independent architectural checks and complete edge visibility remain necessary.

- **WZ5:** explicitly overlaps Bleu 1/2 and Bleu Street. The overview supplies the lower perimeter clipped in the close-up. Use both, not just a centre or circle.
- **WZ11:** includes both canal banks and water. The red session overlay near its southern edge must not become a boundary or permanent pin. Water coverage does not establish a walkable crossing.
- **Vert 1:** existing native crop labels Saison Canal and sector name; no actual numbered-sector outline is visible in that crop. Seek explicit boundary evidence rather than derive a boundary from a label.

## Reproducibility

The script [regenerate_at327_registration.py](regenerate_at327_registration.py) checks all recorded inputs and recomputes the projective matrices and held-out errors; can regenerate PNG comparison images into a temporary directory, not production assets. OpenCV and NumPy are analysis dependencies only; no site dependencies added. Comparison PNG hashes identify the specific original research session renders; different library versions can differ in raster encoding. None of these PNGs are claimed as hosted repo images.

## Gate and next steps

Four aligned photographs, two candidate areas, **zero approved polygons** and no new exact route pins. Preserve original saved centre, existing coordinates, all 42/40 photos, all sector and progress records. Continue actual perimeter tracing and independent checks, then build approved native-space overlay geometry. Exact-head AT-326 PR #167 validation is separate; do not promote incomplete G1 or final Workspace prompt. This standalone research checkpoint deliberately avoids touching the active PR's canonical plan files; reconcile into the plan/manifest/ledger after its validation, retaining all evidence.

## Follow-up: southern edge of Wild Zone 11

[The daylight Vert 6 check](ATLAS_AT327_WZ11_SOUTH_EDGE_CHECK.md) corroborates the visible southern green edge using an architecture-based fit independent of the earlier border/gate controls. Full perimeter and release gates remain open.
