/**
 * @class DecisionTreeContext
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(attributes, data){
		this.attributes = attributes;
		this.ignoredAttributes = [];
		this.data = data;
	};


	var clone = function(data){
		return new Constructor(this.attributes, data);
	};

	var belongsToSameClass = function(){
		//count occurrences:
		var classIndex = this.attributes.length,
			fnExtractClassValue = function(instance){ return instance[classIndex]; },
			counter = {};
		this.data.forEach(function(k){
			k = fnExtractClassValue(k);
			counter[k] = counter[k] + 1 || 1;
		});

		counter = Object.keys(counter);

		return (counter.length == 1? counter[0]: undefined);
	};

	var ignoreAttribute = function(idx){
		this.ignoredAttributes[idx] = true;
	};

	/**
	 * For each attribute, calculate the potential information provided by a test on the attribute (based on the probabilities of each
	 * case having a particular value for the attribute), and the gain in information that would result from a test on the attribute
	 * (based on the probabilities of each case with a particular value for the attribute being of a particular class)
	 *
	 * @see http://en.wikipedia.org/wiki/ID3_algorithm
	 * @see http://en.wikipedia.org/wiki/C4.5_algorithm
	 * @see http://en.wikipedia.org/wiki/Information_gain
	 * @see http://en.wikipedia.org/wiki/Information_gain_in_decision_trees
	 * @see http://www.jofcis.com/publishedpapers/2012_8_4_1467_1475.pdf
	 *
	 * @return index of attribute with maximum entropy
	 */
	var selectAttributeWithHighestGain = function(){
		var classIndex = this.attributes.length,
			fnExtractClassValue = function(instance){ return instance[classIndex]; },
			bestInfo = {},
			info;

		this.attributes.forEach(function(attribute, idx){
			if(this.ignoredAttributes[idx])
				return;

			info = getInformationGainRatioAndCutPoint(this.data, attribute.discrete, fnExtractClassValue, function(instance){ return instance[idx]; });

			//find the most informative
			if(info.informationGainRatio && (!bestInfo.informationGainRatio || info.informationGainRatio > bestInfo.informationGainRatio)){
				bestInfo.informationGainRatio = info.informationGainRatio;
				bestInfo.cutPoint = info.cutPoint;
				bestInfo.attribute = attribute;
				bestInfo.attributeIndex = idx;
			}
		}, this);

		return bestInfo;
	};


	/**
	 * @param data								Array of data
	 * @param attributeValues				Array of attribute values
	 * @param fnExtractClassValue			Function used to extract the class value from an instance of the data array
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 *
	 * @private
	 */
	var getInformationGainRatioAndCutPoint = function(data, discreteAttribute, fnExtractClassValue, fnExtractAttributeValue){
		return (discreteAttribute?
//FIXME
//			calculateInformationGainRatio(data, attributeValues, fnExtractClassValue, fnExtractAttributeValue):
			calculateDiscreteInformationGainRatioAndCutPoint(data, fnExtractClassValue, fnExtractAttributeValue):
			calculateContinuousInformationGainRatioAndCutPoint(data, fnExtractClassValue, fnExtractAttributeValue)
		);
	};


	/**
	 * <ol>
	 *		<li>Sort the data set by increasing value of the real-valued attribute.</li>
	 * 	<li>Evaluate the midpoint between each successive pair of examples in the sorted sequence when the output class changes as a potential cut point.</li>
	 * 	<li>Select as threshold the one with best information gain or gain ratio.</li>
	 * </ol>
	 *
	 * @param data								Array of data
	 * @param fnExtractClassValue			Function used to extract the class value from an instance of the data array
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 *
	 * @see http://deepblue.lib.umich.edu/bitstream/handle/2027.42/46972/10994_2004_Article_BF00994007.pdf?sequence=1
	 * @see http://ijj.acm.org/volumes/volume2/no4/ijjvol2no4p6.pdf
	 *
	 * @private
	 */
	var calculateContinuousInformationGainRatioAndCutPoint = function(data, fnExtractClassValue, fnExtractAttributeValue){
		//extract possible values for the given attribute
		var attributeAndClassValues = [];
		data.forEach(function(instance){
			var attr = fnExtractAttributeValue(instance);
			if(attr !== undefined)
				attributeAndClassValues.push({
					attribute: attr,
					class: fnExtractClassValue(instance)
				});
		});

		//sort data set
		attributeAndClassValues.sort(function(a, b){
			return a.attribute - b.attribute;
		});

		//extract cut points to be tested
		var cutPoints = [],
			previousClass = attributeAndClassValues[0]['class'];
		attributeAndClassValues.forEach(function(value){
			//store attribute values as cut points on boundaries between class changes
			if(value['class'] != previousClass)
				cutPoints.push(value.attribute);

			previousClass = value['class'];
		});

		return calculateInformationGainRatioAndCutPoint(data, fnExtractClassValue, fnExtractAttributeValue, cutPoints,
			function(value, cutPoint){ return (value < cutPoint); });
	};


	/**
	 * Select as threshold the one with best information gain or gain ratio.
	 *
	 * @param data								Array of data
	 * @param fnExtractClassValue			Function used to extract the class value from an instance of the data array
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 *
	 * @private
	 */
	var calculateDiscreteInformationGainRatioAndCutPoint = function(data, fnExtractClassValue, fnExtractAttributeValue){
		//extract possible values for the given attribute
		var attributeValues = {};
		data.forEach(function(instance){
			instance = fnExtractAttributeValue(instance);
			if(instance !== undefined)
				attributeValues[instance] = true;
		});
		attributeValues = Object.keys(attributeValues);

		return calculateInformationGainRatioAndCutPoint(data, fnExtractClassValue, fnExtractAttributeValue, attributeValues,
			function(value, cutPoint){ return (value == cutPoint); });
	};

	/**
	 * @param data													Array of data
	 * @param fnExtractClassValue								Function used to extract the class value from an instance of the data array
	 * @param fnExtractAttributeValue						Function used to extract the attribute value from an instance of the data array
	 * @param cutPoints											Array of cut points on which to decide how the data set should be splitted
	 * @param fnEvaluateAttributeValueAgainstCutPoint	Function used to decide if a value belongs to a splitted data set or the other
	 *
	 * @private
	 */
	var calculateInformationGainRatioAndCutPoint = function(data, fnExtractClassValue, fnExtractAttributeValue, cutPoints, fnEvaluateAttributeValueAgainstCutPoint){
		var totalEntropy = calculateDiscreteEntropy(data, fnExtractClassValue),
			totalCount = data.length,
			splittedDataEQ_LT, splittedDataNE_GE,
			probability, intrinsicEntropy, conditionalEntropy, informationGainRatio,
			bestCutPoint, bestInformationGainRatio;

		//evaluate each attribute value
		cutPoints.forEach(function(cutPoint){
			//extract subsets
			splittedDataEQ_LT = [];
			splittedDataNE_GE = [];
			data.forEach(function(instance){
				if(fnEvaluateAttributeValueAgainstCutPoint(fnExtractAttributeValue(instance), cutPoint))
					splittedDataEQ_LT.push(instance);
				else
					splittedDataNE_GE.push(instance);
			});

			probability = splittedDataEQ_LT.length / totalCount;
			if(probability != 0 && probability != 1){
				intrinsicEntropy = (-probability * Math.log(probability)
					- (1 - probability) * Math.log(1 - probability)) / Math.LN2;
				conditionalEntropy = probability * calculateDiscreteEntropy(splittedDataEQ_LT, fnExtractClassValue)
					+ (1 - probability) * calculateDiscreteEntropy(splittedDataNE_GE, fnExtractClassValue);
				informationGainRatio = (totalEntropy - conditionalEntropy) / intrinsicEntropy;

				if(!bestInformationGainRatio || informationGainRatio > bestInformationGainRatio){
					bestInformationGainRatio = informationGainRatio;
					bestCutPoint = cutPoint;
				}
			}
		});

		return {
			informationGainRatio: informationGainRatio,
			cutPoint: bestCutPoint
		};
	};

	/**
	 * Entropy H(S) is a measure of the amount of uncertainty in the (data) set S (i.e. entropy characterizes the (data) set S).<p>
	 * <code>
	 * 	H(S) = -\sum_{x \in X} p(x) \log_{2} p(x)
	 * </code>
	 * Where,<p>
	 * <ul>
	 * 	<li>S is the current (data) set for which entropy is being calculated</li>
	 * 	<li>X is the set of classes in S</li>
	 * 	<li>p(x) is the proportion of the number of elements in class x to the number of elements in set S</li>
	 * </ul>
	 * <p>
	 * When H(S) = 0, the set S is perfectly classified (i.e. all elements in S are of the same class).
	 *
	 * @param data					Array of data
	 * @param fnExtractValue	Function used to extract the value from an instance of the data array
	 *
	 * @private
	 */
	var calculateDiscreteEntropy = function(data, fnExtractValue){
		//count occurrences:
		var counter = {};
		data.forEach(function(k){
			k = fnExtractValue(k);
			counter[k] = counter[k] + 1 || 1;
		});

		//calculate entropy:
		var totalCount = data.length,
			entropy = 0,
			probability;
		Object.keys(counter).forEach(function(k){
			probability = counter[k] / totalCount;

			if(probability != 0 && probability != 1)
				entropy -= probability * Math.log(probability);
		});
		entropy /= Math.LN2;

		return entropy;
	};

	/**
	 * @param data								Array of data
	 * @param attributeValues				Array of attribute values
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 * @param callback						Function called passing the splitted data array and it's probability over all the data set
	 * @return conditionalEntropy
	 *
	 * @private
	 * /
	var forEachDiscreteAttributeValueSubset = function(data, attributeValues, fnExtractAttributeValue, callback){
		var conditionalEntropy = 0,
			totalCount = data.length,
			splittedData, probability;

		attributeValues.forEach(function(attributeValue){
			//extract T
			splittedData = [];
			data.forEach(function(instance){
				if(fnExtractAttributeValue(instance) == attributeValue)
					splittedData.push(instance);
			});

			//calculate relative probability of splittedData over the entire data set
			probability = splittedData.length / totalCount;

			if(probability != 0 && probability != 1)
				conditionalEntropy += probability * callback(splittedData, probability);
		});

		return conditionalEntropy;
	};*/

	/**
	 * 	H(S|T) = \sum_{t \in T} p(t) H(S|T=t)
	 * Where,
	 * 	T is the subsets created from splitting set S by attribute A such that S = \bigcup_{t \in T} t
	 * 	H(S|T=t) is the (conditional) entropy of the variable S restricted to cases where T = t
	 * 	p(t) is the proportion of the number of elements in t to the number of elements in set S
	 * 	H(T) is the entropy of subset t
	 *
	 * @param data								Array of data
	 * @param attributeValues				Array of attribute values
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 * @param fnExtractClassValue			Function used to extract the class value from an instance of the data array
	 *
	 * @private
	 * /
	var calculateConditionalDiscreteEntropy = function(data, attributeValues, fnExtractAttributeValue, fnExtractClassValue){
		return forEachDiscreteAttributeValueSubset(data, attributeValues, fnExtractAttributeValue, function(splittedData){
			return calculateDiscreteEntropy(splittedData, fnExtractClassValue);
		});
	};*/

	/**
	 * 	H(T) = \sum_{t \in T} p(t) \log_{2} p(x)
	 * Where,
	 * 	T is the subsets created from splitting set S by attribute A such that S = \bigcup_{t \in T} t
	 * 	p(t) is the proportion of the number of elements in t to the number of elements in set S
	 * 	H(T) is the entropy of subset t
	 *
	 * @param data								Array of data
	 * @param attributeValues				Array of attribute values
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 *
	 * @private
	 * /
	var calculateIntrinsicDiscreteEntropy = function(data, attributeValues, fnExtractAttributeValue){
		return forEachDiscreteAttributeValueSubset(data, attributeValues, fnExtractAttributeValue, function(splittedData, probability){
			return -Math.log(probability);
		});
	};*/

	/**
	 * Information gain IG(A) is the measure of the difference in entropy from before to after the set S is split on an attribute A.<p>
	 * In other words, how much uncertainty in S was reduced after splitting set S on attribute A.
	 * 	IGR(A, S) = (H(S) - H(S|T)) / H(T) = (H(S) - \sum_{t \in T} p(t) H(S|T=t)) / H(T)
	 * Where,
	 * 	H(S) is the entropy of set S
	 * 	T is the subsets created from splitting set S by attribute A such that S = \bigcup_{t \in T} t
	 * 	H(S|T=t) is the (conditional) entropy of the variable S restricted to cases where T = t
	 * 	p(t) is the proportion of the number of elements in t to the number of elements in set S
	 * 	H(T) is the entropy of subset t
	 *
	 * @param data								Array of data
	 * @param attributeValues				Array of attribute values
	 * @param fnExtractClassValue			Function used to extract the class value from an instance of the data array
	 * @param fnExtractAttributeValue	Function used to extract the attribute value from an instance of the data array
	 *
	 * @private
	 * /
	var calculateInformationGainRatio = function(data, attributeValues, fnExtractClassValue, fnExtractAttributeValue){
		 var entropy = calculateDiscreteEntropy(data, fnExtractClassValue),
			conditionalEntropy = calculateConditionalDiscreteEntropy(data, attributeValues, fnExtractAttributeValue, fnExtractClassValue),
			intrinsicValue = calculateIntrinsicDiscreteEntropy(data, attributeValues, fnExtractAttributeValue);

		return {
			informationGainRatio: (entropy - conditionalEntropy) / intrinsicValue,
			cutPoint: undefined
		};
	};*/


	Constructor.prototype = {
		constructor: Constructor,

		getAttributes: function(){ return this.attributes; },
		getData: function(){ return this.data; },
		ignoreAttribute: ignoreAttribute,

		clone: clone,

		belongsToSameClass: belongsToSameClass,
		selectAttributeWithHighestGain: selectAttributeWithHighestGain
	};


	return Constructor;

});
