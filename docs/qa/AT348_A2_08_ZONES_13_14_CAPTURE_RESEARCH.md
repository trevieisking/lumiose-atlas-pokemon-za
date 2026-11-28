# AT-348 A2-08 — Wild Zones 13 and 14 capture routes and conditions

Draft PR #229. Manifest 126 / joint ledger 134. Parent `5e1f8fec290553ff38703204e5581f4355789a1a`: all three exact-head workflows passed (46157079144, 46157079095, 46157079124). Add thirteen ordinary and three fixed Alpha encounter-condition supplements; thirteen chance Alpha rows. Cumulative 121 conditions and 98 chance Alpha packet rows. Existing area evidence, geometry, pictures, IDs and progress retained.

## Zone 13 — North Boulevard

- [Pokéarth encounter bands](https://www.serebii.net/pokearth/lumiosecity/wildzone13.shtml); [Bulbapedia encounter schedule and Meadow form](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_13); [VGC local route](https://www.videogameschronicle.com/guide/pokemon-legends-z-a-wild-zone-13/); [Nintendo Life ground routes](https://www.nintendolife.com/guides/pokemon-legends-z-a-wild-zone-13-guide-all-pokemon-and-alphas); [Pokémon GO Hub side-specific day/night table](https://pokemongohub.net/post/guide/all-wild-zones-pokemon-legends-z-a/).
- Complete Mission 14 and begin Mission 15. All six normal species use ground-level search routes. Day: Meadow Vivillon and Weepinbell; night: Scyther and Phantump; Heracross and Pinsir both periods. Fixed Alphas: Lv. 47–48 Trevenant at night and Lv. 46–47 Weepinbell by day. Existing TM081 thorns are a search landmark, not a required capture obstacle. A conflicting early PowerPyx table calls the first Alpha Pinsir; the preserved Trevenant identification is corroborated by the encounter tables and multiple local guides. No new fixed Pinsir claim.
- Keep the ordinary Weepinbell chance slot separate from the fixed Alpha despite the matching Alpha level band. Meadow Vivillon form retained; no other form inferred.

## Zone 14 — Electrical Substation

- [Pokéarth encounter bands](https://www.serebii.net/pokearth/lumiosecity/wildzone14.shtml); [Bulbapedia encounter table](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_14); [Nintendo Life local routes](https://www.nintendolife.com/guides/pokemon-legends-z-a-wild-zone-14-guide-all-pokemon-and-alphas); [VGC route observations](https://www.videogameschronicle.com/guide/pokemon-legends-z-a-wild-zone-14/).
- Complete Mission 19 and begin Mission 20. Helioptile Lv. 37–38 has a daytime clear-sky restriction; Bulbapedia also marks harsh sunlight, so do not claim all weather states have been individually tested. Preserve the earlier source-corroborated restriction and add actionable sunny-day search instructions to the ordinary and chance Alpha entries.
- Aron and Drilbur have two separate listed ordinary bands (28–30, 36–37) and corresponding Alpha bands (38–40, 46–47). Do not collapse them into a continuous interval or invent exact slot locations. VGC describes nighttime Emolga and Onix sightings; published tables permit both periods, so nighttime is a fallback search suggestion. Ordinary and fixed Excadrill are separate near the central equipment.

## Shared evidence and limits

[Story unlock table](https://www.serebii.net/legendsz-a/wildzones.shtml), [clock and bench refresh](https://www.serebii.net/legendsz-a/daynightcycle.shtml), [Alpha unlock and local survey](https://www.serebii.net/legendsz-a/alphapokemon.shtml). Bulbapedia describes the chance mechanic after Main Mission 05; Serebii also identifies a local survey requirement. Instruct players to complete the survey before targeted chance hunting without claiming a guaranteed encounter. Individual respawn intervals, precise slot coordinates and full weather testing are not established. No new map pins, geometry, runtime logic or player-state changes.

## Validation and next step

Extend exact-ID/preservation and chance-class tests, explicit Meadow form, split level bands, and Helioptile weather assertions, plus existing desktop/phone browser map tests for Scyther and Helioptile. New-head CI and visual QA pending. HOLD until full GitHub guide acceptance and verified live deployment. Next Wild Zone 15; continue all remaining areas and the 46-surface audit. No Workspace change.
