# AT-348 A2-03 — Wild Zones 7–8 capture guidance

Date: 2026-11-28. Draft PR #229. Manifest 121 / joint ledger 129. Parent a5b4dae05841928ffb2de3ca4ce9fad9d7bed4a0: all three workflows succeeded (46147184368, 46147184376, 46147184412).

## Scope

Additive encounter data using the existing shared map/Pokédex projection. Fifteen ordinary rows (13 species-level rows plus two Floette forms) and three existing fixed Alpha rows receive levels, timing, qualified weather, floor, unlock, written local directions and respawn guidance. Fourteen chance Alpha rows distinguish random from fixed. Red/orange Floette have separate reported levels; only form rows receive chance entries, avoiding duplicate generic chance rows. Parent area evidence and geometry unchanged.

## Sources and limitations

- [Zone 7 encounter levels](https://www.serebii.net/pokearth/lumiosecity/wildzone7.shtml), [zone 7 time/forms](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_7), [zone 7 directions](https://www.nintendolife.com/guides/pokemon-legends-z-a-wild-zone-7-guide-all-pokemon-and-alphas).
- [Zone 8 encounter levels](https://www.serebii.net/pokearth/lumiosecity/wildzone8.shtml), [zone 8 roster](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_8), [zone 8 directions](https://www.nintendolife.com/guides/pokemon-legends-z-a-wild-zone-8-guide-all-pokemon-and-alphas), [story walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Part_10).
- [Written route comparison](https://pokemongohub.net/post/guide/all-wild-zones-pokemon-legends-z-a/), [story unlock](https://www.serebii.net/legendsz-a/wildzones.shtml), [Alpha unlock and survey](https://www.serebii.net/legendsz-a/alphapokemon.shtml), [day/night and bench refresh](https://www.serebii.net/legendsz-a/daynightcycle.shtml).

Gastly remains disputed because the survey and narrower guides differ from the positive written encounter tables. No chance Alpha claim added. Camerupt is fixed, but timing and later progression reports conflict; recommend a daylight visit at the stall and a later return without inventing a mission gate. Floette exact colour distribution and precise grass patches remain open. Weather is qualified, not a guarantee in every condition. No physical-device or field-verification claim. Local search instructions paraphrase the written evidence without inventing coordinates.

## Validation

Extend existing exact-ID, count, no-geometry-change and malformed-input tests plus map browser checks for Gible. New-head CI and desktop/mobile review pending. No application logic, map coordinates, player-state or Workspace change. Full guide acceptance remains open. HOLD. Next: verify new-head CI, continue zones 9–10, 11–20, city/interiors, forms, alternatives and Alpha/Hyperspace, and all 46 page surfaces.
