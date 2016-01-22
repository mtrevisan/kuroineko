require(['tools/logging/Logger'], function(Logger){
	QUnit.module('Logger');

	QUnit.test('constructor without name', function(){
		throws(function(){
			new Logger();
		},
		function(err){
			return (err.toString() == 'A Logger must have a name');
		});
	});

	QUnit.test('constructor - should returns the same instance', function(){
		var logger1 = new Logger('bla');
		var logger2 = new Logger('bla');

		equal(logger1, logger2);
	});

	QUnit.test('constructor - should call intercept', function(){
		QUnit.expect(5);

		var logger = new Logger('bla 3', {
			showTime: false,
			out: function(){}
		});
		logger.intercept(function(id, log){
			equal(id, 'base');
			equal(log.level, Logger.LEVEL_DEBUG);
			equal(log.message, '[DEBUG] message');
		});

		logger.log('base', Logger.LEVEL_DEBUG, 'message');

		var logs = logger.extractLogs();
		equal(logs.length, 1);
		equal(logs[0].message, '[DEBUG] message');
	});

	QUnit.test('constructor - should pipe', function(){
		var logger1 = new Logger('bla 1', {
			showTime: false,
			out: function(){}
		});
		var logger2 = new Logger('bla 2', {
			showTime: false,
			out: function(){}
		});
		logger1.pipe(logger2);

		logger1.log('base1', Logger.LEVEL_DEBUG, 'message');

		var logs1 = logger1.extractLogs('base1');
		var logs2 = logger2.extractLogs('base1');
		equal(logs1.length, 1);
		equal(logs1[0].message, '[DEBUG] message');
		equal(logs2.length, 1);
		equal(logs2[0].message, '[DEBUG] message');
	});

	QUnit.test('constructor - should geminate', function(){
		var logger1 = new Logger('bla');
		var logger2 = logger1.geminate();

		notEqual(logger1, logger2);
	});

	QUnit.test('constructor - should log', function(){
		var logger = new Logger('bla 2', {
			showTime: false,
			out: function(){}
		});

		logger.log('base2', Logger.LEVEL_INFO, 'message');

		var logs = logger.extractLogs('base2');
		equal(logs.length, 1);
		equal(logs[0].message, '[INFO]  message');
	});

	QUnit.test('constructor - should log error', function(){
		var logger = new Logger('bla 3', {
			showTime: false,
			out: function(){}
		});

		logger.error('base3', 'message');

		var logs = logger.extractLogs('base3');
		equal(logs.length, 1);
		equal(logs[0].message, '[ERROR] message');
	});
});
