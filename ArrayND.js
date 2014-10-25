
//Multi-dimensional arrays for JavaScript
//Written by Brendan Whitfield


/*
 * ArrayND Constructor
 * 
 * new ArrayND(<ArrayND>);
 * new ArrayND(<x>, <y>, <z>, <w>, etc..);
 */
var ArrayND = function() {
	"use strict";

	var that = this;

	this.default_value = 0;


	function build(root, d, current)
	{
		if(d === root.size.length - 1)
		{
			for(var i = 0; i < root.size[d]; i++)
			{
				current[i] = root.default_value;
			}
		}
		else if(d < root.size.length)
		{
			for(var i = 0; i < root.size[d]; i++)
			{
				current[i] = []; //create the next level
				build(root, d+1, current[i]) //fill the next level
			}
		}
	}

	if(arguments.length === 1 && arguments[0] instanceof ArrayND)
	{
		//copy constructor

	}
	else
	{
		//normal n-dimensional constructor
		this.size = Array.slice(arguments);
		build(this, 0, this);
	}


};


ArrayND.prototype.forEach = function(callback) {
	"use strict";

	var that = this;
	var coordinates = Array.slice(this.size);

	function iterate(d, current)
	{
		if(d === that.size.length - 1)
		{
			for(var i = 0; i < that.size[d]; i++)
			{
				coordinates[d] = i;
				callback(current[i], coordinates, that);
			}
		}
		else if(d < that.size.length)
		{
			for(var i = 0; i < that.size[d]; i++)
			{
				coordinates[d] = i;
				iterate(d+1, current[i]) //fill the next level
			}
		}
	}

	iterate(0, this);
};





/*
 * Internal functions
 */

ArrayND.prototype.__assert__totalArgs = function(sourceName, nums, args) {
	for(var i = 0; i < nums.length; i++)
	{
		if(nums[i] === args.length) { return; }
	}
	throw "ArrayND Error [" + sourceName + "]: wrong number of arguments";
};

ArrayND.prototype.__assert__areNumbers = function(sourceName) {
	for(var i = 1; i < arguments.length; i++)
	{
		if(isNaN(arguments[i]))
		{
			throw "ArrayND Error [" + sourceName + "]: argument not a number";
		}
	}
};

ArrayND.prototype.__assert__isFunction = function(sourceName, callback) {
	if((callback === undefined) || !(callback instanceof Function))
	{
		throw "ArrayND Error [" + sourceName + "]: callback is not a function";
	}
};

ArrayND.prototype.__assert__inBounds = function(sourceName, x, y, w, h) {
	switch(arguments.length)
	{
		case 3:
			if(!this.inBounds(x, y))
			{
				throw "ArrayND Error [" + sourceName + "]: array index (" + x + ", " + y + ") out of bounds";
			}
			break;
		case 5:
			if(!this.inBounds(x, y, w, h))
			{
				throw "ArrayND Error [" + sourceName + "]: rectangular area (" + x + ", " + y + ", " + w + ", " + h + ") out of bounds";
			}
			break;
	}
};

ArrayND.prototype.__assert__validDimensions = function(sourceName, x, y) {
	if((x <= 0) || (y <= 0))
	{
		throw "ArrayND Error [" + sourceName + "]: can't create array with dimensions (" + x + ", " + y + ")";
	}
};

ArrayND.prototype.__assert__typeOf = function(sourceName, obj, type) {
	if(!(obj instanceof type))
	{
		throw "ArrayND Error [" + sourceName + "]: parameter must be of type [" + type.name + "]";
	}
};




/*
 * API functions
 */

/*
 * Iterators
 */

ArrayND.prototype.forArea = function(x, y, w, h, callback) {
	this.__assert__totalArgs("forArea", [5], arguments);
	this.__assert__areNumbers("forArea", x, y, w, h);
	this.__assert__isFunction("forArea", callback);
	this.__assert__inBounds("forArea", x, y, w, h);

	for(var cx = x; cx < x+w; cx++)
	{
		for(var cy = y; cy < y+h; cy++)
		{
			callback(this[cx][cy], cx, cy, this);
		}
	}
};

ArrayND.prototype.forRow = function(y, callback) {
	this.__assert__totalArgs("forRow", [2], arguments);
	this.__assert__areNumbers("forRow", y);
	this.__assert__isFunction("forRow", callback);
	this.__assert__inBounds("forRow", 0, y);

	for(var x = 0; x < this.x; x++)
	{
		callback(this[x][y], x, y, this);
	}
};

ArrayND.prototype.forCol = function(x, callback) {
	this.__assert__totalArgs("forCol", [2], arguments);
	this.__assert__areNumbers("forCol", x);
	this.__assert__isFunction("forCol", callback);
	this.__assert__inBounds("forCol", x, 0);

	for(var y = 0; y < this.y; y++)
	{
		callback(this[x][y], x, y, this);
	}
};



