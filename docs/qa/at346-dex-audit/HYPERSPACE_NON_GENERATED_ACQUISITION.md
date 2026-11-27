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

**13 pending species:** Heatran, Volcanion, Genesect, Hoopa, Marshadow, Meltan, Melmetal, Darkrai, Kyogre, Groudon, Rayquaza, Magearna and Zeraora. Some already have guide cards. Pending means the research coverage has not reconciled those cards to the source schema here, not that the guide lacks them or they cannot be obtained.
