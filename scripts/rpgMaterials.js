// singleton monsters
// List of monsters data
var monsters = {
    // Microlite20 Monsters
    list: [ // name, hitDiceAmount, hitDiceSides, hitBonus, hp, ac, damageDiceAmount, damageDiceSides, damageBonus, imagePath
        ["Animal (small)", 1, 8, 2, 6, 15, 4, 1, 2, -1, "img/collection/dc-mon/animals/giant_newt.png"],
        ["Ankheg", 3, 10, 12, 28, 18, 7, 2, 6, 7, "img/collection/dc-mon/animals/giant_scorpion.png"],
        ["Bugbear", 3, 8, 3, 16, 17, 5, 1, 8, 2, "img/collection/UNUSED/monsters/spriggan_rider.png"],
        ["Choker", 3, 8, 3, 16, 17, 6, 1, 3, 3, "img/collection/dc-mon/unique/ilsuiw_water.png"],
        ["Deinonychous (Raptor)", 4, 8, 16, 34, 16, 6, 2, 6, 4, "img/collection/UNUSED/monsters/holy_dragon.png"],
        ["Dire Rat", 1, 8, 1, 5, 15, 4, 1, 4, 0, "img/collection/dc-mon/animals/rat.png"],
        ["Dwarf", 1, 8, 2, 6, 16, 3, 1, 10, 1, "img/collection/dc-mon/dwarf.png"],
        ["Earth Elemental (large)", 8, 8, 32, 68, 18, 12, 2, 8, 7, "img/collection/dc-mon/nonliving/earth_elemental.png"],
        ["Elf", 1, 8, 0, 4, 15, 2, 1, 8, 1, "img/collection/dc-mon/elf.png"],
        ["Gargoyle", 4, 8, 19, 37, 16, 6, 1, 4, 2, "img/collection/dc-mon/nonliving/gargoyle.png"],
        ["Goblin", 1, 8, 1, 5, 15, 2, 1, 6, 0, "img/collection/dc-mon/goblin.png"],
        ["Griffon", 7, 10, 21, 59, 17, 11, 2, 6, 4, "img/collection/dc-mon/griffon.png"],
        ["Halfling", 1, 8, 1, 5, 16, 3, 1, 6, 0, "img/collection/dc-mon/halfling.png"],
        ["Hellhound", 4, 8, 4, 22, 16, 5, 1, 8, 1, "img/collection/dc-mon/demons/hellion.png" ],
        ["Hill Giant", 12, 8, 48, 102, 20, 16, 2, 8, 10, "img/collection/dc-mon/hill_giant.png"],
        ["Hobgoblin", 1, 8, 2, 6, 15, 2, 1, 8, 1, "img/collection/dc-mon/hobgoblin.png"],
        ["Human Commoner", 1, 8, 1, 5, 12, 1, 1, 6, 1, "img/collection/UNUSED/monsters/spriggan_berserker.png"],
        ["Insect (small)", 1, 8, 0, 4, 14, 4, 1, 4, -2, "img/collection/dc-mon/animals/giant_beetle.png"],
        ["Kobold", 1, 8, 0, 4, 15, 1, 1, 6, -1, "img/collection/dc-mon/kobold.png"],
        ["Ogre", 4, 8, 11, 29, 16, 8, 2, 8, 7, "img/collection/dc-mon/ogre.png"],
        ["Orc", 1, 8, 1, 5, 13, 4, 2, 4, 4, "img/collection/dc-mon/orc.png"],
        ["Owlbear", 5, 10, 25, 52, 15, 9, 1, 6, 5, "img/collection/dc-mon/animals/grizzly_bear.png"],
        ["Rust Monster", 5, 8, 5, 27, 18, 3, 1, 3, 0, "img/collection/dc-mon/demons/cigotuvis_monster.png"], // No damage
        ["Shadow", 3, 12, 0, 19, 13, 3, 1, 6, 0, "img/collection/dc-mon/demons/shadow_demon.png"], // (1d6 Str) damage
        ["Skeleton Warrior", 1, 12, 0, 6, 15, 1, 1, 6, 1, "img/collection/dc-mon/undead/skeletons/skeleton_humanoid_large.png"],
        ["Stirge", 1, 10, 0, 5, 16, 7, 1, 3, 0, "img/collection/player/transform/bat_form.png"], // No damage
        ["Stone Golem", 14, 10, 30, 107, 26, 18, 2, 10, 9, "img/collection/dc-mon/nonliving/stone_golem.png"],
        ["Troll", 6, 8, 36, 63, 16, 9, 1, 4, 2, "img/collection/dc-mon/iron_troll.png"],
        ["Werewolf (hybrid form)", 3, 8, 7, 20, 16, 4, 1, 4, 2, "img/collection/dc-mon/animals/wolf.png"],
        ["Wight", 4, 12, 0, 26, 15, 3, 1, 4, 1, "img/collection/dc-mon/undead/wight.png"],
        ["Wolf", 2, 8, 4, 13, 14, 3, 1, 6, 1, "img/collection/dc-mon/animals/wolf.png"],
        ["Wyvern", 7, 12, 14, 59, 18, 10, 1, 6, 4, "img/collection/dc-mon/wyvern.png"],
        ["Zombie", 2, 12, 3, 16, 11, 2, 1, 6, 1, "img/collection/UNUSED/monsters/zombie_small.png"]
    ]
};

