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
					abb: 0.9815878113367819,
					acbd: 0.01841218866321811
				},
				sortedKeys: [
					'abb',
					'acbd'
				]
			});
		});

		it('plain spell checker from corpus', function(){
			var spellChecker = new NorvigSpellChecker('abcdefghijklmnopqrstuvwxyz');
			spellChecker.readDictionary('abb, acbd');

			var suggestions = spellChecker.suggest('abc');

			expect(suggestions).toBeJsonEqual({
				candidates: {
					abb: 0.9815878113367819,
					acbd: 0.01841218866321811
				},
				sortedKeys: [
					'abb',
					'acbd'
				]
			});
		});
	});
});
