/**
 * @class AMDLoader
 *
 * NOTE: Circular dependencies will be reported.
 *
 * @example
 * <code>
 * <script id="bootstrap-js">initializeApplication();</script>
 *
 * var initializeApplication = function(commonRequires){
 *		setTimeout(function(){
 *			var el = document.createElement('script');
 *			el.src = '/app/AMDLoader.js';
 *
 *			el.onload = function(){
 *				AMDLoader.config = {
 *					baseUrl: '../app',
 *					urlArgs: 'ts=123',
 *					paths: {
 *						libs: '../libs',
 *						i18n: '../resources/i18n',
 *						css: '../resources/css'
 *					}
 *				};
 *			};
 *
 *			var insertPoint = document.getElementById('bootstrap-js');
 *			insertPoint.parentNode.insertBefore(el, insertPoint);
 *		}, 0);
 *	};
 *
 * AMDLoader.config = {
 * 	baseUrl: '../app',
 * 	urlArgs: 'ts=123',
 * 	paths: {
 *			libs: '../libs',
 *			i18n: '../resources/i18n',
 *			css: '../resources/css'
 *		}
 *	};
 *	</code>
 *
 * @author Mauro Trevisan
 */
var AMDLoader = (function(doc){

	var promises = {},
		resolves = {},
		definitions = {},
		loader = new Map(),
		tree;


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
			var common = function(){
				resolve(id);

				loadDependencies();
			};

			setTimeout(function(){
				if(doc.readyState)
					common();
				else{
					var oldOnload = window.onload;
					window.onload = function(){
						oldOnload && oldOnload();

						common();
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
			}, failureFn);
		},

		uint8: function(url, id){
			requestFile('arraybuffer', {
				url: url
			}, function(array){
				resolve(id, array);
			}, failureFn);
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
	var failureFn = function(err){
		console.warn(err);
	};

	/** @private */
	var resolve = function(id, value){
		if(!resolves[id])
			promises[id] = new Promise(function(res){
				resolves[id] = res;
			});
		resolves[id](value);
		resolves[id] = null;

		definitions[id] = value;

		//check to see if current file is to be called for loading, if so, remove it since it is already loaded in the current file
		loader.delete(id);

		//console.log('resolved module ' + id.replace(/.+\//, '') + ', remains [' + Object.keys(promises).filter(function(k){ return !!resolves[k]; }).map(function(k){ return k.replace(/.+\//, ''); }).join(', ') + ']');
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

		//console.log('define module ' + id.replace(/.+\//, '') + (dependencies.length? ' with dependencies [' + dependencies.map(function(dep){ return dep.replace(/.+\//, ''); }).join(', ') + ']': '') + ', remains [' + Object.keys(promises).filter(function(k){ return !!resolves[k]; }).map(function(k){ return k.replace(/.+\//, ''); }).join(', ') + ']');
		checkForCircularDependency(id, dependencies);

		if(dependencies.length)
			//module has dependencies, defer loading until all dependencies have been loaded
			require(dependencies, function(){
				resolve(id, definition.apply(this, arguments));
			});
		else
			//module has no dependencies, bind id to definition
			resolve(id, (isFunction(definition)? definition.apply(this): definition));
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
		//enforce domReady
		dependencies.unshift('domReady!');

		//console.log('require module' + (dependencies.length? ' with dependencies [' + dependencies.map(function(dep){ return dep.replace(/.+\//, ''); }).join(', ') + ']': '') + ', remains [' + Object.keys(promises).filter(function(k){ return !!resolves[k]; }).map(function(k){ return k.replace(/.+\//, ''); }).join(', ') + ']');

//		if(dependencies.length){
			//resolve urls
			dependencies = dependencies.map(normalizeURL);

			if(definition){
				var proms = dependencies.map(getDependencyPromise);

				//need to wait for all dependencies to load
				Promise.all(proms).then(function(result){
					//remove js! plugins from result
					result = result.filter(function(res, idx){ return (res && !!this[idx].indexOf('js!')); }, dependencies);

					definition.apply(this, result);
				});
			}
			else{
				var def = definitions[dependencies[0]];
				if(def)
					return def;

				throw new Error('Module name "' + dependencies[0] + '" has not been loaded yet.');
			}
//		}
//		else
			//module has no dependencies, run definition now
//			definition.apply(this);
	};

	var existFile = function(url, success, failure){
		requestFile('text', {url: addJSExtension(normalizeURL(url))}, success, failure);
	};

	/** @private */
	var checkForCircularDependency = function(id, dependencies){
		if(tree){
			tree.addVertex(id, dependencies.map(normalizeURL).map(addJSExtension));

			var scc = tree.getStronglyConnectedComponents();
			if(scc.length)
				throw new Error('Circular dependency found: ' + JSON.stringify(scc.map(function(component){ return component.join(' > '); })));
		}
	};

	/** @private */
	var getDependencyPromise = function(id){
		id = addJSExtension(id);

		if(!promises[id])
			promises[id] = new Promise(function(res){
				resolves[id] = res;

				var args = id.split('!');
				if(args.length < 2){
					//check if this id belongs to a module loaded with js! plugin
					//(this is to avoid potential loops)
					if(doc.currentScript && doc.currentScript.src && promises['js!' + getCurrentID(/\.js$/)])
						return;

					args.unshift('base');
				}

				//defer loading javascript dependencies at the loading of the current js file
				if(args[0] == 'base')
					loader.set(id, args[1]);
				else
					plugins[args[0]](args[1], id);
			});

		return promises[id];
	};

	/** @private */
	var getCurrentID = function(replacement){
		return doc.currentScript.getAttribute('src').replace(replacement || /\.[^/.]+$/, '');
	};

	/** @private */
	var addJSExtension = function(value){
		return (!value.match(/\.min$/) && value.match(/\.[^.\/]+$/)? value: value + '.js');
	};

	/** @private */
	var normalizeURL = function(id){
		var parts = splitPrefix(id),
			url = parts[1],
			cfg, path;
		id = parts[0];

		if(url){
			cfg = (AMDLoader || {}).config || {};

			path = (cfg.paths || {})[url.split('/')[0]];
			if(path)
				url = url.replace(/^.*?(?=\/)/, path);

			//if a colon is in the URL, it indicates a protocol is used and it is just an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
			//or ends with .js, then assume the user meant to use an url and not a module id (the slash is important for protocol-less URLs as well as full paths)
			if(id.length || !url.match(/^\/|[:?]|\.js$/)){
				url = compactURL((cfg.baseUrl || '') + '/' + url)
					+ (url.indexOf('?') < 0? '?': '&') + (cfg.urlArgs || '');
				url = url.replace(/^\/|[?&]$/g, '');
			}
		}

		return id + url;
	};

	/** Turns a plugin!resource to [plugin, resource] with the plugin being undefined if the name did not have a plugin prefix */
	var splitPrefix = function(name){
		name = name.match(/(.+!)?(.*)/);
		return [name[1] || '', name[2]];
	};

	/** @private */
	var compactURL = function(path){
		var result = [],
			lastSegment;
		path.split(/\/+/).forEach(function(segment){
			if(segment == '..' && result.length && lastSegment != segment)
				result.pop();
			else if(segment != '.')
				result.push(lastSegment = segment);
			//else ignore '.'
		});
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
	var injectScript = function(module, success){
		//actually, we don't even need to set this at all
		//module.type = 'text/javascript';
		module.charset = module.charset || 'UTF-8';

		injectElement('script', module, success);
	};

	/** @private */
	var injectElement = (function(){
		var head = (doc.head || doc.getElementsByTagName('head')[0]);

		return function(tagName, module, success){
			var el = doc.createElement(tagName);

			el.onload = function(e){
				//detect when it's done loading
				if(e.type == 'load'){
					//release event listeners
					el.onload = el.onerror = undefined;

					loadDependencies();

					success && success();
				}
			};
			el.onerror = function(){
				head.removeChild(el);

				//FIXME
				//module.src = module.src.replace(/(\.[^/.]+)$/, '.min$1');
				//module.href = module.href.replace(/(\.[^/.]+)$/, '.min$1');
				//injectElement(tagName, module, success, failure);

				//some browsers send an event, others send a string, but none of them send anything useful, so just say we failed
				var errorText = 'Syntax or http error loading: ' + (module.src || module.href);
				failureFn(new Error(errorText));
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
	var injectImage = function(module, success){
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
		el.onerror = function(){
			doc.body.removeChild(el);

			//some browsers send an event, others send a string, but none of them send anything useful, so just say we failed
			var errorText = 'Syntax or http error loading: ' + module.src;
			failureFn(new Error(errorText));
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
		if(xhr.overrideMimeType)
			xhr.overrideMimeType('text/plain; charset=' + (module.charset || 'UTF-8'));
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status == 200)
					success && success(!responseType.length || responseType == 'text'? xhr.responseText: new Uint8Array(xhr.response));
				else{
					var err = new Error('Syntax or http error loading: ' + module.url + ', status: ' + xhr.status + ' ' + xhr.statusText);
					if(failure)
						failure(err);
					else
						throw err;
				}
			}
		};

		xhr.send(null);
	};

	/** @private */
	var loadDependencies = function(){
		setTimeout(function(){
			//when all the current file is loaded, load all the (remaining) dependencies
			loader.forEach(plugins.base);
			loader.clear();
		}, 0);
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

		require(['../../app/tools/data/structs/Tarjan'], function(Tarjan){
			tree = new Tarjan();
		});
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
