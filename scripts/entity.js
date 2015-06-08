// class Entity
// Base entity. May occupy room in the dungeon.
var Entity = function(name) {
    this.position = new Vector();
    this.name = name || "Entity";
    this.type = "";
    this.code = " ";
    this.map = null;
    this.image = null;
    this.container = game.foreground;
    this.showing = true;
};

Entity.prototype.getPosition = function() {
    return this.position;
};

Entity.prototype.setPosition = function(pos) {
    // Collision detection
    var lastPos = this.getPosition();
    this.position = pos;

    if (this.map && !this.map.onMove(this, lastPos, pos))
        this.position = lastPos;

    this.updatePosition();
};

Entity.prototype.updatePosition = function(pos) {
    if (this.image) {
        this.image.x = this.position.x * 32;
        this.image.y = this.position.y * 32;
    }
};

Entity.prototype.hide = function() {
    if (this.showing) {
        this.container.removeChild(this.image);
        this.showing = !this.showing;
    }
};

Entity.prototype.show = function() {
    if (!this.showing) {
        this.container.addChild(this.image);
        this.updatePosition();
        this.showing = !this.showing;
    }
};

Entity.prototype.getName = function() { return this.name; };
Entity.prototype.setName = function(name) { this.name = name; };

Entity.prototype.getType = function() { return this.type; };
Entity.prototype.setType = function(type) { this.type = type; };

Entity.prototype.getCode = function() { return this.code; };
Entity.prototype.setCode = function(code) { this.code = code; };

Entity.prototype.getMap = function() { return this.map; };
Entity.prototype.setMap = function(map) { this.map = map; };

Entity.prototype.getImage = function() { return this.image; };

Entity.prototype.setImage = function(image) {
    if (image === null && this.image !== null) {
        this.container.removeChild(this.image);
        this.image = null;
    } else {
        if (this.show) this.container.addChild(image);
        this.updatePosition();
        this.image = image;
    }
};

Entity.prototype.onMapChange = function() {
    if (this.image !== null) {
        this.container.addChild(this.image);
        this.updatePosition();
    }
};

Entity.prototype.isBlockable = function() { return true; }

Entity.prototype.toString = function() {
    return this.name;
};


// class Stats
// Statistics for the player
// Implements part of the Microlite20 RPG system (Licensed as OGL).
var Stats = function(str, dex, mind) {
    // Core stats
    this.level = 1;
    this.str = this.roll4d6RemoveLowest();
    this.dex = this.roll4d6RemoveLowest();
    this.mind = this.roll4d6RemoveLowest();
    this.statPoints = 0;

    this.encounterLevel = 0;

    // Derived stats
    //this.maxHp = this.str + random.die(1, 6); // HP is STR bonus + 1d6 per level
    this.maxHp = this.str + random.die(3, 6);
    this.hp = this.maxHp;

    // Current damage
    // Unarmed strike deals 1d3 damage
    this.damageDiceAmount = 1;
    this.damageDiceSides = 3;

    // Bonuses
    this.armourBonus = 0;
};

Stats.prototype.getMaximumDamage = function() {
    return this.damageDiceAmount * this.damageDiceSides + this.calculateBonus(this.str) + this.level;
};

Stats.prototype.roll4d6RemoveLowest = function() {
    var rolls = [random.die(1, 6), random.die(1, 6), random.die(1, 6), random.die(1, 6)];
    var lowest = 0;

    for (var i = 1; i < rolls.length; ++i) {
        if (rolls[lowest] > rolls[i]) {
            lowest = i;
        }
    }

    rolls.splice(lowest, 1);
    var sum = 0;

    rolls.forEach(function (each) {
        sum += each;
    });

    return sum;
};

Stats.prototype.rollStrDamage = function() {
    return random.die(this.damageDiceAmount, this.damageDiceSides) + this.calculateBonus(this.str) + this.level;
};

Stats.prototype.rollStrAttack = function() {
    return random.die(1, 20) + this.calculateAttackBonus(this.str);
};

Stats.prototype.rollDexDamage = function() {
    return random.die(this.damageDiceAmount, this.damageDiceSides) + this.calculateBonus(this.dex) + this.level;
};

Stats.prototype.rollDexAttack = function() {
    return random.die(1, 20) + this.calculateAttackBonus(this.dex);
};

