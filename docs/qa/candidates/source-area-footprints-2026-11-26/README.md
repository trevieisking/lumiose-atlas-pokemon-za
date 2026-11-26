# Forty-eight named source area footprints

## Decision and scope

The independent review approves the fixed projection method for all 48 named Lumiose sector **source area footprints**. This packet supplies candidate coordinates and evidence for root review. It changes no runtime data, live site, geometry approval, roster, source photo, progress key, or release gate. `native-sector-footprint-candidates.json` deliberately retains `candidate_pending_root_review`, so the existing model rejects it until an explicit integration decision.

These footprints are the XZ projection of original named-area collision meshes, after each original scene transform. They are useful selectable area shapes. They do not define an exclusive city partition, walkable surface, physical barrier, encounter extent, or green Wild Zone display perimeter. The source's Layer 2 sector meshes overlap: 47 sector pairs have a nontrivial projected intersection, and some have different source heights. Higher Layer 7 Wild Zone meshes can cover sector footprints. The user's existing green outlines and photos must stay intact.

The named-area source gap is therefore resolved for these 48 sectors; the earlier absence of checked sector boundaries was not proof that the original semantic data was unavailable. This bounded geometry result does not close encounters, inventories, other master-plan gates, production testing, or the final Workspace handoff.

## Primary evidence

