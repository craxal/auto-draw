import { Token } from "../Lexical/Token";
import { Interpreter2 } from "./Interpreter";
import { RuntimeResult } from "./RuntimeResult";

export interface AutoDrawCallable {
    readonly arity: number;
    call(interpreter: Interpreter2, token: Token, args: any[]): RuntimeResult;
}

export function isAutoDrawCallable(obj: any): obj is AutoDrawCallable {
    return typeof obj?.arity === 'number' && typeof obj?.call === 'function';
}
