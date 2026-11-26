# AT-345 — Wide, sector-centred map photographs + AT-330 fashion Shops handoff

**Date:** 26 November 2026  
**Owner evidence:** original Site screenshot `1000029121.jpg`, showing Jaune Sector 2 cropped too tightly.  
**GitHub issue:** [#217](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/217)  
**Existing project:** `trevieisking/lumiose-atlas-pokemon-za` / existing original Workspace Site `appgprj_6afda588d5948191b4143e40a1f9c291`.  
**Planning revision:** Manifest **98** / dual-site Ledger **106**. Prior **released** Map 2.0 cross-grid Manifest 97 / Ledger 105 is unchanged and retains its original release receipt, SHA, proofs and Workspace prompt.  
**State:** **planned/review pending**, not a deployed photograph swap or original Workspace release.

## Observed defect and cause

The Jaune Sector 2 card links to `assets/atlas/sector-streets/jaune/jaune-sector-2.png` through `atlas-explorer-data.json` → `atlas-area-model.mjs` → `atlas-area-ui.mjs`. The existing image is **310 × 175 original-crop pixels**, from screenshot `1672 × 941` crop bounds `[1120,510,1430,685]`, according to `MAPS_SECTOR_STREET_IMAGE_LIBRARY_2026-11-24.json`. The published card is technically an original source crop but isolates too little of the surrounding street map for players to orient themselves. Other sector photographs share this over-narrow presentation risk.

The prior AT-344 owner-source survey records **48 sector entries, 26 immutable 2026-11-25/26 JPEG originals**, and candidate original views for each sector. The originals, including exact hashes, are preserved under `docs/qa/at343-owner-item-crosses/sources/` and `docs/qa/at344-sector-source-survey/sources/`. See `docs/qa/at344-sector-source-recovery-2026-11-26/source-recovery.json` and `docs/qa/at344-sector-source-survey/sector-coverage.json`. The latter explicitly reports `selected_best_original:null`, `full_view_quality_confirmed:false` and `runtime_source_replacement_approved:false` until source-by-source review is complete. Source availability does not imply 48 reviewed renderings or global geometric coverage.

## Required map presentation

For **each of the 48 sectors**, choose a copy of the highest-quality suitable **verified original** north-up source, keep the sector's named area near the centre *and show useful surrounding blocks*. Favour adjacent streets, neighbourhood labels, canal and plaza edges, buildings, services, Wild Zone edges and visible route approaches over a letterbox around only the sector name.

- Prefer a **large, readable contextual map window** on phone and desktop, not a thumbnail magnifying a 310 × 175 image. Maintain source aspect ratio, intrinsic resolution and north-up direction. No stretching, invented pixels, interpolation passed off as source detail, retouching, border fabrication or speculative sector edges. Preserve a way to open the wider source at full resolution.
- Treat **existing 42 source crops covering 48 sector IDs** as secondary/detail references and fallbacks until each replacement passes review. Never delete originals, current crops, existing map images, source manifests or alternate candidate photographs. When source has obstructing UI/game icons, select a clearer candidate if available; never erase unknown map content with synthetic reconstruction.
- Each sector candidate must register `sector_id`, exact immutable `original_path` and SHA-256, original dimensions, derivative path/hash/rectangle, visible named district and nearby landmarks, any cropping/occlusion/legibility issue, north-up orientation, review status, current fallback path and tester/date. A candidate labelled `source_image_orientation_only` stays such unless independent native Atlas registration is proved separately.
- Do **not** treat a good contextual view as verified coordinates, a lift entrance, exact item position, rooftop floor, an Alpha spawn, a new traversable polygon or an endorsed meaning for the faint crosses. Keep random Hyperspace distortions out of permanent pins.
- Display the contextual image before or alongside an optional detailed close-up, photo-backed directions, verified area outlines and guide links, without changing feature IDs, URLs, localStorage keys or map selector/rotation/zoom/pan behaviour.

**Jaune Sector 2 starting review:** Existing `jaune-sector-2.png` is 310×175. AT-344 candidate originals:
`docs/qa/at343-owner-item-crosses/sources/20261126_144931.jpg`;
`docs/qa/at344-sector-source-survey/sources/20261126_161334.jpg`;
`docs/qa/at344-sector-source-survey/sources/20261126_161350.jpg`.
The latter two carry a readable name under the historical label/context survey, not a verified full sector silhouette. Review the broader image around Jaune 2 together with **Jaune Street, Saison-Canalside, neighbouring Jaune sectors and Hibernal Avenue** wherever visible in the selected original, without forcing all landmarks into one frame if their legibility suffers. The demonstration image produced from a copy for QA is **not** a released asset, registered map or selected best original.

## Required two-site review gates

1. **Source audit (48/48):** compare candidates against current 42 crops and original 26-file hash inventory, preserving every original unchanged. Record 48 one-to-one dispositions, including `cannot improve yet` where appropriate, never an unverified replacement.
2. **Candidate derivation:** create separate contextual derivatives or non-destructive source-window display; captions acknowledge orientation-only status. No one-size-fits-all crop that discards edges. Do not change any existing map basemap, cross-grid or geographic geometry.
3. **Automated regression:** verify all 48 image references exist and decode; check nonzero intrinsic size, source/provenance references, broken-path fallback, no new map pins, unchanged marker IDs, photo links, maps, filters, 20 Wild Zones, 18/200 Shops inventory and player progress storage keys.
4. **Human visual QA:** review *actual rendered* Jaune 2 and representative sectors in all five districts and all variant aspect ratios at Android phone and desktop viewport; visible roads and neighbouring landmarks, no horizontal overflow, pin/overlay obstruction or scroll traps; full-size opens. Claim physical device testing only if actually performed.
5. **Promotion:** reviewed non-main branch → exact head tests/visual evidence → guarded PR merge → matching GitHub Pages deployment/live checks → **independent existing-Workspace Site import** after source comparison, same-site restore point and rollback. No separate replacement site or new paid service. Record both edition statuses separately in private checklist; no inferred Workspace publication.

## Shops, clothing and hair salons — integrate in the *same next Workspace package*

GitHub [PR #216](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/216) **already merged at** `0a460046187d029a08656f12168f87be4db20d15`. It adds the Shops fashion hub's **41 boutiques in five shopping arcades and five hair salons**, with independent fashion search and direct access to `clothing-guide.html` and `hair-beauty-guide.html`, while retaining the **18 shop groups/200 item records**, existing prices/calculators and maps. The relevant original pages remain separate and present.

The **original live Workspace Site has not been independently verified to contain this merge**. Import/reconcile its shops from the exact reviewed GitHub files only after confirming its current version. Show clothing and salons from the main Shops page, maintain the 41/5 identity catalogues, preserve all original commerce-related guide content and filter behaviour; check phone/desktop search, accordions, salon links and Furfrou navigation without inventing boutique door pins. Link existing private tracker rows `AT-330-SHOPS-STYLE-HUB`, `AT-330-CLOTHING` and `AT-330-HAIR-BEAUTY` rather than duplicating their work. Keep their Workspace statuses **OPEN** until same-Site verification.

**Existing Site ID:** `appgprj_6afda588d5948191b4143e40a1f9c291`  
**Existing Site URL:** https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site  
**Existing GitHub repository:** https://github.com/trevieisking/lumiose-atlas-pokemon-za

## Tracker / protection

Use the existing private `atlas_internal.feature_checklist` in the existing Supabase project. Create the new `AT-345-SECTOR-CONTEXT-PHOTOS` requirement as **OPEN on GitHub planning** and **OPEN on original Workspace publication**. Record issue #217, this document, manifest 98 / ledger 106, unshipped visual-swap state and AT330 crosslinks. Never mark GitHub picture release or original-Site publishing verified from a doc-only merge. Preserve all prior rows, their `verification_note` histories, revision history, GitHub/Workspace statuses and evidence timestamps except explicitly guarded metadata; do not touch `public.atlas_reports`, player accounts/progress, feedback, map tiles, or active database schema.

**Master-plan requirement closure:** only after the 48 visual quality dispositions and accepted candidate renderings are documented, linked and published with actual tests. **AT-330 Workspace closure:** only after original-Site Shops/fashion/salon import, restored references and live phone/desktop verification. The two closures are independent even though they belong in one Workspace handoff.
