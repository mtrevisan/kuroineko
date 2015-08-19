/**
 * @class Syllabator
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone', 'tools/lang/phonology/Grapheme', 'tools/lang/phonology/Word', 'tools/data/StringHelper'], function(Phone, Grapheme, Word, StringHelper){

	var SYLLABE_SEPARATOR_IN_WORD = '|',
		SYLLABE_SEPARATOR_CROSS_WORD = '/';


	/**
	 * Calculate the phonetical or grammatical syllabation of a word.
	 *
	 * @require stress to be explicitated for some hyatuses.
	 */
	var syllabate = (function(){
		var scoreData = {
				//gruppo a-sonantico:
				0: [Grapheme.HYATUS_MARKER],
				1: ['s', 's̠', 'ʃ', 'ʃʲ'],
				2: ['z', 'z̠', 'ʒ', 'ʒʲ'],
				3: ['f', 'θ', 't͡s', 't͡s̪̠'],
				4: ['v', 'ð', 'd͡z', 'd͡z̪̠'],
				5: ['t͡ʃ', 't̻͡ʃʲ'],
				//gruppo consonantico:
				//note the shift of /j/ as if it were /d͡ʒ/
				6: ['d͡ʒ', 'd̻͡ʒʲ', 'j²'],
				7: ['p'],
				8: ['b'],
				9: ['k̟', 'k', 'kʷ'],
				10: ['g̟', 'g', 'gʷ'],
				11: ['t', 't̪'],
				12: ['d', 'd̪'],
				//gruppo sonantico:
				13: ['m'],
				14: ['ɲ'],
				15: ['ŋ', 'ŋ̞̟', 'n', 'n̺'],
				16: ['l̻ʲ', 'ʟ˞̟̞', 'ʎ˞̞', 'l', 'l̺', 'l̺̝'],
				17: ['ɹ', 'ɹ˞̺', 'ɹ˞̠', 'r', 'r̺', 'ɾ', 'ɾ̺', 'ɽ', 'ɽ̠̟'],
				18: ['w'],
				19: ['j'],
				//notes:
				//	1) ' can be either ‘ or ’ depending whether it's the first or the last character of a word
				//	2) ‘ can be 'a/o' (before 'n', and 'v'), or 'e' (before 'l', and 's')
				//	3) ’ can be 'a' (after 'l'), or 'e' (after 'n')
				//	4) apostrophes before or after a vowel should be ignored
				//gruppo vocalico:
				20: ['\'', '‘', '’'],
				21: ['i'],
				22: ['u'],
				23: ['e'],
				24: ['o'],
				25: ['ɛ'],
				26: ['ɔ'],
				27: ['a']
			},
			score = {};

		Object.keys(scoreData).forEach(function(value){
			scoreData[value].forEach(function(phone){
				score[phone] = Number(value);
			});
		});
		delete scoreData;


		var computeSillabicities = function(word){
			var sillabicities = [];
			word.forEach(function(chr){
				sillabicities.push(score[chr]);
			}, this);
			return sillabicities;
		};

		var storePhone = function(syllabe, phones){
			phones.push(cleanPhone(syllabe));
		};

		var cleanPhone = function(word){
			return Grapheme.removeJLikePhone(word.replace(/['‘’]/g, ''));
		};

		var storeSyllabe = function(syllabe, syllabes){
			syllabes.push(Grapheme.convertPhonesIntoGraphemes(syllabe));
		};

		var storeNucleus = function(nucleus, nuclei){
			nuclei.push(nucleus);
		};

		var restoreSyllabeStress = function(syllabes, globalIndex, relativeIndex){
			syllabes[globalIndex] = StringHelper.setCharacterAt(syllabes[globalIndex], relativeIndex, Word.addStressAcute);
		};

		var restorePhoneStress = function(phones, globalIndex){
			phones[globalIndex] = '\'' + phones[globalIndex];
		};

		var diphtongateStressedVowel = function(phones, globalIndex){
			phones[globalIndex] = phones[globalIndex].replace(/(^|[^aeɛioɔu])([aeɛioɔu])([^aeɛioɔu]?)$/, '$1$2$2$3');
		};

		/**
		 * @param {Number} idx	Global index with respect to the word from which to extract the index of the owning syllabe.
		 * @param {Boolean} calculateRelativeIndex	Calculate the relative index inside the owning syllabe.
		 */
		var getSyllabeIndex = function(idx, calculateRelativeIndex){
			if(idx >= 0){
				var size = this.syllabes.length,
					i, len;
				for(i = 0; i < size; i ++){
					len = this.syllabes[i].length;
					if(idx < len){
						i = Number(i);
						return (calculateRelativeIndex === true? [i, idx]: i);
					}
					idx -= len;
				}
			}
			return undefined;
		};

		/**
		 * @param {Number} idx	Index of syllabe to extract, if negative then it's relative to the last syllabe.
		 */
		var getSyllabe = function(idx){
			return this.syllabes[(idx + this.syllabes.length) % this.syllabes.length];
		};

		/**
		 * @param {Number} idx	Index of syllabe, if negative then it's relative to the last syllabe.
		 * @return {Number} Global index at which the syllabe starts.
		 */
		var getGlobalIndex = function(idx){
			idx = (idx + this.syllabes.length) % this.syllabes.length;

			var len = 0,
				i;
			for(i = 0; i < idx; i ++)
				len += this.syllabes[i].length;
			return len;
		};

		/**
		 * @param {Number} idx	Index of syllabe, if negative then it's relative to the last syllabe.
		 */
		var getGlobalIndexOfStressedSyllabe = function(idx){
			return this.getGlobalIndex(idx) + Word.getLastVowelIndex(this.getSyllabe(idx));
		};

		var extractSyllabe = function(word, syllabeStart, syllabeEnd){
			return Grapheme.unmarkPhonologicSyllabeSeparation(word.slice(syllabeStart, syllabeEnd).join(''));
		};


		return function(word, dialect, phonematicSyllabation){
			word = Word.markDefaultStress(word);

			var stressIndex = Word.getIndexOfStress(word);

			word = Grapheme.convertGraphemesIntoPhones(word, dialect, phonematicSyllabation);

			word = word.match(Phone.REGEX_UNICODE_SPLITTER);

			var sillabicities = computeSillabicities(word);
			//insert guards
			sillabicities.push(-1);
			sillabicities.push(28);


			var lastSillabicity = -1,
				syllabeStart = 0,
				len = word.length + 1,
				nucleus, nucleusSillabicity,
				syllabes = [], phones = [], nuclei = [], notSyllabeIndexes = [],
				i, sillabicity, syllabe;
			for(i = 0; i <= len; i ++){
				sillabicity = sillabicities[i];

				//sillabicity starts to decrease, mark nucleus:
				if(!nucleus && sillabicity < lastSillabicity){
					nucleus = word[i - 1];
					nucleusSillabicity = lastSillabicity;
				}
				//sillabicity starts to increase after a nucleus is found, mark syllabe:
				else if(nucleus && sillabicity >= lastSillabicity){
					syllabe = extractSyllabe(word, syllabeStart, i - 1);

					//check syllabe feasibility
					if(!phonematicSyllabation && nucleusSillabicity < 20)
						notSyllabeIndexes.push(syllabes.length);

					if(phonematicSyllabation)
						storePhone(syllabe, phones);
					storeSyllabe(syllabe, syllabes);
					storeNucleus(nucleus, nuclei);

					//restart subdivision
					syllabeStart = i - 1;
					nucleus = null;
				}

				//remember last sillabicity value
				lastSillabicity = sillabicity;
			}

			var result = {
				stressIndex: stressIndex,

				syllabes: syllabes,
				nuclei: nuclei,

				getSyllabeIndex: getSyllabeIndex,
				getSyllabe: getSyllabe,
				getGlobalIndex: getGlobalIndex,
				getGlobalIndexOfStressedSyllabe: getGlobalIndexOfStressedSyllabe
			};

			if(phonematicSyllabation)
				result.phones = phones;
			else{
				result.notSyllabeIndexes = notSyllabeIndexes;
				result.hasSyllabationErrors = !!notSyllabeIndexes.length;
			}


			//restore stress:
			if(stressIndex >= 0){
				var globalRelativeStressIndexes = result.getSyllabeIndex(stressIndex, true);
				restoreSyllabeStress(syllabes, globalRelativeStressIndexes[0], globalRelativeStressIndexes[1]);
				if(phonematicSyllabation){
					restorePhoneStress(phones, globalRelativeStressIndexes[0]);

					if(dialect == 'lagunar.coxòto')
						diphtongateStressedVowel(phones, globalRelativeStressIndexes[0]);
				}
			}

			return result;
		};
	})();

	var syllabateText = function(text, dialect, phonematicSyllabation){
		//extract words and separators from text
		var textWords = extractWords(text);

		//process each word separately:
		var words = [],
			totalSyllabeCount = 0,
			word, syll;
		for(word in textWords.words){
			if(word.length){
				syll = syllabate(word, dialect, phonematicSyllabation);

				words.push(syll);
				totalSyllabeCount += syll.syllabes.length;
			}
		}

		var idx, separators, s;
		//process the boundary of each word:
		var size = words.length - 1;
		//for each word (but the last)...
		for(var k = 0; k < size; k ++){
			syll = words[k].syllabes;

			//store initial word's index
			idx = k;

			//... extract its last syllabe...
			word = syll[syll.length - 1];
			//... then advance to next word...
			while(++ k <= size){
				//NOTE: true syllabe count for pseudo-word will be added once its syllabation will be calculated
				totalSyllabeCount --;

				syll = words[k].syllabes;
				//... and extract its first syllabe, composing the pseudo-word
				word += syll[0];

				if(syll.length > 1)
					break;
			}

			syll = syllabate(word.replace(/[\-'‘’]/g, ''), dialect).syllabes;

			//restore previously resetted syllabe count accounting for pseudo-word
			totalSyllabeCount += syll.length - 1;

			//if the pseudo-word is multi-syllable then consider the boundary syllabes as disjoint
			separators = syll.length;
			if(separators > 1){
				//start from first word
				k = idx;

				s = words[k].syllabes;
				s[s.length - 1] += ' ' + SYLLABE_SEPARATOR_CROSS_WORD;
				while(++ k <= size && -- separators > 1)
					words[k].syllabes[0] += ' ' + SYLLABE_SEPARATOR_CROSS_WORD;
			}
			k --;
		}


		return {
			words: words,
			wordSeparators: (textWords? textWords.separators: undefined),
			totalSyllabeCount: totalSyllabeCount
		};
	};

	/** @private */
	var extractWords = function(text){
		return {
			words: text.split(/[^'‘’aàbcdđeèéfghiìíjɉklƚmnñoòóprsʃtŧuùúvxʒ]+/i),
			separators: text.split(/['‘aàbcdđeèéfghiìíjɉklƚmnñoòóprsʃtŧuùúvxʒ]+/i)
		};
	};


	return {
		SYLLABE_SEPARATOR_IN_WORD: SYLLABE_SEPARATOR_IN_WORD,
		SYLLABE_SEPARATOR_CROSS_WORD: SYLLABE_SEPARATOR_CROSS_WORD,

		syllabate: syllabate,
		syllabateText: syllabateText
	};

});
