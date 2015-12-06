/**
 * @class Conjugator
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/Dialect', 'tools/lang/phonology/Orthography', 'tools/lang/phonology/Word', 'tools/lang/morphology/Verb', 'tools/lang/morphology/Themizer', 'tools/lang/morphology/Paradigm', 'tools/lang/morphology/Pronouns', 'tools/data/ArrayHelper'], function(Dialect, Orthography, Word, Verb, Themizer, Paradigm, Pronouns, ArrayHelper){

	/**
	 * @constant
	 * @private
	 */
	var SPLITTER_REGEX_OPTIONAL = /(.*?)\((.+?)\)(.*)/,
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_ALTERNATIVE = /(.+)\/(.+)/,
	/**
	 * @constant
	 * @private
	 */
		SPLITTER_REGEX_OPTIONAL_ALTERNATIVE = /(.*?)\((.+?)\)(.*)|(.+)\/(.+)/;


	var conjugate = function(infinitive, dialect, markPronomenalForms){
		dialect = new Dialect(dialect);

		infinitive = Orthography.correctOrthography(infinitive);

		var verb = new Verb(infinitive);

		var themes = Themizer.generate(verb, dialect);

		var paradigm = Paradigm.generate(verb, themes);

		var pronouns = Pronouns.getPronouns(dialect);

		paradigm.applyDialectalVariations(verb, pronouns, dialect, markPronomenalForms);


		return {
			verbInfo: verb,
			paradigmInfo: {
				dialect: dialect,

				//themes: themes,
				paradigm: paradigm,

				pronouns: pronouns
			}
		};
	};

	var extractForms = function(infinitive, dialect){
		var conjugation = conjugate(infinitive, dialect, true),
			paradigm = conjugation.paradigmInfo.paradigm;
		delete paradigm.applyDialectalVariations;

		var response = ArrayHelper.unique(ArrayHelper.flatten(paradigm)).filter(function(item){ return (item !== undefined); });

		var addAndSplit = function(form){
			response.push(form);
			splitter(form);
		};
		var splitter = function(form){
			var m = form.match(SPLITTER_REGEX_OPTIONAL),
				m2;
			if(m){
				addAndSplit(m[1] + m[3]);

				m2 = m[2].match(SPLITTER_REGEX_ALTERNATIVE);
				if(m2){
					addAndSplit(m[1] + m2[1] + m[3]);
					addAndSplit(m[1] + m2[2] + m[3]);
				}
				else
					addAndSplit(m[1] + m[2] + m[3]);
			}
		};
		response.forEach(splitter);
		response = response.filter(function(item){
			return !item.match(SPLITTER_REGEX_OPTIONAL_ALTERNATIVE);
		});

		response = ArrayHelper.unique(response.map(Word.unmarkDefaultStress));

		return response;
	};

	var getStressThemeT3 = function(infinitive){
		var verb = new Verb(infinitive);

		var themes = Themizer.generateRegularThemes(verb);

		var stressIndex = Word.getIndexOfStress(themes.themeT3),
			stressType = Word.getStressType(themes.themeT3[stressIndex]);

		return {
			paradigmInfo: {
				stressIndex: stressIndex - (verb.semiSpecial3rd? 1: 0),
				stressType: stressType
			}
		};
	};


	return {
		conjugate: conjugate,
		extractForms: extractForms,
		getStressThemeT3: getStressThemeT3
	};

});
