/**
 * @class BitBuffer
 *
 * @author Mauro Trevisan
 */
define(function(){

	var BITS_TO_GO = 8;


	var Constructor = function(hex){
		this.reset(hex);
	};

	Constructor.BITS_TO_GO = BITS_TO_GO;


	var reset = function(hex){
		this.buffer = [];
		this.current = 0;
		this.bitsToGo = BITS_TO_GO;
		this.bits = 0;

		if(hex){
			if(hex instanceof Uint8Array)
				hex = Array.prototype.slice.call(hex);

			var size = hex.length,
				i;
			if(Array.isArray(hex))
				for(i = 0; i < size; i ++)
					this.buffer.push(hex[i]);
			else if(typeof hex === 'string')
				for(i = 0; i < size; i += 2)
					this.buffer.push(parseInt(hex.substr(i, 2), 16));
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

	/** Write down what remains of the buffer to be written */
	var finalize = function(){
		while(this.bitsToGo < BITS_TO_GO)
			this.appendBit(0);
	};

	var getIterator = function(){
		var b = this.buffer,
			bitsRemaining, bits, index, currentBit;

		var hasNext = function(){
			return (index < b.length);
		};
		var next = function(){
			currentBit = (bits >> bitsRemaining) & 0x1;
			if(!bitsRemaining)
				loadNextByte();
			else
				bitsRemaining --;
			return currentBit;
		};
		var loadNextByte = function(){
			bitsRemaining = BITS_TO_GO - 1;
			bits = b[++ index];
		};
		var rewind = function(){
			index = -1;
			loadNextByte();
			currentBit = undefined;
		};
		var current = function(){
			return currentBit;
		};

		rewind();

		return {
			hasNext: hasNext,
			next: next,
			rewind: rewind,
			current: current
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
		finalize: finalize,

		getIterator: getIterator,

		toHexString: toHexString
	};


	return Constructor;

});
