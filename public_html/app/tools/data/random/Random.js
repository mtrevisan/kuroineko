/**
 * @class Random
 *
 * @see {@link https://github.com/ckknight/random-js/blob/master/lib/random.js}
 * @see {@link http://oroboro.com/non-uniform-random-numbers/}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/random/MersenneTwister'], function(MersenneTwister){

	/** @constant */
	var m = new MersenneTwister();


	/**
	 * @param list		Array of objects with key 'char' and value 'count', ex {a: 12, b: 1, ..}
	 */
	var getRandomValueWithGivenDistribution = function(list){
		var nud = list.$nud,
			total;
		if(!nud){
			var keys = Object.keys(list);
			//handle the special case of just one symbol
			var n = keys.length;
			if(n == 1)
				return keys[0];

			//non-uniform distribution array
			nud = [];
			var i = -- n,
				p = {},
				key, a, b;
			total = keys.reduce(function(sum, key){ return sum + list[key]; }, 0);
			for(key in list)
				p[key] = list[key] * n;
			while(i > 1){
				//find a small probability (less than threshold = total / n)
				keys.some(function(el){ a = el; return (p[a] < total); });
				//find a probability that is not 'a', and the sum is more than the threshold
				keys.some(function(el){ b = el; return (b != a && (p[a] + p[b]) >= total); });

				//two symbols are selected, at indexes 'a' and 'b'

				//probability of 'a' is p[a][1] * (list.length - 1) 'b' is 1 - p[a][1] * (list.length - 1)
				nud.push([a, b, p[a]]);

				//subtract the difference of the probability of 'a' from the threshold from that of 'b'
				p[b] -= total - p[a];
				//remove 'a' from distribution
				delete p[a];
				i --;
			}
			keys = Object.keys(p);
			nud.push([keys[0], keys[1], p[keys[0]]]);

			list.$nud = nud;
		}

		var idx = Math.floor(m.random() * nud.length);
		return nud[idx][m.random() * total < nud[idx][2]? 0: 1];
	};

	/**
	 * @param list		Array of objects containing the non-uniform distribution array $nud to be cleared
	 */
	var resetRandomValueWithGivenDistribution = function(list){
		list.$nud = null;
	};


	return {
		getRandomValueWithGivenDistribution: getRandomValueWithGivenDistribution,
		resetRandomValueWithGivenDistribution: resetRandomValueWithGivenDistribution
	};

});
