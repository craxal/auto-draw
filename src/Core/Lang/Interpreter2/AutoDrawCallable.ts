import { Result } from "../../Util/Result";
import { Interpreter2, RuntimeError } from "./Interpreter2";

export interface AutoDrawCallable {
    readonly arity: number;
    call(interpreter: Interpreter2, args: any[]): Result<any, RuntimeError>;
}

export function isAutoDrawCallable(obj: any): obj is AutoDrawCallable {
    return typeof obj?.arity === 'number' && typeof obj?.call === 'function';
}