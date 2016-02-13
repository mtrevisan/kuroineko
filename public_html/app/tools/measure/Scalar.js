/**
 * @class Scalar
 *
 * You can pass a scalar in different formats. Either as string, array, object, or plain arguments.<p>
 * <p>
 * String form:<p>
 * <ul>
 *		<li>'5.2 m'</li>
 * </ul>
 * Array/Object form:<p>
 * <ul>
 *		<li>[0 => <value>, 1 => <uom>, 2 => <measure>]</li>
 *		<li>{value => <value>, uom => <uom>, measure => <measure>}</li>
 * </ul>
 *
 * @see {@link https://github.com/achadee/measureJS/blob/master/measure.js}
 * @see {@link https://github.com/jfelsinger/measurement/blob/master/src/scalar.js}
 * @see {@link https://github.com/astropy/astropy/blob/master/astropy/constants/si.py}
 *
 * @author Mauro Trevisan
 */
define(['tools/math/Fraction'], function(Fraction){

	/**
	 * @param {Number/Fraction} value		The value of the scalar to be added
	 * @param {String} uom						The unit of measure of the scalar
	 * @param {MeasureConverter} [measure]	The measure converter that defines the group of conversion
	 */
	var Constructor = function(){
		var scal = parse.call(this, arguments);

		this.value = scal.value;
		this.uom = scal.uom;
		this.measure = scal.measure;
	};


	/** @private */
	var parse = function(){
		var args = Array.prototype.slice.call(arguments[0]),
			isString = (args.length == 1 && typeof(args[0]) == 'string');
		if(args.length == 1 && !(args[0].constructor == Constructor || isString))
			throw new Error('Wrong number of arguments for the function add');

		if(args.length == 1){
			if(!isString)
				return args[0];

			//parse string
			args = args[0].match(/(.+) (.+)/);
			args.shift();
		}
		if(args.length > 1){
			var value, uom, measure;
			if('value' in args && 'uom' in args){
				value = new Fraction(args.value);
				uom = args.uom;
				measure = args.measure || this.measure;
			}
			else if(args[0] !== undefined){
				value = new Fraction(args[0]);
				uom = args[1];
				measure = args[2] || this.measure;
			}

			if(!measure || !measure.hasUnit(uom))
				throw new Error('Measure has not the given unit of measure');

			return {
				value: value,
				uom: uom,
				measure: measure
			};
		}
	};

	/**
	 * @param {Number/Fraction/Scalar} value	The value of the scalar to be added
	 * @param {String} [uom]						The unit of measure of the scalar
	 */
	var add = function(){
		if(!this.measure)
			throw new Error('Measure conversion is not specified, cannot proceed');

		var scal = parse.call(this, arguments);
		if(!this.measure.hasUnit(scal.uom))
			throw new Error('Measure has not the given unit of measure');

		var commonUOM = this.measure.calculateGreatestCommonUOM(this.uom, scal.uom),
			val = this.measure.convert(this.value, this.uom, commonUOM)
				.add(scal.measure.convert(scal.value, scal.uom, commonUOM));
		return new Constructor(val, commonUOM, this.measure);
	};

	/**
	 * @param {Number/Fraction/Scalar} value	The value of the scalar to be subtracted
	 * @param {String} [uom]						The unit of measure of the scalar
	 */
	var sub = function(){
		var scal = parse.call(this, arguments);
		return this.add(scal.value.negate(), scal.uom, scal.measure);
	};

	var to = function(uom){
		if(!this.measure)
			throw new Error('Measure conversion is not specified, cannot proceed');

		return new Constructor(this.measure.convert(this.value, this.uom, uom), uom, this.measure);
	};


	Constructor.prototype = {
		constructor: Constructor,

		add: add,
		sub: sub,

		to: to
	};

	return Constructor;

});
