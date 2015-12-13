define(['HTMLHelper', 'tools/data/FunctionHelper', 'tools/lang/phonology/Orthography', 'tools/spellchecker/Hunspell', 'text!tools/spellchecker/dictionaries/vec.aff', 'text!tools/spellchecker/dictionaries/vec.dic'], function(HTMLHelper, FunctionHelper, Orthography, Hunspell, aff, dic){

	var textDOM,
		spellChecker;

	var init = function(){
		textDOM = document.getElementById('text');


		textDOM.onkeyup = FunctionHelper.createBuffered(function(){
			correct(textDOM.value);
		}, 500);


		//HTMLHelper.addAccessKeyToSubmitButtons();


		spellChecker = new Hunspell(aff, dic);
		aff = null;
		dic = null;
	};

	var correct = function(text){
		if(!text)
			return;
		text = Orthography.correctOrthography(text
			.replace(/^\s+|\s+$/g, ' ')
			.replace(/<span.*>(.+?)<\/span>/g, '$1'));

//		GoogleAnalyticsHelper.trackEvent('Compute', 'Correct', '{text: \'' + text + '\'}');


		var m = extractWords(text);
		m.words = m.words.map(function(word){
			var suggestions = spellChecker.suggest(word);

//			var output = [];
//			for(var k in suggestions.sortedKeys){
//				k = suggestions.sortedKeys[k];
//				if(suggestions.candidates[k] < 0.05)
//					break;
//
//				output.push(k);
//			}

//				var bla = '<span class="wiggle" oncontextmenu="return false" onmousedown="return livespell.insitu.disableclick(event, &quot;0&quot;);" onmouseup="return livespell.insitu.typoclick(event, &quot;myTextArea&quot;, this, &quot;S&quot;, &quot;0&quot;)">exampl</span>';
			return (suggestions.length? '<span class="wiggle">' + word + '</span>': word);
//return word;
		});

		var output = mergeWords(m);

		HTMLHelper.setEncodedInnerHTML('text', output);
	};

	/** @private */
	var extractWords = function(text){
		return {
			words: text.split(/[^'"‘’aàbcdđeèéfghiìíjɉklƚmnñoòóprsʃtŧuùúvxʒ]+/i),
			separators: text.split(/['"‘’aàbcdđeèéfghiìíjɉklƚmnñoòóprsʃtŧuùúvxʒ]+/i)
		};
	};

	/** @private */
	var mergeWords = function(list){
		var output = [list.separators.length? list.separators[0]: ''];
		list.words.forEach(function(word, idx){
			output.push(word);
			output.push(this[idx + 1]);
		}, list.separators);
		return output.join('');
	};


	return {
		init: init
	};

});
