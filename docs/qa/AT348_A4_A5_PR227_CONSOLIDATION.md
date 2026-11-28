# AT-348 — Consolidate the remaining PR227 delta

28 November 2026. Owner confirms #229 is the only guide integration/release candidate; #226 stays open for new original photographs. At exact parent `bb9fbb259725bacb636f4523e13eb3eedba42c67` all three workflows passed (46167351285, 46167351292, 46167351328), including Jaune 5, compact layers, rotation and all 20 Wild Zone views. Reconcile #227's six later commits (`4c68ff1bec5534190872b9227894bc6eed017170` → `153c6ad8f4841c927b4391739f766bf6f958137c`): 14 exact non-overlapping source blobs plus a scoped replacement of the generated homepage's one existing side-mission section, preserving all unrelated homepage changes and progress keys. 17 mission cards synchronized; City Life training, restaurant and Poké Ball recovery, shop prices/café provenance, Floette routes and DLC fashion/hairstyle unlocks, and their regression tests. Conflicting price/unlock evidence retained in source notes; no claim of independent full factual or visual review. No map/photo/progress/backend changes. New-head CI and independent visuals pending. Verify new exact-head CI and independent phone/desktop previews; continue A2 P0 Wild Zones 17–20, city/interiors, forms, alternatives, Alpha and Hyperspace; A4/A5 remaining factual coverage; A7 all 46 surfaces; A6 safe adaptations of #4/#5. GitHub first; no Workspace import or publication. HOLD.

## Exact source preservation

- Existing active branch: PR #229; reviewed parent `bb9fbb259725bacb636f4523e13eb3eedba42c67`; original main and Workspace last recorded v40 unchanged.
- Source PR #227 reviewed head `153c6ad8f4841c927b4391739f766bf6f958137c`, source CI 46072694188 and 46072694200. The six-commit delta after the earlier imported source changes only the 15 listed files. Fourteen paths match the earlier imported blob exactly on the current candidate; copy only their reviewed newer blobs. `index.html` is newer on #229: reconstruct by substituting the exact old `src/sections/sidequests.html` once with the reviewed new section. The same operation reproduces #227's index byte-for-byte. Verified unchanged ordered `data-side-check` keys in the section and generated index. No whole stale branch replay.
- Updated mission cards: 25, 29, 51, 60, 73, 94, 151–155, 176, 181–185. Source register, rendered City Life and shop data, standalone/generated quest surfaces and existing regression tests move together. No map geometry, images, player keys or Supabase changes.
- Source notes retain competing Sharpedonite prices, Hyper Training unlock accounts, EV reset timing, and unknown photographed café branch. Additional independent checks: https://pokejungle.net/pokemon-legends-z-a/mega-stone-location-guide/ and https://www.pokemon-france.com/en/guides/pokemon-legends-z-a/mega-stones/ support 180 shards; https://bulbapedia.bulbagarden.net/wiki/Lost_Pok%C3%A9_Ball_collector confirms same-type clean misses and orange speech bubble; https://www.pokemon-france.com/en/guides/pokemon-legends-z-a/wild-zones/ corroborates orange Floette Lv. 20–22 at Zone 7. Prior source note documents the rest of this bounded intake: [AT-347 follow-up](at347-content-coverage/CHALLENGE_FOLLOW_UP_2026-11-27.md). No claim that every fact has been independently field-tested.

## Files

- `clothing-guide.html`
- `docs/qa/at347-content-coverage/CHALLENGE_FOLLOW_UP_2026-11-27.md`
- `docs/qa/at347-content-coverage/WORKSPACE_PLANNING_BRIEF.md`
- `game-content-data.json`
- `game-content.html`
- `hair-beauty-guide.html`
- `index.html`
- `shops-data.js`
- `shops.html`
- `side-missions.html`
- `src/sections/sidequests.html`
- `tests/fashion_guides.test.mjs`
- `tests/game_content.test.mjs`
- `tests/shops_recovered.test.mjs`
- `tests/side_missions_index.test.mjs`

## Gates

Parent CI green; new candidate requires exact-head CI and independent desktop/mobile screenshot inspection. Original photographs remain unchanged. All 24 older heads retain their recorded reconciliation; #4/#5 need adaptation; #226 remains separate. No live release or Workspace action. Do not close old PRs before their applicable work and evidence are safely accounted for.
