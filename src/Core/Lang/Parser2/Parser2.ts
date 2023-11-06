import { Result } from '../../Util/Result';
import { Token2, TokenType2 } from '../Lexical/Token2';
import { AssignmentExpression, BinaryExpression, Expression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from './Expression';
import { Program2 } from './Program2';
import { BlockStatement, ExpressionStatement, IfStatement, Statement, VarStatement, WhileStatement } from './Statement';

export type ParseError = { token: Token2; message: string; };

/*
program     -> (declaration)* EOF

declaration -> varDecl | statement
varDecl     -> (LET | VAR) IDENTIFIER EQUAL expression SEMICOLON
statement   -> exprStmt | blockStmt | ifStmt | whileStmt
exprStmt    -> expression SEMICOLON
blockStmt   -> LEFT_BRACE (declaration)* RIGHT_BRACE
ifStmt      -> IF expression blockStmt (ELSE statement)?
whileStmt   -> WHILE expression blockStmt

expression  -> assignment
assignment  -> IDENTIFIER EQUAL assignment | logicalOr
logicalOr   -> logicalAnd (OR logicalAnd)*
logicalAnd  -> equality (AND equality)*
equality    -> comparison ((EQUAL_EQUAL | BANG_EQUAL) comparison)*
comparison  -> term ((LESS | LESS_EQUAL | GREATER | GREATER_EQUAL) term)*
term        -> factor ((PLUS | MINUS) factor)*
factor      -> unary ((STAR | SLASH) unary)*
unary       -> (MINUS | BANG) unary | primary
primary     -> NUMBER | COLOR | ANGLE | TRUE | FALSE | LEFT_PAREN expression RIGHT_PAREN | IDENTIFIER

let MyVar = (3 + 4) * 5;
let MyFunction = (a, b, c) => {
    ArcLeft(180, 30);
    if MyVar > 4 or MyVar <= 5 {
        PenUp();
    }
};
PenDown();
MyFunction(1, 2, 3);
AnotherFunctionToCall();
let AnotherFunctionToCall = () => {
    while my_var >= 5 {

    }
};
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
        const orResult = this.#parseLogicalOr();
        if (orResult.type === 'error') {
            return orResult;
        }

        if (this.#match('EQUAL')) {
            const equalToken = this.#previous();
            const equalityResult = this.#parseEquality();
            if (equalityResult.type === 'error') {
                return equalityResult;
            }

            if (orResult.result instanceof VariableExpression) {
                return { type: 'result', result: new AssignmentExpression(orResult.result.name, equalityResult.result) };
            }

            this.#error(equalToken, 'Invalid assignment target');
        }

        return orResult;
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

        return this.#parsePrimary();
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
        }

        return this.#parseStatement();
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
        if (this.#match('LEFT_BRACE')) {
            return this.#parseBlock();
        }

        return this.#parseExpressionStatement();
    }

    #parseBlock(): Result<Statement, ParseError> {
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
