# Lumiose Atlas — owner PDF recovery queue

**Inventory:** 19 uploaded PDF files, 213 printed PDF pages (received 21 November 2026).

**Current verified milestone:** **14 of 19 standalone recovery routes merged and deployed; 5 standalone placeholders remain.** Ranked Battles [PR #40](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/40) passed [CI #44948454815](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44948454815), merged as `55cc1d8a9bcbc8abcae2826139b1affcdc1db586` and deployed successfully via [Pages #44948509457](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44948509457). **All 19 owner-provided PDF captures have been located in the Library** (14 standalone article captures plus 5 main-guide section captures). No re-upload of those 19 is necessary. The remaining five missing *standalone* source articles/maps are not included as separately expanded PDFs; their main-page sections or overview information survive. The PDFs are rendered page captures, **not** original editable Workspace source. The reconstructed 17-section guide, original Workspace Site and Supabase remain untouched. Restore one source-backed page at a time.

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
| Pokémon HOME rewards and transfer guide (14) | `home-connection.html` · Pokémon HOME | **RESTORED · MERGED #35 · DEPLOYED** — 3 first-transfer Alpha partners, three-dex Shiny Volcanion, safe transfer restrictions, all 364 PDF species and manual checklist; 108 disclosed remote portraits |
| Maps (4) | `maps.html` · Lumiose maps; **not the 48 sector / nine Hyperspace close-ups** | **RESTORED · MERGED #25 · DEPLOYED** — 20 source-aligned city pins, 264 original item entries, 38 fixed Alphas, 25 nearby Screw clues and clearly labelled overview zoom; unavailable close-ups left separate |
| Rewards (3) | `rewards.html` · Online rewards | **RESTORED · MERGED #38 · DEPLOYED** — 6 original PDF gift/event cards, matching artwork, HOME/hidden-play/ranked links, all 25 menu links; CI #44947504365 and Pages #44947591562 passed |
| Battles (3) | `battles.html` · Ranked battles | **RESTORED · MERGED #40 · DEPLOYED** — 7 illustrated Rank Y–S Mega Stones, 4 tiered Mega Shard rewards, 3 setup steps, 3 arena tips, 25-link menu, separately verified Season X eligibility; CI #44948454815 and Pages #44948509457 succeeded |
| Berries (24) | `index.html#berries` · Ultimate berry book | INLINE AUDIT (37 recipes present in Stage 1) |
| Pokedex (25) | `index.html#pokedex` · Lumiose Pokédex | INLINE AUDIT (232 species cards present in Stage 1) |
| Starters (3) | `index.html#starters` · Starter stats | INLINE AUDIT |
| Secrets (3) | `index.html#secrets` · Secrets & tricks | INLINE AUDIT |
| Bosses (6) | `index.html#bosses` · Boss battles | INLINE AUDIT |

**Recovery slice completed and deployed:** the 10-page Legends PDF (page 10 is footer only) now has a 25-card restored standalone fieldbook sharing the main guide’s obtained checkmarks. **PR #33** passed source/progress/static/feedback regression tests and GitHub Pages deployment succeeded. **11 of 19 restored routes are live, 8 still pending.** The next captured standalone source candidate is the 14-page Pokémon HOME guide; full 48-sector maps remain an independent open requirement in issue #28. Mystery Gift availability and Special Scan guarantee precision await the planned fresh playthrough.

**Prior one-PDF recovery slice:** Pokémon HOME transfer & rewards, all 14 printed pages. The independent PDF-to-text roster has **364 distinct National numbers, 232 Lumiose and 132 Hyperspace** and canonical SHA-256 **`a36169f8a22e9e0d8ec1369f4da29966e5b32b4f3dad5c5396d31b2a319f7cc5`**. Each of the original 232 Lumiose entries was matched against saved `src/sections/pokedex.html` by number, name, type and order. The first-transfer Alpha gift, 3-dex shiny reward and one-way warning were independently cross-checked with official Pokémon HOME/Pokémon notices; no Nintendo-account integration is implied. Image ownership caveat: 236 preserved local dex portraits, 20 existing archive portraits, 108 PokeAPI-hosted fallback images that may not load offline. **Verified live milestone: 12/19 recovered standalone routes, 7 still pending.** PR #35 passed all PDF/state/static/feedback tests (Actions #44943076452) and Pages deployment succeeded (Actions #44943148212). The 48 precise sector maps remain open in issue #28.

> **21 November 2026 · VERIFIED:** Online Rewards 3-page source was restored and released in [PR #38](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/38), with CI #44947504365 and Pages #44947591562 both successful. **13/19 standalone routes now deployed, 6 remain.** The next source-backed page is the 3-page **Ranked Battles** guide. No changes to the original ChatGPT Site.

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

**Latest deployed recovery milestone:** Mable's Research, Shiny Hunting, Complete Journey, Z-A Royale, Rogue Mega Bosses, Complete Type Chart, Alpha Fieldbook, Shops, Lumiose Maps, Item Atlas, Legendary Fieldbook, Pokémon HOME, Online Rewards and **Ranked Battles** have passed CI and GitHub Pages deployment (**14 of 19 standalone routes**). **Five missing standalone routes:** `walkthrough.html`, `side-missions.html`, `mega-dimension.html`, `sector-maps.html`, `hyperspace-maps.html`. Existing main-guide content remains; no full separate source PDF for these five was found in the 19-file Library capture. Do not infer absent map close-ups or collapsed mission text. The 48-sector numbered pin project remains tracked in [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28). The original Workspace Site must not be replaced or modified.

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
