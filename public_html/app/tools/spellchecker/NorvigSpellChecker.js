/**
 * Probabilistic spellchecker.
 * <p>
 * The general idea is simple. Given a word, the spellchecker calculates all strings that are at 2 edit distance away. Of those many candidates,
 * it filters the ones that are not words and then returns an array of possible corrections in order of decreasing probability, based on the edit
 * distance and the candidate's frequency in the input corpus.<br>
 *
 * @class NorvigSpellChecker
 *
 * @see {@link http://norvig.com/spell-correct.html}
 *
 * @author Mauro Trevisan
 */
define(function(){

	/**
	 * @constant
	 * @private
	 */
	var REGEX_UNICODE_SPLITTER = /([^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u035B\u035D-\u0360\u0362-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*(?:[\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*[\u035C\u0361][^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*)?)/g;


	var Constructor = function(alphabetString){
		this.alphabet = alphabetString.match(REGEX_UNICODE_SPLITTER);
		this.filter = new RegExp('([' + alphabetString + ']+)', 'g'),

		this.dictionary = {};
	};


	/**
	 * @param {Array} corpus	Corpus from which word probabilities are calculated
	 */
	var readDictionary = function(corpus){
		corpus = extractWords.call(this, corpus);

		calculateLanguageModelProbability.call(this, corpus);
	};

	/**
	 * Adds a word to the dictionary.
	 *
	 * @param {String} word	The word to add to the dictionary.
	 */
	var addWord = function(word){
		corpus = extractWords.call(this, corpus);

//FIXME
		calculateLanguageModelProbability.call(this, corpus);
	};

	/** @private */
	var extractWords = function(words){
		return (Array.isArray(words)? words.map(function(value){ return value.toLowerCase(); }): words.toLowerCase().match(this.filter));
	};

	/**
	 * Calculate language model probability <code>P(c)</code>: "how likely is <code>c</code> to appear in a text?".
	 *
	 * @private
	 */
	var calculateLanguageModelProbability = function(words){
		words.forEach(function(word){
			this[word] = this[word] + 1 || 1;
		}, this.dictionary);

		//calculate logarithm of probability
		var keys = Object.keys(this.dictionary),
			logSize = Math.log(keys.length);
		keys.forEach(function(word){
			this[word] = Math.log(this[word]) - logSize;
		}, this.dictionary);
	};

	var isCorrect = function(word){
		return !!this.dictionary[word];
	};

	/**
	 * Returns a list of suggested corrections, from highest to lowest probability.
	 * <p>
	 * According to Norvig, literature suggests that 80% to 95% of spelling errors are an edit distance of 1 away from the correct word.
	 *
	 * @param {String} word			The input for which corrections should be suggested.
	 * @param {Number} [distance]	Max edit distance.
	 * @return {Object}	An object contains candidates and sorted keys.
	 */
	var suggest = function(word, distance){
		var input = {};
		input[word.toLowerCase()] = 0;
		var candidates = calculateNEditSet.call(this, input, {}, distance || 2);

		//calculateRelativeProbabilitiesFromLog(candidates);

		var results = [];
		Object.keys(candidates).forEach(function(key){
			results.push([key, this[key]]);
		}, candidates);
		results.sort(function(a, b){ return b[1] - a[1]; });

		return results;
		/*return {
			candidates: candidates,
			sortedKeys: sortKeysByMoreProbable(candidates)
		};*/
	};

	/**
	 * Calculate set of known word at edit distance 0 from the given word.
	 *
	 * @private
	 */
	var calculate0EditSet = function(word, candidates){
		candidates = candidates || {};

		//add to set if the given word is known
		if(this.dictionary[word])
			candidates[word] = this.dictionary[word];
		return candidates;
	};

	/**
	 * Calculate set of known word at edit distance 1 from the given word.<p>
	 * For a word of length {@code n}, an alphabet size {@code a}, an edit distance {@code d = 1}, there will be {@code n} deletions, {@code n-1}
	 * transpositions, {@code a * n} alterations, and {@code a * (n + 1)} insertions, for a total of {@code 2 * n + 2 * a * n + a - 1} terms
	 * at search time.
	 *
	 * @private
	 */
	var calculate1EditSet = function(words, candidates, cumulateOnly){
		candidates = candidates || {};

		var fnAddToSet = (cumulateOnly === true? addToSet: addToSetIfKnown).bind(this);
		Object.keys(words).forEach(function(word){
			var size_i = word.length,
				size_j = this.alphabet.length,
				i, j, a, b, c;
			for(i = 0; i <= size_i; i ++){
				//splits (a & b)
				a = word.slice(0, i);
				b = word.slice(i);
				c = b.slice(1);

				if(b != ''){
					//deletes: b[0]|_
					fnAddToSet(a + c, words[word] + getModelProbabilityLog(i), candidates);

					//transposes (distance 1): b[0]b[1]|b[1]b[0]
					if(b.length > 1)
						fnAddToSet(a + b[1] + b[0] + b.slice(2), words[word] + getModelProbabilityLog(i, null, 1), candidates);
					//transposes (distance 2): b[0]b[1]b[2]|b[2]b[1]b[0]
					if(b.length > 2)
						fnAddToSet(a + b[2] + b[1] + b[0] + b.slice(3), words[word] + getModelProbabilityLog(i, null, 2), candidates);
					//transposes (distance 3): b[0]b[1]b[2]b[3]|b[3]b[1]b[2]b[0]
					if(b.length > 3)
						fnAddToSet(a + b[3] + b[1] + b[2] + b[0] + b.slice(4), words[word] + getModelProbabilityLog(i, null, 3), candidates);

					//replaces & inserts:
					for(j = 0; j < size_j; j ++){
						//replaces: b[0]|alphabet[j]
						fnAddToSet(a + this.alphabet[j] + c, words[word] + getModelProbabilityLog(i, this.alphabet[j]), candidates);

						//inserts: b[0]|alphabet[j]b[0]
						fnAddToSet(a + this.alphabet[j] + b, words[word] + getModelProbabilityLog(i, this.alphabet[j], 1), candidates);
					}
				}
				else
					//inserts (remaining set for b == ''): b[0]|alphabet[j]b[0]
					for(j = 0; j < size_j; j ++)
						fnAddToSet(a + this.alphabet[j] + b, words[word] + getModelProbabilityLog(i, this.alphabet[j], 1), candidates);
			}

			if(!cumulateOnly && !this.isCorrect(word))
				delete candidates[word];
		}, this);

		return candidates;
	};

	/**
	 * Calculate set of known word at edit distance {@code n} from the given word.
	 *
	 * @private
	 */
	var calculateNEditSet = function(words, candidates, n){
		if(!n)
			return calculate0EditSet.call(this, words, candidates);
		if(n == 1)
			return calculate1EditSet.call(this, calculate0EditSet.call(this, words, candidates), candidates);

		return calculateNEditSet.call(this, calculate1EditSet.call(this, words, candidates, true), candidates, n - 1);
	};

	/** @private */
	var addToSetIfKnown = function(word, logModelProbability, candidates){
		//calculate P(c) * P(w|c)
		this.dictionary[word] && addToSet(word, this.dictionary[word] + logModelProbability, candidates);
	};

	/** @private */
	var addToSet = function(word, logModelProbability, candidates){
		candidates[word] = (candidates[word]? Math.log(Math.exp(candidates[word]) + Math.exp(logModelProbability)): logModelProbability);
	};

	/**
	 * Calculate logarithm of model probability <code>P(w|c)</code>: "how likely is it that the author would type <code>w</code> by mistake when
	 * <code>c</code> was intended?".
	 *
	 * @private
	 */
	var getModelProbabilityLog = function(idx, replacement, distance){
		if(arguments.length == 0)
			//no changes
			return Math.log(0.95);
		if(arguments.length == 1)
			//delete of word[idx]
			return Math.log(0.01);
		if(arguments.length == 2)
			//replace of word[idx] with replacement
			return Math.log(0.013);

		if(!replacement)
			//transpose of word[idx] with word[idx + distance]
			return Math.log(0.015);
		else
			//insert replacement before word[idx]
			return Math.log(0.012);
	};

	/** @private */
	var calculateRelativeProbabilitiesFromLog = function(candidates){
		var k,
			sum = 0;
		for(k in candidates){
			candidates[k] = Math.exp(candidates[k]);
			sum += candidates[k];
		}
		for(k in candidates)
			candidates[k] = candidates[k] / sum;
		return candidates;
	};

	/** @private */
	var sortKeysByMoreProbable = function(candidates){
		return Object.keys(candidates).sort(function(a, b){ return candidates[b] - candidates[a]; });
	};


	Constructor.prototype = {
		constructor: Constructor,

		readDictionary: readDictionary,
//		addWord: addWord,

		isCorrect: isCorrect,
		suggest: suggest
	};


	return Constructor;

});
