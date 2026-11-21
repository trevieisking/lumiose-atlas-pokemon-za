# Lumiose Atlas — Walkthrough accuracy audit (initial baseline)

**Date:** 21 November 2026  
**Repository:** `trevieisking/lumiose-atlas-pokemon-za`  
**Source examined:** `src/sections/walkthrough.html` at Git blob `0957cd51cbb7a859495dab8674c136919e4c08bb` on `audit/2026-11-21-main-story-research`.  
**Status:** **AUDIT IN PROGRESS; NOT A FULL FACT-CHECK CERTIFICATE.** The 42 mission records below have been inventoried; only selected claims for Missions 3, 14, 19 and 25, and the Mable reward page, have been compared to independent sources in this pass.

## Scope and evidence standard

**User's requested benchmark:** Mission 14 (Canari) and Mission 19 (Ivor). Every mission should ultimately explain *when it unlocks; who to speak with; the exact street, gate, ladder, roof or sewer access; puzzle/interrogation answers; opponents and Pokémon levels; rewards and next unlock*. A mission is not complete merely because an item list, map widget or an in-game-marker fallback makes its page long.

**Source precedence:** recorded game text / unedited gameplay > official Pokémon information for mechanics and story > multiple independent specialist guides (Serebii, Bulbapedia, Thonky, PowerPyx) for specific walkthrough routes > unverified website text. The official site does **not** publish every mission's objective list, so a game-accurate walkthrough still needs corroboration and, where sources disagree, manual in-game evidence.

**Statuses:** `Verified` (multiple agreeing sources or game footage), `Spot-checked` (a few high-value milestones checked only), `Conflict` (sources disagree), `Needs detail` (no reliable steps or missing fields), `Not checked`. Never equate content presence with factual accuracy.

## Measured baseline (source, not gameplay truth)

- **42/42** numbered story mission cards are present in the recovered editable HTML.
- **35/42** core route summaries have fewer than 800 plain-text characters; **5/42** have fewer than 500. The Canari and Ivor core-route narratives have **1,751** and **3,221** characters respectively.
- **39/42** core route summaries are under 1,000 characters. This is a *detail proxy*, **not** an error count.
- Snapshot coverage: **203** side/EX quest cards (the game distinguishes 200 numbered side missions and three EX missions); **20** Wild Zone cards; **232** rendered Lumiose Pokédex entries; approximately **19** linked standalone routes were only placeholders at recovery.
- Source recovery identified **154 generic item-location descriptions out of 264** item-list entries; these must not be treated as verified pickup directions.
- The separately loaded Hyperspace Pokédex and original Supabase ratings/reports were not in the saved source; these require separate work.

## Findings grounded against outside sources

| ID | Area | Evidence and comparison | Next action | Confidence |
|---|---|---|---|---|
| G-01 | Mable's Research | Rebuilt `mable-research.html` was a placeholder, despite official recognition of Mable's task system. Serebii and Bulbapedia agree on the level 2–50 ladder, including **three** Gold Bottle Caps at level 48, one Master Ball at 49 and Shiny Charm at 50. | Replace placeholder with the verified reward table and instructions (included in this branch); independently expand the full individual task tiers later. | High for level rewards |
| G-02 | Mission 03 | Existing card says catch five species and claim Mable's reward but lacks explicit **return to Research Lab / report to Mable / claim first TM through the X menu**. Bulbapedia's objective list and a gameplay walkthrough include these steps. | Expand Mission 03 with complete in-game interface steps and verify map directions. | High |
| G-03 | Mission 14 — Canari | Recorded quiz password, True/False sequence, Eelektross dessert, Mani, Tarragon and Canari battles agree with Serebii/Thonky. **TM066 Volt Switch and an Autographed Plush** are reported rewards but absent from the core card. | Preserve the working detailed path, add rewards after verifying presentation, then compare all location details. | High for sequence and rewards; full page not certified |
| G-04 | Mission 19 — Ivor | Hidden-wall investigation identifies four objects and is corroborated by detailed walkthroughs. **TM011 Bulk Up** is awarded after Ivor; the card omits it. One external guide lists Heracross Lv. 44 while Serebii and another walkthrough report Lv. 45. | Keep the 4 clues and sewer passage, add reward when editing; reconcile Heracross level with game footage before marking complete. | High for route/bonus TM; conflict on one level |
| G-05 | Mission 25 | Core card covers the Lida→Naveen sequence but gives no roster/levels. Serebii and Thonky describe Lida's four Pokémon (Lv. 46–48) and Naveen's four (Lv. 48–50, ending Mega Scrafty). | Expand into distinct match preparations, route to battle court, partner battle lists, outcomes. | High |
| G-06 | Side request 002 | Site lists reward names without quantities. Serebii's specific mission page, PowerPyx and the Bulbapedia walkthrough give **5 Poké Balls and 3 Potions**; a Bulbapedia summary table says one Potion. | Record conflict; prefer direct game verification before a sitewide quantity import. | Majority agreement, one conflicting table |
| G-07 | Roto-Glide | Guides disagree about whether the rooftop tutorial is designated Mission 15 or Mission 16; Mission 16 opens within Mission 15's case chain. | Describe trigger by exact **rooftop tutorial during the Beedrill case** rather than a categorical quest-number claim until footage is checked. | Provisional |
| G-08 | DLC numbering | Bulbapedia distinguishes numbered side missions 1–119 (base), 120–200 (DLC), plus EX1–EX3; 203 total entries is therefore not 203 numbered missions. | Label UI as **200 numbered + 3 EX** and separately verify DLC content. | High |
| G-09 | City items/maps | Many items are generic area hints or random drop possibilities. The recovered map explicitly warns of approximate pins. | Require evidence for entrances/altitude/roof access and separate fixed, vendor, NPC, random-drop and repeatable loot. | Confirmed source limitation |
| G-10 | Empty article pages | Mable, shiny hunting, shops, detailed missions and other linked standalones did not have content in the MHTML source. | Rebuild and cite one at a time; Mable is first in this branch. | Confirmed source limitation |

