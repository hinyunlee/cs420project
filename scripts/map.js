// class Cell
var Cell = function(code, walkable) {
    this.walkable = walkable || false;
    this.entity = null;
    this.item = null;
    this.map = null;
    this.code = " "
    this.image = null;
};

Cell.prototype.isWalkable = function() { return this.walkable; };
Cell.prototype.setWalkable = function(flag) { this.walkable = flag; };

Cell.prototype.getCode = function() { return this.code; };
Cell.prototype.setCode = function(code) { this.code = code; };

Cell.prototype.getItem = function() { return this.item; };
Cell.prototype.setItem = function(item) { this.item = item; };

Cell.prototype.getEntity = function() { return this.entity; };
Cell.prototype.setEntity = function(e) { this.entity = e; };

Cell.prototype.getImage = function() { return this.image; };
Cell.prototype.setImage = function(image) { this.image = image; };

Cell.prototype.isBlocked = function() { return this.walkable && (this.entity !== null); };



// class Map
var Map = function(sizeX, sizeY) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.grid = new Array(sizeX * sizeY);
    this.pathfindGrid = new Array(sizeY);
    this.level = 1;
    this.player = null;
    this.enemies = [];

    for (var i = 0; i < sizeX*sizeY; ++i) {
        this.grid[i] = new Cell(" ", false);
    }

    for (var i = 0; i < sizeY; ++i) {
        this.pathfindGrid[i] = new Array(sizeX);

        for (var j = 0; j < sizeX; ++j) {
            this.pathfindGrid[i][j] = 0;
        }
    }
};

Map.prototype.getLevel = function() { return this.level; };
Map.prototype.setLevel = function(l) { this.level = l; };

Map.prototype.getPlayer = function() { return this.player; };
Map.prototype.setPlayer = function(p) { this.player = p; };

Map.prototype.getEnemies = function() { return this.enemies; };
Map.prototype.setEnemies = function(e) { this.enemies = e; };

Map.prototype.cellAt = function(pos) {
    if (pos.x < 0 || pos.y < 0 || pos.x >= this.sizeX || pos.y >= this.sizeY) return null;
    return this.grid[this.sizeX * pos.y + pos.x];
};

Map.prototype.add = function(obj) {
    var cell = this.cellAt(obj.getPosition());
    obj.setMap(this);

    if (obj.getType() == "player") this.player = obj;
    else if (obj.getType() == "enemy") this.enemies.push(obj);


    if (obj.isBlockable()) {
        if (cell.entity) return;
        cell.entity = obj;
        this.pathfindGrid[obj.getPosition().y][obj.getPosition().x] = 0;
    } else {
        if (cell.item) return;
        cell.item = obj;
    }
};

Map.prototype.remove = function(obj) {
    if (obj.isBlockable()) {
        this.cellAt(obj.getPosition()).entity = null;
        this.pathfindGrid[obj.getPosition().y][obj.getPosition().x] = 1;
    } else {
        this.cellAt(obj.getPosition()).item = null;
    }

    obj.setMap(null);

    if (obj.getType() == "player") this.player = null;
    else if (obj.getType() == "enemy") {
        var i = this.enemies.indexOf(obj);

        if (i > -1) this.enemies.splice(i, 1);
    }
}

Map.prototype.getFloors = function() {
    var floors = [];
    var length = this.sizeX*this.sizeY;

    for (var i = 0; i < length; ++i) {
        var point = new Vector(i % this.sizeX, Math.floor(i / this.sizeX));
        if (this.isFloor(point)) {
            floors.push(point);
        }
    }

    return floors;
};

Map.prototype.getWalls = function(checkEdge) {
    var walls = [];
    var length = this.sizeX*this.sizeY;

    for (var i = 0; i < length; ++i) {
        var point = new Vector(i % this.sizeX, Math.floor(i / this.sizeX));

        if (this.isWall(point, checkEdge)) {
            walls.push(point);
        }
    }

    return walls;
};

Map.prototype.update = function() {
    game.background.removeAllChildren();
    this.updateFloors();
    this.updateWalls();
};

