# AT-267 — every part of Lumiose map is navigable (22 November 2026)

**Scope:** independent GitHub Pages Edition B, bounded source-aligned feature branch `feat/atlas-at267-whole-lumiose-map-coverage-20261122`; original ChatGPT Workspace Edition A remains read-only/unmodified. No Supabase, feedback, item or Screw checklist, save data, map image or coordinate baseline changes.

## Baseline audit
- Existing main GitHub Atlas source map `maps/lumiose-game-map.jpg` is 1920 × 1920; existing `atlas-explorer.html` supports pinch/drag/rotation, layers, 20 Wild Zone centres, 21 approximate owner-Holovator leads (111 authentic JPEGs), one ladder ground lead and 48 named sector records.
- Sectors are individually searchable, but all 48 have `xy: null`. Previously selecting an unpinned sector did not move the map, creating the impression that its area was missing. The old `sector-maps.html` gives all 48 sector notes but lacked per-sector jump links to the interactive map.
- `maps.html` focuses on 20 Wild Zones, so direct access to the 48-sector map room was under-prominent. Existing enlarged source-image crops are **not** evidence of additional exact detail.

## Bounded AT-267 solution
1. Insert a 5×5 thumbnail navigation grid over the **unchanged original map image**. All 25 buttons map mathematically to equal subdivisions of `[0,1920]×[0,1920]` and open the actual original image centred on the selected cell at a closer zoom. Full original image remains continuously pannable and zoomable; cells are NOT sector polygons, routes, rooftop access or precise item pins.
2. Provide five district-start jump buttons. Their approximate camera centres are the arithmetic means of the already-preserved Wild Zone centres attributed to that district; nothing is committed as a real sector, landmark or lift coordinate.
3. Add a list of all 48 real sector names from the unchanged `atlas-explorer-data.json`. Each sector selects the matching district-start frame with a conspicuous "NOT a verified sector centre" explanation. Clicking a sector result now also opens that district view. Preserve all 48 `xy: null`, and never render a fictitious sector pin.
4. Inject one link into each of 48 existing `sector-maps.html` cards via its non-state-mutating JS, with `atlas-explorer.html?sector=<existing sector ID>` deep link. This does not copy/paste 48 false coordinates and leaves all source HTML/checkmarks unchanged. Existing 25-link guide navigation and sector records remain in place.
5. Make the original `maps.html` top-level Map Room link clearly name the complete map and provide a direct 48-sector directory link. Keep existing 20 Wild Zone, 264 item, 100 Screw and 146 archived approximate map lead references untouched.

## Verification / release gate
- Pure unit checks: 25 unique coverage centres including four corners, source-derived district starts and missing-district handling; 48 sectors remain null for precise XY, no new permanent pins or moving Hyperspace icons.
- Existing Atlas geometry/photo/gallery/route tests (21 lift records/111 untouched JPEGs) and original sector/20-zone/item/Screw static integrity tests.
- Real Chromium desktop and phone-sized navigation checks: 25 area grid buttons, five district buttons, 48-sector dropdown, full-city reset, 48 sector-card deep links, original photo galleries, map controls, no horizontal mobile overflow, no JavaScript errors; attach inspected screenshots.
- Compare and review exact PR head SHA, changed-file list, CI and Pages deployment. **Do not merge or claim live release before these pass.** Owner physical-device verification is separate from Chrome mobile emulation.
- Outstanding [issue #28](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/28) remains **open** for genuine per-sector image detail, exact boundaries, verified item/Screw placements and ladder/scaffold routes. The 25 cells solve city *access and browsing*, not all of #28's mapping fidelity.

**Safety:** Do not touch Workspace Site, live URL, Supabase, feedback, player progress, original JPEGs, original map bytes, existing markers or moving DLC Hyperspace icons. Screenshot reuse and registration remain in separate draft AT-266 PR #97.
