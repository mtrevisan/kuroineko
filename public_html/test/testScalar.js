require(['tools/measure/Scalar', 'tools/measure/MeasureConverter'], function(Scalar, MeasureConverter){
	QUnit.module('Scalar');

	QUnit.test('scalar add number', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');
		var s1 = new Scalar(5, 'pèrtega', m);

		var s3 = s1.add(2, 'piè');

		equal(s3.value.toNumber(), 32);
		equal(s3.uom, 'piè');
	});

	QUnit.test('scalar add scalar', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');
		var s1 = new Scalar(5, 'pèrtega', m);
		var s2 = new Scalar(2, 'piè', m);

		var s3 = s1.add(s2);

		equal(s3.value.toNumber(), 32);
		equal(s3.uom, 'piè');
	});

	QUnit.test('scalar add a value-uom paird that doen\'t match the measure', function(){
		var m1 = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');
		var s1 = new Scalar(5, 'pèrtega', m1);

		throws(function(){
			s1.add(2, 'km');
		},
		function(err){
			return (err.toString() == 'Measure has not the given unit of measure.');
		});
	});

	QUnit.test('scalar add another scalar that doen\'t match the measure', function(){
		var m1 = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');
		var m2 = new MeasureConverter([
			'km = 1000 m'], 'm');
		var s1 = new Scalar(5, 'pèrtega', m1);
		var s2 = new Scalar(2, 'km', m2);

		throws(function(){
			s1.add(s2);
		},
		function(err){
			return (err.toString() == 'Measure has not the given unit of measure.');
		});
	});

	QUnit.test('conversion to', function(){
		var m = new MeasureConverter([
			'pèrtega = 6 piè',
			'paso = 5 piè',
			'paseto = 3 piè'], 'piè');
		var s1 = new Scalar(5, 'pèrtega', m);

		var s2 = s1.to('paso');

		equal(s2.value.toNumber(), 6);
		equal(s2.uom, 'paso');
	});
});
