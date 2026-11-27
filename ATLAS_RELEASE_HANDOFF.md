# Pokémon Atlas — consolidated release handoff

<!-- AT345_CONTEXTUAL_MAP_AND_AT330_SHOPS_PLANNING_98_106 -->
## AT-345 planning addendum — wider sector photographs + fashion Shops (Manifest 98 / Ledger 106)

**26 November 2026 — new owner request, not a released image replacement.** [AT-345 issue #217](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/217) · [Source and original-Workspace import specification](docs/qa/ATLAS_AT345_SECTOR_CONTEXT_PHOTOS_AND_SHOPS_2026-11-26.md).

The Jaune Sector 2 card currently displays a **310×175 px** close crop. For **all 48 sectors**, review the **26 byte-preserved original source JPEG photographs** and choose wider, north-up, **sector-centred contextual views** that retain adjoining streets, buildings, waterways, plazas and labelled neighbouring sectors. Record source SHA, bounds, visual quality, chosen best view and fallback separately per sector. Existing **42 small source crops**, source archives, registered map geometry, original coordinates, 20 Wild Zones, filters, photograph galleries, player progress, feedback and Supabase stay untouched until verified replacements pass exact-head tests and phone/desktop visual QA. Context photographs remain orientation evidence; they do not authorize exact item, Holovator, ladder, scaffold or permanent random Hyperspace pins. The prior AT-344 coverage register still labels best originals unselected; **no 48-view swap or live Website change is claimed by this planning addendum**.

**Already released on GitHub main, not yet verified on the original Workspace Site:** [AT-330 Shops PR #216](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/216), merged commit `0a460046187d029a08656f12168f87be4db20d15`, integrates the existing **41 boutiques/five arcades/five salons**, while retaining the original 18 shop groups/200 items, dedicated clothing/beauty pages and all calculators. The **next one-site Workspace package must include BOTH AT-345 wider photos (after visual verification) and the already-merged AT-330 Shops update**, with same-Site backup, comparison, test and rollback; no replacement Site or added paid services. Independently verify and update `atlas_internal.feature_checklist` rows `AT-345-SECTOR-CONTEXT-PHOTOS`, `AT-330-SHOPS-STYLE-HUB`, `AT-330-CLOTHING` and `AT-330-HAIR-BEAUTY` without changing historical release receipts or claiming original-Site publication before proof.

**Release separation:** Existing Map 2.0 cross-grid release **Manifest 97 / Ledger 105** and its sealed evidence remain current *verified runtime history*. Manifest 98 / Ledger 106 is a new **unshipped planning checkpoint** only; it does not supersede the approved original-Site prompt, CI SHA or release snapshot below.
<!-- END_AT345_CONTEXTUAL_MAP_AND_AT330_SHOPS_PLANNING_98_106 -->

<!-- AT345_WIDE_SOURCE_RUNTIME_CANDIDATE -->
### AT-345 implementation candidate — reuse existing source maps; no new photographs required

**Owner clarification confirmed in the AT-344 archive:** the 26 exact JPEG originals, 48 sector source associations, 40 original Wild Zone photographs, three city overviews, and existing smaller detail crops were already collected. The outstanding task is *presentation and verification*, not another capture campaign.

**GitHub branch** `feat/atlas-48-contextual-sector-views-20261126` from planning release `34746fe66956064500072a9ce5193808b49e52a2` now proposes **48 wider, north-up source contexts** across all five districts, using **10 byte-identical archived original photographs** reused as public asset Git blobs (not cropped/recompressed archive files). `atlas-sector-context.mjs` contains the 48 display-only original-frame focal positions, provenance and existing-source fallback; `atlas-area-ui.mjs` and the original 48-sector clue directory render wider neighbouring streets and a link to the complete image, with original cropped detail photos preserved. Original static maps, source hashes, 20 Wild Zone pairs, exact geometry, item and Screw IDs, player progress, filters and Supabase remain protected. This is a **candidate pending exact-head CI and phone/desktop screenshot proof**, not an already published runtime or independently upgraded Workspace Site.

[Implementation/provenance record](docs/qa/ATLAS_AT345_CONTEXTUAL_SECTOR_IMPLEMENTATION_2026-11-26.md) · [Original AT-344 survey](docs/qa/at344-sector-source-survey/sector-coverage.json) · [AT-345 requirement #217](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/217). Keep the GitHub source archive and all 42 older close-ups; the new context display is orientation-only, not exact pickup/roof/Holovator geometry. Any proof failure holds promotion.

**Joint Workspace + Shops gate:** existing **merged [AT-330 Shops PR #216](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/216)** already adds **41 clothing boutiques, five arcades and five salons**, preserving 18 original shop groups and 200 items. Import both verified GitHub improvements in one **scoped adaptation** of existing original Site `appgprj_6afda588d5948191b4143e40a1f9c291` only after the GitHub runtime passes gates; compare Workspace current source and keep its URL, progress, ratings, feedback, maps, accounts and existing Supabase. Neither AT-345 images nor AT-330 Shops are certified to be on the original Workspace Site yet. **Planning Manifest 98 / Ledger 106 and prior verified Manifest 97 / Ledger 105 stay unchanged pending runtime release proof.**
<!-- END_AT345_WIDE_SOURCE_RUNTIME_CANDIDATE -->



<!-- ATLAS_CROSS_GRID_CURRENT_97_105 -->
## Released cross grid and source archive (Manifest 97 / Ledger 105)

[Release receipt](docs/qa/atlas-cross-grid-release-2026-11-26/RELEASE_RECEIPT.json) · [Current checkpoint](docs/qa/atlas-cross-grid-release-2026-11-26/CHECKPOINT.json) · [Exact-release Workspace import prompt](docs/qa/atlas-cross-grid-release-2026-11-26/WORKSPACE_CROSS_GRID_RELEASE_PROMPT.md)

**[PR #212](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/212) is merged and verified.** Reviewed head `473068ac10b2025ec31f78144f0002c1bd63976d` and tree `eb53180daca2eeed013e1cef99b615b63e264894` were preserved in merge `9e27f81c89727274a25555bf190605afc870995f`. Required exact-head workflows, actual mobile/desktop screenshot review, [matching Pages deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45888982903) and live verification passed. The receipt records the actual device methods and evidence; emulation is not presented as physical-device testing.

The release adds the optional A1–R18 native-image grid with fractional references and copied links, repairs the high-zoom diagonal-camera constraint, and retains all 26 supplied JPEG originals. Existing maps, photos, marker/progress IDs, feedback and Supabase connections remain preserved. The grid is an Atlas convention; error statistics apply to measured crossings, and lower-edge extensions remain qualified. Sixty is an observation, not a verified feet/metres/step conversion. No new exact item/structure pins or permanent random Hyperspace markers are added.

The guarded 97 tracker synchronization and its 48 rows remain recorded separately. A separate guarded append of two release notes is verified in [the release-note receipt](docs/qa/atlas-cross-grid-release-2026-11-26/TRACKER_RELEASE_RECEIPT.json); all existing rows, business fields, statuses and prior notes remain preserved. The original Workspace Site is unchanged: the linked prompt is ready for a scoped import into the existing Site, with source comparison, backup/rollback and preview validation. All 67 historical requirements, earlier sealed prompts and broader unfinished duties remain intact. Rollback baseline: `3259de9a8d70d5851ae208fb812c4774cc59c2ec`. Earlier blocks below retain their dated scope. The candidate packet remains unchanged at `docs/qa/atlas-cross-grid-2026-11-26`; its planning state and previous current blocks are retained in `docs/qa/atlas-cross-grid-release-2026-11-26/CANDIDATE_STATE.json`.
<!-- END_ATLAS_CROSS_GRID_CURRENT_97_105 -->

<!-- AT343_VIDEO_CURRENT_PLANNING_95_103 -->
## Latest planning evidence — AT-343 video follow-up / Manifest 95 / Ledger 103

**26 November 2026: a new owner-supplied measurement video has been received.** Trev asks that the faint X marks be used to investigate a precise reference grid for rebuilding the maps. The original `1000028756.mp4`, original photographs and existing map assets are preserved; analysis uses separate frame extracts and derived evidence. [Current evidence report](docs/qa/ATLAS_AT343_VIDEO_GRID_FOLLOWUP_2026-11-26.md) · [Structured measurements and source identity](docs/qa/ATLAS_AT343_VIDEO_GRID_FOLLOWUP_2026-11-26.json).

**Current finding:** the earlier bounded Vert comparison, observed Wild Zone 20 video rows and independently reviewed local image registration support using the crosses as local reference checks. A waypoint value of **60** is visible around **20.9–21.0 seconds**. This is not a count of footsteps or a confirmed metres-per-cell measurement. Partly obscured waypoint-measurement endpoints prevent treating that value as proof of one exact grid interval. The new report controls any numerical image-registration claims; no universal exact-60 spacing, citywide calibration or developer-purpose claim is established.

**Reconstruction requirement:** preserve the common north-up source orientation, establish each location from its buildings and roads, then check nearby cross rows and spacing. Record original source dimensions, hashes, coordinate space, controls and independent checks for every measured transform. A numbered Atlas reference grid may be defined from validated image measurements, but that would be our coordinate convention. Source-image pixels, grid-relative references, native 1920×1920 Atlas pixels and in-game distance must remain distinct until their relationship is verified. The earlier cross-equals-present-item rule remains withdrawn; no item, structure or gameplay pin is approved by a cross alone.

**Evidence preservation:** the [original AT-343 report](docs/qa/ATLAS_AT343_OWNER_ITEM_CROSS_REPORT.md) retains its dated Vert experiment. Its strict pilot, replay script, eight-photo source inventory and earlier tracker receipt remain unchanged. The 92/100 summary below is historical: its statement that no further video had been received describes that earlier intake, not this follow-up.

**Planning reconciliation:** the inspected GitHub main baseline remains Manifest **92** / Ledger **100**, while the authenticated private tracker already records the separate **AT-344 source-collection checkpoint at 94/102**. This **95/103** follow-up preserves that existing note and work while adding the requested video evidence. It does not certify or replace the separate AT344 archive, claim that its complete source packet is merged into main, or modify the separate unmerged source-intake branch. The new tracker receipt verifies preservation of the earlier AT344 note and the existing business data.

**Tracker synchronization verified.** The [new tracker receipt](docs/qa/ATLAS_AT343_VIDEO_GRID_TRACKER_RECEIPT.json) records the guarded **94 → 95** update at **17:02:31.10883 UTC** and an independent fresh readback at **17:02:56.25398 UTC** on 26 November 2026. All **48 existing rows** are at Manifest **95**; status totals remain **17 verified, 15 in progress and 16 open**. Only shared `manifest_revision` / `updated_at` metadata and one appended AT332 note changed. The existing AT344 source-collection note, all earlier notes, GitHub status and release proofs, Workspace fields and unrelated business data are preserved. No rows were added or deleted.

**Release scope:** planning 95/103 adds research evidence and no production coordinate promotion, runtime change or new pin. The approved runtime remains `223762bd1a21c2e72c592e975499d13c4195ae07`, tree `0288e63d1d52fe5f95dc76e0c01631715310e54a`, at release Manifest 91 / Ledger 99. Its sealed release evidence, original requirements, player progress, release-pinned Workspace prompt and independent original-Workspace status are preserved. The supplied video is mapping evidence; public video/YouTube features remain paused.

<!-- END_AT343_VIDEO_CURRENT_PLANNING_95_103 -->

<!-- AT343_VIDEO_PRIOR_92_100_HISTORY -->
<details>
<summary>Historical research checkpoint — AT-343 / Manifest 92 / Ledger 100</summary>

The following is the preserved earlier intake, before the measurement video was supplied. The 95/103 follow-up above is the current research summary.

<!-- AT343_CURRENT_PLANNING_92_100 -->
## Latest planning evidence — AT-343 / Manifest 92 / Ledger 100

**Latest correction: the general cross-equals-item rule is unsupported and withdrawn.** Trev subsequently reported finding many crosses with no ball present; their number is unspecified. The marks’ game meaning, real/game units and global origin remain unconfirmed; the bounded relative-alignment result below does not restore an item-marker interpretation. No new pin, native coordinate, collectible identity or runtime behavior is approved by these observations.

**Bounded alignment result:** the strict pilot supports the marks as a **secondary map-relative alignment reference for one Vert photograph pair**, after shared architecture establishes correspondence. It retained **197 candidate feature correspondences, 97 inliers at 82 distinct source locations**—not 82 named landmarks—with **1.732 original-photograph-pixel RMS**. The roof and canal cross holdouts lie **inside the actual architecture-inlier convex hull**, with residuals of **3.565 and 4.284 photograph pixels**. Eastern checks lie outside that hull and are extrapolation diagnostics, with larger residuals of **17.098 and 28.642 pixels**. A separate local HUD comparison supports map-relative rather than fixed-screen anchoring only for this pair. [Strict pilot data](docs/qa/at343-owner-item-crosses/grid-registration-pilot.json) · [Portable replay script](docs/qa/at343-owner-item-crosses/grid-registration-pilot.py).

**Alignment limits:** this is bounded relative-photo feasibility, not production approval. Real/game units remain unknown, and the periodic lattice has whole-cell ambiguity. The original **1920×1920-pixel** map stays unchanged: there is no Atlas-native1920 transform, global/all-zoom calibration, item pin, or coordinate promotion. Production `alignment_approved` remains **false**; local feasibility is explicitly supported within the recorded bounds.

The earlier observations remain reported history: **Trev reported eight cumulative matches (five plus three), then two further matches were reported; the separate reporter identity and overlap of locations are unconfirmed**. The wording does not establish a second person named Kay or ten distinct verified positions. Items were often found first and then compared with an X. The earlier absence of reported failures is superseded by the later empty-cross report and never established a perfect success rate. Trev cannot currently circle an individual example and intends to provide before-pickup photos or video; no such new capture or verification is claimed here.

[Owner report and correction](docs/qa/ATLAS_AT343_OWNER_ITEM_CROSS_REPORT.json) · [Readable evidence note](docs/qa/ATLAS_AT343_OWNER_ITEM_CROSS_REPORT.md) · [Separate tracker execution/readback receipt](docs/qa/ATLAS_AT343_TRACKER_RECEIPT.json). The existing 48 private planning rows carry Manifest92 with unchanged GitHub status totals of **17 verified, 15 in progress and 16 open**. Prior GitHub release proofs and all Workspace fields remain preserved. The AT332 observation note was appended at **15:30:35.67812 UTC** and its counterreport at **15:31:43.772416 UTC** on 26 November2026; actual guarded readback evidence belongs to the separate tracker receipt, with no readback time inferred here.

**Planning revision92/Ledger100 is separate from the approved runtime release at Manifest91/Ledger99 below.** The approved merge remains `223762bd1a21c2e72c592e975499d13c4195ae07`, tree `0288e63d1d52fe5f95dc76e0c01631715310e54a`. Its release receipt, six hashed evidence/prompt files, G0–G5/A0 decisions and all67 original requirements remain unchanged. The existing release-pinned Workspace prompt is retained exactly; this research correction neither promotes new map placements nor alters its approved runtime. Original Workspace publication and broader guide/Alpha duties retain their existing status.

<!-- END_AT343_CURRENT_PLANNING_92_100 -->

</details>
<!-- END_AT343_VIDEO_PRIOR_92_100_HISTORY -->

<!-- AT342_CURRENT_91_99 -->
## Current release — AT-342 / Manifest 91 / Ledger 99

**26 November 2026: the finite Interactive Map 2.0 GitHub release is merged, deployed and live-verified.** [PR #204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204) reviewed head `f030c4ae3e33259105bf351885c386f6b53900d9` and tree `0288e63d1d52fe5f95dc76e0c01631715310e54a` merged as **`223762bd1a21c2e72c592e975499d13c4195ae07`**, with the same runtime tree. [The release receipt](docs/qa/ATLAS_AT342_RELEASE_RECEIPT.json) records the exact proof and rollback; earlier checkpoints below remain historical.

The release includes **48 sector footprints, 20 Wild Zone selection outlines, 68 finite encounter-source dispositions, 42 written routes and 217 steps**. The **748 attributed encounter claims plus 272 original records** retain source conditions, encounter classes, eight disputes and `not_comprehensive` roster status. The 97 written access leads retain their limits. Sector projections can overlap; zone outlines describe map selection rather than exact spawn areas, floor plans or traversable paths. No new exact pickup positions or exhaustive ladder/scaffold inventory is claimed.

**G0–G5 are verified for that finite scope.** All three exact-head workflows completed successfully: [Validate Atlas header feedback button](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45842781570) · [Validate recovered Atlas article pages](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45842781725) · [Validate rotatable Lumiose Atlas Explorer](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45842781652). [Actual phone/desktop screenshot review](docs/qa/ATLAS_AT342_SCREENSHOT_REVIEW.json), [exact-merge Pages deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45844017622), **35/35** [live-file byte matches](docs/qa/ATLAS_AT342_LIVE_FILE_PROOF.json), and [independent live-browser checks](docs/qa/ATLAS_AT342_LIVE_BROWSER_PROOF.json) are recorded. Browser emulation and documented live observations do not imply a physical-device or in-game survey.

The [guarded private tracker update and fresh readback](docs/qa/ATLAS_AT342_RELEASE_TRACKER_RECEIPT.json) retains all **48 rows** at Manifest **91**. All 48 receive only the shared `manifest_revision` and `updated_at` metadata changes; the six documented release rows additionally receive GitHub release fields and appended notes. Unrelated feature data and proof, previous notes and every original-Workspace field are preserved. The actual readback counts are **17 verified, 15 in progress and 16 open**. No player, public feedback or schema data is changed.

**A0 is ready:** use the [single release-pinned Workspace prompt](WORKSPACE_MAP2_RELEASE_PROMPT.md). **A1–A7 remain pending for the complete original-Site upgrade.** Target existing project `appgprj_6afda588d5948191b4143e40a1f9c291` and [its original URL](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site); last recorded source is **version 38**, `6f7808db2d3cfaa2bb660f381b13dbab452332ce`. Reconfirm actual source/access, backup/rollback and same-origin progress/Supabase compatibility; adapt only supported changes, preview/test, publish and verify independently. This GitHub release does not publish or establish parity with the original Site. The 24-file runtime inventory for this PR is release evidence, not a substitute for comparing all earlier GitHub improvements with the original source.

**Broader required work remains open:** the base-game/Mega Dimension guide audit, all-mission depth audit and comprehensive city/rooftop Alpha inventory. The [targeted Dratini disposition](docs/qa/ATLAS_AT342_CITY_ALPHA_DRATINI_REVIEW.md) is complete with its recorded limits; it does not certify the wider Alpha inventory. All **67 historical requirements** remain in [the requirement dispositions](docs/qa/ATLAS_AT342_REQUIREMENT_DISPOSITIONS.json). Videos and YouTube remain paused, and random Hyperspace distortions are never permanently marked.

**Rollback:** Revert PR204 merge 223762bd1a21c2e72c592e975499d13c4195ae07 through a reviewed branch/PR, rerun affected checks and verify Pages. Preserve pre-release main 7616af2a204e0a09328a5ec9f2b6a0415bf67309. No storage migration, database schema or original Workspace change is part of this GitHub release.

<!-- END_AT342_CURRENT_91_99 -->

<!-- AT342_HISTORICAL_90_98 -->
## Historical pre-release checkpoint — AT-342 / Manifest 90 / Ledger 98

**26 November 2026: the combined source review is recovered; release validation is pending.** Continue in the existing [PR #204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204). Preserve main `7616af2a204e0a09328a5ec9f2b6a0415bf67309`, the earlier PR head `b788abb87ef32cb210747da420d95780c4a22583`, and the recovered combined work. Earlier green workflows prove their own heads; the new candidate still requires its own checks.

Source review now covers **48 sector footprints and 20 Wild Zone selection outlines**. These have different meanings: overlapping sector projections and rendered zone-selection areas do not establish exact spawn extents, floor plans or traversable routes. Existing nine approved zone records are retained alongside eleven reviewed additions; source and hidden-gate qualifications remain visible.

All **68 encounter areas have a finite source-review disposition**: 45 named sector tables, three qualified links to related Wild Zones, and 20 zone standard-table comparisons. **748 attributed claims plus 272 original records give 1,020 records.** The eight disputes, single-source leads and unknown conditions remain labelled; roster status stays `not_comprehensive`. G3 accepts conditions where established and explicitly labelled disputes, without claiming an exhaustive all-class inventory. Written/photo access review covers all 68 areas, with **42 routes, 217 steps and 97 leads**. No complete physical structure inventory or new exact pickup positions are claimed.

[Recovery checkpoint](docs/qa/ATLAS_AT342_RESUME_CHECKPOINT.json) · [zone approval](docs/qa/ATLAS_AT341_UI_OUTLINE_APPROVAL.json) · [sector review](docs/qa/at341-independent-review-2026-11-26/sector-footprint-review.json) · [encounter dispositions](docs/qa/sector-wild-zone-crossrefs-2026-11-26/REVIEW.md) · [written approaches](docs/qa/access-continuation-2026-11-26/REVIEW.md).

**Current gates:** G2/G3 source review is complete for those defined scopes. G0's **48-row Manifest 90 private-tracker synchronization is verified**, executed at **14:06:06 UTC** and read back at **14:06:43 UTC** on 26 November 2026; [the tracker receipt](docs/qa/ATLAS_AT342_TRACKER_RECEIPT.json) records the guarded update. All previous notes, GitHub statuses/proofs and Workspace fields were preserved; the counts remain 11 verified, 21 in progress and 16 open. This metadata receipt is not release proof. G1 preserves the released baseline and combined work. G4 awaits final mobile/desktop browser validation. G5 still requires current-head CI, actual screenshot review, expected-head merge, exact Pages deployment and live checks. **A0 remains blocked** until that release proof exists; the approved full-upgrade SHA and executable Workspace prompt remain unset.

The original Workspace was last recorded at **version 38**, source `6f7808db2d3cfaa2bb660f381b13dbab452332ce`, after its separate filter/photo repair. This continuation makes no Workspace publication or parity claim. Preserve the 67 requirements, original maps/photos/IDs, progress, accounts, Supabase and feedback. Videos and YouTube remain paused. Optional unknown pickups, exhaustive access inventories and unrelated backlog do not add new release gates.

**Completion boundary:** the wider base-game/Mega Dimension guide audit (`CHAT-FULL-GUIDE`), mission-depth audit (`CHAT-WALKTHROUGH-DEPTH`) and broader city/roof Alpha route inventory (`CHAT-CITY-ALPHAS`) are **not certified complete** and remain required broader obligations, separate from the finite map-release assessment. The [targeted Alpha Dratini review](docs/qa/ATLAS_AT342_CITY_ALPHA_DRATINI_REVIEW.md) is complete with labelled limits; the broader `CHAT-CITY-ALPHAS` obligation remains **open**. A later map release must not be described as completion of all 67 historical requirements. See the [current requirement dispositions](docs/qa/ATLAS_AT342_REQUIREMENT_DISPOSITIONS.json).

<!-- END_AT342_HISTORICAL_90_98 -->

## Historical progress snapshots and retained requirements

The following entries preserve their original dates, counts and evidence. Their requirements remain in force; superseded progress and availability statements describe their recorded checkpoint, not the current candidate. The AT-342 section above controls the current source scope and pending release work.

**Historical continuation: AT341 · Manifest89 / Ledger97 (26 November 2026).** Latest main `7616af2a204e0a09328a5ec9f2b6a0415bf67309` (PR205) and its verified release/tracker receipts are retained. PR204 carries seven reviewed selection outlines,284 additive encounter claims and the Mission008 correction;61 boundaries and full-scope G5/A0 remain open. All48 private planning rows are synchronized. Final combined-head browser validation and bounded deployment remain pending. The earlier release checkpoints below retain their original dates, scope and counts.

**Concurrent work preserved:** current main `4c1e7870cda363d62de3f65fe6fe2f7d3f9d7b7f` and PR204 head `3e17c260fc749e3ee5bad877470ee6035601064c` include separately completed map-filter/search/photo fixes and a WZ04 review. This continuation retains them and the PR202 release receipts, then adds the independently reviewed WZ20/encounter/guide amendments. The original Workspace is recorded at **version38**, source `6f7808db2d3cfaa2bb660f381b13dbab452332ce`, after a separate three-file hotfix; this continuation makes no Workspace change. Manifest89/Ledger97 follow the separate Manifest88/Ledger96 release reconciliation.

## AT-341 — reviewed source amendments and final candidate

**26 November 2026 · Manifest 89 / Ledger 97.** [PR204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204) now includes **seven independently reviewed rendered map-selection outlines: Wild Zones 2, 3, 4, 5, 11, 16 and 20**. The new WZ04/WZ20 decisions were independently reproduced and visually checked against original images; their modeled icon/gate closures are explicit, with no walking-route, floor or spawn-extent claim. The earlier WZ04 HOLD remains historical. [Independent decisions](docs/qa/ATLAS_AT341_GEOMETRY_REVIEW.json); [all68 source inventory](docs/qa/ATLAS_AT341_BOUNDARY_SOURCE_INVENTORY.json).

The encounter amendment preserves272 original rows and283 previous additive identities, adding one explicitly disputed ordinary Ampharos claim separately from its fixed Alpha. There are now284 additive claims /556 total rows, including140 owner-photo receipts. Thirty existing ordinary claims gain time restrictions; weather, roof context and six corroborations remain attributed. All20 published standard tables were compared; comprehensive all-class certification remains open. Mission008 now names Branche and gives the usable waterway/tunnel/ladder approach and verified reward. [Review and amendment receipts](docs/qa/encounter-review-2026-11-26/REVIEW.md).

Exact head `d1d7322e6341cd91016f576161c55da682e06834` passed all map/browser suites, recovered-article checks and header-feedback regression checks; its downloaded screenshot artifact was independently reviewed. The final source amendments above need their own combined-head CI, new WZ04/WZ20 and Mission008 screenshots, merge, Pages deployment and live checks. [Checkpoint](docs/qa/ATLAS_AT341_COMPLETION_CHECKPOINT.json) records actual stages. Supabase now confirms all 48 private planning rows at Manifest89. The 46 previous rows retain their statuses, earlier notes and deployment proofs; two new rows track the bounded zone and encounter amendments. Every original-Workspace status is preserved.

**Full G2/G3/G5/A0 remain open:**61 boundaries (48 sectors and13 Wild Zones), comprehensive roster/guide obligations and full-scope signoff are not certified by this bounded release. All67 requirements, original photos/maps, IDs, progress, accounts, Supabase runtime, feedback and previously released routes/collectible framework remain preserved. No new exact pickup pins or Workspace publication is included. Earlier sections below are dated evidence, not current completion claims.

## AT-341 — completion and preservation checkpoint

**26 November 2026 · Manifest 87 / Ledger 95.** Continuation of [PR204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204). Exact head `e003f5ffa8629c7a9c52da1bbd7bd78b9103354d` passed the existing Explorer, collectible and 20-zone photo suites, but its new two-finger test could not find clear starting points after a drag. A bounded test correction retains real touch input, every existing control/assertion, and adds an explicit rotation check. New exact-head browser validation, screenshot review, merge and live verification are pending.

The private Supabase planning preflight preserved all 43 previous rows and added explicit AT-339/340 records, producing 45 rows at Manifest86 before this checkpoint. Every previous deployed-feature and original-Workspace proof was retained. The follow-up synchronization confirmed all 46 rows at Manifest87, preserving their previous proofs. The stale AT-328 route status now points to its already verified PR191 release; unfinished work remains open. [Durable checkpoint and evidence gaps](docs/qa/ATLAS_AT341_COMPLETION_CHECKPOINT.json).

**Full master-plan G5/A0 remains open:** 48 sector boundaries, 15 additional Wild Zone boundaries and 68 comprehensive encounter signoffs still require evidence. Original sources, paused-media policy and all 67 requirements remain preserved. Encounter-condition and geometry reviews continue using existing evidence. The original Workspace is not changed by this GitHub continuation.

Earlier sections below are dated history. This checkpoint and its actual PR/deployment evidence control current status; no historical approval is silently rewritten.

The candidate now includes current main `4c1e7870cda363d62de3f65fe6fe2f7d3f9d7b7f` after the separate PR202 merge, preserving its map-filter, exact-search and original-photo fixes. Wild Zone 04 adds a sixth reviewed selection outline; 62 boundaries and all 68 comprehensive roster reviews remain open. Fresh Sites metadata shows the separate original-site hotfix at **version 38**. This consolidation does not publish to that Site; the final full-upgrade prompt remains gated. All 128 local Node tests pass; final combined-head browser and visual checks are pending.

## AT-340 — one verified consolidation candidate

**26 November 2026 · Manifest 86 / Ledger 94.** The combined candidate includes shared area/habitat navigation, the exact collectible-search correction, verified salon/quest/gift/written-route additions and restored Main Mission 01–10 detail. Independent review repaired disputed habitat leakage, stale Holovator selection, outbound evidence links and misleading pickup wording. [Scope, sources, validation and rollback](docs/qa/ATLAS_AT340_VERIFIED_CONSOLIDATION.md); [all 25 open PR dispositions](docs/qa/ATLAS_AT340_PR_DISPOSITIONS.json).

**Bounded release status and exact validation/deployment evidence are recorded in [PR204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204). Full master-plan completion remains HOLD:** six reviewed selection outlines, 62 boundaries and all 68 comprehensive encounter reviews still open. No new pickup coordinates are approved. Original photos, IDs, routes, progress, Supabase and feedback are preserved. Original Workspace is still version37; its full-release SHA and executable publication prompt remain unset. Videos and YouTube remain paused.

The entries below preserve the earlier checkpoints; use AT-340 and its eventual exact PR/deployment receipt for the current consolidation status.

## AT-339 — shared areas and Pokémon habitats

<!-- AT339_RELEASE_88_96 -->

**26 November 2026 · Manifest 88 / Ledger 96 · Bounded GitHub release merged, deployed and live-verified.** The runtime candidate remains recorded at **Manifest 85 / Ledger 93**.

[PR202](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/202) reviewed head `42409561393a9fbaa2caa58ba781268af4cb8a6e` and tree `731042231a91996f83d4fa08bf4d9953b9987c78` merged as `4c1e7870cda363d62de3f65fe6fe2f7d3f9d7b7f`. [Exact-head CI](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45819110334), [exact-merge Pages](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45820881956), live HTTP byte comparisons and an independent live browser observation are recorded in the [release receipt](docs/qa/ATLAS_AT339_RELEASE_RECEIPT.json). The [immutable release receipt](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/74975108bca6bb488ebcb9e86e908d7b90efe8ed/docs/qa/ATLAS_AT339_RELEASE_RECEIPT.json) retains that exact proof. Validation includes **89 Node checks, 4 browser suites, 30 reviewed screenshots and 24/24 live-file HTTP matches**. These checks do not constitute physical-device or in-game verification.

Explorer's layer switches now recover Holovator markers from an incompatible sector-only filter, and the visible marker status explains the active category, search and layers. **Wild Zone 2** finds the preserved **Wild Zone 02** record and excludes **Wild Zone 20**; **cafe cyclone** finds the accented Café Cyclone records. **Clear place filters** resets the directory filters while retaining layer choices; **View photos and details** focuses the existing selected gallery. Shared area details show original-photo thumbnails, phone controls follow normal page scrolling, and the main map keeps its numbered pins on one line. Existing photos, routes, camera state and saved progress remain preserved.

Shared area/species selection, habitat links and history now work across Explorer, standalone Maps, the sector directory and the main guide map. The release preserves all 68 area IDs and 272 prior encounter rows, adds **283 attributed claims**, and keeps uncertain and non-wild records separate from supported habitats. It includes **five reviewed rendered map outlines** for Wild Zones **2, 3, 5, 11 and 16**. They are not walking routes, exact spawn extents, interior floors or pickup positions.

**63 boundaries and all 68 comprehensive roster reviews remain open.** G0/G1 retain their verified planning/reconciliation receipts; G2/G3 remain partial, G4 is verified for this bounded behavior, and full-scope G5/A0 remain open. Zero new production pickup positions are claimed. This GitHub documentation checkpoint performs no original Workspace publication. The separately authorized existing-site filter/photo repair is limited to three Explorer files and has its own source-preservation and verification evidence; it cannot satisfy complete-upgrade G5/A0. Original Workspace **v38** was independently published from `6f7808db2d3cfaa2bb660f381b13dbab452332ce` and live-browser verified, with its original 15 routes and 82 steps preserved. The [original-site hotfix receipt](docs/qa/ATLAS_AT339_WORKSPACE_FILTER_HOTFIX.json) records the three-file change. Executor HTTP requests returned 403, so no live-file byte-comparison claim is made for that Site. No full-upgrade SHA or executable Workspace prompt is approved. Videos and YouTube remain paused.

The bounded private feature-metadata update is **verified by guarded execution and fresh readback**. The transaction at **12:47:29.421594 UTC**, checked again at **12:47:34 UTC on 26 November 2026**, reconciled **five existing rows** to Manifest88, including `AT-339-SHARED-AREAS`, with **no insert or deletion**. All five broader feature statuses remain **in progress**; their concurrent continuations are still unfinished. The **46-row** table has unchanged immediate-before/after totals of **16 open, 19 in progress and 11 verified**; all **41 unrelated full rows**, all GitHub statuses and verification timestamps, and all Workspace fields were preserved. The earlier planned 16/20/10 snapshot remains historical: an unrelated AT328 update had already occurred before this transaction and was preserved. The [tracker execution and readback receipt](docs/qa/ATLAS_AT339_TRACKER_RECEIPT.json) records the bounded result. Public feedback, schema, runtime Supabase connections, media pause state and player progress remain unchanged. [Implementation, source evidence and rollback](docs/qa/ATLAS_AT339_SHARED_AREAS.md).

**Concurrent [PR204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204) source records remain unmerged at this checkpoint.** Manifest88/Ledger96 avoids reusing the 86/94 and 87/95 revision pairs recorded by that independent candidate. These references preserve its work; they are not part of PR202's runtime approval, and no PR204 runtime or manifest is imported. The latest referenced source tree is `9508c7cdda23eed0942464f2210859ee3ee7e1e6`.

| Unmerged source revision | Immutable source head | Source records |
|---|---|---|
| Manifest86 / Ledger94 | [e003f5ffa8629c7a9c52da1bbd7bd78b9103354d](https://github.com/trevieisking/lumiose-atlas-pokemon-za/commit/e003f5ffa8629c7a9c52da1bbd7bd78b9103354d) | [Manifest](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/e003f5ffa8629c7a9c52da1bbd7bd78b9103354d/MAPS_UPGRADE_MANIFEST.json) · [Ledger](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/e003f5ffa8629c7a9c52da1bbd7bd78b9103354d/ATLAS_DUAL_SITE_FIX_LEDGER.md) |
| Manifest87 / Ledger95 | [d1d7322e6341cd91016f576161c55da682e06834](https://github.com/trevieisking/lumiose-atlas-pokemon-za/commit/d1d7322e6341cd91016f576161c55da682e06834) | [Manifest](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/d1d7322e6341cd91016f576161c55da682e06834/MAPS_UPGRADE_MANIFEST.json) · [Ledger](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/d1d7322e6341cd91016f576161c55da682e06834/ATLAS_DUAL_SITE_FIX_LEDGER.md) |
| Manifest87 / Ledger95 | [3e17c260fc749e3ee5bad877470ee6035601064c](https://github.com/trevieisking/lumiose-atlas-pokemon-za/commit/3e17c260fc749e3ee5bad877470ee6035601064c) | [Manifest](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/3e17c260fc749e3ee5bad877470ee6035601064c/MAPS_UPGRADE_MANIFEST.json) · [Ledger](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/3e17c260fc749e3ee5bad877470ee6035601064c/ATLAS_DUAL_SITE_FIX_LEDGER.md) |

The latest unmerged PR204 source reconciles the actual PR202 main merge and includes newer WZ04 evidence. This checkpoint neither imports nor approves that candidate geometry. PR202 production remains at five outlines. The retained WZ04 HOLD packet describes the earlier candidate; it is not a blanket rejection of the newer PR204 evidence, which requires its own exact-candidate review.

### Historical candidate checkpoint — Manifest 85 / Ledger 93

The following text records the pre-promotion candidate and is retained as historical evidence.

**26 November 2026 · Manifest 85 / Ledger 93 · Candidate awaiting exact-commit browser validation and release.** Recovered the interrupted area/habitat implementation and reconciled it with PR200's newly merged owner-crop evidence. One read-only model covers **48 sectors and 20 Wild Zones**, with **272 preserved encounter rows plus 283 attributed additional claims**. All rosters remain incomplete; ordinary, fixed Alpha, rotating Alpha, gift, mission, boss, disputed and research records retain their different meanings.

The candidate connects Explorer, standalone Maps, the sector directory and the main guide map, plus species links from the fieldbook and Pokédex. Selection, filters, deep links and browser history share the same area IDs. Review fixed hidden selections under old filters and stale Explorer detail/pin selection; routes, collection selections and saved progress remain separate. PR196's exact collectible-search correction is selectively included.

**Five reviewed map outlines: Wild Zones 2, 3, 5, 11 and 16.** These follow the green areas shown on the original map; they do not establish walking routes, exact spawn extents or floors. The other **15 Wild Zone outlines and all 48 sector boundaries remain unresolved**. Original photo hashes, holdouts and manual review receipts are retained. No new pickup coordinates or production test fixtures are introduced. [Implementation, evidence and rollback](docs/qa/ATLAS_AT339_SHARED_AREAS.md).

The recovered source passed 78 focused checks and static/link validation locally; the revised selection behavior still requires exact-head phone/desktop CI and screenshot review before release. Full AT-325 G2/G3/G5 completion and the executable Workspace prompt remain open. The original Workspace site, runtime Supabase integration, feedback and player data are unchanged. Videos and YouTube remain paused.

**Previous verified runtime checkpoint:** AT-338 / Manifest 83 / Ledger 91. AT-337's route release remains verified. The compact Item/Screw layers and 364-record directory are now merged, deployed and live-verified in PR193; zero new production placements are claimed. [AT-338 release proof](docs/qa/ATLAS_AT338_RELEASE_RECEIPT.json). The dated source consolidation and all 67 recovered requirements below remain preserved; the full Workspace gate is still open.

**Previous verified route release:** AT-337 / Manifest82 / Ledger90. All67 requirements are mapped, and the current-base Bleu7–10 route reconciliation is merged/deployed in PR191, with [exact release proof](docs/qa/ATLAS_AT337_RELEASE_RECEIPT.json). The source-consolidation snapshot below is preserved as dated evidence; it is not a claim that later GitHub changes reached Workspace.

26 November 2026 · **AT-336** · Plan `ATLAS-MAPS-2026-11-21-V1` · Manifest **81** · Ledger **89**

**The accessible plans, chat decisions, GitHub PRs and ledgers are brought together here. Videos and YouTube are paused. The full Interactive Map 2.0 release still has unfinished implementation and validation, so its final executable Workspace prompt remains gated by AT-325.**

This is the detailed source-consolidation entry point. The existing [master plan](MAPS_SECTOR_UPGRADE_MASTER_PLAN.md), [manifest](MAPS_UPGRADE_MANIFEST.json) and [two-site ledger](ATLAS_DUAL_SITE_FIX_LEDGER.md) retain their filenames and historical evidence. The [consolidation manifest](docs/consolidation/2026-11-26/manifest.json) binds the source inventory, requirements, PR decisions and release conditions. Older statements are historical when they conflict with the decisions and fresh observations below; they are not instructions to restore obsolete features.

## What was reconciled

| Source | Coverage and preservation |
| --- | --- |
| GitHub PRs | **176**, with full API pagination exhausted:153 merged,19 open and4 closed unmerged after PR #188, before the consolidation PR. [Complete ledger](docs/consolidation/2026-11-26/PULL_REQUEST_LEDGER.md) and [exact metadata](docs/consolidation/2026-11-26/pull-requests.json). |
| Repository issues | **13** non-PR issues and **74** discussion comments. [Inventory](docs/consolidation/2026-11-26/issues.json). An open issue can track Workspace parity even after its GitHub fix. |
| Current source plans | **108** main documentation/register/asset-manifest files indexed at `cf01561d55bbccae5712b18606c6be4e42a0e9ef`, including exact Git blobs and SHA-256 digests. [Source index](docs/consolidation/2026-11-26/main-source-index.json). |
| Historical task identifiers | **326 AT IDs** found in the prior main root/docs corpus, preserving original ledger rows and source paths. [Historical index](docs/consolidation/2026-11-26/historical-at-index.json). Inclusion does not mark a task complete. |
| Recovered decisions | **67 requirement records**, including55 recovered chat/repository requirements plus12 explicit PR/issue requirements. [Readable register](docs/consolidation/2026-11-26/REQUIREMENTS.md) and [structured provenance](docs/consolidation/2026-11-26/requirements.json). |
| Unmerged source work | [Branch dispositions](docs/consolidation/2026-11-26/branch-dispositions.json) preserve every previously open PR. Unique documents/registers and inert patches are retained in the [branch-source archive](docs/consolidation/2026-11-26/branch-sources/README.md); application code is not imported by that archive. |
| Original Workspace | Fresh Sites metadata confirms the existing original Site, owner access, public audience, v37 source and successful associated deployment. [Observation](docs/consolidation/2026-11-26/workspace-observation.json). |
| Private planning tracker |38 existing feature rows and5 report-status rows inspected. Planning metadata reconciliation is bounded to the feature checklist. Report contents, player data, secrets, schema and public feedback are not part of this packet. |

**Coverage limit:** all repository PRs/issues at the recorded snapshot were enumerated. Chat recovery used accessible search results for 18–26 November plus current instructions; it is not a complete export of every past conversation. Unreturned chats cannot honestly be certified as covered. Numeric gaps in the historical AT sequence remain recorded, not filled with invented work. New evidence can be added without resetting this plan.

## Current release facts

**Historical AT336 snapshot:** the text below retains that consolidation's facts and work programme. The current AT339 receipt above and the final completion plan govern completed work and remaining scope.

| Surface | Verified state | What this does not establish |
| --- | --- | --- |
| GitHub source | PR #188 reviewed head `37b20c38ee14459ffc73b1b6b93840abba3c3c1c` merged as **`cf01561d55bbccae5712b18606c6be4e42a0e9ef`**. Three workflows/five jobs passed; four phone/desktop screenshot excerpts reviewed. | Full Map 2.0 completion or physical verification of every written route. |
| GitHub Pages | [Run45734779457](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45734779457) succeeded for that exact merge. [Media release evidence](docs/consolidation/2026-11-26/media-release-evidence.json). Four live HTTP responses also matched the reviewed release bytes. | Original Workspace publication or a complete new live-device playthrough. |
| Original Workspace | Existing [public URL](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site), project `appgprj_6afda588d5948191b4143e40a1f9c291`, version **37**, source **`1ac2c20002451d295dc4f8e80068297682fcdc4b`**. Associated deployment succeeded. Historical A1–A7 proof is preserved from PR #149. | Automatic synchronization with GitHub. Later GitHub changes, including PR #188, have not been published to this Site in this consolidation. |
| Full upgrade | G1/G2 partial; G3/G4 open; G5 not signed off. | No approved full-scope GitHub release SHA, final Workspace patch allowlist or ready-to-execute publication prompt exists yet. |

Documentation consolidation can be merged independently of unfinished runtime work. It does not turn any retained proposal into production code.

## Controlling decisions

1. **Videos/YouTube are paused and removed from GitHub runtime.** PR #188 removes channel promotions, external watch-link injection,11 route media records and video-return controls/module. Written directions, photographs, ordinary local links and existing progress remain. PR #153 and154 are already closed unmerged. Earlier permission to retain deployed clips is superseded. Historical research and original uploads are retained, with no new filming, channel work or video research required. Resumption needs a new owner instruction.
2. **Preserve the original Site.** Keep its project, URL, audience, pages, map assets, accounts/progress, Supabase integration, feedback/ratings and navigation. The authenticated current Site exists and v37 is recoverable; old statements that source access is universally unavailable are superseded. The next release still needs a fresh source/backup/compatibility check.
3. **Written access routes control ladder/scaffold scope.** AT-294 requires useful directions through ladders, scaffolds, bridges and roofs, with photos where useful. Preserve working markers and the Hotel Z pilot. Do not expand into a new exhaustive structure-pin inventory or require exact endpoints for every ladder.
4. **Evidence decides map precision.** Source images, native map XY, game XYZ, raw height, approximate leads and measured floors remain distinct. No synthetic production pins, guessed polygons, inferred traversable roof paths, or permanent pins for random Hyperspace/nightly Battle Zones.
5. **Keep original identities.**48 sectors,20 zones,264 item records,100 Screw clues and146 approximate map leads are different datasets. Preserve all original collection keys and values. A unique name/zone match is a candidate identity, not proof of physical placement.
6. **All later findings remain present.** Keep original source provenance, both overview-image sets, differing archive wrappers, unresolved source conflicts and the AT-328/329 identifier distinction. Do not overwrite newer revisions with an old branch's complete manifest or ledger.
7. **Use bounded branches and evidence.** The assistant makes technical promotion decisions, audits before coding and validates the affected behavior. Repo Desk, CG Repair Lab, Code God and the protected Writer route remain excluded. Feedback development remains complete unless a new defect warrants work.

## One consolidated work programme

**Historical AT336 snapshot:** the text below retains that consolidation's facts and work programme. The current AT339 receipt above and the final completion plan govern completed work and remaining scope.

### 1. Preserve what already works and reconcile branch differences

Keep the three AT-326 map regressions fixed, the existing pinch/drag/two-finger rotation, desktop pan/zoom/rotation, compass, filters, local links and readable mobile controls. Preserve the original42 story missions,203 side/EX entries, standalone guide pages, Legendary/HOME guidance, Pokédex and type calculator.

The next bounded map integration is AT-320/328, PR #156: **four Bleu7–10 routes,23 written steps and eight research leads**. Reconcile its data with current main and inspect current screenshot evidence, including the previously blank desktop photo crops. Preserve all 70 current access leads and22 deployed routes;26 routes is the candidate total, not today's main total. No new pin is implied.

PR #3 → #4 → #5 is a real dependency stack. Preserve unique early-mission prose, numbering and backup requirements; port verified deltas to a current branch rather than merging obsolete generated pages. PR37 and76 are superseded implementations; PR59/97 retain useful provenance and registration policy, without restoring old prototypes or obsolete photo counts.

### 2. Finish the map evidence and interactions

Retain 48 sector references using42 source PNGs,20 zones using40 original photos,21 approximate Holovator entries with111 photographs, three newer city overview crops and originals, and the native1920×1920 base map. These establish image coverage, not68 certified polygons.

Continue the shared area/encounter model, species-to-habitat and zone-to-Pokédex links, separate city-sector/Wild Zone/encounter/floor/route meanings, multilingual identity references, conditions and unlocks. Preserve38 fixed Alpha rows and the distinct Zone20 ordinary/rotating pools. Resolve the documented WZ7/17/18/19 and boundary disputes with source evidence. PR #171/172 carry useful narrow research, not whole-map signoff.

Use the source registration pilots, historical W01–W03 recovery in PR #166 and later AT-329 set independently. At least four distributed noncollinear controls and held-out checks are required where specified; keep failed fits and uncertainty. PR #186's Great Ball disambiguation is still research. Useful written routes can progress without inventing coordinate precision.

### 3. Add verified collectible layers with stable progress

AT-333 remains a required implementation: visually small Item and Colorful Screw dots, independent switches, proposed both-off initial state, accessible touch/keyboard/list selection and an overlap chooser. Filters never mark items collected or create a second checklist. Preserve matching original IDs and the map/checklist numbering objective.

Only eligible fixed pickups with supported identity, native XY, scene/floor and route enter the confirmed layer. Keep random outcomes, gifts/rewards and unverified records in searchable text. Recovered146 markers include111 candidate matches and35 ambiguities; AT-334/335 do not authorize relabeling them exact. Production transform and new verified item/Screw pin counts remain null/zero. Dense testing uses at least364 synthetic records **only in tests**, all four switch combinations, overview/zoom phone/desktop views, overlap, performance, gestures and saved-progress regression.

PR #188 already adds written-source TM guidance for all 20 ordinary zone pickups, excluding three quest rewards. PR #189's seven-source supplement and Night Slash discrepancy remain preserved without duplicating entries or certifying exact coordinates.

### 4. Keep the whole-guide backlog visible

The consolidated register retains the all 42-main/203-side mission accuracy/depth audit, Canari/Ivor-quality detail, city/rooftop Alphas including Dratini, stage unlocks/obedience/rewards, and contextual completion links. Existing corrections are not undone because an old audit still describes them as defects.

Retain the Mission109 and Furfrou087 editorial candidates, fuller fashion/beauty inventories, variants/prices/storefront photos, treasure economy and type-chart regression work. Fair-trading/trade-evolution pages and optional merge-only progress backup remain a separate backlog. Existing branding/social-sharing intent is retained; IONOS/DNS migration, new hosting, Arceus and Wind/Waves remain deferred. Unrelated projects are outside this release.

## Reconciled branch decisions

| PR group | Current handling |
| --- | --- |
|188|Merged and exact GitHub Pages deployment verified; preserve reviewed no-video/written-guide behavior.|
|149|Preserve v37 source/release evidence and reconcile canonical status; do not copy its old plan revisions wholesale.|
|166,171,172,184,186,189|Preserve unique research and source qualification. Evidence acceptance is separate from runtime/geometry approval.|
|156|Pending current-base route integration and visual validation; remains a full-release prerequisite.|
|1,3,4,5,177,187|Retain unique audits/prose/numbering/backup/editorial work for bounded compatibility review.|
|37,59,76,97|Preserve provenance and remaining policy; later implementations supersede old prototype/runtime portions.|
|2|Preserve branding objective; hosting/DNS change deferred.|
|153,154|Closed unmerged and paused; do not restore media features.|
|9,168|Closed unmerged historical candidates; do not replay old feedback or temporary extraction workflows.|

Exact heads, diffs, source paths and individual decisions are in the [complete PR ledger](docs/consolidation/2026-11-26/PULL_REQUEST_LEDGER.md). Original branches remain intact. No PR is closed merely because its requirements are catalogued.

## Route to the final Workspace prompt

| Gate | Current bounded release status | Remaining scope |
|---|---|---|
| G0 | Prior consolidation, plan and private metadata sync verified | Five existing rows reconciled to revision88; fresh readback at 12:47:34 UTC confirms all five broader features remain in progress. |
| G1 | Required route and current-base reconciliation verified | Preserve unrelated branches and their recorded scope. |
| G2 | Partial: five reviewed zone outlines | 63 remaining boundaries; retain source hashes and independent calibration. |
| G3 | Partial: 283 attributed encounter claims added | All 68 comprehensive roster and condition reviews remain incomplete. |
| G4 | Bounded shared behavior verified | Remaining full-scope coverage and written/photo approaches retain their acceptance criteria. |
| G5 | Full-scope signoff open | Complete mandatory coverage and full-upgrade validation before approval. |
| A0 | Blocked until full-scope G5 | Approved full-upgrade SHA and executable Workspace prompt remain unset. |
| A1–A7 | Complete Workspace upgrade pending | Independent source, backup, compatibility, preview, publication and live verification; a separate existing-site filter/photo hotfix does not advance this full-upgrade gate. |

The prior gate table is retained in the structured release checkpoint history. No bounded runtime receipt substitutes for full-scope G5 approval.

## Maintenance and safe continuation

Read this handoff, the canonical plan/manifest/ledger, relevant source archive and current private checklist before the next bounded change. Recheck actual main/PR heads and both deployments. Preserve this dated snapshot; append a new dated observation for later evidence rather than rewriting what was known on 26 November.

After a bounded change, record requested → branch → merged → deployed → independently checked status separately for GitHub and Workspace. A game-content claim needs its own evidence; a passing test does not certify a physical location. Keep unresolved mandatory work open, preserve deferred ideas, and never infer that every old task is complete from an aggregate revision number.
