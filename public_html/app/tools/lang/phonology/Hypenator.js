/**
 * @class Hypenator
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/Trie', 'tools/lang/phonology/Word'], function(Trie, Word){

		/** @constant */
	var INVALID_WORD_REGEX = /[^-'‘’aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ.]/,
		/** @constant */
		WORD_BOUNDARY = '.',
		/** @constant */
		CONFIG_DEFAULT = {
			/** minimal length of characters before the first hyphenation */
			leftmin: 0,
			/** minimal length of characters after the last hyphenation */
			rightmin: 0,
			/** list of exceptions in the form key-value, where the key is the word and the value the hypenated one */
			exceptions: {},
			/** hypen to use as hypenator */
			hyphen: '\u00AD'
		};


	var Constructor = function(patterns, options){
		readPatterns.call(this, patterns);

		this.config = {};
		for(var k in CONFIG_DEFAULT)
			this.config[k] = CONFIG_DEFAULT[k];
		if(options)
			for(k in options)
				this.config[k] = options[k];

		this.cache = {};
	};

	var hypenate = function(word){
		var hypenatedWord = this.config.exceptions[word];
		//the word is not in the exceptions list
		if(!hypenatedWord){
			if(word.match(INVALID_WORD_REGEX) || word.indexOf(this.config.hyphen) >= 0 || word.indexOf('&shy;') >= 0)
				//if the word contains invalid characters, or already contains the hypen character then leave as it is
				hypenatedWord = word;
			else if(this.cache[word])
				//if the word is in the cache then return it
				hypenatedWord = this.cache[word];
			else if(word.indexOf('-') >= 0)
				//if word contains '-' then hyphenate the parts separated with '-'
				hypenatedWord = word.split('-')
					.map(hypenate)
					.join('-');
			else{
				var w = WORD_BOUNDARY + Word.markDefaultStress(word) + WORD_BOUNDARY;
				if(String.prototype.normalize)
					w = w.normalize();

				var size = w.length - 1,
					hyp = [],
					i, j;
				for(i = 0; i < size; i ++)
					this.trie.findPrefix(w.substring(i)).forEach(function(pref){
						//console.log('prefix ' + pref.node.prefix + ', node ' + this.trieData.get(pref.node));

						j = -1;
						this.get(pref.node).split('').forEach(function(d){
							d = parseInt(d);
							if(isNaN(d))
								j ++;
							else if(!hyp[i + j] || d > hyp[i + j])
								hyp[i + j] = d;
						});
					}, this.trieData);

				//create hyphenated word
				var maxLength = word.length - this.config.rightmin;
				hypenatedWord = word.split('').map(function(chr, idx){
					return (idx >= this.leftmin && idx <= maxLength && hyp[idx] % 2? this.hyphen: '') + chr;
				}, this.config).join('');

				//put the word in the cache
				this.cache[word] = hypenatedWord;
			}
		}

		return hypenatedWord;
	};

	/** @private */
	var readPatterns = function(patterns){
		this.trie = new Trie();
		this.trieData = new Map();

		var node;
		Object.keys(patterns).forEach(function(length){
			chunkString(patterns[length], length).forEach(function(pattern){
				node = this.trie.add(pattern.replace(/\d/g, ''));
				this.trieData.set(node, pattern);
			}, this);
		}, this);
	};

	/** @private */
	var chunkString = function(str, length){
		return str.match(new RegExp('.{' + length + '}', 'g'));
	};


	Constructor.prototype = {
		constructor: Constructor,

		hypenate: hypenate
	};

	return Constructor;

});
