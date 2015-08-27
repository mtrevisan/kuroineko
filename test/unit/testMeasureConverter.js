define(['tools/measure/MeasureConverter'], function(MeasureConverter){
	beforeEach(function(){
		this.addMatchers({
			toBeJsonEqual: function(expected){
				var one = JSON.stringify(this.actual).replace(/(\\t|\\n)/g, ''),
					two = JSON.stringify(expected).replace(/(\\t|\\n)/g, '');

				return (one === two);
			}
		});
	});

	describe('MeasureConverter', function(){
		it('measure constructor / add unit / convert measure', function(){
			var m = new MeasureConverter({
				'pèrtega':	{parentValue: 6,		parentUOM: 'piè'}
			}, 'piè');
			m.addUnit('paso', 5, 'piè');
			m.addUnit('paseto = 3 piè');

			expect(m.convert(8, 'pèrtega', 'pèrtega').toNumber()).toBe(8);
			expect(m.convert(8, 'pèrtega', 'piè').toNumber()).toBe(8 * 6);
			expect(m.convert(8, 'piè', 'pèrtega').toNumber()).toBe(8 / 6);
			expect(m.convert(8, 'pèrtega', 'paso').toNumber()).toBe(8 * 6 / 5);

			expect(m.getData()).toBeJsonEqual([
				{uom: 'pèrtega',	parentValue: 6,	parentUOM: 'piè',	factor: 6},
				{uom: 'paso',		parentValue: 5,	parentUOM: 'piè',	factor: 5},
				{uom: 'paseto',	parentValue: 3,	parentUOM: 'piè',	factor: 3},
				{uom: 'piè',		parentValue: undefined,	parentUOM: undefined,	factor: 1}
			]);
		});

		it('expand',  function(){
			var m = new MeasureConverter(['pèrtega = 6 piè',
				'paso = 5 piè',
				'paseto = 3 piè'], 'piè');

			expect(m.expand(8, 'pèrtega')).toBeJsonEqual([{value: 8, uom: 'pèrtega'}]);
			expect(m.expand(2, 'piè')).toBeJsonEqual([{value: 2, uom: 'piè'}]);
			expect(m.expand(2.3, 'piè')).toBeJsonEqual([{value: 2.3, uom: 'piè'}]);
			expect(m.expand(8, 'piè')).toBeJsonEqual([{value: 1, uom: 'pèrtega'}, {value: 2, uom: 'piè'}]);
			expect(m.expand(0, 'pèrtega')).toBeJsonEqual([]);
		});

		it('convert measure',  function(){
			var si = new MeasureConverter({
				'm':	{}
			}, 'm');
			var m = new MeasureConverter(['pèrtega = 6 piè'], 'piè');
			m.addConverter(m, si, 1/23);

			expect(m.convert(1.5, 'pèrtega', 'm').toNumber()).toBe(1.5 * (6 / 23));
			expect(m.convert(1.5, 'm', 'piè').toNumber()).toBe(1.5 * 23);
		});
	});
});
