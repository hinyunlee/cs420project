QUnit.test( "Die - roll once - 2 faces", function( assert ) {
	var total = random.die(1,2);
	assert.ok( total >= 1, total.toString() + " >= 0");
	assert.ok( total <= 2, total.toString() + " <= 3");
});

QUnit.test( "Die - roll once - 100 faces", function( assert ) {
	var total = random.die(1,100);
	assert.ok( total >=  1, total.toString() + " >= 0");
	assert.ok( total <= 100, total.toString() + " <= 100");
});

QUnit.test( "Die - roll twice - 2 faces", function( assert ) {
	var total = random.die(2,2);
	assert.ok( total >=  2, total.toString() + " >= 0");
	assert.ok( total <=  4, total.toString() + " <= 5");
});

QUnit.test( "Die - roll 100 times - 2 faces", function( assert ) {
	var total = random.die(100,2);
	assert.ok( total >=  100, total.toString() + " >= 0");
	assert.ok( total <= 200, total.toString() + " <= 201");
});

QUnit.test( "Die - random times - random faces (1-100)", function( assert ) {
	var roll = Math.floor(Math.random() * 100) + 1;
	var face = Math.floor(Math.random() * 100) + 1;
	var maxTotal = (roll * face);
	var minTotal = roll;
	var total = random.die(roll,face);
	assert.ok( total >= minTotal, total.toString() + " >= " + minTotal.toString());
	assert.ok( total <= maxTotal, total.toString() + " <= " + maxTotal.toString());
});
  
QUnit.test( "Dig a cell on a Map", function( assert ) {
	var map = new Map(6,29);
	var pos = new Vector(1,21);
	map.dig(pos);
	assert.ok( map.cellAt(pos).isWalkable() == true, "Passed!");
});

QUnit.test( "Dig a random cell on a random size Map", function( assert ) {
	function random (min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	var mapX = random(1,100);
	var mapY = random(1,100);
	
	var cellX = random(0,mapX-1);
	var cellY = random(0,mapY-1);
	
	var map = new Map(mapX,mapY);
	var pos = new Vector(cellX,cellY);
	console.log("Size: " + mapX + ", " + mapY);
	console.log(pos);
	
	map.dig(pos);
	assert.ok( map.cellAt(pos).isWalkable() == true, "Passed!");
	
});

QUnit.test( "Dig region on a Map", function( assert ) {
	var map = new Map(10,10);
	var region = new Rect(new Vector(1,1), new Vector(2,2));
	map.digRegion(region);
	for (var i = 1; i<3; i++){
		for (var j = 1; j<3; j++){
		assert.ok( map.cellAt(new Vector(i,j)).isWalkable() == true, "Passed!");
		}
	}
});

QUnit.test( "Dig random size region on a random size Map", function( assert ) {  
	function random (min,max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	var mapX = random(1,100);
	var mapY = random(1,100);
	
	var regionX1 = random(0,Math.round(mapX/2));
	var regionY1 = random(0,Math.round(mapY/2));
	var regionX2 = random(Math.round(mapX/2),mapX-1);
	var regionY2 = random(Math.round(mapY/2),mapY-1);
  
	var map = new Map(mapX,mapY);
	var region = new Rect(new Vector(regionX1,regionY1), new Vector(regionX2,regionY2));
  
	map.digRegion(region);
  
	for (var i = regionX1; i<= regionX2; i++){
		for (var j = regionY1; j<= regionY2; j++){
		assert.ok( map.cellAt(new Vector(i,j)).isWalkable() == true, "Passed!");
		}
	}
});

QUnit.test( "A* can find the path from random start to random goal", function() {

	var map = new Map(100,100);
	var region = new Rect(new Vector(1,1), new Vector(99,99));
	map.digRegion(region);
	var finalPath= [];	
	
	for (var i=0; i<100; i++){	
	var from = random.integerVectorRange(1,99);
	var to = random.integerVectorRange(1,99);

	equal(from.toString(), "(" + from.x + ", " + from.y + ")", "start= " + "(" + from.x + ", " + from.y + ")"),
	equal(to.toString(), "(" + to.x + ", " + to.y + ")", "goal= " + "(" + to.x + ", " + to.y + ")"),
	finalPath = map.aStar(from,to);

	equal(finalPath[finalPath.length -1].toString(), to.toString());	
	equal(finalPath[0].toString(), from.toString());	
	}
});