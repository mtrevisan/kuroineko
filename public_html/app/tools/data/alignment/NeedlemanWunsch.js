/**
 * @class NeedlemanWunsch
 *
 * Needleman-Wunsch global alignment algorithm.
 * <p>
 * Time: O(n * m), Space: O(n * m)
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/data/alignment/BaseAlignment'], function(ObjectHelper, BaseAlignment){

	var a, b, n, m, h, costs, traceback;


	/**
	 * @requires	Insertion and deletion costs to be small positive integers
	 *
	 * @param {String/Array} x		First string.
	 * @param {String/Array} y		Second string.
	 * @param {Object} [config]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 */
	var Constructor = function(x, y, config){
		BaseAlignment.call(this, x, y, config);

		a = ObjectHelper.privatize(this, 'a');
		b = ObjectHelper.privatize(this, 'b');
		n = ObjectHelper.privatize(this, 'n');
		m = ObjectHelper.privatize(this, 'm');
		h = ObjectHelper.privatize(this, 'h');
		costs = ObjectHelper.privatize(this, 'costs');
		traceback = ObjectHelper.privatize(this, 'traceback');
	};


	var align = function(){
		var i, j;

		//calculate scores:
		for(j = 1; j <= m; j ++)
			for(i = 1; i <= n; i ++)
				h[i][j] = Math.min(
					h[i - 1][j - 1] + costs.matchingFn(a[i - 1], b[j - 1], costs),
					h[i][j - 1] + costs.insertion,
					h[i - 1][j] + costs.deletion);

		//extract edit operations
		return traceback(a, b, h, n, m, costs);
	};


	Constructor.prototype = {
		constructor: Constructor,

		align: align
	};


	return Constructor;

});
