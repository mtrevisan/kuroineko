/**
 * @class StringDistance
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/data/StringHelper', 'tools/data/Assert'], function(ObjectHelper, StringHelper, Assert){

	/** @constant */
	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|j²|[^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u035B\u035D-\u0360\u0362-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*(?:[\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*[\u035C\u0361][^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*)?)/g;


	/**
	 * Compute the Levenshtein edit distance between two strings (this value will be >= 0, where 0 indicates identical strings),
	 * i.e. the number of insertion, deletion, and substitution edits required to transform one string to the other.
	 * Comparisons are case sensitive, so for example, "Fred" and "fred" will have a distance of <code>costs.substitution</code>.<br>
	 * Note that this is the simpler and faster optimal string alignment (aka restricted edit) distance
	 * that differs slightly by imposing the restriction that no substring is edited more than once.
	 *
	 * @see {@link https://github.com/jobrapido/ng-fast-levenshtein/blob/master/src/fastLevenshteinService.js}
	 * @see {@link https://github.com/mjylha/Levenshtein-js/blob/master/levenshtein.js}
	 * @see {@link https://github.com/julen/levenshtein.js/blob/master/levenshtein.js}
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Number}	Edit distance, a non-negative number representing the number of edits required to transform one string to the other
	 */
	var levenshteinDistance = function(a, b, costs){
		if(!Array.isArray(a))
			a = a.match(REGEX_UNICODE_SPLITTER);
		if(!Array.isArray(b))
			b = b.match(REGEX_UNICODE_SPLITTER);
		costs = enforceDefaultCosts(costs);
		Assert.assert(costs.insertion, 'Cost of insertion cannot be zero or undefined');
		Assert.assert(costs.deletion, 'Cost of deletion cannot be zero or undefined');
		Assert.assert(costs.substitution, 'Cost of substitution cannot be zero or undefined');

		//base cases
		var n = a.length,
			m = b.length;
		if(a.join('') == b.join(''))
			return 0;
		if(!n)
			return m * costs.insertion;
		if(!m)
			return n * costs.deletion;

		var prevRow = [],
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
					prevRow[j] + costs.matchingFn(a[i], b[j], costs),
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
	 * Compute the Levenshtein edit distance between two strings (this value will be >= 0, where 0 indicates identical strings),
	 * i.e. the number of insertion, deletion, and substitution edits required to transform one string to the other,
	 * among with the number of insertions, deletions, and substitutions.
	 * Comparisons are case sensitive, so for example, "Fred" and "fred" will have a distance of <code>costs.substitution</code>.<br>
	 * Note that this is the simpler and faster optimal string alignment (aka restricted edit) distance
	 * that differs slightly by imposing the restriction that no substring is edited more than once.
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Object}	The number of insertions, deletions, substitutions, and the edit distance, a non-negative number representing the number of edits required to transform one string to the other
	 */
	var levenshteinEdit = function(a, b, costs){
		var computeFn = function(x, y, c, distance, i, j){
			var min = distance[i - 1][j - 1] + c.matchingFn(x[i - 1], y[j - 1], c),
				t;
			if((t = distance[i][j - 1] + c.insertion) < min)
				min = t;
			if((t = distance[i - 1][j] + c.deletion) < min)
				min = t;
			distance[i][j] = min;
		};
		return edit(a, b, costs, computeFn);
	};

	/**
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Object} costs	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5}</code>
	 * @return A percentual indicating the distance between the two inputs using the Levenshtein edits.
	 */
	var levenshteinStructuralDistance = function(a, b, costs){
		var edits = levenshteinEdit(a, b, costs);
		return structuralDistance(a, costs, edits);
	};


	/**
	 * Compute the Damerau-Levenshtein edit distance between two strings (this value will be >= 0, where 0 indicates identical strings),
	 * i.e. the number of insertion, deletion, substitution, and transposition edits required to transform one string to the other.
	 * Comparisons are case sensitive, so for example, "Fred" and "fred" will have a distance of <code>costs.substitution</code>.<br>
	 * Note that this is the simpler and faster optimal string alignment (aka restricted edit) distance
	 * that differs slightly from the classic Damerau-Levenshtein algorithm by imposing the restriction
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
		Assert.assert(costs.insertion, 'Cost of insertion cannot be zero or undefined');
		Assert.assert(costs.deletion, 'Cost of deletion cannot be zero or undefined');
		Assert.assert(costs.substitution, 'Cost of substitution cannot be zero or undefined');
		Assert.assert(costs.transposition, 'Cost of transposition cannot be zero or undefined');

		//base cases
		var n = a.length,
			m = b.length;
		if(a.join('') == b.join(''))
			return 0;
		if(!n)
			return m * costs.insertion;
		if(!m)
			return n * costs.deletion;

		var v0 = [],
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
				min = v1[j - 1] + costs.matchingFn(a[i - 1], b[j - 1], costs);
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
	 * Compute the Damerau-Levenshtein edit distance between two strings (this value will be >= 0, where 0 indicates identical strings),
	 * i.e. the number of insertion, deletion, substitution, and transposition edits required to transform one string to the other,
	 * among with the number of insertions, deletions, substitutions, and transpositions.
	 * Comparisons are case sensitive, so for example, "Fred" and "fred" will have a distance of <code>costs.substitution</code>.<br>
	 * Note that this is the simpler and faster optimal string alignment (aka restricted edit) distance
	 * that differs slightly from the classic Damerau-Levenshtein algorithm by imposing the restriction
	 * that no substring is edited more than once.
	 *
	 * @param {String/Array} a	First string.
	 * @param {String/Array} b	Second string.
	 * @param {Object} [costs]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 * @return {Object}	The number of insertions, deletions, substitutions, transpositions, and the edit distance, a non-negative number representing the number of edits required to transform one string to the other
	 */
	var damerauLevenshteinEdit = function(a, b, costs){
		Assert.assert(costs.transposition, 'Cost of transposition cannot be zero or undefined');

		var computeFn = function(x, y, c, distance, i, j){
			var min = distance[i - 1][j - 1] + c.matchingFn(x[i - 1], y[j - 1], c),
				t;
			if((t = distance[i][j - 1] + c.insertion) < min)
				min = t;
			if((t = distance[i - 1][j] + c.deletion) < min)
				min = t;
			if(i > 1 && j > 1 && x[i - 1] == y[j - 2] && x[i - 2] == y[j - 1] && (t = distance[i - 2][j - 2] + c.transposition) < min)
				min = t;
			distance[i][j] = min;
		};
		return edit(a, b, costs, computeFn);
	};

	/**
	 * @param {String} a			First string.
	 * @param {String} b			Second string.
	 * @param {Object} costs	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7}</code>
	 * @return A percentual indicating the distance between the two inputs using the Damerau-Levenshtein edits.
	 */
	var damerauLevenshteinStructuralDistance = function(a, b, costs){
		var edits = damerauLevenshteinEdit(a, b, costs);
		return structuralDistance(a, costs, edits);
	};


	/** @private */
	var edit = function(a, b, costs, computeFn){
		if(!Array.isArray(a))
			a = a.match(REGEX_UNICODE_SPLITTER);
		if(!Array.isArray(b))
			b = b.match(REGEX_UNICODE_SPLITTER);
		costs = enforceDefaultCosts(costs);
		Assert.assert(costs.insertion, 'Cost of insertion cannot be zero or undefined');
		Assert.assert(costs.deletion, 'Cost of deletion cannot be zero or undefined');
		Assert.assert(costs.substitution, 'Cost of substitution cannot be zero or undefined');

		//base cases
		var n = a.length,
			m = b.length,
			result = {
				insertions: 0,
				deletions: 0,
				substitutions: 0,
				transpositions: 0,
				operations: [],
				distance: 0
			};
		if(a.join('') == b.join('')){
			result.operations = StringHelper.stringRepeat(' ', n).split('');
			return result;
		}
		if(!n){
			result.insertions = m;
			result.operations = StringHelper.stringRepeat('+', m).split('');
			result.distance = m * costs.insertion;
			return result;
		}
		if(!m){
			result.deletions = n;
			result.operations = StringHelper.stringRepeat('-', n).split('');
			result.distance = n * costs.deletion;
			return result;
		}

		var distance = [],
			i, j;

		for(i = 0; i <= n; i ++)
			distance[i] = [costs.deletion * i];
		for(j = 0; j <= m; j ++)
			distance[0][j] = costs.insertion * j;

		for(i = 1; i <= n; i ++)
			for(j = 1; j <= m; j ++)
				computeFn(a, b, costs, distance, i, j);

		return traceback(a, b, costs, distance);
	};

	/** @private */
	var traceback = function(a, b, costs, distance){
		var i = a.length,
			j = b.length,
			ops = {
				insertions: 0,
				deletions: 0,
				substitutions: 0,
				transpositions: 0,
				operations: [],
				distance: distance[i][j]
			},
			tmp, mismatch;

		//backward reconstruct path
		while(i > 0 || j > 0){
			tmp = distance[i][j];
			if(i > 0 && j > 0 && tmp == distance[i - 1][j - 1] + (mismatch = costs.matchingFn(a[i - 1], b[j - 1], costs))){
				if(mismatch)
					ops.substitutions ++;
				ops.operations.unshift(mismatch? '*': ' ');
				i --;
				j --;
			}
			else if(i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1] && tmp == distance[i - 2][j - 2] + costs.transposition){
				ops.transpositions ++;
				ops.operations.unshift('/');
				i -= 2;
				j -= 2;
			}
			else if(i > 0 && tmp == distance[i - 1][j] + costs.deletion){
				ops.deletions ++;
				ops.operations.unshift('-');
				i --;
			}
			else if(j > 0 && tmp == distance[i][j - 1] + costs.insertion){
				ops.insertions ++;
				ops.operations.unshift('+');
				j --;
			}
		}
		return ops;
	};

	/** @private */
	var structuralDistance = function(a, costs, edits){
		return edits.distance / ((a.length + edits.insertions) * costs.maxCost());
	};


	/** @private */
	var enforceDefaultCosts = function(costs){
		costs = ObjectHelper.applyIf(costs || {}, {insertion: 1, deletion: 1, substitution: 0.5, transposition: 0.7});
		costs.maxCost = function(){
			return Math.max(this.insertion, this.deletion, this.substitution, this.transposition);
		};
		costs.matchingFn = costs.matchingFn || matchingFnDefault;
		return costs;
	};

	/** @private */
	var matchingFnDefault = function(from, to, costs){
		return (ObjectHelper.deepEquals(from, to)? 0: costs.substitution);
	};


	return {
		REGEX_UNICODE_SPLITTER: REGEX_UNICODE_SPLITTER,

		levenshteinDistance: levenshteinDistance,
		levenshteinEdit: levenshteinEdit,
		levenshteinStructuralDistance: levenshteinStructuralDistance,

		damerauLevenshteinDistance: damerauLevenshteinDistance,
		damerauLevenshteinEdit: damerauLevenshteinEdit,
		damerauLevenshteinStructuralDistance: damerauLevenshteinStructuralDistance
	};

});
