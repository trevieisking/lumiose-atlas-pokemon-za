# AT341 · WZ20 rendered selection outline candidate

## Decision requested

This packet proposes one additional **rendered map-selection outline**, Wild Zone 20, for independent review under the same three-native-pixel raster tolerance used by the existing five approvals. It is **not approved or loaded at runtime**. `candidate-geometry.json` is a closed 128-edge polygon sampling the observed near-circular game-map perimeter. It does not define a player's route, physical barrier, floor, spawn range or encounter location.

The primary source is the existing unmodified owner overview. Six named architectural controls register it to the unchanged 1920×1920 map; five architectural checks remain withheld. A separate owner closeup provides a larger view, registered using six architectural controls and four withheld checks before composition through the primary transform. Neither transform fits gate icons, zone badges, travel buttons or perimeter points. Primary controls span the northwest courtyard, west roof, east canal and two lower tower corners.

## Results

All errors below are in **native image pixels**. Closeup architectural errors measure its agreement with the calibrated overview and are not an independent estimate of total absolute map error.

| Check | Count | RMS | Maximum |
| --- | ---: | ---: | ---: |
| Overview architectural fit | 6 | 0.650 | 1.133 |
| Overview withheld architecture | 5 | 1.835 | 2.192 |
| Closeup architectural fit, composed | 6 | 0.383 | 0.506 |
| Closeup withheld architecture, composed | 4 | 1.245 | 1.595 |
| Native green stroke points fitting the ellipse | 242 | 0.400 | 1.406 |
| Alternate native green stroke points withheld | 246 | 0.426 | 1.488 |
| Independent owner-overview perimeter samples | 228 | 0.757 | 1.884 |
| Independent owner-closeup perimeter samples | 257 | 1.028 | 2.903 |

The polygon is finite, closed, inside the native image and strictly convex, with no self-intersections. Its area is approximately 49,204 native square pixels. The complete observations, every retained ray and exact errors are in `candidate-evidence.json`; no worst-residual point is removed.

## What the outline means at icons and gates

The visible original green perimeter supports a near-circular selection footprint around the tower. Gate squares and arrows are interface decorations. The fitted circular continuation closes the rendered selection footprint across their small spans and the Centrico Plaza icon/name occlusion; it does not assert that any connector is walkable. Orange dashed portions in the review images make this modeling visible. The native top gate, west gate, east gate and south icon masks are explicit angular ranges in `manual-observations.json`. The two owner images have their own original UI masks.

Three pixels is a tolerance for the antialiased raster stroke and approximate manual image picks. It is not a statistical confidence interval, a physical distance or proof of every hidden underlying pixel. Independent review must decide whether the observed circular perimeter and its corroborating source views justify these modeled continuations for selection purposes. The existing WZ04 HOLD remains a separate decision and is not changed by this packet.

## Reproduce and review

Run `python docs/qa/candidates/wz20-2026-11-26/reproduce.py` with Pillow, NumPy and OpenCV. It verifies all three source hashes, recomputes both transforms, traces the native stroke, withholds alternate native rays, compares independently traced owner rims, checks topology and generates the panels. It writes only this candidate directory. Input photographs, runtime data, canonical plans and existing independent review decisions remain untouched.

Review in this order:

1. Original owner overview and closeup at their recorded `assets/atlas/wild-zones/` paths and the native map.
2. `primary-landmark-review.png`, including all five withheld points; then `closeup-landmark-review.png`, whose labels use its overview target-pixel units.
3. `registered-source-review.png` and the two original-coordinate overlay panels. Verify identity, visible perimeter agreement, all modeled UI spans and absence of an inconsistent corner.
4. `candidate-evidence.json` and `candidate-geometry.json`, hashes and scope before accepting any production record.

The review author must not set independent approval merely because the numerical checks pass. This packet leaves that review unclaimed.

## Preserved failures and correction history

The first cross-palette SIFT screen mixed UI, repeated and incorrect matches; those raw pairs were not used for the primary calibration. A separate closeup-to-overview SIFT screen proposed many UI matches as well; only two visually checked, withheld architectural corner descriptors are used in the auxiliary calibration.

Two initial native mask-selection attempts chose the wrong green component: the outermost mask chose neighboring WZ05 pixels; the first mask run chose an interior tower/cafe feature. The final search window is restricted to the directly inspected native perimeter band. Both failed full trace outputs remain here. An initial closeup angular mask included place-name and southwest gate pixels; the final mask names and excludes those original UI elements. The initial output is retained.

Initial F5/F6 source picks lay above the tower's bottom chamfer stroke. The enlarged original resolved the stroke-center intersections; only those two source picks were corrected. Every primary withheld point is unchanged, and the initial full calibration is retained. These are image-measurement corrections, not additional gameplay claims.

## Remaining master-plan scope

Before an independent WZ20 decision, five zone outlines remain approved, fifteen zone outlines and all forty-eight sector boundaries remain unresolved. An independent WZ20 approval would change that count to six approved zone outlines and sixty-two unresolved boundaries. It would not complete G2/G3 or clear G5/A0. Sector label positions and the supplied sector photographs are useful orientation evidence, but cannot substitute for sector perimeters.
