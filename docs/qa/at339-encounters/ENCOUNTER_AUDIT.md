# Encounter evidence audit — 26 November 2026

## Decision and implementation scope

The additive encounter register is ready for integration with the shared read-only area model. It contains all **68 area identities**, **283 individually attributed claims**, and plain-language limitations. It does **not** establish a comprehensive encounter roster for any area. **G3 remains incomplete.** No coordinate, polygon, permanent distortion, verified route, or deployment decision is supplied by this audit.

The reviewed baseline is `ee87bd2234d394e2dbc4197eb26610e6367e352b`. The original `wildZoneRecords` object remains deeply equal to that baseline, including order, photographs, conditions, duplicate species-name rows, 167 species/area memberships, 38 fixed Alpha records, and 67 rotating Alpha candidates. Its 15 Wild Zone 20 ordinary species remain separate from the rotating pool. The baseline source-module SHA256 is `f6a4b19cfa51d91694ea610eddef54d22303a64d9007509c3f07dfb552057907`.

The original WZ1–19 species unions have an unspecified encounter class (`recorded`). They must not be relabelled ordinary by subtracting fixed Alpha names. A species may occur in multiple classes. Nine WZ20 species occur in both the ordinary and rotating lists: Aggron, Dragalge, Garbodor, Gardevoir, Hippowdon, Lucario, Malamar, Roserade, and Scrafty.

## Deliverables and preflight

| File | Purpose |
| --- | --- |
| `atlas-area-evidence.json` | Runtime-compatible additive register: all 68 areas, explicit class/status/condition/source fields. |
| `owner-survey-observations.json` | Exact 20 original photograph paths, SHA256 and Git blob hashes, and 140 visually identified species icons. |
| `encounter-audit-summary.json` | Counts, preservation invariants, unresolved requirements, and evidence-status meanings. |
| `encounter-preflight.json` | Read-only checks against the current shared model and original image bytes. |
| `unassigned-encounter-leads.json` | Retained named-place, gift, trade, and interior research that cannot safely be assigned to a numbered sector. |
| `ARTIFACT_SHA256.json` | Hashes of this audit and the accompanying evidence files. |

Preflight: **68 areas; 555 model rows = 272 preserved + 283 additive; zero parser issues; zero unusable source links; zero special encounters or source leads incorrectly admitted as supported wild habitats; zero approved geometry; zero complete rosters.** All 20 original images match both their baseline Git blobs and the recorded SHA256 hashes. The current `wildZoneRecords` object matches the baseline in every field and array order.

Register SHA256: `aa80ebb05cdee248f58086245c45c58b77b5f9ad54e1b40665798ebfd655a8ed`.

Owner-observation JSON SHA256: `b2016ecf99665ffb2036ac4739dc1b04e36fbacf53b3678821d775e023a59004`.

| Additive encounter class | Rows |
| --- | ---: |
| Ordinary | 195 |
| Unclassified lead | 66 |
| Scripted boss | 6 |
| Mission | 12 |
| Gift | 1 |
| Fixed Alpha form/condition claim | 3 |
| **Total** | **283** |

| Evidence status | Rows | Meaning |
| --- | ---: | --- |
| Owner survey correlated | 140 | The original image establishes the species icon; the written ordinary table supplies the class. |
| Source corroborated | 18 | Multiple sources support the stated bounded claim, without establishing every condition or a position. |
| Source lead | 118 | A reported claim with incomplete independent verification or classification. |
| Disputed | 7 | Sources disagree about area membership or a particular encounter class. |

`null` time, weather, floor, unlock, or form means unknown. It does not mean unrestricted availability. Source-qualified text remains qualified even when area membership is corroborated. No encounter row is marked `verified`.

## WZ14: ordinary Helioptile

