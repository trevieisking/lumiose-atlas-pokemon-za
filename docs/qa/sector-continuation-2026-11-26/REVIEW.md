# Vert, Rouge and Jaune sector encounter continuation

Reviewed 26 November 2026. Exact implementation base: `cd0a7c6310f6ffb0bf68a49ef3d7d9d525811005`. This follows the [Bleu/Magenta checkpoint](../sector-reconciliation-2026-11-26/REVIEW.md) and preserves that packet's observations, decisions, row identities and totals.

## Bounded result

The retained register held 62 claims across these 29 sectors. Accessible numbered-sector tables provide substantially more attributed information. This continuation reviews **312 Walking species/form rows** on the [Vert](https://rotomlabs.net/locations/legends-z-a/vert-district), [Rouge](https://rotomlabs.net/locations/legends-z-a/rouge-district) and [Jaune](https://rotomlabs.net/locations/legends-z-a/jaune-district) pages. Every one is represented by an ordinary source claim; single-source claims remain research leads.

**Twenty-three existing ordinary rows are enriched under their current IDs**, and **289 ordinary rows are added**. Twelve additional unresolved-class records are added: eleven form-specific or species-specific Alpha reports and the Rouge 4 Pidgey discrepancy. Existing Jaune 5 Garbodor gains a second Alpha source under its original unresolved-class ID. The packet therefore contains **24 original-row updates and 301 additions**.

Thirty area-specific cross-checks corroborate ordinary memberships. Twenty-two are newly supported by the existing model contract: four prior ordinary leads gain corroboration, and eighteen supported ordinary records are new. Twelve Alpha reports are also corroborated, including the retained Garbodor record, but they remain `unclassified_lead` because fixed versus random classification is unresolved. No new claim is labelled `verified`.

| District | Numbered Walking sections | Walking species/form rows | Existing → current claims |
| --- | ---: | ---: | ---: |
| Vert | 9 of 9 | 114 | 23 → 132 |
| Rouge | 8 of 8 | 90 | 13 → 102 |
| Jaune | 12 of 12 | 108 | 26 → 129 |
| Continuation | 29 of 29 | 312 | 62 → 363 |

Current additive evidence grows from **446 to 747 claims**, giving **1,019 model records including the same 272 preserved fieldbook rows**. These are evidence records, not a count of unique Pokémon. Source-lead records grow from 257 to 524, source-corroborated records from 42 to 76, and owner-survey-correlated and disputed counts remain 140 and seven. All 68 areas retain `not_comprehensive` status.

## Source and classification decisions

The [authored observations](observations.json) identify the exact source URLs, every Walking row, thirty ordinary cross-checks, thirteen bounded unresolved reports, and the other source headings considered. They inventory **58 Alpha rows and four Static Encounter rows** separately from Walking. Most Alpha rows do not yet have an independent named-area cross-check, and even matching Alpha labels do not identify fixed versus random encounters.

- **Numbered sectors only.** District-wide street/plaza entries are excluded. Bisafans' area-specific Pokémon table can corroborate a local membership; its explicitly area-independent random-spawn list cannot. The source's nested Wild Zone links do not establish a certified spatial census or prove that the sector and Wild Zone extents are mutually exclusive.
- **Useful qualified conditions.** [Rouge 3 Scraggy](https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-3.php) has a night marker and an alley description. [Vert 4 Goomy](https://www.bisafans.de/routendex/illumina-city/verte-bezirk-4.php), [Vert 5 Goomy](https://www.bisafans.de/routendex/illumina-city/verte-bezirk-5.php) and [Vert 9 Goomy](https://www.bisafans.de/routendex/illumina-city/verte-bezirk-9.php) have rain reports. [Jaune 5 Dratini](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-5.php) keeps its previously corroborated roof and source-reported sunny-weather distinction. These are qualified reports, not unrestricted-spawn assertions.
- **Material level disagreements.** [Vert 6](https://www.bisafans.de/routendex/illumina-city/verte-bezirk-6.php) names rooftop Dratini, Dragonair and Fletchling at level 28, while the numbered Walking table reports 28–29, 30–32 and 5–8 respectively. [Vert 2 Larvitar](https://www.bisafans.de/routendex/illumina-city/verte-bezirk-2.php) is reported at 12–16 versus 20–22. [Jaune 11 Cleffa](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-11.php) is 17–20 versus 11–14. Both values are retained where they differ; ordinary membership agreement does not certify the level.
- **Probability and rarity reports.** Some Hawlucha entries describe a 50% chance, and Vert 6 Dragonair is described as rare. Those descriptions remain attributed notes. They are not independently measured probabilities or proof of a fixed spawn schedule.
- **Alpha forms stay separate.** [Jaune 2](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-2.php) separately lists White and Red Flower Alpha Flabébé. Its Walking table lists Orange, Blue and White Flower ordinary records. Agreement on an Alpha form does not corroborate the ordinary form. [Jaune 3](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-3.php) has Yellow, Orange and Blue Flower Alpha reports, not ordinary flower entries in the reviewed Walking section. [Jaune 4 Pidgeot](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-4.php) is also Alpha-only in the source heading. None becomes a fixed or rotating Alpha habitat by inference.
- **Retained Alpha identities.** Vert 3 Patrat remains byte-for-byte unchanged, with its prior corroborated membership and unresolved Alpha class. Jaune 5 Garbodor retains its original ID, class, sources and notes while adding the RotomLabs Alpha report. The latter's level range differs from Bisafans. No existing fixed-Alpha fieldbook record is overwritten.
- **Rouge 4 species discrepancy.** [Bisafans](https://www.bisafans.de/routendex/illumina-city/rouge-bezirk-4.php) names Pidgey at level 39, whereas RotomLabs lists Pidgeot at 36–39 in its numbered Walking section. A separate unresolved Pidgey research record preserves that disagreement. Omission from one table is not treated as proof of absence, and neither species receives a supported habitat from this disagreement.
- **Restricted and static records.** RotomLabs marks Vert 4's Walking Pidgey row shiny-locked without explaining the associated restriction in the reviewed table. The qualifier is retained and the row remains a source lead. Static Yveltal at Rouge 2, Garbodor at Vert 8 and Emolga at Jaune 7 are not ordinary additions. Rouge 8 has both a Walking Bunnelby row at 12–14 and a separate static level-10 record; the latter supplies none of the ordinary row's conditions.
- **Forms and unknown conditions.** Source-reported flower colours and Vivillon's Meadow Pattern remain explicit. Scatterbug/Spewpa Meadow grouping is not asserted as a distinct visible form. Table question marks and absent restrictions are left unresolved. No time, weather, floor or story unlock is inferred from silence.

The cross-check establishes agreement between cited specialist reports. It does not assert that their underlying datasets or game measurements are independent. No new owner photograph or gameplay observation was obtained for this packet.

## Coverage of all 48 sector source entries

Together, the two dated packets now inspect all **48 sector source-index entries** and reconcile **45 explicit numbered Walking sections containing 484 species/form rows**. The continuation observations carry the combined index, with a reference to the correct packet for each district.

Three source-index gaps remain concrete:

| Sector | Reviewed numbered-table gap | Current handling |
| --- | --- | --- |
| Bleu 2 | No Sector 2 section on the reviewed Bleu page | Retain its existing source lead; do not infer an empty roster |
| Bleu 10 | No Sector 10 section on the reviewed Bleu page | Retain empty/unknown coverage |
| Magenta 5 | No Sector 5 section on the reviewed Magenta page | Retain empty/unknown coverage |

The [requested Bisafans Jaune 1 page](https://www.bisafans.de/routendex/illumina-city/jaune-bezirk-1.php) was inaccessible through the research tool. Its two Walking entries therefore retain attributed single-source status. Accessible Bisafans pages for Vert 7, Rouge 6 and Jaune 8/9/10/12 contain no local Pokémon encounter table; their shops, item or mission notes cannot corroborate the corresponding Walking roster. These are boundaries of the checked sources, not proof that another source could not resolve them.

This work makes the next review finite and inspectable but **does not close G3**. Remaining work includes the three missing numbered sectors; independent corroboration or explicit disposition of remaining single-source memberships; fixed-versus-random Alpha classification; material level, form and condition discrepancies; and the already documented Wild Zone disagreements. A source's complete page transcription is not proof of a complete in-game census. The 58 Alpha rows and four static rows in this continuation are an explicit inventory for that further classification work.

The canonical G3 rule permits labelled disputed claims and conditions where established. This packet introduces no requirement for a new full owner playthrough and does not demand an invented negative encounter census. A later reviewer can resolve a specific uncertainty through suitable written sources or direct evidence and record that bounded decision.

## Preservation and reproducibility

The original AT-339 directory is unchanged. The first packet's observations, reconciliation JSON and review document are unchanged, including its **446 additive / 718 total record** checkpoint. Its script now computes that checkpoint from the original baseline plus its own packet, so a later unrelated district packet cannot silently rewrite earlier totals. Its artifact manifest changes only the script hash and byte length.

The [continuation reconciliation](reconciliation.json) records every changed original ID with a prior-row SHA-256 and every appended row. `python3 scripts/reconcile_remaining_sector_encounters.py --write` applies the continuation to the current runtime evidence, requires an exact prior row or identical already-applied row, and refuses a conflicting concurrent source change. Without `--write`, it checks consistency without mutations. Its historical counts are computed from the two explicit packet stages, independently of later runtime additions.

All Bleu/Magenta and Wild Zone area data remain exact. Existing IDs, species, classes, forms, non-null conditions, notes and source claims are preserved. Current WZ14 Helioptile guidance, all six reviewed geometry records, owner photographs, the fieldbook arrays, navigation, progress and saved-data interfaces are outside the change. No source-lead row can authorize a supported habitat under the existing engine.

The local artifact hashes identify authored review files and scripts, not unretained website bytes. No provider page layout, map database, video, screenshot or copyrighted guide prose is imported.

## Validation

An independent comparison using the visible source labels matched the authored **312 of 312 Walking rows**, including all levels and form labels, with no extra or missing row. Both dated reconciliation scripts passed in read-only mode.

The focused model, evidence-chain, first-packet and continuation suites passed **33 tests**. They check exact packet composition, stable IDs, preserved conditions and citations, unchanged unrelated areas, source-lead exclusion, real supported habitat additions, form-specific Alpha separation, static-versus-Walking classification, conflicting levels and the preserved three missing-sector cases.

The first packet remains a historical checkpoint. This continuation supersedes only its statement that the other three districts still await source-table reconciliation; it does not rewrite that earlier review or declare a complete master plan.
