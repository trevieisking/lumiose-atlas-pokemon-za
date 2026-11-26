# AT-339 — Shared areas and Pokémon habitats

26 November 2026 · Manifest 85 · Ledger 93

## Candidate and recovery

The interrupted implementation was recovered from the previous working copy at main `ee87bd2234d394e2dbc4197eb26610e6367e352b`. Its staged tree was `dcf569207f24fc603b72150ed569da15b7e034ac`; that tree had not reached the remote branch. This continuation preserves the recovered work, completes four missing encounter-packet companion files, corrects selection and photo-lifecycle defects and clarifies the scope of the reviewed outlines.

The candidate is reconciled against PR200's merge `1f5ec84c240d7b5f256034316afb2759b6b6e9f3`. Its eight new owner crops, original evidence, final-plan handoff index and validation step remain intact. The workflow conflict was resolved by retaining both sets of source triggers and checks. Historical research retains its original baseline hashes.

**Status: candidate; exact-head browser validation, reviewed merge, deployment and live verification are pending.** This document does not approve the complete Map 2.0 release or the final Workspace prompt.

## Delivered behavior

- One immutable, read-only model preserves all **48 sector and 20 Wild Zone IDs** and all original approximate centres and photo references.
- Area/species search, district and encounter-class filters, clear selection, shareable links and Back/Forward restoration work across Explorer, standalone Maps, the sector map directory and the main guide map.
- Fieldbook species and matching Pokédex entries link to recorded habitats. Ordinary, fixed Alpha and rotating Alpha records remain separate; gifts, missions, bosses, disputes and unclassified leads cannot establish repeatable wild habitats.
- Reviewed map outlines are selectable and highlight the current area or supported habitats. They share the original native map transformation. Unreviewed geography remains in the directory without invented polygons.
- Existing routes, photographs, compass, rotation, pan, zoom and collectible selection keep their existing owners and IDs. Map search/filtering makes no player-progress writes.
- PR196's exact collectible-search fix is selectively integrated: displayed labels, accents, optional Screw numbers and exact Wild Zone matching are supported. This does not require merging the older branch wholesale.

## Evidence and limits

The [encounter packet](at339-encounters/ENCOUNTER_AUDIT.md) adds **283 attributed claims** to **272 preserved rows**, for **555 model rows**. Of the additions, 140 are owner-survey-correlated, 18 source-corroborated, 118 research leads and seven disputed. The model accepts 155 additional ordinary habitat rows; non-wild or uncertain classes stay distinct. All **68 comprehensive roster reviews remain incomplete**. Unknown conditions remain unknown.

The original Wild Zone 20 pool remains **15 ordinary species plus 67 rotating Alpha candidates**. All **38 original fixed Alpha rows**, including duplicate-name form/condition entries, are preserved. The original fieldbook records are deeply equal to the baseline source. All ten files named by the encounter SHA-256 manifest are included and hash-checked.

The [geometry receipt](ATLAS_AT339_GEOMETRY_EVIDENCE.json) supports **Wild Zones 2, 3, 5, 11 and 16** for selecting the green areas shown on the original game map. Independent review checked all five panels, 12 distinct original source-file hashes, the exact production-geometry digests and recomputed held-out residuals. WZ5's partly obscured southern shape was compared with its closeup; WZ11's canal outline was checked against its native trace and a separate daytime sector photograph, excluding the red nightly overlay.

These are **rendered map outlines**, not walking routes, exact spawn extents, interior floors or pickup positions. The panel, legend and selected-area copy state that limit. **15 Wild Zone outlines and all 48 sector boundaries remain open.** Failed fits, candidate registrations and rejected intermediate topology remain available in the evidence directory.

## Review findings corrected

1. Selecting a zone through shared search could leave its original standalone-map pin hidden by an older district/text filter. The original view now reveals an incompatible hidden selection while retaining compatible filters.
2. Explorer's new panel could select a different zone while its original detail and pressed marker remained on the previous one. Selection, clearing and history now reconcile both views through a recursion guard, preserving the independent route cursor, camera and collectible state.
3. The outline labels overstated scope without explaining the distinction from gameplay geometry. They now say reviewed map outlines, with the same limit visible for area and species selections.
4. Four source files listed in the encounter artifact manifest were missing from the recovered packet. Their exact original bytes have been included and all ten manifest hashes verified.
5. The first exact-head browser run exposed a source-photo timing defect: shared-controller initialization selected the same legacy sector again and replaced its already rendered detail panel. Unchanged selections now retain the original photo, open disclosures and focused links; the original directory rebuilds only when incompatible filters need adjustment. A deterministic phone/desktop regression delays the optional evidence response and asserts that the same loaded photo DOM node survives initialization and unchanged-area updates. The existing source-photo assertion remains unchanged, without retries.
6. Review of the fieldbook URL expectations exposed an initialization race across the original map controls. A reader could select or clear a location while the optional shared evidence was loading, then have the initial shared render restore an older URL selection. The original controls now retain that newer intent through initialization, and subsequent Back/Forward or hash navigation supersedes pending clicks. Standalone filtering also removes stale shared query parameters before the optional module is ready. Delayed-evidence browser regressions exercise these handovers while preserving original photos, routes, collection selection and progress.

