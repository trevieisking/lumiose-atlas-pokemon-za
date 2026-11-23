# AT-271 — M24–25 factual repair: Hotel Z ending, Corbeau types and Team MZ court

**Date:** 23 November 2026 · **Target:** independent GitHub Edition B only · **Reports:** genuine anonymised feedback #13 / #14, [issue #6](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/6) · **Map protection:** permanent [issue #99](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/99).

## Source audit — confirmed issues, not a rebuild
- The saved Mission 24 in `src/sections/walkthrough.html` and its exact standalone/Journey copies ended with the Corbeau match and erroneously claimed Ground was super-effective against **Mega Scolipede**. The separate `royale-guide.html` repeated the same bad type claim. **Mega Scolipede remains Bug/Poison: Ground 2× against Poison times ½ against Bug = neutral overall.** It is weak to Fire, Flying, Psychic and Rock; Corbeau's Arbok is weak to Ground/Psychic and Gyarados is 4× weak to Electric.
- Mission 24 omitted **TM100 Gunk Shot**, returning to **Hotel Z**, Lida/Naveen and Taunie/Urbain's discussion of the debt, and Corbeau checking into the hotel that evening. The **next-morning tip and debt settlement** belong to the transition into **Mission 25**; do not move them incorrectly into the immediately post-battle objective.
- Original Mission 25 gave only two steps and no teams, levels, opponent counters, AZ's Mega Ring scene or northwest approach to the Battle Court by Vernal Pokémon Center, Vert Sector 4. It also implied no planned counter selection; this is verified by owner feedback #14.
- Owner-saved original mission text and all original game-guide features remain. New narrative steps are explicitly labelled `Researched` or `Verified` and are NOT presented as hidden original source code.

## Corrected factual sequence
1. Mission 24: Earn ticket; return to the Rust Syndicate HQ, speak with **Philippe**, then battle Corbeau: Arbok Lv50, Gyarados Lv51, Roserade Lv51, Mega Scolipede Lv52. Collect **TM100 Gunk Shot** and Rank C.
2. Return to Hotel Z. Team MZ celebrate/discuss debt; Corbeau checks in for the night. The next morning, his generous tip clears Taunie/Urbain's debt. AZ grants Lida and Naveen their Mega Rings/Stones; Lida's unevolved Staryu cannot Mega Evolve yet.
3. Mission 25: Go northwest from Hotel Z to the Vert Sector 4 Battle Court near **Vernal Pokémon Center**. Talk to Lida when ready. Her roster: Clawitzer Lv46 (Water), Vanillish Lv46 (Ice), Emolga Lv47 (Electric/Flying, **Ground-immune**), Staryu Lv48 (Water).
4. Talk to Naveen next. His roster: Ariados Lv48 (Bug/Poison), Sableye Lv48 (Dark/Ghost, **Psychic-immune**, Fairy-weak), Krookodile Lv49 (Ground/Dark, **Electric-immune**), Mega Scrafty Lv50 (Dark/Fighting, **Fairy 4×**; Fighting/Flying 2×). Battle tactics are type suggestions, not promises about a player's current moves. Existing saved guide lists **Ampharos/Florges in newly opened Wild Zone 16** as *optional* local Pokémon to seek if they spawn.
5. Finish both Team MZ battles to proceed to Mission 26. **Wild Zones 16–17** retain existing map previews, item links, and alpha notes unchanged.

## Independent references
- Main Mission 24 [Serebii](https://www.serebii.net/legendsz-a/mainmissions/reachingrankc.shtml), [Thonky](https://www.thonky.com/pokemon-legends-z-a/main-mission-24-reaching-rank-c), [StrategyWiki](https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/Reaching_Rank_C).
- Main Mission 25 [Serebii](https://www.serebii.net/legendsz-a/mainmissions/ashowdownonthebattlecourt.shtml), [Thonky](https://www.thonky.com/pokemon-legends-z-a/main-mission-25-a-showdown-on-the-battle-court), [Bulbapedia mission objective table](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)), [Bulbapedia Lida](https://bulbapedia.bulbagarden.net/wiki/Lida), [Bulbapedia Naveen](https://bulbapedia.bulbagarden.net/wiki/Naveen).
- Types: [Mega Scolipede RotomLabs](https://rotomlabs.net/dex/legends-z-a/scolipede/mega), [Mega Scrafty RotomLabs](https://rotomlabs.net/dex/legends-z-a/scrafty/mega).
- Original owner-saved local source: `src/sections/walkthrough.html`, `src/template.html`, `journey.html`, `walkthrough.html`, `royale-guide.html`, and `docs/qa/MAIN_STORY_021_030_SOURCE_AUDIT_2026-11-21.md`.

## Implementation / gates
- Modify only **M24/M25 text and single M24 Royale tactical sentence**. The unmodified generated homepage sections must remain byte-for-byte identical; regenerate using `scripts/build.py`. Do **not** touch maps, sectors, 25-zone selector, Holovator markers, ladders, owner photo gallery, M19/M37 corrections, indexed source manifest, progress state, feedback forms or Supabase.
- New `tests/mission24_25_source_parity.test.mjs` checks all four guide representations for the same researched facts, wrong-type text removal, all original steps intact, completion IDs and city navigation controls. Full existing article-source/static and map geometry/desktop/touch CI must pass.
- Phone and desktop screenshots exercise the affected mission cards and battle guide; screenshots are test artifacts, not a new site image/deployment. Preserve exact reviewed SHA and successful Pages workflow in evidence.
- **Report #13 and #14 must remain stored and OPEN for original Workspace A**, which cannot be assumed to receive GitHub changes. Never auto-close or delete private feedback from this PR; neither the original ChatGPT Workspace site nor its progress keys are edited.

**Status:** Proposed researched correction; label as shipped only after green exact-head CI + merge SHA + successful independent GitHub Pages deployment. Manual owner gameplay verification is a separate quality gate.
