/**
 * Spellchecker using Hunspell-style dictionaries.
 *
 * @class Hunspell
 *
 * @see {@link https://github.com/cfinke/Typo.js}
 */
define(function(){

	/**
	 * @param {String} affData	The data from the dictionary's .aff file
	 * @param {String} dicData	The data from the dictionary's .dic file
	 * @param {Object} flags	Flag settings
	 * @returns {Typo} A Typo object.
	 */
	var Constructor = function(affData, dicData, flags){
		this.rules = {};
		this.dictionaryTable = {};
		this.compoundRules = [];
		this.replacementTable = [];
		this.flags = flags || {};
		this.rules = parseAFF.call(this, affData);

		//save the rule codes that are used in compound rules
		this.compoundRuleCodes = {};

		var ilen = this.compoundRules.length,
			i, j,
			jlen, rule;
		for(i = 0; i < ilen; i ++){
			rule = this.compoundRules[i];
			jlen = rule.length;
			for(j = 0; j < jlen; j ++)
				this.compoundRuleCodes[rule[j]] = [];
		}

		//if we add this ONLYINCOMPOUND flag to this.compoundRuleCodes, then _parseDIC will do the work of saving the list of words
		//that are compound-only
		if('ONLYINCOMPOUND' in this.flags)
			this.compoundRuleCodes[this.flags.ONLYINCOMPOUND] = [];

		this.dictionaryTable = parseDIC.call(this, dicData);

		//get rid of any codes from the compound rule codes that are never used (or that were special regex characters)
		//not especially necessary...
		for(i in this.compoundRuleCodes)
			if(!this.compoundRuleCodes[i].length)
				delete this.compoundRuleCodes[i];

		//build the full regular expressions for each compound rule
		//(I have a feeling (but no confirmation yet) that this method of testing for compound words is probably slow)
		var ruleText, expressionText, chr;
		ilen = this.compoundRules.length;
		for(i = 0; i < ilen; i ++){
			ruleText = this.compoundRules[i];

			expressionText = '';

			jlen = ruleText.length;
			for(j = 0; j < jlen; j ++){
				chr = ruleText[j];
				expressionText += (chr in this.compoundRuleCodes? '(' + this.compoundRuleCodes[chr].join('|') + ')': chr);
			}

			this.compoundRules[i] = new RegExp(expressionText, 'i');
		}

		return this;
	};

	/**
	 * Loads a Typo instance from a hash of all of the Typo properties.
	 *
	 * @param {object} obj	A hash of Typo properties, probably gotten from a JSON.parse(JSON.stringify(typo_instance))
	 */
	var load = function(obj){
		for(var i in obj)
			this[i] = obj[i];
		return this;
	};

	/**
	 * Parse the rules out from a .aff file.
	 *
	 * @param {String} data	The contents of the affix file
	 * @returns {object}		The rules from the file
	 */
	var parseAFF = function(data){
		var rules = {};

		//remove comment lines
		data = removeAffixComments.call(this, data);

		var lines = data.split('\n');

		for(var i = 0, len = lines.length; i < len; i++){
			var line = lines[i];

			var definitionParts = line.split(/\s+/);

			var ruleType = definitionParts[0];

			if(ruleType == 'PFX' || ruleType == 'SFX'){
				var ruleCode = definitionParts[1];
				var combineable = definitionParts[2];
				var numEntries = parseInt(definitionParts[3], 10);

				var entries = [];

				for(var j = i + 1, _jlen = i + 1 + numEntries; j < _jlen; j++){
					var line = lines[j];

					var lineParts = line.split(/\s+/);
					var charactersToRemove = lineParts[2];

					var additionParts = lineParts[3].split('/');

					var charactersToAdd = additionParts[0];
					if(charactersToAdd === '0')
						charactersToAdd = '';

					var continuationClasses = parseRuleCodes.call(this, additionParts[1]);
					var regexToMatch = lineParts[4];

					var entry = {};
					entry.add = charactersToAdd;
					if(continuationClasses.length > 0)
						entry.continuationClasses = continuationClasses;
					if(regexToMatch !== '.')
						entry.match = new RegExp(ruleType === 'SFX'? regexToMatch + '$': '^' + regexToMatch);
					if(charactersToRemove != '0')
						entry.remove = new RegExp(ruleType === 'SFX'? charactersToRemove + '$': charactersToRemove);

					entries.push(entry);
				}

				rules[ruleCode] = {'type': ruleType, 'combineable': (combineable == 'Y'), 'entries': entries};

				i += numEntries;
			}
			else if(ruleType === 'COMPOUNDRULE'){
				var numEntries = parseInt(definitionParts[1], 10);

				for(var j = i + 1, _jlen = i + 1 + numEntries; j < _jlen; j++){
					var line = lines[j];

					var lineParts = line.split(/\s+/);
					this.compoundRules.push(lineParts[1]);
				}

				i += numEntries;
			}
			else if(ruleType === 'REP'){
				var lineParts = line.split(/\s+/);

				if(lineParts.length === 3)
					this.replacementTable.push([lineParts[1], lineParts[2]]);
			}
			else{
				//ONLYINCOMPOUND
				//COMPOUNDMIN
				//FLAG
				//KEEPCASE
				//NEEDAFFIX

				this.flags[ruleType] = definitionParts[1];
			}
		}

		return rules;
	};

	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data The data from an affix file.
	 * @return {String} The cleaned-up data.
	 */
	var removeAffixComments = function(data){
		// Remove comments
		data = data.replace(/#.*$/mg, '');

		// Trim each line
		data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '');

		// Remove blank lines.
		data = data.replace(/\n{2,}/g, '\n');

		// Trim the entire string
		data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

		return data;
	};

	/**
	 * Parses the words out from the .dic file.
	 *
	 * @param {String} data The data from the dictionary file.
	 * @returns object The lookup table containing all of the words and
	 *                 word forms from the dictionary.
	 */
	var parseDIC = function(data){
		data = removeDicComments.call(this, data);

		var lines = data.split('\n');
		var dictionaryTable = {};

		function addWord(word, rules){
			//some dictionaries will list the same word multiple times with different rule sets
			if(!(word in dictionaryTable) || typeof dictionaryTable[word] != 'object')
				dictionaryTable[word] = [];

			dictionaryTable[word].push(rules);
		}

		//the first line is the number of words in the dictionary
		for(var i = 1, len = lines.length; i < len; i ++){
			var line = lines[i];

			var parts = line.split('/', 2);

			var word = parts[0];

			//now for each affix rule, generate that form of the word
			if(parts.length > 1){
				var ruleCodesArray = parseRuleCodes.call(this, parts[1]);

				//save the ruleCodes for compound word situations
				if(!('NEEDAFFIX' in this.flags) || ruleCodesArray.indexOf(this.flags.NEEDAFFIX) < 0)
					addWord(word, ruleCodesArray);

				for(var j = 0, jlen = ruleCodesArray.length; j < jlen; j ++){
					var code = ruleCodesArray[j];
					var rule = this.rules[code];

					if(rule){
						var newWords = applyRule.call(this, word, rule);
						for(var ii = 0, iilen = newWords.length; ii < iilen; ii ++){
							var newWord = newWords[ii];
							addWord(newWord, []);

							if(rule.combineable)
								for(var k = j + 1; k < jlen; k ++){
									var combineCode = ruleCodesArray[k];
									var combineRule = this.rules[combineCode];
									if(combineRule && combineRule.combineable && (rule.type != combineRule.type)){
										var otherNewWords = applyRule.call(this, newWord, combineRule);
										for(var iii = 0, iiilen = otherNewWords.length; iii < iiilen; iii ++)
											addWord(otherNewWords[iii], []);
									}
								}
						}
					}

					if(code in this.compoundRuleCodes){
						this.compoundRuleCodes[code].push(word);
					}
				}
			}
			else
				addWord(word.trim(), []);
		}

		return dictionaryTable;
	};

	/**
	 * Removes comment lines and then cleans up blank lines and trailing whitespace.
	 *
	 * @param {String} data The data from a .dic file.
	 * @return {String} The cleaned-up data.
	 */
	var removeDicComments = function(data){
		// I can't find any official documentation on it, but at least the de_DE
		// dictionary uses tab-indented lines as comments.

		// Remove comments
		data = data.replace(/^\t.*$/mg, '');

		return data;

		// Trim each line
		data = data.replace(/^\s\s*/m, '').replace(/\s\s*$/m, '');

		// Remove blank lines.
		data = data.replace(/\n{2,}/g, '\n');

		// Trim the entire string
		data = data.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

		return data;
	};

	var parseRuleCodes = function(textCodes){
		if(!textCodes)
			return [];
		else if(!('FLAG' in this.flags))
			return textCodes.split('');
		else if(this.flags.FLAG === 'long'){
			var flags = [];

			for(var i = 0, _len = textCodes.length; i < _len; i += 2)
				flags.push(textCodes.substr(i, 2));

			return flags;
		}
		else if(this.flags.FLAG === 'num')
			return textCode.split(',');
	};

	/**
	 * Applies an affix rule to a word.
	 *
	 * @param {String} word The base word.
	 * @param {Object} rule The affix rule.
	 * @returns {String[]} The new words generated by the rule.
	 */
	var applyRule = function(word, rule){
		var entries = rule.entries;
		var newWords = [];

		for(var i = 0, ilen = entries.length; i < ilen; i ++){
			var entry = entries[i];

			if(!entry.match || word.match(entry.match)){
				var newWord = word;

				if(entry.remove)
					newWord = newWord.replace(entry.remove, '');

				if(rule.type === 'SFX')
					newWord = newWord + entry.add;
				else
					newWord = entry.add + newWord;

				newWords.push(newWord);

				if('continuationClasses' in entry)
					for(var j = 0, jlen = entry.continuationClasses.length; j < jlen; j ++){
						var continuationRule = this.rules[entry.continuationClasses[j]];

						if(continuationRule)
							newWords = newWords.concat(applyRule.call(this, newWord, continuationRule));
						/*
						 else {
							 // This shouldn't happen, but it does, at least in the de_DE dictionary.
							 // I think the author mistakenly supplied lower-case rule codes instead
							 // of upper-case.
						 }
						 */
					}
			}
		}

		return newWords;
	};

	/**
	 * Checks whether a word or a capitalization variant exists in the current dictionary.
	 * The word is trimmed and several variations of capitalizations are checked.
	 * If you want to check a word without any changes made to it, call checkExact()
	 *
	 * @see http://blog.stevenlevithan.com/archives/faster-trim-javascript re:trimming function
	 *
	 * @param {String} aWord The word to check.
	 * @returns {Boolean}
	 */
	var check = function(aWord){
		// Remove leading and trailing whitespace
		var trimmedWord = aWord.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		if(checkExact.call(this, trimmedWord))
			return true;

		// The exact word is not in the dictionary.
		if(trimmedWord.toUpperCase() === trimmedWord){
			// The word was supplied in all uppercase.
			// Check for a capitalized form of the word.
			var capitalizedWord = trimmedWord[0] + trimmedWord.substring(1).toLowerCase();

			if(hasFlag.call(this, capitalizedWord, 'KEEPCASE'))
				// Capitalization variants are not allowed for this word.
				return false;

			if(checkExact.call(this, capitalizedWord))
				return true;
		}

		var lowercaseWord = trimmedWord.toLowerCase();

		if(lowercaseWord !== trimmedWord){
			if(hasFlag.call(this, lowercaseWord, 'KEEPCASE'))
				// Capitalization variants are not allowed for this word.
				return false;

			// Check for a lowercase form
			if(checkExact.call(this, lowercaseWord))
				return true;
		}

		return false;
	};

	/**
	 * Checks whether a word exists in the current dictionary.
	 *
	 * @param {String} word The word to check.
	 * @returns {Boolean}
	 */
	var checkExact = function(word){
		var ruleCodes = this.dictionaryTable[word];

		if(typeof ruleCodes === 'undefined'){
			// Check if this might be a compound word.
			if('COMPOUNDMIN' in this.flags && word.length >= this.flags.COMPOUNDMIN)
				for(var i = 0, ilen = this.compoundRules.length; i < ilen; i ++)
					if(word.match(this.compoundRules[i]))
						return true;
			return false;
		}
		else{
			for(var i = 0, ilen = ruleCodes.length; i < ilen; i ++)
				if(!hasFlag.call(this, word, 'ONLYINCOMPOUND', ruleCodes[i]))
					return true;
			return false;
		}
	};

	/**
	 * Looks up whether a given word is flagged with a given flag.
	 *
	 * @param {String} word The word in question.
	 * @param {String} flag The flag in question.
	 * @return {Boolean}
	 */
	var hasFlag = function(word, flag){
		if(flag in this.flags){
			if(typeof wordFlags === 'undefined')
				var wordFlags = Array.prototype.concat.apply([], this.dictionaryTable[word]);

			if(wordFlags && wordFlags.indexOf(this.flags[flag]) >= 0)
				return true;
		}

		return false;
	};

	/**
	 * Returns a list of suggestions for a misspelled word.
	 *
	 * @see http://www.norvig.com/spell-correct.html for the basis of this suggestor.
	 * This suggestor is primitive, but it works.
	 *
	 * @param {String} word The misspelling.
	 * @param {Number} [limit=5] The maximum number of suggestions to return.
	 * @returns {String[]} The array of suggestions.
	 */
	var alphabet = '';

	var suggest = function(word, limit){
		if(!limit)
			limit = 5;

		if(this.check(word))
			return [];

		// Check the replacement table.
		for(var i = 0, _len = this.replacementTable.length; i < _len; i++){
			var replacementEntry = this.replacementTable[i];

			if(word.indexOf(replacementEntry[0]) !== -1){
				var correctedWord = word.replace(replacementEntry[0], replacementEntry[1]);

				if(this.check(correctedWord))
					return [correctedWord];
			}
		}

		var self = this;
		self.alphabet = 'abcdefghijklmnopqrstuvwxyz';

		/*
		 if (!self.alphabet) {
		 // Use the alphabet as implicitly defined by the words in the dictionary.
		 var alphaHash = {};

		 for (var i in self.dictionaryTable) {
		 for (var j = 0, _len = i.length; j < _len; j++) {
		 alphaHash[i[j]] = true;
		 }
		 }

		 for (var i in alphaHash) {
		 self.alphabet += i;
		 }

		 var alphaArray = self.alphabet.split('');
		 alphaArray.sort();
		 self.alphabet = alphaArray.join('');
		 }
		 */

		function edits1(words){
			var rv = [];

			for(var ii = 0, _iilen = words.length; ii < _iilen; ii++){
				var word = words[ii];

				var splits = [];

				for(var i = 0, _len = word.length + 1; i < _len; i++)
					splits.push([word.substring(0, i), word.substring(i, word.length)]);

				var deletes = [];

				for(var i = 0, _len = splits.length; i < _len; i++){
					var s = splits[i];

					if(s[1])
						deletes.push(s[0] + s[1].substring(1));
				}

				var transposes = [];

				for(var i = 0, _len = splits.length; i < _len; i++){
					var s = splits[i];

					if(s[1].length > 1)
						transposes.push(s[0] + s[1][1] + s[1][0] + s[1].substring(2));
				}

				var replaces = [];

				for(var i = 0, _len = splits.length; i < _len; i++){
					var s = splits[i];

					if(s[1])
						for(var j = 0, _jlen = self.alphabet.length; j < _jlen; j++)
							replaces.push(s[0] + self.alphabet[j] + s[1].substring(1));
				}

				var inserts = [];

				for(var i = 0, _len = splits.length; i < _len; i++){
					var s = splits[i];

					if(s[1])
						for(var j = 0, _jlen = self.alphabet.length; j < _jlen; j++)
							replaces.push(s[0] + self.alphabet[j] + s[1]);
				}

				rv = rv.concat(deletes);
				rv = rv.concat(transposes);
				rv = rv.concat(replaces);
				rv = rv.concat(inserts);
			}

			return rv;
		}

		function known(words){
			var rv = [];

			for(var i = 0; i < words.length; i++)
				if(self.check(words[i]))
					rv.push(words[i]);

			return rv;
		}

		function correct(word){
			// Get the edit-distance-1 and edit-distance-2 forms of this word.
			var ed1 = edits1([word]);
			var ed2 = edits1(ed1);

			var corrections = known(ed1).concat(known(ed2));

			// Sort the edits based on how many different ways they were created.
			var weighted_corrections = {};

			for(var i = 0, _len = corrections.length; i < _len; i++){
				if(!(corrections[i] in weighted_corrections))
					weighted_corrections[corrections[i]] = 1;
				else
					weighted_corrections[corrections[i]] += 1;
			}

			var sorted_corrections = [];

			for(var i in weighted_corrections)
				sorted_corrections.push([i, weighted_corrections[i]]);

			function sorter(a, b){
				if(a[1] < b[1])
					return -1;
				return 1;
			}

			sorted_corrections.sort(sorter).reverse();

			var rv = [];

			for(var i = 0, _len = Math.min(limit, sorted_corrections.length); i < _len; i++)
				if(!hasFlag.call(self, sorted_corrections[i][0], 'NOSUGGEST'))
					rv.push(sorted_corrections[i][0]);

			return rv;
		}

		return correct(word);
	};


	Constructor.prototype = {
		constructor: Constructor,

		check: check,
		suggest: suggest
	};

	return Constructor;

});
