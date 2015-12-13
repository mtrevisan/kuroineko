define(['HTMLHelper',
		'tools/data/FunctionHelper',
		'tools/ui/Validator',
		'tools/lang/dictionary/Dictionary',
		'tools/data/coder/arithmetic/HighOrderModelFactory',
		'tools/data/coder/arithmetic/BasicModel',
		'tools/data/coder/arithmetic/CoderDriver',
		'tools/data/structs/BitBuffer',
		'uint8!tools/lang/data/Galepin.ac',
		'libs/jsonh'],
		function(HTMLHelper, FunctionHelper, Validator, Dictionary, HighOrderModelFactory, BasicModel, CoderDriver, BitBuffer, galepin, JSONH){

	var lemmataVecDOM, lemmataItaDOM, lemmataEngDOM, lemmataTableDOM;

	var init = function(){
		lemmataVecDOM = document.getElementById('lemmataVec');
		lemmataItaDOM = document.getElementById('lemmataIta');
		lemmataEngDOM = document.getElementById('lemmataEng');
		lemmataTableDOM = document.getElementById('resultTable').tBodies[0];


		//HTMLHelper.addAccessKeyToSubmitButtons();


		var onKeyUpCorrectOrthography = HTMLHelper.onEventCorrectOrthography(lemmataVecDOM);
		var onKeyUpSearchDictionary = FunctionHelper.createBuffered(function(){
			if(lemmataVecDOM.value.length > 1 || lemmataItaDOM.value.length > 1 || lemmataEngDOM.value.length > 1)
				doSearch();
		}, 300);


		//deflate dictionary
		galepin = deflateDictionary(galepin);

/*var size = galepin.length;
for(var i = 0; i < size; i ++){
//for(var i = 0; i < 200; i ++){
	var el = galepin[i],
		ita = el.translation.ita,
		el2;
	if(el.id == 3825 || el.id == 5412 || el.id == 7727 || el.id == 14166 || el.id == 16463 || el.id == 27955)
		continue;
	for(var j = i + 1; j < size; j ++){
		el2 = galepin[j];
		if(el.lemmata == el2.lemmata && ita == el2.translation.ita)
			console.log('=  ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);/**/
		/*if(el.id != 20969 && el.id != 24405
				&& el.lemmata.indexOf('ŧ') > 0 && el.lemmata.replace(/ŧ/, 's') == el2.lemmata)
			console.log('ŧ  ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);
		if(el.id != 4328
				&& el.lemmata.indexOf('đ') > 0 && el.lemmata.replace(/đ/, 'x') == el2.lemmata)
			console.log('đ  ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);
		if(el.lemmata.indexOf('ŧ') > 0 && el.lemmata.indexOf('đ') > 0 && el.lemmata.replace(/ŧ/, 's').replace(/d/, 'x') == el2.lemmata)
			console.log('ŧđ ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);/**/
		/*if(el.id != 35787 && el.id != 35947 && el.id != 34802 && el.id != 33925 && el.id != 35243 && el.id != 24923 && el.id != 24418
				&& el.id != 24361 && el.id != 23248 && el.id != 402 && el.id != 1020 && el.id != 1722 && el.id != 2035 && el.id != 2046
				&& el.id != 3455 && el.id != 22231 && el.id != 21550 && el.id != 18722 && el.id != 17305 && el.id != 20971 && el.id != 18282
				&& el.id != 16398 && el.id != 15661 && el.id != 15370 && el.id != 10388 && el.id != 10497 && el.it != 9851 && el.id != 8498
				&& el.id != 7413 && el.id != 683 && el.id != 3459 && el.id != 5360 && el.id != 5402 && el.id != 5837 && el.id != 9844 && el.id != 9851
				&& el.id != 5364 && el.id != 5365 && el.id != 5411 && el.id != 5413
				&& el.lemmata.indexOf('s') > 0 && el.lemmata.replace(/s/, 'ŧ') == el2.lemmata)
			console.log('s  ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);
		if(el.id != 34882 && el.id != 34834 && el.id != 32139 && el.id != 24983 && el.id != 24128 && el.id != 2297 && el.id != 3909
				&& el.id != 3910 && el.id != 16301 && el.id != 12582 && el.id != 11853 && el.id != 1284
				&& el.lemmata.indexOf('x') > 0 && el.lemmata.replace(/x/, 'đ') == el2.lemmata)
			console.log('x  ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);/**/
		/*if(el.lemmata.indexOf('s') > 0 && el.lemmata.indexOf('x') > 0 && el.lemmata.replace(/s/, 'ŧ').replace(/x/, 'd') == el2.lemmata)
			console.log('sx ' + el.lemmata + ', id: ' + el.id + '=' + el2.id);
		/*if(ita == el2.translation.ita)
			console.log('/  ' + el.lemmata + '/' + el2.lemmata + ', id: ' + el.id + '=' + el2.id);/**/
/*	}
}/**/

		HTMLHelper.setEncodedInnerHTML('wordCount', '' + galepin.length);



		lemmataVecDOM.onkeyup = function(evt){
			onKeyUpCorrectOrthography(evt);

			if(Validator.validateInput(lemmataVecDOM))
				onKeyUpSearchDictionary();
		};
		lemmataItaDOM.onkeyup = function(){
			if(Validator.validateInput(lemmataItaDOM))
				onKeyUpSearchDictionary();
		};
		lemmataEngDOM.onkeyup = function(){
			if(Validator.validateInput(lemmataEngDOM))
				onKeyUpSearchDictionary();
		};


		//search for input data into the URL
		var params = HTMLHelper.readParamFromURL(['lemmataVec', 'lemmataIta', 'lemmataEng']),
			lemmataVec = params.lemmataVec,
			lemmataIta = params.lemmataIta,
			lemmataEng = params.lemmataEng;
		if(lemmataVec || lemmataIta || lemmataEng){
			lemmataVecDOM.value = lemmataVec;
			lemmataItaDOM.value = lemmataIta;
			lemmataEngDOM.value = lemmataEng;

			doSearch();
		}
	};

	var deflateDictionary = function(galepin){
		var model = CoderDriver.create(HighOrderModelFactory.createFrom(BasicModel, 2), {updateCount: 200});
var start = +new Date();
		var itr = (new BitBuffer(galepin)).getIterator();
		galepin = model.decompress(itr).join('');
var decompress = +new Date();
		galepin = (new Function('return ' + galepin))();
//var load = +new Date();
		galepin = JSONH.unpack(galepin);
//var unpack = +new Date();
//console.log('decompress: ' + (decompress - start));
//console.log('load: ' + (load - decompress));
//console.log('unpack: ' + (unpack - load));

		var loadingInfoEl = document.getElementById('inputSection').querySelector('tr.loading-info');
		loadingInfoEl.style.display = 'none';
		document.getElementById('lemmataVec').disabled = false;
		document.getElementById('lemmataIta').disabled = false;
		document.getElementById('lemmataEng').disabled = false;

		return galepin;
	};

	var doSearch = function(){
		search((lemmataVecDOM.value && lemmataVecDOM.validity.valid? lemmataVecDOM.value: undefined),
			(lemmataItaDOM.value && lemmataItaDOM.validity.valid? lemmataItaDOM.value: undefined),
			(lemmataEngDOM.value && lemmataEngDOM.validity.valid? lemmataEngDOM.value: undefined));
	};

	var search = (function(){
		var appendLemmata = function(lemmata){
			return lemmata;
		};
		var appendLinks = function(data){
			return composeSillabateLink(data.lemmata) + (isVerb(data.partOfSpeech)? ' ' + composeConjugateLink(data.lemmata): '');
		};
		var isVerb = function(pos){
			return pos.some(function(el){ return el.match(/(^|[^a])v\./); });
		};
		var composeConjugateLink = function(infinitive){
			return '<a href="conjugator.html?infinitive=' + infinitive + '#inputSection" target="_blank" title="K&ograve;niuga">k</a>';
		};
		var composeSillabateLink = function(word){
			return '<a href="syllabator.html?text=' + word.replace(/\s\(.+/, '') + '#inputSection" target="_blank" title="S&iacute;laba">s</a>';
		};

		var translationToString = function(translation){
			var str = '';
			if(translation.ita || translation.eng){
				str += '<ul class="language">';
				if(translation.ita)
					str += '<li><span class="language">it.</span>: ' + translation.ita + '</li>';
				if(translation.eng)
					str += '<li><span class="language">en.</span>: ' + translation.eng + '</li>';
				str += '</ul>';
			}
			return str;
		};

		var dialectAsString = {
			'TV': 'feltrin-belumat',
			'BL': 'dolom&iacute;tega',
			'TF': 'liventin',
			'VE': 'lagunar',
			'TS': 'istro-d&agrave;lmata',
			'PD': 'padoan-baso vi&tstrok;entin-polexan',
			'VI': 'alto vi&tstrok;entin',
			'TN': 'trentin',
			'VR': 'veronexe'
		};
		var dialectSorterFn = (function(){
			var value = 'TV,BL,TF,VE,TS,PD,VI,TN,VR';

			return function(str1, str2){
				return value.indexOf(str1) - value.indexOf(str2);
			};
		})();
		var dialectToString = function(dialect){
			dialect.sort(dialectSorterFn);

			var str = [],
				k;
			for(k in dialect)
				str.push(dialectAsString[dialect[k]]);
			return str.join(', ');
		};

		var loadData = function(lemmatas){
			//clear rows from results' table
			var k = lemmataTableDOM.rows.length;
			while(-- k >= 0)
				lemmataTableDOM.deleteRow(k);

			var size = lemmatas.length,
				constClass = 'class',
				constLinks = 'links',
				constPartOfSpeechJoiner = ', ',
				row, data, cell;
			for(k = 0; k < size; k ++){
				row = lemmataTableDOM.insertRow(k);
				data = lemmatas[k];

				row.insertCell(0).innerHTML = appendLemmata(data.lemmata);
				cell = row.insertCell(1);
				cell.innerHTML = appendLinks(data);
				cell.setAttribute(constClass, constLinks);
				row.insertCell(2).innerHTML = data.partOfSpeech.join(constPartOfSpeechJoiner);
				row.insertCell(3).innerHTML = translationToString(data.translation);
				row.insertCell(4).innerHTML = dialectToString(data.dialect);
			}
		};


		return function(lemmataVec, lemmataIta, lemmataEng){
			lemmataVec = (lemmataVec || '').replace(/^\s+|\s+$/g, '');
			lemmataIta = (lemmataIta || '').replace(/^\s+|\s+$/g, '');
			lemmataEng = (lemmataEng || '').replace(/^\s+|\s+$/g, '');
			if(!lemmataVec && !lemmataIta && !lemmataEng)
				return;

			GoogleAnalyticsHelper.trackEvent('Compute', 'SearchDictionary', '{lemmataVec: \'' + lemmataVec
				+ '\', lemmataIta: \'' + lemmataIta + '\', lemmataEng: \'' + lemmataEng + '\'}');


			var infoMessage = '',
				result;

			result = Dictionary.search(galepin, lemmataVec, lemmataIta, lemmataEng);

			if(result.lemmatas.length > 0)
				loadData(result.lemmatas);
			else
				infoMessage = 'no results!';

			HTMLHelper.setEncodedInnerHTML('inputInfo', infoMessage);
		};
	})();


	return {
		init: init
	};

});
