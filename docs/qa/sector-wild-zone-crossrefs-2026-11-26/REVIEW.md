# Three sector encounter cross-references and original-source review

Reviewed 26 November 2026 against local release commit `cffbf6077682e2c1cfacad2603e7d9c6a94147ef`. This continuation changes the presentation of three existing area records. It adds no encounter, map coordinate, boundary, item, photo, progress key or species habitat membership.

## Result

| Original sector | Related encounter guide | Source-defined relationship |
| --- | --- | --- |
| Bleu Sector 2 | Wild Zone 5 | The zone covers much of the sector and continues into Bleu Sector 1 and Bleu Street. |
| Bleu Sector 10 | Wild Zone 10 | The zone occupies much of the sector once it opens. |
| Magenta Sector 5 | Wild Zone 9 | The zone occupies most of the sector once it opens. |

Each sector retains its original ID, guide link, notes, encounter objects and roster qualification. The additive `related_areas` field contains only the target area ID, `overlapping_wild_zone` relationship and qualified note. A further note directs the reader to that guide. Each original sector guide card also gains a visible internal link to the corresponding Wild Zone card and shared area selection. Removing that one inserted paragraph restores the original card byte for byte.

The existing shared area model and UI did not interpret `related_areas` at this base. The release integrator owns its generic validation and rendering. Plain notes and original guide links already work; the explicit card links provide navigation without an engine change. The intended integrated shared-panel link must navigate to the existing Wild Zone record, without adding its Pokémon to the sector's habitat list.

`amendments.json` retains complete immutable before/after versions of the three area rows, the exact card insertions and card hashes. All **748 additive encounter objects** are unchanged; the combined **1,020 rows** still include all **272 original fieldbook rows**, **38 original fixed Alpha rows** and Wild Zone 20's **15 ordinary /67 rotating candidate** separation. The three original direct-sector encounter counts remain **1 /0 /0**. Their zero or lead-only direct counts are not presented as evidence that no Pokémon exist.

## Written relationship evidence

