/*
 I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
 so it's better encapsulated. Now you can have multiple random number generators
 and they won't stomp all over eachother's state.

 If you want to use this as a substitute for Math.random(), use the random()
 method like so:

 var m = new MersenneTwister();
 var randomNumber = m.random();

 You can also call the other genrand_{foo}() methods on the instance.

 If you want to use a specific seed in order to get a repeatable random
 sequence, pass an integer into the constructor:

 var m = new MersenneTwister(123);

 and that will always produce the same random sequence.

 Sean McCullough (banksean@gmail.com)

 http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
 email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
 */

var MersenneTwister = function(seed){
	if(seed == undefined)
		seed = new Date().getTime();

	//period parameters
	this.N = 624;
	this.M = 397;
	//constant vector a
	this.MATRIX_A = 0x9908b0df;
	//most significant w-r bits
	this.UPPER_MASK = 0x80000000;
	//least significant r bits
	this.LOWER_MASK = 0x7fffffff;

	//the array for the state vector
	this.mt = new Array(this.N);
	//mti==N+1 means mt[N] is not initialized
	this.mti = this.N + 1;

	this.init_genrand(seed);
}

/** Initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s){
	this.mt[0] = s >>> 0;
	for(this.mti = 1; this.mti < this.N; this.mti++){
		var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect   */
		/* only MSBs of the array mt[].                        */
		/* 2002/01/09 modified by Makoto Matsumoto             */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
}

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length){
	var i, j, k;
	this.init_genrand(19650218);
	i = 1;
	j = 0;
	k = (this.N > key_length ? this.N : key_length);
	for( ; k; k --){
		var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
		//non linear
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j;
		//for WORDSIZE > 32 machines
		this.mt[i] >>>= 0;
		i ++;
		j ++;
		if(i >= this.N){
			this.mt[0] = this.mt[this.N - 1];
			i = 1;
		}
		if(j >= key_length)
			j = 0;
	}
	for(k = this.N - 1; k; k--){
		var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
		//non linear
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
		//for WORDSIZE > 32 machines
		this.mt[i] >>>= 0;
		i++;
		if(i >= this.N){
			this.mt[0] = this.mt[this.N - 1];
			i = 1;
		}
	}

	//MSB is 1; assuring non-zero initial array
	this.mt[0] = 0x80000000;
}

/** Generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function(){
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A  for x=0,1 */

	if(this.mti >= this.N){ /* generate N words at one time */
		var kk;

		//if init_genrand() has not been called, a default initial seed is used
		if(this.mti == this.N + 1)
			this.init_genrand(5489);

		for(kk = 0; kk < this.N - this.M; kk ++){
			y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
			this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		for( ; kk < this.N - 1; kk ++){
			y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
			this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
		this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti ++];

	//tempering
	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return y >>> 0;
}

/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function(){
	return (this.genrand_int32() >>> 1);
}

/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function(){
	return this.genrand_int32() * (1. / 4294967295.);
	/* divided by 2^32-1 */
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function(){
	return this.genrand_int32() * (1. / 4294967296.);
	/* divided by 2^32 */
}

/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function(){
	return (this.genrand_int32() + 0.5) * (1. / 4294967296.);
	/* divided by 2^32 */
}

/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function(){
	var a = this.genrand_int32() >>> 5,
		b = this.genrand_int32() >>> 6;
	return(a * 67108864.0 + b) * (1. / 9007199254740992.);
}

/* These real versions are due to Isaku Wada, 2002/01/09 added */
