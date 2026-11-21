# Original ChatGPT Workspace Site — access and parity handoff

**Prepared:** 21 November 2026
**Canonical shared ledger:** [ATLAS_DUAL_SITE_FIX_LEDGER.md](ATLAS_DUAL_SITE_FIX_LEDGER.md)
**Independent repository:** https://github.com/trevieisking/lumiose-atlas-pokemon-za
**Original live Site (keep online):** https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/

## Copy/paste this request into the ORIGINAL Site's Workspace editor when access returns

> I am the owner of **The Free Online Player's Guide for Pokémon Legends: Z-A**. Please read the **two-site fix ledger** at https://github.com/trevieisking/lumiose-atlas-pokemon-za/blob/main/ATLAS_DUAL_SITE_FIX_LEDGER.md and this handoff document.
>
> I need access to, or a complete **source export of, the EXISTING original ChatGPT Site project**. Please use the actual editable Site project, **not a recreation of the published webpage**. I need every original source file, page, route, asset, map, data module, script, dependency list, and build/deployment configuration bundled in an export suitable for GitHub. **Exclude all API secrets, private environment values, database passwords, tokens and personal feedback contents.** If an exact source export is unavailable, tell me precisely what can and cannot be accessed; do not invent replacement source or silently substitute the saved rendered HTML.
>
> The original site must stay live at its current URL, and its existing feedback service, database rows, ratings and user progress must remain untouched. **Do not reset, rebuild, deploy, delete, transfer the domain or alter DNS merely to export its source.** I want to compare the original Site against the separate GitHub reconstruction, then apply missing corrections to each as appropriate. Do not push over `main`, merge open PRs or overwrite the new GitHub work automatically.
>
> Preserve the two outstanding player feedback reports: **#13 — Mission 24 Hotel Z conversation**, **#14 — Mission 25 Lida/Naveen battle guidance**. These are real and must remain visible until those details are fact-checked, corrected, published and tested in **both** the original Workspace guide and the independent GitHub/IONOS edition. Test reports #5 and #6 were already deleted from Supabase; no further report deletion is authorized.
>
> First, inspect and inventory the **actual source** of this existing Site. Compare it against the detailed tracking ledger, including the 19 missing standalone pages, separately loaded Hyperspace Pokédex, navigation, map/ladder/Holovator directions, numbered item pins, Mable research, shiny-hunting, feedback form, numeric mobile rating, and progress storage. Report source differences accurately before making changes. I do not want useful content from either guide lost.
>
> Please provide source access or a verified original-source ZIP **first**, with an evidence list of its contents and excluded secrets. After that, help me bring the two guides to verified functional and editorial parity, recording each fix in the ledger and keeping the published original working while the independent edition is tested for eventual IONOS hosting.

## Checklist for the next agent / editor (no automatic edits)

1. **Confirm identity and source access.** The Workspace project itself is the only authoritative source for its original code. The saved MHTML is only a rendered snapshot, not equivalent source. Preserve user ownership and the existing URL.
2. **Export original source read-only** if supported. Verify archive structure, file list and hashes; omit credentials and protected content. If export is not supported, state the limitation and provide a safe alternative that the editor actually supports. Avoid claiming access to ChatGPT's internal Workspace from an unrelated GitHub session.
3. **Compare before merging.** Inventory old site files, routes, 17 captured page sections, 19 missing route sources, original scripts, map and Hyperspace resources, progress mechanism, feedback and rating adapter. Compare against latest GitHub branches, not just `main`.
4. **Check outstanding changes:** PR #1 Mable audit; #2 social/IONOS; #3 missions 01–10; #4 numbered pins; #5 merge-only progress backup. **PR #4 / #5 contain a known `app.js` `$` vs `$$` zone-preview bug**; do not ship untested.
5. **Keep the original live database:** reports #13/#14 remain. Do not expose service-role keys or assume cross-origin progress transfer. The existing Supabase Edge Function only allows the original Site origin and its own origin until a carefully verified new-domain allowlist change is made.
6. **Require per-edition completion evidence:** A page/version/URL and phone/desktop check, and B PR/SHA/test receipts/deployed URL. An edit only in A, only in a B draft or only on a local reconstruction is **not two-site parity**.
7. **Only then** consider a staged independent IONOS address and controlled live migration. Never delete the original Site or force a redirect as a prerequisite.
8. Update the ledger's status table and append-only log with every verified change. Mark both editions separately. Only after both Mission 24 and 25 are genuinely corrected on both may the owner consider explicit feedback-row cleanup.

## Recent source-audit evidence to show the original Workspace editor

The **canonical state** is always the [two-site fix ledger](ATLAS_DUAL_SITE_FIX_LEDGER.md), revision 10 at this checkpoint. Recent documented evidence (no site content updated from these audits):

