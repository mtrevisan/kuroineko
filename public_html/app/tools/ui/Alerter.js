/**
 * @class Alerter
 *
 * Based on alertify.js 0.3.11
 *
 * @see {@link http://fabien-d.github.io/alertify.js}
 *
 * @author Mauro Trevisan
 */
define(['HTMLHelper'], function(HTMLHelper){

	var keyupHandler, isOpen, transition, mainDialogContainer;


	var defineButton = function(className, label, callback){
		return {
			className: className,
			label: label,
			callback: callback
		};
	};

	/** NOTE: className is 'ok'. */
	var defineOkButton = function(label, callback){
		return defineButton('ok', label, callback);
	};

	/** NOTE: className is 'cancel'. */
	var defineCancelButton = function(label, callback){
		return defineButton('cancel', label, callback);
	};

	/**
	 * Show the dialog
	 *
	 * @param config			configuration object with params:
	 *		- type:				one of 'alert', 'confirm', 'prompt'
	 *		- title:				optional
	 *		- message:			message to be displayed
	 * 	- inputType:		one of 'text', 'textarea', 'email', 'date', 'time', 'number', 'password', 'select', 'checkbox'
	 * 	- placeholder:		optional
	 * 	- initialValue:	optional
	 * 	- buttons:			array of buttons, ordered left to right
	 * 	- okButton:			ok button
	 * 	- cancelButton:	cancel button
	 * 	- additionalCss:	optional
	 */
	var show = function(config){
		init();

		if(!mainDialogContainer)
			promiseOnDOMElement(templates.coverID, function(el){
				el.className = 'alerter-cover';
			});

		var html = buildHtml(config.type, config.title, config.message, config.buttons, config.okButton, config.inputType, config.placeholder, config.initialValue),
			className = (mainDialogContainer? '': 'alerter-position ') + 'alerter alerter-' + config.type + ' ' + (config.additionalCss || '');

		waitOnDialogForTransitionEnd(
			!isOpen,
			function(el){
				setTimeout(function(){
					el.innerHTML = html;
					el.className += ' alerter-show';
				}, 0);
			},
			function(el){
				el.innerHTML = html;
				el.className = className;

				addListeners(config.type, config.buttons, config.okButton, config.cancelButton, config.inputType);

				setFocus(config.type);

				isOpen = true;
			}
		);
	};

	/**
	 * Close the current dialog
	 */
	var hide = function(){
		if(isOpen){
			if(!mainDialogContainer)
				promiseOnDOMElement(templates.coverID, function(el){
					el.className = 'alerter-cover alerter-cover-hidden';
				});

			var className = (mainDialogContainer? '': 'alerter-position ') + 'alerter alerter-hidden';

			waitOnDialogForTransitionEnd(
				true,
				function(el){
					el.className += ' alerter-hide';
				},
				function(el){
					el.className = className;

					isOpen = false;
				}
			);
		}
	};

	/** NOTE: DOM must be ready! */
	var init = function(){
		if(!document.getElementById(templates.coverID))
			createCover();

		if(!document.getElementById(templates.dialogID)){
			isOpen = false;

			createDialogLayout();
		}

		if(!document.getElementById(templates.logID))
			createLogContainerLayout();

		transition = transition || getTransitionEvent();
	};

	var setContainer = function(container){
		if(container !== mainDialogContainer){
			mainDialogContainer = container;

			reset();
		}
	};

	/** Destroy DOM element */
	var reset = function(){
		var el = document.getElementById(templates.dialogID);
		if(el)
			el.parentNode.removeChild(el);

		el = document.getElementById(templates.coverID);
		if(el)
			el.parentNode.removeChild(el);
	};

	/** @private */
	var createCover = function(){
		var el = document.createElement('div');
		el.setAttribute('id', templates.coverID);
		el.className = 'alerter-cover alerter-cover-hidden';

		document.body.appendChild(el);
	};

	/** @private */
	var createDialogLayout = function(){
		var el = document.createElement('section');
		el.setAttribute('id', templates.dialogID);
		el.className = (mainDialogContainer? '': 'alerter-position ') + 'alerter alerter-hidden';

		(mainDialogContainer || document.body).appendChild(el);
	};

	/** @private */
	var createLogContainerLayout = function(){
		var el = document.createElement('section');
		el.setAttribute('id', templates.logID);
		el.className = 'alerter-logs alerter-logs-hidden';

		document.body.appendChild(el);
	};

	/**
	 * Add new log message
	 * If a type is passed, a class name "alerter-log-{type}" will get added.
	 *
	 * @param message	The message passed from the callee
	 * @param [type]	Type of log message
	 * @param [wait]	Time (in ms) to wait before auto-hiding
	 */
	var log = function(message, type, wait){
		init();

		var el = document.createElement('article');
		el.className = 'alerter-log' + (type? ' alerter-log-' + type: '');
		el.innerHTML = message;

		promiseOnDOMElement(templates.logID, function(container){
			container.appendChild(el);

			container.className = 'alerter-logs';
		});

		//triggers the CSS animation
		setTimeout(function(){
			el.className += ' alerter-log-show';
		}, 50);

		closeLog(el, wait);
	};

	/**
	 * Add new log message linked to an element
	 * If a type is passed, a class name "alerter-log-{type}" will get added.
	 *
	 * @param elementID	The ID of the DOM element
	 * @param message		The message passed from the callee
	 * @param [type]		Type of log message
	 * @param [wait]		Time (in ms) to wait before auto-hiding
	 */
	var logOnElement = function(elementID, message, type, wait){
		transition = transition || getTransitionEvent();

		var el = document.createElement('div');
		el.className = 'alerter-el-log' + (type? ' alerter-log-' + type: '');
		el.innerHTML = message;

		var logElementID = elementID + '-el-logs',
			logContainer = document.getElementById(logElementID),
			alreadyExisting = !!logContainer;
		if(alreadyExisting){
			logContainer.firstChild.className.replace(/(alerter-log-)([^ ]+)/, '$1' + type);
			logContainer.firstChild.innerHTML = el.innerHTML;
		}
		else{
			logContainer = document.createElement('div');
			logContainer.setAttribute('id', logElementID);
			logContainer.appendChild(el);
		}
		logContainer.className = 'alerter-el-logs alerter-el-logs-hidden';

		promiseOnDOMElement(elementID, function(container){
			var pos = HTMLHelper.getElementPosition(container);
			pos.margin = {
				bottom: HTMLHelper.getElementComputedStyle(container, 'margin-bottom')
			};

			container.parentNode.insertBefore(logContainer, container.nextSibling);

			container = document.getElementById(logElementID);
			container.className = 'alerter-el-logs';
			container.style.left = pos.left + 'px';
			if(!alreadyExisting)
				//if elementID has margin-bottom, then subtract this value from top!
				container.style.marginTop = (HTMLHelper.getElementComputedStyle(container, 'margin-top') - pos.margin.bottom) + 'px';
		});

		//triggers the CSS animation
		setTimeout(function(){
			el.className += ' alerter-el-log-show';
		}, 50);

		closeLog(el, wait, logElementID);
	};

	var closeLogOnElement = function(elementID){
		var containerID = elementID + '-el-logs';
		var container = document.getElementById(containerID);

		if(container){
			var fn = function(container){
				container.parentNode.removeChild(container);
			};

			waitOnLogForTransitionEnd(function(){
				container.firstChild.className += ' alerter-el-log-hide';
			}, fn, containerID);
		}
	};

	/**
	 * Close the log messages
	 *
	 * @param elem		HTML Element of log message to close
	 * @param [wait]	Time (in ms) to wait before automatically hiding the message, if 0 never hide
	 *
	 * @private
	 */
	var closeLog = function(el, wait, containerID){
		var fn = function(container){
			if(containerID)
				container.parentNode.removeChild(container);
			else{
				container.removeChild(el);

				if(!container.hasChildNodes())
					container.className += ' alerter-logs-hidden';
			}
		};

		bind(el, 'click', function(){
			waitOnLogForTransitionEnd(function(){
				el.className += (containerID? ' alerter-el-log-hide': ' alerter-log-hide');
			}, fn, containerID);
		}, true);

		//set timeout to auto close the log message
		if(wait && wait > 0)
			setTimeout(function(){
				waitOnLogForTransitionEnd(function(){
					el.className += (containerID? ' alerter-el-log-hide': ' alerter-log-hide');
				}, fn, containerID);
			}, wait);
	};

	/** @private */
	var templates = {
		title: '<div class="alerter-title"><h3 class="alerter-title">{{title}}</h3></div>',
		message: '<p class="alerter-message" id="alerter-message">{{message}}</p>',
		input: '<div class="alerter-text-wrapper">{{element}}</div>',
		inputs: {
			common: '<input type="{{type}}" class="alerter-input alerter-{{type}}" id="alerter-input" {{value}} {{placeholder}}>',
			textarea: '<textarea class="alerter-input alerter-textarea" id="alerter-input" {{placeholder}}>{{value-plain}}</textarea>'/*,
			//see bootbox.js
			select: '<select class="alerter-input alerter-select" id="alerter-input"></select>',
			checkbox: '<div class="alerter-checkbox"><label><input type="checkbox" class="alerter-input alerter-checkbox" /></label></div>'

				var checkedItems = input.find("input:checked");

				//assume that checkboxes are always multiple, hence default to an empty array
				value = [];

				each(checkedItems, function(_, item){
					value.push($(item).val());
				});*/
		},
		buttons: '<nav class="alerter-buttons">{{buttons}}</nav>',
		button: '<button {{type}} class="alerter-button alerter-button-{{class}}" id="alerter-{{class}}">{{label}}</button>',

		coverID: 'alerter-cover',
		logID: 'alerter-logs',
		dialogID: 'alerter',
		inputID: 'alerter-input'
	};

	/** @private */
	var buildHtml = function(type, title, message, buttons, okButton, inputType, placeholder, initialValue){
		var html = '<div class="alerter-dialog">';
		if(title)
			html += templates.title.replace('{{title}}', title);
		if(type == 'prompt')
			html += '<div id="alerter-form">';
		html += '<article class="alerter-inner">';

		html += templates.message.replace('{{message}}', message);

		if(type == 'prompt')
			html += templates.input
				.replace('{{element}}', templates.inputs[inputType] || templates.inputs.common.replace(/{{type}}/g, inputType))
				.replace('{{placeholder}}', (placeholder && placeholder.length? 'placeholder="' + placeholder + '"': ''))
				.replace('{{value}}', (initialValue !== undefined? 'value="' + initialValue + '"': ''))
				.replace('{{value-plain}}', (initialValue !== undefined? initialValue: ''));

		html += templates.buttons.replace('{{buttons}}', buttons.reduce(function(previousKey, currentKey){
			return previousKey
				+ templates.button
					.replace('{{type}}', (type == 'prompt' && currentKey == okButton? 'type="submit"': ''))
					.replace(/{{class}}/g, currentKey.className)
					.replace('{{label}}', currentKey.label);
		}, ''));

		html += '</article>';
		if(type == 'prompt')
			html += '</div>';
		html += '</div>';

		return html;
	};

	/**
	 * Set the proper button click events
	 *
	 * @private
	 */
	var addListeners = function(type, buttons, okButton, cancelButton, inputType){
		buttons.forEach(function(button){
			promiseOnDOMElement('alerter-' + button.className, function(el){
				var fn = function(event){
					event.stopPropagation();

					buttons.forEach(function(button){
						unbind(button.el, 'click', button.click);

						button.click = undefined;
					});

					unbind(document.body, 'keyup', keyupHandler);
					keyupHandler = undefined;

					hide();

					if(button.callback){
						if(type == 'prompt')
							promiseOnDOMElement(templates.inputID, function(el){
								button.callback(el.value);
							});
						else
							button.callback(el);
					}
				};

				//these are used for unbind
				button.el = el;
				button.click = fn;

				el.blur();

				bind(el, 'click', fn);
			});
		});

		if(!keyupHandler){
			keyupHandler = function(event){
				var code = event.keyCode,
					hasInput = !!document.getElementById(templates.inputID);
				if(inputType != 'textarea' && code == 13 || !hasInput && code == 32)
					okButton && okButton.click && okButton.click(event);
				if(code == 27)
					cancelButton && cancelButton.click && cancelButton.click(event);
			};

			bind(document.body, 'keyup', keyupHandler);
		}
	};

	/** @private */
	var promiseOnDOMElement = function(id, fn){
		(new Promise(function(resolve){
			var el = document.getElementById(id);
			if(el)
				resolve(el);
		})).then(fn);
	};

	/** @private */
	var waitOnDialogForTransitionEnd = function(applyTransition, fnStartTransition, fnCallback){
		promiseOnDOMElement(templates.dialogID, function(el){
			if(!mainDialogContainer && transition.supported && applyTransition){
				bind(el, transition.type, function(event){
					event.stopPropagation();

					fnCallback(el);
				}, true);

				fnStartTransition(el);
			}
			else
				fnCallback(el);
		});
	};

	/** @private */
	var waitOnLogForTransitionEnd = function(fnStartTransition, fnCallback, containerID){
		containerID = containerID || templates.logID;

		promiseOnDOMElement(containerID, function(container){
			if(transition.supported){
				bind(container, transition.type, function(event){
					event.stopPropagation();

					fnCallback(container);
				}, true);

				fnStartTransition(container);
			}
			else
				fnCallback(container);
		});
	};

	/**
	 * Bind events to elements
	 *
	 * @param el		HTML Object
	 * @param event	Event to attach to element
	 * @param fn		Callback function
	 * @param once
	 *
	 * @private
	 */
	var bind = function(el, event, fn, once){
		var callback = (!!once? function(e){
			unbind(e.target, e.type, arguments.callee);

			return fn.apply(this, arguments);
		}: fn);

		el.addEventListener(event, callback, false);
	};

	/**
	 * Unbind events to elements
	 *
	 * @param el		HTML Object
	 * @param event	Event to attach to element
	 * @param fn		Callback function
	 *
	 * @private
	 */
	var unbind = function(el, event, fn){
		el.removeEventListener(event, fn, false);
	};

	/** @private */
	var setFocus = function(type){
		if(type == 'prompt')
			promiseOnDOMElement(templates.inputID, function(el){
				el.focus();

				//prevent dialog loose focus
				bind(el, 'blur', function(e){
					e.stopPropagation();

					setFocus(type);
				});
			});
	};

	/**
	 * Return the proper transitionend event
	 *
	 * @return {String}	Transition type string
	 *
	 * @private
	 */
	var getTransitionEvent = function(){
		var transitions = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'otransitionend',
				'transition': 'transitionend'
			},
			el = document.createElement('fakeelement'),
			t, supported, type;

		for(t in transitions)
			if(el.style[t] !== undefined){
				supported = true;
				type = transitions[t];

				break;
			}

		return {
			supported: supported || false,
			type: type
		};
	};


	return {
		init: init,
		setContainer: setContainer,
		reset: reset,

		defineButton: defineButton,
		defineOkButton: defineOkButton,
		defineCancelButton: defineCancelButton,

		show: show,
		hide: hide,
		isOpen: isOpen,

		log: log,
		logOnElement: logOnElement,
		closeLogOnElement: closeLogOnElement
	};

});