The original-resource publisher is [969981/ZA_Resources at e44a63d](https://github.com/969981/ZA_Resources/tree/e44a63db22a9f295d43c34db3f67695d31ae8e7a/Unpack/v2.0.2/romfs/arc/data.trpfs/virtual), whose path declares version 2.0.2. This is a third-party publication of original-resource assets. The content identity and spatial alignment were independently checked; no official-publisher endorsement or cryptographic authenticity beyond the retained hashes is implied.

`source-provenance.json` and `public-sector-assets-receipt.json` retain the exact public commit, full asset paths, Git blob IDs, SHA-256 values, byte counts, and relevant published decoder references. The 48 source collision assets total 191,296 bytes. The source scene is `world/ik_scene/field/area/t1/sub_scene/t1_field_area_/t1_field_area_0.trscn`, Git blob `36c62aad62e539f8a0b32930f053ee6a31084466`, SHA-256 `eac34b00110159b94a72e9788363d5087735a4a794ba58d8ce4549be591ea68e`.

The source identity chain is explicit:

1. The original `field_sub_area_array.bin` joins each area name to its `SubAreaName` message key and Layer 2. The correct version 2.0 field layout includes the inserted Runerigus field.
2. The original English AHTB name table and encrypted message DAT resolve each key to its visible sector label. Internal file suffixes are not assumed to be visible sector numbers. For example, Bleu Sector 2 resolves to `PLACENAME_A02_z02_01`, Bleu Sector 10 to `PLACENAME_A02_z02_07`, and Magenta Sector 5 to `PLACENAME_A03_z01_03`.
3. The original scene joins those names to their exact Havok mesh assets and SRTs. Every one of the 48 scene/collision joins is unique. The retained AT324 visible-name/game-index crosswalk agrees with all 48 labels.
4. The decoder reads the true triangle/quad primitives and vertex buffers. It never substitutes the mesh's AABB leaves, label crop, approximate center, or guessed street partition for a perimeter. All 48 decoded mesh XYZ bounds agree exactly with the independently stored source-tree bounds.

The derived source output has 48 valid single polygons, no holes, and 784 closed-ring vertices in the native candidate. Full XYZ face hashes are retained per sector; the raw payloads remain outside Atlas and are reproducible from the exact public blobs. Source heights and all projected overlaps are retained in the evidence. Jaune Sector 6, for example, spans source Y −10 to 5.119140625; treating the result as a single exclusive floor would lose information.

## Coordinate chain and what the error metric means

The world-to-original-texture mapping is the fixed published Lumiose transform from [TransformUI9a.cs](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/Info/TransformUI9a.cs) and [MapTransform.cs](https://github.com/kwsch/pkNX/blob/3bc649eea311ab1f249af43a562f8d70fe90ed9b/pkNX.WinForms/Subforms/Gen9a/Map/Info/MapTransform.cs):

```text
u = 78 − 3.94 × world_x
v = 78 − 3.94 × world_z
```

The original `map_field_00.arc` independently contains a `N_map_range_00` pane of exactly 3940 × 3940, zero translation/rotation and unit scale. `original-map-layout-range-receipt.json` records the BFLYT member hash, byte offset 1772, and field values. This directly corroborates the range parameter. Scale 1000 and offset 500 remain explicit published mapping parameters, corroborated by the independent spatial checks; the pane alone does not establish those two constants.

The original 4096 × 4096 `map_texture_00^o` was then registered to the unchanged owner-native `maps/lumiose-game-map.jpg` (1920 × 1920, SHA-256 `4602cfa3746f1e3cb4954b80fa9e75ffd2fe0c7d51f445ca83b73a7d3bc4aade`). This affine fit uses architecture only. No sector boundary, zone edge, badge, approximate marker center, or world-to-map diagnostic was fitted.

| Architectural calibration measure | Result |
|---|---:|
| Accepted, visually reviewed controls | 31 |
| Independently reserved north/west/east/south holdouts | 4 |
| Fit RMS / maximum | 0.728911 / 2.052361 px |
| Independent holdout RMS / maximum | 1.561398 / 2.000862 px |
| Existing observed-pick threshold | 3 px |
| Closest fitted target to any holdout | 281.17 px |

The first south holdout observation and its correction, all rejected/excluded feature candidates, the fixed holdout packet, and the independent review are preserved. No holdout was moved after fitting. The metric describes **original raster to Atlas architectural alignment**. It is not a statistical confidence interval or a universal bound on collider, green stroke, physical boundary, or hidden edge identity.

The fixed world transform was separately checked against 13 frozen zone positions/corners. Every result remains in `calibration/world-map-crosscheck-results.json`. WZ13 NE differs by 7.070528 px and SW by 7.364568 px; WZ14 NE differs by 3.032210 px. These are not silently excluded or used to refit. Direct review of the registered source base map and owner-native green layers supports a real distinction between source mesh footprints and display outlines. The green UI assets are a separate source/review task. These comparisons support the shared coordinate frame while expressly preventing a collider-equals-green-border claim.

`calibration/independent-sector-footprint-review.json` records `APPROVE_SCOPED_SOURCE_AREA_FOOTPRINT_PROJECTION`; `calibration/independent-texture-native-review.json` separately approves only the raster registration. Both receipts are retained unchanged.

## Deliverables and preservation

`native-sector-footprint-candidates.json` contains the 48 pending candidates; `derived-sector-footprints.json` contains the source XZ perimeters, height ranges and full-face hashes. `derived-world-crosscheck-footprints.json` preserves the source geometry used for the diagnostic comparisons. The `calibration` directory retains successful and failed replay receipts and every frozen numerical observation.

The three PNGs in this packet use the existing owner-native image: the all-sector projection, architecture calibration, and retained world-versus-green discrepancies. Recovered textures, scene/mesh binaries, full decoded XYZ payloads, external source code, and panels containing recovered texture artwork remain scratch research inputs. Their immutable source/artifact hashes are retained for reproducibility. No recovered source art is shipped to the website or added to Atlas assets.

## Reproduction

From this directory, the standard-library-only command below regenerates the 48 native candidates from the retained derived perimeters and fixed transform. It writes only the documentation candidate file and keeps the non-approved status.

```sh
python3 replay_native_candidates.py
```

For a full raw-source replay, use an independent scratch checkout of the public repository. Keep both original assets and that checkout outside Atlas:

```sh
git clone --filter=blob:none --no-checkout https://github.com/969981/ZA_Resources.git /tmp/atlas-za-public-source
python3 fetch_public_assets.py --public-repository /tmp/atlas-za-public-source --output /tmp/atlas-area-research-inputs
python3 replay_source_meshes.py --public-assets /tmp/atlas-area-research-inputs
```

The raw replay requires Shapely 2.2.0. The fetch helper checks commit membership, exact Git blob hash, SHA-256 and byte count before writing each input. `--include-map` optionally retrieves the original calibration ARC into the external scratch directory; it is not necessary for the mesh/name replay. The project-owned buffer readers are included; external source files are referenced, not copied wholesale. The raw replay checks all 48 English identities, original scene SRTs, Layer 2 joins, exact perimeters, full XYZ face hashes, and zero source-tree bounds discrepancy.

The retained original-image calibration source is reproducible using the pinned, published pure buffer reader identified in `source-provenance.json`. The frozen control coordinates, holdouts, coefficients and all rejected candidates remain available without importing the recovered art. The independent reviewer also replayed the least-squares fit exactly and visually inspected all accepted control and holdout patch pairs in scratch.

## Validation and integration requirements

The raw-source replay passed for all 48 sectors. The native candidate replay passed, with 784 vertices. All scripts parsed. The current shared-area model correctly rejects the pending status for every row; a read-only validation with explicit approval supplied in memory confirmed all 48 native polygons satisfy the existing identity, map-hash, source, calibration and topology gates (approximately 14 ms total). This did not change any runtime approval.

Root integration still needs to approve the exact candidate file, retain `representation: source_area_footprint`, expose wording that describes overlapping 2-D source area footprints and the height limitation, preserve every existing Wild Zone/photo record, and run the relevant shared model/browser/visual checks on the integrated exact head. Do not flatten overlaps, subtract higher layers, silently expand the polygons to roads, replace photo-derived green outlines, or promote encounter memberships solely from this geometry packet.
