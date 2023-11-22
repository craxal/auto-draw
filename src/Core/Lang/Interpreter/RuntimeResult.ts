import { Value } from '../Types/Value';
import { RuntimeError } from './Interpreter';

export type RuntimeResult =
    | { type: 'value'; value: Value | undefined; }
    | { type: 'return'; value: Value | undefined; }
    | { type: 'error'; error: RuntimeError; };
