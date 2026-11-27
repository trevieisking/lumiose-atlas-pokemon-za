# AT-346 — Surface classified Hyperspace acquisition routes in the existing Pokédex

The typed generated encounter audit identifies 27 Hyperspace species outside that source table. The existing 132-entry selector currently links only three Legendary Fieldbook cards. This bounded UI change links all twenty existing DLC Legendary/Mythical guides (including those three) and gives the seven remaining species an independently checked evolution note. It does not assert that any guide is exhaustive, that the other 105 cards have been audited, or that any random portal has a fixed location.

The existing HOME source roster remains the only source of species numbers/names/region. Match all new links by National number, not regional order or name spelling. All twenty route IDs already exist in legendaries.html; side-mission links point to existing anchors. Preserve all 364 species, ordering, filters, art fallback, links, and saved progress. No schema, storage, map, source-image or Workspace handoff change.

## Evolution evidence, checked 27 November 2026

- Annihilape: [Z-A Rage Fist behavior](https://bulbapedia.bulbagarden.net/wiki/Rage_Fist#Other_effects) and [Wild Zone 6 special battle](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_6#Special_encounters); the mission encounter is not a capture.
- Sirfetch’d: [Japanese Game8](https://game8.jp/pokemon-legends-z-a/749204) and [English Dexerto](https://www.dexerto.com/wikis/pokemon-legends-z-a/sirfetchd-pokemon-legends-z-a/); three critical hits in a single battle. Leek from [SM133](../../../side-missions.html#quest-133).
- Runerigus: [Japanese Gamepedia](https://gamepedia.jp/pokemon-legends-z-a/archives/22786) and [English evolution methods](https://www.serebii.net/legendsz-a/evolution.shtml) disagree on wording at the 49/50 boundary; advise aiming for 50 or more missing HP, without fainting, beneath the bridge between WZ11 and WZ17. [Nintendo Life route](https://www.nintendolife.com/guides/pokemon-legends-z-a-how-to-evolve-galarian-yamask-in-mega-dimension-dlc).
- Milotic: [trade with Prism Scale and SM160 handover](https://www.gamesradar.com/games/pokemon/pokemon-legends-za-feebas-prism-scale/). Retain a second Feebas; no Beauty-stat method asserted.
- Armarouge/Ceruledge: [SM132 armor choice](https://www.gamesradar.com/games/pokemon/pokemon-legends-za-charcadet-evolve-auspicious-malicious-armor/), [Serebii 5-star floating-ball Special item loot](https://www.serebii.net/legendsz-a/floatingpokeballs.shtml) and [item location](https://www.serebii.net/legendsz-a/items.shtml). One mission choice does not make the other armor unobtainable; random loot is not guaranteed.
- Gholdengo: [SM122 and 413 coins](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)#Mega_Dimension), [VGC acquisition guide](https://www.videogameschronicle.com/guide/gimmighoul-location-pokemon-legends-z-a-mega-dimension/) and [Destructoid evolution guide](https://www.destructoid.com/how-to-find-and-evolve-gimmighoul-in-pokemon-legends-z-a-mega-dimension/).

The [previous acquisition audit](HYPERSPACE_NON_GENERATED_ACQUISITION.md) retains the detailed classifications and pinned source-table references. The linked Legendary Fieldbook is not duplicated into a new capture dataset. Prior three direct catch links retain their labels; other links are labelled Fieldbook guide, not an independent certification.

## Validation
Add assertions for 20 valid regional/National guide destinations, seven disjoint evolution records, all existing roster IDs, and exact linked mission anchors. Extend the existing phone/desktop browser test to check all 27 cards, evolution expansion and a still-unreviewed card. Exact-head tests and visual review remain pending. The previous original Workspace handoff is unchanged.
