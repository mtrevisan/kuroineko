/**
 * @class ArrayHelper
 *
 * @see {@link https://github.com/enricomarino/array/blob/master/lib/array.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/*var empty = function(array){
		array.length = 0;
	};

	var push = function(array, item){
		array[array.length] = item;
	};
//	Array.prototype.push = push;

	var pop = function(array){
		return array[array.length --];
	};

	var shift = function(array){
		return array.shift();
	};

	var unshift = function(array, element){
		var i = array.length;
		while(i){
			array[i] = array[i - 1];
			i --;
		}
		array[0] = element;
	};*/

	/**
	 * Gets the index at which the first occurrence of {@code element} is found in {@code array}.<p>
	 * If {@code fromIndex} is negative, it's used as the offset from the end of {@code array}. If {@code array} is sorted providing <code>true</code>
	 * for {@code fromIndex} performs a faster binary search.
	 *
	 * @see {@link https://github.com/lodash/lodash/blob/master/lodash.js}
	 *
	 * @param {Array} array	The array to search.
	 * @param {*} element	The value to search for.
	 * @param {Boolean|Number} [fromIndex=0]	The index to search from or <code>true</code> to perform a binary search on a sorted array.
	 * @return {Number}	Returns the index of the matched value, else <code>-1</code>.
	 *
	 * @example
	 * <code>
	 * ArrayHelper.indexOf([1, 2, 1, 2], 2);
	 * // => 1
	 * </code>
	 *
	 * @example
	 * <code>
	 * //using `fromIndex`
	 * ArrayHelper.indexOf([1, 2, 1, 2], 2, 2);
	 * // => 3
	 * </code>
	 *
	 * @example
	 * <code>
	 * //performing a binary search
	 * ArrayHelper.indexOf([1, 1, 2, 2], 2, true);
	 * // => 2
	 * </code>
	 * /
	var indexOf = function(array, element, fromIndex){
		var length = (array? array.length: 0);
		if(!length)
			return -1;

		if(typeof fromIndex == 'number'){
			fromIndex = toInteger(fromIndex);
			fromIndex = (fromIndex < 0? Math.max(length + fromIndex, 0): fromIndex);
		}
		else if(fromIndex)
			return binaryIndexOf(array, element);

		for(var i = fromIndex; i != length; i ++)
			if(array[i] == element)
				return i;
		return -1;
	};*/

	/**
	 * Gets the index at which the last occurrence of {@code element} is found in {@code array}.<p>
	 * If {@code fromIndex} is negative, it's used as the offset from the end of {@code array}. If {@code array} is sorted providing <code>true</code>
	 * for {@code fromIndex} performs a faster binary search.
	 *
	 * @see {@link https://github.com/lodash/lodash/blob/master/lodash.js}
	 *
	 * @param {Array} array	The array to search.
	 * @param {*} element	The value to search for.
	 * @param {Boolean|Number} [fromIndex=0]	The index to search from or <code>true</code> to perform a binary search on a sorted array.
	 * @return {Number}	Returns the index of the matched value, else <code>-1</code>.
	 *
	 * @example
	 * <code>
	 * ArrayHelper.indexOf([1, 2, 1, 2], 2);
	 * // => 3
	 * </code>
	 *
	 * @example
	 * <code>
	 * //using `fromIndex`
	 * ArrayHelper.indexOf([1, 2, 1, 2], 2, 2);
	 * // => 1
	 * </code>
	 *
	 * @example
	 * <code>
	 * //performing a binary search
	 * ArrayHelper.indexOf([1, 1, 2, 2], 2, true);
	 * // => 3
	 * </code>
	 * /
	var lastIndexOf = function(array, element, fromIndex){
		var length = (array? array.length: 0);
		if(!length)
			return -1;

		var i = length;
		if(typeof fromIndex == 'number'){
			i = toInteger(fromIndex);
			i = (i < 0? Math.max(length + i, 0): Math.min(i, length - 1)) + 1;
		}
		else if(fromIndex)
			return binaryIndexOf(array, element);

		while(i --)
			if(array[i] == element)
				break;
		return i;
	};*/

	var findIndex = function(array, predicate){
		for(var i = 0, len = array.length; i < len; i ++)
			if(predicate.call(array, array[i], i))
				return i;
		return -1;
	};

	/*var forEach = function(array, fn, scope){
		for(var i = 0, len = array.length; i != len; i ++)
			fn.call(scope || this, this[i], i, this);
	};*/

	/**
	 * Copies the values of `source` to `destination`.
	 *
	 * @param {Array} source				The array to copy values from.
	 * @param {Array} [destination=[]]	The array to copy values to.
	 */
	var copy = function(source, destination){
		var index = -1,
			length = source.length;

		destination || (destination = Array(length));
		while(++ index < length)
			destination[index] = source[index];
		return destination;
	};

	/** NOTE: elements should be unique! */
	var equals = function(a, b){
		return (a.length == b.length && a.every(function(el){ return (b.indexOf(el) >= 0); }));
	};

	/** Tells whether <code>b</code> is contained into <code>a</code>. */
	var contains = function(a, b){
		return b.every(function(el){ return (a.indexOf(el) >= 0); });
	};

	/**
	 * Creates an array of unique values that are included in all of the provided arrays.
	 *
	 * @param {Array} arguments	The array(s).
	 * @return {Array}	New array of shared values.
	 */
	var intersection = function(a){
		if(a == null)
			return [];
		if(arguments.length === 1)
			return unique(a);

		var arr = Array.prototype.slice.call(arguments, 1);

		return unique(a).filter(function(el){
			return arr.some(function(cur){
				return (cur && cur.some(function(item){
					return (item == el);
				}));
			});
		});
	};

	/**
	 * Creates an array of unique values that are included in all of the provided arrays.
	 *
	 * @param {Array} arguments	The array(s).
	 * @return {Array}	Array of unique items.
	 */
	var unique = function(){
		for(var j = 0, argsLength = arguments.length; j < argsLength; j ++)
			if(!Array.isArray(arguments[j]))
				return [];

		var arr = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments));
		return arr.filter(function(el, idx, arr){
			return (arr.indexOf(el) == idx);
		});
	};

	/**
	 * Take the difference between one array and a number of other arrays.<p>
	 * Only the elements present in just the first array will remain.
	 *
	 * @param {Array} arguments	The array(s).
	 * @return {Array}	Array of difference.
	 */
	var difference = function(arr){
		if(!Array.isArray(arguments[0]))
			return [];
		for(var j = 1, argsLength = arguments.length; j < argsLength; j ++)
			if(!Array.isArray(arguments[j]))
				return arguments[0];

		var rest = Array.prototype.concat.apply([], Array.prototype.slice.call(arguments, 1));
		return arr.filter(function(value){
			return (rest.indexOf(value) < 0);
		});
	};

	var cartesianProductOf = function(){
		return Array.prototype.reduce.call(arguments, function(a, b){
			var ret = [];
			a.forEach(function(a){
				b.forEach(function(b){
					ret.push(a.concat([b]));
				});
			});
			return ret;
		}, [[]]);
	};

	/**
	 * Performs a binary search of an array to determine the index at which the element.<p>
	 * Returns the index <code>idx</code> in the table such that <code>value = array[idx]</code>, where <code>array[idx] <= array[idx + 1]</code>, if positive.<br>
	 * Returns the index <code>idx</code> in the table such that <code>array[-idx - 1] < value < array[-idx]</code>, if negative.
	 *
	 * @see {@link http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/}
	 *
	 * @param {Array} array	The sorted array to inspect.
	 * @param {*} element	The value to search.
	 * @return {Number}	The index of the matched value, otherwise the negated of the element just after.
	 *
	 * @private
	 */
	var binaryIndexOf = function(array, element){
		var low = 0,
			high = array.length - 1,
			mid, current;

		while(low <= high){
			mid = (low + high) >>> 1;
			current = array[mid];

			if(current < element)
				low = mid + 1;
			else if(current > element)
				high = mid - 1;
			else
				return mid;
		}

		return ~high;
	};

	/** Apply Fisher-Yates (aka Knuth) shuffle */
	var shuffle = function(array){
		var currentIndex = array.length,
			randomIndex;
		while(currentIndex){
			randomIndex = toInteger(Math.random() * currentIndex --);

			array[currentIndex] = array[randomIndex] + (array[randomIndex] = array[currentIndex], 0);
		}
	};

	/**
	 * Takes a predicate and a list and returns the pair of lists of elements which do and do not satisfy the predicate, respectively.
	 *
	 * @example
	 * <code>
	 * ArrayHelper.partition(function(value){ return (value.indexOf('s') >= 0); }, ['sss', 'ttt', 'foo', 'bars']);
	 * //=> [['sss', 'bars'], ['ttt', 'foo']]
	 * </code>
	 *
	 * @param {Function} predicate	A predicate to determine which array the element belongs to.
	 * @param {Array} list				The array to partition.
	 * @return {Array} A nested array, containing first an array of elements that satisfied the predicate, and second an array of elements
	 *		that did not satisfy.
	 */
	var partition = function(list, predicate){
		var result = {};
		list.forEach(function(value, index){
			var key = predicate(value, index, list);
			if(key in result)
				result[key].push(value);
			else
				result[key] = [value];
		});
		return result;
	};

	/**
	 * Returns a new list by pulling every item out of it (and all its sub-arrays) and putting them in a new array, depth-first.
	 *
	 * @param {Array} list The array to consider.
	 * @return {Array} The flattened list.
	 */
	var flatten = function(list){
		return (function recursiveFlatten(list){
			var result = [];
			var add = function(x){
				if(Array.isArray(x) || ObjectHelper.isObject(x))
					result = result.concat(recursiveFlatten(x));
				else
					result.push(x);
			};

			if(ObjectHelper.isObject(list))
				Object.keys(list).forEach(function(x){
					add(list[x]);
				});
			else
				list.forEach(function(x){
					add(x);
				});
			return result;
		})(list);
	};

	/**
	 * Converts <code>value</code> to an integer.
	 *
	 * @param {*} value	The value to convert.
	 * @return {Number}	Returns the integer.
	 *
	 * @private
	 */
	var toInteger = function(value){
		return (value | 0);
	};


	return {
		findIndex: findIndex,
		copy: copy,
		equals: equals,
		contains: contains,
		intersection: intersection,
		unique: unique,
		difference: difference,
		cartesianProductOf: cartesianProductOf,
		binaryIndexOf: binaryIndexOf,
		shuffle: shuffle,
		partition: partition,
		flatten: flatten
	};

});
