# AT-270 — Mission 36→37 Ivor/Gwynn three-Mega gameplay gap

**Date:** 22 November 2026. **Target:** independent GitHub guide (Edition B) only. **Source of issue:** genuine player feedback report #18 / [issue #82](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/82) (AT-047; source feedback remains private and preserved).

## Audited defect
The preserved main-guide Mission 36 card described the teammate duel and preparation; Mission 37 gave only the ally-group list and Ange ending. Neither detailed the three-Pokémon battle alongside Ivor and Gwynn, what to use against them, or how to reach the next ally wave. The separate `walkthrough.html` and `journey.html` repeated that omission. Mission 19 Josée/Seed of Mastery and illusory sewer wall were independently checked and already documented; **no redundant changes were made to Mission 19.**

## Independently verified mission facts (researched expansion, not present in old source)
- Mission 36: "Prism Tower's Dark Turn" culminates in the teammate fight / team plan; the Ivor/Gwynn ally segment is **Mission 37, Operation Protect Lumiose** (Bulbapedia mission objectives and Thonky).
- Follow the marked route south, around the dead end and left through the park to meet Ivor and Gwynn. Their simultaneous Rogue Mega wave is **Mega Pidgeot (Normal/Flying), Mega Kangaskhan (Normal), Mega Garchomp (Dragon/Ground), Lv. 62**. Encounter and level independently corroborated by Thonky, Neoseeker and GameTrek, plus Bulbapedia triple-battle listing.
- **Ice** targets both Pidgeot (2×) and Garchomp (4×); Pidgeot is also weak to Electric and Rock, and Kangaskhan to Fighting. Example moves Ice Beam, Thunderbolt and Brick Break apply **only if available in the player's team**. With three Megas in the arena, isolate one while allies engage the others, dodge attack circles and heal between waves (Bulbapedia battle guidance).
- Follow Ivor over the bridge and canal-side stairs to Canari and Tarragon, where the next Mega Blastoise and Mega Steelix wave occurs (Thonky).

### Research references (do not copy text or images)
- https://www.thonky.com/pokemon-legends-z-a/main-mission-37-operation-protect-lumiose
- https://www.neoseeker.com/pokemon-legends-z-a/Main_Mission_37
- https://gmtreks.com/pokemon-z-a/main-missions/38
- https://bulbapedia.bulbagarden.net/wiki/Triple_Battle
- https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)

## Safe implementation
- Add **labelled researched steps only** to the existing Mission 36 and 37 lists in: `src/sections/walkthrough.html`, the generated `index.html`, `walkthrough.html`, `journey.html`. Preserve original text, all story titles, 42 IDs, completion checkboxes, 203 side quest IDs, Art, source manifest, maps and 25-link nav.
- The source editor and generated index must match exactly when rebuilding via `scripts/build.py`. The captured original content stays in Git history; the additions are visibly marked as research, not disguised as original archive text.
- Add a narrowly scoped AT-270 regression test for all four guide copies, checked-in build reproducibility, progression/card invariants and protected city-navigation controls. Run existing article, static and Atlas Chromium desktop/mobile regressions at exact PR head.

## Absolute protection rule
- [Issue #99](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/99) protects the restored map baseline: original 1920×1920 map image, 25 city view regions, 48 sector links, 20 Wild Zones, 21 researched Holovators, all 111 original owner photographs, map layers/gestures/compass, 264 original item records, 100 Screws, 146 approximate leads, saved progress, Supabase and original Workspace site.
- This patch **adds no new maps, coordinates, dynamic DLC distortion pins, database mutations, progress writes or external-site links in the guide**.
- Report #18 stays in Supabase; do not claim original Workspace site fixed or mark "BOTH VERIFIED". After GitHub Pages deploy, independently check the guide text in the live B URL and record GitHub-specific evidence. Original A must be inspected and updated later under separate permission and tests.
