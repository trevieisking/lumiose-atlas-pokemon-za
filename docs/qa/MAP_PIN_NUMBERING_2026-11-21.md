# Map pin numbering and tick-chart reconciliation — 21 November 2026

**Status:** Implemented on a dependent review branch; this document does not certify map coordinates against screenshots or exact in-game altitudes.

## What the recovery actually contains
- 20 Wild Zones with recorded map overlays in the story walkthrough.
- 146 **distinct** original item map pin IDs; some are repeated on both city and close-up maps. Repeat appearances have been deduplicated.
- 264 original item checklist entries across 20 zones; preserve every existing data-pickup ID and all saved progress.
- 111 **unique one-to-one name** matches between a map item and a single item checklist entry within the same zone.
- 35 recorded pins that have matching *names* in checklist items but cannot be assigned to a unique checkbox without guessing, often because repeated items share the same name.
- Examples: Zone 1 contains 8 mapped pins but 11 checklist entries; Zone 20 has 4 recorded pins but 66 checklist entries including chance-based loot. Do not invent pins for the excess.

## Interaction design
1. Every recorded pin is labelled #01, #02, ... **within its own Wild Zone** on the central city map, story mission overlays and enlarged close-ups.
2. Selecting a Wild Zone shows a **matching numbered mapped-pickup tick list**; each row can be ticked or used to locate its numbered pin.
3. Every original checklist row is visibly numbered **Item 01, Item 02, ...**. An additional **Map #NN** badge is shown only when a single original map pin can be uniquely linked to that checkbox.
4. When a mapped row has a unique match, ticking it updates the original stored checkbox ID. Ticking the original checkbox likewise updates the map row; repeated instances of that checkbox within mission cards stay visually synchronized.
5. For ambiguous matches, map pins have a **separate local-only checkbox** under the storage key \`lumiose-atlas-mapped-pins-v1\`. They are clearly labelled *match unverified*, not represented as a definite existing checklist entry.
6. Each pin retains its original title/name, source map coordinate, source ID and approximate-position warning. The map map-view overlay only shows the selected zone to avoid overcrowding; the rest of the zone centres remain selectable.
7. Original images, map positions, 42 mission cards, 203 side/EX cards, 232 saved Pokédex cards, Supabase, domain settings and original ChatGPT Site are **unchanged**.
8. Old source checkboxes keep their identifiers: \`data-pickup="zone-row"\`. This change is not a database migration.

## QA
- Source-based pin coverage: 146/146 indexed, 20/20 zones, 111 confident matches, 35 explicit uncertain matches.
- Local JavaScript syntax check passed, and a Chromium interaction test over the recovered page confirmed Zone 1 has 8 numbered map pins and rows; Zone 2 has 4; linked item checkbox sync works; Zone 20 has 4.
- Desktop and mobile static renders show no page JavaScript errors.
- **Still required:** branch-specific full browser/device checks, visual collision review for crowded zones, verify floor/roof coordinates in actual gameplay and confirm integration with draft PR #3 before publication.

## Maintenance rule
- \`map-pin-index.js\` is the canonical list for stable zone-local map numbers. New items get a new ID and the next unused number in their zone; do not silently reorder existing IDs.
- Locations without verified evidence stay approximate. The 35 uncertain original checklist associations should be verified from gameplay before changing their match state.
- This work depends on PR #3 (cross-linked story sections) and must not overwrite it. Review branch separately and merge only after QA.

## Ownership and hosting
Lumiose Atlas is a Stream Bandit gaming guide under Chatterfriends. No Render hosting. The existing Stream Bandit Supabase database is not changed by this map UI feature.
