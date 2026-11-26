# Public spawn-export research receipt

Reviewed 26 November 2026. **Research only: no encounter, condition, geometry or completeness status is promoted by this receipt.**

## Pinned sources inspected

Export repository: [`Xzonn/PokemonLZA-pkNX` at `eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f`](https://github.com/Xzonn/PokemonLZA-pkNX/tree/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f).

| Export | Git blob SHA-1 | Repository byte size |
| --- | --- | ---: |
| [`spawner/t1_point_spawners_a.json`](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/spawner/t1_point_spawners_a.json) | `314258d07929b23026a73e435e0cc190d3d92c2b` | 1,427,630 |
| [`spawner/t1_slot_sets.json`](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/spawner/t1_slot_sets.json) | `d03f6ded0a7c3958d94b028750c85651944c9034` | 370,308 |
| [`spawner/t1_point_spawners.json`](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/spawner/t1_point_spawners.json) | `5b002bafa4cf0d06be49687831d831318096eb9b` | 115,691 |
| [`spawner/t1_SpawnerPositions.json`](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/spawner/t1_SpawnerPositions.json) | `a89f2ddda927eafe0f8299b4214f00e3194ec84a` | 285,849 |

Hashes and byte sizes above are GitHub repository metadata, not locally asserted SHA-256 hashes. The 1.4 MB detailed export was read through its blob object. The source repository does not, in the inspected files, establish which exact exporter build produced these bytes; the code audit below must not be mistaken for a proven generation receipt.

## What the published exporter code actually does

Code repository: [`kwsch/pkNX` at `3bc649eea311ab1f249af43a562f8d70fe90ed9b`](https://github.com/kwsch/pkNX/tree/3bc649eea311ab1f249af43a562f8d70fe90ed9b). Paths below are under `pkNX.WinForms/Subforms/Gen9a/Map/`.

1. [`SpawnRipper9a.cs`](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/SpawnRipper9a.cs), blob `3e9c6332158cccfd9b7a10af685bd650f216beb0`: `FindAllPointsOnMaps` passes `ManualPositionRip.GetLocation` as the location resolver for the main `t1` scene. A separate `GetLocationFromOverworldMap` method exists, but that is not the resolver selected here.
2. [`ManualPositionRip.cs`](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/ManualPositionRip.cs), blob `6d8227599144c2e31ac9c115493b2f342a965b82`: the selected resolver finds the closest coordinate in an embedded manually labelled reference table and returns its `Actual` location list. A human-readable export label is therefore not, by this code path alone, proof of a direct collision/sector join.
3. [`Info/LumioseMap.cs`](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/Info/LumioseMap.cs): the separate collision resolver evaluates boxes and mesh trees, prefers higher layer/type priority, uses floor proximity for ties, and prefers a nonempty subarea name over the main-area name. It excludes battle-zone layers and room types from this wild-location selection. Inspecting this method does not establish that a published export used it.
4. [`Exports/SimulatedAreaSet.cs`](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/Exports/SimulatedAreaSet.cs): missing spawner/encounter lookups, zero maximum counts and empty encounter lists can be skipped. The detailed export sums encounter weights without resolving all time/weather-dependent combinations; its own comment describes the result as approximate, specifically mentioning Pumpkaboo time and weather cases.
5. [`Exports/DetailedSpawn9a.cs`](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/Exports/DetailedSpawn9a.cs) and [`Exports/EncounterArea9a.cs`](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/Exports/EncounterArea9a.cs): detailed rows expose species/form, Alpha probability, level/boost, time/weather integers and activation conditions, while the condensed area representation can merge overlapping compatible level ranges. Those representations have different information boundaries.

## Observed export facts and decisions

The detailed file contains 1,087 records with 86 distinct `Location` strings; the simpler slot-set file has 96 location keys, and the point-label file contains 1,145 entries. These are different export scopes, not interchangeable census totals. Detailed Alpha probabilities include 0, 5, 20 and 100. Numeric time/weather values and encoded phase/zone conditions are useful research inputs, but their display meaning and combined activation logic were not certified in this pass.

**Bleu Sector 2, Bleu Sector 10 and Magenta Sector 5 have no directly named entries in the inspected detailed, slot-set or point-label exports.** That observation does not prove an empty sector. Location resolution, more-specific place names, overlapping zone layers, activation state and skipped records must be reconciled against original location/scene evidence before drawing that conclusion. Do not clone a nearby Wild Zone roster into the missing sector to fill the gap.

The useful next step is an explicit join of original spawner identity/position, scene geometry, the localized place-name crosswalk and applicable activation rules, followed by a bounded comparison with existing claims. Published labels alone cannot certify all sector membership or exact coordinates, and a condensed slot set cannot certify universal weather/time conditions or fixed-versus-random Alpha status.

**No relationship between RotomLabs' data pipeline and this exporter has been established.** Similar lists or shared omissions do not prove shared provenance. The two dated specialist-table reconciliation packets keep their existing attribution and limitations; this research receipt changes neither packet nor production data.
