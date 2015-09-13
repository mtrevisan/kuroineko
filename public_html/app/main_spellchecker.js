define(['HTMLHelper', 'tools/lang/phonology/Orthography', 'tools/spellchecker/NorvigSpellChecker'], function(HTMLHelper, Orthography, NorvigSpellChecker){

	var textDOM,
		spellChecker;

	var init = function(){
		textDOM = document.getElementById('text');


		textDOM.onkeyup = function(){
			correct(textDOM.value);
		};


		//HTMLHelper.addAccessKeyToSubmitButtons();


		spellChecker = new NorvigSpellChecker('aàbcdđeéèfghiíjɉklƚmnñoóòprstŧuúvx');
		spellChecker.readDictionary(dict);
	};

	var correct = function(text){
//				var bla = '<span class="wiggle" oncontextmenu="return false" onmousedown="return livespell.insitu.disableclick(event, &quot;0&quot;);" onmouseup="return livespell.insitu.typoclick(event, &quot;myTextArea&quot;, this, &quot;S&quot;, &quot;0&quot;)">exampl</span>';
		if(!text)
			return;
		text = text.replace(/^\s+|\s+$/g, ' ');

//		GoogleAnalyticsHelper.trackEvent('Compute', 'Correct', '{text: \'' + text + '\'}');


		var m = extractWords(text);
		m.words.map(function(word){
			var suggestions = spellChecker.suggest(word);

			var output = [];
			for(var k in suggestions.sortedKeys){
				k = suggestions.sortedKeys[k];
				if(suggestions.candidates[k] < 0.1)
					break;

				output.push(k);
			}

			return (output.length? '<span class="wiggle">' + word + '</span>': word);
		});

		var output = m.separators[0];
		for(var k in m.words){
			k = Number(k);
			output += m.words[k];
			if(m.separators[k + 1])
				output += m.separators[k + 1];
		}

		HTMLHelper.setEncodedInnerHTML('text', output);
	};

	/** @private */
	var extractWords = function(text){
		return {
			words: text.split(/[^'"‘’aàbcdđeèéfghiìíjɉklƚmnñoòóprsʃtŧuùúvxʒ]+/i),
			separators: text.split(/['"‘aàbcdđeèéfghiìíjɉklƚmnñoòóprsʃtŧuùúvxʒ]+/i)
		};
	};


	return {
		init: init
	};

});
