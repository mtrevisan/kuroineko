require(['tools/lang/phonology/Hyphenator', 'tools/lang/phonology/hyphenatorPatterns/vec', 'tools/lang/phonology/hyphenatorPatterns/vec_phonemic'], function(Hyphenator, pattern_vec, pattern_vec_phonemic){
	QUnit.module('Hyphenator');

	QUnit.test('Hyphenator graphematic', function(assert){
		var hyphenator = new Hyphenator(pattern_vec);
		var words = [
			//bc
			'subcelular',
			//bd
			'abdegar',
			//bđ
			//bf
			'subfornidura',
			//bg
			//bj
			//bɉ
			//bk
			'subkortegal',
			//bl
			'ablativo', 'blandir',
			//bm
			'submontan',
			//bn
			'subnormal',
			//bñ
			//bp
			'subpolar',
			//br
			'abraŧar', 'braŧo',
			//bs([fo]|[kt]r)
			'obsoleto', 'subsfèrego', 'subskríver', 'substrato',
			//bt[or]
			'subtotal', 'subtropegal',
			//bŧ
			//bv
			'subvéder',
			//bx

			//db
			//dc
			//dđ
			//df
			//dg
			//dj
			//dɉ
			//dk
			//dl
			//dm
			'kadmio',
			//dn
			'ekidna',
			//dñ
			//dp
			//dr
			'dreŧar', 'adria',
			//ds
			'feldspato',
			//dt
			//dŧ
			//dv
			'advokaŧion',
			//dx

			//fb
			//fc
			//fd
			//fđ
			//fg
			'afgan',
			//fj
			//fɉ
			//fk
			//fl
			'flúido', 'reflèso',
			//fm
			//fn
			'afnio',
			//fñ
			//fp
			//fr
			'fruto', 'xafran',
			//fs
			//ft
			'afta', 'ftàlego',
			//fŧ
			//fv
			//fx

			//gb
			//gc
			//gd
			'amígdala',
			//gđ
			//gf
			'stagflaŧion',
			//gj
			//gɉ
			//gk
			//gl
			'glòria', 'kúgluf',
			//gm
			'dògma',
			//gn
			//gñ
			//gp
			//gr
			'grado', 'negro', 'xgrénxer',
			//ngs(tr?)?
			'tungsteno', 'angstrom',
			//gt
			//gŧ
			//gv
			//gx

			//kb
			'ekbòlego',
			//kc
			//kd
			'ekdèmego',
			//kđ
			//kf
			//kg
			//kj
			//kɉ
			//kl
			'biŧikleta', 'klàsego',
			//km
			'drakma', 'kmèr',
			//kn
			'akne', 'knòso',
			//kñ
			//kp
			//kr
			'krea', 'sakro',
			//ks
			'fuksia',
			//kt
			'ektòpego',
			//kŧ
			//kv
			//kx

			//lb
			'àlbaro',
			//lc
			'alcon',
			//ld
			'aldir',
			//lđ
			'vòlđer',
			//lf
			'talfiada', 'fenolftaleina',
			//lg
			'alguaro',
			//lj
			'induljentar',
			//lɉ
			'nervalɉía',
			//lk
			'palko',
			//lm
			'kalmo',
			//ln
			'malnutrío',
			//lñ
			//lp
			'alpi',
			//lr
			'malriesío',
			//ls
			'malsan',
			//lt
			'alto',
			//lŧ
			'xmalŧar',
			//lv
			'malva',
			//lx
			'bolxèr',

			//mb
			//mc
			//md
			//mđ
			//mf
			//mg
			//mj
			//mɉ
			//mk
			//ml
			'umlaut',
			//mn
			'amnexía', 'mnèxi', 'ŧirkumnavegar',
			//mñ
			//mp
			'ŧirkumpolar',
			//mr
			//ms
			'ŧirkumstelar',
			//mt
			'fèmto',
			//mŧ
			//mv
			'ŧirkumvexuvian',
			//mx

			//nb
			'kanbio',
			//nc
			'mincon',
			//nd
			'mondo',
			//nđ
			'mónđar',
			//nf
			'onfegar',
			//ng
			'óngaro',
			//nj
			'injarar',
			//nɉ
			'konɉedar',
			//nk
			'bianko',
			//nl
			'inluamar',
			//nm
			'inmanegar',
			//nñ
			//np
			'inpakar', 'inprontar',
			//nr
			'manrovèrso',
			//ns
			'riensir',
			//nt
			'santan',
			//nŧ
			'sapienŧa',
			//nv
			'skonveñir',
			//nx
			'skonxurar',

			//pb
			//pc
			//pd
			//pđ
			//pf
			//pg
			//pj
			//pɉ
			//pk
			//pl
			'plaka', 'reoplano',
			//pm
			//pn
			'apnèa', 'pnèumo', 'pneumografía', 'polipnèa', 'ortopnèa',
			//pñ
			//pr
			'prova', 'inprontar',
			//ps
			'psiko', 'asèpsi', 'polipsònio', 'kàpsula',
			//pt
			'adèpto',
			//pŧ
			//pv
			//px

			//rb
			'èrba',
			//rc
			'percepisio',
			//rd
			'pèrdar',
			//rđ
			'skovèrđer',
			//rf
			'serfojaro',
			//rg
			'serurgo',
			//rj
			'xmarjasada',
			//rɉ
			'sperɉurar',
			//rk
			'sporkar',
			//rl
			'stangerlon',
			//rm
			'sterminar',
			//rn
			'stornar',
			//rñ
			'gorñal',
			//rp
			'skarpa',
			//rs
			'bituarse',
			//rt
			'abortir', 'ortoèpiko',
			//rŧ
			'arŧon',
			//rv
			'servir',
			//rx
			'garxar',

			//sc
			'scòna', 'masco',
			//sf
			'sfogo',
			//sk
			'skala', 'tanaska', 'reiskríver',
			//sp
			'spèco', 'vèspa',
			//st
			'vestir', 'astro', 'stómego', 'strafanto',
			//sŧ
			//sx

			//tb
			//tc
			//td
			//tđ
			//tf
			//tg
			//tj
			//tɉ
			//tk
			'sotkòŧ',
			//tl
			//tm
			'tmèxi', 'algoritmo',
			//tn
			'ètniko',
			//tñ
			//tp
			//tr
			'tràpano', 'arto', 'artrite',
			//ts
			//tŧ
			//tv
			//tx

			//vb
			//vc
			//vd
			//vđ
			//vf
			//vg
			//vj
			//vɉ
			//vk
			//vl
			//vm
			//vn
			//vñ
			//vp
			//vr
			'manòvra',
			//vs
			//vt
			//vŧ
			//vx

			//xb
			'xbaketar', 'cixbar',
			//xc
			//xd
			'kaxdrafo',
			//xđ
			//xf
			//xg
			'xgajo',
			//xj
			//xɉ
			'xɉansar',
			//xk
			//xl
			'xlaka', 'buxlar',
			//xm
			'egoixmo',
			//xn
			'maxnada', 'xnegar',
			//xñ
			'xñakar', 'orexñaŧa',
			//xp
			//xr
			'xraɉonar',
			//xs
			//xt
			//xŧ
			//xv
			'xvodar',

			//kontro
			'kontroexenpio', 'kontroindikar',
			//èkstra
			'èkstra', 'ekstrasolar', 'ekstraeuropèo', 'ekstrauterin', 'ekstraospedalièr',
			//para
			'parabankario', 'paraetimolòxego', 'paraòci', 'paraurti',
			//òpto
			'optoeletrònego', 'optografía',
			//anti
			'antilèrxego', 'antiatòmego',
			//pne
			'dispnèa', 'dispnòiko',
			//bio
			'biolòxego', 'bioastronàuta', 'bioelètrego', 'bioenerxía',
			//pre
			'prealarme', 'preexame',
			//diphtongs
			'viòla', 'indian', 'piòlo', 'lengua', 'kuesto', 'xàino', 'piaxe', 'pien', 'dietro', 'ocài', 'matèria', 'pinguin', 'euròpa', 'piuma',
			'foiba',
			//others
			'abnegaŧion', 'àbside', 'drakma', 'tèknika', 'pnèumo', 'psikoloxía', 'aritmètega', 'etnía', 'strako', 'baston', 'maèstro', 'poèta',
			'paexe', 'buxía', 'siar', 'paura', 'diurno', 'suino', 'kaxa', 'jutar', 'pàuxa', 'piaŧa', 'auguri', 'àuguri', 'grant', 'inbrijar',
			'autoirònego', 'aŧion', 'saltar', 'lontan', 'finlandia', 'gronda', 'injasar', 'serpente', 'kospirar', 'kosto', 'kostrénxer', 'despresar',
			'bastanŧa', 'destrikar', 'peskar', 'dexmentegà', 'ciklixmo', 'strako', 'scantixo', 'sfexa', 'stabia', 'stranbo', 'skòpo',
			'xbaro', 'xbrigar', 'xbèrla', 'submontano', 'transubstanŧiar', 'abnegasion', 'àbside', 'tèknika', 'iks', 'etnía', 'ipnoxi', 'biopsía',
			'ritmo', 'aritmètega', 'poexía', 'gas', 'alfa', 'skríver',
			'pasta', 'parte', 'mario', 'àkuila', 'apro', 'duplise', 'bastar', 'stòria',
			'kontroakuxa', 'kontroexenpio', 'kontroindikar', 'ŧirkondar', 'iperativo',
			//jati
			'auspika', 'autora', 'frauda', 'lauda', 'laurea', 'naufraga', 'nauxea', 'paupera', 'instaura', 'restaura',
			'piola', 'siola', 'ŧiola', 'viola', 'perioda',
			'gua', 'ingua', 'frua', 'grua', 'sua', 'strasua',
			'arfia', 'efia', 'ifia', 'nia', 'dexnia', 'kria', 'pria', 'stria', 'sia', 'devia', 'invia', 'xvia',
			'dixèrta', 'dexeredar',
			'subentro', 'subintrar',
			'subé', 'subí', 'subíimo', 'subísimo', 'subívimo', 'suben', 'subendo', 'subene', 'subense', 'subente', 'subesto', 'subié', 'subia', 'subido',
			'subon', 'subone', 'subonse',
			'sublimà', 'sublimo',
			'subio', 'subion', 'subisen', 'subisié', 'subiven', 'subiè',
			'posdatar', 'dexine'
		];
		var expected = [
			'sub-ce-lu-lar', 'ab-de-gar', 'sub-for-ni-du-ra', 'sub-kor-te-gal', 'a-bla-ti-vo', 'blan-dir', 'sub-mon-tan', 'sub-nor-mal',
			'sub-po-lar', 'a-bra-ŧar', 'bra-ŧo', 'ob-so-le-to', 'sub-sfè-re-go', 'sub-skrí-ver', 'sub-stra-to', 'sub-to-tal', 'sub-tro-pe-gal',
			'sub-vé-der', 'kad-mio', 'e-kid-na', 'dre-ŧar', 'a-dria', 'felds-pa-to', 'ad-vo-ka-ŧion', 'af-gan', 'flúi-do', 're-flè-so', 'af-nio',
			'fru-to', 'xa-fran', 'af-ta', 'ftà-le-go', 'a-míg-da-la', 'stag-fla-ŧion', 'glò-ria', 'kú-gluf', 'dòg-ma', 'gra-do', 'ne-gro',
			'xgrén-xer', 'tungs-te-no', 'angs-trom', 'ek-bò-le-go', 'ek-dè-me-go', 'bi-ŧi-kle-ta', 'klà-se-go', 'drak-ma', 'kmèr', 'ak-ne', 'knò-so',
			'krea', 'sa-kro', 'fuk-sia', 'ek-tò-pe-go', 'àl-ba-ro', 'al-con', 'al-dir', 'vòl-đer', 'tal-fia-da', 'fe-nol-fta-lei-na', 'al-gua-ro',
			'in-dul-jen-tar', 'ner-val-ɉía', 'pal-ko', 'kal-mo', 'mal-nu-trío', 'al-pi', 'mal-rie-sío', 'mal-san', 'al-to', 'xmal-ŧar', 'mal-va',
			'bol-xèr', 'um-laut', 'am-ne-xía', 'mnè-xi', 'ŧir-kum-na-ve-gar', 'ŧir-kum-po-lar', 'ŧir-kum-ste-lar', 'fèm-to', 'ŧir-kum-ve-xu-vian',
			'kan-bio', 'min-con', 'mon-do', 'món-đar', 'on-fe-gar', 'ón-ga-ro', 'in-ja-rar', 'kon-ɉe-dar', 'bian-ko', 'in-lua-mar', 'in-ma-ne-gar',
			'in-pa-kar', 'in-pron-tar', 'man-ro-vèr-so', 'rien-sir', 'san-tan', 'sa-pien-ŧa', 'skon-ve-ñir', 'skon-xu-rar', 'pla-ka', 'reo-pla-no',
			'ap-nèa', 'pnèu-mo', 'pneu-mo-gra-fía', 'po-li-pnèa', 'or-to-pnèa', 'pro-va', 'in-pron-tar', 'psi-ko', 'a-sèp-si', 'po-li-psò-nio',
			'kàp-su-la', 'a-dèp-to', 'èr-ba', 'per-ce-pi-sio', 'pèr-dar', 'sko-vèr-đer', 'ser-fo-ja-ro', 'se-rur-go', 'xmar-ja-sa-da', 'sper-ɉu-rar',
			'spor-kar', 'stan-ger-lon', 'ster-mi-nar', 'stor-nar', 'gor-ñal', 'skar-pa', 'bi-tuar-se', 'a-bor-tir', 'or-to-è-pi-ko', 'ar-ŧon',
			'ser-vir', 'gar-xar', 'scò-na', 'mas-co', 'sfo-go', 'ska-la', 'ta-nas-ka', 're-is-krí-ver', 'spè-co', 'vès-pa', 'ves-tir', 'as-tro',
			'stó-me-go', 'stra-fan-to', 'sot-kòŧ', 'tmè-xi', 'al-go-rit-mo', 'èt-ni-ko', 'trà-pa-no', 'ar-to', 'ar-tri-te', 'ma-nò-vra',
			'xba-ke-tar', 'cix-bar', 'kax-dra-fo', 'xga-jo', 'xɉan-sar', 'xla-ka', 'bux-lar', 'e-goix-mo', 'max-na-da', 'xne-gar',
			'xña-kar', 'o-rex-ña-ŧa', 'xra-ɉo-nar', 'xvo-dar', 'kon-tro-e-xen-pio', 'kon-tro-in-di-kar', 'èks-tra', 'eks-tra-so-lar',
			'eks-tra-eu-ro-pèo', 'eks-tra-u-te-rin', 'eks-tra-os-pe-da-lièr', 'pa-ra-ban-ka-rio', 'pa-ra-e-ti-mo-lò-xe-go', 'pa-ra-ò-ci',
			'pa-ra-ur-ti', 'op-to-e-le-trò-ne-go', 'op-to-gra-fía', 'an-ti-lèr-xe-go', 'an-ti-a-tò-me-go', 'dis-pnèa', 'dis-pnòi-ko',
			'bio-lò-xe-go', 'bio-as-tro-nàu-ta', 'bio-e-lè-tre-go', 'bio-e-ner-xía', 'pre-a-lar-me', 'pre-e-xa-me',
			'viò-la', 'in-dian', 'piò-lo', 'len-gua', 'kues-to', 'xài-no', 'pia-xe', 'pien', 'die-tro', 'o-cài', 'ma-tè-ria', 'pin-guin',
			'eu-rò-pa', 'piu-ma', 'foi-ba',
			'ab-ne-ga-ŧion', 'àb-si-de', 'drak-ma', 'tèk-ni-ka', 'pnèu-mo', 'psi-ko-lo-xía', 'a-rit-mè-te-ga', 'et-nía', 'stra-ko', 'bas-ton',
			'maès-tro', 'poè-ta', 'pae-xe', 'bu-xía', 'siar', 'pau-ra', 'diur-no', 'sui-no', 'ka-xa', 'ju-tar', 'pàu-xa', 'pia-ŧa',
			'au-gu-ri', 'àu-gu-ri', 'grant', 'in-bri-jar', 'au-to-i-rò-ne-go', 'a-ŧion', 'sal-tar', 'lon-tan', 'fin-lan-dia', 'gron-da', 'in-ja-sar',
			'ser-pen-te', 'kos-pi-rar', 'kos-to', 'kos-trén-xer', 'des-pre-sar', 'bas-tan-ŧa', 'des-tri-kar', 'pes-kar', 'dex-men-te-gà',
			'ci-klix-mo', 'stra-ko', 'scan-ti-xo', 'sfe-xa', 'sta-bia', 'stran-bo', 'skò-po', 'xba-ro', 'xbri-gar', 'xbèr-la', 'sub-mon-ta-no',
			'tran-sub-stan-ŧiar', 'ab-ne-ga-sion', 'àb-si-de', 'tèk-ni-ka', 'iks', 'et-nía', 'ip-no-xi', 'biop-sía', 'rit-mo', 'a-rit-mè-te-ga',
			'poe-xía', 'gas', 'al-fa', 'skrí-ver',
			'pas-ta', 'par-te', 'ma-rio', 'à-kui-la', 'a-pro', 'du-pli-se', 'bas-tar', 'stò-ria',
			'kon-tro-a-ku-xa', 'kon-tro-e-xen-pio', 'kon-tro-in-di-kar', 'ŧir-kon-dar', 'i-per-a-ti-vo',
			'aus-pi-ka', 'au-to-ra', 'frau-da', 'lau-da', 'lau-rea', 'nau-fra-ga', 'nau-xea', 'pau-pe-ra', 'ins-tau-ra', 'res-tau-ra',
			'pio-la', 'sio-la', 'ŧio-la', 'vio-la', 'pe-rio-da',
			'gua', 'in-gua', 'frua', 'grua', 'sua', 'stra-sua',
			'ar-fia', 'e-fia', 'i-fia', 'nia', 'dex-nia', 'kria', 'pria', 'stria', 'sia', 'de-via', 'in-via', 'xvia',
			'dix-èr-ta', 'dex-e-re-dar',
			'sub-en-tro', 'sub-in-trar',
			'su-bé', 'su-bí', 'su-bíi-mo', 'su-bí-si-mo', 'su-bí-vi-mo', 'su-ben', 'su-ben-do', 'su-be-ne', 'su-ben-se', 'su-ben-te', 'su-bes-to',
			'su-bié', 'su-bia', 'su-bi-do', 'su-bon', 'su-bo-ne', 'su-bon-se',
			'su-bli-mà', 'su-bli-mo',
			'su-bio', 'su-bion', 'su-bi-sen', 'su-bi-sié', 'su-bi-ven', 'su-biè',
			'pos-da-tar', 'de-xi-ne'
		];

		words.forEach(function(word, idx){
			assert.equal(hyphenator.hyphenate(word).syllabes.join('-'), expected[idx]);
		});
	});

	QUnit.test('Hyphenator phonetic', function(assert){
		var hyphenator = new Hyphenator(pattern_vec_phonemic);
		var words = [
			//bc
			'subcelular',
			//bd
			'abdegar',
			//bđ
			//bf
			'subfornidura',
			//bg
			//bj
			//bɉ
			//bk
			'subkortegal',
			//bl
			'ablativo', 'blandir',
			//bm
			'submontan',
			//bn
			'subnormal',
			//bñ
			//bp
			'subpolar',
			//br
			'abraŧar', 'braŧo',
			//bs([fo]|[kt]r)
			'obsoleto', 'subsfèrego', 'subskríver', 'substrato',
			//bt[or]
			'subtotal', 'subtropegal',
			//bŧ
			//bv
			'subvéder',
			//bx

			//db
			//dc
			//dđ
			//df
			//dg
			//dj
			//dɉ
			//dk
			//dl
			//dm
			'kadmio',
			//dn
			'ekidna',
			//dñ
			//dp
			//dr
			'dreŧar', 'adria',
			//ds
			'feldspato',
			//dt
			//dŧ
			//dv
			'advokaŧion',
			//dx

			//fb
			//fc
			//fd
			//fđ
			//fg
			'afgan',
			//fj
			//fɉ
			//fk
			//fl
			'flúido', 'reflèso',
			//fm
			//fn
			'afnio',
			//fñ
			//fp
			//fr
			'fruto', 'xafran',
			//fs
			//ft
			'afta', 'ftàlego',
			//fŧ
			//fv
			//fx

			//gb
			//gc
			//gd
			'amígdala',
			//gđ
			//gf
			'stagflaŧion',
			//gj
			//gɉ
			//gk
			//gl
			'glòria', 'kúgluf',
			//gm
			'dògma',
			//gn
			//gñ
			//gp
			//gr
			'grado', 'negro', 'xgrénxer',
			//ngs(tr?)?
			'tungsteno', 'angstrom',
			//gt
			//gŧ
			//gv
			//gx

			//kb
			'ekbòlego',
			//kc
			//kd
			'ekdèmego',
			//kđ
			//kf
			//kg
			//kj
			//kɉ
			//kl
			'biŧikleta', 'klàsego',
			//km
			'drakma', 'kmèr',
			//kn
			'akne', 'knòso',
			//kñ
			//kp
			//kr
			'krea', 'sakro',
			//ks
			'fuksia',
			//kt
			'ektòpego',
			//kŧ
			//kv
			//kx

			//lb
			'àlbaro',
			//lc
			'alcon',
			//ld
			'aldir',
			//lđ
			'vòlđer',
			//lf
			'talfiada', 'fenolftaleina',
			//lg
			'alguaro',
			//lj
			'induljentar',
			//lɉ
			'nervalɉía',
			//lk
			'palko',
			//lm
			'kalmo',
			//ln
			'malnutrío',
			//lñ
			//lp
			'alpi',
			//lr
			'malriesío',
			//ls
			'malsan',
			//lt
			'alto',
			//lŧ
			'xmalŧar',
			//lv
			'malva',
			//lx
			'bolxèr',

			//mb
			//mc
			//md
			//mđ
			//mf
			//mg
			//mj
			//mɉ
			//mk
			//ml
			'umlaut',
			//mn
			'amnexía', 'mnèxi', 'ŧirkumnavegar',
			//mñ
			//mp
			'ŧirkumpolar',
			//mr
			//ms
			'ŧirkumstelar',
			//mt
			'fèmto',
			//mŧ
			//mv
			'ŧirkumvexuvian',
			//mx

			//nb
			'kanbio',
			//nc
			'mincon',
			//nd
			'mondo',
			//nđ
			'mónđar',
			//nf
			'onfegar',
			//ng
			'óngaro',
			//nj
			'injarar',
			//nɉ
			'konɉedar',
			//nk
			'bianko',
			//nl
			'inluamar',
			//nm
			'inmanegar',
			//nñ
			//np
			'inpakar', 'inprontar',
			//nr
			'manrovèrso',
			//ns
			'riensir',
			//nt
			'santan',
			//nŧ
			'sapienŧa',
			//nv
			'skonveñir',
			//nx
			'skonxurar',

			//pb
			//pc
			//pd
			//pđ
			//pf
			//pg
			//pj
			//pɉ
			//pk
			//pl
			'plaka', 'reoplano',
			//pm
			//pn
			'apnèa', 'pnèumo', 'pneumografía', 'polipnèa', 'ortopnèa',
			//pñ
			//pr
			'prova', 'inprontar',
			//ps
			'psiko', 'asèpsi', 'polipsònio', 'kàpsula',
			//pt
			'adèpto',
			//pŧ
			//pv
			//px

			//rb
			'èrba',
			//rc
			'percepisio',
			//rd
			'pèrdar',
			//rđ
			'skovèrđer',
			//rf
			'serfojaro',
			//rg
			'serurgo',
			//rj
			'xmarjasada',
			//rɉ
			'sperɉurar',
			//rk
			'sporkar',
			//rl
			'stangerlon',
			//rm
			'sterminar',
			//rn
			'stornar',
			//rñ
			'gorñal',
			//rp
			'skarpa',
			//rs
			'bituarse',
			//rt
			'abortir', 'ortoèpiko',
			//rŧ
			'arŧon',
			//rv
			'servir',
			//rx
			'garxar',

			//sc
			'scòna', 'masco',
			//sf
			'sfogo',
			//sk
			'skala', 'tanaska', 'reiskríver',
			//sp
			'spèco', 'vèspa',
			//st
			'vestir', 'astro', 'stómego', 'strafanto',
			//sŧ
			//sx

			//tb
			//tc
			//td
			//tđ
			//tf
			//tg
			//tj
			//tɉ
			//tk
			'sotkòŧ',
			//tl
			//tm
			'tmèxi', 'algoritmo',
			//tn
			'ètniko',
			//tñ
			//tp
			//tr
			'tràpano', 'arto', 'artrite',
			//ts
			//tŧ
			//tv
			//tx

			//vb
			//vc
			//vd
			//vđ
			//vf
			//vg
			//vj
			//vɉ
			//vk
			//vl
			//vm
			//vn
			//vñ
			//vp
			//vr
			'manòvra',
			//vs
			//vt
			//vŧ
			//vx

			//xb
			'xbaketar', 'cixbar',
			//xc
			//xd
			'kaxdrafo',
			//xđ
			//xf
			//xg
			'xgajo',
			//xj
			//xɉ
			'xɉansar',
			//xk
			//xl
			'xlaka', 'buxlar',
			//xm
			'egoixmo',
			//xn
			'maxnada', 'xnegar',
			//xñ
			'xñakar', 'orexñaŧa',
			//xp
			//xr
			'xraɉonar',
			//xs
			//xt
			//xŧ
			//xv
			'xvodar',

			//kontro
			'kontroexenpio', 'kontroindikar',
			//èkstra
			'èkstra', 'ekstrasolar', 'ekstraeuropèo', 'ekstrauterin', 'ekstraospedalièr',
			//para
			'parabankario', 'paraetimolòxego', 'paraòci', 'paraurti',
			//òpto
			'optoeletrònego', 'optografía',
			//anti
			'antilèrxego', 'antiatòmego',
			//pne
			'dispnèa', 'dispnòiko',
			//bio
			'biolòxego', 'bioastronàuta', 'bioelètrego', 'bioenerxía',
			//pre
			'prealarme', 'preexame',
			//diphtongs
			'viòla', 'indian', 'piòlo', 'lengua', 'kuesto', 'xàino', 'piaxe', 'pien', 'dietro', 'ocài', 'matèria', 'pinguin', 'euròpa', 'piuma',
			'foiba',
			//others
			'abnegaŧion', 'àbside', 'drakma', 'tèknika', 'pnèumo', 'psikoloxía', 'aritmètega', 'etnía', 'strako', 'baston', 'maèstro', 'poèta',
			'paexe', 'buxía', 'siar', 'paura', 'diurno', 'suino', 'kaxa', 'jutar', 'pàuxa', 'piaŧa', 'auguri', 'àuguri', 'grant', 'inbrijar',
			'autoirònego', 'aŧion', 'saltar', 'lontan', 'finlandia', 'gronda', 'injasar', 'serpente', 'kospirar', 'kosto', 'kostrénxer', 'despresar',
			'bastanŧa', 'destrikar', 'peskar', 'dexmentegà', 'ciklixmo', 'strako', 'scantixo', 'sfexa', 'stabia', 'stranbo', 'skòpo',
			'xbaro', 'xbrigar', 'xbèrla', 'submontano', 'transubstanŧiar', 'abnegasion', 'àbside', 'tèknika', 'iks', 'etnía', 'ipnoxi', 'biopsía',
			'ritmo', 'aritmètega', 'poexía', 'gas', 'alfa', 'skríver',
			'pasta', 'parte', 'mario', 'àkuila', 'apro', 'duplise', 'bastar', 'stòria',
			'kontroakuxa', 'kontroexenpio', 'kontroindikar', 'ŧirkondar', 'iperativo',
			//jati
			'auspika', 'autora', 'frauda', 'lauda', 'laurea', 'naufraga', 'nauxea', 'paupera', 'instaura', 'restaura',
			'piola', 'siola', 'ŧiola', 'viola', 'perioda',
			'gua', 'ingua', 'frua', 'grua', 'sua', 'strasua',
			'arfia', 'efia', 'ifia', 'nia', 'dexnia', 'kria', 'pria', 'stria', 'sia', 'devia', 'invia', 'xvia',
			'dixèrta', 'dexeredar',
			'subentro', 'subintrar',
			'subé', 'subí', 'subíimo', 'subísimo', 'subívimo', 'suben', 'subendo', 'subene', 'subense', 'subente', 'subesto', 'subié', 'subia', 'subido',
			'subon', 'subone', 'subonse',
			'sublimà', 'sublimo',
			'subion', 'subisen', 'subisié', 'subiven', 'subiè',
			'posdatar', 'dexine'
		];
		var expected = [
			'sub-ce-lu-lar', 'ab-de-gar', 'sub-for-ni-du-ra', 'sub-kor-te-gal', 'a-bla-ti-vo', 'blan-dir', 'sub-mon-tan', 'sub-nor-mal',
			'sub-po-lar', 'a-bra-ŧar', 'bra-ŧo', 'ob-so-le-to', 'sub-sfè-re-go', 'sub-skrí-ver', 'sub-stra-to', 'sub-to-tal', 'sub-tro-pe-gal',
			'sub-vé-der', 'kad-mio', 'e-kid-na', 'dre-ŧar', 'a-dria', 'feld-spa-to', 'ad-vo-ka-ŧion', 'af-gan', 'flú-i-do', 're-flè-so', 'af-nio',
			'fru-to', 'xa-fran', 'af-ta', 'ftà-le-go', 'a-míg-da-la', 'stag-fla-ŧion', 'glò-ria', 'kú-gluf', 'dòg-ma', 'gra-do', 'ne-gro',
			'xgrén-xer', 'tung-ste-no', 'ang-strom', 'ek-bò-le-go', 'ek-dè-me-go', 'bi-ŧi-kle-ta', 'klà-se-go', 'drak-ma', 'kmèr', 'ak-ne', 'knò-so',
			'kre-a', 'sa-kro', 'fuk-sia', 'ek-tò-pe-go', 'àl-ba-ro', 'al-con', 'al-dir', 'vòl-đer', 'tal-fia-da', 'fe-nol-fta-le-i-na', 'al-gua-ro',
			'in-dul-jen-tar', 'ner-val-ɉí-a', 'pal-ko', 'kal-mo', 'mal-nu-trí-o', 'al-pi', 'mal-rie-sí-o', 'mal-san', 'al-to', 'xmal-ŧar', 'mal-va',
			'bol-xèr', 'um-la-ut', 'am-ne-xí-a', 'mnè-xi', 'ŧir-kum-na-ve-gar', 'ŧir-kum-po-lar', 'ŧir-kum-ste-lar', 'fèm-to', 'ŧir-kum-ve-xu-vian',
			'kan-bio', 'min-con', 'mon-do', 'món-đar', 'on-fe-gar', 'ón-ga-ro', 'in-ja-rar', 'kon-ɉe-dar', 'bian-ko', 'in-lua-mar', 'in-ma-ne-gar',
			'in-pa-kar', 'in-pron-tar', 'man-ro-vèr-so', 'rien-sir', 'san-tan', 'sa-pien-ŧa', 'skon-ve-ñir', 'skon-xu-rar', 'pla-ka', 're-o-pla-no',
			'ap-nè-a', 'pnèu-mo', 'pneu-mo-gra-fí-a', 'po-li-pnè-a', 'or-to-pnè-a', 'pro-va', 'in-pron-tar', 'psi-ko', 'a-sèp-si', 'po-li-psò-nio',
			'kàp-su-la', 'a-dèp-to', 'èr-ba', 'per-ce-pi-sio', 'pèr-dar', 'sko-vèr-đer', 'ser-fo-ja-ro', 'se-rur-go', 'xmar-ja-sa-da', 'sper-ɉu-rar',
			'spor-kar', 'stan-ger-lon', 'ster-mi-nar', 'stor-nar', 'gor-ñal', 'skar-pa', 'bi-tuar-se', 'a-bor-tir', 'or-to-è-pi-ko', 'ar-ŧon',
			'ser-vir', 'gar-xar', 'scò-na', 'ma-sco', 'sfo-go', 'ska-la', 'ta-na-ska', 're-i-skrí-ver', 'spè-co', 'vè-spa', 've-stir', 'a-stro',
			'stó-me-go', 'stra-fan-to', 'sot-kòŧ', 'tmè-xi', 'al-go-rit-mo', 'èt-ni-ko', 'trà-pa-no', 'ar-to', 'ar-tri-te', 'ma-nò-vra',
			'xba-ke-tar', 'ci-xbar', 'ka-xdra-fo', 'xga-jo', 'xɉan-sar', 'xla-ka', 'bu-xlar', 'e-go-i-xmo', 'ma-xna-da', 'xne-gar',
			'xña-kar', 'o-re-xña-ŧa', 'xra-ɉo-nar', 'xvo-dar', 'kon-tro-e-xen-pio', 'kon-tro-in-di-kar', 'èk-stra', 'ek-stra-so-lar',
			'ek-stra-eu-ro-pè-o', 'ek-stra-u-te-rin', 'ek-stra-o-spe-da-lièr', 'pa-ra-ban-ka-rio', 'pa-ra-e-ti-mo-lò-xe-go', 'pa-ra-ò-ci',
			'pa-ra-ur-ti', 'op-to-e-le-trò-ne-go', 'op-to-gra-fí-a', 'an-ti-lèr-xe-go', 'an-ti-a-tò-me-go', 'dis-pnè-a', 'dis-pnòi-ko',
			'bio-lò-xe-go', 'bio-a-stro-nàu-ta', 'bio-e-lè-tre-go', 'bio-e-ner-xí-a', 'pre-a-lar-me', 'pre-e-xa-me',
			'viò-la', 'in-dian', 'piò-lo', 'len-gua', 'kue-sto', 'xài-no', 'pia-xe', 'pien', 'die-tro', 'o-cài', 'ma-tè-ria', 'pin-guin',
			'eu-rò-pa', 'piu-ma', 'fo-i-ba',
			'ab-ne-ga-ŧion', 'àb-si-de', 'drak-ma', 'tèk-ni-ka', 'pnèu-mo', 'psi-ko-lo-xí-a', 'a-rit-mè-te-ga', 'et-ní-a', 'stra-ko', 'ba-ston',
			'ma-è-stro', 'po-è-ta', 'pa-e-xe', 'bu-xí-a', 'siar', 'pa-u-ra', 'diur-no', 'sui-no', 'ka-xa', 'ju-tar', 'pàu-xa', 'pia-ŧa',
			'au-gu-ri', 'àu-gu-ri', 'grant', 'in-bri-jar', 'au-to-i-rò-ne-go', 'a-ŧion', 'sal-tar', 'lon-tan', 'fin-lan-dia', 'gron-da', 'in-ja-sar',
			'ser-pen-te', 'ko-spi-rar', 'ko-sto', 'ko-strén-xer', 'des-pre-sar', 'ba-stan-ŧa', 'des-tri-kar', 'pe-skar', 'dex-men-te-gà',
			'ci-kli-xmo', 'stra-ko', 'scan-ti-xo', 'sfe-xa', 'sta-bia', 'stran-bo', 'skò-po', 'xba-ro', 'xbri-gar', 'xbèr-la', 'sub-mon-ta-no',
			'tran-sub-stan-ŧiar', 'ab-ne-ga-sion', 'àb-si-de', 'tèk-ni-ka', 'iks', 'et-ní-a', 'ip-no-xi', 'biop-sí-a', 'rit-mo', 'a-rit-mè-te-ga',
			'po-e-xí-a', 'gas', 'al-fa', 'skrí-ver',
			'pa-sta', 'par-te', 'ma-rio', 'à-kui-la', 'a-pro', 'du-pli-se', 'ba-star', 'stò-ria',
			'kon-tro-a-ku-xa', 'kon-tro-e-xen-pio', 'kon-tro-in-di-kar', 'ŧir-kon-dar', 'i-per-a-ti-vo',
			'au-spi-ka', 'au-to-ra', 'frau-da', 'lau-da', 'lau-re-a', 'nau-fra-ga', 'nau-xe-a', 'pau-pe-ra', 'in-stau-ra', 're-stau-ra',
			'pio-la', 'sio-la', 'ŧio-la', 'vio-la', 'pe-rio-da',
			'gua', 'in-gua', 'frua', 'grua', 'sua', 'stra-sua',
			'ar-fia', 'e-fia', 'i-fia', 'nia', 'de-xnia', 'kria', 'pria', 'stria', 'sia', 'de-via', 'in-via', 'xvia',
			'dix-èr-ta', 'dex-e-re-dar',
			'su-ben-tro', 'su-bin-trar',
			'su-bé', 'su-bí', 'su-bí-i-mo', 'su-bí-si-mo', 'su-bí-vi-mo', 'su-ben', 'su-ben-do', 'su-be-ne', 'su-ben-se', 'su-ben-te', 'su-be-sto',
			'su-bié', 'su-bia', 'su-bi-do', 'su-bon', 'su-bo-ne', 'su-bon-se',
			'su-bli-mà', 'su-bli-mo',
			'su-bion', 'su-bi-sen', 'su-bi-sié', 'su-bi-ven', 'su-biè',
			'po-sda-tar', 'de-xi-ne'
		];

		words.forEach(function(word, idx){
			assert.equal(hyphenator.hyphenate(word).syllabes.join('-'), expected[idx]);
		});
	});

});
