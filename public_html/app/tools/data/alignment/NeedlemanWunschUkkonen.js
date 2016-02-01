/**
 * @class NeedlemanWunschUkkonen
 *
 * Needleman-Wunsch-Ukkonen global alignment algorithm.
 * <p>
 * Time: O(p * m), Space: O(n * m)
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

		this.diff = Math.abs(this.m - this.n);
		this.delta = Math.max(1, Math.min(this.costs.insertion, this.costs.deletion));
	};


	var align = function(){
		//calculate scores:
		var threshold = (this.diff + 1) * this.delta * 2,
			p, i, j, k, size;
		while(true){
			p = threshold / this.delta - this.diff;
			if(p >= 0){
				p = Math.floor(p / 2);

				k = Math.max(this.m - this.n, 0) - p;
				for(i = 1; i <= this.n; i ++)
					for(j = Math.max(1, i + k), size = this.m + Math.min(0, i - this.n - k - 1); j <= size; j ++)
						this.h[i][j] = Math.min(
							this.h[i - 1][j - 1] + this.costs.matchingFn(this.a[i - 1], this.b[j - 1], this.costs),
							this.h[i][j - 1] + this.costs.insertion,
							this.h[i - 1][j] + this.costs.deletion);

				if(this.h[this.n][this.m] <= threshold)
					break;
			}

			threshold *= 2;
		}

		//extract edit operations
		return this.traceback(this.a, this.b, this.h, this.n, this.m, this.costs);
	};


	Constructor.prototype = {
		constructor: Constructor,

		align: align
	};


	return Constructor;

});
