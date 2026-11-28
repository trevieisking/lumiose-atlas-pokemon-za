# AT-348 A2-15 — Official-source baseline, interior capture routes and Alpha parity repair

28 November 2026. Manifest 142 / Joint Ledger 150. Parent 9d9be9148fe4817ce17d14c3e75e832b44286225. PR229 only; PR226 remains open for owner photos.

## Source authority

Official Nintendo and Pokémon materials take priority for version, features, connectivity, rules, distributions and support. Nintendo Life and other guide sites supply specific game-data evidence when official public pages do not enumerate those details. Owner screenshots corroborate positions and access, not every spawn's weather/time. Use original English descriptions and existing evidence only. No unauthorised third-party artwork, video links or guessed coordinates.

## Official claims implemented

- Nintendo UK Support: game version 2.0.2, released 19 March 2026; console update steps, previous 2.0.1 increased Mega Shards to 9,999, bulk berry buying, DLC-start Café Truck 3 berry access, sunny-weather bug fix and Side Mission 188 recovery by entering/exiting Hyperspace. Applied in Essentials, the two SM188 surfaces and shops; the existing berry guide already had the Café update.
- Nintendo 2.0.0 confirms that some DLC-added Pokémon can be obtained via communication features without buying the expansion; not paid-story access. Clarify HOME.
- Pokémon HOME's official connectivity page describes four Z-A-origin species eligible for the respective Mega Stones in Champions. These are Champions rewards, not additional Z-A items. Current promotion availability must be checked in Champions. Existing HOME one-way warning, 364 IDs and all checkboxes retained.
- Official gameplay/adventure pages confirm stealth, weakening and catching, Alpha behaviour, and core exploration. Official DLC site confirms post-story expansion. Existing guides retained.

## Interior guidance

Existing base-dex cards now display individual alternate interior catch levels and styled links into the existing Alpha fieldbook: 24 species, 30 links. The main sewers (Bleu Sector 7 fountain/Ice Beam during MM19, later Bleu Sector 1 gate) list 11 ordinary species with source-attributed normal/chance Alpha ranges. Canal Access (MM20, Magenta/Saison Canal) four ordinary species with distinct levels and chance bands; Klefki repeatability disputed. The Old Building (entrance Bleu 9, building Bleu 8) mission battle contains one Gastly Lv40 and two Gengar Lv42, reported catchable. Preserve owner Rare Candy and Taunt routes and photo anchors. Do not claim the scripted ghosts or uncollected item persist in SM118. Lysandre Labs B1F, MM35 (not postgame-only): 12 ordinary species and fixed Arbok, Beldum western purple room and reported exit/re-entry refresh; preserve actual Alpha slot probabilities, exact indoor time/weather and unconfirmed revisit limitations. No permanent surface pins added. The indoor text is not a new geometry/roster packet.

## Sources actually reopened / reviewed

Official:
- https://www.nintendo.com/en-gb/Support/Purchases-Subscriptions/Games/How-to-Update-Pokemon-Legends-Z-A-2938482.html
- https://legends.pokemon.com/en-gb/news/adventure
- https://legends.pokemon.com/en-gb/gameplay
- https://legends.pokemon.com/en-gb/dlc
- https://home.pokemon.com/en-gb/move/
- https://legends.pokemon.com/en-gb/news/pokemon-home-connectivity

Supplemental:
- https://www.nintendolife.com/guides/pokemon-legends-z-a-walkthrough-all-wild-zones-tips-and-tricks
- https://www.nintendolife.com/guides/pokemon-legends-z-a-where-to-catch-beldum — MM35 access, Beldum catching and refresh.
- https://serebii.net/pokearth/lumiosecity/thesewers-mainaccess.shtml and https://serebii.net/pokearth/lumiosecity/thesewers-canalaccess.shtml — spawn bands and per-slot chances.
- https://bulbapedia.bulbagarden.net/wiki/Lumiose_Sewers — two networks and access distinction, Canal Klefki story qualification.
- https://www.serebii.net/legendsz-a/mainmissions/reachingrankd.shtml and https://www.serebii.net/legendsz-a/mainmissions/arequestfromtherustsyndicate.shtml — story access and ordered objectives.
- https://bulbapedia.bulbagarden.net/wiki/Old_Building — entrance/body distinction, three catchable mission Pokémon and later revisit.
- https://www.serebii.net/pokearth/lumiosecity/lysandrelabs.shtml — B1F slot data.
- https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_20 — Gourgeist Medium Variety.
- Game8 English hub returned HTTP403; Pokémon-France hub cache miss. Existing previous bounded research receipts remain useful, but these were not freshly fully accessible.

## CI regression diagnosis and repair

Parent exact article run 46176473788 failed at job 141076216056, tests/alphas_recovered.test.mjs line 18: source name Gourgeist versus standalone Gourgeist (Medium Variety). The reported form is corroborated by the source above. Fix actual authored source, keep species data-dex-name stable, and extend the existing strict comparator to recognize the third form annotation, not loosen it. Validate all 20 source vs standalone lists (38 fixed, 67 rotating). Add 24-species link assertions, interior route and official patch assertions to the existing article test. No unrelated tests disabled. Locally verify 20 exact list comparisons and 232/364 roster counts, 42 missions/203 side mission controls, 30 links to unique anchors. Five authored sections exactly replaced in generated index; reversing changes returns original parent index byte-for-byte as text. Exact CI and visual review pending. Parent workflows: [{"id":46176473894,"name":"Validate Atlas header feedback button","status":"completed","conclusion":"success"},{"id":46176473788,"name":"Validate recovered Atlas article pages","status":"completed","conclusion":"failure"},{"id":46176473792,"name":"Validate photo-only GitHub Pages output","status":"completed","conclusion":"success"},{"id":46176473789,"name":"Validate rotatable Lumiose Atlas Explorer","status":"completed","conclusion":"success"}]. Prior exact explorer jobs reported successful; do not substitute prior results for new-head validation.

## Preservation

Photo intake PR226 ffc46e3c69f7756dffecf17e4368eef4c53f4faa open/draft, no new committed delta at preflight/closeout; 250 previously integrated originals preserved. User handles ongoing photos and item/TM/Screw verification separately. No code changes to maps, encounter engine, progress, Supabase runtime or Workspace. 249 prior condition supplements and 146 chance Alpha rows retained. Original Workspace v40 last recorded; no new publication. HOLD. Check exact-head CI and independently review phone/desktop. Continue A2 capture-first verified city sector encounters, alternative evolution/gift/trade/form acquisition and remaining Hyperspace detail, then full A3–A8. Use official sources first, secondary guides for omitted game data and owner photos for verified positions. No release before full GitHub gate.
