require(['tools/lang/phonology/Grapheme'], function(Grapheme){
	QUnit.module('Grapheme');

	QUnit.test('grapheme to phone conversion test - eterophonic sequences', function(assert){
		assert.equal(Grapheme.convertGraphemesIntoPhones('pien'), 'pjeŋ̞̟');
		assert.equal(Grapheme.convertGraphemesIntoPhones('kuando'), 'kʷwaŋ̞̟d̪o');
		assert.equal(Grapheme.convertGraphemesIntoPhones('kièto'), 'k̟jɛt̪o');
	});

	QUnit.test('grapheme to phone conversion test - hyatus', function(assert){
		assert.equal(Grapheme.convertGraphemesIntoPhones('úa'), 'u' + Grapheme.HYATUS_MARKER + 'a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('leon'), 'l̺e' + Grapheme.HYATUS_MARKER + 'oŋ̞̟');
	});

	QUnit.test('grapheme to phone conversion test - combinatorial variants', function(assert){
		assert.equal(Grapheme.convertGraphemesIntoPhones('palia'), 'pal̻ʲja');
		assert.equal(Grapheme.convertGraphemesIntoPhones('kal'), 'kal̻ʲ');
		assert.equal(Grapheme.convertGraphemesIntoPhones('paltan'), 'pal̺̝t̪aŋ̞̟');

		assert.equal(Grapheme.convertGraphemesIntoPhones('arma'), 'aɹ˞̺ma');
		assert.equal(Grapheme.convertGraphemesIntoPhones('punèr'), 'pun̺ɛɹ˞̺');
		assert.equal(Grapheme.convertGraphemesIntoPhones('ara'), 'aɽ̠̟a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('ara', 'western'), 'ar̺a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('rana'), 'ɽ̠̟an̺a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('rana', 'lagunar.coxòto'), 'ɾ̺an̺a');

		assert.equal(Grapheme.convertGraphemesIntoPhones('anka'), 'aŋ̞̟ka');
	});

	QUnit.test('grapheme to phone conversion test - single graphemes', function(assert){
		assert.equal(Grapheme.convertGraphemesIntoPhones('àƚa'), 'aʟ˞̟̞a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('àƚa', 'lagunar.coxòto'), 'al̺̝a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('àlta', 'lagunar.coxòto'), 'al̺̝t̪a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('àra', 'lagunar.coxòto'), 'aɾ̺a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('àƚa', 'other'), 'aʎ˞̞a');

		assert.equal(Grapheme.convertGraphemesIntoPhones('aŧal', 'oriental'), 'at͡s̪̠al̻ʲ');
		assert.equal(Grapheme.convertGraphemesIntoPhones('đal', 'oriental'), 'd͡z̪̠al̻ʲ');

		assert.equal(Grapheme.convertGraphemesIntoPhones('sana'), 's̠an̺a');
		assert.equal(Grapheme.convertGraphemesIntoPhones('ñaro'), 'ɲaɽ̠̟o');
		assert.equal(Grapheme.convertGraphemesIntoPhones('tanto'), 't̪aŋ̞̟t̪o');
	});

	QUnit.test('grapheme to phoneme conversion test - single graphemes', function(assert){
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('àƚa'), 'ala');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('àƚa', 'lagunar.coxòto'), 'ala');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('àlta', 'lagunar.coxòto'), 'alta');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('àra', 'lagunar.coxòto'), 'ara');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('àƚa', 'other'), 'ala');

		assert.equal(Grapheme.convertGraphemesIntoPhonemes('aŧal', 'oriental'), 'at͡sal');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('đal', 'oriental'), 'd͡zal');

		assert.equal(Grapheme.convertGraphemesIntoPhonemes('sana'), 'sana');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('ñaro'), 'ɲaro');
		assert.equal(Grapheme.convertGraphemesIntoPhonemes('tanto'), 'tanto');
	});

	QUnit.test('phone to grapheme conversion test', function(assert){
		var list = ['pien', 'kuando', 'kièto', 'kal', 'palia', 'paltan', 'punèr', 'anka', 'ala', 'alta', 'arma', 'aŧal', 'đal', 'paja', 'jaŧo', 'paɉa', 'inɉaŧa', 'ɉaŧo', 'sana', 'ñaro', 'tanto'];
		list.forEach(function(k){
			assert.equal(Grapheme.convertPhonesIntoGraphemes(Grapheme.convertGraphemesIntoPhones(k)), k);
		});

		assert.equal(Grapheme.convertPhonesIntoGraphemes('ua'), 'ua');
		assert.equal(Grapheme.convertPhonesIntoGraphemes('l̺eoŋ̞̟'), 'leon');

		assert.equal(Grapheme.convertPhonesIntoGraphemes('aɽ̠̟a'), 'ara');
		assert.equal(Grapheme.convertPhonesIntoGraphemes('aɹ˞̠a'), 'ara');
		assert.equal(Grapheme.convertPhonesIntoGraphemes('aɾ̺a'), 'ara');

		assert.equal(Grapheme.convertPhonesIntoGraphemes('aʟ˞̟̞a'), 'aƚa');
		assert.equal(Grapheme.convertPhonesIntoGraphemes('aʎ˞̞a'), 'aƚa');
	});
});
