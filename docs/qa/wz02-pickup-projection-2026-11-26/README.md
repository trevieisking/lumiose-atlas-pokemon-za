# Wild Zone 2 pickup projection pilot

**Decision: retain research candidates; do not publish exact pickup pins.**

The revision-pinned [exterior export](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/field_items/field_items_t1.txt) contains **1,153 distinct spawner IDs**, including **99 Colorful Screw spawners** (item ID 2619). The separate [interior export](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/field_items/field_items_t1_i011.txt) adds one Screw in scene `t1_i011`. The interior has local coordinates and must not use the exterior transform. The 100 data rows do not determine the Atlas numbering; no numbering join or random-item coverage is claimed.

## First cross-check

Project exterior X/Z through the original texture and the reviewed texture-to-Atlas transform. Eight projected spawners fall inside the current Wild Zone 2 visual outline. This is a geographic screen, not proof of floor, access or the full zone inventory.

| Source row | Candidate | Native X, Y | What supports it |
| --- | --- | --- | --- |
| `itb_a0103_01` | West Great Ball | 1121.61, 1341.87 | The written guide puts a separate Great Ball at the southwestern boulder. About 120.8 px from archived Atlas `2-5`. |
| `itb_a0103_14` | East Great Ball | 1239.12, 1350.43 | The written guide puts a Great Ball on the southeastern route beyond breakable rocks. About 10.8 px from archived Atlas `2-5`, independently supporting the AT335 east identification. |
| `itb_a0103_02` | Swift TM027 | 1214.32, 1293.80 | The written guides place Swift by the central-island trees. A separately aligned in-game map still places its map reticle about 2.2 native pixels from this candidate. |

[Pokébip written locations](https://www.pokebip.com/page/jeux-video/legendes-pokemon-z-a/guide-des-lieux/zone-sauvage-2) · [Raider King Swift guide and map still](https://raiderking.com/pokemon-legends-z-a-all-tms-locations/) · [Earlier AT335 report](../ATLAS_AT335_PICKUP_COORDINATE_PILOT.md) · [Machine-readable replay output](pilot.json) · [Owner close-up overlay, research only](owner-closeup-pilot.jpg)

This independent still alignment used eight architectural patches and three separated check patches; the maximum check error was 0.56 px in the 1920 native raster. One weak ambiguous patch was screened out and retained in the receipt. That error measures image alignment only. The still shows UI reticle and player position, not the pickup itself. The owner close-up overlay uses a separate, weaker preliminary close-up registration and is illustrative. Neither result certifies pickup accuracy, version parity, route/floor conditions or a whole-city transform for collectibles. Both Great Balls remain distinct, and no saved collection key moved or changed.

## Reproduce

Download the pinned exterior and interior TSVs and the exact [Swift map JPEG](https://raiderking.com/wp-content/uploads/2025/10/Pokemon-Legends-Z-A-All-TMs-Locations-Exploration-3-1024x576.jpg) above. From the repository root, run `python3 docs/qa/wz02-pickup-projection-2026-11-26/replay.py EXTERIOR.tsv INTERIOR.tsv SWIFT.jpg OUTPUT_DIR` with NumPy, SciPy and Pillow. The script requires matching input hashes and writes only research output to the destination chosen by the operator. The third-party image is not included in the repository. Next proof: a visible or explicitly identified pickup tied to a map position, then a bounded few-item pilot before any bulk projection or Screw numbering.
