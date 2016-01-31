require(['tools/data/structs/Tree'], function(Tree){
	QUnit.module('Tree');

	QUnit.test('tree - add child', function(assert){
		var t = new Tree();

		var res1 = t.addChild('abc', {data: 'abc'});
		var res2 = t.addChild('abb', undefined, 'abc');

		assert.ok(res1);
		assert.ok(res2);
	});

	QUnit.test('tree - find child by ID', function(assert){
		var t = new Tree();

		t.addChild('abc', {data: 'abc'});
		t.addChild('abb', undefined, 'abc');

		assert.ok(t.findByID('abc'));
		assert.ok(t.findByID('abb'));
	});

	QUnit.test('tree - find non existent 1', function(assert){
		var t = new Tree();

		t.addChild('abc', {data: 'abc'});
		t.addChild('abb', undefined, 'abc');

		assert.notOk(t.findByID('ab'));
	});

	QUnit.test('tree - find non existent 2', function(assert){
		var t = new Tree();

		assert.notOk(t.findByID('ab'));
	});

	QUnit.test('tree - remove', function(assert){
		var t = new Tree();

		t.addChild('abc', {data: 'abc'});
		t.addChild('abb', undefined, 'abc');
		var res = t.remove('abc');

		assert.ok(res);
		assert.notOk(t.findByID('abc'));
	});

	QUnit.test('tree - insert parent', function(assert){
		var t = new Tree();

		t.addChild('abb');
		var res = t.insertParent('abc', {data: 'abc'}, 'abb');

		assert.ok(res);
		assert.ok(t.findByID('abc'));
	});
});
