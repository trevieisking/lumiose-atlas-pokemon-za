# Apply the verified Atlas cross-grid release to my existing Site

Apply the reviewed Atlas package to my existing Pokémon Atlas Site **appgprj_6afda588d5948191b4143e40a1f9c291**, at https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site. Reuse this Site and its services, with no rebuild, replacement Site or additional spend.

## Exact approved GitHub source

- Repository: https://github.com/trevieisking/lumiose-atlas-pokemon-za
- Runtime PR: https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/212
- Merged runtime commit: `9e27f81c89727274a25555bf190605afc870995f`
- Reviewed runtime tree: `eb53180daca2eeed013e1cef99b615b63e264894`
- Reviewed PR head: `473068ac10b2025ec31f78144f0002c1bd63976d`
- Matching successful Pages deployment: https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45888982903
- Verification and limitations: [docs/qa/atlas-cross-grid-release-2026-11-26/RELEASE_RECEIPT.json](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/main/docs/qa/atlas-cross-grid-release-2026-11-26/RELEASE_RECEIPT.json)
- GitHub rollback baseline: `3259de9a8d70d5851ae208fb812c4774cc59c2ec`

Use this exact merged source for the change comparison. The documentation receipt is a later follow-up; do not use a mutable branch tip as an unreviewed runtime substitute. The release proof includes passing exact-head CI, reviewed desktop/mobile screenshots and live verification. Device methods and calibration limits are recorded explicitly.

## Preserve the original Site and combine the verified work

First identify the original Site's current editable version and source. Retain a source/configuration backup and a working rollback point. Compare the existing Site against the earlier sealed [Map2.0 prompt](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/9e27f81c89727274a25555bf190605afc870995f/WORKSPACE_MAP2_RELEASE_PROMPT.md), the [PR211 handoff](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/9e27f81c89727274a25555bf190605afc870995f/docs/qa/atlas-workspace-consolidation-2026-11-26/WORKSPACE_NEXT_PACKAGE.md), and this cross-grid release. Keep newer original-Site changes. Apply only reviewed changes that are missing, adapting them to the existing implementation rather than replacing the whole Site.

Preserve the existing URL, audience, maps, full original photographs, useful close-ups, guide pages, validated coordinates, stable marker/sector/zone IDs, player progress and storage keys, accounts, ratings, feedback and Supabase connections. Keep the recovered 26-photo source archive available in GitHub; transform only separate copies. QA archives and private measurement media do not become player-facing video features.

Carry over the verified Map2.0 and PR211 improvements where absent, including working area/filter/photo navigation, the 42 after-mission obedience notes, Hotel Z ladder photos, qualified Dratini sector/access guidance and Wild Zone 9 Meowstic day/night clarification. Preserve their source qualifications and all earlier working guide content.

## Add the released grid and camera changes

Use the native-map reference configuration `atlas-cross-grid.json`, its geometry module `atlas-cross-grid.mjs`, its UI module `atlas-cross-grid-ui.mjs`, and the reviewed Explorer integration changes. Keep the grid optional and off by default. Preserve fractional cell references, copied links, north reset, existing filters and the ability to inspect photos/directions for verified locations.

The original game map stays north-up; Atlas viewer rotation remains available. Preserve mobile dragging, pinch zoom and two-finger rotation, and desktop pan/zoom/rotation controls. Apply the reviewed high-zoom camera fix so extreme diagonal panning cannot move the actual rotated map completely out of view. Keep ordinary framing and cardinal pan bounds intact.

A1–R18 are our native-image reference cells. The origin is model-defined, distinct from the earlier Wild Zone 20 local A1. Preserve the exact released vectors and map hash. The sampled native-cross residuals do not guarantee the same error at every unmeasured point; lower-edge extensions and partial cells remain labelled and clipped. Fractional formatting does not improve source accuracy. The observed waypoint 60 is not a verified conversion to feet, metres or counted footsteps. No cross alone creates an item, ladder, Holovator or scaffolding pin. Retain floor/access evidence and coordinate uncertainty; random Hyperspace distortions must never become fixed location markers.

## Verify and publish

Use one scoped patch and preview. Check mobile and desktop controls, sharp grid labels, selected-cell subdivisions, grid placement at rotation, partial edge cells, copied-link restoration, compass reset and cleared stale selection text. Confirm existing filters, 48 sectors, 20 Wild Zones, guide navigation, photos/written directions and isolated progress-save/reload behavior. Confirm the feedback and Supabase integration is preserved. Do not mark a physical-device check complete if only browser emulation was used.

Publish to the existing Site only after the preview and preservation checks pass. Then verify the live version and record the Site version, exact source/runtime revisions, changed files, test results, any remaining limits and rollback. Preserve the previous live Site if access, backup or preview prevents safe completion. The scoped release does not certify every historical master-plan requirement or complete game inventory.
