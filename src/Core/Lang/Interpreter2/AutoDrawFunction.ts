import { Result } from "../../Util/Result";
import { Token2 } from "../Lexical/Token2";
import { FunctionStatement } from "../Parser2/Statement";
import { AutoDrawCallable } from "./AutoDrawCallable";
import { Environment } from "./Environment";
import { Interpreter2, RuntimeError } from "./Interpreter2";

export class AutoDrawFunction implements AutoDrawCallable {
    #declaration: FunctionStatement;

    constructor(declaration: FunctionStatement) {
        this.#declaration = declaration;
    }

    public get arity(): number { return this.#declaration.parameters.length; }

    public call(interpreter: Interpreter2, token: Token2, args: any[]): Result<any, RuntimeError> {
        const environment = new Environment(interpreter.environment);
        for (let argIndex = 0; argIndex < this.#declaration.parameters.length; argIndex++) {
            environment.define(this.#declaration.parameters[argIndex], args[argIndex]);
        }
        return interpreter.executeBlock(this.#declaration.body.statements, environment);
    }
}
