require(['tools/data/structs/Trie'], function(Trie){
	QUnit.module('Trie');

	QUnit.test('trie', function(){
		var t = new Trie();

		t.add('abc');
		t.add('abb');
		t.add('ac');
		t.add('a');

		ok(t.contains('a'));
		notOk(t.contains('ab'));
		notOk(t.contains('c'));
	});

	QUnit.test('getWords 1', function(){
		var t = new Trie();

		t.add('abc');
		t.add('abb');
		t.add('ac');
		t.add('a');

		deepEqual(t.getWords('a').sort(), ['a', 'abb', 'abc', 'ac'].sort());
		deepEqual(t.getWords('ab').sort(), ['abb', 'abc'].sort());
		deepEqual(t.getWords('c'), []);
	});

	QUnit.test('getWords 2', function(){
		var t = new Trie();

		t.add('a');
		t.add('ab');
		t.add('bc');
		t.add('cd');
		t.add('abc');
		t.add('abd');

		deepEqual(t.getWords('a').sort(), ['a', 'ab', 'abc', 'abd'].sort());
	});

	QUnit.test('findMatchesOnPath', function(){
		var t = new Trie();

		t.add('a');
		t.add('ab');
		t.add('bc');
		t.add('cd');
		t.add('abc');

		deepEqual(t.findMatchesOnPath('abcd').sort(), ['a', 'ab', 'abc'].sort());
	});

	QUnit.test('apply', function(){
		var t = new Trie();

		t.add('abc');
		t.add('abb');
		t.add('ac');
		t.add('a');

		var count = 1;
		t.apply(function(node){
			ok(t.contains(node.prefix));
			count ++;
		});
	});
});
