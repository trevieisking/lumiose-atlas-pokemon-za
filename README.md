# Lumiose Atlas — The Free Online Player’s Guide for Pokémon Legends: Z-A

**Description:** A free, illustrated guide to Pokémon Legends: Z-A, including story walkthroughs, side missions, Wild Zone maps, Pokédex entries, items, Alpha Pokémon, rewards, shiny-hunting guidance and Mega Dimension DLC. This independently reconstructed edition is being completed and verified section by section.

**Status:** Stage 1 reconstruction preserved; **Stage 2 PDF recovery in progress**. Thirteen PDF-backed standalone routes—Mable’s research & rewards, Shiny hunting routes & tactics, Complete Journey (42 main + 14 DLC missions), Z-A Royale promotion battles (10 teams), Rogue Mega bosses (28 cards), complete Type Chart, Alpha Fieldbook, Shops & Mega Shards, Lumiose Maps, the 28-page Item Atlas, Legendary & Mythical Fieldbook, and the complete 14-page Pokémon HOME transfer guide and the 3-page Online Rewards guide—have passed CI, merged and deployed independently. The Item Atlas provides 264 source item records, 100 numbered Screw clues and 48 verified sector names without claiming unsupported exact item placements; completion of 48 authentic sector maps and fully verified numbered pins is still tracked in [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28). The Maps fieldbook includes 20 source map pins, 264 item entries, 38 Alpha entries and 25 saved Screw clues, without inventing missing sector/Hyperspace closeups. The Shops page now includes its original PDF’s 17 vendor groups and 190 items, plus ten separately labelled player-confirmed café drinks with prices (18 groups, 200 items total), without changing its two offline planners. They share the 25-link menu without affecting saved player progress. The source PDF's collapsed request lists remain explicitly marked. See `PDF_RECOVERY_QUEUE.md` for all 19 PDFs / 213 printed pages. The earlier Stage 1 notes below are retained as an audit of the original import. This is a **reconstructed, editable static site**, **not** an export of the original ChatGPT Site's source project. The original project was inaccessible; this copy was assembled from the user's own saved MHTML webpage capture from 20 November 2026. **The Stage 1 ZIP had no deployment; the independent GitHub Pages edition has since been deployed. No original ChatGPT Site source or domain has been modified.**

**Legendary Fieldbook deployed:** The owner’s 10-page Legends PDF now has a separate professional guide with all 25 illustrated encounter records, source-backed steps, category filters and 25 checkboxes sharing the main guide’s `legendCheck` progress. PR #33 passed all tests and deployed to GitHub Pages as `696179c51224235e43b2453d0d53313137ee6bba` (run #44941808697). No new Supabase or browser storage namespace was created. Mystery Gift availability, the Special Scan guarantee and omitted exact directions remain marked for the owner’s future playthrough. **11/19** standalone pages restored; eight remain.

**Online Rewards released:** The owner's 3-page source PDF is restored in `rewards.html` with all six original Mystery Gift/event cards, Xerneas/Vivillon deadlines, Diancie/Mewtwo unlocks, Garchompite Z distortion, conditional 100 Ultra Ball code, HOME and hidden-play rewards, and a Ranked Battles handoff. [PR #38](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/38) passed [CI #44947504365](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44947504365), merged as `92f3e8cd30b886cbc53d29b0d61b7fd73e3fdd8c`, and deployed successfully in [Pages #44947591562](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/44947591562). **13/19 restored, 6 standalone placeholders remain**, next source PDF: **Ranked Battles (3 pages)**. Original ChatGPT Site and Supabase untouched; Android visual review pending.

**Pokémon HOME source recovery deployed:** The 14-page owner PDF’s first-transfer 3 Alpha gifts, Shiny Volcanion 3-HOME-Pokédex completion reward, safe one-way restrictions and **all 364 PDF species** (232 Lumiose + 132 Hyperspace) are live in `home-connection.html`, with a device-local manual registry independent of main progress. 256 portraits are retained source assets and 108 use disclosed third-party online sprites; full species text works offline. PR #35 passed all CI and deployed to GitHub Pages at `ee107d70dd638e46ee7d8d8a056a1e7cc38c4424` (run #44943148212). Android visual review is outstanding. The original ChatGPT Site, Supabase, Nintendo credentials and other game progress remain untouched. **12/19** standalone routes restored; seven remain.

Live original (not controlled by this repository):
`https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/`

