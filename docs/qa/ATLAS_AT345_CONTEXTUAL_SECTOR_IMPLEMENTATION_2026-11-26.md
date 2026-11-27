# AT-345 — 48 wider, source-faithful sector photographs (implementation candidate)

**26 November 2026** · [Owner requirement #217](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/217) · [existing AT-344 source survey](at344-sector-source-survey/README.md) · [AT-345 specification](ATLAS_AT345_SECTOR_CONTEXT_PHOTOS_AND_SHOPS_2026-11-26.md)

## Root cause and protected baseline

The user's original Workspace screenshot shows Jaune Sector 2 as an overly tight **310 × 175-pixel** source crop, making it difficult to recognise the surrounding streets. The GitHub edition's shared area panel and static 48-sector clue directory likewise display the narrow AT-304 photograph crops. The archive actually contains a complete owner-supplied source collection: **26 original JPEGs, 48 sector candidate mappings and 40 Wild Zone overview/close-up assets**.

A new upload or location collection is **not required** for this scoped visual upgrade. No coordinates, buildings, labels, streets or markers are fabricated.

## Non-destructive implementation

- Existing 26 exact source JPEG files are **not edited**. The 10 best existing *candidate frames* selected for the 48 named sectors are referenced under `assets/atlas/sector-context/`, using **identical Git object SHAs**. There is no image compression, resizing, upscale or replacement of original archive objects.
- `atlas-sector-context.mjs` is the **single readable 48-sector display register**: every stable sector ID maps to one of those ten provenance-checked originals, its independently inspected photograph-frame focus fraction, source dimensions and SHA-256, and the existing source-crop fallback path. The focus fractions are **image-display measurements**, not geographic X/Y, grid crossings, floors or item pins. North-up source pictures retain their orientation.
- `atlas-area-ui.mjs` now shows the original full-resolution photograph in a **wider, sector-centred 16:9 window**, including adjacent streets/plazas/canals/buildings. A tap opens the *complete original* at full resolution. The small legacy crop is preserved in an optional disclosure. On a broken new image, that enhancement disappears and the old original crop remains.
- `sector-context-directory.mjs` installs the **same** contextual photograph in the existing `sector-maps.html` clue cards via the current deferred `sector-maps.js`; no rewrite of the 566 KB historic HTML or the 264 items/100 Screw clues. CSS is strictly scoped to the contextual windows. The original sector/wild-zone map code, filters, marker IDs, exact reviewed geometries, cross-grid, 20 Wild Zone photo pairs, localStorage keys and Supabase/feedback connections are unchanged.
- The archived 42 small image crops, all 26 source photos, existing 1920 × 1920 game-map JPEG, previous photo galleries and 25-link menu are retained byte-for-byte.

## Documented review and evidence boundaries

A **48-frame, five-district visual preview contact sheet** was generated from the owner's exact original local image bytes using a fixed 16:9/2.15× display recipe. Jaune 2 was directly examined against its original (showing Jaune Plaza, Jaune Street, Saison-Canalside, the canal and adjacent Jaune sectors); each sector has a source candidate from the previously recorded AT-344 list. This supports the source-selection and aesthetic *orientation* objective. It is **not** registered native gameplay geometry, and does not prove every sector boundary or full-city photographic seam is complete.

The original AT-344 source register retains its historical `selected_best_original:null` entries; this implementation is a separate current display selection, **not retroactive modification of the archive survey**. Each caption warns that an overview is *not* proof of exact collectible, Alpha spawn, entrance, roof/floor or arbitrary Hyperspace coordinates.

## Required release gates

1. `node --test tests/atlas_sector_context.test.mjs`: all 48 IDs, source candidate membership, 10 byte-identical public/archive image assets, SHA-256 checks, existing crop fallbacks, original 20 Wild Zone pairs, no storage writes or geographic geometry.
2. `node tests/atlas_sector_context_browser.mjs`: **phone 393×852** and **desktop 1440×900** screenshots of Jaune 2, one source view in each other district, and Jaune 2's old sector directory; decode original images, validate internal full-image links, preserved old crops, no horizontal overflow, original progress and Wild Zone gallery.
3. Existing entire **Atlas Explorer** workflow (model, native 68 outlines, cross-grid, rotation, map layers, 264 items/100 Screws, source archives and all guide links) must pass at exact reviewed PR head. Run unchanged `validate-recovered-articles` and source integrity jobs as appropriate.
4. Review the actual GitHub Actions visual screenshots and unresolved issues; merge only with exact-head lease on **main**, confirm matching tree and successful GitHub Pages deployment; test live original image loading on phone/desktop. If any required proof is unavailable, keep the PR open and do not promote.
5. The **original Workspace Site** is a separate edition: do not claim this PR changes it. Once exact verified GitHub release exists, compare current Site source and import the 48-source metadata/viewport behaviour *alongside existing merged AT-330 Shops PR #216* (41 boutiques/five arcades/five salons). Backup, preview and test its original data/services; publish to the SAME Site ID/URL only after independent verification. No replacement Site, cost increase or new Supabase service.

## Shared ledgers

The previous **planning** marker is Manifest 98 / Ledger 106, private `AT-345-SECTOR-CONTEXT-PHOTOS` entry OPEN; AT-330 clothing/hair/shops Workspace entries OPEN. This feature candidate must not be marked GitHub `verified` or Workspace `verified` until the evidence listed above actually exists. Keep historical cross-grid Manifest 97 / Ledger 105 receipts as the earlier verified runtime.
