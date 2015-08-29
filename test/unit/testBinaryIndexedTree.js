define(['tools/data/structs/BinaryIndexedTree'], function(BinaryIndexedTree){
	describe('BinaryIndexedTree', function(){
		it('array contructor', function(){
			var freqs = [1, 1, 1, 1, 1],
				i;
			var bit = new BinaryIndexedTree(5, freqs);

			for(i = 0; i < freqs.length; i ++){
				expect(bit.read(i)).toBe(1);
				expect(bit.readCumulative(i)).toBe(i + bit.read(i));
			}
			expect(bit.readTotal()).toBe(5);
		});

		it('size contructor', function(){
			var bit = new BinaryIndexedTree(5),
				i;

			for(i = 0; i < 5; i ++){
				expect(bit.read(i)).toBe(1);
				expect(bit.readCumulative(i)).toBe(i + bit.read(i));
			}
			expect(bit.readTotal()).toBe(5);
		});

		it('update', function(){
			var bit = new BinaryIndexedTree(5);

			bit.update(2, 1);
			bit.update(4, 2);

			expect(bit.read(0)).toBe(1);
			expect(bit.read(1)).toBe(1);
			expect(bit.read(2)).toBe(2);
			expect(bit.read(3)).toBe(1);
			expect(bit.read(4)).toBe(3);

			expect(bit.readCumulative(0)).toBe(1);
			expect(bit.readCumulative(1)).toBe(2);
			expect(bit.readCumulative(2)).toBe(4);
			expect(bit.readCumulative(3)).toBe(5);
			expect(bit.readCumulative(4)).toBe(8);

			expect(bit.readTotal()).toBe(8);
		});

		it('map', function(){
			var bit = new BinaryIndexedTree(5);

			bit.update(2, 1);
			bit.update(4, 2);
			bit.map(function(k){ return ((k + 1) >> 1); });

			expect(bit.read(0)).toBe(1);
			expect(bit.read(1)).toBe(1);
			expect(bit.read(2)).toBe(1);
			expect(bit.read(3)).toBe(1);
			expect(bit.read(4)).toBe(2);

			expect(bit.readCumulative(0)).toBe(1);
			expect(bit.readCumulative(1)).toBe(2);
			expect(bit.readCumulative(2)).toBe(3);
			expect(bit.readCumulative(3)).toBe(4);
			expect(bit.readCumulative(4)).toBe(6);

			expect(bit.readTotal()).toBe(6);
		});

		it('find exact', function(){
			var bit = new BinaryIndexedTree(5);

			bit.update(2, 1);
			bit.update(4, 2);

			expect(bit.find(0, true)).toBe(0);
			expect(bit.find(1, true)).toBe(1);
			expect(bit.find(2, true)).toBe(2);
			expect(bit.find(3, true)).toBe(-1);
			expect(bit.find(4, true)).toBe(3);
			expect(bit.find(5, true)).toBe(4);
			expect(bit.find(6, true)).toBe(-1);
			expect(bit.find(7, true)).toBe(-1);
			expect(bit.find(8, true)).toBe(5);
			expect(bit.find(9, true)).toBe(-1);
		});

		it('find lower', function(){
			var bit = new BinaryIndexedTree(5);

			bit.update(2, 1);
			bit.update(4, 2);

			expect(bit.find(0)).toBe(0);
			expect(bit.find(1)).toBe(1);
			expect(bit.find(2)).toBe(2);
			expect(bit.find(3)).toBe(2);
			expect(bit.find(4)).toBe(3);
			expect(bit.find(5)).toBe(4);
			expect(bit.find(6)).toBe(4);
			expect(bit.find(7)).toBe(4);
			expect(bit.find(8)).toBe(5);
			expect(bit.find(9)).toBe(5);
		});
	});
});
