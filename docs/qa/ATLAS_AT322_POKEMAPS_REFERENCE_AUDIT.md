# AT-322 — PokéMaps reference audit and highlighting design

**Date:** 25 November 2026 · **Plan:** ATLAS-MAPS-2026-11-21-V1 · **Baseline:** `8f7b308629978dfba9e3ca25160bc96f7c085604`

Owner supplied [this precise Lumiose view](https://pokemaps.net/maps/lza/lumiose?x=6.57&y=0.75&z=1&s=0.46v) and reported that a clicked route highlights accurately. This is a research intake, not a release or an endorsement of every PokéMaps entry. The public [help](https://pokemaps.net/help) and [Legends: Z-A hub](https://pokemaps.net/games/lza) were reviewed from indexed text. The exact interactive URL and clean base URL returned web cache misses; a direct browser-environment request could not resolve the host. No live interactive click, screenshot, route line, map geometry, underlying data export or image rights were verified. Do not interpret the URL x/y/z/s parameters as Atlas native pixels.

## Design lessons for our own map

- Select a place to focus its area and show encounter details; select a species to show all its known habitats.
- Maintain separate place and species selections so either can change without losing the other. Include independent marker/area-outline settings and an optional encounter layer.
- Use a compact side panel on desktop and a collapsible panel on phone. Preserve deep links and current selection.
- **A habitat highlight is not a walking route.** The help describes highlighting habitats and focusing places. The owner's observed behavior is credible as a design lead; exact Lumiose boundaries and physical route routing remain unverified. Our guide must distinguish area outlines, approximate orientation, exact verified markers and genuinely walkable multilevel routes.

## Recorded source research snapshot (text, not a screenshot)

The [machine-readable evidence register](ATLAS_AT322_POKEMAPS_REFERENCE_REGISTER.json) tracks all 48 existing sector IDs and 20 Wild Zone IDs. Coverage is intentionally honest:

| Coverage | Count |
|---|---:|
| Target area records tracked | 68/68 |
| Sectors with indexed place page reviewed | 3/48 |
| Sectors with any sampled place/species evidence | 36/48 |
| Wild Zones with any sampled species evidence | 5/20 |
| Other named place pages reviewed | 2 |
| Species-reference pages sampled | 15 |
| Full PokéMaps area rosters independently verified | 0/68 |
| Genuine interactive screenshots captured | 0 |
| Verified new boundary polygons / traversable routes | 0 / 0 |

The absence of a source result is **not** evidence that a Pokémon is absent from an area. The indexed place-page results included [Bleu 1](https://pokemaps.net/maps/lza/lumiose/bleu-sector-1), [Bleu 6](https://pokemaps.net/maps/lza/lumiose/bleu-sector-6), [Magenta 6](https://pokemaps.net/maps/lza/lumiose/magenta-sector-6), [Espace Vide](https://pokemaps.net/maps/lza/lumiose/espace-vide), and [Hotel Z](https://pokemaps.net/maps/lza/lumiose/hotel-z). The reference register records sampled species pages and independent cross-check URLs per lead. No entire third-party database or HTML was copied.

### High-value cross-checks and discrepancies

- **Eevee:** seven named city sectors and Wild Zone 19 agree with [RotomLabs](https://rotomlabs.net/dex/legends-z-a/eevee). [Gamer Guides](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/pokemon-locations/where-to-find-eevee-in-legends-z-a) explains the Bleu 7 rooftop approach. Area membership alone does not describe climb access.
- **Riolu:** four sectors agree with [RotomLabs](https://rotomlabs.net/dex/legends-z-a/riolu); [Gamer Guides](https://www.gamerguides.com/pokemon-legends-z-a/database/pokedex/pokemon/riolu/) provides separate rooftop/day/sunny leads. A trade is not a wild spawn.
- **Gastly:** the [PokéMaps species page](https://pokemaps.net/maps/lza/lumiose/gastly) names Zone 18 but does not list Zone 7. [Bulbapedia Zone 18](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_18), [RotomLabs](https://rotomlabs.net/locations/legends-z-a/wild-zone-18) and [Serebii's Wild Zones](https://www.serebii.net/legendsz-a/wildzones.shtml) omit Gastly from the ordinary/fixed Zone 18 roster; Serebii and [Bulbapedia Zone 7](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_7) include Gastly there. TrainerLab also reports Zone 18, so do not dismiss or add the disputed record blindly. Investigate source classification and in-game conditions.
- **Hotel Z Lucario:** PokéMaps uses a broad static label; [Serebii](https://www.serebii.net/legendsz-a/giftpokemon.shtml) and [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Hotel_Z) establish a post-story level-50 gift, not a catch.
- **Magenta 6 Mawile:** PokéMaps reports a scripted encounter; [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Magenta_Sector_6) documents the Rogue Mega Mawile fight. Do not mark it a repeatable catch based on a table row.
- **Zone 20:** [Simisear](https://pokemaps.net/maps/lza/lumiose/simisear) and Absol exemplify a generic Walk label that does not convey rotating Alpha availability. Preserve the ordinary/rotating distinction from [Serebii Pokéarth](https://www.serebii.net/pokearth/lumiosecity/wildzone20.shtml).

### Current Wild Zone release (AT-321)

Reopened exact PR #160 head `1a56c8c6a47e83c590998eb0e83cc212f3235b24`. Manually compared all 20 standard species sets with Serebii's aggregate list (fixed Alpha union in Zones 1–19, ordinary set in Zone 20); no membership differences observed on that comparison. The sample PokéMaps audit does not verify all species, per-species conditions or map placement. Existing 40 original PNGs and 38 Alpha rows passed unit checks. [Run 45675208275](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45675208275): existing Atlas browser smoke succeeded, but the new AT-321 browser check timed out waiting for visible Zone 1 panel (line 41; root cause not established). **HOLD**. Do not roll out the UI or mislabel the missing screenshot evidence as completed. This documentation PR is separate from that implementation and existing AT-320 PR #156.

## Independent implementation requirements

- Use an original Atlas encounter index keyed by existing zone/sector IDs and species/form; keep ordinary, fixed Alpha, rotating Alpha, special mission, gift, trade and scripted boss categories separate.
- Select a known place to focus/highlight its independently validated geometry, or show clearly labelled approximate orientation until registered boundaries exist. Search a species and highlight every verified area, with condition filters and source evidence.
- Use original owner photographs and existing 1920x1920 map; independently align any candidate geometry using at least four distributed noncollinear landmarks and independent check points, record residuals and ambiguity. Do not infer exact coordinates from the external URL, perspective images or screenshots.
- Keep selection/highlight distinct from route navigation. Only render a walkable path where contiguous street, ladder, scaffold, Holovator, roof, door/floor connections and prerequisites are verified; otherwise preserve written directions without misleading lines.
- Retain the 40 zone images, 48 sector photo references, 20 zone IDs, 264 item records, 100 Screw IDs, 38 fixed Alpha rows, current player progress, feedback and existing Supabase connections. Do not permanently mark transient DLC distortions.
- Document actual browser captures with exact public URL, selection, layers, game, date, viewport, author and SHA-256; retain screenshots as evidence only if rights permit, never treat generated images as proof. No copying PokéMaps proprietary source, database or map tiles; independently authored implementation and credited factual cross-checks.
- Acceptance: complete all 68 area research rows and independent cross-checks, reconcile differences, test area/species selection, filters, mobile gestures, desktop controls and deep links, inspect actual screenshots, then exact-head CI and separate deployment verification.

## Real screenshot intake protocol

- PM-01: full Lumiose map, north-up, visible legend and layer settings — pending
- PM-02: selected Wild Zone 1 highlight, details and actual browser URL — pending
- PM-03: selected Bleu Sector 7 outline and encounter panel — pending
- PM-04: Eevee selected, multiple habitats and list; click one matching area — pending
- PM-05: Riolu selected, rooftop locations and detail conditions — pending
- PM-06: Wild Mode revealed and hidden; same selected place — pending
- PM-07: Zone 20 regular vs rotating Alpha listings, if supported — pending
- PM-08: mobile expanded/collapsed panel; same selection retained — pending

For each capture record public URL and exact selected place/species, game/version, layers, viewport, date, source attribution, original dimensions and file hashes. Compare screenshots against owner game photographs and native map landmarks. Retain an unmodified original and a separately labelled crop if permitted; confirm third-party reuse rights before committing image bytes to a public repository. Use our own game captures for the player guide, not a copy of the source's presentation or code. No generated image is accepted as visual proof. No third-party PNGs or fake screenshots were created.

**Preservation:** no gameplay code, original map, sector/zone coordinates, user progress, feedback, Supabase public data, live Workspace, or external media changes. This is a partial, resumable source audit; a complete 68-area interactive survey is still pending.
