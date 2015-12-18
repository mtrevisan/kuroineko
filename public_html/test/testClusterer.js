//www2.hu-berlin.de/vivaldi/index.php?id=mV001&lang=it
require(['tools/data/Clusterer', 'tools/data/StringDistance'], function(Clusterer, StringDistance){
	QUnit.module('Clusterer');

	QUnit.test('test', function(){
		//construct the data
		var variants = [
				'Rèba',   'Cortina', 'Padola', 'Costalta', 'Auronzo', 'Pozzale', 'Verona', 'Cencenighe', 'Casan',  'Tarzo',  'Belluno', 'San Stino', 'Venezia', 'Crespadoro', 'Albisano', 'Montebello', 'Teolo',  'Romano', 'Vas',    'Tonezza', 'Vicenza', 'Lovadina', 'Campo San Martino', 'Istrana', 'Raldon', 'Meolo',  'Cerea',  'Fratta Polesine', 'Villa Estense', 'Cavarzare'],
			words = [
				['la'	,   'r',       'l',      'l',        'l',       'al',      'l',      'l',          'l',      'l',      'l',       'l',         'l',       'l',          'l',        'l',          'è',      'l',      'l',      'l',       'l',       'l',        'l',                 'l',       'l',      'l',      'l',      'l',               'l',             'è'],
				['yèga',  'aga',     'aga',    'aga',      'aga',     'èga',     'akwa',   'akwa',       'akwa',   'akwa',   'akwa',    'akwa',      'akwa',    'akwa',       'akwa',     'akwa',       'akwa',   'akwa',   'akwa',   'akwa',    'akwa',    'akwa',     'akwa',              'akwa',    'akwa',   'akwa',   'akwa',   'akwa',            'akwa',          'akwa'],
				['e',     'e',       'è',      'e',        'è',       'e',       'e',      'e',          'e',      'e',      'e',       'e',         'xe',      'e',          'e',        'xe',         'xe',     'xe',     'e',      'xe',      'xe',      'e',        'xe',                'xe',      'e',      'xe',     'e',      'xe',              'xe',            'xe'],
				['cauda', 'còuda',   'cauda',  'cauda',    'cauda',   'cauđa',   'kalda',  'kalda',      'kalda',  'kalda',  'kalda',   'kalda',     'kalda',   'kalda',      'kalda',    'kalda',      'kalda',  'kalda',  'kalda',  'kalda',   'kalda',   'kalda',    'kalda',             'kalda',   'kalda',  'kalda',  'kalda',  'kalda',           'kalda',         'kalda'],
				['añel',  'añel',    'añel',   'añel',     'añèl',    'ketin',   'añèl',   'ñèl',        'ñèl',    'ñèl',    'ñèl',     'ñèl',       'añèo',    'añèlo',      'añèl',     'añelo',      'añèo',   'añèo',   'añèl',   'añèlo',   'añelo',   'ñèl',      'añèo',              'añèo',    'añè',    'añèo',   'añèl',   'pjegorin',        'añèlo',         'pegorin'],
				['ai',    'ai',      'ai',     'ai',       'ai',      'ai',      'ajo',    'ai',         'ai',     'ajo',    'ai',      'ajo',       'aɉo',     'ajo',        'ai',       'ajo',        'ajo',    'ajo',    'ai',     'ajo',     'ajo',     'ajo',      'ajo',               'ajo',     'ajo',    'ajo',    'ajo',    'aju',             'ajo',           'ajo'],
				['agoʃt', 'agoʃto',  'agostu', 'agosto',   'agosto',  'agosto',  'agosto', 'agost',      'agosto', 'agosto', 'agosto',  'agosto',    'agosto',  'agosto',     'agosto',   'agosto',     'agosto', 'agosto', 'agosto', 'agosto',  'agosto',  'gosto',    'agosto',            'agosto',  'agosto', 'agosto', 'agosto', 'agosto',          'agosto',        'agosto'],
				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
			],
			size = variants.length,
			matrix = [],
			costs = {insertion: 1, deletion: 1, modification: 0.5},
			i, j;
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
