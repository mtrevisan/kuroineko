/**
 * @class Word
 *
 * @author Mauro Trevisan
 */
define(['tools/data/StringHelper', 'tools/lang/phonology/Grapheme'], function(StringHelper, Grapheme){

	var getLastVowelIndex = function(word, idx){
		return (idx !== undefined? word.substr(0, idx): word).search(/[aeiouàèéíòóú][^aeiouàèéíòóú]*$/);
	};

	var getLastUnstressedVowelIndex = function(word, idx){
		return (idx !== undefined? word.substr(0, idx): word).search(/[aeiou][^aeiou]*$/);
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
			while(!word[lastChar].match(/[aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ]/))
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
		var idx = getIndexOfStress(word);
		if(idx >= 0){
			//exclude unmark from words that can be truncated like "fenisié(de)" or "(g)à"
			var tmp = (word[idx + 1] != '(' && !word.match(/^(re)?\(?g?\)?(à\/è|à|é|ò)$/) && !word.match(/^\(?x?\)?é$|^s[éí]$/)
				&& !word.match(/^((r[ei])?dà|(mal|move|soto)?stà|(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?fà)$/)
				&& !word.match(/^(stra)?s[àò]$/) && !word.match(/^(|as?|des?|es|kon|pro|re|so)tr[àé]$/)? suppressStress(word): word);
			if(word == markDefaultStress(tmp))
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
