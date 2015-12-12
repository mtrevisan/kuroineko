/**
 * @class Scalar
 *
 * @see {@link https://github.com/achadee/measureJS/blob/master/measure.js}
 * @see {@link https://github.com/jfelsinger/measurement/blob/master/src/scalar.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/math/Fraction'], function(Fraction){

	var Constructor = function(){
		var scal = parse(arguments);

		this.value = scal.value;
		this.uom = scal.uom;
		this.measure = scal.measure;
	};


	/** @private */
	var parse = function(param){
		var value, uom, measure;

		param = (param.length == 3? param: param[0]);
		if(param.constructor == Constructor){
			if(!param.measure.hasUnit(param.uom))
				throw 'Measure has not the given unit of measure.';

			return param;
		}

		if('value' in param && 'uom' in param && 'measure' in param){
			value = new Fraction(param.value);
			uom = param.uom;
			measure = param.measure;
		}
		else if(param[0] !== undefined){
			value = new Fraction(param[0]);
			uom = param[1];
			measure = param[2];
		}

		if(!measure.hasUnit(uom))
			throw 'Measure has not the given unit of measure.';

		return {
			value: value,
			uom: uom,
			measure: measure
		};
	};

	/**
	 * @param {Number/Fraction} value	The value of the scalar to be added
	 * @param {String} uom					The unit of measure of the scalar
	 */
	var add = function(){
		var args = Array.prototype.slice.call(arguments);
		args.push(this.measure);
		var scal = parse(args);

		if(!this.measure.hasUnit(scal.uom))
			throw 'Measure has not the given unit of measure.';

		var commonUOM = this.measure.calculateGreatestCommonUOM(this.uom, scal.uom),
			val = this.measure.convert(this.value, this.uom, commonUOM)
				.add(scal.measure.convert(scal.value, scal.uom, commonUOM));
		return new Constructor(val, commonUOM, this.measure);
	};

	/**
	 * @param {Number/Fraction} value	The value of the scalar to be subtracted
	 * @param {String} uom					The unit of measure of the scalar
	 */
	var sub = function(){
		var args = Array.prototype.slice.call(arguments);
		args.push(this.measure);
		var scal = parse(args);
		return this.add(scal.value.negate(), scal.uom);
	};


	Constructor.prototype = {
		constructor: Constructor,

		add: add,
		sub: sub
	};

	return Constructor;

});
