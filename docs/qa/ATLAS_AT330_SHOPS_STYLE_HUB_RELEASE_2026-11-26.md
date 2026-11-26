# AT-330: Shops, clothing and hair-salon integration — 26 November 2026

## Scope and owner request

The owner reports that the **original live Workspace Site** still lacks the clothing-and-hair-salon upgrade. Preserve its existing URL, maps, progress, feedback, Supabase services and all established shopping inventory. Deliver a meaningful main Shops-section entry point for clothing boutiques and salons, using the existing GitHub content rather than creating another independent site or duplicating services.

**GitHub baseline:** `27d91192176e5c671fffaa94cff41155d1a46134`, 26 November 2026.

**Root cause / starting state:** The GitHub repository already had two full standalone pages (`clothing-guide.html`, `hair-beauty-guide.html`) merged in prior fashion PR #176. The `shops.html` hub, however, exposed them through only two brief links in its Fashion section; its search covered 18 item/currency sellers rather than fashion and salons. The original Workspace version has not been verified to contain those imported pages and links. An existing GitHub link is *not* proof that the separate Workspace Site shows the upgrade.

## Existing sources, numbers and boundaries

- Official Pokémon: https://legends.pokemon.com/en-gb/news/adventure-in-style — salons, hair colours (including colour blocking/balayage), clothing and Furfrou styling.
- Bulbapedia: https://bulbapedia.bulbagarden.net/wiki/List_of_clothing_in_Pok%C3%A9mon_Legends:_Z-A — **41 boutiques** across five arcades, plus salon at each shopping area.
- Bulbapedia Trainer Customization: https://bulbapedia.bulbagarden.net/wiki/Trainer_customization — five salons; note Passage de la Félicité has its salon outside the arcade, in Bleu Sector 8.
- Japanese Game8: https://game8.jp/pokemon-legends-z-a/730162 — same unlocked cuts/colours at all salons, price **₽3,000**, eyebrows only free.
- Existing independent researched Atlas source: `docs/qa/ATLAS_FASHION_BEAUTY_RESEARCH_2026-11-25.md` and the 41 verified boutique identity records + 5 researched salon records in the two linked guide pages.

The new Shops hub copies their names **exactly**, with a regression check that compares the listed boutique and salon names against those current guide pages. All locations are district/arcade search guidance, not verified exact door pins. Full SKU/variant inventory, all cosmetic swatches and original door photographs are still open.

## This release

**Modified:** `shops.html`, `shops.css`, `tests/fashion_guides.test.mjs`, `tests/fashion_guides_browser.mjs`.

**Added:** `shops-style.js` (standalone, read-only and offline fashion search) and this QA receipt.

1. Keep the original Shops page and its **18 established shop/exchange groups and 200 listed items**; preserve its item search, money/shards/screws filters and budget calculators.
2. Put **Clothing & salons / Find 41 boutiques / Find 5 salons** anchors high in the Shops hero.
3. Expand `#fashion-subguides` into a visible, searchable directory of five shopping arcades with all 41 boutique names and the five salons. Include readably-sized, touch-friendly accordions, the published salon price and precise **district** links without inventing a map pin.
4. Preserve exact URLs `clothing-guide.html` and `hair-beauty-guide.html` so existing navigation and browser tests still work. Link to the Furfrou trims section.
5. Separate fashion search from the existing item/currency search to avoid cross-category breakage. No external data requests, credentials, account changes or player storage.

## Required checks before promotion

- The existing 25-link guide menu, 18 shop groups and 200 items remain intact.
- All 41 names and all five salons match the existing dedicated guides in order.
- Phone and desktop browsing: open Shops, search a boutique by name and its accordion expands; search a salon by name, clear a search, test no-results, open both dedicated guides; no horizontal overflow.
- Existing feedback navigation/return links, original maps, source photos and progress must remain unchanged.
- Run the exact PR-head recovered-articles suite and fashion browser smoke; inspect artifacts and deploy only on green. No new backend, schema, map assets or extra costs.

## Original Workspace Site — single scoped import instruction

**Existing Site ID:** `appgprj_6afda588d5948191b4143e40a1f9c291`

**Existing Site URL:** https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site

When GitHub deployment and checks are complete, independently adapt this specific update to **the existing Site**:

- Compare its existing Shops section and menu with the released GitHub `shops.html`. Do not replace a newer Site version or rebuild an entirely new Site.
- Ensure the original Site has accessible **Clothing & boutiques** and **Hair & beauty** guides. Copy/adapt from the exact reviewed `clothing-guide.html` and `hair-beauty-guide.html` only if missing. Keep existing original-Site content and changes.
- Add the searchable 41-store/five-salon Shops hub, district links and styling navigation. Do not create coordinates, markers or paid dependencies. Preserve all original shop items and calculators.
- Take a restore point, preview phone and desktop, check Links, Shops search and Player progress, and publish to the *same Site and same URL* only after validating.
- Record the Workspace release version, actual page URLs, test results and rollback receipt in the existing Supabase ledger **`atlas_internal.feature_checklist`** for `AT-330-CLOTHING` and `AT-330-HAIR-BEAUTY`. Until those independent checks pass, **Workspace status remains OPEN**, even if GitHub Pages has deployed.

Do not mark the complete Atlas master plan done. No video/YouTube work, Hyperspace permanent pins or map edits are part of this release.
