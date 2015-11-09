/**
 * @class AFFFileRules
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/Dialect', 'tools/lang/morphology/Verb', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/PhonologyHelper', 'tools/data/ObjectHelper', 'tools/data/ArrayHelper'], function(Word, Dialect, Verb, Themizer, PhonologyHelper, ObjectHelper, ArrayHelper){

	/** @constant */
	var REGULAR = 'regular',
	/** @constant */
		IRREGULAR = 'irregular',
	/** @constant */
		MARKER_FLAGS = '@',
	/** @constant */
		PATTERN_FLAGS = new RegExp('\\/([\\d,]+)' + MARKER_FLAGS.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '?$');

	/** @constant */
	var PRONOMENAL_MARK = '/41',
	/** @constant */
		PRONOMENAL_MARK_IMPERATIVE = '/42',
	/** @constant * /
		INTERROGATIVE_MARK = '/43',
	/** @constant */
		FINAL_CONSONANT_VOICING = '/44';

/*	var reductions = {
//		[13, 'o', '[oaie]'],
		1: [
			[14, 'r', 'r' + MARKER_FLAGS, 're'],
			[15, 'r', 'r' + PRONOMENAL_MARK + MARKER_FLAGS, 're', 'ar' + PRONOMENAL_MARK + MARKER_FLAGS, 'are'],
			[16, 'r', 'r' + PRONOMENAL_MARK + MARKER_FLAGS, 're', 'òr' + PRONOMENAL_MARK + MARKER_FLAGS, 'òre'],
			[17, 'r', 'r' + PRONOMENAL_MARK + MARKER_FLAGS, 're', 'ir' + PRONOMENAL_MARK + MARKER_FLAGS, 'ire']/** /
		],
		2: [
/*			[18, 'sto', 'st[oaie]', '(v)[oaie]', 'à(v)imo', 's[ei]', 'àsimo', 'ndo' + PRONOMENAL_MARK + MARKER_FLAGS],
			[19, 'sto', 'st[oaie]', '(v)[oaie]', 'é(v)imo', 's[ei]', 'ésimo', 'ndo' + PRONOMENAL_MARK + MARKER_FLAGS],
			[20, 'sto', 'st[oaie]', '(v)[oaie]', 'í(v)imo', 's[ei]', 'ísimo', 'ndo' + PRONOMENAL_MARK + MARKER_FLAGS],
			[21, 'olvesto', 'olvest[oaie]', 'olve(v)[oaie]', 'olvé(v)imo', 'olves[ei]', 'olvésimo', 'olvendo' + PRONOMENAL_MARK + MARKER_FLAGS]/** /
		],
		4: [],
		5: [],
		6: [],
		7: [],
		8: [],
		9: [],
		10: [],
		11: [],
		12: []
	};/**/


	/**
	 * @param {List} List of verbs generated using Verb
	 */
	var generate = function(verbs){
		var dialect = new Dialect(),
			infinitiveThemes = {};
		verbs.forEach(function(verb){
			infinitiveThemes[verb.infinitive] = Themizer.generate(verb, dialect);
		});

//		generateTheme(verbs, infinitiveThemes, 1, 0, [2, 4, 8, 9, 10]);
		generateTheme(verbs, infinitiveThemes, 2, 0, [5, 6, 7]);
//		generateTheme(verbs, infinitiveThemes, 4, 0, [11]);
//		generateTheme(verbs, infinitiveThemes, 5, 2);
//		generateTheme(verbs, infinitiveThemes, 6, 2);
//		generateTheme(verbs, infinitiveThemes, 7, 2);
//		generateTheme(verbs, infinitiveThemes, 8, 0, [12]);
//		generateTheme(verbs, infinitiveThemes, 9, 0);
//		generateTheme(verbs, infinitiveThemes, 10, 0);
//		generateTheme(verbs, infinitiveThemes, 11, 4);
//		generateTheme(verbs, infinitiveThemes, 12, 8);
	};

	var generateTheme = function(verbs, infinitiveThemes, theme, originTheme, flags){
		var paradigm = [],
			origins = [],
			reductions = {},
			themes;
		verbs.forEach(function(verb){
			themes = infinitiveThemes[verb.infinitive];

			switch(theme){
				case 1:
					generateThemeT1InfinitiveSimple(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT1InfinitiveSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 2:
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
					break;

				case 4:
					if(!verb.irregularity.eser){
						generateThemeT4IndicativeFuture(paradigm, verb, themes, REGULAR, origins, originTheme);
						generateThemeT4ConditionalSimple(paradigm, verb, themes, REGULAR, origins, originTheme);
					}
					generateThemeT4IndicativeFuture(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					generateThemeT4ConditionalSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 5:
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
					break;

				case 6:
					generateThemeT6ParticiplePerfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT6ParticiplePerfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 7:
					generateThemeT7ParticipleImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT7ParticipleImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					generateThemeT7ParticiplePerfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT7ParticiplePerfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					if(!verb.irregularity.eser)
						generateThemeT7GerundSimple(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 8:
					generateThemeT8IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT8IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
						generateThemeT8SubjunctivePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT8SubjunctivePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					generateThemeT8ParticiplePerfect_strong(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 9:
					if(!verb.irregularity.poder){
						generateThemeT9ImperativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
						generateThemeT9ImperativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					}
					break;

				case 10:
						generateThemeT10IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
						generateThemeT10IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 11:
					if(!verb.irregularity.eser){
						generateThemeT11IndicativeImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
						generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, REGULAR, origins, originTheme);
					}
					//ensure syncope does not occurs
					if(!verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
						generateThemeT11IndicativeImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					generateThemeT11SubjunctiveImperfect(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;

				case 12:
					generateThemeT12IndicativePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT12IndicativePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					//ensure syncope does not occurs
					if(!verb.irregularity.verb.match(/dever|eser|s?aver/))
						generateThemeT12SubjunctivePresent(paradigm, verb, themes, REGULAR, origins, originTheme);
					generateThemeT12SubjunctivePresent(paradigm, verb, themes, IRREGULAR, origins, originTheme);
					break;
			}
		});

		paradigm = compactEqualSuffixes(paradigm);

		var i = 13;
		reductions[theme] = collectCommonSuffixes(paradigm, i);
		i += reductions[theme].length;

//		reduceSuffixes(paradigm, reductions[theme]);

		constraintToInfinitives(paradigm, origins);

		if(Array.isArray(flags))
			flags = flags.join(',');
		printParadigm(paradigm, flags, theme);
	};


	/** @private */
	var printParadigm = function(list, flags, i){
		var logs = [],
			m;
		list.forEach(function(el){
			el.suffixes.forEach(function(suffix){
				m = suffix.match(/^(.*)>(.*)$/);
				storeSuffix(logs, i, m[1], m[2], flags, el.matcher, el.origins);
			});
		});

		if(logs.length){
			printSuffixes(logs, i);

			i ++;
		}

		return i;
	};

	/** @private */
	var storeSuffix = function(logs, i, replaced, replacement, flags, constraint, parents){
		if(!replaced)
			replaced = 0;
		replacement = addFlagToMarker(replacement, flags);
		if(!constraint && replaced != 0)
			constraint = replaced;

//		logs.push('SFX ' + i + ' ' + replaced + ' ' + replacement + (constraint? ' ' + constraint: '') + (parents? ' # ' + parents.sort().join(','): ''));
logs.push('SFX ' + i + ' ' + replaced + ' ' + replacement + (constraint? ' ' + constraint: ''));
	};

	/** @private */
	var printSuffixes = function(logs, i, base){
		console.log('SFX ' + i + ' Y ' + logs.length + (base != undefined? ' # ' + base: ''));
		logs.sort().forEach(function(log){
			console.log(log);
		});
	};

	/** @private */
	var addFlag = function(replacement, flag){
		if(!flag)
			return replacement.replace(MARKER_FLAGS, '');

		replacement = (replacement.indexOf('/') >= 0?
			replacement.replace(PATTERN_FLAGS, '/' + flag + ',$1'):
			replacement + '/' + flag);

		return replacement.replace(PATTERN_FLAGS, function(value){
			return '/' + ArrayHelper.unique(value.match(/[\d,]+/)[0].split(',')).sort(function(a, b){ return Number(a) - Number(b); }).join(',');
		});
	};

	/** @private */
	var addFlagToMarker = function(replacement, flag){
		if(!flag)
			return replacement.replace(MARKER_FLAGS, '');

		replacement = (replacement.indexOf('/') >= 0?
			replacement.replace(PATTERN_FLAGS, '/$1,' + flag).replace(MARKER_FLAGS, ''):
			replacement.replace(MARKER_FLAGS, '/' + flag));

		return replacement.replace(PATTERN_FLAGS, function(value){
			return '/' + ArrayHelper.unique(value.match(/[\d,]+/)[0].split(',')).sort(function(a, b){ return Number(a) - Number(b); }).join(',');
		});
	};

	/** @private */
	var extractCommonPartsFromStart = function(a, b, allButLast){
		for(var i = 0, len = Math.min(a.length, b.length) - (allButLast? 1: 0); i < len; i ++)
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
		//merge identical transformations with different flags
		var parts, flags;
		list.forEach(function(sublist){
			parts = ArrayHelper.partition(ArrayHelper.unique(sublist.suffixes), function(el){ return el.replace(/(\/[\d,]+)?$/, ''); });
			sublist.suffixes = Object.keys(parts).map(function(part){
				flags = ArrayHelper.unique(ArrayHelper.flatten(parts[part]
					.map(function(el){ return (el.match(/^.*\/[\d,]+$/)? el.replace(/^.*\//, '').split(','): ''); })
					.filter(function(el){ return el; })))
					.sort(function(a, b){ return Number(a) - Number(b); })
					.join(',');
				return (flags? part + '/' + flags: part);
			});
		});

		var compacted = [],
			data;
		for(var i = list.length - 1; i >= 0; i --){
			data = {origins: [list[i].origin], suffixes: list[i].suffixes};

			//search list for equal suffixes
			for(var j = i - 1; j >= 0; j --)
				if(ArrayHelper.equals(list[j].suffixes, data.suffixes)){
					data.origins.push(list[j].origin);

					//remove element from list
					list.splice(j, 1);
					i --;
				}
			list.splice(i, 1);

			compacted.push(data);
		}
		return compacted;
	};

	/** @private */
	var collectCommonSuffixes = function(list, k){
		//reorder list by number of suffixes
		list = list.sort(function(a, b){ return (a.suffixes.length - b.suffixes.length); });

		var sls = [],
			i, j, idx, parts, len;
		for(i = list.length - 1; i >= 0; i --){
			parts = ArrayHelper.partition(list[i].suffixes, function(el){ return el.substr(0, el.indexOf('>')); });
			Object.keys(parts).forEach(function(idx){
				parts[idx] = parts[idx].filter(function(el){ return el.match(/[\(\[]/); });

				if(!parts[idx].length)
					delete parts[idx];
			});
			for(j = i; j >= 0; j --)
				Object.keys(parts).forEach(function(part){
					idx = ArrayHelper.findIndex(sls, function(sl){ return ArrayHelper.equals(sl, parts[part]); });
					if(idx < 0){
						part = parts[part];
						idx = sls.length;
						sls.push(part);
					}
					else
						part = sls[idx];

					len = list[i].suffixes.length;
					list[i].suffixes = ArrayHelper.difference(list[i].suffixes, part);
					if(list[i].suffixes.length != len)
						list[i].suffixes.push(extractSimpleForm(part[0]) + '/' + (k + idx));
				});
		}
		return sls;
	};

	/** @private */
	var extractSimpleForm = function(form){
		return form.replace(new RegExp('\\(.+?\\)|\\/[\\d,]+|' + MARKER_FLAGS, 'g'), '').replace(/\[.+\]/g, function(value){ return value.split('')[1]; });
	};

	/** @private */
	var reduceSuffixes = function(list, reductions){
		var flag, substitution,
			reductionRE;
		list.forEach(function(sublist){
			reductions.forEach(function(reduction){
				flag = reduction.shift();
				substitution = reduction.shift();

				//reduce suffixes
				reductionRE = reduction.map(function(red){ return new RegExp('^' + escapeRegExp(red) + '$'); });
				if(sublist.suffixes.map(function(suffix){ return reductionRE.some(function(re){ return suffix.match(re); }); }).every(function(el){ return el; })){
//				if(reductionRE.map(function(re){ return sublist.suffixes.some(function(suffix){ return suffix.match(re); }); }).every(function(el){ return el; })){
					reductionRE.forEach(function(re){
						sublist.suffixes = sublist.suffixes.map(function(suffix){
							return (suffix.match(re)? addFlag(suffix.replace(re, substitution), flag): suffix);
						});
					});

					sublist.suffixes = ArrayHelper.unique(sublist.suffixes);
				}

				reduction.unshift(substitution);
				reduction.unshift(flag);
			});
		});
	};

	/** @private */
	var unmarkDefaultStress = function(word){
		if(!word)
			return undefined;

		var idx = Word.getIndexOfStress(word);
		if(idx >= 0){
			//exclude unmark from words that can be truncated like "fenisié(de)" or "(g)à"
			var tmp = (!word.match(/^(re)?\(?g?\)?(à\/è|à|é|ò)$/) && !word.match(/^\(?x?\)?é$|^s[éí]$/)
					&& !word.match(/^((r[ei])?d[àé]|(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?f[àé]|(mal|move|soto)?st[àé])$/)
					&& !word.match(/^(và[oaie]?|vé)$/)
					&& !word.match(/^s[àò]$/)
					&& !word.match(/^(|as?|des?|es|kon|pro|re|so)tr[àé]$/)?
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
					obj = {origins: part[k], suffixes: obj.suffixes};
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


	/** @private */
	var generateThemeT1InfinitiveSimple = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT1 && !origin)
			throw 'error on origin for theme T1 ' + themes.themeT1 + ' infinitive simple';
		if(themes.themeT1 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var pronomenalMark = (!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT1 + 'r') + pronomenalMark + MARKER_FLAGS);
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT1 + 're'));
		}
	};

	/** @private */
	var generateThemeT2IndicativeImperfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 ' + themes.themeT2 + ' indicative imperfect';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var tmp = (verb.irregularity.eser? 'r': 'v');
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'o').replace(/vo$/, '(v)[oaie]'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + tmp + 'imo').replace(/vimo$/, '(v)imo'));
		}
	};

	/** @private */
	var generateThemeT2SubjunctiveImperfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 ' + themes.themeT2 + ' subjunctive imperfect';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'se').replace(/e$/, '[ei]'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'simo'));
		}
	};

	/** @private */
	var generateThemeT2ParticiplePerfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		themes = themes.participlePerfect || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 ' + themes.themeT2 + ' participle perfect';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'sto').replace(/o$/, '[oaie]'));
		}
	};

	/** @private */
	var generateThemeT2GerundSimple = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT2 && !origin)
			throw 'error on origin for theme T2 ' + themes.themeT2 + ' gerund simple';
		if(themes.themeT2 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var pronomenalMark = (!verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT2 + 'ndo') + pronomenalMark + MARKER_FLAGS);
			if(verb.irregularity.eser)
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(verb.infinitive.substr(0, verb.infinitive.length - 'èser'.length) + 'siàndo') + pronomenalMark);
			else if(verb.irregularity.aver)
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(verb.infinitive.substr(0, verb.infinitive.length - 'aver'.length) + 'abiàndo') + pronomenalMark);
		}
	};

	/** @private */
	var generateThemeT4IndicativeFuture = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT4 && !origin)
			throw 'error on origin for theme T4 ' + themes.themeT4 + ' indicative future';
		if(themes.themeT4 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rà') + MARKER_FLAGS);
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rè').replace(/è$/, '[èéò]'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rémo'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rón'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rén'));
			if(verb.conjugation == 2){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rí'));
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rímo'));
			}
		}
	};

	/** @private */
	var generateThemeT4ConditionalSimple = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT4 && !origin)
			throw 'error on origin for theme T4 ' + themes.themeT4 + ' conditional simple';
		if(themes.themeT4 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ría').replace(/a$/, '[ae]'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rési'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'résimo'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rié').replace(/ié$/, '(is)ié'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rón').replace(/on$/, '(is)(i)on(se)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'rén').replace(/en$/, '(is)en(se)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT4 + 'ràve'));
		}
	};

	/** @private */
	var generateThemeT5IndicativePresent = function(paradigm, verb, themes, type, origins, theme){
		var t = themes[type];
		var origin = unmarkDefaultStress(getOrigin(t, verb, theme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			origin = unmarkDefaultStress(getOrigin(t, verb, theme));

			if(!origin)
				throw 'error on origin for theme T5 ' + t.themeT5 + ' indicative present';
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5) + MARKER_FLAGS);
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/è$/, 'é') + 'mo'));
			if(conj == 2){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í')));
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í') + 'mo'));
			}
		}
	};

	/** @private */
	var generateThemeT5SubjunctivePresent = function(paradigm, verb, themes, type, origins, theme){
		var t = themes[type];
		t = t.subjunctive || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, theme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			t = t.subjunctive || t;
			origin = unmarkDefaultStress(getOrigin(t, verb, theme));

			if(!origin)
				throw 'error on origin for theme T5 ' + t.themeT5 + ' subjunctive present';
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/è$/, 'é') + 'mo'));
			if(conj == 2 && themes.themeT5.replace(/i?é$/, 'í') != themes.themeT5){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í')));
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í') + 'mo'));
			}
			if(conj != 2){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/[èí]$/, 'é')));

				if(conj == 3 && !verb.special3rd){
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5));
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5 + '(de/ge)'));
				}
			}
		}
	};

	/** @private */
	var generateThemeT5ImperativePresent = function(paradigm, verb, themes, type, origins, theme){
		var t = themes[type];
		var origin = unmarkDefaultStress(getOrigin(t, verb, theme));

		if(t.themeT5 && !origin){
			t = themes[REGULAR];
			origin = unmarkDefaultStress(getOrigin(t, verb, theme));

			if(!origin)
				throw 'error on origin for theme T5 ' + t.themeT5 + ' imperative present';
		}
		themes = t;

		if(themes.themeT5 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5) + PRONOMENAL_MARK_IMPERATIVE);
			if(conj == 2)
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/i?é$/, 'í')) + PRONOMENAL_MARK_IMPERATIVE);
			else
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT5.replace(/[èí]$/, 'é')) + PRONOMENAL_MARK_IMPERATIVE);

		}
	};

	/** @private */
	var generateThemeT6ParticiplePerfect = function(paradigm, verb, themes, type, origins, theme){
		var t = themes[type];
		t = t.participlePerfect || t;
		var origin = unmarkDefaultStress(getOrigin(t, verb, theme));

		if(t.themeT6 && !origin){
			t = themes[REGULAR];
			t = t.participlePerfect || t;
			origin = unmarkDefaultStress(getOrigin(t, verb, theme));

			if(!origin)
				throw 'error on origin for theme T6 ' + t.themeT6 + ' participle perfect';
		}
		themes = t;

		if(themes.themeT6 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT6) + MARKER_FLAGS);
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT6 + 'do').replace(/do$/, '(d)[oaie]'));
		}
	};

	/** @private */
	var generateThemeT7ParticipleImperfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT7 && !origin)
			throw 'error on origin for theme T7 ' + themes.themeT7 + ' participle imperfect';
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT7 + 'nte') + MARKER_FLAGS);
		}
	};

	/** @private */
	var generateThemeT7ParticiplePerfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		themes = themes.participlePerfect || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT7 && !origin)
			throw 'error on origin for theme T7 ' + themes.themeT7 + ' participle perfect';
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.conjugation == 3)
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT7 + 'sto').replace(/o$/, '[oaie]'));
		}
	};

	/** @private */
	var generateThemeT7GerundSimple = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT7 && !origin)
			throw 'error on origin for theme T7 ' + themes.themeT7 + ' gerund simple';
		if(themes.themeT7 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			if(verb.conjugation == 3){
				var pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT7 + 'ndo') + pronomenalMark);
			}
		}
	};

	/** @private */
	var generateThemeT8IndicativePresent = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT8 && !origin)
			throw 'error on origin for theme T8 ' + themes.themeT8 + ' indicative present';
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT8).forEach(function(t){
				if(verb.irregularity.eser)
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'ón').replace(/([^cijɉñ])on$/, '$1(i)on'));
				else if(verb.irregularity.aver)
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t).replace(/à$/, '[àèò]'));
				else{
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'o').replace(/o$/, '[oe]'));
//					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(PhonologyHelper.finalConsonantVoicing(t, 'northern')));

					if(verb.irregularity.verb && type == IRREGULAR){
						if(verb.irregularity.saver)
							insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t.replace(/à$/, 'ò')));
						else
							insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'o').replace(/([aeiouàèéíòóú])o$/, '$1(g)o'));
					}
				}
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1' + (!verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.match(/à$/)? 'i': ''))));
				var third = t + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(third) + MARKER_FLAGS);
