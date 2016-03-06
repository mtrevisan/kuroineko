require(['tools/data/Decorator'], function(Decorator){
	QUnit.module('Decorator');

	QUnit.test('decorate', function(assert){
		var done = assert.async(3);

		var obj = new (function(){
			return {
				test: function(input){
					assert.equal(input, 5);

					done();
				},
				untouched: function(input){
					assert.equal(input, 4);

					done();
				}
			};
		})();

		obj = Decorator.decorate(obj, 'test', function(input){
			this.__super__.test(input);

			assert.equal(input + 2, 7);

			done();
		});

		obj.untouched(4);
		obj.test(5);
	});
});
