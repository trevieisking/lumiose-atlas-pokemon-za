# AT-325 G2 — Private overview recovery and historical alignment sensitivity

25 November 2026. These three originals were recovered from the owner's November 21 upload batch. The image bytes remain private. See the [historical register](../../MAPS_OWNER_WIDE_PHOTO_ALIGNMENT_2026-11-21.json) for exact SHA-256 and filename provenance.

| Frame | Original bytes | Verified decoding | Visible city coverage |
| --- | ---: | --- | --- |
| W01 | 284,011 | JPEG, 1536 × 865 | Southern city rim and Wild Zones 1, 12, 16, 17; extends north into the overlap with W02. |
| W02 | 359,422 | JPEG, 1536 × 865 | Central Prism Tower plaza and mid-city; overlaps W01 at Wild Zones 5, 16, 2 and 11, and W03 at Wild Zones 3, 7, 8 and 19. |
| W03 | 264,497 | JPEG, 1536 × 865 | Northern city rim and Wild Zones 13, 18, 4, 15; extends south into the overlap with W02. |

All full-file hashes exactly match the historical originals. The south/center/north chain is consistent with the owner's description of a city map in three pieces, but the later message does not name the files. Do not treat this as proof of seamless perimeter coverage, one-to-one pixel scale, constant north-up/frame geometry or verified boundaries. TV framing, perspective, lens effects, overlays and position markers are visible and must not become geographic controls. Preserve the original base map and complete existing crop libraries.

## Historical sensitivity diagnostic (not independent calibration)

Re-fit the archived approximate controls with ordinary least squares. Convert archived 1280 preview targets to 1920 native pixels by ×1.5. The leave-one-out column is the maximum Euclidean prediction error for a control omitted from its own fit. It compares old approximate picks only; it does not validate new locations.

| Frame | Historical controls | In-sample RMS, px | Worst omitted control, px |
| --- | ---: | ---: | --- |
| W04 | 6 | 5.8 | 22.0, Bleu Pokémon Center |
| W05 | 4 | 0.6 | 34.1, Wild Zone 11 |
| W06 / W07 | 3 each | Not used | Insufficient controls for this affine check |
| W10 | 5 | 4.2 | 16.7, Wild Zone 1 |

For the next pilot, re-pick stable street junctions, canal/bridge corners and architectural edges on the originals and native map, retain at least four distributed noncollinear fitting points plus separate near-edge and near-center holdouts, and report unexplained residuals. In-sample RMS alone does not qualify a frame. No new coordinates, geometry, boundary polygons, overlays, or gameplay changes are authorized by this receipt. G2 calibration and downstream release gates remain open.