//				if(third.match(/[ei]$/))
//					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(PhonologyHelper.finalConsonantVoicing(third.replace(/[ei]$/, ''), 'northern')));
				if(verb.irregularity.verb.match(/dixer|traer|toler/))
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t.replace(/[lx]?$/, 'go')));
			});
		}
	};

	/** @private */
	var generateThemeT8SubjunctivePresent = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT8 && !origin)
			throw 'error on origin for theme T8 ' + themes.themeT8 + ' subjunctive present';
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT8).forEach(function(t){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'a').replace(/a$/, '[ae]'));
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1i')));
//				if(t.match(/[^aeiouàèéíòóú]$/))
//					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(PhonologyHelper.finalConsonantVoicing(t, 'northern')));

				if(type == IRREGULAR && !verb.irregularity.verb.match(/(aver|dever|eser)/)){
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'a').replace(/([aeiouàèéíòóú])a$/, '$1(g)a'));
					if(t.match(/[aeiouàèéíòóú]$/))
						insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'i').replace(/i$/, '(g)i'));
					else
						insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t.replace(/([^i])$/, '$1i')));
				}

				if(verb.irregularity.verb.match(/dixer|traer|toler/))
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t + 'a').replace(/[lx]?a$/, 'g[ai]'));
			});
		}
	};

	/** @private */
	var generateThemeT8ParticiplePerfect_strong = function(paradigm, verb, themes, type, origins, theme){
		var t;
		[REGULAR, IRREGULAR].forEach(function(k){
			if(!t || !t.themeT8){
				t = themes[k];
				t = t.participlePerfect || t;
			}
		});
		themes = t;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT8 && !origin)
			throw 'error on origin for theme T8 ' + themes.themeT8 + ' participle perfect strong';
		if(themes.themeT8 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var strong = generateParticiplePerfectStrong(verb, themes.themeT8);
			if(strong){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(strong + 'o').replace(/o$/, '[oaie]'));

//				if(strong.match(/[^aeiouàèéíòóú]$/))
//					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(PhonologyHelper.finalConsonantVoicing(strong, 'northern')));
			}
		}
	};

	/** @private */
	var generateParticiplePerfectStrong = (function(){

		/*var strongT = [
			//{matcher: /([aeiouàèéíòóú])rn?$/, replacement: '($1rt/rS1t)'},
			{matcher: /([aeiouàèéíòóú])rn?$/, replacement: '$1rt'},
			{matcher: /([^aeiouàèéíòóú])r$/, replacement: '$1èrt'},
			{matcher: /li?$/, replacement: 'lt'},
			{matcher: /([aeiouàèéíòóú])$/, replacement: '$1t'},
			{matcher: /rí?x$/, replacement: 'rèt'},
			{matcher: /úx$/, replacement: 'ót'},
			{matcher: /ónd?$/, replacement: 'óst'},
			{matcher: /m|n[ds]$/, replacement: 'nt'},
			{matcher: /n[xđp]|[bđgstŧvx]$/, replacement: 't'}
		];

		var strongS = [
			{matcher: /sucéd$/, replacement: 'sucès'},

			{matcher: /ónd$/, replacement: 'úx'},
			{matcher: /([aeiouàèéíòóú])n?d$/, replacement: '$1x'},
			{matcher: /([^aeiouàèéíòóú]n?)d|[stvx]$/, replacement: '$1s'},
			{matcher: /pèl$/, replacement: 'púls'},
			{matcher: /ím$/, replacement: 'ès'},
			{matcher: /st$/, replacement: 'íx'},
			{matcher: /rd?$/, replacement: 'rs'},
			{matcher: /l$/, replacement: 'ls'}
		];*/

		var strong = [
			//1st conjugation
			[
				{matcher: /fà$/, replacement: 'fàt'},
				{matcher: /konsà$/, replacement: 'kóns'}
			],

			//2nd conjugation
			[
				//rhizotonic
				[
					//TODO
					{matcher: /díx$/, replacement: 'dít'},
					{matcher: /dúx$/, replacement: 'dót'},
					{matcher: /đónx$/, replacement: 'đónt'},
					{matcher: /fríđ$/, replacement: 'frít'},
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /kòt$/, replacement: 'kòs'},
					{matcher: /kòx$/, replacement: 'kòt'},
					{matcher: /kuèrđ$/, replacement: 'kuèrt'},
					{matcher: /mét$/, replacement: 'més'},
					{matcher: /móv$/, replacement: 'mós'},
					{matcher: /nét$/, replacement: 'nés'},
					{matcher: /ofénd$/, replacement: 'oféx'},
					{matcher: /ónđ$/, replacement: 'ónt'},
					{matcher: /pànd$/, replacement: 'pànt'},
					{matcher: /pénd$/, replacement: 'péx'},
					{matcher: /pénđ$/, replacement: 'pént'},
					{matcher: /pèrd$/, replacement: 'pèrs'},
					{matcher: /prénd$/, replacement: 'préx'},
					{matcher: /pón$/, replacement: 'pòst'},
					{matcher: /pòrx$/, replacement: 'pòrt'},
					{matcher: /rèx$/, replacement: 'rèt'},
					{matcher: /ríd$/, replacement: 'ríx'},
					{matcher: /rónp$/, replacement: 'rót'},
					{matcher: /skrív$/, replacement: 'skrít'},
					{matcher: /sòrx$/, replacement: 'sòrt'},
					{matcher: /spànd$/, replacement: 'spànt'},
					{matcher: /spàrx$/, replacement: 'spàrs'},
					{matcher: /strénđ$/, replacement: 'strét'},
					{matcher: /sucéd$/, replacement: 'sucès'},
					{matcher: /ténd$/, replacement: 'téx'},
					{matcher: /ténx$/, replacement: 'tént'},
					{matcher: /tòrđ$/, replacement: 'tòrt'},
					{matcher: /trà$/, replacement: 'tràt'},
					{matcher: /véd$/, replacement: 'víst'},
					{matcher: /vínŧ$/, replacement: 'vínt'},
					{matcher: /vív$/, replacement: 'visú'},
					{matcher: /vòlx$/, replacement: 'vòlt'}
					//...
				],
				//rhizoatone
				[
					{matcher: /vàl$/, replacement: 'vàls'},
					{matcher: /n$/, replacement: 'x'},
					{matcher: /r$/, replacement: 'rs'},
					{matcher: /tòl$/, replacement: 'tòlt'}
				]
			],

			//3rd conjugation
			[
				{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},
				{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /núdr$/, replacement: '$1èrt'},
				{matcher: /([aeiouàèéíòóú])r$/, replacement: '$1rs'}
			]
		];

		return function(verb, themeT8){
			var data = strong[verb.conjugation - 1];
			if(verb.conjugation == 2)
				data = data[verb.rhizotonic? 0: 1];
			//FIXME
			//choose between T- and S-past-participle for 2nd conjugation verbs?
			//...

			var m, match;
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
	var generateThemeT9ImperativePresent = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT9 && !origin)
			throw 'error on origin for theme T9 ' + themes.themeT9 + ' imperative present';
		if(themes.themeT9 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT9).forEach(function(t){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t) + PRONOMENAL_MARK_IMPERATIVE + MARKER_FLAGS);
			});
		}
	};

	/** @private */
	var generateThemeT10IndicativePresent = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT10 && !origin)
			throw 'error on origin for theme T10 ' + themes.themeT10 + ' indicative present';
		if(themes.themeT10 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			expandForm(themes.themeT10).forEach(function(t){
				var third = themes.themeT8 + (!verb.irregularity.verb.match(/darStarFar|s?aver/)? (verb.irregularity.eser? 'é': 'e'): '');
				if(themes.themeT8 && t != third)
//					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t).replace(/([ae])$/, '($1)') + MARKER_FLAGS);
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t) + MARKER_FLAGS);
				if(!themes.themeT8){
					insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(t) + MARKER_FLAGS);
//					var thirdNorthernOriental = PhonologyHelper.finalConsonantVoicing(t.replace(/[ae]$/, ''), 'northern');
//					if(t != thirdNorthernOriental)
//						insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(thirdNorthernOriental));
				}
			});
		}
	};

	/** @private */
	var generateThemeT11IndicativeImperfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT11 && !origin)
			throw 'error on origin for theme T11 ' + themes.themeT11 + ' indicative imperfect';
		if(themes.themeT11 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ié').replace(/ié$/, '(iv)ié'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ón').replace(/on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(se)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ivón').replace(/on$/, '(i)on(se)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'én').replace(/en$/, '(iv)en(se)'));
		}
	};

	/** @private */
	var generateThemeT11SubjunctiveImperfect = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT11 && !origin)
			throw 'error on origin for theme T11 ' + themes.themeT11 + ' sybjunctive imperfect';
		if(themes.themeT11 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'ón').replace(/on$/, (!themes.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(e/se)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'isón').replace(/on$/, '(i)on(e/se)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT11 + 'én').replace(/en$/, '(is)en(e/se)'));
		}
	};

	/** @private */
	var generateThemeT12IndicativePresent = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT12 && !origin)
			throw 'error on origin for theme T12 ' + themes.themeT12 + ' indicative present';
		if(themes.themeT12 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			var conj = getIrregularVerbConjugation(type, verb);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'ón') + MARKER_FLAGS);
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'én'));
			if(themes.themeT5 && conj != 2)
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'é'));
		}
	};

	/** @private */
	var generateThemeT12SubjunctivePresent = function(paradigm, verb, themes, type, origins, theme){
		themes = themes[type];
		themes = themes.subjunctive || themes;
		var origin = unmarkDefaultStress(getOrigin(themes, verb, theme));

		if(themes.themeT12 && !origin)
			throw 'error on origin for theme T12 ' + themes.themeT12 + ' subjunctive present';
		if(themes.themeT12 && origin){
			if(origins.indexOf(origin) < 0)
				origins.push(origin);

			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'ón').replace(/on$/, (!themes.themeT12.match(/[cijɉñ]$/)? '(i)': '') + 'on(e)'));
			insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'én').replace(/en$/, 'en(e)'));
			if(themes.themeT5){
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'é').replace(/é$/, (verb.special3rd? '(i)': '') + 'é'));
				insert(paradigm, verb.infinitive, origin, unmarkDefaultStress(themes.themeT12 + 'é').replace(/é$/, (verb.special3rd? '(i)': '') + 'é(de/ge)'));
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
	var insert = function(paradigm, infinitive, origin, suffix){
		var idx = ArrayHelper.findIndex(paradigm, function(el){ return (el.infinitive == infinitive); }),
			parts = extractCommonPartsFromStart(origin, suffix, true),
			data = parts.a + '>' + parts.b;
		if(idx < 0)
			paradigm.push({infinitive: infinitive, origin: origin, suffixes: [data]});
		else if(paradigm[idx].suffixes.indexOf(data) < 0)
			paradigm[idx].suffixes.push(data);
	};

	var expandForm = (function(){
		var add = function(list, value){
			if(list.indexOf(value) < 0)
				list.push(value);
		};


		return function(forms){
			var list = [],
				m;
			[].concat(forms).forEach(function(form){
				m = form.match(/^(.*)\((.+)\)(.*)$/);
				if(m){
					add(list, (m[1] || '') + (m[3] || ''));
					add(list, (m[1] || '') + m[2] + (m[3] || ''));
				}
				else
					add(list, form);
			});
			return list;
		};
	})();


	return {
		generate: generate
	};

});
