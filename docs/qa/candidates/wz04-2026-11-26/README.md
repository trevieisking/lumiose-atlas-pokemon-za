# WZ04 manual outline candidate — production hold

This directory prepares a possible next Atlas boundary batch. It is **not a production geometry change or an approval**. It was prepared in a separate detached worktree from commit `ace2f504619b7a271e3ecb5d75d3ba565fe6052d`; PR202 remains scoped to its existing five reviewed areas.

## What the existing photographs support

The original WZ04 closeup shows all four outer corners and the west/south gate shoulders. Its cursor is inside the zone, so it exposes the west edge and southwest corner hidden by the cursor in the native map. The already retained owner photographs `1000028696.jpg` and `1000028700.jpg` independently show the same rectangular region and gate positions. No new photograph or generated imagery was needed.

Six manually named architectural corners register the closeup to the 1920×1920 native map. The border is excluded from this fit. Three additional architectural corners and five border features are checked without fitting them. `landmark-review.png` shows every pair, the manually selected native position, and the projected position. H4 is deliberately retained as a rejected attempt: a low residual does not make an arbitrary point along a straight edge a reliable landmark. Two initial south-gate native picks were corrected from enlarged original pixels; their first-pass coordinates and residuals remain in the JSON. No fitted control or transform was adjusted after those checks.

The two PR200 views use the retained screening procedure: affine fitting and holdout points exclude the entire target crop plus a 48-pixel margin. Their patch-based registrations are useful contextual corroboration, with substantially larger residuals than the manual closeup registration. They do not determine or refine the candidate polygon, and they are not presented as newly identified manual landmarks.

## Files to review

- `manual-observations.json`: named control/holdout picks, source perimeter observations, correction/rejection history and occlusions.
- `candidate-evidence.json`: derived transform, residuals, all source hashes, 14-vertex candidate, topology check, PR200 corroboration and review-artifact hashes.
- `landmark-review.png`: all 15 attempted point pairs; cyan is the manually picked location and magenta is its projection.
- `registered-source-review.png`: native map, registered original closeup and both existing owner overview views with the same candidate overlay.
- `original-closeup-review.png`: full original closeup with source trace and labelled controls/checks.
- `reproduce.py`: rebuilds these derived files from unchanged original image bytes and fixed observations. Requires Pillow, NumPy and OpenCV.

## Unresolved items for the independent reviewer

The three short crossings under the green north, west and south gate symbols are **unresolved interpretations**, shown as dashed orange connectors. Visible line approaches/shoulders are recorded separately. The connector does not imply a path, a traversable entrance, a physical wall or a spawn boundary. The review candidate is closed only so that its shape and topology can be inspected; a closed polygon does not turn covered pixels into observed evidence. If those limited symbol crossings are unacceptable for a map-selection outline, keep those spans unresolved and do not promote the polygon.

There is a 1.6–1.7 native-pixel disagreement at the two southeast fitting controls, and the manually picked architectural holdouts are sparse. No independent southwest architectural holdout is certified because the native UI obscures that area. Raster blur, manual feature choice and photograph perspective limit precision. Image residuals are not a geographic error bound, and no uniform uncertainty radius is certified. The original source review panel must be read together with the numeric receipt.

The existing failed auto-contour remains untouched in `docs/qa/ATLAS_EARLY_ZONE_OUTLINE_SCREENING.{json,md}` and `docs/qa/atlas-early-zone-outline-screening.jpg`. That contour followed the native cursor/badge region and disagreed strongly with both owner views. Raw failed descriptor matches remain in `docs/qa/at339-geometry/wild_zone_registration_candidates.json`. None were silently relabelled as successful evidence.

Any later approval must remain limited to the **rendered map-selection outline**. This candidate supports no exact spawn, route, floor, walkability, encounter or physical-geography claim. Its independent review decision is currently null, `approved` is false, and `production_geometry` is null.

## Independent continuation review — 26 November 2026

The subsequent [independent review](independent-review.json) inspected all three panels, verified all ten cited source hashes and three panel hashes, and recomputed the recorded fit/holdout residuals by independently reprojecting the fixed observations. The visible footprint and registration are useful, but the three covered gate-symbol crossings remain interpretations. **Hold the closed production polygon; retain the observed segments and reproducible candidate.** This does not add a sixth approved outline to AT339. The generated candidate receipt above retains its original unapproved snapshot and null approval decision; the separate review records the later decision without rewriting it.

## Reproduce

From a Python environment with the dependencies installed:

```bash
python docs/qa/candidates/wz04-2026-11-26/reproduce.py
```

The reproduction script writes only within this candidate directory. Source photographs, native map, previous rejected evidence, runtime geometry and approval receipts are unchanged.
