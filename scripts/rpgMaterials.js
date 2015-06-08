// singleton monsters
// List of monsters data
var monsters = {
    // Microlite20 Monsters
    list: [ // name, hitDiceAmount, hitDiceSides, hitBonus, hp, ac, damageDiceAmount, damageDiceSides, damageBonus, imagePath
        ["Animal (small)", 1, 8, 2, 6, 15, 1, 2, -1, "img/collection/dc-mon/animals/giant_newt.png"],
        ["Ankheg", 3, 10, 12, 28, 18, 2, 6, 7, "img/collection/dc-mon/animals/giant_scorpion.png"],
        ["Bugbear", 3, 8, 3, 16, 17, 1, 8, 2, "img/collection/UNUSED/monsters/spriggan_rider.png"],
        ["Choker", 3, 8, 3, 16, 17, 1, 3, 3, "img/collection/dc-mon/unique/ilsuiw_water.png"],
        ["Deinonychous (Raptor)", 4, 8, 16, 34, 16, 2, 6, 4, "img/collection/UNUSED/monsters/holy_dragon.png"],
        ["Dire Rat", 1, 8, 1, 5, 15, 1, 4, 0, "img/collection/dc-mon/animals/rat.png"],
        ["Dwarf", 1, 8, 2, 6, 16, 1, 10, 1, "img/collection/dc-mon/dwarf.png"],
        ["Earth Elemental (large)", 8, 8, 32, 68, 18, 2, 8, 7, "img/collection/dc-mon/nonliving/earth_elemental.png"],
        ["Elf", 1, 8, 0, 4, 15, 1, 8, 1, "img/collection/dc-mon/elf.png"],
        ["Gargoyle", 4, 8, 19, 37, 16, 1, 4, 2, "img/collection/dc-mon/nonliving/gargoyle.png"],
        ["Goblin", 1, 8, 1, 5, 15, 1, 6, 0, "img/collection/dc-mon/goblin.png"],
        ["Griffon", 7, 10, 21, 59, 17, 2, 6, 4, "img/collection/dc-mon/griffon.png"],
        ["Halfling", 1, 8, 1, 5, 16, 1, 6, 0, "img/collection/dc-mon/halfling.png"],
        ["Hellhound", 4, 8, 4, 22, 16, 1, 8, 1, "img/collection/dc-mon/demons/hellion.png" ],
        ["Hill Giant", 12, 8, 48, 102, 20, 2, 8, 10, "img/collection/dc-mon/hill_giant.png"],
        ["Hobgoblin", 1, 8, 2, 6, 15, 1, 8, 1, "img/collection/dc-mon/hobgoblin.png"],
        ["Human Commoner", 1, 8, 1, 5, 12, 1, 6, 1, "img/collection/UNUSED/monsters/spriggan_berserker.png"],
        ["Insect (small)", 1, 8, 0, 4, 14, 1, 4, -2, "img/collection/dc-mon/animals/giant_beetle.png"],
        ["Kobold", 1, 8, 0, 4, 15, 1, 6, -1, "img/collection/dc-mon/kobold.png"],
        ["Ogre", 4, 8, 11, 29, 16, 2, 8, 7, "img/collection/dc-mon/ogre.png"],
        ["Orc", 1, 8, 1, 5, 13, 2, 4, 4, "img/collection/dc-mon/orc.png"],
        ["Owlbear", 5, 10, 25, 52, 15, 1, 6, 5, "img/collection/dc-mon/animals/grizzly_bear.png"],
        ["Rust Monster", 5, 8, 5, 27, 18, 1, 3, 0, "img/collection/dc-mon/demons/cigotuvis_monster.png"], // No damage
        ["Shadow", 3, 12, 0, 19, 13, 1, 6, 0, "img/collection/dc-mon/demons/shadow_demon.png"], // (1d6 Str) damage
        ["Skeleton Warrior", 1, 12, 0, 6, 15, 1, 6, 1, "img/collection/dc-mon/undead/skeletons/skeleton_humanoid_large.png"],
        ["Stirge", 1, 10, 0, 5, 16, 1, 3, 0, "img/collection/player/transform/bat_form.png"], // No damage
        ["Stone Golem", 14, 10, 30, 107, 26, 2, 10, 9, "img/collection/dc-mon/nonliving/stone_golem.png"],
        ["Troll", 6, 8, 36, 63, 16, 1, 4, 2, "img/collection/dc-mon/iron_troll.png"],
        ["Werewolf (hybrid form)", 3, 8, 7, 20, 16, 1, 4, 2, "img/collection/dc-mon/animals/wolf.png"],
        ["Wight", 4, 12, 0, 26, 15, 1, 4, 1, "img/collection/dc-mon/undead/wight.png"],
        ["Wyvern", 7, 12, 14, 59, 18, 1, 6, 4, "img/collection/dc-mon/wyvern.png"],
        ["Zombie", 2, 12, 3, 16, 11, 1, 6, 1, "img/collection/UNUSED/monsters/zombie_small.png"]
    ]
};

