import { Token } from "../Lexical/Token";
import { FunctionStatement } from "../Parser/Statement";
import { AutoDrawCallable } from "./AutoDrawCallable";
import { Environment } from "./Environment";
import { Interpreter2 } from "./Interpreter";
import { RuntimeResult } from "./RuntimeResult";

export class AutoDrawFunction implements AutoDrawCallable {
    #declaration: FunctionStatement;
    #closure: Environment;

    constructor(declaration: FunctionStatement, closure: Environment) {
        this.#declaration = declaration;
        this.#closure = closure;
    }

    public get arity(): number { return this.#declaration.parameters.length; }

    public call(interpreter: Interpreter2, token: Token, args: any[]): RuntimeResult {
        const environment = new Environment(this.#closure);
        for (let argIndex = 0; argIndex < this.#declaration.parameters.length; argIndex++) {
            environment.define(this.#declaration.parameters[argIndex], args[argIndex]);
        }

        const execResult = interpreter.executeBlock(this.#declaration.body.statements, environment);
        if (execResult.type === 'return') {
            return { type: 'value', value: execResult.value };
        } else {
            return execResult;
        }
    }
}
