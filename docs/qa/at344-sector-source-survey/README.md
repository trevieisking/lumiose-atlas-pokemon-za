# AT-344 — completed sector screenshot collection

**Capture collection is complete, as confirmed by Trev on 26 November 2026. All originals remain unchanged.** The current project sources contain 26 JPEGs, including the two final central alignment views. Trev reports that the completed sector collection and the existing Wild Zone photographs provide whole-map image coverage. The next work is to align and compare working copies, check seams and obstruction, and choose the best views.

## Original-image rule

1. Preserve each original’s exact supplied bytes, filename, dimensions and metadata. Keep the full image permanently available.
2. Create a separate working copy before cropping, straightening, perspective correction, rotation, resizing, conversion, compression or annotation. Never write an edited result to the original path.
3. Give every derivative its own path and record its source filename/hash, crop rectangle and transforms where applicable, output dimensions and hash, and review status in [derivatives.json](derivatives.json).
4. Retain earlier originals and useful detail images when selecting a preferred view. A chosen crop never replaces or deletes its full source.
5. Check [SOURCE_INTEGRITY.sha256](SOURCE_INTEGRITY.sha256) before and after processing. From the repository root, run `sha256sum -c docs/qa/at344-sector-source-survey/SOURCE_INTEGRITY.sha256`.

This delivery creates archival copies and records the policy. It creates no cropped or transformed image. The derivative register starts empty.

## Two central alignment references

| Original | Role | Shared reference features |
|---|---|---|
| [20261126_161334.jpg](sources/20261126_161334.jpg) | Centre/north: Prism Tower and northern Rouge/Jaune/Magenta approaches | Prism Tower footprint and surrounding road, Saison Canal, Jaune Sector 2, Café Gallant |
| [20261126_161350.jpg](sources/20261126_161350.jpg) | Centre/south: Prism Tower down toward Bleu/Vert, Wild Zone 5 and Vert Plaza | The same central landmarks, plus the southern district connections |

Both originals are 4000 × 2252. Their visible overlap has been inspected; no transform or citywide coordinate calibration has yet been approved. Use distinctive architectural corners and road/canal geometry as primary anchors. Mask interface icons, labels, mission panels and the red cursor on working copies when they would bias alignment.

## North-up and the faint crosses

Trev’s direct gameplay observation is that the source map stays fixed north-up and cannot rotate. The photographs have consistent landmark orientation, but differing camera perspective, framing and zoom still need to be accounted for on duplicates.

The faint marks form a regular plus/cross pattern across buildings, roads and areas outside the city. Trev’s coordinate-grid interpretation is recorded as a hypothesis. AT343 established limited relative-alignment usefulness for one local overlap; it did not establish an official coordinate origin, distance units, a citywide calibration, or item-marker meaning. Match unique landmarks first, then use crosses as secondary checks. Repeating crosses alone cannot uniquely locate a place.

## Source archive and coverage

The **26 originals total 43,603,649 bytes**. This GitHub change adds **18 unchanged original copies (31,782,542 bytes)** relative to main c491cd7: the earlier prepared 16 originals and the final central pair. It reuses eight original files already preserved under AT343. Every archive copy matches its supplied source hash. All 26 frames now have a visual index; broader unlabeled overviews remain contextual sources without invented sector assignments.

The five detailed district pairs cover Vert, Rouge, Jaune, Magenta and Bleu context. The central pair links these views through Prism Tower. Existing 48-sector references and the 20 Wild Zone overview/close-up pairs remain unchanged. A label hidden under a mission icon is an indexing limitation, not proof that the geographic area is missing. Complete assembled coverage, exact registration and best-view selection remain separate checks.

[Source inventory and limitations](source-inventory.json) · [48-sector candidate register](sector-coverage.json) · [Alignment work and acceptance](alignment-plan.json)

## Original image index

