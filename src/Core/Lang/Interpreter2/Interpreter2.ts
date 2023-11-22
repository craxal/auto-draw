import { DrawContext } from '../../Graphics/DrawContext';
import { Token2 } from '../Lexical/Token2';
import { AssignmentExpression, BinaryExpression, CallExpression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from '../Parser2/Expression';
import { IProgramVisitor, Program2 } from '../Parser2/Program2';
import { BlockStatement, ExpressionStatement, FunctionStatement, IfStatement, ReturnStatement, Statement, VarStatement, WhileStatement } from '../Parser2/Statement';
import { Bool } from '../Types/Bool';
import { isAddition } from '../Types/IAddition';
import { isBitwise } from '../Types/IBitwise';
import { isComparison } from '../Types/IComparison';
import { isDivision } from '../Types/IDivision';
import { isEquality } from '../Types/IEquality';
import { isModulo } from '../Types/IModulo';
import { isMultiplication } from '../Types/IMultiplication';
import { isNegation } from '../Types/INegation';
import { isSubtraction } from '../Types/ISubtraction';
import { AutoDrawCallable, isAutoDrawCallable } from './AutoDrawCallable';
import { AutoDrawFunction } from './AutoDrawFunction';
import { Environment } from './Environment';
import { RuntimeResult } from './RuntimeResult';

export type RuntimeError = { token: Token2; message: string; };

function tryNativeFunction(operation: () => any, token: Token2): RuntimeResult {
    try {
        return { type: 'value', value: operation() };
    } catch (error) {
        return { type: 'error', error: { token, message: (error as Error).message } };
    }
}

export class Interpreter2 implements IProgramVisitor<RuntimeResult> {
    #context: DrawContext | undefined;
    #console: string[] = [];

    #environment: Environment = new Environment(undefined,
        ['ArcLeft', { arity: 2, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.arcLeft(args[0], args[1]), token); } }],
        ['ArcRight', { arity: 2, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.arcRight(args[0], args[1]), token); } }],
        ['MoveForward', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.moveForward(args[0]), token); } }],
        ['PenColor', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.setPenColor(args[0]), token); } }],
        ['PenDown', { arity: 0, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.penDown(), token); } }],
        ['PenUp', { arity: 0, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.penUp(), token); } }],
        ['TurnLeft', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.turnLeft(args[0]), token); } }],
        ['TurnRight', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { return tryNativeFunction(() => interpreter.#context?.turnRight(args[0]), token); } }],
        ['Print', { arity: 1, call(interpreter: Interpreter2, token: Token2, args: any[]) { console.log(`DEBUG >>> Printing '${args[0]}'`); return tryNativeFunction(() => interpreter.#console.push(args[0].toString()), token); } }],
    );

    constructor(context?: DrawContext) {
        this.#context = context;
    }

    public get console(): string[] { return this.#console; }
    public get environment(): Environment { return this.#environment; }

    public interpret(program: Program2): void {
        const result = program.accept(this);
        if (result.type === 'error') {
            this.#console.push(result.error.message);
        }
    }

    public executeBlock(statements: Statement[], environment: Environment): RuntimeResult {
        const previousEnvironment = this.#environment;
        this.#environment = environment;

        for (const statement of statements) {
            const result = statement.accept(this);
            if (result.type !== 'value') {
                this.#environment = previousEnvironment;
                return result;
            }
        }

        this.#environment = previousEnvironment;

        return { type: 'value', value: undefined };
    }

    public visitProgram(program: Program2): RuntimeResult {
        return this.executeBlock(program.statements, this.#environment);
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
            } else if (!(conditionResult.value instanceof Bool)) {
                // return { type: 'error', error: { token: statement.condition, message: 'Condition must evaluate to a boolean value.' } };
            } else if (!conditionResult.value.value) {
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

        const error = this.#checkOperands(expression.operator, left, right);
        if (!!error) {
            return { type: 'error', error };
        }

        switch (expression.operator.type) {
            case 'MINUS':
                if (isSubtraction(left) && isSubtraction(right)) {
                    return { type: 'value', value: left.subtract(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: "Operands cannot subtract." } };
                }
            case 'SLASH':
                if (isDivision(left) && isDivision(right)) {
                    return { type: 'value', value: left.divide(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: "Operands cannot divide." } };
                }
            case 'MOD':
                if (isModulo(left) && isModulo(right)) {
                    return { type: 'value', value: left.modulo(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: "Operands cannot modulo." } };
                }
            case 'STAR':
                if (isMultiplication(left) && isMultiplication(right)) {
                    return { type: 'value', value: left.multiply(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: "Operands cannot multiply." } };
                }
            case 'PLUS':
                if (isAddition(left) && isAddition(right)) {
                    return { type: 'value', value: left.add(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to add operands.' } };
                }
            case 'GREATER':
                if (isComparison(left) && isComparison(right)) {
                    return { type: 'value', value: left.greaterThan(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to compare operands.' } };
                }
            case 'GREATER_EQUAL':
                if (isComparison(left) && isComparison(right)) {
                    return { type: 'value', value: left.greaterThanOrEqual(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to compare operands.' } };
                }
            case 'LESS':
                if (isComparison(left) && isComparison(right)) {
                    return { type: 'value', value: left.lessThan(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to compare operands.' } };
                }
            case 'LESS_EQUAL':
                if (isComparison(left) && isComparison(right)) {
                    return { type: 'value', value: left.lessThanOrEqual(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to compare operands.' } };
                }
            case 'BANG_EQUAL':
                if (isEquality(left) && isEquality(right)) {
                    return { type: 'value', value: left.notEqual(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to compare operands.' } };
                }
            case 'EQUAL_EQUAL':
                if (isEquality(left) && isEquality(right)) {
                    return { type: 'value', value: left.equal(right) };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to compare operands.' } };
                }
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
        if (!(left.value instanceof Bool)) {
            return { type: 'error', error: { token: expression.operator, message: 'Operands must evaluate to boolean values.' } };
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

        const right = expression.right.accept(this);
        if (right.type !== 'value') {
            return right;
        }
        if (!(right.value instanceof Bool)) {
            return { type: 'error', error: { token: expression.operator, message: 'Operands must evaluate to boolean values.' } };
        }

        return right;
    }

    public visitUnaryExpression(expression: UnaryExpression): RuntimeResult {
        const rightResult = expression.right.accept(this);
        if (rightResult.type !== 'value') {
            return rightResult;
        }
        const right = rightResult.value;

        const error = this.#checkOperands(expression.operator, right);
        if (!!error) {
            return { type: 'error', error };
        }

        switch (expression.operator.type) {
            case 'MINUS':
                if (isNegation(right)) {
                    return { type: 'value', value: right.negate() };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to negate operand.' } };
                }
            case 'BANG':
                if (isBitwise(right)) {
                    return { type: 'value', value: right.not() };
                } else {
                    return { type: 'error', error: { token: expression.operator, message: 'Unable to bitwise not operand.' } };
                }
            default: return { type: 'error', error: { token: expression.operator, message: 'Unknown error' } };
        }
    }

    public visitVariableExpression(expression: VariableExpression): RuntimeResult {
        return this.#environment.get(expression.name);
    }

    #checkOperands(operator: Token2, ...operands: any[]): RuntimeError | undefined {
        if (operands.every((op) => typeof op === typeof operands[0])) {
            return;
        }

        return { token: operator, message: 'Operands must be all be of the same type' };
    }
}
