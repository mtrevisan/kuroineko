/**
 * @class Syllabe
 *
 * @author Mauro Trevisan
 */
define(function(){

	var isSyllabeOpen = function(syllabe){
		return (syllabe? syllabe.match(/[aàeèéiíoòóuú]$/): undefined);
	};

	/** NOTE: Use IPA standard. */
	var simplifySyllabePhonology = function(syllabe){
		return syllabe
			.replace(/[aeɛioɔu]/g, 'V')
			.replace(/[^V]/g, 'C');
	};


	return {
		isSyllabeOpen: isSyllabeOpen,
		simplifySyllabePhonology: simplifySyllabePhonology
	};

});
