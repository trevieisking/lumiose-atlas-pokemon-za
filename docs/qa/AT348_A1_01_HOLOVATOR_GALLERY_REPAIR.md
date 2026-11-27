# AT-348 A1-01 — Restore all ten Looker Bureau / Sushi High Roller photographs

## Preflight and scope

27 November 2026. Main bdfce92bfa7324517d0a1e2f8db7eec84983eefb, active draft PR229 parent ba4bb222b6c644ddf15a542c918942e5e5c1fe6c, Manifest 105 / Ledger 113. Read both master plans, joint manifest, ledger, active register, cycle, ordered plan, whole-guide audit and Workspace resume inventory. Previous exact-head workflows 46066107365 and 46066107372 passed. Existing original Site last recorded v40, rollback v39; actual persisted Work draft not independently accessible in this turn. PR226 remains separate field intake. No new PR.

## Confirmed defect and narrow repair

The existing data contains 21 Holovator records and 111 owner photo references. rouge5-looker contains 10 photos, but the renderer used `item.photos.slice(0,8)`, hiding the final two files:

- assets/atlas/holovators/rouge5-looker-sushi-high-roller/alternates/holovator-rouge5-looker-sushi-wide-city-map-revisit.jpg
- assets/atlas/holovators/rouge5-looker-sushi-high-roller/alternates/holovator-rouge5-looker-sushi-rooftop-arrival-revisit.jpg

Change the loop to iterate the registered array without truncation; remove the obsolete note about additional photographs. Keep existing lazy loading, async decoding, alt/captions, full-size link and local JPEG path filter. Do not change photos, data, CSS, coordinates, routes, marker IDs, storage or feedback.

## Verification contract

- Source diff restricted to the gallery iteration and obsolete note.
- Existing unit suite still verifies all 111 unique hosted JPEGs and unchanged approximate marker positions; new regression checks the ten-role inventory and absence of the cap.
- Existing browser suite now deep-links to rouge5-looker in desktop and phone emulation, checks 10 rendered figures, ordered image paths and full-size links, successful decoding of all ten, lazy loading, both previously hidden captions, no sideways overflow or JS errors, and saves gallery screenshots.
- Run existing article and map CI at the exact new head. Actual saved screenshot review and original-Site publication remain separate gates. Do not claim success before readback.
- A1-02 full-resolution Wild Zone mapping and A1-03 full gallery audit remain open. No new assets needed for A1-01; do not request another upload.

## Workspace

Reconcile this repair into the existing Site only as part of the final reviewed source-pinned release. Inspect the saved Work draft first; do not repeat changes already present. Update both plans/manifest/ledger/register and the shared continuation inventory at 106/114. Keep historical receipts and original v40 rollback protected. No current live changes.
