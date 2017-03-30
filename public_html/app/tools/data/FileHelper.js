/**
 * @class FileHelper
 *
 * @see {@link https://github.com/eligrey/FileSaver.js}
 *
 * Example:
 *
 * //feature detection:
 * try{
 *		var isFileSaverSupported = !!new Blob;
 * }
 * catch(e){}
 *
 * //syntax: FileSaver.saveAs(Blob/File data, optional DOMString filename, optional Boolean disableAutoBOM)
 * var blob = new Blob(['Hello, world!'], {type: 'text/plain;charset=utf-8'});
 * FileSaver.saveAs(blob, 'hello world.txt');
 *
 * var file = new File(['Hello, world!'], 'hello world.txt', {type: 'text/plain;charset=utf-8'});
 * FileSaver.saveAs(file);
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** @private */
	var view = (ObjectHelper.isDefined(self) && self || ObjectHelper.isDefined(window) && window || this.content);


	/** @private */
	var FileSaver = function(blob, name, noAutoBOM){
		if(!noAutoBOM)
			blob = autoBOM(blob);

		//first try a.download, then web filesystem, then object URLs
		var filesaver = this;
		var type = blob.type;
		//force saveable type
		var force = (type === 'application/octet-stream');
		var objectURL;
		var dispatchAll = function(){
			dispatch(filesaver, 'writestart progress write writeend'.split(' '));
		};
		var isSafari = /constructor/i.test(view.HTMLElement) || view.safari;
		var isChromeIOS =/CriOS\/[\d]+/.test(navigator.userAgent);
		//on any filesys errors revert to saving with object URLs
		var fsError = function(){
			if((isChromeIOS || force && isSafari) && view.FileReader){
				//Safari doesn't allow downloading of blob urls
				var reader = new FileReader();
				reader.onloadend = function(){
					var url = (isChromeIOS? reader.result: reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;'));
					var popup = view.open(url, '_blank');
					if(!popup)
						view.location.href = url;
					//release reference before dispatching
					url = undefined;
					filesaver.readyState = filesaver.DONE;
					dispatchAll();
				};
				reader.readAsDataURL(blob);
				filesaver.readyState = filesaver.INIT;
				return;
			}

			//don't create more object URLs than needed
			if(!objectURL)
				objectURL = getURL().createObjectURL(blob);

			if(force)
				view.location.href = objectURL;
			else{
				var opened = view.open(objectURL, '_blank');
				if(!opened)
					//Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
					view.location.href = objectURL;
			}
			filesaver.readyState = filesaver.DONE;
			dispatchAll();
			revoke(objectURL);
		};

		filesaver.readyState = filesaver.INIT;

		//if can use save link
		var saveLink = view.document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
		if('download' in saveLink){
			var click = function(node){
				var event = new MouseEvent('click');
				node.dispatchEvent(event);
			};

			objectURL = getURL().createObjectURL(blob);
			setTimeout(function(){
				saveLink.href = objectURL;
				saveLink.download = name;

				click(saveLink);

				dispatchAll();

				revoke(objectURL);

				filesaver.readyState = filesaver.DONE;
			});
		}
		else
			fsError();
	};

	var FSProto = FileSaver.prototype;
	FSProto.abort = function(){};
	FSProto.readyState = FSProto.INIT = 0;
	FSProto.WRITING = 1;
	FSProto.DONE = 2;

	FSProto.error = null;
	FSProto.onwritestart = null;
	FSProto.onprogress = null;
	FSProto.onwrite = null;
	FSProto.onabort = null;
	FSProto.onerror = null;
	FSProto.onwriteend = null;

	/** @private */
	var autoBOM = function(blob){
		//prepend BOM for UTF-8 XML and text/* types (including HTML)
		//note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
		return (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)?
			new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type}): blob);
	};

	/** @private */
	var dispatch = function(filesaver, eventTypes, event){
		eventTypes = [].concat(eventTypes);
		var i = eventTypes.length;
		while(i --){
			var listener = filesaver['on' + eventTypes[i]];
			if(ObjectHelper.isFunction(listener)){
				try{
					listener.call(filesaver, event || filesaver);
				}
				catch(ex){
					throwOutside(ex);
				}
			}
		}
	};

	/** @private */
	var throwOutside = function(ex){
		(view.setImmediate || view.setTimeout)(function(){
			throw ex;
		}, 0);
	};

	/** @private */
	var getURL = function(){
		return (view.URL || view.webkitURL || view);
	};

	/** @private */
	var revoke = function(file){
		var revoker = function(){
			//file is an object URL
			if(ObjectHelper.isString(file))
				getURL().revokeObjectURL(file);
			//file is a File
			else
				file.remove();
		};
		//the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		setTimeout(revoker, 1000 * 40);
	};

	var saveAs = function(blob, name, noAutoBOM){
		return new FileSaver(blob, name || blob.name || 'download', noAutoBOM);
	};


	return {
		saveAs: saveAs
	};

});