## Validation and release contract

Local continuation checks passed: **78 focused Node checks**, offline static/link/asset validation and PR200's eight-crop evidence validator. The focused suite covers original collection IDs, map/photos, area/encounter classification, geometry rejection, link restoration and cross-page links. CUA preview inspection confirmed readable desktop search and Pidgey's two supported Wild Zone habitats with additional uncertain sector claims kept separately.

The GitHub workflow runs the existing Explorer, collectible and Wild Zone browser suites plus `tests/atlas_area_browser.mjs` on **393×852 phone and 1440×900 desktop**. The added regressions exercise both corrected selection failures, history, route/Screw selection coexistence, original saved-progress bytes, source failure fallback, touch pinch/rotation, boundary visibility and collectible click priority. Synthetic polygons/placements are confined to intercepted test responses and must never enter production JSON.

Initial candidate `ace2f504619b7a271e3ecb5d75d3ba565fe6052d` passed the unit/data job, recovered-guide checks, fashion browser checks and feedback-header checks. [Atlas run 45810040196](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45810040196) failed at the unchanged sector-photo scroll assertion before reaching the later browser suites. That failure is retained as evidence for finding 5; it is not release approval. The correction passed 56 targeted Node checks and syntax validation locally; the final reviewed head requires a new complete browser run.

The corrected head `502ecb2c1542ae7ad44ee9194ec278e4faa7d24b` then passed the complete original Explorer and collectible browser suites in [run 45811127565](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45811127565). The fieldbook test stopped at an obsolete exact-query expectation: shared zone selection correctly adds `area=wz-20` while preserving `source=atlas` and the original fragment. The test now verifies the combined URL contract, one-step Back/Forward, parameter removal when cleared, original filters and the exact shared URL. Runtime history behavior is unchanged by this test correction. Later browser suites now continue after an earlier test failure when Chrome setup succeeded, so one failure does not hide further evidence; every suite still fails the job on error.

PR201 merged during validation. The corrected run checked out merge preview `5642fd5749a9f202f7dd6f8d522f6bcc255fd77c`, tree `474e5105910b86f3cd540c802bd7a18dd95d5d05`, combining the reviewed feature head with main `d7021a7af3973f18d54d07634e29c23cc78b0560`. Its seven archival Markdown exclusions, Pages-build validator and phone/desktop smoke remain preserved. The final release must record its own current merge-preview and exact deployed tree.

After the startup-intent fixes across all four surfaces, the combined current-main tree again passed all **78 focused Node checks**, static/link validation and the eight-crop source validator. No source encounter or geometry records changed in those corrections. The final CI run must include the delayed-evidence cases and every original browser suite before promotion.

Before promotion: inspect the exact final commit's workflow results, browser proof and screenshots; resolve failures; recheck main and PR heads; merge with the expected reviewed SHA; verify its exact Pages deployment and live files/behavior. The release receipt will record these observations separately from this candidate report. No claim of physical-device or in-game verification follows from browser emulation.

## Preservation, rollback and next work

The candidate preserves 264 item IDs, 100 Screw IDs, 146 approximate leads, 26 written routes, all original maps/photos, menus, guide pages and existing progress behavior. There are **zero new production pickup positions** and no video/YouTube restoration, new dependency, account change, schema change, Edge Function change or feedback modification.

Rollback is a normal revert of the bounded feature merge to the compatible pre-feature runtime, preserving PR200 and later unrelated work. Retain baseline `1f5ec84c240d7b5f256034316afb2759b6b6e9f3`, the reviewed PR head/tree and release receipt; do not reset player storage or revert unrelated history.

G2/G3 remain partial; G5's full-scope approval and A0's final Workspace prompt remain unset. Continue the 63 unresolved boundaries and complete encounter/condition evidence using the existing source collection. The original Workspace site remains at its last observed version 37 until the separate complete-upgrade handoff and publication checks pass.
