# AT339 final browser evidence

This compact packet preserves exact artifacts for reviewed commit **`42409561393a9fbaa2caa58ba781268af4cb8a6e`**, tree **`731042231a91996f83d4fa08bf4d9953b9987c78`**. The independent runtime/evidence review and independent visual review both approved the **bounded PR202 shared area/habitat and filter/photo corrections**, with no concrete release blocker found. This evidence is not itself a merge, deployment or complete Map 2.0 approval receipt.

## Provenance

- [Exact-head CI run 45819110334](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45819110334): successful unit and browser jobs, including the original Explorer, collectible and fieldbook suites and the shared-area suite.
- Source artifact: **15117007793**, **65,430,584 bytes**; archive SHA-256 **`590dbc50a8460a340028710f9742c57a4496e8eebad35ccfb66eb337c8b819b6`**. Its digest was recomputed locally, and every listed PNG plus the proof was compared with its archived member.
- [at339-browser-proof.json](at339-browser-proof.json) is copied **byte for byte**: 1,915 bytes, SHA-256 `9854cbbee008ff37450191cec466468a7bd4b8767b468fef46df92ed935dc44f`.
- [browser-review.json](browser-review.json) records **all 30 independently reviewed PNG filenames, dimensions, byte counts and SHA-256 hashes**, plus bounded decisions and limitations. Seven representative PNGs are retained here; the remaining reviewed captures remain identifiable in the original CI artifact.

The recorded tests cover four surfaces at **393 × 852 phone** and **1440 × 900 desktop** viewport sizes. The proof records history/reload and early-intent reconciliation, preserved original-photo DOM, route/collectible state, unchanged seeded saved-progress bytes, **zero storage writes**, source-failure fallback and no page errors. Phone touch pinch/rotation passes; the desktop touch field is false because it is not the touch scenario. Browser emulation does not establish physical-device or in-game verification.

## Representative exact-head screenshots

No screenshot has been recaptured, resized, cropped, recompressed or otherwise edited for this packet. The reported pixel dimensions are the original element or viewport captures, which can differ from the browser viewport size.

| Retained PNG | What it demonstrates | Scope |
| --- | --- | --- |
| [place-layer-recovery-phone.png](screenshots/place-layer-recovery-phone.png) | Phone layer recovery, visible marker count and clear/photo actions | Production-data UI. The disabled Scaffolding label wraps mid-word; cosmetic only. |
| [at339-measured-main-phone.png](screenshots/at339-measured-main-phone.png) | Phone main map with preserved one-line numbered pins | Production-data UI. Original capture; no additional geometry claim. |
| [at339-explorer-controls-phone.png](screenshots/at339-explorer-controls-phone.png) | Phone shared area/species, district and encounter controls | Production-data UI. Original capture; no additional geometry claim. |
| [at339-synthetic-boundary-phone.png](screenshots/at339-synthetic-boundary-phone.png) | Phone inline original WZ01 photographs in a synthetic interaction scenario | **SYNTHETIC TEST FIXTURE**. The WZ01 outline and one-outline count come from an intercepted test fixture; they do not approve production WZ01 geometry. |
| [at339-synthetic-boundary-desktop.png](screenshots/at339-synthetic-boundary-desktop.png) | Desktop inline original WZ01 photographs in a synthetic interaction scenario | **SYNTHETIC TEST FIXTURE**. The WZ01 outline and one-outline count come from an intercepted test fixture; they do not approve production WZ01 geometry. |
| [at339-measured-selected-wz11-desktop.png](screenshots/at339-measured-selected-wz11-desktop.png) | Selected reviewed WZ11 rendered-map outline | Reviewed production map outline. Rendered map-selection geometry only; no walking route, spawn extent, floor or pickup position is established. |
| [at339-boundary-item-priority-phone.png](screenshots/at339-boundary-item-priority-phone.png) | Item click priority against a synthetic boundary | **SYNTHETIC TEST FIXTURE**. The item placement and verified-location wording shown in this intercepted test scenario are synthetic; production collectible placements remain empty. |

## Synthetic fixtures and production scope

**The WZ01 boundary and item-priority examples are synthetic test fixtures. They are never production geometry or approved item placements.** Browser request interception supplies their rectangle and item placement solely to test taps, drag rejection, history and click priority. The original WZ01 photographs rendered inside the panel remain real existing source assets; their visibility does not validate the injected boundary. The fixture's one-outline count, “reviewed map outline” label and item “verified fixed location” wording must not be cited as production evidence.

The production proof lists only **WZ02, WZ03, WZ05, WZ11 and WZ16** as eligible rendered-map outlines. The retained selected WZ11 capture shows one of those reviewed outlines. These outlines do not certify walking routes, spawn extents, floors or pickup positions. Production collectible placements remain **zero**. **63 boundaries and all 68 comprehensive roster reviews remain open**, and the separate WZ04 production HOLD is unchanged. Full-scope **G5** and the complete Workspace upgrade remain unapproved; the original-Site v38 filter/photo repair has its own separate receipt.

## Nonblocking review caveats

- **Photo-action screenshots:** `place-photo-details-phone.png` and `place-photo-details-desktop.png` were captured during smooth scroll before the actual photo entered the viewport. They are included in the 30-file hash inventory, but are not retained here as proof of final photo visibility. The browser assertions separately wait for the image's `naturalWidth > 0` and check that the same image node survives. The two retained synthetic shared-panel captures visibly show the original inline photographs.
- **Standalone phone map:** its measured capture reflects the existing horizontal scroller rather than a complete fit-to-width viewport.
- **Long main-panel captures:** existing fixed page chrome overlaps portions of the long element screenshots. Separate control captures establish the controls' appearance; this is not evidence of a control that cannot be reached by scrolling.
- **Scaffolding label:** the disabled label wraps mid-word in the phone layer capture. This is cosmetic and does not change the deliberate absence of verified standalone scaffold pins.

The packet contains the proof, review metadata and seven UI screenshots only. It includes no private local paths, real player state or raw third-party source datasets. No runtime, canonical checkpoint document, tracker SQL or production geometry is changed by preserving this evidence.
