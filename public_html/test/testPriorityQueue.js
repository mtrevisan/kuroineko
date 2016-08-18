require(['tools/data/structs/PriorityQueue'], function(PriorityQueue){
	QUnit.module('PriorityQueue');

	QUnit.test('is empty', function(assert){
		var pq = new PriorityQueue();

		assert.ok(pq.isEmpty());
		assert.equal(pq.get(), undefined);
		assert.equal(pq.extract(), undefined);

		pq.add(0, 'value');

		assert.notOk(pq.isEmpty());
	});

	QUnit.test('inserting a node', function(assert){
		var pq = new PriorityQueue();

		pq.add(0, 'value');

		assert.equal(pq.size(), 1);
		assert.equal(pq.get().getPriority(), 0);
		assert.equal(pq.get().getValue(), 'value');
	});

	QUnit.test('change minimum node', function(assert){
		var pq = new PriorityQueue();

		pq.add(1, 'first value');
		pq.add(0, 'second value');

		assert.equal(pq.size(), 2);
		assert.equal(pq.get().getPriority(), 0);
		assert.equal(pq.get().getValue(), 'second value');
	});

	QUnit.test('union 1', function(assert){
		var pq = new PriorityQueue();
		pq.add(0, 'first');
		pq.add(-1, 'second');

		pq.union(new PriorityQueue());

		assert.equal(pq.size(), 2);
		assert.equal(pq.get().getPriority(), -1);
		assert.equal(pq.get().getValue(), 'second');
	});

	QUnit.test('union 2', function(assert){
		var pq1 = new PriorityQueue();
		pq1.add(0, 'first');
		var pq2 = new PriorityQueue();
		pq2.add(-1, 'second');

		pq1.union(pq2);

		assert.equal(pq1.size(), 2);
		assert.equal(pq1.get().getPriority(), -1);
		assert.equal(pq1.get().getValue(), 'second');
	});

	QUnit.test('extract minimum node', function(assert){
		var pq = new PriorityQueue();

		pq.add(4, '4');
		pq.add(3, '3');
		pq.add(2, '2');
		pq.add(1, '1');

		assert.equal(pq.size(), 4);
		var node = pq.extract();
		assert.equal(pq.size(), 3);
		assert.equal(node.getPriority(), 1);
		assert.equal(node.getValue(), '1');
		node = pq.extract();
		assert.equal(pq.size(), 2);
		assert.equal(node.getPriority(), 2);
		assert.equal(node.getValue(), '2');
		node = pq.extract();
		assert.equal(pq.size(), 1);
		assert.equal(node.getPriority(), 3);
		assert.equal(node.getValue(), '3');
		node = pq.extract();
		assert.equal(pq.size(), 0);
		assert.equal(node.getPriority(), 4);
		assert.equal(node.getValue(), '4');
	});

	QUnit.test('decrease a key', function(assert){
		var pq = new PriorityQueue();

		pq.add(1, '1');
		pq.add(2, '2');
		pq.add(3, '3');
		pq.add(4, '4');

		pq.decreaseKey(0, '4');

		assert.equal(pq.size(), 4);
		assert.equal(pq.get().getPriority(), 0);
		assert.equal(pq.get().getValue(), '4');
	});

	QUnit.test('delete a node', function(assert){
		var pq = new PriorityQueue();

		pq.add(1, '1');
		pq.add(2, '2');
		pq.add(3, '3');
		pq.add(4, '4');

		pq.deleteNode('1');
		assert.equal(pq.size(), 3);
		pq.deleteNode('3');
		assert.equal(pq.size(), 2);
		pq.deleteNode('2');
		assert.equal(pq.size(), 1);
		pq.deleteNode('4');
		assert.equal(pq.size(), 0);
	});
});
