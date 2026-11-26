# Eight new owner-cropped Lumiose maps · 26 November 2026

Package 1 / G2 source evidence. The eight 2048-pixel-wide early-game crops are stored byte-for-byte as JPEGs. These are eight distinct snapshots with overlapping north, centre, south, west and east coverage. Earlier AT-329 overviews, all sector/Wild Zone photos and the production basemap remain unchanged. No duplicate of these eight blobs was present on the inspected baseline.

| Exact source | View | Training patches | Held-out patches | Held-out RMS | Largest held-out residual |
|---|---|---:|---:|---:|---:|
| [1000028696.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028696.jpg) | Northern rim | 20 | 28 | 3.56 px | 7.83 px |
| [1000028697.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028697.jpg) | South and lower centre | 30 | 26 | 3.19 px | 12.31 px |
| [1000028698.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028698.jpg) | Central cross-city strip | 22 | 24 | 3.15 px | 6.36 px |
| [1000028699.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028699.jpg) | West rim | 14 | 15 | 2.44 px | 6.81 px |
| [1000028700.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028700.jpg) | Eastern and northeastern rim | 14 | 23 | 4.07 px | 7.51 px |
| [1000028701.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028701.jpg) | South and southeast | 21 | 24 | 2.87 px | 4.46 px |
| [1000028702.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028702.jpg) | South and southwest | 22 | 27 | 2.70 px | 6.97 px |
| [1000028703.jpg](../../assets/atlas/city-overview/owner-crops-2026-11-26/1000028703.jpg) | West and northwest | 27 | 23 | 4.52 px | 12.47 px |

[Exact byte and registration manifest](../../assets/atlas/city-overview/owner-crops-2026-11-26/manifest.json) lists original filenames, dimensions, byte counts, SHA-256, Git blobs, affine transforms, sampled coordinates and held-out residuals against the exact 1920 × 1920 basemap. Candidate overlays were visually checked for the street grid, canal and city rim in all eight views. This is **photo-to-map alignment**, not survey accuracy and not confirmation of any point, boundary, floor, encounter or route. Two views contain individual held-out matches more than 12 px from their fitted location. Do not treat mission icons, map cursors, or later-zone absences in early-game images as valid placement data.

Repeat locally with Python 3, Pillow, NumPy and SciPy:

```sh
python docs/qa/register_owner_overview_crops.py maps/lumiose-game-map.jpg assets/atlas/city-overview/owner-crops-2026-11-26
```

Next: compare individual area boundaries and named static landmarks in the overlapping photos before drawing any production boundary or adding a pin. Package 1, G2/G3 and the final Workspace handoff remain open. No video work, live map changes or database changes.
