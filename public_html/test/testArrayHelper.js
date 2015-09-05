require(['tools/data/ArrayHelper'], function(ArrayHelper){
	test('intersection', function(){
		var result = ArrayHelper.intersection([1, 2, 3, 4].sort(function(a, b){ return a - b; }), [7, 6, 5, 4, 3].sort(function(a, b){ return a - b; }));

		deepEqual(result, [3, 4]);
	});

	test('partition', function(){
		var result = ArrayHelper.partition(function(value){ return (value.indexOf('s') >= 0); }, ['sss', 'ttt', 'foo', 'bars']);

		deepEqual(result, [['sss', 'bars'], ['ttt', 'foo']]);
	});
});
