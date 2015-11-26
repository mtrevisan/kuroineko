/**
 * @class Markov
 *
 * @see {@link https://github.com/MontyGoose/markov/blob/master/lib/index.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ArrayHelper'], function(ArrayHelper){

	var Constructor = function(order){
		this.order = order;

		this.memoryMap = {};
	};


	/** Adds an element to the Markov chain */
	var feed = function(words){
		var prev = initialState(this.order),
			parts = Constructor.tokenize(words);

		parts.forEach(function(next){
			updateMap.call(this, prev, next)

			prev.shift();
			prev.push(next);
		}, this);
		updateMap.call(this, prev, '_');
	};

	/** @private */
	var updateMap = function(key, value){
		key = key.join('');
		if(!this.memoryMap[key])
			this.memoryMap[key] = [];
		this.memoryMap[key].push(value);
	};

	Constructor.tokenize = function(sentence){
		return cleanup(sentence).split('');
	};

	/** @private */
	var cleanup = function(sentence){
		return sentence
			.replace(/[\u0021-\u0026\u0028-\u002C\u002E-\u0040]+/g, ' ')
			.replace(/\s+/, ' ')
			.trim()
			.toLowerCase();
	};

	/**
	 * Create an initial array to hold states - this needs to cope with n-order Markov chains (finite)
	 *
	 * @private
	 */
	var initialState = function(order){
		var result = [];
		for(var i = 0; i < order; i ++)
			result.push('_');
		return result;
	};

	/**
	 * Get a response from the Markov chain
	 *
	 * @param {String} seed		Seed element
	 * @param {Integer} min		Minimum length of reponse
	 * @param {Integer} max		Maximum length of reponse
	 */
	var ask = function(seed, min, max){
		var s = step.call(this, seed, min, max);
		return ArrayHelper.difference([seed || '_'].concat(s), ['_']).join('');
	};

	/** @private */
	var step = function(seed, min, max){
		var state = seed || initialState(this.order),
			ret = [],
			nextAvailable, next;
		while(!max || ret.length < max){
			nextAvailable = this.memoryMap[state.join('')] || ['_'];
			do{
				next = nextAvailable[Math.floor(Math.random() * nextAvailable.length)];
			}while(next == '_' && nextAvailable.length > 1 && ret.length < min);
			if(next == '_')
				break;

			ret.push(next);

			state.shift();
			state.push(next);
		}
		return ret;
	};


	Constructor.prototype = {
		constructor: Constructor,

		feed: feed,
		ask: ask
	};

	return Constructor;

});
