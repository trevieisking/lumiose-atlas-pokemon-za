# Saved Atlas research inventory

**Inventory date: 26 November 2026.** This index reconciles retained research with repository data. It does not claim that the pending AT339 candidate has been promoted or that the independently published original Workspace has received later GitHub changes. [Provenance and file hashes](recovery-provenance.json) record the inspected candidate and main commits. No new web research was performed for this index.

## Research already preserved

| Checkpoint | Exact saved records | Result and remaining implementation boundary |
| --- | --- | --- |
| AT331 | [International route research](../ATLAS_AT331_INTERNATIONAL_ROUTE_RESEARCH.md), [route register](../ATLAS_AT331_INTERNATIONAL_ROUTE_REGISTER.json), [access survey](../../../MAPS_ACCESS_ROUTE_SURVEY.json) | All 13 added leads are present, byte for byte, in the access survey. They remain source-attributed research leads and have not been added as new Explorer route records. |
| AT332 | [Item-coordinate source audit](../ATLAS_AT332_ITEM_COORDINATE_SOURCE_AUDIT.md), [coordinate register](../ATLAS_AT332_ITEM_COORDINATE_REGISTER.json) | Five remembered Screw coordinates are saved exactly below. This checkpoint reached 12 cumulative source-reference matches, with zero eligible independently registered calibration pairs and zero approved new pins. |
| AT334 | [Workspace pickup recovery](../ATLAS_AT334_WORKSPACE_PICKUP_RECOVERY.md), [146-record recovery register](../ATLAS_AT334_WORKSPACE_PICKUP_RECOVERY_REGISTER.json) | All 146 archived positions, original IDs, labels, percentage/native coordinates and numeric heights are preserved. The source identity and height interpretation still require care; these records are not 146 independently verified collectible locations. |
| AT335 | [Coordinate pilot report](../ATLAS_AT335_PICKUP_COORDINATE_PILOT.md), [pilot results](../ATLAS_AT335_PICKUP_COORDINATE_PILOT.json) | Six fit pairs, five holdouts and two diagnostic-only pairs are saved, together with Screw 91 source-marker evidence. The exploratory transform remains unapproved; this checkpoint reached 13 cumulative Screw source matches. |
| AT339 retained source discovery | [09:37 observations](source-observations.json), [retrieval metadata](retrieval-manifest.json) | Scratch-only Pokemaps observations are now preserved here without importing the underlying provider datasets. Native registration, reuse and encounter classification remain unresolved. |

The four AT331/332/334/335 JSON registers match the retained recovered worktree and inspected main commit `d7021a7af3973f18d54d07634e29c23cc78b0560` exactly. Their hashes are in [recovery-provenance.json](recovery-provenance.json). These research records were not lost.

## All 13 AT331 access leads

Every row below has `access_status: published_research_lead_not_game_walked`, `publish_new_pin: false`, and no approved entrance/exit coordinates or exact floor. The source URLs are copied from the saved register, not newly rechecked. The register's access limitations still apply: some Japanese findings came from accessible search excerpts, French work remained discovery-only, and videos are paused.

