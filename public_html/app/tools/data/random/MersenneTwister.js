/**
 * @class MersenneTwister
 *
 * I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
 * so it's better encapsulated. Now you can have multiple random number generators
 * and they won't stomp all over eachother's state.
 *
 * If you want to use this as a substitute for Math.random(), use the random() method like so:
 * <code>
 *		var m = new MersenneTwister();
 *		var randomNumber = m.random();
 *	</code>
 *
 *	You can also call the other genrand_{foo}() methods on the instance.
 *
 *	If you want to use a specific seed in order to get a repeatable random sequence, pass an integer into the constructor:
 *	<code>
 *		var m = new MersenneTwister(123);
 *	</code>
 *	and that will always produce the same random sequence.
 *
 * @see {@link http://en.wikipedia.org/wiki/Mersenne_twister}
 *	@see {@link https://github.com/boo1ean/mersenne-twister/blob/master/src/mersenne-twister.js}
 *	@see {@link https://github.com/pigulla/mersennetwister/blob/master/src/MersenneTwister.js}
 *
 *	@author Sean McCullough (banksean@gmail.com)
 *	http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
 *	email: m-mat@math.sci.hiroshima-u.ac.jp
 */
define(function(){

	//coefficients for MT19937
	var W = 32,
		//degree of recurrence
		N = 624,
		//middle word, an offset used in the recurrence relation defining the series x, 1 ≤ m < n
		M = 397,
		//R = 31,
		//constant vector a, oefficients of the rational normal form twist matrix
		MATRIX_A = 0x9908B0DF,
		SHIFT_U = 11,
		MASK_D = 0xFFFFFFFF,
		SHIFT_S = 7,
		MASK_B = 0x9D2C5680,
		SHIFT_T = 15,
		MASK_C = 0xEFC60000,
		SHIFT_L = 18,
		//least significant r bits ((1 << r) - 1, where r is the separation point of one word, 0 ≤ r ≤ w - 1)
		LOWER_MASK = 0x7FFFFFFF,
		//most significant w-r bits (lowest w bits of (not lower_mask), where w is the word size in number of bits)
		UPPER_MASK = 0x80000000,
		F = 1812433253;

	/** @private * /
	var is64bitOS = function(){
		return !!navigator.userAgent.match(/x86[_-]64|x64_64|Win64|x64;|amd64|AMD64|WOW64/);
	};
	//coefficients for MT19937-64
	/*if(is64bitOS()){
		W = 64;
		//degree of recurrence
		N = 312;
		//middle word, an offset used in the recurrence relation defining the series x, 1 ≤ m < n
		M = 156;
		//R = 31;
		//constant vector a, oefficients of the rational normal form twist matrix
		MATRIX_A = 0xB5026F5AA96619E9;
		SHIFT_U = 29;
		MASK_D = 0x5555555555555555;
		SHIFT_S = 17;
		MASK_B = 0x71D67FFFEDA60000;
		SHIFT_T = 37;
		MASK_C = 0xFFF7EEE000000000;
		SHIFT_L = 43;
		//least significant r bits ((1 << r) - 1, where r is the separation point of one word, 0 ≤ r ≤ w - 1)
		LOWER_MASK = 0x7FFFFFFFFFFFFFFF;
		//most significant w-r bits (lowest w bits of (not lower_mask), where w is the word size in number of bits)
		UPPER_MASK = 0x8000000000000000;
		F = 6364136223846793005;
	}/**/

	var MAX_INT = Math.pow(2, W);


	/**
	 * Instantiates a new Mersenne Twister.
	 *
	 * @param {Number=} seed	The initial seed value
	 */
	var Constructor = function(seed){
		if(seed == undefined)
			seed = +(new Date());

		//the array for the state vector
		//this.mt = new Array(N);
		this.mt = [];
		//index == N + 1 means MT is not initialized
		this.index = N + 1;

		this.seed(seed);
	};


	/**
	 * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
	 *
	 * @param {Number} s		The seed value
	 */
	var seed = function(s){
		this.mt[0] = s >>> 0;
		for(var i = 1; i < N; i ++){
			//MT[i] = lowest w bits of (f * (MT[i-1] xor (MT[i-1] >> (w - 2))) + i)
			seed = this.mt[i - 1] ^ (this.mt[i - 1] >>> (W - 2));
			this.mt[i] = (((((s & 0xFFFF0000) >>> 16) * F) << 16) + (s & 0x0000FFFF) * F) + i;
			//See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier
			//In the previous versions, MSBs of the seed affect only MSBs of the array MT[]
			//2002/01/09 modified by Makoto Matsumoto
			//for W > 32 machines
			this.mt[i] >>>= 0;
		}
		this.index = N;
	};

	/**
	 * Initializes the state vector by using an array of unsigned 32-bit integers of the specified length.
	 * If length is smaller than 624, then each array of 32-bit integers gives distinct initial state vector.
	 * This is useful if you want a larger seed space than 32-bit word.
	 *
	 * @param {Array} key			is the array for initializing keys
	 */
	var seedWithArray = function(key){
		this.seed(19650218);

		var i = 1,
			j = 0,
			k = (key.length < N? N: key.length),
			s;
		for( ; k; k --){
			s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

			//non linear
			this.mt[i] = (this.mt[i] ^ (((((s & 0xFFFF0000) >>> 16) * 1664525) << 16) + ((s & 0x0000FFFF) * 1664525))) + key[j] + j;
			//for W > 32 machines
			this.mt[i] >>>= 0;
			i ++;
			j ++;
			if(i >= N){
				this.mt[0] = this.mt[N - 1];
				i = 1;
			}
			if(j >= key.length)
				j = 0;
		}

		for(k = N - 1; k; k --){
			s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);

			//non linear
			this.mt[i] = (this.mt[i] ^ (((((s & 0xFFFF0000) >>> 16) * 1566083941) << 16) + (s & 0x0000FFFF) * 1566083941)) - i;
			//for W > 32 machines
			this.mt[i] >>>= 0;
			i ++;
			if(i >= N){
				this.mt[0] = this.mt[N - 1];
				i = 1;
			}
		}

		//MSB is 1; assuring non-zero initial array
		this.mt[0] = 0x80000000;
	};

	/**
	 * Generate the next n values from the series x[i]
	 *
	 * @private
	 */
	var twist = function(){
		var y, kk;
		for(kk = 0; kk < N - M; kk ++){
			y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
			this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ ((y & 0x01) * MATRIX_A);
		}
		for( ; kk < N - 1; kk ++){
			y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
			this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ ((y & 0x01) * MATRIX_A);
		}
		y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
		this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ ((y & 0x01) * MATRIX_A);

		this.index = 0;
	};

	/** Generates a random unsigned number on [0,0x7FFFFFFF] interval */
	var int31 = function(){
		return (this.int32() >>> 1);
	};

	/** Generates a random unsigned number on [0, 0xFFFFFFFF] interval */
	var int32 = function(){
		var y;

		//generate n words at one time
		if(this.index >= N){
			//if seed() has not been called, a default initial seed is used
			if(this.index > N)
				this.seed(5489);

			twist.call(this);
		}

		y = this.mt[this.index ++];

		//tempering
		y ^= (y >>> SHIFT_U) & MASK_D;
		y ^= (y << SHIFT_S) & MASK_B;
		y ^= (y << SHIFT_T) & MASK_C;
		y ^= (y >>> SHIFT_L);
		return y >>> 0;
	};

	/** Generates a random real on [0,1] interval */
	var real1 = function(){
		//divided by 2^32-1
		return this.int32() * (1. / (MAX_INT - 1));
	};

	/** Generates a random real on [0,1[ interval */
	var random = function(){
		return this.int32() * (1. / MAX_INT);
	};

	/** Generates a random real on [0,1[ interval with 53-bit resolution*/
	var res53 = function(){
		var a = this.int32() >>> 5,
			b = this.int32() >>> 6;
		return (a * 67108864. + b) * (1. / 9007199254740992.);
	};

	/** Generates a random real on ]0,1[ interval */
	var real3 = function(){
		return (this.int32() + 0.5) * (1. / MAX_INT);
	};

	/* These real versions are due to Isaku Wada, 2002/01/09 added */


	Constructor.prototype = {
		constructor: Constructor,

		seed: seed,
		seedWithArray: seedWithArray,
		int31: int31,
		int32: int32,
		real1: real1,
		random: random,
		res53: res53,
		real3: real3
	};


	return Constructor;

});
