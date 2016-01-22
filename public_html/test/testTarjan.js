require(['tools/data/structs/Tarjan'], function(Tarjan){
	QUnit.module('Tarjan');

	QUnit.test('contains vertex', function(){
		var t = new Tarjan();
		t.addVertex('a');

		ok(t.containsVertex('a'));
		notOk(t.containsVertex('b'));
	});

	QUnit.test('unconnected graph', function(){
		var t = new Tarjan();
		t.addVertex('a', ['b', 'c']);
		t.addVertex('b', ['d']);
		t.addVertex('c');
		t.addVertex('d');

		var scc = t.getStronglyConnectedComponents();

		equal(scc.length, 0);
	});

	QUnit.test('connected graph', function(){
		var t = new Tarjan();
		t.addVertex('a', ['b', 'c']);
		t.addVertex('b', ['d']);
		t.addVertex('c');
		t.addVertex('d', ['a']);

		var scc = t.getStronglyConnectedComponents();

		equal(scc.length, 1);
		equal(scc[0].join(' > '), 'a > b > d');
	});
});
