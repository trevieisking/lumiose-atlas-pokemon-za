# AT-334 — Original Workspace pickup archive recovery

25 November 2026 · baseline `0a9557d2a014b645812a7c1c71b8e0b3444057ed`

Owner recalls oversized Workspace pins. Both private source archives (v35 and v37) were located and opened, passed ZIP CRC, and contain byte-identical `dist/map-items.json` with 146 unique original IDs, zone, name, two map percentages and a numeric raw height. Full original archives remain private; this evidence register restores the factual fields of the already existing 146 Atlas leads, not third-party artwork or code. [Structured register](ATLAS_AT334_WORKSPACE_PICKUP_RECOVERY_REGISTER.json).

The original credits in `dist/index.html` identify the alignment as derived from Serebii's Lumiose map and the city image as GamesRadar. `dist/app.js` places the markers at their stored percentages. `dist/sector-maps.html` expressly treats pickup alignment as approximate. The archive city JPG is byte-identical in both versions and matches current Git blob b951a877aea400564b1c4c6495b0cd41247bd8ca (1920×1920). All 146 ID/name/zone/XY records were compared with the saved markup, including nine identical repeated occurrences. Convert percentages to the same image's pixel plane only as **archived** positions, not newly verified physical coordinates. The 146 height numbers were recovered with a checked transfer checksum. No independent physical accuracy guarantee.

## Original identity crosswalk

- 146 distinct positions across all 20 Wild Zones; 144 ordinary item/TM marker records and two Colorful Screw candidates.
- 111 bidirectionally unique name-and-zone item-ledger candidates, nine marker rows competing for a single item candidate, and 26 rows with multiple possible item candidates. All 146 retained. No new collection keys and no physical identity claim from text alone.
- Both old Screw markers (8715 and 8808, WZ9) match one broad item record 09-23; `screw-areas.json` has 100 numbered text descriptions without XY. Do not assign them to #91 or any other numbered Screw until individually reconciled.
- All 18 uniquely numbered TM markers checked against [Pokémon GO Hub's location descriptions](https://pokemongohub.net/post/guide/all-tm-locations-in-pokemon-legends-z-a/), with additional [Serebii TM listing](https://www.serebii.net/legendsz-a/tm.shtml), [Japanese Work Up route](https://gamepedia.jp/pokemon-legends-z-a/items/4398) and [GameSpot route descriptions](https://www.gamespot.com/gallery/pokemon-legends-za-tm-technical-machine-locations/2900-7146/) where available. Source wording paraphrased, not copied. Physical position verification still open.

## Old height classification defect

Old Workspace code used a universal rule (>40 upper, <0 lower/underground, otherwise street). At least seven TM targets explicitly on roofs or a tower contradict that rule: TM062, TM103, TM034, TM052, TM018, TM022 and TM040. This supports neither a global inverted-height formula nor a known height datum. Preserve raw height and independently record the actual level/scene and route. For TM103, Japanese guide describes western WZ1 ladder to roof; its -10.6 value is not proof of underground location. TM027 grass/tree cue also contradicts a blanket upper-level interpretation. No runtime modification to the original site.

## Next and limitations

The direct public Serebii map download failed. GameSpot northern/southern map images and the Work Up image returned cache misses. A private preview was generated from the recovered positions on the original identical base map and inspected: markers cluster around the expected zones; pre-existing large game icons obscure some detail. This is an archive overlay sanity check, not physical verification. No newly calibrated landmarks or exact pickup positions claimed. Keep these points separate from AT-332's 12 uncalibrated external Screw references. Retain AT-333 compact-dot design, independent filters, no random/reward pins, and exact evidence gate for actual production dots. No need to ask owner to repeat an entire playthrough or duplicate map captures; use original sources and selective crosschecks. Preserve AT-325 ordered release gates, public database and all existing runtime/progress assets. Full original source archives remain privately accessible, not an editor access grant or current Workspace version verification.
