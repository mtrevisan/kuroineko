require(['tools/data/StringHelper', 'tools/lang/phonology/Word'], function(StringHelper, Word){
	QUnit.module('PastParticiple');

	var strong2tonicT = [
		{matcher: /trà$/, replacement: 'tràt'},
		{matcher: /inkòrx$/, replacement: 'inkòrt'},
		{matcher: /véd$/, replacement: 'víst'},
		{matcher: /remàn$/, replacement: 'remàst'},

		//{matcher: /([aeiouàèéíòóú])rn?$/, replacement: '($1rt/rS1t)'},
		{matcher: /([aeiouàèéíòóú])rn?$/, replacement: '$1rt'},
		{matcher: /li?$/, replacement: 'lt'},
		{matcher: /rí?x$/, replacement: 'rèt'},
		{matcher: /úx$/, replacement: 'ót'},
		{matcher: /ónd?$/, replacement: 'óst'},
		{matcher: /m|n[ds]$/, replacement: 'nt'},
		{matcher: /n[xđp]|[bđgstŧvx]$/, replacement: 't'}
	];
	var strong2tonicS = [
		{matcher: /sucéd$/, replacement: 'sucès'},

		{matcher: /ónd$/, replacement: 'úx'},
		{matcher: /([aeiouàèéíòóú])n?d$/, replacement: '$1x'},
		{matcher: /([^aeiouàèéíòóú]n?)d|[stvx]$/, replacement: '$1s'},
		{matcher: /pèl$/, replacement: 'púls'},
		{matcher: /ím$/, replacement: 'ès'},
		{matcher: /st$/, replacement: 'íx'},
		{matcher: /rd?$/, replacement: 'rs'},
		{matcher: /l$/, replacement: 'ls'}
	];
	var strong2atone = [
		{matcher: /n$/, replacement: 'x'},
		{matcher: /r$/, replacement: 'rs'},
		{matcher: /òl$/, replacement: 'òlt'},
		{matcher: /àl$/, replacement: 'àls'}
	];
	var strong3 = [
		{matcher: /mòr$/, falsePositives: /(inti|mar)mòr$/, replacement: 'mòrt'},

		{matcher: /([^aeiouàèéíòóú])r$/, falsePositives: /núdr$/, replacement: '$1èrt'},
		{matcher: /r$/, replacement: 'rs'}
	];


	var generateParticiplePerfectStrong = function(themeT8, data){
		var m, match;
		if(data.some(function(el){ m = el; match = this.match(el.matcher); return match; }, themeT8) && (!m.falsePositives || !themeT8.match(m.falsePositives))){
			if(Word.isStressed(m.replacement) && !Word.isStressed(match[0]))
				themeT8 = Word.suppressStress(themeT8);
			return themeT8.replace(m.matcher, m.replacement);
		}
		return undefined;
	};

	var isParticiplePerfectStrongT = (function(){
		var data = [
			/[aeiouàèéíòóú](rn?)?$/,
			/[^aeiouàèéíòóú]r$/,
			/li?$/,
			/ón$/,
			/n[dp]$/,
			/[bđgmstŧvx]$/,

			/véd$/, /remàn$/
		];
		var falsePositives = [
			/kór$/,
			/f[éó]nd$/,
			/piàx$/,
			/pàrx?$/,
			/mét$/,
			/móv$/,
			/kóns$/,
			/prím$/
		];

		return function(themeT8){
			return StringHelper.isMatching(themeT8, data, falsePositives);
		};
	})();

	var isParticiplePerfectStrongS = (function(){
		var data = [
			/n?d$/,
			/[lstvx]$/,
			/ím$/,
			/rd?$/
		];
		var falsePositives = [
			/skrív$/,
			/sòlv$/,
			/sp[àó]nd$/,
			/inkòrx$/,
			/d[íú]x$/,
			/véd$/
		];

		return function(themeT8){
			return StringHelper.isMatching(themeT8, data, falsePositives);
		};
	})();


	var i, pp;


	var testStrong2tonicT = ['rónp', 'skrív', 'vínŧ', 'kuèrđ', 'spànd', 'inkòrx', 'dúx', 'vèrđ', 'sòlv', 'siòli', 'véd', 'asúm', 'díx', 'pón', 'respónd', 'remàn', 'trà'];
	var expectedResult2tonicT = ['rót', 'skrít', 'vínt', 'kuèrt', 'spànt', 'inkòrt', 'dót', 'vèrt', 'sòlt', 'siòlt', 'víst', 'asúnt', 'dít', 'póst', 'respóst', 'remàst', 'tràt'];

	console.log('\ntest 2nd coniug. rhizotonic T past-participles:');
	for(i in testStrong2tonicT){
		if(!isParticiplePerfectStrongT(testStrong2tonicT[i]) || isParticiplePerfectStrongS(testStrong2tonicT[i]))
			console.log(testStrong2tonicT[i] + ': expected to be strong-T');
		if(isParticiplePerfectStrongT(testStrong2tonicT[i]) && isParticiplePerfectStrongS(testStrong2tonicT[i]))
			console.log(testStrong2tonicT[i] + ': expected to be strong-T, have both');

		pp = generateParticiplePerfectStrong(testStrong2tonicT[i], strong2tonicT);
		if(pp != expectedResult2tonicT[i])
			console.log(testStrong2tonicT[i] + ': expected ' + expectedResult2tonicT[i] + ', have ' + pp);
	}

	var testStrong2tonicS = ['kór', 'ofénd', 'piàx', 'pàr', 'pèrd', 'mét', 'móv', 'sucéd', 'kóns', 'inklúd', 'mét', 'pàr', 'spàrx', 'prím', 'fónd'];
	var expectedResult2tonicS = ['kórs', 'oféx', 'piàs', 'pàrs', 'pèrs', 'més', 'mós', 'sucès', 'kóns', 'inklúx', 'més', 'pàrs', 'spàrs', 'près', 'fúx'];

	console.log('\ntest 2nd coniug. rhizotonic S past-participles:');
	for(i in testStrong2tonicS){
		if(!isParticiplePerfectStrongS(testStrong2tonicS[i]) || !isParticiplePerfectStrongS(testStrong2tonicS[i]))
			console.log(testStrong2tonicS[i] + ': expected to be strong-S');
		if(isParticiplePerfectStrongT(testStrong2tonicS[i]) && isParticiplePerfectStrongS(testStrong2tonicS[i]))
			console.log(testStrong2tonicS[i] + ': expected to be strong-S, have both');

		pp = generateParticiplePerfectStrong(testStrong2tonicS[i], strong2tonicS);
		if(pp != expectedResult2tonicS[i])
			console.log(testStrong2tonicS[i] + ': expected ' + expectedResult2tonicS[i] + ', have ' + pp);
	}


	//rizoatone (avér, -manér, -parér, podér, savér, -tolér/-volér, e valér)
	var testStrong2atone = ['permàn', 'pàr', 'tòl', 'vàl'];
	var expectedResult2atone = ['permàx', 'pàrs', 'tòlt', 'vàls'];

	console.log('\ntest 2nd coniug. rhizoatone past-participles:');
	for(i in testStrong2atone){
		pp = generateParticiplePerfectStrong(testStrong2atone[i], strong2atone);
		if(pp != expectedResult2atone[i])
			console.log(testStrong2atone[i] + ': expected ' + expectedResult2atone[i] + ', have ' + pp);
	}


	var testStrong3 = ['mòr', 'òfr'];
	var expectedResult3 = ['mòrt', 'ofèrt'];

	console.log('\ntest 3rd coniug. past-participles:');
	for(i in testStrong3){
		pp = generateParticiplePerfectStrong(testStrong3[i], strong3);
		if(pp != expectedResult3[i])
			console.log(testStrong3[i] + ': expected ' + expectedResult3[i] + ', have ' + pp);
	}
});
