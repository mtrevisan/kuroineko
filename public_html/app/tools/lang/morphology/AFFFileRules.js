/**
 * @class AFFFileRules
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/Dialect', 'tools/lang/morphology/Verb', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/PhonologyHelper', 'tools/data/ObjectHelper', 'tools/data/ArrayHelper'], function(Word, Dialect, Verb, Themizer, PhonologyHelper, ObjectHelper, ArrayHelper){

	/** @constant */
	var START_OF_WORD = '^',
	/** @constant */
		WHOLE_WORD = '*',
	/** @constant */
		PRONOMENAL_MARK = '#',
	/** @constant */
		PRONOMENAL_MARK_IMPERATIVE = '!',
	/** @constant * /
		INTERROGATIVE_MARK = '_',
	/** @constant */
		FINAL_CONSONANT_VOICING = '@';

	var INTERROGATIVE_MARK_1 = 'n(t)e',
		INTERROGATIVE_MARK_1_1 = 'mi',
		INTERROGATIVE_MARK_1_2 = '[ie]',
		INTERROGATIVE_MARK_2S = 't[uo]',
		INTERROGATIVE_MARK_2P = '[uo]',
		INTERROGATIVE_MARK_3 = 'l[oaie]';

	/**
	 * @constant
	 * @private
	 */
	var REGULAR = 'regular',
	/**
	 * @constant
	 * @private
	 */
		IRREGULAR = 'irregular',
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_OPTIONAL = /^(.*?)\((.+?)\)(.*)$/,
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_ALTERNATIVE_1 = /^(.+)\/(.+)$/,
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_ALTERNATIVE_2 = /^(.+)?\[(.+)\](\/[\d,]+)?$/,
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_RULE = /^(.+)>(.+)$/,
	/**
	 * @constant
	 * @private
	 */
		SUFFIXES_BASE_INDEX;

	var themesSimplifications = [
		[1, PRONOMENAL_MARK],
		[2, PRONOMENAL_MARK_IMPERATIVE],
/*[3, INTERROGATIVE_MARK_1],
[3, INTERROGATIVE_MARK_1_1],
[3, INTERROGATIVE_MARK_1_2],
[3, INTERROGATIVE_MARK_2S],
[3, INTERROGATIVE_MARK_2P],
[3, INTERROGATIVE_MARK_3],*/
		[4, FINAL_CONSONANT_VOICING],
		[5, 'e', 'i'],
		[6, 'a', 'e\/5'],
//		[7, 'o\/4', 'a\/6'],
		[7, 'o', 'a\/6'],
		[8, '', 'e', 'se'],
		[9, '', 'e'],
		[10, '', 'se'],
		[11, '', 'de', 'ge']//,
//		[12, '[lx]?>go', '[lx]?>ga', '[lx]?>gi'],
//		[12, 'e', 'a', 'o\/4', '([^i])>$1i', '[ei]>\/4', '\/4'],
	];
	var logsSimplifications = [
//		[12, {replaced: 0, replacement: '\/15,1'}, {replaced: 0, replacement: 'emo\/17'}, {replaced: 'ar', replacement: 'en\/24,8'}, {replaced: 'r', replacement: 'nte\/20'}, {replaced: 'ar', replacement: 'on\/25,9'}, {replaced: 'ar', replacement: 'à\/19'}, {replaced: 'ar', replacement: 'àsimo\/16'}, {replaced: 'r', replacement: '\/22,2'}, {replaced: 'ar', replacement: 'è\/18'}, {replaced: 'r', replacement: 'o\/38,7,4'}],
//		[13, {replaced: 0, replacement: '\/15,1'}, {replaced: 0, replacement: 'emo\/17'}, {replaced: 'ir', replacement: 'en\/24,8'}, {replaced: 'ir', replacement: 'ente\/28'}, {replaced: 'ir', replacement: 'on\/25,9'}, {replaced: 'ir', replacement: 'í\/19'}, {replaced: 'ir', replacement: 'ísimo\/16'}, {replaced: 'r', replacement: '\/41,11'}],
//		[14, {replaced: 0, replacement: '\/15,1'}, {replaced: 0, replacement: 'emo\/17'}, {replaced: 'ir', replacement: 'en\/24,8'}, {replaced: 'ir', replacement: 'ente\/28'}, {replaced: 'ir', replacement: 'on\/25,9'}, {replaced: 'ir', replacement: 'í\/19'}, {replaced: 'ir', replacement: 'ísimo\/16'}, {replaced: 'r', replacement: '\/41,11,22'}, {replaced: 'ir', replacement: 'e\/21,12'}]
	];



	/**
	 * @param {List} List of verbs generated using Verb
	 */
	var generate = function(verbs){
		var dialect = new Dialect(),
			paradigmEndings = [],
			infinitives = {},
			infinitive, themes,
			commonThemes,
			paradigmEndings,
			expandedList,
			i;
		verbs.forEach(function(verb){
			infinitive = Word.unmarkDefaultStress(verb.infinitive);
			if(!infinitives[infinitive]){
				themes = Themizer.generate(verb, dialect);

				infinitives[infinitive] = themes;
				verb.infinitive = infinitive;

				generateRegularEndingsForSingleVerb(verb, themes, paradigmEndings);
				generateIrregularEndingsForSingleVerb(verb, themes, paradigmEndings);
			}
		});

		commonThemes = extractCommonThemes(paradigmEndings);

		paradigmEndings = compactEndings(paradigmEndings);

		expandedList = constraintToInfinitivesParadigm(paradigmEndings, infinitives);


console.log(paradigmEndings);
console.log(commonThemes);

		printThemesSimplifications(themesSimplifications);
		i = printLogsSimplifications(logsSimplifications);
i = 12;
		SUFFIXES_BASE_INDEX = i;

		i = printThemes(commonThemes, i);

		i = print(paradigmEndings, commonThemes, infinitives, i);

		print(expandedList, commonThemes, infinitives, i, true);
	};

	/** @private */
	var generateRegularEndingsForSingleVerb = function(verb, themes, paradigmEndings){
		if(verb.irregular)
			return;

		this.verb = verb;
		this.themes = themes;
		this.paradigm = paradigmEndings;

		var reg = this.themes[REGULAR],
			conj = getIrregularVerbConjugation.call(this, REGULAR);

		generateIndicativePresent.call(this, REGULAR, reg, conj);
		generateInfinitiveSimple.call(this, reg);
		if(!this.verb.irregularity.poder)
			generateImperativePresent.call(this, reg, conj);
		generateParticipleImperfect.call(this, reg);
		generateParticiplePerfect.call(this, reg);
		if(!this.verb.irregularity.eser){
			generateIndicativeImperfect.call(this, reg);
			generateIndicativeFuture.call(this, reg);
			generateSubjunctiveImperfect.call(this, reg);
			generateConditionalSimple.call(this, reg);
		}
		//ensure syncope does not occurs
		if(!this.verb.irregularity.verb.match(/dever|eser|s?aver/))
			generateSubjunctivePresent.call(this, REGULAR, reg, conj);
		generateGerundSimple.call(this, reg);
	};

	/** @private */
	var generateIrregularEndingsForSingleVerb = function(verb, themes, paradigmEndings){
		if(!verb.irregular)
			return;

		this.verb = verb;
		this.themes = themes;
		this.paradigm = paradigmEndings;

		var irr = this.themes[IRREGULAR],
			conj = getIrregularVerbConjugation.call(this, IRREGULAR);

		generateIndicativePresent.call(this, IRREGULAR, irr, conj);
		generateInfinitiveSimple.call(this, irr);
		if(!this.verb.irregularity.poder)
			generateImperativePresent.call(this, irr, conj);
		generateParticipleImperfect.call(this, irr);
		generateParticiplePerfect.call(this, irr);
		generateParticiplePerfect_strong.call(this);
		if(!this.verb.irregularity.eser)
			generateGerundSimple.call(this, irr);
		//ensure syncope does not occurs
		if(!this.verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
			generateIndicativeImperfect.call(this, irr);
		generateIndicativeFuture.call(this, irr);
		generateSubjunctivePresent.call(this, IRREGULAR, irr, conj);
		generateSubjunctiveImperfect.call(this, irr);
		generateConditionalSimple.call(this, irr);
	};

	/** @private */
	var extractCommonThemes = function(list){
		var commonThemes = [],
			idx;
		list.forEach(function(obj){
			obj.themes.forEach(function(theme, i){
				idx = ArrayHelper.findIndex(commonThemes, function(el){ return ArrayHelper.equals(theme, el); });
				if(idx < 0){
					commonThemes.push(theme);
					idx = commonThemes.length - 1;
				}
				obj.themes[i] = idx;
			});
		});

		commonThemes = commonThemes.map(expandForms);
		commonThemes.forEach(function(sublist){
			themesSimplifications.forEach(function(array){
				simplifyThemes(sublist, array.slice(0));
			});
		});
		return commonThemes;
	};

	/** @private */
	var simplifyThemes = function(list, replacement){
		var flag = replacement.shift(),
			matcher = replacement.shift();
		if(matcher == PRONOMENAL_MARK || matcher == PRONOMENAL_MARK_IMPERATIVE || matcher == FINAL_CONSONANT_VOICING){
			matcher = new RegExp(escapeRegExp(matcher) + '$');
			list.forEach(function(el){
				el.replacement = el.replacement.replace(matcher, '/' + flag);
			});
		}
		else{
			var i, el, base, indices, matcher2;
			matcher = new RegExp(matcher + '([' + PRONOMENAL_MARK + PRONOMENAL_MARK_IMPERATIVE + FINAL_CONSONANT_VOICING + ']+|\/[\\d,]+)?$');
			for(i = list.length - 1; i >= 0; i --){
				el = list[i];
				if(el.replacement.match(matcher)){
					base = el.replacement.replace(matcher, '');

					indices = replacement.map(function(last){
						matcher2 = new RegExp('^' + escapeRegExp(base + last) + '$');
						return ArrayHelper.findIndex(list, function(el){ return el.replacement.match(matcher2); });
					});
					if(indices.some(function(el){ return (el < 0); }))
						continue;

					//here, all replacements are found, substitute them

					el.replacement = addFlag(el.replacement, flag);

					//remove replaced items
					i = removeIndices(list, indices, i);
				}
			}
		}
	};

	/** @private */
	var addFlag = function(replacement, flag){
		return (replacement.indexOf('/') >= 0? replacement.replace(/(?:\/(.+))?$/, '/' + flag + ',$1'): replacement + '/' + flag);
	};

	/** @private */
	var removeIndices = function(list, indices, baseIndex){
		var i, j;
		for(i = indices.length - 1; i >= 0; i --){
			list.splice(indices[i], 1);

			for(j = i - 1; j >= 0; j --)
				if(indices[j] > indices[i])
					indices[j] --;
			if(indices[i] < baseIndex)
				baseIndex --;
		}
		return baseIndex;
	};

	/** @private */
	var compactEndings = function(list){
		var compacted = [],
			data;
		for(var i = list.length - 1; i >= 0; i --){
			data = {infinitives: [list[i].infinitive], themes: list[i].themes};

			//search list for equal themes
			for(var j = i - 1; j >= 0; j --)
				if(ArrayHelper.equals(list[j].themes, data.themes)){
					data.infinitives.push(list[j].infinitive);

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
	var constraintToInfinitivesParadigm = function(list, infinitives){
		var expandedList = [],
			i, obj, diff, variability, common, re, found, part, partitioningResults, parents,
			listNoPrefixes;
		infinitives = Object.keys(infinitives);
		for(i = list.length - 1; i >= 0; i --){
			obj = list[i];
			diff = ArrayHelper.difference(infinitives, obj.infinitives);

			common = extractCommonPartFromList(obj.infinitives);
			variability = '';
			re = new RegExp(common + '$');
			found = diff.some(function(el){ return el.match(re); });

			if(found && obj.infinitives.indexOf(common) < 0){
				variability = listToRegExp(extractVariability(common.length, 1, obj.infinitives));
				re = new RegExp(variability + common + '$');
				found = diff.some(function(el){ return el.match(re); });
			}

			if(found && obj.infinitives.length > 1){
				part = ArrayHelper.partition(obj.infinitives, function(el){ return (el.length - common.length >= 1? el[el.length - common.length - 1]: '^'); });
				variability = listToRegExp(extractVariability(common.length + 1, 1, obj.infinitives));
				partitioningResults = {true: [], false: []};
				Object.keys(part).forEach(function(k){
					re = new RegExp((k != '^'? variability + k: k) + common + '$');
					partitioningResults[diff.some(function(el){ return el.match(re); })].push(k);
				});
				if(partitioningResults[false].length){
					if(partitioningResults[true].length){
						parents = {true: [], false: []};
						[true, false].forEach(function(side){
							partitioningResults[side].forEach(function(chr){
								parents[side] = parents[side].concat(part[chr]);
							});
						});

						obj.matcher = listToRegExp(partitioningResults[false]) + common;
						obj.infinitives = parents[false];


						obj = {infinitives: parents[true], themes: obj.themes};
						list.splice(i, 0, obj);
						if(obj.infinitives.indexOf(common) < 0){
							diff = ArrayHelper.difference(infinitives, obj.infinitives);
							variability = listToRegExp(partitioningResults[true]);
							re = new RegExp(variability + common + '$');
							found = diff.some(function(el){ return el.match(re); });
						}
					}
					else{
						variability = listToRegExp(partitioningResults[false]);

						found = false;
					}
				}
			}


			if(found){
				console.log('!! cannot split up the verbs array, manually extract each of them');

				listNoPrefixes = uniqueNoPrefixes(obj.infinitives);
				listNoPrefixes.forEach(function(el){
					re = new RegExp(el + '$');
					expandedList.push({matcher: START_OF_WORD + el, infinitives: listNoPrefixes.filter(function(obj){ return obj.match(re); }), themes: obj.themes});
				});

				list.splice(i, 1);
			}
			else
				obj.matcher = variability + common;
		}
		return expandedList;
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
	var uniqueNoPrefixes = function(list){
		return list.filter(function(x){
			for(var i = 0, len = list.length; i < len; i ++)
				if(x.indexOf(list[i]) > 0)
					return false;
			return true;
		});
	};

	/** @private */
	var printThemesSimplifications = function(list){
		var logs, previousFlag, flag, base;
		list.forEach(function(sublist){
			logs = [];
			flag = sublist.shift();

			//skip same-flag simplification
			if(flag == previousFlag){
				sublist.unshift(flag);
				return;
			}

			base = sublist.shift();
			switch(base){
				case PRONOMENAL_MARK:
					storeSuffix(logs, flag, '.', 'bla');
					break;

				case PRONOMENAL_MARK_IMPERATIVE:
					storeSuffix(logs, flag, '.', 'bla');
					break;

				/*case INTERROGATIVE_MARK:
					storeSuffix(logs, flag, '.', 'nte/5');
					storeSuffix(logs, flag, '.', 'ne/5');
					storeSuffix(logs, flag, 0, 'nte/5');
					storeSuffix(logs, flag, 0, 'ne/5');
					storeSuffix(logs, flag, 0, 'e/5');
					storeSuffix(logs, flag, 0, 'mi');

					storeSuffix(logs, flag, 0, 'stu');
					storeSuffix(logs, flag, 0, 'tu');
					storeSuffix(logs, flag, 0, 'to');

					storeSuffix(logs, flag, 0, 'u');
					storeSuffix(logs, flag, 0, 'o');

					storeSuffix(logs, flag, 0, 'lo/7');
					storeSuffix(logs, flag, '.', 'elo/7');

					printSuffixes(logs, flag, 'interrogative');
					break;*/

				case FINAL_CONSONANT_VOICING:
					storeSuffix(logs, flag, 'ñ.', 'n', null, 'ñ[oei]');
					storeSuffix(logs, flag, 'ñ.', 'nc', null, 'ñ[oei]');
					storeSuffix(logs, flag, 'ñ.', 'in', null, 'ñ[oei]');
					storeSuffix(logs, flag, 'b.', 'p', null, 'b[oei]');
					storeSuffix(logs, flag, 'd.', 't', null, 'd[oei]');
					storeSuffix(logs, flag, 'g.', 'k', null, 'g[oei]');
					storeSuffix(logs, flag, 'v.', 'f', null, 'v[oei]');
					storeSuffix(logs, flag, 'đ.', 'ŧ', null, 'đ[oei]');
					storeSuffix(logs, flag, 'x.', 's', null, 'x[oei]');
					storeSuffix(logs, flag, 'ɉ.', 'c', null, 'ɉ[oei]');
					storeSuffix(logs, flag, 'm.', 'n', null, 'm[oei]');

					printSuffixes(logs, flag, {replaced: 0, replacement: 'final consonant voicing'});
					break;

				default:
					sublist.forEach(function(el){
						storeSuffix(logs, flag, base.replace(/\/.+$/, ''), el);
					});
					printSuffixes(logs, flag, {replaced: 0, replacement: base});
			}
			sublist.unshift(base);
			sublist.unshift(flag);

			previousFlag = flag;
		});
	};

	/** @private */
	var printLogsSimplifications = function(list){
		var logs, previousFlag, flag, base;
		list.forEach(function(sublist){
			logs = [];
			flag = sublist.shift();

			//skip same-flag simplification
			if(flag == previousFlag)
				return;

			base = sublist.shift();
			sublist.forEach(function(el){
				storeSuffix(logs, flag, el.replaced, el.replacement);
			});
			sublist.unshift(base);
			sublist.unshift(flag);

			printSuffixes(logs, flag, base);

			previousFlag = flag;
		});
		return flag + 1;
	};

	/** @private */
	var printThemes = function(list, i){
		var j, len,
			base, logs, m, repment, flags;
		list.forEach(function(sublist){
			len = sublist.length;
			for(j = 0; j < len; j ++){
				base = sublist.shift();
				if(base.replaced == 0 && !base.replacement.match(/[>/]/))
					break;

				if(j < len - 1){
					//undo previous shift
					sublist.push(base);
					base = sublist.shift();
				}
			}

			logs = [];

			m = base.replacement.match(/^\(?\[(.+)\]\)?>(.+)$/);
			if(m){
				base.replacement = '';
				repment = m[2].replace(/\$\d/, '');
				m[1].split('').forEach(function(obj){
					storeSuffix(logs, i, obj, repment);
				});
			}

			sublist.forEach(function(el){
				//find the correct index of each parent
				flags = (sublist.parents? sublist.parents.map(function(obj){ return obj + SUFFIXES_BASE_INDEX; }): []);

				storeSuffix(logs, i, (el.replaced != 0? el.replaced.replace(/\[.+?\]/g, '.'): base.replacement), el.replacement, flags, el.constraint);
			});
			sublist.unshift(base);

			printSuffixes(logs, i, base);

			i ++;
		});
		return i;
	};

	/** @private */
	var print = function(list, commonThemes, infinitives, i, isExpandedList){
		var logs = [],
			parts, k, th, themes, fromTo, matcher, repment;
		list.forEach(function(el){
			if(!isExpandedList)
				logs = [];
			el.themes.forEach(function(idx, theme){
				fromTo = [];
				th = 'themeT' + theme;
				el.infinitives.forEach(function(inf){
					themes = infinitives[inf];
//case: sorbir-sorb(ís)
//if(themes[REGULAR][th] && themes[REGULAR][th].indexOf('(') >= 0)
//	console.log('ads');

//FIXME
//what if fromTo.infinitive does not span all of the infinitives?
					parts = extractCommonPartsFromStart(inf, themes[REGULAR][th] || themes[IRREGULAR][th]);
					k = ArrayHelper.findIndex(fromTo, function(el){ return (el.from == parts.a && el.to == parts.b); });
					if(k < 0)
						fromTo.push({from: parts.a, to: parts.b, infinitive: inf});
					else
						fromTo[k].infinitive = extractCommonPartFromEnd(inf, fromTo[k].infinitive);
				});

				fromTo.forEach(function(ft){
					matcher = new RegExp(ft.infinitive + '$');
					repment = applySuffix(ft.to, commonThemes[idx][0]);

					expandForms(repment).forEach(function(rm){
						rm = rm.replacement;
						if(rm.length > 2)
							rm = Word.unmarkDefaultStress(rm);

						storeSuffix(logs, i, ft.from, rm, idx + SUFFIXES_BASE_INDEX, (el.matcher.match(matcher)? el.matcher: ft.from), el.infinitives.filter(function(obj){ return obj.match(matcher); }));
					});
				});
			});

			if(!isExpandedList && (logs.length > 1 || logs.length == 1 && logs[0].match(/^SFX \d+ Y 0 # .+\/.+$/))){
				printSuffixes(logs, i);

				i ++;
			}
		});

		if(isExpandedList)
			printSuffixes(logs, i);

		return i;
	};


	/** @private */
	var applySuffix = function(word, suffix){
		return (suffix.replaced == 0? word + suffix.replacement: word.replace(new RegExp(suffix.replaced + '$'), suffix.replacement));
	};

	/** @private */
	var storeSuffix = function(logs, i, replaced, replacement, flags, constraint, parents){
		if(Array.isArray(flags))
			flags = flags.join(',');
		if(!replaced)
			replaced = 0;
		if(flags)
			replacement = (replacement.indexOf('/') >= 0? replacement.replace(/(?:\/(.+))?$/, '/' + flags + ',$1'): replacement + '/' + flags);

		if(replaced != 0){
			var parts = extractCommonPartsFromStart(replaced, replacement, true);
			replaced = parts.a;
			replacement = parts.b;

			if(replaced == 'r' && replacement[0] == 'r'){
				replaced = 0;
				replacement = replacement.substr(1);
			}
		}
		replacement += (constraint? ' ' + constraint: (replaced != 0? ' ' + replaced: ''));

		var line = 'SFX ' + i + ' ' + replaced + ' ' + replacement + (parents? ' # ' + parents.join(','): '');
		if(logs.indexOf(line) < 0){
			var matcher = new RegExp('^' + escapeRegExp(line).replace(/\/[\d,]+/, '/([\\d,]+)') + '$'),
				idx = ArrayHelper.findIndex(logs, function(el){ return (m = el.match(matcher)); }),
				m, m2;
			if(idx >= 0){
				if(m[1]){
					m2 = replacement.match(/\/([\d,]+)/);
					m2 = (m2[1]? ArrayHelper.difference(m2[1].split(','), m[1].split(',')).join(','): '');
				}
				else
					m2 = [];

				if(m2.length)
					logs[idx] = logs[idx].replace(/\/[\d,]+/, '$&,' + m2);
			}
			else
				logs.push(line);
		}
	};

	/** @private */
	var printSuffixes = function(logs, i, base){
//		simplifyLogs(logs, logsSimplifications);

if(base != undefined && base.replaced != 0)
	console.log('asd');
		console.log('SFX ' + i + ' Y ' + logs.length + (base != undefined? ' # ' + (ObjectHelper.isObject(base)? base.replacement/*.replace(/\/[\d,]+/, '')*/: base): ''));
		logs.sort().forEach(function(log){
			console.log(log);
		});
	};

	/** @private */
	var simplifyLogs = function(list, replacements){
		var flag, indices, line;
		replacements.forEach(function(replacement){
			flag = replacement.shift();
			indices = replacement.map(function(last){
				return ArrayHelper.findIndex(list, function(el){
					return el.match(new RegExp('^SFX \\d+ ' + last[0] + ' ' + last[1] + ' '));
				});
			});
			replacement.unshift(flag);
			if(indices.every(function(el){ return (el >= 0); })){
				//here, all replacements are found, substitute them

				line = list[0];

				//remove replaced items
				removeIndices(list, indices, 0);

				list.push(line.indexOf('/') >= 0? line.replace(/(?:\/(.+))?$/, '/' + flag + ',$1'): line + '/' + flag);
			}
		});
	};

	var expandForms = (function(){
		var expander = function(form, forms){
			var m = form.match(/^(.+)>(.+)$/),
				replaced, replacement;
			if(m){
				replaced = splitter(m[1]);
				replacement = splitter(m[2]);

				replaced.forEach(function(rep){
					if(rep == '')
						rep = 0;

					replacement.forEach(function(repment){
						if(repment.match(/\$\d+/)){
							repment = repment.replace(/\$\d+/, '');
							m = rep.match(/^\(\[(\^)?(.+)\]\)$/);
							if(m && m[1]){
								//case '([^i])'
								add(forms, 0, repment, m[0].replace(/^\(|\)$/g, ''));
								rep = undefined;
							}
							else if(m){
								//case '([ei])'
								m[2].split('').forEach(function(r){
									add(forms, r, r + repment, r);
								});
								rep = undefined;
							}
							else
								rep = rep.replace(/^\(|\)$/g, '');
						}

						if(rep)
							add(forms, rep.replace(/\[.+?\]/g, ''), repment, rep);
					});
				});
			}
			else
				splitter(form).forEach(function(repment){
					add(forms, 0, repment);
				});

			return forms;
		};

		var splitter = function(subform){
			var subforms = [],
				m = subform.match(/^([^\(\)\[\]]+)?\(?\[(\^)?(.+)\]\)?(\?)?(\/[\d,]+)?$/),
				m2;
			if(m){
				if(!m[5])
					m[5] = '';
				if(m[1] && m[1].match(/^\(.+\)$/)){
					//cases '(g)[ai]', '(g)[ai]?'
					m[1] = m[1].replace(/^\(|\)$/g, '');
					m[3].split('').forEach(function(el){
						subforms.push(el + m[5]);
						subforms.push(m[1] + el + m[5]);
					});
					if(m[3])
						subforms.push(m[1] + m[5]);
				}
				else if(m[2])
					//case '([^i])'
					subforms.push(subform);
				else{
					//cases 'g[lx]?' and 'g[ei]'
					m[3].split('').forEach(function(el){
						subforms.push((m[1]? m[1]: '') + el + m[5]);
					});
					if(m[4])
						subforms.push((m[1]? m[1]: '') + m[5]);
				}
			}
			else{
				m = subform.match(/^(.*?)\(([^\[\]]+?)\)(.*)$/);
				if(m){
					subforms = subforms.concat(splitter(m[1] + m[3]));

					m2 = m[2].match(/^(.+)\/(.+)$/);
					if(m2){
						//case 'ie(de/ge)'
						subforms = subforms.concat(splitter(m[1] + m2[1] + m[3]));
						subforms = subforms.concat(splitter(m[1] + m2[2] + m[3]));
					}
					else
						//case '(i)on(se)'
						subforms = subforms.concat(splitter(m[1] + m[2] + m[3]));
				}
				else{
					m = subform.match(/^(.*)\((.+)\/([\d,]+)\)(.*)$/);
					if(m){
						//case 'e(de/ge)'
						subforms.push(m[1] + m[2] + m[4]);
						subforms.push(m[1] + m[3] + m[4]);
					}
					else{
						m = subform.match(/^(.+)\?(.+)$/);
						if(m){
							//case 'i?é'
							if(m[1])
								subforms.push('[^' + m[1] + ']' + m[2]);
							subforms.push(m[1] + m[2]);
						}
						else
							//case 'ron'
							subforms.push(subform);
					}
				}
			}
			return subforms;
		};

		var add = function(forms, replaced, replacement, constraint){
			if(ArrayHelper.findIndex(forms, function(el){ return (el.replaced == replaced && el.replacement == replacement && el.constraint == constraint); }) < 0)
				forms.push({replaced: replaced, replacement: replacement, constraint: constraint});
		};

		return function(forms){
			var list = [];
			[].concat(forms).forEach(function(el){
				expander(el, list);
			});
			return list;
		};
	})();

	/** @private */
	var extractVariability = function(formLength, order, list){
		var variability = [],
			idx;
		list.forEach(function(obj){
			idx = obj.length - formLength - order;
			if(idx >= 0)
				variability.push(obj.substr(idx, order));
		});
		return ArrayHelper.unique(variability).sort();
	};

	/** @private */
	var listToRegExp = function(list){
		if(!list.length)
			return '';
		if(list.length == 1)
			return list[0];
		list.sort();
		return (list[list.length - 1].length == 1? '[' + list.join('') + ']': '(' + list.join('|') + ')');
	};

	/**
	 * Escape regexp reserved characters
	 *
	 * @private
	 *
	 * @param {String} word
	 * @returns {String}
	 */
	var escapeRegExp = function(word){
		return word.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	};

	/** @private */
	var generateIndicativePresent = function(type, t, conj){
		if(t.themeT12 || t.themeT5 || t.themeT8 || t.themeT10){
			if(t.themeT8){
				if(this.verb.irregularity.eser){
					insert.call(this, 8, (!t.themeT8.match(/[cijɉñ]$/)? '(i)': '') + 'on');
//					insert.call(this, 8, (!t.themeT8.match(/[cijɉñ]$/)? '(i)': '') + 'on' + INTERROGATIVE_MARK_1);
//					insert.call(this, 8, (!t.themeT8.match(/[cijɉñ]$/)? '(i)': '') + 'on' + INTERROGATIVE_MARK_1_2);
				}
				else if(this.verb.irregularity.aver){
					insert.call(this, 8, '[à]>[èò]');
//					insert.call(this, 8, '[à]>[èò]' + INTERROGATIVE_MARK_1_1);
//					insert.call(this, 8, '[à]>[èò]' + INTERROGATIVE_MARK_1_2);
//					insert.call(this, 8, '[à]>[èò]' + INTERROGATIVE_MARK_1);
				}
				else{
					insert.call(this, 8, 'e');
//					insert.call(this, 8, 'e' + INTERROGATIVE_MARK_1_1);
//					insert.call(this, 8, 'é' + INTERROGATIVE_MARK_1_2);
//					insert.call(this, 8, 'e' + INTERROGATIVE_MARK_1);
					insert.call(this, 8, 'o' + FINAL_CONSONANT_VOICING);
//					insert.call(this, 8, 'o' + INTERROGATIVE_MARK_1_1);
//					insert.call(this, 8, 'ó' + INTERROGATIVE_MARK_1_2);
//					insert.call(this, 8, 'o' + INTERROGATIVE_MARK_1);

					if(this.verb.irregularity.verb && type == IRREGULAR){
						if(this.verb.irregularity.saver){
							insert.call(this, 8, '[à]>ò');
//							insert.call(this, 8, '[à]>ò' + INTERROGATIVE_MARK_1_1);
//							insert.call(this, 8, '[à]>ò' + INTERROGATIVE_MARK_1_2);
//							insert.call(this, 8, '[à]>ò' + INTERROGATIVE_MARK_1);
						}
						else{
							insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o');
//							insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o' + INTERROGATIVE_MARK_1_1);
//							insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'ó' + INTERROGATIVE_MARK_1_2);
//							insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o' + INTERROGATIVE_MARK_1);
						}
					}
				}
				if(!this.verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.themeT8.match(/à$/)){
					insert.call(this, 8, '([^i])>$1i');
//					insert.call(this, 8, '([^i])>$1i' + INTERROGATIVE_MARK_2S);
				}
				else{
					insert.call(this, 8, '([^i])>$1');
//					insert.call(this, 8, '([^i])>$1' + INTERROGATIVE_MARK_2S);
				}
				var third = t.themeT8 + (!this.verb.irregularity.verb.match(/darStarFar|s?aver/)? (this.verb.irregularity.eser? 'é': 'e'): '');
				insert.call(this, 8, third.substr(t.themeT8.length) + FINAL_CONSONANT_VOICING);
//				insert.call(this, 8, third.substr(t.themeT8.length) + INTERROGATIVE_MARK_3);
				if(t.themeT10 && t.themeT10 !== third){
					//FIXME
					//if(this.verb.irregularity.eser)
					//	insert.call(this, 10, '(x)|([ei])>$1' + INTERROGATIVE_MARK);
					insert.call(this, 10, '([ei])>($1)');
//					insert.call(this, 10, '([ei])>($1)' + INTERROGATIVE_MARK_3);
				}
			}
			else if(t.themeT10){
				insert.call(this, 10, '');
//				insert.call(this, 10, INTERROGATIVE_MARK_3);
				if(t.themeT10 != PhonologyHelper.finalConsonantVoicing(t.themeT10.replace(/[ae]$/, ''), 'northern'))
					insert.call(this, 10, FINAL_CONSONANT_VOICING);
			}
			if(t.themeT5){
				insert.call(this, 5, '');
//				insert.call(this, 5, INTERROGATIVE_MARK_2P);
				if(conj == 2){
					insert.call(this, 12, 'é');
//					insert.call(this, 12, 'é' + INTERROGATIVE_MARK_2P);
				}
				else{
					insert.call(this, 5, 'i?é>í');
//					insert.call(this, 5, 'i?é>í' + INTERROGATIVE_MARK_2P);
				}
			}
			if(t.themeT12 || t.themeT5){
				if(t.themeT12){
					insert.call(this, 12, 'on');
//					insert.call(this, 12, 'on' + INTERROGATIVE_MARK_1_2);
//					insert.call(this, 12, 'on' + INTERROGATIVE_MARK_1);
					insert.call(this, 12, 'en');
//					insert.call(this, 12, 'en' + INTERROGATIVE_MARK_1_2);
//					insert.call(this, 12, 'en' + INTERROGATIVE_MARK_1);
				}
				if(t.themeT5){
					insert.call(this, 5, '[è]>emo');
//					insert.call(this, 5, '[è]>émo' + INTERROGATIVE_MARK_1_2);
//					insert.call(this, 5, '[è]>emo' + INTERROGATIVE_MARK_1);
					if(conj == 2){
						insert.call(this, 5, 'i?é>imo');
//						insert.call(this, 5, 'i?é>ímo' + INTERROGATIVE_MARK_1_2);
//						insert.call(this, 5, 'i?é>imo' + INTERROGATIVE_MARK_1);
					}
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/)){
				insert.call(this, 8, '[lx]?>go');
//				insert.call(this, 8, '[lx]?>gó' + INTERROGATIVE_MARK_1_2);
			}
		}
	};

	/** @private */
	var generateIndicativeImperfect = function(t){
		if(t.themeT2 || t.themeT11){
			if(t.themeT2){
				var tmp = (this.verb.irregularity.eser? 'r': '(v)');
				insert.call(this, 2, tmp + '[oaie]');
//				insert.call(this, 2, tmp + '[oe]' + INTERROGATIVE_MARK_1_1);
//				insert.call(this, 2, tmp + '[oe]');
//				insert.call(this, 2, tmp + 'i');
//				insert.call(this, 2, tmp + 'i' + INTERROGATIVE_MARK_2S);
//				insert.call(this, 2, tmp + 'í' + INTERROGATIVE_MARK_2P);
//				insert.call(this, 2, tmp + 'a' + INTERROGATIVE_MARK_1_1);
//				insert.call(this, 2, tmp + 'à' + INTERROGATIVE_MARK_1_2);
//				insert.call(this, 2, tmp + 'a' + INTERROGATIVE_MARK_3);
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 2, '[x/j]|' + tmp + '[oai]' + INTERROGATIVE_MARK);

				insert.call(this, 2, tmp + 'imo');
//				insert.call(this, 2, tmp + 'ímo' + INTERROGATIVE_MARK_1_2);
//				insert.call(this, 2, tmp + 'imo' + INTERROGATIVE_MARK_1);
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 2, '[x/j]|' + tmp + 'imo' + INTERROGATIVE_MARK);
			}
			if(t.themeT11){
				insert.call(this, 11, '(iv)ié');
//				insert.call(this, 11, '(iv)ié' + INTERROGATIVE_MARK_2P);
				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(se)');
//				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on' + INTERROGATIVE_MARK_1_2);
//				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on' + INTERROGATIVE_MARK_1);
				insert.call(this, 11, 'iv(i)on(se)');
//				insert.call(this, 11, 'iv(i)on' + INTERROGATIVE_MARK_1_2);
//				insert.call(this, 11, 'iv(i)on' + INTERROGATIVE_MARK_1);
				insert.call(this, 11, '(iv)en(se)');
//				insert.call(this, 11, '(iv)en' + INTERROGATIVE_MARK_1_2);
//				insert.call(this, 11, '(iv)en' + INTERROGATIVE_MARK_1);
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 11, '[x/j]|(iv)en(se)' + INTERROGATIVE_MARK);
			}
		}
	};

	/** @private */
	var generateIndicativeFuture = function(t){
		if(t.themeT4){
			insert.call(this, 4, 'ron');
//			insert.call(this, 4, 'ron' + INTERROGATIVE_MARK_1_2);
//			insert.call(this, 4, 'ron' + INTERROGATIVE_MARK_1);
			insert.call(this, 4, 'r[òàèé]');
//			insert.call(this, 4, 'r[òàè]' + INTERROGATIVE_MARK_1_1);
//			insert.call(this, 4, 'r[òàè]' + INTERROGATIVE_MARK_1_2);
//			insert.call(this, 4, 'r[òàè]' + INTERROGATIVE_MARK_1);
//			insert.call(this, 4, 'ra' + INTERROGATIVE_MARK_2S);
//			insert.call(this, 4, 'ra' + INTERROGATIVE_MARK_3);
//			insert.call(this, 4, 'ré' + INTERROGATIVE_MARK_2P);
			insert.call(this, 4, 'remo');
//			insert.call(this, 4, 'rémo' + INTERROGATIVE_MARK_1_2);
//			insert.call(this, 4, 'remo' + INTERROGATIVE_MARK_1);
			insert.call(this, 4, 'ren');
//			insert.call(this, 4, 'ren' + INTERROGATIVE_MARK_1_2);
			if(this.verb.conjugation == 2){
				insert.call(this, 4, 'rí');
//				insert.call(this, 4, 'rí' + INTERROGATIVE_MARK_2P);
				insert.call(this, 4, 'rimo');
//				insert.call(this, 4, 'rímo' + INTERROGATIVE_MARK_1_2);
//				insert.call(this, 4, 'rimo' + INTERROGATIVE_MARK_1);
			}
		}
	};

	/** @private */
	var generateSubjunctivePresent = function(type, t, conj){
		t = t.subjunctive || t;

		if(t.themeT12 || t.themeT5 || t.themeT8){
			if(t.themeT8){
				insert.call(this, 8, '[ae]');
				insert.call(this, 8, '([^i])>$1i');
//				if(t.themeT8.match(/[^aeiouàèéíòóú]$/))
//					insert.call(this, 8, FINAL_CONSONANT_VOICING);

				if(type == IRREGULAR && !this.verb.irregularity.verb.match(/(aver|dever|eser)/)){
					if(t.themeT8.match(/[aeiouàèéíòóú]$/))
						insert.call(this, 8, '(g)[ai]');
					else{
						insert.call(this, 8, 'a');
						insert.call(this, 8, '([^i])>$1i');
					}
				}
			}
			if(t.themeT5){
				insert.call(this, 5, '');
				if(conj != 2)
					insert.call(this, 5, '[èí]>é');
				else if(t.themeT5.replace(/i?é$/, 'í') != t.themeT5)
					insert.call(this, 5, 'i?é>í');
				if(t.themeT12){
					insert.call(this, 12, (this.verb.special3rd? '(i)': '') + 'é');
					insert.call(this, 12, (this.verb.special3rd? '(i)': '') + 'e(de/ge)');
				}
				if(conj == 3 && !this.verb.special3rd)
					insert.call(this, 5, '(de/ge)');
			}
			if(t.themeT12 || t.themeT5){
				if(t.themeT12){
					insert.call(this, 12, (!t.themeT12.match(/[cijɉñ]$/)? '(i)': '') + 'on(e)');
					insert.call(this, 12, 'en(e)');
				}
				if(t.themeT5){
					insert.call(this, 5, '[è]>emo');
					if(conj == 2 && t.themeT5.replace(/i?é$/, 'í') != t.themeT5)
						insert.call(this, 5, 'i?é>imo');
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/))
				insert.call(this, 8, '[lx]?>g[ai]');
		}
	};

	/** @private */
	var generateSubjunctiveImperfect = function(t){
		t = t.subjunctive || t;

		if(t.themeT2 || t.themeT11){
			if(t.themeT2){
				insert.call(this, 2, 's[ei]');
				if(t.themeT11){
					insert.call(this, 11, '(is)ié');
					insert.call(this, 11, '(is)ie(de/ge)');
				}
			}
			if(t.themeT2)
				insert.call(this, 2, 'simo');
			if(t.themeT11){
				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(e/se)');
				insert.call(this, 11, 'is(i)on(e/se)');
				insert.call(this, 11, '(is)en(e/se)');
			}
		}
	};

	/** @private */
	var generateConditionalSimple = function(t){
		if(t.themeT4){
			insert.call(this, 4, 'rí[ae]');
//			insert.call(this, 4, 'rí[ae]' + INTERROGATIVE_MARK_1_1);
			insert.call(this, 4, 'resi');
//			insert.call(this, 4, 'rési' + INTERROGATIVE_MARK_2S);
//			insert.call(this, 4, 'rési' + INTERROGATIVE_MARK_2P);
			insert.call(this, 4, 'r(is)ié');
//			insert.call(this, 4, 'r(is)ié' + INTERROGATIVE_MARK_2P);
			insert.call(this, 4, 'résimo');
//			insert.call(this, 4, 'resimó' + INTERROGATIVE_MARK_1);
//			insert.call(this, 4, 'resimó' + INTERROGATIVE_MARK_1_2);
			insert.call(this, 4, 'r(is)(i)on(se)');
//			insert.call(this, 4, 'r(is)(i)on' + INTERROGATIVE_MARK_1_2);
			insert.call(this, 4, 'r(is)en(se)');
//			insert.call(this, 4, 'r(is)en' + INTERROGATIVE_MARK_1_2);
//			insert.call(this, 4, 'ríse' + INTERROGATIVE_MARK_3);
			//i únegi pronòmi interogativi enklítegi ke se dopara i xe kueli de 3a pars
			insert.call(this, 4, 'rave');
//			insert.call(this, 4, 'ràve' + INTERROGATIVE_MARK_3);
		}
	};

	/** @private */
	var generateImperativePresent = function(t, conj){
		if(t.themeT5 || t.themeT9){
			if(t.themeT9)
				insert.call(this, 9, PRONOMENAL_MARK_IMPERATIVE);
			if(t.themeT5){
				insert.call(this, 5, PRONOMENAL_MARK_IMPERATIVE);
				if(conj == 2)
					insert.call(this, 5, 'i?é>í' + PRONOMENAL_MARK_IMPERATIVE);
				else{
					insert.call(this, 5, '[èí]>é' + PRONOMENAL_MARK_IMPERATIVE);
				}
			}
		}
	};

	/** @private */
	var generateInfinitiveSimple = function(t){
		if(t.themeT1){
			var pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			insert.call(this, 1, 'r' + pronomenalMark);
			insert.call(this, 1, 're');
		}
	};

	/** @private */
	var generateParticipleImperfect = function(t){
		if(t.themeT7)
			insert.call(this, 7, 'nte');
	};

	/** @private */
	var generateParticiplePerfect = function(t){
		t = t.participlePerfect || t;

		if(t.themeT2 || t.themeT6 || t.themeT7){
			if(t.themeT6){
				insert.call(this, 6, '');
				insert.call(this, 6, '[oaie]');
				insert.call(this, 6, '[èé]>ed[oaie]');
				insert.call(this, 6, '[í]>id[oaie]');
			}
			if(t.themeT2)
				insert.call(this, 2, 'st[oaie]');
			if(t.themeT7 && this.verb.conjugation == 3)
				insert.call(this, 7, 'st[oaie]');
		}
	};

	/** @private */
	var generateParticiplePerfect_strong = function(){
		var t;
		[REGULAR, IRREGULAR].forEach(function(k){
			if(!t || !t.themeT8){
				t = this.themes[k];
				t = t.participlePerfect || t;
			}
		}, this);

		if(t.themeT8){
			var strong = generateParticiplePerfectStrong.call(this, t.themeT8);
			if(strong){
				insert.call(this, 8, WHOLE_WORD + Word.unmarkDefaultStress(strong + 'o') + FINAL_CONSONANT_VOICING);
				insert.call(this, 8, WHOLE_WORD + Word.unmarkDefaultStress(strong + 'i'));
				insert.call(this, 8, WHOLE_WORD + Word.unmarkDefaultStress(strong + 'a'));
				insert.call(this, 8, WHOLE_WORD + Word.unmarkDefaultStress(strong + 'e'));
			}
		}
	};

	/** @private */
	var generateGerundSimple = function(t){
		if(t.themeT2 || t.themeT7){
			var pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			if(t.themeT2)
				insert.call(this, 2, 'ndo' + pronomenalMark);
			if(t.themeT7 && this.verb.conjugation == 3)
				insert.call(this, 7, 'ndo' + pronomenalMark);
			if(this.verb.irregularity.eser)
				insert.call(this, 2, START_OF_WORD + 'siando' + pronomenalMark);
			else if(this.verb.irregularity.aver)
				insert.call(this, 2, START_OF_WORD + (this.verb.infinitive.substr(0, this.verb.infinitive.length - 'aver'.length)) + 'abiando' + pronomenalMark);
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
					//kuèrdh
					{matcher: /díx$/, replacement: 'dít'},
					{matcher: /dúx$/, replacement: 'dót'},
					{matcher: /đónx$/, replacement: 'đónt'},
					{matcher: /fríđ$/, replacement: 'frít'},
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /kòt$/, replacement: 'kòs'},
					{matcher: /kòx$/, replacement: 'kòt'},
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

		return function(themeT8){
			var data = strong[this.verb.conjugation - 1];
			if(this.verb.conjugation == 2)
				data = data[this.verb.rhizotonic? 0: 1];
			//FIXME
			//choose between T- and S-past-participle for 2nd conjugation verbs?
			//...

			var m, match;
			if(data.some(function(el){ m = el; match = this.match(el.matcher); return match; }, themeT8) && (!m.falsePositives || !themeT8.match(m.falsePositives))){
				if(Word.isStressed(m.replacement) && !Word.isStressed(match[0]))
					themeT8 = Word.suppressStress(themeT8);
				return themeT8.replace(m.matcher, m.replacement);
			}
			return undefined;
		};

	})();

	/** @private */
	var getIrregularVerbConjugation = function(type){
		return (type == IRREGULAR && this.verb.irregularity.traer? 1: this.verb.conjugation);
	};

	/** @private */
	var insert = function(theme, suffix){
		var infinitive = this.verb.infinitive;
		var idx = ArrayHelper.findIndex(this.paradigm, function(el){ return (el.infinitive == infinitive); });
		if(idx < 0){
			var data = {infinitive: this.verb.infinitive, themes: []};
			data.themes[theme] = [suffix];
			this.paradigm.push(data);
		}
		else{
			var t = this.paradigm[idx].themes;
			if(!t[theme])
				t[theme] = [suffix];
			else{
				var matcher = '[' + PRONOMENAL_MARK + PRONOMENAL_MARK_IMPERATIVE + FINAL_CONSONANT_VOICING + ']+$';
				if(t[theme].indexOf(suffix) < 0 && (suffix.match(new RegExp(matcher)) || ArrayHelper.findIndex(t[theme], function(el){ return el.match(new RegExp(escapeRegExp(suffix) + matcher)); }) < 0))
					t[theme].push(suffix);
			}
		}
	};


	/**
	 * @param {Verb} verb
	 *
	 * @private
	 */
	var applyStrongTheme = function(verb){
		if(verb.irregularity.aver){
			var morphemeProclitic = '(g)',
				morphemeEnclitic = '(ge)';
			visit(this, function(subParadigm, key){
				if(!key.match(/^(northern|oriental)/))
					subParadigm[key] = subParadigm[key]
						.replace(/^#(re)?/, '$1' + morphemeProclitic)
						.replace(/#$/, morphemeEnclitic);
			});
		}
	};

	/** @private */
	var visit = function(obj, funct, id){
		for(var key in obj)
			if(obj.hasOwnProperty(key)){
				if(!ObjectHelper.isString(obj[key]))
					visit(obj[key], funct, (id? id + '.' + key: key));
				else
					funct(obj, key, id);
			}
	};


	return {
		generate: generate
	};

});
