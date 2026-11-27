# AT-346: generated Hyperspace routes — first Pokédex batch

## Research register

The [compact typed-route register](hyperspace-typed-route-review-v1.json) was reconstructed from the exact four pinned Git blob IDs in the [original generated audit](HYPERSPACE_GENERATED_WILD_AUDIT.md). The independent JavaScript join reproduced 500 patterns, 476 spawners, 369 encounter definitions, 2,377 rows, 328 National species and 368 species/form pairs, all original absence records and all five earlier pilot keys. The 105 Hyperspace species in those pools collapse to 202 distinct combinations of species/form, portal type, rank, ordinary and Alpha capture bands. Pattern membership is retained as research, not a player-facing chance.

Replay the original audit, then run `python3 scripts/project_hyperspace_route_review.py INPUT_DIR --output /tmp/typed-route-review.json`. Compare parsed JSON with the register. The offline projector is newly authored; execution on the pinned input files remains a release check. The source exports themselves are not copied to the Atlas repository.

## Reviewed player-facing batch

Ten species, 18 route rows, all form 0; Gimmighoul is specifically Chest Form. The source join was cross-checked with the independent published tables below. Add only these reviewed records to the existing Pokédex cards; the other 95 generated-pool species remain research-only until cross-checked. All prior 20 Fieldbook links and seven evolution notes remain. Capture levels are distinct from battle levels; do not interpret the raw Alpha field as the odds of finding a target on a visit.

- [Fighting pools](https://www.serebii.net/legendsz-a/hyperspacewildzone/fighting.shtml): Mankey (1★ and 3★), Primeape (3★), Throh and Sawk (3★), Crabrawler (1★ and 4★) and Crabominable (4★).
- [Steel pools](https://www.serebii.net/legendsz-a/hyperspacewildzone/steel.shtml): Tinkatink (2★ and 3★), Tinkatuff (3★ and 4★), Tinkaton (4★).
- [Fairy pools](https://www.serebii.net/legendsz-a/hyperspacewildzone/fairy.shtml): Tinkatuff and Tinkaton (4★).
- [Ice pools](https://www.serebii.net/legendsz-a/hyperspacewildzone/ice.shtml): Crabrawler and Crabominable (4★).
- [Ghost pools](https://www.serebii.net/legendsz-a/hyperspacewildzone/ghost.shtml) and the earlier pinned pilot: 5★ Chest Gimmighoul. Link to Special Scans and preserve the separate SM122 mission route.
- [Japanese Tinkatink entry](https://gamepedia.jp/pokemon-legends-z-a/monsters/25665) and [Japanese family rank/evolution comparison](https://gamepedia.jp/pokemon-legends-z-a/moves/1731): earliest rank thresholds 2★, 3★ and 4★ support the family progression; individual exact ranges come from the pinned join and English portal tables.

The published batch has no inferred world coordinate, fixed portal location, universal availability or full species audit. The existing roster, base cards, artwork, progress, map and pinned original Workspace handoff remain unchanged. Static tests verify exact equality of all 18 route rows to the research register and 105/27 population separation; browser assertions exercise the new cards and all prior acquisition links. Exact-head execution and visual review remain pending.
