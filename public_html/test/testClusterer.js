//www2.hu-berlin.de/vivaldi/index.php?id=mV001&lang=it
require(['tools/data/Clusterer', 'tools/data/StringDistance'], function(Clusterer, StringDistance){
	QUnit.module('Clusterer');

	QUnit.test('test', function(){
		//construct the data
		var variants = ['Rèba', 'Cortina', 'Plòdn', 'Padola', 'Costalta', 'Auronzo', 'Pozzale', 'Verona', 'Cencenighe', 'Casan', 'Tarzo', 'Belluno', 'San Stino', 'Venezia'],
			words = [
			//y is g with a gamma above
			//A is alpha with d above
				['la',   'r',   's',     'l',   'l',   'l',   'al',  'l',    'l',    'l',    'l',    'l',    'l',    'l'],
				['yèga', 'aga', 'vòser', 'ayA', 'aga', 'aga', 'èga', 'akwa', 'akwa', 'akwa', 'akwa', 'akwa', 'akwa', 'akwa']
			],
			size = variants.length,
			matrix = [],
			costs = {insertion: 1, deletion: 1, modification: 0.5},
			i, j, distance;
		for(i = 0; i < size; i ++){
			matrix[i] = [];
			matrix[i][i] = 0;
		}

		//calculate average of distances
		words.forEach(function(word){
			for(i = 0; i < size; i ++)
				for(j = i + 1; j < size; j ++)
					matrix[i][j] = (matrix[i][j] || 0) + StringDistance.getStructuralDistance(word[i], word[j], costs);
		});
		for(i = 0; i < size; i ++)
			for(j = i + 1; j < size; j ++)
				matrix[i][j] /= words.length;

		//cluster variants
		var clusteredVariants = Clusterer.cluster(matrix, variants);

		equal(clusteredVariants, '((variante 1|variante 2)|variante 3)');
	});
});
