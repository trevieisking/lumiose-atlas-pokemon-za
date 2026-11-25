# AT-327 follow-up — Wild Zone 11 southern edge

Research only, 25 November 2026. The original Vert Sector 6 daylight crop, both Zone 11 captures and the native basemap were independently checked against their recorded Git blob and SHA-256 hashes and decoded at original resolution. All inputs were already in the Atlas. See [exact controls, source hashes and transform](ATLAS_AT327_WZ11_SOUTH_EDGE_CHECK.json).

## Architecture-based comparison

Fit an affine transform from the Vert 6 crop onto the native 1920 × 1920 map using eight distributed manual picks on pond and roof geometry south of the zone. No green edge, gate, landmark icon, red overlay or UI feature was fitted. Fit RMS: **1.24 native px**. Six withheld points yielded **1.96 px RMS**, **3.09 px worst**. Four were extra corners on known shapes; the other two were a separate roof below the western bank (0.83 px) and the west end of the southern bridge abutment (1.49 px), both excluded from the fit. Metrics measure image agreement around approximate picks; they are not a bound on world position or boundary precision.

Reviewed the aligned daylight crop, native basemap, and earlier Zone 11 overview/close-up alignments side by side. The daylight view shows the green line without the red overlay across the west stepped approach, the bank around the central bridge, and the stepped bank toward the eastern gate. The approach to the west gate and parts of the east gate are visible, but the crop clips northern/upper gate detail. The older overview has a travel prompt; both old frames show the red overlay near the same southern span. The red line is not the green zone boundary. The apparent bridge on the map does not establish traversal.

No public geometry, route, exact coordinates, live-site change or player-data change. The south-edge ambiguity is narrowed for the visible spans only; the full Zone 11 perimeter and independent checks on its other sides are still open. Existing photographs suffice for this check; no fresh capture needed.
