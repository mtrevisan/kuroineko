/**
 * @class StringDistance
 *
 * @see {@link http://www.cs.helsinki.fi/u/ukkonen/InfCont85.PDF}
 * @see {@link https://github.com/jobrapido/ng-fast-levenshtein/blob/master/src/fastLevenshteinService.js}
 * @see {@link https://github.com/mjylha/Levenshtein-js/blob/master/levenshtein.js}
 * @see {@link https://github.com/julen/levenshtein.js/blob/master/levenshtein.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/* *
	 * Compute the Levenshtein distance between two strings.<p>
	 * Time: <code>O(p * min(n, m))</code>, where <code>p</code> is the edit distance, Space: <code>O(min(n, m))</code>
	 *
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Number} test		Number to test the distance to (in this case the return type is a boolean).
	 * @param {Object} options	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5, match: 0}</code>
	 * @return {Number/Boolean}
	 * /
	var levenshteinDistance2 = function(a, b, test, options){
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
		var costs = applyIfNotNumeric(options.costs || {}, {insertion: 1, deletion: 2, modification: 0.5, match: 0});

		var costFn = function(from, to){
			if(!from && !to)
				return Number.POSITIVE_INFINITY;
			return (!from? costs.insertion:
				(!to? costs.deletion:
				(from == to? costs.match: costs.modification)));
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
	 * @param {Object} options	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5, match: 0}</code>
	 * @return {Number/Boolean}
	 * /
	var levenshteinDistance3 = function(a, b, test, options){
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
		var costs = applyIfNotNumeric(options.costs || {}, {insertion: 1, deletion: 2, modification: 0.5, match: 0});

		var costFn = function(from, to){
			if(!from && !to)
				return Number.POSITIVE_INFINITY;
			return (!from? costs.insertion:
				(!to? costs.deletion:
				(from == to? costs.match: costs.modification)));
		};

		//two rows
		var v0 = [],
			v1 = [],
			i, j;
		//initialize v0 (the previous row of distances)
		//this row is A[0][i]: edit distance for an empty <code>a</code>
		//the distance is just the number of characters to delete from <code>b</code>
		for(i = 0; i <= m; i ++)
			v0[i] = costs.insertion * i;
		//calculate v1 (current row distance) from the previous row v0
		for(i = 0; i < n; i ++){
			//first element of v1 is A[i+1][0]
			//edit distance is delete (i+1) chars from <code>a</code> to match empty <code>b</code>
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
	};*/

	/**
	 * Compute the Levenshtein distance between two strings.<p>
	 * Time: <code>O(p * min(n, m))</code>, where <code>p</code> is the edit distance, Space: <code>O(min(n, m))</code>
	 *
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Object} costs	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5}</code>
	 * @return {Number}
	 */
	var levenshteinDistance = function(a, b, costs){
		var n = a.length,
			m = b.length;

		//base cases
		if(a == b)
			return 0;
		if(!n)
			return m;
		if(!m)
			return n;

		costs = enforceDefaultCosts(costs);
		if(!costs.insertion)
			throw 'Cost of insertion cannot be zero';
		if(!costs.deletion)
			throw 'Cost of deletion cannot be zero';
		if(!costs.modification)
			throw 'Cost of modification cannot be zero';
		//if(costs.modification > costs.insertion + costs.deletion)
		//	throw 'Cost of modification should be less than that of insertion plus deletion';

		var prevRow = new Array(m + 1),
			curCol, nextCol,
			i, j;

		//initialise previous row
		//this row is A[0][i]: edit distance for an empty <code>a</code>
		//the distance is just the number of characters to delete from <code>b</code>
		for(i = 0; i <= m; i ++)
			prevRow[i] = costs.deletion * i;

		//calculate current row distance from previous row
		for(i = 0; i < n; i ++){
			nextCol = i + costs.deletion;

			for(j = 0; j < m; j ++){
				curCol = nextCol;

				nextCol = Math.min(
					prevRow[j] + (a[i] == b[j]? 0: costs.modification),
					nextCol + costs.insertion,
					prevRow[j + 1] + costs.deletion
				);

				//copy current col value into previous (in preparation for next iteration)
				prevRow[j] = curCol;
			}

			//copy last col value into previous (in preparation for next iteration)
			prevRow[j] = nextCol;
		}

		return nextCol;
	};

	/** @private */
	var enforceDefaultCosts = function(costs){
		return applyIfNotNumeric(costs || {}, {insertion: 1, deletion: 1, modification: 0.5});
	};

	/** @private */
	var applyIfNotNumeric = function(object, config){
		var property, destination;
		for(property in config){
			destination = object[property];
			if(isNaN(Number(destination)))
				object[property] = config[property];
		}
		return object;
	};

	var alignmentLength = function(a, b){
		var insertions = levenshteinDistance(a, b, {insertion: 100, deletion: 10000, modification: 1});
		insertions = Math.floor(insertions / 100) % 100;
		return a.length + insertions;
	};

	/**
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Object} costs	Cost configuration object like <code>{insertion: 1, deletion: 1, modification: 0.5}</code>
	 * @return A percentual indicating the distance between the two inputs.
	 */
	var getStructuralDistance = function(a, b, costs){
		costs = enforceDefaultCosts(costs);
		return levenshteinDistance(a, b, costs) / (alignmentLength(a, b) * Math.max(costs.insertion, costs.deletion, costs.modification));
	};

	/**
	 * Sørensen-Dice coefficient (bigram overlap * 2 / bigrams in a + bigrams in b)
	 *
	 * NOTE: untested!
	 */
	var diceCoefficient = function(a, b){
		var lengthA = a.length - 1,
			lengthB = b.length - 1;
		if(lengthA < 1 || lengthB < 1)
			return 0;

		var bigramsB = [],
			intersection = 0,
			bigramA,
			i, j;
		for(j = 0; j < lengthB; j ++)
			bigramsB.push(b.substr(j, 2));
		for(i = 0; i < lengthA; i ++){
			bigramA = a.substr(i, 2);

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
		levenshteinDistance: levenshteinDistance,
		alignmentLength: alignmentLength,
		getStructuralDistance: getStructuralDistance
	};

});
