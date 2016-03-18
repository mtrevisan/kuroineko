define(['HTMLHelper', 'tools/ui/Validator', 'tools/lang/phonology/Orthography', 'tools/lang/phonology/Syllabator', 'tools/lang/phonology/Phone', 'tools/lang/phonology/Grapheme'], function(HTMLHelper, Validator, Orthography, Syllabator, Phone, Grapheme){

	var textDOM, dialectDOM, btnCalculateDOM;

	var init = function(){
		textDOM = document.getElementById('text');
		dialectDOM = document.getElementById('dialect');
		btnCalculateDOM = document.getElementById('btnCalculate');


		textDOM.onkeyup = HTMLHelper.onEventCorrectOrthography(textDOM);
		dialectDOM.onchange = doSyllabate;

		btnCalculateDOM.onclick = doSyllabate;

		HTMLHelper.queryDOM('form').forEach(function(form){
			Validator.validateOnSubmit(form);
		});


		//HTMLHelper.addAccessKeyToSubmitButtons();


		//search for input data into the URL
		var params = HTMLHelper.readParamFromURL(['text', 'dialect']),
			text = params.text,
			dialect = params.dialect;
		if(text){
			dialect = dialect || 'none';

			textDOM.value = text;
			dialectDOM.value = dialect;

			doSyllabate();
		}
	};

	var doSyllabate = function(){
		syllabate(textDOM.value, dialectDOM.value);
	};

	var syllabate = function(text, dialect){
		if(!text)
			return;
		text = text.replace(/^\s+|\s+$/g, '');
		text = Orthography.correctOrthography(text);

		GoogleAnalyticsHelper.trackEvent('Compute', 'Syllabate', '{text: \'' + text + '\', dialect: \'' + dialect + '\'}');


		var resultPhonematic = Syllabator.syllabateText(text, dialect, true),
			outputPhonematic = resultPhonematic.wordSeparators[0],
			phonesOutput = '[',
			phonemesOutput = '/',
			syllabePhonematicCount = '';

		var k, word, syllabes;
		for(k in resultPhonematic.words){
			word = resultPhonematic.words[k];

			phonesOutput += word.phones.join('.') + ' ';
			phonemesOutput += Grapheme.convertPhonesIntoPhonemes(word.phones.join('.')) + ' ';

			syllabes = word.syllabes;
			if(word.hasSyllabationErrors){
				syllabes = syllabes.slice();
				word.notSyllabeIndexes.forEach(function(idx){
					syllabes[idx] = '<span class="syllabe-error">' + syllabes[idx] + '</span>';
				});

				outputPhonematic += '<span class="word-syllabe-error">' + syllabes.join(Syllabator.SYLLABE_SEPARATOR_IN_WORD) + '</span>';
			}
			else
				outputPhonematic += syllabes.join(Syllabator.SYLLABE_SEPARATOR_IN_WORD);
			outputPhonematic += resultPhonematic.wordSeparators[Number(k) + 1];
		}
		phonesOutput = phonesOutput.replace(/ $/, ']');
		phonemesOutput = phonemesOutput.replace(/ $/, '/');

		syllabePhonematicCount = String(resultPhonematic.totalSyllabeCount);

		//encode phone(me)s into 'Mau CanIPA Venetan' fonts
		phonesOutput = encodeIntoMauCANIpa(phonesOutput);
		phonemesOutput = encodeIntoMauCANIpa(phonemesOutput);

		HTMLHelper.setEncodedInnerHTML('syllabePhonematicOutput', outputPhonematic);
		HTMLHelper.setEncodedInnerHTML('phonesOutput', phonesOutput);
		HTMLHelper.setEncodedInnerHTML('phonemesOutput', phonemesOutput);
		HTMLHelper.setEncodedInnerHTML('syllabePhonematicOutputCount', syllabePhonematicCount);


		var resultGraphematic = Syllabator.syllabateText(text, dialect, false),
			outputGraphematic = resultPhonematic.wordSeparators[0],
			syllabeGraphematicCount = '';

		for(k in resultGraphematic.words){
			word = resultGraphematic.words[k];

			syllabes = word.syllabes;
			if(word.hasSyllabationErrors){
				syllabes = syllabes.slice();
				word.notSyllabeIndexes.forEach(function(idx){
					syllabes[idx] = '<span class="syllabe-error">' + syllabes[idx] + '</span>';
				});

				outputGraphematic += '<span class="word-syllabe-error">' + syllabes.join(Syllabator.SYLLABE_SEPARATOR_IN_WORD) + '</span>';
			}
			else
				outputGraphematic += syllabes.join(Syllabator.SYLLABE_SEPARATOR_IN_WORD);
			outputGraphematic += resultGraphematic.wordSeparators[Number(k) + 1];
		}

		syllabeGraphematicCount = String(resultGraphematic.totalSyllabeCount);

		HTMLHelper.setEncodedInnerHTML('syllabeGraphematicOutput', outputGraphematic);
		HTMLHelper.setEncodedInnerHTML('syllabeGraphematicOutputCount', syllabeGraphematicCount);
	};

	var encodeIntoMauCANIpa = function(str){
//		var list = str.match(Phone.REGEX_UNICODE_SPLITTER);

		return str
			.replace(/ɹ˞̺/g, 'I').replace(/ɹ˞̠/g, '~')
			.replace(/r̺/g, 'r')
			.replace(/ɾ̺/g, 'J').replace(/ɽ̠̟/g, '^')
			.replace(/l̺/g, 'l').replace(/l̻ʲ/g, 'K')
			.replace(/l̺̝/g, '|')
			.replace(/ʎ˞̞/g, 'L').replace(/ʟ˞̟̞/g, 'ƚ')
			.replace(/n̺/g, 'n').replace(/ɲ/g, 'ñ')
			.replace(/ŋ̞̟/g, 'C')
			.replace(/([td])̪/g, '$1')
			.replace(/k̟/g, 'D').replace(/g̟/g, 'E')
			.replace(/kʷ/g, 'F').replace(/gʷ/g, 'G')
			.replace(/t͡s̪̠/g, 'N').replace(/d͡z̪̠/g, 'O')
			.replace(/t̻͡ʃʲ/g, 'c').replace(/d̻͡ʒʲ/g, 'ǧ')
			.replace(/θ/g, 'þ').replace(/ð/g, 'đ')
			.replace(/s̠/g, 'ś').replace(/z̠/g, 'ź')
			.replace(/ʃʲ/g, 'š').replace(/ʒʲ/g, 'ž')
			.replace(/ʝ/g, 'j')
			.replace(/e/g, 'é')
			.replace(/ɛ/g, 'è')
			.replace(/o/g, 'ó')
			.replace(/ɔ/g, 'ò');
	};


	return {
		init: init
	};

});
