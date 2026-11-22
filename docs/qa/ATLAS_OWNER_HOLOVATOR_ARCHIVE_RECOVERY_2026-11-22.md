# AT-263 — recovered owner Holovator map/photo archive · read-only integrity and use plan

**Checked:** 22 November 2026. **Edition:** Independent GitHub Atlas, with separate original ChatGPT Workspace Site.  
**Purpose:** Preserve the owner's long day of map/photo surveying and make source-backed image improvements without overwriting existing maps, introducing false exact coordinates, or publishing unreviewed originals.

## Verified archive identity

| Item | Evidence |
|---|---|
| Filename | `lumiose-atlas-holovator-survey-combined-2026-11-22.zip` |
| Exact archive size | **54,291,692 bytes** |
| SHA-256 checksum | `2c819b0817a941e59019240322574ee2b954b54c4e0b567f531f62c1b663c733` |
| ZIP integrity | PASS; `testzip()` found no corrupt members |
| Embedded `SURVEY_MANIFEST.json` | **217/217** entries matched recorded SHA-256 AND byte sizes, plus the manifest itself = **218** archive members |
| Separate source photo batches | **16** named survey packages |
| Photo filenames | **102** `.jpg` images and **81** `.heic`-named images |
| Crucial file-format caveat | All 81 entries with `.heic` extension start with **JPEG** magic bytes, not a verified HEIF/HEIC header. Preserve original filenames but **do not claim lossless original HEIC camera files** |
| Existing private Library entries | `/Pokemon Atlas/lumiose-atlas-holovator-survey-combined-2026-11-22.zip` and `/lumiose-atlas-holovator-survey-combined-2026-11-22.zip`. One exact Library copy was successfully materialised and cryptographically checked; the other Library entry's bytes were not independently verified |
| Additional safe records | The owner's private Pokémon Atlas Library also contains a generated `ATLAS_RECOVERED_OWNER_PHOTO_INTEGRITY_2026-11-22.json` and an unpublished candidate photo contact sheet |

**Important:** The original ZIP remains in the **private ChatGPT Library**. This public GitHub text register does **not** contain the originals or publish any additional photographs. Do not replace, recompress or delete the ZIP.

## Comparison with current GitHub map

On the checked GitHub `main` baseline (`a1a0b4b44a704cdd3adf52fd0e225cf8eb2aef96`), `assets/atlas/holovators/` already contains **90 original owner JPG files**, used by the independent `atlas-explorer-data.json` explorer. The map still has 20 Wild Zones, 48 sector names, 21 owner-researched Holovator leads, 1 ground-photographed Hotel Z ladder, and **zero verified exact lift-door pixels**.

A **filename and path reconciliation** of the archive identifies **17 JPEG candidates not in that GitHub photo directory**. This is a file-presence comparison, **not** an assertion that 85 overlapping file names were compared byte-for-byte.

| Evidence group | Archive-ready images | Existing gallery status | Correct next action |
|---|---:|---|---|
| **Jaune Sector 12 / Wild Zone 6** (`jaune12-wz6`) | **5**: ground lift, city map, neighbourhood map, close map and rooftop arrival | The Explorer currently reports `photo_status: not_hosted` | Inspect original photographs and requirements; import the five genuine JPGs on a separate branch if suitable; preserve the existing approximate-map warning |
| **Café Cyclone / Vert Sector 5** (`vert-cyclone`) | **12** (two separately archived six-photo sets, one top-level and one in `github-ready`) showing arch entry, courtyard lift, map views and roof arrival | The Explorer currently reports `photo_status: not_hosted` | Compare both photo sets and select the best six without inventing or merging metadata; import once on a tested branch and add a photo gallery to the existing record |
| **Favorite Holovator / Bleu Sector 3** (`bleu3-fav`) | Not in this recovered combined ZIP under that location | Still `not_hosted` | Search separately retained Holovator #61 clean-photo package, hash-check and visually validate before import |
| **Café Classe south / Vernal Pokémon Center** (`vert4-south`) | Not identified in this recovered combined ZIP | Still `not_hosted` | Use the separate owner survey or request a new proven source; never substitute an unrelated lift photo |

The **five** `vert4-cafe-classe-central` JPGs already in GitHub are a separate gallery; they were not found as matching JPEG filenames in the 16 recovered source packages. Do **not** use the central lift images as a substitute for south/east.

## Photos are evidence — not exact coordinates

The archive's own manifest says **“prepared for GitHub review; not published”**. Its photo directions put Café Cyclone at the broad arch by Coulant Waterway, through the grassy courtyard, and then the roof. The Jaune Sector 12 batch depicts the lift inside/near Wild Zone 6. These photo sequences support written navigation; the image pixels **do not** automatically register an exact native `1920×1920` map pin.

Preserve the user's permanent-versus-random **Hyperspace** distinction. Do not map daily moving DLC distortions as fixed locations. Do not mark an unverified scaffold, ladder roof landing or indoor doorway as exact.

## Safe execution checklist

- [x] Locate recoverable ZIP in private Library (two entries; one verified intact).
- [x] Verify ZIP CRC, total size, archive SHA-256 and 217 embedded manifest item hashes/sizes.
- [x] Identify both recoverable missing photo galleries and preserve existing 90 GitHub JPGs untouched.
- [x] Save private checksum inventory and an unpublished visual contact sheet in the Pokémon Atlas Library.
- [ ] Select which of the two Café Cyclone six-photo sets has the cleanest in-game guide framing.
- [ ] Import verified, appropriately cropped **JPG** assets on a bounded GitHub branch, add only correct map-gallery references.
- [ ] Re-run source image integrity, desktop/mobile map and guide/progress regression checks, review screenshot evidence.
- [ ] Deploy **GitHub Edition B only** after validation. Original ChatGPT Site remains independently hosted; never claim it was automatically updated.

**No production source, Supabase, player progress, existing map position, published image, or original Workspace Site needs to change to record this audit.**
