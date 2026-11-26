# Early-game owner photo outline screening: Wild Zones 01–04 and 06

Package 1 / G2–G3. Screened five additional Wild Zones from the new owner crops using held-out checks and refitting each image with its target close-up plus a 48 px margin excluded from the registration points. The pixel threshold is only a measurement aid. Where a label, cursor, gate icon or source frame interrupts it, the extracted contour is incomplete even if the photograph itself can support a manual trace.

| Wild Zone | Views examined | Result |
|---|---:|---|
| 01 | 3 | The central label and its wing cover different parts of the narrow edge across frames. No whole perimeter accepted. |
| 02 | 4 | Three views corroborate the circular footprint. 1000028701 is rejected for the complete-outline check: the red cursor removes part of the southeast border. |
| 03 | 4 | All four images corroborate the oval outline. The two gate approaches still need landmark checks before approval. |
| 04 | 2 | The red cursor and zone badge defeat the thresholded basemap comparison. The two owner views show the rectangle; use them for manual edge picks rather than publishing the automated contour. |
| 06 | 2 | Both independent photos show the northeast and south edges. The comparison is confounded by the basemap café and zone badge; trace those segments manually. |

- **Wild Zone 02:** clean-frame contour RMS 1.61–2.44 native pixels; cursor-obstructed frame 28.33 px. Do not average the obstructed result into a claim of accuracy.
- **Wild Zone 03:** four independent contour RMS values 2.12–3.36 native pixels. This is a display-footprint candidate, not a spawn, floor or route extent.
- **Wild Zone 05:** separate [detailed outline check](ATLAS_WZ05_OWNER_OVERVIEW_OUTLINE.md) records four corroborating views.

[Original-photo comparison panel](atlas-early-zone-outline-screening.jpg) shows why several threshold results were rejected. Magenta is the basemap trace; cyan is the trace from the owner crop. [Machine-readable comparisons](ATLAS_EARLY_ZONE_OUTLINE_SCREENING.json) retain rejected data. The map runtime and all placement IDs are unchanged. No production polygons, encounter extents or collectible positions approved. Continue with manual outline corroboration and exact photo references; no further screenshots need be requested for this pilot.

Reproduce with Python 3, Pillow, NumPy, SciPy and ContourPy:

```sh
python docs/qa/screen_early_zone_outlines.py maps/lumiose-game-map.jpg assets/atlas/city-overview/owner-crops-2026-11-26/manifest.json /tmp/atlas-zone-screen.jpg > /tmp/atlas-zone-screen.json
```
