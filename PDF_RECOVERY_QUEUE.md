# Lumiose Atlas — owner PDF recovery queue

**Inventory:** 19 uploaded PDF files, 213 printed PDF pages (received 21 November 2026). The PDFs are the owner's exported **visible pages**, not editable source code or a source export. The 17-section saved MHTML reconstruction remains intact. Work **one PDF / article at a time**.

**Status labels:** RESTORED = standalone route rebuilt and checked against that PDF; PDF CAPTURED = reference available but route not yet rebuilt; INLINE AUDIT = existing captured main-page section to compare/verify; NEEDS SOURCE = no matching standalone article PDF. The original ChatGPT Site and original Supabase function are out of scope.

| PDF, printed pages | Destination / main menu label | Status at this checkpoint |
| --- | --- | --- |
| Mable’s research & rewards (5) | `mable-research.html` · Mable’s research & rewards | **RESTORED · MERGED #16** — complete levels 2–50 and PDF's research route; TM move names independently checked; dedicated offline regression suite |
| Complete journey route (46) | `journey.html` · Complete journey route | **RESTORED · MERGED #18** — 42 story, 14 Hyperspace, 20 zones, 42 practical-check sections; collapsed request text explicitly noted |
| Every Rogue Mega Boss: Counters and Moves (12) | `boss-guide.html` · Full boss plans | **RESTORED · MERGED #20 · DEPLOYED** — 16 story, 10 Mega Dimension, 2 finale plans, searchable boss cards |
| Z-A Royale: Every Promotion Battle (7) | `royale-guide.html` · Story Z-A Royale | **RESTORED · MERGED #19 · DEPLOYED** — 10 illustrated promotion teams, Canari quiz and story interruptions |
| Complete Type Chart and Weaknesses (6) | `type-chart.html` · Type matchups | **RESTORED · MERGED #21 · DEPLOYED** — 18 quick-reference cards, 324-cell chart and offline dual-type calculator; clipped columns independently checked |
| Alphas (5) | `alphas.html` · Alpha fieldbook | **RESTORED · MERGED #22 · DEPLOYED** — 20 zones, 38 fixed targets and saved 67-entry Zone 20 pool; HOME, fossils and DLC |
| Items (28) | `items.html` · Item atlas | **RESTORED · MERGED #27 · DEPLOYED** — 264 original records (56 random hidden outcomes), 100 numbered Screw clues, 48 verified sector names; exact map pins still pending in issue #28 |
| Legends (10) | `legendaries.html` · Legendary routes | **RESTORED · MERGED #33 · DEPLOYED** — 25 illustrated source-exact encounters (3 story / 2 gift / 13 DLC / 7 Special Scan), expandable original routes, shared obtained checkboxes; gift/scan caveats retained |
| Shiny hunting routes & tactics (3) | `shiny-hunting.html` · Shiny hunting | **RESTORED · MERGED #17** — original base/DLC hunting guidance, verified Mareep directions and a no-network shiny-odds estimator |
| Lumiose shops, items and Mega Shards (6) | `shops.html` · Shops & Mega Shards | **RESTORED · MERGED #23 · DEPLOYED** — 17 original PDF groups/190 entries + separately identified player-verified café drinks (10 items); 18 groups/200 items, Premier Ball ₽200 confirmed, both offline planners preserved |
| Pokémon HOME rewards and transfer guide (14) | `home-connection.html` · Pokémon HOME | PDF CAPTURED |
| Maps (4) | `maps.html` · Lumiose maps; **not the 48 sector / nine Hyperspace close-ups** | **RESTORED · MERGED #25 · DEPLOYED** — 20 source-aligned city pins, 264 original item entries, 38 fixed Alphas, 25 nearby Screw clues and clearly labelled overview zoom; unavailable close-ups left separate |
| Rewards (3) | `rewards.html` · Online rewards | PDF CAPTURED |
| Battles (3) | `battles.html` · Ranked battles | PDF CAPTURED |
| Berries (24) | `index.html#berries` · Ultimate berry book | INLINE AUDIT (37 recipes present in Stage 1) |
| Pokedex (25) | `index.html#pokedex` · Lumiose Pokédex | INLINE AUDIT (232 species cards present in Stage 1) |
| Starters (3) | `index.html#starters` · Starter stats | INLINE AUDIT |
| Secrets (3) | `index.html#secrets` · Secrets & tricks | INLINE AUDIT |
| Bosses (6) | `index.html#bosses` · Boss battles | INLINE AUDIT |

