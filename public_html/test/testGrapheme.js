require(['tools/lang/phonology/Grapheme'], function(Grapheme){
	module('Grapheme');

	test('grapheme to phone conversion test - eterophonic sequences', function(){
		equal(Grapheme.convertGraphemesIntoPhones('pien'), 'pjeŋ̞̟');
		equal(Grapheme.convertGraphemesIntoPhones('kuando'), 'kʷwaŋ̞̟d̪o');
		equal(Grapheme.convertGraphemesIntoPhones('kièto'), 'k̟jɛt̪o');
	});

	test('grapheme to phone conversion test - hyatus', function(){
		equal(Grapheme.convertGraphemesIntoPhones('úa'), 'u' + Grapheme.HYATUS_MARKER + 'a');
		equal(Grapheme.convertGraphemesIntoPhones('leon'), 'l̺e' + Grapheme.HYATUS_MARKER + 'oŋ̞̟');
	});

	test('grapheme to phone conversion test - combinatorial variants', function(){
		equal(Grapheme.convertGraphemesIntoPhones('palia'), 'pal̻ʲja');
		equal(Grapheme.convertGraphemesIntoPhones('kal'), 'kal̻ʲ');
		equal(Grapheme.convertGraphemesIntoPhones('paltan'), 'pal̺̝t̪aŋ̞̟');

		equal(Grapheme.convertGraphemesIntoPhones('arma'), 'aɹ˞̺ma');
		equal(Grapheme.convertGraphemesIntoPhones('punèr'), 'pun̺ɛɹ˞̺');
		equal(Grapheme.convertGraphemesIntoPhones('ara'), 'aɽ̠̟a');
		equal(Grapheme.convertGraphemesIntoPhones('ara', 'western'), 'ar̺a');
		equal(Grapheme.convertGraphemesIntoPhones('rana'), 'ɽ̠̟an̺a');
		equal(Grapheme.convertGraphemesIntoPhones('rana', 'lagunar.coxòto'), 'ɾ̺an̺a');

		equal(Grapheme.convertGraphemesIntoPhones('anka'), 'aŋ̞̟ka');
	});

	test('grapheme to phone conversion test - single graphemes', function(){
		equal(Grapheme.convertGraphemesIntoPhones('àƚa'), 'aʟ˞̟̞a');
		equal(Grapheme.convertGraphemesIntoPhones('àƚa', 'lagunar.coxòto'), 'al̺̝a');
		equal(Grapheme.convertGraphemesIntoPhones('àlta', 'lagunar.coxòto'), 'al̺̝t̪a');
		equal(Grapheme.convertGraphemesIntoPhones('àra', 'lagunar.coxòto'), 'aɾ̺a');
		equal(Grapheme.convertGraphemesIntoPhones('àƚa', 'other'), 'aʎ˞̞a');

		equal(Grapheme.convertGraphemesIntoPhones('aŧal', 'oriental'), 'at͡s̪̠al̻ʲ');
		equal(Grapheme.convertGraphemesIntoPhones('đal', 'oriental'), 'd͡z̪̠al̻ʲ');

		equal(Grapheme.convertGraphemesIntoPhones('sana'), 's̠an̺a');
		equal(Grapheme.convertGraphemesIntoPhones('ñaro'), 'ɲaɽ̠̟o');
		equal(Grapheme.convertGraphemesIntoPhones('tanto'), 't̪aŋ̞̟t̪o');
	});

	test('grapheme to phoneme conversion test - single graphemes', function(){
		equal(Grapheme.convertGraphemesIntoPhonemes('àƚa'), 'ala');
		equal(Grapheme.convertGraphemesIntoPhonemes('àƚa', 'lagunar.coxòto'), 'ala');
		equal(Grapheme.convertGraphemesIntoPhonemes('àlta', 'lagunar.coxòto'), 'alta');
		equal(Grapheme.convertGraphemesIntoPhonemes('àra', 'lagunar.coxòto'), 'ara');
		equal(Grapheme.convertGraphemesIntoPhonemes('àƚa', 'other'), 'ala');

		equal(Grapheme.convertGraphemesIntoPhonemes('aŧal', 'oriental'), 'at͡sal');
		equal(Grapheme.convertGraphemesIntoPhonemes('đal', 'oriental'), 'd͡zal');

		equal(Grapheme.convertGraphemesIntoPhonemes('sana'), 'sana');
		equal(Grapheme.convertGraphemesIntoPhonemes('ñaro'), 'ɲaro');
		equal(Grapheme.convertGraphemesIntoPhonemes('tanto'), 'tanto');
	});

	test('phone to grapheme conversion test', function(){
		var list = ['pien', 'kuando', 'kièto', 'kal', 'palia', 'paltan', 'punèr', 'anka', 'ala', 'alta', 'arma', 'aŧal', 'đal', 'paja', 'jaŧo', 'paɉa', 'inɉaŧa', 'ɉaŧo', 'sana', 'ñaro', 'tanto'];
		list.forEach(function(k){
			equal(Grapheme.convertPhonesIntoGraphemes(Grapheme.convertGraphemesIntoPhones(k)), k);
		});

		equal(Grapheme.convertPhonesIntoGraphemes('ua'), 'ua');
		equal(Grapheme.convertPhonesIntoGraphemes('l̺eoŋ̞̟'), 'leon');

		equal(Grapheme.convertPhonesIntoGraphemes('aɽ̠̟a'), 'ara');
		equal(Grapheme.convertPhonesIntoGraphemes('aɹ˞̠a'), 'ara');
		equal(Grapheme.convertPhonesIntoGraphemes('aɾ̺a'), 'ara');

		equal(Grapheme.convertPhonesIntoGraphemes('aʟ˞̟̞a'), 'aƚa');
		equal(Grapheme.convertPhonesIntoGraphemes('aʎ˞̞a'), 'aƚa');
	});
});
