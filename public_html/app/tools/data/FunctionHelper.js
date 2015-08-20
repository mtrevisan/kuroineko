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
		var args = arguments;
		var start = args.length - 1;
		return function(){
			var i = start;
			var result = args[start].apply(this, arguments);
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

		var accumulator = function(moreArgs, savedAccumulator, n){
			var savedAccumulatorPrev = savedAccumulator.slice(0),
				nPrev = n;
			for(var i = 0, size = moreArgs.length; i < size; i ++, n --)
				savedAccumulator.push(moreArgs[i]);
			if(!n){
				var result = func.apply(scope || this, savedAccumulator);
				//reset vars, so curried function can be applied to new params
				savedAccumulator = savedAccumulatorPrev;
				n = nPrev;
				return result;
			}
			else
				return function(){
					//arguments are params, so closure bussiness is avoided
					return accumulator(arguments, savedAccumulator.slice(0), n);
				};
		};
		return accumulator([], savedAccumulator, n);
	};


	return {
		memoize: memoize,
		compose: compose,
		curry: curry
	};

});
