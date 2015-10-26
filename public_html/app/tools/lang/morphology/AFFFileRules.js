/**
 * @class AFFFileRules
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/Dialect', 'tools/lang/morphology/Verb', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/Orthography', 'tools/lang/phonology/PhonologyHelper', 'tools/data/ObjectHelper', 'tools/data/ArrayHelper'], function(Word, Dialect, Verb, Themizer, Orthography, PhonologyHelper, ObjectHelper, ArrayHelper){

	/** @constant */
	var START_OF_WORD = '^',
	/** @constant */
		WHOLE_WORD = '*',
	/** @constant */
		PRONOMENAL_MARK = '#',
	/** @constant */
		PRONOMENAL_MARK_IMPERATIVE = '!',
	/** @constant */
		INTERROGATIVE_MARK = '?',
	/** @constant */
		FINAL_CONSONANT_VOICING = '@';

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
		SPLITTER_REGEX_ALTERNATIVE_2 = /^(.+)?\[(.+)\]$/,
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_RULE = /^(.+)>(.+)$/,
	/**
	 * @constant
	 * @private
	 */
		SUFFIXES_BASE_INDEX = 13;



	/**
	 * @param {List} List of verbs generated using Verb
	 */
	var generate = function(verbs){
		var dialect = new Dialect(),
			paradigmEndings = [],
			infinitives = {},
			infinitive, themes, commonThemes, i;
		verbs.forEach(function(verb){
			infinitive = Word.unmarkDefaultStress(verb.infinitive);
			if(!infinitives[infinitive]){
				themes = Themizer.generate(verb, dialect);

				infinitives[infinitive] = themes;
				verb.infinitive = infinitive;

				generateEndingsForSingleVerb(verb, themes, paradigmEndings);
			}
		});

		commonThemes = extractCommonThemes(paradigmEndings);

		paradigmEndings = compactEndings(paradigmEndings);

		constraintToInfinitivesParadigm(paradigmEndings, infinitives);

console.log(paradigmEndings);
console.log(commonThemes);
		i = printThemes(commonThemes);
		print(paradigmEndings, commonThemes, infinitives, i);
	};

	/** @private */
	var generateEndingsForSingleVerb = function(verb, themes, paradigmEndings){
		this.verb = verb;
		this.themes = themes;
		this.paradigm = paradigmEndings;

		var reg = this.themes[REGULAR];
		var irr = this.themes[IRREGULAR];

		[REGULAR, IRREGULAR].forEach(function(type){
			var t = this.themes[type];

			generateIndicativePresent.call(this, type, t);
			generateInfinitiveSimple.call(this, type, t);
			if(!this.verb.irregularity.poder)
				generateImperativePresent.call(this, type, t);
			generateParticipleImperfect.call(this, type, t);
			generateParticiplePerfect.call(this, type, t);
		}, this);
		generateParticiplePerfect_strong.call(this);
		if(!this.verb.irregularity.eser){
			generateIndicativeImperfect.call(this, REGULAR, reg);
			generateIndicativeFuture.call(this, REGULAR, reg);
			generateSubjunctiveImperfect.call(this, REGULAR, reg);
			generateConditionalSimple.call(this, REGULAR, reg);
			generateGerundSimple.call(this, IRREGULAR, irr);
		}
		//ensure syncope does not occurs
		if(!this.verb.irregularity.verb.match(/dixer|poder|toler|voler|traer/))
			generateIndicativeImperfect.call(this, IRREGULAR, irr);
		generateIndicativeFuture.call(this, IRREGULAR, irr);
		//ensure syncope does not occurs
		if(!this.verb.irregularity.verb.match(/dever|eser|s?aver/))
			generateSubjunctivePresent.call(this, REGULAR, reg);
		generateSubjunctivePresent.call(this, IRREGULAR, irr);
		generateSubjunctiveImperfect.call(this, IRREGULAR, irr);
		generateConditionalSimple.call(this, IRREGULAR, irr);
		generateGerundSimple.call(this, REGULAR, reg);
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
		commonThemes.forEach(function(list){
			expandThemes(list);

			simplifyThemesAndApplyFlag(list, 1, PRONOMENAL_MARK);
			simplifyThemesAndApplyFlag(list, 2, PRONOMENAL_MARK_IMPERATIVE);
			simplifyThemesAndApplyFlag(list, 3, INTERROGATIVE_MARK);
			simplifyThemesAndApplyFlag(list, 4, FINAL_CONSONANT_VOICING);
			simplifyThemesAndApplyFlag(list, 5, 'e', 'i');
			simplifyThemesAndApplyFlag(list, 6, 'a', 'e\/5');
			simplifyThemesAndApplyFlag(list, 7, 'o', 'a\/6');
			simplifyThemesAndApplyFlag(list, 7, 'o\/4', 'a\/6');
			simplifyThemesAndApplyFlag(list, 8, '', 'e', 'se');
			simplifyThemesAndApplyFlag(list, 9, '', 'e');
			simplifyThemesAndApplyFlag(list, 10, '', 'se');
			simplifyThemesAndApplyFlag(list, 11, '', 'de', 'ge');
			simplifyThemesAndApplyFlag(list, 12, 'e', 'a', 'o\/4', '([^i])>$1i', '[ei]>/4', '\/4');
		});
		return commonThemes;
	};

	/** @private */
	var simplifyThemesAndApplyFlag = function(list, flag, matcher){
		if(matcher == PRONOMENAL_MARK || matcher == PRONOMENAL_MARK_IMPERATIVE || matcher == INTERROGATIVE_MARK || matcher == FINAL_CONSONANT_VOICING){
			//escape regexp reserved characters
			matcher = new RegExp(matcher.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '$');
			for(i = list.length - 1; i >= 0; i --)
				list[i] = list[i].replace(matcher, '/' + flag);
		}
		else{
			var replacement = Array.prototype.slice.call(arguments, 3, arguments.length),
				i, base, indices;
			matcher = new RegExp(matcher + '[' + PRONOMENAL_MARK + PRONOMENAL_MARK_IMPERATIVE + INTERROGATIVE_MARK + FINAL_CONSONANT_VOICING + ']*$');
			for(i = list.length - 1; i >= 0; i --)
				if(list[i].match(matcher)){
					base = list[i].replace(matcher, '')
						//escape regexp reserved characters
						.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

					indices = replacement.map(function(last){
						return ArrayHelper.findIndex(list, function(el){
							return el.match(new RegExp('^' + base
								//escape regexp reserved characters
								+ last.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '$'));
						});
					});
					if(indices.some(function(el){ return (el < 0); }))
						continue;

					//here, all replacements are found, substitute them

					list[i] = (list[i].indexOf('/') >= 0? list[i].replace(/(?:\/(.+))?$/, '/' + flag + ',$1'): list[i] + '/' + flag);

					//remove replaced items
					i = removeIndices(list, indices, i);
				}
		}
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
			i --;

			compacted.push(data);
		}
		return compacted;
	};

	/** @private */
	var constraintToInfinitivesParadigm = function(list, infinitives){
		var diff, variab, variability, common, re, found, part, partitioningResults, parentsTrue, parentsFalse,
			listNoPrefixes, first;
		infinitives = Object.keys(infinitives);
		list.forEach(function(obj){
			diff = ArrayHelper.difference(infinitives, obj.infinitives);

			common = extractCommonPartFromList(obj.infinitives);
			variability = '';
			re = new RegExp(common + '$');
			found = diff.some(function(el){ return el.match(re); });

			if(found && obj.infinitives.indexOf(common) < 0){
				variab = extractVariability(common.length, 1, obj.infinitives);
				variability = listToRegExp(variab);
				re = new RegExp(variability + common + '$');
				found = diff.some(function(el){ return el.match(re); });
			}

			if(found){
				if(obj.infinitives.length == 1){
					obj.matcher = '^' + obj.infinitives[0];

					return;
				}

				if(found){
					part = ArrayHelper.partition(obj.infinitives, function(el){ return (el.length - common.length >= 1? el[el.length - common.length - 1]: '^'); });
					if(!part['^']){
						variability = listToRegExp(extractVariability(common.length + 1, 1, obj.infinitives));
						if(variability.indexOf('.') < 0){
							partitioningResults = {'true': [], 'false': []};
							Object.keys(part).forEach(function(k){
								re = new RegExp(variability + k + common + '$');
								partitioningResults[diff.some(function(el){ return el.match(re); })].push(k);
							});
							if(partitioningResults[true].length && partitioningResults[false].length){
								parentsTrue = [];
								parentsFalse = [];
								partitioningResults[true].forEach(function(k){
									parentsTrue = parentsTrue.concat(part[k]);
								});
								partitioningResults[false].forEach(function(k){
									parentsFalse = parentsFalse.concat(part[k]);
								});

								obj.matcher = listToRegExp(partitioningResults[false]) + common;
								obj.infinitives = parentsFalse;


								obj = {infinitives: parentsTrue, themes: obj.themes};
								list.push(obj);
								if(obj.infinitives.indexOf(common) < 0){
									variability = listToRegExp(extractVariability(common.length + 1, 1, obj.infinitives)) + listToRegExp(partitioningResults[true]);
									re = new RegExp(variability + common + '$');
									found = diff.some(function(el){ return el.match(re); });
								}
							}
						}
					}
				}
			}

			if(found){
				common = extractCommonPartFromList(diff);
				variability = listToNotRegExp(extractVariability(common.length, 1, diff));
				re = new RegExp(variability + common + '$');
				found = !obj.infinitives.every(function(el){ return el.match(re); });
			}


			if(found){
				console.log('!! cannot split up the initial verbs array');

				listNoPrefixes = uniqueNoPrefixes(obj.infinitives);
				first = listNoPrefixes.shift();
				obj.matcher = START_OF_WORD + first;

				if(listNoPrefixes.length){
					listNoPrefixes.forEach(function(el){
						list.push({matcher: el, infinitives: listNoPrefixes.slice(0).splice(listNoPrefixes.indexOf(el), 1), themes: obj.themes});
					});

					obj.infinitives = [first];
				}
			}
			else
				obj.matcher = variability + common;
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
	var uniqueNoPrefixes = function(list){
		return list.filter(function(x){
			for(var i = 0, len = list.length; i < len; i ++)
				if(x.indexOf(list[i]) > 0)
					return false;
			return true;
		});
	};

	/** @private */
	var printThemes = function(list){
		var i = SUFFIXES_BASE_INDEX,
			flags, base, logs, m, rebase, constraint;
		list.forEach(function(sublist){
			base = sublist.shift();
//FIXME
//case: ([ei])>($1)

			logs = [];
			sublist.forEach(function(el){
				flags = (sublist.parents? sublist.parents.map(function(el){ return el + SUFFIXES_BASE_INDEX; }): []);

				m = el.match(SPLITTER_REGEX_RULE);
				rebase = base.replace(/\/[^)]+$/, '');
				constraint = null;
				if(m){
					rebase = m[1];
					el = m[2];

					m = rebase.match(/\[(\^)?(.+)\]/);
					if(m && m[1] != '^'){
						m = m[2].split('');

						rebase = m.shift();
						constraint = rebase;

						m.forEach(function(obj){
							storeSuffix(logs, i, obj, el, flags, obj);
						});
					}
					else if(m){
						if(el.indexOf('$') >= 0){
							rebase = 0;
							el = el.replace(/\$\d/, '');
							constraint = m[0];
						}
						else
							throw '!! unsupported theme format: ' + rebase + '>' + el;
					}
					else{
						m = rebase.match(/(.+)\?(.+)/);
						if(m){
							storeSuffix(logs, i, m[2], el, flags, '[^' + m[1] + ']' + m[2]);

							rebase = m[1] + m[2];
							constraint = rebase;
						}
						else
							throw '!! unsupported theme format: ' + rebase + '>' + el;
					}
				}

				storeSuffix(logs, i, rebase, el, flags, constraint);
			});
			sublist.unshift(base);

			printSuffixes(logs, i, base);

			i ++;
		});
		return i;
	};

	/** @private */
	var print = function(paradigmEndings, commonThemes, infinitives, i){
		var parts, logs, th, themes, fromTo, matcher;
		paradigmEndings.forEach(function(el){
			logs = [];
			el.themes.forEach(function(idx, theme){
				fromTo = [];
				th = 'themeT' + theme;
				el.infinitives.forEach(function(inf){
					themes = infinitives[inf];

//FIXME
					parts = extractCommonPartsFromStart(inf, themes[REGULAR][th] || themes[IRREGULAR][th]);
					if(ArrayHelper.findIndex(fromTo, function(el){ return (el.from == parts.a && el.to == parts.b); }) < 0)
						fromTo.push({from: parts.a, to: parts.b});
				});

				fromTo.forEach(function(ft){
					matcher = new RegExp(ft.from + '$');
					storeSuffix(logs, i, ft.from, Word.unmarkDefaultStress(ft.to + commonThemes[idx][0]), idx + SUFFIXES_BASE_INDEX,
						(el.matcher.match(matcher)? el.matcher: ft.from), el.infinitives.filter(function(obj){ return obj.match(matcher); }));
				});
			});

			printSuffixes(logs, i);

			i ++;
		});
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

		logs.push('SFX ' + i + ' ' + replaced + ' ' + replacement + (constraint? ' ' + constraint: '') + (parents? ' # ' + parents.join(','): ''));
	};

	var printSuffixes = function(logs, i, base){
		console.log('SFX ' + i + ' Y ' + logs.length + (base != undefined? ' # ' + base: ''));
		logs.sort().forEach(function(log){
			console.log(log);
		});
	};

	/** @private */
	var expandThemes = function(themes){
		var splitter = function(form){
			var m = form.match(SPLITTER_REGEX_ALTERNATIVE_2);
			if(m){
				addAndSplit(form);

				splitted = true;
			}
			else{
				var splitted = false,
					m2;
				m = form.match(SPLITTER_REGEX_OPTIONAL);
				if(m && !form.match(/[>+$]/)){
					addAndSplit(m[1] + m[3]);

					m2 = m[2].match(SPLITTER_REGEX_ALTERNATIVE_1);
					if(m2){
						addAndSplit(m[1] + m2[1] + m[3]);
						addAndSplit(m[1] + m2[2] + m[3]);
					}
					else
						addAndSplit(m[1] + m[2] + m[3]);

					splitted = true;
				}
			}
			return splitted;
		};
		var addAndSplit = function(form){
			var m = form.match(SPLITTER_REGEX_ALTERNATIVE_2);
			if(m)
				m[2].split('').forEach(function(el){
					addAndSplit((m[1]? m[1]: '') + el);
				});
			else if(form.match(SPLITTER_REGEX_OPTIONAL) && !form.match(/[>+$]/))
				splitter(form);
			else{
				var matcher = '[' + PRONOMENAL_MARK + PRONOMENAL_MARK_IMPERATIVE + INTERROGATIVE_MARK + FINAL_CONSONANT_VOICING + ']+$';
				var f = function(el){
					//escape regexp reserved characters
					return el.match(new RegExp(form.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + matcher));
				};

				if(themes.indexOf(form) < 0 && (form.match(new RegExp(matcher)) || ArrayHelper.findIndex(themes, f) < 0))
					themes.push(form);
			}
		};

		for(var i = themes.length - 1; i >= 0; i --)
			if(splitter(themes[i], i))
				themes.splice(i, 1);
	};

	/** @private */
	var extractVariability = function(formLength, order, list){
		var variability = [],
			idx;
		list.forEach(function(obj){
			idx = obj.length - formLength - order;
			variability.push(idx >= 0? obj.substr(idx, order): '.');
		});
		return ArrayHelper.unique(variability).sort();
	};

	/** @private */
	var listToRegExp = function(list){
		if(list.length == 1)
			return list[0];
		list.sort();
		return (list[list.length - 1].length == 1? '[' + list.join('') + ']': '(' + list.join('|') + ')');
	};

	/** @private */
	var listToNotRegExp = function(list){
		list.sort();
		return (list[list.length - 1].length == 1? '[^' + list.join('') + ']': '(?!' + list.join('|') + ')');
	};


	/** @private */
	var generateIndicativePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);

		if(t.themeT12 || t.themeT5 || t.themeT8 || t.themeT10){
			if(t.themeT8){
				if(this.verb.irregularity.eser)
					insert.call(this, 8, (!t.themeT8.match(/[cijɉñ]$/)? '(i)': '') + 'on');
				else if(this.verb.irregularity.aver)
					insert.call(this, 8, '[à]>[àèò]');
				else{
					insert.call(this, 8, 'e');
					insert.call(this, 8, 'o' + FINAL_CONSONANT_VOICING);

					if(this.verb.irregularity.verb && type == IRREGULAR){
						if(this.verb.irregularity.saver)
							insert.call(this, 8, '[à]>ò');
						else
							insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o');
					}
				}
				if(!this.verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.themeT8.match(/à$/))
					insert.call(this, 8, '([^i])>$1i');
				else
					insert.call(this, 8, '([^i])>$1');
				var third = t.themeT8 + (!this.verb.irregularity.verb.match(/darStarFar|s?aver/)? (this.verb.irregularity.eser? 'é': 'e'): '');
				insert.call(this, 8, third.substr(t.themeT8.length));
				if(third.match(/[ei]$/)){
					insert.call(this, 8, '[ei]>' + FINAL_CONSONANT_VOICING);
				}
				if(t.themeT10 && t.themeT10 !== third){
					//FIXME
					//if(this.verb.irregularity.eser)
					//	insert.call(this, 10, '(x)|([ei])>($1)');
					insert.call(this, 10, '([ei])>($1)');
				}
			}
			else if(t.themeT10){
				insert.call(this, 10, '');
				if(t.themeT10.match(/[aeiou]$/) && t.themeT10 != PhonologyHelper.finalConsonantVoicing(t.themeT10.replace(/[aeiou]$/, ''), 'northern'))
					insert.call(this, 10, FINAL_CONSONANT_VOICING);
			}
			if(t.themeT5){
				insert.call(this, 5, '');
				if(conj == 2)
					insert.call(this, 12, 'é');
				else
					insert.call(this, 5, 'i?é>í');
			}
			if(t.themeT12 || t.themeT5){
				if(t.themeT12){
					insert.call(this, 12, 'on');
					insert.call(this, 12, 'en');
				}
				if(t.themeT5){
					insert.call(this, 5, '[è]>emo');
					if(conj == 2)
						insert.call(this, 5, 'i?é>imo');
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/))
				insert.call(this, 8, '[lx]?>go');
		}
	};

	/** @private */
	var generateIndicativeImperfect = function(type, t){
		if(t.themeT2 || t.themeT11){
			if(t.themeT2){
				var tmp = (this.verb.irregularity.eser? 'r': '(v)');
				insert.call(this, 2, tmp + '[oaie]');
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 2, '[x/j]|' + tmp + '[oai]');

				insert.call(this, 2, tmp + 'imo');
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 2, '[x/j]|' + tmp + 'imo');
			}
			if(t.themeT11){
				insert.call(this, 11, '(iv)ié');
				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'on(se)');
				insert.call(this, 11, 'iv(i)on(se)');
				insert.call(this, 11, '(iv)en(se)');
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 11, '[x/j]|(iv)én(se)');
			}
		}
	};

	/** @private */
	var generateIndicativeFuture = function(type, t){
		if(t.themeT4){
			insert.call(this, 4, 'r[òàèé]');
			insert.call(this, 4, 'remo');
			insert.call(this, 4, 'ron');
			insert.call(this, 4, 'ren');
			if(this.verb.conjugation == 2){
				insert.call(this, 4, 'rí');
				insert.call(this, 4, 'rimo');
			}
		}
	};

	/** @private */
	var generateSubjunctivePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);
		t = t.subjunctive || t;

		if(t.themeT12 || t.themeT5 || t.themeT8){
			if(t.themeT8){
				insert.call(this, 8, '[ae]');
				insert.call(this, 8, '([^i])>$1i');
				if(t.themeT8.match(/[^aeiouàèéíòóú]$/))
					insert.call(this, 8, FINAL_CONSONANT_VOICING);

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
	var generateSubjunctiveImperfect = function(type, t){
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
	var generateConditionalSimple = function(type, t){
		if(t.themeT4){
			insert.call(this, 4, 'rí[ae]');
			insert.call(this, 4, 'resi');
			insert.call(this, 4, 'r(is)ié');
			insert.call(this, 4, 'résimo');
			insert.call(this, 4, 'r(is)(i)on(se)');
			insert.call(this, 4, 'r(is)en(se)');
			insert.call(this, 4, 'rísel[oaie]');
			insert.call(this, 4, 'rave');
		}
	};

	/** @private */
	var generateImperativePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);

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
	var generateInfinitiveSimple = function(type, t){
		if(t.themeT1){
			var pronomenalMark = (!this.verb.infinitive.match(/(déver|(^|[^t])èser|s?aver)$/)? PRONOMENAL_MARK: '');
			insert.call(this, 1, 'r' + pronomenalMark);
			insert.call(this, 1, 're');
		}
	};

	/** @private */
	var generateParticipleImperfect = function(type, t){
		if(t.themeT7)
			insert.call(this, 7, 'nte');
	};

	/** @private */
	var generateParticiplePerfect = function(type, t){
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
	var generateGerundSimple = function(type, t){
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
				var f = function(el){
					//escape regexp reserved characters
					return el.match(new RegExp(suffix.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + matcher));
				};

				if(t[theme].indexOf(suffix) < 0 && (suffix.match(new RegExp(matcher)) || ArrayHelper.findIndex(t[theme], f) < 0))
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
		START_OF_WORD: START_OF_WORD,
		WHOLE_WORD: WHOLE_WORD,
		PRONOMENAL_MARK: PRONOMENAL_MARK,
		PRONOMENAL_MARK_IMPERATIVE: PRONOMENAL_MARK_IMPERATIVE,
		FINAL_CONSONANT_VOICING: FINAL_CONSONANT_VOICING,

		generate: generate
	};

});
