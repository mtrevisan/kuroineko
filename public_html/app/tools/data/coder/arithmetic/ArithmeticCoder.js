/**
 * @class ArithmeticCoder
 *
 * @see {@link https://nerget.com/compression/}
 * @see {@link https://software.intel.com/sites/default/files/m/b/6/3/HPL-2004-76.pdf}
 * @see {@link http://www.ittc.ku.edu/~jsv/Papers/HoV94.arithmetic_codingOfficial.pdf}
 * @see {@link http://cs1.cs.nyu.edu/~roweis/csc310-2006/extras/implementing_ppm.pdf}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/BitBuffer'], function(BitBuffer){

	/**
	 * Precision of coding, expressed in number of bits used for arithmetic before shifting out partial results.
	 * @constant
	 */
	var CODE_VALUE_BITS = 28;

	/**
	 * The largest possible interval value. All <code>1</code>s.
	 * @constant
	 */
	var TOP_VALUE = (1 << CODE_VALUE_BITS) - 1;
	/**
	 * 1/4 of the largest possible value plus one.
	 * @constant
	 */
	var FIRST_QUARTER = ((TOP_VALUE >> 2) + 1);
	/**
	 * 1/2 of the largest possible value; <code>2 * FIRST_QUARTER</code>.
	 * @constant
	 */
	var HALF = FIRST_QUARTER << 1;
	/**
	 * 3/4 of the largest possible value; <code>3 * FIRST_QUARTER</code>.
	 * @constant
	 */
	var THIRD_QUARTER = HALF + FIRST_QUARTER;


	var startEncoding = function(encodingBuffer){
		//low bound on the current interval for coding
		this.low = 0;
		//high bound on the current interval for coding
		this.high = TOP_VALUE;

		//number of bits beyond first bit that were normalized
		this.bitsToFollow = 0;

		this.buffer = (encodingBuffer || new BitBuffer());
	};

	/**
	 * Encodes an interval expressed as a low count, high count and total count.<p>
	 * The high count is taken to be exclusive, and the resulting range is <code>highCount - lowCount + 1</code>.
	 */
	var encodeInterval = function(interval){
		calculateRange.call(this, interval);

		while(true){
			if(this.high < HALF)
				appendBitWithFollow.call(this, 0);
			else if(this.low >= HALF){
				appendBitWithFollow.call(this, 1);

				this.low -= HALF;
				this.high -= HALF;
			}
			else if(this.low >= FIRST_QUARTER && this.high < THIRD_QUARTER){
				this.bitsToFollow ++;

				this.low -= FIRST_QUARTER;
				this.high -= FIRST_QUARTER;
			}
			else
				break;

			this.low <<= 1;
			this.high = (this.high << 1) + 1;
		}
	};

	var closeEncoding = function(){
		this.bitsToFollow ++;

		appendBitWithFollow.call(this, toInteger(this.low < HALF));

		this.buffer.finalize();

		return this.buffer;
	};

	/**
	 * Computes the resulting interval to code the specified symbol.
	 *
	 * @private
	 */
	var calculateRange = function(interval){
		var range = this.high - this.low + 1;
		this.high = this.low + toInteger(range * interval.high / interval.total) - 1;
		this.low += toInteger(range * interval.low / interval.total);
	};

	/**
	 * Writes a <code>b</code> bit, and then a number of <code>~b</code> bits equal to the number of bits to follow.
	 *
	 * @private
	 */
	var appendBitWithFollow = function(b){
		for(this.buffer.appendBit(b); this.bitsToFollow; this.bitsToFollow --)
			this.buffer.appendBit(b ^ 1);
	};


	var startDecoding = function(decodingBufferIterator){
		//low bound on the current interval for coding
		this.low = 0;
		//high bound on the current interval for coding
		this.high = TOP_VALUE;

		this.bufferIterator = decodingBufferIterator;

		this.value = 0;
		for(var i = 0; i < CODE_VALUE_BITS; i ++)
			this.value = (this.value << 1) + this.bufferIterator.next();
	};

	var decodeInterval = function(interval){
		calculateRange.call(this, interval);

		while(true){
			if(this.high >= HALF){
				if(this.low >= HALF){
					this.value -= HALF;

					this.low -= HALF;
					this.high -= HALF;
				}
				else if(this.low >= FIRST_QUARTER && this.high < THIRD_QUARTER){
					this.value -= FIRST_QUARTER;

					this.low -= FIRST_QUARTER;
					this.high -= FIRST_QUARTER;
				}
				else
					break;
			}

			this.low <<= 1;
			this.high = (this.high << 1) + 1;

			if(this.value << 1 >= TOP_VALUE)
				throw 'Decoding error';

			this.value = (this.value << 1) + this.bufferIterator.next();
		}
	};

	/**
	 * Returns a count for the current symbol that will be between the low and high counts for the symbol in the model given the total count.
	 * <p>
	 * Once symbol is retrieved, the model is used to compute the actual low, high and total counts and {@link #removeSymbolFromStream} is called.
	 *
	 * @param totalCount	The current total count for the model.
	 * @return	A count that is in the range above or equal to the low count and less than the high count of the next symbol decoded.
	 */
	var getCurrentSymbolCount = function(totalCount){
		return toInteger(((this.value - this.low + 1) * totalCount - 1) / (this.high - this.low + 1));
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
		TOP_VALUE: TOP_VALUE,

		startEncoding: startEncoding,
		encodeInterval: encodeInterval,
		closeEncoding: closeEncoding,

		startDecoding: startDecoding,
		getCurrentSymbolCount: getCurrentSymbolCount,
		decodeInterval: decodeInterval
	};

});
