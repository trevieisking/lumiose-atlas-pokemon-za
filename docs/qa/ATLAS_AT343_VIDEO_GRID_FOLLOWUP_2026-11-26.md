# AT-343 video follow-up: measured local X grid

**26 November 2026 | Research checkpoint: Manifest 95 / Ledger 103**

## Finding

The faint crosses in the supplied Wild Zone 20 map view form a measurable local reference grid. An architecture-only registration puts the two intervals inside the fitted park region at **239.96 pixels east-west and 240.14 pixels north-south**, on the explicitly identified **4096 x 4096 reference image**. This supports using approximately 240-pixel cross spacing for local alignment and search-cell indexing in this view.

The owner's video separately shows a waypoint reading of **60 at 20.9-21.0 seconds**, declining as the player approaches it. This supports Trev's approximate scale observation. It does not establish 60 counted footsteps, metres, or an exact universal centre-to-centre distance: the player marker covers the southern cross, the pin is slightly offset from the visible northern cross, and the clip does not reopen the map at the endpoint.

The origin and spacing below are a descriptive fit to the observed local pattern. They are **not official developer coordinates**, and the claim that the developers used the crosses to construct the map is unverified. The prior withdrawal of the cross-equals-present-item rule remains controlling.

## Source and preservation

The supplied original `1000028756.mp4` is 107,198,387 bytes, 1280 x 720, duration 56.262733 seconds. Its SHA-256 is:

`9d95aac4c6f865a9fe63767e45091b6b98462d7b7c6b8728f435e426342ffda3`

The original video is preserved as the supplied attachment. This packet adds separate decoded frame copies; it does not overwrite, crop, rotate, resize, recompress or annotate the original. [Source provenance and timed observations](at343-video-grid-2026-11-26/source-provenance.json) record the frame hashes. The video is research evidence supplied for this request; public video/YouTube features remain paused.

