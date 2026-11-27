# AT-348 — One remaining-guide completion pull request

<!-- AT348_VERT4_SCREW_INTAKE_111_119 -->
## AT-348 Vert Sector 4 field intake (Manifest 111 / Ledger 119)

[PR #226](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/226) adds [field find 42](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/cd24fc4f6a047ae819af025cfe08fc70391bfb5a/collectible-fieldbook.html#vert-4-colorful-screw-courtyard-scaffold). The pickup photo confirms **Colorful Screw ×1** on a short scaffold platform inside Vert Sector 4's grassy courtyard northeast of Café Classe. The five new photos match the originals byte for byte, bringing the archive to 42 finds, including seven photographed Screws, one access survey and 211 photos. The static check and 14 focused collectible tests passed. The photos support the AR-V04-05 courtyard scaffold lead. The climbing route, canonical checklist match and calibrated Atlas coordinates remain pending.

The [article](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46078879451) and [Explorer](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46078879457) workflows passed on the prior PR #229 head with the WZ15 test correction. The WZ17 close-up comparison, phone and desktop screenshot review, and A3 integration are still tracked in [PR #229](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/229). Workspace v40 is the last recorded live release.
<!-- END_AT348_VERT4_SCREW_INTAKE_111_119 -->

## AT-348 A1-02 browser assertion reconciliation — Manifest 110 / Ledger 118

Reviewed parent `4e7c90049ecb5c9b81937ed82143399f3933257c`. Prior job 140751485123 failed at shared-area browser line 507: actual verified WZ15 original JPG versus obsolete expected preview PNG. The shared-area test now uses the existing wildZoneFullPhotoPath mapping, retains the independent preview src assertion and decodes restored originals at 4000×2252. Existing independent hash/mapping tests retained. No runtime or image changes. Exact new-head CI pending; WZ17 close-up exact-frame comparison and independent phone/desktop screenshot review remain open. Field intake 41 finds / 206 photos remains on PR226. Workspace v40 last recorded; HOLD, no publication. Private tracker sync pending separate readback. Next: review exact-head CI, verify WZ17 close-up, then A1-03 and A3.

<!-- AT348_COLORFUL_SCREW_INTAKE_109_117 -->
## AT-348 field intake checkpoint (Manifest 109 / Ledger 117)

[PR #226](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/226) records [field find 41](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/d9337c6d79bb1d221b854b45ea5914e76b736bd5/collectible-fieldbook.html#hotel-z-colorful-screw-scaffold), a Colorful Screw on the upper scaffold in the grassy courtyard northwest of Hotel Z. The final photograph confirms **Colorful Screw ×1**. The archive now contains 41 collectible finds, including six photographed Screws, plus one access survey and 206 photographs. The five original images match byte for byte. The static check and 14 focused collectible tests passed. The [map and pickup evidence](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/d9337c6d79bb1d221b854b45ea5914e76b736bd5/docs/field-guides/collectible-locations.md#colorful-screw--scaffold-northwest-of-hotel-z) supports the existing AR-V05-01 scaffold lead. Atlas coordinates, the canonical checklist ID and the exact climbing sequence remain pending.

PR #226 stays open for intake. The field evidence awaits A3 integration review in [PR #229](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/229). Workspace v40 remains the last recorded live release. The earlier A1-02 Wild Zone 15 browser assertion and Wild Zone 17 close-up checks remain open. Carry these checks forward from the [prior planning checkpoint](https://github.com/trevieisking/lumiose-atlas-pokemon-za/commit/4977ccefd2b53ef7f813c021d503a98a728444e2).
<!-- END_AT348_COLORFUL_SCREW_INTAKE_109_117 -->

<!-- AT348_HEADBUTT_INTAKE_108_116 -->
## AT-348 field intake checkpoint — Manifest 108 / Ledger 116

**Field intake.** [PR #226](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/226) now holds 40 collectible finds, one access survey and 201 original photographs. [TM001 Headbutt](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/c1ef6d1b6ad9b3c87198b15a137a766e6605628e/docs/field-guides/collectible-locations.md#headbutt--vert-sector-5-canal-side-walkway) is find 40, behind two boulders on the Vert Sector 5 canal-side walkway. The final image confirms Headbutt ×1. All five new images match the originals byte for byte, all 201 image paths reconcile across the [register](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/c1ef6d1b6ad9b3c87198b15a137a766e6605628e/docs/field-guides/collectible-photo-register.json), guide and fieldbook, and the static check and 16 focused tests passed. [Explorer](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46077614149) and [article](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46077614239) runs started for the updated field head. A3 integration, visible review, exact map calibration and checklist matching remain open.

**Release status.** The [original Workspace site](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site) reports v40. PR #229 remains draft. Its A1-02 source `f4609b9733b685b1a5e9fa7b5a2cfe80a1506e9e` passed the article workflow, but [Explorer shared-area browser validation](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46072181253/job/140751485123) failed because the test expected the reduced WZ15 PNG where the restored original JPG is now linked. Reconcile the A1-02 shared-area browser assertion for the WZ15 original JPG link and rerun exact-head validation. Verify the unresolved WZ17 close-up and review the saved mobile and desktop evidence before the remaining A1 and A3 slices. The Headbutt evidence remains on PR #226 until A3 review.
<!-- END_AT348_HEADBUTT_INTAKE_108_116 -->

## Current A1-02 continuation — Manifest 107 / Ledger 115

**27 November 2026 — Manifest 107 / Ledger 115.** [A1-02 exact source and link evidence](AT348_A1_02_WILD_ZONE_ORIGINAL_LINKS.md). Main remains `bdfce92bfa7324517d0a1e2f8db7eec84983eefb`; PR229 reviewed parent `fc5142b6ad7e7bca4ad3483df8cfeec37fc3ea17` passed exact Explorer workflow [46066870386](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46066870386) (unit, real Chromium desktop/phone emulation and shared-area browser jobs) and article workflow [46066870511](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46066870511). A1-01 ten-photo gallery automated assertions passed; independent review of saved gallery screenshots remains open. All eight supplied original JPEGs match archived SHA-256, size and Git blob SHA. Visually matched the exact reduced WZ15 and WZ17 overview PNGs against their 4000×2252 originals (165929 and 170158); candidate changes only the two full-size links and uses the same original blobs under runtime asset paths, preserving every existing preview and record. WZ17 close-up original 170238 is independently identified as the correct zone/detail, but exact reduced-blob visual retrieval failed; do not replace that link yet. New unit/browser checks cover unchanged thumbnails, exact original bytes, decoded dimensions and four surfaces. New-head checks and independent visual review pending. Preserve all photos, IDs, geometry, progress and feedback/Supabase contracts. Workspace v40 last recorded, v39 rollback; persisted draft and live v41 not verified. Private tracker row read at revision 104; scoped sync after GitHub readback. HOLD; no new PR or publication. Next: A1-02: verify the exact reduced WZ17 close-up against 20261125_170238.jpg; review A1-01 and A1-02 saved phone/desktop screenshots and exact new-head tests; then A1-03 whole-guide imagery and A3 access evidence.

Reconcile the persisted Workspace draft; import only the approved merged changes not already present, after all gates. This is not the executable final handoff.

## Current A1 checkpoint — 106 / 114

[Gallery repair evidence](AT348_A1_01_HOLOVATOR_GALLERY_REPAIR.md): remove confirmed eight-photo cap, preserve all original gallery links and add exact ten-photo mobile/desktop regression. Parent tests passed; current candidate tests and visible QA pending. Continue A1-02 only after validation. No runtime change beyond the gallery loop/obsolete note. Preserve current published baseline and keep release HOLD.

## Current checkpoint — owner-directed development cycle (105 / 113)

Read [mandatory development cycle](AT348_DEVELOPMENT_CYCLE.md) and [whole-guide audit](AT348_WHOLE_GUIDE_AUDIT_2026-11-27.md) first. Both plans and the manifest/ledger/register must be read at prompt start and updated at stage end. The earlier plan below is retained as history where superseded: PR226 uploads are complete and its 196-photo draft is organised; integrate only the reviewed compatible package into PR229 after scoped validation (no separate release). PR229's reviewed parent passed both workflows; the next head requires new evidence. A1-01 gallery cap repair first, A1-02 full-resolution source matching next, then A3 (including field crosswalk), A2, A7, A4/A5, A6 and A8. No new PR; original Workspace publication only via one approved source-pinned cumulative prompt after GitHub gates. Keep current site and rollback protected.

Owner direction, 27 November 2026: bring remaining non-item guide work into one draft first, then repair and test each slice separately. Existing PR [#229](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/229) is the sole active integration candidate, based on approved PR224 merge `bdfce92bfa7324517d0a1e2f8db7eec84983eefb`. Last recorded original Site is v40; no v41 release established. This is not the end of development or a publication instruction.

## Consolidation and branch policy

- Keep PR [#226](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/226) open as ongoing owner-supplied exact item and Colorful Screw evidence intake. Do not merge its incomplete uploads, guess coordinates or modify its branch. Integrate only a separately validated final field-evidence package if later requested.
- PR [#227](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/227) exact candidate `4c68ff1bec5534190872b9227894bc6eed017170` is based on the same main. All 11 changed files are disjoint from PR229's five planning files. Transfer their exact blobs with no rewrites, including both mission surfaces and regression tests. Source head passed [article workflow](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46027544829) and [map workflow](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46027544803). These passes are not combined-head passes. Keep source PR227 unchanged and do not release separately. This narrowly supersedes the earlier recovery prompt's separate-PR227 implementation instruction; the prompt itself remains intact as historical Work resume evidence.
- Fresh listing found 27 open PRs: the 24 previously reviewed historical heads, all unchanged, plus #226, #227 and #229. Preserve the earlier [reconciliation](at346-dex-audit/CONSOLIDATED_PR_RECONCILIATION_2026-11-27.md). Included in substance: 203, 198, 197, 196, 195, 189, 187, 177, 172, 156, 3. Superseded: 97, 76, 59, 37. Research/receipts/deferred: 186, 184, 171, 166, 149, 2, 1. Actual old implementation adaptations outstanding: #4 and #5. Never replay stale branches wholesale or close them merely because they were inventoried.
- One small commit per independently reviewed slice, scoped regression tests and readback before next slice. No whole-site rewrite. Any overlapping change requires a fresh baseline comparison; preserve concurrent owner work. Final promotion is HOLD until exact integrated validation. Keep original live Site, v40 backup/rollback, all assets, map IDs/coordinates and controls, progress and feedback/Supabase connections. No Code Labs protected Writer or other prohibited workflow, paid services, public videos, DNS changes or dynamic permanent pins.

## Ordered work register

| Slice | Work | Initial state | Source |
|---|---|---|---|
| A0 | Single candidate and interrupted-session recovery | in_progress | PR229; #228; AT348_WORKSPACE_RESUME_PROMPT.md |
| A1 | Photo restoration | open | AT-348 / #228 |
| A2 | Pokédex encounter and form coverage | open | AT-346 / #220 |
| A3 | Maps and written access | open | AT-299/300/321/322/323/324/327/331 |
| A4 | Fashion, beauty, treasure | open | AT-330 |
| A5 | City Life services and challenges | candidate_partial | AT-347 / #225; PR227 |
| A6 | Unified completion and progress safeguards | open | AT-347-COMPLETE-001; historical PR4/5 |
| A7 | Full-guide factual and coverage QA | open | historical PR1; AT-346/347 |
| A8 | Exact final validation and single Workspace handoff | open | AT-325/297, #229 |

### A0 — Single candidate and interrupted-session recovery

Retain existing Work draft; record source/checkpoints; do not restart or claim publication.

### A1 — Photo restoration

Inspect current source and published asset boundaries; identify exact three Wild Zone originals and two gallery-hidden Holovator entries, remove unjustified cap only where confirmed; verify all eight hashes, visible image links, gallery on phone/desktop, no image deletion or guessed mapping.

### A2 — Pokédex encounter and form coverage

Retain 232+132 roster, 202 capture bands and 364 HOME IDs; resolve the 115 unindexed Alpha species with source-qualified availability, alternative encounters, regional forms, conditions, evolution/learnset/stat gaps, and verified habitat links. No permanent random distortion pins.

### A3 — Maps and written access

Retain 48 sector and 20 zone selection views; finish missing evidence-supported access/roof/ladder/scaffold/lift directions, boundaries only where validated. No guessed coordinate or floor claims.

### A4 — Fashion, beauty, treasure

Complete boutique inventories/prices/unlocks, available hairstyle/colour/contact swatches, treasure sale values and budgets. Preserve calculators and type chart.

### A5 — City Life services and challenges

PR227 exact non-overlapping blobs incorporated into PR229: researched 27-fight Rush order, SM173 and SM144 corrections and Photo Mode controls. Prior PR227 map/article workflows passed; integrated head requires new tests. Continue unresolved menu/entrance/service conditions, per-track unlocks, repeat payouts, title criteria, training and optional mechanics. Do not re-add already present catalogues.

### A6 — Unified completion and progress safeguards

Build additive interactive completion view around stable existing IDs and progress keys. Review current same-origin storage and old #4 numbered verified pin/#5 backup candidates; adapt only applicable pieces, preview/merge imports, preserve unknown keys and rollback. No fabricated pins or destructive resets. Item-photo intake excluded from this implementation.

### A7 — Full-guide factual and coverage QA

Recheck story/side missions, DLC, forms, all guide pages, old omissions and links against verified current sources; record remaining gaps rather than invent. Keep deferred video/YouTube and hosting/DNS excluded.

### A8 — Exact final validation and single Workspace handoff

Run exact-head required workflows, local static/build and unit tests, real browser phone/desktop visual/touch checks, asset and storage preservation, release tree check and verified Pages. Reconfirm current Workspace draft and v40 baseline, use recovery prompt as resume pointer, one source-pinned compatible release only after GitHub gates; backup and independent same-Site validation/live readback. Keep rollback.

## Acceptance and evidence

The machine-readable [register](AT348_CONSOLIDATED_COMPLETION_REGISTER.json) retains the exact historical heads, incoming file set, per-slice criteria and separate release gates. The [interrupted Work continuation prompt](AT348_WORKSPACE_RESUME_PROMPT.md) is the checkpoint to resume the existing Workspace draft, not a blank rebuild. Reconcile actual persisted changes and later merged GitHub source before spending any credits or duplicating work. The previous 67 requirements, 21 AT-347 gaps and seven supplements, and all AT-346 source qualifications remain binding; their older candidate statuses do not mean all features are missing or all work is complete.

Do not manufacture a completion percentage from tracker states. A slice can be implemented yet remain pending independent acceptance. Record exactly what passed and what remains open. No verified status without exact proof. The existing private checklist is append-only in scope for this intake: add a dedicated AT348 recovery/consolidation record only after successful GitHub readback, never rewrite earlier acceptance or publication receipts.
