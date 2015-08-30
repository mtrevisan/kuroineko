define(['tools/data/ArrayHelper'], function(ArrayHelper){
	beforeEach(function(){
		this.addMatchers({
			toBeJsonEqual: function(expected){
				var one = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, ''),
					two = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

				return (one === two);
			}
		});
	});

	describe('ArrayHelper', function(){
		it('intersection', function(){
			var result = ArrayHelper.intersection([1, 2, 3, 4].sort(function(a, b){ return a - b; }), [7, 6, 5, 4, 3].sort(function(a, b){ return a - b; }));

			expect(result).toBeJsonEqual([3, 4]);
		});

		it('partition', function(){
			var result = ArrayHelper.partition(function(value){ return (value.indexOf('s') >= 0); }, ['sss', 'ttt', 'foo', 'bars']);

			expect(result).toBeJsonEqual([['sss', 'bars'], ['ttt', 'foo']]);
		});
	});
});
