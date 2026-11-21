# Recovery status — 21 November 2026

## Stage 2 — Side Missions source-derived fieldbook (MERGED #44 · PAGES SUCCESS)

The original separate Side Missions PDF/Workspace source was not in the 19 supplied PDF captures. The saved main-guide archive `src/sections/sidequests.html` (155,467 characters; preserved blob `c8ef094b88d234e54ba1f22638e69e92c933b1f7`) contains **203 original side-mission cards**: numbered #1–200 plus EX1, EX2 and EX3. Every card retains an original title, unlock condition, start location, reward text and field-note solution. This source's text has **not been independently gameplay fact-checked** as part of the recovery, and prior audit uncertainties remain open.

The old `side-missions.html` placeholder is now a complete, usable **source-derived standalone index**, not a copy of the missing original separate article layout. It reproduces all **203** saved source entries and field-note solutions exactly, apart from replacing the self-links with real links to the preserved interactive `index.html#sidequests:quest-N`. The page includes all 25 guide navigation links, Back to walkthrough, source page provenance, a search across names/locations/items/instructions, 119 base requests / 81 Mega Dimension numbered requests / 3 EX requests, plus native expandable field notes. Both original numeric anchors `#quest-201`–`#quest-203` and the old EX link forms `#quest-EX1`–`#quest-EX3` now resolve to the correct card.

**Saved progress policy:** all 203 completion checkboxes on the new page are `disabled` and reflect existing same-browser `lumiose-atlas-reconstruction-v1.sideCheck` flags **read-only**. New `side-missions-index.js` only calls `localStorage.getItem` and never writes, resets, deletes or sends any player data. The original `index.html#sidequests` source remains the sole checkbox writer. The 17-section reconstructed main guide and the working feedback form are untouched.