**Item Atlas progress follow-up:** The restored standalone Item Atlas now offers 264 item and 100 Colorful Screw checkboxes using the **same device-local `lumiose-atlas-reconstruction-v1` record as the reconstructed main guide**, retaining the same IDs and all walkthrough/side-quest values. The original ChatGPT Site has a separate origin and does not share this local browser data. PR #30 passed CI, merged and deployed to GitHub Pages; Android visual validation is still outstanding. The 48 sector-specific maps and verified item positions remain tracked in issue #28.

## What this ZIP gives you now

- Complete captured homepage markup, split into **17 independently editable guide sections** in `src/sections/`.
- The saved visual styling and **578 resource files** (CSS, images and map assets), with checksums in `source-assets-manifest.json`.
- The saved snapshot's **42 mission cards**, **203 side-mission cards**, **20 Wild Zone map markers and item lists**, **232 visible Lumiose Pokédex entries**, **25 legendary cards**, **37 donut recipe cards**, and **100 screw checklist entries**.
- Reimplemented navigation, client-side text filtering, mission expansion, Pokédex card expansion, map pin selection, recipe-to-planner ingredient loading, and device-local progress checkboxes.
- Explicit temporary pages for the **19 standalone article routes** whose full source was absent from the saved archive. These are **clearly identified placeholders**, not invented walkthroughs.
- No need for Node, a package install, paid APIs or a database to run this static checkpoint.

**Important:** This is not a claim that every game fact is verified, that the linked standalone articles are complete, or that the original application's full behavior has been reproduced. The separately loaded Hyperspace Pokédex, original scripts, rating form, and live Supabase functions were not preserved in the snapshot.

## Make changes piece by piece

1. Edit the relevant `src/sections/<section>.html` file (for example `src/sections/walkthrough.html`).
2. Run `python3 scripts/build.py` from the repository root. The generated `index.html` contains all sections, ready for static hosting.
3. Run `python3 tests/validate_static.py` to check links, sections, assets and basic safety.
4. Preview locally with `python3 -m http.server 8765`, then open `http://localhost:8765/`.
5. Commit the source section and generated `index.html` together in GitHub. Changes can be reviewed as ordinary PRs. Do **not** point the original domain at this rebuild until it has been verified and you explicitly authorize a separate migration.

The project is static HTML, CSS and JavaScript. `package.json` provides optional script aliases; **no npm dependencies are required**. The build uses Python 3 standard library.

## Directory structure

```text
index.html                    generated standalone homepage
app.js                        reconstruction-only user interactions
styles.css                    captured site styles
reconstruction.css            safe overrides; preview notices
site-feedback.css             preserved styling only; no backend attached
dex-links.css                 captured Pokédex styles
src/template.html             shared page template and navigation
src/sections/*.html           17 separately editable content sections
art/, dex-art/, sprites/      preserved image resources
items/, maps/, city.svg       item art and map resources
*.html                        19 temporary standalone route files
routes.json                   recovered views and unresolved article routes
source-assets-manifest.json   file list and SHA-256 digests
scripts/build.py              deterministic page generator
tests/validate_static.py      static integrity and security checks
RECOVERY_STATUS.md            what is recovered / missing / next
.github/workflows/check.yml   optional read-only validation; no deploy
```

## Data and security boundaries

- No Supabase credentials, service-role keys, auth tokens, database dumps or `.env` files are included.
- The reconstruction **does not connect to Supabase**. Ratings, reports and submissions remain in the original live project and have not been read, copied, changed or deleted.
- The checkbox tracker uses a **new, separate localStorage namespace** (`lumiose-atlas-reconstruction-v1`); it cannot change the original site's progress records.
- `robots: noindex,nofollow` remains in this preview to avoid duplicate search-indexing. Remove only when publishing a thoroughly checked replacement in a controlled migration.
- No deployment workflow is included, and **no existing domain or DNS has been modified**.

## Rights

This is an independent preservation and editing checkpoint of a fan-created guide. Pokémon names, imagery and marks are owned by their respective rights holders; they are not claimed as the author's own intellectual property. Review image and source licensing before wider redistribution.

## What to do next

Work through `RECOVERY_STATUS.md`: first recover and verify missing standalone articles; then repair detailed mission steps, item directions and map accuracy using reliable game evidence; finally implement and test an **independent** backend adapter if needed. No live connection or migration without explicit authorization and verification.
