/**
 * @class I18N
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	var translate = function(resource, key, defaultLabel){
		if(resource){
			var label = ObjectHelper.path(resource, key);
			if(ObjectHelper.isString(label))
				return label;
		}
		return defaultLabel || (key + '.undefined');
	};


	return {
		translate: translate
	};

});
