require(['tools/data/structs/Tree'], function(Tree){
	QUnit.module('Tree');

	QUnit.test('tree - add child', function(){
		var t = new Tree();

		var res1 = t.addChild('abc', {data: 'abc'});
		var res2 = t.addChild('abb', undefined, 'abc');

		ok(res1);
		ok(res2);
	});

	QUnit.test('tree - find child by ID', function(){
		var t = new Tree();

		t.addChild('abc', {data: 'abc'});
		t.addChild('abb', undefined, 'abc');

		ok(t.findByID('abc'));
		ok(t.findByID('abb'));
	});

	QUnit.test('tree - remove', function(){
		var t = new Tree();

		t.addChild('abc', {data: 'abc'});
		t.addChild('abb', undefined, 'abc');
		var res = t.remove('abc');

		ok(res);
		notOk(t.findByID('abc'));
	});

	QUnit.test('tree - insert parent', function(){
		var t = new Tree();

		t.addChild('abb');
		var res = t.insertParent('abc', {data: 'abc'}, 'abb');

		ok(res);
		ok(t.findByID('abc'));
	});
});
