/**
 * @class NeedlemanWunschUkkonen
 *
 * Needleman-Wunsch-Ukkonen global alignment algorithm.
 * <p>
 * Time: O(p * m), Space: O(n * m)
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

		this.diff = Math.abs(this.m - this.n);
		this.delta = Math.max(1, Math.min(this.fnInsertGapCost(), this.fnDeleteGapCost()));

		a = ObjectHelper.privatize(this, 'a');
		b = ObjectHelper.privatize(this, 'b');
		n = ObjectHelper.privatize(this, 'n');
		m = ObjectHelper.privatize(this, 'm');
		h = ObjectHelper.privatize(this, 'h');
		costs = ObjectHelper.privatize(this, 'costs');
		traceback = ObjectHelper.privatize(this, 'traceback');
	};


	var align = function(){
		var threshold = (this.diff + 1) * this.delta * 2,
			p, i, j, k, size;

		//calculate scores:
		while(true){
			p = threshold / this.delta - this.diff;
			if(p >= 0){
				p = Math.floor(p / 2);

				k = Math.max(m - n, 0) - p;
				for(i = 1; i <= n; i ++)
					for(j = Math.max(1, i + k), size = m + Math.min(0, i - n - k - 1); j <= size; j ++)
						h[i][j] = Math.min(
							h[i - 1][j - 1] + costs.matchingFn(a[i - 1], b[j - 1], costs),
							h[i][j - 1] + costs.insertion,
							h[i - 1][j] + costs.deletion);

				if(h[n][m] <= threshold)
					break;
			}

			threshold *= 2;
		}

		//extract edit operations
		return traceback(a, b, h, n, m, costs);
	};


	Constructor.prototype = {
		constructor: Constructor,

		align: align
	};


	return Constructor;

});
