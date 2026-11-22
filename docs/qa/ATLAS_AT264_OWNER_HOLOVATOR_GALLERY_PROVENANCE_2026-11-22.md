# AT-264 — recovered owner Holovator photographs imported to Lumiose Atlas

**Date:** 22 November 2026 · **Repository:** `trevieisking/lumiose-atlas-pokemon-za` · **Photo source:** original owner-survey ZIP in private Pokémon Atlas Library · **Archive SHA-256:** `2c819b0817a941e59019240322574ee2b954b54c4e0b567f531f62c1b663c733`

## Evidence, scope and original preservation

Eleven prepared original-owner JPGs from the verified ZIP's `survey-packages/lumiose-atlas-holovator-final-11-github-ready/github-ready/` subtree are imported **byte-for-byte** into new, non-colliding GitHub paths. They provide actual in-game city map screenshots, entrance views, physical lifts and roof arrivals for **Jaune Sector 12 / Wild Zone 6** (`jaune12-wz6`, 5 images) and **Café Cyclone / Vert Sector 5** (`vert-cyclone`, 6 images).

These are the archive's **already-prepared GitHub-ready JPEGs**, not an assertion that every one is a lossless untouched original camera file. In particular, the archive's previous photo-preparation manifest records a small television-bezel crop for one Café Cyclone ground image. No crop, recompression, generation or alteration was done during this import. The original source archive and its 81 `.heic`-named (JPEG-encoded) records remain privately preserved and are **not** published here.

Each GitHub blob was created from source JPEG bytes and its calculated Git blob SHA-1 was compared with the original survey import manifest before being written to the branch. The proposed PR should require both existing-image test integrity and the new per-file **SHA-256** test in `tests/atlas_explorer.test.mjs`.

## Exact source-image fingerprint inventory

| Image path | SHA-256 | Git blob SHA-1 |
|---|---|---|
| `assets/atlas/holovators/jaune12-wild-zone-6/holovator-jaune12-wild-zone-6-ground-lift.jpg` | `1be48dee84da95c57751802c38dc97f5f78abbc220d69f3011157441cd2192ab` | `a93fcdb10ebb748f9f6b430004eab56bafef4491` |
| `assets/atlas/holovators/jaune12-wild-zone-6/holovator-jaune12-wild-zone-6-wide-city-map.jpg` | `73c0f6c6a653d088dcdf561530a4fdbf0ac6e586ac10775ad7caa1dd699cf60f` | `7e2952db2e14ffd84026dcbb73ab3bcdc8dfd1d5` |
| `assets/atlas/holovators/jaune12-wild-zone-6/holovator-jaune12-wild-zone-6-neighbourhood-map.jpg` | `a0dfdf51d3072435e3d241d6715aa71c8ceafb4bad87d9f431457981aacb32e7` | `c75c597f2cdc6766a4300a91711887afba18255c` |
| `assets/atlas/holovators/jaune12-wild-zone-6/holovator-jaune12-wild-zone-6-close-map.jpg` | `9b7d73d13528cfb20a9377784e6c85c7080e601170e09d6975673c42a992c589` | `f84271e542eccbd97f0ab270bc570eee172e3ca4` |
| `assets/atlas/holovators/jaune12-wild-zone-6/holovator-jaune12-wild-zone-6-rooftop-arrival.jpg` | `edd1009c4ae58c0e61647e7c703a68c9fb63abbab7f40439bab4652b0c6bbfd1` | `e6c20670a259f9e5a2fec545283e641473f25436` |
| `assets/atlas/holovators/vert-cafe-cyclone/holovator-vert-cafe-cyclone-courtyard-arch-approach.jpg` | `7db88cce6a1f83bad79415e65875c45e3a1cfd150a1f6b563e1958a7883f6206` | `5f3c028b2bc1a1b70efb9f36c01b8bdeb2840ef8` |
| `assets/atlas/holovators/vert-cafe-cyclone/holovator-vert-cafe-cyclone-courtyard-ground-lift.jpg` | `ed428e7da2a05e12f805c20c6731a164742d23da7ef7b774ed42ad3a5564bfea` | `385ec3c58a6b6a773ff8b8f38f00f96a97971e68` |
| `assets/atlas/holovators/vert-cafe-cyclone/holovator-vert-cafe-cyclone-wide-city-map.jpg` | `dc250d75845ad454809a0cea72200cf28971b917a07c64782a87011fa8756459` | `e9059b075a91fb91b7eb6d9cda8c3b51c714f7fa` |
| `assets/atlas/holovators/vert-cafe-cyclone/holovator-vert-cafe-cyclone-neighbourhood-map.jpg` | `23480416a825e0f59bc7cd3909abe7c0a9c6ebfe91538b9fa6bb590e6a466146` | `d332883c544b5de7877d8772e0d81ac9c47177e2` |
| `assets/atlas/holovators/vert-cafe-cyclone/holovator-vert-cafe-cyclone-close-map.jpg` | `29a64ecfadfb53209a1ddcfdc6d63c46aff1539306b3efc578b40f0da42e1caa` | `a052c7748d9be7e9332a07f17a8eb00f10ac3fed` |
| `assets/atlas/holovators/vert-cafe-cyclone/holovator-vert-cafe-cyclone-rooftop-arrival.jpg` | `fe6389e7b746adf3e61aceec20ece8b2fd5f4cef485f15e6a67faad904085033` | `a4a4fe7b3cacc8e25cca76cd59bb8dad329f9ef1` |

## Guide navigation and limitations

- **Wild Zone 6:** city-wide orientation → Jaune Sector 12 close-up → physical Holovator entrance while avoiding hostile wild Pokémon → recorded rooftop arrival. Directions remain a field approach; no guaranteed safe exit or precise roof point is claimed.
- **Café Cyclone:** Coulant Waterway map → covered stone archway → grassy courtyard → permanent gold-chevron lift → recorded rooftop arrival. Preserve the fact that the precise roof exit and all onward passages are unknown.
- The existing `1920×1920` original city map, **20 Wild Zone centres, 48 sector names, 21 Holovator research points, one photographed Hotel Z ladder, and 90 previously hosted owner JPGs** are immutable baselines. Two other owner locations (`bleu3-fav` and `vert4-south`) remain unhosted pending their **separate** image sources.
- No newly exact or moved XY pins, no invented scaffold/door/room coordinates, and **no permanent markers for moving daily DLC Hyperspace distortions**.
- No edits to existing walkthrough, ratings/feedback, localStorage/player progress, Supabase, or original ChatGPT Workspace Site.

**Release verified:** [exact-head Atlas unit/static and desktop+phone browser validation](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45068527340) SUCCESS at reviewed PR head `be0059a2e264926ac04f38cf84f962b70cb259fa`, including all 101 on-disk photos and 11 exact original ZIP SHA-256 fingerprints. Mobile and desktop screenshots visually checked (workflow artifact #14772043880). [PR #93](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/93) merged as `44409ab3b2f08130f4d733d30c652b8ab5376ca9`; [successful GitHub Pages build/status/deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45068669005) SUCCESS. This is GitHub Edition B only; original ChatGPT Workspace Site and Supabase remain untouched. Private photo reuse pack: `/Pokemon Atlas/lumiose-atlas-owner-holovator-galleries-at264-2026-11-22.zip` (ZIP SHA-256 `20b89ca4961bb4484e242c69e089a7c2dd72575a7f1ab92c24826340dd9f0961`).

[Archive recovery record](ATLAS_OWNER_HOLOVATOR_ARCHIVE_RECOVERY_2026-11-22.md).
