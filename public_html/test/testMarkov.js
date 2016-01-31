require(['tools/lang/recognition/Markov', 'tools/data/ObjectHelper'], function(Markov, ObjectHelper){
	QUnit.module('Markov');

	QUnit.test('Markov order 1 - should return empty string if no chain', function(assert){
		var m = new Markov(1);

		assert.equal(m.ask(), '');
	});

	QUnit.test('Markov order 1 - should for single entry return input string', function(assert){
		var m = new Markov(1);

		m.feed('markov');

		assert.deepEqual(m.ask(), 'markov');
	});

	QUnit.test('Markov order 1 - should accept multiple entries and return string', function(assert){
		var m = new Markov(1);

		m.feed('hello');
		m.feed('markov');

		assert.ok(ObjectHelper.isString(m.ask()));
	});
});