The comparison image is the public [ShinyStashMap Lumiose resource](https://github.com/santacrab2/ShinyStashMap/blob/master/ShinyStashMap/Resources/lumiose.png), Git blob `c5d863319961690d02d4b7d78f87b4ab0ed8b74c`, SHA-256 `69e7c03b58ad8e3dbdccda36075e64151973d6634c39feccb9f31c9b96f3bc89`. It was read as an external research input and is not redistributed in Atlas. Its image coordinates have the origin at the top left, x increasing rightward and y downward. They must not be confused with the production Atlas's different 1920 x 1920 image.

## Measured coordinates

These are estimates after correcting the photographed screen's perspective with the park outline. Decimal values retain the calculation for reproduction; they do not imply subpixel physical accuracy.

| Cross | Video pixels at 14 seconds | Estimated 4096-reference pixels | Evidence scope |
|---|---|---|---|
| Northwest | (354, 214) | (1920.56, 1920.60) | Inside architecture control hull |
| Northeast | (748, 213) | (2160.51, 1921.58) | Inside hull; actual cross visible inside cursor ring |
| Southwest | (361, 628) | (1921.35, 2160.74) | Inside architecture control hull |
| Next east, upper row | (1102, 207) | (2401.24, 1919.31) | Extrapolated diagnostic outside hull |
| Next east, lower row | (1095, 578) | (2400.49, 2159.01) | Faint extrapolated diagnostic outside hull |

The southeast point under the player icon was not measured or used as an observed cross. A local descriptive model places the visible rows/columns near reference coordinates **1920, 2160 and 2400**, separated by **240 reference pixels**. This phase was noticed after fitting and does not independently establish a global origin.

| Adjacent interval | Measured reference pixels | Scope |
|---|---:|---|
| Northwest to northeast | 239.9593 | Local interior evidence |
| Northwest to southwest | 240.1403 | Local interior evidence |
| Northeast to next east | 240.7336 | Extrapolated check |
| Eastern upper to eastern lower | 239.7061 | Extrapolated check |

## Method and independent review

The fit uses **15 manually selected park-outline vertices**; **seven other outline vertices** are reserved for checking. Crosses, player marker, cursor and distortion icon do not enter the fit. A normalized projective fit followed by geometric least squares gives 1.318 reference-pixel fit RMS; the reserved architecture points give 0.814-pixel RMS and 1.252-pixel maximum error. These are checks on one local footprint in one frame, not independent citywide surveys or total marker accuracy.

A second analysis independently rebuilt the transformation and reproduced the cross projections within 0.00008 reference pixels. Alternative fits, including leaving out each fit point, kept the two local intervals close to 240 pixels. That agreement verifies the calculation. Manual picks, compression, unmodelled lens distortion, possible source-version differences and extrapolation still limit accuracy. Picking-noise percentiles in the raw packet are sensitivity experiments, not total confidence intervals.

- [Frozen selections, matrix and measurements](at343-video-grid-2026-11-26/registration.json)
- [Independent review](at343-video-grid-2026-11-26/independent-review.json)
- [Portable numerical replay](at343-video-grid-2026-11-26/replay_grid_registration.py)
- [Decoded map frame, 14 seconds](at343-video-grid-2026-11-26/frame-014.0.png)
- [Decoded waypoint frame, 21 seconds](at343-video-grid-2026-11-26/frame-021.0.png)

With NumPy and SciPy installed, run `python3 docs/qa/at343-video-grid-2026-11-26/replay_grid_registration.py`. It reads the frozen observations and prints results; it does not alter originals or runtime data.

The published community world-to-image scale in [Form1.cs](https://github.com/santacrab2/ShinyStashMap/blob/master/ShinyStashMap/Form1.cs) and [MapTransform.cs](https://github.com/santacrab2/ShinyStashMap/blob/master/ShinyStashMap/MapTransform.cs), 3.94 reference pixels per coordinate unit, gives 240 / 3.94 = approximately 60.9. This is an additional numerical consistency check only. It is not a verified stride length, a unit label for the displayed waypoint, or a new game-to-Atlas calibration.

## How to use the grid for reconstruction

1. Preserve each complete original and operate only on distinct derivative copies with source/output hashes and recorded crop or transform.
2. Keep the source map north-up. Correct the camera's perspective, not an imagined in-game map rotation.
3. Identify unique roads, building corners, canals or the central park before matching repeated crosses. An identical lattice alone can align one whole cell away from the correct location.
4. Use measured cross centres as secondary anchors and local row/column references. Start the tested park grid at its northwest cross: A1 = (0,0), B1 = (1,0), A2 = (0,1). These are Atlas research labels, not game-provided labels.
5. Subdivide a validated cell into smaller search areas, for example a 10 x 10 grid of tenths. A finer drawn grid improves indexing; it does not create evidence of a hidden item's exact position or improve the underlying calibration error.
6. Validate each overlap and zoom independently, including the two central north/south views, before expanding to other sectors. Reconcile with the native 1920 map using its own documented controls and holdouts.
7. Record a verified object's within-cell location and floor/access evidence separately. A cross by itself does not prove an item, entrance, ladder, spawn or height.

## Planning and release scope

This follow-up preserves the earlier [Vert-pair experiment](ATLAS_AT343_OWNER_ITEM_CROSS_REPORT.md) and its immutable measurements, source inventory and tracker receipt. The private tracker had already advanced to Manifest 94 / Ledger 102 for the separate AT-344 source-collection checkpoint while the inspected GitHub main was still at 92/100. That prior source-collection note is preserved; this follow-up does not certify that its complete 26-original archive is present in main or replace the separate intake work.

Manifest 95 / Ledger 103 records this additional measured evidence. The [new tracker receipt](ATLAS_AT343_VIDEO_GRID_TRACKER_RECEIPT.json) records the actual guarded synchronization and readback. No new item pins, native Atlas coordinates, application behavior, progress keys, original images or original Workspace publication are changed. The approved runtime remains `223762bd1a21c2e72c592e975499d13c4195ae07`, release Manifest 91 / Ledger 99. This is a documentation/research promotion, not a live coordinate-system release.
