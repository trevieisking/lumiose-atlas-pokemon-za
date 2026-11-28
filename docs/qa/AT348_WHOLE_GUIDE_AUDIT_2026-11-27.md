# AT-348 — Whole-guide source audit and new field evidence (27 November 2026)

## Scope and exact baseline

Main bdfce92bfa7324517d0a1e2f8db7eec84983eefb; active integration PR229 reviewed at 7df9ba0d86377153f0ef77c7882efd9dc32b9c7e; field evidence PR226 at d0033600d3f3414aaf9b3abcc2d7d7606bdd4bab. Read all 26 standalone HTML sources and all 17 editable homepage sections (the generated index was too large to retrieve directly), plus relevant data, evidence and code. Repository tree inventory: 1,987 paths. No missing static local file targets found in that scan. This is not exhaustive claim-by-claim independent verification, rendered-image QA, fresh live browser testing, or actual Workspace readback. Last recorded original Site v40; v41 not verified.

Exact reviewed PR229 head passed article workflow 46034741732 and Explorer workflow 46034741717; PR226 head passed 46064540604 and 46064540487. These results are tied to those heads only. The planning checkpoint and subsequent runtime repairs require their own checks.

## Findings and acceptance queue

| ID | Area | Finding | Next action / acceptance |
|---|---|---|---|
| A1-01 | Explorer Holovator photographs | Confirmed source defect: atlas-explorer.js uses item.photos.slice(0,8). rouge5-looker has 10 registered photos; final two are hidden. | Remove unjustified limit in scoped repair; preserve gallery behavior; verify all 10 links and actual mobile/desktop display. |
| A1-02 | Wild Zone originals | Interrupted Workspace report identifies three reduced views requiring full-resolution links; exact mapping not independently established here. | Match eight original archived images by hash; identify three mappings; check build output and display. No guessed assignment. |
| A1-03 | All guide imagery | Static file targets present; does not prove image identity, crop, visibility, dynamic references or deployment. | Check all dynamic galleries and rendered paths, wrong/duplicate associations, actual mobile/desktop output. |
| A3-01 | Collectibles | PR226 contains 201 photos for 40 finds and one access survey. [Headbutt](https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/c1ef6d1b6ad9b3c87198b15a137a766e6605628e/docs/field-guides/collectible-locations.md#headbutt--vert-sector-5-canal-side-walkway) adds a confirmed canal-side pickup behind two boulders in Vert Sector 5. | Reconcile reviewed field package with #229, match existing item IDs before new progress keys, no duplicate copies, no guessed pins. |
| A3-02 | Access | Aerial Ace: building near Alpha Litleo; Dragon Pulse: Rust Syndicate rooftop; Flip Turn: Holovator → ladder → bridge, not stairs; Roar: NPC battle unlock, lift, turn left. | Preserve firsthand directions and qualify unverified entry/floor/coordinates. Link matching existing access features and verified item records. |
| A3-03 | Scaffolds and screws | Bleu Sector 6 survey, Vert 1, Café Gallant and Racine scaffold evidence; five confirmed-category screw finds but canonical numbers unresolved. | Trace only verified geometry, reconcile AR-B06-01 and existing Screw/route IDs; separate approach, access, floor, position and prerequisite. |
| A3-04 | Native grid | Reference grid is measured against native image; new player arrows are not exact pickup coordinates. Physical 60-unit interpretation unverified. | Register each source using visible landmarks/crosses and holdouts, retain uncertainty; require independent identity, floor, route and source checks before fixed pins. |
| A2-01 | Three Pokédexes | 232 Lumiose + 132 Hyperspace; Alpha index: 224 indexed routes, 25 listed unavailable, 115 further indexing. | Complete source-qualified encounter/form/condition/stat/learnset coverage; do not label unindexed species unobtainable. |
| A5-01 | Challenges | SM144, SM173, Photo Mode and 27-fight Rogue Mega Rush corrections present in #229; reviewed head tests passed. | Retain both mission surfaces and regressions; complete remaining city service/track/title/repeat conditions. |
| A7-01 | Main and journey | Previous Canari password, Galette, grandfather battle, Josee mastery and sewer investigation directions retained. | Review all 42 story missions and cross-surface consistency, 203 side mission entries, 14 DLC missions, travel prerequisites and missing route details. |
| A7-02 | Metadata | Coverage/readme and planning records contain historical or outdated current wording. | Update current-facing status and provenance without overwriting prior receipts. |
| A6-01 | Completion | Original progress keys and checklists retained; unified tracker and safe backup/import still open. | Adapt applicable older #4/#5 only after review; no destructive progress changes. |
| A8-01 | Publication | Two reviewed draft heads passed relevant CI; no new release established. | Integrated exact-head tests, mobile/desktop review, GitHub Pages verification, single same-Site Workspace prompt and independent publish proof. |

### Gallery defect proof

Existing entry rouge5-looker, Looker Bureau / Sushi High Roller, has 10 photos. Hidden paths:
- assets/atlas/holovators/rouge5-looker-sushi-high-roller/alternates/holovator-rouge5-looker-sushi-wide-city-map-revisit.jpg
- assets/atlas/holovators/rouge5-looker-sushi-high-roller/alternates/holovator-rouge5-looker-sushi-rooftop-arrival-revisit.jpg

These files are already present; no re-upload needed. Removing the display cap is proposed, not completed by this document.

### Field-evidence inventory

16 TMs, 18 other items/Poké Balls, five Colorful Screws; one infrastructure-only survey. 35 clear pickup screenshots, two contributor-identified finds (Hyper Potion, Swift) without final pickup screenshot, one partial pickup name (Dazzling Gleam), one obscured notification (Café Gallant Screw). All 196 paths are present and organised in PR226. Thirteen zone TM records are crosswalk candidates against the existing zone item ledger, not approved canonical assignments: Work Up, Swift, Aerial Ace, Fire Spin, Bullet Seed, Water Pulse, Dazzling Gleam, Rock Tomb, Power-Up Punch, Night Slash, Psychic, Ice Beam and X-Scissor. Dragon Pulse, Flip Turn and Roar are separate city rooftop finds. Match numbered TM identity and physical location to source before updating checklists; do not add duplicate progress keys. No exact coordinates approved.

## Page coverage matrix

All rows below were source-inspected; factual status remains bounded. Existing reference data is preserved pending claim-specific verification.

| Surface | Result / remaining verification |
|---|---|
| Homepage / overview | Update current coverage/navigation summaries, retain progress. |
| Walkthrough (standalone + source) | Earlier fixes retained; all 42 missions need final factual review. |
| Journey | Consistency with story and new access evidence. |
| Side missions (standalone + source) | 203 records; SM144 and SM173 corrections staged in #229. |
| Mega Dimension (standalone + source) | 14 missions; check prerequisite and time/portal instructions. |
| Boss guide (standalone + source) | Retain tactics; staged 27-fight Rush order, verify individual encounters. |
| Royale guide | Canari quiz, galette, grandfather battle present; verify remaining rank routes. |
| Pokédex (homepage) | 232 + 132 entries; all forms/acquisition details not exhaustive. |
| Alpha fieldbook (standalone + source) | 364 index; 115 further route entries outstanding. |
| Maps (standalone + source) | 20 zones/48 sectors; connect new evidence without guessed markers. |
| Explorer | A1-01 confirmed gallery defect; validate interactions. |
| Sector maps | Existing wider photo views; verify framing and new access links. |
| Hyperspace maps | Keep dynamic/random distortions out of permanent pins. |
| Item Atlas (standalone + source) | 264 existing rows; photo crosswalk pending. |
| Colorful Screws (same item pages) | 100 existing clues; five new field finds, canonical matching pending. |
| Legendary fieldbook (standalone + source) | Verify Special Scan earned threshold vs cost wording, encounter prerequisites. |
| Berry book (homepage) | Review donut scores, energy, powers and calculations. |
| Starters (homepage) | Existing trio and HOME Alpha gift; verify stats/conditions. |
| HOME | Preserve 364 roster; 230/131 completion requirements plus Mega catalogue; verify portrait coverage and gifts. |
| Mable research | Reward table present; independently reconcile each reward. |
| Shiny hunting | Retain odds calculator, verify reset/persistence and DLC effects. |
| Shops | Existing berry truck/treasure data; complete stock, prices and unlocks. |
| Clothing | 41 boutiques; full inventory/colour/price coverage open. |
| Hair and beauty | Five salons; visual swatches and unlocks open. |
| City Life | Existing 17 cafés/133 menu entries, services and challenges; unresolved conditions remain. |
| Rewards (standalone + source) | Reverify gift availability/expiry as of release date. |
| Battles (standalone + source) | Dated season information; refresh at release. |
| Type chart | Preserve 18×18 table; independently verify if changed. |
| Essentials (homepage) | Expand movement/access prerequisites where verified. |
| Secrets (homepage) | Add evidence links and clarify rooftop techniques. |
| Sources (homepage) | Update provenance and distinguish source-qualified evidence. |
| Coverage | Correct stale statements, track verified vs unresolved. |
| Feedback / owner inbox | No new defect established; no change authorized. |

## Safe order and gate

A1 gallery/photo repair first; A3 field evidence and vertical routes next; A2 Pokédex; A7 factual synchronization; A4/A5 remaining shop/service/mechanic coverage; A6 progress safeguards; A8 final acceptance. Record every slice in both master plans, joint manifest, ledger, register and Workspace handoff inventory. Keep one integration PR plus ongoing evidence intake, not duplicate implementation PRs. No runtime modification, database change or publication is performed by this planning report.
