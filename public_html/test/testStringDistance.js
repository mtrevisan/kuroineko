require(['tools/data/StringDistance', 'tools/lang/phonology/Phone'], function(StringDistance, Phone){
	QUnit.module('StringDistance');

	var defaultCosts = {insertion: 1, deletion: 2, substitution: 0.5, transposition: 1};
	var otherCosts = {
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


	QUnit.test('levenshtein - same', function(){
		equal(StringDistance.levenshteinDistance('a', 'a', defaultCosts), 0);
		equal(StringDistance.levenshteinStructuralDistance('a', 'a', defaultCosts), 0 / 1 / 2);
	});

	QUnit.test('levenshtein - deletion', function(){
		equal(StringDistance.levenshteinDistance('aa', 'a', defaultCosts), 2);
		equal(StringDistance.levenshteinStructuralDistance('aa', 'a', defaultCosts), 2 / 2 / 2);
	});

	QUnit.test('levenshtein - insertion', function(){
		equal(StringDistance.levenshteinDistance('a', 'aa', defaultCosts), 1);
		equal(StringDistance.levenshteinStructuralDistance('a', 'aa', defaultCosts), 1 / 2 / 2);
	});

	QUnit.test('levenshtein - substitution', function(){
		equal(StringDistance.levenshteinDistance('a', 'b', defaultCosts), 0.5);
		equal(StringDistance.levenshteinStructuralDistance('a', 'b', defaultCosts), 0.5 / 1 / 2);
	});

	QUnit.test('levenshtein - saver/sapere', function(){
		equal(StringDistance.levenshteinDistance('saveler', 'apelere', defaultCosts), 3.5);
		equal(StringDistance.levenshteinStructuralDistance('saveler', 'apelere', defaultCosts), 3.5 / 7 / 2);
	});

	QUnit.test('levenshtein - custom matchingFn', function(){
		equal(StringDistance.levenshteinDistance('saveler', 'apelere', otherCosts), 3.1538461538461537);
	});



	QUnit.test('damerau-levenshtein - same', function(){
		equal(StringDistance.damerauLevenshteinDistance('a', 'a', defaultCosts), 0);
		equal(StringDistance.damerauLevenshteinStructuralDistance('a', 'a', defaultCosts), 0 / 1 / 2);
	});

	QUnit.test('damerau-levenshtein - deletion', function(){
		equal(StringDistance.damerauLevenshteinDistance('aa', 'a', defaultCosts), 2);
		equal(StringDistance.damerauLevenshteinStructuralDistance('aa', 'a', defaultCosts), 2 / 2 / 2);
	});

	QUnit.test('damerau-levenshtein - insertion', function(){
		equal(StringDistance.damerauLevenshteinDistance('a', 'ab', defaultCosts), 1);
		equal(StringDistance.damerauLevenshteinStructuralDistance('a', 'ab', defaultCosts), 1 / 2 / 2);
	});

	QUnit.test('damerau-levenshtein - substitution', function(){
		equal(StringDistance.damerauLevenshteinDistance('a', 'b', defaultCosts), 0.5);
		equal(StringDistance.damerauLevenshteinStructuralDistance('a', 'b', defaultCosts), 0.5 / 1 / 2);
	});

	QUnit.test('damerau-levenshtein - transposition', function(){
		equal(StringDistance.damerauLevenshteinDistance('ab', 'ba', defaultCosts), 1);
		equal(StringDistance.damerauLevenshteinStructuralDistance('ab', 'ba', defaultCosts), 1 / 2 / 2);
	});

	QUnit.test('damerau-levenshtein - saver/sapere', function(){
		equal(StringDistance.damerauLevenshteinDistance('saveler', 'apelere', defaultCosts), 3.5);
		equal(StringDistance.damerauLevenshteinStructuralDistance('saveler', 'apelere', defaultCosts), 3.5 / 7 / 2);
	});

	QUnit.test('damerau-levenshtein - arzento', function(){
		equal(StringDistance.damerauLevenshteinStructuralDistance('ardento', 'ardent', defaultCosts), 0.14285714285714285);
		deepEqual(StringDistance.damerauLevenshteinEdit('ardento', 'ardent', defaultCosts), {deletions: 1, insertions: 0, substitutions: 0, transpositions: 0, distance: 2});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ardent', 'ardento', defaultCosts), 0.07142857142857142);
		deepEqual(StringDistance.damerauLevenshteinEdit('ardent', 'ardento', defaultCosts), {deletions: 0, insertions: 1, substitutions: 0, transpositions: 0, distance: 1});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ardent', 'radent', {insertion: 1, deletion: 2, substitution: 0.5, transposition: 0.4}), 0.03333333333333333);
		deepEqual(StringDistance.damerauLevenshteinEdit('ardent', 'radent', {insertion: 1, deletion: 2, substitution: 0.5, transposition: 0.4}), {deletions: 0, insertions: 0, substitutions: 0, transpositions: 1, distance: 0.4});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ard͡zento', 'arðentu', defaultCosts), 0.05555555555555555);
		deepEqual(StringDistance.damerauLevenshteinEdit('ard͡zento', 'arðentu', defaultCosts), {deletions: 0, insertions: 0, substitutions: 2, transpositions: 0, distance: 1});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ardento', 'arðentu', defaultCosts), 0.07142857142857142);
		deepEqual(StringDistance.damerauLevenshteinEdit('ardento', 'arðentu', defaultCosts), {deletions: 0, insertions: 0, substitutions: 2, transpositions: 0, distance: 1});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ardento', 'arjento', defaultCosts), 0.03571428571428571);
		deepEqual(StringDistance.damerauLevenshteinEdit('ardento', 'arjento', defaultCosts), {deletions: 0, insertions: 0, substitutions: 1, transpositions: 0, distance: 0.5});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ard͡zento', 'ard͡ʒento', defaultCosts), 0.027777777777777776);
		deepEqual(StringDistance.damerauLevenshteinEdit('ard͡zento', 'ard͡ʒento', defaultCosts), {deletions: 0, insertions: 0, substitutions: 1, transpositions: 0, distance: 0.5});

		equal(StringDistance.damerauLevenshteinStructuralDistance('ardento', 'ardento', defaultCosts), 0);
		deepEqual(StringDistance.damerauLevenshteinEdit('ardento', 'ardento', defaultCosts), {deletions: 0, insertions: 0, substitutions: 0, transpositions: 0, distance: 0});

	});

	QUnit.test('damerau-levenshtein - custom matchingFn', function(){
		equal(StringDistance.damerauLevenshteinDistance('saveler', 'apelere', otherCosts), 2.976923076923077);
	});
});
