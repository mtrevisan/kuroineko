/**
 * @class DAWGBuilder
 *
 * @see {@link https://github.com/nyxtom/text-tree/blob/master/lib/bla.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone', 'tools/data/structs/dawg/DAWG', 'tools/data/structs/dawg/Node'], function(Phone, DAWG, Node){

	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.wordCount = 0;
		this.root = new Node();

		this.nodes = [];
		this.childDepths = new Map();
	};

	/**
	 * Adds a word into the DAWG.
	 *
	 * @param {String} word		Word to add
	 * @return last node
	 */
	var add = function(word){
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);

		var found = true;
		var ptr = this.root;
		word.forEach(function(chr){
			var node = ptr.findChild(chr);
			if(node)
				ptr = node;
			else{
				found = false;
				ptr = ptr.addChild(chr);
			}
		});

		if(!found || !ptr.leaf){
			ptr.leaf = true;
			this.wordCount ++;
		}

		return this;
	};

	/** Search the given string and return an object (the same of findPrefix) if it lands on a word, essentially testing if the word exists in the trie. */
	var contains = function(word){
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);

		var ptr = this.root;
		ptr = word.some(function(chr){
			ptr = ptr.findChild(chr);
			return !ptr;
		});
		return (ptr && ptr.leaf);
	};

	/** Builds the DAWG based on the words added. * /
	var build = function(){
		this.compress();

		this.nodes.forEach(function(node){
			node.index = -1;
		});
		this.nodes.length = 0;

		var stack = [this.root];
		var index = 0;
		while(stack.length){
			var ptr = stack.pop();
			if(ptr.index < 0)
				ptr.index = index ++;
			this.nodes.push(ptr);

			ptr.nextChildren.forEach(function(nextChild){
				stack.push(nextChild);
			});
			if(ptr.child)
				stack.push(ptr.child);
		}

		var indices = new Array(index);
		this.nodes.forEach(function(node){
			indices[node.index] = node.toInteger();
		});

		return new DAWG(indices);
	};

	/** @private * /
	var compress = function(){
		this.nodes.length = 0;
		this.childDepths.clear();

		var stack = [this.root];
		var index = 0;

		while(stack.length){
			var ptr = stack.pop();

			ptr.index = index ++;
			if(ptr !== this.root)
				ptr.siblings = ptr.parent.nextChildren.length - 1 + (ptr.parent.child? 1: 0);
			this.nodes.add(ptr);

			ptr.nextChildren.forEach(function(nextChild){
				stack.push(nextChild);
			});
			if(ptr.child)
				stack.push(ptr);
		}

		//assign child depths to all nodes
		this.nodes.forEach(function(node){
			if(node.leaf){
				node.childDepth = 0;

				var ptr = node;
				var depth = 0;
				while(ptr !== this.root){
					ptr = ptr.parent;
					depth ++;
					if(depth <= ptr.childDepth)
						break;

					ptr.childDepth = depth;
				}
			}
		});

		//bin nodes by child depth
		this.nodes.forEach(function(node){
			var nds = this.childDepths.get(node.childDepth);
			if(!nds){
				nds = [node];
				this.childDepths.put(node.childDepth, nds);
			}
			else
				nds.add(node);
		}, this);

		var maxDepth = -1;
		this.childDepths.forEach(function(value, depth){
			if(depth > maxDepth)
				maxDepth = depth;
		});

		for(var depth = 0; depth <= maxDepth; depth ++){
			var ns = this.childDepths.get(depth);
			if(!ns)
				continue;

			for(var i = 0; i < ns.lentgh; i ++){
				var pickNode = ns[i];
				if(!pickNode.replaceMeWith && pickNode.isChild && !pickNode.siblings){
					for(var j = i + 1; j < ns.lentgh; j ++){
						var searchNode = ns[j];
						if(!searchNode.replaceMeWith && searchNode.isChild && !searchNode.siblings && pickNode.equals(searchNode)){
							searchNode.parent.child = pickNode;
							searchNode.replaceMeWith = pickNode;
						}
					}
				}
			}
		}
	};*/


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		add: add,
		contains: contains,
		wordCount: function(){ return this.wordCount; }//,
//		build: build
	};

	return Constructor;

});
