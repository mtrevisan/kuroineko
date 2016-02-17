/**
 * @class Validator
 *
 * @see {@link http://robdodson.me/javascript-design-patterns-decorator/}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/Assert'], function(Assert){

	var Constructor = function(){
		this.errors = [];
		this.decorators = [];
	};

	/**
	 * @param {String} name		Function name to override
	 * @param {Function} funct	Function that accepts an array of errors to be thrown and the value to be validated
	 */
	var decorate = function(name, funct){
		this.decorators.push({name: name, fn: funct});
	};

	/**
	 * @param {Object} data		Data to be validated
	 */
	var validate = function(data){
		this.decorators.forEach(function(decorator){
			decorator.fn(this.errors, data);
		}, this);

		if(this.errors.length)
			Assert.throwError(this.errors.join('\r\n'));
	};


	Constructor.prototype = {
		constructor: Constructor,

		decorate: decorate,
		validate: validate
	};

	return Constructor;

});
