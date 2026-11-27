# AT-346 first runtime slice: roster recovery and three mission routes

**GitHub scope only.** The original Workspace Site must be verified separately. This is a catalogue and three specific catch routes, not the completed encounter audit.

| Surface | Change | Protection |
| --- | --- | --- |
| Main Pokédex | The existing Hyperspace tab uses all 132 numbered entries from the already verified HOME roster, with names, regional/National numbers, types, artwork and checklist links. | Existing 232 Lumiose cards, stats and routes stay intact. No invented DLC stats or coordinates; stat sorts apply only to Lumiose. |
| Legendary Fieldbook and Side Mission directory | Publish authored routes for Hoopa (196), Volcanion (194) and Zeraora (EX3). Link from the main legendary summaries and the three Pokédex cards. | Keep PDF-faithful archive/summary data, all 25 Legendary IDs and 203 mission keys, and the original illustrations. |
| HOME | Separate the full 364-species Atlas checklist from HOME's 230 and 131 required entries plus Mega completion. | No checkmark, account or storage migration. |
| Maps and data | No map or original photo edits; landmarks are written directions only. | No exact pins, collection-ID edits or Supabase changes. |

## Sources and boundaries

- Hoopa: [Side Mission 196](https://www.serebii.net/legendsz-a/sidemissions/thedjinnunbound.shtml), [15th Reward Match](https://advent.serebii.net/legendsz-a/mainmissions/theinfinitez-aroyale.shtml) and [field walkthrough with 5-star portal and southern Holovator](https://www.gamerguides.com/pokemon-legends-z-a/guide/mega-dimensions-dlc/legendary-and-mythical-pokemon/how-to-obtain-magearna) (this URL renders the Hoopa article). The encounter in the script is Lv. 200; the Confined Hoopa received afterward is Lv. 80.
- Regular Volcanion: [Side Mission 194](https://www.serebii.net/legendsz-a/sidemissions/volcanionunleashed.shtml) and [Lv. 80 encounter record](https://www.serebii.net/legendsz-a/legendary.shtml). Separate from the Shiny HOME gift.
- Zeraora: [Side Mission EX3](https://www.serebii.net/legendsz-a/sidemissions/raginglightning.shtml) and [field walkthrough with the roof approach](https://www.gamerguides.com/pokemon-legends-z-a/guide/mega-dimensions-dlc/legendary-and-mythical-pokemon/how-to-catch-zeraora). The shop price is already in the Atlas Shops catalogue. Boss Lv. 200 vs catch Lv. 85.
- HOME: [official Pokémon HOME gift notice](https://news.pokemon-home.com/en/page/757.html) specifies all three completed HOME game Pokédexes. [Lumiose regional count](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Pok%C3%A9dex_number_in_Legends%3A_Z-A) and [Hyperspace regional count](https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Hyperspace_Pok%C3%A9dex_number) distinguish the optional species. Register Z-A-origin Pokémon and check completion in HOME itself.
- [Flabébé and Vivillon pilot](FORM_ACQUISITION_PILOT_2026-11-26.md) is held as research, not published encounter data. Full Dex, Alpha and map evidence remains open. No videos or video dependencies are shipped.

## Verification

Run `python3 scripts/build.py && python3 tests/validate_static.py && node --test tests/*.test.mjs`. The focused browser test `tests/dex_route_browser.mjs` uses the served Atlas and Playwright and checks both widths, failed remote art, both dex tabs, type/search and unsupported sort, catch links, shared progress, and HOME roster preservation. See the GitHub PR for exact-head and deployment evidence. Do not promote the original Workspace until the [single import prompt](../../../WORKSPACE_ATLAS_NEXT_RELEASE.md) passes its same-Site checks.
