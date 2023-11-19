import { DrawContext } from '../../Graphics/DrawContext';
import { Result } from '../../Util/Result';
import { Token2 } from '../Lexical/Token2';
import { AssignmentExpression, BinaryExpression, CallExpression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from '../Parser2/Expression';
import { IProgramVisitor, Program2 } from '../Parser2/Program2';
import { BlockStatement, ExpressionStatement, FunctionStatement, IfStatement, ReturnStatement, Statement, VarStatement, WhileStatement } from '../Parser2/Statement';
import { AutoDrawCallable, isAutoDrawCallable } from './AutoDrawCallable';
import { AutoDrawFunction } from './AutoDrawFunction';
import { Environment } from './Environment';
import { RuntimeResult } from './RuntimeResult';

export type RuntimeError = { token: Token2; message: string; };

function tryNativeFunction(operation: () => any, token: Token2): Result<any, RuntimeError> {
    try {
        return { type: 'result', result: operation() };
    } catch (error) {
        return { type: 'error', error: { token, message: (error as Error).message } }
    }
}

export class Interpreter2 implements IProgramVisitor<RuntimeResult> {
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

    public get environment(): Environment { return this.#environment; }

    public executeBlock(statements: Statement[], environment: Environment): RuntimeResult {
        const previousEnvironment = this.#environment;
        this.#environment = environment;

        for (const stmt of statements) {
            const result = stmt.accept(this);
            if (result.type == 'error') {
                return result;
            }
        }

        this.#environment = previousEnvironment;

        return { type: 'value', value: undefined };
    }

    public interpret(program: Program2): void {
        const result = program.accept(this);
        if (result.type === 'error') {
            console.log(result.error.message, result.error.token);
        }
    }

    public visitProgram(program: Program2): RuntimeResult {
        for (const statement of program.statements) {
            if (statement instanceof VarStatement) {
                const defResult = statement.accept(this);
                if (defResult.type === 'error') {
                    return defResult;
                }
            }
        }

        for (const statement of program.statements) {
            if (!(statement instanceof VarStatement)) {
                const statementResult = statement.accept(this);
                if (statementResult.type === 'error') {
                    return statementResult;
                }
            }
        }

        return { type: 'value', value: undefined };
    }

    public visitBlockStatement(statement: BlockStatement): RuntimeResult {
        return this.executeBlock(statement.statements, new Environment(this.#environment));
    }

    public visitExpressionStatement(statement: ExpressionStatement): RuntimeResult {
        return statement.expression.accept(this);
    }

    public visitFunctionStatement(statement: FunctionStatement): RuntimeResult {
        const autoDrawFunction = new AutoDrawFunction(statement, this.#environment);
        this.#environment.define(statement.name, autoDrawFunction);

        return { type: 'value', value: undefined };
    }

    public visitIfStatement(statement: IfStatement): RuntimeResult {
        const result = !!statement.condition.accept(this);
        if (result) {
            return statement.thenBranch.accept(this);
        } else {
            return statement.elseBranch?.accept(this) ?? { type: 'value', value: undefined };
        }
    }

    public visitReturnStatement(statement: ReturnStatement): RuntimeResult {
        const expressionResult = statement.expression?.accept(this);
        if (expressionResult?.type === 'error') {
            return expressionResult;
        }

        return { type: 'return', value: expressionResult?.value };
    }

    public visitVarStatement(statement: VarStatement): RuntimeResult {
        const valueResult = statement.initializer.accept(this);
        if (valueResult.type === 'error') {
            return valueResult;
        }

        return this.#environment.define(statement.name, valueResult.value);
    }

    public visitWhileStatement(statement: WhileStatement): RuntimeResult {
        while (true) {
            const conditionResult = statement.condition.accept(this);
            if (conditionResult.type !== 'value') {
                return conditionResult;
            } else if (!conditionResult.value) {
                break;
            }

            const iterationResult = statement.body.accept(this);
            if (iterationResult.type !== 'value') {
                return iterationResult;
            }
        }

        return { type: 'value', value: undefined };
    }

    public visitAssignmentExpression(expression: AssignmentExpression): RuntimeResult {
        const valueResult = expression.value.accept(this);
        if (valueResult.type !== 'value') {
            return valueResult;
        }

        return this.#environment.set(expression.name, valueResult.value);
    }

    public visitBinaryExpression(expression: BinaryExpression): RuntimeResult {
        const leftResult = expression.left.accept(this);
        if (leftResult.type !== 'value') {
            return leftResult;
        }
        const left = leftResult.value;

        const rightResult = expression.right.accept(this);
        if (rightResult.type !== 'value') {
            return rightResult;
        }
        const right = rightResult.value;

        switch (expression.operator.type) {
            case 'MINUS':
                const error1 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error1 ? { type: 'error', error: error1 } : { type: 'value', value: left - right };
            case 'SLASH':
                const error2 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error2 ? { type: 'error', error: error2 } : { type: 'value', value: left / right };
            case 'STAR':
                const error3 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error3 ? { type: 'error', error: error3 } : { type: 'value', value: left * right };
            case 'PLUS':
                const error4 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error4 ? { type: 'error', error: error4 } : { type: 'value', value: left + right };
            case 'GREATER':
                const error5 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error5 ? { type: 'error', error: error5 } : { type: 'value', value: left > right };
            case 'GREATER_EQUAL':
                const error6 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error6 ? { type: 'error', error: error6 } : { type: 'value', value: left >= right };
            case 'LESS':
                const error7 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error7 ? { type: 'error', error: error7 } : { type: 'value', value: left < right };
            case 'LESS_EQUAL':
                const error8 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error8 ? { type: 'error', error: error8 } : { type: 'value', value: left <= right };
            case 'BANG_EQUAL':
                const error9 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error9 ? { type: 'error', error: error9 } : { type: 'value', value: left !== right };
            case 'EQUAL_EQUAL':
                const error10 = this.#checkNumberOperands(expression.operator, left, right);
                return !!error10 ? { type: 'error', error: error10 } : { type: 'value', value: left === right };
            default: return { type: 'error', error: { token: expression.operator, message: 'Unknown error' } };
        }
    }

    public visitCallExpression(expression: CallExpression): RuntimeResult {
        const calleeResult = expression.callee.accept(this);
        if (calleeResult.type !== 'value') {
            return calleeResult;
        }

        const args: any[] = [];
        for (const arg of expression.args) {
            const argResult = arg.accept(this);
            if (argResult.type !== 'value') {
                return argResult;
            } else {
                args.push(argResult.value);
            }
        }

        if (!isAutoDrawCallable(calleeResult.value)) {
            return { type: 'error', error: { token: expression.paren, message: 'Only functions can be called.' } };
        }

        const callable = calleeResult.value as AutoDrawCallable;

        return callable.call(this, expression.paren, args);
    }

    public visitGroupingExpression(expression: GroupingExpression): RuntimeResult {
        return expression.expression.accept(this);
    }

    public visitLiteralExpression(expression: LiteralExpression): RuntimeResult {
        return { type: 'value', value: expression.value };
    }

    public visitLogicalExpression(expression: LogicalExpression): RuntimeResult {
        const left = expression.left.accept(this);
        if (left.type !== 'value') {
            return left;
        }

        if (expression.operator.type == 'OR') {
            if (!!left.value) {
                return left;
            }
        } else {
            if (!left.value) {
                return left;
            }
        }

        return expression.right.accept(this);
    }

    public visitUnaryExpression(expression: UnaryExpression): RuntimeResult {
        const rightResult = expression.right.accept(this);
        if (rightResult.type !== 'value') {
            return rightResult;
        }
        const right = rightResult.value;

        const error = this.#checkNumberOperands(expression.operator, right);
        if (!!error) {
            return { type: 'error', error };
        }

        switch (expression.operator.type) {
            case 'MINUS': return { type: 'value', value: -right };
            case 'BANG': return { type: 'value', value: !right };
            default: return { type: 'error', error: { token: expression.operator, message: 'Unknown error' } };
        }
    }

    public visitVariableExpression(expression: VariableExpression): RuntimeResult {
        return this.#environment.get(expression.name);
    }

    #checkNumberOperands(operator: Token2, ...operands: any[]): RuntimeError | undefined {
        if (operands.every((op) => typeof op === 'number')) {
            return;
        }

        return { token: operator, message: 'Operands must be a number.' };
    }
}
