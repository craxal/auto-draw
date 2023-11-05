import { Angle } from '../../Graphics/Angle';
import { Color } from '../../Graphics/Color';
import { Result } from '../../Util/Result';
import { AssignmentExpression, BinaryExpression, GroupingExpression, LiteralExpression, LogicalExpression, UnaryExpression, VariableExpression } from '../Parser2/Expression';
import { IProgramVisitor, Program2 } from '../Parser2/Program2';
import { BlockStatement, ExpressionStatement, IfStatement, VarStatement } from '../Parser2/Statement';

type RuntimeError = { message: string };

class Environment {
    #parent: Environment | undefined;
    #values: Map<string, any>;

    constructor(parent?: Environment, ...natives: [string, any][]) {
        this.#parent = parent;
        this.#values = new Map(natives);
    }

    public define(name: string, value: any): Result<void, RuntimeError> {
        if (this.#values.has(name)) {
            return { type: 'error', error: { message: `Variable '${name}' is already defined` } };
        }

        this.#values.set(name, value);

        return { type: 'result', result: undefined };
    }

    public set(name: string, value: any): Result<void, RuntimeError> {
        if (this.#values.has(name)) {
            this.#values.set(name, value);

            return { type: 'result', result: value };
        }

        return this.#parent?.set(name, value) ??
            { type: 'error', error: { message: `Undefined Variable '${name}'` } };

    }

    public get(name: string): Result<any, RuntimeError> {
        const value = this.#values.get(name);
        if (!!value) {
            return { type: 'result', result: this };
        }

        return this.#parent?.get(name) ??
            { type: 'error', error: { message: `Undefined variable '${name}'` } };
    }
}

export class Interpreter2 implements IProgramVisitor<Result<void, RuntimeError>, Result<void, RuntimeError>, any>{
    #environment: Environment = new Environment(undefined,
        ['ArcLeft', (angle: Angle, radius: number) => { }],
        ['ArcRight', (angle: Angle, radius: number) => { }],
        ['MoveForward', (distance: number) => { }],
        ['PenColor', (color: Color) => { }],
        ['PenDown', () => { }],
        ['PenUp', () => { }],
        ['TurnLeft', (angle: Angle) => { }],
        ['TurnRight', (angle: Angle) => { }],
    );

    public interpret(program: Program2): void {
        // Hoist function declarations to avoid problems fo calling a function before it's declared.
        for (const statement of program.statements) {
            statement.accept(this);
        }
    }

    public visitProgram(program: Program2): Result<void, RuntimeError> {
        throw new Error('Method not implemented.');
    }

    public visitBlockStatement(statement: BlockStatement): Result<void, RuntimeError> {
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

    public visitExpressionStatement(statement: ExpressionStatement): Result<void, RuntimeError> {
        statement.expression.accept(this);

        return { type: 'result', result: undefined };
    }

    public visitIfStatement(statement: IfStatement): Result<void, RuntimeError> {
        const result = !!statement.condition.accept(this);
        if (result) {
            return statement.thenBranch.accept(this);
        } else {
            return statement.elseBranch?.accept(this) ?? { type: 'result', result: undefined };
        }
    }

    public visitVarStatement(statement: VarStatement): Result<void, RuntimeError> {
        const value = statement.initializer.accept(this);
        return this.#environment.define(statement.name.lexeme, value);
    }

    public visitAssignmentExpression(expression: AssignmentExpression): any {
        const value = expression.value.accept(this);
        this.#environment.set(expression.name.lexeme, value);
    }

    public visitBinaryExpression(expression: BinaryExpression): any {
        const left: any = expression.left.accept(this);
        const right: any = expression.right.accept(this);

        switch (expression.operator.type) {
            case 'MINUS': return left - right;
            case 'SLASH': return left / right;
            case 'STAR': return left * right;
            case 'PLUS': return left + right;
            case 'GREATER': return left > right;
            case 'GREATER_EQUAL': return left >= right;
            case 'LESS': return left < right;
            case 'LESS_EQUAL': return left <= right;
            case 'BANG_EQUAL': return left !== right;
            case 'EQUAL_EQUAL': return left === right;
        }
    }

    public visitGroupingExpression(expression: GroupingExpression): any {
        throw new Error('Method not implemented.');
    }

    public visitLiteralExpression(expression: LiteralExpression): any {
        return expression.value;
    }

    public visitLogicalExpression(expression: LogicalExpression): any {
        const left: boolean = !!expression.left.accept(this);

        if (expression.operator.type == 'OR') {
            if (left) {
                return left;
            }
        } else {
            if (!left) {
                return left;
            }
        }

        return !!expression.right.accept(this);
    }

    public visitUnaryExpression(expression: UnaryExpression): any {
        const right: any = expression.right.accept(this);

        switch (expression.operator.type) {
            case 'MINUS': return -right;
            case 'BANG': return !right;
        }
    }

    public visitVariableExpression(expression: VariableExpression) {
        return this.#environment.get(expression.name.lexeme);
    }
}
