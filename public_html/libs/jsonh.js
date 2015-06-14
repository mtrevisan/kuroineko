define(function(){
	/**
	 * Copyright (C) 2011 by Andrea Giammarchi, @WebReflection
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */

	/**
	 * transforms [{a: "A"}, {a: "B"}] into [1, "a", "A", "B"]
	 *
	 * @private
	 */
	function hpack(list){
		var length = list.length,
			//defined properties (out of one object is enough)
			keys = ObjectKeys(length? list[0]: {}),
			keyLength = keys.length,
			//static length stack of JS values
			result = Array(length * keyLength),
			j = 0,
			i, k, obj;
		for(i = 0; i < length; i ++)
			for(obj = list[i], k = 0; k < keyLength; )
				result[j ++] = obj[keys[k ++]];
		//keys.length, keys, result
		return concat.call([keyLength], keys, result);
	}

	/**
	 * transforms [1, "a", "A", "B"] into [{a: "A"}, {a: "B"}]
	 *
	 * @private
	 */
	function hunpack(hlist){
		var length = hlist.length,
			keyLength = hlist[0],
			result = Array(((length - keyLength - 1) / keyLength) || 0),
			j = 0,
			i, k, obj;
		for(i = 1 + keyLength; i < length; )
			for(result[j ++] = (obj = {}), k = 0; k < keyLength; )
				obj[hlist[++ k]] = hlist[i ++];
		return result;
	}

	/**
	 * recursive: called via map per each item h(pack|unpack)ing each entry through the schema
	 *
	 * @private
	 */
	function iteratingWith(method){
		return function(item){
			var path = this,
				current = item,
				length = path.length,
				i, j, k, tmp;
			for(i = 0; i < length; i ++){
				if(isArray(tmp = current[k = path[i]])){
					j = i + 1;
					current[k] = (j < length? map.call(tmp, method, path.slice(j)): method(tmp));
				}
				current = current[k];
			}
			return item;
		};
	}

	/**
	 * called per each schema (pack|unpack)ing each schema
	 *
	 * @private
	 */
	function packOrUnpack(method){
		return function(obj, schema){
			var wasArray = isArray(obj),
				result = concat.call(arr, obj),
				path = concat.call(arr, schema),
				length = path.length,
				i;
			for(i = 0; i < length; i ++)
				result = map.call(result, method, path[i].split('.'));
			return (wasArray? result: result[0]);
		};
	}

	function pack(list, schema){
		return (schema? packSchema(list, schema): hpack(list));
	}

	function unpack(hlist, schema){
		return (schema? unpackSchema(hlist, schema): hunpack(hlist));
	}

	var
		//recycled for different operations
		arr = [],
		//trapped once reused forever
		concat = arr.concat,
		//addressed cross platform Object.keys shim
		ObjectKeys = Object.keys || function(obj){
			var keys = [],
				key;
			for(key in obj)
				obj.hasOwnProperty(key) && keys.push(key);
			return keys;
		},
		//addressed cross platform Array.isArray shim
		isArray = Array.isArray || (function(toString, arrayToString){
			arrayToString = toString.call(arr);
			return function(obj){
				return toString.call(obj) == arrayToString;
			};
		}({}.toString)),
		//fast and partial Array#map shim
		map = arr.map || function(callback, context){
			var self = this,
				i = self.length,
				result = Array(i);
			while(i --)
				result[i] = callback.call(context, self[i], i, self);
			return result;
		},
		//schema related (pack|unpack)ing operations
		packSchema = packOrUnpack(iteratingWith(hpack)),
		unpackSchema = packOrUnpack(iteratingWith(hunpack));


	return {
		pack: pack,
		unpack: unpack
	};

});
