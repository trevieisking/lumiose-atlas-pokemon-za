# AT-325 — Complete GitHub upgrade first; final Workspace handoff last

**Owner direction, 25 November 2026:** update the master plan and private Supabase Workspace tracking with the accumulated findings first. Finish, test and deploy the approved GitHub upgrade before producing a single final Workspace prompt. Reuse the owner-supplied three city-map pieces, every sector map and every Wild Zone map; do not request duplicate photographs. This is a release-control checkpoint, not implementation or a ready-to-execute Workspace prompt.

## Evidence at exact baseline
Main `069611db5a9e02788ce812b5e49f8c0522ae2360`, tree `512fe997ea19f15703503f37c0b10850b976671a`. [Structured release gate and 68 area rows](ATLAS_AT325_RELEASE_GATE.json).

- Original native 1920 × 1920 map remains `maps/lumiose-game-map.jpg`.
- **42/42** sector crop blobs and **40/40** Wild Zone photo blobs match saved Git SHA and byte counts. All **48/48** sector references resolve, **20/20** Wild Zones have two originals. Source library and four batch manifests retained. No new pixel-level decode or geometry claims here. Existing 111 Holovator photographs and 21 approximate research entries, 264 item records, 100 Screw IDs, 146 approximate item leads and original 22 map routes preserved.
- Recovered the byte-identical historical W01–W03 owner photos. They are overlapping south, center and north views, consistent with the three-piece description; the message does not identify filenames. All three decoded as 1536×865 JPEGs despite .heic filenames. Photo overlap and visible landmarks are orientation evidence, not calibration or boundaries. [Private-original recovery and alignment sensitivity](ATLAS_AT325_OVERVIEW_RECOVERY.md). Reuse existing files; do not request duplicate photos.
- All 68 area IDs and published identity leads are catalogued. **0/68 verified boundary polygons** at this checkpoint. Source photographs and community game IDs are not measured geographic geometry. All area geometry fields remain null in the release gate.
- [AT-322 PokéMaps register](ATLAS_AT322_POKEMAPS_REFERENCE_REGISTER.json) records 15 species-reference samples, 36 sectors and 5 zones with partial leads, not a complete roster or a screenshot survey.
- [AT-323 boundary register](ATLAS_AT323_BOUNDARY_AND_ENCOUNTER_REGISTER.json) records all 20 Wild Zone geography notes, 45/48 German sector links, 32 archive filename leads and three published reference pictures reviewed; [AT-324 crosswalk](ATLAS_AT324_LOCATION_IDENTITY_REGISTER.json) records 68 source-published identities, ten findings, alternate descriptions for the three missing directory sectors and an additional Jaune district picture. Image downloads remain unavailable; no new external image bytes or verified polygons. Preserve uncertainty, attribution, and all research notes rather than overwriting data.
- [Access survey](../../MAPS_ACCESS_ROUTE_SURVEY.json) retains 16 sectors partly researched and 57 route leads; no exhaustive route inventory claimed. AT-320 PR #156 adds proposed written routes on a separate head; do not revert later main changes or conflate the proposal with deployed routes.
- AT-321 PR #160 exact head `2faef6b25d4f4d7abfae00001a7e35163a78fb41` passed runs 45678803670/45678804312/45678804365 and merged `344a84050a26a50f899752ab61693bc1190e985b`. [Exact Pages deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45679413635) and [current baseline deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45680305852) both succeeded. Earlier failed run 45675208275 is historical. New direct-live inspection was not performed in this checkpoint. The merged PR's review still contains these three source-confirmed outstanding findings; passing CI does not waive them.

### AT325-R01
Selecting another Wild Zone from standalone map/directory leaves old #wild-zone-N fragment; reload or shared link may reopen stale selection.

Required: Synchronize selection and clearing to validated fragment without dropping unrelated query/fragment behavior or resetting filters on internal clicks. Test open deep link, change zone, reload, copy URL, filter-clear and back/forward where supported.

Evidence: PR #160 review and current maps.js selectZone/openHash. Pending fix.

### AT325-R02
40 source Wild Zone images and batch manifests do not trigger dedicated Atlas validation on photo-only PRs.

