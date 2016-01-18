# kuroineko library
[![bitHound Overall Score](https://www.bithound.io/github/mtrevisan/library/badges/score.svg)](https://www.bithound.io/github/mtrevisan/library)
=========
This is a bunch of utilities I put together. Unfortunately I miss some, if not all, references to the original projects. I beg pardon, and whenever I found out the original ones I'll update my references.

Utilities comprises:
 - a minimal AMD loader compatible with requireJS

### Data ###
 - decision tree
 - HTML storage
 - Mersenne Twister, get a random variable with a given distribution
 - data structures like Binary Indexed Tree, Bit Buffer, Trie
 - Lexer
 - various helpers (array, communication, function, math, object, and string)

### String Alignment ###
Various string alignment algorithms. All of which has the same signature as explained below

    var nw = new NeedlemanWunsch('abc', 'acb', function(a, b){ return (a === b? 0: 1); }, function(){ return 1; }, function(){ return 1; });
    var editOperations = nw.align();

or with defaults cost functions

    var nw = new NeedlemanWunsch('abc', 'acb');
    var editOperations = nw.align();

editOperations.operations is a string with that encodes the edit operations needed to transform the first string into the second.
By edit operations is intended that a space is a match, a '*' is a change, a '+' is an insertion, and a '-' is a deletion.

#### Needleman-Wunsch ####
Needleman-Wunsch global alignment algorithm.

#### Needleman-Wunsch-Ukkonen ####
Needleman-Wunsch-Ukkonen global alignment algorithm.

#### Smith-Watermann ####
Smith-Waterman local alignment algorithm.

### String Distance ###
Various string distance algorithms like Levenshtein, and Damerau-Levenshtein.

#### Levenshtein ####

    var defaultCosts = {insertion: 1, deletion: 2, substitution: 0.5, transposition: 1};
    
    var edit = StringDistance.levenshteinEdit('abc', 'acb');
    var distance = StringDistance.levenshteinDistance('abc', 'acb');
    var percent = StringDistance.levenshteinStructuralDistance('abc', 'acb');
	 
    var edit = StringDistance.levenshteinEdit('abc', 'acb', defaultCosts);
    var distance = StringDistance.levenshteinDistance('abc', 'acb', defaultCosts);
    var percent = StringDistance.levenshteinStructuralDistance('abc', 'acb', defaultCosts);

Where edit is an object in the form {insertions: 0, deletions: 0, substitutions: 0, distance: 0} which encodes the number of insertions, deletions, and substitutions, along with the distance; and percent is the quantity of change between the two strings expressed as a percentual.

#### Damerau-Levenshtein ####

    var defaultCosts = {insertion: 1, deletion: 2, substitution: 0.5, transposition: 1};
    
    var edit = StringDistance.damerauLevenshteinEdit('abc', 'acb');
    var distance = StringDistance.damerauLevenshteinDistance('abc', 'acb');
    var percent = StringDistance.damerauLevenshteinStructuralDistance('abc', 'acb');
	 
    var edit = StringDistance.damerauLevenshteinEdit('abc', 'acb', defaultCosts);
    var distance = StringDistance.damerauLevenshteinDistance('abc', 'acb', defaultCosts);
    var percent = StringDistance.damerauLevenshteinStructuralDistance('abc', 'acb', defaultCosts);

Where edit is an object in the form {insertions: 0, deletions: 0, substitutions: 0, transpositions: 0, distance: 0} which encodes the number of insertions, deletions, substitutions, and transpositions, along with the distance; and percent is the quantity of change between the two strings expressed as a percentual.

### Coders ###
Various coders algorithms like arithmetic, and Elias.

#### Arithmetic coder ####
Encoding process:

    var msg = 'This method will be called exactly once for each symbol being encoded or decoded';
    //create model of order 0
    var model = CoderDriver.create(HighOrderModelFactory.createFrom(BasicModel, 0));
    //model of order 0 can also be created as follows
    //var model = CoderDriver.create(BasicModel);
    //the count for each seen character can be setted
    //var model = CoderDriver.create(HighOrderModelFactory.createFrom(BasicModel, 2), {updateCount: 200});
    var buffer = model.compress(msg);

Decoding process:

    var data = new Uint8Array(buffer.array());
    var itr = (new BitBuffer(data)).getIterator();
    var out = model.decompress(itr);


#### Elias delta coder ####
Encoding process:
    var fixedCounts = {
		'T': 5,
		'h': 1,
		'i': 2,
		's': 1
	 };
    
    var data = [],
    	i;
    for(i in fixedCounts){
    	data.push(i.charCodeAt(0));
    	data.push(fixedCounts[i]);
    }
    var buffer = EliasDeltaCoder.encode(data);
    //or, if buffer is given
    //EliasDeltaCoder.encode(data, buffer);

Decoding process:
    var out = EliasDeltaCoder.decode(buffer.getIterator());


### Language (primarly used for Venetan) ###
 - conjugator, paradigm, pronoun, themizer, verb
 - grapheme, orthography, phone, phonology helper, syllabator, syllabe, word
 - language recognition using Markov chains and n-grams


### Measure ###
 - measure converter


### Math ###
 - Normal and Student-T distributions
 - Continued fractions and fraction
 - various functions like bitCount, nextPowerOf2, getMostSignificantBit, getLeastSignificantBit, combine, and permute


### Measure ###
 - Measure converter and scalar


### Spell checker ###
 - Norvig spell checker
 - Hunspell dictionary reader


### UI ###
 - alerter
 - validator


### General ###
 - AMD loader
