# AT-346: Hyperspace portal prep and the EX3 recipe

## Player guide

The Mega Dimension guide is the canonical place for the five danger ranks; Hyperspace Maps links to it. Compare the danger rank and the calorie count of the **finished donut**. The displayed estimate is not a promised encounter level. The temporary wild boost is separate from the captured Pokémon’s level and the player's donut boost. Scripted boss levels and any story or Special Scan unlocks need their own evidence. No layout, coordinate, pin or save changes.

| Stars | Estimate | Temporary wild modifier | Normal drain, Cal/s |
| --- | ---: | ---: | ---: |
| 1 | 105 | +85 | 1 |
| 2 | 120 | +95 | 1.6 |
| 3 | 140 | +110 | 3.5 |
| 4 | 170 | +125 | 7.5 |
| 5 | 200 | +140 | 10 |

Normal drain examples: 1,200 ÷ 3.5 ≈ 343 seconds; 1,200 ÷ 7.5 = 160 seconds. These are illustrations, not a promise about every mission or interruption.

## Plasma-Glazed Donut

The recipe ID is `sp_05`. Thresholds are **40 / 200 / 400 / 280 / 40** in Sweet / Spicy / Sour / Bitter / Fresh order. All berries below are Hyper Berries.

| Status | Eight berries | Calculated totals |
| --- | --- | --- |
| Existing published example | 4 Kasib, 3 Chilan, 1 Babiri | 40 / 275 / 445 / 280 / 40 |
| Independently made in game; guide addition | 4 Kasib, 2 Chilan, 1 Charti, 1 Babiri | 40 / 200 / 450 / 310 / 50 |
| Held; no Babiri, needs Ansha preview | 4 Kasib, 2 Chilan, 1 Charti, 1 Kebia | 40 / 215 / 410 / 280 / 55 |
| Held; no Kasib, needs Ansha preview | 3 Roseli, 2 Passho, 1 Charti, 1 Colbur, 1 Babiri | 50 / 205 / 400 / 300 / 95 |

No probability, recipe unlock, nutrition or inventory claims are inferred. The confirmed alternative appears in Legendary Routes and its matching EX3 guide without altering guide IDs. The two arithmetic-only candidates stay in QA.

## Evidence

- Extracted game tables pinned at `eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f`: [rank export](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/dimension/dimension_rank/dimension_rank/dimension_rank_array.json), [berry rows](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/exl/donut/berry/berry.json), [recipe thresholds](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/exl/donut/donut_recipe/donut_recipe.json).
- [Official donut mechanics](https://legends.pokemon.com/en-us/news/new_allies), [independent observed Charti recipe](https://www.nintendolife.com/guides/pokemon-legends-z-a-how-to-get-zeraora-in-mega-dimension-dlc#how-to-make-the-plasma-glazed-donut), [published rank comparison](https://bulbapedia.bulbagarden.net/wiki/Hyperspace_Lumiose#Types_of_distortions).
