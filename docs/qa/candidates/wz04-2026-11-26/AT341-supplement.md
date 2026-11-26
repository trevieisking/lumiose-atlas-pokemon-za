# AT341 · WZ04 append-only evidence supplement

The earlier `independent-review.json` HOLD is preserved unchanged. This supplement supplies a newly checked southwest architectural holdout and makes the three existing connector interpretations concrete for a fresh independent decision. It does not approve or alter production geometry.

## New southwest check

The original WZ04 closeup exposes the southeast corner of the stepped roof immediately west of the cemetery. Its native counterpart is visible **left of the red cursor**, below the existing western controls. This is an identifiable building corner, unlike the previously rejected H4 pavement-edge point.

| Observation | Image pixel |
| --- | --- |
| Original closeup roof corner | (58.5, 669.5) |
| Native observed roof corner | (928.5, 349.5) |
| Projection using the unchanged original transform | (926.695, 349.409) |
| Native residual | 1.807 px |

The existing six fit controls and matrix are unchanged. Including this new withheld point gives four architectural holdouts with 1.646 px RMS and 1.813 px maximum error. The original five border checks remain unchanged (0.856 px RMS, 1.174 px maximum). The new point is not fitted and is not substituted for any earlier failed or rejected observation.

`AT341-southwest-holdout-review.png` shows the actual original pixels around both observations; cyan marks the manual observations and magenta the unchanged projection. All source hashes are checked against the prior packet by the reproducible supplement script.

## Three proposed rendered-selection closures

The original source shows the perimeter approaching each gate decoration on both sides. The same existing candidate connects the source-observed approach or inner-shoulder endpoints and excludes the decorative arrows/square extents. These are explicit modeled map-selection closures, consistent in purpose with the existing WZ11 gate interpretation; they do not claim a route, doorway, traversability or continuous physical barrier.

| Connector | Modeled span | Offset from straight outer-approach chord |
| --- | ---: | ---: |
| North | 18.923 native px | 0.036–0.064 px |
| South | 18.727 native px | 2.260–2.592 px inward |
| West | 18.296 native px | 2.977–3.190 px inward |

The western maximum is **3.190**, and must not be rounded down to claim that alternative outer- and inner-shoulder choices are equivalent within three pixels. The current candidate follows the small visible inset shoulders. Its three-pixel raster digitization tolerance is a measurement convention for that chosen rendered footprint, not proof that all alternative closures are within that distance. The independent reviewer must inspect the notch interpretation explicitly.

`AT341-gate-interpretation-review.png` presents unwarped original and native gate crops with the existing endpoints and modeled crossings. The prior registered owner-crop panels remain corroborating context; their larger registration residuals are not relabelled as precise boundary checks.

## Recommended next decision

Reconsider the unchanged candidate only for a rendered map-selection footprint, using the new southwest holdout and explicit per-gate review under the same contract as the existing accepted outlines. A new approval would be a new decision, not an edit that turns the historical HOLD into an approval. This supplement leaves independent approval false and does not alter G2/G3/G5/A0 or runtime data.

`AT341-candidate-geometry.json` simply expresses the prior projected vertices as a closed GeoJSON polygon. No vertex is moved. Run `python docs/qa/candidates/wz04-2026-11-26/AT341-supplement-reproduce.py` with NumPy and Pillow to recompute the additional check, connector spans, panels and receipt. The script writes only the new `AT341-` files in this directory.
