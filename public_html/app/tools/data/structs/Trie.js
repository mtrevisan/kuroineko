/**
 * @class Trie
 *
 * @see {@link https://github.com/nyxtom/text-tree/blob/master/lib/trie.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		this.reset();
	};


	/**
	 * @param {String} [encoding]	String encoding of the trie in the form {bit-size}DATA_SEPARATOR{directory-data}DATA_SEPARATOR{trie-data-DATA_SEPARATOR-separated}
	 */
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
		var result = this.findPrefix(word),
			tmp = result.parent.children[result.index];
		if(tmp && tmp.leaf)
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
		tmp = (tmp.parent && tmp.parent.children[tmp.index]);
		return (tmp && tmp.leaf? tmp: undefined);
	};

	/** Apply a function to each node, traversing the trie in level order. */
	var apply = function(fn){
		var level = [this.root],
			node;
		while(level.length){
			node = level.shift();
			Object.keys(node.children).forEach(function(i){
				level.push(this[i]);
			}, node.children);

			if(node.leaf)
				fn(node);
		}
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
			var level = [node];
			while(level.length){
				node = level.shift();
				Object.keys(node.children).forEach(function(i){
					level.push(node.children[i]);
				});

				if(node.leaf)
					list.push(node.prefix);
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
		apply: apply,
		getWords: getWords,
		findMatchesOnPath: findMatchesOnPath
	};


	return Constructor;

});
