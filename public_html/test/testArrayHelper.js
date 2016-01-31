require(['tools/data/ArrayHelper'], function(ArrayHelper){
	QUnit.module('ArrayHelper');

	QUnit.test('intersection', function(assert){
		var result = ArrayHelper.intersection([1, 2, 3, 4], [7, 6, 5, 4, 3]);

		assert.deepEqual(result, [3, 4]);
	});

	QUnit.test('intersection - should keep only items that are present on all arrays', function(assert){
		var result = ArrayHelper.intersection(['0', -1, 1], [1, 2, 3], [1, 10, 11]);

		assert.deepEqual(result, [1]);
	});

	QUnit.test('intersection - should remove duplicates', function(assert){
		var result = ArrayHelper.intersection([-1, 2, 1], [0, -1, 1]);

		assert.deepEqual(result, [-1, 1]);
	});

	QUnit.test('intersection - should return an empty array if no intersection', function(assert){
		var result = ArrayHelper.intersection([0], [1, 2]);

		assert.deepEqual(result, []);
	});

	QUnit.test('intersection - should use empty array when null/undefined', function(assert){
		assert.deepEqual(ArrayHelper.intersection([1, 2], null), []);
		assert.deepEqual(ArrayHelper.intersection([1, 2], undefined), []);
	});

	QUnit.test('unique - should remove duplicates', function(assert){
		var result = ArrayHelper.unique(['a', 1, 2, 'c', 'b', 2, 1, 'b', 'c']);

		assert.deepEqual(result, ['a', 1, 2, 'c', 'b']);
	});

	QUnit.test('unique - should merge multiple inputs', function(assert){
		var result = ArrayHelper.unique(['a', 1, 2, 'c', 'b'], [2, 1, 'b', 'd'], ['a']);

		assert.deepEqual(result, ['a', 1, 2, 'c', 'b', 'd']);
	});

	QUnit.test('unique - should return null/undefined array if source array is null/undefined', function(assert){
		assert.deepEqual(ArrayHelper.unique(null), []);
		assert.deepEqual(ArrayHelper.unique(undefined), []);
	});

	QUnit.test('difference - should keep only items that are present on 1st array but not present on other arrays', function(assert){
		var a = ['a', 'b', 1],
			b = ['c', 1],
			c = [1, 2, 3];

		assert.deepEqual(ArrayHelper.difference(a, b, c), ['a', 'b']);
	});

	QUnit.test('difference - should remove duplicates', function(assert){
		var a = ['a', 'b', 1, 'b'],
			b = ['c', 'a', 1],
			c = [1, 2, 3, 'a'];

		assert.deepEqual(ArrayHelper.difference(a, b, c), ['b', 'b']);
	});

	QUnit.test('difference - should return an empty array if items are present on other arrays', function(assert){
		var a = ['b', 'a', 'c', 1, 2, 3],
			b = ['c', 'a'],
			c = [1, 'b', 2, 3, 'a'];

		assert.deepEqual(ArrayHelper.difference(a, b, c), []);
	});

	QUnit.test('cartesianProductOf', function(assert){
		var a = [1, 2],
			b = [3, 4],
			c = ['a', 'b'];

		assert.deepEqual(ArrayHelper.cartesianProductOf(a, b, c), [[1, 3, 'a'], [1, 3, 'b'], [1, 4, 'a'], [1, 4, 'b'], [2, 3, 'a'], [2, 3, 'b'], [2, 4, 'a'], [2, 4, 'b']]);
	});

	QUnit.test('binaryIndexOf - should find the element', function(assert){
		var arr = [1, 2, 5, 7, 12, 19, 31];
		assert.equal(ArrayHelper.binaryIndexOf(arr, 1), 0);
		assert.equal(ArrayHelper.binaryIndexOf(arr, 31), 6);
		assert.equal(ArrayHelper.binaryIndexOf(arr, 7), 3);
	});

	QUnit.test('binaryIndexOf - should not find the element', function(assert){
		var arr = [1, 2, 5, 7, 12, 19, 31];
		assert.equal(ArrayHelper.binaryIndexOf(arr, 8), -4);
	});

	QUnit.test('partition', function(assert){
		var result = ArrayHelper.partition(['sss', 'ttt', 'foo', 'bars'], function(value){
			return (value.indexOf('s') >= 0);
		});

		assert.deepEqual(result, {'true': ['sss', 'bars'], 'false': ['ttt', 'foo']});
	});

	QUnit.test('flatten array', function(assert){
		var result = ArrayHelper.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);

		assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
	});

	QUnit.test('flatten object', function(assert){
		var result = ArrayHelper.flatten({a: 'a', b: {c: 'c'}});

		assert.deepEqual(result, ['a', 'c']);
	});

	QUnit.test('flatten array and object', function(assert){
		var result = ArrayHelper.flatten({a: 'a', b: {c: 'c'}, d: [1, 2]});

		assert.deepEqual(result, ['a', 'c', 1, 2]);
	});
});
