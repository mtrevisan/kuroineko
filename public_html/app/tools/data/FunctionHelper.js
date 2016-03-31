/**
 * @class FunctionHelper
 *
 * @author Mauro Trevisan
 */
define(function(){

	var memoize = function(fn){
		return function(){
			var args = Array.prototype.slice.call(arguments),
				hash = '';
			args.forEach(function(arg){
				hash += (arg === Object(arg)? JSON.stringify(arg): arg);
			});
			fn.memoize || (fn.memoize = {});
			if(!(hash in fn.memoize))
				fn.memoize[hash] = fn.apply(this, args);
			return fn.memoize[hash];
		};
	};

	/**
	 * Underscore.js 1.8.3's compose<p>
	 * Returns a function that is the composition of a list of functions, each consuming the return value of the function that follows.
	 */
	var compose = function(){
		var args = arguments,
			start = args.length - 1;
		return function(){
			var i = start,
				result = args[start].apply(this, arguments);
			while(i --)
				result = args[i].call(this, result);
			return result;
		};
	};

	/** http://www.crockford.com/javascript/www_svendtofte_com/code/curried_javascript/index.html */
	var curry = function(func, args, scope){
		args = args || [];
		//arguments still to come
		var n = func.length - args.length,
			savedAccumulator = Array.prototype.slice.apply(args);

		var accumulator = function(moreArgs, sa, nn){
			var savedAccumulatorPrev = sa.slice(0),
				nPrev = nn;
			for(var i = 0, size = moreArgs.length; i < size; i ++, nn --)
				sa.push(moreArgs[i]);
			if(nn)
				return function(){
					//arguments are params, so closure bussiness is avoided
					return accumulator(arguments, sa.slice(0), nn);
				};
			var result = func.apply(scope || this, sa);
			//reset vars, so curried function can be applied to new params
			savedAccumulator = savedAccumulatorPrev;
			n = nPrev;
			return result;
		};
		return accumulator([], savedAccumulator, n);
	};

	/**
	 * Returns a function, {@code fn}, which encapsulates if/else-if/else logic.<p>
	 * This function takes a list of {@code [predicate, transform]} pairs. All of the arguments to {@code fn} are applied to each of the
	 * predicates in turn until one returns a "truthy" value, at which point {@code fn} returns the result of applying its arguments to
	 * the corresponding transformer.<p>
	 * Ramda 0.17.1's cond
	 *
	 * @see {@link https://github.com/ramda/ramda/blob/master/src/cond.js}
	 *
	 * @example
	 * <code>
	 * var fn = FunctionHelper.choice([
	 *		[function(value){ return (value == 0); }, function(value){ return 'water freezes at 0°C'; }],
	 *		[function(value){ return (value == 100); }, function(value){ return 'water boils at 100°C'; }],
	 *		[function(){ return true; }, function(value){ return 'nothing special happens at ' + value + '°C'; }]
	 *	]);
	 * fn(0);	//=> 'water freezes at 0°C'
	 * fn(50);	//=> 'nothing special happens at 50°C'
	 * fn(100);	//=> 'water boils at 100°C'
	 * </code>
	 *
	 * @param {Array} pairs
	 * @return {Function}
	 */
	var choice = function(pairs){
		return function(){
			var len = pairs.length,
				idx, tuple;
			for(idx = 0; idx < len; idx ++){
				tuple = pairs[idx];
				if(tuple[0].apply(this, arguments))
					return tuple[1].apply(this, arguments);
			}
		};
	};

	/**
	 * Creates a delegate function, optionally with a bound scope which, when called, buffers the execution of the passed function for the
	 * configured number of milliseconds. If called again within that period, the impending invocation will be canceled, and the timeout
	 * period will begin again.
	 *
	 * @see Ext JS 4.0.7's Ext.Function.createBuffered
	 *
	 * @param {Function} fn		The function to invoke on a buffered timer.
	 * @param {Number} buffer	The number of milliseconds by which to buffer the invocation of the function.
	 * @param {Object} [scope]	The scope (<code>this</code> reference) in which the passed function is executed.
	 *									If omitted, defaults to the scope specified by the caller.
	 * @param {Array} [args]	Override arguments for the call. Defaults to the arguments passed by the caller.
	 * @returns {Function}		A function which invokes the passed function after buffering for the specified time.
	 */
	var createBuffered = function(fn, buffer, scope, args){
		var timerID;

		return function(){
			if(timerID){
				clearTimeout(timerID);
				timerID = null;
			}

			var self = this;
			timerID = setTimeout(function(){
				fn.apply(scope || self, args || arguments);
			}, buffer);
		};
	};

	/**
	 * Creates a throttled version of the passed function which, when called repeatedly and rapidly, invokes the passed function only
	 * after a certain interval has elapsed since the previous invocation.
	 * <p>
	 * This is useful for wrapping functions which may be called repeatedly, such as a handler of a mouse move event when the processing
	 * is expensive.
	 *
	 * @see Ext JS 4.0.7's Ext.Function.createThrottled
	 *
	 * @param {Function} fn			The function to execute at a regular time interval.
	 * @param {Number} interval	The interval **in milliseconds** on which the passed function is executed.
	 * @param {Object} [scope]		The scope (<code>this</code> reference) in which the passed function is executed.
	 *										If omitted, defaults to the scope specified by the caller.
	 * @returns {Function}			A function which invokes the passed function at the specified interval.
	 */
	var createThrottled = function(fn, interval, scope){
		var execute = function(){
				fn.apply(scope || this, lastArgs);
				lastCallTime = (new Date()).getTime();
			},
			lastCallTime, elapsed, lastArgs, timer;

		return function(){
			elapsed = (new Date()).getTime() - lastCallTime;
			lastArgs = arguments;

			clearTimeout(timer);
			if(!lastCallTime || elapsed >= interval)
				execute();
			else
				timer = setTimeout(execute, interval - elapsed);
		};
	};


	return {
		memoize: memoize,
		compose: compose,
		curry: curry,
		choice: choice,

		createBuffered: createBuffered,
		createThrottled: createThrottled
	};

});
