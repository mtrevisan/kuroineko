/**
 * @class HighOrderModelFactory
 *
 * @author Mauro Trevisan
 */
define(function(){

	var createFrom = function(Model, order){
		var OrderN = function(coder, config){
			var lastSymbol = [],
				contexts = new Model(coder, config),
				j;
			for(j = 0; j < order; j ++){
				lastSymbol[j] = 0;
				contexts = [contexts];
			}


			this.update = function(symbol){
				getContext().update(symbol);

				pushSymbol(symbol);
			};

			this.emit = function(symbol){
				getContext().emit(symbol);
			};

			this.emitEOF = function(){
				getContext().emitEOF();
			};

			this.decode = function(){
				return getContext().decode();
			};

			/** @private */
			var getContext = function(){
				for(var i = 0, ctx = contexts, ct; i < order; i ++, ctx = ct){
					ct = ctx[lastSymbol[i]] || (i == order - 1? new Model(coder, config): []);
					ctx[lastSymbol[i]] = ct;
				}
				return ctx;
			};

			/** @private */
			var pushSymbol = function(symbol){
				for(var i = 1; i < order; i ++)
					lastSymbol[i - 1] = lastSymbol[i];
				lastSymbol[i - 1] = symbol;
			};
		};


		return OrderN;
	};


	return {
		createFrom: createFrom
	};

});
