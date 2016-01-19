/**
 * @class CoderDriver
 *
 * @author Mauro Trevisan
 */
define(['tools/data/coder/arithmetic/ArithmeticCoder', 'tools/data/structs/BitBuffer'], function(ArithmeticCoder, BitBuffer){

	var create = function(Model, config){
		var encode = function(data, encodingBuffer){
			var model = new Model(ArithmeticCoder, config),
				i;

			ArithmeticCoder.startEncoding(encodingBuffer);

			for(i = 0; i < data.length; i ++){
				var symbol = data.charCodeAt(i);
				if(symbol > 254 && !Model.supportsUnicode){
					model.emit(255);
					model.update(255);

					model.emit(symbol >> 8);
					model.update(symbol >> 8);

					symbol &= 0xFF;
				}

				model.emit(symbol);
				model.update(symbol);
			}
			model.emitEOF();

			return ArithmeticCoder.closeEncoding();
		};

		var decode = function(decodingBufferIterator){
			var model = new Model(ArithmeticCoder, config),
				eof = false;
			ArithmeticCoder.setEOF = function(){
				eof = true;
			};

			ArithmeticCoder.startDecoding(decodingBufferIterator);

			var output = [];
			while(true){
				var symbol = model.decode();
				if(eof)
					break;

				if(symbol == 255){
					model.update(symbol);

					symbol = model.decode();
					model.update(symbol);

					symbol = (symbol << 8) | model.decode();
					model.update(symbol & 0xFF);
				}
				else
					model.update(symbol);

				output.push(String.fromCharCode(symbol));
			}

			return output;
		};


		return {
			encode: encode,
			decode: decode
		};
	};


	return {
		create: create
	};

});
