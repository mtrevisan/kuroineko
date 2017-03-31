require(['tools/data/structs/DAWG'], function(DAWG){
	QUnit.module('DAWG');

	QUnit.test('DAWG', function(assert){
		var d = new DAWG();

		d.add('abc');
		d.add('abb');
		d.add('ac');
		d.add('a');

		assert.ok(d.contains('a'));
		assert.ok(d.contains('abb'));
		assert.notOk(d.contains('ab'));
		assert.notOk(d.contains('c'));
	});
});
