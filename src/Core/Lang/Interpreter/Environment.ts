import { Token } from '../Lexical/Token';
import { Value } from '../Types/Value';
import { RuntimeResult } from './RuntimeResult';

export class Environment {
    #parent: Environment | undefined;
    #values: Map<string, { value: Value, immutable: boolean; }>;

    constructor(parent?: Environment, ...natives: [string, any][]) {
        this.#parent = parent;
        this.#values = new Map(natives);
    }

    public define(name: Token, value: Value, immutable: boolean = false): RuntimeResult {
        if (this.#values.has(name.lexeme)) {
            return { type: 'error', error: { token: name, message: `Variable '${name.lexeme}' is already defined` } };
        }

        this.#values.set(name.lexeme, { value, immutable });

        return { type: 'value', value: undefined };
    }

    public set(name: Token, value: Value): RuntimeResult {
        const currentValue = this.#values.get(name.lexeme);
        if (!!currentValue) {
            if (currentValue.immutable) {
                return { type: 'error', error: { token: name, message: `Variable '${name.lexeme}' is immutable` } };
            }

            this.#values.set(name.lexeme, { value, immutable: false });

            return { type: 'value', value };
        }

        return this.#parent?.set(name, value) ??
            { type: 'error', error: { token: name, message: `Undefined Variable '${name.lexeme}'` } };
    }

    public setAt(distance: number, name: Token, value: any): RuntimeResult {
        return this.ancestor(distance).set(name, value);
    }

    public get(name: Token): RuntimeResult {
        const value = this.#values.get(name.lexeme);
        if (value !== undefined) {
            return { type: 'value', value };
        }

        return this.#parent?.get(name) ??
            { type: 'error', error: { token: name, message: `Undefined variable '${name.lexeme}'` } };
    }

    public getAt(distance: number, name: Token): RuntimeResult {
        return this.ancestor(distance).get(name);
    }

    private ancestor(distance: number): Environment {
        if (distance === 0) {
            return this;
        } else {
            return this.#parent?.ancestor(distance - 1) ?? this;
        }
    }
}