**Recovery slice completed and deployed:** the 10-page Legends PDF (page 10 is footer only) now has a 25-card restored standalone fieldbook sharing the main guide’s obtained checkmarks. **PR #33** passed source/progress/static/feedback regression tests and GitHub Pages deployment succeeded. **11 of 19 restored routes are live, 8 still pending.** The next captured standalone source candidate is the 14-page Pokémon HOME guide; full 48-sector maps remain an independent open requirement in issue #28. Mystery Gift availability and Special Scan guarantee precision await the planned fresh playthrough.

## Standalone routes still needing a full captured source or separate, fact-checked research

- `walkthrough.html` — the existing main 42-mission walkthrough survives in `index.html#walkthrough`. The 46-page journey PDF is a **different** article and cannot be treated as an exact capture of the detailed walkthrough.
- `side-missions.html` — the main guide has 203 side-mission cards; a full separate article PDF is not in this batch.
- `mega-dimension.html` — main expansion section and the berry PDF survive; the separate DLC standalone article has not been captured.
- `sector-maps.html` — the Maps PDF *mentions* 48 sector close-ups but does not include their fully expanded views or access coordinates.
- `hyperspace-maps.html` — the Maps PDF *mentions* nine Hyperspace layouts but does not contain all their enlarged views.

## Preservation and editorial rules

1. Recover the source PDF's page outline, sections, factual claims and navigation first. Do not infer unseen pages from a menu label as though they were recovered.
2. Expand only with independently verified game mechanics. Distinguish PDF text from new instructions, explanations and researched data.
3. Preserve the full 25-link guide navigation and a **Back to walkthrough** action on each restored page. Link to existing guide content rather than sending players to outside websites.
4. Keep offline-only progress under a new, per-article storage key. **Do not touch** the existing mission/side-mission progress, player reports, ratings, Supabase functions, credentials, domains or original ChatGPT Site.
5. Run deterministic, no-network tests; review exact changed-file list and CI before a controlled GitHub-only merge. Confirm mobile menu/reading and return navigation when possible.
6. Keep clearly labelled incomplete placeholders for missing pages until there is enough evidence to make an actual guide.

**Completed, deployed recovery slices:** Mable’s Research (5), Shiny Hunting (3), Complete Journey (46), Z-A Royale (7), Rogue Mega Bosses (12), Complete Type Chart (6), Alpha Fieldbook (5), Shops & Mega Shards (6), and Lumiose Maps (4). **Ten of 19 standalone routes are deployed.** The 28-page Item Atlas is restored and verified. **Next map phase (tracked in [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28)):** establish each of 48 sectors’ real boundary, high-resolution map and confirmed numbered item/Screw/ladder/Holovator coordinates. Do not claim that the 264 source records are all fixed city pickups. Nine Hyperspace close-ups also remain unverified. Preserve the original ChatGPT Site as read-only context.

## Repeatable one-PDF-at-a-time loop

1. **Pick one pending owner PDF**, and confirm the exact live GitHub placeholder route and original PDF page count.
2. **Inspect all PDF pages**, including visual tables/maps and what was collapsed at print time. Verify structural counts and key checkpoints; do not fabricate missing text.
3. **Rebuild only that route**, copying the complete 25-link menu and Back to walkthrough; add relevant internal maps, item, side request and mission links.
4. **Make one bounded branch and PR**, with its own offline regression tests (source fidelity, navigation, search and mobile CSS).
5. **Run old and new CI together**, including unmodified main 17 sections, player progress, shared feedback form and absence of secrets.
6. **Compare changed files and exact PR HEAD**, merge to GitHub `main` only when all CI is green; record the merge SHA and Pages deployment result.
7. **Mark the PDF recovered** in this queue and update `routes.json`, `RECOVERY_STATUS.md` and `README.md`. Keep unverified manual/mobile checks explicit.
8. **Repeat with the next PDF**. A completed article is never grounds to alter the original ChatGPT Site, database, domain or underlying reconstructed walkthrough.

This is a user-driven iterative workflow, not a scheduled or background job. Each step must finish with verifiable GitHub evidence.
