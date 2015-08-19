/**
 * @class BasicModel
 *
 * A simple Order-0 adaptive model, with initial cumulative distributions for all symbols set to 1
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/BinaryIndexedTree'], function(BinaryIndexedTree){

	/**
	 * Total number of bytes.
	 * @constant
	 */
	var NUM_BYTES = 256;
	/**
	 * Cumulative total of all outcomes.
	 * @constant
	 */
	var NUM_OUTCOMES = NUM_BYTES + 1;

	/** @constant */
	var SYMBOL_EOF = 256;
	/* *
	 * Used to code information about the model structure.
	 * @constant
	 * /
	var SYMBOL_ESCAPE = 257;*/

	/**
	 * Maximum count before rescaling.<p>
	 * Higher values compress better, but may cause overflow, lower values are generally faster up to the point they cause thrashing.
	 * @constant
	 */
	var MAX_INDIVIDUAL_COUNT = 8 * 1024;


	var Constructor = function(arithCoder, config){
		this.coder = arithCoder;

		this.config = {updateCount: 1};
		for(var i in config)
			this.config[i] = config[i];

		//NOTE: indices 0 to 255 are for the usual counts, index 256 for end-of-file
		this.bit = new BinaryIndexedTree(NUM_OUTCOMES);
	};


	/** Increment the number of sylmbol's occurrences for the given outcome. */
	var update = function(symbol){
		this.bit.update(symbol, this.config.updateCount);

		if(this.bit.readTotal() > this.coder.TOP_VALUE || this.bit.read(symbol) > MAX_INDIVIDUAL_COUNT)
			rescale.call(this);
	};

	/**
	 * Rescales the number of symbol's occurrences by dividing all frequencies by 2, but taking a minimum of 1.
	 *
	 * @private
	 */
	var rescale = function(){
		this.bit.map(function(k){ return ((k + 1) >> 1); });
	};

	/**
	 * Calculates <code>{low count, high count, total count}</code> for the given symbol in the current context.
	 * <p>
	 * The cumulative counts in the return must be such that <code>0 <= low count < high count <= total count</code>.
	 * <p>
	 * This method will be called exactly once for each symbol being encoded or decoded, and the calls will be made in the order in which they
	 * appear in the original file.
	 * Adaptive models may only update their state to account for seeing a symbol <emph>after</emph> returning its current interval.
	 */
	var emit = function(symbol){
		this.coder.encodeInterval(getInterval.call(this, symbol));
	};

	/** @private */
	var getInterval = function(symbol){
		//calculate the symbol whose interval of low and high counts contains the given cumulative distribution
		var high = this.bit.readCumulative(symbol);

		return {
			low: high - this.bit.read(symbol),
			high: high,
			total: this.bit.readTotal()
		};
	};

	var emitEOF = function(){
		this.emit(SYMBOL_EOF);
	};

	var decode = function(){
		var target = this.coder.getCurrentSymbolCount(this.bit.readTotal()),
			symbol = this.bit.find(target);

		if(symbol == SYMBOL_EOF)
			this.coder.setEOF();

		this.coder.decodeInterval(getInterval.call(this, symbol));
		return symbol;
	};


	Constructor.prototype = {
		constructor: Constructor,

		update: update,
		emit: emit,
		emitEOF: emitEOF,
		decode: decode
	};


	return Constructor;

});
