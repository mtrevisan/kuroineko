require(['tools/data/structs/Tarjan'], function(Tarjan){
	QUnit.module('Tarjan');

	QUnit.test('contains vertex', function(assert){
		var t = new Tarjan();
		t.addVertex('a');

		assert.ok(t.containsVertex('a'));
		assert.notOk(t.containsVertex('b'));
	});

	QUnit.test('unconnected graph', function(assert){
		var t = new Tarjan();
		t.addVertex('a', ['b', 'c']);
		t.addVertex('b', ['d']);
		t.addVertex('c');
		t.addVertex('d');

		var scc = t.getStronglyConnectedComponents();

		assert.equal(scc.length, 0);
	});

	QUnit.test('connected graph', function(assert){
		var t = new Tarjan();
		t.addVertex('a', ['b', 'c']);
		t.addVertex('b', ['d']);
		t.addVertex('c');
		t.addVertex('d', ['a']);

		var scc = t.getStronglyConnectedComponents();

		assert.equal(scc.length, 1);
		assert.equal(scc[0].join(' > '), 'a > b > d');
	});
});
