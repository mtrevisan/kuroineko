/**
 * @class MeasureConverter
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/math/Fraction', 'tools/data/ArrayHelper'], function(ObjectHelper, Fraction, ArrayHelper){

	var Constructor = function(data, baseUOM){
		if(ObjectHelper.isString(data))
			data = [data];

		if(Array.isArray(data)){
			this.data = {};
			data.forEach(function(d){
				this.addUnit(d);
			}, this);
		}
		else{
			this.data = data || {};

			Object.keys(this.data).forEach(function(uom){
				this[uom].parentValue = new Fraction(this[uom].parentValue);
			}, this.data);
		}

		this.baseUOM = baseUOM;
	};


	var hasUnit = function(uom){
		if(!ObjectHelper.isString(uom))
			throw 'The value passed should be a string.';

		return !!this.data[uom];
	};

	/**
	 * @param {String} uom							Either a string of the unit of measure like 'm', or a sentence coding uom, parentValue, and parentUOM like 'm = 12 ft', or 'm = 12 ft = 3 in'
	 * @param {Number/Fraction} parentValue	Value wrt parentUOM
	 * @param {String} parentUOM					Referenced unit of measure like 'ft'
	 */
	var addUnit = function(uom, parentValue, parentUOM){
		if(!parentValue && !parentUOM){
			if(!ObjectHelper.isString(uom))
				throw 'The value passed should be a string.';

			var data = uom.split(' = '),
				size = data.length,
				i, m;
			uom = data[0];
			for(i = 1; i < size; i ++){
				m = data[i].match(/^([^ ]+) ([^ ]+)$/);
				if(!m)
					throw 'The string passed is not in the expected format "<uom> = <parent-value> <parent-uom> = ...".';

				parentValue = new Fraction(m[1]);
				parentUOM = m[2];

				this.addUnit(uom, parentValue, parentUOM);

				uom = parentUOM;
			}
			if(size == 1)
				this.data[uom] = this.data[uom] || {};
		}
		else{
			if(!(parentValue instanceof Fraction) && !ObjectHelper.isFloat(parentValue))
				throw 'The parent value passed should be a float or a fraction.';
			if(!ObjectHelper.isString(parentUOM))
				throw 'The parent unit of measure passed should be a string.';
			parentValue = new Fraction(parentValue);
			if(parentValue.isZero())
				throw 'Incompatible parent value: cannot be zero.';
			if(parentValue && !parentUOM)
				throw 'Incompatible parent measure: should be present if parent value is given.';
			if(uom == parentUOM)
				throw 'Incompatible current parent measure: cannot be the same.';

			var d = (this.data[uom] = this.data[uom] || {});
			d.parentValue = parentValue,
			d.parentUOM = parentUOM;

			if(!this.data[parentUOM])
				this.data[parentUOM] = {};
		}
	};

	/**
	 * @param {String} oldUOM	Old unit of measure like 'm'
	 * @param {String} newUOM	New unit of measure like 'km'
	 */
	var renameUnit = function(oldUOM, newUOM){
		if(!ObjectHelper.isString(oldUOM))
			throw 'The old unit of measure passed should be a string.';
		if(!ObjectHelper.isString(newUOM))
			throw 'The new unit of measure passed should be a string.';

		var d = this.data[oldUOM];
		if(!d)
			throw 'Cannot change unit of measure "' + oldUOM + '" into "' + newUOM + '": unit not found.';

		this.data[newUOM] = d;
		delete this.data[oldUOM];

		updateParentUOMs.call(this, oldUOM, newUOM);
	};

	/** @private */
	var updateParentUOMs = function(oldParentUOM, newParentUOM){
		if(!ObjectHelper.isString(oldParentUOM))
			throw 'The old parent unit of measure passed should be a string.';
		if(!ObjectHelper.isString(newParentUOM))
			throw 'The new parent unit of measure passed should be a string.';
		if(!this.data[oldParentUOM])
			throw 'Cannot change unit of measure: parent unit "' + oldParentUOM + '" not found.';

		Object.keys(this.data).forEach(function(uom){
			var d = this[uom];
			if(d.parentUOM == oldParentUOM)
				d.parentUOM = newParentUOM;
		}, this.data);
	};

	/**
	 * @param {String} uom							Either a string of the unit of measure like 'm', or a sentence coding uom, parentValue, and parentUOM like 'm = 12 ft', or 'm = 12 ft = 3 in'
	 * @param {Number/Fraction} parentValue	Value wrt parentUOM
	 * @param {String} parentUOM					Referenced unit of measure like 'ft'
	 */
	var updateUnit = function(uom, parentValue, parentUOM){
		if(!parentValue && !parentUOM){
			if(!ObjectHelper.isString(uom))
				throw 'The value passed should be a string.';

			var m = uom.match(/^([^ ]+) = ([^ ]+) ([^ ]+)$/);
			if(!m)
				throw 'The string passed is not in the expected format "<uom> = <parent-value> <parent-uom>".';

			uom = m[1];
			parentValue = new Fraction(m[2]);
			parentUOM = m[3];
		}
		if(!(parentValue instanceof Fraction) && !ObjectHelper.isFloat(parentValue))
			throw 'The parent value passed should be a float or a fraction.';
		parentValue = new Fraction(parentValue);
		if(parentValue.isZero())
			throw 'Incompatible parent value: cannot be zero.';
		if(!ObjectHelper.isString(parentUOM))
			throw 'The parent unit of measure passed should be a string.';

		var d = this.data[uom];
		if(!d)
			throw 'Cannot change parent value: unit "' + uom + '" not found.';
		if(parentUOM && !this.data[parentUOM])
			throw 'Cannot change parent value: parent unit "' + parentUOM + '" not found.';

		this.addUnit(uom, parentValue || d.parentValue, parentUOM || d.parentUOM);
	};

	/**
	 * Add a converter to/from this measure.
	 *
	 * @param {MeasureConverter} from	Measure from which the converter converts
	 * @param {MeasureConverter} to		Measure to which the converter converts
	 * @param {Number/Fraction} factor	Factor of conversion between from and to measures
	 */
	var addConverter = function(from, to, factor){
		if(!(from instanceof Constructor))
			throw 'The from value passed should be a measure.';
		if(!(to instanceof Constructor))
			throw 'The to value passed should be a measure.';
		if(!(factor instanceof Fraction) && !ObjectHelper.isFloat(factor))
			throw 'The factor passed should be a float or a fraction.';
		factor = new Fraction(factor);
		if(factor.isZero())
			throw 'Incompatible factor: cannot be zero.';

		this.converters = this.converters || [];

		this.converters.push({
			from: from,
			to: to,
			factor: factor
		});
	};

	/**
	 * Converts a value in a given unit of measure from a unit system into the equivalent value in the base unit of measure of the other
	 * unit system (possibly the same).
	 *
	 * @param {Number/Fraction} value		Either a value to be converted or a string in the form '<value> <uom-from>( in <uom-to>)?'
	 * @param {String} fromUnitOfMeasure	From unit of measure like 'm'
	 * @param {String} toUnitOfMeasure		To unit of measure like 'ft'
	 * @return {Fraction}
	 */
	var convert = function(value, fromUnitOfMeasure, toUnitOfMeasure){
		if(!fromUnitOfMeasure && !toUnitOfMeasure){
			if(!ObjectHelper.isString(value))
				throw 'The value passed should be a string.';

			var m = value.match(/^([^ ]+) ([^ ]+) in ([^ ]+)$/);
			if(!m)
				throw 'The string passed is not in the expected format "<value> <uom> in <uom>".';

			value = new Fraction(m[1]);
			fromUnitOfMeasure = m[2];
			toUnitOfMeasure = m[3];
		}
		if(!(value instanceof Fraction) && !ObjectHelper.isFloat(value))
			throw 'The value passed should be a float or a fraction.';
		value = new Fraction(value);
		if(value.isNegative())
			throw 'Incompatible value: cannot be negative.';
		if(!ObjectHelper.isString(fromUnitOfMeasure))
			throw 'The from unit of measure passed should be a string.';

		toUnitOfMeasure = toUnitOfMeasure || this.baseUOM;

		//within the same unit system:
		var from = this.data[fromUnitOfMeasure],
			to = this.data[toUnitOfMeasure];
		if(from && to){
			var fromFactor = calculateFactor.call(this, fromUnitOfMeasure),
				toFactor = calculateFactor.call(this, toUnitOfMeasure);
			value = value.mul(fromFactor).div(toFactor);
		}
		else{
			//across different unit systems:
			var found = (this.converters || []).some(function(c){
				//(from -> ...)
				if(c.from.hasUnit(fromUnitOfMeasure)){
					//direct (from -> to)
					if(c.to.hasUnit(toUnitOfMeasure)){
						value = c.from.convert(value, fromUnitOfMeasure);
						value = c.to.convert(value.mul(c.factor), c.to.getBaseUOM(), toUnitOfMeasure);
						return true;
					}
					//direct (from -> from)
					else if(c.from.hasUnit(toUnitOfMeasure)){
						value = c.from.convert(value, fromUnitOfMeasure, toUnitOfMeasure);
						return true;
					}
				}
				//(to -> ...)
				else if(c.to.hasUnit(fromUnitOfMeasure)){
					//inverse (to -> from)
					if(c.from.hasUnit(toUnitOfMeasure)){
						value = c.to.convert(value, fromUnitOfMeasure);
						value = c.from.convert(value.div(c.factor), c.from.getBaseUOM(), toUnitOfMeasure);
						return true;
					}
					//direct (to -> to)
					else if(c.to.hasUnit(toUnitOfMeasure)){
						value = c.to.convert(value, fromUnitOfMeasure, toUnitOfMeasure);
						return true;
					}
				}
				return false;
			});

			if(!found)
				throw 'Unknown units: cannot convert from "' + fromUnitOfMeasure + '" to "' + toUnitOfMeasure + '".';
		}

		return value;
	};

	/** @private */
	var calculateFactor = function(uom){
		var factor = new Fraction(1),
			d;
		do{
			d = this.data[uom];
			factor = factor.mul(d.parentValue || new Fraction(1));
			uom = d.parentUOM;
		}while(uom);
		return factor;
	};

	/**
	 *
	 * @param {Number/Fraction} value	Value to be expanded
	 * @param {String} unitOfMeasure		Unit of measure of the passed value
	 * @returns {Array}						Array of tuples value and uom
	 */
	var expand = function(value, unitOfMeasure){
		if(!unitOfMeasure){
			if(!ObjectHelper.isString(value))
				throw 'The value passed should be a string.';

			var m = value.match(/^([^ ]+) ([^ ]+)$/);
			if(!m)
				throw 'The string passed is not in the expected format "<value> <uom>".';

			value = new Fraction(m[1]);
			unitOfMeasure = m[2];
		}
		if(!(value instanceof Fraction) && !ObjectHelper.isFloat(value))
			throw 'The value passed should be a float or a fraction.';
		value = new Fraction(value);
		if(!ObjectHelper.isString(unitOfMeasure))
			throw 'The unit of measure passed should be a string.';

		var uom = calculateGreatestUOM.call(this),
			baseValue = 0,
			result = [],
			currentValue, integerPart, d, factor;
		while(uom){
			currentValue = this.convert(value, unitOfMeasure, uom).sub(baseValue).toNumber();
			integerPart = Math.floor(currentValue);

			d = this.data[uom];
			factor = (d.parentValue || 1);

			if(integerPart > 0 || !d.parentUOM && currentValue > 0)
				result.push({
					value: new Fraction(factor > 1? integerPart: currentValue),
					uom: uom
				});

			baseValue = (baseValue + integerPart) * factor;
			uom = d.parentUOM;
		}

		return result;
	};

	/** @private */
	var calculateGreatestUOM = function(){
		var maxFactor = 0,
			factor, greatestUOM;
		Object.keys(this.data).forEach(function(uom){
			factor = calculateFactor.call(this, uom);

			if(factor.compareTo(maxFactor) > 0){
				maxFactor = factor;
				greatestUOM = uom;
			}
		}, this);
		return greatestUOM;
	};

	/**
	 * Calculates the greatest common divisor between two unit of measures.
	 *
	 * @param {String} uom1	The first unit of measure
	 * @param {String} uom2	The second unit of measure
	 * @returns {String}		The greatest unit of measure the two units have in common
	 */
	var calculateGreatestCommonUOM = function(uom1, uom2){
		var factor1 = calculateFactor.call(this, uom1),
			factor2 = calculateFactor.call(this, uom2);

		//uom1 is equivalent to uom2, return one of them
		if(!factor1.compareTo(factor2))
			return uom1;

		//extract the path to the lowest unit of measure
		var path1 = [uom1],
			path2 = [uom2];
		while(uom1 = this.data[uom1].parentUOM)
			path1.push(uom1);
		while(uom2 = this.data[uom2].parentUOM)
			path2.push(uom2);
		//return the greatest unit of measure they have in common
		return ArrayHelper.intersection(path1, path2)[0];
	};


	var getData = function(){
		var clonedData = [],
			d;
		Object.keys(this.data).forEach(function(uom){
			d = this.data[uom];
			clonedData.push({
				uom: uom,
				parentValue: d.parentValue,
				parentUOM: d.parentUOM,
				factor: calculateFactor.call(this, uom)
			});
		}, this);

		//sort by decreasing factor
		clonedData.sort(function(a, b){
			return b.factor - a.factor;
		});

		return clonedData;
	};

	var getBaseUOM = function(){
		return this.baseUOM;
	};

	var getConverters = function(){
		return this.converters;
	};


	Constructor.prototype = {
		constructor: Constructor,

		hasUnit: hasUnit,
		addUnit: addUnit,
		renameUnit: renameUnit,
		updateUnit: updateUnit,
		addConverter: addConverter,

		convert: convert,
		expand: expand,
		calculateGreatestCommonUOM: calculateGreatestCommonUOM,

		getData: getData,
		getBaseUOM: getBaseUOM,
		getConverters: getConverters
	};

	return Constructor;

});
