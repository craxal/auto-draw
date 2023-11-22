import { RuntimeError } from './Interpreter';

export type RuntimeResult =
    | { type: 'value'; value: any; }
    | { type: 'return'; value: any; }
    | { type: 'error'; error: RuntimeError; };
