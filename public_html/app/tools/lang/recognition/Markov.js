/**
 * @class Markov
 *
 * @see {@link https://github.com/MontyGoose/markov/blob/master/lib/index.js}
 * @see {@link https://github.com/lgeek/polyglossy/blob/master/markov.js}
 * @see {@link http://blog.javascriptroom.com/2013/01/21/markov-chains/}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/random/Random'], function(Random){

	/** @constant */
	var PUNCTUATION = '[\u0021-\u0026\u0028-\u002C\u002E\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u3031-\u3035\u309B\u309C\u30A0\u30FC\uFF70\u2000-\u2017\u2020-\u206F‒–—―=]',
	/** @constant */
		MIDDLE_PUNCTUATION = new RegExp(PUNCTUATION + '+', 'g'),
	/** @constant */
		INITIAL_PUNCTUATION = new RegExp('^\\s*' + PUNCTUATION + '*\\s*'),
	/** @constant */
		SENTENCE_DELIMITER = /([,;:.…¿?¡!"“”«»‹›\[\]\(\)\{\}])/g;

	/** @constant */
	var BOUNDARY = '_',
	/** @constant */
		SEPARATOR = '',
	/** @constant */
		UNSEEN_CHAR_LN_PROBABILITY = -10;


	var Constructor = function(order, separator){
		this.order = order;
		if(separator != undefined)
			SEPARATOR = separator;

		reset.call(this);
	};

	Constructor.fromContent = function(order, separator, content){
		var m = new Constructor(order, separator);
		m.feed(content);
		return m;
	};

	Constructor.fromData = function(order, separator, data){
		var m = new Constructor(order, separator);
		m.feedData(data);
		return m;
	};


	var reset = function(){
		this.memory = {};
	};

	var isReady = function(){
		return !!Object.keys(this.memory).length;
	};

	/** Adds an element to the Markov chain */
	var feed = function(sentence){
		var parts = Constructor.tokenize(sentence),
			prev;

		parts.forEach(function(sent){
			prev = initialState(this.order);
			sent.forEach(function(next){
				updateMap(this.memory, prev, next)

				prev.shift();
				prev.push(next);
			}, this);
			while(prev.some(function(el){ return (el != BOUNDARY); })){
				updateMap(this.memory, prev, BOUNDARY);

				prev.shift();
				prev.push(BOUNDARY);
			}
		}, this);
	};

	/** Print the underlining model as a RLE encoding of the memory */
	var printData = function(){
		var data = [];
		Object.keys(this.memory).forEach(function(el){
			data.push(el);
			data.push(Object.keys(this[el]).length);
			Object.keys(this[el]).forEach(function(chr){
				data.push(chr);
				data.push(this[chr]);
			}.bind(this[el]));
		}, this.memory);
		return data.join('');
	};

	/** Build from a given model */
	var feedData = function(data){
		var size = data.length,
			i = 0,
			j, d, prev, next, len, count, j;
		while(i < size){
			d = data[i];
			prev = [d.substr(0, this.order)];
			len = Number(d.substr(this.order));

			for(j = 1; j <= len; j ++){
				d = data[i + j];
				next = d.substr(0, 1);
				count = Number(d.substr(1));

				updateMap(this.memory, prev, next, count)
			}
			i += len + 1;
		}
	};

	/** @private */
	var updateMap = function(memory, prev, next, count){
		prev = prev.join('');

		if(!memory[prev])
			memory[prev] = {};
		memory[prev][next] = (memory[prev][next]? memory[prev][next] + 1: count || 1);
		delete memory[prev].nud;
	};

	Constructor.tokenize = function(sentence){
		return cleanup(sentence)
			.map(function(sent){ return sent.split(SEPARATOR) });
	};

	/** @private */
	var cleanup = function(sentence){
		return sentence.split(SENTENCE_DELIMITER)
			.filter(function(sent){ return (!sent.match(/^\s*$/) && !sent.match(SENTENCE_DELIMITER)); })
			.map(function(sent){
				return sent
					.replace(INITIAL_PUNCTUATION, '')
					.replace(MIDDLE_PUNCTUATION, ' ')
					.replace(/\s+/, ' ')
					.trim()
					.toLowerCase();
			});
	};

	/**
	 * Create an initial array to hold states - this needs to cope with n-order Markov chains (finite)
	 *
	 * @private
	 */
	var initialState = function(order){
		var result = [];
		for(var i = 0; i < order; i ++)
			result.push(BOUNDARY);
		return result;
	};

	/**
	 * Get a response from the Markov chain
	 *
	 * @param {String} seed		Seed element
	 * @param {Integer} min		Minimum length of reponse
	 * @param {Integer} max		Maximum length of reponse
	 */
	var ask = function(seed, maxLength){
		var s = step.call(this, seed, maxLength);
		return [seed || ''].concat(s).join(SEPARATOR).replace(BOUNDARY, '');
	};

	/** @private */
	var step = function(seed, maxLength){
		var state = (seed? [seed]: initialState(this.order)),
			ret = [],
			nextAvailable, next;
		while(!maxLength || ret.length < maxLength){
			nextAvailable = this.memory[state.join('')];
			if(!nextAvailable)
				break;

			next = Random.getRandomValueWithGivenDistribution(nextAvailable);
			if(next == BOUNDARY)
				break;

			ret.push(next);

			state.shift();
			state.push(next);
		}
		return ret;
	};

	/** Returns the natural logarithm of the probability */
	var lnProbability = function(sentence){
		if(!Array.isArray(sentence))
			sentence = Constructor.tokenize(sentence);

		var p, i, prev, next, count, total;
		sentence.forEach(function(sent){
			for(i = 0; i < this.order; i ++){
				sent.unshift(BOUNDARY);
				sent.push(BOUNDARY);
			}

			p = 0;
			for(i = this.order; i < sent.length; i ++){
				count = undefined;
				try{
					prev = sent.slice(i - this.order, i).join('');
					next = sent[i];
					count = Object.keys(this.memory[prev]).reduce(function(sum, key){ return sum + (key == next? this[key]: 0); }.bind(this.memory[prev]), 0);
				}
				catch(e){}

				total = (count? getTotal.call(this, prev): undefined);
				p += (total? Math.log(count / total): UNSEEN_CHAR_LN_PROBABILITY);
			}

			for(i = 0; i < this.order; i ++){
				sent.shift();
				sent.pop();
			}
		}, this);
		return p;
	};

	/** @private */
	var getTotal = (function(){
		var getBranchTotal = function(memory, from){
			return Object.keys(memory[from]).reduce(function(sum, key){ return sum + this[key]; }.bind(memory[from]), 0);
		};

		return function(from){
			if(from && !this.memory[from])
				return undefined;

			return (from != undefined?
				getBranchTotal(this.memory, from):
				this.memory.reduce(function(sum, key){ return sum + getBranchTotal(this, key); }.bind(this.memory), 0));
		};
	})();


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,
		isReady: isReady,

		feed: feed,
		printData: printData,
		feedData: feedData,
		ask: ask,

		lnProbability: lnProbability
	};

	return Constructor;

});
