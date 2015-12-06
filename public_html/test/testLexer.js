require(['tools/data/Lexer'], function(Lexer){
	QUnit.module('Lexer');

	QUnit.test('plain lexer', function(){
		(new Lexer())
			.addRule(/[0-9]+/, function(lexeme){
				equal(lexeme, '012');
			})
			.addRule(/[a-z]+/, function(lexeme){
				equal(lexeme, 'ab');
			})
			.lex('ab012');
	});
});
