# AT-340 — verified consolidation and release boundary

26 November 2026 · Plan `ATLAS-MAPS-2026-11-21-V1` · Manifest 86 · Ledger 94

## Decision and scope

This is one consolidated candidate for the verified improvements accumulated across the open Atlas PRs. Its starting main is `d7021a7af3973f18d54d07634e29c23cc78b0560`; the recovered shared-area source is PR202 head `426aa3b71814b560a42939e9a7cc8304fb4a454d`. The assistant makes the bounded promotion decision after the final combined head passes the checks below. The PR's release receipt must record its actual reviewed head/tree, merge, deployment and live checks; this document does not pre-certify those future events.

**Full master-plan completion remains HOLD.** Five reviewed Wild Zone map-selection outlines are available, while 63 required boundaries and all 68 comprehensive encounter reviews remain open. A working search interface and attributed encounter rows do not resolve those evidence gaps. The full-scope approved SHA and executable Workspace publication prompt remain null. These are existing requirements, not new approval steps for the owner.

## What is brought together

- Shared area/species search, habitats, filters, selection, deep links and browser history across Explorer, Maps, the sector directory and the main guide map; fieldbook and Pokédex habitat links.
- Five reviewed selection outlines for Wild Zones 02, 03, 05, 11 and 16. The other areas remain searchable with their original photographs and honest incomplete-boundary labels.
- The original 272 encounter rows plus 283 attributed claims. Encounter classes and source quality remain separate. Research leads and disputed claims do not become supported habitats.
- PR196's displayed-label and exact Wild Zone collectible search fix, preserving the existing 264 item records, 100 Screw clues and independent progress store.
- Verified salon missions 012/051, Side Mission 109 rewards and opponent levels, conservative Furfrou087 revisit guidance, the official current Vivillon gift link, and written sludge/Ice Beam guidance. [Content sources and decisions](ATLAS_CONTENT_CONSOLIDATION_2026-11-26.md).
- PR3's corroborated Main Mission 01–10 route detail: 30 steps become 73, with current mission IDs, practical notes, later missions and progress/navigation preserved. Conflicting exact Pidgey level and TM051 reward claims are omitted. [Per-mission evidence and preservation check](ATLAS_PR003_EARLY_STORY_RECONCILIATION_2026-11-26.md).
- Original Wild Zone 14/18 photograph observations and the preserved WZ04 candidate packet. The WZ04 outline remains HOLD and has no production geometry. [Independent geometry audit](ATLAS_RELEASE_GEOMETRY_AUDIT_2026-11-26.md).

The [25-PR disposition record](ATLAS_AT340_PR_DISPOSITIONS.json) preserves exact source heads, branches, unique evidence, selective integration and deferred work. The older 19-PR consolidation snapshot stays intact as historical evidence. Source branches are not deleted.

## Confirmed defects repaired during independent review

1. A disputed ordinary encounter could reappear as a supported habitat through the older class-unresolved roster. Gastly/WZ7, Trevenant/WZ15 and Noibat/WZ15 now remain disputed in default and recorded filters. Separate supported Mawile/Banette fixed Alpha rows remain available.
2. Selecting a Holovator after the shared model loaded left the older area selected. A boundary/filter rerender could replace the chosen photographs. Explicit access selection now clears that stale area context and preserves its route cursor and original photo nodes.
3. Evidence controls created external or raw Markdown navigation. Attribution remains visible and full URLs remain in the evidence records; player links stay within published Atlas guides/photos.
4. The main map copy overstated approximate markers and raw heights as exact pickup/floor information. It now describes zone orientation and item search clues. No coordinate or height data was changed.
5. Two browser assertions expected unpadded zone names. They now assert the canonical `Wild Zone 01` / `Wild Zone 02` labels while retaining independent `wz-01` / `wz-02` checks.

## Preservation and validation contract

Preserve original image bytes, map assets, all existing markers/coordinates, stable area/mission/item/Screw identities, route controls and cursor, saved progress, accounts, Supabase integration, feedback, navigation, touch/desktop gestures and the original Site. No new exact pickup position, floor, spawn extent or physical route is inferred. No videos, YouTube or paused media controls are restored.

The combined candidate must pass:

- The full existing Node test set, static/local-link validation, source/generated parity and owner-image byte checks.
- Exact-head GitHub CI, including the original Explorer, collectible and 20-zone photo suites plus shared-area browser tests on phone and desktop. New regressions cover disputed default habitats, loaded Holovator selection, photo identity, route cursor and local source navigation.
- Actual screenshot review for the affected maps and guide views; no material console, overflow, missing-image or progress regression.
- A fresh main/head review immediately before an expected-head merge, then verification of the exact Pages deployment and live bytes/behavior. Keep the reviewed tree and deployed merge distinct in the receipt.

Local combined-candidate checks completed before publication: **126 Node tests passed**, static validation passed for 17 sections / 647 page links / 1,431 image-script references / 578 captured resources, all eight original owner-crop byte and registration checks passed, generated `index.html` reproduced exactly, and `git diff --check` passed. Independent geometry/preservation review found no remaining must-fix issue in its bounded scope. Final GitHub browser CI, actual screenshots and deployment checks remain separate required release evidence.

Passing software tests verifies behavior and preservation. It does not establish unreviewed game geography or complete encounter rosters.

## Original Workspace and remaining work

The original Site is `appgprj_6afda588d5948191b4143e40a1f9c291`, at `https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site`. Fresh metadata in this review still shows version37. This PR does not publish to that Site or establish automatic GitHub synchronization.

Complete the remaining source-backed boundaries and comprehensive encounter reviews using the retained images/research, then finish full-scope G5. The eventual single Workspace prompt must pin the actual approved full release and follow [the original source handoff](../../WORKSPACE_ACCESS_HANDOFF.md): fresh source access, checkpoint, compatible bounded adaptation, progress/Supabase preservation, an isolated preview, publication on the same project/URL, and independent live checks. No new technical decision is delegated to the owner.

Optional backup/numbering, branding/DNS, wider guide-depth and fashion/economy ideas retain their existing recorded status; archived proposals are not marked implemented. A complete physical pickup survey and exhaustive ladder/scaffold inventory are not new release conditions.

## Rollback

Use the actual consolidation merge recorded in the PR receipt. A reviewed revert of that merge restores the preceding main tree without rewriting history; the verified pre-consolidation main is `d7021a7af3973f18d54d07634e29c23cc78b0560`. Re-run the affected checks and verify the reverted Pages deployment. No player storage migration, database schema change or original Workspace write is part of this release.
