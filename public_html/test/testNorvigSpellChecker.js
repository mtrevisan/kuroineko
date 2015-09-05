require(['tools/spellchecker/NorvigSpellChecker'], function(NorvigSpellChecker){
	module('NorvigSpellChecker');

	test('plain spell checker from dictionary', function(){
		var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
		spellChecker.readDictionary(['abb', 'acbd']);

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
