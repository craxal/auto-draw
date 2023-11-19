import { Result } from '../../Util/Result';
import { Token2, TokenType2 } from '../Lexical/Token2';
import { AssignmentExpression, BinaryExpression, CallExpression, Expression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from './Expression';
import { Program2 } from './Program2';
import { BlockStatement, ExpressionStatement, FunctionStatement, IfStatement, ReturnStatement, Statement, VarStatement, WhileStatement } from './Statement';

export type ParseError = { token: Token2; message: string; };

/*
program     -> (declaration)* EOF

declaration -> funcDecl | varDecl | statement
funDecl     -> FUNC function
function    -> IDENTIFIER LEFT_PAREN parameters? RIGHT_PAREN blockStmt
parameters  -> IDENTIFIER (COMMA IDENTIFIER)*
varDecl     -> (LET | VAR) IDENTIFIER EQUAL expression SEMICOLON
statement   -> exprStmt | blockStmt | ifStmt | whileStmt | returnStmt
exprStmt    -> expression SEMICOLON
blockStmt   -> LEFT_BRACE (declaration)* RIGHT_BRACE
ifStmt      -> IF expression blockStmt (ELSE statement)?
whileStmt   -> WHILE expression blockStmt
returnStmt  -> RETURN expression? SEMICOLON

expression  -> assignment
assignment  -> IDENTIFIER EQUAL assignment | logicalOr
logicalOr   -> logicalAnd (OR logicalAnd)*
logicalAnd  -> equality (AND equality)*
equality    -> comparison ((EQUAL_EQUAL | BANG_EQUAL) comparison)*
comparison  -> term ((LESS | LESS_EQUAL | GREATER | GREATER_EQUAL) term)*
term        -> factor ((PLUS | MINUS) factor)*
factor      -> unary ((STAR | SLASH) unary)*
unary       -> (MINUS | BANG) unary | call
call        -> primary (LEFT_PAREN arguments RIGHT_PAREN)*
arguments   -> expression (COMMA expression)*
primary     -> LEFT_PAREN expression RIGHT_PAREN | NUMBER | COLOR | ANGLE | TRUE | FALSE | IDENTIFIER
*/
export class Parser {
    #tokens: Token2[];
    #current: number = 0;
    #errors: ParseError[] = [];

    constructor(tokens: Token2[]) {
        this.#tokens = tokens;
    }

    public parse(): Result<Program2, ParseError[]> {
        const result = this.#parseProgram();
        if (result.type === 'error') {
            return { type: 'error', error: [result.error] };
        } else if (this.#errors.length > 0) {
            return { type: 'error', error: this.#errors };
        } else {
            return result;
        }
    }

    #parseProgram(): Result<Program2, ParseError> {
        const statements: Statement[] = [];
        while (!this.#end()) {
            const result = this.#parseDeclaration();
            if (result.type === 'error') {
                continue;
            } else if (!!result.result) {
                statements.push(result.result);
            }
        }

        return { type: 'result', result: new Program2(statements) };
    }

    #parseExpression(): Result<Expression, ParseError> {
        return this.#parseAssignment();
    }

    #parseAssignment(): Result<Expression, ParseError> {
        const functionResult = this.#parseLogicalOr();
        if (functionResult.type === 'error') {
            return functionResult;
        }

        if (this.#match('EQUAL')) {
            const equalToken = this.#previous();
            const equalityResult = this.#parseAssignment();
            if (equalityResult.type === 'error') {
                return equalityResult;
            }

            if (functionResult.result instanceof VariableExpression) {
                return { type: 'result', result: new AssignmentExpression(functionResult.result.name, equalityResult.result) };
            }

            this.#error(equalToken, 'Invalid assignment target');
        }

        return functionResult;
    }

    #parseLogicalOr(): Result<Expression, ParseError> {
        const result = this.#parseLogicalAnd();
        if (result.type === 'error') {
            return result;
        }

        let expression = result.result;
        while (this.#match('OR')) {
            const operator = this.#previous();

            const right = this.#parseLogicalAnd();
            if (right.type === 'error') {
                return right;
            } else {
                expression = new LogicalExpression(expression, operator, right.result);
            }
        }

        return { type: 'result', result: expression };
    }

    #parseLogicalAnd(): Result<Expression, ParseError> {
        const result = this.#parseEquality();
        if (result.type === 'error') {
            return result;
        }

        let expression = result.result;
        while (this.#match('AND')) {
            const operator = this.#previous();

            const right = this.#parseEquality();
            if (right.type === 'error') {
                return right;
            } else {
                expression = new LogicalExpression(expression, operator, right.result);
            }
        }

        return { type: 'result', result: expression };
    }

    #parseEquality(): Result<Expression, ParseError> {
        const result = this.#parseComparison();
        if (result.type === 'error') {
            return result;
        }

        let expression = result.result;
        while (this.#match('BANG_EQUAL', 'EQUAL_EQUAL')) {
            const operator = this.#previous();

            const right = this.#parseComparison();
            if (right.type === 'error') {
                return right;
            } else {
                expression = new BinaryExpression(expression, operator, right.result);
            }
        }

        return { type: 'result', result: expression };
    }

    #parseComparison(): Result<Expression, ParseError> {
        const result = this.#parseTerm();
        if (result.type === 'error') {
            return result;
        }

        let expression = result.result;
        while (this.#match('GREATER', 'GREATER_EQUAL', 'LESS', 'LESS_EQUAL')) {
            const operator = this.#previous();

            const right = this.#parseTerm();
            if (right.type === 'error') {
                return right;
            } else {
                expression = new BinaryExpression(expression, operator, right.result);
            }
        }

        return { type: 'result', result: expression };
    }

    #parseTerm(): Result<Expression, ParseError> {
        const result = this.#parseFactor();
        if (result.type === 'error') {
            return result;
        }

        let expression = result.result;
        while (this.#match('MINUS', 'PLUS')) {
            const operator = this.#previous();

            const right = this.#parseFactor();
            if (right.type === 'error') {
                return right;
            } else {
                expression = new BinaryExpression(expression, operator, right.result);
            }
        }

        return { type: 'result', result: expression };
    }

    #parseFactor(): Result<Expression, ParseError> {
        let result = this.#parseUnary();
        if (result.type === 'error') {
            return result;
        }

        let expression = result.result;
        while (this.#match('SLASH', 'STAR')) {
            const operator = this.#previous();

            const right = this.#parseUnary();
            if (right.type === 'error') {
                return right;
            } else {
                expression = new BinaryExpression(expression, operator, right.result);
            }
        }

        return { type: 'result', result: expression };
    }

    #parseUnary(): Result<Expression, ParseError> {
        if (this.#match('BANG', 'MINUS')) {
            const operator = this.#previous();
            const right = this.#parseUnary();
            if (right.type === 'error') {
                return right;
            } else {
                return { type: 'result', result: new UnaryExpression(operator, right.result) };
            }
        }

        return this.#parseCall();
    }

    #parseCall(): Result<Expression, ParseError> {
        let expression = this.#parsePrimary();
        if (expression.type === 'error') {
            return expression;
        }

        while (true) {
            if (this.#match('LEFT_PAREN')) {
                expression = this.#finishCall(expression.result);
                if (expression.type === 'error') {
                    return expression;
                }
            } else {
                break;
            }
        }

        return expression;
    }

    #finishCall(callee: Expression): Result<Expression, ParseError> {
        const args: Expression[] = [];
        if (!this.#check('RIGHT_PAREN')) {
            do {
                const expressionResult = this.#parseExpression();
                if (expressionResult.type === 'error') {
                    return expressionResult;
                } else {
                    args.push(expressionResult.result);
                }
            } while (this.#match('COMMA'));
        }

        const parenResult = this.#consume('RIGHT_PAREN', 'Expected ")" after arguments.');
        if (parenResult.type === 'error') {
            return parenResult;
        }

        return { type: 'result', result: new CallExpression(callee, parenResult.result, args) };
    }

    #parsePrimary(): Result<Expression, ParseError> {
        if (this.#match('FALSE')) {
            return { type: 'result', result: new LiteralExpression(false) };
        }
        if (this.#match('TRUE')) {
            return { type: 'result', result: new LiteralExpression(true) };
        }
        if (this.#match('NUMBER') || this.#match('COLOR') || this.#match('ANGLE')) {
            return { type: 'result', result: new LiteralExpression(this.#previous().literal) };
        }

        if (this.#match('LEFT_PAREN')) {
            const expression = this.#parseExpression();
            if (expression.type === 'error') {
                return expression;
            }

            const result = this.#consume('RIGHT_PAREN', 'Expected ")" after expression.');
            if (result.type === 'error') {
                return result;
            } else {
                return { type: 'result', result: new GroupingExpression(expression.result) };
            }
        }

        if (this.#match('IDENTIFIER')) {
            return { type: 'result', result: new VariableExpression(this.#previous()) };
        }

        return { type: 'error', error: this.#error(this.#peek(), 'Invalid expression.') };
    }

    #parseDeclaration(): Result<Statement | undefined, ParseError> {
        if (this.#match('LET') || this.#match('VAR')) {
            const result = this.#parseVarDeclaration();
            if (result.type === 'error') {
                this.#synchronize();
                return { type: 'result', result: undefined };
            } else {
                return result;
            }
        } else if (this.#match('FUNC')) {
            const result = this.#parseFunction();
            if (result.type === 'error') {
                this.#synchronize();
                return { type: 'result', result: undefined };
            } else {
                return result;
            }
        }

        const result = this.#parseStatement();
        if (result.type === 'error') {
            this.#synchronize();
            return { type: 'result', result: undefined };
        } else {
            return result;
        }
    }

    #parseFunction(): Result<Statement, ParseError> {
        const nameResult = this.#consume('IDENTIFIER', 'Expected function name.');
        if (nameResult.type === 'error') {
            return nameResult;
        }

        const leftParenResult = this.#consume('LEFT_PAREN', 'Expected "(" after function name.');
        if (leftParenResult.type === 'error') {
            return leftParenResult;
        }

        const parameters: Token2[] = [];
        if (!this.#check('RIGHT_PAREN')) {
            do {
                const param = this.#consume('IDENTIFIER', 'Expected parameter.');
                if (param.type === 'error') {
                    return param;
                }

                parameters.push(param.result);
            } while (this.#match('COMMA'));
        }

        const parenResult = this.#consume('RIGHT_PAREN', 'Expected ")" after parameters.');
        if (parenResult.type === 'error') {
            return parenResult;
        }

        // const arrowResult = this.#consume('ARROW', 'Expected "=>" after parameters.');
        // if (arrowResult.type === 'error') {
        //     return arrowResult;
        // }

        const braceResult = this.#consume('LEFT_BRACE', 'Expected block to follow parameters.');
        if (braceResult.type === 'error') {
            return braceResult;
        }

        const bodyResult = this.#parseBlock();
        if (bodyResult.type === 'error') {
            return bodyResult;
        }

        return { type: 'result', result: new FunctionStatement(nameResult.result, parameters, bodyResult.result) };

    }

    #parseIfStatement(): Result<Statement, ParseError> {
        const condition = this.#parseExpression();
        if (condition.type === 'error') {
            return condition;
        }

        const blockResult = this.#consume('LEFT_BRACE', 'Expected block to follow conditional');
        if (blockResult.type === 'error') {
            return blockResult;
        }

        const thenBranch = this.#parseBlock();
        if (thenBranch.type === 'error') {
            return thenBranch;
        }

        let elseBranch: Result<Statement, ParseError> | undefined;
        if (this.#match('ELSE')) {
            elseBranch = this.#parseStatement();
        }
        if (elseBranch?.type === 'error') {
            return elseBranch;
        }

        return { type: 'result', result: new IfStatement(condition.result, thenBranch.result, elseBranch?.result) };
    }

    #parseVarDeclaration(): Result<Statement, ParseError> {
        const name = this.#consume('IDENTIFIER', 'Expected variable name.');
        if (name.type === 'error') {
            return name;
        }

        this.#consume('EQUAL', 'Expected variable initialization after declaration.');
        const initializer = this.#parseExpression();
        if (initializer.type === 'error') {
            return initializer;
        }

        const semicolon = this.#consume('SEMICOLON', 'Expected ";" after variable declaration.');
        if (semicolon.type === 'error') {
            return semicolon;
        }

        return { type: 'result', result: new VarStatement(name.result, initializer.result) };
    }

    #parseStatement(): Result<Statement, ParseError> {
        if (this.#match('IF')) {
            return this.#parseIfStatement();
        }
        if (this.#match('WHILE')) {
            return this.#parseWhileStatement();
        }
        if (this.#match('RETURN')) {
            return this.#parseReturnStatement();
        }
        if (this.#match('LEFT_BRACE')) {
            return this.#parseBlock();
        }

        return this.#parseExpressionStatement();
    }

    #parseBlock(): Result<BlockStatement, ParseError> {
        const statements: Statement[] = [];

        while (!this.#check('RIGHT_BRACE') && !this.#end()) {
            const declaration = this.#parseDeclaration();
            if (declaration.type === 'error') {
                return declaration;
            } else if (!!declaration.result) {
                statements.push(declaration.result);
            }
        }

        const brace = this.#consume('RIGHT_BRACE', 'Expected "}" after block.');
        if (brace.type === 'error') {
            return brace;
        }

        return { type: 'result', result: new BlockStatement(statements) };
    }

    #parseExpressionStatement(): Result<Statement, ParseError> {
        const result = this.#parseExpression();
        if (result.type === 'error') {
            return result;
        }

        const semicolon = this.#consume('SEMICOLON', 'Expected ";" after expression.');
        if (semicolon.type === 'error') {
            return semicolon;
        }

        return { type: 'result', result: new ExpressionStatement(result.result) };
    }

    #parseReturnStatement(): Result<Statement, ParseError> {
        const keyword = this.#previous();

        let value: Expression | undefined;
        if (!this.#check('SEMICOLON')) {
            const expressionResult = this.#parseExpression();
            if (expressionResult.type === 'error') {
                return expressionResult;
            } else {
                value = expressionResult.result;
            }
        }

        this.#consume('SEMICOLON', 'Expected ";" after return value.');
        return { type: 'result', result: new ReturnStatement(keyword, value) };
    }

    #parseWhileStatement(): Result<Statement, ParseError> {
        const condition = this.#parseExpression();
        if (condition.type === 'error') {
            return condition;
        }

        const blockResult = this.#consume('LEFT_BRACE', 'Expected block to follow conditional');
        if (blockResult.type === 'error') {
            return blockResult;
        }

        const body = this.#parseBlock();
        if (body.type === 'error') {
            return body;
        }

        return { type: 'result', result: new WhileStatement(condition.result, body.result) };
    }

    #end(): boolean {
        return this.#peek().type === 'EOF';
    }

    #peek(): Token2 {
        return this.#tokens[this.#current];
    }

    #previous(): Token2 {
        return this.#tokens[this.#current - 1];
    }

    #check(type: TokenType2): boolean {
        return !this.#end() && this.#peek().type === type;
    }

    #advance(): Token2 {
        if (!this.#end()) {
            this.#current++;
        }

        return this.#previous();
    }

    #match(...types: TokenType2[]): boolean {
        for (const type of types) {
            if (this.#check(type)) {
                this.#advance();
                return true;
            }
        }

        return false;
    }

    #consume(type: TokenType2, message: string): Result<Token2, ParseError> {
        if (this.#check(type)) {
            return { type: 'result', result: this.#advance() };
        } else {
            return { type: 'error', error: this.#error(this.#peek(), message) };
        }
    }

    #error(token: Token2, message: string): ParseError {
        const error: ParseError = { token, message };
        this.#errors.push(error);
        return error;
    }

    #synchronize() {
        this.#advance();

        while (!this.#end()) {
            if (this.#previous().type == 'SEMICOLON') { return; }

            switch (this.#peek().type) {
                case 'VAR':
                case 'LET':
                case 'IF':
                case 'WHILE':
                    return;
            }

            this.#advance();
        }
    }
}
