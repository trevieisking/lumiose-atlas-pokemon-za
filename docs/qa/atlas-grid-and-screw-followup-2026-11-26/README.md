# Atlas search grid and collectible follow-up

**Candidate, not a release.** Use the faint crosses as an Atlas search reference; they do not mark collectible locations. The first prototype works only in the measured Wild Zone 20 frame. It has no effect on live markers, progress, photos or the original Workspace project.

## Measured first cell

- The north-up 4096 reference uses a descriptive origin at (1920,1920) and 240 reference pixels per cell. Two in-hull measured cross intervals were 239.96 and 240.14 pixels. The separately observed waypoint reading of about 60 is not a verified step count, physical unit or universal scale.
- `grid_reference.py` returns a row, column and one or more tenths from a position already expressed in this frozen reference. It verifies the reference hash, requires an explicit positive input uncertainty, returns every subcell touched by its conservative bounding square, and rejects estimates extending past the architecture-control hull. Its output is never a map pin. The ten subdivisions are labels, not a tenfold increase in accuracy.
- Run `python docs/qa/atlas-grid-and-screw-followup-2026-11-26/verify_grid.py`. Registration evidence and the independently reproduced [local fit](../ATLAS_AT343_VIDEO_GRID_FOLLOWUP_2026-11-26.md) remain unchanged.
- Next validate the two owner-supplied centre shots and then overlapping sectors with independent roads, building corners and withheld controls. Only assign a shared cell ID after checking for one-cell aliasing between frames. Preserve originals and work on hashed copies. Keep the 4096 reference, native 1920 production raster, XYZ/scene and observed waypoint readings distinct.

## Screw #19: when to return

After beating Canari in Main Mission 14, return to Racine Construction and look behind Tarragon’s lobby desk. [GameSpot's authored route](https://www.gamespot.com/gallery/pokemon-legends-za-colorful-screw-locations/2900-7145/) reports the pickup on re-entry after Canari, but mislabels the rank. [Atlas Mission 14](../../../walkthrough.html#mission-14) has the Rank E promotion. [Serebii’s venue inventory](https://www.serebii.net/pokearth/lumiosecity/racineconstruction.shtml) confirms the desk. [AppMedia’s route](https://appmedia.jp/pokemon_legends_za/79397852) independently reports after Mission 14 in the research checkpoint; direct access returned 403 in the final recheck.

The [pinned v2.0.2 table](https://github.com/969981/ZA_Resources/blob/e44a63db22a9f295d43c34db3f67695d31ae8e7a/Unpack/v2.0.2/romfs/arc/data.trpfs/virtual/world/ik_data/field/item_ball/item_ball_spawner_data/item_ball_spawner_data/item_ball_spawner_data_array.bin) reproducibly shows Screw 2619 at `id_itb_t1_i011_01` with phase condition op 5 and argument 50100. The raw scene contains the unique indoor XYZ byte sequence, not an exterior map point. The engine event setting 50100 and the operator’s exact semantics are not independently mapped. Keep the other four phase-gated Screw rows provisional; there is not yet a safe numbered join. The replay uses the original table bytes locally, not a bundled copy. [Decoded findings](v202-activation-findings.json).

## Magenta 6: same scaffold, two levels

I inspected both [Game8 guide](https://game8.jp/pokemon-legends-z-a/729591) map pairs. The first shows the separate western course; the [second map](https://img.game8.jp/11862312/70b40f200a6900fee2d730da7eec5e62.webp/show) matches the north scaffold in the prior Magenta 6 register, immediately southeast of the canal and west of Magenta Plaza. Its [lower still](https://img.game8.jp/11862342/5f5968f036c6ba5490c34f3ceca47d7d.webp/show) and [upper still](https://img.game8.jp/11862316/329b7c1aacec49387dac185d0d9118e0.webp/show) each show a visible purple pickup and different platform context. This strengthens the separate #88/#89 floor routes. Neither photograph resolves the pickup centre on the north-up raster; the shared map view still depicts the player, so no exact point is approved. Static images were inspected, not copied into the site.

## Single request for Workspace, after candidate review

Apply only the reviewed GitHub changes to the existing Atlas after Workspace backup and preview. Keep the original source screenshots. Build and verify the Atlas search grid locally before extending through centre and sector overlaps, using independently matched scenery as the main reference and crosses as a second check. Preserve every collectible number, route, layer and saved checkmark. Only publish exact pins on independent scene, floor, identity and position evidence. Keep research/grid-only content out of the public site unless separately approved. No new videos, service, credit spend or database changes.
