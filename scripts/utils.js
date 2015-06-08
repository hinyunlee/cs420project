// class Vector
var Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype.equals = function(v) {
    return (this.x == v.x && this.y == v.y);
};

Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.subtract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.multiply = function(v) {
    return new Vector(this.x * v.x, this.y * v.y);
};

Vector.prototype.negated = function() {
    return new Vector(-this.x, -this.y);
};

Vector.prototype.magnitude = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.compare = function(v) {
    return new (this.x == v.x && this.y == v.y);
};

Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
};

Vector.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
};



// class Rect
var Rect = function(min, max) {
    this.min = min;
    this.max = max;
};

Rect.prototype.intersects = function(rect) {
    return !(this.min.x > rect.max.x || this.min.y > rect.max.y || this.max.x < rect.min.x || this.max.y < rect.min.y);
};

Rect.prototype.translated = function(trans) {
    return new Rect(this.min.add(trans), this.max.add(trans));
};

Rect.prototype.expanded = function(s) {
    return new Rect(this.min.subtract(new Vector(s,s)), this.max.add(new Vector(s,s)));
};



// class PathNode
var PathNode = function(newParent, x,y, cost){
	this.parent = newParent;
	this.position= new Vector(x, y);
	this.pathCost = cost;
};



// class PriorityQueue
var PriorityQueue = function(){
	this.length = 0;
    this.queue = [];
	this.container = [];
};

PriorityQueue.prototype.clear = function () {
    this.length = 0;
    this.queue.length = 0;
	this.container.length = 0;
};

PriorityQueue.prototype.insert = function (value) {
    this.queue.push(value);
	this.container.push("" + value.position + "," + value.pathCost + "");
    this.length++;
    this.bubbleUp(this.length - 1);
};

PriorityQueue.prototype.peekHighestPriorityElement = function () {
    return this.queue[0];
};

PriorityQueue.prototype.popHighestPriorityElement = function () {
    if (length < 0) {
        throw("There are no more elements in your priority queue.");
    }
    var oldRoot = this.queue[0];
    var newRoot = this.queue.pop();
    this.length--;
    this.queue[0] = newRoot;
    this.sinkDown(0);
	var index = this.container.indexOf("" + this.queue[0].position + "," + this.queue[0].pathCost + "");
	if (index > -1) {
		this.container.splice(index, 1);
	}
    return oldRoot;
};

PriorityQueue.prototype.contains = function(value) {
	if( this.container.indexOf("" + value.position + "," + value.pathCost + "") === (-1))
		return false;
	return true;
};

PriorityQueue.prototype.bubbleUp = function (index) {
    if (index === 0) {
        return;
    }
    var parent = this.getParentOf(index);
    if (this.evaluate(index, parent)) {
        this.swap(index, parent);
        this.bubbleUp(parent);
    } else {
        return;
    }
};

PriorityQueue.prototype.sinkDown = function (index) {
    var left = this.getLeftOf(index),
		right = this.getRightOf(index);
	var min= this.minimum(left, right);
	if (min !==null){
		if (this.evaluate(min, index)) {
			this.swap(index, min);
			this.sinkDown(min);
		}
	}
	return;
};

PriorityQueue.prototype.rescoreElement= function(value) {
    this.sinkDown(this.queue.indexOf(value));
};

PriorityQueue.prototype.swap = function (self, target) {
    var placeHolder = this.queue[self];
    this.queue[self] = this.queue[target];
    this.queue[target] = placeHolder;
};

PriorityQueue.prototype.evaluate = function (self, target) {
    if (this.queue[target] === undefined || this.queue[self] === undefined) {
        return false;
    }
	return (this.queue[self].pathCost < this.queue[target].pathCost);
};

PriorityQueue.prototype.minimum = function (left, right) {
    if (this.queue[left] === undefined && this.queue[right] !== undefined){
		return right;
	}
	if(this.queue[left] !== undefined && this.queue[right] === undefined){
		return left;
	}
	else if(this.queue[left] !== undefined && this.queue[right] !== undefined){
		if(this.evaluate(left,right))
			return left;
		else
			return right;
	}
	return null;//there are no children
};

PriorityQueue.prototype.getParentOf = function (index) {
    return Math.floor((index-1) / 2);
};

PriorityQueue.prototype.getLeftOf = function (index) {
    return index * 2 + 1;
};

PriorityQueue.prototype.getRightOf = function (index) {
    return index * 2 + 2;
};
