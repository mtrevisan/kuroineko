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

	var unshift = function(array, item){
		var i = array.length;
		while(i){
			array[i] = array[i - 1];
			i --;
		}
		array[0] = item;
	};

	var indexOf = function(array, item){
		for(var i = 0, len = array.length; i != len; i ++)
			if(array[i] == item)
				return i;
		return -1;
	};

	var lastIndexOf = function(array, item){
		var i = array.length;
		while(i --)
			if(array[i] == item)
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

	var intersection = function(a, b){
		var n = a.length,
			m = b.length,
			i = 0, j = 0,
			result = [];

		while(i < n && j < m){
			if(a[i] < b[j])
				i ++;
			else if(a[i] > b[j])
				j ++;
			else{
				result.push(i);
				i ++;
				j ++;
			}
		}

		return result;
	};

	/**
	 * @example
	 * <code>
	 *	binaryIndexOf.call(someArray, searchElement);
	 *	</code>
	 *
	 * @see {@link http://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search/}
	 *
	 * @private
	 */
	var binaryIndexOf = function(element){
		var low = 0,
			high = this.length - 1,
			mid, current;

		while(low <= high){
			mid = (low + high) >>> 1;
			current = this[mid];

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
			temporaryValue,
			randomIndex;

		while(currentIndex){
			randomIndex = Math.random() * currentIndex | 0;
			currentIndex --;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
	};


	return {
		copy: copy,
		intersection: intersection,
		binaryIndexOf: binaryIndexOf,
		shuffle: shuffle
	};

});
