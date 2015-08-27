define(['tools/math/Fraction'], function(Fraction){
	describe('Fraction', function(){
		it('constructor with object', function(){
			var f = new Fraction({
				num: -13,
				den: 27
			});

			expect(f.num).toBe(13);
			expect(f.den).toBe(27);
			expect(f.sgn).toBe(-1);
		});

		it('constructor with array', function(){
			var f = new Fraction(-13, 27);

			expect(f.num).toBe(13);
			expect(f.den).toBe(27);
			expect(f.sgn).toBe(-1);
		});

		it('constructor with number', function(){
			var f = new Fraction(-13.27);

			expect(f.num).toBe(1327);
			expect(f.den).toBe(100);
			expect(f.sgn).toBe(-1);
		});

		it('constructor with big number', function(){
			var f = Fraction.fromNumber(1234567.9991829, 1e-10);

			expect(f.num).toBe(385102500000);
			expect(f.den).toBe(311933);
		});

		it('constructor with long number', function(){
			var f = Fraction.fromNumber(0.9999999999);

			expect(f.num).toBe(9999999999);
			expect(f.den).toBe(10000000000);
		});

		it('constructor with big number as string', function(){
			var f = new Fraction('1234567.9991829');

			expect(f.num).toBe(12345679991829);
			expect(f.den).toBe(10000000);
		});

		it('constructor with number', function(){
			var f = Fraction.fromNumber(355 / 113);

			expect(f.num).toBe(355);
			expect(f.den).toBe(113);
			expect(f.sgn).toBe(1);
		});

		it('constructor with string (negative)', function(){
			var f = new Fraction('-13.27');

			expect(f.num).toBe(1327);
			expect(f.den).toBe(100);
			expect(f.sgn).toBe(-1);
		});

		it('constructor with string (positive)', function(){
			var f = new Fraction('5.12');

			expect(f.num).toBe(128);
			expect(f.den).toBe(25);
			expect(f.sgn).toBe(1);
		});

		it('constructor with string (repeating decimals)', function(){
			var f = new Fraction('5.13(31)');

			expect(f.num).toBe(25409);
			expect(f.den).toBe(4950);
			expect(f.sgn).toBe(1);
		});

		it('constructor with string fraction', function(){
			var f = new Fraction('5/13');

			expect(f.num).toBe(5);
			expect(f.den).toBe(13);
			expect(f.sgn).toBe(1);
		});

		it('constructor with positive infinite', function(){
			var f = new Fraction(10, 0);

			expect(f.num).toBe(1);
			expect(f.den).toBe(0);
			expect(f.sgn).toBe(1);
		});

		it('constructor with negative infinite', function(){
			var f = new Fraction(-10, 0);

			expect(f.num).toBe(1);
			expect(f.den).toBe(0);
			expect(f.sgn).toBe(-1);
		});

		it('GCD', function(){
			var f1 = new Fraction('5/8');
			var f2 = new Fraction('3/7');

			expect(f1.gcd(f2).toString()).toBe(new Fraction('1/56').toString());
		});

		it('add', function(){
			var f1 = new Fraction('5.13(31)');
			var f2 = new Fraction('2.3(7)');

			expect(f1.add(f2).toNumber()).toBe(new Fraction('7.51(09)').toNumber());
		});

		it('mul', function(){
			var f1 = new Fraction('5.13(31)');
			var f2 = new Fraction('2.3(7)');

			expect(f1.mul(f2).toNumber()).toBe(new Fraction(2718763, 222750).toNumber());
		});

		it('abs with positive number', function(){
			var f = new Fraction(1, 7);

			expect(f.abs().toNumber()).toBe(new Fraction(1, 7).toNumber());
		});

		it('abs with negative number', function(){
			var f = new Fraction(-1, 7);

			expect(f.abs().toNumber()).toBe(new Fraction(1, 7).toNumber());
		});

		it('pow with positive number', function(){
			var f = new Fraction(2, 3);

			expect(f.pow(2).toNumber()).toBe(new Fraction(4, 9).toNumber());
		});

		it('pow with negative number', function(){
			var f = new Fraction(-2, 3);

			expect(f.pow(-2).toNumber()).toBe(new Fraction(9, 4).toNumber());
		});

		it('div', function(){
			var f1 = new Fraction('123.32');
			var f2 = new Fraction('33.6(567)');

			expect(f1.div(f2).toString()).toBe('3.6(640488235766481972215530394282502208303220107604593270697823817554003051473540512326347064964265638801895125672528707941861398859712519071709628202039669156026660242511844535453304424636633742873203244198185176262747932225166626515699028346583152653978960892957520276238657351642174576407291415723118927166144704087368505580984501726491608447763591102545571348269493294788404400546053159881153135790572552798522444390909820926684333092427527503412832249257207098691078454990765277443186380791777081827672046896330201557857544366819240343692282984019914879948606761422950293102063759736609652292620252148076768650124467999678792258893439331887898498353810326828876575925479804063277924997992451618083995824299365614711314542680478599534248775395487031237452822613024973901871035091945715891752991247089054846221793945234080141331406086886693969324660724323456195294306592788886212157713000883321288043041837308279129527021601220589416204930538825985706255520758050269011483176744559543885007628683851280815867662410664097004737814181321769854653497149281297679274070505099172890066650606279611338633261061591584357183008110495462940656869830562916566289247570866457881634947402232393800690596643379105436441018228539307797317915361760218421263952461254316229021119408977756363928370673733236971011001365132899702882839476431381996306110977274552316710832731068818758532080623143017746727696137476913193607965951979442704569180117240825503894643860917048100859230707460049787199871516903557375732755159399341524130731550630370191921625311169999196980647233598329719746245884525817072191439813699510158194812494981129045209989560748414036778286356701196498835621938488717578093632056532562434754677587729864289729382478117722637115554484863085200353328515217216734923311651810808)');
		});

		it('mod', function(){
			var f1 = new Fraction(4.55);
			var f2 = new Fraction(0.05);

			expect(f1.mod(f2).toNumber()).toBe(new Fraction(0).toNumber());
		});

		it('isDivisible true', function(){
			var f1 = new Fraction(19, 6);
			var f2 = new Fraction(38, 12);

			expect(f1.isDivisibleBy(f2)).toBe(true);
		});

		it('isDivisible false', function(){
			var f1 = new Fraction(19, 6);
			var f2 = new Fraction(5, 98);

			expect(f1.isDivisibleBy(f2)).toBe(false);
		});

		it('to positive string 1', function(){
			var f = new Fraction('5.13(31)');

			expect(f.toString()).toBe('5.13(31)');
		});

		it('to positive string 2', function(){
			var f = new Fraction('0.13(31)');

			expect(f.toString()).toBe('0.13(31)');
		});

		it('to positive string with zeros 1', function(){
			var f = new Fraction('5000.13(31)');

			expect(f.toString()).toBe('5000.13(31)');
		});

		it('to positive string with zeros 2', function(){
			var f = new Fraction('5.00013(31)');

			expect(f.toString()).toBe('5.00013(31)');
		});

		it('to negative string', function(){
			var f = new Fraction('-5.13(31)');

			expect(f.toString()).toBe('-5.13(31)');
		});

		it('toString', function(){
			var f = new Fraction('1.2');

			expect(f.toString()).toBe('1.2');
		});

		it('toString +Infinity', function(){
			var f = new Fraction('1/0');

			expect(f.toString()).toBe('+Inf');
		});

		it('toString -Infinity', function(){
			var f = new Fraction('-1/0');

			expect(f.toString()).toBe('-Inf');
		});

		it('toString NaN', function(){
			var f = new Fraction('0/0');

			expect(f.toString()).toBe('NaN');
		});

		it('to LaTeX integer', function(){
			var f = new Fraction('-10');

			expect(f.toLaTeX()).toBe('-10');
		});

		it('to LaTeX positive fraction', function(){
			var f = new Fraction('1.5');

			expect(f.toLaTeX()).toBe('\\frac{3}{2}');
		});

		it('to LaTeX negative fraction', function(){
			var f = new Fraction('-1.5');

			expect(f.toLaTeX()).toBe('-\\frac{3}{2}');
		});
	});
});
