/**
 * Hunspell-style dictionaries.
 *
 * @class HunspellGenerator
 *
 * @see {@link https://github.com/cfinke/Typo.js}
 */
define(function(){

	var EOL = '\r\n',
		SEPARATOR = /\s+/;


	/**
	 * @param {String} affData	The data from the dictionary's .aff file
	 * @param {Object} flags	Flag settings
	 * @returns {Typo} A HunspellDictionary object
	 */
	var Constructor = function(affData, flags){
		this.flags = flags || {};

		try{
			parseAFF.call(this, affData);
		}
		catch(e){
			console.log(e);
		}
	};

	/**
	 * Parse the rules out from a .aff file.
	 *
	 * @param {String} data	The contents of the affix file
	 * @returns {object}		The rules from the file
	 *
	 * @private
	 */
	var parseAFF = (function(){
		var copyOver = function(ruleType, definitionParts){ this.flags[ruleType] = definitionParts[0]; return 0; };
		var ruleFunction = {
			PFX: function(ruleType, definitionParts, lines, i){ return parseAffix.call(this, ruleType, definitionParts, lines, i); },
			SFX: function(ruleType, definitionParts, lines, i){ return parseAffix.call(this, ruleType, definitionParts, lines, i); },
			FLAG: function(ruleType, definitionParts){ this.flags[ruleType] = definitionParts[0]; return 0; },
			KEEPCASE: copyOver
		};

		return function(data){
			this.rules = {};

			//remove comment lines
			data = removeAffixComments(data);

			var lines = data.split(/\r?\n/),
				len = lines.length,
				i,
				definitionParts, ruleType, fun;
			for(i = 0; i < len; i ++){
				definitionParts = lines[i].split(SEPARATOR);

				ruleType = definitionParts.shift();
				fun = ruleFunction[ruleType];
				if(fun)
					i += fun.call(this, ruleType, definitionParts, lines, i);
				else
					console.log('Cannot determine reader for command ' + ruleType);
			}
		};
	})();

	/** @private */
	var parseAffix = function(ruleType, definitionParts, lines, i){
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

	var extractContinuationClasses = function(line){
		var lineParts = line.split(SEPARATOR);
		var additionParts = lineParts[0].split('/');
		var continuationClasses = parseRuleCodes.call(this, additionParts[1]);
		return continuationClasses;
	};

	var hasRule = function(ruleClass){
		return (!!this.rules[ruleClass] || this.flags['KEEPCASE'] === ruleClass);
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
			.replace(/^$|\s*#.*$/mg, '')
			.replace(/^\r?\n/mg, '')
			//trim each line
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$/mg, '')
			//remove blank lines
			.replace(/(\r?\n){2,}/mg, EOL)
			//trim the entire string
			.replace(/^[^\S\r\n]+|[^\S\r\n]+$|\r?\n$/mg, '');
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

	var applyRules = function(wordFlags){
		var parts = wordFlags.split('/');
		var word = parts[0];
		var continuationClasses = parseRuleCodes.call(this, parts[1]);

		var suggestions = [{suggestion: word, productionRules: []}];
		continuationClasses.forEach(function(cl){
			var suggestionsToAdd = applyRule.call(this, word, cl);
			Array.prototype.push.apply(suggestions, suggestionsToAdd);
		}, this);

		return suggestions;
	};

	/**
	 * Applies an affix rule to a word.
	 *
	 * @param {String} word	The base word.
	 * @param {String} ruleClass	The affix rule class.
	 * @param {String} previousGeneration	Previous generation rule.
	 * @returns {Object[]}	The new words generated by the rule, composed by 'suggestion' and 'productionRules'.
	 *
	 * @private
	 */
	var applyRule = function(word, ruleClass, previousGeneration){
		var rule = this.rules[ruleClass],
			newWords = [],
			newWord;
		if(rule)
			rule.entries.forEach(function(entry){
				if(!entry.match || word.match(entry.match)){
					newWord = (entry.remove? word.replace(entry.remove, ''): word);
					newWord = (rule.type == 'SFX'? newWord + entry.add: entry.add + newWord);

					var formattedRule = rule.type
						+ ' ' + ruleClass
						+ ' ' + (entry.remove? entry.remove.source.replace(/\^|\$/, ''): '0')
						+ ' ' + entry.add + (entry.continuationClasses? '/' + entry.continuationClasses.join(''): '')
						+ ' ' + (entry.match? entry.match.source.replace(/\^|\$/, ''): '.');
					newWords.push({suggestion: newWord, productionRules: [previousGeneration, formattedRule].filter(function(el){ return !!el; })});

					if(!previousGeneration && 'continuationClasses' in entry)
						entry.continuationClasses.forEach(function(cl){
							Array.prototype.push.apply(newWords, applyRule.call(this, newWord, cl, formattedRule));
						}, this);
				}
			}, this);
		else if(this.flags['KEEPCASE'] === ruleClass)
			newWords.push(word);
		else
			console.log(word + ' does not have a rule for class ' + ruleClass + (previousGeneration? ' (previous generation is ' + previousGeneration + ')': ''));
		return newWords;
	};


	Constructor.prototype = {
		constructor: Constructor,

		applyRules: applyRules,
		extractContinuationClasses: extractContinuationClasses,
		hasRule: hasRule
	};

	return Constructor;

});
