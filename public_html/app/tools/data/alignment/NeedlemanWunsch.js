/**
 * @class NeedlemanWunsch
 *
 * Needleman-Wunsch global alignment algorithm.
 * <p>
 * Time: O(n * m), Space: O(n * m)
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** @constant */
	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|[^\u0300-\u036F](?:[\u0300-\u036F]*[\u035C\u0361][^\u0300-\u036F][\u0300-\u036F]*)?)/g;


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

		//initialize cost matrix:
		var i, j;
		for(i = 0; i <= this.n; i ++)
			this.h[i] = [i * this.fnDeleteGapCost()];
		for(j = 0; j <= this.m; j ++)
			this.h[0][j] = j * this.fnInsertGapCost();
	};


	var align = function(){
		var i, j;

		//calculate scores:
		for(j = 1; j <= this.m; j ++)
			for(i = 1; i <= this.n; i ++)
				this.h[i][j] = Math.min(
					match.call(this, i, j),
					deletion.call(this, i, j),
					insertion.call(this, i, j));

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
