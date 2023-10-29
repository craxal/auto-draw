export type Result<T, E> =
    | { type: 'result', result: T }
    | { type: 'error', error: E }
    ;