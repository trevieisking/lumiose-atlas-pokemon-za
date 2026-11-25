# AT-329 — Owner city overview image intake

Three owner-provided captures in the current conversation. The original delivered bytes are WebP despite .jpg names. [Manifest](../../assets/atlas/city-overview/manifest.json) records source hashes, native crop boxes, genuine PNG dimensions, SHA-256 and Git blob SHA. No redraw, enhancement, synthesis, interpolation or color correction; output decoded pixels checked equal to the source crop. South removed 23 bezel rows; central removed 32 top rows. North already contains no visible television frame, so leave it unchanged. Keep blue map background and in-game UI where cropping it would discard city streets.

| Part | Dimensions | Held-out matches within 3 native px | Consistent-subset RMS | Median all held-out |
|---|---:|---:|---:|---:|
| south | 1536 × 842 | 51/71 | 1.603 px | 1.938 px |
| north | 1536 × 865 | 16/30 | 1.353 px | 2.2 px |
| central | 1536 × 833 | 40/72 | 1.468 px | 2.496 px |

[Numeric registration evidence](ATLAS_AT328_CITY_OVERVIEW_REGISTRATION.json) includes all held-out matches (even false correspondences), training inliers, homography matrices and adjacent-frame checks. Source pictures show early-game unlock state, useful architectural context with fewer markers. Later zone absence is not geographic absence. Compare original base, warped source and blend; the inspected preliminary overlays agree closely in map architecture, with differences from game state and camera perspective. Adjacent north/central and central/south overlaps support provisional registration; **reject the north/south direct automatic match**. Do not claim exact geographic accuracy from conditional RMS. No fabricated map, actual sector border, walking connection, fixed Hyperspace portal, official location label or production pin derived. No live UI reference added; base and original existing assets retained. Manual distinct architectural checkpoints still required. G1 AT-320 PR #156 untouched. Workspace A0 blocked.

### AT-329 — Overview evidence import identifier and merged-state reconciliation

The three exact cropped PNGs are merged in PR #173 at `e01c6c428a3b6f320cb94a7044eb5dfbd4e6d2f0` (reviewed head `85066dd7ad6a9cb4dab95bc6505538b18bb82f99`, identical tree `76fc2d1f3647748301dd9ebce727b26a921e1063`). Three source paths, byte counts and Git blob SHAs verified; all existing assets and site runtime unchanged. The import initially used AT-328; that identifier had already been reserved by the separately interrupted AT-320 route reconciliation session in the private tracker. Assign **AT-329** as the canonical overview-intake ID, retain the original AT328 evidence filenames for working links and immutable provenance, and leave the separate AT-328 route tracker and PR #156 intact. No production geometry approved. Manifest revision 72; ledger revision 80. Workspace handoff still blocked.
