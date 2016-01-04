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
define(function(){

	/** @constant */
	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|j²|[^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u035B\u035D-\u0360\u0362-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*(?:[\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*[\u035C\u0361][^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*)?)/g;


	/**
	 * Compute the Levenshtein distance between two strings.<p>
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Number}
	 */
	var levenshteinDistance = function(a, b, costs){
		a = (Array.isArray(a)? a: a.match(REGEX_UNICODE_SPLITTER));
		b = (Array.isArray(b)? b: b.match(REGEX_UNICODE_SPLITTER));
		costs = enforceDefaultCosts(costs);
		if(!costs.insertion)
			throw 'Cost of insertion cannot be zero';
		if(!costs.deletion)
			throw 'Cost of deletion cannot be zero';
		if(!costs.substitution)
			throw 'Cost of substitution cannot be zero';
		//if(costs.substitution > costs.insertion + costs.deletion)
		//	throw 'Cost of substitution should be less than that of insertion plus deletion';

		//base cases
		var n = a.length,
			m = b.length;
		if(a == b || Array.isArray(a) && a.join('') == b.join(''))
			return 0;
		if(!n)
			return m * costs.insertion;
		if(!m)
			return n * costs.deletion;

		var matchingFn = costs.matchingFn || matchingFnDefault,
			prevRow = new Array(m + 1),
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
					prevRow[j] + matchingFn(a[i], b[j], costs),
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


	/**
	 * Compute the Damerau-Levenshtein distance between two strings.<p>
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Number}
	 */
	var damerauLevenshteinDistance = function(a, b, costs){
		a = (Array.isArray(a)? a: a.match(REGEX_UNICODE_SPLITTER));
		b = (Array.isArray(b)? b: b.match(REGEX_UNICODE_SPLITTER));
		costs = enforceDefaultCosts(costs);
		if(!costs.insertion)
			throw 'Cost of insertion cannot be zero';
		if(!costs.deletion)
			throw 'Cost of deletion cannot be zero';
		if(!costs.substitution)
			throw 'Cost of substitution cannot be zero';

		//base cases
		var n = a.length,
			m = b.length;
		if(a == b || Array.isArray(a) && a.join('') == b.join(''))
			return 0;
		if(!n)
			return m * costs.insertion;
		if(!m)
			return n * costs.deletion;

		var matchingFn = costs.matchingFn || matchingFnDefault,
			distance = [],
			i, j;
		for(i = 0; i <= n; i ++)
			distance[i] = [costs.deletion * i];
		for(j = 0; j <= m; j ++)
			distance[0][j] = costs.insertion * j;

		for(i = 1; i <= n; i ++)
			for(j = 1; j <= m; j ++){
				distance[i][j] = Math.min(
					distance[i - 1][j - 1] + matchingFn(a[i - 1], b[j - 1], costs),
					distance[i][j - 1] + costs.insertion,
					distance[i - 1][j] + costs.deletion);
				if(i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1])
					distance[i][j] = Math.min(distance[i][j], distance[i - 2][j - 2] + costs.transposition);
			}
		return distance[n][m];
	};


	/** @private */
	var matchingFnDefault = function(from, to, costs){
		return (from == to? 0: costs.substitution);
	};

	/** @private */
	var enforceDefaultCosts = function(costs){
		return applyIfNotNumeric(costs || {}, {insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7});
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

	var alignmentLength = function(a, b, distanceFn){
		var insertions = (distanceFn || levenshteinDistance)(a, b, {insertion: 10000, deletion: 1000000, substitution: 100, transposition: 1});
		insertions = Math.floor(insertions / 10000) % 100;
		return a.length + insertions;
	};

	/**
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Object} costs	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5}</code>
	 * @return A percentual indicating the distance between the two inputs.
	 */
	var getStructuralDistance = function(a, b, costs, distanceFn){
		costs = enforceDefaultCosts(costs);
		return (distanceFn || levenshteinDistance)(a, b, costs) / (alignmentLength(a, b) * Math.max(costs.insertion, costs.deletion, costs.substitution));
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
		REGEX_UNICODE_SPLITTER: REGEX_UNICODE_SPLITTER,

		levenshteinDistance: levenshteinDistance,
		damerauLevenshteinDistance: damerauLevenshteinDistance,

		alignmentLength: alignmentLength,
		getStructuralDistance: getStructuralDistance
	};

});
