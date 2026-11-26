# AT-342 — Reviewed GitHub release evidence

This package records the finite Interactive Map 2.0 release merged through [PR #204](https://github.com/trevieisking/lumiose-atlas-pokemon-za/pull/204). Earlier receipts remain unchanged; the final deployed release is distinguished from historical candidates.

| Identity | Value |
| --- | --- |
| Tested PR head | `f030c4ae3e33259105bf351885c386f6b53900d9` |
| Reviewed and merged tree | `0288e63d1d52fe5f95dc76e0c01631715310e54a` |
| Merged release | `223762bd1a21c2e72c592e975499d13c4195ae07` |
| Pages deployment | [Run 45844017622](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45844017622), success at 2026-11-26T14:57:51Z |
| Live byte verification | 35/35 HTTP 200 responses, matching complete bytes; zero mismatches/errors |

## Final records

- [Visual/live aggregate](release-visual-live-aggregate.json) — SHA-256 `0a9b85826b85b00710227f16f45e8e397d1c1289ff97554f61bfa2cf2ec8bbd3`.
- [Coordinator live-browser observations](live-browser-observations.json) — SHA-256 `45233a84b43b3339c774b0e218d2b8669d842f964ad0cd02f899a2dc466e1629`.
- [CI summary](candidate/ci-run-summary.json), [merge receipt](candidate/merge-receipt.json), [Pages receipt](candidate/pages-receipt.json), [35-file HTTP check](candidate/live-http.json), and [tested-change inventory](candidate/tested-change-inventory.json).
- [Directory manifest](manifest.json) records hashes, byte sizes and source paths for every packaged file other than the manifest itself.

## Review chain

| Review | SHA-256 |
| --- | --- |
| [final-code-review.json](candidate/final-code-review.json) | `671964a70e28e90c348cd50df35afde7fbaa28da92fc2d9795585e01d4bec168` |
| [final-geometry-visual-review.json](candidate/final-geometry-visual-review.json) | `0969aff3a7f0e98eaa9cd5cbe2a2b03699568868adf6ab9c741d99860b377abb` |
| [final-directory-visual-review.json](candidate/final-directory-visual-review.json) | `fb67ea416457bdba223a864b22d2832d58639037592d591b07ba7f53122ccde8` |
| [final-misc-visual-review.json](candidate/final-misc-visual-review.json) | `cde4299b8aa8ff52ebb73af3a7691145d6d64ef75e804c056d47cb3c5e2b852a` |
| [final-runtime-visual-review.json](candidate/final-runtime-visual-review.json) | `f89daaeafc6d3bcaee0f3ff7edb6f36cf4c35af88861324913378d3801dc20cd` |
| [fashion-image-comparison.json](candidate/fashion-image-comparison.json) | `57695154a9845faa8d3eb58a63364755732edf2d80a1f35a374db73c533c5a25` |

Reviewers directly inspected all 32 images changed from 377fb91: ten sector frames, eleven directory/source-photo views, six miscellaneous guide views and five runtime views. Other unchanged images were compared by exact hashes with the limits recorded in each receipt. Ten current sector-frame PNGs are retained under `screenshots/sector-framing/`; they are CI element crops from five sampled sectors, not full pages or live CUA captures.

The shared-area and collectible proof JSONs are under `candidate/areas/` and `candidate/map/atlas-collectibles/`. Referenced 377fb91 and 82f710d records are under `historical/`. Their original decisions, timestamps, absolute source paths and limitations are preserved. The manifest maps each copied source to its packaged path. Historical candidate approvals do not replace the final release chain above.

## Live observations and limits

The coordinator viewed all five Jaune 7 photographs together after View photos and details; all five reported complete 1536×865 source dimensions. This resolves the earlier gallery-capture completeness gap. Historical gallery screenshots still correctly show only one painted image each.

The coordinator checked the fully visible Rouge Sector 4 outline, zoom 4.06→5.28, rotation 0→45°, compass reset to 0°, and reviewed-outline visibility off/on, ending at 4.06× north-up. Three CUA screenshots were visually reviewed, but no screenshot files were saved. The live receipt contains reported actions and metadata, not independently reinspectable screenshot pixels.

CI phone coverage is viewport/touch emulation; no physical device proof is claimed. The development-log sample covers only the last ten entries and is not an overall zero-errors statement. No account operation, Supabase mutation or public-data mutation was performed. The original Workspace upgrade and broader guide/Alpha obligations remain separate. This package changes no runtime, canonical gate, master-plan, tracker or remote state.
