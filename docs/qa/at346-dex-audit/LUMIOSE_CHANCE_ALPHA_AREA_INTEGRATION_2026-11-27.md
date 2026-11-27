# AT-346 — First chance Alpha area integration

27 November 2026. Prior candidate 10b0ea8913b2b684c7490efa553c770d9f850489. The previously verified city and Wild Zone survey evidence is now consumed by the existing shared area model. No new external encounter research is claimed in this integration pass; the independent worldwide report remains pending.

## Scope and evidence

| Species | Named area | Chance Alpha catch levels | Condition |
|---|---|---|---|
| Dratini | Jaune Sector 5, Café Kizuna roof | 38–39 | Daytime and the pinned sunny/clear-sunny/rainbow conditions; garden ladder |
| Dragonair | Vert Sector 6, Restaurant Le Nah roof | 40–42 | Roof; no additional time/weather gate inferred |
| Pumpkaboo, Medium Variety | Wild Zone 15 | 52–53 | Day; local seven-species survey complete |
| Pumpkaboo, Small Variety | Wild Zone 15 | 52–53 | Day; local survey complete |
| Pumpkaboo, Large Variety | Wild Zone 15 | 52–53 | Night; local survey complete |
| Pumpkaboo, Jumbo Variety | Wild Zone 15 | 52–53 | Night; local survey complete |

Existing evidence: [city points](LUMIOSE_CITY_ALPHA_POINTS_2026-11-27.md) and [survey/variety replay](LUMIOSE_WILD_ZONE_ALPHA_SURVEYS_2026-11-27.md). Capture bands are explicitly conditional on an Alpha being selected, not spawn probabilities. The Dragonair source has differing ordinary-level reports; the new row attributes its bands to the pinned data rather than overwriting the prior ordinary evidence. No one-time mission, fixed Alpha or rotating WZ20 claim has been reclassified.

## Implementation and preservation

- Add the encounter-only [packet](../../../atlas-area-alpha-evidence.json), scoped to the existing native map identity. The existing 748-claim evidence register remains byte-identical (blob adb7608fa9c2643106f9085a2abc972c52830a2b), as do every original map asset, 68 selection outlines, photo, roster and existing player-state contract.
- Add a distinct `random_alpha` class in the existing read-only model and shared selector. Only source-supported rows with valid area identities, nonconflicting IDs, conditions and usable references enter the packet. Missing packet or missing core evidence leaves the original area/roster functionality intact.
- The new filter highlights the already approved named area, never a new Pokémon-specific point or geometry. Existing Pokédex habitat links use the same model; all map surfaces share the selector.
- Added unit assertions for unchanged original rows/outlines and input, precise per-form conditions, missing/malformed packet safety, and 67 rotating Alpha rows. Added phone/desktop browser cases for the three species, optional-fetch failure, unchanged stored progress, and screenshot evidence.

The tests were added, not executed in this checkpoint. Exact-head CI and targeted visual review remain required. Comprehensive Alpha availability, Lumiose and Hyperspace alternate routes/stats, complete map integration and historical PR #4/#5 adaptations remain open. No release or Workspace import.
