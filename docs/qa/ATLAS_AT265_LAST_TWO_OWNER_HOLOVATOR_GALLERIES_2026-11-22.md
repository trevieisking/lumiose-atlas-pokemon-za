# AT-265 — final two missing Holovator galleries · owner-image provenance

**Date:** 22 November 2026 · **Repository:** `trevieisking/lumiose-atlas-pokemon-za` · **Destination:** independent GitHub Explorer only, not the original ChatGPT Workspace Site.

This release candidate links **10 genuine owner-supplied game JPEGs** to the two previously empty Explorer records. All 10 source bytes were checked against their corresponding source-survey SHA-256 entries before uploading. GitHub's returned blob SHA-1 values were compared against locally computed Git blob identities. Original uploads and the owner's survey archives were not modified.

- **Mission #061 — My Favorite Holovator / Bleu Sector 3**: five specifically owner-approved **game-only** replacements `1000027244, 7245, 7246, 7243, 7247`, not the older TV-framed `7232–7236` photos. Source register: `MAPS_HOLOVATOR_061_CLEAN_GUIDE_PHOTO_REPLACEMENTS_2026-11-22.json`. No cropping, recompression or byte changes during **this** transfer.
- **South of Café Classe / Vernal Pokémon Center**: five different original owner photos `1000027372–7376`; **not** the existing central Café Classe image set or the eastern Vert Sector 4 lift. Source register: `MAPS_VERT_CAFE_CLASSE_SOUTH_OWNER_LIFT_SURVEY_2026-11-22.json`.
- The files have misleading `.heic` original filenames but **start with JPEG FF D8** and are **1536 × 865**. Public paths correctly use `.jpg`; originals stay separate.

## Exact photo manifest

| Published path | SHA-256 of published JPEG | Git blob SHA-1 | Owner original filename | Story role |
|---|---|---|---|---|
| `assets/atlas/holovators/mission-061/holovator-061-city-overview.jpg` | `23c7498623d544361173d1b16b599f1f1d58a90343c4d50e4e1c3b58669cad26` | `e90e7abeeee97e818a57e4d82154ce9a2270df5d` | `1000027244.heic` | wide-city-map |
| `assets/atlas/holovators/mission-061/holovator-061-position-map.jpg` | `59fdea727a75ff3210c736539a1e284e4d0ea08416dd588165d82980f601b1db` | `8aae3f9b52de72e5f4e6a0382e8d8a04c5b5b78c` | `1000027245.heic` | neighbourhood-map |
| `assets/atlas/holovators/mission-061/holovator-061-close-map.jpg` | `69358a039bb501caf9c3d09ae09572537add905616dfc24ecb85f378169fa9ff` | `162d023bbfb814af545489b34b00f076fefb56d3` | `1000027246.heic` | close-map |
| `assets/atlas/holovators/mission-061/holovator-061-ground-lift.jpg` | `f3e03c698b2b2332a836b49da478003849d632d3c943f82fd3d88c1b81cc5962` | `8e689124a2e1e80b309af8f64be064e33063d315` | `1000027243.heic` | ground-lift |
| `assets/atlas/holovators/mission-061/holovator-061-rooftop-arrival.jpg` | `34919c9cbbfaa691d124c02975818035c56e003b10aeab759f39c3608132aa91` | `798046231a47abb392ab2d4179a2fb7bdd0681cc` | `1000027247.heic` | rooftop-arrival |
| `assets/atlas/holovators/vert4-south/holovator-vert4-south-wide-map.jpg` | `788385a53b318dd6b38fcf4b25fdf1c799644cc76980a387ce9b3a5b368bcb54` | `e4c35ef10117c08011de3f5e0640fa14c6ec0cc2` | `1000027373.heic` | wide-city-map |
| `assets/atlas/holovators/vert4-south/holovator-vert4-south-position-map.jpg` | `cb1547dd7cc48e8add4a1775db66b6fe26fc41fa4ee0223cd5b7ea012b98018a` | `ffa34faa03b9cfd144f2121fe77ff3a68f1d3c6d` | `1000027374.heic` | neighbourhood-map |
| `assets/atlas/holovators/vert4-south/holovator-vert4-south-close-map.jpg` | `cbf008523a62742624b00d0ff73da2993e2defb6ce15df6749908f27ffd2a154` | `519f4f509631ae0502855bc38319d4c9b6c85f53` | `1000027375.heic` | close-map |
| `assets/atlas/holovators/vert4-south/holovator-vert4-south-ground.jpg` | `0da2ac85a761456c7efab955692b650b408c7a818b65f9c6965933c0d0e5f8b7` | `665f02f263bd89a5224eba335a951cb632998232` | `1000027372.heic` | ground-lift |
| `assets/atlas/holovators/vert4-south/holovator-vert4-south-rooftop-arrival.jpg` | `9baddff2a0e53f7e781c8e689aa1d60402db2612ae914e0f62997b699fda56ef` | `c193bf83204575a38b020f6ada37f5d55f9a4994` | `1000027376.heic` | rooftop-arrival |

