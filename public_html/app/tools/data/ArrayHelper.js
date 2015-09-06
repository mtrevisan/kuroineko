/**
 * @class ArrayHelper
 *
 * @see {@link https://github.com/enricomarino/array/blob/master/lib/array.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var empty = function(array){
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
	};

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
	 */
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
	};

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
	 */
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
				break
		return i;
	};

	var forEach = function(array, fn, scope){
		for(var i = 0, len = array.length; i != len; i ++)
			fn.call(scope || this, this[i], i, this);
	};

/*
Splice :
//if you plan on just removing one item, this one will be way faster:
var spliceOne = function(arr, index){
	var len = arr.length;
	if(!len)
		return;
	while(index < len){
		arr[index] = arr[index + 1];
		index ++
	}
	arr.length --;
};
*/

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

	/**
	 * Creates an array of unique values that are included in all of the provided arrays.
	 *
	 * @param {Array} a	The first array of sorted numbers.
	 * @param {Array} b	The second array of sorted numbers.
	 * @return {Array}	Returns the new array of shared values.
	 */
	var intersection = function(a, b){
		var n = a.length,
			m = b.length,
			i = 0,
			j = 0,
			result = [];

		while(i < n && j < m){
			if(a[i] < b[j])
				i ++;
			else if(a[i] > b[j])
				j ++;
			else{
				result.push(a[i]);
				i ++;
				j ++;
			}
		}

		return result;
	};

	/**
	 * Performs a binary search of an array to determine the index at which the element.
	 *
	 * @see {@link http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/}
	 *
	 * @param {Array} array	The sorted array to inspect.
	 * @param {*} element	The value to search.
	 * @return {Number}	Returns the index of the matched value, else <code>-1</code>.
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
	var partition = function(predicate, list){
		var result = [[], []];
		list.map(function(obj){
			result[predicate(obj)? 0: 1].push(obj);
		});
		return result;
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
		copy: copy,
		intersection: intersection,
		binaryIndexOf: binaryIndexOf,
		shuffle: shuffle,
		partition: partition
	};

});
