# Atlas release geometry audit · 26 November 2026

## Decision

The reviewed candidate safely distinguishes original map photographs, approximate orientation, and approved rendered-map selection outlines. **It does not complete the full map master plan.** Five Wild Zone outlines are approved; all 48 sector outlines and the remaining 15 Wild Zone outlines still require the stated G2/G3 evidence. No comprehensive area roster is marked complete.

This audit authorizes no additional geometry or live publication. It records the data and rendering contract independently of the parent release's runtime/browser checks. The companion JSON identifies the audited source commit, exact source-byte checks, and reference URLs.

## What was verified

All 48 sector records in `atlas-explorer-data.json` have `xy: null`; none contains a polygon. Their 48 references resolve to 42 original photographs, and all 48 referenced SHA-256 values match the actual files. The five approved zone geometry records cite 12 unique original files; every cited SHA-256 matches. Approved selection outlines remain WZ02, WZ03, WZ05, WZ11 and WZ16.

`atlas-explorer.js` uses its 5×5 grid only to navigate portions of the city image. Button descriptions state image row/column, and district navigation states that it is an approximate starting view. These squares are not published sector boundaries. `atlas-area-model.mjs` rejects missing/unapproved evidence and requires the expected basemap, source hashes, review flags, calibration metadata and valid geometry. `atlas-area-ui.mjs` draws and hit-tests eligible geometry only. No runtime correction was necessary for sector polygon exposure.

The original basemap and owner screenshots were visually inspected. They show useful street, building and Wild Zone perimeter evidence. Sector labels or a nearby Wild Zone alone do not establish an entire numbered-sector border. The existing G3 requirement expressly distinguishes these layers.

## Why raw automatic alignment cannot close the remaining work

The preserved `wild_zone_registration_candidates.json` includes descriptor matches that are visibly or numerically false. For example, its unreviewed WZ04 overview trial has 12 fitted inliers but a 714-pixel median over all held-out candidates; its closeup trial has an 846-pixel held-out median and zero checks within three pixels. These values describe a rejected/candidate trial, not the later manual candidate. Low RMS for selected fitting points is insufficient to certify a boundary. The five existing approvals contain separate reviewed correspondence evidence and must not be conflated with the raw trials.

Current Bisafans and Serebii reference pages were checked for a route to complete sector evidence. They provide useful area and encounter leads, but this audit did not obtain a complete independently calibrated 48-sector polygon set. Serebii also explicitly warns that spawn points can represent spatial ranges and overlapping spawns. Such points cannot be repurposed as sector borders or exact pickup coordinates.

## Recovered WZ04 work

A separate prior worktree contains an untracked, reproducible WZ04 candidate packet at `docs/qa/candidates/wz04-2026-11-26`. Its six named architectural fit controls have 1.026-pixel RMS; three independent architectural checks have 1.588-pixel RMS; five border checks have 0.856-pixel RMS. The registered-source and landmark panels were inspected in this continuation.

The prior independent review remains **HOLD**. The three short crossings covered by green gate symbols are interpreted connectors, not observed continuous perimeter segments. A southwest architectural holdout is unavailable because the native interface obscures the relevant area. The candidate's closed topology is useful for review but does not settle those evidence gaps. Keep its recorded `approved: false` and `production_geometry: null`; it is not a sixth approved outline.

The packet can be retained with the consolidated research without editing production map data. It should be copied byte-for-byte from the recorded worktree rather than recreated or relabelled as approved. All failed trials and original photographs remain intact.

## Release implication and next work

The five-outline interaction release can be evaluated on its stated scope, test results and explicit uncertainty. Full master-plan completion and a prompt represented as the completed full upgrade remain blocked by 63 boundary reviews and the comprehensive encounter reviews. The required evidence has not been supplied by the existence of photographs, by passing UI tests, or by filling a JSON record.

Continue from retained material: named source correspondences and held-out landmarks, independently supported perimeter observations, separate ordinary/Alpha/quest encounter claims, documented unknowns and immutable source hashes. Additional supplied photographs are not automatically necessary; the existing collection should continue to be used first. No videos, generated geometry, copied third-party production map pixels, speculative floors or random Hyperspace pins are needed.
