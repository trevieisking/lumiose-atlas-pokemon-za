# AT-348 A1-02 — Wild Zone original photo source matching and link repair

**27 November 2026 — Manifest 107 / Ledger 115.** Main remains `bdfce92bfa7324517d0a1e2f8db7eec84983eefb`; PR229 reviewed parent `fc5142b6ad7e7bca4ad3483df8cfeec37fc3ea17` passed exact Explorer workflow [46066870386](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46066870386) (unit, real Chromium desktop/phone emulation and shared-area browser jobs) and article workflow [46066870511](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46066870511). A1-01 ten-photo gallery automated assertions passed; independent review of saved gallery screenshots remains open. All eight supplied original JPEGs match archived SHA-256, size and Git blob SHA. Visually matched the exact reduced WZ15 and WZ17 overview PNGs against their 4000×2252 originals (165929 and 170158); candidate changes only the two full-size links and uses the same original blobs under runtime asset paths, preserving every existing preview and record. WZ17 close-up original 170238 is independently identified as the correct zone/detail, but exact reduced-blob visual retrieval failed; do not replace that link yet. New unit/browser checks cover unchanged thumbnails, exact original bytes, decoded dimensions and four surfaces. New-head checks and independent visual review pending. Preserve all photos, IDs, geometry, progress and feedback/Supabase contracts. Workspace v40 last recorded, v39 rollback; persisted draft and live v41 not verified. Private tracker row read at revision 104; scoped sync after GitHub readback. HOLD; no new PR or publication. Next: A1-02: verify the exact reduced WZ17 close-up against 20261125_170238.jpg; review A1-01 and A1-02 saved phone/desktop screenshots and exact new-head tests; then A1-03 whole-guide imagery and A3 access evidence.

## Verified original integrity and visual matches

Local project JPGs were hashed directly (SHA-256 and Git blob SHA1); all eight agree with the exact branch source inventory and tree size/blob. No existing archive or PNG altered. Directly inspected the local 4000×2252 photos and fetched reduced WZ15 and WZ17 overview PNGs by exact blob SHA. The survey cards, label/cursor positions, icon placements, area outlines and captured frame boundaries visually match. Preserve the 1536×865 thumbnails for bandwidth; only click destinations change to identical archived JPEG bytes. Five other originals are broader city overview photographs and are not assigned to Wild Zone thumbnails.

| Source file | SHA-256 | Git blob SHA | Bytes |
|---|---|---|---:|
| 20261125_165929.jpg | 7d86a7863b52cf9fa45c223655f524e0fcf9917a72260034a8fde3804ca2891a | 361156f621d5377c9f6a115d17c7a435de668c43 | 1647674 |
| 20261125_170158.jpg | f6c2cf3ed37d362dfc54890c3730614b35f4a709b378e8eeffcc3e47363b9ee5 | 0e722fac8c6919e297d95b398659b73de2493c46 | 1420507 |
| 20261125_170238.jpg | 57a4746a3896f8f4abf664486aa79f740d884e2cfe8bc73608f57d1085e38617 | 54cfbb0b3127ca09bfdc9c3e2360c961af4a3392 | 1564974 |
| 20261125_213707.jpg | 60ce7cb5ed4cac9e38ee5cb92cc2a346ab3ec4bef25c3cf8c0b11a6678e6a7b6 | e96685431560ef0dc4d0c0f596a0ba763a103518 | 2102179 |
| 20261125_213809.jpg | d78e3643af7fb447cbff6ec4096f797fc0c9692e17b5c405c0e952220767fa55 | 77c353f200250bc6314ec26e65e58c3f856548a7 | 1924588 |
| 20261125_213830.jpg | 50879abc45b6ce969efba79009546cfa99344057eb2cfb0fee8b02bb2a2a5e3e | a5922c1ac0ec26095a603cbf0abbfffa60f11986 | 2230899 |
| 20261126_104041.jpg | a4f196979545f8a82d188b3912a0b2dd5fed6339970a2aebacea0a48b44bf71f | c086cf37fa1dcca5c3bb0cc0af30dd74c6864766 | 1711073 |
| 20261126_104048.jpg | 47bd5952180f9ec407a3c35921dec8f6cb360a1e66ed2bdb12c1ede271845cc8 | 6475e2fc2850ba6edcadd5dc907b32714782e178 | 1854391 |

## Verified link destinations

- assets/atlas/wild-zones/wild-zone-15-overview.png (blob 3803bcd51c15900e138d7263b82a48eff283ce99) → assets/atlas/wild-zones/originals/wild-zone-15-overview.jpg; source 20261125_165929.jpg, unchanged blob 361156f621d5377c9f6a115d17c7a435de668c43.
- assets/atlas/wild-zones/wild-zone-17-overview.png (blob c4709da5da42a3fc195de49c59903e9fd1aec1f8) → assets/atlas/wild-zones/originals/wild-zone-17-overview.jpg; source 20261125_170158.jpg, unchanged blob 0e722fac8c6919e297d95b398659b73de2493c46.

Third source: 20261125_170238.jpg shows Zone 17, Café Cyclone, Vert Street, the same green two-lobe zone and a close-up without survey overlay. Batch 04 labels the corresponding reduced PNG as the Zone 17 close-up (blob d83a6e0a3cd164ecef9bd33c96d9c29d0453811e); the connector returned an empty base64 payload for that >1 MB PNG and other binary routes were rejected. This is not an exact-frame visual comparison. Keep its existing link until verified. No coordinates inferred from captured session symbols.

## Preservation and acceptance

The existing shared fieldbook record array stays unchanged, and only two anchor destinations in each static mirror change. Add two original JPEG blobs at runtime paths without changing the archives or source manifests. Unit checks must verify the exact original hashes, equality with archived bytes, unchanged 40 PNGs and roster. Phone and desktop tests verify thumbnail decoding, full-resolution JPEG decoding and dimensions for both repaired links across all four surfaces. The prior gallery's exact-head CI is green, but screenshots have not been independently reviewed. New candidate CI, manual screenshots and actual built Pages output verification remain open. No live merge or Workspace change.
