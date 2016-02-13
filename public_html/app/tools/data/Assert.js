/**
 * @class Assert
 *
 * @see {@link https://github.com/defunctzombie/commonjs-assert/blob/master/assert.js}
 * @see {@link https://github.com/timoxley/assert/blob/master/index.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	/**
	 * Creator of Errors
	 * @param {String} name					Error name
	 * @param {String} [defaultMessage]	Default message
	 * @returns {Function}	The error to be instanced
	 */
	var createErrorType = function(name, defaultMessage){
		var E = function(message, stackStartFunction){
			message = message || defaultMessage;
			stackStartFunction = stackStartFunction || assert;

			if(Error.captureStackTrace)
				//creates a 'stack' property on this, which returns a string representing the location in the code at which
				//Error.captureStackTrace() was called
				Error.captureStackTrace(this, stackStartFunction);
			else{
				//get a stacktrace for non V8 browsers
				var stack = (new Error()).stack,
					idx;
				if(stack){
					//try to strip useless frames
					idx = stack.indexOf('\n' + stackStartFunction.name);
					if(idx >= 0)
						//once located the function frame, strip out everything before it (and its line)
						stack = stack.substring(stack.indexOf('\n', idx + 1) + 1);

					this.stack = stack;
				}
			}

			this.message = message;
		};

		E.prototype = new Error();
		E.prototype.constructor = E;
		E.prototype.name = name;
		return E;
	};

	/** @private */
	var AssertionError = createErrorType('AssertionError', 'Assertion error');


	/**
	 * @param {Boolean} condition					The condition to be verified
	 * @param {String} message						The message to print if the condition is false
	 * @param {Function} stackStartFunction	The function this assert refers to
	 * @throws {AssertionError} The error if condition is false
	 */
	var assert = function(condition, message, stackStartFunction){
		if(!condition)
			throwError(message, stackStartFunction);
	};

	/**
	 * @param {String} message						The message to print if the condition is false
	 * @param {Function} stackStartFunction	The function this assert refers to
	 * @throws {AssertionError} The error if condition is false
	 */
	var throwError = function(message, stackStartFunction){
		throw new AssertionError(message, stackStartFunction);
	};


	return {
		createErrorType: createErrorType,

		assert: assert,
		throwError: throwError
	};

});
