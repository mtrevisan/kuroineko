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
			return (hash in fn.memoize?
				fn.memoize[hash]:
				fn.memoize[hash] = fn.apply(this, args));
		};
	};


	return {
		memoize: memoize
	};

});