The named [Bleu Sector 2](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_2), [Bleu Sector 10](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_10) and [Magenta Sector 5](https://bulbapedia.bulbagarden.net/wiki/Magenta_Sector_5) pages explicitly describe these overlaps. The [Wild Zone 5 page](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_5) separately identifies its multi-sector/street extent. These statements support scoped navigation. They do not establish that a zone's entire roster occurs in every overlapping sector.

The original 45 numbered-sector Walking sections and 484 reviewed species/form rows remain as captured in the two previous sector packets. The three absent numbered Walking headings are not renamed as new independent outdoor tables. Their useful documented encounter routes are now explicit links to their established Wild Zones.

## Independently decoded published source data

Source assets were read from the public [`969981/ZA_Resources`](https://github.com/969981/ZA_Resources/tree/e44a63db22a9f295d43c34db3f67695d31ae8e7a) extraction at commit `e44a63db22a9f295d43c34db3f67695d31ae8e7a`, under its publisher-declared `Unpack/v2.0.2/romfs/arc/data.trpfs/virtual/` path. No game installation or console was accessed. External game binaries and images are not republished in this packet.

| Original table | Git blob | SHA-256 |
| --- | --- | --- |
| `world/ik_data/field/pokemon_spawner/pokemon_spawner_data/pokemon_spawner_data_array.bin` | `b11630478c746116b1074f12150d9a7c9c7a6e17` | `611a5bb7e6d97e21494070cfc933d994021503f8f9b3d0591481082fce269e09` |
| `world/ik_data/field/pokemon/encount_data/encount_data/encount_data_array.bin` | `13d0f3d69cb9f064dab34d7b5c2646e0066e66e3` | `4e080206c5f88707a1c01c2e3aa78d75ab362f3138e38c8677b2e90583446b49` |

The independently read tables contain 2,211 spawner rows and 1,966 encounter rows. The four targeted original scenes contain **82 objects**: Wild Zone 5 has 21, Wild Zone 9 has 24, Wild Zone 10 has 23 and Wild Zone 16 has 14. All 82 names join exactly to original spawner rows, then to **39 distinct encounter rows**. All decoded selection/class/condition fields agree with the independently published readable JSON at [`Xzonn/PokemonLZA-pkNX`](https://github.com/Xzonn/PokemonLZA-pkNX/tree/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f), commit `eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f`. There are zero compared-field mismatches. Scene paths, Git blobs, byte counts and SHA-256 values are recorded in `source-observations.json`.

The decoder used the published [`kwsch/pkNX`](https://github.com/kwsch/pkNX/tree/3bc649eea311ab1f249af43a562f8d70fe90ed9b) field schemas at `3bc649eea311ab1f249af43a562f8d70fe90ed9b`: `FlatBuffers/ZA/World/Schemas/Spawner/PokemonSpawnerDataDBArray.fbs`, `FlatBuffers/ZA/World/Schemas/Encount/EncountDataDBArray.fbs`, the shared activation/zone fields and Trinity scene/SRT fields. The scene list is in `pkNX.WinForms/Subforms/Gen9a/Map/Info/SceneInfo9a.cs`. Numeric time/weather values and phase, flag, quantity and weighting conditions were retained separately. This packet does not invent a numeric-condition legend or infer unrestricted availability from a default field.

Original named meshes and the exact English name-key crosswalk provide an independent source-space comparison. Nine Wild Zone 5 object origins project inside the Bleu Sector 2 mesh, all 23 Wild Zone 10 origins project inside Bleu Sector 10, and 23 of the 24 Wild Zone 9 origins project inside Magenta Sector 5. These are **XZ origin diagnostics**. Source Y values remain part of the retained faces and scene positions; these counts are not a game collision resolver or a boundary of all possible spawn positions. The zone metadata explicitly uses Layer 7 and the named sectors Layer 2. No exported nearest-label `Location` string is used for these relationships, and no particular downstream website is assumed to use that exporter.

An independently joined positive class example is `spn_a0203_w01_v01_011`: its original appearance data names ZoneId `a0203_w01` (Wild Zone 16), and `ect_a0203_w01_v01_z181_Alpha` specifies Ampharos with 100% Alpha probability, levels 42–43 plus 10 Alpha levels. This supports the existing fixed Alpha at levels 52–53. The concurrent ordinary-Ampharos report remains separately disputed; this packet does not change its class/status or claim no other encounter can ever exist.

The separate overworld scene contains 761 spawner-shaped objects. Looking at that scene alone would miss these 82 zone-scene objects. Its unjoined test object inside Bleu Sector 2 is not promoted as an encounter. This is why a missing outdoor table or missing exported sector label was not used to infer an empty habitat.

## Finite G3 encounter assessment

The original acceptance criterion asks for searchable catchable records per area, established conditions/form/time/weather/floor/unlock/class, preservation of the Alpha distinctions and resolution **or explicit labelling** of disputed entries. It does not require an exhaustive absence proof for every hypothetical special spawn.

The retained review now has an explicit disposition for all **68 areas**: 45 sectors have named source-table review, three have scoped Wild Zone encounter-guide relationships, and all 20 Wild Zones have their documented standard-roster comparison. This is a completed review disposition for the defined source scope. It is not a certification of a complete all-class game inventory. Area `roster_status` values deliberately remain `not_comprehensive`.

Material uncertainty remains visible: single-source sector claims retain their research status and do not become habitat highlights; the eight current ordinary/class/area disputes remain labelled; unresolved flower/size details and mission/boss records stay distinct. The 38 fixed Alpha rows and the rotating pool retain their original identity rather than being folded into generic ordinary catches. Unknown optional conditions remain null instead of being described as always available. These are recorded dispositions, not hidden omissions or new absence-proof gates.

The **encounter-review portion** can be assessed against that finite criterion after the related-area navigation is integrated and checked. Geometry approval, the remaining full-plan requirements and exact-head release/browser validation belong to their respective receipts; this packet does not mark the master plan complete.

## Verification

`node --test tests/atlas_sector_wild_zone_links.test.mjs` passes **4/4** focused checks: exact before/after metadata and unchanged encounters; original-card byte preservation and valid internal anchors; no fabricated sector habitat or Alpha-class change; and the bounded source-join receipt. No broad suite was rerun for these changes. The release integrator must also check its generic related-area model/UI handling and the final combined head.
