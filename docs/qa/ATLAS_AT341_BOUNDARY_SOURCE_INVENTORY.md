# AT341 · Boundary source inventory

This is an immutable evidence snapshot of PR204 at `e003f5ffa8629c7a9c52da1bbd7bd78b9103354d`, with the two new candidate packets identified for independent review. It is **not the canonical current release gate**: the parent release records subsequent WZ04/WZ20 decisions separately. No image, pin, route, progress, encounter or runtime record is changed by this inventory.

All 48 sector references resolve to 42 original images and match their recorded hashes. All 40 Wild Zone overview/closeup images match the preserved registration-trial hashes. All eight owner crops match their manifest. The full JSON includes dimensions, SHA-256 values, visible labels, written bearings where available, prior trial diagnostics and next actions for every area.

At the baseline, five zone selection outlines are approved; 48 sector and 15 zone boundaries remain unresolved. WZ04 has a new southwest landmark and explicit connector supplement; WZ20 has a new reproducible circular-selection candidate. Approving one would leave 62 unresolved boundaries; approving both would leave 61. These are conditional counts, not approvals.

## Wild Zones

| Area | Exact source pair under assets/atlas/wild-zones | Boundary evidence and next step |
| --- | --- | --- |
| Wild Zone 01 | `wild-zone-01-overview.png` / `wild-zone-01-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. Preserve earlier owner-crop screening and failures. |
| Wild Zone 02 | `wild-zone-02-overview.png` / `wild-zone-02-closeup.png` | Existing AT339 selection approval; preserve hashes and scope. |
| Wild Zone 03 | `wild-zone-03-overview.png` / `wild-zone-03-closeup.png` | Existing AT339 selection approval; preserve hashes and scope. |
| Wild Zone 04 | `wild-zone-04-overview.png` / `wild-zone-04-closeup.png` | Historical HOLD preserved; review new SW1 architectural holdout and three explicit modeled connectors. |
| Wild Zone 05 | `wild-zone-05-overview.png` / `wild-zone-05-closeup.png` | Existing AT339 selection approval; preserve hashes and scope. |
| Wild Zone 06 | `wild-zone-06-overview.png` / `wild-zone-06-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. Preserve earlier owner-crop screening and failures. |
| Wild Zone 07 | `wild-zone-07-overview.png` / `wild-zone-07-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. Round-perimeter lead; red nightly Battle Zone is excluded. |
| Wild Zone 08 | `wild-zone-08-overview.png` / `wild-zone-08-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. Round-perimeter lead; red nightly Battle Zone is excluded. |
| Wild Zone 09 | `wild-zone-09-overview.png` / `wild-zone-09-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 10 | `wild-zone-10-overview.png` / `wild-zone-10-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 11 | `wild-zone-11-overview.png` / `wild-zone-11-closeup.png` | Existing AT339 selection approval; preserve hashes and scope. |
| Wild Zone 12 | `wild-zone-12-overview.png` / `wild-zone-12-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 13 | `wild-zone-13-overview.png` / `wild-zone-13-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 14 | `wild-zone-14-overview.png` / `wild-zone-14-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 15 | `wild-zone-15-overview.png` / `wild-zone-15-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 16 | `wild-zone-16-overview.png` / `wild-zone-16-closeup.png` | Existing AT339 selection approval; preserve hashes and scope. |
| Wild Zone 17 | `wild-zone-17-overview.png` / `wild-zone-17-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 18 | `wild-zone-18-overview.png` / `wild-zone-18-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 19 | `wild-zone-19-overview.png` / `wild-zone-19-closeup.png` | Both sources present; reviewed calibration, perimeter/occlusion trace and independent approval missing. |
| Wild Zone 20 | `wild-zone-20-overview.png` / `wild-zone-20-closeup.png` | New AT341 candidate; record independent source/calibration/perimeter/occlusion review. |

Raw automatic SIFT trials remain for all forty images. Many have low selected fit RMS despite large all-holdout errors. Those diagnostics are recorded as screening only, including for areas later approved by separate reviewed evidence; do not reuse raw trials as approval records.

## Numbered sectors

Every sector has an exact original crop and named context. None of the 48 native sector coordinates or label coordinates is populated at the baseline. Thirty-one sectors also have written street bearings; seventeen rely on their original crop/visible labels without a separate bearing text. No crop is treated as a whole enclosing perimeter.

