# AT-348 A2-17 — Ordinary level evolution alternatives

28 November 2026. Manifest 144 / Joint Ledger 152. Exact prior PR229 head b9b7d6355b338206810dc0d8c10121cd9440576d: all four reported workflows passed (46178895047, 46178895120, 46178895021, 46178895213).

84 ordinary level evolution routes in existing Lumiose cards: 82 instruction paragraphs and two annotated existing form notes, 54 new predecessor lookup buttons, 30 existing predecessor buttons retained. All 232 base-dex IDs, 67 earlier acquisition notes, previous wild/interior links, original photographs and existing player state preserved. Reversible authored Pokédex and generated homepage replacement; structural checks passed; new regression assertions added. Full exact-head CI and independent mobile/desktop review pending.

## Research and limits
Official Pokémon gameplay describes capture and battle but does not list species-specific evolution thresholds. Compare Nintendo Life and Thonky regional tables, resolving discrepancies with game-specific sources. Nintendo Life incorrectly lists Talonflame predecessor/level, Pidgeot level 26, Slowbro level 27, Mantyke as Manectric predecessor and shifts the Lampent evolution row. Correct thresholds are Talonflame 35 from Fletchinder, Pidgeot 36 from Pidgeotto, ordinary Slowbro 37 from Slowpoke, Manectric 26 from Electrike, Lampent 41 from Litwick. Thonky has unrelated Linking Cord and Slowking errors; do not import trade claims. No new wild spawn, precise route, weather, form-completeness or official species-level verification claim.

- https://legends.pokemon.com/en-gb/gameplay
- https://www.nintendolife.com/guides/pokemon-legends-z-a-pokedex-all-lumiose-pokemon-locations-and-evolutions
- https://www.thonky.com/pokemon-legends-z-a/list-of-pokemon-locations
- https://www.powerpyx.com/pokemon-legends-z-a-talonflame-location/
- https://www.powerpyx.com/pokemon-legends-z-a-pidgeot-location/
- https://www.powerpyx.com/pokemon-legends-z-a-slowbro-location/
- https://www.powerpyx.com/pokemon-legends-z-a-manectric-location/
- https://www.powerpyx.com/pokemon-legends-z-a-lampent-location/
- https://www.powerpyx.com/pokemon-legends-z-a-kadabra-location/
- https://www.powerpyx.com/pokemon-legends-z-a-metagross-location/
- https://pokedex.gg/pokemon/663/talonflame/legends-z-a
- https://rotomlabs.net/dex/legends-z-a/slowpoke

## Route inventory

| ID | Pokémon | Predecessor | Minimum level |
|---|---|---|---|
| 2 | Bayleef | Chikorita | 16 |
| 3 | Meganium | Bayleef | 32 |
| 5 | Pignite | Tepig | 17 |
| 6 | Emboar | Pignite | 36 |
| 8 | Croconaw | Totodile | 18 |
| 9 | Feraligatr | Croconaw | 30 |
| 11 | Fletchinder | Fletchling | 17 |
| 12 | Talonflame | Fletchinder | 35 |
| 14 | Diggersby | Bunnelby | 20 |
| 16 | Spewpa | Scatterbug | 9 |
| 17 | Vivillon | Spewpa | 12 |
| 19 | Kakuna | Weedle | 7 |
| 20 | Beedrill | Kakuna | 10 |
| 22 | Pidgeotto | Pidgey | 18 |
| 23 | Pidgeot | Pidgeotto | 36 |
| 25 | Flaaffy | Mareep | 15 |
| 26 | Ampharos | Flaaffy | 30 |
| 28 | Watchog | Patrat | 20 |
| 33 | Gyarados | Magikarp | 20 |
| 35 | Barbaracle | Binacle | 39 |
| 39 | Floette | Flabébé | 19 |
| 42 | Gogoat | Skiddo | 32 |
| 44 | Meowstic | Espurr | 25 |
| 46 | Pyroar | Litleo | 35 |
| 50 | Garbodor | Trubbish | 36 |
| 59 | Ariados | Spinarak | 22 |
| 61 | Arbok | Ekans | 22 |
| 63 | Kadabra | Abra | 16 |
| 66 | Haunter | Gastly | 25 |
| 69 | Whirlipede | Venipede | 22 |
| 70 | Scolipede | Whirlipede | 30 |
| 72 | Doublade | Honedge | 35 |
| 75 | Weepinbell | Bellsprout | 21 |
| 84 | Medicham | Meditite | 37 |
| 86 | Manectric | Electrike | 26 |
| 88 | Kirlia | Ralts | 20 |
| 89 | Gardevoir | Kirlia | 30 |
| 92 | Houndoom | Houndour | 24 |
| 94 | Altaria | Swablu | 35 |
| 112 | Banette | Shuppet | 37 |
| 114 | Vanillish | Vanillite | 35 |
| 115 | Vanilluxe | Vanillish | 47 |
| 117 | Camerupt | Numel | 33 |
| 119 | Hippowdon | Hippopotas | 34 |
| 121 | Excadrill | Drilbur | 31 |
| 123 | Krokorok | Sandile | 29 |
| 124 | Krookodile | Krokorok | 40 |
| 126 | Machoke | Machop | 28 |
| 129 | Gabite | Gible | 24 |
| 130 | Garchomp | Gabite | 48 |
| 138 | Slowbro | Slowpoke | 37 |
| 141 | Sharpedo | Carvanha | 30 |
| 143 | Eelektrik | Tynamo | 39 |
| 146 | Dragonair | Dratini | 30 |
| 147 | Dragonite | Dragonair | 55 |
| 149 | Ivysaur | Bulbasaur | 16 |
| 150 | Venusaur | Ivysaur | 36 |
| 152 | Charmeleon | Charmander | 16 |
| 153 | Charizard | Charmeleon | 36 |
| 155 | Wartortle | Squirtle | 16 |
| 156 | Blastoise | Wartortle | 36 |
| 162 | Dragalge | Skrelp | 48 |
| 164 | Clawitzer | Clauncher | 37 |
| 166 | Sliggoo | Goomy | 40 |
| 170 | Glalie | Snorunt | 42 |
| 173 | Abomasnow | Snover | 40 |
| 175 | Avalugg | Bergmite | 37 |
| 185 | Scrafty | Scraggy | 39 |
| 187 | Noivern | Noibat | 48 |
| 190 | Lampent | Litwick | 41 |
| 200 | Lairon | Aron | 32 |
| 201 | Aggron | Lairon | 42 |
| 207 | Pupitar | Larvitar | 30 |
| 208 | Tyranitar | Pupitar | 55 |
| 210 | Frogadier | Froakie | 16 |
| 211 | Greninja | Frogadier | 36 |
| 214 | Quilladin | Chespin | 16 |
| 215 | Chesnaught | Quilladin | 36 |
| 218 | Braixen | Fennekin | 16 |
| 219 | Delphox | Braixen | 36 |
| 221 | Shelgon | Bagon | 30 |
| 222 | Salamence | Shelgon | 50 |
| 226 | Metang | Beldum | 20 |
| 227 | Metagross | Metang | 45 |

## Release
HOLD. PR226 remains open at ffc46e3c69f7756dffecf17e4368eef4c53f4faa, 250 committed and integrated originals preserved. Uncommitted photo intake independent. No map, player progress, server runtime, main or Workspace changes. Continue city and rooftop encounters, Hyperspace and form details, A3–A8, exact-head CI and independent visual checks.