/*
 * Fill statements
 */

//fill()
//fill(value)
ArrayND.prototype.fill = function(value) {
	value = value === undefined ? this.default_value : value;

	this.forEach(function(v, x, y) {
		this[x][y] = value;
	});

	return this;
};

ArrayND.prototype.fillArea = function(x, y, w, h, value) {
	this.__assert__totalArgs("fillArea", [4, 5], arguments);
	this.__assert__areNumbers("fillArea", x, y, w, h);

	value = value === undefined ? this.default_value : value;

	for(var cx = x; cx < x+w; cx++)
	{
		for(var cy = y; cy < y+h; cy++)
		{
			this[cx][cy] = value;
		}
	}

	return this;
};

//fillRow(y)
//fillRow(y, value)
ArrayND.prototype.fillRow = function(y, value) {
	this.__assert__totalArgs("fillRow", [1, 2], arguments);
	this.__assert__areNumbers("fillRow", y);
	this.__assert__inBounds("fillRow", 0, y);

	value = value === undefined ? this.default_value : value;

	for(var x = 0; x < this.x; x++)
	{
		this[x][y] = value;
	}

	return this;
};

//fillCol(y)
//fillCol(y, value)
ArrayND.prototype.fillCol = function(x, value) {
	this.__assert__totalArgs("fillCol", [1, 2], arguments);
	this.__assert__areNumbers("fillCol", x);
	this.__assert__inBounds("fillCol", x, 0);

	value = value === undefined ? this.default_value : value;

	for(var y = 0; y < this.y; y++)
	{
		this[x][y] = value;
	}

	return this;
};



/*
 * Row & Column operations
 */

ArrayND.prototype.getRow = function(y) {
	this.__assert__totalArgs("getRow", [1], arguments);
	this.__assert__areNumbers("getRow", y);
	this.__assert__inBounds("getRow", 0, y);

	var array = [];
	for(var x = 0; x < this.x; x++)
	{
		array[x] = this[x][y];
	}

	return array;
};

ArrayND.prototype.getCol = function(x) {
	this.__assert__totalArgs("getCol", [1], arguments);
	this.__assert__areNumbers("getCol", x);
	this.__assert__inBounds("getCol", x, 0);

	var array = [];
	for(var y = 0; y < this.y; y++)
	{
		array[y] = this[x][y];
	}
	
	return array;
};

ArrayND.prototype.setRow = function(y, array) {
	this.__assert__totalArgs("setRow", [2], arguments);
	this.__assert__areNumbers("setRow", y);
	this.__assert__inBounds("setRow", 0, y);
	this.__assert__typeOf("setRow", array, Array);

	for(var x = 0; (x < this.x) && (x < array.length); x++)
	{
		this[x][y] = array[x];
	}

	return this;
};

ArrayND.prototype.setCol = function(x, array) {
	this.__assert__totalArgs("setCol", [2], arguments);
	this.__assert__areNumbers("setCol", x);
	this.__assert__inBounds("setCol", x, 0);
	this.__assert__typeOf("setCol", array, Array);

	for(var y = 0; (y < this.y) && (y < array.length); y++)
	{
		this[x][y] = array[y];
	}

	return this;
};

ArrayND.prototype.swapRow = function(y1, y2) {
	this.__assert__totalArgs("swapRow", [2], arguments);
	this.__assert__areNumbers("swapRow", y1, y2);
	this.__assert__inBounds("swapRow", y1, 0);
	this.__assert__inBounds("swapRow", y2, 0);

	if(y1 != y2)
	{
		for(var x = 0; x < this.x; x++)
		{
			var temp = this[x][y1];
			this[x][y1] = this[x][y2];
			this[x][y2] = temp;
		}
	}

	return this;
};

ArrayND.prototype.swapCol = function(x1, x2) {
	this.__assert__totalArgs("swapCol", [2], arguments);
	this.__assert__areNumbers("swapCol", x1, x2);
	this.__assert__inBounds("swapCol", x1, 0);
	this.__assert__inBounds("swapCol", x2, 0);

	if(x1 != x2)
	{
		for(var y = 0; y < this.y; y++)
		{
			var temp = this[x1][y];
			this[x1][y] = this[x2][y];
			this[x2][y] = temp;
		}
	}

	return this;
};

ArrayND.prototype.spliceRow = function(array, y) {
	this.__assert__totalArgs("spliceRow", [2], arguments);
	this.__assert__areNumbers("spliceRow", y);
	this.__assert__typeOf("spliceRow", array, Array);
	return this;
};

ArrayND.prototype.spliceCol = function(array, x) {
	this.__assert__totalArgs("spliceCol", [2], arguments);
	this.__assert__areNumbers("spliceCol", x);
	this.__assert__typeOf("spliceCol", array, Array);
	return this;
};



/*
 * 2D Transformations
 */

