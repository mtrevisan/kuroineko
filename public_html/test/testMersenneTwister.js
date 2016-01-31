require(['tools/data/random/MersenneTwister'], function(MersenneTwister){
	QUnit.module('MersenneTwister');

	QUnit.test('MersenneTwister - seeded', function(assert){
		var m = new MersenneTwister(123);

		assert.equal(m.random(), 0.6964691872708499);
	});
});
