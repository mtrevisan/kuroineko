require(['tools/data/StringDistance', 'tools/lang/phonology/Phone'], function(StringDistance, Phone){
	QUnit.module('StringDistance');

	var defaultCosts = {insertion: 1, deletion: 2, modification: 0.5};


	QUnit.test('levenshtein - same', function(){
		equal(StringDistance.levenshteinDistance('a', 'a', defaultCosts), 0);
		equal(StringDistance.alignmentLength('a', 'a'), 1);
		equal(StringDistance.getStructuralDistance('a', 'a', defaultCosts), 0 / 1 / 2);
	});

	QUnit.test('levenshtein - deletion', function(){
		equal(StringDistance.levenshteinDistance('aa', 'a', defaultCosts), 2);
		equal(StringDistance.alignmentLength('aa', 'a'), 2);
		equal(StringDistance.getStructuralDistance('aa', 'a', defaultCosts), 2 / 2 / 2);
	});

	QUnit.test('levenshtein - insertion', function(){
		equal(StringDistance.levenshteinDistance('a', 'aa', defaultCosts), 1);
		equal(StringDistance.alignmentLength('a', 'aa'), 2);
		equal(StringDistance.getStructuralDistance('a', 'aa', defaultCosts), 1 / 2 / 2);
	});

	QUnit.test('levenshtein - modification', function(){
		equal(StringDistance.levenshteinDistance('a', 'b', defaultCosts), 0.5);
		equal(StringDistance.alignmentLength('a', 'b'), 1);
		equal(StringDistance.getStructuralDistance('a', 'b', defaultCosts), 0.5 / 1 / 2);
	});

	QUnit.test('levenshtein - saver/sapere', function(){
		equal(StringDistance.levenshteinDistance('saveler', 'apelere', defaultCosts), 3.5);
		equal(StringDistance.alignmentLength('saveler', 'apelere'), 7);
		equal(StringDistance.getStructuralDistance('saveler', 'apelere', defaultCosts), 3.5 / 7 / 2);
	});

	QUnit.test('levenshtein - custom matchingFn', function(){
		var costs = {
			insertion: 1,
			deletion: 2,
			modification: 0.5,
			matchingFn: function(from, to){
				var fromFeatures = Phone.convertStringIntoFeatures(from),
					toFeatures = Phone.convertStringIntoFeatures(to),
					differences = Phone.compareFeatures(fromFeatures[0], toFeatures[0], true).diff;
				return differences.length / 26;
			}
		};
		equal(StringDistance.levenshteinDistance('saveler', 'apelere', costs), 3.1538461538461537);
	});
});
