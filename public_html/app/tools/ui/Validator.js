/**
 * @class Validator
 *
 * @author Mauro Trevisan
 */
define(['HTMLHelper', 'tools/ui/Alerter'], function(HTMLHelper, Alerter){

	/**
	 * Element attribute used to find validators
	 *
	 * @private
	 * @constant
	 */
	var validateAttribute = 'data-validate';
	/**
	 * Element attribute used to contain regex pattern for 'regex' validator
	 *
	 * @private
	 * @constant
	 */
	var validateRegexAttribute = 'pattern';


	var validateOnSubmit = function(form){
		form.addEventListener('submit', function(e){
			e.preventDefault();

			return validateForm(form);
		}, false);
	};

	/** @private */
	var validateForm = function(form){
		var valid = true;

		HTMLHelper.queryDOM('input[' + validateAttribute + ']', form).forEach(function(input){
			if(!validateInput(input))
				valid = false;
		});

		return valid;
	};

	var validateInput = function(input){
		//parse data-validation attribute
		var rules = parseString(input.getAttribute(validateAttribute), input.getAttribute(validateRegexAttribute));

		var message = validate(rules, input.value);

		var valid = true;
		if(message !== true){
			Alerter.logOnElement(input.id, message, 'error');

			valid = false;
		}
		else
			Alerter.closeLogOnElement(input.id);

		return valid;
	};

	/**
	 * Parser for strings like 'one(error message)|three.scope(wrong regexp)|five'.
	 *
	 * @private
	 */
	var parseString = function(str, regex){
		//convert string in format: "name.scope#id(message)" to object
		var rules = [],
			partialRule = '',
			cumulativeRule = '';
		(str || '').split('|').forEach(function(rule){
			//regex doc: NAME.SCOPE#ID(MSG)
			cumulativeRule = (partialRule.length? partialRule + '|': '') + rule;
			var m = cumulativeRule.match(/^(\w+)(\.(\w+))?(\#(\w+))?(\((.*)\))?$/);
			if(m && fieldRules[m[1]]){
				rule = {};
				rule.name = m[1];
				rule.scope = m[3];
				rule.id = m[5];
				rule.message = m[7];
				rule.regex = (m[1] == 'regex'? regex: undefined);
				rules.push(rule);

				partialRule = '';
				cumulativeRule = '';
			}
			else
				partialRule = cumulativeRule;
		});
		if(cumulativeRule.length){
			throw 'Invalid validate attribute: ' + cumulativeRule;
		}

		return rules;
	};

	/** @private */
	var validate = function(rules, value){
		var message = true;
		rules.some(function(rule){
			message = fieldRules[rule.name](value, rule.message, rule.regex);
			return (message !== true);
		});

		return message;
	};

	/** @private */
	var fieldRules = {
		regex: function(value, message, re){
			return (value.match(new RegExp(re))? true: message);
		},

		required: function(value, message){
			return this.regex(value, message || 'This field is required',
				/\S+/);
		},

		email: function(value, message){
			return this.regex(value, message || 'Invalid email address',
				/^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		},

		url: function(value, message){
			return this.regex(value, message || 'Invalid URL',
				/^https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/);
		},

		alphanumeric: function(value, message){
			return this.regex(value, message || 'Use digits and letters only',
				/^[0-9A-Za-z]+$/);
		},

		number: function(value, message){
			return this.regex(value, message || 'Use digits only',
				/^\d+$/);
		},

		decimal: function(value, message){
			return this.regex(value, message || 'Use digits only',
				/^\d+([.,]\d+)?$/);
		}/*,

		minAge: function(value, message, minAge){
			message = message || ('You must be at least ' + minAge);

			var minDate = new Date();
			minDate.setFullYear(minDate.getFullYear() - minAge);
			if(new Date(value) > minDate)
				return "You must be at least " + minAge;
			return true;
		}*/
	};


	return {
		validateOnSubmit: validateOnSubmit,
		validateInput: validateInput
	};

});
