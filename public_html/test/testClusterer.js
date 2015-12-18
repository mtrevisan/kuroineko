//www2.hu-berlin.de/vivaldi/index.php?id=mV001&lang=it
require(['tools/data/Clusterer', 'tools/data/StringDistance'], function(Clusterer, StringDistance){
	QUnit.module('Clusterer');

	QUnit.test('test', function(){
		//construct the data
		var variants = [
				'Rèba',    'Cortina', 'Padola',  'Costalta', 'Auronzo', 'Pozzale', 'Verona',  'Cencenighe', 'Casan',   'Tarzo',   'Belluno', 'San Stino', 'Venezia', 'Crespadoro', 'Albisano', 'Montebello', 'Teolo',   'Romano',  'Vas',     'Tonezza', 'Vicenza', 'Lovadina', 'Campo San Martino', 'Istrana', 'Raldon',  'Meolo',   'Cerea',   'Fratta Polesine', 'Villa Estense', 'Cavarzare'],
			words = [
				['la'	,    'r',       'l',       'l',        'l',       'al',      'l',       'l',          'l',       'l',       'l',       'l',         'l',       'l',          'l',        'l',          'è',       'l',       'l',       'l',       'l',       'l',        'l',                 'l',       'l',       'l',       'l',       'l',               'l',             'è'],
				['yèga',   'aga',     'aga',     'aga',      'aga',     'èga',     'akwa',    'akwa',       'akwa',    'akwa',    'akwa',    'akwa',      'akwa',    'akwa',       'akwa',     'akwa',       'akwa',    'akwa',    'akwa',    'akwa',    'akwa',    'akwa',     'akwa',              'akwa',    'akwa',    'akwa',    'akwa',    'akwa',            'akwa',          'akwa'],
				['e',      'e',       'è',       'e',        'è',       'e',       'e',       'e',          'e',       'e',       'e',       'e',         'xe',      'e',          'e',        'xe',         'xe',      'xe',      'e',       'xe',      'xe',      'e',        'xe',                'xe',      'e',       'xe',      'e',       'xe',              'xe',            'xe'],
				['cauda',  'còuda',   'cauda',   'cauda',    'cauda',   'cauđa',   'kalda',   'kalda',      'kalda',   'kalda',   'kalda',   'kalda',     'kalda',   'kalda',      'kalda',    'kalda',      'kalda',   'kalda',   'kalda',   'kalda',   'kalda',   'kalda',    'kalda',             'kalda',   'kalda',   'kalda',   'kalda',   'kalda',           'kalda',         'kalda'],
				['añel',   'añel',    'añel',    'añel',     'añèl',    'ketin',   'añèl',    'ñèl',        'ñèl',     'ñèl',     'ñèl',     'ñèl',       'añèo',    'añèlo',      'añèl',     'añelo',      'añèo',    'añèo',    'añèl',    'añèlo',   'añelo',   'ñèl',      'añèo',              'añèo',    'añè',     'añèo',    'añèl',    'pjegorin',        'añèlo',         'pegorin'],
				['ai',     'ai',      'ai',      'ai',       'ai',      'ai',      'ajo',     'ai',         'ai',      'ajo',     'ai',      'ajo',       'aɉo',     'ajo',        'ai',       'ajo',        'ajo',     'ajo',     'ai',      'ajo',     'ajo',     'ajo',      'ajo',               'ajo',     'ajo',     'ajo',     'ajo',     'aju',             'ajo',           'ajo'],
				['agoʃt',  'agoʃto',  'agostu',  'agosto',   'agosto',  'agosto',  'agosto',  'agost',      'agosto',  'agosto',  'agosto',  'agosto',    'agosto',  'agosto',     'agosto',   'agosto',     'agosto',  'agosto',  'agosto',  'agosto',  'agosto',  'gosto',    'agosto',            'agosto',  'agosto',  'agosto',  'agosto',  'agosto',          'agosto',        'agosto'],
				['ala',    'uʒòra',   'alè',     'ala',      'ala',     'ala',     'ala',     'ala',        'ala',     'ala',     'ala',     'aƚa',       'aƚa',     'ala',        'ala',      'ala',        'ala',     'aƚa',     'ala',     'ala',     'ala',     'aƚa',      'aƚa',               'ala',     'ala',     'aƚa',     'ala',     'ala',             'ala',           'aƚa'],
				['àut',    'òuto',    'àutu',    'àuto',     'àuto',    'àuto',    'àlto',    'àut',        'àlt',     'àlt',     'àlt',     'àlŧ',       'àlto',    'àlto',       'àlt',      'àlto',       'àlto',    'àlto',    'àlt',     'àlto',    'àlto',    'àlt',      'àlto',              'àlto',    'àlto',    'àlto',    'àlto',    'àlt',             'àlto',          'àlto'],
				['àuter',  'òutro',   'àuter',   'àutro',    'àutro',   'àutro',   'àltro',   'àltro',      'àltro',   'àltro',   'àltro',   'àltro',     'àltro',   'àltro',      'àlter',    'àltro',      'àltro',   'àltro',   'àltro',   'àltro',   'àltro',   'àltro',    'àltro',             'àltro',   'àltro',   'àltro',   'àltro',   'àltro',           'àntro',         'àntro'],
				['dame',   'dame',    'dam',     'dame',     'dame',    'damin',   'dame',    'dame',       'dame',    'dame',    'dame',    'dami',      'dame',    'dame',       'dame',     'dame',       'dam',     'dame',    'dame',    'damene',  'dame',    'dame',     'dame',              'dame',    'dame',    'dame',    'dame',    'damene',          'dame',          'dame'],
				['n',      'un',      'n',       'un',       'un',      'un',      'n',       'n',          'n',       'n',       'n',       'un',        'un',      'un',         'n',        'n',          'un',      'n',       'n',       'n',       'un',      'n',        'n',                 'n',       'n',       'n',       'n',       'un',              'n',             'n'],
				['tòk',    'tòko',    'bukon',   'bokon',    'tòko',    'tòko',    'tòko',    'tòkh',       'tòkh',    'tòk',     'tòk',     'tòk',       'tòko',    'tòko',       'tòk',      'tòko',       'tòko',    'tòko',    'tokh',    'tòko',    'tòko',    'tok',      'tòko',              'tòko',    'tòko',    'tòko',    'tòko',    'tòku',            'tòko',          'tòko'],
				['anɉelo', 'anʒelu',  'angel',   'angul',    'anɉel',   'andol',   'anɉelo',  'anɉelo',     'anɉelo',  'anɉelo',  'andol',   'anɉeo',     'anɉeo',   'anɉelo',     'anɉelo',   'anɉelo',     'anɉeo',   'anɉeo',   'anɉelo',  'anɉelo',  'anɉelo',  'anɉeo',    'anɉeo',             'anɉeo',   'anɉelo',  'anɉeo',   'anɉelo',  'anxeu',           'andolo',        'anɉeu'],
				['an',     'an',      'an',      'an',       'an',      'an',      'ano',     'an',         'an',      'an',      'an',      'ano',       'ano',     'ano',        'an',       'ano',        'ano',     'ano',     'an',      'ano',     'ano',     'ano',      'ano',               'ano',     'ano',     'ano',     'ano',     'anu',             'ano',           'anu'],
				['auril',  'aprile',  'aprili',  'aprile',   'avril',   'aprile',  'april',   'auril',      'aprile',  'aprile',  'avril',   'aprile',    'aprile',  'aprile',     'avril',    'aprile',     'apriƚe',  'aprie',   'april',   'aprile',  'aprile',  'aprie',    'aprie',             'aprie',   'april',   'aprile',  'april',   'april',           'aprile',        'aprie'],
				['arʒent', 'arzento', 'arđento', 'ardentu',  'ardento', 'arđento', 'arɉento', 'ardent',     'arɉento', 'arɉento', 'ardento', 'arɉento',   'arxento', 'arɉento',    'arzent',   'arɉento',    'arɉento', 'arjento', 'arɉento', 'arzento', 'arɉento', 'arɉentio', 'arɉento',           'arɉento', 'arɉento', 'arɉento', 'arɉento', 'arzento',         'arɉento',       'arɉento'],
				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
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

		equal(clusteredVariants, '((((((((((Campo San Martino|Romano)|Meolo)|Venezia)|Istrana)|((Montebello|Vicenza)|(Tonezza|Villa Estense)))|Teolo)|Cavarzare)|Fratta Polesine)|(((((Cerea|Verona)|Crespadoro)|Raldon)|((San Stino|Tarzo)|Lovadina))|(((Belluno|Casan)|Cencenighe)|(Albisano|Vas))))|(((((Auronzo|Costalta)|Padola)|Rèba)|Pozzale)|Cortina))');
	});
});
