// 18×18 modern Pokémon type-effectiveness rules; source PDF pp. 1–5, remaining print-clipped columns cross-checked against Bulbapedia Gen VI+ chart (2026-11-21).
// Offensive rows: super=2×, half=½×, zero=0×, any other defender=1×. Standard rules only; rogue bosses can override immunities.
window.ATLAS_TYPE_RULES = [
  {
    "type": "Normal",
    "super": [],
    "half": [
      "Rock",
      "Steel"
    ],
    "zero": [
      "Ghost"
    ]
  },
  {
    "type": "Fire",
    "super": [
      "Grass",
      "Ice",
      "Bug",
      "Steel"
    ],
    "half": [
      "Fire",
      "Water",
      "Rock",
      "Dragon"
    ],
    "zero": []
  },
  {
    "type": "Water",
    "super": [
      "Fire",
      "Ground",
      "Rock"
    ],
    "half": [
      "Water",
      "Grass",
      "Dragon"
    ],
    "zero": []
  },
  {
    "type": "Electric",
    "super": [
      "Water",
      "Flying"
    ],
    "half": [
      "Electric",
      "Grass",
      "Dragon"
    ],
    "zero": [
      "Ground"
    ]
  },
  {
    "type": "Grass",
    "super": [
      "Water",
      "Ground",
      "Rock"
    ],
    "half": [
      "Fire",
      "Grass",
      "Poison",
      "Flying",
      "Bug",
      "Dragon",
      "Steel"
    ],
    "zero": []
  },
  {
    "type": "Ice",
    "super": [
      "Grass",
      "Ground",
      "Flying",
      "Dragon"
    ],
    "half": [
      "Fire",
      "Water",
      "Ice",
      "Steel"
    ],
    "zero": []
  },
  {
    "type": "Fighting",
    "super": [
      "Normal",
      "Ice",
      "Rock",
      "Dark",
      "Steel"
    ],
    "half": [
      "Poison",
      "Flying",
      "Psychic",
      "Bug",
      "Fairy"
    ],
    "zero": [
      "Ghost"
    ]
  },
  {
    "type": "Poison",
    "super": [
      "Grass",
      "Fairy"
    ],
    "half": [
      "Poison",
      "Ground",
      "Rock",
      "Ghost"
    ],
    "zero": [
      "Steel"
    ]
  },
  {
    "type": "Ground",
    "super": [
      "Fire",
      "Electric",
      "Poison",
      "Rock",
      "Steel"
    ],
    "half": [
      "Grass",
      "Bug"
    ],
    "zero": [
      "Flying"
    ]
  },
  {
    "type": "Flying",
    "super": [
      "Grass",
      "Fighting",
      "Bug"
    ],
    "half": [
      "Electric",
      "Rock",
      "Steel"
    ],
    "zero": []
  },
  {
    "type": "Psychic",
    "super": [
      "Fighting",
      "Poison"
    ],
    "half": [
      "Psychic",
      "Steel"
    ],
    "zero": [
      "Dark"
    ]
  },
  {
    "type": "Bug",
    "super": [
      "Grass",
      "Psychic",
      "Dark"
    ],
    "half": [
      "Fire",
      "Fighting",
      "Poison",
      "Flying",
      "Ghost",
      "Steel",
      "Fairy"
    ],
    "zero": []
  },
  {
    "type": "Rock",
    "super": [
      "Fire",
      "Ice",
      "Flying",
      "Bug"
    ],
    "half": [
      "Fighting",
      "Ground",
      "Steel"
    ],
    "zero": []
  },
  {
    "type": "Ghost",
    "super": [
      "Psychic",
      "Ghost"
    ],
    "half": [
      "Dark"
    ],
    "zero": [
      "Normal"
    ]
  },
  {
    "type": "Dragon",
    "super": [
      "Dragon"
    ],
    "half": [
      "Steel"
    ],
    "zero": [
      "Fairy"
    ]
  },
  {
    "type": "Dark",
    "super": [
      "Psychic",
      "Ghost"
    ],
    "half": [
      "Fighting",
      "Dark",
      "Fairy"
    ],
    "zero": []
  },
  {
    "type": "Steel",
    "super": [
      "Ice",
      "Rock",
      "Fairy"
    ],
    "half": [
      "Fire",
      "Water",
      "Electric",
      "Steel"
    ],
    "zero": []
  },
  {
    "type": "Fairy",
    "super": [
      "Fighting",
      "Dragon",
      "Dark"
    ],
    "half": [
      "Fire",
      "Poison",
      "Steel"
    ],
    "zero": []
  }
];
