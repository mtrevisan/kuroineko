/**
 * @class MailHelper
 *
 * @author Mauro Trevisan
 */
define(function(){

	/**
	 * @usage
	 * <code>
	 * console.log(encodeMailData('37', 'Mauro Trevixan'));
	 * console.log(encodeMailData('69', 'mauro.trevisan@gmail.com?subject=Gramàdega%20de%20lengua%20vèneta'));
	 * </code>
	 */
	var encodeMailData = function(cipher, str){
		var r = parseInt(cipher, 16),
			i;
		for(i = 0; i < str.length && str[i] != '?'; i ++)
			cipher += leftPad((str.charCodeAt(i) ^ r).toString(16), 2, '0');
		return cipher + str.substr(i);
	};

	/** @private */
	var leftPad = function(str, size, character){
		return (Array(size).join(character || ' ') + str).slice(-size);
	};

	/**
	 * @usage
	 * <code>
	 * <a href="/cdn-cgi/mail#6907061a190804290c11080419050c470a0604?subject=Gramàdega%20de%20lengua%20vèneta"><span data-mail="377a5642455817634552415e4f5659">[email&nbsp;protected]</span><script type="text/javascript">/* <![CDATA[ * /(function(){try{var b=document.getElementsByTagName('script'),l=b[b.length-1].previousSibling,data=l.getAttribute('data-mail');if(data)l.parentNode.replaceChild(document.createTextNode(MailHelper.decodeMailLabel(data)),l);}catch(e){}})();/* ]]> * /</script></a>
	 * </code>
	 *
	 * @private
	 */
	var decodeMailData = function(encoded){
		var r = parseInt(encoded.substr(0, 2), 16),
			decoded = '',
			i;
		for(i = 2; i < encoded.length && encoded[i] != '?'; i += 2)
			decoded += String.fromCharCode(parseInt(encoded.substr(i, 2), 16) ^ r);
		return decoded + encoded.substr(i);
	};

	var decodeMails = function(){
		var links = document.getElementsByTagName('a'),
			size = links.length,
			i, link, href, label, child;
		for(i = 0; i < size; i ++){
			link = links[i];

			href = link.getAttribute('href');
			if(href && !href.indexOf('/cdn-cgi/mail')){
				label = link.getAttribute('data-mail');
				if(label){
					label = decodeMailData(label);

					child = link.firstChild;
					if(child.nodeName.toLowerCase() == '#text')
						link.replaceChild(document.createTextNode(label), child);
					else
						child.innerHTML = label;
				}
				link.setAttribute('href', 'mailto:' + decodeMailData(href.substr(14)).replace(/</g, '&lt;').replace(/>/g, '&gt;'));
			}
		}
	};


	return {
		//encodeMailData: encodeMailData,
		decodeMails: decodeMails
	};
});
