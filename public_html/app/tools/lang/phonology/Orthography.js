/**
 * @class Orthography
 *
 * @author Mauro Trevisan
 */
define(function(){

	var rewriteDigrams = function(word){
		return word.replace(/[djlnstx]h/g, function(match){
			return 'đɉƚñʃŧʒ'['djlnstx'.indexOf(match[0])];
		});
	};

	var correctOrthography = function(word){
		return word.toLowerCase()

		//eliminate consonant geminates
			.replace(/([^aeiou]){1}\1+/g, '$1')

		//apply (and correct) stress
			.replace(/a\\/g, 'à').replace(/e\\/g, 'è').replace(/o\\/g, 'ò').replace(/e\//g, 'é').replace(/(i\/|ì)/g, 'í').replace(/o\//g, 'ó').replace(/(u\/|ù)/g, 'ú')

		//correct h occurrences not after d, f, k, j, l, n, p, s, t, x
			.replace(/(^|[^dfkjlnpstx])h/g, '$1')
		//rewrite characters
			.replace(/dh/g, 'đ').replace(/jh/g, 'ɉ').replace(/lh/g, 'ƚ').replace(/nh/g, 'ñ').replace(/sh/g, 'ʃ').replace(/th/g, 'ŧ').replace(/xh/g, 'ʒ')

		//correct mb/mp occurrences into nb/np
			.replace(/m([bp])/g, 'n$1')
		//correct i occurrences into j at the beginning of a word followed by a vowel and between vowels, correcting also the converse
			.replace(/^j(?=[^aeiouàèéíòóúh])/, 'i').replace(/^i(?=[aeiouàèéíòóú])/, 'j').replace(/([aeiouàèéíòóú])i(?=[aeiouàèéíòóú])/g, '$1j').replace(/j(?=[^aeiouàèéíòóúh])/g, 'i')
		//correct lh occurrences into l not at the beginning of a word and not between vowels
			.replace(/^ƚ(?=[^aeiouàèéíòóú])/, 'l').replace(/([^aeiouàèéíòóú])ƚ(?=[aeiouàèéíòóú])|([aeiouàèéíòóú])ƚ(?=[^aeiouàèéíòóú])/g, '$1l')
		//correct fh occurrences into f not before vowel
			.replace(/fh(?=[^aeiouàèéíòóú])/g, 'f')
		//correct x occurrences into s prior to c, f, k, p, t
		//correct s occurrences into x prior to m, n, ñ, b, d, g, j, ɉ, s, v, r, l, ŧ
			.replace(/x(?=[cfkpt])/g, 's').replace(/s(?=([mnñbdgjɉsvrlŧ]|jh))/g, 'x')

		//correct morphologic error
			.replace(/([cjñ])i([aeiou])/, '$1$2')

		//correct apostrophes
			.replace(/['‘’]/, 'ʼ');
	};


	return {
		rewriteDigrams: rewriteDigrams,
		correctOrthography: correctOrthography
	};

});
