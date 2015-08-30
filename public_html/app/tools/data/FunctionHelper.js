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
	 * var fn = FunctionHelper.conditions([
	 *		[function(vale){ return (value == 0); }, function(value){ return 'water freezes at 0°C'; }],
	 *		[function(vale){ return (value == 100); }, function(value){ return 'water boils at 100°C'; }],
	 *		[function(){ return true; }, function(value){ return 'nothing special happens at ' + value + '°C'; }]
	 *	]);
	 * fn(0);	//=> 'water freezes at 0°C'
	 * fn(50);	//=> 'nothing special happens at 50°C'
	 * fn(100);	//=> 'water boils at 100°C'
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


	return {
		memoize: memoize,
		compose: compose,
		curry: curry,
		choice: choice
	};

});
