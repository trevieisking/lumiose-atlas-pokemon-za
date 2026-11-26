# AT-344 — ongoing sector photograph survey

**Trev is progressively unlocking sectors and supplying clearer JPEG map photographs.** The aim is to choose the strongest, most complete view for each of the48 sectors. Collection and per-sector quality selection remain in progress.

## Sources preserved

All **24 current original JPEGs** are now represented by byte-identical repository copies: **16 originals added here** (28,653,979 bytes) and **8 existing AT343 originals reused**. The complete original set is 40,475,086 bytes. Only two photos are newly supplied in this step; fourteen earlier originals had recorded hashes but their full JPEG bytes had not yet been archived. Existing crops and map assets are preserved.

[Source inventory](source-inventory.json) records exact hashes, dimensions, provenance, visible coverage and limitations. [The 48-sector register](sector-coverage.json) links the stable sector IDs and existing runtime sources to original-photo candidates. Fourteen earlier originals still need per-frame sector indexing; their bytes are retained without guessing that mapping.

## New Bleu views

| Original | Dimensions | Readable sector labels | Coverage and limits |
|---|---|---|---|
| [20261126_160550.jpg](sources/20261126_160550.jpg) | 4000 × 2252 | Bleu 1, 2, 3, 4, 6, 8, 9, 10 |Broad Bleu Plaza/Wild Zone 5 view. Menu, cursor and icons obscure parts; Sector 8 and peripheral buildings continue beyond the frame.|
| [20261126_160741.jpg](sources/20261126_160741.jpg) | 3500 × 2252 | Bleu 3, 5, 6, 7, 8, 9 |Extends south toward Aymlis Park and South Boulevard; overlaps the first image. Top/right/bottom clipping and UI occlusion remain.|

Across the pair, all ten Bleu sector labels are readable. This improves the earlier overview set’s limited Bleu coverage; it does not establish that all ten complete sectors or every boundary are shown. No new alignment or calibration was performed for this pair.

## How the best views will be selected

1. Preserve the original JPEG and its hash before considering any derivative.
2. Match the correct sector using readable names, buildings and roads, retaining the source game’s fixed north-up direction. Camera tilt and perspective concern the photograph.
3. Compare the candidate with the existing sector photo. Prefer a complete intended view with surrounding context and legible details; record clipping, menu/cursor/icon occlusion and any evidenced unlock conditions.
4. Retain earlier originals and useful detail views. Record a preferred view only after comparison, with the reason and source references.
5. Validate any later gallery replacement, geometry or coordinate change separately. This intake prepares the source material and does not replace live map assets.

The repeating crosses remain a bounded relative-alignment aid from AT343. Their game distance units are unknown, and a cross alone does not establish an item pickup. A visible sector label is not proof of a complete sector image, floor inventory, access route or unlock completion.

## Original image index

| Original JPEG | Pixels | Archive action |
|---|---|---|
| [20261125_170238.jpg](sources/20261125_170238.jpg) | 4000 × 2252 | Original added |
| [20261125_170158.jpg](sources/20261125_170158.jpg) | 4000 × 2252 | Original added |
| [20261125_165929.jpg](sources/20261125_165929.jpg) | 4000 × 2252 | Original added |
| [20261126_104048.jpg](sources/20261126_104048.jpg) | 3951 × 2038 | Original added |
| [20261125_213809.jpg](sources/20261125_213809.jpg) | 4000 × 2252 | Original added |
| [20261126_104041.jpg](sources/20261126_104041.jpg) | 3987 × 1998 | Original added |
| [20261125_213830.jpg](sources/20261125_213830.jpg) | 4000 × 2252 | Original added |
| [20261125_213707.jpg](sources/20261125_213707.jpg) | 4000 × 2252 | Original added |
| [20261126_103710.jpg](sources/20261126_103710.jpg) | 4000 × 2020 | Original added |
| [20261126_103927.jpg](sources/20261126_103927.jpg) | 4000 × 1995 | Original added |
| [20261126_103721.jpg](sources/20261126_103721.jpg) | 4000 × 2009 | Original added |
| [20261126_104020.jpg](sources/20261126_104020.jpg) | 4000 × 2042 | Original added |
| [20261126_104059.jpg](sources/20261126_104059.jpg) | 3988 × 2009 | Original added |
| [20261126_103629.jpg](sources/20261126_103629.jpg) | 4000 × 2049 | Original added |
| [20261126_141757.jpg](../at343-owner-item-crosses/sources/20261126_141757.jpg) | 4000 × 2218 | Existing original retained |
| [20261126_141528.jpg](../at343-owner-item-crosses/sources/20261126_141528.jpg) | 4000 × 2148 | Existing original retained |
| [20261126_142840.jpg](../at343-owner-item-crosses/sources/20261126_142840.jpg) | 3642 × 1988 | Existing original retained |
| [20261126_143129.jpg](../at343-owner-item-crosses/sources/20261126_143129.jpg) | 4000 × 2252 | Existing original retained |
| [20261126_144931.jpg](../at343-owner-item-crosses/sources/20261126_144931.jpg) | 3494 × 2192 | Existing original retained |
| [20261126_145412.jpg](../at343-owner-item-crosses/sources/20261126_145412.jpg) | 3346 × 2252 | Existing original retained |
| [20261126_151150.jpg](../at343-owner-item-crosses/sources/20261126_151150.jpg) | 2966 × 2252 | Existing original retained |
| [20261126_151459.jpg](../at343-owner-item-crosses/sources/20261126_151459.jpg) | 4000 × 2252 | Existing original retained |
| [20261126_160550.jpg](sources/20261126_160550.jpg) | 4000 × 2252 | Original added |
| [20261126_160741.jpg](sources/20261126_160741.jpg) | 3500 × 2252 | Original added |

## Planning and preservation

Current planning is **Manifest 93 / Ledger 101**. The separate [tracker receipt](../ATLAS_AT344_TRACKER_RECEIPT.json) records the actual private metadata synchronization. Existing status/proof fields remain scoped to their original work; the new source-quality survey remains ongoing.

The approved runtime remains `223762bd1a21c2e72c592e975499d13c4195ae07` at Manifest 91 / Ledger 99. Its release receipt and Workspace prompt are unchanged. Existing maps, source-image bytes, guide pages, markers, player progress, Supabase integrations and all 67 original requirements are preserved. This intake changes no runtime gallery, geometry or fixed item/access marker, and does not mark random Hyperspace distortions.
