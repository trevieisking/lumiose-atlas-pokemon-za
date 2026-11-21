# Recovery status — 21 November 2026

> **Editorial audit checkpoint (21 Nov 2026):** A documented 42-mission and 17-section quality inventory is in `docs/qa/`. The Mable's Research placeholder has been replaced by a sourced levels 2–50 reward page on the audit branch. This is *not* certification of all gameplay facts. See `docs/qa/MAIN_STORY_AUDIT_2026-11-21.md` and `docs/qa/SITEWIDE_AUDIT_2026-11-21.md`. Original live ChatGPT Site and Supabase remain untouched.

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
