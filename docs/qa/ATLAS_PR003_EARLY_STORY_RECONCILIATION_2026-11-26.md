# PR #3 early-story route reconciliation — 2026-11-26

## Scope and result

The early-story instructions in PR #3 contained useful detail that was not present in the current source. This change restores the corroborated route instructions for Main Missions 01–10, increasing their combined ordered steps from 30 to 73. It updates `src/sections/walkthrough.html`, the equivalent blocks in `walkthrough.html`, and generated `index.html`.

Historical source: PR #3, branch `content/early-story-linked-playthrough-2026-11-21`, reviewed head `4d65520593a438b03b96c5e3621989f76c4d8d4f`, walkthrough blob `8fce88342e3bbb00bcd0397d28df2204d360d441`. The preserved branch provenance is under `docs/consolidation/2026-11-26/branch-sources/pr-003/`. The old runtime was inspected to recover the unique route prose; the old branch was not merged wholesale.

Only the ten ordered route lists are changed. Current mission IDs, progress controls and keys, practical checks, field tips, navigation, links, maps, photos, pickup lists, and Missions 11–42 are preserved byte for byte. The previous PR #3 duplicate “PLAYTHROUGH CHECK” sections and historical navigation/runtime changes are not imported; the current guide already supplies practical checks and navigation.

## Written-source review

All linked walkthroughs below were re-opened on 2026-11-26. The detailed Thonky route pages support the restored directions, trainer teams, rewards, and sequence. Serebii and Bulbapedia provide the listed cross-checks. No video was used as evidence.

