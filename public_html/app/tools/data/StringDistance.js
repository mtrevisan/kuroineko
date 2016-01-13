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
		if(!Array.isArray(a))
			a = a.match(REGEX_UNICODE_SPLITTER);
		if(!Array.isArray(b))
			b = b.match(REGEX_UNICODE_SPLITTER);
		costs = enforceDefaultCosts(costs);
		if(!costs.insertion)
			throw 'Cost of insertion cannot be zero or undefined';
		if(!costs.deletion)
			throw 'Cost of deletion cannot be zero or undefined';
		if(!costs.substitution)
			throw 'Cost of substitution cannot be zero or undefined';
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
			prevRow = [],
			curCol, nextCol,
			i, j;

		//initialise previous row
		//this row is A[0][i]: edit distance for an empty <code>a</code>
		//the distance is just the number of characters to delete from <code>b</code>
		for(j = 0; j <= m; j ++)
			prevRow[j] = costs.deletion * j;

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
	 * Compute the Damerau-Levenshtein edit distance between two strings, i.e. the number of insertion, deletion, sustitution, and transposition edits
	 * required to transform one string to the other.<p>
	 * This value will be >= 0, where 0 indicates identical strings.<br>
	 * Comparisons are case sensitive, so for example, "Fred" and "fred" will have a distance of 1.<br>
	 * Note that this is the simpler and faster optimal string alignment (aka restricted edit) distance
	 * that difers slightly from the classic Damerau-Levenshtein algorithm by imposing the restriction
	 * that no substring is edited more than once.
	 *
	 * @see {@link http://blog.softwx.net/2015/01/optimizing-damerau-levenshtein_15.html}
	 * @see {@link http://www.navision-blog.de/blog/2008/11/01/damerau-levenshtein-distance-in-fsharp-part-ii/}
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Number}	Edit distance, a non-negative number representing the number of edits required to transform one string to the other
	 */
	var damerauLevenshteinDistance = function(a, b, costs){
		if(!Array.isArray(a))
			a = a.match(REGEX_UNICODE_SPLITTER);
		if(!Array.isArray(b))
			b = b.match(REGEX_UNICODE_SPLITTER);
		costs = enforceDefaultCosts(costs);
		if(!costs.insertion)
			throw 'Cost of insertion cannot be zero or undefined';
		if(!costs.deletion)
			throw 'Cost of deletion cannot be zero or undefined';
		if(!costs.substitution)
			throw 'Cost of substitution cannot be zero or undefined';
		if(!costs.transposition)
			throw 'Cost of transposition cannot be zero or undefined';

		//base cases
		var n = a.length,
			m = b.length;
		if(a.join('') == b.join(''))
			return 0;
		if(!n)
			return m * costs.insertion;
		if(!m)
			return n * costs.deletion;

		var matchingFn = costs.matchingFn || matchingFnDefault,
			v0 = [],
			v1 = [],
			v2 = [],
			i, j,
			min, t;
		for(j = 0; j <= m; j ++){
			v0[j] = costs.insertion * j;
			v1[j] = 0;
		}

		for(i = 1; i <= n; i ++){
			v2 = v1;
			v1 = v0.slice(0);
			v0[0] = costs.deletion * i;

			for(j = 1; j <= m; j ++){
				min = v1[j - 1] + matchingFn(a[i - 1], b[j - 1], costs);
				if((t = v0[j - 1] + costs.insertion) < min)
					min = t;
				if((t = v1[j] + costs.deletion) < min)
					min = t;
				if(i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1] && (t = v2[j - 2] + costs.transposition) < min)
					min = t;
				v0[j] = min;
			}
		}
		return v0[m];
	};

	/**
	 * Compute the Damerau-Levenshtein edit distance between two strings, i.e. the number of insertion, deletion, sustitution, and transposition edits
	 * required to transform one string to the other.<p>
	 * This value will be >= 0, where 0 indicates identical strings.<br>
	 * Comparisons are case sensitive, so for example, "Fred" and "fred" will have a distance of 1.<br>
	 * Note that this is the simpler and faster optimal string alignment (aka restricted edit) distance
	 * that difers slightly from the classic Damerau-Levenshtein algorithm by imposing the restriction
	 * that no substring is edited more than once.
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Object}	The number of insertions, deletions, substitutions, transpositions, and the edit distance, a non-negative number representing the number of edits required to transform one string to the other
	 */
	var damerauLevenshteinEdit = function(a, b, costs){
		if(!Array.isArray(a))
			a = a.match(REGEX_UNICODE_SPLITTER);
		if(!Array.isArray(b))
			b = b.match(REGEX_UNICODE_SPLITTER);
		costs = enforceDefaultCosts(costs);
		if(!costs.insertion)
			throw 'Cost of insertion cannot be zero or undefined';
		if(!costs.deletion)
			throw 'Cost of deletion cannot be zero or undefined';
		if(!costs.substitution)
			throw 'Cost of substitution cannot be zero or undefined';
		if(!costs.transposition)
			throw 'Cost of transposition cannot be zero or undefined';

		//base cases
		var n = a.length,
			m = b.length,
			result = {
				insertions: 0,
				deletions: 0,
				substitutions: 0,
				transpositions: 0,
				distance: 0
			};
		if(a.join('') == b.join(''))
			return result;
		if(!n){
			result.insertions = m;
			result.distance = m * costs.insertion;
			return result;
		}
		if(!m){
			result.deletions = n;
			result.distance = n * costs.deletion;
			return result;
		}

		var matchingFn = costs.matchingFn || matchingFnDefault,
			distance = [],
			i, j,
			min, t;
		for(i = 0; i <= n; i ++)
			distance[i] = [costs.deletion * i];
		for(j = 0; j <= m; j ++)
			distance[0][j] = costs.insertion * j;

		for(i = 1; i <= n; i ++)
			for(j = 1; j <= m; j ++){
				min = distance[i - 1][j - 1] + matchingFn(a[i - 1], b[j - 1], costs);
				if((t = distance[i][j - 1] + costs.insertion) < min)
					min = t;
				if((t = distance[i - 1][j] + costs.deletion) < min)
					min = t;
				if(i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1] && (t = distance[i - 2][j - 2] + costs.transposition) < min)
					min = t;
				distance[i][j] = min;
			}

		return traceback(a, b, distance, matchingFn, costs);
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

	/** @private */
	var traceback = function(a, b, t, matchingFn, costs){
		var i = a.length,
			j = b.length,
			ops = {
				insertions: 0,
				deletions: 0,
				substitutions: 0,
				transpositions: 0,
				distance: t[i][j]
			},
			tmp, match;

		//backward reconstruct path
		while(i > 0 || j > 0){
			tmp = t[i][j];
			if(i > 0 && j > 0 && tmp == t[i - 1][j - 1] + (match = matchingFn(a[i - 1], b[j - 1], costs))){
				if(match)
					ops.substitutions ++;
				i --;
				j --;
			}
			else if(i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1] && tmp == t[i - 2][j - 2] + costs.transposition){
				ops.transpositions ++;
				i -= 2;
				j -= 2;
			}
			else if(i > 0 && tmp == t[i - 1][j] + costs.deletion){
				ops.deletions ++;
				i --;
			}
			else if(j > 0 && tmp == t[i][j - 1] + costs.insertion){
				ops.insertions ++;
				j --;
			}
		}
		return ops;
	};

	/**
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Object} costs	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5}</code>
	 * @return A percentual indicating the distance between the two inputs.
	 */
	var getStructuralDistance = function(a, b, costs){
		var result = damerauLevenshteinEdit(a, b, costs);
		return result.distance / ((a.length + result.insertions) * Math.max(costs.insertion, costs.deletion, costs.substitution, costs.transposition));
	};


	return {
		REGEX_UNICODE_SPLITTER: REGEX_UNICODE_SPLITTER,

		levenshteinDistance: levenshteinDistance,

		damerauLevenshteinDistance: damerauLevenshteinDistance,
		damerauLevenshteinEdit: damerauLevenshteinEdit,

		getStructuralDistance: getStructuralDistance
	};

});
