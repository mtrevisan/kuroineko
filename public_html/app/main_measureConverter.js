define(['HTMLHelper', 'tools/ui/Validator', 'tools/measure/data/MeasureVeneto'], function(HTMLHelper, Validator, MeasureVeneto){

	var districtDOM, typeDOM, valueDOM, fromUnitOfMeasureDOM, toUnitOfMeasureDOM, measureTableDOM, measureOutputDOM, btnConvertDOM;

	var init = function(){
		districtDOM = document.getElementById('district');
		typeDOM = document.getElementById('type');
		valueDOM = document.getElementById('value');
		fromUnitOfMeasureDOM = document.getElementById('uom-from');
		toUnitOfMeasureDOM = document.getElementById('uom-to');
		measureTableDOM = document.getElementById('measureTable').tBodies[0];
		measureOutputDOM = document.getElementById('measureOutput');
		btnConvertDOM = document.getElementById('btnConvert');


		//HTMLHelper.addAccessKeyToSubmitButtons();


		var refreshInputs = function(){
			//reset inputs and outputs
			measureOutputDOM.hidden = true;
			valueDOM.value = null;

			var currentMeasure = extractMeasure(typeDOM.value, districtDOM.value);

			HTMLHelper.updateDomElement(measureTableDOM, function(){
				var k = this.rows.length;
				while(-- k >= 0)
					this.deleteRow(k);

				var data = currentMeasure.getData(),
					size = data.length,
					uom, parentValue, parentUOM, row, cell;
				for(k = 0; k < size; k ++){
					uom = data[k].uom;
					parentValue = data[k].parentValue;
					parentUOM = data[k].parentUOM || '';

					row = this.insertRow(k);

					cell = row.insertCell(0);
					cell.className = 'right-border-thick name';
					cell.innerHTML = uom;

					cell = row.insertCell(1);
					cell.className = 'equivalent-value';
					cell.innerHTML = parentValue || '';

					cell = row.insertCell(2);
					cell.className = 'equivalent-measure';
					cell.innerHTML = (parentValue != 1? declinateUOMToPlural(parentUOM): parentUOM);
				}
			});

			var fillMeasureSelect = function(){
				var opts = this.options,
					data = currentMeasure.getData(),
					size = data.length,
					k, uom;
				this.selectedIndex = -1;
				opts.length = 0;
				for(k = 0; k < size; k ++){
					uom = data[k].uom;

					opts[opts.length] = new Option(uom, uom);
				}

				var convData = currentMeasure.getConverters();
				if(convData && convData.length){
					convData = convData[0].to.getData();
					size = convData.length;

					var sep = '─────';
					opts[k] = new Option(sep);
					opts[k].disabled = true;

					for(k = 0; k < size; k ++){
						uom = convData[k].uom;

						opts[opts.length] = new Option(uom, uom);
					}
				}
			};
			HTMLHelper.updateDomElement(fromUnitOfMeasureDOM, fillMeasureSelect);
			HTMLHelper.updateDomElement(toUnitOfMeasureDOM, fillMeasureSelect);
		};

		HTMLHelper.updateDomElement(districtDOM, function(){
			var places = MeasureVeneto.getMeasurePlaces(),
				district, i, size;
			for(district in places){
				var optgroup = document.createElement('optgroup');
				optgroup.setAttribute('label', 'Soto ' + district);
				size = places[district].length;
				for(i = 0; i < size; i ++)
					optgroup.appendChild(new Option(places[district][i], places[district][i]));

				this.appendChild(optgroup);
			}
		});

		refreshInputs();

		var applyInputs = function(){
			refreshInputs();

			convertMeasure(valueDOM.value, fromUnitOfMeasureDOM.value, toUnitOfMeasureDOM.value, typeDOM.value, districtDOM.value);
		};

		districtDOM.onchange = function(){
			applyInputs();
		};
		typeDOM.onchange = function(){
			applyInputs();
		};

		btnConvertDOM.onclick = function(){
			convertMeasure(valueDOM.value, fromUnitOfMeasureDOM.value, toUnitOfMeasureDOM.value, typeDOM.value, districtDOM.value);
		};

		HTMLHelper.queryDOM('form').forEach(function(form){
			Validator.validateOnSubmit(form);
		});
	};

	var extractMeasure = function(measureType, district){
		var m = MeasureVeneto,
			k;
		measureType = measureType.split('.');
		for(k in measureType)
			m = m[measureType[k]];
		return m(district);
	};

	var declinateUOMToPlural = (function(){
		var plurals = [
			//assume it's feminine (otherwise it would be -i)
			[/a$/i, 'e'],
			[/i?[eo]$/i, 'i'],
			[/([^iàèéíòóuú])$/i, '$1i']
		];

		return function(uom){
			//FIXME
			//uom = PhonologyHelper.finalConsonantVoicing(uom);

			var size = plurals.length,
				k, tuple;
			for(k = 0; k < size; k ++){
				tuple = plurals[k];

				if(uom.match(tuple[0]))
					return uom.replace(tuple[0], tuple[1]);
			}
			return uom;
		};
	})();


	var convertMeasure = function(value, fromUOM, toUOM, measureType, district){
		if(!value)
			return;
		value = Number(value);

		var m = extractMeasure(measureType, district);

		measureOutputDOM.hidden = (m == null);
		if(m){
			GoogleAnalyticsHelper.trackEvent('Compute', 'ConvertMeasure', '{value: ' + value.toString() + ', currentUOM: ' + fromUOM + ', targetUOM: ' + toUOM + ', district: \'' + district + '\'}');

			var result = m.convert(value, fromUOM, toUOM).toNumber(),
				expanded = m.expand(result, toUOM),
				resultExpanded = '',
				size = expanded.length,
				k, uom;
			for(k = 0; k < size; k ++){
				value = expanded[k].value.toNumber();
				if(k == size - 1)
					value = Number(value.toFixed(1));
				uom = expanded[k].uom;
				resultExpanded += value + ' ' + (value != 1 && uom.length > 3? declinateUOMToPlural(uom): uom) + ' ';
			}

			HTMLHelper.setEncodedInnerHTML('measureOutputConversion', result + ' ' + (result != 1 && toUOM.length > 3? declinateUOMToPlural(toUOM): toUOM));
			HTMLHelper.setEncodedInnerHTML('measureOutputConversionExpanded', resultExpanded);
		}
	};


	return {
		init: init
	};

});
