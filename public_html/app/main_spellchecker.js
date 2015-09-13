define(['HTMLHelper', 'tools/lang/phonology/Orthography', 'tools/spellchecker/NorvigSpellChecker'], function(HTMLHelper, Orthography, NorvigSpellChecker){

	var textDOM;

	var init = function(){
		textDOM = document.getElementById('text');


		textDOM.onkeyup = function(){
			correct(textDOM.value);
		};


		//HTMLHelper.addAccessKeyToSubmitButtons();
	};

	var correct = function(text){
//				var bla = '<span class="wiggle" oncontextmenu="return false" onmousedown="return livespell.insitu.disableclick(event, &quot;0&quot;);" onmouseup="return livespell.insitu.typoclick(event, &quot;myTextArea&quot;, this, &quot;S&quot;, &quot;0&quot;)">exampl</span>';
//				var bla = '<span class="wiggle">exampl</span>';
		if(!text)
			return;
		text = text.replace(/^\s+|\s+$/g, '');
		text = Orthography.correctOrthography(text);

//		GoogleAnalyticsHelper.trackEvent('Compute', 'Correct', '{text: \'' + text + '\'}');


		HTMLHelper.setEncodedInnerHTML('text', 'das');
	};


	return {
		init: init
	};

});
