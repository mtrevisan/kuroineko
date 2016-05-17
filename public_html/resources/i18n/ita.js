define({

	language: 'ita',

	dialect: {
		none: 'generale',
		northern_group: 'Feltrino-bellunese',
		northern: {
			feltrinBelumat: 'feltrino, bellunese',
			'cipileño': 'chipileño',
			altaTrevixana: 'alta trevigiana (vittoriese, coneglianese)',
			'ŧitadin': 'cittadino'
		},
		oriental_group: 'Liventino',
		oriental: {
			sandonatexe: 'trevigiano di sinistra Piave (opitergino, sandonatese, fossaltino)'
		},
		centralNorthern_group: 'Trevigiano',
		centralNorthern: {
			trevixan: 'trevigiano di destra Piave',
			kastelan: 'castellano'
		},
		lagunar_group: 'Lagunare',
		lagunar: {
			'veneŧian': 'veneziano',
			mestrin: 'mestrino',
			'coxòto': 'chioggiotto'
		},
		central_group: 'Padovano-vicentino-polesano',
		central: {
			padoan: 'padovano',
			'viŧentin': 'vicentino',
			'valsuganòto': 'valsuganotto',
			basoTrentin: 'basso trentino',
			polexan: 'polesano',
			'roigòto': 'rodigino'
			//talian: 'talian'
		},
		western_group: 'Veronese',
		western: {
			altaVeronexe: 'alta veronese',
			basaVeronexe: 'bassa veronese',
			'ŧitadin': 'cittadino'
		}
	},

	variant: {
		liventin: 'liventino',
		'feltrin-belumat': 'feltrino-bellunese',
		feltrin: 'feltrino',
		belumat: 'bellunese',
		seguxinexe: 'segusinese',
		'cipile&ntilde;o': 'chipile&ntilde;o',
		'feltrin-belumat de &tstrok;it&agrave;, fosaltin, alto trevixan (vitoriexe, konejanexe)': 'feltrino-bellunese di citt&agrave;, fossaltino, alto trevigiano (vittoriese, coneglianese)',
		'montebelunexe, axolan': 'montebellunese, asolano',
		kornudexe: 'cornudese',
		trevixan: 'trevigiano',
		kastelan: 'castellano',
		lagunar: 'lagunare',
		'cox&ograve;to': 'chioggiotto',
		mestrin: 'mestrino',
		'buran&egrave;l': 'buranello',
		padoan: 'padovano',
		'baso padoan': 'basso padovano',
		'vi&tstrok;entin': 'vicentino',
		'baso vi&tstrok;entin': 'basso vicentino',
		polexan: 'polesano',
		talian: 'talian',
		veronexe: 'veronese',
		'alto veronexe': 'alto veronese',
		'baso veronexe': 'basso veronese',
		triestin: 'triestino',

		sentence: 'La frase',
		is: '&egrave;',
		truthy: 'vera',
		falsy: 'falsa',
		lessThan: 'meno di',
		yes: 'S&iacute;',
		no: 'No',
		tryBefore: 'La tua variante &egrave;',
		tryAfter: '&egrave; vero?',
		dontKnow: 'Non saprei',
		ok: 'Va bene',
		unable: 'Non sono capace a venirne fuori, che variante hai?<br>Qual &egrave; la sue particolarit&agrave;?<br>Raccontami un po&#8217; scrivendomi!',

		attributes: [
			'tronca le finali <i>e, o</i> non accentate dietro <i>n</i>, ma solamente se non fanno parte della desinenza del plurale (<i>kan</i>, <i>tr&egrave;n</i>, <i>paron</i>); in generale se non fanno parte di un gruppo di consonanti (<i>xorno</i>), e in parole piane di pi&uacute; di due sillabe.',
			'tronca le finali <i>e, o</i> non accentate dietro <i>r, l</i>, ma solamente se non fanno parte della desinenza del plurale (<i>f&egrave;r</i>, <i>saver</i>, <i>frad&egrave;l</i>, <i>kanpanil</i>, <i>par&ograve;l</i>, <i>fax(i)&ograve;l</i>); in generale se non fanno parte di un gruppo di consonanti (<i>mare < MĀTREM</i>), e in parole piane di pi&uacute; di due sillabe (anche sdrucciole se sono infiniti).',
			'tronca le finali <i>e, o</i> non accentate dietro <i>k, p, s, t, &tstrok;</i>, ma solamente se non fanno parte della desinenza del plurale (<i>gat</i>, <i>sas</i>, <i>tenp</i>, <i>bra&tstrok;</i>, <i>savest</i>); in generale in parole piane di pi&uacute; di due sillabe.',
			'tronca le finali <i>e, o</i> non accentate in generale dopo le consonanti sonore e <i>f, &tstrok;</i> (<i>gat</i>, <i>sas</i>, <i>kaval</i>, <i>burlak</i>, <i>tenp</i>, <i>bra&tstrok;</i>, <i>bixef</i>, <i>pom</i>); in generale in parole piane di pi&uacute; di due sillabe.',
			'c&#8217;&egrave; sparizione dell&#8217;intertonica davanti <span class="phone">/r/</span> con epentesi di <span class="phone">/d/</span> (<i>V&eacute;ner</i> > <i>V&eacute;ndre</i>, <i>&tstrok;&eacute;ner</i> > <i>&tstrok;&eacute;ndre</i>, <i>t&eacute;nero</i> > <i>t&eacute;ndro</i>).',
			'la vocale di ripristino dopo aver avuto un troncamento &egrave; <i>e</i> (<i>kuande</i> per <i>kuando</i>).',
			'la vocale di ripristino dopo aver avuto un troncamento &egrave; <i>o</i> (<i>karno</i> per <i>karne</i>).',
			'c&#8217;&egrave; la forma <i>al</i> al posto dell&#8217;articolo e del pronoma <i>el</i> (<i>al kanta</i>, <i>al bosk</i>).',
			'usa la desinenza in <i>-st-</i> nel participio passivo (<i>ve&ntilde;esto</i>).',
			'le <span class="phone">/d, g, ð, x/</span> in finale di parola possono insordirsi in <span class="phone">/t, k, θ, s/</span> (bell.: <i>grando</i> > <i>grant</i>, <i>te ved</i> > <i>te vet</i>, <i>kruda</i> > <i>krut</i>, <i>fredo</i> > <i>fret</i>, <i>largo</i> > <i>lark</i>, <i>fongo</i> > <i>fonk</i>, <i>fogo</i> > <i>fok</i>, <i>&dstrok;ogo</i> > <i>&dstrok;ok</i>, <i>te per&dstrok;</i> > <i>te per&tstrok;</i>, <i>deskuer&dstrok;er</i> > <i>deskuer&tstrok;</i>, <i>dixe</i> > <i>dis</i>, <i>moroxo</i> > <i>moros</i>',
			'in finale di parola, ci sono casi di trasformazione <span class="phone">/v/</span> > <span class="phone">/f/</span> (<i>gualivo</i> > <i>gualif/valif</i>, <i>kort&iacute;(v)o</i> > <i>kortif</i>, <i>neve</i> > <i>n&eacute;f</i>, <i>b&ograve;</i> > <i>b&ograve;f</i> (derivato da una forma <i>&#8216;b&ograve;vo&#8217;</i>), <i>l&ograve;(v)o</i> > <i>l&ograve;f</i>, <i>ava</i> > <i>af</i>, <i>la Piave</i> > <i>la Plaf</i>), <span class="phone">/v/</span> > <span class="phone">/w/</span> (<i>viva</i> > <i>vi&uacute;</i>, <i>ava</i> > <i>au</i>), <span class="phone">/m/</span> > <span class="phone">/n/</span> (<i>fame</i> > <i>fan</i>, <i>fumo</i> > <i>fun</i>, <i>&ograve;mo</i> > <i>&ograve;n</i>), e <span class="phone">/ñ/</span> > <span class="phone">/nc/</span> (fel. e basso bell.: <i>se&ntilde;</i> > <i>senc</i>, <i>le&ntilde;</i> > <i>lenc</i>) o anche solamente <span class="phone">/ñ/</span> > <span class="phone">/n/</span> (alto bell.: <i>bex&ograve;ñ</i> > <i>bex&ograve;n</i>).',
			'ha palatizzazione di <span class="phone">/tj, dj/</span> davanti vocale in <span class="phone">/c, ʤ/</span> (<i>tioler</i> (ark.) > <i>coler</i>, <i>sti&ograve;po</i> (ark.) > sc&ograve;po, <i>t&egrave;ner</i> > <i>c&eacute;ner</i> (derivato da una forma <i>ti&eacute;ner</i>), <i>mesti&egrave;r</i> > <i>mesc&egrave;r</i>, <i>b&egrave;stie</i> > <i>b&egrave;sce</i>, <i>volenti&egrave;ra</i> > <i>bolinc&egrave;ra</i>, <i>bandi&egrave;ra</i> > <i>ban&#585;&egrave;ra</i>, <i>diamant</i> > <i>&#585;amant</i>).',
			'ha scanbio di <span class="phone">/f/</span> in principio e in finale di parola con <span class="phone">/θ/</span> (<i>fen&ograve;co</i> > <i>&tstrok;en&ograve;co</i>, <i>fiap</i> > <i>&tstrok;iap</i>, <i>f&eacute;mena</i> > <i>&tstrok;&eacute;mena</i>, <i>fonk</i> > <i>&tstrok;onk</i>, <i>k&ograve;rf</i> > <i>k&ograve;r&tstrok;</i>).',
			'il plurale ha la sincope della <i>n</i> davanti <i>i</i> in finale (<i>bot&oacute;i</i>, <i>port&oacute;i</i>), ma solamente se davanti della consonante in finale non si trova gi&agrave; una <i>i</i> nel singolare.',
			'il plurale ha la sincope della <i>l</i> davanti <i>i</i> in finale (<i>por&tstrok;&egrave;i</i>, <i>fax&oacute;i</i>), ma solamente se davanti della consonante in finale non si trova gi&agrave; una <i>i</i> nel singolare (<i>kanpanil</i>, <i>baril</i>).',
			'il plurale delle parole maschili resta invariato per via della vocale in finale muta, fuori che dopo <i>-n</i> e <i>-l</i> (<i>i gat</i>, <i>i sak</i>, <i>i tenp</i>).',
			'ci sono casi di trasformazione <span class="phone">/v/</span> > <span class="phone">/b/</span> (<i>volpe</i> > <i>bolp</i>, <i>vapor</i> > <i>banpor</i>, <i>vanpa</i> > <i>banpa</i>).',
			'ha le dentali costrittive <span class="phone">/θ, d/</span> (<i>&tstrok;avata</i>, <i>na&tstrok;ion</i>, <i>pian&dstrok;&eacute;a</i>, <i>v&egrave;r&dstrok;i</i>).',
			'ha solamente la dental costrittiva <span class="phone">/θ, d/</span>',
			'ha le dentali costrittivo-occlusive <span class="phone">/ʦ, ʣ/</span>, o anche <span class="phone">/d/</span> al posto delle dentali costrittive <span class="phone">/θ, ð/</span>',
			'ha la dentali costrittivo-occlusiva sorda e la costrittivo-canalizzata sonora <span class="phone">/ʦ, x/</span> al posto delle dentali costrittive <span class="phone">/θ, ð/</span>',
			'ha le dentali costrittivo-canalizzate <span class="phone">/s, x/</span> al posto delle dentali costrittive <span class="phone">/θ, ð/</span> (<i>savata</i>, <i>xente</i>)',
			'ha solamente la dentale costrittivo-canalizzata sorda <span class="phone">/s, d/</span> al posto delle dentali costrittive <span class="phone">/θ, ð/</span> (<i>savata</i>, <i>dente</i>)',
			'ha la pronuncia evanescente della elle (<span class="phone">/ƚ/</span>)',
			'c&#8217;&egrave; la forma <i>an</i> al posto del pronome/aggettivo <i>un/on</i> (ad ogni modo la forma del cardinale resta <i>un</i>).',
			'i pronomi liberi e clitici sogg. di 2<sup>a</sup> pers. sing. fanno <i>tu te</i>.',
			'i pronomi liberi e clitici sogg. di 2<sup>a</sup> pers. sing. fanno <i>ti tu</i>.',
			'tutte le <i>j</i> vengono lette come <i>&#585;</i> (<span class="phone">/j/</span> > <span class="phone">/ʤ/</span>).',
			'le <i>j</i> in principio di parola e dopo consonante vengono lette come <i>&#585;</i> (<span class="phone">/j/</span> > <span class="phone">/ʤ/</span>).',
			'la <i>r</i> &egrave; vibrante <span class="phone">/r/</span>',
			'c&#8217;&egrave; metafonesi (<i>dotor</i> > <i>doturi<i/>)',
			'ha l&#8217;articolo maschile <i>lo/li</i> (arc.) che alterna con <i>el/i</i> (<i>lo/li</i> + sostantivo proprio maschile (<i>lo boton</i>, <i>lo gato</i>).',
			'ha il pronome clitico soggetto di 2<sup>a</sup> pers. <i>ti</i> al posto della forma generale <i>te</i> (<i>ti ti parli</i>, <i>ti no ti vi&egrave;n mia</i>).',
			'ha la coniugazione interrogativa con enclitici (<i>ti s&agrave;?</i>, <i>ti vi&egrave;n?</i>)',
			'la <i>e</i> atona dopo consonante non approssimante e davanti a vibrante si apre in <i>a</i> (<i>p&eacute;vare</i>, <i>maraveja</i>, <i>k&agrave;mara</i>, <i>k&oacute;rare</i>)',
			'la <i>e</i> tonica dopo consonante non approssimante e davanti a vibrante si apre in <i>&egrave;</i> (<i>sera</i> > <i>s&egrave;ra</i>, <i>krede</i> > <i>kr&egrave;de</i>).',
			'ha l&#8217;interrogativo <i>ci</i> al posto della forma generale <i>ki</i> (<i>ci situ?</i>, <i>ci elo?</i>, <i>ci elo ci?</i>)',
			'la sequenza eterofonica tonica <i>i&egrave;</i> in sillaba chiusa viene ridotta a <i>&eacute;<i> (<i>vi&egrave;n</i> > <i>ven</i>, <i>mi&egrave;l</i> > <i>mel</i>, <i>mesti&egrave;r</i> > <i>mester</i>).'
		]
	},

	warning: 'attento!',
	do_you_mean: 'intendevi cercare',
	or: 'oppure',

	conjugation: 'coniug.',

	error: {
		NOT_ALFABETIC: 'ha caratteri non riconosciuti!',
		NOT_A_VERB_INFINITIVE: 'non pu&ograve; essere un verbo!',
		NOT_STRESSABLE: 'non pu&ograve; portare un accento!',
		TOO_MUCH_STRESSES: 'ha troppi accenti!',
		NOT_SYLLABABLE: 'non si pu&ograve; dividere in sillabe!'
	}

});
