import { Color } from "../../Graphics/Color";
import { Result } from "../../Util/Result";
import { DefineFunctionToken, Token } from "../Lexical/Token";
import { ArcLeftInstruction } from "./ArcLeftInstruction";
import { ArcRightInstruction } from "./ArcRightInstruction";
import { CallFunctionInstruction } from "./CallFunctionInstruction";
import { DefineFunctionInstruction } from "./DefineFunctionInstruction";
import { Instruction } from "./Instruction";
import { MoveForwardInstruction } from "./MoveForwardInstruction";
import { PenColorInstruction } from "./PenColorInstruction";
import { PenDownInstruction } from "./PenDownInstruction";
import { PenUpInstruction } from "./PenUpInstruction";
import { Program } from "./Program";
import { TurnLeftInstruction } from "./TurnLeftInstruction";
import { TurnRightInstruction } from "./TurnRightInstruction";

export type ParseError = { token: Token; message: string; };

export class Parser {
    #tokens: Token[];
    #current: number = 0;

    constructor(tokens: Token[]) {
        this.#tokens = tokens;
    }

    public parse(): Result<Program, ParseError> {
        return this.#parseProgram();
    }

    #peek(): Token {
        return this.#tokens[this.#current];
    }

    #previous(): Token {
        return this.#tokens[this.#current - 1];
    }

    #advance(): Token {
        if (!this.#end()) {
            this.#current++;
        }

        return this.#previous();
    }

    #consume(type: Token['type'], message: string): Result<Token, ParseError> {
        if (this.#check(type)) {
            return { type: 'result', result: this.#advance() };
        } else {
            return { type: 'error', error: { token: this.#peek(), message } };
        }
    }

    #match(...types: Token['type'][]): boolean {
        for (const type of types) {
            if (this.#check(type)) {
                this.#advance();
                return true;
            }
        }

        return false;
    }

    #check(type: Token['type']): boolean {
        return this.#end()
            ? false
            : this.#peek().type === type;
    }

    #end(): boolean {
        return this.#peek().type === 'endProgram';
    }

    #parseProgram(): Result<Program, ParseError> {
        const statements: Instruction[] = [];
        while (!this.#end()) {
            const result = this.#parseInstruction();
            if (result.type === 'error') {
                return result;
            } else {
                statements.push(result.result);
            }
        }

        return { type: 'result', result: new Program(statements) };
    }

    #parseInstruction(): Result<Instruction, ParseError> {
        const token = this.#peek();
        if (token.type === 'arcLeft') {
            this.#advance();
            return { type: 'result', result: new ArcLeftInstruction(token.angle, token.radius) };
        } else if (token.type === 'arcRight') {
            this.#advance();
            return { type: 'result', result: new ArcRightInstruction(token.angle, token.radius) };
        } else if (token.type === 'callFunction') {
            this.#advance();
            return { type: 'result', result: new CallFunctionInstruction(token.name) };
        } else if (token.type === 'defineFunction') {
            return this.#parseFunction();
        } else if (token.type === 'moveForward') {
            this.#advance();
            return { type: 'result', result: new MoveForwardInstruction(token.distance) };
        } else if (token.type === 'penColor') {
            this.#advance();
            return { type: 'result', result: new PenColorInstruction(Color.fromHex(token.color)) };
        } else if (token.type === 'penDown') {
            this.#advance();
            return { type: 'result', result: new PenDownInstruction() };
        } else if (token.type === 'penUp') {
            this.#advance();
            return { type: 'result', result: new PenUpInstruction() };
        } else if (token.type === 'turnLeft') {
            this.#advance();
            return { type: 'result', result: new TurnLeftInstruction(token.angle) };
        } else if (token.type === 'turnRight') {
            this.#advance();
            return { type: 'result', result: new TurnRightInstruction(token.angle) };
        } else {
            return { type: 'error', error: { token, message: `Unexpected token type ${token.type}` } };
        }
    }

    #parseFunction(): Result<DefineFunctionInstruction, ParseError> {
        const result = this.#consume('defineFunction', 'Expected function definition');
        if (result.type === 'error') {
            return result;
        }

        const definition = result.result as DefineFunctionToken;
        const statements: Instruction[] = [];

        let token: Token;
        while ((token = this.#peek()).type !== 'endFunction') {
            const result = this.#parseInstruction();
            if (result.type === 'error') {
                return result;
            } else {
                statements.push(result.result);
            }
        }
        this.#advance();

        return { type: 'result', result: new DefineFunctionInstruction(definition.name, statements) };
    }
}
