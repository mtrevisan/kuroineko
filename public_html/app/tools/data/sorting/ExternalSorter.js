/**
 * An implementation of an external sorter.
 *
 * @class ExternalSorter
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(value, parent){
		//# of chunks = # total memory / # page memory
		//for each file
			//sort file
			//write back to disk
		//for each file
			//read the first # page memory / (# of chunks + 1) rows
		//while any of the lists is non-empty
			//loop over the lists to find the one with the minimum first element
			//output the minimum element and remove it from its list
			//if output is full
				//write output to disk
				//clear output
			//if a list is empty
				//load next # page memory / (# of chunks + 1) rows
	};


	var findChild = function(value){
		if(!value)
			return null;
		if(value == this.child.value)
			return this.child;
		return this.nextChildren.find(function(nextChild){
			return (value == nextChild.value);
		});
	};

	var addChild = function(value){
		var nextChild = new Node(value, this);
		if(!this.child){
			this.child = nextChild;
			this.child.isChild = true;
			this.child.lastChild = true;
		}
		else
			this.nextChildren.push(nextChild);
		return nextChild;
	};

	var toInteger = function(){
		var rv = -1;
		//start with the first child index (use MAX_INDEX, if there are no children)
		if(this.nextChildren.length)
			rv = this.nextChildren[0].index;
		else if(this.child)
			rv = this.child.index;

		//shift 1 and add the last child bit
		rv = (rv << 1) | (this.lastChild? 0x01: 0x00);
		//shift 1 and add the terminal bit
		rv = (rv << 1) | (this.leaf? 0x01: 0x00);
		//shift 16 and add the value
		rv = (rv << 16) | this.value;
		return rv;
	};

	Constructor.getFirstChildIndex = function(index){
		return (index >> 18);
	};

	Constructor.isLastChild = function(index){
		return ((index >> 17) & 0x01);
	};

	Constructor.canTerminate = function(index){
		return ((index >> 16) & 0x01);
	};

	Constructor.getChar = function(index){
		return (index & 0xFFFF);
	};

	var toString = function(){
		var result = '[value:' + this.value + ' prefix:' + prefix() + ' child:' + (this.child? this.child.value: 'n/a') + ' next:';
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
		if(!(other instanceof Node))
			return false;

		if(value !== other.value)
			return false;
		if(terminal !== other.terminal)
			return false;
		if(child && !other.child || !child && other.child)
			return false;
		if(child && !child.equals(other.child))
			return false;
		if(nextChildren.length != other.nextChildren.length)
			return false;
		var size = nextChildren.length;
		for(var i = 0; i < size; i ++)
			if(!nextChildren[i].equals(other.nextChildren[i]))
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
