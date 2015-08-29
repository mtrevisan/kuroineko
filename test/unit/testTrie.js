define(['tools/data/structs/Trie'], function(Trie){
	beforeEach(function(){
		this.addMatchers({
			toBeJsonEqual: function(expected){
				var one = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, ''),
					two = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

				return (one === two);
			}
		});
	});

	describe('Trie', function(){
		it('contains', function(){
			var t = new Trie();

			t.add('abc');
			t.add('abb');
			t.add('ac');
			t.add('a');

			expect(!!t.contains('a')).toBe(true);
			expect(t.contains('ab')).toBe(undefined);
			expect(t.contains('c')).toBe(undefined);
		});

		it('getWords 1', function(){
			var t = new Trie();

			t.add('abc');
			t.add('abb');
			t.add('ac');
			t.add('a');

			expect(t.getWords('a').sort()).toBeJsonEqual(['a', 'abb', 'abc', 'ac'].sort());
			expect(t.getWords('ab').sort()).toBeJsonEqual(['abb', 'abc'].sort());
			expect(t.getWords('c')).toBeJsonEqual([]);
		});

		it('getWords 2', function(){
			var t = new Trie();

			t.add('a');
			t.add('ab');
			t.add('bc');
			t.add('cd');
			t.add('abc');
			t.add('abd');

			expect(t.getWords('a').sort()).toBeJsonEqual(['a', 'ab', 'abc', 'abd'].sort());
		});

		it('findMatchesOnPath', function(){
			var t = new Trie();

			t.add('a');
			t.add('ab');
			t.add('bc');
			t.add('cd');
			t.add('abc');

			expect(t.findMatchesOnPath('abcd').sort()).toBeJsonEqual(['a', 'ab', 'abc'].sort());
		});
	});
});
