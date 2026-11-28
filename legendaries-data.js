/* Player-guide Legendary Fieldbook: 25 PDF and saved-page records.
 * Names, levels, descriptions, locations and original art are source-preserved.
 * Numbered action steps only unpack the source text; unverified gaps are labelled.
 * This is read-only data; no credentials, Supabase access, game data, or progress changes. */
window.ATLAS_LEGENDARY_SOURCE = {
  "provenance": {
    "source": "Owner-supplied 10-page Legends PDF, 21 November 2026; route cards correspond to the saved main-page legends section",
    "recordCount": 25,
    "recordSource": "PDF/unchanged MHTML legends source",
    "stepDerivation": "Expanded numbered steps are an editorial decomposition of the PDF descriptions, not separately verified discoveries",
    "locationBoundary": "Special Scans are generated Unknown Zones rather than fixed city coordinates",
    "savedProgress": "Same reconstructed GitHub guide localStorage legendCheck values; original ChatGPT Site has a different origin"
  },
  "counts": {
    "Base story": 3,
    "Gift mission": 2,
    "Mega Dimension": 13,
    "Special Scan": 7
  },
  "records": [
    {
      "id": "xerneas",
      "name": "Xerneas",
      "category": "Base story",
      "key": "Xerneas",
      "nationalNumber": 716,
      "image": "art/716.webp",
      "place": "Wild Zone 11",
      "description": "After the credits, speak to Mable. Clear the anomalous Alphas in Wild Zones 3, 5 and 9, then enter Wild Zone 11 for the Xerneas encounter.",
      "tip": "Mission 40 · Level 75.",
      "verifiedRoute": {
        "prerequisite": "Catch or defeat the three Lv. 70 mission Alphas; defeated individuals do not respawn.",
        "landmarks": [
          "Find Steelix in the centre of Wild Zone 3, Gallade where Venipede normally gather in Wild Zone 5, and Pangoro on the high rooftop where Mawile normally appears in Wild Zone 9."
        ],
        "fallback": "Already defeated one? Gallade and Pangoro can reappear as rotating Alphas in Wild Zone 20. For Alpha Steelix, trade an Alpha Onix holding a Metal Coat or check 4★ Steel Hyperspace Wild Zones with Mega Dimension."
      },
      "originalPdfPage": 1,
      "steps": [
        "Finish the main story and speak with Mable after the credits.",
        "Clear the anomalous Alpha encounters in Wild Zones 3, 5 and 9.",
        "Report back to Mable, then start at Wild Zone 6 and head south to Zone 11’s northern entrance. Follow the story marker on the Jaune side of the Saison Canal and catch Lv. 75 Xerneas. If you knock it out, it returns for another attempt."
      ],
      "links": [
        [
          "Mission 40",
          "journey.html#journey-mission-40"
        ],
        [
          "Wild Zone 11",
          "maps.html#wild-zone-11"
        ]
      ]
    },
    {
      "id": "yveltal",
      "name": "Yveltal",
      "category": "Base story",
      "key": "Yveltal",
      "nationalNumber": 717,
      "image": "art/717.webp",
      "place": "Rouge Sector 2",
      "description": "Speak to Vinnie, win his three strengthened Rogue Mega simulations, then reach the rooftop of Galerie de la Lune in Rouge Sector 2.",
      "tip": "Mission 41 · Level 75.",
      "originalPdfPage": 2,
      "steps": [
        "Speak with Vinnie about the next postgame encounter.",
        "Win the three strengthened Rogue Mega simulations.",
        "Reach the roof of Galerie de la Lune in Rouge Sector 2."
      ],
      "links": [
        [
          "Mission 41",
          "journey.html#journey-mission-41"
        ],
        [
          "City map",
          "maps.html"
        ]
      ]
    },
    {
      "id": "zygarde",
      "name": "Zygarde",
      "category": "Base story",
      "key": "Zygarde",
      "nationalNumber": 718,
      "image": "art/718.webp",
      "place": "Wild Zone 20",
      "description": "Catch Xerneas and Yveltal, return to Hotel Z and defeat L. Follow Zygarde to the Prism Tower area and survive its 10%, 50% and Complete Forme phases.",
      "tip": "Mission 42 · Level 84. During Core Enforcer, stand in a gap of the Z-shaped danger zone.",
      "originalPdfPage": 2,
      "steps": [
        "Obtain Xerneas and Yveltal first.",
        "Return to Hotel Z and defeat L.",
        "Follow Zygarde toward Prism Tower.",
        "Survive its 10%, 50% and Complete Forme phases; during Core Enforcer stand in a gap in the Z-shaped danger zone."
      ],
      "links": [
        [
          "Mission 42",
          "journey.html#journey-mission-42"
        ],
        [
          "Wild Zone 20",
          "maps.html#wild-zone-20"
        ]
      ]
    },
    {
      "id": "diancie",
      "name": "Diancie",
      "category": "Gift mission",
      "key": "Diancie",
      "nationalNumber": 719,
      "image": "art/719.webp",
      "place": "Magenta Sector 8",
      "description": "Claim Diancite through Mystery Gift, then visit Emma at the Looker Bureau. Follow Mimi to the crystal-covered rooftop and catch Diancie.",
      "tip": "EX mission · Requires the Diancite gift.",
      "originalPdfPage": 2,
      "steps": [
        "Claim the Diancite through Mystery Gift as described in the exported guide.",
        "Visit Emma at the Looker Bureau.",
        "Follow Mimi to the crystal-covered rooftop in Magenta Sector 8.",
        "Complete the Diancie encounter there."
      ],
      "links": [
        [
          "Gift and rewards",
          "index.html#rewards"
        ],
        [
          "Lumiose map",
          "maps.html"
        ]
      ]
    },
    {
      "id": "mewtwo",
      "name": "Mewtwo",
      "category": "Gift mission",
      "key": "Mewtwo",
      "nationalNumber": 150,
      "image": "art/150.webp",
      "place": "Lysandre Labs B3F",
      "description": "After the main story, claim Mewtwonite X and Y through Mystery Gift. Visit Lysandre Café, descend into Lysandre Labs and finish Project M.",
      "tip": "EX mission · Internet gift and main story completion required.",
      "originalPdfPage": 3,
      "steps": [
        "Complete the main story before beginning this EX mission.",
        "Claim Mewtwonite X and Y through Mystery Gift, as described in the exported guide.",
        "Visit Lysandre Café and descend into Lysandre Labs B3F.",
        "Finish the Project M encounter."
      ],
      "links": [
        [
          "Gift information",
          "index.html#rewards"
        ],
        [
          "Postgame route",
          "journey.html#chapter-postgame"
        ]
      ]
    },
    {
      "id": "heatran",
      "name": "Heatran",
      "category": "Mega Dimension",
      "key": "Heatran",
      "nationalNumber": 485,
      "image": "art/485.webp",
      "place": "Hyperspace Infernal Arena",
      "description": "Advance the Mega Dimension story until the Infernal Arena opens. Dodge the lava and magma patterns, defeat Rogue Mega Heatran and catch it.",
      "tip": "Level 80 · The Heatranite is awarded after the fight.",
      "originalPdfPage": 3,
      "steps": [
        "Continue the Mega Dimension story until the Hyperspace Infernal Arena becomes available.",
        "Avoid the arena’s lava and magma attack patterns.",
        "Defeat Rogue Mega Heatran, then complete the capture encounter.",
        "Receive Heatranite after the fight, according to the owner’s PDF."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Boss strategy",
          "boss-guide.html"
        ]
      ]
    },
    {
      "id": "darkrai",
      "name": "Darkrai",
      "category": "Mega Dimension",
      "key": "Darkrai",
      "nationalNumber": 491,
      "image": "art/491.webp",
      "place": "Hyperspace Newmoon Nightmare",
      "description": "Make the story’s Bad Dreams Cruller with Ansha to reach the distortion above Prism Tower. Win both the normal and Mega Darkrai phases.",
      "tip": "Level 85 · Defeat it before the capture opportunity.",
      "originalPdfPage": 3,
      "steps": [
        "Ask Ansha to prepare the story’s Bad Dreams Cruller.",
        "Travel to the distortion above Prism Tower.",
        "Win the Darkrai battle and its Mega phase.",
        "Complete the capture opportunity after the boss phases."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Boss strategy",
          "boss-guide.html"
        ]
      ]
    },
    {
      "id": "groudon",
      "name": "Groudon",
      "category": "Mega Dimension",
      "key": "Groudon",
      "nationalNumber": 383,
      "image": "art/383.webp",
      "place": "Jaune Sector 11 → Desolate Land",
      "description": "After Darkrai, research the ruby distortion, obtain Hoennian Salt, make the Omega Donut and enter the Jaune Sector 11 portal. Beat Groudon and Primal Groudon.",
      "tip": "Level 80 · Water attacks fail against Primal Groudon.",
      "originalPdfPage": 4,
      "steps": [
        "After Darkrai, investigate the ruby distortion and obtain Hoennian Salt.",
        "Make the Omega Donut.",
        "Enter the portal in Jaune Sector 11 to reach Desolate Land.",
        "Defeat Groudon and Primal Groudon. The PDF warns that Water attacks fail against the Primal form."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Type chart",
          "type-chart.html"
        ]
      ]
    },
    {
      "id": "kyogre",
      "name": "Kyogre",
      "category": "Mega Dimension",
      "key": "Kyogre",
      "nationalNumber": 382,
      "image": "art/382.webp",
      "place": "Wild Zone 5 → Primordial Sea",
      "description": "After Darkrai, research the sapphire distortion, make the Alpha Donut and enter the portal in Wild Zone 5. Beat Kyogre and Primal Kyogre.",
      "tip": "Level 80 · Bring Electric or Grass coverage.",
      "originalPdfPage": 4,
      "steps": [
        "After Darkrai, investigate the sapphire distortion.",
        "Make the Alpha Donut.",
        "Enter the portal in Wild Zone 5 to reach Primordial Sea.",
        "Battle Kyogre and its Primal form; the source suggests Electric or Grass coverage."
      ],
      "links": [
        [
          "Wild Zone 5",
          "maps.html#wild-zone-5"
        ],
        [
          "Type chart",
          "type-chart.html"
        ]
      ]
    },
    {
      "id": "rayquaza",
      "name": "Rayquaza",
      "category": "Mega Dimension",
      "key": "Rayquaza",
      "nationalNumber": 384,
      "image": "art/384.webp",
      "place": "Hotel Z → Sky Pillar",
      "description": "Finish both Groudon and Kyogre routes. Complete Corbeau’s research, make the Delta Donut with Ansha and take the portal above Hotel Z.",
      "tip": "Level 85 · The Mega phase has a protective wind.",
      "originalPdfPage": 4,
      "steps": [
        "Finish both Groudon and Kyogre routes.",
        "Complete Corbeau’s research requirements.",
        "Make the Delta Donut with Ansha.",
        "Enter the portal above Hotel Z and face Rayquaza and its protective-wind Mega phase."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Boss strategy",
          "boss-guide.html"
        ]
      ]
    },
    {
      "id": "meltan",
      "name": "Meltan",
      "category": "Mega Dimension",
      "key": "Meltan",
      "nationalNumber": 808,
      "image": "art/808.webp",
      "place": "Rouge Sector 1",
      "description": "After Rayquaza, accept the side request in Rouge Sector 1, find the wandering Meltan and catch it.",
      "tip": "Level 70 · Starts a linked Melmetal route.",
      "originalPdfPage": 5,
      "steps": [
        "Finish Rayquaza’s route first.",
        "Accept the side request in Rouge Sector 1.",
        "Locate the wandering Meltan and catch it.",
        "The source links this encounter to a following Melmetal route."
      ],
      "links": [
        [
          "Side missions",
          "index.html#sidequests"
        ],
        [
          "City map",
          "maps.html"
        ]
      ]
    },
    {
      "id": "melmetal",
      "name": "Melmetal",
      "category": "Mega Dimension",
      "key": "Melmetal",
      "nationalNumber": 809,
      "image": "art/809.webp",
      "place": "Hyperspace Lumiose",
      "description": "After Meltan, enter the new Hyperspace portal. Speak to the girl among the Meltan and answer her questions to receive Melmetal.",
      "tip": "Level 80 · Gift encounter.",
      "originalPdfPage": 5,
      "steps": [
        "Complete the preceding Meltan encounter.",
        "Enter the newly available Hyperspace portal.",
        "Find the girl among the Meltan and answer her questions.",
        "Receive Melmetal as the documented gift."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Meltan route",
          "#legend-meltan"
        ]
      ]
    },
    {
      "id": "magearna",
      "name": "Magearna",
      "category": "Mega Dimension",
      "key": "Magearna",
      "nationalNumber": 801,
      "image": "art/801.webp",
      "place": "Quasartico Inc.",
      "description": "After Rayquaza, help Vinnie, then bring Jett 999 Mega Shards for the dormant Poké Ball. Activate the Magearnite to awaken Magearna.",
      "tip": "Level 80 · Save Mega Shards for this request.",
      "originalPdfPage": 5,
      "steps": [
        "After Rayquaza, help Vinnie with the follow-up request.",
        "Save 999 Mega Shards and bring them to Jett.",
        "Find the dormant Poké Ball at Quasartico Inc.",
        "Use the Magearnite to awaken Magearna as described in the PDF."
      ],
      "links": [
        [
          "Mega Shard planner",
          "shops.html#mega-budget"
        ],
        [
          "Quasartico shop",
          "shops.html#shop-quasartico"
        ]
      ]
    },
    {
      "id": "hoopa",
      "name": "Hoopa",
      "category": "Mega Dimension",
      "key": "Hoopa",
      "nationalNumber": 720,
      "image": "art/720.webp",
      "place": "Hotel Z → Hyperspace",
      "description": "After Rayquaza, recover AZ’s Prison Bottle at Hotel Z. Follow Corbeau’s distortion lead, defeat Hoopa Unbound and receive Hoopa Confined.",
      "tip": "Level 80 · Story follow-up.",
      "originalPdfPage": 6,
      "steps": [
        "After Rayquaza, recover AZ’s Prison Bottle at Hotel Z.",
        "Follow Corbeau’s new distortion lead.",
        "Defeat Hoopa Unbound.",
        "Receive Hoopa Confined at the end of that encounter."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Hotel Z routes",
          "journey.html"
        ]
      ]
    },
    {
      "id": "volcanion",
      "name": "Volcanion",
      "category": "Mega Dimension",
      "key": "Volcanion",
      "nationalNumber": 721,
      "image": "art/721.webp",
      "place": "Pokémon Research Lab",
      "description": "After Rayquaza, speak to Mable about a sealed Poké Ball. Enter the secluded lab room, battle Volcanion and catch it.",
      "tip": "Level 80 · Post-DLC side request.",
      "originalPdfPage": 6,
      "steps": [
        "After Rayquaza, speak with Mable about the sealed Poké Ball.",
        "Enter the secluded room in the Pokémon Research Lab.",
        "Battle Volcanion and catch it."
      ],
      "links": [
        [
          "Mable’s research",
          "mable-research.html"
        ],
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ]
      ]
    },
    {
      "id": "genesect",
      "name": "Genesect",
      "category": "Mega Dimension",
      "key": "Genesect",
      "nationalNumber": 649,
      "image": "art/649.webp",
      "place": "Wild Zone 13 → Hyperspace",
      "description": "After Rayquaza, buy all four Genesect Drives from the Vert Sector 7 Mega Shard trader. Ask for the lead, then inspect the wall in Wild Zone 13.",
      "tip": "Each Drive costs 540 Mega Shards.",
      "originalPdfPage": 6,
      "steps": [
        "Finish Rayquaza’s route first.",
        "At the Vert Sector 7 Mega Shard trader, buy all four Genesect Drives.",
        "Budget 540 Mega Shards per Drive: 2,160 Shards altogether.",
        "Ask the trader for the lead and inspect the indicated wall in Wild Zone 13."
      ],
      "links": [
        [
          "Drive prices",
          "shops.html#shop-dlc-shards"
        ],
        [
          "Wild Zone 13",
          "maps.html#wild-zone-13"
        ]
      ],
      "verifiedRoute": {
        "place": "Wild Zone 13 → Hyperspace",
        "description": "Buy all four Drives, then use a 5★ donut at the scripted Wild Zone 13 portal. Genesect is Lv. 200 in the encounter and Lv. 60 when caught.",
        "note": "Budget 2,160 Mega Shards: 540 for each of the four Drives.",
        "steps": [
          "Finish the Rayquaza route in Hyperspace Mission 12.",
          "At the Mega Shard Exchange in Vert Sector 7, west of Wild Zone 17, buy the Douse, Shock, Burn and Chill Drives. Show the trader all four.",
          "Inspect the mission-marked wall inside Wild Zone 13. It opens the scripted 5★ portal. Bring a 5★ donut to enter.",
          "Follow the path through the portal and catch Genesect. It is Lv. 200 in the encounter and Lv. 60 when caught."
        ],
        "links": [
          [
            "Collecting Four Drives · Side Mission 191",
            "side-missions.html#quest-191"
          ],
          [
            "Drive prices",
            "shops.html#shop-dlc-shards"
          ],
          [
            "Wild Zone 13",
            "maps.html#wild-zone-13"
          ]
        ]
      }
    },
    {
      "id": "marshadow",
      "name": "Marshadow",
      "category": "Mega Dimension",
      "key": "Marshadow",
      "nationalNumber": 802,
      "image": "art/802.webp",
      "place": "Rouge Sector 1 training court",
      "description": "Follow the North Boulevard ghost-child request. Wait until Prism Tower’s shadow crosses the Poké Ball symbol on the training court, then inspect the ground.",
      "tip": "Level 80 · A time-of-day and shadow puzzle.",
      "originalPdfPage": 7,
      "steps": [
        "Follow the North Boulevard ghost-child request.",
        "Visit the training court in Rouge Sector 1.",
        "Wait until Prism Tower’s shadow crosses the Poké Ball symbol on the court.",
        "Inspect the ground when the shadow aligns."
      ],
      "links": [
        [
          "Side missions",
          "index.html#sidequests"
        ],
        [
          "City overview",
          "maps.html"
        ]
      ],
      "verifiedRoute": {
        "place": "Café Bataille → Rouge Sector 1 training court",
        "description": "Talk to Gardie near Café Bataille, north of Wild Zone 6. At sunset, use Investigate in the Rouge Sector 1 court, then catch Lv. 80 Marshadow.",
        "note": "Wait for Prism Tower’s shadow to reach the court’s centre circle. No donut is needed.",
        "steps": [
          "Finish the Rayquaza route in Hyperspace Mission 12.",
          "Talk to Gardie on South Boulevard, north of Wild Zone 6 by Café Bataille.",
          "Go to the Rouge Sector 1 training court near Centrico Pokémon Center at sunset.",
          "When Prism Tower’s shadow reaches the centre of the Poké Ball circle and Investigate appears, interact with the spot. Battle and catch Lv. 80 Marshadow."
        ],
        "links": [
          [
            "The Stealthy Shadow · Side Mission 192",
            "side-missions.html#quest-192"
          ],
          [
            "City overview",
            "maps.html"
          ]
        ]
      }
    },
    {
      "id": "zeraora",
      "name": "Zeraora",
      "category": "Mega Dimension",
      "key": "Zeraora",
      "nationalNumber": 807,
      "image": "art/807.webp",
      "place": "Station distortion",
      "description": "After Rayquaza and the other gift missions, trade for Popping Candy on a Vert Sector 3 rooftop. Ask Ansha for the Plasma Donut, then follow Emma to the station portal.",
      "tip": "Level 85 · Dodge the sweeping Electroweb patterns.",
      "encounterLevels": {
        "rogueMegaBoss": 200,
        "postBattleCatch": 85,
        "sources": ["https://www.serebii.net/legendsz-a/sidemissions/raginglightning.shtml", "https://www.dexerto.com/wikis/pokemon-legends-z-a/zeraora-pokemon-legends-z-a/"]
      },
      "originalPdfPage": 7,
      "steps": [
        "After Rayquaza and the other gift missions, find the Popping Candy trade on a Vert Sector 3 rooftop.",
        "Ask Ansha to make the Plasma Donut.",
        "Follow Emma to the station distortion.",
        "Dodge the sweeping Electroweb attack patterns in the encounter."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Boss plans",
          "boss-guide.html"
        ]
      ],
      "verificationGap": "The original PDF does not include a confirmed exact ladder or rooftop entrance for the Popping Candy trade."
    },
    {
      "id": "latias",
      "name": "Latias",
      "category": "Special Scan",
      "key": "Latias",
      "nationalNumber": 380,
      "image": "art/380.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 7,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    },
    {
      "id": "latios",
      "name": "Latios",
      "category": "Special Scan",
      "key": "Latios",
      "nationalNumber": 381,
      "image": "art/381.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 8,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    },
    {
      "id": "cobalion",
      "name": "Cobalion",
      "category": "Special Scan",
      "key": "Cobalion",
      "nationalNumber": 638,
      "image": "art/638.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 8,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    },
    {
      "id": "terrakion",
      "name": "Terrakion",
      "category": "Special Scan",
      "key": "Terrakion",
      "nationalNumber": 639,
      "image": "art/639.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 8,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    },
    {
      "id": "virizion",
      "name": "Virizion",
      "category": "Special Scan",
      "key": "Virizion",
      "nationalNumber": 640,
      "image": "art/640.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 9,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    },
    {
      "id": "keldeo",
      "name": "Keldeo",
      "category": "Special Scan",
      "key": "Keldeo",
      "nationalNumber": 647,
      "image": "art/647.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 9,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    },
    {
      "id": "meloetta",
      "name": "Meloetta",
      "category": "Special Scan",
      "key": "Meloetta",
      "nationalNumber": 648,
      "image": "art/648.webp",
      "place": "Unknown Hyperspace Zone",
      "description": "After Rayquaza, collect 25,000 Hyperspace research points and ask Philippe for a Special Scan. Explore the resulting Unknown Zone for a rare encounter.",
      "tip": "A legendary encounter is guaranteed by the sixth scan without one until this group is caught.",
      "originalPdfPage": 9,
      "steps": [
        "Finish the Rayquaza route in Mega Dimension.",
        "Collect 25,000 Hyperspace research points and request a Special Scan from Philippe.",
        "Explore the Unknown Hyperspace Zone generated by that scan.",
        "Check the legendary encounter; the PDF states a group-level encounter guarantee by the sixth unsuccessful scan, not a fixed species or city location."
      ],
      "links": [
        [
          "Mega Dimension basics",
          "index.html#dimension"
        ],
        [
          "Explore Hyperspace",
          "index.html#dimension"
        ]
      ],
      "verificationGap": "These are random Special Scan Unknown Zone encounters, not guaranteed fixed city-map placements. The exact sixth-scan safeguard should be confirmed during a fresh playthrough."
    }
  ]
};
