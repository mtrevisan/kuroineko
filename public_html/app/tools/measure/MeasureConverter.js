/**
 * @class MeasureConverter
 *
 * @author Mauro Trevisan
 */
define(['tools/math/Fraction'], function(Fraction){

	var Constructor = function(data, baseUOM){
		if(typeof data === 'string')
			data = [data];

		if(Array.isArray(data)){
			this.data = {};
			data.forEach(function(d){
				this.addUnit(d);
			}, this);
		}
		else
			this.data = data || {};

		this.baseUOM = baseUOM;
	};


	var hasUnit = function(uom){
		return !!this.data[uom];
	};

	/**
	 * @param {String} uom Either a string of the unit of measure like 'm', or a sentence coding uom, parentValue, and parentUOM like 'm = 12 ft', or 'm = 12 ft = 3 in'
	 * @param {Number} parentValue Value of uom wrt parentUOM
	 * @param {String} parentUOM String of the referenced unit of measure like 'ft'
	 */
	var addUnit = function(uom, parentValue, parentUOM){
		if(!parentValue && !parentUOM){
			var data = uom.split(' = '),
				size = data.length,
				i, m;
			uom = data[0];
			for(i = 1; i < size; i ++){
				m = data[i].match(/(.+?) (.+)/);
				parentValue = Number(m[1]);
				parentUOM = m[2];

				this.addUnit(uom, parentValue, parentUOM);

				uom = parentUOM;
			}
		}
		else{
			if(parentValue <= 0)
				throw 'Incompatible parent value: cannot be non-positive.';
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

	var renameUnit = function(oldUOM, newUOM){
		var d = this.data[oldUOM];
		if(!d)
			throw 'Cannot change unit of measure "' + oldUOM + '" into "' + newUOM + '": unit not found.';

		this.data[newUOM] = d;
		delete this.data[oldUOM];

		updateParentUOMs.call(this, oldUOM, newUOM);
	};

	/** @private */
	var updateParentUOMs = function(oldParentUOM, newParentUOM){
		Object.keys(this.data).forEach(function(uom){
			var d = this[uom];
			if(d.parentUOM == oldParentUOM)
				d.parentUOM = newParentUOM;
		}, this.data);
	};

	var updateUnit = function(uom, parentValue, parentUOM){
		var d = this.data[uom];
		if(!d)
			throw 'Cannot change parent value: unit "' + uom + '" not found.';
		if(parentUOM && !this.data[parentUOM])
			throw 'Cannot change parent value: parent unit "' + parentUOM + '" not found.';

		this.addUnit(uom, parentValue || d.parentValue, parentUOM || d.parentUOM);
	};

	var addConverter = function(from, to, factor){
		this.converters = this.converters || [];

		this.converters.push({
			from: from,
			to: to,
			factor: factor
		});
	};

	/**
	 * Converts a value in a given unit of measure from a unit system into the equivalent value in the base unit of measure of the other unit system
	 * (possibly the same).
	 *
	 * @returns {Fraction}
	 */
	var convert = function(value, fromUnitOfMeasure, toUnitOfMeasure){
		toUnitOfMeasure = toUnitOfMeasure || this.baseUOM;

		//within the same unit system:
		var from = this.data[fromUnitOfMeasure],
			to = this.data[toUnitOfMeasure];
		if(from && to){
			var fromFactor = calculateFactor.call(this, fromUnitOfMeasure),
				toFactor = calculateFactor.call(this, toUnitOfMeasure);
			value = (new Fraction(value)).mul(fromFactor).div(toFactor);
		}
		else{
			//across different unit systems:
			var found = (this.converters || []).some(function(c){
				//(from -> ...)
				if(c.from.hasUnit(fromUnitOfMeasure)){
					//direct (from -> to)
					if(c.to.hasUnit(toUnitOfMeasure)){
						value = c.from.convert(value, fromUnitOfMeasure);
						value = value.mul(c.factor);
						value = c.to.convert(value, c.to.getBaseUOM(), toUnitOfMeasure);
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
						value = value.div(c.factor);
						value = c.from.convert(value, c.from.getBaseUOM(), toUnitOfMeasure);
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
		for(var factor = 1, d; uom; uom = d.parentUOM){
			d = this.data[uom];
			factor *= d.parentValue || 1;
		}
		return factor;
	};


	var expand = function(value, unitOfMeasure){
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
					value: (factor > 1? integerPart: currentValue),
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

			if(factor > maxFactor){
				maxFactor = factor;
				greatestUOM = uom;
			}
		}, this);
		return greatestUOM;
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

		getData: getData,
		getBaseUOM: getBaseUOM,
		getConverters: getConverters
	};

	return Constructor;

});
