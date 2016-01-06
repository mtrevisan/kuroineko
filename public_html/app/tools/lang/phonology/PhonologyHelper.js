/**
 * @class PhonologyHelper
 *
 * @author Mauro Trevisan
 */
define(['tools/data/StringHelper', 'tools/lang/phonology/Grapheme'], function(StringHelper, Grapheme){

	/*var convertPhonesIntoXSampa = (function(){

		var data = {
			'\'': '"',
			'k[eɛij]': 'k_+', 'g[eɛij]': 'g_+',
			'ɛ': 'E', 'ɔ': 'O',
			'ι': 'j',
			'ρ': 'r\\_a`', 'ř': 'r\\_-`',
			'r': 'r_a',
			'ɾ': '4_a',
			'ʅ': 'r_-_+`',
//lateral approximant coronal (non retroflex) apical
//			'l': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
//lateral approximant coronal (non retroflex) laminal palatalized
//			'l': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
			'l': 'l_a', 'ļ': 'l_m\'',
//lateral approximant coronal (non retroflex) apical raised
//			'l': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 1, lo: 0, ft: 0, bk: 0, tns: 0},
			'λ': 'l_a_r',
//lateral approximant palatal lowered retroflexed
//			'ʎ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: 1, dor: 1, hi: 1, lo: 1, ft: 1, bk: -1, tns: 0},
//lateral approximant velar advanced, lowered, retroflexed
//			'ʟ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: 1, dor: 1, hi: 1, lo: 1, ft: 0, bk: 0, tns: 1},
			'Λ': 'L_o`', 'Ƚ': 'L\\_+_o`',
			'ɱ': 'F', 'n': 'n_a',
			'ŋ': 'N_+_o',
			't': 't_d', 'd': 'd_d', 'kw': 'k_w', 'gw': 'g_w',
			'ʦ': 't-\\s_d_-', 'ʣ': 'd-\\z_d_-', 'ʧ': 't_m-\\S\'', 'ʤ': 'd_m-\\Z\'',
			'φ': 'f_h',
			'θ': 'T', 'ð': 'D',
			's': 's_-', 'z': 'z_-',
			'ʃ': 'S_m\'', 'ʒ': 'Z_m\''
		};

		var replaceFirstMatch = function(chr){
			for(var prop in data)
				if(chr.match(new RegExp('^' + prop)))
					return data[prop];
			return chr[0];
		};


		return function(word){
			var result = '',
				len = word.length;
			for(var i = 0; i < len; i ++)
				result += replaceFirstMatch(word.substr(i, 2));
			return result;
		};

	})();*/


	var metaphonetizeStressedVowel = function(chr){
		return StringHelper.replaceCharacter(chr, 'éó', 'íú');
	};

	var demetaphonetizeStressedVowel = function(chr){
		return StringHelper.replaceCharacter(chr, 'íú', 'éó');
	};


	/**
	 * Truncate final unstressed vowel <i>e/o</i> after <i>n</i>, <i>r</i>, <i>l</i> and in general after all voiced consonants and <i>f</i>, <i>k</i>, <i>p</i>, <i>s</i>, <i>t</i>, <i>ŧ</i>,
	 * but only if it's not a plural marker (therefore plurals in <i>-e</i> derived from singular feminine words ending in <i>-a</i> are excluded).
	 */
	var truncateAfterConsonant = function(word, mainDialect, dialect){
		var centralOrWestern = (mainDialect == 'central' || mainDialect == 'western'),
			matcher;

		if(mainDialect == 'centralNorthern' || mainDialect == 'lagunar' || centralOrWestern)
			matcher = (dialect == 'centralNorthern.kastelan' || dialect == 'lagunar.coxòto' || centralOrWestern? /(n)[eo]$/: /([nrl])[eo]$/);
		else if(mainDialect == 'oriental')
			matcher = /([nrlkstŧ])[eo]$/;
		else if(mainDialect == 'northern')
			matcher = (dialect == 'northern.ladin'? /([^aeiouàèéíòóú])[eo]$/: /([nrlmñptkcfŧsdgđx])[eo]$/);

		return word.replace(matcher, '$1');
	};

	var syncopatePluralAfterNasalLateral = function(word, mainDialect){
		if(mainDialect == 'northern' || mainDialect == 'oriental')
			word = word.replace(/([eèéoó])[nl]i$/, '$1i');

		return word;
	};

	var finalConsonantVoicing = function(word, mainDialect){
		if(mainDialect == 'northern')
			word = word.replace(/[bdgvđxʒɉmñ]$/, function(match){
				return (match == 'ñ'? 'nc': 'ptkfŧsʃcn'['bdgvđxʒɉm'.indexOf(match)]);
			});
		/*else if(mainDialect != 'none')
			word = word.replace(/([ptkfŧsʃcn]|nc)$/, function(match){
				return (match == 'nc'? 'ñ': 'bdgvđxʒɉm'['ptkfŧsʃcn'.indexOf(match)]);
			});*/

		return word;
	};


	var approximantPalatalFreeVariation = function(word, mainDialect){
		if(mainDialect == 'lagunar')
			word = word.replace(/j/g, 'ɉ');
		else if(mainDialect == 'oriental')
			word = word.replace(/(^|[^aeiouàèéíòóú])j/g, '$1ɉ');
		else if(mainDialect != 'none')
			word = word.replace(/ɉ/g, 'j');

		return word;
	};

	var lateralFreeVariation = function(word, mainDialect, dialect){
		if(mainDialect == 'centralNorthern' || mainDialect == 'lagunar' || dialect.match(/^central\.(padoan|viŧentin)/))
			word = word.replace(/(^|[aeioàèéíòóuú])l([aeioàèéíòóuú])/g, '$1ƚ$2');
		else if(mainDialect != 'none')
			word = word.replace(/ƚ/g, 'l');

		return word;
	};

	var unstressedVowelBeforeVibrantFreeVariation = function(word, mainDialect, dialect){
		if(dialect.match(/^central\.(padoan|polexan|roigòto|talian)/) || mainDialect == 'western')
			word = word.replace(/([^aeiouàèéíòóuú])er/g, '$1ar');
		//else if(mainDialect != 'none')
		//	word = word.replace(/([^aeiouàèéíòóuú])ar/g, '$1er');
		//FIXME
		/*var syll = Syllabator.syllabate(stressedSuffix, null, true);
		stressedSuffixLoweredVowel = stressedSuffix.replace(/([^aàeèéíoòóú])er/g, function(group, pre, idx){
			return (syll.phones[syll.getSyllabeIndex(idx)].match(/[^jw]e/)? pre + 'ar': group);
		});/**/

		return word;
	};

	var stressedVowelBeforeVibrantFreeVariation = function(word, mainDialect, dialect){
		if(dialect.match(/^central\.(viŧentin|valsuganòto|basoTrentin)/))
			word = word.replace(/([^aeiou])ér/g, '$1èr');
		else if(mainDialect != 'none')
			word = word.replace(/([^aeiou])èr/g, '$1ér');

		return word;
	};


	var constrictiveDentalCombinatorialVariation = function(word, mainDialect, dialect){
		if(mainDialect == 'centralNorthern' || mainDialect == 'lagunar'
				|| dialect.match(/^central\.(padoan|viŧentin|valsuganòto|basoTrentin|talian)/)
				|| dialect.match(/^western\.(altaVeronexe|ŧitadin)/))
			word = word.replace(/[ŧđ]/g, function(match){
				return 'sx'['ŧđ'.indexOf(match)];
			});
		else if(dialect == 'western.basaVeronexe')
			word = word.replace(/đ/g, 'x');
		else if(dialect == 'northern.cipileño')
			word = word.replace(/đ/g, 'd');

		return word;
	};

	var occlusiveDentalCombinatorialVariation = function(word, mainDialect){
		if(mainDialect == 'northern')
			word = word.replace(/k([aà])/g, 'c$1').replace(/g([aà])/g, 'ɉ$1')
				.replace(/ti([aeioàèéíòóuú])/g, 'c$1').replace(/di([aeioàèéíòóuú])/g, 'ɉ$1');

		return word;
	};

	var vowelLoweringCombinatorialVariation = function(word, mainDialect){
		if(mainDialect.match(/^(central|western)/)){
			var m = word.match(/^.+[^aàiu]er(?!e?$)/g);
			if(m && !Grapheme.isEterophonicSequence(m[0]))
				word = word.replace(/^(.+[^aàiu])er(?!e?$)/g, '$1ar');
		}

		return word;
	};


	return {
		//convertPhonesIntoXSampa: convertPhonesIntoXSampa,

		metaphonetizeStressedVowel: metaphonetizeStressedVowel,
		demetaphonetizeStressedVowel: demetaphonetizeStressedVowel,

		truncateAfterConsonant: truncateAfterConsonant,
		syncopatePluralAfterNasalLateral: syncopatePluralAfterNasalLateral,
		finalConsonantVoicing: finalConsonantVoicing,

		approximantPalatalFreeVariation: approximantPalatalFreeVariation,
		lateralFreeVariation: lateralFreeVariation,
		unstressedVowelBeforeVibrantFreeVariation: unstressedVowelBeforeVibrantFreeVariation,
		stressedVowelBeforeVibrantFreeVariation: stressedVowelBeforeVibrantFreeVariation,
		constrictiveDentalCombinatorialVariation: constrictiveDentalCombinatorialVariation,
		occlusiveDentalCombinatorialVariation: occlusiveDentalCombinatorialVariation,
		vowelLoweringCombinatorialVariation: vowelLoweringCombinatorialVariation
	};

});
