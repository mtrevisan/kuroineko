define(['tools/lang/phonology/Grapheme'], function(Grapheme){
	describe('Grapheme', function(){
		it('grapheme to phone conversion test - eterophonic sequences', function(){
			expect(Grapheme.convertGraphemesIntoPhones('pien')).toBe('pjeŋ̞̟');
			expect(Grapheme.convertGraphemesIntoPhones('kuando')).toBe('kʷwaŋ̞̟d̪o');
			expect(Grapheme.convertGraphemesIntoPhones('kièto')).toBe('k̟jɛt̪o');
		});

		it('grapheme to phone conversion test - hyatus', function(){
			expect(Grapheme.convertGraphemesIntoPhones('úa')).toBe('u' + Grapheme.HYATUS_MARKER + 'a');
			expect(Grapheme.convertGraphemesIntoPhones('leon')).toBe('l̺e' + Grapheme.HYATUS_MARKER + 'oŋ̞̟');
		});

		it('grapheme to phone conversion test - combinatorial variants', function(){
			expect(Grapheme.convertGraphemesIntoPhones('palia')).toBe('pal̻ʲja');
			expect(Grapheme.convertGraphemesIntoPhones('kal')).toBe('kal̻ʲ');
			expect(Grapheme.convertGraphemesIntoPhones('paltan')).toBe('pal̺̝t̪aŋ̞̟');

			expect(Grapheme.convertGraphemesIntoPhones('arma')).toBe('aɹ˞̺ma');
			expect(Grapheme.convertGraphemesIntoPhones('punèr')).toBe('pun̺ɛɹ˞̺');
			expect(Grapheme.convertGraphemesIntoPhones('ara')).toBe('aɽ̠̟a');
			expect(Grapheme.convertGraphemesIntoPhones('ara', 'western')).toBe('ar̺a');
			expect(Grapheme.convertGraphemesIntoPhones('rana')).toBe('ɽ̠̟an̺a');
			expect(Grapheme.convertGraphemesIntoPhones('rana', 'lagunar.coxòto')).toBe('ɾ̺an̺a');

			expect(Grapheme.convertGraphemesIntoPhones('anka')).toBe('aŋ̞̟ka');
		});

		it('grapheme to phone conversion test - single graphemes', function(){
			expect(Grapheme.convertGraphemesIntoPhones('aƚa')).toBe('aʟ˞̟̞a');
			expect(Grapheme.convertGraphemesIntoPhones('aƚa', 'lagunar.coxòto')).toBe('al̺̝a');
			expect(Grapheme.convertGraphemesIntoPhones('alta', 'lagunar.coxòto')).toBe('al̺̝t̪a');
			expect(Grapheme.convertGraphemesIntoPhones('ara', 'lagunar.coxòto')).toBe('aɾ̺a');
			expect(Grapheme.convertGraphemesIntoPhones('aƚa', 'other')).toBe('aʎ˞̞a');

			expect(Grapheme.convertGraphemesIntoPhones('aŧal', 'oriental')).toBe('at͡s̪̠al̻ʲ');
			expect(Grapheme.convertGraphemesIntoPhones('đal', 'oriental')).toBe('d͡z̪̠al̻ʲ');

			expect(Grapheme.convertGraphemesIntoPhones('sana')).toBe('s̠an̺a');
			expect(Grapheme.convertGraphemesIntoPhones('ñaro')).toBe('ɲaɽ̠̟o');
			expect(Grapheme.convertGraphemesIntoPhones('tanto')).toBe('t̪aŋ̞̟t̪o');
		});

		it('phone to grapheme conversion test', function(){
			var list = ['pien', 'kuando', 'kièto', 'kal', 'palia', 'paltan', 'punèr', 'anka', 'ala', 'alta', 'arma', 'aŧal', 'đal', 'paja', 'jaŧo', 'paɉa', 'inɉaŧa', 'ɉaŧo', 'sana', 'ñaro', 'tanto'];
			list.forEach(function(k){
				expect(Grapheme.convertPhonesIntoGraphemes(Grapheme.convertGraphemesIntoPhones(k))).toBe(k);
			});

			expect(Grapheme.convertPhonesIntoGraphemes('ua')).toBe('ua');
			expect(Grapheme.convertPhonesIntoGraphemes('l̺eoŋ̞̟')).toBe('leon');

			expect(Grapheme.convertPhonesIntoGraphemes('aɽ̠̟a')).toBe('ara');
			expect(Grapheme.convertPhonesIntoGraphemes('aɹ˞̠a')).toBe('ara');
			expect(Grapheme.convertPhonesIntoGraphemes('aɾ̺a')).toBe('ara');

			expect(Grapheme.convertPhonesIntoGraphemes('aʟ˞̟̞a')).toBe('aƚa');
			expect(Grapheme.convertPhonesIntoGraphemes('aʎ˞̞a')).toBe('aƚa');
		});
	});
});
