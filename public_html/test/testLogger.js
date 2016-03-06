require(['tools/logging/Logger'], function(Logger){
	QUnit.module('Logger');

	QUnit.test('should returns the same instance', function(assert){
		var logger1 = new Logger('bla 1');
		var logger2 = new Logger('bla 1');

		assert.equal(logger1, logger2);
	});

	QUnit.test('should call intercept', function(assert){
		QUnit.expect(5);

		var logger = new Logger('bla 2', {
			showTime: false,
			out: function(){}
		});
		logger.intercept(function(id, log){
			assert.equal(id, 'base');
			assert.equal(log.level, Logger.LEVEL_DEBUG);
			assert.equal(log.message, '[DEBUG] message');
		});

		logger.log('base', Logger.LEVEL_DEBUG, 'message');

		var logs = logger.extractLogs();
		assert.equal(logs.length, 1);
		assert.equal(logs[0].message, '[DEBUG] message');
	});

	QUnit.test('should pipe', function(assert){
		var logger1 = new Logger('bla 3', {
			showTime: false,
			out: function(){}
		});
		var logger2 = new Logger('bla 4', {
			showTime: false,
			out: function(){}
		});
		logger1.pipe(logger2);

		logger1.log('base1', Logger.LEVEL_DEBUG, 'message');

		var logs1 = logger1.extractLogs('base1');
		var logs2 = logger2.extractLogs('base1');
		assert.equal(logs1.length, 1);
		assert.equal(logs1[0].message, '[DEBUG] message');
		assert.equal(logs2.length, 1);
		assert.equal(logs2[0].message, '[DEBUG] message');
	});

	QUnit.test('should geminate', function(assert){
		var logger1 = new Logger('bla 5');
		var logger2 = logger1.geminate();

		assert.notEqual(logger1, logger2);
	});

	QUnit.test('should log', function(assert){
		var logger = new Logger('bla 6', {
			showTime: false,
			out: function(){}
		});

		logger.log('base2', Logger.LEVEL_INFO, 'message');

		var logs = logger.extractLogs('base2');
		assert.equal(logs.length, 1);
		assert.equal(logs[0].message, '[INFO]  message');
	});

	QUnit.test('should log with setted level', function(assert){
		var logger = new Logger('bla 7', {
			showTime: false,
			out: function(message){
				assert.equal(message, '[INFO]  message');
			}
		});

		logger.log('base3', Logger.LEVEL_INFO, 'message');

		var logs = logger.extractLogs('base3');
		assert.equal(logs.length, 1);
		assert.equal(logs[0].message, '[INFO]  message');


		logger.setLevel(Logger.LEVEL_WARN);
		logger.log('base3', Logger.LEVEL_INFO, 'message2');

		logs = logger.extractLogs('base3');
		assert.equal(logs.length, 2);
		assert.equal(logs[0].message, '[INFO]  message');
		assert.equal(logs[1].message, '[INFO]  message2');
	});

	QUnit.test('should log error', function(assert){
		var logger = new Logger('bla 8', {
			showTime: false,
			out: function(){}
		});

		logger.error('base4', 'message');

		var logs = logger.extractLogs('base4');
		assert.equal(logs.length, 1);
		assert.equal(logs[0].message, '[ERROR] message');
	});
});
