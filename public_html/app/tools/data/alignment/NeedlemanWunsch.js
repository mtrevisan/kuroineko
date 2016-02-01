/**
 * @class NeedlemanWunsch
 *
 * Needleman-Wunsch global alignment algorithm.
 * <p>
 * Time: O(n * m), Space: O(n * m)
 *
 * @author Mauro Trevisan
 */
define(['tools/data/alignment/BaseAlignment'], function(BaseAlignment){

	/**
	 * @requires	Insertion and deletion costs to be small positive integers
	 *
	 * @param {String/Array} x		First string.
	 * @param {String/Array} y		Second string.
	 * @param {Object} [config]	Cost configuration object like <code>{insertion: 1, deletion: 1, substitution: 0.5, matchingFn: function(from, to, costs){ return (from == to? 0: costs.substitution); }}</code>
	 */
	var Constructor = function(x, y, config){
		BaseAlignment.call(this, x, y, config);
	};


	var align = function(){
		//calculate scores:
		var i, j;
		for(j = 1; j <= this.m; j ++)
			for(i = 1; i <= this.n; i ++)
				this.h[i][j] = Math.min(
					this.h[i - 1][j - 1] + this.costs.matchingFn(this.a[i - 1], this.b[j - 1], this.costs),
					this.h[i][j - 1] + this.costs.insertion,
					this.h[i - 1][j] + this.costs.deletion);

		//extract edit operations
		return this.traceback(this.a, this.b, this.h, this.n, this.m, this.costs);
	};


	Constructor.prototype = {
		constructor: Constructor,

		align: align
	};


	return Constructor;

});
