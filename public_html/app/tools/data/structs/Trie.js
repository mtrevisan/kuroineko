/**
 * @class Trie
 *
 * @see {@link https://github.com/nyxtom/text-tree/blob/master/lib/trie.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone'], function(Phone){

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
		var node = this.root;
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);
		word.forEach(function(stem, idx){
			node = (node.children[stem] = node.children[stem] || {
				prefix: word.slice(0, idx + 1).join(''),
				children: {}
			});
		});
		node.leaf = true;

		return node;
	};

	var remove = function(word){
		var results = this.findPrefix(word);
		if(results.length == 1)
			removeSingle(word, results[0]);
	};

	var removeAll = function(word){
		this.findPrefix(word)
			.forEach(function(pref){
				removeSingle(word, pref)
			});
	};

	/** @private */
	var removeSingle = function(word, pref){
		if(pref.node && pref.node.leaf){
			word = word.match(Phone.REGEX_UNICODE_SPLITTER);
			pref.parent.children[word[word.length - 1]] = undefined;
		}
	};

	/** Find the node that correspond to the last character in the string. */
	var findPrefix = function(word){
		var node = this.root,
			results = [],
			parent, tmp;
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);
		word.some(function(stem, idx){
			tmp = node.children[stem];
			if(tmp){
				parent = node;
				node = tmp;

				if(node.leaf)
					results.push({
						node: node,
						index: idx,
						parent: parent
					});
			}
			return !tmp;
		});
		return results;
	};

	/** Search the given string and return an object (the same of findPrefix) if it lands on a word, essentially testing if the word exists in the trie. */
	var contains = function(word){
		var node = this.root;
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);
		word.some(function(stem){
			node = node.children[stem];
			return !node;
		});
		return (node && node.leaf);
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
		//list of words which are lower in the hierarchy with respect to this node
		var list = [],
			node, level;
		this.findPrefix(prefix).forEach(function(pref){
			//the node which represents the last letter of the prefix
			level = [pref.node];
			while(level.length){
				node = level.shift();
				Object.keys(node.children).forEach(function(i){
					level.push(node.children[i]);
				});

				if(node.leaf && !node.prefix.indexOf(this))
					list.push(node.prefix);
			}
		}, prefix);
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
			list = [];
		word = word.match(Phone.REGEX_UNICODE_SPLITTER);
		word.some(function(stem){
			node = node.children[stem];
			if(!node)
				return true;

			if(node.leaf)
				list.push(node.prefix);
			return false;
		});
		return list;
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		add: add,
		remove: remove,
		removeAll: removeAll,
		findPrefix: findPrefix,
		contains: contains,
		apply: apply,
		getWords: getWords,
		findMatchesOnPath: findMatchesOnPath
	};

	return Constructor;

});
