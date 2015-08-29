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
	 * @param {String} word		Word to add
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

	/** Search the given string and return <code>true</code> if it lands on on a word, essentially testing if the word exists in the trie. */
	var contains = function(word){
		var tmp = this.findPrefix(word);
		tmp = tmp.parent.children[tmp.index];
		return (tmp && tmp.leaf? tmp: undefined);
	};

	/**
	 * Search the trie and return an array of words which have same prefix.<p>
	 * For example if we had the following words in our database:<br>
	 * <code>a, ab, bc, cd, abc, abd</code><br>
	 * and we search the string: <code>a</code><br>
	 * we will get:<br>
	 * <code>[a, ab, abc, abd]</code>
	 */
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

	/**
	 * Search the trie and return an array of words which were encountered along the way.<p>
	 * This will only return words with full prefix matches.<br>
	 * For example if we had the following words in our database:<br>
	 * <code>a, ab, bc, cd, abc</code><br>
	 * and we searched the string: <code>abcd</code><br>
	 * we would get only:<br>
	 * <code>[a, ab, abc]</code>
	 */
	var findMatchesOnPath = function(word){
		var node = this.root,
			size = word.length,
			list = [],
			i;
		for(i = 0; i < size; i ++){
			if(node.leaf)
				list.push(node.prefix);

			var stem = word.charAt(i);
			node = node.children[stem];
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
		getWords: getWords,
		findMatchesOnPath: findMatchesOnPath
	};


	return Constructor;

});
