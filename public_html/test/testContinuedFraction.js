require(['tools/math/ContinuedFraction'], function(ContinuedFraction){
	QUnit.module('ContinuedFraction');

	QUnit.test('constructor with positive number', function(assert){
		var f = ContinuedFraction.fromNumber(13.27);

		assert.deepEqual(f.terms, [13, 3, 1, 2, 2, 1, 2]);
	});

	QUnit.test('constructor with negative number', function(assert){
		var f = ContinuedFraction.fromNumber(-13.27);

		assert.deepEqual(f.terms, [-14, 1, 2, 1, 2, 2, 1, 2]);
	});

	QUnit.test('to positive number', function(assert){
		var f = ContinuedFraction.fromNumber(13.27);

		assert.equal(f.toNumber(), 13.27);
	});

	QUnit.test('to negative number', function(assert){
		var f = ContinuedFraction.fromNumber(-13.27);

		assert.equal(f.toNumber(), -13.27);
	});

	QUnit.test('add', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		assert.equal(f1.toNumber(), 2.8125);

		var f2 = new ContinuedFraction([2, 1, 2, 3]);
		assert.equal(f2.toNumber(), 2.7);

		assert.deepEqual(f1.add(f2).terms, [5, 1, 1, 19, 2]);
	});

	QUnit.test('add with NaN', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([Number.NaN]);

		assert.deepEqual(f1.add(f2).terms, [Number.NaN]);
	});

	QUnit.test('sub with positive result', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		assert.equal(f1.toNumber(), 2.8125);

		var f2 = new ContinuedFraction([2, 1, 2, 3]);
		assert.equal(f2.toNumber(), 2.7);

		assert.deepEqual(f1.sub(f2).terms, [0, 8, 1, 8]);
	});

	QUnit.test('sub with negative result', function(assert){
		var f1 = new ContinuedFraction([2, 1, 2, 3]);
		var f2 = new ContinuedFraction([2, 1, 4, 3]);

		assert.deepEqual(f1.sub(f2).terms, [-1, 1, 7, 1, 8]);
	});

	QUnit.test('mul', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		assert.deepEqual(f1.mul(f2).terms, [7, 1, 1, 2, 6]);
	});

	QUnit.test('div', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		assert.deepEqual(f1.div(f2).terms, [1, 24]);
	});

	QUnit.test('div to NaN', function(assert){
		var f1 = new ContinuedFraction([0]);
		var f2 = new ContinuedFraction([0]);

		assert.deepEqual(f1.div(f2).terms, [Number.NaN]);
	});

	QUnit.test('op', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		assert.deepEqual(f1.op(f2, '2 x + 3 y').terms, [13, 1, 2, 1, 1, 1, 3]);
	});

	QUnit.test('integer part', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		assert.deepEqual(f1.integerPart().terms, [2]);
	});

	QUnit.test('fractional part', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		assert.deepEqual(f1.fractionalPart().terms, [0, 1, 4, 3]);
	});

	QUnit.test('inverse of less-than-one number', function(assert){
		var f1 = new ContinuedFraction([0, 1, 4, 3]);

		assert.deepEqual(f1.inverse().terms, [1, 4, 3]);
	});

	QUnit.test('inverse of positive', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		assert.deepEqual(f1.inverse().terms, [0, 2, 1, 4, 3]);
	});

	QUnit.test('inverse of negative', function(assert){
		var f1 = new ContinuedFraction([-2, 1, 4, 3]);

		assert.deepEqual(f1.inverse().terms, [-1, 6, 3]);
	});

	QUnit.test('compareTo gt', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		assert.equal(f1.compareTo(f2), 1);
	});

	QUnit.test('compareTo lt', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);
		var f2 = new ContinuedFraction([2, 1, 2, 3]);

		assert.equal(f2.compareTo(f1), -1);
	});

	QUnit.test('compareTo eq', function(assert){
		var f1 = new ContinuedFraction([2, 1, 4, 3]);

		assert.equal(f1.compareTo(f1), 0);
	});
});