// singleton equipments
// List of equipments data
var equipments = {
    // Microlite20 Equipments
    twoHandedWeapons: [ // Weapon, Cost, Damage, Range
        ["Chain, spiked", 25, 2, 4, 0, "/img/collection/player/head/chain.png"],
        ["Falchion", 75, 1, 6, 0, "img/collection/player/hand1/falchion.png"],
        ["Flail, heavy", 15, 1, 8, 0, "img/collection/item/weapon/great_flail1.png"],
        ["Glaive", 8, 1, 8, 0, "img/collection/item/weapon/orcish_glaive.png"],
        ["Greataxe", 20, 1, 10, 0, "img/floor.png"], // no image
        ["Greatclub", 5, 1, 8, 0, "img/collection/item/weapon/giant_spiked_club.png"],
        ["Greatsword", 50, 2, 6, 0, "img/collection/item/weapon/greatsword1.png"],
        ["Guisarme", 9, 2, 4, 0, "img/floor.png"], // no image
        ["Guisarme", 9, 2, 4, 0, "img/floor.png"], // no image
        ["Halberd", 10, 1, 10, 0, "img/collection/player/hand1/halberd.png"],
        ["Lance", 10, 1, 8, 0, "img/collection/player/hand1/lance2.png"],
        ["Longspear", 5, 1, 8, 0, "img/collection/UNUSED/weapons/spear.png"],
        ["Quarterstaff", 0, 1, 6, 0, "img/collection/player/hand1/quarterstaff1.png"],
        ["Scythe", 18, 2, 4, 0, "img/collection/item/weapon/scythe1.png"],
        ["Spear", 2, 1, 8, 20, "img/collection/UNUSED/weapons/spear.png"]
    ],

    lightWeapons: [ // Weapon, Cost, Damage, Range
        ["Unarmed Strike", 0, 1, 3, 0, "img/floor.png"], // no image
        ["Axe, throwing", 8, 1, 6, 10, "img/collection/player/hand1/axe.png"],
        ["Dagger", 2, 1, 4, 10, "img/collection/item/weapon/dagger.png"],
        ["Hammer, light", 1, 1, 6, 20, "img/collection/UNUSED/weapons/war_hammer.png"],
        ["Handaxe", 6, 1, 4, 0, "img/collection/player/hand1/artefact/axe_trog.png"],
        ["Mace, light", 5, 1, 6, 0, "img/collection/UNUSED/weapons/mace1.png"],
        ["Pick, light", 4, 1, 4, 0, "img/collection/player/hand1/pick_axe.png"],
        ["Sap", 1, 1, 6, 0, "img/floor.png"], // no image
        ["Sickle", 6, 1, 6, 0, "img/collection/player/hand1/sickle.png"],
        ["Short, sword", 10, 1, 6, 0, "img/collection/item/weapon/elven_short_sword.png"]
    ],

    oneHandedWeapons: [ // Weapon, Cost, Damage, Range
        ["Battleaxe", 10, 1, 3, 0, "img/floor.png"], // no image
        ["Club", 0, 1, 6, 10, "img/collection/item/weapon/club.png"],
        ["Flail", 8, 1, 4, 10, "img/collection/item/weapon/flail1.png"],
        ["Longsword", 15, 1, 6, 20, "img/collection/item/weapon/orcish_great_sword.png"],
        ["Mace, heavy", 12, 1, 4, 0, "img/collection/UNUSED/weapons/mace3.png"],
        ["Morningstar", 8, 1, 6, 0, "img/collection/item/weapon/morningstar2.png"],
        ["Pick, heavy", 8, 1, 4, 0, "img/floor.png"], // no image
        ["Rapier", 20, 1, 6, 0, "img/floor.png"], // no image
        ["Scimitar", 15, 1, 6, 0, "img/collection/item/weapon/scimitar2.png"],
        ["Shortspear", 1, 1, 6, 0, "img/collection/player/hand1/artefact/crystal_spear.png"],
        ["Sword, bastard", 35, 1, 6, 0, "img/collection/UNUSED/weapons/golden_sword.png"],
        ["Trident", 15, 1, 4, 0, "img/collection/item/weapon/trident1.png"],
        ["Waraxe, dwarven", 30, 1, 6, 0, "img/collection/item/weapon/war_axe2.png"],
        ["Warhammer", 12, 1, 6, 0, "img/collection/UNUSED/weapons/war_hammer.png"],
        ["Whip", 1, 1, 6, 0, "img/collection/dc-mon/statues/overlay_whip.png"]
    ],

    armours: [ // Armour, Cost, Bonus
        ["Padded", 2, 1, "img/floor.png"], // no image
        ["Leather", 10, 2, "img/collection/item/armour/leather_armour1.png"],
        ["Studded Leather", 25, 3, "img/collection/UNUSED/armour/studded_leather_armor.png"],
        ["Chain Shirt", 100, 4, "img/collection/item/armour/chain_mail3.png"],
        ["Hide", 15, 3, "img/collection/item/armour/troll_hide.png"],
        ["Scale Mail", 50, 4, "img/collection/player/body/scalemail2.png"],
        ["Chainmail", 150, 5, "img/collection/player/body/chainmail3.png"],
        ["Breastplate", 200, 5, "img/floor.png"], // no image
        ["Splint Mail", 200, 6, "img/collection/item/armour/splint_mail1.png"],
        ["Banded Mail", 250, 6, "img/collection/item/armour/banded_mail2.png"],
        ["Half-plate", 600, 7, "img/collection/player/body/half_plate2.png"],
        ["Full Plate", 1500, 8, "img/collection/player/body/plate2.png"]
    ],

    shields: [ // Armour, Cost, Bonus
        ["Buckler", 2, 1, "img/collection/item/armour/shields/buckler3.png"],
        ["Shield, light wooden", 10, 1, "img/collection/item/armour/shields/buckler1.png"],
        ["Shield, light steel", 25, 1, "img/collection/UNUSED/armour/shield2.png"],
        ["Shield, heavy wooden", 100, 2, "img/collection/item/armour/shields/shield2_kite.png"],
        ["Shield, heavy steel", 20, 2, "img/collection/item/armour/shields/large_shield2.png"],
        ["Shield, tower", 30, 4, "img/collection/item/armour/shields/large_shield3.png"]
    ]
};
