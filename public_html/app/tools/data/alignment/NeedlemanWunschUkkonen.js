/**
 * @class NeedlemanWunschUkkonen
 *
 * Needleman-Wunsch-Ukkonen global alignment algorithm.
 * <p>
 * Time: O(p * m), Space: O(n * m)
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|[^\u0300-\u036F](?:[\u0300-\u036F]*[\u035C\u0361][^\u0300-\u036F][\u0300-\u036F]*)?)/g;


	/**
	 * @requires	Cost for a match to be zero
	 * @requires	Insertion and deletion costs to be small positive integers
	 */
	var Constructor = function(a, b, fnMatchCost, fnInsertGapCost, fnDeleteGapCost){
		this.a = (Array.isArray(a)? a: a.match(REGEX_UNICODE_SPLITTER));
		this.b = (Array.isArray(b)? b: b.match(REGEX_UNICODE_SPLITTER));

		this.fnMatchCost = fnMatchCost || function(a, b){
			return (ObjectHelper.deepEquals(a, b)? 0: 1);
		};
		this.fnInsertGapCost = fnInsertGapCost || function(){
			return 1;
		};
		this.fnDeleteGapCost = fnDeleteGapCost || function(){
			return 1;
		};


		this.n = this.a.length;
		this.m = this.b.length;
		this.h = [];

		this.diff = Math.abs(this.m - this.n);
		this.delta = Math.max(1, Math.min(this.fnInsertGapCost(), this.fnDeleteGapCost()));

		//initialize cost matrix:
		var i, j;
		for(i = 0; i <= this.n; i ++)
			this.h[i] = [i * this.fnDeleteGapCost()];
		for(j = 0; j <= this.m; j ++)
			this.h[0][j] = j * this.fnInsertGapCost();
	};


	var align = function(){
		var threshold = (this.diff + 1) * this.delta * 2,
			p, i, j, k, size;

		//calculate scores:
		while(true){
			p = threshold / this.delta - this.diff;
			if(p >= 0){
				p = Math.floor(p / 2);

				k = Math.max(this.m - this.n, 0) - p;
				for(i = 1; i <= this.n; i ++)
					for(j = Math.max(1, i + k), size = this.m + Math.min(0, i - this.n - k - 1); j <= size; j ++)
						this.h[i][j] = Math.min(
							match.call(this, i, j),
							deletion.call(this, i, j),
							insertion.call(this, i, j));

				if(this.h[this.n][this.m] <= threshold)
					break;
			}

			threshold *= 2;
		}

		var traces = [];
		//extract edit operations
		traces.push(traceback.call(this, this.n, this.m));

		return traces;
	};

	/** @private */
	var match = function(i, j){
		return this.h[i - 1][j - 1] + this.fnMatchCost(this.a[i - 1], this.b[j - 1]);
	};

	/** @private */
	var deletion = function(i, j){
		return this.h[i - 1][j] + this.fnDeleteGapCost();
	};

	/** @private */
	var insertion = function(i, j){
		return this.h[i][j - 1] + this.fnInsertGapCost();
	};

	/** @private */
	var traceback = function(i, j){
		var trace = {
				operations: []
			},
			tmp;

		//backward reconstruct path
		while(i > 0 || j > 0){
			tmp = this.h[i][j];

			if(i > 0 && j > 0 && tmp == match.call(this, i, j)){
				trace.operations.unshift(ObjectHelper.deepEquals(this.a[i - 1], this.b[j - 1])? ' ': '*');
				i --;
				j --;
			}
			else if(i > 0 && tmp == deletion.call(this, i, j)){
				trace.operations.unshift('-');
				i --;
			}
			else if(j > 0 && tmp == insertion.call(this, i, j)){
				trace.operations.unshift('+');
				j --;
			}
		}

		return trace;
	};


	Constructor.prototype = {
		constructor: Constructor,

		align: align
	};


	return Constructor;

});
