/**
 * @class AFFFileRules
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/Dialect', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/Syllabator', 'tools/data/ArrayHelper'], function(Word, Dialect, Themizer, Syllabator, ArrayHelper){

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
		FLAG_SEPARATOR = ',',
	/** @constant */
		FLAG_START = 'A';

	var deriveAllFormsFromInfinitive = true;
	var printFlagsAsNumber = false;

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
		PRONOMENAL_MARK_RESERVED_0 = REDUCTION_RESERVED_0 + 4,
	/** @constant */
		PRONOMENAL_IMPERATIVE_MARK = REDUCTION_RESERVED_0 + 5,
	/** @constant */
		FINAL_CONSONANT_VOICING_MARK = REDUCTION_RESERVED_0 + 6,
	/** @constant */
		INTERROGATIVE_MARK_1S = REDUCTION_RESERVED_0 + 7,
	/** @constant */
		INTERROGATIVE_MARK_1S_2 = REDUCTION_RESERVED_0 + 8,
	/** @constant */
		INTERROGATIVE_MARK_1P = REDUCTION_RESERVED_0 + 9,
	/** @constant */
		INTERROGATIVE_MARK_1P_2 = REDUCTION_RESERVED_0 + 10,
	/** @constant */
		INTERROGATIVE_MARK_2S = REDUCTION_RESERVED_0 + 11,
	/** @constant */
		INTERROGATIVE_MARK_2S_2 = REDUCTION_RESERVED_0 + 12,
	/** @constant */
		INTERROGATIVE_MARK_2P = REDUCTION_RESERVED_0 + 13,
	/** @constant */
		INTERROGATIVE_MARK_2P_2 = REDUCTION_RESERVED_0 + 14,
	/** @constant */
		INTERROGATIVE_MARK_3 = REDUCTION_RESERVED_0 + 15,
	/** @constant */
		INTERROGATIVE_MARK_3_2 = REDUCTION_RESERVED_0 + 16,
	/** @constant */
		INTERROGATIVE_MARK_3_CONDITIONAL_SIMPLE = REDUCTION_RESERVED_0 + 17,
	/** @constant */
		SUBSTANTIVES = REDUCTION_RESERVED_0 + 18,
	/** @constant */
		PLANTS_AND_CRAFTS = REDUCTION_RESERVED_0 + 19,
	/** @constant */
		PLANTS_AND_CRAFTS_RESERVED_0 = REDUCTION_RESERVED_0 + 20;

	var reductions = {
		0: [
			//vèrbi e ajetivi de prima klase
			[REDUCTION_RESERVED_0, '[oaie]', 'o>a/' + REDUCTION_RESERVED_1 + '|o', '0>a/' + REDUCTION_RESERVED_1 + '|[^aieo]'],
			//ajetivi de sekonda klase
			[REDUCTION_RESERVED_1, '[aie]', 'a>e/' + REDUCTION_RESERVED_2 + '|a'],
			//ajetivi de terŧa klase
			[REDUCTION_RESERVED_2, '[ei]', 'e>i|e']
		]
	};

	var interrogatives = {
		1: [
			[INTERROGATIVE_MARK_1S, '0>-mi', '0>-[ei]', '0>-(t)[ei]|n', '0>-n(t)[ei]|[^n]'],
			[INTERROGATIVE_MARK_1S_2, 'i>mi', 'i>e', 'i>(t)[ei]|ni', 'i>n(t)[ei]|[^n]i'],
			[INTERROGATIVE_MARK_1P, '0>-[ei]', '0>-(t)[ei]|n', '0>-n(t)[ei]|[^n]'],
			[INTERROGATIVE_MARK_1P_2, 'i>e', 'i>(t)[ei]|ni', 'i>n(t)[ei]|[^n]i'],
			[INTERROGATIVE_MARK_2S, '0>-t[uo]', '0>-stu'],
			[INTERROGATIVE_MARK_2S_2, 'u>o', 'tu>-stu'],
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
			[PRONOMENAL_MARK, '0>-l[oaie]', '0>-me/' + PRONOMENAL_MARK_RESERVED_0, '0>-te/' + PRONOMENAL_MARK_RESERVED_0, '0>-ve/' + PRONOMENAL_MARK_RESERVED_0, '0>-se/' + PRONOMENAL_MARK_RESERVED_0, '0>-ge/' + PRONOMENAL_MARK_RESERVED_0, '0>-ne'],
			[PRONOMENAL_MARK_RESERVED_0, '0>ne', '0>l[oaie]'],
			[PRONOMENAL_IMPERATIVE_MARK, '0>-me|[^a]', '0>-ne|[^a]', '0>-te|[^a]', '0>-ve|[^a]', '0>-l[oaie]|[^a]', '0>-ge|[^a]', 'a>e-me|a', 'a>e-ne|a', 'a>e-te|a', 'a>e-ve|a', 'a>e-l[oaie]|a', 'a>e-ge|a']
		]
	};

	//(zavàtol = fringuello, témol = temolo, bekiñòl, bigòl/bígol, bórtol, tasar/taxar)
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
			[SUBSTANTIVES, '0>i|[^aieo]', '.>i|[aeo]', 'n>i|[^i]n', 'l>i|[^i]l', 'a>e|a']
		]
	};

	//dict: pomèr/PLANTS_AND_CRAFTS
	var plantsAndCrafts = {
		1: [
			[PLANTS_AND_CRAFTS,
				'èr>ar/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|èr',
				'ol>iol/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|rol',
				'ol>iòl/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|rol',
				'ol>òl/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|rol',
				'tor>dor/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|[aeiou]tor',
				'dor>tor/' + PLANTS_AND_CRAFTS_RESERVED_0 + '|[aeiou]dor'],
			[PLANTS_AND_CRAFTS_RESERVED_0, '0>o|ar', '0>i|ar', '0>[oaie]|[oò][lr]']
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

		if(!deriveAllFormsFromInfinitive){
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
		else{
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

		printReductions(reductions, 'reduŧioni');

		printReductions(pronomenals, 'prokonplementari');

		printReductions(consonantVoicings, 'sonoriđaŧion konsonanti finali');

		printReductions(interrogatives, 'interogativi');

		printReductions(substantives, 'sostantivi plurali');

		//dict: -er/PLANTS_AND_CRAFTS, -rol/PLANTS_AND_CRAFTS, -dor/PLANTS_AND_CRAFTS, -tor/PLANTS_AND_CRAFTS
		printReductions(plantsAndCrafts, 'piante e mistièri');
	};

	var generateTheme = function(verbs, infinitiveThemes, theme, originTheme, flags, k){
		var paradigm = [],
			origins = [],
			themes;
		verbs.forEach(function(verb){
			themes = infinitiveThemes[verb.infinitive];

			switch(theme){
				case 1:
					generateThemeT1InfinitiveSimple(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT1InfinitiveSimple(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 2:
					generateThemeT2ParticiplePerfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT2ParticiplePerfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					if(!verb.irregularity.eser){
						generateThemeT2IndicativeImperfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT2SubjunctiveImperfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT2GerundSimple(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					}
					//ensure syncope does not occurs
					if(!verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
						generateThemeT2IndicativeImperfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					generateThemeT2SubjunctiveImperfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					generateThemeT2GerundSimple(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					break;

				case 4:
					if(!verb.irregularity.eser){
						generateThemeT4IndicativeFuture(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT4ConditionalSimple(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					}
					generateThemeT4IndicativeFuture(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					generateThemeT4ConditionalSimple(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 5:
					generateThemeT5IndicativePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT5IndicativePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					//ensure syncope does not occurs
					if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
						generateThemeT5SubjunctivePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT5SubjunctivePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					if(!verb.irregularity.poder){
						generateThemeT5ImperativePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT5ImperativePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					}
					break;

				case 6:
					generateThemeT6ParticiplePerfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT6ParticiplePerfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 7:
					generateThemeT7ParticipleImperfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT7ParticipleImperfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					generateThemeT7ParticiplePerfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT7ParticiplePerfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					if(!verb.irregularity.eser)
						generateThemeT7GerundSimple(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 8:
					generateThemeT8IndicativePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT8IndicativePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
						generateThemeT8SubjunctivePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT8SubjunctivePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					generateThemeT8ParticiplePerfect_strong(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 9:
					if(!verb.irregularity.poder){
						generateThemeT9ImperativePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT9ImperativePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					}
					break;

				case 10:
						generateThemeT10IndicativePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT10IndicativePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 11:
					if(!verb.irregularity.eser){
						generateThemeT11IndicativeImperfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
						generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					}
					//ensure syncope does not occurs
					if(!verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
						generateThemeT11IndicativeImperfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;

				case 12:
					generateThemeT12IndicativePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT12IndicativePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					//ensure syncope does not occurs
					if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
						generateThemeT12SubjunctivePresent(paradigm, verb, themes, theme, REGULAR, origins, originTheme);
					generateThemeT12SubjunctivePresent(paradigm, verb, themes, theme, IRREGULAR, origins, originTheme);
					break;
			}
		});

		compactEqualSuffixes(paradigm);

		constraintToInfinitives(paradigm, origins);

		if(!deriveAllFormsFromInfinitive){
			reductions[theme] = reductions[theme] || [];
			k = reduceSuffixes(paradigm, reductions[theme], k);

			printParadigm(paradigm, flags, theme);

			return k;
		}
		return paradigm;
	};


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
					reductions[0].forEach(function(red){
						reduceSuffix(reduction, red);
					});

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

						expandForm(form.replace(re, '')).forEach(function(form){
							if(substitution != form)
								reduction.push(substitution + '>' + form + '|' + constraint);
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

					expandForm(form.replace(re, '')).forEach(function(form){
						if(subst != form){
							line = getSuffixLine(flag, subst, form, constraint);
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
		if(!constraint && replaced != 0)
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
//		return 'SFX ' + flag + ' ' + replaced + ' ' + replacement + (constraint != 0 && constraint != ''? ' ' + constraint: '') + (parents? ' # ' + parents.sort().join(FLAG_SEPARATOR): '');
		return 'SFX ' + flag + ' ' + replaced + ' ' + replacement + (constraint != 0 && constraint != ''? ' ' + constraint: '');
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
	var composeFlag = function(){
		return '/' + Array.prototype.slice.call(arguments).map(function(flag){ return flag.substr(1); }).join(FLAG_SEPARATOR);
	};

	/** @private */
	var addFlag = function(replacement, flags){
		if(!flags)
			return replacement;

		var mFlag = extractFlags(Array.isArray(flags)? '/' + flags.join(FLAG_SEPARATOR): '/' + flags),
			mRep = extractFlags(replacement);

		flags = uniteFlags(mRep, mFlag);

		return replacement.replace(PATTERN_FLAGS, '') + printFlags(flags);
	};

	/** @private */
	var extractFlags = function(flags){
		var m = flags.match(PATTERN_FLAGS);
		m[1] = (m[1]? m[1].split(FLAG_SEPARATOR): []);
		m[2] = (m[2]? m[2].split(''): []);
		return {forms: m[1], markers: m[2]};
	};

	/** @private */
	var uniteFlags = function(flags1, flags2){
		return {
			forms: ArrayHelper.unique(flags2.forms.concat(flags1.forms)).sort(function(a, b){ return Number(a) - Number(b); }),
			markers: ArrayHelper.unique(flags2.markers.concat(flags1.markers)).sort()
		}
	};

	/** @private */
	var printFlags = function(flags){
		return (flags.forms.length? '/' + flags.forms.join(FLAG_SEPARATOR): '') + flags.markers.join('');
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
			form = (!i? el: extractCommonPartFromEnd(el, form));
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
			flags, constraint;
		sublist = Object.keys(parts).map(function(part){
			flags = parts[part].map(function(el){ return extractFlags(el); }).reduce(uniteFlags, {forms: [], markers: []});
			constraint = extractCommonPartFromList(parts[part].map(function(el){ return (el.indexOf('|') >= 0? el.replace(/^.+\|/, ''): ''); }));
			return part + printFlags(flags) + (constraint? '|' + constraint: '');
		});

		if(flag)
			sublist.unshift(flag);
		return sublist;
	};

	/** @private */
	var renumberReductions = function(list, k){
		var subst, substPrev;
		list.forEach(function(value, idx){
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
			flags = parts[part].map(function(el){ return extractFlags(el); }).reduce(uniteFlags, {forms: [], markers: []});
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
			line = parts[key].map(function(el){ return el.replace(/^.+\|/, ''); }).sort().join(FLAG_SEPARATOR);
			if(reversed[line])
				reversed[line].push(key);
			else
				reversed[line] = [key];
		});
		var k = 0;
		Object.keys(reversed).forEach(function(list1){
			Object.keys(reversed).forEach(function(list2){
				if(list1 != list2 && reversed[list1][0].replace(/>.+$/, '') == reversed[list2][0].replace(/>.+$/, '')){
					var list = ArrayHelper.intersection(list1.split(FLAG_SEPARATOR), list2.split(FLAG_SEPARATOR));
					if(list.length){
						var value = ArrayHelper.unique(reversed[list1].concat(reversed[list2]));
						if(!Object.keys(reversed).some(function(el){ return ArrayHelper.equals(reversed[el], value); }))
							reversed[k ++] = value;
					}
				}
			});
		});
		Object.keys(reversed).forEach(function(list){
			list = reversed[list];
			if(list.length > 1 || list.some(function(el){ return el.match(/[\(\[]/); }))
				filtered.push(list);
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
	var unmarkDefaultStress = function(word){
		if(!word)
			return undefined;

		var idx = Word.getIndexOfStress(word),
			syll, tmp;
		if(idx >= 0){
			syll = Syllabator.syllabate(word);
			//exclude unmark from words that can be truncated like "fenisié(de)" or "(g)à"
			tmp = ((syll.syllabes.length > 1 || syll.syllabes[0].match(/[^aeiouàèéíòóú]$/))
					&& !word.match(/^(re)?\(?g?\)?(à\/è|à|é|ò)[oaie]?$/)
					&& !word.match(/^\(?x?\)?é$|^s[éí][oaie]?$/)
					&& !word.match(/^((r[ei])?d[àé]|(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?f[àé]|(mal|move|soto)?st[àé])[oaie]?$/)
					&& !word.match(/^(và[oaie]?|vé)[oaie]?$/)
					&& !word.match(/^s[àò][oaie]?$/)
					&& !word.match(/^(|as?|des?|es|kon|pro|re|so)tr[àé][oaie]?$/)?
				word.replace(/[àéíóú]/g, function(chr){ return 'aeiou'['àéíóú'.indexOf(chr)]; }): word);
			if(word == Word.markDefaultStress(tmp))
				word = tmp;
		}

		return word;
	};

	/** @private */
	var escapeRegExp = function(word){
		return word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};

	/** @private */
	var constraintToInfinitives = function(list, origins){
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
			diff = ArrayHelper.difference(origins, obj.origins),

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
				partitioningResults[true].forEach(function(k){
					obj = {theme: obj.theme, origins: part[k], suffixes: obj.suffixes};
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
	var generateThemeT1InfinitiveSimple = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT1 && !origin)
			throw 'error on origin for theme T1 "' + themes.themeT1 + '" ("' + verb.infinitive + '") infinitive simple';
		if(themes.themeT1 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var pronomenalMark = (!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK + FLAG_SEPARATOR: '');

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT1 + 'r') + '/' + pronomenalMark + PRONOMENAL_IMPERATIVE_MARK + MARKER_FLAGS);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT1 + 're'));
		}
	};

	/** @private */
	var generateThemeT2IndicativeImperfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") indicative imperfect';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var tmp = (verb.irregularity.eser? 'r': 'v');
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'o').replace(/o$/, '[oae]') + '/' + INTERROGATIVE_MARK_1S);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'oi').replace(/oi$/, '[oae]i') + '/' + INTERROGATIVE_MARK_1S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'i') + '/' + INTERROGATIVE_MARK_2S);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'itu') + '/' + INTERROGATIVE_MARK_2S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'a').replace(/a$/, '[ai]') + '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'au') + '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'a') + '/' + INTERROGATIVE_MARK_3);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'elo') + '/' + INTERROGATIVE_MARK_3_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'imo') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'imoi') + '/' + INTERROGATIVE_MARK_1P_2);
			if(!verb.irregularity.eser){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'o').replace(/o$/, '[oae]') + '/' + INTERROGATIVE_MARK_1S);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'oi').replace(/oi$/, '[oae]i') + '/' + INTERROGATIVE_MARK_1S_2);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'i') + '/' + INTERROGATIVE_MARK_2S);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'itu') + '/' + INTERROGATIVE_MARK_2S_2);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'a').replace(/a$/, '[ai]') + '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'au') + '/' + INTERROGATIVE_MARK_2P_2);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'a') + '/' + INTERROGATIVE_MARK_3);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'elo') + '/' + INTERROGATIVE_MARK_3_2);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'imo') + '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'imoi') + '/' + INTERROGATIVE_MARK_1P_2);
			}
		}
	};

	/** @private */
	var generateThemeT2SubjunctiveImperfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") subjunctive imperfect';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'se') + '/' + FINAL_CONSONANT_VOICING_MARK);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'si'));
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'simo'));
		}
	};

	/** @private */
	var generateThemeT2ParticiplePerfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		themes = themes.participlePerfect || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") participle perfect';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'sto').replace(/o$/, '[oaie]') + '/' + FINAL_CONSONANT_VOICING_MARK);
		}
	};

	/** @private */
	var generateThemeT2GerundSimple = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 "' + themes.themeT2 + '" ("' + verb.infinitive + '") gerund simple';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var pronomenalMark = (!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK + FLAG_SEPARATOR: '');

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'ndo') + '/' + pronomenalMark + PRONOMENAL_IMPERATIVE_MARK + MARKER_FLAGS);
			if(verb.irregularity.eser)
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(verb.infinitive.substr(0, verb.infinitive.length - 'èser'.length) + 'siàndo') + '/' + pronomenalMark + PRONOMENAL_IMPERATIVE_MARK);
			else if(verb.irregularity.aver)
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(verb.infinitive.substr(0, verb.infinitive.length - 'aver'.length) + 'abiàndo') + '/' + pronomenalMark + PRONOMENAL_IMPERATIVE_MARK);
		}
	};

	/** @private */
	var generateThemeT4IndicativeFuture = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT4 && !origin)
			throw 'error on origin for theme T4 "' + themes.themeT4 + '" ("' + verb.infinitive + '") indicative future';
		if(themes.themeT4 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rà') + '/' + INTERROGATIVE_MARK_1S + MARKER_FLAGS);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rài') + '/' + INTERROGATIVE_MARK_1S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rè').replace(/è$/, '[èò]') + '/' + INTERROGATIVE_MARK_1S);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rèi').replace(/èi$/, '[èò]i') + '/' + INTERROGATIVE_MARK_1S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rà') + '/' + INTERROGATIVE_MARK_2S);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ràtu') + '/' + INTERROGATIVE_MARK_2S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rà') + '/' + INTERROGATIVE_MARK_3);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ràlo') + '/' + INTERROGATIVE_MARK_3_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ré') + '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'réu') + '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rémo') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rémoi') + '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rón') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rén') + '/' + INTERROGATIVE_MARK_1P);
			if(verb.conjugation == 2){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rí') + '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ríu') + '/' + INTERROGATIVE_MARK_2P_2);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rímo') + '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rímoi') + '/' + INTERROGATIVE_MARK_1P_2);
			}
		}
	};

	/** @private */
	var generateThemeT4ConditionalSimple = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT4 && !origin)
			throw 'error on origin for theme T4 "' + themes.themeT4 + '" ("' + verb.infinitive + '") conditional simple';
		if(themes.themeT4 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ría') + '/' + INTERROGATIVE_MARK_2S);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ríatu') + '/' + INTERROGATIVE_MARK_2S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ría').replace(/a$/, '[ae]') + '/' + INTERROGATIVE_MARK_1S);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ríai').replace(/ai$/, '[ae]i') + '/' + INTERROGATIVE_MARK_1S_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ría').replace(/a$/, '[ae]') + '/' + INTERROGATIVE_MARK_3);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ríelo') + '/' + INTERROGATIVE_MARK_3_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rési') + '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'résiu') + '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'résimo') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'résimoi') + '/' + INTERROGATIVE_MARK_1P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rié').replace(/ié$/, '(is)ié') + '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'riéu').replace(/iéu$/, '(is)iéu') + '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rón').replace(/on$/, '(is)(i)on(se)') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rén').replace(/en$/, '(is)en(se)') + '/' + INTERROGATIVE_MARK_1P);
			//NOTE: i únegi pronòmi interogativi enklítegi ke se dopara i xe kueli de 3a pars
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ràe') + '/' + INTERROGATIVE_MARK_3);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ràve') + '/' + INTERROGATIVE_MARK_3 + FLAG_SEPARATOR + INTERROGATIVE_MARK_3_CONDITIONAL_SIMPLE);
		}
	};

	/** @private */
	var generateThemeT5IndicativePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var t = themes[type];
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			if(!origin)
				throw 'error on origin for theme T5 "' + t.themeT5 + '" ("' + verb.infinitive + '") indicative present';
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5) + '/' + INTERROGATIVE_MARK_2P + MARKER_FLAGS);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5 + 'u') + '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/è$/, 'é') + 'mo') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/è$/, 'é') + 'moi') + '/' + INTERROGATIVE_MARK_1P_2);
			if(conj == 2){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í')) + '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í') + 'u') + '/' + INTERROGATIVE_MARK_2P_2);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í') + 'mo') + '/' + INTERROGATIVE_MARK_1P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í') + 'moi') + '/' + INTERROGATIVE_MARK_1P_2);
			}
		}
	};

	/** @private */
	var generateThemeT5SubjunctivePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var t = themes[type];
		t = t.subjunctive || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			t = t.subjunctive || t;
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			if(!origin)
				throw 'error on origin for theme T5 "' + t.themeT5 + '" ("' + verb.infinitive + '") subjunctive present';
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5));
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/è$/, 'é') + 'mo'));
			if(conj == 2 && themes.themeT5.replace(/i?é$/, 'í') != themes.themeT5){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í')));
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í') + 'mo'));
			}
			if(conj != 2){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/[èí]$/, 'é')));

				if(conj == 3 && !verb.special3rd){
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5));
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/í$/, 'i') + '[de/ge]'));
				}
			}
		}
	};

	/** @private */
	var generateThemeT5ImperativePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var t = themes[type];
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			if(!origin)
				throw 'error on origin for theme T5 "' + t.themeT5 + '" ("' + verb.infinitive + '") imperative present';
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5) + '/' + PRONOMENAL_IMPERATIVE_MARK);
			if(conj == 2)
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í')) + '/' + PRONOMENAL_IMPERATIVE_MARK);
			else
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/[èí]$/, 'é')) + '/' + PRONOMENAL_IMPERATIVE_MARK);

		}
	};

	/** @private */
	var generateThemeT6ParticiplePerfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var t = themes[type];
		t = t.participlePerfect || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

		if(t.themeT6 && !origin){
			t = themes[REGULAR];
			t = t.participlePerfect || t;
			origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));

			if(!origin)
				throw 'error on origin for theme T6 "' + t.themeT6 + '" ("' + verb.infinitive + '") participle perfect';
		}
		themes = t;

		if(themes.themeT6 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT6) + MARKER_FLAGS);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT6 + 'o').replace(/o$/, '[oaie]'));
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT6 + 'do').replace(/do$/, 'd[oaie]') + '/' + FINAL_CONSONANT_VOICING_MARK);
		}
	};

	/** @private */
	var generateThemeT7ParticipleImperfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT7 && !origin)
			throw 'error on origin for theme T7 "' + themes.themeT7 + '" ("' + verb.infinitive + '") participle imperfect';
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT7 + 'nte') + MARKER_FLAGS);
		}
	};

	/** @private */
	var generateThemeT7ParticiplePerfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		themes = themes.participlePerfect || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT7 && !origin)
			throw 'error on origin for theme T7 "' + themes.themeT7 + '" ("' + verb.infinitive + '") participle perfect';
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.conjugation == 3)
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT7 + 'sto').replace(/o$/, '[oaie]') + '/' + FINAL_CONSONANT_VOICING_MARK);
		}
	};

	/** @private */
	var generateThemeT7GerundSimple = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT7 && !origin)
			throw 'error on origin for theme T7 "' + themes.themeT7 + '" ("' + verb.infinitive + '") gerund simple';
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.conjugation == 3){
				var pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK + FLAG_SEPARATOR: '');
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT7 + 'ndo') + '/' + pronomenalMark + PRONOMENAL_IMPERATIVE_MARK);
			}
		}
	};

	/** @private */
	var generateThemeT8IndicativePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT8 && !origin)
			throw 'error on origin for theme T8 "' + themes.themeT8 + '" ("' + verb.infinitive + '") indicative present';
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT8).forEach(function(t){
				if(verb.irregularity.eser)
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'ón').replace(/([^cijɉñ])on$/, '$1(i)on') + '/' + INTERROGATIVE_MARK_1P);
				else if(verb.irregularity.aver){
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t).replace(/à$/, '[àèò]') + '/' + INTERROGATIVE_MARK_1S);
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'i').replace(/ài$/, '[àèò]i') + '/' + INTERROGATIVE_MARK_1S_2);
				}
				else{
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'o').replace(/o$/, '[oe]') + '/' + INTERROGATIVE_MARK_1S);
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'oi').replace(/oi$/, '[oe]') + '/' + INTERROGATIVE_MARK_1S_2);

					if(verb.irregularity.verb && type == IRREGULAR){
						if(verb.irregularity.saver){
							insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/à$/, 'ò')) + '/' + INTERROGATIVE_MARK_1S);
							insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/à$/, 'ò') + 'i') + '/' + INTERROGATIVE_MARK_1S_2);
						}
						else{
							insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'o').replace(/([aeiouàèéíòóú])o$/, '$1(g)o') + '/' + INTERROGATIVE_MARK_1S);
							insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'oi').replace(/([aeiouàèéíòóú])oi$/, '$1(g)oi') + '/' + INTERROGATIVE_MARK_1S_2);
						}
					}
				}
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.match(/à$/)? 'i': ''))) + '/' + INTERROGATIVE_MARK_2S);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.match(/à$/)? 'i': '')) + 'tu') + '/' + INTERROGATIVE_MARK_2S_2);
				var third = t + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(third) + '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(third.replace(/[ai]$/, 'e') + 'lo') + '/' + INTERROGATIVE_MARK_3_2);
				if(third.match(/[^aeiouàèéíòóú]e$/))
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(third) + '/' + FINAL_CONSONANT_VOICING_MARK);
				if(verb.irregularity.verb.match(/dixer|traer|toler/)){
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/[lx]?$/, 'go')) + '/' + INTERROGATIVE_MARK_1S);
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/[lx]?$/, 'go') + 'i') + '/' + INTERROGATIVE_MARK_1S_2);
				}
			});
		}
	};

	/** @private */
	var generateThemeT8SubjunctivePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT8 && !origin)
			throw 'error on origin for theme T8 "' + themes.themeT8 + '" ("' + verb.infinitive + '") subjunctive present';
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT8).forEach(function(t){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'a').replace(/a$/, '[ae]'));
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1i')));
				if(t.match(/[^aeiouàèéíòóú]$/))
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'e') + '/' + FINAL_CONSONANT_VOICING_MARK);

				if(type == IRREGULAR && !verb.irregularity.verb.match(/(aver|dever|eser)/)){
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'a').replace(/([aeiouàèéíòóú])a$/, '$1(g)a'));
					if(t.match(/[aeiouàèéíòóú]$/))
						insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'i').replace(/i$/, '(g)i'));
					else
						insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1i')));
				}

				if(verb.irregularity.verb.match(/dixer|traer|toler/))
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t + 'a').replace(/[lx]?a$/, 'g[ai]'));
			});
		}
	};

	/** @private */
	var generateThemeT8ParticiplePerfect_strong = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var t;
		[REGULAR, IRREGULAR].forEach(function(k){
			if(!t || !t.themeT8){
				t = themes[k];
				t = t.participlePerfect || t;
			}
		});
		themes = t;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT8 && !origin)
			throw 'error on origin for theme T8 "' + themes.themeT8 + '" ("' + verb.infinitive + '") participle perfect strong';
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var strong = generateParticiplePerfectStrong(verb, themes.themeT8);
			if(strong){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(strong + 'o') + '/' + FINAL_CONSONANT_VOICING_MARK);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(strong + 'o').replace(/o$/, '[oaie]'));
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
	var generateThemeT9ImperativePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT9 && !origin)
			throw 'error on origin for theme T9 "' + themes.themeT9 + '" ("' + verb.infinitive + '") imperative present';
		if(themes.themeT9 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT9).forEach(function(t){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t) + '/' + [PRONOMENAL_MARK, PRONOMENAL_IMPERATIVE_MARK].join(FLAG_SEPARATOR) + MARKER_FLAGS);
			});
		}
	};

	/** @private */
	var generateThemeT10IndicativePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT10 && !origin)
			throw 'error on origin for theme T10 "' + themes.themeT10 + '" ("' + verb.infinitive + '") indicative present';
		if(themes.themeT10 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT10).forEach(function(t){
				if(!themes.themeT8){
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t) + '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
					insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/[ai]$/, 'e') + 'lo') + '/' + INTERROGATIVE_MARK_3_2);
					if(t.match(/[^aeiouàèéíòóú]e$/))
						insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t) + '/' + FINAL_CONSONANT_VOICING_MARK);
				}
				else{
					var third = themes.themeT8 + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
					if(t != third){
						insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t) + '/' + INTERROGATIVE_MARK_3 + MARKER_FLAGS);
						insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t.replace(/[ai]$/, 'e') + 'lo') + '/' + INTERROGATIVE_MARK_3_2);
						if(t.match(/[^aeiouàèéíòóú]e$/))
							insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(t) + '/' + FINAL_CONSONANT_VOICING_MARK);
					}
				}
			});
		}
	};

	/** @private */
	var generateThemeT11IndicativeImperfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT11 && !origin)
			throw 'error on origin for theme T11 "' + themes.themeT11 + '" ("' + verb.infinitive + '") indicative imperfect';
		if(themes.themeT11 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ié').replace(/ié$/, '(iv)ié') + '/' + INTERROGATIVE_MARK_2P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'iéu').replace(/iéu$/, '(iv)iéu') + '/' + INTERROGATIVE_MARK_2P_2);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ón').replace(/on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(se)') + '/' + INTERROGATIVE_MARK_1P + MARKER_FLAGS);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ivón').replace(/on$/, '(i)on(se)') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'én').replace(/en$/, '(iv)en(se)') + '/' + INTERROGATIVE_MARK_1P);
		}
	};

	/** @private */
	var generateThemeT11SubjunctiveImperfect = function(paradigm, verb, themes, theme, type, origins, originTheme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, originTheme));

		if(themes.themeT11 && !origin)
			throw 'error on origin for theme T11 "' + themes.themeT11 + '" ("' + verb.infinitive + '") subjunctive imperfect';
		if(themes.themeT11 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ón').replace(/on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(e/se)') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'isón').replace(/on$/, '(i)on(e/se)') + '/' + INTERROGATIVE_MARK_1P);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'én').replace(/en$/, '(is)en(e/se)') + '/' + INTERROGATIVE_MARK_1P);
		}
	};

	/** @private */
	var generateThemeT12IndicativePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var origin = unmarkDefaultStress(getOrigin(themes[type], verb, originTheme));
		if(!origin)
			origin = unmarkDefaultStress(getOrigin(themes[type == IRREGULAR? REGULAR: IRREGULAR], verb, originTheme));
		themes = themes[type];

		if(themes.themeT12 && !origin)
			throw 'error on origin for theme T12 "' + themes.themeT12 + '" ("' + verb.infinitive + '") indicative present';
		if(themes.themeT12 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'ón') + '/' + INTERROGATIVE_MARK_1P + MARKER_FLAGS);
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'én') + '/' + INTERROGATIVE_MARK_1P);
			if(themes.themeT5 && conj != 2){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'é') + '/' + INTERROGATIVE_MARK_2P);
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'éu') + '/' + INTERROGATIVE_MARK_2P_2);
			}
		}
	};

	/** @private */
	var generateThemeT12SubjunctivePresent = function(paradigm, verb, themes, theme, type, origins, originTheme){
		var t = themes[type];
		t = t.subjunctive || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, originTheme));
		if(!origin)
			origin = unmarkDefaultStress(getOrigin(themes[type == IRREGULAR? REGULAR: IRREGULAR].subjunctive || themes[type == IRREGULAR? REGULAR: IRREGULAR], verb, originTheme));
		themes = t;

		if(themes.themeT12 && !origin)
			throw 'error on origin for theme T12 "' + themes.themeT12 + '" ("' + verb.infinitive + '") subjunctive present';
		if(themes.themeT12 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'ón').replace(/on$/, (!themes.themeT12.match(/[cijɉñ]$/)? '(i)': '') + 'on(e)'));
			insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'én').replace(/en$/, 'en(e)'));
			if(themes.themeT5){
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'é').replace(/é$/, (verb.special3rd? '(i)': '') + 'é'));
				insert(paradigm, theme, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'é').replace(/é$/, (verb.special3rd? '(i)': '') + 'e[de/ge]'));
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
	var insert = function(paradigm, theme, infinitive, origin, suffix){
		var i = ArrayHelper.findIndex(paradigm, function(el){ return (el.infinitive == infinitive); }),
			parts = extractCommonPartsFromStart(origin, suffix),
			data = parts.a + '>' + parts.b,
			re, j, flags;
		if(i < 0)
			paradigm.push({theme: theme, infinitive: infinitive, origin: origin, suffixes: [data]});
		else{
			re = new RegExp('^' + data.replace(PATTERN_FLAGS, '') + PATTERN_FLAGS.toString().replace(/^\/|\/$/, ''));
			j = ArrayHelper.findIndex(paradigm[i].suffixes, function(suffix){ return suffix.match(re); });
			if(j < 0)
				paradigm[i].suffixes.push(data);
			else{
				flags = paradigm[i].suffixes[j].match(PATTERN_FLAGS);
				flags = (flags[1]? flags[1].replace(/\//, ''): '');
				paradigm[i].suffixes[j] = addFlag(data, flags);
			}
		}
	};


	return {
		generate: generate
	};

});
