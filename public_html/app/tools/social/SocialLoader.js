var socialLoader = function(d, s, src, id){
	if(id && d.getElementById(id))
		return;

	var el = d.createElement(s);
	el.id = id;
	el.async = true;
	el.src = src;
	var ss = d.getElementsByTagName(s)[0];
	ss.parentNode.insertBefore(el, ss);
};

//Google plus
window.___gcfg = {lang: 'it'};
socialLoader(document, 'script', 'https://apis.google.com/js/plusone.js');

//Facebook like
socialLoader(document, 'script', '//connect.facebook.net/it_IT/all.js#xfbml=1&status=0&appId=408646942571663', 'facebook-jssdk');
