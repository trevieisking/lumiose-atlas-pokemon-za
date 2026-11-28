# AT-348 A2-02 — Early Wild Zone capture enrichment

Date: 2026-11-28. Manifest 119 / joint ledger 127. Draft PR #229, reviewed parent 07894fc47ccee47bdfd59a07e297e2c355b3fd99.

## Scope and evidence

The owner clarified that correct existing information is to be retained; the principal task is filling omissions page by page. This slice independently researched Wild Zones 1–6 using Serebii's individual Wild Zone encounter tables and Alpha availability guide, Bulbapedia's location/Alpha and clock information, and published written location guides including VGC and Pokémon GO Hub. Individual claim URLs and qualifications are stored on the condition/Alpha records. These are source-qualified written findings, not new owner field verification.

- 39 ordinary and 11 fixed Alpha existing encounter records receive additive missing detail.
- 38 additional chance Alpha records are added alongside the six existing records; chance is not a guaranteed spawn or an area-wide visit probability.
- Conditions include normal/fixed/chance level bands where supported, time, qualified weather, floor/elevation where supported, access/unlock, written route and respawn guidance.
- Source conflicts remain qualified, including Zone 3 flower/time claims, Zone 4 Patrat daytime reports and Zone 6 fixed Alpha Pikachu time. Unknown floor or weather is not replaced with invented certainty. Additional encounter leads and unresolved form research remain open.

## Implementation and preservation

`atlas-area-condition-evidence.json` augments exact existing area/species/form/class/record IDs; it cannot create habitat membership or geometry. The original 748-claim area evidence remains unchanged. `atlas-area-alpha-evidence.json` retains the prior six rows and includes 38 additional chance Alpha rows. The shared model validates source links and identity, retains existing non-null conditions and notes conflicts. Pokédex and map cards consume the same enrichment. All existing map outlines, original photos, routes, IDs, saved progress and Supabase connections are preserved. No new fixed map coordinates or random distortion pins.

Regression tests cover supplement identity, preserved original rows/geometry, malformed data rejection, chance Alpha distinctions, and matching Staryu map/Pokédex conditions. New-head CI and visual verification are pending. Previous parent articles and Pages workflows succeeded; Explorer was still running when inspected. No claim of full guide correctness or release approval.

## Remaining work

Continue zones 7–20, city and interiors, every form, alternative acquisition, exact access and map evidence, and standalone Alpha/Hyperspace projection. Continue the 46-surface page register, enriching story, side missions and other guides without removing correct content. Do not conflate this six-zone research slice with completion of any entire page. GitHub first, full exact-head checks and desktop/mobile visual verification before merge and GitHub live verification; Workspace v40 remains last recorded live, with no new import or publication authorized. Decision HOLD.
