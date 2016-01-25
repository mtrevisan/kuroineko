# kuroineko library
[![bitHound Overall Score](https://www.bithound.io/github/mtrevisan/library/badges/score.svg)](https://www.bithound.io/github/mtrevisan/library)
=========
This is a bunch of utilities I put together. Unfortunately I miss some references to the original projects. I beg pardon, and whenever I found out the original ones I'll update my references.

## Table of contents ##
- [Data](#data)
  - [String Alignment](#string-alignment)
    - [Needleman-Wunsch](#needleman-wunsch)
    - [Needleman-Wunsch-Ukkonen](#needleman-wunsch-ukkonen)
    - [Smith-Watermann](#smith-watermann)
  - [String Distance](#string-distance)
    - [Levenshtein](#levenshtein)
    - [Damerau-Levenshtein](#damerau-levenshtein)
  - [Clustering](#clustering)
    - [Hierarchical](#hierarchical-clustering)
    - [OPTICS](#optics-clustering)
  - [Coders](#coders)
    - [Arithmetic coder](#arithmetic-coder)
    - [Elias delta coder](#elias-delta-coder)
  - [Random algorithms](#random-algorithms)
    - [Mersenne-Twister](#mersenne-twister)
    - [Random](#random)
  - [Structs](#structs)
    - [Binary Indexed Tree](#binary-indexed-tree)
    - [Bit Buffer](#bit-buffer)
    - [Priority Queue](#priority-queue)
    - [Tarjan's Strongly Connected Components](#tarjan-strongly-connected-components)
    - [Tree](#tree)
    - [Trie](#trie)
- [Language (primarily used for Venetan)](#language)
- [Math](#math)
- [Measure](#measure)
- [Spell checker](#spell-checker)
- [UI](#ui)
- [General](#general)


## Data <a id="data"></a>##
 - HTML storage
 - Lexer
 - various helpers (array, communication, function, math, object, and string)
 - math helper containing various functions like bitCount, nextPowerOf2, getMostSignificantBit, getLeastSignificantBit, combine, and permute


### String Alignment <a id="string-alignment"></a>###
Various string alignment algorithms. All of which has the same signature as explained below

    var nw = new NeedlemanWunsch('abc', 'acb', function(a, b){ return (a === b? 0: 1); }, function(){ return 1; }, function(){ return 1; });
    var editOperations = nw.align();

or with defaults cost functions

    var nw = new NeedlemanWunsch('abc', 'acb');
    var editOperations = nw.align();

editOperations.operations is a string with that encodes the edit operations needed to transform the first string into the second.
By edit operations is intended that a space is a match, a `*` is a change, a `+` is an insertion, and a `-` is a deletion.

#### Needleman-Wunsch <a id="needleman-wunsch"></a>####
Needleman-Wunsch global alignment algorithm.

#### Needleman-Wunsch-Ukkonen <a id="needleman-wunsch-ukkonen"></a>####
Needleman-Wunsch-Ukkonen global alignment algorithm.

#### Smith-Watermann <a id="smith-watermann"></a>####
Smith-Waterman local alignment algorithm.


### String Distance <a id="string-distance"></a>###
Various string distance algorithms like Levenshtein, and Damerau-Levenshtein.

#### Levenshtein <a id="levenshtein"></a>####

    var defaultCosts = {insertion: 1, deletion: 2, substitution: 0.5, transposition: 1};
    
    var edit = StringDistance.levenshteinEdit('abc', 'acb');
    var distance = StringDistance.levenshteinDistance('abc', 'acb');
    var percent = StringDistance.levenshteinStructuralDistance('abc', 'acb');
	 
    var edit = StringDistance.levenshteinEdit('abc', 'acb', defaultCosts);
    var distance = StringDistance.levenshteinDistance('abc', 'acb', defaultCosts);
    var percent = StringDistance.levenshteinStructuralDistance('abc', 'acb', defaultCosts);

Where `edit` is an object in the form `{insertions: 0, deletions: 0, substitutions: 0, distance: 0}` which encodes the number of insertions, deletions, and substitutions, along with the distance; and `percent` is the quantity of change between the two strings expressed as a percentual.

#### Damerau-Levenshtein <a id="damerau-levenshtein"></a>####

    var defaultCosts = {insertion: 1, deletion: 2, substitution: 0.5, transposition: 1};
    
    var edit = StringDistance.damerauLevenshteinEdit('abc', 'acb');
    var distance = StringDistance.damerauLevenshteinDistance('abc', 'acb');
    var percent = StringDistance.damerauLevenshteinStructuralDistance('abc', 'acb');
	 
    var edit = StringDistance.damerauLevenshteinEdit('abc', 'acb', defaultCosts);
    var distance = StringDistance.damerauLevenshteinDistance('abc', 'acb', defaultCosts);
    var percent = StringDistance.damerauLevenshteinStructuralDistance('abc', 'acb', defaultCosts);

Where `edit` is an object in the form `{insertions: 0, deletions: 0, substitutions: 0, transpositions: 0, distance: 0}` which encodes the number of insertions, deletions, substitutions, and transpositions, along with the distance; and `percent` is the quantity of change between the two strings expressed as a percentual.


### Clustering <a id="clustering"></a>###
Various algorithms for data clustering.

#### Hierarchical clustering <a id="hierarchical-clustering"></a>####

    var distanceMatrix = [[0, 1, 2], [undefined, 0, 3], [undefined, undefined, 4]];
    var header = ['a', 'b', 'c'];
    var tree = HierarchicalClusterer.cluster(distanceMatrix, header);

#### OPTICS clustering <a id="optics-clustering"></a>####
Ordering Points To Identify the Clustering Structure (OPTICS).

    var pointsMatrix = [[0, 0], [0, 0.5], [0, -0.8], [1, 0], [-1, 0.5]];
    var result = OPTICSClusterer.cluster(pointsMatrix, 0.9, 2);


### Coders <a id="coders"></a>###
Various coders algorithms like arithmetic, and Elias.

#### Arithmetic coder <a id="arithmetic-coder"></a>####
Encoding process:

    var msg = 'This method will be called exactly once for each symbol being encoded or decoded';
    //create model of order 0
    var model = CoderDriver.create(HighOrderModelFactory.createFrom(BasicModel, 0));
    //model of order 0 can also be created as follows
    //var model = CoderDriver.create(BasicModel);
    //the count for each seen character can be setted
    //var model = CoderDriver.create(HighOrderModelFactory.createFrom(BasicModel, 2), {updateCount: 200});
    var buffer = model.encode(msg);

Decoding process:

    var itr = buffer.getIterator();
    var out = model.decode(itr);


#### Elias delta coder <a id="elias-delta-coder"></a>####
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

    var itr = buffer.getIterator();
    var out = EliasDeltaCoder.decode(itr);

### Data Mining <a id="data-mining"></a>###

    var attributes = [];
    for(var i = 0; i < 38; i ++)
    	attributes.push({name: i18nResources.variant.attributes[i], discrete: true});
    data = [
    	[1,1,1,0,1,1,0,1,1, , , , , , , , ,0,0,1,0,0,0,0, , , , ,1,0, ,0, ,1, , ,0,0, 'liventin'],
    	[1,1,1,1,1,1,0,1,1,1,1,1, ,1,1,1,1,1,1,0,0,0,0,0, , , , , ,0,0,0, ,1, , ,0,0, 'feltrin-belumat']
    ];
	 
    var fnSupervisorConfirmClass = function(nodeClass){
    	return new Promise(function(resolve){
    		var btnYes = Alerter.defineOkButton(i18nResources.variant.yes, function(){
    			console.log('supervisor chooses class ' + nodeClass + ' is correct');
    
    			recordSupervisedInstance(nodeClass, false);
    
    			resolve(true);
    		});
    		var btnNo = Alerter.defineCancelButton(i18nResources.variant.no, function(){
    			console.log('supervisor chooses class ' + nodeClass + ' is not correct');
    
    			resolve(false);
    		});
    
    		Alerter.show({
    			type: 'confirm',
    			message: i18nResources.variant.tryBefore + '<br><br>&ldquo;' + nodeClass + '&rdquo;<br><br>' + i18nResources.variant.tryAfter,
    			buttons: [btnYes, btnNo],
    			okButton: btnYes,
    			cancelButton: btnNo
    		});
    	});
    };
    
    var fnSupervisorAskBranch = function(attributeName, cutPoint, discreteAttribute){
    	return new Promise(function(resolve){
    		var btnYes = Alerter.defineOkButton(i18nResources.variant.yes, function(){
    			var response = (discreteAttribute? 'EQ': 'LT');
    			console.log('supervisor chooses "' + attributeName + '" w.r.t. ' + cutPoint + ' is ' + response);
    
    			resolve(response);
    		});
    		var btnNo = Alerter.defineCancelButton(i18nResources.variant.no, function(){
    			var response = (discreteAttribute? 'NE': 'GE');
    			console.log('supervisor chooses "' + attributeName + '" w.r.t. ' + cutPoint + ' is ' + response);
    
    			resolve(response);
    		});
    		var btnDontKnow = Alerter.defineButton('dont-know', i18nResources.variant.dontKnow, function(){
    			console.log('supervisor don\'t know how to chooses "' + attributeName + '" w.r.t. ' + cutPoint);
    
    			resolve(undefined);
    		});
    
    		Alerter.show({
    			type: 'confirm',
    			message: i18nResources.variant.sentence + '<br><br>&ldquo;' + attributeName + '&rdquo;<br><br>' + i18nResources.variant.is + ' <b>'
    				+ (discreteAttribute? i18nResources.variant[cutPoint == 1? 'truthy': 'falsy']: i18nResources.variant.lessThan + ' ' + cutPoint) + '</b>?',
    			buttons: [btnYes, btnNo, btnDontKnow],
    			okButton: btnYes,
    			cancelButton: btnDontKnow
    		});
    	});
    };
    
    var fnSupervisorAskNewAttributeAndClass = function(){
    	return new Promise(function(resolve){
    		var btnOk = Alerter.defineOkButton(i18nResources.variant.ok, function(response){
    			console.log('supervisor chooses new class, is ' + response);
    
    			recordSupervisedInstance(response, true);
    
    			resolve(response);
    		});
    
    		Alerter.show({
    			type: 'prompt',
    			message: i18nResources.variant.unable,
    			inputType: 'textarea',
    			buttons: [btnOk],
    			okButton: btnOk
    		});
    	});
    };
	 
    var dt = new DecisionTree(attributes, data);
    dt.attachSupervisor(fnSupervisorConfirmClass, fnSupervisorAskBranch, fnSupervisorAskNewAttributeAndClass);
    dt.buildTree();


### Random algorithms <a id="random-algorithms"></a>###

#### Mersenne-Twister <a id="mersenne-twister"></a>####
Mersenne Twister pseudorandom number generator.
Not cryptographically secure.

    //if no seed is defined, seed randomly
	 var seed = 123;
    var mt = new MersenneTwister(seed);
	 //random 32-bit integer
	 mt.int32();
	 //random 31-bit integer
    mt.int31();
    
	 //random float in the interval [0;1[ with 32-bit resolution
    mt.random();
	 //random float in the interval [0;1[ with 53-bit resolution
    mt.res53();
	 //random float in the interval [0;1]
    mt.real1();
	 //random float in the interval ]0;1[
    mt.real3();
    
	 //(re)seed the generator with an unsigned 32-bit integer
    mt.seed(seed);
	 //(re)seed using a state vector of unsigned 32-bit integers
    mt.seedArray(key);

#### Random <a id="random"></a>####
A Non-Uniform Random Generator using Mersenne-Twister.

    Random.getRandomValueWithGivenDistribution({a: 12, b: 1, c: 10});


### Structs <a id="structs"></a>###
Various data structures.

#### Binary Indexed Tree <a id="binary-indexed-tree"></a>####
bla

#### Bit Buffer <a id="bit-buffer"></a>####
bla

#### Priority Queue <a id="priority-queue"></a>####
Implementation of the Fibonacci heap data structure.

    var pq1 = new PriorityQueue();
    pq1.add(0, 'first');
    var pq2 = new PriorityQueue();
    pq2.add(-1, 'second');
    
    pq1.union(pq2);
    
    pq1.isEmpty();
    pq1.size();
    pq1.get().getPriority();
    pq1.get().getValue();
    pq1.extract();
    pq1.decreaseKey(0, 'first');
    pq1.deleteNode('first');

#### Tarjan's Strongly Connected Components <a id="tarjan-strongly-connected-components"></a>####
This is just for checking if a directed graph contains a cycle using Tarjan's algorithm.

    var t = new Tarjan();
    t.addVertex('a', ['b', 'c']);
    t.addVertex('b', ['d']);
    t.addVertex('c');
    t.addVertex('d', ['a']);
    
    var scc = t.getStronglyConnectedComponents();

#### Tree <a id="tree"></a>####
bla

#### Trie <a id="trie"></a>####

    var t = new Trie();
    t.add('abc');
    t.add('abb');
    t.add('ac');
    t.add('d');
    t.remove('d');
    
    t.contains('abc');
    
    t.getWords('a');
    
    t.findPrefix('ab');
    
    t.findMatchesOnPath('abcd');
    
    var count = 1;
    t.apply(function(node){
    	count ++;
    });


## Language (primarily used for Venetan) <a id="language"></a>##
 - conjugator, paradigm, pronoun, themizer, verb
 - grapheme, orthography, phone, phonology helper, syllabator, syllabe, word
 - language recognition using Markov chains and n-grams


## Math <a id="math"></a>##
 - Normal and Student-T distributions
 - Continued fractions
 - Fraction


## Measure <a id="measure"></a>##
 - measure converter
 - scalar
 - measure datas for venetan and SI


## Spell checker <a id="spell-checker"></a>##
 - Norvig spell checker
 - Hunspell dictionary reader


## UI <a id="ui"></a>##
 - alerter
 - validator


## General <a id="general"></a>##
 - a minimal AMD loader compatible with requireJS
