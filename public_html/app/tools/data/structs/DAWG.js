/**
 * @class Trie
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Phone'], function(Phone){

	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.root = {
			children: []
		};
	};

	/**
	 * Adds a word into the DAWG.
	 *
	 * @param {String} word		Word to add
	 * @return the added node
	 */
	var add = function(word){
		var chars = word.match(Phone.REGEX_UNICODE_SPLITTER);

		var i = 0;
		var ptr = this.root;
		var found = true;
		while(ptr){
			var subword = (ptr.children.length? chars.slice(i, i + ptr.children[0].value.match(Phone.REGEX_UNICODE_SPLITTER).length).join(''): chars.slice(i));
			var node = ptr.children.find(function(child){
				return subword.startsWith(child.value);
			});
			if(!node){
				var maxSameChars;
				ptr.children.forEach(function(child, idx){
					var childChars = child.value.match(Phone.REGEX_UNICODE_SPLITTER);
					var size = childChars.length;
					for(var j = 0; j < size; j ++){
						if(childChars[j] != chars[j])
							break;
					}
					if(j < size && j && (!node || j > maxSameChars)){
						node = child;
						maxSameChars = j;
					}
				});

				if(node){
					node.children = [{
						value: node.value.match(Phone.REGEX_UNICODE_SPLITTER).slice(maxSameChars).join(''),
						children: node.children.slice(0),
						leaf: node.leaf
					}];
					node.value = chars.slice(i, i + maxSameChars).join('');
					if(node.leaf)
						node.leaf = false;
					ptr = {
						value: chars.slice(i + maxSameChars).join(''),
						children: []
					};
					node.children.push(ptr);
				}
				else{
					node = {
						value: chars.slice(i).join(''),
						children: []
					};
					ptr.children.push(node);
					ptr = node;
				}
				found = false;
				break;
			}
			else if(word.length > node.value.length){
				maxSameChars = node.value.length;
				var values = node.value.match(Phone.REGEX_UNICODE_SPLITTER);
				if(!node.leaf){
					node.children = [{
						value: values.slice(maxSameChars).join(''),
						children: node.children.slice(0),
						leaf: node.leaf
					}];
					node.value = chars.slice(i, i + maxSameChars).join('');
					if(node.leaf)
						node.leaf = false;
				}
				ptr = {
					value: chars.slice(i + maxSameChars).join(''),
					children: [],
					leaf: true
				};
				node.children.push(ptr);

				found = false;

				i += maxSameChars;
			}
			else{
				ptr = node;
				break;
			}
		}

		if(!found || !ptr.leaf)
			ptr.leaf = true;

		return ptr;
	};

	/** Search the given string and return an object (the same of findPrefix) if it lands on a word, essentially testing if the word exists in the trie. */
	var contains = function(word){
		var chars = word.match(Phone.REGEX_UNICODE_SPLITTER);

		var len = 0;
		var ptr = this.root;
		while(ptr){
			var subword = (ptr.children.length?
				chars.slice(len, len + (ptr.children[0].value.length? ptr.children[0].value.match(Phone.REGEX_UNICODE_SPLITTER).length: 0)).join(''):
				chars.slice(len));
			ptr = ptr.children.find(function(child){
				return subword.startsWith(child.value);
			});
			if(!ptr || word.length == len + ptr.value.length)
				break;
			len += ptr.value.length;
		}

		return (ptr && ptr.leaf);
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,

		add: add,
		contains: contains
	};

	return Constructor;

});