| Original JPEG | Pixels | Role | Readable sector labels in this review |
|---|---|---|---|
| [20261125_170238.jpg](sources/20261125_170238.jpg) | 4000 × 2252 | wild zone detail | Vert 7 |
| [20261125_170158.jpg](sources/20261125_170158.jpg) | 4000 × 2252 | wild zone detail | Vert 6 |
| [20261125_165929.jpg](sources/20261125_165929.jpg) | 4000 × 2252 | wild zone detail | Jaune 7 |
| [20261126_104048.jpg](sources/20261126_104048.jpg) | 3951 × 2038 | city overview | Context overview; no named-sector assignment |
| [20261125_213809.jpg](sources/20261125_213809.jpg) | 4000 × 2252 | city overview | Context overview; no named-sector assignment |
| [20261126_104041.jpg](sources/20261126_104041.jpg) | 3987 × 1998 | city overview | Context overview; no named-sector assignment |
| [20261125_213830.jpg](sources/20261125_213830.jpg) | 4000 × 2252 | city overview | Context overview; no named-sector assignment |
| [20261125_213707.jpg](sources/20261125_213707.jpg) | 4000 × 2252 | city overview | Context overview; no named-sector assignment |
| [20261126_103710.jpg](sources/20261126_103710.jpg) | 4000 × 2020 | city overview | Context overview; no named-sector assignment |
| [20261126_103927.jpg](sources/20261126_103927.jpg) | 4000 × 1995 | city overview | Context overview; no named-sector assignment |
| [20261126_103721.jpg](sources/20261126_103721.jpg) | 4000 × 2009 | city overview | Context overview; no named-sector assignment |
| [20261126_104020.jpg](sources/20261126_104020.jpg) | 4000 × 2042 | city overview | Context overview; no named-sector assignment |
| [20261126_104059.jpg](sources/20261126_104059.jpg) | 3988 × 2009 | city overview | Context overview; no named-sector assignment |
| [20261126_103629.jpg](sources/20261126_103629.jpg) | 4000 × 2049 | city overview | Context overview; no named-sector assignment |
| [20261126_141757.jpg](../at343-owner-item-crosses/sources/20261126_141757.jpg) | 4000 × 2218 | district overview | Vert 4, Vert 5, Vert 7, Vert 8, Vert 9 |
| [20261126_141528.jpg](../at343-owner-item-crosses/sources/20261126_141528.jpg) | 4000 × 2148 | district overview | Vert 1, Vert 2, Vert 3, Vert 4, Vert 5, Vert 6 |
| [20261126_142840.jpg](../at343-owner-item-crosses/sources/20261126_142840.jpg) | 3642 × 1988 | district overview | Rouge 3, Rouge 4, Rouge 5, Rouge 6, Rouge 7, Rouge 8 |
| [20261126_143129.jpg](../at343-owner-item-crosses/sources/20261126_143129.jpg) | 4000 × 2252 | district overview | Rouge 1, Rouge 2 |
| [20261126_144931.jpg](../at343-owner-item-crosses/sources/20261126_144931.jpg) | 3494 × 2192 | district overview | Jaune 1, Jaune 2, Jaune 3, Jaune 6, Jaune 9, Jaune 10, Jaune 11, Jaune 12, Vert 1, Vert 3 |
| [20261126_145412.jpg](../at343-owner-item-crosses/sources/20261126_145412.jpg) | 3346 × 2252 | district overview | Jaune 3, Jaune 4, Jaune 5, Jaune 7, Jaune 8 |
| [20261126_151150.jpg](../at343-owner-item-crosses/sources/20261126_151150.jpg) | 2966 × 2252 | district overview | Magenta 4, Magenta 7, Magenta 8, Magenta 9, Rouge 3, Rouge 4 |
| [20261126_151459.jpg](../at343-owner-item-crosses/sources/20261126_151459.jpg) | 4000 × 2252 | district overview | Magenta 2, Magenta 3, Magenta 5, Magenta 6 |
| [20261126_160550.jpg](sources/20261126_160550.jpg) | 4000 × 2252 | district overview | Bleu 1, Bleu 2, Bleu 3, Bleu 4, Bleu 6, Bleu 8, Bleu 9, Bleu 10 |
| [20261126_160741.jpg](sources/20261126_160741.jpg) | 3500 × 2252 | district overview | Bleu 3, Bleu 5, Bleu 6, Bleu 7, Bleu 8, Bleu 9 |
| [20261126_161350.jpg](sources/20261126_161350.jpg) | 4000 × 2252 | centre_south | Bleu 1, Bleu 2, Vert 1, Vert 2, Jaune 2 |
| [20261126_161334.jpg](sources/20261126_161334.jpg) | 4000 × 2252 | centre_north | Rouge 1, Rouge 2, Magenta 2, Jaune 1, Jaune 2, Jaune 3, Vert 1 |

## Planning and preservation

Current planning is **Manifest 94 / Ledger 102**. The [completion tracker receipt](../ATLAS_AT344_COMPLETION_TRACKER_RECEIPT.json) records the bounded private checklist synchronization. The earlier 24-image intake and its actual revision-93 tracker update are retained in [historical source inventory](history/manifest-93/source-inventory.json), [historical sector register](history/manifest-93/sector-coverage.json), [historical readable checkpoint](history/manifest-93/README.original.txt), and [prior tracker receipt](../ATLAS_AT344_TRACKER_RECEIPT.json). The historical README is retained as raw original text; use the current inventory for working links to the preserved images.

The approved runtime remains `223762bd1a21c2e72c592e975499d13c4195ae07` at Manifest 91 / Ledger 99. Existing maps, guide pages, markers, player progress, Supabase connections, original image bytes and all 67 original requirements remain preserved. The release receipt and pinned Workspace prompt remain unchanged. No new item/access coordinates or permanent random Hyperspace markers are created.
