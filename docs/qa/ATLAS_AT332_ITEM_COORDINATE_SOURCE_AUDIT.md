# AT-332 — Item-coordinate source audit (25 November 2026)

Baseline: `042ef026032f1967432981eb09207c88f705d760`. Owner asked to pursue exact Lumiose item coordinates. This is documentation and source-evidence research only, not new production map pins.

## Evidence and progress

Earlier AT-290/291/293 already matched seven screw clue IDs to source marker URLs and XY. This batch adds five more using the same literal-link identity check. No duplicate collection keys. Both publisher pages expose the numerical coordinates; the interactive map itself was unavailable. The source's display heading sometimes differs from the marker in the actual link; the two page link layers also differ. Use the literal matching marker ID, not a presumed numbering offset. All new references remain in source coordinate space.

| Existing Atlas Screw | Source marker ID | Source X/Y | Reported location |
|---|---|---|---|
| 29 | 234530 | 8020, 5146 | Passage Ombragé roof |
| 40 | 236062 | 11569, 3511 | Passage du Palais roof |
| 88 | 235240 | 4799, 9014 | Magenta Sector 6 north scaffold; middle platform reached from above |
| 89 | 235244 | 4775, 9052 | Magenta Sector 6 north scaffold; highest level via ladder |
| 95 | 234857 | 4437, 7436 | Magenta Sector 8 southwest alley; crate reached from nearby scaffold |

Sources: [regional guide](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/all-colorful-screw-locations), [screw coordinate database](https://www.gamerguides.com/pokemon-legends-z-a/database/items/other-items/colorful-screw). These are same-publisher crosswalks, not independent measurements. Five regional and five database marker links matched but returned cache misses; three selected marker thumbnail requests also failed. No source images copied or inspected. The middle and upper Magenta Sector 6 pickups remain distinct, even though their source XY values are close together. [Japanese screw guide](https://gamepedia.jp/pokemon-legends-z-a/archives/16379) and [Japanese item guide](https://gamepedia.jp/pokemon-legends-z-a/items) provide separate written-route evidence, not measured geometry.

## Ordinary item examples

- Rare Candy — Northern Magenta Sector 3 rooftop; source XY (6012, 9719), marker 235330; [source](https://www.gamerguides.com/pokemon-legends-z-a/database/items/medicines/rare-candy).
- HP Up — Bleu Sector 7 scaffold; community contribution; source XY (7792, 15784), marker 236968; [source](https://www.gamerguides.com/pokemon-legends-z-a/database/items/medicines/bottle-of-hp-up).
- HP Up — Lumiose Sewers Main Access northeast; not city street level; source XY (8397, 11059), marker 238496; [source](https://www.gamerguides.com/pokemon-legends-z-a/database/items/medicines/bottle-of-hp-up).

These sample records do not establish a unique original Atlas item ID. The sewers example is deliberately excluded from surface-city projections. The database's Rare Candy page lists 35 entries, including two labelled Lysandre Labs; the HP Up page lists 19, including indoor/sewer records. Those totals are not all outdoor fixed pickups. Never convert NPC gifts, mission rewards or random outcomes into permanent surface dots.

## A more promising source: three-dimensional game placements

Read-only inspection of [KM-Editor](https://github.com/KotMatrosk1n/KM-Editor) source at tree b50b0266b2c4cdbc8b4cdb39433875b2a05fb4d5 establishes the existence of separate original item-ball data and transform tables. [Data path declarations](https://github.com/KotMatrosk1n/KM-Editor/blob/b50b0266b2c4cdbc8b4cdb39433875b2a05fb4d5/src/KM.ZA/Data/ZaDataPaths.cs) name:

- `world/ik_data/field/item_ball/item_ball_spawner_data/item_ball_spawner_data/item_ball_spawner_data_array.bin`
- `world/ik_data/field/spawner_transform_data/itemball_spawner_transform/itemball_spawner_transform/itemball_spawner_transform_array.bin`

[Placement workflow](https://github.com/KotMatrosk1n/KM-Editor/blob/b50b0266b2c4cdbc8b4cdb39433875b2a05fb4d5/src/KM.ZA/Placement/ZaPlacementWorkflowService.cs) associates appearance object names and item tables with transform rows. Coordinates X/Y/Z, rotation and attachment status are exposed. A lawful export of the original files could help determine location and vertical separation, but actual raw placement data was not retrieved, and local vs parent-relative transformations and item table/condition semantics still need verification. Searching those exact filenames produced no public results in this pass. No game files downloaded, no console modification requested, no third-party code or assets imported.

[Shiny-Stash-Live-Map](https://github.com/Insektaure/Shiny-Stash-Live-Map/blob/548896d0cc3b5fd531bd970f0708ecda13338492/source/main.cpp) independently documents a 4096-pixel city map projection using world X/Z; [public spawner example data](https://github.com/Insektaure/Shiny-Stash-Live-Map/blob/548896d0cc3b5fd531bd970f0708ecda13338492/romfs/t1_point_spawners.txt) contains three-dimensional Pokémon spawn positions. Those positions are not item coordinates, and this map transform is not independently calibrated to our 1920-pixel image. [Project Pokémon ZA item data](https://github.com/projectpokemon/za-textport/blob/0eb14d75de5282f33b783854e1a5aca8c168d83c/Raw/item_data.json) describes item IDs and properties, not positions. Both findings narrow the search but do not prove physical pickup coordinates.

## Acceptance gate

Acquire a lawfully usable original placement export, or retrieve a bounded set of precisely matching shared landmark controls. Keep the original 1920px city image unchanged. Fit on distributed noncollinear controls and check withheld controls, local accuracy, axis orientation and scene identity. Existing approximate mission/lift/zone points are ineligible as exact controls. Keep all native XY and verified floor fields null until evidence exists. Preserve 100 original screws, 264 item records, 146 approximate item leads, 21 Holovator records, 22 existing routes, all 70 access leads and the full 68-area queue. No new ladder/scaffold pins, permanent random Hyperspace pins, progress changes, or Workspace/backend changes. Continue AT-331's written/photo-first research in parallel; no extra credits or duplicate photo requests. [Structured register](ATLAS_AT332_ITEM_COORDINATE_REGISTER.json).
