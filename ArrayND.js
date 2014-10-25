
/*
	N-dimensional arrays for JavaScript

	Written by Brendan Whitfield
*/


/*
 * ArrayND Constructor
 * 
 * new ArrayND(<ArrayND>);
 * new ArrayND(<x>, <y>, <z>, <w>, etc..);
 */
var ArrayND = function() {
	"use strict";

	var that = this;

	this.default = 0;


	function build(d, current)
	{
		if(d === that.dimensions - 1)
		{
			for(var i = 0; i < that.end[d]; i++)
			{
				current[i] = that.default;
			}
		}
		else if(d < that.dimensions)
		{
			for(var i = 0; i < that.end[d]; i++)
			{
				current[i] = {}; //create the next level
				build(d+1, current[i]) //fill the next level
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
		this.dimensions = arguments.length;
		this.start = [];
		this.end = Array.slice(arguments);
		this.length = this.end.reduce(function(a,b) { return a*b; });

		for(var d = 0; d < this.dimensions; d++)
			this.start.push(0);

		build(0, this);
	}


};

ArrayND.prototype.__validCoordinate__ = function(coordinate) {
	if(!(coordinate instanceof Array))
	{
		throw "ArrayND: Invalid coordinate type: " + (typeof coordinate);
	}

	if(coordinate.length !== this.dimensions)
	{
		throw "ArrayND: Invalid number of dimensions in coordinate: [" + coordinate.join(", ") + "]";
	}

	for(var d = 0; d < coordinate.length; d++)
	{
		if(coordinate[d] < 0)
			throw "ArrayND: Invalid coordinate. Index less than zero: [" + coordinate.join(", ") + "]";
		if(coordinate[d] >= this.dimensions[d])
			throw "ArrayND: Invalid coordinate. Index greater than length: [" + coordinate.join(", ") + "]";
	}
};

ArrayND.prototype.__isFunction__ = function(func) {
	if(!(func instanceof Function))
		throw "ArrayND: Invalid callback type: " + (typeof func);
};

/*
	start = [] coordinates
	end = [] coordinates
	callback = function(value, coordinates, ArrayND)
*/
ArrayND.prototype.forRange = function(start, end, callback) {

	var root = this;
	var coordinates = [];

	this.__validCoordinate__(start);
	this.__validCoordinate__(end);
	this.__isFunction__(callback);

	function iterate(d, current)
	{
		if(d === root.dimensions - 1)
		{
			for(var i = start[d]; i < end[d]; i++)
			{
				coordinates[d] = i;
				callback(current[i], coordinates, root); //reached a value
			}
		}
		else if(d < root.dimensions)
		{
			for(var i = start[d]; i < end[d]; i++)
			{
				coordinates[d] = i;
				iterate(d+1, current[i]) //recurse to the next level
			}
		}
	}

	iterate(0, root);
};

ArrayND.prototype.forEach = function(callback) {
	"use strict";
	this.forRange(this.start, this.end, callback);
};
