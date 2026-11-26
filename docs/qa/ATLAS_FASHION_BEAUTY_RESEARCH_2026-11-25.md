# Fashion and beauty subguides — first research delivery (25 November 2026)

Owner requested fashion and hair/beauty support after playtesting exposed a gap. New independent researched articles, not recovered original Workspace pages. Scope: 41 boutique identities, 5 arcade locations, five salons, selected clothing price examples, 14 standard and 5 DLC haircuts, 15 + 8 + 9 hair colours, three contact-lens missions, introductory Furfrou routes and photo mode. 25-link menu preserved; both subguides accessible from Shops. No personal player data or photos published.

Research references checked 25 November 2026:
- Official: https://legends.pokemon.com/en-gb/news/adventure-in-style (appearance, two-tone hair, Furfrou, photo mode).
- Official: https://legends.pokemon.com/en-us/news/mega-dimension-bonuses (Holo-X/Y apparel and menu).
- https://bulbapedia.bulbagarden.net/wiki/List_of_clothing_in_Pok%C3%A9mon_Legends:_Z-A (41 identities, arcade sectors, unlock after first Looker Bureau visit, loaned outfit).
- https://www.dexerto.com/wikis/pokemon-legends-z-a/change-appearance-outfit-all-outfits/ and https://esports.gg/guides/pokemon/change-clothes-pokemon-legends-z-a/ (arcades, Rank C Couture access).
- https://serebii.net/legendsz-a/customisation.shtml (sample named prices, hair options).
- https://bulbapedia.bulbagarden.net/wiki/Trainer_customization (salon locations, face options, hair colour and contact unlock IDs).
- https://game8.jp/pokemon-legends-z-a/730162 (flat fee, eyebrow-only free, ZR looks).
- https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A) (012, 030–032, 051, 181–185 rewards).
- https://www.serebii.net/legendsz-a/sidemissions/becomingafurfroutrimmer.shtml and https://www.serebii.net/legendsz-a/sidemissions/becomingaprofurfroutrimmer.shtml (047, 062).
- https://www.thonky.com/pokemon-legends-z-a/side-mission-047-becoming-a-furfrou-trimmer (500 fee).
- Local shops-data.js (Max Potion 1200, Revive 800; example shopping reserve).

Open: exhaustive clothing SKU/variant/price catalogue, stock gating, complete beauty swatches, original game shop-front pictures, owner manual phone/desktop checks. Map links are sector-level references, not measured pins. No evidence of original Workspace edit or publication. Respect AT-325 release order; do not modify live Workspace or submit prompt. No progress, database, feedback backend or map asset modifications.

## Follow-up review and corrections

Initial PR #176 head 617dd928d483d4ac3dc37f94af5388bc9519e8d9 passed recovered article validation (run 45714860920). Follow-up corrects Mission 047 access to completion of Main Mission 15, the exact 062 access milestone, and 087 (Psycho Cut after Main Mission 26), plus 103 Furfrou League. All ten Furfrou forms and all three grooming missions now described; direct verified links to fourteen existing quest IDs. Added five Flabébé capture areas (published leads only), exact Couture story access, nine accessory/separate examples, a five-piece outfit cost illustration, and five DLC reward groups. Both pages still use the complete 25-link menu. No maps, progress, backend, original Workspace or personal screenshots changed. Original visual testing and full clothing inventory still outstanding.

Additional source checks:
- https://www.dexerto.com/wikis/pokemon-legends-z-a/how-to-unlock-boutique-couture/ — Mission 26 and Asami.
- https://www.gamesradar.com/games/pokemon/pokemon-legends-z-a-flabebe-color-locations/ and https://www.videogameschronicle.com/guide/where-to-find-the-different-flabebe-colors-in-pokemon-legends-z-a/ — Flabébé encounter areas; https://strategywiki.org/wiki/Pok%C3%A9mon_Legends%3A_Z-A/The_Many_Flowers_of_Flab%C3%A9b%C3%A9 — alternative blue rooftop route.
- https://www.serebii.net/legendsz-a/forms.shtml and https://www.videogameschronicle.com/guide/pokemon-legends-z-a-furfrou-forms-how-to-change-furfrou-forms/ — all ten forms and fee; https://www.siliconera.com/how-to-unlock-the-furfrou-salon-in-pokemon-legends-z-a/ — local landmarks and lack of permanent map icon.
- https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A) — mission 047/062/087/103 gates and reward details; 181–185 locations and rewards.
- https://serebii.net/legendsz-a/customisation.shtml — selected accessory examples checked by category; these are not a complete catalogue.

