# Wild Zone 13 selection-outline review

## Decision and scope

Approve the retained 29-vertex polygon for rendered map selection only. The owner closeup shows the curved north perimeter and all non-entrance bends; architecture registration places it in the unchanged native map. Root separately inspected the perimeter, registered-image and landmark panels and found no material issue. This packet does not establish physical walls, spawn coverage, routes, walkability, entrance access, complete encounters or full master-plan completion.

Three entrance symbols interrupt the source line. Orange connectors in the review panels explicitly close observed approaches for display. At the southeast entrance, a hidden corner remains unobserved: the chosen short diagonal is a display convention. A diagnostic intersection of the adjacent approach strokes would fall about 3.58 native pixels from that connector. That diagnostic point is not adopted geometry or evidence about the game. The 3 px tolerance applies to observed registration/raster picks, not a uniform guarantee for hidden edges.

## Registration and checks

The overview-to-native fit uses seven fixed architectural controls. A separate closeup-to-overview fit uses seven different architectural correspondences. Neither fits green perimeter vertices, gate symbols, badges or text. Their composition determines the candidate coordinates.

| Check set | Count | RMS native pixels | Maximum native pixels |
| --- | ---: | ---: | ---: |
| Overview fit | 7 | 0.7535 | 1.1567 |
| Overview architecture held out | 5 | 1.6977 | 2.5974 |
| Overview perimeter held out | 3 | 1.8242 | 2.5978 |
| Closeup fit, native-equivalent | 7 | 0.5442 | 0.9419 |
| Closeup architecture held out, native-equivalent | 4 | 1.0563 | 1.5792 |
| Closeup perimeter held out, native-equivalent | 5 | 0.8016 | 1.4787 |
| Direct native architecture targets | 4 | 1.2860 | 2.3724 |
| Direct native perimeter targets | 3 | 2.0439 | 2.5261 |
| All direct native targets | 7 | 1.6539 | 2.5261 |

Native-equivalent stage errors are transformed local residuals, not direct independent native validation. The direct-native architecture checks reuse source landmarks but use native target positions withheld from both fits. The three direct-native perimeter checks reuse overview border targets. These correlated groups are deliberately not added into a fictitious independent sample count. The record reports seven controls per stage and seven direct native checks, with full stage metrics alongside them.

## Retained failures and corrections

The raw descriptor candidate contains many false repeated-building/badge matches; its all-heldout median is 154.18 native pixels. It only helped locate comparison crops. Its transform and points were not adopted as registration.

The original manual plans, first observations and first fits remain unchanged. H5 was rejected before fitting because its native seam was not identifiable. B3 was rejected because a gate square hides the proposed southeast corner. CF1 was rejected because the provisional crop has no architectural seam. The original H3 native roof-corner pick was five pixels along a horizontal stroke; original-pixel grids identify the actual vertical/horizontal junction. The original B2/CB2 northwest picks followed the adjacent grey/brown wall rather than the green approach; exact pixel grids support the recorded green-line correction. The original composed northwest residual of 4.2134 px is retained. No fit or control was changed after these holdout corrections.

The first reproduction-script draft used weighted BT.601 luminance for north-curve sampling and correctly failed the frozen-sample assertion at x=1200. The original sampler uses unweighted RGB mean brightness. Restoring that exact calculation reproduces all 18 original samples; no trace point changed. This implementation replay issue is unrelated to calibration or approval thresholds.

## Reproduction

Run from an environment with Python, NumPy, SciPy and Pillow:

```sh
python docs/qa/candidates/wz13-2026-11-26/reproduce_review.py --repo /path/to/atlas
```

The script verifies all 48 frozen original source, observation, candidate and reviewed-panel hashes before it computes anything. It recomputes all residuals, reconstructs the north sampling, reprojects the unchanged candidate, checks bounds/topology, independently replays the original unrobust least-squares fits from their recorded initializers, and writes `selection-review-receipt.json` and `wz13-approved-record.json`. The replayed combined fit differs by less than 0.000001 native pixel at candidate vertices. Exact original first-fit matrices determine the output; the numerical replay does not replace them.

Original source bytes, failed attempts and reviewed image panels are immutable inputs. Generated JSON outputs are byte-for-byte deterministic. `model-gate-result.json` records a separate call to the unchanged runtime eligibility gate; it confirms that this prepared record is structurally eligible, not that the full plan or a live deployment is complete.

## Review entry points

- `source-perimeter-review.png`: original closeup, magenta observed trace and orange display closures.
- `registered-native-panel.png`, `registered-closeup-panel.png`, `registered-overview-panel.png`: mapped visible perimeter and native badge occlusion.
- `overview-landmarks-1.png` through `overview-landmarks-3.png`: original overview/native architecture and perimeter observations, including rejected points.
- `closeup-overview-landmarks-1.png` through `closeup-overview-landmarks-4.png`: the second stage and its held-out checks.
- `closeup_native-landmarks-1.png` and `closeup_native-landmarks-2.png`: direct native checks.
- `h3_native_grid.png`, `h3_source_grid.png` and `northwest_*_pixel_grid.png`: correction evidence.

The prepared approved record is an integration artifact only. Root owns canonical dataset insertion, counts/revisions, exact-head tests, consolidated PR review and merge.
