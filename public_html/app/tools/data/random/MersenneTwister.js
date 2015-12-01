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
 *	@see {@link https://github.com/boo1ean/mersenne-twister/blob/master/src/mersenne-twister.js}
 *	@see {@link https://github.com/pigulla/mersennetwister/blob/master/src/MersenneTwister.js}
 *
 *	@author Sean McCullough (banksean@gmail.com)
 *	http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
 *	email: m-mat@math.sci.hiroshima-u.ac.jp
 */
define(function(){

		//2^32
	var MAX_INT = 4294967296.,
		//period parameter
		N = 624,
		//period parameter
		M = 397,
		//most significant w-r bits
		UPPER_MASK = 0x80000000,
		//least significant r bits
		LOWER_MASK = 0x7FFFFFFF,
		MATRIX_A = 0x9908B0DF;


	/**
	 * Instantiates a new Mersenne Twister.
	 *
	 * @param {Number=} seed	The initial seed value
	 */
	var Constructor = function(seed){
		if(seed == undefined)
			seed = +(new Date());

		//the array for the state vector
		this.mt = new Array(N);
		this.initialized = false;

		this.seed(seed);
	};


	/**
	 * Initializes the state vector by using one unsigned 32-bit integer "seed", which may be zero.
	 *
	 * @param {Number} seed		The seed value
	 *
	 * @private
	 */
	var seed = function(seed){
		this.mt[0] = seed >>> 0;
		for(var i = 1; i < N; i ++){
			seed = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
			this.mt[i] = (((((seed & 0xFFFF0000) >>> 16) * 1812433253) << 16) + (seed & 0x0000FFFF) * 1812433253) + i;
			//See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier
			//In the previous versions, MSBs of the seed affect only MSBs of the array mt[]
			//2002/01/09 modified by Makoto Matsumoto
			//for WORDSIZE > 32 machines
			this.mt[i] >>>= 0;
		}
		this.initialized = true;
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
			k = (N > key.length? N: key.length),
			s;
		for( ; k; k --){
			s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)

			//non linear
			this.mt[i] = (this.mt[i] ^ (((((s & 0xFFFF0000) >>> 16) * 1664525) << 16) + ((s & 0x0000FFFF) * 1664525))) + key[j] + j;
			//for WORDSIZE > 32 machines
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
			//for WORDSIZE > 32 machines
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

	/** Generates a random unsigned number on [0, 0xFFFFFFFF] interval */
	var int32 = function(){
		//mag01[x] = x * MATRIX_A  for x=0,1
		var mag01 = new Array(0x00, MATRIX_A),
			i = (this.initialized? N: N + 1),
			y, kk;

		//generate n words at one time
		if(i >= N){
			//if seed() has not been called, a default initial seed is used
			if(!this.initialized)
				this.seed(5489);

			for(kk = 0; kk < N - M; kk ++){
				y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
				this.mt[kk] = this.mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x01];
			}
			for( ; kk < N - 1; kk ++){
				y = (this.mt[kk] & UPPER_MASK) | (this.mt[kk + 1] & LOWER_MASK);
				this.mt[kk] = this.mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x01];
			}
			y = (this.mt[N - 1] & UPPER_MASK) | (this.mt[0] & LOWER_MASK);
			this.mt[N - 1] = this.mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x01];

			i = 0;
		}

		y = this.mt[i ++];

		//tempering
		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9D2C5680;
		y ^= (y << 15) & 0xEFC60000;
		y ^= (y >>> 18);
		return y >>> 0;
	};

	/** Generates a random unsigned number on [0,0x7FFFFFFF] interval */
	var int31 = function(){
		return (this.int32() >>> 1);
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

	/** Generates a random real on ]0,1[ interval */
	var real3 = function(){
		return (this.int32() + 0.5) * (1. / MAX_INT);
	};

	/** Generates a random real on [0,1[ interval with 53-bit resolution*/
	var res53 = function(){
		var a = this.int32() >>> 5,
			b = this.int32() >>> 6;
		return(a * 67108864. + b) * (1. / 9007199254740992.);
	};

	/* These real versions are due to Isaku Wada, 2002/01/09 added */


	Constructor.prototype = {
		constructor: Constructor,

		seed: seed,
		seedWithArray: seedWithArray,
		int32: int32,
		int31: int31,
		real1: real1,
		random: random,
		real3: real3,
		res53: res53
	};


	return Constructor;

});
