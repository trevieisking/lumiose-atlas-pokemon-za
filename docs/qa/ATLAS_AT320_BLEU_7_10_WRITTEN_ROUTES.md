# AT-320 — Bleu 7–10 written access routes

Review-only, based on merged AT-319 84ff8eecc5f4f429ebeba65a558e1510d5c9bc66. Existing map images, 111 owner JPGs, 48 sectors, 20 Wild Zones, 21 approximate lifts, 1 ladder and 22 routes preserved. No video required. New routes remain district-only; no map pins or collection IDs. Source numbering conflicts explicitly unresolved.

## Sources

- raider: https://raiderking.com/pokemon-legends-z-a-all-colorful-screws-locations/
- gg: https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/
- checklist: https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations/
- screws: https://altissimo1.github.io/Supplementary-Series/Legends/Legends-Z-A/colorful-screws.html
- b7: https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/bleu-sector-7.html
- b9: https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/bleu-sector-9.html
- duty: https://www.serebii.net/legendsz-a/sidemissions/onmaintenanceduty.shtml
- duty2: https://www.thonky.com/pokemon-legends-z-a/side-mission-045-on-maintenance-duty
- beldum: https://www.serebii.net/legendsz-a/sidemissions/thebeldumblockade.shtml
- beldum2: https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Legends%3A_Z-A/Side_Missions_81-100
- rpg: https://www.rpgsite.net/guide/18713-pokemon-legends-z-a-side-mission-list-rewards
- gamespot: https://www.gamespot.com/gallery/pokemon-legends-za-colorful-screw-locations/2900-7145/

Owner source records: MAPS_BLEU7_SOUTH_BOULEVARD_OWNER_LIFT_SURVEY_2026-11-22.json and MAPS_BLEU8_CAFE_SOLEIL_OWNER_LIFT_SURVEY_2026-11-22.json. All map crops already hosted. Sector 8 and 10 dedicated inventories not accessible; no implied exhaustive item list. Sector 7 and 9 inventories returned text; only Sector 9 item leads are included. Sources corroborate routes, not native coordinates. Mission 92 device remains unverified. For the Café Soleil scaffold, use unlocked Roto-Glide rather than relying on an unintended movement exploit. New tests exercise each step and existing photo links on both simulated device widths.

AT-319 release evidence: exact head d9dfd34ee7b0341507c20d83131e6ead207ae18d; identical merged tree 39b4cff0f250fa41415a9df90870d0a003639061; Atlas run 45652407346, 18 screenshots in artifact 15041382534, Pages run 45653969683 all verified. AT-320 automated and visual review pending. Private checklist parity remains outstanding. Original Workspace v37 and Supabase untouched.

## AT-328 — Current-main reconciliation

## AT-328 — Reconcile AT-320 Bleu 7–10 written routes (25 November 2026)

G1 bounded reconciliation on existing PR #156, from current main `91e80f4bc1765981436e5c861540b422dd3487ad`, prior head `2f16e5bd6efddc5454c60b2024d00db1cdbdebf0`. The original four changed data/test files were unchanged between AT-320's old base and latest main. Build a merge commit on the same review branch, keeping newer AT-321 through AT-327 changes and canonical documentation rather than replacing them. Preserve all 22 original routes and all 57 previous course leads; add four district-only routes (23 steps), eight research leads, four coverage-row updates, and the old receipt with its exact AT-319 CI/Pages success rechecked. All other Explorer data remains identical; no new measured pins, collection IDs or inferred lift/roof connections. Existing ten Holovator photos reused. Clarified Roto-Glide access by actual Hotel Z rooftop tutorial (sources differ on Missions 15/16) and Mission 92 after Main 30/beginning 31; original mission device remains unverified. [QA and sources](docs/qa/ATLAS_AT320_BLEU_7_10_WRITTEN_ROUTES.md). **Exact-head CI and visual review pending; no deployment claim.** G1 remains open; G2–G5 and A0/A1–A7 unchanged. Manifest 71; ledger 79. Original Workspace unchanged; no other PRs touched.

Prior run 45654393757 was green on the old head only. Fresh source check: [Mission 45](https://www.serebii.net/legendsz-a/sidemissions/onmaintenanceduty.shtml) confirms Durstin and Main 19; [Mission 92](https://www.serebii.net/legendsz-a/sidemissions/thebeldumblockade.shtml) and [Bulbapedia mission index](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)) confirm Main 30/31, Aimant, four Beldum and reward items. [Thonky](https://www.thonky.com/pokemon-legends-z-a/main-mission-16-a-rogue-mega-beedrill) and [Dexerto](https://www.dexerto.com/wikis/pokemon-legends-z-a/roto-glide-pokemon-legends-z-a/) use adjacent mission numbering for the same rooftop tutorial. Use unlock state, not an asserted exact mission-completion requirement. None of these references establishes native coordinates or certified roof connectivity. Existing photos are orientation guides.

Fresh unit and browser tests retain original map, route, item, progress and all Wild Zone checks; exercise 23 steps and source/photo links at both viewports. Actual screenshots and exact Pages run required. No physical Switch or phone gameplay verification claimed.
