/**
 * @class SmithWaterman
 *
 * Smith-Waterman local alignment algorithm.
 * <p>
 * Time: O(n^2 * m), Space: O(n * m)
 *
 * @see {@link http://www.cs.bgu.ac.il/~michaluz/seminar/Gotoh.pdf}
 * @see {@link http://www.akira.ruc.dk/~keld/teaching/algoritmedesign_f03/Artikler/05/Hirschberg75.pdf}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/data/alignment/BaseAlignment'], function(ObjectHelper, BaseAlignment){

	var a, b, n, m, h;


	/**
	 * @param {String/Array} x	First string.
	 * @param {String/Array} y	Second string.
	 */
	var Constructor = function(x, y){
		BaseAlignment.call(this, x, y, {deletion: 0, insertion: 0});

		a = ObjectHelper.privatize(this, 'a');
		b = ObjectHelper.privatize(this, 'b');
		n = ObjectHelper.privatize(this, 'n');
		m = ObjectHelper.privatize(this, 'm');
		h = ObjectHelper.privatize(this, 'h');
		ObjectHelper.privatize(this, 'costs');
		ObjectHelper.privatize(this, 'traceback');
	};

	/** @private */
	var matchingFn = function(from, to){
		return (ObjectHelper.deepEquals(from, to)? 2: -1);
	};

	/** @private */
	var insertionFn = function(k){
		return -(1 + 1/3 * (k - 1));
	};

	/** @private */
	var deletionFn = function(k){
		return -(1 + 1/3 * (k - 1));
	};


	var align = function(){
		var i, j;

		//calculate scores:
		var maxScore = 0;
		for(j = 1; j <= m; j ++)
			for(i = 1; i <= n; i ++){
				h[i][j] = Math.max(
					0,
					match.call(this, i, j),
					insertion(i, j),
					deletion(i, j));

				maxScore = Math.max(maxScore, h[i][j]);
			}

		var traces = [];
		extractMaxScoreIndices(maxScore).forEach(function(score){
			//extract edit operations
			traces.push(traceback.call(this, score[0], score[1]));
		}, this);

		return traces;
	};

	/** @private */
	var match = function(i, j){
		return h[i - 1][j - 1] + matchingFn(this.a[i - 1], this.b[j - 1]);
	};

	/** @private */
	var insertion = function(i, j){
		var highest = 0,
			k;
		for(k = 1; k < j; k ++)
			if(h[i][k] > h[i][highest])
				highest = k;

		return h[i][highest] + insertionFn(j - highest);
	};

	/** @private */
	var deletion = function(i, j){
		var highest = 0,
			k;
		for(k = 1; k < i; k ++)
			if(h[k][j] > h[highest][j])
				highest = k;

		return h[highest][j] + deletionFn(i - highest);
	};

	/** @private */
	var extractMaxScoreIndices = function(maxScore){
		//collect max scores:
		var maxScores = [],
			i, j;
		for(j = 1; j <= m; j ++)
			for(i = 1; i <= n; i ++)
				if(h[i][j] == maxScore)
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
			ops = trace.operations,
			tmp;

		//backward reconstruct path
		while(lastIndexA || lastIndexB){
			tmp = h[lastIndexA][lastIndexB];
			if(!tmp)
				break;

			trace.firstIndexA = lastIndexA - 1;
			trace.firstIndexB = lastIndexB - 1;

			if(lastIndexA && lastIndexB && tmp == match.call(this, lastIndexA, lastIndexB)){
				ops.unshift(ObjectHelper.deepEquals(a[lastIndexA - 1], b[lastIndexB - 1])? ' ': '*');
				lastIndexA --;
				lastIndexB --;
			}
			else if(lastIndexA && tmp == deletion(lastIndexA, lastIndexB)){
				ops.unshift('-');
				lastIndexA --;
			}
			else if(lastIndexB && tmp == insertion(lastIndexA, lastIndexB)){
				ops.unshift('+');
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
