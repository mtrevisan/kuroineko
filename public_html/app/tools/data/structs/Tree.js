/**
 * @class Tree
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.root = {
			children: []
		};
	};

	/**
	 * Adds a node into the tree.
	 *
	 * @param {String} id		ID of the node this node is attached to
	 * @param {String} nodeId	ID of the new node
	 * @param {Object} data		Data to add to the new node
	 * @return <code>true</code> if the new node is inserted
	 */
	var addChild = function(id, nodeId, data){
		var node = this.find(function(node){ return (node.id == id); });
		if(node)
			node.children.push({id: nodeId, data: data, children: [], parent: node});
		return !!node;
	};

	/**
	 * Inserts a node into the tree as the parent of two nodes.
	 *
	 * @param {String} id1		ID of the first node this node is attached to
	 * @param {String} id2		ID of the second node this node is attached to
	 * @param {String} nodeId	ID of the new node
	 * @param {Object} data		Data to add to the new node
	 * @return <code>true</code> if the new node is inserted
	 */
	var insertParent = function(id1, id2, nodeId, data){
		var node1 = this.find(function(node){ return (node.id == id1); }),
			node2 = this.find(function(node){ return (node.id == id2); }),
			found = (node1 && node2 && node1.parent === node2.parent),
			count, children,
			i, n;
		if(found){
			count = 0;
			children = node1.parent.children;
			for(i = children.length - 1; i >= 0; i --){
				n = children[i];
				if(n.id == id1 || n.id == id2){
					count ++;

					children.splice(i, 1);

					if(count == 2)
						break;
				}
			}
			children.push({id: nodeId, data: data, children: [node1, node2], parent: node1.parent});
		}
		return found;
	};

	/**
	 * Deletes a node into the tree.
	 *
	 * @param {String} id	ID of the node, or node, to delete
	 * @return <code>true</code> if the new node is deleted
	 */
	var remove = function(id){
		var finder = function(node){ return (node.id == id); },
			node = this.find(finder);
		if(node){
			if(!node.children.length)
				node.parent.children.some(function(n, idx){
					if(finder(n)){
						this.splice(idx, 1);
						return true;
					}
					return false;
				}, node.parent.children);
			else
				node.children.forEach(function(child){
					this.push(child);
				}, node.parent.children);
		}
		return !!node;
	};

	/** Apply a function to each node, traversing the tree in level order, until the function responds <code>true</code>. */
	var find = function(fn){
		var level = [this.root],
			node;
		while(level.length){
			node = level.shift();
			node.children.forEach(function(child){
				level.push(child);
			});

			if(fn(node) === true)
				return node;
		}
		return undefined;
	};

	/** Apply a function to each node, traversing the tree in level order. */
	var apply = function(fn){
		this.find(function(node){
			fn(node);
			return false;
		});
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		addChild: addChild,
		insertParent: insertParent,
		remove: remove,
		find: find,
		apply: apply
	};


	return Constructor;

});
