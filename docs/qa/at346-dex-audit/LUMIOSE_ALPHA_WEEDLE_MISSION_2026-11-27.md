# AT-346: Side Mission 43 Alpha Weedle — retention choice

## Verified correction
The existing guide incorrectly instructs players to give Grandt the captured Alpha Weedle. Both branches complete the mission: after catching the daytime garden Weedle in Magenta Sector 3, decline to retain it, or agree to let Grandt keep it. The cash and berry rewards are unchanged. A failed catch or knockout requires a retry. Wild Zone 1 survey completion offers a repeatable chance-Alpha route, not a guaranteed replacement.

The authored main side-mission source, generated homepage, standalone Side Missions and both Alpha views now agree. Existing quest IDs, checklist state, map geometry, photos, and all other guide entries are unchanged.

## Evidence, checked 27 November 2026
- [English event Pokémon record](https://bulbapedia.bulbagarden.net/wiki/List_of_in-game_event_Pok%C3%A9mon_in_Pok%C3%A9mon_Legends%3A_Z-A#Weedle): level 45, Magenta Sector 3, retaining Weedle is allowed.
- [English walkthrough](https://www.thonky.com/pokemon-legends-z-a/side-mission-043-a-big-weedle-problem): day, Grandt, either choice, equal rewards.
- [English mission walkthrough](https://bulbapedia.bulbagarden.net/wiki/Walkthrough%3APok%C3%A9mon_Legends%3A_Z-A/Side_Missions_41-60): Lv. 45, retry if capture fails, same rewards.
- [Japanese Game8](https://game8.jp/pokemon-legends-z-a/730190): choosing refusal retains Weedle; handing it over has no additional reward; retry until captured.
- [Japanese Pokémon Kingdom](https://pente.koro-pokemon.com/legendsz-a/side-mission-043.shtml): courtyard, daytime, Lv. 45, either decision.
- [Japanese Gamepedia](https://gamepedia.jp/pokemon-legends-z-a/quests/5519): daytime, optional handover and post-survey Wild Zone 1 chance route. Its Lv. 34 differs from the event record and other guides; the player-facing wording attributes Lv. 45 to the event record.
- [Serebii mission](https://www.serebii.net/legendsz-a/sidemissions/abigweedleproblem.shtml): unlock during Main Mission 15, Magenta Sector 3 and berry types; its Rindo quantity differs from the five reported by other sources, so no exact berry quantities are asserted in this pass.

## Limits and QA
This is a single mission encounter correction, not a complete Alpha or habitat audit. No coordinate or map updates, private player-data writes or original Workspace publication. Generated homepage reconstructed from the existing 17 sections; baseline build blob matched `430587ac2289b069be1b681471290dafe421ed0f` before edits. Regression assertions check matching quest text and bidirectional links. Exact-head CI and phone/desktop review are required before any release.
