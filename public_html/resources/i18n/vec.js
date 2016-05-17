define({

	language: 'vec',

	dialect: {
		none: 'đeneral',
		northern_group: 'Feltrin-belumat',
		northern: {
			feltrinBelumat: 'feltrin, belumat',
			'cipileño': 'cipileño',
			altaTrevixana: 'alta trevixana (vitoriexe, konejanexe)',
			'ŧitadin': 'ŧitadin'
		},
		oriental_group: 'Liventin',
		oriental: {
			sandonatexe: 'trevixan de ŧanka Piave (opiterxin, sandonatexe, fosaltin)'
		},
		centralNorthern_group: 'Trevixan',
		centralNorthern: {
			trevixan: 'trevixan de dreta Piave',
			kastelan: 'kastelan'
		},
		lagunar_group: 'Lagunar',
		lagunar: {
			'veneŧian': 'veneŧian',
			mestrin: 'mestrin',
			'coxòto': 'coxòto'
		},
		central_group: 'Padoan-viŧentin-polexan',
		central: {
			padoan: 'padoan',
			'viŧentin': 'viŧentin',
			'valsuganòto': 'valsuganòto',
			basoTrentin: 'baso trentin',
			polexan: 'polexan',
			'roigòto': 'roigòto'
			//talian: 'talian'
		},
		western_group: 'Veronexe',
		western: {
			altaVeronexe: 'alta veronexe',
			basaVeronexe: 'basa veronexe',
			'ŧitadin': 'ŧitadin'
		}
	},

	variant: {
		liventin: 'liventin',
		'feltrin-belumat': 'feltrin-belumat',
		feltrin: 'feltrin',
		belumat: 'belumat',
		seguxinexe: 'seguxinexe',
		'cipile&ntilde;o': 'cipile&ntilde;o',
		'feltrin-belumat de &tstrok;it&agrave;, fosaltin, alto trevixan (vitoriexe, konejanexe)': 'feltrin-belumat de &tstrok;it&agrave;, fosaltin, alto trevixan (vitoriexe, konejanexe)',
		'montebelunexe, axolan': 'montebelunexe, axolan',
		kornudexe: 'kornudexe',
		trevixan: 'trevixan',
		kastelan: 'kastelan',
		lagunar: 'lagunar',
		'cox&ograve;to': 'cox&ograve;to',
		mestrin: 'mestrin',
		'buran&egrave;l': 'buran&egrave;l',
		padoan: 'padoan',
		'baso padoan': 'baso padoan',
		'vi&tstrok;entin': 'vi&tstrok;entin',
		'baso vi&tstrok;entin': 'baso vi&tstrok;entin',
		polexan: 'polexan',
		talian: 'talian',
		veronexe: 'veronexe',
		'alto veronexe': 'alto veronexe',
		'baso veronexe': 'baso veronexe',

		sentence: 'La fraxe',
		is: '&eacute;la',
		truthy: 'vera',
		falsy: 'falsa',
		lessThan: 'manko de',
		yes: 'S&iacute;',
		no: 'N&ograve;',
		tryBefore: 'La t&oacute; variante &#8216;l &eacute;',
		tryAfter: '&eacute;la vera?',
		dontKnow: 'No savar&iacute;a',
		ok: 'V&agrave; ben',
		unable: 'No son bon ve&ntilde;&eacute;rgene fora, ke variante &agrave;tu?<br>Kuala &eacute;la la s&oacute; partikolarit&agrave;?<br>K&oacute;ntame un fi&agrave; skriv&eacute;ndome!',

		attributes: [
			'el &tstrok;onka le koe <i>e, o</i> no a&tstrok;ent&agrave;e drio <i>n</i>, ma solke se no le f&agrave; parte de la dexinen&tstrok;a de &#8216;l plural (<i>kan</i>, <i>tr&egrave;n</i>, <i>paron</i>); pi da spes se no le f&agrave; parte de un scapo de konsonanti (<i>xorno</i>), e par par&ograve;le piane de pi de do s&iacute;labe.',
			'el &tstrok;onka le koe <i>e, o</i> no a&tstrok;ent&agrave;e drio <i>r, l</i>, ma solke se no le f&agrave; parte de la dexinen&tstrok;a de &#8216;l plural (<i>f&egrave;r</i>, <i>saver</i>, <i>frad&egrave;l</i>, <i>kanpanil</i>, <i>par&ograve;l</i>, <i>fax(i)&ograve;l</i>); pi da spes se no le f&agrave; parte de un scapo de konsonanti (<i>mare < MĀTREM</i>), e par par&ograve;le piane de pi de do s&iacute;labe (anka xl&iacute;sege se i &eacute; infen&iacute;i).',
			'el &tstrok;onka le koe <i>e, o</i> no a&tstrok;ent&agrave;e drio <i>k, p, s, t, &tstrok;</i>, ma solke se no le f&agrave; parte de la dexinen&tstrok;a de &#8216;l plural (<i>gat</i>, <i>sas</i>, <i>tenp</i>, <i>bra&tstrok;</i>, <i>savest</i>); in &dstrok;eneral par par&ograve;le piane de pi de do s&iacute;labe.',
			'el &tstrok;onka le koe <i>e, o</i> no a&tstrok;ent&agrave;e in &dstrok;eneral drio le konsonanti son&ograve;re e <i>f, &tstrok;</i> (<i>gat</i>, <i>sas</i>, <i>kaval</i>, <i>burlak</i>, <i>tenp</i>, <i>bra&tstrok;</i>, <i>bixef</i>, <i>pom</i>); in &dstrok;eneral par par&ograve;le piane de pi de do s&iacute;labe.',
			'ge n&#8217; &eacute; desfanto de l&#8217; intert&ograve;nega vanti <span class="phone">/r/</span> ko ep&egrave;ntexi de <span class="phone">/d/</span> (<i>V&eacute;ner</i> > <i>V&eacute;ndre</i>, <i>&tstrok;&eacute;ner</i> > <i>&tstrok;&eacute;ndre</i>, <i>t&eacute;nero</i> > <i>t&eacute;ndro</i>).',
			'la vokal de repr&iacute;stino desp&ograve; &#8216;ver &#8216;v&uacute;o un &tstrok;onkamento la &eacute; <i>e</i> (<i>kuande</i> par <i>kuando</i>).',
			'la vokal de repr&iacute;stino desp&ograve; &#8216;ver &#8216;v&uacute;o un &tstrok;onkamento la &eacute; <i>o</i> (<i>karno</i> par <i>karne</i>).',
			'ge n&#8217; &eacute; la forma <i>al</i> al posto de &#8216;l art&iacute;kolo e de &#8216;l pron&ograve;me <i>el</i> (<i>al kanta</i>, <i>al bosk</i>).',
			'el d&ograve;pera la dexinen&tstrok;a in <i>-st-</i> intel parti&tstrok;ipio pasivo (<i>ve&ntilde;esto</i>).',
			'le <span class="phone">/d, g, ð, x/</span> in koa de parola le pol insordirse in <span class="phone">/t, k, θ, s/</span> (bel.: <i>grando</i> > <i>grant</i>, <i>te ved</i> > <i>te vet</i>, <i>kruda</i> > <i>krut</i>, <i>fredo</i> > <i>fret</i>, <i>largo</i> > <i>lark</i>, <i>fongo</i> > <i>fonk</i>, <i>fogo</i> > <i>fok</i>, <i>&dstrok;ogo</i> > <i>&dstrok;ok</i>, <i>te per&dstrok;</i> > <i>te per&tstrok;</i>, <i>deskuer&dstrok;er</i> > <i>deskuer&tstrok;</i>, <i>dixe</i> > <i>dis</i>, <i>moroxo</i> > <i>moros</i>',
			'in koa de par&ograve;la, ge n&#8217; &eacute; kaxi de trasforma&tstrok;ion <span class="phone">/v/</span> > <span class="phone">/f/</span> (<i>gualivo</i> > <i>gualif/valif</i>, <i>kort&iacute;(v)o</i> > <i>kortif</i>, <i>neve</i> > <i>n&eacute;f</i>, <i>b&ograve;</i> > <i>b&ograve;f</i> (deriv&agrave; da na forma <i>&#8216;b&ograve;vo&#8217;</i>), <i>l&ograve;(v)o</i> > <i>l&ograve;f</i>, <i>ava</i> > <i>af</i>, <i>la Piave</i> > <i>la Plaf</i>), <span class="phone">/v/</span> > <span class="phone">/w/</span> (<i>viva</i> > <i>vi&uacute;</i>, <i>ava</i> > <i>au</i>), <span class="phone">/m/</span> > <span class="phone">/n/</span> (<i>fame</i> > <i>fan</i>, <i>fumo</i> > <i>fun</i>, <i>&ograve;mo</i> > <i>&ograve;n</i>), e <span class="phone">/ñ/</span> > <span class="phone">/nc/</span> (fel. e baso bel.: <i>se&ntilde;</i> > <i>senc</i>, <i>le&ntilde;</i> > <i>lenc</i>) o anka solke <span class="phone">/ñ/</span> > <span class="phone">/n/</span> (alto bel.: <i>bex&ograve;ñ</i> > <i>bex&ograve;n</i>).',
			'&#8216;l &agrave; palati&dstrok;a&tstrok;ion de <span class="phone">/tj, dj/</span> vanti vokal in <span class="phone">/c, ʤ/</span> (<i>tioler</i> (ark.) > <i>coler</i>, <i>sti&ograve;po</i> (ark.) > sc&ograve;po, <i>t&egrave;ner</i> > <i>c&eacute;ner</i> (deriv&agrave; da na forma <i>ti&eacute;ner</i>), <i>mesti&egrave;r</i> > <i>mesc&egrave;r</i>, <i>b&egrave;stie</i> > <i>b&egrave;sce</i>, <i>volenti&egrave;ra</i> > <i>bolinc&egrave;ra</i>, <i>bandi&egrave;ra</i> > <i>ban&#585;&egrave;ra</i>, <i>diamant</i> > <i>&#585;amant</i>).',
			'&#8216;l &agrave; skanbio de <span class="phone">/f/</span> in pren&tstrok;&iacute;pio e in koa de par&ograve;la ko <span class="phone">/θ/</span> (<i>fen&ograve;co</i> > <i>&tstrok;en&ograve;co</i>, <i>fiap</i> > <i>&tstrok;iap</i>, <i>f&eacute;mena</i> > <i>&tstrok;&eacute;mena</i>, <i>fonk</i> > <i>&tstrok;onk</i>, <i>k&ograve;rf</i> > <i>k&ograve;r&tstrok;</i>).',
			'el plural &#8216;l &agrave; la s&iacute;nkope de la <i>n</i> vanti <i>i</i> in koa (<i>bot&oacute;i</i>, <i>port&oacute;i</i>), ma solke se vanti de la konsonante in koa no se kata xa na <i>i</i> intel singolar.',
			'el plural &#8216;l &agrave; la s&iacute;nkope de la <i>l</i> vanti <i>i</i> in koa (<i>por&tstrok;&egrave;i</i>, <i>fax&oacute;i</i>), ma solke se vanti de la konsonante in koa no se kata xa na <i>i</i> intel singolar (<i>kanpanil</i>, <i>baril</i>).',
			'el plural de le par&ograve;le maskili el r&egrave;sta invari&agrave; par via de la vokal in koa muta, fora ke dopo <i>-n</i> e <i>-l</i> (<i>i gat</i>, <i>i sak</i>, <i>i tenp</i>).',
			'ge n&#8217; &eacute; kaxi de trasforma&tstrok;ion <span class="phone">/v/</span> > <span class="phone">/b/</span> (<i>volpe</i> > <i>bolp</i>, <i>vapor</i> > <i>banpor</i>, <i>vanpa</i> > <i>banpa</i>).',
			'&#8216;l &agrave; le dentali kostritive <span class="phone">/θ, d/</span> (<i>&tstrok;avata</i>, <i>na&tstrok;ion</i>, <i>pian&dstrok;&eacute;a</i>, <i>v&egrave;r&dstrok;i</i>).',
			'&#8216;l &agrave; la dental kostritiva sorda solke <span class="phone">/θ, d/</span>',
			'&#8216;l &agrave; le dentali kostritivo-okluxive <span class="phone">/ʦ, ʣ/</span>, o anka <span class="phone">/d/</span> al posto de le dentali kostritive <span class="phone">/θ, ð/</span>',
			'&#8216;l &agrave; le dentali kostritivo-okluxiva sorda e la kostritivo-kanali&dstrok;&agrave;a son&ograve;ra <span class="phone">/ʦ, x/</span> al posto de le dentali kostritive <span class="phone">/θ, ð/</span>',
			'&#8216;l &agrave; le dentali kostritivo-kanali&dstrok;&agrave;e <span class="phone">/s, x/</span> al posto de le dentali kostritive <span class="phone">/θ, ð/</span> (<i>savata</i>, <i>xente</i>)',
			'&#8216;l &agrave; la dental kostritivo-kanali&dstrok;&agrave;a sorda solke <span class="phone">/s, d/</span> al posto de le dentali kostritive <span class="phone">/θ, ð/</span> (<i>savata</i>, <i>dente</i>)',
			'&#8216;l &agrave; la pronun&tstrok;ia evanesente de la &egrave;le (<span class="phone">/ƚ/</span>)',
			'ge n&#8217; &eacute; la forma <i>an</i> al posto de &#8216;l pron&ograve;me/ajetivo <i>un/on</i> (d&#8217; &ograve;&ntilde;i m&ograve;do la forma de &#8216;l kardenal la r&egrave;sta <i>un</i>).',
			'pron&ograve;mi l&iacute;beri e kl&iacute;tegi soj. de 2<sup>a</sup> pars. sing. i f&agrave; <i>tu te</i>.',
			'pron&ograve;mi l&iacute;beri e kl&iacute;tegi soj. de 2<sup>a</sup> pars. sing. i f&agrave; <i>ti tu</i>.',
			'tute le <i>j</i> le vi&egrave;n l&egrave;te kome <i>&#585;</i> (<span class="phone">/j/</span> > <span class="phone">/ʤ/</span>).',
			'le <i>j</i> in pren&tstrok;ipio de par&ograve;la e dopo konsonante le vi&egrave;n l&egrave;te kome <i>&#585;</i> (<span class="phone">/j/</span> > <span class="phone">/ʤ/</span>).',
			'la <i>r</i> l&#8217; &eacute; vibrante <span class="phone">/r/</span>',
			'ge n&#8217; &eacute; metafon&egrave;xi (<i>dotor</i> > <i>doturi<i/>)',
			'&#8216;l &agrave; &#8216;l artikolo maskil <i>lo/li</i> (ark.) ke &#8216;l alterna ko <i>el/i</i> (<i>lo/li</i> + sostantivo propio maskil (<i>lo boton</i>, <i>lo gato</i>).',
			'&#8216;l &agrave; el pron&ograve;me kl&iacute;tego soj&egrave;to de 2<sup>a</sup> pars. <i>ti</i> al posto de la forma &dstrok;eneral <i>te</i> (<i>ti ti parli</i>, <i>ti no ti vi&egrave;n mia</i>).',
			'&#8216;l &agrave; la koniuga&tstrok;ion interogativa ko i enkl&iacute;tegi (<i>ti s&agrave;?</i>, <i>ti vi&egrave;n?</i>)',
			'la <i>e</i> &agrave;tona drio konsonante no prosimante e vanti vibrante la se v&egrave;r&dstrok;e in <i>a</i> (<i>p&eacute;vare</i>, <i>maraveja</i>, <i>k&agrave;mara</i>, <i>k&oacute;rare</i>)',
			'la <i>e</i> t&ograve;nega drio konsonante no prosimante e vanti vibrante la se v&egrave;r&dstrok;e in <i>&egrave;</i> (<i>sera</i> > <i>s&egrave;ra</i>, <i>krede</i> > <i>kr&egrave;de</i>).',
			'&#8216;l &agrave; &#8216;l interogativo <i>ci</i> al posto de la forma &dstrok;eneral <i>ki</i> (<i>ci situ?</i>, <i>ci elo?</i>, <i>ci elo ci?</i>)',
			'la sekuen&tstrok;a eterofonega tonega <i>i&egrave;</i> in s&iacute;laba sar&agrave;a el vi&egrave;n redoto a <i>&eacute;<i> (<i>vi&egrave;n</i> > <i>ven</i>, <i>mi&egrave;l</i> > <i>mel</i>, <i>mesti&egrave;r</i> > <i>mester</i>).'
		]
	},

	warning: '&ograve;co!',
	do_you_mean: 'volevitu &tstrok;erkar',
	or: 'opur',

	conjugation: 'koniug.',

	error: {
		NOT_ALFABETIC: '‘l à kar&agrave;teri no rekonosúi!',
		NOT_A_VERB_INFINITIVE: 'no ‘l p&ograve;l &egrave;ser on v&egrave;rbo!',
		NOT_STRESSABLE: 'no ‘l p&ograve;l portar a&tstrok;ento!',
		TOO_MUCH_STRESSES: '‘l à masa a&tstrok;enti!',
		NOT_SYLLABABLE: 'no se p&ograve;l div&iacute;der in silabe!'
	}

});
