# Wild Zone 05: cross-check the green map outline

Package 1 / G2–G3 evidence, 26 November 2026. The four owner photos dated 26 November show the complete green surface-map outline. This is additional evidence, beyond the earlier [AT-327 two-view alignment](ATLAS_AT327_REGISTRATION_PILOT_REPORT.md). The four fits were recomputed using only matched patches with their centres outside a generously buffered WZ5 rectangle. Neither the WZ5 green overlay nor entrance symbols were used to fit these transforms. The original basemap, exact older WZ5 photo blobs and source index were checked independently; the four new overview photos were used for this trace comparison.

| Original crop | Exterior fit / holdout | Held-out fit RMS | Outline RMS | Outline 95th percentile |
|---|---:|---:|---:|---:|
| 1000028697.jpg | 27 / 23 | 3.21 px | 3.76 px | 6.40 px |
| 1000028698.jpg | 21 / 21 | 3.12 px | 3.39 px | 6.02 px |
| 1000028701.jpg | 19 / 22 | 2.79 px | 3.53 px | 6.00 px |
| 1000028702.jpg | 21 / 25 | 2.78 px | 3.20 px | 5.60 px |

[Five-panel visual comparison](atlas-wz05-owner-overview-trace.jpg) (magenta: basemap contour; cyan: independently extracted photo contour). [Exact coordinates and error record](ATLAS_WZ05_OWNER_OVERVIEW_OUTLINE.json). This supports the overall footprint and long sides, but fine edge placement differs locally by up to about 12 px. The colour threshold follows some glow and entrance-transition pixels. Review those corners by hand before approving a display polygon, and do not reuse this as physical collision, a spawning range or traversable geometry. No approved polygon, fixed pickup, path or playable release was created.

Repeat with Python 3, Pillow, NumPy, SciPy and ContourPy:

```sh
python docs/qa/trace_wz5_owner_overview.py maps/lumiose-game-map.jpg assets/atlas/city-overview/owner-crops-2026-11-26/manifest.json /tmp/atlas-wz05
```
