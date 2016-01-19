/**
 * @class BinaryIndexedTree
 *
 * @author Mauro Trevisan
 */
define(['tools/math/MathHelper'], function(MathHelper){

	var Constructor = function(symbolCount, initialCounts){
		this.reset(symbolCount, initialCounts);
	};


	var reset = function(symbolCount, initialCounts){
		this.tree = [0];

		this.maxSymbol = symbolCount;
		if(initialCounts)
			Object.keys(initialCounts).forEach(function(i){
				this.update(i, initialCounts[i]);
			}, this);
		else
			for(var i = 0; i < symbolCount; i ++)
				this.update(i, 1);
	};

	/** Read cumulative frequency */
	var readCumulative = function(idx){
		idx ++;
		var sum = 0;
		while(idx){
			sum += toInteger(this.tree[idx]);
			//remove least significant 1
			idx -= (idx & -idx);
		}
		return sum;
	};

	/** Read the total frequencies */
	var readTotal = function(){
		return this.readCumulative(this.maxSymbol - 1);
	};

	/** Read the actual frequency at a position */
	var read = function(idx){
		var sum = this.tree[++ idx];
		if(idx){
			//make z first
			var z = idx - (idx & -idx);
			//idx is no important any more, so instead y, you can use idx
			idx --;
			//at some iteration idx (y) will become z
			while(idx != z){
				sum -= toInteger(this.tree[idx]);
				//substruct tree frequency which is between y and "the same path"
				idx -= (idx & -idx);
			}
		}
		return sum;
	};

	/** Change frequency at some position and update tree */
	var update = function(idx, value){
		if(value){
			idx ++;
			while(idx <= this.maxSymbol){
				this.tree[idx] = toInteger(this.tree[idx]) + value;
				//add least significant 1
				idx += (idx & -idx);
			}
		}
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

	/**
	 * Apply a function for each frequency in the tree.
	 *
	 * @example
	 * Rescales by dividing all frequencies by a constant factor
	 * <code>
	 *	map(function(k){ return k / 3; });
	 *	</code>
	 *
	 * @example
	 * Rescales by dividing all frequencies by 2, but taking a minimum of 1
	 * <code>
	 *	map(function(k){ return ((k + 1) >> 1); });
	 *	</code>
	 */
	var map = function(fn){
		for(var i = 0 ; i < this.maxSymbol; i ++){
			var tmp = this.read(i);
			this.update(i, fn(tmp) - tmp);
		}
	};

	var some = function(fn){
		for(var i = 0; i < this.maxSymbol; i ++)
			if(fn(this.read(i)))
				return true;
		return false;
	};

	/** Find index with given cumulative frequency, if exact find, lower index with cumulative frequency not lower than the given one otherwise */
	var find = function(freq, exactFind){
		var idx = 0,
			//round down to the nearest power of 2
			bitMask = MathHelper.getMostSignificantBit(this.maxSymbol);
		while(bitMask && idx < this.maxSymbol){
			//we make midpoint of interval
			var tmp = idx + bitMask;
			if(freq >= this.tree[tmp]){
				//if current cumulative frequency is equal to freq, we are still looking for higher index (if exists)
				idx = tmp;
				//set frequency for next loop
				freq -= this.tree[tmp];
			}

			//half current interval
			bitMask >>= 1;
		}
		return (exactFind && freq? -1: idx);
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,
		readCumulative: readCumulative,
		readTotal: readTotal,
		read: read,
		update: update,
		map: map,
		some: some,
		find: find
	};


	return Constructor;

});
