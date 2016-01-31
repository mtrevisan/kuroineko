require(['tools/data/FunctionHelper'], function(FunctionHelper){
	QUnit.module('FunctionHelper');

	QUnit.test('memoize', function(assert){
		var count = 0;
		var factorial = FunctionHelper.memoize(function(n){
			count += 1;
			var result = 1;
			for(var i = 2; i <= n; i ++)
				result *= i;
			return result;
		});
		assert.equal(factorial(5), 120);
		assert.equal(factorial(5), 120);
		assert.equal(factorial(5), 120);
		assert.equal(count, 1);
	});

	QUnit.test('compose', function(assert){
		var f = FunctionHelper.compose(function(value){ return value + 1; }, function(value){ return -value; }, Math.pow);

		assert.equal(f(3, 4), -80);
	});

	QUnit.test('curry', function(assert){
		var addFourNumbers = function(a, b, c, d){
			return a + b + c + d;
		};

		var curriedAddFourNumbers = FunctionHelper.curry(addFourNumbers),
			f = curriedAddFourNumbers(1, 2),
			g = f(3);

		assert.equal(g(4), 10);
	});

	QUnit.test('choice', function(assert){
		var fn = FunctionHelper.choice([
			[function(value){ return (value == 0); }, function(){ return 'water freezes at 0°C'; }],
			[function(value){ return (value == 100); }, function(){ return 'water boils at 100°C'; }],
			[function(){ return true; }, function(value){ return 'nothing special happens at ' + value + '°C'; }]
		]);

		assert.equal(fn(0), 'water freezes at 0°C');
		assert.equal(fn(50), 'nothing special happens at 50°C');
		assert.equal(fn(100), 'water boils at 100°C');
	});
});
