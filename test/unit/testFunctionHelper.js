define(['tools/data/FunctionHelper'], function(FunctionHelper){
	describe('FunctionHelper', function(){
		it('memoize', function(){
			var count = 0;
			var factorial = FunctionHelper.memoize(function(n){
				count += 1;
				var result = 1;
				for(var i = 2; i <= n; i ++)
					result *= i;
				return result;
			});
			expect(factorial(5)).toBe(120);
			expect(factorial(5)).toBe(120);
			expect(factorial(5)).toBe(120);
			expect(count).toBe(1);
		});

		it('compose', function(){
			var f = FunctionHelper.compose(function(value){ return value + 1; }, function(value){ return -value; }, Math.pow);

			expect(f(3, 4)).toBe(-80);
		});

		it('curry', function(){
			var addFourNumbers = function(a, b, c, d){
				return a + b + c + d;
			};

			var curriedAddFourNumbers = FunctionHelper.curry(addFourNumbers),
				f = curriedAddFourNumbers(1, 2),
				g = f(3);

			expect(g(4)).toBe(10);
		});

		it('choice', function(){
			var fn = FunctionHelper.choice([
				[function(value){ return (value == 0); }, function(){ return 'water freezes at 0°C'; }],
				[function(value){ return (value == 100); }, function(){ return 'water boils at 100°C'; }],
				[function(){ return true; }, function(value){ return 'nothing special happens at ' + value + '°C'; }]
			]);

			expect(fn(0)).toBe('water freezes at 0°C');
			expect(fn(50)).toBe('nothing special happens at 50°C');
			expect(fn(100)).toBe('water boils at 100°C');
		});
	});
});
