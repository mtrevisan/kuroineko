/**
 * @class MathHelper
 *
 * @see {@link https://github.com/mgechev/javascript-algorithms/tree/master/src}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var bitCount = function(u){
		for(var n = 0; u; n ++)
			u &= u - 1;
		return n;
	};

	/**
	 * @requires input be an integer
	 */
	var nextPowerOf2 = function(n){
		if(getLeastSignificantBit(n) == n)
			return n; //check if n is itself power of 2

		return getMostSignificantBit(n) << 1;
	};

	/**
	 * @requires input be a positive integer
	 */
	var getMostSignificantBit = function(n){
		var tmp = n;
		while(tmp){
			n = tmp;
			tmp = tmp ^ (getLeastSignificantBit(tmp));
		}
		return n;
	};

	/**
	 * @requires input be a positive integer
	 */
	var getLeastSignificantBit = function(n){
		return n & (~(n - 1));
	};


	var combine = function(k, n){
		var size = 1 << n,
			result = [],
			u;
		for(u = 1; u < size; u ++)
			if(bitCount(u) == k)
				result.push.apply(result, [bitPrint(u)]);
		return result;
	};

	var combineUpTo = function(k, n){
		var result = [],
			i;
		for(i = 1; i <= k; i ++)
			Array.prototype.push.apply(result, combine(i, n));
		return result;
	};

	var combineAll = function(n){
		return combineUpTo(n, n);
	};

	/** @private */
	var bitPrint = function(u){
		var s = [];
		for(var n = 0; u; n ++, u >>= 1)
			if(u & 1)
				s.push(n);
		return s;
	};

	/** Counting QuickPerm Algorithm */
	var permute = function(list){
		var size = list.length,
			index = [],
			result = [];
		for(var i = 0; i < size; i ++)
			index.push(0);
		result.push(list.join(''));

		var i = 1,
			j, swap;
		while(i < size){
			if(index[i] < i){
				j = (i % 2? index[i]: 0);

				swap = list[i];
				list[i] = list[j];
				list[j] = swap;

				result.push(list.join(''));

				index[i] ++;
				i = 1;
			}
			else{
				index[i] = 0;
				i ++;
			}
		}
		return result;
	};


	return {
		bitCount: bitCount,
		nextPowerOf2: nextPowerOf2,
		getMostSignificantBit: getMostSignificantBit,
		getLeastSignificantBit: getLeastSignificantBit,

		combine: combine,
		combineUpTo: combineUpTo,
		combineAll: combineAll,
		permute: permute
	};

});
