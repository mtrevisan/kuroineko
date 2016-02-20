/**
 * @class Fraction
 *
 * It is implemented as two integers which store the numerator and denominator as well as a variable to keep track of the sign of the rational number.<p>
 * You can pass a fraction in different formats. Either as array, as object, as double, as integer, or as string.<p>
 * Any function as well as the constructor parses its input and reduce it to the smallest term.
 * <p>
 * Array/Object form:<p>
 * <ul>
 *		<li>[0 => <nominator>, 1 => <denominator>]</li>
 *		<li>{(sgn => <sign>), num => <nominator>, den => <denominator>}</li>
 * </ul>
 * Number form:<p>
 * <ul>
 *		<li>Single number value</li>
 * </ul>
 * String form:<p>
 * <ul>
 *		<li>123.456 - a simple double</li>
 *		<li>123.(456) - a double with repeating decimal places</li>
 *		<li>123.45(6) - a double with repeating last place</li>
 *		<li>123/456 - a fraction</li>
 * </ul>
 *
 * @see {@link https://github.com/infusion/Fraction.js/blob/master/fraction.js}
 * @see {@link https://github.com/craigsapp/RationalNumber/tree/master/lib}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/Assert'], function(Assert){

	/** @constant */
	var MAX_EXPONENT = Math.floor(Math.log10(Number.MAX_VALUE));


	var Constructor = function(){
		var frac = parse(arguments);

		this.sgn = frac.sgn;
		this.num = frac.num;
		this.den = frac.den;
	};

	/**
	 * Constructor with given absolute error.<p>
	 * The method is really precise, but too large exact numbers, like 1234567.9991829 will result in a wrong approximation.<p>
	 * If you want to keep the number as it is, convert it to a string, as the string parser will not perform any further observations.
	 */
	Constructor.fromNumber = function(value, absoluteError){
		return bestRationalApproximation(value, absoluteError || 1e-14);
	};


	/** @private */
	var parse = function(){
		var args = Array.prototype.slice.call(arguments[0]);
		if(args.length == 1)
			args = args[0];

		switch(typeof args){
			case 'object':
				return parseObject(args);

			case 'number':
				args = '' + args;
				/* falls through */

			case 'string':
				return parseString(args);
		}
	};

	/** @private */
	var parseObject = function(obj){
		if(obj.constructor == Constructor)
			return obj;

		var sgn, num, den;
		if('num' in obj && 'den' in obj){
			num = (obj.sgn || 1) * obj.num;
			den = obj.den;
		}
		else if(obj[0] !== undefined){
			num = obj[0];
			den = (obj[1] !== undefined? obj[1]: 1);
		}

		sgn = Math.sign(den? num * den: num);
		num = Math.abs(num);
		den = Math.abs(den);

		return reduce({
			sgn: sgn,
			num: num,
			den: den
		});
	};

	/** @private */
	var parseString = function(str){
		var m = str.match(/^([+-]?)([\d]+)\.?([\d]*)(?:\(([\d]*)\))?$/),
			sgn, num, den;
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
			m = str.match(/^([+-]?)([\d]+)\/([\d]+)$/);

			num = Number(m[2]);
			den = Number(m[3]);
			sgn = (m[1]? -1: 1) * Math.sign(den? num * den: num);
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
	 * @see {@link http://introcs.cs.princeton.edu/java/92symbolic/RationalApprox.java.html}
	 *
	 * @param {Number} value
	 * @param {Number} epsilon
	 * @return {Fraction}
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

	/** Calculates the Greatest Common Divisor (gcd(a / b, c / d) = gcd(a, c) / lcm(b, d)) */
	var gcd = function(){
		var frac = parse(arguments);
		return new Constructor(this.sgn * frac.sgn * _gcd(this.num, frac.num), _lcm(this.den, frac.den));
	};

	/** Calculates the least common multiple (lcm(a / b, c / d) = lcm(a, c) / gcd(b, d)) */
	var lcm = function(){
		var frac = parse(arguments);
		return new Constructor(this.sgn * frac.sgn * _lcm(this.num, frac.num), _gcd(this.den, frac.den));
	};

	/**
	 * Euclidean algorithm to calculate the Greatest Common Divisor (GCD)
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
	 *
	 * @private
	 */
	var _gcd = function(a, b){
		if(b > a)
			return _gcd(b, a);

		while(b)
			a = b + (b = a % b, 0);
		return a;
	};

	/**
	 * Euclidean algorithm to calculate the least common multiple (lcm)
	 *
	 * @param {Number} a
	 * @param {Number} b
	 * @return {Number}
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
	var clone = function(){
		return new Constructor(this.sgn * this.num, this.den);
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
		gcd2 = (gcd2? _gcd(gcd2, gcd1): gcd1);
		return new Constructor(t / gcd2, (this.den / gcd1) * (frac.den / gcd2));

		//NOTE: formula without overflow management
		//return new Constructor(this.sgn * this.num * frac.den + frac.sgn * frac.num * this.den, this.den * frac.den);
	};

	var sub = function(){
		var frac = parse(arguments);
		return this.add(new Constructor(-frac.sgn * frac.num, frac.den));
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
		return this.mul(new Constructor(frac.sgn * frac.den, frac.num));
	};

	/**
	 * Returns the power of the actual number, raised to an integer exponent.<p>
	 * Note: Rational exponents are planned, but would slow down the function a lot, because of a kinda slow root finding algorithm,
	 * whether the result will become irrational. So for now, only integer exponents are implemented.
	 *
	 * @param {Integer} k
	 * @return {Fraction}
	 */
	var pow = function(k){
		if(k < 0)
			return new Constructor(Math.pow(this.sgn * this.den, -k), Math.pow(this.num, -k));
		return new Constructor(Math.pow(this.sgn * this.num, k), Math.pow(this.den, k));
	};

	/**
	 * Returns the modulus (rest of the division) of the actual object and the given fraction.
	 *
	 * @param {Fraction}
	 * @return {Fraction}
	 */
	var mod = function(){
		var frac = parse(arguments);
		if(frac.num * this.den == 0)
			return new Constructor(0, 0);

		return new Constructor(this.sgn * (this.num * frac.den) % (this.den * frac.num), this.den * frac.den);
	};

	var integerPart = function(){
		return new Constructor(this.sgn * toInteger(this.num / this.den), 1);
	};

	var fractionalPart = function(){
		return new Constructor(this.sgn * (this.num % this.den), this.den);
	};

	/**
	 * Returns the multiplicative inverse of the actual number in order to get the reciprocal.
	 *
	 * @param {Fraction}
	 * @return {Fraction}
	 */
	var inverse = function(){
		return new Constructor(this.sgn * this.den, this.num);
	};

	/**
	 * Returns the additive inverse of the actual number.
	 *
	 * @param {Fraction}
	 * @return {Fraction}
	 */
	var negate = function(){
		return new Constructor(-this.sgn * this.num, this.den);
	};

	var isNaN = function(){
		return (!this.num && !this.den);
	};

	var isInfinite = function(){
		return (!!this.num && !this.den);
	};

	var isZero = function(){
		return !this.sgn;
	};

	var isPositive = function(){
		return (this.sgn == 1);
	};

	var isNegative = function(){
		return (this.sgn == -1);
	};

	var isInteger = function(){
		return (this.den == 1);
	};

	var isDivisibleBy = function(){
		var frac = parse(arguments);
		return !(!(this.den * frac.num) || (this.num * frac.den) % (this.den * frac.num));
	};

	var abs = function(){
		return new Constructor(this.num, this.den);
	};

	var compareTo = function(){
		var frac = parse(arguments);
		return this.clone().sub(frac).sgn;
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
	 * @return {String}
	 */
	var toString = function(){
		if(this.isInfinite())
			return (this.isPositive()? Number.POSITIVE_INFINITY: Number.NEGATIVE_INFINITY).toString();
		if(this.isNaN())
			return Number.NaN.toString();

		var a = cycleLen(this.den),
			b = cycleStart(this.den, a),
			p = this.num.toString().split(''),
			//rough estimate
			size = 10 + a + b + p.length,
			t = 0,
			j = -1,
			ret = [this.sgn < 0? '-': ''],
			i;
		for(i = 0; i < size; i ++, t *= 10){
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

			if(t >= this.den){
				ret.push(toInteger(t / this.den));
				t %= this.den;
			}
			else
				ret.push('0');
		}
		return ret.join('').replace(/^(-?)(?:0(?!\.))*(.+?)0*$/, '$1$2');
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

	/** @private */
	var cycleLen = function(d){
		while(d % 2 == 0)
			d /= 2;
		while(d % 5 == 0)
			d /= 5;

		//catch cyclic numbers
		if(d > 1){
			var rem = 10 % d,
				t;
			//solve 10^t == 1 (mod d) for d != 0 (mod 2, 5)
			//http://mathworld.wolfram.com/FullReptendPrime.html
			//for the cap on t we could make use of Fermat's little theorem: 10^(d-1) = 1 (mod d), where d is a prime number
			for(t = 1; rem > 1 && t < d; t ++)
				rem = (rem * 10) % d;
			return t;
		}
		return 0;
	};

	/** @private */
	var cycleStart = function(d, len){
		if(len > 0){
			var rem1 = 1,
				rem2 = modularPow(10, len, d),
				s;
			for(s = 0; s < MAX_EXPONENT; s ++){
				//solve 10^s == 10^(s + t) (mod d)
				if(rem1 == rem2)
					return s;

				rem1 = (rem1 * 10) % d;
				rem2 = (rem2 * 10) % d;
			}
		}
		return 0;
	};

	/** @private */
	var modularPow = function(base, exponent, modulus){
		base %= modulus;
		for(var r = 1; exponent > 0; base = (base * base) % modulus, exponent >>= 1)
			if(exponent & 1)
				r = (r * base) % modulus;
		return r;
	};

	/**
	 * Generates an exact LaTeX representation of the actual object.
	 *
	 * @return {String}
	 */
	var toLaTeX = function(){
		if(!this.sgn)
			return '0';
		if(this.den == 1)
			return (this.sgn * this.num).toString();
		return (this.sgn < 0? '-': '') + '\\frac{' + this.num + '}{' + this.den + '}';
	};


	Constructor.prototype = {
		constructor: Constructor,

		gcd: gcd,
		lcm: lcm,
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
		negate: negate,
		isNaN: isNaN,
		isInfinite: isInfinite,
		isZero: isZero,
		isPositive: isPositive,
		isNegative: isNegative,
		isInteger: isInteger,
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