Stats.prototype.calculateAttackBonus = function(points) {
    return this.calculateBonus(points) + this.level;
};

Stats.prototype.calculateBonus = function(points) {
    var bonus = Math.floor((points - 10)/2);
    if (bonus < 0) bonus = 0;
    return bonus;
};

Stats.prototype.getAc = function() {
    return 10 + this.calculateBonus(this.dex) + this.armourBonus;
};

Stats.prototype.addEncounterLevel = function(levels) {
    game.message("Gained " + levels + " encounter level(s).");

    for (var i = 0; i < levels; ++i) {
        ++this.encounterLevel;

        //if (this.encounterLevel == 10*this.level) {
        if (this.encounterLevel == 5*this.level) {
            this.levelUp();
            this.encounterLevel = 0;
        }
    }
};

Stats.prototype.levelUp = function() {
    ++this.level;
    game.message("You leveled up to level " + this.level + ".");
    //this.maxHp += + random.die(1, 6);
    this.maxHp += + random.die(3, 6);
    this.hp = this.maxHp;
    if (this.level % 3 == 0) {
        if (random.integer(2) == 0)
            ++this.str;
        else
            ++this.dex;
    }
};

Stats.prototype.toString = function() {
    var s = "";

    s += "Level: " + this.level;
    s += "\nStr: " + this.str;
    s += "\nDex: " + this.dex;
    s += "\nMind: " + this.mind;

    s += "\n\nDamage: " + this.damageDiceAmount + "d" + this.damageDiceSides + " + " + (this.calculateBonus(this.str) + this.level);
    s += "\nAC: " + this.getAc();

    return s;
};


// class Character
// Entity that can roam the dungeon
var Character = function(name) {
    Entity.call(this, name);
    this.setType("character");
};

Character.prototype = Object.create(Entity.prototype);
Character.prototype.constructor = Character;

Character.prototype.getStats = function() { return this.stats; };
Character.prototype.getInventory = function() { return this.inventory; };

Character.prototype.applyDamage = function(damage) {
    this.addHp(-damage);

    if (!this.isAlive()) {
        var cell = this.map.cellAt(this.getPosition());
        //cell.setCode("%");

        // Randomly drop an item
        if (random.integer(10) < 3) {
            var item = random.item(this.map.getPlayer().getStats().level);
            item.setImage(new createjs.Bitmap("img/collection/UNUSED/other/chest2_open.png"));
            item.setPosition(this.getPosition());
            this.map.add(item);
        }

        this.hide();
        this.map.remove(this);
    }
};

Character.prototype.isAlive = function() { return (this.getHp() > 0); };

// Virtual
Character.prototype.getHp = function() { return 0; };

// Virtual
Character.prototype.setHp = function(hp) {};

Character.prototype.addHp = function(hp) {
    this.setHp(this.getHp() + hp);
};

Character.prototype.getAc = function() { return 0; };

Character.prototype.isBlockable = function() { return true; }



