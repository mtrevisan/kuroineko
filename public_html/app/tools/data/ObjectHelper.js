/**
 * @class ObjectHelper
 *
 * @author Mauro Trevisan
 */
define(function(){

	Function.prototype.clone = function(){
		var scope = this;
		if(this.clonedFrom)
			scope = this.clonedFrom;

		var tmp = function(){
			return scope.apply(this, arguments);
		};
		for(var key in this)
			if(this.hasOwnProperty(key))
				tmp[key] = this[key];

		tmp.clonedFrom = scope;

		return tmp;
	};


	/**
	 * Sencha Touch 2.4.0's Ext.apply
	 * Copies all the properties of config to the specified object.
	 *
	 * @param {Object} object The receiver of the properties.
	 * @param {Object} config The source of the properties.
	 * @param {Object} [defaults] A different object that will also be applied for default values.
	 * @return {Object} returns obj
	 */
	var apply = function(object, config, defaults){
		if(defaults)
			apply(object, defaults);

		if(object && config && typeof config === 'object')
			for(var i in config)
				object[i] = config[i];

		return object;
	};


	/** Sencha Touch 2.4.0's Ext.isFunction */
	var isFunction = function(value){
		return (typeof value === 'function');
	};

	/** Sencha Touch 2.4.0's Ext.isObject */
	var isObject = (toString.call(null) === '[object Object]'?
		function(value){
			return (value !== null && value !== undefined && toString.call(value) === '[object Object]');
		}:
		function(value){
			return (toString.call(value) === '[object Object]');
		}
	);

	/** Sencha Touch 2.4.0's Ext.isDefined */
	var isDefined = function(value){
		return (typeof value !== 'undefined');
	};

	/** Sencha Touch 2.4.0's Ext.isString */
	var isString = function(value){
		return (typeof value === 'string');
	};

	var isRegExp = function(value){
		return (toString.call(value) === '[object RegExp]');
	};

	var extractData = function(container, selector){
		var data = container,
			parts = Array.prototype.concat(selector.split('.')),
			k, part;
		for(k in parts){
			part = parts[k];
			if(!data[part])
				break;

			data = data[part];
		}
		return (data != container? data: undefined);
	};

	/** Useful for I18N management. */
	var translate = function(resource, key, defaultLabel){
		var label = extractData(resource, key);
		return (isString(label)? label: defaultLabel || (key + '.undefined'));
	};

	/** Sencha Touch 2.4.0's Ext.clone */
	var clone = function(item, scope){
		if(!item)
			return item;

		var type = toString.call(item),
			cloned;

		//Function
		if(typeof item === 'function')
			cloned = item.clone();
		//Array
		else if(type === '[object Array]'){
			cloned = [];

			var i = item.length;
			while(i --)
				cloned[i] = clone(item[i], scope || item);
		}
		//Object
		else if(type === '[object Object]'){
			//make sure the returned object has the same prototype as the original
			cloned = Object.create(item.constructor.prototype);

			for(var key in item)
				cloned[key] = clone(item[key], scope || item);
		}

		return cloned || item;
	};

	var deepEquals = function(a, b){
		var typeA = toString.call(a),
			typeB = toString.call(b);

		if(typeA != typeB)
			return false;

		//Array
		if(typeA === '[object Array]'){
			if(a.length != b.length)
				return false;

			return a.every(function(k, i){ return deepEquals(k, this[i]); }, b);
		}

		//Object
		if(typeA === '[object Object]'){
			var keysA = Object.keys(a).sort(),
				keysB = Object.keys(b).sort();
			if(keysA.length != keysB.length)
				return false;
			if(keysA.join('') != keysB.join(''))
				return false;

			return keysA.every(function(k){ return deepEquals(a[k], b[k]); });
		}

		return (a === b);
	};


	var saveBinaryFile = function(bytes, filename){
		saveFile(new Uint8Array(bytes), filename, 'application/octet-stream');
	};

	var saveJSONFile = function(obj, filename){
		saveFile(JSON.stringify(obj), filename, 'text/plain;charset=utf-8');
	};

	/** @private */
	var saveFile = (function(){
		 var a = document.createElement('a');
		 document.body.appendChild(a);
		 a.style = 'display:none';

		return function(data, filename, type){
			var blob = new Blob([data], {type: type}),
				url = window.URL.createObjectURL(blob);
			a.href = url;
			a.download = filename;
			a.click();
			window.URL.revokeObjectURL(url);
		};
	}());


	return {
		apply: apply,

		isFunction: isFunction,
		isObject: isObject,
		isDefined: isDefined,
		isString: isString,
		isRegExp: isRegExp,

		extractData: extractData,
		translate: translate,

		clone: clone,

		deepEquals: deepEquals,

		saveBinaryFile: saveBinaryFile,
		saveJSONFile: saveJSONFile
	};

});
