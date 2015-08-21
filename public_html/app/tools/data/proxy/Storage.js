/**
 * @class StorageProxy
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** Object#toString result references. */
	/** @constant */
	var TYPE_JSON = '[object JSON]';


	var Constructor = function(id){
		this.storeID = id;
		this.cache = {};
		this.storedIDsID = 'storedIDs';
	};


	var getStoreID = function(){
		return this.storeID;
	};

	var getRecord = function(recordID){
		if(!this.cache[recordID]){
			var record = get.call(this, recordID);
			if(!record || !ObjectHelper.isDefined(record))
				return undefined;

			this.cache[recordID] = JSON.parse(record);
		}
		return this.cache[recordID];
	};

	var getAllRecords = function(){
		var ids = getStoredIDs.call(this),
			k;
		for(k in ids)
			this.getRecord(ids[k]);
		return this.cache;
	};

	/**
	 * Inserts records into the LocalStorage.
	 *
	 * @param {Object[]/Object} records		An array of record instances in the form {id: '...', otherData: '...', ...}.
	 */
	var setRecord = function(records){
		if(!Array.isArray(records))
			records = [records];

		var ids = getStoredIDs.call(this),
			k, record, recordID;
		for(k in records){
			record = records[k];
			if(!record || !record.id)
				continue;

			recordID = record.id;
			if(ids.indexOf(recordID) == -1){
				//add ID into the stored ID list
				ids.push(recordID);
				setStoredIDs.call(this, ids);
			}

			//NOTE: iPad bug requires the item to be removed before setting it
			remove.call(this, recordID);
			save.call(this, recordID, JSON.stringify(record));

			//keep the cache up to date
			this.cache[recordID] = record;
		}
	};

	var removeRecord = function(recordID){
		var ids = getStoredIDs.call(this),
			idx = ids.indexOf(recordID);

		//remove ID from stored ID list
		if(idx !== -1){
			ids.splice(idx, 1);
			setStoredIDs.call(this, ids);
		}

		remove.call(this, recordID);

		delete this.cache[recordID];
	};

	var clear = function(){
		//remove all the records
		var ids = getStoredIDs.call(this),
			k;
		for(k in ids)
			remove.call(this, ids[k]);
		//remove the supporting object
		this.cache = {};
		remove.call(this, this.storedIDsID);
	};

	var each = function(fn, scope){
		this.getAllRecords();

		for(var recordID in this.cache)
			fn.apply(scope || this, recordID, this.cache[recordID]);
	};

	var sort = function(fn){
		this.getAllRecords();

		var data = [],
			recordID;
		for(recordID in this.cache)
			data.push(this.cache[recordID]);
		data.sort(fn);
		return data;
	};

	var getCount = function(){
		return getStoredIDs.call(this).length;
	};

	/** @private */
	var getStoredIDs = function(){
		var record = get.call(this, this.storedIDsID);
		return (record? record.split(','): []);
	};

	/** @private */
	var setStoredIDs = function(ids){
		var data = ids.join(',');

		//NOTE: iPad bug requires the item to be removed before setting it
		remove.call(this, this.storedIDsID);
		if(data && data.length)
			save.call(this, this.storedIDsID, data);
	};

	/** @private */
	var get = function(recordID){
		return window.localStorage.getItem([this.storeID, recordID].join('-'));
	};

	/** @private */
	var save = function(recordID, record){
		window.localStorage.setItem([this.storeID, recordID].join('-'), record);
	};

	/** @private */
	var remove = function(recordID){
		window.localStorage.removeItem([this.storeID, recordID].join('-'));
	};

	var isJSONNative = (function(){
		var useNative = ('JSON' in window && window['JSON'] && JSON.toString() == TYPE_JSON);

		return function(){
			return useNative;
		};
	})();


	Constructor.isSupported = function(){
		try{ return ('localStorage' in window && window['localStorage'] !== null); }
		catch(e){ return false; }
	};

	Constructor.prototype = {
		constructor: Constructor,

		getStoreID: getStoreID,
		canHandleObjects: isJSONNative,
		getRecord: getRecord,
		getAllRecords: getAllRecords,
		setRecord: setRecord,
		removeRecord: removeRecord,
		clear: clear,
		each: each,
		sort: sort,
		getCount: getCount
	};


	return Constructor;

});