**Release evidence:** [PR #44](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/44) reviewed head **`84a1ed7e07f85b13f6985b407c6fbf00f2add05d`**; [CI #44950063842](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44950063842) **PASS** for every original metadata string, 203 exact solution lists, quest link targets, EX aliases, mobile CSS, search/filters, zero data writes and existing static/feedback regressions. PR merged as **`b43ae9f7cc49d602d9e49aeb98f5d4bf51e18171`**. [GitHub Pages #44950115067](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44950115067) **SUCCEEDED** for that exact SHA. Manual Android visual QA remains pending.

**Count:** 14 PDF-backed original article captures recovered to standalone routes; **two additional functional source-derived indexes** (42-Mission Walkthrough and 203 Side Missions) deployed. **Three literal placeholders remain**: Mega Dimension, Sector Maps and Hyperspace Maps. The exact original *separate* article/expanded-map sources for these three plus the two source-derived substitutes remain missing (five total). Next safe source-derived candidate: Mega Dimension, provided the preserved main-guide DLC section supports it. All 19 existing owner PDFs are already accounted for; no re-upload needed. The original ChatGPT Site, Supabase project, feedback, ratings, genuine reports and player progress remain untouched.


## Stage 2 — Source-derived 42-mission walkthrough index (MERGED #42 · PAGES SUCCESS)

The original **separate** detailed Walkthrough article was not present among the 19 owner-supplied PDF captures, and the editable original Workspace Site source remains inaccessible. However, the saved main guide `src/sections/walkthrough.html` retains all **42 individual mission cards** (original source Git blob `0957cd51cbb7a859495dab8674c136919e4c08bb`). Each card has its preserved title/chapter, ordered mission steps, practical checks, field tip, location caption and optional original Pokémon portrait. These were verified directly against the complete current source rather than reconstructed from an unrelated PDF.

The old `walkthrough.html` placeholder was replaced with a **useful source-derived standalone mission index**. All 42 source mission step lists, 42 practical checks, 42 field tips and 42 original map cues are copied exactly. A responsive two-column/mobile-one-column presentation, seven chapter filters, text search, 22 original locally available Pokémon portraits, and native expandable mission details make this an accessible route index. Each card links to the **unchanged** canonical interactive `index.html#walkthrough:mission-N` for the archived maps, collection pins and progress checkboxes, plus the matching `journey.html#journey-mission-N`. Existing `walkthrough.html#mission-N` links now open the specific source-derived card. The shared 25-item menu, Back to walkthrough and existing feedback link remain.

**Saved progress policy:** `walkthrough-index.js` only reads `lumiose-atlas-reconstruction-v1.check`; it contains no storage writes, deletion/reset or network calls. Mission completion remains owned by the main reconstructed walkthrough. Tests confirm the two pre-existing mock checkmarks appear in the index, search/filter and hash navigation work, malformed storage is handled without mutation, and unrelated data survives. The new index is not a complete copy of every map widget nor a replacement for the original separately designed Walkthrough article; map-pin closeness, original full-article layout and additional gameplay fact-checks remain outside this recovery slice.

**Release evidence:** [PR #42](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/42), reviewed head `c1b0f2b66175cb049b77bad6bdd11a299f394e56`, passed [CI #44949292115](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44949292115) (all 42 source matches, 25-link menu, 42 journey and interactive links, 22 portrait matches, search/filter, read-only state, static guide and feedback regressions). Merged as **`13237f9bebc5c5a377f53d22a88663a59a3b0972`**. [GitHub Pages #44949347435](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44949347435) **SUCCEEDED** on that exact commit. Manual Android visual QA remains pending; the original ChatGPT Site, original Supabase/feedback/ratings, and main interactive route/progress were not changed.

**Historical coverage at the Walkthrough-index release:** 14/19 original PDF-backed standalone routes fully restored; **one functional source-derived walkthrough index** released; **four standalone placeholders existed at that earlier checkpoint** (Side Missions, Mega Dimension, Sector Maps, Hyperspace Maps). The current checkpoint is recorded above. Exact full original source captures remain missing for five original standalone article/map targets, including Walkthrough. None of the 19 existing owner PDFs needs re-uploading. At the Walkthrough-only checkpoint, the next safe candidate was **Side Missions (203 cards)**, now completed as recorded above. This is recovery, not the future all-systems fact-checked walkthrough upgrade.


## Stage 2 — Ranked Battles (MERGED #40 · PAGES SUCCESS)

The owner's **three-page "Battles" PDF** was visually inspected page by page (created 21 November 2026; SHA-256 `f52a3d36d7aa5c18756c1a38c55b22524e6c75155ed0323b156e43d2d1ba4df6`). The saved `src/sections/battles.html` section matches the source PDF. Page 1 contains the three setup steps and the first four illustrated Season X Mega Stone promotions; page 2 contains the remaining three stones, four season-end Mega Shard tiers (A 300 / B–E 200 / F–R 100 / S or below 50), special Ball guidance and three play tactics; page 3 has the last ranked-only-stone caveat, internal rewards link and footer.

The standalone `battles.html` retains **all original text, seven exact Rank Y–S cards and seven local species images, original 4-row finishing table, online-membership caution and 25-link navigation**. Only the source `data-go` rewards button became a working `rewards.html` anchor. `battles-guide.css` adds responsive styling without changing shared or original guide CSS. A separately labelled **independently verified** 2026 rules panel explains permitted Lumiose/Hyperspace Dex numbers, automatic Level 50 and only Raichunite X / Charizardite X / Mewtwonite X as Mega Stone held-item exceptions. Those extra facts come from the 13 Nov 2026 season notice (Pocket Monsters) and Serebii and are not misrepresented as material printed in the PDF. Season X runs until **11 December 2026, 01:59 UTC**; players should always verify active-season eligibility in-game.

**Verified release:** [PR #40](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/40) reviewed head `3a19314753697365d2c70665fee013285cb9977b`; [CI #44948454815](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44948454815) **PASS** (ranked PDF source, all original artwork, exact menu, all previous article checks, unchanged 17-section guide, feedback regression). It merged to `main` at **`55cc1d8a9bcbc8abcae2826139b1affcdc1db586`** and [GitHub Pages #44948509457](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44948509457) **SUCCEEDED** on that SHA. Source and Pages publication verified, but an owner Android visual test is still pending.

**Current coverage: 14/19 restored standalone routes; 5 remain as separately unrecaptured pages** — Walkthrough, Side Missions, Mega Dimension, Sector Maps and Hyperspace Maps. All 19 original page PDFs were found in the Library: 14 source captures for restored independent articles and five main-page sections (Berries, Pokédex, Starters, Secrets, Bosses). The original standalone source PDFs or expanded map views for the remaining five are **not** among those 19; the main guide's 42 mission cards, 203 side-mission cards and DLC/overview material still survive. No original ChatGPT Site, Supabase, reports, ratings, source article sections or player progress was changed by this release.


## Stage 2 — Online and Hidden Rewards (MERGED #38 · PAGES SUCCESS)

The owner’s full three-page **Rewards** PDF (21 November 2026) was visually inspected, including the continuation across printed pages 1–3. Its six source gift/event cards exactly match `src/sections/rewards.html`: Shiny Xerneas code/deadline, Poké Ball Pattern Vivillon deadline, Diancite/Diancie, Mewtwonite X and Y/Mewtwo, Mega Garchomp Z special distortion, and conditional 100 Ultra Balls bundle. The PDF also includes Pokémon HOME Alpha starters/Shiny Volcanion, golden Hyperspace Bonus Ball, Alpha drops, Canari's 100 Colorful Screws/plush, and Season X ranked-reward handoff. Page 3 is a short ranked callout/footer, not an extra guide table. All source text and five existing local illustrations are preserved.

**Verified release:** [PR #38](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/38) passed exact source-parity/card/image/menu/button-link/mobile-CSS, static guide integrity, unchanged feedback, and existing article regressions in [Actions #44947504365](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44947504365). Reviewed head `22283e48b7a22866626a548e8a133d3bb6261088` merged into `main` at **`92f3e8cd30b886cbc53d29b0d61b7fd73e3fdd8c`**. [GitHub Pages #44947591562](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44947591562) **succeeded on that exact merge SHA**. All 25 menu links and Back to walkthrough remain; `rewards-guide.css` is scoped to the separate route. No new JavaScript state, API calls or progress writes were introduced.

**Current coverage: 13/19 standalone routes merged/deployed; 6 remain.** Next source-backed restoration: **Ranked Battles (3 pages)**. Android visual verification of the new page is still pending; the original ChatGPT Workspace Site, live URL, Supabase, feedback/rating services and reports #13/#14 were not changed. These are date-stamped source gift listings and are not future availability guarantees; Xerneas/Vivillon deadlines and Garchomp Z Gift instructions were independently checked against official Pokémon notices.

## Stage 2 recovery — 14-page Pokémon HOME guide (MERGED #35 · PAGES SUCCESS)

All **14 printed pages** of the exact owner-supplied “Pokémon HOME rewards and transfer guide” PDF were inspected, including full visual layouts. The PDF includes the **first-transfer three Alpha first partners**, a four-step Switch/mobile HOME workflow, the three-dex HOME **Shiny Volcanion** reward, species/form compatibility warnings and the one-way transfer warning, plus a **364-species roster** across pages 4–13 (page 14 is the closing note and footer).

**Exact roster evidence:** the source PDF was extracted with its three-column printed order and separately SHA-256 hashed: `a36169f8a22e9e0d8ec1369f4da29966e5b32b4f3dad5c5396d31b2a319f7cc5`. The resulting **232 Lumiose** and **132 Hyperspace** entries have 364 unique National numbers; all 232 base names/numbers/types/orders agree one-for-one with the preserved `src/sections/pokedex.html`. The page reproduces all 364 names, types, region groups and local PDF context, not just a short transfer summary. All 25 shared menu links, Back to walkthrough, internal guide links, search/three region filters, completed-vs-missing filter, mobile cards and accessible checkboxes are included.

**Artwork disclosure:** not every PDF Pokémon portrait was retained by the original MHTML capture. We located 236 locally saved `dex-art` portraits and 20 further `art` portraits. The remaining **108 Hyperspace species** use a precisely named public GitHub-hosted PokeAPI HOME sprite fallback; this is disclosed in the article, with a textual fallback when no image loads. It is not labelled as original locally recovered artwork, and the page's contents and species names work without those external pictures.

**No game/account integration:** the optional 364 “Registered” ticks are a **manual browser-local checklist**, not evidence that Nintendo HOME contains the species. They use `lumiose-atlas-gh-pages-home-register-v1`, deliberately separate from main site `app.js`’s five-category `lumiose-atlas-reconstruction-v1` serializer so that returning to the main walkthrough cannot silently delete HOME-only marks. Invalid/blocked existing HOME storage is never overwritten. Neither key is synced across devices or to the original ChatGPT Workspace Site. No Supabase writes, Nintendo API connections, game file edits, or permission/auth modifications.

**Source check:** Pokémon HOME's official movement guide verifies the first-deposit Alpha Chikorita/Tepig/Totodile; its 27 April 2026 announcement verifies Shiny Volcanion for completing Lumiose, Hyperspace and Mega Evolution HOME Pokédexes; the official Z-A notice verifies non-returnability to previous games and individual compatibility. The PDF's form notes and 364 species roster remain source-labelled; the HOME Mega Pokédex completion requirement must be checked in HOME itself, since game lists can include nonrequired event-only species.

**Verified release:** [PR #35](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/35) passed exact 364-record PDF SHA-256 source parity, 232 preserved-base checks, 256 locally available portraits, 108 clearly disclosed fallbacks, search, independent manual storage, main 17-section guide and feedback tests in Actions **#44943076452**. It merged at **`ee107d70dd638e46ee7d8d8a056a1e7cc38c4424`**; Pages **#44943148212 succeeded** on that exact SHA. No original ChatGPT Site, Supabase, feedback functions, original walkthrough, `app.js`, original main Pokédex or Item Atlas changes. Android visual check remains outstanding.

**12/19 standalone routes now live; 7 pending.**



## Stage 2 update — Legendary & Mythical Fieldbook (MERGED #33 · PAGES SUCCESS)

The owner’s exact **10-page “Legends” PDF** was visually inspected from pages 1 through 10. Pages 1–9 contain **25 illustrated field cards**; page 10 is only the original footer. The cards correspond exactly to the saved `src/sections/legends.html` records and artwork: **3 Base story** (Xerneas, Yveltal, Zygarde); **2 Gift mission** (Diancie, Mewtwo); **13 Mega Dimension** (Heatran, Darkrai, Groudon, Kyogre, Rayquaza, Meltan, Melmetal, Magearna, Hoopa, Volcanion, Genesect, Marshadow, Zeraora); **7 Special Scan** (Latias, Latios, Cobalion, Terrakion, Virizion, Keldeo, Meloetta).

The new standalone `legendaries.html` preserves **each original Pokémon name, national number, local artwork, source group, place, description, tip/level and PDF page reference** with the same 25-link shared menu and Back to walkthrough. Expandable 3–4-step route lists restate the saved source descriptions without adding unverified rooftop coordinates. A helpful story-order overview, 25 searchable cards, four source filters, internal links, accessibility/mobile styles and **25 obtained checkboxes sharing the existing GitHub main guide `lumiose-atlas-reconstruction-v1.legendCheck` identity keys** are included. No separate tracker or automatic progress reset. Malformed or blocked browser storage is never overwritten.

**Evidence boundaries:** the PDF specifies Mystery Gift items but not whether gifts are currently available; its Special Scan sixth-scan guarantee is reproduced as a PDF claim and needs confirmation in a future playthrough; Unknown Hyperspace Zones are **not** mapped as fixed city locations. The PDF does not fully specify the Genesect after-wall sequence, Marshadow follow-on capture or Zeraora rooftop entrance. These gaps are called out instead of guessed. The original ChatGPT Site has a different browser origin and its old progress does not automatically sync with the reconstructed GitHub site.

**Verified release:** [PR #33](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/33) passed all 25 exact-PDF/card/artwork and shared-progress assertions, the 17-section original guide and feedback regressions in GitHub Actions run **#44941733488**, then merged as **`696179c51224235e43b2453d0d53313137ee6bba`**. GitHub Pages deployment **#44941808697 succeeded at that exact SHA**. The total is now **11/19 standalone routes live**, with **8 placeholders remaining**. Android visual verification and new-playthrough route fact checks remain outstanding. Existing main guide, walkthrough, side quests, items, Alphas, feedback, owner inbox, RLS, Supabase and original ChatGPT Site are unchanged.



## UI follow-up — Item Atlas checkboxes shared with original local progress (MERGED #30 · PAGES SUCCESS)

The owner requested that the newly restored, prettier `items.html` support ticking found items and Colorful Screws like the walkthrough and side missions. Before changing code, `app.js` was inspected and confirmed the existing **device-local** key `lumiose-atlas-reconstruction-v1` stores `pickup` keyed by the exact `data-pickup="ZONE-INDEX"` ID and `screw` keyed by the `data-screw="NUMBER"` ID. The 264 item and 100 Screw entries in the recovered fieldbook match those original IDs in order.

**Bounded change:** add accessible checkboxes beside each of those 364 entries, soft green collected styling, two in-page collected totals and a clear local-only save status. Changes save only the selected `pickup` or `screw` property after reading and preserving the entire current record, including `check`, `sideCheck`, `legendCheck` and unknown future fields. A malformed or blocked storage record is never overwritten; the user receives a visible unsaved warning. Storage-change, page-return and focus refreshes let the new page rehydrate the same data; the original main guide will see these values when reloaded/navigated. Hidden-item outcomes remain optional obtained-result checks, not verified physical pins. The original Site is on a **different web origin** and its checkmarks do not automatically synchronise with the GitHub edition. The 48 sector-map and numbered-coordinate requirement remains open in issue #28.

**Verified release:** [PR #30](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/30) passed exact-ID, shared-storage, zero-reset, blocked-storage, old article, main 17-section and feedback checks in GitHub Actions run #44937492285; merged as `b10f9786c5b01f7491a52f02ade62e7bcfb2f844`; exact GitHub Pages deployment #44937542430 **succeeded**. Android manual visual validation remains outstanding. No edits to `app.js`, original source sections, original Site, Supabase, mission/sidequest controls, map assets, ratings or feedback.



## Stage 2 update — 28-page Item Atlas and 48-sector evidence foundation (MERGED #27 · PAGES SUCCESS)

The owner’s complete 28-page Item Atlas PDF was examined as page text and visually: 20 Wild Zone sections, the vendor/berry/supplies route and 100-item numbered Colorful Screw notes, with 264 source item records. The preserved main-page source confirms **154 zone-only entries lacking coordinates; 56 Wild Zone 20 hidden-item chance outcomes; 10 mission/person rewards; 23 sector-area clues; and 21 landmark/access clues**. Their sum is 264, but **it does not equal 264 confirmed, fixed, independently mapped item coordinates**. We keep each record with the exact saved name, order, source ID, hint and image. The 100 screws remain a separate numbered fieldbook and the original main-page checkboxes remain the only player progress system.

An independent public-source cross-check against Bulbapedia’s in-game location index established the authentic 48 sector names: Vert 1–9, Bleu 1–10, Magenta 1–9, Rouge 1–8 and Jaune 1–12. This detail is expressly distinguished from the original 28-page PDF. All 48 sectors receive evidence records; 23 item clues and 51 Screw clues explicitly name a particular sector. **No sector-specific map image or exact item coordinate exists in the owner captures**; the interface honestly marks these as pending rather than rendering approximate item markers as confirmed. The separate sector-maps.html and Hyperspace map routes remain unrecovered, and the full-city exact item placement project remains open. Tests must check exact 264/100 source parity, correct icon paths, 48 sector names, source-quality classification, no fabricated pins, 25-link navigation, offline filters, original 17 sections, feedback and progress preservation.

**PR #27 passed all article, item-source parity, main 17-section and feedback tests in run #44936435173; merged as `e8b8215e1816d2528c70183fefce6960a8d60821`; GitHub Pages run #44936487426 succeeded at that exact SHA.** The current count is **10/19 restored standalone routes**, **9 placeholders**. The owner’s full 48-sector maps and independently confirmed item-pin requirement remains **OPEN in [GitHub issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28)**. Android visual verification is not yet recorded. The original ChatGPT Site, Supabase, source guide, feedback, map image and player progress are unchanged.


## Stage 2 update — Lumiose Maps PDF (MERGED #25 · PAGES SUCCESS)

The owner’s four-page **Maps** PDF was examined visually and as extracted text. It provides the city overview image and legend, 20-zone introduction, the first five visible directory rows, and mentions 48 sector close-ups plus nine Hyperspace layouts **without containing their expanded images or access coordinates**. The preserved main-page `src/sections/maps.html` provides all 20 pin coordinates, district labels and unlock missions. The saved `src/sections/items.html` supplies 264 ordered item entries and 100 Colorful Screw text clues; `src/sections/alphas.html` supplies 38 fixed Alpha target listings. The new standalone `maps.html` uses the existing source map image, 20 selectable pins and directory rows, 20 readable zone detail cards, all 264 pickup entries (marking vague coordinate-less notes), 38 Alpha targets, 25 screw clues that explicitly reference Wild Zones, filters, a search field and a zoomed **crop of the same source image**. It does **not** represent these as newly discovered high-resolution close-ups. Full original 25-link nav and Back to walkthrough preserved. The old item progress system remains the only checkbox owner.

**PR #25 passed the full recovery/static/feedback regression workflow #44935267236, merged to main as `76f8af032b8730b1890a322eabf90b8ce893f8bc`, and GitHub Pages deployment #44935319986 completed successfully for that exact SHA.** This confirms **9/19 restored standalone routes**, with **10 placeholders remaining**. Android visual layout testing remains outstanding. The original ChatGPT Site, Supabase, main interactive walkthrough, DNS and player progress remain unchanged.


## Player-confirmed in-game café menu and Premier Ball (21 November 2026)

The owner provided four photographs of a **café truck interaction**, showing the three category menus and the item names in order, then supplied all ten prices separately in chat. Coffee: Ember Roast ₽250, Flamethrower Roast ₽250, Fire Blast Roast ₽250, Burn Up Roast ₽300. Tea: Panchamomile Tea ₽250, Wooloolong Tea ₽300, Roserade Tea ₽350. Something else: Moomoo Milk ₽200, Fresh Water ₽100, Sparkling Water ₽100. The owner also independently confirmed **Premier Ball ₽200** from the game. The photographs do **not** prove the truck's exact street or identify it as **Nouveau Café Truck No. 3**, so the ten drinks are stored as an explicitly player-verified **18th, separate catalogue group** rather than being attributed to the six-page PDF's berry truck. Their menu names/order come from photographs; prices come from the owner's firsthand report. Existing original 17 PDF groups/190 entries, Mega Shard and Screw planners, original source, feedback and player progress remain unchanged. Only the player-confirmed Premier Ball conflict flag is cleared; the Poké Ball and Sharpedonite disagreements stay visible.

**Follow-up PR #24 passed all existing article/static/feedback checks and merged as `14f9051844f98e7058f2c44a6bd2780dc6eac2e0`. GitHub Pages deployment #44934456582 succeeded at the exact SHA.** This did not change the 8/19 restored-route count. The original ChatGPT Site and Supabase remain untouched.


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
