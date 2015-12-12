/**
 * @class MeasureVeneto
 *
 * @author Mauro Trevisan
 */
define(['tools/measure/MeasureConverter'], function(MeasureConverter){

	var getMeasurePlaces = function(){
		return {
			'Belun': ['Belun'],
			'Trevixo': ['Àxol', 'Céneda', 'Fèltre', 'Kastelfranko', 'Konejan', 'Kuèr', 'Meduna de Livenŧa', 'Mèl', 'Mèstre', 'Mòta de Livenŧa', 'Trè Pòrti', 'Trevixo (ŧità)', 'Trevixo (kanpaña)'],
			'Pàdoa': ['Basan', 'Dòlo', 'Pàdoa', 'Ŧitadèla'],
			'Roigo': ['Badía Polèxine', 'Lendinara', 'Roigo'],
			'Venèŧia': ['Còxa', 'Piève de Kador', 'Venèŧia'],
			'Verona': ['Kaldièro', 'San Bonifaco', 'San Martin Bon Albèrgo', 'Soave', 'Verona'],
			'Viŧenŧa': ['Arxiñan', 'Axiago', 'Kamixan viŧentin', 'Lonigo', 'Montebèl', 'Rekoaro', 'Skio', 'Thiène', 'Viŧenŧa']
		};
	};


	var getMeasureLengthEarth = function(place){
		if(place.match(/Àxol|Céneda|Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)/))
			place = 'Trevixo';
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Còxa|Piève de Kador/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var isVenice = !!place.match(/Venèŧia/),
			a = (place.match(/Belun|Roigo|Verona/)? 'paso': 'pèrtega' + (isVenice? ' (granda)': '')),
			b = (place.match(/Basan|Konejan|Pàdoa|Roigo|Venèŧia|Verona|Viŧenŧa/)? 6: 5);
		var m = new MeasureConverter(['milèr = 1000 ' + a + ' = ' + b + ' piè = 12 onŧa = 12 línea = 12 ponto',
			'paseto = 3 piè',
			'braŧo = 2 piè'], 'piè');
		if(isVenice)
			m.addUnit('pèrtega (cea) = 4.5 piè');

		var o = {
			//kome el piè da fàbrega de Venèŧia
			'Belun':		0.34773485,
			//kome el só piè da fàbrega
			'Fèltre':	0.367053447,
			//kome el piè da fàbrega de Venèŧia
			'Konejan':	0.34773485,
			//kome el só piè da fàbrega
			'Mèl':		0.352554932,
			'Pàdoa':		0.357394167,
			'Roigo':		0.38422979,
			'Trevixo':	0.40810548,
			//da fàbrega
			'Venèŧia':	0.34773485,
			//kome el piè da fàbrega de Pàdoa
			'Viŧenŧa':	0.35739415,
			//dopo de 'l 1696 censuario 0.340333 m
			'Verona':	0.342914758
		};
		m.addConverter(m, siMeasureContainer.length, o[place]);

		return m;
	};

	var getMeasureLengthIndustrial = function(place){
		if(place.match(/Àxol|Céneda|Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)/))
			place = 'Trevixo';
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Còxa|Piève de Kador/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var isVenice = !!place.match(/Venèŧia/),
			a = (place.match(/Belun|Roigo|Verona/)? 'paso': 'pèrtega' + (isVenice? ' (granda)': '')),
			b = (place.match(/Basan|Konejan|Pàdoa|Roigo|Venèŧia|Verona|Viŧenŧa/)? 6: 5);
		var m = new MeasureConverter(['milèr = 1000 ' + a + ' = ' + b + ' piè = 12 onŧa = 12 línea = 12 ponto',
			'paseto = 3 piè',
			'braŧo = 2 piè'], 'piè');
		if(isVenice)
			m.addUnit('pèrtega (cea) = 4.5 piè');

		if(place.match(/Belun|Konejan|Roigo|Trevixo/))
			place = 'Venèŧia';
		var o = {
			'Fèltre':	0.367053447,
			'Mèl':		0.352554932,
			'Pàdoa':		0.35739415,
			'Venèŧia':	0.34773485,
			'Verona':	0.34291476
		};
		m.addConverter(m, siMeasureContainer.length, o[place]);

		return m;
	};

	var getMeasureLengthCotton = function(place){
		if(place.match(/Àxol|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)/))
			place = 'Trevixo';
		else if(place.match(/Basan|Belun|Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Mèl/))
			place = 'Piève de Kador';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Còxa/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var a = 'braŧo' + (place.match(/Verona/)? ' (longo)': '');
		var m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

		var o = {
			'Mèstre':	0.6730907,
			'Pàdoa':		0.6809806,
			'Piève de Kador':	0.6954697,
			'Roigo':		0.6698203,
			'Trevixo':	0.6761983,
			//braŧo longo
			'Verona':	0.6489908,
			'Viŧenŧa':	0.6903053
		};
		m.addConverter(m, siMeasureContainer.length, o[place]);

		return m;
	};

	var getMeasureLengthSilk = function(place){
		if(place.match(/Àxol|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)/))
			place = 'Trevixo';
		else if(place.match(/Céneda|Fèltre/))
			place = 'Mèstre';
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Basan|Còxa/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var a = 'braŧo' + (place.match(/Verona/)? ' (kurto)': '');
		var m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

		if(place.match(/Belun/))
			place = 'Verona';
		var o = {
			'Mèl':		0.6531218,
			'Mèstre':	0.636252,
			'Pàdoa':		0.6375138,
			'Piève de Kador':	0.6551875,
			'Roigo':		0.6328090,
			'Trevixo':	0.6340136,
			//braŧo kurto
			'Verona':	0.6424493,
			'Venèŧia':	0.6387213
		};
		m.addConverter(m, siMeasureContainer.length, o[place]);

		return m;
	};

	var getMeasureLengthWool = function(place){
		if(place.match(/Àxol|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèl|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)/))
			place = 'Trevixo';
		//Belun?
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Basan|Còxa|Pàdoa|Piève de Kador/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var a = 'braŧo' + (place.match(/Verona/)? ' (longo)': '');
		var m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

		var o = {
			//kome el só braŧo da pano
			'Roigo':		0.6698203,
			//braŧo longo
			'Verona':	0.6489908,
			'Venèŧia':	0.6833956
		};
		m.addConverter(m, siMeasureContainer.length, o[place]);

		return m;
	};

	var getMeasureLengthLinen = function(place){
		if(place.match(/Àxol|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèl|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)/))
			place = 'Trevixo';
		else if(place.match(/Basan|Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Còxa/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var a = 'braŧo' + (place.match(/Verona/)? ' (longo)': '');
		var m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

		var o = {
			'Piève de Kador':	0.7653610,
			//kome el só braŧo da pano
			'Roigo':		0.6698203,
			//braŧo longo
			'Verona':	0.6489908
		};
		m.addConverter(m, siMeasureContainer.length, o[place]);

		return m;
	};


	var getMeasureAreaEarth = function(place){
		if(place.match(/Àxol|Céneda|Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)/))
			place = 'Trevixo';
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Còxa/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var isVenice = !!place.match(/Venèŧia/),
			a = (place.match(/Belun|Roigo|Verona/)? 'paso': 'pèrtega' + (isVenice? ' (granda)': ''));
		var m = new MeasureConverter(['tòla = 1 ' + a + '\u00B2'], 'tòla');
		if(place.match(/Basan/))
			m.addUnit('kanpo = 4 kuarta = 225 tòla');
		else if(place.match(/Belun/))
			m.addUnit('kanpo = 8 kalvéa = 156.25 tòla');
		else if(place.match(/Konejan|Piève de Kador|Trevixo/))
			m.addUnit('kanpo = 1250 tòla');
		else if(place.match(/Pàdoa|Venèŧia|Viŧenŧa/)){
			m.addUnit('kanpo = 840 tòla');

			if(isVenice)
				m.addUnit('milèr = 1000 gèbo = 1 pèrtega (cea)\u00B2');
		}
		else if(place.match(/Fèltre/))
			m.addUnit('kanpo = 5 stèr = 250 tòla');
		else if(place.match(/Mèl/))
			m.addUnit('kanpo = 7 stèr = 250 tòla');
		else if(place.match(/Roigo/))
			m.addUnit('kanpo = 24 vaneŧa = 35 tòla');
		else if(place.match(/Verona/))
			m.addUnit('kanpo = 24 vaneŧa = 30 tòla');

		m.addConverter(m, siMeasureContainer.area,
			Math.pow(getMeasureLengthEarth(place).convert(1, a, siMeasureContainer.length.getBaseUOM()), 2));

		return m;
	};


	var getMeasureVolumeDry = function(place){
		if(place.match(/Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Trè Pòrti|Trevixo \((ŧità|kanpaña)/))
			place = 'Trevixo';
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Còxa/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var a = (place.match(/Venèŧia/)? 'stèr': 'sako');
		var m = new MeasureConverter([], a);
		if(place.match(/Àxol/))
			m.addUnit(a + ' = 4 kuarta = 3 vigano = 4 minèla');
		else if(place.match(/Belun|Céneda|Vitòrio/))
			m.addUnit(a + ' = 8 kalvéa = 4 kuartaròl = 2 međeto = 2 minèla');
		else if(place.match(/Fèltre/))
			m.addUnit(a + ' = 4 stèr = 4 kuarta = 2 međeto = 2 minèla');
		else if(place.match(/Lendinara/))
			m.addUnit(a + ' = 3 staro = 4 kuarta = 2 međeto = 2 minèla');
		else if(place.match(/Pàdoa/))
			m.addUnit('mòjo = 3 ' + a + ' = 4 staro = 4 kuarta = 4 kopo = 3 skodèla');
		else if(place.match(/Piève de Kador/))
			m.addUnit(a + ' = 3 kalvéa = 4 kuartaròl = 2 međeto = 2 minèla');
		else if(place.match(/Badía Polèxine|Roigo/))
			m.addUnit(a + ' = 3 staro = 4 kuarta = 4 kuartaròl = 3 skodèla');
		else if(place.match(/Konejan|Mèl|Mòta de Livenŧa|Trevixo/))
			m.addUnit(a + ' = 4 kuarta = 4 kuartièr = 2 međeto = 2 minèla');
		else if(place.match(/Venèŧia/))
			m.addUnit('mòjo = 4 ' + a + ' = 2 međèno = 2 kuarta = 4 kuartaròl = 2 međeto = 2 minèla');
		else if(place.match(/Verona/))
			m.addUnit(a + ' = 3 minale = 4 kuarta = 4 kuartaròl = 2 međeto = 2 minèla');
		else if(place.match(/Basan|Viŧenŧa/))
			m.addUnit(a + ' = 4 staro = 4 kuarta = 4 kuartaròl = 2 međeto = 2 minèla');

		var o = {
			'Àxol':				87.8557,
			'Badía Polèxine':	92.2680,
			'Basan':				111.5427,
			'Belun':				95.7758,
			'Céneda':			97.6635,
			'Fèltre':			81.3648,
			'Konejan':			93.6077,
			'Lendinara':		85.3943,
			'Mèl':				86.812,
			'Mòta de Livenŧa':	93.6077,
			'Pàdoa':				347.8016 / 3,
			'Piève de Kador':	95.7758,
			'Roigo':				99.4593,
			'Trevixo':			86.8120,
			'Venèŧia':			83.3172,
			'Verona':			114.6535,
			'Vitòrio':			97.7,
			'Viŧenŧa':			108.1727
		};
		m.addConverter(m, siMeasureContainer.volume, o[place]);

		return m;
	};

	var getMeasureVolumeLiquid = function(place){
		if(place.match(/Kastelfranko|Kuèr|Meduna de Livenŧa|Trè Pòrti/))
			place = 'Trevixo';
		else if(place.match(/Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var a = (place.match(/Mèl|Mòta de Livenŧa|Trevixo \(ŧità\)/)? 'konđo': 'mastèl');
		var m = new MeasureConverter([], a);
		if(place.match(/Àxol/))
			m.addUnit('bote = 10 ' + a + ' = 6 seco = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Badía Polèxine/))
			m.addUnit(a + ' = 54 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Basan/))
			m.addUnit('bote = 10 ' + a + ' = 8 seco = 4 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Belun|Piève de Kador/))
			m.addUnit(a + ' = 5 seco = 8 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Céneda/))
			m.addUnit(a + ' = 6 seco = 2 bokal = 6 ingistara = 2 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Còxa/))
			m.addUnit(a + ' = 8 seco = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Fèltre/))
			m.addUnit(a + ' = 60 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Konejan/))
			m.addUnit(a + ' = 2 masteleto = 3 seco = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Lendinara/))
			m.addUnit(a + ' = 54 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Mèl|Mèstre/))
			m.addUnit(a + ' = 46 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Mòta de Livenŧa/))
			m.addUnit(a + ' = 72 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Pàdoa/))
			m.addUnit(a + ' = 8 seco = 9 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Roigo/))
			m.addUnit(a + ' = 1.5 masteleto = 4 seco = 9 bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Trevixo \((ŧità|kanpaña)\)/))
			m.addUnit('bote = 10 ' + a + ' = 6 seca = ' + (place.match(/Trevixo (kanpaña)/)? 6: 8) + ' bokal = 2 bòŧe = 2 píkolo = 2 gòto');
		else if(place.match(/Venèŧia/)){
			m.addUnit('burco = 60 bote = 1.25 ànfota = 4 bigonxo = 2 ' + a + ' = 7 seco = 2 bokal = 4 kuartuŧo = 2 píkolo = 2 gòto');
			m.addUnit('baril = 6 seco');
		}
		else if(place.match(/Verona/))
			m.addUnit('bote = 8 ' + a + ' = 1.5 brento = 2 seca = 2 bokal = 6 ingistara = 4 gòto');
//		else if(place.match(/Vitòrio/))
//			m.addUnit(a + ' = 1.5 brenta = 2 seca = 2 bokal = 6 ingistara = 4 gòto');
		else if(place.match(/Viŧenŧa/))
			m.addUnit('bote = 8 ' + a + ' = 6 seca = 2 seco = 5 bokal');

		if(place.match(/Trevixo \((ŧità|kanpaña)\)/))
			place = 'Trevixo';
		var o = {
			'Àxol':				73.3752,
			'Badía Polèxine':	108.3374,
			'Basan':				72.4159,
			'Belun':				74.7330,
			'Céneda':			85.722,
			'Còxa':				73.0000,
			'Fèltre':			88.7526,
			'Konejan':			81.1758,
			'Lendinara':		104.790240,
			'Mèl':				91.2154,
			'Mèstre':			85.8480,
			'Mòta de Livenŧa':	87.6226,
			'Pàdoa':				71.2755,
			'Piève de Kador':	74.733,
			'Roigo':				104.7902,
			'Trevixo':			77.9800,
			'Venèŧia':			75.11688,
			'Verona':			105.76665,
			'Vitòrio':			85.8,
			'Viŧenŧa':			113.8900
		};
		m.addConverter(m, siMeasureContainer.volume, o[place]);

		return m;
	};


	var getMeasureWeightHeavy = function(place){
		if(place.match(/Àxol|Belun|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Piève de Kador|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)/))
			place = 'Trevixo';
		else if(place.match(/Arxiñan|Axiago|Basan|Dòlo|Ŧitadèla|Viŧenŧa/))
			place = 'Pàdoa';
		else if(place.match(/Badía Polèxine|Lendinara/))
			place = 'Roigo';
		else if(place.match(/Còxa/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 12 onŧa = 6 saŧo = 32 karato = 24 gran', 'libra');

		var o = {
			'Mèl':		510.2271,
			//pal dekreto del Senato de 'l 6 April 1737 el pexo fin el ga da èser 1.02 'olte kuelo de Venèŧia
			'Pàdoa':		301.22966 * (768. / 485.) * 1.02,
			'Roigo':		477.2942,
			//pal dekreto del Senato de 'l 6 April 1737 el pexo fin el ga da èser 1 e 1/12 'olte kuelo de Venèŧia
			'Trevixo':	301.22966 * (768. / 485.) * (13. / 12.),
			//doparàa kome pexo par presioxi, sora de tuto par òro, arđento, e xème preŧioxe
			//(pal Sovrano Decreto de 'l 1575 se ga ke 768 libre gròse le fà 485 libre fine)
			'Venèŧia':	301.22966 * (768. / 485.),
			//na volta e mèđa la só libra fina
			'Verona':	333.1757 * 1.5
		};
		m.addConverter(m, siMeasureContainer.weight, o[place]);

		return m;
	};

	var getMeasureWeightLight = function(place){
		if(place.match(/Arxiñan|Axiago|Àxol|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèl|Mèstre|Mòta de Livenŧa|Pàdoa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)|Viŧenŧa/))
			place = 'Trevixo';
		else if(place.match(/Basan|Dòlo|Ŧitadèla/))
			place = 'Pàdoa';
		else if(place.match(/Lendinara/))
			place = 'Roigo';
		else if(place.match(/Belun|Céneda|Còxa|Piève de Kador/))
			place = 'Venèŧia';
		else if(place.match(/Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave/))
			place = 'Verona';
		else if(place.match(/Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène/))
			place = 'Viŧenŧa';

		var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 12 onŧa = 6 saŧo = 4 skrúpolo = 6 karato = 4 gran', 'libra');
		m.addUnit('karga = 4 kantaro');

		var o = {
			'Badía Polèxine': 339.0974,
			'Roigo':		301.4160,
			//pal dekreto del Senato de 'l 6 April 1737 el pexo fin el ga da èser 1.125 'olte kuelo de Venèŧia
			'Trevixo':	301.22966 * 1.125,
			//doparàa kome pexo par medexine
			'Venèŧia':	301.22966,
			'Verona':	333.1757
		};
		m.addConverter(m, siMeasureContainer.weight, o[place]);

		return m;
	};

	var getMeasureWeightMedicinal = function(){
		var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 12 onŧa = 6 saŧo = 4 skrúpolo = 6 karato = 4 gran', 'libra');
		m.addUnit('karga = 4 kantaro');

		//se dopara la libra fina de Venèŧia
		m.addConverter(m, siMeasureContainer.weight, 301.22966);

		return m;
	};

	var getMeasureWeightPreciouses = function(){
		var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 2 marko = 6 onŧa = 6 saŧo = 4 skrúpolo = 6 karato = 4 gran', 'libra');
		m.addUnit('karga = 4 kantaro');

		//se dopara la libra gròsa de Venèŧia
		m.addConverter(m, siMeasureContainer.weight, 476.99872);

		return m;
	};


	/** @private */
	var createSIMeasure = (function(){
		var prefixes =	['Y',	'Z',	'E',	'P',	'T',	'G',	'M',	'k',	'h',	'da',	'd',	'c',	'm',	'μ',	'n',	'p',	'f',	'a',	'z',	'y'],
			factors =	[24,	21,	18,	15,	12,	9,		6,		3,		2,		1,		-1,	-2,	-3,	-6,	-9,	-12,	-15,	-18,	-21,	-24];

		return function(baseUOM, indexes){
			var m = new MeasureConverter({}, baseUOM),
				i;
			m.addUnit(baseUOM);
			for(i in indexes){
				i = indexes[i];
				m.addUnit(prefixes[i] + baseUOM, Math.pow(10, factors[i]), baseUOM);
			}
			return m;
		};
	})();

	/** @private */
	var siMeasureContainer = {
		length: createSIMeasure('m', [7, 11, 12]),
		area: createSIMeasure('m\u00B2', [7]),
		volume: createSIMeasure('l', [8, 10, 11, 12]),
		weight: createSIMeasure('g', [7, 8, 12])
	};


	return {
		length: {
			earth: getMeasureLengthEarth,
			industrial: getMeasureLengthIndustrial,
			silk: getMeasureLengthSilk,
			cotton: getMeasureLengthCotton,
			wool: getMeasureLengthWool,
			linen: getMeasureLengthLinen
		},
		area: {
			earth: getMeasureAreaEarth
		},
		volume: {
			dry: getMeasureVolumeDry,
			liquid: getMeasureVolumeLiquid
		},
		weight: {
			heavy: getMeasureWeightHeavy,
			light: getMeasureWeightLight,
			medicinal: getMeasureWeightMedicinal,
			preciouses: getMeasureWeightPreciouses
		},

		getMeasurePlaces: getMeasurePlaces
	};

});