Map.prototype.updateFloors = function() {
    var floors = this.getFloors();
    var map = this;
    var container = game.background;

    floors.forEach(function(each) {
        var floor = new createjs.Bitmap("img/floor.png");
        floor.x = each.x*32;
        floor.y = each.y*32;
        container.addChild(floor);
    });
};

Map.prototype.updateWalls = function() {
    var walls = this.getWalls(true);
    var map = this;
    var container = game.background;

    walls.forEach(function(each) {
        var wall = new createjs.Bitmap("img/collection/dc-dngn/wall/brick_brown0.png");
        wall.x = each.x*32;
        wall.y = each.y*32;
        map.cellAt(each).setCode("#");
        container.addChild(wall);
    });
};

Map.prototype.onMove = function(obj, from, to) {
    var fromSquare = this.cellAt(from);
    var toSquare = this.cellAt(to);

    if (toSquare == null) return false;
    if (toSquare.isBlocked() || !toSquare.isWalkable()) return false;

    if (obj.isBlockable()) {
        if (fromSquare) {
            fromSquare.entity = null;
            this.pathfindGrid[from.y][from.x] = 1;
        }

        toSquare.entity = obj;
        this.pathfindGrid[to.y][to.x] = 0;
    } else {
        if (fromSquare) fromSquare.item = null;
        toSquare.item = obj;
    }

    return true;
};

Map.prototype.debugDraw = function() {
    var str = "";

    for (var i = 0; i < this.sizeX * this.sizeY; ++i) {
        if (i % this.sizeY == 0 && i !== 0) str += "\n";
        if (this.grid[i].entity !== null) {
            str += this.grid[i].entity.code;
        } else {
            str += this.grid[i].code;
        }
    }

    document.getElementById("screen").innerHTML = str;

    str = "";

    this.pathfindGrid.forEach(function(each) {
        each.forEach(function(each2) {
            str += each2;
        });
        str += "\n";
    });

    document.getElementById("screen").innerHTML = str;
};

