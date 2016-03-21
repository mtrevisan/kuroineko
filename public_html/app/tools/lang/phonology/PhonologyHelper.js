/**
 * @class PhonologyHelper
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/data/StringHelper', 'tools/lang/phonology/Grapheme', 'tools/lang/phonology/Word', 'tools/lang/phonology/Hyphenator', 'tools/lang/phonology/hyphenatorPatterns/vec'], function(ObjectHelper, StringHelper, Grapheme, Word, Hyphenator, pattern_vec){

	/*var convertPhonesIntoXSampa = (function(){

		var data = {
			'\'': '"',
			'k[eɛij]': 'k_+', 'g[eɛij]': 'g_+',
			'ɛ': 'E', 'ɔ': 'O',
			'ι': 'j',
			'ρ': 'r\\_a`', 'ř': 'r\\_-`',
			'r': 'r_a',
			'ɾ': '4_a',
			'ʅ': 'r_-_+`',
//lateral approximant coronal (non retroflex) apical
//uni-lateral alveolar
//l̺
//lateral approximant coronal (non retroflex) laminal, palatalized
//semi-lateral palatal
//l̻ʲ
			'l': 'l_a', 'ļ': 'l_m\'',
//lateral approximant coronal (non retroflex) apical, raised
//l̺̝
			'λ': 'l_a_r',
//lateral approximant palatalized, lowered, rhotic
//lateral pre-palatal
//ʎ̞˞
//lateral approximant velar advanced, lowered, rhotic
//semi-lateral pre-velar
//ʟ̟̞˞
			'Λ': 'L_o`', 'Ƚ': 'L\\_+_o`',
			'ɱ': 'F', 'n': 'n_a',
			'ŋ': 'N_+_o',
			't': 't_d', 'd': 'd_d', 'kw': 'k_w', 'gw': 'g_w',
			'ʦ': 't-\\s_d_-', 'ʣ': 'd-\\z_d_-', 'ʧ': 't_m-\\S\'', 'ʤ': 'd_m-\\Z\'',
			'φ': 'f_h',
			'θ': 'T', 'ð': 'D',
			's': 's_-', 'z': 'z_-',
			'ʃ': 'S_m\'', 'ʒ': 'Z_m\''
		};

		var replaceFirstMatch = function(chr){
			for(var prop in data)
				if(chr.match(new RegExp('^' + prop)))
					return data[prop];
			return chr[0];
		};


		return function(word){
			var result = '',
				len = word.length;
			for(var i = 0; i < len; i ++)
				result += replaceFirstMatch(word.substr(i, 2));
			return result;
		};

	})();*/


	var metaphonetizeStressedVowel = function(chr){
		return StringHelper.replaceCharacter(chr, 'éó', 'íú');
	};

	var demetaphonetizeStressedVowel = function(chr){
		return StringHelper.replaceCharacter(chr, 'íú', 'éó');
	};


	/**
	 * Truncate final unstressed vowel <i>e/o</i> after <i>n</i>, <i>r</i>, <i>l</i> and in general after all voiced consonants and <i>f</i>, <i>k</i>, <i>p</i>, <i>s</i>, <i>t</i>, <i>ŧ</i>,
	 * but only if it's not a plural marker (therefore plurals in <i>-e</i> derived from singular feminine words ending in <i>-a</i> are excluded).
	 */
	var truncateAfterConsonant = (function(){
		var funct1 = function(dialect){
				return (dialect == 'centralNorthern.kastelan' || dialect == 'lagunar.coxòto'? /(n)[eo]$/: /([nrl])[eo]$/);
			},
			re2 = /(n)[eo]$/,
			matchers = {
				centralNorthern: funct1,
				lagunar: funct1,
				central: re2,
				western: re2,
				oriental: /([nrlkstŧ])[eo]$/,
				northern: function(dialect){ return (dialect == 'northern.ladin'? /([^aeiouàèéíòóú])[eo]$/: /([nrlmñptkcfŧsdgđx])[eo]$/); }
			};

		return function(word, mainDialect, dialect){
			var matcher = matchers[mainDialect];
			if(ObjectHelper.isFunction(matcher))
				matcher = matcher(dialect);
			return (mainDialect.match(matcher)? word.replace(matcher, '$1'): word);
		};
	})();

	var syncopatePluralAfterNasalLateral = function(word, mainDialect){
		return (mainDialect.match(/^(northern|oriental)$/)? word.replace(/([eèéoó])[nl]i$/, '$1i'): word);
	};

	var finalConsonantVoicing = function(word, mainDialect){
		if(mainDialect == 'northern')
			word = word.replace(/[bdgvđxʒɉmñ]$/, function(match){
				return (match == 'ñ'? 'nc': 'ptkfŧsʃcn'['bdgvđxʒɉm'.indexOf(match)]);
			});
		/*else if(mainDialect != 'none')
			word = word.replace(/([ptkfŧsʃcn]|nc)$/, function(match){
				return (match == 'nc'? 'ñ': 'bdgvđxʒɉm'['ptkfŧsʃcn'.indexOf(match)]);
			});*/

		return word;
	};


	var approximantPalatalFreeVariation = function(word, mainDialect){
		if(mainDialect == 'lagunar')
			word = word.replace(/j/g, 'ɉ');
		else if(mainDialect == 'oriental')
			word = word.replace(/(^|[^aeiouàèéíòóú])j/g, '$1ɉ');
		else if(mainDialect != 'none')
			word = word.replace(/ɉ/g, 'j');

		return word;
	};

	var lateralFreeVariation = function(word, mainDialect, dialect){
		if(mainDialect == 'centralNorthern' || mainDialect == 'lagunar' || dialect.match(/^central\.(padoan|viŧentin)/))
			word = word.replace(/(^|[aeioàèéíòóuú])l([aeioàèéíòóuú])/g, '$1ƚ$2');
		else if(mainDialect != 'none')
			word = word.replace(/ƚ/g, 'l');

		return word;
	};

	var unstressedVowelBeforeVibrantFreeVariation = function(word, mainDialect, dialect){
		if(dialect.match(/^central\.(padoan|polexan|roigòto|talian)/) || mainDialect == 'western'){
			//word = word.replace(/([^aeiouàèéíòóuú])er/g, '$1ar');
			var hyp = hyphenatePhones(word);
			word = word.replace(/([^aàeèéíoòóú])er/g, function(group, pre, idx){
				return (hyp.getSyllabe(idx).match(/[^jw]e/)? pre + 'ar': group);
			});
		}
		//else if(mainDialect != 'none')
		//	word = word.replace(/([^aàeèéíoòóú])ar/g, '$1er');

		return word;
	};

	var hyphenator = new Hyphenator('-', pattern_vec);

	/** @private */
	var hyphenatePhones = function(word){
		var phones = Grapheme.preConvertGraphemesIntoPhones(Word.markDefaultStress(word)).split(''),
			k = 0,
			hyphenatedWord = hyphenator.hyphenate(word);
		hyphenatedWord.syllabes = hyphenatedWord.syllabes
			.map(function(syllabe){ return syllabe.length; })
			.map(function(length){ return this.slice(k, k += length).join(''); }, phones);
		return hyphenatedWord;
	};

	var stressedVowelBeforeVibrantFreeVariation = function(word, mainDialect, dialect){
		if(dialect.match(/^central\.(viŧentin|valsuganòto|basoTrentin)/))
			word = word.replace(/([^aeiou])ér/g, '$1èr');
		else if(mainDialect != 'none')
			word = word.replace(/([^aeiou])èr/g, '$1ér');

		return word;
	};


	var constrictiveDentalCombinatorialVariation = function(word, mainDialect, dialect){
		if(mainDialect == 'centralNorthern' || mainDialect == 'lagunar'
				|| dialect.match(/^central\.(padoan|viŧentin|valsuganòto|basoTrentin|talian)/)
				|| dialect.match(/^western\.(altaVeronexe|ŧitadin)/))
			word = word.replace(/[ŧđ]/g, function(match){
				return 'sx'['ŧđ'.indexOf(match)];
			});
		else if(dialect == 'western.basaVeronexe')
			word = word.replace(/đ/g, 'x');
		else if(dialect == 'northern.cipileño')
			word = word.replace(/đ/g, 'd');

		return word;
	};

	var occlusiveDentalCombinatorialVariation = function(word, mainDialect){
		if(mainDialect == 'northern')
			word = word.replace(/k([aà])/g, 'c$1').replace(/g([aà])/g, 'ɉ$1')
				.replace(/ti([aeioàèéíòóuú])/g, 'c$1').replace(/di([aeioàèéíòóuú])/g, 'ɉ$1');

		return word;
	};

	var vowelLoweringCombinatorialVariation = function(word, mainDialect){
		if(mainDialect.match(/^(central|western)/)){
			var m = word.match(/^.+[^aàiu]er(?!e?$)/g);
			if(m && !Grapheme.isEterophonicSequence(m[0]))
				word = word.replace(/^(.+[^aàiu])er(?!e?$)/g, '$1ar');
		}

		return word;
	};


	var convertDialect = function(word, dialect, truncate){
		var mainDialect = dialect.replace(/(\..+)$/, '');

		word = Word.markDefaultStress(word);

		if(!ObjectHelper.isDefined(truncate) || truncate === true){
			word = truncateAfterConsonant(word, mainDialect, dialect);
			word = finalConsonantVoicing(word, mainDialect, dialect);
			word = syncopatePluralAfterNasalLateral(word, mainDialect, dialect);
		}

		//NOTE: does not consider de-methaphonization
//		if(mainDialect == 'central')
//			word = applyMetaphonesys(true, word);

		word = approximantPalatalFreeVariation(word, mainDialect, dialect);
		word = lateralFreeVariation(word, mainDialect, dialect);
		word = unstressedVowelBeforeVibrantFreeVariation(word, mainDialect, dialect);
		word = stressedVowelBeforeVibrantFreeVariation(word, mainDialect, dialect);
		word = constrictiveDentalCombinatorialVariation(word, mainDialect, dialect);
		word = occlusiveDentalCombinatorialVariation(word, mainDialect, dialect);

		return Word.unmarkDefaultStress(word);
	};

	/**
	 * @require stress to be explicitated.
	 *
	 * @private
	 */
	var applyMetaphonesys = function(directTransformation, word, applyVocalHarmony){
//FIXME
//patch for participle past words
if(word.indexOf('(') >= 0)
	return word;

		var syllabation = Syllabator.syllabate(word);
		if(syllabation.hasSyllabationErrors)
			return word;

		word = Word.markDefaultStress(word);
		var idx = Word.getIndexOfStress(word);

		//if stress is acute and is [éó]
		if(word[idx].match(directTransformation? /[éó]/: /[íú]/)){
			//if the following syllabe ends in i, or there is a hyatus
			var k = syllabation.getSyllabeIndex(idx) + 1,
				lastSyllabeIdx = syllabation.syllabes.length - 1,
				encliticCount, fnMetaphon;
			if(syllabation.syllabes[k - 1].match(directTransformation? /[éó]i[^aeiou]*$/: /[íú]i[^aeiou]*$/) || k <= lastSyllabeIdx && syllabation.syllabes[k].match(/i$/)){
				//count following enclitics
				encliticCount = lastSyllabeIdx - k;
				while(++ k <= lastSyllabeIdx)
					if(syllabation.syllabes[k].match(/(s?tu)|u$/))
						encliticCount --;

				//if it's followed, at most, only by enclitics
				if(encliticCount <= 0){
					//apply metaphonesys
					fnMetaphon = (directTransformation? metaphonetizeStressedVowel: demetaphonetizeStressedVowel);
					word = StringHelper.setCharacterAt(word, idx, fnMetaphon);

					if(applyVocalHarmony === true){
						k = syllabation.getSyllabeIndex(idx) - 1;
						if(k >= 0){
							//find vowel on previous syllabe
							idx = Word.getLastVowelIndex(syllabation.syllabes[k]);

							//harmonize vowel
							word = StringHelper.setCharacterAt(word, idx, function(chr){
								return Word.suppressStress(fnMetaphon(Word.addStressAcute(chr)));
							});
						}
					}
				}
			}
		}
		return word;
	};


	return {
		//convertPhonesIntoXSampa: convertPhonesIntoXSampa,

		metaphonetizeStressedVowel: metaphonetizeStressedVowel,
		demetaphonetizeStressedVowel: demetaphonetizeStressedVowel,

		truncateAfterConsonant: truncateAfterConsonant,
		syncopatePluralAfterNasalLateral: syncopatePluralAfterNasalLateral,
		finalConsonantVoicing: finalConsonantVoicing,

		approximantPalatalFreeVariation: approximantPalatalFreeVariation,
		lateralFreeVariation: lateralFreeVariation,
		unstressedVowelBeforeVibrantFreeVariation: unstressedVowelBeforeVibrantFreeVariation,
		stressedVowelBeforeVibrantFreeVariation: stressedVowelBeforeVibrantFreeVariation,
		constrictiveDentalCombinatorialVariation: constrictiveDentalCombinatorialVariation,
		occlusiveDentalCombinatorialVariation: occlusiveDentalCombinatorialVariation,
		vowelLoweringCombinatorialVariation: vowelLoweringCombinatorialVariation,

		convertDialect: convertDialect
	};

});
