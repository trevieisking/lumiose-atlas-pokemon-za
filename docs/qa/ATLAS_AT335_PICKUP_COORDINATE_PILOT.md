# AT-335 — Recovered item-coordinate comparison pilot

25 November 2026 · baseline `7d9bafb8e4eb893e7fab48e40df10c8ef80832d1`. Extends merged AT-334 without duplicating or modifying its 146 recovered records. Actual Library v35/v37 archives independently reopened; the full canonical ID/zone/name/XY/height fingerprint matches AT-334. The original city JPEG is the identical 1920px Git blob. All 146 are historical candidate points, not newly measured pickups. Original credit identifies Serebii alignment, so apparent agreement with other sources may reflect common underlying game data.

## Exploratory fit

Select candidates using explicit zone or distinctive item descriptions rather than nearest transformed positions. Six fit pairs across WZ3/4/9/17, five held out (including WZ11/13), and two WZ2 diagnostics excluded because of multiple candidates or differing descriptions. Independent local NumPy calculation and a second least-squares computation reproduce the result. No permanent architecture controls or actual game-position verification.

| Archive ID | WZ | Item | Source XY | Role | Residual px |
|---|---:|---|---|---|---:|
| 9033 | 4 | Great Ball | 10885, 4199 | fit | 2.099 |
| 9034 | 4 | Revive | 11447, 4275 | fit | 2.431 |
| 9036 | 4 | Net Ball | 10603, 4251 | fit | 3.729 |
| 9119 | 4 | Dusk Ball | 10868, 4774 | holdout | 4.378 |
| 9120 | 4 | Heal Ball | 11311, 4879 | holdout | 6.292 |
| 8258 | 2 | Great Ball | 12301, 13155 | diagnostic | 4.741 |
| 8257 | 2 | Heal Ball | 11351, 12454 | diagnostic | 3.808 |
| 9128 | 3 | Great Ball | 9597, 6948 | fit | 4.513 |
| 9139 | 3 | Revive | 10121, 7067 | holdout | 6.669 |
| 8784 | 9 | Dusk Ball | 3646, 11458 | fit | 1.003 |
| 8995 | 13 | Great Ball | 8634, 3592 | holdout | 1.459 |
| 8110 | 17 | Dusk Ball | 14525, 14072 | fit | 0.514 |
| 8684 | 11 | Net Ball | 15024, 12099 | holdout | 5.961 |

Sources: [Great Ball](https://www.gamerguides.com/pokemon-legends-z-a/database/items/poke-balls/great-ball), [Revive](https://www.gamerguides.com/pokemon-legends-z-a/database/items/medicines/revive), [Net Ball](https://www.gamerguides.com/pokemon-legends-z-a/database/items/poke-balls/net-ball), [Dusk Ball](https://www.gamerguides.com/pokemon-legends-z-a/database/items/poke-balls/dusk-ball), [Heal Ball](https://www.gamerguides.com/pokemon-legends-z-a/database/items/poke-balls/heal-ball); descriptive cross-checks [French zones](https://www.pokemon-france.com/en/guides/pokemon-legends-z-a/wild-zones/), [English Poké Balls](https://altissimo1.github.io/Supplementary-Series/Legends/Legends-Z-A/poke-balls.html), [Japanese items](https://gamepedia.jp/pokemon-legends-z-a/archives/16622).

Candidate fit RMS **2.765 px**, held-out RMS **5.308 px**, held-out max 6.669 px. Leave-one-fit-zone-out RMS: WZ3: 5.472px; WZ4: 8.668px; WZ9: 20.098px; WZ17: 48.16px. The sensitivity (especially edge zones) prevents using this as a reliable citywide production transform. Full coefficients and rows in the register. Neither publisher map data nor historical coordinates alone prove exact game positions. Do not create native pins from this fit.

## WZ4 height contradiction

All six old WZ4 values are 75.9; cemetery descriptions put the items among graves or behind the building. Five source coordinate comparisons support the reported cemetery locations. TM072 is a separate text-only approach behind the building, with reported brambles. [French zone guide](https://www.pokemon-france.com/en/guides/pokemon-legends-z-a/wild-zones/), [Serebii zone guide](https://www.serebii.net/pokearth/lumiosecity/wildzone4.shtml). Old >40 roof inference is unsafe; do not infer inverted height either. Inspected local annotation of the original crop; baked-in large zone icon obscures exact grave detail.

## Independent Screw #91 candidate

[Regional list](https://www.gamerguides.com/pokemon-legends-z-a/guide/getting-started/information/all-colorful-screw-locations) and [coordinate database](https://www.gamerguides.com/pokemon-legends-z-a/database/items/other-items/colorful-screw) share literal marker ID 236385 (display heading 236386), XY (4741,10842). The candidate fit projects it close to archived ID 8715 (2.691px separation versus 64.217px for 8808). This sample was not used to fit. Both marker URLs and thumbnail unavailable; no final identity, height or physical verification. Keep both old records, original 100 Screw IDs and original zone item keys. This is the 13th external Screw source reference, not a 13th confirmed Atlas pin.

Next: independently verify distributed permanent landmarks and candidate identities, check residuals per district, compare all 146 against descriptive/visual evidence, resolve 35 ambiguous matches, reconcile 100 Screw numbers, continue international routes, then AT-333 small filtered collectible layers and G4/G5 testing. No user request for repeated screenshots; no runtime, original Workspace, assets or player data modified. [Structured evidence](ATLAS_AT335_PICKUP_COORDINATE_PILOT.json).
