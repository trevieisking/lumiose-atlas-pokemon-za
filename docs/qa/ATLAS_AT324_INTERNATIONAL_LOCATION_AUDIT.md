# AT-324 — Worldwide source research: location identities, overlap and rare encounters

**25 November 2026.** Builds on AT-322 and AT-323. This is documentation and identity evidence only; the existing map runtime is unchanged. Source language patterns are used for research search aliases, not claimed as independently checked official translations for every entry.

## Game location identity crosswalk

The community-published [game location index](https://bulbapedia.bulbagarden.net/wiki/List_of_locations_by_index_number_in_Pok%C3%A9mon_Legends%3A_Z-A) identifies the 48 numbered sectors and 20 numbered Wild Zones separately. The accompanying [machine-readable crosswalk](ATLAS_AT324_LOCATION_IDENTITY_REGISTER.json) maps all 68 existing Atlas IDs to unique published game location identifiers. It preserves existing source-saved approximate Wild Zone centres and null sector XY. No new geometry is introduced. Decimal and hex values are identity fields, never map pixels. The published index also describes separate grammatical forms used in location pop-ups and Pokémon summaries; an in-game capture should record the location text alongside the map and the encounter, since approach, met-location and standing location can differ.

Examples: Bleu 1 = 37; Bleu 2 = 42; Jaune 1 = 85; Wild Zone 5 = 198; Wild Zone 11 = 210. The 68 names and values were transcribed from the published index, matched to existing record IDs and checked for uniqueness. Independent raw-game confirmation was not performed. The separate special/transfer location indices are not substituted for the overworld index (for example, Wild Zone 11 also appears in another index range).

## Three missing German-directory entries

- **bleu-sector-1**: Adjacent to Vernal Avenue and Bleu Street; eastern part of WZ5. Sewer gate associated with this sector in Bulbapedia. [Area description](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_1); [cross-check 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/wild-zone-5.html), [cross-check 2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/bleu-plaza.html). Archive: Kalos Bleu Sector 1 Map.png. filename and source image link confirmed; download failed; not visually inspected in this cycle.
- **bleu-sector-2**: Adjacent to Estival Avenue and Bleu Street; western part of WZ5. Separate waterway/back-exit access lead. [Area description](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_2); [cross-check 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/wild-zone-5.html), [cross-check 2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/estival-avenue.html). Archive: Kalos Bleu Sector 2 Map.png. filename and source image link confirmed; download failed; not visually inspected in this cycle.
- **jaune-sector-1**: East of central plaza/tower site; west of Jaune Sector 3. Hibernal Avenue and Jaune Street border it. Reported building-free sector; source reports Side Mission 35 near southeastern corner. [Area description](https://bulbapedia.bulbagarden.net/wiki/Jaune_Sector_1); [cross-check 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/jaune-street.html), [cross-check 2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/hibernal-avenue.html), [cross-check 3](https://pente.koro-pokemon.com/legendsz-a/map-jaune-district.shtml). Archive: Kalos Jaune Sector 1 Map.png. archive catalogue listing only; direct location page returned cache miss, indexed description retrieved.
 
These are useful location descriptions, not measured boundary polygons. The German directory remains at 45/48 direct links; the missing three now have alternate text references.

## New international sources

- [Japanese Bleu District](https://pente.koro-pokemon.com/legendsz-a/map-bleu-district.shtml) separates ordinary spawns, time/weather and distribution map links; [Jaune District](https://pente.koro-pokemon.com/legendsz-a/map-jaune-district.shtml) supplies district/item leads (only indexed text accessible for Jaune).
- [Japanese rare Pokémon guide](https://game8.jp/pokemon-legends-z-a/729719) provides rooftop approach evidence for Dratini, Riolu and Larvitar. Map/target picture captions provide useful landmark and route clues, but not verified native coordinates.
- [Chinese Lumiose City index](https://wiki.52poke.com/zh-hans/%E5%AF%86%E9%98%BF%E9%9B%B7%E5%B8%82%EF%BC%88%E4%BC%A0%E8%AF%B4_Z-A%EF%BC%89) uses the local district names and numbered blocks; use the crosswalk to match them. [Chinese Wild Zone 5](https://wiki.52poke.com/wiki/%EF%BC%95%E8%99%9F%E9%87%8E%E7%94%9F%E7%89%B9%E5%8D%80) supports the overlapping sector/street identity and distinguishes rooftop, ordinary and Alpha level fields.
- [Bulbagarden archive catalogue](https://archives.bulbagarden.net/wiki/Category%3ALegends%3A_Z-A_maps) contains distinct sector and district map filename leads and rendered game screenshots. Exact source thumbnails for Bleu 1 and 2 were located; direct binary retrieval failed. The Jaune District highlight was actually visually inspected in an image search result. Its red wedge is district-level evidence only, not Jaune 1 geometry. No new screenshot bytes, downloads or licence claims.

## Findings and unresolved source conflicts

### AT324-G01 — bleu-sector-1, bleu-sector-2, wz-05
WZ5 includes both sectors and the street between them. Sector IDs 37/42 and zone ID 198 are separate. Chinese WZ5 entry agrees with overlap and reports rooftop Pidgey Lv11–13 as a condition-bearing lead.

Status: multiple_source_geography_agreement. Sources: [1](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_1) · [2](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_2) · [3](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/wild-zone-5.html) · [4](https://wiki.52poke.com/wiki/%EF%BC%95%E8%99%9F%E9%87%8E%E7%94%9F%E7%89%B9%E5%8D%80).

### AT324-G02 — jaune-sector-1
Building-free sector reported east of central plaza; independent adjacent-street records give orientation. It also supplies a small DLC layout reference, not a permanent real-city distortion.

Status: source_geography_corroborated. Sources: [1](https://bulbapedia.bulbagarden.net/wiki/Jaune_Sector_1) · [2](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/jaune-street.html) · [3](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/hibernal-avenue.html) · [4](https://bulbapedia.bulbagarden.net/wiki/Hyperspace_Lumiose).

### AT324-G03 — wz-11, jaune-sector-10, vert-sector-6
The zone includes both canal banks. The ordinary roster and special Xerneas capture (Main Mission 40) must stay distinct. No crossing geometry proven.

Status: cross_district_overlap_corroborated. Sources: [1](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_11) · [2](https://bulbapedia.bulbagarden.net/wiki/Vert_Sector_6) · [3](https://bulbapedia.bulbagarden.net/wiki/Vert_District).

### AT324-R01 — bleu-sector-1, bleu-sector-2, bleu-sector-3, wz-05
PowerPyx calls optional sewer approach Bleu 3; Bulbapedia associates gate with Bleu 1. GamesRadar agrees approach from Café Woof/Bleu 3. Distinguish approach sector, WZ5 rear exit and actual doorway location; record in-game labels. Side Mission 57 starts gate unlock per PowerPyx; alternate approach from WZ5 involves water move clearing sludge and descending to canal. No new exact route certified.

Status: route_lead_and_boundary_label_disagreement. Sources: [1](https://www.powerpyx.com/pokemon-legends-z-a-how-to-return-to-lumiose-sewers/) · [2](https://www.gamesradar.com/games/pokemon/full-pokemon-legends-z-a-map-and-all-locations/) · [3](https://bulbapedia.bulbagarden.net/wiki/The_Sewers).

### AT324-E01 — rouge-sector-4, bleu-sector-5, bleu-sector-7, vert-sector-8, magenta-sector-9
Game8 distinguishes rooftop travel approach from final sector (summary calls Bleu7 while detail says ascend from Bleu5). Gamer Guides and PokéMaps list Bleu5, Rouge4, Magenta9 and Vert8. Sunny daytime Riolu is corroborated by Japanese district source and Gamer Guides; trade in Side Mission24 separate. Do not copy provider coordinate values.

Status: rare_encounter_approach_leads. Sources: [1](https://game8.jp/pokemon-legends-z-a/729719) · [2](https://pente.koro-pokemon.com/legendsz-a/map-bleu-district.shtml) · [3](https://www.gamerguides.com/pokemon-legends-z-a/database/pokedex/pokemon/riolu/) · [4](https://pokemaps.net/maps/lza/lumiose/riolu).

### AT324-E02 — vert-sector-6, bleu-sector-6, bleu-sector-9, jaune-sector-3
Game8 rare-Pokémon guide reports Dratini rooftop at Restaurant Le Nah/Vert6, access via Bleu6 construction toward Bleu9 roof, and Jaune3 roof after Roto-Glide obtained in Main16. Preserve distinction between approach and encounter area; photograph prerequisites and exit.

Status: source_reported_route_lead. Sources: [1](https://game8.jp/pokemon-legends-z-a/729719).

### AT324-E03 — wz-17
Japanese Alpha guide and France guide agree male fixed Alpha Pyroar + Mawile; female Pyroar normal. Talonflame appears in Bulbapedia WZ17 table but not Serebii or Japanese Pokédex ordinary WZ17 entries. Existing two Pyroar rows retained until source/game check; no automatic roster edit.

Status: unresolved_roster_conflict. Sources: [1](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_17) · [2](https://www.serebii.net/legendsz-a/wildzones.shtml) · [3](https://pente.koro-pokemon.com/legendsz-a/pokemon-miare.shtml) · [4](https://pente.koro-pokemon.com/legendsz-a/oyabun.shtml) · [5](https://www.pokemon-france.com/en/guides/pokemon-legends-z-a/wild-zones/).

### AT324-E04 — wz-07, wz-18
Japanese Gastly entry lists WZ4, multiple districts and Bleu sewers, not WZ18 or WZ7 explicitly. Serebii and Bulbapedia WZ7 include Gastly (latter night, Lv19–21); VGC and Pokémon GO Hub omit it. Keep WZ7 and do not add WZ18 from PokéMaps alone. Verify rare night encounter with met-location evidence.

Status: unresolved_roster_conflict. Sources: [1](https://pente.koro-pokemon.com/legendsz-a/pokemon-miare.shtml) · [2](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_7) · [3](https://www.serebii.net/legendsz-a/wildzones.shtml) · [4](https://www.videogameschronicle.com/guide/pokemon-legends-z-a-wild-zone-7/) · [5](https://pokemongohub.net/post/guide/all-wild-zones-pokemon-legends-z-a/).

### AT324-E05 — wz-19
Japanese Alpha guide describes daytime central Furfrou slot sometimes replaced by ordinary Drampa; Gamer Guides specifies morning Drampa at pavilion. Preserve conditional slot; not a guaranteed Alpha Drampa. Mission30/31 opening discrepancy remains.

Status: spawn_condition_corroborated. Sources: [1](https://pente.koro-pokemon.com/legendsz-a/oyabun.shtml) · [2](https://www.gamerguides.com/pokemon-legends-z-a/guide/wild-zones/magenta-sector-9) · [3](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_19).

### AT324-D01 — dynamic map policy
Japanese Game8 describes battle-zone nightly selection and post-story multiple simultaneous zones. Bulbapedia says nine recurring DLC layouts can have different Holovator/scaffold arrangements. Separate fixed templates, session-dependent battle zones and temporary distortions. Never draw permanent live-state pins from template.

Status: template_not_portal_location. Sources: [1](https://game8.jp/pokemon-legends-z-a/730143) · [2](https://bulbapedia.bulbagarden.net/wiki/Hyperspace_Lumiose).

 
Do not count translated sites as automatically independent evidence; verify source lineage and retain discrepancies. Some Japanese tables use a broad guaranteed-Alpha category for the rotating Zone 20 slots and some are stale about Pokémon HOME availability. Use direct official update/compatibility information for changing feature claims. The current roster and 67 rotating Alpha candidates remain unchanged.

## Next targeted owner evidence

- **AT324-C01:** Use same-zoom north-up captures at WZ5 rear exit, canal tunnel, sewer gate and location header; separate approach from actual door. No repeat of existing 40 photos.
- **AT324-C02:** Location header/area transition at Hibernal Avenue, Jaune Street and Centrico; distinguish city plaza and numbered park sector.
- **AT324-C03:** If naturally encountered, record day/night/weather, species/form and met-location. Do not restart progress.

Prioritize existing owner images. Additional footage only if it resolves uncertainty. Capture location headers, identical map orientation, floor and approach/destination landmarks; no generated screenshot as evidence. Do not copy third-party coordinates or use city boundary photos to claim a traversable route. All 68 area geometries remain pending independent calibration; no new route or exact pin is verified.

**Preservation:** 48 sectors, 20 Wild Zones, original 40 PNGs, existing route and progress data, Supabase connections and Workspace unchanged. AT-320 PR #156 remains separate. Documentation-only scope; no runtime browser release in this checkpoint.
