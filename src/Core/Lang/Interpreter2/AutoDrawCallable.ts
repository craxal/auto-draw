import { Token2 } from "../Lexical/Token2";
import { Interpreter2 } from "./Interpreter2";
import { RuntimeResult } from "./RuntimeResult";

export interface AutoDrawCallable {
    readonly arity: number;
    call(interpreter: Interpreter2, token: Token2, args: any[]): RuntimeResult;
}

export function isAutoDrawCallable(obj: any): obj is AutoDrawCallable {
    return typeof obj?.arity === 'number' && typeof obj?.call === 'function';
}