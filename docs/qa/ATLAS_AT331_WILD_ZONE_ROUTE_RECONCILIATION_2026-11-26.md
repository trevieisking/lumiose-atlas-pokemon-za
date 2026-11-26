# AT-331 Wild Zone written-access reconciliation

26 November 2026. Local source baseline: `e048358a48929d325dbd8d99e29a61592e6455a3`.

## Decision and acceptance scope

The current [access survey](../../MAPS_ACCESS_ROUTE_SURVEY.json) had 19 Wild Zones marked `not_started` even though all 20 original ordinary TM records already had source-attributed written access notes in both guide pages. This reconciliation records that existing work as **partial text research**, retains the earlier international-research status and scaffold lead for Wild Zone 9, and joins each area to its original overview/close-up photo references. It changes the current Wild Zone research-started count from 1 to 20. It does not mark any area complete.

[SM-05 in the sector master plan](../../MAPS_SECTOR_UPGRADE_MASTER_PLAN.md#sm-05--written-ladder-scaffold-glide-and-rooftop-access-guide) requires useful written approaches, supported prerequisites, photo context where helpful and visible uncertainty. It does not require exact ladder/scaffold entry coordinates or an exhaustive structure inventory. [AT-325 G4](ATLAS_AT325_RELEASE_GATE.json) separately requires photo-led approaches across all 68 areas and verified traversal before a path is drawn. These 20 existing TM notes are one bounded part of that review; they do not establish that every useful destination or approach in each zone has been reviewed.

## Evidence reconciled

- [Existing TM research JSON](ATLAS_TM_ACCESS_RESEARCH_2026-11-26.json) and its [written evidence/limitations](ATLAS_TM_ACCESS_RESEARCH_2026-11-26.md): 20 records, one per Wild Zone, with original IDs/progress keys, at least two cited written sources each, `verified_native_xy: null` and `verified_access_geometry: false`. The existing record remains authoritative for direction text, prerequisites, source URLs and disagreements.
- [Item Atlas](../../items.html) contains all 20 notes under their original item anchors. [Sector and Wild Zone directory](../../sector-maps.html) contains the same 20 notes under the original Wild Zone anchors, plus the already-existing second listing of `5-7` in Bleu Sector 1. The 21 directory instances represent 20 records, not a new pickup or route.
- The original `wild-zone-fieldbook.mjs` records and [batch 01](../../assets/atlas/wild-zones/batch-01-manifest.json), [batch 02](../../assets/atlas/wild-zones/batch-02-manifest.json), [batch 03](../../assets/atlas/wild-zones/batch-03-manifest.json) and [batch 04](../../assets/atlas/wild-zones/batch-04-manifest.json) provide the two original map photographs for each zone. Their exact paths, dimensions, byte counts and SHA-256 hashes are checked against the retained files. These are **orientation references**, not new photographs or proof that a ladder, roof crossing, obstacle or lift is traversable.

| Area | Existing TM note | Original item / progress ID | Published guide references |
| --- | --- | --- | --- |
| Wild Zone 01 | TM103 Work Up | `1-10` | [Item record](../../items.html#item-1-10); [zone and original photos](../../sector-maps.html#wildzone-1) |
| Wild Zone 02 | TM027 Swift | `2-0` | [Item record](../../items.html#item-2-0); [zone and original photos](../../sector-maps.html#wildzone-2) |
| Wild Zone 03 | TM022 Aerial Ace | `3-7` | [Item record](../../items.html#item-3-7); [zone and original photos](../../sector-maps.html#wildzone-3) |
| Wild Zone 04 | TM072 Fire Spin | `4-2` | [Item record](../../items.html#item-4-2); [zone and original photos](../../sector-maps.html#wildzone-4) |
| Wild Zone 05 | TM040 Bullet Seed | `5-7` | [Item record](../../items.html#item-5-7); [zone and original photos](../../sector-maps.html#wildzone-5) |
| Wild Zone 06 | TM041 Water Pulse | `6-6` | [Item record](../../items.html#item-6-6); [zone and original photos](../../sector-maps.html#wildzone-6) |
| Wild Zone 07 | TM092 Dazzling Gleam | `7-4` | [Item record](../../items.html#item-7-4); [zone and original photos](../../sector-maps.html#wildzone-7) |
| Wild Zone 08 | TM036 Rock Tomb | `8-3` | [Item record](../../items.html#item-8-3); [zone and original photos](../../sector-maps.html#wildzone-8) |
| Wild Zone 09 | TM018 Power-Up Punch | `9-17` | [Item record](../../items.html#item-9-17); [zone and original photos](../../sector-maps.html#wildzone-9) |
| Wild Zone 10 | TM034 Night Slash | `10-7` | [Item record](../../items.html#item-10-7); [zone and original photos](../../sector-maps.html#wildzone-10) |
| Wild Zone 11 | TM063 Psychic | `11-9` | [Item record](../../items.html#item-11-9); [zone and original photos](../../sector-maps.html#wildzone-11) |
| Wild Zone 12 | TM013 Ice Beam | `12-10` | [Item record](../../items.html#item-12-10); [zone and original photos](../../sector-maps.html#wildzone-12) |
| Wild Zone 13 | TM081 X-Scissor | `13-3` | [Item record](../../items.html#item-13-3); [zone and original photos](../../sector-maps.html#wildzone-13) |
| Wild Zone 14 | TM039 Discharge | `14-6` | [Item record](../../items.html#item-14-6); [zone and original photos](../../sector-maps.html#wildzone-14) |
| Wild Zone 15 | TM052 Earth Power | `15-4` | [Item record](../../items.html#item-15-4); [zone and original photos](../../sector-maps.html#wildzone-15) |
| Wild Zone 16 | TM076 Liquidation | `16-1` | [Item record](../../items.html#item-16-1); [zone and original photos](../../sector-maps.html#wildzone-16) |
| Wild Zone 17 | TM062 Flamethrower | `17-6` | [Item record](../../items.html#item-17-6); [zone and original photos](../../sector-maps.html#wildzone-17) |
| Wild Zone 18 | TM065 Stone Edge | `18-7` | [Item record](../../items.html#item-18-7); [zone and original photos](../../sector-maps.html#wildzone-18) |
| Wild Zone 19 | TM079 Hurricane | `19-8` | [Item record](../../items.html#item-19-8); [zone and original photos](../../sector-maps.html#wildzone-19) |
| Wild Zone 20 | TM054 Draco Meteor | `20-65` | [Item record](../../items.html#item-20-65); [zone and original photos](../../sector-maps.html#wildzone-20) |

## Evidence limits and remaining work

This pass reconciles retained repository evidence. It does not reopen the external sources, perform a physical playthrough, independently inspect every depicted access feature, certify an item coordinate or re-register an image. The existing TM research already states that no physical playthrough or source images were verified by that research. Photo-file verification here establishes provenance and availability only.

The original source limitations remain in force: WZ3 lacks a checked climbing sequence; WZ6 has differing bearings and an unidentified exact lift; WZ9 has written access that was not physically checked; WZ13 retains the directional/source disagreement; WZ15 has no physically checked device identity or roof crossing; WZ18 external XY is not native Atlas XY. Other precise trees, obstacles, elevations and pickup pixels remain unverified as recorded. None is promoted by this reconciliation.

Wild Zone 9 retains `AR-WZ09-01` unchanged. Its interior-scaffold Screw lead is separate from TM018 record `9-17`; this reconciliation neither resolves that lead nor combines their identities. WZ5 retains its original `5-7` identity across both directory listings. The three excluded DLC reward TM IDs remain excluded from this ordinary-pickup review.

All 68 area IDs, 78 existing lead records, 26 existing runtime routes, original photo/source bytes and original pickup/progress keys are preserved. All `geometry_complete` and `inventory_complete` flags remain false; `fully_completed_areas` remains 0, and sector research remains 29/48 started. Historical AT-331 and other dated checkpoint counts remain unchanged as historical evidence. The current summary therefore records **29 sectors plus 20 Wild Zones with partial research**, not 49 completed areas.

Continue reviewing relevant additional destinations and tractable written-route disagreements per area, including the 19 sectors still marked `not_started`. No new exhaustive pickup or physical ladder/scaffold survey is introduced. Full AT-325 G2–G5 and the final Workspace handoff remain separate; this documentation patch does not claim deployment or change the original Workspace.

## Verification

`node --check tests/atlas_explorer.test.mjs` and `git diff --check` passed. Running `node --test tests/atlas_explorer.test.mjs tests/wild_zone_fieldbook.test.mjs tests/sector_map_directory.test.mjs` passed all 40 checks.

- The existing sector-directory test checks all original TM identities, null pins, unchanged hints and exact written-note parity across both guide pages.
- The fieldbook test verifies all 40 original photographs against the four manifests and preserves the original fieldbook records.
- The Explorer test checks that every reconciled Wild Zone points to its own existing TM record, local guide anchors and two original photo references, while the 78-lead/26-route totals and incomplete flags remain intact.
- A baseline comparison verifies that all sector rows, every pre-existing lead and all historical survey fields are unchanged; only the 19 stale Wild Zone statuses, 20 added review references and the current Wild Zone summary count change.
