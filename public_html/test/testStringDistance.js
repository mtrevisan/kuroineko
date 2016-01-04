require(['tools/data/StringDistance', 'tools/lang/phonology/Phone'], function(StringDistance, Phone){
	QUnit.module('StringDistance');

	var defaultCosts = {insertion: 1, deletion: 2, substitution: 0.5, transposition: 0.7};


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

	QUnit.test('levenshtein - substitution', function(){
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



	QUnit.test('damerau-levenshtein - same', function(){
		equal(StringDistance.damerauLevenshteinDistance('a', 'a', defaultCosts), 0);
		equal(StringDistance.alignmentLength('a', 'a', StringDistance.damerauLevenshteinDistance), 1);
		equal(StringDistance.getStructuralDistance('a', 'a', defaultCosts), 0 / 1 / 2);
	});

	QUnit.test('damerau-levenshtein - deletion', function(){
		equal(StringDistance.damerauLevenshteinDistance('aa', 'a', defaultCosts), 2);
		equal(StringDistance.alignmentLength('aa', 'a', StringDistance.damerauLevenshteinDistance), 2);
		equal(StringDistance.getStructuralDistance('aa', 'a', defaultCosts), 2 / 2 / 2);
	});

	QUnit.test('damerau-levenshtein - insertion', function(){
		equal(StringDistance.damerauLevenshteinDistance('ab', 'ba', defaultCosts), 0.7);
		equal(StringDistance.alignmentLength('ab', 'ba', StringDistance.damerauLevenshteinDistance), 2);
		equal(StringDistance.getStructuralDistance('ab', 'ba', defaultCosts), 1 / 2 / 2);
	});

	QUnit.test('damerau-levenshtein - substitution', function(){
		equal(StringDistance.damerauLevenshteinDistance('a', 'b', defaultCosts), 0.5);
		equal(StringDistance.alignmentLength('a', 'b', StringDistance.damerauLevenshteinDistance), 1);
		equal(StringDistance.getStructuralDistance('a', 'b', defaultCosts), 0.5 / 1 / 2);
	});

	QUnit.test('damerau-levenshtein - transposition', function(){
		equal(StringDistance.damerauLevenshteinDistance('a', 'a', defaultCosts), 0);
		equal(StringDistance.alignmentLength('a', 'a', StringDistance.damerauLevenshteinDistance), 1);
		equal(StringDistance.getStructuralDistance('a', 'a', defaultCosts), 0 / 1 / 2);
	});

	QUnit.test('damerau-levenshtein - saver/sapere', function(){
		equal(StringDistance.damerauLevenshteinDistance('saveler', 'apelere', defaultCosts).toFixed(1), 2.9);
		equal(StringDistance.alignmentLength('saveler', 'apelere', StringDistance.damerauLevenshteinDistance), 7);
		equal(StringDistance.getStructuralDistance('saveler', 'apelere', defaultCosts), 3.5 / 7 / 2);
	});

	QUnit.test('damerau-levenshtein - custom matchingFn', function(){
		var costs = {
			insertion: 1,
			deletion: 2,
			substitution: 0.5,
			transposition: 0.7,
			matchingFn: function(from, to){
				var fromFeatures = Phone.convertStringIntoFeatures(from),
					toFeatures = Phone.convertStringIntoFeatures(to),
					differences = Phone.compareFeatures(fromFeatures[0], toFeatures[0], true).diff;
				return differences.length / 26;
			}
		};
		equal(StringDistance.damerauLevenshteinDistance('saveler', 'apelere', costs), 2.976923076923077);
	});
});
