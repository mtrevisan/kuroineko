/**
 * @class Dialect
 *
 * @author Mauro Trevisan
 */
define(/*['tools/data/I18N', 'i18nResource'],*/ function(/*I18N, i18nResource*/){

	var types = {
		northern: ['feltrinBelumat', 'cipileño', 'altaTrevixana', 'ŧitadin'],
		oriental: ['sandonatexe'],
		centralNorthern: ['trevixan', 'kastelan'],
		lagunar: ['veneŧian', 'mestrin', 'coxòto'],
		central: ['padoan', 'viŧentin', 'valsuganòto', 'basoTrentin', 'polexan', 'roigòto'/*, 'talian'*/],
		western: ['altaVeronexe', 'basaVeronexe', 'ŧitadin']
	};


	var Constructor = function(dialect){
		dialect = dialect || 'none';

		var main = dialect.replace(/(\..+)$/, '');
		dialect = {
			dialect: dialect,

			main: main,

			none: (main == 'none'),

			central: (main == 'central'),
			centralNorthern: (main == 'centralNorthern'),
			northern: (main == 'northern'),
			oriental: (main == 'oriental'),
			lagunar: (main == 'lagunar'),
			western: (main == 'western')
		};
		dialect.northernOrOriental = (dialect.northern || dialect.oriental);
		dialect.centralOrWestern = (dialect.central || dialect.western);

		return dialect;
	};

	Constructor.types = function(){
		return types;
	};

	/*Constructor.fillTypeSelector = function(selectorDOM){
		var baseKey = 'dialect.',
			groupKeyTail = '_group',
			k = 'none',
			options = selectorDOM.options;
		options.add(new Option(I18N.translate(i18nResource, baseKey + k), k));
		for(var key in types)
			if(types.hasOwnProperty(key)){
				//FIXME
				//options.add(new OptGroup(I18N.translate(i18nResource, baseKey + key + groupKeyTail)));

				types[key].forEach(function(k){
					k = key + '.' + k;
					options.add(new Option(I18N.translate(i18nResource, baseKey + k), k));
				});
			}
	};/**/


	Constructor.prototype = {
		constructor: Constructor
	};

	return Constructor;

});
