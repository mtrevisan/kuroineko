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
			themeT6: themeT2.replace(/u?é$/, 'ú').replace(/asolvú/, 'asol(v)ú'),
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
				var themeX8 = t.themeT3.replace(/v?e$/, ''),
					themeX8subj = t.themeT8.replace(/v?$/, 'pi');

				//erase phonologically unacceptable themes
				t.themeT8 = undefined;
				t.themeT9 = undefined;
				t.themeT10 = undefined;

				return {
					themeT8: themeX8,
					themeT9: themeX8,
					themeT10: themeX8,

					subjunctive: {
						themeT5: t.themeT5.replace(/v?é$/, 'piè'),
						themeT8: themeX8subj,
						themeT12: t.themeT12.replace(/v?$/, 'pi')
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
					themeT4: t.themeT4.replace(/d?e$/, ''),
					themeT10: t.themeT3.replace(/d?e$/, 'le'),

					subjunctive: {
						themeT5: undefined
					}
				};
			},

			toler: function(t){
				return {
					themeT1: t.themeT1.replace(/to[lƚ]é$/, 'tò'),
					themeT4: t.themeT4.replace(/[lƚ]e$/, ''),

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
				var themeX6 = t.themeT6.replace(/[lƚ]ú$/, 'sú');

				return {
					themeT4: t.themeT4.replace(/[lƚ]e$/, ''),
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
			{matcher: /(fr|[lƚ])auda$/, replacement: '$1àuda'},
			{matcher: /([lƚ])aurea$/, replacement: '$1àurea'},
			{matcher: /naufraga$/, replacement: 'nàufraga'},
			{matcher: /nauxea$/, replacement: 'nàuxea'},
			{matcher: /paupera$/, replacement: 'pàupera'},
			{matcher: /(in|re)staura$/, replacement: '$1stàura'},

			{matcher: /([psŧv])io([lƚ])a$/, replacement: '$1ío$2a'},
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
		var stressIndices = [
			/^(aé|abdikà|abità|abrogà|aerà|a[lr]borà|alt[ae]rà|anemà|ankorà|ansimà|aplikà|a[lr]bitrà|arpegà|arxarà|ar[dđx]e[nr]à|ar[dđx]i[nñ]à|augurà|auspikà|autorà|axità|a[sŧ]idà|edukà|emu[lƚ]à|[ae]rpegà|evokà|exekrà|exità|exu[lƚ]à|ibridà|inplikà|inputà|inrità|insu[lƚ]à|integrà|in[sŧ]ità|irità|it[ae]rà|ixo[lƚ]à|obl[ei]gà|oke[lƚ]à|okupà|ondu[lƚ]à|onfegà|onto[lƚ]à|op[ae]rà|orbegà|ordenà|ospità|ostregà|uke[lƚ]à|ultimà|u[lƚ]u[lƚ]à|ustegà|uño[lƚ]à)$/,
			/^(ba[gt]o[lƚ]à|ba[lƚ]egà|balsamà|barikà|bearà|beko[lƚ]à|betegà|bev[ae]rà|beà|bindo[lƚ]à|bisko[lƚ]à|bixegà|bolsegà|bo[sŧ]o[lƚ]à|bu[lƚ][ei]gà|bux[ae]rà|cac[ae]rà|c[ae]ko[lƚ]à|ce[lƚ][ae]rà|cetarà|cico[lƚ]à|cipegà|de[dlƚn]egà|deputà|desputà|destenà|dexinà|de[sŧ]i[mp]à|dindo[lƚ]à|disipà|domenà|dop[ae]rà|dubità|dulkorà|fabregà|femenà|fod[ae]rà|folgorà|formo[lƚ]à|fornegà|fulm[ei]nà|fu[mr]egà|fustegà|fuxo[lƚ]à|godegà|gomità|gon[dg]o[lƚ]à|guà|[jɉ]o[sŧ]o[lƚ]à|kaba[lƚ]à|kadukà|ka[lƚ]ibrà|ka[lƚ]igà|kalkarà|kalko[lƚ]à|kandidà|kanforà|kapità|karo[lƚ]à|kasegà|kastigà|kauxà|ko[gk]o[lƚ]à|ko[lƚ]egà|komodà|konfutà|koniugà|konplegà|konplikà|koà|kosp[ae]rà|kumu[lƚ]à|ku[fsŧ]o[lƚ]à|[lƚ]agremà|[lƚ]apidà|[lƚ]audà|[lƚ]aureà|[lƚ]et[ae]rà|[lƚ]exenà|[lƚ]ib[ae]rà|[lƚ]ikuidà|[lƚ]imegà|[lƚ]imità|[lƚ]isegà|[lƚ]itigà|[lƚ]ogorà|makinà|malgamà|malmenà|manedà|mante[dđgkx]à|man[sŧ]ipà|marxinà|maskabà|mask[ae]rà|m[ae]stegà|max[ae]rà|maxe[gn]à|ma[sŧ]ipà|medegà|m[ae]r[ei]tà|mi[lƚ]ità|mitigà|modu[lƚ]à|mo[km]o[lƚ]à|montegà|morbinà|mormo[lƚr]à|morsegà|mu[cd]arà|mutegà|muti[lƚ]à|m[ou]xegà|muxo[lƚ]à|muà|muñegà|nanarà|naufragà|nauxeà|n[ae]vegà|ninegà|nino[lƚ]à|nià|nodrigà|nomenà|noà|nuvo[lƚ]à|pacarà|palpi[ae]rà|pante[dđx]à|pa[cp]o[lƚ]à|pasko[lƚ]à|patinà|pauxà|pendo[lƚ]à|penetrà|pe[np]o[lƚ]à|p[ae]rmutà|p[ae]rorà|p[ae]rpetrà|pe[rs]tegà|pesto[lƚ]à|petenà|peto[lƚ]à|pev[ae]rà|pià|piko[lƚ]à|pindo[lƚ]à|pio[lƚ]à|pispo[lƚ]à|pixo[lƚ]à|pi[sŧ]egà|pi[rsŧ]o[lƚ]à|pomegà|ponto[lƚ]à|po[pv]o[lƚ]à|poé|publegà|rako[lƚ]à|ran[pt]egà|ranto[lƚ]à|ra[dp]egà|redità|re[cfg]o[lƚ]à|regonà|reklutà|re[lƚn]egà|replegà|replikà|reputà|revokà|rexe[gk]à|re[sŧ]ità|rixegà|ri[gsŧ]o[lƚ]à|rodo[lƚ]à|roegà|ronko[lƚ]à|ron[sŧ]egà|ro[pvx]egà|roà|rubregà|rugo[lƚ]à|rumegà|ruminà|ruà|sabo[lƚ]à|sagomà|sangonà|sanguenà|saé|sedo[lƚ]à|segregà|seguità|seità|semenà|se[ms]o[lƚ]à|sevità|sibi[lƚ]à|sifo[lƚ]à|sim[ou][lƚ]à|sind[ai]kà|sinkopà|si[sx]o[lƚ]à|sià|sofegà|solfarà|sup[ae]rà|suplegà|surogà|susità|suà|tabu[lƚ]à|tako[lƚ]à|tanbarà|tardigà|teà|tenp[ae]rà|t[ae]rm[ei]nà|tinpanà|titubà|to[lƚ][ae]rà|ton[bf]o[lƚ]à|torigà|torko[lƚ]à|tosegà|turbinà|tuà|[sŧ]eko[lƚ]à|[sŧ]e[lƚ][ae]rà|va[lƚ]idà|va[lƚ]utà|vedovà|vendegà|v[ae]rgo[lƚ]à|vexetà|ve[jɉ]età|videgà|vidimà|vinko[lƚ]à|vio[lƚ]à|vixi[lƚt]à|volto[lƚ]à|vomità|vuln[ae]rà|xao[lƚ]à|xemenà|xudegà|xufo[lƚ]à|ñao[lƚ]à|ñiño[lƚ]à|ñoko[lƚ]à|[dđx]en[ae]rà|[dđx][ou]go[lƚ]à|[sŧ]a[kp]o[lƚ]à|[sŧ]apegà|[sŧ]e[lƚ]ebrà|[sŧ]i[fgkm]?o[lƚ]à|[sŧ]imegà|[sŧ]irko[lƚ]à|[sŧ]oko[lƚ]à|[sŧ]o[pt]egà|[sŧ]ukarà|[sŧ]upegà|[jɉ]o[sŧ]o[lƚ]à|[jɉ]ubi[lƚ]à|[jɉ]ugu[lƚ]à)$/,
			/^(reaé|abi[lƚ]ità|a[lƚ]eà|amutinà|apokopà|apostrofà|asid[ae]rà|axevo[lƚ]à|axeà|a[sŧ]e[lƚ][ae]rà|inaugurà|biaxemà|blat[ae]rà|brago[lƚ]à|bramegà|bra[sŧ]o[lƚ]à|broko[lƚ]à|bron[bdt]o[lƚ]à|broà|bru[lƚ]egà|brusketà|bruskinà|brusto[lƚ]à|dia[lƚ]ogà|edifegà|e[lƚ]iminà|epi[lƚ]ogà|eradegà|examenà|exasp[ae]rà|exautorà|exa[jɉ][ae]rà|ex[ae]r[sŧ]ità|exon[ae]rà|fievarà|fio[sŧ]inà|frapo[lƚ]à|fraudà|frego[lƚ]à|fritegà|frito[lƚ]à|fruà|fruño[lƚ]à|globo[lƚ]à|glutinà|gramo[lƚ]à|grandenà|greto[lƚ]à|grongo[lƚ]à|gruà|i[lƚ]uminà|imaxinà|inalb[eo]rà|inamidà|inarpe[dđx]à|inar[dđx][ae]rà|inaxo[lƚ]à|ina[sŧ]idà|inedukà|inoku[lƚ]à|iri[sŧ]o[lƚ]à|koabità|koordenà|kre[kp]o[lƚ]à|krexemà|kreà|kriko[lƚ]à|kritegà|krià|kroko[lƚ]à|krostenà|krosto[lƚ]à|kroà|omo[lƚ]ogà|o[rs]ixenà|otenp[ae]rà|piato[lƚ]à|platinà|prategà|predegà|prià|prod[ei]gà|prorogà|prosimà|prosp[ae]rà|provokà|proà|reanemà|reintegrà|reit[ae]rà|scikarà|sfode[gr]à|sfogonà|sfo[jɉ]o[lƚ]à|sforbe[dđx]à|sfulminà|sfumegà|sfuregà|siop[ae]rà|skalmanà|skalpo[lƚ]à|skanpanà|skap?o[lƚ]à|skarpe[dđx]à|skasegà|skito[lƚ]à|skodegà|skoo[lƚ]à|skorporà|skortegà|sko[tv]o[lƚ]à|skoà|spacarà|spanpanà|spantegà|spa[pt]o[lƚ]à|spaxemà|speku[lƚ]à|spe[lƚ]egà|sp[ae]rtegà|spetenà|speto[lƚr]à|speà|spe[sŧ]egà|spif[ae]rà|spigo[lƚ]à|spinfarà|spi[ps]?o[lƚ]à|spià|spirità|spi[sŧ]egà|spolv[ae]rà|spontegà|spo[pv]o[lƚ]à|spu[lƚ]egà|spuntigà|spuà|stangonà|stenp[ae]rà|st[ae]rm[ei]nà|stipu[lƚ]à|stomegà|stusegà|stuà|stu[sŧ]egà|trafegà|tranxità|trapo[lƚ]à|tremo[lƚ]à|tri[bdk]o[lƚ]à|troto[lƚ]à|tru[sŧ]idà|xbaf[ae]rà|xbanpo[lƚ]à|xbaporà|xbato[lƚ]à|xba[sŧ]egà|xbe[rt]egà|xbe[sŧ]o[lƚ]à|xbin?go[lƚ]à|xbixegà|xboko[lƚ]à|xbo[ln]segà|xbolsonà|xbo[st]egà|xboxemà|xboà|xbuxo[lƚ]à|xdentegà|xdindo[lƚ]à|xganbarà|xgang[ae]rà|xga[xñ]o[lƚ]à|xlanegà|xli[mpsŧ]egà|xluxegà|xma[fn]arà|xmalmenà|xmas[ae]rà|xmask[ae]rà|xmego[lƚ]à|xmemorà|xmentegà|xmeo[lƚ]à|xm[ae]rgo[lƚ]à|xmoko[lƚ]à|xmontegà|xmorgo[lƚ]à|xmuxegà|xnanarà|xnonbo[lƚ]à|xnuà|xrego[lƚ]à|xvanpo[lƚ]à|xvaporà|xvento[lƚ]à|xv[ae]rgo[lƚ]à|xveto[lƚ]à|xvimenà|xvià|xvolto[lƚ]à|xñao[lƚ]à|xñoko[lƚ]à|x[jɉ]edo[lƚ]à|x[jɉ]o[sŧ]o[lƚ]à)$/,
			/^(anti[sŧ]ipà|arfià|artiko[lƚ]à|ba[lƚ]uxenà|bix[ei]go[lƚ]à|bonifegà|borondo[lƚ]à|dekapità|de[lƚ]apidà|de[lƚ]ib[ae]rà|depoxità|desemenà|desif[ae]rà|desimi[lƚ]à|det[ae]rminà|devià|dexabità|dexalborà|dexanemà|dexautorà|dexid[ae]rà|dexordenà|de[sŧ]ako[lƚ]à|domestegà|ekuivokà|enfià|eskorporà|espetorà|est[ae]rminà|fad[ei]gà|fe[lƚ]i[sŧ]ità|fi[lƚ]oxofà|fo[lƚ]iskarà|idroxenà|inbago[lƚ]à|inba[lƚ]egà|inbals[ae]mà|inbanbo[lƚ]à|inbav[ae]rà|inbearà|inbev[ae]rà|inboko[lƚ]à|inbolsamà|inbonbegà|inbovo[lƚ]à|inboxemà|inb[ou][sŧ]o[lƚ]à|inbux[ae]rà|indafarà|indasenà|ind[eu]bità|indoà|infa[sŧ]o[lƚ]à|inf[ae]rvorà|infistegà|infià|infogonà|infoibà|infumegà|infuxo[lƚ]à|inganb[ae]rà|ingato[lƚ]à|ingurxità|inguà|inkaba[lƚ]à|inkanevà|inkankarà|inkaro[lƚ]à|inkatigà|inko[dlƚ]egà|inkogo[lƚ]à|inkomodà|inkonko[lƚ]à|inkorporà|inkotegà|inkoto[lƚ]à|inku[sŧ]o[lƚ]à|inleà|inluminà|inmanegà|inmask[ae]rà|inmaxarà|inmucarà|inpaco[lƚ]à|inpatinà|inp[ae]v[ae]rà|inpià|inpe[gnt]o[lƚ]à|inpi[crsŧ]o[lƚ]à|inpolv[ae]rà|inpomo[lƚ]à|inrodo[lƚ]à|insako[lƚ]à|insangonà|insanguenà|insemo[lƚ]à|inseà|insolfarà|inso[sŧ]o[lƚ]à|intanbarà|intardegà|intardigà|intavo[lƚ]à|inte[lƚ][ae]rà|intenp[ae]rà|int[ae]rogà|int[ae]rpretà|intito[lƚ]à|intor[kg]o[lƚ]à|intosegà|inva[lƚ]idà|inv[ae]rgo[lƚ]à|investigà|invià|involto[lƚ]à|inxako[lƚ]à|inx[ae]regà|in[đx]en[ae]rà|in[sŧ]ako[lƚ]à|in[sŧ]ango[lƚ]à|in[sŧ][ae]regà|in[sŧ]ukarà|in[jɉ]emarà|iske[lƚ]etrà|ispaxemà|ispeà|ispirità|istuà|kapito[lƚ]à|karako[lƚ]à|kata[lƚ]ogà|katastegà|ko[jɉ]onb[ae]rà|komunegà|[lƚ]emoxinà|[lƚ]exitimà|ma[lƚ]augurà|manipo[lƚ]à|marangonà|mañifegà|notifegà|oblit[ae]rà|pa[lƚ]ifegà|parafraxà|paxifegà|p[ae]rifraxà|p[ae]riodà|pete[dđgx]o[lƚ]à|preokupà|purifegà|ratifegà|rebeko[lƚ]à|rebondo[lƚ]à|regurxità|rekal[sŧ]itrà|rekapità|rekup[ae]rà|rem[ae]rità|repo[pv]o[lƚ]à|resemenà|resusità|revolto[lƚ]à|romanxinà|rovi[jɉ]o[lƚ]à|sfiamegà|sfraxenà|sfrego[lƚ]à|sfritegà|sfri[dđx]egà|skuakuarà|skre[kpsŧ]o[lƚ]à|skri[ksŧ]o[lƚ]à|skro[fk]?o[lƚ]à|skroità|sofistegà|so[lƚ]e[sŧ]ità|strako[lƚ]à|strango[lƚ]à|strapegà|strepità|striko[lƚ]à|strià|stro[lƚ]egà|struko[lƚ]à|subordenà|suseguità|te[lƚ]efonà|v[ae]rifegà|v[ae]rigo[lƚ]à|vinifegà|xbiaxemà|xbraità|xbraso[lƚ]à|xbra[sŧ]o[lƚ]à|xbrefe[lƚ]à|xbrind[eo][lƚ]à|xbri[sŧ]o[lƚ]à|xbrodegà|xbrodo[lƚ]à|xbronko[lƚ]à|xdrumenà|xgramo[lƚ]à|xgrendenà|xgreto[lƚ]à|xgri[sŧ]o[lƚ]à|xgron[gsŧ]o[lƚ]à|xguindo[lƚ]à|xirando[lƚ]à|xmiao[lƚ]à|[dđx][ou]gato[lƚ]à|[jɉ]e[glƚ]omarà|)$/,
			/^(anplifegà|defraudà|desfabr(eg|ik)à|desfogonà|deskankarà|deskapità|deskavedà|deskodegà|deskomodà|despe[nt]o[lƚ]à|despetenà|despetorà|desp[ei]go[lƚ]à|despolv[ae]rà|destego[lƚ]à|destenp[ae]rà|dest[ae]rminà|destoko[lƚ]à|destuà|dexba[fv][ae]rà|dexbingo[lƚ]à|dexboxemà|dexbo[sŧ]o[lƚ]à|dexbu[sx]o[lƚ]à|dexdà|dexganbarà|dexlanegà|dexmanegà|dexmaskarà|dexm[eo]ntegà|dexmestegà|dexmunegà|dexnaxo[lƚ]à|dexnià|dexnonbo[lƚ]à|dexn[ou]à|dexri[sŧ]o[lƚ]à|dexv[ae]rxenà|dexvià|dol[sŧ]ifegà|sfad[ei]gà|falsifegà|farnetikà|farnetegà|formigo[lƚ]à|fortifegà|inaxeà|inbra[sŧ]o[lƚ]à|infrapo[lƚ]à|ingravidà|inkrosto[lƚ]à|inkro[sŧ]o[lƚ]à|inprià|inskato[lƚ]à|inske[lƚ]etrà|inspaxemà|inspeà|inspirità|instaurà|intrapo[lƚ]à|introità|kalki[dđx]o[lƚ]à|klasifegà|konpanegà|konpenetrà|konsid[ae]rà|kontaminà|moltiplegà|mortifegà|parte[sŧ]ipà|p[ae]rmudarà|p[ae]rseguità|piovexinà|posti[sŧ]ipà|predestenà|predomenà|presostatà|prexudegà|profumegà|pronostegà|regroà|represtinà|respexo[lƚ]à|restaurà|rin[đx]ovenà|sakrifegà|scarifegà|skomunegà|spe[sŧ]ifegà|stenografà|straordenà|tartufo[lƚ]à|tramudarà|xbixigo[lƚ]à|xbonigo[lƚ]à|xgarofo[lƚ]à)$/,
			/^(skonpa[jɉ]inà|strasaé|barafuxo[lƚ]à|desfrego[lƚ]à|destr[ei]go[lƚ]à|dexabi[lƚ]ità|dexbramegà|dexbraxo[lƚ]à|dexgr[ae]ndenà|identifegà|inv[ae]rigo[lƚ]à|inxeñato[lƚ]à|konglom[ae]rà|kongratu[lƚ]à|kuantifegà|rekapito[lƚ]à|rinprov[ae]rà|senplifegà|skarnifegà|skonbuso[lƚ]à|skonpaxenà|sprexudegà|stra[ns]uà|straseko[lƚ]à|xbarbato[lƚ]à|[sŧ]entrifugà)$/,
			/^(dexbonigo[lƚ]à|dexinfià|dexintosegà|informigo[lƚ]à|inkantexemà|konpanadegà|reinprov[ae]rà|rekonsid[ae]rà|skrimiato[lƚ]à)$/,
			/^(inkat[ao]rigo[lƚ]à|[sŧ]irkumnavegà|despropoxità)$/,
			/^dexlonbrià$/
		];

		return function(themeT1, syllabationT4){
			var themeVowel = themeT1[themeT1.length - 1],
				idx = -1;
			//all but second conjugation parossitone (which does not need to backtrack stress)
			if(themeVowel != 'e' && !stressIndices.some(function(re, i){ idx = i; return !!this.match(re); }, themeT1))
				//note: about 83.8% of the verbs have the stress on the penultimate syllabe
				idx = syllabationT4.getGlobalIndexOfStressedSyllabe(syllabationT4.syllabes.length > 1 && !this.verb.irregularity.darStarFar? -2: -1);
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
			/^e([flƚ]a|xe|xi|du)/,
			/ae[lƚ]a/,
			/[lƚp]ea/,
			/^re([dglƚs]a|xe|go)/,
			/xrego/,
			/be([fglƚ]a|re|ko)/,
			/ce([fklƚrst]a|[lƚ]e|ko)/,
			/de([lƚt]a|[bsŧ]i|[dlƚ]e)/,
			/đe[lƚ]a/,
			/fe([rst]a|tu)/,
			/ie[đgtx]a/,
			/[jɉ]e[lƚt]a/,
			/ke(ga|[lƚ]e)/,
			/[lƚ]e([fv]a|via|gua|xe|[sŧ]i|fo)/,
			/me([lƚr]a|dia|[dr]e|ri)/,
			/ne([glƚr]a|bia|du|t[ei])/,
			/pe([cklƚrt]a|te|po|[kt]u)/,
			/re([dsŧ]i|pli|[lƚ]e|klu)/,
			/se([dlƚrs]a|dia|re|v?i|gui|ko|tu)/,
			/^te([glƚr]a|dia|[lƚ]e|[sŧ]i|ro|nu)/,
			/ŧe([flƚ]a|[lƚr]e|ko|tu)/,
			/ve([clƚ]a|ria)/,
			/xe([lƚt]a|[mr]e|gui)/,

			/[ae]r([st]a|pe)/,
			/b[ae]r[gl]a/,
			/f[ae]rvo/,
			/[jɉ][ae]rma/,
			/k[ae]r[msŧ]a/,
			/[dlƚ][ae]rna/,
			/m[ae]r([dkl]a|[sŧ]ia)/,
			/n[ae]r[bv]a/,
			/p[ae]r(la|[pt]e|mu)/,
			/s[ae]r([btv]a|vi)/,
			/t[ae]r([gnsŧ]a|(m|pr)e|mi)/,
			/ŧ[ae]rt?a/,
			/ue(([flƚ]|r[cn]?)a|stu)/,
			/v[ae]r([gns]a|[ks]ia|[dx]e)/,
			/x[ae]r(ma|[sŧ]i)/,

			/estra/,
			/^[flƚnrst]?esta/,
			/[un]estra/,
			/deste/,
			/vesti/,

			/[lƚ]ieva/,
			/mie[lƚ]a/,
			/[pt]i[ae]ra/,
			/pleta/,
			/xle[pv]a/,

			/krea/,
			/bre(ga|via|fe)/,
			/dre[lƚ]a/,
			/greva/,
			/krepa/,
			/pre([gsŧ]a|mia|de)/,
			/tre(bia|pi)/,
			/[gp]re[sŧ]ia/,


			/^o([cjɉkpstx]a|[kp]e|bl[ei])/,
			/o(([bcdfgñ]|[dlƚmnsv]i)a|fri|ku)/,
			/[dn]oa/,
			/poe/,
			/bo([rsŧ]a|[ksŧv]o)/,
			/co[kpt]a/,
			/do([lƚmprstx]a|[lƚmp]e)/,
			/đo[gtv]a/,
			/fo([jɉlƚrst]a|i|go)/,
			/go([mrtx]a|de|mi)/,
			/io([klƚt]a|ŧi)/,
			/[jɉ]o[kt]a/,
			/ko([krstŧx]a|pia|[dt]e|[gkmt]o)/,
			/[lƚ]o([jɉkmpstŧvx]a|[gx]o)/,
			/mo([jɉklƚstŧ]a|nia|xe|ri|[klƚ]o|du)/,
			/no([jɉklƚstv]a|vra|me|dri)/,
			/ñoko/,
			/po([đjɉlƚtx]a|[ds]e|xi|[kpv]o)/,
			/ro([klƚ]a|[vx]e|[df]o)/,
			/so([jɉmrt]a|nia)/,
			/to([lƚpsŧ]a|[lƚs]e|ko)/,
			/ŧo[lƚt]a/,
			/vo([jɉk]a|[lƚ]e|mi)/,
			/xo[gklƚrstv]a/,

			/^olsa/,
			/^kol[gt]a/,
			/vol([đtx]a|to)/,

			/^or[bđsx]a/,
			/borña/,
			/bao[kx]a/,
			/peota/,
			/dormi/,
			/for[fstŧ]a/,
			/kor([dđnstŧx]a|po)/,
			/mor([bsŧ]a|[kf]ia|se|[gm]o)/,
			/norba/,
			/porta/,
			/tor([ct]a|[kx]ia)/,
			/vor[sŧ]ia/,
			/xor[bt]a/,

			/os(tia|tre|p[ei])/,
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
			/kro([klƚs]a|i|k?o)/,
			/pro([nt]a|pia|[dv]e|spe|di|vo)/,
			/tro([clƚñstŧx]a|[lƚ]e|to)/
		];
		//note: only /^(re)?xeta/ is a true positive, so /xeta/ is used in 'infixes' and /[aun]xeta/ here
		var falsePositives = [/^(inca|des|[pr]o|sco)?peta/, /[aun]xeta/, /^[pv]e[lƚ]a/, /^(re)?poxa/];

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
