# Atlas native cross grid v1 — measurement evidence

The faint crosses can support an Atlas-owned search grid on the existing 1920 × 1920 map. This calibration directly measures visible crosses on the unchanged native image, then checks the result against ten interior native crossings and Trev’s two central photographs. It does not depend on importing an external map or assuming a conversion between a 4096-pixel texture and Atlas pixels.

## Native coordinate convention

A1 is the model-defined northwest reference crossing. It is inferred from the fitted lattice; the crossing at index (0,0) was too faint for inclusion in the measured set. Columns increase east from A to R; rows increase south from 1 to 18. The northwest crossing names each cell. This A1 is a new whole-map Atlas convention, distinct from the earlier Wild Zone 20 research-local A1.

For zero-based column `c` and row `r`:

```
x = 27.190436640992303 + 108.66657856804908*c + 0.044411804896392404*r
y = 31.181553067815514 - 0.01784961253751029*c + 108.78386641874158*r
```

Coordinates are native image pixels: origin at the top-left, x right, y down. Last row 18 and column R are partial cells clipped to the map. The narrow top and left strips before A1 have no labelled cell. Points outside the image or negative grid indices must not acquire a cell label. Any finer subdivision helps communicate a location; it does not improve the measurement source.

## Validation

| Evidence | Count | RMS | Maximum |
| --- | ---: | ---: | ---: |
| Native outskirts crosses used to fit | 19 | 1.01 native pixels | 2.43 native pixels |
| Native outskirts crosses withheld from fit | 10 | 0.94 native pixels | 1.49 native pixels |
| Additional visible interior native crosses, never fitted | 10 | 1.35 native pixels | 1.82 native pixels |
| Central photograph 161334: cross checks inside architecture control hull | 9 | 1.04 native pixels | 1.60 native pixels |
| Photograph 161350 to 161334: cross checks inside shared architecture control hull | 9 | 4.79 photograph pixels | 8.24 photograph pixels |

Native detection uses perpendicular dark-line responses around approximate crossing positions. Weak JPEG noise candidates were rejected by a final contrast threshold of 1.5 after visual inspection. The exterior split is deterministic: `(column + 2*row) % 3 == 0` is withheld. The ten interior checks were selected from diagnostic crops for visible cross shape after inspection; they are not a preregistered sampling experiment.

Photograph 161334 was registered to native Atlas using architecture features with cross neighbourhoods, cursor and prominent labels/icons masked out. Twelve features at eleven unique source positions survived the robust fit; fit RMS was 0.73 native pixels. Photograph 161350 was independently aligned to 161334 through shared architecture: 114 features at 102 unique positions, with fit RMS 1.88 pixels in photograph 161334. No crosses were used to fit those photograph transformations. All measured crossings and feature correspondences are retained in the JSON packet.

The photograph-to-native transform is locally supported. Extrapolated checks outside its architecture control hull reach about nine native pixels of error. Those results are explicitly retained, and must not be used to promote newly exact item pins. The optional native-image grid itself is calibrated directly from visible native-image crossings. Observations extend through row index 15, while the conventional rendering continues to the partial row 18. Reported residuals apply to measured locations, and are not a guarantee for every unmeasured crossing.

## Original-file preservation

The current full originals are `docs/qa/at344-sector-source-survey/sources/20261126_161334.jpg` and `20261126_161350.jpg`. Their exact bytes match the supplied originals. The earlier AT343 full-frame copies have different file hashes but identical dimensions and decoded RGB pixels; the packet records this distinction. No original was modified for this analysis. The annotated overview and contact sheets are separate derivatives.

## Video finding

The supplied 56.26-second video visibly shows a waypoint number of 60 at approximately 21 seconds, then smaller numbers as the character moves. It shows nearby cross positions on the map, but the pin and player marker obscure exact endpoints. It does not establish counted footsteps, feet, metres, an exact universal 60-per-cross interval, or the developer’s original purpose for the crosses. The grid therefore uses cross intervals without a physical-distance conversion.

## Files and replay

- `native-grid-calibration.json`: runtime-ready origin, vectors, dimensions, index policy and evidence summary.
- `native-grid-registration.json`: full observed data, source hashes, matrices, feature correspondences, withheld checks and limits.
- `native-grid-evidence-overlay.jpg`: separate annotated overview; blue circles are fit observations and red circles are withheld observations.
- `native-grid-cross-crops.jpg`: direct exterior measurement crops.
- `native-interior-candidates.jpg`: interior diagnostic sheet; selected IDs are recorded in the packet.
- `replay_native_grid_calibration.py`: source hash, affine arithmetic and holdout replay; `--redetect-native` also re-runs the native image detector.
- `native-grid-replay-result.json`: successful replay of source hashes, all model arithmetic and all 29 exterior image detections.

Run with NumPy and OpenCV installed:

```
python replay_native_grid_calibration.py --repo /path/to/atlas --redetect-native
```

This work creates a reference system. Existing marker coordinates, floor information, evidence confidence, photographs, player progress and random-distortion handling remain separate and unchanged.
