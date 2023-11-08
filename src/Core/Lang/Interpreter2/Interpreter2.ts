import { DrawContext } from '../../Graphics/DrawContext';
import { Result } from '../../Util/Result';
import { Token2 } from '../Lexical/Token2';
import { AssignmentExpression, BinaryExpression, CallExpression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from '../Parser2/Expression';
import { IProgramVisitor, Program2 } from '../Parser2/Program2';
import { BlockStatement, ExpressionStatement, FunctionStatement, IfStatement, VarStatement, WhileStatement } from '../Parser2/Statement';
import { AutoDrawCallable, isAutoDrawCallable } from './AutoDrawCallable';

export type RuntimeError = { token: Token2; message: string; };

function tryNativeFunction(operation: () => any, token: Token2): Result<any, RuntimeError> {
    try {
        return { type: 'result', result: operation() };
    } catch (error) {
        return { type: 'error', error: { token, message: (error as Error).message } }
    }
}

class Environment {
    #parent: Environment | undefined;
    #values: Map<string, any>;

    constructor(parent?: Environment, ...natives: [string, any][]) {
        this.#parent = parent;
        this.#values = new Map(natives);
    }

    public define(name: Token2, value: any): Result<void, RuntimeError> {
        if (this.#values.has(name.lexeme)) {
            return { type: 'error', error: { token: name, message: `Variable '${name.lexeme}' is already defined` } };
        }

        this.#values.set(name.lexeme, value);

        return { type: 'result', result: undefined };
    }

    public set(name: Token2, value: any): Result<void, RuntimeError> {
        if (this.#values.has(name.lexeme)) {
            this.#values.set(name.lexeme, value);

            return { type: 'result', result: value };
        }

        return this.#parent?.set(name, value) ??
            { type: 'error', error: { token: name, message: `Undefined Variable '${name.lexeme}'` } };

    }

    public get(name: Token2): Result<any, RuntimeError> {
        const value = this.#values.get(name.lexeme);
        if (value !== undefined) {
            return { type: 'result', result: value };
        }

        return this.#parent?.get(name) ??
            { type: 'error', error: { token: name, message: `Undefined variable '${name.lexeme}'` } };
    }
}

export class Interpreter2 implements IProgramVisitor<Result<any, RuntimeError>> {
    #context: DrawContext | undefined;

    #environment: Environment = new Environment(undefined,
        ['ArcLeft', { arity: 2, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.arcLeft(args[0], args[1]), token); } }],
        ['ArcRight', { arity: 2, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.arcRight(args[0], args[1]), token); } }],
        ['MoveForward', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.moveForward(args[0]), token); } }],
        ['PenColor', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.setPenColor(args[0]), token); } }],
        ['PenDown', { arity: 0, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.penDown(), token); } }],
        ['PenUp', { arity: 0, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.penUp(), token); } }],
        ['TurnLeft', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.turnLeft(args[0]), token); } }],
        ['TurnRight', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.turnRight(args[0]), token); } }],
        ['Print', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => console.log(args[0]), token); } }],
    );

    constructor(context?: DrawContext) {
        this.#context = context;
    }

    public interpret(program: Program2): void {
        const result = program.accept(this);
        if (result.type === 'error') {
            console.log(result.error.message, result.error.token);
        }
    }

    public visitProgram(program: Program2): Result<any, RuntimeError> {
        for (const statement of program.statements) {
            if (statement instanceof VarStatement) {
                const defResult = statement.accept(this);
                if (defResult.type === 'error') {
                    return defResult;
                }
            }
        }

        for (const instruction of program.statements) {
            if (!(instruction instanceof VarStatement)) {
                const instructionResult = instruction.accept(this);
                if (instructionResult.type === 'error') {
                    return instructionResult;
                }
            }
        }

        return { type: 'result', result: undefined };
    }

    public visitBlockStatement(statement: BlockStatement): Result<any, RuntimeError> {
        const previousEnvironment = this.#environment;
        this.#environment = new Environment(previousEnvironment);

        for (const stmt of statement.statements) {
            const result = stmt.accept(this);
            if (result.type == 'error') {
                return result;
            }
        }

        this.#environment = previousEnvironment;

        return { type: 'result', result: undefined };
    }

    public visitExpressionStatement(statement: ExpressionStatement): Result<any, RuntimeError> {
        return statement.expression.accept(this);
    }

    public visitFunctionStatement(statement: FunctionStatement): Result<any, RuntimeError> {
        const callable: AutoDrawCallable = {
            arity: statement.parameters.length,
            call(interpreter: Interpreter2, token: Token2, args: any[]): Result<any, RuntimeError> {
                const environment = new Environment(interpreter.#environment);
                for (let argIndex = 0; argIndex < statement.parameters.length; argIndex++) {
                    environment.define(statement.parameters[argIndex], args[argIndex]);
                }
                return interpreter.visitBlockStatement(statement.body);
            }
        };

        this.#environment.define(statement.name, callable);

        return { type: 'result', result: undefined };
    }

    public visitIfStatement(statement: IfStatement): Result<any, RuntimeError> {
        const result = !!statement.condition.accept(this);
        if (result) {
            return statement.thenBranch.accept(this);
        } else {
            return statement.elseBranch?.accept(this) ?? { type: 'result', result: undefined };
        }
    }

    public visitVarStatement(statement: VarStatement): Result<any, RuntimeError> {
        const valueResult = statement.initializer.accept(this);
        if (valueResult.type === 'error') {
            return valueResult;
        }

        return this.#environment.define(statement.name, valueResult.result);
    }

    public visitWhileStatement(statement: WhileStatement): Result<any, RuntimeError> {
        while (true) {
            const conditionResult = statement.condition.accept(this);
            if (conditionResult.type === 'error') {
                return conditionResult;
            } else if (!conditionResult.result) {
                break;
            }

            const iterationResult = statement.body.accept(this);
            if (iterationResult.type === 'error') {
                return iterationResult;
            }
        }

        return { type: 'result', result: undefined };
    }

    public visitAssignmentExpression(expression: AssignmentExpression): Result<any, RuntimeError> {
        const valueResult = expression.value.accept(this);
        if (valueResult.type === 'error') {
            return valueResult;
        }

        return this.#environment.set(expression.name, valueResult.result);
    }

    public visitBinaryExpression(expression: BinaryExpression): Result<any, RuntimeError> {
        const leftResult = expression.left.accept(this);
        if (leftResult.type === 'error') {
            return leftResult;
        }
        const left = leftResult.result;

        const rightResult = expression.right.accept(this);
        if (rightResult.type === 'error') {
            return rightResult;
        }
        const right = rightResult.result;

        switch (expression.operator.type) {
            case 'MINUS':
                const error1 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error1 ? { type: 'error', error: error1 } : { type: 'result', result: left - right };
            case 'SLASH':
                const error2 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error2 ? { type: 'error', error: error2 } : { type: 'result', result: left / right };
            case 'STAR':
                const error3 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error3 ? { type: 'error', error: error3 } : { type: 'result', result: left * right };
            case 'PLUS':
                const error4 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error4 ? { type: 'error', error: error4 } : { type: 'result', result: left + right };
            case 'GREATER':
                const error5 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error5 ? { type: 'error', error: error5 } : { type: 'result', result: left > right };
            case 'GREATER_EQUAL':
                const error6 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error6 ? { type: 'error', error: error6 } : { type: 'result', result: left >= right };
            case 'LESS':
                const error7 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error7 ? { type: 'error', error: error7 } : { type: 'result', result: left < right };
            case 'LESS_EQUAL':
                const error8 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error8 ? { type: 'error', error: error8 } : { type: 'result', result: left <= right };
            case 'BANG_EQUAL':
                const error9 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error9 ? { type: 'error', error: error9 } : { type: 'result', result: left !== right };
            case 'EQUAL_EQUAL':
                const error10 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error10 ? { type: 'error', error: error10 } : { type: 'result', result: left === right };
            default: return { type: 'error', error: { token: expression.operator, message: 'Unknown error' } };
        }
    }

    public visitCallExpression(expression: CallExpression): Result<any, RuntimeError> {
        const calleeResult = expression.callee.accept(this);
        if (calleeResult.type === 'error') {
            return calleeResult;
        }

        const args: any[] = [];
        for (const arg of expression.args) {
            const argResult = arg.accept(this);
            if (argResult.type === 'error') {
                return argResult;
            } else {
                args.push(argResult.result);
            }
        }

        if (!isAutoDrawCallable(calleeResult.result)) {
            return { type: 'error', error: { token: expression.paren, message: 'Only functions can be called.' } };
        }

        const callable = calleeResult.result as AutoDrawCallable;

        return callable.call(this, expression.paren, args);
    }

    public visitGroupingExpression(expression: GroupingExpression): Result<any, RuntimeError> {
        return expression.expression.accept(this);
    }

    public visitLiteralExpression(expression: LiteralExpression): Result<any, RuntimeError> {
        return { type: 'result', result: expression.value };
    }

    public visitLogicalExpression(expression: LogicalExpression): Result<any, RuntimeError> {
        const left = expression.left.accept(this);
        if (left.type === 'error') {
            return left;
        }

        if (expression.operator.type == 'OR') {
            if (!!left.result) {
                return left;
            }
        } else {
            if (!left.result) {
                return left;
            }
        }

        return expression.right.accept(this);
    }

    public visitUnaryExpression(expression: UnaryExpression): Result<any, RuntimeError> {
        const rightResult = expression.right.accept(this);
        if (rightResult.type === 'error') {
            return rightResult;
        }
        const right = rightResult.result;

        const error = this.#checkNumberOperands(expression.operator, right);
        if (!!error) {
            return { type: 'error', error };
        }

        switch (expression.operator.type) {
            case 'MINUS': return { type: 'result', result: -right };
            case 'BANG': return { type: 'result', result: !right };
            default: return { type: 'error', error: { token: expression.operator, message: 'Unknown error' } };
        }
    }

    public visitVariableExpression(expression: VariableExpression): Result<any, RuntimeError> {
        return this.#environment.get(expression.name);
    }

    #checkNumberOperands(operator: Token2, ...operands: any[]): RuntimeError | undefined {
        if (operands.every((op) => typeof op === 'number')) {
            return;
        }

        return { token: operator, message: 'Operands must be a number.' };
    }
}
