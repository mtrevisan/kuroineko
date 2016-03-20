/**
 * @class Verb
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/phonology/Word', 'tools/data/StringHelper', 'tools/data/Assert', 'tools/lang/phonology/Hyphenator', 'tools/lang/phonology/hyphenatorPatterns/vec'], function(Word, StringHelper, Assert, Hyphenator, pattern_vec){

	var hyphenator = new Hyphenator('-', pattern_vec);

	var Constructor = function(infinitive){
		if(!Word.isStressed(infinitive))
			infinitive = Word.markDefaultStress(infinitive);

		//get pro-complementar pronouns
		var proComplementarPronouns = infinitive.match(/([gs]e)?(l[ae]|ne)?$/).filter(function(el){ return el; });
		if(proComplementarPronouns.length){
			//remove pro-complementar pronouns
			infinitive = infinitive.substr(0, infinitive.length - proComplementarPronouns[0].length);
			proComplementarPronouns.shift();
		}
		else
			//remove last 'e' of a non-pro-complementar verb
			infinitive = infinitive.replace(/re$/, 'r');

		//restore stress on thematic vowel if there is none
		var noStress = (Word.getIndexOfStress(infinitive) < 0);
		if(noStress)
			infinitive = StringHelper.setCharacterAt(infinitive, infinitive.length - 2, Word.addStressAcute);

		//convert '-ar into '-er
		if(infinitive.match(/([àèéíòóú][^aeiou]*a)r$/))
			infinitive = infinitive.replace(/ar$/, 'er');


		var themeVowel = infinitive[infinitive.length - 2],
			syllabation = hyphenator.hyphenate(infinitive);
		syllabation = hyphenator.attachFunctions(syllabation);

		checkForErrors(infinitive, syllabation);

		var alternatives = checkForAlternatives(infinitive, proComplementarPronouns, noStress, themeVowel, syllabation);

		var conjugation = 'aei'.indexOf(Word.suppressStress(themeVowel)) + 1,
			rhizotonic = (themeVowel == 'e'),
			special3rd = (conjugation == 3 && isSpecial3rd(infinitive)),
			semiSpecial3rd = (special3rd && isSemiSpecial3rd(infinitive));

		var irregularity = getIrregularity(infinitive);


		return {
			infinitive: infinitive,
			alternatives: alternatives,

			proComplementarPronouns: proComplementarPronouns,

			conjugation: conjugation,
			rhizotonic: rhizotonic,
			special3rd: special3rd,
			semiSpecial3rd: semiSpecial3rd,
			irregularity: irregularity,
			irregular: !!irregularity.verb,
			withoutImperative: (irregularity && irregularity.poder)
		};
	};

	/** @private */
	var checkForErrors = function(infinitive, syllabation){
		Assert.assert(infinitive.match(/^([aàbcdđeèéfgiíjɉklƚmnñoòóprsʃtŧuúvxʒ]|[djlnstx]h)+$/), 'NOT_ALFABETIC');

		//NOTE: [^aeio]*e would be erroneous because it wouldn't consider the eterophonic sequence /ier$/.
		Assert.assert(infinitive.match(/([àèéí]|[àèéíòóú][^aeo]*e)r$/), 'NOT_A_VERB_INFINITIVE');

		var m = infinitive.match(/[àèéíòóú]/g);
		Assert.assert(m, 'NOT_STRESSABLE');
		Assert.assert(m.length <= 1, 'TOO_MUCH_STRESSES');

		Assert.assert(!syllabation.hasSyllabationErrors(), 'NOT_SYLLABABLE');
	};

	/** @private */
	var checkForAlternatives = (function(){
		var data = [
			{matcher: /^(.*d)[eo]vér$/, replacement: '$1éver'},
			{matcher: /^(.*)[ao]ldír$/, replacement: '$1òlder'},
			{matcher: /^(.*d)(í|ixé)r$/, replacement: '$1íxer'},
			{matcher: /^(trà)r$/, replacement: '$1er'},
			{matcher: /^(.*dú)r$/, replacement: '$1xer'},
			{matcher: /^(.*)([èé]ne|e[nñ]é)r$/, replacement: '$1èñer'},
			{matcher: /^(.*p)ór$/, replacement: '$1onér'},
			{matcher: /^(.*t)ór$/, replacement: '$1olér'},
			{matcher: /^(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?fàr$/, replacement: '$1fàŧer'},
			{matcher: /^(po)dér$/, replacement: '$1sér'}
		];

		return function(infinitive, proComplementarPronouns, noStress, themeVowel, syllabation){
			var m, alternatives;
			if(data.some(function(el){ m = el; return this.match(el.matcher); }, infinitive))
				alternatives = [infinitive.replace(m.matcher, m.replacement) + proComplementarPronouns.join('')];
			else if(noStress && themeVowel == 'é' && syllabation.length > 1 && !isOssitone(infinitive)){
				var infinitiveNoStress = Word.suppressStress(infinitive),
					idxOfStress = syllabation.getGlobalIndexOfStressedSyllabe(-2);
				alternatives = [StringHelper.setCharacterAt(infinitiveNoStress, idxOfStress, Word.addStressAcute)];
				if(infinitiveNoStress[idxOfStress].match(/[eo]/))
					alternatives.push(StringHelper.setCharacterAt(infinitiveNoStress, idxOfStress, Word.addStressGrave));
			}
			return alternatives;
		};
	})();

	/** @private */
	var getIrregularity = (function(){
		var data = {
			andar: /^(r[ei])?andàr$/,
			darStarFar: /^((r[ei])?dàr|(mal|move|soto)?stàr|(kon(tra)?|likue|putre|rare|r[ei]|sora|stra|stupe|tore|tume)?fàr)$/,
			aver: /(^g?a|reg?a|‘)vér$/,
			dever: /déver$/,
			eser: /(^|r[ei])èser$/,
			dixer: /díxer$/,
			poder: /podér$/,
			saver: /savér$/,
			traer: /(|as?|des?|es|kon|pro|re|so)?tràer$/,
			enher: /[èé]ñer$/,
			toler: /to[lƚ]ér$/,
			viver: /víver$/,
			voler: /vo[lƚ]ér$/
		};

		return function(infinitive){
			var irregularity = {verb: ''},
				v;
			for(v in data)
				if(infinitive.match(data[v])){
					irregularity[v] = true;
					irregularity.verb = v;
					break;
				}
			return irregularity;
		};
	})();

	/** @private */
	var isOssitone = (function(){
		var ossitones = [/(^|re)avér$/, /manér$/, /parér$/, /podér$/, /savér$/, /[tv]olér$/, /valér$/];

		return function(infinitive){
			return StringHelper.isMatching(infinitive, ossitones);
		};
	})();

	/** @private */
	var isSpecial3rd = (function(){
		var special3rds = [
			/dormír$/,
			/en?sír$/, /entír$/, /eñír$/,
			/guír$/,
			/morír$/,
			//note: n[ou][dt]rír is a "regular" 3rd
			/ofrír$/,
			/sa[lƚ]ír$/, /servír$/,
			/vestír$/
		];
		var falsePositives = [/(inti|mar)morír$/, /censír$/, /xmentír$/, /rguír$/];

		return function(infinitive){
			return !StringHelper.isMatching(infinitive, special3rds, falsePositives);
		};
	})();

	/** @private */
	var isSemiSpecial3rd = (function(){
		var semiSpecial3rds = [/part?ír$/, /sorbír$/, /vertír$/];

		return function(infinitive){
			return StringHelper.isMatching(infinitive, semiSpecial3rds);
		};
	})();


	Constructor.prototype = {
		constructor: Constructor
	};

	return Constructor;

});
