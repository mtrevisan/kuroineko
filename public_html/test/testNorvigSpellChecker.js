require(['tools/spellchecker/NorvigSpellChecker'], function(NorvigSpellChecker){
	QUnit.module('NorvigSpellChecker');

	QUnit.test('plain spell checker from dictionary', function(){
		var spellChecker = new NorvigSpellChecker('aàbcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary(['àbb', 'acbd']);

		var suggestions = spellChecker.suggest('abb');

		deepEqual(suggestions, [
			{
				lnProbability: -4.1345870582808955,
				values: [
					'àbb'
				]
			},
			{
				lnProbability: -8.072507370154792,
				values: [
					'acbd'
				]
			}
		]);
	});

	QUnit.test('plain spell checker from phoneme\'s dictionary', function(){
		var spellChecker = new NorvigSpellChecker('aàbt͡ʃdðd͡zeèéfghijd͡ʒklmnɲoòóprstθt͡suúvx');
		spellChecker.readDictionary(['t͡ʃiao', 'ad͡ʒuto']);

		var suggestions = spellChecker.suggest('avuto');

		deepEqual(suggestions, [
			{
				lnProbability: -4.102391866339485,
				values: [
					'ad͡ʒuto'
				]
			}
		]);
	});

	QUnit.test('plain spell checker from dictionary with uppercase', function(){
		var spellChecker = new NorvigSpellChecker('aàbcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary(['ABB', 'ACBD']);

		var suggestions = spellChecker.suggest('abb');

		deepEqual(suggestions, [
			{
				lnProbability: -2.6656147363405216,
				values: [
					'abb'
				]
			},
			{
				lnProbability: -8.072507370154792,
				values: [
					'acbd'
				]
			}
		]);
	});

	QUnit.test('plain spell checker from corpus', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var suggestions = spellChecker.suggest('abc');

		deepEqual(suggestions, [
			{
				lnProbability: -4.1319225308155945,
				values: [
					'abb'
				]
			},
			{
				lnProbability: -7.761071211694906,
				values: [
					'acbd'
				]
			}
		]);
	});

	QUnit.test('plain spell checker from corpus 2', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var suggestions = spellChecker.suggest('ac');

		deepEqual(suggestions,
			[
				{
					lnProbability: -8.072507370154792,
					values: [
						'abb'
					]
				},
				{
					lnProbability: -8.845697258388276,
					values: [
						'acbd'
					]
				}
			]);
	});

	QUnit.test('is correct', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var correct = spellChecker.isCorrect('abb');

		ok(correct);
	});

	QUnit.test('is not correct', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var correct = spellChecker.isCorrect('abc');

		notOk(correct);
	});
});
