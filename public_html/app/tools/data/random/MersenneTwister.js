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
 *	@author Sean McCullough (banksean@gmail.com)
 *	http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
 *	email: m-mat@math.sci.hiroshima-u.ac.jp
 */
define(function(){

	var Constructor = function(seed){
		if(seed == undefined)
			seed = +(new Date());

		//period parameters
		this.n = 624;
		this.m = 397;
		//constant vector a
		this.matrixA = 0x9908B0DF;
		//most significant w-r bits
		this.upperMask = 0x80000000;
		//least significant r bits
		this.lowerMask = 0x7FFFFFFF;

		//the array for the state vector
		this.mt = new Array(this.n);
		this.initialized = false;

		this.init_genrand(seed);
	};


	/** Initializes mt[N] with a seed */
	var init_genrand = function(s){
		this.mt[0] = s >>> 0;
		for(var i = 1; i < this.n; i ++){
			var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
			this.mt[i] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + i;
			//See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier
			//In the previous versions, MSBs of the seed affect only MSBs of the array mt[]
			//2002/01/09 modified by Makoto Matsumoto
			this.mt[i] >>>= 0;
			//for >32 bit machines
		}
		this.initialized = true;
	};

	/**
	 * Initialize by an array with array-length
	 * slight change for C++, 2004/2/26
	 *
	 * @param {Array} init_key			is the array for initializing keys
	 * @param {Integer} key_length	is its length
	 */
	var init_by_array = function(init_key, key_length){
		var i, j, k;
		this.init_genrand(19650218);
		i = 1;
		j = 0;
		k = (this.n > key_length ? this.n : key_length);
		for( ; k; k --){
			var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
			//non linear
			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j;
			//for WORDSIZE > 32 machines
			this.mt[i] >>>= 0;
			i ++;
			j ++;
			if(i >= this.n){
				this.mt[0] = this.mt[this.n - 1];
				i = 1;
			}
			if(j >= key_length)
				j = 0;
		}
		for(k = this.n - 1; k; k--){
			var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
			//non linear
			this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
			//for WORDSIZE > 32 machines
			this.mt[i] >>>= 0;
			i++;
			if(i >= this.n){
				this.mt[0] = this.mt[this.n - 1];
				i = 1;
			}
		}

		//MSB is 1; assuring non-zero initial array
		this.mt[0] = 0x80000000;
	};

	/** Generates a random number on [0, 0xFFFFFFFF]-interval */
	var genrand_int32 = function(){
		var y;
		var mag01 = new Array(0x00, this.matrixA);
		//mag01[x] = x * matrixA  for x=0,1

		//generate n words at one time
		var i = (this.initialized? this.n: this.n + 1);
		if(i >= this.n){
			var kk;

			//if init_genrand() has not been called, a default initial seed is used
			if(!this.initialized)
				this.init_genrand(5489);

			for(kk = 0; kk < this.n - this.m; kk ++){
				y = (this.mt[kk] & this.upperMask) | (this.mt[kk + 1] & this.lowerMask);
				this.mt[kk] = this.mt[kk + this.m] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			for( ; kk < this.n - 1; kk ++){
				y = (this.mt[kk] & this.upperMask) | (this.mt[kk + 1] & this.lowerMask);
				this.mt[kk] = this.mt[kk + (this.m - this.n)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			y = (this.mt[this.n - 1] & this.upperMask) | (this.mt[0] & this.lowerMask);
			this.mt[this.n - 1] = this.mt[this.m - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

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

	/** Generates a random number on [0,0x7fffffff]-interval */
	var genrand_int31 = function(){
		return (this.genrand_int32() >>> 1);
	};

	/** Generates a random number on [0,1]-real-interval */
	var genrand_real1 = function(){
		//divided by 2^32-1
		return this.genrand_int32() * (1. / 4294967295.);
	};

	/** Generates a random number on [0,1)-real-interval */
	var random = function(){
		//divided by 2^32
		return this.genrand_int32() * (1. / 4294967296.);
	};

	/** Generates a random number on (0,1)-real-interval */
	var genrand_real3 = function(){
		//divided by 2^32
		return (this.genrand_int32() + 0.5) * (1. / 4294967296.);
	};

	/** Generates a random number on [0,1) with 53-bit resolution*/
	var genrand_res53 = function(){
		var a = this.genrand_int32() >>> 5,
			b = this.genrand_int32() >>> 6;
		return(a * 67108864.0 + b) * (1. / 9007199254740992.);
	};

	/* These real versions are due to Isaku Wada, 2002/01/09 added */


	Constructor.prototype = {
		constructor: Constructor,

		init_genrand: init_genrand,
		init_by_array: init_by_array,
		genrand_int32: genrand_int32,
		genrand_int31: genrand_int31,
		genrand_real1: genrand_real1,
		random: random,
		genrand_real3: genrand_real3,
		genrand_res53: genrand_res53
	};


	return Constructor;

});
