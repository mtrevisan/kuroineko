/**
 * @class CommHelper
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	var get = function(url, data){
		return new Promise(function(resolve, reject){
			var req = new XMLHttpRequest();
			req.open('GET', url, true);

			var urlEncodedData = combineURLEncodedData(data);
			if(urlEncodedData)
				req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

			req.onload = function(){
				if(req.status == 200)
					resolve(req.response);
				else
					reject(Error(req.statusText));
			};
			req.onerror = function(){
				reject(Error("Network error"));
			};

			req.send(urlEncodedData);
		});
	};

	var post = function(url, data){
		return new Promise(function(resolve, reject){
			var req = new XMLHttpRequest();
			req.open('POST', url, true);

			var urlEncodedData = combineURLEncodedData(data);
			if(urlEncodedData)
				req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');

			req.onload = function(){
				if(req.status == 200)
					resolve(req.response);
				else
					reject(Error(req.statusText));
			};
			req.onerror = function(){
				reject(Error("Network error"));
			};

			req.send(urlEncodedData);
		});
	};

	/** @private */
	var combineURLEncodedData = function(data){
		if(ObjectHelper.isObject(data)){
			var urlEncodedDataPairs = [];
			Object.keys(data || []).forEach(function(key){
				urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			});
			//combine the pairs into a single string and replace all encoded spaces to the plus character to match the behaviour of the web browser form submit
			data = (data? urlEncodedDataPairs.join('&').replace(/%20/g, '+'): undefined);
		}
		else if(!ObjectHelper.isString(data))
			data = JSON.stringify(data);
		return data;
	};

	var getClientPositionData = function(){
		return new Promise(function(resolve, reject){
			get('http://geoip.nekudo.com/api')
				.then(function(response){
					response = JSON.parse(response);

					var position = {
						ip: response.ip,
						city: response.city,
						country: response.country.name,
						latitude: response.location.latitude,
						longitude: response.location.longitude
					};

					resolve(position);
				}, reject);
			/*get('http://freegeoip.net/json/')
				.then(function(response){
					response = JSON.parse(response);

					var position = {
						ip: response.ip,
						city: response.city,
						zipcode: response.zip_code,
						region: response.region_name,
						country: response.country_name,
						latitude: response.latitude,
						longitude: response.longitude
					};

					resolve(position);
				}, reject);
			get('http://ip-api.com/json')
				.then(function(response){
					response = JSON.parse(response);

					var position = {
						ip: response.query,
						city: response.city,
						zipcode: response.zip,
						region: response.regionName,
						country: response.country,
						latitude: response.lat,
						longitude: response.lon
					};

					resolve(position);
				}, reject);
			get('http://ipinfo.io/json')
				.then(function(response){
					response = JSON.parse(response);

					var position = {
						ip: response.ip,
						city: response.city,
						zipcode: response.postal,
						region: response.region,
						countryCode: response.country,
						latitude: response.loc.split(',')[0],
						longitude: response.loc.split(',')[1]
					};

					resolve(position);
				}, reject);/**/
		});
	};


	return {
		get: get,
		post: post,
		getClientPositionData: getClientPositionData
	};

});
