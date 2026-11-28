# AT-348 A7-01 — Whole-guide editorial and factual audit

Date: 2026-11-28. Manifest 117 / ledger 125. Existing draft PR #229 only. Parent `01857775fcd569f2a9bb9e3527cd7cd3f382177e`, main `bdfce92bfa7324517d0a1e2f8db7eec84983eefb`, field PR #226 remains separate. User reports that the guide is disorganised and often wrong. Do not equate source inventory or automated tests with factual completion. A2 P0 capture research remains highest priority; no unrelated expansion.

## Bounded findings

- Inventory 28 pre-existing root HTML routes (including index and two feedback routes), 17 editable homepage sections. New directory links to every public guide route and all original view IDs; owner inbox omitted.
- Independent mission title/order comparison checked 42 identities on each of three walkthrough surfaces. Main missions 1–3 objective sequences were checked against published mission and walkthrough sources. Nine matching purpose notes added. Preserve ordered steps, existing bookmarks and progress keys. Remaining claim-level detail and missions 4–42 open.
- A2 source recheck: weather guide, Goomy/Sliggoo and Goodra evolution guidance, reported sewer route. Preserve reported vs verified distinctions, do not imply universal route conditions. Homepage Alpha summary corrected to distinguish fixed and rotating encounters; prioritize acquisition over stats.
- Parent workflow 46144028702 Pages passed; 46144028707 articles and 46144028681 Explorer failed same obsolete sector_map_directory assertion. Parent fashion, shared-area and actual map browser jobs passed. Exact original written TM note still present, with optional qualified photo anchor inside its span: 14 sector rows and 13 item rows. Regression now checks exact original wording, valid anchor/target identity and counts. No photos/notes removed. Exact new-head CI and manual phone/desktop review pending.

## Page-by-page acceptance register

| Surface | Bounded review / change | Remaining factual acceptance |
|---|---|---|
| index.html#home / src/sections/home.html | Navigation, misleading guaranteed-Alpha summary corrected; capture-first entry | Review all summaries against authoritative guide data. |
| index.html#walkthrough / src/sections/walkthrough.html / walkthrough.html / journey.html | 42 mission title/ID pairs on each surface match independent lists (126); objectives 1–3 checked; purpose notes on all three surfaces | Review objective steps, navigation directions, rewards, unlocks and descriptions for missions 4–42; source-check remaining precise claims in 1–3. |
| index.html#sidequests / src/sections/sidequests.html / side-missions.html | Source inventory and access reviewed | Check all 200 numbered requests and 3 EX: order, requirements, location, rewards, dialogue, prerequisites. |
| index.html#dimension / src/sections/dimension.html / mega-dimension.html | Source inventory and access reviewed | Check 14 DLC missions, rank gates, donut conditions, tasks and unlocks. |
| index.html#pokedex / src/sections/pokedex.html | A2 capture-first browser job passed at parent; six weather tip sources reopened | Check all 364 species and every relevant form, route-specific conditions, time, weather, level, floor, access, respawn and alternatives. |
| alphas.html / index.html#alphas / src/sections/alphas.html | Directory distinguishes fixed, chance and rotating coverage | Check every eligible species, fixed/rotating pools and alternative acquisition; unknown not unavailable. |
| legendaries.html / index.html#legends / src/sections/legends.html | Source inventory and access reviewed | Check quest/portal/event availability, moves, level, timing and prerequisites. |
| shiny-hunting.html | Source inventory and access reviewed | Verify odds, methods and restrictions. |
| index.html#starters / src/sections/starters.html | Source inventory and access reviewed | Check starter stats, evolution and alternate acquisition. |
| atlas-explorer.html / maps.html / index.html#maps / src/sections/maps.html / sector-maps.html | 28-page source inventory, parent map and area browser jobs passed; inherited TM span test mismatch isolated | Check every habitat, item location, level/elevation and access route; no invented coordinates; mobile/desktop review. |
| hyperspace-maps.html | Source inventory and access reviewed | Verify portal layouts, conditions and randomized-location policy. |
| items.html / index.html#items / src/sections/items.html / collectible-fieldbook.html | Retain 27 qualified TM-photo crosslinks (14 sector/13 item) and existing photo evidence | Verify item methods, numbering, precise pickup/access evidence, screws and map references. |
| index.html#berries / src/sections/berries.html | Source inventory and access reviewed | Verify all berry/donut effects and recipe quantities. |
| shops.html | Source inventory and access reviewed | Verify prices, vendors, unlocks, Mega Shard exchanges and planners. |
| clothing-guide.html / hair-beauty-guide.html | Source inventory and access reviewed | Verify boutique/salon inventories, unlocks, prices, Flabébé routes. |
| index.html#bosses / src/sections/bosses.html / boss-guide.html | Source inventory and access reviewed | Verify matchups, boss tactics and phases. |
| royale-guide.html / index.html#battles / src/sections/battles.html / battles.html | Source inventory and access reviewed | Verify promotion encounters, season dates and dated rewards. |
| type-chart.html | Source inventory and access reviewed | Check 18-type matrix, dual-type calculations, exceptions. |
| game-content.html | Direct links to 11 existing topic sections, no duplicated content | Verify menus/prices, services, training, titles, multiplayer/music, photography, challenges, time/weather/health, gifts and completion. |
| mable-research.html | Source inventory and access reviewed | Verify research task counts, thresholds and reward tiers. |
| rewards.html / index.html#rewards / src/sections/rewards.html | Source inventory and access reviewed | Verify time-limited distributions and claim restrictions; label expired events. |
| home-connection.html | Source inventory and access reviewed | Verify transfers, compatibility, rewards and manual completion state. |
| index.html#essentials / src/sections/essentials.html / index.html#secrets / src/sections/secrets.html | Source inventory and access reviewed | Check mechanics, controls, unlocks and optional discoveries. |
| coverage.html / index.html#sources / src/sections/sources.html | Source inventory and access reviewed | Align visible coverage limits and provenance with current audit. |
| feedback.html / feedback-owner.html | Route inventory only; no feedback changes requested | Preserve existing functioning feedback; owner inbox excluded from public directory. |
| guide.html (new candidate) | 57 existing destination links in 8 categories; static grouped navigation; links in homepage and recovered-article headers | Exact-head link graph, desktop/phone layout, accessibility, and live verification pending. |

## Sources examined for this slice

- https://www.serebii.net/legendsz-a/mainmissions.shtml (mission order and titles)
- https://www.powerpyx.com/pokemon-legends-z-a-all-side-mission-locations-main-missions/ (independent mission list)
- https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A) (first three objective sequences)
- https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Part_1 (opening context)
- https://www.serebii.net/legendsz-a/weather.shtml ; https://www.powerpyx.com/pokemon-legends-z-a-goomy-location/ ; https://www.powerpyx.com/pokemon-legends-z-a-sliggoo-location/ ; https://allthings.how/find-goomy-in-pokemon-legends-z-a-sewer-route-and-rainy-spawn/ ; https://www.serebii.net/legendsz-a/alphapokemon.shtml ; https://www.serebii.net/legendsz-a/wildzones.shtml

No site publication. HOLD. Review every claim by canonical record, retain known gaps, and test all affected surfaces; no guessed coordinates, no reset of progress, no new permanent random distortion pins. Workspace is last, only after verified GitHub live release.