| Area | Exact original source crop | Gap |
| --- | --- | --- |
| Vert Sector 1 | `assets/atlas/sector-streets/vert/vert-1-saison-canal.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 2 | `assets/atlas/sector-streets/vert/vert-2-vernal-avenue.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 3 | `assets/atlas/sector-streets/vert/vert-sector-3.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 4 | `assets/atlas/sector-streets/vert/vert-4-5.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 5 | `assets/atlas/sector-streets/vert/vert-4-5.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 6 | `assets/atlas/sector-streets/vert/vert-sector-6.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 7 | `assets/atlas/sector-streets/vert/vert-sector-7.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 8 | `assets/atlas/sector-streets/vert/vert-sector-8.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Vert Sector 9 | `assets/atlas/sector-streets/vert/vert-sector-9.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 1 | `assets/atlas/sector-streets/bleu/bleu-sector-1-vernal-avenue.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 2 | `assets/atlas/sector-streets/bleu/bleu-sector-2-estival.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 3 | `assets/atlas/sector-streets/bleu/bleu-sector-3.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 4 | `assets/atlas/sector-streets/bleu/bleu-sector-4-estival.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 5 | `assets/atlas/sector-streets/bleu/bleu-5-7-aymlis-park.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 6 | `assets/atlas/sector-streets/bleu/bleu-sector-6-bleu-plaza.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 7 | `assets/atlas/sector-streets/bleu/bleu-5-7-aymlis-park.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 8 | `assets/atlas/sector-streets/bleu/bleu-sector-8.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 9 | `assets/atlas/sector-streets/bleu/bleu-sector-9.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Bleu Sector 10 | `assets/atlas/sector-streets/bleu/bleu-sector-10.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 1 | `assets/atlas/sector-streets/magenta/magenta-1-3-estival.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 2 | `assets/atlas/sector-streets/magenta/magenta-sector-2.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 3 | `assets/atlas/sector-streets/magenta/magenta-1-3-estival.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 4 | `assets/atlas/sector-streets/magenta/magenta-sector-4.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 5 | `assets/atlas/sector-streets/magenta/magenta-sector-5.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 6 | `assets/atlas/sector-streets/magenta/magenta-sector-6-south-boulevard.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 7 | `assets/atlas/sector-streets/magenta/magenta-sector-7.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 8 | `assets/atlas/sector-streets/magenta/magenta-sector-8.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Magenta Sector 9 | `assets/atlas/sector-streets/magenta/magenta-sector-9.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 1 | `assets/atlas/sector-streets/rouge/rouge-sector-1.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 2 | `assets/atlas/sector-streets/rouge/rouge-sector-2.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 3 | `assets/atlas/sector-streets/rouge/rouge-sector-3.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 4 | `assets/atlas/sector-streets/rouge/rouge-sector-4.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 5 | `assets/atlas/sector-streets/rouge/rouge-sector-5.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 6 | `assets/atlas/sector-streets/rouge/rouge-sector-6.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 7 | `assets/atlas/sector-streets/rouge/rouge-sector-7-north-boulevard.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Rouge Sector 8 | `assets/atlas/sector-streets/rouge/rouge-sector-8-hibernal.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 1 | `assets/atlas/sector-streets/jaune/jaune-sector-1-jaune-street.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 2 | `assets/atlas/sector-streets/jaune/jaune-sector-2.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 3 | `assets/atlas/sector-streets/jaune/jaune-sector-3-plaza.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 4 | `assets/atlas/sector-streets/jaune/jaune-sector-4.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 5 | `assets/atlas/sector-streets/jaune/jaune-sector-5.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 6 | `assets/atlas/sector-streets/jaune/jaune-sector-6.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 7 | `assets/atlas/sector-streets/jaune/jaune-sector-7-hibernal.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 8 | `assets/atlas/sector-streets/jaune/jaune-sector-8.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 9 | `assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 10 | `assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 11 | `assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png` | Native calibration/label unreviewed; complete perimeter missing. |
| Jaune Sector 12 | `assets/atlas/sector-streets/jaune/jaune-9-10-11-12.png` | Native calibration/label unreviewed; complete perimeter missing. |

A future orientation-only improvement can calibrate shared architecture, measure the original label and frame that vicinity. It needs distinct orientation-only model semantics before runtime use and cannot clear a sector-boundary gate. This continuation did not invent those coordinates.

## Owner originals and overview crops

The JSON inventories fourteen incoming owner JPEGs and eight retained owner crops. Their dimensions and hashes are compared without substituting files. Incoming originals are generally larger than retained variants, so differing hashes are expected; byte identity is not claimed. The early-game overview collection supports architecture and early unlocked zones but does not supply a complete numbered-sector perimeter layer.

## Resume and release implication

Use the source hashes and candidate paths in the JSON. Complete independent WZ04/WZ20 decisions first. For another zone, choose distributed architectural controls and independent holdouts, inspect original UI masking, trace observed rendered selection perimeter, retain failed trials and obtain independent review. For a numbered sector, first establish a source for its complete perimeter; label extents, nearby buildings, district rectangles and spawn points are insufficient.

G2/G3 remain partial and G5/A0 remain blocked for full mandatory geometry/encounter scope. The inventory does not weaken gates or assert that more photos are automatically required: use retained source pairs first.
