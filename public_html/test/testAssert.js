require(['tools/data/Assert'], function(Assert){
	QUnit.module('Assert');

	QUnit.test('throws error on fail', function(assert){
		assert.throws(function(){
			Assert.assert(false, 'test');
		},
		function(err){
			return (err.toString() == 'AssertionError: test');
		});
	});

	QUnit.test('throws error', function(assert){
		assert.throws(function(){
			Assert.throwError('test');
		},
		function(err){
			return (err.toString() == 'AssertionError: test');
		});
	});

});
