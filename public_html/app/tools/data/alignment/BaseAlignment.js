/**
 * @class BaseAlignment
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** @constant */
	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|[^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u035B\u035D-\u0360\u0362-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*(?:[\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*[\u035C\u0361][^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*)?)/g;


	var x, y;


	/**
	 * @requires	Insertion and deletion costs to be small positive integers
	 *
	 * @param {String/Array} a				First string.
	 * @param {String/Array} b				Second string.
	 * @param {Object} [costs]				Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 */
	var init = function(a, b, costs){
		x = (Array.isArray(a)? a: a.match(REGEX_UNICODE_SPLITTER));
		y = (Array.isArray(b)? b: b.match(REGEX_UNICODE_SPLITTER));
		costs = enforceDefaultCosts(costs);
		if(costs.insertion < 0)
			throw new Error('Cost of insertion cannot be negative');
		if(costs.deletion < 0)
			throw new Error('Cost of deletion cannot be negative');
		if(costs.substitution < 0)
			throw new Error('Cost of substitution cannot be negative');


		this.a = x;
		this.b = y;
		this.n = x.length;
		this.m = y.length;
		this.h = [];

		//initialize cost matrix:
		var i, j;
		for(i = 0; i <= this.n; i ++)
			this.h[i] = [i * costs.deletion];
		for(j = 0; j <= this.m; j ++)
			this.h[0][j] = j * costs.insertion;

		this.costs = costs;
		this.traceback = traceback;
	};


	/** @private */
	var enforceDefaultCosts = function(costs){
		costs = ObjectHelper.applyIf(costs || {}, {insertion: 1, deletion: 1, substitution: 0.5});
		costs.matchingFn = costs.matchingFn || matchingFnDefault;
		return costs;
	};

	/** @private */
	var matchingFnDefault = function(from, to, costs){
		return (ObjectHelper.deepEquals(from, to)? 0: costs.substitution);
	};

	var traceback = function(a, b, h, i, j, costs){
		var trace = {
				operations: []
			},
			ops = trace.operations,
			tmp, mismatch;

		//backward reconstruct path
		while(i > 0 || j > 0){
			tmp = h[i][j];

			if(i > 0 && j > 0 && tmp == h[i - 1][j - 1] + (mismatch = costs.matchingFn(a[i - 1], b[j - 1], costs))){
				ops.unshift(mismatch? '*': ' ');
				i --;
				j --;
			}
			else if(i > 0 && tmp == h[i - 1][j] + costs.deletion){
				ops.unshift('-');
				i --;
			}
			else if(j > 0 && tmp == h[i][j - 1] + costs.insertion){
				ops.unshift('+');
				j --;
			}
		}

		return trace;
	};


	return init;

});
