// singleton Game
// The main game logic
var game = {
    map: null,
    player: null,
    state: "init",
    devMode: false,

    // Stage to render
    stage: null,

    // Stage containers
    background: new createjs.Container(),
    items: new createjs.Container(),
    foreground: new createjs.Container(),
    inventory: new createjs.Container(),
    characterSheet: new createjs.Container(),
    messages: new createjs.Container(),

    // Lower panel
    messagePanel: new createjs.Shape(new createjs.Graphics().beginFill("rgba(0, 32, 255, 255)").drawRect(0, 0, 640, 55)),
    messageText: new createjs.Text(),
    lastFiveMessages: [],
    informationPanel: new createjs.Shape(new createjs.Graphics().beginFill("rgba(0, 32, 255, 255)").drawRect(0, 0, 640, 55)),
    informationText: new createjs.Text(),
    helpString: "",

    init: function() {
        if (this.stage) this.reset();

        this.stage = this.stage || new createjs.Stage("mainScreen");
        this.player = new Player("Player");
        this.player.setCode("@");
        this.player.setImage(new createjs.Bitmap("img/viking.png"));

        this.map = random.map(1);
        this.stage.addChild(this.background);
        this.stage.addChild(this.items);
        this.stage.addChild(this.foreground);

        this.stage.addChild(this.messages);
        this.messageText.text = " ";

        this.messages.addChild(this.messagePanel);

        this.messageText.font = "10px Arial";
        this.messageText.color = "#ffffff";
        this.messageText.text = "";
        this.messages.addChild(this.messageText);

        this.messages.addChild(this.informationPanel);
        this.informationText.font = "10px Arial";
        this.informationText.color = "#ffffff";
        this.informationText.text = "";
        this.messages.addChild(this.informationText);

        this.update();

        this.state = "game";

        // Window event callback
        window.onkeydown = this.onKeyPressed;
        window.setInterval(this.tick, 1000);
    },

    reset: function() {
        this.background.removeAllChildren();
        this.items.removeAllChildren();
        this.foreground.removeAllChildren();
        this.inventory.removeAllChildren();
        this.characterSheet.removeAllChildren();
        this.messages.removeAllChildren();
    },

    tick: function() {
        game.stage.update();
    },

    update: function() {
        this.stage.regX = this.player.getPosition().x*32 - Math.floor(1280/2);
        this.stage.regY = this.player.getPosition().y*32 - Math.floor(720/2);

        if (this.state == "game") {
            this.map.getEnemies().forEach(function(each) {
                each.updateAi();
            });

            if (!this.player.isAlive()) {
                    this.state = "game_over";
                    game.message("You died. Press r to restart.");
            }
        }

        game.updateMessagePanel();
        game.updateInformationPanel();

        this.stage.update();

        //this.map.debugDraw();
    },

    updateMessagePanel: function() {
        game.messagePanel.x = this.player.getPosition().x*32;
        game.messagePanel.y = this.player.getPosition().y*32 + 306;

        game.messageText.text = "";

        for(var i = 0; i < game.lastFiveMessages.length; ++i){
            game.messageText.text += game.lastFiveMessages[i];
            game.messageText.text += '\n';
        }

        game.messageText.x = this.player.getPosition().x*32 + 5;
        game.messageText.y = this.player.getPosition().y*32+ 306;
    },

    updateInformationPanel: function() {
        game.updateHelpText();
        game.informationPanel.x = this.player.getPosition().x*32 - 640;
        game.informationPanel.y = this.player.getPosition().y*32 + 306;

        game.informationText.text = "Level: " + this.player.getStats().level + "\nHP: " + this.player.getHp() + "/" + this.player.getStats().maxHp + "\n";
        game.informationText.text += this.helpString;

        game.informationText.x = this.player.getPosition().x*32 - 635;
        game.informationText.y = this.player.getPosition().y*32+ 306;
    },

    message: function(msg) {
        game.lastFiveMessages.push(msg);

        if (game.lastFiveMessages.length > 5){
            this.lastFiveMessages.splice(0, 1);
        }
    },

    makeNextLevel: function() {
        this.background.removeAllChildren();
        this.items.removeAllChildren();
        this.foreground.removeAllChildren();
        this.map = random.map(this.map.getLevel() + 1);
        this.player.onMapChange();
        this.update();
    },

    showInventory: function(show) {
        var container = game.inventory;

        if (show) {
            this.stage.addChild(container);

            var panel = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0, 32, 255, 255)").drawRect(0, 0, 640, 480));//new createjs.Bitmap("img/panel.png");
            var panelPos = new Vector(640, 480);

            var inventoryList = new createjs.Text();
            inventoryList.font = "10px Arial";
            inventoryList.color = "#ffffff";
            inventoryList.text = "Inventory";

            var playerItems = new createjs.Text();
            playerItems.font = "10px Arial";
            playerItems.color = "#ffffff";
            playerItems.text = "[Items]\n";

            // inventory list
            for (var i = 0; i < this.player.getInventory().items.length; i++) {
                var key = i + 1;
                if (key == 10) key = 0;
                playerItems.text += "(" + key.toString() + ") " + this.player.getInventory().items[i].toString();
                if (i < this.player.getInventory().items.length - 1) playerItems.text += "\n"
            }

            var inventory = this.player.getInventory();

            // player items
            playerItems.text += "\n\n[Equipped]\nArmour: ";

            if (inventory.armour){
                playerItems.text += inventory.armour.toString();
            }

            playerItems.text += "\nLeft Hand: ";

            if(inventory.leftHand != null){
                playerItems.text += inventory.leftHand.toString();
            }

            playerItems.text += "\nRight Hand: ";

            if(inventory.rightHand != null){
                playerItems.text += inventory.rightHand.toString();
            }

            // Overlay the inventory screen

            // add panel
            panel.x = this.map.getPlayer().getPosition().x*32 - panelPos.x/2;
            panel.y = this.map.getPlayer().getPosition().y*32 - panelPos.y/2;
            container.addChild(panel);

            // add texts
            var textBounds = inventoryList.getBounds();

            inventoryList.x = panel.x + textBounds.width/2;
            inventoryList.y = panel.y + textBounds.height/2;
            container.addChild(inventoryList);

            playerItems.x = panel.x + textBounds.width/2;
            playerItems.y = panel.y + textBounds.height/2 + 32;
            container.addChild(playerItems);

            this.stage.update();
        } else {
            // remove the inventory list screen
            this.inventory.removeAllChildren();
            this.stage.update();
        }
    },

    showCharacterSheet: function(show) {
        var container = game.characterSheet;

        if (show) {
            this.stage.addChild(container);

            var panel = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0, 32, 255, 255)").drawRect(0, 0, 640, 480));
            //new createjs.Bitmap("img/panel.png");
            var panelPos = new Vector(640, 480);

            var t = new createjs.Text();
            t.font = "10px Arial";
            t.color = "#ffffff";
            t.text = "[Character]\n\n";
            t.text += this.player.getStats().toString();

            // add panel
            panel.x = this.map.getPlayer().getPosition().x*32 - panelPos.x/2;
            panel.y = this.map.getPlayer().getPosition().y*32 - panelPos.y/2;
            container.addChild(panel);

            // add text
            var textBounds = t.getBounds();

            t.x = panel.x + textBounds.width/2;
            t.y = panel.y + textBounds.height/2;
            container.addChild(t);

            this.stage.update();
        } else {
            // remove the character screen
            this.characterSheet.removeAllChildren();
            this.stage.update();
        }
    },

    onKeyPressed: function(e) {
        var code = e.keyCode;

        if (game.state == "game") {
            if (code == 65) { // a: left
                game.player.move(new Vector(-1, 0));
            } else if (code == 87) { // w: up
                game.player.move(new Vector(0, -1));
            } else if (code == 68) { // d: right
                game.player.move(new Vector(1, 0));
            } else if (code == 83) { // s: down
                game.player.move(new Vector(0, 1));
            } else if (code == 69) { // e: interact
                game.player.interact();
            } else if (code == 73) { // i: inventory
                game.showInventory(true);
                game.state = "inventory";
            } else if (code == 67) { // c: character sheet
                game.state = "character_sheet";
                game.showCharacterSheet(true);
            } else if (code == 90) { // z: dev mode
                game.devMode = !game.devMode;
                return;
            } else {
                return;
            }
        } else if (game.state == "inventory") {
            if (code >= 49 && code <= 57) { // 1 to 9
                game.player.getInventory().use(code - 49);
            } else if (code == 48) { // 0
                game.player.getInventory().use(9);
            } else if (code == 76) { // l: left hand
                game.player.getInventory().unequip("left hand");
            } else if (code == 65) { // a: armour
                game.player.getInventory().unequip("armour");
            } else if (code == 82) { // r: right hand
                game.player.getInventory().unequip("right hand");
            } else if (code == 68) { // d: drop
                game.state = "inventory_drop";
            } else if (code == 67) { // c: character sheet
                game.state = "character_sheet";
                game.showCharacterSheet(true);
                game.showInventory(false);
            } else if (code == 73) { // i: inventory
                game.showInventory(false);
                game.state = "game";
                return;
            } else {
                return;
            }

            if (game.state == "inventory") {
                game.showInventory(false);
                if (game.player.isAlive()) game.showInventory(true);
                else game.state = "game_over";
            }
        } else if (game.state == "inventory_drop") {
            if (code >= 49 && code <= 57) { // 1 to 9
                game.player.getInventory().dropItem(code - 49);
                game.state = "inventory";
            } else if (code == 48) { // 0
                game.player.getInventory().dropItem(9);
                game.state = "inventory";
            } else if (code == 68) { // d: drop
                game.state = "inventory";
            } else if (code == 67) { // c: character sheet
                game.state = "character_sheet";
                game.showInventory(false);
                game.showCharacterSheet(true);
            } else if (code == 73) { // i: inventory
                game.showInventory(false);
                game.state = "game";
                return;
            } else {
                return;
            }

            if (game.state == "inventory") {
                game.showInventory(false);
                game.showInventory(true);
            }
        } else if (game.state == "character_sheet") {
            if (code == 67) { //c: character sheet
                game.showCharacterSheet(false);
                game.state = "game";
                return;
            } else if (code == 73) { // i: inventory
                game.showCharacterSheet(false);
                game.showInventory(true);
                game.state = "inventory";
            }
        } else if (game.state == "game_over") {
            if (code == 82) { //r: reset
                game.stage.removeAllChildren();
                game.init();
            }
        }

        game.update();
    },

    updateHelpText: function() {
        if (game.state == "game" || game.state == "init") {
            this.helpString = "Commands: w, a, s, d keys to move up, left, down, right. e key to interact.\ni key to open inventory. c key to open character sheet.";
        } else if (game.state == "inventory") {
            this.helpString = "Commands: Select item to use or equip (1 ~ 0 keys).\n r, l, a keys to unequip right hand, left hand and armor.";
        } else if (game.state == "inventory_drop") {
            this.helpString = "Commands: Select item to drop (1 ~ 0 keys).";
        } else if (game.state == "character_sheet") {
            this.helpString = "Commands:i key to open inventory.";
        } else if (game.state == "game_over") {
            this.helpString = "Commands:r key to restart.";
        }
    }
};
