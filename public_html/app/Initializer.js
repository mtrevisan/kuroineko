/**
 * @class Initializer
 *
 * @author Mauro Trevisan
 */
var Initializer = (function(){

	var initializeApplication = function(commonRequires){
		setTimeout(function(){
			var el = document.createElement('script');
			el.src = (existFile('/app/AMDLoader.min.js')? '/app/AMDLoader.min.js': '/app/AMDLoader.js');

			el.onload = function(){
				AMDLoader.config = {
					baseUrl: '/app',
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

				var reqs = [];
				if(existFile('/app/all.min.js'))
					reqs.push('js!/app/all.min');
				reqs.push('domReady!');

				require(reqs, function(){
					commonRequires && commonRequires();

					require(['/app/tools/social/MailHelper'], function(MailHelper){
						MailHelper.decodeMails();
					});
				});
			};

			var insertPoint = document.getElementById('bootstrap-js');
			insertPoint.parentNode.insertBefore(el, insertPoint);
		}, 0);
	};

	var existFile = function(url){
		try{
			var xhr = new XMLHttpRequest();
			xhr.open('HEAD', url, false);
			xhr.send();

			return (xhr.status == 200);
		}
		catch(e){
			return false;
		}
	};


	return {
		initializeApplication: initializeApplication,

		existFile: existFile
	};

})();
