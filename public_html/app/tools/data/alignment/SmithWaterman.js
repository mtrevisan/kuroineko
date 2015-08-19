/**
 * @class SmithWaterman
 *
 * Smith-Waterman local alignment algorithm.
 * <p>
 * Time: O(n^2 * m), Space: O(n * m)
 *
 * @see http://www.cs.bgu.ac.il/~michaluz/seminar/Gotoh.pdf
 * @see http://www.akira.ruc.dk/~keld/teaching/algoritmedesign_f03/Artikler/05/Hirschberg75.pdf
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
			return (ObjectHelper.deepEquals(a, b)? 2: -1);
		};
		this.fnInsertGapCost = fnInsertGapCost || function(k){
			return -(1 + 1/3 * (k - 1));
		};
		this.fnDeleteGapCost = fnDeleteGapCost || function(k){
			return -(1 + 1/3 * (k - 1));
		};


		this.n = this.a.length;
		this.m = this.b.length;
		this.h = [];

		//initialize cost matrix:
		var i, j;
		for(i = 0; i <= this.n; i ++)
			this.h[i] = [0];
		for(j = 0; j <= this.m; j ++)
			this.h[0][j] = 0;
	};


	var align = function(){
		var i, j;

		//calculate scores:
		var maxScore = 0;
		for(j = 1; j <= this.m; j ++)
			for(i = 1; i <= this.n; i ++){
				this.h[i][j] = Math.max(
					0,
					match.call(this, i, j),
					deletion.call(this, i, j),
					insertion.call(this, i, j));

				maxScore = Math.max(maxScore, this.h[i][j]);
			}

		var traces = [];
		extractMaxScoreIndices.call(this, maxScore).forEach(function(maxScore){
			//extract edit operations
			traces.push(traceback.call(this, maxScore[0], maxScore[1]));
		}, this);

		return traces;
	};

	/** @private */
	var match = function(i, j){
		return this.h[i - 1][j - 1] + this.fnMatchCost(this.a[i - 1], this.b[j - 1]);
	};

	/** @private */
	var deletion = function(i, j){
		var highest = 0,
			k;
		for(k = 1; k < i; k ++)
			if(this.h[k][j] > this.h[highest][j])
				highest = k;

		return this.h[highest][j] + this.fnDeleteGapCost(i - highest);
	};

	/** @private */
	var insertion = function(i, j){
		var highest = 0,
			k;
		for(k = 1; k < j; k ++)
			if(this.h[i][k] > this.h[i][highest])
				highest = k;

		return this.h[i][highest] + this.fnInsertGapCost(j - highest);
	};

	/** @private */
	var extractMaxScoreIndices = function(maxScore){
		var maxScores = [];

		//collect max scores:
		var i, j;
		for(j = 1; j <= this.m; j ++)
			for(i = 1; i <= this.n; i ++)
				if(this.h[i][j] == maxScore)
					maxScores.push([i, j]);

		return maxScores;
	};

	/** @private */
	var traceback = function(lastIndexA, lastIndexB){
		var trace = {
				lastIndexA: lastIndexA - 1,
				lastIndexB: lastIndexB - 1,
				operations: []
			},
			tmp;

		//backward reconstruct path
		while(lastIndexA > 0 || lastIndexB > 0){
			tmp = this.h[lastIndexA][lastIndexB];

			if(tmp == 0)
				break;

			trace.firstIndexA = lastIndexA - 1;
			trace.firstIndexB = lastIndexB - 1;

			if(lastIndexA > 0 && lastIndexB > 0 && tmp == match.call(this, lastIndexA, lastIndexB)){
				trace.operations.unshift(ObjectHelper.deepEquals(this.a[lastIndexA - 1], this.b[lastIndexB - 1])? ' ': '*');
				lastIndexA --;
				lastIndexB --;
			}
			else if(lastIndexA > 0 && tmp == deletion.call(this, lastIndexA, lastIndexB)){
				trace.operations.unshift('-');
				lastIndexA --;
			}
			else if(lastIndexB > 0 && tmp == insertion.call(this, lastIndexA, lastIndexB)){
				trace.operations.unshift('+');
				lastIndexB --;
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
