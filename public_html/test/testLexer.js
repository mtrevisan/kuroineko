require(['tools/data/Lexer'], function(Lexer){
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
});
