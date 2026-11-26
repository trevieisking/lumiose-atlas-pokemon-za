# AT-338 — compact Item and Colorful Screw layers

26 November 2026 · AT-333 implementation · Manifest 83 · Ledger 91

## Scope and release state

**Implemented candidate; exact browser, visual and deployment validation pending.** This is a bounded layer/directory release. It does not certify all Interactive Map 2.0 requirements or authorize the final Workspace prompt. Baseline main is `71cde4ff5990e6ad05299bee7494963364e70354`, tree `b1ec2dfb7166d4b607c60cdc51e1855f14f7ae72`.

The audited `items-data.js` contains 264 original item records and 100 numbered Screw clues. Its pure global data assignment can be imported without loading the checklist controller. The original progress owner remains `lumiose-atlas-reconstruction-v1`: item values use `pickup[originalId]`, Screws use `screw[originalId]`. Original detail links are `items.html#item-ID` and `items.html#item-screw-ID`.

The 146 approximate leads remain a separate dataset. AT-334/335's identity candidates, historical height values and registration pilot do not prove physical floor or exact pickup placement. Production `atlas-collectibles-data.json` therefore contains **zero placements**. All 364 original records remain searchable and link back to the checklist; no new progress namespace is created.

## Implemented behavior

- Items and Colorful Screws have independent switches, initially off. Directory and clue access remain available with either layer hidden.
- Eligible dots are 7 CSS pixels with distinct colors and a text legend. Selected/focused outlines occupy 11 pixels. The inverse transform keeps visual size stable through zoom/rotation; existing major markers are unchanged.
- Keyboard buttons have 44px targets. Pointer-transparent dots leave the map gesture surface intact; viewport proximity taps use a 24px screen radius. Movement and multi-touch cannot select a pickup. Nearby or coincident records open a chooser by original identity, scene and floor, without moving or merging coordinates.
- Search, collection filter, accessible list, selected details and original-ID deep links use stable DOM records. Choosing a directory row does not change layers or camera; a verified record's explicit Show on map action enables only its layer and centres that point.
- Details preserve the original name/quantity text and clue, link to the original checklist, and display read-only collected status. Verified placements additionally require scene/floor, unlocks, written route and evidence; validated local still-photo links are supported.
- Storage reads are isolated to the adapter. Valid original booleans are used without coercion. Corrupt or unavailable storage reports progress unavailable. Focus, pageshow and storage events refresh the display; no write, reset, migration or checklist mutation occurs.
- Failure to load new placement evidence keeps the original map usable and the directory available. No production fixture flag, special query or development endpoint exists.

## Placement gate

The pure eligibility engine requires the exact original record ID, unique physical pickup identity, a fixed source class, exact native map hash and 1920×1920 coordinate space, finite in-bounds XY, supported scene, descriptive verified floor, route, unlock and dated provenance. Six explicit verification fields are required. This is an approval-record schema, not independent physical verification of its assertions.

Rewards, hidden/random outcomes, transient/temporary entries, duplicate record or physical IDs, unknown scene/floor/route evidence, unregistered source coordinates and malformed data cannot create pins. Supplied photographs must be existing local still-image paths; production additions still require manual evidence review. No media player or video integration is restored.

## Validation required for promotion

Local validation has passed **67 relevant unit/integration checks** and the static check of 17 sections, 645 links, 1,431 image/script references and 578 captured resources. The original media-removal test is unchanged and passes. Independent UI review found and corrected keyboard focus after chooser selection and clearing. Local Chrome is unavailable; actual browser and screenshot approval remain pending the exact CI head.

1. Run existing geometry, routes, source/photo counts, guide links, item checks and static validation alongside the new engine tests. Confirm all existing source data, images, checklist code and other application pages are unchanged from baseline.
2. On real Chrome CI, use desktop and phone viewports. Check production's 364 directory records and zero pins, all four layer combinations, read-only progress and useful empty state.
3. Intercept test responses only to supply 364 synthetic fixed records. Preserve original IDs in those fixtures; reward/random classification overrides are expressly counterfactual test data. Exercise dense overview/zoom, accurate screen-space overlaps, keyboard/touch selection, both collection filters, deep links, photographs, gestures and compass.
4. Assert original progress bytes and unrelated keys survive every action, including unknown future fields, corrupt JSON, malformed values and denied storage. Refresh external changes without writing them. Check invalid coordinates retain the original directory row.
5. Inspect actual desktop/phone screenshots. Confirm no horizontal overflow, readable controls/details and stable DOM/pin counts during repeated operations. These are bounded performance checks, not a broad device benchmark.
6. Review the exact candidate commit and any review findings, merge only that reviewed head, verify the exact Pages deployment and live public bytes/interaction, then record a release receipt. Missing checks are not passing checks.

The browser fixtures are isolated inside `tests/atlas_collectibles_browser.mjs`; `atlas-collectibles-data.json` must remain empty until independently verified production evidence is approved.

## Preservation and rollback

Unchanged: 48 sectors, 20 Wild Zones, 26 routes/151 steps, 78 access leads, 21 Holovator entries and original photographs, Hotel Z ladder, all existing map geometry/assets, original item/Screw IDs, 146 approximate leads, guide pages, account/Supabase integration and completed feedback. No original Workspace publication is included. Videos remain paused.

Rollback is a normal revert of this bounded feature commit/merge, restoring the four edited Explorer/workflow files and removing only the new collectible modules/register/tests. There is no database migration, progress migration or media restoration. Preserve later independent changes and historical planning records when applying a revert.

The full AT-325 G2/G3 evidence, shared area/habitat interactions and G5 complete-release checks remain open. The approved full-upgrade SHA and final executable Workspace prompt remain unset.
