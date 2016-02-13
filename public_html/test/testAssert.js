require(['tools/data/Assert'], function(Assert){
	QUnit.module('Assert');

	QUnit.test('throws', function(assert){
		assert.throws(function(){
			Assert.assert(false, 'test');
		},
		function(err){
			return (err.toString() == 'AssertionError: test');
		});
	});

});
