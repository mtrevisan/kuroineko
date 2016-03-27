/**
 * @class Themizer
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/lang/phonology/Syllabe', 'tools/data/StringHelper', 'tools/lang/phonology/Hyphenator', 'tools/lang/phonology/hyphenatorPatterns/vec'], function(Word, Syllabe, StringHelper, Hyphenator, pattern_vec){

	/**
	 * @param {Verb} verb
	 * @param {Dialect} dialect
	 */
	var generate = function(verb, dialect){
		this.verb = verb;
		this.dialect = dialect;
		this.themes = {
			regular: {},
			irregular: {}
		};

		this.themes.regular = generateRegularThemes.call(this, verb);

		if(this.verb.irregular)
			this.themes.irregular = generateIrregularThemes.call(this);

		return this.themes;
	};

	var generateRegularThemes = function(verb){
		this.verb = verb;

		//T1
		var themeT1 = this.verb.infinitive.replace(/.$/, '');

		//T4 = T1: no stress
		var themeT4 = Word.suppressStress(themeT1);

		//T2 = T1: stress PTV > TV
		var themeT2 = themeT4.replace(/.$/, Word.addStressAcute);

		//T3 = T1: stress TV > (A)PTV | í > <ís>i
		var themeT3 = themeT1;
		if(this.verb.semiSpecial3rd)
			themeT3 = themeT1.replace(/í$/, '(ís)i');
		else if(this.verb.special3rd)
			themeT3 += 'si';
		else{
			var syllabationT4 = syllabateThemeT4(themeT4),
				idx = getIndexOfStressThemeT3.call(this, themeT1, syllabationT4);
			if(idx >= 0)
				themeT3 = StringHelper.setCharacterAt(themeT4, idx, Word[themeT4[idx].match(/[eo]/) && hasGraveStress(themeT4, syllabationT4, idx)? 'addStressGrave': 'addStressAcute']);
		}

		//T8 = T3: TV > ∅
		var themeT8 = themeT3.replace(/.$/, '');

		return {
			themeT1: themeT1,
			themeT2: themeT2,
			themeT3: themeT3,
			themeT4: themeT4,
			//T5 = T2: à > è/(é) | (é > í) | (í no -is- > é)
			themeT5: themeT2.replace(/à$/, 'è'),
			//T6 = T2: é > ú
			themeT6: themeT2.replace(/u?é$/, 'ú'),
			//T7 = T2: í > é
			themeT7: themeT2.replace(/í$/, 'é'),
			themeT8: themeT8,
			//T9 = T3: e > i
			themeT9: themeT3.replace(/e$/, 'i'),
			//T10 = T3: i > e
			themeT10: themeT3.replace(/i$/, 'e'),
			//T11 = T4: TV > ∅
			themeT11: themeT4.replace(/i?[aei]$/, ''),
			//T12 = T8: no stress
			themeT12: Word.suppressStress(themeT8)
		};
	};

	var generateIrregularThemes = (function(){
		var irregular = {
			andar: function(t){
				var themeX5 = t.themeT5.replace(/andè$/, 'vè'),
					themeX8 = t.themeT3.replace(/ànda$/, 'và'),
					themeX12 = t.themeT12.replace(/and$/, 'v');

				return {
					themeT5: themeX5,
					themeT8: themeX8,
					themeT9: themeX8,
					themeT10: themeX8,
					themeT12: themeX12,

					subjunctive: {
						themeT5: themeX5,
						themeT8: themeX8,
						themeT12: themeX12
					}
				};
			},

			darStarFar: function(t){
				var themeX8 = t.themeT3;

				//erase phonologically unacceptable themes
				t.themeT8 = undefined;
				//duplicated by X8
				t.themeT10 = undefined;

				return {
					themeT8: themeX8,

					subjunctive: {
						themeT8: themeX8
					}
				};
			},

			eser: function(t){
				var themeX5 = t.themeT5.replace(/esé$/, 'sé'),
					themeX5subj = t.themeT5.replace(/esé$/, 'sipié'),
					themeX6 = t.themeT6.replace(/esú$/, 'stà'),
					themeX8 = t.themeT8.replace(/ès$/, 's'),
					themeX8subj = t.themeT8.replace(/ès$/, 'sípi'),
					themeX9 = t.themeT9.replace(/èsi$/, 'sí'),
					themeX10 = t.themeT10.replace(/èse$/, 'é'),
					themeX12 = t.themeT12.replace(/es$/, 's'),
					themeX12subj = t.themeT12.replace(/es$/, 'sipi');

				//erase phonologically unacceptable themes
				t.themeT5 = undefined;
				t.themeT8 = undefined;
				t.themeT9 = undefined;
				t.themeT10 = undefined;
				t.themeT12 = undefined;

				return {
					themeT2: t.themeT2.replace(/esé$/, 'è'),
					themeT4: t.themeT4.replace(/ese$/, 'se'),
					themeT5: themeX5,
					themeT6: themeX6,
					themeT8: themeX8,
					themeT9: themeX9,
					themeT10: themeX10,
					themeT11: t.themeT11.replace(/es$/, 'er'),
					themeT12: themeX12,

					subjunctive: {
						themeT2: t.themeT2.replace(/esé$/, 'fú'),
						themeT4: t.themeT4.replace(/ese$/, 'fu'),
						themeT5: themeX5subj,
						themeT8: themeX8subj,
						themeT11: t.themeT11.replace(/es$/, 'fus'),
						themeT12: themeX12subj
					},

					participlePerfect: {
						themeT2: themeX6,
						themeT6: themeX6
					}
				};
			},

			averSaver: function(t){
				var themeX8 = t.themeT3.replace(/ve$/, ''),
					themeX8subj = t.themeT8.replace(/v$/, 'pi');

				//erase phonologically unacceptable themes
				t.themeT8 = undefined;
				t.themeT9 = undefined;
				t.themeT10 = undefined;

				return {
					themeT8: themeX8,
					themeT9: themeX8,
					themeT10: themeX8,

					subjunctive: {
						themeT5: t.themeT5.replace(/vé$/, 'piè'),
						themeT8: themeX8subj,
						themeT12: t.themeT12.replace(/v$/, 'pi')
					}
				};
			},

			traer: function(t){
				var themeX9 = t.themeT3.replace(/e$/, '');

				return {
					themeT1: t.themeT1.replace(/e$/, ''),
					//NOTE: prepare for syncope of 'de' before vibrant (indicative future and conditional simple only)
					themeT4: t.themeT4.replace(/e$/, ''),
					themeT5: t.themeT5.replace(/aé$/, 'è'),
					themeT9: themeX9,
					themeT10: themeX9,
					themeT12: t.themeT12.replace(/a$/, ''),

					subjunctive: {
						themeT4: undefined,
						themeT5: undefined
					}
				};
			},

			dever: function(t){
				return {
					subjunctive: {
						themeT5: t.themeT5.replace(/vé$/, 'biè'),
						themeT8: t.themeT8.replace(/v$/, 'bi'),
						themeT12: t.themeT12.replace(/v$/, 'bi')
					}
				};
			},

			dixer: function(t){
				return {
					themeT1: t.themeT1.replace(/xe$/, ''),
					//NOTE: prepare for syncope of 'xe' before vibrant (indicative future and conditional simple only)
					themeT4: t.themeT4.replace(/xe$/, ''),

					subjunctive: {
						themeT4: undefined
					}
				};
			},

			poder: function(t){
				return {
					//NOTE: prepare for syncope of 'de' before vibrant (indicative future and conditional simple only)
					themeT4: t.themeT4.replace(/de$/, ''),
					themeT10: t.themeT3.replace(/de$/, 'le'),

					subjunctive: {
						themeT5: undefined
					}
				};
			},

			toler: function(t){
				return {
					themeT1: t.themeT1.replace(/tolé$/, 'tò'),
					themeT4: t.themeT4.replace(/le$/, ''),

					subjunctive: {
						themeT5: undefined
					}
				};
			},

			viver: function(t){
				var themeX6 = t.themeT6.replace(/vú$/, 'sú');

				return {
					participlePerfect: {
						themeT6: themeX6
					}
				};
			},

			voler: function(t){
				var themeX6 = t.themeT6.replace(/lú$/, 'sú');

				return {
					themeT4: t.themeT4.replace(/le$/, ''),
					themeT6: themeX6,

					subjunctive: {
						themeT5: undefined
					},

					participlePerfect: {
						themeT6: themeX6
					}
				};
			},

			enher: function(t, dialect){
				var themeX9 = t.themeT3.replace(/[èé]ñe$/, (dialect.none? '(i)': (!dialect.western? 'i': '')) + t.themeT3.substr(-3, 1) + 'n');

				return {
					themeT9: themeX9,
					themeT10: themeX9
				};
			}
		};


		return function(){
			return irregular[this.verb.irregularity.verb.match(/s?aver/)? 'averSaver': this.verb.irregularity.verb](this.themes.regular, this.dialect);
		};
	})();


	/** @private */
	var syllabateThemeT4 = (function(){
		var trueHyatuses = [
			{matcher: /auspika$/, replacement: 'àuspika'},
			{matcher: /autora$/, replacement: 'àutora'},
			{matcher: /(fr|l)auda$/, replacement: '$1àuda'},
			{matcher: /laurea$/, replacement: 'làurea'},
			{matcher: /naufraga$/, replacement: 'nàufraga'},
			{matcher: /nauxea$/, replacement: 'nàuxea'},
			{matcher: /paupera$/, replacement: 'pàupera'},
			{matcher: /(in|re)staura$/, replacement: '$1stàura'},

			{matcher: /([psŧv])iola$/, replacement: '$1íola'},
			{matcher: /perioda/, replacement: 'períoda'},

			{matcher: /(^(in)?g|([fg])r|(stra)?s)ua$/, replacement: '$1úa'},

			{matcher: /((ar|[ei]n)f|^(dex)?n|([kp]|st)r|^s|(de|in|x)v)ia$/, replacement: '$1ía'}
		];
		var hyphenator = new Hyphenator(pattern_vec);

		return function(themeT4){
			//infer stress position
			var m;
			if(trueHyatuses.some(function(el){ m = el; return this.match(el.matcher); }, themeT4))
				themeT4 = themeT4.replace(m.matcher, m.replacement);

			return hyphenator.hyphenate(themeT4);
		};
	})();

	/** @private */
	var getIndexOfStressThemeT3 = (function(){
		//note for latin: bisyllabe and trisyllabe with long penultimate syllabe > parossitone, trisyllabe with short penultimate syllabe > proparossitone
		//short vowel + CC(C) > long by position, but short vowel + occlusive + r > short (stress tend to backtrack, as in ÍNTĔGRUM > íntegro)
		/*var suffixes = [
			/([nrv]e|du)$/, /ib$/, /of$/,
			/aere/,

			/(ux|kl)e$/, /(en|set)u$/, /tub$/, /(ne|[dlmpsŧ]i|[im]o)d$/, /xof$/, /([obdđflmnñsŧvx]e|di|ro|iu)g$/, /(da|xe|[dlnt]i|du)k$/, /([fk]e|mi|[aecdđgjnñpvx]o|[bglpstx]u)l$/,
			/([gs]a|[nrsx]e|di|go)m$/, /[ust]en$/, /điñ$/, /([sŧ]i|ko|ku)p$/, /([ecdfkmvx]a|[abdđgjɉklmsvx]e|([bgr]|em)o|e[bk])r$/, /([aeoubdlmpsŧvx]i|[flmp]u)t$/, /(do|ne)v$/, /aux$/,

			/[st]inu$/, /(bi|fru|si)tu$/, /(av[ei]|bri|kui)d$/, /r[bp]e[đx]$/, /graf$/, /(([aiu]n|[aeiunrs]t|[aiour]p|[uebgt]r)e|(a[lt]|bl|[od]r|[in]t|ul)i|([aio]l|er)o|ifu)g$/,
			/(nte|([ab]r|[ai]f)i|[eio]vo)k$/, /([iu]bi|([aiou][sŧ]|a[bkmt]|e[fkmt]|i[bfkmrst]|l[kt]|n[bf]|o[bfmt]|u[fk]|[psŧv]i|rm|st)o|([eiu]m|on?d|ok)u)l$/, /([on]s|[il]t|e[sŧ])im$/,
			/(lma|([nr]d|[aioulr]m|ov|[eiur]x)e|(sk|[ioulr]m|oŧ|[enr]x)i|(ef|[eon]g|ls)o)n$/, /((an|[ei]t|[in]b|[ou]p)a|(pi|ac|if|[eol]n|[oun]p|[eil]t)e|(nf|[ln]k|[ar]p|et|r[mv])o)r$/,
			/((pr|sk)e|in?ri|klu)t$/, /tegr$/, /[ei]tr$/,

			/[sŧ]ipri$/, /gradu$/, /uestu$/, /ante[đx]$/, /((anp|[bksŧ]ot)e|[ae]sti)g$/, /uspik$/,
			/(kaba|muti|([ae]nt|[ai]sk|[bkm]ok|be[sŧ]|kar|(^|[kp])on[kt]|[bg]ron[kstŧ]|irk|o[nr]k|[ñrsŧ]ok|ses)o|peku)l$/,
			/(anpa|ar[đx][ei]|([mpr]ax|[mr]ox|[fsx]em)e|(est|ma[kx]|[lm]ut|orb|pat|(mo|ve)x|[tx]am|urb)i)n$/, /((lat|[ao]sp)e|auto)r$/, /(osta|mer[ei]|ve[jɉx]e)t$/, /[ai]frax$/, /alibr$/,

			/dustri$/, /aufrag$/, /(kre[sŧ]|stok)ol$/, /rindel$/, /vinkol$/, /vixil$/, /platin$/, /tinpan$/
		];*/
		var stressIndices = {
			'abdikà': 0, 'abilità': 2, 'abità': 0, 'abrogà': 0, 'aerà': 0, 'afadegà': 2, 'albitrà': 0, 'alborà': 0, 'aleà': 2, 'alterà': 0, 'amutinà': 2, 'anemà': 0, 'ankorà': 0, 'anplifegà': 4, 'ansimà': 0, 'antiŧipà': 3, 'aplikà': 0, 'apokopà': 2, 'apostrofà': 2, 'arbitrà': 0, 'arborà': 0, 'arfià': 3, 'arpegà': 0, 'artikolà': 3, 'arxarà': 0, 'arđenà': 0, 'arđerà': 0, 'arđinà': 0, 'arđiñà': 0, 'asiderà': 2, 'auspikà': 0, 'autorà': 0, 'axevolà': 2, 'axeà': 2, 'axità': 0, 'aŧelerà': 2, 'aŧidà': 0, 'bagolà': 1, 'balegà': 1, 'balsamà': 1, 'baluxenà': 3, 'barafuxolà': 5, 'barikà': 1, 'batolà': 1, 'bearà': 1, 'bekolà': 1, 'betegà': 1, 'beverà': 1, 'beà': 1, 'biaxemà': 2, 'bindolà': 1, 'biskolà': 1, 'bixegolà': 3, 'bixegà': 1, 'bixigolà': 3, 'blaterà': 2, 'bolsegà': 1, 'bonifegà': 3, 'borondolà': 3, 'boŧolà': 1, 'bragolà': 2, 'bramegà': 2, 'braŧolà': 2, 'brokolà': 2, 'bronbolà': 2, 'brondolà': 2, 'brontolà': 2, 'broà': 2, 'brulegà': 2, 'brusketà': 2, 'bruskinà': 2, 'brustolà': 2, 'bulegà': 1, 'buligà': 1, 'buxarà': 1, 'buxerà': 1, 'cacarà': 1, 'cacerà': 1, 'cakolà': 1, 'cekolà': 1, 'celerà': 1, 'cetarà': 1, 'cicolà': 1, 'cipegà': 1, 'dedegà': 1, 'defraudà': 4, 'dekapità': 3, 'delapidà': 3, 'delegà': 1, 'deliberà': 3, 'denegà': 1, 'depoxità': 3, 'deputà': 1, 'desemenà': 3, 'desfabregà': 4, 'desfabrikà': 4, 'desfogonà': 4, 'desfregolà': 5, 'desimilà': 3, 'deskankarà': 4, 'deskapità': 4, 'deskavedà': 4, 'deskodegà': 4, 'deskomodà': 4, 'despegolà': 4, 'despenolà': 4, 'despetenà': 4, 'despetolà': 4, 'despetorà': 4, 'despigolà': 4, 'despolverà': 4, 'desputà': 1, 'destegolà': 4, 'destenperà': 4, 'destenà': 1, 'desterminà': 4, 'destokolà': 4, 'destregolà': 5, 'destrigolà': 5, 'destuà': 4, 'determinà': 3, 'devià': 3, 'dexabilità': 5, 'dexabità': 3, 'dexalborà': 3, 'dexanemà': 3, 'dexautorà': 3, 'dexbafarà': 4, 'dexbavarà': 4, 'dexbingolà': 4, 'dexbonigolà': 6, 'dexboxemà': 4, 'dexboŧolà': 4, 'dexbramegà': 5, 'dexbraxolà': 5, 'dexbusolà': 4, 'dexbuxolà': 4, 'dexganbarà': 4, 'dexgrandenà': 5, 'dexgrendenà': 5, 'dexiderà': 3, 'dexinfià': 6, 'dexintosegà': 6, 'dexinà': 1, 'dexlanegà': 4, 'dexmanegà': 4, 'dexmaskarà': 4, 'dexmentegà': 4, 'dexmontegà': 4, 'dexmunegà': 4, 'dexnaxolà': 4, 'dexnià': 4, 'dexnonbolà': 4, 'dexnoà': 4, 'dexnuà': 4, 'dexordenà': 3, 'dexriŧolà': 4, 'dexverxenà': 4, 'dexvià': 4, 'deŧakolà': 3, 'deŧimà': 1, 'deŧipà': 1, 'dialogà': 2, 'dindolà': 1, 'disipà': 1, 'dolŧifegà': 4, 'domenà': 1, 'domestegà': 3, 'doparà': 1, 'doperà': 1, 'dubità': 1, 'dulkorà': 1, 'edifegà': 2, 'edukà': 0, 'ekuivokà': 3, 'eliminà': 2, 'emulà': 0, 'enfià': 3, 'epilogà': 2, 'eradegà': 2, 'erpegà': 0, 'eskorporà': 3, 'espetorà': 3, 'esterminà': 3, 'evokà': 0, 'examenà': 2, 'exasperà': 2, 'exautorà': 2, 'exaɉerà': 2, 'exekrà': 0, 'exerŧità': 2, 'exità': 0, 'exonerà': 2, 'exulà': 0, 'fabregà': 1, 'fadegà': 1, 'falsifegà': 4, 'feliŧità': 3, 'femenà': 1, 'filoxofà': 3, 'fioŧinà': 2, 'foderà': 1, 'folgorà': 1, 'foliskarà': 3, 'formigolà': 4, 'formolà': 1, 'fornegà': 1, 'fortifegà': 4, 'frapolà': 2, 'fraudà': 2, 'fregolà': 2, 'fritegà': 2, 'fritolà': 2, 'fruà': 2, 'fruñolà': 2, 'fulmenà': 1, 'fulminà': 1, 'fumegà': 1, 'furegà': 1, 'fustegà': 1, 'globolà': 2, 'glutinà': 2, 'godegà': 1, 'gomità': 1, 'gondolà': 1, 'gongolà': 1, 'gramolà': 2, 'grandenà': 2, 'gretolà': 2, 'grongolà': 2, 'gruà': 2, 'guà': 1, 'ibridà': 0, 'identifegà': 5, 'idroxenà': 3, 'iluminà': 2, 'imaxinà': 2, 'inalberà': 2, 'inalborà': 2, 'inamidà': 2, 'inarpeđà': 2, 'inarđerà': 2, 'inaxeà': 4, 'inaxolà': 2, 'inaŧidà': 2, 'inbagolà': 3, 'inbalegà': 3, 'inbalsamà': 3, 'inbalsemà': 3, 'inbanbolà': 3, 'inbavarà': 3, 'inbeverà': 3, 'inbokolà': 3, 'inbolsamà': 3, 'inbonbegà': 3, 'inbovolà': 3, 'inboxemà': 3, 'inboŧolà': 3, 'inbraŧolà': 4, 'inbusolà': 3, 'inbuxerà': 3, 'inbuŧolà': 3, 'indafarà': 3, 'indasenà': 3, 'indebità': 3, 'indoà': 3, 'indubità': 3, 'inedukà': 2, 'infaŧolà': 3, 'infervorà': 3, 'infistegà': 3, 'infià': 3, 'infogonà': 3, 'infoibà': 3, 'informigolà': 6, 'infrapolà': 4, 'infumegà': 3, 'inganbarà': 3, 'inganberà': 3, 'ingatolà': 3, 'ingravidà': 4, 'ingurxità': 3, 'inguà': 3, 'inkabalà': 3, 'inkanevà': 3, 'inkankarà': 3, 'inkantexemà': 6, 'inkarolà': 3, 'inkatarigolà': 7, 'inkatigà': 3, 'inkatorigolà': 7, 'inkodegà': 3, 'inkogolà': 3, 'inkolegà': 3, 'inkomodà': 3, 'inkonkolà': 3, 'inkorporà': 3, 'inkotegà': 3, 'inkotolà': 3, 'inkrostolà': 4, 'inkroŧolà': 4, 'inkuŧolà': 3, 'inleà': 3, 'inluminà': 3, 'inmanegà': 3, 'inmaskarà': 3, 'inmaskerà': 3, 'inmaxarà': 3, 'inmucarà': 3, 'inokulà': 2, 'inpacolà': 3, 'inpatinà': 3, 'inpaverà': 3, 'inpegolà': 3, 'inpenolà': 3, 'inpetolà': 3, 'inpeverà': 3, 'inpicolà': 3, 'inpirolà': 3, 'inpiŧolà': 3, 'inplikà': 0, 'inpolverà': 3, 'inpomolà': 3, 'inprià': 4, 'inputà': 0, 'inrità': 0, 'inrodolà': 3, 'insakolà': 3, 'insangonà': 3, 'insanguenà': 3, 'insemolà': 3, 'inseà': 3, 'inskatolà': 4, 'inskeletrà': 4, 'insolfarà': 3, 'insosolà': 3, 'insoŧolà': 3, 'inspaxemà': 4, 'inspeà': 4, 'inspirità': 4, 'instaurà': 4, 'insulà': 0, 'intanbarà': 3, 'intardegà': 3, 'intardigà': 3, 'intavolà': 3, 'integrà': 0, 'intelerà': 3, 'intenperà': 3, 'interogà': 3, 'interpretà': 3, 'intitolà': 3, 'intorgolà': 3, 'intorkolà': 3, 'intosegà': 3, 'intrapolà': 4, 'introità': 4, 'invalidà': 3, 'invergolà': 3, 'inverigolà': 5, 'investigà': 3, 'invià': 3, 'involtolà': 3, 'inxakolà': 3, 'inxeregà': 3, 'inxeñatolà': 5, 'inđenerà': 3, 'inŧakolà': 3, 'inŧangolà': 3, 'inŧeregà': 3, 'inŧità': 0, 'inŧukarà': 3, 'inɉemarà': 3, 'irità': 0, 'iriŧolà': 2, 'iskeletrà': 3, 'ispaxemà': 3, 'ispeà': 3, 'ispirità': 3, 'istuà': 3, 'iterà': 0, 'ixolà': 0, 'joŧolà': 1, 'kabalà': 1, 'kalibrà': 1, 'kaligà': 1, 'kalkarà': 1, 'kalkiđolà': 4, 'kalkolà': 1, 'kandidà': 1, 'kanforà': 1, 'kapitolà': 3, 'kapità': 1, 'karakolà': 3, 'karolà': 1, 'kasegà': 1, 'kastigà': 1, 'katalogà': 3, 'katastegà': 3, 'kauxà': 1, 'klasifegà': 4, 'koabità': 2, 'kogolà': 1, 'kojonbarà': 3, 'kokolà': 1, 'kolegà': 1, 'komodà': 1, 'komunegà': 3, 'konfutà': 1, 'konglomerà': 5, 'kongratulà': 5, 'koniugà': 1, 'konpanadegà': 6, 'konpanegà': 4, 'konpenetrà': 4, 'konplegà': 1, 'konplikà': 1, 'konsiderà': 4, 'kontaminà': 4, 'koordenà': 2, 'koà': 1, 'krekolà': 2, 'krexemà': 2, 'kreà': 2, 'krikolà': 2, 'kritegà': 2, 'krià': 2, 'krokolà': 2, 'krostenà': 2, 'krostolà': 2, 'kroà': 2, 'kuantifegà': 5, 'kufolà': 1, 'kumulà': 1, 'kuŧolà': 1, 'lagremà': 1, 'lapidà': 1, 'laudà': 1, 'laureà': 1, 'lemoxinà': 3, 'letarà': 1, 'leterà': 1, 'lexenà': 1, 'lexitimà': 3, 'liberà': 1, 'likuidà': 1, 'limegà': 1, 'limità': 1, 'lisegà': 1, 'litigà': 1, 'logorà': 1, 'makinà': 1, 'malgamà': 1, 'malmenà': 1, 'manedà': 1, 'manipolà': 3, 'mantegà': 1, 'mantekà': 1, 'manteđà': 1, 'manŧipà': 1, 'marangonà': 3, 'marxinà': 1, 'maskarà': 1, 'maskerà': 1, 'mastegà': 1, 'maxarà': 1, 'maxegà': 1, 'maxenà': 1, 'maxerà': 1, 'mañifegà': 3, 'maŧipà': 1, 'medegà': 1, 'meretà': 1, 'merità': 1, 'mestegà': 1, 'milità': 1, 'mitigà': 1, 'modulà': 1, 'mokolà': 1, 'moltiplegà': 4, 'momolà': 1, 'montegà': 1, 'morbinà': 1, 'mormolà': 1, 'mormorà': 1, 'morsegà': 1, 'mortifegà': 4, 'moxegà': 1, 'mucarà': 1, 'mudarà': 1, 'mutegà': 1, 'mutilà': 1, 'muxegà': 1, 'muxolà': 1, 'muà': 1, 'muñegà': 1, 'nanarà': 1, 'naufragà': 1, 'nauxeà': 1, 'navegà': 1, 'nevegà': 1, 'ninegà': 1, 'ninolà': 1, 'nià': 1, 'nodrigà': 1, 'nomenà': 1, 'notifegà': 3, 'noà': 1, 'nuvolà': 1, 'oblegà': 0, 'obligà': 0, 'obliterà': 3, 'okelà': 0, 'okupà': 0, 'omologà': 2, 'ondulà': 0, 'onfegà': 0, 'ontolà': 0, 'oparà': 0, 'operà': 0, 'orbegà': 0, 'ordenà': 0, 'orixenà': 2, 'osixenà': 2, 'ospità': 0, 'ostregà': 0, 'otenperà': 2, 'pacarà': 1, 'pacolà': 1, 'palifegà': 3, 'palpierà': 1, 'panteđà': 1, 'papolà': 1, 'parafraxà': 3, 'parteŧipà': 4, 'paskolà': 1, 'patinà': 1, 'pauxà': 1, 'paxifegà': 3, 'pendolà': 1, 'penetrà': 1, 'penolà': 1, 'pepolà': 1, 'perifraxà': 3, 'periodà': 3, 'permudarà': 4, 'permutà': 1, 'perorà': 1, 'perpetrà': 1, 'perseguità': 4, 'pertegà': 1, 'pestegà': 1, 'pestolà': 1, 'petegolà': 3, 'petenà': 1, 'peteđolà': 3, 'petolà': 1, 'peverà': 1, 'piatolà': 2, 'pindolà': 1, 'piolà': 1, 'piovexinà': 4, 'pirolà': 1, 'pisolà': 1, 'pispolà': 1, 'pixolà': 1, 'piŧegà': 1, 'piŧolà': 1, 'platinà': 2, 'pomegà': 1, 'pontolà': 1, 'popolà': 1, 'postiŧipà': 4, 'povolà': 1, 'poé': 1, 'prategà': 2, 'predegà': 2, 'predestenà': 4, 'predomenà': 4, 'preokupà': 3, 'presostatà': 4, 'prexudegà': 4, 'prià': 2, 'prodegà': 2, 'prodigà': 2, 'profumegà': 4, 'pronostegà': 4, 'prorogà': 2, 'prosimà': 2, 'prosperà': 2, 'provokà': 2, 'proà': 2, 'publegà': 1, 'purifegà': 3, 'radegà': 1, 'rakolà': 1, 'ranpegà': 1, 'rantegà': 1, 'rantolà': 1, 'rapegà': 1, 'ratifegà': 3, 'reanemà': 2, 'rebekolà': 3, 'rebondolà': 3, 'recolà': 1, 'redità': 1, 'refolà': 1, 'regolà': 1, 'regonà': 1, 'regroà': 4, 'regurxità': 3, 'reinproverà': 6, 'reintegrà': 2, 'reiterà': 2, 'rekalŧitrà': 3, 'rekapitolà': 5, 'rekapità': 3, 'reklutà': 1, 'rekonsiderà': 6, 'rekuperà': 3, 'relegà': 1, 'remerità': 3, 'renegà': 1, 'replegà': 1, 'replikà': 1, 'repopolà': 3, 'repovolà': 3, 'represtinà': 4, 'reputà': 1, 'respexolà': 4, 'restaurà': 4, 'resusità': 3, 'revokà': 1, 'revoltolà': 3, 'rexegà': 1, 'rexekà': 1, 'reŧità': 1, 'rigolà': 1, 'rinproverà': 5, 'rinđovenà': 4, 'rixegà': 1, 'riŧolà': 1, 'rodolà': 1, 'roegà': 1, 'romanxinà': 3, 'ronkolà': 1, 'ronŧegà': 1, 'ropegà': 1, 'rovegà': 1, 'roxegà': 1, 'roà': 1, 'rubregà': 1, 'rugolà': 1, 'rumegà': 1, 'ruà': 1, 'sabolà': 1, 'sagomà': 1, 'sakrifegà': 4, 'sangonà': 1, 'sanguenà': 1, 'saé': 1, 'scarifegà': 4, 'scikarà': 2, 'sedolà': 1, 'segregà': 1, 'seguità': 1, 'seità': 1, 'semenà': 1, 'semolà': 1, 'senplifegà': 5, 'sesolà': 1, 'sevità': 1, 'sfadegà': 2, 'sfadigà': 2, 'sfiamegà': 3, 'sfodegà': 2, 'sfoderà': 2, 'sfogonà': 2, 'sfojolà': 2, 'sforbeđà': 2, 'sfraxenà': 3, 'sfregolà': 3, 'sfritegà': 3, 'sfriđegà': 3, 'sfulminà': 2, 'sfumegà': 2, 'sfuregà': 2, 'sibilà': 1, 'sifolà': 1, 'simolà': 1, 'simulà': 1, 'sindakà': 1, 'sindikà': 1, 'sinkopà': 1, 'sioperà': 2, 'sisolà': 1, 'sixolà': 1, 'sià': 1, 'skalmanà': 2, 'skalpolà': 2, 'skanpanà': 2, 'skaolà': 2, 'skapolà': 2, 'skarnifegà': 5, 'skarpeđà': 2, 'skasegà': 2, 'skitolà': 2, 'skodegà': 2, 'skomunegà': 4, 'skonbusolà': 5, 'skonpaxenà': 5, 'skorporà': 2, 'skortegà': 2, 'skotolà': 2, 'skovolà': 2, 'skoà': 2, 'skrekolà': 3, 'skrepolà': 3, 'skreŧolà': 3, 'skrikolà': 3, 'skrimiatolà': 6, 'skriŧolà': 3, 'skrokolà': 3, 'sofegà': 1, 'sofistegà': 3, 'soleŧità': 3, 'solfarà': 1, 'spacarà': 2, 'spanpanà': 2, 'spantegà': 2, 'spapolà': 2, 'spatolà': 2, 'spaxemà': 2, 'spekulà': 2, 'spelegà': 2, 'spertegà': 2, 'spetenà': 2, 'spetolà': 2, 'spetorà': 2, 'speà': 2, 'speŧegà': 2, 'speŧifegà': 4, 'spifarà': 2, 'spiferà': 2, 'spigolà': 2, 'spinfarà': 2, 'spiolà': 2, 'spipolà': 2, 'spirità': 2, 'spisolà': 2, 'spiŧegà': 2, 'spolverà': 2, 'spontegà': 2, 'spopolà': 2, 'spovolà': 2, 'sprexudegà': 5, 'spulegà': 2, 'spuntigà': 2, 'spuà': 2, 'stenografà': 4, 'stenperà': 2, 'sterminà': 2, 'stipulà': 2, 'stomegà': 2, 'strakolà': 3, 'strangolà': 3, 'stranuà': 5, 'straordenà': 4, 'strapegà': 3, 'strasekolà': 5, 'strasuà': 5, 'strepità': 3, 'strikolà': 3, 'strià': 3, 'strolegà': 3, 'strukolà': 3, 'stusegà': 2, 'stuà': 2, 'stuŧegà': 2, 'subordenà': 3, 'suparà': 1, 'superà': 1, 'suplegà': 1, 'surogà': 1, 'suseguità': 3, 'susità': 1, 'suà': 1, 'tabulà': 1, 'takolà': 1, 'tanbarà': 1, 'tardigà': 1, 'tartufolà': 4, 'telefonà': 3, 'tenperà': 1, 'termenà': 1, 'terminà': 1, 'tinpanà': 1, 'titubà': 1, 'tolerà': 1, 'tonbolà': 1, 'tonfolà': 1, 'torigà': 1, 'torkolà': 1, 'tosegà': 1, 'trafegà': 2, 'tramudarà': 4, 'tranxità': 2, 'trapolà': 2, 'tremolà': 2, 'tribolà': 2, 'tridolà': 2, 'trikolà': 2, 'trotolà': 2, 'truŧidà': 2, 'turbinà': 1, 'tuà': 1, 'ukelà': 0, 'ultimà': 0, 'ululà': 0, 'ustegà': 0, 'uñolà': 0, 'validà': 1, 'valutà': 1, 'vedovà': 1, 'vendegà': 1, 'vergolà': 1, 'verifegà': 3, 'verigolà': 3, 'vexetà': 1, 'veɉetà': 1, 'videgà': 1, 'vidimà': 1, 'vinifegà': 3, 'vinkolà': 1, 'violà': 1, 'vixilà': 1, 'vixità': 1, 'voltolà': 1, 'vomità': 1, 'vulnerà': 1, 'xaolà': 1, 'xbafarà': 2, 'xbanpolà': 2, 'xbaporà': 2, 'xbarbatolà': 5, 'xbatolà': 2, 'xbaŧegà': 2, 'xberegà': 2, 'xbetegà': 2, 'xbeŧolà': 2, 'xbiaxemà': 3, 'xbigolà': 2, 'xbingolà': 2, 'xbixegà': 2, 'xbixigolà': 4, 'xbokolà': 2, 'xbolsegà': 2, 'xbolsonà': 2, 'xbonigolà': 4, 'xbonsegà': 2, 'xbosegà': 2, 'xbotegà': 2, 'xboxemà': 2, 'xboà': 2, 'xbraità': 3, 'xbrasolà': 3, 'xbraŧolà': 3, 'xbrefelà': 3, 'xbrindelà': 3, 'xbrindolà': 3, 'xbriŧolà': 3, 'xbrodegà': 3, 'xbrodolà': 3, 'xbronkolà': 3, 'xbuxolà': 2, 'xdentegà': 2, 'xdindolà': 2, 'xdrumenà': 3, 'xemenà': 1, 'xganbarà': 2, 'xgangerà': 2, 'xgarofolà': 4, 'xgaxolà': 2, 'xgañolà': 2, 'xgramolà': 3, 'xgrendenà': 3, 'xgretolà': 3, 'xgriŧolà': 3, 'xgrongolà': 3, 'xgronŧolà': 3, 'xguindolà': 3, 'xirandolà': 3, 'xlanegà': 2, 'xlimegà': 2, 'xlipegà': 2, 'xliŧegà': 2, 'xluxegà': 2, 'xmafarà': 2, 'xmalmenà': 2, 'xmanarà': 2, 'xmaserà': 2, 'xmaskarà': 2, 'xmaskerà': 2, 'xmegolà': 2, 'xmemorà': 2, 'xmentegà': 2, 'xmeolà': 2, 'xmergolà': 2, 'xmiaolà': 3, 'xmokolà': 2, 'xmontegà': 2, 'xmorgolà': 2, 'xmuxegà': 2, 'xnanarà': 2, 'xnonbolà': 2, 'xnuà': 2, 'xregolà': 2, 'xudegà': 1, 'xufolà': 1, 'xvanpolà': 2, 'xvaporà': 2, 'xventolà': 2, 'xvergolà': 2, 'xvetolà': 2, 'xvimenà': 2, 'xvià': 2, 'xvoltolà': 2, 'xñaolà': 2, 'xñokolà': 2, 'xɉedolà': 2, 'xɉoŧolà': 2, 'ñaolà': 1, 'ñiñolà': 1, 'ñokolà': 1, 'đenerà': 1, 'đogatolà': 3, 'đogolà': 1, 'đugatolà': 3, 'đugolà': 1, 'ŧakolà': 1, 'ŧapegà': 1, 'ŧapolà': 1, 'ŧelebrà': 1, 'ŧentrifugà': 5, 'ŧifolà': 1, 'ŧigolà': 1, 'ŧikolà': 1, 'ŧimegà': 1, 'ŧimolà': 1, 'ŧiolà': 1, 'ŧirkolà': 1, 'ŧirkumnavegà': 7, 'ŧokolà': 1, 'ŧopegà': 1, 'ŧotegà': 1, 'ŧukarà': 1, 'ŧupegà': 1, 'ɉegomarà': 3, 'ɉelomarà': 3, 'ɉoŧolà': 1, 'ɉubilà': 1, 'ɉugulà': 1
		};

		return function(themeT1, syllabationT4){
			var themeVowel = themeT1[themeT1.length - 1],
				idx = -1;
			//all but second conjugation parossitone (which does not need to backtrack stress)
			if(themeVowel != 'e'){
				if(stressIndices[themeT1] != undefined)
					idx = stressIndices[themeT1];
				else{
					//note: about 83.8% of the verbs have the stress on the penultimate syllabe
					var sylIdx = -1;
					if(syllabationT4.syllabes.length > 1 && !this.verb.irregularity.darStarFar)
						sylIdx --;
					idx = syllabationT4.getGlobalIndexOfStressedSyllabe(sylIdx);
				}
			}
			return idx;
			/*var themeVowel = themeT1[themeT1.length - 1],
				idx = -1;
			//all but second conjugation parossitone (which does not need to backtrack stress)
			if(themeVowel != 'e'){
				var sylIdx = -1;
				//note: about 83.8% of the verbs have the stress on the penultimate syllabe
				if(syllabationT4.syllabes.length > 1 && !this.verb.irregularity.darStarFar)
					sylIdx --;
				//note: only for verbs of the first conjugation which have an open penultimate syllabe
				if(syllabationT4.syllabes.length > 2 && themeVowel == 'à' && Syllabe.isSyllabeOpen(syllabationT4.getAt(-2))
						&& StringHelper.isMatching(themeT1.replace(/.$/, ''), suffixes))
					sylIdx --;
				if(syllabationT4.syllabes.length == 1 && themeT1.match(/^[rt]uà$/))
					return 1;

				idx = syllabationT4.getGlobalIndexOfStressedSyllabe(sylIdx)
					- (syllabationT4.getAt(sylIdx).match(/(^|[^aeiouàèéíòóú])àu/)? 1: 0);
			}
			return idx;*/
		};
	})();

	/**
	 * NOTE: these relates mainly to the central-northern dialect.
	 *
	 * @private
	 */
	var hasGraveStress = (function(){
		var infixes = [
			/^e([fl]a|xe|xi)/,
			/e(([flrv]|[bdrv]i|[gt]u)a|gui|du)/,
			/[lp]ea/,
			/lexe/,
			/^re([dgls]a|xe|go)/,
			/xrego/,
			/be(ga|re|ko)/,
			/ce([kst]a|le|ko)/,
			/de(ta|[bsŧ]i|[dl]e)/,
			/fe([st]a|tu)/,
			/ie[đgtx]a/,
			/[jɉ]eta/,
			/ke(ga|le)/,
			/le([sŧ]i|fo)/,
			/me([dr]e|ri)/,
			/ne(ga|du)/,
			/pe([ckt]a|te|po|[kt]u)/,
			/re([dsŧ]i|pli|le|klu)/,
			/se([ds]a|re|v?i|gui|ko|tu)/,
			/te(ga|le|[sŧ]i|ro|nu)/,
			/ŧe([lr]e|tu)/,
			/veca/,
			/xe(ta|[mr]e)/,

			/er([st]a|pe)/,
			/ber[gl]a/,
			/fervo/,
			/[jɉ]erma/,
			/ker[msŧ]a/,
			/[dl]erna/,
			/mer(da|[sŧ]ia)/,
			/ner[bv]a/,
			/per(la|[pt]e|mu)/,
			/ser([btv]a|vi)/,
			/ter([gnsŧ]a|(m|pr)e|mi)/,
			/ŧerta/,
			/uer[cn]a/,
			/ver([gns]a|[ks]ia|xe)/,
			/xer(ma|[sŧ]i)/,

			/estra/,
			/^[flnrst]?esta/,
			/[un]estra/,
			/deste/,
			/uestu/,
			/vesti/,

			/pleta/,
			/xle[pv]a/,

			/krea/,
			/bre(ga|via|fe)/,
			/greva/,
			/krepa/,
			/pre([gsŧ]a|mia|de)/,
			/tre(bia|pi)/,
			/[gp]re[sŧ]ia/,


			/^o([cjɉkpstx]a|[kp]e|bl[ei])/,
			/o(([bcdfgñ]|[dlmnsv]i)a|fri|ku)/,
			/[dn]oa/,
			/poe/,
			/bo([rsŧ]a|[ksŧv]o)/,
			/co[kpt]a/,
			/do([lmprstx]a|[lmp]e)/,
			/đo[gtv]a/,
			/fo([jɉlrst]a|i|go)/,
			/go([mrtx]a|de|mi)/,
			/io([klt]a|ŧi)/,
			/[jɉ]o[kt]a/,
			/ko([krstŧx]a|pia|[dt]e|[gkmt]o)/,
			/lo([jɉkmpstŧvx]a|[gx]o)/,
			/mo([jɉklstŧ]a|nia|xe|ri|[kl]o|du)/,
			/no([jɉklstv]a|vra|me|dri)/,
			/ñoko/,
			/po([đjɉltx]a|[ds]e|xi|[kpv]o)/,
			/ro([kl]a|[vx]e|[df]o)/,
			/so([jɉmrt]a|nia)/,
			/to([lpsŧ]a|[ls]e|ko)/,
			/ŧo[lt]a/,
			/vo([jɉk]a|le|mi)/,
			/xo[gklrstv]a/,

			/^olsa/,
			/^kol[gt]a/,
			/vol([đtx]a|to)/,

			/^or[bđsx]a/,
			/borña/,
			/peota/,
			/bao[kx]a/,
			/dormi/,
			/for[fstŧ]a/,
			/kor([dđnstŧx]a|po)/,
			/mor([bsŧ]a|[kf]ia|se|[gm]o)/,
			/norba/,
			/porta/,
			/tor([ct]a|[kx]ia)/,
			/vor[sŧ]ia/,
			/xor[bt]a/,

			/os(tia|tre|pi)/,
			/[mpt]osta/,
			/[ijɉ]ostra/,
			/noste/,
			/sosta/,

			/sco[kp]a/,

			/siope/,

			/bloka/,
			/flosa/,
			/glo(ria|me|bo)/,

			/groa/,
			/bro([dgjɉx]a|de|[dk]o)/,
			/fro[dñx]a/,
			/grosa/,
			/kro([kls]a|ko)/,
			/pro([nt]a|pia|[dv]e|spe|di|vo)/,
			/tro([clñstŧx]a|le|to)/
		];
		//note: only /^(re)?xeta/ is a true positive, so /xeta/ is used in 'infixes' and /[aun]xeta/ here
		var falsePositives = [/^(inca|des|[pr]o|sco)?peta/, /[aun]xeta/, /^[pv]ela/, /^(re)?poxa/];

		return function(themeT4, syllabationT4, idx){
			idx = syllabationT4.getSyllabeIndex(idx);
			return (StringHelper.isMatching(Word.suppressStress(syllabationT4.syllabes[idx] + syllabationT4.syllabes[idx + 1]), infixes)
				&& !StringHelper.isMatching(themeT4, falsePositives));
		};
	})();


	return {
		generate: generate,
		generateRegularThemes: generateRegularThemes,
		generateIrregularThemes: generateIrregularThemes
	};

});
