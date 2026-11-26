# AT341 independent runtime and encounter review

Date: 26 November 2026. Review base: `cffbf6077682e2c1cfacad2603e7d9c6a94147ef`. Runtime implementation reviewed: `37796f5451de1398083da7f4e3500cd562066b32`. Integrated data checkpoint reviewed: `e19c8555ec0b1382f61c834e73b088e14c5fbbfb`.

**Decision: approve the scoped runtime/content integration. No must-fix issue was found.** This is an independent code, source-disposition and preservation review. It does not substitute for the release owner's final exact-head browser/CI results or approve an unreviewed boundary.

## Concrete findings

| Reviewed code at the committed checkpoint | Finding |
| --- | --- |
| `atlas-area-model.mjs`, lines 129–135 | Related-area entries are limited to valid Wild Zone IDs, reject self links, duplicates, unknown relationship values and empty/oversized notes, and copy the accepted values into the immutable model. They do not append encounters, change evidence status or populate species habitat membership. |
| `atlas-area-ui.mjs`, lines 102–115 | Named-sector source footprints receive distinct wording about projected area and possible height overlap. The related-area note uses text content and its button calls the existing validated area-selection path. It does not build a URL from source text or create an encounter. |
| `atlas-area-ui.mjs`, lines 117–131 and 160–166 | Original guide/photo links remain present. Related navigation follows the existing selection, filter reconciliation, history and focus behavior. Incompatible district/class/query filters are cleared through the established path. |
| `atlas-area-ui.mjs`, lines 182–194 | Existing drag, multitouch, cancellation and collectible-control exclusions are retained. Multiple visible footprint hits still require a choice. The new scroll call brings that chooser into view without selecting the first/nearest area. |
| `atlas-explorer-geometry.mjs`, lines 80–90 | `frameBoundary` fits the actual polygon or multipolygon points in the current rotation and applies the existing camera constraints. It changes viewport state, never source coordinates or saved centres. |
| `atlas-explorer.js`, lines 627–658 | The existing `syncSelection`/`selectRecord` path continues to populate original photographs and guide/route controls. Reviewed-area focus changes the camera; unreviewed areas retain their original fallback. |
| `atlas-area.css`, lines 45–49 | Existing sector and Wild Zone stroke colours agree with the new purple/blue legend. The SVG remains pointer-transparent; the existing event host handles selection. |

The actual combined model was built independently: **68 areas, 1,020 encounter rows, zero model issues**. Exactly the three intended sector relationships survive normalization, and their arrays are frozen. Their direct encounter counts remain **1 /0 /0**. Selecting Bellsprout in Bleu Sector 2, Staryu in Bleu Sector 10 or Carbink in Magenta Sector 5 does not gain a sector habitat from the relationship; the existing Bellsprout source lead remains separately available.

The camera calculation was exercised against all **57 actual approved geometries** at viewports `320×430`, `360×640`, `768×500` and `1100×650`, and rotations `0, 15, 45, 90, 120, 180, 270, 345` degrees. Across **1,824 cases**, no projected boundary point was clipped or nonfinite. This is a targeted check of the new framing behavior, not a synthetic boundary approval.

## Original behavior and data preservation

Direct committed-byte comparison against the review base confirms that `atlas-explorer-data.json`, `wild-zone-fieldbook.mjs`, `atlas-guide-links.mjs`, `atlas-collectibles.mjs`, `atlas-collectibles-ui.mjs`, `atlas-collectibles-data.json`, `atlas-area.css` and the native `maps/lumiose-game-map.jpg` are unchanged. All 68 area identities and all **748 additive encounter objects** are unchanged. The model retains all **272 original fieldbook rows**, including **38 fixed Alpha rows** and the **67 rotating candidates**, with Wild Zone 20's **15 ordinary species** kept distinct.

The updated sector-photo descriptions qualify what is derived from a photograph instead of claiming that separately reviewed source geometry does not exist. Original image sources, full-resolution links, directory selections and access-route data remain on the established paths. The three static guide-card insertions have their own exact preservation checks in `sector-wild-zone-crossrefs-2026-11-26/amendments.json`.

## Final encounter disposition under the original G3 criterion

The original acceptance requires searchable area encounters with conditions, form, time, weather, floor, unlock and class **where established**, preservation of the Alpha distinctions, and resolution **or explicit labelling** of the named disputes. It does not require certification of a complete all-class game inventory or exhaustive absence proof.

The retained evidence provides a disposition for all **68 areas**: 45 named-sector table reviews, three scoped related Wild Zone guides, and 20 documented Wild Zone comparisons. The three related guides are now represented in the shared model and rendering code. Leads remain leads; disputed ordinary/class/area claims remain visibly qualified and do not authorize habitat highlights. WZ19's sourced morning/night and Rank B conditions remain explicit, and its ordinary Drampa is not promoted to a guaranteed Alpha. Missing optional conditions stay unknown rather than becoming unrestricted claims. The `not_comprehensive` roster flags are consistent with this finite review disposition.

**The encounter-review portion of G3 is satisfactory for this defined scope.** At this exact checkpoint, geometry coverage is separately **57/68**; the remaining eleven outline approvals and the full release gates still require their own evidence. This receipt neither changes those gates nor marks the master plan complete.

## Exact committed-file pins

| File | SHA-256 at `e19c8555ec0b1382f61c834e73b088e14c5fbbfb` |
| --- | --- |
| `atlas-area-model.mjs` | `d92a72823e01e68e586c947d87dd8761d09a8eb260d32f0ff0691a6579f0ce90` |
| `atlas-area-ui.mjs` | `c7803a059df81b542c4585f77dd6e79049604e4196b966eaa676b7d67ee84aad` |
| `atlas-explorer-geometry.mjs` | `e39bf63a78b1263d70ec04a5dcd8932a118e3b5cf0a0463f7a242e88ce5fd71a` |
| `atlas-explorer.js` | `efabe145db34b54f8ca4fa93ba64a3d0863565522b21daecba65c6aef5857562` |
| `sector-maps.js` | `c441eace80db8a7f816e488b60b3278d26b208262fc97a39e709d44da907c85f` |
| `atlas-area-evidence.json` | `e5a7a382e394842636aee8e06476b90026ab68a6976c46bee9b3050cdcc7bc64` |
| `sector-maps.html` | `3efd2e59f6528aa7e27f77d777a366069c37c5dfbdda9e4d58bd74556d619696` |
| `atlas-explorer-data.json` | `21b1b37838890442855be2337acfeeca4a8225e139f4e7d92cfe5f9cc2d8869f` |
| `wild-zone-fieldbook.mjs` | `6c72e4a2ef5f0c4a95be2da7a50a25793ca2dc5c9602eb193d865f53556b6e2d` |

The release owner was concurrently adding related-link browser coverage and a viewport-scroll call after area focus. Those working changes are outside the committed hashes above; no test-pass claim is made for them here. No runtime file was edited by this reviewer and no broad browser/Node suite was rerun. The independent source verification is retained in `ATLAS_CONCURRENT_ENCOUNTER_AMENDMENT_INDEPENDENT_REVIEW_2026-11-26.md` and the three-sector cross-reference packet.