// singleton equipments
// List of equipments data
var equipments = {
    // Microlite20 Equipments
    twoHandedWeapons: [ // Weapon, Cost, Damage, Range
        ["Chain, spiked", 25, 2, 4, 0],
        ["Falchion", 75, 1, 6, 0],
        ["Flail, heavy", 15, 1, 8, 0],
        ["Glaive", 8, 1, 8, 0],
        ["Greataxe", 20, 1, 10, 0],
        ["Greatclub", 5, 1, 8, 0],
        ["Greatsword", 50, 2, 6, 0],
        ["Guisarme", 9, 2, 4, 0],
        ["Guisarme", 9, 2, 4, 0],
        ["Halberd", 10, 1, 10, 0],
        ["Lance", 10, 1, 8, 0],
        ["Longspear", 5, 1, 8, 0],
        ["Quarterstaff", 0, 1, 6, 0],
        ["Scythe", 18, 2, 4, 0],
        ["Spear", 2, 1, 8, 20]
    ],

    lightWeapons: [ // Weapon, Cost, Damage, Range
        ["Unarmed Strike", 0, 1, 3, 0],
        ["Axe, throwing", 8, 1, 6, 10],
        ["Dagger", 2, 1, 4, 10],
        ["Hammer, light", 1, 1, 6, 20],
        ["Handaxe", 6, 1, 4, 0],
        ["Mace, light", 5, 1, 6, 0],
        ["Pick, light", 4, 1, 4, 0],
        ["Sap", 1, 1, 6, 0],
        ["Sickle", 6, 1, 6, 0],
        ["Short, sword", 10, 1, 6, 0]
    ],

    oneHandedWeapons: [ // Weapon, Cost, Damage, Range
        ["Battleaxe", 10, 1, 3, 0],
        ["Club", 0, 1, 6, 10],
        ["Flail", 8, 1, 4, 10],
        ["Longsword", 15, 1, 6, 20],
        ["Mace, heavy", 12, 1, 4, 0],
        ["Morningstar", 8, 1, 6, 0],
        ["Pick, heavy", 8, 1, 4, 0],
        ["Rapier", 20, 1, 6, 0],
        ["Scimitar", 15, 1, 6, 0],
        ["Shortspear", 1, 1, 6, 0],
        ["Sword, bastard", 35, 1, 6, 0],
        ["Trident", 15, 1, 4, 0],
        ["Waraxe, dwarven", 30, 1, 6, 0],
        ["Warhammer", 12, 1, 6, 0],
        ["Whip", 1, 1, 6, 0]
    ],

    armours: [ // Armour, Cost, Bonus
        ["Padded", 2, 1],
        ["Leather", 10, 2],
        ["Studded Leather", 25, 3],
        ["Chain Shirt", 100, 4],
        ["Hide", 15, 3],
        ["Scale Mail", 50, 4],
        ["Chainmail", 150, 5],
        ["Breastplate", 200, 5],
        ["Splint Mail", 200, 6],
        ["Banded Mail", 250, 6],
        ["Half-plate", 600, 7],
        ["Full Plate", 1500, 8]
    ],

    shields: [ // Armour, Cost, Bonus
        ["Buckler", 2, 1],
        ["Shield, light wooden", 10, 1],
        ["Shidle, light steel", 25, 1],
        ["Shield, heavy wooden", 100, 2],
        ["Shield, heavy steel", 20, 2],
        ["Shield, tower", 30, 4]
    ]
};
