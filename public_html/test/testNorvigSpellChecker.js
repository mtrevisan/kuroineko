require(['tools/spellchecker/NorvigSpellChecker'], function(NorvigSpellChecker){
	module('NorvigSpellChecker');

	test('plain spell checker from dictionary', function(){
		var spellChecker = new NorvigSpellChecker('aàbcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary(['àbb', 'acbd']);

		var suggestions = spellChecker.suggest('abb');

		deepEqual(suggestions, {
			candidates: {
				'àbb': 0.9808838459953249,
				acbd: 0.019116154004675198
			},
			sortedKeys: [
				'àbb',
				'acbd'
			]
		});
	});

	test('plain spell checker from phoneme\'s dictionary', function(){
		var spellChecker = new NorvigSpellChecker('aàbt͡ʃdðd͡zeèéfghijd͡ʒklmnɲoòóprstθt͡suúvx');
		spellChecker.readDictionary(['t͡ʃiao', 'ad͡ʒuto']);

		var suggestions = spellChecker.suggest('avuto');

		deepEqual(suggestions, {
			candidates: {
				'ad͡ʒuto': 1
			},
			sortedKeys: [
				'ad͡ʒuto'
			]
		});
	});

	test('plain spell checker from dictionary with uppercase', function(){
		var spellChecker = new NorvigSpellChecker('aàbcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary(['ABB', 'ACBD']);

		var suggestions = spellChecker.suggest('abb');

		deepEqual(suggestions, {
			candidates: {
				abb: 0.9955344735270633,
				acbd: 0.004465526472936832
			},
			sortedKeys: [
				'abb',
				'acbd'
			]
		});
	});

	test('plain spell checker from corpus', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var suggestions = spellChecker.suggest('abc');

		deepEqual(suggestions, {
			candidates: {
				abb: 0.9741473302433789,
				acbd: 0.025852669756621083
			},
			sortedKeys: [
				'abb',
				'acbd'
			]
		});
	});

	test('plain spell checker from corpus 2', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var suggestions = spellChecker.suggest('ac');

		deepEqual(suggestions, {
			candidates: {
				abb: 0.6842105263157899,
				acbd: 0.31578947368421
			},
			sortedKeys: [
				'abb',
				'acbd'
			]
		});
	});

	test('is correct', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var correct = spellChecker.isCorrect('abb');

		equal(correct, true);
	});

	test('is not correct', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary('abb, acbd');

		var correct = spellChecker.isCorrect('abc');

		equal(correct, false);
	});
});
