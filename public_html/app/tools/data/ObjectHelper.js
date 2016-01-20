/**
 * @class ObjectHelper
 *
 * @author Mauro Trevisan
 */
define(function(){

	/** Object#toString result references. */
	/** @constant */
	var TYPE_FUNCTION = 'Function',
	/** @constant */
		TYPE_ARRAY = 'Array',
	/** @constant */
		TYPE_OBJECT = 'Object',
	/** @constant */
		TYPE_STRING = 'String',
	/** @constant */
		TYPE_REGEXP = 'RegExp';


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
	 * Sencha Touch 2.4.0's Ext.apply<p>
	 * Copies all the properties of config to the specified object.
	 *
	 * @param {Object} object		The receiver of the properties.
	 * @param {Object} config		The source of the properties.
	 * @param {Object} defaults	A different object that will also be applied for default values.
	 * @return {Object}				Returns the object
	 */
	var apply = function(object, config, defaults){
		if(defaults)
			apply(object, defaults);

		if(object && config && type(config) == TYPE_OBJECT)
			for(var i in config)
				object[i] = config[i];

		return object;
	};

	/**
	 * Sencha Touch 2.4.2's Ext.applyIf<p>
	 * Copies all the properties of config to the specified object if they don't already exist.
	 *
	 * @param {Object} object		The receiver of the properties.
	 * @param {Object} config		The source of the properties.
	 * @param {Object} defaults	A different object that will also be applied for default values.
	 * @return {Object}				Returns the object
	 */
	var applyIf = function(object, config, defaults){
		if(defaults)
			apply(object, defaults);

		if(object && config && type(config) == TYPE_OBJECT)
			for(var i in config)
				if(object[i] === undefined)
					object[i] = config[i];

		return object;
	};

	/**
	 * Add properties to an object
	 * Usually used to create a public reference to a private variable.
	 */
	var extend = function(root, props){
		for(var key in props)
			if(props.hasOwnProperty(key))
				root[key] = props[key];
		return root;
	};

	/**
	 * Copy an object property then delete the original
	 * Usually used to copy the publicized private variable back to a private variable and delete the public reference.
	 */
	var privatize = function(root, prop){
		var data = root[prop];
		delete root[prop];
		return data;
	};


	var type = function(value){
		return Object.prototype.toString.call(value).match(/^\[object\s(.*)\]$/)[1];
	};

	var isFunction = function(value){
		return (type(value) == TYPE_FUNCTION);
	};

	var isObject = function(value){
		return (type(value) == TYPE_OBJECT);
	};

	/** Underscore.js 1.8.3's isUndefined */
	var isDefined = function(value){
		return (value !== void 0);
	};

	var isString = function(value){
		return (type(value) == TYPE_STRING);
	};

	var isRegExp = function(value){
		return (type(value) == TYPE_REGEXP);
	};

	var isFloat = function(value){
		return (Number(value) == value);
	};

	var path = function(container, selector){
		var data = container,
			parts = Array.prototype.concat(selector.split('.')),
			k, part;
		for(k in parts){
			part = parts[k];
			if(!data[part])
				return undefined;

			data = data[part];
		}
		return (data != container? data: undefined);
	};

	/**
	 * Returns a partial copy of an object containing only the keys specified. If the key does not exist, the property is ignored.
	 *
	 * @example
	 * <code>
	 * ObjectHelper.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
	 * </code>
	 *
	 * @param {Array} names	An array of String property names to copy onto a new object
	 * @param {Object} obj	The object to copy from
	 * @return {Object} A new object with only properties from {@code names} on it.
	 */
	var pick = function(names, obj){
		var result = {};
		for(var idx = 0; idx < names.length; idx ++)
			if(names[idx] in obj)
				result[names[idx]] = obj[names[idx]];
		return result;
	};

	/** Useful for I18N management. */
	var translate = function(resource, key, defaultLabel){
		var label = path(resource, key);
		return (isString(label)? label: defaultLabel || (key + '.undefined'));
	};

	/** Sencha Touch 2.4.0's Ext.clone */
	var clone = function(item, scope){
		if(!item)
			return item;

		var typ = type(item),
			cloned;

		if(typ == TYPE_FUNCTION)
			cloned = item.clone();
		else if(typ == TYPE_ARRAY){
			cloned = [];

			var i = item.length;
			while(i --)
				cloned[i] = clone(item[i], scope || item);
		}
		else if(typ == TYPE_OBJECT){
			//make sure the returned object has the same prototype as the original
			cloned = Object.create(item.constructor.prototype);

			for(var key in item)
				cloned[key] = clone(item[key], scope || item);
		}

		return cloned || item;
	};

	var deepEquals = function(a, b){
		var typeA = type(a),
			typeB = type(b);

		if(typeA != typeB)
			return false;

		if(typeA === TYPE_ARRAY){
			if(a.length != b.length)
				return false;

			return a.every(function(k, i){ return deepEquals(k, this[i]); }, b);
		}

		if(typeA === TYPE_OBJECT){
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
	var saveFile = function(data, filename, type){
		var a = document.getElementById('__saveFile');
		if(!a){
			a = document.createElement('a');
			a.id = '__saveFile';
			a.style = 'display:none';
			document.body.appendChild(a);
		}

		var blob = new Blob([data], {type: type}),
			url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};


	return {
		apply: apply,
		applyIf: applyIf,
		extend: extend,
		privatize: privatize,

		type: type,
		isFunction: isFunction,
		isObject: isObject,
		isDefined: isDefined,
		isString: isString,
		isRegExp: isRegExp,
		isFloat: isFloat,

		path: path,
		pick: pick,
		translate: translate,

		clone: clone,

		deepEquals: deepEquals,

		saveBinaryFile: saveBinaryFile,
		saveJSONFile: saveJSONFile
	};

});
