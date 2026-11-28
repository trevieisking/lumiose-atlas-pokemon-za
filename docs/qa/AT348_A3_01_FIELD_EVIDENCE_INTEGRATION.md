# AT-348 — A1 clearance and A3-01 field evidence integration

**28 November 2026 — Manifest 114 / Ledger 122.** Exact PR229 parent `0bc8f126f3252c204673de536155c6a72cd1fa4b` passed all three workflows: [Explorer 46131659661](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46131659661), [articles 46131659714](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46131659714) (attempt 2 after Node parser failure), [actual Pages output 46131659703](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/46131659703). Pages audited 27 HTML pages and 784 local image assets byte-for-byte; 108 external image URLs inventoried, not network verified. All 20 Wild Zones on four surfaces, 21 Holovator galleries/111 photos, and 48 sector directory contexts/fallbacks passed on phone/desktop. Reviewed eight actual screenshots from Explorer artifact 15258561482; WZ17 centered overview and detail fully visible, Looker ten photographs and Hotel Z ladder gallery present at both widths. No persistent sticky-navigation defect reproduced; no layout change. A1-01/A1-02 complete, A1-03 local asset/render gate passed; remaining manual source-identity/remote artwork review explicitly open in A7, do not restart bounded repairs. Main `bdfce92bfa7324517d0a1e2f8db7eec84983eefb` and field PR226 `cd24fc4f6a047ae819af025cfe08fc70391bfb5a` and source PR227 `153c6ad8f4841c927b4391739f766bf6f958137c` preserved. Three-tree audit found 217 field-source changed blobs, no overlaps/deletions; transfer 216 exact blobs (211 WebP photos, five guide/register files) and exclude historical one-off import workflow. Existing Item Atlas and Explorer pages differ only by one additive fieldbook link each. 42 finds (17 TMs, 18 items, seven Screws), one scaffold survey, 211 photos; 38 full pickup screenshot records, two contributor-only, two partial/obscured pickup texts, one infrastructure observation. Thirteen TM names/numbers match the existing written access register and original TM rows as comparison candidates; four remain unmatched in that register. Do not assign a canonical checklist ID or coordinate, introduce progress keys, or mark any unverified pin. Added independent original Git blob hashes, count/route/progress and representative phone/desktop fieldbook browser regressions; actual Pages output inventory will include the new fieldbook and images. No new PR or live deployment. GitHub-first release gate retained; Workspace v40 last recorded, no Workspace action. New exact-head CI pending. HOLD. Next: Review exact new-head Explorer, article and Pages output checks, including fieldbook link/render and exact 211-photo byte preservation. Review A3 candidate TM crosswalk, other item/Screw identity and access route/coordinate evidence; continue A2, A7, A4/A5, A6 and A8. External artwork availability and remaining manual image/source identity audit are separate open tasks; no repeated A1-01/A1-02 repair. No Workspace action before complete GitHub live verification.

## Exact audit result

Explorer artifact 15258561482 ZIP SHA-256 8462472e199488e85704cce22bc41c66963e1cb2f0a38a98179f4bcb028f2752. Inspected the four centered WZ17 screenshots, two ten-photo Looker gallery screenshots, and two Hotel Z ladder gallery screenshots. Centered scroll screenshots and passing hit-test show both photos fully reachable; preserve navigation. This is bounded visual review, not a claim of every photograph's content manually verified. Actual Pages output: 27 HTML documents, 784 local image assets byte-identical; 108 distinct external artwork URLs inventoried. Remaining source/crop identity and external availability stay explicitly open under A7. Do not keep re-running completed A1-01/A1-02 repairs.

## Three-tree field transfer

Compared main, exact PR229 parent and exact PR226 head. Source delta: 217 blobs; zero deleted or overlapping files. Reuse all 211 unique WebP Git blobs and exact fieldbook, register, field guide, and two navigation-link-only HTML changes. Exclude the historical import workflow; not required for runtime. Verify source byte identities from [crosswalk register](AT348_A3_01_FIELD_EVIDENCE_CROSSWALK.json). Existing fieldbook has 43 collapsible groups and 211 photos plus logo, no input controls. All original field coordinates/checklist IDs are null. Preserve photo confidence: 38 full pickup screenshots, two contributor-only, Dazzling Gleam partial text, Café Gallant Screw partially obscured text, one separate infrastructure survey. Do not turn these distinctions into a false claim of all pickups independently confirmed.

## TM comparison candidates

| Field name | Existing TM | Original checklist candidate | Evidence status |
| --- | --- | --- | --- |
| Work Up | TM103 | 1-10 | pickup_screenshot |
| Swift | TM027 | 2-0 | contributor_identified |
| Aerial Ace | TM022 | 3-7 | pickup_screenshot |
| Fire Spin | TM072 | 4-2 | pickup_screenshot |
| Bullet Seed | TM040 | 5-7 | pickup_screenshot |
| Water Pulse | TM041 | 6-6 | pickup_screenshot |
| Dazzling Gleam | TM092 | 7-4 | partial_pickup_text |
| Rock Tomb | TM036 | 8-3 | pickup_screenshot |
| Power-Up Punch | TM018 | 9-17 | pickup_screenshot |
| Night Slash | TM034 | 10-7 | pickup_screenshot |
| Psychic | TM063 | 11-9 | pickup_screenshot |
| Ice Beam | TM013 | 12-10 | pickup_screenshot |
| X-Scissor | TM081 | 13-3 | pickup_screenshot |

These matches use the exact existing written TM access register and the original saved item row's TM number. They are not canonical assignments, validated pickup coordinates or complete routes. Four additional photographed TMs (Dragon Pulse, Flip Turn, Roar, Headbutt) do not appear in that 20-row written cross-reference. Other items and Screws still require canonical matching. Access survey remains candidate corroboration of AR-B06-01 only. No new permanent marker, random Hyperspace pin, coordinate, or progress key.

## Acceptance

New independent tests check all 43 groups, 211 exact source Git blob hashes, image path and full-size links, original 264 item and 100 Screw identifiers, evidence null-coordinate policy, 13 comparison candidates and read-only fieldbook browser flow with four representative gallery categories at both widths. Existing Pages output inventory will include every new photo. Require new exact-head CI and manual evidence before release. No Workspace changes before full verified GitHub release.