| Lead ID | Area | Recorded lead | Existing source references |
| --- | --- | --- | --- |
| `AR-M01-01` | `magenta-sector-1` | scaffold ladder course — Estival Avenue roadside / eastern building | [source 1](https://pente.koro-pokemon.com/legendsz-a/map-rose-district.shtml) · [source 2](https://game8.jp/pokemon-legends-z-a/729591) · [source 3](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-1.html) |
| `AR-M02-01` | `magenta-sector-2` | scaffold ladder course — Alley west of eastern building complex | [source 1](https://pente.koro-pokemon.com/legendsz-a/map-rose-district.shtml) · [source 2](https://gameranbu.jp/pokemonza/e7042aaabead761b753a) · [source 3](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-2.html) · [source 4](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) |
| `AR-M02-02` | `magenta-sector-2` | holovator access — Chuckie's Watchog mission | [source 1](https://www.serebii.net/legendsz-a/sidemissions/theburninggazeofwatchog.shtml) · [source 2](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)) · [source 3](https://gamepedia.jp/pokemon-legends-z-a/archives/16594) · [source 4](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-2.html) |
| `AR-M03-01` | `magenta-sector-3` | holovator rooftop course — Café Gallant / northern building group | [source 1](https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/Exploring_Lumiose_City) · [source 2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-3.html) · [source 3](https://www.bisafans.de/routendex/illumina-city/rose-bezirk-3.php) |
| `AR-M04-01` | `magenta-sector-4` | holovator rooftop course — Magenta Plaza / Rogue Mega Altaria destination | [source 1](https://appmedia.jp/pokemon_legends_za/79398416) · [source 2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-4.html) · [source 3](https://pente.koro-pokemon.com/legendsz-a/map-rose-district.shtml) |
| `AR-M05-01` | `magenta-sector-5` | ladder scaffold course — Café Rouleau / nearby battle court | [source 1](https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/Exploring_Lumiose_City) |
| `AR-M06-01` | `magenta-sector-6` | scaffold ladder course — North-side scaffold complex | [source 1](https://game8.jp/pokemon-legends-z-a/729591) · [source 2](https://gameranbu.jp/pokemonza/e7042aaabead761b753a) · [source 3](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) |
| `AR-M06-02` | `magenta-sector-6` | rooftop crossing — South roof / west alley of large complex | [source 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-6.html) · [source 2](https://gamepedia.jp/pokemon-legends-z-a/archives/16379) · [source 3](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) |
| `AR-M07-01` | `magenta-sector-7` | ladder rooftop course — Courtyard north of sector | [source 1](https://gamepedia.jp/pokemon-legends-z-a/archives/16379) · [source 2](https://gameranbu.jp/pokemonza/e7042aaabead761b753a) · [source 3](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) |
| `AR-M08-01` | `magenta-sector-8` | scaffold ladder course — Southwestern alley / southwestern building complex | [source 1](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations/) · [source 2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-8.html) · [source 3](https://gameranbu.jp/pokemonza/e7042aaabead761b753a) · [source 4](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) |
| `AR-M09-01` | `magenta-sector-9` | obstacle rooftop course — Southern building complex / Café Triste vicinity | [source 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-9.html) |
| `AR-M09-02` | `magenta-sector-9` | scaffold ladder course — Central gap and western North Boulevard edge | [source 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-9.html) · [source 2](https://game8.jp/pokemon-legends-z-a/729591) · [source 3](https://gameranbu.jp/pokemonza/e7042aaabead761b753a) · [source 4](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) |
| `AR-WZ09-01` | `wz-09` | scaffold ladder course — Inside Wild Zone 9 | [source 1](https://gamewith.jp/pokemon-za/523908) · [source 2](https://game8.jp/pokemon-legends-z-a/729591) · [source 3](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/plus-moves/) · [source 4](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/magenta-sector-6.html) |

The current survey contains **78 leads across 29 sectors and one Wild Zone**, with 38 areas still not started. AT331's historical checkpoint contained 70 leads across 25 sectors and one Wild Zone; later written-route work explains the difference. The current Explorer contains **26 route records and 151 steps**. The 13 lead IDs above are not dedicated new route records in that dataset. Their next implementation step is source-attributed written-route integration with explicit uncertainty and existing image references; it does not require pretending that an unregistered coordinate is a confirmed pin.

## The five remembered Screw coordinates

These coordinates are in the publisher's map space. The saved register leaves Atlas position, game-world position, entrance, exit and verified floor unset, with `publish_new_pin: false`.

| Atlas Screw | Source marker | Saved source XY | Reported location | Source link |
| --- | --- | --- | --- | --- |
| 29 | `234530` | `8020, 5146` | Passage Ombragé roof | [saved publisher marker](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=342&markerId=234530) |
| 40 | `236062` | `11569, 3511` | Passage du Palais roof | [saved publisher marker](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=342&markerId=236062) |
| 88 | `235240` | `4799, 9014` | Magenta Sector 6 north scaffold; middle platform reached from above | [saved publisher marker](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=342&markerId=235240) |
| 89 | `235244` | `4775, 9052` | Magenta Sector 6 north scaffold; highest level via ladder | [saved publisher marker](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=342&markerId=235244) |
| 95 | `234857` | `4437, 7436` | Magenta Sector 8 southwest alley; crate reached from nearby scaffold | [saved publisher marker](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city?activeLayer=342&markerId=234857) |

AT335 also retains Screw 91, publisher marker `236385` at source XY `4741, 10842`. Its candidate projection and candidate archived-ID comparison are research diagnostics, not a confirmed physical identity or placement. The original source-coordinate work can be reused without repeating the search.

## Recovered Workspace positions and calibration

The AT334 register retains **144 ordinary-item marker records and two Screw candidates**. All 146 match the original saved markup. It records 111 unique name-and-zone candidates and 35 ambiguous candidates, including nine rows with multiple markers for one item and 26 rows with multiple item candidates. At least seven source-text checks contradict the old height-derived floor labels. The numeric height units and datum are not established; the old threshold classifier must not be treated as floor proof.

The original v35 and v37 `dist/map-items.json` files are byte-identical, SHA-256 `e76661e901bccd5fdac3eba577003429223f82f54767f956da023da316723fee`. The original source credits GamesRadar for the city image and Serebii for aligned pickup coordinates, with approximate alignment acknowledged. The existing map markup retains those historical approximate positions. The shared Explorer collectible placement file, [atlas-collectibles-data.json](../../../atlas-collectibles-data.json), still has an empty `placements` array; its searchable item/Screw catalogue is a separate feature.

AT335's exploratory fit has 2.765 px fit RMS, 5.308 px holdout RMS and 6.669 px maximum holdout error against old approximate display coordinates. Those residuals do not independently verify the physical locations, and the saved production transform is unapproved. The research should feed future location validation, while the original approximate markup and player progress remain preserved.

## Photos, routes and map pins are separate data

[atlas-explorer-data.json](../../../atlas-explorer-data.json) already references **48 sector entries using 42 distinct source PNGs**, and **21 Holovators using 111 photo references**. All referenced image paths exist in the inspected repository. The original Wild Zone map photos also remain in their existing pages. These source images provide visual orientation and route evidence without claiming new native map geometry.

Sector source photos can be shown in the detail panel even while sector `xy` is unset. The existing zone, approximate Holovator, Hotel Z ladder and landmark points are separate from those photo galleries. Written route steps can describe a scaffold without a separately surveyed scaffold pin; there is no standalone `scaffolds` dataset in the inspected Explorer data. Category/layer visibility problems must be fixed in the UI independently of future coordinate calibration. Missing calibrated collectible pins do not imply that the recorded research or existing photographs have disappeared.

## Known Hotel Z photo-binary gap

The [Hotel Z field survey](../../../MAPS_LADDER_FIELD_SURVEY_2026-11-22.json) preserves the owner-confirmed route and original photo identities:

| Purpose | Recorded file | SHA-256 |
| --- | --- | --- |
| Physical ladder photograph | `1000027223.heic` | `b0a378d217c8f2eb1b4f806740b57565d68c5daf30eea0d433e8de1d5e423058` |
| Location map photograph | `1000027224.heic` | `364de8c9f6a4b16455376be0d7b8c7c6756bcf1a7953f6b96d67446116556676` |
| Second location map photograph | `1000027225.heic` | `f5097296568cbe3f3fb1868682152ac44fb7f703b8715d9f21b7808b2ab4be9c` |

The runtime `hotel-z-ladder` record has `photos: []` and `photo_status: not_hosted`; the survey explicitly says that public owner-photo binaries were not committed. The image binary is a known missing hosted asset, not missing written route evidence. This preservation does not reacquire or publish those binaries and does not restart the historical request for a second ladder-photo survey. It makes no claim that the original attachment is unavailable everywhere.

## Original Workspace identity and retained source

The [existing authenticated Workspace observation](../../consolidation/2026-11-26/workspace-observation.json) identifies project `appgprj_6afda588d5948191b4143e40a1f9c291`, last observed version **37**, source commit `1ac2c20002451d295dc4f8e80068297682fcdc4b`, at [the original published Site](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site). [Historical v37 release evidence](../../consolidation/2026-11-26/branch-sources/pr-149/docs/qa/ATLAS_AT297_WORKSPACE_V37_RELEASE_2026-11-25.md) preserves the separate A1–A7 release history.

The retained `lumiose-atlas-workspace-v37-source.zip` was found locally and rehashed: **48,902,705 bytes, 1,127 members**, SHA-256 `1a35949ff538dc42287a0ba9a32037023fa0362ff849857c16ed0c66b7aa64f7`, matching AT334 and AT335. Its `dist/atlas-explorer.js` hash is `54fbfa93d9c64fda4f26052bddbfa0d312fb20fd882bb624dce562d06d9f07b1`. Retained rehearsal checkouts contain older commit heads plus staged patches, so their HEAD alone must not be called the v37 source. Private checkout paths and the source archive are not included in this packet.

Preserving these records changes neither the independently deployed Workspace nor its release gate. The remaining full GitHub Map 2.0 and independent Workspace acceptance work stay open.
