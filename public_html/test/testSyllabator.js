require(['tools/lang/phonology/Syllabator'], function(Syllabator){
	QUnit.module('Syllabator');

	var syllabatePhonematicAndJoin = function(word){
		return Syllabator.syllabate(word, undefined, true).syllabes.join('-');
	};


	QUnit.test('phonematic - plain syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('kaxa'), 'kà-xa');
		assert.equal(syllabatePhonematicAndJoin('jutar'), 'ju-tàr');
		assert.equal(syllabatePhonematicAndJoin('pàuxa'), 'pàu-xa');
		assert.equal(syllabatePhonematicAndJoin('piaŧa'), 'pià-ŧa');
		assert.equal(syllabatePhonematicAndJoin('auguri'), 'au-gú-ri');
		assert.equal(syllabatePhonematicAndJoin('àuguri'), 'àu-gu-ri');
		assert.equal(syllabatePhonematicAndJoin('poèta'), 'poè-ta');
		assert.equal(syllabatePhonematicAndJoin('paura'), 'paú-ra');
		assert.equal(syllabatePhonematicAndJoin('grant'), 'grànt');

		assert.equal(syllabatePhonematicAndJoin('inbrijar'), 'in-bri-jàr');
		assert.equal(syllabatePhonematicAndJoin('autoirònego'), 'au-toi-rò-ne-go');
		assert.equal(syllabatePhonematicAndJoin('aŧión'), 'a-ŧión');
	});

	QUnit.test('phonematic - double consonant syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('èrba'), 'èr-ba');
		assert.equal(syllabatePhonematicAndJoin('saltar'), 'sal-tàr');
		assert.equal(syllabatePhonematicAndJoin('lontan'), 'lon-tàn');
		assert.equal(syllabatePhonematicAndJoin('finlandia'), 'fin-làn-dia');
		assert.equal(syllabatePhonematicAndJoin('abdegar'), 'ab-de-gàr');
		assert.equal(syllabatePhonematicAndJoin('gronda'), 'grón-da');
		assert.equal(syllabatePhonematicAndJoin('umlaut'), 'um-laút');
		assert.equal(syllabatePhonematicAndJoin('injasar'), 'in-ja-sàr');
		assert.equal(syllabatePhonematicAndJoin('àlbaro'), 'àl-ba-ro');
		assert.equal(syllabatePhonematicAndJoin('serpénte'), 'ser-pén-te');
	});

	QUnit.test('phonematic - double consonant with s initial syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('kospiràr'), 'kos-pi-ràr');
		assert.equal(syllabatePhonematicAndJoin('kósto'), 'kós-to');
	});

	QUnit.test('phonematic/graphematic - double consonant with muta cum liquida syllabation', function(assert){
		//b, k, d, f, g, p, t, v + l oppure r
		assert.equal(syllabatePhonematicAndJoin('kablàr'), 'ka-blàr');
		assert.equal(syllabatePhonematicAndJoin('cíklo'), 'cí-klo');
		//dl
		assert.equal(syllabatePhonematicAndJoin('reflèso'), 're-flè-so');
		assert.equal(syllabatePhonematicAndJoin('neglixénte'), 'ne-gli-xén-te');
		assert.equal(syllabatePhonematicAndJoin('dúplise'), 'dú-pli-se');
		assert.equal(syllabatePhonematicAndJoin('atlèta'), 'a-tlè-ta');
		//vl

		assert.equal(syllabatePhonematicAndJoin('vibràr'), 'vi-bràr');
		assert.equal(syllabatePhonematicAndJoin('àkre'), 'à-kre');
		assert.equal(syllabatePhonematicAndJoin('kuàdro'), 'kuà-dro');
		assert.equal(syllabatePhonematicAndJoin('àfro'), 'à-fro');
		assert.equal(syllabatePhonematicAndJoin('àgro'), 'à-gro');
		assert.equal(syllabatePhonematicAndJoin('suprèmo'), 'su-prè-mo');
		assert.equal(syllabatePhonematicAndJoin('latràto'), 'la-trà-to');
		assert.equal(syllabatePhonematicAndJoin('nevróxi'), 'ne-vró-xi');
	});

	QUnit.test('phonematic/graphematic - triple consonant syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('sorprexa'), 'sor-pré-xa');
		assert.equal(syllabatePhonematicAndJoin('subtropegal'), 'sub-tro-pe-gàl');
		assert.equal(syllabatePhonematicAndJoin('inglexe'), 'in-glé-xe');
		assert.equal(syllabatePhonematicAndJoin('kontròl'), 'kon-tròl');
		assert.equal(syllabatePhonematicAndJoin('inpresión'), 'in-pre-sión');
		assert.equal(syllabatePhonematicAndJoin('solstísio'), 'sol-stí-sio');
		assert.equal(syllabatePhonematicAndJoin('rinbrotàr'), 'rin-bro-tàr');
	});

	QUnit.test('phonematic - triple consonant with s initial syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('kostrénxer'), 'kos-trén-xer');
		assert.equal(syllabatePhonematicAndJoin('despresàr'), 'des-pre-sàr');
	});

	QUnit.test('phonematic - s-impure inside word syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('bastanŧa'), 'bas-tàn-ŧa');
		assert.equal(syllabatePhonematicAndJoin('destrikar'), 'des-tri-kàr');
		assert.equal(syllabatePhonematicAndJoin('peskar'), 'pes-kàr');
		assert.equal(syllabatePhonematicAndJoin('maèstra'), 'maès-tra');
		assert.equal(syllabatePhonematicAndJoin('dexmentegà'), 'dex-men-te-gà');
		assert.equal(syllabatePhonematicAndJoin('ciklíxmo'), 'ci-klíx-mo');
	});

	QUnit.test('phonematic - s-impure initial syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('strako'), 's-trà-ko');
		assert.equal(syllabatePhonematicAndJoin('scantixo'), 's-can-tí-xo');
		assert.equal(syllabatePhonematicAndJoin('sfexa'), 's-fé-xa');
		assert.equal(syllabatePhonematicAndJoin('stabia'), 's-tà-bia');
		assert.equal(syllabatePhonematicAndJoin('stranbo'), 's-tràn-bo');
		assert.equal(syllabatePhonematicAndJoin('skòpo'), 's-kò-po');
		assert.equal(syllabatePhonematicAndJoin('stabia'), 's-tà-bia');
		assert.equal(syllabatePhonematicAndJoin('xbaro'), 'x-bà-ro');
		assert.equal(syllabatePhonematicAndJoin('xbrigar'), 'x-bri-gàr');
		assert.equal(syllabatePhonematicAndJoin('xbèrla'), 'x-bèr-la');
	});

	QUnit.test('phonematic - greek syllabation', function(assert){
		assert.equal(syllabatePhonematicAndJoin('submontano'), 'sub-mon-tà-no');
		assert.equal(syllabatePhonematicAndJoin('abnegasion'), 'ab-ne-ga-sión');
		assert.equal(syllabatePhonematicAndJoin('àbside'), 'àb-si-de');
		assert.equal(syllabatePhonematicAndJoin('drakma'), 'dràk-ma');
		assert.equal(syllabatePhonematicAndJoin('tèknika'), 'tèk-ni-ka');
		assert.equal(syllabatePhonematicAndJoin('iks'), 'ík-s');
		assert.equal(syllabatePhonematicAndJoin('etnía'), 'et-nía');
		assert.equal(syllabatePhonematicAndJoin('pnèumo'), 'p-nèu-mo');
		assert.equal(syllabatePhonematicAndJoin('apnèa'), 'ap-nèa');
		assert.equal(syllabatePhonematicAndJoin('ipnóxi'), 'ip-nó-xi');
		assert.equal(syllabatePhonematicAndJoin('psíko'), 'p-sí-ko');
		assert.equal(syllabatePhonematicAndJoin('biopsía'), 'biop-sía');
		assert.equal(syllabatePhonematicAndJoin('kàpsula'), 'kàp-su-la');
		assert.equal(syllabatePhonematicAndJoin('tmèxi'), 't-mè-xi');
		assert.equal(syllabatePhonematicAndJoin('rítmo'), 'rít-mo');
		assert.equal(syllabatePhonematicAndJoin('aritmètega'), 'a-rit-mè-te-ga');

		assert.equal(syllabatePhonematicAndJoin('tungstèno'), 'tung-stè-no');
	});



	var syllabateGraphematicAndJoin = function(word){
		return Syllabator.syllabate(word, undefined, false).syllabes.join('-');
	};

	QUnit.test('graphematic - plain syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('kaxa'), 'kà-xa');
		assert.equal(syllabateGraphematicAndJoin('jutar'), 'ju-tàr');
		assert.equal(syllabateGraphematicAndJoin('pàuxa'), 'pàu-xa');
		assert.equal(syllabateGraphematicAndJoin('piaŧa'), 'pià-ŧa');
		assert.equal(syllabateGraphematicAndJoin('auguri'), 'a-u-gú-ri');
		assert.equal(syllabateGraphematicAndJoin('àuguri'), 'àu-gu-ri');
		assert.equal(syllabateGraphematicAndJoin('poèta'), 'po-è-ta');
		assert.equal(syllabateGraphematicAndJoin('paura'), 'pa-ú-ra');
		assert.equal(syllabateGraphematicAndJoin('grant'), 'grànt');

		assert.equal(syllabateGraphematicAndJoin('inbrijar'), 'in-bri-jàr');
		assert.equal(syllabateGraphematicAndJoin('autoirònego'), 'a-u-to-i-rò-ne-go');
		assert.equal(syllabateGraphematicAndJoin('aŧión'), 'a-ŧión');
	});

	QUnit.test('graphematic - double consonant syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('èrba'), 'èr-ba');
		assert.equal(syllabateGraphematicAndJoin('saltar'), 'sal-tàr');
		assert.equal(syllabateGraphematicAndJoin('lontan'), 'lon-tàn');
		assert.equal(syllabateGraphematicAndJoin('finlandia'), 'fin-làn-dia');
		assert.equal(syllabateGraphematicAndJoin('abdegar'), 'ab-de-gàr');
		assert.equal(syllabateGraphematicAndJoin('gronda'), 'grón-da');
		assert.equal(syllabateGraphematicAndJoin('umlaut'), 'um-la-út');
		assert.equal(syllabateGraphematicAndJoin('injasar'), 'in-ja-sàr');
		assert.equal(syllabateGraphematicAndJoin('àlbaro'), 'àl-ba-ro');
		assert.equal(syllabateGraphematicAndJoin('serpénte'), 'ser-pén-te');
	});

	QUnit.test('graphematic - double consonant with s initial syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('kospiràr'), 'ko-spi-ràr');
		assert.equal(syllabateGraphematicAndJoin('kósto'), 'kó-sto');
	});

	QUnit.test('graphematic - triple consonant with s initial syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('kostrénxer'), 'ko-strén-xer');
		assert.equal(syllabateGraphematicAndJoin('despresàr'), 'de-spre-sàr');
	});

	QUnit.test('graphematic - s-impure inside word syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('bastanŧa'), 'ba-stàn-ŧa');
		assert.equal(syllabateGraphematicAndJoin('destrikar'), 'de-stri-kàr');
		assert.equal(syllabateGraphematicAndJoin('peskar'), 'pe-skàr');
		assert.equal(syllabateGraphematicAndJoin('maèstra'), 'ma-è-stra');
		assert.equal(syllabateGraphematicAndJoin('dexmentegà'), 'de-xmen-te-gà');
		assert.equal(syllabateGraphematicAndJoin('ciklíxmo'), 'ci-klí-xmo');
	});

	QUnit.test('graphematic - s-impure initial syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('strako'), 'strà-ko');
		assert.equal(syllabateGraphematicAndJoin('scantixo'), 'scan-tí-xo');
		assert.equal(syllabateGraphematicAndJoin('sfexa'), 'sfé-xa');
		assert.equal(syllabateGraphematicAndJoin('stabia'), 'stà-bia');
		assert.equal(syllabateGraphematicAndJoin('stranbo'), 'stràn-bo');
		assert.equal(syllabateGraphematicAndJoin('skòpo'), 'skò-po');
		assert.equal(syllabateGraphematicAndJoin('stabia'), 'stà-bia');
		assert.equal(syllabateGraphematicAndJoin('xbaro'), 'xbà-ro');
		assert.equal(syllabateGraphematicAndJoin('xbrigar'), 'xbri-gàr');
		assert.equal(syllabateGraphematicAndJoin('xbèrla'), 'xbèr-la');
	});

	QUnit.test('graphematic - greek syllabation', function(assert){
		assert.equal(syllabateGraphematicAndJoin('submontano'), 'sub-mon-tà-no');
		assert.equal(syllabateGraphematicAndJoin('abnegasion'), 'ab-ne-ga-sión');
		assert.equal(syllabateGraphematicAndJoin('àbside'), 'àb-si-de');
		assert.equal(syllabateGraphematicAndJoin('drakma'), 'dràk-ma');
		assert.equal(syllabateGraphematicAndJoin('tèknika'), 'tèk-ni-ka');
		assert.equal(syllabateGraphematicAndJoin('iks'), 'ík-s');
		assert.equal(syllabateGraphematicAndJoin('etnía'), 'et-ní-a');
		assert.equal(syllabateGraphematicAndJoin('pnèumo'), 'p-nèu-mo');
		assert.equal(syllabateGraphematicAndJoin('apnèa'), 'ap-nè-a');
		assert.equal(syllabateGraphematicAndJoin('ipnóxi'), 'ip-nó-xi');
		assert.equal(syllabateGraphematicAndJoin('psíko'), 'p-sí-ko');
		assert.equal(syllabateGraphematicAndJoin('biopsía'), 'biop-sí-a');
		assert.equal(syllabateGraphematicAndJoin('kàpsula'), 'kàp-su-la');
		assert.equal(syllabateGraphematicAndJoin('tmèxi'), 't-mè-xi');
		assert.equal(syllabateGraphematicAndJoin('rítmo'), 'rít-mo');
		assert.equal(syllabateGraphematicAndJoin('aritmètega'), 'a-rit-mè-te-ga');

		assert.equal(syllabateGraphematicAndJoin('tungstèno'), 'tung-stè-no');
	});
});
