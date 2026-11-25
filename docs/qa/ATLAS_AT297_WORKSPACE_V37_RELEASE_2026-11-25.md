# AT-297 Workspace version 37 release evidence

25 November 2026 · ATLAS-MAPS-2026-11-21-V1

**Original Workspace version 37 passed the scoped release checks.** The original public origin and project were retained. The independent GitHub comparator remains `ca62d68f2e052bb5b7d584957be114cd6318d8d7` ([Pages deployment](https://github.com/trevieisking/lumiose-atlas-pokemon-za/actions/runs/45556857970)).

| Gate | Evidence |
| --- | --- |
| A1 · Editable source | The owner-authorized original source checkout matched the deployed v35 revision `7f4fe1a5932353eac98ac9946ae7b980e8986ad6`. |
| A2 · Restore and backup | Verified the backup ZIP and inventory, restored all 962 source hashes, and produced a 951-file v35 deployment package. The isolated same-origin rollback from the candidate to v35 and back retained the same three synthetic story checkmarks. The original saved v35 is the production rollback checkpoint. |
| A3 · Compatibility | The existing progress keys, IDs, map and artwork, Supabase files, feedback client, styles and owner admin page passed byte-level or scoped contract preservation checks. Synthetic progress and toggles survived reloads. Mobile rating and report submission passed against a local fixture with external connections blocked. |
| A4 · Scoped patches | `6d0c55f` mission corrections, `f906b5a` sector photos, `47cc0b5` interactive map and lift galleries, `1b76dab` guide links, `8472f28` responsive fixes, `18b300d` build scripts and source checks, `1ac2c20` live canonical-route compatibility. |
| A5 · Preview | Five source regression tests passed. The browser preview passed 190 layouts across 320, 393, 768, 1024 and 1440 px. Map controls, filters, compass, keyboard pan and simulated pointer drag, pinch and rotation passed. The browser decoded all sector images and the five Side Mission 61 photos. The final route fix passed the preview on extensionless article URLs. |
| A6 · Publish | Version 37 contains the tested commit `1ac2c20002451d295dc4f8e80068297682fcdc4b`, tree `c680b737a8e8fc4f2c866892444ab84ae2b58069` and a 1,114-file static package. The original Workspace deployment succeeded with environment revision 0. |
| A7 · Live check | The live directory displayed 48 sector links and 42 distinct photos. The Jaune 5 link opened its sector in the interactive map. The live map displayed 21 approximate Holovator markers, and the #61 route displayed five photographs and the verified reward and directions. Live rotation and north reset worked. The 42-story-mission walkthrough retained 25 menu links and showed corrections for 24, 25 and 37. Wild Zone 3 rendered its timestamped encounter and hunting links. |

Version 36’s live check exposed the Workspace host’s extensionless article redirects. Version 37 recognizes both route forms and restores the article cross-links on the canonical URLs.

All 42 sector PNGs and 111 Holovator JPEGs match the verified GitHub source files byte for byte. The map includes 15 documented approaches. Existing precise and approximate reference records keep their original coordinates and evidence labels. There are no new permanent Hyperspace or scaffold pins.

The browser device widths and touch contacts were simulated. Live checks were read-only. No production feedback was submitted, no player data was accessed, and no Supabase database or checklist rows were changed.

**Verified live pages**

- [Interactive Lumiose Atlas and Side Mission 61 photographs](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/atlas-explorer?place=bleu3-fav)
- [Sector map gallery](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/sector-maps?v=37#jaune-5)
- [Walkthrough and Mission 24](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/walkthrough?v=37#mission-24)
- [Side Mission 61](https://lumiose-atlas-za-trev.chatterfriendsstreambandit.chatgpt.site/side-missions?v=37#quest-61)
