/**
 * Hunspell-style dictionaries.
 *
 * @class HunspellDictionary
 *
 * @see {@link https://github.com/cfinke/Typo.js}
 */
define(function(){

	var EOL = '\r\n',
		SEPARATOR = /\s+/;


	/**
	 * @param {String} affData	The data from the dictionary's .aff file
	 * @param {String} dicData	The data from the dictionary's .dic file
	 * @param {Object} flags	Flag settings
	 * @returns {Typo} A HunspellDictionary object
	 */
	var Constructor = function(affData, dicData, flags){
		this.flags = flags || {};

		parseAFF.call(this, affData);

		parseDIC.call(this, dicData);
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
			definitionParts, ruleType;
		for(i = 0; i < len; i ++){
			if(!lines[i])
				continue;

			definitionParts = lines[i].split(SEPARATOR);

			ruleType = definitionParts.shift();

			if(ruleType == 'PFX' || ruleType == 'SFX')
				i += parseSuffix.call(this, ruleType, definitionParts, lines, i);
			else if(ruleType == 'COMPOUNDRULE')
				i += parseCompoundRule.call(this, definitionParts, lines, i);
			else if(ruleType == 'REP')
				i += parseReplacementTable.call(this, definitionParts, lines, i);
			else if(ruleType == 'ICONV')
				i += parseIConv.call(this, definitionParts, lines, i);
			else if(ruleType == 'MAP')
				i += parseMap.call(this, definitionParts, lines, i);
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

		data = null;
	};

	/** @private */
	var parseSuffix = function(ruleType, definitionParts, lines, i){
		var ruleCode = definitionParts[0],
			combineable = (definitionParts[1] == 'Y'),
			numEntries = parseInt(definitionParts[2], 10);

		var entries = [],
			sublen = i + 1 + numEntries,
			j, lineParts, charactersToRemove, additionParts, regexToMatch,
			continuationClasses, entry;
		for(j = i + 1; j < sublen; j ++){
			lineParts = lines[j].split(SEPARATOR);
			charactersToRemove = lineParts[2];
			additionParts = lineParts[3].split('/');
			regexToMatch = lineParts[4];

			continuationClasses = parseRuleCodes.call(this, additionParts[1]);

			entry = {
				add: (additionParts[0] == '0'? '': additionParts[0])
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

		return numEntries;
	};

	/** @private */
	var parseCompoundRule = function(definitionParts, lines, i){
		var numEntries = parseInt(definitionParts[0], 10),
			len = i + 1 + numEntries,
			j, lineParts;
		for(j = i + 1; j < len; j ++){
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

		//get rid of any codes from the compound rule codes that are never used (or that were special regex characters)
		//not especially necessary...
		Object.keys(this.compoundRuleCodes).forEach(function(code){
			if(!code.length)
				this[code] = null;
		}, this.compoundRuleCodes);

		//build the full regular expressions for each compound rule
		//(I have a feeling (but no confirmation yet) that this method of testing for compound words is probably slow)
		this.compoundRules.forEach(function(ruleText, idx){
			var expressionText = '';
			ruleText.split('').forEach(function(chr){
				expressionText += (chr in this? '(' + this[chr].join('|') + ')': chr);
			}, this);

			this[idx] = new RegExp(expressionText, 'i');
		}, this.compoundRules);

		return numEntries;
	};

	/** @private */
	var parseReplacementTable = function(definitionParts, lines, i){
		var numEntries = parseInt(definitionParts[0], 10),
			len = i + 1 + numEntries,
			j, lineParts;
		for(j = i + 1; j < len; j ++){
			lineParts = lines[j].split(SEPARATOR);
			if(lineParts.length == 3)
				this.replacementTable.push([lineParts[1], lineParts[2]]);
		}
		return numEntries;
	};

	/** @private */
	var parseIConv = function(definitionParts, lines, i){
		var numEntries = parseInt(definitionParts[0], 10),
			len = i + 1 + numEntries,
			j, lineParts;
		for(j = i + 1; j < len; j ++){
			lineParts = lines[j].split(SEPARATOR);
			if(lineParts.length == 3)
				this.iconvTable.push([lineParts[1], lineParts[2]]);
		}
		return numEntries;
	};

	/** @private */
	var parseMap = function(definitionParts, lines, i){
		var numEntries = parseInt(definitionParts[0], 10),
			len = i + 1 + numEntries,
			j, lineParts;
		for(j = i + 1; j < len; j ++){
			lineParts = lines[j].split(SEPARATOR);
			if(lineParts.length == 2)
				this.mapTable.push(lineParts[1]);
		}
		return numEntries;
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
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$|\r?\n$/, '');
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
		if(parseInt(lines.shift(), 10) != lines.length)
			throw 'Number of rows in the dictionary does not match the count number';

		var word, ruleCodesArray,
			rule, k, combineRule;
		lines.forEach(function(parts){
			parts = parts.split('/');

			word = parts[0];

			//now for each affix rule, generate that form of the word
			if(parts.length > 1){
				ruleCodesArray = parseRuleCodes.call(this, parts[1]);

				//save the ruleCodes for compound word situations
				if(!('NEEDAFFIX' in this.flags) || ruleCodesArray.indexOf(this.flags.NEEDAFFIX) < 0)
					//addWordToDictionary.call(this, word, ruleCodesArray);
					addWordToDictionary.call(this, word)

				ruleCodesArray.forEach(function(code, j){
					rule = this.rules[code];
					if(rule)
						applyRule.call(this, word, rule).forEach(function(newWord){
							addWordToDictionary.call(this, newWord);

							if(rule.combineable)
								for(k = j + 1; k < ruleCodesArray.length; k ++){
									combineRule = this.rules[ruleCodesArray[k]];
									if(combineRule && combineRule.combineable && rule.type != combineRule.type)
										applyRule.call(this, newWord, combineRule).forEach(function(word){
											addWordToDictionary.call(this, word);
										}, this);
								}
						}, this);

					if(this.compoundRuleCodes[code])
						this.compoundRuleCodes[code].push(word);
				}, this);
			}
			else
				addWordToDictionary.call(this, word.trim());
		}, this);

		data = null;
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
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$|\r?\n$/, '');
	};

	/** @private */
	var addWordToDictionary = function(word, rules){
		//NOTE: some dictionaries will list the same word multiple times with different rule sets
		if(!(word in this.dictionaryTable) || typeof this.dictionaryTable[word] != 'object')
			this.dictionaryTable[word] = null;
		if(rules && rules.length){
			if(!this.dictionaryTable[word])
				this.dictionaryTable[word] = [];
			Array.prototype.push.apply(this.dictionaryTable[word], rules);
		}
	};

	/** @private */
	var parseRuleCodes = function(textCodes){
		if(!textCodes)
			return [];

		if(!('FLAG' in this.flags) || this.flags.FLAG == 'UTF-8')
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
				newWord = (entry.remove? word.replace(entry.remove, ''): word);
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


	Constructor.prototype = {
		constructor: Constructor
	};

	return Constructor;

});
