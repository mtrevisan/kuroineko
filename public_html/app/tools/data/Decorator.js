/**
 * @class Decorator
 *
 * @see {@link http://robdodson.me/javascript-design-patterns-decorator/}
 *
 * @author Mauro Trevisan
 */
define(function(){

	/**
	 * @param {Object} obj			Object to be decorated
	 * @param {String} name			Function name to override, or an array of objects [{name: name, fn: funct}, {...}]
	 * @param {Function} [funct]	Function that overrides the parent one, e.g. has the same sign (can call this._super[name](...) to access
	 *										the parent method)
	 */
	var decorate = function(obj, name, funct){
		if(funct)
			return decorate(obj, [{name: name, fn: funct}]);

		var F = function(){};
		//create prototype chain
		F.prototype = obj;
		var decorated = new F();
		decorated._super = F.prototype;

		//mixin properties/methods of the decorator overrides the ones from the prototype
		name.forEach(function(decorator){
			this[decorator.name] = decorator.fn;
		}, decorated);

		return decorated;
	};


	return {
		decorate: decorate
	};

});
