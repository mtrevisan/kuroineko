require(['tools/measure/MeasureConverter', 'tools/math/Fraction'], function(MeasureConverter, Fraction){
	QUnit.module('Measure');

	QUnit.test('measure constructor / add unit / convert measure', function(){
		var m = new MeasureConverter({
				'pèrtega':	{parentValue: 6,		parentUOM: 'piè'}
		}, 'piè');
		m.addUnit('paso', 5, 'piè');
		m.addUnit('paseto = 3 piè');

		equal(m.convert(8, 'pèrtega', 'pèrtega').toNumber(), 8);
		equal(m.convert(8, 'pèrtega', 'piè').toNumber(), 8 * 6);
		equal(m.convert(8, 'piè', 'pèrtega').toNumber(), 8 / 6);
		equal(m.convert(8, 'pèrtega', 'paso').toNumber(), 8 * 6 / 5);

		deepEqual(m.getData(), [
			{uom: 'pèrtega',	parentValue: new Fraction(6),	parentUOM: 'piè',	factor: new Fraction(6)},
			{uom: 'paso',		parentValue: new Fraction(5),	parentUOM: 'piè',	factor: new Fraction(5)},
			{uom: 'paseto',	parentValue: new Fraction(3),	parentUOM: 'piè',	factor: new Fraction(3)},
			{uom: 'piè',		parentValue: undefined,	parentUOM: undefined,	factor: new Fraction(1)}
		]);
	});

	QUnit.test('expand', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');

		deepEqual(m.expand(8, 'pèrtega'), [{value: new Fraction(8), uom: 'pèrtega'}]);
		deepEqual(m.expand(2, 'piè'), [{value: new Fraction(2), uom: 'piè'}]);
		deepEqual(m.expand(2.3, 'piè'), [{value: new Fraction(2.3), uom: 'piè'}]);
		deepEqual(m.expand(8, 'piè'), [{value: new Fraction(1), uom: 'pèrtega'}, {value: new Fraction(2), uom: 'piè'}]);
		deepEqual(m.expand(0, 'pèrtega'), []);
	});

	QUnit.test('update unit', function(){
		var m = new MeasureConverter('pèrtega = 6 piè', 'piè');

		equal(m.convert(1, 'pèrtega', 'piè').toNumber(), 6);

		m.updateUnit('pèrtega', 5, 'piè');

		equal(m.convert(1, 'pèrtega', 'piè').toNumber(), 5);
	});

	QUnit.test('convert measure', function(){
		var si = new MeasureConverter({}, 'm');
		si.addUnit('m');
		var m = new MeasureConverter(['pèrtega = 6 piè'], 'piè');
		m.addConverter(m, si, 1/23);

		equal(m.convert(1.5, 'pèrtega', 'm').toNumber(), 1.5 * (6 / 23));
		equal(m.convert(1.5, 'm', 'piè').toNumber(), 1.5 * 23);
	});

	QUnit.test('convert measure with fraction input', function(){
		var m = new MeasureConverter(['pèrtega = 5/6 piè'], 'piè');

		equal(m.convert('2 pèrtega in piè').toNumber(), 2 * (5 / 6));
	});

	QUnit.test('convert measure with string input', function(){
		var si = new MeasureConverter({}, 'm');
		si.addUnit('m');
		var m = new MeasureConverter(['pèrtega = 6 piè'], 'piè');
		m.addConverter(m, si, 1/23);

		equal(m.convert('1.5 pèrtega in m').toNumber(), 1.5 * (6 / 23));
		equal(m.convert('1.5 m in piè').toNumber(), 1.5 * 23);
	});

	QUnit.test('convert measure with wrong inputs', function(){
		var si = new MeasureConverter({}, 'm');
		si.addUnit('m');
		var m = new MeasureConverter(['pèrtega = 6 piè'], 'piè');

		throws(function(){
			m.addConverter('bla', si, 1/23);
		},
		function(err){
			return (err.toString() == 'The from value passed should be a measure.');
		});
	});

	QUnit.test('calculate GCUOM - found', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');

		equal(m.calculateGreatestCommonUOM('pèrtega', 'pèrtega'), 'pèrtega');
	});

	QUnit.test('calculate GCUOM - one of the given uom', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');

		equal(m.calculateGreatestCommonUOM('pèrtega', 'piè'), 'piè');
	});

	QUnit.test('calculate GCUOM - uncommensurable', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');

		equal(m.calculateGreatestCommonUOM('pèrtega', 'paso'), 'piè');
	});
});
