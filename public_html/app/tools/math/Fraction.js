/**
 * @class Fraction
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.<p>
 * Any function as well as the constructor parses its input and reduce it to the smallest term.
 * <p>
 * Array/Object form:
 *		[0 => <nominator>, 1 => <denominator>]
 *		{(sgn => sign), num => <nominator>, den => <denominator>}
 * Number form:
 *		Single number value
 * String form:
 *		123.456 - a simple double
 *		123.(456) - a double with repeating decimal places
 *		123.45(6) - a double with repeating last place
 *		123/456 - a fraction
 *	<p>
 * @see https://github.com/infusion/Fraction.js/blob/master/fraction.js
 * @see https://github.com/craigsapp/RationalNumber/tree/master/lib
 *
 * @author Mauro Trevisan
 */
define(function(){

	var MAX_EXPONENT = Math.floor(Math.log10(Number.MAX_VALUE));


	var Constructor = function(){
		var frac = parse(arguments);

		this.sgn = frac.sgn;
		this.num = frac.num;
		this.den = frac.den;
	};

	/**
	 * Constructor with given absolute error.<p>
	 * The method is really precise, but too large exact numbers, like 1234567.9991829 will result in a wrong approximation.
	 * If you want to keep the number as it is, convert it to a string, as the string parser will not perform any further observations.
	 */
	Constructor.fromNumber = function(value, absoluteError){
		return bestRationalApproximation(value, absoluteError || 1e-14);
	};


	/** @private */
	var parse = function(param){
		var num, den, sgn;

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
				sgn = Math.sign(den? num * den: num);
				num = Math.abs(num);
				den = Math.abs(den);
				break;

			case 'number':
				param = '' + param;
			case 'string':
				var m = param.match(/^(-?)([\d]+)\.?([\d]*)(?:\(([\d]*)\))?$/);
				if(m){
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
				else{
					m = param.match(/^(-?[\d]+)\/([\d]+)$/);
					num = Number(m[1]);
					den = Number(m[2]);
					sgn = Math.sign(den? num * den: num);
				}
		}

		return reduce({
			sgn: sgn,
			num: num,
			den: den
		});
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

		var sgn = Math.sign(value);
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
		return reduce(best);
	};

	/**
	 * Destructively normalize the fraction to its smallest representation.
	 *
	 * @private
	 */
	var reduce = function(frac){
		var scale = _gcd(frac.num, frac.den);
		frac.num /= scale;
		frac.den /= scale;
		return frac;
	};

	/** Euclidean algorithm form Greatest Common Divisor (gcd(a / b, c / d) = gcd(a, c) / lcm(b, d)) */
	var gcd = function(){
		var frac = parse(arguments);
		return new Constructor(this.sgn * frac.sgn * _gcd(this.num, frac.num), _lcm(this.den, frac.den));
	};

	/**
	 * Euclidean algorithm form Greatest Common Divisor
	 *
	 * @private
	 */
	var _gcd = function(a, b){
		while(b)
			a = b + (b = a % b, 0);
		return a;
	};

	/**
	 * Euclidean algorithm form least common multiple
	 *
	 * @private
	 */
	var _lcm = function(a, b){
		return (a && b? (Math.abs(a) / _gcd(a, b)) * Math.abs(b): 0);
	};

	/** @private */
	var mediant = function(left, right){
		return new Constructor(left.num + right.num, left.den + right.den);
	};

	/** Creates a copy of the actual Fraction object. */
	var clone = function(frac){
		return new Constructor(frac.sgn * frac.num, frac.den);
	};

	var add = function(){
		var frac = parse(arguments);
		var gcd1 = _gcd(this.den, frac.den);
		//NOTE: if denominators are randomly distributed, their GCD will be 1 about 61% of the time
		if(gcd1 == 1)
			//result is (n0 * d1 + n1 * d0) / (d0 * d1)
			return new Constructor(this.sgn * this.num * frac.den + frac.sgn * frac.num * this.den, this.den * frac.den);

		//NOTE: this requires 65 bits of precision
		var t = this.sgn * this.num * (frac.den / gcd1) + frac.sgn * frac.num * (this.den / gcd1);
		var gcd2 = t % gcd1;
		gcd2 = (!gcd2? gcd1: _gcd(gcd2, gcd1));
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
		var gcd1 = _gcd(this.num, frac.den);
		var gcd2 = _gcd(this.den, frac.num);
		return new Constructor(this.sgn * frac.sgn * (this.num / gcd1) * (frac.num / gcd2), (this.den / gcd2) * (frac.den / gcd1));

		//NOTE: formula without overflow management
		//return new Constructor(this.sgn * frac.sgn * this.num * frac.num, this.den * frac.den);
	};

	var div = function(){
		var frac = parse(arguments);
		frac.num = frac.den + (frac.den = frac.num) - frac.num;
		return this.mul(frac);
	};

	/**
	 * Returns the power of the actual number, raised to an integer exponent.<p>
	 * Note: Rational exponents are planned, but would slow down the function a lot, because of a kinda slow root finding algorithm,
	 * whether the result will become irrational. So for now, only integer exponents are implemented.
	 *
	 * @param {Integer} k
	 * @returns {Fraction}
	 */
	var pow = function(k){
		if(k < 0)
			return new Constructor(Math.pow(this.sgn * this.den, -k), Math.pow(this.num, -k));
		return new Constructor(Math.pow(this.sgn * this.num, k), Math.pow(this.den, k));
	};

	/**
	 * Returns the modulus (rest of the division) of the actual object and the given fraction.
	 *
	 * @params {Fraction}
	 * @returns {Fraction}
	 */
	var mod = function(){
		var frac = parse(arguments);
		if(frac.num * this.den == 0)
			return new Constructor(0, 0);

		return new Constructor(this.sgn * (this.num * frac.den) % (this.den * frac.num), this.den * frac.den);
	};

	var integerPart = function(){
		return new Constructor(this.sgn * ((this.num / this.den) | 0), 1);
	};

	var fractionalPart = function(){
		return new Constructor(this.sgn * (this.num % this.den), this.den);
	};

	/**
	 * Returns the multiplicative inverse of the actual number in order to get the reciprocal.
	 *
	 * @params {Fraction}
	 * @returns {Fraction}
	 */
	var inverse = function(){
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

	var isDivisibleBy = function(){
		var frac = parse(arguments);
		return (!!(this.den * frac.num) && !((this.num * frac.den) % (this.den * frac.num)));
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

	/**
	 * Generates an exact string representation of the actual object, including repeating decimal places of any length.
	 *
	 * @returns {String}
	 */
	var toString = function(){
		if(this.isInfinity())
			return (this.isPositive()? '+Inf': '-Inf');
		if(this.isNaN())
			return 'NaN';

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
		for(var i = 0; i < lo; i ++, t *= 10){
			if(i < p.length)
				t += Number(p[i]);
			else if(i == p.length){
				ret.push('.');
				j = 0;
			}
			else
				j ++;

			//if we have a repeating part
			if(a > 0){
				if(j == b)
					ret.push('(');
				else if(j == a + b){
					ret.push(')');
					break;
				}
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
		while(d % 2 == 0)
			d /= 2;
		while(d % 5 == 0)
			d /= 5;

		var maxExponent = d - 1,
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
		var s;
		for(s = 0; s < MAX_EXPONENT; s ++)
			//solve 10^s == 10^(s + t) (mod d)
			if(modpow(10, s, d) == modpow(10, s + len, d))
				return s;
		return 0;
	};

	/** @private */
	var modpow = function(base, e, m){
		for(var r = 1; e > 0; base = (base * base) % m, e >>= 1)
			if(e & 1)
				r = (r * base) % m;
		return r;
	};

	/**
	 * Generates an exact LaTeX representation of the actual object.
	 *
	 * @returns {String}
	 */
	var toLaTeX = function(){
		if(!this.sgn)
			return '0';
		else if(this.den == 1)
			return (this.sgn * this.num).toString();
		return (this.sgn == -1? '-': '') + '\\frac{' + this.num + '}{' + this.den + '}';
	};


	Constructor.prototype = {
		constructor: Constructor,

		gcd: gcd,
		clone: clone,
		add: add,
		sub: sub,
		mul: mul,
		div: div,
		pow: pow,
		mod: mod,
		integerPart: integerPart,
		fractionalPart: fractionalPart,
		inverse: inverse,
		isNaN: isNaN,
		isInfinity: isInfinity,
		isZero: isZero,
		isPositive: isPositive,
		isDivisibleBy: isDivisibleBy,
		abs: abs,
		compareTo: compareTo,
		equals: equals,
		toNumber: toNumber,
		toString: toString,
		toLaTeX: toLaTeX
	};

	return Constructor;

});
