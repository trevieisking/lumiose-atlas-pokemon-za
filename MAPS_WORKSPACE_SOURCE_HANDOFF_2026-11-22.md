# Lumiose Atlas — GitHub-only lift research handoff (22 November 2026)

**Purpose:** GitHub source first; the owner will arrange permissions for the original ChatGPT live Site **later**. Do not assume a GitHub PR merge updates or grants write access to the original ChatGPT Site. Do not redeploy or replace it now.

**22 November 2026 — Map 2.0 GitHub release AT-262:** [PR #90](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/90) is MERGED and the independent Atlas Explorer is [deployed](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45065788677) at source main SHA `e81e53079a0ef4c5fc2e81e294ae644826c32540`. New features are independently toggleable map pin layers and a tappable north-up compass; desktop wheel/drag and simulated mobile two-finger pinch/rotate passed [exact-head CI](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45065496238). The original Site has **not** been updated. Before any port, inspect its actual source and player-progress storage; do not overwrite live maps or assume GitHub deploys to ChatGPT Workspace.

**AT-264 — recovered original-owner gallery photos are live in GitHub Edition B (22 November 2026).** [PR #93](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/93), reviewed head `be0059a2e264926ac04f38cf84f962b70cb259fa`, merged main `44409ab3b2f08130f4d733d30c652b8ab5376ca9`, [exact-head Atlas unit/static and desktop+phone browser validation](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45068527340) and [successful GitHub Pages build/status/deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45068669005) all SUCCESS. Five original owner JPGs cover Jaune Sector 12/Wild Zone 6 (`jaune12-wz6`); six cover Café Cyclone's concealed courtyard (`vert-cyclone`). The owner source images are preserved at **original archive** and **11-photo reimport ZIP** in private Pokémon Atlas Library; the 11 published JPEG Git blobs and source hashes are recorded in [AT-264 provenance](docs/qa/ATLAS_AT264_OWNER_HOLOVATOR_GALLERY_PROVENANCE_2026-11-22.md). Future Workspace port should first audit the original site's source, preserve its progress keys and permissions, then reuse only the checked bytes and descriptions. Neither the original Site nor Supabase has been altered.

## Source of truth and immutable baselines

- Repository: `trevieisking/lumiose-atlas-pokemon-za`
- Original city background: `maps/lumiose-game-map.jpg` (1920 × 1920, unchanged).
- Original guide pages `maps.html`, `maps.js`, `sector-maps.html` and the entire original walkthrough remain unchanged by this stage.
- Existing inventory counts preserved: 48 sectors / 20 Wild Zones / 264 item records / 100 screw clues / 146 approximate map leads.
- Supabase, the owner's ratings, feedback and saved playthrough progress must stay untouched.
- Static map candidate registration does **not** prove 23 individually matched physical Holovator IDs or exact rooftop exit coordinates; label any unverified geometry accordingly.
- Dynamic Hyperspace DLC Wild/Battle/Rogue Mega icons move each in-game day and must **never** be permanent lift pins.

## Ready in GitHub source (pending merge)

- Research and plan: `MAPS_SECTOR_UPGRADE_MASTER_PLAN.md`, `MAPS_UPGRADE_MANIFEST.json`, `ATLAS_DUAL_SITE_FIX_LEDGER.md`, and source-evidence JSONs in PR #58.
- Isolated read-only map prototype: `holovator-research-preview.html` (16 research positions) and separate `ladder-research-preview.html` (owner-verified Hotel Z L001) in PR #59. These do not replace or modify existing `maps.html`.
- **Photographed lift #061 — My Favorite Holovator, Bleu Sector 3:** ground player position approximately `(765,1396)` on original city image; owner photo ground lift and rooftop scene. Clean preferred game screenshots `1000027244.heic` overview, `7245` ground map, `7246` close map, `7243` actual lift, `7247` roof. Exact upper X/Y missing.
- **Photographed existing WIDE-C13 / `r-vert4-south` — Vernal Pokémon Center, south of Café Classe:** ground player position near prior `(943,1466)` research dot, five clean files `1000027372–1000027376.heic`, physically confirmed same prior yellow symbol, rooftop photo obtained. **Do not count as another 23-category device.** Full research in `MAPS_VERT_CAFE_CLASSE_SOUTH_OWNER_LIFT_SURVEY_2026-11-22.json`.
- The original uploaded `.heic`-named files are **JPEG bytes, 1536 × 865**. Preserve the original bytes when publishing as semantically named `.jpg` assets.

## Image upload / publishing status (important)

The owner has now **explicitly authorized storing the gameplay screenshots in the GitHub guide repository**, rather than only in private chat artifacts. However, the currently accessible GitHub contents actions accept **UTF-8 text** and the GitHub blob API needs literal base64 content: the original JPEG **binary bytes have NOT been transferred to GitHub in this stage**. The JSON records preserve source filenames, SHA-256 hashes, dimensions, accepted roles and intended file paths. **Do not fabricate existing GitHub asset URLs or introduce broken image tags into the site.**

Planned future source paths:
- `assets/atlas/holovators/mission-061/`: 5 preferred clean screenshots (roles in `MAPS_HOLOVATOR_061_CLEAN_GUIDE_PHOTO_REPLACEMENTS_2026-11-22.json`).
- `assets/atlas/holovators/vert4-south/`: 5 owner screenshots (roles in `MAPS_VERT_CAFE_CLASSE_SOUTH_OWNER_LIFT_SURVEY_2026-11-22.json`).

Once a binary-capable authorized source-upload route is available, verify all 10 SHA-256 hashes, add photographs at those paths on a branch, validate no secret content, and integrate relevant `<figure>`/gallery content in the interactive walkthrough only after original ChatGPT Site editor permission is confirmed. GitHub image hosting is a separate action from ChatGPT Site editing.

## Next owner field target (one lift, no duplicate)

The next **different** yellow fixed Holovator symbol is `r-vert4-east`, near original city-image research `(1055,1383)`, **eastern/right edge of Vert Sector 4**, northeast of the just-photographed Vernal Pokémon Center lift, towards Café Classe. On fresh `1000027374.heic` the yellow double chevron is at approximately **(895,204)**; feature alignment projects it to older owner VP-C around **(461.8,595)** matching previously seen old chevron (465,592). This is **not** the current WIDE-C13 unit. Ground-versus-rooftop access is not yet proven: follow map to building and photograph physical device plus current-position red ring; optional roof photo.

**Do not modify the original ChatGPT Site URL, GitHub main's existing guide routes, database or player progress as a side effect of evidence work.**

## AT-265 superseding update — independent GitHub galleries staged, not original Site (22 November 2026)

The historical “image upload pending” section above describes the older AT-258 checkpoint. This AT-265 branch `feat/atlas-at265-final-owner-holovator-photo-galleries-20261122` now supplies the last **10 source-verified preferred photographs** for `bleu3-fav` and `vert4-south`, together with captions and directions in the existing Atlas Explorer gallery: see [AT-265 provenance](docs/qa/ATLAS_AT265_LAST_TWO_OWNER_HOLOVATOR_GALLERIES_2026-11-22.md). The two earlier empty galleries are expected to become complete after the GitHub PR tests, merge and Pages deployment. **The original ChatGPT Site is still unchanged**; a future source-authorized port requires its own protected progress/map/feedback validation. Never treat a GitHub release as permission or proof of a Workspace release.
