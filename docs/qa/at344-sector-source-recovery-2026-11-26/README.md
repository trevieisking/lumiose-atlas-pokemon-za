# AT-344 source archive recovery

The interrupted source archive is recoverable in full. All **26 supplied JPEG originals** match the earlier archive branch byte for byte. This recovery brings the historical archive into the current release without replacing any current map, photograph, or full-frame copy.

## What was actually saved

The source branch `docs/atlas-complete-sector-sources-20261126` at commit `87ea05e97851a745c1a01ee5afb2b5da5c652887` already contains all 26 originals and its survey records. The baseline main commit for this recovery is `3259de9a8d70d5851ae208fb812c4774cc59c2ec`.

| File group | Existing on baseline main | Recovery action |
|---|---|---|
| Eight original district JPEGs | Exact original bytes under AT-343 | Keep their existing paths and reuse them. |
| Four Bleu/central full-frame copies | Same decoded RGB pixels, with camera metadata and embedded non-frame payloads omitted | Preserve these copies unchanged and restore the separate exact originals at their historical AT-344 paths. |
| Fourteen additional original JPEGs | No matching original blob | Restore their exact historical AT-344 paths and bytes. |
| Historical survey metadata and two tracker receipts | On the source branch | Restore exact recorded bytes. Treat their revision 94/102 statements as historical. |

The original collection totals **43,603,649 bytes**. Eighteen original files, totaling **31,782,542 bytes**, are restored alongside the eight already present originals. Thirty historical packet files are restored in all. No original is cropped, recompressed, renamed, or overwritten.

[The recovery inventory](source-recovery.json) maps every supplied filename to its exact repository path, SHA-256, dimensions, original branch, and any separately preserved full-frame version. [The historical file inventory](preserved-files.json) freezes the 30 restored files so the recovery can be replayed and checked.

## Scope of the verification

Every one of the 26 current project JPEGs matches both the restored/reused repository file and its original source-branch blob. All 26 JPEGs decode. The four existing full-frame versions remain intact and have the same decoded RGB pixels as their corresponding exact originals; they are distinct files, not corrupt originals. No GPS EXIF field was found in this 26-file collection.

The supplied video is also the same recording used by the prior AT-343 study: SHA-256 `9d95aac4c6f865a9fe63767e45091b6b98462d7b7c6b8728f435e426342ffda3`, 107,198,387 bytes. Its different project filename does not indicate a new recording. Its original remains a project source; this recovery adds no public video file or player video feature. The earlier [video provenance](../at343-video-grid-2026-11-26/source-provenance.json) and measurement evidence remain unchanged.

Trev reported the photograph collection complete. The historical register has all **48 sector IDs** with candidate source context. These are visible-label/context associations, and this recovery does not newly certify whole-city geometric coverage, exact cross coordinates, complete sector framing, seams, or best-view selections. Alignment work must use copies of these preserved originals, retain source hashes, and evaluate architectural controls and held-out checks before assigning coordinates.

## Historical records and current authority

The restored [source survey](../at344-sector-source-survey/README.md), [sector register](../at344-sector-source-survey/sector-coverage.json), [alignment plan](../at344-sector-source-survey/alignment-plan.json), and receipts describe their earlier checkpoint. Their old runtime SHA and Manifest 94 / Ledger 102 labels are preserved as evidence. They do not supersede the current master plan, release, or Workspace handoff, and restoring a tracker receipt does not execute a new Supabase update.

Only the archive subtree and its two receipts are recovered from that branch. Its older runtime, planning files, and guide content are not applied. All existing source versions remain available. No item pins, structure pins, random Hyperspace markers, progress keys, or Supabase connections are changed by this archive recovery.

## Reproduce the integrity checks

Run from the repository root:

```sh
python docs/qa/at344-sector-source-recovery-2026-11-26/verify_sources.py
```

From the repository root, the direct checksum list also verifies the 26 originals:

```sh
sha256sum -c docs/qa/at344-sector-source-recovery-2026-11-26/SOURCE_INTEGRITY.sha256
```

The script checks all 26 originals, the four preserved full-frame versions, all 30 restored historical files, and the 48 distinct sector IDs. These checks concern preservation and intake; they do not certify map alignment.
