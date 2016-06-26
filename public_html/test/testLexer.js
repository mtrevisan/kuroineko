require(['tools/grammar/Lexer', 'tools/grammar/Token'], function(Lexer, Token){
	QUnit.module('Lexer');

	QUnit.test('plain lexer', function(assert){
		(new Lexer())
			.addRule(/[0-9]+/, function(lexeme){
				assert.equal(lexeme, '012');
			})
			.addRule(/[a-z]+/, function(lexeme){
				assert.equal(lexeme, 'ab');
			})
			.lex('ab012');
	});

	QUnit.test('sequential lexer', function(assert){
		var lexer = (new Lexer())
			.addRule(/[0-9]+/, function(lexeme){
				return new Token('numbers', lexeme);
			})
			.addRule(/[a-z]+/, function(lexeme){
				return new Token('chars', lexeme);
			});

		var token = lexer.lex('ab012');
		assert.equal(token.type, 'chars');
		assert.equal(token.value, 'ab');

		token = lexer.lex();
		assert.equal(token.type, 'numbers');
		assert.equal(token.value, '012');
	});

//	QUnit.test('parse BNF grammar', function(assert){
//		var grammar =
//			'term ::= application | LAMBDA LCID DOT term\r\n'
//			'application ::= atom application\'\r\n'
//			'application\' ::= atom application\' | ε\r\n'
//			'atom ::= LPAREN term RPAREN | LCID';
//		var lexer = (new Lexer())
//			.addRule(/LAMBDA/, function(){
//				return new Token('LAMBDA');
//			})
//			.addRule(/DOT/, function(){
//				return new Token('DOT');
//			})
//			.addRule(/LPAREN/, function(){
//				return new Token('LPAREN');
//			})
//			.addRule(/RPAREN/, function(){
//				return new Token('RPAREN');
//			})
//			.addRule(/\0/, function(){
//				return new Token('EOF');
//			})
//			.addRule(/[a-z][a-zA-Z\']*/, function(lexeme){
//				return new Token('LCID', lexeme);
//			});
//
//		var token = lexer.lex(grammar);
//		assert.equal(token.type, 'term');
//		assert.equal(token.value, 'ab');
//
//		token = lexer.lex();
//		assert.equal(token.type, 'numbers');
//		assert.equal(token.value, '012');
//	});

});
