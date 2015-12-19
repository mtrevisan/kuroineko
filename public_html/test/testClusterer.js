//www2.hu-berlin.de/vivaldi/index.php?id=mV001&lang=it
require(['tools/data/Clusterer', 'tools/data/StringDistance'], function(Clusterer, StringDistance){
	QUnit.module('Clusterer');

	QUnit.test('test', function(){
		//construct the data
		var variants = [
				'Rèba',     'Cortina', 'Padola',  'Costalta', 'Auronzo', 'Pozzale', 'Verona',  'Cencenighe', 'Casan',   'Tarzo',   'Belluno', 'San Stino', 'Venezia', 'Crespadoro', 'Albisano', 'Montebello', 'Teolo',   'Romano',  'Vas',     'Tonezza', 'Vicenza', 'Lovadina', 'Campo San Martino', 'Istrana', 'Raldon',  'Meolo',   'Cerea',   'Fratta Polesine', 'Villa Estense', 'Cavarzare'],
			//K = kh, P = ph
			words = [
				['l'	,     'el',      'al',      'al',       'il',      'al',      'el',      'el',         'al',      'al',      'al',      'el',        'el',      'el',         'el',       'el',         'el',      'el',      'al',      'el',      'el',      'el',       'el',                'el',      'el',      'el',      'el',      'el',              'el',            'e'],
				['la'	,     'r',       'l',       'l',        'l',       'al',      'l',       'l',          'l',       'l',       'l',       'l',         'l',       'l',          'l',        'l',          'è',       'l',       'l',       'l',       'l',       'l',        'l',                 'l',       'l',       'l',       'l',       'l',               'l',             'è'],
				['la',      'ra',      'la',      'la',       'la',      'la',      'la',      'la',         'la',      'la',      'la',      'a',         'ea',      'la',         'la',       'la',         'ea',      'a',       'la',      'la',      'la',      'a',        'a',                 'a',       'a',       'a',       'la',      'la',              'la',            'ea'],
				['yèga',    'aga',     'aga',     'aga',      'aga',     'èga',     'akwa',    'akwa',       'akwa',    'akwa',    'akwa',    'akwa',      'akwa',    'akwa',       'akwa',     'akwa',       'akwa',    'akwa',    'akwa',    'akwa',    'akwa',    'akwa',     'akwa',              'akwa',    'akwa',    'akwa',    'akwa',    'akwa',            'akwa',          'akwa'],
				['e',       'e',       'è',       'e',        'è',       'e',       'e',       'e',          'e',       'e',       'e',       'e',         'xe',      'e',          'e',        'xe',         'xe',      'xe',      'e',       'xe',      'xe',      'e',        'xe',                'xe',      'e',       'xe',      'e',       'xe',              'xe',            'xe'],
				['cauda',   'còuda',   'cauda',   'cauda',    'cauda',   'cauđa',   'kalda',   'kalda',      'kalda',   'kalda',   'kalda',   'kalda',     'kalda',   'kalda',      'kalda',    'kalda',      'kalda',   'kalda',   'kalda',   'kalda',   'kalda',   'kalda',    'kalda',             'kalda',   'kalda',   'kalda',   'kalda',   'kalda',           'kalda',         'kalda'],
				['añel',    'añel',    'añel',    'añel',     'añèl',    'ketin',   'añèl',    'ñèl',        'ñèl',     'ñèl',     'ñèl',     'ñèl',       'añèo',    'añèlo',      'añèl',     'añelo',      'añèo',    'añèo',    'añèl',    'añèlo',   'añelo',   'ñèl',      'añèo',              'añèo',    'añè',     'añèo',    'añèl',    'pjegorin',        'añèlo',         'pegorin'],
				['ai',      'ai',      'ai',      'ai',       'ai',      'ai',      'ajo',     'ai',         'ai',      'ajo',     'ai',      'ajo',       'aɉo',     'ajo',        'ai',       'ajo',        'ajo',     'ajo',     'ai',      'ajo',     'ajo',     'ajo',      'ajo',               'ajo',     'ajo',     'ajo',     'ajo',     'aju',             'ajo',           'ajo'],
				['agoʃt',   'agoʃto',  'agostu',  'agosto',   'agosto',  'agosto',  'agosto',  'agost',      'agosto',  'agosto',  'agosto',  'agosto',    'agosto',  'agosto',     'agosto',   'agosto',     'agosto',  'agosto',  'agosto',  'agosto',  'agosto',  'gosto',    'agosto',            'agosto',  'agosto',  'agosto',  'agosto',  'agosto',          'agosto',        'agosto'],
				['ala',     'uʒòra',   'alè',     'ala',      'ala',     'ala',     'ala',     'ala',        'ala',     'ala',     'ala',     'aƚa',       'aƚa',     'ala',        'ala',      'ala',        'ala',     'aƚa',     'ala',     'ala',     'ala',     'aƚa',      'aƚa',               'ala',     'ala',     'aƚa',     'ala',     'ala',             'ala',           'aƚa'],
				['àut',     'òuto',    'àutu',    'àuto',     'àuto',    'àuto',    'àlto',    'àut',        'àlt',     'àlt',     'àlt',     'àlŧ',       'àlto',    'àlto',       'àlt',      'àlto',       'àlto',    'àlto',    'àlt',     'àlto',    'àlto',    'àlt',      'àlto',              'àlto',    'àlto',    'àlto',    'àlto',    'àlt',             'àlto',          'àlto'],
				['àuter',   'òutro',   'àuter',   'àutro',    'àutro',   'àutro',   'àltro',   'àltro',      'àltro',   'àltro',   'àltro',   'àltro',     'àltro',   'àltro',      'àlter',    'àltro',      'àltro',   'àltro',   'àltro',   'àltro',   'àltro',   'àltro',    'àltro',             'àltro',   'àltro',   'àltro',   'àltro',   'àltro',           'àntro',         'àntro'],
				['dame',    'dame',    'dam',     'dame',     'dame',    'damin',   'dame',    'dame',       'dame',    'dame',    'dame',    'dami',      'dame',    'dame',       'dame',     'dame',       'dam',     'dame',    'dame',    'damene',  'dame',    'dame',     'dame',              'dame',    'dame',    'dame',    'dame',    'damene',          'dame',          'dame'],
				['n',       'un',      'n',       'un',       'un',      'un',      'n',       'n',          'n',       'n',       'n',       'un',        'un',      'un',         'n',        'n',          'un',      'n',       'n',       'n',       'un',      'n',        'n',                 'n',       'n',       'n',       'n',       'un',              'n',             'n'],
				['tòk',     'tòko',    'bukon',   'bokon',    'tòko',    'tòko',    'tòko',    'tòK',        'tòK',     'tòk',     'tòk',     'tòk',       'tòko',    'tòko',       'tòk',      'tòko',       'tòko',    'tòko',    'toK',     'tòko',    'tòko',    'tok',      'tòko',              'tòko',    'tòko',    'tòko',    'tòko',    'tòku',            'tòko',          'tòko'],
				['anɉelo',  'anʒelu',  'angel',   'angul',    'anɉel',   'andol',   'anɉelo',  'anɉelo',     'anɉelo',  'anɉelo',  'andol',   'anɉeo',     'anɉeo',   'anɉelo',     'anɉelo',   'anɉelo',     'anɉeo',   'anɉeo',   'anɉelo',  'anɉelo',  'anɉelo',  'anɉeo',    'anɉeo',             'anɉeo',   'anɉelo',  'anɉeo',   'anɉelo',  'anxeu',           'andolo',        'anɉeu'],
				['an',      'an',      'an',      'an',       'an',      'an',      'ano',     'an',         'an',      'an',      'an',      'ano',       'ano',     'ano',        'an',       'ano',        'ano',     'ano',     'an',      'ano',     'ano',     'ano',      'ano',               'ano',     'ano',     'ano',     'ano',     'anu',             'ano',           'anu'],
				['auril',   'aprile',  'aprili',  'aprile',   'avril',   'aprile',  'april',   'auril',      'aprile',  'aprile',  'avril',   'aprile',    'aprile',  'aprile',     'avril',    'aprile',     'apriƚe',  'aprie',   'april',   'aprile',  'aprile',  'aprie',    'aprie',             'aprie',   'april',   'aprile',  'april',   'april',           'aprile',        'aprie'],
				['arʒent',  'arzento', 'arđento', 'ardentu',  'ardento', 'arđento', 'arɉento', 'ardent',     'arɉento', 'arɉento', 'ardento', 'arɉento',   'arxento', 'arɉento',    'arzent',   'arɉento',    'arɉento', 'arjento', 'arɉento', 'arzento', 'arɉento', 'arɉentio', 'arɉento',           'arɉento', 'arɉento', 'arɉento', 'arɉento', 'arzento',         'arɉento',       'arɉento'],
				['auton',   'outon',   'utònu',   'otuno',    'autono',  'auton',   'autuno',  'autun',      'autuno',  'autuno',  'autuno',  'autuno',    'autuno',  'autuno',     'autuno',   'autuno',     'autuno',  'autuno',  'autuno',  'autuno',  'autuno',  'autuno',   'autuno',            'autuno',  'autuno',  'autuno',  'autuno',  'autuno',          'autuno',        'autuno'],
				['bek',     'bèko',    'beku',    'beko',     'bèko',    'bèko',    'beko',    'bèK',        'bèK',     'bèk',     'bèK',     'bèk',       'bèko',    'bèko',       'bèK',      'bèko',       'bèko',    'bèko',    'bèK',     'bèko',    'bèko',    'bèk',      'bèko',              'bèko',    'beko',    'bèko',    'bèko',    'bèko',            'bèko',          'bèko'],
				['bel',     'bèl',     'bel',     'bel',      'bèl',     'bèl',     'bèlo',    'bèl',        'bèl',     'bèl',     'bèl',     'bèl',       'bèo',     'bèlo',       'bèl',      'bèlo',       'bèo',     'bèo',     'bèl',     'bèlo',    'bèlo',    'bèo',      'bèo',               'bèo',     'belo',    'bèo',     'bèlo',    'bèo',             'bèƚo',          'bèo'],
				['bela',    'bèla',    'bela',    'bela',     'bèla',    'bèla',    'bèla',    'bèla',       'bèla',    'bèa',     'bèla',    'bèa',       'bèa',     'bèla',       'bèla',     'bèla',       'bèa',     'bèa',     'bèla',    'bèla',    'bèla',    'bèa',      'bèa',               'bèa',     'bela',    'bèa',     'bèla',    'bèa',             'bèƚa',          'bèa'],
				['bjei',    'bjei',    'bi',      'böi',      'bjei',    'bjei',    'bèi',     'bjei',       'bèi',     'bèi',     'bèi',     'bèi',       'bèi',     'bèi',        'bèi',      'bèi',        'bèi',     'bèi',     'bèi',     'bèi',     'bèi',     'bèi',      'bèi',               'bèi',     'bèi',     'bèi',     'bèi',     'bèi',             'bèi',           'bèi'],
				['bele',    'bèlis',   'bele',    'bele',     'bèle',    'bèle',    'bèle',    'bèle',       'bèle',    'bèe',     'bèle',    'bèe',       'bèe',     'bèle',       'bèle',     'bèle',       'bèe',     'bèe',     'bèle',    'bèle',    'bèle',    'bèe',      'bèe',               'bèe',     'bele',    'bèe',     'bèle',    'bèe',             'bèe',           'bèe'],
				['can',     'can',     'can',     'cön',      'can',     'can',     'kan',     'kan',        'kan',     'kan',     'kan',     'kan',       'kan',     'kan',        'kã',       'kan',        'kan',     'kan',     'kan',     'kan',     'kan',     'kan',      'kan',               'kan',     'kan',     'kan',     'kan',     'kan',             'kan',           'kan'],
				['n',       'un',      'n',       'un',       'n',       'an',      'un',      'en',         'an',      'un',      'an',      'un',        'un',      'un',         'en',       'on',         'un',      'on',      'an',      'un',      'on',      'un',       'un',                'un',      'un',      'un',      'un',      'un',              'on',            'un'],
				['cèxa',    'caxa',    'cexa',    'cida',     'caxa',    'caxa',    'kaxa',    'kaxa',       'kaxa',    'kaxa',    'kaxa',    'kaxa',      'kaxa',    'kaxa',       'ka',       'kaxa',       'kaxa',    'kaxa',    'kaxa',    'kaxa',    'kaxa',    'kaxa',     'kaxa',              'kaxa',    'kaxa',    'kaxa',    'kaxa',    'kaxa',            'kaxa',          'kaxa'],
				['blank',   'bjanko',  'bjanku',  'bjanko',   'bjanko',  'bjanco',  'bjanko',  'bjank',      'bjanK',   'bjank',   'bjank',   'bjanko',    'bjanko',  'bjanko',     'bjanK',    'bjanko',     'bjanko',  'bjanko',  'bjanK',   'bjanko',  'bjanko',  'bjanko',   'bjanko',            'bjanko',  'bjanko',  'bjanko',  'bjanko',  'bjanko',          'bjanko',        'bjanko'],
				['boca',    'boca',    'boca',    'boca',     'boca',    'boca',    'boka',    'boka',       'boka',    'boka',    'boka',    'boka',      'boka',    'boka',       'boka',     'boka',       'boka',    'boka',    'boka',    'boka',    'boka',    'boka',     'boka',              'boka',    'boka',    'boka',    'boka',    'boka',            'boka',          'boka'],
				['brac',    'brazo',   'braŧu',   'braŧo',    'braŧo',   'braŧ',    'braso',   'braŧ',       'braŧ',    'braz',    'braŧ',    'bras',      'braso',   'braso',      'bras',     'braso',      'braso',   'braso',   'braŧ',    'braso',   'braso',   'bras',     'braso',             'braso',   'braso',   'braso',   'braŧo',   'braso',           'braso',         'braso'],
				['bun',     'bon',     'bon',     'bon',      'bon',     'bon',     'bòn',     'bon',        'bòn',     'bòn',     'bòn',     'bon',       'bon',     'bon',        'boo',      'bòn',        'bon',     'bon',     'bon',     'bòn',     'bòn',     'bon',      'bon',               'bon',     'bon',     'bon',     'bòn',     'bon',             'bòn',           'bòn'],
				['bona',    'bòna',    'bona',    'bona',     'bòna',    'bona',    'bòna',    'bona',       'bòna',    'bòna',    'bòna',    'bona',      'bona',    'bona',       'bona',     'bòna',       'bòna',    'buna',    'bona',    'bòna',    'bòna',    'bona',     'bona',              'bona',    'bona',    'bona',    'bona',    'bona',            'bòna',          'bòna'],
				['boñ',     'boi',     'boñ',     'boñ',      'buoi',    'boi',     'bòni',    'boiñ',       'bòni',    'bòni',    'bòni',    'boni',      'boni',    'boni',       'boni',     'bòni',       'bòni',    'boni',    'boni',    'bòni',    'bòni',    'boni',     'boni',              'boni',    'boni',    'boni',    'boni',    'boni',            'bòni',          'bòni'],
				['caut',    'coudo',   'cauđu',   'caudo',    'caudo',   'cauđo',   'kaldo',   'kaut',       'kalt',    'kalt',    'kalt',    'kaldo',     'kaldo',   'kaldo',      'kald',     'kaldo',      'kaldo',   'kaldo',   'kalt',    'kaldo',   'kaldo',   'kaldo',    'kaldo',             'kaldo',   'kaldo',   'kaldo',   'kaldo',   'kaldu',           'kaldo',         'kaldo'],
				['nte',     'inze',    'ŧ',       'ŧ',        'inŧe',    'inte',    'ne',      'ente',       'te',      'su',      'te',      'inte',      'ne',      'inte',       'ne',       'inte',       'ne',      'inte',    'inte',    'ne',      'inte',    'inte',     'inte',              'ne',      'ne',      'inte',    'ne',      'inte',            'inte',          'su'],
				['camaxa',  'camexa',  'camexa',  'camöda',   'camexa',  'camixa',  'kamiɉa',  'kamixa',     'kamixa',  'kamixa',  'kamixa',  'kamixa',    'kamixa',  'kamixa',     'kamixa',   'kamixa',     'kamixa',  'kamixa',  'kamixa',  'kamixa',  'kamixa',  'kamixa',   'kamixa',            'kamixa',  'kamixa',  'kamixa',  'kamixa',  'kamixa',          'kamixa',        'kamixa'],
				['canp',    'canpo',   'canpu',   'canpo',    'canpo',   'canpu',   'kanpo',   'kanP',       'kanP',    'kanp',    'kanp',    'kanp',      'kanpo',   'kanpo',      'kanp',     'kanpo',      'kanpo',   'kanpo',   'kanp',    'kanpo',   'kanpo',   'kanp',     'kanpo',             'kanpo',   'kanpo',   'kanpo',   'kanpo',   'kanpu',           'kanpo',         'kanpo'],
				['candala', 'candera', 'kandèla', 'kandöla',  'kandela', 'mòkul',   'mòkolo',  'kandèla',    'kandela', 'kandea',  'kandela', 'kandea',    'kandea',  'kandela',    'kandela',  'kandela',    'kandea',  'kandea',  'kandela', 'kandela', 'kandèla', 'kandea',   'kandèa',            'kandea',  'kandela', 'kandea',  'kandela', 'kandea',          'kandeƚa',       'kandea'],
				['caveil',  'caji',    'cavèl',   'cavel',    'cavel',   'cavel',   'kavel',   'kavel',      'kavèl',   'kavèl',   'kavel',   'kavel',     'kaveo',   'kavejo',     'kavèl',    'kavejo',     'kavejo',  'kavejo',  'kavel',   'kavejo',  'kavejo',  'kavel',    'kavejo',            'kaveo',   'kaveo',   'kaveo',   'kavejo',  'kaveju',          'kavejo',        'kavejo'],
				['capel',   'capèl',   'capel',   'capel',    'capèl',   'capèl',   'kapè',    'kapèl',      'kapèl',   'kapèl',   'kapèl',   'kapèl',     'kapèo',   'kapèlo',     'kapèl',    'kapèlo',     'kapèo',   'kapèl',   'kapèl',   'kapèlo',  'kapèlo',  'kapèl',    'kapèo',             'kapèo',   'kapè',    'kapèl',   'kapèl',   'kapèo',           'kapèƚo',        'kapèo'],
				['coura',   'còura',   'caura',   'caura',    'caura',   'caura',   'kavra',   'kaura',      'kaura',   'kavera',  'kaura',   'kavra',     'kavra',   'kavra',      'kavra',    'kavra',      'kavara',  'kavra',   'kaura',   'kavra',   'kavra',   'kavara',   'kavara',            'kavara',  'kavara',  'kavara',  'kavara',  'kavara',          'kavara',        'kavara'],
				['carbon',  'karbon',  'carbon',  'carbon',   'carbon',  'carbon',  'karbon',  'karbon',     'garbon',  'karbon',  'karbon',  'karbon',    'karbon',  'karbon',     'karbou',   'karbon',     'karbon',  'karbon',  'karbon',  'karbon',  'karbon',  'karbon',   'karbon',            'karbone', 'karbon',  'karbon',  'karbon',  'karbon',          'karbon',        'karbon'],
				['cèrn',    'karne',   'karni',   'carne',    'carne',   'karne',   'karne',   'karne',      'karne',   'karne',   'karne',   'karne',     'karne',   'karne',      'karne',    'karne',      'karne',   'karne',   'karne',   'karne',   'karne',   'karne',    'karne',             'karne',   'karne',   'karne',   'karne',   'karne',           'karne',         'karne'],
				['cèr',     'karo',    'karu',    'karo',     'karo',    'caru',    'karo',    'kar',        'karo',    'karo',    'karo',    'karo',      'karo',    'karo',       'karo',     'karo',       'karo',    'karo',    'karo',    'karo',    'karo',    'karo',     'karo',              'karo',    'karo',    'karo',    'karo',    'karu',            'karo',          'karu'],
				['car',     'car',     'car',     'cèr',      'car',     'car',     'karo',    'kar',        'kar',     'kar',     'kar',     'karo',      'karo',    'karo',       'karo',     'karo',       'karo',    'karo',    'kar',     'karo',    'karo',    'karo',     'karo',              'karo',    'karo',    'karo',    'karo',    'karu',            'karo',          'karu'],
				['morona',  'cadena',  'cadena',  'cadöna',   'cadena',  'cađena',  'kadena',  'kađena',     'kađena',  'kadena',  'kadena',  'kadena',    'kaena',   'kadena',     'kadena',   'kadena',     'kaena',   'kaèna',   'kađena',  'kaena',   'kaena',   'kadena',   'kaena',             'kaena',   'kadena',  'kadena',  'kadena',  'kadena',          'kaena',         'kaena'],
				['caval',   'kàal',    'caval',   'caval',    'caval',   'caval',   'kaval',   'kaval',      'kaval',   'kaval',   'kaval',   'kaval',     'kavaƚo',  'kavalo',     'kaval',    'kavalo',     'kavaƚo',  'kaval',   'kaval',   'kavalo',  'kavalo',  'kaval',    'kavaƚo',            'kavaƚo',  'kaval',   'kaval',   'kaval',   'kavaƚo',          'kavaƚo',        'kavaƚo'],
				['cender',  'zendre',  'ŧender',  'ŧönder',   'ŧendre',  'ŧendre',  'senar',   'ŧender',     'ŧendro',  'sendre',  'ŧendro',  'sènere',    'sènere',  'senare',     'sendre',   'senare',     'senare',  'sendre',  'ŧendre',  'senare',  'senare',  'senere',   'senare',            'senere',  'sendre',  'senere',  'senda',   'senare',          'senare',        'senare'],
				['cant',    'zento',   'ŧentu',   'ŧentu',    'ŧento',   'ŧentu',   'sento',   'ŧento',      'ŧento',   'sento',   'ŧento',   'sento',     'sento',   'sento',      'sènto',    'sento',      'sento',   'sento',   'ŧento',   'sento',   'sento',   'sento',    'sento',             'sento',   'sènto',   'sento',   'ŧento',   'ŧento',           'ŧento',         'ŧento'],
				['cara',    'zera',    'ŧèra',    '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				['',     '',       '',      '',        '',       '',       '',      '',          '',     '',     '',       '',         '',      '',          '',        '',         '',    '',     '',     '',      '',      '',        '',                '',      '',      '',    '',     '',              '',            ''],
//				'Rèba',     'Cortina', 'Padola',  'Costalta', 'Auronzo', 'Pozzale', 'Verona',  'Cencenighe', 'Casan',   'Tarzo',   'Belluno', 'San Stino', 'Venezia', 'Crespadoro', 'Albisano', 'Montebello', 'Teolo',   'Romano',  'Vas',     'Tonezza', 'Vicenza', 'Lovadina', 'Campo San Martino', 'Istrana', 'Raldon',  'Meolo',   'Cerea',   'Fratta Polesine', 'Villa Estense', 'Cavarzare'],
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
