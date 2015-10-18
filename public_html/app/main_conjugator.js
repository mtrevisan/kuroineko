define(['HTMLHelper', 'tools/ui/Validator', 'tools/data/ObjectHelper', 'tools/lang/morphology/Conjugator', 'tools/lang/phonology/Syllabator', 'tools/lang/phonology/Orthography'/*, 'tools/data/proxy/Storage', 'tools/lang/data/VerbsDictionary', 'libs/jsonh', 'tools/spellchecker/NorvigSpellChecker'*/], function(HTMLHelper, Validator, ObjectHelper, Conjugator, Syllabator, Orthography, Storage, verbsDictionary, JSONH, NorvigSpellChecker){

	var infinitiveDOM, dialectDOM, verbsDictionaryDOM, spellCheckerSuggestionsDOM, btnCalculateDOM,
		i18nResources, historyStore;

	var init = function(i18n){
		infinitiveDOM = document.getElementById('infinitive');
		dialectDOM = document.getElementById('dialect');
		verbsDictionaryDOM = document.getElementById('verbsDictionary');
		spellCheckerSuggestionsDOM = document.getElementById('spellCheckerSuggestions');
		btnCalculateDOM = document.getElementById('btnCalculate');


		//HTMLHelper.addAccessKeyToSubmitButtons();


		i18nResources = i18n;

		var onKeyUpCorrectOrthography = HTMLHelper.onEventCorrectOrthography(infinitiveDOM);

		if(ObjectHelper.isDefined(verbsDictionary) && Array.isArray(verbsDictionary) && (ObjectHelper.isDefined(NorvigSpellChecker) && spellCheckerSuggestionsDOM || verbsDictionaryDOM)){
			var extractVerbInfinitive = (function(){
				var themeVowel = ['à', 'é', 'e', 'í', 'í'];

				return function(v){
					return v.prefix + v.radix + themeVowel[v.conjugation - 1] + 'r';
				};
			})();

			var dict = [],
				v;
			//fill dictionary of infinitives
			verbsDictionary = JSONH.unpack(verbsDictionary);
			for(v in verbsDictionary)
				dict.push(extractVerbInfinitive(verbsDictionary[v]));

			//initialize spell-checker
			if(NorvigSpellChecker && spellCheckerSuggestionsDOM){
				var spellChecker = new NorvigSpellChecker('aàbcdđeéèfghiíjɉklƚmnñoóòprstŧuúvx');
				spellChecker.readDictionary(dict);

				var onKeyUpSpellChecker = HTMLHelper.createBufferedFunction(function(){
						var output = [];
						if(infinitiveDOM.value.length > 2){
							var suggestions = spellChecker.suggest(infinitiveDOM.value);

							for(var k in suggestions.sortedKeys){
								k = suggestions.sortedKeys[k];
								if(suggestions.candidates[k] < 0.1)
									break;

								output.push(k);
							}

							var size = output.length;
							if(size){
								for(v = 0; v < size; v ++)
									output[v] = '<a href="#inputSection" onclick="Application.acceptAlternative(\'' + output[v] + '\')">' + output[v] + ' ('
										+ (suggestions.candidates[output[v]] * 100).toFixed(2) + '%)</a>';
								output = output.join('<br>');
							}
						}
						spellCheckerSuggestionsDOM.innerHTML = output;
					}, 300);
			}

			if(verbsDictionaryDOM)
				var onKeyUpFilterVerbsDictionary = HTMLHelper.createBufferedFunction(function(){
						var output = '';
						if(infinitiveDOM.value.length > 2){
							//filter verbs:
							var re = '^' + infinitiveDOM.value.replace(/ɉ/g, '$1[jɉ]').replace(/ł/g, 'l').replace(/x/g, '[đx]').replace(/s/g, '[sŧ]').replace(/fh/g, 'f')
								.replace(/a/g, '[aà]').replace(/e/g, '[eèé]').replace(/i/g, '[ií]').replace(/o/g, '[oòó]').replace(/u/g, '[uú]');
							var filterFn = function(infinitive){
								return infinitive.match(this);
							};
							output = dict.filter(filterFn, new RegExp(re)), output.join('\n');

							var size = output.length;
							if(size){
								for(v = 0; v < size; v ++)
									output[v] = '<a href="#inputSection" onclick="Application.acceptAlternative(\'' + output[v] + '\')">' + output[v] + '</a>';
								output = output.join('<br>');
							}
						}
						verbsDictionaryDOM.innerHTML = output;
					}, 300);

			infinitiveDOM.onkeyup = function(evt){
				onKeyUpCorrectOrthography(evt);
				if(onKeyUpFilterVerbsDictionary)
					onKeyUpFilterVerbsDictionary();
				if(onKeyUpSpellChecker)
					onKeyUpSpellChecker();
			};
		}
		else
			infinitiveDOM.onkeyup = onKeyUpCorrectOrthography;

		dialectDOM.onchange = doConjugate;

		btnCalculateDOM.onclick = doConjugate;

		HTMLHelper.queryDOM('form').forEach(function(form){
			Validator.validateOnSubmit(form);
		});


		//search for input data into the URL
		var params = HTMLHelper.readParamFromURL(['infinitive', 'dialect']),
			infinitive = params.infinitive,
			dialect = params.dialect;
		if(infinitive){
			dialect = dialect || 'none';

			infinitiveDOM.value = infinitive;
			dialectDOM.value = dialect;

			doConjugate();
		}


		//load user data:
		if(ObjectHelper.isDefined(Storage) && Storage.isSupported()){
			historyStore = new Storage('venetan-verb-conjugator-history');

			showHistory();
		}
	};

	var showHistory = function(){
		var sortedData = historyStore.sort(function(a, b){return b.count - a.count;});

		//clean history if needed:
		var maxHistoryData = 15,
			garbageRetainHistoryDataFactor = 2,
			garbageCollectHistoryDataFactor = 3;
		if(sortedData.length > maxHistoryData * garbageCollectHistoryDataFactor)
			sortedData.slice(maxHistoryData * garbageRetainHistoryDataFactor - sortedData.length).forEach(function(record){
				historyStore.removeRecord(record.id);
			});

		//load history:
		var history = [];
		sortedData.slice(0, maxHistoryData).forEach(function(record){
			history.push('<a href="#inputSection" onclick="Application.acceptAlternative(\'' + record.id + '\')">' + record.id + '</a>');
		});
		HTMLHelper.setEncodedInnerHTML('history', history.join('<br>'));
	};

	var acceptAlternative = function(alternative){
		infinitiveDOM.value = alternative;

		doConjugate();
	};

	var doConjugate = function(){
		conjugate(infinitiveDOM.value, dialectDOM.value);
	};

	var conjugate = (function(){
		var extractNonDeclinated = function(paradigm, moodTense, person){
			var output = '',
				id, content;
			['regular', 'irregular'].forEach(function(type){
				id = moodTense + '.' + type + (person? '.' + person: '');
				content = extract(paradigm, id);
				if(content)
					output += (type == 'irregular'? '<div class="conjugation-irregular">': '<div>') + content + '</div>';
			});
			return output;
		};
		var extractDeclinated = function(paradigm, moodTense, type, variant){
			var output = '',
				id, content;
			['singularMasculine', 'singularMasculine1', 'singularMasculine2', 'pluralMasculine', 'singularFeminine', 'pluralFeminine'].forEach(function(person){
				id = moodTense + '.' + type + '.' + variant + '.' + person;
				content = extract(paradigm, id);
				if(content)
					output += '<div>' + content + '</div>';
			});
			return output;
		};
		var extract = function(paradigm, id){
			var data = ObjectHelper.path(paradigm, id),
				output = '',
				key;
			if(ObjectHelper.isString(data))
				output = data;
			else
				for(key in data)
					if(ObjectHelper.isString(data[key]))
						output += data[key] + (key == 'archaic'? ' <sup class="archaic">A</sup>': '') + '<br>';
			return output;
		};

		var loadParadigmData = function(paradigm){
			paradigm = paradigm || {};

			//extract all TDs with class 'conjugation'
			var tds = HTMLHelper.queryDOM('td.conjugation', 'paradigmContainer'),
				k, output;
			for(k in tds)
				if(tds[k].innerHTML !== '--')
					tds[k].innerHTML = '';

			['indicative.present', 'indicative.imperfect', 'indicative.future', 'subjunctive.present', 'subjunctive.imperfect', 'imperative.present', 'conditional.simple', 'gerund.simple', 'infinitive.simple', 'participle.imperfect'].forEach(function(moodTense){
				['firstSingular', 'firstPlural', 'secondSingular', 'secondPlural', 'third', 'archaic', 'all'].forEach(function(person){
					output = extractNonDeclinated(paradigm, moodTense, person);

					HTMLHelper.setEncodedInnerHTML(moodTense + '.' + person, output.replace(/<br>$/, ''));
				});
			});
			['participle.perfect'].forEach(function(moodTense){
				['regular', 'irregular', 'irregular.strong'].forEach(function(type){
					['general', 'northern_oriental1', 'northern_oriental2'].forEach(function(variant){
						output = extractDeclinated(paradigm, moodTense, type, variant);

						if(output)
							HTMLHelper.setEncodedInnerHTML(moodTense + '.' + type + (variant !== 'general'? '.' + variant: ''), output);
					});
				});
			});
		};

		/*var loadThemesData = function(themes){
			//extract all DIVs with class 'theme'
			var divs = HTMLHelper.queryDOM('div.theme', 'themeContainer'), k;
			for(k in divs)
				divs[k].innerHTML = '';

			for(var key in themes.regular)
				themes.regular.hasOwnProperty(key) && HTMLHelper.setEncodedInnerHTML(key, themes.regular[key] || '');
		};*/

		var loadPronounWeakInterrogativeData = function(pronounWeakInterrogative, id){
			if(!id){
				//extract all DIVs with class 'pronoun-weak-interrogative'
				var divs = HTMLHelper.queryDOM('div.pronoun-weak-interrogative', 'pronounWeakInterrogativeContainer'), k;
				for(k in divs)
					if(divs[k].innerHTML !== '--')
						divs[k].innerHTML = '';
			}

			pronounWeakInterrogative = pronounWeakInterrogative || {};
			for(var key in pronounWeakInterrogative)
				if(pronounWeakInterrogative.hasOwnProperty(key)){
					if(ObjectHelper.isString(pronounWeakInterrogative[key]))
						HTMLHelper.setEncodedInnerHTML([id, key].join('.'), pronounWeakInterrogative[key].replace(/</g, '&lt;').replace(/>/g, '&gt;'));
					else
						loadPronounWeakInterrogativeData(pronounWeakInterrogative[key], (id? [id, key].join('.'): key));
				}
		};


		return function(infinitive, dialect){
			if(!infinitive)
				return;
			infinitive = infinitive.replace(/^\s+|\s+$/g, '');
			infinitive = Orthography.correctOrthography(infinitive);

			GoogleAnalyticsHelper.trackEvent('Compute', 'Conjugate', '{infinitive: \'' + infinitive + '\', dialect: \'' + dialect + '\'}');


			var alternativeInputMessage = '',
				errorMessage = '',
				result;

			try{
				result = Conjugator.conjugate(infinitive, dialect);

				var alternatives = result.verbInfo.alternatives;
				if(alternatives){
					var len = alternatives.length,
						a;

					alternativeInputMessage = '<span class="pay-attention">' + i18nResources.warning + '</span> ' + i18nResources.do_you_mean + ' ';
					for(a = 0; a < len; a ++){
						alternativeInputMessage += '"<a href="#inputSection" onclick="Application.acceptAlternative(\'' + alternatives[a] + '\')">' + alternatives[a] + '</a>"';
						if(a < len - 1)
							alternativeInputMessage += ' ' + i18nResources.or + ' ';
					}
					alternativeInputMessage += '?';
				}

				HTMLHelper.setEncodedInnerHTML('conjugation', (result.verbInfo.conjugation? result.verbInfo.conjugation + '<sup>a</sup> ' + i18nResources.conjugation: ''));

				loadParadigmData(result.paradigmInfo.paradigm);

				//loadThemesData(result.paradigmInfo.themes);

				loadPronounWeakInterrogativeData(result.paradigmInfo.pronouns);


				if(historyStore){
					//remove actualizant clitic on 'avér' verb
					var recordID = result.paradigmInfo.paradigm.infinitive.simple.regular.all.replace(/\(?ge\)?$/, '');
					var record = historyStore.getRecord(recordID);
					if(!record)
						record = {id: recordID, count: 0};
					record.count ++;
					historyStore.setRecord(record);

					showHistory();
				}
			}
			catch(e){
				errorMessage = '"' + infinitive + '" ';
				if(e == 'NOT_SYLLABABLE'){
					var syllabation = Syllabator.syllabate(infinitive),
						syllabes = syllabation.syllabes;
					syllabation.notSyllabeIndexes.forEach(function(idx){
						syllabes[idx] = syllabes[idx].toUpperCase();
					});
					errorMessage += i18nResources.error[e] + ' (' + syllabes.join('-') + ')';
				}
				else
					errorMessage += i18nResources.error[e];
			}

			HTMLHelper.setEncodedInnerHTML('inputAlternative', alternativeInputMessage);
			HTMLHelper.setEncodedInnerHTML('inputError', errorMessage);
		};
	})();


	return {
		init: init,
		acceptAlternative: acceptAlternative
	};

});
