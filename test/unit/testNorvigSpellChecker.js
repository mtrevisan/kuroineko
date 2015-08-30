define(['tools/spellchecker/NorvigSpellChecker'], function(NorvigSpellChecker){
	beforeEach(function(){
		this.addMatchers({
			toBeJsonEqual: function(expected){
				var one = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, ''),
					two = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

				return (one === two);
			}
		});
	});

	describe('NorvigSpellChecker', function(){
		it('plain spell checker from dictionary', function(){
			var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
			spellChecker.readDictionary(['abb', 'acbd']);

			var suggestions = spellChecker.suggest('abc');

			expect(suggestions).toBeJsonEqual({
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

		it('plain spell checker from corpus 1', function(){
			var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
			spellChecker.readDictionary('abb, acbd');

			var suggestions = spellChecker.suggest('abc');

			expect(suggestions).toBeJsonEqual({
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

		it('plain spell checker from corpus 2', function(){
			var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
			spellChecker.readDictionary('abb, acbd');

			var suggestions = spellChecker.suggest('ac');

			expect(suggestions).toBeJsonEqual({
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

		it('is correct', function(){
			var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
			spellChecker.readDictionary('abb, acbd');

			var correct = spellChecker.isCorrect('abb');

			expect(correct).toBe(true);
		});

		it('is not correct', function(){
			var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
			spellChecker.readDictionary('abb, acbd');

			var correct = spellChecker.isCorrect('abc');

			expect(correct).toBe(false);
		});
	});
});
