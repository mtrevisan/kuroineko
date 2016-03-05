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
		tree;


	/** @private */
	var isFunction = function(fn){
		return (typeof fn == 'function');
	};

	/** @private */
	var plugins = {
		base: function(url, id, failure){
			injectScript({
				src: url,
				async: true
			}, undefined, failure);
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

		js: function(url, id, failure){
			injectScript({
				src: url,
				async: true
			}, function(){
				resolve(id);
			}, failure);
		},

		css: function(url, id, failure){
			injectElement('link', {
				href: url + '.css',
				type: 'text/css',
				rel: 'stylesheet'
			}, function(){
				//style is loaded but not being applied yet
				setTimeout(function(){
					resolve(id);
				}, 50);
			}, failure);
		},

		text: function(url, id, failure){
			requestFile('text', {
				url: url
			}, function(text){
				resolve(id, text);
			}, failure);
		},

		uint8: function(url, id, failure){
			requestFile('arraybuffer', {
				url: url
			}, function(array){
				resolve(id, array);
			}, failure);
		},

		img: function(url, id, failure){
			injectImage({
				src: url
			}, function(el){
				resolve(id, el);
			}, failure);
		}
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

		//enforce domReady when the img! plugin is required
		if(!doc.readyState && dependencies.some(function(dep){ return !dep.indexOf('img!'); }))
			require(['domReady!'], function(){
				require(dependencies, definition);
			});
		else{
			//console.log('require module' + (dependencies.length? ' with dependencies [' + dependencies.map(function(dep){ return dep.replace(/.+\//, ''); }).join(', ') + ']': '') + ', remains [' + Object.keys(promises).filter(function(k){ return !!resolves[k]; }).map(function(k){ return k.replace(/.+\//, ''); }).join(', ') + ']');

			if(dependencies.length){
				//resolve urls
				dependencies = dependencies.map(normalizeURL);

				if(definition){
					var proms = dependencies.map(function(dep){ return getDependencyPromise(dep, failureFn); });

					//need to wait for all dependencies to load
					Promise.all(proms).then(function(result){
						//remove js! plugins from result
						result = result.filter(function(res, idx){ return !!dependencies[idx].indexOf('js!'); });

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
			else
				//module has no dependencies, run definition now
				definition.apply(this);
		}
	};

	/** @private */
	var failureFn = function(err){
		console.warn(err);
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
	var getDependencyPromise = function(id, failure){
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

				plugins[args[0]](args[1], id, failure);
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
		//turns a plugin!url to [id, url]
		id = id.match(/(.+!)?(.*)/);
		var url = id[2],
			cfg, path;
		id = id[1] || '';

		if(url){
			cfg = (AMDLoader || {}).config || {};
			path = (cfg.paths || {})[url.split('/')[0]];
			if(path)
				url = url.replace(/^.*(?=\/)/, path);
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
			el.onerror = function(){
				head.removeChild(el);

				//FIXME
				//module.src = module.src.replace(/(\.[^/.]+)$/, '.min$1');
				//module.href = module.href.replace(/(\.[^/.]+)$/, '.min$1');
				//injectElement(tagName, module, success, failure);

				//some browsers send an event, others send a string, but none of them send anything useful, so just say we failed
				var errorText = 'Syntax or http error loading: ' + (module.src || module.href);
				failure && failure(new Error(errorText));

				//if(!failure)
				//	throw errorText;
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
		el.onerror = function(){
			doc.body.removeChild(el);

			//some browsers send an event, others send a string, but none of them send anything useful, so just say we failed
			var errorText = 'Syntax or http error loading: ' + module.src;
			failure && failure(new Error(errorText));

			//if(!failure)
			//	throw errorText;
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
