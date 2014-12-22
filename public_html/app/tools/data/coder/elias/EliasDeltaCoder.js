/**
 * @class EliasDeltaCoder
 *
 * http://en.wikipedia.org/wiki/Elias_delta_coding
 * http://books.google.it/books?id=81AfzW6vux4C&pg=PA77&lpg=PA77&dq=elias+omega+delta+coding&source=bl&ots=PWSnw4KfEe&sig=lVZGLpJk_cMBJmQpNNUKQF04ONU&hl=en&sa=X&ei=rQRzVN4bwqDIA7XJgkg&redir_esc=y#v=onepage&q=elias%20omega%20delta%20coding&f=false
 * http://books.google.it/books?id=mnpeizY0btYC&pg=PA35&lpg=PA35&dq=elias+omega+delta+coding&source=bl&ots=zsADJhF4Hg&sig=tmfoxlYNXrGOvp8nPZeyhdN-Xqg&hl=en&sa=X&ei=rQRzVN4bwqDIA7XJgkg&redir_esc=y#v=onepage&q=elias%20omega%20delta%20coding&f=false
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/BitBuffer'], function(BitBuffer){

	var encode = function(values, encodingBuffer){
		if(!Array.isArray(values))
			values = [values];

		var buffer = (encodingBuffer || new BitBuffer());

		var size = values.length,
			i;
		for(i = 0; i < size; i ++)
			encodeValue(values[i], buffer);

		buffer.finalize();

		return buffer;
	};

	/** @private */
	var encodeValue = function(value, buffer){
		//calculate floor(log2(value)) + 1
		var len = 0,
			i;
		for(i = value; i > 0; i >>= 1)
			len ++;

		//calculate floor(log2(len))
		var lengthOfLen = 0;
		for(i = len; i > 1; i >>= 1)
			lengthOfLen ++;

		for(i = lengthOfLen; i > 0; -- i)
			buffer.appendBit(0);
		for(i = lengthOfLen; i >= 0; -- i)
			buffer.appendBit((len >> i) & 1);
		for(i = len - 2; i >= 0; i --)
			buffer.appendBit((value >> i) & 1);
	};


	var decode = function(decodingBufferIterator){
		var values = [];
		while(decodingBufferIterator.hasNext())
			values.push(decodeValue(decodingBufferIterator));
		if(values[values.lengh - 1] == null)
			values.pop();

		return values;
	};

	/** @private */
	var decodeValue = function(itr){
		var lengthOfLen = 0;
		while(itr.hasNext() && !itr.next())
			lengthOfLen ++;
		if(!itr.hasNext())
			return null;

		var len = 1,
			i;
		for(i = 0; i < lengthOfLen; i ++){
			len <<= 1;
			if(itr.next())
				len |= 1;
		}

		var value = 1;
		for(i = 0; i < len - 1; i ++){
			value <<= 1;
			if(itr.next())
				value |= 1;
		}

		return value;
	};


	return {
		encode: encode,
		decode: decode
	};

});
