# Recovery status — 21 November 2026

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
