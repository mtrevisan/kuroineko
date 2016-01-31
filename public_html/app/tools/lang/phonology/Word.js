/**
 * @class Word
 *
 * @author Mauro Trevisan
 */
define(['tools/data/StringHelper', 'tools/lang/phonology/Grapheme', 'tools/lang/phonology/Orthography'], function(StringHelper, Grapheme, Orthography){

	var getLastVowelIndex = function(word, idx){
		return (idx === undefined? word: word.substr(0, idx)).search(/[aeiouàèéíòóú][^aeiouàèéíòóú]*$/);
	};

	var getLastUnstressedVowelIndex = function(word, idx){
		return (idx === undefined? word: word.substr(0, idx)).search(/[aeiou][^aeiou]*$/);
	};


	var isStressed = function(word){
		return (word && word.match(/[àèéíòóú]/));
	};

	var getIndexOfStress = function(word){
		return word.search(/[àèéíòóú]/);
	};

	var isStressAcute = function(chr){
		return (chr && chr.match(/^[éíóú]$/));
	};

	var isStressGrave = function(chr){
		return (chr && chr.match(/^[àèò]$/));
	};

	var getStressType = function(chr){
		if(isStressAcute(chr))
			return 'acute';
		if(isStressGrave(chr))
			return 'grave';
		return undefined;
	};

	//NOTE: duplicated in Grapheme
	var suppressStress = function(word){
		return word.replace(/[àèéíòóú]/g, function(chr){
			return 'aeeioou'['àèéíòóú'.indexOf(chr)];
		});
	};

	var addStressAcute = function(chr){
		return StringHelper.replaceCharacter(chr, 'aeiou', 'àéíóú');
	};

	var addStressGrave = function(chr){
		return StringHelper.replaceCharacter(chr, 'aeiou', 'àèíòú');
	};


	var markDefaultStress = function(word){
		var idx = getIndexOfStress(word);
		if(idx < 0){
			//skip non-alphabetic characters
			var lastChar = word.length - 1;
			while(lastChar >= 0 && !word[lastChar].match(/[aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ]/))
				lastChar --;

			//last vowel if the word ends with consonant, penultimate otherwise, default to the second vowel of a group of two (first one on a monosyllabe)
			if(Grapheme.isVowel(word[lastChar])){
				idx = getLastUnstressedVowelIndex(word, lastChar - 1);
				if(idx < 0)
					idx = getLastUnstressedVowelIndex(word, lastChar);
			}
			if(idx < 0)
				idx = getLastUnstressedVowelIndex(word);

			if(idx >= 0)
				word = StringHelper.setCharacterAt(word, idx, addStressAcute);
		}

		return word;
	};

	var unmarkDefaultStress = function(word){
		if(!word)
			return undefined;

		var idx = getIndexOfStress(word),
			tmp;
		if(idx >= 0){
			//exclude unmark from words that can be truncated like "fenisié(de)" or "(g)à"
			tmp = ((word[idx - 1] != ')' || word[idx + 1] != '(')
					&& !Grapheme.isDiphtong(word.substr(idx, 2))
					&& !Grapheme.isHyatus(word.substr(idx, 2))
					&& !word.match(/^(re)?\(?g?\)?(à\/è|à|é|ò)[oaie]?$/)
					&& !word.match(/^\(?x?\)?é$|^s[éí][oaie]?$/)
					&& !word.match(/^((r[ei])?d[àé]|(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?f[àé]|(mal|move|soto)?st[àé])[oaie]?$/)
					&& !word.match(/^(và[oaie]?|vé)[oaie]?$/)
					&& !word.match(/^s[àò][oaie]?$/)
					&& !word.match(/^(|as?|des?|es|kon|pro|re|so)tr[àé][oaie]?$/)?
				word.replace(/[àéíóú]/g, function(chr){ return 'aeiou'['àéíóú'.indexOf(chr)]; }): word);
			if(tmp != word && markDefaultStress(tmp) == word)
				word = tmp;
		}

		return word;
	};


	var sorterFn = (function(){
		var alphabet = 'aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ';

		/** @private */
		var getCharValue = function(chr){
			return alphabet.indexOf(chr);
		};

		return function(str1, str2){
			str1 = Orthography.correctOrthography(Orthography.rewriteDigrams(str1));
			str2 = Orthography.correctOrthography(Orthography.rewriteDigrams(str2));

			var size = Math.max(str1.length, str2.length),
				tmp = 0,
				i;
			for(i = 0; i < size; i ++){
				tmp = getCharValue(str1[i]) - getCharValue(str2[i]);
				if(tmp != 0)
					break;
			}
			return tmp;
		};
	})();


	return {
		getLastVowelIndex: getLastVowelIndex,
		getLastUnstressedVowelIndex: getLastUnstressedVowelIndex,

		isStressed: isStressed,
		getIndexOfStress: getIndexOfStress,
		isStressAcute: isStressAcute,
		isStressGrave: isStressGrave,
		getStressType: getStressType,
		suppressStress: suppressStress,
		addStressAcute: addStressAcute,
		addStressGrave: addStressGrave,

		markDefaultStress: markDefaultStress,
		unmarkDefaultStress: unmarkDefaultStress,

		sorterFn: sorterFn
	};

});
