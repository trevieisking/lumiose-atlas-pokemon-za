/* AT-321: single source for all Wild Zone photo and encounter panels.
   Roster facts: Serebii Wild Zones; fixed Alpha times and Zone 20 pool: preserved Atlas Alpha source.
   Photo paths/areas: owner batch manifests 01–04. No user data or network API. */
import {areaLink,speciesKey} from "./atlas-area-model.mjs";
export const wildZoneRecords = [
  {
    "number": 1,
    "district": "Vert",
    "area": "South Boulevard / Pokémon Research Lab",
    "species": [
      "Bunnelby",
      "Fletchling",
      "Mareep",
      "Pichu",
      "Pidgey",
      "Scatterbug",
      "Weedle"
    ],
    "fixedAlphas": [
      {
        "name": "Pidgey",
        "condition": "Lv. 24–26"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-01-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-01-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 2,
    "district": "Vert",
    "area": "Vert Plaza",
    "species": [
      "Binacle",
      "Budew",
      "Kakuna",
      "Magikarp",
      "Patrat",
      "Staryu"
    ],
    "fixedAlphas": [
      {
        "name": "Magikarp",
        "condition": "Lv. 30–32 · Day"
      },
      {
        "name": "Staryu",
        "condition": "Lv. 30–32 · Night"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-02-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-02-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 3,
    "district": "Rouge",
    "area": "Rouge Plaza",
    "species": [
      "Espurr",
      "Flabébé",
      "Fletchling",
      "Litleo",
      "Pancham",
      "Pikachu",
      "Skiddo"
    ],
    "fixedAlphas": [
      {
        "name": "Fletchling",
        "condition": "Lv. 30–31"
      },
      {
        "name": "Litleo",
        "condition": "Lv. 23–24"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-03-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-03-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 4,
    "district": "Rouge",
    "area": "Dormez Bien Cemetery",
    "species": [
      "Ekans",
      "Gastly",
      "Honedge",
      "Patrat",
      "Spewpa",
      "Spinarak"
    ],
    "fixedAlphas": [
      {
        "name": "Spinarak",
        "condition": "Lv. 20–21"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-04-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-04-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 5,
    "district": "Bleu",
    "area": "Bleu Sectors 1 and 2 / Bleu Street",
    "species": [
      "Abra",
      "Bellsprout",
      "Binacle",
      "Bunnelby",
      "Electrike",
      "Fletchinder",
      "Fletchling",
      "Patrat",
      "Pidgeotto",
      "Pidgey",
      "Venipede",
      "Whirlipede"
    ],
    "fixedAlphas": [
      {
        "name": "Bellsprout",
        "condition": "Lv. 24–25"
      },
      {
        "name": "Whirlipede",
        "condition": "Lv. 27–28"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-05-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-05-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 6,
    "district": "Jaune",
    "area": "Jaune Sector 12 / North Boulevard",
    "species": [
      "Binacle",
      "Buneary",
      "Flaaffy",
      "Houndoom",
      "Houndour",
      "Magikarp",
      "Meditite",
      "Pikachu",
      "Swablu"
    ],
    "fixedAlphas": [
      {
        "name": "Pikachu",
        "condition": "Lv. 40–42"
      },
      {
        "name": "Houndoom",
        "condition": "Lv. 32–33"
      },
      {
        "name": "Binacle",
        "condition": "Lv. 32–34"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-06-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-06-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 7,
    "district": "Magenta",
    "area": "Magenta Plaza",
    "species": [
      "Audino",
      "Fletchinder",
      "Floette",
      "Gastly",
      "Hippopotas",
      "Kakuna",
      "Roselia",
      "Shuppet",
      "Vanillite"
    ],
    "fixedAlphas": [
      {
        "name": "Fletchinder",
        "condition": "Lv. 32–33"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-07-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-07-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 8,
    "district": "Jaune",
    "area": "Jaune Plaza",
    "species": [
      "Camerupt",
      "Drilbur",
      "Gible",
      "Krokorok",
      "Machop",
      "Numel",
      "Sandile"
    ],
    "fixedAlphas": [
      {
        "name": "Camerupt",
        "condition": "Lv. 39–40"
      },
      {
        "name": "Krokorok",
        "condition": "Lv. 37–38"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-08-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-08-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 9,
    "district": "Magenta",
    "area": "Magenta Sector 5 / Estival Avenue",
    "species": [
      "Carbink",
      "Espurr",
      "Fletchinder",
      "Kadabra",
      "Manectric",
      "Mawile",
      "Meowstic",
      "Sableye"
    ],
    "fixedAlphas": [
      {
        "name": "Meowstic",
        "condition": "Lv. 41–42 · Night · Male · Central rooftop"
      },
      {
        "name": "Meowstic",
        "condition": "Lv. 41–42 · Day · Female · Central rooftop"
      },
      {
        "name": "Manectric",
        "condition": "Lv. 40–41"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-09-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-09-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 10,
    "district": "Bleu",
    "area": "Bleu Sector 10 / South Boulevard / Espace Vide",
    "species": [
      "Arbok",
      "Bellsprout",
      "Carvanha",
      "Sharpedo",
      "Slowpoke",
      "Staryu",
      "Tynamo",
      "Watchog"
    ],
    "fixedAlphas": [
      {
        "name": "Sharpedo",
        "condition": "Lv. 41–43"
      },
      {
        "name": "Watchog",
        "condition": "Lv. 41–43"
      },
      {
        "name": "Arbok",
        "condition": "Lv. 50–52"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-10-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-10-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 11,
    "district": "Jaune",
    "area": "Jaune Sector 10",
    "species": [
      "Clauncher",
      "Clawitzer",
      "Furfrou",
      "Gyarados",
      "Inkay",
      "Slowbro",
      "Slowpoke",
      "Stunfisk"
    ],
    "fixedAlphas": [
      {
        "name": "Slowbro",
        "condition": "Lv. 42–44"
      },
      {
        "name": "Clawitzer",
        "condition": "Lv. 42–44"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-11-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-11-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 12,
    "district": "Bleu",
    "area": "Aymlis Park",
    "species": [
      "Abomasnow",
      "Avalugg",
      "Bergmite",
      "Delibird",
      "Gogoat",
      "Machoke",
      "Machop",
      "Snorunt",
      "Snover",
      "Vanillite"
    ],
    "fixedAlphas": [
      {
        "name": "Abomasnow",
        "condition": "Lv. 43–45"
      },
      {
        "name": "Avalugg",
        "condition": "Lv. 54–56"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-12-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-12-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 13,
    "district": "Rouge",
    "area": "North Boulevard / Rouge Sector 7",
    "species": [
      "Heracross",
      "Phantump",
      "Pinsir",
      "Scyther",
      "Trevenant",
      "Vivillon",
      "Weepinbell"
    ],
    "fixedAlphas": [
      {
        "name": "Trevenant",
        "condition": "Lv. 47–48 · Night"
      },
      {
        "name": "Weepinbell",
        "condition": "Lv. 46–47 · Day"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-13-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-13-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 14,
    "district": "Magenta",
    "area": "Electrical Substation / Saison Canal",
    "species": [
      "Aron",
      "Drilbur",
      "Emolga",
      "Excadrill",
      "Helioptile",
      "Lairon",
      "Onix"
    ],
    "fixedAlphas": [
      {
        "name": "Excadrill",
        "condition": "Lv. 48–49"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-14-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-14-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 15,
    "district": "Jaune",
    "area": "Cafe Ultimo / Jaune Sector 7",
    "species": [
      "Banette",
      "Beedrill",
      "Gourgeist",
      "Haunter",
      "Larvitar",
      "Noibat",
      "Pumpkaboo",
      "Scolipede",
      "Shuppet",
      "Trevenant",
      "Whirlipede"
    ],
    "fixedAlphas": [
      {
        "name": "Beedrill",
        "condition": "Lv. 51–52 · Day"
      },
      {
        "name": "Gourgeist",
        "condition": "Lv. 52–53"
      },
      {
        "name": "Banette",
        "condition": "Lv. 52–53 · Night"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-15-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-15-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 16,
    "district": "Bleu",
    "area": "Bleu Plaza",
    "species": [
      "Ampharos",
      "Barbaracle",
      "Falinks",
      "Flaaffy",
      "Florges",
      "Froakie",
      "Medicham",
      "Starmie"
    ],
    "fixedAlphas": [
      {
        "name": "Ampharos",
        "condition": "Lv. 52–53"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-16-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-16-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 17,
    "district": "Vert",
    "area": "Vert Sector 7 / Vert Street",
    "species": [
      "Chespin",
      "Diggersby",
      "Klefki",
      "Lampent",
      "Mawile",
      "Pyroar",
      "Skarmory"
    ],
    "fixedAlphas": [
      {
        "name": "Pyroar",
        "condition": "Lv. 56–57"
      },
      {
        "name": "Pyroar",
        "condition": "Lv. 56–57"
      },
      {
        "name": "Mawile",
        "condition": "Lv. 56–57"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-17-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-17-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 18,
    "district": "Magenta",
    "area": "Magenta Sector 9 / North Boulevard",
    "species": [
      "Altaria",
      "Bagon",
      "Fennekin",
      "Lopunny",
      "Noibat",
      "Noivern",
      "Salamence",
      "Swablu"
    ],
    "fixedAlphas": [
      {
        "name": "Salamence",
        "condition": "Lv. 61–62"
      },
      {
        "name": "Lopunny",
        "condition": "Lv. 55–56"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-18-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-18-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 19,
    "district": "Jaune",
    "area": "Jaune Sector 8 / North Boulevard",
    "species": [
      "Audino",
      "Clefairy",
      "Cleffa",
      "Drampa",
      "Eevee",
      "Furfrou",
      "Kangaskhan"
    ],
    "fixedAlphas": [
      {
        "name": "Clefairy",
        "condition": "Lv. 58–60 · Night"
      },
      {
        "name": "Furfrou",
        "condition": "Lv. 58–61 · Day; not morning"
      }
    ],
    "rotatingAlphas": [],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-19-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-19-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  },
  {
    "number": 20,
    "district": "Centrico",
    "area": "Centrico Plaza",
    "species": [
      "Aggron",
      "Bulbasaur",
      "Charmander",
      "Chikorita",
      "Dragalge",
      "Garbodor",
      "Gardevoir",
      "Hippowdon",
      "Lucario",
      "Malamar",
      "Roserade",
      "Scrafty",
      "Squirtle",
      "Tepig",
      "Totodile"
    ],
    "fixedAlphas": [],
    "rotatingAlphas": [
      "Raichu",
      "Clefable",
      "Alakazam",
      "Machamp",
      "Victreebel",
      "Gengar",
      "Kangaskhan",
      "Starmie",
      "Pinsir",
      "Gyarados",
      "Vaporeon",
      "Jolteon",
      "Flareon",
      "Dragonite",
      "Ariados",
      "Heracross",
      "Delibird",
      "Skarmory",
      "Tyranitar",
      "Gardevoir",
      "Sableye",
      "Aggron",
      "Medicham",
      "Altaria",
      "Absol",
      "Metagross",
      "Roserade",
      "Garchomp",
      "Lucario",
      "Hippowdon",
      "Leafeon",
      "Glaceon",
      "Gallade",
      "Froslass",
      "Simisage",
      "Simisear",
      "Simipour",
      "Scolipede",
      "Krookodile",
      "Scrafty",
      "Garbodor",
      "Vanilluxe",
      "Eelektross",
      "Chandelure",
      "Stunfisk",
      "Diggersby",
      "Talonflame",
      "Vivillon",
      "Florges",
      "Gogoat",
      "Pangoro",
      "Furfrou",
      "Aegislash",
      "Malamar",
      "Barbaracle",
      "Dragalge",
      "Heliolisk",
      "Sylveon",
      "Hawlucha",
      "Dedenne",
      "Carbink",
      "Goodra",
      "Klefki",
      "Gourgeist",
      "Noivern",
      "Drampa",
      "Falinks"
    ],
    "photos": [
      {
        "kind": "overview",
        "path": "assets/atlas/wild-zones/wild-zone-20-overview.png",
        "width": 1536,
        "height": 865
      },
      {
        "kind": "closeup",
        "path": "assets/atlas/wild-zones/wild-zone-20-closeup.png",
        "width": 1536,
        "height": 865
      }
    ]
  }
];
function escapeHtml(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
export function wildZoneRecord(n){const number=Number(n);return Number.isInteger(number)&&number>=1&&number<=20?wildZoneRecords[number-1]:null;}
export function zoneSearchText(n){const z=wildZoneRecord(n);return z?[z.area,z.district,...z.species,...z.rotatingAlphas].join(" "):"";}
// AT-348: exact visually matched 4000×2252 owner originals; previews stay unchanged.
const fullPhotoPaths=Object.freeze({
  "assets/atlas/wild-zones/wild-zone-15-overview.png": "assets/atlas/wild-zones/originals/wild-zone-15-overview.jpg",
  "assets/atlas/wild-zones/wild-zone-17-overview.png": "assets/atlas/wild-zones/originals/wild-zone-17-overview.jpg",
  "assets/atlas/wild-zones/wild-zone-17-closeup.png": "assets/atlas/wild-zones/originals/wild-zone-17-closeup.jpg"
});
export function wildZoneFullPhotoPath(previewPath){return Object.hasOwn(fullPhotoPaths,previewPath)?fullPhotoPaths[previewPath]:previewPath;}
export function wildZoneFieldbookMarkup(n){
 const z=wildZoneRecord(n);if(!z)return "";
 const label="Wild Zone "+String(z.number).padStart(2,"0");
 const e=escapeHtml;
 const evidenceLink=areaLink({areaId:'wz-'+String(z.number).padStart(2,'0')});
 const habitat=name=>'<a href="'+e(areaLink({speciesId:speciesKey(name)}))+'" data-atlas-species="'+e(speciesKey(name))+'" aria-label="'+e('Explore recorded habitats for '+name)+'">'+e(name)+'</a>';
 const photos=z.photos.map(p=>{
   const heading=p.kind==="overview"?"Area overview & Pokémon encounter card":"Detailed area close-up";
   return '<figure><a href="'+e(wildZoneFullPhotoPath(p.path))+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+e(label+" — "+heading)+' at full resolution"><img src="'+e(p.path)+'" alt="'+e(label+" — "+heading+", "+z.area)+'" width="'+p.width+'" height="'+p.height+'" loading="lazy" decoding="async"></a><figcaption><strong>'+heading+'</strong><span>Tap or click to view full size ↗</span></figcaption></figure>';
 }).join("");
 const names=z.species.map(s=>'<li>'+habitat(s)+'</li>').join("");
 const fixed=z.fixedAlphas.map(a=>'<li><strong>'+habitat(a.name)+'</strong><span>'+e(a.condition)+'</span></li>').join("");
 const alphaPanel=z.number===20?
  '<details class="wz-alpha-pool"><summary>67 possible rotating Alpha Pokémon</summary><p>Two rotating Alpha encounters from the saved pool; individual species are not guaranteed on each visit (Lv. 63–65).</p><ul class="wz-species">'+z.rotatingAlphas.map(s=>'<li>'+habitat(s)+'</li>').join("")+'</ul></details>':
  '<h4>Recorded fixed Alpha encounters</h4><ul class="wz-fixed-alphas">'+fixed+'</ul><p>Listed Alpha locations and times are preserved from the existing Alpha fieldbook; other eligible wild spawns may become Alpha after the zone survey.</p>';
 return '<section class="wz-fieldbook" data-wz-fieldbook="'+z.number+'" aria-label="'+e(label+" original maps and preserved encounter records")+'"><div class="wz-fieldbook-title"><h3>'+e(label+" · "+z.area)+'</h3><p>'+e(z.district+" district · original owner map photographs")+'</p></div><div class="wz-photo-pair">'+photos+'</div><h4>'+ (z.number===20?"15 recorded ordinary species":"Preserved species records · incomplete roster")+'</h4><ul class="wz-species" aria-label="Preserved species records">'+names+'</ul><p class="wz-roster-status">'+ (z.number===20?"These recorded ordinary species are separate from the rotating Alpha pool. The roster is not comprehensive; check the current evidence notes for availability and conditions.":"These names come from the saved fieldbook. The roster is incomplete, and some entries are disputed or have unresolved encounter classes. Check the current evidence notes for ordinary, Alpha and other encounter conditions.")+' <a data-wz-current-evidence="'+z.number+'" href="'+e(evidenceLink)+'">Current encounter evidence for '+e(label)+'</a></p>'+alphaPanel+'<p class="wz-evidence">Original photos show the owner’s captured game session, not the reader’s saved progress or permanent distortion locations. They are orientation references, not exact pickup pins. <a href="alphas.html#zone-'+z.number+'">Full Alpha fieldbook ↗</a></p></section>';
}
