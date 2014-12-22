/**
 * @class Conjugator
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/Dialect', 'tools/lang/phonology/Orthography', 'tools/lang/phonology/Word', 'tools/lang/morphology/Verb', 'tools/lang/morphology/Themizer', 'tools/lang/morphology/Paradigm', 'tools/lang/morphology/Pronouns'], function(Dialect, Orthography, Word, Verb, Themizer, Paradigm, Pronouns){

	/** @requires infinitive be trimmed. */
	var conjugate = function(infinitive, dialect){
		dialect = new Dialect(dialect);

		infinitive = Orthography.correctOrthography(infinitive);

		var verb = new Verb(infinitive);

		var themes = (new Themizer(verb, dialect)).generate();

		var paradigm = (new Paradigm(verb, themes)).generate();

		var pronouns = Pronouns.getPronouns(dialect);

		paradigm.applyDialectalVariations(verb, pronouns, dialect);


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

	var getStressThemeT3 = function(infinitive){
		var verb = new Verb(infinitive);

		var themes = (new Themizer(verb)).generateRegularThemes();

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
		getStressThemeT3: getStressThemeT3
	};

});
