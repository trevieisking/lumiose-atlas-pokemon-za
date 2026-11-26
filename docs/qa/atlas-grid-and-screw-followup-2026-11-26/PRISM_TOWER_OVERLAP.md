# Prism Tower overlap check: two owner photos

These north/centre and south/centre views overlap on the full Prism Tower footprint. Only the footprint outline corners were used as controls, not crosses, the red reticle, labels or icons. Two lower south vertices are withheld entirely because the marker obscures them. Both fits use the same immutable 4096 reference as the earlier Wild Zone 20 pilot. The fits are independent from one another, but cover the same geographic footprint; they are not independent samples of the whole city.

| Owner photo (existing full-frame derivative) | Fit corners | Reserved corners | Max reserved error (4096 reference px) | Four adjacent cross intervals |
| --- | ---: | ---: | ---: | --- |
| `20261126_161334.jpg` | 17 | 7 | 1.32 | 241.32, 240.28, 239.03, 240.21 |
| `20261126_161350.jpg` | 15 | 7 | 4.80 | 240.77, 241.00, 238.87, 242.07 |

The estimated cross centres agree between the two views to 1.21, 2.00, 2.18 and 1.98 reference pixels (ordered NW, NE, SW, SE). Both views recover the local lattice around x=1920/2160 and y=1920/2160, including the southeast cross omitted from the timed-frame result. The south photograph has the larger architecture residual. These manual clicks and paired registration observations do not establish physical step length, trusted item accuracy, exact citywide coordinates or support outside the shared tower footprint.

**Replay:** `python replay_prism_tower_overlap.py` (NumPy and SciPy). The fixed coordinates encode manual readings from QA derivatives. For each 4000×2252 owner photo, sample an 800×450 copy, crop N=(260,228,429,396) or S=(294,42,468,218), then enlarge by 4. Reference manual readings use the crops (1830,1860,2250,2250) enlarged by 2. Reproduce the reported math only; the operator selections, raster and optical errors still apply. Original photos are not rewritten. See [source intake](../at343-owner-item-crosses/full-frame-2026-11-26/intake.json) and the [prior replay](../at343-video-grid-2026-11-26/registration.json).

The next expansion gate is a different, overlapping district/source photo with fixed roads or buildings and a held-out check against the common phase. Still no live pin or Workspace promotion.
