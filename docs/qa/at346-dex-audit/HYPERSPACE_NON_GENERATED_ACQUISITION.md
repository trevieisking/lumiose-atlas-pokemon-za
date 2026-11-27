# AT-346: acquisitions outside the typed generated wild pools

The [typed-pool audit](HYPERSPACE_GENERATED_WILD_AUDIT.md) leaves 27 Hyperspace IDs outside that particular source table. This checkpoint classifies 14 of those through distinct Special Scan or evolution routes. These are not city locations, guarantees, or exhaustive acquisition records.

## Player correction: Latias and Latios

After Rayquaza, clear Side Mission 189, Siblings of the Sky, before spending points on attempts for either sibling. Its scripted fight awards both Mega Stones; a later Special Scan provides a chance to catch the species. Side Mission 188 unlocks the scan service, and each attempt requires 25,000 points. The scan safeguard concerns eligible encounters as a group, not a chosen Pokémon; the exact streak rule is not promoted by this slice.

Evidence: [Latias prerequisite (Japanese)](https://gamewith.jp/pokemon-za/540778), [Latios prerequisite (Japanese)](https://gamewith.jp/pokemon-za/544659), [SM189 battle and rewards](https://www.serebii.net/legendsz-a/sidemissions/siblingsofthesky.shtml), and [SM188 cost and scanning](https://www.serebii.net/legendsz-a/sidemissions/startspecialscanning.shtml).

## Special Scan evidence

Replayed the seven first-lottery records in the [pinned special table](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/dimension/dimension_special_lottery/dimension_special_lottery/dimension_special_lottery_array.json) (Git blob `bb637fc4ad0fa502115408cc8a7debca84b6b77a`) through the spawner, encounter and personal files used in the generated audit. The scene-specific spawner matches the map family and suffix, then its child encounter ID resolves to the named equivalent. All seven below are form 0, Lv. 60 on capture, and have raw Alpha probability 0 in these rows. These fields do not describe other possible acquisition routes or supply published odds.

| First-lottery suffix | Scene | Spawner | National species |
| --- | --- | --- | --- |
| 01 | t4_06_sp01 | id_spn_zdm406_sp01_001 | 638 Cobalion |
| 02 | t4_06_sp02 | id_spn_zdm406_sp02_001 | 639 Terrakion |
| 03 | t4_06_sp03 | id_spn_zdm406_sp03_001 | 640 Virizion |
| 04 | t4_02_sp04 | id_spn_zdm402_sp04_001 | 647 Keldeo |
| 05 | t4_02_sp05 | id_spn_zdm402_sp05_001 | 648 Meloetta |
| 06 | t4_04_sp06 | id_spn_zdm404_sp06_001 | 380 Latias |
| 07 | t4_04_sp07 | id_spn_zdm404_sp07_001 | 381 Latios |

## Evolution candidates

The pinned personal export independently resolves each source form and target. Keep the authoring boundaries below before adding to player pages.

- **Annihilape:** Primeape uses Rage Fist 20 times. SM180 is not a capture. [Rage Fist](https://bulbapedia.bulbagarden.net/wiki/Rage_Fist)
- **Sirfetch’d:** Galarian Farfetch’d lands three critical hits in one battle; [SM133’s Leek](../../../side-missions.html#quest-133) can help. [Evolution reference](https://www.dexerto.com/wikis/pokemon-legends-z-a/sirfetchd-pokemon-legends-z-a/)
- **Runerigus:** Galarian Yamask has at least 49 HP missing without fainting and evolves under the Coulant Waterway bridge between Wild Zones 11 and 17. [Field guide](https://www.nintendolife.com/guides/pokemon-legends-z-a-how-to-evolve-galarian-yamask-in-mega-dimension-dlc)
- **Milotic:** trade Feebas holding a Prism Scale. [SM160](../../../side-missions.html#quest-160) or the floating-item route can provide one. Do not present the legacy Beauty record as a usable route. [Prism Scale route](https://www.gamesradar.com/games/pokemon/pokemon-legends-za-feebas-prism-scale/)
- **Armarouge and Ceruledge:** use Auspicious Armor or Malicious Armor, respectively, on Charcadet. [SM132](../../../side-missions.html#quest-132) offers one choice; both also occur in 5★ floating-item Special loot. [Loot table](https://www.serebii.net/legendsz-a/floatingpokeballs.shtml)
- **Gholdengo:** evolve either form of Gimmighoul with 999 coins. Keep separate from the existing [SM122 route](../../../side-missions.html#quest-122) or generated Chest Form Gimmighoul.


## Remaining 13 Hyperspace acquisition classifications

| Class | Species | Route evidence |
| --- | --- | --- |
| Story boss capture | Heatran | HM09, Infernal Arena; caught Lv. 80. |
| Story boss capture | Darkrai | HM11, Bad Dreams Cruller, Newmoon Nightmare via Prism Tower; caught Lv. 85. |
| Story boss capture | Kyogre | HM14, Alpha Donut, Wild Zone 5 portal to Primordial Sea; caught Lv. 80. |
| Story boss capture | Groudon | HM13, Omega Donut, Jaune Sector 11 portal to Desolate Land; caught Lv. 80. |
| Story boss capture | Rayquaza | HM12; complete both primal routes, use Delta Donut from Hotel Z into Sky Pillar; caught Lv. 85. |
| Side mission catch | Genesect | SM191, Wild Zone 13 scripted 5★ portal; encounter Lv. 200, caught Lv. 60. |
| Side mission catch | Marshadow | SM192, sunset interaction on the Rouge Sector 1 court; caught Lv. 80. |
| Side mission catch | Meltan | SM193, near the Rouge Sector 1 bank; caught Lv. 70 and retained. |
| Side mission catch | Volcanion | SM194, Pokémon Research Lab; caught Lv. 80. |
| Side mission catch | Zeraora | EX3, scripted Gare de Lumiose portal with the Plasma-Glazed Donut; caught Lv. 85. |
| Scripted reward | Melmetal | Separate Lv. 80 gift in SM193 after catching Meltan. |
| Scripted reward | Magearna | Jett in SM195 at Quasartico, Lv. 80; HM12 and SM190 supported. Hold the disputed SM162 prerequisite. |
| Scripted reward | Hoopa | SM196: defeat Unbound, then use the Prison Bottle; joins in Confined form Lv. 80. |

[Story mission and venue cross-check](https://bulbapedia.bulbagarden.net/wiki/Hyperspace_Mission), [Serebii capture levels](https://www.serebii.net/legendsz-a/legendary.shtml), [Meltan and Melmetal](https://www.serebii.net/legendsz-a/sidemissions/dreamsofmeltan.shtml), [EX3](https://www.serebii.net/legendsz-a/sidemissions/raginglightning.shtml), [Magearna](https://gamewith.jp/pokemon-za/534440). Genesect: [Japanese SM191 walkthrough](https://gamewith.jp/pokemon-za/534350) and [portal preparation and encounter](https://www.gamerguides.com/pokemon-legends-z-a/guide/mega-dimensions-dlc/legendary-and-mythical-pokemon/how-to-catch-genesect/). Marshadow: [Japanese SM192 walkthrough](https://gamewith.jp/pokemon-za/534592) and [sunset trigger and capture](https://www.gamerguides.com/pokemon-legends-z-a/guide/mega-dimensions-dlc/legendary-and-mythical-pokemon/how-to-catch-marshadow). Use the existing mission marker for Genesect's wall rather than reconciling conflicting compass descriptions. The Marshadow directions use Café Bataille and Wild Zone 6 for the requester, and a separate court near Centrico Pokémon Center for the encounter. This pass updates just those two player cards.

## Nine Lumiose acquisition classifications

- **Fixed Alpha:** Salamence, Wild Zone 18, Lv. 61–62. This is a direct Alpha catch, not the only acquisition route.
- **Rotating Alpha pool:** Dragonite and Garchomp (Lv. 64–65) and Metagross (Lv. 63–64) are possible picks from Wild Zone 20's two rotating Alpha slots. No particular species is guaranteed. Evolution is an alternate route for these and Salamence.
- **Story catches:** Xerneas at Wild Zone 11 (MM40), Yveltal at Rouge Sector 2 (MM41), and Zygarde at Prism Tower (MM42).
- **Gift-unlocked mission catches:** Diancite unlocks Diancie (EX1); the Mewtwonite X/Y gift unlocks Mewtwo (EX2). Timed distributions are separate records.

[Fixed Alphas](https://www.serebii.net/legendsz-a/alphapokemon.shtml), [Wild Zone 20 pool and slot count](https://www.gamerguides.com/pokemon-legends-z-a/database/alpha-pokemon/groups/wild-zone-20), [level ranges](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Legends%3A_Z-A/Part_27), [story captures](https://www.serebii.net/legendsz-a/legendary.shtml), official [Diancie](https://legends.pokemon.com/en-au/news/get-diancie) and [Mewtwo](https://legends.pokemon.com/en-au/news/get-mewtwo-and-mewtonite-stones) announcements.

**Coverage:** 27/27 Hyperspace and 9/9 Lumiose absences now have at least one acquisition class. This does not close the work for alternate routes, individual forms, Alpha eligibility, source disagreements, or all unlock gates. No new map pins or blanket render of the research data.
