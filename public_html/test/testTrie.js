require(['tools/data/structs/Trie'], function(Trie){
	QUnit.module('Trie');

	QUnit.test('trie', function(assert){
		var t = new Trie();

		t.add('abc');
		t.add('abb');
		t.add('ac');
		t.add('a');

		assert.ok(t.contains('a'));
		assert.notOk(t.contains('ab'));
		assert.notOk(t.contains('c'));
	});

	QUnit.test('getWords 1', function(assert){
		var t = new Trie();

		t.add('abc');
		t.add('abb');
		t.add('ac');
		t.add('a');

		assert.deepEqual(t.getWords('a').sort(), ['a', 'abb', 'abc', 'ac'].sort());
		assert.deepEqual(t.getWords('ab').sort(), ['abb', 'abc'].sort());
		assert.deepEqual(t.getWords('c'), []);
	});

	QUnit.test('getWords 2', function(assert){
		var t = new Trie();

		t.add('a');
		t.add('ab');
		t.add('bc');
		t.add('cd');
		t.add('abc');
		t.add('abd');

		assert.deepEqual(t.getWords('a').sort(), ['a', 'ab', 'abc', 'abd'].sort());
	});

	QUnit.test('findMatchesOnPath', function(assert){
		var t = new Trie();

		t.add('a');
		t.add('ab');
		t.add('bc');
		t.add('cd');
		t.add('abc');

		assert.deepEqual(t.findMatchesOnPath('abcd').sort(), ['a', 'ab', 'abc'].sort());
	});

	QUnit.test('apply', function(assert){
		var t = new Trie();

		t.add('abc');
		t.add('abb');
		t.add('ac');
		t.add('a');

		var count = 1;
		t.apply(function(node){
			assert.ok(t.contains(node.prefix));
			count ++;
		});
	});
});
