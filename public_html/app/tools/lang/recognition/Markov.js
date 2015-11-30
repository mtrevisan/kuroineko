/**
 * @class Markov
 *
 * @see {@link https://github.com/MontyGoose/markov/blob/master/lib/index.js}
 * @see {@link https://github.com/lgeek/polyglossy/blob/master/markov.js}
 * @see {@link http://blog.javascriptroom.com/2013/01/21/markov-chains/}
 *
 * @see {@link https://github.com/ckknight/random-js/blob/master/lib/random.js}
 * @see {@link http://oroboro.com/non-uniform-random-numbers/}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var PUNCTUATION = /[\u0021-\u0026\u0028-\u002C\u002E\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u3031-\u3035\u309B\u309C\u30A0\u30FC\uFF70\u2000-\u2017\u2020-\u206F-=]+/g,
		INITIAL_PUNCTUATION = /^\s*[\u0021-\u0026\u0028-\u002C\u002E\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u3031-\u3035\u309B\u309C\u30A0\u30FC\uFF70\u2000-\u2017\u2020-\u206F-=]*\s*/,
		SENTENCE_DELIMITER = /([,;:.¿?¡!"“”«»‹›])/g;

	/** @constant */
	var BOUNDARY = '_',
	/** @constant */
		SEPARATOR = '',
	/** @constant */
		UNSEEN_CHAR_LOG_PROBABILITY = -10;


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
		sortMemory(this.memory);

		var data = '';
		Object.keys(this.memory).forEach(function(el){
			data += (el? el: '_') + this[el].length;
			this[el].forEach(function(chr){
				data += (chr[0]? chr[0]: '_') + chr[1];
			});
		}, this.memory);
		return data;
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
	var sortMemory = function(memory){
		Object.keys(memory).map(function(curr){
			this[curr].sort();
			return this[curr];
		}, memory);
	};

	/** @private */
	var updateMap = function(memory, prev, next, count){
		prev = prev.join('');

		var found = false;
		if(!memory[prev])
			memory[prev] = [];
		else
			for(var i = memory[prev].length - 1; i >= 0; i --)
				if(memory[prev][i][0] == next){
					memory[prev][i][1] ++;
					found = true;
					break;
				}

		if(!found){
			memory[prev].push([next, count || 1]);
			delete memory[prev].nud;
		}
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
					.replace(PUNCTUATION, ' ')
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
	var ask = function(seed, min, max){
		var s = step.call(this, seed, min, max);
		return [seed || BOUNDARY].concat(s).join(SEPARATOR).replace(BOUNDARY, '');
	};

	/** @private */
	var step = function(seed, min, max){
		var state = (seed? [seed]: initialState(this.order)),
			ret = [],
			nextAvailable, prev, next;
		while(!max || ret.length < max){
			prev = state.join('');
			nextAvailable = this.memory[prev] || [BOUNDARY];
			do{
				next = getRandomValueWithGivenDistribution(nextAvailable, getTotal.call(this, prev));
			}while(next == BOUNDARY && (!min || nextAvailable.length > 1 && ret.length < min));
			if(next == BOUNDARY)
				break;

			ret.push(next);

			state.shift();
			state.push(next);
		}
		return ret;
	};

	/** @private */
	var getRandomValueWithGivenDistribution = function(list, total){
		var nud = list.nud;
		if(!nud){
			//handle the special case of just one symbol
			var n = list.length;
			if(n == 1)
				return list[0][0];

			//non-uniform distribution array
			nud = [];
			var m = -- n,
				p = [],
				threshold = total / n,
				a, b;
			list.forEach(function(el){ p.push(el.slice(0)); });
			while(n > 1){
				a = 0;
				b = 0;

				//find a small probability
				while(a <= n && p[a][1] >= threshold)
					a ++;
				//find a probability that is not 'a', and the sum is more than the threshold
				while(b <= n && (b == a || p[a][1] + p[b][1] < threshold))
					b ++;

				//two symbols are selected, at indexes 'a', and 'b'

				//probability of 'a' is p[a][1] * m, 'b' is 1 - p[a][1] * m
				nud.push([p[a][0], p[b][0], p[a][1] * m]);

				//subtract the probability of 'a' from that of 'b'
				p[b][1] -= threshold - p[a][1];
				//remove 'a' from initial distribution
				p.splice(a, 1);
				n --;
			}
			a = 0;
			b = 1;
			if(p[a][1] < p[b][1])
				a = b + (b = a, 0);
			nud.push([p[a][0], p[b][0], p[a][1] * m]);

			list.nud = nud;
		}

		var idx = Math.floor(Math.random() * nud.length);
		return nud[idx][Math.random() * total < nud[idx][2]? 0: 1];
	};

	/** Returns the natural logarithm of the probability */
	var logProbability = function(sentence){
		if(!Array.isArray(sentence))
			sentence = Constructor.tokenize(sentence.join(''));

		var p, len, i, prev, next, count, total, prob;
		sentence.forEach(function(sent){
			p = 0;
			len = sent.length - this.order;
			for(i = 0; i < len; i ++){
				count = undefined;
				try{
					prev = sent.slice(i, i + this.order).join('');
					next = sent[i + this.order];
					count = this.memory[prev].reduce(function(sum, key){ return sum + (key[0] == next? 1: 0); }, 0);
				}
				catch(e){}

				if(count){
					total = getTotal.call(this, prev);
					prob = (total? Math.log(count / total): UNSEEN_CHAR_LOG_PROBABILITY);
				}
				else
					prob = UNSEEN_CHAR_LOG_PROBABILITY;

				p += prob;
			}
		}, this);
		return p;
	};

	/** @private */
	var getTotal = (function(){
		var fn = function(memory, from){
			return memory[from].reduce(function(sum, key){ return sum + key[1]; }, 0);
		};

		return function(from){
			if(from && !this.memory[from])
				return undefined;

			return (from != undefined?
				fn(this.memory, from):
				Object.keys(this.memory).reduce(function(sum, key){ return sum + fn(this, key); }.bind(this.memory), 0));
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

		logProbability: logProbability
	};

	return Constructor;

});
