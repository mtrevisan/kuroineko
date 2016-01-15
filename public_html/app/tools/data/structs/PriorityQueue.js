/**
 * Priority queue with using Fibonacci heap
 *
 * @class PriorityQueue
 *
 * @see {@link https://github.com/IvanDyachenko/opticsjs/blob/master/lib/priority_queue.js}
 * @see {@link https://github.com/Tyriar/js-fibonacci-heap/blob/master/index.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Node = function(priority, value){
		this.priority = priority;
		this.value = value;
		this.mark = false;
		this.parent = undefined;
		this.children = [];
	};

	Node.prototype.getPriority = function(){
		return this.priority;
	};

	Node.prototype.getValue = function(){
		return this.value;
	};

	/**
	 * @return {Number}	The number of children
	 */
	Node.prototype.degree = function(){
		return (this.children? this.children.length: 0);
	};


	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.minimumNode = undefined;
		if(this.rootList)
			this.rootList.length = 0;
		else
			this.rootList = [];
		if(this.valueToNode)
			this.valueToNode.clear();
		else
			this.valueToNode = new Map;
	};

	/**
	 * Returns the size of the queue
	 *
	 * @return {number} The size of the node list.
	 */
	var size = function(){
		if(this.isEmpty())
			return 0;

		var count = 0,
			stack = [],
			node;
		this.rootList.forEach(function(child){
			stack.push(child);
		});
		while(stack.length){
			node = stack.shift();

			count ++;

			node.children.forEach(function(child){
				stack.push(child);
			});
		}
		return count;
	};

	/**
	 * Inserts a new key-value pair into the heap
	 *
	 * @param {Number} priority	Priority
	 * @param {Object} value		Value
	 */
	var add = function(priority, value){
		var node = new Node(priority, value);

		this.rootList.push(node);
		this.valueToNode.set(node.value, node);

		if(!this.minimumNode || priority < this.minimumNode.priority)
			this.minimumNode = node;

		return node;
	};

	/**
	 * Merge two lists of nodes together
	 *
	 * @param {PriorityQueue} other	The other priority queue to be merged
	 */
	var union = function(other){
		if(other.constructor != Constructor)
			throw 'The input is not a PriorityQueue';

		this.rootList = this.rootList.concat(other.rootList);
		other.valueToNode.forEach(function(node, value){
			this.set(value, node);
		}, this.valueToNode);

		if(other.minimumNode && (!this.minimumNode || other.minimumNode.priority < this.minimumNode.priority))
			this.minimumNode = other.minimumNode;
	};

	var isEmpty = function(){
		return (!this.minimumNode);
	};

	/**
	 * Get the minimum node without eliminating it from the queue
	 *
	 * @returns {Node}
	 */
	var get = function(){
		return this.minimumNode;
	};

	/**
	 * Extracting the minimum node
	 *
	 * @returns {Node}
	 */
	var extract = function(){
		var minNode = this.minimumNode;
		if(minNode){
			//set parent to undefined for the minimum's children
			minNode.children.forEach(function(child){
				this.push(child);
				child.parent = undefined;
			}, this.rootList);

			//remove minimum node from root list
			this.rootList.splice(this.rootList.indexOf(minNode), 1);
			this.valueToNode.delete(minNode.value);

			if(!this.rootList.length)
				this.minimumNode = undefined;
			else{
				//merge the children of the minimum node with the root list
				this.minimumNode = this.rootList[0];
				consolidate.call(this);
			}
		}
		return minNode;
	};

	var deleteNode = function(value){
		this.decreaseKey(-Infinity, value);
		this.extract();
	};
	
	var decreaseKey = function(priority, value){
		var x = this.valueToNode.get(value);
		if(!x)
			throw 'non existing node with value ' + value;
		if(priority > x.priority)
			throw 'new key is greater than current key';

		x.priority = priority;
		var y = x.parent;
		if(y && x.priority < y.priority){
			cut.call(this, x, y);
			cascadingCut.call(this, y);
		}
		if(!this.minimumNode || x.priority < this.minimumNode.priority)
			this.minimumNode = x;
	};

	/**
	 * Links two heaps of the same order together
	 *
	 * @private
	 */
	var heapLink = function(y, x){
		//remove y from the root list
		var index = this.rootList.indexOf(y);
		if(index >= 0)
			this.rootList.splice(index, 1);

		//make y a child of x
		x.children.push(y);
		y.parent = x;
	};

	/**
	 * Merge all trees of the same order together until there are no two trees of the same order
	 *
	 * @private
	 */
	var consolidate = function(){
		if(this.minimumNode){
			var A = [],
				i;
			for(i = this.rootList.length - 1; i >= 0; i --){
				var x = this.rootList[i],
					d = x.degree(),
					y;
				//if there exists another node with the same degree, merge them
				while(A[d]){
					y = A[d];
					if(x.priority > y.priority)
						y = [x, x = y][0];
					heapLink.call(this, y, x);
					A[d] = undefined;
					d ++;
				}
				A[d] = x;
			}

			this.minimumNode = undefined;
			A.forEach(function(x){
				if(x){
					//this.rootList.push(x);
					if(!this.minimumNode || x.priority < this.minimumNode.priority)
						this.minimumNode = x;
				}
			}, this);
		}
	};

	/**
	 * Cut the link between a node and its parent, moving the node to the root list
	 *
	 * @private
	 */
	var cut = function(x, y){
		//remove x from the children list of y
		var index = y.children.indexOf(x);
		if(index === -1)
			throw 'node with value ' + x.value + ' is not child of node with value ' + y.value;

		y.children.splice(index, 1);
		//add x to the root list
		this.rootList.push(x);
		x.parent = undefined;
		x.mark = false;
	};

	/**
	 * Perform a cascading cut on a node; mark the node if it is not marked, otherwise cut the node and perform a cascading cut on its parent
	 *
	 * @private
	 */
	var cascadingCut = function(y){
		if(y && y.parent){
			if(y.mark){
				cut.call(this, y, y.parent);
				cascadingCut.call(this, y.parent);
			}
			else
				y.mark = true;
		}
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,
		size: size,

		add: add,
		union: union,
		isEmpty: isEmpty,
		get: get,
		extract: extract,
		deleteNode: deleteNode,
		decreaseKey: decreaseKey
	};


	return Constructor;

});
