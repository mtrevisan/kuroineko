require(['tools/data/StringDistance'], function(StringDistance){
	QUnit.module('StringDistance');

	QUnit.test('levenshtein - same', function(){
		equal(StringDistance.levenshteinDistance('a', 'a'), 0);
	});

	QUnit.test('levenshtein - deletion', function(){
		equal(StringDistance.levenshteinDistance('aa', 'a'), 2);
	});

	QUnit.test('levenshtein - insertion', function(){
		equal(StringDistance.levenshteinDistance('a', 'aa'), 1);
	});

	QUnit.test('levenshtein - modification', function(){
		equal(StringDistance.levenshteinDistance('a', 'b'), 0.5);
	});
});
