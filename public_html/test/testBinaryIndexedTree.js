require(['tools/data/structs/BinaryIndexedTree'], function(BinaryIndexedTree){
	QUnit.module('BinaryIndexedTree');

	QUnit.test('array contructor', function(assert){
		var freqs = [1, 1, 1, 1, 1],
			i;
		var bit = new BinaryIndexedTree(5, freqs);

		for(i = 0; i < freqs.length; i ++){
			assert.equal(bit.read(i), 1);
			assert.equal(bit.readCumulative(i), i + bit.read(i));
		}
		assert.equal(bit.readTotal(), 5);
	});

	QUnit.test('size contructor', function(assert){
		var i;
		var bit = new BinaryIndexedTree(5);

		for(i = 0; i < 5; i ++){
			assert.equal(bit.read(i), 1);
			assert.equal(bit.readCumulative(i), i + bit.read(i));
		}
		assert.equal(bit.readTotal(), 5);
	});

	QUnit.test('update', function(assert){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);

		assert.equal(bit.read(0), 1);
		assert.equal(bit.read(1), 1);
		assert.equal(bit.read(2), 2);
		assert.equal(bit.read(3), 1);
		assert.equal(bit.read(4), 3);

		assert.equal(bit.readCumulative(0), 1);
		assert.equal(bit.readCumulative(1), 2);
		assert.equal(bit.readCumulative(2), 4);
		assert.equal(bit.readCumulative(3), 5);
		assert.equal(bit.readCumulative(4), 8);

		assert.equal(bit.readTotal(), 8);
	});

	QUnit.test('map', function(assert){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);
		bit.map(function(k){ return ((k + 1) >> 1); });

		assert.equal(bit.read(0), 1);
		assert.equal(bit.read(1), 1);
		assert.equal(bit.read(2), 1);
		assert.equal(bit.read(3), 1);
		assert.equal(bit.read(4), 2);

		assert.equal(bit.readCumulative(0), 1);
		assert.equal(bit.readCumulative(1), 2);
		assert.equal(bit.readCumulative(2), 3);
		assert.equal(bit.readCumulative(3), 4);
		assert.equal(bit.readCumulative(4), 6);

		assert.equal(bit.readTotal(), 6);
	});

	QUnit.test('find exact', function(assert){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);

		assert.equal(bit.find(0, true), 0);
		assert.equal(bit.find(1, true), 1);
		assert.equal(bit.find(2, true), 2);
		assert.equal(bit.find(3, true), -1);
		assert.equal(bit.find(4, true), 3);
		assert.equal(bit.find(5, true), 4);
		assert.equal(bit.find(6, true), -1);
		assert.equal(bit.find(7, true), -1);
		assert.equal(bit.find(8, true), 5);
		assert.equal(bit.find(9, true), -1);
	});

	QUnit.test('find lower', function(assert){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);

		assert.equal(bit.find(0), 0);
		assert.equal(bit.find(1), 1);
		assert.equal(bit.find(2), 2);
		assert.equal(bit.find(3), 2);
		assert.equal(bit.find(4), 3);
		assert.equal(bit.find(5), 4);
		assert.equal(bit.find(6), 4);
		assert.equal(bit.find(7), 4);
		assert.equal(bit.find(8), 5);
		assert.equal(bit.find(9), 5);
	});
});
