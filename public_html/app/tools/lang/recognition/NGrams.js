/**
 * @class NGrams
 *
 * @see {@link https://github.com/athoune/node-ngram/blob/master/lib/ngram.js}
 * @see {@link https://github.com/aviv1ron1/ngrams/blob/master/ngrams.js}
 * @see {@link https://github.com/wooorm/franc/blob/master/lib/franc.js}
 * @see {@link https://github.com/wooorm/trigram-utils/blob/master/index.js}
 * @see {@link https://github.com/wooorm/n-gram/blob/master/n-gram.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	/** @constant */
	var MIDDLE_PUNCTUATION = /[\u0021-\u0026\u0028-\u002C\u002E\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u3031-\u3035\u309B\u309C\u30A0\u30FC\uFF70\u2000-\u2017\u2020-\u206F‒–—―=]+/g,
	/** @constant */
		SENTENCE_DELIMITER = /([,;:.…¿?¡!"“”«»‹›\[\]\(\)\{\}])/g;

	var UNSEEN_NGRAM_DISTANCE = 2000;
	var UNSEEN_NGRAM_LOG_PROBABILITY = -7;


	var Constructor = function(min, max){
		this.min = min || 1;
		this.max = max || min || 4;

		this.reset();
	};

	Constructor.unigram = function(){
		return new Constructor(1);
	};

	Constructor.bigram = function(){
		return new Constructor(2);
	};

	Constructor.trigram = function(){
		return new Constructor(3);
	};

	Constructor.fromContent = function(min, max, content){
		var m = new Constructor(min, max);
		m.feed(content);
		return m;
	};

	Constructor.fromData = function(min, max, data){
		var m = new Constructor(min, max);
		m.feedData(data);
		return m;
	};


	var reset = function(){
		this.count = undefined;
		this.stats = undefined;
		this.ranks = undefined;
	};

	var isReady = function(){
		return (this.stats && Object.keys(this.stats).length);
	};

	/** Build n-grams from a sentences, an array of words, or a single word */
	var feed = function(words){
		if(!Array.isArray(words))
			words = Constructor.tokenize(words);

		this.count = 0;
		this.stats = {};
		this.ranks = undefined;

		words.forEach(function(word){
			var ngrams = ngram(word, this.min, this.max);
			this.count += ngrams.length;
			ngrams.forEach(function(n){
				this[n] = this[n] + 1 || 1;
			}, this.stats);
		}, this);

		computeLog(this.stats, this.count);
	};

	/** Build n-grams from a given model */
	var feedData = function(data){
		this.count = data.length;
		this.stats = {};
		this.ranks = undefined;

		data.forEach(function(ngram){
			this[ngram] = this[ngram] + 1 || 1;
		}, this.stats);

		computeLog(this.stats, this.count);
	};

	/** @private */
	var computeLog = function(stats, count){
		Object.keys(stats).forEach(function(key){
			stats[key] = Math.log(stats[key] / count);
		});
	};

	Constructor.tokenize = function(sentence){
		return cleanup(sentence).split(/\s+/);
	};

	/** @private */
	var cleanup = function(sentence){
		return sentence
			.replace(MIDDLE_PUNCTUATION, ' ')
			.replace(SENTENCE_DELIMITER, ' ')
			.replace(/\s+/, ' ')
			.trim()
			.toLowerCase();
	};

	/**
	 * Create n-grams from a given value
	 *
	 * @private
	 */
	var ngram = function(word, min, max){
		var ngrams = [],
			len = word.length,
			s, i;
		for(s = min; s <= max; s ++){
			i = len - s + 1;
			if(i > 0)
				while(i --)
					ngrams.push(word.substr(i, s));
		}
		return ngrams;
	};

	/** Sort n-gram by popularity * /
	var sort = function(){
		if(this.stats && !this.ranks){
			var keys = Object.keys(this.stats);
			keys.sort(function(a, b){ return this[b] - this[a]; }.bind(this.stats));

			var rank = 0,
				before;
			this.ranks = {};
			keys.reverse().forEach(function(key){
				if(this.stats[key] != before){
					before = this.stats[key];
					rank ++;
				}
				this.ranks[key] = rank;
			}, this);
		}
		return this.ranks;
	};*/

	/** Get a sorted list of n-gram by popularity */
	var sort = function(){
		var ranks;
		if(this.stats){
			ranks = Object.keys(this.stats);
			ranks.sort(function(a, b){ return this[b] - this[a]; }.bind(this.stats));
		}
		return ranks;
	};

	/** Distance between two n-grams */
	var distance = function(other){
/*		var p = 0;
		Object.keys(this.stats).forEach(function(key){
			p += (this[key]? this[key]: UNSEEN_NGRAM_LOG_PROBABILITY);
		}, other.stats);
		return p;/**/

		var dist = 0;
		Object.keys(this.stats).forEach(function(key){
			dist += (other.stats[key]? Math.abs(this[key] - other.stats[key]): UNSEEN_NGRAM_DISTANCE);
		}, this.stats);
		return -dist / this.count;
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,
		isReady: isReady,

		feed: feed,
		feedData: feedData,
		sort: sort,

		distance: distance
	};

	return Constructor;

});
