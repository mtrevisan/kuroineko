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
	 * @param {String} nodeId		ID of the new node
	 * @param {[Object]} nodeData	Data to add to the new node
	 * @param {[String]} id			ID of the node this node is attached to
	 * @return <code>true</code> if the new node is inserted
	 */
	var addChild = function(nodeId, nodeData, id){
		var node = this.findByID(id),
			data;
		if(node){
			data = {id: nodeId, parent: node};
			if(nodeData)
				data.data = nodeData;
			node.children.push(data);
		}
		return !!node;
	};

	/**
	 * Inserts a node into the tree as the parent of two nodes.
	 *
	 * @param {String} nodeId		ID of the new node
	 * @param {[Object]} nodeData	Data to add to the new node
	 * @param {[String..]} ids		Array of children IDs this node is attached to
	 * @return <code>true</code> if the new node is inserted
	 */
	var insertParent = function(nodeId, nodeData){
		var ids = Array.prototype.slice.call(arguments, 2),
			nodes = ids.map(this.findByID, this),
			parent = (nodes[0]? nodes[0].parent: undefined),
			found = nodes.every(function(node){ return (!!node && node.parent === parent); }),
			count, children,
			i, n, data;
		if(found){
			count = 0;
			children = parent.children;
			for(i = (children? children.length: 0) - 1; i >= 0; i --){
				n = children[i];
				if(ids.indexOf(n.id) >= 0){
					count ++;

					children.splice(i, 1);

					if(count == 2)
						break;
				}
			}
			data = {id: nodeId, children: nodes, parent: parent};
			if(nodeData)
				data.data = nodeData;
			children.push(data);
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
			for(i = (children? children.length: 0) - 1; i >= 0; i --)
				if(children[i].id === id){
					children.splice(i, 1);
					break;
				}

			//transfer all of this node's children into parent's children, bypassing the deleted node
			if(node.children)
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
			if(node.children)
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
