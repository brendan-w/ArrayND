ArrayND
=======

Javascript library for multi-dimensional arrays.

Please use wisely, memory adds up quickly.


Constructors
------------

	//creates N dimensions, with lengths x, y, z, w, etc...
	arr = arrayND(x, y, z, w, etc...)

	//copy constructor
	arr = arrayND(<arrayND>)


Properties
----------

	arr.dimensions		//the number of dimensions
	arr.length			//the number of elements
	arr.default			//the default value (0 by default)
	arr.start			//start coordinate ([0, 0, 0, etc...])
	arr.end				//end coordinate ([x-1, y-1, z-1, etc...])


API Functions
-------------

All API functions operate in-place (on the existing array).

All callback functions are of the format:

	function(value, coord arrayND)

All coordinates are of the format:

	[x, y, z, w, etc...]

###Get & Set

	//access elements directly
	arr[3][1][2] = 6;

	//OR

	//get & set with array-style coordinate
	arr.get([3, 1, 2]);
	arr.set([3, 1, 2], 6);

	//if no value for .set() is given, the default will be used
	arr.set([3, 1, 2]);

###Traversal

	//iterates over all elements
	arr.forEach(callback)

	//iterates over the given coordinate space (inclusive)
	arr.forRange(start_coord, stop_coord, callback)

###Fill Statements

	//sets all elements to the given value
	fill(value)

	//sets only the elements in the given coordinate space
	fillRange(start, end, value)
