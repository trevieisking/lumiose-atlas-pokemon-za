# AT-326 — G1 map regression repair

Baseline main `8b15a8b7afd8370291f90c846217d0aff2eef601`. This is a bounded review-branch implementation. Exact-head CI and actual screenshot review pending; do not claim deployed.

| Finding | Root cause | Correction |
|---|---|---|
| AT325-R01 | Internal map selection did not update fragment, while hash handler always reset filters. | History API syncs selected zone; only filter-clear of a valid zone hash removes it; history/explicit links restore selection without recursive history writes; external filtered-out zone resets filters only as required. Query preserved; unrelated hash never removed by filter. |
| AT325-R02 | Workflow pull_request path scope omitted maps.js and original Wild Zone photo subtree. | Include both and syntax-check maps.js; retain existing 40-PNG verification. |
| AT325-R03 | Generic first details element on #wildzone-20 points to new Alpha disclosure. | Explicit zone-records selector; original ordinary-sector and numbered map-lead selectors preserved. |

## Test plan

- Existing source/static tests unchanged in scope. Extend VM tests for exact history behaviour, unrelated/invalid anchors, filter clearing, actual intended zone panel and existing sector/map lead.
- Existing real phone and desktop fieldbook smoke exercises all original images and 20 Explorer selections. Add actual URL/query checks, history Back/Forward, reload, filtering, native share callback URL, marker click, unrelated #map-key, #wildzone-20 item disclosure, #map-lead-z20-01 and #sector-vert-sector-1.
- Inspect screenshots from exact-head run, including AT-326 Zone 20 item panel, and retain original map/fieldbook screenshot evidence.
- No source images, map data, coordinates, roster records, item/progress identifiers, database schema or feedback changes. No original Workspace edit. Separate conflicted PR #156 unchanged.

**Gate:** expected-head review, CI, screenshots, merge and exact Pages verification before calling this deployed. Full Interactive Map 2.0 handoff remains blocked by AT-325 G1–G5.

**First exact-head run (590551d97e7a07b0283afbbde2a536229b949baa):** static and unit checks passed; original browser smoke passed. New browser test failed immediately after filter input at the cached Playwright `page.url()` assertion (run 45692791625, job 139482348758, line 49). The actual in-page state was not logged, so do not assume the application passed. Revised proof requires the actual document location, cleared selection and hidden detail panels, then the client's same-document URL notification. No production change in this follow-up, no assertion removed. Full rerun required.

**Reviewed merge:** 74e36ece129433a37a9dc13d571c6f6504993ddf passed exact-head CI runs 45693885162 and 45693885482. Artifact 15059399203 retrieved and actual phone/desktop screenshot samples inspected (correct open 66-item disclosure, both photo layouts and roster panels). PR #167 merged at eb711adf56a68b05e55d335586eb6b320d340203. Exact merged tree matches reviewed runtime and tests; only AT-327 three research files are additional. Pages 45694649336 queued; direct live check not yet performed. Full G1/G5 remain incomplete.
