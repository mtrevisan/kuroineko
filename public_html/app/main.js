/**
 * This work is licensed under the Creative Commons Attribuzione - Non commerciale - Non opere derivate 4.0 Internazionale. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/.
 * This work is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/4.0/.
 */
define([
	//common
	'HTMLHelper', 'tools/social/MailHelper',

	//main_conjugator
	'tools/data/ObjectHelper', 'tools/lang/morphology/Conjugator',
	//main_syllabator
	'tools/lang/phonology/Orthography', 'tools/lang/phonology/Syllabator', 'tools/lang/phonology/Grapheme',
	//main_measureConverter
	'tools/measure/data/MeasureVeneto',
	//main_dialectInquirer
	'tools/data/mining/DecisionTree', 'tools/ui/Validator', 'tools/ui/Alerter', 'tools/data/CommHelper',
	//main_dictionary
	'tools/lang/dictionary/Dictionary', 'tools/data/coder/arithmetic/HighOrderModelFactory', 'tools/data/coder/arithmetic/BasicModel', 'tools/data/coder/arithmetic/CoderDriver', 'tools/data/structs/BitBuffer'
], function(){});
