/**
 * @class HTMLHelper
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/lang/phonology/Orthography'], function(ObjectHelper, Orthography){

	/* * @constant * /
	var classNameSplitter = /\s+/;*/
	/** @constant */
	var QUERY_STRING_REGEXP = new RegExp('[\\?&]([^&#]+)', 'g');


	var readParamFromURL = function(key){
		//search for key parameter into the URL
		var result = {};
		if(ObjectHelper.isDefined(window.location.getParameter)){
			if(!Array.isArray(key))
				key = [key];
			for(var k in key){
				k = key[k];
				result[k] = window.location.getParameter(k);
			}
		}
		else
			result = decodeQueryString(window.location.search).params;

		return result;
	};

	var decodeQueryString = function(query){
		var parts = query.split(QUERY_STRING_REGEXP),
			params = {},
			components, name, value,
			i, size, part;

		for(i = 1, size = parts.length; i < size; i ++){
			part = parts[i];

			if(part.length > 0){
				components = part.split('=');
				name = decodeURIComponent(components[0]);
				value = (ObjectHelper.isDefined(components[1])? decodeURIComponent(components[1].replace(/\+/g, ' ')): '');

				if(params.hasOwnProperty(name)){
					if(!Array.isArray(params[name]))
						params[name] = [params[name]];

					params[name].push(value);
				}
				else
					params[name] = value;
			}
		}

		i = query.indexOf('#');

		return {
			url: parts[0],
			fragment: (i >= 0? query.substr(i): undefined),
			params: params
		};
	};

	/** Sencha Touch 2.4.0's Ext.DomQuery.select */
	var queryDOM = function(cls, root){
		var results = [],
			nodes, k, size;
		root = root || document;
		if(ObjectHelper.isString(root))
			root = document.getElementById(root);

		nodes = root.querySelectorAll(cls);

		//support for node attribute selection
		if(cls[0] == '@'){
			nodes = root.getAttributeNode(cls.substring(1));
			results.push(nodes);
		}
		else{
			nodes = root.querySelectorAll(cls);
			size = nodes.length;
			for(k = 0; k < size; k ++)
				results.push(nodes[k]);
		}
		return results;
	};

	var getElementPosition = function(el){
		var pos = {left: 0, top: 0};

		while(el !== null){
			pos.left += el.offsetLeft - el.scrollLeft + el.clientLeft;
			pos.top += el.offsetTop - el.scrollTop + el.clientTop;
			el = el.offsetParent;
		}

		return pos;
	};

	var getElementComputedStyle = function(el, style){
		return Number(getComputedStyle(el).getPropertyValue(style).replace(/px$/, ''));
	};

	/*var hasClass = function(dom, name){
		var array = dom.className.split(classNameSplitter);
		return (array.indexOf(name) >= 0);
	};

	var addClass = function(dom, name){
		var array = dom.className.split(classNameSplitter);
		if(array.indexOf(name) < 0){
			array.push(name);
			dom.className = array.join(' ');
		}
	};

	var removeClass = function(dom, name){
		var array = dom.className.split(classNameSplitter);
		if(array.indexOf(name) >= 0)
			dom.className = array.filter(function(el){ return (el !== name); }).join(' ');
	};

	var setClass = function(dom, name, set){
		var array = dom.className.split(classNameSplitter);
		if(set && array.indexOf(name) < 0){
			array.push(name);
			dom.className = array.join(' ');
		}
		else if(!set)
			dom.className = array.filter(function(el){ return (el !== name); }).join(' ');
	};

	var toggleClass = function(dom, name){
		var array = dom.className.split(classNameSplitter);
		if(array.indexOf(name) < 0){
			array.push(name);
			dom.className = array.join(' ');
		}
		else
			dom.className = array.filter(function(el){ return (el !== name); }).join(' ');
	};

	var manageInputText = function(input, name, selector, correctOrthography){
		var dom = queryDOM(selector)[0];
		var onKeyUpCorrectOrthography = onEventCorrectOrthography(dom);
		dom.onkeyup = function(evt){
			if(correctOrthography)
				onKeyUpCorrectOrthography(evt);

			input[name] = dom.value;
		};
	};

	var manageOnClickOnRadioGroupSingle = function(input, name, radioSelector, clickSelector){
		var radioList = queryDOM(radioSelector),
			clickList = queryDOM(clickSelector),
			size = radioList.length,
			i;
		for(i = 0; i < size; i ++)
			clickList[i].onclick = (function(){
				var idx = i;

				return function(){
					delete input[name];

					radioList.forEach(function(el, i){
						el.checked = (i == idx && !el.checked);

						if(el.checked)
							input[name] = el.value;
					});
				};
			})(i);
	};

	var attachFunctionOnEvent = function(domSelector, event, fn){
		queryDOM(domSelector)[0][event] = fn;
	};*/

	/**
	 * Run callback with the element removed from the DOM (and thus being out-of-the-flow). Upon returning, the element will be inserted at its
	 * original position even if callback rises an exception.<p>
	 *
	 * @see {@link https://developers.google.com/speed/articles/javascript-dom}
	 *
	 * @param {!Element} element The element to be temporarily removed.
	 * @param {function(): T} callback The function to call.
	 * @return {T} Value returned by the callback function.
	 * @template T
	 *
	 * @private
	 */
	var updateDomElement = function(element, callback){
		var parentNode = element.parentNode,
			nextSibling = element.nextSibling;
		parentNode.removeChild(element);
		try{
			var result = callback.call(element);
		}
		finally{
			parentNode.insertBefore(element, nextSibling);
		}
		return result;
	};


	var addAccessKeyToSubmitButtons = (function(){
		var labelButton = function(button){
			if(button.accessKeyLabel)
				button.value += ' (' + button.accessKeyLabel + ')';
			else if(button.accessKey)
				button.value += ' (Alt+Shift+' + button.accessKey + ')';
		};

		return function(){
			var inputs = document.getElementsByTagName('input'),
				size = inputs.length,
				i;
			for(i = 0; i < size; i ++)
				if(inputs[i].type == 'submit')
					labelButton(inputs[i]);
		};
	})();

	var onEventCorrectOrthography = function(dom){
		return function(evt){
			if(!ObjectHelper.isDefined(evt) && window.event)
				evt = window.event;
			if(evt && (evt.which == 8 || evt.which == 46 || evt.which >= 65)){
				var caretPos = getCaretPosition(dom),
					oldValue = dom.value;

				dom.value = Orthography.correctOrthography(oldValue);
				setCaretPosition(dom, Math.max(caretPos + dom.value.length - oldValue.length, 0));
			}
		};
	};

	var getCaretPosition = function(ctrl){
		var pos = 0;
		//IE Support
		if(document.selection){
			//ctrl.focus();
			var sel = document.selection.createRange();
			//move selection start to 0 position
			sel.moveStart('character', -ctrl.value.length);
			pos = sel.text.length;
		}
		//Firefox support
		if(ctrl.createTextRange && ctrl.caret){
			var range = ctrl.caret.duplicate();
			range.moveStart('textedit', -1);
			pos = range.text.length;
		}
		else if(ctrl.selectionStart || ctrl.selectionStart == 0)
			pos = ctrl.selectionStart;

		return pos;
	};

	var setCaretPosition = function(ctrl, pos){
		if(ctrl.setSelectionRange){
			//ctrl.focus();
			ctrl.setSelectionRange(pos, pos);
		}
		else if(ctrl.createTextRange){
			//ctrl.focus();
			var range;
			if(ctrl.caret){
				range = ctrl.caret;
				range.moveStart('textedit', -1);
				range.moveEnd('textedit', -1);
			}
			else
				range = ctrl.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	};

	var setEncodedInnerHTML = function(id, text, doNotEncode){
		var el = document.getElementById(id);
		if(el){
			if(!doNotEncode)
				text = encodeHTML(text.replace(/\n/g, '<br>') || '');
			if(el.value)
				el.value = text;
			else
				el.innerHTML = text;
		}
	};

	/** @private */
	var encodeHTML = function(str){
		if(!str)
			return str;

		var word = [],
			size = str.length,
			i;
		for(i = 0; i < size; i ++)
			word.push(str[i] < ' ' || str[i] > '~'? '&#' + str.charCodeAt(i) + ';': str[i]);
		return word.join('');
	};


	return {
		readParamFromURL: readParamFromURL,
		decodeQueryString: decodeQueryString,
		queryDOM: queryDOM,
		getElementPosition: getElementPosition,
		getElementComputedStyle: getElementComputedStyle,
		/*hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		setClass: setClass,
		toggleClass: toggleClass,
		manageInputText: manageInputText,
		manageOnClickOnRadioGroupSingle: manageOnClickOnRadioGroupSingle,
		attachFunctionOnEvent: attachFunctionOnEvent,*/
		updateDomElement: updateDomElement,

		addAccessKeyToSubmitButtons: addAccessKeyToSubmitButtons,
		onEventCorrectOrthography: onEventCorrectOrthography,
		setEncodedInnerHTML: setEncodedInnerHTML
	};

});