Publication remains gated on validation of the new exact head, review findings, and visual readiness. Do not publish an original Workspace prompt independently of AT-325.

### Review correction
Codex P2 on initial head: both new article feedback anchors lacked the shared `atlasArticleFeedback` ID. Corrected both to use the existing article controller, which forwards the current pathname and hash to the existing feedback form. Checked the form and relay source path patterns accept these filenames and section IDs. Added static regression coverage; no feedback submission, service change or live end-to-end test performed. Exact-head review and CI remain required.

### Browser validation checkpoint
Corrected head 475b2c30b0d307a7d099592abeae83261133d267 passed article validation (run 45715529880). Added isolated Chromium smoke checks for 393px phone and 1440px desktop, full menu, both Shops entry links, layout overflow, shared feedback source and round-trip return links. All nonlocal network is blocked in the browser test; no real feedback submission or progress mutation. New exact-head test results not yet observed. Screenshots collected as CI artifacts for inspection. No live publication claimed.

### Treasure pocket and browser regression (25 November 2026)
Run 45715949970: existing article job passed, but the new real-browser test failed at line 43: after same-document hash navigation the feedback URL retained the filename without #accessory-prices. The existing shared controller only populates the link at initialization. Scoped correction for new fashion pages: update on hashchange, pageshow, and click; no shared controller, feedback form, backend, database, or existing map/progress edits. Browser test now waits for the exact pathname+hash and explicitly checks same-document navigation. New CI required.

Added an expandable treasure reference to Shops and optional fashion budget cross-link. Published ZA sale prices: Big Nugget 20000, Pearl String 10000, Nugget 5000, Big Pearl 4000, Pearl 1000. Pretty Feather/Tiny Mushroom sale quote deferred. No player-specific details or photos used. Sources: https://bulbapedia.bulbagarden.net/wiki/Big_Nugget ; https://bulbapedia.bulbagarden.net/wiki/Pearl_String ; https://bulbapedia.bulbagarden.net/wiki/Nugget ; https://bulbapedia.bulbagarden.net/wiki/Big_Pearl ; https://bulbapedia.bulbagarden.net/wiki/Pearl_(item) ; https://www.serebii.net/legendsz-a/items.shtml ; https://www.serebii.net/legendsz-a/floatingpokeballs.shtml ; https://www.serebii.net/legendsz-a/flavorpowers.shtml ; https://poketrainervault.com/legends-za/guides/donut-guide/ ; https://www.dexerto.com/wikis/pokemon-legends-z-a/how-to-earn-money-fast/ . No guaranteed profit, invented coordinates or unsafe bulk-sale advice. Publication remains held until latest validation.

### Side Mission 087 timing clarification

[Bulbapedia’s mission table](https://bulbapedia.bulbagarden.net/wiki/Mission_(Legends:_Z-A)) lists completion of Main Mission 26 and Side Mission 062. [Serebii’s quest entry](https://www.serebii.net/legendsz-a/sidemissions/becomingapeerlessfurfroutrimmer.shtml), [Thonky’s walkthrough](https://www.thonky.com/pokemon-legends-z-a/side-mission-087-becoming-a-peerless-furfrou-trimmer) and the [Atlas quest card](../../side-missions.html#quest-87) recommend the start of Main Mission 30 after Side Mission 062. The Beauty guide now recommends that later checkpoint to avoid an early trip. This does not rule out earlier availability; no gameplay check between those milestones has been verified. Psycho Cut and all three trims are unchanged.
