/**
 * @class AFFFileRules
 *
 * @see {@link http://pwet.fr/man/linux/fichiers_speciaux/hunspell}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/phonology/Grapheme', 'tools/lang/morphology/Verb', 'tools/lang/Dialect', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/Hyphenator', 'tools/lang/phonology/hyphenatorPatterns/vec', 'tools/data/ArrayHelper', 'tools/data/Assert'], function(Word, Grapheme, Verb, Dialect, Themizer, Hyphenator, pattern_vec, ArrayHelper, Assert){

	var runAllForms = true;


	/** @constant */
	var REGULAR = 'regular',
	/** @constant */
		IRREGULAR = 'irregular',
	/** @constant */
		MARKER_FLAGS = '@',
	/** @constant */
		PATTERN_FLAGS = new RegExp('(?:\\/([\\d,]+))?([' + MARKER_FLAGS.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '])?(\\|.+)?$'),
	/** @constant */
		PATTERN_LEAVE_REPLACEMENT = /^.+>|\|.+$/,
	/** @constant */
		FLAG_SEPARATOR = ',',
	/** @constant */
		FLAG_START = 'A';

	var printFlagsAsNumber = false;
	var logOnConsole = true;
	var logNonVerbs = false;

	/** @constant */
//	var REDUCTION_RESERVED_0 = 150,
	var REDUCTION_RESERVED_0 = 2,
	/** @constant */
		REDUCTION_RESERVED_1 = REDUCTION_RESERVED_0 + 1,
	/** @constant */
		REDUCTION_RESERVED_2 = REDUCTION_RESERVED_0 + 2,
	/** @constant */
		PRONOMENAL_MARK = REDUCTION_RESERVED_0 + 3,
	/** @constant */
		PRONOMENAL_IMPERATIVE_MARK = REDUCTION_RESERVED_0 + 4,
	/** @constant */
		PRONOMENAL_MARK_2 = REDUCTION_RESERVED_0 + 5,
	/** @constant */
		PRONOMENAL_IMPERATIVE_MARK_2 = REDUCTION_RESERVED_0 + 6,
	/** @constant */
		FINAL_CONSONANT_VOICING_MARK = REDUCTION_RESERVED_0 + 7,
	/** @constant */
		INTERROGATIVE_MARK_1S = REDUCTION_RESERVED_0 + 8,
	/** @constant */
		INTERROGATIVE_MARK_1S_2 = REDUCTION_RESERVED_0 + 9,
	/** @constant */
		INTERROGATIVE_MARK_1P = REDUCTION_RESERVED_0 + 10,
	/** @constant */
		INTERROGATIVE_MARK_1P_2 = REDUCTION_RESERVED_0 + 11,
	/** @constant */
		INTERROGATIVE_MARK_2S = REDUCTION_RESERVED_0 + 12,
	/** @constant */
		INTERROGATIVE_MARK_2S_2 = REDUCTION_RESERVED_0 + 13,
	/** @constant */
		INTERROGATIVE_MARK_2P = REDUCTION_RESERVED_0 + 14,
	/** @constant */
		INTERROGATIVE_MARK_2P_2 = REDUCTION_RESERVED_0 + 15,
	/** @constant */
		INTERROGATIVE_MARK_3 = REDUCTION_RESERVED_0 + 16,
	/** @constant */
		INTERROGATIVE_MARK_3_2 = REDUCTION_RESERVED_0 + 17,
	/** @constant */
		INTERROGATIVE_MARK_3_CONDITIONAL_SIMPLE = REDUCTION_RESERVED_0 + 18,
	/** @constant */
		SUBSTANTIVES_MASCULINE = REDUCTION_RESERVED_0 + 19,
	/** @constant */
		SUBSTANTIVES_FEMININE = REDUCTION_RESERVED_0 + 20,
	/** @constant */
		PLANTS_AND_CRAFTS = REDUCTION_RESERVED_0 + 21,
	/** @constant */
		ADVERB_0 = REDUCTION_RESERVED_0 + 22,
	/** @constant */
		ADVERB_1 = REDUCTION_RESERVED_0 + 23;

	var hyphenator = new Hyphenator(pattern_vec);

	var adjectives = {
		0: [
			//ajetivi de prima klase
			[REDUCTION_RESERVED_0, '[oaie]', 'o>[ae]', 'o>i|[^ij]o', 'io>i', 'jo>i', '0>[oaie]|[^oaie]'],
			//ajetivi de sekonda klase
			[REDUCTION_RESERVED_1, '[aie]', '0>[aie]|[^oaie]', 'a>[ei]'],
			//ajetivi de terŧa klase
			[REDUCTION_RESERVED_2, '[ei]', 'e>i', '0>[ei]|[^oaie]']
		]
	};

	var interrogatives = {
		1: [
			[INTERROGATIVE_MARK_1S, '0>-mi'],
			[INTERROGATIVE_MARK_1S_2, 'mi>(t)[ei]|nmi', 'mi>n(t)[ei]|[^n]mi'],
			[INTERROGATIVE_MARK_1P, '0>-(t)[ei]|n', '0>-n(t)[ei]|[^n]'],
			[INTERROGATIVE_MARK_1P_2, 'i>e|ni', 'i>t[ei]|ni', 'i>n(t)[ei]|[^n]i'],
			[INTERROGATIVE_MARK_2S, '0>-t[uo]', '0>-stu'],
			[INTERROGATIVE_MARK_2S_2, 'u>o', 'tu>stu'],
			[INTERROGATIVE_MARK_2P, '0>-[uo]'],
			[INTERROGATIVE_MARK_2P_2, 'u>o'],
			[INTERROGATIVE_MARK_3, 'a>e-[lƚ][oaie]', 'i>e-[lƚ][oaie]', '0>-[lƚ][oaie]|[^ai]'],
			[INTERROGATIVE_MARK_3_2, 'o>[aie]'],
			[INTERROGATIVE_MARK_3_CONDITIONAL_SIMPLE, 'ave>ise-[lƚ][oaie]|rave', 'ave>íse[lƚ][oaie]|rave']
		]
	};

	var pronomenals = {
		1: [
			[PRONOMENAL_MARK, '0>-[lƚ][oaie]', '0>-[gmstv]e(ne)', '0>-[gmstv]e[lƚ][oaie]', '0>-ne'],
			[PRONOMENAL_IMPERATIVE_MARK, '0>-[gmntv]e|[^a]', '0>-[lƚ][oaie]|[^a]', 'a>e-[gmntv]e', 'a>e-[lƚ][oaie]']
		],
		2: [
			[PRONOMENAL_MARK_2, 'me>[lƚ][oaie]', 'me>[gnstv]e', 'me>mene', 'me>me[lƚ][oaie]', 'me>[gstv]ene', 'me>[gstv]e[lƚ][oaie]'],
			[PRONOMENAL_IMPERATIVE_MARK_2, 'me>[gntv]e|[^a]me', 'ame>e[gmntv]e', 'me>[lƚ][oaie]|[^a]me', 'ame>e[lƚ][oaie]']
		]
	};

	var consonantVoicings = {
		1: [
			//part. pasà, ind. prex., 2a e 3a pars. sing.
			[FINAL_CONSONANT_VOICING_MARK,
				'ño>nc', 'ña>nc', 'ñe>nc',
				'ño>in', 'ña>in', 'ñe>in',
				'ño>n', 'ña>n', 'ñe>n',
				'ño>ñ', 'ña>ñ', 'ñe>ñ',
				'bo>p', 'ba>p', 'be>p',
				'po>p', 'pa>p', 'pe>p',
				'do>t', 'da>t', 'de>t',
				'to>t', 'ta>t', 'te>t',
				'go>k', 'ga>k', 'ge>k',
				'ko>k', 'ka>k', 'ke>k',
				'vo>f', 'va>f', 've>f',
				'fo>f', 'fa>f', 'fe>f',
				'đo>ŧ', 'đa>ŧ', 'đe>ŧ',
				'ŧo>ŧ', 'ŧa>ŧ', 'ŧe>ŧ',
				'xo>s', 'xa>s', 'xe>s',
				'so>s', 'sa>s', 'se>s',
				'ɉo>c', 'ɉa>c', 'ɉe>c',
				'co>c', 'ca>c', 'ce>c',
				'mo>n', 'ma>n', 'me>n',
				'no>n', 'na>n', 'ne>n'
				]
		]
	};

	var substantives = {
		1: [
			[SUBSTANTIVES_MASCULINE, '0>[oi]|[^oaie]', 'ol>ói', 'on>ói', 'al>ài', 'an>ài', 'el>éi', 'en>éi', '0>i|i[ln]', 'ul>úi', 'un>úi', 'o>i|[^ij]o', 'io>i', 'jo>i', 'a>i', 'e>i', '0>i|[àèé]'],
			[SUBSTANTIVES_FEMININE, '0>[ei]|[^oaieln]', '0>i|i[ln]', 'al>ài', 'an>ài', 'el>éi', 'en>éi', 'ol>ói', 'on>ói', 'ul>úi', 'un>úi', 'a>e', 'e>i']
		]
	};

	//dict: pomèr/PLANTS_AND_CRAFTS, barkarol/PLANTS_AND_CRAFTS, sartor/PLANTS_AND_CRAFTS, kolador/PLANTS_AND_CRAFTS
	var plantsAndCrafts = {
		1: [
			[PLANTS_AND_CRAFTS, 'èr>ar(o/a/i/e)', 'ol>iol(o/a/i/e)|rol', 'ol>(i)òl(o/a/i/e)|rol', 'ol>ioƚ[oaie]|rol', 'ol>(i)òƚ[oaie]|rol', 'dor>or(o/a/i/e)|[aeiou]dor']
		]
	};

	var adverbs = {
		1: [
			[ADVERB_0, '0>mente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^aeiou]',
				'o>amente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^t]o',
				'o>amente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^n]to',
				'o>amente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^e]nto',
				'o>amente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^lƚu]ento',
				'o>emente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[ƚu]ento',
				'0>mente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^rlƚn]e',
				'e>mente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[aeiou]re',
				'0>mente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^aeiou]re',
				'e>mente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[lƚ]e',
				'0>mente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|[^o]ne',
				'e>amente/' + FINAL_CONSONANT_VOICING_MARK + ',' + ADVERB_1 + '|one'
			],
			[ADVERB_1, 'nte>n|mente', 'e>re|mente']
		]
	};


	/**
	 * @param {List} List of verbs generated using Verb
	 */
	var generate = function(verbs){
		var dialect = new Dialect(),
			infinitiveThemes = {},
			paradigm;
		verbs.forEach(function(verb){
			infinitiveThemes[verb.infinitive] = Themizer.generate(verb, dialect);
		});

		//dict: -r/A
		paradigm = [];
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 1, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 2, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 4, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 5, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 6, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 7, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 8, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 9, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 10, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 11, 0));
		Array.prototype.push.apply(paradigm, generateTheme(verbs, infinitiveThemes, 12, 0));

		//collect and expand forms
		var suffixes = [];
		paradigm.forEach(function(sublist){
			sublist.origins = unique(sublist.origins).sort();

			suffixes = suffixes.concat(sublist.suffixes.map(function(suffix){
				return expandForm(suffix).map(function(form){
					return form + (this && this.length? ' # ' + this.join(','): '');
				}, this);
			}, sublist.origins));
		});
		suffixes = mergeIdenticalTransformations(ArrayHelper.flatten(suffixes));

		if(logOnConsole){
			printParadigm(suffixes, verbs.map(function(verb){ return unmarkDefaultStress(verb.infinitive); }));

			if(logNonVerbs){
				printReductions(adjectives, 'ajetivi');

				printReductions(pronomenals, 'prokonplementari');

				printReductions(consonantVoicings, 'sonoriđaŧion konsonanti finali');

				printReductions(interrogatives, 'interogativi');

				printReductions(substantives, 'sostantivi plurali');

				printReductions(plantsAndCrafts, 'piante e mistièri');

				printReductions(adverbs, 'avèrbi');
			}
		}
	};

	var generateThemeT8 = function(verb){
		var dialect = new Dialect(),
			themes = Themizer.generate(verb, dialect),
			suffixes = [],
			themes;

		generateThemeT13IndicativePresent(suffixes, verb, themes, REGULAR, 0);
		generateThemeT13IndicativePresent(suffixes, verb, themes, IRREGULAR, 0);

		//expand forms
		suffixes.map(expandForm)
			.map(function(expanded){
				expanded.map(function(suff){
					console.log(suff + '/a');
				});
			});
	};

	//if inf contains l > add /aEÈ
	//if inf contains ƚ > add /aEÉ
	//if inf does not contains l or ƚ > add /aEÈÉ
	var getVanishingFlag = function(word){
		if(word.search(/ƚ/) >= 0)
			return 'É';
		if(word.search(/(^|[aeiouàèéíòóú])l[aeiouàèéíòóú]/) >= 0 || word.search(/[đŧ]/) >= 0)
			return 'È';
		return 'ÈÉ';
	};

	var generateDic = function(verbs){
		var dialect = new Dialect(),
			all = {},
			theme, inf;
		verbs.forEach(function(v){
			generateExpansions(v.infinitive, function(verb){
				if(!all[verb]){
					all[verb] = true;

					verb = new Verb(verb);
					theme = Themizer.generate(verb, dialect);
					inf = unmarkDefaultStress(verb.infinitive);

					switch(verb.conjugation){
						case 1:
							if(!Word.isStressed(inf)){
								//-àr
								console.log(inf + '/aE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'o') + '/aE' + getVanishingFlag(inf) + 'IJ	po:verb ts:indicative_present st:' + inf);
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'oe') + '/aK	po:verb ts:indicative_present is:interrogative st:' + inf);
							}
							else{
								//'-ar
								console.log(inf + '/bE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
								console.log(unmarkDefaultStress((theme.regular.themeT4? theme.regular.themeT4: theme.irregular.themeT4) + 'rò') + '/bJ	po:verb ts:indicative_future st:' + inf);
							}
							break;

						case 2:
							if(!verb.rhizotonic){
								//-ér
								console.log(inf + '/aE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'o') + '/aE' + getVanishingFlag(inf) + 'IJ	po:verb ts:indicative_present st:' + inf);
							}
							else{
								//'-er
								console.log(inf + '/bE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
								console.log(unmarkDefaultStress((theme.regular.themeT4? theme.regular.themeT4: theme.irregular.themeT4) + 'rò') + '/bJ	po:verb ts:indicative_future st:' + inf);
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'o') + '/aE' + getVanishingFlag(inf) + 'IJ	po:verb ts:indicative_present st:' + inf);
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'oe') + '/aK	po:verb ts:indicative_present is:interrogative st:' + inf);
							}
							break;

						case 3:
							if(verb.semiSpecial3rd){
								//-<is>ír/-ír
								console.log(inf + '/aeE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'o') + '/eE' + getVanishingFlag(inf) + 'IJ	po:verb ts:indicative_present st:' + inf);
							}
							else if(verb.special3rd){
								//-<is>ír
								console.log(inf + '/acE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
							}
							else{
								//-ír
								console.log(inf + '/adE' + getVanishingFlag(inf) + '	po:verb is:infinitive_simple');
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'o') + '/dE' + getVanishingFlag(inf) + 'IJ	po:verb ts:indicative_present st:' + inf);
								console.log(unmarkDefaultStress((theme.regular.themeT8? theme.regular.themeT8: theme.irregular.themeT8) + 'oe') + '/aK	po:verb ts:indicative_present is:interrogative st:' + inf);
							}
					}

					generateThemeT8ParticiplePerfectStrong(verb, theme);
					generateThemeT6ParticiplePerfectAlternative(verb, theme);
				}
			});
		});
	};

	var generateThemeT8ParticiplePerfectStrong = function(verb, theme){
		var t;
		[REGULAR, IRREGULAR].forEach(function(k){
			if(!t || !t.themeT8){
				t = theme[k];
				t = t.participlePerfect || t;
			}
		});
		if(t.themeT8){
			var strong = generateParticiplePerfectStrong(verb, t.themeT8);
			if(strong)
				console.log(unmarkDefaultStress(strong + 'o') + '/BI	po:verb is:participle_perfect_strong st:' + unmarkDefaultStress(verb.infinitive));
		}
	};

	var generateThemeT6ParticiplePerfectAlternative = function(verb, theme){
		var t = ((theme || {}).irregular || {}).participlePerfect || {};
		if(t.themeT6){
			var inf = unmarkDefaultStress(verb.infinitive);
			console.log(unmarkDefaultStress(t.themeT6) + '	po:verb is:participle_perfect_strong_1s st:' + inf);
			console.log(unmarkDefaultStress(t.themeT6 + 'o') + '/B	po:verb is:participle_perfect_strong_1s st:' + inf);
			console.log(unmarkDefaultStress(t.themeT6 + 'do') + '/B	po:verb is:participle_perfect_strong_1s st:' + inf);
		}
	};

	/** @private */
	var generateExpansions = function(word, callback){
		var expanded = false,
			expansion;
		expansion = word
			.replace(/([^aeiouàèéíòóúlnr])đ([aeiouàèéíòóú])/g, '$1[đx]$2')
			.replace(/(^|[aeiouàèéíòóúlnr])đ([aeiouàèéíòóú])/g, '$1[dđx]$2')
			.replace(/ŧ/g, '[sŧ]')
			.replace(/[jɉ]/g, '[jɉ]');
		if(!word.match(/[đŧ]/))
			expansion = unstressedVowelBeforeVibrantFreeVariation(expansion);
		if(expansion != word){
			expanded = true;

			expandForm(expansion).forEach(function(s){
				callback(s);
			});
		}

		expansion = word
			.replace(/(^|[aeiouàèéíòóú])l([aeiouàèéíòóú])/g, '$1[lƚ]$2')
			.replace(/đ/g, 'x')
			.replace(/ŧ/g, 's')
			.replace(/[jɉ]/g, '[jɉ]');
		if(!word.match(/[đŧ]/))
			expansion = unstressedVowelBeforeVibrantFreeVariation(expansion);
		if(expansion != word){
			expanded = true;

			expandForm(expansion).forEach(function(s){
				callback(s);
			});
		}

		if(!expanded)
			callback(word);
	};

	var generateTheme = (function(){
		var themeFuncts = [
			undefined,
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT1InfinitiveSimple(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT1InfinitiveSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT2ParticiplePerfect(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT2ParticiplePerfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				if(!verb.irregularity.eser){
					generateThemeT2IndicativeImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT2SubjunctiveImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT2GerundSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				}
				//ensure syncope does not occurs
				if(!verb.irregularity.verb.match(/^(dixer|poder|[tv]oler|traer)$/))
					generateThemeT2IndicativeImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT2SubjunctiveImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT2GerundSimple(paradigm, verb, themes, REGULAR, origins, originTheme);
			},
			undefined,
			function(paradigm, verb, themes, origins, originTheme){
				if(!verb.irregularity.eser){
					generateThemeT4IndicativeFuture(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT4ConditionalSimple(paradigm, verb, themes, REGULAR, origins, originTheme);
				}
				generateThemeT4IndicativeFuture(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT4ConditionalSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT5IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT5IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				//ensure syncope does not occurs
				if(!verb.irregularity.verb.match(/^(dever|eser|s?aver)$/))
					generateThemeT5SubjunctivePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT5SubjunctivePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				if(!verb.irregularity.poder){
					generateThemeT5ImperativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT5ImperativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				}
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT6ParticiplePerfect(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT6ParticiplePerfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT7ParticipleImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT7ParticipleImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT7ParticiplePerfect(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT7ParticiplePerfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				if(!verb.irregularity.eser)
					generateThemeT7GerundSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT8IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT8IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				if(!verb.irregularity.verb.match(/^(dever|eser|s?aver)$/))
					generateThemeT8SubjunctivePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT8SubjunctivePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT8ParticiplePerfect_strong(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				if(!verb.irregularity.poder){
					generateThemeT9ImperativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT9ImperativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				}
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT10IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT10IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				if(!verb.irregularity.eser){
					generateThemeT11IndicativeImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
				}
				//ensure syncope does not occurs
				if(!verb.irregularity.verb.match(/^(dixer|poder|[tv]oler|traer)$/))
					generateThemeT11IndicativeImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT12IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT12IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				//ensure syncope does not occurs
				if(!verb.irregularity.verb.match(/^(dever|eser|s?aver)$/))
					generateThemeT12SubjunctivePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT12SubjunctivePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			}
		];

		return function(verbs, infinitiveThemes, theme, originTheme){
			var paradigm = [],
				origins = [],
				fun = themeFuncts[theme],
				themes;
			verbs.forEach(function(verb){
				themes = infinitiveThemes[verb.infinitive];

				fun(paradigm, verb, themes, origins, originTheme);
			});

			compactEqualSuffixes(paradigm);

			constraintToInfinitives(paradigm, origins);

			return paradigm;
		};
	})();


	/** @private */
	var printParadigm = function(list, verbs){
		var logs = [],
			newList = [];
		if(list.length && list[0] != undefined)
			while(list.length){
				newList.length = 0;
				list.forEach(function(suffix){
					printParadigmSuffix(suffix, this, verbs, logs, newList);
				}, /^(.+)>([^ ]+)(?: \# (.+))?$/);

				list.length = 0;
				newList.forEach(function(suffix){
					printParadigmSuffix(suffix, this, verbs, logs, list);
				}, /^(.+)>([^ ]+)(?: \# (.+))?$/);
			}

		if(logs.length)
			printSuffixes(logs, 1, 'vèrbi');
	};

	/** @private */
	var printParadigmSuffix = function(suffix, re, verbs, logs, newList){
		var m = suffix.match(re),
			parents = (m[3] || '').split(',').filter(function(parent){ return parent; }).sort(),
			constraint = extractCommonPartFromList(parents),
			skip = false,
			part, keys, pre, diff;
		if(constraint){
			diff = difference(verbs, parents);
			if(diff.some(function(verb){ return verb.match(this); }, new RegExp(constraint + '$'))){
				part = ArrayHelper.partition(parents, function(el){ return (el.length - constraint.length >= 1? el[el.length - constraint.length - 1]: '^'); });
				keys = Object.keys(part);
				pre = listToRegExp(keys);
				if(diff.some(function(verb){ return verb.match(this); }, new RegExp(pre + constraint + '$'))){
					//separate each part into its corresponding entry
					keys.map(function(k){ return m[1] + '>' + m[2] + '|' + extractCommonPartFromList(this[k]) + ' # ' + this[k].join(','); }, part)
						.forEach(function(line){ newList.push(line); });
					skip = true;
				}
				else
					constraint = pre + constraint;
			}
		}

		if(!skip){
			//if m[1] and m[2] does not contain any l or ƚ, and if constraint contain an l or an ƚ
			re = /(^|[aeiouàèéíòóú])[lƚ]([aeiouàèéíòóú])/;
			if(!m[1].match(re) && !m[1].match(/[đŧ]/) && !m[2].match(re) && !m[2].match(/[đŧ]/) && constraint.match(re) && !constraint.match(/[đŧ]/))
				constraint = constraint.replace(/(^|[aeiouàèéíòóú])[lƚ]([aeiouàèéíòóú])/g, '$1[lƚ]$2');

			storeSuffix(logs, 1, m[1], m[2], constraint, parents);
		}
	};

	/** @private */
	var printReductions = function(list, comment){
		var re = new RegExp(escapeRegExp(MARKER_FLAGS)),
			subst, flag, substitution,
			form, constraint,
			firstReduction, logs, line, i, m;
		//expand suffixes
		Object.keys(list).forEach(function(key){
			if(key != '0')
				list[key].forEach(function(reduction){
					flag = reduction.shift();

					for(i = reduction.length - 1; i >= 0; i --){
						form = reduction[i];
						substitution = extractSimpleForm(form.replace(PATTERN_LEAVE_REPLACEMENT, ''));
						constraint = substitution;

						m = form.match(/^(.+?)>(.+?)(?:\|(.+))?$/);
						if(m){
							substitution = m[1];
							form = m[2];
							constraint = m[3] || substitution;
						}

						expandForm(form.replace(re, '')).forEach(function(f){
							if(substitution != f)
								reduction.push(substitution + '>' + f + (constraint != '0'? '|' + constraint: ''));
						});

						reduction.splice(i, 1);
					}

					reduction.unshift(flag);
				});
		});

		Object.keys(list).forEach(function(key){
			list[key].forEach(function(reduction){
				flag = reduction.shift();

				//remove first reduction
				if(key == '0')
					firstReduction = reduction.shift();

				substitution = extractSimpleForm(reduction[0]);

				logs = [];
				reduction.forEach(function(el){
					m = el.match(/^(.+?)>(.+?)(?:\|(.+))?$/);
					if(m){
						subst = m[1];
						form = m[2];
						constraint = m[3] || subst;
					}
					else{
						subst = substitution;
						form = el;
						constraint = subst;
					}

					expandForm(form.replace(re, '')).forEach(function(f){
						if(subst != f){
							line = getSuffixLine(flag, subst, f, constraint);
							if(logs.indexOf(line) < 0)
								logs.push(line);
						}
					});
				});

				//restore first reduction
				if(key == '0')
					reduction.unshift(firstReduction);

				reduction.unshift(flag);

				if(logs.length)
					printSuffixes(logs, flag, comment);
			});
		});
	};

	/** @private */
	var storeSuffix = function(logs, i, replaced, replacement, constraint, parents){
		if(!replaced)
			replaced = 0;
		if(replacement.indexOf(MARKER_FLAGS) >= 0)
			replacement = replacement.replace('/' + MARKER_FLAGS, '').replace(MARKER_FLAGS, '');
		if(!constraint && replaced)
			constraint = replaced;

		var line = getSuffixLine(i, replaced, replacement, constraint, parents);
		if(logs.indexOf(line) < 0)
			logs.push(line);
	};

	/** @private */
	var getSuffixLine = function(flag, replaced, replacement, constraint, parents){
		replacement = replacement.replace(/\|.+$/, '');

		if(!printFlagsAsNumber){
			var startChar = FLAG_START.charCodeAt(0) - 1;
			flag = String.fromCharCode(flag + startChar);

			var m = replacement.match(/^(.+\/)(.+)$/);
			if(m)
				replacement = m[1] + m[2].split(FLAG_SEPARATOR).map(function(rep){ return String.fromCharCode(Number(rep) + startChar); }).join('');
		}

		constraint = (constraint && constraint != '0'? ' ' + (parents && parents.length == 1? parents[0]: constraint): '');

		return 'SFX ' + flag + ' ' + replaced + ' ' + replacement + constraint
//			+ (parents? ' # ' + parents.join(FLAG_SEPARATOR): '')
			;
	};

	/** @private */
	var printSuffixes = function(logs, flag, comment){
		if(!printFlagsAsNumber)
			flag = String.fromCharCode(flag + FLAG_START.charCodeAt(0) - 1);

		console.log('SFX ' + flag + ' Y ' + logs.length + (comment != undefined? ' # ' + comment: ''));
		logs.sort().forEach(function(log){
			console.log(log);
		});
	};

	/** @private */
	var extractCommonPartsFromStart = function(a, b){
		for(var i = 0, len = Math.min(a.replace(PATTERN_FLAGS, '').length, b.replace(PATTERN_FLAGS, '').length) - 1; i < len; i ++)
			if(a[i] != b[i])
				break;
		return {a: a.substr(i), b: b.substr(i)};
	};

	/** @private */
	var extractCommonPartFromList = function(list){
		return list.reduce(function(prev, curr){ return extractCommonPartFromEnd(curr, prev); }, list[0]);
	};

	/** @private */
	var extractCommonPartFromEnd = function(a, b){
		for(var i = 0, len = Math.min(a.length, b.length); i < len; i ++)
			if(a[a.length - i - 1] != b[b.length - i - 1])
				break;
		return (i > 0? a.substr(a.length - i): '');
	};

	/** @private */
	var compactEqualSuffixes = function(list){
		list.forEach(function(sublist){
			sublist.suffixes = mergeIdenticalTransformations(sublist.suffixes);
		});

		if(list.length){
			var theme = list[0].theme,
				compacted = ArrayHelper.partition(list, function(el){ return el.suffixes.join(';'); });
			compacted = Object.keys(compacted).map(function(key){
				return {
					theme: theme,
					origins: compacted[key].map(function(el){ return el.origin; }),
					suffixes: key.split(';')
				};
			});
			setElements(list, compacted);
		}
	};

	/** @private */
	var extractSimpleForm = function(form){
		return form.replace(PATTERN_FLAGS, '')
			.replace(/\(.+?\)/g, '')
			.replace(/\[.+\]/g, function(value){ return value.replace(/^\[|\]$/g, '').split(value.indexOf('/') >= 0? '/': '')[0]; });
	};

	/** @private */
	var setElements = function(list, newList){
		list.length = 0;
		list.push.apply(list, newList);
	};

	/**
	 * Merge identical transformations with different flags
	 *
	 * @private
	 */
	var mergeIdenticalTransformations = function(sublist){
		sublist = unique(sublist);

		var flag = sublist.shift();
		if(!Number.isFinite(flag)){
			sublist.unshift(flag);
			flag = null;
		}

		if(sublist.length && sublist[0] != undefined){
			var parts = ArrayHelper.partition(sublist, function(el){ return el.replace(/\/[\d,@]+/, ''); }),
				constraints, markerFlagFound, parents;
			sublist = Object.keys(parts).map(function(p){
				constraints = parts[p].map(function(el){ return el.match(this)[1]; }, /([\d,@]*)(?: # .+)?$/)
					.filter(function(constraint){ return constraint; });
				markerFlagFound = constraints.some(function(el){ return (el.indexOf(MARKER_FLAGS) >= 0); });
				constraints = ArrayHelper.flatten(constraints.map(function(el){ return el.replace(MARKER_FLAGS, '').split(','); }))
					.filter(function(el){ return el; })
					.map(function(el){ return Number(el); })
					.sort(function(a, b){ return a - b; });
				constraints = unique(constraints).join(',') + (markerFlagFound? MARKER_FLAGS: '');
				parents = p.match(/( # .+)?$/)[1];
				return (constraints? p.replace(/( # .+)?$/, '') + '/' + constraints + (parents || ''): p);
			});
		}

		if(flag)
			sublist.unshift(flag);
		return sublist;
	};

	/** @private */
	var escapeRegExp = function(word){
		return word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};

	/** @private */
	var constraintToInfinitives = function(list, origins){
		for(var i = list.length - 1; i >= 0; i --)
			if(list[i].origins.length > 1)
				partition(list[i], origins, list);
	};

	/** @private */
	var partition = function(obj, origins, list){
		var stack = [obj],
			common, part, diff,
			partitioningResults;
		while(stack.length){
			obj = stack.shift();
			common = extractCommonPartFromList(obj.origins);
			part = ArrayHelper.partition(obj.origins, function(el){ return (el.length - common.length >= 1? el[el.length - common.length - 1]: '^'); });
			diff = difference(origins, obj.origins);

			//partitin origins into those who match the keys of part and who doesn't
			partitioningResults = {true: [], false: []};
			Object.keys(part).forEach(function(k){
				partitioningResults[diff.some(function(el){ return el.match(this); }, new RegExp(k + common + '$'))].push(k);
			});

			if(partitioningResults[false].length){
				obj.matcher = (partitioningResults[false].indexOf('^') < 0 && partitioningResults[true].length? listToRegExp(partitioningResults[false]): '') + common;
				//extract the parent w.r.t. the partitioning results
				obj.origins = ArrayHelper.flatten(partitioningResults[false].map(function(chr){ return part[chr]; }));
			}
			else{
				obj.origins = part[partitioningResults[true].shift()];
				stack.push(obj);
			}

			if(partitioningResults[true].length)
				partitioningResults[true].forEach(function(kk){
					obj = {theme: obj.theme, origins: part[kk], suffixes: obj.suffixes};
					list.push(obj);
					stack.push(obj);
				});
		}
	};

	/** @private */
	var unique = function(arr){
		return arr.filter(function(el, idx){ return (this.indexOf(el) == idx); }, arr);
	};

	/** @private */
	var difference = function(minuend, subtrahend){
		return minuend.filter(function(value){ return (this.indexOf(value) < 0); }, subtrahend);
	};

	/** @private */
	var listToRegExp = function(list){
		if(!list.length)
			return '';
		if(list.indexOf('^') >= 0)
			return '[^' + difference('aàbcdđeéèfghiíjɉklƚmnñoóòprstŧuúvx'.split(''), list).join('') + ']';
		return (list.length == 1? list[0]: '[' + list.sort().join('') + ']');
	};

	var expandForm = (function(){
		var add = function(list, value){
			if(list.indexOf(value) < 0)
				list.push(value);
		};


		return function recurse(forms, list){
			var m;
			if(!Array.isArray(list))
				list = [];
			[].concat(forms).forEach(function(form){
				m = form.match(/^(.*)([\(\[])(.+)[\)\]](.*)$/);
				if(m){
					m[1] = m[1] || '';
					m[4] = m[4] || '';

					if(m[2] == '('){
						recurse(m[1] + m[4], list);
						if(m[3].indexOf('/') >= 0)
							m[3].split('/').forEach(function(el){
								recurse(m[1] + el + m[4], list);
							});
						else
							recurse(m[1] + m[3] + m[4], list);
					}
					else
						m[3].split(m[3].indexOf('/') >= 0? '/': '').forEach(function(el){
							recurse(m[1] + el + m[4], list);
						});
				}
				else
					add(list, form);
			});
			return list;
		};
	})();


	/** @private */
	var generateThemeT1InfinitiveSimple = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT1 || origin, 'Error on origin for theme T1 "' + themes.themeT1 + '" ("' + verb.infinitive + '") infinitive simple');
		if(themes.themeT1 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.infinitive.match(/(déver|(^|[^t])èser|s?av?ér|^[‘']vér)$/)){
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'r', null, null, '/' + MARKER_FLAGS);
				if(verb.irregularity.eser || verb.irregularity.aver)
					insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'rge');
			}
			else{
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'r', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'rme', null, null, '/' + PRONOMENAL_MARK_2);
			}
			insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 're');
		}
	};

	/** @private */
	var generateThemeT2IndicativeImperfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT2 || origin, 'Error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") indicative imperfect');
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			generateT2IndicativeImperfect(paradigm, verb, themes.themeT2, origin);

			if(runAllForms){
				if(themes.themeT2.match(/à$/))
					generateT2IndicativeImperfect(paradigm, verb, themes.themeT2.replace(/à$/, 'é'), origin);
				if(themes.themeT2.match(/í$/))
					generateT2IndicativeImperfect(paradigm, verb, themes.themeT2.replace(/í$/, 'é'), origin);
			}
		}
	};

	/** @private */
	var generateT2IndicativeImperfect = function(paradigm, verb, themeT2, origin){
		var tmp = 'v';
		if(verb.irregularity.eser){
			themeT2 = '(j/ɉ/x)' + themeT2;
			tmp = 'r';
		}
		else if(verb.irregularity.aver)
			themeT2 = themeT2.replace(/^gav/, 'g(av)');

		expandForm(themeT2).forEach(function(t){
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'o', /o$/, '[oae]', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'omi', /omi$/, '[oae]mi', '/' + INTERROGATIVE_MARK_1S_2);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'i', null, null, '/' + INTERROGATIVE_MARK_2S);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'itu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'a', /a$/, '[ai]', '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'au', null, null, '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'a', null, null, '/' + INTERROGATIVE_MARK_3);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'elo', null, null, '/' + INTERROGATIVE_MARK_3_2);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'imo', null, null, '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 2, verb.infinitive, origin, t + tmp + 'imoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
			if(tmp == 'v' || !verb.irregularity.eser){
				insert(paradigm, 2, verb.infinitive, origin, t + 'o', /o$/, '[oae]', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 2, verb.infinitive, origin, t + 'omi', /omi$/, '[oae]mi', '/' + INTERROGATIVE_MARK_1S_2);
				insert(paradigm, 2, verb.infinitive, origin, t + 'i', null, null, '/' + INTERROGATIVE_MARK_2S);
				insert(paradigm, 2, verb.infinitive, origin, t + 'itu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
				insert(paradigm, 2, verb.infinitive, origin, t + 'a', /a$/, '[ai]', '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, 2, verb.infinitive, origin, t + 'au', null, null, '/' + INTERROGATIVE_MARK_2P_2);
				insert(paradigm, 2, verb.infinitive, origin, t + 'a', null, null, '/' + INTERROGATIVE_MARK_3);
				insert(paradigm, 2, verb.infinitive, origin, t + 'elo', null, null, '/' + INTERROGATIVE_MARK_3_2);
				insert(paradigm, 2, verb.infinitive, origin, t + 'imo', null, null, '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 2, verb.infinitive, origin, t + 'imoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
			}
		});
	};

	/** @private */
	var generateThemeT2SubjunctiveImperfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT2 || origin, 'Error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") subjunctive imperfect');
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var themeT2 = themes.themeT2;
			if(verb.irregularity.eser)
				themeT2 = themeT2.replace(/^fú/, '[fú/furé]');
			else if(verb.irregularity.aver)
				themeT2 = themeT2.replace(/^gav/, 'g(av)');

			expandForm(themeT2).forEach(function(t){
				generateT2SubjunctiveImperfect(paradigm, verb, t, origin);

				if(runAllForms){
					if(t.match(/à$/))
						generateT2SubjunctiveImperfect(paradigm, verb, t.replace(/à$/, 'é'), origin);
					if(t.match(/í$/))
						generateT2SubjunctiveImperfect(paradigm, verb, t.replace(/í$/, 'é'), origin);
				}
			});
		}
	};

	/** @private */
	var generateT2SubjunctiveImperfect = function(paradigm, verb, themeT2, origin){
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'se', null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'si');
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'simo');
	};

	/** @private */
	var generateThemeT2ParticiplePerfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		themes = themes.participlePerfect || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT2 || origin, 'Error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") participle perfect');
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'sto', /o$/, '[oaie]', '/' + FINAL_CONSONANT_VOICING_MARK);

			//se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			if(runAllForms){
				var themeT2;
				if(themes.themeT2.match(/à$/)){
					themeT2 = themes.themeT2.replace(/à$/, 'é');
					insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'sto', /o$/, '[oaie]', '/' + FINAL_CONSONANT_VOICING_MARK);
				}
				if(themes.themeT2.match(/í$/)){
					themeT2 = themes.themeT2.replace(/í$/, 'é');
					insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'sto', /o$/, '[oaie]', '/' + FINAL_CONSONANT_VOICING_MARK);
				}
			}
		}
	};

	/** @private */
	var generateThemeT2GerundSimple = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT2 || origin, 'Error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") gerund simple');
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(!verb.infinitive.match(/(déver|(^|[^t])èser|s?av?ér|^[‘']vér)$/)){
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndo', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
			}
			else
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndo', null, null, '/' + MARKER_FLAGS);
			if(verb.irregularity.eser){
				insert(paradigm, 2, verb.infinitive, origin, 'siàndo');
				expandForm('[e‘]séndo').forEach(function(t){
					insert(paradigm, 2, verb.infinitive, origin, t);
				});
				insert(paradigm, 2, verb.infinitive, origin, 'siàndome', null, null, '/' + PRONOMENAL_MARK_2);
			}
			else if(verb.irregularity.aver){
				expandForm('[a‘]biàndo(ge)').forEach(function(t){
					insert(paradigm, 2, verb.infinitive, origin, t);
				});
				expandForm('[a‘]véndo(ge)').forEach(function(t){
					insert(paradigm, 2, verb.infinitive, origin, t);
				});
				insert(paradigm, 2, verb.infinitive, origin, 'abiàndome', null, null, '/' + PRONOMENAL_MARK_2);
			}

			//se pòl katar un metaplaxmo da la 3a koniug. a la 2a koniug.
			if(runAllForms){
				var themeT2;
				if(themes.themeT2.match(/à$/)){
					themeT2 = themes.themeT2.replace(/à$/, 'é');
					if(!verb.infinitive.match(/(déver|(^|[^t])èser|s?av?ér|^[‘']vér)$/)){
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
					}
					else
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + MARKER_FLAGS);
				}
				if(themes.themeT2.match(/í$/)){
					themeT2 = themes.themeT2.replace(/í$/, 'é');
					if(!verb.infinitive.match(/(déver|(^|[^t])èser|s?av?ér|^[‘']vér)$/)){
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
					}
					else
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + MARKER_FLAGS);
				}
			}
		}
	};

	/** @private */
	var generateThemeT4IndicativeFuture = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT4 || origin, 'Error on origin for theme T4 "' + themes.themeT4 + '" ("' + verb.infinitive + '") indicative future');
		if(themes.themeT4 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var themeT4 = themes.themeT4;
			if(verb.irregularity.aver)
				themeT4 = themeT4.replace(/^gav/, 'g(av)');

			expandForm(themeT4).forEach(function(t){
				generateT4IndicativeFuture(paradigm, verb, t, origin);

				//se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
				if(runAllForms){
					if(t.match(/a$/))
						generateT4IndicativeFuture(paradigm, verb, t.replace(/a$/, 'e'), origin);
					if(t.match(/i$/))
						generateT4IndicativeFuture(paradigm, verb, t.replace(/i$/, 'e'), origin);
				}
			});
		}
	};

	/** @private */
	var generateT4IndicativeFuture = function(paradigm, verb, themeT4, origin){
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rà', null, null, '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P + MARKER_FLAGS);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ràmi', null, null, '/' + INTERROGATIVE_MARK_1S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rè', /è$/, '[èò]', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rèmi', /èmi$/, '[èò]mi', '/' + INTERROGATIVE_MARK_1S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rà', null, null, '/' + INTERROGATIVE_MARK_2S);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ràtu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rà', null, null, '/' + INTERROGATIVE_MARK_3);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ràlo', null, null, '/' + INTERROGATIVE_MARK_3_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ré', null, null, '/' + INTERROGATIVE_MARK_2P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'réu', null, null, '/' + INTERROGATIVE_MARK_2P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rémo', null, null, '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rémoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rón', null, null, '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'róni', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rén', null, null, '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'réni', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		if(verb.conjugation == 2){
			insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rí', null, null, '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ríu', null, null, '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rímo', null, null, '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rímoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		}
	};

	/** @private */
	var generateThemeT4ConditionalSimple = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT4 || origin, 'Error on origin for theme T4 "' + themes.themeT4 + '" ("' + verb.infinitive + '") conditional simple');
		if(themes.themeT4 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var themeT4 = themes.themeT4;
			if(verb.irregularity.aver)
				themeT4 = themeT4.replace(/^gav/, 'g(av)');

			expandForm(themeT4).forEach(function(t){
				generateT4ConditionalSimple(paradigm, verb, t, origin);

				//se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
				if(runAllForms){
					if(t.match(/a$/))
						generateT4ConditionalSimple(paradigm, verb, t.replace(/a$/, 'e'), origin);
					if(t.match(/i$/))
						generateT4ConditionalSimple(paradigm, verb, t.replace(/i$/, 'e'), origin);
				}
			});
		}
	};

	/** @private */
	var generateT4ConditionalSimple = function(paradigm, verb, themeT4, origin){
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ría', null, null, '/' + INTERROGATIVE_MARK_2S);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ríatu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ría', /a$/, '[ae]', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ríami', /ami$/, '[ae]mi', '/' + INTERROGATIVE_MARK_1S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ría', /a$/, '[ae]', '/' + INTERROGATIVE_MARK_3);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ríelo', null, null, '/' + INTERROGATIVE_MARK_3_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rési', null, null, '/' + INTERROGATIVE_MARK_2P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'résiu', null, null, '/' + INTERROGATIVE_MARK_2P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'résimo', null, null, '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'résimoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rié', /ié$/, '(is)ié', '/' + INTERROGATIVE_MARK_2P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'riéu', /iéu$/, '(is)iéu', '/' + INTERROGATIVE_MARK_2P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rón', /on$/, '(is)(i)on', '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'róni', /oni$/, '(is)(i)oni', '/' + INTERROGATIVE_MARK_1P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rén', /en$/, '(is)en', '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'réni', /eni$/, '(is)eni', '/' + INTERROGATIVE_MARK_1P_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rón', /on$/, '(is)(i)onse');
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rén', /en$/, '(is)ense');
		//NOTE: i únegi pronòmi interogativi enklítegi ke se dopara i xe kueli de 3a pars
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ràe', null, null, '/' + INTERROGATIVE_MARK_3);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ràve', null, null, '/' + INTERROGATIVE_MARK_3 + FLAG_SEPARATOR + INTERROGATIVE_MARK_3_CONDITIONAL_SIMPLE);
	};

	/** @private */
	var generateThemeT5IndicativePresent = function(paradigm, verb, themes, type, origins, originTheme){
		var t = themes[type];
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			Assert.assert(origin, 'Error on origin for theme T5 "' + t.themeT5 + '" ("' + verb.infinitive + '") indicative present');
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			var themeT5 = themes.themeT5;
			if(verb.irregularity.aver)
				themeT5 = themeT5.replace(/^av/, 'a(v)').replace(/^gav/, 'g(av)');

			expandForm(themeT5).forEach(function(t){
				insert(paradigm, 5, verb.infinitive, origin, t, null, null, '/' + INTERROGATIVE_MARK_2P + MARKER_FLAGS);
				insert(paradigm, 5, verb.infinitive, origin, t + 'u', null, null, '/' + INTERROGATIVE_MARK_2P_2);
				insert(paradigm, 5, verb.infinitive, origin, t.replace(/è$/, 'é') + 'mo', null, null, '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 5, verb.infinitive, origin, t.replace(/è$/, 'é') + 'moi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
				if(conj == 2){
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/i?é$/, 'í'), null, null, '/' + INTERROGATIVE_MARK_2P);
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/i?é$/, 'í') + 'u', null, null, '/' + INTERROGATIVE_MARK_2P_2);
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/i?é$/, 'í') + 'mo', null, null, '/' + INTERROGATIVE_MARK_1P);
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/i?é$/, 'í') + 'moi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
				}
			});
		}
	};

	/** @private */
	var generateThemeT5SubjunctivePresent = function(paradigm, verb, themes, type, origins, originTheme){
		var t = themes[type];
		t = t.subjunctive || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			t = t.subjunctive || t;
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			Assert.assert(origin, 'Error on origin for theme T5 "' + t.themeT5 + '" ("' + verb.infinitive + '") subjunctive present');
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			var themeT5 = themes.themeT5;
			if(verb.irregularity.aver)
				themeT5 = themeT5.replace(/^ap/, '[ap/ab/ep]').replace(/^gap/, 'ga[pb]');

			expandForm(themeT5).forEach(function(t){
				insert(paradigm, 5, verb.infinitive, origin, t);
				insert(paradigm, 5, verb.infinitive, origin, t.replace(/è$/, 'é') + 'mo');
				if(conj == 2 && t.replace(/i?é$/, 'í') != t){
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/i?é$/, 'í'));
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/i?é$/, 'í') + 'mo');
				}
				if(conj != 2){
					insert(paradigm, 5, verb.infinitive, origin, t.replace(/[èí]$/, 'é'));

					if(conj == 3 && !verb.special3rd){
						insert(paradigm, 5, verb.infinitive, origin, t);
						insert(paradigm, 5, verb.infinitive, origin, t.replace(/í$/, 'i') + 'de');
						insert(paradigm, 5, verb.infinitive, origin, t.replace(/í$/, 'i') + 'ge');
					}
				}
			});
		}
	};

	/** @private */
	var generateThemeT5ImperativePresent = function(paradigm, verb, themes, type, origins, originTheme){
		var t = themes[type];
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			Assert.assert(origin, 'Error on origin for theme T5 "' + t.themeT5 + '" ("' + verb.infinitive + '") imperative present');
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5, null, null, '/' + PRONOMENAL_IMPERATIVE_MARK);
			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5 + 'me', /ame$/, 'eme', '/' + PRONOMENAL_IMPERATIVE_MARK_2);
			if(conj == 2){
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í'), null, null, '/' + PRONOMENAL_IMPERATIVE_MARK);
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í') + 'me', /ame$/, 'eme', '/' + PRONOMENAL_IMPERATIVE_MARK_2);
			}
			else{
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/[èí]$/, 'é'), null, null, '/' + PRONOMENAL_IMPERATIVE_MARK);
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í') + 'me', /ame$/, 'eme', '/' + PRONOMENAL_IMPERATIVE_MARK_2);
			}
		}
	};

	/** @private */
	var generateThemeT6ParticiplePerfect = function(paradigm, verb, themes, type, origins, originTheme){
		var t = themes[type];
		t = t.participlePerfect || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT6 && !origin){
			t = themes[REGULAR];
			t = t.participlePerfect || t;
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			Assert.assert(origin, 'Error on origin for theme T6 "' + t.themeT6 + '" ("' + verb.infinitive + '") participle perfect');
		}
		themes = t;

		if(themes.themeT6 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, 6, verb.infinitive, origin, themes.themeT6, null, null, MARKER_FLAGS);
			insert(paradigm, 6, verb.infinitive, origin, themes.themeT6 + 'o', /o$/, '[oaie]');
			insert(paradigm, 6, verb.infinitive, origin, themes.themeT6 + 'do', /do$/, 'd[oaie]');
		}
	};

	/** @private */
	var generateThemeT7ParticipleImperfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT7 || origin, 'Error on origin for theme T7 "' + themes.themeT7 + '" ("' + verb.infinitive + '") participle imperfect');
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'nte', null, null, MARKER_FLAGS);
		}
	};

	/** @private */
	var generateThemeT7ParticiplePerfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		themes = themes.participlePerfect || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT7 || origin, 'Error on origin for theme T7 "' + themes.themeT7 + '" ("' + verb.infinitive + '") participle perfect');
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.conjugation == 3)
				insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'sto', /o$/, '[oaie]', '/' + FINAL_CONSONANT_VOICING_MARK);
		}
	};

	/** @private */
	var generateThemeT7GerundSimple = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT7 || origin, 'Error on origin for theme T7 "' + themes.themeT7 + '" ("' + verb.infinitive + '") gerund simple');
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.conjugation == 3){
				if(this.verb.infinitive.match(/(déver|(^|[^t])èser|s?av?ér|^[‘']vér)$/))
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndo');
				else{
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndo', null, null, '/' + PRONOMENAL_MARK);
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
				}
			}
		}
	};

	/** @private */
	var generateThemeT8IndicativePresent = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT8 || origin, 'Error on origin for theme T8 "' + themes.themeT8 + '" ("' + verb.infinitive + '") indicative present');
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT8).forEach(function(t){
				if(verb.irregularity.eser){
					insert(paradigm, 8, verb.infinitive, origin, t + 'ón', /([^cijɉñ])on$/, '$1(i)on', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
					insert(paradigm, 8, verb.infinitive, origin, t + 'ónmi', /([^cijɉñ])onmi$/, '$1(i)onmi', '/' + INTERROGATIVE_MARK_1S_2);
					insert(paradigm, 8, verb.infinitive, origin, t + 'óni', /([^cijɉñ])oni$/, '$1(i)oni', '/' + INTERROGATIVE_MARK_1P_2);
				}
				else if(verb.irregularity.aver){
					insert(paradigm, 8, verb.infinitive, origin, t, /à$/, '[àèò]', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
					insert(paradigm, 8, verb.infinitive, origin, t + 'mi', /àmi$/, '[àèò]mi', '/' + INTERROGATIVE_MARK_1S_2);
				}
				else{
					insert(paradigm, 8, verb.infinitive, origin, t + 'o', /o$/, '[oe]', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
					insert(paradigm, 8, verb.infinitive, origin, t + 'omi', /omi$/, '[oe]mi', '/' + INTERROGATIVE_MARK_1S_2);

					if(verb.irregularity.verb && type == IRREGULAR){
						if(verb.irregularity.saver){
							insert(paradigm, 8, verb.infinitive, origin, t.replace(/à$/, 'ò'), null, null, '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
							insert(paradigm, 8, verb.infinitive, origin, t.replace(/à$/, 'ò') + 'mi', null, null, '/' + INTERROGATIVE_MARK_1S_2);
						}
						else{
							insert(paradigm, 8, verb.infinitive, origin, t + 'o', /([aeiouàèéíòóú])o$/, '$1(g)o', '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
							insert(paradigm, 8, verb.infinitive, origin, t + 'omi', /([aeiouàèéíòóú])omi$/, '$1(g)omi', '/' + INTERROGATIVE_MARK_1S_2);
						}
					}
				}
				insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/^(andar|darStarFar|s?aver)$/) || !t.match(/à$/)? 'i': '')), null, null, '/' + INTERROGATIVE_MARK_2S);
				insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/^(andar|darStarFar|s?aver)$/) || !t.match(/à$/)? 'i': '')) + 'tu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
				var third = t + (!verb.irregularity.verb.match(/^(darStarFar|s?aver)$/)? (verb.irregularity.eser? 'é': 'e'): '');
				insert(paradigm, 8, verb.infinitive, origin, third, null, null, '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
				insert(paradigm, 8, verb.infinitive, origin, third.replace(/[ai]$/, 'e') + 'lo', null, null, '/' + INTERROGATIVE_MARK_3_2);
				if(third.match(/[^aeiouàèéíòóú]e$/))
					insert(paradigm, 8, verb.infinitive, origin, third, null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
				if(verb.irregularity.verb.match(/^(dixer|traer|toler)$/)){
					insert(paradigm, 8, verb.infinitive, origin, t.replace(/[lƚx]?$/, 'go'), null, null, '/' + INTERROGATIVE_MARK_1S + ',' + INTERROGATIVE_MARK_1P);
					insert(paradigm, 8, verb.infinitive, origin, t.replace(/[lƚx]?$/, 'go') + 'mi', null, null, '/' + INTERROGATIVE_MARK_1S_2);
				}
			});
		}
	};

	/** @private */
	var generateThemeT13IndicativePresent = function(paradigm, verb, themes, type, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT8 || origin, 'Error on origin for theme T13 "' + themes.themeT8 + '" ("' + verb.infinitive + '") indicative present');
		if(themes.themeT8 && origin){
			expandForm(themes.themeT8).forEach(function(t){
				if(verb.irregularity.eser)
					paradigm.push((t + 'ón').replace(/([^cijɉñ])on$/, '$1(i)on'));
				else if(verb.irregularity.aver)
					paradigm.push(t.replace(/à$/, '[àèò]'));
				else{
					paradigm.push(t + 'o');

					if(verb.irregularity.verb && type == IRREGULAR){
						if(verb.irregularity.saver)
							paradigm.push(t.replace(/à$/, 'ò'));
						else
							paradigm.push((t + 'o').replace(/([aeiouàèéíòóú])o$/, '$1(g)o'));
					}
				}
				if(verb.irregularity.verb.match(/^(dixer|traer|toler)$/))
					paradigm.push(t.replace(/[lƚx]?$/, 'go'));
			});
		}
	};

	/** @private */
	var generateThemeT8SubjunctivePresent = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT8 || origin, 'Error on origin for theme T8 "' + themes.themeT8 + '" ("' + verb.infinitive + '") subjunctive present');
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var themeT8 = themes.themeT8;
			if(verb.irregularity.aver)
				themeT8 = themeT8.replace(/^àp/, '[àp/àb/èp]').replace(/^gàp/, 'gà[pb]');

			expandForm(themeT8).forEach(function(t){
				insert(paradigm, 8, verb.infinitive, origin, t + 'a', /a$/, '[ae]');
				insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1i'));
				if(t.match(/[^aeiouàèéíòóú]$/))
					insert(paradigm, 8, verb.infinitive, origin, t + 'e', null, null, '/' + FINAL_CONSONANT_VOICING_MARK);

				if(type == IRREGULAR && !verb.irregularity.verb.match(/(^aver|dever|eser)$/)){
					insert(paradigm, 8, verb.infinitive, origin, t + 'a', /([aeiouàèéíòóú])a$/, '$1(g)a');
					if(t.match(/[aeiouàèéíòóú]$/))
						insert(paradigm, 8, verb.infinitive, origin, t + 'i', /i$/, '(g)i');
					else
						insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1i'));
				}

				if(verb.irregularity.verb.match(/^(dixer|traer|toler)$/))
					insert(paradigm, 8, verb.infinitive, origin, t + 'a', /[lƚx]?a$/, 'g[ai]');
			});
		}
	};

	/** @private */
	var generateThemeT8ParticiplePerfect_strong = function(paradigm, verb, themes, type, origins, originTheme){
		var t;
		[REGULAR, IRREGULAR].forEach(function(k){
			if(!t || !t.themeT8){
				t = themes[k];
				t = t.participlePerfect || t;
			}
		});
		themes = t;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT8 || origin, 'Error on origin for theme T8 "' + themes.themeT8 + '" ("' + verb.infinitive + '") participle perfect strong');
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var strong = generateParticiplePerfectStrong(verb, themes.themeT8);
			if(strong){
				insert(paradigm, 8, verb.infinitive, origin, strong + 'o', null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
				insert(paradigm, 8, verb.infinitive, origin, strong + 'o', /o$/, '[oaie]');
			}
		}
	};

	/** @private */
	var generateParticiplePerfectStrong = (function(){
		var strong = [
			//1st conjugation
			[
				{matcher: /fà$/, replacement: 'fàt'},
				{matcher: /kóns$/, replacement: 'kóns'},
				{matcher: /súg$/, replacement: 'sút'},
				{matcher: /tr$/, replacement: 'tràt'}
			],

			//2nd conjugation
			[
				//rhizotonic
				[
					{matcher: /trà$/, replacement: 'tràt'},
					{matcher: /(pià|fí)x$/, replacement: '$1s'},
					{matcher: /(spà|[mtv]è)rx$/, replacement: '$1rs'},
					{matcher: /dúx$/, replacement: 'dót'},
					{matcher: /([lƚ])[èí][dđx]$/, replacement: '$1èt'},
					{matcher: /strén[dđx]$/, replacement: 'strét'},
//TODO kuèrder > kuèrto!
					{matcher: /rd$/, replacement: 'rs'},
					{matcher: /([^v])énd$/, replacement: '$1éx'},
					{matcher: /([rn]|frí)[dđx]$/, replacement: '$1t'},
					{matcher: /ríx$/, replacement: 'rèt'},
					{matcher: /([aeiouàèéíòóúl])x$/, falsePositives: /nòx$/, replacement: '$1t'},
					{matcher: /(pà|kó)nd$/, replacement: '$1nt'},
					{matcher: /pónd$/, replacement: 'pòst'},
					{matcher: /fónd$/, replacement: 'fúx'},
					{matcher: /véd$/, replacement: 'víst'},
					{matcher: /([csŧ])éd$/, replacement: '$1ès'},
					{matcher: /([aeiouàèéíòóúnl])d$/, replacement: '$1x'},
					{matcher: /([^s])t$/, replacement: '$1s'},
					{matcher: /lv$/, replacement: 'lt'},
					{matcher: /m([òó])v$/, replacement: 'm$1s'},
					{matcher: /skrív$/, replacement: 'skrít'},
					{matcher: /prím$/, replacement: 'près'},
					{matcher: /xím$/, replacement: 'xént'},
					{matcher: /úm$/, replacement: 'únt'},
					{matcher: /pè[lƚ]$/, replacement: 'púls'},
					{matcher: /kòj$/, replacement: 'kòlt'},
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /í[jɉ]$/, replacement: 'àt'},
					{matcher: /nàs$/, replacement: 'nàt'},
					{matcher: /n[sŧ]$/, replacement: 'nt'},
					{matcher: /pón$/, replacement: 'pòst'},
					{matcher: /romàñ$/, replacement: 'romàx'},
					{matcher: /rónp$/, replacement: 'rót'},
					{matcher: /stíngu$/, replacement: 'stínt'}
				],
				//rhizoatone
				[
					{matcher: /só([lƚ])$/, replacement: 'sò$1it'},
					{matcher: /và[lƚ]$/, replacement: 'vàls'},
					{matcher: /poséd$/, replacement: 'posès'},
					//(per|re)maner
					{matcher: /n$/, replacement: 'x'},
					//{matcher: /n$/, replacement: 'st'},
					{matcher: /r$/, replacement: 'rs'},
					{matcher: /tò[lƚ]$/, replacement: 'tòlt'}
				]
			],

			//3rd conjugation
			[
				{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},
				{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /(mòr|núdr)$/, replacement: '$1èrt'},
				{matcher: /sepe[lƚ]$/, replacement: 'sepólt'},
//TODO konferir > konfèrto!
				{matcher: /fér$/, replacement: 'fèrt'},
				{matcher: /([aeiouàèéíòóú])r$/, replacement: '$1rs'}
			]
		];

		return function(verb, themeT8){
			var data = strong[verb.conjugation - 1];
			if(verb.conjugation == 2)
				data = data[verb.rhizotonic? 0: 1];

			var m, match;
			themeT8 = themeT8.replace(/\(.+\)/, '');
			if(data.some(function(el){ m = el; match = themeT8.match(el.matcher); return match; })
					&& (!m.falsePositives || !themeT8.match(m.falsePositives))){
				if(Word.isStressed(m.replacement) && !Word.isStressed(match[0]))
					themeT8 = Word.suppressStress(themeT8);
				return themeT8.replace(m.matcher, m.replacement);
			}
			return undefined;
		};

	})();

	/** @private */
	var generateThemeT9ImperativePresent = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT9 || origin, 'Error on origin for theme T9 "' + themes.themeT9 + '" ("' + verb.infinitive + '") imperative present');
		if(themes.themeT9 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT9).forEach(function(t){
				insert(paradigm, 9, verb.infinitive, origin, t, null, null, '/' + PRONOMENAL_IMPERATIVE_MARK + MARKER_FLAGS);
				insert(paradigm, 9, verb.infinitive, origin, t + 'me', null, null, '/' + PRONOMENAL_IMPERATIVE_MARK_2);
			});
		}
	};

	/** @private */
	var generateThemeT10IndicativePresent = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT10 || origin, 'Error on origin for theme T10 "' + themes.themeT10 + '" ("' + verb.infinitive + '") indicative present');
		if(themes.themeT10 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT10).forEach(function(t){
				if(themes.themeT8){
					var third = themes.themeT8 + (!verb.irregularity.verb.match(/^(darStarFar|s?aver)$/)? (verb.irregularity.eser? 'é': 'e'): '');
					if(t != third){
						if(verb.irregularity.eser)
							t = '[x]' + t;

						insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
						insert(paradigm, 10, verb.infinitive, origin, t.replace(/[ai]$/, 'e') + 'lo', null, null, '/' + INTERROGATIVE_MARK_3_2);
						if(t.match(/[^aeiouàèéíòóú]e$/))
							insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
					}
					else if(verb.irregularity.aver){
						t = 'ga';
						insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
						insert(paradigm, 10, verb.infinitive, origin, t.replace(/[ai]$/, 'e') + 'lo', null, null, '/' + INTERROGATIVE_MARK_3_2);
					}
				}
				else{
					insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
					insert(paradigm, 10, verb.infinitive, origin, t.replace(/[ai]$/, 'e') + 'lo', null, null, '/' + INTERROGATIVE_MARK_3_2);
					if(t.match(/[^aeiouàèéíòóú]e$/))
						insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
				}
			});
		}
	};

	/** @private */
	var generateThemeT11IndicativeImperfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT11 || origin, 'Error on origin for theme T11 "' + themes.themeT11 + '" ("' + verb.infinitive + '") indicative imperfect');
		if(themes.themeT11 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			//FIXME
			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ié', /ié$/, '(iv)ié', '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'iéu', /iéu$/, '(iv)iéu', '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ón', /on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)on': 'on'), '/' + INTERROGATIVE_MARK_1P + MARKER_FLAGS);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'óni', /oni$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)oni': 'oni'), '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ón', /on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)onse': 'onse'));
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ivón', /on$/, '(i)on', '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ivóni', /oni$/, '(i)oni', '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ivón', /on$/, '(i)onse');
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'én', /en$/, '(iv)en', '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'éni', /eni$/, '(iv)eni', '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'én', /en$/, '(iv)ense');
		}
	};

	/** @private */
	var generateThemeT11SubjunctiveImperfect = function(paradigm, verb, themes, type, origins, originTheme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		Assert.assert(!themes.themeT11 || origin, 'Error on origin for theme T11 "' + themes.themeT11 + '" ("' + verb.infinitive + '") subjunctive imperfect');
		if(themes.themeT11 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var themeT11 = themes.themeT11;
			if(verb.irregularity.eser)
				themeT11 = themeT11.replace(/^fu/, 'fu(re)');
			else if(verb.irregularity.aver)
				themeT11 = themeT11.replace(/^av/, 'a(v)').replace(/^gav/, 'g(av)');

			expandForm(themeT11).forEach(function(t){
				//FIXME
				//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
				insert(paradigm, 11, verb.infinitive, origin, t + 'ié', /ié$/, '(is)ié(de/ge)', '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, 11, verb.infinitive, origin, t + 'ón', /on$/, (!t.match(/[cijɉñ]$/)? '(i)on': 'on'), '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 11, verb.infinitive, origin, t + 'óni', /oni$/, (!t.match(/[cijɉñ]$/)? '(i)oni': 'oni'), '/' + INTERROGATIVE_MARK_1P_2);
				insert(paradigm, 11, verb.infinitive, origin, t + 'isón', /on$/, '(i)on', '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 11, verb.infinitive, origin, t + 'isóni', /oni$/, '(i)oni', '/' + INTERROGATIVE_MARK_1P_2);
				insert(paradigm, 11, verb.infinitive, origin, t + 'én', /en$/, '(is)en', '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 11, verb.infinitive, origin, t + 'éni', /eni$/, '(is)eni', '/' + INTERROGATIVE_MARK_1P_2);
				insert(paradigm, 11, verb.infinitive, origin, t + 'ón', /on$/, (!t.match(/[cijɉñ]$/)? '(i)on[e/se]': 'on[e/se]'));
				insert(paradigm, 11, verb.infinitive, origin, t + 'isón', /on$/, '(i)on[e/se]');
				insert(paradigm, 11, verb.infinitive, origin, t + 'én', /en$/, '(is)en[e/se]');
			});
		}
	};

	/** @private */
	var generateThemeT12IndicativePresent = function(paradigm, verb, themes, type, origins, originTheme){
		var origin = unmarkDefaultStress(getOrigin(themes[type], verb, originTheme));
		if(!origin)
			origin = unmarkDefaultStress(getOrigin(themes[type == IRREGULAR? REGULAR: IRREGULAR], verb, originTheme));
		themes = themes[type];

		Assert.assert(!themes.themeT12 || origin, 'Error on origin for theme T12 "' + themes.themeT12 + '" ("' + verb.infinitive + '") indicative present');
		if(themes.themeT12 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			var themeT12 = themes.themeT12;
			if(verb.irregularity.aver)
				themeT12 = themeT12.replace(/^ga/, 'g(a)');

			//FIXME
			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			expandForm(themeT12).forEach(function(t){
				insert(paradigm, 12, verb.infinitive, origin, t + 'ón', null, null, '/' + INTERROGATIVE_MARK_1P + MARKER_FLAGS);
				insert(paradigm, 12, verb.infinitive, origin, t + 'óni', null, null, '/' + INTERROGATIVE_MARK_1P_2);
				insert(paradigm, 12, verb.infinitive, origin, t + 'én', null, null, '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 12, verb.infinitive, origin, t + 'éni', null, null, '/' + INTERROGATIVE_MARK_1P_2);
				if(themes.themeT5 && conj != 2){
					insert(paradigm, 12, verb.infinitive, origin, t + 'é', null, null, '/' + INTERROGATIVE_MARK_2P);
					insert(paradigm, 12, verb.infinitive, origin, t + 'éu', null, null, '/' + INTERROGATIVE_MARK_2P_2);
				}
			});
		}
	};

	/** @private */
	var generateThemeT12SubjunctivePresent = function(paradigm, verb, themes, type, origins, originTheme){
		var t = themes[type];
		t = t.subjunctive || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));
		if(!origin)
			origin = unmarkDefaultStress(getOrigin(themes[type == IRREGULAR? REGULAR: IRREGULAR].subjunctive || themes[type == IRREGULAR? REGULAR: IRREGULAR], verb, originTheme));
		themes = t;

		Assert.assert(!themes.themeT12 || origin, 'Error on origin for theme T12 "' + themes.themeT12 + '" ("' + verb.infinitive + '") subjunctive present');
		if(themes.themeT12 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var themeT12 = themes.themeT12;
			if(verb.irregularity.aver)
				themeT12 = themeT12.replace(/^ap/, '[ap/ab/ep]').replace(/^gap/, 'ga[pb]');

			expandForm(themeT12).forEach(function(t){
				//FIXME
				//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
				insert(paradigm, 12, verb.infinitive, origin, t + 'ón', /on$/, (!t.match(/[cijɉñ]$/)? '(i)on(e)': 'on(e)'));
				insert(paradigm, 12, verb.infinitive, origin, t + 'én', /en$/, 'en(e)');
				if(themes.themeT5){
					insert(paradigm, 12, verb.infinitive, origin, t + 'é', /é$/, (verb.special3rd? '(i)é': 'é'));
					insert(paradigm, 12, verb.infinitive, origin, t + 'é', /é$/, (verb.special3rd? '(i)e[de/ge]': 'e[de/ge]'));
				}
			});
		}
	};


	/** @private */
	var getOrigin = function(themes, verb, theme){
		if(theme == 0)
			return verb.infinitive;

		var suffix;
		if(theme == 2)
			suffix = 'ndo';
		else if(theme == 4)
			suffix = 'rà';
		else if(theme == 8){
			if(!themes.themeT8)
				return null;

			var third = themes.themeT8 + (!verb.irregularity.verb.match(/^(darStarFar|s?aver)$/)? (verb.irregularity.eser? 'é': 'e'): '');
			return third.replace(/\(.+\)/g, '');
		}

		theme = 'themeT' + theme;
		return (themes[theme]? themes[theme] + (suffix? suffix: ''): undefined);
	};

	/** @private */
	var getIrregularVerbConjugation = function(type, verb){
		return (type == IRREGULAR && verb.irregularity.traer? 1: verb.conjugation);
	};

	/** @private */
	var insert = function(paradigm, theme, infinitive, origin, stressedSuffix, replaceMatch, replacement, addedSuffix){
		var suffix, free;
		if(runAllForms){
			free = unstressedVowelBeforeVibrantFreeVariation(stressedSuffix
				.replace(/([^aeiouàèéíòóúlnr])đ([aeiouàèéíòóú])/g, '$1[đx]$2')
				.replace(/([aeiouàèéíòóúlnr])đ([aeiouàèéíòóú])/g, '$1[dđx]$2')
				.replace(/ŧ/g, '[sŧ]')
				.replace(/[jɉ]/g, '[jɉ]'));
			if(free != stressedSuffix){
				suffix = composeSuffix(free, replaceMatch, replacement, addedSuffix);

				insertIntoParadigm(paradigm, theme, infinitive, origin, suffix);
			}

			free = unstressedVowelBeforeVibrantFreeVariation(stressedSuffix)
				.replace(/(^|[aeiouàèéíòóú])l([aeiouàèéíòóú])/g, '$1[lƚ]$2')
				.replace(/đ/g, 'x')
				.replace(/ŧ/g, 's')
				.replace(/[jɉ]/g, '[jɉ]');
			if(free != stressedSuffix){
				suffix = composeSuffix(free, replaceMatch, replacement, addedSuffix);

				insertIntoParadigm(paradigm, theme, infinitive, origin, suffix);
			}
		}

		suffix = composeSuffix(stressedSuffix, replaceMatch, replacement, addedSuffix);

		insertIntoParadigm(paradigm, theme, infinitive, origin, suffix);
	};

	/**
	 * Se pòl ‘ver un xbasamento de la vokal (àtona) drio konsonante no prosimante e vanti vibrante
	 *
	 * @private
	 */
	var unstressedVowelBeforeVibrantFreeVariation = function(word){
		var hyp = hyphenatePhones(word);
		return word.replace(/([^aàeèéíoòóú])er/g, function(group, pre, idx){
			return (hyp.getSyllabe(idx).match(/[^jw]e/)? pre + '[ea]r': group);
		});
	};

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

	/** @private */
	var composeSuffix = function(stressedSuffix, replaceMatch, replacement, addedSuffix){
		var suffix = unmarkDefaultStress(stressedSuffix);
		if(replaceMatch)
			suffix = suffix.replace(replaceMatch, replacement);
		if(addedSuffix)
			suffix += addedSuffix;
		return suffix;
	};

	/** @private */
	var insertIntoParadigm = function(paradigm, theme, infinitive, origin, suffix){
//origin = Word.suppressStress(origin);
//suffix = Word.suppressStress(suffix);
//infinitive = Word.suppressStress(infinitive);
		var parts = extractCommonPartsFromStart(origin, suffix),
			data = parts.a + '>' + parts.b;
		paradigm.push({theme: theme, infinitive: infinitive, origin: origin, suffixes: [data]});
	};

	/** @private */
	var unmarkDefaultStress = function(word){
		if(!word)
			return undefined;

		var idx = Word.getIndexOfStress(word),
			tmp;
		if(idx >= 0){
			//exclude unmark from one-syllabe words ending in vowel
			tmp = ((hyphenator.hyphenate(word).syllabes.length > 1 || word.match(/[^aeiouàèéíòóú]$/))
					&& !Grapheme.isDiphtong(word.substr(idx, 2))
					&& !Grapheme.isHyatus(word.substr(idx, 2))
					&& !word.match(/^(re)?\(?g?\)?(à\/è|à|é|ò)[oaie]?$/)
					&& !word.match(/^\(?x?\)?é$|^s[éí][oaie]?$/)
					&& !word.match(/^((r[ei])?d[àé]|(kon(tra)?|[lƚ]iku[ei]|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?f[àé]|(mal|move|soto)?st[àé])[oaie]?$/)
					&& !word.match(/^(và[oaie]?|vé)[oaie]?$/)
					&& !word.match(/^s[àò][oaie]?$/)
					&& !word.match(/^(|as?|des?|es|kon|pro|re|so)tr[àé][oaie]?$/)?
				word.replace(/[àéíóú]/g, function(chr){ return 'aeiou'['àéíóú'.indexOf(chr)]; }): word);
			if(tmp != word && Word.markDefaultStress(tmp) == word)
				word = tmp;
		}

		return word;
	};


	return {
		generate: generate,
		generateThemeT8: generateThemeT8,
		generateDic: generateDic
	};

});
