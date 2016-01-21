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
		QUnit.expect(4);

		var logger = new Logger('bla 3', {
			rootLogger: Logger.LEVEL_DEBUG,
			showTime: false
		});
		logger.intercept(function(id, log){
			equal(id, 'base');
			deepEqual(log, {level: Logger.LEVEL_DEBUG, message: 'message', data: undefined});
		});

		logger.log(Logger.LEVEL_DEBUG, 'base', 'message');

		equal(logger.logs.all.length, 1);
		equal(logger.logs.all[0], '[DEBUG] message');
	});

	QUnit.test('constructor - should pipe', function(){
		var logger1 = new Logger('bla 1', {
			rootLogger: Logger.LEVEL_DEBUG,
			showTime: false
		});
		var logger2 = new Logger('bla 2');
		logger1.pipe(logger2);

		logger1.log(Logger.LEVEL_DEBUG, 'base1', 'message');

		equal(logger1.logs.base1.length, 1);
		equal(logger1.logs.base1[0], '[DEBUG] message');
		equal(logger2.logs.base1.length, 1);
		equal(logger2.logs.base1[0], '[DEBUG] message');
	});

	QUnit.test('constructor - should geminate', function(){
		var logger1 = new Logger('bla');
		var logger2 = logger1.geminate();

		notEqual(logger1, logger2);
	});

	QUnit.test('constructor - should log', function(){
		var logger = new Logger('bla 2');

		logger.debug('base2', 'message');

		equal(logger.logs.base2.length, 1);
		equal(logger.logs.base2[0], '[DEBUG] message');
	});
});
