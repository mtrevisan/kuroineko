/**
 * @class DAWGBuilder
 *
 * @see {@link https://github.com/nyxtom/text-tree/blob/master/lib/bla.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone', 'tools/data/structs/DAWG'], function(Phone, DAWG){

	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.wordCount = 0;
		this.root = {};
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

	/** Builds the DAWG based on the words added. */
	var build = function(){
		compress();

		this.nodes.forEach(function(node){
			node.index = -1;
		});

		var stack = [this.root];
		this.nodes.clear();
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

		var ints = new Array(index);
		this.nodes.forEach(function(node){
			ints[node.index] = node.toInteger();
		});

		return new DAWG(ints);
	};

	/** @private */
	var compress = function(){
		this.nodes = [];
		this.childDepths = new Map();

		var stack = [];
		var index = 0;

		stack.push(this.root);
		while(stack.length){
			var ptr = stack.pop();

			ptr.index = index ++;
			if(this.root != ptr)
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
				while(root !== ptr){
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
		this.childDepths.keys().forEach(function(depth){
			if(depth > maxDepth)
				maxDepth = depth;
		});

		for(var depth = 0; depth <= maxDepth; depth ++){
			var ns = this.childDepths.get(depth);
			if(!ns)
				continue;

			ns.listIterator().forEach(function(pickNode){
				if(!pickNode.replaceMeWith && pickNode.isChild && !pickNode.siblings)
					ns.listIterator(pickNode.nextIndex()).forEach(function(searchNode){
						if(!searchNode.replaceMeWith && searchNode.isChild && !searchNode.siblings && pickNode.equals(searchNode)){
							searchNode.parent.child = pickNode;
							searchNode.replaceMeWith = pickNode;
						}
					});
			});
		}
	};

	/** Search the given string and return an object (the same of findPrefix) if it lands on a word, essentially testing if the word exists in the trie. */
	var contains = function(word){
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);

		var ptr = this.root;
		word.some(function(chr){
			ptr = ptr.findChild(chr);
			return !ptr;
		});
		return (ptr && ptr.left);
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		add: add,
		wordCount: function(){ return this.wordCount; },
		build: build,
		/*remove: remove,
		removeAll: removeAll,
		findPrefix: findPrefix,*/
		contains: contains/*,
		apply: apply,
		getWords: getWords,
		findMatchesOnPath: findMatchesOnPath*/
	};

	return Constructor;

});
