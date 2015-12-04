/**
 * Spellchecker using Hunspell-style dictionaries.
 *
 * @class Hunspell
 *
 * @see {@link https://github.com/cfinke/Typo.js}
 */
define(['tools/spellchecker/HunspellDictionary', 'tools/data/MathHelper', 'tools/spellchecker/NorvigSpellChecker'], function(Hunspelldictionary, MathHelper, NorvigSpellChecker){

	/**
	 * @param {String} affData	The data from the dictionary's .aff file
	 * @param {String} dicData	The data from the dictionary's .dic file
	 * @param {Object} flags	Flag settings
	 * @returns {Typo} A Hunspell object
	 */
	var Constructor = function(affData, dicData, flags){
		this.dictionary = new Hunspelldictionary(affData, dicData, flags);
	};

	/**
	 * Checks whether a word or a capitalization variant exists in the current dictionary.
	 * The word is trimmed and several variations of capitalizations are checked.
	 * If you want to check a word without any changes made to it, call <code>checkExact()</code>.
	 *
	 * @param {String} word	The word to check.
	 * @returns {Boolean}
	 */
	var check = function(word){
		//remove leading and trailing whitespace
		word = word.trim();

		if(this.checkExact(word))
			return true;

		//the exact word is not in the dictionary
		if(word.toUpperCase() == word){
			//the word was supplied in all uppercase
			//check for a capitalized form of the word
			var capitalizedWord = word[0] + word.substring(1).toLowerCase();

			if(hasFlag.call(this, capitalizedWord, 'KEEPCASE'))
				//capitalization variants are not allowed for this word
				return false;

			if(this.checkExact(capitalizedWord))
				return true;
		}

		var lowercaseWord = word.toLowerCase();
		if(lowercaseWord != word){
			if(hasFlag.call(this, lowercaseWord, 'KEEPCASE'))
				//capitalization variants are not allowed for this word
				return false;

			//check for a lowercase form
			if(this.checkExact(lowercaseWord))
				return true;
		}

		return false;
	};

	/**
	 * Checks whether a word exists in the current dictionary.
	 *
	 * @param {String} word	The word to check.
	 * @returns {Boolean}
	 */
	var checkExact = function(word){
		var ruleCodes = this.dictionary.dictionaryTable[word];
		if(typeof ruleCodes == 'undefined'){
			//check if this might be a compound word
			if('COMPOUNDMIN' in this.dictionary.flags && word.length >= this.dictionary.flags.COMPOUNDMIN)
				return this.dictionary.compoundRules.some(function(rule){ return word.match(rule); });
			return false;
		}
		return ruleCodes.some(function(code){ return !hasFlag.call(this, word, 'ONLYINCOMPOUND', code); }, this);
	};

	/**
	 * Looks up whether a given word is flagged with a given flag.
	 *
	 * @param {String} word	The word in question.
	 * @param {String} flag	The flag in question.
	 * @return {Boolean}
	 *
	 * @private
	 */
	var hasFlag = function(word, flag, wordFlags){
		if(flag in this.dictionary.flags){
			if(typeof wordFlags == 'undefined')
				wordFlags = [].concat(this.dictionary.dictionaryTable[word]);

			if(wordFlags && wordFlags.indexOf(this.dictionary.flags[flag]) >= 0)
				return true;
		}
		return false;
	};

	/**
	 * Returns a list of suggestions for a misspelled word.
	 *
	 * @see {@link http://www.norvig.com/spell-correct.html} for the basis of this suggestor.
	 * This suggestor is primitive, but it works.
	 *
	 * @param {String} word			The misspelling.
	 * @param {Number} [limit=5]	The maximum (positive integer) number of suggestions to return.
	 * @returns {Array}				The array of suggestions in the form [[word, ln(probability)], [...]].
	 */
	var suggest = function(word, limit){
		limit = (limit || 5) | 0;
		if(limit <= 0)
			limit = 1;

		//check the word
		if(this.check(word))
			return [word];

		//check the replacement table
		var results = checkReplacementTable.call(this, word);
		if(results.length)
			return results;

		//check with the spell checker
		results = checkWithSpellChecker.call(this, word);
		if(results.length > limit)
			results.length = limit;
		return results;
	};

	/** @private */
	var checkReplacementTable = function(word){
		var indexes = [],
			found = [],
			re, m;
		this.dictionary.replacementTable.forEach(function(entry){
			re = new RegExp(entry[0], 'g');
			while(m = re.exec(word))
				indexes.push([m.index, entry]);
		});
		if(indexes.length){
			var combo = MathHelper.combineAll(indexes.length),
				correctedWord;
			combo.forEach(function(singleton){
				correctedWord = word;
				singleton.forEach(function(substitution){
					substitution = indexes[substitution];
					correctedWord = correctedWord.replace(new RegExp('^(.{' + substitution[0] + '})' + substitution[1][0]), '$1' + substitution[1][1]);
				});
				if(this.check(correctedWord))
					found.push(correctedWord);
			}, this);
		}

		return found;
	};

	/** @private */
	var checkWithSpellChecker = function(word){
		if(!this.spellChecker){
			this.spellChecker = new NorvigSpellChecker(this.dictionary.flags.TRY);
			this.spellChecker.readDictionary(Object.keys(this.dictionary.dictionaryTable));
		}

		return this.spellChecker.suggest(word);
	};


	Constructor.prototype = {
		constructor: Constructor,

		check: check,
		checkExact: checkExact,
		suggest: suggest
	};

	return Constructor;

});
