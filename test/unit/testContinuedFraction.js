define(['tools/math/ContinuedFraction'], function(ContinuedFraction){
	beforeEach(function(){
		this.addMatchers({
			toBeJsonEqual: function(expected){
				var one = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, ''),
					two = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

				return (one === two);
			}
		});
	});

	describe('ContinuedFraction', function(){
		it('constructor with positive number', function(){
			var f = ContinuedFraction.fromNumber(13.27);

			expect(f.terms).toBeJsonEqual([13, 3, 1, 2, 2, 1, 2]);
		});

		it('constructor with negative number', function(){
			var f = ContinuedFraction.fromNumber(-13.27);

			expect(f.terms).toBeJsonEqual([-14, 1, 2, 1, 2, 2, 1, 2]);
		});

		it('to positive number', function(){
			var f = ContinuedFraction.fromNumber(13.27);

			expect(f.toNumber()).toBeJsonEqual(13.27);
		});

		it('to negative number', function(){
			var f = ContinuedFraction.fromNumber(-13.27);

			expect(f.toNumber()).toBeJsonEqual(-13.27);
		});

		it('add', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			expect(f1.toNumber()).toBe(2.8125);

			var f2 = new ContinuedFraction([2, 1, 2, 3]);
			expect(f2.toNumber()).toBe(2.7);

			expect(f1.add(f2).terms).toBeJsonEqual([5, 1, 1, 19, 2]);
		});

		it('add with NaN', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			var f2 = new ContinuedFraction([Number.NaN]);

			expect(f1.add(f2).terms).toBeJsonEqual([Number.NaN]);
		});

		it('sub with positive result', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			expect(f1.toNumber()).toBe(2.8125);

			var f2 = new ContinuedFraction([2, 1, 2, 3]);
			expect(f2.toNumber()).toBe(2.7);

			expect(f1.sub(f2).terms).toBeJsonEqual([0, 8, 1, 8]);
		});

		it('sub with negative result', function(){
			var f1 = new ContinuedFraction([2, 1, 2, 3]);
			var f2 = new ContinuedFraction([2, 1, 4, 3]);

			expect(f1.sub(f2).terms).toBeJsonEqual([-1, 1, 7, 1, 8]);
		});

		it('mul', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			var f2 = new ContinuedFraction([2, 1, 2, 3]);

			expect(f1.mul(f2).terms).toBeJsonEqual([7, 1, 1, 2, 6]);
		});

		it('div', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			var f2 = new ContinuedFraction([2, 1, 2, 3]);

			expect(f1.div(f2).terms).toBeJsonEqual([1, 24]);
		});

		it('div to NaN', function(){
			var f1 = new ContinuedFraction([0]);
			var f2 = new ContinuedFraction([0]);

			expect(f1.div(f2).terms).toBeJsonEqual([Number.NaN]);
		});

		it('op', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			var f2 = new ContinuedFraction([2, 1, 2, 3]);

			expect(f1.op(f2, '2 x + 3 y').terms).toBeJsonEqual([13, 1, 2, 1, 1, 1, 3]);
		});

		it('integer part', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);

			expect(f1.integerPart().terms).toBeJsonEqual([2]);
		});

		it('fractional part', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);

			expect(f1.fractionalPart().terms).toBeJsonEqual([0, 1, 4, 3]);
		});

		it('inverse of less-than-one number', function(){
			var f1 = new ContinuedFraction([0, 1, 4, 3]);

			expect(f1.inverse().terms).toBeJsonEqual([1, 4, 3]);
		});

		it('inverse of positive', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);

			expect(f1.inverse().terms).toBeJsonEqual([0, 2, 1, 4, 3]);
		});

		it('inverse of negative', function(){
			var f1 = new ContinuedFraction([-2, 1, 4, 3]);

			expect(f1.inverse().terms).toBeJsonEqual([-1, 6, 3]);
		});

		it('compareTo gt', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			var f2 = new ContinuedFraction([2, 1, 2, 3]);

			expect(f1.compareTo(f2)).toBe(1);
		});

		it('compareTo lt', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);
			var f2 = new ContinuedFraction([2, 1, 2, 3]);

			expect(f2.compareTo(f1)).toBe(-1);
		});

		it('compareTo eq', function(){
			var f1 = new ContinuedFraction([2, 1, 4, 3]);

			expect(f1.compareTo(f1)).toBe(0);
		});
	});
});