## All 42 mission cards — depth inventory, not certification

Core summary counts below exclude most appended map/item/sidequest panels. **All missions still require a full end-to-end check.**

| No. | Mission | Core chars | Detail assessment | Priority | External fact-check |
|---:|---|---:|---|---|---|
| 01 | Get Your Travel Bag Back | 481 | Short — needs expansion | P1 | Not independently checked |
| 02 | Escape from the Battle Zone | 445 | Short — needs expansion | P1 | Not independently checked |
| 03 | A New Life in Lumiose City | 644 | Short — needs expansion | P1 | Not independently checked |
| 04 | Battling in the Z-A Royale | 562 | Short — needs expansion | P1 | Not independently checked |
| 05 | The City in the Shadow of Prism Tower | 834 | Medium — needs expansion | P2 | Not independently checked |
| 06 | Reaching Rank X | 675 | Short — needs expansion | P1 | Not independently checked |
| 07 | Reaching Rank W | 586 | Short — needs expansion | P1 | Not independently checked |
| 08 | Reaching Rank V | 570 | Short — needs expansion | P1 | Not independently checked |
| 09 | Chase That Mysterious Pokémon | 836 | Medium — needs expansion | P2 | Not independently checked |
| 10 | The Secrets of Mega Evolution | 1125 | Medium — needs expansion | P2 | Not independently checked |
| 11 | A Rogue Mega Slowbro | 649 | Short — needs expansion | P1 | Not independently checked |
| 12 | A Rogue Mega Camerupt | 655 | Short — needs expansion | P1 | Not independently checked |
| 13 | A Rogue Mega Victreebel | 619 | Short — needs expansion | P1 | Not independently checked |
| 14 | Reaching Rank E | 1751 | Reference depth | P1 | Spot-checked; not fully certified |
| 15 | A Job for Team MZ | 697 | Short — needs expansion | P1 | Not independently checked |
| 16 | A Rogue Mega Beedrill | 559 | Short — needs expansion | P1 | Not independently checked |
| 17 | A Rogue Mega Hawlucha | 626 | Short — needs expansion | P1 | Not independently checked |
| 18 | A Rogue Mega Banette | 600 | Short — needs expansion | P1 | Not independently checked |
| 19 | Reaching Rank D | 3221 | Reference depth | P1 | Spot-checked; not fully certified |
| 20 | A Request from the Rust Syndicate | 944 | Medium — needs expansion | P1 | Not independently checked |
| 21 | A Rogue Mega Mawile | 560 | Short — needs expansion | P1 | Not independently checked |
| 22 | A Rogue Mega Barbaracle | 514 | Short — needs expansion | P1 | Not independently checked |
| 23 | A Rogue Mega Ampharos | 587 | Short — needs expansion | P1 | Not independently checked |
| 24 | Reaching Rank C | 625 | Short — needs expansion | P1 | Not independently checked |
| 25 | A Showdown on the Battle Court | 407 | Short — needs expansion | P1 | Not independently checked |
| 26 | An Invitation from the SBC | 743 | Short — needs expansion | P1 | Not independently checked |
| 27 | A Rogue Mega Froslass | 553 | Short — needs expansion | P1 | Not independently checked |
| 28 | A Rogue Mega Altaria | 595 | Short — needs expansion | P1 | Not independently checked |
| 29 | A Rogue Mega Venusaur | 551 | Short — needs expansion | P1 | Not independently checked |
| 30 | Reaching Rank B | 673 | Short — needs expansion | P1 | Not independently checked |
| 31 | A Summons from Vinnie | 544 | Short — needs expansion | P1 | Not independently checked |
| 32 | A Rogue Mega Dragonite | 587 | Short — needs expansion | P1 | Not independently checked |
| 33 | A Rogue Mega Tyranitar | 532 | Short — needs expansion | P1 | Not independently checked |
| 34 | A Rogue Mega Starmie | 578 | Short — needs expansion | P1 | Not independently checked |
| 35 | Reaching Rank A | 953 | Medium — needs expansion | P2 | Not independently checked |
| 36 | Prism Tower’s Dark Turn | 516 | Short — needs expansion | P1 | Not independently checked |
| 37 | Operation Protect Lumiose | 714 | Short — needs expansion | P1 | Not independently checked |
| 38 | The Future of Lumiose City | 631 | Short — needs expansion | P1 | Not independently checked |
| 39 | The Infinite Z-A Royale | 656 | Short — needs expansion | P1 | Not independently checked |
| 40 | The One That Gives | 454 | Short — needs expansion | P1 | Not independently checked |
| 41 | The One That Takes | 442 | Short — needs expansion | P1 | Not independently checked |
| 42 | To Keep the World in Balance | 605 | Short — needs expansion | P1 | Not independently checked |

