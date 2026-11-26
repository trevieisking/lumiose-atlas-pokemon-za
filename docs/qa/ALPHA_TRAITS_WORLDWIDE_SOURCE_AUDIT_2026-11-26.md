# Worldwide source review: Alpha Pokémon traits (26 November 2026)

**Page:** Existing `alphas.html` only. **Decision:** Add a bounded "Why catch an Alpha?" section; do not create a duplicate mechanics page.

## Verified facts and independent corroboration

| Claim adapted for Atlas | Sources checked | Limits |
| --- | --- | --- |
| Captured Alphas have **at least three perfect IVs at 31**, with the stat slots chosen randomly. | Serebii (English) https://www.serebii.net/legendsz-a/alphapokemon.shtml ; Bulbapedia (English) https://bulbapedia.bulbagarden.net/wiki/Alpha_Pok%C3%A9mon ; GameWith (Japanese) https://gamewith.jp/pokemon-za/526347 ; Game8 (Japanese) https://game8.jp/pokemon-legends-z-a/732907 | Not six guaranteed perfect IVs; cannot claim any particular attack/stat spread. |
| Caught Alphas start with **252 HP EVs**. | All four sources above; also Japanese EV guide https://gamepedia.jp/pokemon-legends-z-a/archives/10838 | The starting allocation may not match a player's planned competitive EV spread; do not generalize to other EVs. |
| Alpha receives a **species-specific mastered TM-type move as a Plus Move**. | Serebii and Bulbapedia (above), GameWith's special-move explanation | Do not invent a move list for species that have not been researched individually. |
| Alphas are **large/XL, red-eyed and marked as Alphas**. | Bulbapedia and Game8 above | XL status and appearance are not a guarantee of extra battle stats after capture. |
| Defeating or catching Alpha Pokémon can reward **Exp. Candy / Seeds of Mastery**. | GameWith https://gamewith.jp/pokemon-za/526347 and Game8 https://game8.jp/pokemon-legends-z-a/732907 | Avoid stating a guaranteed drop, a fixed quantity or a particular reward table without encounter-specific verification. |

## Existing guide comparison and placement

- Existing `alphas.html` contains unlock/approach cards, 20 Wild Zone cards, 67 Zone 20 pool entries, city Alpha examples and Dratini/Riolu chance-encounter directions.
- The reliable captured-trait comparison was missing from the player-facing page. New content has been placed **within** that Alpha Fieldbook as `#alpha-benefits` with an internal hero link.
- Existing Alpha encounter locations, day/night labels, fixed rosters, Dratini guide, realm/map coordinates, photo references and player progress remain unchanged. No new map pin or database change.
- This research does not justify a new standalone page, nor does it certify the broader city Alpha inventory or the entire Atlas master plan.
- Original Workspace Site import status remains independent. A GitHub Pages release is not proof of a Workspace update.

## Future worldwide-research method

For each candidate claim, compare to the current Atlas content first. Prioritize authoritative/game-specific sources, then corroborate using independently authored English, Japanese, German, Spanish or French reports when helpful. Record source URLs, edition/DLC, unlock/route conditions, uncertainty and any contradictions. Amend the closest existing guide page; propose a new page only when no established section can contain the topic coherently. Keep image and survey evidence, source verification and runtime implementation separate.

## Release requirement

Run the full recovered-articles test workflow on the exact reviewed commit, compare all original fixed Wild Zone and city Alpha sections, confirm no map/data/progress edits, merge only on passed checks, then independently verify GitHub Pages deployment. Update the existing private Supabase `atlas_internal.feature_checklist` record `AT-341-ALPHA-PAGE-AUDIT` without changing its Workspace status until the original Site is checked.
