/**
 * @class AFFFileRules
 *
 * @see {@link http://pwet.fr/man/linux/fichiers_speciaux/hunspell}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/phonology/Grapheme', 'tools/lang/Dialect', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/Syllabator', 'tools/data/ArrayHelper', 'tools/data/ObjectHelper', 'tools/data/Assert'], function(Word, Grapheme, Dialect, Themizer, Syllabator, ArrayHelper, ObjectHelper, Assert){

	var runAllForms = true;


	/** @constant */
	var REGULAR = 'regular',
	/** @constant */
		IRREGULAR = 'irregular',
	/** @constant */
		MARKER_FLAGS = '@',
	/** @constant */
		PATTERN_FLAGS_WO_CONSTRAINT = new RegExp('(?:\\/([\\d,]+))?([' + MARKER_FLAGS.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '])?'),
	/** @constant */
		PATTERN_FLAGS = new RegExp('(?:\\/([\\d,]+))?([' + MARKER_FLAGS.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '])?(\\|.+)?$'),
	/** @constant */
		PATTERN_ALL = new RegExp('(?:(.+)>)?(.+?)?(?:\\/([\\d,]+))?([' + MARKER_FLAGS.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '])?(?:\\|(.+))?$'),
	/** @constant */
		PATTERN_LEAVE_REPLACEMENT = /^.+>|\|.+$/,
	/** @constant */
		PATTERN_CONSTRAINT = /^.+\|/,
	/** @constant */
		FLAG_SEPARATOR = ',',
	/** @constant */
		FLAG_START = 'A';

	var deriveAllFormsFromInfinitive = true;
	var printFlagsAsNumber = false;
	var applyConstraintToInfinitives = false;

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
		//PRONOMENAL_MARK_RESERVED_0 = REDUCTION_RESERVED_0 + 4,
	/** @constant */
		PRONOMENAL_IMPERATIVE_MARK = REDUCTION_RESERVED_0 + 4,
	/** @constant */
		PRONOMENAL_MARK_2 = REDUCTION_RESERVED_0 + 5,
	/** @constant */
		//PRONOMENAL_MARK_RESERVED_1 = REDUCTION_RESERVED_0 + 6,
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
		PLANTS_AND_CRAFTS_RESERVED_0 = REDUCTION_RESERVED_0 + 22;

	var adjectives = {
		0: [
			//ajetivi de prima klase
			//[REDUCTION_RESERVED_0, '[oaie]', 'o>a/' + REDUCTION_RESERVED_1 + '|o', '0>a/' + REDUCTION_RESERVED_1 + '|[^aieo]'],
			[REDUCTION_RESERVED_0, '[oaie]', 'o>[ae]', 'o>i|[^i]o', 'io>i', '0>[oaie]|[^aieo]'],
			//ajetivi de sekonda klase
			//[REDUCTION_RESERVED_1, '[aie]', 'a>e/' + REDUCTION_RESERVED_2 + '|a'],
			[REDUCTION_RESERVED_1, '[aie]', 'a>[ei]'],
			//ajetivi de terŧa klase
			[REDUCTION_RESERVED_2, '[ei]', 'e>i', '0>[ei]|[^aieo]']
		]
	};

	var interrogatives = {
		1: [
			[INTERROGATIVE_MARK_1S, '0>-mi', '0>-(t)[ei]|n', '0>-n(t)[ei]|[^n]'],
			[INTERROGATIVE_MARK_1S_2, 'mi>(t)[ei]|nmi', 'mi>n(t)[ei]|[^n]mi'],
			[INTERROGATIVE_MARK_1P, '0>-(t)[ei]|n', '0>-n(t)[ei]|[^n]'],
			[INTERROGATIVE_MARK_1P_2, 'i>e|ni', 'i>t[ei]|ni', 'i>n(t)[ei]|[^n]i'],
			[INTERROGATIVE_MARK_2S, '0>-t[uo]', '0>-stu'],
			[INTERROGATIVE_MARK_2S_2, 'u>o', 'tu>stu'],
			[INTERROGATIVE_MARK_2P, '0>-[uo]'],
			[INTERROGATIVE_MARK_2P_2, 'u>o'],
			[INTERROGATIVE_MARK_3, '.>e-l[oaie]|[ai]', '0>-l[oaie]|[^ai]'],
			[INTERROGATIVE_MARK_3_2, 'o>[aie]'],
			//kond. 3a: themeT4 + 'rí[ae]/' + INTERROGATIVE_MARK_3 > 'rise-l[oaie]'
			[INTERROGATIVE_MARK_3_CONDITIONAL_SIMPLE, 'ave>ise-l[oaie]|rave', 'ave>ísel[oaie]|rave']
		]
	};

	var pronomenals = {
		1: [
			//[PRONOMENAL_MARK, '0>-l[oaie]', '0>-me/' + PRONOMENAL_MARK_RESERVED_0, '0>-te/' + PRONOMENAL_MARK_RESERVED_0, '0>-ve/' + PRONOMENAL_MARK_RESERVED_0, '0>-se/' + PRONOMENAL_MARK_RESERVED_0, '0>-ge/' + PRONOMENAL_MARK_RESERVED_0, '0>-ne'],
			//[PRONOMENAL_MARK_RESERVED_0, '0>ne', '0>l[oaie]'],
			[PRONOMENAL_MARK, '0>-l[oaie]', '0>-[gmstv]e(ne)', '0>-[gmstv]el[oaie]', '0>-ne'],
			[PRONOMENAL_IMPERATIVE_MARK, '0>-[gmntv]e|[^a]', '0>-l[oaie]|[^a]', 'a>e-[gmntv]e', 'a>e-l[oaie]']
		],
		2: [
			//[PRONOMENAL_MARK_2, '0>l[oaie]', '0>me/' + PRONOMENAL_MARK_RESERVED_1, '0>te/' + PRONOMENAL_MARK_RESERVED_1, '0>ve/' + PRONOMENAL_MARK_RESERVED_1, '0>se/' + PRONOMENAL_MARK_RESERVED_1, '0>ge/' + PRONOMENAL_MARK_RESERVED_1, '0>ne'],
			//[PRONOMENAL_MARK_RESERVED_1, '0>ne', '0>l[oaie]'],
			[PRONOMENAL_MARK_2, 'me>l[oaie]', 'me>[gnstv]e', 'mene>mel[oaie]', 'mene>[gstv]ene', 'mene>[gstv]el[oaie]'],
			[PRONOMENAL_IMPERATIVE_MARK_2, 'me>[gntv]e|[^a]me', 'ame>e[gmntv]e', 'me>l[oaie]|[^a]me', 'ame>el[oaie]']
		]
	};

	var consonantVoicings = {
		1: [
			[FINAL_CONSONANT_VOICING_MARK,
				'ñ.>nc|ñ[oei]', 'ñ.>in|ñ[oei]', 'ñ.>n|ñ[oei]', 'ñ.>ñ|ñ[oei]',
				'b.>p|b[oei]', 'p.>p|p[oei]',
				'd.>t|d[oei]', 't.>t|t[oei]',
				'g.>k|g[oei]', 'k.>k|k[oei]',
				'v.>f|v[oei]', 'f.>f|f[oei]',
				'đ.>ŧ|đ[oei]', 'ŧ.>ŧ|ŧ[oei]',
				'x.>s|x[oei]', 's.>s|s[oei]',
				'ʒ.>ʃ|ʒ[oei]', 'ʃ.>ʃ|ʃ[oei]',
				'ɉ.>c|ɉ[oei]', 'c.>c|c[oei]',
				'm.>n|m[oei]', 'n.>n|n[oei]']
		]
	};

	var substantives = {
		1: [
			[SUBSTANTIVES_MASCULINE, '0>[oi]|[^aieoln]', '0>i|i[ln]', '.>i|[^i][ln]', 'o>i|[^i]o', 'io>i', '.>i|[ae]'],
			[SUBSTANTIVES_FEMININE, 'a>e', 'e>i', '0>[ei]|[^aieo]']
		]
	};

	//dict: pomèr/PLANTS_AND_CRAFTS, barkarol/PLANTS_AND_CRAFTS, sartor/PLANTS_AND_CRAFTS, kolador/PLANTS_AND_CRAFTS
	var plantsAndCrafts = {
		1: [
			[PLANTS_AND_CRAFTS,
				'èr>ar/' + PLANTS_AND_CRAFTS_RESERVED_0,
				'ol>iol/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|rol',
				'ol>iòl/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|rol',
				'ol>òl/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|rol',
				'tor>dor/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|[aeiou]tor',
				'dor>tor/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|[aeiou]dor'],
			[PLANTS_AND_CRAFTS_RESERVED_0, '0>[oi]|èr', '0>[oaie]|ar', '0>[oaie]|[oò][lr]']
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

		if(deriveAllFormsFromInfinitive){
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

			//expand forms
			paradigm.forEach(function(sublist){
				sublist.suffixes = mergeIdenticalTransformations(ArrayHelper.flatten(sublist.suffixes.map(function(suffix){
					return expandForm(suffix);
				})));
			});

			var re = /\/[\d,]+@?/,
				i, j, n, m, par, form, par_n;
			for(i = paradigm.length - 1; i >= 0; i --){
				par = paradigm[i];
				for(j = par.suffixes.length - 1; j >= 0; j --){
					form = par.suffixes[j].replace(re, '');

					for(n = i - 1; n >= 0; n --){
						par_n = paradigm[n];
						if(ArrayHelper.equals(par.origins, par_n.origins))
							for(m = par_n.suffixes.length - 1; m >= 0; m --){
								if(par.suffixes[j] == par_n.suffixes[m])
									par_n.suffixes.splice(m, 1);
								else if(form == par_n.suffixes[m].replace(re, '')){
									par.suffixes[j] = par.suffixes[j].replace(PATTERN_FLAGS, '') + printFlags(uniteFlags(extractFlags(par.suffixes[j]), extractFlags(par_n.suffixes[m])));
									par_n.suffixes.splice(m, 1);
								}
							}
					}
				}
			}

			printParadigm(paradigm, undefined, 1);
		}
		else{
			//dict: -r/1
			var k = 16;
			k = generateTheme(verbs, infinitiveThemes, 1, 0, [2, 4, 8, 9, 10], k);
			k = generateTheme(verbs, infinitiveThemes, 2, 0, [5, 6, 7], k);
			k = generateTheme(verbs, infinitiveThemes, 4, 0, [11], k);
			k = generateTheme(verbs, infinitiveThemes, 5, 2, [], k);
			k = generateTheme(verbs, infinitiveThemes, 6, 2, [], k);
			k = generateTheme(verbs, infinitiveThemes, 7, 2, [], k);
			k = generateTheme(verbs, infinitiveThemes, 8, 0, [12], k);
			k = generateTheme(verbs, infinitiveThemes, 9, 0, [], k);
			k = generateTheme(verbs, infinitiveThemes, 10, 0, [], k);
			k = generateTheme(verbs, infinitiveThemes, 11, 4, [], k);
			k = generateTheme(verbs, infinitiveThemes, 12, 8, [], k);
		}

		printReductions(adjectives, 'ajetivi');

		printReductions(pronomenals, 'prokonplementari');

		printReductions(consonantVoicings, 'sonoriđaŧion konsonanti finali');

		printReductions(interrogatives, 'interogativi');

		printReductions(substantives, 'sostantivi plurali');

		//dict: -er/PLANTS_AND_CRAFTS, -rol/PLANTS_AND_CRAFTS, -dor/PLANTS_AND_CRAFTS, -tor/PLANTS_AND_CRAFTS
		printReductions(plantsAndCrafts, 'piante e mistièri');
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
				if(!verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
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
				if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
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
				if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
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
				if(!verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
					generateThemeT11IndicativeImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
			function(paradigm, verb, themes, origins, originTheme){
				generateThemeT12IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT12IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
				//ensure syncope does not occurs
				if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
					generateThemeT12SubjunctivePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
				generateThemeT12SubjunctivePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
			},
		];

		return function(verbs, infinitiveThemes, theme, originTheme, flags, k){
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

			if(!deriveAllFormsFromInfinitive){
				adjectives[theme] = adjectives[theme] || [];
				k = reduceSuffixes(paradigm, adjectives[theme], k);

				printParadigm(paradigm, flags, theme);

				return k;
			}
			return paradigm;
		};
	})();


	/** @private */
	var printParadigm = function(list, flags, theme){
		var logs = [],
			m;
		list.forEach(function(el){
			el.suffixes.forEach(function(suffix){
				m = suffix.match(/^(.*)>(.*)$/);
				storeSuffix(logs, (printFlagsAsNumber? theme: 1), m[1], m[2], flags, el.matcher, el.origins);
			});
		});

		//reduce common transformations
		var lgs = [],
			lg, filtered;
		logs.forEach(function(log){
			lg = log.replace(/\/[^ ]+/, '\/.');
			if(lg.indexOf('.') >= 0){
				filtered = logs.filter(function(el){ return (el.replace(/\/[^ ]+/, '\/.') == lg); });
				lgs.push(filtered.length > 1? filtered.reduce(function(result, filter){
					var res = extractFlags2(result),
						fil = extractFlags2(filter),
						flgs = uniteFlags(res, fil);
					return result.replace(/\/.+ (.+)$/, printFlags2(flgs) + ' $1');
				}, log): log);
			}
			else
				lgs.push(lg);
		});
		setElements(logs, ArrayHelper.unique(lgs));


		if(logs.length){
			if(printFlagsAsNumber)
				printSuffixes(logs, theme, 'vèrbi: tèma T' + theme);
			else
				printSuffixes(logs, 1, 'vèrbi');
		}
	};

	/** @private */
	var printReductions = function(list, comment){
		var re = new RegExp(escapeRegExp(MARKER_FLAGS)),
			subst, flag, substitution,
			form, constraint,
			firstReduction, logs, line, i, m, red;
		//expand suffixes
		Object.keys(list).forEach(function(key){
			if(key != '0')
				list[key].forEach(function(reduction){
					//adjectives[0].forEach(function(red){
					//	reduceSuffix(reduction, red);
					//});

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
								reduction.push(substitution + '>' + f + '|' + constraint);
						});

						reduction.splice(i, 1);
					}

					if(reduction.length > 1){
						red = reduceFlags(reduction);
						setElements(reduction, red);
					}

					reduction.unshift(flag);
				});
		});
		Object.keys(list).forEach(function(key){
			if(key != '0')
				list[key] = list[key].map(function(sublist){
					return mergeIdenticalTransformations(sublist);
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
	var storeSuffix = function(logs, i, replaced, replacement, flags, constraint, parents){
		if(!replaced)
			replaced = 0;
		if(replacement.indexOf(MARKER_FLAGS) >= 0)
			replacement = addFlag(replacement.replace(MARKER_FLAGS, ''), flags);
		if(!constraint && replaced)
			constraint = replaced;

		var line = getSuffixLine(i, replaced, replacement, constraint, parents);
		if(logs.indexOf(line) < 0)
			logs.push(line);
	};

	/** @private */
	var getSuffixLine = function(flag, replaced, replacement, constraint, parents){
		if(!printFlagsAsNumber){
			var startChar = FLAG_START.charCodeAt(0) - 1;
			flag = String.fromCharCode(flag + startChar);

			var m = replacement.match(/^(.+\/)(.+)$/);
			if(m)
				replacement = m[1] + m[2].split(FLAG_SEPARATOR).map(function(rep){ return String.fromCharCode(Number(rep) + startChar); }).join('');
		}

		//FIXME
//		return 'SFX ' + flag + ' ' + replaced + ' ' + replacement + (constraint != 0 && constraint != ''? ' ' + (parents && parents.length == 1? '^': '') + constraint: '') + (parents? ' # ' + parents.sort().join(FLAG_SEPARATOR): '');
		return 'SFX ' + flag + ' ' + replaced + ' ' + replacement + (constraint != 0 && constraint != ''? ' ' /*+ (parents && parents.length == 1? '^': '')*/ + constraint: '');
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

	/** @private * /
	var composeFlag = function(){
		return '/' + Array.prototype.slice.call(arguments).map(function(flag){ return flag.substr(1); }).join(FLAG_SEPARATOR);
	};*/

	/** @private */
	var addFlag = function(replacement, flags){
		if(!flags)
			return replacement;

		var mFlag = extractFlags('/' + (Array.isArray(flags)? flags.join(FLAG_SEPARATOR): flags)),
			mRep = extractFlags(replacement);

		flags = uniteFlags(mRep, mFlag);

		return replacement.replace(PATTERN_FLAGS, '') + printFlags(flags);
	};

	/** @private */
	var extractFlags = function(flags){
		var m = flags.match(PATTERN_FLAGS);
		m[1] = (m[1]? m[1].split(FLAG_SEPARATOR): []);
		m[2] = (m[2]? m[2].split(''): []);
		return {forms: m[1], markers: m[2], constraint: (m[3] || '').replace(/\|/, '')};
	};

	/** @private */
	var extractFlags2 = function(flags){
		var m = flags.match(/\/([^\s@]+)([@])?/);
		m[1] = (m[1]? m[1].split(''): []);
		m[2] = (m[2]? m[2].split(''): []);
		return {forms: m[1], markers: m[2]};
	};

	/** @private */
	var uniteFlags = function(flags1, flags2){
		return {
			forms: (flags1.constraint == flags2.constraint? ArrayHelper.unique(flags2.forms.concat(flags1.forms)).sort(function(a, b){ return Number(a) - Number(b); }): []),
			markers: (flags1.constraint == flags2.constraint? ArrayHelper.unique(flags2.markers.concat(flags1.markers)).sort(): []),
			constraint: (flags1.constraint == flags2.constraint? flags1.constraint: '_')
		};
	};

	/** @private */
	var printFlags = function(flags){
		return (flags.forms.length? '/' + flags.forms.sort().join(FLAG_SEPARATOR): '') + flags.markers.join('');
	};

	/** @private */
	var printFlags2 = function(flags){
		return (flags.forms.length? '/' + flags.forms.sort().join(''): '') + flags.markers.join('');
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
		var form;
		list.forEach(function(el, i){
			form = (i? extractCommonPartFromEnd(el, form): el);
		});
		return form;
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

		var compacted = [],
			data;
		for(var i = list.length - 1; i >= 0; i --){
			data = {theme: list[i].theme, origins: [list[i].origin], suffixes: list[i].suffixes};

			//search list for equal suffixes
			for(var j = i - 1; j >= 0; j --)
				if(ArrayHelper.equals(list[j].suffixes, data.suffixes)){
					data.origins.push(list[j].origin);

					//remove element from list
					list.splice(j, 1);
					i --;
				}

			compacted.push(data);
		}
		setElements(list, compacted);
	};

	/** @private */
	var extractSimpleForm = function(form){
		return form.replace(PATTERN_FLAGS, '')
			.replace(/\(.+?\)/g, '')
			.replace(/\[.+\]/g, function(value){ return value.replace(/^\[|\]$/g, '').split(value.indexOf('/') >= 0? '/': '')[0]; });
	};

	/** @private */
	var reduceSuffixes = function(list, reductions, k){
		if(!reductions.length)
			setElements(reductions, getReductions(list, k));

		var tmp = [];
		list.forEach(function(sublist){
			tmp.push({matcher: sublist.matcher, theme: sublist.theme, origins: sublist.origins.slice(0), suffixes: sublist.suffixes.slice(0)});
		});
		tryReduceSuffixes(tmp, reductions);

		var len = reductions.length,
			substitution, parts;
		setElements(reductions, reductions.filter(function(reduction){
			return (reduction.used > 1 || reduction.used == 1 && (reduction.length > 1 || reduction.some(function(red){ return String(red).match(/[\(\[]/); })));
		}));

		if(reductions.length < len){
			renumberReductions(reductions, k);

			tryReduceSuffixes(list, reductions);

			setElements(reductions, reductions.map(function(value){
				substitution = extractSimpleForm(value[1].replace(PATTERN_LEAVE_REPLACEMENT, ''));
				return value.map(function(el){
					if(Number.isFinite(el))
						return el;

					parts = extractCommonPartsFromStart(substitution, el.replace(/^.+>/, ''));
					return parts.a + '>' + parts.b + '|' + substitution;
				});
			}));
		}
		else
			setElements(list, tmp);

		contractReductions(reductions);

		return reductions[reductions.length - 1][0] + 1;
	};

	/** @private */
	var setElements = function(list, newList){
		list.length = 0;
		list.push.apply(list, newList);
	};

	/** @private */
	var tryReduceSuffixes = function(list, reductions){
		list.forEach(function(sublist){
			sublist.suffixes = reduceFlags(sublist.suffixes);

			reductions.forEach(function(reduction){
				reduceSuffix(sublist.suffixes, reduction);
			});
		});
	};

	/** @private */
	var reduceSuffix = function(sublist, reduction){
		var flag = reduction.shift(),
			reductionRE = reduction.map(function(red){ return new RegExp((red.indexOf('>') >= 0? '^': '') + escapeRegExp(red.replace(/\|.+$/, '')) + '[\\/\\d,' + escapeRegExp(MARKER_FLAGS) + ']*$'); }),
			substitution, temporaryList, m;

		//reduce suffixes
		if(reductionRE.map(function(re){ return sublist.some(function(suffix){ return String(suffix).match(re); }); }).every(function(el){ return el; })){
			substitution = extractSimpleForm(reduction[0]);

			temporaryList = (sublist.used? sublist: sublist.slice(0));
			reductionRE.forEach(function(re){
				temporaryList = temporaryList.map(function(suffix){
					m = String(suffix).match(re);
					return (m? addFlag(unmarkDefaultStress(suffix.replace(re, substitution)) + (m[1]? m[1]: ''), flag): suffix);
				});
			});

			temporaryList = mergeIdenticalTransformations(ArrayHelper.unique(temporaryList));
			if(sublist != temporaryList){
				if(ArrayHelper.difference(sublist, temporaryList).length){
					reduction.used = reduction.used || 0;
					reduction.used ++;
				}

				setElements(sublist, temporaryList);
			}
		}

		reduction.unshift(flag);
	};

	/**
	 * Merge identical transformations with different flags
	 *
	 * @private
	 */
	var mergeIdenticalTransformations = function(sublist){
		var flag = sublist.shift();
		if(!Number.isFinite(flag)){
			sublist.unshift(flag);
			flag = null;
		}

		var parts = ArrayHelper.partition(ArrayHelper.unique(sublist), function(el){ return el.replace(PATTERN_FLAGS, ''); }),
			flags,
			constraints, constraintParts;
		/*sublist = Object.keys(parts).map(function(part){
			flags = parts[part]
				.map(extractFlags)
				.reduce(uniteFlags, {forms: [], markers: [], constraint: ''});
			constraint = extractCommonPartFromList(parts[part].map(function(el){ return (el.indexOf('|') >= 0? el.replace(PATTERN_CONSTRAINT, ''): ''); }));
			return part + printFlags(flags) + (constraint? '|' + constraint: '');
		});*/
		Object.keys(parts).forEach(function(p){
			constraints = parts[p].map(function(el){ return el.replace(/^.+?[\/\|]|^[^\/\|]+$/, ''); });
			if(constraints.length > 1){
				constraintParts = ArrayHelper.partition(constraints, function(el){ return el.replace(/^.+\||^[^\|]+$/, '') || p.replace(/>.+$/, ''); });
				parts[p] = Object.keys(constraintParts).map(function(cp){
					flags = constraintParts[cp]
						.map(function(el){ return extractFlags('|' + el); })
						.reduce(uniteFlags, {forms: [], markers: [], constraint: ''});
					return (flags.constraint == '_'?
						parts[p]:
						p + printFlags(flags) + (flags.constraint? '|' + flags.constraint: ''));
				});

				/*flags = parts[p]
					.map(extractFlags)
					.reduce(uniteFlags, {forms: [], markers: [], constraint: ''});
				if(flags.constraint == '_'){
					//FIXME
				}
				else if(flags.constraint)
					parts[p] = [p + printFlags(flags) + '|' + flags.constraint];*/
			}
		});
		sublist = ArrayHelper.flatten(parts);

		if(flag)
			sublist.unshift(flag);
		return sublist;
	};

	/** @private */
	var renumberReductions = function(list, k){
		var subst, substPrev;
		list.forEach(function(value){
			value[0] = k;

			subst = extractSimpleForm(value[1].replace(PATTERN_LEAVE_REPLACEMENT, ''));
			if(!substPrev || subst == substPrev || subst.length != substPrev.length){
				if(substPrev)
					value[0] = ++ k;

				substPrev = subst;
			}
		});
	};

	/** @private */
	var contractReductions = function(list){
		var parts = ArrayHelper.partition(list, function(sublist){ return sublist[0]; });
		setElements(list, Object.keys(parts).map(function(key){
			return ArrayHelper.unique(ArrayHelper.flatten(parts[key]));
		}));
	};

	/** @private */
	var reduceFlags = function(list){
		var parts = ArrayHelper.partition(list, function(el){ return el.replace(PATTERN_FLAGS_WO_CONSTRAINT, ''); }),
			flags;
		return Object.keys(parts).map(function(part){
			flags = parts[part]
				.map(extractFlags)
				.reduce(uniteFlags, {forms: [], markers: [], constraint: ''});
			var m = part.match(PATTERN_ALL);
			return (m[1]? m[1] + '>': '') + m[2] + printFlags(flags) + (m[5]? '|' + m[5]: '');
		});
	};

	/** @private */
	var getReductions = function(list, index){
		var transformations = [];
		list.forEach(function(sublist){
			sublist.suffixes.forEach(function(suffix){
				transformations.push(suffix + '|' + sublist.matcher);
			});
		});
		var parts = ArrayHelper.partition(transformations, function(el){ return el.replace(/\|.+$/, ''); }),
			reversed = {},
			filtered = [],
			line;
		Object.keys(parts).forEach(function(key){
			line = parts[key].map(function(el){ return el.replace(PATTERN_CONSTRAINT, ''); }).sort().join(FLAG_SEPARATOR);
			if(reversed[line])
				reversed[line].push(key);
			else
				reversed[line] = [key];
		});
		var k = 0;
		Object.keys(reversed).forEach(function(list1){
			Object.keys(reversed).forEach(function(list2){
				if(list1 != list2 && reversed[list1][0].replace(/>.+$/, '') == reversed[list2][0].replace(/>.+$/, '')
						&& ArrayHelper.intersection(list1.split(FLAG_SEPARATOR), list2.split(FLAG_SEPARATOR)).length){
					var value = ArrayHelper.unique(reversed[list1].concat(reversed[list2]));
					if(!Object.keys(reversed).some(function(el){ return ArrayHelper.equals(reversed[el], value); }))
						reversed[k ++] = value;
				}
			});
		});
		Object.keys(reversed).forEach(function(lst){
			lst = reversed[lst];
			if(lst.length > 1 || lst.some(function(el){ return el.match(/[\(\[]/); }))
				filtered.push(lst);
		});
		return filtered
			.sort(function(a, b){
				var re = /(.+?)>/,
					res = (b[0].match(re)[1].length - a[0].match(re)[1].length);
				return (res? res: b.length - a.length);
			})
			.map(function(el){
				el.unshift(index ++);
				return el;
			});
	};

	/** @private */
	var escapeRegExp = function(word){
		return word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};

	/** @private */
	var constraintToInfinitives = function(list, origins){
		if(applyConstraintToInfinitives)
			for(var i = list.length - 1; i >= 0; i --)
				partition(list[i], origins, list);
	};

	/** @private */
	var partition = function(obj, origins, list){
		var stack = [obj],
			common, part, diff,
			partitioningResults, re, parents;
		while(stack.length){
			obj = stack.shift();
			common = extractCommonPartFromList(obj.origins);
			part = ArrayHelper.partition(obj.origins, function(el){ return (el.length - common.length >= 1? el[el.length - common.length - 1]: '^'); });
			diff = ArrayHelper.difference(origins, obj.origins);

			partitioningResults = {true: [], false: []};
			Object.keys(part).forEach(function(k){
				re = new RegExp(k + common + '$');
				partitioningResults[diff.some(function(el){ return el.match(re); })].push(k);
			});

			if(partitioningResults[false].length){
				parents = {true: [], false: []};
				[true, false].forEach(function(side){
					partitioningResults[side].forEach(function(chr){
						parents[side] = parents[side].concat(part[chr]);
					});
				});

				obj.matcher = (partitioningResults[false].indexOf('^') < 0? listToRegExp(partitioningResults[false]): '') + common;
				obj.origins = parents[false];
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
	var listToRegExp = function(list){
		if(!list.length)
			return '';
		if(list.length == 1)
			return list[0];
		return '[' + list.sort().join('') + ']';
	};

	var expandForm = (function(){
		var add = function(list, value){
			if(list.indexOf(value) < 0)
				list.push(value);
		};


		return function recurse(forms, list){
			var m;
			list = list || [];
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

			if(verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/))
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'r', null, null, '/' + MARKER_FLAGS);
			else{
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'r', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'rme', null, null, '/' + PRONOMENAL_MARK_2);
				insert(paradigm, 1, verb.infinitive, origin, themes.themeT1 + 'rmene', null, null, '/' + PRONOMENAL_MARK_2);
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
		var tmp = (verb.irregularity.eser? 'r': 'v');
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'o', /o$/, '[oae]', '/' + INTERROGATIVE_MARK_1S);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'omi', /omi$/, '[oae]mi', '/' + INTERROGATIVE_MARK_1S_2);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'i', null, null, '/' + INTERROGATIVE_MARK_2S);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'itu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'a', /a$/, '[ai]', '/' + INTERROGATIVE_MARK_2P);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'au', null, null, '/' + INTERROGATIVE_MARK_2P_2);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'a', null, null, '/' + INTERROGATIVE_MARK_3);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'elo', null, null, '/' + INTERROGATIVE_MARK_3_2);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'imo', null, null, '/' + INTERROGATIVE_MARK_1P);
		insert(paradigm, 2, verb.infinitive, origin, themeT2 + tmp + 'imoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		if(!verb.irregularity.eser){
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'o', /o$/, '[oae]', '/' + INTERROGATIVE_MARK_1S);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'omi', /omi$/, '[oae]mi', '/' + INTERROGATIVE_MARK_1S_2);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'i', null, null, '/' + INTERROGATIVE_MARK_2S);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'itu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'a', /a$/, '[ai]', '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'au', null, null, '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'a', null, null, '/' + INTERROGATIVE_MARK_3);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'elo', null, null, '/' + INTERROGATIVE_MARK_3_2);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'imo', null, null, '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'imoi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
		}
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

			generateT2SubjunctiveImperfect(paradigm, verb, themes.themeT2, origin);

			if(runAllForms){
				if(themes.themeT2.match(/à$/))
					generateT2SubjunctiveImperfect(paradigm, verb, themes.themeT2.replace(/à$/, 'é'), origin);
				if(themes.themeT2.match(/í$/))
					generateT2SubjunctiveImperfect(paradigm, verb, themes.themeT2.replace(/í$/, 'é'), origin);
			}
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

			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
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

			if(!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)){
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndo', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndomene', null, null, '/' + PRONOMENAL_MARK_2);
			}
			else
				insert(paradigm, 2, verb.infinitive, origin, themes.themeT2 + 'ndo', null, null, '/' + MARKER_FLAGS);
			if(verb.irregularity.eser){
				insert(paradigm, 2, verb.infinitive, origin, verb.infinitive.substr(0, verb.infinitive.length - 'èser'.length) + 'siàndo');
//				insert(paradigm, 2, verb.infinitive, origin, verb.infinitive.substr(0, verb.infinitive.length - 'èser'.length) + 'siàndome', null, null, '/' + PRONOMENAL_MARK_2);
//				insert(paradigm, 2, verb.infinitive, origin, verb.infinitive.substr(0, verb.infinitive.length - 'èser'.length) + 'siàndomene', null, null, '/' + PRONOMENAL_MARK_3);
			}
			else if(verb.irregularity.aver){
				insert(paradigm, 2, verb.infinitive, origin, verb.infinitive.substr(0, verb.infinitive.length - 'aver'.length) + 'abiàndo');
//				insert(paradigm, 2, verb.infinitive, origin, verb.infinitive.substr(0, verb.infinitive.length - 'aver'.length) + 'abiàndome', null, null, '/' + PRONOMENAL_MARK_2);
//				insert(paradigm, 2, verb.infinitive, origin, verb.infinitive.substr(0, verb.infinitive.length - 'aver'.length) + 'abiàndomene', null, null, '/' + PRONOMENAL_MARK_3);
			}

			//Se pòl katar un metaplaxmo da la 3a koniug. a la 2a koniug.
			if(runAllForms){
				var themeT2;
				if(themes.themeT2.match(/à$/)){
					themeT2 = themes.themeT2.replace(/à$/, 'é');
					if(!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)){
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndomene', null, null, '/' + PRONOMENAL_MARK_2);
					}
					else
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + MARKER_FLAGS);
				}
				if(themes.themeT2.match(/í$/)){
					themeT2 = themes.themeT2.replace(/í$/, 'é');
					if(!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)){
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndo', null, null, '/' + PRONOMENAL_MARK + MARKER_FLAGS);
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
						insert(paradigm, 2, verb.infinitive, origin, themeT2 + 'ndomene', null, null, '/' + PRONOMENAL_MARK_2);
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

			generateT4IndicativeFuture(paradigm, verb, themes.themeT4, origin);

			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			if(runAllForms){
				if(themes.themeT4.match(/a$/))
					generateT4IndicativeFuture(paradigm, verb, themes.themeT4.replace(/a$/, 'e'), origin);
				if(themes.themeT4.match(/i$/))
					generateT4IndicativeFuture(paradigm, verb, themes.themeT4.replace(/i$/, 'e'), origin);
			}
		}
	};

	/** @private */
	var generateT4IndicativeFuture = function(paradigm, verb, themeT4, origin){
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rà', null, null, '/' + INTERROGATIVE_MARK_1S + MARKER_FLAGS);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ràmi', null, null, '/' + INTERROGATIVE_MARK_1S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'rè', /è$/, '[èò]', '/' + INTERROGATIVE_MARK_1S);
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

			generateT4ConditionalSimple(paradigm, verb, themes.themeT4, origin);

			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			if(runAllForms){
				if(themes.themeT4.match(/a$/))
					generateT4ConditionalSimple(paradigm, verb, themes.themeT4.replace(/a$/, 'e'), origin);
				if(themes.themeT4.match(/i$/))
					generateT4ConditionalSimple(paradigm, verb, themes.themeT4.replace(/i$/, 'e'), origin);
			}
		}
	};

	/** @private */
	var generateT4ConditionalSimple = function(paradigm, verb, themeT4, origin){
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ría', null, null, '/' + INTERROGATIVE_MARK_2S);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ríatu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
		insert(paradigm, 4, verb.infinitive, origin, themeT4 + 'ría', /a$/, '[ae]', '/' + INTERROGATIVE_MARK_1S);
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

			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5, null, null, '/' + INTERROGATIVE_MARK_2P + MARKER_FLAGS);
			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5 + 'u', null, null, '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/è$/, 'é') + 'mo', null, null, '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/è$/, 'é') + 'moi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
			if(conj == 2){
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í'), null, null, '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í') + 'u', null, null, '/' + INTERROGATIVE_MARK_2P_2);
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í') + 'mo', null, null, '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í') + 'moi', null, null, '/' + INTERROGATIVE_MARK_1P_2);
			}
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

			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5);
			insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/è$/, 'é') + 'mo');
			if(conj == 2 && themes.themeT5.replace(/i?é$/, 'í') != themes.themeT5){
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í'));
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/i?é$/, 'í') + 'mo');
			}
			if(conj != 2){
				insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/[èí]$/, 'é'));

				if(conj == 3 && !verb.special3rd){
					insert(paradigm, 5, verb.infinitive, origin, themes.themeT5);
					insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/í$/, 'i') + 'de');
					insert(paradigm, 5, verb.infinitive, origin, themes.themeT5.replace(/í$/, 'i') + 'ge');
				}
			}
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
			insert(paradigm, 6, verb.infinitive, origin, themes.themeT6 + 'do', /do$/, 'd[oaie]', '/' + FINAL_CONSONANT_VOICING_MARK);
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
				if(this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/))
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndo');
				else{
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndo', null, null, '/' + PRONOMENAL_MARK);
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndome', null, null, '/' + PRONOMENAL_MARK_2);
					insert(paradigm, 7, verb.infinitive, origin, themes.themeT7 + 'ndomene', null, null, '/' + PRONOMENAL_MARK_2);
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
					insert(paradigm, 8, verb.infinitive, origin, t + 'ón', /([^cijɉñ])on$/, '$1(i)on', '/' + INTERROGATIVE_MARK_1P);
					insert(paradigm, 8, verb.infinitive, origin, t + 'óni', /([^cijɉñ])oni$/, '$1(i)oni', '/' + INTERROGATIVE_MARK_1P_2);
				}
				else if(verb.irregularity.aver){
					insert(paradigm, 8, verb.infinitive, origin, t, /à$/, '[àèò]', '/' + INTERROGATIVE_MARK_1S);
					insert(paradigm, 8, verb.infinitive, origin, t + 'mi', /àmi$/, '[àèò]mi', '/' + INTERROGATIVE_MARK_1S_2);
				}
				else{
					insert(paradigm, 8, verb.infinitive, origin, t + 'o', /o$/, '[oe]', '/' + INTERROGATIVE_MARK_1S);
					insert(paradigm, 8, verb.infinitive, origin, t + 'omi', /omi$/, '[oe]mi', '/' + INTERROGATIVE_MARK_1S_2);

					if(verb.irregularity.verb && type == IRREGULAR){
						if(verb.irregularity.saver){
							insert(paradigm, 8, verb.infinitive, origin, t.replace(/à$/, 'ò'), null, null, '/' + INTERROGATIVE_MARK_1S);
							insert(paradigm, 8, verb.infinitive, origin, t.replace(/à$/, 'ò') + 'mi', null, null, '/' + INTERROGATIVE_MARK_1S_2);
						}
						else{
							insert(paradigm, 8, verb.infinitive, origin, t + 'o', /([aeiouàèéíòóú])o$/, '$1(g)o', '/' + INTERROGATIVE_MARK_1S);
							insert(paradigm, 8, verb.infinitive, origin, t + 'omi', /([aeiouàèéíòóú])omi$/, '$1(g)omi', '/' + INTERROGATIVE_MARK_1S_2);
						}
					}
				}
				insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.match(/à$/)? 'i': '')), null, null, '/' + INTERROGATIVE_MARK_2S);
				insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.match(/à$/)? 'i': '')) + 'tu', null, null, '/' + INTERROGATIVE_MARK_2S_2);
				var third = t + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
				insert(paradigm, 8, verb.infinitive, origin, third, null, null, '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
				insert(paradigm, 8, verb.infinitive, origin, third.replace(/[ai]$/, 'e') + 'lo', null, null, '/' + INTERROGATIVE_MARK_3_2);
				if(third.match(/[^aeiouàèéíòóú]e$/))
					insert(paradigm, 8, verb.infinitive, origin, third, null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
				if(verb.irregularity.verb.match(/dixer|traer|toler/)){
					insert(paradigm, 8, verb.infinitive, origin, t.replace(/[lx]?$/, 'go'), null, null, '/' + INTERROGATIVE_MARK_1S);
					insert(paradigm, 8, verb.infinitive, origin, t.replace(/[lx]?$/, 'go') + 'mi', null, null, '/' + INTERROGATIVE_MARK_1S_2);
				}
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

			expandForm(themes.themeT8).forEach(function(t){
				insert(paradigm, 8, verb.infinitive, origin, t + 'a', /a$/, '[ae]');
				insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1i'));
				if(t.match(/[^aeiouàèéíòóú]$/))
					insert(paradigm, 8, verb.infinitive, origin, t + 'e', null, null, '/' + FINAL_CONSONANT_VOICING_MARK);

				if(type == IRREGULAR && !verb.irregularity.verb.match(/(aver|dever|eser)/)){
					insert(paradigm, 8, verb.infinitive, origin, t + 'a', /([aeiouàèéíòóú])a$/, '$1(g)a');
					if(t.match(/[aeiouàèéíòóú]$/))
						insert(paradigm, 8, verb.infinitive, origin, t + 'i', /i$/, '(g)i');
					else
						insert(paradigm, 8, verb.infinitive, origin, t.replace(/([^i])$/, '$1i'));
				}

				if(verb.irregularity.verb.match(/dixer|traer|toler/))
					insert(paradigm, 8, verb.infinitive, origin, t + 'a', /[lx]?a$/, 'g[ai]');
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
					{matcher: /l[èí][đx]$/, replacement: 'lèt'},
					{matcher: /strén[đx]$/, replacement: 'strét'},
					{matcher: /([rn]|frí)[đx]$/, replacement: '$1t'},
					{matcher: /ríx$/, replacement: 'rèt'},
					{matcher: /([aeiouàèéíòóúl])x$/, falsePositives: /nòx$/, replacement: '$1t'},
					{matcher: /rd$/, replacement: 'rs'},
					{matcher: /(pà|kó)nd$/, replacement: '$1nt'},
					{matcher: /pónd$/, replacement: 'póst'},
					{matcher: /fónd$/, replacement: 'fúx'},
					{matcher: /nd$/, replacement: 'x'},
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
					{matcher: /espèl$/, replacement: 'espúls'},
					{matcher: /kòj$/, replacement: 'kòlt'},
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /íɉ$/, replacement: 'àt'},
					{matcher: /nàs$/, replacement: 'nàt'},
					{matcher: /n[sŧ]$/, replacement: 'nt'},
					{matcher: /pón$/, replacement: 'pòst'},
					{matcher: /romàñ$/, replacement: 'romàx'},
					{matcher: /rónp$/, replacement: 'rót'},
					{matcher: /stíngu$/, replacement: 'stínt'}
				],
				//rhizoatone
				[
					{matcher: /sól$/, replacement: 'sólit'},
					{matcher: /vàl$/, replacement: 'vàls'},
					//(per|re)maner
					{matcher: /n$/, replacement: 'x'},
					//{matcher: /n$/, replacement: 'st'},
					{matcher: /r$/, replacement: 'rs'},
					{matcher: /tòl$/, replacement: 'tòlt'}
				]
			],

			//3rd conjugation
			[
				{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},
				{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /(mòr|núdr)$/, replacement: '$1èrt'},
				{matcher: /sepel$/, replacement: 'sepólt'},
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
				insert(paradigm, 9, verb.infinitive, origin, t + 'me', /ame$/, 'eme', '/' + PRONOMENAL_IMPERATIVE_MARK_2);
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
					var third = themes.themeT8 + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
					if(t != third){
						insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
						insert(paradigm, 10, verb.infinitive, origin, t.replace(/[ai]$/, 'e') + 'lo', null, null, '/' + INTERROGATIVE_MARK_3_2);
						if(t.match(/[^aeiouàèéíòóú]e$/))
							insert(paradigm, 10, verb.infinitive, origin, t, null, null, '/' + FINAL_CONSONANT_VOICING_MARK);
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

			//FIXME
			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ié', /ié$/, '(is)ié(de/ge)', '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ón', /on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)on': 'on'), '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'óni', /oni$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)oni': 'oni'), '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'isón', /on$/, '(i)on', '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'isóni', /oni$/, '(i)oni', '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'én', /en$/, '(is)en', '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'éni', /eni$/, '(is)eni', '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'ón', /on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)on[e/se]': 'on[e/se]'));
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'isón', /on$/, '(i)on[e/se]');
			insert(paradigm, 11, verb.infinitive, origin, themes.themeT11 + 'én', /en$/, '(is)en[e/se]');
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

			//FIXME
			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'ón', null, null, '/' + INTERROGATIVE_MARK_1P + MARKER_FLAGS);
			insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'óni', null, null, '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'én', null, null, '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'éni', null, null, '/' + INTERROGATIVE_MARK_1P_2);
			if(themes.themeT5 && conj != 2){
				insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'é', null, null, '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'éu', null, null, '/' + INTERROGATIVE_MARK_2P_2);
			}
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

			//FIXME
			//Se pòl katar un metaplaxmo de deklinaŧion a la 2a koniug.
			insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'ón', /on$/, (!themes.themeT12.match(/[cijɉñ]$/)? '(i)on(e)': 'on(e)'));
			insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'én', /en$/, 'en(e)');
			if(themes.themeT5){
				insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'é', /é$/, (verb.special3rd? '(i)é': 'é'));
				insert(paradigm, 12, verb.infinitive, origin, themes.themeT12 + 'é', /é$/, (verb.special3rd? '(i)e[de/ge]': 'e[de/ge]'));
			}
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

			var third = themes.themeT8 + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
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
		var suffix;
		if(runAllForms){
			//se pòl ‘ver un xbasamento de la vokal (àtona) drio konsonante no prosimante e vanti vibrante
			var syll = Syllabator.syllabate(stressedSuffix, null, true);
			var stressedSuffixLoweredVowel = stressedSuffix.replace(/([^aàeèéíoòóú])er/g, function(group, pre, idx){
				return (syll.phones[syll.getSyllabeIndex(idx)].match(/[^jw]e/)? pre + 'ar': group);
			});
			if(stressedSuffixLoweredVowel != stressedSuffix){
				suffix = composeSuffix(stressedSuffixLoweredVowel, replaceMatch, replacement, addedSuffix);

				insertIntoParadigm(paradigm, theme, infinitive, origin, suffix);
			}
		}

		suffix = composeSuffix(stressedSuffix, replaceMatch, replacement, addedSuffix);

		insertIntoParadigm(paradigm, theme, infinitive, origin, suffix);
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
		var i = ArrayHelper.findIndex(paradigm, function(el){ return (el.infinitive == infinitive); }),
			parts = extractCommonPartsFromStart(origin, suffix),
			data = parts.a + '>' + parts.b,
			re, j, flags;
		if(i < 0)
			paradigm.push({theme: theme, infinitive: infinitive, origin: origin, suffixes: [data]});
		else{
			re = new RegExp('^' + data.replace(PATTERN_FLAGS, '') + PATTERN_FLAGS.toString().replace(/^\/|\/$/, ''));
			j = ArrayHelper.findIndex(paradigm[i].suffixes, function(suff){ return suff.match(re); });
			if(j < 0)
				paradigm[i].suffixes.push(data);
			else{
				flags = paradigm[i].suffixes[j].match(PATTERN_FLAGS);
				flags = (flags[1]? flags[1].replace(/\//, ''): '');
				paradigm[i].suffixes[j] = addFlag(data, flags);
			}
		}
	};

	/** @private */
	var unmarkDefaultStress = function(word){
		if(!word)
			return undefined;

		var idx = Word.getIndexOfStress(word),
			syll, tmp;
		if(idx >= 0){
			syll = Syllabator.syllabate(word);
			//exclude unmark from words that can be truncated like "fenisié(de)" or "(g)à"
			tmp = ((syll.syllabes.length > 1 || word.match(/[^aeiouàèéíòóú]$/))
					&& !Grapheme.isDiphtong(word.substr(idx, 2))
					&& !Grapheme.isHyatus(word.substr(idx, 2))
					&& !word.match(/^(re)?\(?g?\)?(à\/è|à|é|ò)[oaie]?$/)
					&& !word.match(/^\(?x?\)?é$|^s[éí][oaie]?$/)
					&& !word.match(/^((r[ei])?d[àé]|(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?f[àé]|(mal|move|soto)?st[àé])[oaie]?$/)
					&& !word.match(/^(và[oaie]?|vé)[oaie]?$/)
					&& !word.match(/^s[àò][oaie]?$/)
					&& !word.match(/^(|as?|des?|es|kon|pro|re|so)tr[àé][oaie]?$/)?
				word.replace(/[àéíóú]/g, function(chr){ return 'aeiou'['àéíóú'.indexOf(chr)]; }): word);
			if(Word.markDefaultStress(tmp) == word)
				word = tmp;
		}

		return word;
	};


	return {
		generate: generate
	};

});
