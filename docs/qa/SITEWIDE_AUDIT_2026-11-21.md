# Lumiose Atlas — whole-guide inventory and fact-check queue
**Opened:** 21 November 2026  
**Repository:** `trevieisking/lumiose-atlas-pokemon-za` — independent recovered guide, **not** the original ChatGPT Site source  
**Audit state:** Source inventory completed; independent factual verification has **not** been completed for every card or map.

## Recovery-wide inventory

| Section/source file | Found content | Limitation | Required fact checks | Status |
|---|---|---|---|---|
| home | Overview | Main navigation and feature entrypoints | UI parity, internal links and returning to walkthrough | Not functionally retested |
| walkthrough | 42 main missions | 39/42 core route summaries under 1,000 characters | Full route, battles, puzzles, exact rewards and correct chronology | Inventory complete; targeted spot-check |
| sidequests | 203 side/EX cards | 200 numbered side missions + EX1–EX3 | Each unlock, requester, item quantity, battle, location and reward | Index counted; entries not fact-certified |
| dimension | 14 DLC mission cards | Original snapshot content only | 12 hyperspace missions, portal/donut and special-scan mechanics; story prerequisites | Not individually verified |
| bosses | 16 Rogue Mega cards | Captured early boss notes | Opponent level, attacks, weakness, phase/arena and reward | Not individually verified |
| alphas | 20 zone cards | City and zone Alpha overview | Time/weather/fixed versus random appearance, catching strategy | Not individually verified |
| maps | 20 Wild Zone markers; one city-map image | Approximate area pins | Exact entrances, layers, roof paths, elevators and marker identity | Geometry unverified |
| items | 20 zone groups / 264 listed pickups | 154 generic location placeholders | Precise fixed pickup route; distinguish NPC/vendor/random drops | High-risk source limitation |
| legends | 25 legendary/mythical cards | Captured summaries, not complete routes | Prerequisites, postgame events, combat, DLC, availability | Not individually verified |
| berries | 37 recipe cards; 66 berry entries | Saved recipes and item art | Ingredient quantities, effect levels and donut hyperspace mechanics | Not individually verified |
| starters | 3 starter cards | Initial choices | Levels, evolution, HOME unlock separation | Not individually verified |
| pokedex | 232 rendered Lumiose cards | Separate Hyperspace Pokédex unavailable | Species/form/dex numbers, exact locations, evolutions, DLC distinctions | Not individually verified |
| essentials | 6 advice cards | Short general advice | Mechanics, obedience, controls, battle timing, saving | Not individually verified |
| secrets | 13 tips | Includes HOME/gift and traversal claims | Preconditions, availability dates, tricks and rewards | Not individually verified |
| rewards | 6 reward entries | Potentially date-sensitive giveaway entries | Official event dates, codes, expiration, eligibility | Not current-verified |
| battles | 13 ranked/season entries | Ranked season data can expire | Official live rules and changes, dates and reward eligibility | Not current-verified |
| sources | 7 links | Source and attribution page | Links, licence/source dates, rightsholder attributions | Not exhaustively verified |

The user-facing site additionally links to **19 separate article routes** that were placeholders after MHTML recovery. This branch replaces **Mable's Research** with an independently sourced reward guide; other route pages must be rebuilt individually. **No Supabase form, ratings or submission table** has been reconnected, so no data changes or ratings resets should be undertaken.

## Playthrough-quality acceptance standard

Use the **Canari / Ivor mission depth** as a benchmark, not just visual styling. For each mission: start trigger; where to go with street/sector, entrance and floor/roof access; whom to talk to and exact answer choices; ordered mandatory objectives; enemy teams and levels; useful counters without inventing moves; exact reward quantities; and what happens next. A player should be able to follow the page from start to finish without consulting another guide.

For maps: show *confirmed* ladders, scaffolding, Holovators, roof connections and floor changes. Label any approximate pin **unverified search area**. A location row must say whether it represents a one-off floor item, fixed spawn, trainer gift, vendor inventory, random drop or repeatable source. Do not convert a possible hidden drop into a guaranteed pickup.

For DLC: separately track **Hyperspace Missions**, 81 DLC side missions (numbered 120–200), EX3 and any dex/form additions. A count of 203 side/EX cards is not 203 numbered quests. Verify donut power, time limits, portals, reward unlocks, and postgame prerequisites.

For all screens: preserve identical navigation; add a back-to-walkthrough action; test mobile scroll and tap accessibility; never link to another guide from the body to replace original guidance (bibliography/credits may list evidence); keep live status, dates and online-only rewards accurate.

## Research procedure for each card

1. Read the exact current GitHub source and identify the start, objective flow, traps, rewards and map assumptions.
2. Check official Pokémon gameplay/mechanics where applicable.
3. Compare **two independent walkthrough sources**, preferably Serebii, Bulbapedia, Thonky or gameplay video, writing new original explanations rather than copying their prose.
4. For disagreement (e.g., exact item quantity or NPC level), mark **source conflict**; resolve with recorded in-game evidence before asserting a corrected value.
5. Make the smallest isolated revision on a branch. Rebuild generated homepage from `src/sections` and verify `index.html` matches, plus run existing static tests. Verify real mobile interaction separately.
6. Mark only the *specific* card/fact as verified, with direct source URLs and date. Do not advance a whole category to verified because the counts agree.
7. Keep the original ChatGPT Site URL/database untouched; GitHub Pages is a **separate preview** and must not be mistaken for original hosting.

## Immediate work queue

**P1 — navigation and correctness:** Complete main-mission narrative pass for 1–42; replace placeholder article pages for Mable, Shiny Hunting, Shops, Journey, Sector Maps and Hyperspace Maps; resolve side request #002 quantity discrepancy; verify mission 3 first lab reward, mission 14 TM066/Autographed Plush, mission 19 TM011 and mission 25 rosters.

**P2 — completeness:** Numbered side missions 1–200 and EX1–EX3, base/postgame legends, HyperSpace mission details and all Pokémon locations/evolutions, Mega Stones, item vendors and categories.

**P3 — visual accuracy and runtime:** Ground/roof map screenshots, mobile menu and zoom parity, readable number ratings, independent feedback adapter and Supabase integration only after schema/permissions review.

## Evidence sources for this phase

- Official Pokémon gameplay: https://legends.pokemon.com/en-us/gameplay
- Official Mable research description: https://legends.pokemon.com/en-us/story-world/characters/mable
- Official Canari profile: https://legends.pokemon.com/en-gb/news/canari
- Serebii main missions: https://www.serebii.net/legendsz-a/mainmissions.shtml
- Serebii side missions: https://www.serebii.net/legendsz-a/sidemissions.shtml
- Serebii Mable's Research: https://www.serebii.net/legendsz-a/mablesresearch.shtml
- Bulbapedia mission classification: https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)
- Bulbapedia Mega Dimension: https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_Legends%3A_Z-A_%E2%80%93_Mega_Dimension
- Independent comparison: https://www.thonky.com/pokemon-legends-z-a/main-mission-14-reaching-rank-e
- Recorded full playthrough index (not frame-by-frame checked): https://www.youtube.com/watch?v=7u2fcY-m1vA

## Current completion truth

This is **Phase 1 inventory + selected source spot-checks**, *not* a claim that all facts in 42 missions, 203 side/EX entries or thousands of item/species fields are correct. See `docs/qa/MAIN_STORY_AUDIT_2026-11-21.md` for 42-row mission detail matrix and confirmed discrepancies.
