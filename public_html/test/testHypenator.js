require(['tools/lang/phonology/Hypenator'], function(Hypenator){
	QUnit.module('Hypenator');

	QUnit.test('Hypenator', function(assert){
		var patterns = {
			//aàbcdđeéèfghiíjɉklƚmnñoóòprstŧuúvx
			2: '1b1c1d1đ1f1g1j1ɉ1k1l1ƚ1m1n1ñ1p1r1s1t1ŧ1v1x',
			3: '.c2.d2.đ2.k2.m2.s2.ŧ2.x2'
				+ '2b.2bc2bd2bđ2bf2bg2bj2cɉ2bk2bl2bm2bn2bñ2bp2br2bs2bt2bŧ2bv2bx'
				+ '2c.2cb2cd2cđ2cf2cg2cj2cɉ2ck2cl2cm2cn2cñ2cp2cr2cs2ct2cŧ2cv2cx'
				+ '2d.2db2dc2dđ2df2dg2dj2dɉ2dk2dl2dm2dn2dñ2dp2dr2ds2dt2dŧ2dv2dx'
				+ '2đ.2đb2đc2đd2đf2đg2đj2đɉ2đk2đl2đm2đn2đñ2đp2đr2đs2đt2đŧ2đv2đx'
				+ '2f.2fb2fc2fd2fđ2fg2fj2fɉ2fk2fl2fm2fn2fñ2fp2fr2fs2ft2fŧ2fv2fx'
				+ '2g.2gb2gc2gd2gđ2gf2gj2gɉ2gk2gl2gm2gn2gñ2gp2gr2gs2gt2gŧ2gv2gx'
				+ '2j.2jb2jc2jd2jđ2jf2jg2jɉ2jk2jl2jm2jn2jñ2jp2jr2js2jt2jŧ2jv2jx'
				+ '2ɉ.2ɉb2ɉc2ɉd2ɉđ2ɉf2ɉg2ɉj2ɉk2ɉl2ɉm2ɉn2ɉñ2ɉp2ɉr2ɉs2ɉt2ɉŧ2ɉv2ɉx'
				+ '2k.2kb2kc2kd2kđ2kf2kg2kj2kɉ2kl2km2kn2kñ2kp2kr2ks2kt2kŧ2kv2kx'
				+ '2l.2lb2lc2ld2lđ2lf2lg2lj2lɉ2lk2lm2ln2lñ2lp2lr2ls2lt2lŧ2lv2lx'
				+ '2m.2mb2mc2md2mđ2mf2mg2mj2mɉ2mk2ml2mn2mñ2mp2mr2ms2mt2mŧ2mv2mx'
				+ '2n.2nb2nc2nd2nđ2nf2ng2nj2nɉ2nk2nl2nm2nñ2np2nr2ns2nt2nŧ2nv2nx'
				+ '2ñ.2ñb2ñc2ñd2ñđ2ñf2ñg2ñj2ñɉ2ñk2ñl2ñm2ñn2ñp2ñr2ñs2ñt2ñŧ2ñv2ñx'
				+ '2p.2pb2pc2pd2pđ2pf2pg2pj2pɉ2pk2pl2pm2pn2pñ2pr2ps2pt2pŧ2pv2px'
				+ '2r.2rb2rc2rd2rđ2rf2rg2rj2rɉ2rk2rl2rm2rn2rñ2rp2rs2rt2rŧ2rv2rx'
				+ '2s.' //+ '2sc2sf2sk2sp2st2sŧ2sx'
				+ 's2cs2fs2ks2ps2t'
				+ '2t.2tb2tc2td2tđ2tf2tg2tj2tɉ2tk2tl2tm2tn2tñ2tp2tr2ts2tŧ2tv2tx'
				+ '2ŧ.2ŧb2ŧc2ŧd2ŧđ2ŧf2ŧg2ŧj2ŧɉ2ŧk2ŧl2ŧm2ŧn2ŧñ2ŧp2ŧr2ŧs2ŧt2ŧv2ŧx'
				+ '2v.2vb2vc2vd2vđ2vf2vg2vj2vɉ2vk2vl2vm2vn2vñ2vp2vr2vs2vt2vŧ2vx'
				+ '2x.' //+ '2xb2xd2xđ2xg2xj2xɉ2xl2xm2xn2xñ2xr2xs2xv'
				+ 'x2mx2nx2ñx2bx2dx2gx2jx2ɉx2sx2vx2rx2l'
				+ 'b2lb2r'
				+ 'c2lc2r'
				+ 'd2ld2r'
				+ 'f2lf2r'
				+ 'g2lg2r'
				+ 'j2lj2r'
				+ 'ɉ2lɉ2r'
				+ 'k2lk2r'
				+ 'p2lp2r'
				+ 't2lt2r'
				+ 'v2lv2r'
				//hyatus
				+ 'a1ae1ao1aà1aè1aé1aò1aó1a'
				+ 'a1ee1eo1eà1eè1eé1eò1eó1e'
				+ 'a1oe1oo1oà1oè1oé1oò1oó1o'
				//hyatus
				+ 'í1aí1eí1ií1oí1u'
				+ 'ú1aú1eú1iú1oú1u'
				//hyatus
				+ 'a1àa1èa1éa1ía1òa1óa1ú'
				+ 'e1àe1èe1ée1íe1òe1óe1ú'
				+ 'o1ào1èo1éo1ío1òo1óo1ú'
				,
			4: '.f2t.p2n.p2s.t2msub3',
			5: '.bio1.pre12l3f2t',
			6: '.para1.poli1.opto1.anti1.orto3.poli3.re1is.di2s3.de2s3.di2x3.auto1',
			7: 'kontro1èkstra1ekstra1ŧirkum3',
			9: '.poli1p2n.poli1p2s.orto3p2n.di2s3p2n.de2s3p2n'
		};
		var hyp = new Hypenator(patterns, {leftmin: 1, hyphen: '-'});
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
			'grado', 'negro',
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
			'drakma',
			//kn
			'akne',
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
			'inpakar', 'inprontar', 'lanpar',
			//nr
			'manrovèrso',
			//ns
			'riensir', 'stransir',
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
			'apnèa', 'pnèumo', 'pneumografía', 'polipnèa', 'ortopnèa', 'ortopnòika',
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
			'abnegaŧion', 'àbside', 'drakma', 'tèknika', 'tungstèno', 'pnèumo', 'psikoloxía', 'aritmètega', 'etnía', 'strako', 'baston', 'maèstro',
			'poèta', 'paexe', 'mie', 'buxía', 'siar', 'paura', 'diurno', 'suino',
			'kaxa', 'jutar', 'pàuxa', 'piaŧa', 'auguri', 'àuguri', 'grant', 'inbrijar', 'autoirònego', 'aŧion', 'saltar', 'lontan', 'finlandia',
			'gronda', 'injasar', 'serpente', 'kospirar', 'kosto', 'kostrénxer', 'despresar', 'bastanŧa', 'destrikar', 'peskar', 'maèstra',
			'dexmentegà', 'ciklixmo', 'strako', 'scantixo', 'sfexa', 'stabia', 'stranbo', 'skòpo', 'xbaro', 'xbrigar', 'xbèrla', 'submontano',
			'transubstanŧiar', 'abnegasion', 'àbside', 'tèknika', 'iks', 'etnía', 'ipnoxi', 'biopsía', 'ritmo', 'aritmètega', 'tungstèno', 'poexía',
			'gas', 'alfa'
		];
		var expected = [
			'sub-ce-lu-lar', 'ab-de-gar', 'sub-for-ni-du-ra', 'sub-kor-te-gal', 'a-bla-ti-vo', 'blan-dir', 'sub-mon-tan', 'sub-nor-mal', 'sub-po-lar',
			'a-bra-ŧar', 'bra-ŧo', 'ob-so-le-to', 'sub-sfè-re-go', 'sub-skrí-ver', 'sub-stra-to', 'sub-to-tal', 'sub-tro-pe-gal', 'sub-vé-der',
			'kad-mio', 'e-kid-na', 'dre-ŧar', 'a-dria', 'feld-spa-to', 'ad-vo-ka-ŧion', 'af-gan', 'flú-i-do', 're-flè-so', 'af-nio', 'fru-to',
			'xa-fran', 'af-ta', 'ftà-le-go', 'a-míg-da-la', 'stag-fla-ŧion', 'glò-ria', 'kú-gluf', 'dòg-ma', 'gra-do', 'ne-gro', 'tung-ste-no',
			'ang-strom', 'ek-bò-le-go', 'ek-dè-me-go', 'bi-ŧi-kle-ta', 'klà-se-go', 'drak-ma', 'ak-ne', 'kré-a', 'sa-kro', 'fuk-sia', 'ek-tò-pe-go',
			'àl-ba-ro', 'al-con', 'al-dir', 'vòl-đer', 'tal-fia-da', 'fe-nol-fta-le-i-na', 'al-gua-ro', 'in-dul-jen-tar', 'ner-val-ɉí-a', 'pal-ko',
			'kal-mo', 'mal-nu-trí-o', 'al-pi', 'mal-rie-sí-o', 'mal-san', 'al-to', 'xmal-ŧar', 'mal-va', 'bol-xèr', 'um-la-ut', 'am-ne-xí-a',
			'mnè-xi', 'ŧir-kum-na-ve-gar', 'ŧir-kum-po-lar', 'ŧir-kum-ste-lar', 'fèm-to', 'ŧir-kum-ve-xu-vian', 'kan-bio', 'min-con', 'mon-do',
			'món-đar', 'on-fe-gar', 'ón-ga-ro', 'kon-ɉe-dar', 'bian-ko', 'in-lua-mar', 'in-ma-ne-gar', 'in-pa-kar', 'in-pron-tar', 'lan-par',
			'man-ro-vèr-so', 'rien-sir', 'stran-sir', 'san-tan', 'sa-pien-ŧa', 'skon-ve-ñir', 'skon-xu-rar', 'pla-ka', 're-o-pla-no', 'ap-nè-a',
			'pnèu-mo', 'pneu-mo-gra-fí-a', 'po-li-pnè-a', 'or-to-pnè-a', 'or-to-pnòi-ka', 'pro-va', 'in-pron-tar', 'psi-ko', 'a-sèp-si',
			'po-li-psò-nio', 'kàp-su-la', 'a-dèp-to', 'èr-ba', 'per-ce-pi-sio', 'pèr-dar', 'sko-vèr-đer', 'ser-fo-ja-ro', 'se-rur-go', 'xmar-ja-sa-da',
			'sper-ɉu-rar', 'spor-kar', 'stan-ger-lon', 'ster-mi-nar', 'stor-nar', 'gor-ñal', 'skar-pa', 'bi-tuar-se', 'a-bor-tir', 'or-to-è-pi-ko',
			'ar-ŧon', 'ser-vir', 'gar-xar', 'scò-na', 'ma-sco', 'sfo-go', 'ska-la', 'ta-na-ska', 're-i-skrí-ver', 'spè-co', 'vè-spa', 've-stir',
			'a-stro', 'stó-me-go', 'stra-fan-to', 'sot-kòŧ', 'tmè-xi', 'al-go-rit-mo', 'èt-ni-ko', 'trà-pa-no', 'ar-to', 'ar-tri-te', 'ma-nò-vra',
			'xba-ke-tar', 'ci-xbar', 'ka-xdra-fo', 'xga-jo', 'xɉan-sar', 'xla-ka', 'bu-xlar', 'e-go-i-xmo', 'ma-xna-da', 'xne-gar', 'xña-kar',
			'o-re-xña-ŧa', 'xra-ɉo-nar', 'xvo-dar', 'kon-tro-e-xen-pio', 'kon-tro-in-di-kar', 'èk-stra', 'ek-stra-so-lar', 'ek-stra-eu-ro-pè-o',
			'ek-stra-u-te-rin', 'ek-stra-o-spe-da-lièr', 'pa-ra-ban-ka-rio', 'pa-ra-e-ti-mo-lò-xe-go', 'pa-ra-ò-ci', 'pa-ra-ur-ti',
			'op-to-e-le-trò-ne-go', 'op-to-gra-fí-a', 'an-ti-lèr-xe-go', 'an-ti-a-tò-me-go', 'dis-pnè-a', 'dis-pnòi-ko', 'bio-lò-xe-go',
			'bio-a-stro-nàu-ta', 'bio-e-lè-tre-go', 'bio-e-ner-xí-a', 'pre-a-lar-me', 'pre-e-xa-me',
			'viò-la', 'in-dian', 'piò-lo', 'len-gua', 'kue-sto', 'xài-no', 'pia-xe', 'pien', 'die-tro', 'o-cài', 'ma-tè-ria', 'pin-guin',
			'eu-rò-pa', 'piu-ma', 'fo-i-ba',
			'ab-ne-ga-ŧion', 'àb-si-de', 'drak-ma', 'tèk-ni-ka', 'tung-stè-no', 'pnèu-mo', 'psi-ko-lo-xí-a', 'a-rit-mè-te-ga', 'et-ní-a', 'stra-ko',
			'ba-ston', 'ma-è-stro', 'po-è-ta', 'pa-e-xe', 'mí-e', 'bu-xí-a', 'siar', 'pa-u-ra', 'diur-no', 'sui-no',
			'ka-xa', 'ju-tar', 'pàu-xa', 'pia-ŧa', 'au-gu-ri', 'àu-gu-ri', 'grant', 'in-bri-jar', 'au-to-i-rò-ne-go', 'a-ŧion', 'sal-tar', 'lon-tan',
			'fin-lan-dia', 'gron-da', 'in-ja-sar', 'ser-pen-te', 'ko-spi-rar', 'ko-sto', 'ko-strén-xer', 'des-pre-sar', 'ba-stan-ŧa', 'des-tri-kar',
			'pe-skar', 'ma-è-stra', 'de-xmen-te-gà', 'ci-kli-xmo', 'stra-ko', 'scan-ti-xo', 'sfe-xa', 'sta-bia', 'stran-bo', 'skò-po', 'xba-ro',
			'xbri-gar', 'xbèr-la', 'sub-mon-ta-no', 'tran-sub-stan-ŧiar', 'ab-ne-ga-sion', 'àb-si-de', 'tèk-ni-ka', 'iks', 'et-ní-a', 'ip-no-xi',
			'biop-sí-a', 'rit-mo', 'a-rit-mè-te-ga', 'tung-stè-no', 'po-e-xí-a', 'gas', 'al-fa'
		];

		words.forEach(function(word, idx){
			assert.equal(hyp.hypenate(word), expected[idx]);
		});
	});
});
