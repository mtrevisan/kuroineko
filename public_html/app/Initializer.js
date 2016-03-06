/**
 * @class Initializer
 *
 * @author Mauro Trevisan
 */
var Initializer = (function(){

	var initializeApplication = function(commonRequires){
		setTimeout(function(){
			var el = document.createElement('script');
			el.src = '/app/AMDLoader.js';

			el.onload = function(){
				AMDLoader.config = {
					baseUrl: '../app',
					paths: {
						libs: '../libs',
						i18n: '../resources/i18n',
						css: '../resources/css'
					}
				};

				/*require(['css!css/all.min.css']).then(undefined, function(){
				 	require(['css!css/common', 'css!css/alphabet']);
				});*/
				/*require(['css!css/all.min.css']).then(undefined, function(){
				 	require(['css!css/common', 'css!css/conjugator']);
				}).then(function(){
				 	require(['css!css/alerter/alerter.core.css', 'css!css/alerter/alerter.default.css']);
				});*/

				var common = function(reqs){
					require(reqs || [], function(){
						commonRequires && commonRequires();

						require(['tools/social/MailHelper'], function(MailHelper){
							MailHelper.decodeMails();
						});
					});
				};
				existFile('all.min', function(){ common(['js!all.min']); }, function(){ common(); });
			};

			var insertPoint = document.getElementById('bootstrap-js');
			insertPoint.parentNode.insertBefore(el, insertPoint);
		}, 0);
	};


	return {
		initializeApplication: initializeApplication
	};

})();
