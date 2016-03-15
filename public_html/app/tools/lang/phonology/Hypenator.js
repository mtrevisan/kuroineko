/**
 * @class Hypenator
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/Trie', 'tools/lang/phonology/Word'], function(Trie, Word){

		/** @constant */
	var VALID_WORD_REGEX = /[^-'‘’aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ.]/,
		/** @constant */
		CONFIG_DEFAULT = {
			/** minimal length of characters before the first hyphenation */
			leftmin: 0,
			/** minimal length of characters after the last hyphenation */
			rightmin: 0,
			exceptions: {}
		};


	/**
	 * Gets a logger. If the logger does not exist it is created.
	 *
	 * @param {String} name		The unique name of the logger
	 * @param {Object} [conf]	The configuration object in the form <code>{rootLogger: 'DEBUG', showTime: true, out: function(message){}}</code>
	 */
	var Constructor = function(patterns, options){
		readPatterns.call(this, patterns);

		this.config = {};
		for(var k in CONFIG_DEFAULT)
			this.config[k] = CONFIG_DEFAULT[k];
		if(options)
			for(k in options)
				this.config[k] = options[k];

		this.cache = {};
//		this.softHyphen = String.fromCharCode(173);
//		this.softHyphen = '\u00AD';
		this.softHyphen = '-';
	};

	var hypenate = function(word){
		word = Word.markDefaultStress(word);

		var hypenatedWord;
		if(word.indexOf(this.softHyphen) >= 0)
			//the word already contains &shy; then leave as it is
			hypenatedWord = word;
		else if(this.cache[word])
			//the word is in the cache
			hypenatedWord = this.cache[word];
		else if(this.config.exceptions[word])
			//the word is in the exceptions list
			hypenatedWord = this.config.exceptions[word].replace(/-/g, this.softHyphen);
		else if(word.indexOf('-') >= 0)
			//if word contains '-' then hyphenate the parts separated with '-'
			hypenatedWord = word.split('-')
				.map(hypenate)
				.join('-');
		else{
			var ww = '.' + word.toLowerCase() + '.';
			if(String.prototype.normalize)
				ww = ww.normalize();
			if(ww.match(VALID_WORD_REGEX))
				return word;

			var size = ww.length,
				hyp = [],
				i, j,
				tmp;
			for(i = 0; i < size; i ++){
				tmp = ww.substring(i);
				this.trie.findPrefix(tmp).forEach(function(pref){
					//console.log('prefix ' + pref.node.prefix + ', node ' + this.trieData.get(pref.node));

					j = -1;
					this.trieData.get(pref.node).split('').forEach(function(d){
						d = parseInt(d);
						if(isNaN(d))
							j ++;
						else if(!hyp[i + j] || d > hyp[i + j])
							hyp[i + j] = d;
					});
				}, this);
			}

			//create hyphenated word
			var maxLength = word.length - this.config.rightmin;
			hypenatedWord = word.split('').map(function(chr, idx){
				return (idx >= this.config.leftmin && idx <= maxLength && hyp[idx] % 2? this.softHyphen: '') + chr;
			}, this).join('');

			//put the word in the cache
			this.cache[word] = hypenatedWord;
		}

		return hypenatedWord;
	};

	/** @private */
	var readPatterns = function(patterns){
		this.trie = new Trie();
		this.trieData = new Map();

		var cleanPattern, node;
		Object.keys(patterns).forEach(function(length){
			chunkString(patterns[length], length).forEach(function(pattern){
				cleanPattern = pattern.replace(/\d/g, '');
				node = this.trie.add(cleanPattern);
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
