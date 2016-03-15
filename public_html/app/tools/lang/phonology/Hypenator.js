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
			exceptions: {},
//			hyphen: String.fromCharCode(173)
//			hyphen: '\u00AD'
			hyphen: '-'
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
		word = Word.markDefaultStress(word);

		var hypenatedWord;
		if(word.indexOf(this.config.hyphen) >= 0)
			//the word already contains &shy; then leave as it is
			hypenatedWord = word;
		else if(this.cache[word])
			//the word is in the cache
			hypenatedWord = this.cache[word];
		else if(this.config.exceptions[word])
			//the word is in the exceptions list
			hypenatedWord = this.config.exceptions[word].replace(/-/g, this.config.hyphen);
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
				return (idx >= this.config.leftmin && idx <= maxLength && hyp[idx] % 2? this.config.hyphen: '') + chr;
			}, this).join('');
			hypenatedWord = removeDefaultStress.call(this, hypenatedWord);

			//put the word in the cache
			this.cache[word] = hypenatedWord;
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

	/** @private */
	var removeDefaultStress = function(hypenatedWord){
		if(hypenatedWord.indexOf(this.config.hyphen) >= 0){
			hypenatedWord = hypenatedWord.split(this.config.hyphen);
			var size = hypenatedWord.length,
				priorToLastSyllabe = hypenatedWord[size - 2],
				unstressedFinal = Word.unmarkDefaultStress(priorToLastSyllabe + hypenatedWord[size - 1]);
			hypenatedWord[size - 2] = unstressedFinal.substring(0, priorToLastSyllabe.length);
			hypenatedWord[size - 1] = unstressedFinal.substring(priorToLastSyllabe.length);
			hypenatedWord = hypenatedWord.join(this.config.hyphen);
		}
		else
			hypenatedWord = Word.unmarkDefaultStress(hypenatedWord);
		return hypenatedWord;
	};


	Constructor.prototype = {
		constructor: Constructor,

		hypenate: hypenate
	};

	return Constructor;

});
