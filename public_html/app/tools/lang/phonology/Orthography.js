/**
 * @class Orthography
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Syllabator', 'tools/lang/phonology/PhonologyHelper', 'tools/lang/phonology/Word', 'tools/data/StringHelper', 'tools/data/ObjectHelper'], function(Syllabator, PhonologyHelper, Word, StringHelper, ObjectHelper){

	var rewriteDigrams = function(word){
		return word.replace(/[djlnstx]h/g, function(match){
			return 'đɉƚñʃŧʒ'['djlnstx'.indexOf(match[0])];
		});
	};

	var correctOrthography = function(word){
		return word.toLowerCase()

		//eliminate consonant geminates
			.replace(/([^aeiou]){1}\1+/g, '$1')
		//eliminate unstressed vowels repeated more than two times (one of the remaining must stressed)
			.replace(/([aeiou])\1{2,}/g, '$1$1')

		//apply (and correct) stress
			.replace(/a\\/g, 'à').replace(/e\\/g, 'è').replace(/o\\/g, 'ò').replace(/e\//g, 'é').replace(/(i\/|ì)/g, 'í').replace(/o\//g, 'ó').replace(/(u\/|ù)/g, 'ú')

		//correct h occurrences not after d, f, j, l, n, s, t, x
			.replace(/(^|[^dfjlnstx])h/g, '$1')
		//rewrite characters
			.replace(/dh/g, 'đ').replace(/jh/g, 'ɉ').replace(/lh/g, 'ƚ').replace(/nh/g, 'ñ').replace(/sh/g, 'ʃ').replace(/th/g, 'ŧ').replace(/xh/g, 'ʒ')

		//correct mb/mp occurrences into nb/np
			.replace(/m([bp])/g, 'n$1')
		//correct i occurrences into j at the beginning of a word followed by a vowel and between vowels, correcting also the converse
			.replace(/^j(?=[^aeiouàèéíòóúh])/, 'i').replace(/^i(?=[aeiouàèéíòóú])/, 'j').replace(/([aeiouàèéíòóú])i(?=[aeiouàèéíòóú])/g, '$1j').replace(/j(?=[^aeiouàèéíòóúh])/g, 'i')
		//correct lh occurrences into l not at the beginning of a word and not between vowels
			.replace(/^ƚ(?=[^aeiouàèéíòóú])/, 'l').replace(/([^aeiouàèéíòóú])ƚ(?=[aeiouàèéíòóú])|([aeiouàèéíòóú])ƚ(?=[^aeiouàèéíòóú])/g, '$1l')
		//correct fh occurrences into f not before vowel
			.replace(/fh(?=[^aeiouàèéíòóú])/g, 'f')
		//correct x occurrences into s prior to c, f, k, p, t
		//correct s occurrences into x prior to m, n, ñ, b, d, g, ɉ, s, v, r, l
			.replace(/x(?=[cfkpt])/g, 's').replace(/s(?=([mnñbdgɉsvrl]|jh))/g, 'x')

		//correct morphologic error
			.replace(/([cjñ])i([aeiou])/, '$1$2')

		//correct apostrophes
			/*.replace(/['‘’]([^aoélnñstv])/, '$1').replace(/([^aodglnstŧv])['‘’]/, '$1')*/;
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
				lastSyllabeIdx = syllabation.syllabes.length - 1;
			if(syllabation.syllabes[k - 1].match(directTransformation? /[éó]i[^aeiou]*$/: /[íú]i[^aeiou]*$/) || k <= lastSyllabeIdx && syllabation.syllabes[k].match(/i$/)){
				//count following enclitics
				var encliticCount = lastSyllabeIdx - k;
				while(++ k <= lastSyllabeIdx)
					if(syllabation.syllabes[k].match(/(s?tu)|u$/))
						encliticCount --;

				//if it's followed, at most, only by enclitics
				if(encliticCount <= 0){
					//apply metaphonesys
					var fnMetaphon = (directTransformation? PhonologyHelper.metaphonetizeStressedVowel: PhonologyHelper.demetaphonetizeStressedVowel);
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

	var convertDialect = function(word, dialect, truncate){
		var mainDialect = dialect.replace(/(\..+)$/, '');

		word = Word.markDefaultStress(word);

		if(!ObjectHelper.isDefined(truncate) || truncate === true){
			word = PhonologyHelper.truncateAfterConsonant(word, mainDialect, dialect);
			word = PhonologyHelper.finalConsonantVoicing(word, mainDialect, dialect);
			word = PhonologyHelper.syncopatePluralAfterNasalLateral(word, mainDialect, dialect);
		}

		//NOTE: does not consider de-methaphonization
		if(mainDialect == 'central')
			word = applyMetaphonesys(true, word);

		word = PhonologyHelper.approximantPalatalFreeVariation(word, mainDialect, dialect);
		word = PhonologyHelper.lateralFreeVariation(word, mainDialect, dialect);
		word = PhonologyHelper.unstressedVowelBeforeVibrantFreeVariation(word, mainDialect, dialect);
		word = PhonologyHelper.stressedVowelBeforeVibrantFreeVariation(word, mainDialect, dialect);
		word = PhonologyHelper.constrictiveDentalCombinatorialVariation(word, mainDialect, dialect);
		word = PhonologyHelper.occlusiveDentalCombinatorialVariation(word, mainDialect, dialect);

		return Word.unmarkDefaultStress(word);
	};


	return {
		rewriteDigrams: rewriteDigrams,
		correctOrthography: correctOrthography,

		convertDialect: convertDialect
	};

});
