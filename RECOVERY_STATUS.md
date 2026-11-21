# Recovery status — 21 November 2026

## Player-confirmed in-game café menu and Premier Ball (21 November 2026)

The owner provided four photographs of a **café truck interaction**, showing the three category menus and the item names in order, then supplied all ten prices separately in chat. Coffee: Ember Roast ₽250, Flamethrower Roast ₽250, Fire Blast Roast ₽250, Burn Up Roast ₽300. Tea: Panchamomile Tea ₽250, Wooloolong Tea ₽300, Roserade Tea ₽350. Something else: Moomoo Milk ₽200, Fresh Water ₽100, Sparkling Water ₽100. The owner also independently confirmed **Premier Ball ₽200** from the game. The photographs do **not** prove the truck's exact street or identify it as **Nouveau Café Truck No. 3**, so the ten drinks are stored as an explicitly player-verified **18th, separate catalogue group** rather than being attributed to the six-page PDF's berry truck. Their menu names/order come from photographs; prices come from the owner's firsthand report. Existing original 17 PDF groups/190 entries, Mega Shard and Screw planners, original source, feedback and player progress remain unchanged. Only the player-confirmed Premier Ball conflict flag is cleared; the Poké Ball and Sharpedonite disagreements stay visible.

**This is a bounded follow-up PR**, not another standalone PDF recovery. Total restored routes remain **8 of 19**, with 11 placeholders still awaiting recovery. The main ChatGPT Site, Supabase and protected feedback system are untouched. Merge/deployment confirmation must be logged after green CI.


## Stage 2 update — Shops & Mega Shards (MERGED #23 · PAGES SUCCESS)

Owner-provided six-page **Lumiose shops, items and Mega Shards** PDF was transcribed to `shops.html`: **17 shop/exchange groups** and **190 listed item records** across Pokédollar vendors, Mega Shard exchanges and the Canari plush Colorful Screw desk. The original shop location, availability notes, group inventory, cost, Mega Shard target totals (540 ×4 Drives, separate 999-Shard Magearna request), permanent plush effects and postgame worker lists are preserved. An offline search and two read-only budget planners were added: one for Mega Shards and one for five Canari plush upgrades with the free Red Lv. 1 accounted for. The original guide’s 25-link navigation and Back to walkthrough are preserved; no player state or database calls.

**Evidence qualification:** Bulbapedia, Serebii Pokéarth and other sources disagree on particular Poké Ball, Premier Ball and Sharpedonite prices. The PDF’s prices are retained with visible in-game verification warnings rather than silently overwritten. Some DLC shop prices were absent from the PDF and are explicitly left unspecified.

**PR #23 passed the recovery suite and merged as `7db9bbddfd2de82778e11853f8b9b35124cc60a6`; GitHub Pages deployment #44932835597 succeeded. At this checkpoint 8/19 standalone routes were restored, with 11 placeholders remaining.** No changes to original ChatGPT Site or Supabase.


## Stage 2 update — Alpha Fieldbook (MERGED #22 · PAGES SUCCESS)

The five-page owner Alpha Fieldbook PDF captures 20 Wild Zone cards, **38 fixed zone targets** with levels/day-night conditions and the extra Alpha methods. Its Zone 20 full 67-species pool was collapsed during PDF export. The original saved MHTML main-page section `src/sections/alphas.html` **does** preserve all 67 names and ranges, so the new standalone `alphas.html` recovers these explicitly from that independent source, not from invented or unseen PDF text. HOME Alpha starter gifts were checked against the official Pokémon HOME site, DLC Alpha Power rates against Serebii and Bulbapedia, and the Mission 40 encounters against Bulbapedia. Search, range filters, source portraits, 25-link menu, map links and a Back to walkthrough action are added without altering original progress or the feedback form.

**PR #22 passed the full recovery workflow and merged as `8c1de167bc47be523b17b6635fc0dcee8c703829`; GitHub Pages deployment #44932311836 succeeded for that exact commit. At this checkpoint 7/19 standalone routes were restored, with 12 placeholders remaining.** Original ChatGPT Site and Supabase unchanged.


## Stage 2 update — Full Type Chart (MERGED #21 · PAGES SUCCESS)

The owner-provided six-page **Complete Type Chart and Weaknesses** PDF supplies the visible type-effectiveness table (its first 12 defence columns) and 18 complete quick-reference summaries. The restored `type-chart.html` adds all **324** move-vs-defender pairs and the missing six columns from the modern Gen VI-onward table (independently verified against Bulbapedia), a mobile-scrollable table and an offline dual-type calculator. Standard rules are distinguished from Rogue Mega battle-specific exceptions. The original 25-link navigation and Back to walkthrough are retained. Dedicated read-only regression tests cover every quick-reference weakness, immunities, 324 cells, 4× and ¼× examples, and existing feedback/static integrity.

