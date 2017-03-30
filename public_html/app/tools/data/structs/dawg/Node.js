/**
 * An implementation of a Directed Acyclic Word Graph.
 *
 * @class DAWG Node
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone'], function(Phone){

	var Constructor = function(value, parent){
		this.value = value;
		this.parent = parent;
		this.nextChildren = [];
		this.leaf = false;

		//compression internals
		this.index = -1;
	};


	var findChild = function(value){
		if(!value)
			return null;
		return this.nextChildren.find(function(nextChild){
			return (value == nextChild.value);
		});
	};

	var addChild = function(value){
		var nextChild = new Node(value, this);
		this.nextChildren.push(nextChild);
		return nextChild;
	};

	var toInteger = function(){
		var rv = -1;
		//start with the first child index (use MAX_INDEX, if there are no children)
		if(this.nextChildren.length)
			rv = this.nextChildren[0].index;

		//shift 1 and add the terminal bit
		rv = (rv << 1) | (this.leaf? 0x01: 0x00);
		//shift 16 and add the value
		rv = (rv << 16) | this.value;
		return rv;
	};

	Constructor.canTerminate = function(index){
		return ((index >> 16) & 0x01);
	};

	Constructor.getChar = function(index){
		return (index & 0xFFFF);
	};

	var toString = function(){
		var result = '[value:' + this.value + ' prefix:' + prefix() + ' next:';
		this.nextChildren.forEach(function(nextChild){
			result += nextChild.value;
		});
		return result + ']';
	};

	/** @private */
	var prefix = function(){
		var prefix = '';
		var ptr = this;
		while(ptr.parent){
			prefix += ptr.value;
			ptr = ptr.parent;
		}
		return prefix.match(Phone.REGEX_UNICODE_SPLITTER).reverse().join('');
	};

	var equals = function(other){
		if(!other)
			return false;
		if(other === this)
			return true;
		if(!(other instanceof Constructor))
			return false;

		if(this.value !== other.value)
			return false;
		if(this.terminal !== other.terminal)
			return false;
		if(this.nextChildren.length != other.nextChildren.length)
			return false;
		var size = this.nextChildren.length;
		for(var i = 0; i < size; i ++)
			if(!this.nextChildren[i].equals(other.nextChildren[i]))
				return false;

		return true;
	};


	Constructor.prototype = {
		constructor: Constructor,

		findChild: findChild,
		addChild: addChild,
		toInteger: toInteger,
		toString: toString,
		equals: equals
	};

	return Constructor;

});