The owner survey photo establishes species membership, not weather or timing. [GameWith](https://gamewith.jp/pokemon-za/524504), a [first-hand PowerPyx catch report](https://www.powerpyx.com/pokemon-legends-z-a-helioptile-location/) and [Pokéxperto](https://www.pokexperto.net/index2.php?seccion=switch%2Fleyendas_za%2Fzona_salvaje14) support checking Wild Zone 14 on a clear day. The ordinary level range is 37–38. Search around the Electrical Substation equipment; no precise site or complete weather-icon rule is asserted. The written reports don't justify a night-only rule for Onix or Emolga. The fixed Alpha Excadrill remains separate and unchanged.

## Original owner photographs: all 20 observations

All originals are `assets/atlas/wild-zones/wild-zone-NN-overview.png`, 1536 × 865 pixels, with a visible 100% survey badge. The following lists record the species icons actually visible. They are not an exhaustive count of ordinary, Alpha, mission, roof, form, weather, or time-dependent encounters. Missing icons cannot prove universal absence. Inspection contact sheets are convenience derivatives; the original PNGs and their hashes are the evidence.

| Zone | Icons | Exact visible species list |
| --- | ---: | --- |
| 01 | 7 | Weedle, Pichu, Scatterbug, Fletchling, Pidgey, Mareep, Bunnelby |
| 02 | 6 | Kakuna, Patrat, Binacle, Staryu, Magikarp, Budew |
| 03 | 6 | Skiddo, Pancham, Litleo, Espurr, Flabébé, Pikachu |
| 04 | 6 | Patrat, Gastly, Honedge, Spewpa, Ekans, Spinarak |
| 05 | 7 | Pidgeotto, Venipede, Electrike, Bellsprout, Abra, Pidgey, Bunnelby |
| 06 | 7 | Binacle, Meditite, Buneary, Magikarp, Houndour, Swablu, Flaaffy |
| 07 | 7 | Hippopotas, Audino, Vanillite, Kakuna, Floette, Roselia, Shuppet |
| 08 | 6 | Krokorok, Sandile, Gible, Drilbur, Machop, Numel |
| 09 | 6 | Carbink, Espurr, Fletchinder, Kadabra, Sableye, Mawile |
| 10 | 7 | Slowpoke, Arbok, Watchog, Bellsprout, Carvanha, Staryu, Tynamo |
| 11 | 6 | Gyarados, Clauncher, Furfrou, Inkay, Slowpoke, Stunfisk |
| 12 | 8 | Delibird, Machop, Snover, Bergmite, Vanillite, Gogoat, Snorunt, Machoke |
| 13 | 6 | Phantump, Vivillon, Heracross, Pinsir, Weepinbell, Scyther |
| 14 | 7 | Helioptile, Drilbur, Onix, Aron, Lairon, Excadrill, Emolga |
| 15 | 7 | Pumpkaboo, Shuppet, Scolipede, Haunter, Whirlipede, Beedrill, Larvitar |
| 16 | 7 | Falinks, Flaaffy, Starmie, Barbaracle, Medicham, Florges, Froakie |
| 17 | 6 | Klefki, Lampent, Skarmory, Pyroar, Diggersby, Chespin |
| 18 | 6 | Noibat, Fennekin, Bagon, Altaria, Noivern, Swablu |
| 19 | 7 | Eevee, Furfrou, Drampa, Kangaskhan, Audino, Clefairy, Cleffa |
| 20 | 15 | Malamar, Dragalge, Charmander, Tepig, Lucario, Hippowdon, Squirtle, Totodile, Bulbasaur, Roserade, Gardevoir, Chikorita, Aggron, Scrafty, Garbodor |
| **Total** | **140** | Species/area icons, not 140 unique species. |

The small blue/yellow crustacean in WZ11 is **Clauncher**, not Carvanha. WZ14's original image labels Electrical Substation, consistent with the current written Magenta District identity. Pyroar survey artwork does not establish gender availability.

The original WZ18 PNG has Git blob `b520201cb772c4d716036fb8066f35fd3d82cf5b`. This exactly matches the owner-photo evidence preserved in PR172's archive. The reviewed PR172 draft head is `c2d739942eef7c34b08a67475df2252b4d3ededb`; its bounded photo observation can be ported without merging the old branch. Archive: `docs/consolidation/2026-11-26/branch-sources/pr-172/PROVENANCE.json`.

## Material conflicts and bounded resolutions

### Wild Zones 7, 17, and 18

**WZ7 Gastly:** [Serebii's zone table](https://www.serebii.net/pokearth/lumiosecity/wildzone7.shtml) and [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_7) report ordinary Gastly, with levels 19–21 in the former. The [current PokéMaps species page](https://pokemaps.net/maps/lza/lumiose/gastly) omits WZ7, and the seven-icon owner card lacks Gastly. Preserve the original union entry; retain a disputed ordinary claim and source-qualified night condition. No absence or exact spawn is inferred.

**WZ17:** [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_17) lists Talonflame; [Serebii](https://www.serebii.net/pokearth/lumiosecity/wildzone17.shtml), [RotomLabs](https://rotomlabs.net/locations/legends-z-a/wild-zone-17), and the six-icon owner card do not. Membership remains disputed. Serebii additionally lists ordinary Mawile at 44–47 alongside fixed Alpha Mawile at 56–57; the ordinary class is disputed, while the original fixed record remains intact. Two original fixed Pyroar rows remain distinct. Male/female assignments conflict between source treatments and cannot be settled from the icon.

**WZ18 Gastly:** PokéMaps reports this area, while [Bulbapedia's standard roster](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_18), [Serebii](https://www.serebii.net/pokearth/lumiosecity/wildzone18.shtml), [RotomLabs](https://rotomlabs.net/locations/legends-z-a/wild-zone-18), and the original card support the six ordinary species plus the existing fixed Alphas. The Gastly membership claim remains disputed. The photograph cannot exclude every special circumstance.

### Progression, conditions, and other table differences

**WZ18/19 progression:** [Thonky](https://www.thonky.com/pokemon-legends-z-a/main-mission-31-a-summons-from-vinnie) identifies availability after reaching Rank B; [PowerPyx](https://www.powerpyx.com/pokemon-legends-z-a-all-wild-zone-locations/) places it after Mission 30. This agrees with the start-of-Mission-31 wording in the zone pages. The additive condition describes the event; legacy numeric labels remain unchanged. The actual gate transition has not been observed in game.

**WZ19 Drampa:** [GameWith](https://gamewith.jp/pokemon-za/525078) explicitly limits the reported ordinary encounter to morning. AT324 separately retains the pavilion/slot description. It is not promoted to a guaranteed Alpha or a permanent coordinate. Ordinary Clefairy and Furfrou remain separate from the fixed Alpha records.

**WZ15:** [Serebii](https://www.serebii.net/pokearth/lumiosecity/wildzone15.shtml) has ordinary Trevenant 40–41, Noibat 41–43, and Banette 42–43, absent from the ordinary table in [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_15) and from the seven-icon card. These three additional ordinary claims remain disputed. Fixed Alpha Banette is unaffected. Additional ordinary table entries in WZ5, WZ10, and WZ12 remain source leads rather than inferred owner-photo confirmations.

Flower forms, WZ9 Meowstic form/time rows, and WZ15 Gourgeist variety remain explicit source claims. Generic artwork is not form-distribution evidence. Flattened time/weather icons were not decoded without their headers. WZ20's rotating pool remains conditional; a provider's generic Alpha heading cannot convert all 67 possibilities into permanent fixed encounters.

Mission encounters remain separate, including shiny Mareep, noncatchable Houndstone/Greavard and Alpha Annihilape battles, noncatchable Skarmory, story Xerneas, and Zygarde. Shiny and Alpha are not stored as species forms. Gifts, trades, bosses, and mission opponents cannot authorize ordinary habitat geometry.

## Follow-up on the nine initially empty sectors

The first draft had claims for 39 sectors. Targeted review added **23 claims** across seven more sectors. All 48 remain incomplete; two still have no additive encounter rows. No district-wide encounter table was copied into every sector, and no Wild Zone roster was duplicated merely because it occupies part of a sector.

| Sector | Bounded addition or remaining uncertainty |
| --- | --- |
| Vert 3 | Cleffa membership corroborated by [Bisafans](https://www.bisafans.de/routendex/illumina-city/verte-bezirk-3.php) and [RotomLabs](https://rotomlabs.net/locations/legends-z-a/vert-district); roof is source-reported and levels differ. Patrat Alpha is reported, but fixed/random class is unknown. [Sector page](https://bulbapedia.bulbagarden.net/wiki/Vert_Sector_3) separately supplies Mega Dragonite's Mission 32 boss and noncatchable Squawkabilly in Mission 134. |
| Bleu 10 | [Sector page](https://bulbapedia.bulbagarden.net/wiki/Bleu_Sector_10) places WZ10 over much of the sector. No separate complete outdoor roster or proof of zero outdoor encounters was found. Empty means unknown. |
| Magenta 2 | Larvitar membership corroborated by [Bisafans](https://www.bisafans.de/routendex/illumina-city/rose-bezirk-2.php) and [RotomLabs](https://rotomlabs.net/locations/legends-z-a/magenta-district), with differing levels and an unverified roof route. [Sector page](https://bulbapedia.bulbagarden.net/wiki/Magenta_Sector_2) supplies three distinct Mission 37 Mega bosses. RotomLabs' Fennekin gift remains a source lead with an unknown prerequisite. |
| Magenta 5 | [Sector page](https://bulbapedia.bulbagarden.net/wiki/Magenta_Sector_5) places WZ9 over most of the sector. The zone list is not copied into a separate sector roster. Empty means unknown. |
| Rouge 1 | Goomy membership corroborated by [Bisafans](https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-1.php) and [RotomLabs](https://rotomlabs.net/locations/legends-z-a/rouge-district). The roof west of Rouge Plaza is source-reported; levels and conditions remain unresolved. |
| Rouge 6 | [Sector page](https://bulbapedia.bulbagarden.net/wiki/Rouge_Sector_6) and [Bisafans](https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-6.php) support the Mission 23 Mega Ampharos context. RotomLabs' separately headed Abra and Trubbish walking entries remain partial source leads. |
| Jaune 1 | [RotomLabs' Sector 1 section](https://rotomlabs.net/locations/legends-z-a/jaune-district) reports Weedle and Pidgey at 7–9. Both remain source leads. A building-free sector is not an encounter-free sector. |
| Jaune 5 | Dratini's roof membership is supported by [Bisafans](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-5.php), the [GamerGuides species database](https://www.gamerguides.com/pokemon-legends-z-a/database/pokedex/pokemon/dratini), and [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Dratini). Sunny weather remains source-qualified. Garbodor Alpha is a lead; fixed/random class is unknown. |
| Jaune 12 | RotomLabs' explicit Sector 12 section gives six bounded walking leads: Pansage, Pansear, Panpour, Fletchling, Scatterbug, Vivillon. They are not imported from WZ6. No complete roster or exact condition is asserted. |

## Remaining release evidence

G3 still needs a comprehensive, class-aware review of every sector and Wild Zone, conditions where material, and resolution of the listed contradictions. G2 geometry and exact routes remain separate requirements. The register improves the data available to the shared engine and UI; it does not turn incomplete source research into finished release proof.

Retain original photos, prior source research, and the AT322/AT323/AT324 registers. All new external citations are written pages on the approved source hosts. No paused media feature, channel workflow, permanent random distortion, or player-progress write is introduced by this evidence work.
