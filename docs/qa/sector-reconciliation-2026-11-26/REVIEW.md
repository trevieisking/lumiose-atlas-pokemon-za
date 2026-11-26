# Bleu and Magenta sector encounter reconciliation

Reviewed 26 November 2026. Implementation base: `9fba54b3c670061400c0ab7eea58a06169c35631`. Concurrent main `4c1e7870cda363d62de3f65fe6fe2f7d3f9d7b7f` was inspected; its WZ14 Helioptile correction is outside this delta and must be preserved during integration.

## Problem and bounded result

The previous evidence packet contained 47 claims for the 19 Bleu/Magenta sectors. Many were individual species samples, although accessible specialist tables explicitly grouped substantially more encounters by numbered sector. For example, Bleu 3 had three class-unresolved claims and Magenta 1 had one.

This review compares all **172 ordinary Walking/form rows** in the 16 explicitly numbered sector tables available on the [RotomLabs Bleu page](https://rotomlabs.net/locations/legends-z-a/bleu-district) and [Magenta page](https://rotomlabs.net/locations/legends-z-a/magenta-district). Each is represented by a current ordinary source claim. Area-specific Bisafans entries and the retained AT-322 area-page evidence corroborate selected memberships. Provider-wide lists are excluded from sector corroboration.

The implementation enriches **14 existing ordinary rows under their original IDs** and adds **163 rows: 158 ordinary claims and five unresolved-class leads**. Bleu/Magenta coverage grows from **47 to 210 claims**. All current source rows grow from **283 to 446**, giving **718 model rows including the unchanged 272 preserved fieldbook rows**.

Twenty additional ordinary memberships now meet the existing `source_corroborated` contract: eight previously recorded claims gain corroboration, and twelve ordinary memberships are newly represented. Four further corroborated Alpha membership reports retain `unclassified_lead` because fixed versus random Alpha class is unresolved. Single-source ordinary claims remain `source_lead`; the existing model exposes them as attributed research without adding supported species-habitat highlights.

## Area coverage

| Area | Existing → current claims | Walking/form rows reviewed |
| --- | ---: | ---: |
| Bleu 1 | 2 → 2 | 1 |
| Bleu 3 | 3 → 14 | 11 |
| Bleu 4 | 2 → 16 | 14 |
| Bleu 5 | 2 → 15 | 14 |
| Bleu 6 | 5 → 13 | 7 |
| Bleu 7 | 7 → 22 | 20 |
| Bleu 8 | 2 → 12 | 10 |
| Bleu 9 | 1 → 6 | 6 |
| Magenta 1 | 1 → 13 | 12 |
| Magenta 2 | 5 → 10 | 6 |
| Magenta 3 | 2 → 10 | 8 |
| Magenta 4 | 1 → 13 | 11 |
| Magenta 6 | 3 → 23 | 20 |
| Magenta 7 | 5 → 18 | 14 |
| Magenta 8 | 2 → 12 | 10 |
| Magenta 9 | 3 → 10 | 8 |

Bleu 2 has no numbered-sector section in the reviewed table; its existing lead remains intact. Bleu 10 and Magenta 5 remain empty/unknown. Their overlapping Wild Zones do not establish a separate complete sector roster. The 16 tables have been reconciled as attributed source coverage; **none of the 19 sector rosters is declared comprehensive**.

## Source decisions and useful conditions

The [authored observations](observations.json) identify every table row, exact source URL, specific cross-check, reported level, and exclusion. The source comparisons are bounded as follows:

- **Named-sector membership:** Only explicit numbered headings establish this claim. Street/plaza records are not spread into nearby sectors. Bisafans distinguishes its area-specific table from a generic random-spawn list; that generic list is not used as independent sector evidence.
- **Ordinary versus Alpha:** RotomLabs' navigation totals include some Alpha-only species. Bleu 6 has seven Walking rows, not ten ordinary species. Pansage, Pansear and Panpour are separately corroborated Alpha reports. Magenta 9's Kakuna is also Alpha-only in this table. All four remain class-unresolved and cannot authorize an ordinary, fixed Alpha or rotating Alpha habitat.
- **Special acquisitions:** Gift and Static Encounter sections are not Walking rows. Existing Fennekin gift and Mawile boss records remain separate. The static Weedle, Carbink and Diancie listings are not silently converted to ordinary habitat claims.
- **Useful qualified conditions:** [Bleu 8 Scraggy](https://www.bisafans.de/routendex/illumina-city/cyan-bezirk-8.php) has an explicit night marker and roof description. [Bleu 9 Goomy](https://www.bisafans.de/routendex/illumina-city/cyan-bezirk-9.php) has a rain/courtyard report. [Magenta 1 Cleffa](https://www.bisafans.de/routendex/illumina-city/rose-bezirk-1.php) and [Magenta 8 Dratini](https://www.bisafans.de/routendex/illumina-city/rose-bezirk-8.php) have roof descriptions. These conditions remain labelled source-reported; exact spawn coordinates and routes are not inferred.
- **Level disagreements:** Numerous Bisafans values differ from RotomLabs. Scraggy, for example, is reported at 20–23 versus 21–24. Both values remain attributed in the evidence; no preferred exact level is manufactured. Corroborating membership does not verify every attached level, floor or condition.
- **Forms:** Flower colours and Vivillon's Meadow Pattern remain separate source-qualified form claims. Scatterbug and Spewpa retain species-level records; a provider's Meadow grouping is not represented as a distinct visible form. Generic species corroboration is not used to certify every colour/pattern.
- **Riolu in Magenta 4:** Bisafans reports a rooftop encounter, while the reviewed RotomLabs sector table omits it. The report is retained separately as an unresolved membership/class lead; omission from a table is not treated as proof of absence.

Source agreement means the stated bounded claim is corroborated. It is not a claim that the providers are independent game-data measurements. No new record receives `verified` status.

## Preservation and reproducibility

The original `docs/qa/at339-encounters/` packet is unchanged by this work. The [separate reconciliation packet](reconciliation.json) records every changed original ID, its prior-row SHA-256, its reviewed replacement, and all appended rows. Existing source-specific unresolved entries remain available; adding a corroborated ordinary claim does not rewrite an older provider's static/unclassified claim.

`python3 scripts/reconcile_sector_encounters.py --write` applies only this delta to the current evidence file. It preserves geometry and every other area, refuses a conflicting change to a targeted original row, and accepts an already-applied identical delta. Running it without `--write` verifies the packet and runtime data without mutations. This permits integration on newer main without replacing its WZ14 correction or newly reviewed outlines.

All original encounter identities, classifications and form fields are retained. Existing non-null conditions, notes and source citations remain. No Wild Zone array, image, marker, map geometry, progress key, runtime engine, player navigation, or original Workspace source is changed.

Artifact hashes identify these authored review files and the reconciliation script. They do not claim to be hashes of unretained original website HTML. Source URLs, review date and factual observations are retained instead of copying a provider's page or proprietary map database.

## Validation and remaining work

- An independent comparison of the authored observations against the retrieved, explicitly headed specialist tables matched **172 of 172 rows**, including source level ranges and form labels, with no missing or extra Walking rows.
- The focused model, current-evidence and new sector-reconciliation suites passed **26 tests**. They check stable IDs and original source retention, all unrelated areas, source/ordinary/Alpha separation, material condition qualification, distinct forms, real habitat results and continued exclusion of unsupported claims.
- A read-only application of this packet to concurrent main `4c1e7870cda363d62de3f65fe6fe2f7d3f9d7b7f` succeeded. Every targeted prior-row hash matched; its new Helioptile daytime/clear-sky conditions, all other Wild Zone data and all geometry were preserved.
- The original seven Wild Zone disputes, 140 owner-survey-correlated rows, 38 fixed Alpha rows and WZ20's 15 ordinary / 67 rotating entries remain unaffected.
- The delta adds no comprehensive-roster signoff or geometry approval. Remaining source reconciliation includes the other districts, the three unrepresented numbered-sector tables, material conditions/forms, fixed-versus-random Alpha classification and the already documented Wild Zone differences. G3's existing rule permits explicit disputed labels; this review adds no requirement for a new complete owner playthrough.