| Mission | Steps before → after | Restored detail | Written sources |
| --- | --- | --- | --- |
| 01 | 2 → 5 | Pancham pursuit, partner choice, Andi's level 4 Pancham, targeting and move cooldowns, ₽192 reward | [Thonky 01](https://www.thonky.com/pokemon-legends-z-a/main-mission-01-get-your-travel-bag-back), [Serebii 01](https://www.serebii.net/legendsz-a/mainmissions/getyourtravelbagback.shtml), [Bulbapedia Part 1](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_Legends:_Z-A/Part_1) |
| 02 | 2 → 7 | Brigitte's two level 4 Pokémon and ₽192 reward, archway and barrier exit, Hotel Z check-in, Room 202 and morning knock | [Thonky 02](https://www.thonky.com/pokemon-legends-z-a/main-mission-02-escape-from-the-battle-zone) |
| 03 | 4 → 9 | Outfit and app introduction, dash/dodge tutorial, teammate's level 5 starters, Pokémon Center approach, five distinct species, research lab 3F and TM004 reward | [Thonky 03](https://www.thonky.com/pokemon-legends-z-a/main-mission-03-a-new-life-in-lumiose-city), [Serebii 03](https://www.serebii.net/legendsz-a/mainmissions/anewlifeinlumiosecity.shtml) |
| 04 | 3 → 6 | Lida's Potion, Naveen's Sitrus Berry, first three battles and ticket, Zach's team, ₽540 reward and Rank Y | [Thonky 04](https://www.thonky.com/pokemon-legends-z-a/main-mission-04-battling-in-the-z-a-royale), [Serebii 04](https://www.serebii.net/legendsz-a/mainmissions/battlinginthez-aroyale.shtml) |
| 05 | 4 → 9 | Red Canari Plush, rooftop and Mega Shard tutorial, optional Swift and Aerial Ace stops, Josée's team and reward, three Emma requests and return battle | [Thonky 05](https://www.thonky.com/pokemon-legends-z-a/main-mission-05-the-city-in-the-shadow-of-prism-tower), [Serebii Wild Zones](https://www.serebii.net/legendsz-a/wildzones.shtml) |
| 06 | 3 → 6 | Side requests 004–009, three-card Bonus Card limit, Yvon's team and ₽960 reward | [Thonky 06](https://www.thonky.com/pokemon-legends-z-a/main-mission-06-reaching-rank-x), [Serebii 06](https://www.serebii.net/legendsz-a/mainmissions/reachingrankx.shtml) |
| 07 | 3 → 7 | Naveen's team and ₽952 reward, side requests 010–016, Xavi's location/team, ₽1,260 reward and Rank W | [Thonky 07](https://www.thonky.com/pokemon-legends-z-a/main-mission-07-reaching-rank-w), [Serebii 07](https://www.serebii.net/legendsz-a/mainmissions/reachingrankw.shtml) |
| 08 | 2 → 7 | Directions to Lida, her team and ₽1,288 reward, side requests 017–022 and Mable's exact trigger, Le Nah and Rintaro's level 24 team, ₽1,440 reward | [Thonky 08](https://www.thonky.com/pokemon-legends-z-a/main-mission-08-reaching-rank-v), [Serebii 08](https://www.serebii.net/legendsz-a/mainmissions/reachingrankv.shtml), [Serebii Side Mission 022](https://www.serebii.net/legendsz-a/sidemissions/acallfrommable.shtml) |
| 09 | 3 → 7 | Zygarde chase, borrowed Lucario, collecting Mega Power, right-stick activation, Dark Pulse avoidance, Absol and Absolite | [Thonky 09](https://www.thonky.com/pokemon-legends-z-a/main-mission-09-chase-that-mysterious-pokemon), [Serebii 09](https://www.serebii.net/legendsz-a/mainmissions/chasethatmysteriouspokemon.shtml) |
| 10 | 4 → 10 | Mega Absol practice and trainer levels, new zones and requests, security Dedenne, Vinnie's rank jump/team, shard exchange, starter Mega Stone and the three Rogue Mega cases | [Thonky 10](https://www.thonky.com/pokemon-legends-z-a/main-mission-10-the-secrets-of-mega-evolution), [Serebii 10](https://www.serebii.net/legendsz-a/mainmissions/thesecretsofmegaevolution.shtml), [Serebii Wild Zones](https://www.serebii.net/legendsz-a/wildzones.shtml) |

## Reconciliation decisions

- Zach's Pidgey is level 8 in Thonky and level 9 in Serebii. Its species is included; its exact level is omitted. Slowpoke level 8 and Pikachu level 9 agree.
- The historical research identified a conflicting TM051 Safeguard reward claim around Mission 10. This port makes no new claim that Mission 10 awards that TM.
- Mission 08 explicitly states that Side Mission 022 requires the Rank V opponent to have been decided, 30 registered Pokémon, and a Pokémon Center visit. It does not imply that the starter choice is available immediately when Mission 08 begins.
- Mission 07 now gives the relevant Sableye interaction directly: Normal- and Fighting-type moves do not affect it, while Fairy is useful against both Sableye and Scraggy.
- Mission 09 retains the current guide's specific Aura Sphere / Rock Smash advice for Lucario instead of replacing it with a less useful generic reference to Fighting attacks.
- The station introduction is described without a video reference. The route requires no external video or walkthrough link to play through it.
- Route descriptions are written guidance. This change does not verify exact map boundaries, movement geometry, or exhaustive encounter rosters.

## Verification

- `python3 scripts/build.py` regenerated `index.html` from the current source.
- `node --test tests/walkthrough_index.test.mjs tests/journey_deep_links.test.mjs`: all four focused tests passed. These cover 42 mission route/tip/map field parity, source/output parity, existing mission progress IDs, and 48 main-guide deep links.
- A structural comparison against the parent content commit replaced only each of the first ten ordered route lists with an identical sentinel in both versions. The remaining bytes of all three HTML files matched exactly. Each view contains the same 73 restored steps.
- `git diff --check` passed.

This is a bounded content reconciliation. It preserves the historical work as provenance and restores the verified unique directions while retaining current runtime behavior and unresolved evidence boundaries.
