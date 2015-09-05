require(['tools/math/Fraction'], function(Fraction){
	test('constructor with object', function(){
		var f = new Fraction({
			num: -13,
			den: 27
		});

		equal(f.num, 13);
		equal(f.den, 27);
		equal(f.sgn, -1);
	});

	test('constructor with array', function(){
		var f = new Fraction(-13, 27);

		equal(f.num, 13);
		equal(f.den, 27);
		equal(f.sgn, -1);
	});

	test('constructor with number', function(){
		var f = new Fraction(-13.27);

		equal(f.num, 1327);
		equal(f.den, 100);
		equal(f.sgn, -1);
	});

	test('constructor with big number', function(){
		var f = Fraction.fromNumber(1234567.9991829, 1e-10);

		equal(f.num, 385102500000);
		equal(f.den, 311933);
	});

	test('constructor with long number', function(){
		var f = Fraction.fromNumber(0.9999999999);

		equal(f.num, 9999999999);
		equal(f.den, 10000000000);
	});

	test('constructor with big number as string', function(){
		var f = new Fraction('1234567.9991829');

		equal(f.num, 12345679991829);
		equal(f.den, 10000000);
	});

	test('constructor with number', function(){
		var f = Fraction.fromNumber(355 / 113);

		equal(f.num, 355);
		equal(f.den, 113);
		equal(f.sgn, 1);
	});

	test('constructor with string (negative)', function(){
		var f = new Fraction('-13.27');

		equal(f.num, 1327);
		equal(f.den, 100);
		equal(f.sgn, -1);
	});

	test('constructor with string (positive)', function(){
		var f = new Fraction('5.12');

		equal(f.num, 128);
		equal(f.den, 25);
		equal(f.sgn, 1);
	});

	test('constructor with string (repeating decimals)', function(){
		var f = new Fraction('5.13(31)');

		equal(f.num, 25409);
		equal(f.den, 4950);
		equal(f.sgn, 1);
	});

	test('constructor with string fraction', function(){
		var f = new Fraction('5/13');

		equal(f.num, 5);
		equal(f.den, 13);
		equal(f.sgn, 1);
	});

	test('constructor with positive infinite', function(){
		var f = new Fraction(10, 0);

		equal(f.num, 1);
		equal(f.den, 0);
		equal(f.sgn, 1);
	});

	test('constructor with negative infinite', function(){
		var f = new Fraction(-10, 0);

		equal(f.num, 1);
		equal(f.den, 0);
		equal(f.sgn, -1);
	});

	test('GCD', function(){
		var f1 = new Fraction('5/8');
		var f2 = new Fraction('3/7');

		equal(f1.gcd(f2).toString(), new Fraction('1/56').toString());
	});

	test('add', function(){
		var f1 = new Fraction('5.13(31)');
		var f2 = new Fraction('2.3(7)');

		equal(f1.add(f2).toNumber(), new Fraction('7.51(09)').toNumber());
	});

	test('mul', function(){
		var f1 = new Fraction('5.13(31)');
		var f2 = new Fraction('2.3(7)');

		equal(f1.mul(f2).toNumber(), new Fraction(2718763, 222750).toNumber());
	});

	test('abs with positive number', function(){
		var f = new Fraction(1, 7);

		equal(f.abs().toNumber(), new Fraction(1, 7).toNumber());
	});

	test('abs with negative number', function(){
		var f = new Fraction(-1, 7);

		equal(f.abs().toNumber(), new Fraction(1, 7).toNumber());
	});

	test('pow with positive number', function(){
		var f = new Fraction(2, 3);

		equal(f.pow(2).toNumber(), new Fraction(4, 9).toNumber());
	});

	test('pow with negative number', function(){
		var f = new Fraction(-2, 3);

		equal(f.pow(-2).toNumber(), new Fraction(9, 4).toNumber());
	});

	test('div', function(){
		var f1 = new Fraction('123.32');
		var f2 = new Fraction('33.6(567)');

		equal(f1.div(f2).toString(), '3.6(640488235766481972215530394282502208303220107604593270697823817554003051473540512326347064964265638801895125672528707941861398859712519071709628202039669156026660242511844535453304424636633742873203244198185176262747932225166626515699028346583152653978960892957520276238657351642174576407291415723118927166144704087368505580984501726491608447763591102545571348269493294788404400546053159881153135790572552798522444390909820926684333092427527503412832249257207098691078454990765277443186380791777081827672046896330201557857544366819240343692282984019914879948606761422950293102063759736609652292620252148076768650124467999678792258893439331887898498353810326828876575925479804063277924997992451618083995824299365614711314542680478599534248775395487031237452822613024973901871035091945715891752991247089054846221793945234080141331406086886693969324660724323456195294306592788886212157713000883321288043041837308279129527021601220589416204930538825985706255520758050269011483176744559543885007628683851280815867662410664097004737814181321769854653497149281297679274070505099172890066650606279611338633261061591584357183008110495462940656869830562916566289247570866457881634947402232393800690596643379105436441018228539307797317915361760218421263952461254316229021119408977756363928370673733236971011001365132899702882839476431381996306110977274552316710832731068818758532080623143017746727696137476913193607965951979442704569180117240825503894643860917048100859230707460049787199871516903557375732755159399341524130731550630370191921625311169999196980647233598329719746245884525817072191439813699510158194812494981129045209989560748414036778286356701196498835621938488717578093632056532562434754677587729864289729382478117722637115554484863085200353328515217216734923311651810808)');
	});

	test('mod', function(){
		var f1 = new Fraction(4.55);
		var f2 = new Fraction(0.05);

		equal(f1.mod(f2).toNumber(), new Fraction(0).toNumber());
	});

	test('isDivisible true', function(){
		var f1 = new Fraction(19, 6);
		var f2 = new Fraction(38, 12);

		equal(f1.isDivisibleBy(f2), true);
	});

	test('isDivisible false', function(){
		var f1 = new Fraction(19, 6);
		var f2 = new Fraction(5, 98);

		equal(f1.isDivisibleBy(f2), false);
	});

	test('to positive string 1', function(){
		var f = new Fraction('5.13(31)');

		equal(f.toString(), '5.13(31)');
	});

	test('to positive string 2', function(){
		var f = new Fraction('0.13(31)');

		equal(f.toString(), '0.13(31)');
	});

	test('to positive string with zeros 1', function(){
		var f = new Fraction('5000.13(31)');

		equal(f.toString(), '5000.13(31)');
	});

	test('to positive string with zeros 2', function(){
		var f = new Fraction('5.00013(31)');

		equal(f.toString(), '5.00013(31)');
	});

	test('to negative string', function(){
		var f = new Fraction('-5.13(31)');

		equal(f.toString(), '-5.13(31)');
	});

	test('toString', function(){
		var f = new Fraction('1.2');

		equal(f.toString(), '1.2');
	});

	test('toString +Infinity', function(){
		var f = new Fraction('1/0');

		equal(f.toString(), '+Inf');
	});

	test('toString -Infinity', function(){
		var f = new Fraction('-1/0');

		equal(f.toString(), '-Inf');
	});

	test('toString NaN', function(){
		var f = new Fraction('0/0');

		equal(f.toString(), 'NaN');
	});

	test('to LaTeX integer', function(){
		var f = new Fraction('-10');

		equal(f.toLaTeX(), '-10');
	});

	test('to LaTeX positive fraction', function(){
		var f = new Fraction('1.5');

		equal(f.toLaTeX(), '\\frac{3}{2}');
	});

	test('to LaTeX negative fraction', function(){
		var f = new Fraction('-1.5');

		equal(f.toLaTeX(), '-\\frac{3}{2}');
	});
});
