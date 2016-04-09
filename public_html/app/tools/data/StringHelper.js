/**
 * @class StringHelper
 *
 * @author Mauro Trevisan
 */
define(function(){

	/** Returns a string filled with 'n' copies of 'str' */
	var stringRepeat = function(str, n){
		var result = '';
		while(n > 0){
			if(n & 1)
				result += str;

			n >>= 1;
			str += str;
		}
		return result;
	};

	/** Replaces a char in the 'from' string to the corresponding char in the 'to' string, returning the char itself if not in 'from'. */
	var replaceCharacter = function(chr, from, to){
		return (chr + to)[from.indexOf(chr) + 1];
	};

	var setCharacterAt = function(word, idx, changeFn){
		return (idx >= 0? word.substr(0, idx) + changeFn(word[idx]) + word.substr(idx + 1): word);
	};

	/** Matches a string with an array of regexp, excluding a match with an equivalent array of false positives. */
	var isMatching = function(str, matchers, falsePositiveMatchers){
		var m;
		return (!matchers.some(function(el){ m = el; return this.match(el); }, str)
			|| falsePositiveMatchers && falsePositiveMatchers.some(function(el){ return this.match(el); }, str)? false: m);
	};


	return {
		stringRepeat: stringRepeat,
		replaceCharacter: replaceCharacter,
		setCharacterAt: setCharacterAt,
		isMatching: isMatching
	};

});
