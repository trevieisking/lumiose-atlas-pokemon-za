# AT-346: Wild Zone 20 central Alphas and the Mission 40 capture choice

## Wild Zone 20

The two central spawners (`401_A` and `402_A` at `a0601_w01_v00`) each contain the same 67 candidates. Forty-one are Lv. 63–64 and 26 are Lv. 64–65. The 67 National IDs match the existing guide roster exactly. These bands and the Meadow Pattern Vivillon (666, form 6) and Red Flower Florges (671, form 0) labels describe the two central rotating slots, not the entire zone. Do not infer slot odds, exact points, or all city Alpha forms from this pool.

## Mission 40

The `201_X` spawners in `a0403_w01`, `a0202_w02`, and `a0301_w02` match Steelix, Gallade, and Pangoro. All are Lv. 70, Alpha probability 100, gated by the same story flag and separate per-target event flags. Field walkthroughs show their landmarks. Catching advances the mission; defeating one loses that individual spawn, not all future access to the species. Wild Zone 20 gives repeatable Gallade and Pangoro chances. Trade an Alpha Onix holding a Metal Coat, or seek a 4★ Steel Hyperspace cluster with Mega Dimension for repeatable Alpha Steelix. The exact generated catch levels are Lv. 38–40 ordinary or Lv. 47–49 Alpha, independently of any portal combat level increase.

## Reproduce

Pinned [spawner](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/pokemon_spawner/pokemon_spawner_data/pokemon_spawner_data_array.json), [encounter](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/pokemon/encount_data/encount_data/encount_data_array.json), and [personal](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/avalon/data/personal_array.json) files can be downloaded separately as `spawner.json`, `encounter.json`, and `personal.json`. Run `python3 scripts/audit_wz20_alphas.py /path/to/files` to check the blob hashes and emit exact sorted (National ID, form ID, minimum, maximum) records using the spawner/encounter/personal join.

Cross-checks: [Wild Zone 20 central table](https://bulbapedia.bulbagarden.net/wiki/Wild_Zone_20), [RotomLabs zone forms](https://rotomlabs.net/locations/legends-z-a/wild-zone-20), [GameWith mission screenshots](https://gamewith.jp/pokemon-za/525007), [English walkthrough and landmarks](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Legends%3A_Z-A/Part_28), [Steel portal encounters](https://www.serebii.net/legendsz-a/hyperspacewildzone/steel.shtml). These corrections do not change map data, original photographs, progress, or feedback. They do not close the full Alpha audit.
