/**
 * @class Bla2
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/Dialect', 'tools/lang/morphology/Themizer', 'tools/lang/phonology/Orthography', 'tools/lang/phonology/PhonologyHelper', 'tools/data/ObjectHelper'], function(Word, Dialect, Themizer, Orthography, PhonologyHelper, ObjectHelper){

	/** @constant */
	var REGULAR = 'regular',
	/** @constant */
		IRREGULAR = 'irregular',
	/** @constant */
		PRONOMENAL_MARK = '#',
	/** @constant */
		PRONOMENAL_MARK_IMPERATIVE = '$';



	/**
	 * @param {List} List of verbs generated by Verb
	 */
	var generate = function(verbs){
		var dialect = new Dialect(),
			themesEndings = [],
			paradigmEndings = [],
			infinitives = [],
			infinitive, themes;
		verbs.forEach(function(verb){
			if(infinitives.indexOf(verb.infinitive) < 0){
				infinitive = Word.unmarkDefaultStress(verb.infinitive);

				infinitives.push(infinitive);

				themes = Themizer.generate(verb, dialect);

				verb.infinitive = infinitive;

				generateThemesForSingleVerb(verb, themes, themesEndings);
				generateEndingsForSingleVerb(verb, themes, paradigmEndings);
			}
		});

		//convertIntoDialect.call(this, dialect);

		constraintToInfinitives(themesEndings, infinitives);
		constraintToInfinitives(paradigmEndings, infinitives);

console.log(themesEndings);
console.log(paradigmEndings);
	};

	/** @private */
	var generateThemesForSingleVerb = function(verb, themes, themesEndings){
		var idx, from, to;
		visit(themes, function(obj, key){
			idx = extractIndexOfCommonPartFromStart(verb.infinitive, obj[key]);
			from = verb.infinitive.substr(idx);
			to = obj[key].substr(idx);

			idx = findIndex(themesEndings, function(el){ return (el.from == from && el.to == to); });
			if(idx < 0)
				themesEndings.push({theme: Number(key.replace(/^themeT/, '')), from: from, to: to, parents: [verb.infinitive]});
			else if(themesEndings[idx].parents.indexOf(verb.infinitive) < 0)
				themesEndings[idx].parents.push(verb.infinitive);
		});
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

		return this.paradigm;
	};

	/** @private */
	var constraintToInfinitives = function(list, infinitives){
		var diff, variab, variability, common, re, found, part, partitioningResults, parentsTrue, parentsFalse,
			listNoPrefixes, first;
		list.forEach(function(obj){
			diff = difference(infinitives, obj.parents);

			common = extractCommonPartFromList(obj.parents);
			variability = '';
			re = new RegExp(common + '$');
			found = diff.some(function(el){ return el.match(re); });

			if(found && obj.parents.indexOf(common) < 0){
				variab = extractVariability(common.length, 1, obj.parents);
				variability = listToRegExp(variab);
				re = new RegExp(variability + common + '$');
				found = diff.some(function(el){ return el.match(re); });
			}

			if(found){
				if(obj.parents.length == 1){
					obj.matcher = '^' + obj.parents[0];

					return;
				}

				part = partition(obj.parents, function(el){ return (el.length - common.length >= 1? el[el.length - common.length - 1]: '^'); });
				if(!part['^']){
					variability = listToRegExp(extractVariability(common.length + 1, 1, obj.parents));
					partitioningResults = {'true': [], 'false': []};
					Object.keys(part).forEach(function(k){
						re = new RegExp(variability + k + common + '$');
						partitioningResults[diff.some(function(el){ return el.match(re); })].push(k);
					});
					if(partitioningResults['true'].length && partitioningResults['false'].length){
						parentsTrue = [];
						parentsFalse = [];
						partitioningResults['true'].forEach(function(k){
							parentsTrue = parentsTrue.concat(part[k]);
						});
						partitioningResults['false'].forEach(function(k){
							parentsFalse = parentsFalse.concat(part[k]);
						});

						obj.matcher = listToRegExp(partitioningResults['false']) + common;
						obj.parents = parentsFalse;


						obj = {parents: parentsTrue, suffix: obj.suffix};
						list.push(obj);
						if(obj.parents.indexOf(common) < 0){
							variability = listToRegExp(extractVariability(common.length + 1, 1, obj.parents));
							re = new RegExp(variability + listToRegExp(partitioningResults['true']) + common + '$');
							found = diff.some(function(el){ return el.match(re); });
						}
					}
					else if(!partitioningResults['true'].length){
						obj.matcher = variability + listToRegExp(Object.keys(part)) + common;

						return;
					}
				}
			}

			if(found){
				common = extractCommonPartFromList(diff);
				variability = listToNotRegExp(extractVariability(common.length, 1, diff));
				re = new RegExp(variability + common + '$');
				found = !obj.parents.every(function(el){ return el.match(re); });
			}


			if(found){
				console.log('error! cannot split up the initial verbs array');

				/*listNoPrefixes = uniqueNoPrefixes(obj.parents);
				first = listNoPrefixes.shift();
				obj.matcher = '^' + first;

				if(listNoPrefixes.length){
					listNoPrefixes.forEach(function(el){
						list.push({matcher: el, parents: listNoPrefixes.slice(0).splice(listNoPrefixes.indexOf(el), 1), suffix: obj.suffix});
					});

					obj.parents = [first];
				}/**/
			}
			else
				obj.matcher = variability + common;


			/*if(form && (obj.matcher == form || extractCommonPartFromEnd(form, obj.matcher).length)){
				found = false;
				not = false;
				order = 1;
				do{
					variability = extractVariability(obj.matcher.length, order ++, obj.parents);
					if(!variability.length){
						found = false;
						break;
					}
					variability = listToRegExp(variability);

					matcher = new RegExp(variability + obj.matcher + '$');
					found = (findIndex(diff, function(el){ return el.match(matcher); }) >= 0);

					if(found && order == 2){
						not = true;
						variability = listToNotRegExp(extractVariability(form.length, order - 1, obj.parents));

						matcher = new RegExp(variability + form + '$');
						found = (findIndex(diff, function(el){ return el.match(matcher); }) >= 0);
					}
				}while(found && !diff.every(function(el){ return (el[0] == '^'); }));
				if(!found)
					obj.matcher = variability + (not? form: obj.matcher);
				else
					console.log('error! cannot split up the initial verbs array');
			}/**/
		});
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

	/** @private */
	var difference = function(a, b){
		return a.filter(function(x){ return (b.indexOf(x) < 0); });
	};

	/** @private */
	var extractIndexOfCommonPartFromStart = function(a, b){
		for(var i = 0, len = Math.min(a.length, b.length); i < len; i ++)
			if(a[i] != b[i])
				break;
		return i;
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
	var extractVariability = function(formLength, order, list){
		var variability = [],
			idx;
		list.forEach(function(obj){
			idx = obj.length - formLength - order;
			variability.push(idx >= 0? obj.substr(idx, order): '.');
		});
		return unique(variability).sort();
	};

	/** @private */
	var unique = function(list){
		return list.filter(function(x, i){
			return (list.indexOf(x) == i);
		});
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
	var listToRegExp = function(list){
		if(list.length == 1)
			return list[0];
		return (list[list.length - 1].length == 1? '[' + list.join('') + ']': '(' + list.join('|') + ')');
	};

	/** @private */
	var listToNotRegExp = function(list){
		return (list[list.length - 1].length == 1? '[^' + list.join('') + ']': '(?!' + list.join('|') + ')');
	};

	var partition = function(list, predicate){
		var result = {};
		list.forEach(function(value, index){
			var key = predicate(value, index, list);
			if(key in result)
				result[key].push(value);
			else
				result[key] = [value];
		});
		return result;
	};


	/** @private */
	var generateIndicativePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);

		if(t.themeT12 || t.themeT5 || t.themeT8 || t.themeT10){
			if(t.themeT8){
				if(this.verb.irregularity.eser)
					insert.call(this, 8, (!t.themeT8.match(/[cijɉñ]$/)? '(i)': '') + 'ón');
				else if(this.verb.irregularity.aver){
					insert.call(this, 8, 'à>à');
					insert.call(this, 8, 'à>è');
					insert.call(this, 8, 'à>ò');
				}
				else{
					insert.call(this, 8, 'e');
					insert.call(this, 8, 'o');

					if(this.verb.irregularity.verb && type == IRREGULAR){
						if(this.verb.irregularity.saver)
							insert.call(this, 8, '.>ò');
						else
							insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'o');
					}
				}
				insert.call(this, 8, '([^i])>$1' + (!this.verb.irregularity.verb.match(/andar|darStarFar|s?aver/) || !t.themeT8.match(/à$/)? 'i': ''));
				var third = t.themeT8 + (!this.verb.irregularity.verb.match(/darStarFar|s?aver/)? (this.verb.irregularity.eser? 'é': 'e'): '');
				insert.call(this, 8, third.substr(t.themeT8.length));
				if(third.match(/[ei]$/))
					insert.call(this, 8, '[ei]>+voicing');
				if(t.themeT10 && t.themeT10 !== third){
					//FIXME
					//if(this.verb.irregularity.eser)
					//	insert.call(this, 10, '(x)|([ei])>($1)');
					insert.call(this, 10, '([ei])>($1)');
				}
			}
			else if(t.themeT10){
				var thirdNorthernOriental = PhonologyHelper.finalConsonantVoicing(t.themeT10.replace(/[ei]$/, ''), 'northern');
				insert.call(this, 10, '');
				if(t.themeT10.match(/[aeiou]$/) && t.themeT10 != thirdNorthernOriental)
					insert.call(this, 10, '+voicing');
			}
			if(t.themeT5){
				insert.call(this, 5, '');
				if(conj == 2)
					insert.call(this, 12, 'é');
				else
					insert.call(this, 5, ':i?é>í');
			}
			if(t.themeT12 || t.themeT5){
				if(t.themeT12){
					insert.call(this, 12, 'ón');
					insert.call(this, 12, 'én');
				}
				if(t.themeT5){
					insert.call(this, 5, 'è>é+mo');
					if(conj == 2)
						insert.call(this, 5, 'i?é>í+mo');
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
				insert.call(this, 2, tmp + 'o');
				insert.call(this, 2, tmp + 'i');
				insert.call(this, 2, tmp + 'a');
				insert.call(this, 2, tmp + 'e');
				//FIXME
				//if(this.verb.irregularity.eser){
				//	insert.call(this, 2, '[x/j]|' + tmp + 'o');
				//	insert.call(this, 2, '[x/j]|' + tmp + 'i');
				//	insert.call(this, 2, '[x/j]|' + tmp + 'a');
				//}
				if(t.themeT11)
					insert.call(this, 11, '(iv)ié');
			}
			if(t.themeT2){
				insert.call(this, 2, tmp + 'ímo');
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 2, '[x/j]|' + tmp + 'ímo');
			}
			if(t.themeT11){
				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'ón(se)');
				insert.call(this, 11, 'iv(i)ón(se)');
				insert.call(this, 11, '(iv)én(se)');
				//FIXME
				//if(this.verb.irregularity.eser)
				//	insert.call(this, 11, '[x/j]|(iv)én(se)');
			}
		}
	};

	/** @private */
	var generateIndicativeFuture = function(type, t){
		if(t.themeT4){
			insert.call(this, 4, 'rò');
			insert.call(this, 4, 'rà');
			insert.call(this, 4, 'rè');
			insert.call(this, 4, 'ré');
			insert.call(this, 4, 'rémo');
			insert.call(this, 4, 'rón');
			insert.call(this, 4, 'rén');
			if(this.verb.conjugation == 2){
				insert.call(this, 4, 'rí');
				insert.call(this, 4, 'rímo');
			}
		}
	};

	/** @private */
	var generateSubjunctivePresent = function(type, t){
		var conj = getIrregularVerbConjugation.call(this, type);
		t = t.subjunctive || t;

		if(t.themeT12 || t.themeT5 || t.themeT8){
			if(t.themeT8){
				insert.call(this, 8, 'a');
				insert.call(this, 8, 'e');
				insert.call(this, 8, '([^i])>$1i');
				if(t.themeT8.match(/[^aeiouàèéíòóú]$/))
					insert.call(this, 8, 'voicing');

				if(type == IRREGULAR && !this.verb.irregularity.verb.match(/(aver|dever|eser)/)){
					insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)': '') + 'a');
					insert.call(this, 8, (t.themeT8.match(/[aeiouàèéíòóú]$/)? '(g)i': '([^i])>$1i'));
				}
			}
			if(t.themeT5){
				insert.call(this, 5, '');
				if(conj != 2)
					insert.call(this, 5, '[èí]>é');
				else if(t.themeT5.replace(/i?é$/, 'í') != t.themeT5)
					insert.call(this, 5, 'i?é>í');
				if(t.themeT12)
					insert.call(this, 12, (this.verb.special3rd? '(i)': '') + 'é(de/ge)');
				if(conj == 3 && !this.verb.special3rd)
					insert.call(this, 5, '(de/ge)');
			}
			if(t.themeT12 || t.themeT5){
				if(t.themeT12){
					insert.call(this, 12, (!t.themeT12.match(/[cijɉñ]$/)? '(i)': '') + 'ón(e)');
					insert.call(this, 12, 'én(e)');
				}
				if(t.themeT5){
					insert.call(this, 5, 'è>é+mo');
					if(conj == 2 && t.themeT5.replace(/i?é$/, 'í') != t.themeT5)
						insert.call(this, 5, 'i?é>í+mo');
				}
			}

			if(t.themeT8 && this.verb.irregularity.verb.match(/dixer|traer|toler/)){
				insert.call(this, 8, '[lx]?>ga');
				insert.call(this, 8, '[lx]?>gi');
			}
		}
	};

	/** @private */
	var generateSubjunctiveImperfect = function(type, t){
		t = t.subjunctive || t;

		if(t.themeT2 || t.themeT11){
			if(t.themeT2){
				insert.call(this, 2, 'se');
				insert.call(this, 2, 'si');
				if(t.themeT11)
					insert.call(this, 11, '(is)ié(de/ge)');
			}
			if(t.themeT2)
				insert.call(this, 2, 'simo');
			if(t.themeT11){
				insert.call(this, 11, (!t.themeT11.match(/[cijɉñ]$/)? '(i)': '') + 'ón(e/se)');
				insert.call(this, 11, 'is(i)ón(e/se)');
				insert.call(this, 11, '(is)én(e/se)');
			}
		}
	};

	/** @private */
	var generateConditionalSimple = function(type, t){
		if(t.themeT4){
			insert.call(this, 4, 'ría');
			insert.call(this, 4, 'ríe');
			insert.call(this, 4, 'rési');
			insert.call(this, 4, 'r(is)ié');
			insert.call(this, 4, 'résimo');
			insert.call(this, 4, 'r(is)(i)ón(se)');
			insert.call(this, 4, 'r(is)én(se)');
			insert.call(this, 4, 'ràve');
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
				insert.call(this, 5, (conj == 2? 'i?é>í+' + PRONOMENAL_MARK_IMPERATIVE: '[èí]>é+' + PRONOMENAL_MARK_IMPERATIVE));
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
				insert.call(this, 6, '(do)');
				insert.call(this, 6, 'o');
				insert.call(this, 6, '(d)i');
				insert.call(this, 6, '');
				insert.call(this, 6, '(d)a');
				insert.call(this, 6, '(d)e');
			}
			if(t.themeT2){
				insert.call(this, 2, 'sto');
				insert.call(this, 2, 'sti');
				insert.call(this, 2, 'sta');
				insert.call(this, 2, 'ste');
			}
			if(t.themeT7 && this.verb.conjugation == 3){
				insert.call(this, 7, 'sto');
				insert.call(this, 7, 'sti');
				insert.call(this, 7, 'sta');
				insert.call(this, 7, 'ste');
			}
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
				insert.call(this, 8, strong + 'o');
				insert.call(this, 8, strong + 'i');
				insert.call(this, 8, strong + 'a');
				insert.call(this, 8, strong + 'e');
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
				insert.call(this, 2, '^siàndo' + pronomenalMark);
			else if(this.verb.irregularity.aver)
				insert.call(this, 2, '^' + (this.verb.infinitive.substr(0, this.verb.infinitive.length - 'aver'.length)) + 'abiàndo' + pronomenalMark);
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
				{matcher: /konsà$/, replacement: 'kónso'}
			],

			//2nd conjugation
			[
				//rhizotonic
				[
					//TODO
					{matcher: /trà$/, replacement: 'tràt'},
					{matcher: /díx$/, replacement: 'dít'},
					{matcher: /rónp$/, replacement: 'rót'},
					{matcher: /spànd$/, replacement: 'spànt'},
					{matcher: /skrív$/, replacement: 'skrít'},
					//kuèrdh, vínth, provéd
					{matcher: /kór$/, replacement: 'kórs'},
					{matcher: /ofénd$/, replacement: 'oféx'},
					{matcher: /pèrd$/, replacement: 'pèrs'},
					{matcher: /mét$/, replacement: 'més'},
					{matcher: /móv$/, replacement: 'mós'},
					{matcher: /nét$/, replacement: 'nés'},
					{matcher: /sucéd$/, replacement: 'sucès'}
					//...
				],
				//rhizoatone (avér, -manér, -parér, podér, savér, -tolér/-volér, e valér)
				[
					{matcher: /n$/, replacement: 'x'},
					{matcher: /r$/, replacement: 'rs'},
					{matcher: /tòl$/, replacement: 'tòlt'},
					{matcher: /àl$/, replacement: 'àls'}
				]
			],

			//3rd conjugation
			[
				{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},

				{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /núdr$/, replacement: '$1èrt'},
				{matcher: /r$/, replacement: 'rs'}
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
		var idx = findIndex(this.paradigm, function(el){ return (el.theme == theme && el.suffix == suffix); });
		if(idx < 0)
			this.paradigm.push({theme: theme, suffix: suffix, parents: [this.verb.infinitive]});
		else if(this.paradigm[idx].parents.indexOf(this.verb.infinitive) < 0)
			this.paradigm[idx].parents.push(this.verb.infinitive);
	};

	/** @private */
	var findIndex = function(array, predicate){
		for(var i = 0, len = array.length; i < len; i ++)
			if(predicate.call(array, array[i], i))
				return i;
		return -1;
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

	/**
	 * @param {Dialect} dialect
	 *
	 * @private
	 */
	var convertIntoDialect = function(dialect){
		visit(this, function(subParadigm, key){
			subParadigm[key] = Orthography.convertDialect(subParadigm[key], dialect.dialect, false);
		});
	};


	return {
		PRONOMENAL_MARK: PRONOMENAL_MARK,
		PRONOMENAL_MARK_IMPERATIVE: PRONOMENAL_MARK_IMPERATIVE,

		generate: generate
	};

});
