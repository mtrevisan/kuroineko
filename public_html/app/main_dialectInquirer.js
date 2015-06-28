define(['tools/data/mining/DecisionTree', 'HTMLHelper', 'tools/ui/Validator', 'tools/ui/Alerter', 'tools/data/CommHelper'], function(DecisionTree, HTMLHelper, Validator, Alerter, CommHelper){

	var nameDOM, ageDOM, placeDOM, btnInquireDOM,
		i18nResources,
		attributes, data;

	var init = function(i18n){
		nameDOM = document.getElementById('name');
		ageDOM = document.getElementById('age');
		placeDOM = document.getElementById('place');
		btnInquireDOM = document.getElementById('btnInquire');


		i18nResources = i18n;

		attributes = [];
		for(var i = 0; i < 38; i ++)
			attributes.push({name: i18nResources.variant.attributes[i], discrete: true});

		data = [
			[1,1,1,0,1,1,0,1,1, , , , , , , , ,0,0,1,0,0,0,0, , , , ,1,0, ,0, ,1, , ,0,0, i18nResources.variant.liventin],
			[1,1,1,1,1,1,0,1,1,1,1,1, ,1,1,1,1,1,1,0,0,0,0,0, , , , , ,0,0,0, ,1, , ,0,0, i18nResources.variant['feltrin-belumat']],
			[ , , , , , , , , , , , ,1,1,1, , , , , , , , ,0, ,1,0, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.feltrin],
			[ , , , , , , ,1, , , , , , , , , , , , , , , ,0,1,1,0, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.belumat],
			[ , , , , , , , , , , , ,1,1,1, , , , , , , , ,0, ,0,1, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.seguxinexe],
			[ , , , , , , ,1, , , , , ,0, , , ,0,1,0,0,0,0,0,1,0,1, , ,0, ,0, ,1, , ,0,0, i18nResources.variant['cipile&ntilde;o']],
			[ , , , , , , , ,1, , , , , , , , ,0,0,1,0,0,0,1, , , , , ,0, ,0, ,1, , ,0,0, i18nResources.variant['feltrin-belumat de &tstrok;it&agrave;, fosaltin, alto trevixan (vitoriexe, konejanexe)']],
			[ , , , , , , , , , , , , , , , , , , , , , , ,1, , , , , ,0, ,0, ,1, , ,0,0, i18nResources.variant['montebelunexe, axolan']],
			[ , , , , , , , , , , , , , , , , , , , , , , ,0, ,0,1, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.kornudexe],
			[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0, i18nResources.variant.trevixan],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0, ,0,0,1, , ,0,0, i18nResources.variant.kastelan],
			[1,1,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , ,1,1,0,0,0,1,0, , ,0,0, i18nResources.variant.lagunar],
			[1,0,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , , , ,0,0,0, ,1, , ,0,0, i18nResources.variant['cox&ograve;to']],
			[1, ,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , , , ,1,0,0, ,0, , ,0,0, i18nResources.variant.mestrin],
			[1, ,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , , , ,0,0,1, ,0, , ,0,0, i18nResources.variant['buran&egrave;l']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,0,0,1,0,1, , , , , , ,1, , , ,1,0,0,0, i18nResources.variant.padoan],
			//{"timestamp":"2015-04-02T19:09:34.305Z","newClass":false,"supervisorName":"luca","supervisorAge":"37","supervisorPlace":"Vigonza","ip":"87.3.95.182","city":"Bagnacavallo","zipcode":"48012","region":"Emilia-Romagna","regionCode":"05","country":"Italy","countryCode":"ITA","latitude":44.4699,"longitude":12.0825}
			//[ ,1, , , , , , , , , , ,1, , , , , , , , , , , , , , , , , , , , , ,1, , , , i18nResources.variant.padoan],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,1,0,0,0,0, , , , , , , , , , , , ,0,0, i18nResources.variant['baso padoan']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,0,0,1,0,1, , , , , , , , , , ,0,1,0,0, i18nResources.variant['vi&tstrok;entin']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,1,0,0,0,0, , , , , , , , , , , , ,0,0, i18nResources.variant['baso vi&tstrok;entin']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,1,0,0,0,0, , , , , , , , , , , , ,0,0, i18nResources.variant.polexan],
			[ , , , , , , , ,1, , , , , , , , ,0,0,0,0,1,1, , , , , , , , , , , , , ,0,0, i18nResources.variant.talian],
			[1,1,0,0, ,0,1, , , , , , ,0,1, , , , , , , , , , , , , , , ,0, , , ,1, ,1,1, i18nResources.variant.veronexe],
			[ , , , , , , , , , , , , ,0, , , ,0,0,0,0,1,0, , , , , , , ,0, , , , , , , , i18nResources.variant['alto veronexe']],
			[ , , , , , , , , , , , , ,0, , , ,0,0,0,1,0,0, , , , , , , ,0, , , , , , , , i18nResources.variant['baso veronexe']]
		];

		btnInquireDOM.onclick = doInquire;

		HTMLHelper.queryDOM('form').forEach(function(form){
			Validator.validateOnSubmit(form);
		});
	};

	var doInquire = function(){
		inquire(nameDOM.value, ageDOM.value, placeDOM.value);
	};

	var inquire = function(name, age, place){
		if(!name || !age || !place)
			return;

		GoogleAnalyticsHelper.trackEvent('Compute', 'InquireDialect', '{name: \'' + name + '\', age: \'' + age + '\', place: \'' + place + '\'}');

		Alerter.setContainer(document.getElementById('inquirer'));

		var recordSupervisedInstance = function(nodeClass, newClass){
			var common = function(client){
				var payload = {
					timestamp: (new Date()).toISOString(),
					instance: dt.getSupervisedInstance(),
					nodeClass: nodeClass,
					newClass: newClass,
					supervisorName: name,
					supervisorAge: age,
					supervisorPlace: place
				};
				//copy over client informationa
				Object.keys(client).forEach(function(k){
					payload[k] = client[k];
				});

				CommHelper.post('app/tools/lang/data/fileAppender.php', {
					filename: 'dialectInquirer.txt',
					payload: JSON.stringify(payload)
				});
			};

			CommHelper.getClientPositionData().then(common, common);
		};

		var fnSupervisorConfirmClass = function(nodeClass){
			return new Promise(function(resolve){
				var btnYes = Alerter.defineOkButton(i18nResources.variant.yes, function(){
					console.log('supervisor chooses class ' + nodeClass + ' is correct');

					recordSupervisedInstance(nodeClass, false);

					resolve(true);
				});
				var btnNo = Alerter.defineCancelButton(i18nResources.variant.no, function(){
					console.log('supervisor chooses class ' + nodeClass + ' is not correct');

					resolve(false);
				});

				Alerter.show({
					type: 'confirm',
					message: i18nResources.variant.tryBefore + '<br><br>&ldquo;' + nodeClass + '&rdquo;<br><br>' + i18nResources.variant.tryAfter,
					buttons: [btnYes, btnNo],
					okButton: btnYes,
					cancelButton: btnNo
				});
			});
		};

		var fnSupervisorAskBranch = function(attributeName, cutPoint, discreteAttribute){
			return new Promise(function(resolve){
				var btnYes = Alerter.defineOkButton(i18nResources.variant.yes, function(){
					console.log('supervisor chooses "' + attributeName + '" w.r.t. ' + cutPoint + ' is ' + (discreteAttribute? 'EQ': 'LT'));

					resolve(discreteAttribute? 'EQ': 'LT');
				});
				var btnNo = Alerter.defineCancelButton(i18nResources.variant.no, function(){
					console.log('supervisor chooses "' + attributeName + '" w.r.t. ' + cutPoint + ' is ' + (discreteAttribute? 'NE': 'GE'));

					resolve(discreteAttribute? 'NE': 'GE');
				});
				var btnDontKnow = Alerter.defineButton('dont-know', i18nResources.variant.dontKnow, function(){
					console.log('supervisor don\'t know how to chooses "' + attributeName + '" w.r.t. ' + cutPoint);

					resolve(undefined);
				});

				Alerter.show({
					type: 'confirm',
					message: i18nResources.variant.sentence + '<br><br>&ldquo;' + attributeName + '&rdquo;<br><br>' + i18nResources.variant.is + ' <b>'
						+ (discreteAttribute? i18nResources.variant[cutPoint == 1? 'truthy': 'falsy']: i18nResources.variant.lessThan + ' ' + cutPoint) + '</b>?',
					buttons: [btnYes, btnNo, btnDontKnow],
					okButton: btnYes,
					cancelButton: btnDontKnow
				});
			});
		};

		var fnSupervisorAskNewAttributeAndClass = function(){
			return new Promise(function(resolve){
				var btnOk = Alerter.defineOkButton(i18nResources.variant.ok, function(response){
					console.log('supervisor chooses new class is ' + response);

					recordSupervisedInstance(response, true);

					resolve(response);
				});

				Alerter.show({
					type: 'prompt',
					message: i18nResources.variant.unable,
					inputType: 'textarea',
					buttons: [btnOk],
					okButton: btnOk
				});
			});
		};


		var dt = new DecisionTree(attributes, data);
		dt.attachSupervisor(fnSupervisorConfirmClass, fnSupervisorAskBranch, fnSupervisorAskNewAttributeAndClass);
		dt.buildTree();
//console.log(dt.getRoot());
	};


	return {
		init: init
	};

});
