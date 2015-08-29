define(['tools/lang/phonology/Syllabator'], function(Syllabator){
	var syllabatePhonematicAndJoin = function(word){
		return Syllabator.syllabate(word, undefined, true).syllabes.join('-');
	};

	describe('Syllabator - phonematic', function(){
		it('phonematic - plain syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('kaxa')).toBe('kà-xa');
			expect(syllabatePhonematicAndJoin('jutar')).toBe('ju-tàr');
			expect(syllabatePhonematicAndJoin('pàuxa')).toBe('pàu-xa');
			expect(syllabatePhonematicAndJoin('piaŧa')).toBe('pià-ŧa');
			expect(syllabatePhonematicAndJoin('auguri')).toBe('au-gú-ri');
			expect(syllabatePhonematicAndJoin('àuguri')).toBe('àu-gu-ri');
			expect(syllabatePhonematicAndJoin('poèta')).toBe('poè-ta');
			expect(syllabatePhonematicAndJoin('paura')).toBe('paú-ra');
			expect(syllabatePhonematicAndJoin('grant')).toBe('grànt');

			expect(syllabatePhonematicAndJoin('inbrijar')).toBe('in-bri-jàr');
			expect(syllabatePhonematicAndJoin('autoirònego')).toBe('au-toi-rò-ne-go');
			expect(syllabatePhonematicAndJoin('aŧión')).toBe('a-ŧión');
		});

		it('phonematic - double consonant syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('èrba')).toBe('èr-ba');
			expect(syllabatePhonematicAndJoin('saltar')).toBe('sal-tàr');
			expect(syllabatePhonematicAndJoin('lontan')).toBe('lon-tàn');
			expect(syllabatePhonematicAndJoin('finlandia')).toBe('fin-làn-dia');
			expect(syllabatePhonematicAndJoin('abdegar')).toBe('ab-de-gàr');
			expect(syllabatePhonematicAndJoin('gronda')).toBe('grón-da');
			expect(syllabatePhonematicAndJoin('umlaut')).toBe('um-laút');
			expect(syllabatePhonematicAndJoin('injasar')).toBe('in-ja-sàr');
			expect(syllabatePhonematicAndJoin('àlbaro')).toBe('àl-ba-ro');
			expect(syllabatePhonematicAndJoin('serpénte')).toBe('ser-pén-te');
		});

		it('phonematic - double consonant with s initial syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('kospiràr')).toBe('kos-pi-ràr');
			expect(syllabatePhonematicAndJoin('kósto')).toBe('kós-to');
		});

		it('phonematic/graphematic - double consonant with muta cum liquida syllabation').toBe(function(){
			//b).toBe(k).toBe(d).toBe(f).toBe(g).toBe(p).toBe(t).toBe(v + l oppure r
			expect(syllabatePhonematicAndJoin('kablàr')).toBe('ka-blàr');
			expect(syllabatePhonematicAndJoin('cíklo')).toBe('cí-klo');
			//dl
			expect(syllabatePhonematicAndJoin('reflèso')).toBe('re-flè-so');
			expect(syllabatePhonematicAndJoin('neglixénte')).toBe('ne-gli-xén-te');
			expect(syllabatePhonematicAndJoin('dúplise')).toBe('dú-pli-se');
			expect(syllabatePhonematicAndJoin('atlèta')).toBe('a-tlè-ta');
			//vl

			expect(syllabatePhonematicAndJoin('vibràr')).toBe('vi-bràr');
			expect(syllabatePhonematicAndJoin('àkre')).toBe('à-kre');
			expect(syllabatePhonematicAndJoin('kuàdro')).toBe('kuà-dro');
			expect(syllabatePhonematicAndJoin('àfro')).toBe('à-fro');
			expect(syllabatePhonematicAndJoin('àgro')).toBe('à-gro');
			expect(syllabatePhonematicAndJoin('suprèmo')).toBe('su-prè-mo');
			expect(syllabatePhonematicAndJoin('latràto')).toBe('la-trà-to');
			expect(syllabatePhonematicAndJoin('nevróxi')).toBe('ne-vró-xi');
		});

		it('phonematic/graphematic - triple consonant syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('sorprexa')).toBe('sor-pré-xa');
			expect(syllabatePhonematicAndJoin('subtropegal')).toBe('sub-tro-pe-gàl');
			expect(syllabatePhonematicAndJoin('inglexe')).toBe('in-glé-xe');
			expect(syllabatePhonematicAndJoin('kontròl')).toBe('kon-tròl');
			expect(syllabatePhonematicAndJoin('inpresión')).toBe('in-pre-sión');
			expect(syllabatePhonematicAndJoin('solstísio')).toBe('sol-stí-sio');
			expect(syllabatePhonematicAndJoin('rinbrotàr')).toBe('rin-bro-tàr');
		});

		it('phonematic - triple consonant with s initial syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('kostrénxer')).toBe('kos-trén-xer');
			expect(syllabatePhonematicAndJoin('despresàr')).toBe('des-pre-sàr');
		});

		it('phonematic - s-impure inside word syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('bastanŧa')).toBe('bas-tàn-ŧa');
			expect(syllabatePhonematicAndJoin('destrikar')).toBe('des-tri-kàr');
			expect(syllabatePhonematicAndJoin('peskar')).toBe('pes-kàr');
			expect(syllabatePhonematicAndJoin('maèstra')).toBe('maès-tra');
			expect(syllabatePhonematicAndJoin('dexmentegà')).toBe('dex-men-te-gà');
			expect(syllabatePhonematicAndJoin('ciklíxmo')).toBe('ci-klíx-mo');
		});

		it('phonematic - s-impure initial syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('strako')).toBe('s-trà-ko');
			expect(syllabatePhonematicAndJoin('scantixo')).toBe('s-can-tí-xo');
			expect(syllabatePhonematicAndJoin('sfexa')).toBe('s-fé-xa');
			expect(syllabatePhonematicAndJoin('stabia')).toBe('s-tà-bia');
			expect(syllabatePhonematicAndJoin('stranbo')).toBe('s-tràn-bo');
			expect(syllabatePhonematicAndJoin('skòpo')).toBe('s-kò-po');
			expect(syllabatePhonematicAndJoin('stabia')).toBe('s-tà-bia');
			expect(syllabatePhonematicAndJoin('xbaro')).toBe('x-bà-ro');
			expect(syllabatePhonematicAndJoin('xbrigar')).toBe('x-bri-gàr');
			expect(syllabatePhonematicAndJoin('xbèrla')).toBe('x-bèr-la');
		});

		it('phonematic - greek syllabation').toBe(function(){
			expect(syllabatePhonematicAndJoin('psíko')).toBe('p-sí-ko');
			expect(syllabatePhonematicAndJoin('pnèumo')).toBe('p-nèu-mo');
			expect(syllabatePhonematicAndJoin('tmèxi')).toBe('t-mè-xi');
			expect(syllabatePhonematicAndJoin('biopsía')).toBe('biop-sía');
			expect(syllabatePhonematicAndJoin('kàpsula')).toBe('kàp-su-la');
			expect(syllabatePhonematicAndJoin('apnèa')).toBe('ap-nèa');
			expect(syllabatePhonematicAndJoin('ipnóxi')).toBe('ip-nó-xi');
			expect(syllabatePhonematicAndJoin('rítmo')).toBe('rít-mo');
			expect(syllabatePhonematicAndJoin('aritmètega')).toBe('a-rit-mè-te-ga');
			expect(syllabatePhonematicAndJoin('tungstèno')).toBe('tung-stè-no');
		});
	});


	var syllabateGraphematicAndJoin = function(word){
		return Syllabator.syllabate(word, undefined, false).syllabes.join('-');
	};

	describe('Syllabator - graphematic', function(){
		it('graphematic - plain syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('kaxa')).toBe('kà-xa');
			expect(syllabateGraphematicAndJoin('jutar')).toBe('ju-tàr');
			expect(syllabateGraphematicAndJoin('pàuxa')).toBe('pàu-xa');
			expect(syllabateGraphematicAndJoin('piaŧa')).toBe('pià-ŧa');
			expect(syllabateGraphematicAndJoin('auguri')).toBe('a-u-gú-ri');
			expect(syllabateGraphematicAndJoin('àuguri')).toBe('àu-gu-ri');
			expect(syllabateGraphematicAndJoin('poèta')).toBe('po-è-ta');
			expect(syllabateGraphematicAndJoin('paura')).toBe('pa-ú-ra');
			expect(syllabateGraphematicAndJoin('grant')).toBe('grànt');

			expect(syllabateGraphematicAndJoin('inbrijar')).toBe('in-bri-jàr');
			expect(syllabateGraphematicAndJoin('autoirònego')).toBe('a-u-to-i-rò-ne-go');
			expect(syllabateGraphematicAndJoin('aŧión')).toBe('a-ŧión');
		});

		it('graphematic - double consonant syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('èrba')).toBe('èr-ba');
			expect(syllabateGraphematicAndJoin('saltar')).toBe('sal-tàr');
			expect(syllabateGraphematicAndJoin('lontan')).toBe('lon-tàn');
			expect(syllabateGraphematicAndJoin('finlandia')).toBe('fin-làn-dia');
			expect(syllabateGraphematicAndJoin('abdegar')).toBe('ab-de-gàr');
			expect(syllabateGraphematicAndJoin('gronda')).toBe('grón-da');
			expect(syllabateGraphematicAndJoin('umlaut')).toBe('um-la-út');
			expect(syllabateGraphematicAndJoin('injasar')).toBe('in-ja-sàr');
			expect(syllabateGraphematicAndJoin('àlbaro')).toBe('àl-ba-ro');
			expect(syllabateGraphematicAndJoin('serpénte')).toBe('ser-pén-te');
		});

		it('graphematic - double consonant with s initial syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('kospiràr')).toBe('ko-spi-ràr');
			expect(syllabateGraphematicAndJoin('kósto')).toBe('kó-sto');
		});

		it('graphematic - triple consonant with s initial syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('kostrénxer')).toBe('ko-strén-xer');
			expect(syllabateGraphematicAndJoin('despresàr')).toBe('de-spre-sàr');
		});

		it('graphematic - s-impure inside word syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('bastanŧa')).toBe('ba-stàn-ŧa');
			expect(syllabateGraphematicAndJoin('destrikar')).toBe('de-stri-kàr');
			expect(syllabateGraphematicAndJoin('peskar')).toBe('pe-skàr');
			expect(syllabateGraphematicAndJoin('maèstra')).toBe('ma-è-stra');
			expect(syllabateGraphematicAndJoin('dexmentegà')).toBe('de-xmen-te-gà');
			expect(syllabateGraphematicAndJoin('ciklíxmo')).toBe('ci-klí-xmo');
		});

		it('graphematic - s-impure initial syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('strako')).toBe('strà-ko');
			expect(syllabateGraphematicAndJoin('scantixo')).toBe('scan-tí-xo');
			expect(syllabateGraphematicAndJoin('sfexa')).toBe('sfé-xa');
			expect(syllabateGraphematicAndJoin('stabia')).toBe('stà-bia');
			expect(syllabateGraphematicAndJoin('stranbo')).toBe('stràn-bo');
			expect(syllabateGraphematicAndJoin('skòpo')).toBe('skò-po');
			expect(syllabateGraphematicAndJoin('stabia')).toBe('stà-bia');
			expect(syllabateGraphematicAndJoin('xbaro')).toBe('xbà-ro');
			expect(syllabateGraphematicAndJoin('xbrigar')).toBe('xbri-gàr');
			expect(syllabateGraphematicAndJoin('xbèrla')).toBe('xbèr-la');
		});

		it('graphematic - greek syllabation').toBe(function(){
			expect(syllabateGraphematicAndJoin('psíko')).toBe('p-sí-ko');
			expect(syllabateGraphematicAndJoin('pnèumo')).toBe('p-nèu-mo');
			expect(syllabateGraphematicAndJoin('tmèxi')).toBe('t-mè-xi');
			expect(syllabateGraphematicAndJoin('biopsía')).toBe('biop-sí-a');
			expect(syllabateGraphematicAndJoin('kàpsula')).toBe('kàp-su-la');
			expect(syllabateGraphematicAndJoin('apnèa')).toBe('ap-nè-a');
			expect(syllabateGraphematicAndJoin('ipnóxi')).toBe('ip-nó-xi');
			expect(syllabateGraphematicAndJoin('rítmo')).toBe('rít-mo');
			expect(syllabateGraphematicAndJoin('aritmètega')).toBe('a-rit-mè-te-ga');
			expect(syllabateGraphematicAndJoin('tungstèno')).toBe('tung-stè-no');
		});
	});
});