## Release-quality checklist for **every** mission

- [ ] Correct number, official in-game title and prerequisite.
- [ ] Correct starting character, exact location and entrance/height level.
- [ ] Complete ordered objective chain without skipped cutscenes, hidden walls or mandatory side quests.
- [ ] Accurate puzzle answers, investigation targets and navigation instructions.
- [ ] Every required opposing Pokémon, level, Mega Evolution and useful counters checked.
- [ ] Item/XP/TM/currency/reward values and exact quantities checked against game or reliable independent evidence.
- [ ] Unlocks, next quest and permanently repeatable versus one-time actions identified.
- [ ] Images and map markers match an actually reachable place, not just a guessed marker.
- [ ] Mobile page, buttons, deep links and consistent navigation tested.
- [ ] Two source references recorded, or in-game capture where sources disagree. An editor/date and evidence status recorded.
- [ ] Live GitHub Pages render checked **after** changes merge; any public preview remains separate from original ChatGPT Site.

## Suggested sequencing

**Pass A:** Missions 1–10 and Mable, then 11–20, then 21–30, then 31–42. Correct the recovered source section and regenerate `index.html` in the same commit; do not edit the generated page alone.  
**Pass B:** All 200 numbered side missions + EX1–EX3; verify unlock, objectives, rewards and requirements for DLC.  
**Pass C:** DLC hyperspace missions and Pokédex, Pokémon forms/locations/evolutions, boss rosters, research, shops, Mega Shards, shiny hunting.  
**Pass D:** Pickup coordinates, entrance paths, rooftop/scaffold/Holovator maps, mobile/desktop acceptance and progress widgets.

**Safety:** This branch does not alter the original ChatGPT Site, its live URL, Supabase or the database. Do not merge any gameplay claim merely because it looks plausible.

## Evidence register — checked 21 November 2026

1. Official Pokémon, Mable: https://legends.pokemon.com/en-us/story-world/characters/mable
2. Official Pokémon, game mechanics/real-time combat: https://legends.pokemon.com/en-us/gameplay
3. Serebii, missions index: https://www.serebii.net/legendsz-a/mainmissions.shtml
4. Serebii, Mable rewards: https://www.serebii.net/legendsz-a/mablesresearch.shtml
5. Serebii, Canari: https://www.serebii.net/legendsz-a/mainmissions/reachingranke.shtml
6. Serebii, Ivor: https://www.serebii.net/legendsz-a/mainmissions/reachingrankd.shtml
7. Serebii, mission 25: https://www.serebii.net/legendsz-a/mainmissions/ashowdownonthebattlecourt.shtml
8. Serebii, side request 002: https://www.serebii.net/legendsz-a/sidemissions/auseforanevolutionstone.shtml
9. Bulbapedia, mission/side-mission objectives: https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)
10. Bulbapedia, Mable's research: https://bulbapedia.bulbagarden.net/wiki/Mable%27s_research
11. Thonky, Mission 03: https://www.thonky.com/pokemon-legends-z-a/main-mission-03-a-new-life-in-lumiose-city
12. Thonky, Mission 14: https://www.thonky.com/pokemon-legends-z-a/main-mission-14-reaching-rank-e
13. Thonky, Mission 19: https://www.thonky.com/pokemon-legends-z-a/main-mission-19-reaching-rank-d
14. Thonky, Mission 25: https://www.thonky.com/pokemon-legends-z-a/main-mission-25-a-showdown-on-the-battle-court
15. PowerPyx, side mission inventory: https://www.powerpyx.com/pokemon-legends-z-a-all-side-mission-locations-main-missions/
16. Pokémon Legends: Z-A Mega Dimension mission classification: https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Legends%3A_Z-A_%E2%80%93_Mega_Dimension
