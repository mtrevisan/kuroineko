/**
 * @class MeasureVeneto
 *
 * @author Mauro Trevisan
 */
define(['tools/measure/MeasureConverter', 'tools/measure/data/MeasureSI', 'tools/data/FunctionHelper'], function(MeasureConverter, MeasureSI, FunctionHelper){

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


	var getMeasureLengthEarth = (function(){
		var conversions = {
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

		return function(place){
			place = reducePlaceLengthEarthIndustrial(place);

			var isVenice = !!place.match(/Venèŧia/),
				a = (place.match(/Belun|Roigo|Verona/)? 'paso': 'pèrtega' + (isVenice? ' (granda)': '')),
				b = (place.match(/Basan|Konejan|Pàdoa|Roigo|Venèŧia|Verona|Viŧenŧa/)? 6: 5),
				m = new MeasureConverter(['milèr = 1000 ' + a + ' = ' + b + ' piè = 12 onŧa = 12 línea = 12 ponto',
					'paseto = 3 piè',
					'braŧo = 2 piè'], 'piè');
			if(isVenice)
				m.addUnit('pèrtega (cea) = 4.5 piè');

			m.addConverter(m, MeasureSI.length, conversions[place]);

			return m;
		};
	})();

	var getMeasureLengthIndustrial = (function(){
		var conversions = {
			'Fèltre':	0.367053447,
			'Mèl':		0.352554932,
			'Pàdoa':		0.35739415,
			'Venèŧia':	0.34773485,
			'Verona':	0.34291476
		};

		return function(place){
			place = reducePlaceLengthEarthIndustrial(place);

			var isVenice = !!place.match(/Venèŧia/),
				a = (place.match(/Belun|Roigo|Verona/)? 'paso': 'pèrtega' + (isVenice? ' (granda)': '')),
				b = (place.match(/Basan|Konejan|Pàdoa|Roigo|Venèŧia|Verona|Viŧenŧa/)? 6: 5),
				m = new MeasureConverter(['milèr = 1000 ' + a + ' = ' + b + ' piè = 12 onŧa = 12 línea = 12 ponto',
					'paseto = 3 piè',
					'braŧo = 2 piè'], 'piè');
			if(isVenice)
				m.addUnit('pèrtega (cea) = 4.5 piè');

			if(place.match(/Belun|Konejan|Roigo|Trevixo/))
				place = 'Venèŧia';
			m.addConverter(m, MeasureSI.length, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var addCommonPlaceLength = function(places){
		places['Roigo'] = /^(Badía Polèxine|Lendinara)$/;
		places['Verona'] = /^(Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave)$/;
		places['Viŧenŧa'] = /^(Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène)$/;
	};

	/** @private */
	var reducePlace = function(places, place){
		Object.keys(places).some(function(p){
			if(place.match(places[p])){
				place = p;
				return true;
			}
			return false;
		});
		return place;
	};

	/** @private */
	var reducePlaceLengthEarthIndustrial = (function(){
		var places = {
			'Trevixo': /^(Àxol|Céneda|Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/,
			'Pàdoa': /^(Basan|Dòlo|Ŧitadèla)$/,
			'Venèŧia': /^(Còxa|Piève de Kador)$/
		};
		addCommonPlaceLength(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	var getMeasureLengthCotton = (function(){
		var conversions = {
			'Mèstre':	0.6730907,
			'Pàdoa':		0.6809806,
			'Piève de Kador':	0.6954697,
			'Roigo':		0.6698203,
			'Venèŧia':	0.6761983,
			//braŧo longo
			'Verona':	0.6489908,
			'Viŧenŧa':	0.6903053
		};

		return function(place){
			place = reducePlaceLengthCotton(place);

			var a = 'braŧo' + (place.match(/Verona/)? ' (longo)': ''),
				m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

			m.addConverter(m, MeasureSI.length, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var reducePlaceLengthCotton = (function(){
		var places = {
			'Pàdoa': /^(Basan|Belun|Dòlo|Ŧitadèla)$/,
			'Piève de Kador': /^(Mèl)$/,
			'Venèŧia': /^(Còxa|Àxol|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/
		};
		addCommonPlaceLength(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	var getMeasureLengthSilk = (function(){
		var conversions = {
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

		return function(place){
			place = reducePlaceLengthSilk(place);

			var a = 'braŧo' + (place.match(/Verona/)? ' (kurto)': ''),
				m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

			if(place.match(/Belun/))
				place = 'Verona';
			m.addConverter(m, MeasureSI.length, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var reducePlaceLengthSilk = (function(){
		var places = {
			'Trevixo': /^(Àxol|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/,
			'Mèstre': /^(Céneda|Fèltre)$/,
			'Pàdoa': /^(Dòlo|Ŧitadèla)$/,
			'Venèŧia': /^(Basan|Còxa)$/
		};
		addCommonPlaceLength(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	var getMeasureLengthWool = (function(){
		var conversions = {
			//kome el só braŧo da pano
			'Roigo':		0.6698203,
			//braŧo longo
			'Verona':	0.6489908,
			'Venèŧia':	0.6833956
		};

		return function(place){
			place = reducePlaceLengthWool(place);

			var a = 'braŧo' + (place.match(/Verona/)? ' (longo)': ''),
				m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

			m.addConverter(m, MeasureSI.length, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var reducePlaceLengthWool = (function(){
		var places = {
			//'Belun': ?,
			'Venèŧia': /^(Pàdoa|Basan|Dòlo|Ŧitadèla|Còxa|Piève de Kador|Belun|Àxol|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèl|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/
		};
		addCommonPlaceLength(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	var getMeasureLengthLinen = (function(){
		var conversions = {
			'Venèŧia':	0.7653610,
			//kome el só braŧo da pano
			'Roigo':		0.6698203,
			//braŧo longo
			'Verona':	0.6489908
		};

		return function(place){
			place = reducePlaceLengthLinen(place);

			var a = 'braŧo' + (place.match(/Verona/)? ' (longo)': ''),
				m = new MeasureConverter(a + ' = 12 onŧa = 12 línea = 12 ponto', a);

			m.addConverter(m, MeasureSI.length, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var reducePlaceLengthLinen = (function(){
		var places = {
			'Venèŧia': /^(Còxa|Pàdoa|Basan|Dòlo|Ŧitadèla|Belun|Piève de Kador|Àxol|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèl|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/
		};
		addCommonPlaceLength(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();


	var getMeasureAreaEarth = function(place){
		place = reducePlaceAreaEarth(place);

		var a = (place.match(/Belun|Roigo|Verona/)? 'paso': 'pèrtega' + (place.match(/Venèŧia|Piève de Kador/)? ' (granda)': '')),
			m = new MeasureConverter(['tòla = 1 ' + a + '\u00B2'], 'tòla');
		getUnitsAreaEarth(place).forEach(function(unit){
			m.addUnit(unit);
		});

		m.addConverter(m, MeasureSI.area,
			Math.pow(getMeasureLengthEarth(place).convert(1, a, MeasureSI.length.getBaseUOM()), 2));

		return m;
	};

	/** @private */
	var reducePlaceAreaEarth = (function(){
		var places = {
			'Trevixo': /^(Àxol|Céneda|Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Trè Pòrti|Trevixo \((ŧità|kanpaña))$/,
			'Pàdoa': /^(Dòlo|Ŧitadèla)$/,
			'Roigo': /^(Badía Polèxine|Lendinara)$/,
			'Venèŧia': /^(Còxa)$/,
			'Verona': /^(Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave)$/,
			'Viŧenŧa': /^(Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène)$/
		};

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	/** @private */
	var getUnitsAreaEarth = (function(){
		var units = {
			'Basan': ['kanpo = 4 kuarta = 225 tòla'],

			'Belun': ['kanpo = 8 kalvéa = 156.25 tòla'],

			'Konejan': ['kanpo = 1250 tòla'],
			'Piève de Kador': ['kanpo = 1250 tòla'],
			'Trevixo': ['kanpo = 1250 tòla'],

			'Pàdoa': ['kanpo = 840 tòla'],
			'Viŧenŧa': ['kanpo = 840 tòla'],

			'Venèŧia': ['kanpo = 840 tòla', 'milèr = 1000 gèbo = 1 pèrtega (cea)\u00B2'],

			'Fèltre': ['kanpo = 5 stèr = 250 tòla'],

			'Mèl': ['kanpo = 7 stèr = 250 tòla'],

			'Roigo': ['kanpo = 24 vaneŧa = 35 tòla'],

			'Verona': ['kanpo = 24 vaneŧa = 30 tòla']
		};

		return function(place){
			return units[place] || [];
		};
	}());


	var getMeasureVolumeDry = (function(){
		var conversions = {
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

		return function(place){
			place = reducePlaceVolumeDry(place);

			var a = (place.match(/Venèŧia/)? 'stèr': 'sako'),
				m = new MeasureConverter([], a);
			getUnitsVolumeDry(a, place).forEach(function(unit){
				m.addUnit(unit);
			});

			m.addConverter(m, MeasureSI.volume, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var addCommonPlaceVolume = function(places){
		places['Pàdoa'] = /^(Dòlo|Ŧitadèla)$/;
		places['Verona'] = /^(Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave)$/;
		places['Viŧenŧa'] = /^(Arxiñan|Axiago|Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène)$/;
	};

	/** @private */
	var reducePlaceVolumeDry = (function(){
		var places = {
			'Trevixo': /^(Kastelfranko|Kuèr|Meduna de Livenŧa|Mèstre|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/,
			'Venèŧia': /^(Còxa)$/
		};
		addCommonPlaceVolume(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	/** @private */
	var getUnitsVolumeDry = function(a, place){
		var units = {
			'Àxol': [a + ' = 4 kuarta = 3 vigano = 4 minèla'],

			'Belun': [a + ' = 8 kalvéa = 4 kuartaròl = 2 međeto = 2 minèla'],
			'Céneda': [a + ' = 8 kalvéa = 4 kuartaròl = 2 međeto = 2 minèla'],
			'Vitòrio': [a + ' = 8 kalvéa = 4 kuartaròl = 2 međeto = 2 minèla'],

			'Fèltre': [a + ' = 4 stèr = 4 kuarta = 2 međeto = 2 minèla'],

			'Lendinara': [a + ' = 3 staro = 4 kuarta = 2 međeto = 2 minèla'],

			'Pàdoa': ['mòjo = 3 ' + a + ' = 4 staro = 4 kuarta = 4 kopo = 3 skodèla'],

			'Piève de Kador': [a + ' = 3 kalvéa = 4 kuartaròl = 2 međeto = 2 minèla'],

			'Badía Polèxine': [a + ' = 3 staro = 4 kuarta = 4 kuartaròl = 3 skodèla'],
			'Roigo': [a + ' = 3 staro = 4 kuarta = 4 kuartaròl = 3 skodèla'],

			'Konejan': [a + ' = 4 kuarta = 4 kuartièr = 2 međeto = 2 minèla'],
			'Mèl': [a + ' = 4 kuarta = 4 kuartièr = 2 međeto = 2 minèla'],
			'Mòta de Livenŧa': [a + ' = 4 kuarta = 4 kuartièr = 2 međeto = 2 minèla'],
			'Trevixo': [a + ' = 4 kuarta = 4 kuartièr = 2 međeto = 2 minèla'],

			'Venèŧia': ['mòjo = 4 ' + a + ' = 2 međèno = 2 kuarta = 4 kuartaròl = 2 međeto = 2 minèla'],

			'Verona': [a + ' = 3 minale = 4 kuarta = 4 kuartaròl = 2 međeto = 2 minèla'],

			'Basan': [a + ' = 4 staro = 4 kuarta = 4 kuartaròl = 2 međeto = 2 minèla'],
			'Viŧenŧa': [a + ' = 4 staro = 4 kuarta = 4 kuartaròl = 2 međeto = 2 minèla']
		};

		return units[place] || [];
	};

	var getMeasureVolumeLiquid = (function(){
		var conversions = {
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

		return function(place){
			place = reducePlaceVolumeLiquid(place);

			var a = (place.match(/Mèl|Mòta de Livenŧa|Trevixo \(ŧità\)/)? 'konđo': 'mastèl'),
				m = new MeasureConverter([], a);
			getUnitsVolumeLiquid(a, place).forEach(function(unit){
				m.addUnit(unit);
			});

			if(place.match(/Trevixo \((ŧità|kanpaña)\)/))
				place = 'Trevixo';
			m.addConverter(m, MeasureSI.volume, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var getUnitsVolumeLiquid = function(a, place){
		var units = {
			'Àxol': ['bote = 10 ' + a + ' = 6 seco = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Badía Polèxine': [a + ' = 54 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Basan': ['bote = 10 ' + a + ' = 8 seco = 4 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Belun': [a + ' = 5 seco = 8 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],
			'Piève de Kador': [a + ' = 5 seco = 8 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Céneda': [a + ' = 6 seco = 2 bokal = 6 ingistara = 2 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Còxa': [a + ' = 8 seco = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Fèltre': [a + ' = 60 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Konejan': [a + ' = 2 masteleto = 3 seco = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Lendinara': [a + ' = 54 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Mèl': [a + ' = 46 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],
			'Mèstre': [a + ' = 46 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Mòta de Livenŧa': [a + ' = 72 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Pàdoa': [a + ' = 8 seco = 9 bòŧe = 2 píkolo = 2 gòto'],

			'Roigo': [a + ' = 1.5 masteleto = 4 seco = 9 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Trevixo (ŧità)': ['bote = 10 ' + a + ' = 6 seca = 8 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],
			'Trevixo (kanpaña)': ['bote = 10 ' + a + ' = 6 seca = 6 bokal = 2 bòŧe = 2 píkolo = 2 gòto'],

			'Venèŧia': ['burco = 60 bote = 1.25 ànfota = 4 bigonxo = 2 ' + a + ' = 7 seco = 2 bokal = 4 kuartuŧo = 2 píkolo = 2 gòto', 'baril = 6 seco'],

			'Verona': ['bote = 8 ' + a + ' = 1.5 brento = 2 seca = 2 bokal = 6 ingistara = 4 gòto'],

			//'Vitòrio': [a + ' = 1.5 brenta = 2 seca = 2 bokal = 6 ingistara = 4 gòto'],

			'Viŧenŧa': ['bote = 8 ' + a + ' = 6 seca = 2 seco = 5 bokal']
		};

		return units[place] || [];
	};

	/** @private */
	var reducePlaceVolumeLiquid = (function(){
		var places = {
			'Trevixo (kanpaña)': /^(Kastelfranko|Kuèr|Meduna de Livenŧa|Trè Pòrti)$/
		};
		addCommonPlaceVolume(places);

		return FunctionHelper.curry(reducePlace, [places]);
	})();


	var getMeasureWeightHeavy = (function(){
		var conversions = {
			'Mèl':		510.2271,
			//pal dekreto del Senato de 'l 6 April 1737 el pexo fin el ga da èser 1.02 'olte kuelo de Venèŧia
			'Pàdoa':		301.22966 * (768 / 485) * 1.02,
			'Roigo':		477.2942,
			//pal dekreto del Senato de 'l 6 April 1737 el pexo fin el ga da èser 1 e 1/12 'olte kuelo de Venèŧia
			'Trevixo':	301.22966 * (768 / 485) * (13 / 12),
			//doparàa kome pexo par presioxi, sora de tuto par òro, arđento, e xème preŧioxe
			//(pal Sovrano Decreto de 'l 1575 se ga ke 768 libre gròse le fà 485 libre fine)
			'Venèŧia':	301.22966 * (768 / 485),
			//na volta e mèđa la só libra fina
			'Verona':	333.1757 * 1.5
		};

		return function(place){
			place = reducePlaceWeightHeavy(place);

			var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 12 onŧa = 6 saŧo = 32 karato = 24 gran', 'libra');

			m.addConverter(m, MeasureSI.weight, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var reducePlaceWeightHeavy = (function(){
		var places = {
			'Trevixo': /^(Àxol|Belun|Céneda|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèstre|Mòta de Livenŧa|Piève de Kador|Trè Pòrti|Trevixo \((ŧità|kanpaña)\))$/,
			'Pàdoa': /^(Arxiñan|Axiago|Basan|Dòlo|Ŧitadèla|Viŧenŧa)$/,
			'Roigo': /^(Badía Polèxine|Lendinara)$/,
			'Venèŧia': /^(Còxa)$/,
			'Verona': /^(Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave)$/,
			'Viŧenŧa': /^(Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène)$/
		};

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	var getMeasureWeightLight = (function(){
		var conversions = {
			'Badía Polèxine': 339.0974,
			'Roigo':		301.4160,
			//pal dekreto del Senato de 'l 6 April 1737 el pexo fin el ga da èser 1.125 'olte kuelo de Venèŧia
			'Trevixo':	301.22966 * 1.125,
			//doparàa kome pexo par medexine
			'Venèŧia':	301.22966,
			'Verona':	333.1757
		};

		return function(place){
			place = reducePlaceWeightLight(place);

			var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 12 onŧa = 6 saŧo = 4 skrúpolo = 6 karato = 4 gran', 'libra');
			m.addUnit('karga = 4 kantaro');

			m.addConverter(m, MeasureSI.weight, conversions[place]);

			return m;
		};
	})();

	/** @private */
	var reducePlaceWeightLight = (function(){
		var places = {
			'Trevixo': /^(Arxiñan|Axiago|Àxol|Fèltre|Kastelfranko|Konejan|Kuèr|Meduna de Livenŧa|Mèl|Mèstre|Mòta de Livenŧa|Pàdoa|Trè Pòrti|Trevixo \((ŧità|kanpaña)\)|Viŧenŧa)$/,
			'Roigo': /^(Lendinara)$/,
			'Venèŧia': /^(Belun|Céneda|Còxa|Piève de Kador|Pàdoa|Basan|Dòlo|Ŧitadèla)$/,
			'Verona': /^(Kaldièro|San Bonifaco|San Martin Bon Albèrgo|Soave)$/,
			'Viŧenŧa': /^(Kamixan viŧentin|Lonigo|Montebèl|Rekoaro|Skio|Thiène)$/
		};

		return FunctionHelper.curry(reducePlace, [places]);
	})();

	var getMeasureWeightMedicinal = function(){
		var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 12 onŧa = 6 saŧo = 4 skrúpolo = 6 karato = 4 gran', 'libra');
		m.addUnit('karga = 4 kantaro');

		//se dopara la libra fina de Venèŧia
		m.addConverter(m, MeasureSI.weight, 301.22966);

		return m;
	};

	var getMeasureWeightPreciouses = function(){
		var m = new MeasureConverter('milèr = 10 kantaro = 4 miro = 25 libra = 2 marko = 6 onŧa = 6 saŧo = 4 skrúpolo = 6 karato = 4 gran', 'libra');
		m.addUnit('karga = 4 kantaro');

		//se dopara la libra gròsa de Venèŧia
		m.addConverter(m, MeasureSI.weight, 476.99872);

		return m;
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
