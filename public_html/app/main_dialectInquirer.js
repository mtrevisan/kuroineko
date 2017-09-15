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
//{"timestamp":"2016-10-17T09:21:08","instance":[1,1,1,0],"questionOrder":[2,1,0,3],"nodeClass":"feltrino-bellunese","newClass":false,"supervisorName":"Emanuele","supervisorAge":"24","supervisorPlace":"possagno","ip":"151.51.143.88","city":"Albignasego","country":"Italy","latitude":45.3471,"longitude":11.8678}
			[1,1,1,0,1,1,0,1,1, , , , , , , , ,0,0,1,0,0,0,0, , , , ,1,0, ,0, ,1, , ,0,0, i18nResources.variant.liventin],
			//{"timestamp":"2016-09-08T14:52:26","instance":[null,null,null,null,null,null,null,null,null,null,null,null,1,1],"questionOrder":[13,12],"nodeClass":"feltrino-bellunese","newClass":false,"supervisorName":"Serena","supervisorAge":"30","supervisorPlace":"Longarone","ip":"85.36.104.70","city":false,"country":"Italy","latitude":43.1479,"longitude":12.1097}
			[1,1,1,1,1,1,0,1,1,1,1,1, ,1,1,1,1,1,1,0,0,0,0,0, , , , , ,0,0,0, ,1, , ,0,0, i18nResources.variant['feltrin-belumat']],
			[ , , , , , , , , , , , ,1,1,1, , , , , , , , ,0, ,1,0, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.feltrin],
			[ , , , , , , ,1, , , , , , , , , , , , , , , ,0,1,1,0, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.belumat],
			[ , , , , , , , , , , , ,1,1,1, , , , , , , , ,0, ,0,1, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.seguxinexe],
			[ , , , , , , ,1, , , , , ,0, , , ,0,1,0,0,0,0,0,1,0,1, , ,0, ,0, ,1, , ,0,0, i18nResources.variant['cipile&ntilde;o']],
			[ , , , , , , , ,1, , , , , , , , ,0,0,1,0,0,0,1, , , , , ,0, ,0, ,1, , ,0,0, i18nResources.variant['feltrin-belumat de &tstrok;it&agrave;, fosaltin, alto trevixan (vitoriexe, konejanexe)']],
			//{"timestamp":"2016-04-29T23:30:48","instance":[null,null,1,null,0,null,null,null,null,0,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1,null,0],"nodeClass":"£a me variante £a xe el AXO£AN.\nel xe on xmisiòt de Belumat bas, de Trevixan e de vènethian.\nTe gè dita tante rôhe yuste però manka el boton SJUAXI YUST e, donka, £a me ga tokà struma koel pì da rente a£a respôsta yusta.\nPar ex., tante ‘ôlte £e bàto£e trinke, sentha vokal fhinal, £e rêsta ugual anka al prural: el gat > i gat; el thok > i thok; el boton > i boton esê.\nKoalke vôlta £a dixen anka £e metafhonie (a 2 km £a gaven i pavan ke i ne infruentha), par ex.: el koridor > i kuriduri ; el l karabinier > i karabiniiri : el pon > i pon > i pumi ; el per > i per > i piri.\nesêtara\n","newClass":true,"supervisorName":"Paolo Pegoraro","supervisorAge":"64","supervisorPlace":"San Vito","ip":"88.149.196.18","city":"Sirmione","country":"Italy","latitude":45.4974,"longitude":10.6051}
			[ , ,1, ,0, , , , ,0, , , , , , , , , , , , , ,1, , , , ,1,0,0,0, ,1, , ,0,0, i18nResources.variant['montebelunexe, axolan']],
			[ , , , , , , , , , , , , , , , , , , , , , , ,0, ,0,1, , ,0, ,0, ,1, , ,0,0, i18nResources.variant.kornudexe],
			[1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0, i18nResources.variant.trevixan],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0, ,0,0,1, , ,0,0, i18nResources.variant.kastelan],
			[1,1,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , ,1,1,0,0,0,1,0, , ,0,0, i18nResources.variant.lagunar],
			[1,0,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , , , ,0,0,0, ,1, , ,0,0, i18nResources.variant['cox&ograve;to']],
			[1, ,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , , , ,1,0,0, ,0, , ,0,0, i18nResources.variant.mestrin],