//resize(_x)
//resize(_x, _y)
//resize(_x, _y, x_)
//resize(_x, _y, x_, y_)
ArrayND.prototype.resize = function(_x, _y, x_, y_) {
	this.__assert__totalArgs("resize", [1,2,3,4], arguments);

	_x = (_x === undefined) || (isNaN(_x)) ? 0 : _x;
	_y = (_y === undefined) || (isNaN(_y)) ? 0 : _y;
	x_ = (x_ === undefined) || (isNaN(x_)) ? 0 : x_;
	y_ = (y_ === undefined) || (isNaN(y_)) ? 0 : y_;

	//compute new dimensions
	var nx = this.x + _x + x_;
	var ny = this.y + _y + y_;

	this.__assert__validDimensions("resize", nx, ny);

	//save a copy of this array, and rebuild for new dimensions
	var existingData = new ArrayND(this);
	this.__build__(nx, ny, this.default_value);
	var _this = this; //because of callback function below

	existingData.forEach(function(v, x, y) {
		//destination coordinates
		var dx = x + x_;
		var dy = y + y_;
		if(_this.inBounds(dx, dy))
		{
			_this[dx][dy] = existingData[x][y];
		}
	});

	return this;
};

ArrayND.prototype.crop = function(x, y, w, h) {
	this.__assert__totalArgs("crop", [4], arguments);
	this.__assert__areNumbers("crop", x, y, w, h);
	this.__assert__inBounds("crop", x, y, w, h);
	this.__assert__validDimensions("crop", w, h);

	this.resize((x+w)-this.x, (y+h)-this.y, -x, -y);

	return this;
};

//shift(x, y)
//shift(x, y, wrap)
ArrayND.prototype.shift = function(x, y, wrap) {
	this.__assert__totalArgs("shift", [2,3], arguments);
	this.__assert__areNumbers("shift", x, y);

	wrap = (wrap === undefined) || (typeof wrap !== "boolean") ? true : wrap;

	if((x !== 0) && (y !== 0))
	{
		this.resize(-x, -y, x, y);
	}

	return this;
};

//rotate()
//rotate(clockwise)
ArrayND.prototype.rotate = function(clockwise) {
	this.__assert__totalArgs("rotate", [0,1], arguments);

	clockwise = (clockwise === undefined) || (typeof clockwise !== "boolean") ? true : clockwise;

	//save a copy of this array, and rebuild for new dimensions
	var existingData = new ArrayND(this);
	this.__build__(this.y, this.x, this.default_value);

	return this;
};

ArrayND.prototype.invertX = function() {
	var _this = this;
	var existingData = new ArrayND(this);
	existingData.forEach(function(v, x, y, a) {
		_this[x][y] = existingData[a.x - x - 1][y];
	});

	return this;
};

ArrayND.prototype.invertY = function() {
	var _this = this;
	var existingData = new ArrayND(this);
	existingData.forEach(function(v, x, y, a) {
		_this[x][y] = existingData[x][a.y - y - 1];
	});

	return this;
};

/*
 * Misc utilities
 */

//inBounds(x, y)
//inBounds(x, y, w, h)
ArrayND.prototype.inBounds = function(x, y, w, h) {
	this.__assert__totalArgs("inBounds", [2,4], arguments);
	switch(arguments.length)
	{
		case 2:
			return (x >= 0) && (x < this.x) && (y >= 0) && (y < this.y);
		case 4:
			return this.inBounds(x, y) && this.inBounds(x+w-1, y+h-1);
	}
};

//log()
//log(renderFunction)
ArrayND.prototype.log = function(renderFunction) {
	this.__assert__totalArgs("log", [0,1], arguments);

	if((renderFunction === undefined) || !(renderFunction instanceof Function))
	{
		renderFunction = function(data) { return data; }; //default render function
	}

	function genChars(c, l)
	{
		var str = "";
		for(var i = 0; i < l; i++) { str += c; }
		return str;
	}

	function padLeft(str, len)
	{
		var space = genChars(" ", len - str.length);
		str = space + str;
		return str;
	}

	function padRight(str, len)
	{
		var space = genChars(" ", len - str.length);
		str = str + space;
		return str;
	}

	var maxYWidth = String(this.y - 1).length;
	var maxElementWidth = 0;
	this.forEach(function(v) {
		var width = String(v).length;
		if(width > maxElementWidth)
		{
			maxElementWidth = width;
		}
	});

	var header = genChars(" ", maxYWidth + 1) + genChars("_", (maxElementWidth + 1) * this.x) + "_";
	console.log(header);

	for(var y = 0; y < this.y; y++)
	{
		var line = padLeft(String(y), maxYWidth) + "| ";
		for(var x = 0; x < this.x; x++)
		{
			var element = String(renderFunction(this[x][y], x, y, this));
			line += padRight(element, maxElementWidth + 1);
		}
		console.log(line);
	}
};
