define(['tools/data/Lexer'], function(Lexer){
	describe('Lexer', function(){
		it('plain lexer', function(){
			expect(Lexer).toBeDefined();

			(new Lexer())
				.addRule(/[0-9]+/, function(lexeme){
					expect(lexeme).toBe('012');
				})
				.addRule(/[a-z]+/, function(lexeme){
					expect(lexeme).toBe('ab');
				})
				.lex('ab012');
		});
	});
});