//{"timestamp":"2016-08-27T21:48:43","instance":[null,1,1,null,null,null,null,0,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,0,null,null,null,0],"questionOrder":[2,14,7,33,1,29],"nodeClass":"buranello","newClass":false,"supervisorName":"giuseppe siviero","supervisorAge":"69","supervisorPlace":"adria"}
//{"timestamp":"2016-08-27T21:50:52","instance":[null,1,1,null,null,null,null,0,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,1],"questionOrder":[2,14,7,28,1],"nodeClass":"","newClass":true,"supervisorName":"giuseppe siviero","supervisorAge":"69","supervisorPlace":"adria"}
			[1, ,0,0, ,0,0,0, ,0,0,0,0,0,1,0, ,0,0,0,0,1,0,1,0, , , , ,0,0,1, ,0, , ,0,0, i18nResources.variant['buran&egrave;l']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,0,0,1,0,1, , , , , , ,1, , , ,1,0,0,0, i18nResources.variant.padoan],
			//{"timestamp":"2017-06-29T00:23:17.343Z","instance":[null,null,null,null,null,null,null,"EQ",null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"EQ"],"questionOrder":[26,7],"nodeClass":"","newClass":true,"supervisorName":"Roberto","supervisorAge":"29/11/1966","supervisorPlace":"Spresiano","ip":"95.243.23.164","city":"Piombino Dese","country":"Italy","latitude":45.6081,"longitude":12.0017}
			//{"timestamp":"2015-04-02T19:09:34","newClass":false,"supervisorName":"Luca","supervisorAge":"37","supervisorPlace":"Vigonza","ip":"87.3.95.182","city":"Bagnacavallo","zipcode":"48012","region":"Emilia-Romagna","regionCode":"05","country":"Italy","countryCode":"ITA","latitude":44.4699,"longitude":12.0825}
			//[ ,1, , , , , , , , , , ,1, , , , , , , , , , , , , , , , , , , , , ,1, , , , i18nResources.variant.padoan],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,1,0,0,0,0, , , , , , , , , , , , ,0,0, i18nResources.variant['baso padoan']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,0,0,1,0,1, , , , , , , , , , ,0,1,0,0, i18nResources.variant['vi&tstrok;entin']],
			//{"timestamp":"2015-08-17T16:26:33","nodeClass":"Alto vixentino. Conplimenti par sto algoritmo!","newClass":true,"supervisorName":"Lodovico","supervisorAge":"41","supervisorPlace":"Valdagno","ip":"70.181.75.87","city":"San Pedro","zipcode":"90734","region":"California","regionCode":"CA","country":"United States","countryCode":"USA","latitude":33.7358,"longitude":-118.2923}
			//[1, ,1, , , , ,1, ,0, , , , , , , , , ,1, , , , , , , , , , , , , , , , , , , i18nResources.variant['alto vi&tstrok;entin']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,1,0,0,0,0, , , , , , , , , , , , ,0,0, i18nResources.variant['baso vi&tstrok;entin']],
			[1,0,0,0, ,0,0, , , , , , ,0,1, , ,0,0,1,0,0,0,0, , , , , , , , , , , , ,0,0, i18nResources.variant.polexan],
			[ , , , , , , , ,1, , , , , , , , ,0,0,0,0,1,1, , , , , , , , , , , , , ,0,0, i18nResources.variant.talian],
			[1,1,0,0, ,0,1, , , , , , ,0,1, , , , , , , , , , , , , , , ,0, , , ,1, ,1,1, i18nResources.variant.veronexe],
//{"timestamp":"2017-09-14T12:15:19","instance":[null,null,null,"EQ",null,null,null,"EQ"],"questionOrder":[7,3],"nodeClass":"liventin","newClass":false,"supervisorName":"marco","supervisorAge":"42","supervisorPlace":"verona","ip":"37.186.201.54","city":"Milan","country":"Italy","latitude":45.4643,"longitude":9.1895}
			[ , , , , , , , , , , , , ,0, , , ,0,0,0,0,1,0, , , , , , , ,0, , , , , , , , i18nResources.variant['alto veronexe']],
			[ , , , , , , , , , , , , ,0, , , ,0,0,0,1,0,0, , , , , , , ,0, , , , , , , , i18nResources.variant['baso veronexe']],
//{"timestamp":"2017-04-28T17:37:24","instance":[null,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1],"questionOrder":[26,7],"nodeClass":"","newClass":true,"supervisorName":"Giovanni","supervisorAge":"14","supervisorPlace":"verona","ip":"79.31.182.146","city":"Milan","country":"Italy","latitude":45.4667,"longitude":9.2}
//{"timestamp":"2017-04-28T17:37:48","instance":[null,null,null,null,null,null,1,null,null,null,null,null,null,0],"questionOrder":[13,13,6],"nodeClass":"veronese","newClass":false,"supervisorName":"Giovanni","supervisorAge":"14","supervisorPlace":"verona","ip":"79.31.182.146","city":"Milan","country":"Italy","latitude":45.4667,"longitude":9.2}
			//{"timestamp":"2016-05-17T10:23:38","instance":[null,1,1,null,0,null,null,0,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,1],"nodeClass":"lagunare","newClass":false,"supervisorName":"Elisa","supervisorAge":"26","supervisorPlace":"Trieste","ip":"151.51.181.186","city":"Malo","country":"Italy","latitude":45.6591,"longitude":11.416}
			[ ,1,1, ,0, , ,0, , , , , , ,1, , , , , , , , , , , , , ,1, , , , , , , , , , i18nResources.variant.triestin]
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
			var payload = {
				timestamp: (new Date()).toISOString(),
				instance: dt.getSupervisedInstance(),
				questionOrder: dt.getQuestionOrder(),
				nodeClass: nodeClass,
				newClass: newClass,
				supervisorName: name,
				supervisorAge: age,
				supervisorPlace: place
			};
			var common = function(client){
				//copy over client informationa
				Object.keys(client).forEach(function(k){
					payload[k] = client[k];
				});

				GoogleAnalyticsHelper.trackEvent('Compute', 'InquireDialect response with location', payload);

				CommHelper.post('app/tools/lang/data/fileAppender.php', {
					filename: 'dialectInquirer.txt',
					payload: JSON.stringify(payload)
				});
			};

			GoogleAnalyticsHelper.trackEvent('Compute', 'InquireDialect response', payload);

			try{
				CommHelper.getClientPositionData().then(common, common);
			}
			catch(e){
				common({});
			}
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
					var response = (discreteAttribute? 'EQ': 'LT');
					console.log('supervisor chooses "' + attributeName + '" w.r.t. ' + cutPoint + ' is ' + response);

					resolve(response);
				});
				var btnNo = Alerter.defineCancelButton(i18nResources.variant.no, function(){
					var response = (discreteAttribute? 'NE': 'GE');
					console.log('supervisor chooses "' + attributeName + '" w.r.t. ' + cutPoint + ' is ' + response);

					resolve(response);
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
					console.log('supervisor chooses new class, is ' + response);

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
