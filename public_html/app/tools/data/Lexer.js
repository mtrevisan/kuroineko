/**
 * @class Lexer
 *
 * @see https://github.com/aaditmshah/lexer/blob/master/lexer.js
 *
 * @author Mauro Trevisan
 */
define(function(){

	var Constructor = function(){
		this.rules = [];
	};


	/**
	 * Add a new rule.
	 *
	 * @param {Regex} pattern		The regular expression designating what text matches this rule. Capture will be passed to the callback function.
	 * @param {Function} action	A callback that is executed when this token is matched. This function should accept one argument: the lexeme matched.
	 */
	var addRule = function(pattern, action){
		if(!(pattern instanceof RegExp))
			throw new Error('Pattern must be an instance of RegExp or String');
		if(!isFunction(action))
			throw new Error('Expected action to be a function');

		var flags = 'g';
		if(pattern.multiline)
			flags += 'm';
		if(pattern.ignoreCase)
			flags += 'i';
		pattern = new RegExp(pattern.source, flags);

		this.rules.push({
			pattern: pattern,
			action: action
		});

		return this;
	};

	/**
	 * Processes the input stream, matching and tokenizing left to right in a single pass.
	 *
	 * @param {String} source	String to set as source and lex.
	 */
	var lex = function(source){
		if(source){
			if(!isString(source))
				throw new Error('Attempt to lex an object that is not a string');

			this.source = source;
			this.index = 0;
		}

		var match;
		while(match = scan.call(this)){
			var token = match.rule.action.call(this, match.result);
			if(token)
				return token;
		}

		if(!match)
			return undefined;
	};

	/** @private */
	var scan = function(){
		var matches = [];
		for(var rule in this.rules){
			rule = this.rules[rule];

			var pattern = rule.pattern;
			pattern.lastIndex = this.index;

			var result = pattern.exec(this.source);
			if(result)
				matches.push({
					result: result[0],
					rule: rule,
					index: result.index
				});
		}

		var match = extractMostProbable(matches);
		if(match)
			this.index = match.index + match.result.length;

		return match;
	};

	/** @private */
	var extractMostProbable = function(matches){
		matches.sort(function(a, b){
			var r = a.index - b.index;
			return (r? r: a.result.length - b.result.length);
		});

		return matches[0];
	}

	/**
	 * Sencha Touch 2.4.0's Ext.isString
	 *
	 * @private
	 */
	var isString = function(value){
		return (typeof value === 'string');
	};

	/**
	 * Sencha Touch 2.4.0's Ext.isFunction
	 *
	 * @private
	 */
	var isFunction = function(value){
		return (typeof value === 'function');
	};


	Constructor.prototype = {
		constructor: Constructor,

		addRule: addRule,
		lex: lex
	};


	return Constructor;

});
