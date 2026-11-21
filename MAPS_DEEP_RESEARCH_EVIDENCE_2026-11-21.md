# Lumiose Atlas — Deep Research evidence intake: Holovators, scaffolds and items

**Evidence checkpoint:** `ATLAS-RESEARCH-MAPS-2026-11-21-R1`  
**Owner research request:** three-stage investigation of **(1) all Holovator positions and images → (2) scaffolds, ladders and rooftop routes → (3) fixed item directions and images** for Pokémon Legends: Z-A on Nintendo Switch.  
**Research status:** Deep Research **finished successfully** on **21 November 2026**, run start **22:34:12 UTC**, finish **22:36:56 UTC** (completed report available in project conversation).  
**Document status:** **Source/research intake, not a finished map-coordinate dataset or a site change**.  
**Parent:** [MAPS_SECTOR_UPGRADE_MASTER_PLAN.md](MAPS_SECTOR_UPGRADE_MASTER_PLAN.md), [MAPS_UPGRADE_MANIFEST.json](MAPS_UPGRADE_MANIFEST.json), [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28).

## Immediate conclusion — what is established and what is not

- **Gamer Guides' Lumiose interactive map lists 23 Holovator markers, 132 ladder markers and 43 bridge markers** in separate navigation categories (directly checked 21 Nov 2026). [Gamer Guides map](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city). Deep Research also reported **23 Holovators and 255 ladder entries** in [Shackmaps](https://www.shackmaps.com/pokemon-legends-z-a/map), although its full source map was too large for the independent browser fetch. These are **external map-marker counts**, not yet independently extracted and aligned as Atlas points. **Do not claim one agreed citywide ladder or scaffold count**; ladder definitions/marker granularity differ.
- [Serebii's Lumiose Pokéarth](https://www.serebii.net/pokearth/lumiosecity/) has distinct Holovators, Ladders to Roof, Colorful Screws, items and Wild Zones filters. This is good cross-verification, **not a licence to republish Serebii artwork**.
- [GameWith's Holovator location/unlock guide](https://gamewith.jp/pokemon-za/524373) provides **nine side-mission-unlocked Holovator examples** with map/screen images. These named access points form a **route-and-unlock shortlist**, not all 23 completed Atlas pins.
- [Gamer Guides' 100 Colorful Screws checklist](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations) supplies item/roof/scaffold route text and links to location markers. Do not treat its list numbering as our existing **100 independent owner-source Screw IDs**, or assume two sources' item #6 refers to the same pickup.
- **Atlas verified map-coordinate counts remain unchanged:** **0/23** Holovators placed at source-checked coordinates on the Atlas city image; **0** exact scaffold route graphs aligned; **0** exact source-attributed item XY/floor pins added by this research-only checkpoint. Those are **Atlas-alignment counts**, not a denial that external maps have usable location markers.
- The **48 city sectors** remain distinct from the **20 base-game Wild Zones** and separate Mega Dimension/Hyperspace DLC maps. Existing source 264 item records, 100 owner Screw clues, 146 approximate city-map A-leads and 30 screenshot-related landmark links are preserved without renumbering.
- The ten owner's in-game TV-map photographs are **conversation evidence**, not source files committed to this repo, and neither their yellow UI symbols nor external map images justify unqualified GPS/roof-height claims.

## Research images and map visual sources (links only; no image copied)

| Visual evidence candidate | Use in mapping | Reuse boundary |
| --- | --- | --- |
| [Serebii Pokéarth city map](https://www.serebii.net/pokearth/lumiosecity/) | Turn on Holovators vs Roof Ladders; compare shapes and point neighbourhoods against owner's own map | Link/reference, no republication without rights |
| [Gamer Guides interactive map](https://www.gamerguides.com/pokemon-legends-z-a/maps/lumiose-city) | Inspect 23 Holovator markers, 132 ladder points and 43 bridges; investigate source map-space X/Y | External coordinates have **different coordinate system**, not Atlas XY |
| [GameWith Holovator screenshots](https://gamewith.jp/pokemon-za/524373) | Nine mission-gated access sites and screenshots for in-game confirmation | Link/reference; source images not added |
| [Pokéos map](https://www.pokeos.com/plza/map) | Independent side-by-side Holovator vs ladder vs item layers | Link/reference; cites Serebii/yakkun mapping credit |
| [Shackmaps city map](https://www.shackmaps.com/pokemon-legends-z-a/map) | Check reported 23 Holovators and discrepant 255 ladders | Full map fetch not completed in independent recheck; do not treat 255 as resolved |
| [Japanese Holovator + ladder map](https://gamepedia.jp/pokemon-legends-z-a/archives/16594) | Additional image/map reference and gated mission checks | Link/reference only |
| [Colorful Screws checklist](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations) | 100 locations, item directions, several scaffold/roof access chains | Link/cross-check numbers only; no copied complete descriptions/maps |
| [Gamer Guides Rare Candy item map records](https://earth.gamerguides.com/pokemon-legends-z-a/database/items/medicines/rare-candy) | Example of separate map coordinate system, item/ladder route pairing | Never transplant source X/Y unchanged |
| [Serebii item database](https://www.serebii.net/legendsz-a/items.shtml) | Sector-level item identity and acquisition-method cross-check | Rewards/random loot must not be marked as fixed pickups |
| [Nintendo UK game page](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Pokemon-Legends-Z-A-2533423.html) | Official game terminology and world orientation | Reference only |

**Spelling:** Use **Holovator** (not “Hovavator”), the English game term. It is a vertical traversal device, **not** necessarily any generic yellow icon, other elevator, fast-travel point, or ladder.


## Raw mission-coordinate verification batch — 9 source points (21 November 2026)

[**Read the 9-entry coordinate validation JSON**](MAPS_HOLOVATOR_COORDINATE_VALIDATION.json) and its [master-plan gate](MAPS_SECTOR_UPGRADE_MASTER_PLAN.md#coordinate-validation-loop--mission-source-batch-01-21-november-2026). This batch examined all **nine named side-mission-dependent Holovators in their mission order** and checked the **published map coordinates of the nearby mission marker** from Gamer Guides against at least one separate location/unlock guide.

Published **mission X,Y** (Gamer Guides coordinate space, **not a confirmed device centre**): **#4 9143/6904; #23 10111/16090; #40 14670/14907; #45 7987/16433; #56 13808/10090; #61 8603/13820; #71 8429/8099; #80 13520/5172; #92 5123/14626.** Every row includes its direct mission URL, other supporting sources, verified or source-reported sector status, location text, unlock action and outstanding original-game map/device/height gates.

Three important limitations:
1. **Mission marker does not equal Holovator marker.** The external map's **23 Holovator-category** glyphs must still be inspected individually. This batch did not extract those glyph coordinates or verify ground-level Holovator entrance pixels.
2. The original site's coordinate system has **not** been calibrated to the Atlas `maps/lumiose-game-map.jpg` image, and the ten owner television photographs involve camera perspective. The Atlas still has **zero source-confirmed exact Holovator XY, scaffold access graph nodes or item XY/floor pins**.
3. GameWith's **north of Wild Zone 12** phrasing for mission #61 and Serebii's **Bleu Sector 3 by Bleu Plaza** are retained as two independently sourced bearings, **not treated as a proven contradiction** without reviewing a labelled close-up. Mission #45's South Boulevard/Southside Street vs Gamer Guides Bleu Sector 7 also needs a sector-border review. Some guides express mission availability at the end of one main mission or the start of the next; exact game triggers should not be silently simplified.

**Next safe physical-coordinate loop:** start with DR-H-01, locate the *actual* Gamer Guides Holovator marker and game screenshot on the **west side of Wild Zone 3**, establish building face and source-to-Atlas transform with measured landmark alignment, then repeat the other eight and proceed through the remaining 23-category Holovator source markers. Never publish guessed pins or copy third-party map artwork.

## Phase H — Nine named Holovator unlock leads to reconcile against all 23 points

The evidence below summarizes Deep Research's cited [GameWith unlock catalogue](https://gamewith.jp/pokemon-za/524373), with related checks in Serebii/Bulbapedia as available. **“Described” means the cited source names an area and mission; it does NOT mean the exact point has been placed on our Atlas city map.** Use IDs as temporary research IDs, not final map pin numbers.

| Research ID | Neighbourhood / possible sector | Unlocking side mission | Navigation clue or gameplay event | Atlas marker status |
| --- | --- | --- | --- | --- |
| DR-H-01 | Rouge Sector 1, west of Wild Zone 3 | **4** A Break Time Battle | Rooftop approach unlocked by mission | **Not aligned**; owner-map XY, start/end level pending |
| DR-H-02 | Vernal Avenue, NW of Wild Zone 1 | **23** Underneath the Holovator | Remove Pokémon disrupting the unit | **Not aligned**; exact sector pending |
| DR-H-03 | East of Wild Zone 1, near Pokémon Center | **40** A Holovator Without Power | Restore power using an Electric-type move | **Not aligned**; exact sector pending |
| DR-H-04 | South of Wild Zone 12, Southside Street | **45** | Maintenance task restores traversal | **Not aligned**; exact sector pending |
| DR-H-05 | Jaune Sector 6, south of Wild Zone 8 | **56** | Fighting-type physical move clears unit | **Not aligned** |
| DR-H-06 | North of Wild Zone 12 **versus Bleu Sector 3 / Bleu Plaza** | **61** My Favorite Holovator | Defeat Rust Syndicate grunt | **DISCREPANCY**: cite both source descriptions; resolve exact sector before plotting |
| DR-H-07 | North-east of Wild Zone 7 | **71** | Defeat Alpha Watchog | **Not aligned**; exact sector pending |
| DR-H-08 | South-west of Wild Zone 15 | **80** | Defeat Manectric / Ampharos | **Not aligned**; nearby Larvitar route corroborated |
| DR-H-09 | Bleu Sector 8, south-east of Wild Zone 10 | **92** | Four Beldum encounter | **Not aligned**; height/entry pending |

Additional cross-check pages: [Serebii — My Favorite Holovator](https://www.serebii.net/legendsz-a/sidemissions/myfavoriteholovator.shtml) places the mission at **Bleu Sector 3**; [Bulbapedia — Side Missions 81–100](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Side_Missions_81-100) discusses the south-west Wild Zone 15/Larvitar roof route. [Gamer Guides screw #86](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations) describes a rooftop west of Wild Zone 12 via a Holovator between Wild Zones 12 and 16. The latter **might overlap one of the 23**, but cannot be assigned to a specific research ID before checking the map.

**Next evidence operation:** Extract all **23 distinct individual external marker references** with documented coordinate spaces, distinguish the above nine from the remaining fourteen, then map each against shared architectural landmarks in `maps/lumiose-game-map.jpg`. Verify district, sector and start/end level; record `source_url`, `map_source_xy`, `atlas_xy`, transform/provenance, confidence, and screenshots. Do not import proprietary images.

## Phase S — Scaffold/climb route *leads*, not a claimed total scaffold inventory

One “scaffold” may be multiple ladders, intermediate platforms and bridges. Track **access networks** with nodes for entrance, ladder, beam, platform and rooftop, rather than treating every ladder marker as a scaffold. All of these remain unaligned Atlas reference leads from the [Gamer Guides Colorful Screw route descriptions](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations):

| Research route ID | Location reference | Route relation evidenced | Atlas status |
| --- | --- | --- | --- |
| DR-S-01 | Vert Sector 1, northern end | Building-side ladder → scaffold crossing → beam | Source describes route; exact map nodes pending |
| DR-S-02 | South of Aymlis Park | Scaffold ascent → short roll to adjacent structure | Nodes/elevation pending |
| DR-S-03 | South of Bleu Plaza | Scaffolding top | Exact access nodes pending |
| DR-S-04 | Bleu Sector 7, north building side | Scaffold ascent → rooftop circuit | Exact nodes pending |
| DR-S-05 | Bleu Sector 7 east block | Roof and east-side structure access | Cross-check required |
| DR-S-06 | Magenta Sector 8 southwest alley | Scaffold → crate/platform via roll | Exact approach pending |
| DR-S-07 | North Boulevard, two large structures | Drop from adjacent Sector 8/9 rooftop → upper scaffold | Sector IDs must be resolved |
| DR-S-08 | Opposite Café Soleil | High scaffold pickup requires glide | Glide unlock/reachable height pending |
| DR-S-09 | Rouge Sector 8 | Several scaffold tiers with roof-to-platform descent | Multi-level topology pending |
| DR-S-10 | Jaune Sector 9 | High scaffold access, glide needed | Exact origin pending |
| DR-S-11 | Bleu Sector 6 | Mid-scaffold pickup behind crates | Floor labels pending |
| DR-S-12 | Rouge Sector 1 | Upper scaffold pickup | Start/end floor pending |

**Avoid double-counting:** multiple screw pickups on the same access network must not create duplicate scaffold structures. Conversely, one scaffold may have several ladder nodes. Keep bridges, Roto-Glide and Holovators separate traversal types. No defensible **citywide scaffold count** has been established.

## Phase I — First sample of item-to-access links (not the complete item dataset)

Use *source-specific* item reference numbers as research-only keys. The independent Atlas 100-Screw numbering may follow a different order. Verify identity and image before linking `legacy_ref`.

| Source checklist number | Item | Neighbourhood or sector | Verified-style reference from specialist source | Still needed for Atlas exact pin |
| --- | --- | --- | --- | --- |
| 6 | Colorful Screw | Vert Sector 1 | Northern ladder, scaffold and beam route | Photo-aligned XY/floor |
| 11 | Colorful Screw | Bleu Sector 7 | Scaffold on north side, then rooftop circuit | Exact roof coordinates |
| 13 | Colorful Screw | West of Wild Zone 3 | Holovator unlocked via side mission 4, roof ladder and bridge | Exact sector/pin |
| 21 | Colorful Screw | Magenta Sector 8 alley | Scaffold/rolling onto crate | Precise crate/roof height |
| 30 | Colorful Screw | Opposite Café Soleil | Scaffold and glide | Sector and exact scaffold start |
| 70–72 | Three Colorful Screws | Rouge Sector 8 | Different scaffold/roof tiers and glide | Three distinct pickups verified on Atlas image |
| 86 | Colorful Screw | West of Wild Zone 12 | Holovator between Wild Zones 12/16 | Holovator ID and roof point |
| 91–92 | Two Colorful Screws | Jaune Sector 9 | High scaffold and City Hall roof/glide | Separate roof platform positions |
| 94 | Colorful Screw | Bleu Sector 6 | Scaffold intermediate height, near crates | Exact platform position |
| 96 | Colorful Screw | Jaune Sector 3 | Rooftop behind crates | Access point |
| 97 | Colorful Screw | North Boulevard | Scaffold/glide chain | Sector attribution and end platform |
| 100 | Colorful Screw | Inside Racine Construction | Interior pickup near entry | Interior mini-map / placement |

**Research source:** [Gamer Guides 100 Colorful Screws interactive checklist](https://www.gamerguides.com/pokemon-legends-z-a/checklists/colorful-screw-locations). Source item numbers are reference handles, **not new exact marker claims**, and exact quoted source text/images are not reproduced here. Reconcile 264 owner item *records* separately from fixed overworld pickups, mission rewards, conditional outcomes and random loot. Serebii's item index can help check sector-level categorisation.

## Implementation acceptance sequence (no code changes in this checkpoint)

1. **SM-01 / H-01:** For the nine named Holovators and fourteen remaining source-map markers, capture individual navigable source URLs/IDs, source-map XY, source image dimensions/coordinate system, unlock status and nearest player-owned city screenshot landmark. **Do not infer XY from TV photo perspective.**
2. **SM-02 / H-02:** Create independently drawn Atlas map overlay aligned to `maps/lumiose-game-map.jpg` and 48 sector selection views; test 20 Wild Zone navigation parity. No third-party map image copying.
3. **SM-03/04:** For each Holovator pin, confirm side of building, street entrance, rooftop exit and unlock condition; show confirmed vs approximate based on evidence.
4. **SM-05:** Map scaffold **graphs** and ladder/platform nodes once Holovator roof bearings are secured, with route text for mobile players.
5. **SM-06:** Attach verified exact fixed items and Screws to confirmed access routes; preserve legacy item/screw/A-lead identifiers and progress. **Never place precise pins for conditional rewards or random loot.**
6. **SM-07:** Test Android/desktop zoom, labels, layer toggles, 25-link guide menu, feedback & progress regressions, and CI at reviewed SHA. Keep [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) OPEN until exact-mapping and source completeness requirements are met.

**Preservation:** This is a research document only. Original ChatGPT Workspace Site, user-visible guide, Supabase project/connection, feedback reports/ratings, saved progress, original source-asset checksum manifest and deployed site URL remain untouched. Main walkthrough overhaul is out of scope.
