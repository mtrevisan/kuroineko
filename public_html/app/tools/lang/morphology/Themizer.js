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
		var hyphenator = new Hyphenator('-', pattern_vec);

		return function(themeT4){
			//infer stress position
			var m;
			if(trueHyatuses.some(function(el){ m = el; return this.match(el.matcher); }, themeT4))
				themeT4 = themeT4.replace(m.matcher, m.replacement);

			var hyphenatedWord = hyphenator.hyphenate(themeT4);
			return hyphenator.attachFunctions(hyphenatedWord);
		};
	})();

	/** @private */
	var getIndexOfStressThemeT3 = (function(){
		//note for latin: bisyllabe and trisyllabe with long penultimate syllabe > parossitone, trisyllabe with short penultimate syllabe > proparossitone
		//short vowel + CC(C) > long by position, but short vowel + occlusive + r > short (stress tend to backtrack, as in ÍNTĔGRUM > íntegro)
		var suffixes = [
			/([nrv]e|du)$/, /ib$/, /of$/,

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
		];

		return function(themeT1, syllabationT4){
			var themeVowel = themeT1[themeT1.length - 1],
				idx = -1;
			//all but second conjugation parossitone (which does not need to backtrack stress)
			if(themeVowel != 'e'){
				var sylIdx = -1;
				//note: about 83.8% of the verbs have the stress on the penultimate syllabe
				if(syllabationT4.length > 1 && !this.verb.irregularity.darStarFar)
					sylIdx --;
				//note: only for verbs of the first conjugation which have an open penultimate syllabe
				if(syllabationT4.length > 2 && themeVowel == 'à' && Syllabe.isSyllabeOpen(syllabationT4.getAt(-2))
						&& StringHelper.isMatching(themeT1.replace(/.$/, ''), suffixes))
					sylIdx --;
				if(syllabationT4.length == 1 && themeT1.match(/^[rt]uà$/))
					return 1;

				return syllabationT4.getGlobalIndexOfStressedSyllabe(sylIdx)
					- (syllabationT4.getAt(sylIdx).match(/(^|[^aeiouàèéíòóú])àu/)? 1: 0);
			}
			return idx;
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
			return (StringHelper.isMatching(Word.suppressStress(syllabationT4[idx] + syllabationT4[idx + 1]), infixes)
				&& !StringHelper.isMatching(themeT4, falsePositives));
		};
	})();


	return {
		generate: generate,
		generateRegularThemes: generateRegularThemes,
		generateIrregularThemes: generateIrregularThemes
	};

});
