/**
 * @class Trie
 *
 * see https://github.com/nyxtom/text-tree/blob/master/lib/trie.js
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.root = {
			children: {}
		};
	};

	/**
    * Adds a word into the trie.
	 *
    * @param word {String} word to add
	 * @return last node
    */
	var add = function(word){
		var node = this.root,
			size = word.length,
			i;
		for(i = 0; i < size; i ++){
			var stem = word.charAt(i);
			node = (node.children[stem] = node.children[stem] || {
				prefix: word.substr(0, i + 1),
				children: {}
			});
		}
		node.leaf = true;

		return node;
	};

	var remove = function(word){
		var result = this.findPrefix(word);
		result.parent.children[result.index] = undefined;
	};

	/** Find the node that correspond to the last character in the string. */
	var findPrefix = function(word){
		var parent = null,
			node = this.root,
			size = word.length,
			i;
		for(i = 0; i < size && node; i ++){
			parent = node;
			node = node.children[word.charAt(i)];
		}

		return {
			parent: parent,
			index: word.charAt(i - 1)
		};
	};

	var contains = function(word){
		var tmp = this.findPrefix(word);
		tmp = tmp.parent.children[tmp.index];
		return (tmp && tmp.leaf? tmp: undefined);
	};

	/** Get the words with the given prefix */
	var getWords = function(prefix){
			//the node which represents the last letter of the prefix
		var node = this.findPrefix(prefix),
			//list of words which are lower in the hierarchy with respect to this node
			list = [];
		node = node.parent.children[node.index];

		if(node){
			var stack = [node];
			while(stack.length){
				var current = stack.pop();

				if(current.leaf)
					list.push(current.prefix);

				Object.keys(current.children).forEach(function(child){
					stack.push(current.children[child]);
				});
			}
		}

		return list;
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		add: add,
		remove: remove,
		findPrefix: findPrefix,
		contains: contains,
		getWords: getWords
	};


	return Constructor;

});
