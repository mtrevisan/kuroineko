/**
 * @class BitBuffer
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** @constant */
	var BITS_TO_GO = 8;


	var Constructor = function(hex, size){
		this.reset(hex, size);
	};

	Constructor.BITS_TO_GO = BITS_TO_GO;


	var reset = function(hex, size){
		this.buffer = [];
		this.current = 0;
		this.bitsToGo = BITS_TO_GO;
		this.bits = 0;

		if(hex){
			if(hex instanceof Uint8Array)
				hex = Array.prototype.slice.call(hex);

			var len = hex.length,
				i;
			if(Array.isArray(hex))
				for(i = 0; i < len; i ++)
					this.buffer.push(hex[i]);
			else if(ObjectHelper.isString(hex))
				for(i = 0; i < len; i += 2)
					this.buffer.push(parseInt(hex.substr(i, 2), 16));

			this.bits = size;

			size %= BITS_TO_GO;
			if(size){
				this.current = this.buffer.pop();
				this.bitsToGo -= size;
			}
		}
	};

	/** Returns the buffer length [bit] */
	var size = function(){
		return this.bits;
	};

	/** Returns the buffer */
	var array = function(){
		return this.buffer;
	};

	var appendBit = function(bit){
		this.current = (this.current << 1) | bit;
		this.bitsToGo --;

		if(!this.bitsToGo){
			this.buffer.push(this.current);
			this.current = 0;
			this.bitsToGo = BITS_TO_GO;
		}

		this.bits ++;
	};

	/** Write some data to the bit string. The number of bits must be 32 or fewer. */
	var append = function(data, numberOfBits){
		for(var i = numberOfBits - 1; i >= 0; i --)
			this.appendBit(data & (1 << i)? 1: 0);
	};

	/** Write down what remains of the buffer to be written */
	var finalize = function(){
		while(this.bitsToGo){
			this.current = (this.current << 1) | 0;
			this.bitsToGo --;
		}

		this.buffer.push(this.current);
		this.current = 0;
		this.bitsToGo = BITS_TO_GO;
	};

	var getIterator = function(){
		var b = this.buffer,
			bitsRemaining, bits, idx, currentBit;

		var hasNext = function(){
			return (idx < b.length);
		};
		var next = function(){
			currentBit = (bits >> bitsRemaining) & 0x1;
			if(!bitsRemaining)
				loadNextByte();
			else
				bitsRemaining --;
			return currentBit;
		};
		var skip = function(n){
			while(n --)
				next();
		};
		/** @private */
		var loadNextByte = function(){
			bitsRemaining = BITS_TO_GO - 1;
			bits = b[++ idx];
		};
		var rewind = function(){
			idx = -1;
			loadNextByte();
			currentBit = undefined;
		};
		var current = function(){
			return currentBit;
		};
		var index = function(){
			return (idx >= 0? idx * 8 + BITS_TO_GO - bitsRemaining - 1: 0);
		};

		rewind();

		return {
			hasNext: hasNext,
			next: next,
			skip: skip,
			rewind: rewind,
			current: current,
			index: index
		};
	};

	/** Returns a hexadecimal string representation of the BitBuffer with bits in logical order. */
	var toHexString = function(){
		var str = [],
			size = this.buffer.length,
			i;
		for(i = 0; i < size; i ++)
			str.push(leftPad(this.buffer[i]));
		return str.join('');
	};

	/** @private */
	var leftPad = function(str){
		str = str.toString(16);
		return (str.length < 2? '0' + str: str);
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,
		size: size,
		array: array,

		appendBit: appendBit,
		append: append,
		finalize: finalize,

		getIterator: getIterator,

		toHexString: toHexString
	};


	return Constructor;

});
