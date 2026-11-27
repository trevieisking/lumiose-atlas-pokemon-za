# AT-346 generated Hyperspace wild candidates: reproducible intake v1

**Research only.** This audit covers the extracted typed generated wild pools, not scripted encounters, city spawns, events, gifts, evolutions or every acquisition route. Nothing here changes the public Pokédex, maps, save state, backed-up photos, or the verified Workspace package. No candidate is a permanent map pin.

The [compact summary](hyperspace-generated-wild-summary-v1.json) records **500 patterns, 476 spawner IDs, 369 encounter IDs, 2,377 candidate rows, 328 National species and 368 species/form pairs**. All species match the existing Atlas roster: 223/232 Lumiose and 105/132 Hyperspace. The 36 absences are an acquisition follow-up list, not proof of unavailability. All 364 default forms match the pinned regional numbering and contain six base stats. Form 0 is an identity, not permission to copy its stats to alternate forms.

## Reproduce

Download the four files from the pinned export (save them as the names below). Exact Git fingerprints are enforced before parsing. Use Python 3.9+.

| Local file | Pinned export |
| --- | --- |
| `wild.json` | [typed wild pools](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/dimension/dimension_wild_pokemon/dimension_wild_pokemon/dimension_wild_pokemon_array.json) |
| `spawner.json` | [spawner table](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/pokemon_spawner/pokemon_spawner_data/pokemon_spawner_data_array.json) |
| `encounter.json` | [encounter definitions](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/world/ik_data/field/pokemon/encount_data/encount_data/encount_data_array.json) |
| `personal.json` | [species/form and stats](https://github.com/Xzonn/PokemonLZA-pkNX/blob/eadfb4b3ee9b1e09bb217dda87f1acd796e1a31f/raw/avalon/data/personal_array.json) |

From the repo root run:

```sh
python3 scripts/audit_hyperspace_encounters.py path/to/input --output /tmp/hyperspace-research-v1.json > /tmp/hyperspace-summary.json
diff -u docs/qa/at346-dex-audit/hyperspace-generated-wild-summary-v1.json /tmp/hyperspace-summary.json
```

The script preserves source weights at the pattern, cluster and child levels and rejects a mismatch rather than substituting missing data. It joins encounter internal species/form through the personal table before comparing National IDs (internal 1000 → Tinkatink #957; internal 976 → Gimmighoul #999). Portal rank adds one to the zero-based data index. Capture levels use the definition's range plus the spawner child adjustment; Alpha capture levels add the definition's Alpha adjustment. Displayed battle levels are separate. Child weights describe selection within that cluster and aren't portal odds. Raw Alpha values, time and weather apply only to these rows; no global probability/availability is inferred.

## Independently checked pilot rows

- **Mankey:** 1★ Fighting capture Lv. 16–18 / Alpha Lv. 25–27; 3★ Fighting capture Lv. 22–24 / Alpha Lv. 31–33. [Fighting pool](https://www.serebii.net/legendsz-a/hyperspacewildzone/fighting.shtml)
- **Garden Vivillon (form 4):** 1★ Flying and Bug capture Lv. 15–17 / Alpha Lv. 24–26. [Flying pool](https://www.serebii.net/legendsz-a/hyperspacewildzone/flying.shtml) · [Bug pool](https://www.serebii.net/legendsz-a/hyperspacewildzone/bug.shtml)
- **Chest Form Gimmighoul:** 5★ Ghost Special Scan capture Lv. 62–64 / Alpha Lv. 71–73. It is an alternative to the quest's separate Gholdengo acquisition, not a replacement for it. [Ghost pool](https://www.serebii.net/legendsz-a/hyperspacewildzone/ghost.shtml)

Use a small pilot before publishing generated candidates: keep city/setup routes and generated pools distinct, verify rank and availability independently, label captured versus battle levels, and keep exact IDs and all existing navigation.

See also [the separate Special Scan and evolution checkpoint](HYPERSPACE_NON_GENERATED_ACQUISITION.md) for follow-up classification of 14 Hyperspace gaps.
