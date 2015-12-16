/**
 * @class StringDistance
 *
 * @see {@link http://www.cs.helsinki.fi/u/ukkonen/InfCont85.PDF}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/**
	 * Compute the Levenshtein distance between two strings.<p>
	 * Time: <code>O(p * min(n, m))</code>, where <code>p</code> is the edit distance, Space: <code>O(min(n, m))</code>
	 *
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Number} test		Number to test the distance to (in this case the return type is a boolean).
	 * @param {Object} options	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5, match: 0, isMatchingFn: function(){...}}</code>
	 * @return {Number/Boolean}
	 */
	var levenshteinDistance2 = function(a, b, test, options){
		//base cases
		if(a == b)
			return 0;
		if(!a.length)
			return b.length;
		if(!b.length)
			return a.length;

		var n = a.length - 1,
			m = b.length - 1,
			diff = Math.abs(m - n),
			//array used to store the rows of the diagonal band, undefined/NaN is considered as +inf
			r_size, r = [],
			p, k, k_prime, k_inf = 0,
			//first value of r which is <= threshold
			//p_inf = 1,
			//last value of r which is <= threshold
			//p_sup = diff + 2 * Math.floor((threshold / delta - diff) / 2) + 1,
			i, j;

		options = options || {};
		var costs = applyIfNotNumeric(options.costs || {}, {insertion: 1, deletion: 1, modification: 0.5, match: 0}),
			isMatchingFn = options.isMatchingFn || isMatchingFnDefault;

		var costFn = function(from, to){
			if(to === undefined)
				return Number.POSITIVE_INFINITY;
			return (!from? costs.insertion:
				(!to? costs.deletion:
				(isMatchingFn(from, to)? 0: costs.modification)));
		};

		test = Number(test);

		var delta = Math.min(costs.insertion, costs.deletion),
			threshold = (isNaN(test)? (diff + 1) * delta: test);
		r[-1] = Number.POSITIVE_INFINITY;

		while(true){
			p = threshold / delta - diff;
			if(p >= 0){
				p = Math.floor(p / 2);
				//index of starting diagonal
				k = Math.min(m - n, 0) - p;
				k_prime = k;
				//number of diagonals
				r_size = diff + 2 * p;
				//initialize non-visited cells with +infinity
				while(k_inf <= r_size + 1)
					r[k_inf ++] = Number.POSITIVE_INFINITY;

				for(i = 0; i <= n; i ++, k ++)
					/*for(j = Math.max(0, p_inf - 1); j <= p_sup; j ++){
						r[j] = (i == 0 && j + k == 0? 0:
							Math.min(r[j] + costFn(a[i - 1], b[j + k - 1]), r[j + 1] + costFn(a[i - 1], null), r[j - 1] + costFn(null, b[j + k - 1])));
						if(j > p_sup && r[j] <= threshold)
							p_sup = j;
					}*/
					for(j = 0; j <= r_size; j ++)
						r[j] = (i == 0 && j + k == 0? 0:
							Math.min(
								r[j] + costFn(a[i - 1], b[j + k - 1]),
								r[j + 1] + costFn(a[i - 1], null),
								r[j - 1] + costFn(null, b[j + k - 1])
							));
				if(r[r_size + k_prime] <= threshold)
					break;
			}

			if(!isNaN(test))
				break;

			threshold *= 2;
		}
		return (isNaN(test)? r[r_size + k_prime]: (r[r_size + k_prime] <= test));
	};

	/**
	 * Compute the Levenshtein distance between two strings.<p>
	 * Time: <code>O(p * min(n, m))</code>, where <code>p</code> is the edit distance, Space: <code>O(min(n, m))</code>
	 *
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Number} test		Number to test the distance to (in this case the return type is a boolean).
	 * @param {Object} options	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5, match: 0, isMatchingFn: function(){...}}</code>
	 * @return {Number/Boolean}
	 */
	var levenshteinDistance = function(a, b, test, options){
		var n = a.length,
			m = b.length;
		if(m < n)
			return levenshteinDistance(b, a, test, options);

		//base cases
		if(a == b)
			return 0;
		if(!a.length)
			return b.length;
		if(!b.length)
			return a.length;

		test = Number(test);

		options = options || {};
		var costs = applyIfNotNumeric(options.costs || {}, {insertion: 1, deletion: 2, modification: 0.5, match: 0}),
			isMatchingFn = options.isMatchingFn || isMatchingFnDefault;

		var costFn = function(from, to){
			if(!from && !to)
				return Number.POSITIVE_INFINITY;
			return (!from? costs.insertion:
				(!to? costs.deletion:
				(isMatchingFn(from, to)? costs.match: costs.modification)));
		};

		var diff = m - n,
			delta = Math.min(costs.insertion, costs.deletion),
			threshold = (isNaN(test)? (diff + 1) * delta: test),
			r = [],
			p, r_size, k, k_prime, i, j;
		while(true){
			if(threshold >= diff * delta){
				p = Math.floor((threshold / delta - diff) * 0.5);
				k = k_prime = -p - diff;
				r_size = diff + 2 * p;
				for(i = 0; i <= m; i ++, k ++)
					for(j = 0; j <= r_size; j ++)
						r[j] = (!i && i == j + k? 0:
							Math.min(
								(ObjectHelper.isDefined(r[j])? r[j]: Number.POSITIVE_INFINITY) + costFn(a[i], b[j + k]),
								(ObjectHelper.isDefined(r[j + 1])? r[j + 1]: Number.POSITIVE_INFINITY) + costFn(a[i], null),
								(ObjectHelper.isDefined(r[j - 1])? r[j - 1]: Number.POSITIVE_INFINITY) + costFn(null, b[j + k])
							)
						);

				if(!isNaN(test) || r[r_size + k_prime] <= threshold)
					break;
			}

			threshold *= 2;
		}/**/
		return (isNaN(test)? r[r_size + k_prime]: (r[r_size + k_prime] <= test));/**/
return 0;
	};

	/**
	 * Compute the Levenshtein distance between two strings.<p>
	 * Time: <code>O(p * min(n, m))</code>, where <code>p</code> is the edit distance, Space: <code>O(min(n, m))</code>
	 *
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Number} test		Number to test the distance to (in this case the return type is a boolean).
	 * @param {Object} options	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5, match: 0, isMatchingFn: function(){...}}</code>
	 * @return {Number/Boolean}
	 */
	var levenshteinDistance2 = function(a, b, test, options){
		var n = a.length,
			m = b.length;
		if(n < m)
			return levenshteinDistance(b, a, test, options);

		//base cases
		if(a == b)
			return 0;
		if(!n)
			return m;
		if(!m)
			return n;

		test = Number(test);

		options = options || {};
		var costs = applyIfNotNumeric(options.costs || {}, {insertion: 1, deletion: 2, modification: 0.5, match: 0}),
			isMatchingFn = options.isMatchingFn || isMatchingFnDefault;

		var costFn = function(from, to){
			if(!from && !to)
				return Number.POSITIVE_INFINITY;
			return (!from? costs.insertion:
				(!to? costs.deletion:
				(isMatchingFn(from, to)? costs.match: costs.modification)));
		};

		//two rows
		var v0 = [],
			v1 = [],
			i, j;
		//initialize v0 (the previous row of distances)
		//this row is A[0][i]: edit distance for an empty s
		//the distance is just the number of characters to delete from t
		for(i = 0; i <= m; i ++)
			v0[i] = costs.insertion * i;
		//calculate v1 (current row distance) from the previous row v0
		for(i = 0; i < n; i ++){
			//first element of v1 is A[i+1][0]
			//edit distance is delete (i+1) chars from s to match empty t
			v1[0] = costs.deletion * (i + 1);

			//use formula to fill in the rest of the row
			for(j = 0; j < m; j ++)
				v1[j + 1] = Math.min(
					v0[j] + costFn(a[i], b[j]),
					v1[j] + costFn(a[i], null),
					v0[j + 1] + costFn(null, b[j])
					);

			//copy v1 (current row) to v0 (previous row) for next iteration
			v0 = v1.slice(0);
		}

		return v1[m];
	};

	/** @private */
	var isMatchingFnDefault = function(a, b){
		return (a === b);
	};

	/** @private */
	var applyIfNotNumeric = function(object, config){
		var property, destination;
		for(property in config){
			destination = object[property];
			if(isNaN(parseFloat(destination)) /*|| !isFinite(destination)*/)
				object[property] = config[property];
		}
		return object;
	};

	/** Sørensen-Dice coefficient (bigram overlap * 2 / bigrams in a + bigrams in b) */
	var diceCoefficient = function(stringA, stringB){
		var lengthA = stringA.length - 1,
			lengthB = stringB.length - 1;
		if(lengthA < 1 || lengthB < 1)
			return 0;

		var bigramsB = [],
			intersection = 0,
			bigramA,
			i, j;
		for(j = 0; j < lengthB; j ++)
			bigramsB.push(stringB.substr(j, 2));
		for(i = 0; i < lengthA; i ++){
			bigramA = stringA.substr(i, 2);

			for(j = 0; j < lengthB; j ++)
				if(bigramA == bigramsB[j]){
					intersection ++;
					bigramsB[j] = null;
					break;
				}
		}
		return (2 * intersection) / (lengthA + lengthB);
	};


	return {
		levenshteinDistance: levenshteinDistance
	};

});