// class Player
// The character which the player will control
var Player = function(name) {
    Character.call(this, name);
    this.setType("player");

    this.stats = new Stats(18, 18, 18);

    this.inventory = new Inventory(this);
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.move = function(dir) {
    if (!this.isAlive()) return;

    var from = this.getPosition();
    var to = from.add(dir);

    if (this.map && this.map.cellAt(to)) {
        if (this.map.cellAt(to).isBlocked()) {
            var other = this.map.cellAt(to).getEntity();

            if (other.getType() == "enemy") {
                var roll = random.die(1, 20);

                if (roll == 20) {
                    var damage = this.stats.getMaximumDamage();
                    other.applyDamage(damage);
                    game.message("You dealt critical " + damage + " damage to " + other + ".");
                } else if (roll + this.stats.calculateBonus(this.stats.str) + this.stats.level > other.getAc()) {
                    var damage = this.stats.rollStrDamage();
                    other.applyDamage(damage);
                    game.message("You dealt " + damage + " damage to " + other + ".");
                } else {
                    game.message("You missed trying to hit " + other + ".");
                }

                if (!other.isAlive()) {
                    this.stats.addEncounterLevel(other.getEncounterLevel());
                }
            }
        } else {
            this.setPosition(to);
            var item = this.map.cellAt(to).getItem();

            if (item) {
                if (item.getType() == "stairs") {
                    game.makeNextLevel();
                } else {
                    game.message("You are standing on " + item + ".");
                }
            }
        }
    }
}

// Interact with an item the player is standing on
Player.prototype.interact = function() {
    var itemLoc = this.map.cellAt(this.getPosition());

    if (itemLoc === null) return;

    var item = itemLoc.getItem();

    if (item) {
        if (item.getType() == "chest") {
            item.open();

            item = this.map.cellAt(this.getPosition()).getItem();

            if (item) {
                game.message("You opened chest. Standing on " + item + ".");
            } else {
                game.message("You opened chest. It was empty.");
            }
        } else if (item.isPickable()) {
            if (this.getInventory().addItem(item)) {
                game.message("You added " + item + " to inventory.");
            }
        }
    }
};

Player.prototype.getHp = function() { return this.stats.hp; };

Player.prototype.setHp = function(hp) {
    this.stats.hp = hp;
    if (this.stats.hp > this.stats.maxHp) this.stats.hp = this.stats.maxHp
};

Player.prototype.getAc = function() {
    return this.stats.getAc();
};



// class Monster
var Monster = function(name) {
    Character.call(this, name);
    this.setType("enemy");

    this.hp = 50;
    this.maxHp = 50;

    this.hitDiceAmount = 1;
    this.hitDiceSides = 3;
    this.hitBonus = 0;

    this.ac = 0;

    this.damageDiceAmount = 1;
    this.damageDiceSides = 3;

    this.damageBonus = 0;
};

Monster.prototype = Object.create(Character.prototype);
Monster.prototype.constructor = Monster;

Monster.prototype.parseData = function(data) {
    this.setName(data[0]);
    this.hitDiceAmount = data[1];
    this.hitDiceSides = data[2];
    this.hitBonus = data[3]
    this.maxHp = data[4];
    this.hp = this.maxHp;
    this.ac = data[5];
    this.damageDiceAmount = data[6];
    this.damageDiceSides = data[7];
    this.damageBonus = data[8];
    this.setImage(new createjs.Bitmap(data[9]))
};

Monster.prototype.updateAi = function() {
    if (this.map.getPlayer() === null || !this.map.getPlayer().isAlive()) return;

    // Check if player is adjacent
    var dir = this.getPlayerAdjacentDirection();

    if (dir) {
        this.move(dir);
    } else if (random.integer(100) < 34) {
        switch(random.integer(4)) {
            case 0: // N
                this.move(new Vector(0, -1));
                break;
            case 1: // S
                this.move(new Vector(0, 1));
                break;
            case 2: // E
                this.move(new Vector(1, 0));
                break;
            case 3: // W
                this.move(new Vector(-1, 0));
                break;
            default:
                break;
        }
    } else if (this.getPosition().subtract(this.map.getPlayer().getPosition()).magnitude() < random.integerRange(8, 16)) {
        var path = this.map.findPath(this.getPosition(), this.map.getPlayer().getPosition());

        if (path.length > 0) {
            dir = path[0].subtract(this.getPosition());
            this.move(dir)
        }
    }
};

Monster.prototype.move = function(dir) {
    if (!this.isAlive()) return;

    var from = this.getPosition();
    var to = from.add(dir);

    if (this.map && this.map.cellAt(to)) {
        if (this.map.cellAt(to).isBlocked()) {
            var other = this.map.cellAt(to).getEntity();

            if (other.getType() == "player") {
                if (random.die(this.hitDiceAmount, this.hitDiceSides) + this.hitBonus > other.getAc()) {
                    var damage = random.die(this.damageDiceAmount, this.damageDiceSides) + this.damageBonus;
                    if (!game.devMode) other.applyDamage(damage);

                    game.message(this + " dealt " + damage + " damage to you.");
                } else {
                        game.message(this + " missed trying to hit you.");
                }
            }
        } else {
            this.setPosition(to);
        }
    }
};

Monster.prototype.getPlayerAdjacentDirection = function() {
    var point = this.getPosition();
    var playerPoint = null;

    var cell = this.map.cellAt(point.add(new Vector(1, 0)));

    if (cell && cell.getEntity() && cell.getEntity().getType() == "player") {
        playerPoint = cell.getEntity().getPosition();
    }

    cell = this.map.cellAt(point.add(new Vector(0, 1)));

    if (cell && cell.getEntity() && cell.getEntity().getType() == "player") {
        playerPoint = cell.getEntity().getPosition();
    }

    cell = this.map.cellAt(point.add(new Vector(-1, 0)));

    if (cell && cell.getEntity() && cell.getEntity().getType() == "player") {
        playerPoint = cell.getEntity().getPosition();
    }

    cell = this.map.cellAt(point.add(new Vector(0, -1)));

    if (cell && cell.getEntity() && cell.getEntity().getType() == "player") {
        playerPoint = cell.getEntity().getPosition();
    }

    if (playerPoint) {
        return playerPoint.subtract(point);
    }

    return null;
};

Monster.prototype.getHp = function() { return this.hp; };

Monster.prototype.setHp = function(hp) {
    this.hp = hp;
    if (this.hp > this.maxHp) this.hp = this.maxHp
};

Monster.prototype.getAc = function() {
    return this.ac;
};

Monster.prototype.getEncounterLevel = function() {
    return this.hitDiceAmount;
};



// class Chest
// Item which the player can open.
var Chest = function() {
    Entity.call(this, "Chest");
    this.setType("chest");
    this.container = game.items;
};

Chest.prototype = Object.create(Entity.prototype);
Chest.prototype.constructor = Chest;

Chest.prototype.open = function() {
    var item = random.item(this.map.getPlayer().getStats().level);
    item.setImage(new createjs.Bitmap("img/collection/UNUSED/other/chest2_open.png"));
    var map = this.map;
    map.remove(this);
    this.setImage(null);
    item.setPosition(this.getPosition());
    map.add(item);
};

Chest.prototype.isBlockable = function() { return false; }



// class Door
var Door = function(keyType) {
    Entity.call(this, "Door");
    this.setType("door");
    this.keyType = keyType || null;
};

Door.prototype = Object.create(Entity.prototype);
Door.prototype.constructor = Door;

Door.prototype.getKeyType = function() { return this.keyType; };
Door.prototype.setKeyType = function(k) { this.keyType = k; };



// class Item
// An item which does not blocks other objects in the map.
var Item = function(name) {
    Entity.call(this, name);
    this.owner = null;
    this.stackSize = 1;
    this.setType("item");
    this.container = game.items;
    this.pickable = false;
    this.usable = false;
    this.equipable = false;
};

Item.prototype = Object.create(Entity.prototype);
Item.prototype.constructor = Item;

Item.prototype.getOwner = function() { return this.owner; }
Item.prototype.setOwner = function(owner) { this.owner = owner; }

Item.prototype.getStackSize = function() { return this.stackSize; }
Item.prototype.setStackSize = function(s) { this.stackSize = s; }

Item.prototype.isBlockable = function() { return false; }
Item.prototype.isPickable = function() { return this.pickable; }
Item.prototype.setPickable = function(p) { this.pickable = p; }

Item.prototype.isUsable = function() { return this.usable; }
Item.prototype.isEquipable = function() { return this.equipable; }



// class Equipment
// Equipment which the player can equip.
var Equipment = function(name) {
    Item.call(this, name);
    this.setType("equipment");
    this.onEquip = function(user) { console.log("Error: Equipment not implemented."); };
    this.onUnequip = function(user) { console.log("Error: Equipment not implemented."); };
    this.equiped = false;
    this.part = "";
    this.equipable = true;
    this.twoHanded = false;
};

Equipment.prototype = Object.create(Item.prototype);
Equipment.prototype.constructor = Equipment;

Equipment.prototype.getPart = function() { return this.part; };
Equipment.prototype.setPart = function(part) { this.part = part; };

Equipment.prototype.isTwoHanded = function() { return this.twoHanded; };
Equipment.prototype.setTwoHanded = function(b) { this.twoHanded = b; };

Equipment.prototype.isEquiped = function() { return this.equiped; };

Equipment.prototype.setOnEquip = function(onEquip) {
    this.onEquip = onEquip;
};

Equipment.prototype.setOnUnequip = function(onUnequip) {
    this.onUnequip = onUnequip;
};

Equipment.prototype.equip = function() {
    if (this.equiped) return;
    this.onEquip(this.owner);
    this.equiped = true;
};

Equipment.prototype.unequip = function() {
    if (!this.equiped) return;
    this.onUnequip(this.owner);
    this.equiped = false;
};

Equipment.prototype.toString = function() {
    return Entity.prototype.toString.call(this);
};



// class Consumable
// Consumable which the player can consume.
var Consumable = function(name) {
    Item.call(this, name);
    this.setType("consumable");
    this.onUse = function(user) { console.log("Error: Consumable not implemented."); };
    this.usable = true;
    this.consumed = false;
};

Consumable.prototype = Object.create(Item.prototype);
Consumable.prototype.constructor = Consumable;

Consumable.prototype.setOnUse = function(onUse) {
    this.onUse = onUse;
};

Consumable.prototype.use = function() {
    if (!this.consumed) {
        this.onUse(this.owner);
        this.consumed = true;
    }
};



// class Inventory
// Inventory for the player to hold items that can be picked up.
var Inventory = function(character) {
    this.items = [];
    this.maxItems = 10;
    this.character = character;

    this.armour = null;
    this.leftHand = null;
    this.rightHand = null;
};

Inventory.prototype.getItems = function() { return this.items; };

Inventory.prototype.getItem = function(index) { return this.items[index]; };

Inventory.prototype.addItem = function(item) {
    if (this.items.length < this.maxItems) {
        //this.item.onAdd();
        this.items.push(item);
        this.character.getMap().remove(item);
        item.hide();
        item.setOwner(this.character);
        return true;
    }

    return false;
};

Inventory.prototype.use = function(index) {
    var item = this.items[index];

    if (item && item.isUsable()) {
        item.use();
        this.items.splice(index, 1);
    } else if(item && item.isEquipable()) {
	   this.equip(index);
    } else {
        return false;
    }

    return true;
}

Inventory.prototype.equip = function(index) {
    var eq = this.items[index];

    if (eq === null) return false;

    switch(eq.getPart()) {
        case "right hand":
            if (this.rightHand) {
                if (!this.unequip("right hand")) return false;
            }

            if (eq.isTwoHanded()) {
                if (this.leftHand) {
                    if (!this.unequip("left hand")) return false;
                }
            }

            this.rightHand = eq;
            break;
        case "left hand":
            if (this.leftHand) {
                if (!this.unequip("left hand")) return false;
            }

            if (this.rightHand && this.rightHand.isTwoHanded()) {
                if (!this.unequip("right hand")) return false;
            }

            this.leftHand = eq;
            break;
        case "armour":
            if (this.armour) {
                if (!this.unequip(eq.getPart())) return false;
            }

            this.armour = eq;
            break;
        default:
            console.log("Error: Unable to equip " + eq + ".");
            return false;
            break;
    }

    eq.equip();
    this.items.splice(index, 1);

    return true;
}

Inventory.prototype.unequip = function(part) {
    if (this.isFull()) {
        game.message("Inventory is full. Unable to unequip.");
        return false;
    }

    var eq = null;

    switch(part) {
        case "right hand":
            eq = this.rightHand;
            this.rightHand = null;
            break;
        case "left hand":
            eq = this.leftHand;
            this.leftHand = null;
            break;
        case "armour":
            eq = this.armour;
            this.armour = null;
            break;
        default:
            console.log("Error: Unable to unequip " + part + ".");
            return false;
            break;
    }

    if (eq === null) {
        game.message("Nothing to unequip from " + part + ".");
        return false;
    }

    game.message("Unequiped " + eq + ".");
    eq.unequip();
    this.items.push(eq);

    return true;
}

Inventory.prototype.removeItem = function(index) {
    if (this.items.length <= index) return null;
    var removed = this.items.splice(index, 1);
    return removed[0];
};

Inventory.prototype.dropItem = function(index) {
    if (this.character.getMap().cellAt(this.character.getPosition()).getItem()) {
        game.message("Space occupied. Cannot drop item.");
        return false;
    }

    var item = this.removeItem(index);

    if (item === null) return false;

    item.setPosition(this.character.getPosition());
    item.show();
    this.character.getMap().add(item);
    item.setOwner(null);

    game.message("Dropped " + item + ".");

    return true;
};

Inventory.prototype.getMaxItems = function() { return this.maxItems; };
Inventory.prototype.setMaxItems = function(m) { this.maxItems = m; };

Inventory.prototype.getItemCount = function() { return this.items.length; };
Inventory.prototype.isFull = function() { return !(this.items.length < this.maxItems); };
