# Quest 11 location correction — 26 November 2026

## Concrete error and correction

The existing **The Kakuna Master** card incorrectly said **Rouge Sector 1** in both its Start field and the first solution sentence. Montée's location is **Jaune Sector 1**. This patch changes those two occurrences in the authoritative section and standalone index, then regenerates the homepage with `scripts/build.py`.

Three independently presented written references support the district:

- [Altissimo — Jaune Sector 1](https://altissimo1.github.io/Supplementary-Series/Legends/Lumiose-Locations/jaune-sector-1.html) places Montée under the central tree in the grassy area and explicitly lists Side Mission 011 there.
- [Serebii — Jaune District](https://www.serebii.net/pokearth/lumiosecity/jaunedistrict.shtml), in its named **Jaune Sector 1** subsection, lists Grade-Schooler Montée with the corresponding Kakuna/Beedrill team.
- [Thonky — Side Mission 011](https://www.thonky.com/pokemon-legends-z-a/side-mission-011-the-kakuna-master) locates the requester east of Centrico Pokémon Center and northeast of Prism Tower, consistent with the original Jaune 1 map crop.

These pages were read on 26 November 2026. The Altissimo page initially failed through a direct open, then opened successfully through its Hibernal Avenue link. No inaccessible page was treated as positive evidence.

## Boundaries and parity

The initial correction changed only the district words. Quest ID `quest-11`, progress key `11`, title, unlock, rewards, links, all 202 other quest cards and all other source sections remain unchanged. The corrected Jaune 1 access route is in the separate access-continuation packet; it does not replace the quest record. The subsequent battle wording review below is a separate, narrowly documented amendment.

The remote concurrency checkpoint was checked read-only before editing: both `a0b12854b2478ec400fb11eb53db2b8b21b91555` and `b788abb87ef32cb210747da420d95780c4a22583` still contained the two erroneous Rouge references. This is not a duplicate of those source amendments.

Validation of the initial correction passed using the existing `tests/side_missions_index.test.mjs` source/index parity and persistence suite, with a small regression checking the corrected source, homepage and standalone card together. The suite retains all 203 quest fields and original progress behavior. A byte comparison for that initial commit confirms exactly two district-word replacements in each of the three HTML files and no other change. The homepage is regenerated from the source template.

## Follow-up battle wording review

The old sentence additionally said that Beedrill evolves during the battle. The reviewed sources do not support that precise timing consistently, so the follow-up describes the opponents directly: two level 8 Kakuna, one level 9 Kakuna and one level 11 Beedrill. [Thonky](https://www.thonky.com/pokemon-legends-z-a/side-mission-011-the-kakuna-master) and [Bulbapedia's mission trainer table](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)/Trainers#011:_The_Kakuna_Master) independently list that roster. The existing Electroweb warning is retained because [Serebii's mission move table](https://www.serebii.net/legendsz-a/sidemissions/thekakunamaster.shtml) lists the move for the Kakuna. Serebii's district prose is not used to override the independently reconciled Jaune location.

The root reviewer opened these sources on 26 November 2026. The authored section and standalone card receive the same single sentence replacement; `scripts/build.py` regenerates the homepage. The existing regression now also checks this roster wording and rejects the unsupported in-battle evolution claim across all three cards. This amendment changes no reward, unlock, identity, progress key or other mission.

```sh
python scripts/build.py
node tests/side_missions_index.test.mjs
```

This is a local source correction. GitHub merge, live deployment and Workspace synchronization are separate release steps.
