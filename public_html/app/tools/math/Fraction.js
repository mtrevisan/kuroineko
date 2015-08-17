/**
 * @class Fraction
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
 *
 * Array/Object form:
 *		[0 => <nominator>, 1 => <denominator>]
 *		{num => <nominator>, den => <denominator>}
 * Number form:
 *		Single number value
 * String form:
 *		123.456 - a simple double
 *		123.(456) - a double with repeating decimal places
 *		123.45(6) - a double with repeating last place
 *
 * @see https://github.com/infusion/Fraction.js/blob/master/fraction.js
 * @see https://github.com/craigsapp/RationalNumber/tree/master/lib
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		var fract = parse(arguments);

		this.sgn = fract.sgn;
		this.num = fract.num;
		this.den = fract.den;
	};

	/** Constructor with given absolute error. */
	Constructor.fromNumber = function(value, absoluteError){
		return bestRationalApproximation(value, absoluteError || 1e-14);
	};


	var parse = function(param){
		var num, den, sgn, scale;

		param = (param.length == 2? param: param[0]);
		switch(typeof param){
			case 'object':
				if(param.constructor == Constructor)
					return param;

				if('num' in param && 'den' in param){
					num = (param.sgn || 1) * param.num;
					den = param.den;
				}
				else if(param[0] !== undefined){
					num = param[0];
					den = (param[1] !== undefined? param[1]: 1);
				}
				sgn = (den? num * den: num);
				sgn = (sgn > 0? 1: (sgn < 0? -1: 0));
				num = Math.abs(num);
				den = Math.abs(den);
				break;

			case 'number':
				param = '' + param;
			case 'string':
				var m = param.match(/^(-?)([\d]+)\.?([\d]*)(?:\(([\d]*)\))?$/);
				sgn = (m[1] == '-'? -1: 1);
				var integerValue = m[2],
					decimalValue = m[3],
					repeatedDecimalValue = m[4],
					k0 = Math.pow(10, decimalValue.length),
					k1 = (repeatedDecimalValue? Math.pow(10, repeatedDecimalValue.length) - 1: 1);
				num = Number(repeatedDecimalValue? repeatedDecimalValue: 0) + k1 * (Number(integerValue) * k0 + Number(decimalValue));
				den = k0 * k1;
				if(!num)
					sgn = 0;
		}

		scale = gcd(num, den);
		return {
			sgn: sgn,
			num: num / scale,
			den: den / scale
		};
	};

	/**
	 * Compute the best rational approximation using Stern-Brocot tree.
	 *
	 * @see http://introcs.cs.princeton.edu/java/92symbolic/RationalApprox.java.html
	 *
	 * @param {Number} value
	 * @param {Number} epsilon
	 * @returns {Fraction}
	 *
	 * @private
	 */
	var bestRationalApproximation = function(value, epsilon, maxIterations){
		if(value % 1 == 0)
			return new Constructor(value, 1);

		var sgn = (value >= 0? 1: -1);
		value *= sgn;
		var scale = Math.pow(10, Math.floor(Math.log10(value) + 1));

		epsilon = (epsilon || 1e-14) * scale;
		maxIterations = maxIterations || 100000;

		var itr = 0,
			left = new Constructor(0, 1),
			right = new Constructor(1, 1),
			best = left,
			bestError = value,
			med, error;
		while(bestError > epsilon && (itr ++) < maxIterations){
			med = mediant(left, right);

			error = med.toNumber() * scale - value;
			if(error > 0)
				//update best upper bound
				right = med;
			else
				//update best lower bound
				left = med;

			error = Math.abs(error);
			if(error < bestError){
				best = med;
				bestError = error;
			}
		}
		if(itr >= maxIterations)
			return new Constructor(value);

		best.sgn *= sgn;
		best.num *= scale;
		scale = gcd(best.num, best.den);
		best.num /= scale;
		best.den /= scale;
		return best;
	};

	/**
	 * Euclidean algorithm form Greatest Common Divisor
	 *
	 * @private
	 */
	var gcd = function(a, b){
		var t;
		while(b){
			t = b;
			b = a % b;
			a = t;
		}
		return a;
	};

	/** @private */
	var mediant = function(left, right){
		return new Constructor(left.num + right.num, left.den + right.den);
	};

	var add = function(){
		var frac = parse(arguments);
		var gcd1 = gcd(this.den, frac.den);
		//NOTE: if denominators are randomly distributed, their GCD will be 1 about 61% of the time
		if(gcd1 == 1)
			//result is (n0 * d1 + n1 * d0) / (d0 * d1)
			return new Constructor(this.sgn * this.num * frac.den + frac.sgn * frac.num * this.den, this.den * frac.den);

		//NOTE: this requires 65 bits of precision
		var t = this.sgn * this.num * (frac.den / gcd1) + frac.sgn * frac.num * (this.den / gcd1);
		var gcd2 = t % gcd1;
		gcd2 = (!gcd2? gcd1: gcd(gcd2, gcd1));
		return new Constructor(t / gcd2, (this.den / gcd1) * (frac.den / gcd2));

		//NOTE: formula without overflow management
		//return new Constructor(this.sgn * this.num * frac.den + frac.sgn * frac.num * this.den, this.den * frac.den);
	};

	var sub = function(){
		var frac = parse(arguments);
		frac.sgn *= -1;
		return this.add(frac);
	};

	var mul = function(){
		var frac = parse(arguments);
		var gcd1 = gcd(this.num, frac.den);
		var gcd2 = gcd(this.den, frac.num);
		return new Constructor(this.sgn * frac.sgn * (this.num / gcd1) * (frac.num / gcd2), (this.den / gcd2) * (frac.den / gcd1));

		//NOTE: formula without overflow management
		//return new Constructor(this.sgn * frac.sgn * this.num * frac.num, this.den * frac.den);
	};

	var div = function(){
		var frac = parse(arguments);
		frac.num = frac.den + (frac.den = frac.num) - frac.num;
		return this.mul(frac);
	};

	var pow = function(k){
		return new Constructor(Math.pow(this.sgn * this.num, k), Math.pow(this.den, k));
	};

	var mod = function(){
		var frac = parse(arguments);
		if(frac.num * this.den == 0)
			return new Constructor(0, 0);

		return new Constructor(this.sgn * this.num * frac.den % this.den * frac.num, this.den * frac.den);
	};

	var integerPart = function(){
		return new Constructor(this.sgn * ((this.num / this.den) | 0), 1);
	};

	var fractionalPart = function(){
		return new Constructor(this.sgn * (this.num % this.den), this.den);
	};

	var reciprocal = function(){
		return new Constructor(this.sgn * this.den, this.num);
	};

	var isNaN = function(){
		return (!this.num && !this.den);
	};

	var isInfinity = function(){
		return (!!this.num && !this.den);
	};

	var isZero = function(){
		return !this.sgn;
	};

	var isPositive = function(){
		return (this.sgn == 1);
	};

	var abs = function(){
		return new Constructor(this.num, this.den);
	};

	var compareTo = function(){
		var frac = parse(arguments);
		return this.sub(frac).sgn;
	};

	var equals = function(){
		var frac = parse(arguments);
		return (this.sgn == frac.sgn && this.num == frac.num && this.den == frac.den);
	};

	var toNumber = function(){
		return this.sgn * this.num / this.den;
	};

	var toString = function(){
		var a = cycleLen(this.num, this.den),
			b = cycleStart(this.den, a),
			p = this.num.toString().split(''),
			q = this.den,
			//rough estimate
			lo = 10 + a + b + p.length,
			t = 0,
			j = -1,
			ret = [];
		if(this.sgn < 0)
			ret.push('-');
		for(var i = 0; i < lo; i ++){
			t *= 10;

			if(i < p.length)
				t += parseInt(p[i], 10);
			else if(i == p.length){
				ret.push('.');
				j = 0;
			}
			else
				j ++;

			if(a > 0 && j == b)
				ret.push('(');
			else if(a > 0 && j == a + b){
				ret.push(')');
				break;
			}

			if(t >= q){
				ret.push((t / q) | 0);
				t %= q;
			}
			else
				ret.push('0');
		}
		return ret.join('').replace(/^(-?)(?:0(?!\.))*(.+?)0*$/, '$1$2');
	};

	/** @private */
	var cycleLen = function(n, d){
		if(d % 2 == 0)
			return cycleLen(n, d / 2);
		if(d % 5 == 0)
			return cycleLen(n, d / 5);

		var maxExponent = Math.floor(Math.log10(Number.MAX_VALUE)),
			t;
		for(t = 1; t <= maxExponent; t ++)
			//solve 10^t == 1 (mod d) for d != 0 (mod 2, 5)
			//http://mathworld.wolfram.com/FullReptendPrime.html
			if(modpow(10, t, d) == 1)
				return t;
		return 0;
	};

	/** @private */
	var cycleStart = function(d, len){
		var maxExponent = Math.floor(Math.log10(Number.MAX_VALUE)) - len,
			s;
		for(s = 0; s < maxExponent; s ++)
			//solve 10^s == 10^(s + t) (mod d)
			if(modpow(10, s, d) == modpow(10, s + len, d))
				return s;
		return 0;
	};

	/** @private */
	var modpow = function(b, e, m){
		for(var r = 1; e > 0; b = (b * b) % m, e >>= 1)
			if(e & 1)
				r = (r * b) % m;
		return r;
	};


	Constructor.prototype = {
		constructor: Constructor,

		add: add,
		sub: sub,
		mul: mul,
		div: div,
		pow: pow,
		mod: mod,
		integerPart: integerPart,
		fractionalPart: fractionalPart,
		reciprocal: reciprocal,
		isNaN: isNaN,
		isInfinity: isInfinity,
		isZero: isZero,
		isPositive: isPositive,
		abs: abs,
		compareTo: compareTo,
		equals: equals,
		toNumber: toNumber,
		toString: toString
	};

	return Constructor;

});
