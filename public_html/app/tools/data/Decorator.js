/**
 * @class Decorator
 *
 * @see {@link http://robdodson.me/javascript-design-patterns-decorator/}
 *
 * @author Mauro Trevisan
 */
define(function(){

	/**
	 * @param {String} name			Function name to override, or an array of objects [{name: name, fn: funct}, {...}]
	 * @param {Function} [funct]	Function that overrides the parent one, e.g. has the same sign (can call this._super[name](...) to access
	 *										the parent method)
	 */
	var decorate = function(name, funct){
		if(funct)
			return decorate([{name: name, fn: funct}]);

		var fn = function(){};
		//create prototype chain
		fn.prototype = this;
		var decorated = new fn();
		decorated._super = fn.prototype;

		//mixin properties/methods of the decorator overrides the ones from the prototype
		name.forEach(function(decorator){
			decorated[decorator.name] = decorator.fn;
		});

		return decorated;
	};


	return {
		decorate: decorate
	};

});