Map.prototype.regionWalkable = function(rect) {
    for (var i = rect.min.x; i <= rect.max.x; ++i) {
        for (var j = rect.min.y; j <= rect.max.y; ++j) {
            var cell = this.cellAt(new Vector(i, j));

            if (cell) {
                if (!cell.isWalkable()) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    return true;
}

Map.prototype.regionUnwalkable = function(rect) {
    for (var i = rect.min.x; i <= rect.max.x; ++i) {
        for (var j = rect.min.y; j <= rect.max.y; ++j) {
            var cell = this.cellAt(new Vector(i, j));

            if (cell) {
                if (cell.isWalkable()) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    return true;
}

Map.prototype.do = function(f) {
    for (var i = 0; i < this.sizeX; ++i) {
        for (var j = 0; j < this.sizeY; ++j) {
            f(new Vector(i, j));
        }
    }
}

Map.prototype.regionDo = function(rect, f) {
    for (var i = rect.min.x; i <= rect.max.x; ++i) {
        for (var j = rect.min.y; j <= rect.max.y; ++j) {
            var cell = this.cellAt(new Vector(i, j));

            if (cell) {
                f(new Vector(i, j));
            }
        }
    }
}

Map.prototype.isWall = function(point, checkEdge) {
    if (this.cellAt(point) && !this.cellAt(point).isWalkable()) {
        var cell = this.cellAt(point.add(new Vector(1, 0)));
        if (cell && cell.isWalkable()) return true;
        cell = this.cellAt(point.add(new Vector(0, 1)));
        if (cell && cell.isWalkable()) return true;
        cell = this.cellAt(point.add(new Vector(-1, 0)));
        if (cell && cell.isWalkable()) return true;
        cell = this.cellAt(point.add(new Vector(0, -1)));
        if (cell && cell.isWalkable()) return true;

        if (checkEdge) {
            cell = this.cellAt(point.add(new Vector(1, 1)));
            if (cell && cell.isWalkable()) return true;
            cell = this.cellAt(point.add(new Vector(-1, -1)));
            if (cell && cell.isWalkable()) return true;
            cell = this.cellAt(point.add(new Vector(-1, 1)));
            if (cell && cell.isWalkable()) return true;
            cell = this.cellAt(point.add(new Vector(1, -1)));
            if (cell && cell.isWalkable()) return true;
        }
    }

    return false;
}

Map.prototype.isFloor = function(point) {
    return (this.cellAt(point) && this.cellAt(point).isWalkable());
};

Map.prototype.dig = function(vec) {
    this.cellAt(vec).setCode(".");
    this.cellAt(vec).setWalkable(true);
    this.pathfindGrid[vec.y][vec.x] = 1;
};

Map.prototype.digRegion = function(rect) {
    for (var i = rect.min.x; i <= rect.max.x; ++i) {
        for (var j = rect.min.y; j <= rect.max.y; ++j) {
            this.cellAt(new Vector(i, j)).setCode(".");
            this.cellAt(new Vector(i, j)).setWalkable(true);
            this.pathfindGrid[j][i] = 1;
        }
    }
};


Map.prototype.neighbors = function(position){
	var neighbors = [];
	var upPos = position.add(new Vector(0, -1));
	var downPos = position.add(new Vector(0, 1));
	var leftPos = position.add(new Vector(-1, 0));
	var rightPos = position.add(new Vector(1, 0));

	var up = this.cellAt(upPos);
	var down = this.cellAt(downPos);
	var left = this.cellAt(leftPos);
	var right = this.cellAt(rightPos);

	if (up && this.pathfindGrid[upPos.y][upPos.x] == 1)
		neighbors.push(upPos)
	if (down && this.pathfindGrid[downPos.y][downPos.x] == 1)
		neighbors.push(downPos)
	if (left && this.pathfindGrid[leftPos.y][leftPos.x] == 1)
		neighbors.push(leftPos)
	if (right && this.pathfindGrid[rightPos.y][rightPos.x] == 1)
		neighbors.push(rightPos)

	return neighbors;
};

Map.prototype.aStar = function(startPos, goalPos){
	var heapQueue = new PriorityQueue();
	var closedSet = new Set ([]);
	var start = new PathNode(null, startPos.x, startPos.y, 0);
	var goal =  new PathNode(start, goalPos.x, goalPos.y, 0);

	start.pathCost = this.cost(start.position, goal.position);
	heapQueue.insert(start);
	do{
		current = heapQueue.popHighestPriorityElement();
		if (current.position.x == goal.position.x && current.position.y == goal.position.y){
			return this.reconstructPath(start, current);
		}
		if (!closedSet.has(current.position.toString())){
			closedSet.add(current.position.toString());
		}
		var neighborCells = this.neighbors(current.position);
		if (neighborCells.lenght <0)
			return [];
		for (var i=0;i < neighborCells.length; i++)
		{
			var tentative_cost = this.cost(start.position, current.position) + this.cost(current.position,neighborCells[i])
			if(!closedSet.has(neighborCells[i].toString()) || tentative_cost < this.cost(start.position, neighborCells[i]))
			{
				var neighborNode = new PathNode(current, neighborCells[i].x, neighborCells[i].y, tentative_cost + this.cost(neighborCells[i], goal.position));
				if(!heapQueue.contains(neighborNode) && !closedSet.has(neighborCells[i].toString())){
					heapQueue.insert(neighborNode);
				}
				else{
					heapQueue.rescoreElement(neighborNode);
				}
			}
		}
	}while(heapQueue.length > 0);
	return [];
};

Map.prototype.reconstructPath= function(start, current){
	var totalPath = [];
	totalPath.push(current.position);
	while(current !== start){
		current = current.parent;
		totalPath.push(current.position);
	}
	return totalPath.reverse();
};

Map.prototype.cost = function(start_position, end_position) {
    return Math.abs(end_position.x - start_position.x) + Math.abs(end_position.y - start_position.y);
};

Map.prototype.findPath = function(from, to) {
    var foundPath = [];

	var lastFrom = this.pathfindGrid[from.y][from.x];
    var lastTo = this.pathfindGrid[to.y][to.x];

    this.pathfindGrid[from.y][from.x] = 1;
    this.pathfindGrid[to.y][to.x] = 1;

	foundPath = this.aStar(from, to);

    this.pathfindGrid[from.y][from.x] = lastFrom;
    this.pathfindGrid[to.y][to.x] = lastTo;

	foundPath.splice(0,1);
	return foundPath;
};

