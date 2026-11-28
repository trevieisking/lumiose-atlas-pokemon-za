# AT-348 A2-16 — Evolution and alternative acquisition

28 November 2026. Manifest 143 / Joint Ledger 151. Parent d2349cc529e3fdcef7e26061311d0a7f5131edc4. Same draft guide PR229. All four parent workflows passed: [{"id":46177331753,"name":"Validate Atlas header feedback button","status":"completed","conclusion":"success"},{"id":46177331687,"name":"Validate photo-only GitHub Pages output","status":"completed","conclusion":"success"},{"id":46177331728,"name":"Validate recovered Atlas article pages","status":"completed","conclusion":"success"},{"id":46177331692,"name":"Validate rotatable Lumiose Atlas Explorer","status":"completed","conclusion":"success"}].

## Implemented guide content

64 existing Lumiose Pokédex cards receive 67 individually described acquisition routes: 43 special evolution requirements (20 stones, 10 trades, eight friendship, five time/weather/party/device conditions) and 24 gift, NPC trade, regional-form and fossil notes. Retain the existing species IDs, wild location buttons and previous capture/interior notes. Each evolution includes its prerequisite species lookup, a common instructions button, and item quest/shop links where relevant. The shared Essentials guide explains manual Evolve, stone use, friendship 160, café/bench, Friendship Checker, Soothe Bell and Nintendo's local/online eight-digit Link Trade. Explain that Espeon/Umbreon require removing Fairy moves, male Kirlia/female Snorunt restrictions, ordinary vs regional Slowpoke, Inkay handheld inversion, Goodra rain, and Pangoro's Dark-type teammate. Main Mission 9 Absol, first partners, Kanto gift, Kalos side gifts, museum Marine Spewpa, Eternal Flower Floette, Hotel Z Lucario, NPC Heracross/Riolu/Alolan Raichu/Galarian Slowpoke, regional Stunfisk and three fossils have actionable routes with the existing quest/mission buttons. No claim that all acquisition possibilities or forms are complete.

## Source receipts

Official:
- https://en-americas-support.nintendo.com/app/answers/detail/a_id/68627/c/874 — Nintendo Support indexed result describes Nearby/Faraway, shared eight-digit code, offer and confirmation; direct page reopen returned cache miss, indexed text was available. Official gameplay https://legends.pokemon.com/en-gb/gameplay reviewed. Official site does not enumerate the special evolution table.
- https://legends.pokemon.com/en-gb/news/battle-with-trainers — local/online version and membership context. Existing official HOME and version receipts retained.

Supplemental:
- https://www.nintendolife.com/guides/pokemon-legends-z-a-pokedex-all-lumiose-pokemon-locations-and-evolutions — species/evolution comparison, not wholesale copying.
- https://www.nintendolife.com/guides/pokemon-legends-z-a-how-to-increase-friendship-fast — eight friendship outcomes, Soothe Bell.
- https://www.serebii.net/legendsz-a/friendship.shtml and https://bulbapedia.bulbagarden.net/wiki/Friendship — numerical threshold, café, bench and checker. Do not rely on conflicting reports about walking/battling.
- https://allthings.how/pokemon-legends-z-a-evolution-guide-manual-triggers-stones-trades/ — special methods cross-check; manual Evolve. Do not confuse older game Linking Cord mechanics.
- https://www.powerpyx.com/pokemon-legends-z-a-all-evolution-item-locations/ and https://www.serebii.net/legendsz-a/items.shtml — progression-sensitive shop availability and item mission rewards. Existing Atlas shop price rows retained; exact stock timing not certified.
- https://www.gamesradar.com/games/pokemon/pokemon-legends-z-a-inkay-evolve-malamar/ — handheld inversion and absent arrow.
- https://www.serebii.net/legendsz-a/giftpokemon.shtml and https://www.serebii.net/legendsz-a/ingametrades.shtml — gift/trade identities and levels.
- https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A) — Side Mission 7/8/9/21/22/24/25/36/39/72/75/84/101/108 and unlock cross-check; preserve existing exact quest links.
- https://bulbapedia.bulbagarden.net/wiki/Galarica_Wreath and https://bulbapedia.bulbagarden.net/wiki/Slowking_(Pok%C3%A9mon) — regional item-use distinction.
- https://www.serebii.net/legendsz-a/mainmissions/chasethatmysteriouspokemon.shtml and https://bulbapedia.bulbagarden.net/wiki/Floettite — story gift gates.
- Prior Nintendo Life, Game8 and Pokémon-France source registers retained; not a fresh whole-site audit.

## Validation and release

Exact source replacement of Pokédex and Essentials in generated index, round-trip to parent text, 232 species IDs unchanged in order, 42 main and 203 side controls preserved. All new quest/shop/walkthrough links resolve to existing local anchors during construction; previous links retained. Add 67-note count, species identity, required conditions and prerequisites/links to existing article regression test. Full new-head Node/browser CI and independent mobile/desktop review pending. No map runtime, pin, encounter packet, photo, Supabase runtime or progress changes. Source PR226 open at ffc46e3c69f7756dffecf17e4368eef4c53f4faa; no new committed delta, prior 250 originals preserved. Workspace v40 last recorded, no publication. HOLD. Check exact-head CI and independently review mobile/desktop. Continue base-dex ordinary level evolution alternatives and verified city sector/rooftop routes, then Hyperspace evolution/form and acquisition coverage and A3–A8. Preserve existing conditions, capture records, photo intake and player state; official sources first, no release until validation.