**PR #21 passed all read-only checks and merged as `9e6aad066c63b344a5f2b61eda429838436aa9e4`; Pages deployment #44929668532 succeeded. At this checkpoint 6/19 routes were restored, with 13 placeholders remaining.** No original Site or Supabase changes.


## Stage 2 update — Rogue Mega Boss plans (MERGED #20 · PAGES SUCCESS)

The owner’s 12-page Rogue Mega Boss PDF is transcribed to `boss-guide.html`: **16 story**, **10 Mega Dimension**, and **2 finale** encounter cards. Each keeps its original counter example, move plan, weakness, danger cue and tactical advice. Responsive species portraits, a 25-link menu, Back to walkthrough and offline filters are added. Tests assert all 28 cards, menu parity, local assets, and no player-progress writes. **PR #20 passed CI and merged as `c170e5ed6979f5f26c2d028b086c45f707bcd246`; GitHub Pages deployment #44928992739 succeeded for the exact merge commit.**

**At this completed step: 5/19 restored, 14/19 placeholders remained.**


## Stage 2 update — Story Z-A Royale promotion battles (21 November 2026)

The seven-page owner's **Z-A Royale: Every Promotion Battle** PDF has been restored into `royale-guide.html`, with **10 promotion opponents and 40 Pokémon illustrations**, all local `dex-art` images, source-recorded levels, suggested counters and move plans. A full Canari entrance/quiz/Tarragon sequence and the interruptions before Ivor/Jacinthe are integrated. Offline search and chapter filters use no stored player state. The exact 25-link main menu and Back to walkthrough remain consistent. Canari's entry details were also checked against Serebii and Bulbapedia.

**Restored standalone routes: 4/19; placeholders remaining: 15/19.** Original ChatGPT Site, URL, Supabase, core 17 sections and existing player progress unchanged.

## Stage 2 update — Complete Journey Route PDF (21 November 2026)

The 46-page owner export of the **Complete Journey Route** has been restored as a true standalone `journey.html` article. Source coverage: **42 story/postgame missions, 14 Hyperspace missions, 20 Wild Zone circuits, 42 Practical checks sections, 133 story steps and 37 DLC steps**. Search/filter/deep links are separate, offline enhancements; they never modify the main walkthrough's local completion records. Collapsed side-request lists, map details and request answers are labelled, with links to existing inline sections rather than invented data. The 25-link navigation and Back to walkthrough are carried forward. Read-only PR checks also guard Mable, Shiny and feedback components.

**After the Journey slice there were 3 restored and 16 placeholders; the Royale slice brings this to 4 restored and 15 placeholders.** The original ChatGPT Site, its URL, Supabase data/functions and all existing 17-section main guide content remain unchanged.

## Stage 2 update — second PDF article (21 November 2026)

The owner-supplied three-page **Shiny hunting routes & tactics** PDF has now been restored to `shiny-hunting.html`, with the full 25-link menu, step-by-step Wild Zone and bench resets, fixed Side Mission 17 Shiny Mareep route, shiny persistence warnings and DLC Sparkling Power rules. A no-network per-spawn odds estimator helps players understand chance without false guarantees. Facts were checked against the Serebii shiny mechanics and Mareep side-mission sources. Dedicated tests guard wording, menu parity, probability arithmetic and existing guide features.

**After the second slice there were 17 placeholders; after the Complete Journey slice, there are 16 of 19.** Both restored articles are independent GitHub edition content; original Workspace Site, URL and Supabase remain unchanged. `PDF_RECOVERY_QUEUE.md` is the authoritative capture inventory.

## Stage 2 update — first PDF article (21 November 2026)

The 5-page owner PDF of **Mable’s research & rewards** has been used to replace **one** standalone placeholder (`mable-research.html`). It now contains every research level 2–50 reward, verified TM move names, practical route guidance, direct links to Main Mission 3 and Side Mission 22, a 25-link menu matching the homepage, and a device-only reward checklist. New scope-only tests ensure no network writes or progress collisions.

**Following this first slice there were 18 placeholders; after the second Shiny slice, there are 17 of the original 19.** The initial Stage 1 status table and historical notes below describe the ZIP import checkpoint, not the current state. See `PDF_RECOVERY_QUEUE.md` for all **19 owner PDFs (213 pages)**, the captured article paths and five routes for which no equivalent standalone PDF was supplied. The independent GitHub edition's feedback form was connected and verified in earlier PRs; this PDF recovery does not change it. Original ChatGPT Site, URL and Supabase remain untouched.

