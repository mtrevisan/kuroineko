/**
 * @class MeasureVeneto
 *
 * @author Mauro Trevisan
 */
define(['tools/measure/MeasureConverter'], function(MeasureConverter){

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


	return {
		length: createSIMeasure('m', [7, 11, 12]),
		area: createSIMeasure('m\u00B2', [7]),
		volume: createSIMeasure('l', [8, 10, 11, 12]),
		weight: createSIMeasure('g', [7, 8, 12])
	};

});
