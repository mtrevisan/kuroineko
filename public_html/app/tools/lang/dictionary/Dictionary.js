/**
 * @class Dictionary
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Orthography', 'tools/lang/phonology/Word'], function(Orthography, Word){

	/** @requires word be trimmed. */
	var search = function(galepin, wordVec, wordIta, wordEng){
		wordVec = Orthography.correctOrthography(wordVec);

		var lemmatas = searchDictionary(galepin, wordVec, wordIta, wordEng);

		return {
			lemmatas: lemmatas
		};
	};

	/** @private */
	var searchDictionary = function(galepin, wordVec, wordIta, wordEng, options){
		options = options || {};

		if(wordVec){
			//generate stressed variants
			wordVec = wordVec.replace(/[aà]/g, '[aà]').replace(/[eèé]/g, '[eèé]').replace(/[ií]/g, '[ií]').replace(/[oòó]/g, '[oòó]').replace(/[uú]/g, '[uú]');

			//generate regional variants
			//wordVec = wordVec.replace(/[jɉ]/g, '[jɉ]').replace(/ƚ/g, 'l').replace(/fh/g, 'f').replace(/[dđx]/g, '[dđx]').replace(/[sŧ]/g, '[sŧ]');

			wordVec = wordVec.replace(/^#/, '(^|\\|)').replace(/#$/, '($|\\|)');
		}

		var results = [],
			reVec = new RegExp(wordVec),
			reIta = new RegExp(wordIta),
			reEng = new RegExp(wordEng),
			k, row;
/*var map = new HashMap(function(key){
		return key.split(' (')[0];
	});
for(k in galepin){
	row = galepin[k];
	map.put(row.lemmata, row);
}/**/
		for(k in galepin){
			row = galepin[k];

/*if(Word.markDefaultStress(Word.suppressStress(row.lemmata)) == row.lemmata)
	console.log(row.lemmata);/**/
/*if(row.lemmata.match(/[ŧđ]/)){
	var l;
	if(row.lemmata.match(/ŧ/))
		l = row.lemmata.replace(/ŧ/g, 's');
	if(row.lemmata.match(/đ/))
		l = row.lemmata.replace(/đ/g, 'x');
	if(map.get(l))
		console.log('duplicated: ' + row.lemmata + ' / ' + l);
}/**/
			if(wordVec && row.lemmata.match(reVec)
					|| wordIta && (row.translation.ita || '').match(reIta)
					|| wordEng && (row.translation.eng || '').match(reEng))
				results.push(row);
		}

		if(results.length)
			results = results.sort(function(a, b){ return Word.sorterFn(a.lemmata, b.lemmata); });

		return results;
	};


	return {
		search: search
	};

});
