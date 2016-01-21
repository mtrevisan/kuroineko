/**
 * @class Logger
 *
 * @see {@link https://github.com/bower/logger/blob/master/lib/Logger.js}
 * @see {@link https://github.com/jonnyreeves/js-logger/blob/master/src/logger.js}
 * @see {@link https://github.com/jonbretman/logger/blob/master/logger.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** Stores all created loggers */
	var LOGGERS = {},
	/** Stores all logs */
		LOGS = {
			all: []
		};

	/** @constant */
	var LEVEL_OFF = 'none',
	/** @constant */
		LEVEL_DEBUG = 'debug',
	/** @constant */
		LEVEL_INFO = 'info',
	/** @constant */
		LEVEL_WARN = 'warn',
	/** @constant */
		LEVEL_ERROR = 'error',
	/** @constant */
		LEVELS = [LEVEL_DEBUG, LEVEL_INFO, LEVEL_WARN, LEVEL_ERROR],
	/** @constant */
		CONFIG = {
			rootLogger: LEVEL_DEBUG,
			showTime: true,
			out: 'console'
		};

	/**
	 * Gets a logger. If the logger does not exist it is created.
	 *
	 * @param name			The unique name of the logger
	 * @param [config]	The configuration object in the form <code>{rootLogger: 'DEBUG', showTime: true, out: function(message){}}</code>
	 */
	var Constructor = function(name, config){
		if(!name)
			throw 'A Logger must have a name';

		if(config)
			for(var k in config)
				CONFIG[k] = config[k];

		if(LOGGERS[name])
			return LOGGERS[name];

		this.name = name;
		this.interceptors = [];
		this.piped = [];

		LOGGERS[name] = this;
		LOGS[name] = [];
	};

	Constructor.LEVEL_OFF = LEVEL_OFF;
	Constructor.LEVEL_DEBUG = LEVEL_DEBUG;
	Constructor.LEVEL_INFO = LEVEL_INFO;
	Constructor.LEVEL_WARN = LEVEL_WARN;
	Constructor.LEVEL_ERROR = LEVEL_ERROR;

	/** Intercepts log events, calling <code>fn</coe> before listeners of the instance */
	var intercept = function(fn){
		this.interceptors.push(fn);
	};

	/** Pipes all logger events to another logger */
	var pipe = function(emitter){
		this.piped.push(emitter);
	};

	/**
	 * Creates a new logger that pipes events to the parent logger
	 *
	 * @param [config]	The configuration object in the form <code>{rootLogger: 'DEBUG', showTime: true, out: function(message){}}</code>
	 */
	var geminate = function(config){
		var logger = new Constructor(this.name + '|gemination', config);
		logger.pipe(this);
		return logger;
	};

	/** Emits a log event */
	var log = function(level, id, message, data){
		if(LEVELS.indexOf(level) < 0 && level != LEVEL_OFF)
			return;

		var log = {
			level: level,
			message: message,
			data: data
		};

		//run interceptors before
		this.interceptors.forEach(function(interceptor){
			interceptor.call(this, id, log);
		});

		message = (CONFIG.showTime? getTime() + ' ': '')
			+ '[' + level.toUpperCase() + '] '
			+ message
			+ (data? ' ' + JSON.stringify(data): '');

		//save the message
		LOGS.all.push(message);
		(LOGS[id] = LOGS[id] || []).push(message);

		//see if this should be logged
		if(shouldLog(level)){
			//print message
			if(ObjectHelper.isFunction(CONFIG.out))
				CONFIG.out(message);
			else
				console.log(message);
		}

		//pipe
		this.piped.forEach(function(emitter){
			emitter.log.call(emitter, arguments);
		});
	};

	/**
	 * Gets a date string to use for log messages.
	 *
	 * @private
	 */
	var getTime = function(){
		return (new Date()).toISOString();
	};

	/** @private */
	var shouldLog = function(level){
		//no logging
		if(CONFIG.rootLogger == LEVEL_OFF)
			return false;

		//specific rule for this logger
		return (LEVELS.indexOf(level) >= LEVELS.indexOf(CONFIG.rootLogger));
	};


	Constructor.prototype = {
		constructor: Constructor,

		intercept: intercept,
		pipe: pipe,
		geminate: geminate,

		log: log,

		logs: LOGS
	};

	//add helpful log methods
	Object.keys(LEVELS).forEach(function(level){
		Constructor.prototype[level] = function(id, message, data){
			this.log(level, id, message, data);
		};
	});

	return Constructor;

});
