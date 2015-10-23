require(['tools/data/structs/BinaryIndexedTree'], function(BinaryIndexedTree){
	QUnit.module('BinaryIndexedTree');

	QUnit.test('array contructor', function(){
		var freqs = [1, 1, 1, 1, 1],
			i;
		var bit = new BinaryIndexedTree(5, freqs);

		for(i = 0; i < freqs.length; i ++){
			equal(bit.read(i), 1);
			equal(bit.readCumulative(i), i + bit.read(i));
		}
		equal(bit.readTotal(), 5);
	});

	QUnit.test('size contructor', function(){
		var i;
		var bit = new BinaryIndexedTree(5);

		for(i = 0; i < 5; i ++){
			equal(bit.read(i), 1);
			equal(bit.readCumulative(i), i + bit.read(i));
		}
		equal(bit.readTotal(), 5);
	});

	QUnit.test('update', function(){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);

		equal(bit.read(0), 1);
		equal(bit.read(1), 1);
		equal(bit.read(2), 2);
		equal(bit.read(3), 1);
		equal(bit.read(4), 3);

		equal(bit.readCumulative(0), 1);
		equal(bit.readCumulative(1), 2);
		equal(bit.readCumulative(2), 4);
		equal(bit.readCumulative(3), 5);
		equal(bit.readCumulative(4), 8);

		equal(bit.readTotal(), 8);
	});

	QUnit.test('map', function(){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);
		bit.map(function(k){ return ((k + 1) >> 1); });

		equal(bit.read(0), 1);
		equal(bit.read(1), 1);
		equal(bit.read(2), 1);
		equal(bit.read(3), 1);
		equal(bit.read(4), 2);

		equal(bit.readCumulative(0), 1);
		equal(bit.readCumulative(1), 2);
		equal(bit.readCumulative(2), 3);
		equal(bit.readCumulative(3), 4);
		equal(bit.readCumulative(4), 6);

		equal(bit.readTotal(), 6);
	});

	QUnit.test('find exact', function(){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);

		equal(bit.find(0, true), 0);
		equal(bit.find(1, true), 1);
		equal(bit.find(2, true), 2);
		equal(bit.find(3, true), -1);
		equal(bit.find(4, true), 3);
		equal(bit.find(5, true), 4);
		equal(bit.find(6, true), -1);
		equal(bit.find(7, true), -1);
		equal(bit.find(8, true), 5);
		equal(bit.find(9, true), -1);
	});

	QUnit.test('find lower', function(){
		var bit = new BinaryIndexedTree(5);

		bit.update(2, 1);
		bit.update(4, 2);

		equal(bit.find(0), 0);
		equal(bit.find(1), 1);
		equal(bit.find(2), 2);
		equal(bit.find(3), 2);
		equal(bit.find(4), 3);
		equal(bit.find(5), 4);
		equal(bit.find(6), 4);
		equal(bit.find(7), 4);
		equal(bit.find(8), 5);
		equal(bit.find(9), 5);
	});
});
