# Lumiose Atlas — owner PDF recovery queue

**Inventory:** 19 uploaded PDF files, 213 printed PDF pages (received 21 November 2026). The PDFs are the owner's exported **visible pages**, not editable source code or a source export. The 17-section saved MHTML reconstruction remains intact. Work **one PDF / article at a time**.

**Status labels:** RESTORED = standalone route rebuilt and checked against that PDF; PDF CAPTURED = reference available but route not yet rebuilt; INLINE AUDIT = existing captured main-page section to compare/verify; NEEDS SOURCE = no matching standalone article PDF. The original ChatGPT Site and original Supabase function are out of scope.

| PDF, printed pages | Destination / main menu label | Status at this checkpoint |
| --- | --- | --- |
| Mable’s research & rewards (5) | `mable-research.html` · Mable’s research & rewards | **RESTORED IN PR** — complete levels 2–50 and PDF's research route; TM move names independently checked; dedicated offline regression suite |
| Complete journey route (46) | `journey.html` · Complete journey route | PDF CAPTURED |
| Every Rogue Mega Boss: Counters and Moves (12) | `boss-guide.html` · Full boss plans | PDF CAPTURED |
| Z-A Royale: Every Promotion Battle (7) | `royale-guide.html` · Story Z-A Royale | PDF CAPTURED |
| Complete Type Chart and Weaknesses (6) | `type-chart.html` · Type matchups | PDF CAPTURED |
| Alphas (5) | `alphas.html` · Alpha fieldbook | PDF CAPTURED |
| Items (28) | `items.html` · Item atlas | PDF CAPTURED |
| Legends (10) | `legendaries.html` · Legendary routes | PDF CAPTURED |
| Shiny hunting routes & tactics (3) | `shiny-hunting.html` · Shiny hunting | **RESTORED IN PR** — original base/DLC hunting guidance, verified Mareep directions and a no-network shiny-odds estimator |
| Lumiose shops, items and Mega Shards (6) | `shops.html` · Shops & Mega Shards | PDF CAPTURED |
| Pokémon HOME rewards and transfer guide (14) | `home-connection.html` · Pokémon HOME | PDF CAPTURED |
| Maps (4) | `maps.html` · Lumiose maps; **does not capture every linked map close-up** | PDF CAPTURED |
| Rewards (3) | `rewards.html` · Online rewards | PDF CAPTURED |
| Battles (3) | `battles.html` · Ranked battles | PDF CAPTURED |
| Berries (24) | `index.html#berries` · Ultimate berry book | INLINE AUDIT (37 recipes present in Stage 1) |
| Pokedex (25) | `index.html#pokedex` · Lumiose Pokédex | INLINE AUDIT (232 species cards present in Stage 1) |
| Starters (3) | `index.html#starters` · Starter stats | INLINE AUDIT |
| Secrets (3) | `index.html#secrets` · Secrets & tricks | INLINE AUDIT |
| Bosses (6) | `index.html#bosses` · Boss battles | INLINE AUDIT |

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

**Completed recovery slices:** Mable's Research & Rewards (5 pages) and Shiny Hunting Routes & Tactics (3 pages), one at a time. Next captured standalone PDFs remain queued; the original site is never the destination for these changes.
