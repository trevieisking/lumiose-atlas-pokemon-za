# Wild Zone 14 selection-outline review

## Decision and limits

Approve the 20-vertex polygon for rendered map selection only. Original source images support the curved west side, northeast bevel, southwest corner and southern tip. The northern entrance is one explicit display closure between observed green-line approaches. The closeup cursor crosses two short parts of the eastern perimeter; the line inside the cursor remains visible, and the retained overview exposes the corresponding span. The large native badge is not an outline source.

This packet does not establish physical walls, spawn coverage, routes, walkability, entrance access, comprehensive encounters or full master-plan completion. Three native pixels is the unchanged observed-landmark/raster digitization tolerance, not a uniform world-position confidence interval or guarantee for hidden physical edges.

## Calibration

Seven manually identified architectural correspondences determine the closeup-to-native homography. Five architectural and four perimeter observations were held out before fitting. No perimeter vertex, gate square, arrow, badge, cursor or text was fitted. The four-corner context transform merely located comparison crops and was discarded as calibration; all native targets came from actual image features.

| Check set | Count | RMS native pixels | Maximum native pixels |
| --- | ---: | ---: | ---: |
| Architecture fit | 7 | 0.7730 | 1.1271 |
| Architecture held out | 5 | 1.6941 | 2.4581 |
| Perimeter held out | 4 | 1.2873 | 1.7495 |

All controls and holdouts remain in the final metrics. The first-fit failure H2 is retained: its original native pick `[180,754]` lies in the light green gap west of the intended large roof, giving 4.8553 px error. Original-pixel inspection identifies the roof junction at `[184.5,752.5]`; the corrected observation gives 1.0395 px with the unchanged first-fit matrix. Root independently checked the matching source/native image pair and accepted this feature-identity correction. No control, source point or matrix was changed after fitting.

The provisional plans and first inaccurate stroke picks were refined before fitting and remain as historical evidence. All six raw indirect descriptor candidates are preserved and remain unapproved; they supply context only. The west curve uses nine fixed-y samples of the actual dark green stroke and does not impose a straight quadrilateral or an ideal arc.

## Reproduction

```sh
python docs/qa/candidates/wz14-2026-11-26/reproduce_review.py --repo /path/to/atlas
```

The script requires Python, NumPy, SciPy and Pillow. It verifies every frozen source/input/panel hash, recomputes residuals, independently replays the original seven-control unrobust least-squares fit from its original initializer, reconstructs the nine west-curve samples, projects the unchanged candidate, checks bounds/topology and produces `selection-review-receipt.json` plus `wz14-approved-record.json`. Exact original fit coefficients determine the approved record; replay does not replace them. Original sources, first picks/fit, correction evidence and reviewed panels are immutable inputs. Generated JSON files are byte-for-byte deterministic.

`model-gate-result.json` records eligibility under the unchanged runtime geometry gate. It does not approve a live deployment or establish full master-plan completion. Root owns canonical integration, counts/revisions, exact-head tests and consolidated PR review/merge.

## Review entry points

- `source-perimeter-review.png`: closeup with magenta observed trace and orange north gate display closure.
- `registered-native-panel.png`, `registered-closeup-panel.png`: native alignment, badge occlusion and source geometry.
- `overview-east-line.png`: original overview corroboration of the closeup cursor crossings.
- `landmark-review-1.png` through `landmark-review-4.png`: all fitted and heldout source/native observations, cyan original-pixel pick and magenta unchanged projection.
- `h2-matching-source-pair.png`, `h2-native-pixel-grid.png`, `h2-source-pixel-grid.png`: actual corner identity supporting the sole post-fit holdout correction.
- `first-fit.json`, `manual-first-picks-before-fit.json`, `manual-observations.json`, `h2-feature-correction.json`, `h2-correction-result.json`: complete retained sequence, including failure and unchanged calibration.

Original image bytes, existing approximate marker center, rosters and player data are unchanged.
