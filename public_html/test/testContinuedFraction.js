require(['tools/math/ContinuedFraction'], function(ContinuedFraction){
	QUnit.module('ContinuedFraction');

	QUnit.test('constructor with positive number', function(){
		var f = ContinuedFraction.fromNumber(13.27);

		deepEqual(f.terms, [13, 3, 1, 2, 2, 1, 2]);
	});

	QUnit.test('constructor with negative number', function(){
		var f = ContinuedFraction.fromNumber(-13.27);

		deepEqual(f.terms, [-14, 1, 2, 1, 2, 2, 1, 2]);
	});

	QUnit.test('to positive number', function(){
		var f = ContinuedFraction.fromNumber(13.27);

		equal(f.toNumber(), 13.27);
	});

	QUnit.test('to negative number', function(){
		var f = ContinuedFraction.fromNumber(-13.27);

		equal(f.toNumber(), -13.27);
	});

	QUnit.test('add', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		equal(f1.toNumber(), 2.8125);

		var f2 = new ContinuedFraction([2, 1, 2, 3]);
		equal(f2.toNumber(), 2.7);

		deepEqual(f1.add(f2).terms, [5, 1, 1, 19, 2]);
	});

	QUnit.test('add with NaN', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([Number.NaN]);

		deepEqual(f1.add(f2).terms, [Number.NaN]);
	});

	QUnit.test('sub with positive result', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		equal(f1.toNumber(), 2.8125);

		var f2 = new ContinuedFraction([2, 1, 2, 3]);
		equal(f2.toNumber(), 2.7);

		deepEqual(f1.sub(f2).terms, [0, 8, 1, 8]);
	});

	QUnit.test('sub with negative result', function(){
		var f1 = new ContinuedFraction([2, 1, 2, 3]);
		var f2 = new ContinuedFraction([2, 1, 4, 3]);

		deepEqual(f1.sub(f2).terms, [-1, 1, 7, 1, 8]);
	});

	QUnit.test('mul', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		deepEqual(f1.mul(f2).terms, [7, 1, 1, 2, 6]);
	});

	QUnit.test('div', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		deepEqual(f1.div(f2).terms, [1, 24]);
	});

	QUnit.test('div to NaN', function(){
		var f1 = new ContinuedFraction([0]);
		var f2 = new ContinuedFraction([0]);

		deepEqual(f1.div(f2).terms, [Number.NaN]);
	});

	QUnit.test('op', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		deepEqual(f1.op(f2, '2 x + 3 y').terms, [13, 1, 2, 1, 1, 1, 3]);
	});

	QUnit.test('integer part', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		deepEqual(f1.integerPart().terms, [2]);
	});

	QUnit.test('fractional part', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		deepEqual(f1.fractionalPart().terms, [0, 1, 4, 3]);
	});

	QUnit.test('inverse of less-than-one number', function(){
		var f1 = new ContinuedFraction([0, 1, 4, 3]);

		deepEqual(f1.inverse().terms, [1, 4, 3]);
	});

	QUnit.test('inverse of positive', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		deepEqual(f1.inverse().terms, [0, 2, 1, 4, 3]);
	});

	QUnit.test('inverse of negative', function(){
		var f1 = new ContinuedFraction([-2, 1, 4, 3]);

		deepEqual(f1.inverse().terms, [-1, 6, 3]);
	});

	QUnit.test('compareTo gt', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		equal(f1.compareTo(f2), 1);
	});

	QUnit.test('compareTo lt', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		equal(f2.compareTo(f1), -1);
	});

	QUnit.test('compareTo eq', function(){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		equal(f1.compareTo(f1), 0);
	});
});
