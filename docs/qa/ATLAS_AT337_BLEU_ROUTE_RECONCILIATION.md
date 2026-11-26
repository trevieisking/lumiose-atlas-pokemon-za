# AT-337 — current-base Bleu 7–10 written-route reconciliation

26 November 2026. Current application/documentation base: `2a3e03942d102ad283be6c749241ac0d7ba36fc6`. Source candidate: PR #156 at `a9e906cdce710a67ca960e363a087160cd08dc5d`, compared with its merge base `91e80f4bc1765981436e5c861540b422dd3487ad`.

**Released in PR191.** Exact head `553c42ff863f306fff986d5f8c957af87d21c9c9` merged as `dba74e27af1d7bdfed0795d5209b8cf38f4daf25`. CI run45737026829, all32 screenshot reviews, Pages run45737663295, eight live HTTP/hash checks and an interactive live browser spot check passed. [Complete release receipt](ATLAS_AT337_RELEASE_RECEIPT.json). The candidate-stage notes below are retained as historical evidence. This ports only the four written routes and eight research leads preserved in the [archived PR provenance](../consolidation/2026-11-26/branch-sources/pr-156/PROVENANCE.json). It does not apply the old branch wholesale. Current no-video behavior, the original 70 leads, later research and current canonical planning records remain intact. The full AT-325 release and original Workspace publication are separate gates.

## Bounded changes

| New route | Written steps | Existing orientation photographs |
| --- | ---: | --- |
| `bleu7-aymlis-roof-scaffold-courses` | 7 | `bleu7-south`, five existing owner photos |
| `bleu8-soleil-beldum-access` | 5 | `bleu8-soleil`, five existing owner photos |
| `bleu9-soleil-scaffold-roof-leads` | 6 | The same nearby Café Soleil gallery; orientation only |
| `bleu10-estival-boulevard-scaffold` | 5 | Existing sector source crop; no new photograph claimed |

The Explorer gains 23 written steps and moves from 22 to 26 routes. Eight unique research records are appended: `AR-B07-01` through `AR-B07-04`, `AR-B08-01`, `AR-B09-01`, `AR-B09-02`, and `AR-B10-01`. The access survey now has 78 leads, with partial research in 29 sectors and one Wild Zone. All 68 area rows remain; no area becomes a completed geographic survey.

Four Bleu coverage rows change from not started to a written-route candidate awaiting review. All other area rows, the first 70 leads, and the existing AT-331, AT-332, AT-334 and AT-335 evidence remain unchanged. The older branch's 65-lead register must not replace the current register.

## Source and precision limits

The [original route research](../consolidation/2026-11-26/branch-sources/pr-156/docs/qa/ATLAS_AT320_BLEU_7_10_WRITTEN_ROUTES.md) and structured sources in `MAPS_ACCESS_ROUTE_SURVEY.json` preserve the supporting references and conflicts. This port does not claim a new gameplay source audit or physical walk-through. Published route descriptions are guide cross-checks; existing game-map crops provide district orientation.

- Routes remain `district_only`. All four sector XY fields remain null, each route's `roof_exit_xy` remains null, and `known_floor_plan` remains false.
- Candidate Screw clues 48–53, 64 and 65 are retained without new collection IDs or certified one-to-one pickup assignments. All eight new lead records keep null native entrance/exit XY, null exact floor and `publish_new_pin: false`.
- The existing Bleu 7 owner lift route remains separate. No lift-to-Screw shortcut is established.
- The Café Soleil owner-photographed lift is not identified as the Mission 92 device. The route directs players to the actual in-game objective and retains the uncertainty.
- Roto-Glide guidance uses the Hotel Z rooftop tutorial/unlock state; sources attach adjacent Main Mission 15/16 numbering. No new exact mission-completion gate is invented.
- The first 22 current routes remain exactly as recorded on the current base, including removal of all 11 former video references. No channel, player, watch-link, bookmark control, map geometry, photo asset, item/Screw record, player-progress code or Supabase setting is changed.

## Candidate-stage validation and release requirements

Existing unit and browser tests are extended for the four routes, all 23 steps, 26 route choices plus the empty select option, eight unique added leads, current 78-lead/29-sector/one-zone totals, source/photo references and absence of video UI. Existing media-pause checks remain in place.

The previous PR #156 visual hold concerned blank desktop source-photo captures for Bleu 7, 9 and 10 despite positive `naturalWidth`. The candidate test now awaits `img.decode()`, two animation frames, nonzero rendered bounds and correct native dimensions, then captures both the image element and viewport. Fresh screenshots must still be visually inspected; the test change alone does not establish that this hold is resolved.

Local targeted validation and exact preservation results are recorded below. Before promotion, require fresh exact-head Atlas unit/browser checks, inspect all four source crops and route cards on phone/desktop viewports, confirm existing photo links and map controls, review the bounded diff, then use an expected-head merge and independently verify the resulting GitHub Pages deployment. Do not infer original Workspace publication from that deployment.

### Local validation receipt

The combined targeted command passed **43/43 tests**:

```text
node --test tests/atlas_explorer.test.mjs tests/atlas_guide_links.test.mjs tests/sector_map_directory.test.mjs tests/maps_recovered.test.mjs
```

`node --check tests/atlas_explorer_browser.mjs` also passed. Browser execution and visual screenshot review remain pending on the complete candidate; syntax validity is not a visual pass.

An independent semantic comparison against base `2a3e03942d102ad283be6c749241ac0d7ba36fc6` confirmed all 22 original routes and every non-route Explorer value unchanged; all 70 previous survey leads, all later research fields and the other 64 area rows unchanged; 26 unique route IDs, 78 unique lead IDs, 23 added written steps, 29 partial sector rows, one partial Wild Zone row, and zero added exact pins or collection identities. All active route media references remain absent. The source-map and owner-gallery hashes also passed the existing targeted tests.

Candidate data SHA-256: `5185c5f511ff69dc044faa1027b305a22847c2b595d9585cdcdc1c798cde8cfa`. Candidate survey SHA-256: `e879d8484d24b6140181016998da137f2ab64a4fb28a29801c17fe2c5d7e5bc0`. These identify this local validation checkpoint, not a deployed release. No commit, staging, GitHub mutation, deployment or original Workspace change was performed by this bounded port.
