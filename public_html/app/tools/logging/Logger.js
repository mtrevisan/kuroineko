/**
 * @class Logger
 *
 * @see {@link https://github.com/bower/logger/blob/master/lib/Logger.js}
 * @see {@link https://github.com/jonnyreeves/js-logger/blob/master/src/logger.js}
 * @see {@link https://github.com/jonbretman/logger/blob/master/logger.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/data/StringHelper'], function(ObjectHelper, StringHelper){

	/** Stores all created loggers */
	var LOGGERS = {},
	/** Stores all logs */
		LOGS = {
			all: []
		};

	/** @constant */
	var LEVEL_OFF = 'NONE',
	/** @constant */
		LEVEL_TRACE = 'TRACE',
	/** @constant */
		LEVEL_DEBUG = 'DEBUG',
	/** @constant */
		LEVEL_INFO = 'INFO',
	/** @constant */
		LEVEL_WARN = 'WARN',
	/** @constant */
		LEVEL_ERROR = 'ERROR',
	/** @constant */
		LEVELS = [LEVEL_TRACE, LEVEL_DEBUG, LEVEL_INFO, LEVEL_WARN, LEVEL_ERROR],
	/** @constant */
		CONFIG_DEFAULT = {
			rootLogger: LEVEL_TRACE,
			//the maximum number of records to keep (if the number of log gets bigger than 10% over this value, then it is sliced down to 90% of this value)
			maxRecordSize: undefined,
			showTime: true,
			out: 'console'
		},
	/** @constant */
		PADDING = LEVELS.reduce(function(max, level){ return Math.max(max, level.length); }, 0);


	/**
	 * Gets a logger. If the logger does not exist it is created.
	 *
	 * @param name		The unique name of the logger
	 * @param [conf]	The configuration object in the form <code>{rootLogger: 'DEBUG', showTime: true, out: function(message){}}</code>
	 */
	var Constructor = function(name, conf){
		if(!name)
			throw 'A Logger must have a name';

		this.config = {};
		for(var k in CONFIG_DEFAULT)
			this.config[k] = CONFIG_DEFAULT[k];
		if(conf)
			for(k in conf)
				this.config[k] = conf[k];

		if(LOGGERS[name])
			return LOGGERS[name];

		this.name = name;
		this.interceptors = [];
		this.piped = [];

		LOGGERS[name] = this;
		LOGS[name] = [];


		//add helpful log methods
		LEVELS.forEach(function(level){
			Object.getPrototypeOf(this)[level.toLowerCase()] = function(id, message, data){
				this.log(id, level, message, data);
			};
		}, this);
	};

	Constructor.LEVEL_OFF = LEVEL_OFF;
	Constructor.LEVEL_TRACE = LEVEL_TRACE;
	Constructor.LEVEL_DEBUG = LEVEL_DEBUG;
	Constructor.LEVEL_INFO = LEVEL_INFO;
	Constructor.LEVEL_WARN = LEVEL_WARN;
	Constructor.LEVEL_ERROR = LEVEL_ERROR;


	/**
	 * @param {String} level	One of LEVEL_OFF, LEVEL_TRACE, LEVEL_DEBUG, LEVEL_INFO, LEVEL_WARN, or LEVEL_ERROR
	 */
	var setLevel = function(level){
		level = level.toUpperCase();
		if(LEVEL_OFF != level && LEVELS.indexOf(level) < 0)
			throw 'setLevel called with invalid level: ' + level;

		this.config.rootLogger = level;
	};

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
	 * @param [conf]	The configuration object in the form <code>{rootLogger: 'DEBUG', showTime: true, out: function(message){}}</code>
	 */
	var geminate = function(conf){
		var logger = new Constructor(this.name + '|gemination', conf || this.config);
		logger.pipe(this);
		return logger;
	};

	/**
	 * Emits a log event
	 *
	 * @param {String} id		Identifier of the particular log to use
	 * @param {String} level	Level at which to log the message
	 * @param {String} message	Message to log
	 * @param {Object} [data]	Optional data to associate to the log
	 */
	var log = function(id, level, message, data){
		if(LEVELS.indexOf(level) < 0 || level == LEVEL_OFF)
			return;

		var now = new Date();
		message = (this.config.showTime? now.toISOString().replace(/[TZ]/g, ' ') + ' ': '')
			+ '[' + level + '] ' + StringHelper.stringRepeat(' ', PADDING - level.length)
			+ message
			+ (data? ', ' + JSON.stringify(data): '');
		var storedMessage = {timestamp: now, level: level, message: message, data: data};

		//run interceptors before
		this.interceptors.forEach(function(interceptor){
			interceptor.call(this, id, storedMessage);
		});

		//save the message
		LOGS.all.push(storedMessage);
		if(id != 'all')
			(LOGS[id] = LOGS[id] || []).push(storedMessage);

		//see if this should be logged
		if(shouldLog.call(this, level)){
			//print message
			if(ObjectHelper.isFunction(this.config.out))
				this.config.out(message);
			else
				console[level.toLowerCase()](message);
		}

		//pipe
		this.piped.forEach(function(emitter){
			emitter.log.call(emitter, arguments);
		});

		if(LOGS.length > this.config.maxRecordSize * 1.1)
			LOGS = LOGS.slice(-Math.floor(this.config.maxRecordSize * 0.9));
	};

	/** @private */
	var shouldLog = function(level){
		return (this.config.rootLogger != LEVEL_OFF && LEVELS.indexOf(level) >= LEVELS.indexOf(this.config.rootLogger));
	};

	/**
	 * @param {String} [id]		Identifier of the particular log to use
	 * @param {String} [level]	The level of the log messages to extract
	 * @param {Date} [from]		The starting date of the log messages to extract
	 * @param {Date} [to]		The ending date of the log messages to extract
	 */
	var extractLogs = function(id, level, from, to){
		var logs = LOGS[id || 'all'];
		return (level || from || to? logs.filter(function(el){
			return (level && el.level == level
				|| from && to && +from <= +el.timestamp && +el.timestamp <= +to
				|| from && !to && +el.timestamp >= +from
				|| !from && to && +el.timestamp <= +to);
		}): logs);
	};


	Constructor.prototype = {
		constructor: Constructor,

		setLevel: setLevel,

		intercept: intercept,
		pipe: pipe,
		geminate: geminate,

		log: log,

		extractLogs: extractLogs
	};

	return Constructor;

});
