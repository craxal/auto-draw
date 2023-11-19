import { Token2 } from '../Lexical/Token2';
import { RuntimeResult } from './RuntimeResult';

export class Environment {
    #parent: Environment | undefined;
    #values: Map<string, any>;

    constructor(parent?: Environment, ...natives: [string, any][]) {
        this.#parent = parent;
        this.#values = new Map(natives);
    }

    public define(name: Token2, value: any): RuntimeResult {
        if (this.#values.has(name.lexeme)) {
            return { type: 'error', error: { token: name, message: `Variable '${name.lexeme}' is already defined` } };
        }

        this.#values.set(name.lexeme, value);

        return { type: 'value', value: undefined };
    }

    public set(name: Token2, value: any): RuntimeResult {
        if (this.#values.has(name.lexeme)) {
            this.#values.set(name.lexeme, value);

            return { type: 'value', value };
        }

        return this.#parent?.set(name, value) ??
            { type: 'error', error: { token: name, message: `Undefined Variable '${name.lexeme}'` } };

    }

    public get(name: Token2): RuntimeResult {
        const value = this.#values.get(name.lexeme);
        if (value !== undefined) {
            return { type: 'value', value };
        }

        return this.#parent?.get(name) ??
            { type: 'error', error: { token: name, message: `Undefined variable '${name.lexeme}'` } };
    }
}