- [Story missions 11–20](docs/qa/MAIN_STORY_011_020_SOURCE_AUDIT_2026-11-21.md): detailed case routes and rewards; corrected Roto-Glide 15/16 *overlap* classification; no unverified quest-timing assertion.
- [Story missions 21–30](docs/qa/MAIN_STORY_021_030_SOURCE_AUDIT_2026-11-21.md): **Mega Barbaracle Rock/Fighting—not Rock/Water; Grass 2× not 4×**; **Ground neutral vs Mega Scolipede**, required Gwynn/Philippe/Asami/SBC fights, Corbeau Hotel Z ending and Lida/Naveen opponent rosters. Protect feedback #13 and #14.
- [Story missions 31–42](docs/qa/MAIN_STORY_031_042_SOURCE_AUDIT_2026-11-21.md): mandatory Philippe battle in Mission 34, correct postgame first-reward-match unlock for legendary missions vs optional 15-win Floette milestone, Mable/Grisham follow-up and other route/reward details.
- [Side missions 001–020](docs/qa/SIDE_MISSIONS_001_020_SOURCE_AUDIT_2026-11-21.md): Froakie third-course Roto-Glide requirement, incomplete item quantities, verified Shiny Mareep path, unresolved Fennekin NPC name conflict (Serebii says Jardin, Thonky says Branche).
- [Side missions 021–040](docs/qa/SIDE_MISSIONS_021_040_SOURCE_AUDIT_2026-11-21.md): museum's 12 Spewpa locations, single Kanto starter gift and Lab 3F, missing cosmetic contact-lens rewards for #030–032, fossil subsidy vs mission payout, Alpha Magikarp shallow-water route. **HOLD source disagreements:** unlock timing #030/#033/#034 and Power Belt quantity #039.
- [Side missions 041–060](docs/qa/SIDE_MISSIONS_041_060_SOURCE_AUDIT_2026-11-21.md): **#043 caught Alpha Weedle can be kept** (do not force donation), permanent Furfrou salon, nine new hair colours, #050 nighttime Goomy, #057 sewer route, full rewards. **HOLD source disagreements:** Rindo Berry, Exp. Candy M, Canari/Gwynn unlocks, sector markers.
- [Side missions 061–080](docs/qa/SIDE_MISSIONS_061_080_SOURCE_AUDIT_2026-11-21.md): #071 Alpha Watchog can be **caught or defeated** (current B says defeat), #063 XL Gogoat is **given**, #066 Shuppet is **given**, #072 Galarian Stunfisk is a **gift**, #075 Galarian Slowpoke evolution uses items (not trading). **HOLD** #061 Mega Shards/Calcium and #072 Power Weight quantity disputes; roof-sector/quest-stage evidence pending.
- [Side missions 081–100](docs/qa/SIDE_MISSIONS_081_100_SOURCE_AUDIT_2026-11-21.md): #086 Drilbur and #092 Beldum noncatchable, #087 final Furfrou cosmetics, #088 first free cab ride and optional paid choice, #090 Froslass ice bridge, #098 **Jumbo Pumpkaboo variety is different from individual XS–XL size** and must be given away; trade-evolution crosslinks. **HOLD** mismatched Exp. Candy L, Swift Feather, cash and location details.
- [Side missions 101–120](docs/qa/SIDE_MISSIONS_101_120_SOURCE_AUDIT_2026-11-21.md): **#103 Furfrou League unlock text malformed; #114 Skarmory battle-only, not catchable; #120 Ansha and Hoopa introduction misses Saison Canalside, the Lv110 Mankey fight and completion rewards**. Correct **Wild Zone 12 Alpha Avalugg** must be preserved; conflicting source claiming Wild Zone 19 is unsupported elsewhere. #119 four Jacinthe rounds supported by Serebii despite abridged Thonky; #118 and #120 unlock timing requires game verification.
- [Future fair-trading and trade evolution guide issue #7](https://github.com/trevieisking/lumiose-atlas-pokemon-za/issues/7): research fair reciprocal Pokémon swaps, which evolutions require Link Trade/items, safe tradeback practices and all base/DLC availability. **Not written or added to either guide.**
- Across 001–120, every reviewed B quest source has its source-content audit, **but the current guide HTML was not modified by these documentation-only passes**. Never mark both editions as corrected without actual on-device evidence.

**Warning:** These are source comparisons and proposed corrections. They have **not** been applied or tested on A or B, and the guide is not certified accurate. Complete per-site changes/QA only after recovering actual Workspace source. Do not auto-delete feedback rows #13/#14 after fixing only the GitHub edition.

## Important boundaries

- **No request in this file grants the Workspace editor access**, changes credits, authorizes automatic source extraction, or promises that the original Site source can be exported.
- **No destructive actions**: no database delete, progress reset, domain change, old-site replacement, repository force-push, merge or deployment based solely on reading these instructions.
- The old Site and the GitHub reconstruction are *not* guaranteed to have feature parity at present. This handoff exists precisely to make that difference visible and fixable.
- Keep Stream Bandit TCG code and its master plan outside this Pokémon guide reconciliation task.
