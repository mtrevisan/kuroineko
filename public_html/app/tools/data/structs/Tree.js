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
		var node = this.findByID(id);
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
		var node1 = this.findByID(id1),
			node2 = this.findByID(id2),
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
		var node = this.findByID(id),
			children, i;
		if(node){
			children = node.parent.children;

			//remove deleted node from parent's children
			for(i = children.length - 1; i >= 0; i --)
				if(children[i].id === id){
					children.splice(i, 1);
					break;
				}

			//transfer all of this node's children into parent's children, bypassing the deleted node
			node.children.forEach(function(child){
				this.push(child);
			}, children);
		}
		return !!node;
	};

	/** Find a node with a given ID. */
	var findByID = function(id){
		return this.find(function(node){ return (node.id === id); });
	};

	/** Apply a function to each node, traversing the tree in level order, until the function responds <code>true</code>. */
	var find = function(fn, scope){
		var level = [this.root],
			node;
		while(level.length){
			node = level.shift();
			node.children.forEach(function(child){
				this.push(child);
			}, level);

			if(fn.call(scope || this, node) === true)
				return node;
		}
		return undefined;
	};

	/** Apply a function to each node, traversing the tree in level order. */
	var apply = function(fn, scope){
		this.find(function(node){
			fn.call(scope || this, node);
			return false;
		}, scope);
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		addChild: addChild,
		insertParent: insertParent,
		remove: remove,
		find: find,
		findByID: findByID,
		apply: apply
	};


	return Constructor;

});
