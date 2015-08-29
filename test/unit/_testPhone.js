define(['tools/lang/phonology/Phone', 'tools/lang/GrammarLearner'], function(Phone, GrammarLearner){
	beforeEach(function(){
		this.addMatchers({
			toBeJsonEqual: function(expected){
				var one = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, ''),
					two = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

				return (one === two);
			}
		});
	});

	describe('Phone', function(){
		it('phone conversion test', function(){
			expect(Phone.convertStringIntoFeatures('a')).toBeJsonEqual([
				{syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: -1, tns: 0}
			]);
			expect(Phone.convertStringIntoFeatures('ɢ͡ʁd̪͡z̪')).toBeJsonEqual([
				{ant: 0, app: -1, bk: 1, cg: -1, cnt: -1, con: 1, cor: -1, dor: 1, dr: 1, dst: 0, ft: -1, hi: -1, lab: -1, lat: -1, ld: -1, lo: -1, nas: -1, rou: -1, sg: -1, son: -1, str: 0, syl: -1, tap: -1, tns: 0, trill: -1, voi: 1},
				{ant: 1, app: -1, bk: 0, cg: -1, cnt: -1, con: 1, cor: 1, dor: -1, dr: 1, dst: 1, ft: 0, hi: 0, lab: -1, lat: -1, ld: -1, lo: 0, nas: -1, rou: -1, sg: -1, son: -1, str: 1, syl: -1, tap: -1, tns: 0, trill: -1, voi: 1}
			]);
			expect(Phone.convertFeaturesIntoString(Phone.convertStringIntoFeatures('ɢ͡ʁd̪͡z̪'))).toBe('ɢ͡ʁd̪͡z̪');
			expect(Phone.convertFeaturesIntoRegExString(['a', {con: 1, son: 1, hi: 0}])).toBeJsonEqual('a[mʙɱnrɾlɺɳɻɽɭ]');
		});

		it('convert features into regex', function(){
			expect(Phone.convertFeaturesIntoRegExString(Phone.convertStringIntoFeatures('abcɢ͡ʁd̪͡z̪'))).toBe('abc(?:ɢ͡ʁ)(?:d̪͡z̪)');
			expect(Phone.convertFeaturesIntoRegExString(Phone.convertStringIntoFeatures('[+con]'))).toBe('(?:[pbmɸβʙɱfvntdθðszʃʒrɾɬɮlɫɺɳʈɖʂʐɕʑɻɽɭɲcɟçʝʎŋkɡxɣʟɴqɢχʁʀħʕʔɧC]|k̟͡x̟|ɡ̟͡ɣ̟|d͡ʑ|t͡ɕ|d͡ʒ|d͡z|d͡ɮ|d̠͡ɮ̠|t͡ʃ|t͡ɬ̲|t͡s|t͡ɬ|t̪͡s̪|t̪͡ɬ̪|d̪͡z̪|d̪͡ɮ̪|ʈ͡ʂ|ɖ͡ʐ|p͡f|b͡v|p͡ɸ|b͡β|t̪͡θ|d̪͡ð|c͡ç|ɟ͡ʝ|k͡x|k̠͡x̠|ɡ͡ɣ|ɡ̠͡ɣ̠|q͡χ|ɢ͡ʁ|k͡p|ɡ͡b|p͡t|b͡d)');
		});

		it('compare features', function(){
			expect(Phone.compareFeatures('#', '#')).toBeJsonEqual({diff: [], same: {'0': '#'}});
			expect(Phone.compareFeatures('a', 'b')).toBeJsonEqual({diff: ['0'], same: {}});
			expect(Phone.compareFeatures({con: 1}, {con: 1})).toBeJsonEqual({diff: [], same: {con: 1}});
			expect(Phone.compareFeatures({con: 1}, {con: -1})).toBeJsonEqual({diff: ['con'], same: {}});
			expect(Phone.compareFeatures('a', {con: 1})).toBeJsonEqual({diff: ['0'], same: {}});
			expect(Phone.compareFeatures({con: 1}, 'b')).toBeJsonEqual({diff: ['con'], same: {}});

			expect(Phone.compareFeatures('#', '#', true)).toBeJsonEqual({diff: [], same: {'0': '#'}});
			expect(Phone.compareFeatures('a', 'b', true)).toBeJsonEqual({diff: ['0'], same: {}});
			expect(Phone.compareFeatures({con: 1, voi: 0}, {con: 1, voi: 0}, true)).toBeJsonEqual({diff: [], same: {con: 1, voi: 0}});
			expect(Phone.compareFeatures({con: 1, voi: 0}, {con: -1, voi: 0}, true)).toBeJsonEqual({diff: ['con'], same: {voi: 0}});
			expect(Phone.compareFeatures({con: 1}, {con: -1, voi: 0}, true)).toBeJsonEqual({diff: ['con', 'voi'], same: {}});
			expect(Phone.compareFeatures({con: 1, voi: 0}, {con: -1}, true)).toBeJsonEqual({diff: ['con', 'voi'], same: {}});
			expect(Phone.compareFeatures('a', {con: 1, voi: 0}, true)).toBeJsonEqual({diff: ['0', 'con', 'voi'], same: {}});
			expect(Phone.compareFeatures({con: 1, voi: 0}, 'b', true)).toBeJsonEqual({diff: ['con', 'voi', '0'], same: {}});
		});
	});
});
