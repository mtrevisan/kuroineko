/**
 * @class FS
 *
 * @author Mauro Trevisan
 */
define(function(){

		/** @constant */
	var DB_NAME = window.location.host + '_filesystem',
		/** @constant */
		OS_NAME = 'files',
		/** @constant */
		DIR_IDX = 'dir';


	/** @private */
	var init = function(type, callback){
		var req = window.indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = function(e){
			e.target.result
				.createObjectStore(OS_NAME, {keyPath: 'path'})
				.createIndex(DIR_IDX, 'dir', {unique: false });
		};
		req.onsuccess = function(e){
			callback(e.target.result
				.transaction([OS_NAME], type)
				.objectStore(OS_NAME));
		};
	};

	var readdir = function(directoryName){
		return new Promise(function(resolve, reject){
			init('readonly', function(os){
				var dir = path.dirname(withTrailingSlash(directoryName)),
					req = os.index(DIR_IDX)
						.openCursor(IDBKeyRange.only(dir)),
					results = [];
				req.onerror = function(e){
					reject(e);
				};
				req.onsuccess = function(e){
					var cursor = e.target.result,
						value;
					if(cursor){
						value = cursor.value;
						results.push(new DirectoryEntry(value.path, value.type));

						cursor.continue();
					}
					else
						resolve(results);
				};
			});
		});
	};

	/** @private */
	var withTrailingSlash = function(path){
		return (path[path.length - 1] === '/'? path: path + '/');
	};

	/** @private */
	var DirectoryEntry = function(fullPath, type){
		//the full path (including file name) for the given file/directory entry
		this.path = fullPath;
		//either the file or directory name
		this.name = path.basename(fullPath);
		//the given directory that the file/directory sits in
		this.dir = path.dirname(fullPath);
		//either 'file' or 'directory'
		this.type = type;
	};


	return {
		readdir: readdir
	};

});
