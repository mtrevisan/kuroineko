require(['tools/data/coder/elias/EliasDeltaCoder', 'tools/data/structs/BitBuffer', 'text!tools/lang/data/Galepin.js'], function(EliasDeltaCoder, BitBuffer, Galepin){
	QUnit.module('EliasDeltaCoder');

	var extractCounts = function(text){
		var list = text.split(''),
			data = {};
		list.forEach(function(elem){
			elem = elem.charCodeAt(0);

			if(elem > 254){
				data[255] = (data[255] | 0) + 1;
				elem >>= 8;
			}
			data[elem] = (data[elem] | 0) + 1;
		});

		return data;
	};


	QUnit.test('coding/decoding', function(){
		var base = 'This method will be called exactly once for each symbol being encoded or decoded, and the calls will be made in the order in which they';
		var fixedCounts = extractCounts(base);

		var data = [],
			i;
		for(i in fixedCounts){
			data.push(i.charCodeAt(0));
			data.push(fixedCounts[i]);
		}

		var buffer = EliasDeltaCoder.encode(data);
		var out = EliasDeltaCoder.decode(buffer.getIterator());

		deepEqual(out, data);
	});

	QUnit.test('coding/decoding', function(){
		var fixedCounts = extractCounts(Galepin);

		var data = [],
			i;
		for(i in fixedCounts){
			data.push(i.charCodeAt(0));
			data.push(fixedCounts[i]);
		}

		var buffer = EliasDeltaCoder.encode(data);

		console.log(Math.floor(buffer.size() / 8) + ' B');

		var out = EliasDeltaCoder.decode(buffer.getIterator());

		deepEqual(out, data);
	});
});
