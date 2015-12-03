/**
 * Spellchecker using Hunspell-style dictionaries.
 *
 * @class Hunspell
 *
 * @see {@link https://github.com/cfinke/Typo.js}
 */
define(['tools/spellchecker/NorvigSpellChecker'], function(NorvigSpellChecker){

	var EOL = '\r\n',
		SEPARATOR = /\s+/;


	/**
	 * @param {String} affData	The data from the dictionary's .aff file
	 * @param {String} dicData	The data from the dictionary's .dic file
	 * @param {Object} flags	Flag settings
	 * @returns {Typo} A Hunspell object
	 */
	var Constructor = function(affData, dicData, flags){
		this.flags = flags || {};

		parseAFF.call(this, affData);

		this.spellchecker = new NorvigSpellChecker(this.flags.TRY);

		parseDIC.call(this, dicData);

		this.spellchecker.readDictionary(Object.keys(this.dictionaryTable));

		//get rid of any codes from the compound rule codes that are never used (or that were special regex characters)
		//not especially necessary...
		Object.keys(this.compoundRuleCodes).forEach(function(code){
			if(!code.length)
				delete this[code];
		}, this.compoundRuleCodes);

		//build the full regular expressions for each compound rule
		//(I have a feeling (but no confirmation yet) that this method of testing for compound words is probably slow)
		this.compoundRules.forEach(function(ruleText, idx){
			var expressionText = '';
			ruleText.split('').forEach(function(chr){
				expressionText += (chr in this? '(' + this[chr].join('|') + ')': chr);
			}, this.compoundRuleCodes);

			this.compoundRules[idx] = new RegExp(expressionText, 'i');
		}, this);
	};

	/**
	 * Parse the rules out from a .aff file.
	 *
	 * @param {String} data	The contents of the affix file
	 * @returns {object}		The rules from the file
	 *
	 * @private
	 */
	var parseAFF = function(data){
		this.compoundRules = [];
		this.compoundRuleCodes = {};
		this.replacementTable = [];
		this.iconvTable = [];
		this.mapTable = [];
		this.rules = {};

		//remove comment lines
		data = removeAffixComments.call(this, data);

		var lines = data.split(/\r?\n/),
			len = lines.length,
			i,
			definitionParts, ruleType,
			ruleCode, combineable, numEntries, entries,
			j, sublen,
			lineParts, charactersToRemove, additionParts, charactersToAdd, continuationClasses, regexToMatch, entry;
		for(i = 0; i < len; i ++){
			if(!lines[i])
				continue;

			definitionParts = lines[i].split(SEPARATOR);

			ruleType = definitionParts.shift();

			if(ruleType == 'PFX' || ruleType == 'SFX'){
				ruleCode = definitionParts[0];
				combineable = (definitionParts[1] == 'Y');
				numEntries = parseInt(definitionParts[2], 10);

				entries = [];
				sublen = i + 1 + numEntries;
				for(j = i + 1; j < sublen; j ++){
					lineParts = lines[j].split(SEPARATOR);
					charactersToRemove = lineParts[2];

					additionParts = lineParts[3].split('/');

					charactersToAdd = additionParts[0];
					if(charactersToAdd == '0')
						charactersToAdd = '';

					continuationClasses = parseRuleCodes.call(this, additionParts[1]);
					regexToMatch = lineParts[4];

					entry = {
						add: charactersToAdd
					};
					if(continuationClasses.length)
						entry.continuationClasses = continuationClasses;
					if(regexToMatch && regexToMatch != '.')
						entry.match = new RegExp(ruleType == 'SFX'? regexToMatch + '$': '^' + regexToMatch);
					if(charactersToRemove != '0')
						entry.remove = new RegExp(ruleType == 'SFX'? charactersToRemove + '$': '^' + charactersToRemove);
					entries.push(entry);
				}

				this.rules[ruleCode] = {type: ruleType, combineable: combineable, entries: entries};

				i += numEntries;
			}
			else if(ruleType == 'COMPOUNDRULE'){
				numEntries = parseInt(definitionParts[0], 10);

				sublen = i + 1 + numEntries;
				for(j = i + 1; j < sublen; j ++){
					lineParts = lines[j].split(SEPARATOR);
					this.compoundRules.push(lineParts[1]);
				}

				//save the rule codes that are used in compound rules
				this.compoundRules.forEach(function(rule){
					rule.split('').forEach(function(r){
						this[r] = [];
					}, this);
				}, this.compoundRuleCodes);

				//if there is the ONLYINCOMPOUND flag then parseDIC will do the work of saving the list of words that are compound-only
				if('ONLYINCOMPOUND' in this.flags)
					this.compoundRuleCodes[this.flags.ONLYINCOMPOUND] = [];

				i += numEntries;
			}
			else if(ruleType == 'REP'){
				numEntries = parseInt(definitionParts[0], 10);

				sublen = i + 1 + numEntries;
				for(j = i + 1; j < sublen; j ++){
					lineParts = lines[j].split(SEPARATOR);
					if(lineParts.length == 3)
						this.replacementTable.push([lineParts[1], lineParts[2]]);
				}

				i += numEntries;
			}
			else if(ruleType == 'ICONV'){
				numEntries = parseInt(definitionParts[0], 10);

				sublen = i + 1 + numEntries;
				for(j = i + 1; j < sublen; j ++){
					lineParts = lines[j].split(SEPARATOR);
					if(lineParts.length == 3)
						this.iconvTable.push([lineParts[1], lineParts[2]]);
				}

				i += numEntries;
			}
			else if(ruleType == 'MAP'){
				numEntries = parseInt(definitionParts[0], 10);

				sublen = i + 1 + numEntries;
				for(j = i + 1; j < sublen; j ++){
					lineParts = lines[j].split(SEPARATOR);
					if(lineParts.length == 2)
						this.mapTable.push(lineParts[1]);
				}

				i += numEntries;
			}
			else if(ruleType == 'NAME' || ruleType == 'VERSION')
				this.flags[ruleType] = definitionParts.join(' ');
			else{
				//HOME
				//LANG
				//SET
				//TRY
				//WORDCHARS
				//ONLYINCOMPOUND
				//COMPOUNDMIN
				//FLAG
				//KEEPCASE
				//NEEDAFFIX

				this.flags[ruleType] = definitionParts[0];
			}
		}
	};

	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data	The data from an affix file.
	 * @return {String}		The cleaned-up data.
	 *
	 * @private
	 */
	var removeAffixComments = function(data){
		return data
			//remove comments
			.replace(/\s*#.*$/mg, '')
			//trim each line
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$/m, '')
			//remove blank lines
			.replace(/(\r?\n){2,}/g, EOL)
			//trim the entire string
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$/, '');
	};

	/**
	 * Parses the words out from the .dic file.
	 *
	 * @param {String} data	The data from the dictionary file
	 * @returns object		The lookup table containing all of the words and word forms from the dictionary
	 *
	 * @private
	 */
	var parseDIC = function(data){
		this.dictionaryTable = {};

		data = removeDictionaryComments.call(this, data);

		var lines = data.split(/\r?\n/);

		//the first line is the number of words in the dictionary
		var len = parseInt(lines.shift(), 10),
			i, parts, word,
			ruleCodesArray,
			sublen,
			rule,
			k,
			combineRule;
		for(i = 0; i < len; i ++){
			parts = lines[i].split('/');

			word = parts[0];

			//now for each affix rule, generate that form of the word
			if(parts.length > 1){
				ruleCodesArray = parseRuleCodes.call(this, parts[1]);

				//save the ruleCodes for compound word situations
				if(!('NEEDAFFIX' in this.flags) || ruleCodesArray.indexOf(this.flags.NEEDAFFIX) < 0)
					addWordToDictionary.call(this, word, ruleCodesArray);

				sublen = ruleCodesArray.length;
				ruleCodesArray.forEach(function(code, j){
					rule = this.rules[code];

					if(rule){
						applyRule.call(this, word, rule).forEach(function(newWord){
							addWordToDictionary.call(this, newWord, []);

							if(rule.combineable)
								for(k = j + 1; k < sublen; k ++){
									combineRule = this.rules[ruleCodesArray[k]];
									if(combineRule && combineRule.combineable && rule.type != combineRule.type)
										applyRule.call(this, newWord, combineRule).forEach(function(word){
											addWordToDictionary.call(this, word, []);
										}, this);
								}
						}, this);
					}

					if(code in this.compoundRuleCodes)
						this.compoundRuleCodes[code].push(word);
				}, this);
			}
			else
				addWordToDictionary.call(this, word.trim(), []);
		}
	};

	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data	The data from a .dic file
	 * @return {String}		The cleaned-up data
	 *
	 * @private
	 */
	var removeDictionaryComments = function(data){
		return data
			//remove comments
			//.replace(/\s*#.*$/mg, '')
			//I can't find any official documentation on it, but at least the de_DE dictionary uses tab-indented lines as comments
			//.replace(/^\t.*$/mg, '');
			//trim each line
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$/m, '')
			//remove blank lines
			.replace(/(\r?\n){2,}/g, EOL)
			//trim the entire string
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$/, '');
	};

	/** @private */
	var addWordToDictionary = function(word, rules){
		//NOTE: some dictionaries will list the same word multiple times with different rule sets
		if(!(word in this.dictionaryTable) || typeof this.dictionaryTable[word] != 'object')
			this.dictionaryTable[word] = [];
		this.dictionaryTable[word].push(rules);
	};

	/** @private */
	var parseRuleCodes = function(textCodes){
		if(!textCodes)
			return [];

		if(!('FLAG' in this.flags))
			return textCodes.split('');
		if(this.flags.FLAG == 'long')
			return textCodes.match(/.{2}/g);
		if(this.flags.FLAG == 'num')
			return textCodes.split(',');
	};

	/**
	 * Applies an affix rule to a word.
	 *
	 * @param {String} word	The base word.
	 * @param {Object} rule	The affix rule.
	 * @returns {String[]}	The new words generated by the rule.
	 *
	 * @private
	 */
	var applyRule = function(word, rule){
		var newWords = [],
			newWord;
		rule.entries.forEach(function(entry){
			if(!entry.match || word.match(entry.match)){
				newWord = word;
				if(entry.remove)
					newWord = newWord.replace(entry.remove, '');
				newWord = (rule.type == 'SFX'? newWord + entry.add: entry.add + newWord);

				newWords.push(newWord);

				if('continuationClasses' in entry)
					entry.continuationClasses.forEach(function(cl){
						Array.prototype.push.apply(newWords, applyRule.call(this, newWord, this.rules[cl]));
					}, this);
			}
		}, this);
		return newWords;
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
		var trimmedWord = word.trim();
		if(this.checkExact(trimmedWord))
			return true;

		//the exact word is not in the dictionary
		if(trimmedWord.toUpperCase() == trimmedWord){
			//the word was supplied in all uppercase
			//check for a capitalized form of the word
			var capitalizedWord = trimmedWord[0] + trimmedWord.substring(1).toLowerCase();

			if(hasFlag.call(this, capitalizedWord, 'KEEPCASE'))
				//capitalization variants are not allowed for this word
				return false;

			if(this.checkExact(capitalizedWord))
				return true;
		}

		var lowercaseWord = trimmedWord.toLowerCase();
		if(lowercaseWord != trimmedWord){
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
		var ruleCodes = this.dictionaryTable[word];
		if(typeof ruleCodes == 'undefined'){
			//check if this might be a compound word
			if('COMPOUNDMIN' in this.flags && word.length >= this.flags.COMPOUNDMIN)
				return this.compoundRules.some(function(rule){ return word.match(rule); });
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
		if(flag in this.flags){
			if(typeof wordFlags == 'undefined')
				wordFlags = [].concat(this.dictionaryTable[word]);

			if(wordFlags && wordFlags.indexOf(this.flags[flag]) >= 0)
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
	 * @param {Number} [limit=5]	The maximum number of suggestions to return.
	 * @returns {Object}				The object of suggestions in the form {sortedKeys: [], candidates: {}}.
	 */
	var suggest = function(word, limit){
		if(!limit)
			limit = 5;

		if(this.check(word))
			return [word];

		//check the replacement table
		var len = this.replacementTable.length,
			i, entry, correctedWord;
		for(i = 0; i < len; i ++){
			entry = this.replacementTable[i];
			if(word.indexOf(entry[0]) >= 0){
				correctedWord = word.replace(entry[0], entry[1]);
				if(this.check(correctedWord))
					return [correctedWord];
			}
		}

		return this.spellchecker.suggest(word);
	};


	Constructor.prototype = {
		constructor: Constructor,

		check: check,
		checkExact: checkExact,
		suggest: suggest
	};

	return Constructor;

});
