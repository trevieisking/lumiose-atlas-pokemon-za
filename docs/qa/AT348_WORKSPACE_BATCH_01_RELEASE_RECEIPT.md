# AT-348 Workspace batch 01 release receipt

28 November 2026 · Master Manifest 153 · Joint GitHub and Workspace Ledger 161

## Release

| Record | Evidence |
| --- | --- |
| Original Workspace | [Lumiose Atlas Pokédex](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/#pokedex) |
| Published version | v41, `appgprj_6afda588d5948191b4143e40a1f9c291~appgver_3ae55592ba6c8191b4f02e119f7d9e30` |
| Workspace source | `586d20bde90c36220ab38beb75031dee1e6b99ff` |
| Deployment | `appgdep_6b0b4454b400819184c395232bc1f2ec`, succeeded at 2026-11-28T21:15:15.526771+00:00 |
| Rollback | v40, `appgprj_6afda588d5948191b4143e40a1f9c291~appgver_1b17368d1b088191bb8f45e381a4b48e`, source `f0fd141bdb5a6a3a533ed03bfe5667ed166d0535` |
| Approved GitHub source | [PR #229, commit `956f569ba0e7c7b4801dfa19286b891241ce872b`](https://github.com/trevieisking/lumiose-atlas-pokemon-za/commit/956f569ba0e7c7b4801dfa19286b891241ce872b) |
| Exact GitHub validation | [Feedback](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46188321769), [Explorer](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46188321771), [Pages build](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46188321772), [Articles](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46188321775). All succeeded. |
| Additional cost | £0 |

## Capture guide reconciliation

Updated all 31 existing Lumiose species IDs. Each existing card, species identity, evolution note, artwork and progress control was retained.

| Disposition | Lumiose Pokédex IDs |
| --- | --- |
| Updated | 10, 12, 13, 15, 21, 22, 23, 32, 33, 38, 49, 50, 51, 53, 55, 62, 77, 79, 81, 87, 96, 98, 100, 135, 145, 146, 165, 166, 180, 181, 206 |
| Already current | None |
| Held | None |

The update includes city, rooftop, water and other alternative approaches, area-specific levels, published time and weather, mission prerequisites, scripted encounters, fixed and chance Alphas, and evolution or trade alternatives. It includes 27 related Wild Zone condition records from the checked research, with ordinary, fixed, chance and rotating encounters identified where documented. Exact roof slots, unsupported weather/odds and disputed reports remain qualified.

Workspace uses shorter sector anchors than the GitHub guide. Every included link instance was checked against an existing Workspace destination or dex species. The fixed-city Alpha buttons open the existing city section. Goomy’s sewer button opens the existing Main Mission 19 guide, with the ordinary and chance Alpha levels on the capture card. The Garbodor route distinguishes the one-time encounter from repeatable routes. [Serebii’s mission entry](https://www.serebii.net/legendsz-a/sidemissions/delibirdgetsinaflap.shtml) and the [Bulbapedia walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Side_Missions_61-80#Side_Mission_074:_Delibird_Gets_in_a_Flap) support the qualified wording that players can try to catch it within that encounter, including after the knock-out as reported by the walkthrough.

## Validation and preservation

- Compared the authenticated Workspace source to its archived v40 commit and kept a rollback reference before applying a three-file patch. The separate unfinished photo draft was preserved.
- Six Workspace regressions passed. All 1,215 packaged site files byte-matched the tested checkout and hosting identity was checked. The 214 link instances include original routes used by existing Wild Zone buttons, so the displayed guide avoids duplicate buttons.
- Chromium preview at 1,348 px desktop and 375 px phone width confirmed card rendering, all 31 Lumiose IDs, 232 Lumiose and 132 Hyperspace entries, flow between dex views, documented acquisition routes, a species evolution button, a sector link, a Side Mission link, and the existing map zoom, rotation and compass reset. The expanded phone card was widened and retested at 375 px with no horizontal overflow. Alpha catalogue and HOME controls remained available. Existing preview mission progress persisted on navigation.
- Live browser readback independently confirmed the 31 capture guides, both official regional catalogues, the Pikachu fixed-Alpha level and Vert Sector 8 photos, Garbodor’s Side Mission 74 button, the feedback panel opening, and all 364 HOME controls.
- Existing maps, markers, photos, other guide pages, data stores and integrations are byte-identical to v40. Feedback opened successfully. No production test feedback, ratings or player-data writes were submitted.
- The source GitHub candidate stays in PR #229. PR #226 is open for urgent, ongoing photo evidence. Remaining guide research and unknown encounter details stay open under AT-348.

Next batch candidates are checked Hyperspace acquisition, forms, conditions and Alpha guidance, following the existing incremental release policy.
