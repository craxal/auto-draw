import { Result } from "../../Util/Result";
import { Interpreter2 } from "../Interpreter/Interpreter";
import { Token } from "../Lexical/Token";
import { AssignmentExpression, BinaryExpression, CallExpression, Expression, GroupingExpression, IExpressionVisitor, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from "../Parser/Expression";
import { ParseError } from "../Parser/Parser";
import { Program2 } from "../Parser/Program";
import { BlockStatement, ExpressionStatement, FunctionStatement, IStatementVisitor, IfStatement, ReturnStatement, Statement, VarStatement, WhileStatement } from "../Parser/Statement";

type FunctionType = 'none' | 'function';

export class Resolver implements IExpressionVisitor<void>, IStatementVisitor<void> {
    #interpreter: Interpreter2;
    #scopes: Map<string, boolean>[] = [];
    #currentFunction: FunctionType = 'none';
    #errors: ParseError[] = [];

    constructor(interpreter: Interpreter2) {
        this.#interpreter = interpreter;
    }

    public resolve(program: Program2): Result<undefined, ParseError[]> {
        for (const statement of program.statements) {
            this.#resolveStatement(statement);
        }
        if (this.#errors.length > 0) {
            return { type: 'error', error: this.#errors };
        } else {
            return { type: 'result', result: undefined };
        }
    }

    public visitBlockStatement(statement: BlockStatement): void {
        this.#beginScope();
        for (const stmt of statement.statements) {
            this.#resolveStatement(stmt);
        }
        this.#endScope();
    }

    public visitExpressionStatement(statement: ExpressionStatement): void {
        this.#resolveExpression(statement.expression);
    }

    public visitFunctionStatement(statement: FunctionStatement): void {
        this.#declare(statement.name);
        this.#define(statement.name);
        this.#resolveFunction(statement, 'function');
    }

    public visitIfStatement(statement: IfStatement): void {
        this.#resolveExpression(statement.condition);
        this.#resolveStatement(statement.thenBranch);
        if (!!statement.elseBranch) {
            this.#resolveStatement(statement.elseBranch);
        }
    }

    public visitReturnStatement(statement: ReturnStatement): void {
        if (this.#currentFunction === 'none') {
            this.#errors.push({ token: statement.keyword, message: "Cannot return when not in a function." });
        }

        if (!!statement.expression) {
            this.#resolveExpression(statement.expression);
        }
    }

    public visitVarStatement(statement: VarStatement): void {
        this.#declare(statement.name);
        this.#resolveExpression(statement.initializer);
        this.#define(statement.name);
    }

    public visitWhileStatement(statement: WhileStatement): void {
        this.#resolveExpression(statement.condition);
        this.#resolveStatement(statement.body);
    }

    public visitAssignmentExpression(expression: AssignmentExpression): void {
        this.#resolveExpression(expression.value);
        this.#resolveLocal(expression, expression.name);
    }

    public visitBinaryExpression(expression: BinaryExpression): void {
        this.#resolveExpression(expression.left);
        this.#resolveExpression(expression.right);
    }

    public visitCallExpression(expression: CallExpression): void {
        this.#resolveExpression(expression.callee);

        for (const arg of expression.args) {
            this.#resolveExpression(arg);
        }
    }

    public visitGroupingExpression(expression: GroupingExpression): void {
        this.#resolveExpression(expression.expression);
    }

    public visitLogicalExpression(expression: LogicalExpression): void {
        this.#resolveExpression(expression.left);
        this.#resolveExpression(expression.right);
    }

    public visitLiteralExpression(expression: LiteralExpression): void {
        return;
    }

    public visitUnaryExpression(expression: UnaryExpression): void {
        this.#resolveExpression(expression.right);
    }

    public visitVariableExpression(expression: VariableExpression): void {
        if (this.#scopes.at(0)?.get(expression.name.lexeme) === false) {
            this.#errors.push({ token: expression.name, message: "Can't read local variable in its own initializer." });
        }

        this.#resolveLocal(expression, expression.name);
    }

    #resolveStatement(statement: Statement): void {
        statement.accept(this);
    }

    #resolveExpression(expression: Expression): void {
        expression.accept(this);
    }

    #resolveLocal(expression: Expression, name: Token): void {
        let depth = 0;
        for (const scope of this.#scopes) {
            if (scope.has(name.lexeme)) {
                this.#interpreter.resolve(expression, depth);
                return;
            }
            depth++;
        }
    }

    #resolveFunction(fn: FunctionStatement, functionType: FunctionType): void {
        const enclosingFunction = this.#currentFunction;
        this.#currentFunction = functionType;

        this.#beginScope();
        for (const param of fn.parameters) {
            this.#declare(param);
            this.#define(param);
        }
        this.#resolveStatement(fn.body);
        this.#endScope();

        this.#currentFunction = enclosingFunction;
    }

    #beginScope(): void {
        this.#scopes.unshift(new Map<string, boolean>());
    };

    #endScope(): void {
        this.#scopes.shift();
    };

    #declare(name: Token): void {
        if (this.#scopes.at(0)?.has(name.lexeme)) {
            this.#errors.push({ token: name, message: "Cannot redeclare a variable in the same scope." });
        }

        this.#scopes.at(0)?.set(name.lexeme, false);
    };

    #define(name: Token): void {
        this.#scopes.at(0)?.set(name.lexeme, true);
    }
}
