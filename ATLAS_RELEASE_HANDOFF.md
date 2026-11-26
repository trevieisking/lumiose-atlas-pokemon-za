# Pokémon Atlas — consolidated release handoff

## AT-341 — completion and preservation checkpoint

**26 November 2026 · Manifest 87 / Ledger 95.** Continuation of [PR204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204). Exact head `e003f5ffa8629c7a9c52da1bbd7bd78b9103354d` passed the existing Explorer, collectible and 20-zone photo suites, but its new two-finger test could not find clear starting points after a drag. A bounded test correction retains real touch input, every existing control/assertion, and adds an explicit rotation check. New exact-head browser validation, screenshot review, merge and live verification are pending.

The private Supabase planning preflight preserved all 43 previous rows and added explicit AT-339/340 records, producing 45 rows at Manifest86 before this checkpoint. Every previous deployed-feature and original-Workspace proof was retained. The next synchronization records this Manifest87 checkpoint; it does not mark unfinished work verified. [Durable checkpoint and evidence gaps](docs/qa/ATLAS_AT341_COMPLETION_CHECKPOINT.json).

**Full master-plan G5/A0 remains open:** 48 sector boundaries, 15 additional Wild Zone boundaries and 68 comprehensive encounter signoffs still require evidence. Original sources, paused-media policy and all 67 requirements remain preserved. Encounter-condition and geometry reviews continue using existing evidence. The original Workspace is not changed by this GitHub continuation.

Earlier sections below are dated history. This checkpoint and its actual PR/deployment evidence control current status; no historical approval is silently rewritten.

The candidate now includes current main `4c1e7870cda363d62de3f65fe6fe2f7d3f9d7b7f` after the separate PR202 merge, preserving its map-filter, exact-search and original-photo fixes. Wild Zone 04 adds a sixth reviewed selection outline; 62 boundaries and all 68 comprehensive roster reviews remain open. Fresh Sites metadata shows the separate original-site hotfix at **version 38**. This consolidation does not publish to that Site; the final full-upgrade prompt remains gated. All 128 local Node tests pass; final combined-head browser and visual checks are pending.

## AT-340 — one verified consolidation candidate

**26 November 2026 · Manifest 86 / Ledger 94.** The combined candidate includes shared area/habitat navigation, the exact collectible-search correction, verified salon/quest/gift/written-route additions and restored Main Mission 01–10 detail. Independent review repaired disputed habitat leakage, stale Holovator selection, outbound evidence links and misleading pickup wording. [Scope, sources, validation and rollback](docs/qa/ATLAS_AT340_VERIFIED_CONSOLIDATION.md); [all 25 open PR dispositions](docs/qa/ATLAS_AT340_PR_DISPOSITIONS.json).

**Bounded release status and exact validation/deployment evidence are recorded in [PR204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204). Full master-plan completion remains HOLD:** six reviewed selection outlines, 62 boundaries and all 68 comprehensive encounter reviews still open. No new pickup coordinates are approved. Original photos, IDs, routes, progress, Supabase and feedback are preserved. Original Workspace is still version37; its full-release SHA and executable publication prompt remain unset. Videos and YouTube remain paused.

The entries below preserve the earlier checkpoints; use AT-340 and its eventual exact PR/deployment receipt for the current consolidation status.

## AT-339 — shared areas and Pokémon habitats

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

| Gate | Current state | Exit needed |
| --- | --- | --- |
|G0|Consolidated source/requirement records; private metadata reconciliation tracked|Reviewed documentation and synchronized feature metadata with honest remaining gaps.|
|G1|Partial|Current-base branch reconciliation; protect deployed fixes; exact route/screenshot checks.|
|G2|Partial research|Source recovery/registration and independent checks across required map coverage.|
|G3|Open|Approved68-area boundary/encounter evidence; mandatory uncertainties resolved.|
|G4|Open|Shared highlight/habitat/route interactions and AT-333 collectible layers with preserved controls/progress.|
|G5|Blocked by unfinished work|Complete-scope tests, visual review, reviewed merge, exact deploy, live checks, rollback and signoff.|
|A0|Blocked until G5|One final prompt with the actual approved full-scope SHA/tree and reviewed Workspace change inventory.|
|A1–A7|Next release pending|Fresh original-source/backup/compatibility checks, bounded adaptation, preview, publish and independent live verification.|

The [Workspace prompt readiness contract](docs/consolidation/2026-11-26/WORKSPACE_PROMPT_READINESS.md) contains the complete required content and evidence fields. Its approved full-scope SHA and final executable prompt path remain **null**. This avoids treating a completed documentation merge as a completed game/map release.

## Maintenance and safe continuation

Read this handoff, the canonical plan/manifest/ledger, relevant source archive and current private checklist before the next bounded change. Recheck actual main/PR heads and both deployments. Preserve this dated snapshot; append a new dated observation for later evidence rather than rewriting what was known on 26 November.

After a bounded change, record requested → branch → merged → deployed → independently checked status separately for GitHub and Workspace. A game-content claim needs its own evidence; a passing test does not certify a physical location. Keep unresolved mandatory work open, preserve deferred ideas, and never infer that every old task is complete from an aggregate revision number.
