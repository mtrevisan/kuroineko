/**
 * @class Token
 *
 * @see {@link http://tadeuzagallo.com/blog/writing-a-lambda-calculus-interpreter-in-javascript/}
 * @see {@link https://github.com/tadeuzagallo/lc-js/tree/master/src}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(type, value){
		this.type = type;
		this.value = value;
	};


	Constructor.prototype = {
		constructor: Constructor
	};

	Constructor.createFromList = function(tokens){
		tokens.map(function(token){
			this[token] = token;
		}, this);
	};

	return Constructor;

});
