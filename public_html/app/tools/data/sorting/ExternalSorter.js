/**
 * An implementation of an external sorter.
 *
 * @class ExternalSorter
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		//# of chunks = # total memory / # page memory
		//for each file
			//sort file
			//write back to disk
		//for each file
			//read the first # page memory / (# of chunks + 1) rows
		//while any of the lists is non-empty
			//loop over the lists to find the one with the minimum first element
			//output the minimum element and remove it from its list
			//if output is full
				//write output to disk
				//clear output
			//if a list is empty
				//load next # page memory / (# of chunks + 1) rows
	};


	var sort = function(){
		var filenames = Array.prototype.slice.call(arguments);
		filenames.forEach(function(filename){
			var file = require('text!' + filename);
			console.log(file);
		});

	};


	Constructor.prototype = {
		constructor: Constructor,

		sort: sort
	};

	return Constructor;

});
