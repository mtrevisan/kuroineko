/**
 * @class ContinuedFraction
 *
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
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
 * @see {@link https://github.com/mjdominus/cf}
 * @see {@link http://www.inwap.com/pdp10/hbaker/hakmem/cf.html}
 * @see {@link http://contfrac.sourceforge.net/}
 * @see {@link http://www.tweedledum.com/rwg/cfup.htm}
 * @see {@link http://math.stackexchange.com/questions/232422/faster-arithmetic-with-finite-continued-fractions}
 * @see {@link http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=56C41F83D4DCD5F60492FDBF955AD60F?doi=10.1.1.46.9694&rep=rep1&type=pdf}
 * @see {@link http://paul-mccarthy.us/Cfrac/CF_Arithmetic.htm}
 * @see {@link https://github.com/themadcreator/gosper/blob/master/src/org/numerics/continuedfraction/GosperTermIterator.java}
 * @see {@link http://home.strw.leidenuniv.nl/~gurkan/gosper.pdf}
 * @see {@link http://scholarship.claremont.edu/cgi/viewcontent.cgi?article=1017&context=hmc_theses}
 *
 * @author Mauro Trevisan
 */
define(['tools/math/Fraction'], function(Fraction){

	var Constructor = function(){
		var cf = parse(arguments);

		this.terms = cf.terms;
	};

	/** Constructor with given absolute error. */
	Constructor.fromNumber = function(value, absoluteError){
		return computePartialQuotients(value, absoluteError || 1e-14);
	};


	var parse = function(param){
		param = param[0];
		if(param)
			switch(typeof param){
				case 'object':
					if(Array.isArray(param))
						return {terms: param};

					if(param.constructor == Constructor)
						return param;
					/* falls through */

				case 'number':
				case 'string':
					return Constructor.fromNumber(new Fraction(param));
			}
		return {terms: []};
	};


	var add = function(){
		var cf = parse(arguments);
		var terms = gosperIterator({a: 0, b: 1, c: 1, d: 0,
			e: 0, f: 0, g: 0, h: 1},
			this, cf);

		return new Constructor(terms);
	};

	var sub = function(){
		var cf = parse(arguments);
		var terms = gosperIterator({a: 0, b: 1, c: -1, d: 0,
			e: 0, f: 0, g: 0, h: 1},
			this, cf);

		return new Constructor(terms);
	};

	var mul = function(){
		var cf = parse(arguments);
		var terms = gosperIterator({a: 1, b: 0, c: 0, d: 0,
			e: 0, f: 0, g: 0, h: 1},
			this, cf);

		return new Constructor(terms);
	};

	var div = function(){
		var cf = parse(arguments);
		var terms = gosperIterator({a: 0, b: 1, c: 0, d: 0,
			e: 0, f: 0, g: 1, h: 0},
			this, cf);

		return new Constructor(terms);
	};

	//(a * x * y + b * x + c * y + d) / (e * x * y + f * x + g * y + h)
	var op = (function(){
		var cleaner = /(\s+|\*)/g,
			pre = '(?:[xy\\(]|^)([+\\-\\d\\.]+)',
			post = '(?:[\\+\\-\\)]|$)',
			xy = new RegExp(pre + 'xy' + post),
			x = new RegExp(pre + 'x' + post),
			y = new RegExp(pre + 'y' + post),
			none = new RegExp(pre + post);

		var extractCoeff = function(str, v){
			var m = str.match(v);
			return (m && m[1]? Number(m[1]): 0);
		};

		return function(){
			var funct = Array.prototype.pop.apply(arguments).replace(cleaner, ''),
				nd = funct.split('/'),
				a = extractCoeff(nd[0], xy),
				b = extractCoeff(nd[0], x),
				c = extractCoeff(nd[0], y),
				d = extractCoeff(nd[0], none),
				e = (nd[1]? extractCoeff(nd[1], xy): 0),
				f = (nd[1]? extractCoeff(nd[1], x): 0),
				g = (nd[1]? extractCoeff(nd[1], y): 0),
				h = (nd[1]? extractCoeff(nd[1], none): 1);

			var cf = parse(arguments);
			var terms = gosperIterator({a: a, b: b, c: c, d: d,
				e: e, f: f, g: g, h: h},
				this, cf);

			return new Constructor(terms);
		};
	})();

	var integerPart = function(){
		return new Constructor(this.terms.length? [this.terms[0]]: []);
	};

	var fractionalPart = function(){
		var terms = this.terms.slice();
		if(this.terms.length)
			terms[0] = 0;
		return new Constructor(terms);
	};

	var inverse = function(){
		var terms;
		if(!this.terms.length)
			terms = [0];
		else{
			terms = this.terms.slice();
			if(!terms[0])
				terms.shift();
			else if(terms[0] > 0)
				terms.unshift(0);
			else
				terms = gosperIterator({a: 0, b: 0, c: 0, d: 1,
					e: 0, f: 1, g: 0, h: 0},
					this);
		}

		return new Constructor(terms);
	};

	var isNaN = function(){
		return (this.terms && this.terms[0] == Number.NaN);
	};

	var isInfinite = function(){
		return !this.terms.length;
	};

	var isZero = function(){
		return !this.terms[0];
	};

	var isPositive = function(){
		return (this.terms[0] > 0);
	};

	var compareTo = function(){
		var cf = parse(arguments);
		var size_x = this.terms.length,
			size_y = cf.terms.length,
			k = 0,
			d;
		while(true){
			if(k == size_x && k == size_y)
				return 0;
			if(k < size_x && k == size_y)
				return 1;
			if(k == size_x && k < size_y)
				return -1;

			d = this.terms[k] - cf.terms[k];
			if(d)
				return ((k % 2? -1: 1) * d > 0? 1: -1);

			k ++;
		}
	};


	//tensor (a * x * y + b * x + c * y + d) / (e * x * y + f * x + g * y + h)
	//@see {@link http://home.strw.leidenuniv.nl/~gurkan/gosper.pdf}
	//@see {@link http://www.inwap.com/pdp10/hbaker/hakmem/cf.html}
	var gosperIterator = function(t, x, y){
		var terms = [];

		//ingest x:
		var size = x.terms.length,
			k, p;
		for(k = 0; k < size; k ++){
			p = x.terms[k];
			t = {a: p * t.a + t.c, b: p * t.b + t.d, c: t.a, d: t.b,
				e: p * t.e + t.g, f: p * t.f + t.h, g: t.e, h: t.f};
		}
		t = {a: 0, b: 0, c: t.a, d: t.b,
			e: 0, f: 0, g: t.e, h: t.f};

		if(y){
			//ingest y:
			size = y.terms.length;
			for(k = 0; k < size; k ++){
				p = y.terms[k];
				t = {a: p * t.a + t.b, b: t.a, c: p * t.c + t.d, d: t.c,
					e: p * t.e + t.f, f: t.e, g: p * t.g + t.h, h: t.g};
			}
			t = {a: 0, b: t.a, c: 0, d: t.c,
				e: 0, f: t.e, g: 0, h: t.g};
		}

		//egest z:
		if(!t.d && !t.h)
			terms.push(Number.NaN);
		else
			while(true){
				if(!t.h)
					break;

				var q = Math.floor(t.d / t.h);
				terms.push(q);
				t = {a: t.e, b: t.f, c: t.g, d: t.h,
					e: t.a - q * t.e, f: t.b - q * t.f, g: t.c - q * t.g, h: t.d - q * t.h};
			}
		return terms;
	};

	/**
	 * Returns the partial quotients <code>[a0; a1, a2, ...]</code> of the continued fraction form of <code>x</code>.
	 *
	 * @see {@link http://maths.mq.edu.au/~alf/www-centre/alfpapers/a132.pdf}
	 * @see {@link http://maths-people.anu.edu.au/~brent/pd/rpb166.pdf}
	 *
	 * @param {Number} value
	 * @param {Number} epsilon
	 * @return {ContinuedFraction}
	 *
	 * @private
	 */
	var computePartialQuotients = function(value, epsilon){
		var alpha_bar = new Fraction(value);

		var negative = (alpha_bar.sgn < 0);
		if(negative)
			//alpha_bar -= 2 * ((value - 1) | 0);
			alpha_bar = alpha_bar.sub(alpha_bar.sub(1).integerPart().mul(2));
		epsilon = epsilon || 1e-14;

		//initial values:
		var cf = new Constructor(),
			a, delta, d, tmp;
		while(true){
			a = alpha_bar.integerPart().num;

			//store partial quotient
			cf.terms.push(a);

			delta = alpha_bar.fractionalPart();
			d = delta.toNumber();
			tmp = (1 + a) * epsilon;
			if(tmp >= d || d >= 1 - tmp)
				break;

			epsilon *= alpha_bar.toNumber() / (d * (1 - epsilon));
			//calculate complete quotient
			alpha_bar = delta.inverse();
		}

		//every finite continued fraction ending with a number n > 1 has two forms: [..., n] and [..., n-1, 1], let's take the first one
		var n = cf.terms.length - 1;
		if(n > 1 && cf.terms[n] == 1){
			cf.terms.length --;
			cf.terms[n - 1] ++;
		}
		if(cf.terms.length && negative)
			cf.terms[0] *= -1;

		return cf;
	};

	/**
	 * @param {Number} epsilon
	 * @return {Number}
	 */
	var toNumber = function(epsilon){
		return this.toFraction(epsilon).toNumber();
	};

	/**
	 * Compute the continued fraction at the value <code>x</code>.
	 * <p>
	 * The implementation of this method is based on equations 14-17 of:
	 * <ul>
	 *		<li>Eric W. Weisstein. "Continued Fraction." From MathWorld--A Wolfram Web Resource. <a target="_blank" href="http://mathworld.wolfram.com/ContinuedFraction.html">http://mathworld.wolfram.com/ContinuedFraction.html</a></li>
	 * </ul>
	 * The recurrence relationship defined in those equations can result in very large intermediate results which can result in numerical overflow.<p>
	 * As a means to combat these overflow conditions, the intermediate results are scaled whenever they threaten to become numerically unstable.
	 *
	 * @param {Number} epsilon
	 * @return {Fraction}
	 */
	var toFraction = function(epsilon){
		epsilon = epsilon || 1e-14;

		var p0 = 1, p1 = this.terms[0],
			q0 = 0, q1 = 1,
			c = new Fraction(p1, q1),
			n = 0,
			relativeError = Number.MAX_VALUE;
		while(relativeError > epsilon){
			n ++;
			var a = this.terms[n];
			if(!a)
				break;

			var p2 = a * p1 + p0;
			var q2 = a * q1 + q0;

			//need to scale: try successive powers of the larger of a up to 5th power; throw ConvergenceException if one or both of p2, q2 still overflow
			var infinite = false;
			if(!isFinite(p2) || !isFinite(q2)){
				var inverseScaleFactor = 1,
					lastInverseScaleFactor = 1,
					maxPower = 5,
					scale = Math.max(a, 1),
					tmp;
				if(scale <= 0)
					throw 'Continued fraction convergents diverged to +/- infinity for value ' + this.terms;

				infinite = true;
				for(var i = 0; infinite && i < maxPower; i ++){
					lastInverseScaleFactor = inverseScaleFactor;
					inverseScaleFactor /= scale;
					if(a > 1){
						tmp = inverseScaleFactor;
						p2 = p1 * lastInverseScaleFactor + tmp * p0;
						q2 = q1 * lastInverseScaleFactor + tmp * q0;
					}
					else{
						tmp = a * inverseScaleFactor;
						p2 = tmp * p1 + p0 * lastInverseScaleFactor;
						q2 = tmp * q1 + q0 * lastInverseScaleFactor;
					}
					infinite = (!isFinite(p2) || !isFinite(q2));
				}
			}
			if(infinite)
				//scaling failed
				throw 'Continued fraction convergents diverged to +/- infinity for value ' + this.terms;

			var r = p2 / q2;
			if(isNaN(r))
				throw 'Continued fraction diverged to NaN for value ' + this.terms;
			relativeError = Math.abs(r / c.toNumber() - 1);

			//prepare for next iteration
			c = new Fraction(p2, q2);
			p0 = p1;
			p1 = p2;
			q0 = q1;
			q1 = q2;
		}

		return c;
	};

	Constructor.prototype = {
		constructor: Constructor,

		add: add,
		sub: sub,
		mul: mul,
		div: div,
		op: op,
		integerPart: integerPart,
		fractionalPart: fractionalPart,
		inverse: inverse,
		isNaN: isNaN,
		isInfinite: isInfinite,
		isZero: isZero,
		isPositive: isPositive,
		compareTo: compareTo,
		toFraction: toFraction,
		toNumber: toNumber
	};

	return Constructor;

});
