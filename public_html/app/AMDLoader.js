/**
 * @class AMDLoader
 *
 * NOTE: Circular dependencies will silently fail.
 *
 * @author Mauro Trevisan
 */
var AMDLoader = (function(doc){

	var promises = {},
		resolves = {},
		definitions = {};


	/** @private */
	var isFunction = function(fn){
		return (typeof fn == 'function');
	};

	/** @private */
	var plugins = {
		base: function(url){
			injectScript({
				src: url,
				async: true
			});
		},

		domReady: function(url, id){
			setTimeout(function(){
				if(doc.readyState)
					resolve(id);
				else{
					var oldOnload = window.onload;
					window.onload = function(){
						oldOnload && oldOnload();

						resolve(id);
					};
				}
			}, 0);
		},

		js: function(url, id){
			injectScript({
				src: url,
				async: true
			}, function(){
				resolve(id);
			});
		},

		css: function(url, id){
			injectElement('link', {
				href: url + '.css',
				type: 'text/css',
				rel: 'stylesheet'
			}, function(){
				//style is loaded but not being applied yet
				setTimeout(function(){
					resolve(id);
				}, 50);
			});
		},

		text: function(url, id){
			requestFile('text', {
				url: url
			}, function(text){
				resolve(id, text);
			});
		},

		uint8: function(url, id){
			requestFile('arraybuffer', {
				url: url
			}, function(array){
				resolve(id, array);
			});
		},

		img: function(url, id){
			injectImage({
				src: url
			}, function(el){
				resolve(id, el);
			});
		}
	};

	/** @private */
	var resolve = function(id, value){
		if(!resolves[id])
			promises[id] = new Promise(function(resolve){
				resolves[id] = resolve;
			});
		resolves[id](value);
		delete resolves[id];

		definitions[id] = value;
	};

	/**
	 * Define a module with dependencies.
	 *
	 * @param {String} [id]				Name of the module
	 * @param {Array}	[dependencies]	Array of dependencies
	 * @param {Function}	definition	Function returning the module object
	 */
	var define = function(id, dependencies, definition){
		var args = [id, dependencies, definition];
		args.unshift(typeof id == 'string'? normalizeURL(args.shift()): getCurrentID());
		if(!Array.isArray(args[1]))
			args.splice(1, 0, extractDependencies(dependencies));

		id = addJSExtension(args[0]);
		dependencies = args[1];
		definition = args[2];

		if(!dependencies.length)
			//module has no dependencies, bind id to definition
			resolve(id, (isFunction(definition)? definition.apply(this): definition));
		else
			//module has dependencies, defer loading until all dependencies have been loaded
			require(dependencies, function(){
				resolve(id, definition.apply(this, arguments));
			});
	};

	define.amd = {};

	/**
	 * Call a function with dependencies.
	 *
	 * @example
	 * <code>
	 * require(['tools/data/Lexer'], function(Lexer){ ... });
	 * </code>
	 *
	 * @example
	 * To be used only if a module has already been loaded.
	 * <code>
	 * var Lexer = require('tools/data/Lexer');
	 * </code>
	 *
	 * @param {Array/String} [dependencies]	Array of dependencies, or dependency to load if string
	 * @param {Function} [definition]			Callback with dependencies as array as parameters
	 */
	var require = function(dependencies, definition){
		if(isFunction(dependencies)){
			definition = dependencies;
			dependencies = extractDependencies(dependencies);
		}
		else if(!Array.isArray(dependencies))
			dependencies = [dependencies];

		//enforce domReady when the img! plugin is required
		if(!doc.readyState && dependencies.some(function(dep){ return (dep.indexOf('img!') == 0); })){
			require(['domReady!'], function(){
				require(dependencies, definition);
			});
			return;
		}

		if(!dependencies.length)
			//module has no dependencies, run definition now
			definition.apply(this);
		else{
			//resolve urls
			dependencies = dependencies.map(normalizeURL, this);

			if(definition){
				//need to wait for all dependencies to load
				var promises = dependencies.map(getDependencyPromise, this);

				Promise.all(promises).then(function(result){
					definition.apply(this, result);
				});
			}
			else{
				var def = definitions[dependencies[0]];
				if(def)
					return def;

				throw new Error('Module name "' + dependencies[0] + '" has not been loaded yet.');
			}
		}
	};

	var existFile = function(url, success, failure){
		requestFile('text', {url: addJSExtension(normalizeURL(url))}, success, failure);
	};

	/** @private */
	var getDependencyPromise = function(id){
		id = addJSExtension(id);

		if(!promises[id])
			promises[id] = new Promise(function(resolve){
				resolves[id] = resolve;

				var args = id.split('!');
				if(args.length < 2){
					//check if this id belongs to a module loaded with js! plugin
					if(doc.currentScript && doc.currentScript.src && promises['js!' + getCurrentID(/\.js$/)])
						return;

					args.unshift('base');
				}

				plugins[args[0]](args[1], id);
			});
//		else if(!definitions[id])
//			throw new Error('Circular dependency found while loading module name "' + id + '".');

		return promises[id];
	};

	/** @private */
	var getCurrentID = function(replacement){
		return doc.currentScript.getAttribute('src').replace(replacement || /\.[^/.]+$/, '');
	};

	/** @private */
	var addJSExtension = function(value){
		return (value[value.length - 1] != '!'? value.replace(/(.+?)(\.js)?$/, '$1.js'): value);
	};

	/** @private */
	var normalizeURL = function(id){
		//turns a plugin!url to [plugin, url] with the plugin being undefined if the name did not have a plugin prefix
		var pluginUrl = id.split('!'),
			len = pluginUrl.length,
			url = pluginUrl[len == 1? 0: 1];

		if(url){
			var cfg = AMDLoader.config;
			if(cfg.paths){
				var path = cfg.paths[url.split('/')[0]];
				if(path)
					url = url.replace(/^.+?(?=\/)/, path);
			}
			//if a colon is in the URL, it indicates a protocol is used and it is just an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
			//or ends with .js, then assume the user meant to use an url and not a module id (the slash is important for protocol-less URLs as well as full paths)
			if(len == 2 || !url.match(/^\/|:|\?|\.js$/)){
				if(cfg.baseUrl)
					url = cfg.baseUrl.replace(/\/?$/, '/' + url);

				url = compactURL(url);

				if(cfg.urlArgs)
					url += (url.indexOf('?') < 0? '?': '&') + cfg.urlArgs;
			}

			id = id.replace(/(.+?!)?.+/, '$1' + url);
		}

		return id;
	};

	/** @private */
	var compactURL = function(path){
		var result = [],
			segment, lastSegment;
		path = path.split(/\/+/);
		while(path.length){
			segment = path.shift();
			if(segment == '..' && result.length && lastSegment != segment)
				result.pop();
			else if(segment != '.')
				result.push(lastSegment = segment);
			//else ignore '.'
		}
		return result.join('/');
	};

	/**
	 * Extract named function parameters as dependencies from a function.
	 *
	 * @param {Function} fn
	 * @return {Array}	Array of dependencies
	 *
	 * @private
	 */
	var extractDependencies = function(fn){
		if(isFunction(fn)){
			fn = fn.toString();

			//remove any /* */ comments in the function body (because they can occur in the parameters)
			fn = fn.replace(/\/\*[^(?:\*\/)]+\*\//g, '');
			//extract the dependencies
			fn = fn.match(/function ?\(([^\)]*)\)/)[1];
			//split and trim them, return an array
			if(fn){
				var base = getCurrentID().replace(/(?!\/)[^/]+$/, '');
				return fn.split(',').map(function(dependency){
					return base + dependency.trim();
				});
			}
		}

		return [];
	};

	/** @private */
	var injectScript = function(module, success, failure){
		//actually, we don't even need to set this at all
		//module.type = 'text/javascript';
		module.charset = module.charset || 'UTF-8';

		injectElement('script', module, success, failure);
	};

	/** @private */
	var injectElement = (function(){
		var head = (doc.head || doc.getElementsByTagName('head')[0]);

		return function(tagName, module, success, failure){
			var el = doc.createElement(tagName);

			el.onload = function(e){
				//detect when it's done loading
				if(e.type == 'load'){
					//release event listeners
					el.onload = el.onerror = undefined;

					success && success();
				}
			};
			el.onerror = function(e){
				head.removeChild(el);

				//FIXME
				//module.src = module.src.replace(/(\.[^/.]+)$/, '.min$1');
				//module.href = module.href.replace(/(\.[^/.]+)$/, '.min$1');
				//injectElement(tagName, module, success, failure);

				//some browsers send an event, others send a string, but none of them send anything useful, so just say we failed
				var errorText = 'Syntax or http error loading: ' + (module.src || module.href);
				failure && failure(new Error(errorText));

				if(!failure)
					throw errorText;
			};

			Object.keys(module).forEach(function(key){
				el[key] = module[key];
				//alternative code:
//				el.setAttribute(key, module[key]);
			});

			head.appendChild(el);
		};
	})();

	/** @private */
	var injectImage = function(module, success, failure){
		var el = doc.createElement('img');
		//should not be visible during load
		el.style.display = 'none';

		el.onload = function(e){
			//detect when it's done loading
			if(e.type == 'load'){
				//release event listeners
				el.onload = el.onerror = undefined;

				//must show before calculating dimensions
				el.style.display = '';
				el.originalWidth = el.width;
				el.originalHeight = el.height;

				//remove from DOM before returning result
				doc.body.removeChild(el);

				success && success(el);
			}
		};
		el.onerror = function(e){
			doc.body.removeChild(el);

			//some browsers send an event, others send a string, but none of them send anything useful, so just say we failed
			var errorText = 'Syntax or http error loading: ' + module.src;
			failure && failure(new Error(errorText));

			if(!failure)
				throw errorText;
		};

		//NOTE: this requires domReady!
		doc.body.appendChild(el);

		//set source after adding to body
		el.src = module.src;
	};

	/** @private */
	var requestFile = function(responseType, module, success, failure){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', module.url, true);
		xhr.responseType = responseType;
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200)
					success && success(!responseType.length || responseType == 'text'? xhr.responseText: new Uint8Array(xhr.response));
				else{
					var errorText = 'Syntax or http error loading: ' + module.url + ', status: ' + xhr.status + ' ' + xhr.statusText;
					failure && failure(new Error(errorText));

					if(!failure)
						throw errorText;
				}
			}
		};

		xhr.send(null);
	};


	/** @private*/
	(function(){
		var bootScriptAttr = 'data-load',
			bootScript = doc.currentScript.getAttribute(bootScriptAttr);
		if(bootScript){
			doc.currentScript.removeAttribute(bootScriptAttr);

			injectScript({
				src: bootScript
			});
		}
	})();


	return {
		define: define,
		require: require,
		existFile: existFile
	};

})(window.document);

window.define = AMDLoader.define;
window.require = AMDLoader.require;
window.existFile = AMDLoader.existFile;