Required: Add assets/atlas/wild-zones/** and maps.js to pull-request path scope; protect actual bytes, dimensions, hash, references and unchanged existing test requirements.

Evidence: PR #160 review and current .github/workflows/atlas-explorer.yml paths. Pending fix.

### AT325-R03
Generic first details selector now selects Zone 20 Alpha pool instead of original item-record panel.

Required: Use explicitly named existing item-record disclosure for Wild Zone anchors without changing ordinary sector behavior or #map-lead deep links. Add browser regression for #wildzone-20 and saved numbered clue panel.

Evidence: PR #160 review and current sector-maps.js openDirectHash. Pending fix.


## Ordered gates

### G0 — Plan, inventory, and private Workspace queue
**State:** documentation_checkpoint
- [ ] Record owner direction: finish GitHub before writing or submitting final Workspace prompt.
- [ ] Reconcile AT-321–324 evidence, review findings, exact source inventory, master plan, manifest, ledger and private checklist.
- [ ] No duplicate photography requests or unverified geometry.

### G1 — Protect current live map and reconcile existing branches
**State:** pending
- [ ] Repair the three confirmed AT-321 review findings with tests; ensure previous exact-head failure is not forgotten and scope is bounded.
- [ ] Review AT-320 PR #156 at exact head, reconcile current plan/manifest/ledger and route records without reverting newer work; promote only if independently validated.
- [ ] Keep unrelated PRs #149, #153, #154 and all other work separate; do not reset existing progress or review evidence.

### G2 — Recover and calibrate owner-source map coverage
**State:** Historical source recovery verified; calibration pending
- [ ] Use all existing 42 sector PNGs, 40 Wild Zone PNGs and original 1920x1920 base map first; 48/48 and 20/20 references are complete.
- [x] Recover W01–W03 and verify historical hashes, dimensions and overlap. Still verify north-up registration, scale, perspective, and exact coverage as part of the pilot.
- [ ] For each pilot align using >=4 distributed noncollinear landmarks and independent held-out checks; record transform, residuals, uncertainty, original-image hashes and any obstructions. Do not stretch, invent, or replace original imagery. Reuse existing complete image collections to proceed even if older three images cannot be retrieved.
- [ ] Prioritize WZ5, WZ11, Vert1, Bleu7 and WZ14. Distinguish photograph coverage, registered labels, and calibrated boundaries. Use original game captures and reference text/images, not guesses. Work through all 68 areas and preserve existing XY.

### G3 — Verified boundary and encounter systems
**State:** pending
- [ ] Independently validate geometry for all 48 sectors and 20 Wild Zones before marking full map scope complete; where evidence fails, leave explicit unresolved geometry and block final full-scope handoff. Never claim a centre is a polygon or borrow third-party map code or pixels.
- [ ] Keep separate native geometry layers for city district/sector, overlapping Wild Zones, spawn extent, floors/interiors and route segments. WZ5 overlaps two Bleu sectors/street; WZ11 spans Saison Canal/Jaune+Vert; verify WZ14 disputed district.
- [ ] Validate searchable catchable Pokémon per area including conditions, form, time, weather, floor, unlock and encounter class where established. Preserve AT-321 38 fixed Alpha rows and separate WZ20 15 ordinary + 67 rotating candidates; resolve or explicitly label disputed WZ7/17/18/19 entries. Never convert gift, boss, trade or quest into repeatable wild catch.
- [ ] Retain AT-324 identity lookup as separate non-coordinate data; use international references as evidence, not bulk imported data.

### G4 — Interactive Atlas 2.0 implementation
**State:** pending
- [ ] One shared data/geometry/encounter layer for Explorer and all existing map views; retain old links, markers, data, menus and progress.
- [ ] Click an independently verified sector or zone to highlight correct boundary; click a species to reveal all verified habitats. Clear selection, filters, legend, deep links, mobile drawer and desktop panel.
- [ ] Retain pan/zoom, mobile two-finger rotation and pinch, desktop controls, north reset, keyboard access, accessible controls and map state. Use precise geometry only when proved; preserve orientation/written directions for uncertain areas.
- [ ] Written photo-led approaches across all 68 areas; existing verified Holovator/ladder/scaffold routes and markers preserved. Only show a drawn path when connected traversable street/roof/floor/door segments, prerequisites and direction are confirmed; no fabricated ladder/scaffold/bridge inventory. Never permanently mark random Hyperspace or nightly Battle Zones.

### G5 — GitHub full-scope validation and deployment
**State:** pending
- [ ] Review current main and exact PR head, scope, diff, source and progress contracts; preserve 48/20, 42/40 photos, 111 Holovator photos/21 approximate records, 264 item records, 100 screw IDs, 146 item leads, original maps and guide features.
- [ ] All 68 boundary and roster records, route review and required map interactions meet approved acceptance. Unresolved mandatory requirements block full-scope completion; optional unverified details remain explicitly labelled and must not mislead.
- [ ] Pass exact-head unit/static, photo SHA-256/dimensions, link and browser checks on mobile/desktop; inspect genuine screenshots and resolve material review findings. Record exact SHA, test results, screenshot artifacts and independent live checks.
- [ ] Expected-head merge, verify exact Pages deployment and read-only live checks on deployed version. Store tested patch list and approved full-scope release SHA, tree, source evidence and rollback instructions. No GitHub deploy to original Workspace.

### A0 — Final Workspace prompt
**State:** blocked_until_G5_verified
- [ ] Only after complete GitHub release and G0–G5 signoff, generate one final consolidated Workspace prompt with actual exact approved release SHA, changed files, required features, validation evidence, unresolved optional limitations and AT identifiers. Do not generate a ready-to-run prompt now or instruct Workspace to pull latest main indiscriminately.
- [ ] Reference this release gate and AT-297. Require original project/source, verified inventory and rollback, compatible bounded patches, original URL, source-specific progress and Supabase contract preservation. Exclude secrets and player data. No new site or automatic sync.
- [ ] Workspace applies only compatible tested GitHub changes, previews and validates independently, publishes through authorized original editor, then records its actual version and proof. No change until authorized access/source confirmed.

### A1-A7 — Independent original Workspace release and verification
**State:** blocked_until_A0
- [ ] Reconfirm actual Workspace source/version, access and source export/rollback before edit; v37 is historical evidence from PR #149, not a new verified access grant or guarantee of current version.
- [ ] Perform AT-297 A1–A7: authorized editor access, backup/rollback, progress/Supabase audit, bounded compatibility patch, isolated preview, authorized publication on existing URL, independent phone/desktop live checks.
- [ ] Keep all saved progress, database, ratings, feedback, existing maps, artwork, menus, links, route behavior and public origin. Never replace original Site with GitHub reconstruction or touch public data to simulate verification.
- [ ] Update private checklist with exact Workspace release reference, evidence and timestamp only after actual original-site validation. Preserve both-site distinction.


## Workspace private tracking and final prompt guard

The authorized owner-only `atlas_internal.feature_checklist` tracks AT-321 through AT-325. Record the exact GitHub documentation/implementation evidence, keep Workspace status open, and set a stage that blocks the consolidated prompt until G5 succeeds. Do not write any verified Workspace release reference, evidence timestamp, or mark both sites fixed before actual A-site verification. Do not modify `atlas_internal.report_resolutions`, public feedback/ratings, player storage or schema. Update only bounded feature metadata rows. Existing [AT-297](../../WORKSPACE_ACCESS_HANDOFF.md) policy remains mandatory. PR #149 records historical Workspace version 37 and the same-origin rollback/preview evidence at its separate head; do not assume present editor access or silently merge the stale branch. 

**Final prompt not issued.** The approved GitHub full-scope release SHA, final patch inventory, actual deployment and QA evidence are deliberately null until G5 is satisfied. A0 is blocked; A1–A7 are subsequent independent gates. This avoids using Workspace credits to port incomplete research or untested code. A future prompt must point at the exact approved release, not a moving branch, and preserve the original site and its integrations.

**Current decision:** research and source evidence saved, full implementation pending. No production code or image changed, no public data changed, no original Workspace publication, no changes to unrelated PRs. This checkpoint does not claim that boundaries, route geometry, full game content or final Workspace parity are complete.
