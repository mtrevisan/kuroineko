require(['tools/data/structs/PriorityQueue'], function(PriorityQueue){
	QUnit.module('PriorityQueue');

	QUnit.test('is empty', function(){
		var pq = new PriorityQueue();

		ok(pq.isEmpty());
		equal(pq.get(), undefined);
		equal(pq.extract(), undefined);

		pq.add(0, 'value');

		notOk(pq.isEmpty());
	});

	QUnit.test('inserting a node', function(){
		var pq = new PriorityQueue();

		pq.add(0, 'value');

		equal(pq.size(), 1);
		equal(pq.get().getPriority(), 0);
		equal(pq.get().getValue(), 'value');
	});

	QUnit.test('change minimum node', function(){
		var pq = new PriorityQueue();

		pq.add(1, 'first value');
		pq.add(0, 'second value');

		equal(pq.size(), 2);
		equal(pq.get().getPriority(), 0);
		equal(pq.get().getValue(), 'second value');
	});

	QUnit.test('union 1', function(){
		var pq = new PriorityQueue();
		pq.add(0, 'first');
		pq.add(-1, 'second');

		pq.union(new PriorityQueue());

		equal(pq.size(), 2);
		equal(pq.get().getPriority(), -1);
		equal(pq.get().getValue(), 'second');
	});

	QUnit.test('union 2', function(){
		var pq1 = new PriorityQueue();
		pq1.add(0, 'first');
		var pq2 = new PriorityQueue();
		pq2.add(-1, 'second');

		pq1.union(pq2);

		equal(pq1.size(), 2);
		equal(pq1.get().getPriority(), -1);
		equal(pq1.get().getValue(), 'second');
	});

	QUnit.test('extract minimum node', function(){
		var pq = new PriorityQueue();

		pq.add(4, '4');
		pq.add(3, '3');
		pq.add(2, '2');
		pq.add(1, '1');

		equal(pq.size(), 4);
		var node = pq.extract();
		equal(pq.size(), 3);
		equal(node.getPriority(), 1);
		equal(node.getValue(), '1');
		node = pq.extract();
		equal(pq.size(), 2);
		equal(node.getPriority(), 2);
		equal(node.getValue(), '2');
		node = pq.extract();
		equal(pq.size(), 1);
		equal(node.getPriority(), 3);
		equal(node.getValue(), '3');
		node = pq.extract();
		equal(pq.size(), 0);
		equal(node.getPriority(), 4);
		equal(node.getValue(), '4');
	});

	QUnit.test('decrease a key', function(){
		var pq = new PriorityQueue();

		pq.add(1, '1');
		pq.add(2, '2');
		pq.add(3, '3');
		pq.add(4, '4');

		pq.decreaseKey(0, '4');

		equal(pq.size(), 4);
		equal(pq.get().getPriority(), 0);
		equal(pq.get().getValue(), '4');
	});

	QUnit.test('delete a node', function(){
		var pq = new PriorityQueue();

		pq.add(1, '1');
		pq.add(2, '2');
		pq.add(3, '3');
		pq.add(4, '4');

		pq.deleteNode('1');
		equal(pq.size(), 3);
		pq.deleteNode('3');
		equal(pq.size(), 2);
		pq.deleteNode('2');
		equal(pq.size(), 1);
		pq.deleteNode('4');
		equal(pq.size(), 0);
	});
});
