/**
 * @class Pronouns
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/**
	 * @param {Dialect} dialect
	 */
	var getPronouns = function(dialect){
		return {
			strong: {
				subject: {
					firstSingular: 'mi',
					firstPlural: {
						masculine: '[noaltri/nialtri/n\u2019 altri]',
						feminine: '[noaltre/nialtre/n\u2019 altre]',
						respect: 'nu(i)'
					},
					secondSingular: 'ti',
					//secondSingular: (dialect.none? 'ti': (dialect.northern && !dialect.dialect.match(/^northern\.(kornudexe|seguxinexe|cipileño)/)? 'tu': 'ti')),
					secondPlural: {
						masculine: '[voaltri/vialtri/v\u2019 altri]',
						feminine: '[voaltre/vialtre/v\u2019 altre]',
						respect: 'vu(i)'
					},
					thirdSingular: {
						masculine: 'elo',
						feminine: 'ela'
					},
					thirdPlural: {
						masculine: 'eli',
						feminine: 'ele'
					}
				},
				indirect: {
					thirdSingular: {
						masculine: 'lu',
						feminine: 'ela'
					},
					thirdPlural: {
						masculine: 'lori',
						feminine: 'lore'
					}
				},
				reflexive: {
					third: 'si/sè'
				}
			},
			weak: {
				complement: {
					direct: {
						firstSingular: 'me',
						firstPlural: 'ne',
						secondSingular: 'te',
						secondPlural: 've',
						thirdSingular: {
							masculine: 'lo',
							feminine: 'la'
						},
						thirdPlural: {
							masculine: 'li',
							feminine: 'le'
						}
					},
					indirect: {
						firstSingular: 'me',
						firstPlural: 'ne',
						secondSingular: 'te',
						secondPlural: 've',
						third: 'ge'
					}
				},
				reflexive: {
					firstSingular: 'me',
					firstPlural: 'se',
					secondSingular: 'te',
					secondPlural: 've',
					third: 'se'
				},
				subject: {
					firstSingular: '',
					firstPlural: '',
					secondSingular: 'te',
					//secondSingular: (dialect.none? 'te': (dialect.northern && dialect.dialect.match(/^northern\.(kornudexe|seguxinexe|cipileño)/)? 'tu': 'te')),
					secondPlural: '',
					thirdSingular: {
						masculine: {
							general: applyIf(!dialect.northern, 'el', dialect),
							northern: applyIf(dialect.northern, 'al', dialect)
						},
						feminine: 'la'
					},
					thirdPlural: {
						masculine: 'i',
						feminine: 'le'
					}
				},
				interrogative: {
					first: {
						general1: '-<n>(t)i/e',
						general2: '-(m)i/e'
						//cipileño: -mi
					},
					secondSingular: (dialect.none? '-(s)tu/-to': (dialect.lagunar? (dialect.dialect == 'lagunar.coxòto'? '-stu': '-tu'):
						(dialect.central || dialect.western? '-to': '-tu'))),
					secondPlural: (dialect.none? '-u/o': (dialect.central || dialect.western? '-o': '-u')),
					thirdSingular: {
						masculine: '-<e>lo',
						feminine: '-<e>la'
					},
					thirdPlural: {
						masculine: '-<e>li',
						feminine: '-<e>le'
					}
				}
			},

			get: getResultComponent
		};
	};

	/** @private */
	var applyIf = function(dialect, form, isDialect){
		return (isDialect.none || dialect? form: undefined);
	};

	/** @private */
	var getResultComponent = function(type){
		return ObjectHelper.path(this, type);
	};


	return {
		getPronouns: getPronouns
	};

});