## This is a reconstruction, not the original source

The original ChatGPT Site project could not be opened through the connected tools. A saved browser MHTML capture dated 20 November 2026 contained the rendered main page, four stylesheet resources (including a Google Fonts resource), and hundreds of images. Browser MHTML **does not contain the original development source or executable JS modules** and should not be misrepresented as a full source export.

## Stage 1: completed in this ZIP

| Component | Current stage | Evidence or limitation |
| --- | --- | --- |
| Main 17 sections | Recovered as editable HTML | Saved browser DOM; game facts not fully verified |
| Main mission route | 42 cards recovered | Source includes many brief notes; detail audit still required |
| Side requests | 203 cards recovered | Summaries, not verified full rewards in every entry |
| Map room | 20 Wild Zone markers recovered | One saved in-game city map; access pins may indicate approximate areas |
| Zone item checklist | 20 zone lists recovered | Many generic location hints and random drops require audit |
| Lumiose Pokédex | 232 cards recovered | Visible card/stats snapshot only |
| Hyperspace Pokédex | Not recovered | Original snapshot advertises 132 entries loaded separately |
| Boss, Alpha, Berry, Legendary, Secrets, Essentials | Captured section content | Verification pending |
| Images and styles | 578 site-local resources extracted | Every image referenced by recovered sections exists locally |
| Mission/side quest/item/screw checks | Reimplemented | Device-local only, separate storage key |
| Hash navigation and filters | Reimplemented | Original scripts were not available; this is new code |
| 19 standalone articles | Placeholder routes only | Original article source not in saved capture |
| Ratings / reports / form | Not connected | Original Supabase connection intentionally untouched |
| Domain, original Site, Supabase | Left untouched | No deployment, API writes, migrations or DNS changes |

## Known content-quality issues from the saved read-only audit

- In the recovered snapshot, 23 of 42 embedded mission cards contain fewer than 1,500 characters; 32 cards include generic map-marker language. Complete standalone pages might have more detail but were not captured.
- 154 of 264 item-list descriptions were generic placeholders rather than actionable directions. Do not treat all random Wild Zone 20 hidden-drop possibilities as fixed physical pin locations.
- Verify the Z-A Royale obedience-cap explanation at the relevant story stages.
- Standardize **Josée** where game text requires it; check her mastery tutorial and Seed of Mastery reward.
- Verify the Main Mission 19 sewer investigation and hidden-wall route, Mable's research milestones/rewards, shiny-hunting methods, and named NPCs including Canari and Ivor.
- Research links to `mable-research.html`, `shiny-hunting.html`, `shops.html`, `home-connection.html`, `sector-maps.html`, `hyperspace-maps.html`, and other standalone files were in the captured navigation, but their full content must be independently recovered/verified.

## Stage 2: recommended editorial priorities

1. Full story route: expand short mission cards with exact prerequisite, NPC conversation, path, map marker, battle tactics, items, and post-battle reward. Research and verify game details rather than inferring from the old summary.
2. Recreate all 19 standalone guide articles as real native pages sharing one menu; prioritize `walkthrough.html`, `journey.html`, Mable's research and rewards, shiny hunting, and detailed city-sector maps.
3. Replace generic location hints with verified directions and map marker IDs; distinguish pickups, NPC gifts, vendor stock and random drops.
4. Add and QA full Hyperspace Pokédex data from reputable sources and game evidence.
5. Restore useful form and rating features via a separate validated adapter and protect existing rows. Do not hardcode credentials or point the preview at the live Supabase project.
6. Visual QA on Android and desktop; accessibility, tap targets, menu consistency, deep links, map pins, zoom, keyboard and screen readers.

## Route behavior now

- The 17 recovered sections use `index.html#<view>` and show in the same interface.
- Direct links such as `walkthrough.html#mission-19` and `side-missions.html#quest-22` route into their recovered inline cards.
- Other standalone routes display a clearly labelled incomplete-page notice and a link to the related recovered section; no invented content.
- The restore uses `noindex,nofollow`, so it is not a live competitor to the original site.

## Quality checks performed

- Confirmed 17 sections and resource extraction by parsing the saved MHTML.
- Confirmed every `<img>` source in the recovered sections points to a locally extracted file.
- Verified JS syntax via `node --check`.
- Browser DOM smoke-checked navigation, mission expansion, local progress update, text search, Wild Zone selection, Pokédex filtering, Hyperspace missing-content notice, and phone/desktop layouts without JavaScript exceptions.
- A direct localhost browser smoke run was blocked by the tool environment's administrative navigation rules; the equivalent document was loaded in Chromium with inline styles/scripts to test interactions and layout. **No hosted deployment has been smoke-tested.**
