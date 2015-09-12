require(['tools/data/ArrayHelper'], function(ArrayHelper){
	module('ArrayHelper');

	test('intersection', function(){
		var result = ArrayHelper.intersection([1, 2, 3, 4], [7, 6, 5, 4, 3]);

		deepEqual(result, [3, 4]);
	});

	test('intersection - should keep only items that are present on all arrays', function(){
		var result = ArrayHelper.intersection(['0', -1, 1], [1, 2, 3], [1, 10, 11]);

		deepEqual(result, [1]);
	});

	test('intersection - should remove duplicates', function(){
		var result = ArrayHelper.intersection([-1, 2, 1], [0, -1, 1]);

		deepEqual(result, [-1, 1]);
	});

	test('intersection - should return an empty array if no intersection', function(){
		var result = ArrayHelper.intersection([0], [1, 2]);

		deepEqual(result, []);
	});

	test('intersection - should use empty array when null/undefined', function(){
		deepEqual(ArrayHelper.intersection([1, 2], null), []);
		deepEqual(ArrayHelper.intersection([1, 2], undefined), []);
	});

	test('unique - should remove duplicates', function(){
		var result = ArrayHelper.unique(['a', 1, 2, 'c', 'b', 2, 1, 'b', 'c']);

		deepEqual(result, ['a', 2, 1, 'b', 'c']);
	});

	test('unique - should merge multiple inputs', function(){
		var result = ArrayHelper.unique(['a', 1, 2, 'c', 'b'], [2, 1, 'b', 'd'], ['a']);

		deepEqual(result, ['c', 2, 1, 'b', 'd', 'a']);
	});

	test('unique - should return null/undefined array if source array is null/undefined', function(){
		deepEqual(ArrayHelper.unique(null), []);
		deepEqual(ArrayHelper.unique(undefined), []);
	});

	test('difference - should keep only items that are present on 1st array but not present on other arrays', function(){
		var a = ['a', 'b', 1],
			b = ['c', 1],
			c = [1, 2, 3];

		deepEqual(ArrayHelper.difference(a, b, c), ['a', 'b']);
	});

	test('difference - should remove duplicates', function(){
		var a = ['a', 'b', 1, 'b'],
			b = ['c', 'a', 1],
			c = [1, 2, 3, 'a'];

		deepEqual(ArrayHelper.difference(a, b, c), ['b', 'b']);
	});

	test('difference - should return an empty array if items are present on other arrays', function(){
		var a = ['b', 'a', 'c', 1, 2, 3],
			b = ['c', 'a'],
			c = [1, 'b', 2, 3, 'a'];

		deepEqual(ArrayHelper.difference(a, b, c), []);
	});

	test('binaryIndexOf - should find the element', function(){
		var arr = [1, 2, 5, 7, 12, 19, 31];
		equal(ArrayHelper.binaryIndexOf(arr, 1), 0);
		equal(ArrayHelper.binaryIndexOf(arr, 31), 6);
		equal(ArrayHelper.binaryIndexOf(arr, 7), 3);
	});

	test('binaryIndexOf - should not find the element', function(){
		var arr = [1, 2, 5, 7, 12, 19, 31];
		equal(ArrayHelper.binaryIndexOf(arr, 8), -4);
	});

	test('partition', function(){
		var result = ArrayHelper.partition(function(value){ return (value.indexOf('s') >= 0); }, ['sss', 'ttt', 'foo', 'bars']);

		deepEqual(result, [['sss', 'bars'], ['ttt', 'foo']]);
	});

	test('flatten array', function(){
		var result = ArrayHelper.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);

		deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
	});

	test('flatten object', function(){
		var result = ArrayHelper.flatten({a: 'a', b: {c: 'c'}});

		deepEqual(result, ['a', 'c']);
	});

	test('flatten array and object', function(){
		var result = ArrayHelper.flatten({a: 'a', b: {c: 'c'}, d: [1, 2]});

		deepEqual(result, ['a', 'c', 1, 2]);
	});
});