## Map truth and deployment gates

The two original research coordinates remain **approximate 1920×1920 city-image pixels**: Mission #61 `(765,1396)`, Café Classe south `(943,1466)`. The clean #61 map views match the older owner player-ring captures within research-photo tolerance, but do **not** prove one-pixel physical door geometry. Both rooftop scenes were personally photographed, but roof-level native-map coordinates, floor heights and onward traversal are still unverified. No new Holovator count, 23-device category ID, scaffolding or ladder pin is being introduced. **Daily-moving DLC Hyperspace distortions remain unpinned.**

The original 101 gallery JPEGs, 20 Wild Zone centre leads, 48 sector entries, 21 Holovator research points, single Hotel Z ladder, source city map, walkthrough, feedback, Supabase and saved player progress must remain untouched. Required evidence before merge/deploy: exact-head GitHub unit/static CI, phone and desktop Chromium image loading + captions + gesture/compass tests, manual screenshot QA, diff/changed-files review, and successful GitHub Pages deployment. Do not declare live until checks pass. Original ChatGPT Site A remains separately hosted and unchanged.


### AT-265 — verified GitHub release record (22 November 2026)

**RELEASED in independent GitHub Edition B.** [PR #95](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/95) reviewed at **exact head** `529d823bfc18bad5a85073fafa231055500bbf12` and squash-merged to `main` **`6a8cb44fad33ba04abfad7dcbdb5be3a0109dd33`**. [Exact-head Atlas validation run #45070260271](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45070260271): `atlas-unit` SUCCESS (**14/14 tests, zero failures; existing static checks PASS**) and `atlas-browser` SUCCESS (actual Chromium desktop/mobile including #61 and south Café Classe photo decode, captions, native pinch/rotate and existing route/compass behaviours); [screenshot artifact #14773390635](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45070260271/artifacts/14773390635) inspected manually. [GitHub Pages run #45070682539](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45070682539) completed **SUCCESS** at the exact merge commit, including build, deploy and report-build-status jobs. This is a GitHub deployment result, **not** evidence the separate ChatGPT Workspace Site was edited.

The galleries now contain **111** verified owner JPG references across all 21 researched Holovator leads; **zero** remaining Holovator records have `not_hosted` photos. The photo archive `/Pokemon Atlas/lumiose-atlas-at265-final-holovator-photos.zip` in the private ChatGPT Library contains all 10 new source-identical JPEGs plus SHA-256/Git-blob inventory (ZIP SHA-256 `3c66f0be4281d713bff7e4c4efdd6335183784234e948a48f99b2908a9cca8e5`). Original 101 files and 20/48/21/1 map counts preserved; exact ground/rooftop positions still unverified; no dynamic Hyperspace pins.

**Review-service disclosure:** The optional Codex PR review triggered automatically when the draft was marked ready, but exhausted its usage quota and could not complete. It gave **no file/path-specific code or security finding** and did not replace the green native Atlas CI or manually inspected diff/phone and desktop screenshots. No unresolved GitHub code-review threads or changes-requested reviews existed at the merge gate.
