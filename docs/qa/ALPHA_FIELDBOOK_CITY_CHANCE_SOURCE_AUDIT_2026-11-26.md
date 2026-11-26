# Alpha Fieldbook — city chance-encounter verification (26 November 2026)

**Scope:** One page: `alphas.html`. This research update adds a clearly separate category of *random/chance Alphas* outside the fixed Wild Zone Alpha tables. No map geometry, markers, encounter database, Supabase or player-state code is changed. This page audit is **not** a claim of exhaustive species-by-species verification or exact in-game coordinates.

## Starting point and preservation

- Approved repository baseline: `b2fe22f32244f7bebce96cf0932b90125e1ca602` (PR #213).
- Existing `alphas.html` blob: `8f8d49f1af595d3ce32ddca523b80b3dc2aeeffa`.
- Twenty fixed Wild Zone cards (38 entries outside Zone 20) and the original 67-name Zone 20 pool are retained unmodified. Serebii corroborates the broad fixed roster, including the two separate Pyroar entries in Zone 17: https://www.serebii.net/legendsz-a/alphapokemon.shtml
- The previously corroborated rooftop Alpha Dratini section is retained unchanged, including its six qualified location areas and weather/odds limitations. Local historic evidence: `docs/qa/ATLAS_AT342_CITY_ALPHA_DRATINI_REVIEW.md` and `ATLAS_AT342_CITY_ALPHA_DRATINI_FOLLOWUP.json`.
- Existing story, fossil, HOME, DLC sections, styles, scripts and player-state behavior untouched.

## Verified newly documented examples

| Species | Specific search areas and observations | Independent evidence | Limits |
|---|---|---|---|
| **Riolu** | Rouge Sector 4 rooftop from the exterior shopping-centre ladder; Bleu Sector 5 rooftop via canal/waterway and ladder; Vert Sector 8 roof NE of Hotel Z; Magenta Sector 9 rooftop near Quasartico Inc. (scaffolding/ladders). Japanese Alpha levels around 25–29; sunny morning/day/afternoon. | [Game8 Japan](https://game8.jp/pokemon-legends-z-a/731383), [GameWith Japan](https://gamewith.jp/pokemon-za/525096), [Bisafans German](https://www.bisafans.de/spiele/editionen/z-a/riolu-finden.php), [VGC English ordinary route](https://www.videogameschronicle.com/guide/pokemon-legends-z-a-riolu-location/), [PowerPyx English Magenta roof](https://www.powerpyx.com/pokemon-legends-z-a-riolu-location/) | A guaranteed *ordinary* rooftop habitat is not a guaranteed *Alpha* variant. Rouge 4 exterior-ladder route does not universally require Roto-Glide; alternate crossing routes can use it. Different guides describe different exact roof sides, so no coordinates imported. |
| **Ralts** | Enclosed courtyards Vert Sector 4, Bleu Sector 7, Magenta Sector 7; reported chance Alpha around levels 20–24. Bleu7 approach from Southside Street Holovator, then down into courtyard. | [Game8 Japan](https://game8.jp/pokemon-legends-z-a/731342), [GameWith Japan](https://gamewith.jp/pokemon-za/525124), [PokéMaps ordinary habitat corroboration](https://pokemaps.net/maps/lza/lumiose/ralts) | Guide reports are of random variants, not fixed Wild Zone targets. Weather/time observations should not be generalized beyond the reported site. |
| **Larvitar** | Rouge Sector 7, Bleu Sector 7 and Jaune Sector 6 roof encounters; city random Alpha around levels 30–34. Wild Zone 15 roof has a separate random Alpha mechanism after that Zone's Pokédex survey. | [GameWith Japan](https://gamewith.jp/pokemon-za/525200), [PowerPyx English Bleu7 roof](https://www.powerpyx.com/pokemon-legends-z-a-larvitar-location/) | Rooftop accessibility varies by Holovator and Roto-Glide; some access routes are mission-gated. Do not apply Wild Zone survey requirements to independent city rooftops. |
| **Dedenne** | Magenta Sector 7 roof southwest of Quasartico Inc., via courtyard ladder (Japanese guide reports nighttime in sun). Jaune Sector 11 rooftop reports sunny daytime/night. Zone20 has a distinct rotating pool. City Alpha around level 27. | [Game8 Japan](https://game8.jp/pokemon-legends-z-a/731466), [GameWith Japan](https://gamewith.jp/pokemon-za/525476), [PowerPyx English Magenta ordinary rooftops](https://www.powerpyx.com/pokemon-legends-z-a-dedenne-location/) | Day/night constraints differ by location and by whether a source discusses the ordinary or Alpha encounter. No global Dedenne Alpha weather rule or exact pin asserted. |

## Mechanism and evidence boundaries

Serebii explains that **many, but not all**, city Pokémon spawns can become Alphas and their chance varies by species/location, whereas fixed Wild Zone targets are always Alpha and random Wild Zone chances depend on completing each zone's survey. The 5–40% global range is not an individual Riolu/Ralts/Larvitar/Dedenne probability and is intentionally not displayed as one: https://www.serebii.net/legendsz-a/alphapokemon.shtml

Language mapping reviewed: Japanese `ローズ` / German `Rose` districts correspond to the site's existing English **Magenta** district; Japanese `ベール` is **Vert**, `ブルー` is **Bleu**, `ルージュ` is **Rouge** and `ジョーヌ` is **Jaune**. No source-derived screenshot coordinates have been translated into Atlas map pins.

**Unresolved:** Exact map XY, measured access paths, per-spawn Alpha probabilities, exhaustive city Alpha inventory, whether every weather/time restriction is exclusive and whether current Workspace Site has already imported this article. This update does not introduce new permanent pins or Hyperspace markers.

**Release gate:** Scoped PR against main, recovered-articles workflow and static link/markup checks must pass; preserve old site and do not treat browser touch emulation as physical phone testing. A separate, guarded import is needed for the original ChatGPT Workspace Site.
