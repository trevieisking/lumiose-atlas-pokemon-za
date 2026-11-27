# AT-347 — Content Discovery and Completeness Audit: intake and implementation specification

Owner supplied the full Deep Research narrative and implementation prompt on 27 November 2026 for Pokémon Legends: Z-A and Mega Dimension. This is a structured intake of the findings and requested implementation, not a second independent fact-check, full catalogue dataset, or permission to publish the unverified examples. [Tracking issue #225](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/225) · [Gap register](GAP_REGISTER.json) · [Workspace planning brief](WORKSPACE_PLANNING_BRIEF.md).

## Baseline and disposition

The audit's AT-342 release references (merge 223762bd1a21c2e72c592e975499d13c4195ae07; tested f030c4ae3e33259105bf351885c386f6b53900d9; tree 0288e63d1d52fe5f95dc76e0c01631715310e54a) are historical. This intake independently read GitHub main at 24d5d16cc1d07118a3e4947dbb933b25cadc2cd7 (AT-346 PR223, tree ae6cec79327f4ca6706d92d664c9e0680b8cca3c). Existing consolidated draft PR224 parent 12e3560de6f0e3cf85fe55cfe4d049a61867a6f3 is retained without replacing its work. Baseline report covered walkthrough, 203 indexed side missions, items, maps, Alpha, ranked, HOME and Shops; earlier 9/13 estimates are superseded by 21 distinct supplied gap IDs (not a certification of complete absence across every file). Preserve all 41 boutiques, five arcades, five salons, 48 sector views, existing source photographs, and prior dex/habitat work. Re-audit actual current files and draft for overlaps before implementing any item. No changes to runtime, map geometry, player progress, feedback, schemas, live site or approved Workspace prompt in this intake.

## Gap register (owner-reported evidence; all implementation open)

| ID | Phase | Priority | Audit status | Destination | Acceptance |
|---|---|---|---|---|---|
| CITY-CAFES-001 | A | P0 | missing_complete_system | Shops / City Life | Complete all 17 cafés with per-venue menu and prices, unlocks, friendship/healing/photo behavior, routes and coordinate evidence. |
| CITY-RESTAURANTS-001 | B | P0 | partial | Battles / City Life | Le Nah, Le Yeah, Le Wow, Sushi High Roller; course/Furfrou League rules, entry cost, unlocks, rewards and repeatability separately verified. |
| SERVICE-BALLRECOVERY-001 | C | P1 | missing | Useful People & Services | Free lost-ball collection outside Pokémon Centers; verify fixed locations and eligible missed throws. |
| SERVICE-FRIENDSHIP-001 | C/D | P0 | partial | Training Academy | Café Pokémon-Amie checker after SM25; friendship bands, ordinary threshold 160 and café/bench increase to 255. |
| SERVICE-EVRESET-001 | C/D | P0 | missing_or_partial | Training Academy | Rust Syndicate reception Bleu District; five Mega Shards per Pokémon; verify exact MM20 completion prerequisite. |
| SERVICE-HYPERTRAIN-001 | C/D | P0 | missing_or_partial | Training Academy | Justice Dojo, level 50+, Bottle Cap one stat, Gold Bottle Cap all stats; verify unlock. |
| SERVICE-IVJUDGE-001 | C/D | P1 | missing_or_partial | Training Academy | Postgame Pokémon Center unlock; Right Stick in Boxes; verify dialogue labels. |
| SERVICE-PLUSMOVE-001 | C/D | P1 | partial | Training Academy | Josée at Justice Dojo, Seed of Mastery, eligible Plus Moves; verify eligibility and unlock. |
| ACH-TITLES-001 | E | P0 | missing | Achievements & Titles | Complete searchable catalogue of all official title tiers, thresholds and profile selection; separate DLC/online/event status. |
| PHOTO-SYSTEM-001 | G | P1 | partial | City Life / Fashion | Camera modes, bench/party photos, café, poses/filters, Royale profile; verify Switch and Switch 2 controls before diagrams. |
| CHALLENGE-REMATCH-001 | H | P0 | partial | Minigames & Challenges / Boss guide | Rogue Mega Simulator: story + Yveltal, Vinnie, level 70, timer/record, three Exp. Candy M; verify extension and conditions. |
| CHALLENGE-RUSH-001 | H | P0 | partial | Minigames & Challenges / Boss guide | After Rayquaza; level 100, no bag items during encounters, three full heals, no time limit, Mega Rush Master; full roster with boss links. |
| CHALLENGE-DODGER-001 | H | P1 | partial | Minigames & Challenges / DLC | 30 seconds, no fighting/Pokémon, TM130 and title as mission rewards, repeatable afterward; verify repeat rewards. |
| MULTI-PRIVATE-001 | F | P0 | missing | Battles / Multiplayer & Trading | Link Play after Mable Rewards, local/online private rooms/passcodes, ranked, link trade eight-digit codes, version and NSO requirements. |
| MULTI-MUSIC-001 | F | P1 | missing | Battles / Multiplayer & Trading | Complete 34-track source catalogue with progression and base/DLC availability; verify track unlocks. |
| MECH-TIME-001 | I | P1 | partial | City Life / Training / Dex | Day 04:00–20:00, night 20:00–04:00, about two real minutes per in-game hour, bench skip and spawn refresh, night Battle Zones. |
| MECH-WEATHER-001 | I | P1 | missing_or_partial | Training / Dex | Standard, overcast, sun, rain, fog, rainbow; combat modifiers and source-qualified spawn/evolution effects. |
| MECH-HEALTH-001 | I | P1 | missing | Useful People & Services | Trainer damage, recovery, blackout, Rogue restart, Green Canari Plush maxima 100/150/200/250. |
| MECH-SIZE-001 | D | P2 | partial | Training Academy / Alpha Fieldbook | XS–XL, Alpha larger than ordinary XL yet labeled XL; size-gated missions and donut effects where verified. |
| MECH-PASSIVE-001 | D | P1 | missing | Training Academy / Dex | Species-specific passive mechanics; no normal Ability system. Distinguish rogue-only effects from usable species effects. |
| COMPLETE-001 | K | P0 | missing | 100% Completion Guide | Linked dashboard for story, missions, dexes, research, titles, city life, challenges, collections, fashion, online/event/DLC goals; additive progress only. |

## A–K implementation dossiers

### A. Cafés and City Life
Research complete 17-café network, full menu and prices per venue, fixed location, access, unlocks, healing, active Pokémon Friendship and photo opportunities. Report extracted 14 names: Café Cyclone, Café Classe, Café Introversion, Café Woof, Café Soleil, Shutterbug Café, Café Pokémon-Amie, Café Rouleau, Café Gallant, Café Triste, Café Kizuna, Café Ultimo, Café Action!, Café Bataille. Remaining three must be sourced, not guessed. Example reported prices: Cyclone Blend ₽600, Robustaryu Coffee ₽700, Komala Coffee ₽1,000; Classe au Lait ₽800; Rouleau Blend ₽360; Gallant Dark Roast ₽1,000; Ultimo Coffee ₽100,000. Distinguish the special ₽1,000,000 coffee in SM176 (Discerning Trainer title), not normal Ultimo menu. Café Pokémon-Amie (Autumnal Avenue) Friendship checker after SM25 Trubblesome Patrons. Check all menu records and routes from source; preserve ten owner-confirmed drinks and original shop inventory. City Life covers benches, social interactions, birthday registration after Looker Bureau and photography. Do not assume all birthday visual effects.

### B. Restaurants
Le Nah, Le Yeah, Le Wow, Sushi High Roller; verify every Full Course of Battles and Furfrou League use. Reported One Star after Rogue Mega Evolutions appear in MM10, Two Stars beginning MM20, no healing convention. Distinguish a location reused by missions from an independently repeatable challenge. Entry fees and repeat rewards are unresolved. Use existing battle/mission routes, add complete dossiers rather than duplicating strategies.

### C. Useful People & Services
Free lost-ball volunteers outside Pokémon Centers; confirm nine centers and healing-only stand north of Rouge Plaza. Friendship checker after SM25; ordinary friendship methods reportedly stop at 160; drinks and benches reach 255, verify exact bands. Rust Syndicate reception, Bleu District, five Mega Shards to remove one Pokémon's EVs (verify prerequisite after MM20). Justice Dojo Hyper Training level 50+, Bottle Cap one stat / Gold Bottle Cap all, Josée Seed of Mastery eligible Plus Moves. Postgame IV Judge unlocked by visiting Pokémon Center, Right Stick in Boxes. Special Scan after SM188, 25,000 survey points per special five-star portal, verify and reuse existing AT-346 Special Scan route rather than duplicating. Fixed services only get permanent pins with validated coordinates; dynamic portals never do.

### D. Training Academy
Friendship, IV/EV, natures/mints when verified, Bottle Caps, move mastery, move learning/relearning, Alpha/size. XS/S/M/L/XL with Alphas larger than ordinary XL but visible XL label; verify size mission requirements. No conventional Ability system: examples reported Aegislash form switching, Mimikyu first-hit protection undamaged, Morpeko Aura Wheel, Dondozo/Tatsugiri Commander-like interaction. Distinguish Rogue-only Darkrai, Primal Groudon/Kyogre and Mega Rayquaza effects. Link to items, alphas, species/forms, battle pages and side missions.

### E. Achievements & Titles
Full catalogue with official names, description, tier model, exact thresholds, equip/view up to three titles, type-use (18), story, collection, link/ranked and DLC titles. Reported Bronze/Silver/Gold thresholds: Fashion Leader ₽200k/500k/1m boutiques; Shiny Collector 1/5/10; Leveling-Up Pro 1/5/10 level-100 Pokémon; Big Money Maker ₽500k/1m/3m earned; All-Around Town Helper 20/50/100 side missions; Tidy Trainer 100/200/500 Mega Crystals; Café Regular 5/20/50 visits; Mable Enabler 50/100/213 tasks. DLC examples Savior of Hyperspace, Lumiosian Donuteer, Hyperspace Pokémon Professor, Mega Rush Master, Defenseless Dodger, Discerning Trainer, All-Around Hyperspace Helper. Also True-Blue Canatic and Pokémon Professor. Check actual titles/thresholds, requirements and event status against the full catalogue. Search/filter base/DLC, battle, collection, city life, fashion, money, research, online and completion; separate namespaced opt-in progress.

### F. Multiplayer & Trading
Official Nintendo workflow: Link Play unlocked after Mable Research Rewards; ranked up to four online, private up to four local/online, link trade two local/online, room passcodes vs shared eight-digit trade codes. Three-minute real-time point battles and Z–A rank progression; verify current requirements and online membership, game versions and active rewards, link existing rewards/HOME. Full 34-track battle-music catalogue reported, including Trainer, Wild Pokémon, Team MZ, Zygarde, Lysandre, Mewtwo, Hyperspace Lumiose Pokémon, Mega Darkrai, Primal Reversion, Mega Rayquaza, Legendary Pokémon of Unova; confirm all titles/unlocks. NPC trades reported Pikachu→Heracross, Abra→Riolu, Slowpoke→Galarian Slowpoke, Raichu→Alolan Raichu, Porygon→Porygon with Upgrade then Dubious Disc interaction. Verify steps and cross-link mission/dex/evolution. HOME: retain current page, verify actual live compatibility and transfer restrictions/promotions, not just historical announcements; current status cannot be inferred from 27 February 2026 announcement alone.

### G. Photography
First-person movement, third-person camera (reported Y), profile photo perspective, cafés, benches and up to six party Pokémon (existing fashion reference), poses/expressions/lens filters and appearance/profile links. Verify Z-A specific controls and features on Switch and Switch 2, not inherited from other games. Use owner photos and written directions; no external guide imagery or videos in public pages.

### H. Repeatable Challenges
Rogue Mega Simulator after story + Yveltal, Vinnie/Quasartico, level-70 rematches, timer, best record comparison and 3 Exp. Candy M reported. Rogue Mega Rush after Rayquaza, 27 level-100 opponents, no bag items in encounters, three full-party heals per run, no time limit, Mega Rush Master title. Full roster to verify includes Mega Absol, Mega Absol Z, Mega Tatsugiri, Mega Darkrai, Primal Groudon/Kyogre, Mega Rayquaza, Mega Zeraora, final Mega Zygarde. Link each to existing boss guide. Defenseless Dodger SM173: survive 30 seconds, no fighting/Pokémon, TM130 and title mission rewards, repeatable; confirm rewards after mission. Research Hyperspatial Scuffles/Slugfest, other permanent DLC loops and repeat rewards before claiming.

### I. World Mechanics
Reported 04:00–20:00 day, 20:00–04:00 night, two real minutes/game hour, bench skip/spawn refresh; night Royale zones dynamic. Weather standard/overcast/intense sun/rain/fog/rainbow, Fire/Water modifiers and rain Goomy/Sliggoo, sun Riolu/Helioptile examples; check actual area/time/conditions using AT-346 species/encounter model. Trainer health damage and automatic recovery when not targeted; blackout last Pokémon Center, Rogue restart; Green Canari Plush max 100/150/200/250. Confirm stages/effects. Cross-link not duplicate encounter data.

### J. Gifts, trades and acquisition loops
Audit starter, Absol, Chespin, Fennekin, Froakie, Spewpa, Kanto starter, fossils, Galarian Stunfisk, Lucario, Eternal Flower Floette, Gimmighoul, Melmetal, Magearna. Fossil restoration repeatable; subsequent Alpha/Shiny chance requires source checks. Integrate already documented trades/gifts/Special Scan, HOME and evolving routes into existing species records, not duplicate catalogues. No invented conditions.

### K. 100% completion
One linked player dashboard, not duplication: story, side missions, 232 Lumiose/132 Hyperspace numbered entries (distinguish required 230/131), Mable Research, titles, cafes, restaurants, rematches/Rush/Dodger, legends/mythicals, gifts/trades, Alpha and shiny optional goals, fashion, Canari Plushes, Colorful Screws, maps, HOME and DLC. Distinguish required game-completion vs optional completionist, online, DLC, event/time-limited; no implied permanently available expired rewards. Existing progress untouched.

## Data and architecture contract
Use existing reusable components and routes first. Seven concepts may be sections/hubs instead of seven top-level pages: City Life; Useful People & Services; Achievements & Titles; Minigames & Challenges; Pokémon Training Academy; Multiplayer & Trading; Completion. New records: id/type/name/game_scope/description/unlock/repeatability/cost/reward/location/sector/street/landmark/floor/written_route/coordinate/coordinate_status/map_eligible/online_requirement/dlc_requirement/event_status/source_urls/verification_state/verified_date/owner_capture/cross_links. Stable prefixes cafe-, restaurant-, service-, title-, challenge-, multiplayer-, mechanic-, gift-, trade-, completion-. Do not rename existing IDs. Use null/unknown for absent facts; no fabricated pins or unlocks. Separate provenance/claim confidence from coordinate validation. Only confirmed-primary/multiple/secondary claims as unqualified facts; probable/disputed/research-only/pending-field-validation remain visibly unresolved. Require primary or corroborated evidence for costs, unlocks, rewards and repeatability. Fixed service layers and filters may be added only for confirmed fixed points with existing validated or newly field-validated locations; coordinate text can be used while pin pending. No geometry changes or permanent random Hyperspace or nightly Battle Zone pins. Existing photos remain untouched; reuse original owner map frames. No public video or third-party imagery.

## Research-only queue and owner capture requests
Box expansion/additional unlocks unverified (Box Link access is distinct); ribbons/marks unverified; exact restaurant costs/repeat rewards; exact café/service sector coordinates; birthday visual effects; Scuffle/Slugfest repeat rewards; other older-game assumptions. Verify remaining three cafés from full list before requesting duplicate owner photos. Reuse existing captures; if still needed request cafe/restaurant exterior/interior and fixed service location images, Friendship Checker SM25, EV reset five-shard dialogue, Hyper Training and Plus Move UI, lost-ball volunteer, birthday registration/celebration, title picker, private passcodes (redact private codes), music selector, Dodger start/result, Simulator timer, both console camera controls. Continue multilingual discovery of missed content beyond initial inventory; each new gap gets stable ID and evidence before publishing.

## Preflight, workflow and acceptance
Read exact current main and existing draft, actual player-facing files including shops.html, shops-data.js, clothing-guide.html, hair-beauty-guide.html, coverage.html, index.html, src/sections/*.html, side-missions.html, journey.html, walkthrough.html, royale-guide.html, boss-guide.html, battles.html, items.html, mable-research.html, alphas.html, shiny-hunting.html, legendaries.html, home-connection.html, rewards.html, mega-dimension.html, hyperspace-maps.html, maps.html, atlas-explorer.html and relevant JS/JSON/storage. Identify existing destinations, contracts and overlaps with AT-346. Audit marker and coordinate IDs, localStorage/sessionStorage/Supabase progress keys; add only a distinct namespace if a new optional checklist needs it, test historic fixtures. No new server progress tables, migrations, feedback changes, cost or replacement Site. Implement data first, UI second on reviewed branch; validate links, unique IDs, source-backed claims, base/DLC/online/event labels, routes, assets, marker identity, coordinate invariance, old progress, filters, no schema/feedback change, no random pin persistence. Mobile/narrow Android/iPhone-class and desktop Chromium browser review, keyboard/focus/contrast/reduced motion/semantic headings, usable tables, no horizontal traps, search/filter/checklists/photo layouts/long names. Exact-head automated checks and manual review, diff allowlist, validated PR merge, independent GitHub Pages live verification. Then one exact-approved-source Workspace prompt with backup, rollback and preview/phone/desktop checks; separate original-Site release and proof. All 21 gaps and supplementary tasks remain open until their specific evidence passes. Do not claim full catalogue completeness or full deployment merely from this document.

## Sources reported accessed 27 November 2026
- cafe: https://www.serebii.net/legendsz-a/cafes.shtml
- friend: https://www.serebii.net/legendsz-a/friendship.shtml
- service: https://www.serebii.net/legendsz-a/useful.shtml
- service2: https://www.psypokes.com/plza/servicenpcs.php
- ball: https://bulbapedia.bulbagarden.net/wiki/Lost_Pok%C3%A9_Ball_collector
- center: https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Centers
- titles: https://www.serebii.net/legendsz-a/titles.shtml
- titles2: https://bulbapedia.bulbagarden.net/wiki/Title_%28Legends%3A_Z-A%29
- photo: https://bulbapedia.bulbagarden.net/wiki/Photo
- one: https://serebii.net/legendsz-a/sidemissions/fullcourseofbattles%3Aonestar.shtml
- two: https://serebii.net/legendsz-a/sidemissions/fullcourseofbattles%3Atwostars.shtml
- furfrou: https://advent.serebii.net/legendsz-a/sidemissions/facingthefurfrouleague.shtml
- rematch: https://www.serebii.net/legendsz-a/roguerematch.shtml
- rush: https://www.serebii.net/legendsz-a/roguemegarush.shtml
- dodger: https://www.serebii.net/legendsz-a/sidemissions/beadefenselessdodger.shtml
- multi: https://en-americas-support.nintendo.com/app/answers/detail/a_id/68627/c/874
- club: https://legends.pokemon.com/en-us/news/z-a-battle-club-ranked-battles
- music: https://www.serebii.net/legendsz-a/musiccustomisation.shtml
- time: https://www.serebii.net/legendsz-a/daynightcycle.shtml
- weather: https://www.serebii.net/legendsz-a/weather.shtml
- health: https://www.serebii.net/legendsz-a/playerhealth.shtml
- size: https://www.serebii.net/legendsz-a/pokemonsize.shtml
- passive: https://www.serebii.net/legendsz-a/passiveeffects.shtml
- gift: https://www.serebii.net/legendsz-a/giftpokemon.shtml
- trade: https://www.serebii.net/legendsz-a/ingametrades.shtml
- home: https://legends.pokemon.com/en-us/news/pokemon-home-connectivity?pubDate=20260302
- box: https://www.serebii.net/itemdex/pokemonboxlink.shtml
- wild: https://serebii.net/legendsz-a/wildpokemon.shtml
- donut: https://www.serebii.net/legendsz-a/flavorpowers.shtml
- update: https://www.nintendo.com/en-gb/Support/Purchases-Subscriptions/Games/How-to-Update-Pokemon-Legends-Z-A-2938482.html
- Repository: https://github.com/trevieisking/lumiose-atlas-pokemon-za
- Nintendo UK product: https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Pokemon-Legends-Z-A-2533423.html

Source URLs are retained from supplied report; independently recheck each claim during implementation. Preserve current status evidence of earlier releases and do not overwrite unrelated AT-346 records.
